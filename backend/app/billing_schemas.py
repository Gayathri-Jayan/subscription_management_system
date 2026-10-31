
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class InvoiceGenerate(BaseModel):
    subscription_id: int
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date
    tax_rate: float = Field(default=0.0, ge=0, le=100)
    discount_code: str | None = None


class InvoiceCreate(BaseModel):
    subscription_id: int
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date
    subtotal: float = Field(ge=0)
    tax_total: float = Field(default=0.0, ge=0)
    total: float = Field(ge=0)


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    subscription_id: int
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date
    subtotal: float
    tax_total: float
    discount_total: float
    total: float
    amount_paid: float
    status: str

    model_config = ConfigDict(from_attributes=True)


class PaymentCreate(BaseModel):
    invoice_id: int
    amount: float = Field(gt=0)
    payment_method: str = Field(min_length=2, max_length=40)
    notes: str | None = None


class PaymentResponse(BaseModel):
    id: int
    payment_reference: str
    invoice_id: int
    amount: float
    payment_method: str
    paid_at: datetime
    notes: str | None = None

    model_config = ConfigDict(from_attributes=True)


class DiscountCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    code: str | None = Field(default=None, max_length=50)
    discount_type: str
    value: float = Field(gt=0)
    minimum_purchase: float = Field(default=0, ge=0)
    minimum_quantity: int = Field(default=1, ge=1)
    starts_at: date | None = None
    ends_at: date | None = None
    usage_limit: int | None = Field(default=None, ge=1)
    product_id: int | None = None
    active: bool = True


class DiscountResponse(BaseModel):
    id: int
    name: str
    code: str | None
    discount_type: str
    value: float
    minimum_purchase: float
    minimum_quantity: int
    starts_at: date | None
    ends_at: date | None
    usage_limit: int | None
    usage_count: int
    product_id: int | None
    active: bool

    model_config = ConfigDict(from_attributes=True)
