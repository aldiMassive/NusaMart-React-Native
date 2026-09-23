import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette, radius, spacing } from '@/constants/design'
import { CartItem } from '@/types/commerce'
import { formatCurrency, selectedVariantLabel } from '@/utils/format'

export function QuantitySelector({
  value,
  onChange,
  maximum,
}: {
  value: number
  onChange: (value: number) => void
  maximum: number
}) {
  return (
    <View style={styles.quantity}>
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={value <= 1}
        style={styles.step}>
        <Text style={styles.stepText}>−</Text>
      </Pressable>
      <Text style={styles.quantityText}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={value >= maximum}
        style={styles.step}>
        <Text style={styles.stepText}>+</Text>
      </Pressable>
    </View>
  )
}

export function CartRow({
  item,
  onToggle,
  onQuantity,
  onRemove,
}: {
  item: CartItem
  onToggle: () => void
  onQuantity: (value: number) => void
  onRemove: () => void
}) {
  const optionStocks = Object.values(item.selectedOptions).map(
    option => option.stock
  )
  const maximum = Math.min(
    item.product.stock,
    ...optionStocks,
    item.product.stock
  )
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.selected }}
        style={[styles.checkbox, item.selected && styles.checked]}>
        <Text style={styles.check}>{item.selected ? '✓' : ''}</Text>
      </Pressable>
      <Image
        source={item.product.images[0].url}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.variant}>
          {selectedVariantLabel(item.selectedOptions)}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.unitPrice)}</Text>
        <View style={styles.actions}>
          <QuantitySelector
            value={item.quantity}
            maximum={maximum}
            onChange={onQuantity}
          />
          <Pressable onPress={onRemove} hitSlop={10}>
            <Text style={styles.remove}>Hapus</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  checked: { backgroundColor: palette.primary, borderColor: palette.primary },
  check: { color: palette.surface, fontWeight: '800' },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: palette.background,
  },
  body: { flex: 1, gap: 3 },
  name: { color: palette.ink, fontWeight: '700', fontSize: 14 },
  variant: { color: palette.muted, fontSize: 12 },
  price: { color: palette.primaryDark, fontWeight: '800', fontSize: 14 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  remove: { color: palette.danger, fontWeight: '600', fontSize: 12 },
  quantity: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  step: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { color: palette.ink, fontSize: 18 },
  quantityText: {
    minWidth: 28,
    textAlign: 'center',
    color: palette.ink,
    fontWeight: '700',
  },
})
