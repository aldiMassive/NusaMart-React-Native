import { Address, Courier, PaymentMethod, Voucher } from '@/types/commerce'

export const mockAddresses: Address[] = [
  {
    id: 'address-1',
    label: 'Rumah',
    recipientName: 'Dimas Pratama',
    phone: '081234567890',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    postalCode: '12120',
    fullAddress: 'Jl. Wijaya II No. 18, dekat Taman Puring',
    isPrimary: true,
  },
  {
    id: 'address-2',
    label: 'Kantor',
    recipientName: 'Dimas Pratama',
    phone: '081234567890',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    district: 'Tanah Abang',
    postalCode: '10230',
    fullAddress: 'Gedung Nusantara Lt. 8, Jl. KH Mas Mansyur No. 10',
  },
  {
    id: 'address-3',
    label: 'Orang Tua',
    recipientName: 'Rina Pratama',
    phone: '082112345678',
    province: 'Jawa Barat',
    city: 'Kota Bandung',
    district: 'Coblong',
    postalCode: '40132',
    fullAddress: 'Jl. Dago Asri No. 27, pagar hijau',
  },
]

export const mockCouriers: Courier[] = [
  { id: 'jne', name: 'JNE' },
  { id: 'jnt', name: 'J&T' },
  { id: 'sicepat', name: 'SiCepat' },
  { id: 'anteraja', name: 'AnterAja' },
]

export const mockVouchers: Voucher[] = [
  {
    id: 'voucher-1',
    code: 'WELCOME10',
    title: 'Diskon 10% untuk pengguna baru',
    type: 'product',
    discountPercentage: 10,
    minPurchase: 100000,
    maxDiscount: 25000,
    expiresAt: '2028-12-31T23:59:59.000Z',
  },
  {
    id: 'voucher-2',
    code: 'ONGKIRFREE',
    title: 'Potongan ongkir hingga Rp20.000',
    type: 'shipping',
    minPurchase: 0,
    maxDiscount: 20000,
    expiresAt: '2028-12-31T23:59:59.000Z',
  },
  {
    id: 'voucher-3',
    code: 'HEMAT20',
    title: 'Diskon 20% belanja pilihan',
    type: 'product',
    discountPercentage: 20,
    minPurchase: 200000,
    maxDiscount: 40000,
    expiresAt: '2028-12-31T23:59:59.000Z',
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'bca', name: 'BCA Virtual Account', type: 'Bank Transfer', icon: '🏦' },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    type: 'Bank Transfer',
    icon: '🏦',
  },
  { id: 'bni', name: 'BNI Virtual Account', type: 'Bank Transfer', icon: '🏦' },
  { id: 'gopay', name: 'GoPay', type: 'E-Wallet', icon: '📲' },
  { id: 'ovo', name: 'OVO', type: 'E-Wallet', icon: '📲' },
  { id: 'dana', name: 'DANA', type: 'E-Wallet', icon: '📲' },
  { id: 'cod', name: 'Bayar di Tempat', type: 'Cash on Delivery', icon: '💵' },
]
