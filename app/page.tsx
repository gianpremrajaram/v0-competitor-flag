"use client"

import { useState } from "react"
import { CompanyProfilePanel } from "@/components/company-profile-panel"
import { AnalyseSignal } from "@/components/analyse-signal"
import { RecentRail } from "@/components/recent-rail"
import { preceptProfile } from "@/lib/precept-profile"
import type { AnalysisResult, HistoryEntry } from "@/lib/types"

type Status = "idle" | "loading" | "ready" | "error"

export default function Page() {
  const [signalText, setSignalText] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const pushHistory = (entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 5))
  }

  const handleSelectHistory = (entry: HistoryEntry) => {
    setSignalText(entry.signal.raw_text)
    setResult(entry.result)
    setStatus("ready")
    setErrorMessage("")
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Competitor Flag</h1>
            <p className="text-xs text-muted-foreground">A personal triage tool for new market signals.</p>
            <p className="text-xs text-muted-foreground">Precept Labs makes open-source software that improves quality when multiple AIs work together to solve tasks.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <CompanyProfilePanel profile={preceptProfile} />
          </aside>

          <section className="lg:col-span-6">
            <AnalyseSignal
              signalText={signalText}
              setSignalText={setSignalText}
              result={result}
              setResult={setResult}
              status={status}
              setStatus={setStatus}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              pushHistory={pushHistory}
            />
          </section>

          <aside className="lg:col-span-3">
            <RecentRail entries={history} onSelect={handleSelectHistory} />
          </aside>
        </div>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          Built with v0, Claude Code, and Groq Llama 3.3 70B.
        </div>
      </footer>
    </div>
  )
}
