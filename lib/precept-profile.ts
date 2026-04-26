// Profile shown in the sidebar AND sent to the API in the user payload.
// Wording is deliberately plain so a non-technical viewer testing the link
// can grok what Precept does. The technical depth (tiered keyword fuzzy
// matching, mechanism-level distinctions, etc.) lives in the system prompt.
import type { CompanyProfile } from "./types"

export const preceptProfile: CompanyProfile = {
  company_name: "Precept Labs",
  positioning_statement:
    "Open-source software that improves the quality of how AIs work together to solve tasks — we make sure information passes cleanly between them.",
  target_user:
    "AI developers, AI compliance and risk leads, and frontier research labs.",
  core_claims: [
    "AI workflows fail at the seams between AIs, not inside any single AI.",
    "We catch problems before they spread, instead of debugging the trail after.",
    "Information passing between AIs stays measurable end-to-end.",
    "Audit-ready outputs aligned with the European Union AI Act and the NIST AI Risk Management Framework.",
  ],
  capabilities: [
    "Information contracts that attach to each handoff between AIs",
    "Real-time fidelity check at every handoff (under ten milliseconds)",
    "Calibrated quality scoring for audit and research use",
    "Direct integrations with major AI development frameworks",
    "Local-first scoring — raw information never leaves the pipeline",
  ],
  keywords_to_watch: [
    "information contract",
    "boundary fidelity",
    "multi-agent integrity",
    "input contracts",
    "agent governance toolkit",
    "agent observability",
    "agent middleware",
    "Model Context Protocol",
    "AGENTS.md",
    "language model evaluations",
    "prompt tooling",
    "agent marketplace",
  ],
  explicit_non_competitors: [
    "Microsoft Agent Governance Toolkit — governs what agents may do",
    "Anthropic Model Context Protocol — transport layer between AIs",
    "OpenAI Agents Software Development Kit — output-side safety",
    "LangSmith and Langfuse — output tracing and evaluations",
    "Google Agent Development Kit — agent runtime, not integrity",
    "SagaLLM — state rollback, not pre-handoff scoring",
  ],
}
