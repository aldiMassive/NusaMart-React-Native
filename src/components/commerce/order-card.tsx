import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette, radius, spacing } from '@/constants/design'
import { Order, OrderStatus } from '@/types/commerce'
import { formatCurrency, formatDate } from '@/utils/format'

const statusColors: Record<OrderStatus, { background: string; text: string }> =
  {
    'Waiting for Payment': { background: '#FFF3D6', text: '#9A5C00' },
    Processing: { background: '#E6F0FF', text: '#2457A6' },
    Shipped: { background: '#EDE9FE', text: '#6D3FC0' },
    Delivered: { background: palette.primarySoft, text: palette.primaryDark },
    Cancelled: { background: palette.dangerSoft, text: palette.danger },
  }

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const colors = statusColors[status]
  return (
    <Text
      style={[
        styles.status,
        { backgroundColor: colors.background, color: colors.text },
      ]}>
      {status}
    </Text>
  )
}

export function OrderCard({
  order,
  onPress,
}: {
  order: Order
  onPress: () => void
}) {
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.between}>
        <View>
          <Text style={styles.number}>{order.orderNumber}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View style={styles.divider} />
      <View style={styles.product}>
        <Image
          source={order.items[0].productImage}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.copy}>
          <Text style={styles.name} numberOfLines={1}>
            {order.items[0].productName}
          </Text>
          <Text style={styles.date}>
            {count} produk
            {order.items.length > 1
              ? ` · +${order.items.length - 1} lainnya`
              : ''}
          </Text>
        </View>
        <Text style={styles.total}>
          {formatCurrency(order.summary.grandTotal)}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: { opacity: 0.8 },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  number: { color: palette.ink, fontWeight: '800', fontSize: 14 },
  date: { color: palette.muted, fontSize: 11, marginTop: 3 },
  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
  },
  product: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  image: { width: 52, height: 52, borderRadius: radius.md },
  copy: { flex: 1 },
  name: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  total: { color: palette.primaryDark, fontWeight: '900', fontSize: 13 },
})
