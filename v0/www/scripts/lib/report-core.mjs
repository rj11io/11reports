import { createHash, randomBytes } from "node:crypto"
import { lstat, readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

export const REPORT_ID_PATTERN = /^[0-9a-hjkmnp-tv-z]{26}$/
export const REPORT_MANIFEST = "manifest.json"
export const CONTENT_RELATIVE = path.join("v0", "www", "content", "reports")

const MAX_BYTES = {
  data: 10 * 1024 * 1024,
  html: 5 * 1024 * 1024,
  markdown: 2 * 1024 * 1024,
}
const MAX_MANIFEST_BYTES = 128 * 1024
const MIME_TYPES = {
  data: "application/json",
  html: "text/html; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
}
const ULID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz"

export function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`
}

export function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

export function computeManifestDigest(manifest) {
  const unsigned = { ...manifest }
  delete unsigned.digest
  return sha256(stableStringify(unsigned))
}

export function createUlid(timestamp = Date.now()) {
  let time = BigInt(timestamp)
  let prefix = ""
  for (let index = 0; index < 10; index += 1) {
    prefix = ULID_ALPHABET[Number(time % 32n)] + prefix
    time /= 32n
  }
  let suffix = ""
  for (const byte of randomBytes(16)) {
    suffix += ULID_ALPHABET[byte & 31]
    if (suffix.length === 16) break
  }
  return `${prefix}${suffix}`
}

export function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
}

export async function artifactMetadata(filePath, kind) {
  const value = await readFile(filePath)
  return {
    path: path.basename(filePath),
    mimeType: MIME_TYPES[kind],
    bytes: value.byteLength,
    sha256: sha256(value),
  }
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message)
}

function assertObjectKeys(value, allowed, label, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return
  for (const key of Object.keys(value)) {
    assert(allowed.includes(key), `Unknown ${label} field: ${key}`, errors)
  }
}

function isHttpsOrigin(value) {
  if (typeof value !== "string") return false
  try {
    const url = new URL(value)
    return (
      url.protocol === "https:" &&
      url.origin === value &&
      url.username === "" &&
      url.password === ""
    )
  } catch {
    return false
  }
}

function isSafeRelativePath(value) {
  if (typeof value !== "string" || value.length === 0 || path.isAbsolute(value))
    return false
  const normalized = path.posix.normalize(value.replaceAll("\\", "/"))
  return (
    normalized !== ".." &&
    !normalized.startsWith("../") &&
    normalized === value.replaceAll("\\", "/")
  )
}

function resourceOrigins(html) {
  const origins = new Set()
  const resourcePattern =
    /<(?:link|img|source|video|audio|iframe)\b[^>]*(?:href|src)=["'](https?:\/\/[^"']+)["'][^>]*>/gi
  for (const match of html.matchAll(resourcePattern)) {
    origins.add(new URL(match[1]).origin)
  }
  return [...origins].sort()
}

export function inspectHtmlNetwork(html) {
  const externalScripts = [
    ...html.matchAll(/<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/gi),
  ].map((match) => match[1])
  return { externalScripts, origins: resourceOrigins(html) }
}

export async function validateBundle(bundlePath, options = {}) {
  const errors = []
  const absoluteBundle = path.resolve(bundlePath)
  const bundleInfo = await lstat(absoluteBundle).catch(() => null)
  assert(
    bundleInfo?.isDirectory(),
    `Bundle is not a directory: ${absoluteBundle}`,
    errors
  )
  assert(
    !bundleInfo?.isSymbolicLink(),
    "Bundle directory cannot be a symlink",
    errors
  )
  if (errors.length) return { ok: false, errors, bundlePath: absoluteBundle }

  const manifestPath = path.join(absoluteBundle, REPORT_MANIFEST)
  let manifest
  try {
    const manifestInfo = await lstat(manifestPath)
    if (!manifestInfo.isFile() || manifestInfo.isSymbolicLink())
      throw new Error("manifest.json must be a regular file")
    if (manifestInfo.size > MAX_MANIFEST_BYTES)
      throw new Error(`manifest.json exceeds ${MAX_MANIFEST_BYTES} bytes`)
    manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  } catch (error) {
    errors.push(`Invalid or missing manifest.json: ${error.message}`)
    return { ok: false, errors, bundlePath: absoluteBundle }
  }

  const keys = Object.keys(manifest)
  const allowedTopLevel = [
    "schemaVersion",
    "id",
    "slug",
    "title",
    "summary",
    "createdAt",
    "tags",
    "source",
    "generator",
    "access",
    "artifacts",
    "digest",
  ]
  for (const key of keys)
    assert(
      allowedTopLevel.includes(key),
      `Unknown manifest field: ${key}`,
      errors
    )
  assert(manifest.schemaVersion === 1, "schemaVersion must be 1", errors)
  assert(
    REPORT_ID_PATTERN.test(manifest.id ?? ""),
    "id must be a lowercase ULID",
    errors
  )
  assert(
    path.basename(absoluteBundle) === manifest.id ||
      options.allowMismatchedDirectory,
    "Bundle directory must match manifest id",
    errors
  )
  assert(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.slug ?? ""),
    "slug must be lowercase kebab-case",
    errors
  )
  assert(
    typeof manifest.title === "string" &&
      manifest.title.length > 0 &&
      manifest.title.length <= 200,
    "title must be 1-200 characters",
    errors
  )
  assert(
    typeof manifest.summary === "string" &&
      manifest.summary.length > 0 &&
      manifest.summary.length <= 500,
    "summary must be 1-500 characters",
    errors
  )
  assert(
    !Number.isNaN(Date.parse(manifest.createdAt)),
    "createdAt must be an ISO date-time",
    errors
  )
  assert(
    Array.isArray(manifest.tags) &&
      manifest.tags.every((tag) => /^[a-z0-9-]+$/.test(tag)),
    "tags must be lowercase kebab-case strings",
    errors
  )
  assert(
    (manifest.tags?.length ?? 0) <= 20,
    "tags must contain at most 20 items",
    errors
  )
  assert(
    new Set(manifest.tags ?? []).size === (manifest.tags?.length ?? 0),
    "tags must be unique",
    errors
  )
  assertObjectKeys(
    manifest.source,
    ["project", "commit", "workflow", "originalPath"],
    "source",
    errors
  )
  assert(
    manifest.source && typeof manifest.source.workflow === "string",
    "source.workflow is required",
    errors
  )
  assertObjectKeys(manifest.generator, ["agent", "skill"], "generator", errors)
  assert(
    manifest.generator &&
      typeof manifest.generator.agent === "string" &&
      typeof manifest.generator.skill === "string",
    "generator.agent and generator.skill are required",
    errors
  )
  assertObjectKeys(manifest.access, ["listing", "indexing"], "access", errors)
  assert(
    ["listed", "unlisted"].includes(manifest.access?.listing),
    "access.listing must be listed or unlisted",
    errors
  )
  assert(
    typeof manifest.access?.indexing === "boolean",
    "access.indexing must be boolean",
    errors
  )
  assert(
    manifest.artifacts &&
      typeof manifest.artifacts === "object" &&
      !Array.isArray(manifest.artifacts),
    "artifacts are required",
    errors
  )
  assert(
    Object.keys(manifest.artifacts ?? {}).length > 0,
    "at least one artifact is required",
    errors
  )

  const expectedFiles = new Set([REPORT_MANIFEST])
  const artifactPaths = new Set()
  for (const [kind, artifact] of Object.entries(manifest.artifacts ?? {})) {
    assert(
      ["data", "markdown", "html"].includes(kind),
      `Unknown artifact kind: ${kind}`,
      errors
    )
    if (!artifact || typeof artifact !== "object") {
      errors.push(`${kind} artifact must be an object`)
      continue
    }
    const allowedArtifactFields = [
      "path",
      "exposure",
      "mimeType",
      "bytes",
      "sha256",
    ]
    if (kind === "html")
      allowedArtifactFields.push("execution", "network", "allowlist")
    assertObjectKeys(
      artifact,
      allowedArtifactFields,
      `${kind} artifact`,
      errors
    )
    assert(
      isSafeRelativePath(artifact.path),
      `${kind}.path must be a normalized relative path`,
      errors
    )
    if (!isSafeRelativePath(artifact.path)) continue
    assert(
      !artifactPaths.has(artifact.path),
      `Artifact path is reused: ${artifact.path}`,
      errors
    )
    artifactPaths.add(artifact.path)
    expectedFiles.add(artifact.path)
    const filePath = path.join(absoluteBundle, artifact.path)
    const fileInfo = await lstat(filePath).catch(() => null)
    assert(
      fileInfo?.isFile(),
      `${kind} artifact is missing or not a file: ${artifact.path}`,
      errors
    )
    assert(
      !fileInfo?.isSymbolicLink(),
      `${kind} artifact cannot be a symlink`,
      errors
    )
    if (!fileInfo?.isFile() || fileInfo?.isSymbolicLink()) continue
    const bytes = await readFile(filePath)
    assert(
      bytes.byteLength <= MAX_BYTES[kind],
      `${kind} exceeds ${MAX_BYTES[kind]} bytes`,
      errors
    )
    assert(
      artifact.bytes === bytes.byteLength,
      `${kind}.bytes does not match file`,
      errors
    )
    assert(
      artifact.sha256 === sha256(bytes),
      `${kind}.sha256 does not match file`,
      errors
    )
    assert(
      artifact.mimeType === MIME_TYPES[kind],
      `${kind}.mimeType must be ${MIME_TYPES[kind]}`,
      errors
    )

    const exposure = {
      data: ["hidden", "view", "download", "view-download"],
      markdown: ["hidden", "source", "render"],
      html: ["archive", "sandbox"],
    }[kind]
    assert(
      exposure.includes(artifact.exposure),
      `${kind}.exposure is invalid`,
      errors
    )

    if (kind === "data") {
      try {
        JSON.parse(bytes.toString("utf8"))
      } catch (error) {
        errors.push(`data artifact is not valid JSON: ${error.message}`)
      }
    }

    if (kind === "html") {
      assert(
        ["static", "scripts"].includes(artifact.execution),
        "html.execution is invalid",
        errors
      )
      assert(
        ["none", "allowlist"].includes(artifact.network),
        "html.network is invalid",
        errors
      )
      assert(
        Array.isArray(artifact.allowlist),
        "html.allowlist must be an array",
        errors
      )
      assert(
        (artifact.allowlist?.length ?? 0) <= 20,
        "html.allowlist must contain at most 20 origins",
        errors
      )
      assert(
        new Set(artifact.allowlist ?? []).size ===
          (artifact.allowlist?.length ?? 0),
        "html.allowlist origins must be unique",
        errors
      )
      for (const origin of artifact.allowlist ?? [])
        assert(
          isHttpsOrigin(origin),
          `html.allowlist must contain HTTPS origins: ${origin}`,
          errors
        )
      const html = bytes.toString("utf8")
      const network = inspectHtmlNetwork(html)
      assert(
        network.externalScripts.length === 0,
        `External scripts are not allowed: ${network.externalScripts.join(", ")}`,
        errors
      )
      assert(!/<iframe\b/i.test(html), "Nested iframes are not allowed", errors)
      const allowlist = new Set(artifact.allowlist ?? [])
      for (const origin of network.origins) {
        assert(
          artifact.network === "allowlist" && allowlist.has(origin),
          `External resource origin is not allowlisted: ${origin}`,
          errors
        )
      }
      if (artifact.network === "none")
        assert(
          (artifact.allowlist ?? []).length === 0,
          "html.allowlist must be empty when network is none",
          errors
        )
    }
  }

  async function walk(directory, relative = "") {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryRelative = path.posix.join(relative, entry.name)
      const entryPath = path.join(directory, entry.name)
      const entryInfo = await lstat(entryPath)
      if (entryInfo.isSymbolicLink())
        errors.push(`Symlinks are not allowed: ${entryRelative}`)
      else if (entry.isDirectory()) await walk(entryPath, entryRelative)
      else if (!entry.isFile())
        errors.push(`Unsupported filesystem entry: ${entryRelative}`)
      else if (!expectedFiles.has(entryRelative))
        errors.push(`Unexpected file: ${entryRelative}`)
    }
  }
  await walk(absoluteBundle)

  const expectedDigest = computeManifestDigest(manifest)
  assert(
    manifest.digest === expectedDigest,
    "digest does not match manifest and artifacts",
    errors
  )
  return {
    ok: errors.length === 0,
    errors,
    bundlePath: absoluteBundle,
    manifest,
  }
}

export async function validateArchive(contentPath) {
  const errors = []
  const reports = []
  const seenSlugs = new Map()
  const entries = await readdir(contentPath, { withFileTypes: true }).catch(
    () => []
  )
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) {
      errors.push(`Unexpected archive entry: ${entry.name}`)
      continue
    }
    const result = await validateBundle(path.join(contentPath, entry.name))
    if (!result.ok)
      errors.push(...result.errors.map((error) => `${entry.name}: ${error}`))
    else {
      const duplicate = seenSlugs.get(result.manifest.slug)
      if (duplicate)
        errors.push(
          `Duplicate slug ${result.manifest.slug}: ${duplicate}, ${entry.name}`
        )
      seenSlugs.set(result.manifest.slug, entry.name)
      reports.push(result.manifest)
    }
  }
  return { ok: errors.length === 0, errors, reports }
}

export async function readBundleArtifacts(bundlePath, manifest) {
  const artifacts = {}
  for (const [kind, artifact] of Object.entries(manifest.artifacts)) {
    artifacts[kind] = await readFile(
      path.join(bundlePath, artifact.path),
      "utf8"
    )
  }
  return artifacts
}

export async function pathExists(value) {
  return Boolean(await stat(value).catch(() => null))
}
