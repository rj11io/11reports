---
name: 11reports-maintain
description: Maintain and troubleshoot the 11reports application, report archive, wildcard routing, sandbox headers, deployment receipts, schemas, and publication tooling. Use for upgrades, validation failures, broken report links, security checks, archive audits, or routine repository maintenance.
---

# Maintain 11reports

Read [references/maintenance.md](references/maintenance.md) for the relevant check.

## Baseline

```bash
npm --prefix v0/www run reports:validate
npm --prefix v0/www run typecheck
npm --prefix v0/www run lint
npm --prefix v0/www test
npm --prefix v0/www run build
```

For a deployed report, run:

```bash
node <plugin-root>/scripts/11reports.mjs verify <id> --digest <digest> --commit <commit> --json
```

Keep bundles append-only. Fix metadata by publishing a new report ID unless correcting an archive initialization error before release. Test unknown wildcard hosts for 404 and known `HEAD /` receipts for exact headers.
