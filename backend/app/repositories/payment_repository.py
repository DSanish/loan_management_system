from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Tuple
from datetime import date, timedelta

from app.models.models import (
    Payment,
    PaymentStatus,
    Loan,
)

from app.repositories.base import BaseRepository


class PaymentRepository(BaseRepository[Payment]):

    def __init__(self, db: AsyncSession):
        super().__init__(Payment, db)

    # ===========================
    # Payment Details
    # ===========================

    async def get_with_details(
        self,
        payment_id: int,
    ) -> Optional[Payment]:

        result = await self.db.execute(
            select(Payment)
            .options(
                joinedload(Payment.loan)
                .joinedload(Loan.customer),

                joinedload(Payment.loan)
                .joinedload(Loan.assigned_officer),
            )
            .where(Payment.id == payment_id)
        )

        return result.scalar_one_or_none()

    # ===========================
    # Override Base get_all
    # ===========================

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        filters: dict = None,
    ) -> Tuple[List[Payment], int]:

        stmt = (
            select(Payment)
            .options(
                joinedload(Payment.loan)
                .joinedload(Loan.customer),

                joinedload(Payment.loan)
                .joinedload(Loan.assigned_officer),
            )
        )

        count_stmt = select(func.count()).select_from(Payment)

        if filters:
            for key, value in filters.items():
                if value is not None:
                    stmt = stmt.where(getattr(Payment, key) == value)
                    count_stmt = count_stmt.where(getattr(Payment, key) == value)

        total = (
            await self.db.execute(count_stmt)
        ).scalar()

        stmt = stmt.offset(skip).limit(limit)

        result = await self.db.execute(stmt)

        return result.scalars().all(), total

    # ===========================
    # Payment Number
    # ===========================

    async def get_by_payment_number(
        self,
        payment_number: str,
    ) -> Optional[Payment]:

        result = await self.db.execute(
            select(Payment)
            .options(
                joinedload(Payment.loan)
            )
            .where(
                Payment.payment_number == payment_number
            )
        )

        return result.scalar_one_or_none()

    # ===========================
    # Loan Payments
    # ===========================

    async def get_loan_payments(
        self,
        loan_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> Tuple[List[Payment], int]:

        total = (
            await self.db.execute(
                select(func.count())
                .where(Payment.loan_id == loan_id)
            )
        ).scalar()

        result = await self.db.execute(

            select(Payment)
            .options(
                joinedload(Payment.loan)
            )
            .where(Payment.loan_id == loan_id)
            .order_by(Payment.due_date)
            .offset(skip)
            .limit(limit)

        )

        return result.scalars().all(), total

    # ===========================
    # Overdue Payments
    # ===========================

    async def get_overdue_payments(
        self,
        loan_id: int = None,
    ) -> List[Payment]:

        today = date.today()

        filters = [
            Payment.due_date < today,
            Payment.status == PaymentStatus.PENDING,
        ]

        if loan_id:
            filters.append(
                Payment.loan_id == loan_id
            )

        result = await self.db.execute(

            select(Payment)
            .options(
                joinedload(Payment.loan)
                .joinedload(Loan.customer)
            )
            .where(and_(*filters))
            .order_by(Payment.due_date)

        )

        return result.scalars().all()

    # ===========================
    # Upcoming Payments
    # ===========================

    async def get_upcoming_payments(
        self,
        days: int = 7,
    ) -> List[Payment]:

        today = date.today()
        future = today + timedelta(days=days)

        result = await self.db.execute(

            select(Payment)
            .options(
                joinedload(Payment.loan)
                .joinedload(Loan.customer)
            )
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

    # ===========================
    # Next Pending Payment
    # ===========================

    async def get_next_pending_payment(
        self,
        loan_id: int,
    ) -> Optional[Payment]:

        result = await self.db.execute(

            select(Payment)
            .options(
                joinedload(Payment.loan)
            )
            .where(
                and_(
                    Payment.loan_id == loan_id,
                    Payment.status.in_(
                        [
                            PaymentStatus.PENDING,
                            PaymentStatus.OVERDUE,
                        ]
                    ),
                )
            )
            .order_by(Payment.due_date)
            .limit(1)

        )

        return result.scalar_one_or_none()

    # ===========================
    # Collection Summary
    # ===========================

    async def get_collection_summary(
        self,
        from_date: date,
        to_date: date,
    ):

        result = await self.db.execute(

            select(
                func.count(Payment.id).label("count"),
                func.coalesce(
                    func.sum(Payment.amount),
                    0,
                ).label("total_amount"),
                func.coalesce(
                    func.sum(Payment.principal_paid),
                    0,
                ).label("principal"),
                func.coalesce(
                    func.sum(Payment.interest_paid),
                    0,
                ).label("interest"),
                func.coalesce(
                    func.sum(Payment.late_fee_paid),
                    0,
                ).label("late_fees"),
            ).where(
                and_(
                    Payment.payment_date >= from_date,
                    Payment.payment_date <= to_date,
                    Payment.status == PaymentStatus.PAID,
                )
            )

        )

        return result.fetchone()

    # ===========================
    # Payment Number Generator
    # ===========================

    async def generate_payment_number(self):

        count = await self.count()

        from datetime import datetime

        return (
            f"PAY{datetime.now().strftime('%Y%m')}"
            f"{str(count + 100001).zfill(6)}"
        )
    
    # ===========================
    # Search Payments
    # ===========================
    
    async def search(
        self,
        query: str = None,
        loan_id: int = None,
        status: PaymentStatus = None,
        skip: int = 0,
        limit: int = 20,
    ):
    
        stmt = (
            select(Payment)
            .options(
                joinedload(Payment.loan)
                .joinedload(Loan.customer),
    
                joinedload(Payment.loan)
                .joinedload(Loan.assigned_officer),
            )
        )
    
        count_stmt = select(func.count()).select_from(Payment)
    
        filters = []
    
        if query:
        
            stmt = stmt.join(Loan)
            count_stmt = count_stmt.join(Loan)
        
            query = query.strip().upper()
        
            # Payment Number Search
            if query.startswith("PAY"):
                filters.append(
                    Payment.payment_number.ilike(f"{query}%")
                )
        
            # Loan Number Search
            elif query.startswith("LN"):
                filters.append(
                    Loan.loan_number == query
                )
        
            # Generic Search
            else:
                filters.append(
                    or_(
                        Payment.payment_number.ilike(f"%{query}%"),
                        Loan.loan_number.ilike(f"%{query}%"),
                    )
                )
    
        if loan_id:
            filters.append(Payment.loan_id == loan_id)
    
        if status:
            filters.append(Payment.status == status)
    
        if filters:
            stmt = stmt.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))
    
        total = (
            await self.db.execute(count_stmt)
        ).scalar()
    
        stmt = (
            stmt
            .order_by(Payment.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
    
        result = await self.db.execute(stmt)
    
        return result.scalars().all(), total