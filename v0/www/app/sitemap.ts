import type { MetadataRoute } from "next"

import { canonicalReportUrl, getListedReports } from "@/lib/reports"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://reports.rj11.io", changeFrequency: "daily", priority: 1 },
    ...getListedReports()
      .filter((report) => report.manifest.access.indexing)
      .map((report) => ({
        url: canonicalReportUrl(report.manifest.id),
        lastModified: new Date(report.manifest.createdAt),
        changeFrequency: "never" as const,
        priority: 0.7,
      })),
  ]
}
