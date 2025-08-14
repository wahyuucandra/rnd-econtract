"use client";
import React from "react";

export function VideoHUD({ countdown }: { countdown: number; }) {
  return (
    <>
      <div className="absolute top-6 right-6 bg-white/80 text-xs px-2 py-1 rounded">Sisa: {Math.ceil(countdown)} dtk</div>
    </>
  );
}