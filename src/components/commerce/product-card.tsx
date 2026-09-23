import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette, radius } from '@/constants/design'
import { Product } from '@/types/commerce'
import { formatCurrency, formatSold } from '@/utils/format'

export function ProductCard({
  product,
  onPress,
}: {
  product: Product
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image
          source={product.images[0].url}
          style={styles.image}
          contentFit="cover"
          transition={180}
        />
        {product.discountPercentage ? (
          <Text style={styles.discount}>-{product.discountPercentage}%</Text>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        {product.originalPrice ? (
          <Text style={styles.original}>
            {formatCurrency(product.originalPrice)}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          ★ {product.rating} · {formatSold(product.soldCount)} terjual
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 0,
  },
  pressed: { opacity: 0.8 },
  imageWrap: { aspectRatio: 1.08, backgroundColor: '#F2F5F4' },
  image: { width: '100%', height: '100%' },
  discount: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: palette.danger,
    color: palette.surface,
    fontSize: 11,
    fontWeight: '800',
  },
  body: { padding: 10, gap: 3 },
  name: { color: palette.ink, fontSize: 13, lineHeight: 18, minHeight: 36 },
  price: { color: palette.ink, fontWeight: '900', fontSize: 14 },
  original: {
    color: palette.muted,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  meta: { color: '#E29A00', fontSize: 10, marginTop: 2, fontWeight: '600' },
})
