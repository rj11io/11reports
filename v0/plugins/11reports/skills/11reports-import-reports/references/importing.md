# Import controls

- Allow one HTML, one Markdown, and one exact `data.json` maximum per source directory.
- Default exposure: data `hidden`, Markdown `render`, HTML `sandbox`.
- Infer `static` HTML unless a script tag exists.
- Reject external scripts. Allowlist only external origins used by styles, fonts, images, or media.
- Default listing to `listed`; default indexing to `false`.
- Preserve source filenames and bytes exactly.
- Use `--unlisted`, `--data-exposure`, `--markdown-exposure`, or `--html-exposure` to override defaults.
- Warn that hidden or unlisted artifacts remain readable in a public Git repository.
