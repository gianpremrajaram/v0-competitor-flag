import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompanyProfile } from "@/lib/types"

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || <span className="text-muted-foreground italic">Not set</span>}</span>
    </div>
  )
}

function ProfileList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {items.length === 0 ? (
        <span className="text-sm text-muted-foreground italic">None listed</span>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CompanyProfilePanel({ profile }: { profile: CompanyProfile }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Company Profile</CardTitle>
        <p className="text-xs text-muted-foreground">Read-only baseline used for every analysis.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ProfileRow label="Company name" value={profile.company_name} />
        <ProfileRow label="Positioning" value={profile.positioning_statement} />
        <ProfileRow label="Target user" value={profile.target_user} />
        <ProfileList label="Core claims" items={profile.core_claims} />
        <ProfileList label="Capabilities" items={profile.capabilities} />
        <ProfileList label="Keywords to watch" items={profile.keywords_to_watch} />
        <ProfileList label="Explicit non-competitors" items={profile.explicit_non_competitors} />
      </CardContent>
    </Card>
  )
}
