import { Order } from '@/types/commerce'
import { mockAddresses, mockPaymentMethods } from './checkout'
import { mockProducts } from './catalog'

const seedOrder = (
  id: string,
  productIndex: number,
  status: Order['status'],
  daysAgo: number
): Order => {
  const product = mockProducts[productIndex]
  const itemTotal = product.price * 2
  return {
    id,
    orderNumber: `ORD-202609${String(10 + productIndex).padStart(2, '0')}-${String(productIndex + 1).padStart(3, '0')}`,
    createdAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
    status,
    items: [
      {
        id: `${id}-item`,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0].url,
        selectedVariant: 'Hitam',
        quantity: 2,
        unitPrice: product.price,
        subtotal: itemTotal,
      },
    ],
    address: mockAddresses[0],
    shipping: {
      id: `${id}-shipping`,
      courier: { id: 'jne', name: 'JNE' },
      service: 'Regular',
      estimatedDelivery: '2–3 hari',
      price: 18000,
    },
    paymentMethod: mockPaymentMethods[0],
    trackingNumber:
      status === 'Shipped' || status === 'Delivered'
        ? `JNE${id.toUpperCase()}ID`
        : undefined,
    summary: {
      subtotal: product.originalPrice! * 2,
      productDiscount: (product.originalPrice! - product.price) * 2,
      voucherDiscount: 0,
      shippingCost: 18000,
      shippingDiscount: 0,
      serviceFee: 2500,
      grandTotal: itemTotal + 20500,
    },
  }
}

export const mockOrders: Order[] = [
  seedOrder('seed-1', 1, 'Delivered', 21),
  seedOrder('seed-2', 4, 'Shipped', 5),
  seedOrder('seed-3', 9, 'Cancelled', 42),
]
