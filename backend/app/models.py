from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, Date, DateTime,
    Boolean, Text, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="customer", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    product_type = Column(String(100))
    sales_price = Column(Float, nullable=False)
    cost_price = Column(Float, default=0, nullable=False)
    notes = Column(Text)
    variants = relationship("ProductVariant", back_populates="product",
                            cascade="all, delete-orphan", lazy="selectin")


class ProductVariant(Base):
    __tablename__ = "product_variants"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    price_extra = Column(Float, default=0, nullable=False)
    product = relationship("Product", back_populates="variants")


class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    price = Column(Float, nullable=False)
    billing_interval = Column(String(20), nullable=False)
    min_quantity = Column(Integer, default=1, nullable=False)
    available_from = Column(Date)
    available_until = Column(Date)
    auto_close = Column(Boolean, default=False, nullable=False)
    allow_pause = Column(Boolean, default=True, nullable=False)
    allow_early_close = Column(Boolean, default=True, nullable=False)
    allow_renewal = Column(Boolean, default=True, nullable=False)


class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    subscription_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    expiry_date = Column(Date)
    quantity = Column(Integer, default=1, nullable=False)
    status = Column(String(30), default="Draft", nullable=False, index=True)
    payment_terms = Column(String(100), default="Due immediately")
    next_billing_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    customer = relationship("User")
    plan = relationship("Plan")


class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = (
        UniqueConstraint("subscription_id", "billing_period_start", "billing_period_end",
                         name="uq_invoice_subscription_period"),
        Index("ix_invoice_status_due_date", "status", "due_date"),
    )
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False, index=True)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    billing_period_start = Column(Date, nullable=False)
    billing_period_end = Column(Date, nullable=False)
    subtotal = Column(Float, nullable=False, default=0.0)
    tax_total = Column(Float, nullable=False, default=0.0)
    discount_total = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    amount_paid = Column(Float, nullable=False, default=0.0)
    status = Column(String(20), nullable=False, default="Unpaid", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    subscription = relationship("Subscription")


class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    payment_reference = Column(String(60), unique=True, nullable=False, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(40), nullable=False)
    paid_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text)
    recorded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    invoice = relationship("Invoice", backref="payments")


class Discount(Base):
    __tablename__ = "discounts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    code = Column(String(50), unique=True, index=True)
    discount_type = Column(String(20), nullable=False)  # fixed | percentage
    value = Column(Float, nullable=False)
    minimum_purchase = Column(Float, default=0, nullable=False)
    minimum_quantity = Column(Integer, default=1, nullable=False)
    starts_at = Column(Date)
    ends_at = Column(Date)
    usage_limit = Column(Integer)
    usage_count = Column(Integer, default=0, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    product = relationship("Product")


class DiscountUsage(Base):
    __tablename__ = "discount_usages"
    id = Column(Integer, primary_key=True, index=True)
    discount_id = Column(Integer, ForeignKey("discounts.id"), nullable=False, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow, nullable=False)
