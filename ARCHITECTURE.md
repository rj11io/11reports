# Architecture

## Request flow

```text
agent report bundle
  -> validate paths, types, sizes, hashes, exposure
  -> isolated Git worktree
  -> one report commit on main
  -> Vercel deployment
  -> HEAD receipt matches ID + digest + commit
  -> https://<id>.reports.rj11.io
```

The base domain is the catalog. A known ULID subdomain is rewritten by Next.js 16 `proxy.ts` to an internal trusted shell. Unknown and reserved subdomains return 404.

## Routes

| Public request | Result |
| --- | --- |
| `reports.rj11.io/` | Listed-report catalog |
| `<id>.reports.rj11.io/` | Trusted viewer shell |
| `<id>.reports.rj11.io/_content` | Sandboxed raw HTML response |
| `<id>.reports.rj11.io/_download/data` | Data download if allowed |
| `<id>.reports.rj11.io/_download/markdown` | Markdown source download |
| unknown wildcard host | 404 |
| direct `/_reports/...` | 404 |

`HEAD /` on a known report returns `X-11Reports-Id`, `X-11Reports-Digest`, and `X-11Reports-Commit`. HTTP 200 without exact values is not a deployment receipt.

## Build model

`scripts/generate-report-index.mjs` validates all bundles and creates ignored TypeScript modules before development, type checking, and production builds. The catalog is derived from manifests. No central catalog file or database is committed.

## Sandbox model

- Unique report hostname provides a distinct browser origin.
- Trusted shell embeds `/_content` with `sandbox="allow-scripts"` and no `allow-same-origin`.
- Static reports use a nonce for the trusted resize/link bridge. Report-authored scripts remain blocked.
- Script-enabled reports allow inline scripts but still have an opaque origin.
- CSP blocks connections, forms, workers, objects, child frames, base URL changes, and non-allowlisted resources.
- External scripts are rejected during validation.
- Parent messages require the exact frame source, report ID, and unpredictable token.
- Frame height is throttled and clamped. The shell exposes reload and static-mode controls.

Browser sandboxing does not provide CPU or memory quotas. The iframe may still become slow; reload and script-disable controls are the recovery path.

## Immutability

The publisher adds only `v0/www/content/reports/<id>`. Existing bundles are not overwritten. Artifact hashes and a manifest digest make changes detectable. A correction should normally receive a new report ID.

## Private transition

Making GitHub private hides source artifacts from anonymous Git access but does not add report-site authorization. Keep public deployment exposure settings conservative. Add host-level authentication before serving confidential reports. This remains deferred.
