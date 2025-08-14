"use client";
import React from "react";
import CameraControls from "./CameraControls";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>;
  onImageCaptured?: (imageDataUrl: string) => void;
};

const WebcamCapture = ({
  videoRef,
  setIsCameraActive,
  onImageCaptured,
}: Props) => {
  return (
    <CameraControls
      videoRef={videoRef}
      setIsCameraActive={setIsCameraActive}
      onImageCaptured={onImageCaptured}
    />
  );
};

export default WebcamCapture;
