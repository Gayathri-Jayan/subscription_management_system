from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Subscription, Plan, Invoice
from .tax_service import calculate_tax
import uuid


def add_interval(day, interval):
    if interval == "daily": return day + timedelta(days=1)
    if interval == "weekly": return day + timedelta(weeks=1)
    if interval == "monthly": return day + relativedelta(months=1)
    if interval == "yearly": return day + relativedelta(years=1)
    raise ValueError("Unsupported billing interval")


def generate_due_invoices(today=None):
    """Generate one invoice for each due active subscription. Safe to call repeatedly."""
    today = today or date.today()
    db: Session = SessionLocal()
    created = []
    try:
        due_subscriptions = db.query(Subscription).filter(
            Subscription.status == "Active",
            Subscription.next_billing_date.is_not(None),
            Subscription.next_billing_date <= today
        ).all()
        for sub in due_subscriptions:
            plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
            if not plan:
                continue
            period_start = sub.next_billing_date
            period_end = add_interval(period_start, plan.billing_interval) - timedelta(days=1)
            if sub.expiry_date and period_start > sub.expiry_date:
                if plan.auto_close:
                    sub.status = "Closed"
                continue
            if sub.expiry_date:
                period_end = min(period_end, sub.expiry_date)
            exists = db.query(Invoice).filter(
                Invoice.subscription_id == sub.id,
                Invoice.billing_period_start == period_start,
                Invoice.billing_period_end == period_end
            ).first()
            if not exists:
                subtotal = round(plan.price * sub.quantity, 2)
                tax = float(calculate_tax(subtotal, 0))
                invoice = Invoice(
                    invoice_number="INV-" + uuid.uuid4().hex[:10].upper(),
                    subscription_id=sub.id, invoice_date=today,
                    due_date=today, billing_period_start=period_start,
                    billing_period_end=period_end, subtotal=subtotal,
                    tax_total=tax, discount_total=0.0, total=subtotal + tax,
                    amount_paid=0.0, status="Unpaid"
                )
                db.add(invoice)
                created.append(invoice.invoice_number)
            sub.next_billing_date = add_interval(period_start, plan.billing_interval)
            if sub.expiry_date and sub.next_billing_date > sub.expiry_date and plan.auto_close:
                sub.status = "Closed"
        db.commit()
        return {"created_count": len(created), "invoice_numbers": created}
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
