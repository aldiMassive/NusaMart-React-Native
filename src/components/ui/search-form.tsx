import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { palette, radius } from '@/constants/design'

export function SearchForm({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Cari produk di NusaMart...',
  autoFocus = false,
}: {
  value: string
  onChangeText: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <View style={styles.form}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        returnKeyType="search"
        selectionColor={palette.primary}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityLabel="Hapus pencarian"
          hitSlop={10}
          onPress={() => onChangeText('')}>
          <Text style={styles.clear}>×</Text>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityLabel="Cari"
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.submit,
          pressed && styles.submitPressed,
        ]}>
        <Text style={styles.submitText}>Cari</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingLeft: 13,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F3F2',
    borderWidth: 1,
    borderColor: '#EDF1EF',
  },
  searchIcon: { color: palette.ink, fontSize: 21 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 46,
    paddingVertical: 0,
    color: palette.ink,
    fontSize: 13,
  },
  clear: { color: palette.muted, fontSize: 22, lineHeight: 24 },
  submit: {
    height: 38,
    minWidth: 54,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
  },
  submitPressed: { opacity: 0.75 },
  submitText: { color: palette.surface, fontSize: 12, fontWeight: '800' },
})
