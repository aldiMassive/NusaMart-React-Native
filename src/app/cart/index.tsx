import { router } from 'expo-router'
import { useMemo } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

import { CartRow } from '@/components/commerce/cart-row'
import { CartIcon } from '@/components/ui/cart-icon'
import {
  AppHeader,
  EmptyState,
  PrimaryButton,
  Screen,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useCartStore } from '@/stores/cart.store'
import { calculateOrderSummary } from '@/utils/order-calculation'
import { formatCurrency } from '@/utils/format'

export default function CartScreen() {
  const items = useCartStore(state => state.items)
  const selected = useMemo(() => items.filter(item => item.selected), [items])
  const setQuantity = useCartStore(state => state.setQuantity)
  const toggleItem = useCartStore(state => state.toggleItem)
  const selectAll = useCartStore(state => state.selectAll)
  const removeItem = useCartStore(state => state.removeItem)
  const summary = calculateOrderSummary({ cartItems: selected })
  const allSelected = items.length > 0 && selected.length === items.length

  if (!items.length)
    return (
      <Screen>
        <AppHeader title="Keranjang" />
        <EmptyState
          icon={<CartIcon size={48} color={palette.primary} variant="cart" />}
          title="Keranjang masih kosong"
          message="Temukan produk pilihan dan tambahkan ke keranjang."
          action="Mulai belanja"
          onAction={() => router.replace('/products')}
        />
      </Screen>
    )

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader title={`Keranjang (${items.length})`} />
      <Pressable
        onPress={() => selectAll(!allSelected)}
        style={styles.selectAll}>
        <View style={[styles.checkbox, allSelected && styles.checked]}>
          <Text style={styles.check}>{allSelected ? '✓' : ''}</Text>
        </View>
        <Text style={styles.selectText}>Pilih semua</Text>
        <Text style={styles.count}>{selected.length} dipilih</Text>
      </Pressable>
      {items.map(item => (
        <CartRow
          key={item.id}
          item={item}
          onToggle={() => toggleItem(item.id)}
          onQuantity={value => setQuantity(item.id, value)}
          onRemove={() =>
            Alert.alert('Hapus produk?', item.product.name, [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Hapus',
                style: 'destructive',
                onPress: () => removeItem(item.id),
              },
            ])
          }
        />
      ))}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.muted}>
            Subtotal ({selected.reduce((sum, item) => sum + item.quantity, 0)}{' '}
            barang)
          </Text>
          <Text style={styles.value}>{formatCurrency(summary.subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.muted}>Diskon produk</Text>
          <Text style={styles.saving}>
            -{formatCurrency(summary.productDiscount)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Estimasi total</Text>
          <Text style={styles.total}>{formatCurrency(summary.grandTotal)}</Text>
        </View>
        <Text style={styles.note}>
          Belum termasuk ongkos kirim. Biaya layanan sudah termasuk.
        </Text>
      </View>
      <PrimaryButton
        title={`Checkout · ${formatCurrency(summary.grandTotal)}`}
        disabled={!selected.length}
        onPress={() => router.push('/checkout')}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 0, paddingBottom: spacing.xxl, gap: spacing.md },
  selectAll: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: palette.primary, borderColor: palette.primary },
  check: { color: palette.surface, fontWeight: '800' },
  selectText: { flex: 1, color: palette.ink, fontWeight: '700' },
  count: { color: palette.muted, fontSize: 12 },
  summary: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  muted: { color: palette.muted, fontSize: 13 },
  value: { color: palette.ink, fontWeight: '600' },
  saving: { color: palette.primary, fontWeight: '700' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
  },
  totalLabel: { color: palette.ink, fontWeight: '800', fontSize: 16 },
  total: { color: palette.primaryDark, fontWeight: '900', fontSize: 18 },
  note: { color: palette.muted, fontSize: 11 },
})
