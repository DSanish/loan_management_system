from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.redis import get_redis, close_redis
from app.database.session import create_tables
from app.middleware.middleware import RequestLoggingMiddleware, SecurityHeadersMiddleware
from app.api.v1 import auth, users, customers, loans, payments, dashboard, risk

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()

    logger.info(
        "starting_application",
        app=settings.APP_NAME,
        env=settings.APP_ENV,
    )

    # Create all database tables
    await create_tables()

    # Connect Redis
    await get_redis()

    logger.info("application_started")

    yield

    await close_redis()

    logger.info("application_stopped")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Comprehensive Loan Management System API",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# ─── Routers ──────────────────────────────────────────────────────────────────
API_PREFIX = settings.API_V1_STR
app.include_router(auth.router,      prefix=API_PREFIX)
app.include_router(users.router,     prefix=API_PREFIX)
app.include_router(customers.router, prefix=API_PREFIX)
app.include_router(loans.router,     prefix=API_PREFIX)
app.include_router(payments.router,  prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)
app.include_router(risk.router,      prefix=API_PREFIX)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
    }


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/api/docs"}