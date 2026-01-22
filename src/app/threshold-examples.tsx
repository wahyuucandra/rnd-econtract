"use client";
/**
 * CONTOH PENGGUNAAN CUSTOM THRESHOLD
 * 
 * File ini menunjukkan berbagai cara menggunakan threshold manager
 * di component/page yang berbeda-beda
 */

import React, { useState } from "react";
import { ChallengeType } from "@/interface/challenge";
import { useThresholdManager, useGlobalThresholds } from "@/hooks/useThresholdManager";
import { ThresholdControls } from "@/components/molecules/ThresholdControls";
import { DEFAULT_THRESHOLDS } from "@/config/thresholds";

// ============================================================================
// EXAMPLE 1: Menggunakan useThresholdManager untuk single challenge
// ============================================================================
export function Example1_SingleChallenge() {
  const challengeType: ChallengeType = "senyum";
  const { thresholds, updateThresholds, resetToDefault } = useThresholdManager(challengeType);

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-bold">Example 1: Single Challenge Threshold</h3>
      
      <ThresholdControls
        challengeType={challengeType}
        values={thresholds}
        onChange={updateThresholds}
        compact={true}
      />
      
      <div className="text-sm text-gray-700">
        <p>Current threshold: <code>{JSON.stringify(thresholds)}</code></p>
      </div>
      
      <button
        onClick={resetToDefault}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
      >
        Reset
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Menggunakan useGlobalThresholds untuk semua challenge
// ============================================================================
export function Example2_GlobalThresholds() {
  const { allThresholds, updateChallengeThreshold, getChallengeThreshold, resetAll } =
    useGlobalThresholds();

  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType>("senyum");
  const currentThreshold = getChallengeThreshold(selectedChallenge);

  const handleUpdate = (values: any) => {
    updateChallengeThreshold(selectedChallenge, values);
  };

  return (
    <div className="space-y-4 p-4 bg-green-50 rounded-lg">
      <h3 className="font-bold">Example 2: Global Thresholds</h3>
      
      <select
        value={selectedChallenge}
        onChange={(e) => setSelectedChallenge(e.target.value as ChallengeType)}
        className="px-3 py-2 border rounded"
      >
        <option value="senyum">Senyum</option>
        <option value="lihat_kanan">Lihat Kanan</option>
        <option value="lihat_kiri">Lihat Kiri</option>
        <option value="buka_mulut">Buka Mulut</option>
        <option value="kedip">Kedip</option>
      </select>

      <ThresholdControls
        challengeType={selectedChallenge}
        values={currentThreshold}
        onChange={handleUpdate}
        compact={true}
      />

      <div className="text-sm text-gray-700">
        <p>Semua threshold tersimpan: </p>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(allThresholds, null, 2)}
        </pre>
      </div>

      <button
        onClick={resetAll}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
      >
        Reset Semua
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Manual threshold control tanpa hook
// ============================================================================
export function Example3_ManualControl() {
  const [thresholds, setThresholds] = useState({
    threshold: DEFAULT_THRESHOLDS.senyum.threshold,
    thresholdDeg: DEFAULT_THRESHOLDS.lihat_kanan.thresholdDeg,
    thresholdMouth: DEFAULT_THRESHOLDS.buka_mulut.thresholdMouth,
  });

  const handleSmileChange = (value: number) => {
    setThresholds({ ...thresholds, threshold: value });
  };

  const handleDegreeChange = (value: number) => {
    setThresholds({ ...thresholds, thresholdDeg: value });
  };

  const handleMouthChange = (value: number) => {
    setThresholds({ ...thresholds, thresholdMouth: value });
  };

  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
      <h3 className="font-bold">Example 3: Manual Control</h3>
      
      <div className="space-y-2">
        <label className="text-sm">Smile Threshold: {thresholds.threshold.toFixed(2)}</label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={thresholds.threshold}
          onChange={(e) => handleSmileChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Degree: {thresholds.thresholdDeg.toFixed(0)}°</label>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={thresholds.thresholdDeg}
          onChange={(e) => handleDegreeChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Mouth: {thresholds.thresholdMouth.toFixed(2)}</label>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={thresholds.thresholdMouth}
          onChange={(e) => handleMouthChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <pre className="text-xs bg-white p-2 rounded">
        {JSON.stringify(thresholds, null, 2)}
      </pre>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Preset thresholds untuk berbagai difficulty level
// ============================================================================
export function Example4_PresetDifficulty() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [thresholds, setThresholds] = useState({
    threshold: 0.7,
    thresholdDeg: 35,
    thresholdMouth: 0.5,
  });

  const presets = {
    easy: {
      threshold: 0.4,
      thresholdDeg: 20,
      thresholdMouth: 0.3,
    },
    medium: {
      threshold: 0.7,
      thresholdDeg: 35,
      thresholdMouth: 0.5,
    },
    hard: {
      threshold: 0.9,
      thresholdDeg: 50,
      thresholdMouth: 0.8,
    },
  };

  const handlePresetSelect = (level: "easy" | "medium" | "hard") => {
    setDifficulty(level);
    setThresholds(presets[level]);
  };

  return (
    <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
      <h3 className="font-bold">Example 4: Preset Difficulty</h3>
      
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as const).map((level) => (
          <button
            key={level}
            onClick={() => handlePresetSelect(level)}
            className={`px-4 py-2 rounded ${
              difficulty === level
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded space-y-2">
        <p className="text-sm"><strong>Difficulty:</strong> {difficulty.toUpperCase()}</p>
        <p className="text-sm"><strong>Smile:</strong> {thresholds.threshold.toFixed(2)}</p>
        <p className="text-sm"><strong>Degree:</strong> {thresholds.thresholdDeg.toFixed(0)}°</p>
        <p className="text-sm"><strong>Mouth:</strong> {thresholds.thresholdMouth.toFixed(2)}</p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Comparing default vs custom threshold
// ============================================================================
export function Example5_CompareThresholds() {
  const challengeType: ChallengeType = "lihat_kanan";
  const { thresholds: customThresholds } = useThresholdManager(challengeType);
  const defaultThresholds = DEFAULT_THRESHOLDS[challengeType];

  return (
    <div className="space-y-4 p-4 bg-red-50 rounded-lg">
      <h3 className="font-bold">Example 5: Compare Default vs Custom</h3>
      
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Property</th>
            <th className="border p-2 text-left">Default</th>
            <th className="border p-2 text-left">Custom</th>
            <th className="border p-2 text-left">Difference</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(customThresholds).map(([key, value]) => {
            const defaultValue = (defaultThresholds as any)[key];
            const diff = (value as number) - (defaultValue as number);
            return (
              <tr key={key}>
                <td className="border p-2">{key}</td>
                <td className="border p-2">{defaultValue}</td>
                <td className="border p-2">{value}</td>
                <td className={`border p-2 ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""}`}>
                  {diff > 0 ? "+" : ""}{diff}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// MAIN DEMO PAGE
// ============================================================================
export default function ThresholdExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Threshold Management Examples</h1>
          <p className="text-gray-600">5 contoh cara menggunakan custom threshold</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Example1_SingleChallenge />
          <Example2_GlobalThresholds />
          <Example3_ManualControl />
          <Example4_PresetDifficulty />
          <Example5_CompareThresholds />
        </div>
      </div>
    </div>
  );
}
