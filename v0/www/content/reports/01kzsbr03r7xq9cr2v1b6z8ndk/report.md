<!-- 11archive-source: README.md -->

# Reverse engineering WhichAI.dev (ui-design-bench)

What this folder holds: a full teardown of the WhichAI.dev design benchmark, built by
reading the source repository, the public site, and the GitHub project record.

Subject:

- Local checkout of the repository at commit `3bdd0cb`, identical to `origin/master`.
- Repository: <https://github.com/SunkenInTime/ui-design-bench>
- Live site: <https://www.whichai.dev/>

Read in this order:

| File | What it answers |
| --- | --- |
| 00-executive-brief.md | What the project is, what it actually measures, and the eleven things worth knowing |
| 01-what-it-measures.md | The one prompt, the five treatments, the coverage grid, and what is never recorded |
| 02-architecture.md | How 325 generated apps run inside one Next.js site without fighting each other |
| 03-ingestion-pipeline.md | The repeatable recipe for adding a model, step by step |
| 04-methodology-audit.md | Where the comparison breaks down, with evidence |
| 05-engineering-findings.md | Eleven concrete defects, each with a fix |
| 06-surfaces-and-ux.md | The four visitor surfaces, plus the unshipped design system |
| 07-project-facts.md | Repo numbers, history, contributors, money, neighbours |
| 08-rebuild-blueprint.md | What to keep and what to change if you build this again |
| 09-glossary.md | Every term used here, in plain words |
| 10-methodology-and-sources.md | How this teardown was done and what it could not check |
| [data.json](data.json) | The same facts in machine-readable form |
| [report-v0.html](report-v0.html) | Single-page visual view of the whole teardown |

Evidence boundary: everything here comes from the checkout at `3bdd0cb`, the live site as
served on 2026-08-11, and the GitHub API on the same day. No generated page was re-graded
and no model was re-run. Where a claim depends on running the project, this report says so.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## What it is

WhichAI.dev is a picture gallery, not a scoreboard. One person, Dara Adedeji, gave the same
short brief to 25 AI models: design the landing page for a note-taking app that works like a
second brain, five different attempts, each on its own page. He then rebuilt every one of
those generated apps inside a single website so a visitor can look at them side by side.

The site's own words: "A comparison of how different AI models approach UI design, with and
without Anthropic's frontend design skill enabled."

A **skill** here means a text file of design instructions that you install into a coding
agent, which the agent then reads before writing code. Two skills carry most of the weight in
this project: Anthropic's `frontend-design` and a community one called `design-taste-frontend`.

## What is actually in it

| Count | Thing |
| --- | --- |
| 1 | prompt, reused for every run |
| 25 | models |
| 5 | treatments (design skill, taste skill, UI SH skill, no skill, Uncodexify skill) |
| 65 | runs (one model under one treatment) |
| 325 | generated landing pages, all preserved as running code |
| 321 | thumbnail images |
| 4 | visitor surfaces (gallery, compare, rankings, guessing game) |
| 0 | numeric scores anywhere in the project |

Every generated page is live code, not a screenshot. Click a card and you are running that
model's actual Next.js output inside the gallery shell.

## The single most important finding

**The design-skill group is not one treatment.** Eighteen of the 65 runs carry a lockfile
that records the exact skill file installed for that run. Those eighteen lockfiles point at
**four different versions** of Anthropic's `frontend-design` skill and **two different
versions** of the taste skill. Content hashes, taken from `skills-lock.json` inside each
run's source:

| Skill | Distinct versions found | Runs recording it |
| --- | --- | --- |
| `frontend-design` (anthropics/skills) | 4 | 11 |
| `design-taste-frontend` (Leonxlnx/taste-skill) | 2 | 7 |

So when the gallery puts Composer 2.5 next to Opus 5 in the "With Design Skill" section, the
two runs read different instruction files. The remaining 47 runs record nothing at all, so
their treatment is asserted by folder name only.

This does not make the gallery useless. It makes it a **catalogue of what happened**, not a
controlled comparison. Read on that basis and it is genuinely valuable.

## Eleven things worth knowing

1. **Skill version drift confounds every cross-model comparison.** Four skill versions inside
   one group, and no version recorded for two thirds of the runs. See
   04-methodology-audit.md.

2. **One run got 13 skills, not 1.** The GLM 5.2 taste run has `brandkit`, `gpt-taste`,
   `minimalist-ui`, `industrial-brutalist-ui`, `image-to-code` and eight more installed
   alongside the taste skill. Its output cannot be attributed to the taste skill alone.

3. **Nothing about the run is recorded.** The data model has no field for date, agent, model
   version string, reasoning effort, retries, or token spend. Folder names carry hints
   (`opus-cc-test`, `gpt-5-6-test/sol`) and nothing else does.

4. **Every thumbnail has the site's own furniture in it.** The capture script screenshots the
   normal gallery route, so the floating switcher and the Next.js development badge are baked
   into all 320 auto-generated thumbnails. A clean route exists and is not used.

5. **The rankings page ranks 8 models, and the home page hides all 8.** Every model on the
   ranked list is either force-archived or superseded, so none of them appears in the gallery
   unless the visitor presses "Show Archived". Seventeen of 25 models are unranked, and the
   rank-8 note is still a placeholder that says to update it later.

6. **Every page downloads a 643 KB stylesheet.** The shell's stylesheet asks Tailwind to scan
   the whole repository, so it contains utility classes from all 65 generated apps. The home
   page HTML is another 235 KB.

7. **Dark mode is half-wired.** The theme tokens, the toggle and a passing test are all
   there, but `:root { color-scheme: light !important }` overrides both the dark rule and the
   inline style the theme script sets, so native controls stay light.

8. **The design document contradicts the code.** `DESIGN.md` says "Light mode only" and "do
   not branch the design around it yet". Dark mode shipped in May.

9. **There is no license.** The repository redistributes 325 generated applications and eight
   companies' brand logos with no license file and no notice.

10. **The prompt asks for something the gallery then deletes.** The brief says "add a little
    button that lets me switch between them easily". Ingestion strips exactly that button from
    every run so the gallery's own switcher can take over. Whether a model built a working
    switcher is part of the brief and is no longer visible.

11. **The guessing game's "Coin Flipper" tier is chance.** You get three guesses out of eight
    labs, which is a 37.5% hit rate from pure luck. The tier that begins at 34% is therefore
    the random-play band.

## Who should care, and why

- **Someone choosing a model for frontend work.** Use the gallery and the compare view. They
  do the job the project set out to do: you look, you decide. Ignore the rankings page.
- **Someone building an AI evaluation.** This is the clearest worked example available of the
  hard part, which is not scoring but **preserving and re-serving hundreds of generated apps
  as live code**. The two-stage CSS isolation in
  02-architecture.md is the reusable idea.
- **Someone who wants to reproduce or extend it.** The repository ships its own ingestion
  recipe as an agent skill. 03-ingestion-pipeline.md walks it.

## Project shape in one paragraph

101 commits from 2026-03-21 to 2026-08-09, essentially one author, 77 stars, 8 forks, no
license, 179 MB on disk. Next.js 16.2.0 and React 19.2.4 on Vercel, fully prerendered.
Eighteen pull requests, of which fourteen merged; four still open, two of them analytics bots.
Greptile provides code review and OpenAI's Codex for Open Source provides credits; the author
takes coffee money to fund new model runs. Growth has slowed from 25 commits in March to 10
in August, and each new model now arrives as a single agent-authored pull request.

---

<!-- 11archive-source: 01-what-it-measures.md -->

# What the benchmark measures

## The prompt

One prompt drives the whole project. It is stored as a plain string in the home page
component, `src/app/page.tsx:21`, and shown to visitors with a copy button:

> I want you to design the landing page for a note-taking application as essentially a second
> brain. You should design five iterations and each of them should be accessible within the
> slash one, slash two, slash three like pages directory. And then you should add a little
> button that lets me switch between them easily.

Three things follow from that text.

**It reads like dictation, not a spec.** "slash one, slash two, slash three like pages
directory" is spoken shorthand. That is deliberate on the project's part: it tests what models
do with a real, loose request rather than a tidied-up one.

**It asks for three separate deliverables.** A visual design, five distinct attempts, and a
working switcher between them. Only the first is on display.

**It sets no constraints at all.** No brand, no colour, no framework version, no length, no
accessibility bar, no content. Every model invents the product name, the copy, and the
sections. In the sample this teardown looked at, Opus 5 invented "CAIRN" as a wooden card
catalogue and Sonnet 5 invented "Cortex" with sticky notes. Both are answering the same
sentence.

That last point is the project's real subject. It measures **what a model reaches for when
nobody tells it anything**, which is close to how most people actually prompt.

## The five treatments

A **treatment** is the condition a run was carried out under. The project calls them groups
and puts each in its own section of the home page.

| Slug | Site label | Runs | What the model had installed |
| --- | --- | --- | --- |
| `with-design-skill` | With Design Skill | 25 | Anthropic's `frontend-design` skill |
| `without-design-skill` | Without Design Skill | 25 | nothing |
| `with-taste-skill` | With Taste Skill | 10 | `design-taste-frontend` from `Leonxlnx/taste-skill` |
| `with-ui-sh-skill` | With UI SH Skill | 4 | not stated anywhere in the repo or the site |
| `miscellaneous` | With Uncodexify skill | 1 | `uncodixfy` by `cyxzdev` |

Two of the five link out to the exact skill, from `src/lib/gallery-anthropic-skill.ts`:

- `frontend-design` at <https://skills.sh/anthropics/skills/frontend-design>. Its published
  purpose is to push models away from generic template looks by making them commit to an
  aesthetic direction before they build.
- `uncodixfy` at <https://skills.sh/cyxzdev/uncodixfy/uncodixfy>. Its purpose is to name and
  avoid the tells of AI-made interfaces, such as soft gradients and oversized rounded corners.

The taste skill is not linked from the site, but the lockfiles inside the runs identify it
exactly: `Leonxlnx/taste-skill`, skill path `skills/taste-skill/SKILL.md`, install name
`design-taste-frontend`. It is an "anti-slop" rule set with tunable dials and motion patterns.

The UI SH group has no link, no note, and no lockfile. `PRODUCT.md` mentions "ui.sh" in
passing as one of the skills under study. That is the only trace. Treat this group as
unidentified.

## The coverage grid

Twenty-five models, five treatments, one dot per run. `X` means the run exists.

| Model | Design | Taste | UI SH | No skill | Misc |
| --- | :-: | :-: | :-: | :-: | :-: |
| Fable 5 | X | X | | X | |
| Opus 5 | X | X | | X | |
| Opus 4.8 | X | | | X | |
| Opus 4.7 | X | | X | X | |
| Opus 4.6 | X | | | X | |
| Sonnet 5 | X | X | | X | |
| GPT-5.6 Sol | X | X | | X | |
| GPT-5.6 Luna | X | X | | X | |
| GPT-5.6 Terra | X | X | | X | |
| GPT 5.5 high | X | | X | X | |
| GPT 5.5 low | X | | X | X | |
| GPT-5.4 | X | | | X | X |
| Gemini 3.5 Flash | X | | | X | |
| Gemini 3.1 Pro | X | | | X | |
| Grok 4.5 | X | X | | X | |
| Muse Spark 1.2 | X | X | | X | |
| GLM 5.2 | X | X | | X | |
| GLM 5.1 | X | | | X | |
| GLM 5 Turbo | X | | | X | |
| Kimi K3 | X | X | | X | |
| Kimi K 2.6 | X | | | X | |
| Kimi K 2.5 | X | | | X | |
| Composer 2.5 | X | | | X | |
| Composer 2.0 | X | | X | X | |
| Composer 1.5 | X | | | X | |

The grid is **complete on the main axis and sparse everywhere else**. Every model has both a
design-skill run and a no-skill run, which is the comparison the site is built around. Only 10
of 25 have a taste run, and those 10 are all recent arrivals, so the taste axis is a snapshot
of mid-2026 models rather than a like-for-like sweep.

Model families and labs, from `src/lib/model-labs.ts`:

| Lab | Models |
| --- | --- |
| Anthropic | Opus 4.6, 4.7, 4.8, 5; Sonnet 5; Fable 5 |
| GPT | GPT-5.4, 5.5 low, 5.5 high; Sol, Luna, Terra (all labelled GPT-5.6) |
| Google | Gemini 3.1 Pro, Gemini 3.5 Flash |
| Moonshot | Kimi K 2.5, K 2.6, K3 |
| Z.ai | GLM 5 Turbo, 5.1, 5.2 |
| Cursor | Composer 1.5, 2.0, 2.5 |
| xAI | Grok 4.5 |
| Meta | Muse Spark 1.2 |

Sol, Luna and Terra are three separate runs the project labels "GPT-5.6 Sol", "GPT-5.6 Luna"
and "GPT-5.6 Terra", each described in the manifest as "max-reasoning generations". The
repository does not explain what distinguishes them from each other.

## What the project never records

This is the sharpest gap. The whole data model for a run is 8 fields, from
`src/lib/gallery-types.ts`:

```ts
interface GalleryEntry {
  group: GalleryGroupSlug;      // treatment
  groupLabel: string;           // display label
  model: ModelSlug;             // model slug
  modelLabel: string;           // display label
  sourceDir: string;            // where the run came from, as free text
  sourceAppType: "next" | "vite";
  defaultIteration: IterationId;
  summary: string;              // one sentence, hand written
  iterations: GalleryIteration[];
}
```

Absent, with no field to hold them:

- **When the run happened.** Nothing is date-stamped. The only clue is git history.
- **Which agent ran it.** Cursor, Claude Code, Codex and a plain API call would all look
  identical here. `sourceDir` hints at it (`opus-cc-test` reads like Claude Code) and hints are
  all you get.
- **The exact model build.** "Opus 5" is a label, not an API model string.
- **Reasoning effort or temperature.** The manifest text says "max-reasoning" for Sol, Luna and
  Terra in prose. Nothing else says anything.
- **Whether the run was retried.** If a generation failed and was re-rolled, the gallery shows
  the survivor with no mark.
- **Cost or token count.** The README asks for coffee money to fund runs; the runs carry no
  cost record.
- **Any score.** There is no rubric, no rater, no numeric field anywhere in the project. The
  rankings page holds prose only.

The five "iterations" are also worth naming precisely. They are **five designs the model was
asked to produce in a single run**, not five repeated samples of one design. So they measure
range within one attempt, not run-to-run variance. Nothing in the project measures variance.

## What the benchmark therefore supports, and what it does not

Supports:

- "Show me what this model produces from a blank brief." Yes, directly, five ways.
- "Does this model's output change when I install a design skill?" Yes, for any of the 25
  models, side by side, in one URL.
- "What tics does this model have?" Yes, and the guessing game turns that into practice.

Does not support:

- "Which model is best at design?" No score exists, and the one ranked list covers 8 older
  models.
- "Is the design skill worth installing?" The comparison is confounded by skill version drift.
  See 04-methodology-audit.md.
- "How consistent is this model?" Nothing repeats a run.
- "Did the model follow the brief?" The switcher part of the brief is removed at ingestion.

---

<!-- 11archive-source: 02-architecture.md -->

# Architecture

## The problem this solves

Take 325 landing pages written by 25 different models. Each arrived as its own complete Next.js
project, with its own global stylesheet that sets the page background, its own `@keyframes`
animations, its own fonts, and its own floating switcher pinned to the top right of the screen.

Now put all 325 inside one website, on one server, with one shared navigation bar, and make
sure that clicking from one to the next never leaves a stray rule behind.

That is the whole engineering problem, and the answer is worth stealing. Think of it as
mounting 325 paintings in one hall: every painting keeps its own frame and lighting, but none
of them may repaint the walls.

## The chain from data to pixels

Five links, each with one job.

```
gallery-manifest.ts   -->  gallery-registry.ts  -->  src/variants/{group}/{model}/index.tsx
   (the list)                (the lookup)                    (the adapter)
                                                                  |
                                                                  v
                                            the model's own page components, imported directly
                                                                  |
                                                                  v
                                       src/generated/scoped-variant-css/... (rewritten CSS)
```

**1. The manifest is the single source of truth.** `src/lib/gallery-manifest.ts` is a
hand-maintained array of 65 entries. Every route, every thumbnail path, every dropdown option,
every test case and every guessing-game round is derived from it. Nothing else holds a list of
models.

**2. The registry maps a string key to code.** `src/lib/gallery-registry.ts` holds a flat
object keyed `"{group}:{model}"`, for example `"with-design-skill:opus-5"`, with 65 static
imports at the top. It exists because the manifest is data and cannot import components.

**3. The variant module adapts a whole app down to one function.** Each
`src/variants/{group}/{model}/index.tsx` exports an object with a single `render` method:

```ts
interface VariantModule {
  render(props: { entry: GalleryEntry; iteration: IterationId; preview: boolean }): ReactNode;
}
```

This is where the messy part is absorbed. Every model laid its five designs out differently, so
each adapter is written by hand. Two real examples:

- **Opus 5** produced five App Router routes each with its own `layout.tsx`, so the adapter
  imports both the page and the layout and nests them: `<Layout><Page /></Layout>`.
- **Kimi K3** produced five named components under `app/designs/d1..d5` (`Archive`,
  `Observatory`, `Garden`, `Instrument`, `Blueprint`) plus one CSS file each, so the adapter
  imports five components and six stylesheets.

**4. The view renders inside a scoping wrapper.**
`src/components/gallery/gallery-iteration-view.tsx` wraps every generation in one div that
carries the identity of the run:

```tsx
<div className="gallery-generation"
     data-gallery-generation
     data-gallery-group={entry.group}
     data-gallery-model={entry.model}
     data-gallery-iteration={iteration}>
  {variantModule.render({ entry, iteration, preview })}
</div>
```

Those data attributes are the hook the CSS rewriter targets.

**5. The shell defends itself.** `src/app/globals.css` sets the page background and text colour
with `!important` on `html` and `body`, with a comment saying exactly why: "Variant bundles can
bring their own global body rules. Keep the gallery shell stable."

## The two-stage CSS isolation

This is the reusable idea in the project.

### Stage one: rewrite every selector at build time

`scripts/scope-variant-css.mjs` (220 lines, PostCSS plus `postcss-selector-parser`) runs on
`predev` and `prebuild`. It walks every `.css` file under `src/variants`, rewrites it, and
writes the result to `src/generated/scoped-variant-css/` mirroring the input path. Four
transformations:

**Prefix every selector with the run's identity.** A rule written as `.hero { ... }` in the
Opus 5 design-skill run becomes:

```css
:where(.gallery-generation[data-gallery-group="with-design-skill"][data-gallery-model="opus-5"]) .hero { ... }
```

The `:where()` wrapper is the clever part: it adds zero specificity, so the model's own
specificity ordering survives untouched. Without it, every rule would get heavier by three
selectors and the original cascade would scramble.

**Turn page-level selectors into scope selectors.** `html`, `body` and `:root` are replaced by
the scope itself rather than prefixed. So a model's `body { background: #0a0a0a }` styles only
its own container, not the whole site. A duplicate-root cleanup pass removes the redundant
descendant that this replacement can leave behind.

**Namespace animations.** Every `@keyframes fadeIn` becomes
`@keyframes gallery-with-design-skill-opus-5-source-src-app-globals-fadeIn`, and every
`animation` and `animation-name` declaration is rewritten to match. Without this, two models
that both named an animation `float` would silently overwrite each other.

**Strip the global Tailwind entry.** `@import "tailwindcss"` and every `@theme` block is
deleted from the variant copy, because Tailwind is set up once by the shell.

### Stage two: give each run its own Tailwind bundle

Rewriting hand-written CSS is not enough, because most generated pages use Tailwind utility
classes, which do not exist until Tailwind scans the source and generates them.

The answer is a route group, `src/app/(generated-variant-routes)/`, which holds a literal
folder path per run rather than a dynamic one. Each contains a four-line CSS entry:

```css
@layer theme, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);
@source "../../../../../variants/with-design-skill/sonnet-5";
```

`source(none)` switches off Tailwind's automatic file scanning and `@source` points it at
exactly one variant folder. The page then imports that file, so Next.js code-splits it and a
visitor to one run downloads only that run's utilities.

The route file itself is a thin repeat of the dynamic route with the group and model hardcoded
and the variant module passed in directly.

### Where stage two is incomplete

The literal routes are generated per run and three runs are missing theirs:

| Coverage | Count |
| --- | --- |
| Runs in the manifest | 65 |
| Literal non-preview routes | 56 |
| Literal preview routes | 59 |

Missing non-preview routes: `kimi-k3`, `muse-spark-1.2` and `opus-5`, in all three of their
groups. Missing preview routes: `kimi-k3` and `opus-5`, in all three groups.

Those runs fall through to the shared dynamic route and depend on the shell's stylesheet for
their utilities. It works today only because the shell's stylesheet is unrestricted and
therefore contains every utility used anywhere in the repository. See
05-engineering-findings.md, findings 1 and 4: the same missing
restriction that makes those three runs work is what makes every page carry 643 KB of CSS.

## Routing

Four route shapes:

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/{group}/{model}/{iteration}` | a generation with the gallery switcher | prerendered, `dynamicParams = false` |
| `/preview/{group}/{model}/{iteration}` | the same generation with no switcher | prerendered, used inside compare iframes |
| `/(generated-variant-routes)/{group}/{model}/{iteration}` | same URL as row one, but with a per-run CSS bundle | literal path wins over the dynamic one |
| `/compare`, `/rankings`, `/lab-guess`, `/experiments` | the four visitor surfaces | static plus client state |

`dynamicParams = false` with `generateStaticParams()` derived from the manifest means the whole
site is built ahead of time: 325 generation pages plus 325 preview pages, all static files on
Vercel. Response headers on the live site confirm it (`x-nextjs-prerender: 1`).

`/compare` keeps its full state in six query parameters (`leftGroup`, `leftModel`,
`leftIteration` and the three right-hand equivalents), which is what makes a comparison
shareable as a link. `src/lib/compare.ts` validates all six against the manifest and returns
one of three outcomes: a valid state, `"default"` when no parameters are present, or
`"invalid"`. Nothing half-valid gets rendered.

## Preview capture

`scripts/capture-previews.mjs` produces the thumbnails:

1. Start the dev server on port 3000 unless `CAPTURE_BASE_URL` is set.
2. Launch headless Chromium at 1440 by 960.
3. For each run and each of its five iterations, visit the page, check that it is not the 404
   page, wait 5 seconds for animations to settle, screenshot, convert to WebP at quality 85,
   write to `public/gallery-previews/{group}/{model}/{n}.webp` with up to six write retries.
4. `TARGET_GROUP` and `TARGET_MODEL` environment variables narrow the run.

The 5-second settle and the retrying writer are both signs of a script hardened by real
failures. Two problems remain, covered in 05-engineering-findings.md:
it visits the switcher-bearing route with a `?preview=1` parameter nothing reads, and it runs
against the dev server, so the Next.js development badge lands in every image.

## Testing

Playwright against a production build on port 3100, from `playwright.config.ts`, with three
specs:

- `tests/gallery-routes.spec.ts` (235 lines) is the real one. It asserts the archive rules,
  same-family ordering, the rankings count, that the dark theme survives navigating into a
  generation and back, and, best of all, that the switcher's own text colours are exactly
  `rgb(250,250,250)`, `rgb(82,82,82)` and `rgb(82,82,82)` while the generation's `--background`
  variable is `#fff` and the document root's is empty. That last test is a direct regression
  guard on the CSS isolation.
- `tests/compare-routes.spec.ts` covers the compare page's parameter handling.
- `tests/gallery-visual-smoke.spec.ts` is a 19-line smoke check.

Route coverage is sampled, not exhaustive: the last five manifest entries plus 24 hand-picked
routes. With 325 pages, sampling is the right call, but the hand-picked list has to be edited
by hand each time a model is added.

## Dependencies worth noting

From `package.json`, package name `composer-bench-gallery` version `0.1.0`:

- `next@16.2.0`, `react@19.2.4`, `tailwindcss@4`
- Four animation libraries at once: `framer-motion@12.23.24`, `motion@12.38.0`, `gsap@3.15.0`.
  `framer-motion` and `motion` are the same library under two names, both installed.
- Two icon libraries: `lucide-react` and `@phosphor-icons/react`
- `html-to-image` for the guessing game's shareable score card
- `sharp` and `@playwright/test` for the capture script

The duplicate animation and icon libraries are almost certainly inherited from generated code
rather than chosen.

---

<!-- 11archive-source: 03-ingestion-pipeline.md -->

# The ingestion pipeline

## The project documents its own recipe

The most transferable artifact in the repository is not code. It is
`skills/add-generation-to-gallery/SKILL.md`, a 219-line instruction file that tells a coding
agent how to fold a freshly generated Next.js app into the gallery.

This matters because it turns the hardest, most error-prone chore in the project into something
repeatable. The git history shows the payoff: recent models arrive as single pull requests
titled `agent/add-kimi-k3-generations` and `agent/add-muse-spark-1-2-generations`, merged within
minutes. The maintainer now describes a model addition to an agent rather than doing it by hand.

## What one addition touches

Adding a single model under a single treatment edits seven places and generates two more:

| File | Change |
| --- | --- |
| `src/lib/gallery-types.ts` | add the model slug to the `ModelSlug` union |
| `src/lib/gallery-manifest.ts` | add one `GalleryEntry` |
| `src/lib/gallery-registry.ts` | add an import and one `"{group}:{model}"` key |
| `src/variants/{group}/{model}/index.tsx` | write the adapter by hand |
| `src/variants/{group}/{model}/source/**` | copy the whole generated app in |
| `scripts/capture-previews.mjs` | add one entry to the hardcoded list |
| `tests/gallery-routes.spec.ts` | add a route tuple |
| `src/generated/scoped-variant-css/**` | generated by `npm run scope:variant-css` |
| `public/gallery-previews/{group}/{model}/*.webp` | generated by `npm run capture-previews` |

Optional: `src/lib/model-labs.ts`, `src/lib/model-brand-logo.ts`,
`src/lib/gallery-model-order.ts`, `src/lib/gallery-archived.ts` and
`src/lib/model-rankings.ts`. Note that four of those five are typed as
`Record<ModelSlug, ...>` with no optional values, so TypeScript forces you to fill them in.
That is a deliberate and good design choice: the compiler refuses to let you forget the lab
name or the brand logo.

## The eight steps

**1. Decide the four identifiers.** Group, model slug (URL-safe, for example `gpt-5.5-high`),
display label, and the source project path. Also decide the five iteration route names, which
in practice are either `1/2/3/4/5` or `one/two/three/four/five`.

**2. Copy the generated app in.** It goes to `src/variants/{group}/{model}/source`, keeping its
internal folder shape. Public assets go to `public/variants/{group}/{model}` and the source's
asset paths get rewritten, because a generated app that references `/window.svg` at the root
would collide with the 64 other apps that do the same.

**3. Write the adapter.** The skill gives the happy-path template: five page imports, one
scoped-CSS import, a lookup object keyed `"1"` through `"5"`, and a `render` that picks one.
The instruction that does the real work is this one:

> If the source project contains a single `src/app/page.tsx` that switches internally between
> designs, split or import the actual iteration components instead of rendering the switcher
> page inside the gallery.

That is the switcher-removal rule. The prompt asked every model to build a switcher; ingestion
takes it out so the gallery's own switcher can own the top-right corner. It is the right call
for the gallery and it costs the benchmark a graded deliverable. See
04-methodology-audit.md.

Another rule that reads like scar tissue:

> Do not import the source app's `layout.tsx` unless it is required and safe.

**4. Widen the types.** Add the slug to `ModelSlug`. The skill explicitly discourages adding a
new `GalleryGroupSlug`: "Avoid new groups unless the user explicitly wants one."

**5. Register it.** One import, one key, with the key exactly equal to `{group}:{model}`.

**6. Scope the CSS.** `npm run scope:variant-css`. The skill states plainly that
`src/generated/scoped-variant-css` is generated and must not be hand-edited.

**7. Capture thumbnails.** `TARGET_GROUP={group} TARGET_MODEL={model} npm run capture-previews`.
The skill notes the one trap here: the capture script visits gallery iteration IDs (`1` to `5`),
not the model's own route names.

**8. Verify.** The skill's required command list:

```bash
npm run scope:variant-css
npm run lint
npm run test:routes
npm run test:visual
npm run build
```

Plus the escape hatch for stale build output: `rm -rf .next && npm run build`.

## The failure catalogue

The skill's "Common Fixes" section is the most valuable page in the repository, because each
line is a bug someone already hit. Paraphrased:

| Symptom | Cause | Fix |
| --- | --- | --- |
| Gallery shell restyles itself after you click into a generation | source CSS is leaking past the scope | run the scoping script, import from `src/generated/scoped-variant-css`, remove direct source-CSS imports |
| An asset 404s | the source references a root path like `/logo.svg` | move it under `public/variants/{group}/{model}` and rewrite the path |
| The model's own switcher shows up on the page | the adapter imported the source's root page instead of the five route components | import the specific route components |
| Route tests 404 | slugs disagree between manifest, types and registry | make all three exactly equal |
| The generated CSS import path does not exist | the scoping script has not run yet | run it, then look at the real generated path before editing imports |

The completion criteria are explicit: source present, adapter renders all five, manifest and
registry both updated, types accept the slugs, previews present if wanted, and the three
verification commands pass or their failures are reported with file-level causes.

## What the pipeline does not do

Four gaps, all of which show up as findings elsewhere in this teardown.

**It does not generate the per-run route wrapper.** Stage two of the CSS isolation
(see 02-architecture.md) needs a literal route folder plus a four-line
Tailwind entry per run. The skill never mentions it, which is exactly why `kimi-k3`,
`muse-spark-1.2` and `opus-5` are missing theirs.

**It does not record run provenance.** No step captures the date, the agent, the model build
string, the reasoning effort, or the skill version. The `skills-lock.json` files that do carry
skill versions are present only because they happened to be inside the copied source folder, not
because any step asked for them.

**It does not strip the scaffolding.** "Keep the source app's internal directory shape intact
where possible" means the copied folder brings its `package.json`, `package-lock.json`,
`node_modules` ignore rules, `README.md`, `eslint.config.mjs`, `tsconfig.json` and favicon along
with it. Across the repository that is 41 `package.json` files and 33 `package-lock.json` files
inside `src/variants`, and it is most of why the repository is 179 MB.

**It does not update the rankings.** Rankings are listed as optional, and in practice they were
last touched around Kimi K 2.6. Seventeen of 25 models are unranked.

## How to reproduce a run yourself

Nothing in the repository records how the generations were produced, so this is reconstructed
from the lockfiles and folder names. Treat it as a plausible recipe, not the author's exact one.

1. `npx create-next-app` with TypeScript and Tailwind v4. Every ingested source carries the
   Next.js scaffold's `AGENTS.md`, whose first line is "This is NOT the Next.js you know", so
   the runs used a recent Next.js template.
2. Install the treatment's skill into the fresh project, for example
   `npx skills add https://github.com/anthropics/skills --skill frontend-design`. That is what
   writes the `skills-lock.json` this teardown used as evidence.
3. Give the agent the prompt verbatim from `src/app/page.tsx:21`.
4. Let it build five designs at `/1` through `/5` plus a switcher.
5. Hand the finished project to the `add-generation-to-gallery` skill.

If you do this, record the four things the original does not: the date, the agent and its
version, the model string, and the skill's content hash. All four are cheap to capture at
step 2 and impossible to recover later.

---

<!-- 11archive-source: 04-methodology-audit.md -->

# Methodology audit

The project is honest about being subjective. `README.md` says "The rankings page is subjective,
because design is subjective." This audit is not an attack on that. It sorts out which claims
the evidence supports and which it does not, so a reader knows what they are looking at.

Each item states the claim at risk, the evidence, and how much it costs.

---

## A1. The design-skill group contains four different skill versions

**Claim at risk:** "These 25 cards all had the design skill enabled, so differences between them
come from the models."

**Evidence.** Eighteen of the 65 run sources contain a `skills-lock.json`, written by the skill
installer, which records the source repository, the skill path, and a content hash of the skill
file. Extracted from the checkout:

| Run | Skill | Content hash (first 12) |
| --- | --- | --- |
| with-design-skill/composer-2.5 | frontend-design | `063a0e644812` |
| with-design-skill/gemini-3.5-flash | frontend-design | `516bd2154eb8` |
| with-design-skill/gpt-5.5-high | frontend-design | `516bd2154eb8` |
| with-design-skill/gpt-5.5-low | frontend-design | `516bd2154eb8` |
| with-design-skill/fable | frontend-design | `4eabc6618376` |
| with-design-skill/grok-4.5 | frontend-design | `4eabc6618376` |
| with-design-skill/kimi-k3 | frontend-design | `4eabc6618376` |
| with-design-skill/glm-5.2 | frontend-design | `93f53fd1c035` |
| with-design-skill/muse-spark-1.2 | frontend-design | `93f53fd1c035` |
| with-design-skill/opus-5 | frontend-design | `93f53fd1c035` |
| with-design-skill/sonnet-5 | frontend-design | `93f53fd1c035` |
| with-taste-skill/fable | design-taste-frontend | `6d838b246d0e` |
| with-taste-skill/grok-4.5 | design-taste-frontend | `6d838b246d0e` |
| with-taste-skill/kimi-k3 | design-taste-frontend | `6d838b246d0e` |
| with-taste-skill/glm-5.2 | design-taste-frontend | `899b84384f74` |
| with-taste-skill/muse-spark-1.2 | design-taste-frontend | `899b84384f74` |
| with-taste-skill/opus-5 | design-taste-frontend | `899b84384f74` |
| with-taste-skill/sonnet-5 | design-taste-frontend | `899b84384f74` |

Four distinct `frontend-design` versions across 11 runs. Two distinct taste versions across 7.
The hashes group by time, which fits a maintainer who reinstalled the current skill whenever a
new model shipped. The skill itself changed under him: its published page says it went through
a "substantial 2026 rewrite" with a "much stricter ruleset" under the same install name.

**Cost.** High, and specific. Comparing Composer 2.5 to Opus 5 inside the "With Design Skill"
section compares two different instruction files as well as two models. The comparison the site
is built around, one model with the skill versus the same model without it, is **not** affected,
because both halves of that pair were almost certainly run together. That pairing is the site's
strongest claim and it survives.

**Fix.** Add a `skillVersion` field to `GalleryEntry`, backfill the 18 known hashes, mark the
other 47 `unknown`, and show the hash on the card. Then group the home page by skill version, or
at least warn when two cards in one row do not share one.

---

## A2. One taste run had thirteen skills installed

**Claim at risk:** "This card shows what the taste skill does."

**Evidence.** `src/variants/with-taste-skill/glm-5.2/source/skills-lock.json` records thirteen
skills, all from `Leonxlnx/taste-skill`:

`brandkit`, `design-taste-frontend`, `design-taste-frontend-v1`, `full-output-enforcement`,
`gpt-taste`, `high-end-visual-design`, `image-to-code`, `imagegen-frontend-mobile`,
`imagegen-frontend-web`, `industrial-brutalist-ui`, `minimalist-ui`,
`redesign-existing-projects`, `stitch-design-taste`.

Every other taste run records exactly one skill. This run therefore had access to an aesthetic
preset (`minimalist-ui`, `industrial-brutalist-ui`), an output-length enforcer
(`full-output-enforcement`), and a brand generator (`brandkit`) that none of its neighbours had.

**Cost.** Medium in scope, high in kind. It is one card out of 65, but it is a card the site
presents as directly comparable to the other nine taste cards. Whatever GLM 5.2 produced there
cannot be attributed to the taste skill alone.

**Fix.** Re-run GLM 5.2 with only `design-taste-frontend` installed, or label the card with its
full skill list.

---

## A3. Two thirds of runs have no treatment evidence at all

**Claim at risk:** the group label on every card.

**Evidence.** 18 of 65 runs carry a lockfile. The other 47 are placed in a group by folder name
and manifest entry only. Nothing inside those sources shows which skill, if any, was installed.

**Cost.** Medium. There is no reason to doubt the labels, and the folder naming is consistent
and careful (`with-frontend-design-skill/`, `ui-sh-test/`, `gpt-5-6-test/sol/no-skill`). But it
is testimony, not evidence, and it cannot be audited by a third party.

**Fix.** Copy the lockfile into every ingested source as a required ingestion step, even when
it means re-running the installer to reconstruct it.

---

## A4. The UI SH treatment is unidentified

**Claim at risk:** "With UI SH Skill" means something specific.

**Evidence.** Four runs sit in this group. The site labels it "With UI SH Skill" with no link, in
contrast to the design and Uncodexify groups, which both link to their exact skill page on
skills.sh via `src/lib/gallery-anthropic-skill.ts`. No lockfile exists for any of the four runs.
`PRODUCT.md` mentions "ui.sh" once in a list of skills under study. That is the whole record.

**Cost.** Low in scale, total in kind. Four cards carry a label a reader cannot resolve.

**Fix.** Link the skill and record its version, or fold the four runs into `miscellaneous` with
a prose note.

---

## A5. Nothing records when, how, or with what a run was made

**Claim at risk:** any statement of the form "model X is better than model Y at design".

**Evidence.** `GalleryEntry` has eight fields and none of them is a date, an agent name, a model
build string, a reasoning setting, a retry count, or a cost. See
01-what-it-measures.md for the full type.

The gaps that matter most:

- **Time.** The gallery spans March to August 2026. During that window every lab shipped new
  models and the skills themselves were rewritten. Two cards in the same row can be five months
  apart and nothing says so.
- **Agent.** Folder names hint at it: `opus-cc-test` reads like Claude Code, `ui-sh-test` like a
  separate harness. A model driven by Cursor and the same model driven by a raw API call are
  different systems, and the gallery cannot tell you which one you are looking at.
- **Retries.** If a generation failed and was re-rolled, the survivor is shown with no mark. The
  git history contains a `kimi-k-2.6-backup-20260420-202852` folder, which shows at least one run
  was redone.

**Cost.** High. This is what separates a catalogue from a benchmark. The project is a good
catalogue.

**Fix.** Add five fields (`generatedAt`, `agent`, `modelBuild`, `reasoningEffort`,
`skillVersion`), backfill from git dates where possible, and mark the rest `unknown`. Showing
`unknown` is more honest than showing nothing.

---

## A6. Part of the brief is deleted before display

**Claim at risk:** "these pages show how the model answered the prompt".

**Evidence.** The prompt's third sentence asks for "a little button that lets me switch between
them easily". The ingestion skill instructs the opposite:

> If the source project contains a single `src/app/page.tsx` that switches internally between
> designs, split or import the actual iteration components instead of rendering the switcher
> page inside the gallery.

Thirty-two of the 65 manifest summaries say some version of "integrated without the source app's
local switcher".

**Cost.** Medium. It is the right product decision, since two floating switchers in the same
corner would be unusable. But instruction-following on an explicit deliverable is exactly the
kind of thing a benchmark should surface, and this one throws it away silently.

**Fix.** Record a boolean per run: did the model build a working switcher, yes or no. It costs
one field and one glance during ingestion, and it is the only part of the brief that can be
graded objectively.

---

## A7. The rankings are stale, partial, and partly invisible

**Claim at risk:** the entire `/rankings` page.

**Evidence.** `src/lib/model-rankings.ts` holds eight entries:

| Rank | Model | Hidden on the home page by default? |
| --- | --- | --- |
| 1 | Claude Opus 4.7 | yes, force-archived |
| 2 | Claude Opus 4.6 | yes, superseded by Opus 5 |
| 3 | Gemini 3.1 Pro | yes, superseded by Gemini 3.5 Flash |
| 4 | Composer 2.0 | yes, force-archived |
| 5 | GPT-5.4 | yes, superseded by the GPT-5.6 runs |
| 6 | Kimi K 2.5 | yes, superseded by Kimi K3 |
| 7 | Composer 1.5 | yes, superseded by Composer 2.5 |
| 8 | Kimi K 2.6 | yes, force-archived |

**Every one of the eight ranked models is hidden** from the home page unless the visitor presses
"Show Archived". Seventeen of the 25 models in the gallery are unranked, including every Anthropic
model newer than 4.7, every GPT-5.6 run, Sonnet 5, Fable 5, Grok 4.5, Muse Spark 1.2, GLM 5.2 and
Kimi K3. The rank-8 note still reads: "Bench slot for Kimi K 2.6; update notes after the gallery
run is reviewed."

The prose that is there is good, specific, and clearly written by someone who looked closely.
Rank 1's note describes custom SVG marks instead of "the random emoji some Opus runs lean on";
rank 4 names "Composer sickness: it does the bare minimum". This is the most opinionated and most
useful writing in the project, and it is about models the gallery now hides.

**Cost.** High for a first-time visitor, because "Rankings" is a top-level navigation item and it
reads as current. A Playwright test asserts the count is exactly 8, which locks the staleness in.

**Fix.** Two honest options. Either date-stamp the page as a snapshot ("Rankings as of April
2026") and leave it, or rank the current models and drop the rest. The worst option is the
current one, which is an undated list of superseded models under a present-tense heading.

---

## A8. The archive rule guesses at newness

**Claim at risk:** the default set of cards you see.

**Evidence.** `src/lib/gallery-archived.ts` decides visibility with a hand-maintained family and
tier table. A model is archived when a model in the same family has a strictly higher tier
number. Two quirks:

- Sol, Luna and Terra all sit at `{ family: "gpt", tier: 4 }`, tied, so none archives the others,
  while `gpt-5.5-high` at tier 3 is archived by all three.
- A separate `FORCE_ARCHIVED_MODELS` set overrides the rule for seven models: Composer 2.0,
  Composer 2.5, Kimi K 2.6, Luna, Opus 4.7, Opus 4.8 and Terra. Two of those, Luna and Terra, are
  GPT-5.6 runs that the sort-order table treats as the newest GPT entries in the project.

Meanwhile `gallery-model-order.ts` holds a **second, different** numbering for the same models
(`sol: tier 59, luna: 58, terra: 57`), used for sort order rather than archiving. So the project
carries two disagreeing opinions about model recency.

**Cost.** Low, and mostly a maintenance smell. But the effect is visible: the top-ranked model in
the project is hidden by default.

**Fix.** One table, with a real release date per model, feeding both sort order and archiving.
Drop `FORCE_ARCHIVED_MODELS` or rename it to what it is, a manual "hide this" list.

---

## A9. The thumbnails are not clean captures

**Claim at risk:** "each card shows five real rendered previews", from `README.md`.

**Evidence.** Two sample thumbnails inspected directly,
`public/gallery-previews/with-design-skill/opus-5/1.webp` and
`public/gallery-previews/without-design-skill/sonnet-5/3.webp`. Both contain:

- the gallery's own floating switcher down the right edge (home icon, "VS", skill icon, palette
  icon, iteration chips 1 to 5, with the current one highlighted in the site's pink)
- the circular Next.js development-mode badge in the bottom-left corner

Cause, from `scripts/capture-previews.mjs`: it visits
`${baseUrl}/${group}/${model}/${iteration}?preview=1`, and nothing in the application reads
`preview=1`. The switcher-free route is `/preview/{group}/{model}/{iteration}` and exists. The
script also starts `npm run dev`, which is what puts the development badge on screen.

**Cost.** Medium. The previews are the first thing every visitor sees, they are the guessing
game's board, and they are the rankings page's illustrations. In the guessing game the pink chip
is a mild tell about nothing, and the site's own chrome sits inside images meant to show only the
model's work.

**Fix.** Two lines. Point the capture script at `buildPreviewHref(...)` and run it against
`npm run build && npm run start` instead of `npm run dev`. Then re-capture all 320.

---

## A10. The guessing game's chance baseline is not marked

**Claim at risk:** the score tiers.

**Evidence.** From `src/components/game/model-lab-wordle.tsx`: 5 rounds, 3 guesses per round,
8 labs to choose from, and the answer is the lab, not the model. Three guesses without
replacement from eight options gives a 37.5% chance of hitting by luck alone. The tier table
places "Coin Flipper" at 34% and above and "Pattern Matcher" at 66% and above.

So "Coin Flipper" is literally the random band, which the copy half-acknowledges ("Lady luck
showed up today more than your eye did"), and anything below 34% is worse than guessing.

**Cost.** Low. It is a game, and the naming happens to be roughly right. Worth stating because a
reader might mistake a 40% score for skill.

**Fix.** Show the chance line, for example "random play scores about 2 of 5", on the results
card. It makes a 4 of 5 feel earned.

---

## A11. One model, one product, one page type

**Claim at risk:** generalising from this gallery to design ability at large.

**Evidence.** Every one of the 325 pages is a marketing landing page for a note-taking app.
There is no dashboard, no form, no data table, no mobile layout, no empty state, no dark variant,
no multi-page flow.

The project knows this. `src/app/experiments/page.tsx` is a live page of five low-fidelity
concepts for growing past one prompt, headed "Exploration, not implemented yet", proposing
scenario tabs, a harness-by-model matrix, saved comparison baskets, a split workspace, and a
query-string experiment lab. It has sat unimplemented since April.

**Cost.** Medium, and inherent to the design rather than a defect. Landing pages reward exactly
the skills a design skill teaches: a strong hero, typographic contrast, a colour direction. They
do not test information density, state handling, or accessibility, which is where most real
frontend work lives.

**Fix.** The project's own `experiments` page already names the answer. The cheapest second
scenario is a settings or data-table screen, because it inverts what landing pages reward.

---

## Summary table

| ID | Finding | Cost | Fix effort |
| --- | --- | --- | --- |
| A1 | Four skill versions inside one group | High | Medium |
| A2 | One taste run had 13 skills | Medium | Low |
| A3 | 47 of 65 runs have no treatment evidence | Medium | Medium |
| A4 | UI SH treatment unidentified | Low | Low |
| A5 | No date, agent, model build, retries or cost | High | Medium |
| A6 | Switcher deliverable deleted at ingestion | Medium | Low |
| A7 | Rankings stale, partial, mostly hidden | High | Low |
| A8 | Two disagreeing recency tables | Low | Low |
| A9 | Thumbnails contain site chrome and a dev badge | Medium | Low |
| A10 | Chance baseline unmarked in the game | Low | Low |
| A11 | One prompt, one product, one page type | Medium | High |

Three fixes carry most of the value: date-stamp and scope the rankings (A7), record skill
version and run metadata (A1 plus A5), and re-capture the thumbnails from the clean route (A9).
The first two are data-model changes of a few hours. The third is two lines and a rebuild.

---

<!-- 11archive-source: 05-engineering-findings.md -->

# Engineering findings

Eleven defects found by reading the code and probing the live site. Each one names the evidence,
the cause, and a fix. Severity is about visitor impact, not about how hard the fix is.

Nothing here was reproduced by running the project. Claims that depend on a build are marked.

---

## E1. Every page downloads a 643 KB stylesheet

**Severity: high.**

**Evidence.** Measured against the live site on 2026-08-11:

| Asset | Bytes |
| --- | --- |
| shared CSS chunk `0iqd0d00u8-fe.css` | 643,192 |
| second CSS chunk `0nw9zuxb1hy6f.css` | 514 |
| home page HTML | 234,839 |
| `/rankings` HTML | 52,108 |
| `/lab-guess` HTML | 17,342 |

**Cause.** `src/app/globals.css` line 1 is a bare `@import "tailwindcss";` with no source
restriction. Tailwind v4's automatic file detection then scans the project from the repository
root and generates a utility class for every one it finds. The repository contains 65 generated
apps under `src/variants` (683 `.tsx` files) plus four more copies of the corpus in root folders
such as `with-frontend-design-skill/`. So the shell's stylesheet ends up containing the union of
every utility class any model ever wrote.

This also explains why the three runs missing their per-run CSS bundle still look right: the
global bundle already carries their utilities. The bug and the accidental safety net are the same
line.

**Fix.** Restrict the shell's stylesheet to the shell, and keep the per-run bundles for the
variants:

```css
/* src/app/globals.css */
@import "tailwindcss" source(none);
@source "./";                    /* src/app */
@source "../components";
@source "../lib";
```

Then complete the per-run route coverage (see E4) so no run depends on the global bundle. Measure
the shared chunk before and after; the expectation is a shell bundle in the tens of kilobytes.

**Risk.** Any run without its own bundle will lose its utility classes the moment this lands. Do
E4 first, or do both in one change.

---

## E2. Dark mode never reaches native controls

**Severity: medium.**

**Evidence.** `src/app/globals.css`:

```css
:root {
  color-scheme: light !important;
  ...
}
.dark {
  color-scheme: dark;
  ...
}
```

And the inline script in `src/lib/gallery-theme.ts`, which the root layout injects into `<head>`:

```js
document.documentElement.style.colorScheme = d ? "dark" : "light";
```

**Cause.** In CSS, an `!important` declaration in a stylesheet beats a normal declaration in an
inline `style` attribute, and it beats any non-important rule regardless of specificity. So
`color-scheme: light !important` on `:root` wins over both `.dark { color-scheme: dark }` and the
inline value the theme script sets. The document's effective `color-scheme` is always `light`.

`color-scheme` is what tells the browser to render its own widgets dark: default scrollbars,
checkboxes, radio buttons, date pickers, text-input carets and the default canvas colour. In dark
mode those stay light.

The site partly masks this by hiding all scrollbars globally (`*::-webkit-scrollbar { display:
none }`), which removes the most obvious symptom, and the gallery shell has few native controls.
Generated variants have more.

**Fix.** Drop one word:

```css
:root {
  color-scheme: light;   /* was: light !important */
  ...
}
```

The `!important` was almost certainly added to stop a generated variant's `:root` rule from
changing the shell. Stage-one CSS scoping already prevents that, because it rewrites every
variant `:root` into the variant's own scope.

---

## E3. All 320 auto-captured thumbnails contain site chrome and a dev badge

**Severity: medium.** Also recorded as A9 in 04-methodology-audit.md,
because it is both a bug and a measurement problem.

**Evidence.** Two thumbnails opened directly:
`public/gallery-previews/with-design-skill/opus-5/1.webp` and
`public/gallery-previews/without-design-skill/sonnet-5/3.webp`. Both show the gallery's floating
switcher down the right edge and the round Next.js development badge bottom-left.

**Cause.** Two mistakes in `scripts/capture-previews.mjs`:

```js
const url = `${baseUrl}/${group}/${model}/${iteration}?preview=1`;
```

`?preview=1` is dead. A grep across `src` for `searchParams` finds it used only by the compare
page. The route that suppresses the switcher is `/preview/{group}/{model}/{iteration}`, built for
exactly this and used by the compare iframes.

```js
spawn(npmCommand, ["run", "dev", "--", "-p", capturePort], ...)
```

Capturing against the dev server puts the development badge in every frame.

**Fix.**

```js
// scripts/capture-previews.mjs
const url = `${baseUrl}/preview/${group}/${model}/${iteration}`;
```

and start the production server instead:

```js
spawn(npmCommand, ["run", "start", "--", "-p", capturePort], ...)
```

with a documented `npm run build` beforehand. Then re-capture everything:

```bash
npm run build
npm run capture-previews
```

Add a guard so this cannot regress: after each screenshot, assert that the page contains no
element matching `nav[aria-label$="gallery navigation"]`.

---

## E4. Three runs have no per-run CSS route

**Severity: medium, and rising the moment E1 lands.**

**Evidence.** Counted in the checkout:

| Item | Count |
| --- | --- |
| runs in the manifest | 65 |
| literal routes under `(generated-variant-routes)` | 56 |
| literal preview routes | 59 |

Missing non-preview routes: `kimi-k3`, `muse-spark-1.2`, `opus-5`, each in all three of their
groups. Missing preview routes: `kimi-k3` and `opus-5`, each in all three groups.

**Cause.** These route folders are generated by hand and
`skills/add-generation-to-gallery/SKILL.md` never mentions the step, so the three most recently
added models were ingested without them. They currently work only because of E1.

**Fix.** Write a generator script, `scripts/generate-variant-routes.mjs`, that reads the manifest
and emits both route folders and both CSS entries for every run, then wire it into `prebuild`
alongside `scope-variant-css.mjs`. Add the step to the ingestion skill. Add a test that asserts
the route count equals the manifest length times two.

---

## E5. There is no license

**Severity: high, and it is legal rather than technical.**

**Evidence.** GitHub reports `licenseInfo: null`. No `LICENSE`, `NOTICE` or `COPYING` file exists
in the checkout. The repository contains:

- 325 landing pages generated by 25 models from eight companies, redistributed as source
- brand logos for OpenAI, Anthropic, Google, xAI, Moonshot, Z.ai, Cursor and Meta, in
  `public/*.svg`, `public/*.webp` and `public/brand-raw/`
- two third-party skills' rule text, reachable through the copied source folders

**Cause.** Never added. The project is a personal weekend build that grew.

**Fix.** Three separate statements, because three different things are being distributed:

1. A license for the site's own code, for example MIT, covering `src/app`, `src/components`,
   `src/lib`, `scripts`, `tests`.
2. A statement about the corpus in `src/variants`: what it is, that it was produced by the named
   models from the stated prompt, and what a reader may do with it. This is the hard one and it
   deserves a sentence acknowledging that.
3. A trademark notice for the logos: used to identify the labs, no affiliation or endorsement
   implied, all marks belong to their owners.

---

## E6. The design document contradicts the shipped code

**Severity: low for visitors, high for anyone contributing.**

**Evidence.** `DESIGN.md`, 324 lines, states in section 1: "**Light-only canvas.** `#fafafa`,
locked. Dark mode is on the roadmap but not a current design constraint." Section 6 makes it a
rule: "**Don't** introduce **dark mode partially.** Light mode is locked until a full dark-mode
pass is designed; do not branch components defensively for a theme that doesn't exist yet."

The code disagrees. `globals.css` carries a complete `.dark` token set of 22 variables, there is a
`GalleryThemeProvider` and a `GalleryThemeToggle`, brand logos have light and dark variants via
`theme-aware-logo.tsx`, and a Playwright test asserts the dark theme survives navigating into a
generation and back. Dark mode arrived in pull request #8, "Add Gemini 3.5 Flash gallery editions
and dark mode", merged 2026-05-27.

`.impeccable/design.json` is stamped `"generatedAt": "2026-05-16T06:50:00Z"`, eleven days before
dark mode merged, which dates the drift precisely.

**Fix.** Update `DESIGN.md` sections 1, 2 and 6, and document the dark token set the same way the
light one is documented. Regenerate `.impeccable/design.json`.

The document is otherwise excellent and worth preserving: it names its rules ("The Signal Rule",
"The One-Face Rule", "The Game-Color Quarantine"), it explains why each exists, and it lists what
the site must not become. That is rarer than a colour table.

---

## E7. The repository is 179 MB, and most of it is scaffolding

**Severity: medium, mostly for contributors.**

**Evidence.**

| Measure | Value |
| --- | --- |
| GitHub disk usage | 179,385 KB |
| `src/` | 78 MB |
| `public/` | 93 MB |
| `package.json` files inside `src/variants` | 41 |
| `package-lock.json` files inside `src/variants` | 33 |
| `AGENTS.md` or `CLAUDE.md` files inside `src/variants` | 77 |
| tracked JPEGs under `.codex-remote-attachments/` | 3 |
| root folders holding a second copy of part of the corpus | 4 |

**Cause.** The ingestion recipe says "Keep the source app's internal directory shape intact where
possible", so each of the 65 ingested apps brings its whole Node project with it. None of it is
used at runtime: the adapter imports specific component files and nothing reads those lockfiles.
The root folders `with-frontend-design-skill/`, `without-frontend-design-skill/`,
`with-ui-sh-skill/` and `with-uncodexify-skill/` are excluded from `tsconfig.json` yet still
tracked, so 24 runs exist twice in git. The three `.codex-remote-attachments` JPEGs are cloud-agent
paste artifacts committed by accident in two separate commits.

**Fix.**

- Add an ingestion step that deletes `package.json`, `package-lock.json`, `tsconfig.json`,
  `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `README.md` and `favicon.ico` from
  the copied source. Keep `skills-lock.json`, which is the only provenance evidence the project
  has (see A1).
- Add `.codex-remote-attachments/` to `.gitignore` and remove the three files.
- Decide whether the root corpus folders are the archive of record or dead weight, then keep one
  copy.
- Move `public/gallery-previews` (93 MB and growing by 5 images per run) to Git LFS or an object
  store with the manifest holding URLs.

None of this shrinks history without a rewrite. It stops the growth, which matters more: at
5 images plus one full Node project per run, the next 25 models add roughly the same weight again.

---

## E8. No robots.txt, no sitemap, and 325 duplicate pages are indexable

**Severity: medium if discovery matters to the project.**

**Evidence.** Live probes on 2026-08-11:

| Path | Status |
| --- | --- |
| `/` | 200 |
| `/rankings` | 200 |
| `/lab-guess` | 200 |
| `/experiments` | 200 |
| `/compare` | 307 |
| `/with-design-skill/opus-5/1` | 200 |
| `/preview/with-design-skill/opus-5/1` | 200 |
| `/robots.txt` | 404 |
| `/sitemap.xml` | 404 |

The root layout's metadata sets only a title, a description and an icon. No `robots` directive
exists, so every one of the 325 `/preview/...` pages is a fully indexable near-duplicate of its
`/{group}/{model}/{iteration}` twin.

**Cause.** Never added. Next.js will generate both files from `app/robots.ts` and
`app/sitemap.ts`, and neither exists.

**Fix.**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/preview/" }],
    sitemap: "https://www.whichai.dev/sitemap.xml",
  };
}
```

```ts
// src/app/sitemap.ts
import { galleryManifest } from "@/lib/gallery-manifest";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.whichai.dev";
  const pages = ["", "/compare", "/rankings", "/lab-guess"];
  const variants = galleryManifest.flatMap((entry) =>
    entry.iterations.map((it) => `/${entry.group}/${entry.model}/${it.id}`),
  );
  return [...pages, ...variants].map((path) => ({ url: `${base}${path}` }));
}
```

Also add Open Graph and Twitter card metadata. This is a project people share on X and in Slack,
and it currently produces a bare link with no image.

---

## E9. An unfinished exploration page is live and theme-broken

**Severity: low.**

**Evidence.** `https://www.whichai.dev/experiments` returns 200 and 44,938 bytes. Its own heading
reads "Exploration, not implemented yet" and its subtitle says "None of these are wired to data
yet". `src/app/experiments/page.tsx` styles its mockups with hardcoded literals such as
`bg-white`, `text-neutral-900` and `border-neutral-200` rather than the `--gallery-*` tokens every
other surface uses, so it renders as a light page inside a dark shell.

It is not linked from the navigation, but it is crawlable, shareable and 239 lines long.

**Cause.** A design exploration from April that was never gated or removed.

**Fix.** Keep it, because the ideas in it are the project's roadmap, but move it behind a
`NEXT_PUBLIC_SHOW_EXPERIMENTS` flag or into a markdown document, and convert the mockup colours to
the theme tokens if it stays a page.

---

## E10. Duplicate libraries in the dependency list

**Severity: low.**

**Evidence.** `package.json` lists `framer-motion@^12.23.24` and `motion@^12.38.0`, which are the
same animation library under its old and new package names, plus `gsap@^3.15.0`. It also lists
both `lucide-react` and `@phosphor-icons/react`.

**Cause.** Almost certainly inherited: generated variants import whichever library their model
reached for, and the dependency was added to the root project to make the build pass.

**Fix.** Check which variants import which, then either pin the whole shell to `motion` and keep
`framer-motion` only if a variant needs it, or leave it and add a one-line comment saying why. Not
urgent; worth a note so a future contributor does not assume it is a mistake to clean up.

---

## E11. Route coverage in tests is a hand-maintained list

**Severity: low.**

**Evidence.** `tests/gallery-routes.spec.ts` smoke-tests the last five manifest entries
automatically plus 24 routes hardcoded in `sampleRouteSmokeCases`. It also hardcodes a
`forceArchivedModels` list of four models, while `src/lib/gallery-archived.ts` force-archives
seven, and it asserts the rankings list has exactly 8 items, which locks in the staleness
described in A7.

**Cause.** Reasonable pragmatism. Testing all 650 prerendered pages in Playwright would be slow.

**Fix.** Two cheap improvements. Derive the archived-model list from
`src/lib/gallery-archived.ts` instead of retyping it, so the two cannot drift. And replace the
hand-picked 24 with a deterministic sample, for example every run's default iteration, which is 65
page loads and covers every registry key. Keep the rankings count assertion but derive it from
`modelRankings.length`.

---

## Priority order

| Order | Finding | Why first |
| --- | --- | --- |
| 1 | E4 then E1 | E4 unblocks E1, and E1 is the biggest single win for every visitor |
| 2 | E3 | Two lines, and it fixes the first thing every visitor sees |
| 3 | E5 | Legal exposure does not improve with age |
| 4 | E2 | One word, visible to every dark-mode visitor |
| 5 | E8 | Cheap, and the project's growth depends on people finding it |
| 6 | E7 | Stops the repository doubling again |
| 7 | E6, E9, E10, E11 | Contributor-facing tidy-up |

---

<!-- 11archive-source: 06-surfaces-and-ux.md -->

# The four surfaces, and the design system behind them

## The shell, which is the argument

The site makes a claim by existing. `PRODUCT.md` states it as a design principle:

> **Practice what you preach.** This site argues, by existing, that AI can produce good frontend
> design *when paired with taste*. The shell itself has to be evidence of that pairing.

And then, at the bottom of the home page, in small italics: "This site was designed by Composer
2.0 LOL."

So the chrome around the gallery is itself an entry in the gallery. That is why the shell gets a
324-line design document while the rankings are eight hand-written paragraphs.

One element carries the whole shell: a floating glass navigation bar, fixed top right, on every
page. `src/components/gallery/gallery-rankings-nav.tsx` builds it as four links (Gallery, Compare,
Rankings, Lab guess) plus a theme toggle, separated by hairline dividers, on a translucent white
panel with a 12px backdrop blur.

Its one distinctive move: **the active item collapses to its icon and the inactive ones show
words.** The home link renders a house icon when you are on the home page and the word "Gallery"
when you are anywhere else. `DESIGN.md` calls this out as the thing to protect: labels crossfade
through a 4px blur over 220ms with an ease-out-quart curve, "the single most distinctive motion in
the whole shell".

## Surface 1: the gallery

`src/app/page.tsx`. Five sections, one per treatment, each a grid of cards that goes one column on
mobile, two on small screens and four on extra-large.

Each card, from `gallery-card.tsx`, shows a 16-by-10 thumbnail, the treatment label, the model name
with its lab's logo, five numbered chips linking to the five iterations, and a compare button. The
whole card lifts 6px on hover with a shadow. The chips use `tabular-nums`, which is a small,
correct detail: numerals stay the same width so the chips do not twitch.

Above the grid sits the header: the title "Which AI Made This?", one sentence of explanation, the
prompt in a blockquote with a copy button that flashes and shows "Prompt copied", three credit
links (GitHub, X, Buy Me a Coffee), and the Composer 2.0 joke.

**The archive control** is the interesting piece. Each section shows a "Show Archived" button only
when it actually has hidden cards, computed by comparing the filtered list against the full one.
Pressing it reveals superseded models. The rule behind it, in
`src/lib/gallery-archived.ts`, is that a model is archived when another model in the same family
has a higher tier number, plus a manual override list of seven. See A8 in
04-methodology-audit.md for why this produces odd results.

## Surface 2: compare

`/compare` plus six query parameters. Two panels, each one an `<iframe>` pointing at a
`/preview/...` route, each with its own five iteration chips floating over the top-right corner of
the frame, and a control strip for choosing treatment and model.

Three design choices worth naming:

**State lives entirely in the URL.** `buildCompareHref` writes all six parameters and
`parseCompareSearchParams` validates all six against the manifest, returning `"default"` when none
are present and `"invalid"` when any is missing, duplicated, or unknown. A comparison is therefore
a link you can paste into Slack, which is the point of the whole feature.

**Iframes, not client-side rendering.** Each panel loads a fully separate document. That is the
only way two generated apps with conflicting global CSS can appear on screen at once, and it is
worth the cost.

**The default comparison is the thesis.** `DEFAULT_COMPARE_STATE` opens GPT-5.4 with the design
skill next to GPT-5.4 without it. And `getCounterpartSelection` means that when you press compare
on any card, the site automatically fills the other side with the same model under the opposite
treatment. The one-click path is with-skill versus without-skill, which is exactly the comparison
the project is about.

## Surface 3: rankings

`/rankings`, from `src/lib/model-rankings.ts`. A single ordered list, eight items, each with a
rank number, the model name and logo, one large screenshot of the iteration the author considers
that model's best, and a paragraph of prose. The page's whole subtitle is: "This is a ranking
based off my taste."

The prose is the best writing in the project. Rank 1 (Opus 4.7) on why it beats 4.6:

> Page three on iteration three is the one that got me: a full mushroom illustration, and card
> icons that look like proper SVG marks instead of the random emoji some Opus runs lean on.

Rank 4 (Composer 2.0):

> It still has Composer sickness: it does the bare minimum. Landings here tend to be one screen
> tall (nothing to scroll), because it rarely goes past what you literally asked.

One neat piece of engineering supports it. `src/components/ranking-notes.tsx` scans each note for
the phrase "iteration one" through "iteration five", in words or digits, and turns every match into
an inline chip that links straight to that generation. So the sentence above becomes clickable at
the exact page it describes, with no markup in the note text. The regex is
`/\biteration\s+(one|two|three|four|five|[1-5])\b/gi` and it is the kind of small idea worth
copying: let the prose stay prose, and derive the links.

The problem is not the writing, it is the currency. See A7.

## Surface 4: Lab Guess

`/lab-guess`, from `src/components/game/model-lab-wordle.tsx`, 1,007 lines and the largest
component in the project. It came in as pull request #6, "Add Wordle-style AI lab guessing game".

Rules:

| Setting | Value |
| --- | --- |
| Rounds | 5 |
| Guesses per round | 3 |
| Options | 8 labs (GPT, Claude, Gemini, Meta, X AI, Kimi, GLM, Composer) |
| Board | one random generation from all 325, shown in an iframe |
| What you name | the lab, not the model |

Each round shows a preview and a floating picker at the bottom. The picker composites three states
into one button, which `DESIGN.md` calls the system's most elaborate component:

- **Wrong guesses accumulate visibly.** A rose-tinted bar grows behind the picker label,
  proportional to wrong guesses out of three, and the border turns rose.
- **A wrong submit shakes.** A 420ms four-step lateral shake, plus or minus 7px then plus or minus
  5px. No fade, no scale.
- **A correct submit pops.** A 620ms scale to 1.045 and back with a green ring and a single
  diagonal white sheen sweeping across at an 18-degree skew. `DESIGN.md` defends this as "the one
  piece of decorative motion in the system", earned because it happens once, at a payoff.

Progress shows as five dots rather than a bar, one per round, filled green for solved, red for
missed, outlined for the current one.

At the end you get a rank title from a seven-step table (Model Whisperer at 5 of 5, then Signal
Reader, Pattern Matcher, Getting Warmer, Coin Flipper, Rookie Eye, Back to the Lab at zero), plus
accuracy, best streak, average guesses per solved round, and a per-round breakdown. Sharing works
two ways: emoji tiles in text, green for first or second try and yellow for third, and a rendered
score card produced client-side with `html-to-image`, copied to the clipboard or downloaded.

The game is the project's best answer to its own thesis. You cannot describe a model's visual tics
in a table. You can teach someone to recognise them by making them guess.

## The unshipped fifth surface

`/experiments` is live, unlinked, and honest about itself: "Exploration, not implemented yet". It
holds five low-fidelity concepts for growing the bench past one prompt and one skill axis:

1. **Scenario tabs with shared filters.** Each real-world test gets a tab; filters apply within the
   active scenario. Noted tradeoff: tabs overflow once you have dozens of runs.
2. **A matrix board, harness by model.** Rows are agents or tool stacks, columns are models, each
   cell a generation. Filled and hollow dots mark which cells exist. Noted tradeoff: dense on small
   screens, needs careful empty states.
3. **Saved views and compare baskets.** Named filter presets in a sidebar; pick two and diff them.
   Noted tradeoff: presets rot without disciplined naming.
4. **A split workspace.** Two independent gallery panes, each with its own controls.
5. **A query-string experiment lab.** Every axis (prompt, harness, skill, date) encoded in the URL,
   so a link reproduces an exact slice. The mockup shows
   `/gallery?prompt=second-brain&harness=cursor&skill=design&iteration=3&models=opus,gemini`.

That fifth concept is the answer to almost every methodology finding in this teardown. It names
`harness`, `skill` and a date stamp as first-class axes, which is exactly what the current data
model lacks. The project worked out what it needs in April and has not built it.

## The design system, in short

`DESIGN.md` plus `.impeccable/design.json` define the shell. The document is 324 lines and reads
like a real design system rather than a colour dump.

| Dimension | Rule |
| --- | --- |
| Canvas | `#fafafa`, never pure white; ink `#171717`, never pure black |
| Accent | one colour, Signal Pink `#b84a8c`, for active state, focus, and the single primary action per surface |
| Typeface | Geist Sans alone; hierarchy from scale, weight and tracking only |
| Elevation | flat at rest; every shadow is earned by hover, focus, or a payoff moment |
| Glass | backdrop blur on exactly four components: the nav, the variant switcher, the compare selects, the game picker |
| Motion | ease-out curves only, never bounce or elastic; animate transform and opacity, not layout |
| Game colours | emerald, rose and amber exist only inside Lab Guess, never in the shell |

Three of its rules are named and enforced by prose: **The Signal Rule** (if the pink covers more
than about 10% of a screen, the design has failed), **The One-Face Rule** (no second typeface, ever)
and **The Game-Color Quarantine**.

Its anti-references are as useful as its rules. The site must not become an AI evaluation
leaderboard (dense tables, logo walls, accuracy bars), a generic SaaS landing page (gradient hero,
identical feature-card grid, glass everywhere), a command-terminal interface (monospace body,
dark by default, dense controls), or a wall of data. `PRODUCT.md` adds the reason: three audiences
land on the same page, a researcher, a builder and someone who heard about vibe coding yesterday,
and none of them should have to translate.

The document has one flaw, which is that it describes a light-only site and the site has had dark
mode since May. See E6 in 05-engineering-findings.md.

---

<!-- 11archive-source: 07-project-facts.md -->

# Project facts

Everything here was read from the repository, the GitHub API, or the live site on 2026-08-11.

## Identity

| Field | Value |
| --- | --- |
| Repository | `SunkenInTime/ui-design-bench` |
| Site | <https://www.whichai.dev/> |
| Package name | `composer-bench-gallery` version `0.1.0`, private |
| Author | Dara Adedeji, GitHub `SunkenInTime`, X `@daradoescode` |
| Default branch | `master` |
| Created | 2026-03-21T19:51:17Z |
| Last push | 2026-08-09T21:27:51Z |
| License | none |
| Topics | `benchmark`, `design`, `ui` |
| Description on GitHub | empty |

The package name is a fossil. The project began as a Cursor Composer comparison and grew into a
25-model gallery; the name never changed, and the git history opens with "Add unified Next.js
gallery" on 2026-03-21.

## Size

| Measure | Value |
| --- | --- |
| GitHub disk usage | 179,385 KB |
| `src/` on disk | 78 MB |
| `public/` on disk | 93 MB |
| TypeScript | 4,527,932 bytes |
| CSS | 2,776,832 bytes |
| JavaScript | 177,222 bytes |
| HTML | 1,146 bytes |
| `.tsx` files under `src/variants` | 683 |
| `.css` files under `src/variants` | 122 |
| thumbnail images | 321 |

## Corpus

| Measure | Value |
| --- | --- |
| Runs (model plus treatment) | 65 |
| Distinct models | 25 |
| Labs represented | 8 |
| Generated pages | 325 |
| Source app types | 64 Next.js, 1 Vite |
| Prerendered pages on the live site | 650 gallery pages plus four surfaces |

Runs per treatment: design skill 25, no skill 25, taste skill 10, UI SH 4, Uncodexify 1.

The single Vite app is the Opus 4.6 design-skill run, `sourceDir`
`with-frontend-design-skill/opus-4.6/second-brain`, described in the manifest as "A Vite-based set
of five animated routes ported into the unified gallery runtime". Everything since has been
Next.js.

Source folder families, which are the closest thing to a run log the project has:

| Folder prefix | Runs | Reads as |
| --- | --- | --- |
| `with-frontend-design-skill/` | 12 | the original design-skill sweep |
| `without-frontend-design-skill/` | 12 | the original baseline sweep |
| `gpt-5-6-test/` | 9 | Sol, Luna and Terra, three treatments each |
| `ui-sh-test/` | 4 | the UI SH group |
| `kimi-k3/`, `glm5-2/`, `sonnet-bench/`, `muse-spark-test/`, `opus-cc-test/`, `grok-4-5-test/` | 3 each | later per-model sweeps, three treatments each |
| `composer-2.5-bench/`, `gemini-part-dou/`, `opus-4.8-test/` | 2 each | two-treatment sweeps |
| `fable-with-skill-run/`, `fable-test-taste-skill/`, `fable-test-run/` | 1 each | Fable 5, one folder per treatment |
| `with-uncodexify-skill/` | 1 | the Uncodexify run |

The shift from two-treatment to three-treatment sweeps marks when the taste skill entered the
project, around June.

## History

101 commits, 2026-03-21 to 2026-08-09.

| Month | Commits |
| --- | --- |
| 2026-03 | 25 |
| 2026-04 | 27 |
| 2026-05 | 14 |
| 2026-06 | 11 |
| 2026-07 | 14 |
| 2026-08 | 10 |

Authorship, counting all branches:

| Author | Commits |
| --- | --- |
| Dara Adedeji (`SunkenInTime` noreply address) | 77 |
| Dara Adedeji (personal address) | 28 |
| `vercel[bot]` | 1 |
| `posthog[bot]` | 1 |

One human, two git identities, two bots. There is no second contributor in the commit history.

Eighteen pull requests, fourteen merged and four open.

| # | Title | State | Author |
| --- | --- | --- | --- |
| 18 | Complete Muse Spark 1.2 gallery | merged | SunkenInTime |
| 17 | Add project support and sponsor links | merged | SunkenInTime |
| 16 | Add complete Muse Spark 1.2 generations | merged | SunkenInTime |
| 15 | Install and configure Vercel Web Analytics | open | `vercel` bot |
| 14 | Add PostHog analytics integration | open | `posthog` bot |
| 13 | Add Kimi K3 gallery generations | merged | SunkenInTime |
| 12 | Optimize compare page and site-wide performance | open | SunkenInTime |
| 11 | Add gallery preview assets for variant showcases | merged | SunkenInTime |
| 10 | Add keyboard navigation | open | `jadefw` (Jonas) |
| 9 | Add Fable 5 gallery entries and keep Opus 4.8 visible | merged | SunkenInTime |
| 8 | Add Gemini 3.5 Flash gallery editions and dark mode | merged | SunkenInTime |
| 7 | Codex/hero title treatments | merged | SunkenInTime |
| 6 | Add Wordle-style AI lab guessing game and top-level "Lab guess" tab | merged | SunkenInTime |
| 5 | Uncodixify Bench and site cleanup | merged | SunkenInTime |
| 4 | Cursor/gallery previews and config | merged | SunkenInTime |
| 3 | Gallery: WebP brand assets, variant switcher, and design-skill UI | merged | SunkenInTime |
| 2 | Small UX Changes | merged | SunkenInTime |
| 1 | Replace variant switchers with shared gallery navigation | merged | SunkenInTime |

Three things stand out.

**The branch names are an agent log.** Twelve remote branches survive, prefixed by the tool that
opened them: `cursor/gallery-previews-and-config`, `cursor/rankings-page`,
`cursor/gallery-brand-webp-assets`, `cursor/gallery-card-hover-animation`,
`codex/fable-generation-upstream`, `agent/add-muse-spark-1-2-generations`,
`posthog/instrumentation-1808cc`, `vercel/install-and-configure-vercel-w-47ff2h`, plus
`feature/`, `uncodixify-` and `master`. Merged branches such as `codex/hero-title-treatments` and
`agent/add-kimi-k3-generations` appear in the pull request record. The project is built by agents
and the prefixes record which one.

**Recent model additions are single agent pull requests.** #13 opened and merged within five
minutes; #16 within six. That is the `add-generation-to-gallery` skill paying off.

**The only outside contribution is still open.** Pull request #10, "Add keyboard navigation" from
Jonas, opened 2026-06-10, unmerged two months later. `PRODUCT.md` says keyboard navigation "should
work where it would naturally work" but "does not need formal audit", which explains the low
priority.

The first pull request is the origin of the whole architecture: "Replace variant switchers with
shared gallery navigation". Before it, each generated app kept its own switcher. That change is
what created the ingestion rule that deletes them, which is also A6 in
04-methodology-audit.md.

## Hosting and delivery

| Field | Value |
| --- | --- |
| Host | Vercel |
| Framework | Next.js 16.2.0, React 19.2.4, Tailwind CSS 4 |
| Rendering | fully prerendered (`x-nextjs-prerender: 1`) |
| Cache | `public, max-age=0, must-revalidate`, `x-nextjs-stale-time: 300` |
| Edge at time of check | `cdg1`, cache HIT, age 170,465 seconds |
| Transport security | `Strict-Transport-Security: max-age=63072000` |
| Analytics | none live; two bot pull requests propose Vercel Analytics and PostHog, both unmerged |
| `robots.txt` | 404 |
| `sitemap.xml` | 404 |
| Page title | "Which AI Made This?" |
| Meta description | "Compare AI-generated UIs from the same prompt across models, with and without a frontend design skill." |
| Open Graph tags | none |

The cache age of roughly 47 hours at check time matches the last deployment, which fits a site
that changes only when a model is added.

No analytics is worth noting alongside the sponsorship pitch: the project asks for money to fund
runs and has no measurement of its own reach.

## Money and support

Three funding lines, all disclosed on the site and in the README:

- **Buy Me a Coffee**, <https://www.buymeacoffee.com/daradoescode>. The README is direct about
  what it pays for: "Running fresh model generations is the main cost behind WhichAI.dev."
- **Greptile Open Source Program**, providing AI code review, credited with an animated badge on
  the home page and in the README.
- **OpenAI Codex for Open Source**, providing "tooling and credits that support open-source
  maintenance and benchmark development".

The OpenAI sponsorship is worth stating plainly, without implying anything about the content: a
benchmark that compares OpenAI models against competitors receives credits from OpenAI. Nothing in
the code or the rankings suggests it changed any judgement, and the rankings that exist put two
Anthropic models first and GPT-5.4 fifth with a sharp note about card overuse. But the relationship
is a fact a reader should know, and the site does disclose it.

## Neighbours

Similar projects found while researching, for orientation rather than comparison:

- **Design Arena** (Y Combinator S25), a crowdsourced head-to-head benchmark for AI-generated
  design across frontend, image, audio and video. Human pairwise voting produces a leaderboard.
  <https://news.ycombinator.com/item?id=44878257>
- **DesignArena**, an earlier crowdsourced benchmark for AI-generated interface work.
  <https://news.ycombinator.com/item?id=44542578>
- **UI-Bench**, an academic benchmark for the design capability of text-to-app tools.
  <https://arxiv.org/abs/2508.20410>
- **Graphic-Design-Bench**, an academic benchmark for graphic design tasks.
  <https://arxiv.org/html/2604.04192v1>

WhichAI.dev occupies a different position from all four. Those produce scores through crowd votes
or automated rubrics. This one produces no score at all and hands you the artifacts. That is a
deliberate choice, stated in the README's opening: other leaderboards prove "Model A is 2.3% better
than Model B", and "none of those spreadsheets tell you what you actually want to know: if I ask
this thing to build a landing page, will it look good?"

Its distinctive asset is the corpus. 325 preserved, running, side-by-side generated applications
from 25 models under labelled conditions is, as far as this search found, unique. No leaderboard
lets you open the code.

## Reception

Direct search for coverage of "whichai.dev" or "Which AI Made This" returned nothing: no Hacker
News thread, no blog posts, no aggregator entries. With 77 stars and 8 forks, the project has real
but small reach, and it appears to travel by direct link rather than through indexed writing. The
missing `sitemap.xml`, absent Open Graph tags and lack of analytics all point the same way. See E8
in 05-engineering-findings.md.

---

<!-- 11archive-source: 08-rebuild-blueprint.md -->

# Rebuild blueprint

If you were building this again, here is what to keep unchanged, what to change, and what to add.
This is a design document, not a claim about what the original should have done. The original is a
personal project by one person and it works.

## Keep these five ideas exactly as they are

**1. No score.** The decision not to produce a number is the project's best judgement call. A
leaderboard would have invited argument about the rubric and hidden the artifacts. Handing someone
325 running pages and letting them look is a stronger product than any weighted average.

**2. One manifest as the single source of truth.** Routes, thumbnails, dropdowns, tests and game
rounds all derive from one array of 65 entries. Adding a model means editing one list and the rest
follows. Keep this and resist the urge to move it to a database before you have a reason.

**3. The `:where()` scoping trick.** Prefixing every variant selector with
`:where(.gallery-generation[data-gallery-group="..."][data-gallery-model="..."])` adds zero
specificity, so the model's own cascade survives untouched. Combined with rewriting `html`, `body`
and `:root` into that scope and namespacing every `@keyframes`, it is the cleanest solution to
running dozens of hostile stylesheets in one document. This is the most reusable single idea in the
project.

**4. Iframes for side-by-side.** Two generated apps cannot share a document. Accept the iframe.

**5. The ingestion recipe as a written skill.** Turning the chore into a 219-line instruction file
is why a new model now lands as one pull request. Write the recipe before you need it the third
time.

## Change these six things

### 1. Make the run the unit of record, not the card

Extend `GalleryEntry` from 8 fields to 13. Every one of these was cheap to capture at generation
time and is impossible to recover afterwards:

```ts
interface GalleryEntry {
  // existing
  group, groupLabel, model, modelLabel, sourceDir,
  sourceAppType, defaultIteration, summary, iterations,

  // added
  generatedAt: string;          // ISO date of the run
  agent: string;                // "claude-code@2.1.0", "cursor@1.8", "api"
  modelBuild: string;           // the exact model string sent to the API
  reasoningEffort: string;      // "max", "high", "default", "unknown"
  skill: { name: string; source: string; hash: string } | null;
  builtSwitcher: boolean;       // did it satisfy that part of the brief
}
```

`unknown` is a legitimate value for all of them. Showing `unknown` on a card is more honest than
showing nothing, and it creates pressure to fill it in next time.

The `skill.hash` field is the one that matters most. The current project already has this data for
18 of 65 runs, sitting unread in `skills-lock.json` files inside the copied sources. Reading it
during ingestion is a few lines of code and it converts an unfalsifiable label into evidence. See
A1 in 04-methodology-audit.md.

### 2. Freeze the skill version per sweep

The root problem is not that the skill changed. It is that runs from different months share one
section heading. Two options, and the second is better:

- **Pin it.** Install one exact skill commit for a whole sweep and record the hash.
- **Version the group.** Make the treatment `design-skill@93f53fd`, not `design-skill`, and let the
  home page group cards by version. Then a visitor comparing two cards can see whether they read the
  same instructions, and you gain the ability to answer a genuinely interesting question: did the
  skill rewrite improve outputs for the same model?

### 3. Generate the routes, do not hand-write them

Three runs are missing their per-run CSS route because that step lives only in a maintainer's head.
Write `scripts/generate-variant-routes.mjs`, read the manifest, emit both the route folders and
their four-line Tailwind entries, and run it from `prebuild` next to `scope-variant-css.mjs`. Add a
test asserting the route count equals the manifest length times two.

Then restrict the shell stylesheet with `source(none)` plus explicit `@source` lines, which is what
turns the 643 KB shared bundle into a small one. Do these two in one change; either alone breaks
something.

### 4. Capture thumbnails from the clean route, in production mode

Point the capture script at `/preview/{group}/{model}/{iteration}` and run it against
`npm run start`, not `npm run dev`. Then assert, after every screenshot, that the page contains no
`nav[aria-label$="gallery navigation"]`. The current thumbnails carry the site's own switcher and the
Next.js dev badge, which means the images the whole site is built around show the site instead of
just the work.

### 5. Date the rankings or drop them

A present-tense page called "Rankings" that ranks eight superseded models, all of them hidden from
the gallery by default, misleads a first-time visitor. Pick one:

- **Snapshot.** Retitle to "Rankings, April 2026", keep the prose, add a line saying it is not
  maintained. The writing is good and worth keeping.
- **Current.** Rank today's models and let the old notes move to an archive page.

The prose format itself is right. Do not replace it with stars or scores.

### 6. Strip the scaffolding at ingestion

Keep the components, the CSS, the assets and `skills-lock.json`. Delete `package.json`,
`package-lock.json`, `tsconfig.json`, the ESLint and PostCSS configs, the README and the favicon.
None is read at runtime, and together with 33 committed lockfiles they are most of why the
repository is 179 MB. Move `public/gallery-previews` to an object store or Git LFS before the next
25 models double it again.

## Add these three things

### 1. A second scenario

Every one of the 325 pages is a marketing landing page. Landing pages reward exactly what a design
skill teaches: a strong hero, typographic contrast, a committed colour direction. They do not test
information density, state handling, empty states, or accessibility, which is where most real
frontend work lives.

The cheapest useful second scenario is a **settings screen or a data table**, because it inverts
what landing pages reward. The project's own `/experiments` page already worked this out in April
and proposed scenario tabs and a harness-by-model matrix to hold it.

Adding a second scenario also forces the URL scheme to grow the axis it needs, which the
`/experiments` mockup already spells out:

```
/gallery?prompt=second-brain&harness=cursor&skill=design&iteration=3&models=opus,gemini
```

### 2. One objective measure, kept small

The project is right that design quality resists scoring. But two things about these pages can be
measured without a rubric, and both are interesting:

- **Did it satisfy the brief?** Five routes present, and a working switcher. Boolean, checkable at
  ingestion, currently thrown away.
- **What does it weigh?** Page bytes, request count, largest contentful paint. A model that produces
  a beautiful page that takes four seconds to paint has told you something real about itself.

Two fields, both machine-collected, neither pretending to judge taste. Keep them off the cards and
put them on the model page, so the gallery stays a gallery.

### 3. Run-to-run variance, at least once

The five iterations measure range within one attempt. Nothing measures whether the same model, given
the same prompt twice, produces work of similar quality. Run one model three times under identical
conditions and publish the three sets side by side. It is a single sweep, and it answers the question
every reader of a five-page gallery quietly has: how much of this is the model and how much is luck?

## What good looks like

A visitor should be able to answer four questions from the site, in under a minute each:

1. What does this model produce from a blank brief? **The current site does this well.**
2. Does installing a design skill change that? **The current site does this well, for the paired
   comparison.**
3. When was this made, by what, with which skill version? **Not answerable today.**
4. Is this model consistent? **Not answerable today.**

Fixing three and four is a data-model change and one extra sweep. Neither requires a rubric, a
crowd, or a scoring model, which means the project can close both gaps without becoming the thing
its own `PRODUCT.md` says it must never become.

---

<!-- 11archive-source: 09-glossary.md -->

# Glossary

Every term this report uses that is not everyday English, in the order you are likely to meet it.

**Agent skill, or skill.** A text file of instructions you install into a coding agent. The agent
reads it before writing code. In this project a skill carries design rules, for example "commit to
an aesthetic direction before you build" or "never use these overused fonts". Installing one is the
whole treatment being tested.

**Treatment.** The condition a run was carried out under. This project has five: the Anthropic
design skill, the community taste skill, a skill it labels UI SH, the Uncodexify skill, and no skill
at all. The project's own word for a treatment is *group*.

**Run.** One model working under one treatment, producing five landing pages. There are 65 runs.

**Iteration.** One of the five landing pages inside a run. Important: the five are five *different
designs the model was asked to produce in one sitting*, not five repeats of the same design. They
measure range, not consistency.

**Generation.** One iteration, considered as an artifact. 65 runs times 5 iterations is 325
generations.

**Manifest.** `src/lib/gallery-manifest.ts`, a hand-maintained array of 65 entries. Every route,
thumbnail, dropdown option, test case and game round is derived from it. If you change the project,
you almost always change this file.

**Registry.** `src/lib/gallery-registry.ts`, an object that maps a string like
`"with-design-skill:opus-5"` to the code that renders that run. It exists because the manifest is
plain data and cannot import React components.

**Variant.** The project's word for one run's code as it lives inside the gallery, at
`src/variants/{group}/{model}/`. It holds the model's original app under `source/` plus a small
adapter, `index.tsx`.

**Adapter, or variant module.** The hand-written `index.tsx` that reduces a whole generated Next.js
app to one function: given an iteration number, return React elements. Every one is different because
every model organised its five designs differently.

**Scoping, or CSS scoping.** Rewriting a stylesheet so its rules can only affect one part of the
page. Here it means prefixing every selector with the run's identity so that a model's `body`
background styles only its own container instead of the whole site.

**`:where()`.** A CSS function that wraps selectors and contributes zero specificity. Wrapping the
scope prefix in `:where()` is what lets the project add three selectors to every rule without
disturbing the original ordering. It is the single most important line in the CSS pipeline.

**Specificity.** How CSS decides which rule wins when two rules target the same element. More
specific selectors beat less specific ones. Adding selectors normally raises specificity, which is
why `:where()` matters.

**`!important`.** A CSS marker that makes a declaration beat almost everything else, including
values set directly on an element by JavaScript. The project uses it to defend the shell's
background, and one misplaced use is why dark mode never reaches native browser controls.

**`@keyframes`.** A CSS block that defines an animation by name. Names are global, so two models that
both named an animation `float` would collide. The build step renames every one to include the run it
came from.

**Tailwind, and utility classes.** Tailwind CSS is a system where you style elements by composing
small single-purpose class names such as `px-4` or `text-xl`. Those classes do not exist as CSS until
Tailwind scans your source files and generates the ones you used. That scanning step is the cause of
the project's 643 KB stylesheet.

**`@source` and `source(none)`.** Tailwind v4 directives that control which files Tailwind scans.
`source(none)` switches off automatic scanning; `@source "path"` adds one folder back. The project
uses both to give each run its own small stylesheet, and forgets to use them on the shell's.

**Shell, or chrome.** The site's own interface: the floating navigation, the variant switcher, the
cards. Everything that is not a model's generated page. Keeping the shell and the generations from
styling each other is the project's central engineering problem.

**Variant switcher.** The vertical floating panel down the right edge of every generation page, with
a home link, a compare link, the model logo, and iteration chips 1 to 5. It replaces the switchers
the models were asked to build.

**Preview route.** `/preview/{group}/{model}/{iteration}`, the same generation rendered without the
variant switcher. Built for the compare page's iframes. Also the route the thumbnail capture script
should be using and is not.

**Prerendered, or static.** Built into plain HTML files at deploy time rather than assembled per
request. This site prerenders all 650 gallery pages, which is why it is fast and why every model
addition needs a rebuild.

**`generateStaticParams` and `dynamicParams = false`.** The Next.js pair that says "here is the
complete list of pages to build, and refuse anything not on the list". Together they turn the
manifest into the site's full route table.

**Route group.** A Next.js folder whose name is in parentheses, such as
`(generated-variant-routes)`. The parentheses keep the folder out of the URL, so it organises code
without changing addresses.

**Iframe.** An embedded browser window inside a page, loading a completely separate document. The
compare page uses two, which is the only way two generated apps with conflicting global styles can
appear on screen together.

**`skills-lock.json`.** A file written by the skill installer recording which skills were installed,
where they came from, and a content hash of each. Eighteen of the 65 runs carry one, and they are the
only hard evidence in the project of what treatment a run actually received.

**Content hash.** A short fingerprint computed from a file's exact contents. Two files with the same
hash are identical; different hashes mean the file changed. Four different hashes for the design skill
across eleven runs is how this report established skill version drift.

**Confound.** Something that varies alongside the thing you meant to test, so you cannot tell which
one caused the difference. Skill version is a confound here: it changed between runs that the site
presents as comparable.

**Archived, in this project's sense.** Hidden from the home page by default. A model is archived when
another model in the same family has a higher tier number, or when it appears on a manual
force-archive list. It does not mean removed; a "Show Archived" button reveals them.

**Force-archived.** On the manual hide list, `FORCE_ARCHIVED_MODELS`, regardless of the family rule.
Seven models are on it, including the one the rankings page places first.

**Lab.** The company that made a model: Anthropic, GPT, Google, Meta, X AI, Moonshot, Z.ai, Cursor.
The guessing game asks you to name the lab, not the model.

**Chance baseline.** The score you would get by guessing at random. With three guesses out of eight
labs, it is 37.5% per round, which lands inside the game's "Coin Flipper" band.

**Provenance.** The record of where something came from and how it was made. This project keeps
almost none: no date, no agent, no model build string, no reasoning setting, no retry count.

---

<!-- 11archive-source: 10-methodology-and-sources.md -->

# Methodology and sources

## What was examined

Three sources, all on 2026-08-11.

**The local checkout.** A full clone of the repository at commit `3bdd0cb` ("Merge pull request #18 from SunkenInTime/agent/add-muse-spark-1-2-generations",
2026-08-09). The working tree was clean and `HEAD` matched `origin/master` exactly, so the checkout
is the current published state, not a fork or a stale copy.

**The public repository.** `https://github.com/SunkenInTime/ui-design-bench`, read through the GitHub
CLI for metadata and the pull request list, and through a page fetch for the README rendering.

**The live site.** `https://www.whichai.dev/`, read through response headers, direct route probes, and
a page fetch of the home page.

## How the work was done

**Read the whole surface, sample the corpus.** Every file outside `src/variants` and
`src/app/(generated-variant-routes)` was read in full: 13 library files, 10 page components, 14
gallery components, three build scripts, three test specs, all configuration, `README.md`,
`PRODUCT.md`, `DESIGN.md` and the ingestion skill. The corpus itself, 683 component files and 122
stylesheets across 65 runs, was sampled rather than read: the adapters for the three newest models,
two full source trees, and two rendered thumbnails.

**Derive the numbers, do not trust the prose.** Every count in this report was computed from the
checkout rather than taken from the README. The manifest was parsed with a script to produce the
coverage grid and the run totals. Thumbnails, route folders, adapter files, nested lockfiles and
scaffolding files were counted with `find`.

**Extract skill provenance mechanically.** The central finding, four skill versions inside one
treatment, came from parsing all 18 `skills-lock.json` files under `src/variants` and comparing their
`computedHash` fields. That is a mechanical comparison of file fingerprints, not an interpretation.

**Verify live claims by probing.** Bundle sizes, HTML sizes, response headers, and the presence or
absence of `robots.txt` and `sitemap.xml` were measured with direct HTTP requests, not inferred from
the code.

**Look at the images.** Two thumbnails were opened and inspected visually. That is how the switcher
chrome and the Next.js development badge were found, and it is not something code reading would have
caught.

## What was not done, and why it matters

**The project was never built or run.** No `npm install`, no `npm run build`, no test execution. So
five kinds of claim in this report are code-reading conclusions rather than observations:

- The exact composition of the 643 KB stylesheet. The size is measured; the cause, unrestricted
  Tailwind source scanning, is inferred from `globals.css` having no `@source` directive.
- The `color-scheme` finding. The cascade rule that `!important` in a stylesheet beats a normal
  inline style is standard CSS behaviour, but the visible effect was not observed in a browser.
- Whether the three runs missing per-run CSS routes render correctly today. The reasoning is that the
  global bundle covers them; this was not confirmed by rendering.
- Whether the tests currently pass.
- Whether re-capturing thumbnails from the preview route produces clean images.

Each of those is marked at the point it is claimed.

**No generation was re-graded.** This report makes no judgement about which model designs better. It
does not check the rankings prose against the artifacts it describes.

**No model was re-run.** Every statement about how the generations were produced comes from
lockfiles, folder names, and the Next.js scaffold files inside each source. The reproduction recipe in
03-ingestion-pipeline.md is reconstructed and labelled as such.

**Git history was not archaeologically searched.** Commit messages and dates were read; diffs were
not. So the report can say when dark mode merged but not who wrote which line.

**Reception could not be established.** A direct search for coverage of the site returned nothing.
Absence of search results is weak evidence: it means no indexed writing was found, not that none
exists. The report states it that way.

## Confidence

| Claim type | Confidence | Basis |
| --- | --- | --- |
| Counts of runs, models, files, images | High | computed from the checkout |
| Skill version drift (four hashes) | High | mechanical hash comparison of 18 lockfiles |
| Architecture and data flow | High | full read of every non-corpus source file |
| Live site measurements | High | direct HTTP probes |
| Thumbnails contain shell chrome | High | two images inspected directly |
| Cause of the 643 KB bundle | Medium-high | one missing directive, standard Tailwind behaviour, not rebuilt |
| `color-scheme` never reaches dark | Medium-high | standard cascade rules, not observed in a browser |
| Reproduction recipe for a run | Low-medium | reconstructed from lockfiles and scaffold files |
| No external coverage exists | Low | absence of search results only |

## Sources

Primary:

- Local clone of the repository at commit `3bdd0cb`, all files outside the generated corpus
- <https://github.com/SunkenInTime/ui-design-bench>
- <https://www.whichai.dev/>

Skills named by the project, used to define the treatments:

- Anthropic `frontend-design`: <https://skills.sh/anthropics/skills/frontend-design>
- `uncodixfy` by cyxzdev: <https://skills.sh/cyxzdev/uncodixfy/uncodixfy>
- `design-taste-frontend` from `Leonxlnx/taste-skill`, identified from the run lockfiles, with
  published documentation at <https://www.tasteskill.dev/>

Comparable projects, for orientation only:

- Design Arena (YC S25): <https://news.ycombinator.com/item?id=44878257>
- DesignArena: <https://news.ycombinator.com/item?id=44542578>
- UI-Bench: <https://arxiv.org/abs/2508.20410>
- Graphic-Design-Bench: <https://arxiv.org/html/2604.04192v1>

## Note on tone

This report is critical in places about a personal project built by one person in five months, given
away for free, with its own methodology limits stated plainly in its README. That criticism is aimed
at how the artifact should be read, not at the work. The architecture is genuinely good, the
ingestion skill is genuinely reusable, and the decision not to invent a score is better judgement
than most benchmarks show.
