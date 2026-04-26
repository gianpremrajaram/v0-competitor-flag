# PLAN — Competitor Flag (Bolt AI Product task)

> Working plan synthesised from `TASK.md`, `initial v0 prompt.md`, `Groq system prompt.md`, `File structure v0 vercel build.md`, and a full read of the current code. Phases 1–2 ship; this doc is about Phase 3 (Claude Code content fill + small patches) and Phase 4 (polish + record).

---

## 1. Brief in one paragraph

Pick a real, specific problem from your own life and ship a small AI solution in ~4 hours, then narrate it in a ≤5-min video covering: problem, breakdown, what you built, how you used AI, and reflection. Bolt is grading **thinking, not polish** — a rough thing that works beats a beautiful mockup. Tooling is unrestricted (ChatGPT, Notion, Zapier, Make, scripts, prompts) so long as the use of AI is honest and visible.

The chosen problem: **first-pass triage of competitor / market signals** for Precept. Today every "Microsoft just launched X" link drops you into 30 minutes of "do I need to care?" thrash; the tool turns a pasted signal into a structured overlap verdict (score / threat type / evidence / action) in under a second.

## 2. Architecture (locked, do not relitigate)

| Layer | Choice | Why |
|---|---|---|
| Frontend + scaffold | v0 free, single Next.js 14 page | One-click Vercel deploy, GitHub sync, $5/mo credit covers it |
| Backend | One Next.js API route `/api/analyse` | Serverless, included in Vercel hobby |
| LLM | Groq Llama 3.3 70B via OpenAI SDK pointed at `api.groq.com/openai/v1` | Free, ~300 tok/s, JSON mode, no card |
| Company profile | Hard-coded TS object in `lib/precept-profile.ts` | Zero UI cost; v1 doesn't need a settings panel |
| Examples | 3 hard-coded signals + pre-cached LLM outputs in `lib/example-signals.ts` | Bulletproofs the demo if the live API blips during recording |
| History | React `useState` array, last 5 | Simplest possible — no DB |
| Secrets | `GROQ_API_KEY` as Vercel env var | Already configured by user |
| Refinement | Clone repo → Claude Code → push → Vercel auto-deploy | v0/GitHub sync is bidirectional |

**Output schema** (frozen):
```ts
{
  overlap_score: 0-100,
  threat_type: "feature_parity" | "positioning_collision" | "adjacent_noise" | "non_threat",
  confidence: "low" | "medium" | "high",
  why_it_matters: string,
  evidence_lines: string[2-4],
  recommended_action: "ignore" | "monitor" | "investigate" | "reposition"
}
```

## 3. Phase 1 review — what v0 actually shipped

Reviewed every file under `app/`, `lib/`, and `components/`. Headline: **the scaffold matches the spec faithfully, only the content is empty.** No big rewrites needed.

### What's correct
- `app/page.tsx` — 3-column grid, lifts state up, history-click rehydrates the result card. Clean.
- `app/api/analyse/route.ts` — Groq via OpenAI SDK at `api.groq.com/openai/v1`, model `llama-3.3-70b-versatile`, `response_format: { type: "json_object" }`, `temperature: 0.2`. Validates the JSON, falls back to a "could not analyse" card on every error path. Reads `GROQ_API_KEY` server-side only. Matches the spec exactly.
- `lib/types.ts` — schema matches `initial v0 prompt.md` byte-for-byte plus a `HistoryEntry` helper type.
- `lib/threat-taxonomy.ts` — enum + colour map + label map.
- `lib/validate-result.ts` — strict allow-list validation per field, clamps `overlap_score` to [0, 100], returns null on schema mismatch; exposes `fallbackResult(reason)` so the route never throws.
- All six React components compile and render the spec'd states (idle / loading / ready / error). Cached-example fast-path is wired (clicks an example with `cached_result` → bypasses API).
- Vercel sync verified (PR #1 merged).

### Gaps to close in Phase 3 (content)
1. `lib/precept-profile.ts` — every field empty. Needs Precept's positioning, claims, capabilities, keywords, non-competitors.
2. `lib/example-signals.ts` — three empty stubs with `cached_result: null`. Needs three filled signals + pre-computed cached results.
3. `lib/system-prompt.ts` — `SYSTEM_PROMPT = ""`. The route falls back to `"You are a competitor analysis assistant. Return JSON."` which works but is weak. Paste in the prompt from `Groq system prompt.md`.

### Patches (small, surgical)
1. **Orphan string at top of `components/analyse-signal.tsx:2`**: `"comment test vercel sync"` — leftover from sync verification. Delete the line.
2. **No truncation guard before Groq call**: `TASK.md` flags Groq's 6,000 TPM cap; a >3k-char paste can 429. Add a 3,000-char truncation in the route (server-side, transparent to client). Inline 2 lines, no helper file.
3. **Footer placeholder**: `app/page.tsx:72` reads `Built for [Bolt application]` — replace with the real footer text once confirmed.
4. **`next.config.mjs` has `typescript.ignoreBuildErrors: true`**: v0 ships this by default. I'll leave it on (turning it off can blow up the deploy if a v0-generated import is loose); flag for follow-up only.
5. **`package-lock.json` is untracked but `pnpm-lock.yaml` is committed**: pick one. The repo already uses pnpm — delete `package-lock.json` from the working tree before committing.

### Explicitly NOT changing
- The 8-prop `AnalyseSignal` (could be a context but isn't worth it for one screen).
- Skeleton component (shadcn `Skeleton` already pulses — no shimmer needed).
- The route's linear control flow (a class wrapper would be cleaner — see §5 — but only if it earns its keep).
- The validator's omission of `evidence_lines` length 2–4 (soft check is fine; the model usually obeys).

## 4. Code-quality principles applied

These come from the user-supplied principles (Think → Simplicity → Surgical → Goal-driven). They drive every choice below.

### 4.1 Think Before Coding
Surface uncertainty rather than guess. The clarifying questions in §9 are the operational form of this principle: I'd rather pause and ask than silently pick a positioning statement for Precept.

### 4.2 Simplicity First
Minimum code that solves the problem.
- Don't add a settings panel, DB, or auth.
- Don't refactor the v0-generated route just because it's linear.
- Don't add error handling for impossible scenarios — the validator + fallback already cover the LLM-misbehaves case.
- If a 50-line file does the job, don't write 200.

### 4.3 Surgical Changes
Touch only what the task requires.
- Phase 3 changes are 4 file edits (3 content fills + 1 line deletion + 1 truncation patch).
- Don't restyle the result card, don't rewrite the history rail, don't "improve" the validator.
- If I notice unrelated dead code, mention it — don't delete it.

### 4.4 Goal-Driven Execution
Every step has a verifiable check.
- "Fill profile" → verify: `pnpm dev`, page loads, sidebar shows real values, no "Not set" placeholders.
- "Fill examples" → verify: clicking each example renders the cached card instantly, no network call in devtools.
- "Fill system prompt" → verify: paste a fresh signal, route returns valid JSON, validator passes, card renders.
- "Truncation patch" → verify: paste a 6k-char string, no 429, route still returns a card.
- "Push" → verify: Vercel build green, `*.vercel.app` URL renders, all four states reachable in the live app.

## 5. OOP — where it earns its keep here, and where it doesn't

The codebase is React + a single API route — overwhelmingly functional, and that's right. Two places where a small class is worth considering:

**Recommended (small win): `SignalAnalyser` in `lib/signal-analyser.ts`.**
Wraps the Groq client, system prompt, and validation behind one method:
```ts
class SignalAnalyser {
  constructor(private apiKey: string, private systemPrompt: string) {}
  async analyse(profile: CompanyProfile, signal: Signal): Promise<AnalysisResult> { ... }
}
```
The route becomes ~15 lines instead of ~70 and the analysis pipeline is now testable in isolation. Net win. Total ~40 lines.

**Not worth it: classes for components, profile, history.**
React functional components are the idiom; wrapping them in classes is fighting the framework. The `CompanyProfile` shape is data, not behaviour — typing it as `type` is correct.

**Decision rule.** Only refactor to OOP where (a) it removes duplication or (b) it creates a clean unit-test boundary. The `SignalAnalyser` clears (b); nothing else in this codebase clears either bar.

## 6. Phase 3 plan — Claude Code content fill (≈45 min)

Order chosen so each step is independently verifiable. Stop after each step, run, eyeball.

| # | Step | File(s) | Verify |
|---|---|---|---|
| 1 | Delete orphan sync-test string | `components/analyse-signal.tsx:2` | `grep "vercel sync"` returns nothing |
| 2 | Paste Groq system prompt verbatim | `lib/system-prompt.ts` | Route no longer falls back to default prompt |
| 3 | Fill Precept profile | `lib/precept-profile.ts` | Sidebar shows real fields, no "Not set" |
| 4 | Add 3 example signals (raw text only first) | `lib/example-signals.ts` | Buttons appear with real labels; clicks populate textarea |
| 5 | Add `cached_result` to all 3 examples | same file | Clicking each example renders card instantly, no `/api/analyse` request in network tab |
| 6 | (Optional) Refactor to `SignalAnalyser` class | `lib/signal-analyser.ts` + `app/api/analyse/route.ts` | Existing tests still pass; route is ~15 lines |
| 7 | Add 3,000-char truncation in route | `app/api/analyse/route.ts` | Pasting a 6k-char body returns a card, no 429 |
| 8 | Replace footer placeholder | `app/page.tsx:72` | Footer reads correct text |
| 9 | Delete stray `package-lock.json` if pnpm is canonical | repo root | Only `pnpm-lock.yaml` remains tracked |
| 10 | Run dev server, smoke-test all 4 states | — | idle / loading / ready / error all reachable |
| 11 | Commit + push to `main` | git | Vercel build green; `*.vercel.app` reflects changes |

### How to fill the cached results (decision needed — see Q3)
Two viable approaches:
- **(A) Hand-write** the 3 cached objects so the demo is deterministic forever. Risk: outputs may diverge from what live Groq actually produces, undermining "this is real" if anyone notices.
- **(B) Run the live API once locally**, copy the 3 responses into `example-signals.ts`. The cached results are then provably real model outputs frozen in time. Slight risk that one comes back malformed and needs a manual nudge.

Default to (B) unless you say otherwise.

## 7. Phase 4 plan — polish + record (≈45 min)

| # | Step | Output |
|---|---|---|
| 1 | Replace v0 default favicons (optional) | `public/icon.svg`, `public/icon-{light,dark}-32x32.png` |
| 2 | Tidy `README.md` to actually describe the app + run instructions + AI workflow used | `README.md` |
| 3 | Confirm `.env.local.example` is enough for a fresh clone | unchanged unless missing keys |
| 4 | Draft 5-min video script (`docs/VIDEO_SCRIPT.md`) | 5 timed beats, see §8 |
| 5 | Record demo (off-tooling) — one cached example + one live paste-in (Microsoft AGT) | mp4 / link |
| 6 | Final commit | clean `main` |

## 8. Video script outline (5 min hard cap)

| Time | Beat | Notes |
|---|---|---|
| 0:00–0:45 | **Problem** | "Every week one of these comes in: 'Microsoft just shipped Agent Governance Toolkit, are we toast?' I lose 30 mins to a gut-check that should take 30 seconds." |
| 0:45–1:30 | **Breakdown** | What's hard: signal vs. positioning is *semantic*, not keyword. What AI helps with: structured first-pass verdict on overlap. What AI doesn't replace: the actual reposition decision. |
| 1:30–3:00 | **What I built** | Show Precept profile sidebar; click a cached example → instant verdict; paste the real Microsoft AGT April 2026 announcement → live Groq call → `positioning_collision / high / reposition`. Call out what's deliberately missing (no DB, no auth, no settings panel). |
| 3:00–4:00 | **AI usage** | Honest narration: v0 built the scaffold from one prompt; Claude Code filled the profile, examples, and system prompt; Groq Llama 3.3 70B is the runtime model. Mention the JSON-mode + validator + fallback so the demo can't crash on camera. |
| 4:00–5:00 | **Reflection** | What doesn't work: vague signals over-trigger `non_threat / low`; no per-tenant profile; no monitor-over-time. Next: profile editor + RSS poller. |

**Hook**: end with "this is the actual triage I did this week — the tool reproducing my own decision is the proof it's not a demo prop."

## 9. Clarifying questions (need answers before Phase 3 starts)

1. **Precept content** — paste or sketch the actual fields:
   - `company_name`
   - `positioning_statement` (one sentence)
   - `target_user`
   - `core_claims` (3–5 bullets — `TASK.md` hints at "the policy passes, the information fails")
   - `capabilities` (3–5 bullets)
   - `keywords_to_watch` (`TASK.md` lists "multi-agent, agent governance, information integrity, semantic fidelity" — confirm or add)
   - `explicit_non_competitors` (`TASK.md` mentions "Microsoft AGT in the governance sense" — confirm wording)
2. **Microsoft AGT signal text** — do you have the actual announcement text/URL handy for me to paste, or should I write a stand-in based on public April 2026 coverage?
3. **Cached examples — write by hand or capture from live Groq?** (See §6, A vs. B. I'll default to B if you don't say.)
4. **Local Groq key** — is `GROQ_API_KEY` available locally for me to test against, or only in Vercel? If only Vercel, I'll smoke-test against the deployed URL after pushing.
5. **Truncation policy** — silently truncate >3,000 chars (my default), or fail loudly with a "signal too long" card?
6. **OOP refactor** — do the `SignalAnalyser` class extraction (recommended, ~40 lines, route shrinks to ~15) or skip and keep the linear route?
7. **Lockfile** — `pnpm-lock.yaml` is committed, `package-lock.json` is untracked. Confirm pnpm is canonical and I can delete `package-lock.json`.
8. **Footer text** — what should `Built for [Bolt application]` actually say?
9. **README rewrite** — happy for me to overwrite the v0-default README with a real one (problem, run, AI workflow, schema), or leave it?
10. **Video script** — should I draft `docs/VIDEO_SCRIPT.md` after Phase 3 lands, or only after you've recorded?

## 10. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Llama 3.3 returns trailing prose despite JSON mode | medium | Validator + fallback already in place; if frequent, add `"Return ONLY a JSON object."` directive at end of system prompt |
| Live Groq call fails during recording | low–medium | Cached examples carry the demo; record one cached + one live so a failed live still shows the path |
| v0 credit burn from further iteration | low | All Phase 3+4 work is in Claude Code, not v0. No more v0 generations needed |
| `typescript.ignoreBuildErrors: true` masking a real error | low | Run `pnpm build` locally once before pushing to surface anything hidden |
| Groq 6k TPM 429 on long pastes | low after patch | 3,000-char truncation in route (Phase 3 step 7) |
| Stale fork — v0 portal and main diverge | low | v0 sync is bidirectional; do all edits in Claude Code, push, Vercel deploys, v0 reflects |
| Bolt graders can't run the demo | low | Vercel `*.vercel.app` URL is public; include in submission with the video |

---

**Status**: plan ready, awaiting answers to §9 before touching code.

---

## 11. Answers received — revised approach

| Q | Answer | Impact on plan |
|---|---|---|
| 1 | Use the Precept whitepaper deck (`precept_whitepaper_deck_website.pdf`). UI shows only a high-level slice for non-tech viewers; backend (system prompt) carries the full detail | Profile: short flat fields shown in sidebar; system prompt internalises tiered competitors + claims for fuzzy matching |
| 2 | Real AGT signal added at `docs/Microsoft AGT.md` (full Microsoft blog post, 11k chars, Apr 2 2026) | Use this verbatim for example #1 |
| 3 | Capture cached results from live Groq (option B), don't hand-write | Need running dev server + curl to capture once, then freeze |
| 4 | `GROQ_API_KEY` already in `.env.local` (nano). Test locally only, don't hit deployed URL | Smoke-test cycle = local `pnpm dev` + curl |
| 5 | **Don't refactor any v0 files**. Skip the `SignalAnalyser` class extraction. Don't add Bolt / product-builder framing in the UI; signal is "I built this for myself" | New code lives in new `/lib` files; existing v0 files only get content fills + the smallest possible additive changes (header/footer text, one truncation import in route.ts) |
| — | Truncation should be elegant pre-cleaning/chunking | New `lib/signal-preprocessor.ts` (functions, not class — single-shot transform doesn't earn OOP) does whitespace normalisation + truncate-at-sentence-boundary at 12,000 chars (~3,000 tokens, well under Groq 6k TPM) |
| — | Keywords must be **fuzzy + tiered**: strong / medium / low match, all return results, with reasonable upper bound | Tiers live inside the system prompt (so route stays untouched). ~6–8 entries per tier, ~20 total. Sidebar shows a flat union of ~12 for readability |
| 7 | (lockfile) — TBD; default: keep `pnpm-lock.yaml`, gitignore `package-lock.json` if it appears | Will check at commit time |
| 8 | Footer: workflow-relevant, NOT Bolt-specific | "Built with v0, Claude Code, and Groq Llama 3.3 70B" |
| — | Header gets a non-tech Precept blurb — recruiter testing the link should grok Precept without abbreviations. Use user's voice ("AIs working together", "to solve tasks") | Subtitle becomes: "A personal triage tool for Precept Labs — open-source software that improves the quality of how AIs work together to solve tasks." |
| 9 | (README) — proceed | Phase 3 step 11: full rewrite |
| 10 | (Video) — not a script, just key topics: architecture, what was built end-to-end, problem solved, two scaling iterations (input-agnostic → personalised to my workflow → general availability). HireVue talk-only, no demo, Vercel link shared separately | Phase 4 deliverable becomes `docs/VIDEO_TOPICS.md`, terse — replaces the timed script in §8 |

### What the source deck gives us (synthesised, not copied)

From `precept_whitepaper_deck_website.pdf`:
- **Tagline**: "The integrity layer for agentic AI." Sub: "Information integrity for multi-agent systems."
- **Wedge** (one line): "Governs what agents *need to know* — type signatures for handoffs, not guardrails on outputs."
- **Three components**: Contract Layer (declarative YAML), Dual-Track Scorer (sub-10ms embedding proxy + async MI estimator), Observatory (OSS local + hosted Cloud, regulator-ready audit export for EU AI Act / FCA / NIST AI RMF).
- **Audience**: Platform & ML engineers, Risk & compliance leads, Frontier labs & academia.
- **Key competitors mapped on the deck's competitor slide** — drives the keyword tiers below.

### Keyword tiers (system-prompt internal, ~20 total)

| Tier | Why it matches | Example terms |
|---|---|---|
| **Strong** | Direct positioning collision — anything claiming integrity / fidelity / contracts at agent boundaries | "information contract", "boundary fidelity", "multi-agent fidelity", "input contracts", "pre-handoff scoring", "type signatures for agent boundaries", "AGENTS.md integrity" |
| **Medium** | Adjacent — agent governance / observability / frameworks; could become competitive on roadmap | "agent governance toolkit", "agent observability", "agent identity / trust scoring", "runtime policy enforcement", "agent SDK guardrails", "multi-agent orchestration", "agent execution sandboxing" |
| **Low** | Related space but not threatening — generic LLMOps / evals / single-agent | "LLM evals", "prompt engineering tooling", "LLMOps observability (single-agent)", "AI compliance dashboard (non-agent)", "agent marketplace / plugin governance" |

The system prompt instructs the model to fuzzy-match each signal against all three tiers, weight the verdict accordingly, and cap evidence_lines at 4 — no info explosion.

### Cached examples (to be captured live, then frozen)

1. **Microsoft AGT** — full blog text → expected `positioning_collision` / `high` / `reposition`
2. **Langfuse-style agent observability launch** — adjacent → expected `adjacent_noise` / `medium` / `monitor`
3. **Unrelated AI workflow tool** (e.g., a Zapier-style "AI Step" announcement) — unrelated → expected `non_threat` / `low` / `ignore`
