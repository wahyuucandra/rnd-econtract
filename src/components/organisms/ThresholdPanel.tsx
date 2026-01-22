"use client";
import React, { useState } from "react";
import { ChallengeType } from "@/interface/challenge";
import { useThresholdManager } from "@/hooks/useThresholdManager";
import { ThresholdControls } from "@/components/molecules/ThresholdControls";

interface ThresholdPanelProps {
  challengeType: ChallengeType;
  onApply?: (thresholds: any) => void;
}

export const ThresholdPanel: React.FC<ThresholdPanelProps> = ({ challengeType, onApply }) => {
  const { thresholds, updateThresholds, resetToDefault, config } =
    useThresholdManager(challengeType);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    onApply?.(thresholds);
    setIsExpanded(false);
  };

  if (!config) return null;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">⚙️ Pengaturan Threshold</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {config.label}
          </span>
        </div>
        <span className="text-xl transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          <ThresholdControls
            challengeType={challengeType}
            values={thresholds}
            onChange={updateThresholds}
            compact={false}
          />

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
            >
              Simpan & Terapkan
            </button>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium text-sm"
              title="Reset ke pengaturan default"
            >
              ↺ Reset
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
            <p className="font-semibold text-blue-900">💡 Tips Penyesuaian:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Naikkan threshold untuk membuat challenge lebih sulit</li>
              <li>Turunkan threshold untuk membuat challenge lebih mudah</li>
              <li>Simpan akan tersimpan otomatis di browser</li>
              <li>Reset untuk mengembalikan ke nilai default</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
