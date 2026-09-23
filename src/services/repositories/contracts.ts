import {
  Address,
  Category,
  CreateOrderInput,
  Order,
  PaymentMethod,
  Product,
  ProductFilters,
  ShippingRate,
  ShippingRequest,
  Voucher,
  User,
} from '@/types/commerce'

export interface ProductRepository {
  getProducts(filters?: ProductFilters): Promise<Product[]>
  getProductById(id: string): Promise<Product | null>
  getCategories(): Promise<Category[]>
}

export interface CheckoutRepository {
  getAddresses(): Promise<Address[]>
  getShippingRates(request: ShippingRequest): Promise<ShippingRate[]>
  getPaymentMethods(): Promise<PaymentMethod[]>
  validateVoucher(code: string, purchaseTotal: number): Promise<Voucher>
}

export interface OrderRepository {
  createOrder(input: CreateOrderInput): Promise<Order>
  getOrders(): Promise<Order[]>
  getOrderById(id: string): Promise<Order | null>
}

export interface AccountRepository {
  getCurrentUser(): Promise<User>
}
