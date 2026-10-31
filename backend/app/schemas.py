import re
from datetime import date
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class RegisterSchema(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) <= 8:
            raise ValueError("Password must be more than 8 characters")
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must not exceed 72 UTF-8 bytes")
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
    name: str = Field(min_length=1, max_length=150)
    product_type: str = Field(min_length=1, max_length=100)
    sales_price: float = Field(ge=0)
    cost_price: float = Field(default=0, ge=0)
    notes: str = ""


class ProductUpdateSchema(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    product_type: str | None = None
    sales_price: float | None = Field(default=None, ge=0)
    cost_price: float | None = Field(default=None, ge=0)
    notes: str | None = None


class VariantSchema(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price_extra: float = Field(default=0, ge=0)


class PlanSchema(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    price: float = Field(ge=0)
    billing_interval: str
    min_quantity: int = Field(default=1, ge=1)
    available_from: date | None = None
    available_until: date | None = None
    auto_close: bool = False
    allow_pause: bool = True
    allow_early_close: bool = True
    allow_renewal: bool = True

    @field_validator("billing_interval")
    @classmethod
    def validate_interval(cls, value):
        value = value.lower()
        if value not in {"daily", "weekly", "monthly", "yearly"}:
            raise ValueError("Invalid billing interval")
        return value


class SubscriptionSchema(BaseModel):
    customer_id: int
    plan_id: int
    start_date: date
    expiry_date: date | None = None
    quantity: int = Field(default=1, ge=1)
    payment_terms: str = "Due immediately"


class SubscriptionStatusSchema(BaseModel):
    status: str


class StaffCreateSchema(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_staff_password(cls, value):
        if len(value) <= 8 or len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be 9–72 UTF-8 bytes")
        if not re.search(r"[A-Z]", value) or not re.search(r"[a-z]", value) or not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password needs uppercase, lowercase and special characters")
        return value


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
