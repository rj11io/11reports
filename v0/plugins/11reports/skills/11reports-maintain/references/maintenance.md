# Maintenance checks

## Archive

- Validate every manifest, artifact hash, digest, path, size, MIME type, and exposure enum.
- Reject symlinks, traversal, executables, unexpected files, duplicate IDs, and duplicate slugs.

## Routing

- Root and `www` show the catalog.
- Known ULID subdomains show the trusted shell.
- Known `/_content` serves sandboxed HTML.
- Unknown or reserved report hosts return 404.
- Internal `/_reports/` routes are not public.

## Sandbox

- Omit `allow-same-origin`.
- Keep connections, forms, workers, objects, and child frames disabled.
- Validate bridge messages by source, report ID, and unpredictable token.
- Keep privileged APIs free of wildcard CORS and wildcard-domain cookies.

## Deployment

- Verify the ID, digest, and commit receipt. HTTP 200 alone is insufficient.
- Inspect `deployment_pending` before retrying publication to avoid duplicate IDs.
