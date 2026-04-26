initial v0 prompt


Build a single-page Next.js 14 App Router app called "Competitor Flag" using
TypeScript, Tailwind, and shadcn/ui. This is a competitor signal analyser:
user pastes a market signal (article, launch note, product claim) and gets a
structured first-pass overlap analysis against a hard-coded company profile.

LAYOUT (single page, no routing):
- Left sidebar (25%): "Company Profile" panel showing fields from
  /lib/precept-profile.ts as read-only labelled rows.
- Main centre (50%): "Analyse a Signal" - a textarea (min height 200px),
  three example-signal buttons above it that populate the textarea on click,
  an "Analyse" primary button, and below it a result area that shows either
  empty state, loading skeleton, error fallback card, or the ResultCard.
- Right rail (25%): "Recent" - history of last 5 analyses from React useState,
  each a small card with truncated signal title, threat-type badge, and
  overlap score. Click to re-display in main result area.

RESULT CARD shows in this exact order:
1. Overlap score (0-100) as large number with progress bar
2. Threat-type badge with colour from /lib/threat-taxonomy.ts
3. Confidence (low/medium/high) as small pill
4. "Why it matters" - 1-2 sentence rationale
5. Evidence - bulleted list of 2-4 quoted lines from the signal
6. Recommended action - one of: ignore / monitor / investigate / reposition

API ROUTE /app/api/analyse/route.ts:
- POST handler accepting { profile, signal } in body
- Calls Groq via OpenAI SDK with baseURL "https://api.groq.com/openai/v1"
  and model "llama-3.3-70b-versatile"
- Uses response_format: { type: "json_object" }
- System prompt imported from /lib/system-prompt.ts
- Validates response matches AnalysisResult type from /lib/types.ts
- On parse failure or API error, returns a fallback AnalysisResult with
  threat_type "non_threat", confidence "low", and rationale explaining
  the analysis could not complete - DO NOT throw, always return a card
- Reads GROQ_API_KEY from process.env, never exposes it to client

SCAFFOLD FILES (create with skeleton content, will be filled in later):
- /lib/precept-profile.ts: export const preceptProfile: CompanyProfile with
  ALL string fields as empty strings "" and arrays as []. Type-correct but
  empty. Add a TODO comment at the top.
- /lib/example-signals.ts: export const exampleSignals: ExampleSignal[]
  with three entries - each has empty title, empty raw_text, and a null
  cached_result field. TODO comment at top.
- /lib/system-prompt.ts: export const SYSTEM_PROMPT = "" with TODO comment.
  The route must still call Groq even when system prompt is empty, so add
  a fallback "You are a competitor analysis assistant. Return JSON." inline
  in the route as a default if SYSTEM_PROMPT is empty.
- /lib/threat-taxonomy.ts: export enum ThreatType { FEATURE_PARITY,
  POSITIONING_COLLISION, ADJACENT_NOISE, NON_THREAT } and a Record mapping
  each to Tailwind colour classes (red/orange/yellow/grey).

CACHED EXAMPLE BEHAVIOUR:
When user clicks an example button, populate textarea AND if that example
has a non-null cached_result, display the cached result instantly without
calling the API. If cached_result is null, fall through to live API call.
This makes the demo bulletproof once cached results are filled in.

UX DETAILS:
- Loading state is a 3-line skeleton card with shimmer
- Error fallback card has muted styling, not red, with retry button
- Threat badges use solid background, white text, rounded
- Use Inter font, neutral palette, generous whitespace
- Mobile: stack vertically, history rail collapses to bottom

TYPES (in /lib/types.ts):
type CompanyProfile = {
  company_name: string;
  positioning_statement: string;
  target_user: string;
  core_claims: string[];
  capabilities: string[];
  keywords_to_watch: string[];
  explicit_non_competitors: string[];
};
type Signal = { title: string; raw_text: string; source_url?: string };
type AnalysisResult = {
  overlap_score: number;
  threat_type: "feature_parity" | "positioning_collision" | "adjacent_noise" | "non_threat";
  confidence: "low" | "medium" | "high";
  why_it_matters: string;
  evidence_lines: string[];
  recommended_action: "ignore" | "monitor" | "investigate" | "reposition";
};
type ExampleSignal = Signal & { cached_result: AnalysisResult | null };

Use shadcn/ui components: Card, Button, Textarea, Badge, Progress, Skeleton.
Add a footer with "Built for [Bolt application]". Add .env.local.example
with GROQ_API_KEY= placeholder. Do NOT add authentication, database, or
persistence beyond React state.