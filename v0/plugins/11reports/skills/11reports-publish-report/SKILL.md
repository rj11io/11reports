---
name: 11reports-publish-report
description: Validate, archive, Git-publish, wait for Vercel, and return a verified 11reports URL for a report bundle containing HTML, Markdown, and optional data.json. Use when an agent finishes a report and the user asks to archive, publish, deploy, share, or open it on another device.
---

# Publish a report

Use the deterministic plugin wrapper. Do not stage or commit from the caller's working tree.

## Workflow

1. Inspect the bundle. Preserve its raw HTML, Markdown, and `data.json`.
2. Read [references/publishing.md](references/publishing.md).
3. If `manifest.json` is absent, import the source first:

```bash
node <plugin-root>/scripts/11reports.mjs import <bundle> --json
```

4. Review the generated exposure flags. Warn that committed files are readable while the GitHub repository is public.
5. Read the resulting bundle path from `reports[0].bundle`, then publish it:

```bash
node <plugin-root>/scripts/11reports.mjs publish <bundle> --json
```

6. Return the `url` only when status is `published`. If status is `deployment_pending`, return the URL with that explicit state and receipt details.

Never force-push, stage unrelated files, treat HTTP 200 alone as verification, or report success before ID, digest, and commit headers match.
