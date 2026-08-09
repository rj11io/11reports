import { generatedReportManifests } from "./generated-index"
import type { ReportManifest } from "./types"

const manifests = generatedReportManifests as unknown as ReportManifest[]
const receiptMap = new Map(manifests.map((manifest) => [manifest.id, manifest]))

export function getReportReceipt(id: string) {
  return receiptMap.get(id)
}

export function hasReport(id: string) {
  return receiptMap.has(id)
}
