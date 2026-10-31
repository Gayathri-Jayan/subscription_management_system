import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import Subscription, Plan
from .billing_models import Invoice
from .billing_schemas import InvoiceGenerate, InvoiceResponse
from .tax_service import calculate_tax
from .dependencies import require_roles


router = APIRouter(
    prefix="/api/invoices",
    tags=["Invoices"]
)


@router.post("/generate", response_model=InvoiceResponse)
def generate_invoice(
    data: InvoiceGenerate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    subscription = db.query(Subscription).filter(
        Subscription.id == data.subscription_id
    ).first()

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    if subscription.status != "Active":
        raise HTTPException(
            status_code=400,
            detail="Invoices can only be generated for Active subscriptions"
        )

    if data.billing_period_end < data.billing_period_start:
        raise HTTPException(
            status_code=400,
            detail="Billing period end must be on or after its start"
        )

    if data.due_date < data.invoice_date:
        raise HTTPException(
            status_code=400,
            detail="Due date cannot be before invoice date"
        )

    existing_invoice = db.query(Invoice).filter(
        Invoice.subscription_id == data.subscription_id,
        Invoice.billing_period_start == data.billing_period_start,
        Invoice.billing_period_end == data.billing_period_end
    ).first()

    if existing_invoice:
        raise HTTPException(
            status_code=409,
            detail="An invoice already exists for this billing period"
        )

    plan = db.query(Plan).filter(
        Plan.id == subscription.plan_id
    ).first()

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Plan not found for this subscription"
        )

    subtotal = round(plan.price * subscription.quantity, 2)
    tax_total = float(calculate_tax(subtotal, data.tax_rate))
    total = round(subtotal + tax_total, 2)

    invoice = Invoice(
        invoice_number="INV-" + uuid.uuid4().hex[:8].upper(),
        subscription_id=subscription.id,
        invoice_date=data.invoice_date,
        due_date=data.due_date,
        billing_period_start=data.billing_period_start,
        billing_period_end=data.billing_period_end,
        subtotal=subtotal,
        tax_total=tax_total,
        discount_total=0.0,
        total=total,
        amount_paid=0.0,
        status="Unpaid"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return invoice


@router.get("/", response_model=list[InvoiceResponse])
def list_invoices(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    return db.query(Invoice).all()


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return invoice