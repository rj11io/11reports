import { generatedReportContents } from "./generated-content"
import { generatedReportManifests } from "./generated-index"
import type { ReportContent, ReportManifest, ReportRecord } from "./types"

const manifests = generatedReportManifests as unknown as ReportManifest[]
const contents = generatedReportContents as unknown as Record<string, ReportContent>
const reports = manifests.map((manifest) => ({
  manifest,
  content: contents[manifest.id] ?? {},
}))
const reportMap = new Map(reports.map((report) => [report.manifest.id, report]))

export function getAllReports(): ReportRecord[] {
  return reports
}

export function getListedReports(): ReportRecord[] {
  return reports.filter((report) => report.manifest.access.listing === "listed")
}

export function getReport(id: string): ReportRecord | undefined {
  return reportMap.get(id)
}

export function canonicalReportUrl(id: string) {
  const domain = process.env.NEXT_PUBLIC_REPORTS_DOMAIN || "reports.rj11.io"
  return `https://${id}.${domain}`
}
