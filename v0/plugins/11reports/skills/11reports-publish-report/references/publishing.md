# Publishing contract

- Require a valid immutable bundle and lowercase ULID.
- Use an isolated temporary worktree based on `origin/main`.
- Commit only `v0/www/content/reports/<id>`.
- Rebase and retry a rejected push at most three times. Never force-push.
- Verify `HEAD https://<id>.reports.rj11.io/` returns `200` plus the exact ID, digest, and pushed commit headers.
- Preserve the failed worktree path for recovery.
- Treat exposure flags as website controls, not repository secrecy.
