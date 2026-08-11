<!-- 11archive-source: README.md -->

# Harness Internals: the home directory you never look at

What a modern AI coding harness writes to your disk, where it puts it, and which
of those files you were never told about.

A "harness" is the program that wraps a language model and lets it act: it reads
your files, runs your commands, and keeps the conversation going. Claude Code and
OpenAI Codex CLI are both harnesses. This report opens them up.

## The short version

Two harnesses on one working laptop had written **4.0 GB** into their home
directories. The published documentation accounts for roughly a dozen of those
files. The rest is machine-written state that no menu shows you: full
conversation transcripts, copies of your files from before you edited them,
snapshots of your shell, a 395 MB debug database, cached experiment flags, and
839 MB of abandoned git worktrees that normal cleanup commands cannot reach.

None of it is hidden on purpose. All of it is invisible in practice.

## Read in this order

| File | What it covers |
| --- | --- |
| 00-executive-brief.md | The findings, the numbers, and what to do. Start here. |
| 01-harness-anatomy.md | What a harness actually is, and why it must write to disk at all. |
| 02-home-directory-map.md | Complete map of `~/.claude` and `~/.codex`, entry by entry. |
| 03-invisible-files-catalog.md | The catalog: every file class, what it holds, who wrote it, how long it stays. |
| 04-privacy-and-security.md | Secrets in transcripts, credential storage, hooks as an attack path, telemetry. |
| 05-disk-growth-and-retention.md | Measured growth, retention rules, and what is safe to delete. |
| 06-operator-playbook.md | Settings, commands, and checks. The actionable chapter. |
| 07-glossary.md | Every term used here, in plain words. |
| 08-methodology-and-sources.md | How this was measured, what is uncertain, and every source. |

`data.json` holds the measurements in machine-readable form.
`report.html` is the self-contained interactive version.

## How to read the evidence labels

Every claim in this report carries one of three labels:

- **MEASURED** means it was read off a real machine on 2026-08-11. Numbers are
  from that one machine and will differ on yours.
- **DOCUMENTED** means a vendor's own documentation says so.
- **REPORTED** means a third party published it. Treated as weaker.

## Scope and honesty

One machine, macOS 24.3, heavy daily use of both tools. One sample is enough to
prove a file class exists. It is not enough to prove your machine looks the same.
Chapter 8 lists exactly what that limits.

Paths are shown as `~` or `<project>`. No credentials, tokens, account
identifiers, or file contents from the sampled machine appear anywhere in this
report.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The finding

Two AI coding tools on one working laptop had written **4.0 GB** into their home
directories. Their documentation describes about a dozen files. Everything else
is state the program writes for itself.

That gap is the subject of this report.

MEASURED, 2026-08-11, one macOS machine:

| | Claude Code (`~/.claude`) | Codex CLI (`~/.codex`) |
| --- | --- | --- |
| Total on disk | 352 MB | 3.68 GB |
| Conversation transcripts | 325 MB across 207 files | 1.37 GB across 453 files |
| Largest single transcript | 15.1 MB | 131 MB |
| Oldest transcript kept | 30 days | since 2026-02-19 (6 months) |
| Documented entries | ~14 | ~4 |
| Entries actually present | 26 | 63 |

## Six things worth knowing

**1. Your conversations are plain text on disk, forever or nearly so.**
Every prompt you typed, every file the agent read, and every command it ran is
written line by line to a `.jsonl` file. Claude Code deletes these after 30 days
by default. Codex keeps them indefinitely: the sampled machine still held
transcripts from six months back. One Codex transcript had grown to 131 MB.

**2. `.gitignore` does not protect you.**
This is the single most misunderstood point. `.gitignore` stops a file from being
committed. It does nothing to stop the agent from *reading* that file and writing
its contents into the transcript. If the agent reads your `.env` once, your keys
are in plain text in your home directory. REPORTED: live API keys have been found
sitting in `~/.claude/projects/` this way ([agentfluent issue
#72](https://github.com/frederick-douglas-pearce/agentfluent/issues/72)).

**3. The two tools store credentials very differently.**
MEASURED: Claude Code keeps its login token in the macOS Keychain, which is
encrypted and needs your password to read. Codex writes an OAuth token set to
`~/.codex/auth.json` as readable JSON. File permissions are `0600`, so only your
user can open it. That protects against other users on the machine. It does not
protect against anything running *as you*, which is exactly what a bad npm
package does.

**4. Disk growth is mostly waste, not data.**
MEASURED: `~/.codex/logs_2.sqlite` is a 395 MB debug log database. 326 MB of that
(82%) is free space inside the file, left behind by deleted rows that SQLite
never gave back. The live content is about 47 MB. A single `VACUUM` reclaims it.

**5. Some files cannot be cleaned by normal means.**
MEASURED: `~/.codex/worktrees/` held 839 MB. It contained one checkout of one
project. That checkout was orphaned: the parent repository had been moved to a
new path, so git no longer recognised the worktree and `git worktree prune` could
not remove it. Separately, `~/.claude/session-env/` held 851 directories. All 851
were empty.

**6. A file in your repo can run code when you start a session.**
`.claude/settings.json` can define a `SessionStart` hook, which is a shell
command the harness runs automatically. REPORTED: the ChainDrop npm worm did
exactly this, planting a hook in compromised repositories so that opening the
project in Claude Code executed the attacker's code ([Pillar
Security](https://www.pillar.security/blog/chaindrop-when-opening-a-repository-becomes-execution),
[Microsoft Security
Blog](https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/)).
The same campaign specifically hunted for Anthropic, Codex, Cursor, and Gemini
credential files.

## What surprised us

The harness knows more about your machine than the transcript suggests.

MEASURED, from `~/.claude.json` (95.5 KB, one file):

- 43 projects tracked, each with its own cost, token counts, and timing history
- 487 cached feature flags, which are remote switches that change how the tool
  behaves without an update
- a stable 64-character machine identifier
- your account email, organisation name, role, and billing tier
- for each project, a sample of filenames taken from your repository

MEASURED, from `~/.codex/config.toml`: every directory you have ever marked as
trusted, listed by full path, kept permanently. That list is a readable map of
your filesystem and your client work.

MEASURED, from `~/.codex/memories_1.sqlite`: a background job queue that reads
your finished sessions and distils them into stored summaries. It runs on its own
schedule, in two stages, with retries. Nothing in the interface announces it.

## What to do

Ranked by benefit against effort. Full detail in
06-operator-playbook.md.

| Action | Why | Effort |
| --- | --- | --- |
| Never let the agent read a real secret file | It lands in the transcript permanently, and `.gitignore` will not stop it | free |
| Add `.claude/` and `.codex/` to your global gitignore | Stops local agent state reaching a shared repo | 1 min |
| Review any `.claude/settings.json` that arrives from outside | A hook in it runs on session start | per repo |
| `VACUUM` the Codex log database | Reclaimed 326 MB on the sampled machine | 1 min |
| Delete orphaned worktrees by hand | `git worktree prune` cannot see them | 5 min |
| Set `cleanupPeriodDays` deliberately | Default is 30. Codex has no equivalent default. | 1 min |

One trap worth stating plainly. In Claude Code, `cleanupPeriodDays: 0` reads like
"never clean up". It does the opposite: it stops transcripts being written at all
([claude-code issue
#23710](https://github.com/anthropics/claude-code/issues/23710)). If you want to
keep everything, set a large number, not zero.

## The one-line version

These tools are not doing anything sneaky. They are doing ordinary engineering
things, which happen to include writing your entire working life to plain text in
a folder you never open.

---

<!-- 11archive-source: 01-harness-anatomy.md -->

# What a harness is, and why it writes to your disk

## Start with the problem

A language model has no memory and no hands. Ask it a question, it answers, and
it forgets. It cannot open a file or run a test.

A **harness** is the program that fixes both. It holds the conversation, gives
the model tools, and runs the tools when the model asks. Claude Code and Codex
CLI are harnesses. So are Cursor's agent and Gemini CLI.

Think of it like a chef and a kitchen porter. The model is the chef: it decides
what to do next. The harness is the porter: it fetches ingredients, carries
dishes, and keeps a written record of every order. The chef never touches the
storeroom directly.

Everything in this report follows from what the porter has to write down.

## The loop

Every harness runs the same loop:

1. **Assemble.** Build the message list to send: system instructions, your
   project's `CLAUDE.md` or `AGENTS.md`, the conversation so far, tool
   definitions.
2. **Call.** Send it to the model. Stream the reply back token by token.
3. **Act.** If the model asked for a tool, run it. Read the file, run the
   command, search the web.
4. **Feed back.** Put the tool's output into the conversation as a new message.
5. **Repeat** until the model stops asking for tools.

Steps 1 and 4 are where the disk usage comes from. To assemble step 1 next turn,
the harness must have kept everything from step 4 this turn.

## Five jobs that force a write

### Job 1: survive a crash

If your terminal dies mid-task, the work should not vanish. So the harness writes
the conversation to disk **as it happens**, not at the end.

MEASURED: both tools use JSONL, which is one JSON object per line. Appending a
line is a single atomic write, so a crash costs you at most the last line. This
is a good design choice. It is also why the file only ever grows.

Codex calls these files **rollouts**. Claude Code calls them **transcripts**.
Same idea.

### Job 2: know which conversation belongs to which folder

You run the agent in many projects. Resuming should give you the right history.

Both tools solve this by keying storage on the working directory.

Claude Code turns the path into a folder name by replacing every `/` with `-`:

```
~/Desktop/work/api   ->   ~/.claude/projects/-Users-you-Desktop-work-api/
```

Codex keeps a SQLite database (`state_5.sqlite`) with a `threads` table, and
stores `cwd` as a column.

MEASURED consequence: neither approach survives you moving a repository. The old
folder or row stays behind pointing at a path that no longer exists. On the
sampled machine both tools held entries for a directory that had been renamed
months earlier.

### Job 3: undo

If the agent edits a file badly, you want the old version back.

MEASURED: Claude Code writes a copy of each file *before* editing it into
`~/.claude/file-history/<session-id>/<content-hash>@v<n>`. The `@v3` suffix means
this is the third saved version of that file in that session.

This is a shadow copy of your source code, outside your repository, not covered
by your `.gitignore`.

### Job 4: run commands the way you would

When the agent runs `npm test`, that should work even though `npm` is only on
your `PATH` because of something in your `.zshrc`.

MEASURED: Claude Code solves this by capturing your shell once per session into
`~/.claude/shell-snapshots/snapshot-zsh-<timestamp>-<random>.sh`, then sourcing
that file before each command. A sampled snapshot was 4,501 lines and contained
127 shell functions, 4 aliases, and the `PATH` export.

Worth being precise, because this is often overstated: the snapshot captured
functions, aliases, shell options, and `PATH`. It did **not** dump the full
environment. Only one `export` line was present. So a snapshot is not
automatically a secret leak, though a function body could contain one if yours do.

### Job 5: do not ask the same question twice

Whether you trust a folder, which tools you allowed, which model you picked: all
of that should stick.

MEASURED: Claude Code puts this in `~/.claude.json`. Codex puts trust in
`~/.codex/config.toml` under `[projects."<path>"]`. Both accumulate one entry per
directory, permanently.

## Where the two tools diverge

Same five jobs, two very different engineering cultures.

| | Claude Code | Codex CLI |
| --- | --- | --- |
| Written in | TypeScript on Node | Rust |
| Conversation store | one JSONL per session in a per-project folder | one JSONL per session in a date tree, indexed by SQLite |
| Structured state | one large JSON file (`~/.claude.json`) | four SQLite databases |
| Debug logs | not kept by default | 395 MB SQLite database |
| Credentials | macOS Keychain | `auth.json`, plain JSON, `0600` |
| Transcript retention | 30 days by default | indefinite |
| Background work | none observed | job queue distilling sessions into memories |

The Rust side reaches for databases and background workers. The Node side reaches
for files and folders. Neither is wrong. They fail differently, which
05-disk-growth-and-retention.md covers.

## The layering rule

Both tools read settings from several places and merge them. Closest to the code
wins.

Claude Code, weakest to strongest:

```
managed policy  <  ~/.claude/settings.json  <  <project>/.claude/settings.json
                <  <project>/.claude/settings.local.json  <  command-line flags
```

Codex, weakest to strongest:

```
~/.codex/config.toml  <  <project>/.codex/config.toml  <  --config flags
```

DOCUMENTED, and important: Codex only reads a project's `config.toml` if you have
marked that project as trusted, and some keys cannot be set from a project at all.
Provider, authentication, notification, and telemetry settings must live in your
user config ([Codex configuration
reference](https://learn.chatgpt.com/docs/config-file/config-reference)).

That restriction exists for a good reason. Without it, cloning a repository would
let its author redirect your telemetry or change your model provider. Claude
Code's equivalent protection is the trust dialog you see the first time you open
a folder, recorded as `hasTrustDialogAccepted` in `~/.claude.json`.

## The idea to carry forward

Nothing above is a hidden feature. Every write serves an obvious purpose: crash
recovery, resume, undo, correct command execution, remembered preferences.

The problem is not that these files exist. It is that they persist far longer
than the task that created them, they contain far more than the task needed, and
no part of the interface ever mentions them.

Next: 02-home-directory-map.md walks both directories
entry by entry.

---

<!-- 11archive-source: 02-home-directory-map.md -->

# The home directory map

Complete inventory of both home directories, MEASURED on one macOS machine on
2026-08-11 after heavy daily use of both tools.

Read the **Told?** column first. It answers: does any official documentation, menu,
or command mention this file to a normal user?

- **yes** = documented and user-facing
- **partly** = documented, but not somewhere you would look
- **no** = you would only find it by running `ls`

## `~/.claude`, 352 MB, 26 entries

### Things you are meant to edit

| Entry | Type | What it is | Told? |
| --- | --- | --- | --- |
| `settings.json` | file, `0600` | Your config: model, hooks, permissions, environment variables. | yes |
| `CLAUDE.md` | file | Instructions loaded into every session, everywhere. | yes |
| `hooks/` | dir | Your own scripts, fired at session start, before tool use, and so on. | yes |
| `skills/`, `agents/`, `commands/`, `rules/`, `workflows/` | dirs | Reusable prompts and sub-agent definitions. | yes |
| `plugins/` | dir, 16 MB | Installed plugin bundles and their marketplace metadata. | yes |
| `keybindings.json`, `themes/` | file, dir | Appearance and key bindings. | yes |

These are the documented surface. The official page describing them is
[Explore the .claude directory](https://code.claude.com/docs/en/claude-directory).

### Things the program writes for itself

| Entry | Type | What it is | Told? |
| --- | --- | --- | --- |
| `projects/` | dir, `0700`, **325 MB** | Full conversation transcripts. One folder per project, one `.jsonl` per session. The biggest thing in the directory by far. | partly |
| `file-history/` | dir | Copies of your files taken **before** each edit. Path is `<session-id>/<content-hash>@v<n>`. | partly |
| `shell-snapshots/` | dir | Your shell captured as a script so tool commands behave like your terminal. | no |
| `history.jsonl` | file, `0600` | Every prompt you typed, with the project it belonged to. Has a `pastedContents` field, so text you pasted into the prompt is stored too. | no |
| `session-env/` | dir | Per-session scratch. **All 851 directories were empty.** | no |
| `sessions/` | dir | One small JSON per running process, keyed by process id. Live-session bookkeeping. | no |
| `tasks/` | dir | Background task and sub-agent state, keyed by task id. | no |
| `telemetry/` | dir | Usage events that **failed to upload**, queued on disk for retry. Named `1p_failed_events.*.json`, but the contents are JSONL. | no |
| `backups/` | dir | Rolling copies of `~/.claude.json`, named with a millisecond timestamp. | no |
| `daemon/` | dir, `0700` | `control.key` plus a `dispatch` folder. Local control channel for the background daemon. | no |
| `plans/` | dir | Plans written in plan mode, saved as Markdown with generated names. | no |
| `cache/` | dir | Fetched changelog, your closed GitHub issues. | no |
| `jobs/`, `scheduled-tasks/` | dirs | Recurring task definitions and pinned jobs. | partly |
| `paste-cache/`, `downloads/` | dirs | Empty on the sampled machine. | no |
| `mcp-needs-auth-cache.json` | file | Which connected tool servers still need you to log in. | no |
| `policy-limits.json` | file, `0600` | Server-pushed restrictions. Keys include `restrictions`, `compliance_taints`, and `monitoring_notice`. | no |
| `remote-settings.json` | file, `0600` | Settings pushed from the server side. | no |
| `.last-cleanup` | file | Timestamp of the last transcript cleanup run. | no |
| `.last-update-result.json` | file | Outcome of the last self-update. | no |

Note `projects/<slug>/memory/`. That is where per-project agent memory lives, as
Markdown with a `MEMORY.md` index. DOCUMENTED, but easy to miss: it sits inside
the transcript folder, not with your other configuration.

Also note `projects/<slug>/<session>/tool-results/`. When a tool returns more
output than fits in context, the harness spills the full result to a text file
there and keeps only a preview in the conversation. Those spill files hold
whatever the tool returned, at full length.

### One level up

| Entry | Type | What it is |
| --- | --- | --- |
| `~/.claude.json` | file, `0600`, 95.5 KB | The real state file. Details below. |
| `~/.claude.json.backup` | file, `0600` | Previous copy. |

`~/.claude.json` held, MEASURED:

- 43 projects, each with `lastCost`, token counts, timing, allowed tools, trust
  status, and `exampleFiles` (a sample of filenames read from your repository)
- 487 entries under `cachedGrowthBookFeatures`. These are remote feature switches
  that change behaviour without an update.
- `machineID`, a stable 64-character identifier for this computer
- `oauthAccount`: your email, display name, organisation name, organisation role,
  billing type, and rate limit tier
- `numStartups`, `skillUsage`, `pluginUsage`, and a set of counters for which
  tips and announcements you have already seen

The `exampleFiles` field deserves a second look. Filenames alone can carry real
information: client names, unreleased product names, acquisition code names.

## `~/.codex`, 3.68 GB, 63 entries

### Things you are meant to edit

| Entry | Type | What it is | Told? |
| --- | --- | --- | --- |
| `config.toml` | file, `0600` | All configuration. Also holds one `[projects."<path>"]` block per directory you have ever trusted. | yes |
| `AGENTS.md` | file | Global instructions, same role as `CLAUDE.md`. | yes |
| `skills/`, `rules/`, `plugins/` | dirs | Reusable prompts and extensions. `plugins/` was 308 MB. | partly |
| `automations/` | dir | Saved recurring jobs, one folder each. | partly |

### The four databases

Codex keeps structured state in SQLite rather than JSON. This is the biggest
difference from Claude Code.

| File | Size | Tables | What it holds |
| --- | --- | --- | --- |
| `state_5.sqlite` | 12 MB | `threads`, `thread_sections`, `thread_spawn_edges`, `thread_dynamic_tools`, `remote_control_enrollments`, `external_agent_config_imports` | The session index. **455 threads.** Each row carries `cwd`, `git_sha`, `git_branch`, `git_origin_url`, `sandbox_policy`, `approval_mode`, `tokens_used`, `first_user_message`, and `preview`. |
| `logs_2.sqlite` | 395 MB | `logs` | Debug logs. **43,830 rows** covering 2026-08-02 to 2026-08-11. The body column is named `feedback_log_body`. |
| `memories_1.sqlite` | 40 KB | `stage1_outputs`, `jobs` | A background pipeline that distils finished sessions into summaries. Has leases, retries, and watermarks. |
| `goals_1.sqlite` | 32 KB | `thread_goals`, `thread_goal_continuation_deferrals` | Long-running objectives with token budgets and status such as `usage_limited`. |

Each has `-wal` and `-shm` companion files, which are SQLite's write-ahead log.
Those can be large on their own: the log database's `-wal` was 6.1 MB.

Two details from `state_5.sqlite` worth naming. `git_origin_url` means the
database holds a list of every repository remote you have worked on. And the
`threads` table has grown by schema migration over time, with 46 migrations
recorded, so newer columns such as `agent_nickname`, `memory_mode`, and
`reasoning_effort` sit appended at the end of the table definition.

### Everything else

| Entry | Size | What it is | Told? |
| --- | --- | --- | --- |
| `sessions/` | **1.37 GB** | Transcripts, called rollouts. Tree is `sessions/YYYY/MM/DD/rollout-<iso>-<uuid>.jsonl`. **453 files**, oldest 2026-02-19. | partly |
| `worktrees/` | **839 MB** | Separate git checkouts made for background agents. One project. Orphaned. | no |
| `.tmp/` | **241 MB** | Plugin sync scratch: `plugins-backup-<random>`, `plugins-clone-<random>`, a lock file, a `.sha`. Not cleaned after a successful sync. | no |
| `packages/` | 307 MB | Downloaded runtime dependencies. | no |
| `generated_images/` | 121 MB | 98 images the agent produced. | no |
| `computer-use/` | 63 MB | A complete macOS application bundle, `Codex Computer Use.app`, plus its config. Downloaded into your home directory. | no |
| `cache/` | 16 MB | Assorted caches. | no |
| `vendor_imports/` | 8.6 MB | Curated skills pulled from vendors, plus a cache index. | no |
| `sqlite/` | 8.2 MB | Additional database files. | no |
| `archived_sessions/` | 1.3 MB | Threads you archived. Archived means hidden from the list, not deleted. | partly |
| `shell_snapshots/` | 968 KB | Same idea as Claude Code's. | no |
| `.codex-global-state.json` + `.bak` | 859 KB each | Large global state blob. | no |
| `attachments/` | | Files you attached, one folder per attachment id. | no |
| `browser/sessions/` | | One TOML file per browser session the agent drove. | no |
| `dictation-history/` | `0700` | Voice input history, keyed by SHA-256, with `metadata.json`. | no |
| `transcription-history.jsonl` | `0600` | Speech-to-text results. | no |
| `models_cache.json` | 197 KB | Cached model catalogue. | no |
| `session_index.jsonl` | 60 KB | Flat index of thread id, name, and update time. | no |
| `thread-writer-locks/` | | One `.lock` per thread, to stop two processes writing the same rollout. | no |
| `ipc/ipc.sock` | `0700` | Unix socket for talking to the background app server. | no |
| `process_manager/chat_processes.json` | | Long-running processes the agent started. | no |
| `node_repl/active_execs` | | Live Node evaluation state. | no |
| `auth.json` | `0600` | OAuth `id_token`, `access_token`, `refresh_token`, `account_id`. Plain JSON. | partly |
| `installation_id`, `version.json` | | Stable install identifier and version record. | no |
| `history.jsonl` | `0600` | Prompt history. | partly |
| `visualizations/`, `pets/`, `memories/`, `log/`, `tmp/`, `node_repl/` | | Present. Several empty. | no |

### The leftovers nobody cleans

MEASURED, at the top of `~/.codex`:

```
..codex-global-state.json.tmp-1784249643052-4eb359ed-...    0 bytes
..codex-global-state.json.tmp-1784279083024-9c6d4897-...    512 KB
... 9 more, dated July 17 to August 7
```

Eleven abandoned temporary files from an interrupted atomic-write pattern. The
pattern itself is correct: write to a temp file, then rename over the real one.
When the process dies between those two steps, the temp file stays. Nothing
sweeps them up.

Alongside them sit marker files that record one-time migrations:
`.personality_migration`, `.sandbox_migration`, `.app-server-state-reconciled-v1`.
Each holds a few bytes. Each is permanent.

## The gap, stated plainly

| | Documented entries | Entries present | Documented share |
| --- | --- | --- | --- |
| `~/.claude` | ~14 | 26 | 54% |
| `~/.codex` | ~4 | 63 | 6% |

And by size, the ratio is worse than the count suggests. In `~/.codex`, the four
documented entries account for well under 1% of the 3.68 GB. The undocumented
`sessions/`, `worktrees/`, `.tmp/`, `packages/`, and `logs_2.sqlite` account for
about 87%.

Next: 03-invisible-files-catalog.md groups these
by what they actually contain.

---

<!-- 11archive-source: 03-invisible-files-catalog.md -->

# The invisible files, by what they contain

Chapter 2 sorted files by where they live. This chapter sorts them by what is
actually inside, because that is what decides how much you should care.

Eight classes, ordered by how much damage the contents could do.

---

## Class A: the complete record of your work

**Files:** `~/.claude/projects/<slug>/<uuid>.jsonl`,
`~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`

**Size on the sampled machine:** 325 MB and 1.37 GB.

This is the whole conversation, written to plain text as it happens. Not a
summary. Every prompt, every model reply, every tool call, and every tool result.

### What a Claude Code transcript line looks like

MEASURED, the fields present across a 15 MB transcript:

```
type            assistant | user | attachment | mode | last-prompt |
                custom-title | queue-operation
message         the actual content
toolUseResult   full output of the tool that ran
cwd             working directory
gitBranch       branch at the time
sessionId       session identifier
uuid            this record
parentUuid      the record before it, so the thread can be rebuilt
isSidechain     true when a sub-agent produced it
promptSource    how the prompt arrived
requestId       server-side request identifier
version         harness version
timestamp       when
```

`toolUseResult` is the field that matters. When the agent ran `cat config/prod.env`,
the output of that command is in this file. When it read your database migration,
the migration is in this file.

### What a Codex rollout looks like

MEASURED, record counts from one ordinary session:

```
event_msg/token_count                  754
turn_context                           378
response_item/reasoning                321
event_msg/agent_reasoning              299
response_item/function_call            273
response_item/function_call_output     273
response_item/custom_tool_call         178
response_item/custom_tool_call_output  178
response_item/message                  131
event_msg/agent_message                 93
event_msg/user_message                  21
session_meta                             1
```

Two things stand out.

First, `response_item/reasoning` appears 321 times. The model's internal reasoning
is written to disk, not only its visible replies.

Second, the single `session_meta` record at the top of the file carries a
`base_instructions` field. That is the full system prompt. Every rollout file on
disk contains a copy of it.

### How long they stay

DOCUMENTED: Claude Code deletes transcripts older than `cleanupPeriodDays`, which
defaults to 30. Codex defaults to `history.persistence = "save-all"` with no
age limit.

MEASURED consequence: the sampled machine held Codex rollouts back to 2026-02-19,
six months, and the largest single file had reached 131 MB.

### Why this is class A

Any secret the agent ever read is in here, in plain text, indefinitely. See
04-privacy-and-security.md.

---

## Class B: shadow copies of your source code

**Files:** `~/.claude/file-history/`, `~/.claude/projects/<slug>/<session>/tool-results/`,
`~/.codex/worktrees/`, `~/.codex/attachments/`

Your code, copied outside your repository.

- **`file-history/`** holds the version of each file from *before* an edit, so
  changes can be undone. Named `<content-hash>@v<n>`.
- **`tool-results/`** holds tool output too large for the conversation. The
  preview goes in context, the full text goes here.
- **`worktrees/`** holds entire additional checkouts. Background agents get their
  own copy of the repository so parallel work does not collide.
- **`attachments/`** holds files you dragged in.

MEASURED: `~/.codex/worktrees/` was 839 MB and contained exactly one project
checkout, complete with `.git`, `README.md`, and all source.

That checkout was **orphaned**. Its parent repository had been moved to a
different path, so the `.git/worktrees/` link on the parent side no longer
existed. Running `git worktree prune` in the parent does nothing, because there is
no parent at the recorded path any more. The only way to reclaim the space is to
delete the folder yourself.

**Why this matters beyond disk:** a repository you deleted is not gone if a
worktree copy survives here.

---

## Class C: fingerprints of you and your machine

**Files:** `~/.claude/shell-snapshots/`, `~/.claude.json`, `~/.codex/config.toml`,
`~/.codex/state_5.sqlite`, `~/.codex/installation_id`, `~/.claude/history.jsonl`

Not your code. Facts about your setup.

| Where | What it reveals |
| --- | --- |
| `shell-snapshots/*.sh` | Your shell functions, aliases, options, `PATH`. MEASURED: 4,501 lines, 127 functions, 4 aliases, 1 export in one sample. |
| `~/.claude.json` → `projects` | Every project path you have opened, with cost and token history. 43 on the sampled machine. |
| `~/.claude.json` → `exampleFiles` | A sample of filenames from inside each repository. |
| `~/.claude.json` → `machineID` | Stable 64-character machine identifier. |
| `~/.codex/config.toml` → `[projects."<path>"]` | Every directory you ever trusted, by full absolute path, kept permanently. |
| `~/.codex/state_5.sqlite` → `threads` | `cwd`, `git_branch`, `git_sha`, and `git_origin_url` for all 455 threads. |
| `~/.claude/history.jsonl` | Every prompt string you typed, plus `pastedContents` for prompts built by pasting. |

The trust list is the most revealing single item. It is an ordered, dated list of
every directory you have worked in. For a consultant, that is a client list. For
anyone under a non-disclosure agreement, it is a list of things you were not
supposed to name.

`pastedContents` deserves a note. It was present on only 2 of 162 history entries
on the sampled machine, so it is not routine. But when you paste something into a
prompt, the pasted text can be written to disk separately from the transcript.

---

## Class D: credentials

**Files:** `~/.codex/auth.json`, macOS Keychain item `Claude Code-credentials`

MEASURED contrast:

```
Claude Code   macOS Keychain, item "Claude Code-credentials"
              no plaintext ~/.claude/.credentials.json on this machine
              encrypted at rest, gated by the OS

Codex CLI     ~/.codex/auth.json, mode 0600, plain JSON
              { auth_mode, OPENAI_API_KEY, tokens: {
                  id_token, access_token, refresh_token, account_id },
                last_refresh }
```

`0600` means only your user account can read the file. That defends against other
users on a shared machine. It does not defend against a malicious npm package,
because that runs as you.

REPORTED: the ChainDrop worm hunted for exactly this class of file across
Anthropic, Codex, Cursor, OpenAI, and Gemini tooling ([Elastic Security
Labs](https://www.elastic.co/security-labs/shai-hulud-chaindrop-npm-supply-chain)).

Note also that `refresh_token` is the valuable one. An access token expires in
hours. A refresh token mints new ones.

---

## Class E: state the vendor pushes to you

**Files:** `~/.claude.json` → `cachedGrowthBookFeatures`, `~/.claude/policy-limits.json`,
`~/.claude/remote-settings.json`, `~/.codex/models_cache.json`

This class runs the opposite direction: the server writing to your disk.

MEASURED: 487 cached feature flags in `~/.claude.json`. These decide which
behaviours are switched on for you. Two people on the same version can behave
differently because their cached flags differ.

`policy-limits.json` held keys named `restrictions`, `compliance_taints`,
`monitoring_notice`, and `defaults`. The names suggest organisation-level policy
enforcement delivered from the server.

There is a real trade-off here, and it cuts both ways. DOCUMENTED: setting
`DISABLE_TELEMETRY=1` also stops feature flags being fetched, which means you also
stop receiving remote kill switches for broken behaviour
([claude-code issue #58383](https://github.com/anthropics/claude-code/issues/58383)).
Turning off the reporting turns off the safety brake attached to it.

---

## Class F: telemetry waiting on disk

**Files:** `~/.claude/telemetry/1p_failed_events.*.json`

Usage events that failed to upload, kept for retry. Despite the `.json`
extension, the format is JSONL.

MEASURED, the shape of one queued event, with values replaced by their type:

```json
{ "event_type": "<str:23>",
  "event_data": {
    "event_name": "...", "client_timestamp": "...", "model": "...",
    "session_id": "...", "user_type": "...", "betas": "...",
    "entrypoint": "...", "agent_sdk_version": "...",
    "is_interactive": true, "client_type": "...",
    "process": "<str:336>",
    "env": { "platform": "...", "node_version": "...", "terminal": "...",
             "package_managers": "...", "runtimes": "...", "is_ci": "...",
             "is_github_action": "...", "version": "..." } } }
```

Four events were queued. The contents are operational metadata: platform, Node
version, terminal, model, session id. No prompt text was present in the sample.

The Codex equivalent is different. DOCUMENTED: `otel.metrics_exporter` defaults
to `statsig`, and `otel.log_user_prompt` defaults to off. But the same
documentation notes that tool results are exported even when prompt logging is
off, and tool results can contain file contents
([Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference),
[SigNoz](https://signoz.io/docs/codex-monitoring/)).

---

## Class G: leftovers

Files that serve no purpose and that nothing removes.

MEASURED:

| What | Count or size | Why it is there |
| --- | --- | --- |
| `~/.claude/session-env/` | 851 directories, **all empty** | Created per session, never removed |
| `~/.codex/..codex-global-state.json.tmp-*` | 11 files, up to 512 KB each | Interrupted write-then-rename, dated across three weeks |
| `~/.codex/.tmp/plugins-backup-*`, `plugins-clone-*` | part of 241 MB | Plugin sync scratch, kept after success |
| `~/.codex/logs_2.sqlite` free pages | **326 MB of 395 MB** | Rows deleted, space never returned |
| `~/.codex/thread-writer-locks/*.lock` | one per thread | Lock files outliving their process |
| `.personality_migration`, `.sandbox_migration`, `.app-server-state-reconciled-v1` | a few bytes each | One-time migration markers, permanent |

The log database is the clearest case. It holds 43,830 rows with about 47 MB of
content. The file is 395 MB. SQLite does not shrink a file when rows are deleted;
it marks pages free and reuses them later. So the file grew to its high-water
mark and stayed there. `VACUUM` rebuilds it and gives the space back.

---

## Class H: things that can execute

**Files:** `<project>/.claude/settings.json` hooks, `~/.claude/hooks/`,
`~/.claude/plugins/`, `~/.codex/plugins/`, `~/.codex/skills/`,
`~/.codex/computer-use/Codex Computer Use.app`

Everything above is data. This class is code.

- **Hooks** are shell commands the harness runs on its own, at events such as
  session start. They can be defined in a project's `.claude/settings.json`,
  which means they can arrive in a repository you clone.
- **Plugins and skills** are downloaded bundles. MEASURED: 308 MB of Codex
  plugins and 16 MB of Claude Code plugins.
- **`Codex Computer Use.app`** is a full 63 MB macOS application bundle sitting
  in your home directory.

MEASURED: none of the project-level `.claude/` directories across 12 repositories
on the sampled machine were listed in any `.gitignore`. Agent configuration
travels with the repository by default.

That is the shape of the attack that 04-privacy-and-security.md
covers next.

---

<!-- 11archive-source: 04-privacy-and-security.md -->

# Privacy and security

Five risks, ordered by how likely you are to hit them. Each has the mechanism,
the evidence, and the fix.

---

## Risk 1: `.gitignore` does not stop secrets reaching disk

**Likelihood: near certain if you use these tools on a real project.**

### The mechanism

`.gitignore` controls one thing: what git commits. It has no effect on what the
agent reads, and no effect on what the harness writes.

So the chain is:

```
1. .env is in .gitignore                    (you are protected from committing it)
2. agent runs `grep -rn "API_KEY" .`        (a reasonable thing to do)
3. grep output includes the .env line       (grep does not read .gitignore)
4. output lands in the transcript           (toolUseResult field)
5. transcript is plain text in your home    (for 30 days, or forever on Codex)
```

Nothing in that chain is a bug. Each step does its job. The composition is what
fails.

### The evidence

REPORTED: two live Anthropic API keys were found in session JSONL files under
`~/.claude/projects/`
([agentfluent issue #72](https://github.com/frederick-douglas-pearce/agentfluent/issues/72)).

REPORTED: Claude Code has been observed reading and echoing `.env` and
`.dev.vars` contents into the transcript even when `CLAUDE.md` explicitly told it
not to ([claude-code issue
#44868](https://github.com/anthropics/claude-code/issues/44868)).

That second one is the important one. **Instructions in `CLAUDE.md` are not a
security control.** They are a request to a model that may or may not comply.
Treat them as a preference, never as a boundary.

### The fix

Order matters here. Do the first one.

1. **Do not keep real secrets in files the agent can reach.** Use a secret
   manager, or your shell environment, or a `direnv` setup that keeps values out
   of files under the repository root.
2. **Deny-list the paths** in `.claude/settings.json` permissions so the Read
   tool refuses them. This is a real control, unlike a `CLAUDE.md` note, but it
   only covers the tools it names. `grep` through Bash can still reach the file.
3. **Rotate anything the agent has already seen.** If a key was ever in a
   transcript, treat it as exposed.
4. **Search your own transcripts** for what is already there:

```bash
rg -l 'sk-ant-|sk-proj-|AKIA[0-9A-Z]{16}|ghp_' ~/.claude/projects ~/.codex/sessions
```

If that returns anything, rotate those credentials and delete those files.

---

## Risk 2: a cloned repository can run code when you start a session

**Likelihood: low per repository, severe when it happens.**

### The mechanism

A project's `.claude/settings.json` can define hooks. A hook is a shell command
the harness runs by itself at a given event. `SessionStart` fires when you open
the project.

So a file committed to a repository can cause command execution on your machine
at the moment you point an agent at it. You never typed anything.

### The evidence

REPORTED, and this is a real campaign, not a proof of concept. The ChainDrop
worm compromised over 400 npm packages and planted a `SessionStart` hook in
`.claude/settings.json` in repositories it reached, running `node .claude/setup.mjs`
on session start
([Pillar Security](https://www.pillar.security/blog/chaindrop-when-opening-a-repository-becomes-execution),
[Microsoft Security
Blog](https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/),
[Unit 42](https://unit42.paloaltonetworks.com/chaindrop-npm-worm-analysis/)).

It paired that with a VS Code `folderOpen` task, covering three moments: opening
the folder, starting the agent, and installing the package.

Its targets included credentials for Anthropic, Claude, Codex, Cursor, OpenAI,
and Gemini, alongside AWS, GCP, Azure, GitHub tokens, Vault tokens, SSH keys, and
Kubernetes service account tokens
([Elastic Security Labs](https://www.elastic.co/security-labs/shai-hulud-chaindrop-npm-supply-chain)).

### The fix

```bash
# before opening any unfamiliar repo with an agent
cat .claude/settings.json .claude/settings.local.json 2>/dev/null
ls -la .claude/ .codex/ .vscode/ 2>/dev/null
```

Look for `hooks`, and for any `command` value. If you find one you did not
expect, do not start a session in that directory.

Codex has a structural defence here that Claude Code does not: DOCUMENTED, it
only reads a project's `config.toml` once you trust the project, and it refuses
project-level overrides for provider, authentication, notification, and telemetry
settings entirely ([Codex configuration
reference](https://learn.chatgpt.com/docs/config-file/config-reference)). That is
a good design and worth knowing about.

---

## Risk 3: agent state gets committed to a shared repository

**Likelihood: moderate, and usually nobody notices.**

### The mechanism

Project-level `.claude/` holds both things you want to share (skills, project
instructions) and things you do not (`settings.local.json`, session scratch).
By default nothing separates them.

MEASURED: across 12 repositories on the sampled machine, **no `.gitignore`
mentioned `.claude` at all**.

### The fix

Add to your global gitignore, which covers every repository at once:

```bash
git config --global core.excludesfile ~/.gitignore_global
cat >> ~/.gitignore_global <<'EOF'
.claude/settings.local.json
.claude/session-env/
.codex/config.toml
EOF
```

Keep `.claude/skills/`, `.claude/rules/`, and `CLAUDE.md` committed. Those are
the parts your team should share.

Then check what you may already have pushed:

```bash
git log --all --oneline -- '.claude/**' '.codex/**' | head
```

---

## Risk 4: your directory layout is a permanent, readable list

**Likelihood: certain. Impact depends entirely on your work.**

### The mechanism

Both tools keep a permanent record of every directory you have worked in, because
both need it to resume sessions and remember trust decisions.

MEASURED:

- `~/.codex/config.toml` holds a `[projects."<absolute path>"]` block per trusted
  directory, in plain text
- `~/.claude.json` holds 43 project entries keyed by absolute path
- `~/.claude/projects/` encodes each path directly into a folder name
- `~/.codex/state_5.sqlite` stores `cwd` and `git_origin_url` for 455 threads

None of these are pruned when you finish a project or when the directory stops
existing. On the sampled machine, both tools still listed a repository that had
been moved months earlier.

### Why it matters

For most people this is harmless. For some it is not:

- A consultant's trust list is a client list.
- Directory names often carry unreleased product names or acquisition code names.
- `git_origin_url` exposes private repository URLs, including any host that
  identifies an employer.

### The fix

There is no supported prune command for either tool. Editing is manual:

```bash
# review before deciding anything
grep '^\[projects' ~/.codex/config.toml
ls ~/.claude/projects/
```

Remove stale blocks from `config.toml` with an editor. Delete stale folders under
`~/.claude/projects/`. Back both up first: deleting a project folder deletes its
transcripts and its agent memory with it.

---

## Risk 5: telemetry, and the trap in switching it off

**Likelihood: certain. Impact: mostly low.**

### What is actually collected

MEASURED, from the queued events on disk: platform, Node version, terminal,
package managers, runtimes, whether it is running in continuous integration,
model name, session id, entry point, and version. Operational metadata. No prompt
text in the sample.

DOCUMENTED, for Codex: `otel.log_user_prompt` defaults to off, so prompt text is
not exported by default. But tool results **are** exported, and tool results
contain file contents ([SigNoz](https://signoz.io/docs/codex-monitoring/)).
`otel.metrics_exporter` defaults to `statsig`.

### The trap

DOCUMENTED: `DISABLE_TELEMETRY=1` also stops Claude Code contacting the feature
flag service. Because remote kill switches ride on the same channel, you stop
receiving those too, and the tool falls back to built-in defaults
([claude-code issue #58383](https://github.com/anthropics/claude-code/issues/58383),
[claude-code issue #47558](https://github.com/anthropics/claude-code/issues/47558)).

`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` goes further, disabling auto-updates,
error reporting, release notes, and availability checks as well.

So the honest framing is a trade, not a free win: less reporting out, less
protection in. Choose knowingly.

### The fix

```json
// ~/.claude/settings.json
{ "env": { "DISABLE_TELEMETRY": "1" } }
```

```toml
# ~/.codex/config.toml
[otel]
exporter = "none"
metrics_exporter = "none"
log_user_prompt = false
```

---

## What is not a risk

Worth saying, so the list above stays credible.

- **Shell snapshots are not an environment dump.** MEASURED: one 4,501-line
  snapshot contained 127 functions, 4 aliases, and exactly one `export`, for
  `PATH`. It captures shell definitions, not your environment variables. Unless
  your own shell functions contain secrets, this file is not the problem.
- **`0600` permissions are correctly applied.** Both tools set restrictive modes
  on their sensitive files. That part is done right.
- **Nothing observed was undisclosed data collection.** Every file examined had
  an obvious engineering purpose. The problem throughout is retention and
  visibility, not intent.

---

## For completeness: two published incidents

REPORTED, both from 2026, both since fixed. Included so the record is complete,
not because either is an ongoing risk.

- **CVE-2026-54316**: a Claude Code flaw that turned a public download counter
  into an exfiltration channel, leaking an API key one character at a time. Fixed
  in 2.1.163.
- **The npm source leak**: Claude Code 2.1.88 shipped with a source map,
  exposing roughly 512,000 lines of source
  ([InfoQ](https://infoq.com/news/2026/04/claude-code-source-leak)).

The lesson from both is the same as the lesson from this report. These are
ordinary programs with ordinary bugs. Give them the scrutiny you would give any
other program that reads all your files and runs commands as you.

Next: 05-disk-growth-and-retention.md.

---

<!-- 11archive-source: 05-disk-growth-and-retention.md -->

# Disk growth and retention

## Where 4.0 GB went

MEASURED, 2026-08-11, one macOS machine.

| Location | Size | Share of total |
| --- | --- | --- |
| `~/.codex/sessions/` | 1.37 GB | 34% |
| `~/.codex/worktrees/` | 839 MB | 21% |
| `~/.codex/logs_2.sqlite` | 395 MB | 10% |
| `~/.codex/plugins/` | 308 MB | 7.6% |
| `~/.codex/packages/` | 307 MB | 7.6% |
| `~/.claude/projects/` | 325 MB | 8.1% |
| `~/.codex/.tmp/` | 241 MB | 6.0% |
| `~/.codex/generated_images/` | 121 MB | 3.0% |
| `~/.codex/computer-use/` | 63 MB | 1.6% |
| everything else | ~65 MB | 1.6% |
| **total** | **4.03 GB** | |

Two lines carry the story. Conversation transcripts are 1.70 GB across both
tools, 42% of everything. And 1.08 GB, 27%, is pure waste: an unvacuumed
database, an orphaned worktree, and plugin sync scratch.

## The four ways this grows

### 1. Transcripts grow with the work, and never shrink

Every tool result is appended in full. Read a 2 MB log file to find one line and
all 2 MB goes into the transcript.

MEASURED: the largest Codex rollout had reached **131 MB** for a single session.
Second and third largest were 52 MB and 47 MB. The largest Claude Code transcript
was 15.1 MB.

The gap between 131 MB and 15.1 MB is mostly retention policy, not a difference
in how verbose the tools are.

### 2. Retention defaults differ by a lot

DOCUMENTED:

| | Claude Code | Codex CLI |
| --- | --- | --- |
| Setting | `cleanupPeriodDays` in `settings.json` | `history.persistence` in `config.toml` |
| Default | `30` | `"save-all"` |
| Effect | deletes transcripts older than 30 days at startup | keeps everything |
| Size cap | none | `history.max_bytes` caps the prompt history file only, not rollouts |

MEASURED: the sampled machine held Codex rollouts from 2026-02-19, six months
back. Claude Code's oldest was 30 days, exactly as documented.

**The `cleanupPeriodDays: 0` trap.** Reading the name, `0` should mean "no
cleanup, keep forever". It does the opposite: it stops transcripts being written
at all ([claude-code issue
#23710](https://github.com/anthropics/claude-code/issues/23710)). To keep
everything, set a large number:

```json
{ "cleanupPeriodDays": 3650 }
```

### 3. SQLite files grow to a high-water mark and stay there

This is the most reclaimable waste, and it is invisible without asking.

MEASURED, `~/.codex/logs_2.sqlite`:

```
file size            395.4 MB
page size            4,096 bytes
total pages          101,213
free pages            83,412      <- 82% of the file
reclaimable          326.0 MB
rows                  43,830
live content         ~47 MB
date range           2026-08-02 to 2026-08-11
```

SQLite marks deleted pages free and reuses them later rather than shrinking the
file. So nine days of debug logs, worth 47 MB, sit inside a 395 MB container that
grew during some earlier burst and never came back down.

```bash
# reclaims 326 MB on the sampled machine, takes seconds
sqlite3 ~/.codex/logs_2.sqlite 'VACUUM;'
```

Safe to run when Codex is not running. It rebuilds the file and keeps every row.

Retention on that table is loose rather than strict: 14,450 of the 43,830 rows
were older than 7 days, so it is not a hard weekly window.

### 4. Scratch space is not cleaned after success

MEASURED, `~/.codex/.tmp/`, 241 MB:

```
plugins/
plugins-backup-NpwEFC/      <- kept after a successful sync
plugins-clone-FKAglD/       <- kept after a successful sync
plugins.sha
plugins.sync.lock
bundled-marketplaces/
legacy-primary-runtime-skills/
marketplaces/
```

The backup-and-clone pattern is right: clone the new version, back up the old,
swap, then delete both. The last step does not happen.

Same story at the top of `~/.codex`: 11 abandoned
`..codex-global-state.json.tmp-<epoch>-<uuid>` files, up to 512 KB each, dated
across three weeks.

## The orphaned worktree

Worth its own section, because normal cleanup cannot fix it.

MEASURED: `~/.codex/worktrees/3da5/<project>` was 839 MB. One complete checkout,
`.git` included.

A **git worktree** is a second checkout of the same repository in a different
folder. Background agents get one so they can work without disturbing your files.
Git tracks the link from both ends: the worktree has a `.git` file pointing at
the parent, and the parent has an entry under `.git/worktrees/`.

Here the parent repository had been moved to a new path. So:

```
worktree points to:   ~/Desktop/.../2026/repos/<project>/.git/worktrees/<project>
that path now:        does not exist
git status there:     fatal: not a git repository
git worktree prune:   nothing to prune, there is no parent to prune from
```

Both ends of the link are broken. Git cannot help. 839 MB stays until you delete
the folder by hand.

```bash
# inspect first
du -sh ~/.codex/worktrees/*/*
# for each, check whether its parent still exists
git -C ~/.codex/worktrees/<hash>/<project> status 2>&1 | head -1
# "fatal: not a git repository" means orphaned and safe to remove
```

Do check for uncommitted work before deleting. An agent's worktree can contain
changes that were never pushed anywhere.

## Empty directories

MEASURED: `~/.claude/session-env/` contained **851 directories. Every one was
empty.** Zero files in total.

Each was created for a session that has long ended. They cost almost no space,
but they slow down directory listings and make `~/.claude` unreadable.

```bash
find ~/.claude/session-env -mindepth 1 -maxdepth 1 -type d -empty -delete
```

## What is safe to delete

| Target | Safe? | You lose |
| --- | --- | --- |
| `sqlite3 ~/.codex/logs_2.sqlite 'VACUUM;'` | yes | nothing |
| Empty `session-env/` dirs | yes | nothing |
| `..codex-global-state.json.tmp-*` | yes | nothing |
| `~/.codex/.tmp/plugins-backup-*`, `plugins-clone-*` | yes, when idle | nothing |
| Orphaned worktrees | yes, after checking | uncommitted work in them |
| `~/.codex/generated_images/` | yes | images the agent made |
| Old transcripts | your call | the ability to `--resume` those sessions, and their history |
| `~/.claude/file-history/` | mostly | undo for those sessions |
| `~/.claude/projects/<slug>/` | careful | transcripts **and** that project's agent memory |
| `~/.codex/auth.json`, `config.toml` | **no** | login and all settings |
| `~/.claude.json` | **no** | all settings, trust decisions, project state |
| `~/.claude/settings.json` | **no** | all settings |

The one to be careful with is `~/.claude/projects/<slug>/`. Agent memory lives
inside it at `memory/MEMORY.md`. Deleting the folder to reclaim transcript space
also deletes everything the agent learned about that project.

## A cleanup script

Reclaims about 1.1 GB on the sampled machine. Read it before running it.

```bash
#!/usr/bin/env bash
set -euo pipefail

# stop both tools first
pgrep -f 'codex|claude' && { echo "quit codex and claude first"; exit 1; }

echo "before: $(du -sh ~/.claude ~/.codex | tr '\n' ' ')"

# 1. reclaim free pages in the log database
sqlite3 ~/.codex/logs_2.sqlite 'VACUUM;'

# 2. abandoned atomic-write temp files
find ~/.codex -maxdepth 1 -name '..codex-global-state.json.tmp-*' -delete

# 3. plugin sync scratch
rm -rf ~/.codex/.tmp/plugins-backup-* ~/.codex/.tmp/plugins-clone-*

# 4. empty session dirs
find ~/.claude/session-env -mindepth 1 -maxdepth 1 -type d -empty -delete

echo "after:  $(du -sh ~/.claude ~/.codex | tr '\n' ' ')"
echo
echo "not automated, check these by hand:"
du -sh ~/.codex/worktrees/*/* 2>/dev/null
echo "  ^ for each, run: git -C <path> status"
echo "    'fatal: not a git repository' means orphaned"
```

Worktrees are left out on purpose. They can hold work that exists nowhere else.

## Rough projection

MEASURED growth on the sampled machine works out to roughly **20 to 25 MB per
active day per tool**, from transcripts alone, before plugins and caches.

Treat that as one data point, not a rule. It scales with how much file content
your tasks pull into context. A day of reading large logs costs far more than a
day of small edits.

At that rate, with Codex's indefinite retention, a year of daily use lands around
7 to 9 GB. That is a laptop annoyance, not a crisis. The reason to care is
04-privacy-and-security.md: the size is a proxy for
how much of your work is sitting in plain text.

Next: 06-operator-playbook.md.

---

<!-- 11archive-source: 06-operator-playbook.md -->

# Operator playbook

Everything actionable, in one place. Run the audit first so you know your own
numbers before changing anything.

---

## Step 1: audit what you have

Read-only. Nothing here changes a file.

```bash
#!/usr/bin/env bash
# harness-audit.sh: read-only inspection of both agent home directories

echo "=== totals ==="
du -sh ~/.claude ~/.codex 2>/dev/null

echo; echo "=== biggest items ==="
du -sh ~/.claude/* ~/.codex/* 2>/dev/null | sort -rh | head -12

echo; echo "=== transcripts ==="
printf 'claude: %s files, %s\n' \
  "$(find ~/.claude/projects -name '*.jsonl' 2>/dev/null | wc -l | tr -d ' ')" \
  "$(du -sh ~/.claude/projects 2>/dev/null | cut -f1)"
printf 'codex:  %s files, %s\n' \
  "$(find ~/.codex/sessions -name '*.jsonl' 2>/dev/null | wc -l | tr -d ' ')" \
  "$(du -sh ~/.codex/sessions 2>/dev/null | cut -f1)"

echo; echo "=== oldest transcript kept ==="
find ~/.codex/sessions -name '*.jsonl' 2>/dev/null \
  | sed 's|.*/rollout-\([0-9-]*\)T.*|\1|' | sort | head -1

echo; echo "=== reclaimable in log database ==="
if [ -f ~/.codex/logs_2.sqlite ]; then
  sqlite3 ~/.codex/logs_2.sqlite \
    "SELECT (SELECT * FROM pragma_freelist_count()) *
            (SELECT * FROM pragma_page_size()) / 1048576 || ' MB';"
fi

echo; echo "=== empty session dirs ==="
find ~/.claude/session-env -mindepth 1 -maxdepth 1 -type d -empty 2>/dev/null | wc -l

echo; echo "=== worktrees (check each for an orphan) ==="
du -sh ~/.codex/worktrees/*/* 2>/dev/null

echo; echo "=== credential exposure in transcripts ==="
rg -l 'sk-ant-|sk-proj-|AKIA[0-9A-Z]{16}|ghp_|-----BEGIN.*PRIVATE KEY' \
   ~/.claude/projects ~/.codex/sessions 2>/dev/null | head
echo "(no output above = nothing matched those patterns)"

echo; echo "=== project dirs you have trusted ==="
grep -c '^\[projects' ~/.codex/config.toml 2>/dev/null
```

If the credential search returns anything, stop and go to Step 2 before doing
anything else.

---

## Step 2: if the audit found credentials

In this order.

1. **Rotate the credential.** Assume it is compromised. A transcript is plain
   text, it may be in a backup, and Time Machine or any cloud sync will have
   copied it.
2. **Delete the transcripts containing it.**

```bash
rg -l 'sk-ant-|sk-proj-|AKIA[0-9A-Z]{16}|ghp_' \
   ~/.claude/projects ~/.codex/sessions | tee /tmp/hits.txt
# review /tmp/hits.txt, then:
xargs rm < /tmp/hits.txt
```

3. **Check your backups.** Deleting the file locally does not remove it from a
   Time Machine snapshot or an iCloud or Dropbox copy of your home directory.
4. **Stop it happening again**, using Step 3.

---

## Step 3: settings worth changing

### Claude Code, `~/.claude/settings.json`

```json
{
  "cleanupPeriodDays": 14,
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./**/.env)",
      "Read(./**/*.pem)",
      "Read(./**/credentials*)",
      "Read(./**/id_rsa*)"
    ]
  }
}
```

Three things to be honest about with those deny rules:

- They cover the **Read** tool. A `grep` or `cat` run through Bash goes around
  them. Add matching Bash deny rules if that matters to you.
- `cleanupPeriodDays: 14` shortens your exposure window. Set it to `3650` instead
  if you want long history and accept the trade. Never set it to `0` unless you
  want transcripts switched off entirely.
- A `CLAUDE.md` instruction is **not** equivalent. Permissions are enforced by
  the harness. `CLAUDE.md` is a request to the model.

### Codex, `~/.codex/config.toml`

```toml
# cap prompt history growth
[history]
persistence = "save-all"
max_bytes = 10485760          # 10 MB

# keep telemetry local
[otel]
exporter = "none"
metrics_exporter = "none"
log_user_prompt = false
```

Set `persistence = "none"` if you never want rollouts written. You lose the
ability to resume a session, which is a real cost.

Note the limit: `history.max_bytes` caps the prompt history file only. It does
**not** cap `sessions/`, which is where the 1.37 GB actually was.

### Both: keep agent state out of git

```bash
git config --global core.excludesfile ~/.gitignore_global
cat >> ~/.gitignore_global <<'EOF'
.claude/settings.local.json
.claude/session-env/
.codex/config.toml
EOF
```

Leave `CLAUDE.md`, `AGENTS.md`, `.claude/skills/`, and `.claude/rules/`
committed. Those are meant to be shared.

---

## Step 4: before opening an unfamiliar repository

Thirty seconds, and it is the check that stops the ChainDrop class of attack.

```bash
#!/usr/bin/env bash
# run inside a repo you did not write, before starting an agent in it
echo "=== agent config present? ==="
ls -la .claude/ .codex/ .vscode/ .agents/ 2>/dev/null

echo; echo "=== hooks (any output here needs your attention) ==="
grep -rn -A3 '"hooks"\|"command"\|SessionStart\|PreToolUse' \
  .claude/ .codex/ 2>/dev/null | head -30

echo; echo "=== npm lifecycle scripts ==="
[ -f package.json ] && \
  python3 -c "import json;s=json.load(open('package.json')).get('scripts',{});\
print({k:v for k,v in s.items() if k.startswith(('pre','post'))} or 'none')"
```

Any `command` you did not expect means: do not start a session there. Read the
script first.

---

## Step 5: routine cleanup

Monthly is plenty. The script is in
05-disk-growth-and-retention.md.
The four safe operations:

```bash
sqlite3 ~/.codex/logs_2.sqlite 'VACUUM;'
find ~/.codex -maxdepth 1 -name '..codex-global-state.json.tmp-*' -delete
rm -rf ~/.codex/.tmp/plugins-backup-* ~/.codex/.tmp/plugins-clone-*
find ~/.claude/session-env -mindepth 1 -maxdepth 1 -type d -empty -delete
```

Quit both tools first. Handle worktrees by hand:

```bash
for w in ~/.codex/worktrees/*/*; do
  printf '%s  ' "$(du -sh "$w" | cut -f1)"
  git -C "$w" status --porcelain >/dev/null 2>&1 \
    && echo "LIVE  $w" || echo "ORPHAN $w"
done
```

`ORPHAN` means git cannot reach the parent. Check for uncommitted work, then
delete.

---

## Step 6: decide your privacy posture

Three positions. Pick one on purpose rather than by default.

### Default: leave everything as shipped

Telemetry on, transcripts kept, flags fetched. You get remote kill switches and
working feature gates. Fine for open source and personal projects.

### Middle: reduce retention, keep the safety channel

```json
{ "cleanupPeriodDays": 7 }
```

```toml
[otel]
log_user_prompt = false
```

Shortens the window in which a leaked secret sits on disk, without cutting off
the channel that delivers fixes. **This is the recommended default for
client work.**

### Strict: cut outbound traffic

```json
{ "env": {
    "DISABLE_TELEMETRY": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
} }
```

```toml
[history]
persistence = "none"

[otel]
exporter = "none"
metrics_exporter = "none"
```

Know what this costs, because it is not free. DOCUMENTED: turning off telemetry
also turns off feature flag fetching, so you lose remote kill switches and fall
back to built-in defaults ([claude-code issue
#58383](https://github.com/anthropics/claude-code/issues/58383)). Turning off
history means no session resume.

Only worth it under a real requirement, such as a regulated environment or a
client contract that forbids third-party processing.

---

## Quick reference

| Question | Answer |
| --- | --- |
| Where are my conversations? | `~/.claude/projects/<slug>/*.jsonl`, `~/.codex/sessions/YYYY/MM/DD/*.jsonl` |
| How long are they kept? | Claude Code 30 days by default. Codex forever. |
| How do I keep them longer? | `cleanupPeriodDays: 3650`. Never `0`. |
| Does `.gitignore` protect secrets? | No. It stops commits, not reads. |
| Where are my credentials? | Claude Code: macOS Keychain. Codex: `~/.codex/auth.json`, plain JSON, `0600`. |
| Can a cloned repo run code? | Yes, through a hook in `.claude/settings.json`. Check before opening. |
| Biggest safe win on disk? | `VACUUM` the Codex log database. 326 MB on the sampled machine. |
| What must I never delete? | `~/.claude.json`, `~/.claude/settings.json`, `~/.codex/config.toml`, `~/.codex/auth.json` |
| What surprises people most? | Deleting `~/.claude/projects/<slug>/` also deletes that project's agent memory. |

Next: 07-glossary.md.

---

<!-- 11archive-source: 07-glossary.md -->

# Glossary

Every term this report uses, in plain words. Alphabetical.

---

**Agent memory.** Notes the agent keeps about a project between sessions, so it
does not relearn the same facts. In Claude Code these are Markdown files at
`~/.claude/projects/<slug>/memory/`, indexed by `MEMORY.md`. Codex builds
something similar in the background using `memories_1.sqlite`. Worth knowing: the
Claude Code version lives inside the transcript folder, so deleting transcripts
to save space deletes the memory too.

**AGENTS.md / CLAUDE.md.** A plain Markdown file of project instructions that
gets loaded into every session. `AGENTS.md` is Codex's name for it, `CLAUDE.md`
is Claude Code's. Useful for conventions and commands. **Not a security
control**: it is a request to a model, which may or may not be followed.

**Approval mode.** How much the agent asks before acting. Codex offers
`untrusted`, `on-request`, and `never`. Recorded per session in
`state_5.sqlite`.

**Atomic write.** Writing to a temporary file, then renaming it over the real
one. The rename is instant, so a reader never sees a half-written file. Correct
practice. Its failure mode is the 11 abandoned `.tmp-` files in `~/.codex`: when
the process dies between write and rename, the temp file stays.

**Content hash.** A short string computed from a file's contents. Same content
always gives the same string. Claude Code uses one to name file backups, so
identical files are stored once. Appears in paths like
`file-history/<session>/4c5484fe505187a6@v3`.

**Feature flag.** A remote switch that changes a program's behaviour without
updating it. MEASURED: 487 of them cached in `~/.claude.json` under
`cachedGrowthBookFeatures`. They also carry kill switches for broken behaviour,
which is why disabling telemetry has a real cost.

**Harness.** The program that wraps a language model and lets it act: keeping the
conversation, offering tools, running them when asked. Claude Code and Codex CLI
are harnesses. The subject of this report.

**Hook.** A shell command the harness runs by itself when something happens, such
as a session starting. Defined in `settings.json`. Because a project's
`.claude/settings.json` can define one, a repository you clone can cause code to
run on your machine. See 04-privacy-and-security.md.

**JSONL.** JSON Lines: one complete JSON object per line, no wrapping array.
Appending one line is a single write, so a crash costs at most the last line.
That property is why every harness uses it for transcripts.

**MCP.** Model Context Protocol. A standard way to connect external tool servers
to a harness. Relevant here because `~/.claude/mcp-needs-auth-cache.json` tracks
which servers still need you to log in.

**OTEL / OpenTelemetry.** An industry standard for emitting logs, metrics, and
traces. Codex uses it for telemetry, configured under `[otel]` in `config.toml`.
DOCUMENTED: Codex ignores `OTEL_*` environment variables, so `config.toml` is the
only way to set it.

**Rollout.** Codex's name for a session transcript. Stored at
`~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<uuid>.jsonl`.

**Sandbox.** Limits on what the agent can touch. Codex offers `read-only`,
`workspace-write`, and `danger-full-access`. Recorded per session so you can see
afterwards what a session was allowed to do.

**Session / thread.** One continuous conversation. Claude Code says session,
Codex says thread. Each gets a UUID, which becomes the transcript filename.

**Shell snapshot.** A capture of your shell's functions, aliases, options, and
`PATH`, saved as a script and sourced before each command so tools behave like
your terminal. MEASURED: 4,501 lines and 127 functions in one sample. It captures
shell *definitions*, not your environment variables.

**Sidechain.** A sub-agent's conversation, running inside the main one. Marked
`isSidechain: true` in Claude Code transcripts. It means one session file can
contain several parallel conversations.

**SQLite WAL.** Write-Ahead Log. SQLite writes changes to a `-wal` companion file
first, then folds them into the main database later. This is why you see
`logs_2.sqlite`, `logs_2.sqlite-wal`, and `logs_2.sqlite-shm` together. The
`-wal` file can be large on its own: 6.1 MB in one measurement.

**Statsig.** The service Claude Code uses for feature flags and usage metrics,
and Codex's default `metrics_exporter`.

**System prompt.** The instructions given to the model before your conversation
starts. Stored as `base_instructions` in the `session_meta` record at the top of
every Codex rollout, which means a copy sits in every one of those 453 files.

**Tool result.** What a tool returned, fed back into the conversation as a
message. Stored in full in the transcript as `toolUseResult`. **This is the field
that leaks secrets**: if the agent read your `.env`, its contents are here.

**Trust level.** Whether you have marked a directory as safe. Codex keeps this in
`config.toml` under `[projects."<path>"]`, permanently. Claude Code keeps it as
`hasTrustDialogAccepted` per project in `~/.claude.json`. Together these form a
complete, dated list of every directory you have worked in.

**VACUUM.** A SQLite command that rebuilds a database file to release space from
deleted rows. MEASURED: reclaims 326 MB from `~/.codex/logs_2.sqlite`. Keeps
every row.

**Worktree.** A second checkout of one git repository in a different folder,
letting two branches be open at once. Background agents get their own so they do
not disturb your files. **Orphaned worktree**: one whose parent repository has
moved or been deleted, breaking both ends of the link. `git worktree prune`
cannot remove it. MEASURED: 839 MB in one.

---

<!-- 11archive-source: 08-methodology-and-sources.md -->

# Methodology and sources

## What was done

Two strands, kept separate on purpose.

**Strand 1: direct measurement.** Read the actual files on one working machine.
This produced every number in this report.

**Strand 2: documentation review.** Read what the vendors publish, plus issue
trackers and security research. This established what is intended, what is
documented, and what others have found.

Where the two disagree, the report says so. Measurement beats documentation for
"what is on disk". Documentation beats measurement for "what is meant to happen".

## The measured system

| | |
| --- | --- |
| Date | 2026-08-11 |
| Operating system | macOS, Darwin 24.3.0, Apple silicon |
| Machines | one |
| Claude Code use | heavy daily, 40 project directories, 207 transcripts |
| Codex CLI use | heavy daily, 455 threads, 453 rollouts, back to 2026-02-19 |

## How each number was produced

Every figure is reproducible. The commands:

```bash
# totals and breakdown
du -sh ~/.claude ~/.codex
du -sk ~/.claude/* ~/.codex/* | sort -rn

# transcript counts and sizes
find ~/.claude/projects -name '*.jsonl' | wc -l
find ~/.codex/sessions  -name '*.jsonl' | wc -l
find ~/.codex/sessions -name '*.jsonl' -exec ls -la {} + | sort -k5 -rn | head

# retention span
find ~/.codex/sessions -name '*.jsonl' \
  | sed 's|.*/rollout-\([0-9-]*\)T.*|\1|' | sort | head -1

# database schemas and row counts
sqlite3 ~/.codex/state_5.sqlite    '.schema'
sqlite3 ~/.codex/logs_2.sqlite     'SELECT COUNT(*) FROM logs;'
sqlite3 ~/.codex/logs_2.sqlite     'PRAGMA page_count; PRAGMA freelist_count; PRAGMA page_size;'

# transcript record structure (types and field names only, never contents)
python3 -c "import json,collections; ..."

# empty directory count
find ~/.claude/session-env -mindepth 1 -maxdepth 1 -type d -empty | wc -l

# orphaned worktree check
git -C ~/.codex/worktrees/<hash>/<project> status
```

## Handling of personal data

The measured machine belongs to the report's commissioner, who asked for this
inspection. Even so, the report was written to be publishable:

- **Structure was recorded, contents were not.** Schemas, field names, record
  type counts, file sizes, and permissions. No message text, no file contents, no
  command output from any transcript.
- **Credential files were never printed.** `auth.json` was examined by replacing
  every value with its type and length. No token, no fragment of a token, and no
  account identifier appears anywhere.
- **Paths are generalised.** Real paths became `~`, `<project>`, or `<slug>`.
- **A keychain dump was attempted and correctly refused** by a safety check. The
  report cites documentation for credential storage instead, plus a narrow
  existence check that confirmed the item is present without reading it.

## Limits, stated plainly

Read these before quoting any number.

**One machine.** Every measurement is a single sample. It proves a file class
exists and shows one plausible size. It does not establish a typical size. Your
`~/.codex` will not be 3.68 GB.

**One operating system.** macOS only. Linux and Windows differ in at least one
known way: credential storage. On macOS, Claude Code uses the Keychain. On Linux
it uses a file. That difference alone changes the risk picture in
04-privacy-and-security.md.

**One point in time.** Both tools ship frequently. Codex's `state_5.sqlite`
carries 46 schema migrations, and the `5` in the filename is itself a version
number, so earlier `state_1` through `state_4` layouts existed. Directory
contents will drift.

**Heavy usage skews the sizes.** These directories are large partly because the
tools were used hard. A casual user's numbers will be much smaller. The
*proportions* are likely more transferable than the absolutes.

**Undocumented does not mean secret.** The report counts entries the
documentation does not mention. That is a claim about documentation coverage, not
about intent. Every file examined had an obvious engineering purpose.

**No network capture was done.** Claims about what is transmitted come from
documentation and from the shape of locally queued telemetry, not from watching
traffic. A packet capture would strengthen chapter 4 and is the obvious next step.

**Codex is closed at the edges.** Some directories were identified only by name
and size, such as `pets/` and `visualizations/`. They were empty or nearly empty
on the sampled machine, and no documentation describes them.

## What would improve this

In order of value:

1. Sample 20 to 50 machines to turn single measurements into distributions.
2. Capture network traffic to verify what actually leaves the machine.
3. Repeat on Linux and Windows.
4. Track the same machine over 90 days to measure real growth rather than
   inferring a daily rate.
5. Extend to Cursor, Gemini CLI, and Amp, where partial evidence exists but no
   measurement was taken.

---

## Sources

### Official documentation

- [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory). Anthropic. The documented file tree used as the baseline for coverage counts.
- [Claude Code environment variables](https://code.claude.com/docs/en/env-vars). Anthropic. `DISABLE_TELEMETRY`, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.
- [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference). OpenAI. `CODEX_HOME`, `history.persistence`, `sqlite_home`, `[otel]`, sandbox modes, project config restrictions.
- [Codex advanced configuration](https://learn.chatgpt.com/docs/config-file/config-advanced). OpenAI.
- [Codex CLI reference](https://developers.openai.com/codex/cli/reference). OpenAI.

### Issue trackers

- [cleanupPeriodDays: 0 silently disables all transcript persistence](https://github.com/anthropics/claude-code/issues/23710). The `0` trap.
- [DISABLE_TELEMETRY silently disables GrowthBook, which also gates remote killswitches](https://github.com/anthropics/claude-code/issues/58383). The telemetry trade-off.
- [DISABLE_TELEMETRY should document experiment-gate side effects](https://github.com/anthropics/claude-code/issues/47558). Same, from the documentation angle.
- [Claude Code exposes secrets from .env despite CLAUDE.md prohibitions](https://github.com/anthropics/claude-code/issues/44868). Evidence that `CLAUDE.md` is not a control.
- [Prevent .env / API-key leakage into Claude Code session transcripts](https://github.com/frederick-douglas-pearce/agentfluent/issues/72). Live keys found in `~/.claude/projects/`.
- [codex exec emits no OTel metrics](https://github.com/openai/codex/issues/12913). Telemetry coverage gaps.
- [Keeping Codex conversation history within the project directory](https://github.com/openai/codex/discussions/23680). Session storage discussion.

### Security research

- [ChainDrop: When Opening a Repository Becomes Execution](https://www.pillar.security/blog/chaindrop-when-opening-a-repository-becomes-execution). Pillar Security. The `SessionStart` hook attack.
- [Shai-Hulud strikes again: CHAINDROP worm hits 400+ npm packages](https://www.elastic.co/security-labs/shai-hulud-chaindrop-npm-supply-chain). Elastic Security Labs. Credential targeting, including agent tooling.
- [ChainDrop supply chain compromise: anatomy of a self-propagating worm](https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/). Microsoft.
- [ChainDrop: Inside a Self-Propagating npm Worm](https://unit42.paloaltonetworks.com/chaindrop-npm-worm-analysis/). Palo Alto Unit 42.
- [ChainDrop npm Worm: Bun-loaded CI/CD credential harvester](https://www.stepsecurity.io/blog/chaindrop-npm-worm). StepSecurity, first report.
- [Claude Code and Gemini CLI Flaws Let a GitHub Issue Reach CI Workflow Secrets](https://thehackernews.com/2026/08/claude-code-and-gemini-cli-flaws-let.html). The Hacker News.
- [Anthropic confirms it leaked 512,000 lines of Claude Code source code](https://www.techradar.com/pro/security/anthropic-confirms-it-leaked-512-000-lines-of-claude-code-source-code-spilling-some-of-its-biggest-secrets). TechRadar. Also covered by [InfoQ](https://infoq.com/news/2026/04/claude-code-source-leak) and [Layer5](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history/).

### Observability and operations

- [OpenAI Codex Observability & Monitoring with OpenTelemetry](https://signoz.io/docs/codex-monitoring/). SigNoz. Note that tool results are exported even when prompt logging is off.
- [Codex CLI Observability: OpenTelemetry Traces, Metrics, and Production Monitoring](https://codex.danielvaughan.com/2026/04/20/codex-cli-observability-opentelemetry-traces-metrics-production-monitoring/)
- [Where the Codex CLI stores its cache, and how to clear it safely](https://tokki.sh/clean/codex-cli-cache)
- [Codex CLI Config Location: ~/.codex Paths](https://inventivehq.com/knowledge-base/openai/where-configuration-files-are-stored). Inventive HQ.

### Community analysis

- [How Claude Code Manages Local Storage for AI Agents](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md). Milvus.
- [Claude Code is quietly eating your disk](https://bestagent.dev/claude-code-disk-usage-cleanup/). bestagent.dev.
- [Claude Code deletes your old session logs after 30 days by default](https://brycewatson.com/blog/28-claude-code-deletes-old-logs/). Bryce Watson.
- [Storage location and retention period of Claude Code conversation history](https://dev.classmethod.jp/en/articles/claude-code-conversation-history-retention/). DevelopersIO.
- [The Claude Code folder that keeps everything you type, in plain text](https://wmedia.es/en/tips/claude-code-conversations-plaintext-on-disk). wmedia.es.
- [Configuring Claude Code for Privacy and Noise Control](https://www.vincentschmalbach.com/configuring-claude-code-for-privacy-and-noise-control/). Vincent Schmalbach.
- [Claude Code environment variables full list](https://gist.github.com/jedisct1/9627644cda1c3929affe9b1ce8eaf714). Community gist. Unofficial, treated as weakest.

Every claim marked REPORTED rests on a source above. Every claim marked MEASURED
rests on a command in this chapter. Claims marked DOCUMENTED cite a vendor page.
