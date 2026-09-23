import { router } from 'expo-router'

import { AddressCard } from '@/components/commerce/checkout-components'
import {
  AppHeader,
  ErrorState,
  LoadingState,
  PrimaryButton,
  Screen,
} from '@/components/ui/primitives'
import { useAddresses } from '@/hooks/use-commerce'
import { useCheckoutStore } from '@/stores/checkout.store'

export default function AddressScreen() {
  const query = useAddresses()
  const selected = useCheckoutStore(state => state.address)
  const custom = useCheckoutStore(state => state.customAddresses)
  const setAddress = useCheckoutStore(state => state.setAddress)

  return (
    <Screen>
      <AppHeader title="Pilih alamat" />
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : (
        <>
          {[...custom, ...(query.data ?? [])].map(address => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selected?.id === address.id}
              onPress={() => {
                setAddress(address)
                router.back()
              }}
            />
          ))}
          <PrimaryButton
            title="+ Tambah alamat baru"
            variant="outline"
            onPress={() => router.push('/checkout/address-new')}
          />
        </>
      )}
    </Screen>
  )
}
