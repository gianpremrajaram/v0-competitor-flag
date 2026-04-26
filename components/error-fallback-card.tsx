import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ErrorFallbackCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-border bg-muted/40">
      <CardHeader>
        <CardTitle className="text-base text-foreground">Analysis unavailable</CardTitle>
        <p className="text-sm text-muted-foreground text-pretty">{message}</p>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}
