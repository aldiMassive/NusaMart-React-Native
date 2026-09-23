import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { ProductCard } from '@/components/commerce/product-card'
import {
  ErrorState,
  LoadingState,
  Screen,
  SectionTitle,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import {
  useCategories,
  useCurrentUser,
  useProducts,
} from '@/hooks/use-commerce'
import { useCartStore } from '@/stores/cart.store'

export default function HomeScreen() {
  const products = useProducts()
  const categories = useCategories()
  const user = useCurrentUser()
  const cartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  if (products.isLoading || categories.isLoading || user.isLoading)
    return (
      <Screen>
        <LoadingState label="Menyiapkan rekomendasi untukmu…" />
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
  const featured = allProducts.filter(product => product.featured).slice(0, 6)
  const popular = [...allProducts]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4)

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.greeting}>
            Halo, {user.data?.name.split(' ')[0]} 👋
          </Text>
          <Text style={styles.brand}>NusaMart</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            onPress={() => router.push('/orders')}
            style={styles.iconButton}>
            <Text style={styles.icon}>🧾</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/cart')}
            style={styles.iconButton}>
            <Text style={styles.icon}>🛒</Text>
            {cartCount > 0 ? (
              <Text style={styles.cartBadge}>{Math.min(cartCount, 99)}</Text>
            ) : null}
          </Pressable>
        </View>
      </View>
      <Pressable onPress={() => router.push('/products')} style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchText}>Cari produk yang kamu butuhkan</Text>
      </Pressable>
      <View style={styles.banner}>
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerEyebrow}>TECH WEEK</Text>
          <Text style={styles.bannerTitle}>Upgrade meja kerjamu</Text>
          <Text style={styles.bannerText}>
            Hemat hingga 25% untuk pilihan terbaik.
          </Text>
          <Pressable
            onPress={() => router.push('/products')}
            style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Belanja sekarang</Text>
          </Pressable>
        </View>
        <Text style={styles.bannerArt}>⚡</Text>
      </View>

      <SectionTitle
        title="Kategori"
        action="Lihat semua"
        onAction={() => router.push('/products')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}>
        {(categories.data ?? []).map(category => (
          <Pressable
            key={category.id}
            onPress={() =>
              router.push({
                pathname: '/products',
                params: { category: category.id },
              })
            }
            style={styles.category}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionTitle
        title="Rekomendasi untukmu"
        action="Lihat semua"
        onAction={() => router.push('/products')}
      />
      <View style={styles.grid}>
        {featured.map(product => (
          <View key={product.id} style={styles.cell}>
            <ProductCard
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          </View>
        ))}
      </View>
      <SectionTitle title="Paling populer" />
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
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: { color: palette.muted, fontSize: 13 },
  brand: {
    color: palette.ink,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: palette.surface,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: palette.danger,
    color: palette.surface,
    fontSize: 10,
    lineHeight: 19,
    textAlign: 'center',
    fontWeight: '800',
  },
  search: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchIcon: { fontSize: 24, color: palette.primary },
  searchText: { color: palette.muted, fontSize: 14 },
  banner: {
    minHeight: 180,
    borderRadius: radius.lg,
    backgroundColor: palette.primaryDark,
    padding: spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bannerCopy: { flex: 1, zIndex: 1, gap: 5 },
  bannerEyebrow: {
    color: '#9DE5D8',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '900',
  },
  bannerTitle: {
    color: palette.surface,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  bannerText: { color: '#CFE9E4', fontSize: 13, lineHeight: 18 },
  bannerButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: palette.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  bannerButtonText: { color: palette.black, fontWeight: '800', fontSize: 12 },
  bannerArt: {
    position: 'absolute',
    right: -12,
    bottom: -30,
    fontSize: 130,
    opacity: 0.25,
  },
  categories: { gap: spacing.md, paddingRight: spacing.lg },
  category: { width: 76, alignItems: 'center', gap: spacing.sm },
  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: palette.primarySoft,
    textAlign: 'center',
    lineHeight: 58,
    fontSize: 25,
  },
  categoryName: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    rowGap: spacing.sm,
  },
  cell: { width: '50%', paddingHorizontal: spacing.xs },
})
