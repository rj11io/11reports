#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { mkdtemp, rm, stat } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

async function exists(value) {
  return Boolean(await stat(value).catch(() => null))
}

function run(command, args, cwd) {
  return spawnSync(command, args, { cwd, encoding: "utf8", stdio: "inherit" })
}

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceCheckout = path.resolve(pluginRoot, "..", "..", "..")
let repo = process.env.ELEVEN_REPORTS_REPO
let temporary = false

if (!repo && (await exists(path.join(sourceCheckout, "v0", "www", "scripts", "11reports.mjs")))) {
  repo = sourceCheckout
}

if (!repo) {
  repo = await mkdtemp(path.join(os.tmpdir(), "11reports-repo-"))
  temporary = true
  const clone = run("gh", ["repo", "clone", "rj11io/11reports", repo, "--", "--filter=blob:none"])
  if (clone.status !== 0) {
    console.error(`Could not clone 11reports. Set ELEVEN_REPORTS_REPO. Temporary directory preserved: ${repo}`)
    process.exit(clone.status || 1)
  }
}

const cli = path.join(repo, "v0", "www", "scripts", "11reports.mjs")
const result = run(process.execPath, [cli, ...process.argv.slice(2), "--repo", repo], process.cwd())
const importing = process.argv[2] === "import"
if (temporary && result.status === 0 && !importing) await rm(repo, { recursive: true, force: true })
else if (temporary) {
  console.error(`Temporary checkout preserved: ${repo}`)
  if (importing) console.error(`Set ELEVEN_REPORTS_REPO=${repo} before publishing the imported bundle.`)
}
process.exit(result.status ?? 1)
