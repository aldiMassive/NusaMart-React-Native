import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

import { OrderSummaryCard } from '@/components/commerce/checkout-components'
import { VoucherInput } from '@/components/commerce/voucher-input'
import { CartIcon } from '@/components/ui/cart-icon'
import {
  AppHeader,
  EmptyState,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useCreateOrder } from '@/hooks/use-commerce'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'
import { formatCurrency, selectedVariantLabel } from '@/utils/format'
import { calculateOrderSummary } from '@/utils/order-calculation'

function SelectRow({
  icon,
  title,
  detail,
  onPress,
  missing,
}: {
  icon: string
  title: string
  detail?: string
  onPress: () => void
  missing?: string
}) {
  return (
    <Pressable onPress={onPress} style={styles.selectRow}>
      <Text style={styles.selectIcon}>{icon}</Text>
      <View style={styles.selectCopy}>
        <Text style={styles.selectTitle}>{title}</Text>
        <Text
          style={[styles.selectDetail, !detail && styles.missing]}
          numberOfLines={2}>
          {detail ?? missing}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
}

export default function CheckoutScreen() {
  const cartItems = useCartStore(state => state.items)
  const items = useMemo(
    () => cartItems.filter(item => item.selected),
    [cartItems]
  )
  const removePurchased = useCartStore(state => state.removePurchased)
  const {
    address,
    shipping,
    paymentMethod,
    voucher,
    setVoucher,
    clearAfterOrder,
  } = useCheckoutStore()
  const createOrder = useCreateOrder()
  const summary = calculateOrderSummary({ cartItems: items, shipping, voucher })
  const currentProductTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  if (!items.length)
    return (
      <Screen>
        <AppHeader title="Checkout" />
        <EmptyState
          icon={<CartIcon size={48} color={palette.primary} variant="cart" />}
          title="Tidak ada produk dipilih"
          message="Pilih produk dari keranjang sebelum checkout."
          action="Ke keranjang"
          onAction={() => router.replace('/cart')}
        />
      </Screen>
    )

  const placeOrder = async () => {
    if (!address)
      return Alert.alert(
        'Alamat belum dipilih',
        'Pilih alamat pengiriman terlebih dahulu.'
      )
    if (!shipping)
      return Alert.alert(
        'Pengiriman belum dipilih',
        'Pilih kurir dan layanan pengiriman.'
      )
    if (!paymentMethod)
      return Alert.alert('Pembayaran belum dipilih', 'Pilih metode pembayaran.')
    try {
      const order = await createOrder.mutateAsync({
        cartItems: items,
        address,
        shipping,
        paymentMethod,
        voucher,
        summary: calculateOrderSummary({ cartItems: items, shipping, voucher }),
      })
      removePurchased(items.map(item => item.id))
      clearAfterOrder()
      router.replace({
        pathname: '/checkout/success',
        params: { orderId: order.id },
      })
    } catch {
      Alert.alert(
        'Pesanan gagal dibuat',
        'Terjadi kendala saat menyimpan pesanan. Silakan coba lagi.'
      )
    }
  }

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader title="Review pesanan" />
      <View style={styles.section}>
        <SectionTitle title="Pengiriman" />
        <SelectRow
          icon="📍"
          title={address?.label ?? 'Alamat pengiriman'}
          detail={
            address
              ? `${address.recipientName} · ${address.phone}\n${address.fullAddress}, ${address.city}`
              : undefined
          }
          missing="Pilih alamat"
          onPress={() => router.push('/checkout/address')}
        />
        <SelectRow
          icon="🚚"
          title={
            shipping
              ? `${shipping.courier.name} ${shipping.service}`
              : 'Metode pengiriman'
          }
          detail={
            shipping
              ? `${shipping.estimatedDelivery} · ${formatCurrency(shipping.price)}`
              : undefined
          }
          missing="Pilih pengiriman"
          onPress={() => router.push('/checkout/shipping')}
        />
      </View>
      <View style={styles.section}>
        <SectionTitle
          title={`Produk (${items.reduce((sum, item) => sum + item.quantity, 0)})`}
        />
        {items.map(item => (
          <View key={item.id} style={styles.product}>
            <Image
              source={item.product.images[0].url}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.productCopy}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text style={styles.productVariant}>
                {selectedVariantLabel(item.selectedOptions)} · {item.quantity}x
              </Text>
            </View>
            <Text style={styles.productPrice}>
              {formatCurrency(item.unitPrice * item.quantity)}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <SectionTitle title="Voucher" />
        <VoucherInput
          purchaseTotal={currentProductTotal}
          voucher={voucher}
          onApply={setVoucher}
        />
      </View>
      <View style={styles.section}>
        <SectionTitle title="Pembayaran" />
        <SelectRow
          icon="💳"
          title={paymentMethod?.name ?? 'Metode pembayaran'}
          detail={paymentMethod?.type}
          missing="Pilih pembayaran"
          onPress={() => router.push('/checkout/payment')}
        />
      </View>
      <OrderSummaryCard summary={summary} />
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalHint}>Total pembayaran</Text>
          <Text style={styles.total}>{formatCurrency(summary.grandTotal)}</Text>
        </View>
        <View style={styles.button}>
          <PrimaryButton
            title="Buat pesanan"
            onPress={placeOrder}
            loading={createOrder.isPending}
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 0, gap: spacing.md, paddingBottom: spacing.xxl },
  section: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  selectIcon: { width: 34, fontSize: 22 },
  selectCopy: { flex: 1, gap: 3 },
  selectTitle: { color: palette.ink, fontWeight: '700', fontSize: 14 },
  selectDetail: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  missing: { color: palette.danger },
  chevron: { color: palette.muted, fontSize: 28 },
  product: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  image: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: palette.background,
  },
  productCopy: { flex: 1, gap: 3 },
  productName: { color: palette.ink, fontWeight: '700', fontSize: 13 },
  productVariant: { color: palette.muted, fontSize: 11 },
  productPrice: { color: palette.ink, fontWeight: '700', fontSize: 12 },
  footer: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  totalHint: { color: palette.muted, fontSize: 11 },
  total: { color: palette.primaryDark, fontWeight: '900', fontSize: 18 },
  button: { flex: 1 },
})
