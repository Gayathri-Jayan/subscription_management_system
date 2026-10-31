from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Discount, Product
from .billing_schemas import DiscountCreate, DiscountResponse
from .dependencies import require_roles

router = APIRouter(prefix="/api/discounts", tags=["Discounts"])

@router.post("/", response_model=DiscountResponse, status_code=201)
def create_discount(data: DiscountCreate, db: Session = Depends(get_db),
                    user=Depends(require_roles("admin"))):
    if data.discount_type not in {"fixed", "percentage"}:
        raise HTTPException(400, "discount_type must be fixed or percentage")
    if data.discount_type == "percentage" and data.value > 100:
        raise HTTPException(400, "Percentage discount cannot exceed 100")
    if data.starts_at and data.ends_at and data.ends_at < data.starts_at:
        raise HTTPException(400, "Discount end date must not precede start date")
    if data.code and db.query(Discount).filter(Discount.code == data.code).first():
        raise HTTPException(409, "Discount code already exists")
    if data.product_id and not db.query(Product).filter(Product.id == data.product_id).first():
        raise HTTPException(404, "Product not found")
    discount = Discount(**data.model_dump())
    db.add(discount); db.commit(); db.refresh(discount)
    return discount

@router.get("/", response_model=list[DiscountResponse])
def list_discounts(db: Session = Depends(get_db), user=Depends(require_roles("admin", "staff"))):
    return db.query(Discount).order_by(Discount.id.desc()).all()

@router.patch("/{discount_id}/deactivate", response_model=DiscountResponse)
def deactivate_discount(discount_id: int, db: Session = Depends(get_db),
                        user=Depends(require_roles("admin"))):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount: raise HTTPException(404, "Discount not found")
    discount.active = False
    db.commit(); db.refresh(discount)
    return discount
