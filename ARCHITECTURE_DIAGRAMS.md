# Custom Threshold System - Architecture & Flow Diagrams

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ThresholdPanel Component                                   │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │ ⚙️ Pengaturan Threshold  [Senyum]         [▼]         │ │  │
│  │  ├────────────────────────────────────────────────────────┤ │  │
│  │  │ Level Senyum: [===●========] 0.70                      │ │  │
│  │  │ Derajat: [=====●======] 35°                            │ │  │
│  │  │ Bukaan Mulut: [===●==] 0.50                            │ │  │
│  │  │                                                         │ │  │
│  │  │ [Simpan & Terapkan]  [↺ Reset]                         │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────┬──────────────────────────────────────────┘
                         │
                    onChange event
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│            STATE MANAGEMENT LAYER                                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useThresholdManager Hook                                    │  │
│  │                                                              │  │
│  │  thresholds = {                                             │  │
│  │    threshold: 0.70,     // Senyum                           │  │
│  │    thresholdDeg: 35,    // Head angle                       │  │
│  │    thresholdMouth: 0.5  // Mouth opening                    │  │
│  │  }                                                           │  │
│  │                                                              │  │
│  │  updateThresholds(newValues)                                │  │
│  │  resetToDefault()                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │ useEffect()          │
        │                      │
        ▼                      ▼
   ┌─────────────┐      ┌──────────────────┐
   │ localStorage│      │ React State      │
   │             │      │ (setThresholds)  │
   │ Key:        │      │                  │
   │ threshold_  │      │ Triggers re-     │
   │ senyum      │      │ render & passes  │
   │             │      │ props            │
   └─────────────┘      └──────────┬───────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│            APPLICATION LAYER                                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Page Component (src/app/page.tsx)                           │  │
│  │                                                              │  │
│  │  const { thresholds } = useThresholdManager("senyum")      │  │
│  │  const [activeThresholds, setActiveThresholds] =           │  │
│  │        useState(thresholds)                                │  │
│  │                                                              │  │
│  │  onApply = (newThresholds) => {                             │  │
│  │    setActiveThresholds(newThresholds)  ← Update state       │  │
│  │  }                                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
                   │ Pass activeThresholds as props
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│            CHALLENGE EXECUTION LAYER                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ExpressionChallengeModal                                    │  │
│  │                                                              │  │
│  │  <ExpressionChallengeModal                                  │  │
│  │    type="senyum"                                            │  │
│  │    threshold={activeThresholds.threshold}  ← Custom value  │  │
│  │    thresholdDeg={activeThresholds.thresholdDeg}            │  │
│  │    thresholdMouth={activeThresholds.thresholdMouth}        │  │
│  │    onResult={handleResult}                                 │  │
│  │  />                                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
                   │ Pass to detection hook
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│            DETECTION LAYER                                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ useExpressionChallenge Hook                                 │  │
│  │                                                              │  │
│  │  requestAnimationFrame loop:                                │  │
│  │    1. Detect face                                           │  │
│  │    2. Extract landmarks & expressions                      │  │
│  │    3. Call detectForType(result, challengeType,            │  │
│  │                          {threshold, thresholdDeg, ...})   │  │
│  │    4. Compare: happy >= 0.70 ? PASS : FAIL                 │  │
│  │    5. Track matched frames                                 │  │
│  │    6. Calculate final score                                │  │
│  │                                                              │  │
│  │  emit ChallengeResult to parent                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Sequence

```
User moves slider
     ↓
ThresholdControls.onChange(value)
     ↓
useThresholdManager.updateThresholds(value)
     ↓
setState(newThresholds)
     ↓
useEffect triggers → localStorage.setItem()
     ↓
Component re-renders
     ↓
Page component receives new thresholds
     ↓
activeThresholds updated
     ↓
ExpressionChallengeModal re-mounts with new props
     ↓
useExpressionChallenge uses new threshold
     ↓
detectForType() compares with custom threshold
     ↓
Challenge difficulty adjusted
     ↓
User experiences easier/harder challenge
```

---

## 🗂️ File Organization

```
src/
├── config/
│   └── thresholds.ts
│       └── Stores default values for all challenge types
│           - DEFAULT_THRESHOLDS object
│           - getDefaultThreshold() function
│
├── hooks/
│   └── useThresholdManager.ts
│       ├── useThresholdManager()
│       │   └── Manages single challenge threshold
│       │       - State from localStorage
│       │       - Auto-save on change
│       │       - Reset to default
│       │
│       └── useGlobalThresholds()
│           └── Manages all challenges thresholds
│               - Global state
│               - Per-challenge updates
│               - Batch reset
│
├── components/
│   ├── molecules/
│   │   └── ThresholdControls.tsx
│   │       ├── Slider for threshold values
│   │       ├── Compact mode
│   │       └── Full mode
│   │
│   └── organisms/
│       └── ThresholdPanel.tsx
│           ├── Wrapper for ThresholdControls
│           ├── Collapse/expand UI
│           ├── Save & Apply button
│           ├── Reset button
│           └── Tips display
│
└── app/
    ├── page.tsx (Updated)
    │   ├── Import hooks & components
    │   ├── Use useThresholdManager
    │   ├── Use ThresholdPanel
    │   ├── Pass activeThresholds to modal
    │   └── Handle threshold changes
    │
    └── threshold-examples.tsx
        └── 5 example implementations
```

---

## 🔄 Component Interaction Diagram

```
                    ┌─────────────────────────┐
                    │   ThresholdPanel        │
                    │  (User Interface)       │
                    └────────────┬────────────┘
                                 │
                    onChange → updateThresholds()
                                 │
                    ┌────────────▼─────────────┐
                    │ useThresholdManager      │
                    │ • thresholds state       │
                    │ • updateThresholds()     │
                    │ • localStorage persist   │
                    └────────────┬─────────────┘
                                 │
                    return thresholds
                                 │
           ┌─────────────────────┼──────────────────────┐
           │                     │                      │
        Mount            useEffect            setState
           │                     │                      │
      Load from           localStorage          re-render
      localStorage        setItem()             component
           │                     │                      │
           └─────────────────────┼──────────────────────┘
                                 │
                    Page Component receives state
                                 │
                    onApply() → setActiveThresholds()
                                 │
           ┌─────────────────────┴──────────────────────┐
           │                                            │
    ┌─────▼──────────────────┐            ┌──────────▼───────────┐
    │ ExpressionChallengeModal │            │   useExpressionChallenge  │
    │ • threshold              │            │ • RAF detection loop  │
    │ • thresholdDeg           │            │ • Compare with custom │
    │ • thresholdMouth         │            │   threshold values    │
    └─────┬──────────────────┘            └──────────┬────────────┘
          │                                           │
          │ Pass props                   Use thresholds in
          │                              detectForType()
          └───────────────────┬──────────────────────┘
                              │
                    Result calculation
                    (success/score)
                              │
                              ▼
                    onResult callback
                              │
                         UI Update
```

---

## 💾 LocalStorage Structure

```
Browser LocalStorage
├── threshold_senyum: {
│   "threshold": 0.7,
│   "neutralThreshold": 0.2
│ }
│
├── threshold_lihat_kanan: {
│   "thresholdDeg": 35
│ }
│
├── threshold_buka_mulut: {
│   "thresholdMouth": 0.5
│ }
│
├── threshold_angguk: {
│   "thresholdDeg": 20,
│   "requiredRepeats": 2
│ }
│
└── global_thresholds: {
    "senyum": { "threshold": 0.7, ... },
    "lihat_kanan": { "thresholdDeg": 35 },
    "buka_mulut": { "thresholdMouth": 0.5 },
    ...
  }
```

---

## 🎯 Challenge Type to Threshold Mapping

```
Challenge Type          Input Type      Property            Range
═══════════════════════════════════════════════════════════════════
senyum                  Slider          threshold           0.3-1.0
lihat_kanan             Slider          thresholdDeg        10-60°
lihat_kiri              Slider          thresholdDeg        10-60°
lihat_atas              Slider          thresholdDeg        5-50°
lihat_bawah             Slider          thresholdDeg        5-50°
buka_mulut              Slider          thresholdMouth      0.2-1.0
kedip                   Slider          threshold           0.1-0.3
angguk                  2 Sliders       thresholdDeg        5-50°
                                        requiredRepeats     1-5x
geleng                  2 Sliders       thresholdDeg        10-60°
                                        requiredRepeats     1-5x
senyum_geleng           3 Sliders       threshold           0.3-1.0
                                        requiredRepeats     1-5x
                                        neutralThreshold    0.1-0.3
```

---

## 🔌 Hook Usage Pattern

```
┌─────────────────────────────────────────────────┐
│ OPTION 1: Single Challenge (useThresholdManager) │
└─────────────────────────────────────────────────┘

export function MyComponent() {
  const { 
    thresholds,           // ← current values
    updateThresholds,     // ← update function
    resetToDefault        // ← reset function
  } = useThresholdManager("senyum");

  return (
    <div>
      Value: {thresholds.threshold}
      <button onClick={() => 
        updateThresholds({ threshold: 0.5 })
      }>
        Set to 0.5
      </button>
    </div>
  );
}

┌────────────────────────────────────────────────────────┐
│ OPTION 2: Multiple Challenges (useGlobalThresholds) │
└────────────────────────────────────────────────────────┘

export function MyComponent() {
  const {
    allThresholds,            // ← all thresholds
    updateChallengeThreshold, // ← update specific
    getChallengeThreshold,    // ← get specific
    resetAll                  // ← reset all
  } = useGlobalThresholds();

  return (
    <div>
      <pre>{JSON.stringify(allThresholds)}</pre>
      <button onClick={resetAll}>Reset All</button>
    </div>
  );
}
```

---

## 📈 Difficulty Scaling Example

```
Smile Threshold Levels:

Very Easy        Easy        Medium       Hard       Very Hard
   0.3          0.5          0.7         0.85         0.95
    │            │            │           │            │
    ├────────┬───┼───┬────────┼───┬──────┼───┬────────┼
    └────────┴───┴───┴────────┴───┴──────┴───┴────────┘
    
    [●    ]      [   ●     ]      [        ●         ]      [              ●]

User experience:
0.3  = Easy to get any smile to pass
0.5  = Moderate smile required
0.7  = Noticeable smile required (DEFAULT)
0.85 = Big smile required
0.95 = Very big smile required

Head Turn Threshold:
10°  = Very easy (minimal turn)
20°  = Moderate
35°  = Default (noticeable turn)
50°  = Hard (extreme turn)
60°  = Very hard (maximum turn)
```

---

## ⚡ Performance Considerations

```
Rendering Flow:
────────────────

User moves slider
  │
  ├─ Expensive: onChange handler
  │    └─ updateThresholds(value)
  │
  ├─ Cheap: useEffect (runs async)
  │    └─ localStorage.setItem() [async I/O]
  │
  ├─ Cheap: setState
  │    └─ Re-render component
  │
  └─ Result: Smooth 60fps UI

Challenge Detection Flow:
──────────────────────────

requestAnimationFrame loop (60fps target)
  │
  ├─ Detect face      [~10ms]
  ├─ Extract features [~5ms]
  ├─ Compare threshold [~1ms] ← Using custom threshold
  ├─ Update state     [~0.5ms]
  └─ Total:           ~16.5ms per frame

Custom threshold has minimal performance impact (<1ms).
```

---

## 🔐 Type Safety

```typescript
// Strong typing throughout

type ThresholdState = {
  threshold?: number;
  thresholdDeg?: number;
  thresholdMouth?: number;
  requiredRepeats?: number;
  neutralThreshold?: number;
};

// Hook return type
type UseThresholdManager = {
  thresholds: ThresholdState;
  updateThresholds: (values: Partial<ThresholdState>) => void;
  resetToDefault: () => void;
  config: any;
};

// Component props
interface ThresholdControlsProps {
  challengeType: ChallengeType;
  values: CustomThresholds;
  onChange: (values: CustomThresholds) => void;
  compact?: boolean;
}

// Ensures type safety and IDE autocomplete
```

---

## 📋 Integration Checklist

- [x] Import `useThresholdManager` hook
- [x] Import `ThresholdPanel` component
- [x] Create state for `activeThresholds`
- [x] Pass thresholds to `ExpressionChallengeModal`
- [x] Handle threshold changes with callback
- [x] Verify localStorage persistence
- [x] Test with different threshold values
- [x] Verify challenge difficulty changes

---

**Version**: 1.0  
**Last Updated**: January 2025
