export const formatCurrency = (value: number) =>
  `Rp${Math.round(value).toLocaleString('id-ID')}`

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export const formatSold = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}rb` : String(value)

export const selectedVariantLabel = (
  options: Record<string, { label: string }>
) =>
  Object.values(options)
    .map(option => option.label)
    .join(' · ') || 'Standar'
