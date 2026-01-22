/**
 * Default threshold configuration untuk face detection challenges
 */

export type ThresholdConfig = {
  senyum: {
    threshold: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  senyum_netral: {
    threshold: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  lihat_kanan: {
    thresholdDeg: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  lihat_kiri: {
    thresholdDeg: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  lihat_atas: {
    thresholdDeg: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  lihat_bawah: {
    thresholdDeg: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  buka_mulut: {
    thresholdMouth: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  kedip: {
    threshold: number;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  anggukan_kepala: {
    thresholdDeg: number;
    requiredRepeats: number;
    label: string;
    degMin: number;
    degMax: number;
    degStep: number;
    repeatsMin: number;
    repeatsMax: number;
    repeatsStep: number;
  };
  geleng_kepala: {
    thresholdDeg: number;
    requiredRepeats: number;
    label: string;
    degMin: number;
    degMax: number;
    degStep: number;
    repeatsMin: number;
    repeatsMax: number;
    repeatsStep: number;
  };
  senyum_geleng: {
    threshold: number;
    requiredRepeats: number;
    neutralThreshold: number;
    label: string;
    thresholdMin: number;
    thresholdMax: number;
    thresholdStep: number;
    repeatsMin: number;
    repeatsMax: number;
    repeatsStep: number;
  };
};

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  senyum: {
    threshold: 0.7,
    label: "Senyum",
    min: 0.3,
    max: 1,
    step: 0.05,
  },
  senyum_netral: {
    threshold: 0.7,
    label: "Senyum Netral",
    min: 0.3,
    max: 1,
    step: 0.05,
  },
  lihat_kanan: {
    thresholdDeg: 35,
    label: "Lihat Kanan",
    min: 10,
    max: 60,
    step: 5,
  },
  lihat_kiri: {
    thresholdDeg: 35,
    label: "Lihat Kiri",
    min: 10,
    max: 60,
    step: 5,
  },
  lihat_atas: {
    thresholdDeg: 25,
    label: "Lihat Atas",
    min: 5,
    max: 50,
    step: 5,
  },
  lihat_bawah: {
    thresholdDeg: 25,
    label: "Lihat Bawah",
    min: 5,
    max: 50,
    step: 5,
  },
  buka_mulut: {
    thresholdMouth: 0.5,
    label: "Buka Mulut",
    min: 0.2,
    max: 1,
    step: 0.05,
  },
  kedip: {
    threshold: 0.18,
    label: "Kedip",
    min: 0.1,
    max: 0.3,
    step: 0.01,
  },
  anggukan_kepala: {
    thresholdDeg: 20,
    requiredRepeats: 2,
    label: "Anggukan Kepala",
    degMin: 5,
    degMax: 50,
    degStep: 5,
    repeatsMin: 1,
    repeatsMax: 5,
    repeatsStep: 1,
  },
  geleng_kepala: {
    thresholdDeg: 35,
    requiredRepeats: 2,
    label: "Geleng Kepala",
    degMin: 10,
    degMax: 60,
    degStep: 5,
    repeatsMin: 1,
    repeatsMax: 5,
    repeatsStep: 1,
  },
  senyum_geleng: {
    threshold: 0.6,
    requiredRepeats: 2,
    neutralThreshold: 0.2,
    label: "Senyum & Geleng",
    thresholdMin: 0.3,
    thresholdMax: 1,
    thresholdStep: 0.05,
    repeatsMin: 1,
    repeatsMax: 5,
    repeatsStep: 1,
  },
};

export const getDefaultThreshold = (challengeType: string): any => {
  return DEFAULT_THRESHOLDS[challengeType as keyof ThresholdConfig];
};
