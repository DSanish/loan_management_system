# import aioredis
# import json
# from typing import Optional, Any
# from app.core.config import settings
# from app.core.logging import get_logger

# logger = get_logger(__name__)

# redis_client: Optional[aioredis.Redis] = None


# async def get_redis() -> aioredis.Redis:
#     global redis_client
#     if redis_client is None:
#         redis_client = aioredis.from_url(
#             settings.REDIS_URL,
#             encoding="utf-8",
#             decode_responses=True,
#         )
#     return redis_client


# async def close_redis():
#     global redis_client
#     if redis_client:
#         await redis_client.close()
#         redis_client = None


# class CacheService:
#     def __init__(self, redis: aioredis.Redis):
#         self.redis = redis
#         self.default_ttl = 300  # 5 minutes

#     async def get(self, key: str) -> Optional[Any]:
#         try:
#             value = await self.redis.get(key)
#             return json.loads(value) if value else None
#         except Exception as e:
#             logger.warning("cache_get_error", key=key, error=str(e))
#             return None

#     async def set(self, key: str, value: Any, ttl: int = None) -> bool:
#         try:
#             serialized = json.dumps(value, default=str)
#             await self.redis.setex(key, ttl or self.default_ttl, serialized)
#             return True
#         except Exception as e:
#             logger.warning("cache_set_error", key=key, error=str(e))
#             return False

#     async def delete(self, key: str) -> bool:
#         try:
#             await self.redis.delete(key)
#             return True
#         except Exception as e:
#             logger.warning("cache_delete_error", key=key, error=str(e))
#             return False

#     async def delete_pattern(self, pattern: str) -> int:
#         try:
#             keys = await self.redis.keys(pattern)
#             if keys:
#                 return await self.redis.delete(*keys)
#             return 0
#         except Exception as e:
#             logger.warning("cache_delete_pattern_error", pattern=pattern, error=str(e))
#             return 0

#     async def increment(self, key: str, amount: int = 1) -> int:
#         return await self.redis.incrby(key, amount)

#     async def exists(self, key: str) -> bool:
#         return await self.redis.exists(key) > 0

import json
from typing import Optional, Any

import redis.asyncio as redis

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

redis_client: Optional[redis.Redis] = None


async def get_redis() -> redis.Redis:
    global redis_client

    if redis_client is None:
        redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )

    return redis_client


async def close_redis():
    global redis_client

    if redis_client:
        await redis_client.aclose()
        redis_client = None


class CacheService:
    def __init__(self, redis_conn: redis.Redis):
        self.redis = redis_conn
        self.default_ttl = 300

    async def get(self, key: str) -> Optional[Any]:
        try:
            value = await self.redis.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            logger.warning("cache_get_error", key=key, error=str(e))
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        try:
            serialized = json.dumps(value, default=str)
            await self.redis.setex(key, ttl or self.default_ttl, serialized)
            return True
        except Exception as e:
            logger.warning("cache_set_error", key=key, error=str(e))
            return False

    async def delete(self, key: str) -> bool:
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.warning("cache_delete_error", key=key, error=str(e))
            return False

    async def delete_pattern(self, pattern: str) -> int:
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                return await self.redis.delete(*keys)
            return 0
        except Exception as e:
            logger.warning("cache_delete_pattern_error", pattern=pattern, error=str(e))
            return 0

    async def increment(self, key: str, amount: int = 1) -> int:
        return await self.redis.incrby(key, amount)

    async def exists(self, key: str) -> bool:
        return (await self.redis.exists(key)) > 0