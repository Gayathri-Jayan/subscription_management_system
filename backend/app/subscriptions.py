
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
import uuid

from .database import get_db
from .models import Subscription, User, Plan
from .schemas import SubscriptionSchema
from .dependencies import require_roles

router = APIRouter(
    prefix="/api/subscriptions",
    tags=["Subscriptions"]
)


@router.post("/")
def create_subscription(
    data: SubscriptionSchema,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    customer = db.query(User).filter(
        User.id == data.customer_id,
        User.role == "customer"
    ).first()

    if not customer:
        raise HTTPException(404, "Customer not found")

    plan = db.query(Plan).filter(
        Plan.id == data.plan_id
    ).first()

    if not plan:
        raise HTTPException(404, "Plan not found")

    if data.quantity < plan.min_quantity:
        raise HTTPException(
            400,
            f"Minimum quantity is {plan.min_quantity}"
        )

    if data.expiry_date and data.expiry_date <= data.start_date:
        raise HTTPException(400, "Expiry must be after start date")

    if plan.available_from and data.start_date < plan.available_from:
        raise HTTPException(400, "Plan is not yet available")

    if plan.available_until and data.start_date > plan.available_until:
        raise HTTPException(400, "Plan availability has ended")

    subscription = Subscription(
        subscription_number="SUB-" + uuid.uuid4().hex[:8].upper(),
        customer_id=data.customer_id,
        plan_id=data.plan_id,
        start_date=data.start_date,
        expiry_date=data.expiry_date,
        quantity=data.quantity,
        payment_terms=data.payment_terms,
        status="Draft"
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


@router.get("/")
def list_subscriptions(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    return db.query(Subscription).all()


@router.get("/my")
def my_subscriptions(
    db: Session = Depends(get_db),
    user=Depends(require_roles("customer"))
):
    return db.query(Subscription).filter(
        Subscription.customer_id == user.id
    ).all()


@router.patch("/{subscription_id}/status")
def update_subscription_status(
    subscription_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    allowed_transitions = {
        "Draft": ["Quotation"],
        "Quotation": ["Confirmed", "Closed"],
        "Confirmed": ["Active", "Closed"],
        "Active": ["Paused", "Closed"],
        "Paused": ["Active", "Closed"]
    }

    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id
    ).first()

    if not subscription:
        raise HTTPException(404, "Subscription not found")

    allowed = allowed_transitions.get(subscription.status, [])

    if new_status not in allowed:
        raise HTTPException(
            400,
            f"Cannot change {subscription.status} to {new_status}"
        )

    subscription.status = new_status

    db.commit()
    db.refresh(subscription)

    return {
        "message": "Subscription status updated",
        "subscription": subscription
    }
