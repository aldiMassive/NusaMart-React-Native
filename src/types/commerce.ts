export type OrderStatus =
  'Waiting for Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
export type PaymentType = 'Bank Transfer' | 'E-Wallet' | 'Cash on Delivery'
export type VoucherType = 'product' | 'shipping'

export interface User {
  id: string
  name: string
  email: string
  phone: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
}
export interface ProductVariantOption {
  id: string
  label: string
  priceAdjustment: number
  stock: number
}
export interface ProductVariant {
  id: string
  name: string
  options: ProductVariantOption[]
}
export interface Category {
  id: string
  name: string
  icon: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  categoryId: string
  images: ProductImage[]
  rating: number
  reviewCount: number
  soldCount: number
  stock: number
  weight: number
  variants: ProductVariant[]
  featured: boolean
}

export interface ProductFilters {
  query?: string
  categoryId?: string
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'popular'
  minRating?: number
}

export interface CartItem {
  id: string
  product: Product
  selectedOptions: Record<string, ProductVariantOption>
  quantity: number
  selected: boolean
  unitPrice: number
}

export interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  province: string
  city: string
  district: string
  postalCode: string
  fullAddress: string
  isPrimary?: boolean
}

export interface Courier {
  id: string
  name: string
}
export interface ShippingRate {
  id: string
  courier: Courier
  service: string
  estimatedDelivery: string
  price: number
}

export interface Voucher {
  id: string
  code: string
  title: string
  type: VoucherType
  discountPercentage?: number
  minPurchase: number
  maxDiscount: number
  expiresAt: string
}

export interface PaymentMethod {
  id: string
  name: string
  type: PaymentType
  icon: string
}

export interface OrderSummary {
  subtotal: number
  productDiscount: number
  voucherDiscount: number
  shippingCost: number
  shippingDiscount: number
  serviceFee: number
  grandTotal: number
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  selectedVariant: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
  shipping: ShippingRate
  voucher?: Voucher
  paymentMethod: PaymentMethod
  summary: OrderSummary
  trackingNumber?: string
}

export interface ShippingRequest {
  destination: Address
  weight: number
}
export interface CreateOrderInput {
  cartItems: CartItem[]
  address: Address
  shipping: ShippingRate
  voucher?: Voucher
  paymentMethod: PaymentMethod
  summary: OrderSummary
}
