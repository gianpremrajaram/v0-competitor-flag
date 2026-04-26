"use client"
"comment test vercel sync"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ResultCard } from "@/components/result-card"
import { ResultSkeleton } from "@/components/result-skeleton"
import { ErrorFallbackCard } from "@/components/error-fallback-card"
import { preceptProfile } from "@/lib/precept-profile"
import { exampleSignals } from "@/lib/example-signals"
import type { AnalysisResult, ExampleSignal, HistoryEntry, Signal } from "@/lib/types"

type Status = "idle" | "loading" | "ready" | "error"

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function exampleLabel(ex: ExampleSignal, index: number) {
  if (ex.title) return ex.title
  if (ex.raw_text) return ex.raw_text.slice(0, 40) + (ex.raw_text.length > 40 ? "…" : "")
  return `Example ${index + 1}`
}

export function AnalyseSignal({
  signalText,
  setSignalText,
  result,
  setResult,
  status,
  setStatus,
  errorMessage,
  setErrorMessage,
  pushHistory,
}: {
  signalText: string
  setSignalText: (s: string) => void
  result: AnalysisResult | null
  setResult: (r: AnalysisResult | null) => void
  status: Status
  setStatus: (s: Status) => void
  errorMessage: string
  setErrorMessage: (s: string) => void
  pushHistory: (entry: HistoryEntry) => void
}) {
  const [activeTitle, setActiveTitle] = useState<string>("")

  const handleExampleClick = (ex: ExampleSignal) => {
    setSignalText(ex.raw_text)
    setActiveTitle(ex.title)
    if (ex.cached_result) {
      setResult(ex.cached_result)
      setStatus("ready")
      setErrorMessage("")
      pushHistory({
        id: makeId(),
        signal: { title: ex.title, raw_text: ex.raw_text },
        result: ex.cached_result,
        timestamp: Date.now(),
      })
    }
  }

  const runAnalysis = async () => {
    if (!signalText.trim()) return
    setStatus("loading")
    setErrorMessage("")
    setResult(null)

    const signal: Signal = {
      title: activeTitle || signalText.slice(0, 60),
      raw_text: signalText,
    }

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profile: preceptProfile, signal }),
      })

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      const data = (await res.json()) as AnalysisResult
      setResult(data)
      setStatus("ready")
      pushHistory({
        id: makeId(),
        signal,
        result: data,
        timestamp: Date.now(),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error"
      setErrorMessage(message)
      setStatus("error")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyse a Signal</CardTitle>
          <p className="text-xs text-muted-foreground">
            Paste a market signal — an article, launch note, or product claim — to score overlap against the profile.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {exampleSignals.map((ex, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(ex)}
                className="text-xs"
              >
                {exampleLabel(ex, i)}
              </Button>
            ))}
          </div>

          <Textarea
            value={signalText}
            onChange={(e) => {
              setSignalText(e.target.value)
              setActiveTitle("")
            }}
            placeholder="Paste the signal here…"
            className="min-h-[200px] resize-y font-sans text-sm leading-relaxed"
          />

          <div className="flex justify-end">
            <Button onClick={runAnalysis} disabled={status === "loading" || !signalText.trim()}>
              {status === "loading" ? "Analysing…" : "Analyse"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        {status === "idle" && !result && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm font-medium text-foreground">No analysis yet</p>
              <p className="text-xs text-muted-foreground max-w-sm text-pretty">
                Paste a signal above or pick an example, then hit Analyse to see overlap, threat type, and a recommended action.
              </p>
            </CardContent>
          </Card>
        )}
        {status === "loading" && <ResultSkeleton />}
        {status === "error" && (
          <ErrorFallbackCard
            message={errorMessage || "We couldn't reach the analysis service. Please try again."}
            onRetry={runAnalysis}
          />
        )}
        {status === "ready" && result && <ResultCard result={result} />}
      </div>
    </div>
  )
}
