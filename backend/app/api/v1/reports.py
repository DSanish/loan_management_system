from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.security import get_current_user
from app.models.models import User

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/dashboard")
async def reports_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "Reports API Working"
    }