---
name: 11reports-import-reports
description: Inventory, validate, deduplicate, and import existing HTML, Markdown, and data.json report folders into immutable 11reports bundles. Use for archive migrations, Desktop report cleanup, batch imports, or converting legacy reports before publication.
---

# Import report archives

Read [references/importing.md](references/importing.md).

1. Inventory source directories without changing them.
2. Identify sensitive content and duplicates by content hash and title.
3. Run a dry import first:

```bash
node <plugin-root>/scripts/11reports.mjs import <directory...> --dry-run --json
```

4. Review listing, indexing, HTML execution/networking, and artifact exposure.
5. Import. The command preserves raw files, creates a manifest and hashes, then validates each bundle.
6. Run archive-wide validation after the batch.

Never invent missing `data.json`. Record only artifacts that exist. Never change the originals.
