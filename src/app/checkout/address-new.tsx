import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { z } from 'zod'

import {
  AppHeader,
  Field,
  PrimaryButton,
  Screen,
} from '@/components/ui/primitives'
import { spacing } from '@/constants/design'
import { useCheckoutStore } from '@/stores/checkout.store'

const addressSchema = z.object({
  label: z.string().min(2, 'Label alamat minimal 2 karakter.'),
  recipientName: z.string().min(3, 'Nama penerima minimal 3 karakter.'),
  phone: z
    .string()
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/,
      'Masukkan nomor HP Indonesia yang valid.'
    ),
  province: z.string().min(3, 'Provinsi wajib diisi.'),
  city: z.string().min(3, 'Kota/kabupaten wajib diisi.'),
  district: z.string().min(3, 'Kecamatan wajib diisi.'),
  postalCode: z.string().regex(/^[0-9]{5}$/, 'Kode pos harus 5 digit.'),
  fullAddress: z.string().min(10, 'Alamat lengkap minimal 10 karakter.'),
})
type AddressForm = z.infer<typeof addressSchema>

const fields: {
  name: keyof AddressForm
  label: string
  placeholder: string
  keyboardType?: 'phone-pad' | 'number-pad'
}[] = [
  { name: 'label', label: 'Label alamat', placeholder: 'Contoh: Rumah' },
  {
    name: 'recipientName',
    label: 'Nama penerima',
    placeholder: 'Nama lengkap',
  },
  {
    name: 'phone',
    label: 'Nomor HP',
    placeholder: '08xxxxxxxxxx',
    keyboardType: 'phone-pad',
  },
  { name: 'province', label: 'Provinsi', placeholder: 'Contoh: DKI Jakarta' },
  {
    name: 'city',
    label: 'Kota / Kabupaten',
    placeholder: 'Contoh: Jakarta Selatan',
  },
  {
    name: 'district',
    label: 'Kecamatan',
    placeholder: 'Contoh: Kebayoran Baru',
  },
  {
    name: 'postalCode',
    label: 'Kode pos',
    placeholder: '5 digit',
    keyboardType: 'number-pad',
  },
  {
    name: 'fullAddress',
    label: 'Alamat lengkap',
    placeholder: 'Nama jalan, nomor rumah, patokan',
  },
]

export default function NewAddressScreen() {
  const addAddress = useCheckoutStore(state => state.addAddress)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      recipientName: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      postalCode: '',
      fullAddress: '',
    },
  })
  const onSubmit = (values: AddressForm) => {
    addAddress(values)
    router.dismiss(2)
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen contentStyle={styles.content}>
        <AppHeader title="Tambah alamat" />
        <View style={styles.form}>
          {fields.map(field => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: controller }) => (
                <Field
                  label={field.label}
                  placeholder={field.placeholder}
                  value={controller.value}
                  onBlur={controller.onBlur}
                  onChangeText={controller.onChange}
                  keyboardType={field.keyboardType}
                  multiline={field.name === 'fullAddress'}
                  numberOfLines={field.name === 'fullAddress' ? 3 : 1}
                  error={errors[field.name]?.message}
                />
              )}
            />
          ))}
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            title="Simpan alamat"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 0, gap: spacing.lg },
  form: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
})
