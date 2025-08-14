export interface FaceDetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetection {
  box: FaceDetectionBox;
  score: number;
}

export interface FaceExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  [key: string]: number; // Allow index access for dynamic expression checking
}

export interface FaceLandmarks68 {
  positions: Array<{ x: number; y: number }>;
  shift: { x: number; y: number };
}

export interface FaceAngle {
  roll: number;
  yaw: number;
  pitch: number;
}

export interface FaceDetectionResult {
  detection: FaceDetection;
  expressions?: FaceExpressions;
  landmarks?: FaceLandmarks68;
  angle: FaceAngle;
}

// Camera related types
export interface CameraDevice {
  deviceId: string;
  label: string;
}

// Face capture options
export interface FaceCaptureOptions {
  marginPercent?: number;
  autoDownload?: boolean;
  filename?: string;
  onSuccess?: (imageDataUrl: string) => void;
  onError?: (error: string) => void;
}

// Expression detection types
export type ExpressionType = keyof Omit<FaceExpressions, string>;

export interface ExpressionDetectionOptions {
  threshold?: number;
  expression: ExpressionType | string;
}

// Display size for canvas operations
export interface DisplaySize {
  width: number;
  height: number;
}

// Face detection service configuration
export interface FaceDetectionConfig {
  modelUrl?: string;
  enableExpressions?: boolean;
  enableLandmarks?: boolean;
  detectionOptions?: {
    inputSize?: number;
    scoreThreshold?: number;
  };
}
