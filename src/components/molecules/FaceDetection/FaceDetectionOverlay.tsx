"use client";
import { useFaceDetection } from "@/hooks/use-face-detection";
import React, { useEffect } from "react";
import { toast } from "../../ui/use-toast";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
};

const FaceDetectionOverlay = ({ canvasRef, videoRef, isActive }: Props) => {
  const { isReady, detectFace, drawDetection } = useFaceDetection();
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const [isSmiling, setIsSmiling] = React.useState(false);
  const [isYawLeft, setIsYawLeft] = React.useState(false);
  const [isYawRight, setIsYawRight] = React.useState(false);
  const [isPitchUp, setIsPitchUp] = React.useState(false);
  const [isPitchDown, setIsPitchDown] = React.useState(false);
  const [isRollLeft, setIsRollLeft] = React.useState(false);
  const [isRollRight, setIsRollRight] = React.useState(false);

  // Handle video ready state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handleLoadedMetadata = () => {
      if (video.readyState >= 2) {
        // HAVE_CURRENT_DATA
        setIsVideoReady(true);
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Check if video is already ready
    if (video.readyState >= 2) {
      setIsVideoReady(true);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  // Clear overlay when camera is stopped
  useEffect(() => {
    if (!isActive) {
      // Reset all state indicators when camera is stopped
      setIsSmiling(false);
      setIsYawLeft(false);
      setIsYawRight(false);
      setIsPitchUp(false);
      setIsPitchDown(false);
      setIsRollLeft(false);
      setIsRollRight(false);
      setIsVideoReady(false);

      // Clear the canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [isActive, canvasRef]);

  // Run face detection when everything is ready
  useEffect(() => {
    if (
      !isReady ||
      !isActive ||
      !isVideoReady ||
      !videoRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    let animationFrameId: number;

    const detect = async () => {
      try {
        const detection = await detectFace(video);
        if (detection?.expressions) {
          // check if expression is happy
          const sortedExpressions = Object.entries(
            detection.expressions as Record<string, number>
          ).sort(([, a], [, b]) => (b as number) - (a as number));

          // check if expression is happy and confidence is above 0.9
          if (
            sortedExpressions[0]?.[0] === "happy" &&
            (sortedExpressions[0]?.[1] as number) > 0.9
          ) {
            setIsSmiling(true);
          } else {
            setIsSmiling(false);
          }
        }

        if (detection) {
          const yaw = detection.angle.yaw;
          const pitch = detection.angle.pitch;
          const roll = detection.angle.roll;
          if (yaw < -45) {
            setIsYawLeft(true);
          } else if (yaw > 45) {
            setIsYawRight(true);
          } else {
            setIsYawLeft(false);
            setIsYawRight(false);
          }
          if (pitch < -45) {
            setIsPitchUp(true);
          } else if (pitch > 45) {
            setIsPitchDown(true);
          } else {
            setIsPitchUp(false);
            setIsPitchDown(false);
          }
          if (roll < -45) {
            setIsRollLeft(true);
          } else if (roll > 45) {
            setIsRollRight(true);
          } else {
            setIsRollLeft(false);
            setIsRollRight(false);
          }
        }

        // Update canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw detection (or clear if no detection)
        drawDetection(canvas, detection, {
          width: video.videoWidth,
          height: video.videoHeight,
        });
      } catch (error) {
        toast({
          title: "Face detection error",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });

        setIsSmiling(false);
        setIsYawLeft(false);
        setIsYawRight(false);
        setIsPitchUp(false);
        setIsPitchDown(false);
        setIsRollLeft(false);
        setIsRollRight(false);
      }

      // Continue the detection loop
      animationFrameId = requestAnimationFrame(detect);
    };

    // Start detection
    detect();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    isReady,
    isActive,
    isVideoReady,
    videoRef,
    canvasRef,
    detectFace,
    drawDetection,
  ]);

  // Update canvas size when video size changes
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const updateCanvasSize = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.style.width = `${video.offsetWidth}px`;
        canvas.style.height = `${video.offsetHeight}px`;
      }
    };

    // Initial update
    updateCanvasSize();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(video);

    return () => {
      resizeObserver.disconnect();
    };
  }, [videoRef]);

  return (
    <>
      {isSmiling && (
        <p className="text-white bg-black text-lg absolute top-0 left-1/2 -translate-x-1/2">
          Smiling
        </p>
      )}
      {isYawLeft && (
        <p className="text-white bg-black text-lg absolute top-[20px] left-1/2 -translate-x-1/2">
          Yaw Left
        </p>
      )}
      {isYawRight && (
        <p className="text-white bg-black text-lg absolute top-[40px] left-1/2 -translate-x-1/2">
          Yaw Right
        </p>
      )}
      {isPitchUp && (
        <p className="text-white bg-black text-lg absolute top-[60px] left-1/2 -translate-x-1/2">
          Pitch Up
        </p>
      )}
      {isPitchDown && (
        <p className="text-white bg-black text-lg absolute top-[80px] left-1/2 -translate-x-1/2">
          Pitch Down
        </p>
      )}
      {isRollLeft && (
        <p className="text-white bg-black text-lg absolute top-[120px] left-1/2 -translate-x-1/2">
          Roll Left
        </p>
      )}
      {isRollRight && (
        <p className="text-white bg-black text-lg absolute top-[140px] left-1/2 -translate-x-1/2">
          Roll Right
        </p>
      )}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none z-10"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
};

export default FaceDetectionOverlay;
