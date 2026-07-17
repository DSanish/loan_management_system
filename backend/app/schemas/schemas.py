from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Any
from datetime import datetime, date
from decimal import Decimal
from app.models.models import (
    UserRole, LoanStatus, LoanType, PaymentStatus, PaymentMethod,
    CustomerType, Gender, EmploymentType, DocumentType
)


# ─── Shared ───────────────────────────────────────────────────────────────────

from typing import Any

class PaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    pages: int
    items: List[Any]


# ─── Auth ─────────────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefresh(BaseModel):
    refresh_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ─── User ─────────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: UserRole = UserRole.VIEWER
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

    @validator("password")
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    last_login: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Customer ─────────────────────────────────────────────────────────────────

class CustomerBase(BaseModel):
    customer_type: CustomerType = CustomerType.INDIVIDUAL
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., max_length=100)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=10, max_length=20)
    alternate_phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    nationality: Optional[str] = None
    national_id: Optional[str] = None
    pan_number: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "India"
    employment_type: Optional[EmploymentType] = None
    employer_name: Optional[str] = None
    monthly_income: Optional[Decimal] = None
    annual_income: Optional[Decimal] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    notes: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    alternate_phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    employer_name: Optional[str] = None
    monthly_income: Optional[Decimal] = None
    annual_income: Optional[Decimal] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class CustomerResponse(CustomerBase):
    id: int
    customer_number: str
    credit_score: Optional[int]
    credit_score_updated_at: Optional[datetime]
    is_active: bool
    is_blacklisted: bool
    created_at: datetime
    updated_at: Optional[datetime]
    total_loans: Optional[int] = 0
    active_loans: Optional[int] = 0
    total_outstanding: Optional[Decimal] = Decimal("0")

    class Config:
        from_attributes = True


# ─── Loan ─────────────────────────────────────────────────────────────────────

class LoanCreate(BaseModel):
    customer_id: int
    loan_type: LoanType
    principal_amount: Decimal = Field(..., gt=0)
    interest_rate: Decimal = Field(..., gt=0, le=100)
    tenure_months: int = Field(..., ge=1, le=360)
    purpose: Optional[str] = None
    collateral_type: Optional[str] = None
    collateral_value: Optional[Decimal] = None
    collateral_description: Optional[str] = None
    processing_fee: Optional[Decimal] = Decimal("0")
    insurance_amount: Optional[Decimal] = Decimal("0")
    assigned_officer_id: Optional[int] = None


class LoanUpdate(BaseModel):
    interest_rate: Optional[Decimal] = None
    tenure_months: Optional[int] = None
    purpose: Optional[str] = None
    collateral_type: Optional[str] = None
    collateral_value: Optional[Decimal] = None
    assigned_officer_id: Optional[int] = None
    processing_fee: Optional[Decimal] = None
    insurance_amount: Optional[Decimal] = None


class LoanApproval(BaseModel):
    approved_amount: Decimal = Field(..., gt=0)
    interest_rate: Optional[Decimal] = None
    notes: Optional[str] = None


class LoanRejection(BaseModel):
    reason: str = Field(..., min_length=10)


class LoanDisbursement(BaseModel):
    disbursed_amount: Decimal = Field(..., gt=0)
    first_emi_date: date
    disbursement_date: Optional[date] = None
    transaction_reference: Optional[str] = None


class AmortizationScheduleItem(BaseModel):
    installment_number: int
    due_date: date
    opening_balance: Decimal
    emi_amount: Decimal
    principal_component: Decimal
    interest_component: Decimal
    closing_balance: Decimal
    is_paid: bool = False

    class Config:
        from_attributes = True


class LoanResponse(BaseModel):
    id: int
    loan_number: str
    customer_id: int
    assigned_officer_id: Optional[int]
    loan_type: LoanType
    status: LoanStatus
    principal_amount: Decimal
    approved_amount: Optional[Decimal]
    disbursed_amount: Optional[Decimal]
    interest_rate: Decimal
    tenure_months: int
    emi_amount: Optional[Decimal]
    total_interest: Optional[Decimal]
    total_payable: Optional[Decimal]
    outstanding_principal: Optional[Decimal]
    total_paid: Optional[Decimal]
    total_overdue: Optional[Decimal]
    purpose: Optional[str]
    collateral_type: Optional[str]
    collateral_value: Optional[Decimal]
    processing_fee: Optional[Decimal]
    risk_score: Optional[float]
    risk_grade: Optional[str]
    application_date: datetime
    approval_date: Optional[datetime]
    disbursement_date: Optional[datetime]
    first_emi_date: Optional[date]
    last_emi_date: Optional[date]
    closure_date: Optional[datetime]
    rejection_reason: Optional[str]
    created_at: datetime
    customer: Optional[CustomerResponse] = None

    class Config:
        from_attributes = True


# ─── Payment ──────────────────────────────────────────────────────────────────

class PaymentCreate(BaseModel):
    loan_id: int
    amount: Decimal = Field(..., gt=0)
    payment_date: date
    payment_method: PaymentMethod
    transaction_reference: Optional[str] = None
    notes: Optional[str] = None


class PaymentUpdate(BaseModel):
    payment_method: Optional[PaymentMethod] = None
    transaction_reference: Optional[str] = None
    notes: Optional[str] = None


class PaymentWaiver(BaseModel):
    waiver_amount: Decimal = Field(..., gt=0)
    reason: str = Field(..., min_length=5)




class PaymentResponse(BaseModel):
    id: int
    payment_number: str

    loan_id: int
    loan_number: Optional[str] = None
    customer_name: Optional[str] = None

    installment_number: Optional[int]

    amount: Decimal
    principal_paid: Optional[Decimal]
    interest_paid: Optional[Decimal]
    late_fee_paid: Optional[Decimal]

    due_date: date
    payment_date: Optional[date]

    status: PaymentStatus
    payment_method: Optional[PaymentMethod]
    transaction_reference: Optional[str]

    days_overdue: int
    late_fee: Optional[Decimal]
    waiver_amount: Optional[Decimal]

    created_at: datetime

    class Config:
        from_attributes = True


# ─── Risk ─────────────────────────────────────────────────────────────────────

class RiskAssessmentResponse(BaseModel):
    id: int
    loan_id: int
    customer_id: int
    credit_score: Optional[int]
    income_debt_ratio: Optional[float]
    loan_to_value_ratio: Optional[float]
    employment_stability_score: Optional[float]
    payment_history_score: Optional[float]
    overall_risk_score: Optional[float]
    risk_grade: Optional[str]
    recommendation: Optional[str]
    max_recommended_amount: Optional[Decimal]
    notes: Optional[str]
    model_version: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_loans: int
    active_loans: int
    total_disbursed: Decimal
    total_outstanding: Decimal
    total_collected: Decimal
    overdue_loans: int
    overdue_amount: Decimal
    new_applications: int
    approvals_today: int
    collection_rate: float
    npa_rate: float
    total_customers: int
    new_customers_this_month: int


class LoanStatusBreakdown(BaseModel):
    status: str
    count: int
    amount: Decimal


class MonthlyCollection(BaseModel):
    month: str
    collected: Decimal
    expected: Decimal
    overdue: Decimal