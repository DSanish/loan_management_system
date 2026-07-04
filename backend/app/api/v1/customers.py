from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import math

from app.database.session import get_db
from app.schemas.schemas import CustomerCreate, CustomerUpdate, CustomerResponse, PaginatedResponse
from app.repositories.customer_repository import CustomerRepository
from app.models.models import Customer, User
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=PaginatedResponse)
async def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None, description="Search by name, email, phone, ID"),
    city: Optional[str] = None,
    state: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = CustomerRepository(db)
    skip = (page - 1) * page_size
    customers, total = await repo.search(
        query=q, city=city, state=state, is_active=is_active, skip=skip, limit=page_size,
    )
    print("TOTAL =", total)
    print("CUSTOMERS =", customers)

    items = []
    for c in customers:
        c_dict = CustomerResponse.from_orm(c).dict()
        items.append(c_dict)

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": math.ceil(total / page_size) if total > 0 else 1,
        "items": items,
    }


@router.post("", response_model=CustomerResponse, status_code=201)
async def create_customer(
    data: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = CustomerRepository(db)
    if data.email and await repo.get_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if data.national_id and await repo.get_by_national_id(data.national_id):
        raise HTTPException(status_code=400, detail="National ID already registered")
    if data.pan_number and await repo.get_by_pan(data.pan_number):
        raise HTTPException(status_code=400, detail="PAN already registered")

    customer_number = await repo.generate_customer_number()
    customer = Customer(customer_number=customer_number, **data.dict())
    return await repo.create(customer)


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = CustomerRepository(db)
    stats = await repo.get_with_loan_stats(customer_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = stats["customer"]
    response = CustomerResponse.from_orm(customer)
    response.total_loans = stats["total_loans"]
    response.active_loans = stats["active_loans"]
    response.total_outstanding = stats["total_outstanding"]
    return response


@router.patch("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = CustomerRepository(db)
    update_data = data.dict(exclude_unset=True)
    customer = await repo.update(customer_id, update_data)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.delete("/{customer_id}")
async def deactivate_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin", "loan_officer")),
):
    repo = CustomerRepository(db)
    await repo.update(customer_id, {"is_active": False})
    return {"message": "Customer deactivated"}


@router.post("/{customer_id}/blacklist")
async def blacklist_customer(
    customer_id: int,
    reason: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "superadmin")),
):
    repo = CustomerRepository(db)
    customer = await repo.get_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    await repo.update(customer_id, {"is_blacklisted": True, "blacklist_reason": reason})
    return {"message": "Customer blacklisted"}


@router.get("/{customer_id}/loans")
async def get_customer_loans(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.repositories.loan_repository import LoanRepository
    repo = CustomerRepository(db)
    customer = await repo.get_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    loan_repo = LoanRepository(db)
    loans, total = await loan_repo.search(customer_id=customer_id, limit=100)
    return {"total": total, "loans": loans}