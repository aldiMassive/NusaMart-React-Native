import { SymbolView } from 'expo-symbols'
import { StyleSheet, Text } from 'react-native'

import { palette } from '@/constants/design'

const bagName = {
  ios: 'bag.fill',
  android: 'shopping_bag',
  web: 'shopping_bag',
} as const

const cartName = {
  ios: 'cart.fill',
  android: 'shopping_cart',
  web: 'shopping_cart',
} as const

export function CartIcon({
  size = 24,
  color = palette.ink,
  variant = 'bag',
}: {
  size?: number
  color?: string
  variant?: 'bag' | 'cart'
}) {
  return (
    <SymbolView
      name={variant === 'bag' ? bagName : cartName}
      size={size}
      tintColor={color}
      fallback={
        <Text style={[styles.fallback, { color, fontSize: size }]}>🛒</Text>
      }
    />
  )
}

const styles = StyleSheet.create({
  fallback: { lineHeight: 28, textAlign: 'center' },
})
