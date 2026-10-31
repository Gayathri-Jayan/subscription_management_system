import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Subscription, User, Plan
from .schemas import SubscriptionSchema, SubscriptionStatusSchema
from .dependencies import require_roles, get_current_user

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])
TRANSITIONS = {
    "Draft": {"Quotation"},
    "Quotation": {"Confirmed", "Closed"},
    "Confirmed": {"Active", "Closed"},
    "Active": {"Paused", "Closed"},
    "Paused": {"Active", "Closed"},
}

@router.post("/", status_code=201)
def create_subscription(data: SubscriptionSchema, db: Session = Depends(get_db),
                        user=Depends(require_roles("admin", "staff"))):
    customer = db.query(User).filter(User.id == data.customer_id, User.role == "customer").first()
    if not customer: raise HTTPException(404, "Customer not found")
    plan = db.query(Plan).filter(Plan.id == data.plan_id).first()
    if not plan: raise HTTPException(404, "Plan not found")
    if data.quantity < plan.min_quantity: raise HTTPException(400, f"Minimum quantity is {plan.min_quantity}")
    if data.expiry_date and data.expiry_date <= data.start_date: raise HTTPException(400, "Expiry must be after start date")
    if plan.available_from and data.start_date < plan.available_from: raise HTTPException(400, "Plan is not yet available")
    if plan.available_until and data.start_date > plan.available_until: raise HTTPException(400, "Plan availability has ended")
    sub = Subscription(subscription_number="SUB-" + uuid.uuid4().hex[:10].upper(),
                       customer_id=data.customer_id, plan_id=data.plan_id,
                       start_date=data.start_date, expiry_date=data.expiry_date,
                       quantity=data.quantity, payment_terms=data.payment_terms,
                       next_billing_date=data.start_date, status="Draft")
    db.add(sub); db.commit(); db.refresh(sub)
    return sub

@router.get("/")
def list_subscriptions(db: Session = Depends(get_db),
                       user=Depends(require_roles("admin", "staff"))):
    return db.query(Subscription).order_by(Subscription.id.desc()).all()

@router.get("/my")
def my_subscriptions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Subscription).filter(Subscription.customer_id == user.id).all()

@router.patch("/{subscription_id}/status")
def update_subscription_status(subscription_id: int, data: SubscriptionStatusSchema,
                                db: Session = Depends(get_db),
                                user=Depends(require_roles("admin", "staff"))):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub: raise HTTPException(404, "Subscription not found")
    if data.status not in TRANSITIONS.get(sub.status, set()):
        raise HTTPException(400, f"Cannot change {sub.status} to {data.status}")
    plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
    if data.status == "Paused" and not plan.allow_pause:
        raise HTTPException(400, "This plan does not allow pausing")
    if data.status == "Closed" and sub.status in {"Active", "Paused"} and not plan.allow_early_close:
        raise HTTPException(400, "This plan does not allow early closure")
    sub.status = data.status
    db.commit(); db.refresh(sub)
    return {"message": "Subscription status updated", "subscription": sub}

@router.get("/{subscription_id}")
def get_subscription(subscription_id: int, db: Session = Depends(get_db),
                     user=Depends(get_current_user)):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub: raise HTTPException(404, "Subscription not found")
    if user.role == "customer" and sub.customer_id != user.id:
        raise HTTPException(403, "You can only view your own subscription")
    if user.role not in {"admin", "staff", "customer"}:
        raise HTTPException(403, "Permission denied")
    return sub
