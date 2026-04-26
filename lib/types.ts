export type CompanyProfile = {
  company_name: string
  positioning_statement: string
  target_user: string
  core_claims: string[]
  capabilities: string[]
  keywords_to_watch: string[]
  explicit_non_competitors: string[]
}

export type Signal = {
  title: string
  raw_text: string
  source_url?: string
}

export type AnalysisResult = {
  overlap_score: number
  threat_type: "feature_parity" | "positioning_collision" | "adjacent_noise" | "non_threat"
  confidence: "low" | "medium" | "high"
  why_it_matters: string
  evidence_lines: string[]
  recommended_action: "ignore" | "monitor" | "investigate" | "reposition"
}

export type ExampleSignal = Signal & { cached_result: AnalysisResult | null }

export type HistoryEntry = {
  id: string
  signal: Signal
  result: AnalysisResult
  timestamp: number
}
