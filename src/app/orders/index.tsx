import { router } from 'expo-router'

import { OrderCard } from '@/components/commerce/order-card'
import {
  AppHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
} from '@/components/ui/primitives'
import { useOrders } from '@/hooks/use-commerce'

export default function OrdersScreen() {
  const query = useOrders()
  return (
    <Screen>
      <AppHeader title="Pesanan saya" />
      {query.isLoading ? (
        <LoadingState label="Memuat riwayat pesanan…" />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : !query.data?.length ? (
        <EmptyState
          icon="🧾"
          title="Belum ada pesanan"
          message="Pesanan yang kamu buat akan muncul di sini."
          action="Mulai belanja"
          onAction={() => router.replace('/')}
        />
      ) : (
        query.data.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={() => router.push(`/orders/${order.id}`)}
          />
        ))
      )}
    </Screen>
  )
}
