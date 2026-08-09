#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  CONTENT_RELATIVE,
  artifactMetadata,
  computeManifestDigest,
  createUlid,
  inspectHtmlNetwork,
  pathExists,
  slugify,
  validateArchive,
  validateBundle,
} from "./lib/report-core.mjs"

const scriptPath = fileURLToPath(import.meta.url)
const defaultRepo = path.resolve(path.dirname(scriptPath), "..", "..", "..")
const args = process.argv.slice(2)
const command = args.shift()

function parseArgs(values) {
  const positional = []
  const flags = {}
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (!value.startsWith("--")) {
      positional.push(value)
      continue
    }
    const [rawKey, inline] = value.slice(2).split("=", 2)
    const key = rawKey.replace(/-([a-z])/g, (_match, letter) =>
      letter.toUpperCase()
    )
    if (inline !== undefined) flags[key] = inline
    else if (values[index + 1] && !values[index + 1].startsWith("--"))
      flags[key] = values[++index]
    else flags[key] = true
  }
  return { positional, flags }
}

function fail(message, details = [], exitCode = 1) {
  const error = new Error(message)
  error.details = details
  error.exitCode = exitCode
  throw error
}

function print(payload, json = false) {
  if (json) console.log(JSON.stringify(payload, null, 2))
  else if (typeof payload === "string") console.log(payload)
  else {
    for (const [key, value] of Object.entries(payload))
      console.log(`${key}: ${value}`)
  }
}

function runGit(cwd, gitArgs, options = {}) {
  const result = spawnSync("git", gitArgs, {
    cwd,
    encoding: "utf8",
    stdio: options.capture === false ? "inherit" : "pipe",
  })
  if (result.status !== 0 && !options.allowFailure) {
    fail(
      `git ${gitArgs[0]} failed`,
      [result.stderr?.trim(), result.stdout?.trim()].filter(Boolean)
    )
  }
  return result
}

async function resolveRepo(value) {
  return realpath(
    path.resolve(value || process.env.ELEVEN_REPORTS_REPO || defaultRepo)
  )
}

function reportUrl(
  id,
  baseDomain = process.env.ELEVEN_REPORTS_DOMAIN || "reports.rj11.io"
) {
  return `https://${id}.${baseDomain}`
}

function titleFromHtml(html, fallback) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return (match?.[1] ?? fallback)
    .replace(/<[^>]+>/g, "")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .trim()
}

async function discoverSourceArtifacts(sourcePath) {
  const entries = (await readdir(sourcePath, { withFileTypes: true })).filter(
    (entry) => entry.isFile()
  )
  const pickOne = (predicate, label) => {
    const matches = entries.filter((entry) => predicate(entry.name))
    if (matches.length > 1)
      fail(
        `Source contains multiple ${label} files`,
        matches.map((entry) => entry.name)
      )
    return matches[0]?.name
  }
  return {
    data: pickOne((name) => name === "data.json", "data.json"),
    html: pickOne((name) => name.toLowerCase().endsWith(".html"), "HTML"),
    markdown: pickOne((name) => name.toLowerCase().endsWith(".md"), "Markdown"),
  }
}

async function importOne(sourceValue, repo, flags, idOverride) {
  const sourcePath = await realpath(path.resolve(sourceValue))
  const artifacts = await discoverSourceArtifacts(sourcePath)
  if (!artifacts.data && !artifacts.html && !artifacts.markdown)
    fail(`No report artifacts found: ${sourcePath}`)

  const id =
    idOverride ||
    createUlid(flags.createdAt ? Date.parse(flags.createdAt) : Date.now())
  const destination = path.join(repo, CONTENT_RELATIVE, id)
  if (await pathExists(destination)) fail(`Report already exists: ${id}`)

  const html = artifacts.html
    ? await readFile(path.join(sourcePath, artifacts.html), "utf8")
    : ""
  const title = flags.title || titleFromHtml(html, path.basename(sourcePath))
  const createdAt = new Date(flags.createdAt || Date.now()).toISOString()
  const summary =
    flags.summary ||
    `${title}. Archived by 11reports from the original HTML and Markdown report files.`

  const manifest = {
    schemaVersion: 1,
    id,
    slug: flags.slug || slugify(path.basename(sourcePath)),
    title,
    summary,
    createdAt,
    tags: String(flags.tags || "archive")
      .split(",")
      .map((tag) => slugify(tag.trim()))
      .filter(Boolean),
    source: {
      workflow: flags.workflow || "archive-import",
      originalPath: path.basename(sourcePath),
    },
    generator: {
      agent: flags.agent || "11reports",
      skill: flags.skill || "11reports-import-reports",
    },
    access: {
      listing: flags.unlisted ? "unlisted" : "listed",
      indexing: Boolean(flags.indexing),
    },
    artifacts: {},
    digest: "",
  }

  if (flags.dryRun) return { id, title, bundle: destination, dryRun: true }
  await mkdir(destination, { recursive: false })

  try {
    if (artifacts.data) {
      const source = path.join(sourcePath, artifacts.data)
      await cp(source, path.join(destination, artifacts.data), {
        errorOnExist: true,
      })
      manifest.artifacts.data = {
        ...(await artifactMetadata(source, "data")),
        exposure: flags.dataExposure || "hidden",
      }
    }
    if (artifacts.markdown) {
      const source = path.join(sourcePath, artifacts.markdown)
      await cp(source, path.join(destination, artifacts.markdown), {
        errorOnExist: true,
      })
      manifest.artifacts.markdown = {
        ...(await artifactMetadata(source, "markdown")),
        exposure: flags.markdownExposure || "render",
      }
    }
    if (artifacts.html) {
      const source = path.join(sourcePath, artifacts.html)
      await cp(source, path.join(destination, artifacts.html), {
        errorOnExist: true,
      })
      const network = inspectHtmlNetwork(html)
      manifest.artifacts.html = {
        ...(await artifactMetadata(source, "html")),
        exposure: flags.htmlExposure || "sandbox",
        execution: /<script\b/i.test(html) ? "scripts" : "static",
        network: network.origins.length ? "allowlist" : "none",
        allowlist: network.origins,
      }
    }
    manifest.digest = computeManifestDigest(manifest)
    await writeFile(
      path.join(destination, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      {
        flag: "wx",
      }
    )
    const validation = await validateBundle(destination)
    if (!validation.ok)
      fail(`Imported report failed validation: ${id}`, validation.errors)
  } catch (error) {
    await rm(destination, { recursive: true, force: true })
    throw error
  }

  return { id, title, bundle: destination, digest: manifest.digest }
}

async function validateCommand(positional, flags) {
  const repo = await resolveRepo(flags.repo)
  const target = positional[0]
  const result = target
    ? await validateBundle(path.resolve(target), {
        allowMismatchedDirectory: Boolean(flags.allowMismatchedDirectory),
      })
    : await validateArchive(path.join(repo, CONTENT_RELATIVE))
  if (!result.ok) fail("Validation failed", result.errors)
  print(
    { status: "valid", reports: result.reports?.length ?? 1 },
    Boolean(flags.json)
  )
}

async function importCommand(positional, flags) {
  if (!positional.length)
    fail("Usage: 11reports import <directory> [directory...] [--repo <path>]")
  if (flags.id && positional.length > 1)
    fail("--id can only be used with one source directory")
  const repo = await resolveRepo(flags.repo)
  const results = []
  for (const [index, source] of positional.entries()) {
    results.push(
      await importOne(source, repo, flags, index === 0 ? flags.id : undefined)
    )
  }
  print(
    flags.json
      ? { status: flags.dryRun ? "dry_run" : "imported", reports: results }
      : results
          .map((result) => `${result.id}  ${result.title}\n${result.bundle}`)
          .join("\n\n"),
    Boolean(flags.json)
  )
}

async function headReceipt(url) {
  const response = await fetch(url, { method: "HEAD", redirect: "manual" })
  return {
    status: response.status,
    id: response.headers.get("x-11reports-id"),
    digest: response.headers.get("x-11reports-digest"),
    commit: response.headers.get("x-11reports-commit"),
  }
}

async function verifyReceipt(id, expected, flags = {}) {
  const url = flags.url || reportUrl(id)
  const timeoutMs = Number(flags.timeout || 300) * 1000
  const intervalMs = Number(flags.interval || 5) * 1000
  const deadline = Date.now() + timeoutMs
  let receipt
  do {
    try {
      receipt = await headReceipt(url)
      if (
        receipt.status === 200 &&
        receipt.id === id &&
        (!expected.digest || receipt.digest === expected.digest) &&
        (!expected.commit || receipt.commit === expected.commit)
      ) {
        return { verified: true, url, ...receipt }
      }
    } catch (error) {
      receipt = { error: error.message }
    }
    if (Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
  } while (Date.now() < deadline)
  return { verified: false, url, ...receipt }
}

async function verifyCommand(positional, flags) {
  const id = positional[0]
  if (!id)
    fail("Usage: 11reports verify <id> [--digest <sha256>] [--commit <sha>]")
  const result = await verifyReceipt(
    id,
    { digest: flags.digest, commit: flags.commit },
    flags
  )
  if (!result.verified)
    fail("Deployment verification failed", [JSON.stringify(result)])
  print(
    flags.json
      ? result
      : { status: "verified", url: result.url, commit: result.commit },
    Boolean(flags.json)
  )
}

async function publishCommand(positional, flags) {
  const bundleValue = positional[0]
  if (!bundleValue)
    fail("Usage: 11reports publish <bundle> [--repo <path>] [--dry-run]")
  const sourceBundle = await realpath(path.resolve(bundleValue))
  const validation = await validateBundle(sourceBundle, {
    allowMismatchedDirectory: true,
  })
  if (!validation.ok) fail("Bundle validation failed", validation.errors)

  const repo = await resolveRepo(flags.repo)
  const gitRoot = runGit(repo, ["rev-parse", "--show-toplevel"]).stdout.trim()
  if (path.resolve(gitRoot) !== path.resolve(repo))
    fail("--repo must point to the Git repository root")
  runGit(repo, ["remote", "get-url", "origin"])
  runGit(repo, ["fetch", "origin", "main"])

  const worktree = await mkdtemp(path.join(os.tmpdir(), "11reports-publish-"))
  let pushed = false
  try {
    runGit(repo, ["worktree", "add", "--detach", worktree, "origin/main"])
    const destination = path.join(
      worktree,
      CONTENT_RELATIVE,
      validation.manifest.id
    )
    if (await pathExists(destination))
      fail(`Report already exists on origin/main: ${validation.manifest.id}`)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(sourceBundle, destination, { recursive: true, errorOnExist: true })
    const copied = await validateBundle(destination)
    if (!copied.ok) fail("Copied bundle failed validation", copied.errors)

    const relativeDestination = path.join(
      CONTENT_RELATIVE,
      validation.manifest.id
    )
    runGit(worktree, ["add", "--", relativeDestination])
    const changed = runGit(
      worktree,
      ["diff", "--cached", "--quiet", "--", relativeDestination],
      { allowFailure: true }
    )
    if (changed.status === 0) fail("Publishing produced no changes")
    runGit(worktree, [
      "commit",
      "-m",
      `feat(reports): archive ${validation.manifest.slug}`,
    ])

    if (flags.dryRun) {
      print(
        {
          status: "dry_run",
          id: validation.manifest.id,
          worktree,
          digest: validation.manifest.digest,
        },
        Boolean(flags.json)
      )
      runGit(repo, ["worktree", "remove", "--force", worktree])
      return
    }

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      runGit(worktree, ["fetch", "origin", "main"])
      const rebase = runGit(worktree, ["rebase", "origin/main"], {
        allowFailure: true,
      })
      if (rebase.status !== 0) {
        runGit(worktree, ["rebase", "--abort"], { allowFailure: true })
        fail("Publication rebase conflicted; worktree preserved", [worktree])
      }
      const push = runGit(worktree, ["push", "origin", "HEAD:main"], {
        allowFailure: true,
      })
      if (push.status === 0) {
        pushed = true
        break
      }
      if (attempt === 3)
        fail("Push failed after 3 attempts; worktree preserved", [worktree])
    }

    const commit = runGit(worktree, ["rev-parse", "HEAD"]).stdout.trim()
    const receipt = await verifyReceipt(
      validation.manifest.id,
      { digest: validation.manifest.digest, commit },
      flags
    )
    if (!receipt.verified) {
      print(
        {
          status: "deployment_pending",
          id: validation.manifest.id,
          url: receipt.url,
          digest: validation.manifest.digest,
          commit,
          worktree,
        },
        Boolean(flags.json)
      )
      process.exitCode = 2
      return
    }

    runGit(repo, ["worktree", "remove", "--force", worktree])
    print(
      {
        status: "published",
        id: validation.manifest.id,
        url: receipt.url,
        digest: validation.manifest.digest,
        commit,
      },
      Boolean(flags.json)
    )
  } catch (error) {
    error.details = [
      ...(error.details ?? []),
      `worktree: ${worktree}`,
      `pushed: ${pushed}`,
    ]
    throw error
  }
}

function usage() {
  return `11reports\n\nCommands:\n  validate [bundle] [--repo PATH] [--json]\n  import <directory...> [--repo PATH] [--dry-run] [--json]\n  publish <bundle> [--repo PATH] [--dry-run] [--json]\n  verify <id> [--digest SHA256] [--commit SHA] [--json]`
}

try {
  const { positional, flags } = parseArgs(args)
  if (command === "validate") await validateCommand(positional, flags)
  else if (command === "import") await importCommand(positional, flags)
  else if (command === "publish") await publishCommand(positional, flags)
  else if (command === "verify") await verifyCommand(positional, flags)
  else if (command === "help" || command === "--help" || !command)
    print(usage())
  else fail(`Unknown command: ${command}`, [usage()])
} catch (error) {
  console.error(error.message)
  for (const detail of error.details ?? [])
    if (detail) console.error(`  ${detail}`)
  process.exit(error.exitCode ?? 1)
}
