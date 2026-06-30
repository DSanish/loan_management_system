from decimal import Decimal, ROUND_HALF_UP
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.models import Payment, Loan, PaymentStatus, LoanStatus
from app.schemas.schemas import PaymentCreate, PaymentWaiver
from app.repositories.payment_repository import PaymentRepository
from app.repositories.loan_repository import LoanRepository
from app.core.logging import get_logger

logger = get_logger(__name__)


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.payment_repo = PaymentRepository(db)
        self.loan_repo = LoanRepository(db)

    async def record_payment(self, data: PaymentCreate, received_by_id: int) -> Payment:
        loan = await self.loan_repo.get_by_id(data.loan_id)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        if loan.status not in [LoanStatus.ACTIVE, LoanStatus.DEFAULTED]:
            raise HTTPException(status_code=400, detail="Payments can only be made on active loans")

        next_payment = await self.payment_repo.get_next_pending_payment(data.loan_id)
        if not next_payment:
            raise HTTPException(status_code=400, detail="No pending payments found")

        days_overdue = max(0, (data.payment_date - next_payment.due_date).days) if next_payment.due_date < data.payment_date else 0
        late_fee = Decimal("0")
        if days_overdue > 0:
            late_fee = (next_payment.amount * loan.late_fee_rate / 100).quantize(Decimal("0.01"))

        payment_number = await self.payment_repo.generate_payment_number()

        next_payment.payment_date = data.payment_date
        next_payment.amount = data.amount
        next_payment.payment_method = data.payment_method
        next_payment.transaction_reference = data.transaction_reference
        next_payment.days_overdue = days_overdue
        next_payment.late_fee = late_fee
        next_payment.late_fee_paid = late_fee if data.amount >= next_payment.amount + late_fee else Decimal("0")
        next_payment.notes = data.notes
        next_payment.received_by_id = received_by_id
        next_payment.status = PaymentStatus.PAID
        next_payment.payment_number = payment_number if not next_payment.payment_number else next_payment.payment_number

        loan.total_paid = (loan.total_paid or Decimal("0")) + data.amount
        loan.outstanding_principal = max(
            Decimal("0"),
            (loan.outstanding_principal or Decimal("0")) - next_payment.principal_paid
        )

        if days_overdue > 0:
            loan.total_overdue = max(Decimal("0"), (loan.total_overdue or Decimal("0")) - next_payment.amount)

        remaining_payments = await self.db.execute(
            __import__("sqlalchemy").select(Payment).where(
                __import__("sqlalchemy").and_(
                    Payment.loan_id == data.loan_id,
                    Payment.status == PaymentStatus.PENDING,
                )
            )
        )
        remaining = remaining_payments.scalars().all()
        if not remaining:
            from app.services.loan_service import LoanService
            loan_svc = LoanService(self.db)
            await loan_svc.close_loan(loan.id, received_by_id, "All installments paid")

        await self.db.flush()
        logger.info("payment_recorded", loan_id=data.loan_id, amount=str(data.amount))
        return next_payment

    async def apply_waiver(self, payment_id: int, data: PaymentWaiver, waived_by_id: int) -> Payment:
        payment = await self.payment_repo.get_by_id(payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        if payment.status == PaymentStatus.PAID:
            raise HTTPException(status_code=400, detail="Cannot waive a paid payment")
        if data.waiver_amount > payment.late_fee:
            raise HTTPException(status_code=400, detail="Waiver cannot exceed late fee")

        payment.waiver_amount = data.waiver_amount
        payment.waiver_reason = data.reason
        await self.db.flush()
        return payment

    async def update_overdue_payments(self):
        """Mark pending payments past due date as overdue."""
        from sqlalchemy import update, and_
        today = date.today()
        await self.db.execute(
            update(Payment)
            .where(
                and_(
                    Payment.due_date < today,
                    Payment.status == PaymentStatus.PENDING,
                )
            )
            .values(
                status=PaymentStatus.OVERDUE,
                days_overdue=(today - Payment.due_date).days,
            )
        )
        await self.db.flush()