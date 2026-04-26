import type { AnalysisResult } from "./types"

const THREAT_TYPES = ["feature_parity", "positioning_collision", "adjacent_noise", "non_threat"] as const
const CONFIDENCES = ["low", "medium", "high"] as const
const ACTIONS = ["ignore", "monitor", "investigate", "reposition"] as const

export function validateAnalysisResult(input: unknown): AnalysisResult | null {
  if (!input || typeof input !== "object") return null
  const r = input as Record<string, unknown>

  const overlap_score = typeof r.overlap_score === "number" ? r.overlap_score : Number(r.overlap_score)
  if (!Number.isFinite(overlap_score)) return null

  const threat_type = r.threat_type as AnalysisResult["threat_type"]
  if (!THREAT_TYPES.includes(threat_type)) return null

  const confidence = r.confidence as AnalysisResult["confidence"]
  if (!CONFIDENCES.includes(confidence)) return null

  const why_it_matters = typeof r.why_it_matters === "string" ? r.why_it_matters : ""
  if (!why_it_matters) return null

  const evidence_lines = Array.isArray(r.evidence_lines)
    ? r.evidence_lines.filter((x): x is string => typeof x === "string")
    : []

  const recommended_action = r.recommended_action as AnalysisResult["recommended_action"]
  if (!ACTIONS.includes(recommended_action)) return null

  return {
    overlap_score: Math.max(0, Math.min(100, Math.round(overlap_score))),
    threat_type,
    confidence,
    why_it_matters,
    evidence_lines,
    recommended_action,
  }
}

export function fallbackResult(reason: string): AnalysisResult {
  return {
    overlap_score: 0,
    threat_type: "non_threat",
    confidence: "low",
    why_it_matters: `The analysis could not complete: ${reason}. Treat this as an inconclusive read rather than a confirmed non-threat.`,
    evidence_lines: [],
    recommended_action: "monitor",
  }
}
