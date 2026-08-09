# 11reports web

Next.js 16 application for the catalog, wildcard report shells, sandboxed HTML, artifact views, and deployment receipts.

```bash
npm install
npm run reports:validate
npm run dev
```

Production root: `v0/www`.

| Command | Purpose |
| --- | --- |
| `npm run reports:validate` | Validate the full immutable archive |
| `npm run reports:generate` | Derive build modules from manifests |
| `npm run reports:import -- <dir>` | Import an existing report folder |
| `npm run reports:publish -- <bundle>` | Commit, push, deploy, verify |
| `npm run reports:verify -- <id>` | Verify a deployed receipt |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Check source quality |
| `npm test` | Run archive/security tests |
| `npm run build` | Create the Vercel production build |
