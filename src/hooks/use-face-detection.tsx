"use client";

import { useEffect, useState, useCallback } from "react";
import * as faceapi from "@vladmandic/face-api";
import { faceDetectionService } from "@/lib/face-detection";

export interface FaceDetectionResult {
  detection: faceapi.FaceDetection;
  expressions?: faceapi.FaceExpressions;
  landmarks?: faceapi.FaceLandmarks68;
  angle: { roll: number; yaw: number; pitch: number };
}

export interface UseFaceDetectionReturn {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  hasModels: boolean; // Added to track if models are available
  detectFace: (
    element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
  ) => Promise<FaceDetectionResult | null>;
  drawDetection: (
    canvas: HTMLCanvasElement,
    detection: FaceDetectionResult | null,
    displaySize: { width: number; height: number }
  ) => void;
  captureFaceImage: (
    element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    marginPercent?: number
  ) => Promise<string | null>;
}

export function useFaceDetection(): UseFaceDetectionReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasModels, setHasModels] = useState(false); // Track model availability

  useEffect(() => {
    const initializeFaceAPI = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await faceDetectionService.initialize();

        const initError = faceDetectionService.getInitializationError();
        if (initError) {
          setError(initError);
        }

        const modelsAvailable = faceDetectionService.hasModels();
        setHasModels(modelsAvailable);
        setIsReady(modelsAvailable);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to initialize face detection";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFaceAPI();
  }, []);

  const detectFace = useCallback(
    async (
      element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
    ): Promise<FaceDetectionResult | null> => {
      if (!isReady) {
        return null;
      }

      try {
        const detectionWithExpressions =
          await faceDetectionService.detectSingleFaceWithExpressions(element);

        if (detectionWithExpressions) {
          // Extract detection and expressions
          const result: FaceDetectionResult = {
            detection: detectionWithExpressions.detection,
            angle: detectionWithExpressions.angle,
          };

          // Add expressions if available
          if (detectionWithExpressions.expressions) {
            result.expressions = detectionWithExpressions.expressions;
          }

          // Add landmarks if available
          if (detectionWithExpressions.landmarks) {
            result.landmarks = detectionWithExpressions.landmarks;
          }

          return result;
        }
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isReady]
  );

  const drawDetection = useCallback(
    (
      canvas: HTMLCanvasElement,
      detection: FaceDetectionResult | null,
      displaySize: { width: number; height: number }
    ) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas size to match display
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      // If no detection, just clear and return
      if (!detection) return;

      // Resize detection to match display size
      const resizedDetection = faceapi.resizeResults(detection, displaySize);
      const box = resizedDetection.detection.box;

      // Draw bounding box
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw confidence score
      ctx.fillStyle = "#00ff00";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${Math.round(resizedDetection.detection.score * 100)}%`,
        box.x,
        box.y > 20 ? box.y - 5 : box.y + 20
      );
    },
    []
  );

  const captureFaceImage = useCallback(
    async (
      element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
      marginPercent: number = 30
    ): Promise<string | null> => {
      if (!isReady) {
        return null;
      }

      try {
        const detectionWithExpressions =
          await faceDetectionService.detectSingleFaceWithExpressions(element);

        const detection = detectionWithExpressions.detection;

        // Create a temporary canvas for capturing
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return null;

        // Get source dimensions
        let sourceWidth: number, sourceHeight: number;
        if (element instanceof HTMLVideoElement) {
          sourceWidth = element.videoWidth;
          sourceHeight = element.videoHeight;
        } else if (element instanceof HTMLCanvasElement) {
          sourceWidth = element.width;
          sourceHeight = element.height;
        } else {
          sourceWidth = element.naturalWidth;
          sourceHeight = element.naturalHeight;
        }

        // Calculate face bounding box with margins
        const box = detection.box;
        const margin = Math.max(box.width, box.height) * (marginPercent / 100);

        // Calculate crop area with margins, ensuring it stays within bounds
        const cropX = Math.max(0, box.x - margin);
        const cropY = Math.max(0, box.y - margin);
        const cropWidth = Math.min(sourceWidth - cropX, box.width + 2 * margin);
        const cropHeight = Math.min(
          sourceHeight - cropY,
          box.height + 2 * margin
        );

        // Set canvas size to crop area
        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;

        // Draw the cropped face area
        tempCtx.drawImage(
          element,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        // Convert to base64 data URL
        const dataURL = tempCanvas.toDataURL("image/png");
        return dataURL;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      }
    },
    [isReady]
  );

  return {
    isLoading,
    isReady,
    error,
    hasModels, // Return model availability status
    detectFace,
    drawDetection,
    captureFaceImage,
  };
}
