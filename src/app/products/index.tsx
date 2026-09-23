import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { ProductCard } from '@/components/commerce/product-card'
import {
  AppHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
} from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useCategories, useProducts } from '@/hooks/use-commerce'
import { ProductFilters } from '@/types/commerce'

const sorts: { id: NonNullable<ProductFilters['sort']>; label: string }[] = [
  { id: 'recommended', label: 'Rekomendasi' },
  { id: 'popular', label: 'Terlaris' },
  { id: 'price-asc', label: 'Harga ↑' },
  { id: 'price-desc', label: 'Harga ↓' },
]

export default function ProductsScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>()
  const [query, setQuery] = useState(params.query ?? '')
  const [categoryId, setCategoryId] = useState(params.category)
  const [sort, setSort] =
    useState<NonNullable<ProductFilters['sort']>>('recommended')
  const [minRating, setMinRating] = useState<number>()
  const filters = useMemo(
    () => ({ query, categoryId, sort, minRating }),
    [query, categoryId, sort, minRating]
  )
  const products = useProducts(filters)
  const categories = useCategories()

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <AppHeader title="Cari produk" />
      <View style={styles.controls}>
        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            autoFocus={Boolean(params.query)}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari nama produk"
            placeholderTextColor={palette.muted}
            style={styles.input}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Text style={styles.clear}>×</Text>
            </Pressable>
          ) : null}
        </View>
        <FlatList
          horizontal
          data={[
            { id: '', name: 'Semua', icon: '✨' },
            ...(categories.data ?? []),
          ]}
          keyExtractor={item => item.id || 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setCategoryId(item.id || undefined)}
              style={[
                styles.chip,
                categoryId === (item.id || undefined) && styles.chipActive,
              ]}>
              <Text
                style={[
                  styles.chipText,
                  categoryId === (item.id || undefined) &&
                    styles.chipTextActive,
                ]}>
                {item.icon} {item.name}
              </Text>
            </Pressable>
          )}
        />
        <FlatList
          horizontal
          data={sorts}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSort(item.id)}
              style={[styles.sort, sort === item.id && styles.sortActive]}>
              <Text
                style={[
                  styles.sortText,
                  sort === item.id && styles.sortTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={
            <Pressable
              onPress={() => setMinRating(minRating ? undefined : 4.7)}
              style={[styles.sort, Boolean(minRating) && styles.sortActive]}>
              <Text
                style={[
                  styles.sortText,
                  Boolean(minRating) && styles.sortTextActive,
                ]}>
                ★ 4.7+
              </Text>
            </Pressable>
          }
        />
      </View>

      {products.isLoading ? (
        <LoadingState label="Mencari produk…" />
      ) : products.isError ? (
        <ErrorState onRetry={() => products.refetch()} />
      ) : (
        <FlatList
          data={products.data}
          keyExtractor={item => item.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            </View>
          )}
          ListHeaderComponent={
            <Text style={styles.result}>
              {products.data?.length ?? 0} produk ditemukan
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔎"
              title="Produk tidak ditemukan"
              message="Coba kata kunci atau filter yang berbeda."
              action="Reset filter"
              onAction={() => {
                setQuery('')
                setCategoryId(undefined)
                setMinRating(undefined)
                setSort('recommended')
              }}
            />
          }
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  screen: { padding: 0, gap: 0 },
  controls: {
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  search: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { fontSize: 22, color: palette.primary },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.sm,
    color: palette.ink,
    fontSize: 15,
  },
  clear: { color: palette.muted, fontSize: 24, paddingHorizontal: spacing.xs },
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    height: 38,
    justifyContent: 'center',
    backgroundColor: palette.background,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: {
    backgroundColor: palette.primarySoft,
    borderColor: palette.primary,
  },
  chipText: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: palette.primaryDark },
  sort: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sortActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  sortText: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  sortTextActive: { color: palette.surface },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  row: { gap: spacing.sm },
  cell: { flex: 1, marginBottom: spacing.sm },
  result: { color: palette.muted, fontSize: 13, margin: spacing.xs },
})
