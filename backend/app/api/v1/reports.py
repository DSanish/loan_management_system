from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload
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

@router.get("/loans")
async def loan_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Loan)
        .options(selectinload(Loan.customer))
        .order_by(Loan.created_at.desc())
    )

    loans = result.scalars().all()

    data = []

    for loan in loans:
        customer_name = ""

        if loan.customer:
            customer_name = (
                f"{loan.customer.first_name} {loan.customer.last_name}"
            )

        data.append(
            {
                "id": loan.id,
                "loan_number": loan.loan_number,
                "customer": customer_name,
                "loan_amount": float(loan.principal_amount or 0),
                "paid": float(loan.total_paid or 0),
                "outstanding": float(loan.outstanding_principal or 0),
                "status": str(loan.status),
            }
        )

    return data

@router.get("/monthly-loans")
async def monthly_loans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        {"month": "Jan", "loans": 2},
        {"month": "Feb", "loans": 5},
        {"month": "Mar", "loans": 3},
        {"month": "Apr", "loans": 7},
        {"month": "May", "loans": 4},
        {"month": "Jun", "loans": 6},
    ]

@router.get("/collection-analytics")
async def collection_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        {"month": "Jan", "collection": 120000},
        {"month": "Feb", "collection": 180000},
        {"month": "Mar", "collection": 150000},
        {"month": "Apr", "collection": 220000},
        {"month": "May", "collection": 170000},
        {"month": "Jun", "collection": 250000},
    ]