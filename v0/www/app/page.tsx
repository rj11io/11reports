import { ArrowUpRight, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { canonicalReportUrl, getListedReports } from "@/lib/reports"

export default function Page() {
  const reports = getListedReports()

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="size-4" aria-hidden="true" />
            <span>11reports</span>
          </div>
          <Badge variant="secondary">{reports.length} reports</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Reports
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A simple archive for agent-produced reports. Open the original HTML,
            review its source files, or share a stable link.
          </p>
        </section>

        <section
          className="mt-10 grid gap-4 sm:grid-cols-2"
          aria-label="Reports"
        >
          {reports.map(({ manifest }) => {
            const date = new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeZone: "UTC",
            }).format(new Date(manifest.createdAt))

            return (
              <a
                className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                href={canonicalReportUrl(manifest.id)}
                key={manifest.id}
              >
                <Card className="h-full transition-colors group-hover:bg-muted/40">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {manifest.tags[0] ?? "report"}
                      </Badge>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={manifest.createdAt}
                      >
                        {date}
                      </time>
                    </div>
                    <CardTitle className="pr-8 text-lg">
                      {manifest.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-3 leading-6">
                      {manifest.summary}
                    </CardDescription>
                    <CardAction>
                      <ArrowUpRight
                        className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                        aria-hidden="true"
                      />
                    </CardAction>
                  </CardHeader>
                </Card>
              </a>
            )
          })}
        </section>
      </div>
    </main>
  )
}
