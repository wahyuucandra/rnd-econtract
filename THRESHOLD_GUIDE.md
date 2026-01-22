# Custom Threshold Configuration Guide

## 📋 Pengenalan

Fitur Custom Threshold memungkinkan Anda untuk menyesuaikan tingkat kesulitan setiap challenge secara real-time. Anda dapat membuat challenge lebih mudah atau lebih sulit sesuai kebutuhan.

## 🚀 Cara Menggunakan

### 1. **Buka Panel Pengaturan Threshold**

Setelah memilih challenge dari dropdown, Anda akan melihat panel **"⚙️ Pengaturan Threshold"** di sebelah kanan.

Klik tombol panel untuk membukanya.

### 2. **Sesuaikan Nilai Threshold**

Setiap challenge memiliki slider kontrol yang berbeda:

#### **Senyum** (`senyum`)
- **Level Senyum**: Semakin tinggi = senyum lebih besar diperlukan
- **Range**: 0.3 - 1.0
- **Default**: 0.7

#### **Lihat Kanan/Kiri** (`lihat_kanan`, `lihat_kiri`)
- **Derajat Putar**: Semakin besar = putaran kepala harus lebih ekstrim
- **Range**: 10° - 60°
- **Default**: 35°

#### **Lihat Atas/Bawah** (`lihat_atas`, `lihat_bawah`)
- **Derajat Putar**: Semakin besar = putaran kepala harus lebih ekstrim
- **Range**: 5° - 50°
- **Default**: 25°

#### **Buka Mulut** (`buka_mulut`)
- **Bukaan Mulut**: Semakin tinggi = mulut harus dibuka lebih lebar
- **Range**: 0.2 - 1.0
- **Default**: 0.5

#### **Kedip** (`kedip`)
- **Sensitifitas Kedip**: Semakin rendah = lebih sensitif mendeteksi kedip
- **Range**: 0.1 - 0.3
- **Default**: 0.18

#### **Angguk/Geleng Kepala** (`angguk`, `geleng`)
- **Derajat Putar**: Semakin besar = gerakan harus lebih ekstrim
- **Range Derajat**: 5° - 60°
- **Jumlah Pengulangan**: Berapa kali gerakan harus diulang
- **Range Pengulangan**: 1x - 5x
- **Default Angguk**: 20°, 2x
- **Default Geleng**: 35°, 2x

#### **Senyum & Geleng** (`senyum_geleng`)
- **Level Senyum**: Tingkat senyum yang diperlukan
- **Jumlah Pengulangan**: Berapa kali gerakan harus diulang
- **Default**: Senyum 0.6, 2x

### 3. **Simpan & Terapkan**

Setelah menyesuaikan nilai:
1. Klik tombol **"Simpan & Terapkan"** untuk menyimpan pengaturan
2. Pengaturan akan tersimpan di browser secara otomatis
3. Pengaturan akan berlaku untuk challenge berikutnya

### 4. **Reset ke Default**

Jika ingin kembali ke pengaturan default:
- Klik tombol **"↺ Reset"**
- Pengaturan akan dikembalikan ke nilai default dan dihapus dari penyimpanan browser

## 💾 Penyimpanan Data

Semua pengaturan threshold disimpan di **localStorage browser** Anda:
- **Key format**: `threshold_{challengeType}`
- **Contoh**: `threshold_senyum`, `threshold_lihat_kanan`
- Pengaturan bertahan bahkan setelah browser ditutup
- Setiap challenge type memiliki pengaturan sendiri

## 📊 Contoh Kasus Penggunaan

### Membuat Challenge Lebih Mudah
- **Senyum**: Turunkan dari 0.7 menjadi 0.5
- **Lihat Kanan**: Turunkan dari 35° menjadi 25°
- **Buka Mulut**: Turunkan dari 0.5 menjadi 0.3

### Membuat Challenge Lebih Sulit
- **Senyum**: Naikkan dari 0.7 menjadi 0.9
- **Lihat Kanan**: Naikkan dari 35° menjadi 45°
- **Buka Mulut**: Naikkan dari 0.5 menjadi 0.7
- **Angguk**: Tambah pengulangan dari 2x menjadi 3x

## 🎯 Tips Penyesuaian

1. **Mulai dari Default**: Mulai dengan nilai default terlebih dahulu untuk memahami tingkat kesulitan
2. **Sesuaikan Bertahap**: Ubah nilai sedikit demi sedikit (0.05 untuk desimal, 5° untuk derajat)
3. **Test dengan Challenge**: Jalankan challenge setelah mengubah threshold untuk melihat hasilnya
4. **Perhatikan Tingkat Kesuksesan**: Jika terlalu banyak gagal, turunkan threshold; jika terlalu mudah, naikkan
5. **Reset Jika Bingung**: Klik Reset untuk kembali ke pengaturan yang diketahui berhasil

## 🔧 Integrasi Teknis

### File Konfigurasi
- **[src/config/thresholds.ts](src/config/thresholds.ts)**: Menyimpan konfigurasi default untuk setiap challenge

### Komponen UI
- **[src/components/molecules/ThresholdControls.tsx](src/components/molecules/ThresholdControls.tsx)**: Komponen slider untuk kontrol threshold
- **[src/components/organisms/ThresholdPanel.tsx](src/components/organisms/ThresholdPanel.tsx)**: Panel UI untuk manage threshold

### Custom Hooks
- **[src/hooks/useThresholdManager.ts](src/hooks/useThresholdManager.ts)**: Hook untuk manage state threshold dengan localStorage

### Integrasi Modal
- **[src/components/organisms/ExpressionChallengeModal.tsx](src/components/organisms/ExpressionChallengeModal.tsx)**: Menerima threshold sebagai props
- **[src/app/page.tsx](src/app/page.tsx)**: Page utama yang menggunakan threshold manager

## 🐛 Troubleshooting

### Pengaturan Tidak Tersimpan?
- Pastikan localStorage tidak dinonaktifkan di browser
- Cek di DevTools → Application → Local Storage

### Pengaturan Tidak Berlaku?
- Pastikan Anda klik tombol **"Simpan & Terapkan"**
- Buka challenge baru untuk melihat perubahan

### Challenge Selalu Gagal?
- Threshold mungkin terlalu tinggi
- Coba turunkan nilai threshold dan test kembali

## 📱 Responsive Design

Komponen ThresholdControls tersedia dalam 2 mode:

1. **Compact Mode** (`compact={true}`): Untuk tampilan mobile/kecil
   - Slider dalam satu baris
   - Cocok untuk dashboard kecil

2. **Full Mode** (`compact={false}`): Untuk tampilan desktop
   - Slider dengan penjelasan lengkap
   - Informasi detail untuk setiap pengaturan

---

**Versi**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: Next.js 15+, React 18+
