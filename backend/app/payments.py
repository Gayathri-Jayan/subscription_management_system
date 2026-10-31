import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Invoice, Payment, Subscription
from .billing_schemas import PaymentCreate, PaymentResponse
from .dependencies import require_roles

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/", response_model=PaymentResponse, status_code=201)
def record_payment(data: PaymentCreate, db: Session = Depends(get_db),
                   user=Depends(require_roles("admin", "staff"))):
    invoice = db.query(Invoice).filter(Invoice.id == data.invoice_id).first()
    if not invoice: raise HTTPException(404, "Invoice not found")
    balance = round(invoice.total - invoice.amount_paid, 2)
    if balance <= 0: raise HTTPException(400, "Invoice is already fully paid")
    if data.amount > balance + 0.001: raise HTTPException(400, f"Payment exceeds outstanding balance of {balance:.2f}")
    payment = Payment(payment_reference="PAY-" + uuid.uuid4().hex[:10].upper(),
                      invoice_id=invoice.id, amount=data.amount,
                      payment_method=data.payment_method, notes=data.notes,
                      recorded_by=user.id)
    invoice.amount_paid = round(invoice.amount_paid + data.amount, 2)
    if invoice.amount_paid >= invoice.total - 0.001:
        invoice.amount_paid = invoice.total
        invoice.status = "Paid"
    else:
        invoice.status = "Partially Paid"
    db.add(payment); db.commit(); db.refresh(payment)
    return payment

@router.get("/", response_model=list[PaymentResponse])
def list_payments(db: Session = Depends(get_db), user=Depends(require_roles("admin", "staff"))):
    return db.query(Payment).order_by(Payment.paid_at.desc()).all()

@router.get("/invoice/{invoice_id}", response_model=list[PaymentResponse])
def payments_for_invoice(invoice_id: int, db: Session = Depends(get_db),
                          user=Depends(require_roles("admin", "staff"))):
    if not db.query(Invoice).filter(Invoice.id == invoice_id).first():
        raise HTTPException(404, "Invoice not found")
    return db.query(Payment).filter(Payment.invoice_id == invoice_id).order_by(Payment.paid_at.desc()).all()
