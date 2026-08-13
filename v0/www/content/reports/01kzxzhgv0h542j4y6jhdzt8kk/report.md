<!-- 11archive-source: README.md -->

# Google's Open Knowledge Format: A Working Reference

A technical reference for the Open Knowledge Format (OKF), the specification Google
Cloud published for writing down what an organisation knows in a form AI agents can
read. It covers what the specification says, what its own example bundles reveal when
you measure them, and how to write the YAML frontmatter it depends on.

## Read this first

**The live specification is version 0.2, and roughly half of it has no working
implementation.**

Version 0.2 replaced v0.1 on 2026-07-24 and added provenance, trust, freshness,
lifecycle, and attested computations. Measured across everything Google ships:
`verified`, `stale_after`, and `Attested Computation` appear only in the one bundle a
human wrote by hand, and no code in the reference implementation reads any of the five
attestation fields.

The specification is a serious document worth reading. The tooling implements the v0.1
subset. Plan to build the v0.2 half yourself.

## How to read this report

| If you want | Read |
|---|---|
| The short version | 00 Executive brief |
| To understand the format | 01 The format |
| Every field, precisely | 02 Frontmatter reference |
| How trust works | 03 The trust model |
| The attestation design | 04 Attested computations |
| **YAML frontmatter and its pitfalls** | 05 YAML frontmatter best practices |
| What the audit found | 06 Conformance audit |
| How it compares to alternatives | 07 How OKF compares |
| Whether anyone uses it | 08 Adoption and reception |
| To adopt it | 09 Adoption playbook |
| Definitions | 10 Glossary |
| How this was checked | 11 Methodology and sources |

## What is original here

Two things in this report are not available anywhere else.

**A measured audit of Google's own bundles.** All 78 Markdown files in the four official
example bundles were parsed with the same code OKF's reference implementation uses, and
checked against the specification. All 53 concepts pass the conformance test. Eight
distinct findings sit above it, including a conformant file that crashes the reference
viewer and a round trip that turns an unchanged file into a 52-line diff. Details in
06.

**A YAML frontmatter guide grounded in measured parser behaviour.** The differences
between YAML 1.1 and 1.2 were measured directly rather than quoted, because the
divergences are the reason frontmatter breaks. Of twelve cases tested, six give
different answers depending on which library reads the file. The sharpest example is
inside Google's own repository, which ships two implementations that disagree about where
a frontmatter block ends. Details in
05.

## Scope

**Covered:** the specification text section by section, the complete frontmatter field
surface, the trust model, attested computations, YAML frontmatter practice, a
conformance audit of the shipped bundles, comparison with adjacent formats, and what
can be established about adoption.

**Not covered:** running the reference attester, which needs billed BigQuery
credentials. Any production OKF bundle, none of which were available to examine.
Commercial terms for Google's Knowledge Catalog product.

Evidence boundary: the specification, reference implementation, and four sample bundles
at commit `374e0bc`, plus public secondary coverage read on 2026-08-13. Limitations are
listed in full in 11.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The finding that changes what you do next

**Half of OKF v0.2 has no working implementation, including the feature it was
announced for.**

Version 0.2 added five things: provenance, trust, freshness, lifecycle, and attested
computations. Measured across the four bundles and the reference code Google ships:

- `verified`, `stale_after`, and `Attested Computation` appear **only** in the single
  bundle a human wrote by hand. Across the 44 concepts Google's own agent generated,
  the count for each is zero.
- **No code anywhere in the reference implementation reads `runtime`, `parameters`,
  `computation`, `executor`, or `attester`.** That is the whole of specification
  section 10, roughly 180 lines of specification and zero lines of implementation.

The specification is a serious document. The tooling is a demonstration of the v0.1
subset. Adopt v0.2 expecting to build the v0.2 half yourself.

## What OKF is, in one paragraph

A way to write down what an organisation knows so both people and AI agents can read it.
The format is a directory of Markdown files, each starting with a small block of
structured labels in YAML. One label, `type`, is required. Everything else is optional.
There is no runtime, no SDK, and no registry. A valid OKF file can be four lines long.

## The ten findings

1. **Half of v0.2 has no producer, and its marquee feature has no implementation at
   all.** As above. (06)

2. **Two Google implementations in one repository disagree on where a file's metadata
   ends.** The Python reference matches the closing `---` after trimming whitespace; the
   TypeScript tool in `toolbox/mdcode` matches it exactly. Give both the same file with
   an indented `---` inside a text block and one sees a truncated header with a field
   silently missing, the other sees the whole thing. Same bytes, two different
   documents, same repository. (05)

3. **One conformant file crashes the reference viewer.** Write `stale_after` as a full
   timestamp rather than a plain date and `is_stale()` raises `TypeError`, because in
   Python a `datetime` passes an `isinstance(..., date)` test and then cannot be compared
   with one. The function has a fallback intended to degrade gracefully; that fallback is
   unreachable. The viewer calls it unguarded, so the whole build dies on one file.
   (06)

4. **OKF is the on-disk format for a Google Cloud product, which the "vendor-neutral"
   framing omits.** It lives in the `knowledge-catalog` repository: Knowledge Catalog,
   formerly Dataplex. The repository ships `push.ts`, `pull.ts`, and a custom aspect
   definition that round-trip bundles into that product. The format really is readable
   without Google tooling. It is also a commercial interchange format, and both are
   true. (08)

5. **The recommended link style produces no graph edges in Google's own viewer.**
   Section 6.1 recommends starting links with `/`. The viewer explicitly skips every
   such link. The reference agent's prompt says "Never start a link with `/` (that
   breaks GitHub rendering)". Three parts of one project, three positions.
   (06)

6. **All four example bundles pass the conformance test, and all contain defects.**
   Section 11 has three rules, so failing is nearly impossible, and it then forbids
   consumers from rejecting a bundle for anything. It is a producer-side checklist, not
   a gate. You need your own validator. (06)

7. **The reference implementation rewrites files it reads.** Parsing and re-serialising
   one unchanged file produces a 52-line diff: compact YAML expanded, lines re-wrapped,
   `2026-06-30T14:00:00Z` rewritten to `2026-06-30 14:00:00+00:00`. The damage is silent
   and happens once, after which the file round-trips stably. For a format whose stated
   goal is being diffable in version control, the shipped writer is the wrong tool.
   (06)

8. **Nothing is signed.** `verified: { by: human:alice }` is editable text. No signature,
   hash, or key appears anywhere in v0.2. Trust in a bundle is exactly trust in wherever
   it is stored. The specification says so itself: trust tiers are "advisory signals, not
   access control". (04)

9. **YAML's type guessing is the practical hazard, but it bites your tooling, not your
   model.** An agent reads raw bytes and never sees `NO` become `false`. Validators,
   viewers, indexers, and servers do. Of twelve frontmatter cases tested, six parse
   differently depending on the library. Google's own bundles disagree with themselves:
   the hand-written one leaves timestamps bare and gets `datetime` objects, the three
   generated ones quote them and get strings.
   (05)

10. **Attested computations remain the real contribution, unimplemented or not.**
    Restricting an agent to filling declared parameter holes, then having deterministic
    no-model code confirm the sanctioned calculation is what ran, has no close equivalent
    in any adjacent format. The one shipped attester compares queries symbolically and
    trusts the executor to bind parameters, so an agent running the sanctioned query for
    the wrong year still passes. (04)

## What to do

**If you are evaluating OKF:** read the specification, not the coverage. It is one file
and about an hour. Then read `okf/bundles/acme_retail/`, the only bundle that exercises
v0.2, and treat everything in it as a specification illustration rather than as
something the tooling produces.

**If you are adopting it:** the format is cheap and low-risk. Your knowledge stays as
Markdown in a directory whether OKF succeeds or not, so trying it and walking away costs
almost nothing. That asymmetry is a better argument than any adoption statistic.

Before you have 400 files, do three things:

- **Write a validator.** Conformance will not catch your mistakes. Start with: `tags` is
  a list, timestamps are quoted, path values resolve, no duplicate keys, and
  `stale_after` is a plain date and not a timestamp.
- **Decide how files get written.** If agents will edit your bundle, use a YAML library
  that preserves formatting (`ruamel.yaml` in round-trip mode), or standardise on block
  style everywhere. Choosing neither means every automated edit produces an unreadable
  diff.
- **Quote every date and timestamp.** One quote character decides whether your reader
  gets text or a date object, and one of those crashes the reference helper.

**If you want attested computations:** the design is sound and nothing implements it.
Budget for writing the executor and the attester, and check parameter values, which the
example attester does not.

**If you need cryptographic guarantees, column-level lineage, or a validator you did not
write:** wait. All three are missing, and two are explicitly deferred.

## What this report does not claim

Two things worth stating, because an earlier draft of this research got them wrong.

**The published record is not stale.** Google announced v0.2 on the day it landed, and
Search Engine Journal, Open Source For You, and others covered it within a week. June
articles describe v0.1 because v0.2 did not exist yet, and at least one June guide has
since been revised. Some third-party *tools* still implement v0.1; the *coverage* is
current.

**The sample defects are not conformance violations.** The `tags`-as-a-string files and
the timestamp typing split break no rule in the specification. They are interoperability
traps, which is a different and more useful complaint.

## Confidence

Findings 1, 2, 3, 5, 6, 7, and 9 were measured directly against the specification and
the shipped code, and are reproducible from
11-methodology-and-sources.md. Finding 4 rests on
reading the repository. Statements about what could not be found, in
08, rest on searches returning nothing, which is weaker
evidence and is labelled as such.

---

<!-- 11archive-source: 01-the-format.md -->

# The format

## What OKF is

The Open Knowledge Format (OKF) is a way to write down what an organisation knows,
in files that both people and software can read. Google Cloud published it. The whole
format is one idea: **a folder of Markdown files, each with a small block of
structured labels at the top.**

That label block is called YAML frontmatter. Section 05
covers it on its own, because it is where most of the practical difficulty lives.

Here is a complete, valid OKF file. Nothing is omitted:

```markdown
---
type: Metric
---

Gross margin is revenue minus the full cost of goods sold.
```

One label, `type`, is required. Everything else is optional. That is the entire
mandatory surface of the format.

## The problem it is meant to solve

An AI agent asked "how do we compute weekly active users?" has to assemble the answer
from a metadata catalog, a wiki, a dashboard description, some SQL comments, and a
person on Slack. Each of those systems stores its knowledge in its own shape, behind
its own API. Nothing moves between them.

OKF's bet is that the shared shape should be the most boring one available: text files
in a directory. The spec puts it plainly in its opening section:

> "If you can `cat` a file, you can read OKF; if you can `git clone` a repo, you can
> ship it."

`cat` is the standard command for printing a file to the screen. The point is that no
software needs to be installed to read the format.

## Four properties the spec is optimising for

Section 1 of the spec lists what it wants knowledge to be. Each one is a design
constraint, not a slogan:

| Property | What it rules out |
|---|---|
| **Readable** by people without tooling | Binary formats, database-only storage |
| **Parseable** by agents without a vendor SDK | Proprietary APIs, custom clients |
| **Diffable** in version control | Anything where a one-word edit rewrites the file |
| **Portable** across tools, organisations, and time | Formats tied to one product's lifetime |

"Diffable" means you can see, line by line, what changed between two versions. Git
does this for text and cannot do it for a database row. Section
06 shows a case where OKF's own tooling breaks this
property.

## The five questions v0.2 added

Version 0.1 stopped at "markdown plus labels". Version 0.2 argues that once agents,
not people, are writing most of the corpus, a reader needs five more answers. The
spec lists them:

1. What was this created from, and how was it verified? (**provenance**)
2. How much should I trust it? (**trust**)
3. Is it still true? (**freshness**)
4. Is it the current version? (**lifecycle**)
5. Was this number produced the way we said it must be? (**attestation**)

Each got its own frontmatter fields. Section
03 covers the first four. Section
04 covers attestation, which is the largest and most
novel addition.

## Vocabulary

The spec defines these terms in section 2. They are used throughout this report.

| Term | What it means |
|---|---|
| **Bundle** | A directory of knowledge files. The unit you ship. |
| **Concept** | One unit of knowledge, stored as one Markdown file. |
| **Concept ID** | The file's path inside the bundle, minus the `.md` ending. |
| **Frontmatter** | The YAML label block at the top of the file, fenced by `---`. |
| **Body** | Everything after the frontmatter. |
| **Link** | An ordinary Markdown link from one concept to another. |
| **Source** | Material a concept was derived from, recorded in `sources`. |
| **Actor** | Who or what did something, written as `human:alice`, `process:nightly`, or `agent_name/version`. |
| **Trust tier** | A level a reader works out from the `verified` field. Not stored. |
| **Attested Computation** | A concept holding the one blessed way to calculate a number. |
| **Receipt** | Evidence returned by running a computation. Never stored in the bundle. |
| **Attester** | Plain code, no AI model, that checks a receipt and returns pass or fail. |

## What a bundle looks like

The directory layout is entirely up to the producer. The spec fixes only two
filenames:

```
bundle/
  index.md          # optional. Lists what is in this directory.
  log.md            # optional. History of changes.
  tables/
    index.md
    orders.md       # a concept
  metrics/
    revenue.md      # a concept
```

`index.md` and `log.md` are reserved. Every other `.md` file is a concept.

`index.md` exists for what the spec calls **progressive disclosure**: letting a reader
see what is available before opening anything. This matters for AI agents, which have
a limited amount of text they can hold at once. An agent reads the index, then opens
only the two files it needs, instead of loading all 400.

## Concepts link to each other

Relationships are plain Markdown links:

```markdown
Joined with [customers](/tables/customers.md) on `customer_id`.
```

A link means "these two things are related". The format deliberately does not record
*how* they are related. That is left to the surrounding sentence. A tool drawing a
picture of the bundle treats every link as a plain arrow.

Two link styles are allowed. A path starting with `/` is measured from the bundle
root, and the spec recommends it because the link survives a file being moved. A path
like `./other.md` is measured from the current file.

Broken links are explicitly fine. The spec says a link to a file that does not exist
"may simply represent not-yet-written knowledge". A reader must not reject the bundle
over it.

## What the format refuses to do

The spec's non-goals are as informative as its goals:

- It will not define a fixed list of concept types. You invent your own `type` values.
- It will not tell you where to store or how to serve bundles.
- It will not replace schema formats like Avro, Protobuf, or OpenAPI. It points at
  them.
- It will not say how the code behind a computation is packaged. It fixes the
  interface only.

The consistent theme: OKF standardises the smallest thing that makes a pile of files
self-describing, and stops.

## Sources

- OKF v0.2 specification, sections 1 to 3, 6:
  [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Repository README:
  [okf/README.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md)

---

<!-- 11archive-source: 02-frontmatter-reference.md -->

# Frontmatter field reference

Every field OKF v0.2 defines, what it holds, and what a reader is supposed to do with
it. Field names are exactly as the spec writes them. "Reader" here means any program
consuming a bundle: an agent, a search index, a viewer.

## The complete field list

| Field | Section | Status | Value |
|---|---|---|---|
| `type` | 4.1 | **Required** | Short string naming the kind of concept |
| `title` | 4.1 | Recommended | Display name for people |
| `description` | 4.1 | Recommended | One sentence |
| `resource` | 4.1 | Recommended | Address of the real thing being described |
| `tags` | 4.1 | Recommended | **List** of short strings |
| `sources` | 5.1 | Optional | List of materials this was derived from |
| `usage_window` | 5.1 | Optional | `{ from, to }` dates framing every `usage_count` |
| `generated` | 5.2 | Optional | `{ by, at }`. Who wrote the current content |
| `verified` | 5.2 | Optional | List of `{ by, at }`. Who confirmed it |
| `status` | 5.4 | Optional | `draft`, `stable`, or `deprecated` |
| `stale_after` | 5.5 | Optional | Date after which the content is stale |
| `runtime` | 10.2 | **Required** for `Attested Computation` | How to run the computation |
| `parameters` | 10.2 | Optional | List of `{ name, type, required }` |
| `computation` | 10.2 | Optional | Path to a file holding the computation |
| `executor` | 10.2 | Optional | `{ resource, receipt }`. How to run it |
| `attester` | 10.2 | Optional | `{ resource }`. Code that checks the run |
| `okf_version` | 12 | Optional | Only in a bundle-root `index.md` |
| `timestamp` | 13.1 | **Retired** | v0.1 field, replaced by `generated.at` |

Producers may add any other key they like. Readers must not reject a file for a key
they do not recognise, and should keep unknown keys when they rewrite a file.

## `type`, the only required field

```yaml
type: BigQuery Table
```

There is no central register of type names. You pick your own. The spec's examples
are `BigQuery Table`, `BigQuery Dataset`, `API Endpoint`, `Metric`, `Playbook`,
`Reference`, and `Attested Computation`.

Readers **must** cope with a type they have never seen, normally by treating it as a
generic concept. This is what keeps two organisations' bundles mutually readable when
their vocabularies differ.

The four bundles Google ships use seven type values between them, across 53 concepts:

| Type | Count |
|---|---|
| `BigQuery Table` | 22 |
| `Reference` | 20 |
| `Metric` | 3 |
| `BigQuery Dataset` | 3 |
| `Attested Computation` | 2 |
| `Policy` | 2 |
| `Skill` | 1 |

## `resource`, the pointer to the real thing

```yaml
resource: https://bigquery.googleapis.com/v2/projects/acme/datasets/sales/tables/orders
```

`resource` identifies the actual asset the file talks about. A concept describing an
abstract idea, say a business definition of "active user", has no `resource` and
leaves it out.

## `tags` is a list, and this trips people up

The spec says `tags` is "a YAML list of short strings". Both of these are lists:

```yaml
tags: [finance, revenue, attested]     # inline
```

```yaml
tags:                                   # one per line
  - finance
  - revenue
```

This is **not** a list, though it looks like one:

```yaml
tags: finance, revenue, attested        # one 39-character string
```

Eight files in Google's own Stack Overflow bundle make this mistake. Section
06 has the details and the consequence.

## `sources`, where the content came from

```yaml
sources:
  - id: rev-policy
    resource: https://wiki.acme/finance/revenue-recognition
    title: Revenue recognition policy
    author: team:finance-fpa
    usage_count: 5000
    last_modified: 2026-06-18
usage_window: { from: 2026-06-01, to: 2026-06-30 }
```

Inside each entry:

| Key | Status | Meaning |
|---|---|---|
| `resource` | **Required** | The source, or a description of a group of sources |
| `id` | Optional | Stable key used to cite this source from the body |
| `title` | Optional | Human-readable label |
| `author` | Optional | Who produced the source. An authority signal |
| `usage_count` | Optional | How often the source was used. A liveness signal |
| `last_modified` | Optional | When the source last changed. A recency signal |

`resource` does not have to be a followable link. It may also name a population, for
example `all queries in BigQuery project X`.

### Citing one specific claim

Attribution to a single sentence uses a Markdown footnote whose label matches a
source's `id`:

```markdown
The `events_` table is sharded daily as `events_YYYYMMDD`.[^ga4-schema]

[^ga4-schema]: GA4 BigQuery Export schema
```

The label is the join key. A reader resolves the citation by matching `ga4-schema`
against `sources[].id`, not by reading the footnote text.

The spec explains why labels are names and not positions like `sources[0]`: agents
constantly rewrite these files, and "a positional index misattributes silently the
moment the list is reordered".

### The three credibility signals

OKF records facts about a source and refuses to record a verdict. The spec's reasoning
is that a credibility score "is subjective, unportable across consumers, and goes
stale". A reader works out trust for itself from `author`, `usage_count`, and
`last_modified`.

The spec then undercuts one of its own signals. On `usage_count`:

> "Consumers SHOULD read it as liveness and trend, not as a score."

A scheduled query firing every hour and a person deliberately opening a dashboard both
increment it, and they do not mean the same thing. Treat it as alive-or-dead and
order-of-magnitude only.

## `generated` and `verified`, kept deliberately apart

```yaml
generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }
verified:
  - { by: human:ahormati, at: 2026-06-25T09:00:00Z }
  - { by: process:finance-nightly, at: 2026-06-26T02:00:00Z }
```

`generated` says who wrote the current text. `by` is required inside it. `at` marks
the last real change.

`verified` says who checked the text against its sources. It is a list, so a human
sign-off and a nightly automated check can both be recorded. "How recently was this
verified" is the latest `at`.

The two are independent on purpose. Content can change without anyone re-checking it,
and a fact can be re-checked without the text changing.

A single verifier may skip the list dash. Readers **must** treat this as a
one-item list:

```yaml
verified: { by: human:ahormati, at: 2026-06-25T09:00:00Z }
```

### Actor names

Three shapes, from section 7:

| Shape | Example | Use |
|---|---|---|
| `<producer>/<version>` | `reference_agent/gemini-2.5-pro` | Agents and tools |
| `human:<id>` | `human:ahormati` | People |
| `process:<id>` | `process:finance-nightly` | Automated jobs |

The `human:` prefix is load-bearing. Trust tiers key off it, so producers **must** use
it for anything a person wrote or confirmed.

## Trust tiers are calculated, never stored

A reader derives one of three levels from `verified`:

| `verified` contains | Tier |
|---|---|
| Nothing (key absent) | **unverified** |
| Only non-`human:` actors | **machine-confirmed** |
| At least one `human:` actor | **human-reviewed** |

Two constraints matter. A file with no trust information at all is still perfectly
readable and **must not** be rejected. And tiers are advice, not permission: the spec
states they "are not access control".

## `status` and `stale_after`

```yaml
status: stable        # draft | stable | deprecated
stale_after: 2026-09-23
```

`status` missing means `stable`. `deprecated` means the file is kept so old links and
old reports still work, but it is no longer current.

`stale_after` is an absolute date, never a duration like "90 days". The spec explains
why: an absolute date "keeps the staleness decision a plain date comparison with no
reference to when the concept was read". A concept is stale when today's date is on or
after it.

## Fields for Attested Computation

Only for files with `type: Attested Computation`. Section
04 explains how they fit together.

| Field | Status | Meaning |
|---|---|---|
| `runtime` | **Required** | `bigquery`, `dbt`, `python`, `postgres`, `Looker`, and so on |
| `parameters` | Optional | The typed holes an agent may fill: `{ name, type, required }` |
| `computation` | Optional | Path to the computation, instead of writing it in the body |
| `executor.resource` | Optional | Instructions or code that runs it |
| `executor.receipt` | Optional | Which fields a run must return as evidence |
| `attester.resource` | Optional | Plain code that inspects the receipt and returns a verdict |

`runtime` does more work than it appears to. It decides what `parameters` mean: a
parameter is a SQL bind variable under `bigquery`, a variable under `dbt`, and a
function argument under `python`.

## Conformance, stated exactly

A bundle conforms to v0.2 when three things hold, per section 11:

1. Every non-reserved `.md` file has a YAML frontmatter block that parses.
2. Every one of those blocks has a non-empty `type`.
3. Any `index.md` and `log.md` present follow sections 8 and 9.

That is all. A reader **must not** reject a bundle for:

- missing optional fields
- a `type` value it does not recognise
- extra frontmatter keys it does not recognise
- broken cross-links
- missing `index.md` files

The format is deliberately hard to fail.

## Sources

- OKF v0.2 specification, sections 4, 5, 7, 10, 11, 12, 13:
  [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Type counts measured across the four bundles in
  [okf/bundles/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf/bundles).
  Method in 11.

---

<!-- 11archive-source: 03-the-trust-model.md -->

# The trust model

Section 02 lists the fields. This section explains how
they work together, and what the model can and cannot tell you. Skip it if you only
need the field names.

## The design principle: absence means something

Every trust field in OKF is optional. That sounds like it weakens the model. It is
actually the point. Spec section 5:

> "All are optional. Their absence carries meaning: an unverified concept is
> distinguishable from a verified one, but is never rejected."

So a bundle where half the files carry no `verified` key is not a broken bundle. It is
a bundle telling you, accurately, that half of it has never been checked. A format
that required the field would have forced producers to write something, and what they
would write is noise.

This is the single best decision in v0.2. Compare it with metadata systems that demand
an owner and a description for every asset: they get an owner and a description for
every asset, and none of them mean anything.

## Four questions, four fields

| Question | Field | Answer shape |
|---|---|---|
| Where did this come from? | `sources` | List of materials, with signals |
| Who wrote it, and when? | `generated` | One actor plus a timestamp |
| Who checked it, and when? | `verified` | List of actors plus timestamps |
| Is it still current? | `status`, `stale_after` | A state, and a date |

The split between `generated` and `verified` is the one to internalise. Who *wrote*
something is not who *confirmed* it. An agent writes; a person confirms. Content can
change without re-confirmation, and a fact can be re-confirmed without the text
changing. Two fields, because they move independently.

## Trust tiers: derived, never written

A reader works out one of three levels from `verified`:

```
no verified key          -> unverified
only process:/agent      -> machine-confirmed
at least one human:      -> human-reviewed
```

Nobody writes `trust_tier: human-reviewed` into a file. It is calculated on read, which
means it cannot go stale and cannot be inflated by a producer who wants their bundle to
look good.

The same reasoning drives the `sources` credibility signals. OKF records `author`,
`usage_count`, and `last_modified`, and refuses to record a score. The spec's argument:
a score "is subjective, unportable across consumers, and goes stale". Your finance team
and your marketing team should be free to weigh the same signals differently.

## Reading the signals honestly

`usage_count` is the weakest of the three, and the spec says so:

> "Consumers SHOULD read it as liveness and trend, not as a score."

A scheduled query firing hourly and an analyst deliberately opening a dashboard both
increment it. Use it for two things only: is this source alive or dead, and is it
trending up or down against its own history. Do not rank two different kinds of source
against each other with it.

`usage_count` also needs `usage_window` to mean anything. 5,000 uses over a week and
5,000 over three years are different facts. `usage_window` is written once next to
`sources` and applies to all of them:

```yaml
sources:
  - id: exec-rev-dash
    resource: dashboards/exec-revenue
    usage_count: 5000
    last_modified: 2026-06-18
usage_window: { from: 2026-06-01, to: 2026-06-30 }
```

## Freshness is a plain date comparison

`stale_after` holds an absolute date, never a duration. Section 5.5 explains why:

> "An absolute date, not a relative TTL, keeps the staleness decision a plain date
> comparison with no reference to when the concept was read."

A duration like "valid for 90 days" needs a start date, and the obvious candidate,
`generated.at`, is wrong: a definition can be rewritten for clarity without its review
deadline moving. An absolute date sidesteps all of it. A concept is stale when today is
on or after the date. That is the whole rule.

In practice, set `stale_after` to your actual review cycle. `acme_retail` sets
`2026-12-31` on its revenue concepts and explains why in the body: the
revenue-recognition policy is reviewed annually.

## Deprecation keeps the link working

`status: deprecated` means "kept for links and history; no longer current". This is
better than deleting the file, and `acme_retail` shows the pattern properly.

`metrics/gross-margin-legacy.md` is a retired definition. It stays in the bundle,
marked deprecated, with a body that says exactly why:

> "This concept is preserved so historical reports written before 2026-02-01 remain
> reproducible. Do not reference it for new work."

The current definition links back to it. A reader chasing an old report's number finds
the definition that produced it, correctly labelled as retired. Deleting the file would
have turned that into a dead end.

## Lineage is a link, not a field

OKF has no `derived_from` field. When a source's `resource` points at another concept
in the same bundle, the connection already exists as a link in the graph. A reader that
wants to trace further follows it and reads that concept's own `sources`.

The spec is candid that this stops early. Deeper lineage, meaning an explicit external
`derived_from` or column-level data lineage, is "out of scope for v0.2". If you need to
know which upstream table a number came from, OKF will not tell you.

## What this model does not do

Three honest limits.

**Nothing is signed.** Every field here is editable text. `verified: human:ahormati`
proves nothing on its own. Integrity comes from wherever the bundle lives: a Git
repository with protected branches and required review makes those lines meaningful,
and a downloaded tarball does not. Section 04 covers
this at length.

**Trust tiers are not permissions.** Section 5.3 states it outright: they "are advisory
signals, not access control". Do not build authorisation on them.

**Nothing enforces freshness.** `stale_after` is a date in a file. Something has to
actually check it and act. The spec tells readers they SHOULD "warn or refuse when
`today >= stale_after`", but no shipped tool does this for you.

## Using it day to day

A short version for a team adopting v0.2:

- Write `generated` on everything. It is cheap and it is the field readers use most.
- Write `verified` only when a real check happened. An empty `verified` is more useful
  than a fake one.
- Use the `human:` prefix accurately. Trust tiers depend on it and nothing validates it.
- Set `stale_after` from your review cycle, not from a guess.
- Deprecate rather than delete.
- Add `usage_window` whenever you add `usage_count`, or the number means nothing.

## Sources

- OKF v0.2 specification, sections 5, 7, 13:
  [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Deprecation example:
  [okf/bundles/acme_retail/metrics/gross-margin-legacy.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/bundles/acme_retail/metrics/gross-margin-legacy.md)

---

<!-- 11archive-source: 04-attested-computations.md -->

# Attested computations

The largest addition in v0.2, and the part of OKF with no real equivalent in other
knowledge formats. It deserves its own section because it is also the part most likely
to be misread as stronger than it is.

## The problem in one sentence

An agent asked "what was revenue last year?" can write its own SQL, run it, and report
a number that looks authoritative and is wrong.

Provenance fields answer "where did this text come from". They do not answer "was this
*number* produced the way Finance says it must be". Attestation is OKF's answer to the
second question.

## The shape of the answer

A sanctioned calculation becomes its own file, with `type: Attested Computation`. Any
concept that needs the number links to it.

```markdown
---
type: Attested Computation
title: Revenue for fiscal year
runtime: bigquery
parameters:
  - { name: year, type: integer, required: true }
executor:
  resource: skills/run-on-bq.md
  receipt: [job_id, executed_sql, result]
attester:
  resource: attesters/sql_equality.py
---

# Computation

    SELECT SUM(amount) AS revenue
    FROM finance.recognized_revenue
    WHERE fiscal_year = @year
```

The rule that makes the whole thing work is one sentence in section 10.3:

> "The agent MAY only supply *values* for the declared `parameters`; it MUST NOT author
> or edit the computation."

The agent's entire freedom is filling `year`. Everything else is fixed. That turns
"did the agent do the right thing?" from a judgement call into a string comparison.

## Why a computation is a separate file

Section 10.1 gives three reasons, and they are good ones:

1. **`runtime` decides what `parameters` mean.** A parameter is a SQL bind variable
   under `bigquery`, a variable under `dbt`, a function argument under `python`.
   Keeping them in one file makes the meaning obvious.
2. **One computation, many users.** The same revenue calculation can back a metric, a
   dashboard, and a report. Define once.
3. **Trust is per calculation.** Revenue, profit, and margin each go stale on their own
   schedule and each need their own sign-off.

The practical effect: revenue can be fresh while profit is past its `stale_after`, and
one reader reaches two different verdicts in the same session.

## The six steps of a run

Section 10.5, which the spec marks as explanatory rather than binding:

| Step | What happens |
|---|---|
| 1. Discover | Reader finds the file, by type or by following a link |
| 2. Load | Contract from frontmatter, calculation from the body or the `computation` file |
| 3. Parameterise | Agent supplies values for declared parameters, nothing else |
| 4. Execute | The executor runs it and returns a **receipt** |
| 5. Attest | Plain code checks the receipt and returns pass or fail |
| 6. Gate | Refuse to show a failing result. Warn when past `stale_after` |

The receipt and the verdict are runtime objects. The spec is explicit that they are
**not** stored in the bundle.

## What the reference attester actually does

`acme_retail/attesters/sql_equality.py` is the only working attester Google ships. It
is 120 lines of plain Python. Its own docstring states the rules: "Never uses an LLM.
Never makes network calls. Safe to run consumer-side."

It checks two things:

1. **Provenance.** The SQL that ran, from `receipt.executed_sql`, equals the sanctioned
   SQL after stripping comments, collapsing whitespace, and uppercasing keywords.
2. **Fidelity.** The value about to be shown to the user equals the first cell of
   `receipt.result`.

Fidelity is the underrated half. It catches the case where the right query ran and the
agent then mistyped the number into its prose.

## Three limits worth knowing before you rely on this

### Limit 1: the reference attester does not check parameter values

Section 10.3 describes the check like this:

> "Binding `computation` with the parameter values into the executable artifact is the
> consumer's job, and the attester independently re-derives that same binding to
> compare against what actually ran."

The reference attester does not do that. Its docstring says:

> "Named bind variables (@name) are compared symbolically; their values are not
> inspected here (the executor is trusted to bind)."

So an agent that runs the sanctioned query with `year = 2019` and presents the result
as fiscal year 2026 **passes attestation**. The SQL text matches. Nothing compares the
parameter value to the claim in the prose.

This is a gap between what the spec describes and what the shipped code does, not a
flaw in the idea. But if you adopt OKF, do not assume the reference attester closes it.

### Limit 2: SQL text equality cannot see a changed dependency

Section 10.3 claims the comparison catches "a rewritten query, a swapped computation
file, or a mutated dependency".

The first two, yes. The third does not follow for the BigQuery case. If
`finance.recognized_revenue` is a view and somebody changes its definition, the SQL
text is byte-identical and the attester passes. The number changes; the check does not
notice.

For `dbt`, where the receipt carries `compiled_sql`, a changed model does show up in
the compiled text. So the claim holds for one runtime and not the other. The spec
states it without that qualification.

### Limit 3: nothing is signed

This is the most important thing to understand about OKF's trust model.

`verified: { by: human:ahormati, at: ... }` is a line of text in a file. Anyone who can
edit the file can write that line. There is no signature, no hash, no key, nothing to
check it against. The same is true of `generated`, of the trust tiers derived from
`verified`, and of the `sources` credibility signals.

The spec never claims otherwise, and section 12 lists what is deliberately postponed:

- the runtime protocol, including receipt and verdict formats
- the attester interface, portability, and sandboxing
- attestation caching
- semantic-layer templates for Looker and dbt

So the honest statement of what OKF v0.2 gives you: **integrity comes entirely from
wherever the bundle lives.** In a Git repository with protected branches and required
review, `verified: human:ahormati` means a reviewed commit said so, which is real. In a
tarball someone emailed you, it means nothing at all.

Compare that with what signed-provenance standards do. In-toto, SLSA, and Sigstore all
bind a claim to a cryptographic identity so the claim survives leaving its repository.
OKF does not, by choice. It is a format, not a security protocol. Just do not treat a
trust tier as a security boundary. The spec says this itself in section 5.3: trust
tiers "are advisory signals, not access control".

## Verification and attestation are different things

Section 10.6 draws a distinction that is easy to lose:

| | `verified` | Attestation |
|---|---|---|
| Confirms | The **definition** still matches policy | A single **run** produced the value correctly |
| When | Occasionally, by a person or a job | Every single call |
| Speed | Slow | Immediate |
| Stored | Yes, in the file | **No**, it is a runtime object |

A stale definition can still attest cleanly, because the SQL ran correctly. A
freshly-verified definition still needs attesting on every run, because verification
says nothing about what the agent just did. You need both.

## What this is genuinely good for

Setting the limits aside, the core design is sound and unusual. Three things it gets
right:

- **The parameter-only surface.** Restricting an agent to filling declared holes is a
  real constraint, mechanically checkable, and much stronger than asking a model to
  behave.
- **The no-LLM attester.** Requiring the checker to be plain deterministic code means
  the thing verifying the model cannot itself hallucinate.
- **Fidelity checking.** Re-reading the authoritative result rather than trusting the
  agent's text catches a whole class of quiet errors.

If you want an agent to quote your company's revenue figure, this is a more serious
proposal than anything else in the agent-knowledge space right now. Just deploy it
inside a repository whose history you trust, and write your own attester.

## Sources

- OKF v0.2 specification, section 10:
  [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Reference attester:
  [okf/bundles/acme_retail/attesters/sql_equality.py](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/bundles/acme_retail/attesters/sql_equality.py)
- Reference executor:
  [okf/bundles/acme_retail/skills/run-on-bq.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/bundles/acme_retail/skills/run-on-bq.md)
- [in-toto attestation framework](https://in-toto.io/), [SLSA](https://slsa.dev/),
  [Sigstore](https://www.sigstore.dev/)

---

<!-- 11archive-source: 05-yaml-frontmatter-best-practices.md -->

# YAML frontmatter and its best practices

OKF's entire structured surface is YAML frontmatter. Get it wrong and the format's
promises fail quietly, without an error message. This section is the practical guide:
what frontmatter is, the ways YAML surprises people, and the rules that avoid all of
it.

Everything here is demonstrated with real output from real parsers. The commands are
in 11-methodology-and-sources.md.

## What frontmatter is

A block of structured labels at the very top of a text file, fenced by three hyphens:

```markdown
---
type: Metric
title: Gross Margin
tags: [finance, margin]
---

The body starts here.
```

The convention comes from Jekyll, the static site generator Tom Preston-Werner released
in 2008, and spread from there to Hugo, Obsidian, Astro, MkDocs, Notion exports, and
now OKF.

**There is no standard for it.** No RFC, no W3C note, nothing. YAML has a formal
specification; the practice of putting YAML between two `---` lines at the top of a
Markdown file does not. Every tool implements its own reader, and they disagree at the
edges. That is the root cause of most of what follows.

## Who these bugs actually hurt

Worth settling before the details, because it changes how much you should care.

OKF's headline reader is a language model, and a language model receives the raw bytes.
It never sees `NO` turn into `false`, because nothing parses the YAML on its behalf. It
reads the word "NO".

Everything else in the chain does parse: validators, viewers, search indexes, graph
builders, servers, and any script that filters by `tags` or checks `stale_after`. So
every problem in this section is a **tooling** problem, not a comprehension problem. That
makes them less alarming than they first sound, and more insidious: they surface as a
viewer with no edges, an index missing a document, or a build that dies, rather than as a
wrong answer you can trace.

## Why YAML surprises people

YAML tries to guess what you meant. Write `count: 5` and you get the number 5, not the
text "5". That is convenient, and it is also the whole problem: the guessing rules are
larger and stranger than almost anyone expects, and **they differ between YAML version
1.1 and version 1.2.**

Version 1.1 is from 2005. Version 1.2 is from 2009. Seventeen years later, the most
widely used Python library still implements 1.1.

Here is the same input through PyYAML, which follows YAML 1.1, and ruamel.yaml, which
follows 1.2:

| Input | PyYAML (YAML 1.1) | ruamel.yaml (YAML 1.2) | Differs |
|---|---|---|---|
| `country: NO` | `False` (bool) | `'NO'` (str) | **yes** |
| `enabled: yes` | `True` (bool) | `'yes'` (str) | **yes** |
| `archived: off` | `False` (bool) | `'off'` (str) | **yes** |
| `build: 010` | `8` (int) | `10` (int) | **yes** |
| `zip: 02134` | `1116` (int) | `2134` (int) | **yes** |
| `duration: 22:53` | `1373` (int) | `'22:53'` (str) | **yes** |
| `version: 1.10` | `1.1` (float) | `1.1` (float) | no |
| `title: NULL` | `None` | `None` | no |
| `pi: .5` | `0.5` (float) | `0.5` (float) | no |
| `at: 2026-05-28T14:30:00Z` | `datetime` | `datetime` | no |
| `at: '2026-05-28T14:30:00Z'` | `'2026-05-28T14:30:00Z'` (str) | same | no |
| `tags: a, b, c` | `'a, b, c'` (str) | same | no |

Read that table twice. Every "yes" row is a bug waiting in a file that looks completely
reasonable.

### The Norway problem

The famous one. In YAML 1.1, `y`, `yes`, `on`, and `true` all mean true, and `n`, `no`,
`off`, and `false` all mean false. So:

```yaml
countries: [DK, NL, NO, SE]
```

parses in PyYAML as `['DK', 'NL', False, 'SE']`. Norway becomes the boolean false. It
is named after this exact failure, which has bitten real production systems.

YAML 1.2 removed all of it. Only `true` and `false` are booleans. But PyYAML has not
moved to 1.2, so in Python the problem is still live in 2026.

### Leading zeros are octal, and octal changed

`zip: 02134` is Boston's postcode. PyYAML reads the leading zero as "this is base 8"
and returns `1116`. ruamel.yaml, following YAML 1.2, requires `0o` for octal and returns
`2134`.

So the same file gives you two different wrong-or-right answers depending on the
library. Neither gives you the string you wanted.

### Colons make sexagesimal numbers

`duration: 22:53` is base-60 in YAML 1.1: 22 times 60, plus 53, equals `1373`. This
catches durations, times of day, and version strings with colons. YAML 1.2 dropped it
and returns the string.

### Version numbers lose their trailing zero

`version: 1.10` is a float in both versions, and floats do not keep trailing zeros, so
it becomes `1.1`. Version 1.10 and version 1.1 are different releases. This one is
silent in every YAML version.

### Keys are guessed too, not just values

This surprises people who have learned to quote values:

| Input | PyYAML key | ruamel key |
|---|---|---|
| `on: push` | `True` (bool) | `'on'` (str) |
| `no: value` | `False` (bool) | `'no'` (str) |
| `yes: value` | `True` (bool) | `'yes'` (str) |
| `null: v` | `None` | `None` |

This is why GitHub Actions workflow files are a known trap: the `on:` key that every
workflow starts with is the boolean true in a YAML 1.1 parser. Looking up
`config["on"]` returns nothing, because the key is `True`.

### Duplicate keys are silently accepted

```python
>>> yaml.safe_load("type: A\ntype: B")
{'type': 'B'}
```

No error, no warning. The last one wins. In a file an agent has edited several times,
this is a plausible accident and an invisible one.

### Tabs are illegal

YAML forbids tab characters for indentation. An editor configured to insert tabs
produces a file that fails to parse with a message about "scanning for the next token",
which does not obviously mean "you have a tab".

## Dates, and why OKF is affected

Unquoted dates and timestamps become date objects in **both** YAML versions:

```python
>>> yaml.safe_load("at: 2026-05-28T14:30:00Z")
{'at': datetime.datetime(2026, 5, 28, 14, 30, tzinfo=timezone.utc)}

>>> yaml.safe_load("at: '2026-05-28T14:30:00Z'")
{'at': '2026-05-28T14:30:00Z'}
```

One quote character changes the type your program receives.

OKF's specification writes timestamps unquoted in every example. Google's own reference
agent writes them quoted. The result, measured in
06-conformance-audit.md: `generated.at` arrives as a
`datetime` in one of Google's bundles and as a `str` in the other three. Any reader has
to handle both.

Worse, the conversion is not reversible. Round-tripping through PyYAML mangles the
format:

```
in:  at: 2026-05-28T14:30:00Z
out: at: 2026-05-28 14:30:00+00:00
```

The `T` separator and the `Z` suffix are gone. The spec asks for ISO 8601; the output is
not ISO 8601 in the strict reading.

**Rule: quote every timestamp and every date, and parse it in your own code.**

## The delimiter hazards

Four ways the `---` fence itself goes wrong.

### A `---` inside the block ends it early

Most readers, including OKF's, scan for the next line that is exactly `---`. A `---`
inside a multi-line string matches:

```markdown
---
type: Metric
description: |
  a horizontal rule:
  ---
  more text
title: X
---
```

OKF's Python parser stops at the indented `---`. The frontmatter **parses successfully**
as `{'type': 'Metric', 'description': 'a horizontal rule:'}`. The `title` is gone. No
error is raised. This is the most dangerous failure mode in this document, because
everything downstream looks fine.

### Two Google implementations disagree about this exact case

The strongest evidence that "it's just YAML frontmatter" specifies nothing sits inside
Google's own repository, which ships two implementations of the format.

| | Python reference agent | TypeScript tool in `toolbox/mdcode` |
|---|---|---|
| Opening fence | `lines[0].strip() != "---"` | `lines[0] !== '---'` |
| Closing fence | `lines[i].strip() == "---"` | `lines.indexOf('---', 1)` |
| YAML library | PyYAML, YAML 1.1 | `yaml` 2.x, YAML 1.2 core |
| Indented `---` inside a block | **Closes the frontmatter** | **Does not close it** |
| `at: 2026-06-30T14:00:00Z` | `datetime` object | plain string |

Feed both the example above. The Python one returns a two-field header and silently
drops `title`. The TypeScript one reads the block to the real end and returns everything.
Same bytes, same repository, two different documents.

The type divergence is the same story: YAML 1.2's core schema has no timestamp type, so
the JavaScript library returns a string where PyYAML returns a `datetime`. Any consumer
written against one and tested against the other will break.

This is not a criticism of either implementation. Both are reasonable readings of a
convention that no document defines. It is the argument for rule 1 below: **quote
everything, and never let a bare `---` near your frontmatter**, because the format cannot
protect you.

### A byte order mark disables frontmatter entirely

A byte order mark is an invisible marker some Windows editors put at the start of a
file. OKF's parser checks that the first line is exactly `---`; with the marker the line
is `﻿---` and the check fails. The file is treated as having no frontmatter at all.

### Frontmatter must be at line 1

A blank line, a comment, or a stray character before the opening `---` and most readers
stop looking. Nothing signals this.

### Windows line endings

Some readers match `---\n` literally and fail on `---\r\n`. Configure Git with
`core.autocrlf=input` and keep bundles in LF.

## Multi-line text

Two styles, and the difference matters:

```yaml
literal: |
  line one
  line two          # newlines kept

folded: >
  line one
  line two          # becomes "line one line two"
```

Use `|` for anything where line breaks matter: SQL, code, addresses. Use `>` for a long
paragraph you want wrapped in the source but joined on read.

Both keep a single trailing newline by default. Add `-` to strip it (`|-`) or `+` to
keep all of them (`|+`).

## Compact style and round-trip stability

YAML has two ways to write the same structure:

```yaml
generated: { by: agent/v1, at: '2026-06-20T22:53:05Z' }   # flow, compact
```

```yaml
generated:                                                 # block
  by: agent/v1
  at: '2026-06-20T22:53:05Z'
```

OKF's spec uses the compact form throughout. This is a real readability win in a
frontmatter block that would otherwise run twenty lines.

The catch: **most YAML writers destroy it.** Python's `yaml.safe_dump` always emits
block style. Any tool that reads a file and writes it back converts every compact
mapping to a block one, reorders nothing but reformats everything.

Measured on Google's own bundle in 06: reading and writing
one unchanged file produced a 52-line diff.

**Rule: if files will be rewritten by tools and read by people, use a round-trip
library.** In Python that is `ruamel.yaml` in `rt` mode, which preserves style, quoting,
comments, and key order. `PyYAML` has no round-trip mode at all.

## The parser landscape

Which YAML version your data goes through depends entirely on which library reads it:

| Library | Language | YAML version | Notes |
|---|---|---|---|
| PyYAML | Python | 1.1 | The default. Norway problem live. No round-trip mode |
| ruamel.yaml | Python | 1.2 | Round-trip mode preserves formatting. Can opt into 1.1 |
| js-yaml | JavaScript | 1.2 | Powers most of the JS ecosystem |
| gray-matter | JavaScript | 1.2 via js-yaml | The common frontmatter reader |
| python-frontmatter | Python | 1.1 via PyYAML | Inherits every PyYAML behaviour |
| go-yaml v3 | Go | 1.2 mostly | Some 1.1 behaviour retained |
| serde_yaml | Rust | 1.2 | |

The practical consequence: a bundle written by a Python producer and read by a
JavaScript consumer has crossed a version boundary. Anything relying on implicit typing
can differ on the two sides. Explicit quoting is what makes the crossing safe.

## The rules

Twelve rules. The first four prevent almost everything above.

1. **Quote every string that is not obviously a word.** Dates, timestamps, version
   numbers, IDs with leading zeros, country codes, anything with a colon.
2. **Quote every date and timestamp**, and parse it in your own code.
3. **Write lists as lists.** `tags: [a, b, c]` or a block list. Never `tags: a, b, c`.
4. **Use only `true` and `false` for booleans.** Never `yes`, `no`, `on`, `off`, `y`,
   `n`.
5. **Never put a bare `---` inside frontmatter.**
6. **Save as UTF-8 with no byte order mark, with LF endings.**
7. **Put the opening `---` on line 1.** Nothing before it.
8. **Never use tabs.** Two spaces per level.
9. **Check for duplicate keys** in validation. No parser will tell you.
10. **Use a round-trip writer** for files that both tools and people edit.
11. **Keep frontmatter small.** It is labels for filtering and indexing. Prose belongs in
    the body.
12. **Validate before publishing.** Types, required fields, and shapes. Parsing
    successfully is not the same as being correct.

## A conforming OKF frontmatter block

Every rule applied:

```yaml
---
type: Attested Computation
title: Revenue for fiscal year
description: Recognized revenue for a fiscal year, per Finance's definition.
tags: [finance, revenue, attested]
status: stable
runtime: bigquery
parameters:
  - { name: year, type: integer, required: true }
executor:
  resource: /skills/run-on-bq.md
  receipt: [job_id, executed_sql, result]
attester:
  resource: /attesters/sql_equality.py
generated: { by: reference_agent/gemini-2.5-pro, at: '2026-06-20T22:53:05Z' }
verified:
  - { by: 'human:ahormati', at: '2026-06-25T09:00:00Z' }
stale_after: '2026-12-31'
sources:
  - id: rev-policy
    resource: https://wiki.acme/finance/revenue-recognition
    title: Revenue recognition policy
    author: 'team:finance-fpa'
    last_modified: '2026-04-02'
usage_window: { from: '2026-06-01', to: '2026-06-30' }
---
```

Four differences from how the spec writes its own examples, each deliberate:

- Timestamps and dates are **quoted**, so they arrive as strings, consistently.
- Actor values like `human:ahormati` are **quoted**, because they contain a colon.
- Path values carry a **leading `/`**, removing the ambiguity found in
  06.
- Compact style is kept where it aids reading, which requires a round-trip writer to
  survive.

## A validator worth running

Parsing is not validation. A checklist for a producer-side check:

- [ ] Frontmatter present, starts at line 1, terminates correctly
- [ ] `type` present and non-empty (this is the only conformance requirement)
- [ ] No duplicate keys
- [ ] `tags` is a list, not a string
- [ ] `status` is one of `draft`, `stable`, `deprecated`
- [ ] `stale_after` is a plain `YYYY-MM-DD` date and **not** a full timestamp. A
      timestamp here crashes the reference viewer outright; see
      06
- [ ] Every `generated`/`verified` entry has `by`
- [ ] Every actor uses `human:`, `process:`, or `producer/version`
- [ ] Every `sources` entry has `resource`
- [ ] Every footnote label in the body matches a `sources[].id`
- [ ] `usage_window` present whenever any `usage_count` is
- [ ] Path values resolve, under a stated rule
- [ ] `Attested Computation` files have `runtime`
- [ ] Timestamps are quoted and parse as ISO 8601
- [ ] File is UTF-8, no byte order mark, LF endings

OKF ships no validator. `document.py`'s `validate()` checks one thing: that `type` is
present. Everything else on this list is yours to build.

## Sources

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/) and
  [YAML 1.1](https://yaml.org/spec/1.1/)
- [PyYAML documentation](https://pyyaml.org/wiki/PyYAMLDocumentation),
  [ruamel.yaml](https://yaml.readthedocs.io/), [js-yaml](https://github.com/nodeca/js-yaml),
  [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [Jekyll front matter documentation](https://jekyllrb.com/docs/front-matter/)
- [noyaml.com](https://noyaml.com/) and the StrictYAML rationale on
  [implicit typing](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)
- Parser behaviour measured directly. Script and output in
  11-methodology-and-sources.md

---

<!-- 11archive-source: 06-conformance-audit.md -->

# Conformance audit of Google's own bundles

Original measurement for this report. Google ships four example bundles with the spec.
This section parses every file in them using the same code Google's reference
implementation uses, and reports what is actually in there.

The point is not to embarrass the examples. It is that **the defects found are exactly
the ones the format's design invites**, so they predict what your bundles will look
like too.

## Method in one paragraph

Cloned `GoogleCloudPlatform/knowledge-catalog` at commit `374e0bc`. Parsed all 78
Markdown files under `okf/bundles/` with PyYAML's `safe_load`, matching the parsing in
`okf/src/reference_agent/bundle/document.py`. Checked each file against the
conformance rules in spec section 11, the field types in section 4.1, and the path
rules in section 6.2. Full method and the script in
11-methodology-and-sources.md.

## What is in the bundles

| Bundle | Files | Concepts | Authored by |
|---|---|---|---|
| `acme_retail` | 17 | 9 | By hand, to demonstrate v0.2 |
| `crypto_bitcoin` | 15 | 9 | Reference agent |
| `ga4` | 14 | 9 | Reference agent |
| `stackoverflow` | 32 | 26 | Reference agent |
| **Total** | **78** | **53** | |

All 53 concepts pass the section 11 conformance test: every one parses, and every one
has a non-empty `type`. **Strict conformance is 100%.** Everything below sits in the
gap between "conformant" and "usable".

## Finding 0: half of v0.2 is never produced

Before the defects, the largest result. Version 0.2's whole contribution was provenance,
trust, freshness, lifecycle, and attestation. Here is where those fields actually appear:

| Bundle | Concepts | `sources` | `generated` | `verified` | `status` | `stale_after` | Attested Computation |
|---|---|---|---|---|---|---|---|
| `acme_retail` (hand-written) | 9 | 5 | 9 | **8** | 9 | **7** | **2** |
| `crypto_bitcoin` (agent) | 9 | 9 | 9 | 0 | 0 | 0 | 0 |
| `ga4` (agent) | 9 | 9 | 9 | 0 | 0 | 0 | 0 |
| `stackoverflow` (agent) | 26 | 26 | 26 | 0 | 1 | 0 | 0 |

`verified`, `stale_after`, and `Attested Computation` exist only in the bundle a person
wrote to illustrate the specification. Google's reference agent, across 44 generated
concepts, emits `sources` and `generated` and nothing else.

The consumer side is emptier still. Searching every Python file in the reference
implementation for the five computation fields returns nothing:

| Field | References in `okf/src/` |
|---|---|
| `runtime` | **0** |
| `parameters` | **0** |
| `computation` | **0** |
| `executor` | **0** |
| `attester` | **0** |

Specification section 10 is roughly 180 lines. No shipped code reads any of it. Section
11 tells consumers they SHOULD "surface, not silently drop, a failing attestation";
nothing shipped can produce an attestation to surface.

This is not a defect. It is the honest state of a young specification, and it is the
single most important thing to know before adopting v0.2.

## Finding 1: `tags` is a plain string in 8 of 26 files

Spec section 4.1 says `tags` is "a YAML list of short strings". Eight files in the
Stack Overflow bundle write it as a bare comma-separated line, which YAML reads as one
string:

| File | Parsed value | Type |
|---|---|---|
| `datasets/stackoverflow.md` | `Stack Overflow, Q&A, developer, programming, public dataset` | `str` |
| `tables/posts_answers.md` | `stackoverflow, answers, posts, Q&A` | `str` |
| `tables/posts_moderator_nomination.md` | `stackoverflow, posts, moderator, nomination` | `str` |
| `tables/posts_questions.md` | `stackoverflow, posts, questions` | `str` |
| `tables/posts_wiki_placeholder.md` | `stackoverflow, posts, wiki, placeholder, community` | `str` |
| `tables/stackoverflow_posts.md` | `stackoverflow, posts, deprecated` | `str` |
| `tables/users.md` | `stackoverflow, users, community, reputation` | `str` |
| `tables/votes.md` | `Stack Overflow, votes, posts, community` | `str` |

The other 18 concepts in the same bundle use a proper list. One agent run produced
both shapes.

### Why it matters

A reader that loops over `tags` expecting strings gets **characters**:

```python
>>> fm = yaml.safe_load("tags: stackoverflow, posts, questions")
>>> list(fm["tags"])[:8]
['s', 't', 'a', 'c', 'k', 'o', 'v', 'e']
>>> len(fm["tags"])
31                    # 31 "tags", not 3
```

### Google's tooling contains the damage, it does not fix it

The bundled viewer coerces the value before use, at
`okf/src/reference_agent/viewer/generator.py:101`:

```python
tags = fm.get("tags") or []
if not isinstance(tags, list):
    tags = [str(tags)]
```

Without those two lines, the JavaScript at `viewer/static/viz.js:188` would iterate a
string and render 31 single-letter chips. With them, the shipped
`bundles/stackoverflow/viz.html` renders **one** tag reading
`stackoverflow, posts, deprecated` where three were meant. So the workaround turns a
loud failure into a quiet one; the tag split is still lost, and the defect is visible in
a published artifact.

Note what this is not. Section 11 requires only that `type` be present, and says nothing
about the type of `tags`. These files are **fully conformant**. They break the shape the
specification describes in section 4.1 and lose the tag split, and they pass every test
the specification defines.

**Fix:** always write `tags: [a, b, c]` or a block list. Validate that `tags` is a
list before publishing.

## Finding 2: the same file uses two different path rules

Spec section 6.2 lists three allowed forms for a path: an absolute URL, a path
starting with `/` measured from the bundle root, or "a relative path". It never says
what a relative path is measured from.

In `acme_retail/metrics/gross-margin.md`, both readings appear at once:

| Location | Value | Resolves from document | Resolves from bundle root |
|---|---|---|---|
| `sources[].resource` | `policies/margin-standard.md` | no | **yes** |
| `sources[].resource` | `policies/revenue-recognition.md` | no | **yes** |
| body link | `./revenue.md` | **yes** | no |
| body link | `./gross-margin-legacy.md` | **yes** | no |

Frontmatter paths are measured from the bundle root. Body links are measured from the
file. Neither carries the leading `/` that section 6.2 says marks the bundle-root
form.

Across the `acme_retail` bundle this affects **12 path values** in `executor.resource`,
`attester.resource`, and `sources[].resource`. All 12 resolve if you assume bundle
root. All 12 fail if you assume the file's own directory, which is the normal
convention for Markdown and for filesystems.

**This is the specification's ambiguity, not the samples' mistake.** The bundles are
copying the specification's own examples. Section 10.2's worked example, section 6.3, and
Appendix A all use the same slash-less root-anchored form, and section 5.1 explicitly
names a third option beyond the two in section 6.2: "an absolute URL, a bundle-relative
path, or a path into a `references/` subdirectory". One missing sentence in section 6.2
causes all twelve.

**And nothing currently breaks.** No shipped tool resolves frontmatter path values at
all. The viewer builds its graph only from body links; `executor.resource` and friends
are copied through untouched. So this failure is latent, waiting for the first consumer
that tries to follow one of these paths.

### The reference agent contradicts the spec outright

Section 6.1 recommends the leading-slash form for links between concepts:

> "This is the **recommended** form because it is stable when documents are moved
> within their subdirectory."

Google's own reference agent forbids it. From its prompt at
`okf/src/reference_agent/prompts/reference_instruction.md`:

> "Use file-relative paths only. Never start a link with `/` (that breaks GitHub
> rendering)"

Both positions are defensible, and the agent's is the more practical one. A browser or
GitHub resolves a leading `/` against the site or repository root, not the bundle root.
Section 3 explicitly allows a bundle to live as "a subdirectory within a larger
repository", and in that case every leading-slash link points at the wrong place. Since
"it renders on GitHub" is one of the format's selling points, the spec's recommendation
undercuts it.

The reference **viewer** takes the same side, silently. At
`viewer/generator.py:74` it skips any link starting with `/` when building the graph:

```python
if "://" in target or target.startswith("/"):
    continue
```

So a bundle that follows the specification's recommendation renders in Google's own
viewer as a set of concepts with **no connections between them**. The graph, which is
the viewer's entire purpose, comes out empty.

Three parts of one project hold three positions: the specification recommends the
leading slash, the agent's prompt forbids it, and the viewer discards it. An external
contributor filed
[PR #165](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/165) making this
argument on 2026-07-01. It is still open.

**Fix for producers, split by field:**

- **Body links:** use file-relative paths (`./x.md`, `../y/z.md`). They render correctly
  everywhere, and they match what the reference agent produces.
- **Frontmatter path fields:** use a leading `/`. These are never rendered as links by
  GitHub, so the rendering objection does not apply, and the leading slash removes the
  ambiguity entirely.

**Fix for readers:** try the document-relative path, then fall back to bundle-root.
**Fix for the spec:** say what a bare relative path means, and reconcile section 6.1
with the reference agent.

## Finding 3: the same field is a date in one bundle and text in another

`generated.at` holds a timestamp. Because YAML converts unquoted dates automatically,
what a program receives depends on how the file was written.

| Bundle | `generated.at` written as | Python type after parsing |
|---|---|---|
| `acme_retail` | `at: 2026-06-30T14:00:00Z` | `datetime` (9 of 9) |
| `crypto_bitcoin` | `at: '2026-07-10T21:15:20+00:00'` | `str` (9 of 9) |
| `ga4` | `at: '2026-07-10T21:15:20+00:00'` | `str` (9 of 9) |
| `stackoverflow` | `at: '2026-07-10T22:49:19+00:00'` | `str` (26 of 26) |

The hand-written bundle follows the spec's examples, which are unquoted, and yields
`datetime` objects. The three agent-written bundles quote the value and yield strings.
`stale_after: 2026-12-31` is unquoted throughout `acme_retail` and comes back as a
`date` object.

The split is wider than `generated.at`. Across the four bundles, 35 frontmatter values
become `date` or `datetime` objects rather than text, covering `stale_after`,
`sources[].last_modified`, and both ends of `usage_window`.

A reader must handle both forms. Calling a string method on a `datetime`, or comparing a
`str` to a `date`, raises in Python and misbehaves quietly in JavaScript.

To be fair to the specification: no rule fixes the quoting, so neither form is a
violation. This is an interoperability trap, not a defect. The reference implementation
already defends against both forms in `is_stale`, which is evidence the authors expected
it. Finding 4 shows that defence failing.

**Fix:** quote every timestamp, and parse it yourself. Section
05 covers the general rule.

## Finding 4: one conformant file crashes the reference viewer

`is_stale()` in `document.py` is written to fail softly. Its docstring promises it
"Returns False when `stale_after` is absent or unparseable", and it has a `try/except`
for exactly that. The fallback is unreachable.

```python
if isinstance(raw, date):
    stale_after = raw          # a datetime lands here, never in the try/except
else:
    try:
        stale_after = date.fromisoformat(str(raw)[:10])
    except ValueError:
        return False
return (today or date.today()) >= stale_after
```

In Python, `datetime` is a subclass of `date`, so a timestamp passes the
`isinstance(raw, date)` test, skips the guard, and reaches a comparison that is not
allowed:

| `stale_after` written as | Parses to | `is_stale()` |
|---|---|---|
| `2026-09-23` | `date` | `False` |
| `'2026-09-23'` | `str` | `False` |
| `2026-09-23T00:00:00Z` | `datetime` | **`TypeError`** |

The error: `'>=' not supported between instances of 'datetime.date' and
'datetime.datetime'`.

`viewer/generator.py:124` calls `is_stale(fm)` with no guard, so this is not contained.
A single file anywhere in a bundle takes down the whole viewer build. Verified end to
end against a one-file bundle.

Section 5.5 does ask for a plain `YYYY-MM-DD` date, so a timestamp is off-form. But the
file remains conformant under section 11, which section 11 says consumers MUST NOT
reject, and YAML makes the mistake easy: `generated.at` is a timestamp, `stale_after` is
a date, and the specification writes both unquoted in adjacent lines of the same example.

**Fix for producers:** write `stale_after` as a quoted plain date.
**Fix for the implementation:** test `isinstance(raw, datetime)` before `date`, or call
`.date()` on the value.

## Finding 5: the reference parser rewrites files it round-trips

This is the most consequential finding, because it undercuts a property the spec
names as a goal.

Section 1 lists **diffable in version control** as one of four reasons to choose this
format. Section 1 also says a knowledge corpus "is continuously written and maintained
by agents".

Put those together and files get read and rewritten constantly. So: what happens when
Google's reference implementation reads one of Google's hand-written files and writes
it back unchanged?

Running `OKFDocument.parse()` then `.serialize()` on
`acme_retail/computations/revenue-ytd.md`, with no edit in between, produces a
**52-line diff**:

```diff
-tags: [finance, revenue, attested]
+tags:
+- finance
+- revenue
+- attested

-  - { name: year, type: integer, required: true }
+- name: year
+  type: integer
+  required: true

-generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-30T14:00:00Z }
+generated:
+  by: reference_agent/gemini-2.5-pro
+  at: 2026-06-30 14:00:00+00:00
```

Three things happen, none of them intended:

1. **Compact style is destroyed.** Every `{ ... }` and `[ ... ]` becomes a block. The
   spec uses compact style throughout its own examples, including the recommended
   `generated: { by: ..., at: ... }`.
2. **Timestamps are rewritten.** `2026-06-30T14:00:00Z` becomes
   `2026-06-30 14:00:00+00:00`. The `T` separator and the `Z` suffix are gone. Spec
   section 5.2 asks for "an ISO 8601 datetime"; the space-separated form is not one in
   the strict reading.
3. **Long lines are re-wrapped**, so a one-line `description` becomes two.

The cause is `yaml.safe_dump` in `document.py:52`, which always emits block style and
re-serialises the `datetime` object YAML created on the way in.

### What this costs

An agent that touches one field in a file rewrites the whole frontmatter. Code review
of a knowledge bundle then means reading a 52-line diff to find a one-word change. The
version-control benefit the format is built on degrades every time a file is edited by
the tool the spec ships.

**Fix for producers:** use a round-trip-preserving YAML library. In Python that is
`ruamel.yaml` in `rt` mode, which keeps style, quoting, and key order. Do not use
`safe_dump` for files a human will also edit.

## Finding 6: two parser edge cases that fail silently

Both verified against `document.py`.

### A `---` inside the frontmatter truncates it, without error

The parser scans for the next line that is exactly `---` after trimming whitespace
(`document.py:31-33`). A `---` inside a multi-line text block matches:

```markdown
---
type: Metric
description: |
  a horizontal rule:
  ---
  more text
title: X
---
```

The parser stops at the indented `---`. The frontmatter parses **successfully** as
`{'type': 'Metric', 'description': 'a horizontal rule:'}`. The `title` is silently
lost. The rest becomes body text. Nothing raises.

**Fix:** never let a bare `---` appear inside frontmatter. Quote the value, or use a
different marker in prose.

### A byte order mark disables frontmatter entirely

The parser requires the very first line to be `---` (`document.py:27`). A file saved
with a byte order mark, which some Windows editors add invisibly, begins with
`﻿---`. That comparison fails, so the whole file is treated as having no
frontmatter at all.

**Fix:** save as UTF-8 without a byte order mark. Strip it when reading.

## Finding 7: `log.md` carries frontmatter, and nothing says whether it may

`acme_retail/log.md` starts with:

```yaml
---
type: Log
title: Acme Retail bundle history
---
```

Spec section 8 says index files carry no frontmatter, and section 12 calls a
bundle-root `index.md` "the only place frontmatter is permitted in an `index.md`".
Section 9, which defines `log.md`, says nothing about frontmatter either way.

So this is not a violation. It is an unspecified case that Google's own example
resolves one way while the spec stays quiet. A reader collecting concepts by type
would need to know to skip `log.md`, because `type: Log` looks exactly like a concept.

This one was found independently by an external contributor two days before this report
was written, in
[issue #286](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/286),
titled "OKF log.md file can have a frontmatter ?". It has no reply.

**Fix for the spec:** state whether `log.md` may carry frontmatter.

## Summary

| Finding | Scope | Severity | Whose problem |
|---|---|---|---|
| 0. Half of v0.2 has no producer or consumer | 44 concepts, all of section 10 | **High** | Implementation |
| 4. Timestamped `stale_after` crashes the viewer | Latent, any one file | **High** | Reference implementation |
| 5. Lossy round-trip rewriting | Every file an agent touches | **High** | Reference implementation |
| 6. `---` inside frontmatter truncates silently | Latent | **High** | Reference implementation |
| 2. Recommended links produce no graph edges | Every `/`-prefixed link | Medium | Spec and implementation disagree |
| 1. `tags` parsed as a string | 8 files | Medium | Producer |
| 3. Date and time types vary | 35 values | Medium | Spec and producer |
| 2. Ambiguous relative paths | 12 values | Medium | Spec |
| 6. Byte order mark breaks parsing | Latent | Medium | Reference implementation |
| 7. `log.md` frontmatter undefined | 1 file | Low | Spec |

**Not one of these makes a bundle non-conformant.** That is the real result. Section
11's test has three rules, and then explicitly forbids a consumer from rejecting a
bundle for missing fields, unknown types, unknown keys, broken links, or missing index
files. It is a producer-side checklist that consumers are told not to enforce.

So a validator that checks only conformance reports all four bundles clean, including
the one file that would crash the reference viewer. Section
09 lists what a useful validator should check instead.

## Sources

- Measured against `GoogleCloudPlatform/knowledge-catalog` at commit `374e0bc`,
  [okf/bundles/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf/bundles)
- Parsing behaviour from
  [okf/src/reference_agent/bundle/document.py](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/src/reference_agent/bundle/document.py)
- Viewer coercion from
  [okf/src/reference_agent/viewer/generator.py](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/src/reference_agent/viewer/generator.py)
- Audit script and raw output: 11-methodology-and-sources.md

---

<!-- 11archive-source: 07-how-okf-compares.md -->

# How OKF compares

OKF landed in a crowded space. This section places it against the formats and standards
it overlaps with, and says plainly where it is weaker.

## The one distinction that resolves most confusion

**OKF is a format. MCP is a protocol. They are not competitors.**

The Model Context Protocol, from Anthropic, defines how an agent talks to a tool or data
source at runtime: the messages, the handshake, the calls. OKF defines what knowledge
looks like when it is sitting still in a directory.

You can serve an OKF bundle over MCP. Several third-party OKF tools already do exactly
that. The natural pairing is OKF for storage and version control, MCP for delivery. Any
article positioning one as a rival to the other has misread at least one of them.

The same applies to retrieval systems. OKF says nothing about indexing, chunking, or
embeddings. It is what you point those at.

## The comparison

| Format | Owner | Shape | Prose | Executable | Provenance | Needs tooling |
|---|---|---|---|---|---|---|
| **OKF** | Google Cloud | Markdown files plus YAML | **First class** | Via attested computations | **Built in** | No |
| llms.txt | Community | One Markdown file | First class | No | No | No |
| AGENTS.md | Community | One Markdown file | First class | No | No | No |
| DCAT | W3C | RDF vocabulary | No | No | Partial | Yes |
| schema.org | Community, W3C | Vocabulary, JSON-LD | No | No | No | Yes |
| Data Package | Open Knowledge Foundation | JSON descriptor | No | No | Partial | Light |
| dbt semantic layer | dbt Labs | YAML in a project | Minimal | **Yes** | No | Yes |
| Catalog products | Various vendors | Product database | Varies | No | Varies | **Yes, theirs** |
| RDF, OWL, SKOS | W3C | Formal triples | No | No | Via PROV-O | Yes |

Two columns carry most of the weight.

**Prose.** Almost everything else in the table describes structure and stops. A DCAT
record tells you a dataset's title, publisher, and format. It has nowhere to put "this
column is unreliable before March 2024 because the upstream job double-counted
refunds". OKF puts that sentence in the body, which is exactly what a language model
needs and what a structured vocabulary was never built to hold.

**Needs tooling.** DCAT, schema.org, and RDF need a parser, a vocabulary, and often a
triple store. A catalog product needs the product. OKF needs `cat`. That is the entire
argument for it, and it is a good one.

## Where OKF is weaker

Being fair about this matters more than the table.

**Against DCAT and schema.org.** They are real standards with formal semantics,
registered vocabularies, years of tooling, and government mandates behind them. DCAT-AP
is required for public sector data catalogs across the EU. OKF has a `type` field
anyone can fill in with anything and an explicit non-goal of defining a taxonomy. If you
need interoperability that a machine can reason over, OKF gives you far less. Its
tolerance of unknown types is a feature for portability and a liability for precision.

**Against the dbt semantic layer, Cube, and MetricFlow.** These actually execute. A dbt
metric is compiled and run; the definition and the calculation are the same object. OKF's
Attested Computation describes a calculation and hands it to someone else to run. The
spec is candid that semantic-layer templates are deferred to a future version. If your
metrics already live in dbt, OKF duplicates rather than replaces them.

**Against catalog products.** OpenMetadata, DataHub, Collibra, Alation, and Unity
Catalog give you search, lineage, access control, column-level profiling, and a UI. OKF
gives you files. The README lists these as systems that could export OKF, which is the
honest positioning: an interchange format, not a replacement.

**Against RDF and PROV-O.** For provenance specifically, PROV-O is a formal model with
agents, activities, and entities, and reasoning over it works. OKF's `sources` list is
much simpler and cannot express derivation chains beyond one hop. The spec says so
outright: deeper lineage is "out of scope for v0.2".

## Where OKF is genuinely ahead

Three things it does that nothing above does as well.

**Prose and structure in one artifact, deliberately mixed.** The README calls this
"mixes structured and unstructured data deliberately": frontmatter for the few fields
you query on, body for what a model actually reads. Every alternative picks one side.

**Trust signals as a first-class part of the format.** `generated`, `verified`, trust
tiers derived rather than stored, `stale_after` as an absolute date. Catalog products
have ownership fields; almost none distinguish who wrote a description from who
confirmed it, and none of the file formats in the table carry the distinction at all.

**Attested computations.** The idea that a knowledge file can carry the one sanctioned
way to compute a number, plus deterministic no-model code to check that it was the thing
that ran, has no close equivalent. Semantic layers guarantee correctness by owning
execution. OKF tries to guarantee it without owning execution, which is a harder problem
and the right one for an interchange format. Section
04 covers where the current version falls short of its
own description.

## The neighbours it is often confused with

**llms.txt** is a single Markdown file at a website's root, listing the pages an LLM
should read. It solves discovery for one website. OKF is a whole directory describing an
organisation's internal knowledge. They share a philosophy (plain Markdown beats an API)
and almost nothing else. One OKF publishing tool emits both.

**AGENTS.md and CLAUDE.md** tell a coding agent how to behave in a repository: build
commands, conventions, what not to touch. They are instructions. OKF is reference
material. A repository can sensibly have both.

**Obsidian, Hugo, Jekyll, MkDocs.** These are where the Markdown-plus-frontmatter
convention came from, and OKF's compatibility with them is a real advantage: an OKF
bundle opens in Obsidian and renders on GitHub with no conversion. The relationship is
inheritance, not competition.

## Choosing

| If you need | Use |
|---|---|
| Formal, machine-reasonable dataset description | DCAT or schema.org |
| Metrics that compile and run | dbt, Cube, or MetricFlow |
| Search, lineage, access control, a UI | A catalog product |
| Formal provenance you can reason over | PROV-O |
| To hand an agent your team's context, in files you can diff | **OKF** |
| To connect an agent to that context at runtime | MCP, over an OKF bundle |

The last two rows are the honest scope. OKF is good at being a portable, readable,
reviewable container for curated knowledge. It is not a catalog, not a query engine, and
not a semantic layer, and it does not claim to be any of them.

## Sources

- OKF non-goals and positioning: specification section 1 and
  [okf/README.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [llms.txt](https://llmstxt.org/)
- [W3C DCAT 3](https://www.w3.org/TR/vocab-dcat-3/), [schema.org](https://schema.org/),
  [W3C PROV-O](https://www.w3.org/TR/prov-o/)
- [Frictionless Data Package](https://datapackage.org/)
- [dbt semantic layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl),
  [MetricFlow](https://github.com/dbt-labs/metricflow), [Cube](https://cube.dev/)
- Third-party OKF tools emitting llms.txt and serving over MCP: see
  08

---

<!-- 11archive-source: 08-adoption-and-reception.md -->

# Adoption and reception

What can actually be established about who uses OKF, measured on 2026-08-13. Counts
come from the GitHub API against `GoogleCloudPlatform/knowledge-catalog`, not from
press coverage.

## The context the announcements leave out

OKF is described everywhere, including by Google, as a vendor-neutral format. That is
true of the format and incomplete about the project.

The specification lives in the `knowledge-catalog` repository. The repository's own
README opens: "Knowledge Catalog (formerly Dataplex), is an AI-powered data catalog and
metadata management platform." That is a paid Google Cloud service, and OKF is its
on-disk shape. The repository ships the round trip to prove it: `toolbox/mdcode/demo/okf/`
contains `push.ts`, `pull.ts`, and `okf-aspect.json`, a custom aspect type that moves
bundles between an OKF directory and Knowledge Catalog entries.

The type vocabulary tells the same story. Of 53 concepts in the sample bundles, 22 are
`BigQuery Table` and 3 are `BigQuery Dataset`.

None of this makes the format less portable. You genuinely can read a bundle with `cat`
and never touch Google Cloud. But "vendor-neutral open specification" and "interchange
format for a commercial catalog product" are both accurate, and only the first one
appears in the coverage. Weigh the second when you are estimating how the format will
evolve and whose needs will drive it.

## The timeline

| Date | Event |
|---|---|
| 2026-05-04 | Repository created |
| 2026-06-12 | OKF v0.1 published, with the reference agent |
| 2026-06-12 to 06-16 | Launch coverage: Google Cloud blog, Search Engine Journal, MarkTechPost, GitBook |
| 2026-07-24 | **OKF v0.2 replaces v0.1** via PR #227, announced the same day |
| 2026-07-26 to 07-29 | v0.2 coverage: Open Source For You, Search Engine Journal, others |
| 2026-08-13 | This report. Specification unchanged since 2026-07-24 |

Both versions were committed by `amir.hormati`. The v0.1 announcement is credited to
Sam McVeety and Amir Hormati of Google Cloud Data Analytics.

Two things follow that are easy to get wrong in opposite directions. The specification
moved fast: a substantial revision six weeks after launch, with two breaking changes.
And the record kept up: Google announced v0.2 the day it landed and the trade press
followed within a week. If you read a June article you are reading v0.1, because that is
all there was in June. Several third-party tools still implement v0.1, which is a real
lag; the published coverage is not.

## Repository signals

| Measure | Value |
|---|---|
| Stars | 8,569 |
| Forks | 734 |
| Open issues and PRs, all topics | 174 |
| Issues and PRs mentioning OKF | 145 |
| Open OKF issues | 78 |
| Open OKF pull requests | 45 |
| Merged OKF pull requests | 11 |

Two readings, both fair.

**Real engagement.** 145 OKF threads in two months is not an empty repository. The
issues are substantive: proposals for a media type, for conformance boundaries, for
profile declarations, for bitemporal corpora. People are reading the specification
closely enough to find its gaps.

**A maintainer bottleneck.** 45 open pull requests against 11 merged. External
contributors are writing spec fixes faster than Google is accepting them. Several of the
open PRs address defects this report found independently.

## The specification's real gaps, found by others

Three open threads corroborate findings in 06, which is
useful because they were found independently.

| Thread | Raised | What it says |
|---|---|---|
| [#165](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/165) | 2026-07-01 | Section 6.1 recommends leading-slash links, but they break GitHub rendering once a bundle is a subdirectory. The reference agent already forbids them |
| [#286](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/286) | 2026-08-11 | `log.md` in the `acme_retail` sample carries frontmatter, which the spec never permits or forbids |
| [#232](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/232) | 2026-07-26 | The conformance boundary is undefined: which files in a repository are even in scope |

All three are open. Issue #286 has no reply.

Two more worth knowing about, because they mark real absences:

- [#111](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/111) proposes
  an IANA media type (`application/okf-bundle`). None exists, so a consumer can find a
  bundle but cannot recognise it as one without inspecting the contents.
- [#199](https://github.com/GoogleCloudPlatform/knowledge-catalog/issues/199) asks for
  the inline citation syntax to be clarified.

## Third-party tools exist, and they are small

This is the strongest adoption evidence and the most easily overstated. An open pull
request,
[#167](https://github.com/GoogleCloudPlatform/knowledge-catalog/pull/167), proposes
indexing community tools in the README. Every repository it lists was checked directly:

| Tool | Kind | Language | Stars | Last push |
|---|---|---|---|---|
| [okf-gem](https://github.com/serradura/okf-gem) | Skill, CLI, and server | Ruby | 120 | 2026-08-13 |
| [OWOX models](https://github.com/OWOX/owox-model-canvas) | Visual editor | TypeScript | 86 | 2026-08-13 |
| [OKFy](https://github.com/0dust/OKFy) | Docs-to-bundle converter | TypeScript | 65 | 2026-08-10 |
| [openknowledge](https://github.com/openknowledge-sh/openknowledge) | CLI | Go | 43 | 2026-08-11 |
| [kiso](https://github.com/oak-invest/kiso) | Static site publisher | Java | 26 | 2026-08-13 |
| [okf-conformance](https://github.com/Sudhakaran88/okf-conformance) | Validator | JavaScript | 16 | 2026-08-12 |
| [OnyxWriter](https://github.com/activetwist/OnyxWriter) | Desktop editor | TypeScript | 10 | 2026-07-02 |
| [okf-lint](https://github.com/thisismydesign/okf-lint) | Linter | TypeScript | 7 | 2026-06-23 |

Read that honestly in both directions.

**It is a real ecosystem.** Eight independent implementations in five languages, most
pushed within the last week. Producers, consumers, editors, validators, and publishers
are all represented. Two of them are validators, which is exactly what the specification
does not ship. That is what a format catching on looks like early.

**It is a small one.** The largest third-party tool has 120 stars against the Google
repository's 8,569. That ratio says people are watching the format far more than they
are building on it. Several tools state they implement v0.1, so the ecosystem is
already behind the specification.

Two caveats on the list itself. It comes from a pull request whose author discloses
they contribute to one of the listed tools, so it is self-nominated rather than vetted.
And the PR is still open, so Google has not endorsed it.

## What could not be established

Recorded because absence of evidence is a finding.

| Question | Status |
|---|---|
| Any organisation outside Google publishing a production OKF bundle | **Not found.** Every bundle located was a sample, a demo, or a test fixture |
| Whether OKF ingestion is generally available in a Google product | **Not confirmed.** The launch blog says Knowledge Catalog "now ingests OKF"; no public documentation of a generally available capability was found |
| A published roadmap for v0.3 | **Not found.** The only forward-looking statement is the deferred list in spec section 12 |
| Independent benchmarks of agent accuracy with and without an OKF bundle | **Not found.** The premise that curated context improves agent answers is asserted, not measured, in every source located |

That last one matters most. OKF's entire justification is that agents answer better with
curated context. No published evidence establishes by how much, for which tasks, or
whether OKF's particular shape beats simply putting good Markdown in a folder.

## An honest read

**What is genuine:** an active specification process with real external participation, a
working reference implementation, four complete sample bundles, eight independent tools,
and a specification that revised itself substantially within six weeks of shipping. The
attestation design in 04 is a real contribution with no
close equivalent.

**What is not yet demonstrated:** production use outside Google, any measured benefit,
a maintainer process that keeps up with its own contributors, and working code for
roughly half of what v0.2 specifies. See Finding 0 in
06: `verified`, `stale_after`, and `Attested Computation`
appear in no bundle Google's own agent produced, and no shipped code reads any of the
five attestation fields.

**The risk to weigh:** OKF is a file format, so the cost of adopting it and later
abandoning it is low. Your knowledge stays as Markdown in a directory either way. That
asymmetry is the strongest practical argument for trying it, and it is stronger than any
adoption number above.

## Sources

- Repository statistics, issue and pull request counts: GitHub API against
  [GoogleCloudPlatform/knowledge-catalog](https://github.com/GoogleCloudPlatform/knowledge-catalog),
  read 2026-08-13
- Third-party repository statistics: GitHub API, each repository read individually
- Launch announcement:
  [How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing),
  Google Cloud, 2026-06-12
- Coverage:
  [Search Engine Journal](https://www.searchenginejournal.com/google-cloud-announces-the-open-knowledge-format/579253/),
  [MarkTechPost](https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/),
  [GitBook](https://www.gitbook.com/blog/what-is-okf-open-knowledge-format)

---

<!-- 11archive-source: 09-adoption-playbook.md -->

# Adoption playbook

What to do if you want to try OKF, in the order to do it. Everything here is grounded
in the spec and in the four bundles Google ships.

## Should you adopt it at all

Three honest cases.

**Good fit.** You already keep documentation in Git as Markdown, you are pointing an
agent at it, and you want that agent to stop inventing SQL. OKF costs you a frontmatter
block per file and gives you structure a program can filter on.

**Poor fit.** Your knowledge lives in a catalog product that already serves it to your
tools, and nothing is asking you to move it. OKF is a file format, not a system. It
will not index, search, serve, or authorise anything for you.

**Wait.** You need cryptographic guarantees about who verified what, you need
column-level lineage, or you need a validator you did not write. All three are missing
in v0.2, and two are explicitly deferred to a future revision.

## Directory layouts that already work

The spec does not prescribe a layout. Google's own bundles use two shapes.

**Data catalog shape**, from `ga4`, `stackoverflow`, and `crypto_bitcoin`:

```
bundle/
  index.md
  datasets/       one file per dataset
  tables/         one file per table
  references/     supporting material
    metrics/      metric definitions
    joins/        how tables join
```

**Governed metrics shape**, from `acme_retail`:

```
bundle/
  index.md
  log.md
  tables/         the data
  metrics/        business definitions
  computations/   Attested Computations, one per figure
  policies/       source-of-truth policy documents
  skills/         executor instructions
  attesters/      deterministic checking code
```

The second is the more interesting one. It separates what a number *means* (`metrics/`)
from how it is *calculated* (`computations/`) from the authority that *decides*
(`policies/`). A metric file narrates and links; the computation file is the only thing
an agent may run.

Start with whichever matches your domain. Directory names are yours.

## A starter type vocabulary

`type` values are not registered anywhere. Google's bundles use seven. A reasonable
starting set:

| Type | For |
|---|---|
| `Dataset`, `Table` | Data assets. Prefix with your platform if useful |
| `Metric` | What a number means |
| `Attested Computation` | The sanctioned way to calculate it |
| `Policy` | The authority a definition rests on |
| `Reference` | Supporting material, joins, enumerations |
| `Playbook` | Steps a person or agent follows |
| `Skill` | Instructions for running something |

Pick descriptive, self-explanatory values, and keep the list short. Readers must
tolerate unknown types, so a mismatch with someone else's vocabulary degrades
gracefully rather than breaking.

## Nine rules for producers

1. **Put `type` on every concept file.** It is the only required field and the only
   thing conformance checks.
2. **Write `description`.** Index generators, search snippets, and previews all use it.
   A concept without one is invisible in listings.
3. **Write `tags` as a list.** `tags: [a, b, c]`. Eight of Google's own files get this
   wrong; see 06.
4. **Quote every date and timestamp.** Otherwise the type your reader gets depends on
   who wrote the file.
5. **Split your path convention by field.** Body links: use file-relative paths, because
   a leading `/` resolves against the repository root on GitHub and breaks once your
   bundle is a subdirectory. Frontmatter path fields: use a leading `/`, because they
   are never rendered as links and the slash removes a real ambiguity. The spec and the
   reference agent disagree on this; see 06.
6. **Use the `human:` prefix accurately.** Trust tiers depend on it; nothing validates
   it.
7. **Set `stale_after` from your real review cycle.** A date you invented is worse than
   no date.
8. **Deprecate, do not delete.** `status: deprecated` keeps old links and old reports
   working.
9. **Generate `index.md` files.** They are how an agent navigates without loading the
   whole bundle.

## Six rules for consumers

1. **Never reject a bundle** for a missing optional field, an unknown `type`, an unknown
   key, a broken link, or a missing `index.md`. Section 11 requires this.
2. **Treat a bare `verified` mapping as a one-item list.** This is a MUST in the spec.
3. **Handle `generated.at` as both a string and a date object.** Both occur in
   Google's own bundles.
4. **Coerce `tags` before iterating.** If it is a string you will otherwise loop over
   characters.
5. **Try both path readings.** Document-relative first, then bundle-root.
6. **Check `stale_after` and act on it.** Nothing does this for you.

## Migrating from v0.1 to v0.2

Two renames and a set of additions. A v0.1 bundle is still readable by a v0.2 reader.

**Required changes:**

| v0.1 | v0.2 | Note |
|---|---|---|
| `timestamp: '...'` | `generated: { by: ..., at: '...' }` | `by` is required. Readers MAY still fall back to `timestamp` |
| Body `# Citations` list | `sources:` in frontmatter | Readers SHOULD read `sources`, MAY still parse the old list |

**Optional additions**, all of which mean nothing changes if you skip them:

- `sources` credibility signals: `author`, `usage_count`, `last_modified`, plus
  `usage_window`
- `verified`, `status`, `stale_after`
- The `Attested Computation` type and its five fields
- The `# Computation` body heading
- The actor convention for `generated.by` and `verified[].by`

Everything else carries forward unchanged: bundle structure, reserved filenames, the
required `type`, `title`/`description`/`resource`/`tags`, links, index files, log files,
and the permissive conformance rules.

**Do not declare `okf_version` casually.** It goes only in a bundle-root `index.md`,
the single place frontmatter is allowed in an index file.

## Build a validator first

OKF ships no validator. `document.py`'s `validate()` checks that `type` is present and
nothing else. Section 11 conformance is so permissive that all four of Google's bundles
pass it while carrying the defects in 06.

So conformance is not a useful gate. Build a stricter check before you have 400 files.
The checklist is at the end of
05-yaml-frontmatter-best-practices.md.

Two checks matter more than the rest:

- **`tags` is a list.** The single most common real defect.
- **Path values resolve.** Under whichever rule you standardise on, stated explicitly.

## Handle the round-trip problem before it bites

If agents will rewrite your bundle, and OKF's premise is that they will, decide now how
files get written.

Python's `yaml.safe_dump`, which OKF's reference implementation uses, converts every
compact `{ ... }` to a block mapping, re-wraps long lines, and rewrites timestamps.
Reading and writing one unchanged file produced a 52-line diff in
06.

Two workable options:

- **Use `ruamel.yaml` in round-trip mode.** It preserves style, quoting, comments, and
  key order. This keeps the compact style the spec itself uses.
- **Or standardise on block style everywhere** and accept the verbosity. Then
  `safe_dump` output matches what people write, and diffs stay small.

Choose one and enforce it in the validator. The failure mode of choosing neither is
that every automated edit produces an unreviewable diff, which quietly removes the
version-control benefit the format exists for.

## A first week

| Day | Task |
|---|---|
| 1 | Pick 10 to 20 concepts that matter. Not everything |
| 2 | Choose a directory layout and a type vocabulary. Write them down |
| 3 | Write the concepts, `type` and `description` first |
| 4 | Add links between them. Generate `index.md` files |
| 5 | Write the validator. Run it. Fix what it finds |
| 6 | Add `generated`, and `verified` only where a real check happened |
| 7 | Point an agent at it and ask questions you know the answers to |

Day 7 is the real test. If the agent answers correctly from the bundle, the format is
doing its job. If it does not, the problem is almost always missing `description`
fields or missing links, not the format.

Add `Attested Computation` only once the plain bundle works, and only for numbers where
a wrong answer actually costs something.

## Sources

- OKF v0.2 specification, sections 3, 4, 8, 11, 12, 13:
  [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Bundle layouts observed in
  [okf/bundles/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf/bundles)

---

<!-- 11archive-source: 10-glossary.md -->

# Glossary

Terms used in this report. Terms marked **(OKF)** are defined by the specification;
the rest are general.

| Term | Meaning |
|---|---|
| **Actor** (OKF) | Who or what did something. Written as `human:alice`, `process:nightly-job`, or `agent_name/version`. |
| **Attestation** (OKF) | Checking that a single run produced its number the sanctioned way. Happens at runtime, on every call, and is never stored in the bundle. |
| **Attested Computation** (OKF) | A concept holding the one approved way to calculate a value, so a reader can confirm an agent ran it rather than improvising. |
| **Attester** (OKF) | Plain deterministic code, with no AI model involved, that inspects a receipt and returns pass or fail. |
| **Block style** | YAML written one key per line, indented. The opposite of flow style. |
| **Body** (OKF) | Everything in a concept file after the frontmatter. Ordinary Markdown. |
| **Bundle** (OKF) | A directory of OKF files. The unit you ship. |
| **Byte order mark** | An invisible marker some editors put at the start of a file. Breaks readers that expect `---` as the first characters. |
| **Chomping indicator** | The `-` or `+` after a YAML block scalar marker, controlling trailing newlines. `\|-` strips them. |
| **Concept** (OKF) | One unit of knowledge, stored as one Markdown file. |
| **Concept ID** (OKF) | The file's path inside the bundle with `.md` removed. |
| **Conformance** (OKF) | The three-rule test in section 11: frontmatter parses, `type` is non-empty, reserved files follow their format. |
| **Credibility signal** (OKF) | An objective fact about a source (`author`, `usage_count`, `last_modified`) from which a reader infers trust. OKF records signals, never a score. |
| **Deprecated** (OKF) | `status: deprecated`. Kept so old links and reports work; no longer current. |
| **Diffable** | You can see line by line what changed between two versions. The reason the format is text. |
| **Executor** (OKF) | Instructions or code that runs a computation and returns a receipt. |
| **Flow style** | Compact YAML using `{ }` and `[ ]` on one line. Used throughout OKF's examples. |
| **Frontmatter** | A block of YAML at the top of a Markdown file, fenced by `---`. No formal standard defines it. |
| **Implicit typing** | YAML guessing what a value means from how it looks. The root of most YAML surprises. |
| **Index file** (OKF) | `index.md`. Lists a directory's contents so a reader can see what exists before opening anything. Carries no frontmatter, except `okf_version` at the bundle root. |
| **ISO 8601** | The international date and time format, for example `2026-05-28T14:30:00Z`. |
| **Lifecycle** (OKF) | Whether a concept is current: `status` and `stale_after`. |
| **Link** (OKF) | An ordinary Markdown link between concepts. Asserts a relationship without saying what kind. |
| **Log file** (OKF) | `log.md`. History of changes, newest first, grouped by ISO date. |
| **Norway problem** | YAML 1.1 reading `NO` as the boolean false. Named for the country code. |
| **Octal** | Base 8. YAML 1.1 reads a leading zero as octal, so `02134` becomes `1116`. |
| **Progressive disclosure** (OKF) | Letting a reader see what is available before opening it. The reason `index.md` exists. |
| **Provenance** (OKF) | The set of sources a concept derives from. Recorded in `sources`. |
| **Receipt** (OKF) | Evidence a run returns, shaped by `executor.receipt`. A runtime object, never stored. |
| **Reserved filename** (OKF) | `index.md` and `log.md`. Cannot be used for concepts. |
| **Round-trip** | Reading a file and writing it back. Lossless if formatting survives; OKF's reference writer is not lossless. |
| **Runtime** (OKF) | How a computation is executed: `bigquery`, `dbt`, `python`. Decides what `parameters` mean. |
| **Sexagesimal** | Base 60. YAML 1.1 reads `22:53` as `1373`. |
| **Source** (OKF) | Material a concept derives from, internal or external. |
| **Stale** (OKF) | Today's date is on or after `stale_after`. |
| **Trust tier** (OKF) | One of unverified, machine-confirmed, or human-reviewed. Calculated from `verified` on read, never written into a file. |
| **Verified** (OKF) | The field recording who confirmed a concept's content against its sources. Distinct from who wrote it. |
| **YAML** | The text format used for frontmatter. Version 1.1 (2005) and 1.2 (2009) differ in ways that matter; PyYAML still implements 1.1. |

---

<!-- 11archive-source: 11-methodology-and-sources.md -->

# Methodology and sources

## What this report is based on

The specification itself, its reference implementation, and its four example bundles,
read directly from the source repository. Secondary coverage was used only to establish
dates, authorship, and reception, and is marked as such below.

**Primary sources take precedence everywhere.** Where coverage disagrees with the
specification text, the specification wins. Every structural claim about OKF in this
report was checked against the specification file or the shipped code, never against an
article.

One correction is worth recording, because an earlier draft of this research made the
mistake. Initial searches surfaced only June 2026 articles, all describing v0.1, and the
draft concluded that the published record was stale. An adversarial check refuted it:
Google published its own v0.2 announcement on the day v0.2 landed, and several
publications covered it within a week. The June articles describe v0.1 because v0.2 did
not exist yet. The lesson applied throughout: a search that returns one kind of result
is evidence about the search, not about the world.

## Evidence states used

Following the house convention, every claim in this report falls into one of these:

| State | Meaning | Example in this report |
|---|---|---|
| **Observed** | Measured directly by running code | The 8 files with a string `tags` value |
| **Source-reported** | Stated by the specification or repository | Field definitions, normative rules |
| **Calculated** | Derived from observed data | Concept counts, type frequencies |
| **Inferred** | Reasoned from evidence, labelled as such | Why the viewer coerces `tags` |
| **Unavailable** | Could not be established | Listed at the end of this section |

## How the audit was run

Repository cloned at commit `374e0bc4c644310ff56cdf9c0fe81eccdec862b0`, dated
2026-08-07:

```bash
git clone --depth 1 https://github.com/GoogleCloudPlatform/knowledge-catalog.git
```

Every Markdown file under `okf/bundles/` was parsed with **the same logic the reference
implementation uses**, so the results describe what OKF's own tooling sees. That logic,
from `okf/src/reference_agent/bundle/document.py`:

- the first line must be exactly `---` after trimming whitespace
- the block ends at the next line that is exactly `---` after trimming
- the block is parsed with PyYAML's `yaml.safe_load`, which implements YAML 1.1
- the result must be a mapping

Checks applied to each file:

| Check | Against |
|---|---|
| Frontmatter parses; `type` present and non-empty | Spec section 11 |
| `tags` is a list | Spec section 4.1 |
| Value type of every field, after YAML type conversion | Spec sections 4.1, 5 |
| `executor.resource`, `attester.resource`, `computation`, `sources[].resource` resolve | Spec section 6.2 |
| Body link targets resolve | Spec section 6.1 |
| Reserved files carry no unexpected frontmatter | Spec sections 8, 12 |
| `Attested Computation` files declare `runtime` | Spec section 10.2 |

Path values were resolved twice, once treating a bare relative path as relative to the
containing file and once as relative to the bundle root, because the specification does
not say which applies. Both results are reported in
06-conformance-audit.md.

**Versions used:** Python 3.13, PyYAML 6.0.3, ruamel.yaml 0.19.1.

### Reproducing the parser comparison

The YAML 1.1 against 1.2 table in
05-yaml-frontmatter-best-practices.md was
generated by parsing identical input with both libraries:

```python
import io, yaml
from ruamel.yaml import YAML
r12 = YAML(typ="safe")            # YAML 1.2

for src in ["country: NO", "build: 010", "zip: 02134", "duration: 22:53"]:
    v11 = list(yaml.safe_load(src).values())[0]          # PyYAML, YAML 1.1
    v12 = list(r12.load(io.StringIO(src)).values())[0]   # ruamel, YAML 1.2
    print(f"{src:<20} 1.1={v11!r:<12} 1.2={v12!r}")
```

Output:

```
country: NO          1.1=False       1.2='NO'
build: 010           1.1=8           1.2=10
zip: 02134           1.1=1116        1.2=2134
duration: 22:53      1.1=1373        1.2='22:53'
```

### Reproducing the round-trip finding

Finding 5 in 06 used the reference implementation's own
parse and serialise methods, with no edit between them:

```python
import sys, difflib
sys.path.insert(0, "okf/src")
from reference_agent.bundle.document import OKFDocument

path = "okf/bundles/acme_retail/computations/revenue-ytd.md"
original = open(path, encoding="utf-8").read()
rewritten = OKFDocument.parse(original).serialize()
print("\n".join(difflib.unified_diff(
    original.splitlines(), rewritten.splitlines(), lineterm="")))
```

Result: 52 diff lines on an unchanged file.

### Reproducing the viewer crash

Finding 4 in 06. One file, no bundle needed:

```python
import sys, pathlib, tempfile
sys.path.insert(0, "okf/src")
from reference_agent.viewer.generator import _walk_concepts

d = pathlib.Path(tempfile.mkdtemp()) / "b"; d.mkdir()
(d / "m.md").write_text(
    "---\ntype: Metric\nstale_after: 2026-09-23T00:00:00Z\n---\n\nBody.\n")
_walk_concepts(d)
```

Raises `TypeError: '>=' not supported between instances of 'datetime.date' and
'datetime.datetime'`.

### Reproducing the two-implementation divergence

Finding in 05. Compare the two frontmatter
readers Google ships in one repository:

| File | Line | Closing-fence test |
|---|---|---|
| `okf/src/reference_agent/bundle/document.py` | 32 | `lines[i].strip() == "---"` |
| `toolbox/mdcode/src/libts/layouts/documents.ts` | 190 | `lines.indexOf('---', 1)` |

The Python test trims whitespace first, so an indented `---` closes the block. The
TypeScript test matches exactly, so it does not. `toolbox/mdcode/package.json` declares
`yaml ^2.8.4`, a YAML 1.2 library whose core schema has no timestamp type, which is why
the same `at:` value arrives as a string there and a `datetime` in Python.

### Reproducing the producer and consumer gaps

Finding 0 in 06. Field coverage was counted by parsing every
concept in `okf/bundles/` and testing key presence. The consumer side is a plain search
for the five computation field names as string literals anywhere under `okf/src/`, which
returns no matches.

## Cross-format parity

The HTML report and the Markdown files render from the same text. The HTML adds
navigation and table interaction. It adds no facts. Any number appearing in both comes
from the same source.

## Limitations

Stated plainly.

- **One point in time.** The specification moved from 0.1 to 0.2 in six weeks. It may
  have moved again since commit `374e0bc`.
- **Four bundles is a small sample.** The defect rates in
  06 describe Google's examples, not a survey of production
  bundles. No production OKF bundles were available to examine.
- **The audit checks structure, not truth.** Whether a bundle's *content* is correct is
  outside its scope.
- **Attestation was not executed.** Running the reference attester requires BigQuery
  credentials and a billed project. Its behaviour was established by reading the code,
  not by running it. This is stated at each point in
  04.
- **Round-trip behaviour was tested for Python only.** A JavaScript producer using
  `js-yaml` will differ.
- **The TypeScript implementation was read, not run.** The divergence in
  05 rests on reading `documents.ts` and
  `package.json`, not on executing them. No Node toolchain was set up for the vendor's
  code.
- **The repository test suite was never run.** `okf/tests/` was read only.
- **Bundle files were not hash-verified against the live repository.** `SPEC.md` was;
  the bundle files were checked against a shallow clone whose single squashed commit
  matches the current `main` tip, which is weaker evidence.
- **The `usage_count` and credibility signals were never exercised**, because no shipped
  code consumes them.

## What could not be established

Absence of evidence is a finding, so it is recorded rather than glossed over. Four
questions could not be answered from any source located: whether any organisation
outside Google runs OKF in production, whether OKF ingestion is generally available in
a Google product, whether a v0.3 roadmap exists beyond the deferred list in
specification section 12, and whether curated context measurably improves agent
accuracy. Each is recorded with what was searched in the table at the end of
08-adoption-and-reception.md.

## Primary sources

| Source | Use |
|---|---|
| [okf/SPEC.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) | The specification. Every normative claim |
| [okf/README.md](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md) | Design rationale, tooling description |
| [okf/src/reference_agent/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf/src/reference_agent) | Parsing, serialising, viewer behaviour |
| [okf/bundles/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf/bundles) | The four example bundles audited |
| [okf/bundles/acme_retail/attesters/sql_equality.py](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/bundles/acme_retail/attesters/sql_equality.py) | The only working attester |
| [toolbox/mdcode/](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/toolbox/mdcode) | The second implementation, and the Knowledge Catalog round trip |
| [Repository README](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/README.md) | The Knowledge Catalog and Dataplex context |
| Repository commit history, issues, and pull requests via the GitHub API | Version dates, adoption counts |

## Version dates

Established from commit history on `okf/SPEC.md`:

| Version | Date | Commit message |
|---|---|---|
| v0.1 | 2026-06-12 | "Import Open Knowledge Format reference enrichment agent (#28)" |
| v0.2 | 2026-07-24 | "okf: migrate format and tooling to Open Knowledge Format v0.2 (#227)" |

Both authored by `amir.hormati`. The repository is licensed Apache 2.0.

## Standards referenced for comparison

- [YAML 1.2.2](https://yaml.org/spec/1.2.2/) and [YAML 1.1](https://yaml.org/spec/1.1/)
- [in-toto](https://in-toto.io/), [SLSA](https://slsa.dev/),
  [Sigstore](https://www.sigstore.dev/), [C2PA](https://c2pa.org/)
- [W3C PROV-O](https://www.w3.org/TR/prov-o/),
  [W3C DCAT](https://www.w3.org/TR/vocab-dcat-3/)
- [Frictionless Data Package](https://datapackage.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [llms.txt](https://llmstxt.org/)
