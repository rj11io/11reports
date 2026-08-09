import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Braces,
  ChevronDown,
  Database,
  Download,
  FileCode2,
  FileText,
  Info,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

import { ReportFrame } from "@/components/reports/report-frame"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { canonicalReportUrl, getAllReports, getReport } from "@/lib/reports"

type View = "report" | "data" | "markdown" | "details"

export function generateStaticParams() {
  return getAllReports().map((report) => ({ id: report.manifest.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const report = getReport(id)
  if (!report) return {}
  const reportUrl = canonicalReportUrl(id)
  return {
    title: report.manifest.title,
    description: report.manifest.summary,
    alternates: { canonical: reportUrl },
    robots: report.manifest.access.indexing
      ? "index, follow"
      : "noindex, nofollow",
    openGraph: {
      type: "article",
      title: report.manifest.title,
      description: report.manifest.summary,
      url: reportUrl,
      images: [
        {
          url: `${reportUrl}/og.png`,
          width: 1731,
          height: 909,
          alt: "11reports. Reports worth keeping.",
        },
      ],
    },
    twitter: { card: "summary_large_image", images: [`${reportUrl}/og.png`] },
  }
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const report = getReport(id)
  if (!report) notFound()

  const dataExposure = report.manifest.artifacts.data?.exposure
  const canViewData =
    dataExposure === "view" || dataExposure === "view-download"
  const canDownloadData =
    dataExposure === "download" || dataExposure === "view-download"
  const markdownArtifact = report.manifest.artifacts.markdown
  const canViewMarkdown = Boolean(
    markdownArtifact && markdownArtifact.exposure !== "hidden"
  )
  const htmlArtifact = report.manifest.artifacts.html
  const canViewHtml = htmlArtifact?.exposure === "sandbox"
  const requested = ["report", "data", "markdown", "details"].includes(
    query.view ?? ""
  )
    ? (query.view as View)
    : "report"
  const view: View =
    (requested === "data" && !canViewData) ||
    (requested === "markdown" && !canViewMarkdown) ||
    (requested === "report" && !canViewHtml)
      ? canViewMarkdown
        ? "markdown"
        : "details"
      : requested

  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(report.manifest.createdAt))

  const tabs: {
    id: View
    label: string
    visible: boolean
    icon: typeof FileText
  }[] = [
    { id: "report", label: "Report", visible: canViewHtml, icon: FileText },
    { id: "data", label: "Data", visible: canViewData, icon: Database },
    {
      id: "markdown",
      label: "Markdown",
      visible: canViewMarkdown,
      icon: FileText,
    },
    { id: "details", label: "Details", visible: true, icon: Info },
  ]

  return (
    <main className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              href="https://reports.rj11.io"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              11reports
            </Link>
            <Badge variant="outline" className="font-mono font-normal">
              {id}
            </Badge>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {report.manifest.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={report.manifest.createdAt}>{date}</time>
                {report.manifest.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {(canViewHtml || canViewMarkdown || canDownloadData) && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Download data-icon="inline-start" />
                  Download
                  <ChevronDown data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuLabel>Available files</DropdownMenuLabel>
                  {canViewHtml && (
                    <DropdownMenuLinkItem href="/_download/html" closeOnClick>
                      <FileCode2 />
                      HTML
                      <DropdownMenuShortcut>.html</DropdownMenuShortcut>
                    </DropdownMenuLinkItem>
                  )}
                  {canViewMarkdown && (
                    <DropdownMenuLinkItem
                      href="/_download/markdown"
                      closeOnClick
                    >
                      <FileText />
                      Markdown
                      <DropdownMenuShortcut>.md</DropdownMenuShortcut>
                    </DropdownMenuLinkItem>
                  )}
                  {canDownloadData && (
                    <DropdownMenuLinkItem href="/_download/data" closeOnClick>
                      <Braces />
                      Data
                      <DropdownMenuShortcut>.json</DropdownMenuShortcut>
                    </DropdownMenuLinkItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <nav className="mt-5 flex flex-wrap gap-1" aria-label="Report views">
            {tabs
              .filter((tab) => tab.visible)
              .map((tab) => {
                const Icon = tab.icon
                return (
                  <Link
                    key={tab.id}
                    href={tab.id === "report" ? "/" : `/?view=${tab.id}`}
                    aria-current={view === tab.id ? "page" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: view === tab.id ? "secondary" : "ghost",
                        size: "sm",
                      })
                    )}
                  >
                    <Icon data-icon="inline-start" />
                    {tab.label}
                  </Link>
                )
              })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        {view === "report" && htmlArtifact && (
          <ReportFrame reportId={id} execution={htmlArtifact.execution} />
        )}

        {view === "data" && canViewData && report.content.data && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Raw data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-6">
                {JSON.stringify(JSON.parse(report.content.data), null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {view === "markdown" && markdownArtifact && report.content.markdown && (
          <Card>
            <CardContent className="mx-auto w-full max-w-4xl text-[15px] leading-7 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-8 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_strong]:font-semibold [&_table]:my-5 [&_table]:w-full [&_table]:text-left [&_td]:border-b [&_td]:p-2 [&_th]:border-b [&_th]:p-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
              {markdownArtifact.exposure === "render" ? (
                <ReactMarkdown
                  components={{
                    a: ({ children, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {report.content.markdown}
                </ReactMarkdown>
              ) : (
                <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap">
                  {report.content.markdown}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {view === "details" && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Archive receipt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-6 text-muted-foreground">
                  {report.manifest.summary}
                </p>
                <dl className="mt-6 grid gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Source workflow</dt>
                    <dd className="mt-1 font-medium">
                      {report.manifest.source.workflow}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Listing</dt>
                    <dd className="mt-1 font-medium">
                      {report.manifest.access.listing}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Digest</dt>
                    <dd className="mt-1 font-mono text-xs break-all">
                      {report.manifest.digest}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Manifest</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto font-mono text-xs leading-6">
                  {JSON.stringify(report.manifest, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
