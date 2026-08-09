import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-16">
      <section
        className="w-full max-w-md text-center"
        aria-labelledby="not-found-title"
      >
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border bg-muted">
          <FileQuestion className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1
          id="not-found-title"
          className="mt-2 text-2xl font-semibold tracking-tight"
        >
          Report not found
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Check the report ID or return to the archive.
        </p>
        <Link
          className={buttonVariants({ className: "mt-6" })}
          href="https://reports.rj11.io"
        >
          Browse reports
        </Link>
      </section>
    </main>
  )
}
