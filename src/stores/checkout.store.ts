import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Address, PaymentMethod, ShippingRate, Voucher } from '@/types/commerce'

interface CheckoutState {
  address?: Address
  shipping?: ShippingRate
  paymentMethod?: PaymentMethod
  voucher?: Voucher
  customAddresses: Address[]
  setAddress: (address: Address) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  setShipping: (shipping?: ShippingRate) => void
  setPaymentMethod: (method?: PaymentMethod) => void
  setVoucher: (voucher?: Voucher) => void
  clearAfterOrder: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    set => ({
      customAddresses: [],
      setAddress: address => set({ address, shipping: undefined }),
      addAddress: values =>
        set(state => {
          const address: Address = { ...values, id: `address-${Date.now()}` }
          return {
            customAddresses: [address, ...state.customAddresses],
            address,
            shipping: undefined,
          }
        }),
      setShipping: shipping => set({ shipping }),
      setPaymentMethod: paymentMethod => set({ paymentMethod }),
      setVoucher: voucher => set({ voucher }),
      clearAfterOrder: () =>
        set({
          address: undefined,
          shipping: undefined,
          paymentMethod: undefined,
          voucher: undefined,
        }),
    }),
    {
      name: '@nusamart/checkout',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        customAddresses: state.customAddresses,
        address: state.address,
        shipping: state.shipping,
        paymentMethod: state.paymentMethod,
        voucher: state.voucher,
      }),
    }
  )
)
