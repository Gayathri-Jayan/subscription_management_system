from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Plan
from .schemas import PlanSchema
from .dependencies import require_roles

router = APIRouter(prefix="/api/plans", tags=["Plans"])

@router.post("/", status_code=201)
def create_plan(data: PlanSchema, db: Session = Depends(get_db),
                user=Depends(require_roles("admin"))):
    if data.available_from and data.available_until and data.available_until < data.available_from:
        raise HTTPException(400, "Invalid availability dates")
    plan = Plan(**data.model_dump())
    db.add(plan); db.commit(); db.refresh(plan)
    return plan

@router.get("/")
def list_plans(db: Session = Depends(get_db),
               user=Depends(require_roles("admin", "staff"))):
    return db.query(Plan).order_by(Plan.id.desc()).all()

@router.get("/available")
def available_plans(db: Session = Depends(get_db)):
    today = date.today()
    return db.query(Plan).filter(
        (Plan.available_from.is_(None)) | (Plan.available_from <= today),
        (Plan.available_until.is_(None)) | (Plan.available_until >= today)
    ).all()

@router.patch("/{plan_id}")
def update_plan(plan_id: int, data: PlanSchema, db: Session = Depends(get_db),
                user=Depends(require_roles("admin"))):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan: raise HTTPException(404, "Plan not found")
    if data.available_from and data.available_until and data.available_until < data.available_from:
        raise HTTPException(400, "Invalid availability dates")
    for key, value in data.model_dump().items(): setattr(plan, key, value)
    db.commit(); db.refresh(plan)
    return plan
