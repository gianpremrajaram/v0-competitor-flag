export enum ThreatType {
  FEATURE_PARITY = "feature_parity",
  POSITIONING_COLLISION = "positioning_collision",
  ADJACENT_NOISE = "adjacent_noise",
  NON_THREAT = "non_threat",
}

export const threatTypeColors: Record<ThreatType, string> = {
  [ThreatType.FEATURE_PARITY]: "bg-red-600 text-white",
  [ThreatType.POSITIONING_COLLISION]: "bg-orange-500 text-white",
  [ThreatType.ADJACENT_NOISE]: "bg-yellow-500 text-white",
  [ThreatType.NON_THREAT]: "bg-neutral-500 text-white",
}

export const threatTypeLabels: Record<ThreatType, string> = {
  [ThreatType.FEATURE_PARITY]: "Feature parity",
  [ThreatType.POSITIONING_COLLISION]: "Positioning collision",
  [ThreatType.ADJACENT_NOISE]: "Adjacent noise",
  [ThreatType.NON_THREAT]: "Non-threat",
}
