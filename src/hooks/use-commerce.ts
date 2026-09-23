import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  accountService,
  checkoutService,
  orderService,
  productService,
} from '@/services/commerce'
import { CreateOrderInput, ProductFilters } from '@/types/commerce'

export const queryKeys = {
  products: (filters?: ProductFilters) => ['products', filters ?? {}] as const,
  categories: ['categories'] as const,
  currentUser: ['current-user'] as const,
  product: (id: string) => ['product', id] as const,
  addresses: ['addresses'] as const,
  payments: ['payment-methods'] as const,
  shipping: (addressId?: string, weight?: number) =>
    ['shipping', addressId, weight] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
}

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productService.getProducts(filters),
  })

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => productService.getCategories(),
  })
export const useCurrentUser = () =>
  useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => accountService.getCurrentUser(),
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  })

export const useAddresses = () =>
  useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => checkoutService.getAddresses(),
  })
export const usePaymentMethods = () =>
  useQuery({
    queryKey: queryKeys.payments,
    queryFn: () => checkoutService.getPaymentMethods(),
  })

export const useShippingRates = (
  addressId: string | undefined,
  address:
    | Parameters<typeof checkoutService.getShippingRates>[0]['destination']
    | undefined,
  weight: number
) =>
  useQuery({
    queryKey: queryKeys.shipping(addressId, weight),
    queryFn: () =>
      checkoutService.getShippingRates({ destination: address!, weight }),
    enabled: Boolean(address && weight > 0),
  })

export const useValidateVoucher = () =>
  useMutation({
    mutationFn: ({
      code,
      purchaseTotal,
    }: {
      code: string
      purchaseTotal: number
    }) => checkoutService.validateVoucher(code, purchaseTotal),
  })

export const useOrders = () =>
  useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => orderService.getOrders(),
  })
export const useOrder = (id: string) =>
  useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
  })

export const useCreateOrder = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderService.createOrder(input),
    onSuccess: order => {
      client.invalidateQueries({ queryKey: queryKeys.orders })
      client.setQueryData(queryKeys.order(order.id), order)
    },
  })
}
