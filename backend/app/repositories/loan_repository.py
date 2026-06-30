from sqlalchemy import select, func, and_, or_, update
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Tuple
from datetime import date, timedelta
from decimal import Decimal
from app.models.models import Loan, Payment, LoanStatus, PaymentStatus, Customer
from app.repositories.base import BaseRepository


class LoanRepository(BaseRepository[Loan]):
    def __init__(self, db: AsyncSession):
        super().__init__(Loan, db)

    async def get_by_loan_number(self, loan_number: str) -> Optional[Loan]:
        result = await self.db.execute(
            select(Loan)
            .options(joinedload(Loan.customer), joinedload(Loan.assigned_officer))
            .where(Loan.loan_number == loan_number)
        )
        return result.scalar_one_or_none()

    async def get_with_details(self, loan_id: int) -> Optional[Loan]:
        result = await self.db.execute(
            select(Loan)
            .options(
                joinedload(Loan.customer),
                joinedload(Loan.assigned_officer),
                selectinload(Loan.payments),
                selectinload(Loan.amortization_schedule),
                selectinload(Loan.status_history),
            )
            .where(Loan.id == loan_id)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        query: str = None,
        status: LoanStatus = None,
        loan_type=None,
        customer_id: int = None,
        officer_id: int = None,
        from_date=None,
        to_date=None,
        min_amount: float = None,
        max_amount: float = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Loan], int]:
        stmt = select(Loan).options(joinedload(Loan.customer))
        count_stmt = select(func.count()).select_from(Loan)

        filters = []
        if query:
            filters.append(Loan.loan_number.ilike(f"%{query}%"))
        if status:
            filters.append(Loan.status == status)
        if loan_type:
            filters.append(Loan.loan_type == loan_type)
        if customer_id:
            filters.append(Loan.customer_id == customer_id)
        if officer_id:
            filters.append(Loan.assigned_officer_id == officer_id)
        if from_date:
            filters.append(Loan.application_date >= from_date)
        if to_date:
            filters.append(Loan.application_date <= to_date)
        if min_amount:
            filters.append(Loan.principal_amount >= min_amount)
        if max_amount:
            filters.append(Loan.principal_amount <= max_amount)

        if filters:
            stmt = stmt.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar()

        stmt = stmt.offset(skip).limit(limit).order_by(Loan.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_overdue_loans(self) -> List[Loan]:
        today = date.today()
        overdue_loan_ids_query = (
            select(Payment.loan_id)
            .where(
                and_(
                    Payment.due_date < today,
                    Payment.status == PaymentStatus.PENDING,
                )
            )
            .distinct()
        )
        result = await self.db.execute(
            select(Loan)
            .options(joinedload(Loan.customer))
            .where(
                and_(
                    Loan.id.in_(overdue_loan_ids_query),
                    Loan.status == LoanStatus.ACTIVE,
                )
            )
        )
        return result.scalars().all()

    async def generate_loan_number(self) -> str:
        count = await self.count()
        from datetime import datetime
        year = datetime.now().year
        return f"LN{year}{str(count + 10001).zfill(6)}"

    async def get_portfolio_summary(self) -> dict:
        result = await self.db.execute(
            select(
                Loan.status,
                func.count(Loan.id).label("count"),
                func.coalesce(func.sum(Loan.principal_amount), 0).label("total_amount"),
                func.coalesce(func.sum(Loan.outstanding_principal), 0).label("outstanding"),
            ).group_by(Loan.status)
        )
        return result.fetchall()

    async def get_monthly_disbursements(self, months: int = 12) -> list:
        from sqlalchemy import extract, cast
        result = await self.db.execute(
            select(
                extract("year", Loan.disbursement_date).label("year"),
                extract("month", Loan.disbursement_date).label("month"),
                func.count(Loan.id).label("count"),
                func.coalesce(func.sum(Loan.disbursed_amount), 0).label("amount"),
            )
            .where(Loan.disbursement_date.isnot(None))
            .group_by("year", "month")
            .order_by("year", "month")
            .limit(months)
        )
        return result.fetchall()