# NusaMart Mobile

NusaMart adalah MVP e-commerce mobile berbasis Expo dan React Native. Aplikasi
berjalan sepenuhnya dengan data mock, tetapi data layer mengikuti repository
pattern sehingga UI tidak perlu diubah saat REST API tersedia.

## Tentang project

Project ini mensimulasikan alur belanja e-commerce Indonesia dari katalog produk
sampai pesanan dibuat. Seluruh data berjalan secara lokal menggunakan mock
repository, sehingga aplikasi dapat dikembangkan dan didemokan tanpa backend.
Saat REST API Node.js/NestJS tersedia, implementasi mock dapat diganti tanpa
mengubah screen atau reusable component.

## Fitur

- Beranda, katalog 20 produk, pencarian, kategori, sorting, dan filter rating
- Detail produk, pilihan varian, validasi stok, cart persisten, dan Buy Now
- Checkout lengkap: alamat, ongkir, voucher, pembayaran, review, dan kalkulasi
  terpusat
- Pembuatan order lokal, halaman sukses, riwayat order, dan detail order
- Loading, empty, error, serta validasi user-facing di setiap alur penting

## Teknologi dan dependencies

### Core application

| Dependency                                                                        | Kegunaan                                                                         |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `expo`                                                                            | Framework Expo SDK 57 untuk build, development server, dan konfigurasi aplikasi. |
| `react`, `react-native`                                                           | Fondasi UI cross-platform Android, iOS, dan web.                                 |
| `typescript`                                                                      | Static type checking untuk model domain, service, store, dan component.          |
| `expo-router`                                                                     | File-based routing untuk seluruh screen aplikasi.                                |
| `react-native-safe-area-context`                                                  | Safe area pada perangkat dengan notch atau system bar.                           |
| `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated` | Infrastruktur navigasi dan interaksi native Expo Router.                         |
| `react-native-web`, `react-dom`                                                   | Dukungan menjalankan aplikasi pada web.                                          |

### State, data, dan form

| Dependency                                  | Kegunaan                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `@tanstack/react-query`                     | Mengelola data asynchronous seperti produk, ongkir, voucher, dan pesanan.      |
| `zustand`                                   | Menyimpan state client untuk cart dan pilihan checkout.                        |
| `@react-native-async-storage/async-storage` | Persistensi cart dan state checkout di perangkat.                              |
| `axios`                                     | HTTP client yang telah disiapkan untuk REST API melalui `EXPO_PUBLIC_API_URL`. |
| `react-hook-form`                           | Mengelola input dan submit form alamat.                                        |
| `zod`                                       | Schema dan validasi data alamat.                                               |
| `@hookform/resolvers`                       | Menghubungkan validasi Zod dengan React Hook Form.                             |

### Expo modules

| Dependency                                                                       | Kegunaan                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `expo-image`                                                                     | Menampilkan gambar produk secara efisien dengan cache dan transition.    |
| `expo-status-bar`, `expo-splash-screen`                                          | Mengatur status bar dan splash screen aplikasi.                          |
| `expo-constants`, `expo-device`, `expo-font`, `expo-linking`, `expo-web-browser` | Modul Expo bawaan untuk konfigurasi dan kemampuan perangkat.             |
| `expo-glass-effect`, `expo-symbols`, `expo-system-ui`, `@expo/ui`                | Komponen dan utilitas UI Expo yang tersedia untuk pengembangan lanjutan. |

### Quality tools

| Dependency                     | Kegunaan                                             |
| ------------------------------ | ---------------------------------------------------- |
| `eslint`, `eslint-config-expo` | Linting JavaScript/TypeScript sesuai aturan Expo.    |
| `prettier`                     | Formatting code konsisten berdasarkan `.prettierrc`. |
| `@types/react`                 | Type definitions React untuk TypeScript.             |

## Arsitektur

Aliran data utama:

```text
Screen / reusable component
  -> React Query hook
  -> service/repository contract
  -> mock repository
```

Struktur penting:

```text
src/
  app/                    # Route dan screen Expo Router
  components/commerce/    # Komponen domain reusable
  components/ui/          # UI primitives dan state components
  hooks/                  # React Query hooks
  mocks/                  # Data produk, checkout, dan seed order
  services/api/           # Axios client untuk backend berikutnya
  services/repositories/  # Contract dan mock implementations
  stores/                 # Zustand stores
  types/                  # Model domain TypeScript
  utils/                  # Formatter dan kalkulasi order
```

## Instalasi dan menjalankan aplikasi

Persyaratan minimum Expo SDK 57 adalah Node.js 22.13.x atau yang lebih baru.

```bash
npm install
cp .env.example .env.local
npx expo start
```

Jalankan Android dari terminal Expo dengan menekan `a`, atau langsung:

```bash
npm run android
```

Validasi project:

```bash
npm run format:check
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

Format seluruh file yang didukung menggunakan konfigurasi project:

```bash
npm run format
```

## Cara kerja data mock

Screen tidak mengimpor data dummy secara langsung. Hooks pada
`src/hooks/use-commerce.ts` memanggil repository singleton di
`src/services/commerce.ts`. Mock repository mensimulasikan latency 300–800 ms
dan mengembalikan model domain yang sama dengan implementasi REST API di masa
depan.

## Persistensi cart

`useCartStore` memakai middleware `persist` Zustand dan AsyncStorage dengan key
`@nusamart/cart`. Item, varian, jumlah, dan status pilihan dipulihkan setelah
aplikasi dimulai ulang. Semua operasi kuantitas dibatasi stok produk/varian.

## Kalkulasi checkout

`calculateOrderSummary()` adalah satu-satunya sumber kalkulasi subtotal, diskon
produk, voucher, ongkir, diskon ongkir, biaya layanan, dan grand total. Cart,
checkout, dan pembuatan order menggunakan fungsi yang sama agar hasil konsisten.

## Mock pengiriman

Shipping repository menerima alamat tujuan dan berat total. Harga
memperhitungkan zona provinsi serta pembulatan berat per kilogram, lalu
mengembalikan layanan JNE, J&T, SiCepat, dan AnterAja. UI tidak menghitung
ongkir sendiri.

## Mengganti mock dengan REST API

1. Buat implementasi baru untuk `ProductRepository`, `CheckoutRepository`, dan
   `OrderRepository`.
2. Gunakan `apiClient` dari `src/services/api/client.ts` agar base URL dibaca
   dari `EXPO_PUBLIC_API_URL`.
3. Ganti instance yang diekspor `src/services/commerce.ts` dari mock repository
   ke API repository.
4. Pertahankan return type sesuai contract. Hook, screen, store, dan reusable
   component tidak perlu ditulis ulang.

Contoh environment:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```
