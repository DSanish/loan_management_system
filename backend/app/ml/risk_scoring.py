from decimal import Decimal
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import RiskAssessment, Customer, Loan
from app.repositories.loan_repository import LoanRepository
from app.repositories.customer_repository import CustomerRepository
from app.core.logging import get_logger

logger = get_logger(__name__)

RISK_GRADES = {
    (90, 100): ("A+", "Excellent", "APPROVE"),
    (80, 90):  ("A",  "Very Good", "APPROVE"),
    (70, 80):  ("B+", "Good",      "APPROVE"),
    (60, 70):  ("B",  "Average",   "CONDITIONAL"),
    (50, 60):  ("C+", "Below Avg", "CONDITIONAL"),
    (40, 50):  ("C",  "Poor",      "REVIEW"),
    (30, 40):  ("D",  "Very Poor", "REJECT"),
    (0,  30):  ("E",  "High Risk", "REJECT"),
}


def get_risk_grade(score: float):
    for (low, high), (grade, label, rec) in RISK_GRADES.items():
        if low <= score < high:
            return grade, label, rec
    return "E", "High Risk", "REJECT"


class RiskScoringService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.loan_repo = LoanRepository(db)
        self.customer_repo = CustomerRepository(db)

    def _credit_score_component(self, credit_score: Optional[int]) -> float:
        if not credit_score:
            return 30.0
        if credit_score >= 800:
            return 100.0
        elif credit_score >= 750:
            return 85.0
        elif credit_score >= 700:
            return 70.0
        elif credit_score >= 650:
            return 55.0
        elif credit_score >= 600:
            return 40.0
        else:
            return 20.0

    def _income_debt_ratio_component(self, monthly_income: Optional[Decimal], emi: Optional[Decimal]) -> float:
        if not monthly_income or not emi or monthly_income == 0:
            return 40.0
        ratio = float(emi) / float(monthly_income)
        if ratio <= 0.20:
            return 100.0
        elif ratio <= 0.30:
            return 80.0
        elif ratio <= 0.40:
            return 60.0
        elif ratio <= 0.50:
            return 40.0
        else:
            return 20.0

    def _ltv_component(self, loan_amount: Decimal, collateral_value: Optional[Decimal]) -> float:
        if not collateral_value or collateral_value == 0:
            return 60.0
        ratio = float(loan_amount) / float(collateral_value)
        if ratio <= 0.50:
            return 100.0
        elif ratio <= 0.70:
            return 80.0
        elif ratio <= 0.80:
            return 60.0
        elif ratio <= 0.90:
            return 40.0
        else:
            return 20.0

    def _employment_component(self, employment_type) -> float:
        from app.models.models import EmploymentType
        mapping = {
            EmploymentType.SALARIED: 90.0,
            EmploymentType.BUSINESS_OWNER: 75.0,
            EmploymentType.SELF_EMPLOYED: 65.0,
            EmploymentType.RETIRED: 70.0,
            EmploymentType.UNEMPLOYED: 10.0,
        }
        return mapping.get(employment_type, 50.0)

    def _payment_history_component(self, total_loans: int, defaulted: int) -> float:
        if total_loans == 0:
            return 60.0
        default_rate = defaulted / total_loans
        if default_rate == 0:
            return 100.0
        elif default_rate <= 0.05:
            return 75.0
        elif default_rate <= 0.10:
            return 50.0
        else:
            return 20.0

    async def assess_risk(self, loan_id: int, assessed_by_id: int) -> RiskAssessment:
        loan = await self.loan_repo.get_with_details(loan_id)
        if not loan:
            raise ValueError("Loan not found")

        customer = loan.customer
        customer_stats = await self.customer_repo.get_with_loan_stats(customer.id)

        # Fetch defaulted loan count
        from sqlalchemy import select, func
        from app.models.models import LoanStatus as LS
        defaulted_result = await self.db.execute(
            select(func.count()).where(
                (Loan.customer_id == customer.id) &
                (Loan.status == LS.DEFAULTED)
            )
        )
        defaulted_count = defaulted_result.scalar() or 0

        # Compute components
        credit_score_comp = self._credit_score_component(customer.credit_score)
        income_debt_ratio = float(loan.emi_amount or 0) / float(customer.monthly_income or 1)
        income_debt_comp = self._income_debt_ratio_component(customer.monthly_income, loan.emi_amount)
        ltv_comp = self._ltv_component(loan.principal_amount, loan.collateral_value)
        employment_comp = self._employment_component(customer.employment_type)
        payment_history_comp = self._payment_history_component(
            customer_stats["total_loans"], defaulted_count
        )

        # Weighted score
        overall_score = (
            credit_score_comp * 0.35 +
            income_debt_comp * 0.25 +
            ltv_comp * 0.15 +
            employment_comp * 0.15 +
            payment_history_comp * 0.10
        )

        risk_grade, _, recommendation = get_risk_grade(overall_score)

        # Calc LTV
        ltv = float(loan.principal_amount) / float(loan.collateral_value) if loan.collateral_value else None

        # Max recommended amount
        if customer.monthly_income:
            max_emi = float(customer.monthly_income) * 0.40
            max_amount = max_emi * loan.tenure_months / (1 + float(loan.interest_rate) / 1200)
        else:
            max_amount = float(loan.principal_amount)

        assessment = RiskAssessment(
            loan_id=loan_id,
            customer_id=customer.id,
            credit_score=customer.credit_score,
            income_debt_ratio=round(income_debt_ratio, 4),
            loan_to_value_ratio=round(ltv, 4) if ltv else None,
            employment_stability_score=round(employment_comp, 2),
            payment_history_score=round(payment_history_comp, 2),
            overall_risk_score=round(overall_score, 2),
            risk_grade=risk_grade,
            recommendation=recommendation,
            max_recommended_amount=Decimal(str(round(max_amount, 2))),
            assessed_by_id=assessed_by_id,
            model_version="1.0.0",
            raw_features={
                "credit_score_component": credit_score_comp,
                "income_debt_component": income_debt_comp,
                "ltv_component": ltv_comp,
                "employment_component": employment_comp,
                "payment_history_component": payment_history_comp,
            },
        )
        self.db.add(assessment)

        loan.risk_score = overall_score
        loan.risk_grade = risk_grade

        await self.db.flush()
        logger.info("risk_assessed", loan_id=loan_id, score=overall_score, grade=risk_grade)
        return assessment