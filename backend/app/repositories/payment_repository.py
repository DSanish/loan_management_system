from sqlalchemy import select, func, and_, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Tuple
from datetime import date
from app.models.models import Payment, PaymentStatus, Loan
from app.repositories.base import BaseRepository


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Payment, db)

    async def get_by_payment_number(self, payment_number: str) -> Optional[Payment]:
        result = await self.db.execute(
            select(Payment).where(Payment.payment_number == payment_number)
        )
        return result.scalar_one_or_none()

    async def get_loan_payments(self, loan_id: int, skip: int = 0, limit: int = 100) -> Tuple[List[Payment], int]:
        count_result = await self.db.execute(
            select(func.count()).where(Payment.loan_id == loan_id)
        )
        total = count_result.scalar()

        result = await self.db.execute(
            select(Payment)
            .where(Payment.loan_id == loan_id)
            .order_by(Payment.due_date)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all(), total

    async def get_overdue_payments(self, loan_id: int = None) -> List[Payment]:
        today = date.today()
        filters = [
            Payment.due_date < today,
            Payment.status == PaymentStatus.PENDING,
        ]
        if loan_id:
            filters.append(Payment.loan_id == loan_id)

        result = await self.db.execute(
            select(Payment)
            .options(joinedload(Payment.loan))
            .where(and_(*filters))
            .order_by(Payment.due_date)
        )
        return result.scalars().all()

    async def get_upcoming_payments(self, days: int = 7) -> List[Payment]:
        today = date.today()
        future = today + __import__("datetime").timedelta(days=days)
        result = await self.db.execute(
            select(Payment)
            .options(joinedload(Payment.loan))
            .where(
                and_(
                    Payment.due_date >= today,
                    Payment.due_date <= future,
                    Payment.status == PaymentStatus.PENDING,
                )
            )
            .order_by(Payment.due_date)
        )
        return result.scalars().all()

    async def get_next_pending_payment(self, loan_id: int) -> Optional[Payment]:
        result = await self.db.execute(
            select(Payment)
            .where(
                and_(
                    Payment.loan_id == loan_id,
                    Payment.status.in_([PaymentStatus.PENDING, PaymentStatus.OVERDUE]),
                )
            )
            .order_by(Payment.due_date)
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def get_collection_summary(self, from_date: date, to_date: date) -> dict:
        result = await self.db.execute(
            select(
                func.count(Payment.id).label("count"),
                func.coalesce(func.sum(Payment.amount), 0).label("total_amount"),
                func.coalesce(func.sum(Payment.principal_paid), 0).label("principal"),
                func.coalesce(func.sum(Payment.interest_paid), 0).label("interest"),
                func.coalesce(func.sum(Payment.late_fee_paid), 0).label("late_fees"),
            )
            .where(
                and_(
                    Payment.payment_date >= from_date,
                    Payment.payment_date <= to_date,
                    Payment.status == PaymentStatus.PAID,
                )
            )
        )
        return result.fetchone()

    async def generate_payment_number(self) -> str:
        count = await self.count()
        from datetime import datetime
        return f"PAY{datetime.now().strftime('%Y%m')}{str(count + 100001).zfill(6)}"