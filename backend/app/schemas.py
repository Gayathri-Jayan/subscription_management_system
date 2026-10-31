
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date
import re


class RegisterSchema(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) <= 8:
            raise ValueError("Password must be more than 8 characters")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Add an uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Add a lowercase letter")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Add a special character")
        return value


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class ProductSchema(BaseModel):
    name: str
    product_type: str
    sales_price: float = Field(ge=0)
    cost_price: float = Field(ge=0)
    notes: str = ""


class VariantSchema(BaseModel):
    name: str
    price_extra: float = Field(ge=0)


class PlanSchema(BaseModel):
    name: str
    price: float = Field(ge=0)
    billing_interval: str
    min_quantity: int = Field(ge=1)
    available_from: date | None = None
    available_until: date | None = None
    auto_close: bool = False
    allow_pause: bool = True
    allow_early_close: bool = True
    allow_renewal: bool = True

    @field_validator("billing_interval")
    @classmethod
    def validate_interval(cls, value):
        if value.lower() not in ["daily", "weekly", "monthly", "yearly"]:
            raise ValueError("Invalid billing interval")
        return value.lower()


class SubscriptionSchema(BaseModel):
    customer_id: int
    plan_id: int
    start_date: date
    expiry_date: date | None = None
    quantity: int = Field(ge=1)
    payment_terms: str = "Due immediately"
