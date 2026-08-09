---
name: 11reports-integrate-workflow
description: Integrate an existing report-producing agent, skill, scheduled job, or black-box workflow with 11reports. Use when a project should hand off HTML, Markdown, and JSON outputs for automatic archival, Git publication, Vercel deployment, and verified URL delivery.
---

# Integrate a report workflow

Read [references/workflow-contract.md](references/workflow-contract.md), then modify the producer at its final delivery boundary.

## Required behavior

1. Emit one self-contained directory with `report.html`, `report.md`, and optional `data.json`.
2. Keep HTML assets local. Never add external scripts. Declare external style, font, or image origins in the manifest allowlist.
3. Choose explicit exposure values. Default data to `hidden`, HTML to `sandbox`, Markdown to `render`, listing to `listed`, and indexing to `false`.
4. Invoke the plugin wrapper after report synthesis succeeds:

```bash
node <plugin-root>/scripts/11reports.mjs import <output-directory> --json
node <plugin-root>/scripts/11reports.mjs publish <bundle-from-import-result> --json
```

Parse the first command with the workflow's native JSON tooling. Pass `reports[0].bundle` to the second command.

5. Propagate the publish JSON result without rewriting it. Reply with the URL only after `status: published`.
6. Keep report generation successful if publication times out. Return `deployment_pending` and recovery details.

Do not put Git credentials in workflow files. Use existing Git or `gh` authentication. Support a future private repository through the same authenticated transport.
