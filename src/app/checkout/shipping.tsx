import { router } from 'expo-router'
import { useMemo } from 'react'

import { ShippingOption } from '@/components/commerce/checkout-components'
import {
  AppHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
} from '@/components/ui/primitives'
import { useShippingRates } from '@/hooks/use-commerce'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'

export default function ShippingScreen() {
  const address = useCheckoutStore(state => state.address)
  const selected = useCheckoutStore(state => state.shipping)
  const setShipping = useCheckoutStore(state => state.setShipping)
  const cartItems = useCartStore(state => state.items)
  const items = useMemo(
    () => cartItems.filter(item => item.selected),
    [cartItems]
  )
  const weight = items.reduce(
    (sum, item) => sum + item.product.weight * item.quantity,
    0
  )
  const rates = useShippingRates(address?.id, address, weight)

  if (!address)
    return (
      <Screen>
        <AppHeader title="Pilih pengiriman" />
        <EmptyState
          icon="📍"
          title="Alamat belum dipilih"
          message="Pilih alamat tujuan sebelum melihat ongkos kirim."
          action="Pilih alamat"
          onAction={() => router.replace('/checkout/address')}
        />
      </Screen>
    )
  return (
    <Screen>
      <AppHeader title="Pilih pengiriman" />
      {rates.isLoading ? (
        <LoadingState label="Menghitung ongkos kirim…" />
      ) : rates.isError ? (
        <ErrorState
          message="Ongkos kirim belum tersedia."
          onRetry={() => rates.refetch()}
        />
      ) : !rates.data?.length ? (
        <EmptyState
          title="Pengiriman tidak tersedia"
          message="Belum ada layanan untuk alamat ini."
        />
      ) : (
        rates.data.map(rate => (
          <ShippingOption
            key={rate.id}
            rate={rate}
            selected={selected?.id === rate.id}
            onPress={() => {
              setShipping(rate)
              router.back()
            }}
          />
        ))
      )}
    </Screen>
  )
}
