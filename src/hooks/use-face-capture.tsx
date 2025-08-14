"use client";

import { useCallback, useState } from "react";
import { useFaceDetection } from "./use-face-detection";
import { toast } from "@/components/ui/use-toast";

export interface FaceCaptureOptions {
  marginPercent?: number;
  autoDownload?: boolean;
  filename?: string;
  onSuccess?: (imageDataUrl: string) => void;
  onError?: (error: string) => void;
}

export interface UseFaceCaptureReturn {
  captureImage: (
    element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    options?: FaceCaptureOptions
  ) => Promise<string | null>;
  captureOnExpression: (
    element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    expression: string,
    threshold?: number,
    options?: FaceCaptureOptions
  ) => Promise<string | null>;
  isCapturing: boolean;
}

export const useFaceCapture = (): UseFaceCaptureReturn => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { captureFaceImage, detectFace, isReady } = useFaceDetection();

  const captureImage = useCallback(
    async (
      element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
      options: FaceCaptureOptions = {}
    ): Promise<string | null> => {
      const {
        marginPercent = 30,
        autoDownload = true,
        filename,
        onSuccess,
        onError,
      } = options;

      if (!isReady) {
        const errorMsg = "Face detection not ready";
        if (onError) onError(errorMsg);
        else
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        return null;
      }

      setIsCapturing(true);
      try {
        const imageDataUrl = await captureFaceImage(element, marginPercent);

        if (imageDataUrl) {
          // Auto download if enabled
          if (autoDownload) {
            const link = document.createElement("a");
            link.href = imageDataUrl;
            link.download =
              filename ||
              `face-capture-${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          // Call success callback
          if (onSuccess) {
            onSuccess(imageDataUrl);
          } else {
            toast({
              title: "Success",
              description: "Face image captured successfully!",
            });
          }

          return imageDataUrl;
        } else {
          const errorMsg =
            "No face detected. Please ensure your face is visible and try again.";
          if (onError) onError(errorMsg);
          else
            toast({
              variant: "destructive",
              title: "Error",
              description: errorMsg,
            });
          return null;
        }
      } catch (error) {
        const errorMsg = "Failed to capture face image. Please try again.";
        if (onError) onError(errorMsg);
        else
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [captureFaceImage, isReady]
  );

  const captureOnExpression = useCallback(
    async (
      element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
      expression: string,
      threshold: number = 0.9,
      options: FaceCaptureOptions = {}
    ): Promise<string | null> => {
      if (!isReady) {
        const errorMsg = "Face detection not ready";
        if (options.onError) options.onError(errorMsg);
        else
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        return null;
      }

      try {
        // Detect face and expressions
        const detection = await detectFace(element);

        if (!detection?.expressions) {
          const errorMsg = "No face or expressions detected";
          if (options.onError) options.onError(errorMsg);
          else
            toast({
              variant: "destructive",
              title: "Error",
              description: errorMsg,
            });
          return null;
        }

        // Check if the desired expression meets the threshold
        const expressionValue = detection.expressions[expression as keyof typeof detection.expressions];
        
        if (expressionValue && expressionValue >= threshold) {
          // Expression detected, capture the image
          return await captureImage(element, {
            ...options,
            filename: options.filename || `${expression}-capture-${new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/:/g, "-")}.png`,
          });
        } else {
          const errorMsg = `${expression} expression not detected with sufficient confidence (${threshold})`;
          if (options.onError) options.onError(errorMsg);
          else
            toast({
              variant: "destructive",
              title: "Expression Not Detected",
              description: errorMsg,
            });
          return null;
        }
      } catch (error) {
        const errorMsg = "Failed to detect expression. Please try again.";
        if (options.onError) options.onError(errorMsg);
        else
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        return null;
      }
    },
    [detectFace, captureImage, isReady]
  );

  return {
    captureImage,
    captureOnExpression,
    isCapturing,
  };
};
