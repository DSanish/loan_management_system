from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from typing import TypeVar, Generic, Type, Optional, List, Tuple

from app.database.session import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: int) -> Optional[ModelType]:
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        filters: dict = None,
    ) -> Tuple[List[ModelType], int]:

        query = select(self.model)
        count_query = select(func.count()).select_from(self.model)

        if filters:
            for key, value in filters.items():
                if value is not None:
                    query = query.where(getattr(self.model, key) == value)
                    count_query = count_query.where(getattr(self.model, key) == value)

        total = (await self.db.execute(count_query)).scalar()

        result = await self.db.execute(
            query.offset(skip).limit(limit)
        )

        return result.scalars().all(), total

    async def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)

        await self.db.commit()
        await self.db.refresh(obj)

        return obj

    async def update(
        self,
        id: int,
        data: dict,
    ) -> Optional[ModelType]:

        await self.db.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**data)
        )

        await self.db.commit()

        return await self.get_by_id(id)

    async def delete(self, id: int) -> bool:

        result = await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )

        await self.db.commit()

        return result.rowcount > 0

    async def count(self, filters: dict = None) -> int:

        query = select(func.count()).select_from(self.model)

        if filters:
            for key, value in filters.items():
                if value is not None:
                    query = query.where(getattr(self.model, key) == value)

        result = await self.db.execute(query)

        return result.scalar()