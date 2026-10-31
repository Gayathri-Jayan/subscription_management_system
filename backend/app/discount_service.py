from datetime import date
from fastapi import HTTPException
from .models import Discount

def validate_and_calculate_discount(db, code, subtotal, quantity, product_id=None):
    if not code:
        return None, 0.0
    discount = db.query(Discount).filter(Discount.code == code, Discount.active.is_(True)).first()
    if not discount:
        raise HTTPException(400, "Invalid or inactive discount code")
    today = date.today()
    if discount.starts_at and today < discount.starts_at:
        raise HTTPException(400, "Discount is not active yet")
    if discount.ends_at and today > discount.ends_at:
        raise HTTPException(400, "Discount has expired")
    if discount.usage_limit is not None and discount.usage_count >= discount.usage_limit:
        raise HTTPException(400, "Discount usage limit reached")
    if subtotal < discount.minimum_purchase or quantity < discount.minimum_quantity:
        raise HTTPException(400, "Discount minimum purchase or quantity not met")
    if discount.product_id is not None and discount.product_id != product_id:
        raise HTTPException(400, "Discount does not apply to this product")
    if discount.discount_type == "percentage":
        amount = subtotal * discount.value / 100
    elif discount.discount_type == "fixed":
        amount = discount.value
    else:
        raise HTTPException(400, "Unsupported discount type")
    return discount, round(min(amount, subtotal), 2)
