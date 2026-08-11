<!-- 11archive-source: README.md -->

# Modern UI/UX: A Working Reference

**Created:** 2026-08-11
**Audience:** people who design, build, or sign off on screen interfaces. Product designers, front-end
and design engineers, and the person who has to decide whether a release is good enough to ship.
**Objective:** describe what "modern" means in interface work right now, separate the parts backed by
measurement or law from the parts that are taste, and give checks you can run on a real product.
**Scope:** interface design and front-end interface behaviour for web and mobile, roughly 2023 to
August 2026. Covers principles, design systems and tokens, layout, colour and type, interaction and
motion, accessibility and the laws behind it, performance felt as experience, forms and sign-in,
AI-era patterns, deceptive design, and how to measure any of it.
**Not in scope:** brand identity, marketing copy, print, game UI, 3D and spatial interfaces beyond one
note, and any ranking of design tools. Tool leaderboards move monthly, so this report describes
mechanisms and thresholds instead.
**Evidence boundary:** public specifications, standards bodies, regulator text, browser vendor
documentation, large-sample crawls of real websites, and named academic work. All retrieved on
2026-08-11. Every material number has a source in
14-methodology-and-sources.md, with a note on how strongly it is
supported.

## Modern UI/UX in one paragraph

"Modern" is not a look. It is a set of constraints that got sharper: the interface must work on any
viewport without a fixed set of breakpoints, must stay usable for people who cannot see it or cannot
use a mouse, must respond inside a few hundred milliseconds on a mid-range phone, must not trick
anyone into a purchase, and must now also explain what an AI feature did and let a person undo it.
Most of those constraints are measurable, and several are legally enforceable in the EU as of
28 June 2025.

## The two words this report uses constantly

- **Design token:** a named design decision stored as data, for example `color.action.background`
  holding a specific green. Tokens let one decision update everywhere. See
  02.
- **Baseline:** a shared label the browser makers use for how safe a web feature is. "Newly
  available" means it just landed in every major engine. "Widely available" means it has been in all
  of them for about two and a half years. See 03.

## How to read this bundle

Start with the brief. Then jump to the section that matches the decision in front of you.

| File | What it covers | Read it if |
| --- | --- | --- |
| 00-executive-brief.md | The main result, twelve rules, a 30-minute audit | You have ten minutes |
| 01-principles-and-laws.md | Heuristics, Fitts, Hick, the 0.1/1/10 second limits, cognitive load | You are arguing about a design and want the older, sturdier ground |
| 02-design-systems-and-tokens.md | The token spec, token layers, headless components, who owns the code | You are building or buying a design system |
| 03-layout-and-responsive.md | Intrinsic layout, container queries, viewport units, safe areas | You are laying out a page or a component |
| 04-color-typography-and-theming.md | Contrast maths, oklch, `light-dark()`, type scales, line length | You are picking colours or type |
| 05-interaction-and-motion.md | Target sizes, focus, dialogs and popovers, view transitions, reduced motion | You are building a control or an animation |
| 06-accessibility-and-law.md | WCAG 2.2's nine new rules, WCAG 3 status, EAA and EN 301 549, the ARIA trap | You need to pass an audit or a legal review |
| 07-performance-as-ux.md | Core Web Vitals, real-world pass rates, page weight, perceived speed | Your product feels slow |
| 08-forms-and-authentication.md | Autofill tokens, input types, validation, passkeys | You own a form, a checkout, or a login |
| 09-ai-native-ux.md | The 18 human-AI guidelines, streaming, agent transparency, generative UI | You are putting a model in front of users |
| 10-anti-patterns-and-regulation.md | Deceptive design, cookie banners, accessibility overlays, zoom blocking | You want to know what now carries a fine |
| 11-measurement-and-research.md | HEART, SUS, how many testers, field versus lab data | You have to prove the design worked |
| 12-implementation-checklist.md | A ship gate you can paste into a pull request template | You are about to release |
| 13-glossary.md | 86 terms defined | A word is unfamiliar |
| 14-methodology-and-sources.md | How this was built, 55 sources, confidence, gaps | You want to check the work |

## Artifacts

| Artifact | Purpose |
| --- | --- |
| `00` to `14` Markdown files | The portable, readable report |
| `data.json` | The machine-readable evidence model: rules, thresholds, features, laws, failure modes, sources |
| `report.html` | One self-contained page with navigation, sortable tables, and a print layout |

`report.html` carries the same facts, order, and wording as the Markdown. It adds sorting,
highlighting, and column resizing. It never adds information the Markdown lacks.

## What this report will not tell you

- Which framework to use. None of the constraints here depend on one.
- Whether a specific design is good. Taste is real, and this report only covers the parts that can
  be checked.
- Anything about a private product. Every number comes from a public source.

---

<!-- 11archive-source: 00-executive-brief.md -->

# 00. Executive brief

## The main result

The gap between what the platform can do and what shipped sites actually do is now the single
largest source of bad user experience, and it is widening.

Two large crawls make the point. In February 2026 WebAIM tested the top million home pages and
found detectable failures against the accessibility standard on 95.9% of them, at an average of
56.1 failures per page. That is worse than 2025, when the same test found 94.8% of pages failing at
51 failures per page. Meanwhile the browser makers spent 2025 shipping features that remove the
usual excuses: one CSS function that picks a readable text colour for you, another that swaps light
and dark values in a single line, dialogs and tooltips that come with correct keyboard behaviour
built in, and container queries that let a component respond to its own width instead of the
window's.

So the bottleneck is not capability. It is that teams keep hand-building components that the
platform now provides correctly, and keep skipping four checks that would catch most of the damage:
text contrast, labels on inputs, a visible focus ring, and a target big enough to hit.

## Twelve rules that hold up

Each rule below is backed by a specification, a regulator, or a large measurement. The section link
gives the evidence.

1. **Contrast is the most-failed rule on the web, so check it first.** 4.5:1 for normal text, 3:1 for
   large text and for the visible edges of controls. Low-contrast text appears on 83.9% of the top
   million home pages. See 04, 06.
2. **Every input gets a real label.** Half of the top million home pages have an unlabelled input.
   Placeholder text is not a label: 53% of desktop inputs in the 2025 crawl relied on it alone. See
   08.
3. **Never remove the focus ring without replacing it.** About 67% of sites in the 2025 crawl remove
   the browser default. Use `:focus-visible` and make the indicator at least 2 CSS pixels thick with
   3:1 contrast. See 05.
4. **24 by 24 CSS pixels is the legal floor for a tap target; 44 is the comfortable one.** WCAG 2.2
   requires 24 with a spacing exception, Apple asks for 44 points, Android for 48 units. See
   05.
5. **Anything you can do by dragging must also work with a single tap or click.** This became a Level
   AA requirement in WCAG 2.2 (rule 2.5.7). Sliders, sortable lists, and map panning are the usual
   offenders. See 06.
6. **Do not ask for the same information twice in one flow, and let people paste into password
   fields.** WCAG 2.2 rules 3.3.7 and 3.3.8. Blocking paste breaks password managers and passkeys,
   which now have measurably higher sign-in success than typed passwords. See
   08.
7. **Respond within 200 milliseconds or show that you heard.** The web's responsiveness metric,
   Interaction to Next Paint, calls 200 ms or less good and above 500 ms poor, at the 75th percentile
   of real visits. The older human limits still apply: 0.1 second feels instant, 1 second keeps a
   train of thought, 10 seconds is the edge of attention. See 07,
   01.
8. **Budget the page, not the feature.** The median desktop page is now about 2.4 MB, with roughly
   1 MB of images and 0.7 MB of JavaScript, and about 280 KB of that JavaScript is never executed.
   Mobile page weight has tripled in ten years. See 07.
9. **Let the component decide its own layout.** Container queries are safe to use everywhere and
   replace most window-width breakpoints. A card that adapts to its container works in a sidebar, a
   grid, and a modal without new rules. See 03.
10. **Use the native element before reaching for ARIA.** ARIA is a set of attributes that describe
    roles and states to screen readers; it adds description, never behaviour. Pages using ARIA
    average 59.1 detected failures against pages without it at 42. See
    06.
11. **Honour the operating system's preferences.** Reduced motion, dark mode, forced colours, and
    text zoom are user settings, not suggestions. Only about half of pages respond to reduced motion,
    about 13% to colour scheme, and roughly one page in five still blocks pinch zoom on mobile. See
    04, 05.
12. **Make the AI's limits, sources, and undo path visible before its output.** The most-validated
    guidance here is 18 guidelines from Microsoft Research, tested against 20 shipped AI products by
    49 practitioners. Rule one is "make clear what the system can do." See
    09.

## What changed since 2023

| Change | What it means for your work | Date |
| --- | --- | --- |
| WCAG 2.2 became the current standard, adding nine rules | Drag alternatives, target size, focus not hidden, no repeated entry, accessible sign-in | Recommendation revised 2024-12-12 |
| The European Accessibility Act took effect | Selling to EU consumers now carries an accessibility obligation, tested against EN 301 549, which points at WCAG 2.1 AA | 2025-06-28 |
| Responsiveness metric changed from first input to every input | A page can no longer pass by being quick once; slow menus and filters now count | 2024-03 |
| Container queries and `:has()` became widely available | Component-level responsiveness and parent-aware styling without JavaScript | Since 2023 |
| The design token format reached its first stable version | Tokens can move between design tools and code without a custom converter | 2025-10-28 |
| Dialogs, popovers, tooltips, carousels, and selects became stylable native elements | Most custom overlay code is now a liability, not an asset | Through 2025 and 2026 |
| Deceptive design became an enforcement priority, not a talking point | A $2.5B settlement over subscription cancellation flows; an EU proposal on manipulative design due late 2026 | 2025 onward |
| AI features moved into mainstream interfaces | New obligations: state capability, show uncertainty, allow correction, keep a human undo | 2023 onward |

## The 30-minute audit

Run this on any screen. It catches most of what the large crawls find.

1. **Keyboard only.** Unplug the mouse. Tab through the whole flow. Can you reach every control,
   see where you are, and escape every overlay? Anything you can only reach by dragging is a
   Level AA failure.
2. **Zoom to 200%.** Text must not be cut off or overlap. Then zoom to 400% at a 1280 px wide
   window: content should reflow to one column, not scroll sideways.
3. **Contrast sample.** Check body text, muted or secondary text, placeholder text, disabled-looking
   text that is actually enabled, text on images, and the border of every input. Muted grey on white
   is the usual failure.
4. **Turn on reduced motion** in the operating system. Parallax, auto-playing carousels, and large
   sliding transitions should stop or shorten.
5. **One-handed phone check.** Are the primary actions reachable by a thumb? Is every input at least
   16 px, so the phone does not zoom when tapped? Are targets at least 24 px, with spacing?
6. **Throttle to a mid-range phone** and a slow network in the browser's developer tools. Then use
   the product's busiest interaction, for example a filter or a menu, and watch for a lag over
   200 ms.
7. **Read every error message aloud.** Does it say what happened, which field, and what to do?
8. **Try to cancel.** Count the clicks to undo, unsubscribe, or delete, then count the clicks to
   sign up. If cancelling is harder, that is now legal exposure, not just rudeness.
9. **If there is an AI feature:** can a first-time user tell what it can do, how often it is wrong,
   where its answer came from, and how to correct it? Can they turn it off?

## The one-sentence version

Modern interface work is mostly the discipline of using what the platform already does correctly,
respecting the settings the user already chose, and staying inside a few measured thresholds:
4.5:1 contrast, 24 px targets, 200 ms responses, 2.5 second loads, and no trick flows.

---

<!-- 11archive-source: 01-principles-and-laws.md -->

# 01. Principles and laws that still hold

Interface fashion turns over every few years. The findings in this section are between 30 and 75
years old and have survived every turn, because they describe people rather than technology. Use
them as the ground you argue from when taste is in dispute.

## The ten heuristics

Jakob Nielsen published ten "heuristics" (rules of thumb for spotting usability problems) in 1994,
last revised in 2020. They are not a checklist to pass. They are a vocabulary for naming what is
wrong.

| # | Heuristic | Plain reading | A modern violation |
| --- | --- | --- | --- |
| 1 | Visibility of system status | Always show what is happening | A save button that does nothing visible for two seconds |
| 2 | Match between system and the real world | Use the user's words | Labelling a screen "Entity Manager" |
| 3 | User control and freedom | Always offer an exit | A modal with no close button, only "Continue" |
| 4 | Consistency and standards | Same thing, same name, same place | Three different date pickers in one product |
| 5 | Error prevention | Make the mistake impossible | A free-text date field instead of a picker plus a mask |
| 6 | Recognition rather than recall | Show options, do not make people remember | Hiding navigation behind a hamburger on a wide desktop screen |
| 7 | Flexibility and efficiency of use | Shortcuts for experts, defaults for newcomers | No keyboard shortcuts in a tool people use all day |
| 8 | Aesthetic and minimalist design | Remove what competes with the essential | A dashboard where six numbers compete for one glance |
| 9 | Help users recognise, diagnose, recover from errors | Plain language, the cause, the fix | "Error 0x8004005" |
| 10 | Help and documentation | Findable, task-based, in context | A help centre that does not mention the screen you are on |

Heuristic 1 is the one modern products break most, and it is also the cheapest to fix: any action
over 100 ms needs immediate acknowledgement, even if the result is not ready.

## The three response-time limits

From Nielsen's *Usability Engineering* (1993), and still the clearest way to pick a feedback
strategy.

| Limit | What the user feels | What to build |
| --- | --- | --- |
| 0.1 s | Instant. The user believes they moved the object themselves | No indicator. Just do it. Optimistic updates belong here |
| 1.0 s | A noticeable pause, but the train of thought survives | No spinner needed. A subtle state change is enough |
| 10 s | The edge of held attention | A progress indicator with an estimate, and the ability to do something else |

Beyond 10 seconds, stop pretending it is synchronous. Let the user leave and notify them.

These limits are about human perception, so they do not move when hardware improves. They pair
directly with the web's responsiveness metric in 07: the 200 ms "good"
threshold for Interaction to Next Paint sits between the first two limits, by design.

## Fitts's law

Published by Paul Fitts in 1954, extended by Fitts and Peterson in 1964. The time to hit a target
grows with the distance to it and shrinks as the target gets bigger.

What it actually tells you to do:

- Make the important control the biggest one. Size is the cheaper lever, because distance is
  constrained by layout.
- Put destructive and primary actions far apart. Adjacency plus similar size is how people delete
  the wrong thing.
- Screen edges and corners are effectively infinite in one direction, which is why the bottom bar on
  a phone and the menu bar on a Mac work well.
- Expand the hit area beyond the visible box. A 16 px icon can carry a 44 px target. WCAG's target
  size rule measures the clickable area, not the drawing.

## Hick's law

Hick (1952) and Hyman (1953): decision time rises with the logarithm of the number of choices. Card,
Moran, and Newell brought both laws into interface design in 1983.

The practical form: cutting a menu from 20 items to 10 helps much less than people expect, because
the relationship is logarithmic, not linear. What helps more is grouping, so that the user makes two
easy decisions instead of one hard one, and defaults, so that most users make no decision at all.

Do not use Hick's law as an argument for hiding things. Recognition beats recall (heuristic 6), so a
long visible list often beats a short list plus a memory task.

## Cognitive load, and the number that gets misquoted

"Seven plus or minus two" comes from George Miller's 1956 paper on short-term memory for unrelated
items. It is not a limit on menu items, navigation links, or form fields, and citing it that way is
a common error. Modern practice relies on three sturdier ideas:

- **Chunking.** Group related things so the user holds one thing instead of five. A card number in
  four groups of four is easier than sixteen digits.
- **Progressive disclosure.** Show the common path first, put the rest one deliberate step away.
  This is different from hiding: the entry point must be visible and named.
- **External memory.** Keep state on screen. Wizards that lose earlier answers force recall; WCAG
  2.2's "redundant entry" rule (3.3.7) now makes the worst version of this a failure.

## Consistency, and when to break it

Two kinds:

- **External consistency** with the platform. Users arrive with expectations about where the back
  button is, what a switch means, and how a date picker behaves. Breaking this costs you every time.
- **Internal consistency** inside your product. This is what a design system buys.

Break consistency only when the new pattern is measurably better and you can change every instance.
A half-migrated pattern is worse than either version, because the user now has two models.

## Recognition of state: the four states every component needs

Most component bugs are missing states rather than wrong pixels. Specify all four for anything that
loads data:

1. **Empty:** never shipped a blank box. Say what goes here and how to add the first one.
2. **Loading:** show the shape of what is coming when you know it, a spinner when you do not.
3. **Error:** what failed, whether it is retryable, and the retry control in the same place.
4. **Partial or stale:** data arrived but is incomplete or old. Say so, with a timestamp.

For AI features, add a fifth: **uncertain**, where the system produced something but is not
confident. See 09.

## The aesthetic-usability effect, stated honestly

People rate attractive interfaces as easier to use, and they forgive small problems in them. That is
a real and replicated finding. Two consequences that are usually skipped:

- It biases your usability tests. Participants under-report problems in polished prototypes, so run
  the important tests on something rough, or watch behaviour rather than trusting ratings.
- It does not make an attractive interface usable. Google's own research on its 2025 design update
  found the largest usability gains came from using colour, shape, and size to mark what matters, not
  from decoration for its own sake: participants spotted key buttons up to four times faster.

## What "modern" adds to this list

The classic laws say nothing about four things that now matter every day:

- **The interface has no fixed size.** Design for a range, not three breakpoints. See
  03.
- **The user has declared preferences.** Colour scheme, motion, contrast, and text size arrive with
  the request. Ignoring them is a defect. See 04.
- **The interface is legally regulated.** Both accessibility and manipulation now carry
  enforcement. See 06, 10.
- **Part of the interface is non-deterministic.** A model's output varies run to run, so the design
  must carry uncertainty, provenance, and correction. See 09.

---

<!-- 11archive-source: 02-design-systems-and-tokens.md -->

# 02. Design systems and tokens

A design system is three things stacked: named decisions (tokens), reusable parts (components), and
the rules for using them (documentation). Most failed design systems failed at the third layer, not
the first.

## Design tokens, and the spec that finally landed

A **design token** is a named design decision stored as data. `color.action.background` holds a
specific green; every button reads the name, not the green. Change the name's value once and every
button changes.

The Design Tokens Community Group, a W3C community group of designers, developers, and tool makers,
published the first stable version of its format on 28 October 2025 (version 2025.10). Before that,
every design tool and every code pipeline invented its own JSON shape, so moving tokens between
Figma and a codebase needed a custom converter.

What the format specifies:

| Part | Detail |
| --- | --- |
| File | JSON, with the extension `.tokens` or `.tokens.json`, media type `application/design-tokens+json` |
| Required | `$value`, plus `$type` either on the token or inherited from its group |
| Optional | `$description` (plain text), `$extensions` (vendor metadata, reverse-domain keys), `$deprecated` |
| Simple types | `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number` |
| Composite types | `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography` |
| Grouping | Any JSON object without `$value` is a group; groups carry a default `$type` for children |
| References | `{group.token}` resolves to another token's whole value; a JSON Pointer such as `#/path/to/$value` reaches inside a composite value |
| Errors | Circular references must be detected and reported |
| Inheritance | `$extends` lets one group inherit another, with local tokens overriding by deep merge |

Colour is expressed as an object with a colour space and components, not only a hex string, which is
what makes wide-gamut and perceptual colour spaces expressible. See
04 for why that matters.

The spec deliberately takes no position on how you theme. It standardises the container, not the
strategy.

**One caution.** The drafts site also carries a later, explicitly-marked preview draft dated
2026-07-30 that says not to implement or cite it as authoritative. Build against the stable 2025.10
version and treat anything newer as provisional.

## The three token layers

The stable structure that most mature systems converge on. Each layer only ever references the one
below it.

| Layer | Also called | Example name | Example value | Who may use it |
| --- | --- | --- | --- | --- |
| 1. Primitive | reference, global | `green.600` | `oklch(0.508 0.118 165.6)` | Nobody outside the system |
| 2. Semantic | system, alias | `color.action.background` | `{green.600}` | Component authors |
| 3. Component | scoped | `button.primary.background` | `{color.action.background}` | That component only |

Why the middle layer exists: it is the only place a theme can intervene. Dark mode, a high-contrast
mode, and a second brand are all just different bindings of layer 2 to layer 1. If components read
primitives directly, every theme becomes a search-and-replace.

Rule of thumb: if a token's name says what it looks like (`grey.200`) it is a primitive; if it says
what it is for (`border.subtle`) it is semantic. Only semantic names belong in component code.

## Naming that survives contact with a second brand

- Name by role, not appearance. `color.danger.text`, not `color.red.dark`.
- Keep one axis per level: category, role, variant, state. For example
  `color.action.background.hover`.
- Never encode the platform or the tool in the name. `color.ios.button` will outlive the reason it
  existed.
- Reserve a state vocabulary and reuse it exactly: `default`, `hover`, `active`, `focus`,
  `disabled`, `selected`. Half the drift in real systems is `pressed` versus `active`.
- Numbers should mean something monotone. `space.4` is fine if 4 is a step on a scale; `space.md` is
  fine if the scale is short. Mixing both in one system is the problem.

## Spacing, size, and radius scales

Pick one base unit and multiply. A 4 px base with a partly-geometric scale is the common choice:
4, 8, 12, 16, 24, 32, 48, 64. The reason to skip 20, 28, and 36 is discipline rather than maths: a
short scale forces consistent rhythm, and a dense scale becomes a free-for-all.

Two modern notes:

- Express spacing in `rem` so it scales with the user's text size. A layout built in pixels ignores a
  user who set their browser font to 20 px.
- Type scales should be fluid rather than stepped. `clamp()` sets a minimum, a preferred value that
  can depend on viewport width, and a maximum, in one declaration. See
  04.

## Components: the ownership question

The industry moved decisively from "install a styled library" to "own the component code." The
vocabulary:

- **Styled library:** ships behaviour and appearance. Fast to start, hard to rebrand.
- **Headless or unstyled primitives:** ship behaviour, keyboard handling, focus management, and
  accessibility semantics with no visual opinion. You style them.
- **Copy-in registry:** the component source is copied into your repository. You own and edit it.
  There is no version to upgrade, and no vendor to wait for.

The reference points, verified on 2026-08-11:

| Project | What it is | Status |
| --- | --- | --- |
| shadcn/ui | Copy-in registry of components built on unstyled primitives plus utility CSS. Describes itself as a code distribution platform, and tells you to use it to build your own library | 121.1k stars on GitHub |
| Radix Primitives | Unstyled accessible primitives; the behaviour layer under many registries | Maintained by WorkOS, which acquired the original team in 2022 |
| Base UI | Unstyled primitives from the MUI team, positioned as the actively developed alternative | v1.0.0 released December 2025 |

The trade-off, stated plainly. Copy-in ownership removes the upgrade treadmill and the rebranding
fight, and it transfers every future accessibility fix to you. Unstyled primitives exist precisely
because keyboard handling, focus trapping, and screen-reader semantics for a combobox are much harder
than they look. Do not write those yourself unless that is your product.

**What changed the calculus in 2025 and 2026:** the browsers started shipping the hard parts.
Dialogs with light dismissal, popovers with correct top-layer stacking, hint popovers for tooltips,
tooltip-and-preview triggers on hover and focus, stylable `<select>`, and carousel controls generated
by the browser are all now platform features. Before you adopt a primitive, check whether the element
exists. See 05.

## Documentation is the load-bearing part

A component nobody can find gets rebuilt. The minimum that works:

- **One page per component** with: what it is for, what it is not for, an interactive example, the
  props or attributes, the keyboard behaviour, and the accessibility notes.
- **Decision records.** Why the switch has no intermediate state, why the modal cannot be dismissed
  by clicking outside during payment. Without these, every decision is relitigated annually.
- **A contribution path.** If the only way to get a component changed is to file a ticket with a
  central team, product teams will fork instead. Every fork is a future inconsistency.
- **A deprecation policy with dates.** The token format has a `$deprecated` field for exactly this.

## Measuring whether the system works

Adoption, not satisfaction. Useful numbers:

| Metric | How to get it | What good looks like |
| --- | --- | --- |
| Token coverage | Share of colour and spacing declarations in product code that reference a token | Rising each quarter; 90%+ in mature systems |
| Component coverage | Share of interactive elements rendered by system components | Rising; watch for a plateau caused by one missing component |
| Hard-coded colour count | Lint rule counting literal colours outside the token files | Trending to zero |
| Fork count | Copies of a system component edited in product code | Each one is a feature request in disguise |
| Time to first screen | How long a new engineer takes to build a compliant screen | Falling |

Do not measure the system by how many components it has. A large catalogue that nobody uses is a
maintenance liability, and building components nobody asked for is the most common way design system
teams waste a year.

---

<!-- 11archive-source: 03-layout-and-responsive.md -->

# 03. Layout and responsive behaviour

Responsive design started in 2010 as "change the layout at certain window widths." That model is now
the slow path. The modern model is: describe the constraints, let the browser solve the layout, and
let each component respond to the space it was actually given.

## Baseline, and how to read it

**Baseline** is the shared label the browser makers use to say how safe a web feature is.

| Label | Meaning | How to treat it |
| --- | --- | --- |
| Limited availability | Not in every major engine yet | Behind a feature check, or not at all |
| Newly available | Just became supported in all major engines | Usable with a fallback for older installed versions |
| Widely available | Supported in all major engines for about 30 months | Use it without a fallback |

Interop is the related programme: Apple, Google, Igalia, Microsoft, and Mozilla agree each year on a
set of features to make behave identically, measured by a public test suite. The 20 focus areas for
2026 tell you where the rough edges still are:

anchor positioning, container style queries, dialogs and popovers, scroll-driven animations, view
transitions, the `attr()` function, the `contrast-color()` function, custom highlights, fetch uploads
and ranges, IndexedDB, JSPI for WebAssembly, media pseudo-classes, the Navigation API, scoped custom
element registries, scroll snap, the `shape()` function, web compatibility, WebRTC, WebTransport, and
the `zoom` property.

Read that list as a warning label: anything on it works, but may still differ between browsers in
2026. Test those features in more than one engine.

## Container queries replace most breakpoints

A **media query** asks about the window. A **container query** asks about the element's own parent.
Container queries are Baseline widely available, supported in every major browser released since
2023.

Why this changes the model: a card in a sidebar and the same card in a full-width grid have the same
window width and completely different available space. With media queries you either write
sidebar-specific rules or accept a bad layout. With container queries the card carries its own rules
and works anywhere.

```css
.card-area { container-type: inline-size; }

@container (min-width: 30rem) {
  .card { grid-template-columns: 8rem 1fr; }
}
```

Practical rules:

- Query in `rem` or `em`, not pixels, so the layout responds to text size too.
- Keep the container declaration on a wrapper, not on the component itself. An element cannot query
  itself.
- Use `cqi` units (a percentage of the container's inline size) for type or spacing that should scale
  with the component.
- Media queries still own page-level decisions: how many columns the whole page has, whether the
  navigation is a bar or a drawer, and print.

**Style queries** are the sibling feature: styling descendants based on a custom property value on an
ancestor, which is how you build variants such as a "compact" or "inverted" region without extra
classes. Style queries are still an Interop 2026 focus area, so verify across engines.

**Scroll-state queries** let you style based on whether an element is scrollable, stuck to an edge, or
snapped. That solves the classic sticky-header shadow problem without a scroll listener. Shipped in
Chrome 133; check other engines before relying on it.

## Intrinsic layout: describe intent, not sizes

The set of techniques that let content determine layout:

| Tool | Use it for | Note |
| --- | --- | --- |
| `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))` | A card grid that reflows with no breakpoints | The single highest-value line of modern CSS layout |
| `flex-wrap` with `min-width` on items | Toolbars and tag lists that wrap gracefully | Wrapping is the fallback, not a failure |
| `min()`, `max()`, `clamp()` | Fluid sizes with hard limits | `width: min(100%, 65ch)` is a whole readable-column rule |
| `subgrid` | Aligning nested content across sibling cards | Removes most fixed-height hacks |
| `aspect-ratio` | Reserving space for media before it loads | Prevents layout shift, which is a Core Web Vital |
| Logical properties | Layout that flips for right-to-left languages | See below |
| `stretch` keyword | Filling the containing block while keeping margins | Newer; check support |

Two habits worth deleting: fixed heights on anything containing text, and `100vh` for full-screen
sections on mobile. Both break the moment text grows or a browser toolbar appears.

## Viewport units on mobile

The classic problem: on a phone, `100vh` refers to the viewport as if the browser's toolbars were
hidden, so a full-height section is taller than the visible area and the page scrolls unexpectedly.

The fix is the dynamic viewport units:

| Unit | Meaning |
| --- | --- |
| `svh` | Small viewport height, toolbars visible |
| `lvh` | Large viewport height, toolbars hidden |
| `dvh` | Dynamic, changes as the toolbars appear and disappear |

Use `dvh` for full-height layouts and `svh` when you need a value that never causes overflow. Note
that `dvh` changing during a scroll can cause layout shifts, so avoid it on elements whose size
affects the flow of the whole page.

## Safe areas and device shapes

Phones have rounded corners, notches, camera cutouts, and a home indicator. The
`env(safe-area-inset-*)` values expose those insets:

```css
.bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

Two requirements: add `viewport-fit=cover` to the viewport meta tag or the insets stay zero, and use
`max()` so you never end up with less padding than your design calls for.

## Thumb reach and the bottom of the screen

Phones are held one-handed most of the time, and the reachable arc for a thumb covers the lower
middle of the screen. That is why primary navigation moved to the bottom on mobile, and why the
top-right corner is the worst place for a frequent action on a large phone. It also interacts with
Fitts's law: the bottom edge is a boundary, so a bar anchored to it is easy to hit.

Two caveats worth stating: reach data varies by hand size and by whether the phone is held in the
dominant hand, and bottom bars compete with the operating system's own gesture areas. Always test
with the safe-area insets applied.

## Right-to-left and internationalisation

Use **logical properties**, which name box edges by the flow of text rather than the physical screen.
`margin-inline-start` is the left margin in English and the right margin in Arabic, with no extra
stylesheet.

| Physical | Logical |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `padding-top` | `padding-block-start` |
| `border-right` | `border-inline-end` |
| `text-align: left` | `text-align: start` |
| `top` / `left` in positioning | `inset-block-start` / `inset-inline-start` |

Grid and flexbox already work this way, which is why they handle right-to-left better than float
layouts ever did.

Other things that break in translation:

- **Text expands.** German and Finnish commonly run 30% longer than English. Never size a button to
  its English label.
- **Line breaking differs.** Chinese, Japanese, Thai, and Khmer do not use spaces the same way. Do
  not build word-count logic.
- **Names, addresses, and phone numbers have no universal shape.** One "full name" field and a
  free-text address block cause fewer failures than a first/middle/last plus state/ZIP form.
- **Dates and numbers.** Use the platform's formatting, and never abbreviate a date to digits alone in
  a multi-locale product.
- **Icons carry culture.** Arrows flip with direction; mailboxes, thumbs, and hand gestures do not
  travel.

## The layout checklist

1. No fixed heights on text containers.
2. No `100vh`; use `dvh` or `svh`.
3. Card grids use `auto-fit` with `minmax`, not breakpoints.
4. Component-level responsiveness uses container queries, in `rem`.
5. Reading columns are capped near 65 to 75 characters using `ch` or `max-width`.
6. Media has `aspect-ratio` or explicit dimensions so nothing shifts on load.
7. Spacing in `rem`, so it scales with user text size.
8. Logical properties throughout.
9. Safe-area insets applied to anything anchored to an edge.
10. The page never scrolls sideways at 400% zoom in a 1280 px window. Wide tables scroll inside their
    own container instead.

---

<!-- 11archive-source: 04-color-typography-and-theming.md -->

# 04. Colour, typography, and theming

Colour and type are where the largest measurable accessibility failures live, and also where the
newest platform features remove the most work. Low-contrast text is the single most common detected
failure on the web: 83.9% of the top million home pages in February 2026.

## Contrast: the exact numbers

The requirements come from WCAG, the web accessibility standard.

| Rule | Applies to | Ratio |
| --- | --- | --- |
| 1.4.3 Contrast (Minimum), Level AA | Normal text | 4.5:1 |
| 1.4.3 Contrast (Minimum), Level AA | Large text: 18 point, or 14 point bold, or the CJK equivalent | 3:1 |
| 1.4.6 Contrast (Enhanced), Level AAA | Normal text | 7:1 |
| 1.4.6 Contrast (Enhanced), Level AAA | Large text | 4.5:1 |
| 1.4.11 Non-text Contrast, Level AA | Component boundaries, icons, chart elements that carry meaning | 3:1 |

"18 point" is roughly 24 px and "14 point bold" is roughly 18.5 px in browser terms.

Exempt: text inside a logo or brand name, purely decorative text, invisible text, and text in an image
that is mostly other visual content. Text in a disabled control is also exempt, which is why disabled
states are the most abused loophole in interface design. If a control looks disabled but is actually
active, the exemption does not apply.

Where teams reliably fail:

- Secondary and muted text. Grey on white is the classic. Check it as carefully as body text.
- Placeholder text. It is text; it needs 4.5:1. Which is a second reason not to use it as a label.
- Input borders and focus rings. These are components, so 3:1 under rule 1.4.11.
- Text over images and gradients. Contrast must hold at the worst point, not the average.
- Charts. A legend that only differs by colour fails, and colour-only meaning fails regardless of
  ratio.
- Brand colours in buttons. A mid-tone brand colour usually fails with white text and passes with
  near-black. Test both before the brand guide is frozen.

**About APCA.** APCA is a newer contrast model that accounts for how human vision actually responds
to lightness, and it handles dark backgrounds better than the current ratio maths. It is being
explored for the next major version of the standard, but it is not part of the normative draft and has
no legal standing. Use it as a design aid if you like; conform to the 4.5:1 and 3:1 ratios.

## Colour spaces: why `oklch` is now the default choice

Hex and `rgb()` describe a colour by how much of each screen primary to emit. That has two problems:
equal numeric steps do not look like equal steps, and mixing or lightening produces muddy results.

`oklch()` describes a colour as lightness, chroma (colourfulness), and hue. Practical consequences:

- **Predictable scales.** Holding chroma and hue while stepping lightness produces a ramp that looks
  even. Building a 10-step palette becomes arithmetic instead of eyeballing.
- **Honest lightness.** Two colours with the same L in `oklch` look about equally bright, which makes
  contrast decisions far more predictable across hues. Yellow and blue at the same hex lightness do
  not match; at the same `oklch` lightness they roughly do.
- **Wide gamut.** It can express colours outside the old sRGB range, which modern displays can show.
- **Better mixing.** `color-mix(in oklab, ...)` interpolates without the grey dip you get in sRGB.

A useful pattern for tinted surfaces, which keeps one source of truth for a theme colour:

```css
--accent-surface: color-mix(in oklab, var(--primary) 18%, var(--background));
```

Keep hex values only where a system demands them, for example an email template or an app manifest.

## Theming without duplicating your stylesheet

Three mechanisms, in increasing order of how much they do for you.

**1. `prefers-color-scheme`.** The user's operating system preference arrives as a media query. Only
about 13% of pages in the July 2025 crawl responded to it, which is a large and cheap gap.

```css
:root { color-scheme: light dark; }
```

Declaring `color-scheme` is the step people skip. It makes the browser's own widgets, scrollbars, and
form controls match, and it costs one line.

**2. `light-dark()`.** One declaration holds both values, and the browser picks based on the active
colour scheme. Reported as newly stable in all engines as of May 2026, and extended in Chrome 150 to
accept images as well as colours.

```css
color: light-dark(oklch(0.145 0 0), oklch(0.985 0 0));
```

**3. `contrast-color()`.** Given a background colour, it returns black or white, whichever contrasts
more. This removes the most common manual calculation in theming: what colour the label on a
brand-coloured button should be. Safari shipped it first; it is an Interop 2026 focus area, so include
a fallback.

For an explicit toggle rather than a system preference, put a class or attribute on the root element
and rebind the semantic token layer. That is the whole reason the semantic layer exists. See
02.

**Two other preferences with real user impact:**

- `prefers-contrast: more` for users who want stronger separation.
- `forced-colors: active` for Windows High Contrast Mode, where the operating system replaces your
  palette entirely. About 16% to 19% of pages responded to it in the 2025 crawl. The main task is
  making sure things you drew with backgrounds and borders survive; use `forced-color-adjust` and
  `system-color` keywords rather than fighting it.

## Colour vision deficiency

Around 8% of men of northern European descent have some form of red-green colour vision deficiency.
The design rule is simple and absolute: **colour must never be the only carrier of meaning.** Add a
shape, an icon, a label, a pattern, or a position.

The specific things that break:

- Red and green as pass and fail with no icon.
- Multi-series charts distinguished only by hue. Use direct labels on the series, or vary shape and
  dash pattern.
- Required-field indicators that are only red.
- Status dots without text.

## Typography: the numbers that matter

| Decision | Value | Why |
| --- | --- | --- |
| Body text size | 16 px minimum on mobile | Below 16 px, mobile Safari zooms the page when an input is focused. Set it on the control, not just the label |
| Line length | 45 to 75 characters, about 66 as the target | Long-standing typographic guidance, supported by eye-movement studies from Tinker and Paterson onward. Long lines make the eye lose the start of the next line |
| Line height | About 1.4 to 1.6 for body text, tighter for headings | Longer lines need more leading |
| Paragraph width in CSS | `max-width: 65ch` | `ch` is the width of the "0" glyph, so this tracks the font |
| Sizing unit | `rem` for type and spacing | Respects the user's browser font size. 67% of sites in the 2025 crawl still set font sizes in pixels |
| Type scale | Fluid via `clamp()` | One declaration replaces breakpoint-stepped sizes |

A fluid heading, with a floor, a preferred value, and a ceiling:

```css
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); }
```

Note the middle term includes a `rem` component. A pure `vw` preferred value stops the text from
scaling when the user zooms, which is an accessibility failure.

Two newer helpers:

- `text-wrap: balance` for headings, which evens out line lengths so you do not get one orphan word.
  `text-wrap: pretty` for body text, which improves the last lines. Adoption is still low: about 2.7%
  and 1.7% of sites respectively in the 2025 crawl.
- `text-box: trim-both cap alphabetic` removes the extra vertical space fonts carry above and below
  the letters, so a button label sits optically centred. Available in Chrome 150.

**Variable fonts** carry a range of weights and widths in one file, so you ship one request instead of
six. Keep the axes you actually use, subset the character range, and self-host with
`font-display: swap` and a preload for the one font that renders your first screen. Fonts were about
139 KB of the median desktop page in July 2025.

## Icons

- Never an icon alone for an important action, unless the icon is a genuine convention (a magnifier
  for search, an X for close). Everything else needs a visible label.
- Icons that carry meaning need an accessible name; decorative icons should be hidden from assistive
  technology.
- Icon-only buttons still need a 24 px target minimum, and 44 px is better. The drawing can stay small
  while the target is large.
- Keep line weight and corner treatment consistent, and align to the same optical size. Mixed icon
  sets are the fastest way to make a product look unfinished.

## Density and translucency

Two live debates worth stating with evidence.

**Expressive versus quiet.** Google's 2025 design update ran 46 studies with more than 18,000
participants over three years, using eye tracking, surveys, and usability tests. Reported results:
participants spotted key buttons up to four times faster in the expressive designs across 10 apps,
87% of 18-to-24-year-olds preferred that style, and brand perception rose across three measures.
Treat the direction as well supported and the exact percentages as vendor-reported. The mechanism
matters more than the styling: colour, shape, size, motion, and containment used deliberately to mark
what matters.

**Translucency.** Apple introduced a translucent, refracting material across its platforms in June
2025. The recurring criticism was legibility: blurred layers over moving content reduce effective
contrast, and the effect depends on what is behind it. The lesson generalises to any glass or blur
effect you build: contrast must be verified against the worst-case backdrop, not a marketing
screenshot, and the effect must respond to reduced-transparency and increased-contrast settings.

## The colour and type checklist

1. Body text 4.5:1, large text 3:1, control borders and meaningful icons 3:1.
2. Placeholder, muted, and secondary text checked explicitly.
3. Nothing depends on colour alone.
4. `color-scheme` declared; dark mode implemented through the semantic token layer.
5. Reduced-motion, increased-contrast, and forced-colours preferences handled.
6. Inputs at 16 px or larger on mobile.
7. Reading columns capped near 65 characters.
8. Type and spacing in `rem`; fluid sizes include a `rem` term inside `clamp()`.
9. Text still readable and unclipped at 200% zoom, reflowing at 400%.
10. Any blur or glass effect verified against its worst backdrop.

---

<!-- 11archive-source: 05-interaction-and-motion.md -->

# 05. Interaction and motion

This section covers the parts of an interface a person touches: targets, focus, overlays, and
movement. It is also where the platform changed most between 2023 and 2026, and where the most custom
code is now unnecessary.

## Target size: three numbers and which one binds

| Source | Minimum | Nature |
| --- | --- | --- |
| WCAG 2.2 rule 2.5.8, Level AA | 24 by 24 CSS pixels | Standard, legally referenced |
| WCAG 2.2 rule 2.5.5, Level AAA | 44 by 44 CSS pixels | Standard, aspirational level |
| Apple's guidelines | 44 by 44 points | Platform guidance |
| Android's Material guidance | 48 by 48 density-independent pixels | Platform guidance |

The 24 px rule has a spacing exception: a smaller target passes if it sits inside a 24 px circle that
does not overlap another target's circle. That is what makes a dense toolbar of small icons legal, as
long as there is breathing room. Other exceptions cover targets in a sentence of text, targets whose
size is determined by the browser, and cases where the same action is available at full size elsewhere.

Practical guidance: design to 44 px for anything a person taps often, use 24 px as the hard floor, and
remember the measurement is of the clickable area. A 16 px icon inside a 44 px button passes.

The most common real failures: close buttons on toasts and modals, table row action icons, pagination
numbers, checkbox and radio hit areas that exclude the label, and social icons in a footer.

## Dragging must always have a non-drag alternative

WCAG 2.2 rule 2.5.7 (Level AA) requires that anything achievable by dragging is also achievable with a
single pointer action, unless dragging is essential to the task.

What this covers, and the usual fix:

| Pattern | Non-drag alternative |
| --- | --- |
| Slider | Arrow keys plus a number input |
| Reorderable list | "Move up" and "move down" buttons, or a position field |
| Kanban board | A "move to" menu on each card |
| Map pan | Directional buttons, or a search field |
| Drag-and-drop upload | A file picker button (which you almost certainly already have) |
| Range picker on a chart | Two date inputs |

This is one of the cheapest new rules to satisfy and one of the most often missed, because the drag
version is the one that gets demoed.

## Focus: the state everyone deletes

Keyboard users navigate by focus. Removing the outline without replacing it makes a product unusable
for them. About 67% of sites in the July 2025 crawl removed the browser's default outline, and only
about 25% used `:focus-visible`.

```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

`:focus-visible` is the right selector because it applies when the browser judges an indicator useful,
which means keyboard users get a ring and mouse users do not get one on click. Do not use
`:focus { outline: none }` and then style only `:focus-visible`, because that removes the fallback in
older engines; style `:focus-visible` and leave `:focus` alone.

WCAG 2.2 added two rules about focus beyond visibility:

- **2.4.11 Focus Not Obscured (Minimum), Level AA:** when a component receives keyboard focus, it must
  not be entirely hidden by content the author added. Sticky headers, cookie bars, and chat widgets are
  the usual culprits, because they cover the element that just received focus. Use `scroll-margin` on
  focusable elements to keep them clear of a sticky header.
- **2.4.13 Focus Appearance, Level AAA:** the indicator area must be at least 2 CSS pixels thick around
  the component, with 3:1 contrast against adjacent colours.

Also required by older rules and frequently broken:

- **Focus order** follows the visual order. Positive `tabindex` values break this; only 3% to 4% of
  sites use them, and none of those should.
- **Focus is trapped inside a modal** while it is open, and returns to the trigger when it closes. If
  you use the native `<dialog>` element with `showModal()`, you get most of this for free.
- **Skip link** to the main content. Only 24% of pages in the 2025 crawl had a detectable one.

## Overlays: stop building these

Every overlay pattern below now exists as a platform feature with correct keyboard and screen-reader
behaviour. Prefer them.

| Need | Platform feature | Notes |
| --- | --- | --- |
| Modal dialog | `<dialog>` with `showModal()` | Focus trapping, top-layer stacking, `::backdrop`, Escape to close |
| Dismiss a dialog by clicking outside | `closedby` attribute on `<dialog>` | Chrome 134 and later |
| Menu, dropdown, disclosure panel | `popover` attribute | Correct stacking and light dismissal, no z-index war |
| Tooltip or hover preview | `popover=hint` | Does not close other open popovers, which is the behaviour a tooltip needs |
| Show UI on hover or keyboard focus | `interestfor` attribute, with `interest-delay` | Keyboard-accessible by design, unlike a hover-only tooltip |
| Trigger a dialog or popover from a button without JavaScript | `command` and `commandfor` attributes | Chrome 135 and later |
| Styled select menu | `appearance: base-select` | Lets you style the options list, which was previously impossible |
| Carousel controls and dots | `::scroll-button()` and `::scroll-marker()` | The browser generates them; they are keyboard-accessible and stylable |
| Scroll-spy navigation | `scroll-target-group` with `:target-current` | Replaces a scroll listener |

Two caveats. Dialogs and popovers are an Interop 2026 focus area, so behaviour still varies between
engines in details; test in more than one. And the newest items on that list (`interestfor`,
`base-select`, scroll markers) are not yet everywhere, so check current support before shipping without
a fallback.

The general principle: an element you build from a `<div>` starts with no role, no keyboard handling,
and no focus management. The platform element starts with all three.

## Motion: purpose, duration, and the off switch

Motion earns its place when it explains something: where a thing came from, that a list reordered, that
two screens are related. Motion that only decorates costs performance and excludes people.

**Durations that read as intentional:**

| Movement | Duration |
| --- | --- |
| Small state change (hover, toggle, checkbox) | 100 to 150 ms |
| Element entering or leaving (dropdown, tooltip) | 150 to 250 ms |
| Larger transition (panel, sheet, page) | 250 to 400 ms |
| Anything above | Almost always too slow; the user is waiting for the interface |

**Easing:** things entering the screen should decelerate (`ease-out`), things leaving should
accelerate (`ease-in`), and things moving between two on-screen positions should ease both ways.
Linear motion looks mechanical, and should be reserved for progress indicators and spinners where
constant speed is the point.

**Respect reduced motion.** Some people get nausea, dizziness, headaches, or migraine from large
motion, particularly parallax, full-viewport video, and sweeping page transitions. The operating system
preference arrives as a media query. Only about half of pages in the July 2025 crawl responded to it.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

That blanket rule is a floor, not a design. Better is to replace motion with a cross-fade, which keeps
the relationship visible without the movement. Note that WCAG rule 2.3.3 (Level AAA) requires
interaction-triggered motion to be disableable, and rule 2.2.2 (Level A) requires a pause control for
anything moving or auto-updating for more than five seconds. A carousel that advances on its own needs
a pause button at Level A.

## Modern animation features

| Feature | What it does | Status as of 2026-08 |
| --- | --- | --- |
| Same-document view transitions | Animate between two states of one page, including list reorders, without writing keyframes | Baseline newly available; Firefox 144 shipped in October 2025 |
| Cross-document view transitions | The same, between two page navigations in a multi-page site | Interop 2026 focus area |
| Element-scoped view transitions | Transition one component instead of the whole page | Chrome 147 and later |
| Scroll-driven animations | Tie animation progress to scroll position, off the main thread | Interop 2026 focus area; broadly supported |
| Scroll-triggered animations | Start a normal timed animation when a scroll boundary is crossed | Chrome 146 and later |
| `sibling-index()` and `sibling-count()` | Stagger animations without writing a delay per child | Newer; check support |
| `moveBefore()` | Move an element in the document without resetting it, so video keeps playing and iframes stay loaded | Chrome 133 and later |
| `@starting-style` | Define the state an element animates from when it first appears, which makes popovers and dialogs animate in | Widely supported |

View transitions deserve one warning: they animate everything by default, which produces a
distracting result on a content-heavy page. Name the elements you actually want to animate with
`view-transition-name`, and wrap the whole thing in a reduced-motion check.

## Gestures, hover, and pointer types

- **Never make hover the only way to reach something.** Touch devices have no hover, and keyboard
  users have no pointer. Use `interestfor` or a click-to-open pattern.
- **Do not rely on multi-finger or path-based gestures alone.** WCAG rule 2.5.1 requires a
  single-pointer alternative to anything needing a path or multiple contacts.
- **Query the input type rather than the screen size.** `@media (hover: hover)` and
  `(pointer: coarse)` tell you what the device can do. Screen width does not: a touchscreen laptop is
  wide and coarse.
- **Give feedback within 100 ms of touch.** On touch there is no cursor to confirm the press landed.

## The interaction checklist

1. Targets at least 24 px, 44 px for frequent actions, spacing respected.
2. Every drag interaction has a single-tap alternative.
3. `:focus-visible` styled, at least 2 px thick, 3:1 contrast.
4. Focus never hidden behind a sticky element; `scroll-margin` applied.
5. Modals use `<dialog>`; menus and tooltips use `popover`.
6. Focus returns to the trigger when an overlay closes.
7. Nothing important is hover-only.
8. Durations under 400 ms; entering eases out, leaving eases in.
9. Reduced motion honoured, with a cross-fade rather than nothing where possible.
10. Anything auto-moving for over five seconds has a pause control.

---

<!-- 11archive-source: 06-accessibility-and-law.md -->

# 06. Accessibility, and the law behind it

Accessibility stopped being a values argument and became a compliance one. Since 28 June 2025 in the
EU, and on a schedule in the United States, an inaccessible interface is a legal exposure. This
section covers what the standard actually says, what the law points at, and what real sites get wrong.

## WCAG, in one page

**WCAG** stands for Web Content Accessibility Guidelines, published by the World Wide Web Consortium
(W3C). It is the standard nearly every law points at. The current version is 2.2, whose latest
revision is dated 12 December 2024.

Structure:

- **Four principles.** Content must be **perceivable**, **operable**, **understandable**, and
  **robust**. That is the whole standard in four words.
- **Guidelines** under each principle, and **success criteria** under those. A success criterion is a
  testable statement.
- **Three levels.** A is the floor, AA is what laws reference, AAA is aspirational and not expected
  across a whole product.

**Target AA.** Every regulation covered below points at AA, and AAA contains criteria that are
impossible for some content types.

One removal worth knowing: rule 4.1.1 Parsing was dropped in 2.2, because browsers now recover from
malformed markup consistently. If your organisation still reports against WCAG 2.0 or 2.1, you may
still be asked for it.

## The nine rules WCAG 2.2 added

These are the ones a product built to WCAG 2.1 will fail.

| Rule | Name | Level | What it requires, plainly |
| --- | --- | --- | --- |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | When something receives keyboard focus, author content must not hide it entirely. Sticky headers and cookie bars are the usual cause |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | No part of the focused component is hidden |
| 2.4.13 | Focus Appearance | AAA | The focus indicator is at least 2 CSS pixels thick around the component and has 3:1 contrast |
| 2.5.7 | Dragging Movements | AA | Anything done by dragging can also be done with a single pointer action |
| 2.5.8 | Target Size (Minimum) | AA | Targets are at least 24 by 24 CSS pixels, or spaced so a 24 px circle around each does not overlap another |
| 3.2.6 | Consistent Help | A | If you offer help (contact details, a chat widget, a help link), it appears in the same relative place on every page that has it |
| 3.3.7 | Redundant Entry | A | Do not ask for the same information twice in one process. Auto-populate it or let the user pick it |
| 3.3.8 | Accessible Authentication (Minimum) | AA | No step of signing in may require a memory or puzzle test, unless an alternative exists. Copy and paste into password fields must work |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | The same, without the object-recognition exception |

Two of these have unusual reach. 3.3.8 effectively bans blocking paste in password fields and bans
"solve this puzzle to log in" as the only route, which is why passkeys and password managers matter for
compliance and not only for security (see 08). And 3.2.6 is a rule
about information architecture, which is unusual for WCAG: it constrains where you may put your help
link.

## WCAG 3.0: real, but not yet

WCAG 3.0 is still a Working Draft, most recently updated in March 2026. Reported plan: a Candidate
Recommendation around late 2027 and a final Recommendation no earlier than 2028.

What is changing, so you are not surprised:

- **Outcomes instead of pass/fail criteria**, reported at roughly 174 outcomes in the March 2026 draft.
- **A scored, tiered conformance model.** Bronze is broadly the current AA level, Silver is genuinely
  good, Gold is thorough including cognitive and low-vision needs.
- **Wider scope**, covering apps and other digital products rather than web pages alone.
- **New contrast approaches under exploration**, including APCA, which is not normative today.

Practical advice: build to WCAG 2.2 AA. Nothing in the 3.0 draft is enforceable, and the drafts have
changed direction more than once.

## What the laws actually require

| Regulation | Who it binds | Standard referenced | Key dates |
| --- | --- | --- | --- |
| European Accessibility Act (EAA) | Businesses selling covered products and services to EU consumers, regardless of where the business is based | EN 301 549, which for web points at WCAG 2.1 AA | Applied from 28 June 2025 for new products and newly published content |
| EN 301 549 | The harmonised European standard used to demonstrate compliance | Contains WCAG 2.1 AA in its web chapter | Current |
| ADA Title II (United States) | State and local government bodies, including public universities | WCAG 2.1 AA | Final rule 24 April 2024. Compliance dates extended by one year in April 2026: 26 April 2027 for entities serving 50,000 or more people, 26 April 2028 for smaller entities and special districts |
| ADA Title III (United States) | Places of public accommodation, applied to websites through case law rather than a technical rule | Courts commonly reference WCAG 2.1 AA | Ongoing litigation, no fixed deadline |
| Section 508 (United States) | Federal agencies and their suppliers | WCAG 2.0 AA through the Section 508 refresh | In force |

Two notes on the EAA. First, it reaches non-EU companies: if you sell to EU consumers you are in
scope. Second, enforcement began immediately. Within days of the June 2025 date, French disability
organisations issued formal legal notices to several large retailers.

On US litigation, the counts published by different trackers disagree substantially for 2025: one
tracker reports over 5,000 digital accessibility suits, another 3,117 federal website cases (up 27%),
another 8,667 across all courts. The disagreement is methodological, since some count federal filings
only and others include state courts and demand letters. The direction is consistent, the level is not.
Treat any single figure with suspicion, including these.

## What real sites actually fail

Two independent large-scale measurements, both automated. Automated tools detect roughly a third of
accessibility problems, so these are floors, not ceilings.

**WebAIM Million, February 2026.** One million home pages from the Tranco ranking.

| Failure | Share of pages | 2025 | Direction |
| --- | --- | --- | --- |
| Low contrast text | 83.9% | 79.1% | Worse |
| Missing alternative text on images | 53.1% | 55.5% | Better |
| Missing form input labels | 51.0% | 48.2% | Worse |
| Empty links | 46.3% | n/a | n/a |
| Empty buttons | 30.6% | n/a | n/a |
| Missing document language | 13.5% | n/a | n/a |
| **Any detected WCAG 2 failure** | **95.9%** | **94.8%** | **Worse** |
| Average detected failures per page | 56.1 | 51.0 | Worse (up 10.1%) |

**The ARIA finding, which deserves its own paragraph.** ARIA (Accessible Rich Internet Applications) is
a set of attributes that tell assistive technology what a custom control is and what state it is in.
Pages using ARIA averaged 59.1 detected failures; pages without it averaged 42. ARIA attribute use rose
27% in one year, to over 133 attributes per page on average, more than six times the 2019 level.

The correct reading is not "ARIA is bad." It is that ARIA describes without implementing: adding
`role="button"` to a `<div>` announces a button and gives you none of a button's keyboard handling,
focus behaviour, or default styling. The first rule of ARIA, from the specification itself, is that no
ARIA is better than bad ARIA, and that you should not use ARIA if a native HTML element will do.

**HTTP Archive Web Almanac 2025**, July 2025 crawl, 16.2 million sites. Different method, same story.

| Measure | Figure |
| --- | --- |
| Sites passing colour contrast checks | 30% (31% on mobile) |
| Sites removing the default focus outline | About 67% |
| Sites using `:focus-visible` | About 25% |
| Inputs whose only label is placeholder text | 53% desktop, 55% mobile |
| Inputs with no accessible name at all | 24% to 25% |
| Mobile inputs labelled with a real `<label>` | 35% |
| Pages responding to `prefers-reduced-motion` | About 50% |
| Pages responding to `forced-colors` | 16% to 19% |
| Pages responding to `prefers-color-scheme` | About 13% |
| Pages that disable pinch zoom | 19% mobile, 21% desktop |
| Sites setting font sizes in pixels | 67% |
| Pages with a detectable skip link | 24% |
| Pages with a valid `lang` attribute | About 86% |
| Sites using a third-party accessibility overlay | About 2%, and 0.2% of the top 1,000 |
| Median Lighthouse accessibility score | 85% |

The pinch-zoom figure is worth pausing on: blocking zoom with `maximum-scale=1` is a direct failure of
WCAG rule 1.4.4 Resize Text, and it is usually done to work around a mobile form layout problem that
16 px inputs would solve.

## How to test, in the order that finds the most

1. **Automated scan in continuous integration.** Free, fast, catches contrast, labels, alt text, and
   landmarks. Catches roughly a third of issues. Run it on every pull request, not quarterly.
2. **Keyboard-only pass.** Ten minutes per flow. Finds focus, order, trap, and drag failures that no
   scanner sees.
3. **Screen reader pass.** One combination is enough to start: VoiceOver with Safari on Mac or iOS, or
   NVDA with Firefox or Chrome on Windows. You are checking that names, roles, and state changes are
   announced.
4. **Zoom and reflow.** 200% for clipping, 400% at 1280 px for reflow to one column.
5. **Preferences.** Reduced motion, dark mode, forced colours, larger system text.
6. **Testing with disabled users.** The only method that finds problems the others cannot, especially
   for cognitive load, comprehension, and task strategy. Budget for it on anything important.

## The three things that make accessibility cheap

- **Use native elements.** `<button>`, `<a href>`, `<input>` with a `<label>`, `<dialog>`, `<select>`,
  `<details>`. Each arrives with keyboard behaviour, focus behaviour, and a role.
- **Put it in the design system once.** A compliant button, field, and modal in the system means product
  teams cannot get those wrong. This is the single strongest argument for a design system.
- **Test on every commit.** Retrofitting accessibility costs several times what building it in costs,
  and the crawl data above is what retrofitting-later looks like at scale.

---

<!-- 11archive-source: 07-performance-as-ux.md -->

# 07. Performance felt as experience

Speed is not an engineering concern that happens to affect users. It is the first thing a user
experiences, before any layout or copy. This section covers the metrics that are measured on real
visits, what real sites score, and the design techniques that change perceived speed without changing
the underlying time.

## Core Web Vitals: the three numbers

Core Web Vitals are Google's three user-centred performance metrics, measured on real visits rather than
in a lab. All three are judged at the **75th percentile of page views**, which means the metric answers
"is it good for three visitors in four", not "is it good on my machine".

| Metric | Measures | Good | Needs improvement | Poor |
| --- | --- | --- | --- | --- |
| Largest Contentful Paint (LCP) | When the biggest visible element finished rendering, so roughly "when the page looks loaded" | 2.5 s or less | up to 4.0 s | over 4.0 s |
| Interaction to Next Paint (INP) | How long the page takes to visibly respond to a click, tap, or key press | 200 ms or less | up to 500 ms | over 500 ms |
| Cumulative Layout Shift (CLS) | How much visible content jumps around unexpectedly | 0.1 or less | up to 0.25 | over 0.25 |

**The change that caught teams out.** In March 2024, INP replaced First Input Delay (FID). FID measured
only the delay before the browser started handling the *first* interaction. A page could score well
while every menu, filter, and dropdown after that first click felt sluggish. INP looks at all
interactions across the visit and reports close to the worst one, discarding one outlier per 50
interactions on heavily used pages. Only clicks, taps, and key presses count. Scrolling, hovering, and
zooming do not.

**The three phases of an interaction**, which is how you debug an INP problem:

1. **Input delay:** time before your event handler starts running. Cause: the main thread is busy with
   something else, usually a script.
2. **Processing duration:** time your handlers take to run. Cause: your own code.
3. **Presentation delay:** time from your handlers finishing to the browser painting the next frame.
   Cause: expensive layout, large DOM, or heavy style recalculation.

Most teams assume phase 2 and find the problem in phase 1 or 3. Measure before optimising.

## What real sites score

From the HTTP Archive Web Almanac 2025, July 2025 crawl, 16.2 million sites.

| Measure | Desktop | Mobile |
| --- | --- | --- |
| All three Core Web Vitals good | 56% (from 55% in 2024) | 48% (from 44%) |
| LCP good | 74% | 62% |
| INP good | 97% | 77% (from 74%) |
| CLS good | 72% | 81% |

Two readings worth taking from that table. First, responsiveness on desktop is essentially a solved
problem and on mobile it is not, which is a statement about device capability rather than code quality:
the same JavaScript costs several times more on a mid-range phone. Second, roughly half the mobile web
still fails, so passing is a genuine competitive difference rather than table stakes.

**Where LCP time actually goes:** images are the largest element on 85.3% of desktop pages and 76% of
mobile pages. JPEG is still the most common format at 57%. About 16% to 18% of pages host their largest
image on a different domain, adding a connection setup before the download starts. And only 17% of
mobile pages mark that image with `fetchpriority="high"`, which is a one-attribute fix.

## Page weight

Also from the July 2025 crawl.

| Measure | Desktop | Mobile |
| --- | --- | --- |
| Median total page weight | 2,412 KB | 2,164 KB |
| 90th percentile page weight | 9,179 KB | 8,337 KB |
| Median images | 1,058 KB | n/a in this extract |
| Median JavaScript | 697 KB | n/a in this extract |
| Median fonts | 139 KB | n/a in this extract |
| Median CSS | 82 KB | n/a in this extract |
| Median HTML | 22 KB | n/a in this extract |
| Median unused JavaScript, uncompressed | 280 KB | 251 KB |

Ten-year growth, July 2015 to July 2025: the median mobile page went from 845 KB to 2,362 KB, up
202.8%. Desktop grew 110.2%.

Note one internal inconsistency in the source: the resource-type table gives median desktop JavaScript
as 697 KB while the narrative cites about 708 KB of total JavaScript per page. Medians of different
groupings do not have to agree. Use either as an order of magnitude, not a precise figure.

The number to act on is the unused JavaScript. A median page ships roughly a quarter of a megabyte of
code that never runs. That is a code-splitting and dependency-audit problem, and it is pure cost: it
delays LCP, it occupies the main thread, and it worsens INP.

## A performance budget that is actually enforceable

Budgets fail when they are aspirational. Make them build-breaking.

| Budget | Suggested value | Why this one |
| --- | --- | --- |
| JavaScript on the critical path, compressed | 150 to 200 KB | Beyond this, mid-range phones struggle to stay under 200 ms INP |
| LCP image, compressed | 150 KB | It must arrive before 2.5 s on a slow connection |
| Fonts | Two files, 100 KB total | Variable fonts make this achievable |
| Total requests before first paint | Under 20 | Each one is a queue slot |
| Third-party scripts | Counted individually, each with a named owner and a removal date | Third parties are where budgets go to die |

Two rules that matter more than the numbers: test on a mid-range Android phone on a throttled network,
never on the development machine; and make the budget a check in continuous integration that fails the
build, because a dashboard nobody is blocked by gets ignored.

## Perceived speed: changing the feeling, not the clock

Perceived duration and measured duration are different quantities. The classic response-time limits
(0.1 s, 1 s, 10 s, see 01) tell you which technique applies.

| Technique | When it helps | When it backfires |
| --- | --- | --- |
| Optimistic update: show the result immediately, reconcile with the server after | Actions that almost always succeed: like, favourite, rename, add to list | Anything where failure is likely or costly. A rollback that surprises the user is worse than a wait |
| Skeleton placeholder: show the shape of the content | You know the layout in advance and the wait is roughly 1 to 10 s | Very short waits, where it flashes; and unknown layouts, where the skeleton lies about what is coming |
| Spinner | Short, indeterminate waits | Anything over a few seconds, where it communicates nothing and reads as "stuck" |
| Progress bar with an estimate | Waits over 10 s | Fake progress that stalls at 90% destroys trust for every future wait |
| Streaming or progressive rendering: show partial results as they arrive | Long generation, search results, long documents | When partial output is misleading on its own, for example a half-finished number |
| Preload and speculative loading on hover or focus | Predictable next navigation | Aggressive prefetching wastes the user's data and can trigger side effects |
| Skeleton-free instant paint of static shell | Any repeat visit | When the shell is stale and misrepresents state |

**Honest note about the evidence.** Claims that streaming cuts perceived wait by a specific
percentage, or that skeletons feel 40% faster, circulate widely but trace back to vendor blog posts
without published method or sample. The direction is well established in the human-factors literature
(feedback reduces perceived wait, and progress information reduces abandonment). The exact percentages
should not be quoted. See 14 for this gap.

## Layout stability is a design problem

CLS is usually blamed on engineering, but it is caused by design decisions:

- **Media without reserved space.** Always set `width` and `height` attributes, or an `aspect-ratio`.
- **Web fonts that reflow text.** Use `font-display: swap` with a fallback whose metrics are adjusted
  using `size-adjust`, `ascent-override`, and friends, so the swap does not move lines.
- **Content injected above existing content.** Cookie bars, promo banners, and late-loading ads. Reserve
  the space or position them so they overlay rather than push.
- **Anything that grows after interaction.** Expanding an accordion is fine, because the user caused it.
  CLS only counts unexpected shifts.

## Field data versus lab data

You need both, and they answer different questions.

| | Field data | Lab data |
| --- | --- | --- |
| Source | Real visits from real devices, for example the Chrome User Experience Report | A synthetic run, for example Lighthouse |
| Answers | "Are users having a good time?" | "Why, and did my change help?" |
| Weakness | Slow to update, aggregated, no diagnostics | Not your users, not their devices, not their network |

The 2025 crawl found a tension worth knowing about: real-world INP scores improved while the lab metric
Total Blocking Time got worse. Lab tools use a fixed throttled profile that may not match your actual
audience. Trust the field for whether you have a problem and the lab for finding the cause.

## The performance checklist

1. LCP under 2.5 s, INP under 200 ms, CLS under 0.1, at the 75th percentile of real visits.
2. The LCP element identified, and marked with `fetchpriority="high"` if it is an image.
3. All media has dimensions or `aspect-ratio`.
4. Fonts self-hosted, subset, two files or fewer, with metric-adjusted fallbacks.
5. Unused JavaScript measured and trending down.
6. Third-party scripts inventoried, each with an owner.
7. A budget enforced in continuous integration.
8. Tested on a mid-range phone on a throttled network.
9. Every action over 100 ms acknowledges immediately.
10. No fake progress, and no optimistic update on an operation that can plausibly fail.

---

<!-- 11archive-source: 08-forms-and-authentication.md -->

# 08. Forms and authentication

Forms are where users pay you, sign up, or leave. They are also the most consistently broken part of the
web: half of the top million home pages have an input with no label, and about a quarter of inputs
across the 2025 crawl had no accessible name at all.

## The label rule, and why placeholders are not labels

Every input needs a visible, persistent label associated with it in markup:

```html
<label for="email">Email address</label>
<input id="email" name="email" type="email" autocomplete="email" inputmode="email">
```

Placeholder text fails as a label for five separate reasons: it disappears when the user starts typing,
so they lose the field's meaning halfway through; it is usually low contrast, so it fails 1.4.3; it gets
mistaken for a filled value, so users skip the field; it cannot hold a hint and a label at once; and
screen reader support for placeholder-as-name is inconsistent. In the July 2025 crawl, 53% of desktop
inputs and 55% of mobile inputs relied on placeholder alone.

Floating labels are a compromise, not a solution. They are acceptable if the label remains visible above
the value at a readable contrast after entry, and if the animation respects reduced motion. They are not
acceptable if they leave the field ambiguous when filled.

## Types, keyboards, and autofill: the three attributes

Three attributes turn a generic text box into a good field. Set all three.

| Attribute | Job | Example |
| --- | --- | --- |
| `type` | Validation and platform behaviour | `type="email"`, `type="tel"`, `type="url"`, `type="date"` |
| `inputmode` | Which on-screen keyboard appears | `inputmode="numeric"` for a card number, `inputmode="decimal"` for a price |
| `autocomplete` | Which stored value the browser or password manager fills | `autocomplete="email"`, `autocomplete="street-address"` |

Why each matters concretely: `type="tel"` gives a phone keypad instead of a full keyboard, which removes
about half the taps. `inputmode="numeric"` gives digits without turning the field into a number spinner,
which is what you want for a card number or a postcode. And correct `autocomplete` tokens let a browser
fill name, email, and phone in one tap, which is the single largest completion-rate improvement available
on mobile.

`autocomplete` also satisfies WCAG rule 1.3.5 Identify Input Purpose (Level AA), which requires
programmatic identification of common field purposes.

The tokens people get wrong most:

| Field | Token |
| --- | --- |
| Existing password on a sign-in form | `current-password` |
| New password on a signup or change form | `new-password` |
| One-time code from SMS or an authenticator | `one-time-code` |
| Full name in one field | `name` |
| Card number | `cc-number` |
| Card expiry as one field | `cc-exp` |

**Do not disable autofill for security.** Turning off `autocomplete` does not stop data being stored, it
just forces manual typing, which increases errors and pushes people toward weaker, memorable passwords.
The safer pattern is correct tokens so managers handle the data properly.

## Structure: fewer fields, better order

- **Ask for less.** Every field is a chance to abandon. If you can derive it (city from a postcode,
  country from a phone prefix) do not ask.
- **One column.** Multi-column form layouts cause users to miss fields and confuse the visual reading
  order, and they break at small widths. Baymard's checkout research flags extensive multicolumn layouts
  as a recurring usability mistake.
- **Group and label sections** for long forms, and use a real `<fieldset>` with a `<legend>` for grouped
  controls such as radio sets.
- **Do not split what people think of as one thing.** A card number is one field with automatic spacing,
  not four boxes. An expiry date is one field or a pair of selects, not a free-text challenge. Baymard
  reports the majority of sites make card expiry entry harder than it needs to be.
- **Explain unusual requests.** A required phone number with no reason is a known abandonment cause.
  One sentence of explanation next to the field fixes it.
- **Never ask twice.** WCAG 2.2 rule 3.3.7 Redundant Entry now makes repeated entry in one process a
  Level A failure. Shipping address already collected? Offer it, do not re-ask.

## Validation that helps

| Rule | Do | Do not |
| --- | --- | --- |
| Timing | Validate on blur, or as the user types once they have plausibly finished. Re-validate on submit | Show an error while they are still typing the first characters |
| Placement | Message directly below the field it concerns | A summary at the top only |
| Content | Say what is wrong and what to do: "Enter a date after 12 August 2026" | "Invalid input" |
| Both channels | Text plus an icon plus colour, and `aria-describedby` linking the message to the field | Colour alone, which fails for colour vision deficiency |
| Programmatic state | `aria-invalid="true"` on the field when it is in error | Only a red border |
| Submit failure | Move focus to the first error, and provide a list of errors at the top with links to each field | Silently scroll, leaving focus where it was |
| Success | Confirm what happened and what comes next | A blank page or a bare "Success" |

Two specific things worth building once and reusing: a required-field convention that does not rely on
colour, and an error summary component that is announced as a live region on submit failure.

## Mobile-specific form failures

- **Inputs must be 16 px or larger.** Below that, mobile Safari zooms the whole page when the field is
  focused, which then leaves the layout scrolled sideways. Setting `maximum-scale=1` to stop the zoom is
  the wrong fix: it blocks pinch zoom entirely and fails WCAG 1.4.4. Roughly one page in five still does
  this.
- **Keep the submit button reachable.** A sticky bar with `env(safe-area-inset-bottom)` padding beats a
  button that lands under the keyboard.
- **Do not clear the form on error.** Losing entered data on a phone is a near-certain abandonment.
- **Use platform pickers.** A native date input, a native select, and the platform's autofill all beat a
  custom equivalent on a phone.

## Authentication in 2026

The rules changed twice: once because of WCAG 2.2, and once because passkeys became mainstream.

**What WCAG 2.2 rule 3.3.8 requires.** No step of authentication may depend on a cognitive function
test, which means remembering a password, transcribing something, solving a puzzle, or recalling
information, unless there is an alternative, or a mechanism to help, or the test is object or personal
content recognition. In practice:

- Copy and paste must work in every authentication field, including one-time-code fields.
- A password manager must be able to fill and submit.
- An image or logic puzzle cannot be the only route through.
- Email links, passkeys, and third-party sign-in all count as compliant alternatives.

**Passkeys.** A passkey replaces a password with a private key held by the device, unlocked by the
device's own biometric or PIN. There is nothing to remember and nothing to phish. Reported adoption as of
May 2026, from FIDO Alliance surveys conducted by Sapio Research in April 2026 across 11,000 consumers
in ten countries:

| Measure | Reported figure |
| --- | --- |
| Passkeys in use worldwide | About 5 billion |
| Consumers aware of passkeys | 90% |
| Consumers who have enabled at least one | 75% |
| Consumers who use them regularly where available | 49% |
| Organisations deployed or actively deploying for employees | 68% |
| Top 100 websites supporting them | About 48% |

These are vendor-sponsored survey figures, so treat the levels as indicative. The comparative claim of
higher login success rates for passkeys against passwords is reported by multiple parties but with no
single published method available here.

**Design guidance for passkeys**, since the pattern is new to most users:

- Offer passkeys alongside the existing method, never as an abrupt replacement.
- Explain in one sentence with no jargon: "Sign in with your face, fingerprint, or screen lock. Nothing
  to remember."
- Handle the device-loss case in the interface, not just the help centre. Always keep a documented
  recovery route.
- Do not call it "passwordless" in user-facing copy. Users do not know what that means.
- Keep the fallback path visible, because passkey support still varies by browser and platform.

## The form checklist

1. Every input has a visible, associated label.
2. `type`, `inputmode`, and `autocomplete` set on every field.
3. One column, grouped sections, no split fields for a single mental unit.
4. Nothing asked twice in one flow.
5. Errors named, placed at the field, announced, and reachable by focus on submit.
6. Inputs at 16 px or larger; pinch zoom not blocked.
7. Paste works everywhere, especially password and code fields.
8. Data preserved through validation errors and back navigation.
9. Card, address, and phone fields tested against real formats from more than one country.
10. Authentication has at least one route that requires no memory test.

---

<!-- 11archive-source: 09-ai-native-ux.md -->

# 09. AI-native interface design

Putting a model in an interface breaks an assumption every other section of this report relies on: that
the same input produces the same output. When output varies, is sometimes wrong, and cannot be fully
explained, the interface has to carry the uncertainty. That is the whole design problem.

## The most-validated guidance available

Microsoft Research's **18 Guidelines for Human-AI Interaction** (Amershi and colleagues, published at
CHI 2019) remain the strongest-tested set. They were validated with 49 design practitioners applying them
against 20 shipped AI products, and they synthesise about two decades of prior work. They are grouped by
when they apply.

**Initially, before the user has typed anything:**

| # | Guideline | What it looks like in a real interface |
| --- | --- | --- |
| G1 | Make clear what the system can do | A short capability statement or example prompts, not a blank box with a cursor |
| G2 | Make clear how well the system can do what it can do | "Drafts are usually a good starting point; check figures before sending" |

**During interaction:**

| # | Guideline | What it looks like |
| --- | --- | --- |
| G3 | Time services based on context | Do not interrupt mid-sentence with a suggestion |
| G4 | Show contextually relevant information | Cite the document the answer came from, inline |
| G5 | Match relevant social norms | Tone that fits the setting; no false familiarity in a medical or financial product |
| G6 | Mitigate social biases | Test outputs for stereotyped language and skewed examples |

**When the system is wrong:**

| # | Guideline | What it looks like |
| --- | --- | --- |
| G7 | Support efficient invocation | One obvious way to ask for AI help |
| G8 | Support efficient dismissal | One key press to reject a suggestion, with no penalty |
| G9 | Support efficient correction | Edit the output in place; do not force a re-prompt |
| G10 | Scope services when in doubt | When confidence is low, offer a narrower answer or ask a question instead of guessing broadly |
| G11 | Make clear why the system did what it did | Show the inputs, the retrieved sources, or the rule that fired |

**Over time:**

| # | Guideline | What it looks like |
| --- | --- | --- |
| G12 | Remember recent interactions | Do not lose the thread between turns |
| G13 | Learn from user behaviour | Adapt to accepted and rejected suggestions |
| G14 | Update and adapt cautiously | Do not change behaviour abruptly under the user's hands |
| G15 | Encourage granular feedback | Feedback on the specific claim, not just thumbs on the whole answer |
| G16 | Convey the consequences of user actions | Say what "accept" will change, especially if it writes somewhere |
| G17 | Provide global controls | A real off switch, and settings for how much the system may do |
| G18 | Notify users about changes | Tell people when the model or behaviour changed |

Google's **People + AI Guidebook** (from the PAIR team, first published 2019 and updated for generative
AI) covers the same ground in six chapters, and its most useful contributions are three: setting the
user's **mental model** before first use, using **progressive disclosure** for explanations so the
interface is neither opaque nor overwhelming, and designing **graceful failure** as a first-class state
rather than an error page.

## The five states of an AI feature

Extend the four states from 01 with one more, and specify all five.

| State | What the interface must do |
| --- | --- |
| Empty, before first use | Say what this can do, give two or three concrete example prompts, and say what it cannot do |
| Working | Stream partial output if the wait exceeds about a second. Say what step it is on for multi-step work |
| Complete | Show provenance. Offer edit, regenerate, and dismiss with equal weight |
| Uncertain | Say so in words. Narrow the claim, offer to search, or ask a clarifying question |
| Failed | Explain what failed in plain words, whether retrying will help, and offer the non-AI path |

The state most products skip is **uncertain**, and it is the one that determines whether users trust the
feature after their first bad answer. A system that says "I am not sure about the second figure" survives
being wrong. A system that states everything with equal confidence does not.

## Streaming, and what it actually buys

Streaming means rendering the output as it is generated instead of waiting for the whole thing. Two real
benefits, one real cost.

Benefits: the user sees progress within a few hundred milliseconds instead of waiting several seconds,
which keeps the interaction inside the response-time limits from 01; and the
user can tell early whether the answer is going the wrong way and stop it.

Cost: partial output can mislead. A half-rendered number, table, or code block reads as complete for a
moment. Practical rules:

- Keep a **stop** control visible during generation, with the same prominence as send.
- Do not stream content whose meaning changes when incomplete. Buffer numbers, totals, and structured
  results until the unit is whole.
- Show a caret or subtle indicator so the user can distinguish "still writing" from "finished".
- Never let streaming text push the page around. Reserve the space or pin the scroll position, or you
  turn a feature into a layout-shift problem.

**Evidence note.** Specific percentage claims about how much streaming or skeleton screens reduce
perceived waiting circulate widely in vendor articles with no published method. The mechanism is well
supported by the classic response-time work; the numbers are not verifiable and are excluded here.

## Chat is a fallback, not a design

A text box is the easiest AI interface to build and usually the worst one to use, because it requires the
user to guess what the system can do and to phrase it correctly. Prefer, in order:

1. **In-place assistance.** The AI acts on the thing the user already selected: rewrite this paragraph,
   explain this error, fill this field. No prompting required, and the scope is obvious.
2. **Structured input.** A form or a set of controls that constructs the prompt. The user picks tone,
   length, and audience rather than describing them.
3. **Suggested actions.** A short list of things the system is good at, in this context, right now.
4. **Chat.** For genuinely open-ended, multi-turn work. Keep it, but do not make it the entry point.

If you do build chat: give it a scoped set of visible example prompts, keep prior turns editable, make
the context it is using visible (which documents, which selection), and let the user remove things from
that context.

## Generative interfaces, and where the risk is

"Generative UI" means the model assembles the interface, not just the text: it picks a chart over a
table, or produces a form on demand. The upside is a response shaped to the question. The three risks
are concrete:

- **Inconsistency.** If the model can invent components, your design system has stopped being a system.
  Constrain generation to a fixed catalogue of vetted components, with the model choosing among them
  rather than authoring new ones.
- **Accessibility regression.** Generated markup will not have your keyboard handling or labels unless
  the components it selects already do. This is another argument for a component catalogue as the only
  generation surface.
- **Unlearnable interfaces.** If the layout changes every time, users cannot build a mental model and
  cannot develop expertise. Keep the frame stable and let only the content vary.

## Agents: the transparency problem

When the system takes actions rather than producing text, the design burden rises sharply. The
non-negotiables:

- **Show the plan before acting**, for anything with a side effect. Sending, buying, deleting, and
  publishing all need explicit confirmation of the specific action, not a general permission.
- **Show what it did, as a reviewable log.** Not a spinner and then a claim of success.
- **Make undo real.** If the action cannot be undone, the confirmation must say so before, not after.
- **Distinguish proposal from action** visually and consistently. Users must never have to guess whether
  something already happened.
- **Fail loudly and stop.** An agent that silently continues after a failed step compounds the error.
- **Never let content the agent read give it instructions.** This is a security property, but it surfaces
  in the interface too: show the user which sources were consulted, so an injected instruction becomes
  visible rather than invisible.

## Feedback that is worth collecting

Thumbs up and thumbs down produce a number nobody can act on. Better:

- Attach feedback to a **specific span** of the output, not the whole response.
- Offer a small set of named reasons: wrong fact, wrong tone, missed the question, unsafe, too long.
- Capture the **edit**. What the user changed the output into is the highest-value training and
  diagnostic signal available, and it costs the user nothing extra.
- Close the loop. Guideline G18: tell people when their feedback changed something.

## How much AI is actually in interfaces today

For calibration, from the 2025 Web Almanac's generative AI chapter, July 2025 crawl of about 12.9 million
sites:

| Feature | Desktop | Mobile |
| --- | --- | --- |
| Browser Prompt API detected | 0.095% | 0.078% |
| Translator and Language Detector APIs | 0.277% | 0.262% |
| Writing assistance APIs | 0.127% | 0.137% |
| Valid `llms.txt` file present | 2.13% | 2.10% |
| `robots.txt` present with directives | 94.1% | n/a |
| `robots.txt` mentioning GPTBot | 4.5% (20.9% of the top 1,000) | n/a |

For contrast, the enabling technologies grew fast: WebAssembly use rose 27% across 2025 to 5.64% of page
loads, and WebGPU rose 591% on desktop to 0.243%.

The takeaway for a design team: browser-native AI is still negligible in the wild, so almost every AI
feature today is a server call with network latency and cost attached. Design for the wait and for the
failure, because both are guaranteed.

## The AI feature checklist

1. Capability and limits stated before first use.
2. Example prompts or, better, no prompt required.
3. Uncertainty expressed in words, not hidden.
4. Provenance shown for factual output.
5. Edit, regenerate, and dismiss all one action away and equally weighted.
6. Stop control visible during generation.
7. Partial output never misleading; numbers and tables buffered.
8. Side-effecting actions confirmed specifically, with an honest statement about undo.
9. A visible non-AI path to the same goal.
10. A global off switch, and feedback attached to specific spans.

---

<!-- 11archive-source: 10-anti-patterns-and-regulation.md -->

# 10. Anti-patterns, deceptive design, and regulation

Some design failures are mistakes. Others are choices that work for the business by working against the
user. Both now carry consequences: the first through accessibility law, the second through consumer
protection law. This section catalogues both, with the fix for each.

## Deceptive design: from a blog term to an enforcement priority

"Dark patterns", now often called deceptive design, are interface choices that steer users into
decisions they would not otherwise make. The category moved from criticism to enforcement.

**United States.** The Federal Trade Commission finalised a rule in 2024 requiring cancellation to be as
easy as sign-up, commonly called "click to cancel". A federal appeals court vacated it in 2025 on
procedural grounds, and the Commission has continued to act under its general authority against unfair
and deceptive practices. The consequential number: a reported $2.5 billion settlement with Amazon in
September 2025 over allegations that its subscription sign-up used deceptive design and made cancellation
difficult, plus a reported $8 million settlement with Care.com in 2025. Whatever happens to the specific
rule, the exposure is real.

**European Union.** The Digital Fairness Act is the Commission's planned instrument covering manipulative
interface design, addictive design, misleading influencer marketing, and unfair personalisation. It is a
headline item in the 2030 Consumer Agenda adopted on 19 November 2025, with a legislative proposal
expected late 2026. Existing instruments already bite in the meantime, and national regulators are
active.

The practical planning assumption: design the cancellation, consent, and pricing flows as if the rule
exists, because the enforcement already does.

## The deceptive-design catalogue

| Pattern | What it looks like | Why it is a problem | The fix |
| --- | --- | --- | --- |
| Confirmshaming | "No thanks, I prefer paying full price" | Coerces through embarrassment | Neutral decline wording, same visual weight |
| Asymmetric buttons | "Accept all" is a filled button, "Reject" is grey text | Manipulates by visual hierarchy, not information | Equal size, weight, and colour treatment for both |
| Roach motel | Easy to subscribe, phone call to cancel | The specific target of FTC action | Cancel in the same number of steps as sign-up, in the same channel |
| Hidden costs | Fees appear only at the last step | Sunk-cost manipulation | Total price, including fees, from the first step |
| Forced continuity | Trial converts silently to a paid plan | Charges without a decision | Reminder before charge, and a visible cancel path |
| Pre-checked options | Marketing consent already ticked | Consent that was never given | Unchecked by default, always |
| Fake urgency | "3 people are viewing this" with no basis | False information | Only show counts and timers that are true and verifiable |
| Nagging | Repeated prompts to enable notifications | Wears down refusal | Ask once, respect the answer, offer it in settings |
| Disguised ads | Sponsored content styled as results | Confuses identity of content | Clear, persistent labelling |
| Trick wording | Double negatives on opt-outs | Confuses through language | One clear affirmative statement per choice |
| Obstruction | Cancellation buried five levels deep | Friction as a retention strategy | Direct route from the account page |
| Bait and switch | The button does something other than its label | Breaks the basic contract of a control | Labels describe the action |

A useful test for any flow: **would you be comfortable showing this screen to the user afterwards and
explaining why it was designed this way?** If not, it is a deceptive pattern regardless of what it is
called internally.

## Cookie and consent banners

The most-seen interface on the web, and one of the worst. What the evidence says:

- Regulators are now specifically targeting **click-depth asymmetry** (reject taking more clicks than
  accept), non-functional withdrawal of consent, and banners that appear compliant while tracking loads
  regardless.
- A 2025 French regulator action issued formal notices over banner design asymmetry, and Austria's
  highest court ruled that a coloured accept button paired with a grey reject link violates the
  requirement for parity.
- Presence of both accept and reject buttons rose from 2.94% of EEA sites in 2018 to 30.66% in 2024,
  which also means most sites still lacked parity in 2024.
- One study reported that only about 15% of the top 10,000 EU websites ran a minimally compliant banner
  while about 67% showed a consent interface at all.
- Reported behaviour: about a quarter of visitors accept everything on first click and about a third
  ignore the banner entirely. Reported consent rates with symmetric buttons around 40% in one German
  market study.

Treat the specific percentages as secondary and indicative; the regulatory direction is not in doubt.

Design rules that both comply and read as honest:

1. Accept and reject get identical treatment: same element type, size, colour weight, and position
   prominence.
2. One click to reject everything, from the first screen.
3. No pre-ticked non-essential categories.
4. Withdrawal is as easy as granting, and reachable later from a persistent control.
5. Nothing non-essential loads before consent, including the analytics you forgot about.
6. The banner does not cover content in a way that traps keyboard focus (see WCAG 2.4.11).

## Accessibility overlays: the widget that does not work

Third-party scripts that promise to make a site accessible by injecting an overlay are used by about 2%
of desktop sites, but only 0.2% of the top 1,000. That gap is informative: the sites with the largest
accessibility budgets and the most legal scrutiny use them least.

The problems are structural rather than about any one vendor: an overlay cannot fix a missing label
correctly because it cannot know the field's purpose, it cannot restructure headings, it cannot add
meaningful alternative text, it often conflicts with the user's own assistive technology, and it does not
remove legal exposure. Fix the underlying markup instead. If a vendor offers a scan, use the scan and
skip the widget.

## The interface anti-pattern catalogue

Failures that are mistakes rather than manipulation. Each maps to a section of this report.

| Anti-pattern | Symptom | Fix | Section |
| --- | --- | --- | --- |
| Removing the focus ring | Keyboard users cannot see where they are; about 67% of sites do this | Style `:focus-visible`, 2 px, 3:1 contrast | 05 |
| Placeholder as label | Field meaning vanishes on typing | Real `<label>` | 08 |
| `div` as button | No keyboard, no role, no focus | `<button>` | 06 |
| ARIA over native | More detected failures, not fewer | Native element first | 06 |
| Blocking pinch zoom | Fails WCAG 1.4.4; one page in five still does it | Remove `maximum-scale`; use 16 px inputs | 04 |
| Drag-only interaction | Fails WCAG 2.5.7 | Add a single-pointer alternative | 05 |
| Hover-only reveal | Invisible on touch, unreachable by keyboard | Click or `interestfor` | 05 |
| Tiny tap targets | Mis-taps, rage taps | 24 px floor, 44 px for frequent actions | 05 |
| Low-contrast "elegant" grey | Most common failure on the web | 4.5:1 body, 3:1 large and controls | 04 |
| Colour-only status | Invisible to about 8% of men | Add icon, shape, or text | 04 |
| Infinite scroll with a footer | Footer becomes unreachable | Paginate, or move footer content elsewhere | 03 |
| Carousel as primary navigation | Very low interaction with slides past the first | Show the content; if you must, add pause and controls | 05 |
| Auto-playing motion with no pause | Fails WCAG 2.2.2 | Pause control, respect reduced motion | 05 |
| Layout shift from late content | Users click the wrong thing | Reserve space, `aspect-ratio` | 07 |
| Fake progress bar | Stalls at 90%, destroys trust | Real progress or an honest indeterminate state | 07 |
| Modal on arrival | Blocks the task before it starts | Delay, or use an inline offer | 01 |
| Scroll hijacking | Removes the user's control of the page | Do not intercept scroll | 05 |
| Icon-only toolbars | Meaning guessed, not read | Labels, or labels on hover plus accessible names | 04 |
| Destructive action next to a common one | Deletes the wrong thing | Separate, differentiate, confirm, and offer undo | 01 |
| Error message without a fix | "Invalid input" | Say what and how | 08 |
| Disabled submit with no explanation | User cannot tell what is missing | Keep it enabled and explain on submit, or explain the blocker inline | 08 |
| Silent AI confidence | Wrong answers stated as facts | Express uncertainty, show provenance | 09 |
| Unlabelled AI action with side effects | Something got sent | Confirm specifically, and say whether undo exists | 09 |
| Half-migrated design system | Two versions of every pattern | Finish the migration, or revert it | 02 |

## Where the two categories meet

The overlap is worth naming: a cancellation flow that is technically present but only reachable by
dragging, or a consent banner that traps keyboard focus, is simultaneously an accessibility failure and a
consumer protection problem. Deceptive patterns hurt users with disabilities disproportionately, because
extra friction compounds. Auditing both at once is more efficient than auditing either alone.

---

<!-- 11archive-source: 11-measurement-and-research.md -->

# 11. Measuring and researching interface quality

Design arguments end when there is a number. This section covers how to pick numbers that mean something,
the standard instruments and their real benchmarks, and how many people you actually need to test with.

## HEART, and the process that makes it work

**HEART** is a framework from Google (Kerry Rodden, Hilary Hutchinson, and Xin Fu) for choosing
user-centred metrics. It names five categories:

| Category | Question it answers | Typical measure |
| --- | --- | --- |
| **H**appiness | How do users feel about it? | Survey score, satisfaction rating, System Usability Scale |
| **E**ngagement | How much do they use it? | Actions per active user per week, session depth |
| **A**doption | Are new users taking it up? | New users completing the core action in their first week |
| **R**etention | Do they come back? | Share of users active in a period who are active in the next |
| **T**ask success | Can they do the thing? | Completion rate, time on task, error rate |

The framework is not the useful part. The **Goals, Signals, Metrics** process is:

1. **Goal.** What should be true for the user? Not "increase engagement" but "people find the right
   document without asking a colleague."
2. **Signal.** What observable behaviour would show that? "Search result clicked in the first three
   positions", "no repeated search within two minutes."
3. **Metric.** The exact number, with its population, numerator, denominator, and period. "Share of
   search sessions ending in a first-page click, weekly, excluding bot traffic."

Two rules that keep this honest. Pick at most one metric per category, because a dashboard with 30
numbers gets ignored. And write down what would make you abandon the change, before you run it.

**Watch for the engagement trap.** Engagement rises when a product is confusing, because users need more
clicks to achieve the same thing. Pair every engagement metric with a task success metric, or you will
optimise for friction.

## The System Usability Scale

**SUS** is a ten-item questionnaire from 1986 that produces a single score from 0 to 100. It is worth
knowing precisely because it is the most widely used and most widely misread instrument in the field.

- **The average is 68.** From Jeff Sauro's meta-analysis of about 5,000 scores across 500 studies.
- **68 is the 50th percentile, not a pass mark of 68%.** A SUS score is not a percentage. Sauro and
  Lewis's curved grading scale, built from 241 studies, puts 68 at the centre of a "C" grade, with the
  top and bottom 15 percentiles as A and F.
- **So a score of 72 is above average**, and a score of 68 means exactly ordinary.

Use SUS for comparison, either against your own previous release or against the benchmark. Do not use it
to diagnose anything: it tells you there is a problem, never what it is. For that you need task-level
observation.

## How many test participants

The "five users is enough" rule comes from Nielsen's 2000 article, resting on a model he and Thomas
Landauer published in 1993. The model says the number of problems found grows as
`N × (1 − (1 − L)^n)`, where `L` is the share of problems a single user reveals, typically about 31%
across the projects they studied. At `L = 31%`, five users surface roughly 85% of problems.

**Where it breaks, and this matters:**

- The 31% figure is an average across projects. Where problems are rarer, five users finds far fewer of
  them. Roughly: at a 20% discovery rate you need about nine users for the same coverage, and at 10%
  about eighteen.
- Variance between samples is large. In one study of 60 users, some random sets of five found 99% of
  problems and others found 55%. Ten users raised the worst case to 80%, and twenty to 95%.
- It assumes one user group. Distinct groups (an administrator and an end user, a novice and an expert)
  each need their own participants.
- It applies to formative usability testing only. It says nothing about quantitative work: measuring a
  conversion difference needs a sample size calculation, not five people.

**The actual recommendation, which is the part that gets dropped:** run more, smaller studies. Three
rounds of five users with fixes in between beats one round of fifteen, because the second round tests the
fixes and finds the problems the first round's problems were hiding.

| Purpose | Participants | Note |
| --- | --- | --- |
| Formative usability test, one user group | 5 per round, 3 rounds | Fix between rounds |
| Multiple distinct user groups | 3 to 4 per group | Analyse separately |
| Comparing two designs qualitatively | 8 to 12 | Counterbalance the order |
| Measuring a completion rate or time | Calculate from the effect size you care about | Usually 20 or more per condition |
| A/B test of a conversion metric | Calculate from baseline rate and expected lift | Usually thousands |
| Card sorting or tree testing | 15 to 30 | These are quantitative even though they feel qualitative |

## Task-level measures that actually diagnose

| Measure | Definition | Watch out for |
| --- | --- | --- |
| Completion rate | Share of participants who finish unaided | Define "unaided" before you start |
| Time on task | Median, not mean, of successful attempts only | Including failures makes fast failures look good |
| Error rate | Errors per attempt, categorised by type | Categories are where the insight is |
| Assists | Times the facilitator had to intervene | The most honest measure in moderated testing |
| Single Ease Question | One 7-point rating right after each task | Cheap, and localised to a task unlike SUS |
| First-click accuracy | Whether the first click was on the right path | Strong predictor of eventual success |

## Field data as a continuous research channel

You already have three instruments running:

- **Core Web Vitals from real visits.** See 07. Segment by device and country,
  because an aggregate hides the mid-range Android problem.
- **Funnel drop-off by step and field.** For forms, log which field was last focused before abandonment.
  This single measurement finds more form problems than most usability tests.
- **Search terms with no results, and repeated searches.** A direct list of things users expected and did
  not find.

Two cautions. Analytics tells you what happened, never why, so treat every finding as a hypothesis for
qualitative work. And session replay tools record real people: strip fields, respect consent, and never
replay anything with credentials or payment data in it.

## Accessibility as a measurable programme

| Metric | How | Target |
| --- | --- | --- |
| Automated failures per page | Scanner in continuous integration | Zero new failures; existing count falling |
| Share of pages scanned | Coverage of routes | Rising to all |
| Keyboard pass rate | Manual per flow, quarterly | All primary flows pass |
| Screen reader pass rate | Manual per flow | All primary flows pass |
| Time to fix an accessibility bug | From report to release | Same as any other defect of that severity |
| Findings from users with disabilities | Sessions run per year | More than zero, and rising |

The first metric alone is not compliance: automated tools detect roughly a third of issues. Report the
coverage limit next to the number, every time.

## Reporting results honestly

- **State the population.** Which users, which platform, which period.
- **Give the denominator.** "40% preferred B" from 10 people is four people.
- **Give uncertainty.** For any rate from a small sample, a confidence interval, or at minimum the raw
  counts.
- **Never total percentages, averages, or ratios** across rows in a table.
- **Say what you did not measure.** The unmeasured segment is where the surprise lives.
- **Separate observed behaviour from stated preference.** They frequently disagree, and behaviour wins.
- **Keep the raw data.** Aggregations you regret are recoverable; discarded raw data is not.

## The measurement checklist

1. One goal, one signal, one metric per HEART category that matters here.
2. Every metric has a written population, numerator, denominator, and period.
3. Engagement paired with task success.
4. A benchmark to compare against, either previous release or the SUS average of 68.
5. Usability testing in rounds of five with fixes between, not one large round.
6. Separate participants per distinct user group.
7. Quantitative claims backed by a sample size calculation.
8. Field performance segmented by device class and region.
9. Accessibility findings reported with their coverage limit.
10. Raw data retained, and privacy handled before storage rather than after.

---

<!-- 11archive-source: 12-implementation-checklist.md -->

# 12. Implementation checklist

One gate, ordered by how much damage each item prevents. Paste it into a pull request template or a
release checklist. Every item traces to a section of this report.

## Tier 1: blocks release

These are failures against a standard that a law references, or defects that make the product unusable
for a group of people.

| # | Check | How to verify | Section |
| --- | --- | --- | --- |
| 1 | Body text at 4.5:1, large text and control borders at 3:1 | Automated scan plus manual check of muted, placeholder, and on-image text | 04 |
| 2 | Every input has a visible associated label | Scanner, then read the form with the stylesheet disabled | 08 |
| 3 | Visible focus indicator on every interactive element, 2 px, 3:1 | Tab through with the mouse unplugged | 05 |
| 4 | Every flow completable by keyboard alone | Manual pass per flow | 05 |
| 5 | Focus never entirely hidden by sticky content | Tab into elements under a sticky header and a cookie bar | 06 |
| 6 | Every drag interaction has a single-pointer alternative | Manual inspection of sliders, lists, maps, uploads | 05 |
| 7 | Targets at least 24 by 24 CSS px, or spaced to the 24 px circle rule | Measure the smallest targets: toast close, table row icons, pagination | 05 |
| 8 | Pinch zoom not blocked; text readable at 200%; reflows at 400% in 1280 px | Browser zoom, and check for `maximum-scale` | 04 |
| 9 | Nothing depends on colour alone | Greyscale the screenshot | 04 |
| 10 | Paste works in every authentication field | Try it | 08 |
| 11 | Nothing asked twice in one process | Walk the flow end to end | 08 |
| 12 | Cancelling, unsubscribing, or deleting is no harder than starting | Count clicks in each direction | 10 |
| 13 | Accept and reject given equal treatment in any consent interface | Visual comparison, and click count | 10 |
| 14 | Any action with a side effect confirms specifically, and states whether undo exists | Manual review of every destructive or outbound action | 09 |
| 15 | `lang` attribute set correctly on the document | View source | 06 |

## Tier 2: fix before it becomes a habit

Quality failures that compound across a codebase.

| # | Check | Section |
| --- | --- | --- |
| 16 | Native elements used for buttons, links, dialogs, popovers, selects, and disclosures | 05 |
| 17 | No ARIA attribute doing a job a native element already does | 06 |
| 18 | Focus returns to the trigger when an overlay closes | 05 |
| 19 | Skip link to main content present and working | 06 |
| 20 | Heading levels sequential, one `h1` per page | 06 |
| 21 | `prefers-reduced-motion` honoured, ideally with a cross-fade rather than nothing | 05 |
| 22 | `color-scheme` declared, dark mode implemented through semantic tokens | 04 |
| 23 | `forced-colors` checked in Windows High Contrast Mode | 04 |
| 24 | Type and spacing in `rem`; fluid sizes include a `rem` term inside `clamp()` | 04 |
| 25 | Reading columns capped near 65 characters | 04 |
| 26 | Inputs at 16 px or larger on mobile | 08 |
| 27 | Logical properties instead of physical left and right | 03 |
| 28 | `dvh` or `svh` instead of `vh`; safe-area insets on edge-anchored elements | 03 |
| 29 | All media has dimensions or `aspect-ratio` | 07 |
| 30 | Component-level responsiveness uses container queries, in `rem` | 03 |
| 31 | Empty, loading, error, and stale states specified for every data component | 01 |
| 32 | Error messages name the problem, the field, and the fix | 08 |
| 33 | Form data preserved through validation errors and back navigation | 08 |
| 34 | Nothing important is hover-only | 05 |
| 35 | Anything auto-moving for over five seconds has a pause control | 05 |
| 36 | Motion durations under 400 ms; entering eases out, leaving eases in | 05 |

## Tier 3: performance gate

| # | Check | Target | Section |
| --- | --- | --- | --- |
| 37 | LCP at the 75th percentile of real visits | 2.5 s or less | 07 |
| 38 | INP at the 75th percentile | 200 ms or less | 07 |
| 39 | CLS at the 75th percentile | 0.1 or less | 07 |
| 40 | LCP element identified and prioritised | `fetchpriority="high"` on an LCP image | 07 |
| 41 | Critical-path JavaScript, compressed | Under 200 KB | 07 |
| 42 | Unused JavaScript | Measured, trending down | 07 |
| 43 | Fonts | Two files or fewer, subset, metric-adjusted fallback | 04 |
| 44 | Third-party scripts | Inventoried, each with an owner and a review date | 07 |
| 45 | Tested on a mid-range Android phone on a throttled network | Manual | 07 |
| 46 | Every interaction over 100 ms acknowledges immediately | Manual | 01 |

## Tier 4: AI features

Only applies if a model is in the interface.

| # | Check | Section |
| --- | --- | --- |
| 47 | Capability and limits stated before first use | 09 |
| 48 | Uncertainty expressed in words when confidence is low | 09 |
| 49 | Provenance shown for factual claims | 09 |
| 50 | Edit, regenerate, and dismiss each one action away | 09 |
| 51 | Stop control visible during generation | 09 |
| 52 | Partial output never misleading; numbers and tables buffered | 09 |
| 53 | Streaming text does not shift the layout | 07 |
| 54 | A visible non-AI route to the same goal | 09 |
| 55 | Global off switch, and feedback attachable to a specific span | 09 |
| 56 | Generation constrained to a vetted component catalogue if the interface is generated | 09 |

## Tier 5: system health

Quarterly, not per release.

| # | Check | Section |
| --- | --- | --- |
| 57 | Token coverage rising; hard-coded colours trending to zero | 02 |
| 58 | Forks of system components counted and triaged as feature requests | 02 |
| 59 | Deprecations have dates, and old versions actually get removed | 02 |
| 60 | One metric per relevant HEART category, each with a written definition | 11 |
| 61 | Engagement metrics paired with task success metrics | 11 |
| 62 | Usability testing running in rounds, with fixes between | 11 |
| 63 | At least some sessions with users who have disabilities | 06 |
| 64 | Automated accessibility coverage reported with its known limit | 06 |

## What to automate

Anything in the table below should run without a human, on every pull request. The rest needs eyes.

| Automatable | Not automatable |
| --- | --- |
| Contrast ratios | Whether the label makes sense |
| Missing labels, alt text, and accessible names | Whether the alt text is useful |
| Heading order | Whether the heading describes the section |
| Colour literals outside token files | Whether a token is the right token |
| Core Web Vitals, bundle size, unused code | Whether the interaction feels right |
| `maximum-scale`, positive `tabindex`, `lang` | Focus order making sense |
| Presence of a pause control | Whether the motion is necessary at all |
| Whether a stop control exists | Whether the AI's uncertainty is honest |

The rule of thumb: automation catches the presence or absence of things. Only a person catches whether
the thing is right.

---

<!-- 11archive-source: 13-glossary.md -->

# 13. Glossary

Terms used in this report, defined for the audience it is written for. Where a term has a formal
definition in a specification, that definition governs.

**Accessible name.** The text assistive technology announces for an element. It comes from a `<label>`,
the element's own text, an `aria-label`, or an `alt` attribute. An element with no accessible name is
announced as just its type, for example "button".

**Anchor positioning.** A CSS feature for tethering one element to another, so a menu stays attached to
its button during scrolling without JavaScript measuring positions.

**Anti-pattern.** A common solution that reliably causes harm. Distinct from a deceptive pattern, which
harms the user on purpose.

**APCA (Advanced Perceptual Contrast Algorithm).** A newer way of calculating text contrast that models
human lightness perception more closely than the current ratio. Explored for future versions of WCAG, not
normative today.

**ARIA (Accessible Rich Internet Applications).** A set of HTML attributes that describe roles, states,
and properties to assistive technology. It adds description, never behaviour.

**ARIA Authoring Practices Guide (APG).** The W3C resource showing how to apply ARIA to common widget
patterns, with keyboard behaviour and working examples.

**`aspect-ratio`.** A CSS property that reserves the right shape for an element before its content loads,
which prevents layout shift.

**Assistive technology.** Software or hardware a person uses to operate a computer, including screen
readers, magnifiers, switch devices, and voice control.

**Baseline.** The shared label browser makers use for how safe a web feature is: limited availability,
newly available (just in all major engines), or widely available (in all of them for about 30 months).

**Breakpoint.** A viewport width at which layout rules change. Largely superseded by container queries and
intrinsic layout for component-level decisions.

**Cascade layers.** A CSS feature (`@layer`) for declaring the order in which groups of styles win, which
removes most specificity fights.

**`ch` unit.** The width of the "0" character in the current font, useful for setting a readable column
width that tracks the typeface.

**Chunking.** Grouping information so a person holds one item in mind instead of several. A card number in
groups of four is chunked.

**`clamp()`.** A CSS function taking a minimum, a preferred value, and a maximum, used for fluid sizes
with hard limits.

**CLS (Cumulative Layout Shift).** A Core Web Vital measuring how much visible content moves unexpectedly.
0.1 or less is good.

**`color-mix()`.** A CSS function that blends two colours in a chosen colour space, used to derive tinted
surfaces from one theme colour.

**Colour vision deficiency.** Reduced ability to distinguish certain colours, most commonly red and green.
Affects around 8% of men of northern European descent.

**Container query.** A CSS rule that responds to the size of an element's own container rather than the
window, so a component adapts wherever it is placed.

**`contrast-color()`.** A CSS function returning black or white, whichever contrasts more with a given
colour. Removes the manual choice of label colour on a themed button.

**Contrast ratio.** The measured difference in relative luminance between two colours, written as a ratio
such as 4.5:1.

**Core Web Vitals.** Google's three field-measured user experience metrics: LCP, INP, and CLS, each judged
at the 75th percentile of real page views.

**CrUX (Chrome User Experience Report).** The public dataset of real-visit performance measurements used
to judge Core Web Vitals.

**Deceptive pattern (dark pattern).** An interface choice that steers a user into a decision they would
not otherwise make. Now an enforcement priority for consumer regulators.

**Design system.** Named design decisions, reusable components, and the documented rules for using them.

**Design token.** A named design decision stored as data, for example a colour or a spacing step, so one
change propagates everywhere.

**DTCG (Design Tokens Community Group).** The W3C community group whose token file format reached its
first stable version, 2025.10, in October 2025.

**`dvh`, `svh`, `lvh`.** Viewport height units accounting for mobile browser toolbars: dynamic, small
(toolbars visible), and large (toolbars hidden).

**EAA (European Accessibility Act).** EU law making accessibility a requirement for covered products and
services sold to EU consumers, applied from 28 June 2025.

**EN 301 549.** The harmonised European accessibility standard used to demonstrate EAA compliance. Its web
chapter points at WCAG 2.1 Level AA.

**Field data.** Measurements from real users on real devices, as opposed to a synthetic test run.

**Fitts's law.** The time to hit a target grows with distance and shrinks with target size. Published by
Paul Fitts in 1954.

**Fluid typography.** Type sizes that scale continuously with the viewport or container instead of jumping
at breakpoints, usually via `clamp()`.

**Focus indicator.** The visible mark showing which element has keyboard focus. Must be at least 2 CSS
pixels thick with 3:1 contrast to meet WCAG 2.2 rule 2.4.13.

**`:focus-visible`.** A CSS selector that matches when the browser judges a focus indicator useful,
typically for keyboard rather than mouse interaction.

**`forced-colors`.** A media feature indicating the operating system has replaced the page's palette, as in
Windows High Contrast Mode.

**Generative UI.** An interface assembled by a model at runtime, choosing or producing components rather
than only text.

**Headless component.** A component shipping behaviour, keyboard handling, and accessibility semantics with
no visual styling. Also called an unstyled primitive.

**HEART.** A framework from Google for choosing user-centred metrics: Happiness, Engagement, Adoption,
Retention, Task success.

**Hick's law.** Decision time rises with the logarithm of the number of choices. From Hick (1952) and
Hyman (1953).

**INP (Interaction to Next Paint).** The Core Web Vital for responsiveness, covering all clicks, taps, and
key presses in a visit. 200 ms or less is good. Replaced First Input Delay in March 2024.

**Interop.** The annual programme in which Apple, Google, Igalia, Microsoft, and Mozilla agree a set of
web features to make behave identically, measured by a public test suite.

**Intrinsic layout.** Layout that lets content and available space determine the result, using tools such as
`auto-fit`, `minmax()`, and `clamp()` instead of fixed sizes.

**`inputmode`.** An HTML attribute selecting which on-screen keyboard appears, independent of the input's
validation type.

**Lab data.** Measurements from a synthetic test with a fixed device and network profile. Good for
diagnosis, not for judging real experience.

**Landmark.** A region of a page identified for navigation by assistive technology, for example the main
content, navigation, or a search area.

**LCP (Largest Contentful Paint).** The Core Web Vital for loading, marking when the largest visible element
finished rendering. 2.5 s or less is good.

**`light-dark()`.** A CSS function holding a light-mode and a dark-mode value in one declaration, resolved
by the active colour scheme.

**`llms.txt`.** A proposed file at a site's root describing its content for large language models. Present
on about 2% of sites in the July 2025 crawl.

**Logical properties.** CSS properties named by the flow of text rather than the physical screen, for
example `margin-inline-start`, so layouts work in right-to-left languages unchanged.

**Main thread.** The single thread where a browser runs JavaScript, style, layout, and paint. Work queued
here is what makes interactions feel slow.

**Media query.** A CSS rule responding to the window or device, for example its width or the user's colour
scheme preference.

**Mental model.** The user's internal theory of how a system works. Interfaces feel intuitive when they
match it and confusing when they do not.

**Modal.** An overlay that blocks interaction with the rest of the page until dismissed. Built correctly
with `<dialog>` and `showModal()`.

**`oklch()`.** A CSS colour notation using perceptual lightness, chroma, and hue, which makes even colour
ramps and predictable contrast far easier than hex or `rgb()`.

**Optimistic update.** Showing the result of an action immediately and reconciling with the server
afterwards. Suitable only where failure is rare and cheap.

**Passkey.** A sign-in credential held as a private key on the user's device and unlocked by biometrics or
a device PIN. Nothing to remember, nothing to phish.

**Popover.** An HTML attribute giving an element correct top-layer stacking and light dismissal, used for
menus, dropdowns, and (with `popover=hint`) tooltips.

**`prefers-color-scheme`.** A media feature reporting whether the user's system is set to light or dark.

**`prefers-reduced-motion`.** A media feature reporting that the user has asked for less animation, often
because motion causes nausea, dizziness, or migraine.

**Primitive token.** A raw value in a token system, for example `green.600`. Never referenced directly by
product code.

**Progressive disclosure.** Showing the common path first and putting the rest one deliberate, visible step
away. Different from hiding.

**Provenance.** The record of where a piece of information came from. In AI interfaces, the sources behind
an answer.

**`rem`.** A CSS unit equal to the root font size, so sizes expressed in it scale with the user's browser
text setting.

**Response-time limits.** Nielsen's three thresholds: 0.1 s feels instant, 1 s keeps a train of thought,
10 s is the limit of held attention.

**Safe area inset.** The `env(safe-area-inset-*)` values describing space taken by notches, rounded
corners, and home indicators.

**Screen reader.** Software that announces interface content as speech or braille and provides navigation by
heading, landmark, link, or form control.

**Scroll-driven animation.** An animation whose progress is tied to scroll position rather than time,
running off the main thread.

**Scroll-state query.** A CSS rule responding to whether an element is scrollable, stuck to an edge, or
snapped, which replaces a scroll event listener.

**Semantic token.** A token named for its role, for example `color.action.background`, which references a
primitive. The only layer a theme needs to rebind.

**Skeleton screen.** A placeholder showing the shape of content that is loading, appropriate when the
layout is known and the wait is roughly one to ten seconds.

**Skip link.** A link at the top of a page that jumps past navigation to the main content. Detectable on
about 24% of pages in the July 2025 crawl.

**`@starting-style`.** A CSS rule defining the state an element animates from the first time it appears,
which is what makes dialogs and popovers animate in.

**Streaming.** Rendering model output as it is generated instead of waiting for the whole response.

**Style query.** A CSS rule that styles descendants based on a custom property's value on an ancestor,
enabling variants without extra classes.

**Subgrid.** A CSS Grid feature letting a nested grid use its parent's tracks, so content aligns across
sibling components.

**Success criterion.** A single testable requirement in WCAG, assigned Level A, AA, or AAA.

**SUS (System Usability Scale).** A ten-item questionnaire producing a 0 to 100 score. The average is 68,
which is the 50th percentile and not a percentage.

**Target size.** The clickable or tappable area of a control. WCAG 2.2 requires at least 24 by 24 CSS pixels
at Level AA, with a spacing exception.

**`text-wrap: balance` and `pretty`.** CSS values that even out line lengths in headings and improve the
last lines of paragraphs respectively.

**Third-party script.** Code loaded from another organisation's domain. The most common cause of
unbudgeted page weight and main-thread blocking.

**Top layer.** The browser-managed stacking context above the whole page, used by `<dialog>` and popovers,
which is why they need no `z-index`.

**View transition.** A platform feature that animates between two states of a page, or between two page
navigations, without hand-written keyframes.

**WCAG (Web Content Accessibility Guidelines).** The W3C accessibility standard that nearly every
accessibility law references. Current version 2.2, with the latest revision dated 12 December 2024.

**Web Almanac.** The HTTP Archive's annual report analysing millions of real websites. The 2025 edition
covers a July 2025 crawl of about 16.2 million sites.

**WebAIM Million.** WebAIM's annual automated accessibility analysis of the top one million home pages.
The February 2026 edition found detected failures on 95.9% of pages.

**Widely available.** The Baseline label meaning a feature has been in all major browser engines for about
30 months, so it needs no fallback.

Terms defined: 86.

---

<!-- 11archive-source: 14-methodology-and-sources.md -->

# 14. Methodology, sources, and limitations

## How this report was built

1. **Framing.** Audience, objective, scope, and exclusions were fixed first and are stated in
   README.md. The scope deliberately excludes anything that ranks tools or products, because
   those rankings change faster than a report can.
2. **Collection.** Web search and direct page retrieval on 2026-08-11, working outward from primary
   sources: specification text, standards bodies, regulator publications, browser vendor documentation,
   and large-sample crawls. Secondary and vendor sources were used only where no primary equivalent
   exists, and are labelled as such below.
3. **Verification of contested facts.** Where a search summary and a primary source disagreed, the primary
   source won and the discrepancy was recorded. Two examples: a secondary article dated an acquisition to
   2025 when the primary announcement is 2022, and another reported a repository at 75,000 stars against
   121,100 read directly from the repository.
4. **Modelling.** The evidence was structured into `data.json` around this report's subject: rules with
   levels and sources, numeric thresholds with units, platform features with availability status,
   regulations with dates, failure modes with fixes, and sources with confidence.
5. **Writing.** Each section leads with what changes a decision, then the evidence, then the limits. Every
   material number carries its source and, where relevant, its date and population.
6. **Rendering.** `report.html` is a self-contained page carrying the same facts, order, and terminology as
   the Markdown. It adds sorting, row highlighting, and column resizing, and adds no information.

## Evidence states used

| State | Meaning in this report |
| --- | --- |
| Specified | Stated in a specification or standard. Not an estimate |
| Regulatory | Stated in law, a final rule, or an official publication |
| Measured | From a disclosed large-sample measurement, with method published |
| Vendor-reported | Published by a party with an interest in the result, with method partly disclosed |
| Secondary | Reported by a third party without access to the underlying method |
| Excluded | Encountered but not used, with a reason given below |

## Confidence, and how to read the numbers

| Confidence | Applies to | Example |
| --- | --- | --- |
| High | Specification text, thresholds, regulatory dates, and figures from disclosed large-sample crawls | The 4.5:1 contrast ratio; the 28 June 2025 EAA date; 95.9% of home pages with detected failures |
| Medium | Browser availability status, which changes monthly; vendor-published research | `contrast-color()` support; the Material 3 Expressive study figures |
| Low | Market and adoption statistics from interested parties; litigation counts where trackers disagree | Passkey adoption percentages; US accessibility lawsuit totals |

Anything at low confidence is labelled in the body text where it appears. Do not quote a low-confidence
figure without its source and its caveat.

## Sources

Grouped by type. All retrieved 2026-08-11.

### Specifications and standards

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S1 | W3C, Web Content Accessibility Guidelines (WCAG) 2.2, `w3.org/TR/WCAG22/` | Principles, levels, the nine new criteria, the 4.1.1 removal, revision date | Specified |
| S2 | W3C, Understanding SC 1.4.3 Contrast (Minimum) | Exact ratios, large-text definition, exceptions, comparison with 1.4.6 and 1.4.11 | Specified |
| S3 | W3C, Understanding SC 2.3.3 Animation from Interactions | Motion disable requirement | Specified |
| S4 | W3C WAI, ARIA Authoring Practices Guide, `w3.org/WAI/ARIA/apg/` | What the APG contains, patterns and practices | Specified |
| S5 | W3C ARIA specification and community guidance, via the APG "Read Me First" practice | First rule of ARIA: no ARIA is better than bad ARIA | Specified |
| S6 | Design Tokens Community Group, Format Module 2025.10, `designtokens.org/tr/drafts/format/` | Token file format, properties, types, aliases, groups, `$extends` | Specified |
| S7 | Design Tokens Community Group announcement, 28 October 2025, `w3.org/community/design-tokens/` | First stable version date and positioning | Specified |
| S8 | W3C, CSS Logical Properties and Values Module Level 1 | Logical property names and behaviour | Specified |
| S9 | WCAG 2.2 success criteria 2.5.5, 2.5.7, 2.5.8, 2.4.11, 2.4.13, 3.2.6, 3.3.7, 3.3.8, 3.3.9, 1.3.5, 1.4.4, 2.2.2, 2.5.1 | Individual requirements cited throughout | Specified |

### Regulation

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S10 | European Accessibility Act, application date 28 June 2025, and EN 301 549 as the presumed-compliance standard | EU obligation, standard referenced, extraterritorial reach | Regulatory |
| S11 | US Federal Register, ADA Title II final rule, 24 April 2024 | Requirement of WCAG 2.1 AA for state and local government | Regulatory |
| S12 | US Federal Register, extension of ADA Title II compliance dates, published 20 April 2026 | New deadlines: 26 April 2027 and 26 April 2028 | Regulatory |
| S13 | US Federal Trade Commission Negative Option Rule ("click to cancel"), finalised 2024, vacated by a federal appeals court in 2025 | Status of the rule and continued enforcement under existing authority | Regulatory |
| S14 | European Commission 2030 Consumer Agenda, adopted 19 November 2025, and the Digital Fairness Act plan | Planned EU instrument on manipulative and addictive design, proposal expected late 2026 | Regulatory |
| S15 | European Parliament research briefing on regulating dark patterns towards digital fairness (2025) | Scope of the dark patterns problem in EU policy | Regulatory |

### Large-sample measurement

| # | Source | Population and date | Used for | State |
| --- | --- | --- | --- | --- |
| S16 | WebAIM Million, February 2026 | 1,000,000 home pages, Tranco ranking | Failure rates, failures per page, the ARIA correlation | Measured |
| S17 | WebAIM Million, 2025 edition | Same population, 2025 | Year-over-year comparison | Measured |
| S18 | HTTP Archive Web Almanac 2025, Accessibility chapter | July 2025 crawl, about 16.2 million sites, Lighthouse with axe-core | Contrast pass rate, labels, focus outlines, preference media features, zoom blocking, skip links, overlays | Measured |
| S19 | HTTP Archive Web Almanac 2025, Performance chapter | Same crawl, plus CrUX field data | Core Web Vitals pass rates, LCP element composition, `fetchpriority` adoption, field versus lab tension | Measured |
| S20 | HTTP Archive Web Almanac 2025, Page Weight chapter | Same crawl | Median and 90th percentile weights, resource breakdown, ten-year growth, unused JavaScript | Measured |
| S21 | HTTP Archive Web Almanac 2025, Generative AI chapter | About 12.9 million sites | Built-in AI API adoption, `llms.txt`, `robots.txt` AI directives, WebAssembly and WebGPU growth | Measured |
| S22 | HTTP Archive Web Almanac 2025, index and methodology | July 2025, 16.2 million sites, 244 TB processed | Sample size and chapter list | Measured |
| S23 | State of CSS 2025 survey | Self-selected developer survey | Feature sentiment and pain points, used qualitatively only | Secondary |

### Browser platform and availability

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S24 | web.dev, "Interop 2026" announcement | The 20 focus areas, participants, purpose | Specified |
| S25 | WebKit and Mozilla Interop 2026 announcements | Cross-checking the focus area list and Safari-first features | Specified |
| S26 | chrome.dev, "CSS Wrapped 2025" | 2025 feature set: invoker commands, dialog light dismiss, `popover=hint`, customizable select, scroll markers, `interestfor`, scroll-state queries, `moveBefore()`, `shape()`, `if()`, `@function`, `corner-shape`, `text-box` | Specified |
| S27 | Chrome for Developers, "What's new in web UI" (Google I/O 2026) | Chrome 146, 147, and 150 features; view transition variants; scroll-triggered animations | Specified |
| S28 | MDN Web Docs, `light-dark()` and `contrast-color()` | Function behaviour and support notes | Specified |
| S29 | web.dev, "Interaction to Next Paint (INP)" | Definition, measurement, percentile, thresholds, the three interaction phases | Specified |
| S30 | Baseline definitions as used by web.dev and MDN | Limited, newly available, widely available | Specified |
| S31 | una.im, "Modern CSS theming with light-dark(), contrast-color(), and style queries" | Reported stable-in-all-engines status as of May 2026 | Secondary |

### Human factors and research method

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S32 | Nielsen Norman Group, "10 Usability Heuristics for User Interface Design", 1994, revised 2020 | The ten heuristics and their wording | Specified |
| S33 | Nielsen Norman Group, "Response Time Limits", from *Usability Engineering* (1993) | The 0.1 s, 1 s, and 10 s limits | Specified |
| S34 | Fitts (1954); Fitts and Peterson (1964) | Fitts's law and its origin | Specified |
| S35 | Hick (1952); Hyman (1953); Card, Moran and Newell (1983) | Hick's law and its introduction to interface design | Specified |
| S36 | Nielsen, "Why You Only Need to Test with 5 Users" (2000), on the Nielsen and Landauer model (1993) | The formula, the 31% discovery rate, the run-more-smaller-tests conclusion | Specified |
| S37 | Springer, "Benefits of increased sample sizes in usability testing" | Sample variance: 55% to 99% coverage from different sets of five; 80% at ten; 95% at twenty | Measured |
| S38 | Sauro, System Usability Scale meta-analysis of about 5,000 scores across 500 studies; Sauro and Lewis (2016) curved grading from 241 studies | The 68 average, the percentile interpretation, the grading curve | Measured |
| S39 | Rodden, Hutchinson and Fu (Google), HEART framework and the Goals-Signals-Metrics process | Metric selection method | Specified |
| S40 | Bringhurst, *The Elements of Typographic Style*; Tinker and Paterson eye-movement studies | The 45 to 75 character line length range and its basis | Secondary |
| S41 | Miller (1956), on short-term memory for unrelated items | Why "seven plus or minus two" does not apply to menus | Specified |

### AI interface design

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S42 | Amershi et al., "Guidelines for Human-AI Interaction", CHI 2019; Microsoft HAX Toolkit design library | All 18 guidelines, the four phases, the validation with 49 practitioners against 20 products | Specified |
| S43 | Google PAIR, People + AI Guidebook, and its generative AI update | Six chapters, mental models, explainability, feedback and control, graceful failure | Specified |
| S44 | Vendor articles on streaming UI, time to first token, and skeleton screens | Reviewed and excluded for numeric claims; see exclusions | Excluded |

### Platform design languages and component ecosystem

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S45 | Google Design, "Expressive Material Design" research article | 46 studies, 18,000+ participants, three years, eye tracking, up to four times faster recognition across 10 apps, 87% preference among 18 to 24 year olds, brand perception deltas | Vendor-reported |
| S46 | Apple developer material on Liquid Glass, WWDC 2025, plus design commentary | The material's introduction, the legibility criticism, the Reduce Transparency, Increase Contrast, and Reduce Motion settings | Vendor-reported and Secondary |
| S47 | shadcn/ui repository, `github.com/shadcn-ui/ui` | Self-description as a code distribution platform, 121.1k stars, built on unstyled primitives | Measured |
| S48 | WorkOS announcement of the Modulz acquisition, June 2022 | Radix Primitives ownership | Vendor-reported |
| S49 | Base UI release information, v1.0.0, December 2025 | The actively maintained primitives alternative | Vendor-reported |
| S50 | Apple Human Interface Guidelines (44 pt) and Material Design guidance (48 dp) | Platform target size minimums | Specified |

### Adoption, market, and litigation figures

| # | Source | Used for | State |
| --- | --- | --- | --- |
| S51 | FIDO Alliance, World Passkey Day 2026 report; surveys by Sapio Research, April 2026, 11,000 consumers in ten countries | Passkey adoption figures | Vendor-reported |
| S52 | Baymard Institute checkout usability research | Form field usability failures, multicolumn layouts, card expiry entry, unexplained phone requirement | Secondary |
| S53 | UsableNet, EcomBack, ADA Title III blog, and other litigation trackers | US accessibility lawsuit counts for 2025, which disagree | Secondary |
| S54 | Cookie consent research: EEA accept/reject button prevalence 2018 to 2024; CNIL 2025 formal notices; Austrian Supreme Court parity ruling; top 10,000 EU site compliance study; etracker consent rate study | Consent banner practice and enforcement | Secondary |
| S55 | Reports of FTC settlements: Amazon, September 2025; Care.com, 2025 | Enforcement consequence figures | Secondary |

Source count: 55.

## Conflicts recorded

| Conflict | Resolution |
| --- | --- |
| Radix ownership dated to 2025 by a secondary article, 2022 by the primary announcement | Used 2022 |
| shadcn/ui reported at 75,000 stars by a secondary article, 121,100 in the repository | Used the repository figure, with its read date |
| US accessibility lawsuit counts for 2025: over 5,000, 3,117 federal, and 8,667 across all courts from three trackers | Reported the range and the methodological cause. No single figure adopted |
| Web Almanac 2025 median desktop JavaScript given as 697 KB in the resource table and about 708 KB in the narrative | Reported both, and noted that medians of different groupings need not agree |
| CLS is better on mobile (81% good) than desktop (72%) in the 2025 data, which is counter-intuitive | Reported as measured, without an explanation the source does not give |
| WCAG 2.2 publication date: the specification page carries 12 December 2024 as its current revision, while the original Recommendation is widely dated to October 2023 | Cited the revision date from the specification page only |

## What was excluded, and why

- **Numeric claims about streaming and skeleton screens.** Figures such as "perceived wait drops 55% to
  70%" and "skeletons feel 40% faster" appear in several vendor articles with no sample size, no method,
  and no citation to an underlying study. The direction is supported by the classic response-time
  literature; the numbers are not verifiable and are not used.
- **Design system adoption percentages** such as "70% growth in headless adoption" and "73% of businesses
  adopting headless architecture". No method or population is given by the publishing vendors.
- **Tokens-per-second thresholds for AI interfaces** ("100 TPS feels normal"). Sourced only to vendor
  blogs, and dependent on content type and renderer.
- **Any product or tool ranking.** Out of scope by design.
- **Figma, Sketch, and other design tool feature comparisons.** Out of scope, and they change monthly.
- **Reported plans for a future Liquid Glass opacity slider in iOS 27.** Single secondary source, so
  mentioned in 04 only as reported, not as fact.
- **Private or client data.** None was consulted. Every figure in this report is from a public source.

## Known limitations

1. **Automated accessibility data is a floor.** Scanners detect roughly a third of real problems, so the
   WebAIM and Web Almanac figures understate the true failure rate. They are still the best available
   population-scale evidence.
2. **Home pages are not applications.** WebAIM measures home pages. Signed-in application screens, which
   is where most complex interaction lives, are not represented in either crawl.
3. **Browser availability moves monthly.** Every feature status in this report is as of 2026-08-11. Check
   current support before shipping without a fallback, especially for anything listed as an Interop 2026
   focus area.
4. **Survey-based figures are self-selected.** The State of CSS survey and the FIDO consumer surveys draw
   from populations that are not representative of all developers or all consumers.
5. **Vendor research on its own design system is not independent.** The Material 3 Expressive figures are
   reported by the team that built it. The mechanism is plausible and the study scale is large; the effect
   sizes should be treated as vendor-reported.
6. **US litigation counts are not reconcilable** across trackers, as recorded above.
7. **No usability testing was conducted for this report.** It synthesises published evidence. Every
   threshold here still needs validation against your own users and content.
8. **Mobile app specifics are thin.** The report covers web mechanisms in depth and native platform
   guidance only where it sets a numeric standard, such as target sizes.
9. **Coverage of spatial, voice, and automotive interfaces is out of scope**, and those contexts change
   several of the thresholds here.

## Reproducing the work

Every source above is public and can be retrieved directly. The crawl-based figures (S16 to S22) are
recomputable from the published datasets: HTTP Archive publishes its tables in BigQuery, and WebAIM
publishes its methodology and per-year archives. The specification and regulatory facts (S1 to S15) are
stable text at fixed URLs. The availability statuses (S24 to S31) are the ones that will age fastest.
