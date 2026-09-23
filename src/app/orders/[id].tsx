import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import { OrderStatusBadge } from '@/components/commerce/order-card'
import { OrderSummaryCard } from '@/components/commerce/checkout-components'
import {
  AppHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useOrder } from '@/hooks/use-commerce'
import { formatCurrency, formatDate } from '@/utils/format'

export default function OrderDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const query = useOrder(id)
  if (query.isLoading)
    return (
      <Screen>
        <LoadingState />
      </Screen>
    )
  if (query.isError)
    return (
      <Screen>
        <AppHeader title="Detail pesanan" />
        <ErrorState onRetry={() => query.refetch()} />
      </Screen>
    )
  if (!query.data)
    return (
      <Screen>
        <AppHeader title="Detail pesanan" />
        <EmptyState
          title="Pesanan tidak ditemukan"
          message="Periksa kembali riwayat pesananmu."
          action="Ke riwayat pesanan"
          onAction={() => router.replace('/orders')}
        />
      </Screen>
    )
  const order = query.data
  return (
    <Screen contentStyle={styles.content}>
      <AppHeader title="Detail pesanan" />
      <View style={styles.section}>
        <View style={styles.between}>
          <OrderStatusBadge status={order.status} />
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <Text style={styles.number}>{order.orderNumber}</Text>
        {order.trackingNumber ? (
          <Text style={styles.tracking}>
            Nomor resi: {order.trackingNumber}
          </Text>
        ) : null}
      </View>
      <View style={styles.section}>
        <SectionTitle title="Produk" />
        {order.items.map(item => (
          <View key={item.id} style={styles.product}>
            <Image
              source={item.productImage}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.productCopy}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.muted}>
                {item.selectedVariant} · {item.quantity}x
              </Text>
            </View>
            <Text style={styles.price}>{formatCurrency(item.subtotal)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <SectionTitle title="Pengiriman" />
        <Info
          label="Penerima"
          value={`${order.address.recipientName} · ${order.address.phone}`}
        />
        <Info
          label="Alamat"
          value={`${order.address.fullAddress}, ${order.address.district}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}`}
        />
        <Info
          label="Kurir"
          value={`${order.shipping.courier.name} ${order.shipping.service} · ${order.shipping.estimatedDelivery}`}
        />
      </View>
      <View style={styles.section}>
        <SectionTitle title="Pembayaran" />
        <Info label="Metode" value={order.paymentMethod.name} />
        {order.voucher ? (
          <Info label="Voucher" value={order.voucher.code} />
        ) : null}
      </View>
      <OrderSummaryCard summary={order.summary} />
      <View style={styles.action}>
        <PrimaryButton
          title="Belanja lagi"
          onPress={() => router.push('/products')}
        />
      </View>
    </Screen>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { padding: 0, paddingBottom: spacing.xxl, gap: spacing.md },
  section: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { color: palette.muted, fontSize: 11 },
  number: { color: palette.ink, fontWeight: '900', fontSize: 18 },
  tracking: {
    color: palette.primaryDark,
    backgroundColor: palette.primarySoft,
    padding: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  product: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  image: { width: 62, height: 62, borderRadius: radius.md },
  productCopy: { flex: 1, gap: 4 },
  productName: { color: palette.ink, fontWeight: '700', fontSize: 13 },
  muted: { color: palette.muted, fontSize: 12 },
  price: { color: palette.ink, fontWeight: '800', fontSize: 12 },
  info: { gap: 4 },
  infoLabel: { color: palette.muted, fontSize: 11 },
  infoValue: {
    color: palette.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  action: { marginHorizontal: spacing.lg },
})
