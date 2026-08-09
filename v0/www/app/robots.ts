import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/_reports/", "/_content"] }],
    sitemap: "https://reports.rj11.io/sitemap.xml",
  }
}
