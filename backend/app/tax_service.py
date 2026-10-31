from decimal import Decimal, ROUND_HALF_UP


def calculate_tax(subtotal: float, tax_rate: float) -> Decimal:
    """
    Calculate tax for a subtotal.

    tax_rate is a percentage, e.g. 18 for 18%.
    """
    if subtotal < 0:
        raise ValueError("Subtotal cannot be negative")

    if tax_rate < 0 or tax_rate > 100:
        raise ValueError("Tax rate must be between 0 and 100")

    amount = Decimal(str(subtotal))
    rate = Decimal(str(tax_rate))

    tax = amount * rate / Decimal("100")

    return tax.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)