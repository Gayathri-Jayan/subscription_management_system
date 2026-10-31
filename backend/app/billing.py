
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .database import get_db
from .models import Subscription, Plan, Invoice, DiscountUsage
from .billing_schemas import InvoiceGenerate, InvoiceResponse
from .tax_service import calculate_tax
from .discount_service import validate_and_calculate_discount
from .dependencies import require_roles


router = APIRouter(
    prefix="/api/invoices",
    tags=["Invoices"]
)


@router.post("/generate", response_model=InvoiceResponse, status_code=201)
def generate_invoice(
    data: InvoiceGenerate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    subscription = db.query(Subscription).filter(
        Subscription.id == data.subscription_id
    ).first()

    if not subscription:
        raise HTTPException(404, "Subscription not found")

    if subscription.status != "Active":
        raise HTTPException(
            400,
            "Invoices can only be generated for Active subscriptions"
        )

    if data.billing_period_end < data.billing_period_start:
        raise HTTPException(400, "Invalid billing period")

    if data.due_date < data.invoice_date:
        raise HTTPException(400, "Due date cannot be before invoice date")

    existing_invoice = db.query(Invoice).filter(
        Invoice.subscription_id == subscription.id,
        Invoice.billing_period_start == data.billing_period_start,
        Invoice.billing_period_end == data.billing_period_end
    ).first()

    if existing_invoice:
        raise HTTPException(
            409,
            "An invoice already exists for this billing period"
        )

    plan = db.query(Plan).filter(
        Plan.id == subscription.plan_id
    ).first()

    if not plan:
        raise HTTPException(404, "Plan not found")

    subtotal = round(plan.price * subscription.quantity, 2)

    discount, discount_total = validate_and_calculate_discount(
        db,
        data.discount_code,
        subtotal,
        subscription.quantity
    )

    taxable_amount = round(subtotal - discount_total, 2)

    tax_total = float(
        calculate_tax(taxable_amount, data.tax_rate)
    )

    total = round(taxable_amount + tax_total, 2)

    invoice = Invoice(
        invoice_number="INV-" + uuid.uuid4().hex[:10].upper(),
        subscription_id=subscription.id,
        invoice_date=data.invoice_date,
        due_date=data.due_date,
        billing_period_start=data.billing_period_start,
        billing_period_end=data.billing_period_end,
        subtotal=subtotal,
        tax_total=tax_total,
        discount_total=discount_total,
        total=total,
        amount_paid=0.0,
        status="Unpaid"
    )

    try:
        db.add(invoice)
        db.flush()

        if discount:
            usage = DiscountUsage(
                discount_id=discount.id,
                invoice_id=invoice.id,
                customer_id=subscription.customer_id,
                amount=discount_total
            )
            db.add(usage)
            discount.usage_count += 1

        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            409,
            "An invoice already exists for this billing period"
        )

    db.refresh(invoice)

    return invoice


@router.get("/", response_model=list[InvoiceResponse])
def list_invoices(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    return db.query(Invoice).order_by(
        Invoice.id.desc()
    ).all()


@router.get("/my", response_model=list[InvoiceResponse])
def my_invoices(
    db: Session = Depends(get_db),
    user=Depends(require_roles("customer"))
):
    return db.query(Invoice).join(
        Subscription
    ).filter(
        Subscription.customer_id == user.id
    ).order_by(
        Invoice.id.desc()
    ).all()


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff", "customer"))
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(404, "Invoice not found")

    if (
        user.role == "customer"
        and invoice.subscription.customer_id != user.id
    ):
        raise HTTPException(
            403,
            "You can only view your own invoices"
        )

    return invoice
