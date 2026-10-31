from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from .database import get_db
from .models import Product, ProductVariant
from .schemas import ProductSchema, ProductUpdateSchema, VariantSchema
from .dependencies import require_roles

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.post("/", status_code=201)
def create_product(data: ProductSchema, db: Session = Depends(get_db),
                   user=Depends(require_roles("admin"))):
    product = Product(**data.model_dump())
    db.add(product); db.commit(); db.refresh(product)
    return product

@router.get("/")
def list_products(db: Session = Depends(get_db),
                  user=Depends(require_roles("admin", "staff"))):
    return db.query(Product).options(selectinload(Product.variants)).order_by(Product.id.desc()).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db),
                user=Depends(require_roles("admin", "staff"))):
    product = db.query(Product).options(selectinload(Product.variants)).filter(Product.id == product_id).first()
    if not product: raise HTTPException(404, "Product not found")
    return product

@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductUpdateSchema, db: Session = Depends(get_db),
                   user=Depends(require_roles("admin"))):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product: raise HTTPException(404, "Product not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit(); db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db),
                   user=Depends(require_roles("admin"))):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product: raise HTTPException(404, "Product not found")
    db.delete(product); db.commit()

@router.post("/{product_id}/variants", status_code=201)
def add_variant(product_id: int, data: VariantSchema, db: Session = Depends(get_db),
                user=Depends(require_roles("admin"))):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product: raise HTTPException(404, "Product not found")
    variant = ProductVariant(product_id=product_id, **data.model_dump())
    db.add(variant); db.commit(); db.refresh(variant)
    return variant
