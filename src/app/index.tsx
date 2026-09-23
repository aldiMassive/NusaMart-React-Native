import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { BottomNavigation } from '@/components/bottom-navigation'
import { ProductCard } from '@/components/commerce/product-card'
import { CartIcon } from '@/components/ui/cart-icon'
import { DefaultAvatar } from '@/components/ui/default-avatar'
import {
  ErrorState,
  LoadingState,
  Screen,
  SectionTitle,
} from '@/components/ui/primitives'
import { SearchForm } from '@/components/ui/search-form'
import { palette, radius, spacing } from '@/constants/design'
import {
  useCategories,
  useCurrentUser,
  useProducts,
} from '@/hooks/use-commerce'
import { useCartStore } from '@/stores/cart.store'

const categoryIcons: Record<string, string> = {
  computer: '🖥️',
  mobile: '📱',
  audio: '🎧',
  accessory: '⌨️',
  storage: '💾',
}

const categoryColors = ['#E9F1FF', '#EAF9F1', '#F2ECFF', '#FFF1E8', '#E8F7FA']

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const products = useProducts()
  const categories = useCategories()
  const user = useCurrentUser()
  const cartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  if (products.isLoading || categories.isLoading || user.isLoading)
    return (
      <Screen>
        <LoadingState label="Menyiapkan rekomendasi untukmu..." />
      </Screen>
    )
  if (products.isError || categories.isError || user.isError)
    return (
      <Screen>
        <ErrorState
          onRetry={() => {
            products.refetch()
            categories.refetch()
            user.refetch()
          }}
        />
      </Screen>
    )

  const allProducts = products.data ?? []
  const flashSale = allProducts.filter(product => product.featured).slice(0, 4)
  const popular = [...allProducts]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4)

  const submitSearch = () => {
    router.push({
      pathname: '/products',
      params: { query: searchQuery.trim() },
    })
  }

  return (
    <Screen
      contentStyle={styles.content}
      bottom={<BottomNavigation active="home" />}>
      <View style={styles.topbar}>
        <View style={styles.delivery}>
          <View style={styles.pinWrap}>
            <Text style={styles.pin}>●</Text>
          </View>
          <View style={styles.deliveryCopy}>
            <Text style={styles.deliveryLabel}>Dikirim ke</Text>
            <Text style={styles.deliveryCity} numberOfLines={1}>
              Surabaya, Jawa Timur ⌄
            </Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <Pressable
            accessibilityLabel="Buka akun"
            onPress={() => router.push('/account')}
            style={styles.avatarButton}>
            <DefaultAvatar size={39} />
          </Pressable>
          <Pressable
            accessibilityLabel="Keranjang"
            onPress={() => router.push('/cart')}
            style={styles.iconButton}>
            <CartIcon size={21} variant="cart" />
            {cartCount > 0 ? (
              <Text style={styles.cartBadge}>{Math.min(cartCount, 99)}</Text>
            ) : null}
          </Pressable>
        </View>
      </View>

      <SearchForm
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={submitSearch}
      />

      <Pressable onPress={() => router.push('/products')} style={styles.banner}>
        <Image
          source={require('@/assets/images/nusamart-sale-banner.png')}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <View style={styles.bannerShade} />
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>Payday Sale</Text>
          <Text style={styles.bannerText}>Diskon s.d. 70%</Text>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Belanja Sekarang</Text>
          </View>
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Pressable>

      <View>
        <SectionTitle
          title="Kategori Pilihan"
          action="Lihat semua"
          onAction={() => router.push('/products')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}>
          {(categories.data ?? []).map((category, index) => (
            <Pressable
              key={category.id}
              onPress={() =>
                router.push({
                  pathname: '/products',
                  params: { category: category.id },
                })
              }
              style={styles.category}>
              <View
                style={[
                  styles.categoryIconWrap,
                  {
                    backgroundColor:
                      categoryColors[index % categoryColors.length],
                  },
                ]}>
                <Text style={styles.categoryIcon}>
                  {categoryIcons[category.id] ?? category.icon}
                </Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View>
        <View style={styles.saleHeader}>
          <Text style={styles.saleTitle}>Flash Sale</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>08</Text>
            <Text style={styles.timerColon}>:</Text>
            <Text style={styles.timerText}>24</Text>
            <Text style={styles.timerColon}>:</Text>
            <Text style={styles.timerText}>17</Text>
          </View>
          <View style={styles.saleSpacer} />
          <Pressable onPress={() => router.push('/products')}>
            <Text style={styles.seeAll}>Lihat semua</Text>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {flashSale.map(product => (
            <View key={product.id} style={styles.cell}>
              <ProductCard
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            </View>
          ))}
        </View>
      </View>

      <View>
        <SectionTitle
          title={`Pilihan untuk ${user.data?.name.split(' ')[0] ?? 'kamu'}`}
          action="Lihat semua"
          onAction={() => router.push('/products')}
        />
        <View style={styles.grid}>
          {popular.map(product => (
            <View key={product.id} style={styles.cell}>
              <ProductCard
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: 22,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  delivery: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  pinWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: { color: palette.primary, fontSize: 13 },
  deliveryCopy: { flex: 1 },
  deliveryLabel: { color: palette.muted, fontSize: 10, lineHeight: 14 },
  deliveryCity: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  topActions: { flexDirection: 'row', gap: 8 },
  avatarButton: { width: 39, height: 39, borderRadius: 20 },
  iconButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -3,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: palette.danger,
    color: palette.surface,
    fontSize: 9,
    lineHeight: 17,
    textAlign: 'center',
    fontWeight: '800',
  },
  banner: {
    height: 168,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.primaryDark,
    justifyContent: 'center',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  bannerShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 77, 45, 0.12)',
  },
  bannerCopy: { width: '55%', paddingLeft: 18, gap: 3 },
  bannerTitle: {
    color: palette.surface,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  bannerText: { color: '#FFF6C4', fontSize: 13, fontWeight: '700' },
  bannerButton: {
    marginTop: 9,
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: palette.accent,
  },
  bannerButtonText: { color: '#193126', fontSize: 11, fontWeight: '900' },
  dots: {
    position: 'absolute',
    bottom: 9,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#A7D5C4' },
  dotActive: { width: 14, backgroundColor: palette.surface },
  categories: { gap: 14, paddingTop: 14, paddingRight: spacing.lg },
  category: { width: 65, alignItems: 'center', gap: 7 },
  categoryIconWrap: {
    width: 55,
    height: 55,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: { fontSize: 24 },
  categoryName: {
    color: palette.ink,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  saleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  saleTitle: { color: palette.ink, fontSize: 19, fontWeight: '900' },
  saleSpacer: { flex: 1 },
  timer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, gap: 3 },
  timerText: {
    minWidth: 24,
    height: 23,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: palette.danger,
    color: palette.surface,
    fontSize: 11,
    lineHeight: 23,
    textAlign: 'center',
    fontWeight: '900',
  },
  timerColon: { color: palette.danger, fontWeight: '900' },
  seeAll: { color: palette.primary, fontSize: 12, fontWeight: '800' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    rowGap: spacing.sm,
  },
  cell: { width: '50%', paddingHorizontal: spacing.xs },
})
