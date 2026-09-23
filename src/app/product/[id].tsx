import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { QuantitySelector } from '@/components/commerce/cart-row'
import { CartIcon } from '@/components/ui/cart-icon'
import {
  AppHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  Screen,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useProduct } from '@/hooks/use-commerce'
import { useCartStore } from '@/stores/cart.store'
import { ProductVariantOption } from '@/types/commerce'
import { formatCurrency, formatSold } from '@/utils/format'

export default function ProductDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const productQuery = useProduct(id)
  const addItem = useCartStore(state => state.addItem)
  const cartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
  const [selections, setSelections] = useState<
    Record<string, ProductVariantOption>
  >({})
  const [quantity, setQuantity] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  const product = productQuery.data
  const maxStock = useMemo(
    () =>
      product
        ? Math.min(
            product.stock,
            ...Object.values(selections).map(option => option.stock),
            product.stock
          )
        : 0,
    [product, selections]
  )
  const finalPrice = product
    ? product.price +
      Object.values(selections).reduce(
        (sum, option) => sum + option.priceAdjustment,
        0
      )
    : 0

  if (productQuery.isLoading)
    return (
      <Screen>
        <LoadingState label="Memuat detail produk…" />
      </Screen>
    )
  if (productQuery.isError)
    return (
      <Screen>
        <ErrorState onRetry={() => productQuery.refetch()} />
      </Screen>
    )
  if (!product)
    return (
      <Screen>
        <AppHeader title="Detail produk" />
        <EmptyState
          icon="❓"
          title="Produk tidak ditemukan"
          message="Produk ini mungkin sudah tidak tersedia."
          action="Kembali belanja"
          onAction={() => router.replace('/products')}
        />
      </Screen>
    )

  const validateSelection = () => {
    if (product.stock <= 0) {
      Alert.alert('Stok habis', 'Produk ini sedang tidak tersedia.')
      return false
    }
    const missing = product.variants.find(variant => !selections[variant.id])
    if (missing) {
      Alert.alert(
        'Pilih varian',
        `Silakan pilih ${missing.name.toLowerCase()} terlebih dahulu.`
      )
      return false
    }
    if (quantity > maxStock) {
      Alert.alert('Stok tidak cukup', `Stok tersedia hanya ${maxStock}.`)
      return false
    }
    return true
  }

  const handleAdd = (buyNow = false) => {
    if (!validateSelection()) return
    addItem(product, selections, quantity, buyNow)
    if (buyNow) router.push('/checkout')
    else
      Alert.alert(
        'Masuk ke keranjang',
        `${product.name} berhasil ditambahkan.`,
        [
          { text: 'Lanjut belanja' },
          { text: 'Lihat keranjang', onPress: () => router.push('/cart') },
        ]
      )
  }

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        title="Detail produk"
        right={
          <Pressable onPress={() => router.push('/cart')} style={styles.cart}>
            <CartIcon size={22} variant="cart" />
            {cartCount ? (
              <Text style={styles.cartCount}>{cartCount}</Text>
            ) : null}
          </Pressable>
        }
      />
      <Image
        source={product.images[imageIndex].url}
        style={styles.hero}
        contentFit="cover"
        transition={180}
      />
      <ScrollView
        horizontal
        contentContainerStyle={styles.thumbnails}
        showsHorizontalScrollIndicator={false}>
        {product.images.map((image, index) => (
          <Pressable
            key={image.id}
            onPress={() => setImageIndex(index)}
            style={[
              styles.thumbnailWrap,
              imageIndex === index && styles.thumbnailActive,
            ]}>
            <Image
              source={image.url}
              style={styles.thumbnail}
              contentFit="cover"
            />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.card}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(finalPrice)}</Text>
          {product.discountPercentage ? (
            <Text style={styles.discount}>-{product.discountPercentage}%</Text>
          ) : null}
        </View>
        {product.originalPrice ? (
          <Text style={styles.original}>
            {formatCurrency(product.originalPrice)}
          </Text>
        ) : null}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>
          ★ {product.rating} ({product.reviewCount} ulasan) ·{' '}
          {formatSold(product.soldCount)} terjual
        </Text>
      </View>

      {product.variants.map(variant => (
        <View key={variant.id} style={styles.card}>
          <Text style={styles.sectionTitle}>Pilih {variant.name}</Text>
          <View style={styles.options}>
            {variant.options.map(option => {
              const active = selections[variant.id]?.id === option.id
              return (
                <Pressable
                  key={option.id}
                  disabled={option.stock <= 0}
                  onPress={() => {
                    setSelections(current => ({
                      ...current,
                      [variant.id]: option,
                    }))
                    setQuantity(1)
                  }}
                  style={[
                    styles.option,
                    active && styles.optionActive,
                    option.stock <= 0 && styles.optionDisabled,
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      active && styles.optionTextActive,
                    ]}>
                    {option.label}
                    {option.priceAdjustment
                      ? ` +${formatCurrency(option.priceAdjustment)}`
                      : ''}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      ))}

      <View style={styles.card}>
        <View style={styles.quantityRow}>
          <View>
            <Text style={styles.sectionTitle}>Jumlah</Text>
            <Text style={styles.stock}>Stok tersedia: {maxStock}</Text>
          </View>
          <QuantitySelector
            value={quantity}
            maximum={maxStock}
            onChange={setQuantity}
          />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Deskripsi produk</Text>
        <Text style={styles.description}>
          {product.description} Produk dikemas aman dan telah melalui
          pemeriksaan kualitas sebelum pengiriman.
        </Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.actionCell}>
          <PrimaryButton
            title="+ Keranjang"
            variant="outline"
            onPress={() => handleAdd(false)}
            disabled={product.stock <= 0}
          />
        </View>
        <View style={styles.actionCell}>
          <PrimaryButton
            title="Beli sekarang"
            onPress={() => handleAdd(true)}
            disabled={product.stock <= 0}
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 0, gap: spacing.md, paddingBottom: spacing.xxl },
  cart: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cartCount: { color: palette.ink, fontSize: 12, fontWeight: '800' },
  hero: { width: '100%', aspectRatio: 1, backgroundColor: '#EEF2F1' },
  thumbnails: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  thumbnailWrap: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.md,
    padding: 2,
  },
  thumbnailActive: { borderColor: palette.primary },
  thumbnail: { width: 58, height: 58, borderRadius: radius.sm },
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  price: { color: palette.primaryDark, fontSize: 24, fontWeight: '900' },
  discount: {
    color: palette.danger,
    backgroundColor: palette.dangerSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '800',
  },
  original: {
    color: palette.muted,
    textDecorationLine: 'line-through',
    fontSize: 13,
  },
  name: { color: palette.ink, fontSize: 21, lineHeight: 28, fontWeight: '800' },
  meta: { color: palette.muted, fontSize: 13 },
  sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    borderWidth: 1.5,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  optionDisabled: { opacity: 0.35 },
  optionText: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  optionTextActive: { color: palette.primaryDark },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: { color: palette.muted, fontSize: 12, marginTop: 3 },
  description: { color: palette.muted, lineHeight: 22, fontSize: 14 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionCell: { flex: 1 },
})
