<!-- 11archive-source: README.md -->

# Code analytics: what you can measure locally and from GitHub

Research report. Catalogues every measurement you can take from a Git checkout on
your own machine and from the GitHub API, with the cost, the permission, and the
trap attached to each one.

Written 2026-08-11. Every number in these files was produced by running the
command shown, on the date shown, against the repository named. Nothing is
recalled from memory.

## Read in this order

| File | What it covers |
| --- | --- |
| 00-executive-brief.md | The short version. What to collect first, what it costs, what to ignore. |
| 01-local-git-history.md | The commit history as a dataset. Log formats, churn, identities, renames. |
| 02-local-code-structure.md | The working tree as a dataset. Size, complexity, duplication, dependencies. |
| 03-evolutionary-analysis.md | History crossed with structure. Hotspots, coupling, ownership, code age. |
| 04-github-api-surface.md | Every GitHub endpoint that returns analytics, tested, with its cost. |
| 05-github-security-supply-chain.md | Code scanning, secret scanning, dependency data, provenance. |
| 06-delivery-and-collaboration.md | Pull request timing, review load, build telemetry, DORA. |
| 07-tooling-catalog.md | The external tools worth installing, and what each one adds. |
| 08-collection-blueprint.md | A working design for a collector you can run on a schedule. |
| 09-limits-and-pitfalls.md | Where these numbers lie, and the rules for using them on people. |
| 10-glossary.md | Every term defined once. |
| 11-methodology-and-sources.md | How this was produced, what was checked, what was not. |

Machine-readable companion: [data.json](data.json). Rendered single file:
[report.html](report.html).

## Scope

- In scope: measurements available to one engineer with a local checkout, the
  `git` and `gh` command line tools, and a personal access token.
- Out of scope: paid analytics platforms, GitHub Enterprise Server differences,
  and anything requiring an enterprise account we could not test.
- Test subjects: four repositories owned by the token holder plus one large
  public repository (`cli/cli`) used to trigger the size limits that small
  repositories never reach.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The result that changes what you do next

Almost everything worth knowing about a codebase is already on your disk. The
Git history is a complete, free, offline event log: every change, who made it,
when, and which lines moved. GitHub adds three things the history cannot hold,
and only three that matter:

1. **Review and merge timing.** Who reviewed what, how long it waited.
2. **Build and job telemetry.** What ran, how long, what failed.
3. **Security findings and dependency data.** Alerts, scans, the package list.

Everything else GitHub shows you (contributor charts, commit activity, punch
cards, language bars) is a slower, capped, cached rendering of data you can
compute locally in under a second and with more control.

**Build local first. Call GitHub only for the three things above.**

## What it costs

| Source | Setup | Runtime on a 287-commit repo | Rate limit |
| --- | --- | --- | --- |
| Git history, plain commands | none | under 1 s per query | none |
| Git blame across a tree | none | ~2 s for 110 files | none |
| GitHub REST, repository facts | token | 1 request | 5,000 requests/hour |
| GitHub REST, statistics | token | 1 request plus a retry | 5,000 requests/hour |
| GitHub GraphQL, 100 pull requests with reviews | token | 1 request, 3 points | 5,000 points/hour |
| GitHub REST, same 100 pull requests | token | 201 requests | 5,000 requests/hour |

The last two rows are the single biggest cost decision in this report. Pulling
100 merged pull requests with their reviews and commit counts costs **3 points
in GraphQL and 201 requests in REST**, both measured today. Use GraphQL for
anything that walks a list and needs its children.

## The seven measurements worth having

Ranked by value per unit of effort.

1. **Hotspots.** Files that change often and are structurally complicated. This
   is the shortlist of what to refactor. Cost: one `git log` and one pass over
   the files.
2. **Pull request cycle time, at the 50th and 90th percentile.** How long a
   change waits. Cost: one GraphQL call per 100 pull requests.
3. **Ownership concentration.** How much of a file one person wrote. Tells you
   what breaks when someone leaves. Cost: `git blame` per file.
4. **Temporal coupling.** Files that keep changing together despite living apart.
   Points at hidden dependencies. Cost: one `git log --name-only` pass.
5. **Code age.** When each surviving line was last touched. Old and stable is
   good. Old and hot is a warning. Cost: `git blame` per file.
6. **Security alert counts by state and age.** Cost: one REST call per category.
7. **Build failure rate and job duration.** Cost: one REST call per workflow run,
   or one list call plus filters.

## What to skip

- **Lines of code as a productivity measure.** In the test repository one author
  shows 125,138 added lines. Most of that is a package lock file and generated
  content. The number measures typing, not work.
- **`stats/code_frequency` on anything large.** GitHub returns HTTP 422 with
  "repository must have fewer than 10000 commits". Confirmed today against
  `cli/cli`.
- **Per-person dashboards.** See 09-limits-and-pitfalls.md.
  These numbers are diagnostic for code, not for people, and in several
  jurisdictions using them for people is a legal matter, not a taste question.

## The three traps that will bite you first

**Identity splitting.** The test repository has four Git identities. Two of them
share one email address and differ only by display name, so every by-author
count was wrong by 26 commits until a `.mailmap` merged them. Fix: write a
`.mailmap` before you count anything.

**Dead hotspots.** Of the 50 highest-churn files in the test repository, **40 no
longer exist** at the current commit. Ranking churn without checking which files
still exist produces a refactoring list of deleted code. Fix: filter against
`git ls-files`.

**Reviews submitted after merge.** GitHub lets someone review a merged pull
request years later. In a real 100-pull-request sample the unfiltered median
time to first review was 2.75 hours and the maximum was 56,035 hours, six and a
half years, because one 2020 pull request got a comment in 2026. Filtering
reviews to those submitted at or before the merge moved the median to 2.07
hours and the maximum to 262 hours. Fix: bound every review timestamp by the
merge timestamp.

## Where to start on Monday

1. Add a `.mailmap`.
2. Run the hotspot query in 03-evolutionary-analysis.md.
   Look at the top ten files. That is your refactoring backlog.
3. Run the pull request percentile script in
   06-delivery-and-collaboration.md once a
   week. Track the 90th percentile, not the average.
4. Turn on the dependency graph and code scanning if they are off. Today three
   of the four test repositories returned "Dependabot alerts are disabled" and
   "no analysis found", which means the data does not exist to be collected.

---

<!-- 11archive-source: 01-local-git-history.md -->

# The commit history as a dataset

Git stores a complete event log. Every measurement in this chapter reads that
log and needs no network and no permission.

Test subject unless stated otherwise: a repository with 287 commits, 1,390
tracked files, four raw author identities, first commit 2026-03-31. Measured
2026-08-11. Author names and email addresses are redacted in this report; the
label "author A" means the same person throughout.

## The one command that produces most of it

`git log` can print any field you want in any format. The two flags that matter:

- `--pretty=` picks the commit fields.
- `--numstat` adds one line per changed file: lines added, lines deleted, path.

```bash
git log --no-merges -M -C --pretty=tformat:'@%H%x09%aN%x09%aI%x09%s' --numstat
```

Read that as: skip merge commits, detect renames and copies, print a marker line
per commit with hash, author name, ISO date and subject, then the per-file
numbers. Everything below is a different way of grouping those two record types.

### Field reference for `--pretty`

| Token | Meaning | Note |
| --- | --- | --- |
| `%H` | full commit hash | stable identity |
| `%aN` | author name | respects `.mailmap` |
| `%aE` | author email | respects `.mailmap` |
| `%aI` | author date, ISO 8601 strict | when the change was written |
| `%cI` | committer date, ISO 8601 strict | when it landed here |
| `%s` | subject line | first line of the message |
| `%b` | body | everything after the blank line |
| `%P` | parent hashes | two or more means a merge |
| `%G?` | signature status | `G` good, `N` none, `B` bad |
| `%D` | ref names | tags and branches pointing here |

Use the capital-`N` and capital-`E` forms. The lowercase `%an` and `%ae` skip the
`.mailmap` and will split one person into several.

**Author date is not commit date.** A rebase, a cherry-pick, or a patch applied
by email keeps the author date and rewrites the committer date. Pick one and say
which. For "when was this written" use `%aI`. For "when did this reach the
branch" use `%cI`.

## Repository scale in one call

```bash
git rev-list --count HEAD          # 287
git count-objects -vH              # size-pack: 3.04 MiB, in-pack: 10452
git ls-files | wc -l               # 1390
```

`count-objects -vH` reports the packed size on disk. It is the honest answer to
"how big is this repository", and it is unrelated to how many lines of code
exist, because it includes every version of every file ever committed.

## Churn: how much code moved

Churn is added lines plus deleted lines. It measures activity, not quality.

```bash
git log --pretty=tformat: --numstat |
  awk '{a+=$1; d+=$2; n++} END {print "added="a" deleted="d" touches="n}'
```

Result on the test repository: **136,813 added, 41,041 deleted, 6,286 file
touches**. Runtime 0.61 s including rename detection.

Three things to know before you use that number.

**Binary files print `-` instead of a count.** Guard with `$1 != "-"` or your
totals silently skip images, fonts and compiled assets. This is correct
behaviour, not an error: Git has no line concept for those files.

**Generated files dominate.** The two largest churn entries in the test
repository are `package-lock.json` (12,340 lines over 2 commits) and
`www/package-lock.json` (10,929 over 3). Neither was written by a human. Exclude
lock files, minified bundles, vendored directories and snapshots before
comparing anything.

**A `.gitattributes` marking files as generated does not change `--numstat`.**
`linguist-generated` affects GitHub's diff display and language bar only. Your
own exclusion list is the only thing that filters churn.

## Identities: fix this before you count anything

```bash
git log --format='%aN <%aE>' | sort -u
```

The test repository returns four identities:

| Identity | Commits | Kind |
| --- | --- | --- |
| author A, display name 1 | 187 | human |
| author A, display name 2 | 26 | human, same email address |
| release bot | 59 | automation |
| author A, GitHub noreply address | 1 | human, web edit |

Two rows are the same person with the same email and a different display name.
Counting by name gives 187. Counting by email gives 213. Counting by the pair
gives two people who are one.

Fix with a `.mailmap` file at the repository root:

```
Canonical Name <canonical@example.com> Other Name <canonical@example.com>
Canonical Name <canonical@example.com> <old-address@example.com>
```

Verify without committing anything:

```bash
git -c mailmap.file=/tmp/mm shortlog -sn --no-merges HEAD
```

Applied to the test repository this merged 187 + 26 into a single **213** and
left the bot and the web-edit identity separate, which is what you want: the bot
should stay visible so you can exclude it deliberately.

### The `shortlog` trap

`git shortlog` reads from standard input when no revision is given. In a script,
where standard input is not a terminal, it reads nothing and prints nothing,
with exit status 0. Observed today: `git shortlog -sne --no-merges` produced zero
lines; `git shortlog -sne --no-merges HEAD` produced four. **Always pass an
explicit revision.**

## Merges

```bash
git rev-list --count HEAD            # 287
git rev-list --count --merges HEAD   # 14  (4.87%)
```

Merge commits contain no original work in a standard squash or merge workflow,
but `--numstat` on a merge prints the combined diff against the first parent,
which double-counts. Every query in this report uses `--no-merges`. If you need
merges (to count integration events, for example) count them separately and do
not add them to churn.

This also explains a GitHub discrepancy documented in
04-github-api-surface.md: a repository with 25
commits and 2 merges reports 23 in `stats/contributors`, because that endpoint
excludes merges.

## Renames and copies

Git does not record renames. It infers them by comparing content at query time.

| Flag | Meaning |
| --- | --- |
| `-M` | detect renames (default similarity 50%) |
| `-M90%` | require 90% similarity |
| `-C` | also detect copies from files changed in the same commit |
| `-C -C` | detect copies from anywhere in the tree, slower |
| `--find-copies-harder` | same as `-C -C`, older spelling |

Measured effect on the test repository:

| Query | File-touch rows |
| --- | --- |
| no rename detection | 5,074 |
| `-M -C -C` | 4,988 |
| rename events detected (`--diff-filter=R`) | 1,212 |

Without detection, a rename appears as one file deleted and one added. That
inflates churn and breaks per-file history.

### `--follow` recovers history across renames

```bash
git log --oneline -- path/to/file            # 1 commit
git log --oneline --follow -- path/to/file   # 7 commits
```

Measured on a real renamed file in the test repository. `--follow` only accepts
one path and it works by re-running rename detection at each step, so it is slow
on long histories. It is the right tool for "show me this file's real history"
and the wrong tool for a repository-wide sweep.

## Commit messages as structured data

If the project uses Conventional Commits (a convention where the subject starts
with a type such as `feat:` or `fix:`) the subject line becomes a labelled event
stream.

```bash
git log --no-merges --pretty=%s |
  awk '{ if (match($0, /^[a-z]+(\([^)]*\))?!?: /)) ok++; else bad++ }
       END { print "conforming="ok" nonconforming="bad }'
```

Test repository result: **265 conforming, 8 nonconforming**, which sums to 273,
the exact number of non-merge commits. The breakdown:

| Type | Commits | Share of conforming |
| --- | --- | --- |
| feat | 88 | 33.2% |
| chore | 76 | 28.7% |
| fix | 73 | 27.5% |
| refactor | 16 | 6.0% |
| docs | 10 | 3.8% |
| style | 2 | 0.8% |
| Total | 265 | 100.0% |

The `fix` share is the cheapest defect proxy that exists. It is a proxy, not a
count: it measures how often someone chose to type `fix`, and teams that squash
aggressively will show fewer. Track its direction over quarters, not its level.

## Cadence

```bash
git log --no-merges --date=format:'%u %H' --pretty=%ad | sort | uniq -c
```

`%u` is the ISO weekday, 1 for Monday. This gives the same grid as GitHub's
punch card, computed offline, using the author's local timezone as recorded in
the commit. Watch the timezone: each commit stores its own offset, so a
distributed team's punch card mixes wall clocks. Normalise with
`--date=format-local:'%u %H'` and `TZ=UTC` if you want one clock.

## Signatures and provenance

```bash
git log --pretty='%H %G? %GS' | awk '{c[$2]++} END {for (k in c) print k, c[k]}'
```

`%G?` returns `G` for a good signature, `B` for bad, `U` for good but untrusted,
`N` for none, `E` for an error. This is the only local answer to "which commits
are cryptographically attributable". GitHub's `verified` flag on the commits API
is the same idea computed against keys GitHub knows about, and the two disagree
whenever a key is registered on GitHub but not in your local keyring.

## Portability notes measured today

- **macOS `awk` has no `strftime`.** The system `awk` is the original BWK awk.
  Any epoch-to-date conversion inside `awk` fails with "calling undefined
  function strftime". Either install `gawk`, or convert outside: `date -r <epoch>`
  on BSD and macOS, `date -d @<epoch>` on GNU.
- **`git log --date=format:` handles most of it anyway.** Prefer letting Git
  format the date.

## Cost summary

| Query | Runtime, 287 commits, 1,390 files |
| --- | --- |
| churn with rename detection | 0.61 s |
| file co-change pass (`--name-only`) | 0.13 s |
| blame across 110 source files | 2.19 s |

All measured with `time` on a warm cache. Local history analytics is effectively
free at this size and stays linear in commits times files touched.

---

<!-- 11archive-source: 02-local-code-structure.md -->

# The working tree as a dataset

History tells you what moved. The current tree tells you what exists. This
chapter covers the measurements you take from the files themselves.

Same test repository as 01-local-git-history.md:
1,390 tracked files, measured 2026-08-11.

## Count only what Git tracks

Every measurement here starts from `git ls-files`, never from `find`. `find`
picks up `node_modules`, build output, editor backups and anything else your
`.gitignore` excludes, and the numbers become meaningless.

```bash
git ls-files                       # tracked paths at the current commit
git ls-files -z | xargs -0 wc -l   # naive line count, breaks on binaries
```

## Size by language

```bash
git ls-files | while IFS= read -r f; do
  case "$f" in *.png|*.jpg|*.ico|*.woff2|*.pdf|*.svg) continue;; esac
  [ -f "$f" ] || continue
  printf '%s %s\n' "${f##*.}" "$(wc -l < "$f" | tr -d ' ')"
done | awk '{c[$1]+=$2; n[$1]++} END {for (e in c) printf "%-8s %5d files %8d lines\n", e, n[e], c[e]}'
```

Result:

| Extension | Files | Lines | Share of lines |
| --- | --- | --- | --- |
| md | 665 | 53,276 | 55.6% |
| json | 107 | 17,427 | 18.2% |
| mjs | 27 | 11,171 | 11.7% |
| tsx | 78 | 8,781 | 9.2% |
| yaml | 465 | 1,860 | 1.9% |
| py | 3 | 933 | 1.0% |
| ts | 5 | 675 | 0.7% |
| css | 4 | 436 | 0.5% |
| sh | 5 | 431 | 0.4% |
| html | 1 | 224 | 0.2% |
| other (9 extensions) | 16 | 556 | 0.6% |
| Total | 1,376 | 95,770 | 100.0% |

The total excludes 14 binary files (images, fonts, archives) skipped by the
filter. That exclusion is why the file count here is 1,376 and not 1,390. The
"other" row covers `js`, `cjs`, `yml`, `conf`, dotfiles and four empty
placeholder files; it is a display grouping, and the underlying counts are kept
in [data.json](data.json).

Two lessons visible in that table. First, this is a documentation repository
that happens to contain code: markdown is 56% of it. A "lines of code" headline
would have said 95,696 and meant almost nothing. Second, extension is a poor
proxy for language. `.mjs` and `.ts` and `.tsx` are all JavaScript-family, `.yaml`
here is configuration, and `.json` is mostly generated. Real language detection
needs a classifier, which is what the tools in
07-tooling-catalog.md provide.

### Code, comments and blanks

`wc -l` counts every line. Separating the three categories needs a per-language
rule. A crude version for C-family syntax:

```bash
git ls-files '*.mjs' | xargs awk '
  { t++
    if ($0 ~ /^[ \t]*$/) b++
    else if ($0 ~ /^[ \t]*(\/\/|\/\*|\*)/) c++ }
  END { printf "total=%d code=%d comment=%d blank=%d\n", t, t-c-b, c, b }'
```

Result for the `.mjs` files: 11,171 total, 10,472 code (93.7%), 137 comment
(1.2%), 562 blank (5.0%).

This undercounts. It misses trailing comments after code and it cannot see
inside multi-line strings. Treat it as a floor. If the comment ratio matters to
you, use a real counter such as `scc`, `tokei` or `cloc`, which carry per-language
lexers.

## File length distribution

```bash
git ls-files '*.mjs' '*.ts' '*.tsx' | while read -r f; do wc -l < "$f"; done |
  sort -n | awk '{a[NR]=$1} END {print "n="NR, "p50="a[int(NR*0.5)], "p90="a[int(NR*0.9)], "max="a[NR]}'
```

Result: n=110, median 84 lines, 90th percentile 392, maximum 1,388.

Report percentiles, never the mean. File length is heavily skewed: here the
longest file is 16 times the median, so the mean sits above two thirds of the
files and describes none of them.

## Complexity without a parser

Real cyclomatic complexity (the number of independent paths through a function)
needs a language parser. Two useful approximations need none.

**Branch counting.** Count keywords that create a branch: `if`, `for`, `while`,
`case`, `catch`, `&&`, `||`, `?`. This is what `scc` does, and it is accurate
enough to rank files inside one language. It cannot compare across languages,
because keyword density differs.

**Indentation.** Deeply indented code is nested code, and nesting is the part of
complexity that hurts readers.

```bash
awk '!/^[ \t]*$/ { match($0, /^[ \t]*/); ind = RLENGTH
                   sum += ind; n++; sq += ind*ind
                   if (ind > max) max = ind }
     END { m = sum/n
           printf "lines=%d mean=%.2f stdev=%.2f max=%d\n", n, m, sqrt(sq/n - m*m), max }' FILE
```

On the largest file in the test repository: 1,308 non-blank lines, mean indent
3.42, standard deviation 2.25, maximum 12. Adam Tornhill's work on behavioural
code analysis uses exactly this signal, on the grounds that it survives tab and
space differences and needs no language support.

Caveats: it is sensitive to the indent unit, so normalise tabs to spaces first,
and it rewards code that hides complexity in long flat expressions.

## Duplication, for free

Git already content-addresses every file. Identical files share a blob hash, so
exact duplication needs no tool:

```bash
git ls-files -s | awk '{print $2}' | sort | uniq -c | sort -rn | head
```

Result: **14 groups of identical files covering 37 files**. The largest real
group is three copies of a 1,388-line script, all with blob hash `555674e9`,
sitting in three sibling directories. That is the single most actionable
structural finding available from this repository, and it took one command.

This finds only byte-identical files. Near-duplicates (copy, paste, rename a
variable) need a token-level tool such as `jscpd` or `PMD CPD`. Note also that
empty files all share the well-known hash `e69de29b`, so filter zero-length
blobs out before you read the ranking.

## Dependencies

The declared list and the installed list are different sizes, and the gap is the
part that matters for risk.

```bash
jq '(.dependencies//{}) | length' package.json           # declared runtime
jq '(.devDependencies//{}) | length' package.json        # declared build-time
jq '[.packages | keys[] | select(. != "")] | length' package-lock.json
```

Result for the web application in the test repository: **33 declared** (23
runtime, 10 development) resolving to **753 installed packages**. An amplification
factor of 22.8. Every one of those 753 is a party you trust with code execution
at install time.

Equivalents in other ecosystems:

| Ecosystem | Declared | Resolved |
| --- | --- | --- |
| npm | `package.json` | `package-lock.json`, `npm ls --all --json` |
| Python | `pyproject.toml`, `requirements.txt` | `uv.lock`, `poetry.lock`, `pip freeze` |
| Go | `go.mod` | `go.sum`, `go list -m all` |
| Rust | `Cargo.toml` | `Cargo.lock`, `cargo tree` |
| Java | `pom.xml` | `mvn dependency:tree` |
| Ruby | `Gemfile` | `Gemfile.lock` |

## Tests and markers

```bash
git ls-files | grep -cE '\.(test|spec)\.[a-z]+$'          # 5 test files
git ls-files '*.mjs' '*.ts' '*.tsx' | wc -l               # 110 source files
git grep -nE '\b(TODO|FIXME|HACK|XXX)\b' | wc -l          # 0 markers
```

A test-to-source file ratio of 5 to 110 is a coverage question, not a coverage
answer. File counts say nothing about which lines run. For real coverage you
need the language's own tooling (`c8`, `coverage.py`, `go test -cover`,
`cargo-llvm-cov`) and a stored report; there is no way to derive it from the
repository contents.

The marker count of zero is a real observed zero here, not a missing value. In
most codebases this query is a useful backlog: markers cluster in the same files
as hotspots.

## Structural metrics that need a parser

These cannot be approximated well and need a real tool. Listed here so you know
what you are giving up by staying with shell commands.

| Metric | What it tells you | Tool |
| --- | --- | --- |
| Cyclomatic complexity per function | which functions are hard to test | `lizard`, `scc` (estimate) |
| Function length and parameter count | interface smells | `lizard` |
| Import and call graph | what depends on what | language-specific, `madge`, `pydeps`, `go mod graph` |
| Dead code | what can be deleted | `knip`, `vulture`, `staticcheck` |
| Type coverage | how much is actually typed | `tsc --noEmit`, `mypy --html-report` |
| Near-duplicate blocks | copy-paste debt | `jscpd`, `PMD CPD` |

## What the tree cannot tell you

- Whether a file is important. Size and complexity are not importance.
- Whether code runs. Only coverage and runtime telemetry answer that.
- Whether the design is good. Every metric here is a smell detector, and smells
  are hypotheses to check, not verdicts.

---

<!-- 11archive-source: 03-evolutionary-analysis.md -->

# History crossed with structure

The measurements in this chapter come from combining the commit log with the
files. They are the ones that change decisions, because they answer "where
should I spend my next week" rather than "how big is this".

The field has a name, behavioural code analysis, and a canonical source: Adam
Tornhill's *Your Code as a Crime Scene* and the `code-maat` tool that accompanies
it. Everything below can be reproduced with plain `git` and `awk`.

## Hotspots

A hotspot is a file that is both **changed often** and **hard to change**. Either
signal alone is weak. Together they identify the code where your effort earns
the most.

```bash
# 1. churn per file, rename-aware, merges excluded
git log --no-merges -M -C --pretty=tformat: --numstat |
  awk 'NF==3 && $1 != "-" { churn[$3] += $1 + $2; touches[$3]++ }
       END { for (f in churn) print churn[f] "\t" touches[f] "\t" f }' |
  sort -rn > /tmp/churn.tsv

# 2. keep only files that still exist
git ls-files > /tmp/alive.txt
awk -F'\t' 'NR==FNR { alive[$0]=1; next } alive[$3]' /tmp/alive.txt /tmp/churn.tsv | head -20
```

**Step 2 is not optional.** In the test repository, **40 of the 50
highest-churn files no longer exist at the current commit.** Skipping the filter
produces a refactoring list made mostly of deleted code.

Top hotspots after filtering, test repository, 2026-08-11:

| Churn (lines) | Commits touching it | File | Note |
| --- | --- | --- | --- |
| 1,448 | 10 | `variant-a/scripts/benchmarks-core.mjs` | one of three identical copies |
| 1,448 | 10 | `variant-b/scripts/benchmarks-core.mjs` | identical copy |
| 1,448 | 10 | `variant-c/scripts/benchmarks-core.mjs` | identical copy |
| 1,394 | 10 | `variant-a/scripts/analyze-cost-global.mjs` | near-identical sibling |
| 1,366 | 10 | `variant-b/scripts/analyze-cost-project.mjs` | near-identical sibling |
| 1,344 | 10 | `variant-c/scripts/analyze-cost-single.mjs` | near-identical sibling |
| 943 | 57 | `README.md` | documentation, not code |
| 667 | 6 | `generated/marketplace.json` | generated manifest |

The table diagnoses itself. Six of the top eight files are copies of two
scripts, they all change on the same commits, and the duplication check in
02-local-code-structure.md confirms three of them
are byte-identical. The fix is to extract one shared module, and this ranking is
how you would find that without already knowing it.

### Ranking hotspots properly

Churn alone over-ranks documentation and manifests. Multiply it by a complexity
proxy:

```
hotspot score = commits_touching_file x mean_indentation_depth
```

Use the commit count rather than the line count, because line counts are
dominated by whole-file rewrites and generated content. Compute
`mean_indentation_depth` with the `awk` snippet in
02-local-code-structure.md, or take `scc`'s
complexity estimate.

Restricting to source extensions before ranking is usually a bigger improvement
than any weighting scheme.

## Temporal coupling

Two files are temporally coupled when they keep changing in the same commit.
High coupling between files that live far apart is the signal: it means a
dependency exists that the directory structure does not express.

```bash
git log --no-merges --pretty=format:'C%H' --name-only | awk '
  /^C/ { for (i = 1; i <= n; i++)
           for (j = i+1; j <= n; j++) {
             a = f[i]; b = f[j]; if (a > b) { t = a; a = b; b = t }
             pair[a "\t" b]++ }
         for (i = 1; i <= n; i++) delete f[i]; n = 0; next }
  NF { f[++n] = $0 }
  END { for (p in pair) if (pair[p] >= 6) print pair[p] "\t" p }' | sort -rn | head
```

Runtime 0.13 s on 287 commits. Top pairs in the test repository:

| Co-changes | File A | File B |
| --- | --- | --- |
| 30 | `plugin-a/.claude-plugin/plugin.json` | `plugin-a/.codex-plugin/plugin.json` |
| 27 | `plugin-b/.claude-plugin/plugin.json` | `plugin-b/.codex-plugin/plugin.json` |
| 27 | `plugin-c/.claude-plugin/plugin.json` | `plugin-d/.claude-plugin/plugin.json` |
| 27 | `plugin-e/.claude-plugin/plugin.json` | `plugin-d/.claude-plugin/plugin.json` |

The first two rows are a real finding: each plugin keeps two manifests in sync
by hand, so every change costs two edits and can drift. The third and fourth
rows are an artefact: a release bot bumps every manifest version in one commit,
which makes all of them look coupled to all of the others.

**Filter bot commits before computing coupling.** Any automated commit that
touches many files creates a fully connected block of false pairs. Exclude by
author:

```bash
git log --no-merges --perl-regexp --author='^(?!.*bot).*$' --pretty=format:'C%H' --name-only
```

Two more corrections worth applying:

- **Normalise by frequency.** Raw co-change counts favour files that change
  often for unrelated reasons. Report `co_changes / min(revisions_a,
  revisions_b)` as a percentage and require a floor (six co-changes here) so
  that a two-out-of-two pair does not score 100%.
- **Cap commit width.** Drop commits touching more than, say, 30 files. A
  commit touching 200 files creates 19,900 pairs and swamps everything.

The cost is quadratic in files per commit, which is why the cap matters more for
speed than the history length does.

## Ownership and the bus factor

`git blame` attributes every surviving line to the commit that last changed it.

```bash
git blame --line-porcelain -w -M -C -- FILE |
  awk '/^author /{c[substr($0,8)]++}
       END {t=0; for (x in c) t += c[x]
            for (x in c) printf "%-20s %5d %5.1f%%\n", x, c[x], 100*c[x]/t}'
```

Flags that change the answer:

| Flag | Effect |
| --- | --- |
| `-w` | ignore whitespace-only changes, so a reformat does not steal authorship |
| `-M` | follow lines moved within the file |
| `-C` | follow lines copied from other files in the same commit |
| `-C -C -C` | search the whole history for the origin, slow but most accurate |

Test repository result: on all 110 source files, **one author owns more than 80%
of the lines, in 110 of 110 files**. The bus factor is 1. That is expected for a
single-maintainer project and it is exactly the number a growing team should
watch: the fraction of files with a single dominant author, tracked over time,
is the clearest early warning of key-person risk.

Cost: 2.19 s for 110 files. Blame is the most expensive local query in this
report; budget roughly 20 ms per file and cache the result by commit hash.

### Reading ownership honestly

- Blame credits the **last** person to touch a line. A formatting sweep with
  `-w` disabled reassigns an entire file to whoever ran the formatter. Always
  pass `-w`.
- Deleted code has no owner. Blame describes the surviving tree only.
- One dominant author can mean deep expertise or an abandoned corner. The metric
  raises the question; it does not answer it.

## Code age

Age is the time since a surviving line was last changed. Stable old code is
usually fine. Old code inside a hotspot is where defects concentrate.

```bash
git blame --line-porcelain -w -- FILE |
  awk '/^author-time /{print $2}' |
  while read -r t; do date -r "$t" +%Y-%m; done | sort | uniq -c
```

Use `date -d @"$t"` on GNU systems. Do not try to do this inside macOS `awk`:
its `awk` has no `strftime` and fails with "calling undefined function".

Repository-wide age, cheaply, without blame:

```bash
git ls-files | while read -r f; do echo "$(git log -1 --format=%at -- "$f") $f"; done | sort -n
```

That gives the last-touch date per file rather than per line. It is one `git log`
per file, so it is slower than it looks on large trees; for those, one pass of
`git log --name-only --format='%at'` and a first-seen map is far faster.

The deeper version of this measurement is **code survival**: of the lines added
in a given month, what fraction is still present today. `git-of-theseus` computes
it with a Kaplan-Meier estimator (the standard method for "how long do things
survive when some are still alive"), and `hercules` computes the same thing
faster. Both are described in 07-tooling-catalog.md.

## Change frequency by directory

Aggregating churn one level up finds the subsystem that is absorbing effort.

```bash
git log --no-merges --pretty=tformat: --name-only |
  awk 'NF { split($0, p, "/"); print p[1] "/" p[2] }' |
  sort | uniq -c | sort -rn | head
```

This is the cheapest way to answer "where is the team actually working", and it
is the right granularity for a monthly review. File-level churn is too noisy for
that conversation.

## What to record over time

Single snapshots of these metrics are weak. Trends are strong. Store, per week:

| Metric | Why the trend matters |
| --- | --- |
| Number of files with a single owner above 80% | rising means concentrating risk |
| Top-10 hotspot set | churn in the set means the refactor is not landing |
| Median and 90th-percentile file length | rising means files are not being split |
| Coupling pairs above the threshold | rising means the architecture is eroding |
| Share of commits typed `fix` | rising means quality is drifting |

Each row is one command from this chapter. A weekly append to a file is enough;
you do not need a database until you have years of it.

---

<!-- 11archive-source: 04-github-api-surface.md -->

# The GitHub API surface

Every endpoint below was called on 2026-08-11 with the `gh` command line tool
version 2.89.0, using a personal access token with scopes `repo`, `read:org`,
`workflow`, `gist`. The "Observed" column is the actual HTTP status returned,
not what the documentation promises.

Two repositories are used as subjects: a small one owned by the token holder
(25 commits) and `cli/cli`, a large public repository (over 10,000 commits, 3,132
merged pull requests, 45,798 stars) which triggers the size limits the small one
never reaches.

## Rate limits, the budget you are spending

| Credential | Limit |
| --- | --- |
| No token | 60 requests/hour |
| Personal access token | 5,000 requests/hour |
| GitHub App installation | 5,000/hour, up to 12,500 with scale bonuses |
| GitHub App on Enterprise Cloud | 15,000/hour |
| `GITHUB_TOKEN` inside Actions | 1,000/hour per repository |
| GraphQL, user token | 5,000 points/hour |
| Search endpoints | 30 requests/minute |
| Code search | 10 requests/minute |

Secondary limits apply on top and are the ones that actually stop a collector:
at most **100 concurrent requests**, at most **900 points per minute** on REST
(a read costs 1 point, a write costs 5), and at most **90 seconds of processing
time per 60 seconds of wall clock**. Source: GitHub REST rate-limit
documentation.

Check your own state without spending anything, since `rate_limit` is free:

```bash
gh api rate_limit --jq '.resources | {core, graphql, search, code_search}'
```

Observed at the start of this session: core 5000/5000, graphql 5000/5000, search
30/30, code_search 10/10. A single code search dropped code_search to 9.

## REST versus GraphQL, measured

This is the most important cost decision in the whole report.

| Task | REST | GraphQL |
| --- | --- | --- |
| 5 merged pull requests with reviews and commit counts | 11 requests | 1 request, cost 1, 115 nodes |
| 50 merged pull requests, same fields | 101 requests | 1 request, cost 2, 1,150 nodes |
| 100 merged pull requests, same fields | 201 requests | 1 request, cost 3, 2,300 nodes |

The REST figures are the arithmetic: one list call, then one `/reviews` call and
one `/commits` call per pull request. The GraphQL figures are the `rateLimit`
block returned by the query itself.

GraphQL points are computed from the requests the server would have had to make
internally, divided by 100 and rounded. The hard caps: `first` and `last` must be
between 1 and 100, and no single call may touch more than 500,000 nodes.

**Rule: any question shaped as "a list, and for each item some children" belongs
in GraphQL.** Everything else is simpler in REST.

## Repository facts

| Endpoint | Returns | Observed | Notes |
| --- | --- | --- | --- |
| `GET /repos/{o}/{r}` | size in KB, primary language, stars, forks, watchers, open issues, default branch, visibility, created and pushed timestamps, topics, archived flag | 200 | one call, no caveats |
| `GET /repos/{o}/{r}/languages` | bytes per language | 200 | computed by Linguist, byte counts not lines |
| `GET /repos/{o}/{r}/topics` | topic list | 200 | also present in the repo object |
| `GET /repos/{o}/{r}/community/profile` | health percentage and which community files exist | 200 | returned 42% and only `readme` present for the test repo |
| `GET /repos/{o}/{r}/codeowners/errors` | syntax errors in CODEOWNERS | 200 | useful pre-merge check |
| `GET /repos/{o}/{r}/contributors` | contributors with commit counts | 200 | see the anonymous-author note below |
| `GET /repos/{o}/{r}/forks`, `/tags`, `/releases` | list views | 200 | ordinary pagination |
| `GET /repos/{o}/{r}/stargazers`, `/subscribers` | who starred or watches | 200 own repo, **404 on two third-party public repos** | cause not established with this token; use `stargazers_count` from the repo object instead |
| `GET /repos/{o}/{r}/collaborators` | collaborator list | **403** on a repo we do not administer | needs push access |

The `languages` endpoint reports **bytes**, not lines. For the test repository it
returned HTML 1,845,662, TypeScript 266,514, JavaScript 42,600, CSS 4,477. A
single generated HTML report can therefore make a TypeScript project display as
"HTML" on GitHub. Fix it with `.gitattributes` and `linguist-generated=true`, or
ignore the field and count locally.

### Anonymous contributors

`GET /contributors` matches commit email addresses to GitHub accounts. Commits
whose email matches no account are dropped unless you ask for them.

Measured on `cli/cli` with `per_page=1`, reading the `Link` header's last page:

| Query | Contributors |
| --- | --- |
| default | 382 |
| `?anon=1` | 686 |

Nearly half the contributors are invisible by default. If you are counting
people, pass `anon=1`, then deduplicate by email yourself, because anonymous
entries have no stable identity.

## The statistics endpoints

Five endpoints back GitHub's own Insights graphs. They are cached and computed
in the background, which produces behaviour that will break a naive collector.

| Endpoint | Returns | Observed |
| --- | --- | --- |
| `GET /stats/contributors` | per contributor: total commits, plus weekly additions, deletions and commits | 202 on first call, 200 with data on retry |
| `GET /stats/commit_activity` | 52 weeks, commits per day of week | 202, still 202 after three retries |
| `GET /stats/code_frequency` | weekly additions and deletions | 202 on a small repo; **422 on `cli/cli`** |
| `GET /stats/participation` | 52 weekly commit counts, owner and everyone | 200 |
| `GET /stats/punch_card` | 168 cells, one per weekday-hour | 200 |

### The 202 pattern

First request returns `HTTP 202 Accepted` with an empty body `{}` while GitHub
computes the statistics. The correct client behaviour is retry with backoff.

Observed sequence on the small repository:

```
attempt 1: HTTP 202  {}          # cold cache, empty body
attempt 2: HTTP 200  [ ... ]     # warm
```

`gh api ... --jq length` on the cold response returns `0`, not an error. **A
collector that does not check the status code will record zero contributors and
report it as a fact.** Always inspect the status, never the body length.

Two of the five endpoints were still returning 202 after three attempts spread
over ten seconds on a repository last pushed to that same day, so the retry loop
needs a real ceiling and a documented "unavailable" outcome rather than a zero.

### The hard limits

- `code_frequency` returns **HTTP 422, "repository must have fewer than 10000
  commits"**. Confirmed on `cli/cli`. There is no workaround through the API;
  compute it locally with `git log --numstat`, which takes 0.61 s.
- `stats/contributors` returns additions and deletions as **0** for repositories
  with 10,000 or more commits, per GitHub's documentation. The zeros look like
  data and are not.
- `stats/contributors` returned exactly **500 entries** for `cli/cli`, which has
  686 contributors counting anonymous ones. Treat 500 as a cap.

### Merge commits are excluded

The small test repository has 25 commits locally, 25 on the default branch
remotely, and 25 from `GET /commits`. `stats/contributors` reports **23**. The
difference is exactly the 2 merge commits. Any reconciliation between GitHub
statistics and local `git rev-list --count` must add `--no-merges` first.

### Week boundaries and clocks

- `participation` counts weeks as UTC midnight to UTC midnight, most recent week
  ending today.
- `punch_card` uses **the timezone recorded in each commit**, so a distributed
  team's punch card mixes local clocks.
- Weekly buckets elsewhere start on Monday.

Mixing these three without saying which is which is the most common way these
numbers get misreported.

## Traffic

| Endpoint | Returns | Retention | Observed |
| --- | --- | --- | --- |
| `GET /traffic/views` | daily and total page views, plus unique visitors | 14 days | 200: count 6, uniques 1, 14 daily buckets |
| `GET /traffic/clones` | clone counts and unique cloners | 14 days | 200: count 106, uniques 47 |
| `GET /traffic/popular/paths` | top 10 paths | 14 days | 200 |
| `GET /traffic/popular/referrers` | top 10 referring sites | 14 days | 200 |

All four need **write access**. All four keep only **14 days**. There is no
history endpoint and no export. If you want traffic trends you must snapshot
these daily, forever, starting now. This is the single strongest argument for
running a scheduled collector at all: it is the only data in this report that is
permanently destroyed if you do not capture it.

The clone count in the test repository (106 clones, 47 unique) against 6 page
views is a normal pattern for a repository consumed by automation rather than
read by people.

## Commits, pull requests, issues

| Endpoint | Useful fields |
| --- | --- |
| `GET /commits` | `sha`, `author.login` (resolved account), `commit.author.date`, `commit.verification.verified` and `reason`, `parents` |
| `GET /commits/{sha}` | adds `stats.additions/deletions/total` and a per-file list with additions, deletions and status |
| `GET /pulls` | state, timestamps, labels, draft flag, merge state |
| `GET /pulls/{n}/files` | per-file additions, deletions, patch |
| `GET /pulls/{n}/reviews` | review state and submission time |
| `GET /issues/events` | labelled, assigned, closed, referenced events with timestamps |

A single commit fetch on `cli/cli` returned `stats: {additions: 304, deletions:
254, total: 558}` and 86 files. Note that per-commit file lists are **capped at
300 files**; larger commits need the compare endpoint.

`GET /commits/{sha}` costs one request per commit. For anything more than a few
hundred commits, clone the repository and use `git log --numstat` instead. It is
free, faster, and gives you the same numbers.

## Actions

| Endpoint | Returns | Observed |
| --- | --- | --- |
| `GET /actions/workflows` | workflow definitions and state | 200 |
| `GET /actions/runs` | run list, filterable by `status`, `event`, `branch`, `actor`, `created` | 200, `total_count` 19 on the small repo |
| `GET /actions/runs/{id}` | conclusion, event, `run_started_at`, `updated_at`, attempt number, actor | 200 |
| `GET /actions/runs/{id}/timing` | `run_duration_ms` and billable milliseconds per runner operating system | 200 |
| `GET /actions/runs/{id}/jobs` | per job: status, conclusion, start and end time, runner name, labels, step count | 200 |
| `GET /actions/cache/usage` | active cache size in bytes and count | 200: 275,878,831 bytes across 2 caches |
| `GET /repos/{o}/{r}/commits/{ref}/check-runs` | check results for a commit | 200 |

Observed timing response shape:

```json
{"billable": {"UBUNTU": {"total_ms": 0, "jobs": 1, "job_runs": [...]}},
 "run_duration_ms": 11000}
```

`run_duration_ms` is wall clock for the whole run. `billable.total_ms` is what
you pay for and reads **0 for public repositories**, which get Actions minutes
free. Do not compute cost from a public repository and expect it to transfer.

The `created` filter accepts a date range, which is what makes run collection
incremental: `?created=>=2026-08-01`.

## Organisation and enterprise level

| Endpoint | Observed with this token | Meaning |
| --- | --- | --- |
| `GET /orgs/{org}/settings/billing/usage` | 200, 11 usage items | current billing platform, works |
| `GET /orgs/{org}/settings/billing/actions` | **410 Gone** | retired, do not build on it |
| `GET /orgs/{org}/audit-log` | **404** | needs GitHub Enterprise Cloud |
| `GET /orgs/{org}/insights/api/summary-stats` | **404** | needs Enterprise Cloud |
| `GET /orgs/{org}/copilot/metrics` | **404** | needs Copilot Business or Enterprise plus `read:org` and the metrics permission |

Copilot metrics, where available, return daily aggregates for an enterprise or
organisation, broken down by repository, user, and user-team pair. Historical
data starts 2025-10-10 and is retained for one year. There is no team-scoped
endpoint; you join the user report against the user-teams report yourself.

A 404 on these endpoints means "not available to you", not "no data". Record it
as unavailable, never as zero.

## Search

| Endpoint | Limit | Observed |
| --- | --- | --- |
| `GET /search/commits` | 30 requests/minute, 1,000 results per query | `repo:cli/cli fix` returned `total_count` 1,767 |
| `GET /search/code` | 10 requests/minute, 1,000 results per query | `repo:cli/cli extension` returned `total_count` 90 |

Both cap at 1,000 returned results regardless of `total_count`, so search is a
counting tool and a sampling tool, never an enumeration tool. The code index also
skips large files and some file types, which is why the code search count above
is far lower than a local `git grep` would report.

## A working GraphQL query

This is the query behind the pull request measurements in
06-delivery-and-collaboration.md. It costs 3
points for 100 pull requests.

```graphql
query($owner:String!, $name:String!, $n:Int!) {
  rateLimit { cost remaining nodeCount }
  repository(owner:$owner, name:$name) {
    pullRequests(states:MERGED, last:$n, orderBy:{field:UPDATED_AT, direction:ASC}) {
      totalCount
      nodes {
        number createdAt mergedAt additions deletions changedFiles
        author { login }
        reviews(first:20) { totalCount nodes { state submittedAt author { login } } }
        commits(first:1) { totalCount }
      }
    }
  }
}
```

```bash
gh api graphql -F owner=cli -F name=cli -F n=100 -f query="$(cat pr.graphql)"
```

Always request `rateLimit { cost remaining }` in the same query. It is free, it
returns the true cost of the call you just made, and it is the only reliable way
to size a collector before it hits the limit.

Two things to fix in this query before using it for real:

- `orderBy: UPDATED_AT` means a six-year-old pull request re-enters the window
  when somebody comments on it. In the 100-pull-request sample, **7 were created
  before the apparent window**. Filter by `mergedAt` in your own code.
- `reviews(first:20)` silently truncates. One pull request in the sample had 65
  review submissions. Check `reviews.totalCount` against the node count and
  paginate when they disagree.

---

<!-- 11archive-source: 05-github-security-supply-chain.md -->

# Security and supply-chain data

This is the part of the GitHub surface with no local equivalent. Alert states,
scan results and the resolved dependency graph exist only on the platform. It is
also the part where "no data" and "no permission" look almost identical, and
where confusing the two turns an unmonitored repository into a clean report.

All calls made 2026-08-11 with a token holding `repo`, `read:org`, `workflow`,
`gist`. Note that it does **not** hold `security_events`, which is why several
rows below show 403. That is itself the finding: the scope you use decides which
security data exists as far as your collector is concerned.

## The status codes and what each one means

| Endpoint | Observed | Real meaning |
| --- | --- | --- |
| `GET /repos/{o}/{r}/code-scanning/alerts` | **404** on own repo, body `no analysis found` | scanning is on or off, but nothing has ever run |
| same, on a repo we do not administer | **403** | token lacks `security_events` |
| `GET /repos/{o}/{r}/secret-scanning/alerts` | **200, `[]`** on own repo | enabled, zero alerts. A real observed zero |
| same, on a repo we do not administer | **404** | not enabled, or not visible to us |
| `GET /repos/{o}/{r}/dependabot/alerts` | **403** on a repo we do not administer | needs write access plus alert read permission |
| same, on own repo | **200-shaped error**: `Dependabot alerts are disabled for this repository.` | the feature is off |
| `GET /repos/{o}/{r}/vulnerability-alerts` | **404** | alerts not enabled. 204 would mean enabled |
| `GET /repos/{o}/{r}/dependency-graph/sbom` | **404** on all four own repos, **200** on `cli/cli` | 404 here means the dependency graph is switched off |
| `GET /repos/{o}/{r}/security-advisories` | **200** | repository-published advisories, readable without extra scope |
| `GET /advisories` | **200** | the global advisory database, public |
| `GET /repos/{o}/{r}/attestations/{digest}` | **200, `{"attestations": []}`** | valid digest shape, nothing attested |

**The single most important rule in this chapter:** a 403 or 404 is an
*unavailable* result. It is not zero alerts. A dashboard that renders both as "0"
will show a repository with security scanning switched off as the safest
repository you own. Store the status code beside every count.

Four of the four repositories owned by the token holder returned "Dependabot
alerts are disabled" and had no code-scanning analysis. The data does not exist
to be collected. The first action is a settings change, not a collector.

## Checking what is switched on

Before collecting alerts, collect configuration. This is one call and it tells
you whether the alert numbers mean anything:

```bash
gh api repos/{owner}/{repo} --jq '.security_and_analysis'
```

Returns the enablement state of secret scanning, push protection, Dependabot
security updates, and advanced security where licensed. Pair it with:

```bash
gh api repos/{owner}/{repo}/vulnerability-alerts -i | head -1   # 204 on, 404 off
gh api repos/{owner}/{repo}/rulesets                            # [] means none
gh api repos/{owner}/{repo}/branches/{branch}/protection        # 404 "Branch not protected"
```

Observed on the test repository: rulesets `[]`, branch protection **404 "Branch
not protected"**. Both are real configuration findings and both are one call.

## The dependency graph and SBOM

An SBOM is a software bill of materials: a machine-readable list of every
package a project pulls in, in a standard format.

```bash
gh api repos/cli/cli/dependency-graph/sbom --jq '.sbom | {spdxVersion, dataLicense, packages: (.packages|length)}'
```

Observed for `cli/cli`:

| Field | Value |
| --- | --- |
| Format | SPDX-2.3 |
| Data licence | CC0-1.0 |
| Packages | 221 |
| Relationships | 1,189 |
| Packages carrying a version | 221 of 221 (100%) |
| Packages with a concluded licence | 181 of 221 (81.9%) |
| Generating tools | `protobom`, `GitHub.com-Dependency-Graph`, `dependabot` |
| `creationInfo.created` | the moment of the request |

Three things follow from that table.

**It is generated on demand.** The `created` timestamp equals request time, so
the SBOM reflects the default branch now. It is not a build artefact and it is
not tied to a release. For release provenance you need an SBOM produced by your
own build and attached to the release.

**Licence coverage is partial.** 18.1% of packages carry no concluded licence.
Reporting "licence compliance verified" from this data would be wrong for one
package in five. Report the coverage number beside the finding.

**404 is a configuration answer.** All four repositories owned by the token
holder returned 404, including ones with a `package-lock.json` containing 753
resolved packages. The lock file exists; the graph is off.

For comparison, the local view of the same question from
02-local-code-structure.md: 33 declared
dependencies resolving to 753 installed packages. The lock file is always
available offline and is more precise about versions. GitHub's graph adds the
cross-reference to known vulnerabilities, which the lock file cannot give you.

## The global advisory database

This one is free, public, needs no special scope, and is the most under-used
endpoint on the list.

```bash
gh api "advisories?ecosystem=npm&severity=critical&per_page=100"
```

Returns GHSA identifiers, CVE identifiers, severity, affected package names and
version ranges, patched versions, CVSS vectors, CWE identifiers and references.
Observed sample from today included `GHSA-rg76-677x-56q9` (CVE-2026-71851,
critical, `crypto-js`) and `GHSA-279x-mwfv-vcqv` (CVE-2026-71319, critical,
`@nuxt/devtools`).

Filters worth knowing: `ecosystem`, `severity`, `cwes`, `affects` (a package
name), `published` and `updated` date ranges, `type`. Pagination is cursor-based
through `before` and `after`, not page numbers.

**This lets you run your own vulnerability matching offline.** Take the resolved
package list from your lock file, take the advisory database for your ecosystem,
and join them. You get Dependabot's core function without enabling anything, for
any repository, including ones you do not own. What you do not get is the
transitive path explanation and the automatic pull requests.

## Artifact attestations and provenance

```bash
gh api repos/{owner}/{repo}/attestations/sha256:{digest}
```

Returns the signed statements that a specific artefact was built by a specific
workflow. Observed shape for a digest with nothing recorded: `{"attestations":
[]}` with status 200. A wrong repository returns 404.

This is the GitHub implementation of build provenance in the SLSA sense: a
signed record linking a binary to the source commit and the workflow that
produced it. It is generated by `actions/attest-build-provenance` in a workflow
and verified with `gh attestation verify`. If your build does not produce
attestations, this endpoint is empty rather than absent, which is a good example
of why the empty-versus-missing distinction has to be recorded.

## Repository-published advisories

```bash
gh api repos/{owner}/{repo}/security-advisories --jq '[.[] | {ghsa_id, severity, state, published_at}]'
```

Observed on a project that publishes them: `GHSA-r4w5-6pfg-jxp5` (medium,
published 2026-07-27) and `GHSA-q6m5-f73j-m9mc` (critical, published
2026-06-03). Readable on public repositories without extra scope, which makes it
a good way to track the security history of your **dependencies'** repositories,
not only your own.

## Static analysis you can run yourself

Code scanning results live on GitHub, but the scanners run anywhere. Running
them locally gives you findings on repositories where the platform feature is
off, and it gives you the findings before the push.

| Tool | Finds | Local invocation |
| --- | --- | --- |
| Semgrep | pattern-based bugs and injection risks across 30+ languages | `semgrep --config=auto .` |
| Gitleaks | secrets in the working tree **and in history** | `gitleaks detect --source .` |
| Trivy | vulnerable dependencies, container layers, misconfiguration | `trivy fs .` |
| CodeQL CLI | deep dataflow queries, the engine behind GitHub code scanning | `codeql database create` then `codeql database analyze` |
| OSV-Scanner | lock file to advisory matching, from Google's OSV database | `osv-scanner -r .` |

Availability on the machine used for this report, checked with `command -v`:
`semgrep` present, `gitleaks` absent, `trivy` absent, `codeql` absent,
`osv-scanner` absent. Nothing was installed for this research, so the numbers in
this report use only `git`, `gh`, `jq`, `node` and `awk`.

**Gitleaks deserves special mention.** It scans history, not just the current
tree. A secret removed in a later commit is still in the pack file and still
retrievable, so a clean working tree proves nothing. This is the one security
scan whose local version is strictly more useful than the platform version,
because GitHub's secret scanning covers a fixed provider list while a history
scan finds anything shaped like a credential.

## Supply-chain posture in one number

OpenSSF Scorecard grades a repository against 19 to 23 automated checks and
returns 0 to 10 per check plus a weighted total. Weights follow the risk level:
critical counts 10, high 7.5, medium 5, low 2.5.

Checks include: Binary-Artifacts, Branch-Protection, CI-Tests, CII-Best-Practices,
Code-Review, Contributors, Dangerous-Workflow, Dependency-Update-Tool, Fuzzing,
License, Maintained, Packaging, Pinned-Dependencies, SAST, Security-Policy,
Signed-Releases, Token-Permissions, Vulnerabilities, Webhooks.

Run it three ways: the command line tool, a GitHub Action on a schedule, or the
public API and BigQuery dataset of pre-computed scores for widely used projects.
The last one is the interesting one for supply-chain work, because it lets you
score your **dependencies** without cloning any of them.

Caveat: Scorecard measures process, not code. A project can score well and still
be unsafe, and a small well-written library will score poorly for lacking fuzzing
and a security policy. Use it to sort a long list of dependencies, not to judge
one.

## What to collect, and how often

| Item | Cost | Cadence |
| --- | --- | --- |
| `security_and_analysis` enablement flags | 1 request | daily |
| Alert counts per category, with the status code | 1 request each | daily |
| Alert age distribution (oldest open alert per severity) | reuse the list call | daily |
| SBOM | 1 request | weekly, and on every release |
| Global advisories for your ecosystems, incremental by `published` | a few requests | daily |
| Scorecard | 1 job | weekly |
| Gitleaks history scan | minutes | on every push, and once in full |

Alert **age** matters more than alert **count**. A repository with 40 alerts all
opened yesterday is healthier than one with 3 alerts open for 8 months. Both the
Dependabot and code-scanning alert objects carry `created_at`, `dismissed_at`
and `fixed_at`, which is everything you need for a time-to-remediate
distribution.

---

<!-- 11archive-source: 06-delivery-and-collaboration.md -->

# Delivery and collaboration measurements

Git records what changed. It does not record what happened *around* the change:
how long it waited for review, who reviewed it, whether the build passed. That
information exists only on GitHub, and it is the strongest argument for calling
the API at all.

All measurements below come from `cli/cli`, chosen because it has enough volume
to produce meaningful percentiles. Collected 2026-08-11.

## Pull request cycle time

One GraphQL query returns 100 merged pull requests with reviews and commit
counts for 3 rate-limit points. The query is in
04-github-api-surface.md.

Sample: 100 most recently updated merged pull requests. 93 of them were created
in the 35 days to 2026-08-10.

| Measurement | n | Median | 75th | 90th | Max |
| --- | --- | --- | --- | --- | --- |
| Open to merge, hours | 100 | 20.09 | 101.58 | 191.15 | 1,247.38 |
| Open to first review, hours | 98 | 2.07 | n/a | 132.31 | 262.51 |
| Changed lines (added + deleted) | 100 | 18 | 154.75 | 501.30 | 13,075 |
| Changed files | 100 | 2 | 4 | 7.10 | 86 |
| Review submissions per pull request | 100 | 1.5 | 3 | 5 | 65 |

Percentiles are linear-interpolated. The 75th percentile is not shown for first
review because that column is reported after the correction described below and
the interpolated value adds nothing.

One pull request in the sample had zero reviews.

### The correction that matters

GitHub lets anyone submit a review on a pull request that merged years ago. The
naive query "earliest review timestamp minus creation timestamp" therefore
includes reviews that arrived after the merge.

Measured effect on the same 100 pull requests:

| Definition | n | Median hours | 90th percentile | Max |
| --- | --- | --- | --- | --- |
| First review, unfiltered | 99 | 2.75 | 143.73 | 56,035.49 |
| First review, submitted at or before merge | 98 | 2.07 | 132.31 | 262.51 |

The 56,035-hour maximum is six and a half years: pull request #521, opened and
merged in February 2020, received a review comment in July 2026. That single row
moved the median by 25%.

**Rule: bound every review timestamp by `mergedAt`.** Then report how many pull
requests lost their first review to the filter, which was 1 here.

### The window trap

`orderBy: {field: UPDATED_AT}` sounds like a time window and is not. Any old
pull request re-enters the list the moment someone comments on it. In this
sample **7 of 100** were created before the apparent window, including that 2020
one.

Filter on `mergedAt` in your own code, or use the search interface with an
explicit `merged:>=2026-07-01` qualifier and accept its 1,000-result cap.

### Reading these numbers

Report the median and the 90th percentile. Never the mean. The mean of the
open-to-merge column is dragged upward by the 1,247-hour maximum and describes no
real pull request.

The gap between the median (20 hours) and the 90th percentile (191 hours) is the
finding. Half of the changes land within a day; one in ten takes over a week. The
interesting question is what those slow ones have in common, and the size
columns answer it: the median pull request changes 18 lines across 2 files, while
the 90th percentile changes 501 lines across 7. Size predicts wait.

## Review load

Reviews per pull request has a median of 1.5 and a maximum of 65. That maximum
is one long argument, and the distribution's shape means an average would hide
it.

Per-reviewer aggregation comes from the same query by grouping
`reviews.nodes[].author.login`. Two warnings before you build that view:

- `reviews(first: 20)` truncates. One pull request here had 65 review
  submissions, so 45 were missing from the response. Compare
  `reviews.totalCount` with the number of nodes returned and paginate when they
  differ.
- A "review submission" is not a review. Approving, requesting changes and
  leaving a comment all count. Group by the `state` field
  (`APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`, `DISMISSED`) or the numbers
  will not mean what the label says.

## Build telemetry

```bash
gh api "repos/{owner}/{repo}/actions/runs?per_page=100"
```

The 100 most recent runs on `cli/cli`, covering roughly 24 hours out of 31,382
total runs:

| Conclusion | Runs |
| --- | --- |
| success | 88 |
| action_required | 9 |
| skipped | 3 |
| failure | 0 |
| Total | 100 |

Triggering events in that same sample: `schedule` 54, `pull_request` 15,
`issue_comment` 7, `pull_request_target` 7, `dynamic` 7, `issues` 6, `push` 4.

**Over half of it is cron.** A build health number computed from unfiltered runs
is mostly measuring scheduled housekeeping jobs. Filter by event.

The same query restricted to completed pull request runs
(`?event=pull_request&status=completed`, 5,085 matching runs, 100 sampled):

| Measurement | Unfiltered sample | `event=pull_request` |
| --- | --- | --- |
| Failure rate | 0.0% of 100 | 1.1% of 88 concluded |
| Wall clock, median | 18 s | 170 s |
| Wall clock, 90th percentile | 245 s | 584 s |
| Wall clock, max | 573 s | 788 s |
| Window covered | 24 hours | 4 days |

The median run time is nine times longer once the cron jobs are removed. Both
numbers are true; only one answers "how long do contributors wait for CI".

Note `action_required` in both samples (9 and 12). Those are runs waiting for a
maintainer to approve a workflow from a fork. They are neither successes nor
failures, and folding them into either direction is wrong. Report them as their
own state.

### Per-run detail

| Endpoint | Adds |
| --- | --- |
| `GET /actions/runs/{id}/timing` | `run_duration_ms`, plus billable milliseconds per runner operating system |
| `GET /actions/runs/{id}/jobs` | per-job start and end time, runner name and labels, step count |

Observed timing response: `{"billable": {"UBUNTU": {"total_ms": 0, "jobs": 1}},
"run_duration_ms": 11000}`. Billable time reads 0 on public repositories because
they do not consume minutes. Compute cost only from private repositories or
from the organisation billing endpoint.

Job-level data is where the actionable information is. A run that takes 584
seconds usually contains one job that takes 550 and several that take 20. You
cannot see that from the run object.

Cost: one request per run for timing, one per run for jobs. For a repository with
31,382 runs this is the most expensive collection in this report. Collect
incrementally with `?created=>=YYYY-MM-DD` and keep only what you have not seen.

## DORA metrics

DORA (DevOps Research and Assessment) publishes the standard delivery measures.
As of the current guidance there are **five**, not the four people usually quote,
and "mean time to restore" has been renamed.

| Metric | Definition | Where the data comes from |
| --- | --- | --- |
| Deployment frequency | how many deployments in a period, or the time between them | `GET /deployments`, or release tags, or a workflow with a `production` environment |
| Change lead time | time from a change being committed to version control until it is deployed to production | local `git log` for the commit time, joined to the deployment record |
| Change fail rate | share of deployments needing immediate remediation | your incident record joined to deployments. **Not derivable from GitHub alone** |
| Failed deployment recovery time | how long to recover after a deployment breaks production | same |
| Deployment rework rate | share of unplanned deployments caused by production incidents | same |

Two of the five are cheap and three are not. Deployment frequency and change
lead time can be computed today from `GET /repos/{o}/{r}/deployments` (status
200, confirmed) plus the commit history. The three stability metrics all require
you to record what a production incident is, and no API knows that. Teams that
claim full DORA coverage from GitHub data alone are approximating the failure
metrics with "did the deploy workflow fail", which is a different and much
weaker thing.

If you have no incident record, say so and publish the two throughput metrics
only. Two honest metrics beat five invented ones.

## Issue flow

`GET /issues/events` (status 200) returns labelled, assigned, closed, reopened
and referenced events with timestamps. From those you can build:

- **Time to triage.** Created until the first label or assignment.
- **Time to close**, split by label.
- **Reopen rate.** Reopened events divided by closed events. A quality signal
  that costs nothing.
- **Backlog age.** Distribution of open-issue ages, which is more useful than the
  count.

Watch the definitions: pull requests are issues in the GitHub data model. `GET
/issues` returns both unless you filter on the absence of the `pull_request`
field, so an unfiltered "open issues" count includes open pull requests. The
repository object's `open_issues_count` has the same problem.

## What a weekly delivery report should contain

| Row | Source | Cost per repository |
| --- | --- | --- |
| Merged pull requests this week | GraphQL, filtered by `mergedAt` | 1-3 points |
| Open to merge, median and 90th percentile | same call | 0 |
| Open to first review, median and 90th percentile, bounded by merge | same call | 0 |
| Median changed lines per pull request | same call | 0 |
| Pull requests merged with zero reviews | same call | 0 |
| CI failure rate on pull request runs | 1 REST call | 1 request |
| CI wall clock, median and 90th percentile | same call | 0 |
| Deployment count and lead time | 1-2 REST calls | 2 requests |

Roughly five requests and three GraphQL points per repository per week. At that
cost, the 5,000-per-hour limit stops being a design constraint and the real
constraint becomes storing the results so you can see trends.

---

<!-- 11archive-source: 07-tooling-catalog.md -->

# Tooling catalog

Everything in the previous chapters was produced with `git`, `gh`, `jq`, `node`
and `awk`, all of which were already on the machine. This chapter covers what
you gain by installing something, and what each addition is actually for.

Availability checked on the research machine 2026-08-11 with `command -v`.
Nothing was installed for this report.

| Tool | Present |
| --- | --- |
| `git` 2.49.0, `gh` 2.89.0, `jq`, `node` 24.16.0, `python3`, `ruby`, `semgrep` | yes |
| `scc`, `tokei`, `cloc`, `lizard`, `gitleaks`, `trivy`, `osv-scanner`, `hyperfine`, `go`, `cargo` | no |

## Counting code properly

Shell plus `wc -l` gets you total lines. It cannot separate code from comments,
and it cannot classify languages. Three tools do.

**scc** (Go, single binary). Counts lines, code, comments and blanks per
language, plus two extras that no shell script gives you: a **complexity
estimate** from counting branch and loop keywords, and a **COCOMO** effort
estimate. Also computes ULOC, the count of unique lines across the project, which
is a fast whole-repository duplication signal. Output formats include tabular,
JSON, CSV, HTML, SQL and OpenMetrics, so it drops straight into a pipeline. The
complexity number is comparable **within** one language only, because keyword
density differs between languages.

**tokei** (Rust, single binary). Same core job, similar speed, JSON output. Pick
one of scc or tokei; the difference that matters is that scc carries the
complexity and COCOMO estimates.

**cloc** (Perl, everywhere). The oldest and the most widely trusted for
cross-project comparison. Slower. Its `--diff` mode counts added, modified and
removed lines **between two trees**, split by language, which neither of the
other two does and which `git diff --numstat` cannot do because it has no
language model.

Recommendation: `scc` for daily use, `cloc --diff` when you need
language-aware change counts for a migration or a release note.

## Complexity with a parser

**lizard** (Python, `pip install lizard`). Reports, per function: cyclomatic
complexity (CCN), lines of code excluding comments, token count and parameter
count. Supports 29 or more languages including C, C++, C#, Go, Java, JavaScript,
Kotlin, PHP, Python, Ruby, Rust, Scala, Swift, TypeScript and Vue.

Defaults: warns above CCN 15, warns above 1,000 lines per function, no default
parameter limit. Useful flags: `-C` sets the complexity threshold, `-L` the
length limit, `-a` the parameter limit, `-T` a limit on any measured field such
as `-Tnloc=25`, and `-w` prints warnings only.

This is the tool that turns "this file is complicated" into "these four
functions are complicated", which is the difference between a metric and a task.

## Behavioural code analysis

These read the Git log and produce the analyses in
03-evolutionary-analysis.md with more rigour than
the shell versions.

**code-maat** (Clojure, needs a Java runtime). Adam Tornhill's tool, the
reference implementation of the whole field, and the companion to *Your Code as
a Crime Scene*. Reads a Git log export and computes revisions per file, temporal
coupling (with proper normalisation, not raw counts), sum of coupling, code age,
author counts per module, entity ownership and main-developer attribution.
Output is CSV, meant to be joined against a line count from `cloc` or `scc`.

Use it when your shell coupling query starts producing results you cannot
defend. Its normalisation and its handling of large commits are the parts that
are genuinely hard to reimplement.

**hercules** (Go). Much faster, and does things code-maat does not: a burndown
analysis showing how many lines from each period survive over time, per project,
file or developer; a couples matrix for both files and developers; a devs
analysis of commit and line counts through time; and "shotness", which counts
modifications per **function** rather than per file using language parsing.
Output as YAML, Protocol Buffers or JSON.

Two warnings from its own documentation. Memory is the limit, not speed: a
couples analysis of the Linux kernel produced 1.5 GB of output and needed over
180 GB of RAM to parse. And it depends on the Babelfish parsing service, which
is no longer maintained, so the language-aware analyses may not work. Use
`--first-parent` if commit processing fails.

**git-of-theseus** (Python). One question, answered well: how long does code
survive? It produces cohort plots (lines grouped by the year they were added),
survival curves fitted with a Kaplan-Meier estimator, and the same breakdown by
author and by file extension. Three commands: `git-of-theseus-analyze` to scan,
then `stack-plot`, `line-plot` or `survival-plot`. The analysis pass is slow;
hercules reports being 20% to 6 times faster at the equivalent work.

The number it produces, the half-life of your code, is the most quotable
statistic in this whole report and the hardest to game.

**PyDriller** (Python library). Not a report generator: a clean API over the Git
history for writing your own analysis. Iterate commits, get modified files with
before-and-after source, and it computes complexity and lines per method for you.
The right choice when your question is specific enough that no tool answers it.

## Duplication

**jscpd** (Node). Token-level copy-paste detection across more than 150
languages, with a configurable minimum clone size and JSON, HTML or console
output. Finds near-duplicates, which the blob-hash trick in
02-local-code-structure.md cannot.

**PMD CPD** (Java). The same idea, older, with mature language support and a
well-defined tokeniser. Ships inside PMD.

Both need tuning. Default thresholds report generated code, test fixtures and
import blocks as clones. Budget an afternoon on the ignore list before the output
is worth reading.

## Security scanning

| Tool | Scope | Note |
| --- | --- | --- |
| **Semgrep** | pattern-based static analysis, many languages | `semgrep --config=auto` pulls community rules. Fast enough for a pre-commit hook |
| **gitleaks** | secrets in the working tree **and the full history** | The one whose local version beats the platform version. A removed secret stays in the pack file |
| **trivy** | dependencies, container images, infrastructure config, licences | Broadest coverage in one binary |
| **osv-scanner** | lock file to advisory matching, Google's OSV database | Cross-ecosystem, and the database is public |
| **CodeQL CLI** | dataflow queries, the engine behind GitHub code scanning | Heaviest to set up. Only worth it if you write custom queries |
| **OpenSSF Scorecard** | 19 to 23 repository posture checks, scored 0 to 10 | See 05-github-security-supply-chain.md |

Scorecard's weighting is worth repeating because it explains its scores:
critical-risk checks count 10, high 7.5, medium 5, low 2.5, and the total is the
weighted average. It also publishes pre-computed scores through an API and a
BigQuery dataset, which lets you score every dependency you have without cloning
any of them.

## Convenience layers

**git-quick-stats** (shell). An interactive menu over the same `git log` queries
used in this report: commits by author, by hour, by weekday, by month, plus
per-author churn. Nothing you cannot write, but it is already written and it is a
single file.

**gh extensions** (`gh extension install`). Worth checking before you build
anything, because the ergonomics of an extension beat a script: it inherits your
authentication, your rate limit handling and your pagination.

**GitHub's own web views.** Insights → Pulse, Contributors, Traffic, Network and
Forks render the statistics endpoints from
04-github-api-surface.md. Use them to sanity-check a
collector, never as a data source, because they carry the same caps (500
contributors, no code frequency above 10,000 commits) without telling you.

## Commercial, for completeness

**CodeScene** is the hosted commercial product built on the behavioural analysis
ideas above, by the author of code-maat. It adds change coupling across
repositories, a code health score, and knowledge-loss modelling. Mentioned so
the vocabulary in this report maps onto its interface, not as a recommendation;
it was not evaluated for this research.

## What to install, in order

1. **scc.** Immediate, no configuration, gives you the language and complexity
   picture in one command.
2. **gitleaks.** Run it once over full history today. This is the highest
   expected value of anything on the list.
3. **lizard.** When you need function-level complexity to make a refactoring
   argument.
4. **code-maat or hercules.** When coupling and ownership become a recurring
   conversation rather than a one-off.
5. **git-of-theseus.** Once, for the survival curve. Then once a year.

Everything before step 1 is already in this report and costs nothing.

---

<!-- 11archive-source: 08-collection-blueprint.md -->

# A collector you can actually run

A design for gathering everything in this report on a schedule, sized for one
person and a few dozen repositories. It assumes no database, no service and no
budget.

## The four rules

**1. Local first.** If `git` can answer it, never call the API. Local queries
are free, offline, unlimited and faster. The API is for review timing, build
telemetry and security state, and nothing else.

**2. Snapshot what expires.** Most GitHub data is permanent and can be fetched
whenever. Traffic is not: views, clones, popular paths and referrers keep
**14 days** and are then gone forever. If you build only one scheduled job,
build the traffic snapshot.

**3. Record the status code, never the absence.** Every stored metric carries how
it was obtained. A 403 stores as `unavailable`, not `0`. This one rule prevents
the most damaging class of error in the whole exercise, which is a security
dashboard reporting an unmonitored repository as clean.

**4. Append, never overwrite.** One line of JSON per observation per day. Trends
are the product; a current-state snapshot is nearly worthless on its own.

## Storage

One JSON Lines file per source. No schema migration, no server, greppable, and
`jq` reads it.

```
data/
  git-daily.jsonl          # one line per repo per day, local metrics
  gh-repo.jsonl            # repository facts, stars, size, language
  gh-traffic.jsonl         # the perishable one
  gh-prs.jsonl             # one line per pull request, keyed by number
  gh-runs.jsonl            # one line per workflow run
  gh-security.jsonl        # alert counts plus enablement flags plus status codes
  cache/blame/<sha>.json   # blame results, keyed by commit
```

Every record carries the same envelope:

```json
{"observedAt": "2026-08-11T22:00:00Z",
 "repo": "owner/name",
 "source": "git|rest|graphql",
 "status": "ok|unavailable|error",
 "httpStatus": 200,
 "metric": "pr_merge_hours_p50",
 "value": 20.09,
 "unit": "hours",
 "coverage": {"n": 100, "window": "mergedAt>=2026-07-06"}}
```

`coverage` is not optional. A percentile over 100 pull requests and a percentile
over 4 are different facts, and six months later nothing else will tell you
which one you are looking at.

## Cadence and cost

Per repository. Costs are measured, not estimated: see
04-github-api-surface.md.

| Job | Frequency | Cost |
| --- | --- | --- |
| Traffic snapshot (4 endpoints) | **daily, non-negotiable** | 4 requests |
| Repository facts and languages | daily | 2 requests |
| Security enablement flags and alert counts | daily | 4-6 requests |
| Pull requests merged since last run | daily | 1-3 GraphQL points |
| Workflow runs since last run, filtered by event | daily | 1-2 requests |
| Local git metrics: churn, hotspots, coupling, conventional commit split | daily | 0, about 1 s |
| Blame ownership and bus factor | weekly | 0, about 2 s per 110 files |
| SBOM | weekly | 1 request |
| Scorecard | weekly | 1 job |
| Code survival curve | yearly | minutes |

Daily total: roughly **12 to 15 REST requests and 3 GraphQL points per
repository**. Against a 5,000/hour limit that is 300 repositories per hour with
room to spare. **The rate limit is not your constraint. Your patience for
writing the collector is.**

## Incremental collection

Full re-fetching is what makes collectors slow and expensive. Three keys make
everything incremental:

| Source | Watermark | How |
| --- | --- | --- |
| Pull requests | last `mergedAt` seen | filter client-side, or `search` with `merged:>=DATE` |
| Workflow runs | last `created_at` seen | `?created=>=YYYY-MM-DD` |
| Commits and local metrics | last commit hash processed | `git log <last>..HEAD` |
| Blame | the commit hash of the file | skip when unchanged: `git log -1 --format=%H -- FILE` |

The blame cache matters most. Blame is the only local query with a real cost
(2.19 s for 110 files), and a file's blame result cannot change unless the file
changes. Key the cache by the file's last-commit hash and the recomputation
drops to only the files touched since yesterday.

## Handling the 202

Two of the five statistics endpoints return `HTTP 202` with an empty body while
GitHub computes them in the background. A collector must distinguish "computing"
from "zero".

```bash
fetch_stats() {                       # $1 = path
  for attempt in 1 2 3 4 5; do
    code=$(gh api "$1" -i 2>/dev/null | head -1 | grep -o '[0-9]\{3\}')
    case "$code" in
      200) gh api "$1"; return 0 ;;
      202) sleep $((attempt * 3)) ;;  # computing, back off
      422) echo '{"status":"unavailable","reason":"repository too large"}'; return 0 ;;
      *)   echo "{\"status\":\"error\",\"httpStatus\":$code}"; return 0 ;;
    esac
  done
  echo '{"status":"unavailable","reason":"still computing after 5 attempts"}'
}
```

Observed today: one endpoint warmed after a single retry, two were still
returning 202 after three attempts across ten seconds. The ceiling and the
explicit "unavailable" outcome are both required; without them the collector
silently records zero.

## Rate limit discipline

```bash
gh api rate_limit --jq '.resources.core.remaining'    # free, does not consume
```

Check before a batch, not after a failure. Three rules that keep a collector
inside the secondary limits, which are the ones that actually stop you:

- **Serial, or at most a handful of parallel requests.** The hard ceiling is 100
  concurrent across REST and GraphQL, but 900 points per minute is reached much
  sooner. A read costs 1 point, a write costs 5.
- **Respect `Retry-After` and `x-ratelimit-reset`.** Both are returned as
  headers. Sleeping until reset is correct behaviour; retrying immediately is
  how an integration gets throttled harder.
- **Ask GraphQL what it cost.** Include `rateLimit { cost remaining }` in every
  query. It is free and it is the only accurate number.

## Secrets and privacy

- Read the token from the environment or from `gh auth token`. Never from a file
  in the repository. The research checkout here keeps its paths in a `.env` that
  `.gitignore` excludes, which is the right pattern.
- **Do not store email addresses in the output.** Hash them, or map them to a
  stable pseudonym through your `.mailmap`. Author emails are personal data, and
  an analytics file is the wrong place for them.
- Do not write absolute local paths into anything you might publish. Store
  repository-relative paths.
- Give the collector the narrowest token that works. Note that the security
  endpoints in 05-github-security-supply-chain.md
  need `security_events`, which is a real escalation. Consider a second,
  separate token for that job rather than widening the main one.

## Reporting on top

Once the JSON Lines files exist, reporting is a `jq` query away.

```bash
# 90th percentile merge time, last 8 weeks, one repo
jq -r 'select(.repo=="owner/name" and .metric=="pr_merge_hours_p90")
       | [.observedAt, .value] | @tsv' data/gh-prs.jsonl | tail -56
```

Publish the trend, not the value. Every metric in this report is weak as a level
and strong as a direction. "The 90th percentile merge time went from 190 hours to
95" is a result. "The 90th percentile merge time is 95 hours" is trivia.

## Build order

Each step is useful on its own, so stop whenever the next one stops paying.

1. **Traffic snapshot, daily.** Fifteen lines of shell. Starts a clock you can
   never restart later.
2. **Local git metrics, daily.** Churn, hotspots, coupling, ownership. No
   network, no permission, no rate limit.
3. **Pull request percentiles, daily.** One GraphQL call, with the merge-bound
   review filter from 06-delivery-and-collaboration.md.
4. **Security enablement and alert counts, daily.** Cheap, and the first run will
   probably tell you a feature is switched off.
5. **Workflow runs, daily, filtered by event.**
6. **Everything else, weekly or on demand.**

Steps 1 and 2 cover most of the value and take an afternoon.

---

<!-- 11archive-source: 09-limits-and-pitfalls.md -->

# Where these numbers lie

Every measurement in this report is real. Several of them are also easy to
misread, and a few are dangerous when pointed at people. This chapter is the
list of ways the work goes wrong.

## Measurement errors, ranked by how often they happen

**Splitting one person into several.** Observed: four Git identities in a
287-commit repository, two of which shared an email address and differed only by
display name. Every by-author number was wrong by 26 commits until a `.mailmap`
merged them. Fix before anything else.

**Ranking dead code.** Observed: 40 of the 50 highest-churn files no longer
exist. Always intersect churn with `git ls-files`.

**Counting reviews that arrived after the merge.** Observed: median time to
first review moved 2.75 to 2.07 hours and the maximum moved 56,035 to 262 hours
once reviews after `mergedAt` were excluded. Bound every review timestamp.

**Treating a permission error as zero.** Observed: `403` from code scanning,
`404` from dependency graph, and the message "Dependabot alerts are disabled".
None of these mean zero alerts. Store the status code.

**Treating a 202 as an empty result.** Observed: `gh api ... --jq length`
returned `0` on a cold statistics cache. Check status, never body length.

**Letting a bot dominate.** Observed: a release bot with 59 commits touching
every plugin manifest at once, creating a fully connected block of false
temporal coupling. Filter bot authors before any co-change analysis.

**Including merges in churn.** A merge's `--numstat` prints the combined diff and
double-counts. Also the source of a real discrepancy: 25 commits locally, 23 in
GitHub's `stats/contributors`, because that endpoint excludes the 2 merges.

**Counting generated files.** The largest churn entry in the test repository is a
`package-lock.json` at 12,340 lines over 2 commits. Nobody wrote it. Exclude
lock files, bundles, snapshots and vendored directories, and note that
`linguist-generated` in `.gitattributes` changes GitHub's display only, never
`git log --numstat`.

**Reporting a mean.** Observed distributions in this report: file length median
84 and max 1,388; merge time median 20 hours and max 1,247; reviews per pull
request median 1.5 and max 65. Every one is heavily skewed. Report the median
and the 90th percentile.

**Mixing clocks.** Author date is not committer date. GitHub's `punch_card` uses
each commit's own timezone; `participation` uses UTC weeks; other weekly buckets
start Monday. State which one you used.

**Silent truncation.** `reviews(first: 20)` returned 20 nodes for a pull request
whose `totalCount` was 65. `search` caps at 1,000 results whatever `total_count`
says. `stats/contributors` returned exactly 500 rows for a repository with 686
contributors. Compare the count you got against the count the API claims, every
time.

## What these metrics genuinely cannot tell you

- **Whether the code is good.** Every metric here detects smells. A smell is a
  hypothesis to check by reading the code.
- **Whether a file matters.** Size, churn and complexity are not importance. The
  most important file in most systems is small and stable.
- **Whether code runs.** Only coverage and runtime telemetry answer that.
- **Whether a change was worth making.** No repository metric encodes value.
- **Why something is slow.** A 90th-percentile merge time of 191 hours is a
  question, not a diagnosis. The answer is usually a conversation.

## Goodhart's law, concretely

Once a measure becomes a target it stops being a good measure. This is not a
philosophical aside; each of these is a documented, easy, undetectable response
to a metric being watched.

| Metric watched | How it gets gamed | What actually degrades |
| --- | --- | --- |
| Commits per week | split work into tiny commits | history becomes unreadable |
| Lines added | copy instead of extract, verbose style | duplication rises |
| Pull request merge time | approve without reading | defect rate rises |
| Review count | rubber-stamp approvals | review becomes ceremony |
| Test count | many trivial assertions | coverage stays flat, suite slows |
| Issue close time | close and reopen elsewhere | tracking becomes fiction |
| Code coverage percent | tests that execute without asserting | false confidence |

The general defence: use these numbers to find **places to look**, never as
targets, and never in a comparison between individuals. A metric used to decide
where to spend an afternoon survives contact with humans. The same metric on a
leaderboard does not.

## Measuring people

This is the part with legal weight, not only ethical weight.

**Git and GitHub data about individuals is personal data.** Names, email
addresses, timestamps of activity and productivity indicators are identifiable
information about identifiable people. Under the EU and UK General Data
Protection Regulation, processing it needs a lawful basis, a stated purpose,
retention limits and transparency to the people concerned. "It was already in
the commit log" is not a lawful basis for a new purpose such as performance
assessment.

Practical consequences:

- **Say what you are collecting and why, before you collect it.** Retrofitting
  consent does not work.
- **In Germany, Austria, the Netherlands and several other jurisdictions, works
  council co-determination applies** to systems capable of monitoring employee
  performance. A dashboard with per-developer output is such a system, whatever
  you intended.
- **Aggregate by default.** Team-level and repository-level numbers answer almost
  every legitimate question. Per-person numbers answer very few, and those few
  are usually better answered by talking to the person.
- **Never store raw email addresses** in analytics output. Hash them, or map them
  through the `.mailmap` to a stable pseudonym.
- **Cadence is surveillance too.** The commit-hour histogram in
  01-local-git-history.md reveals working patterns,
  including evening and weekend work and, over time, illness and holidays. It is
  a useful signal about **process** ("the team is compensating for something") and
  an inappropriate one about a person.

The one framing that consistently holds up: **these metrics diagnose the system,
not the people in it.** A file with a bus factor of 1 is an organisational risk
to fix by pairing and documentation. It is not a fact about the person who wrote
it.

The SPACE framework, developed by researchers at GitHub and Microsoft, makes the
same argument from the research side: developer productivity is multi-dimensional
(satisfaction, performance, activity, communication, efficiency), no single
metric captures it, and activity metrics such as commit counts are the weakest
dimension while being the easiest to collect. That combination is precisely why
they get misused.

## Coverage and honesty in reporting

Whatever you publish, publish beside it:

- **The population.** Which repositories, which branch, which period.
- **The n.** A percentile over 100 pull requests and over 4 are different facts.
- **The exclusions.** Merges, bots, generated files, and how you identified each.
- **The unavailable ones.** Repositories where the call returned 403 or 404
  belong in the report as unavailable rows, not as absences.
- **The clock.** Author or committer time, and which timezone.

The failure mode this prevents: a report covering 12 of 40 repositories, showing
excellent security posture, because the other 28 returned 403 and were quietly
dropped.

---

<!-- 11archive-source: 10-glossary.md -->

# Glossary

Terms as used in this report. Where a term has a formal source, the source is
named.

## Measurement terms

**Behavioural code analysis.** Studying a codebase through its change history
rather than its current text. The name comes from Adam Tornhill's *Your Code as
a Crime Scene*.

**Blame.** Attributing each surviving line of a file to the commit that last
changed it. `git blame`. It describes the current file only; deleted code has no
owner.

**Bus factor.** How many people would have to leave before knowledge of a piece
of code is lost. Approximated here as the number of files where one author owns
more than 80% of the surviving lines. Also called truck factor.

**Churn.** Lines added plus lines deleted over a period. A measure of activity,
not of quality or value.

**Code age.** Time since a surviving line was last changed. Old and stable is
usually healthy; old inside a hotspot is a warning.

**Code survival.** The share of lines added in a given period that still exist
today. Computed with a Kaplan-Meier estimator, the standard statistical method
for lifetimes when some subjects are still alive. Implemented by
`git-of-theseus` and `hercules`.

**Cohort.** A group of lines defined by when they were added, tracked forward
through time.

**Complexity, cyclomatic.** The number of independent paths through a function.
Roughly one plus the number of branch points. Written CCN in `lizard` output.
Needs a language parser to compute correctly.

**Complexity estimate.** An approximation of the above obtained by counting
branch and loop keywords without parsing. What `scc` reports. Comparable within
one language only.

**COCOMO.** Constructive Cost Model. A formula converting lines of code into an
estimate of person-months. Reported by `scc`. Treat as a curiosity.

**Hotspot.** A file that changes often and is structurally complicated. The
intersection is the point; either signal alone is weak.

**Indentation complexity.** Mean and maximum leading whitespace depth per line,
used as a language-independent proxy for nesting.

**NLOC.** Lines of code excluding comments and blanks.

**Temporal coupling.** Two files repeatedly changing in the same commit.
Suggests a dependency the directory structure does not express. Also called
change coupling or logical coupling.

**ULOC.** Unique lines of code across a project. A whole-repository duplication
signal reported by `scc`.

## Git terms

**Author date and committer date.** The author date is when a change was
written; the committer date is when it landed on this branch. A rebase or
cherry-pick keeps the first and rewrites the second. `%aI` and `%cI` in
`git log --pretty`.

**Blob.** Git's storage object for file contents, identified by a hash of the
content. Two files with the same blob hash are byte-identical.

**Conventional Commits.** A convention where the commit subject starts with a
type, such as `feat:`, `fix:` or `chore:`, optionally with a scope in
parentheses. Turns the log into a labelled event stream.

**mailmap.** A `.mailmap` file at the repository root mapping alternative names
and email addresses onto one canonical identity. Respected by `%aN` and `%aE`,
ignored by `%an` and `%ae`.

**Merge commit.** A commit with two or more parents. Contains no original work in
a standard workflow, and `--numstat` on one double-counts. Excluded throughout
this report with `--no-merges`.

**numstat.** `git log --numstat` output: one line per changed file with lines
added, lines deleted and the path. Binary files print `-` for both counts.

**Rename detection.** Git does not record renames; it infers them by comparing
content at query time. `-M` for renames, `-C` for copies, `--follow` to trace
one file's history across them.

**Shortlog.** `git shortlog` groups commits by author. Reads from standard input
unless given an explicit revision, which makes it silently return nothing in
scripts.

## GitHub terms

**Anonymous contributor.** A commit author whose email matches no GitHub
account. Excluded from `GET /contributors` unless `anon=1` is passed. Observed
here as 304 of 686 contributors on one repository.

**Attestation.** A signed statement that a specific artefact was produced by a
specific workflow from specific source. GitHub's implementation of build
provenance.

**Code scanning.** Static analysis results stored on GitHub, usually produced by
CodeQL. Reading the alerts needs the `security_events` scope.

**Dependabot.** GitHub's dependency alerting and update service. Its alert
endpoint returns an explicit "disabled" message when the feature is off.

**Dependency graph.** GitHub's resolved package list for a repository, built
from manifests and lock files. Its SBOM endpoint returns 404 when the graph is
switched off.

**GHSA and CVE.** GitHub Security Advisory identifier and Common Vulnerabilities
and Exposures identifier. Both appear in the advisory database; an advisory may
have a GHSA without a CVE.

**GraphQL point.** The cost unit for GitHub's GraphQL API. Computed from the
requests the server would have made internally, divided by 100 and rounded.
Budget 5,000 per hour for a user token.

**Linguist.** GitHub's language classifier. Drives the language bar and the
`languages` endpoint, which reports **bytes**, not lines. Controlled per path
with `.gitattributes`.

**Punch card.** A 168-cell grid of commits by weekday and hour. GitHub's version
uses each commit's own recorded timezone.

**Ruleset.** The current mechanism for branch and tag rules on GitHub,
succeeding branch protection. An empty array means none are configured.

**SARIF.** Static Analysis Results Interchange Format. The standard JSON format
GitHub accepts for uploading third-party scanner results into code scanning.

**SBOM.** Software Bill of Materials. A machine-readable list of every package a
project depends on. GitHub emits SPDX 2.3, generated at request time.

**Secondary rate limit.** Limits that apply on top of the hourly request limit:
100 concurrent requests, 900 points per minute on REST, 90 seconds of processing
per 60 seconds of wall clock. Usually the limit a collector hits first.

**202 Accepted.** The status returned by GitHub's statistics endpoints while the
result is being computed in the background. The body is empty. Retry.

## Delivery terms

**Change fail rate.** The share of deployments that need immediate remediation.
One of DORA's five metrics. Not derivable from GitHub data alone; it needs an
incident record.

**Change lead time.** Time from a change being committed to version control
until it is running in production. DORA's definition.

**Cycle time.** Used loosely across the industry. In this report, always stated
explicitly as a pair of endpoints, for example "open to merge" or "open to first
review".

**Deployment frequency.** How many deployments in a period, or the time between
them. DORA.

**DORA.** DevOps Research and Assessment. Publishes the standard delivery
metrics. Current guidance lists five, with "failed deployment recovery time"
replacing the older "mean time to restore".

**Failed deployment recovery time.** How long it takes to recover after a
deployment breaks production. DORA. Replaced MTTR in the current model.

**Deployment rework rate.** The share of deployments that were unplanned
responses to production problems. DORA's fifth metric.

**SPACE.** A framework from GitHub and Microsoft researchers arguing that
developer productivity has five dimensions: satisfaction, performance, activity,
communication and efficiency. Its core claim is that no single metric captures
productivity, and that activity metrics are the weakest while being the easiest
to collect.

**Time to triage.** From issue creation to its first label or assignment.

## Statistical terms as used here

**Coverage.** What share of the intended population a number actually describes.
Always reported beside the number.

**Median, and 90th percentile.** The middle value, and the value below which 90%
of observations fall. Used throughout instead of the mean, because every
distribution measured here is heavily skewed.

**Percentile, linear-interpolated.** When a percentile falls between two
observations, the value is interpolated between them. The method used for every
percentile in this report.

**Proxy.** A measurable stand-in for something you cannot measure directly. The
share of commits typed `fix` is a proxy for defect rate: correlated, not equal,
and gameable.

## Evidence states

Used to label every value in [data.json](data.json).

| State | Meaning |
| --- | --- |
| `observed` | directly measured by running the command shown |
| `source-reported` | stated by documentation, not independently measured |
| `calculated` | derived from observed values by a disclosed formula |
| `unavailable` | expected but not obtainable, with the reason recorded |
| `not applicable` | not meaningful for this row |

---

<!-- 11archive-source: 11-methodology-and-sources.md -->

# Methodology and sources

## What was done

Every quantitative claim in this report was produced by running a command on
2026-08-11 and reading its output. No number is recalled from training data. Where
a claim comes from documentation rather than from a measurement, the chapter says
so and this file cites the page.

## Environment

| Item | Value |
| --- | --- |
| Operating system | macOS, Darwin 24.3.0, arm64 |
| `git` | 2.49.0 |
| `gh` | 2.89.0 |
| `node` | 24.16.0 |
| `jq` | 1.x, system |
| `awk` | BWK awk, the macOS system version, no `strftime` |
| Token scopes | `gist`, `read:org`, `repo`, `workflow` |
| Token scopes **not** held | `security_events`, `admin:org`, enterprise scopes |
| Rate limit at session start | core 5000/5000, graphql 5000/5000, search 30/30, code search 10/10 |

The missing `security_events` scope is why several security endpoints returned
403. That result is reported as a finding rather than worked around, because it
is the state most engineers are in.

## Subjects

| Role | Repository | Scale | Why |
| --- | --- | --- | --- |
| Primary local subject | a private working repository | 287 commits, 1,390 tracked files, 4 raw identities, first commit 2026-03-31 | large enough for real distributions, small enough to verify by hand |
| Local comparison | 17 further repositories in the same working directory | 2 to 287 commits | used only for the repository survey |
| Small GitHub subject | `rj11io/11reports` | 25 commits, public | owned, so traffic and other write-access endpoints could be tested |
| Large GitHub subject | `cli/cli` | over 10,000 commits, 3,132 merged pull requests, 31,382 workflow runs, 45,798 stars, 686 contributors | the only way to trigger the caps and the 422 that small repositories never reach |
| Advisory subjects | `adamtornhill/code-maat`, `electron/electron`, `sigstore/cosign` | n/a | endpoint shape checks only |

Repository and author identities from the private subject are redacted. "Author
A" refers to the same person throughout. No email addresses appear in this
report, deliberately: see 09-limits-and-pitfalls.md.

Directory names from the private subject are also redacted. In the hotspot and
coupling tables, `variant-a` through `variant-c` and `plugin-a` through
`plugin-e` are stable pseudonyms: the same label always means the same real
directory. File names, counts and relationships are unchanged, so the findings
those tables support are intact.

## How each claim was verified

**Local git measurements.** Run directly against a checkout, output read in
full. Cross-checks applied:

- Conventional commit counts: 265 conforming plus 8 nonconforming equals 273,
  which equals 287 total minus 14 merges. Independent arithmetic agreement.
- Lines by extension: per-extension file counts sum to 1,376 and per-extension
  line counts sum to 95,770, both recomputed in a second pass. 14 binary files
  excluded by the filter account for the gap to 1,390 tracked files.
- Identity merge: `shortlog` before the `.mailmap` returned 187 and 26 as
  separate rows; after, 213 as one. 187 plus 26 equals 213.
- Duplicate detection cross-checked two ways: three files reported as identical
  by blob hash `555674e9` also reported identical 1,388-line lengths.

**GitHub measurements.** Called through `gh api`, with `-i` where the status code
was the finding. Cross-checks applied:

- Commit count parity: local `rev-list --count HEAD` 25, `origin/main` 25,
  `GET /commits` paginated 25, `stats/contributors` total 23. The gap of 2
  equals the merge count from `rev-list --count --merges`.
- GraphQL cost: taken from the `rateLimit` block inside each response, not
  estimated. Verified to scale as expected across n=5, 50 and 100.
- The 202 pattern: reproduced by requesting the same endpoint repeatedly and
  recording the status line each time.

**Percentiles.** Computed in Node with linear interpolation between adjacent
order statistics, on sorted arrays with nulls removed. The review-timestamp
correction was computed twice, once unfiltered and once bounded by `mergedAt`,
from the same response, so the two rows are directly comparable.

**Timings.** Measured with the shell's `time` builtin on a warm filesystem
cache, single run each. Treat as indicative to one significant figure.

## What was not verified

Stated plainly, because a report that omits this is less useful.

- **Enterprise features.** Audit log, API insights and Copilot metrics returned
  404 with the available token. Their described behaviour comes from
  documentation only.
- **Tools not installed.** `scc`, `tokei`, `cloc`, `lizard`, `hercules`,
  `code-maat`, `git-of-theseus`, `jscpd`, `gitleaks`, `trivy`, `osv-scanner` and
  OpenSSF Scorecard were **not run**. Everything said about them comes from their
  own documentation and is labelled as such. Nothing was installed on the
  research machine for this report.
- **The stargazers anomaly.** `GET /stargazers` and `GET /subscribers` returned
  200 on an owned repository and 404 on two third-party public repositories with
  the same token. The cause was not established. An unauthenticated control was
  attempted and returned 401 from this network, so no clean baseline exists. The
  finding is reported as observed with the cause unknown.
- **Code scanning alert contents.** Never seen, because no repository available
  to this token had both an analysis and readable alerts.
- **Statistical significance.** None of the distributions here are tested. They
  are descriptions of a specific sample on a specific day, not inferences about
  a population.
- **Cross-platform behaviour.** All commands were run on macOS. The `awk`
  `strftime` note is a real portability finding; other differences may exist on
  Linux and Windows.

## Known limitations

- **Single day.** Every observation is from 2026-08-11. Rate limits, endpoint
  behaviour and GitHub's cached statistics all change.
- **Small primary subject.** 287 commits is enough for the mechanics and too
  small for stable evolutionary statistics. The bus factor result of 110 out of
  110 files reflects a single-maintainer project and should not be read as
  typical.
- **One large subject.** All caps and limits were confirmed against `cli/cli`
  only. A different large repository might behave differently.
- **Percentiles from one 100-item sample.** The pull request numbers describe
  those 100 pull requests. They are an illustration of method, not a benchmark
  for `cli/cli` or anything else.
- **The `event=pull_request` build comparison uses two different windows** (24
  hours unfiltered, 4 days filtered) because the sample size is fixed at 100 in
  both. The point of that table is the difference in shape, not a like-for-like
  rate comparison.

## Sources

House contract for report structure and presentation, read before writing:

- 11agi core reports manager, reporting best practices, datavis best practices,
  and reports styleguide skills, from the configured 11agi checkout.

GitHub documentation, all fetched 2026-08-11:

- [REST API: repository statistics](https://docs.github.com/en/rest/metrics/statistics)
  for the five statistics endpoints, the 202 caching behaviour, the 10,000-commit
  limits and the week and timezone definitions.
- [REST API: rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
  for every primary and secondary limit quoted.
- [GraphQL: resource limitations](https://docs.github.com/en/graphql/overview/resource-limitations)
  for the point formula, the 1-to-100 page bound and the 500,000-node cap.
- [REST API: traffic](https://docs.github.com/en/rest/metrics/traffic)
  for the 14-day retention and the write-access requirement.
- [REST API: Copilot metrics](https://docs.github.com/en/rest/copilot/copilot-metrics)
  for scopes, permissions, the 2025-10-10 start date and the one-year retention.

Tools and methodology:

- [OpenSSF Scorecard](https://github.com/ossf/scorecard) for the check list, the
  risk weighting and the three ways to run it.
- [scc](https://github.com/boyter/scc) for its outputs, its complexity estimate
  method and its export formats.
- [lizard](https://github.com/terryyin/lizard) for its metrics, language list and
  default thresholds.
- [hercules](https://github.com/src-d/hercules) for its analyses, output formats
  and the memory limitations quoted.
- [git-of-theseus](https://github.com/erikbern/git-of-theseus) for code survival,
  the Kaplan-Meier method and its commands.
- [code-maat](https://github.com/adamtornhill/code-maat) and Adam Tornhill,
  *Your Code as a Crime Scene* (Pragmatic Bookshelf), for hotspots, temporal
  coupling and the behavioural analysis framing.
- [DORA: the software delivery metrics](https://dora.dev/guides/dora-metrics-four-keys/)
  for the current five-metric model and the rename of mean time to restore.

The SPACE framework is cited from its published description by researchers at
GitHub and Microsoft; the original paper was not fetched for this report and the
citation is second-hand.

## Reproducing this

Every command appears in the chapter that uses it. To repeat the local half on
your own repository, nothing beyond `git` and `awk` is needed. To repeat the
GitHub half, `gh auth login` and a token with `repo` is enough for everything
except the security endpoints, which additionally need `security_events`.

Expect different numbers. The method is the transferable part.

## Artifacts

| File | Contents |
| --- | --- |
| `README.md` and chapters `00` to `11` | the report |
| `data.json` | every measurement in machine-readable form, with its evidence state |
| `report.html` | all chapters rendered as one self-contained page |

`data.json` carries the same facts as the Markdown, with units, provenance and
evidence state attached to each. The HTML adds navigation and table interaction;
it adds no information the Markdown does not have.
