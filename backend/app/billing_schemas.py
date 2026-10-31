from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class InvoiceGenerate(BaseModel):
    subscription_id: int
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date
    tax_rate: float = Field(default=0.0, ge=0, le=100)


class InvoiceBase(BaseModel):
    subscription_id: int
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date

    subtotal: float = Field(ge=0)
    tax_total: float = Field(default=0.0, ge=0)
    total: float = Field(ge=0)


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceResponse(InvoiceBase):
    id: int
    invoice_number: str
    amount_paid: float
    status: str

    model_config = ConfigDict(from_attributes=True)