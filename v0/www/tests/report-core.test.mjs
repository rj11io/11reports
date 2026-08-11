import assert from "node:assert/strict"
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import {
  artifactMetadata,
  computeManifestDigest,
  createUlid,
  validateArchive,
  validateBundle,
} from "../scripts/lib/report-core.mjs"

const appRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  ".."
)

async function fixture(options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "11reports-test-"))
  const id = createUlid(Date.parse("2026-08-03T00:00:00Z"))
  const bundle = path.join(root, id)
  await mkdir(bundle)
  const htmlPath = path.join(bundle, "report.html")
  await writeFile(
    htmlPath,
    options.html ?? "<!doctype html><title>Fixture</title><h1>Fixture</h1>"
  )
  const manifest = {
    schemaVersion: 1,
    id,
    slug: "fixture-report",
    title: "Fixture report",
    summary:
      "A deterministic fixture report used by the archive validator tests.",
    createdAt: "2026-08-03T00:00:00.000Z",
    tags: ["fixture"],
    source: { workflow: "test" },
    generator: { agent: "node-test", skill: "11reports-maintain" },
    access: { listing: "unlisted", indexing: false },
    artifacts: {
      html: {
        ...(await artifactMetadata(htmlPath, "html")),
        exposure: "sandbox",
        execution: "static",
        network: "none",
        allowlist: [],
      },
    },
    digest: "",
  }
  manifest.digest = computeManifestDigest(manifest)
  await writeFile(
    path.join(bundle, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  )
  return { root, bundle, manifest }
}

test("the checked-in archive validates", async () => {
  const result = await validateArchive(path.join(appRoot, "content", "reports"))
  assert.equal(result.ok, true, result.errors.join("\n"))
  assert.ok(result.reports.length > 0, "archive must contain at least one report")
})

test("ULIDs are lowercase and DNS-safe", () => {
  assert.match(createUlid(), /^[0-9a-hjkmnp-tv-z]{26}$/)
})

test("tampered artifacts fail their hash and digest checks", async () => {
  const { bundle } = await fixture()
  await writeFile(path.join(bundle, "report.html"), "tampered")
  const result = await validateBundle(bundle)
  assert.equal(result.ok, false)
  assert(result.errors.some((error) => error.includes("sha256")))
})

test("external scripts are rejected", async () => {
  const { bundle } = await fixture({
    html: '<script src="https://example.com/report.js"></script>',
  })
  const result = await validateBundle(bundle)
  assert.equal(result.ok, false)
  assert(result.errors.some((error) => error.includes("External scripts")))
})

test("nested iframes and non-HTTPS allowlist origins are rejected", async () => {
  const { bundle } = await fixture({
    html: '<iframe src="http://example.com/embed"></iframe>',
  })
  const result = await validateBundle(bundle)
  assert.equal(result.ok, false)
  assert(result.errors.some((error) => error.includes("Nested iframes")))
  assert(result.errors.some((error) => error.includes("not allowlisted")))
})

test("unknown nested manifest fields and duplicate tags are rejected", async () => {
  const { bundle, manifest } = await fixture()
  manifest.tags = ["fixture", "fixture"]
  manifest.access.extra = true
  manifest.digest = computeManifestDigest(manifest)
  await writeFile(
    path.join(bundle, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  )
  const result = await validateBundle(bundle)
  assert.equal(result.ok, false)
  assert(result.errors.some((error) => error.includes("tags must be unique")))
  assert(result.errors.some((error) => error.includes("Unknown access field")))
})

test("unexpected files and symlinks are rejected", async () => {
  const { bundle } = await fixture()
  await writeFile(path.join(bundle, "unexpected.txt"), "unexpected")
  await symlink(
    path.join(bundle, "report.html"),
    path.join(bundle, "linked.html")
  )
  const result = await validateBundle(bundle)
  assert.equal(result.ok, false)
  assert(result.errors.some((error) => error.includes("Unexpected file")))
  assert(result.errors.some((error) => error.includes("Symlinks")))
})
