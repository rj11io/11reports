# Producer contract

## Input directory

```text
report-output/
├── data.json      optional raw inputs
├── report.html    preferred presentation
└── report.md      fallback and readable source
```

Use one HTML and one Markdown file. The importer preserves original filenames.

## Result contract

Import returns the new immutable bundle location:

```json
{
  "status": "imported",
  "reports": [
    {
      "id": "01...",
      "bundle": "/path/to/11reports/v0/www/content/reports/01...",
      "digest": "sha256:..."
    }
  ]
}
```

Pass `reports[0].bundle` to publish. Publish returns:

```json
{
  "status": "published",
  "id": "01...",
  "url": "https://01....reports.rj11.io",
  "digest": "sha256:...",
  "commit": "..."
}
```

Timeout after push uses `status: deployment_pending`. Validation or Git failure exits nonzero and prints a preserved worktree when available.

Set `ELEVEN_REPORTS_REPO` when the local archive checkout is outside the current project. The wrapper otherwise uses its source checkout or an authenticated temporary clone.
