import AsyncStorage from '@react-native-async-storage/async-storage'

import { mockOrders } from '@/mocks/orders'
import { OrderRepository } from '@/services/repositories/contracts'
import { CreateOrderInput, Order } from '@/types/commerce'
import { withLatency } from '@/utils/async'
import { selectedVariantLabel } from '@/utils/format'

const STORAGE_KEY = '@nusamart/orders'

const getLocalOrders = async (): Promise<Order[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

const makeOrderNumber = () => {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  return `ORD-${date}-${String(Math.floor(100 + Math.random() * 900))}`
}

export class MockOrderRepository implements OrderRepository {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      orderNumber: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'Waiting for Payment',
      address: input.address,
      shipping: input.shipping,
      voucher: input.voucher,
      paymentMethod: input.paymentMethod,
      summary: input.summary,
      items: input.cartItems.map(item => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0].url,
        selectedVariant: selectedVariantLabel(item.selectedOptions),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      })),
    }
    const existing = await getLocalOrders()
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([order, ...existing])
    )
    return withLatency(order)
  }

  async getOrders(): Promise<Order[]> {
    const local = await getLocalOrders()
    return withLatency(
      [...local, ...mockOrders].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      )
    )
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders()
    return orders.find(order => order.id === id) ?? null
  }
}
