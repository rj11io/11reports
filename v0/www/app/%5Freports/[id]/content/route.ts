import { randomBytes } from "node:crypto"

import { getReport } from "@/lib/reports"

function injectBridge(
  html: string,
  reportId: string,
  token: string,
  nonce: string
) {
  const bridge = `<base target="_blank"><script nonce="${nonce}">(()=>{const reportId=${JSON.stringify(reportId)};const token=${JSON.stringify(token)};let scheduled=false;const send=()=>{scheduled=false;parent.postMessage({type:"11reports:resize",reportId,token,height:Math.ceil(document.documentElement.scrollHeight)},"*")};const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(send)}};addEventListener("load",schedule);new ResizeObserver(schedule).observe(document.documentElement);document.addEventListener("click",event=>{const anchor=event.target.closest?.("a[href]");if(!anchor)return;const url=new URL(anchor.href,document.baseURI);if(url.protocol==="http:"||url.protocol==="https:"){event.preventDefault();parent.postMessage({type:"11reports:link",reportId,token,url:url.href},"*")}})})();</script>`
  return /<\/head>/i.test(html)
    ? html.replace(/<\/head>/i, `${bridge}</head>`)
    : `${bridge}${html}`
}

function allowedOrigin(host: string, reportId: string) {
  const cleanHost = host.split(",")[0].trim().toLowerCase()
  if (!/^[a-z0-9.:-]+$/.test(cleanHost))
    return `https://${reportId}.reports.rj11.io`
  const scheme =
    cleanHost.includes("localhost") || cleanHost.startsWith("127.0.0.1")
      ? "http"
      : "https"
  return `${scheme}://${cleanHost}`
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const report = getReport(id)
  const htmlArtifact = report?.manifest.artifacts.html
  const requestId = request.headers.get("x-11reports-id")
  if (
    !report ||
    !htmlArtifact ||
    htmlArtifact.exposure !== "sandbox" ||
    requestId !== id
  ) {
    return new Response("Not found", { status: 404 })
  }

  const rawHtml = report.content.html
  if (!rawHtml) return new Response("Not found", { status: 404 })
  const url = new URL(request.url)
  const token = url.searchParams.get("bridge") ?? ""
  if (!/^[a-f0-9]{32}$/.test(token))
    return new Response("Invalid bridge token", { status: 400 })

  const nonce = randomBytes(16).toString("base64")
  const forceStatic = url.searchParams.get("mode") === "static"
  const scriptsEnabled = htmlArtifact.execution === "scripts" && !forceStatic
  const allowlist =
    htmlArtifact.network === "allowlist" ? htmlArtifact.allowlist.join(" ") : ""
  const scriptSource = scriptsEnabled
    ? "'unsafe-inline' blob:"
    : `'nonce-${nonce}'`
  const csp = [
    "sandbox allow-scripts",
    "default-src 'none'",
    `script-src ${scriptSource}`,
    `style-src 'unsafe-inline' ${allowlist}`.trim(),
    `img-src data: blob: ${allowlist}`.trim(),
    `font-src data: ${allowlist}`.trim(),
    `media-src data: blob: ${allowlist}`.trim(),
    "connect-src 'none'",
    "worker-src 'none'",
    "object-src 'none'",
    "child-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    `frame-ancestors ${allowedOrigin(request.headers.get("x-11reports-original-host") || request.headers.get("host") || "", id)}`,
  ].join("; ")

  return new Response(injectBridge(rawHtml, id, token, nonce), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": csp,
      "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
