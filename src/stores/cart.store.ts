import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { CartItem, Product, ProductVariantOption } from '@/types/commerce'

interface CartState {
  items: CartItem[]
  addItem: (
    product: Product,
    options: Record<string, ProductVariantOption>,
    quantity: number,
    exclusive?: boolean
  ) => string
  setQuantity: (id: string, quantity: number) => void
  toggleItem: (id: string) => void
  selectAll: (selected: boolean) => void
  removeItem: (id: string) => void
  removePurchased: (ids: string[]) => void
}

const itemId = (
  productId: string,
  options: Record<string, ProductVariantOption>
) => {
  const suffix = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, option]) => `${key}:${option.id}`)
    .join('|')
  return `${productId}::${suffix || 'default'}`
}

const availableStock = (item: CartItem) => {
  const optionStocks = Object.values(item.selectedOptions).map(
    option => option.stock
  )
  return Math.min(item.product.stock, ...optionStocks, item.product.stock)
}

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],
      addItem: (product, options, quantity, exclusive = false) => {
        const id = itemId(product.id, options)
        const adjustment = Object.values(options).reduce(
          (sum, option) => sum + option.priceAdjustment,
          0
        )
        set(state => {
          const baseItems = exclusive
            ? state.items.map(item => ({ ...item, selected: false }))
            : state.items
          const existing = baseItems.find(item => item.id === id)
          if (existing) {
            return {
              items: baseItems.map(item =>
                item.id === id
                  ? {
                      ...item,
                      selected: true,
                      quantity: Math.min(
                        availableStock(item),
                        item.quantity + quantity
                      ),
                    }
                  : item
              ),
            }
          }
          return {
            items: [
              ...baseItems,
              {
                id,
                product,
                selectedOptions: options,
                quantity: Math.min(quantity, product.stock),
                selected: true,
                unitPrice: product.price + adjustment,
              },
            ],
          }
        })
        return id
      },
      setQuantity: (id, quantity) =>
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(quantity, availableStock(item))
                  ),
                }
              : item
          ),
        })),
      toggleItem: id =>
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
          ),
        })),
      selectAll: selected =>
        set(state => ({
          items: state.items.map(item => ({ ...item, selected })),
        })),
      removeItem: id =>
        set(state => ({ items: state.items.filter(item => item.id !== id) })),
      removePurchased: ids =>
        set(state => ({
          items: state.items.filter(item => !ids.includes(item.id)),
        })),
    }),
    { name: '@nusamart/cart', storage: createJSONStorage(() => AsyncStorage) }
  )
)

export const selectSelectedCartItems = (state: CartState) =>
  state.items.filter(item => item.selected)
