import asyncio

from sqlalchemy import select

from app.database.session import AsyncSessionLocal
from app.database.model import User, UserRole
from app.core.security import get_password_hash


async def create_admin():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.username == "admin")
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("✅ Admin user already exists.")
            return

        admin = User(
            email="admin@loanms.com",
            username="admin",
            full_name="System Administrator",
            hashed_password=get_password_hash("Admin@123"),
            role=UserRole.ADMIN,
            phone="9876543210",
            is_active=True,
            is_verified=True,
        )

        db.add(admin)
        await db.commit()

        print("✅ Admin user created successfully!")
        print("Username : admin")
        print("Password : Admin@123")


if __name__ == "__main__":
    asyncio.run(create_admin())