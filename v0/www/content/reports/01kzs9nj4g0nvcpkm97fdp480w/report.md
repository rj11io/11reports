<!-- 11archive-source: 00-executive-brief.md -->

# How AI agent harnesses handle git worktrees: executive brief

**Created:** 2026-08-11
**Audience:** engineers and tool builders who run more than one coding agent on one repository
**Scope:** how today's agent tools create, seed, guard, hand off, and clean up git worktrees, what that fixes, what it does not, and what to do instead
**Evidence boundary:** official product documentation, the git manual, public bug reports, two peer-reviewable preprints, and public repository status pages. No private betas. No benchmarks run by us.

A **worktree** is a second folder holding a full copy of a project's files, backed by the same repository history as the first folder. A **harness** is the code around the model that runs the agent loop: it manages the session, calls tools, and writes changes to disk. A **surface** is where you sit while the agent works: a terminal, an editor panel, a desktop app, or a web page.

## Result

Worktrees have become the standard way local agent tools stop parallel agents from overwriting each other. Nine of the ten tools surveyed now create worktrees themselves rather than asking you to run `git worktree add`. Anthropic, OpenAI, Cursor, Microsoft, Google, and Zed all ship the same core move: one agent, one folder, one branch.

The move works. It also solves only one of four problems, and it is the cheapest of the four to solve.

| Layer | What collides | Does a worktree fix it? | What actually fixes it |
|---|---|---|---|
| Files | Two agents write the same file | Yes | Worktree per agent |
| Repository plumbing | Two agents write `.git/config`, `.git/index`, or refs at the same time | No. Worktrees share one `.git` | Serialise creation, retry on lock, per-worktree config |
| Runtime and state | Two agents bind port 3000, or share one database, or start the same Docker stack | No | Container per agent, or per-worktree ports, project names, and schemas |
| Meaning | Two agents each rename the same idea differently, and both branches compile | No | Freeze the shared interface before you fan out, then test the merged result |

The third and fourth layers are where the cost sits. In one study of 33,596 pull requests written by coding agents across 2,807 repositories, 40.2% of repositories had agent pull requests open at the same time, and those overlapping pull requests were 79.4% of all agent pull requests. When the authors merged 747 pairs to see what happened, pairs from two different agents conflicted 41.7% of the time and pairs from the same agent conflicted 19.8% of the time, with 84.4% of conflicts landing in source files rather than dependency lists ([arXiv 2607.04697](https://arxiv.org/abs/2607.04697)). A larger dataset of 142,000 agent pull requests across 59,000 repositories found a 27.67% conflict rate over the 107,000 it could simulate a merge for ([AgenticFlict, arXiv 2604.03551](https://arxiv.org/abs/2604.03551)).

Read that as a budget. Isolation is free; integration is not.

## What every harness got right

1. **Isolate writes, not reads.** Every tool lets agents read the whole repository and confines only writes. That keeps the agent's context useful.
2. **Branch from a known point.** Fresh from the remote default branch, or the current local commit, or a detached commit with no branch attached. Never "whatever is lying around".
3. **Refuse to touch the main checkout.** The best implementations block the write, not just discourage it. Claude Code blocks edits into the main checkout, blocks commands whose working directory resolves there, and blocks commands that redirect git back into it with `git -C`, `--git-dir`, `GIT_DIR`, `GIT_WORK_TREE`, or a `cd` ([Claude Code worktrees](https://code.claude.com/docs/en/worktrees)).
4. **Close the gitignored gap.** A worktree contains only committed files, so `.env` and `node_modules` are missing. Every mature tool ships a way to put them back: a list of files to copy, or a setup script that runs on creation.
5. **Make landing the work explicit.** Nobody auto-merges. You get "apply to main", or "hand the thread back", or "open a pull request", and you choose.

## What every harness got wrong, or has not finished

1. **Shared `.git/config` is treated as private.** Git shares one config file across all worktrees. A harness that writes config "for this worktree" changes it for the whole clone. One reported case: Claude Code's worktree setup rewrote `core.hooksPath`, which silently switched off a repository's committed pre-push checks everywhere for several days ([issue 66993](https://github.com/anthropics/claude-code/issues/66993)). Fix: `git config extensions.worktreeConfig true`, then write with `git config --worktree`.
2. **Concurrent creation races.** Several agents running `git worktree add` at once fight over `.git/config.lock`; several agents committing at once fight over `.git/index.lock`. One report: 3 parallel agents, 2 failed ([issue 47266](https://github.com/anthropics/claude-code/issues/47266)). Another: 13 parallel agents, 5 committed and 8 failed ([issue 55724](https://github.com/anthropics/claude-code/issues/55724)). Fix: serialise creation, then retry with backoff at roughly 200ms, 400ms, 800ms.
3. **Cleanup can delete the work.** If a commit fails on a lock and the agent exits, an automatic sweep can then remove the worktree and the uncommitted work with it. Fix: gate every automatic removal on `git status --porcelain` being empty, and hold `git worktree lock` while an agent is running. Claude Code now does both.
4. **Runtime isolation is left to you.** No surveyed harness allocates ports, names Docker Compose projects, or gives each agent its own database. Third-party tools fill the gap ([Docktree](https://docktree.dev/), [worktree-compose](https://github.com/mostafasudo/worktree-compose)).
5. **Nobody sizes concurrency by review capacity.** Tools cap worktrees by count and age. Cursor keeps 25 per machine by default; the Codex app keeps about 15. Neither number is about how many diffs a person can read.

## Do this

- **Use worktree isolation for anything you would run two of.** It is the cheapest correct default for local parallel agents.
- **Turn on per-worktree config before you scale up.** `git config extensions.worktreeConfig true`. Then check that nothing writes to the shared file: run `git config core.hooksPath` from the main checkout after a session and confirm the value is what you committed.
- **Write the seeding step down, in the repository.** Use a copy list for secrets (`.worktreeinclude`, `git.worktreeIncludeFiles`) and a setup script for installs (`.cursor/worktrees.json`, Zed's `create_worktree` hook, Claude Code's `WorktreeCreate` hook). A worktree nobody can build in is worse than no worktree.
- **Seed heavy directories with a copy-on-write copy, not a symlink.** On macOS, `cp -Rc node_modules <worktree>/node_modules` shares the disk blocks until something changes. Symlinking one `node_modules` across worktrees breaks module resolution and is explicitly discouraged in Cursor's own documentation.
- **Add a container when the agent runs the app, not just when it edits code.** Ports, databases, and background services are not isolated by a worktree.
- **Fan out on mechanical work, sequence ambiguous work.** A 400-file rename across 20 worktrees is safe. Two agents both designing the same module is not, however clean the folders are.
- **Set concurrency from how many diffs you will actually read today.** Practitioners writing publicly settle around two to five local agents. Nothing in the tools stops you at fifty.
- **Test the merge, not the branch.** A branch that passes alone tells you nothing about the pair. Both papers above measure exactly this gap.

## Where to go next

- Worktree mechanics: what git shares, what it keeps separate, and the commands and settings that matter.
- Harness survey: tool by tool, with exact flags, file names, defaults, and limits.
- Surface patterns: the seven design patterns the tools converged on.
- Failure modes and fixes: sixteen ways this breaks, each with a fix.
- Decision guide: choosing between worktree, sandbox, container, and cloud.
- Glossary and methodology and sources.

---

<!-- 11archive-source: 01-worktree-mechanics.md -->

# Worktree mechanics: what git actually shares

Everything a harness can and cannot do with worktrees follows from one design choice git made: **a worktree gets its own files and its own place in history, but it borrows the repository.** Read this section once and most harness bugs become predictable.

Source for this section: the [git-worktree manual](https://git-scm.com/docs/git-worktree).

## The shape on disk

Start with a normal clone at `/work/app`. Its repository lives in `/work/app/.git`, a directory.

Run this:

```bash
git worktree add /work/app-feature -b feature-auth
```

You now have two working folders and still one repository.

- `/work/app-feature/.git` is a **file**, not a directory. It contains two lines:

```text
gitdir: /work/app/.git/worktrees/app-feature
commondir: /work/app/.git
```

- `/work/app/.git/worktrees/app-feature/` is the private admin folder for the new worktree. It holds that worktree's `HEAD`, its `index` (the staging area), a `gitdir` file pointing back at `/work/app-feature`, a `locked` file if you lock it, and a `config.worktree` file if per-worktree config is switched on.

Two environment concepts follow from this, and they explain most confusion:

- `$GIT_DIR` inside the worktree is `/work/app/.git/worktrees/app-feature`, the private part.
- `$GIT_COMMON_DIR` is `/work/app/.git`, the shared part.

Never read `$GIT_DIR` directly in a script. Ask git which one applies:

```bash
git rev-parse --git-path HEAD          # private: the worktree's own HEAD
git rev-parse --git-path refs/heads/main   # shared: the repository's branches
```

## Private versus shared

This table is the single most useful thing to know. Anything in the right column is a place where two agents can collide even though they have separate folders.

| Private to each worktree | Shared by every worktree |
|---|---|
| Working files on disk | The object database and pack files (all commits, trees, blobs) |
| `HEAD`, so each worktree points at its own commit | Every ref under `refs/`, except the three below |
| `index`, the staging area | `refs/heads/*` branches, `refs/tags/*`, `refs/remotes/*` |
| `refs/bisect/*`, bisect state | `refs/stash`, because it is an ordinary ref under `refs/` |
| `refs/worktree/*` | `.git/config`, the repository configuration |
| `refs/rewritten/*`, rebase state | `.git/hooks`, the hook scripts |
| Sparse-checkout selection (`core.sparseCheckout`) | Committed `.gitignore` and `.gitattributes` content |
| `config.worktree`, only if `extensions.worktreeConfig` is on | Reflogs for shared refs, and `git gc` behaviour |

Three consequences worth stating outright, because harnesses trip on all three:

1. **`git stash` is shared.** `refs/stash` sits under `refs/`, so it is not per-worktree. Two agents stashing in "their own" worktrees push onto one stack. Tell agents to commit, not stash.
2. **`.git/config` is shared.** A harness that runs `git config <key> <value>` while the current directory is a worktree writes to the whole clone. See failure mode 1.
3. **Hooks are shared.** Every worktree runs the same hook scripts from `.git/hooks` unless `core.hooksPath` says otherwise, and `core.hooksPath` itself lives in the shared config.

## The one-branch rule

Git refuses to check out the same branch in two worktrees at once. This is deliberate: two folders advancing one branch would corrupt each other's idea of where it is.

For agents this rule shows up constantly, because a natural request is "put this agent on `main` too". Three ways around it, all in use today:

- **Detached HEAD.** `git worktree add --detach <path>` checks out a commit with no branch attached. Zed does this on every worktree it creates, and the Codex app creates worktrees detached by default. No branch, no conflict.
- **A new branch per worktree.** `git worktree add <path> -b <branch>`. Claude Code names it `worktree-<name>`; harnesses generally derive a name from the session.
- **Move the session instead of the branch.** The Codex app's "Handoff" moves a thread between the local checkout and a worktree, and its documentation names dual checkout as the thing Handoff exists to avoid.

## Commands worth knowing

```bash
# create
git worktree add <path>                    # branch guessed from the path basename
git worktree add <path> -b <new-branch>    # new branch; -B resets an existing one
git worktree add --detach <path>           # no branch attached
git worktree add --orphan <path>           # empty index, unborn branch
git worktree add --no-checkout <path>       # register it, write no files yet
git worktree add --lock <path>             # created already locked
git worktree add --relative-paths <path>   # portable admin files

# inspect
git worktree list
git worktree list --porcelain -z           # machine-readable, for tooling

# protect and release
git worktree lock --reason "agent running" <path>
git worktree unlock <path>

# move and remove
git worktree move <path> <new-path>
git worktree remove <path>                 # refuses if dirty
git worktree remove --force <path>         # removes anyway

# repair and reclaim
git worktree prune --dry-run
git worktree prune --expire 3.months.ago
git worktree repair [<path>...]
```

Notes that matter for automation:

- `list --porcelain` marks a worktree `locked` or `prunable`. That is the correct way for a tool to decide whether it may clean up.
- `lock` writes `$GIT_DIR/worktrees/<id>/locked` with your reason in plain text. It blocks pruning, moving, and removal. Claude Code locks a worktree while an agent runs there and releases it afterwards.
- `prune` only removes stale bookkeeping, never a live folder. Git also prunes automatically after `gc.worktreePruneExpire`.
- `repair` fixes the two pointers after someone moves a folder by hand. Run it from the main checkout after moving the main checkout, or from inside a moved worktree.
- `--no-checkout` is the hook for advanced seeding: register the worktree, copy files in cheaply, then run `git checkout` to fill the gaps and sync the index.

## Per-worktree configuration

By default there is one config file. Turn on the extension to get a second, private one:

```bash
git config extensions.worktreeConfig true
git config --worktree core.sparseCheckout true
```

After that, shared settings stay in `.git/config` and private ones go to `.git/config.worktree` for the main checkout, or `.git/worktrees/<id>/config.worktree` for a linked one.

Three settings should never be shared once the extension is on, and the git manual says so: `core.worktree`, `core.bare` when true, and `core.sparseCheckout` unless every worktree uses it. Move them out of `.git/config` by hand when you enable the extension.

One cost: older git versions refuse to open a repository with `extensions.worktreeConfig` set. The same applies to `worktree.useRelativePaths true`, which sets `extensions.relativeWorktrees` and makes the admin files portable across moved directories.

## Sparse checkout: give an agent less to see

A worktree does not have to contain the whole repository. In a large monorepo this cuts both disk use and the surface an agent can wander into:

```bash
git worktree add --no-checkout ../agent-billing -b agent-billing
cd ../agent-billing
git sparse-checkout init --cone
git sparse-checkout set services/billing packages/shared
git checkout
```

The tradeoff is real: an agent asked to fix a cross-cutting bug cannot see the file it needs, and the failure looks like "the file does not exist" rather than "you were not given it". Use sparse checkout when task boundaries are already firm.

## Documented limits

The git manual is unusually candid here, and these limits carry straight into agent tooling.

- Multiple checkout is described as still experimental.
- **Submodule support is incomplete.** `git worktree move` fails on a worktree containing submodules. `remove` needs `--force`. The manual explicitly does not recommend multiple checkouts of a superproject.
- Worktrees are identified by path, and an ambiguous final path component needs more of the path to disambiguate. `git worktree lock ghi` fails when both `/abc/def/ghi` and `/abc/def/ggg` exist; use `def/ghi`.

## What a worktree does not copy

This is the gap every harness has to paper over. `git worktree add` writes **committed files for the chosen commit and nothing else**. Missing on arrival:

- Files you deliberately ignore: `.env`, `.env.local`, local certificates, service-account keys.
- Installed dependencies: `node_modules`, `vendor`, `.venv`, `target`.
- Build output and caches: `dist`, `.next`, `.turbo`, `__pycache__`.
- Local databases, seeded fixtures, and anything else living outside the repository.

Four ways to close the gap, in rising order of engineering effort:

1. **Copy a declared list.** Cheap, exact, good for secrets. Claude Code reads `.worktreeinclude` (gitignore syntax, and it copies a match only when the file is also gitignored, so tracked files are never duplicated). VS Code has `git.worktreeIncludeFiles`.
2. **Run a setup script.** Slow but correct, and it documents the project's real setup. Cursor reads `.cursor/worktrees.json`; Zed runs a `create_worktree` hook with `ZED_WORKTREE_ROOT` and `ZED_MAIN_GIT_WORKTREE` set; Claude Code lets a `WorktreeCreate` hook replace worktree creation entirely.
3. **Copy-on-write clone the heavy directories.** On a filesystem that supports reflinks (APFS on macOS, btrfs, XFS built with `reflink=1`), a copy shares disk blocks until something changes:

   ```bash
   cp -Rc /work/app/node_modules /work/app-feature/node_modules
   ```

   A 1GB dependency directory then costs no extra disk and appears at once. The catch is file count, not file size: the copy still creates one directory entry per file. On a monorepo with 750,000 files in its dependencies, one practitioner found copy-on-write cloning, hardlink installs, and symlinks all too slow or too broken, and moved to a pool of pre-warmed worktrees instead, re-running the install only when the lockfile changed ([Dave Schumaker](https://daveschumaker.net/use-git-worktrees-they-said-itll-be-fun-they-said/)).

   The `--no-checkout` variant of this idea is packaged as [git-cow-worktree](https://commaok.xyz/post/git-cow-worktrees/): register the worktree without files, reflink-copy from a similar existing worktree, then `git checkout` to reconcile.

4. **Do not create worktrees on demand at all.** Keep a fixed pool and recycle slots. Slowest to build, fastest to use.

**Do not symlink `node_modules` between worktrees.** Node's module resolution follows the real path and gets confused, so tests pass in one worktree and fail in another for no visible reason. Cursor's own documentation warns against it and points at fast installers (`bun`, `pnpm`, `uv`) instead.

## Other version control systems

Worktrees are a git feature, and the pattern does not transfer for free.

- **Jujutsu (`jj`)** has workspaces: `jj workspace add ../agent-auth`. A workspace is tied to a revision rather than a branch, so jj has no equivalent of git's one-branch rule and several workspaces can sit on the same work. Every command snapshots the working copy automatically, so switching never needs a stash, and each workspace shows up in `jj log` with its own marker. Two limits reported in jj's own compatibility notes: git worktree commands are not supported against a jj repository, and partial clones are unsupported.
- **Everything else** needs the harness to delegate. Claude Code exposes `WorktreeCreate` and `WorktreeRemove` hooks precisely for this, with a documented Subversion example that checks out a fresh working copy and prints its path on stdout for the harness to adopt. Note the tradeoff: because the hook replaces the built-in git logic, the declarative `.worktreeinclude` copy list stops being applied, so the hook has to copy local configuration itself.

Continue to the harness survey.

---

<!-- 11archive-source: 02-harness-survey.md -->

# Harness survey: tool by tool

## What counts as a harness

VS Code's own documentation gives the cleanest working definition: an agent harness is "the runtime that runs the agent loop. It manages the session, calls tools, and applies changes to your code" ([VS Code, agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)). The wider 2026 shorthand is `agent = model + harness`, where the harness is everything that is not the model: the loop, the tool interface, context management, and the controls ([Agent harness, Wikipedia](https://en.wikipedia.org/wiki/Agent_harness)).

Two distinctions used throughout this section:

- **Harness versus surface.** VS Code is one surface that can host four harnesses (its own, Copilot, Claude, Codex). Warp is a surface that hosts other people's command-line harnesses. Worktree handling can live in either layer, and where it lives changes who is responsible for it.
- **Inner versus outer harness.** The inner harness ships with the model vendor. The outer harness is what you add: instruction files, hooks, MCP servers, setup scripts. Most worktree seeding work happens in the outer harness.

## Comparison matrix

Evidence state for this table: **source-reported** from each product's documentation as retrieved on 2026-08-11, except the two rows marked otherwise. Version and default values drift; check before relying on a number.

| Harness | How a worktree starts | Default location | Base commit | Seeds gitignored files | Blocks writes to main checkout | Landing the work | Automatic cleanup |
|---|---|---|---|---|---|---|---|
| Claude Code CLI | `claude --worktree <name>` or `-w`; `EnterWorktree` tool mid-session | `.claude/worktrees/<name>/`, branch `worktree-<name>` | `worktree.baseRef`: `fresh` (remote default branch) or `head` | `.worktreeinclude` file, gitignore syntax | Yes, three enforced checks | Commit and push; draft pull request for background sessions | Yes, on exit and by periodic sweep, gated on the worktree being clean |
| Claude Code desktop | Every new session, automatically | `<project>/.claude/worktrees/`, configurable in Settings, plus a branch prefix | Same as CLI | Same `.worktreeinclude` | Yes, same enforcement | Visual diff review, pull request | Archive icon per session; optional auto-archive after the pull request merges or closes |
| Cursor | Agents Window control, or `/worktree`, or `/best-of-n` | Not documented as a fixed path; tracked per machine | Not documented | `.cursor/worktrees.json` setup commands | Not documented | `/apply-worktree` into the main workspace, or commit and open a pull request from the worktree | Yes, `cursor.worktreeMaxCount` default 25 per machine, plus an interval sweep |
| OpenAI Codex app | Choose "Worktree" when creating a thread | `$CODEX_HOME/worktrees` | Chosen branch, checked out detached by default | Setup scripts via a chosen local environment | Not documented | "Create branch here", or "Hand off" the thread back to Local | Yes, keeps about 15 managed worktrees; snapshots before deleting; skips pinned or active threads |
| VS Code agent sessions (Copilot, Claude, Codex harnesses) | "New Worktree" checkbox in the Agents window | Separate folder managed by VS Code | Selected base branch, committed state only | `git.worktreeIncludeFiles` setting | No. Documented as an organisation boundary, not a security boundary | Review, then merge into your primary worktree yourself | No. Manual `git worktree remove` |
| Google Antigravity | "New Worktree Mode" per conversation | Not documented | Not documented | Not documented | Not documented | Not documented | Not documented |
| Gemini CLI | `--worktree` or `-w`, behind `"experimental": { "worktrees": true }` | Not stated in the pull request | Not stated | Not stated | Not stated | Resume instructions printed at exit | Yes, removes only when there are no untracked files and no new commits |
| Zed | Worktree picker beside the project picker | Linked worktree, detached HEAD | Detached at current commit | `create_worktree` hook, with `ZED_WORKTREE_ROOT` and `ZED_MAIN_GIT_WORKTREE` | Not documented | Review the diff, merge through your normal git workflow | Yes, on moving the thread to history; restoring the thread restores the worktree |
| Warp | You run `git worktree add` yourself | Wherever you put it | Yours | Yours | No | Yours | No |
| JetBrains IDEs 2026.1 | Built-in worktree support in the IDE | Not covered in the release overview | Not covered | Not covered | No | Normal IDE git workflow | Not covered |

Two rows deserve a note. **Antigravity** publishes the mode but not its mechanics, so most cells read "not documented" rather than "absent". **Gemini CLI** cells are drawn from the implementing pull request rather than a shipped documentation page; a third-party guide describes the feature as arriving in v0.38, which this report treats as secondary and unverified.

## Claude Code

The most detailed public specification of worktree handling in any harness, and the one worth reading even if you use something else. Source: [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), plus the [hooks](https://code.claude.com/docs/en/hooks), [subagents](https://code.claude.com/docs/en/sub-agents), [agent view](https://code.claude.com/docs/en/agent-view), [tools](https://code.claude.com/docs/en/tools-reference), [desktop](https://code.claude.com/docs/en/desktop), and [sandboxing](https://code.claude.com/docs/en/sandboxing) pages.

### Starting one

```bash
claude --worktree feature-auth      # or -w
claude --worktree                   # name generated, e.g. bright-running-fox
claude --worktree "#1234"           # branch from a pull request
```

The default landing spot is `.claude/worktrees/<name>/` at the repository root, on a new branch `worktree-<name>`. A pull request argument fetches `pull/<number>/head` from `origin` and lands at `.claude/worktrees/pr-<number>`. Quote the `#` so the shell does not read it as a comment. Add `.claude/worktrees/` to `.gitignore` so worktree contents do not show up as untracked files in the main checkout.

Interactive runs need workspace trust first: run `claude` once in the directory and accept the dialog, otherwise `--worktree` exits with an error. Non-interactive runs with `-p` skip the trust check.

Mid-session, asking Claude to "work in a worktree" makes it call the `EnterWorktree` tool. Entering a path **outside** `.claude/worktrees/` always prompts for approval, because it moves the session's working directory, write access, and project configuration such as `CLAUDE.md`. A permission rule or "don't ask again" does not suppress that prompt; only `bypassPermissions` mode skips it. `ExitWorktree` returns the session to where it started.

### Choosing the base commit

`worktree.baseRef` in settings takes two values, and only two:

```json
{ "worktree": { "baseRef": "head" } }
```

- `fresh` (default): the repository's default branch on the remote, usually `main`. If the repository has not been fetched in 24 hours, Claude Code fetches, capped at five seconds, and falls back to the cached ref on failure. With no remote, or no cached `origin/HEAD` and no successful fetch, it falls back to the local `HEAD`.
- `head`: your current local `HEAD`, so the worktree carries unpushed commits. Inside a worktree, `head` means that worktree's `HEAD`.

You cannot set it to a branch name. To start from a specific branch, run `git worktree add` yourself.

### Enforcement, which is the interesting part

While a session is isolated, Claude Code **blocks** three classes of tool call rather than warning about them:

1. **File edits.** An `Edit`, `Write`, or `NotebookEdit` targeting a path in the main checkout fails.
2. **Working directory.** A `Bash`, `PowerShell`, or `Monitor` command whose working directory resolves to the main checkout fails, and so does one whose working directory cannot be verified as outside it.
3. **Git redirects.** A `Bash` or `Monitor` command that points git back at the main checkout fails, whether through `git -C`, `--git-dir`, `GIT_DIR`, `GIT_WORK_TREE`, or a `cd` before the git call. Commands too complex to verify are also blocked. PowerShell gets only the working-directory check.

The checks cover every subagent spawned from an isolated session, apply in background sessions as well as interactive ones, and extend to the main checkout that a linked worktree is linked from. Claude sees each refusal as a tool error naming the worktree.

This is the difference between "the agent has its own folder" and "the agent cannot leave its folder". Most other harnesses give the first and say so; VS Code says so explicitly.

### Subagents

Add one line of frontmatter and a subagent always runs in a temporary worktree:

```markdown
---
name: refactorer
description: Applies mechanical refactors across many files
isolation: worktree
---
Apply the requested refactor across every affected file, then run the tests
and report the results.
```

Behaviour: the worktree is removed automatically when the subagent finishes with no changes; a worktree with changes stays on disk. Subagent worktrees use the same base branch rule as `--worktree`, so by default they branch from the default branch, **not** from the parent session's `HEAD`. Set `worktree.baseRef: "head"` when the subagent needs to build on in-progress work. While an agent runs, Claude Code holds `git worktree lock` on its worktree so a concurrent sweep cannot remove it.

### Background sessions

Background sessions (`/bg`, `claude --bg`, or dispatch from agent view) start in the working directory and then move into a worktree under `.claude/worktrees/` **before** the first file change. Isolation is skipped when the session already sits in a linked worktree, when the directory is not a git repository and no `WorktreeCreate` hook exists, or when the write lands outside the working directory.

Escape hatch for repositories where worktrees are impractical:

```json
{ "worktree": { "bgIsolation": "none" } }
```

Then background sessions edit the working copy directly, with `.env` and `node_modules` already in place. The documentation's own caution applies: do not dispatch parallel sessions at the same files with this set.

When a background session finishes with changes, Claude Code commits without asking and pushes when a remote exists, opens a draft pull request when the task calls for it, and never pushes to `main` or `master`, never force-pushes, and never merges. Agent view shows the pull request number with a colour for its state.

### Cleanup rules

On exiting an interactive worktree session, Claude Code checks for changed files, untracked files, and new commits.

- Clean and unnamed: removed automatically, branch included.
- Clean and named: you are asked first.
- Has work: you choose keep or remove, and removing deletes the work.
- Non-interactive `-p` runs have no exit prompt, so nothing is cleaned up. Remove those with `git worktree remove`.

A periodic sweep removes subagent and background-session worktrees older than `cleanupPeriodDays` (default 30). The sweep skips any worktree holding changed files, untracked files, or unpushed commits, and never touches worktrees you made with `--worktree`. It also releases a lock left behind by a session whose process died, but never a lock you set yourself with `git worktree lock`.

### Replacing worktree creation entirely

`WorktreeCreate` fires when a worktree is about to be created and **replaces** the built-in git logic. It is unusual among Claude Code hooks in that **any** non-zero exit code fails creation, not just exit 2. Input arrives as JSON on stdin:

```json
{
  "session_id": "...",
  "transcript_path": "...",
  "cwd": "...",
  "hook_event_name": "WorktreeCreate",
  "worktree_path": "/path/to/worktree",
  "isolation": "worktree",
  "source": "cli"
}
```

`source` is `cli` for the `--worktree` flag or `background_session` for a background session. The hook prints the directory it created on stdout so Claude Code adopts it as the session's working directory. `WorktreeRemove` mirrors it at teardown with `source` of `session_exit`, `subagent_finish`, or `background_session_delete`, and its exit code is ignored.

The documented use for this is non-git version control. A Subversion example checks out a fresh working copy and echoes the path. Because the hook replaces the default logic, `.worktreeinclude` is no longer applied, so copy local configuration inside the hook.

### Sandbox interaction

Worth calling out because it is the one place a harness gets the shared-config problem right by construction. When the working directory is a linked worktree, the Bash sandbox allows writes to the main repository's shared `.git` directory so `git commit` can update refs and the index, but **keeps denying writes to `hooks/` and `config/` inside it** ([sandboxing](https://code.claude.com/docs/en/sandboxing)). A sandboxed command therefore cannot do to the shared config what the harness itself was reported doing in [issue 66993](https://github.com/anthropics/claude-code/issues/66993).

### `/batch`

A packaged fan-out: `/batch` splits one large change into 5 to 30 worktree-isolated subagents, each of which implements its unit, runs the tests, and opens a pull request. The documentation frames it for mechanical work (renames, framework migrations, repository-wide type cleanup) and warns against vague features or architecture-heavy work unless the target design is fixed first. That distinction is the practical rule from failure mode 7.

## Cursor

Source: [Worktrees, Cursor docs](https://cursor.com/docs/configuration/worktrees).

Four slash commands carry the workflow:

- `/worktree <task>`: run the rest of this chat in an isolated checkout.
- `/best-of-n <models> <task>`: run the same task under several models, each in its own worktree, then pick a winner. Example: `/best-of-n sonnet,gpt,composer fix the flaky logout test`.
- `/apply-worktree`: bring the changes into the main workspace to test them.
- `/delete-worktree`: remove the isolated checkout.

The Agents Window has native worktree controls; the IDE chat uses the slash commands. Cursor discovers worktrees it made and ones you made with `git worktree add`, and both are eligible for its cleanup.

Setup is declarative in `.cursor/worktrees.json`, read from the worktree path or the project root:

```json
{
  "setup-worktree": [
    "npm ci",
    "cp $ROOT_WORKTREE_PATH/.env .env",
    "npm run db:migrate"
  ]
}
```

Three keys are supported: `setup-worktree-unix` and `setup-worktree-windows` take precedence on their platform, `setup-worktree` is the fallback. Each key takes an array of shell commands or a path to a script relative to the config file. `$ROOT_WORKTREE_PATH` (or `%ROOT_WORKTREE_PATH%` on Windows) points at the main checkout, which is how `.env` gets copied.

Two settings bound the mess: `cursor.worktreeMaxCount` keeps 25 worktrees per machine by default, shared across all workspaces on the device, and `cursor.worktreeCleanupIntervalHours` sets the sweep frequency. Creating a worktree that would exceed the cap triggers immediate cleanup rather than waiting for the interval; newer worktrees are kept.

Cursor's documentation is also the clearest on the dependency question: do not symlink dependencies into a worktree, because it causes problems in the main worktree; install fresh with a fast package manager instead.

Nothing merges automatically, including after `/best-of-n`. You pick, then commit from the worktree or apply.

Widely repeated third-party claims that Cursor caps parallel agents at eight, or that the config file is `worktree.json` in the project root, do not appear in the official page. Treat both as unverified.

## OpenAI Codex

Two separate axes, which are easy to confuse.

**Thread mode** decides where the files live. Creating a thread in the Codex app offers Local, Worktree, or Cloud. Worktree mode creates a git worktree from your local checkout, checked out **detached by default**, and its documentation states plainly that worktrees only work in git repositories. Worktrees live in `$CODEX_HOME/worktrees`; the app keeps about 15 managed worktrees by default, adjustable in settings, and will not auto-delete one attached to a pinned conversation or an active thread. It snapshots before deleting so a removal can be restored. Background automations run on dedicated worktrees so they do not collide with foreground work.

**Handoff** moves a thread between Local and Worktree in either direction, and Codex performs the git steps. Use it when you want to read the changes in your usual editor, run your existing dev server, or validate in the environment you already have. One documented limit: files matching `.gitignore` do not transfer during a handoff. From the worktree side, "Create branch here" turns detached work into a real branch so you can commit and open a pull request. The documentation names git's one-branch rule as the reason Handoff exists rather than dual checkout.

**Sandboxing** is the other axis and is not about worktrees at all. Codex enforces at the operating-system level: Seatbelt on macOS, bubblewrap on Linux and WSL2, and a native sandbox on Windows. Keys are `sandbox_mode` (`read-only`, `workspace-write`, `danger-full-access`), `approval_policy` (`untrusted`, `on-request`, `never`), and the `--sandbox` and `--ask-for-approval` flags; `sandbox_workspace_write.writable_roots` widens the write scope. The guidance is worth quoting for its architecture advice: keep the project boundary as the default and use separate projects or worktrees rather than broadening access across unrelated repositories ([Codex sandboxing](https://learn.chatgpt.com/docs/sandboxing)).

Sources: the Codex app worktrees page as mirrored at [doc.jarvisuni.com](https://doc.jarvisuni.com/openai/codex/app/worktrees.html), and the sandboxing page above. The worktrees page is reached here through a mirror of `developers.openai.com`, which is noted in sources.

## VS Code and GitHub Copilot

VS Code is the clearest example of worktree handling living in the **surface** rather than the harness. It runs four harnesses (its own local one, Copilot, Claude, Codex) and provides isolation for all of them ([background agents](https://code.visualstudio.com/docs/copilot/agents/background-agents)).

Two isolation modes, chosen when you create a session:

- **Folder**: the agent works in your current folder and sees uncommitted changes. All permission levels available. Good for small interactive tasks.
- **New Worktree**: a new branch and worktree, starting from the committed state of a base branch you choose. Requires a git repository with at least one commit.

Three details make this the most instructive entry in the survey:

1. **Worktree sessions are forced to Bypass Approvals** and the level cannot be changed, because the agent's changes are separate from your active workspace. Isolation is traded directly for autonomy.
2. **The documentation refuses to overclaim.** Worktree isolation "doesn't restrict commands, network access, or access outside the worktree"; it is a code organisation boundary, not a security one, and you should configure agent sandboxing for those protections. Every harness could say this and only this one does.
3. **`git.worktreeIncludeFiles`** is the declarative fix for the gitignored gap, and the docs name the problem exactly: gitignored files such as `.env` and installed dependencies are absent by default, and uncommitted tracked changes do not transfer either.

The Chat view always uses folder isolation. All chats in one agent host session share the same folder or worktree unless you deliberately start separate worktree sessions.

An independent write-up adds two field observations: the agent auto-commits after each turn, giving a clean history, and worktree creation can fail inside dev containers, with cleanup left to `git worktree remove` by hand ([Ken Muse](https://www.kenmuse.com/blog/workspace-vs-worktree-isolation-in-copilot-cli/)). A DEV Community article dates the Agents-window worktree work to VS Code 1.127 through 1.131; treat that version range as secondary and unverified.

## Google Antigravity

Antigravity replaced its earlier one-repository workspace model with **projects** that can span several folders, each project carrying its own agent settings and permissions ([Antigravity projects](https://antigravity.google/docs/projects)).

Conversations start in one of two modes. Local mode works directly in your existing folders. **New Worktree Mode** creates a fresh git worktree per conversation, and the documentation notes it "will spawn a new Git worktree for all active Git checkouts", so a multi-folder project gets a worktree per git checkout while non-git folders stay as they are. The stated purpose is to keep your active folder untouched and stop parallel agents conflicting.

The Agent Manager is the surface for watching several agents across workspaces, with the guidance being one agent per workspace to avoid conflicts. Mechanics (paths, base commits, seeding, cleanup) are not published, which is why the matrix rows are empty rather than negative.

## Gemini CLI

Worktree support arrived as a `WorktreeService` in the core package, with a `--worktree` / `-w` flag that accepts a name or generates one, gated behind `"experimental": { "worktrees": true }` ([pull request 22973](https://github.com/google-gemini/gemini-cli/pull/22973)).

The cleanup design is the notable part and matches the direction Claude Code took: on exit, the service checks for untracked files and new commits, removes the worktree only when there are none, preserves it otherwise, and prints instructions for resuming in a preserved worktree. That is the correct default, and it is the fix for failure mode 3.

## Zed

Zed treats worktrees as a first-class part of its threads model ([Parallel Agents, Zed docs](https://zed.dev/docs/ai/parallel-agents)).

- Creation is through a worktree picker to the right of the project picker in the title bar.
- **New worktrees start detached**, and the documentation gives the reason: so you do not accidentally share a branch between worktrees. This is git's one-branch rule handled by construction rather than by error message.
- The `create_worktree` hook runs automatically after Zed creates a linked worktree, with `ZED_WORKTREE_ROOT` pointing at the new worktree and `ZED_MAIN_GIT_WORKTREE` at the original repository. Those two variables are all a setup script needs to copy secrets and install dependencies.
- Threads in linked worktrees group under the same project as their main worktree in the Threads Sidebar. The guidance is direct: if two threads might edit the same files, start one in a new worktree.
- Lifecycle is tied to the thread, not the folder. Moving a thread to Thread History saves the git state and removes the worktree from disk when no other active thread uses it; restoring the thread restores the worktree. That is the tidiest cleanup model in the survey, because a human action drives it.
- Landing is deliberately plain: review the diff and merge through your normal git workflow.

A public discussion of Zed's parallel agents surfaces the strongest field criticism collected for this report, and it is not about worktrees. The hardest problem practitioners named was semantic collision: when one agent renames a type `X` and another independently names it `Y`, neither worktree is wrong and the combined code is incoherent, and no coordination layer exists for that. Two more themes: shared test data defeats folder isolation (one team abandoned per-branch Postgres schemas because reasoning about which agent broke a shared migration got tiring, and went back to sequential agents), and review of parallel output can consume the gains ([Hacker News discussion](https://news.ycombinator.com/item?id=47866750)).

## Warp

Warp is the clean example of a surface that adds no worktree creation and still adds value ([Warp git worktrees](https://docs.warp.dev/code/git-worktrees/)).

You create worktrees with plain git commands. Warp then detects them by reading the `.git` file that points back at the main repository, and treats each as a fully functional repository:

- The git status chip shows the branch and change counts for that worktree.
- The code review panel shows that worktree's own uncommitted changes, so you can review diffs, revert hunks, and discard changes independently.
- File watching covers both the worktree's files and the shared `.git` folder.
- **Each worktree is indexed independently for codebase context**, which is what makes an agent in a worktree get correct answers about its own files.

Because Warp hosts other harnesses in tabs, this is also the common way to run Claude Code, Codex CLI, Gemini CLI, Amp, and others side by side, each in its own worktree. No setup scripts, no cleanup tooling.

## JetBrains IDEs

IntelliJ IDEA 2026.1 added first-class git worktree support, and the release notes name the reason: with the growth of AI agents, running tasks in parallel became a major time-saver, which is where worktrees help. The framing is "create a worktree for an urgent hotfix, hand another to an agent, keep working on your main branch" ([What's new in IntelliJ IDEA 2026.1](https://www.jetbrains.com/idea/whatsnew/2026-1/)). The overview does not cover shared indexing, visual indicators, or limits, so those cells stay empty.

## Third-party orchestrators and helpers

These fill the gaps the first-party tools leave, mostly runtime isolation and multi-agent review.

Read this table as a catalogue, not an assessment. Capability descriptions come from each project's own public summary and none were tested here. The two status claims marked in bold were verified directly against the repositories on 2026-08-11, because calling a live project dead is a mistake worth a fetch to avoid.

| Tool | What it adds | Isolation model | Status |
|---|---|---|---|
| [Superset](https://github.com/superset-sh/superset) | Run many agents at once, each with its own worktree, branch, terminal, and environment; compare results and merge the winner | Worktree per agent | Active, open source; desktop app, CLI, and MCP server |
| [container-use](https://github.com/dagger/container-use) | Worktree **plus** a Dagger-managed container per agent, each agent committing to its own `container-use/<env>` branch, with all changes auto-committed for an audit trail | Worktree and container | Active, MCP server |
| Sculptor (Imbue) | A Docker container per agent, so agents can install packages and run services without touching the host | Container per agent | Source-reported as open source, macOS on Apple Silicon and Linux; not independently verified |
| Conductor | Mac desktop app running parallel Claude Code, Codex, and Cursor agents in isolated workspaces, with Linear integration | Worktree per agent | Source-reported: Mac-only, closed source; not independently verified |
| [treehouse-worktree](https://github.com/mark-hingston/treehouse-worktree) | Worktree manager for parallel agents with both CLI and MCP interfaces, including locking a worktree to stop two agents entering it | Worktree per agent | Active |
| [Docktree](https://docktree.dev/) and [worktree-compose](https://github.com/mostafasudo/worktree-compose) | Per-worktree Docker Compose isolation: unique project name, container names, volumes, and auto-allocated ports, generated as override files over your existing `docker-compose.yml` | Runtime isolation on top of worktrees | Active |
| [git-cow-worktree](https://github.com/josharian/git-cow-worktree) | Reflink-seeded worktrees: `--no-checkout`, copy-on-write copy from a similar worktree, then checkout | Seeding helper | Active |
| [opencode-worktree](https://github.com/kdcokenny/opencode-worktree) | Worktree tools for OpenCode: spawns a terminal per worktree, syncs files, commits and cleans up on exit | Worktree per agent | Active |
| [Crystal](https://github.com/stravu/crystal) | Was a desktop app for parallel Claude Code sessions, one worktree each | Worktree per agent | **Deprecated.** Its README says it has been replaced by Nimbalyst |
| [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) | Was a Kanban board over parallel agents with visual review | Worktree per agent | **Sunsetting**, per the banner in its README. Code remains under Apache-2.0 |

The churn matters. Two of the best-known worktree orchestrators of the past year are gone, and both were replaced by paid successors. Build your worktree workflow on git commands and repository-committed setup scripts, not on a specific wrapper.

## Harnesses that skip worktrees entirely

When the agent gets its own machine, branch-per-task replaces worktree-per-task, and every problem in failure modes except the semantic ones goes away.

| Harness | Isolation | Consequence |
|---|---|---|
| Claude Code on the web | An Anthropic-managed virtual machine per session, a network proxy enforcing a default allowlist, and a separate proxy that keeps your GitHub token outside the sandbox while issuing scoped credentials inside it | Full operating-system isolation with no infrastructure to run. Organisations can route sessions to self-hosted environments, where isolation and egress control become theirs |
| GitHub Copilot coding agent | An ephemeral GitHub Actions container per session, destroyed afterwards | No state carries between sessions |
| Codex cloud | An ephemeral sandbox per cloud task | Fresh environment per task |
| Cursor cloud agents | Ephemeral remote machines | Local machine stays free |
| Devin | A cloud virtual machine per task, described as persistent rather than ephemeral | State survives across operations, at the cost of drift |

Claude Code's own comparison of isolation options ranks these by what they contain: the sandboxed Bash tool covers Bash commands and their children; the sandbox runtime covers the whole process including file tools, MCP servers, and hooks; dev containers and custom containers cover a full development environment; a virtual machine covers a full operating system ([sandbox environments](https://code.claude.com/docs/en/sandbox-environments)). Worktrees appear in none of those rows, which is the point: **a worktree is not a sandbox.** It is a naming and ownership boundary for files.

Continue to surface patterns.

---

<!-- 11archive-source: 03-surface-patterns.md -->

# Surface patterns: what the tools converged on

Nine tools built worktree support independently within about a year. They landed on seven of the same patterns. Each pattern below is worth copying if you build a harness, and worth recognising if you use one, because the pattern tells you where the responsibility sits.

## Pattern 1: three entry points, not one

Every harness offers at least one of these, and the mature ones offer two or three.

| Entry point | Example | When it fits |
|---|---|---|
| Flag at launch | `claude --worktree feature-auth`, `gemini -w` | You already know this session is a parallel one |
| Mode at session creation | Codex app "Worktree" thread, VS Code "New Worktree" checkbox, Antigravity "New Worktree Mode" | A graphical surface where the choice belongs next to the other session settings |
| Tool or command mid-session | Claude Code's `EnterWorktree`, Cursor's `/worktree` | You discover halfway through that this needs isolating |

The mid-session entry point is the one to get right, because it is the one an agent triggers. Two safeguards seen in practice:

- **Approve moves outside the sanctioned directory.** Claude Code prompts before `EnterWorktree` targets a path outside `.claude/worktrees/`, because entering moves the session's working directory, its write access, and its project configuration. A permission rule cannot suppress that prompt; only `bypassPermissions` mode skips it.
- **Restrict the tool once isolated.** From inside a worktree session, or from a subagent with a pinned working directory, only the "switch to an existing path" form is available, and the target must be under the repository's own worktree directory.

## Pattern 2: pick the base commit deliberately

The default matters more than it looks. Three choices exist and each has a failure mode.

| Base | Who uses it | What it gets right | What it breaks |
|---|---|---|---|
| Remote default branch, freshly fetched | Claude Code default (`worktree.baseRef: "fresh"`) | The agent starts from clean, shared reality; the branch merges without carrying your local mess | An agent asked to build on your uncommitted work starts from the wrong place and quietly redoes it |
| Local `HEAD` | Claude Code `"head"`, VS Code's selected base branch (committed state) | Carries unpushed commits and feature-branch state | Inherits any local breakage, and the branch is harder to land |
| Detached commit | Zed on every create, Codex app by default | Sidesteps git's one-branch rule completely, so several agents can sit on the same work | Nothing to push until someone names a branch, so the work is easy to lose track of |

Two implementation details worth stealing:

- **Keep the fetch bounded.** Claude Code fetches the default branch only when the repository has not been fetched in 24 hours, caps the fetch at five seconds, and uses the cached ref if that fails. A worktree creation that hangs on a slow network is a worktree creation nobody uses.
- **Promote a detached worktree explicitly.** The Codex app's "Create branch here" turns detached work into a branch you can commit and open a pull request from. Without a promote action, detached HEAD is a trap.

## Pattern 3: close the gitignored gap, one of four ways

A worktree contains committed files only. Every harness needs an answer for `.env` and `node_modules`, and there are exactly four in the field.

| Approach | Mechanism | Cost | Best for |
|---|---|---|---|
| Declarative copy list | Claude Code `.worktreeinclude`, VS Code `git.worktreeIncludeFiles` | Milliseconds | Secrets and local config |
| Setup script | Cursor `.cursor/worktrees.json`, Zed `create_worktree` hook, Claude Code `WorktreeCreate` hook | Whatever your install takes | Dependencies, migrations, code generation |
| Copy-on-write copy | `cp -Rc` on APFS, reflink on btrfs or XFS with `reflink=1` | Roughly one syscall per file, no extra disk | Large dependency trees on a supporting filesystem |
| Pre-warmed pool | Custom tooling; recycle a fixed set of worktrees | Built once, then near zero | Monorepos where installs run in minutes |

Two design notes:

- **The copy list should only copy ignored files.** Claude Code copies a match only when the file is also gitignored, so tracked files are never duplicated into a divergent second copy. That single rule prevents a nasty class of bug where a worktree carries a stale copy of a tracked file.
- **The setup script needs a pointer home.** Every implementation passes the main checkout's path in an environment variable: `$ROOT_WORKTREE_PATH` in Cursor, `ZED_MAIN_GIT_WORKTREE` in Zed. Without it, `cp` from the main checkout is guesswork.

An anti-pattern with a documented reason: symlinking one `node_modules` across worktrees. Node's module resolution follows real paths and gets confused, so tests pass in one worktree and fail in another. Cursor's documentation warns against it directly.

## Pattern 4: separate the organisation boundary from the security boundary

This is where harnesses differ most, and where the words used in documentation matter.

Three levels exist in the wild:

1. **Convention only.** The worktree is a different folder and nothing stops the agent leaving it. Warp, JetBrains, and any manual `git worktree add` workflow.
2. **Harness-enforced writes.** The harness inspects each tool call and blocks the ones that reach the main checkout. Claude Code is the reference implementation, with three checks: file edits by path, command working directory, and git redirects through `git -C`, `--git-dir`, `GIT_DIR`, `GIT_WORK_TREE`, or a `cd`. Commands it cannot verify are blocked rather than allowed.
3. **Operating-system enforced.** Seatbelt on macOS, bubblewrap with Landlock and seccomp on Linux, a container, or a virtual machine. This is the only level that stops arbitrary child processes.

VS Code states the boundary plainly: worktree isolation does not restrict commands, network access, or access outside the worktree, and you should configure agent sandboxing for those protections. Take that as the general rule, and treat level 2 as a correctness feature rather than a security one.

One clean example of the two layers cooperating: Claude Code's Bash sandbox lets a command in a linked worktree write the shared `.git` directory so `git commit` works, while still denying writes to `hooks/` and `config/` inside it. Files needed for the job are writable; the two files that would affect the whole clone are not.

A tradeoff to notice: VS Code sets worktree sessions to Bypass Approvals and does not let you change it, on the grounds that the agent cannot touch your working copy. Isolation buys autonomy. That is reasonable at level 2 for file safety and unreasonable for anything else, which is why the same page points at sandboxing.

## Pattern 5: landing the work, five ways

Nobody auto-merges. Five distinct landing models are in use, and the choice reveals what the tool thinks the worktree is for.

| Model | Example | The worktree is treated as |
|---|---|---|
| Apply to the main workspace | Cursor `/apply-worktree` | A scratch area whose diff you want locally |
| Hand the session back | Codex app "Hand off" to Local | A place the thread visited, not where it lives |
| Commit and open a pull request | Claude Code background sessions, Copilot coding agent | A branch factory |
| Review and merge in place | Zed, VS Code, Warp | An ordinary git branch |
| Pick a winner from several | Cursor `/best-of-n`, Superset | One candidate among many |

Two details worth copying:

- **Say what the tool will never do.** Claude Code documents that background sessions never push to `main` or `master`, never force-push, and never merge. A written negative list is what makes automatic commits acceptable.
- **Gitignored files do not travel.** The Codex app documents that files matching `.gitignore` do not transfer during a handoff. Any apply or handoff step needs this stated, or people lose local config and blame the tool.

The best-of-N model deserves its own note. It answers a real property of language models: the same prompt run twice gives different results. Running three models on one flaky test in three worktrees and keeping the best is a legitimate use of parallelism that has no merge problem at all, because you throw two away. It is the cheapest form of parallel agent work and the most underused.

## Pattern 6: lifecycle, quota, and the refusal to delete work

Worktrees accumulate. Every tool that creates them automatically also caps them, and the caps are all count-based or age-based.

| Control | Implementation |
|---|---|
| Lock while running | Claude Code runs `git worktree lock` on an agent's worktree so a concurrent sweep cannot remove it, and releases it when the agent finishes |
| Release a stale lock | Claude Code's sweep releases a lock left by a session whose process exited, and never releases a lock you set yourself |
| Cap by count | Cursor keeps 25 per machine by default, shared across workspaces, and cleans up immediately rather than waiting when a new one would exceed the cap. The Codex app keeps about 15 |
| Cap by age | Claude Code's sweep removes subagent and background-session worktrees older than `cleanupPeriodDays`, default 30 |
| Exempt the ones you asked for | Claude Code's sweep never removes worktrees created with `--worktree`. The Codex app never auto-deletes one attached to a pinned conversation or active thread |
| Snapshot before delete | The Codex app snapshots a worktree before deletion so removal can be restored |
| Tie lifetime to the human action | Zed saves the git state and removes the worktree when you move the thread to history, and restores it when you restore the thread |

The rule that matters more than all of them: **never remove a worktree that holds work.** Every mature implementation now checks for changed files, untracked files, and unpushed commits before removing, and Gemini CLI's implementation was written this way from the start. The reason this became a design rule is failure mode 3: a commit that fails on a lock, followed by an agent exit, followed by a sweep, equals lost work.

## Pattern 7: re-binding a session to its worktree

A session that lives in a worktree has to find it again after a restart, and the worktree might have been moved, deleted, or replaced with something that only looks like a worktree. This is the least visible pattern and the one with the most edge cases.

Claude Code is the only surveyed harness with this specified in public, and the specification is instructive:

- **Resume returns the session to its worktree**, in interactive mode, in `-p` mode with `--continue` or `--resume`, and through the Agent SDK.
- **The identity of the folder is checked first.** If the folder's `.git` file resolves into the main checkout, or git resolves its working tree back to the main checkout through a `core.worktree` redirect, the harness refuses it. The reason given is concrete: from such a folder, `git reset --hard` would act on the main checkout instead.
- **A refused folder is left in place**, because it may hold work.
- **Where you launched from changes the answer.** A worktree created under the sanctioned directory is re-entered even when you launch from inside it. Launching from inside some other worktree only works when the harness can vouch for it from there.
- **A network path is never resumed into.**
- **Refusal downgrades rather than crashes** in interactive mode: the session continues without isolation and says so. In `-p` mode and the SDK it stops with an error instead, because a script silently losing isolation is worse than a script failing.

The transferable lesson: **verify the folder's git identity before adopting it as an isolation boundary, and treat "cannot verify" as "refuse".** A folder that is not really a separate checkout, but is treated as one, turns every enforcement check in [pattern 4](#pattern-4-separate-the-organisation-boundary-from-the-security-boundary) into a no-op.

## What no pattern covers

Three gaps are shared by every tool surveyed.

1. **Runtime isolation.** No first-party harness allocates ports, names Docker Compose projects, or provisions a database per worktree. Third-party tools do it by generating Compose override files. If your agent runs the app, this is your problem.
2. **Semantic coordination.** No tool prevents two agents from making incompatible but individually correct decisions. The only working answers are human: partition ownership, fix shared interfaces before fanning out, or sequence the work.
3. **Concurrency sized by review capacity.** Caps are set by disk and count. The real constraint is how many diffs a person will read. Nothing in any tool measures that.

Continue to failure modes and fixes.

---

<!-- 11archive-source: 04-failure-modes-and-fixes.md -->

# Failure modes and fixes

Sixteen ways worktree-based agent isolation breaks, each with the cause and a fix. Ordered by how much damage they do, not how often they happen.

Evidence states are marked. **Source-reported** means a source stated it and this report did not measure it. **Documented** means it is in a product manual or the git manual. **Inferred** means it follows from documented mechanics.

## 1. Writing `.git/config` from a worktree changes the whole clone

**Severity:** high. Silent, and it can stay broken for days.

**Symptom.** A repository's committed git hooks stop running. Not just in the worktree: everywhere in the clone, including the main checkout and every other worktree.

**Cause.** Linked worktrees share one `.git/config`. A harness that runs `git config <key> <value>` with the worktree as the current directory believes it is configuring "this worktree" and is actually configuring the repository. One reported case: Claude Code's worktree setup ran the equivalent of `git config core.hooksPath <abs path to mainRepo/.git/hooks>`, which overrode a repository whose committed `core.hooksPath` pointed at a tracked `hooks/` directory. The reporter's pre-push quality gates stopped firing across the entire clone for several days, and they restored enforcement by adding forwarding shims in `.git/hooks` ([issue 66993](https://github.com/anthropics/claude-code/issues/66993)). Evidence: source-reported, with a reproduction in the issue.

**Fix, in order of preference.**

1. Turn on per-worktree config in the repository, once:

   ```bash
   git config extensions.worktreeConfig true
   ```

   Then every per-worktree setting is written with `--worktree` and lands in `.git/config.worktree` or `.git/worktrees/<id>/config.worktree`:

   ```bash
   git config --worktree core.hooksPath .git/hooks
   ```

   Cost: git versions older than the extension refuse to open the repository. Check what your team and your CI runners use first.

2. Have the harness respect an existing value. If `core.hooksPath` is already set to a repository-managed directory, leave it alone.

3. At minimum, surface the change. A silent global config write is the part that made this expensive.

**Detection.** After any worktree session, from the main checkout:

```bash
git config core.hooksPath
git config --list --show-origin | grep -i hookspath
```

If the value is an absolute path into `.git/hooks` and you committed something else, this happened to you.

## 2. Concurrent worktree creation and commits fight over git locks

**Severity:** high, because it usually pairs with failure mode 3 and turns into lost work.

**Symptom.** Two error shapes.

```text
error: could not lock config file .git/config: File exists
error: unable to write upstream branch configuration
```

```text
Unable to create '.git/index.lock': File exists
```

**Cause.** Git uses lock files for mutual exclusion on shared state. Worktrees have separate index files, but `git worktree add` writes the shared `.git/config` (for the upstream branch setting), and commits update shared refs and create objects. Fire several agents at once and the writes collide. Locks are held for milliseconds, so this is a race, not a queue.

**Reported scale**, both source-reported single reports rather than controlled measurements:

- 3 agents launched in one message with worktree isolation: typically 1 succeeded, 2 failed ([issue 47266](https://github.com/anthropics/claude-code/issues/47266)).
- 13 agents: 5 committed, 8 failed. The reporter described the failure rate as intermittent at 5 agents and near-certain at 10 or more ([issue 55724](https://github.com/anthropics/claude-code/issues/55724)).

**Fix.**

1. **Serialise creation.** Create worktrees one at a time, then run the agents in parallel. Creation is fast; only the write to shared config is contended.
2. **Retry with backoff** on any lock error, roughly 200ms, 400ms, 800ms, up to five attempts. Most retries succeed.
3. **Stagger startup** by a random 100ms to 500ms when creating several worktrees, which spreads the git calls without any coordination.
4. **Avoid the config write.** Creating with `--detach` or `--no-track` avoids setting an upstream branch, which is what touches `.git/config` during `git worktree add`. Evidence: inferred from the git manual's description of `--track` and `--no-track`; test it against your git version before relying on it.

A wrapper you can drop into a `WorktreeCreate` hook or a setup script:

```bash
#!/usr/bin/env bash
set -euo pipefail
path="$1"; branch="$2"
for attempt in 1 2 3 4 5; do
  if git worktree add --no-track -b "$branch" "$path" 2>/tmp/wt.err; then
    exit 0
  fi
  grep -q "File exists" /tmp/wt.err || { cat /tmp/wt.err >&2; exit 1; }
  sleep "0.$((attempt * 2))"
done
cat /tmp/wt.err >&2
exit 1
```

## 3. Automatic cleanup deletes the work

**Severity:** high. This is the only failure mode in the list that destroys data.

**Symptom.** An agent reports it finished, and its worktree and its changes are gone.

**Cause.** A chain, not a single bug. The commit fails on a lock (failure mode 2). The agent exits without committing. An automatic sweep sees a worktree it created for a finished agent and removes it, taking the uncommitted files with it ([issue 55724](https://github.com/anthropics/claude-code/issues/55724)). Evidence: source-reported.

**Fix.**

1. **Gate every automatic removal on the worktree being clean.** The check is one command:

   ```bash
   test -z "$(git -C "$worktree" status --porcelain)"
   ```

   Extend it to unpushed commits before you call a worktree disposable.

2. **Lock while running.** `git worktree lock --reason "agent running" <path>` makes a concurrent sweep refuse to remove it. Release on finish, and release stale locks for processes that died.
3. **Never auto-remove a worktree a human named.** An explicitly named worktree is a statement of intent.

Current implementations that already do this: Claude Code's sweep skips worktrees with changed files, untracked files, or unpushed commits and never touches `--worktree` ones; Gemini CLI's service preserves a worktree with untracked files or new commits and prints resume instructions; the Codex app snapshots before deleting so a removal can be restored.

**If it already happened**, before doing anything else: `git fsck --lost-found` finds committed-but-unreferenced objects, but nothing recovers files that were never committed. That is why the gate matters.

## 4. The worktree is missing the files the project needs to run

**Severity:** medium. Wastes agent turns rather than data.

**Symptom.** An agent in a fresh worktree cannot start the app, cannot connect to anything, and reports missing modules or missing configuration. It then tries to be helpful and writes a new `.env` with guessed values.

**Cause.** Documented behaviour, not a bug: `git worktree add` writes committed files for the chosen commit and nothing else. Gitignored files, installed dependencies, build caches, and local databases are all absent. VS Code's documentation names this directly; so does Claude Code's.

**Fix.** Declare both halves, in the repository, so every worktree gets them.

Secrets and local config, with a copy list:

```text
# .worktreeinclude
.env
.env.local
config/secrets.json
```

Dependencies and setup, with a script. Cursor's form:

```json
{
  "setup-worktree": [
    "npm ci",
    "cp $ROOT_WORKTREE_PATH/.env .env",
    "npm run db:migrate"
  ]
}
```

Zed's equivalent is a `create_worktree` hook with `ZED_WORKTREE_ROOT` and `ZED_MAIN_GIT_WORKTREE` set. Claude Code's is a `WorktreeCreate` hook, which replaces creation entirely and therefore has to copy the config itself, because `.worktreeinclude` is not applied when a hook takes over.

**Also add a fast failure.** Put a check at the top of the setup script that exits non-zero when a required file is missing. A worktree that fails to build is a five-second problem; a worktree that half-builds is an hour.

## 5. Dependency installation makes worktree creation useless

**Severity:** medium. The reason teams abandon worktrees.

**Symptom.** `git worktree add` takes 200ms and `yarn install` takes 10 minutes, so the cost of a parallel agent is ten minutes, and nobody starts one.

**Cause.** File count, not file size. A large JavaScript monorepo can carry 750,000 files in its dependency tree, and the bottleneck is creating that many directory entries. One practitioner tried symlinks (Node's module resolution broke during tests), hardlink installs (still 750,000 entries), and APFS copy-on-write cloning (still one clone syscall per file), and none of them solved it ([Dave Schumaker](https://daveschumaker.net/use-git-worktrees-they-said-itll-be-fun-they-said/)). Evidence: source-reported.

**Fix, cheapest first.**

1. **Use a fast installer.** `pnpm`, `bun`, and `uv` all install from a content-addressed store and are much faster than a cold `npm install`. This is Cursor's documented recommendation.
2. **Copy-on-write copy the dependency directory** on a supporting filesystem:

   ```bash
   cp -Rc /work/app/node_modules /work/app-feature/node_modules   # APFS
   cp -R --reflink=auto ...                                        # btrfs, XFS reflink=1
   ```

   A 1GB directory then costs no extra disk until something changes. Works well up to tens of thousands of files.
3. **Pool and recycle worktrees** when the tree is very large. Keep a fixed set (six worked for the practitioner above), activate a slot by checking out the branch, compare the lockfile against the previous checkout, and run the install only when the lockfile changed. Because most branches start from a recent default branch, the lockfile usually has not changed, so activation is seconds.
4. **Reflink-seed at creation time** with the `--no-checkout` trick: register the worktree with no files, copy-on-write copy from a similar existing worktree, then `git checkout` to reconcile the index. Packaged as [git-cow-worktree](https://commaok.xyz/post/git-cow-worktrees/).

**Anti-fix:** one shared `node_modules` symlinked into every worktree. It breaks module resolution and diverges the moment two branches need different dependency versions. Cursor's documentation warns against it explicitly.

## 6. Ports, databases, and Docker collide even though the folders do not

**Severity:** high when the agent runs the app. Invisible until then.

**Symptom.** Agent B's dev server fails to bind. Agent A's tests fail because Agent B ran a migration. Both agents share one Redis and neither knows it.

**Cause.** A worktree isolates files. Everything else on the machine is shared: there is one port 3000, one port 5432, one Docker daemon, one set of default Compose project and container names, one host filesystem for bind mounts, and one database server. Nothing in git addresses any of it. Evidence: documented in third-party tooling, and named in practitioner discussion as the reason one team abandoned per-branch database schemas and went back to sequential agents.

**Fix.** Pick a level and be consistent.

1. **Per-worktree Compose isolation.** Generate an override file per worktree with a unique project name, container names, volumes, and host ports. The pattern used in the field is an index-based offset, for example `20000 + default_port + index`, so worktree 0 gets 23000 and worktree 1 gets 23001. [Docktree](https://docktree.dev/) and [worktree-compose](https://github.com/mostafasudo/worktree-compose) generate these over an existing `docker-compose.yml`.
2. **Port allocation in the setup script.** If you do not use Compose, allocate the port in the worktree's `.env` at creation and read it everywhere:

   ```bash
   # in setup-worktree
   index=$(git worktree list --porcelain | grep -c '^worktree ')
   echo "PORT=$((3000 + index))" >> .env
   ```

3. **Database per worktree, not schema per worktree.** A separate database name is easier to reason about than a shared server with per-branch schemas, and it means a bad migration in one worktree cannot be seen from another. Name it after the worktree.
4. **Container per agent** when agents install packages or run services. [container-use](https://github.com/dagger/container-use) gives each agent a container plus a worktree plus its own branch; Sculptor gives each agent a Docker container.
5. **Set CPU and memory limits** on each agent's stack, so one agent's test suite cannot starve the others.

## 7. Semantic conflicts that git cannot see

**Severity:** high. The hardest problem in the list, and the one no tool solves.

**Symptom.** Two branches merge cleanly. The result does not make sense. One agent named the concept `Subscription`, the other named it `Plan`, and both wrote consistent code around their choice. Or two agents implemented the same interface differently, and each compiles alone.

**Cause.** Git compares text. Nothing in the toolchain compares meaning. Practitioners describing this said the hardest problem was not file conflicts but architectural consistency, and that neither worktree is wrong while the combined code is incoherent ([Hacker News discussion](https://news.ycombinator.com/item?id=47866750)).

**Scale.** Textual conflicts alone are common enough to plan for. Merging 747 pairs of agent pull requests gave a 41.7% conflict rate for pairs from different agents and 19.8% for pairs from the same agent, with 84.4% of conflicts in source files rather than dependency lists and nearly 42% structural (deletions against additions) ([arXiv 2607.04697](https://arxiv.org/abs/2607.04697)). A larger dataset found 27.67% of 107,000 simulated merges conflicted ([AgenticFlict, arXiv 2604.03551](https://arxiv.org/abs/2604.03551)). Semantic conflicts are, by definition, not in those numbers. They are the ones that got through.

**Fix.** All of these are process, not tooling.

1. **Fix the shared interface before you fan out.** Write the type, the schema, or the API signature, commit it, and have every agent branch from that commit. This is why Claude Code's `/batch` documentation says not to use it for architecture-heavy work "unless you first define the target design".
2. **Partition by file ownership, and write the partition into each task.** Give each agent the paths it owns and tell it the paths it must not touch. Claude Code's agent-teams guidance takes the same line for teammates that share a checkout.
3. **Fan out on mechanical work only.** Renames, framework migrations, repository-wide type cleanup, repetitive changes with clear rules. Reserve ambiguous design work for one agent at a time.
4. **Test the merge, not the branch.** A branch that passes alone proves nothing about the pair. Merge each candidate into an integration branch and run the suite there before landing.
5. **Merge in a fixed order and rebase the rest.** Rebasing keeps history linear, which also makes `git log` readable to the next agent.

## 8. Review capacity is the real ceiling

**Severity:** medium, and it compounds.

**Symptom.** Ten agents finish, ten pull requests wait, and the value of the parallelism is now sitting in a queue in front of one person.

**Cause.** Verification does not parallelise the way generation does. Review load grows roughly linearly with agent count while review capacity stays flat. Analyses of speculative parallelism in agent pipelines make the same point formally: adding candidates adds selection and merge overhead, and gated merge review is a serial bottleneck with finite capacity.

**Fix.**

1. **Set concurrency from review capacity.** Decide how many diffs you will read today and run that many agents. Practitioners writing publicly settle around two to five local agents; the tools will happily let you run fifty.
2. **Prefer many small independent units over a few large ones.** A 30-file rename split into 30 reviewable pull requests is easier than one 30-file pull request, and each one can be checked in seconds.
3. **Make agents produce reviewable diffs.** Require tests in the same branch, a plain description of what changed, and commits grouped by intent rather than by the order the agent happened to work.
4. **Kill work early.** A best-of-N run where you discard two of three candidates has no review cost for the discarded two. That is a feature.

## 9. Git refuses to check out the branch the agent wants

**Severity:** low. Noisy but harmless.

**Symptom.** `fatal: '<branch>' is already checked out at '<path>'`.

**Cause.** Documented and deliberate: git will not let two worktrees hold the same branch, because both would try to advance it.

**Fix.** Any of three.

- Create the worktree detached: `git worktree add --detach <path>`. Zed and the Codex app both default to this.
- Create a new branch per worktree: `git worktree add <path> -b <branch>`.
- Move the session rather than the branch. The Codex app's Handoff exists for exactly this, and its documentation names dual checkout as the thing to avoid.

## 10. Submodules

**Severity:** medium in repositories that use them, absent elsewhere.

**Symptom.** `git worktree move` fails. `git worktree remove` needs `--force`. Submodule contents are missing or stale in the new worktree.

**Cause.** Documented in the git manual: submodule support in worktrees is incomplete, moving a worktree containing submodules is not supported, and multiple checkouts of a superproject are explicitly not recommended.

**Fix.**

- Do not move worktrees in a superproject. Remove and recreate.
- Initialise submodules per worktree in your setup script: `git submodule update --init --recursive`.
- For heavy submodule use, prefer a full clone per agent over a worktree. A clone costs disk and a fetch; a half-initialised superproject costs debugging.

## 11. Symlinks and unusual paths

**Severity:** medium. Two of these have caused file loss.

**Symptom.** Worktree creation refuses to run, or removing a worktree deletes something outside it.

**Cause and fix**, all documented in Claude Code's worktrees page:

- **A symlink in the worktree path.** Claude Code refuses to create a worktree when `.claude`, `.claude/worktrees`, or the worktree directory itself is a symlink, and names the path. Before v2.1.212, a committed symlink at one of those paths was followed and could create files outside the repository. Fix: remove the symlink.
- **A link nested inside the worktree, on Windows.** Removing a worktree deletes only the link, keeping the folder it points at. Before v2.1.205, removal could delete the target folder. Fix: run a current version, and keep NTFS junctions and directory symlinks out of worktrees.
- **A network path.** Claude Code never resumes a session into a worktree recorded at a network path. Fix: keep worktrees on local disk.

## 12. Stale worktree bookkeeping after a move

**Severity:** low.

**Symptom.** `git worktree list` shows paths that do not exist, or a worktree cannot find its repository after someone moved a folder in Finder.

**Cause.** The link is two pointers: the `gitdir:` line in the worktree's `.git` file, and the `gitdir` file in `$GIT_DIR/worktrees/<id>/`. Moving a folder by hand updates neither.

**Fix.**

```bash
git worktree repair                     # from the main checkout, after moving it
git worktree repair /new/path/wt1 /new/path/wt2   # after moving linked worktrees
git worktree prune --dry-run            # see what bookkeeping would go
git worktree prune
```

To reduce the chance of it happening, `git config worktree.useRelativePaths true` makes the admin files relative, at the cost of setting `extensions.relativeWorktrees`, which older git versions refuse.

## 13. Editors and language servers multiply

**Severity:** medium on a laptop.

**Symptom.** Five worktrees open means five project indexes, five sets of language servers, and a machine that is slower than one agent working alone.

**Cause.** Editor tooling is per-folder by design. Practitioners in the Zed discussion reported five or six language servers spawning for a single TypeScript file, with memory growth to match.

**Fix.**

- Prefer surfaces that index per worktree deliberately: Warp indexes each worktree independently for codebase context, and JetBrains 2026.1 added first-class worktree support partly for this reason.
- Close worktrees you are not reviewing. The folder can stay; the editor window does not have to.
- Run agents in terminals rather than editor windows when you are not reading their output yet.
- Move to a remote machine when the local ceiling is CPU rather than review capacity.

## 14. Workspace trust and permission prompts get in the way

**Severity:** low, but it looks like a bug the first time.

**Symptom.** `claude --worktree` exits with an error before doing anything.

**Cause.** Documented: interactive runs require workspace trust, so a directory you have never run Claude in refuses. Non-interactive `-p` runs skip the trust check.

**Fix.** Run `claude` once in the directory and accept the dialog. Related and worth knowing: as of v2.1.211, a "Yes, don't ask again" approval granted inside a worktree is saved to the main checkout's `.claude/settings.local.json`, so it applies in every worktree and survives that worktree's removal. Before that version, the approval was saved inside the worktree and lost with it, which meant re-approving the same command in every new worktree.

## 15. Non-git version control has no worktrees

**Severity:** blocking, where it applies.

**Symptom.** Worktree isolation is unavailable in a Subversion, Perforce, or Mercurial repository.

**Cause.** Worktrees are a git feature.

**Fix.** Replace the creation logic with a hook. Claude Code's `WorktreeCreate` and `WorktreeRemove` hooks exist for this, and the documented Subversion example checks out a fresh working copy and prints its path on stdout so the harness adopts it as the session's working directory:

```json
{
  "hooks": {
    "WorktreeCreate": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'NAME=$(jq -r .name); DIR=\"$HOME/.claude/worktrees/$NAME\"; svn checkout https://svn.example.com/repo/trunk \"$DIR\" >&2 && echo \"$DIR\"'"
          }
        ]
      }
    ]
  }
}
```

Two things to get right. Any non-zero exit code fails creation, unlike most hooks where only exit 2 blocks. And because the hook replaces the built-in logic, `.worktreeinclude` is not processed, so copy local configuration inside the hook script.

For **Jujutsu**, use workspaces instead: `jj workspace add ../agent-auth`. A workspace is tied to a revision rather than a branch, so several can sit on the same work. Two documented limits: git worktree commands are not supported against a jj repository, and partial clones are unsupported.

## 16. The recovery instruction the agent cannot follow

**Severity:** low individually, instructive generally.

**Symptom.** A guard blocks a write and tells the agent to isolate itself first. The agent tries, cannot, gives up, and asks the human to run a command.

**Cause.** The guard's message named a tool whose schema was not loaded in that session, so calling it failed. The agent did not know it needed to load the schema first, retried the original write, hit the same guard, and stopped ([issue 62372](https://github.com/anthropics/claude-code/issues/62372)). Evidence: source-reported, no maintainer response at the time of the report.

**Fix.** Applies to any harness that writes guard messages for an agent to act on.

1. Name the exact prerequisite in the error text, not just the goal.
2. Preload the schema of any tool a guard tells the agent to call.
3. Better still, make the recovery automatic: isolate the session on the first write attempt rather than blocking and explaining.

The general lesson: **a guard message is an interface for a model, and needs the same care as a tool description.** "Call X first" is only useful if X is reachable from where the agent is standing.

Continue to the decision guide.

---

<!-- 11archive-source: 05-decision-guide.md -->

# Decision guide: choosing and sizing isolation

## Four layers, four different questions

Isolation is not one decision. It is four, and worktrees answer only the first.

| Layer | The question it answers | What it stops | What it costs | Typical mechanism |
|---|---|---|---|---|
| Files | Can two agents overwrite each other's edits? | Lost edits, mixed diffs, one branch carrying two changes | A folder per agent, plus the setup to make that folder usable | Git worktree, or a full clone |
| Repository plumbing | Can two agents corrupt each other's git operations? | Lock failures, config leaks, shared stash | A little serialisation and retry logic | Serialised creation, `extensions.worktreeConfig`, backoff |
| Runtime and state | Can two agents run the app at once? | Port clashes, one shared database, colliding container names | A container or a port and database allocation scheme | Container per agent, or per-worktree Compose override |
| Machine | Can the agent damage the host or reach what it should not? | Arbitrary child processes, network egress, host filesystem | A container, virtual machine, or a hosted sandbox | OS sandbox, container, VM, cloud session |

Read down the "what it costs" column. The layers get more expensive going down, and most teams stop after the first because it is the only one their tool sets up for them.

**A worktree is not a sandbox.** It is a naming and ownership boundary for files. VS Code's documentation says so in plain terms: worktree isolation does not restrict commands, network access, or access outside the worktree.

## Pick the file-isolation mechanism

| Situation | Use | Why |
|---|---|---|
| Two to five local agents on one repository | Git worktree per agent | Shares the object store, so a 10GB repository costs only the checked-out files per agent |
| Repository with submodules, especially a superproject | Full clone per agent | The git manual does not recommend multiple checkouts of a superproject, and `git worktree move` fails with submodules |
| Very large dependency tree, worktrees created often | Pooled worktrees, recycled | Install cost dominates creation cost; a pool amortises it |
| Agents that install packages or start services | Container per agent, worktree inside it | Runtime isolation is the actual requirement |
| Untrusted code, or unattended runs with permissions skipped | Virtual machine or hosted cloud session | Only kernel-level separation covers arbitrary child processes |
| Not a git repository | Harness hook that checks out your VCS, or a clone per agent | Worktrees are a git feature |
| Jujutsu repository | `jj workspace add` | Workspaces are tied to a revision, not a branch, so several can sit on the same work |
| One agent, interactive, small task | No isolation | Folder mode exists for a reason: the agent sees your uncommitted work, which is often what you want |

## When to skip worktrees

Worktrees are the right default, not a universal answer. Skip them when:

- **You want the agent to see your uncommitted changes.** A worktree starts from committed state. VS Code calls this out as the reason folder isolation exists, and Claude Code lets background sessions opt out with `worktree.bgIsolation: "none"` for repositories where worktrees are impractical.
- **The task is a conversation, not a change.** Reading code, explaining a system, planning. Isolation buys nothing and costs a setup script.
- **Setup cannot be automated.** If making a worktree usable needs manual steps nobody has written down, worktrees will be abandoned within a week. Write the setup script first, then adopt worktrees.
- **The agent already has its own machine.** Cloud harnesses get file isolation from the machine boundary, so a branch is enough.

## Size concurrency by review capacity

The binding constraint is not disk, CPU, or the tool's cap. It is how many diffs a person will read.

Reference points, all source-reported:

- Practitioners writing publicly settle on roughly **two to five** concurrent local agents before supervision becomes the problem.
- Local machine limits show up around **three to five** for typical web projects, when builds and test suites compete for RAM and CPU.
- Tool caps are much higher and are about disk hygiene, not attention: Cursor keeps 25 worktrees per machine by default, the Codex app about 15, Claude Code's `/batch` fans out to 5 to 30 subagents.
- Git lock contention gets worse with agent count: one report described failures as intermittent at 5 agents and near-certain at 10 or more.

A workable rule:

```text
concurrent agents = diffs you will review today / average diffs per agent per day
```

If that gives you three, run three. The remaining capacity is better spent on making each agent's output more reviewable than on starting a fourth.

Two exceptions where higher counts are genuinely fine:

- **Best-of-N.** Three models on one task in three worktrees produces one diff to review, because you throw two away. No merge problem at all.
- **Mechanical fan-out.** A 30-file rename split across 30 worktrees produces 30 diffs that each take seconds to check, and each one is verifiable by its tests. This is what `/batch` is for.

## Adoption checklist

Ten items, each verifiable by running a command. Work through them once per repository.

1. **Ignore the worktree directory.** Add your harness's worktree path (for example `.claude/worktrees/`) to `.gitignore`. Verify: `git status --porcelain` is clean after a worktree session.
2. **Turn on per-worktree config.** `git config extensions.worktreeConfig true`, and confirm your team's git version accepts it. Verify: `git config --worktree --list` works inside a worktree.
3. **Move worktree-specific settings out of shared config.** `core.worktree`, `core.bare` when true, and `core.sparseCheckout` unless every worktree uses it. Verify: `git config --list --show-origin` and check where each lands.
4. **Protect your hooks.** Verify: after a worktree session, `git config core.hooksPath` from the main checkout returns what you committed, not an absolute path into `.git/hooks`.
5. **Write the copy list.** Create `.worktreeinclude` or set `git.worktreeIncludeFiles` with every gitignored file the project needs. Verify: create a worktree and confirm the files are present.
6. **Write the setup script.** Install dependencies, run migrations, generate code, allocate a port. Make it exit non-zero on any missing prerequisite. Verify: run it in a fresh worktree and start the app.
7. **Decide the base commit.** Fresh from the remote default branch for independent work; local `HEAD` when agents must build on unpushed commits. Verify: `git log --oneline -1` in a new worktree is what you expected.
8. **Allocate runtime resources per worktree.** Ports, Compose project name, database name. Verify: start the app in two worktrees at once.
9. **Gate cleanup on cleanliness.** Whatever removes worktrees must check `git status --porcelain` first. Verify: leave an uncommitted change in a worktree, trigger cleanup, and confirm the change survives.
10. **Add retry to worktree creation.** Backoff on `File exists` lock errors. Verify: create four worktrees in parallel and confirm all four succeed.

## The working sequence

Seven steps, in this order. Skipping any of the first three costs you at step six.

1. **Partition.** Decide which files each agent owns, and write the boundaries into each task. This is the step that prevents the conflicts nothing else can fix.
2. **Freeze shared interfaces.** Types, schemas, API signatures. Commit them, and have every agent branch from that commit.
3. **Isolate.** One worktree per agent, from the chosen base.
4. **Seed.** Copy list plus setup script. Confirm the app runs before the agent starts.
5. **Run.** Cap concurrency at your review capacity. Lock each worktree while its agent works.
6. **Verify on the merge candidate, not the branch.** Merge into an integration branch and run the suite there. A branch that passes alone tells you nothing about the pair.
7. **Land in a fixed order and rebase the rest.** Then clean up: `git worktree list`, remove what is clean, keep what is not.

## What to watch for next

Three things are changing fast enough that this report will need revisiting.

- **Per-worktree config becoming the default.** The `core.hooksPath` failure exists because harnesses write shared config. The fix is one git setting, and once harnesses set it themselves the whole class of bug goes away.
- **Runtime isolation moving into the harness.** Third-party tools already generate per-worktree Compose overrides and allocate ports. There is no reason that stays outside the first-party tools.
- **The integration layer.** Every tool now creates worktrees and no tool helps you merge twenty of them. Measured conflict rates of 20% to 42% for pairs of agent pull requests say this is where the next round of tooling has to go.

See the glossary for terms, and methodology and sources for how this was researched and what it does not cover.

---

<!-- 11archive-source: 06-glossary.md -->

# Glossary

Terms used in this report, in plain words. Git terms come from the [git-worktree manual](https://git-scm.com/docs/git-worktree); product terms come from the documentation cited in sources.

## Agent and harness terms

**Agent harness.** The code around the model that runs the agent loop. VS Code's definition: the runtime that manages the session, calls tools, and applies changes to your code. The common shorthand is `agent = model + harness`.

**Inner harness.** The part shipped by the model's vendor: the loop, the built-in tools, the system prompt.

**Outer harness.** The part you add on top: instruction files, hooks, setup scripts, MCP servers. Most worktree seeding lives here.

**Surface.** Where you sit while the agent works: a terminal, an editor panel, a desktop app, a web page. One surface can host several harnesses. VS Code hosts four.

**Subagent.** A worker the main agent spawns inside one session. It has its own context window and returns a summary rather than its whole transcript.

**Background session.** A full agent session that runs without you watching it, reporting back when done.

**Best-of-N.** Running the same task several times, often under different models, then keeping one result and discarding the rest. Cursor's `/best-of-n` and Superset both do this.

**Fan-out.** Splitting one change into many independent units and giving each to its own agent.

**Semantic conflict.** Two changes that merge cleanly and are individually correct, but are incoherent together. One agent names a concept `Plan`, another names it `Subscription`. Git cannot detect it.

**Merge debt.** Work that is finished but not integrated, waiting in branches or pull requests. Grows with agent count.

## Git terms

**Worktree.** A folder holding a checked-out copy of a repository's files. Every repository has one main worktree; `git worktree add` creates additional **linked worktrees** that share the same repository.

**Main checkout.** The original working folder, the one whose `.git` is a real directory.

**Linked worktree.** An additional working folder. Its `.git` is a **file** containing two lines, `gitdir:` and `commondir:`, that point back at the repository.

**Object database.** Where git stores every commit, tree, and file version. Shared by all worktrees, which is why a second worktree costs only the checked-out files.

**`$GIT_DIR`.** Inside a linked worktree, the worktree's own private admin folder at `.git/worktrees/<id>/`. Holds that worktree's `HEAD`, `index`, and lock state.

**`$GIT_COMMON_DIR`.** The shared `.git` directory of the main checkout. Holds objects, refs, config, and hooks.

**`HEAD`.** Which commit this worktree is currently on. Private to each worktree.

**Index.** The staging area, the list of what would go into the next commit. Private to each worktree.

**Ref.** A name pointing at a commit: a branch (`refs/heads/main`), a tag, a remote-tracking branch, or the stash (`refs/stash`). All shared, except `refs/bisect/*`, `refs/worktree/*`, and `refs/rewritten/*`.

**Detached HEAD.** A worktree sitting on a specific commit with no branch attached. Used to sidestep git's rule that one branch cannot be checked out twice.

**One-branch rule.** Git refuses to check out the same branch in two worktrees at once, because both would try to advance it.

**Lock (worktree).** A marker file, written by `git worktree lock`, that stops git pruning, moving, or removing a worktree. Harnesses use it to protect a running agent's folder.

**Prune.** Removing stale bookkeeping for worktrees whose folders are gone. Never deletes a live folder.

**Repair.** Fixing the two pointers between a repository and a worktree after someone moved a folder by hand.

**`extensions.worktreeConfig`.** A repository setting that gives each worktree its own config file, so `git config --worktree <key> <value>` no longer changes the whole clone. Older git versions refuse to open a repository with it set.

**Sparse checkout.** Checking out only part of a repository, so a worktree contains a subset of the files.

**`.git/config.lock` and `.git/index.lock`.** Temporary files git creates while writing shared config or a worktree's index. Concurrent writes collide on them, which is the source of most parallel-agent failures.

**Superproject.** A repository containing submodules. The git manual does not recommend multiple checkouts of one.

**Jujutsu workspace.** Jujutsu's equivalent of a worktree, created with `jj workspace add`. Tied to a revision rather than a branch, so several workspaces can sit on the same work.

## Setup and isolation terms

**Gitignored file.** A file git deliberately does not track, listed in `.gitignore`. Examples: `.env`, `node_modules`, `dist`. A new worktree does not contain any of them.

**Seeding.** Putting the missing gitignored files and installed dependencies into a fresh worktree so the project can actually run there.

**`.worktreeinclude`.** Claude Code's copy list. Uses gitignore syntax, and copies a match only when the file is also gitignored, so tracked files are never duplicated.

**`git.worktreeIncludeFiles`.** VS Code's equivalent setting.

**`.cursor/worktrees.json`.** Cursor's setup script config, with `setup-worktree`, `setup-worktree-unix`, and `setup-worktree-windows` keys and a `$ROOT_WORKTREE_PATH` variable pointing at the main checkout.

**`WorktreeCreate` and `WorktreeRemove` hooks.** Claude Code hooks that replace worktree creation and removal entirely, used for non-git version control. Any non-zero exit code from `WorktreeCreate` fails creation.

**`create_worktree` hook.** Zed's hook, run after it creates a linked worktree, with `ZED_WORKTREE_ROOT` and `ZED_MAIN_GIT_WORKTREE` set.

**Copy-on-write clone, reflink.** A file copy that shares disk blocks with the original until one side changes. `cp -Rc` on APFS; `cp --reflink=auto` on btrfs and XFS with `reflink=1`. Fast per byte, still one operation per file.

**Pre-warmed pool.** A fixed set of worktrees kept ready and recycled, so activating one is a branch checkout rather than a full dependency install.

**Handoff.** Moving a session between the main checkout and a worktree. The Codex app's term; gitignored files do not travel with it.

**Folder isolation.** The agent works directly in your current folder and sees uncommitted changes. VS Code's name for the non-worktree mode.

**Worktree isolation.** The agent works in its own worktree, starting from committed state.

**Sandbox.** An operating-system boundary limiting what a process can read, write, and reach. Seatbelt on macOS; bubblewrap with Landlock and seccomp on Linux. Different from a worktree, which limits nothing at the OS level.

**Ephemeral environment.** A container or virtual machine created for one task and destroyed afterwards. How cloud harnesses get isolation without worktrees.

---

<!-- 11archive-source: 07-methodology-and-sources.md -->

# Methodology, coverage, limitations, and sources

## Objective and audience

This research answers one question: **how do today's AI agent tools handle git worktrees, and what does that solve?**

It is written for two readers:

- Engineers running more than one coding agent on one repository, who need to know what to configure and what will break.
- People building a harness or a surface, who need to know what the field has already converged on.

## Reporting period and freshness

- Research date: 2026-08-11.
- Working session timezone: Europe/Lisbon.
- All documentation was retrieved on 2026-08-11.
- Product documentation for agent tools changes weekly. Every version number, default value, and cap in this report is a point-in-time reading. Treat the mechanics as durable and the numbers as perishable.

## Evidence method

Sources were selected in this order:

1. **Official product documentation** for each harness, and the git manual for the underlying primitive.
2. **Public issue trackers and pull requests** for failure modes, because bug reports describe behaviour that documentation does not.
3. **Peer-reviewable preprints** for anything quantitative about conflict rates.
4. **Repository status pages**, read directly, for whether a project is alive.
5. **Practitioner writing and public discussion** for field experience, marked as secondary throughout.

Claims were paraphrased. No long passages were copied from any source.

### Evidence states used

| State | Meaning | Where it appears |
|---|---|---|
| `documented` | Stated in a product manual or the git manual | Most of worktree mechanics and harness survey |
| `source-reported` | A source stated it; this report did not measure it | All failure-rate numbers, all practitioner experience |
| `inferred` | Follows from documented mechanics but is not stated | Marked inline, for example that `refs/stash` is shared because it sits under `refs/` |
| `unavailable` | Expected but not published | Empty cells in the comparison matrix, for example Antigravity's worktree paths |
| `not verified` | Reported by a secondary source and not checked against a primary one | Marked inline, for example the VS Code version range and the Gemini CLI release version |

Empty matrix cells read "not documented" rather than "no". Absence of documentation is not absence of a feature.

### What was measured versus read

**Nothing in this report was benchmarked.** No agents were run, no worktrees were timed, no conflict rates were reproduced. Every number is source-reported. The two categories most worth treating with caution:

- **Lock contention numbers** (3 agents with 2 failures; 13 agents with 8 failures) come from individual bug reports. They are single observations by single reporters on unknown hardware with unknown git versions, not measurements. They establish that the failure mode is real and gets worse with count. They do not establish a rate.
- **Concurrency ceilings** (two to five local agents) come from practitioner blog posts surfaced in search, several of which are search-optimised content rather than first-hand engineering write-ups. They are included because the range is consistent across independent sources, and excluded from any calculation.

The two conflict-rate studies are the strongest quantitative evidence here, and they measure textual merge conflicts in agent pull requests, which is adjacent to but not the same as "parallel agents on one machine".

## Coverage

Ten harnesses and surfaces were examined against primary documentation:

Claude Code (CLI, desktop, agent view, subagents, Agent SDK paths), Cursor, OpenAI Codex (app and CLI sandbox model), VS Code agent sessions (covering the Copilot, Claude, and Codex harnesses it hosts), Google Antigravity, Gemini CLI, Zed, Warp, JetBrains IntelliJ IDEA, and the git primitive itself.

Five cloud harnesses were examined for contrast: Claude Code on the web, GitHub Copilot coding agent, Codex cloud, Cursor cloud agents, Devin.

Nine third-party tools were catalogued: Superset, container-use, Sculptor, Conductor, treehouse-worktree, Docktree, worktree-compose, git-cow-worktree, opencode-worktree. Two deprecated ones were verified directly: Crystal and Vibe Kanban.

## Exclusions

Stated so the gaps are visible:

- **No private betas or waitlisted features.** Only publicly documented behaviour.
- **No paid tool trials.** Third-party orchestrator capabilities come from their own public descriptions and were not tested.
- **No source-code reading.** Claude Code, Cursor, and the Codex app are closed source; the Gemini CLI entry is the one exception, drawn from its implementing pull request.
- **No benchmarking.** See above.
- **Aider, Cline, Goose, Amp, and OpenCode** were not given individual sections. Search results indicated they rely on external worktree management (a wrapper, a plugin, or the terminal surface) rather than shipping it, but that could not be confirmed against primary documentation within scope. Treat their absence as unmeasured, not as a finding.
- **Windows-specific behaviour** is covered only where documentation raised it, mostly Claude Code's notes on links and NTFS junctions.
- **No security assessment.** The report repeats each vendor's own claim about what their isolation does and does not stop, and does not test any of it.

## Limitations

1. **Version drift.** Claude Code's documentation names behaviour changes at v2.1.198 through v2.1.213. Anything read today may already be a version behind.
2. **One mirrored source.** The Codex app worktrees page was reached through a third-party mirror of `developers.openai.com` because the canonical path redirected and a direct fetch of the GitHub-archived copy returned 404. Its content is consistent with the OpenAI sandboxing page read directly, but it is a mirror, and a mirror can be stale. Treat the Codex worktree specifics (the `$CODEX_HOME/worktrees` path, the roughly 15 managed worktrees, the snapshot-before-delete behaviour) as the least certain product facts in this report.
3. **Asymmetric documentation depth.** Claude Code publishes far more about worktrees than anyone else, so it dominates the detail in the survey and the failure-mode section. That reflects what is published, not that it handles worktrees worse or better. The failure modes drawn from its issue tracker exist in other tools too, and are simply not visible.
4. **Failure modes are drawn from one issue tracker.** Four of the sixteen come from `anthropics/claude-code` because it is public, active, and searchable. Cursor, Codex, and Antigravity do not expose comparable public trackers for these products, so equivalent bugs in them are invisible here rather than absent.
5. **The semantic-conflict finding is qualitative.** The strongest field observation in the report, that architectural incoherence matters more than file conflicts, comes from a public discussion thread. It is consistent with the measured textual conflict rates and with the design of `/batch`, but it is not measured.
6. **No machine-readable dataset was produced.** The comparison matrix is the dataset, and it is small enough to read and short-lived enough that a versioned JSON file would add maintenance without adding validation. Noted here as a deliberate choice rather than an omission.

## Sources

### Git primitive

| Source | Supports |
|---|---|
| [git-worktree manual](https://git-scm.com/docs/git-worktree) | All of worktree mechanics: shared versus private state, subcommands and flags, admin file layout, `extensions.worktreeConfig`, locking, pruning, repair, sparse checkout, submodule limits, the one-branch rule |

### Claude Code

| Source | Supports |
|---|---|
| [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) | `--worktree` and `-w`, default paths and branch names, pull-request worktrees, `.worktreeinclude`, `worktree.baseRef`, name reuse rules, the three enforcement checks, subagent isolation, cleanup and sweep rules, `WorktreeCreate` for non-git VCS, resume and refusal behaviour, symlink and Windows notes, what worktrees share with the main checkout |
| [Hooks](https://code.claude.com/docs/en/hooks) | `WorktreeCreate` and `WorktreeRemove` input schemas, exit-code semantics, the Subversion example |
| [Create custom subagents](https://code.claude.com/docs/en/sub-agents) | `isolation: worktree` frontmatter, base-branch behaviour, working-directory and git-redirect checks for subagents, version history |
| [Manage agents with agent view](https://code.claude.com/docs/en/agent-view) | Background-session isolation, `worktree.bgIsolation`, commit and pull-request behaviour, cleanup |
| [Run agents in parallel](https://code.claude.com/docs/en/agents) | Comparison of subagents, agent view, agent teams, and workflows; the `/batch` description |
| [Tools reference](https://code.claude.com/docs/en/tools-reference) | `EnterWorktree` and `ExitWorktree` behaviour and approval rules |
| [Desktop application](https://code.claude.com/docs/en/desktop) | Worktree per session, configurable location and branch prefix, archive and auto-archive |
| [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) | Writes allowed to the shared `.git` from a worktree, with `hooks/` and `config` still denied; blocked-git-operation recovery through a worktree |
| [Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments) | The isolation-layer comparison, and Claude Code on the web's VM and proxy model |
| [Issue 66993](https://github.com/anthropics/claude-code/issues/66993) | Failure mode 1: `core.hooksPath` written to shared config |
| [Issue 55724](https://github.com/anthropics/claude-code/issues/55724) | Failure mode 2 and 3: `index.lock` contention, the 13-agent report, cleanup destroying work |
| [Issue 47266](https://github.com/anthropics/claude-code/issues/47266) | Failure mode 2: `config.lock` race on concurrent `git worktree add` |
| [Issue 62372](https://github.com/anthropics/claude-code/issues/62372) | Failure mode 16: a guard naming a tool the agent could not load |

### Other harnesses

| Source | Supports |
|---|---|
| [Worktrees, Cursor docs](https://cursor.com/docs/configuration/worktrees) | `/worktree`, `/best-of-n`, `/apply-worktree`, `/delete-worktree`, `.cursor/worktrees.json` schema, `$ROOT_WORKTREE_PATH`, `cursor.worktreeMaxCount` and cleanup interval, the symlink warning |
| [Codex app worktrees](https://doc.jarvisuni.com/openai/codex/app/worktrees.html) (mirror) | Local, Worktree, and Cloud thread modes; detached HEAD default; `$CODEX_HOME/worktrees`; managed worktree count; snapshots; Handoff; gitignored files not transferring; automations on dedicated worktrees |
| [Codex sandboxing](https://learn.chatgpt.com/docs/sandboxing) | Seatbelt, bubblewrap, Windows sandbox; `sandbox_mode`, `approval_policy`, `writable_roots`; the recommendation to use separate projects or worktrees rather than widening access |
| [Copilot CLI sessions in VS Code](https://code.visualstudio.com/docs/copilot/agents/background-agents) | Folder versus New Worktree isolation, `git.worktreeIncludeFiles`, forced Bypass Approvals, the "not a security boundary" statement, the one-commit requirement |
| [Agent harnesses, VS Code](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses) | The harness definition, the four supported harnesses, folder versus worktree isolation |
| [Workspace vs Worktree Isolation in Copilot CLI](https://www.kenmuse.com/blog/workspace-vs-worktree-isolation-in-copilot-cli/) | Field detail: isolation is a VS Code feature not a CLI one, auto-commit per turn, dev-container failures, manual cleanup. Secondary |
| [Antigravity projects](https://antigravity.google/docs/projects) | Project model, Local versus New Worktree Mode, a worktree per active git checkout, Agent Manager guidance |
| [Gemini CLI pull request 22973](https://github.com/google-gemini/gemini-cli/pull/22973) | `WorktreeService`, `--worktree` and `-w`, the `experimental.worktrees` gate, cleanup that preserves work |
| [Parallel Agents, Zed docs](https://zed.dev/docs/ai/parallel-agents) | Worktree picker, detached HEAD on create, `create_worktree` hook, `ZED_WORKTREE_ROOT` and `ZED_MAIN_GIT_WORKTREE`, threads sidebar, lifecycle tied to thread history |
| [Git worktrees, Warp docs](https://docs.warp.dev/code/git-worktrees/) | Detection via the `.git` file, per-worktree status chip and review panel, independent indexing for codebase context, no creation or cleanup tooling |
| [What's new in IntelliJ IDEA 2026.1](https://www.jetbrains.com/idea/whatsnew/2026-1/) | First-class worktree support and its stated motivation in parallel agent work |

### Quantitative studies

| Source | Supports |
|---|---|
| [AI Agent Pull Requests on GitHub, arXiv 2607.04697](https://arxiv.org/abs/2607.04697) | 33,596 pull requests across 2,807 repositories; 40.2% of repositories with concurrent agent pull requests; 79.4% of agent pull requests overlapping, rising to 53.4% and 95.0% over a one-week window; 747 pairs merged giving 41.7% cross-agent and 19.8% same-agent conflict rates; 84.4% of conflicts in source files; nearly 42% structural |
| [AgenticFlict, arXiv 2604.03551](https://arxiv.org/abs/2604.03551) | 142,000 agent pull requests across 59,000 repositories; 107,000 merge simulations; 29,000 conflicting pull requests; 336,000 conflict regions; 27.67% overall conflict rate |

### Practitioner writing and discussion

All secondary. Included for field experience that documentation does not cover.

| Source | Supports |
|---|---|
| [Parallel agents in Zed, Hacker News](https://news.ycombinator.com/item?id=47866750) | Semantic collision as the hardest problem; a team abandoning per-branch database schemas; review consuming the gains; language-server multiplication |
| [Use git worktrees, they said](https://daveschumaker.net/use-git-worktrees-they-said-itll-be-fun-they-said/) | 750,000-file dependency tree; symlink, hardlink, and copy-on-write all failing; the pre-warmed pool with lockfile-gated installs |
| [Copy-on-write git worktrees](https://commaok.xyz/post/git-cow-worktrees/) | The `--no-checkout` plus reflink plus checkout seeding technique |
| [Using Git Worktrees with Many Untracked Files](https://spin.atomicobject.com/git-worktrees-untracked-files/) | `cp -Rc` on APFS for gitignored directories, and bundling setup into a script |
| [Agent harness, Wikipedia](https://en.wikipedia.org/wiki/Agent_harness) | Terminology: `agent = model + harness`, inner versus outer harness |

### Tools and repository status

Repository status for the two deprecated projects was read directly from their pages on 2026-08-11. Every other description comes from the project's own public summary and was not independently tested.

| Source | Supports |
|---|---|
| [Crystal](https://github.com/stravu/crystal) | Verified deprecated; README states it has been replaced by Nimbalyst |
| [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) | Verified sunsetting; banner in README, code remains under Apache-2.0 |
| [container-use](https://github.com/dagger/container-use) | Worktree plus Dagger container per agent, `container-use/<env>` branches, automatic commits |
| [Superset](https://github.com/superset-sh/superset) | Many agents, each with worktree, branch, terminal, and environment; compare and merge the winner |
| [treehouse-worktree](https://github.com/mark-hingston/treehouse-worktree) | Worktree manager with CLI and MCP interfaces, including worktree locking for agent coordination |
| [Docktree](https://docktree.dev/) and [worktree-compose](https://github.com/mostafasudo/worktree-compose) | Per-worktree Compose project names, container names, volumes, and auto-allocated ports |
| [git-cow-worktree](https://github.com/josharian/git-cow-worktree) | Packaged reflink seeding |
| [opencode-worktree](https://github.com/kdcokenny/opencode-worktree) | Worktree tools for OpenCode with terminal spawning and cleanup on exit |

## Verification performed

- Every claim in the harness survey traces to a named source in the tables above.
- All eight report files were checked for internal link targets; each cross-reference resolves to an existing file and heading.
- Numbers from the two preprints were transcribed from their abstracts and cross-checked between the two papers for consistency of definition (both measure textual merge conflicts in agent-authored pull requests, so their different rates reflect different populations and pairing methods, not a contradiction).
- No total or percentage in this report was computed by aggregating source figures. The two studies' rates are reported separately and not combined, because their populations overlap in unknown ways and their denominators differ.
- The two deprecated-project claims were verified against the repositories themselves rather than the aggregator blogs that surfaced them, because naming a live project as dead is a factual error worth spending a fetch to avoid.
- Report files were searched for secrets, credentials, and machine-specific absolute paths before handoff. None are present; the only absolute paths shown are illustrative (`/work/app`).

## Attribution

Research and authoring: Claude Opus 5 via Claude Code, session dated 2026-08-11, working in `11archive`. No source content was reproduced at length; all findings are paraphrased with links to the original.
