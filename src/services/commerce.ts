import { MockCheckoutRepository } from './repositories/mock-checkout.repository'
import { MockOrderRepository } from './repositories/mock-order.repository'
import { MockProductRepository } from './repositories/mock-product.repository'
import { MockAccountRepository } from './repositories/mock-account.repository'

export const productService = new MockProductRepository()
export const checkoutService = new MockCheckoutRepository()
export const orderService = new MockOrderRepository()
export const accountService = new MockAccountRepository()
