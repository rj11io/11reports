import { NextResponse, type NextRequest } from "next/server"

import { getReportReceipt, hasReport } from "@/lib/reports/receipts"

const REPORTS_DOMAIN = process.env.REPORTS_DOMAIN || "reports.rj11.io"
const RESERVED_HOSTS = new Set(["www", "api", "admin", "status", "assets", "static"])
const PASSTHROUGH_PATHS = ["/_next/", "/favicon.ico", "/og.png"]

function hostname(request: NextRequest) {
  return (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
}

function reportIdFromHost(host: string) {
  if (host.endsWith(`.${REPORTS_DOMAIN}`)) return host.slice(0, -REPORTS_DOMAIN.length - 1)
  if (host.endsWith(".localhost")) return host.slice(0, -".localhost".length)
  return null
}

function secure(response: NextResponse) {
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'self'")
  return response
}

function reportHeaders(request: NextRequest, id: string) {
  const headers = new Headers(request.headers)
  headers.set("x-11reports-id", id)
  headers.set("x-11reports-original-host", request.headers.get("host") || "")
  return headers
}

export function proxy(request: NextRequest) {
  const host = hostname(request)
  const pathname = request.nextUrl.pathname
  const internalId = request.headers.get("x-11reports-id")
  const internalMatch = pathname.match(/^\/_reports\/([0-9a-hjkmnp-tv-z]{26})(?:\/|$)/)
  if (internalMatch && internalId === internalMatch[1] && hasReport(internalId)) {
    return NextResponse.next()
  }
  const id = reportIdFromHost(host)

  if (!id) {
    if (pathname.startsWith("/_reports/")) return secure(new NextResponse("Not found", { status: 404 }))
    return secure(NextResponse.next())
  }
  if (RESERVED_HOSTS.has(id) || id.includes(".")) {
    if (id === "www") return secure(NextResponse.next())
    return secure(new NextResponse("Not found", { status: 404 }))
  }
  if (!hasReport(id)) return secure(new NextResponse("Not found", { status: 404 }))
  if (PASSTHROUGH_PATHS.some((prefix) => pathname.startsWith(prefix))) return NextResponse.next()

  const receipt = getReportReceipt(id)
  if (request.method === "HEAD" && pathname === "/" && receipt) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-11Reports-Id": id,
        "X-11Reports-Digest": receipt.digest,
        "X-11Reports-Commit": process.env.VERCEL_GIT_COMMIT_SHA || "local",
        "X-Content-Type-Options": "nosniff",
      },
    })
  }

  if (pathname.startsWith("/_reports/")) return secure(new NextResponse("Not found", { status: 404 }))
  if (pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const routes: Record<string, string> = {
    "/": `/_reports/${id}`,
    "/_content": `/_reports/${id}/content`,
    "/_download/data": `/_reports/${id}/download/data`,
    "/_download/markdown": `/_reports/${id}/download/markdown`,
  }
  const destination = routes[pathname]
  if (!destination) return secure(new NextResponse("Not found", { status: 404 }))

  const url = request.nextUrl.clone()
  url.pathname = destination
  const response = NextResponse.rewrite(url, { request: { headers: reportHeaders(request, id) } })
  if (pathname === "/") secure(response)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
