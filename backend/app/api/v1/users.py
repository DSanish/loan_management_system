from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.database.session import get_db
from app.schemas.schemas import UserCreate, UserUpdate, UserResponse, UserPasswordChange, PaginatedResponse
from app.repositories.user_repository import UserRepository
from app.models.models import User, UserRole
from app.core.security import get_current_user, get_password_hash, verify_password, require_roles
import math

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin")),
):
    repo = UserRepository(db)
    skip = (page - 1) * page_size
    filters = {}
    if role:
        filters["role"] = role
    if is_active is not None:
        filters["is_active"] = is_active
    users, total = await repo.get_all(skip=skip, limit=page_size, filters=filters)
    # return {
    #     "total": total,
    #     "page": page,
    #     "page_size": page_size,
    #     "pages": math.ceil(total / page_size),
    #     "items": users,
    # }
    return {
    "total": total,
    "page": page,
    "page_size": page_size,
    "pages": math.ceil(total / page_size),
    "items": [
        UserResponse.model_validate(user, from_attributes=True)
        for user in users
    ],
}

@router.post("", response_model=UserResponse, status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin")),
):
    repo = UserRepository(db)
    if await repo.get_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await repo.get_by_username(data.username):
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name,
        role=data.role,
        phone=data.phone,
        hashed_password=get_password_hash(data.password),
        is_active=True,
    )
    return await repo.create(user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    repo = UserRepository(db)
    update_data = data.dict(exclude_unset=True)
    if "role" in update_data and current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Cannot change your own role")
    user = await repo.update(user_id, update_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/{user_id}/change-password")
async def change_password(
    user_id: int,
    data: UserPasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Can only change your own password")
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    repo = UserRepository(db)
    await repo.update(user_id, {"hashed_password": get_password_hash(data.new_password)})
    return {"message": "Password changed successfully"}


@router.delete("/{user_id}")
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("superadmin")),
):
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    repo = UserRepository(db)
    await repo.update(user_id, {"is_active": False})
    return {"message": "User deactivated"}


@router.get("/officers/list", response_model=List[UserResponse])
async def get_officers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = UserRepository(db)
    return await repo.get_active_officers()