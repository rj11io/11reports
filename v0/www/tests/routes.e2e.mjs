import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import http from "node:http"
import path from "node:path"
import { after, before, test } from "node:test"

const appRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  ".."
)
const port = 32_111
const id = "01kz3dkwm0p6rdpsnfzrb0qx9c"
const digest =
  "sha256:cd199531ac4e205a8d612295fef4ff0956c73dbcdaa3467e1a48da28e23e859f"
let server
let output = ""

function request({
  host = "reports.rj11.io",
  pathname = "/",
  method = "GET",
} = {}) {
  return new Promise((resolve, reject) => {
    const call = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: pathname,
        method,
        headers: { Host: host },
      },
      (response) => {
        const chunks = []
        response.on("data", (chunk) => chunks.push(chunk))
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          })
        )
      }
    )
    call.on("error", reject)
    call.end()
  })
}

before(async () => {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: appRoot,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  )
  server.stdout.on("data", (chunk) => (output += chunk))
  server.stderr.on("data", (chunk) => (output += chunk))

  const deadline = Date.now() + 10_000
  while (!output.includes("Ready") && Date.now() < deadline) {
    if (server.exitCode !== null)
      throw new Error(`Server exited early:\n${output}`)
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (!output.includes("Ready"))
    throw new Error(`Server did not start:\n${output}`)
})

after(() => {
  server?.kill("SIGTERM")
})

test("catalog and known report shell resolve", async () => {
  const catalog = await request()
  assert.equal(catalog.status, 200)
  assert.match(catalog.body, /Reports worth keeping/)

  const shell = await request({ host: `${id}.reports.rj11.io` })
  assert.equal(shell.status, 200)
  assert.match(shell.body, /The 10 Biggest Cybersecurity Stories Right Now/)
  assert.match(shell.body, /Open original HTML/)
})

test("HEAD receipt contains exact report identity", async () => {
  const receipt = await request({
    host: `${id}.reports.rj11.io`,
    method: "HEAD",
  })
  assert.equal(receipt.status, 200)
  assert.equal(receipt.headers["x-11reports-id"], id)
  assert.equal(receipt.headers["x-11reports-digest"], digest)
  assert.equal(receipt.headers["x-11reports-commit"], "local")
})

test("sandbox content is isolated and bridge-enabled", async () => {
  const content = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/_content?bridge=0123456789abcdef0123456789abcdef",
  })
  assert.equal(content.status, 200)
  assert.match(
    content.headers["content-security-policy"],
    /sandbox allow-scripts/
  )
  assert.match(content.headers["content-security-policy"], /connect-src 'none'/)
  assert.doesNotMatch(
    content.headers["content-security-policy"],
    /allow-same-origin/
  )
  assert.match(content.body, /11reports:resize/)
  assert.match(content.body, /The 10 Biggest Cybersecurity Stories Right Now/)
})

test("standalone HTML keeps isolation without injecting the bridge", async () => {
  const content = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/_content?standalone=1",
  })
  assert.equal(content.status, 200)
  assert.equal(content.headers["x-11reports-content-mode"], "standalone")
  assert.match(content.headers["content-disposition"], /inline/)
  assert.match(
    content.headers["content-security-policy"],
    /sandbox allow-scripts/
  )
  assert.match(content.headers["content-security-policy"], /script-src 'none'/)
  assert.doesNotMatch(content.body, /11reports:resize/)
  assert.match(content.body, /The 10 Biggest Cybersecurity Stories Right Now/)
})

test("exposure and internal-route controls hold", async () => {
  const html = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/_download/html",
  })
  assert.equal(html.status, 200)
  assert.match(html.headers["content-disposition"], /attachment/)
  assert.match(html.body, /The 10 Biggest Cybersecurity Stories Right Now/)

  const hiddenData = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/_download/data",
  })
  assert.equal(hiddenData.status, 404)

  const markdown = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/_download/markdown",
  })
  assert.equal(markdown.status, 200)
  assert.match(markdown.headers["content-disposition"], /attachment/)

  const internal = await request({ pathname: `/_reports/${id}` })
  assert.equal(internal.status, 404)
})

test("unknown and reserved wildcard hosts return 404", async () => {
  assert.equal(
    (await request({ host: "01j00000000000000000000000.reports.rj11.io" }))
      .status,
    404
  )
  assert.equal((await request({ host: "status.reports.rj11.io" })).status, 404)
})

test("share image is available on report hosts", async () => {
  const image = await request({
    host: `${id}.reports.rj11.io`,
    pathname: "/og.png",
  })
  assert.equal(image.status, 200)
  assert.equal(image.headers["content-type"], "image/png")
})
