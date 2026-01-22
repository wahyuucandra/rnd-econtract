"use client";
import React from "react";
import { ChallengeType } from "@/interface/challenge";
import { DEFAULT_THRESHOLDS } from "@/config/thresholds";

export type CustomThresholds = {
  threshold?: number;
  thresholdDeg?: number;
  thresholdMouth?: number;
  requiredRepeats?: number;
  neutralThreshold?: number;
};

interface ThresholdControlsProps {
  challengeType: ChallengeType;
  values: CustomThresholds;
  onChange: (values: CustomThresholds) => void;
  compact?: boolean;
}

export const ThresholdControls: React.FC<ThresholdControlsProps> = ({
  challengeType,
  values,
  onChange,
  compact = false,
}) => {
  const config = DEFAULT_THRESHOLDS[challengeType];
  if (!config) return null;

  const handleChange = (key: string, value: number) => {
    onChange({ ...values, [key]: value });
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Smile threshold */}
        {(challengeType === "senyum" || challengeType === "senyum_netral") && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium w-24">Senyum Level:</label>
            <input
              type="range"
              min={(config as any).min}
              max={(config as any).max}
              step={(config as any).step}
              value={values.threshold ?? (config as any).threshold}
              onChange={(e) => handleChange("threshold", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs w-12 text-right">
              {(values.threshold ?? (config as any).threshold).toFixed(2)}
            </span>
          </div>
        )}

        {/* Head angle threshold */}
        {["lihat_kanan", "lihat_kiri", "lihat_atas", "lihat_bawah", "anggukan_kepala", "geleng_kepala"].includes(
          challengeType
        ) && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium w-24">Derajat:</label>
            <input
              type="range"
              min={(config as any).degMin || (config as any).min}
              max={(config as any).degMax || (config as any).max}
              step={(config as any).degStep || (config as any).step}
              value={values.thresholdDeg ?? (config as any).thresholdDeg}
              onChange={(e) => handleChange("thresholdDeg", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs w-12 text-right">
              {(values.thresholdDeg ?? (config as any).thresholdDeg).toFixed(0)}°
            </span>
          </div>
        )}

        {/* Mouth threshold */}
        {challengeType === "buka_mulut" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium w-24">Bukaan:</label>
            <input
              type="range"
              min={(config as any).min}
              max={(config as any).max}
              step={(config as any).step}
              value={values.thresholdMouth ?? (config as any).thresholdMouth}
              onChange={(e) => handleChange("thresholdMouth", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs w-12 text-right">
              {(values.thresholdMouth ?? (config as any).thresholdMouth).toFixed(2)}
            </span>
          </div>
        )}

        {/* Blink threshold */}
        {challengeType === "kedip" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium w-24">Sensitifitas:</label>
            <input
              type="range"
              min={(config as any).min}
              max={(config as any).max}
              step={(config as any).step}
              value={values.threshold ?? (config as any).threshold}
              onChange={(e) => handleChange("threshold", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs w-12 text-right">
              {(values.threshold ?? (config as any).threshold).toFixed(2)}
            </span>
          </div>
        )}

        {/* Required repeats */}
        {["anggukan_kepala", "geleng_kepala", "senyum_geleng"].includes(challengeType) && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium w-24">Pengulangan:</label>
            <input
              type="range"
              min={(config as any).repeatsMin}
              max={(config as any).repeatsMax}
              step={(config as any).repeatsStep}
              value={values.requiredRepeats ?? (config as any).requiredRepeats}
              onChange={(e) => handleChange("requiredRepeats", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs w-12 text-right">
              {values.requiredRepeats ?? (config as any).requiredRepeats}x
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full layout
  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="font-semibold text-sm">Pengaturan {config.label}</h3>

      {/* Smile threshold */}
      {(challengeType === "senyum" || challengeType === "senyum_netral") && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Level Senyum</label>
            <span className="text-sm font-mono">
              {(values.threshold ?? (config as any).threshold).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={(config as any).min}
            max={(config as any).max}
            step={(config as any).step}
            value={values.threshold ?? (config as any).threshold}
            onChange={(e) => handleChange("threshold", parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Semakin tinggi = senyum lebih besar diperlukan
          </p>
        </div>
      )}

      {/* Head angle threshold */}
      {["lihat_kanan", "lihat_kiri", "lihat_atas", "lihat_bawah", "anggukan_kepala", "geleng_kepala"].includes(
        challengeType
      ) && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Derajat Putar</label>
            <span className="text-sm font-mono">
              {(values.thresholdDeg ?? (config as any).thresholdDeg).toFixed(0)}°
            </span>
          </div>
          <input
            type="range"
            min={(config as any).degMin || (config as any).min}
            max={(config as any).degMax || (config as any).max}
            step={(config as any).degStep || (config as any).step}
            value={values.thresholdDeg ?? (config as any).thresholdDeg}
            onChange={(e) => handleChange("thresholdDeg", parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Semakin besar = putaran kepala harus lebih ekstrim
          </p>
        </div>
      )}

      {/* Mouth threshold */}
      {challengeType === "buka_mulut" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Bukaan Mulut</label>
            <span className="text-sm font-mono">
              {(values.thresholdMouth ?? (config as any).thresholdMouth).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={(config as any).min}
            max={(config as any).max}
            step={(config as any).step}
            value={values.thresholdMouth ?? (config as any).thresholdMouth}
            onChange={(e) => handleChange("thresholdMouth", parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Semakin tinggi = mulut harus dibuka lebih lebar
          </p>
        </div>
      )}

      {/* Blink threshold */}
      {challengeType === "kedip" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Sensitifitas Kedip</label>
            <span className="text-sm font-mono">
              {(values.threshold ?? (config as any).threshold).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={(config as any).min}
            max={(config as any).max}
            step={(config as any).step}
            value={values.threshold ?? (config as any).threshold}
            onChange={(e) => handleChange("threshold", parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Semakin rendah = lebih sensitif mendeteksi kedip
          </p>
        </div>
      )}

      {/* Required repeats */}
      {["anggukan_kepala", "geleng_kepala", "senyum_geleng"].includes(challengeType) && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Jumlah Pengulangan</label>
            <span className="text-sm font-mono">
              {values.requiredRepeats ?? (config as any).requiredRepeats}x
            </span>
          </div>
          <input
            type="range"
            min={(config as any).repeatsMin}
            max={(config as any).repeatsMax}
            step={(config as any).repeatsStep}
            value={values.requiredRepeats ?? (config as any).requiredRepeats}
            onChange={(e) => handleChange("requiredRepeats", parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Jumlah gerakan yang harus diulang untuk menyelesaikan challenge
          </p>
        </div>
      )}
    </div>
  );
};
