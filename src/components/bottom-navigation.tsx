import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { CartIcon } from '@/components/ui/cart-icon'
import { palette } from '@/constants/design'
import { useCartStore } from '@/stores/cart.store'

type TabKey = 'home' | 'products' | 'cart' | 'orders' | 'account'

const tabs: {
  key: TabKey
  label: string
  icon: string
  href: '/' | '/products' | '/cart' | '/orders' | '/account'
}[] = [
  { key: 'home', label: 'Beranda', icon: '⌂', href: '/' },
  { key: 'products', label: 'Kategori', icon: '▦', href: '/products' },
  { key: 'cart', label: 'Keranjang', icon: '', href: '/cart' },
  { key: 'orders', label: 'Pesanan', icon: '▤', href: '/orders' },
  { key: 'account', label: 'Akun', icon: '☺', href: '/account' },
]

export function BottomNavigation({ active }: { active: TabKey }) {
  const cartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <View style={styles.nav}>
      {tabs.map(tab => {
        const selected = tab.key === active
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => router.navigate(tab.href)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <View style={styles.iconWrap}>
              {tab.key === 'cart' ? (
                <CartIcon
                  size={23}
                  color={selected ? palette.primary : '#8C9894'}
                  variant="cart"
                />
              ) : (
                <Text style={[styles.icon, selected && styles.iconActive]}>
                  {tab.icon}
                </Text>
              )}
              {tab.key === 'cart' && cartCount > 0 ? (
                <Text style={styles.badge}>{Math.min(cartCount, 99)}</Text>
              ) : null}
            </View>
            <Text style={[styles.label, selected && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  nav: {
    minHeight: 70,
    paddingTop: 9,
    paddingBottom: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: palette.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    shadowColor: '#0B3B2F',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  pressed: { opacity: 0.65 },
  iconWrap: { minWidth: 28, alignItems: 'center' },
  icon: { color: '#8C9894', fontSize: 24, lineHeight: 27, fontWeight: '700' },
  iconActive: { color: palette.primary },
  label: { color: '#8C9894', fontSize: 10, fontWeight: '600' },
  labelActive: { color: palette.primary, fontWeight: '800' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    overflow: 'hidden',
    backgroundColor: palette.danger,
    color: palette.surface,
    fontSize: 9,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '800',
  },
})
