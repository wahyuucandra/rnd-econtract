"use client";
import { useState, useCallback, useEffect } from "react";
import { ChallengeType } from "@/interface/challenge";
import { DEFAULT_THRESHOLDS } from "@/config/thresholds";

export type ThresholdState = {
  threshold?: number;
  thresholdDeg?: number;
  thresholdMouth?: number;
  requiredRepeats?: number;
  neutralThreshold?: number;
};

export function useThresholdManager(challengeType: ChallengeType) {
  const config = DEFAULT_THRESHOLDS[challengeType];
  
  const [thresholds, setThresholds] = useState<ThresholdState>(() => {
    // Check if window exists (client-side only)
    if (typeof window === "undefined") {
      if (!config) return {};
      return {
        threshold: (config as any).threshold,
        thresholdDeg: (config as any).thresholdDeg,
        thresholdMouth: (config as any).thresholdMouth,
        requiredRepeats: (config as any).requiredRepeats,
        neutralThreshold: (config as any).neutralThreshold,
      };
    }

    // Try to load from localStorage first
    const saved = localStorage.getItem(`threshold_${challengeType}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to defaults if parse fails
      }
    }
    
    // Return default thresholds for this challenge type
    if (!config) return {};
    return {
      threshold: (config as any).threshold,
      thresholdDeg: (config as any).thresholdDeg,
      thresholdMouth: (config as any).thresholdMouth,
      requiredRepeats: (config as any).requiredRepeats,
      neutralThreshold: (config as any).neutralThreshold,
    };
  });

  // Save to localStorage whenever thresholds change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`threshold_${challengeType}`, JSON.stringify(thresholds));
    }
  }, [thresholds, challengeType]);

  const updateThresholds = useCallback((newThresholds: Partial<ThresholdState>) => {
    setThresholds((prev) => ({ ...prev, ...newThresholds }));
  }, []);

  const resetToDefault = useCallback(() => {
    if (!config) return;
    const defaults = {
      threshold: (config as any).threshold,
      thresholdDeg: (config as any).thresholdDeg,
      thresholdMouth: (config as any).thresholdMouth,
      requiredRepeats: (config as any).requiredRepeats,
      neutralThreshold: (config as any).neutralThreshold,
    };
    setThresholds(defaults);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`threshold_${challengeType}`);
    }
  }, [config, challengeType]);

  return {
    thresholds,
    updateThresholds,
    resetToDefault,
    config,
  };
}

/**
 * Hook untuk manage threshold secara global untuk semua challenge types
 */
export function useGlobalThresholds() {
  const [allThresholds, setAllThresholds] = useState<Record<ChallengeType, ThresholdState>>(() => {
    if (typeof window === "undefined") {
      return {} as Record<ChallengeType, ThresholdState>;
    }

    const saved = localStorage.getItem("global_thresholds");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Return empty if parse fails
      }
    }
    return {} as Record<ChallengeType, ThresholdState>;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("global_thresholds", JSON.stringify(allThresholds));
    }
  }, [allThresholds]);

  const updateChallengeThreshold = useCallback(
    (challengeType: ChallengeType, values: ThresholdState) => {
      setAllThresholds((prev) => ({
        ...prev,
        [challengeType]: values,
      }));
    },
    []
  );

  const getChallengeThreshold = useCallback(
    (challengeType: ChallengeType): ThresholdState => {
      return allThresholds[challengeType] || {};
    },
    [allThresholds]
  );

  const resetAll = useCallback(() => {
    setAllThresholds({} as Record<ChallengeType, ThresholdState>);
    if (typeof window !== "undefined") {
      localStorage.removeItem("global_thresholds");
    }
  }, []);

  return {
    allThresholds,
    updateChallengeThreshold,
    getChallengeThreshold,
    resetAll,
  };
}
