"use client";
import FaceDetectionOverlay from "@/components/molecules/FaceDetection/FaceDetectionOverlay";
import WebcamCapture from "@/components/molecules/FaceDetection/WebcamCapture";
import { useFaceDetection } from "@/hooks/use-face-detection";
import Image from "next/image";

import React, { useState } from "react";

export default function Home() {
  const {
    isLoading: faceDetectionLoading,
    hasModels,
    error: faceDetectionError,
  } = useFaceDetection();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const handleImageCaptured = (imageDataUrl: string) => {
    setCapturedImages((prev) => [...prev, imageDataUrl]);
  };

  if (!faceDetectionLoading && !hasModels) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <p>
          Face detection models not found. Please download the required model
          files.
        </p>
        {faceDetectionError && <p>{faceDetectionError}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {faceDetectionLoading && (
          <div className="text-center mb-4">
            <p>Loading face detection models...</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Video Section */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[640px] bg-black rounded-lg overflow-hidden shadow-lg">
              {/* Video Container */}
              <div className="aspect-video relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <FaceDetectionOverlay
                  canvasRef={canvasRef}
                  videoRef={videoRef}
                  isActive={isCameraActive}
                />
              </div>

              {/* Camera Controls at Bottom */}
              <WebcamCapture
                videoRef={videoRef}
                setIsCameraActive={setIsCameraActive}
                onImageCaptured={handleImageCaptured}
              />
            </div>

            {/* Captured Images Gallery */}
            {capturedImages.length > 0 && (
              <div className="mt-4 w-full max-w-[640px]">
                <h3 className="text-lg font-semibold mb-2">Captured Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {capturedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Captured face ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        onClick={() =>
                          setCapturedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
