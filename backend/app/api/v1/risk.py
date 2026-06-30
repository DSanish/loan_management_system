from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db
from app.models.models import RiskAssessment, User
from app.ml.risk_scoring import RiskScoringService
from app.schemas.schemas import RiskAssessmentResponse
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/risk", tags=["Risk Assessment"])


@router.post("/assess/{loan_id}", response_model=RiskAssessmentResponse)
async def assess_loan_risk(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer", "analyst")),
):
    service = RiskScoringService(db)
    try:
        return await service.assess_risk(loan_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/loan/{loan_id}", response_model=RiskAssessmentResponse)
async def get_loan_risk(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(RiskAssessment)
        .where(RiskAssessment.loan_id == loan_id)
        .order_by(RiskAssessment.created_at.desc())
        .limit(1)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="No risk assessment found for this loan")
    return assessment


@router.get("/customer/{customer_id}")
async def get_customer_risk_history(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(RiskAssessment)
        .where(RiskAssessment.customer_id == customer_id)
        .order_by(RiskAssessment.created_at.desc())
    )
    assessments = result.scalars().all()
    return {"total": len(assessments), "assessments": assessments}