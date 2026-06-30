from decimal import Decimal, ROUND_HALF_UP
from datetime import date, datetime, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.models import (
    Loan, Payment, AmortizationSchedule, LoanStatusHistory,
    LoanStatus, PaymentStatus, LoanType
)
from app.schemas.schemas import LoanCreate, LoanUpdate, LoanApproval, LoanRejection, LoanDisbursement
from app.repositories.loan_repository import LoanRepository
from app.repositories.customer_repository import CustomerRepository
from app.repositories.payment_repository import PaymentRepository
from app.core.logging import get_logger

logger = get_logger(__name__)


class LoanCalculator:
    @staticmethod
    def calculate_emi(principal: Decimal, annual_rate: Decimal, tenure_months: int) -> Decimal:
        """Calculate EMI using standard reducing balance formula."""
        monthly_rate = annual_rate / Decimal("1200")
        if monthly_rate == 0:
            return (principal / tenure_months).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        factor = (1 + monthly_rate) ** tenure_months
        emi = principal * monthly_rate * factor / (factor - 1)
        return emi.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def generate_amortization_schedule(
        principal: Decimal,
        annual_rate: Decimal,
        tenure_months: int,
        start_date: date,
        emi: Decimal,
    ) -> List[dict]:
        monthly_rate = annual_rate / Decimal("1200")
        balance = principal
        schedule = []
        current_date = start_date

        for i in range(1, tenure_months + 1):
            interest = (balance * monthly_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            principal_component = emi - interest

            if i == tenure_months:
                principal_component = balance
                emi = principal_component + interest

            closing = balance - principal_component
            if closing < 0:
                closing = Decimal("0")

            schedule.append({
                "installment_number": i,
                "due_date": current_date,
                "opening_balance": balance.quantize(Decimal("0.01")),
                "emi_amount": emi.quantize(Decimal("0.01")),
                "principal_component": principal_component.quantize(Decimal("0.01")),
                "interest_component": interest.quantize(Decimal("0.01")),
                "closing_balance": closing.quantize(Decimal("0.01")),
            })

            balance = closing
            current_date = LoanCalculator._add_months(current_date, 1)

        return schedule

    @staticmethod
    def _add_months(dt: date, months: int) -> date:
        month = dt.month - 1 + months
        year = dt.year + month // 12
        month = month % 12 + 1
        import calendar
        day = min(dt.day, calendar.monthrange(year, month)[1])
        return date(year, month, day)


class LoanService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.loan_repo = LoanRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.payment_repo = PaymentRepository(db)

    async def create_loan(self, data: LoanCreate, created_by_id: int) -> Loan:
        customer = await self.customer_repo.get_by_id(data.customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        if customer.is_blacklisted:
            raise HTTPException(status_code=400, detail="Customer is blacklisted")
        if not customer.is_active:
            raise HTTPException(status_code=400, detail="Customer account is inactive")

        loan_number = await self.loan_repo.generate_loan_number()
        emi = LoanCalculator.calculate_emi(
            data.principal_amount, data.interest_rate, data.tenure_months
        )
        total_payable = (emi * data.tenure_months).quantize(Decimal("0.01"))
        total_interest = total_payable - data.principal_amount

        loan = Loan(
            loan_number=loan_number,
            customer_id=data.customer_id,
            loan_type=data.loan_type,
            status=LoanStatus.SUBMITTED,
            principal_amount=data.principal_amount,
            interest_rate=data.interest_rate,
            tenure_months=data.tenure_months,
            emi_amount=emi,
            total_interest=total_interest,
            total_payable=total_payable,
            outstanding_principal=data.principal_amount,
            total_paid=Decimal("0"),
            total_overdue=Decimal("0"),
            purpose=data.purpose,
            collateral_type=data.collateral_type,
            collateral_value=data.collateral_value,
            collateral_description=data.collateral_description,
            processing_fee=data.processing_fee or Decimal("0"),
            insurance_amount=data.insurance_amount or Decimal("0"),
            assigned_officer_id=data.assigned_officer_id,
        )
        loan = await self.loan_repo.create(loan)

        history = LoanStatusHistory(
            loan_id=loan.id,
            from_status=None,
            to_status=LoanStatus.SUBMITTED,
            changed_by_id=created_by_id,
            reason="Loan application submitted",
        )
        self.db.add(history)
        await self.db.flush()

        # Customer relationship ke saath loan dubara fetch karo
        loan = await self.loan_repo.get_with_details(loan.id)

        logger.info(
        "loan_created",
        loan_number=loan_number,
        customer_id=data.customer_id,
       )

        return loan

    async def approve_loan(self, loan_id: int, data: LoanApproval, approved_by_id: int) -> Loan:
        loan = await self.loan_repo.get_by_id(loan_id)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status not in [LoanStatus.SUBMITTED, LoanStatus.UNDER_REVIEW]:
            raise HTTPException(status_code=400, detail=f"Loan cannot be approved in '{loan.status}' status")

        if data.interest_rate:
            emi = LoanCalculator.calculate_emi(data.approved_amount, data.interest_rate, loan.tenure_months)
            total_payable = (emi * loan.tenure_months).quantize(Decimal("0.01"))
            loan.interest_rate = data.interest_rate
            loan.emi_amount = emi
            loan.total_payable = total_payable
            loan.total_interest = total_payable - data.approved_amount
        else:
            emi = LoanCalculator.calculate_emi(data.approved_amount, loan.interest_rate, loan.tenure_months)
            total_payable = (emi * loan.tenure_months).quantize(Decimal("0.01"))
            loan.emi_amount = emi
            loan.total_payable = total_payable
            loan.total_interest = total_payable - data.approved_amount

        loan.approved_amount = data.approved_amount
        loan.outstanding_principal = data.approved_amount
        loan.status = LoanStatus.APPROVED
        loan.approval_date = datetime.utcnow()

        history = LoanStatusHistory(
            loan_id=loan.id,
            from_status=LoanStatus.SUBMITTED,
            to_status=LoanStatus.APPROVED,
            changed_by_id=approved_by_id,
            reason=data.notes or "Loan approved",
        )
        self.db.add(history)
        await self.db.flush()
        loan = await self.loan_repo.get_with_details(loan.id)
        return loan

    async def reject_loan(self, loan_id: int, data: LoanRejection, rejected_by_id: int) -> Loan:
        loan = await self.loan_repo.get_by_id(loan_id)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status not in [LoanStatus.SUBMITTED, LoanStatus.UNDER_REVIEW, LoanStatus.APPROVED]:
            raise HTTPException(status_code=400, detail="Loan cannot be rejected in current status")

        prev_status = loan.status
        loan.status = LoanStatus.REJECTED
        loan.rejection_reason = data.reason

        history = LoanStatusHistory(
            loan_id=loan.id,
            from_status=prev_status,
            to_status=LoanStatus.REJECTED,
            changed_by_id=rejected_by_id,
            reason=data.reason,
        )
        self.db.add(history)
        await self.db.flush()
        loan = await self.loan_repo.get_with_details(loan.id)
        return loan

    async def disburse_loan(self, loan_id: int, data: LoanDisbursement, disbursed_by_id: int) -> Loan:
        loan = await self.loan_repo.get_by_id(loan_id)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status != LoanStatus.APPROVED:
            raise HTTPException(status_code=400, detail="Only approved loans can be disbursed")

        loan.disbursed_amount = data.disbursed_amount
        loan.outstanding_principal = data.disbursed_amount
        loan.total_payable = (loan.emi_amount * loan.tenure_months).quantize(Decimal("0.01"))
        loan.total_interest = loan.total_payable - data.disbursed_amount
        loan.status = LoanStatus.ACTIVE
        loan.disbursement_date = datetime.utcnow()
        loan.first_emi_date = data.first_emi_date

        last_emi_date = LoanCalculator._add_months(data.first_emi_date, loan.tenure_months - 1)
        loan.last_emi_date = last_emi_date

        schedule = LoanCalculator.generate_amortization_schedule(
            data.disbursed_amount,
            loan.interest_rate,
            loan.tenure_months,
            data.first_emi_date,
            loan.emi_amount,
        )

        for item in schedule:
            amort = AmortizationSchedule(loan_id=loan.id, **item)
            self.db.add(amort)

            payment = Payment(
                payment_number=f"PAY{loan.loan_number}I{item['installment_number']:03d}",
                loan_id=loan.id,
                installment_number=item["installment_number"],
                amount=item["emi_amount"],
                principal_paid=item["principal_component"],
                interest_paid=item["interest_component"],
                due_date=item["due_date"],
                status=PaymentStatus.PENDING,
                late_fee=Decimal("0"),
                waiver_amount=Decimal("0"),
            )
            self.db.add(payment)

        history = LoanStatusHistory(
            loan_id=loan.id,
            from_status=LoanStatus.APPROVED,
            to_status=LoanStatus.ACTIVE,
            changed_by_id=disbursed_by_id,
            reason=f"Loan disbursed. Amount: {data.disbursed_amount}",
        )
        self.db.add(history)
        await self.db.flush()

        loan = await self.loan_repo.get_with_details(loan.id)

        logger.info(
           "loan_disbursed",
            loan_id=loan_id,
            amount=str(data.disbursed_amount),
        )

        return loan

    async def close_loan(self, loan_id: int, closed_by_id: int, reason: str = "Fully repaid") -> Loan:
        loan = await self.loan_repo.get_by_id(loan_id)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")

        loan.status = LoanStatus.CLOSED
        loan.closure_date = datetime.utcnow()
        loan.outstanding_principal = Decimal("0")

        history = LoanStatusHistory(
            loan_id=loan.id,
            from_status=LoanStatus.ACTIVE,
            to_status=LoanStatus.CLOSED,
            changed_by_id=closed_by_id,
            reason=reason,
        )
        self.db.add(history)
        await self.db.flush()
        return loan