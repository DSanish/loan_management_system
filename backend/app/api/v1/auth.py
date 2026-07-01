from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.database.session import get_db
from app.schemas.schemas import Token, TokenRefresh, UserCreate, UserResponse, LoginRequest
from app.repositories.user_repository import UserRepository
from app.models.models import User
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, decode_token, get_current_user
)
from app.core.config import settings
from app.core.logging import get_logger

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = get_logger(__name__)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user_repo = UserRepository(db)

    # Try Email
    user = await user_repo.get_by_email(form_data.username)

    # If not found, try Username
    if not user:
        user = await user_repo.get_by_username(form_data.username)

    # ==========================
    # DEBUG
    # ==========================
    print("========== LOGIN DEBUG ==========")
    print("Username received:", form_data.username)
    print("Password received:", form_data.password)
    print("User found:", user is not None)

    if user:
        print("DB Email:", user.email)
        print("DB Username:", user.username)
        print(
            "Password Match:",
            verify_password(form_data.password, user.hashed_password),
        )

    print("=================================")
    # ==========================

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Inactive account",
        )

    from datetime import datetime

    user.last_login = datetime.utcnow()
    user.failed_login_attempts = 0

    await db.flush()

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user.id)}
    )

    logger.info(
        "user_logged_in",
        user_id=user.id,
        email=user.email,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(data: TokenRefresh, db: AsyncSession = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid token")

    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    logger.info("user_logged_out", user_id=current_user.id)
    return {"message": "Successfully logged out"}