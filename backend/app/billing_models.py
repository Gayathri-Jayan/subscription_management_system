from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
)

from .database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    invoice_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    subscription_id = Column(
        Integer,
        ForeignKey("subscriptions.id"),
        nullable=False,
        index=True,
    )

    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)

    billing_period_start = Column(Date, nullable=False)
    billing_period_end = Column(Date, nullable=False)

    subtotal = Column(Float, nullable=False, default=0.0)
    tax_total = Column(Float, nullable=False, default=0.0)
    discount_total = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    amount_paid = Column(Float, nullable=False, default=0.0)

    status = Column(String(20), nullable=False, default="Draft")

    created_at = Column(DateTime, default=datetime.utcnow)