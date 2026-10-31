from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import get_db
from .models import Subscription, Invoice
from .dependencies import require_roles

router = APIRouter(prefix="/api/reports", tags=["Finance Reports"])

@router.get("/dashboard")
def finance_dashboard(db: Session = Depends(get_db),
                      user=Depends(require_roles("admin", "staff"))):
    active_subscriptions = db.query(func.count(Subscription.id)).filter(Subscription.status == "Active").scalar() or 0
    revenue_received = db.query(func.coalesce(func.sum(Invoice.amount_paid), 0.0)).scalar()
    amount_owed = db.query(func.coalesce(func.sum(Invoice.total - Invoice.amount_paid), 0.0)).filter(
        Invoice.total > Invoice.amount_paid).scalar()
    overdue_amount = db.query(func.coalesce(func.sum(Invoice.total - Invoice.amount_paid), 0.0)).filter(
        Invoice.due_date < date.today(), Invoice.total > Invoice.amount_paid).scalar()
    overdue_count = db.query(func.count(Invoice.id)).filter(
        Invoice.due_date < date.today(), Invoice.total > Invoice.amount_paid).scalar() or 0
    return {
        "active_subscriptions": active_subscriptions,
        "revenue_received": round(float(revenue_received), 2),
        "amount_owed": round(float(amount_owed), 2),
        "overdue_amount": round(float(overdue_amount), 2),
        "overdue_invoice_count": overdue_count
    }

@router.get("/invoices")
def invoice_summary(db: Session = Depends(get_db),
                    user=Depends(require_roles("admin", "staff"))):
    return db.query(Invoice.status, func.count(Invoice.id).label("count"),
                    func.coalesce(func.sum(Invoice.total), 0).label("total"),
                    func.coalesce(func.sum(Invoice.amount_paid), 0).label("received")
                    ).group_by(Invoice.status).all()
