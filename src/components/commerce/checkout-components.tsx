import { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette, radius, spacing } from '@/constants/design'
import {
  Address,
  OrderSummary,
  PaymentMethod,
  ShippingRate,
} from '@/types/commerce'
import { formatCurrency } from '@/utils/format'

export function SelectionCard({
  selected,
  onPress,
  children,
}: {
  selected?: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.selection,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.selectionBody}>{children}</View>
    </Pressable>
  )
}

export function AddressCard({
  address,
  selected,
  onPress,
}: {
  address: Address
  selected?: boolean
  onPress: () => void
}) {
  return (
    <SelectionCard selected={selected} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{address.label}</Text>
        {address.isPrimary ? <Text style={styles.badge}>Utama</Text> : null}
      </View>
      <Text style={styles.strong}>
        {address.recipientName} · {address.phone}
      </Text>
      <Text style={styles.copy}>
        {address.fullAddress}, {address.district}, {address.city},{' '}
        {address.province} {address.postalCode}
      </Text>
    </SelectionCard>
  )
}

export function ShippingOption({
  rate,
  selected,
  onPress,
}: {
  rate: ShippingRate
  selected?: boolean
  onPress: () => void
}) {
  return (
    <SelectionCard selected={selected} onPress={onPress}>
      <View style={styles.between}>
        <View>
          <Text style={styles.title}>
            {rate.courier.name} {rate.service}
          </Text>
          <Text style={styles.copy}>Estimasi {rate.estimatedDelivery}</Text>
        </View>
        <Text style={styles.price}>{formatCurrency(rate.price)}</Text>
      </View>
    </SelectionCard>
  )
}

export function PaymentOption({
  method,
  selected,
  onPress,
}: {
  method: PaymentMethod
  selected?: boolean
  onPress: () => void
}) {
  return (
    <SelectionCard selected={selected} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.icon}>{method.icon}</Text>
        <View>
          <Text style={styles.title}>{method.name}</Text>
          <Text style={styles.copy}>{method.type}</Text>
        </View>
      </View>
    </SelectionCard>
  )
}

const SummaryRow = ({
  label,
  value,
  emphasis,
  negative,
}: {
  label: string
  value: number
  emphasis?: boolean
  negative?: boolean
}) => (
  <View style={styles.between}>
    <Text style={[styles.copy, emphasis && styles.totalLabel]}>{label}</Text>
    <Text
      style={[
        styles.summaryValue,
        emphasis && styles.total,
        negative && styles.saving,
      ]}>
      {negative && value > 0 ? '-' : ''}
      {formatCurrency(value)}
    </Text>
  </View>
)

export function OrderSummaryCard({ summary }: { summary: OrderSummary }) {
  return (
    <View style={styles.summary}>
      <Text style={styles.title}>Ringkasan pembayaran</Text>
      <SummaryRow label="Subtotal produk" value={summary.subtotal} />
      <SummaryRow
        label="Diskon produk"
        value={summary.productDiscount}
        negative
      />
      <SummaryRow
        label="Diskon voucher"
        value={summary.voucherDiscount}
        negative
      />
      <SummaryRow label="Ongkos kirim" value={summary.shippingCost} />
      <SummaryRow
        label="Diskon ongkir"
        value={summary.shippingDiscount}
        negative
      />
      <SummaryRow label="Biaya layanan" value={summary.serviceFee} />
      <View style={styles.divider} />
      <SummaryRow
        label="Total pembayaran"
        value={summary.grandTotal}
        emphasis
      />
    </View>
  )
}

const styles = StyleSheet.create({
  selection: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  selected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  pressed: { opacity: 0.8 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: palette.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
  },
  selectionBody: { flex: 1, gap: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  strong: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  copy: { color: palette.muted, fontSize: 13, lineHeight: 19 },
  badge: {
    color: palette.primaryDark,
    backgroundColor: palette.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
    fontSize: 11,
    fontWeight: '700',
  },
  price: { color: palette.primaryDark, fontWeight: '800' },
  icon: { fontSize: 24 },
  summary: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryValue: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  saving: { color: palette.primary },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
  },
  totalLabel: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  total: { color: palette.primaryDark, fontSize: 19, fontWeight: '900' },
})
