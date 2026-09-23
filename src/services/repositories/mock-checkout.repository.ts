import {
  mockAddresses,
  mockCouriers,
  mockPaymentMethods,
  mockVouchers,
} from '@/mocks/checkout'
import { CheckoutRepository } from '@/services/repositories/contracts'
import {
  Address,
  PaymentMethod,
  ShippingRate,
  ShippingRequest,
  Voucher,
} from '@/types/commerce'
import { withLatency } from '@/utils/async'

export class MockCheckoutRepository implements CheckoutRepository {
  getAddresses(): Promise<Address[]> {
    return withLatency([...mockAddresses])
  }
  getPaymentMethods(): Promise<PaymentMethod[]> {
    return withLatency([...mockPaymentMethods])
  }

  getShippingRates({
    destination,
    weight,
  }: ShippingRequest): Promise<ShippingRate[]> {
    if (!destination || weight <= 0) return withLatency([])
    const zoneMultiplier = destination.province === 'DKI Jakarta' ? 1 : 1.25
    const weightUnits = Math.max(1, Math.ceil(weight / 1000))
    const definitions = [
      [mockCouriers[0], 'Regular', '2–3 hari', 15000],
      [mockCouriers[1], 'Economy', '3–5 hari', 11000],
      [mockCouriers[2], 'Express', '1–2 hari', 22000],
      [mockCouriers[3], 'Same Day', 'Hari ini', 34000],
      [mockCouriers[3], 'Regular', '2–4 hari', 13500],
    ] as const
    return withLatency(
      definitions.map(
        ([courier, service, estimatedDelivery, basePrice], index) => ({
          id: `${courier.id}-${service.toLowerCase().replace(' ', '-')}`,
          courier,
          service,
          estimatedDelivery,
          price:
            Math.round(
              ((basePrice + (weightUnits - 1) * 5000) * zoneMultiplier) / 500
            ) * 500,
        })
      )
    )
  }

  async validateVoucher(code: string, purchaseTotal: number): Promise<Voucher> {
    await withLatency(null)
    const voucher = mockVouchers.find(
      item => item.code === code.trim().toUpperCase()
    )
    if (!voucher) throw new Error('Kode voucher tidak valid.')
    if (new Date(voucher.expiresAt) < new Date())
      throw new Error('Voucher sudah kedaluwarsa.')
    if (purchaseTotal < voucher.minPurchase) {
      throw new Error(
        `Minimum transaksi voucher ini Rp${voucher.minPurchase.toLocaleString('id-ID')}.`
      )
    }
    return voucher
  }
}
