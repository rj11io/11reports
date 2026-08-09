import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://reports.rj11.io"),
  title: {
    default: "11reports",
    template: "%s · 11reports",
  },
  description:
    "A durable archive for agent-produced reports and their source artifacts.",
  openGraph: {
    type: "website",
    siteName: "11reports",
    title: "11reports",
    description:
      "Reports worth keeping. Original HTML, source artifacts, one stable link.",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "11reports. Reports worth keeping.",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", inter.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
