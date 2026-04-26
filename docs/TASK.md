TASK



BLUF: v0 free plan supports your full GitHub + Claude Code workflow but the binding constraint is v0's $5/month generation credit, not the workflow itself. GPT's architecture is broadly correct but skips the one thing that matters for "no API credits": where the runtime LLM call comes from. Use Groq's free tier with Llama 3.3 70B for the analysis pipeline; it is free, fast, OpenAI-compatible, and supports JSON mode out of the box. Below is the consolidated build plan.
v0 free plan + your workflow
Confirmed working on free: 1) v0's free plan includes $5 in monthly credits, access to the v0-1.5-md AI model, GitHub sync, and Vercel deployment NoCode MBA; 2) The February 2026 update added Git integration, a VS Code-style editor, database connectivity, and agentic workflows Nxcode so v0 now generates full-stack Next.js, not just components; 3) v0 can now import GitHub repositories, pull Vercel environment variables, and build complete applications inside a sandboxed environment Nxcode - which means your env vars (Groq key) flow through; 4) Vercel hobby plan covers deployment, with a 10 active project cap.
Constraints to plan around: 1) Each generation costs a variable number of tokens depending on complexity. The free tier includes $5/month in credits, but complex full-stack generations can consume credits faster than simple component requests Taskade - so prompt v0 in tight focused passes, not "build me the whole app"; 2) v0 free is locked to the v0-1.5-md model, lower quality than Pro's lg, so expect to clean up output in Claude Code; 3) v0 credits pay for building the app, not for the runtime LLM calls your app makes - that needs its own provider.
LLM choice for runtime (GPT skipped this entirely)
Signals: RPM = requests per minute; RPD = requests per day; TPM = tokens per minute; OAI = OpenAI; HF = Hugging Face. For a demo tool with structured JSON output, low volume, and zero spend, the field narrows to three viable candidates:
ProviderFree limitsJSON modeLatencyVerdict for youGroq (Llama 3.3 70B)30 requests per minute (RPM), 6,000 tokens per minute (TPM), and 1,000 requests per day (RPD) TokenMix, no cardYes, OAI-compatible300+ tokens per second Awesome AgentsRecommended. Speed makes the demo feel solid; OAI SDK works as-isGoogle Gemini 2.5 Flash1,500 req/day, 15 RPM, 1M context, no cardYes, native~1-2sBackup. More volume, slower, separate SDKHugging Face Inferenceroughly 1,000 requests per day on popular models Mrcomputerscience, cold start latency on serverless endpoints can exceed 30 seconds MrcomputerscienceInconsistentCold-start riskAvoid for demo. A 30s wait on first call kills the video
Pick Groq as primary; the LPU latency means your "Analyse" button responds in under a second, which is genuinely the difference between a demo that feels like a product and one that feels like a script. API: Fully OpenAI-compatible; just change base_url APIScout - so v0 generating standard OpenAI client code works without modification.
Critique of GPT's architecture
What GPT got right: pipeline-shaped not chat-shaped, fixed output schema (overlap_score / threat_type / evidence / action / confidence), threat taxonomy (feature_parity / positioning_collision / adjacent_noise / non_threat), Precept-first scope, hybrid approach where LLM does semantic work and deterministic code maps to taxonomy. Keep all of that.
What GPT got wrong or missed: 1) Zero treatment of LLM provider/cost - the entire plan assumes a magic LLM exists; this is the actual technical blocker. 2) Settings panel for company profile - cut it for v1. Hard-code Precept in a TypeScript file; the "generalisable architecture" message is conveyed by clean schema, not a UI. Adding a form burns build time and v0 credits. 3) "Saved local JSON" for history - misleading on Vercel serverless. History should be React useState (in-memory only) or localStorage if you want it to persist a refresh. No backend storage in v1. 4) No mention of API key secrecy - the Groq key must be a Vercel env var (GROQ_API_KEY), called only from the API route, never exposed to the client. v0 handles this if you prompt it correctly. 5) No demo robustness plan - a live LLM call in a 5-minute video can fail; pre-cache the 3 example outputs as static JSON so the demo signals always work, and only call the API for net-new paste-in signals.
Recommended stack and architecture
LayerChoiceReasonFrontend + scaffoldv0 free, single Next.js pageOne-click Vercel deploy, GitHub sync, freeBackendOne Next.js API route /api/analyseServerless, included in Vercel hobbyLLMGroq Llama 3.3 70B via OpenAI SDK pointed at api.groq.com/openai/v1Free, fast, JSON mode, no cardCompany profileHard-coded TS object in /lib/precept-profile.tsZero UI cost, easy to edit in Claude CodeExample signals3 hard-coded signals + pre-cached LLM outputs in /lib/examples.tsBulletproof demoHistoryReact useState array, no persistenceSimplest possibleSecretsGROQ_API_KEY in Vercel env varsStandard, freeRefinementClone GitHub repo → Claude Code locally → push to mainv0 picks up changes via sync
The runtime contract: client posts { profile, signal } to /api/analyse; the route calls Groq with a JSON-schema-constrained system prompt requiring exactly the 6 output fields; route validates the JSON, falls back to a "could not analyse" card if parsing fails, returns to client; client renders the result card with colour-coded threat badge.
Build order (4-hour budget)

Hour 1 (v0): Prompt v0 for "single Next.js page, left sidebar shows hard-coded company profile, main panel has textarea + 3 example buttons + analyse button + result card with score/badge/evidence/action sections, plus right rail showing last 5 analysed signals from React state". Connect to GitHub, deploy to Vercel.
Hour 2 (v0 + manual): Prompt v0 for the /api/analyse route calling Groq with structured JSON system prompt; add GROQ_API_KEY to Vercel env vars; wire frontend to backend; test with one real signal.
Hour 3 (Claude Code locally): Clone repo, refine the system prompt for stable JSON output, add the 3 pre-cached example responses so demo buttons always work, tighten threat taxonomy mapping, fix any v0-generated code smells.
Hour 4 (polish + record): Tweak result card styling, write the 5-min video script, record demo using one cached example + one live paste-in (e.g. the actual Microsoft Agent Governance Toolkit announcement) showing a real positioning_collision verdict.

Video narrative hook
The strongest authenticity beat is using the actual Microsoft AGT April 2026 announcement as your live paste-in signal during the demo - the tool then outputs positioning_collision with evidence lines about "governance toolkit" overlap, and recommends "reposition to information integrity / boundary fidelity" as the action. That is the real decision you already made; the tool reproducing it on camera is the proof that this is from your week, not invented for Bolt.
Want me to draft the v0 prompt + the Groq system prompt + the TypeScript schema as the next pass?


Workflow confirmation
Signals: PR = pull request; env = environment variable. The flow is 1) paste v0 prompt into a fresh v0 chat, 2) iterate via follow-up messages in v0 if anything's off, 3) add GROQ_API_KEY env var in v0 project settings before testing the API route, 4) click Push to GitHub from v0's project menu (creates the repo for you), 5) git clone locally and open in Claude Code for content fill, 6) push to main, Vercel auto-redeploys. v0's GitHub sync is bidirectional so future Claude Code edits also reflect in v0's chat history.





What to do at the Claude Code step

Fill precept-profile.ts with the actual Precept content: positioning statement around information integrity and boundary fidelity, core claims (the policy passes, the information fails), keywords (multi-agent, agent governance, information integrity, semantic fidelity), explicit non-competitors (Microsoft AGT in the governance sense to clarify the differentiator).
Fill the 3 cached examples in example-signals.ts: a Microsoft AGT-style signal returning positioning_collision / high / reposition; a generic agent observability vendor returning adjacent_noise / medium / monitor; an unrelated AI workflow tool returning non_threat / low / ignore. These bulletproof the demo.
Paste the system prompt into system-prompt.ts.
Test once with a paste-in signal to confirm Groq returns valid JSON; if parsing fails frequently, add "Return ONLY a JSON object" as a stronger directive at the end of the prompt.
Push to main - Vercel auto-deploys; the live *.vercel.app URL becomes your demo link.

Pitfalls to flag now

v0 may strip JSON mode if it doesn't recognise the Groq baseURL pattern; if the route uses standard openai.chat.completions.create({ response_format: { type: "json_object" }}) it works on Groq. If v0 generates anything else, ask it to "use the OpenAI Node SDK with baseURL pointing at Groq, response_format json_object". 2) Llama 3.3 70B occasionally returns trailing commentary despite JSON mode; the validation + fallback card pattern in the prompt handles this gracefully. 3) Groq's 6,000 TPM cap means a very long pasted article could 429; truncate the signal to ~3,000 chars before sending. 4) v0 credit burn - keep the initial prompt as one shot rather than building component-by-component; complex iteration burns the $5 fast.