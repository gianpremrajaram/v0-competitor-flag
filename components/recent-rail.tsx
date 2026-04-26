"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreatType, threatTypeColors, threatTypeLabels } from "@/lib/threat-taxonomy"
import type { HistoryEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

function truncate(text: string, max: number) {
  if (!text) return "Untitled signal"
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export function RecentRail({
  entries,
  onSelect,
}: {
  entries: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent</CardTitle>
        <p className="text-xs text-muted-foreground">Last 5 analyses this session.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No analyses yet.</p>
        ) : (
          entries.map((entry) => {
            const threat = entry.result.threat_type as ThreatType
            const label = threatTypeLabels[threat] ?? entry.result.threat_type
            const color = threatTypeColors[threat] ?? "bg-neutral-500 text-white"
            const title = entry.signal.title || entry.signal.raw_text
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelect(entry)}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm font-medium text-foreground line-clamp-2 text-pretty">
                  {truncate(title, 80)}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      color,
                    )}
                  >
                    {label}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {entry.result.overlap_score}
                    <span className="text-muted-foreground"> / 100</span>
                  </span>
                </div>
              </button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
