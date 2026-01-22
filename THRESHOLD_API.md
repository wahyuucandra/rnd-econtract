# Custom Threshold API Documentation

## 📦 Overview

Custom threshold system memberikan fleksibilitas untuk mengatur tingkat kesulitan challenge secara dinamis. Sistem ini menyediakan:

- **Default configuration** untuk setiap challenge type
- **React hooks** untuk manage threshold state
- **UI components** untuk kontrol threshold
- **LocalStorage persistence** untuk menyimpan pengaturan

---

## 📁 File Structure

```
src/
├── config/
│   └── thresholds.ts              # Default threshold configurations
├── hooks/
│   └── useThresholdManager.ts      # Custom hooks untuk manage threshold
├── components/
│   ├── molecules/
│   │   └── ThresholdControls.tsx   # UI components untuk slider
│   └── organisms/
│       └── ThresholdPanel.tsx      # Panel UI wrapper
└── app/
    ├── page.tsx                     # Main page dengan threshold integration
    └── threshold-examples.tsx       # Example implementations
```

---

## 🔌 API Reference

### Config: `src/config/thresholds.ts`

#### `DEFAULT_THRESHOLDS: ThresholdConfig`

Menyimpan konfigurasi default untuk semua challenge types.

**Type:**
```typescript
type ThresholdConfig = {
  [challengeType: string]: {
    // Sesuai dengan challenge type
    threshold?: number;
    thresholdDeg?: number;
    thresholdMouth?: number;
    requiredRepeats?: number;
    neutralThreshold?: number;
    // Metadata untuk UI
    label: string;
    min?: number;
    max?: number;
    step?: number;
  }
}
```

**Contoh:**
```typescript
DEFAULT_THRESHOLDS.senyum // { threshold: 0.7, label: "Senyum", min: 0.3, max: 1, step: 0.05 }
DEFAULT_THRESHOLDS.lihat_kanan // { thresholdDeg: 35, label: "Lihat Kanan", min: 10, max: 60, step: 5 }
```

#### `getDefaultThreshold(challengeType: string): any`

Mendapatkan threshold default untuk challenge type tertentu.

```typescript
import { getDefaultThreshold } from "@/config/thresholds";

const config = getDefaultThreshold("senyum");
console.log(config.threshold); // 0.7
```

---

### Hook: `useThresholdManager`

#### `useThresholdManager(challengeType: ChallengeType)`

Manage threshold state untuk single challenge type dengan auto-persistence ke localStorage.

**Parameters:**
- `challengeType`: Tipe challenge (e.g., "senyum", "lihat_kanan")

**Returns:**
```typescript
{
  thresholds: ThresholdState;        // Current threshold values
  updateThresholds: (values: Partial<ThresholdState>) => void;
  resetToDefault: () => void;        // Reset ke default dan clear localStorage
  config: any;                        // Threshold config untuk challenge type ini
}
```

**ThresholdState Type:**
```typescript
type ThresholdState = {
  threshold?: number;               // Untuk smile, blink detection
  thresholdDeg?: number;            // Untuk head angle detection
  thresholdMouth?: number;          // Untuk mouth opening
  requiredRepeats?: number;         // Untuk repetition challenges
  neutralThreshold?: number;        // Untuk neutral expression detection
}
```

**Contoh Penggunaan:**

```typescript
"use client";
import { useThresholdManager } from "@/hooks/useThresholdManager";

export function MyComponent() {
  const { thresholds, updateThresholds, resetToDefault } = 
    useThresholdManager("senyum");

  const handleSmileChange = (value: number) => {
    updateThresholds({ threshold: value });
  };

  return (
    <div>
      <input
        type="range"
        min="0.3"
        max="1"
        step="0.05"
        value={thresholds.threshold || 0.7}
        onChange={(e) => handleSmileChange(parseFloat(e.target.value))}
      />
      <button onClick={resetToDefault}>Reset</button>
    </div>
  );
}
```

**LocalStorage Behavior:**
- Otomatis menyimpan ke `localStorage.threshold_{challengeType}` saat berubah
- Otomatis load dari localStorage saat mount
- `resetToDefault()` menghapus entry dari localStorage

---

### Hook: `useGlobalThresholds`

#### `useGlobalThresholds()`

Manage threshold untuk semua challenge types dalam satu state.

**Returns:**
```typescript
{
  allThresholds: Record<ChallengeType, ThresholdState>;
  updateChallengeThreshold: (type: ChallengeType, values: ThresholdState) => void;
  getChallengeThreshold: (type: ChallengeType) => ThresholdState;
  resetAll: () => void;
}
```

**Contoh Penggunaan:**

```typescript
"use client";
import { useGlobalThresholds } from "@/hooks/useThresholdManager";

export function GlobalThresholdManager() {
  const {
    allThresholds,
    updateChallengeThreshold,
    getChallengeThreshold,
    resetAll
  } = useGlobalThresholds();

  const handleUpdate = (type: ChallengeType, values: any) => {
    updateChallengeThreshold(type, values);
  };

  const smileThreshold = getChallengeThreshold("senyum");

  return (
    <div>
      <pre>{JSON.stringify(allThresholds, null, 2)}</pre>
      <button onClick={resetAll}>Reset All</button>
    </div>
  );
}
```

**LocalStorage:**
- Menyimpan semua ke `localStorage.global_thresholds` (JSON stringified)
- Satu entry untuk semua challenges

---

### Component: `ThresholdControls`

#### `<ThresholdControls />`

UI component yang menampilkan slider untuk mengontrol threshold.

**Props:**
```typescript
interface ThresholdControlsProps {
  challengeType: ChallengeType;           // Tipe challenge
  values: CustomThresholds;               // Current threshold values
  onChange: (values: CustomThresholds) => void;  // Callback saat nilai berubah
  compact?: boolean;                      // Mode compact (default: false)
}
```

**Contoh Penggunaan:**

```typescript
import { ThresholdControls } from "@/components/molecules/ThresholdControls";

<ThresholdControls
  challengeType="senyum"
  values={{ threshold: 0.7 }}
  onChange={(values) => console.log(values)}
  compact={false}
/>
```

---

### Component: `ThresholdPanel`

#### `<ThresholdPanel />`

Wrapper component untuk `ThresholdControls` dengan collapse-able UI dan buttons.

**Props:**
```typescript
interface ThresholdPanelProps {
  challengeType: ChallengeType;
  onApply?: (thresholds: any) => void;   // Callback saat "Simpan & Terapkan" di-klik
}
```

**Features:**
- Collapse/expand toggle
- Save & Apply button
- Reset to default button
- Tips display

**Contoh Penggunaan:**

```typescript
import { ThresholdPanel } from "@/components/organisms/ThresholdPanel";

<ThresholdPanel
  challengeType="lihat_kanan"
  onApply={(thresholds) => {
    console.log("Applied:", thresholds);
    // Apply threshold ke challenge
  }}
/>
```

---

## 🎯 Integration Patterns

### Pattern 1: Single Challenge with Local State

```typescript
"use client";
import { useThresholdManager } from "@/hooks/useThresholdManager";
import { ExpressionChallengeModal } from "@/components/organisms/ExpressionChallengeModal";

export function ChallengeWithThreshold() {
  const { thresholds } = useThresholdManager("senyum");

  return (
    <ExpressionChallengeModal
      type="senyum"
      threshold={thresholds.threshold ?? 0.8}
      onResult={(result) => {
        // Handle result
      }}
      onClose={() => {
        // Handle close
      }}
    />
  );
}
```

### Pattern 2: Multiple Challenges with Global State

```typescript
"use client";
import { useGlobalThresholds } from "@/hooks/useThresholdManager";

export function ChallengeQueue() {
  const { getChallengeThreshold } = useGlobalThresholds();
  const [challenges] = useState<ChallengeType[]>([
    "senyum",
    "lihat_kanan",
    "buka_mulut"
  ]);

  return (
    <div>
      {challenges.map((type) => {
        const thresholds = getChallengeThreshold(type);
        return (
          <ChallengeItem
            key={type}
            type={type}
            thresholds={thresholds}
          />
        );
      })}
    </div>
  );
}
```

### Pattern 3: Custom Difficulty Presets

```typescript
"use client";
import { useThresholdManager } from "@/hooks/useThresholdManager";

const DIFFICULTY_PRESETS = {
  easy: { threshold: 0.4, thresholdDeg: 20, thresholdMouth: 0.3 },
  medium: { threshold: 0.7, thresholdDeg: 35, thresholdMouth: 0.5 },
  hard: { threshold: 0.9, thresholdDeg: 50, thresholdMouth: 0.8 }
};

export function DifficultySelector() {
  const { updateThresholds } = useThresholdManager("senyum");

  return (
    <div>
      {Object.entries(DIFFICULTY_PRESETS).map(([level, values]) => (
        <button
          key={level}
          onClick={() => updateThresholds(values)}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
```

---

## 🔄 State Flow

```
User Input (Slider)
  ↓
ThresholdControls onChange
  ↓
updateThresholds hook function
  ↓
setState in useThresholdManager
  ↓
useEffect → localStorage.setItem
  ↓
Component re-render with new values
  ↓
Parent component receives new threshold
  ↓
ExpressionChallengeModal uses new threshold
```

---

## 💾 LocalStorage Keys

| Key | Format | Example |
|-----|--------|---------|
| Single threshold | `threshold_{type}` | `threshold_senyum` |
| All thresholds | `global_thresholds` | `{"senyum": {...}, ...}` |

**Clear LocalStorage:**
```typescript
// Clear specific challenge
localStorage.removeItem("threshold_senyum");

// Clear all thresholds
localStorage.removeItem("global_thresholds");
```

---

## 🧪 Testing

### Test Hook State Persistence

```typescript
import { renderHook, act } from "@testing-library/react";
import { useThresholdManager } from "@/hooks/useThresholdManager";

test("should persist threshold to localStorage", () => {
  const { result } = renderHook(() => useThresholdManager("senyum"));
  
  act(() => {
    result.current.updateThresholds({ threshold: 0.5 });
  });

  expect(localStorage.getItem("threshold_senyum")).toContain("0.5");
});
```

---

## ⚙️ Configuration Reference

### Available Challenge Types

| Type | threshold | thresholdDeg | thresholdMouth | requiredRepeats |
|------|-----------|--------------|----------------|-----------------|
| senyum | ✓ | | | |
| lihat_kanan | | ✓ | | |
| lihat_kiri | | ✓ | | |
| lihat_atas | | ✓ | | |
| lihat_bawah | | ✓ | | |
| buka_mulut | | | ✓ | |
| kedip | ✓ | | | |
| angguk | | ✓ | | ✓ |
| geleng | | ✓ | | ✓ |
| senyum_geleng | ✓ | | | ✓ |

---

## 🐛 Common Issues

### Issue: Threshold tidak tersimpan
**Solution:**
```typescript
// Pastikan component adalah client component
"use client";

// Pastikan localStorage accessible (tidak di SSR)
if (typeof window !== "undefined") {
  // safe to use localStorage
}
```

### Issue: Threshold tidak berubah di modal
**Solution:**
```typescript
// Pass threshold sebagai dependencies key
<ExpressionChallengeModal
  key={`${type}-${thresholds.threshold}`}
  threshold={thresholds.threshold}
/>
```

---

## 📚 Related Files

- [Configuration](src/config/thresholds.ts)
- [Hooks](src/hooks/useThresholdManager.ts)
- [UI Components](src/components/molecules/ThresholdControls.tsx)
- [Integration](src/app/page.tsx)
- [Examples](src/app/threshold-examples.tsx)
- [User Guide](THRESHOLD_GUIDE.md)

---

**API Version**: 1.0  
**Last Updated**: January 2025
