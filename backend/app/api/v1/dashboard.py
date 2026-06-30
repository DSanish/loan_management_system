from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from decimal import Decimal

from app.database.session import get_db
from app.models.models import Loan, Payment, Customer, LoanStatus, PaymentStatus
from app.schemas.schemas import DashboardStats
from app.core.security import get_current_user
from app.models.models import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    month_start = today.replace(day=1)

    # Loan stats
    loan_stats = await db.execute(
        select(
            func.count(Loan.id).label("total"),
            func.sum(case((Loan.status == LoanStatus.ACTIVE, 1), else_=0)).label("active"),
            func.coalesce(
                func.sum(
                    case((Loan.status == LoanStatus.ACTIVE, Loan.disbursed_amount), else_=0)
                ),
                0,
            ).label("total_disbursed"),

            func.coalesce(
                func.sum(
                     case((Loan.status == LoanStatus.ACTIVE, Loan.outstanding_principal), else_=0)
                ),
                0,
            ).label("outstanding"),

            func.coalesce(
                func.sum(
                    case((Loan.status == LoanStatus.ACTIVE, Loan.total_paid), else_=0)
                ),
                0,
            ).label("collected"),
        )
    )
    ls = loan_stats.fetchone()

    # Overdue loans
    overdue_result = await db.execute(
        select(
            func.count(func.distinct(Payment.loan_id)).label("count"),
            func.coalesce(func.sum(Payment.amount), 0).label("amount"),
        ).where(
            and_(
                Payment.due_date < today,
                Payment.status == PaymentStatus.PENDING,
            )
        )
    )
    od = overdue_result.fetchone()

    # New applications this month
    new_apps = await db.execute(
        select(func.count()).where(
            and_(
                Loan.application_date >= month_start,
                Loan.status.in_([LoanStatus.SUBMITTED, LoanStatus.UNDER_REVIEW])
            )
        )
    )

    # Approvals today
    approvals = await db.execute(
        select(func.count()).where(
            and_(
                Loan.approval_date >= today,
                Loan.status == LoanStatus.APPROVED,
            )
        )
    )

    # Customer stats
    customer_stats = await db.execute(
        select(
            func.count(Customer.id).label("total"),
            func.sum(case((Customer.created_at >= month_start, 1), else_=0)).label("new_this_month"),
        )
    )
    cs = customer_stats.fetchone()

    total_disbursed = float(ls.total_disbursed or 0)
    collected = float(ls.collected or 0)
    collection_rate = (collected / total_disbursed * 100) if total_disbursed > 0 else 0
    active = int(ls.active or 0)
    overdue = int(od.count or 0)
    npa_rate = (overdue / active * 100) if active > 0 else 0

    return DashboardStats(
        total_loans=int(ls.total or 0),
        active_loans=active,
        total_disbursed=Decimal(str(total_disbursed)),
        total_outstanding=Decimal(str(float(ls.outstanding or 0))),
        total_collected=Decimal(str(collected)),
        overdue_loans=overdue,
        overdue_amount=Decimal(str(float(od.amount or 0))),
        new_applications=new_apps.scalar() or 0,
        approvals_today=approvals.scalar() or 0,
        collection_rate=round(collection_rate, 2),
        npa_rate=round(npa_rate, 2),
        total_customers=int(cs.total or 0),
        new_customers_this_month=int(cs.new_this_month or 0),
    )


@router.get("/loan-breakdown")
async def get_loan_breakdown(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(
            Loan.status,
            func.count(Loan.id).label("count"),
            func.coalesce(func.sum(Loan.principal_amount), 0).label("amount"),
        ).group_by(Loan.status)
    )
    rows = result.fetchall()
    return [{"status": r.status, "count": r.count, "amount": float(r.amount)} for r in rows]


@router.get("/monthly-collections")
async def get_monthly_collections(
    months: int = Query(6, ge=1, le=24),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from sqlalchemy import extract
    result = await db.execute(
        select(
            extract("year", Payment.payment_date).label("year"),
            extract("month", Payment.payment_date).label("month"),
            func.coalesce(func.sum(Payment.amount), 0).label("collected"),
            func.coalesce(func.sum(Payment.late_fee_paid), 0).label("late_fees"),
        )
        .where(Payment.status == PaymentStatus.PAID, Payment.payment_date.isnot(None))
        .group_by("year", "month")
        .order_by("year", "month")
        .limit(months)
    )
    rows = result.fetchall()
    return [
        {
            "year": int(r.year),
            "month": int(r.month),
            "collected": float(r.collected),
            "late_fees": float(r.late_fees),
        }
        for r in rows
    ]


@router.get("/loan-type-distribution")
async def get_loan_type_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(
            Loan.loan_type,
            func.count(Loan.id).label("count"),
            func.coalesce(func.sum(Loan.principal_amount), 0).label("amount"),
        ).group_by(Loan.loan_type)
    )
    rows = result.fetchall()
    return [{"type": r.loan_type, "count": r.count, "amount": float(r.amount)} for r in rows]


@router.get("/risk-distribution")
async def get_risk_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(
            Loan.risk_grade,
            func.count(Loan.id).label("count"),
        )
        .where(Loan.risk_grade.isnot(None))
        .group_by(Loan.risk_grade)
    )
    rows = result.fetchall()
    return [{"grade": r.risk_grade, "count": r.count} for r in rows]