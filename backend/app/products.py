
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import Product, ProductVariant
from .schemas import ProductSchema, VariantSchema
from .dependencies import require_roles

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.post("/")
def create_product(
    data: ProductSchema,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):
    product = Product(**data.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.get("/")
def list_products(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    return db.query(Product).all()


@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(404, "Product not found")

    return product


@router.post("/{product_id}/variants")
def add_variant(
    product_id: int,
    data: VariantSchema,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(404, "Product not found")

    variant = ProductVariant(
        product_id=product_id,
        **data.model_dump()
    )

    db.add(variant)
    db.commit()
    db.refresh(variant)

    return variant
