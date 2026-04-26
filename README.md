# Competitor Flag

https://v0-competitor-flag.vercel.app/

A personal triage tool for new market signals. Paste an article, launch note, or product claim and get a structured first-pass overlap analysis against a hard-coded company profile in under a second.

Built for Precept Labs — open-source software that improves quality when multiple AIs work together to solve tasks.

## What it does

Each signal gets six pieces of structured analysis:

- **Overlap score** (0–100)
- **Threat type** — `feature_parity`, `positioning_collision`, `adjacent_noise`, or `non_threat`
- **Confidence** — `low`, `medium`, `high`
- **Why it matters** — a one or two sentence rationale
- **Evidence** — two to four short quoted phrases from the signal that drove the verdict
- **Recommended action** — `ignore`, `monitor`, `investigate`, or `reposition`

Three example signals span the threat spectrum and are pre-cached so the demo always works:

| Example | Verdict |
|---|---|
| Microsoft Agent Governance Toolkit launches | 80 / positioning_collision / high / reposition |
| Langfuse 4.0 ships Agent Trace View | 40 / adjacent_noise / medium / monitor |
| Zapier launches AI Steps | 10 / non_threat / low / ignore |

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 App Router, TypeScript, Tailwind, shadcn/ui |
| Backend | One serverless API route (`/api/analyse`) |
| LLM | Groq Llama 3.3 70B via the OpenAI SDK pointed at `api.groq.com/openai/v1`, JSON mode |
| Hosting | Vercel hobby |
| State | React `useState`, last 5 in-session — no database |

The route validates the model's JSON against a strict schema and returns a fallback "could not analyse" card on every failure path, so the UI never crashes on an LLM blip.

## Run locally

```bash
npm install
echo "GROQ_API_KEY=your_key_here" > .env.local
npm run dev
```

Then open http://localhost:3000.

A free Groq API key works — the model hits `api.groq.com/openai/v1` and the free tier covers the demo (30 RPM, 6,000 TPM, 1,000 RPD).

## How AI was used to build this

| Stage | Tool | What it did |
|---|---|---|
| Scaffold | [v0](https://v0.app) | Generated the initial Next.js app, components, types, route, and validator from a single detailed prompt |
| Content fill | Claude Code | Filled the Precept profile, three cached examples (captured live from Groq once and frozen), the system prompt with tiered keyword guidance, and the signal preprocessor |
| Runtime model | Groq Llama 3.3 70B | Returns the structured JSON verdict on every paste-in |
| Deploy | Vercel | Auto-deploys from `main` via v0's GitHub sync |

Total build time: roughly four hours end-to-end.

## Layout

```
/app
  /api/analyse/route.ts        — Groq call, JSON validation, fallback
  page.tsx                     — single page UI
  layout.tsx
/lib
  precept-profile.ts           — hard-coded Precept profile
  example-signals.ts           — three signals + pre-cached results
  system-prompt.ts             — analyst prompt with tiered keyword guidance
  signal-preprocessor.ts       — whitespace clean + truncate at sentence boundary
  threat-taxonomy.ts           — enum + colour map
  validate-result.ts           — schema validation + fallback
  types.ts                     — shared types
/components
  company-profile-panel.tsx
  analyse-signal.tsx
  recent-rail.tsx
  result-card.tsx
  result-skeleton.tsx
  error-fallback-card.tsx
/docs                          — task brief, prompts, plan
```

## Schema

```ts
type AnalysisResult = {
  overlap_score: number              // 0-100
  threat_type:
    | "feature_parity"
    | "positioning_collision"
    | "adjacent_noise"
    | "non_threat"
  confidence: "low" | "medium" | "high"
  why_it_matters: string
  evidence_lines: string[]           // 2-4 quoted phrases
  recommended_action:
    | "ignore"
    | "monitor"
    | "investigate"
    | "reposition"
}
```
