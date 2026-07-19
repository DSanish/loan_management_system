from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.redis import get_redis, close_redis
from app.database.session import create_tables
from app.middleware.middleware import (
    RequestLoggingMiddleware,
    SecurityHeadersMiddleware,
)

# ===========================
# API Routers
# ===========================
from app.api.v1 import (
    auth,
    users,
    customers,
    loans,
    payments,
    dashboard,
    risk,
    reports,   # <-- NEW
)

logger = get_logger(__name__)


# ===========================
# Application Lifespan
# ===========================
@asynccontextmanager
async def lifespan(app: FastAPI):

    setup_logging()

    logger.info(
        "starting_application",
        app=settings.APP_NAME,
        env=settings.APP_ENV,
    )

    # Create Database Tables
    await create_tables()

    # Connect Redis
    await get_redis()

    logger.info("application_started")

    yield

    # Close Redis
    await close_redis()

    logger.info("application_stopped")


# ===========================
# FastAPI App
# ===========================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Comprehensive Loan Management System API",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ===========================
# Middleware
# ===========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,
)

app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(SecurityHeadersMiddleware)

# ===========================
# API Prefix
# ===========================

API_PREFIX = settings.API_V1_STR

# ===========================
# Routers
# ===========================

app.include_router(
    auth.router,
    prefix=API_PREFIX,
)

app.include_router(
    users.router,
    prefix=API_PREFIX,
)

app.include_router(
    customers.router,
    prefix=API_PREFIX,
)

app.include_router(
    loans.router,
    prefix=API_PREFIX,
)

app.include_router(
    payments.router,
    prefix=API_PREFIX,
)

app.include_router(
    dashboard.router,
    prefix=API_PREFIX,
)

app.include_router(
    risk.router,
    prefix=API_PREFIX,
)

# ===========================
# NEW REPORTS ROUTER
# ===========================

app.include_router(
    reports.router,
    prefix=API_PREFIX,
)

# ===========================
# Health Check
# ===========================

@app.get("/health")
async def health_check():

    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
    }


# ===========================
# Root
# ===========================

@app.get("/")
async def root():

    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/api/docs",
    }