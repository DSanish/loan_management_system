from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import math

from app.database.session import get_db
from app.schemas.schemas import (
    LoanCreate, LoanUpdate, LoanApproval, LoanRejection, LoanDisbursement,
    LoanResponse, PaginatedResponse, AmortizationScheduleItem
)
from app.services.loan_service import LoanService, LoanCalculator
from app.repositories.loan_repository import LoanRepository
from app.models.models import User, LoanStatus, LoanType
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.get("", response_model=PaginatedResponse)
async def list_loans(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    status: Optional[LoanStatus] = None,
    loan_type: Optional[LoanType] = None,
    customer_id: Optional[int] = None,
    officer_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = LoanRepository(db)
    skip = (page - 1) * page_size
    officer_filter = None
    if current_user.role == "loan_officer":
        officer_filter = current_user.id

    loans, total = await repo.search(
        query=q,
        status=status,
        loan_type=loan_type,
        customer_id=customer_id,
        officer_id=officer_id or officer_filter,
        min_amount=min_amount,
        max_amount=max_amount,
        skip=skip,
        limit=page_size,
    )
    return {
    "total": total,
    "page": page,
    "page_size": page_size,
    "pages": math.ceil(total / page_size) if total > 0 else 1,
    "items": [
        LoanResponse.model_validate(loan, from_attributes=True)
        for loan in loans
    ],
}

@router.post("", response_model=LoanResponse, status_code=201)
async def create_loan(
    data: LoanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = LoanService(db)
    return await service.create_loan(data, current_user.id)


@router.get("/calculator")
async def calculate_loan(
    principal: float = Query(..., gt=0),
    annual_rate: float = Query(..., gt=0),
    tenure_months: int = Query(..., ge=1, le=360),
):
    from decimal import Decimal
    p = Decimal(str(principal))
    r = Decimal(str(annual_rate))
    emi = LoanCalculator.calculate_emi(p, r, tenure_months)
    total_payable = (emi * tenure_months).quantize(Decimal("0.01"))
    total_interest = total_payable - p
    return {
        "principal": principal,
        "annual_rate": annual_rate,
        "tenure_months": tenure_months,
        "emi": float(emi),
        "total_payable": float(total_payable),
        "total_interest": float(total_interest),
    }


@router.get("/{loan_id}", response_model=LoanResponse)
async def get_loan(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = LoanRepository(db)
    loan = await repo.get_with_details(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan


@router.patch("/{loan_id}", response_model=LoanResponse)
async def update_loan(
    loan_id: int,
    data: LoanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = LoanRepository(db)

    # Check loan exists
    loan = await repo.get_by_id(loan_id)
    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    # Only Draft and Submitted loans can be edited
    editable_status = [
        LoanStatus.DRAFT,
        LoanStatus.SUBMITTED,
    ]

    if loan.status not in editable_status:
        raise HTTPException(
            status_code=400,
            detail=f"Loan cannot be modified because current status is '{loan.status.value}'. "
                   "Only Draft and Submitted loans can be edited."
        )

    update_data = data.model_dump(exclude_unset=True)

    updated_loan = await repo.update(
        loan_id,
        update_data,
    )

    updated_loan = await repo.get_with_details(loan_id)

    if not updated_loan:
     raise HTTPException(
        status_code=404,
        detail="Loan not found"
    )

    return updated_loan

@router.post("/{loan_id}/approve", response_model=LoanResponse)
async def approve_loan(
    loan_id: int,
    data: LoanApproval,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer")),
):
    service = LoanService(db)
    return await service.approve_loan(loan_id, data, current_user.id)


@router.post("/{loan_id}/reject", response_model=LoanResponse)
async def reject_loan(
    loan_id: int,
    data: LoanRejection,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer")),
):
    service = LoanService(db)
    return await service.reject_loan(loan_id, data, current_user.id)


@router.post("/{loan_id}/disburse", response_model=LoanResponse)
async def disburse_loan(
    loan_id: int,
    data: LoanDisbursement,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin")),
):
    service = LoanService(db)
    return await service.disburse_loan(loan_id, data, current_user.id)


@router.get("/{loan_id}/schedule")
async def get_amortization_schedule(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = LoanRepository(db)
    loan = await repo.get_with_details(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"loan_number": loan.loan_number, "schedule": loan.amortization_schedule}


@router.get("/{loan_id}/history")
async def get_loan_history(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = LoanRepository(db)
    loan = await repo.get_with_details(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"loan_number": loan.loan_number, "history": loan.status_history}


@router.post("/{loan_id}/risk-assessment")
async def perform_risk_assessment(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer", "analyst")),
):
    from app.ml.risk_scoring import RiskScoringService
    service = RiskScoringService(db)
    assessment = await service.assess_risk(loan_id, current_user.id)
    return assessment