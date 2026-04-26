import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThreatType, threatTypeColors, threatTypeLabels } from "@/lib/threat-taxonomy"
import type { AnalysisResult } from "@/lib/types"
import { cn } from "@/lib/utils"

const ACTION_LABELS: Record<AnalysisResult["recommended_action"], string> = {
  ignore: "Ignore",
  monitor: "Monitor",
  investigate: "Investigate",
  reposition: "Reposition",
}

const CONFIDENCE_STYLES: Record<AnalysisResult["confidence"], string> = {
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-foreground/10 text-foreground border-foreground/20",
  high: "bg-foreground text-background border-foreground",
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const threat = result.threat_type as ThreatType
  const threatLabel = threatTypeLabels[threat] ?? result.threat_type
  const threatColor = threatTypeColors[threat] ?? "bg-neutral-500 text-white"

  return (
    <Card>
      <CardHeader className="gap-4">
        {/* 1. Overlap score */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Overlap score
            </span>
            <span className="text-5xl font-semibold tabular-nums text-foreground">
              {result.overlap_score}
              <span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
            </span>
          </div>
          <Progress value={result.overlap_score} className="h-2" />
        </div>

        {/* 2 & 3. Threat badge and confidence pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              threatColor,
            )}
          >
            {threatLabel}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
              CONFIDENCE_STYLES[result.confidence],
            )}
          >
            {result.confidence} confidence
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* 4. Why it matters */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why it matters
          </h3>
          <p className="text-sm leading-relaxed text-foreground text-pretty">{result.why_it_matters}</p>
        </section>

        {/* 5. Evidence */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evidence</h3>
          {result.evidence_lines.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No supporting lines extracted.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {result.evidence_lines.map((line, i) => (
                <li
                  key={i}
                  className="rounded-md border-l-2 border-border bg-muted/50 px-3 py-1.5 text-sm leading-relaxed text-foreground"
                >
                  &ldquo;{line}&rdquo;
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 6. Recommended action */}
        <section className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recommended action
          </span>
          <span className="text-sm font-semibold text-foreground">
            {ACTION_LABELS[result.recommended_action]}
          </span>
        </section>
      </CardContent>
    </Card>
  )
}
