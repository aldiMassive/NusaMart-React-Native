import { router } from 'expo-router'
import { View } from 'react-native'

import { PaymentOption } from '@/components/commerce/checkout-components'
import {
  AppHeader,
  ErrorState,
  LoadingState,
  Screen,
  SectionTitle,
} from '@/components/ui/primitives'
import { usePaymentMethods } from '@/hooks/use-commerce'
import { useCheckoutStore } from '@/stores/checkout.store'

export default function PaymentScreen() {
  const query = usePaymentMethods()
  const selected = useCheckoutStore(state => state.paymentMethod)
  const setPayment = useCheckoutStore(state => state.setPaymentMethod)

  if (query.isLoading)
    return (
      <Screen>
        <AppHeader title="Metode pembayaran" />
        <LoadingState />
      </Screen>
    )
  if (query.isError)
    return (
      <Screen>
        <AppHeader title="Metode pembayaran" />
        <ErrorState onRetry={() => query.refetch()} />
      </Screen>
    )
  const groups = ['Bank Transfer', 'E-Wallet', 'Cash on Delivery'] as const
  return (
    <Screen>
      <AppHeader title="Metode pembayaran" />
      {groups.map(group => (
        <View key={group} style={{ gap: 12 }}>
          <SectionTitle title={group} />
          {query.data
            ?.filter(method => method.type === group)
            .map(method => (
              <PaymentOption
                key={method.id}
                method={method}
                selected={selected?.id === method.id}
                onPress={() => {
                  setPayment(method)
                  router.back()
                }}
              />
            ))}
        </View>
      ))}
    </Screen>
  )
}
