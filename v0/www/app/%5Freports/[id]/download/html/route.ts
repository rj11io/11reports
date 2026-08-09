import { getReport } from "@/lib/reports"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const report = getReport(id)
  const artifact = report?.manifest.artifacts.html
  if (
    !report ||
    !artifact ||
    artifact.exposure !== "sandbox" ||
    request.headers.get("x-11reports-id") !== id
  ) {
    return new Response("Not found", { status: 404 })
  }
  return new Response(report.content.html, {
    headers: {
      "Content-Type": artifact.mimeType,
      "Content-Disposition": `attachment; filename="${artifact.path.replaceAll('"', "")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  })
}
