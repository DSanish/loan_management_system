from fastapi import APIRouter, Depends
from sqlalchemy import func, select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.core.security import get_current_user
from app.database.model import Customer, Loan, Payment, User
from fastapi.responses import StreamingResponse
import csv
import io
from openpyxl import Workbook
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

@router.get("/dashboard")
async def reports_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_customers = await db.scalar(
        select(func.count(Customer.id))
    )

    total_loans = await db.scalar(
        select(func.count(Loan.id))
    )

    active_loans = await db.scalar(
        select(func.count(Loan.id)).where(
            Loan.status == "ACTIVE"
        )
    )

    total_collection = await db.scalar(
        select(func.sum(Payment.amount))
    )

    outstanding = await db.scalar(
        select(func.sum(Loan.outstanding_principal))
    )

    overdue = await db.scalar(
        select(func.sum(Loan.total_overdue))
    )

    return {
        "total_customers": total_customers or 0,
        "total_loans": total_loans or 0,
        "active_loans": active_loans or 0,
        "total_collection": float(total_collection or 0),
        "outstanding": float(outstanding or 0),
        "overdue": float(overdue or 0),
    }

@router.get("/loans")
async def loan_reports(
    search: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        select(Loan)
        .options(selectinload(Loan.customer))
    )

    # =========================
    # Search Filter
    # =========================

    if search:
        search_value = f"%{search.strip()}%"

        query = query.where(
            or_(
                Loan.loan_number.ilike(search_value),
                Customer.first_name.ilike(search_value),
                Customer.last_name.ilike(search_value),
            )
        )

    # =========================
    # Status Filter
    # =========================

    if status:
        query = query.where(
            Loan.status == status.upper()
        )

    # =========================
    # Order
    # =========================

    query = query.order_by(
        Loan.created_at.desc()
    )

    result = await db.execute(query)

    loans = result.scalars().all()

    data = []

    for loan in loans:

        customer_name = ""

        if loan.customer:
            customer_name = (
                f"{loan.customer.first_name} "
                f"{loan.customer.last_name}"
            )

        data.append(
            {
                "id": loan.id,
                "loan_number": loan.loan_number,
                "customer": customer_name,
                "loan_amount": float(
                    loan.principal_amount or 0
                ),
                "paid": float(
                    loan.total_paid or 0
                ),
                "outstanding": float(
                    loan.outstanding_principal or 0
                ),
                "status": str(loan.status),
            }
        )

    return data

@router.get("/monthly-loans")
async def monthly_loans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        {"month": "Jan", "loans": 2},
        {"month": "Feb", "loans": 5},
        {"month": "Mar", "loans": 3},
        {"month": "Apr", "loans": 7},
        {"month": "May", "loans": 4},
        {"month": "Jun", "loans": 6},
    ]

@router.get("/collection-analytics")
async def collection_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        {"month": "Jan", "collection": 120000},
        {"month": "Feb", "collection": 180000},
        {"month": "Mar", "collection": 150000},
        {"month": "Apr", "collection": 220000},
        {"month": "May", "collection": 170000},
        {"month": "Jun", "collection": 250000},
    ]

@router.get("/export/csv")
async def export_csv(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Loan).options(selectinload(Loan.customer))
    )

    loans = result.scalars().all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Loan No",
        "Customer",
        "Loan Amount",
        "Paid",
        "Outstanding",
        "Status",
    ])

    for loan in loans:
        customer = ""

        if loan.customer:
            customer = f"{loan.customer.first_name} {loan.customer.last_name}"

        writer.writerow([
            loan.loan_number,
            customer,
            float(loan.principal_amount or 0),
            float(loan.total_paid or 0),
            float(loan.outstanding_principal or 0),
            str(loan.status),
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=loan_report.csv"
        },
    )
@router.get("/export/excel")
async def export_excel(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Loan).options(selectinload(Loan.customer))
    )

    loans = result.scalars().all()

    wb = Workbook()
    ws = wb.active
    ws.title = "Loan Report"

    ws.append([
        "Loan No",
        "Customer",
        "Loan Amount",
        "Paid",
        "Outstanding",
        "Status",
    ])

    for loan in loans:
        customer = ""
        if loan.customer:
            customer = f"{loan.customer.first_name} {loan.customer.last_name}"

        ws.append([
            loan.loan_number,
            customer,
            float(loan.principal_amount or 0),
            float(loan.total_paid or 0),
            float(loan.outstanding_principal or 0),
            str(loan.status),
        ])

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=loan_report.xlsx"
        },
    )

@router.get("/export/pdf")
async def export_pdf(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Loan).options(selectinload(Loan.customer))
    )

    loans = result.scalars().all()

    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)

    elements = []

    styles = getSampleStyleSheet()

    elements.append(
        Paragraph("<b>Loan Management System</b>", styles["Title"])
    )

    elements.append(
        Paragraph("Loan Report", styles["Heading2"])
    )

    data = [
        [
            "Loan No",
            "Customer",
            "Loan Amount",
            "Paid",
            "Outstanding",
            "Status",
        ]
    ]

    for loan in loans:
        customer = ""
        if loan.customer:
            customer = (
                f"{loan.customer.first_name} {loan.customer.last_name}"
            )

        data.append([
            loan.loan_number,
            customer,
            f"₹{float(loan.principal_amount or 0):,.2f}",
            f"₹{float(loan.total_paid or 0):,.2f}",
            f"₹{float(loan.outstanding_principal or 0):,.2f}",
            str(loan.status).replace("LoanStatus.", ""),
        ])

    table = Table(data)

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

            ("GRID", (0, 0), (-1, -1), 1, colors.grey),

            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ])
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=loan_report.pdf"
        },
    )