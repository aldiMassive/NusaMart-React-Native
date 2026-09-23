import { CartItem, OrderSummary, ShippingRate, Voucher } from '@/types/commerce'

interface CalculationInput {
  cartItems: CartItem[]
  shipping?: ShippingRate
  voucher?: Voucher
}

export const calculateOrderSummary = ({
  cartItems,
  shipping,
  voucher,
}: CalculationInput): OrderSummary => {
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.originalPrice ?? item.unitPrice) * item.quantity,
    0
  )
  const currentProductTotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const productDiscount = Math.max(0, subtotal - currentProductTotal)
  const shippingCost = shipping?.price ?? 0
  const eligible = voucher && currentProductTotal >= voucher.minPurchase
  const rawVoucherDiscount =
    eligible && voucher?.type === 'product'
      ? currentProductTotal * ((voucher.discountPercentage ?? 0) / 100)
      : 0
  const voucherDiscount = Math.min(
    rawVoucherDiscount,
    voucher?.maxDiscount ?? 0
  )
  const shippingDiscount =
    eligible && voucher?.type === 'shipping'
      ? Math.min(shippingCost, voucher.maxDiscount)
      : 0
  const serviceFee = cartItems.length > 0 ? 2500 : 0
  const grandTotal = Math.max(
    0,
    currentProductTotal -
      voucherDiscount +
      shippingCost -
      shippingDiscount +
      serviceFee
  )

  return {
    subtotal,
    productDiscount,
    voucherDiscount,
    shippingCost,
    shippingDiscount,
    serviceFee,
    grandTotal,
  }
}
