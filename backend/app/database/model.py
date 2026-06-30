from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Enum, Numeric, Date, JSON, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base


# ─── Enums ────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    LOAN_OFFICER = "loan_officer"
    ANALYST = "analyst"
    VIEWER = "viewer"


class LoanStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISBURSED = "disbursed"
    ACTIVE = "active"
    CLOSED = "closed"
    DEFAULTED = "defaulted"
    WRITTEN_OFF = "written_off"


class LoanType(str, enum.Enum):
    PERSONAL = "personal"
    HOME = "home"
    AUTO = "auto"
    BUSINESS = "business"
    EDUCATION = "education"
    AGRICULTURE = "agriculture"
    MICROFINANCE = "microfinance"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"
    PARTIAL = "partial"
    WAIVED = "waived"


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    UPI = "upi"
    CHEQUE = "cheque"
    AUTO_DEBIT = "auto_debit"
    ONLINE = "online"


class CustomerType(str, enum.Enum):
    INDIVIDUAL = "individual"
    BUSINESS = "business"


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class EmploymentType(str, enum.Enum):
    SALARIED = "salaried"
    SELF_EMPLOYED = "self_employed"
    BUSINESS_OWNER = "business_owner"
    RETIRED = "retired"
    UNEMPLOYED = "unemployed"


class DocumentType(str, enum.Enum):
    ID_PROOF = "id_proof"
    ADDRESS_PROOF = "address_proof"
    INCOME_PROOF = "income_proof"
    BANK_STATEMENT = "bank_statement"
    COLLATERAL = "collateral"
    OTHER = "other"


class NotificationType(str, enum.Enum):
    EMAIL = "email"
    SMS = "sms"
    IN_APP = "in_app"


# ─── User ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    phone = Column(String(20))
    avatar_url = Column(String(500))
    last_login = Column(DateTime(timezone=True))
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    loans = relationship("Loan", back_populates="assigned_officer", foreign_keys="Loan.assigned_officer_id")
    audit_logs = relationship("AuditLog", back_populates="user")


# ─── Customer ─────────────────────────────────────────────────────────────────

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_number = Column(String(20), unique=True, nullable=False, index=True)
    customer_type = Column(Enum(CustomerType), default=CustomerType.INDIVIDUAL)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20), nullable=False)
    alternate_phone = Column(String(20))
    date_of_birth = Column(Date)
    gender = Column(Enum(Gender))
    nationality = Column(String(100))
    national_id = Column(String(50), unique=True, index=True)
    pan_number = Column(String(20), unique=True, index=True)
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100), default="India")
    employment_type = Column(Enum(EmploymentType))
    employer_name = Column(String(255))
    monthly_income = Column(Numeric(15, 2))
    annual_income = Column(Numeric(15, 2))
    credit_score = Column(Integer)
    credit_score_updated_at = Column(DateTime(timezone=True))
    bank_name = Column(String(255))
    bank_account_number = Column(String(50))
    bank_ifsc_code = Column(String(20))
    is_active = Column(Boolean, default=True)
    is_blacklisted = Column(Boolean, default=False)
    blacklist_reason = Column(Text)
    notes = Column(Text)
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    loans = relationship("Loan", back_populates="customer")
    documents = relationship("Document", back_populates="customer")
    risk_assessments = relationship("RiskAssessment", back_populates="customer")

    __table_args__ = (
        Index("ix_customers_name", "first_name", "last_name"),
    )


# ─── Loan ─────────────────────────────────────────────────────────────────────

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    loan_number = Column(String(30), unique=True, nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), index=True)
    loan_type = Column(Enum(LoanType), nullable=False)
    status = Column(Enum(LoanStatus), default=LoanStatus.DRAFT, nullable=False, index=True)
    principal_amount = Column(Numeric(15, 2), nullable=False)
    approved_amount = Column(Numeric(15, 2))
    disbursed_amount = Column(Numeric(15, 2))
    interest_rate = Column(Numeric(6, 3), nullable=False)
    tenure_months = Column(Integer, nullable=False)
    emi_amount = Column(Numeric(15, 2))
    total_interest = Column(Numeric(15, 2))
    total_payable = Column(Numeric(15, 2))
    outstanding_principal = Column(Numeric(15, 2))
    total_paid = Column(Numeric(15, 2), default=0)
    total_overdue = Column(Numeric(15, 2), default=0)
    purpose = Column(Text)
    collateral_type = Column(String(100))
    collateral_value = Column(Numeric(15, 2))
    collateral_description = Column(Text)
    application_date = Column(DateTime(timezone=True), server_default=func.now())
    approval_date = Column(DateTime(timezone=True))
    disbursement_date = Column(DateTime(timezone=True))
    first_emi_date = Column(Date)
    last_emi_date = Column(Date)
    closure_date = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    processing_fee = Column(Numeric(10, 2), default=0)
    insurance_amount = Column(Numeric(10, 2), default=0)
    prepayment_penalty_rate = Column(Numeric(5, 2), default=2.0)
    late_fee_rate = Column(Numeric(5, 2), default=2.0)
    risk_score = Column(Float)
    risk_grade = Column(String(5))
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="loans")
    assigned_officer = relationship("User", back_populates="loans", foreign_keys=[assigned_officer_id])
    payments = relationship("Payment", back_populates="loan", order_by="Payment.due_date")
    documents = relationship("Document", back_populates="loan")
    amortization_schedule = relationship("AmortizationSchedule", back_populates="loan", order_by="AmortizationSchedule.installment_number")
    status_history = relationship("LoanStatusHistory", back_populates="loan", order_by="LoanStatusHistory.created_at")

    __table_args__ = (
        Index("ix_loans_status_type", "status", "loan_type"),
        Index("ix_loans_customer_status", "customer_id", "status"),
    )


# ─── AmortizationSchedule ────────────────────────────────────────────────────

class AmortizationSchedule(Base):
    __tablename__ = "amortization_schedules"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False, index=True)
    installment_number = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    opening_balance = Column(Numeric(15, 2))
    emi_amount = Column(Numeric(15, 2))
    principal_component = Column(Numeric(15, 2))
    interest_component = Column(Numeric(15, 2))
    closing_balance = Column(Numeric(15, 2))
    is_paid = Column(Boolean, default=False)
    paid_date = Column(Date)
    paid_amount = Column(Numeric(15, 2))

    loan = relationship("Loan", back_populates="amortization_schedule")


# ─── Payment ──────────────────────────────────────────────────────────────────

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_number = Column(String(30), unique=True, nullable=False, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False, index=True)
    installment_number = Column(Integer)
    amount = Column(Numeric(15, 2), nullable=False)
    principal_paid = Column(Numeric(15, 2))
    interest_paid = Column(Numeric(15, 2))
    late_fee_paid = Column(Numeric(15, 2), default=0)
    due_date = Column(Date, nullable=False)
    payment_date = Column(Date)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)
    payment_method = Column(Enum(PaymentMethod))
    transaction_reference = Column(String(100))
    transaction_id = Column(String(100))
    days_overdue = Column(Integer, default=0)
    late_fee = Column(Numeric(10, 2), default=0)
    waiver_amount = Column(Numeric(10, 2), default=0)
    waiver_reason = Column(Text)
    notes = Column(Text)
    received_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    loan = relationship("Loan", back_populates="payments")
    received_by = relationship("User", foreign_keys=[received_by_id])

    __table_args__ = (
        Index("ix_payments_loan_status", "loan_id", "status"),
        Index("ix_payments_due_date", "due_date", "status"),
    )


# ─── Document ─────────────────────────────────────────────────────────────────

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    loan_id = Column(Integer, ForeignKey("loans.id"))
    document_type = Column(Enum(DocumentType), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    is_verified = Column(Boolean, default=False)
    verified_by_id = Column(Integer, ForeignKey("users.id"))
    verified_at = Column(DateTime(timezone=True))
    expiry_date = Column(Date)
    notes = Column(Text)
    uploaded_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="documents")
    loan = relationship("Loan", back_populates="documents")
    uploaded_by = relationship("User", foreign_keys=[uploaded_by_id])
    verified_by = relationship("User", foreign_keys=[verified_by_id])


# ─── RiskAssessment ───────────────────────────────────────────────────────────

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    credit_score = Column(Integer)
    income_debt_ratio = Column(Float)
    loan_to_value_ratio = Column(Float)
    employment_stability_score = Column(Float)
    payment_history_score = Column(Float)
    overall_risk_score = Column(Float)
    risk_grade = Column(String(5))
    recommendation = Column(String(50))
    max_recommended_amount = Column(Numeric(15, 2))
    notes = Column(Text)
    assessed_by_id = Column(Integer, ForeignKey("users.id"))
    model_version = Column(String(20))
    raw_features = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="risk_assessments")
    loan = relationship("Loan")
    assessed_by = relationship("User")


# ─── LoanStatusHistory ────────────────────────────────────────────────────────

class LoanStatusHistory(Base):
    __tablename__ = "loan_status_history"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False, index=True)
    from_status = Column(Enum(LoanStatus))
    to_status = Column(Enum(LoanStatus), nullable=False)
    changed_by_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    loan = relationship("Loan", back_populates="status_history")
    changed_by = relationship("User")


# ─── Notification ─────────────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), index=True)
    notification_type = Column(Enum(NotificationType), nullable=False)
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    sent_at = Column(DateTime(timezone=True))
    read_at = Column(DateTime(timezone=True))
    error = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")


# ─── AuditLog ─────────────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50))
    resource_id = Column(Integer)
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        Index("ix_audit_resource", "resource_type", "resource_id"),
    )