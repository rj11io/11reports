# 11reports

Archive agent-produced reports, deploy them through Git and Vercel, then return one verified share URL.

- Catalog: [reports.rj11.io](https://reports.rj11.io)
- Report: `https://<lowercase-ulid>.reports.rj11.io`
- HTML: primary view inside an origin-isolated sandbox
- Markdown: rendered fallback and downloadable source
- JSON: explicit hidden, view, download, or view-download exposure
- Storage: immutable, file-backed bundles in Git
- Deployment receipt: exact ID, digest, and commit headers from `HEAD /`

## Included reports

| ID | Report |
| --- | --- |
| `01kz3dkwm0p6rdpsnfzrb0qx9c` | The 10 Biggest Cybersecurity Stories Right Now |
| `01kz3h1r80b577fx81qf2y53yc` | 10 Hottest Cybersecurity Stories, August 3, 2026 |
| `01kz3mfkw0h09a3dbwjmf3vn0p` | 10 Hottest Startup Stories, August 3, 2026 |
| `01kz3qxfg0v60rzqxfajgf063y` | The 10 Hottest Startup Stories, August 2026 |

The original HTML and Markdown bytes are preserved. These sources did not contain `data.json`, so their manifests do not invent one.

## Structure

```text
.
├── .agents/plugins/marketplace.json       Codex marketplace
├── .claude-plugin/marketplace.json        Claude Code marketplace
├── .github/workflows/ci.yml
└── v0/
    ├── plugins/11reports/                 shared Codex and Claude plugin
    └── www/
        ├── app/                           catalog, shell, sandbox routes
        ├── content/reports/<id>/          immutable bundles
        ├── report.schema.json
        └── scripts/11reports.mjs          validate/import/publish/verify CLI
```

Vercel's application root must remain `v0/www`. Keep report content inside that build scope.

## Local use

Requires Node 24 and npm 11.

```bash
cd v0/www
npm install
npm run dev
```

Use `<id>.localhost:3000` to exercise subdomain routing locally.

## CLI

```bash
npm --prefix v0/www run reports:validate
node v0/www/scripts/11reports.mjs import ./report-output --json
node v0/www/scripts/11reports.mjs publish ./bundle --json
node v0/www/scripts/11reports.mjs verify <id> --digest sha256:... --commit ... --json
```

`publish` validates first, creates an isolated worktree from `origin/main`, stages only one report folder, commits, rebases with bounded retries, pushes without force, waits for Vercel, and accepts deployment only when all receipt headers match.

## Report bundle

```text
<lowercase-ulid>/
├── manifest.json
├── data.json       optional
├── report.html     optional, preferred
└── report.md       optional, fallback
```

See [`v0/www/report.schema.json`](v0/www/report.schema.json) and [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Plugins and skills

The same plugin directory serves Codex and Claude Code. It includes publish, integrate, import, and maintain skills.

Codex repo marketplace:

```bash
codex plugin marketplace add /path/to/11reports
```

Claude Code marketplace:

```text
/plugin marketplace add rj11io/11reports
/plugin install 11reports@11reports
```

Plugin formats follow the [OpenAI plugin packaging guide](https://developers.openai.com/plugins/build/plugins) and [Claude Code plugin marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces).

## Privacy boundary

Exposure flags control the website only. While this GitHub repository is public, every committed artifact remains publicly retrievable from Git history. Make the repository private before archiving confidential raw data. Authentication and true private report delivery are deferred.

## Deferred

- MCP server
- database
- user authentication and private report access
- object storage and large binaries
- arbitrary external report networking
- comments and collaboration
