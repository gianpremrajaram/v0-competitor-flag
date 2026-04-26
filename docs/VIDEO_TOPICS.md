# Video topics — Competitor Flag


## 1. The problem (≈45 sec)

- I'm building Precept Labs in a niche space — open-source software that improves quality when multiple AIs work together. Niche means competitor signals matter a lot.
- Every "Microsoft just launched X" link drops me into 30 minutes of "do I need to care, and what do I actually do about it" thrash.
- Niche also means a short keyword list under-fires (lots of relevant adjacent stuff missed) and a long keyword list over-fires (everything gets a hit). Neither extreme is useful.

## 2. Architecture (≈75 sec)

- Single Next.js page on the Vercel hobby plan. One serverless API route at `/api/analyse`.
- That route calls Groq's free Llama 3.3 70B endpoint over the OpenAI SDK, with JSON mode on, returning a fixed six-field schema.
- System prompt embeds tiered keyword guidance — strong / medium / low match — plus an "incumbent calibration" rule so an Apple/Microsoft/OpenAI launch in the agent space scores as a positioning event, not as adjacent noise.
- Strict server-side validator on every model response, with a fallback "could not analyse" card if the model misbehaves — so the UI never breaks on a model blip.
- A small signal-preprocessor cleans and truncates at sentence boundaries before the Groq call, keeping us under the free-tier rate limits without losing useful context.
- Profile, examples, and history are all hard-coded or in-memory. No database, no auth.
- Groq API key only ever lives server-side as a Vercel env var.

## 3. What was built end-to-end (≈75 sec)

- Left rail: hard-coded Precept profile — positioning, target users, claims, capabilities, watch-keywords, explicit non-competitors. Plain language so a non-technical recruiter testing the link understands what Precept does.
- Main panel: paste a signal → score 0–100, threat type (feature_parity / positioning_collision / adjacent_noise / non_threat), confidence, one-paragraph "why it matters", quoted evidence lines, recommended action (ignore / monitor / investigate / reposition).
- Right rail: last five analyses, click any one to rehydrate the result card.
- Three pre-cached examples across the spectrum — Microsoft Agent Governance Toolkit (positioning_collision / high / reposition), a Langfuse-style agent observability launch (adjacent_noise / medium / monitor), an unrelated Zapier "AI Steps" launch (non_threat / low / ignore). Cached so the demo never depends on a live API call going through.
- Total build was about four hours: v0 scaffold from one prompt, Claude Code for content fill, Groq for runtime, Vercel for deploy via GitHub sync.

## 4. Two future iterations (≈45 sec, keep short)

- **Today, Iteration A — input-agnostic.** Paste anything, get a verdict. The current state.
- **Iteration B — personalised to my workflow.** Auto-ingest from RSS feeds and Slack, schedule daily triage, persist history across sessions, and calibrate the verdict against my past calls (was I right? did I actually reposition? did the signal age well?). Stops being a tool I open and starts being a tool that opens itself.
- **Iteration C — general availability.** Profile editor in the UI, multi-tenant, anyone can swap in their own positioning. Same bones, ten different companies running it. The architecture already separates profile from prompt cleanly enough to make this a small lift.

## 5. Reflection (≈30 sec)

- What doesn't work yet: long-form reports want chunking, not just truncation. Vague signals get the right verdict but unhelpful evidence quotes. No feedback loop yet — I can't tell the tool "you got this wrong" and have it learn.
- What I'd do next: a one-click "this verdict was wrong because…" mini-form that updates the cached examples; that's a half-day of work and turns the tool into a calibration loop, not just a one-shot scorer.
- Honest tradeoff: I picked Groq over a paid model because the free tier means I can keep the link open for as long as I need. A paid model would catch a few more nuanced signals; that's a Phase B problem.
