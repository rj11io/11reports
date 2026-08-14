<!-- 11archive-source: README.md -->

# Frontmatter Beyond YAML: The Language Conventions

Markdown frontmatter has no standard. No RFC, no W3C note, nothing. Every tool
implements its own reader, so the metadata block at the top of a Markdown file might be
YAML, TOML, JSON, JavaScript, a bare list of key-value lines, or in one common case
TypeScript.

This report catalogues the conventions actually in use, measures what each language does
to your values, and says which one to pick.

## Read this first

**YAML is the default, not the rule, and it is the only one that guesses.** Written the
natural way, ten of eleven test values come back as something other than the text typed:
`NO` becomes `False`, the postcode `02134` becomes `1116`, `22:53` becomes `1373`. TOML
rejects those inputs at parse time instead. JSON has no comments. Two older conventions
do no type conversion at all.

## Contents

| If you want | Read |
|---|---|
| The short version | 00 Executive brief |
| Every convention and its delimiters | 01 The catalog |
| **What each language does to your values** | 02 What the parser does |
| Why `---` is ambiguous | 03 Delimiter collisions |
| Which tools accept what, and how to choose | 04 Tool support and choosing |
| How this was checked | 05 Methodology and sources |

## What is original here

**A measured comparison of the three data languages on identical metadata.** The same
eleven values through PyYAML, Python's `tomllib`, and `json`, with the resulting types
recorded. This includes the parse-time rejection tests, which are the real difference
between YAML and TOML: TOML refuses `country = NO`, `draft = yes`, and duplicate keys,
where YAML accepts all three and silently returns the wrong thing. Full script in
05.

## Scope

**Covered:** the frontmatter conventions in common use, their exact delimiters, how each
language types values, where delimiters collide, which tools accept which formats, and
how to choose.

**Not covered:** an exhaustive survey of every project that invented its own convention.
Usage share, because no reliable figure exists. Tool behaviour beyond what each tool
documents, since none were installed and exercised.

Evidence boundary: tool documentation and language specifications read on 2026-08-14,
plus parser measurements run the same day on Python 3.13.5.

## Related

The YAML-specific failure modes here are covered in depth, applied to a real
specification built on them, in the companion report
[Google's Open Knowledge Format: A Working Reference](https://01kzxzhgv0h542j4y6jhdzt8kk.reports.rj11.io).

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The short answer

**Yes, there are several. YAML is the default, not the rule.** Markdown frontmatter has
no standard, so each tool picked its own language and its own delimiter.

| Language | Delimiters |
|---|---|
| YAML | `---` … `---` |
| TOML | `+++` … `+++` |
| JSON | `{` … `}`, or `---json` … `---` |
| JavaScript | `---js` … `---` |
| MultiMarkdown key-value | none, ends at the first blank line |
| Org keywords | `#+TITLE:` lines |
| reStructuredText fields | `:field: value` lines |

## The five findings

1. **YAML is the only portable choice.** Ten of the twelve tools checked read it; the
   two that do not use their own key-value convention rather than another language. Only
   Hugo and Zola read TOML. The documentation and note tools, Jekyll, Docusaurus,
   Obsidian, and Quarto, accept YAML and nothing else. If a file must work across tools,
   the decision is already made for you.

2. **TOML turns silent wrong answers into loud errors.** Measured on the same eleven
   values: YAML returns something other than the literal text in ten of them. `NO`
   becomes `False`, `02134` becomes `1116`, `22:53` becomes `1373`, `1.10` becomes
   `1.1`. TOML rejects the ambiguous forms at parse time instead of guessing, and
   rejects duplicate keys, which YAML and JSON both accept silently.
   (02)

3. **`---` is the least self-describing delimiter and the most popular.** In an `.astro`
   file it opens a block of TypeScript, by Astro's own account "directly inspired by"
   frontmatter. In a Markdown body it is a horizontal rule. In Pandoc it may appear
   anywhere in the document and close with `...`. `+++` and labelled fences like
   `---toml` say what they are; `---` does not. (03)

4. **Some conventions do no typing at all, and that is a feature.** MultiMarkdown and
   the Python-Markdown extension hand you text and nothing but text. Python-Markdown
   goes further and returns every value as a list of strings. Nothing can silently
   become a boolean, because nothing is ever converted. (01)

5. **JavaScript frontmatter trades readability for computation.** Eleventy's `---js` and
   MDX's `export const meta` let you compute metadata at build time. The cost is that
   reading the metadata now means executing the file.

## What to do

**Publishing through an existing tool:** check the table in
04 first. Most tools give you no choice.

**You control the toolchain and the metadata is machine-consumed:** prefer TOML. Every
failure mode in this report becomes a parse error rather than a wrong value.

**You are stuck with YAML, which you probably are:** quoting is the entire discipline.
Quote anything that is not obviously a word, quote every date, use only `true` and
`false`, and write lists as lists. That removes almost all of it.

**You are designing a format others will implement:** name the language *and its
version*. "YAML frontmatter" does not specify a format, because YAML 1.1 and 1.2
disagree about booleans and octal numbers, and which one a reader gets depends on the
library it installed. Also say where the block ends: whether `...` closes it, whether an
indented `---` closes it, and whether it must start at line 1.

## Confidence

The typing comparison in 02 was measured directly and is
reproducible from 05. Every delimiter and support claim
comes from the tool's own documentation, cited per row. The tools were not installed and
exercised, so the support matrix reflects what they document rather than what they do.

---

<!-- 11archive-source: 01-the-catalog.md -->

# The catalog

Every frontmatter convention in common use, with its exact delimiters. The delimiter is
the important part: it is how a tool decides which language it is about to parse.

## The fenced languages

These put a metadata block at the top of the file between two marker lines.

### YAML, fenced by `---`

The original and the default nearly everywhere.

```markdown
---
title: My page
tags: [a, b]
---

Body starts here.
```

Jekyll introduced it in 2008 and requires it: "The front matter must be the first thing
in the file and must take the form of valid YAML set between triple-dashed lines."
Jekyll supports no other language.

### TOML, fenced by `+++`

```markdown
+++
title = "My page"
tags = ["a", "b"]
+++
```

Hugo supports it. Zola prefers it: "The TOML front matter is a set of metadata embedded
in a file at the beginning of the file enclosed by triple pluses (`+++`)." Zola accepts
YAML only "to ease porting legacy content".

### JSON, fenced by braces

Hugo takes a bare JSON object with no separate fence. The braces are the delimiter:

```markdown
{
  "title": "My page",
  "tags": ["a", "b"]
}
```

### Labelled fences: `---toml`, `---json`, `---js`

A different approach: keep the `---` fence and name the language on the opening line.
This comes from `gray-matter`, the JavaScript library most static site tools use, and it
propagates to everything built on it.

```markdown
---toml
title = "My page"
---
```

`gray-matter` handles YAML, JSON, and JavaScript out of the box, detects the language
"defined after the first delimiter", and accepts custom engines for anything else.

Eleventy inherits exactly this, supporting `yaml`, `json`, and `js`:

```markdown
---js
const title = "My page title";
---
```

JavaScript frontmatter is worth pausing on. It is executable code, not data. That buys
computed values and costs you the ability to read the metadata without running it.

## The unfenced conventions

These have no delimiters at all. The block ends at the first blank line.

### MultiMarkdown metadata

```markdown
Title: A New MultiMarkdown Document
Author: Fletcher T. Penney
Date: July 25, 2005

The body starts after the blank line.
```

There must be no whitespace above the block, and it ends at the first blank line. Keys
start at the beginning of the line.

### Python-Markdown Meta-Data

Nearly the same shape, and it accepts an optional `---` fence too. Two details matter:
the block "ends at the first blank line or a closing delimiter (`---` or `...`)", and
**every value is a list of strings**:

```markdown
Title:   My Document
Authors: Waylan Limberg
         John Doe
```

parses to `{'title': ['My Document'], 'authors': ['Waylan Limberg', 'John Doe']}`.

No type inference happens at all. A value is text, always. Section
02 shows why that is a feature.

### Org-mode keywords

Emacs org files use keyword lines rather than a block. Hugo reads these for org content.

```
#+TITLE: My page
#+DATE: 2026-09-23
#+TAGS: a b
```

### reStructuredText field lists

Sphinx and reStructuredText use a docinfo field list:

```rst
:Author: Jane Doe
:Version: 1.10
```

## The near-misses

Two conventions that look like frontmatter and are not.

### Pandoc YAML metadata blocks

Fenced by `---`, so it looks identical. Two differences bite:

- It may be closed by `...` instead of `---`.
- It does **not** have to be the first thing in the file.

```markdown
Some prose can come first.

---
title: My document
...

More prose.
```

A strict frontmatter reader that requires the block at line 1 and a `---` terminator
sees no metadata here. Quarto and R Markdown build on this.

### Astro's component script

The sharpest trap in this report, because Astro says so itself:

> "Astro uses a code fence (`---`) to identify the component script in your Astro
> component. If you've ever written Markdown before, you may already be familiar with a
> similar concept called *frontmatter*. Astro's idea of a component script was directly
> inspired by this concept."

The block contains TypeScript, not YAML:

```astro
---
import Layout from "../layouts/Base.astro";
const posts = await getCollection("blog");
---
<Layout>...</Layout>
```

Meanwhile Astro *content collections* use real YAML frontmatter in `.md` files. So in
one framework the same three characters open a YAML block in one file type and a
TypeScript block in another.

### MDX and ESM exports

MDX files can export metadata as a JavaScript binding instead of a frontmatter block:

```mdx
export const meta = { title: "My page" }
```

Same idea as `---js`: executable, not readable without running it.

## At a glance

| Format | Delimiters | Typed values | Comments |
|---|---|---|---|
| YAML | `---` … `---` | Inferred, aggressively | Yes |
| TOML | `+++` … `+++` | Declared by syntax | Yes |
| JSON | `{` … `}` | Declared by syntax | **No** |
| Labelled fence | `---toml`, `---json`, `---js` … `---` | Per language | Per language |
| JavaScript | `---js` … `---` | Executable | Yes |
| MultiMarkdown | none, ends at first blank line | No, text only | No |
| Python-Markdown Meta | none or `---`, ends at blank line, `---`, or `...` | No, lists of strings | No |
| Org keywords | `#+KEY:` lines | No, text only | Yes |
| rST field list | `:field:` lines | No, text only | Yes |
| Pandoc YAML block | `---` … `---` or `...`, anywhere in file | Inferred | Yes |
| Astro component script | `---` … `---` | **It is TypeScript** | Yes |

## Sources

- [Jekyll front matter](https://jekyllrb.com/docs/front-matter/)
- [Hugo front matter](https://gohugo.io/content-management/front-matter/)
- [Zola pages](https://www.getzola.org/documentation/content/page/)
- [Eleventy front matter](https://www.11ty.dev/docs/data-frontmatter/)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [MultiMarkdown metadata](https://fletcher.github.io/MultiMarkdown-6/syntax/metadata.html)
- [Python-Markdown Meta-Data](https://python-markdown.github.io/extensions/meta_data/)
- [Pandoc YAML metadata block](https://pandoc.org/MANUAL.html#extension-yaml_metadata_block)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)

---

<!-- 11archive-source: 02-what-the-parser-does.md -->

# What the parser does to your values

Original measurement for this report. The same eleven pieces of metadata, written the
natural way in each language, parsed once each. YAML through PyYAML, which implements
YAML 1.1 and is what most Markdown toolchains reach for. TOML through Python's built-in
`tomllib`. JSON through `json`.

Read the YAML column as "what you get if you type the obvious thing".

## The measurement

| YAML source | YAML 1.1 result | TOML result | JSON result |
|---|---|---|---|
| `country: NO` | `False` (bool) | `'NO'` (str) | `'NO'` (str) |
| `draft: no` | `False` (bool) | `False` (bool) | `False` (bool) |
| `archived: off` | `False` (bool) | `False` (bool) | `False` (bool) |
| `zip: 02134` | `1116` (int) | `'02134'` (str) | `'02134'` (str) |
| `build: 010` | `8` (int) | `'010'` (str) | `'010'` (str) |
| `duration: 22:53` | `1373` (int) | `'22:53'` (str) | `'22:53'` (str) |
| `version: 1.10` | `1.1` (float) | `'1.10'` (str) | `'1.10'` (str) |
| `stale_after: 2026-09-23` | `date(2026, 9, 23)` | `date(2026, 9, 23)` | `'2026-09-23'` (str) |
| `at: 2026-05-28T14:30:00Z` | `datetime` | `datetime` | `'2026-05-28T14:30:00Z'` (str) |
| `tags: [a, b, c]` | `['a','b','c']` (list) | `['a','b','c']` (list) | `['a','b','c']` (list) |
| `tags: a, b, c` | `'a, b, c'` (str) | rejected | `'a, b, c'` (str) |

One clarification, because the table is easy to misread. The TOML and JSON columns show
the value after writing the metadata correctly in that language, for example
`country = "NO"`. The YAML column shows what happens when you write it the way the
language invites you to. That asymmetry is the finding, not a trick: YAML lets you write
`NO` and quietly means something else, and TOML does not offer you the ambiguous form at
all.

## Ten of eleven YAML values are not what you typed

Every row where YAML returns something other than the literal text:

| Case | You wrote | YAML gave you |
|---|---|---|
| Country code | `NO` | `False` |
| Draft flag | `no` | `False` |
| Archived flag | `off` | `False` |
| Zip code | `02134` | `1116` |
| Build number | `010` | `8` |
| Time of day | `22:53` | `1373` |
| Version | `1.10` | `1.1` |
| Date | `2026-09-23` | a `date` object |
| Timestamp | `2026-05-28T14:30:00Z` | a `datetime` object |
| Tag list | `[a, b, c]` | a list |

The last three are wanted. The first seven are the reason this report exists.

`02134` becoming `1116` deserves a second look: YAML 1.1 reads the leading zero as
"base 8", so a Boston postcode silently becomes a different number. `22:53` becoming
`1373` is base 60, which is 22 times 60 plus 53.

## TOML fails loudly where YAML fails quietly

This is the real difference between the two, and it is bigger than the typing rules.

| Input | YAML 1.1 | TOML |
|---|---|---|
| `tags = a, b, c` | accepted as one string | **rejected at parse time** |
| `country = NO` | accepted as `False` | **rejected at parse time** |
| `draft = yes` | accepted as `True` | **rejected at parse time** |

TOML has no bare-word scalars, so an unquoted `NO` is not a value at all. You get a
parse error pointing at the line. YAML gives you a boolean and moves on.

The same holds for a mistake that is easy to make in a file an agent has edited several
times:

| Duplicate keys | Behaviour |
|---|---|
| YAML | `{'type': 'B'}`, last one wins, silently |
| JSON | `{'type': 'B'}`, last one wins, silently |
| TOML | **rejected**, duplicate key is an error |

## Where each language actually hurts

**YAML** guesses. That is its entire design and its entire problem. It is also the only
one of the three with a serious readability advantage for hand-edited metadata, which is
why it won.

**JSON** has no comments. Not "discouraged": there is no syntax for them, and a parser
rejects the attempt. For metadata a human maintains, losing the ability to write "left
blank on purpose, see ticket 412" is a real cost. JSON also cannot express a date; every
date is a string you parse yourself, which is either honest or annoying depending on your
mood.

**TOML** is more verbose, requires quotes, and its nested-table syntax gets awkward
quickly. For the flat key-value shape that frontmatter almost always is, none of that
matters much.

## The unfenced conventions dodge the problem entirely

MultiMarkdown metadata and the Python-Markdown Meta-Data extension do no type inference
at all. Every value is text, and Python-Markdown goes further: every value is a **list**
of strings, one per line.

```
Title:   My Document
Authors: Waylan Limberg
         John Doe
```

gives `{'title': ['My Document'], 'authors': ['Waylan Limberg', 'John Doe']}`.

Nothing can become `False`. Nothing can become octal. You do all conversion yourself,
which is more work and zero surprises. For metadata that is mostly titles, authors, and
tags, that trade is better than it sounds.

## What this means in practice

Three conclusions the measurement supports.

1. **If you control the format choice and your metadata is machine-consumed, TOML is
   the safer default.** Every failure mode in the table above becomes a parse error
   instead of a wrong value.
2. **If you are stuck with YAML, quoting is the whole discipline.** Every one of the
   seven bad rows is fixed by wrapping the value in quotes. There is no second technique.
3. **A format that only ever hands you strings is not primitive, it is honest.** It
   moves the conversion to code you can see and test.

## Reproducing this

Full script in 05-methodology-and-sources.md. The core
is three lines:

```python
import json, tomllib, yaml
yaml.safe_load("country: NO")     # {'country': False}
tomllib.loads('country = "NO"')   # {'country': 'NO'}
json.loads('{"country": "NO"}')   # {'country': 'NO'}
```

Versions: Python 3.13.5, PyYAML 6.0.3, `tomllib` from the standard library.

---

<!-- 11archive-source: 03-delimiter-collisions.md -->

# Delimiter collisions

The delimiter is how a tool decides what language it is reading. Nobody standardised
it, so the same three characters mean different things in different places, and some
tools guess wrong.

## `---` means at least four things

| Context | What follows `---` |
|---|---|
| Jekyll, Hugo, Obsidian, Docusaurus, a `.md` file almost anywhere | YAML metadata |
| An `.astro` component file | **TypeScript** |
| gray-matter with a language label, `---toml` | TOML, JSON, JavaScript, or a custom engine |
| Anywhere in a Pandoc document | YAML metadata, possibly closed by `...` |
| Inside a Markdown body | A horizontal rule |

That last one is not a joke. `---` on its own line in the body is standard Markdown for
a horizontal rule, which is why frontmatter readers only look at the top of the file,
and why a `---` inside a metadata block is dangerous.

## The Astro trap

Astro's documentation is explicit that the resemblance is deliberate:

> "Astro uses a code fence (`---`) to identify the component script in your Astro
> component. If you've ever written Markdown before, you may already be familiar with a
> similar concept called *frontmatter*. Astro's idea of a component script was directly
> inspired by this concept."

So in one Astro project:

- `src/pages/index.astro` opens with `---` containing TypeScript.
- `src/content/blog/post.md` opens with `---` containing YAML.

Same characters, same repository, two languages. A script that walks the project
extracting "frontmatter" will happily hand you a block of TypeScript and call it
metadata.

## Pandoc breaks two assumptions at once

Most frontmatter readers assume the block starts at line 1 and ends at `---`. Pandoc
assumes neither:

```markdown
Some prose can come first.

---
title: My document
...

More prose.
```

Two failures follow for a strict reader. It finds no metadata, because line 1 is not
`---`. And if it did start scanning, `...` is not a closing marker it recognises, so it
would run to the end of the file or error.

The `...` terminator is legal YAML: it marks the end of a YAML document. Most frontmatter
readers simply do not implement it.

## The unfenced conventions have the opposite problem

MultiMarkdown metadata and Python-Markdown Meta-Data have no opening delimiter at all.
The block is "the lines before the first blank line", provided the file starts with
something shaped like `Key: value`.

That is ambiguous in a way fences are not. This file:

```markdown
Note: this document is a draft
And here is the first paragraph of the body.
```

is a document with one metadata key and no body under MultiMarkdown rules, and a
document with no metadata and a two-line paragraph under every fenced convention. The
text alone cannot tell you which was meant.

MultiMarkdown constrains this a little: the key must start at the beginning of the line,
begin with an ASCII letter or number, and contain only letters, numbers, spaces, hyphens,
or underscores. It narrows the ambiguity without removing it.

## What a reader can and cannot detect

Detection by delimiter works for the fenced formats and fails for the rest:

| Format | Detectable from the first line? |
|---|---|
| TOML | **Yes**, `+++` is unambiguous |
| JSON, Hugo style | **Yes**, `{` is unambiguous |
| Labelled fence | **Yes**, the label says so |
| YAML | Ambiguous, `---` is shared with Astro and Pandoc |
| MultiMarkdown, Python-Markdown | **No**, it is a heuristic on the text |
| Org keywords, rST fields | **Yes** in practice, `#+` and `:field:` are distinctive |

This is the strongest practical argument for `+++` and for labelled fences: they say what
they are. YAML's `---` is the most popular and the least self-describing.

## The three rules that follow

1. **Never let a bare `---` appear inside a metadata block.** Quote the value or use a
   different marker. Under most readers it silently ends the block early and the
   remaining keys vanish with no error.
2. **Put the block at line 1, with nothing above it.** No blank line, no comment, no
   byte order mark. An invisible byte order mark defeats a reader that compares the first
   line to `---` exactly.
3. **Do not write a tool that assumes `---` means YAML.** Check the file type first, and
   if you support more than one language, prefer a labelled fence so the file tells you
   rather than you guessing.

## Sources

- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Pandoc YAML metadata block](https://pandoc.org/MANUAL.html#extension-yaml_metadata_block)
- [MultiMarkdown metadata](https://fletcher.github.io/MultiMarkdown-6/syntax/metadata.html)
- [Python-Markdown Meta-Data](https://python-markdown.github.io/extensions/meta_data/)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

---

<!-- 11archive-source: 04-tool-support-and-choosing.md -->

# Tool support, and choosing

## Who supports what

Every row checked against the tool's own documentation on 2026-08-14. "Own" means the
tool uses its own key-value convention rather than a general-purpose data language.

| Tool | YAML | TOML | JSON | JavaScript | Notes |
|---|---|---|---|---|---|
| Jekyll | Yes, only | No | No | No | Must be the first thing in the file |
| Hugo | Yes, `---` | Yes, `+++` | Yes, `{ }` | No | Picks the format from the delimiter |
| Zola | Yes, legacy only | Yes, `+++`, preferred | No | No | YAML accepted "to ease porting" |
| Eleventy | Yes, default | Via a custom engine | Yes, `---json` | Yes, `---js` | Built on gray-matter |
| gray-matter | Yes, default | Via a custom engine | Yes | Yes | Detects the label after the fence |
| Docusaurus | Yes, only | No | No | No | "The content is parsed as YAML" |
| Obsidian | Yes | No | Input only | No | JSON is "read, interpreted, and saved as YAML" |
| Quarto, R Markdown | Yes | No | No | No | Pandoc lineage |
| Pandoc | Yes | No | No | No | Block may sit anywhere and close with `...` |
| MultiMarkdown | Own | No | No | No | No delimiters, ends at first blank line |
| Python-Markdown | Own, `---` optional | No | No | No | Every value is a list of strings |
| Astro | Yes, in content files | No | No | Component script | `---` in `.astro` is TypeScript |

Two patterns stand out.

**YAML is near-universal and everything else is not.** Ten of the twelve tools read YAML.
The two that do not, MultiMarkdown and Python-Markdown, use their own key-value
convention rather than a different data language. Only Hugo and Zola take TOML, and JSON
support is mostly a side effect of using gray-matter. If you need one file to work across
many tools, YAML is the only answer.

**The tools that offer a choice are the static site generators.** Documentation and
note-taking tools all picked YAML and stopped. That is worth knowing before designing a
format: your users will expect YAML because it is all they have seen.

## Choosing a format

The decision turns on who reads the file and how much you control the toolchain.

| Situation | Use | Why |
|---|---|---|
| Publishing through Jekyll, Docusaurus, Obsidian, Quarto | **YAML** | It is the only format they accept |
| Hugo or Zola, and metadata is machine-consumed | **TOML** | Failures become parse errors, not wrong values |
| Metadata is generated and consumed by programs, never hand-edited | **JSON** | No ambiguity at all, at the cost of comments |
| You need computed values at build time | **JavaScript** | Only if you accept that reading it means running it |
| Titles, authors, and tags for a document pipeline | **MultiMarkdown style** | No typing means no type surprises |
| Defining a format others will implement | **YAML**, and specify it precisely | Anything else limits adoption. Name the version and the schema |

## If you pick YAML, pick the discipline too

YAML wins on availability, not on safety. Section
02 shows ten of eleven natural values coming back as
something other than the text typed. Four habits remove nearly all of it:

1. **Quote anything that is not obviously a word.** Country codes, versions, identifiers
   with leading zeros, anything containing a colon.
2. **Quote dates and timestamps**, then parse them in your own code, so the type does not
   depend on whose library read the file.
3. **Use only `true` and `false`.** Never `yes`, `no`, `on`, `off`.
4. **Write lists as lists.** `tags: [a, b, c]`, never `tags: a, b, c`.

## If you are designing a format

Three lessons from the tools that already did it.

**Name the language and its version.** "YAML frontmatter" does not specify a format.
YAML 1.1 and 1.2 disagree about booleans, octal numbers, and sexagesimal numbers, and
which one you get depends on the library your reader happened to install. Google's Open
Knowledge Format says "a parseable YAML frontmatter block" and stops there, and its own
two implementations disagree as a result.

**Prefer a self-describing delimiter if you support more than one language.** `+++` and
`---toml` say what they are. A bare `---` does not, and it already means TypeScript in
Astro files and a horizontal rule in a Markdown body.

**Say where the block ends.** Whether `...` closes it, whether an indented `---` closes
it, and whether the block must start at line 1 are all real decisions that readers will
otherwise make differently.

## Sources

- [Jekyll](https://jekyllrb.com/docs/front-matter/),
  [Hugo](https://gohugo.io/content-management/front-matter/),
  [Zola](https://www.getzola.org/documentation/content/page/),
  [Eleventy](https://www.11ty.dev/docs/data-frontmatter/),
  [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [Docusaurus](https://docusaurus.io/docs/markdown-features),
  [Obsidian properties](https://obsidian.md/help/properties),
  [Quarto](https://quarto.org/docs/authoring/front-matter.html)
- [Pandoc](https://pandoc.org/MANUAL.html#extension-yaml_metadata_block),
  [MultiMarkdown](https://fletcher.github.io/MultiMarkdown-6/syntax/metadata.html),
  [Python-Markdown](https://python-markdown.github.io/extensions/meta_data/),
  [Astro](https://docs.astro.build/en/basics/astro-components/)

---

<!-- 11archive-source: 05-methodology-and-sources.md -->

# Methodology and sources

## What this report is based on

Each tool's own documentation, read directly, plus one original measurement comparing
how three data languages parse the same metadata. No claim here rests on a secondary
summary of a tool's behaviour.

Everything was read or run on 2026-08-14.

## Evidence states used

| State | Meaning | Example |
|---|---|---|
| **Observed** | Measured by running code | Every row of the typing table in 02 |
| **Source-reported** | Stated by the tool's documentation | Delimiters, format support |
| **Inferred** | Reasoned from evidence, labelled where used | Why YAML won on availability |
| **Unavailable** | Could not be established | Listed below |

## The typing measurement

The table in 02 was produced by parsing the same eleven
pieces of metadata in each language and recording the Python type that came back.

**Versions:** Python 3.13.5, PyYAML 6.0.3, `tomllib` from the Python standard library,
`json` from the standard library.

PyYAML implements YAML 1.1, which is what most Markdown toolchains use in Python. A
YAML 1.2 library returns different answers for several rows, notably the boolean and
octal cases. That difference is itself part of the argument in
04 for naming a version.

The core of the script:

```python
import json, tomllib, yaml

CASES = [
    ('country: NO',             'country = "NO"',            '{"country": "NO"}'),
    ('zip: 02134',              'zip = "02134"',             '{"zip": "02134"}'),
    ('duration: 22:53',         'duration = "22:53"',        '{"duration": "22:53"}'),
    ('version: 1.10',           'version = "1.10"',          '{"version": "1.10"}'),
    ('at: 2026-05-28T14:30:00Z','at = 2026-05-28T14:30:00Z', '{"at": "2026-05-28T14:30:00Z"}'),
]

for y, t, j in CASES:
    print(y,
          repr(next(iter(yaml.safe_load(y).values()))),
          repr(next(iter(tomllib.loads(t).values()))),
          repr(next(iter(json.loads(j).values()))))
```

Selected output:

```
country: NO                False        'NO'         'NO'
zip: 02134                 1116         '02134'      '02134'
duration: 22:53            1373         '22:53'      '22:53'
version: 1.10              1.1          '1.10'       '1.10'
at: 2026-05-28T14:30:00Z   datetime     datetime     '2026-05-28T14:30:00Z'
```

### How to read the columns

The YAML column shows what you get from the natural, unquoted way of writing the value.
The TOML and JSON columns show the value after writing it correctly in that language.

This is not a rigged comparison. It is the point: TOML and JSON do not offer an
ambiguous form, so "writing it correctly" and "writing it naturally" are the same act.
YAML offers both and they differ.

### The rejection tests

Parse-time behaviour was tested separately by feeding each language input that YAML
accepts:

```python
tomllib.loads('tags = a, b, c')   # TOMLDecodeError
tomllib.loads('country = NO')     # TOMLDecodeError
tomllib.loads('draft = yes')      # TOMLDecodeError
tomllib.loads('type = "A"\ntype = "B"')  # TOMLDecodeError, duplicate key
```

Compared with:

```python
yaml.safe_load('type: A\ntype: B')       # {'type': 'B'}, silent
json.loads('{"type":"A","type":"B"}')    # {'type': 'B'}, silent
```

## Cross-format parity

The HTML report and the Markdown files render from the same text. The HTML adds
navigation and table interaction. It adds no facts.

## Limitations

- **Python parsers only.** A JavaScript reader using `js-yaml`, which implements YAML
  1.2, returns different values for the boolean and octal rows. The direction of the
  argument does not change; the specific results do.
- **One version of each library.** A different PyYAML or a YAML 1.2 loader gives
  different answers, which is the report's point rather than an oversight, but it means
  the table describes these versions.
- **Documentation, not behaviour, for tool support.** The matrix in
  04 reflects what each tool documents. None of the
  eleven tools was installed and exercised.
- **Not an exhaustive survey.** These are the conventions in common use. Individual
  projects invent their own, and this report does not attempt to catalogue those.
- **No adoption numbers.** No reliable count exists of how many projects use each
  format, and none is asserted here.

## What could not be established

| Question | Status |
|---|---|
| Any formal standard for Markdown frontmatter | **None exists.** No RFC, no W3C note. Every tool implements its own reader |
| A registered media type for a frontmatter document | Not found |
| Reliable usage share per format | Not found. Every figure located was a vendor claim |

## Sources

All read 2026-08-14.

| Source | Used for |
|---|---|
| [Jekyll front matter](https://jekyllrb.com/docs/front-matter/) | YAML only, must be first in file |
| [Hugo front matter](https://gohugo.io/content-management/front-matter/) | YAML, TOML, JSON delimiters |
| [Zola pages](https://www.getzola.org/documentation/content/page/) | TOML preferred, YAML for legacy |
| [Eleventy front matter](https://www.11ty.dev/docs/data-frontmatter/) | `---json` and `---js` syntax |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | Language detection after the fence, custom engines |
| [Docusaurus markdown features](https://docusaurus.io/docs/markdown-features) | YAML only |
| [Obsidian properties](https://obsidian.md/help/properties) | YAML, JSON input saved as YAML |
| [Quarto front matter](https://quarto.org/docs/authoring/front-matter.html) | YAML |
| [Pandoc manual](https://pandoc.org/MANUAL.html#extension-yaml_metadata_block) | `...` terminator, block position |
| [MultiMarkdown metadata](https://fletcher.github.io/MultiMarkdown-6/syntax/metadata.html) | Unfenced key-value block rules |
| [Python-Markdown Meta-Data](https://python-markdown.github.io/extensions/meta_data/) | Values as lists of strings |
| [Astro components](https://docs.astro.build/en/basics/astro-components/) | The component script quote |
| [YAML 1.2.2](https://yaml.org/spec/1.2.2/), [YAML 1.1](https://yaml.org/spec/1.1/) | Version differences |
| [TOML](https://toml.io/) | Type rules |

## Related

The YAML-specific failure modes summarised here are covered in depth, with a conformance
audit of a real specification that depends on them, in the companion report
[Google's Open Knowledge Format: A Working Reference](https://01kzxzhgv0h542j4y6jhdzt8kk.reports.rj11.io).
