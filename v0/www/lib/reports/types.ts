export type Listing = "listed" | "unlisted"
export type DataExposure = "hidden" | "view" | "download" | "view-download"
export type MarkdownExposure = "hidden" | "source" | "render"
export type HtmlExposure = "archive" | "sandbox"
export type HtmlExecution = "static" | "scripts"
export type HtmlNetwork = "none" | "allowlist"

export type ArtifactBase = {
  path: string
  mimeType: string
  bytes: number
  sha256: string
}

export type ReportManifest = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  summary: string
  createdAt: string
  tags: string[]
  source: {
    project?: string
    commit?: string
    workflow: string
    originalPath?: string
  }
  generator: {
    agent: string
    skill: string
  }
  access: {
    listing: Listing
    indexing: boolean
  }
  artifacts: {
    data?: ArtifactBase & { exposure: DataExposure }
    markdown?: ArtifactBase & { exposure: MarkdownExposure }
    html?: ArtifactBase & {
      exposure: HtmlExposure
      execution: HtmlExecution
      network: HtmlNetwork
      allowlist: string[]
    }
  }
  digest: string
}

export type ReportContent = Partial<Record<"data" | "markdown" | "html", string>>

export type ReportRecord = {
  manifest: ReportManifest
  content: ReportContent
}
