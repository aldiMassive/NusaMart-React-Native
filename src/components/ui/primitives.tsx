import { PropsWithChildren, ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { palette, radius, spacing } from '@/constants/design'

export function Screen({
  children,
  scroll = true,
  contentStyle,
  bottom,
}: PropsWithChildren<{
  scroll?: boolean
  contentStyle?: StyleProp<ViewStyle>
  bottom?: ReactNode
}>) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
  )
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      {body}
      {bottom}
    </SafeAreaView>
  )
}

export function AppHeader({
  title,
  right,
  back = true,
}: {
  title: string
  right?: ReactNode
  back?: boolean
}) {
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.headerButton}>
          <Text style={styles.headerIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.headerButton} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerButton}>{right}</View>
    </View>
  )
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'outline' | 'danger'
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.outlineButton,
        variant === 'danger' && styles.dangerButton,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? palette.primary : palette.surface}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'outline' && styles.outlineButtonText,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label?: string; error?: string }) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[styles.input, Boolean(error) && styles.inputError]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export function LoadingState({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <View style={styles.state}>
      <ActivityIndicator size="large" color={palette.primary} />
      <Text style={styles.stateText}>{label}</Text>
    </View>
  )
}
export function EmptyState({
  icon = '📦',
  title,
  message,
  action,
  onAction,
}: {
  icon?: ReactNode
  title: string
  message: string
  action?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.state}>
      {typeof icon === 'string' || typeof icon === 'number' ? (
        <Text style={styles.stateIcon}>{icon}</Text>
      ) : (
        <View style={styles.stateGraphic}>{icon}</View>
      )}
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{message}</Text>
      {action && onAction ? (
        <PrimaryButton title={action} onPress={onAction} />
      ) : null}
    </View>
  )
}
export function ErrorState({
  message = 'Terjadi kendala. Silakan coba lagi.',
  onRetry,
}: {
  message?: string
  onRetry: () => void
}) {
  return (
    <EmptyState
      icon="⚠️"
      title="Gagal memuat"
      message={message}
      action="Coba lagi"
      onAction={onRetry}
    />
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  header: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { color: palette.ink, fontSize: 36, lineHeight: 38 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    minHeight: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButton: { backgroundColor: palette.danger },
  outlineButton: {
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
  buttonText: { color: palette.surface, fontSize: 16, fontWeight: '700' },
  outlineButtonText: { color: palette.primary },
  fieldWrap: { gap: spacing.xs },
  label: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  input: {
    minHeight: 48,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: palette.ink,
    fontSize: 15,
  },
  inputError: { borderColor: palette.danger },
  error: { color: palette.danger, fontSize: 12 },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionText: { fontSize: 19, fontWeight: '800', color: palette.ink },
  action: { color: palette.primary, fontSize: 14, fontWeight: '700' },
  state: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  stateIcon: { fontSize: 42 },
  stateGraphic: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primarySoft,
  },
  stateTitle: {
    color: palette.ink,
    fontWeight: '800',
    fontSize: 20,
    textAlign: 'center',
  },
  stateText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
})
