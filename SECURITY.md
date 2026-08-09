# Security

## Report content

Treat generated HTML as trusted enough to display but not trusted enough to share the application origin. It always runs in an opaque-origin iframe with a restrictive CSP. External scripts, symlinks, path traversal, executables, unexpected files, invalid JSON, oversized artifacts, and hash mismatches fail publication.

## Cookies and APIs

- Never scope cookies to `Domain=.rj11.io` or `Domain=.reports.rj11.io`.
- Use host-only `__Host-` cookies if authentication is added.
- Never expose privileged APIs with wildcard CORS.
- Keep report hosts free of secrets and ambient authority.

## Public repository warning

`hidden` and `unlisted` are website controls. They do not hide committed files in a public repository or its history.

## Reporting issues

Open a private GitHub security advisory for vulnerabilities. Do not include confidential report data in a public issue.
