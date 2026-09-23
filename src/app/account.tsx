import { StyleSheet, Text, View } from 'react-native'

import { BottomNavigation } from '@/components/bottom-navigation'
import { DefaultAvatar } from '@/components/ui/default-avatar'
import { LoadingState, Screen } from '@/components/ui/primitives'
import { palette, radius, spacing } from '@/constants/design'
import { useCurrentUser } from '@/hooks/use-commerce'

export default function AccountScreen() {
  const user = useCurrentUser()

  if (user.isLoading)
    return (
      <Screen>
        <LoadingState label="Memuat akun..." />
      </Screen>
    )

  return (
    <Screen
      contentStyle={styles.content}
      bottom={<BottomNavigation active="account" />}>
      <Text style={styles.heading}>Akun Saya</Text>
      <View style={styles.profile}>
        <DefaultAvatar size={62} />
        <View style={styles.profileCopy}>
          <Text style={styles.name}>
            {user.data?.name ?? 'Pengguna NusaMart'}
          </Text>
          <Text style={styles.meta}>{user.data?.email}</Text>
          <Text style={styles.meta}>{user.data?.phone}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Menu icon="▤" title="Pesanan Saya" />
        <Menu icon="⌂" title="Alamat Pengiriman" />
        <Menu icon="%" title="Voucher Saya" />
        <Menu icon="?" title="Pusat Bantuan" last />
      </View>
    </Screen>
  )
}

function Menu({
  icon,
  title,
  last,
}: {
  icon: string
  title: string
  last?: boolean
}) {
  return (
    <View style={[styles.menu, last && styles.menuLast]}>
      <View style={styles.menuIcon}>
        <Text style={styles.menuGlyph}>{icon}</Text>
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.chevron}>›</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  heading: { color: palette.ink, fontSize: 24, fontWeight: '900' },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  profileCopy: { flex: 1, gap: 3 },
  name: { color: palette.surface, fontSize: 18, fontWeight: '900' },
  meta: { color: '#D8F3E9', fontSize: 12 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  menu: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  menuLast: { borderBottomWidth: 0 },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primarySoft,
  },
  menuGlyph: { color: palette.primary, fontWeight: '900' },
  menuTitle: { flex: 1, color: palette.ink, fontSize: 14, fontWeight: '700' },
  chevron: { color: palette.muted, fontSize: 26 },
})
