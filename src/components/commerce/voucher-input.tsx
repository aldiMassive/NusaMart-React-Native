import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { palette, radius, spacing } from '@/constants/design'
import { useValidateVoucher } from '@/hooks/use-commerce'
import { Voucher } from '@/types/commerce'

export function VoucherInput({
  purchaseTotal,
  voucher,
  onApply,
}: {
  purchaseTotal: number
  voucher?: Voucher
  onApply: (voucher?: Voucher) => void
}) {
  const [code, setCode] = useState(voucher?.code ?? '')
  const validation = useValidateVoucher()

  const handleApply = () => {
    if (voucher) {
      setCode('')
      onApply(undefined)
      validation.reset()
      return
    }
    validation.mutate({ code, purchaseTotal }, { onSuccess: onApply })
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TextInput
          value={code}
          onChangeText={value => {
            setCode(value.toUpperCase())
            validation.reset()
          }}
          editable={!voucher}
          autoCapitalize="characters"
          placeholder="Masukkan kode voucher"
          placeholderTextColor={palette.muted}
          style={[styles.input, voucher && styles.appliedInput]}
        />
        <Pressable
          onPress={handleApply}
          disabled={!voucher && (!code.trim() || validation.isPending)}
          style={[styles.button, !voucher && !code.trim() && styles.disabled]}>
          <Text style={styles.buttonText}>
            {validation.isPending ? 'Cek…' : voucher ? 'Hapus' : 'Pakai'}
          </Text>
        </Pressable>
      </View>
      {voucher ? <Text style={styles.success}>✓ {voucher.title}</Text> : null}
      {validation.isError ? (
        <Text style={styles.error}>{validation.error.message}</Text>
      ) : null}
      {!voucher ? (
        <Text style={styles.hint}>
          Coba: WELCOME10, ONGKIRFREE, atau HEMAT20
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: palette.ink,
    fontWeight: '600',
  },
  appliedInput: {
    color: palette.primaryDark,
    backgroundColor: palette.primarySoft,
  },
  button: {
    minWidth: 76,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: { opacity: 0.45 },
  buttonText: { color: palette.surface, fontWeight: '800' },
  success: { color: palette.primary, fontSize: 12, fontWeight: '600' },
  error: { color: palette.danger, fontSize: 12 },
  hint: { color: palette.muted, fontSize: 11 },
})
