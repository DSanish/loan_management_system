from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Notification, NotificationType
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_notification(
        self,
        notification_type: NotificationType,
        message: str,
        subject: Optional[str] = None,
        user_id: Optional[int] = None,
        customer_id: Optional[int] = None,
        loan_id: Optional[int] = None,
        recipient_email: Optional[str] = None,
        recipient_phone: Optional[str] = None,
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            customer_id=customer_id,
            loan_id=loan_id,
            notification_type=notification_type,
            subject=subject,
            message=message,
        )

        error = None
        try:
            if notification_type == NotificationType.EMAIL and recipient_email:
                await self._send_email(recipient_email, subject or "Notification", message)
            elif notification_type == NotificationType.SMS and recipient_phone:
                await self._send_sms(recipient_phone, message)
        except Exception as e:
            error = str(e)
            logger.error("notification_failed", type=notification_type, error=error)

        from datetime import datetime
        notification.sent_at = datetime.utcnow() if not error else None
        notification.error = error

        self.db.add(notification)
        await self.db.flush()
        return notification

    async def _send_email(self, to: str, subject: str, body: str):
        if not settings.SENDGRID_API_KEY:
            logger.warning("sendgrid_not_configured", to=to)
            return
        try:
            import sendgrid
            from sendgrid.helpers.mail import Mail
            sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
            message = Mail(
                from_email=settings.FROM_EMAIL,
                to_emails=to,
                subject=subject,
                html_content=body,
            )
            sg.send(message)
            logger.info("email_sent", to=to, subject=subject)
        except Exception as e:
            logger.error("email_send_failed", to=to, error=str(e))
            raise

    async def _send_sms(self, to: str, body: str):
        if not settings.TWILIO_ACCOUNT_SID:
            logger.warning("twilio_not_configured", to=to)
            return
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            client.messages.create(body=body, from_=settings.TWILIO_PHONE_NUMBER, to=to)
            logger.info("sms_sent", to=to)
        except Exception as e:
            logger.error("sms_send_failed", to=to, error=str(e))
            raise

    async def notify_loan_approved(self, loan, customer):
        await self.send_notification(
            notification_type=NotificationType.EMAIL,
            subject=f"Loan Approved - {loan.loan_number}",
            message=f"""
            <h2>Congratulations! Your loan has been approved.</h2>
            <p>Dear {customer.first_name},</p>
            <p>Your loan application <strong>{loan.loan_number}</strong> has been approved.</p>
            <p>Approved Amount: ₹{loan.approved_amount:,.2f}</p>
            <p>EMI Amount: ₹{loan.emi_amount:,.2f}/month</p>
            <p>Tenure: {loan.tenure_months} months</p>
            """,
            customer_id=customer.id,
            loan_id=loan.id,
            recipient_email=customer.email,
        )

    async def notify_payment_due(self, payment, loan, customer):
        await self.send_notification(
            notification_type=NotificationType.SMS,
            message=f"EMI of ₹{payment.amount:,.2f} for loan {loan.loan_number} is due on {payment.due_date}. Please pay on time.",
            customer_id=customer.id,
            loan_id=loan.id,
            recipient_phone=customer.phone,
        )

    async def notify_payment_received(self, payment, loan, customer):
        await self.send_notification(
            notification_type=NotificationType.EMAIL,
            subject=f"Payment Received - {loan.loan_number}",
            message=f"""
            <h2>Payment Received</h2>
            <p>Dear {customer.first_name},</p>
            <p>We have received your payment of ₹{payment.amount:,.2f} for loan {loan.loan_number}.</p>
            <p>Outstanding Balance: ₹{loan.outstanding_principal:,.2f}</p>
            <p>Thank you for your timely payment.</p>
            """,
            customer_id=customer.id,
            loan_id=loan.id,
            recipient_email=customer.email,
        )