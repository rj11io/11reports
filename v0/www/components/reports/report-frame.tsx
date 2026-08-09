"use client"

import { useEffect, useRef, useState } from "react"
import { LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type FrameMessage = {
  type?: string
  reportId?: string
  token?: string
  height?: number
  url?: string
}

export function ReportFrame({
  reportId,
  execution,
}: {
  reportId: string
  execution: "static" | "scripts"
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(720)
  const [loaded, setLoaded] = useState(false)
  const [staticMode, setStaticMode] = useState(false)
  const [reload, setReload] = useState(0)
  const [token, setToken] = useState("")
  const source = `/_content?bridge=${token}${staticMode ? "&mode=static" : ""}`

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToken(crypto.randomUUID().replaceAll("-", ""))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [reload])

  useEffect(() => {
    function handleMessage(event: MessageEvent<FrameMessage>) {
      if (event.source !== frame.current?.contentWindow) return
      const message = event.data
      if (message?.reportId !== reportId || message.token !== token) return
      if (
        message.type === "11reports:resize" &&
        Number.isFinite(message.height)
      ) {
        setHeight(Math.max(420, Math.min(10_000, Number(message.height))))
      }
      if (message.type === "11reports:link" && message.url) {
        try {
          const url = new URL(message.url)
          if (["http:", "https:"].includes(url.protocol)) {
            window.open(url, "_blank", "noopener,noreferrer")
          }
        } catch {
          // Ignore malformed URLs emitted by report content.
        }
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [reportId, token])

  function reloadFrame(nextStatic = staticMode) {
    setLoaded(false)
    setStaticMode(nextStatic)
    setHeight(720)
    setReload((value) => value + 1)
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Isolated HTML
        </div>
        <div className="flex items-center gap-1">
          {execution === "scripts" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => reloadFrame(!staticMode)}
            >
              {staticMode ? "Enable scripts" : "Disable scripts"}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => reloadFrame()}
          >
            <RefreshCw data-icon="inline-start" />
            Reload
          </Button>
        </div>
      </div>
      <div className="relative bg-muted/30">
        {!loaded && (
          <div className="absolute inset-x-0 top-0 flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Loading report
          </div>
        )}
        {token && (
          <iframe
            key={`${reload}-${token}`}
            ref={frame}
            src={source}
            title="Report HTML"
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            loading="eager"
            onLoad={() => setLoaded(true)}
            className="relative block w-full border-0 bg-white"
            style={{ height }}
          />
        )}
      </div>
    </Card>
  )
}
