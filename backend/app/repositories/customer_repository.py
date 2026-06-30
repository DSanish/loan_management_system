from sqlalchemy import select, func, case, or_, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Tuple
from app.models.models import Customer, Loan, LoanStatus
from app.repositories.base import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, db: AsyncSession):
        super().__init__(Customer, db)

    async def get_by_email(self, email: str) -> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.email == email))
        return result.scalar_one_or_none()

    async def get_by_national_id(self, national_id: str) -> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.national_id == national_id))
        return result.scalar_one_or_none()

    async def get_by_pan(self, pan_number: str) -> Optional[Customer]:
        result = await self.db.execute(select(Customer).where(Customer.pan_number == pan_number))
        return result.scalar_one_or_none()

    async def get_by_customer_number(self, customer_number: str) -> Optional[Customer]:
        result = await self.db.execute(
            select(Customer).where(Customer.customer_number == customer_number)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        query: str = None,
        city: str = None,
        state: str = None,
        is_active: bool = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Customer], int]:
        stmt = select(Customer)
        count_stmt = select(func.count()).select_from(Customer)

        filters = []
        if query:
            search = f"%{query}%"
            filters.append(
                or_(
                    Customer.first_name.ilike(search),
                    Customer.last_name.ilike(search),
                    Customer.email.ilike(search),
                    Customer.phone.ilike(search),
                    Customer.customer_number.ilike(search),
                    Customer.pan_number.ilike(search),
                )
            )
        if city:
            filters.append(Customer.city.ilike(f"%{city}%"))
        if state:
            filters.append(Customer.state.ilike(f"%{state}%"))
        if is_active is not None:
            filters.append(Customer.is_active == is_active)

        if filters:
            stmt = stmt.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar()

        stmt = stmt.offset(skip).limit(limit).order_by(Customer.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_with_loan_stats(self, customer_id: int) -> Optional[dict]:
        customer = await self.get_by_id(customer_id)
        if not customer:
            return None

        loans_result = await self.db.execute(
            select(
                func.count(Loan.id).label("total_loans"),
                func.sum(
                    case((Loan.status.in_([LoanStatus.ACTIVE, LoanStatus.DISBURSED]), 1), else_=0)
                ).label("active_loans"),
                func.coalesce(func.sum(Loan.outstanding_principal), 0).label("total_outstanding"),
            ).where(Loan.customer_id == customer_id)
        )
        stats = loans_result.fetchone()
        return {
            "customer": customer,
            "total_loans": stats.total_loans or 0,
            "active_loans": stats.active_loans or 0,
            "total_outstanding": stats.total_outstanding or 0,
        }

    async def generate_customer_number(self) -> str:
        count = await self.count()
        return f"CUST{str(count + 1001).zfill(6)}"