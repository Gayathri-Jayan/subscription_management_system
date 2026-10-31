
from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey,
    Date, DateTime, Boolean, Text
)
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="customer")
    created_at = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    product_type = Column(String(100))
    sales_price = Column(Float, nullable=False)
    cost_price = Column(Float, default=0)
    notes = Column(Text)

    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan"
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    name = Column(String(100), nullable=False)
    price_extra = Column(Float, default=0)

    product = relationship("Product", back_populates="variants")


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    price = Column(Float, nullable=False)
    billing_interval = Column(String(20), nullable=False)
    min_quantity = Column(Integer, default=1)
    available_from = Column(Date)
    available_until = Column(Date)
    auto_close = Column(Boolean, default=False)
    allow_pause = Column(Boolean, default=True)
    allow_early_close = Column(Boolean, default=True)
    allow_renewal = Column(Boolean, default=True)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    subscription_number = Column(String(50), unique=True, index=True)

    customer_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("plans.id"))

    start_date = Column(Date, nullable=False)
    expiry_date = Column(Date)

    quantity = Column(Integer, default=1)
    status = Column(String(30), default="Draft")
    payment_terms = Column(String(100))

    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("User")
    plan = relationship("Plan")
