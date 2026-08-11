<!-- 11archive-source: README.md -->

# How AI coding agents handle memory files

- **Created:** 2026-08-11
- **Subject:** the `memory.md` pattern (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, rules files, auto-memory directories) across modern agent harnesses and surfaces, at three scopes: global, project, and thread.
- **Audience:** people who build agent harnesses, or who set up agent instructions for a team.
- **Evidence boundary:** vendor documentation, published specifications, vendor engineering posts, peer-reviewed and preprint research, and public issue trackers. No private surfaces, no paid-tier features tested by hand, no code read from closed products.

A "harness" here means the program that wraps a model and feeds it context: Claude Code, Codex CLI, Cursor, and so on. A "surface" means the product a person actually talks to: a terminal, an IDE panel, a chat app.

## Read in this order

| File | What it answers |
|---|---|
| 00-executive-brief.md | What the evidence says, and what to do about it |
| 01-scope-model.md | What global, project, and thread scope really mean, and the two rival resolution rules |
| 02-harness-mechanics.md | Exact paths, load order, and size caps for 15 harnesses, plus the API layer and chat surfaces |
| 03-thread-continuity.md | What happens to memory inside one long session: compaction, handoff, checkpoints, resume |
| 04-write-path.md | Who writes the memory file, when, and with whose approval |
| 05-failure-modes.md | The seven ways memory files fail, with the fix for each |
| 06-design-playbook.md | A concrete layout to copy, plus rules for keeping it alive |
| 07-glossary.md | Terms used across this report |
| 08-methodology-and-sources.md | How the research was done, what it does not cover, full source list |

Machine-readable comparison matrix: [data.json](data.json).
Single-file interactive version: [report.html](report.html).

## One-paragraph summary

Every serious harness now ships the same three-layer idea: a file for you, a file for your team, and something that carries state inside a session. They disagree about almost everything else. Half of them concatenate every file they find, half of them let the nearest file win, and the two behaviours look identical until a rule silently stops applying. The file is context, never enforced configuration, so nothing in it is a guarantee. And the layer where knowledge actually gets lost is not the file at all, it is the thread: compaction throws away most of a session, and only some harnesses re-inject the project file afterwards.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

- **Created:** 2026-08-11
- **Scope:** memory files at global, project, and thread scope across 15 agent harnesses, the Claude memory tool API, and 2 chat surfaces
- **Evidence:** vendor docs, published specs, vendor engineering posts, research preprints, public issue trackers

## Result

The memory file won. The semantics did not.

Every agent harness examined loads a markdown file of standing instructions before work starts. Most now read the same filename, `AGENTS.md`, which is stewarded by the Agentic AI Foundation under the Linux Foundation and used by more than 60,000 open-source projects ([agents.md](https://agents.md/)). But behind the shared filename sit two incompatible rules for combining files, three different write paths, and size budgets that differ by a factor of ten. A team that standardises on the filename and assumes the behaviour follows will get silent, intermittent rule loss.

Four findings change what you should do next.

### 1. There are two rival merge rules, and they look the same until they don't

Given a rule in `/AGENTS.md` and a contradicting rule in `/packages/api/AGENTS.md`:

- **Concatenate-all harnesses** put both in context and let the model decide. Claude Code says so plainly: "All discovered files are concatenated into context rather than overriding each other" ([Claude Code memory docs](https://code.claude.com/docs/en/memory)). Gemini CLI does the same, layering global, then workspace, then just-in-time directory files ([Gemini CLI docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md)).
- **Nearest-wins harnesses** treat the closer file as an override. The `AGENTS.md` spec is explicit: "the closest AGENTS.md to the edited file wins" ([agents.md](https://agents.md/)). Codex concatenates root-down and says later files override earlier guidance ([Codex AGENTS.md guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md)).

The failure this produces is nasty because it is probabilistic, not deterministic. Under concatenation, two contradicting rules both sit in context and the model picks one. Claude's own docs warn: "if two rules contradict each other, Claude may pick one arbitrarily."

**Do this:** never write contradicting rules across levels. Write child files that add, not files that overrule. If you need an override, use a harness that has one (`AGENTS.override.md` in Codex) or delete the parent rule.

### 2. The file is context, not configuration

No harness enforces its memory file. Claude Code states it directly: memory is treated "as context, not enforced configuration," it is "delivered as a user message after the system prompt," and "there's no guarantee of strict compliance" ([Claude Code memory docs](https://code.claude.com/docs/en/memory)).

Research puts a number on the ceiling. IFScale tested 20 models from seven providers on packing many instructions into one prompt. The best frontier models reached 68% adherence at 500 instructions, with a measured bias toward instructions that appeared earlier ([arXiv 2507.11538](https://arxiv.org/pdf/2507.11538)). Separately, Chroma tested 18 frontier models and found accuracy falls as input grows, well before any documented context limit ([Chroma, Context Rot](https://www.trychroma.com/research/context-rot)).

**Do this:** put anything that must always happen into a hook, a permission rule, or CI. Claude Code's own guidance says to use a `PreToolUse` hook "to block an action regardless of what Claude decides." Keep the memory file for guidance the model can reasonably weigh.

### 3. Thread scope is where knowledge actually dies, and vendors now disagree publicly

Global and project files reload every session. The thread is the lossy layer, and 2026 saw the field split.

- **Summarise:** Claude Code replaces the conversation with a structured summary at roughly 95% of the window. Codex CLI compacts on a token limit, keeps about 20,000 tokens of recent user messages, discards the rest, then re-reads up to five recently edited files ([compaction comparison](https://gist.github.com/badlogic/cd2ef65b0697c4dbe2d13fbecb0a0a5f)).
- **Re-seed:** Amp removed compaction entirely and shipped `/handoff`, which starts a fresh thread seeded with extracted context and a stated goal. The reasoning given was that repeated summarisation produces summaries of summaries that distort earlier reasoning ([Tessl on Amp handoff](https://tessl.io/blog/amp-retires-compaction-for-a-cleaner-handoff-in-the-coding-agent-context-race/)).

What survives compaction is harness-specific and rarely documented. Claude Code re-injects project-root `CLAUDE.md`, but nested `CLAUDE.md` files and path-scoped rules are not re-injected, and the skills listing is dropped entirely ([Claude Code memory docs](https://code.claude.com/docs/en/memory)).

**Do this:** assume anything said only in chat is gone after compaction. If a decision matters past the next hour, write it to a file. Test what your harness re-injects: in Claude Code, `/context` lists the memory files actually loaded.

### 4. Agents now write their own memory by default, and that is a new supply chain

Claude Code's auto memory is on by default, writes to `~/.claude/projects/<project>/memory/`, and loads the first 200 lines or 25KB of `MEMORY.md` into every session ([Claude Code memory docs](https://code.claude.com/docs/en/memory)). ChatGPT's "dreaming" curates memory in the background with no user prompt, and Dreaming V3 began rolling out on 4 June 2026 ([OpenAI](https://openai.com/index/chatgpt-memory-dreaming/)). Windsurf's Cascade writes memories on its own into `~/.codeium/windsurf/memories/` ([Cascade memories docs](https://docs.devin.ai/desktop/cascade/memories)).

This is useful and it is also an attack surface. The MINJA attack poisons an agent's long-term memory using nothing but ordinary queries, no elevated access, and reports over 95% injection success in its setting ([arXiv 2503.03704](https://arxiv.org/abs/2503.03704)). Anthropic's own memory-tool documentation makes path-traversal protection the developer's responsibility and warns that a path like `/memories/../../secrets.env` reaches outside the memory directory ([memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)).

**Do this:** read what your agent wrote. `/memory` in Claude Code opens the folder. Treat agent-written memory as untrusted input on read, not just on write. Never let a memory file be the only record of a security-relevant decision.

## The numbers that constrain design

| Constraint | Value | Harness | Source |
|---|---|---|---|
| Recommended file size | under 200 lines | Claude Code `CLAUDE.md` | [docs](https://code.claude.com/docs/en/memory) |
| Hard cap on combined instructions | 32 KiB (`project_doc_max_bytes`) | Codex | [docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Auto-memory index loaded per session | first 200 lines or 25KB | Claude Code `MEMORY.md` | [docs](https://code.claude.com/docs/en/memory) |
| Global rules file cap | 6,000 characters | Windsurf Cascade | [docs](https://docs.devin.ai/desktop/cascade/memories) |
| Per-workspace rule file cap | 12,000 characters | Windsurf Cascade | [docs](https://docs.devin.ai/desktop/cascade/memories) |
| Recommended rule size | under 500 lines | Cursor | [docs](https://cursor.com/docs/context/rules) |
| Import recursion depth | 4 hops | Claude Code `@path` | [docs](https://code.claude.com/docs/en/memory) |

The smallest hard cap in the set is 32 KiB. If you want one instruction file to work across tools, design to that, not to the largest window you can find.

## What to do on Monday

1. **Write one `AGENTS.md` at the repo root.** Keep it under 200 lines. It is the only file with near-universal support.
2. **Bridge, do not duplicate.** For Claude Code, create a `CLAUDE.md` whose first line is `@AGENTS.md`, then add Claude-specific lines below it. Anthropic documents this exact pattern, along with a symlink alternative.
3. **Scope the rest by path, not by prose.** Use `paths:` frontmatter in `.claude/rules/`, `applyTo:` in Copilot instruction files, `globs:` in Cursor `.mdc` rules. A rule that loads only when a matching file is opened costs nothing the rest of the time.
4. **Move procedures out of the always-on file.** Multi-step workflows belong in skills, which load name and description only until invoked, roughly 30 to 80 tokens each ([progressive disclosure](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure)).
5. **Enforce with hooks, not with capital letters.** All-caps insistence is not a control.
6. **Put a review of agent-written memory in your routine.** Weekly is enough. Delete stale entries; they do not expire on their own.
7. **Delete aggressively.** Anthropic's own advice, from the person who built Claude Code, is to delete your instruction files every six months and see what the model does without them ([Delete your CLAUDE.md](https://charliehills.substack.com/p/delete-your-claudemd)).

## Confidence and limits

- **High confidence:** file paths, load order, size caps, and command names taken from current vendor documentation. Each is cited at the point of use in 02-harness-mechanics.md.
- **Medium confidence:** compaction thresholds and internals for products that do not document them. Sourced from vendor issue trackers and one detailed public comparison. Marked as such in 03-thread-continuity.md.
- **Low confidence:** memory-benchmark scores such as LOCOMO. Vendors tune against their own harnesses and independent reproductions differ widely. Reported as a range with the caveat attached, never as a ranking.
- **Not covered:** performance measurement of our own. Nothing here was benchmarked first-hand. See 08-methodology-and-sources.md.

---

<!-- 11archive-source: 01-scope-model.md -->

# The scope model: global, project, thread

- **Created:** 2026-08-11

Start with a concrete case. You prefer tabs. Your team uses spaces. Today you are debugging one flaky test and you told the agent to skip the linter this once. Three facts, three lifetimes:

- Tabs follow you between jobs. That is **global scope**.
- Spaces belong to the repository and every teammate. That is **project scope**.
- Skip the linter dies when the conversation ends. That is **thread scope**.

Every harness in this report implements those three lifetimes. What they disagree on is how the layers combine, who may write to each, and what happens to the third one when the conversation gets long.

## The three scopes, defined

### Global scope

Instructions attached to the person or the machine, applied to every project.

- Claude Code: `~/.claude/CLAUDE.md` and `~/.claude/rules/*.md`
- Codex: `~/.codex/AGENTS.md` (or `AGENTS.override.md`, which wins)
- Gemini CLI: `~/.gemini/GEMINI.md`
- Junie: `~/.junie/AGENTS.md`
- Cursor: User Rules, stored in settings rather than a file
- Windsurf: `global_rules.md`, capped at 6,000 characters

Above global there is sometimes a fourth layer nobody chose: **managed policy**. Claude Code reads an organisation-wide file from a system path, for example `/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS, and that file "cannot be excluded by individual settings" ([docs](https://code.claude.com/docs/en/memory)). Cursor's Team Rules play the same role from a dashboard and take precedence over both project and user rules ([docs](https://cursor.com/docs/context/rules)). If you are writing policy for a company, this layer is the only one an engineer cannot switch off.

### Project scope

Instructions that live in the repository and travel with it through version control. This is the layer `AGENTS.md` standardised.

Two sub-layers matter:

1. **Repository root.** One file, everyone gets it, always loaded.
2. **Subdirectory.** A file deeper in the tree that applies to part of the codebase. The OpenAI monorepo runs 88 of them ([agents.md](https://agents.md/)).

Project scope also has a private twin: a personal file inside the project that you do not commit. Claude Code uses `CLAUDE.local.md` and tells you to gitignore it. Windsurf's Cascade memories are per-workspace but stored in your home directory and never committed ([docs](https://docs.devin.ai/desktop/cascade/memories)).

### Thread scope

State that exists only inside the current conversation: what you said, what the agent read, what it decided. Nothing here is a file, which is exactly why it is fragile. 03-thread-continuity.md covers it in full.

A useful analogy: global and project scope are the notice board, thread scope is the conversation happening in front of it. Compaction is someone erasing most of the conversation and leaving a sticky note that says "we discussed the API, it went fine."

## The two rival resolution rules

This is the single most consequential difference between harnesses.

### Rule A: concatenate everything

The harness collects every file it finds along the path and puts all of them in context, in order. Nothing is removed. Conflicts are handed to the model.

Claude Code, in its own words: "All discovered files are concatenated into context rather than overriding each other. Across the directory tree, content is ordered from the filesystem root down to your working directory" ([docs](https://code.claude.com/docs/en/memory)). Within one directory, `CLAUDE.local.md` is appended after `CLAUDE.md`, so the personal note is the last thing read at that level.

Gemini CLI does the same across three tiers: global home file, then workspace files and their parents, then a just-in-time scan when a tool touches a directory ([docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md)).

Junie combines global and project guidelines, "marks them clearly," removes duplicates automatically, and resolves conflicts in favour of project level ([docs](https://junie.jetbrains.com/docs/guidelines-and-memory.html)). That is concatenation with an explicit tie-break, which is the better version of this design.

### Rule B: nearest file wins

The harness picks one file per level and lets the closest one override what came before.

The `AGENTS.md` specification says it plainly: "the closest AGENTS.md to the edited file wins; explicit user chat prompts override everything" ([agents.md](https://agents.md/)).

Codex implements a strict version. At each directory it checks `AGENTS.override.md`, then `AGENTS.md`, then any configured fallback filename, and "includes at most one file per directory." It concatenates root-down, and later files override earlier guidance. The walk stops at your current working directory, so files deeper in the tree are never read ([docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md)).

Cursor states an explicit precedence chain: Team Rules, then Project Rules, then User Rules, with earlier sources winning conflicts ([docs](https://cursor.com/docs/context/rules)).

### Why the difference bites

Under Rule A, a contradiction is not resolved, it is deferred. Both statements sit in the prompt, and which one the model follows depends on wording, position, and luck. Claude's documentation admits this: "If two files give different guidance for the same behavior, Claude may pick one arbitrarily."

Under Rule B, a contradiction is resolved, but silently, and possibly not the way you meant. A root rule you consider non-negotiable disappears the moment a subdirectory file mentions the same topic.

Neither is wrong. The mistake is writing files as if your harness used the other rule.

**Practical test:** put a deliberately absurd rule in the parent file ("always name test files `zzz_*.ts`") and a contradicting one in the child. Ask the agent which applies. You will learn your harness's real behaviour in one minute.

## Three loading strategies, not two

Scope answers "whose rule is it." Loading answers "when does it cost tokens." Harnesses now use three strategies, and the newer ones matter more than the scope debate.

### Eager: always in context

The file loads at session start, every session, whatever the task. Claude Code loads ancestor `CLAUDE.md` files "in full at launch." Codex builds its instruction blob before the first turn. This is simple and it is the only strategy where you can be confident the text was seen.

Cost: constant. A 200-line file is roughly 2,000 tokens on every single request for the life of the session.

### Conditional: loads when a matching file is touched

The rule carries a glob pattern and enters context only when the agent reads a file that matches.

- Claude Code `.claude/rules/*.md` with `paths:` frontmatter. Rules without `paths` load unconditionally. Path-scoped rules "trigger when Claude reads files matching the pattern, not on every tool use" ([docs](https://code.claude.com/docs/en/memory)).
- Copilot `*.instructions.md` with `applyTo:` glob frontmatter ([GitHub docs](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)).
- Cursor `.mdc` rules with `globs:` frontmatter.
- Windsurf rules in `glob` activation mode.
- Kiro steering files with `inclusion: fileMatch`.

Cost: zero until it fires. This is the highest-leverage change most teams can make to a bloated instruction file.

### Deferred: loads when the model decides it is relevant

Only a name and a one-line description sit in context. The body loads if the agent judges it useful.

- Claude Code skills, and rules that live in skills rather than `.claude/rules/`
- Cursor "Apply Intelligently" rules, selected on the `description` field
- Windsurf `model_decision` rules
- Kiro `inclusion: auto` steering
- OpenHands knowledge microagents, triggered by keywords in the conversation ([docs](https://docs.openhands.dev/overview/skills))
- Devin knowledge items, each with a "trigger description" used as a semantic cue, not a keyword match ([docs](https://docs.devin.ai/onboard-devin/knowledge-onboarding))

Cost: about 30 to 80 tokens per item at rest ([progressive disclosure analysis](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure)). Anthropic frames this as treating the context window as a public good.

Risk: the agent has to choose correctly. A deferred rule that never triggers is a rule that does not exist. Write descriptions that name the situation, not the topic. "Use when editing database migrations" beats "database conventions."

## Where each scope is allowed to be written

| Scope | Human writes | Agent writes | Committed to git | Survives machine change |
|---|---|---|---|---|
| Managed policy | Admin, via MDM or dashboard | No | Usually not | Yes, via device management |
| Global | Yes | Sometimes (Gemini CLI `/memory add`) | No | Only if you sync dotfiles |
| Project, shared | Yes | Yes, on request | Yes | Yes |
| Project, private | Yes | Yes | No, gitignored | No |
| Agent auto-memory | Yes, by editing | Yes, unprompted | No, outside the repo | No |
| Thread | Yes, by talking | Yes | No | No |

Two rows deserve attention.

**Agent auto-memory is not in your repository.** Claude Code stores it under `~/.claude/projects/<project>/memory/`, keyed on the git repository so every worktree shares one directory, and states plainly that files "are not shared across machines or cloud environments" ([docs](https://code.claude.com/docs/en/memory)). Windsurf memories live in `~/.codeium/windsurf/memories/` and are "not committed to your repository." A teammate gets none of it. A fresh CI container gets none of it.

**Thread state is the only scope with no file**, which is why every harness eventually grew a way to dump it to one: `/handoff` in Amp, progress files in the Anthropic long-running-agent pattern, `activeContext.md` in Cline.

## A note on subagents

Delegating to a subagent creates a new thread with a new context window, so the scope question repeats one level down. Claude Code documents the answer precisely: a subagent receives the full `CLAUDE.md` hierarchy including user, project, local, and managed files, but it does **not** receive the main conversation's auto memory. Built-in Explore and Plan agents skip `CLAUDE.md` entirely to stay cheap. A subagent can be given its own persistent memory with a `memory: user | project | local` field, stored at `~/.claude/agent-memory/<name>/`, `.claude/agent-memory/<name>/`, or `.claude/agent-memory-local/<name>/` ([subagent docs](https://code.claude.com/docs/en/sub-agents)).

The practical consequence: a rule you rely on may not reach the worker that does the job. Anthropic's own guidance is to restate it in the delegation prompt, giving the example "ignore the `vendor/` directory."

---

<!-- 11archive-source: 02-harness-mechanics.md -->

# Harness mechanics, tool by tool

- **Created:** 2026-08-11
- **Confidence:** every path, cap, and command below comes from current vendor documentation or the vendor's public issue tracker. Items sourced only from secondary write-ups are marked `[secondary]`.

## Quick comparison

| Harness | Global file | Project file | Subdirectory files | Merge rule | Hard size cap | Agent writes memory |
|---|---|---|---|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, `~/.claude/rules/` | `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/` | Yes, on demand | Concatenate all | None on `CLAUDE.md`; 200 lines / 25KB on `MEMORY.md` | Yes, on by default |
| Codex | `~/.codex/AGENTS.md` | `AGENTS.md` from git root down | Only down to cwd | Nearest wins | 32 KiB combined | No |
| Gemini CLI | `~/.gemini/GEMINI.md` | `GEMINI.md` and parents | Yes, just-in-time | Concatenate all | Not documented | Yes, via `/memory add` |
| Cursor | User Rules (settings) | `.cursor/rules/*.mdc`, `AGENTS.md` | Yes, nested dirs | Team, then project, then user | 500 lines advised | Removed in 2.1.x `[secondary]` |
| GitHub Copilot | Personal instructions | `.github/copilot-instructions.md`, `AGENTS.md` | Yes, nested `AGENTS.md` | Additive | Not documented | No |
| Windsurf Cascade | `global_rules.md` | `.windsurf/rules/*.md`, `AGENTS.md` | Not documented | Additive | 6,000 / 12,000 chars | Yes, auto |
| Junie | `~/.junie/AGENTS.md` | `.junie/AGENTS.md`, `AGENTS.md` | Not documented | Both loaded, project wins | Not documented | Not documented |
| Amp | Not documented | `AGENTS.md` | Yes, hierarchical `[secondary]` | Nearest extends or overrides `[secondary]` | Not documented | No, uses threads |
| Cline | Not documented | `.clinerules/`, memory bank files | Not documented | All read at task start | Not documented | Yes, on command |
| OpenHands | Not documented | `.openhands/microagents/repo.md` | Not documented | Repo file plus triggered agents | Not documented | No |
| Devin | Knowledge base, pinned | Auto-imported from rule files | Not documented | Semantic trigger | Not documented | Yes, auto-suggested |
| Kiro | `~/.kiro/steering/` | `.kiro/steering/*.md` | Not documented | Project only, in CLI | Not documented | No |
| Amazon Q | Not documented | `.amazonq/rules/` | Not documented | Additive | Not documented | Yes, generated bank |
| Aider | Config file | `CONVENTIONS.md` | No | Loaded read-only | Not documented | No |
| Zed | `AGENTS.md` personal | `AGENTS.md` | Yes | Not documented | Not documented | No |

## Claude Code

Source: [How Claude remembers your project](https://code.claude.com/docs/en/memory), [Create custom subagents](https://code.claude.com/docs/en/sub-agents), [Explore the context window](https://code.claude.com/docs/en/context-window).

Claude Code runs two systems side by side. You write `CLAUDE.md`. Claude writes auto memory. Both load at the start of every conversation.

### File locations, broadest first

| Scope | Path | Shared with |
|---|---|---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux and WSL `/etc/claude-code/CLAUDE.md`, Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | Everyone on the machine |
| User | `~/.claude/CLAUDE.md`, `~/.claude/rules/*.md` | You, all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md`, `./.claude/rules/**/*.md` | Team, via git |
| Local | `./CLAUDE.local.md` | You, this project |

### Load order

1. Walk up from the working directory. Every `CLAUDE.md` and `CLAUDE.local.md` in an ancestor directory loads in full at launch.
2. Order is filesystem root down to the working directory, so the closest file is read last.
3. Within a directory, `CLAUDE.local.md` is appended after `CLAUDE.md`.
4. Files in subdirectories below the working directory are discovered but load on demand, when Claude reads a file in that directory.
5. Everything is concatenated. Nothing overrides anything.

Managed policy content can also be inlined in `managed-settings.json` under the `claudeMd` key. It loads before user and project files and is honoured only in managed or policy settings.

### Imports

`@path/to/file` pulls another file in at launch. Relative paths resolve against the file containing the import, not the working directory. Recursion is allowed up to four hops. Import parsing skips code spans and fenced blocks, so `` `@README` `` in backticks stays literal.

Imports that resolve outside the working directory trigger a one-time approval dialog, because a teammate could commit one. Imports in user-scope files load without a dialog.

Splitting a large file into imports helps organisation but not context cost: "imported files still load and enter the context window at launch."

### Rules directory

`.claude/rules/*.md`, discovered recursively, subdirectories allowed. YAML frontmatter with a `paths:` list scopes a rule to matching files:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.{ts,tsx}"
---
# API rules
- All endpoints validate input.
```

Rules without `paths` load at launch with the same priority as `.claude/CLAUDE.md`. User rules in `~/.claude/rules/` load before project rules, giving project rules higher priority. Brace expansion in `paths` shares a budget of 1,000 expanded patterns and 4 MiB per rule. Symlinks are supported and circular symlinks are handled.

### Size and hygiene

- Target under 200 lines per `CLAUDE.md`. Files load in full regardless of length, "though shorter files produce better adherence."
- Block-level HTML comments are stripped before injection, so `<!-- notes for humans -->` costs no tokens.
- `claudeMdExcludes` takes glob patterns matched against absolute paths, configurable at any settings layer, arrays merge across layers. Managed policy files cannot be excluded.
- `/doctor` proposes trims for a checked-in `CLAUDE.md`, cutting what Claude can derive from the codebase and keeping pitfalls and rationale (v2.1.206 or later).

### Auto memory

- On by default. Toggle in `/memory`, or set `autoMemoryEnabled: false`, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.
- Directory: `~/.claude/projects/<project>/memory/`, keyed on the git repository, so all worktrees and subdirectories of one repo share it. Relocate with `autoMemoryDirectory`, which must be absolute or start with `~/`, and which requires the workspace trust dialog when set in project settings.
- `MEMORY.md` is an index. The first 200 lines or 25KB, whichever comes first, load at session start. Everything past that is dropped.
- Topic files such as `debugging.md` do not load at startup. Claude reads them on demand.
- Writing over the limit still succeeds but returns an error instructing Claude to rewrite the index. YAML frontmatter and block-level HTML comments are stripped before measuring (v2.1.211 or later).
- A `modified` ISO 8601 timestamp is written into frontmatter on each write, if the file already has frontmatter (v2.1.214 or later).
- Machine-local. Not shared across machines or cloud environments.

### Compatibility with other tools

Claude Code reads `CLAUDE.md`, not `AGENTS.md`. The documented bridge:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

A symlink works when you need no Claude-specific content: `ln -s AGENTS.md CLAUDE.md`. On Windows, symlinks need Administrator or Developer Mode, so use the import.

`/init` reads Cursor rules (`.cursor/rules/`, `.cursorrules`) and Copilot rules (`.github/copilot-instructions.md`). With `CLAUDE_CODE_NEW_INIT=1` it also reads `AGENTS.md`, `.devin/rules/`, `.windsurf/rules/` or `.windsurfrules`, and `.clinerules`. `/import` copies another agent's configuration in, including MCP servers, commands, subagents, and skills (v2.1.213 or later).

### Diagnostics

- `/context` lists the memory files that actually loaded. This is the ground truth, not the docs.
- `/memory` lists file locations, toggles auto memory, opens the memory folder.
- The `InstructionsLoaded` hook logs which instruction files load, when, and why.

## OpenAI Codex

Source: [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

Discovery runs in two stages.

**Global.** Look in the Codex home directory, default `~/.codex`, overridable with `CODEX_HOME`. Read `AGENTS.override.md` if present, otherwise `AGENTS.md`. Only the first non-empty file at this level is used.

**Project.** Start at the git root and walk down to the current working directory. In each directory check `AGENTS.override.md`, then `AGENTS.md`, then any name in `project_doc_fallback_filenames`. At most one file per directory.

Merge: concatenate root-down, joined with blank lines. Later files, meaning those closer to the working directory, override earlier guidance.

Caps and behaviour:

- `project_doc_max_bytes`, default 32 KiB, stops the combined instruction blob from growing further.
- Empty files are skipped.
- The walk stops at the current directory. Files deeper in the tree are never read, so run Codex from the directory whose rules you want.
- `AGENTS.override.md` is the intended tool for a temporary change without editing the base file.

## Gemini CLI

Source: [Provide context with GEMINI.md files](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md).

Three tiers, concatenated and sent with every prompt:

1. Global: `~/.gemini/GEMINI.md`.
2. Workspace: `GEMINI.md` in configured workspace directories and their parents.
3. Just-in-time: when a tool touches a file or directory, the CLI scans that location and its ancestors up to a trusted root.

The filename is configurable, which makes Gemini CLI the easiest harness to point at a shared file:

```json
{ "context": { "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"] } }
```

Imports use `@file.md` with relative or absolute paths. Commands: `/memory show` prints the exact concatenated context, `/memory reload` re-scans, `/memory add <text>` appends to the global `~/.gemini/GEMINI.md`.

`/memory show` is the most useful debugging command in any harness surveyed, because it prints the literal text the model receives.

## Cursor

Source: [Rules](https://cursor.com/docs/context/rules).

Four activation modes, set in `.mdc` frontmatter:

| Mode | Frontmatter | Fires when |
|---|---|---|
| Always Apply | `alwaysApply: true` | Every chat |
| Apply Intelligently | `description: ...` | Agent judges it relevant |
| Apply to Specific Files | `globs: ...` | A matching file is in play |
| Apply Manually | neither | You type `@rule-name` |

Storage: `.cursor/rules/` in the project, version controlled, nested directories supported. User Rules are global and live in settings, chat only. Team Rules come from the dashboard on Team and Enterprise plans.

Precedence: Team Rules, then Project Rules, then User Rules. Earlier sources win conflicts.

`AGENTS.md` is supported as a plain-markdown alternative in the root or subdirectories, with no metadata required. Guidance is to keep a rule under 500 lines and split larger guidance into composable rules, and to reference files rather than copying code so rules do not go stale.

The Memories feature that stored conversation facts at project level was introduced in mid-2025 and removed from version 2.1.x, with users advised to export and convert to Rules `[secondary, see 08-methodology-and-sources.md]`.

## GitHub Copilot

Source: [Adding repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot), [agent-specific instructions changelog](https://github.blog/changelog/2025-11-12-copilot-code-review-and-coding-agent-now-support-agent-specific-instructions/).

Three file types:

1. `.github/copilot-instructions.md`, repository-wide.
2. `.github/instructions/**.instructions.md`, path-scoped through `applyTo` frontmatter, for example `applyTo: "app/models/**/*.rb"`.
3. `AGENTS.md` at the root, plus nested `AGENTS.md` for parts of the project.

The coding agent also reads `CLAUDE.md` and `GEMINI.md`, which makes Copilot the most permissive reader in the set. On github.com, path-specific instructions currently apply only to the cloud agent and to code review.

## Windsurf Cascade

Source: [Cascade memories](https://docs.devin.ai/desktop/cascade/memories). Note that the Windsurf documentation domain now redirects to `docs.devin.ai`, following Cognition's acquisition.

Two mechanisms, deliberately separated:

**Rules.** Durable, explicit, version controlled, team-shareable. Four activation modes: `always_on`, `model_decision`, `glob`, `manual` (`@rule-name`). Files live in `.windsurf/rules/`. Global rules go in `global_rules.md`.

**Memories.** Auto-generated by Cascade when it encounters useful context, or created on request ("create a memory of..."). Stored in `~/.codeium/windsurf/memories/`. Scoped to one workspace: "Memories generated in one workspace are not available in another, and they are not committed to your repository." Cascade retrieves them when it judges them relevant.

Hard caps: 6,000 characters for the global rules file, 12,000 characters per workspace rule file. These are the tightest documented budgets in the survey and a good sanity check on how large an always-on instruction file should be.

The documented advice is to use Rules for conventions and constraints, Memories for one-off facts, and `AGENTS.md` for anything the team must share.

## JetBrains Junie

Source: [Guidelines and memory](https://junie.jetbrains.com/docs/guidelines-and-memory.html).

Lookup order at task start:

1. `.junie/AGENTS.md` in the project root
2. `AGENTS.md` in the project root
3. `.junie/guidelines.md` or the `.junie/guidelines/` folder (legacy)

Global guidelines come from `~/.junie/AGENTS.md`, or `%USERPROFILE%\.junie\AGENTS.md` on Windows.

When both global and project guidelines exist, Junie includes both and marks them clearly. Project guidelines win on conflict. Identical content is deduplicated automatically.

Marking the source of each block and deduplicating are both good ideas that most harnesses do not implement.

## Cline

Source: [Memory Bank](https://docs.cline.bot/best-practices/memory-bank).

Cline assumes total amnesia between sessions and compensates with a documented file set that it reads at the start of every task:

| File | Holds |
|---|---|
| `projectbrief.md` | Foundation, why this exists |
| `productContext.md` | Problem and user goals |
| `activeContext.md` | Current focus, changes most often |
| `systemPatterns.md` | Architecture and patterns |
| `techContext.md` | Stack and setup |
| `progress.md` | Status and milestones |

The instructions themselves live in `.clinerules/memory-bank.md`. Operating commands are phrases, not flags: "initialize memory bank", "update memory bank", "follow your custom instructions".

The design point worth stealing: separating slow-changing files from `activeContext.md`, which is expected to churn. Most single-file setups mix both and rot faster.

## OpenHands

Source: [Skills overview](https://docs.openhands.dev/overview/skills).

- Repository instructions: `.openhands/microagents/repo.md`, private to the repository, holding layout, build commands, test conventions, and known traps. YAML frontmatter is optional; without it the file loads with repository-agent defaults.
- Knowledge microagents: triggered by keywords in the conversation or in file content, so narrow domain knowledge stays out of every prompt.
- The newer structure splits a `knowledge/` directory for triggered expertise from a `tasks/` directory for interactive workflows, with `.openhands/microagents/` still supported.

## Devin

Source: [Knowledge onboarding](https://docs.devin.ai/onboard-devin/knowledge-onboarding).

Devin's knowledge base stores items with two parts: content, and a **trigger description** that says when to recall it. The trigger is a semantic cue, not a keyword search. Items can be pinned to all repositories so they always apply.

Devin also auto-imports and updates knowledge from `.rules`, `.mdc`, `.cursorrules`, `.windsurf`, `CLAUDE.md`, and `AGENTS.md`. The documented advice is to review auto-generated knowledge for accuracy before relying on it.

## Kiro and Amazon Q

Kiro steering files live in `.kiro/steering/*.md`, with an `inclusion` key set to always, fileMatch, or manual. Manual steering files appear as slash commands. Two limits are documented in the vendor's issue tracker rather than the product docs: the CLI does not support inclusion modes and loads every file in the directory, and global `~/.kiro/steering/` files are ignored when the project has its own steering folder ([aws/amazon-q-developer-cli#3719](https://github.com/aws/amazon-q-developer-cli/issues/3719)).

Amazon Q Developer stores rules in `.amazonq/rules/` and can generate a memory bank of `product.md`, `structure.md`, `tech.md`, and `guidelines.md` so it does not re-analyse the whole project each time ([AWS docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-memory-bank.html)).

## Aider, Zed, Amp

**Aider** loads a conventions file read-only, configured in `.aider.conf.yml`, pointing at one `CONVENTIONS.md` or several files ([docs](https://aider.chat/docs/usage/conventions.html)). Read-only loading is a small but real design choice: the agent cannot quietly edit its own rules.

**Zed** treats `AGENTS.md` as the primary instruction file for both personal and project guidance, and has moved reusable procedures into a skills system ([Zed instructions](https://zed.dev/docs/ai/instructions)).

**Amp** resolves `AGENTS.md` hierarchically, with subdirectory files extending or overriding the root `[secondary]`. Its distinctive choice is at thread level, covered in 03-thread-continuity.md.

## The API layer: Claude's memory tool

Source: [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool).

If you are building your own harness rather than using one, this is the reference implementation.

- Tool entry: `{"type": "memory_20250818", "name": "memory"}`. Generally available on the Messages API, no beta header.
- Client-side. Claude requests operations; your application executes them against storage you control. `/memories` is a prefix you map onto real storage such as a per-user directory or database keys.
- Commands: `view`, `create`, `str_replace`, `insert`, `delete`, `rename`.
- The API injects a memory protocol into the system prompt automatically. Its core line is worth quoting because it explains the behaviour you will observe: "ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory."
- Security is yours. The docs warn that `/memories/../../secrets.env` reaches outside the directory, and list the defences: validate the `/memories` prefix, resolve to canonical form, reject traversal sequences including URL-encoded ones, cap file sizes, expire old files.
- Pairs with two different context controls: context editing clears specific tool results on the client, compaction summarises the whole conversation server-side. The documented recommendation for long-running agents is to use both, with memory preserving what must survive summarisation.

## Chat surfaces, briefly

Chat products solve the same problem with no filesystem.

**ChatGPT** splits memory into saved memories (an explicit editable list) and referenced chat history. "Dreaming" curates memory in the background without being asked; Dreaming V3 began rolling out on 4 June 2026 ([OpenAI](https://openai.com/index/chatgpt-memory-dreaming/)). Projects can be set to project-only memory, which draws context only from conversations inside that project and ignores global saved memories and other projects ([OpenAI help](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)).

**Claude.ai** builds memory entries as you chat and keeps a running summary you can view and edit in settings. Each project keeps its own separate memory. Incognito chats are excluded from memory and from chat search ([Claude help](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).

The pattern both converge on is worth naming: **a single editable summary plus scoped containers**. Project-only mode in ChatGPT and per-project memory in Claude are the chat equivalent of `.claude/rules/` with a `paths:` filter. Same problem, same answer, no files.

**LangGraph**, for people wiring this themselves, draws the line at exactly the place this report does: checkpointers persist thread-scoped state for conversation continuity and time travel, stores persist cross-thread data such as user preferences and shared facts ([docs](https://docs.langchain.com/oss/python/langgraph/persistence)).

---

<!-- 11archive-source: 03-thread-continuity.md -->

# Thread scope: what happens inside one long session

- **Created:** 2026-08-11

Here is the moment that matters. You are ninety minutes into a session. You told the agent, in chat, "the staging database is read-only, never run migrations against it." The context window fills. The harness compacts. Twenty minutes later the agent runs a migration against staging.

Nothing was misconfigured. The instruction was thread scope, and thread scope is the layer that gets thrown away.

## The three thread-level mechanisms

### Compaction: summarise and continue

The harness detects that the window is nearly full, asks a model to summarise the conversation, and restarts with the summary in place of the history.

Anthropic describes the technique as taking a conversation nearing the limit, summarising it, and reinitiating a new context window with the summary, calling it "the first lever in context engineering" for long-term coherence ([Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

What each harness keeps and drops, from the most detailed public comparison available ([badlogic, compaction research](https://gist.github.com/badlogic/cd2ef65b0697c4dbe2d13fbecb0a0a5f)) plus vendor docs:

| Harness | Trigger | Kept | Dropped |
|---|---|---|---|
| Claude Code | About 95% of the window, or `/compact` | Structured summary covering accomplishments, work in progress, files involved, next steps, key requests | The conversation itself |
| Codex CLI | `model_auto_compact_token_limit`, 180k to 244k depending on model | Summary, plus about 20,000 tokens of recent user messages, plus a re-read of up to 5 recently edited files within a 50,000 token budget | Older assistant turns, tool results, file contents |
| OpenCode | Tokens above context limit minus output limit | Last 40,000 tokens of tool output protected | Tool outputs beyond that, pruned first |
| Amp | Never | Nothing, by design | Nothing, by design |

Codex's numbers come from its own configuration keys and issue tracker `[medium confidence]`. The re-read of recently edited files is a good idea other harnesses have not copied: it repairs the most common post-compaction failure, which is the agent forgetting what a file currently contains.

### Handoff: start a new thread on purpose

Amp removed compaction and shipped `/handoff` instead. The command builds a draft prompt from the current thread, identifies relevant files, lets you state a new goal, and opens a fresh thread seeded with that. The original thread is untouched ([Tessl](https://tessl.io/blog/amp-retires-compaction-for-a-cleaner-handoff-in-the-coding-agent-context-race/)).

The stated reason is worth taking seriously: repeated automatic summarisation produces summaries of summaries, and those "recursive summaries" distort earlier reasoning. Compaction meant to preserve continuity instead introduced drift.

Usage looks like this:

```
/handoff now implement this for teams as well
/handoff execute phase one of the created plan
/handoff check the rest of the codebase and find other places needing this fix
```

The difference from compaction is control. Compaction fires when the window fills and summarises whatever happened to be there. Handoff fires when you finish a phase and carries what you choose. One is triggered by resource pressure, the other by the shape of the work.

### Checkpoints and resume: rewind rather than continue

Claude Code writes a checkpoint before every file edit and on every prompt, keeps file snapshots for the 100 most recent checkpoints in a session, and persists them across sessions so you can rewind inside a resumed conversation. Sessions live in `~/.claude/projects/`, pre-edit file copies in `~/.claude/file-history/<session>/`, with a default 30-day retention that is configurable ([checkpointing docs](https://code.claude.com/docs/en/checkpointing)) `[retention and count from vendor docs and secondary write-ups]`.

Commands: `claude --continue` reopens the most recent session, `claude --resume` picks one from a list, `claude --continue --fork-session` branches so you can try a different approach without losing the original.

Checkpoints solve a different problem from compaction. Compaction is about fitting; checkpoints are about undoing. Both are thread-scope tools and neither replaces the other.

## What survives compaction, precisely

This is the question people get wrong, so here is the documented answer for Claude Code ([memory docs](https://code.claude.com/docs/en/memory), [context window](https://code.claude.com/docs/en/context-window)).

**Reloaded after compaction:**

- The system prompt
- Project-root `CLAUDE.md`, re-read from disk and re-injected
- Auto memory (`MEMORY.md`)
- MCP tool listings

**Not reloaded:**

- Nested `CLAUDE.md` files in subdirectories. They come back the next time Claude reads a file in that directory.
- Rules with `paths:` frontmatter. They come back the next time a matching file is read.
- The skills listing. Only skills you actually invoked are preserved.
- Anything you said only in conversation.

The docs state the diagnosis plainly: "If an instruction disappeared after compaction, it was given only in conversation, lives in a nested CLAUDE.md that hasn't reloaded yet, or is a path-scoped rule that hasn't matched a file since."

Applied to the opening scenario: "never run migrations against staging" was conversation-only. It did not survive. Written into `CLAUDE.md`, it would have.

## Why summarising repeatedly degrades

Two independent lines of evidence.

**Compression is lossy and compounds.** Each compaction is a summary of a context that already contained a summary. Amp's public reasoning names this directly, citing an OpenAI internal report showing accuracy declining as conversations accumulated compression cycles.

**Long contexts degrade before they are full.** Chroma tested 18 frontier models, including the Claude 4 family, GPT-4.1, Gemini 2.5, and Qwen3, on multi-hop tasks from 10,000 to 500,000 tokens. All 18 showed monotonically decreasing F1 as input grew. A 200,000-token window can degrade meaningfully at 50,000 ([Context Rot](https://www.trychroma.com/research/context-rot)). The finding that matters most for memory files: performance collapses faster when the answer is hard to distinguish from surrounding text. A memory file full of generic advice makes the specific rule harder to find, not easier.

Put together: filling the window is not free, and emptying it is not free either. The only cheap move is not putting low-value text there in the first place.

## The pattern that actually works: write it down mid-flight

Anthropic's documented approach for agents that outlive a context window is structured note-taking, meaning the agent writes notes to durable storage as it works and pulls them back later ([Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

The concrete version, from the harness case study ([Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)):

**Initializer session, run once.** Create an `init.sh` that starts the development environment, a progress file that logs what has been done, a feature list in JSON with each item marked passing or failing, and an initial git commit.

**Every session after.** Read the progress file and git log. Pick the highest-priority incomplete feature. Run `init.sh` and do a basic end-to-end check before writing anything. Work on one feature. Commit with a descriptive message. Update the progress file before finishing.

The failure modes it was built to fix, and the fix for each:

| Failure | Fix |
|---|---|
| Agent declares victory early | A feature list with end-to-end descriptions, not code-level ones |
| Environment left broken | Progress notes plus git, and a validation test at session start |
| Features marked done without testing | Explicit prompting to self-verify, using browser automation |
| Time wasted rediscovering setup | `init.sh` handed over at session start |

One rule carries most of the value: mark a feature complete only after end-to-end verification, never when the code is written. Otherwise the progress file becomes confidently wrong, and every later session inherits the error.

The Claude memory tool encodes the same instinct in the system prompt it injects automatically: "ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory" ([memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)).

## Subagents as a thread-scope tool

Delegation is context management. A subagent runs in its own window, does the expensive reading there, and returns only a summary. Claude Code's context walkthrough shows the arithmetic: a subagent reads 6,100 tokens of files and returns 420 tokens to the parent ([context window](https://code.claude.com/docs/en/context-window)).

The catch, documented in the subagent reference: a non-fork subagent starts fresh. It does not see your conversation history, the skills you invoked, or the files already read. It does get the full `CLAUDE.md` hierarchy. It does not get the main conversation's auto memory. A fork is the exception and inherits the parent conversation ([subagent docs](https://code.claude.com/docs/en/sub-agents)).

So delegation preserves the parent thread by discarding the child's. That is the right trade when the child's work is search and the parent's is decision. It is the wrong trade when the child needs a nuance that only ever existed in chat.

## Practical rules for thread scope

1. **Say it once in chat, write it once to a file.** If a correction is worth making, it is worth persisting. In Claude Code, "add this to CLAUDE.md" does it; unprompted, auto memory may catch it anyway.
2. **Compact on your terms.** Run `/compact` at a natural boundary, after finishing a unit of work, rather than letting it fire mid-task at 95%.
3. **Prefer a new thread to a third compaction.** Once a session has compacted twice, a handoff with an explicit goal beats another summary of a summary.
4. **Keep a progress file for anything that spans sessions.** One file, current state and next step, updated at the end of every session.
5. **Verify before you record.** A progress file that says "auth complete" when auth is untested is worse than no file, because the next session will believe it.
6. **Check what reloaded.** After a compaction, `/context` shows which memory files are actually present. Do not assume.

---

<!-- 11archive-source: 04-write-path.md -->

# The write path: who fills the file, and when

- **Created:** 2026-08-11

Two files sit in the same directory. One says "use pnpm, never npm" because a human typed it. The other says "the test suite needs a local Redis instance" because the agent hit the failure twice and wrote itself a note. They load into the same context and the model treats them the same way. They should not be trusted the same way.

This section is about the second kind.

## Four write paths, ranked by how much a human saw

| Path | Who initiates | Human reviews | Example |
|---|---|---|---|
| Hand-authored | Human | By definition | You edit `AGENTS.md` |
| Human-directed | Human asks, agent writes | Usually, in the diff | "add this to CLAUDE.md" |
| Agent-initiated, visible | Agent decides, you are told | Only if you look | Claude Code "Saved 2 memories" |
| Agent-initiated, background | Agent decides, no session signal | Rarely | ChatGPT dreaming |

The trend across 2025 and 2026 is downward through that table. What used to be a file you edited is now, in several products, a file written on your behalf by default.

## Agent-initiated memory, product by product

### Claude Code auto memory

On by default. Claude "saves notes for itself as it works: build commands, debugging insights, architecture notes, code style preferences, and workflow habits," and decides what is worth keeping based on whether it would help a future conversation ([docs](https://code.claude.com/docs/en/memory)).

Mechanics that matter for review:

- Location: `~/.claude/projects/<project>/memory/`, keyed on the git repository, outside the repo.
- `MEMORY.md` is an index; the first 200 lines or 25KB load every session. Topic files load on demand.
- The harness pushes back on bloat. Near a limit, Claude Code reminds Claude to shorten: one line per entry, detail into topic files, merge or drop stale entries. Over a limit, the write succeeds but returns an error telling Claude to rewrite the index, because everything past the limit is silently dropped on the next load.
- Writes stamp a `modified` ISO 8601 timestamp into frontmatter when frontmatter already exists (v2.1.214 or later). This is the only automatic staleness signal found in any harness surveyed.
- Session UI says "Saved 2 memories" or "Recalled 2 memories".
- Everything is plain markdown you can edit or delete. `/memory` opens the folder.

Subagents can have their own, with `memory: user | project | local` selecting `~/.claude/agent-memory/<name>/`, `.claude/agent-memory/<name>/`, or `.claude/agent-memory-local/<name>/`. The `project` scope is the one that reaches version control, so a subagent's accumulated notes can become team knowledge on purpose ([subagent docs](https://code.claude.com/docs/en/sub-agents)).

### Windsurf Cascade memories

Cascade creates memories automatically "when it encounters useful context," and you can ask for one directly. They land in `~/.codeium/windsurf/memories/`, are scoped to a single workspace, are not available in another workspace, and are never committed ([docs](https://docs.devin.ai/desktop/cascade/memories)).

The vendor draws the line explicitly: Rules for conventions and constraints, Memories for one-off facts, `AGENTS.md` or Rules for anything the team needs. That is the clearest statement of the boundary in any documentation reviewed.

### ChatGPT dreaming

Memory curation runs in the background. OpenAI describes dreaming as a method for ChatGPT to automatically curate memories by referencing chat history, and Dreaming V3, rolling out from 4 June 2026, "replaces the saved-memories list as ChatGPT's standalone foundation," with existing memories updating themselves over time ([OpenAI](https://openai.com/index/chatgpt-memory-dreaming/)).

The control that matters is containment: a project set to project-only draws context solely from conversations inside that project and ignores global saved memories and other projects ([OpenAI help](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)).

### Claude.ai memory

Memory entries are built in real time during chats and rolled into a summary you can view and edit in settings. Each project keeps separate memory. Incognito chats are excluded from both memory and chat search ([Claude help](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)).

A single editable summary is the best affordance in this category. It is one artefact to read, not a folder to audit.

### Devin knowledge

Devin auto-generates knowledge and auto-imports from `.rules`, `.mdc`, `.cursorrules`, `.windsurf`, `CLAUDE.md`, and `AGENTS.md`. Each item pairs content with a trigger description used as a semantic cue. The documented advice on setup is to "review any auto-generated Knowledge and verify for completeness and accuracy" ([docs](https://docs.devin.ai/onboard-devin/knowledge-onboarding)).

That review step is the correct default and almost nobody does it.

### Command-driven memory

Some harnesses only write when told, which makes them easier to trust:

- Gemini CLI: `/memory add <text>` appends to the global `~/.gemini/GEMINI.md` ([docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md)).
- Cline: "update memory bank" triggers a full documentation review across the six memory bank files ([docs](https://docs.cline.bot/best-practices/memory-bank)).
- Amazon Q: generates `product.md`, `structure.md`, `tech.md`, and `guidelines.md` into `.amazonq/rules/` on request ([AWS docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-memory-bank.html)).

### Neutral or absent

Codex, Aider, and OpenHands repository instructions have no agent write path found in their documentation. Aider goes further and loads its conventions file read-only, so the agent cannot edit its own rules ([docs](https://aider.chat/docs/usage/conventions.html)).

## What good agent-written memory looks like

The best-documented shape is an index plus topic files:

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # one line per entry, loaded every session
├── debugging.md       # detail, read on demand
├── api-conventions.md
└── ...
```

Three properties make this work, and they generalise to any harness you build:

1. **The always-loaded part is bounded.** 200 lines or 25KB. A bound the agent is told about and reminded of.
2. **Detail is one hop away, not in context.** Topic files are read when needed. This is the same progressive disclosure that skills use.
3. **The index is a map, not a summary.** Its job is to tell the agent what exists and where, so retrieval is cheap.

Cline's memory bank reaches the same conclusion by a different route: split fast-changing state (`activeContext.md`, `progress.md`) from slow-changing state (`projectbrief.md`, `techContext.md`), so churn is contained to two files instead of smeared across one.

## Prompting the write path

Anthropic's memory tool documentation gives the two prompts that shape what gets written, and both are worth copying into any harness:

Keep it tidy:

> Note: when editing your memory folder, always try to keep its content up-to-date, coherent and organized. You can rename or delete files that are no longer relevant. Do not create new files unless necessary.

Keep it narrow:

> Only write down information relevant to \<topic> in your memory system.

The second is the underused one. An unbounded memory brief produces a memory directory about everything, which is a memory directory about nothing.

## Review, decay, and deletion

No harness surveyed expires memories on its own. Claude Code's `modified` timestamp tells you a fact's age but does not act on it. Anthropic's memory tool documentation lists expiry as the developer's job: "Periodically delete memory files that haven't been accessed in a long time."

So decay is a human practice. A workable minimum:

1. **Weekly, skim the index.** `/memory` in Claude Code, `~/.codeium/windsurf/memories/` in Windsurf, settings summary in Claude.ai and ChatGPT.
2. **Delete anything about a system that changed.** Memory does not know you migrated off Redis.
3. **Promote anything a teammate would need.** If the agent learned it and it is true for everyone, it belongs in `AGENTS.md`, in the repository, in git. Agent memory is machine-local and dies with the laptop.
4. **Delete anything you cannot verify.** An unverifiable claim in memory is worse than an absent one, because it will be repeated with confidence.

## The trust question

The four write paths carry different risk, and the products do not distinguish them in context. A line the agent inferred from one flaky test run and a line your staff engineer wrote arrive in the same prompt with the same weight.

That asymmetry is the root of the security problem covered in 05-failure-modes.md. The mitigation is structural, not clever: keep agent-written memory in a separate file from hand-authored rules, so you can read it as a category. Every harness surveyed already does this by putting auto-memory outside the repository. Do not undo it by asking the agent to write into `AGENTS.md` directly.

---

<!-- 11archive-source: 05-failure-modes.md -->

# Seven ways memory files fail

- **Created:** 2026-08-11

Each failure below is stated as the symptom you will actually see, then the cause, then the fix.

## 1. The rule is there and the agent ignores it

**Symptom.** `CLAUDE.md` says "run `npm test` before committing." The agent commits without testing. `/context` confirms the file loaded.

**Cause.** Memory files are context, not configuration. Claude Code says so: instructions are "delivered as a user message after the system prompt," Claude "tries to follow it, but there's no guarantee of strict compliance" ([docs](https://code.claude.com/docs/en/memory)).

The ceiling is measurable. IFScale tested 20 models across seven providers on instruction density and found the best frontier models reached 68% adherence at 500 instructions, with a documented bias toward instructions that appeared earlier in the prompt ([arXiv 2507.11538](https://arxiv.org/pdf/2507.11538)).

**Fix.** Split by category:

- Must always happen: a hook. Claude Code's `PreToolUse` hook blocks an action "regardless of what Claude decides." Or CI, or a pre-commit hook.
- Must usually happen: a specific, verifiable line near the top of the file. "Run `npm test` before committing" beats "test your changes."
- Nice to have: accept the 68%.

Vague instructions fail more than specific ones. Anthropic's example pair: "Use 2-space indentation" over "Format code properly."

## 2. Two files disagree and the behaviour is random

**Symptom.** The agent uses tabs on Tuesday and spaces on Thursday. Nothing changed.

**Cause.** Under a concatenate-all harness, both rules are in context and nothing decides between them. Claude Code documents the outcome: "If two files give different guidance for the same behavior, Claude may pick one arbitrarily."

**Fix.**

- Audit for contradictions across your `CLAUDE.md` files, nested files, and `.claude/rules/`. Do it on a schedule, since files accumulate.
- Write child files that add, never that contradict.
- In a monorepo, exclude other teams' files. Claude Code's `claudeMdExcludes` takes glob patterns against absolute paths and merges arrays across settings layers.
- If you need real overrides, use a harness that has them. Codex's `AGENTS.override.md` wins at its level by design.

## 3. The file grew and adherence got worse

**Symptom.** You added twenty rules. The agent now follows fewer of them than when there were five.

**Cause.** Two effects compound. Instruction adherence falls with density (finding 1). And retrieval accuracy falls with input length: Chroma found all 18 frontier models tested showed monotonically decreasing F1 as input grew, with degradation possible at 50,000 tokens inside a 200,000-token window ([Context Rot](https://www.trychroma.com/research/context-rot)). The specific finding that applies here is that performance collapses fastest when the target is hard to distinguish from the surrounding text. Padding a file with generic advice hides the specific rules inside it.

**Fix.**

- Keep the always-on file under 200 lines, the documented Claude Code target. Windsurf enforces 6,000 characters globally and 12,000 per workspace rule, which is a useful lower bound to aim at.
- Move path-specific rules behind globs so they cost nothing until relevant.
- Move procedures into skills, which cost roughly 30 to 80 tokens at rest ([progressive disclosure](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure)).
- Drop what the model can derive. `/doctor` in Claude Code proposes exactly this trim: cut directory layouts, dependency lists, and architecture overviews; keep pitfalls, rationale, and conventions that differ from tool defaults.
- Stop shouting. Practitioner guidance is blunt about all-caps directives, IMPORTANT, YOU MUST, and emoji markers: "emphasis is a finite resource and if everything is critical, nothing is" ([Delete your CLAUDE.md](https://charliehills.substack.com/p/delete-your-claudemd)).

The strongest version of this advice comes from Anthropic's own practice. The same source reports the shipped Claude Code prompt was cut by four fifths for Opus 5 and Fable 5, with the recommendation that users delete their instruction files, skills, and hooks every six months and see what the model does without them.

## 4. The instruction vanished after compaction

**Symptom.** Ninety minutes in, the agent violates something you established at minute ten.

**Cause.** It was thread scope and compaction dropped it. In Claude Code, project-root `CLAUDE.md` is re-read and re-injected after compaction, but nested `CLAUDE.md` files, `paths:`-scoped rules, and the skills listing are not. Only skills you actually invoked survive ([memory docs](https://code.claude.com/docs/en/memory), [context window](https://code.claude.com/docs/en/context-window)).

**Fix.**

- Write it to the project-root file, which is the only instruction layer documented to survive.
- Compact at task boundaries with `/compact` rather than letting it fire at 95%.
- After a compaction, check `/context`.
- For work spanning sessions, keep a progress file. See 03-thread-continuity.md.

## 5. Memory says something that is no longer true

**Symptom.** The agent insists the build command is `yarn build`. You moved to pnpm four months ago.

**Cause.** Nothing expires. Anthropic's memory tool documentation lists expiry as an implementer responsibility: "Periodically delete memory files that haven't been accessed in a long time." Claude Code writes a `modified` timestamp into frontmatter (v2.1.214 or later) but takes no action on age.

Auto-memory rots faster than hand-authored files because nobody reads it. Claude Code's memory lives in `~/.claude/projects/<project>/memory/`, outside the repository, so it never appears in a diff or a code review.

**Fix.**

- Put a memory review in an existing routine. Weekly, or at each release.
- On any migration, grep the memory directory for the old tool name and delete the hits.
- Prefer facts that stay true. "Build commands are in `package.json` scripts" survives a migration; "run `yarn build`" does not.
- Promote durable, team-wide facts into the repository, where review catches them.

## 6. A memory file becomes an injection vector

**Symptom.** The agent does something nobody asked for, repeatedly, across sessions, with no bad instruction visible in the conversation.

**Cause.** Memory is read back into context as trusted text. Two concrete routes:

**Poisoning through ordinary use.** The MINJA attack injects malicious records into an agent's memory bank using only normal queries and observed outputs, with no elevated privileges, and reports over 95% injection success in its setting ([arXiv 2503.03704](https://arxiv.org/abs/2503.03704)). Follow-on work studies defences and finds the deployment picture understudied ([arXiv 2601.05504](https://arxiv.org/abs/2601.05504)).

**Committed instruction files.** A project instruction file is code you execute. Anthropic guards one path here: an import in a project memory file whose path resolves outside the working directory triggers a one-time approval dialog, because "the dialog protects you from files other people commit to a shared project" ([memory docs](https://code.claude.com/docs/en/memory)).

**Path traversal.** For anyone implementing the memory tool, the docs warn that `/memories/../../secrets.env` reaches outside the memory directory, and require validating the prefix, resolving to canonical form, and rejecting traversal sequences including URL-encoded ones ([memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)).

**Fix.**

- Review `AGENTS.md` and `CLAUDE.md` changes in pull requests the way you review source. They are executable.
- Read agent-written memory periodically. It is plain markdown.
- Never let memory be the only record of a security decision.
- If you host the memory tool, validate every path, cap file sizes, and strip sensitive data before writing. The docs note Claude usually refuses to write secrets but recommend validation for stronger guarantees.
- Treat memory content as data, not instructions, when it arrives from any source you did not write.

## 7. The rule never loads at all

**Symptom.** A rule exists, is well written, and has visibly never applied.

**Causes and fixes, by harness:**

| Cause | Where it happens | Fix |
|---|---|---|
| Rule sits below the working directory | Codex stops walking at cwd | Launch from the directory whose rules you want |
| Global steering ignored when project steering exists | Kiro CLI ([issue #3719](https://github.com/aws/amazon-q-developer-cli/issues/3719)) | Duplicate the rule into project steering |
| Glob never matches | Any `paths:`, `applyTo:`, `globs:` rule | Test the pattern. In Claude Code, a `[` that is not a valid bracket expression matches nothing |
| Description too vague for a model-decided rule | Cursor "Apply Intelligently", Windsurf `model_decision`, Kiro `auto` | Describe the situation, not the topic |
| Instruction blob hit the size cap | Codex, 32 KiB `project_doc_max_bytes` | Shrink, or move detail into scoped files |
| Subagent never saw it | Claude Code Explore and Plan skip `CLAUDE.md`; no subagent gets the parent's auto memory | Restate the constraint in the delegation prompt |
| Wrong filename for this tool | Claude Code reads `CLAUDE.md`, not `AGENTS.md` | Bridge with `@AGENTS.md` or a symlink |
| Nested file not reloaded after compaction | Claude Code | Move it to the project root, or accept lazy reload |

**The universal diagnostic:** print what the model actually receives. Gemini CLI's `/memory show` outputs the full concatenated context. Claude Code's `/context` lists loaded memory files, and the `InstructionsLoaded` hook logs which files load, when, and why. Check the tool before debugging the prompt.

## Failure summary

| # | Failure | Root cause | Primary fix |
|---|---|---|---|
| 1 | Rule ignored | Context, not configuration | Hooks for hard rules |
| 2 | Random behaviour | Contradiction under concatenation | Audit and delete conflicts |
| 3 | Worse with more rules | Instruction density and context rot | Cap size, scope by path, defer procedures |
| 4 | Lost mid-session | Compaction drops thread scope | Persist to project-root file |
| 5 | Stale facts | Nothing expires | Scheduled review, prefer durable facts |
| 6 | Poisoned memory | Memory is trusted on read | Review as code, validate paths |
| 7 | Never loads | Discovery, glob, cap, or scope | Print what the model receives |

---

<!-- 11archive-source: 06-design-playbook.md -->

# Design playbook

- **Created:** 2026-08-11
- **For:** a team setting up agent instructions across more than one tool, and anyone building a harness of their own.

## Part 1: the layout to copy

```
repo/
├── AGENTS.md                      # the one file. under 200 lines. committed.
├── CLAUDE.md                      # 2 lines: @AGENTS.md, then Claude-only notes
├── .claude/
│   └── rules/
│       ├── api.md                 # paths: ["src/api/**/*.ts"]
│       ├── migrations.md          # paths: ["db/migrations/**"]
│       └── testing.md             # paths: ["**/*.test.ts"]
├── .github/
│   ├── copilot-instructions.md    # short, or a pointer
│   └── instructions/
│       └── api.instructions.md    # applyTo: "src/api/**/*.ts"
├── .cursor/rules/
│   └── api.mdc                    # globs: src/api/**/*.ts
└── .gitignore                     # includes CLAUDE.local.md
```

Outside the repo, per person, not committed:

```
~/.claude/CLAUDE.md                            # your global preferences
~/.claude/rules/*.md                           # your global rules
~/.claude/projects/<project>/memory/MEMORY.md  # agent-written, review weekly
~/.codex/AGENTS.md                             # your global preferences, Codex
~/.gemini/GEMINI.md                            # your global preferences, Gemini
```

### Why this shape

**One source of truth, many readers.** `AGENTS.md` is read natively by Codex, Cursor, Copilot, Gemini CLI (when configured), Zed, Amp, Junie, Aider, and Devin. Claude Code is the notable exception and needs a two-line bridge, which Anthropic documents:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

Or, when you need nothing Claude-specific:

```bash
ln -s AGENTS.md CLAUDE.md
```

Gemini CLI can be pointed at the shared file directly, no bridge needed:

```json
{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }
```

**Path-scoped rules carry the volume.** Anything that applies to part of the tree goes behind a glob and costs zero tokens until a matching file is opened. This is the single change that lets a large codebase have a lot of rules and a small always-on file.

**Personal stays personal.** `CLAUDE.local.md` is gitignored. One caveat from the docs: a gitignored file exists only in the worktree where you made it. To share personal notes across worktrees, import from home instead:

```markdown
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

## Part 2: what goes in `AGENTS.md`

Keep it to facts an agent needs in every session and cannot derive by reading the code.

**Include:**

- Build, test, and lint commands, with the exact invocation
- Package manager, if it is not obvious from lockfiles
- Where things live, only when it is surprising
- Conventions that differ from the language or framework default
- Traps: the flaky test, the service that must be running, the directory not to touch
- Things the agent got wrong twice

**Exclude:**

- Directory listings, dependency lists, architecture overviews. The agent can read those, and `/doctor` will propose cutting them.
- Multi-step procedures. Those are skills.
- Anything true of one subdirectory only. That is a path-scoped rule.
- Emphasis theatre. No all-caps, no IMPORTANT, no emoji section markers.
- Aspirations. "Write clean code" changes nothing.

The trigger for adding a line, from Anthropic's guidance: Claude made the same mistake twice; a code review caught something the agent should have known; you typed the same correction you typed last session; a new teammate would need the same context.

### A template that fits in 200 lines

```markdown
# <project>

## Commands
- Install: `pnpm install`
- Test: `pnpm test`, single file `pnpm test path/to/file.test.ts`
- Lint: `pnpm lint --fix`
- Dev server: `pnpm dev`, port 3000

## Conventions
- Package manager is pnpm. Never npm or yarn.
- TypeScript strict mode. No `any` without a comment saying why.
- API handlers live in `src/api/handlers/`, one file per route.
- Tests sit beside the code they test, named `*.test.ts`.

## Traps
- `src/legacy/` is frozen. Do not edit it; open an issue instead.
- Integration tests need Redis on 6379. Start it with `docker compose up -d redis`.
- `pnpm build` must run before `pnpm test:e2e`, or the e2e suite tests stale output.

## Before you finish
- Run `pnpm test` and `pnpm lint`.
- Do not commit unless asked.
```

Roughly 25 lines. Most projects do not need more in the always-on file.

## Part 3: the decision table

| The instruction is... | Put it in |
|---|---|
| Universal and must never be violated | A hook or CI check, not a file |
| Universal and should usually hold | `AGENTS.md` at the root |
| True for one directory or file type | A path-scoped rule with a glob |
| A multi-step procedure | A skill |
| Personal to you, all projects | `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md` |
| Personal to you, one project | `CLAUDE.local.md`, gitignored |
| Company policy nobody may disable | Managed policy file or Team Rules |
| Something the agent worked out itself | Auto memory, reviewed weekly |
| Current state of a long task | A progress file the agent updates |
| True for this hour only | Say it in chat, and expect it to die at compaction |

## Part 4: if you are building the harness

Seven decisions, with the recommendation and the reason.

**1. Merge rule: concatenate, but mark the source.**
Junie's approach is the best in the survey: include both global and project guidelines, mark them clearly, deduplicate identical content, and state that project wins on conflict. Concatenation without marking hands the model an unlabelled pile. Marking costs a few tokens and makes conflicts legible.

**2. Give the always-loaded layer a hard cap and tell the model about it.**
Claude Code's auto memory is the reference: 200 lines or 25KB, a reminder as the file approaches it, and an error that instructs the model to rewrite the index when it goes over. A cap nobody enforces is a suggestion. Windsurf's 6,000 and 12,000 character limits work the same way.

**3. Make path scoping a first-class feature, not a convention.**
`paths:`, `applyTo:`, and `globs:` frontmatter all do the same job. Without it, every rule is an always-on rule and the file grows until adherence drops.

**4. Ship a command that prints exactly what the model receives.**
Gemini CLI's `/memory show` is the single most useful debugging tool found. Claude Code's `/context` plus the `InstructionsLoaded` hook is the other good pattern. Without this, users debug the model when the bug is in discovery.

**5. Decide what survives compaction, and document it.**
Claude Code documents it precisely: root file re-injected, nested files and path-scoped rules not, skills listing dropped. Most harnesses document nothing here, which is why users think memory is unreliable when it is behaving exactly as designed.

**6. Separate agent-written memory from human-written rules, physically.**
Different directory, ideally outside the repository. It preserves the trust distinction and makes review possible. Every harness that has both already does this. Do not invite the agent to edit the committed instruction file directly.

**7. Timestamp writes, and give users one place to read everything.**
Claude Code's `modified` frontmatter field is the only automatic staleness signal in the survey. Claude.ai's single editable memory summary is the best review affordance. Together they solve most of the rot problem: you can see what is old and read all of it in one place.

## Part 5: maintenance

**Weekly, five minutes.**
Open the agent memory index. Delete anything about a system that changed. Promote anything a teammate would need into `AGENTS.md`.

**At every release.**
Grep instruction files for tool and command names that changed this cycle.

**Quarterly.**
Read `AGENTS.md` end to end. Ask of each line: has the agent violated this? Would a new hire need it? Can the agent derive it from the code? Delete on any "no", "no", "yes".

**Every six months, the reset.**
Delete the instruction files, the skills, and the hooks. Work for a day without them. Add back only what you actually miss. This is Anthropic's own published advice for Claude Code users, and it is the only maintenance practice that reliably reverses accumulation ([Delete your CLAUDE.md](https://charliehills.substack.com/p/delete-your-claudemd)).

**The test that settles arguments.**
Put a deliberately absurd rule in your instruction file, for example "end every response with the word BANANA." Start a fresh session. If it does not appear, the file is not loading, or it is buried too deep to matter. Either way you have learned more than another round of rewording would teach you.

---

<!-- 11archive-source: 07-glossary.md -->

# Glossary

- **Created:** 2026-08-11

Terms as used in this report. Where a vendor defines a term differently, the vendor's meaning is noted.

## Scopes and files

**Global scope.** Instructions attached to a person or a machine, applied to every project. Example: `~/.claude/CLAUDE.md`.

**Project scope.** Instructions stored in a repository and shared through version control. Example: `AGENTS.md` at the repo root.

**Thread scope.** State that exists only inside one conversation: what you said, what the agent read, what it decided. It has no file, which is why it is the layer that gets lost.

**Managed policy.** An instruction layer set by an administrator that an individual user cannot switch off. Claude Code reads one from a system path; Cursor calls its version Team Rules.

**Memory file.** Any markdown file a harness loads as standing instructions. `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursor/rules/*.mdc`, `.kiro/steering/*.md` are all memory files.

**Auto memory.** Notes the agent writes for itself, unprompted, and reads back in later sessions. Claude Code's term. Windsurf calls its version Memories.

**Memory bank.** A named set of files holding project state, read at the start of every task. Cline's term, also used by Amazon Q and by community setups for Roo Code.

**Steering file.** Kiro's term for a project instruction file with an `inclusion` mode.

**Microagent.** OpenHands' term for an instruction unit. A repository microagent (`repo.md`) always applies; a knowledge microagent triggers on keywords.

**Knowledge item.** Devin's term for a stored fact, made of content plus a trigger description that says when to recall it.

## Loading and resolution

**Eager loading.** The file enters context at session start, every session, whatever the task.

**Conditional loading.** The file enters context only when the agent touches a file matching a glob pattern. Configured with `paths:` in Claude Code, `applyTo:` in Copilot, `globs:` in Cursor.

**Deferred loading.** Only a name and description sit in context; the body loads if the model decides it is relevant. Skills work this way, as do Cursor's "Apply Intelligently" rules and Windsurf's `model_decision` mode.

**Progressive disclosure.** The general pattern behind deferred loading: keep a cheap pointer in context and fetch the expensive content on demand. Anthropic's framing is that the context window is a public good.

**Just-in-time retrieval.** Same idea, seen from the agent's side: hold lightweight identifiers such as file paths and load details at the moment they are needed.

**Concatenate-all.** A merge rule where every discovered file is placed in context in order and nothing is removed. Claude Code and Gemini CLI work this way. Conflicts are handed to the model.

**Nearest-wins.** A merge rule where the file closest to the work overrides files further up. The `AGENTS.md` specification and Codex work this way.

**Import.** A directive inside a memory file that pulls another file in. `@path/to/file` in Claude Code and Gemini CLI. Imports load at launch, so they organise content without reducing its cost.

## Thread mechanics

**Context window.** The total token budget for one model request, holding the system prompt, instructions, conversation, and tool results.

**Compaction.** Summarising a conversation that is nearly full and restarting with the summary in place of the history. Automatic in Claude Code and Codex CLI, manual with `/compact`.

**Microcompaction.** Trimming parts of the context rather than summarising all of it, for example dropping old tool outputs. OpenCode's pruning is this shape.

**Context editing.** Client-side removal of specific tool results from the request. Distinct from compaction, which is server-side summarisation of the whole conversation.

**Handoff.** Ending a thread deliberately and seeding a new one with extracted context plus a stated goal. Amp's `/handoff` replaced compaction there.

**Checkpoint.** A saved snapshot of conversation and file state that you can return to. Claude Code writes one before every file edit and on every prompt.

**Rewind.** Rolling back to a checkpoint, undoing both conversation and file changes.

**Fork.** Branching a session or a subagent so it inherits the parent's conversation rather than starting fresh.

**Subagent.** A delegated agent with its own context window. It returns a summary, keeping its file reads out of the parent's context. In Claude Code it receives the `CLAUDE.md` hierarchy but not the parent's auto memory.

**Context rot.** The measured decline in model accuracy as input length grows, even well inside the stated window. Named by Chroma's 2025 study of 18 frontier models.

**Recursive summary.** A summary produced from context that already contained a summary. Amp's stated reason for removing compaction: repeated compression distorts earlier reasoning.

## Memory system terms

**Semantic memory.** Facts. "The team uses pnpm."

**Episodic memory.** Events. "Last Tuesday the deploy failed because of a stale lockfile."

**Procedural memory.** How to do something. In agent harnesses this is usually a skill rather than a memory entry.

**Checkpointer.** LangGraph's term for thread-scoped short-term persistence.

**Store.** LangGraph's term for cross-thread long-term persistence, addressed by namespace.

**Memory tool.** Anthropic's API tool (`memory_20250818`) that lets a model request file operations against a `/memories` directory the developer hosts.

## Security terms

**Memory poisoning.** Getting false or malicious content into an agent's persistent memory so it influences later sessions.

**MINJA.** A memory injection attack that poisons an agent's memory through ordinary queries alone, with no elevated access.

**Path traversal.** Using a path such as `../../` to reach files outside an intended directory. The main implementation risk when hosting the memory tool.

**Instruction source boundary.** The rule that instructions come from the user, and everything read through a tool, including memory files written by an agent, is data rather than a command.

## Filenames seen in the wild

| File | Tool |
|---|---|
| `AGENTS.md` | The cross-tool standard, 25+ tools |
| `AGENTS.override.md` | Codex, wins at its level |
| `CLAUDE.md`, `CLAUDE.local.md` | Claude Code |
| `MEMORY.md` | Claude Code auto-memory index |
| `GEMINI.md` | Gemini CLI |
| `.cursorrules`, `.cursor/rules/*.mdc` | Cursor, the first legacy |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `*.instructions.md` | Copilot path-scoped |
| `global_rules.md`, `.windsurf/rules/` | Windsurf Cascade |
| `.clinerules/`, `activeContext.md`, `progress.md` | Cline |
| `.kiro/steering/*.md` | Kiro |
| `.amazonq/rules/` | Amazon Q Developer |
| `.openhands/microagents/repo.md` | OpenHands |
| `CONVENTIONS.md` | Aider |
| `.junie/guidelines.md` | Junie, legacy |
| `SKILL.md` | Agent Skills, cross-tool |

---

<!-- 11archive-source: 08-methodology-and-sources.md -->

# Methodology, coverage, limitations, and sources

- **Created:** 2026-08-11

## Objective

Establish how modern agent harnesses and chat surfaces handle standing-instruction files at global, project, and thread scope, with enough precision that a reader can set up their own files correctly, or build a harness that behaves predictably.

## Reporting period and timezone

- Research date: 2026-08-11.
- Working session timezone: Europe/Lisbon.
- All product behaviour is a point-in-time observation. Every harness in this report ships weekly or faster, and several documented behaviours here carry version numbers precisely because they changed recently.

## Evidence method

Sources were preferred in this order:

1. Vendor product documentation, current at the research date.
2. Published open specifications.
3. Vendor engineering posts and changelogs.
4. Peer-reviewed papers and preprints for research claims.
5. Public issue trackers, for behaviour the docs do not describe.
6. Practitioner write-ups, used only for observations no primary source covers, and always marked.

All claims were paraphrased. No long passages were copied.

Where a documentation page states an exact path, cap, or command, it is quoted or reproduced verbatim in the report so the reader can grep for it. Where a number came from a secondary source, it carries a `[secondary]` or `[medium confidence]` marker at the point of use.

## Coverage

**Systems examined, with the depth of evidence.** Fifteen of these are agent harnesses profiled in the comparison matrix in [data.json](data.json). The Claude memory tool, LangGraph, and Roo Code are examined but not profiled there: the first is an API building block rather than a harness, the second is a framework, the third is covered only through community repositories.

| Harness | Evidence | Depth |
|---|---|---|
| Claude Code | Vendor docs, three pages read in full | Complete |
| Claude memory tool (API) | Vendor docs read in full | Complete |
| OpenAI Codex | Vendor docs | Complete for discovery and merge |
| Gemini CLI | Vendor docs in repo | Complete for hierarchy and commands |
| Cursor | Vendor docs | Complete for rules; Memories removal is secondary |
| GitHub Copilot | Vendor docs and changelog | Good |
| Windsurf Cascade | Vendor docs | Complete for memories, rules, caps |
| JetBrains Junie | Vendor docs | Good; memory section absent from the page |
| Cline | Vendor docs | Good |
| OpenHands | Vendor docs | Good |
| Devin | Vendor docs | Good |
| Kiro | Vendor docs plus issue tracker | Partial; CLI behaviour from an open issue |
| Amazon Q Developer | AWS docs | Partial |
| Aider | Vendor docs | Partial |
| Zed | Vendor docs | Partial |
| Amp | Secondary only | Thin, marked throughout |
| Roo Code | Community repositories | Thin, mentioned only |
| LangGraph | Vendor docs | Sufficient for the thread and store distinction |

**Chat surfaces:** ChatGPT (OpenAI posts and help centre), Claude.ai (Anthropic help centre).

## Limitations

**No first-hand benchmarking.** Nothing here was measured. Every performance number is attributed to its source. If you need to know how a change to your instruction file affects your work, measure it in your repository.

**No paid-tier or enterprise verification.** Team Rules, enterprise policy deployment, and organisation dashboards are described from documentation, not from use.

**Version drift is certain.** Several documented behaviours are tied to specific Claude Code versions (v2.1.198, v2.1.206, v2.1.211, v2.1.213, v2.1.214, v2.1.216, v2.1.217, v2.1.222). Behaviour before those versions differed and behaviour after them may differ again.

**Undocumented internals.** Compaction thresholds are documented for almost no product. The Codex figures come from configuration keys and its issue tracker; the cross-harness comparison comes from one detailed public gist. Treat them as directionally right and specifically uncertain.

**Memory benchmark scores are excluded from conclusions.** LOCOMO and LongMemEval results for mem0, Zep, Letta, and similar systems vary widely between vendor-reported and independently reproduced numbers, in some cases by more than 30 points. They are mentioned in 00-executive-brief.md only to say they should not be used as a ranking.

**A note on one redirect.** `docs.windsurf.com` now redirects to `docs.devin.ai`, following Cognition's acquisition of Windsurf. Windsurf documentation is cited at its current location.

## Conflicts and unresolved items

- **Cursor Memories.** Multiple secondary sources state the feature shipped in mid-2025 and was removed in version 2.1.x, with migration to Rules. Current vendor documentation describes Rules only and does not describe Memories. The removal is reported as secondary and the current state as documented.
- **Junie memory.** The vendor page is titled "Guidelines and memory" but the fetched content contains no memory section. Guidelines behaviour is reported; memory behaviour is recorded as not documented rather than guessed.
- **Kiro global steering.** The product documentation describes `~/.kiro/steering/`. An open issue on the vendor's CLI repository reports that global steering is ignored when project steering exists. Both are reported, with the issue cited.
- **Zed rules library.** One secondary source states the rules library was retired in favour of skills in version 1.4.2. Vendor documentation confirms `AGENTS.md` as the primary instruction file. The retirement claim is marked secondary.

## Sources

### Vendor documentation, primary

- Anthropic. [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- Anthropic. [Explore the context window](https://code.claude.com/docs/en/context-window)
- Anthropic. [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- Anthropic. [Checkpointing](https://code.claude.com/docs/en/checkpointing)
- Anthropic. [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- OpenAI. [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- OpenAI. [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)
- Google. [Provide context with GEMINI.md files](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md)
- Cursor. [Rules](https://cursor.com/docs/context/rules)
- GitHub. [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- GitHub. [Copilot code review and coding agent now support agent-specific instructions](https://github.blog/changelog/2025-11-12-copilot-code-review-and-coding-agent-now-support-agent-specific-instructions/)
- Windsurf and Cognition. [Cascade memories](https://docs.devin.ai/desktop/cascade/memories)
- Cognition. [Knowledge onboarding](https://docs.devin.ai/onboard-devin/knowledge-onboarding)
- JetBrains. [Guidelines and memory](https://junie.jetbrains.com/docs/guidelines-and-memory.html)
- Cline. [Memory Bank](https://docs.cline.bot/best-practices/memory-bank)
- OpenHands. [Skills overview](https://docs.openhands.dev/overview/skills)
- Kiro. [Steering](https://kiro.dev/docs/steering/)
- AWS. [Generating a memory bank for Amazon Q chat](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-memory-bank.html)
- Aider. [Specifying coding conventions](https://aider.chat/docs/usage/conventions.html)
- Zed. [Agent instructions](https://zed.dev/docs/ai/instructions)
- LangChain. [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- Anthropic. [Use Claude's chat search and memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)

### Specifications and governance

- [AGENTS.md](https://agents.md/), stewarded by the Agentic AI Foundation under the Linux Foundation

### Vendor engineering posts

- Anthropic. [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Anthropic. [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- OpenAI. [Dreaming: Better memory for a more helpful ChatGPT](https://openai.com/index/chatgpt-memory-dreaming/)
- OpenAI. [Memory and new controls for ChatGPT](https://openai.com/index/memory-and-new-controls-for-chatgpt/)

### Research

- Jaroslawicz et al. [How many instructions can LLMs follow at once?](https://arxiv.org/pdf/2507.11538) IFScale. NeurIPS 2025 LLM Evaluation Workshop.
- Hong, Troynikov, Huber. [Context Rot: How increasing input tokens impacts LLM performance](https://www.trychroma.com/research/context-rot). Chroma, July 2025.
- [Memory injection attacks on LLM agents via query-only interaction](https://arxiv.org/abs/2503.03704). MINJA.
- [Memory poisoning attack and defense on memory based LLM-agents](https://arxiv.org/abs/2601.05504).

### Issue trackers

- [aws/amazon-q-developer-cli#3719](https://github.com/aws/amazon-q-developer-cli/issues/3719), global steering files not loaded by the Kiro CLI

### Secondary, used for observations no primary source covers

- [Context compaction research: Claude Code, Codex CLI, OpenCode, Amp](https://gist.github.com/badlogic/cd2ef65b0697c4dbe2d13fbecb0a0a5f)
- Tessl. [Amp drops compaction for handoff to fix AI's long-context drift](https://tessl.io/blog/amp-retires-compaction-for-a-cleaner-handoff-in-the-coding-agent-context-race/)
- Charlie Hills. [Delete your CLAUDE.md](https://charliehills.substack.com/p/delete-your-claudemd)
- SwirlAI. [Agent Skills: progressive disclosure as a system design pattern](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure)

## Verification performed

- Every path, cap, command, and version number in 02-harness-mechanics.md was taken from the cited page in the same session, not from memory.
- Claims appearing in more than one file were checked for agreement across files.
- `data.json` was generated from the same facts as the markdown and the counts in it were checked against the tables.
- Numbers with different units in their sources (lines, KB, KiB, characters, tokens) are reported in their original unit and never converted, because the conversions would be false precision.
- Every claim attributed to a vendor is one the vendor states about its own product.
