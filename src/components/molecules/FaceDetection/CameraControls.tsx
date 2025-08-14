"use client";
import { toast } from "@/components/ui/use-toast";
import React, { useState, useEffect } from "react";
import { useFaceCapture } from "@/hooks/use-face-capture";
import { Camera, Download } from "lucide-react";

interface CameraDevice {
  deviceId: string;
  label: string;
}

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>;
  onImageCaptured?: (imageDataUrl: string) => void;
};

// Export the capture functions for external use
export const useCameraCapture = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const { captureImage, captureOnExpression, isCapturing } = useFaceCapture();

  const captureFace = async (marginPercent: number = 30) => {
    if (!videoRef.current) return null;
    return await captureImage(videoRef.current, { marginPercent });
  };

  const captureOnSmile = async (threshold: number = 0.9) => {
    if (!videoRef.current) return null;
    return await captureOnExpression(videoRef.current, "happy", threshold);
  };

  const captureOnExpressionCustom = async (
    expression: string,
    threshold: number = 0.9
  ) => {
    if (!videoRef.current) return null;
    return await captureOnExpression(videoRef.current, expression, threshold);
  };

  return {
    captureFace,
    captureOnSmile,
    captureOnExpression: captureOnExpressionCustom,
    isCapturing,
  };
};

const CameraControls = ({
  videoRef,
  setIsCameraActive,
  onImageCaptured,
}: Props) => {
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isEnumerating, setIsEnumerating] = useState(false);

  const { captureImage, isCapturing } = useFaceCapture();

  // Request camera permissions to get device labels
  const requestCameraPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop immediately
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access camera. Please check permissions.",
      });
      return false;
    }
  };

  // Enumerate available cameras
  const enumerateCameras = async () => {
    setIsEnumerating(true);
    try {
      // Request permissions first to get proper device labels
      await requestCameraPermissions();

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === "videoinput")
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
        }));

      setAvailableCameras(videoDevices);

      // Set default camera (prefer front camera on mobile)
      if (videoDevices.length > 0 && !selectedCameraId) {
        const frontCamera = videoDevices.find(
          (camera) =>
            camera.label.toLowerCase().includes("front") ||
            camera.label.toLowerCase().includes("user") ||
            camera.label.toLowerCase().includes("facetime")
        );
        setSelectedCameraId(frontCamera?.deviceId || videoDevices[0].deviceId);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enumerate cameras. Please check permissions.",
      });
    } finally {
      setIsEnumerating(false);
    }
  };

  // Load cameras on component mount
  useEffect(() => {
    enumerateCameras();
  }, []);

  const handleStart = async (cameraId?: string) => {
    if (!videoRef.current) return;
    setIsCameraActive(true);

    const deviceId = cameraId || selectedCameraId;

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          ...(deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: "user" }),
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access webcam. Please check permissions.",
      });
      setIsCameraActive(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleCameraChange = async (cameraId: string) => {
    setSelectedCameraId(cameraId);

    // If camera is currently active, restart with new camera
    if (videoRef.current?.srcObject) {
      handleStop();
      // Small delay to ensure cleanup
      setTimeout(() => {
        handleStart(cameraId);
      }, 100);
    }
  };

  const switchToNextCamera = () => {
    if (availableCameras.length <= 1) return;

    const currentIndex = availableCameras.findIndex(
      (camera) => camera.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];

    handleCameraChange(nextCamera.deviceId);
  };

  const handleCaptureFace = async (marginPercent: number = 30) => {
    if (!videoRef.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Camera not ready.",
      });
      return null;
    }

    return await captureImage(videoRef.current, {
      marginPercent,
      onSuccess: (imageDataUrl) => {
        if (onImageCaptured) {
          onImageCaptured(imageDataUrl);
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 border-t border-gray-300">
      {/* Main Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => handleStart()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          disabled={isEnumerating}
        >
          Start Camera
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Stop Camera
        </button>

        {/* Switch Camera Button */}
        {availableCameras.length > 1 && (
          <button
            onClick={switchToNextCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="Switch Camera"
          >
            <Camera className="w-4 h-4 mr-2 inline" />
            Switch Camera
          </button>
        )}

        {/* Capture Face Button */}
        <button
          onClick={() => handleCaptureFace()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          disabled={!videoRef.current?.srcObject || isCapturing}
          title="Capture Face Image"
        >
          {isCapturing ? (
            <>
              <div className="w-4 h-4 mr-2 inline-block border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Capturing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2 inline" />
              Capture Face
            </>
          )}
        </button>
      </div>

      {/* Camera Selection Dropdown */}
      {availableCameras.length > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <label className="text-gray-700 text-sm font-medium">Camera:</label>
          <select
            value={selectedCameraId}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isEnumerating}
          >
            {availableCameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading indicator */}
      {isEnumerating && (
        <div className="text-gray-700 text-sm text-center">
          Loading cameras...
        </div>
      )}
    </div>
  );
};

export default CameraControls;
