/app
  /api/analyse/route.ts        ← Groq call, JSON validation, fallback
  page.tsx                      ← single page UI
  layout.tsx
/lib
  precept-profile.ts            ← TYPED SKELETON, empty fields, fill in Claude Code
  example-signals.ts            ← 3 signal stubs + cached output stubs
  system-prompt.ts              ← exported string, edit in Claude Code
  types.ts                      ← shared TS types
  threat-taxonomy.ts            ← enum + colour map
/components
  CompanyProfilePanel.tsx
  SignalInput.tsx
  ResultCard.tsx
  HistoryRail.tsx
.env.local.example              ← GROQ_API_KEY=