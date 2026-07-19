from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.security import get_current_user
from app.database.model import Customer, Loan, Payment, User

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

@router.get("/dashboard")
async def reports_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_customers = await db.scalar(
        select(func.count(Customer.id))
    )

    total_loans = await db.scalar(
        select(func.count(Loan.id))
    )

    active_loans = await db.scalar(
        select(func.count(Loan.id)).where(
            Loan.status == "ACTIVE"
        )
    )

    total_collection = await db.scalar(
        select(func.sum(Payment.amount))
    )

    outstanding = await db.scalar(
        select(func.sum(Loan.outstanding_principal))
    )

    overdue = await db.scalar(
        select(func.sum(Loan.total_overdue))
    )

    return {
        "total_customers": total_customers or 0,
        "total_loans": total_loans or 0,
        "active_loans": active_loans or 0,
        "total_collection": float(total_collection or 0),
        "outstanding": float(outstanding or 0),
        "overdue": float(overdue or 0),
    }