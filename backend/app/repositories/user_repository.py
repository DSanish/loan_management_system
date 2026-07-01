from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.models.models import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:

      print("Searching Email:", repr(email))

      result = await self.db.execute(
        select(User).where(User.email == email)
      )

      user = result.scalar_one_or_none()

      print("Repository Found:", user)

      return user

    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_active_officers(self):
        from app.models.models import UserRole
        result = await self.db.execute(
            select(User).where(
                User.is_active == True,
                User.role.in_([UserRole.LOAN_OFFICER, UserRole.ADMIN, UserRole.SUPERADMIN])
            )
        )
        return result.scalars().all()