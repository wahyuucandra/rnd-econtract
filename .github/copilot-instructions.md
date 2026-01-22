# AI Coding Assistant Instructions for rnd-econtract

## Project Overview

**rnd-econtract** is a Next.js face detection and facial expression challenge application. It uses `@vladmandic/face-api` (a TensorFlow.js-based ML library) to detect faces, analyze facial expressions, head pose, and eye blinks via webcam. Users can participate in interactive challenges requiring specific facial expressions or head movements (e.g., smile, look right, blink, nod).

**Key Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Radix UI, React Hooks, Client-Side ML

---

## Architecture & Data Flow

### Core Components

1. **CameraProvider** ([src/providers/CameraProvider.tsx](src/providers/CameraProvider.tsx))
   - Global context managing MediaStream access
   - Handles HTTPS requirement check and getUserMedia fallbacks
   - Provides `useCamera()` hook for stream access across app
   - **Pattern:** Provider wraps entire app in [src/app/layout.tsx](src/app/layout.tsx)

2. **Face Detection Layer** ([src/lib/face-detection.ts](src/lib/face-detection.ts))
   - Singleton `FaceDetectionService` class
   - Dynamically imports face-api (prevents SSR hydration issues)
   - Lazy-loads models from `/public/models/` directory on first use
   - Manages loading state: models → landmarks → expressions

3. **Challenge System** ([src/interface/challenge.ts](src/interface/challenge.ts) + [src/hooks/useExpressionChallenge.ts](src/hooks/useExpressionChallenge.ts))
   - 10 challenge types: `senyum`, `lihat_kanan`, `lihat_kiri`, `buka_mulut`, `kedip`, etc. (Indonesian labels)
   - `useExpressionChallenge` hook runs real-time face detection in RAF loop
   - Tracks frames, matched frames, best score, countdown timer
   - Uses helper detection functions for each challenge type

4. **Expression Modal** ([src/components/organisms/ExpressionChallengeModal.tsx](src/components/organisms/ExpressionChallengeModal.tsx))
   - Full-screen overlay with live video, HUD, instructions, results
   - Integrates `useExpressionChallenge` for actual detection logic
   - Managed by page state in [src/app/page.tsx](src/app/page.tsx) for queue handling

### Data Flow

```
User clicks "Mulai Challenge"
  ↓
CameraProvider.ensureStream() → getUserMedia (front camera default)
  ↓
ExpressionChallengeModal mounts
  ↓
useExpressionChallenge hook:
  1. Load face-api models
  2. requestAnimationFrame loop starts
  3. detectSingleFace + landmarks + expressions
  4. Call detectors.detectForType(result, challengeType, thresholds)
  5. Track matched frames vs. total frames
  6. On timer end: calculate score, emit ChallengeResult
  ↓
Result shown to user, queue advances if multi-challenge mode
```

---

## Developer Workflows

### Build & Run

- **Dev server:** `yarn dev` (runs on port 4000, not 3000)
- **Build:** `yarn build` (Next.js build, handles SSR/client separation)
- **Lint:** `yarn lint` (ESLint configured in [package.json](package.json))
- **Format:** Prettier runs via lint-staged on git commit

### Key Files for Common Tasks

| Task | Primary Files |
|------|---|
| Add new challenge type | [src/interface/challenge.ts](src/interface/challenge.ts), [src/utils/helpers/detectors.ts](src/utils/helpers/detectors.ts), [src/utils/helpers/challengeHelpers.ts](src/utils/helpers/challengeHelpers.ts) |
| Adjust detection thresholds | [src/hooks/useExpressionChallenge.ts](src/hooks/useExpressionChallenge.ts) (line ~30, TinyFaceDetectorOptions), detector functions in detectors.ts |
| Add camera features | [src/providers/CameraProvider.tsx](src/providers/CameraProvider.tsx), [src/components/molecules/FaceDetection/CameraControls.tsx](src/components/molecules/FaceDetection/CameraControls.tsx) |
| Fix ML model loading | [src/lib/face-detection.ts](src/lib/face-detection.ts), [src/hooks/useFaceApi.ts](src/hooks/useFaceApi.ts) |

---

## Critical Conventions & Patterns

### 1. **Client-Only Components & Hooks**
- **All face detection code is client-side.** Files use `"use client"` directive (Next.js App Router requirement).
- `FaceDetectionService.getInstance()` is a singleton; safe to call multiple times.
- Dynamic import in [src/lib/face-detection.ts](src/lib/face-detection.ts) prevents `window is undefined` errors during SSR.

### 2. **Model Location & Caching**
- Models stored in `/public/models/` (static assets)
- Loaded via `faceapi.nets.*.loadFromUri("/models")`
- Manifest files (e.g., `*-weights_manifest.json`) list shards for download
- **⚠️ Don't move model files** without updating fetch paths in [src/lib/face-detection.ts](src/lib/face-detection.ts) and [src/hooks/useFaceApi.ts](src/hooks/useFaceApi.ts)

### 3. **Real-Time Detection Loop Pattern**
From [src/hooks/useExpressionChallenge.ts](src/hooks/useExpressionChallenge.ts):
```typescript
const detectFrame = async () => {
  const detections = await faceapi
    .detectSingleFace(videoRef.current, options)
    .withFaceLandmarks()
    .withFaceExpressions();
  
  if (detections) {
    // Call detector function for current challenge type
    const matched = detectForType(detections, challengeType, thresholds);
    if (matched) matchedRef.current++;
  }
  framesRef.current++;
  rafRef.current = requestAnimationFrame(detectFrame);
};
```
- Use `detectSingleFace()` (optimized for one face) not `detectAllFaces()`
- Always use `requestAnimationFrame` to avoid blocking UI
- Store refs for counters (not setState) to prevent re-renders in hot loop

### 4. **Helper Functions Organization**
Files in [src/utils/helpers/](src/utils/helpers/):
- **detectors.ts:** Challenge-type-specific detection logic (e.g., `detectSmile`, `detectHeadTurn`)
- **pose.ts:** Head pose estimation from landmarks (roll, yaw, pitch)
- **blink.ts:** Eye-aspect-ratio (EAR) calculation for blink detection
- **challengeHelpers.ts:** UI-related helpers (readable names, instruction text)

### 5. **Type System**
Core types in [src/types/face-detection.ts](src/types/face-detection.ts):
- `FaceDetectionResult`: Box + expressions + landmarks + head angle
- `FaceLandmarks68`: 68-point array from face-api
- `ChallengeType`: Union of 10 Indonesian challenge names
- `ChallengeResult`: Includes `type`, `success`, `score`, frame counts

---

## Integration Points & External Dependencies

### Face-API Integration
- **Library:** `@vladmandic/face-api` (ESM build, TensorFlow.js-based)
- **Next.js webpack config:** [next.config.mjs](next.config.mjs) includes ESM handling for face-api
- **Models required:** tiny_face_detector, faceLandmark68Net, faceExpressionNet

### Radix UI Primitive Components
- Located in [src/components/ui/](src/components/ui/)
- Used in organisms/molecules (e.g., AlertDialog, Toast, Dialog)
- Styled with Tailwind CSS

### Camera Access
- Requires **HTTPS** in production (checked in CameraProvider)
- Defaults to front-facing camera (`facingMode: "user"`)
- Falls back to any available camera if constraint fails

---

## Key Gotchas & Best Practices

1. **SSR/Hydration:** Never call `window` or import face-api at module level in non-client files. Use dynamic imports with `typeof window` checks.
2. **Memory Leaks:** Always cancel RAF and stop media tracks in cleanup. See `useExpressionChallenge` cleanup code (line ~90).
3. **Model Loading:** First challenge load is slow (models download once). Subsequent challenges reuse cached models.
4. **Performance:** Keep detection loop tight; move heavy work (e.g., API calls, state updates) outside RAF.
5. **Internationalization:** Challenge names and instructions are in Indonesian (Bahasa Indonesia). Maintain consistency.
6. **Threshold Tuning:** Adjustable per-challenge—expression thresholds (0.0–1.0), head angle (degrees), mouth openness (0.0–1.0). Experiment in [src/app/page.tsx](src/app/page.tsx) UI.

---

## Common Debugging Steps

- **Models fail to load:** Check `/public/models/` files exist; verify network tab in DevTools (CORS, 404s).
- **Face not detected:** Lighting, camera angle, or model score threshold too high. Lower `scoreThreshold` in [src/hooks/useExpressionChallenge.ts](src/hooks/useExpressionChallenge.ts).
- **Challenge won't trigger:** Verify detector function in [src/utils/helpers/detectors.ts](src/utils/helpers/detectors.ts) is returning true for your input; check threshold values.
- **Camera not working:** Ensure HTTPS (or localhost), browser permissions granted, and camera plugged in.

---

## Quick Reference: File Purposes

| File/Dir | Purpose |
|---|---|
| [src/providers/CameraProvider.tsx](src/providers/CameraProvider.tsx) | Global camera stream management |
| [src/hooks/useFaceApi.ts](src/hooks/useFaceApi.ts) | Model loading hook |
| [src/hooks/useExpressionChallenge.ts](src/hooks/useExpressionChallenge.ts) | Core challenge logic (detection loop, state, scoring) |
| [src/lib/face-detection.ts](src/lib/face-detection.ts) | FaceDetectionService singleton |
| [src/utils/helpers/detectors.ts](src/utils/helpers/detectors.ts) | Per-challenge detection algorithms |
| [src/utils/helpers/pose.ts](src/utils/helpers/pose.ts) | Head pose calculation |
| [src/components/organisms/ExpressionChallengeModal.tsx](src/components/organisms/ExpressionChallengeModal.tsx) | Modal UI orchestrator |
| [src/app/page.tsx](src/app/page.tsx) | Main page, challenge queue, UI controls |
