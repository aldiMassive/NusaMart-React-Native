import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import {
  AppHeader,
  ErrorState,
  LoadingState,
  PrimaryButton,
  Screen,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useOrder } from '@/hooks/use-commerce'
import { formatCurrency } from '@/utils/format'

export default function OrderSuccessScreen() {
  const { orderId = '' } = useLocalSearchParams<{ orderId: string }>()
  const query = useOrder(orderId)
  if (query.isLoading)
    return (
      <Screen>
        <LoadingState label="Menyiapkan pesananmu…" />
      </Screen>
    )
  if (query.isError || !query.data)
    return (
      <Screen>
        <AppHeader title="Pesanan" back={false} />
        <ErrorState
          message="Detail pesanan tidak dapat dimuat."
          onRetry={() => query.refetch()}
        />
      </Screen>
    )
  const order = query.data
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.title}>Pesanan berhasil dibuat!</Text>
        <Text style={styles.subtitle}>
          Kami akan memproses pesanan setelah pembayaran dikonfirmasi.
        </Text>
      </View>
      <View style={styles.card}>
        <Detail label="Nomor pesanan" value={order.orderNumber} />
        <Detail
          label="Total pembayaran"
          value={formatCurrency(order.summary.grandTotal)}
          highlight
        />
        <Detail label="Pembayaran" value={order.paymentMethod.name} />
        <Detail
          label="Pengiriman"
          value={`${order.shipping.courier.name} ${order.shipping.service}`}
        />
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          title="Lihat pesanan"
          onPress={() => router.replace(`/orders/${order.id}`)}
        />
        <PrimaryButton
          title="Lanjut belanja"
          variant="outline"
          onPress={() => router.replace('/')}
        />
      </View>
    </Screen>
  )
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlight]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center' },
  hero: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  check: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: palette.surface, fontSize: 40, fontWeight: '900' },
  title: {
    color: palette.ink,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  label: { color: palette.muted, fontSize: 13 },
  value: {
    flex: 1,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  highlight: { color: palette.primaryDark, fontSize: 16, fontWeight: '900' },
  actions: { gap: spacing.md },
})
