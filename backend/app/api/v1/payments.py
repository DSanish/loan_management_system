from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import math

from app.database.session import get_db
from app.schemas.schemas import PaymentCreate, PaymentResponse, PaymentWaiver, PaginatedResponse
from app.services.payment_service import PaymentService
from app.repositories.payment_repository import PaymentRepository
from app.models.models import User, PaymentStatus
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("", response_model=PaginatedResponse)
async def list_payments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    loan_id: Optional[int] = None,
    status: Optional[PaymentStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PaymentRepository(db)
    skip = (page - 1) * page_size
    filters = {}
    if loan_id:
        filters["loan_id"] = loan_id
    if status:
        filters["status"] = status
    payments, total = await repo.get_all(skip=skip, limit=page_size, filters=filters)

  

    return {
      "total": total,
      "page": page,
      "page_size": page_size,
      "pages": math.ceil(total / page_size) if total > 0 else 1,
      "items": [
       PaymentResponse.model_validate(
           payments,
           from_attributes=True
       )
       for p in payments
    ],
}

@router.post("", response_model=PaymentResponse, status_code=201)
async def record_payment(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer")),
):
    service = PaymentService(db)
    return await service.record_payment(data, current_user.id)


@router.get("/overdue")
async def get_overdue_payments(
    loan_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PaymentRepository(db)
    payments = await repo.get_overdue_payments(loan_id=loan_id)
    return {"total": len(payments), "payments": payments}


@router.get("/upcoming")
async def get_upcoming_payments(
    days: int = Query(7, ge=1, le=30),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PaymentRepository(db)
    payments = await repo.get_upcoming_payments(days=days)
    return {"total": len(payments), "payments": payments}


@router.get("/collection-summary")
async def get_collection_summary(
    from_date: str = Query(..., description="YYYY-MM-DD"),
    to_date: str = Query(..., description="YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from datetime import date
    repo = PaymentRepository(db)
    summary = await repo.get_collection_summary(
        date.fromisoformat(from_date), date.fromisoformat(to_date)
    )
    return {
        "count": summary.count or 0,
        "total_amount": float(summary.total_amount or 0),
        "principal": float(summary.principal or 0),
        "interest": float(summary.interest or 0),
        "late_fees": float(summary.late_fees or 0),
    }


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PaymentRepository(db)
    payment = await repo.get_by_id(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.post("/{payment_id}/waiver")
async def apply_waiver(
    payment_id: int,
    data: PaymentWaiver,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin")),
):
    service = PaymentService(db)
    return await service.apply_waiver(payment_id, data, current_user.id)