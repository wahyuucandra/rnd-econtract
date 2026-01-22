# Custom Threshold System - Quick Start

## 🚀 5 Menit Setup

### 1. File yang Ditambahkan

Sistem custom threshold terdiri dari 5 file utama:

```
src/config/thresholds.ts              # Default configurations
src/hooks/useThresholdManager.ts      # State management
src/components/molecules/ThresholdControls.tsx    # UI sliders
src/components/organisms/ThresholdPanel.tsx       # UI panel wrapper
src/app/page.tsx                      # Updated main page
```

### 2. Cara Menggunakan di Page Anda

**Paling sederhana:**

```typescript
"use client";
import { useThresholdManager } from "@/hooks/useThresholdManager";
import { ThresholdPanel } from "@/components/organisms/ThresholdPanel";

export default function MyPage() {
  const { thresholds } = useThresholdManager("senyum");

  return (
    <div>
      <ThresholdPanel challengeType="senyum" />
      
      {/* Current value: {thresholds.threshold} */}
    </div>
  );
}
```

### 3. Gunakan Threshold di Challenge

```typescript
<ExpressionChallengeModal
  type="senyum"
  threshold={thresholds.threshold ?? 0.8}
  thresholdDeg={thresholds.thresholdDeg ?? 35}
  thresholdMouth={thresholds.thresholdMouth ?? 0.5}
  onResult={(result) => { /* ... */ }}
  onClose={() => { /* ... */ }}
/>
```

---

## 📋 Challenge Types & Threshold

| Challenge | Property | Default | Range |
|-----------|----------|---------|-------|
| **Senyum** | `threshold` | 0.7 | 0.3-1.0 |
| **Lihat Kanan** | `thresholdDeg` | 35° | 10-60° |
| **Lihat Kiri** | `thresholdDeg` | 35° | 10-60° |
| **Lihat Atas** | `thresholdDeg` | 25° | 5-50° |
| **Lihat Bawah** | `thresholdDeg` | 25° | 5-50° |
| **Buka Mulut** | `thresholdMouth` | 0.5 | 0.2-1.0 |
| **Kedip** | `threshold` | 0.18 | 0.1-0.3 |
| **Angguk** | `thresholdDeg`, `requiredRepeats` | 20°, 2x | 5-50°, 1-5x |
| **Geleng** | `thresholdDeg`, `requiredRepeats` | 35°, 2x | 10-60°, 1-5x |
| **Senyum Geleng** | `threshold`, `requiredRepeats` | 0.6, 2x | 0.3-1.0, 1-5x |

---

## 🎮 3 Cara Menggunakan

### Way 1: UI Panel (Recommended untuk User)

```typescript
<ThresholdPanel 
  challengeType="senyum"
  onApply={(thresholds) => {
    // Simpan atau gunakan threshold
  }}
/>
```

**Output:**
- Collapse-able panel dengan sliders
- Save, Apply, dan Reset buttons
- Tips untuk users

### Way 2: Hook Only (Recommended untuk Developer)

```typescript
const { thresholds, updateThresholds } = useThresholdManager("senyum");

// Manual controls
<input
  type="range"
  value={thresholds.threshold}
  onChange={(e) => updateThresholds({ threshold: parseFloat(e.target.value) })}
/>
```

### Way 3: Global State (untuk Multiple Challenges)

```typescript
const { 
  allThresholds,
  updateChallengeThreshold,
  getChallengeThreshold 
} = useGlobalThresholds();

// Manage semua challenge thresholds dalam satu place
const smileThreshold = getChallengeThreshold("senyum");
```

---

## 💾 Data Persistence

Semua threshold otomatis tersimpan di **browser localStorage**:

- ✅ Tersimpan saat user mengubah nilai
- ✅ Otomatis di-load saat page refresh
- ✅ Per-challenge (tidak berpengaruh ke challenge lain)
- ✅ Bisa di-reset ke default dengan satu klik

**Clear data:**
```typescript
// Clear satu challenge
localStorage.removeItem("threshold_senyum");

// Clear semua
localStorage.clear();
```

---

## 🔧 Modifying Default Values

Edit file `src/config/thresholds.ts`:

```typescript
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  senyum: {
    threshold: 0.7,      // ← Ubah ini
    label: "Senyum",
    min: 0.3,
    max: 1,
    step: 0.05,
  },
  // ... other challenges
};
```

---

## 📊 Integrated Example

Lihat implementasi lengkap di:

- **[src/app/page.tsx](src/app/page.tsx)** - Main page dengan threshold integration
- **[THRESHOLD_GUIDE.md](THRESHOLD_GUIDE.md)** - User guide (Bahasa Indonesia)
- **[THRESHOLD_API.md](THRESHOLD_API.md)** - API documentation
- **[src/app/threshold-examples.tsx](src/app/threshold-examples.tsx)** - 5 contoh implementasi

---

## ✅ Checklist

- [x] Default threshold configurations
- [x] React hooks untuk state management
- [x] UI components untuk controls
- [x] LocalStorage persistence
- [x] Main page integration
- [x] Example implementations
- [x] User guide (Bahasa Indonesia)
- [x] API documentation

---

## 🎯 Next Steps

1. **Test di browser:** Buka app, ubah threshold, lihat di localStorage
2. **Customize defaults:** Edit `src/config/thresholds.ts` sesuai kebutuhan
3. **Build components:** Gunakan hook dan components di pages lain
4. **Baca documentasi:** Lihat `THRESHOLD_GUIDE.md` dan `THRESHOLD_API.md`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Threshold tidak tersimpan | Aktifkan localStorage di browser |
| Tidak ada panel threshold | Import `ThresholdPanel` dengan path benar |
| Error import modules | Pastikan `"use client"` di atas component |
| Threshold tidak berubah | Pass `activeThresholds` ke modal sebagai props |

---

## 📞 Support

- **Questions?** Lihat [THRESHOLD_API.md](THRESHOLD_API.md)
- **How to use?** Lihat [THRESHOLD_GUIDE.md](THRESHOLD_GUIDE.md)
- **Examples?** Lihat [src/app/threshold-examples.tsx](src/app/threshold-examples.tsx)

---

**Last Updated:** January 2025  
**Version:** 1.0
