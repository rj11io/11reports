<!-- 11archive-source: README.md -->

# Market Intelligence: A Working Handbook

Market intelligence is the work of answering a business question about the world
outside your company, using evidence you collected on purpose.

A concrete example. A pricing team asks: "can we raise list price 8% in January
without losing enterprise renewals?" Market intelligence is everything that
answers it. What competitors charge today. What buyers said in the last twenty
lost deals. What input costs did. What a regulator allows. The answer arrives as
a judgment with a confidence level attached, not as a folder of links.

This handbook covers the whole discipline: what it is, how the work runs, where
the evidence comes from, how to analyse it, what to publish, how to staff it,
what the law allows, and what changed once research agents arrived.

Research date: 11 August 2026. Every figure carries its period and source.

## Contents

1. Foundations and scope
2. The cycle: from question to decision
3. Sources and collection
4. Analysis and judgment
5. Products and cadence
6. Operating model
7. Law and ethics
8. What changed by 2026
9. Build guide: first 90 days
10. Glossary
11. Sources

Companion artifacts (file names, not links, so they resolve in every view):

- `report.html` is the standalone reading version of all nine chapters, with a
  searchable glossary.
- `data.json` holds every quantitative claim in the report as a checkable
  record: value, period, source, and confidence.
- `verify.mjs` checks that the HTML, the chapters, and the data file agree. Run
  it with `node verify.mjs` from the source folder.

## Core model

```text
Decision needed
    -> intelligence question (KIT/KIQ)
    -> collection plan
    -> collection from ranked sources
    -> evaluation of source and content
    -> analysis and judgment with confidence
    -> product delivered to the decider before the decision date
    -> decision taken
    -> outcome recorded and questions refined
```

The loop is the point. A market intelligence team that never closes it produces
reading material, not intelligence.

## Three claims this handbook defends

1. **Intelligence starts with a decision, not a data source.** If you cannot
   name the decision, the person making it, and the date, you are doing
   monitoring. Programs that fail almost always fail here first. See
   chapter 2.

2. **How you obtained something matters more than what it is.** Public price
   lists, reverse engineering, and honest interviews are lawful nearly
   everywhere. Impersonation, logged-in scraping, and pooled non-public
   competitor pricing are not. See chapter 7.

3. **Speed got cheap in 2025 and 2026; verification did not.** Research agents
   read 500 million documents in minutes, and they still miscite. The scarce
   skill moved from finding things to deciding what is true. See
   chapter 8.

## Scope and limits

- Covers business and investment market intelligence. Government and military
  intelligence doctrine appears only where it supplies a usable standard, mostly
  around uncertainty language and sourcing.
- Written from open sources. No proprietary vendor data, no client work.
- Vendor surveys are marked as such. They are self-reported, run by companies
  selling the thing they measure, and they show correlation, not cause.
- Sister collection: `2026/rnd/intel-reports-structure` covers the anatomy of
  intelligence reports themselves. This collection covers the market subject.

---

<!-- 11archive-source: 01-foundations-and-scope.md -->

# 1. Foundations and Scope

## Working definition

**Market intelligence is the collection and analysis of information about the
world outside a company, done to answer a defined question and support a
decision.**

Break that into four testable parts:

| Part | Test |
| --- | --- |
| **Outside the company** | The subject is a market, a buyer, a rival, a supplier, a regulator, or a technology. Not your own funnel. |
| **Collected on purpose** | Someone wrote down what needed answering before collection started. |
| **Analysed** | A person or model integrated the pieces and reached a judgment. A link list is not analysis. |
| **Tied to a decision** | A named person will act differently depending on the answer, by a known date. |

If a piece of work fails the fourth test, it is monitoring. Monitoring is useful,
and it is cheaper than intelligence. Call it what it is.

## The neighbouring disciplines

The terms overlap and vendors use them loosely. Pick definitions, write them
down, and stop arguing.

| Discipline | Looks at | Typical question | Typical output |
| --- | --- | --- | --- |
| **Market intelligence (MI)** | The whole external environment: demand, buyers, rivals, channels, suppliers, regulation, technology | "Is this market worth entering in 2027?" | Market map, sizing, entry assessment |
| **Competitive intelligence (CI)** | Named rivals: their capabilities, intentions, and weak points | "Will rival X move down-market?" | Competitor profile, battlecard, war game |
| **Business intelligence (BI)** | Your own operations and history | "Which segment churned last quarter and why?" | Dashboard, cohort report |
| **Market research** | Buyer attitudes and behaviour, usually measured with primary methods | "Would buyers pay 8% more for feature Y?" | Survey, conjoint study, focus group |
| **Strategic foresight** | Plausible futures over long horizons | "What breaks our model by 2032?" | Scenarios, wind-tunnelled strategy |

Two practical distinctions do most of the work:

- **Direction.** BI points inward. Everything else points outward.
- **Width.** CI narrows to named rivals. MI covers the whole board, including
  rivals who do not exist yet.

The clearest available framing in the trade literature is that market
intelligence gives the wide view of the external environment while competitive
intelligence gives a narrower and deeper read on specific competitors'
capabilities, vulnerabilities, and intentions. See
[Market Logic][ml-mi-vs-ci] and the
[Competitive Intelligence Alliance][cia-ci-vs-mi].

## What market intelligence is not

- **Not a feed.** A stream of competitor news with no judgment attached is raw
  reporting. It transfers the analytic burden to the reader, who has less time
  and less context than you.
- **Not a dashboard.** Dashboards answer "what is happening" for metrics you
  already chose. Intelligence answers "what does it mean and what should we do",
  including for things nobody instrumented.
- **Not market research alone.** Research is one collection method among many.
  A market intelligence function that only runs surveys is a research function.
- **Not a library.** A well-documented failure pattern: collection without
  analysis turns the analyst into a librarian. See
  [Product Marketing Alliance][pma-fail].

## Short history

| Year | Event | Why it matters |
| --- | --- | --- |
| 1980 | Michael Porter publishes *Competitive Strategy* | Gives industry analysis a shared vocabulary and makes structured competitor analysis a board-level topic |
| 1982 | Motorola creates the first corporate competitive intelligence function, founded by Jan Herring, a former US intelligence officer | Transfers government tradecraft into a corporation, including the requirements-first habit |
| 1986 | The Society of Competitor Intelligence Professionals is founded in Washington DC | Creates a profession with training and a code of ethics |
| 1994 to 2009 | Ben Gilad publishes *Business Blindspots* (1994), *Early Warning* (2004), and *Business War Games* (2009) | Shifts attention from collection to the failure of management to act on what is already known |
| 2006 | The HP pretexting scandal | Sets the hard ethical line in public and produces new US law on phone records |
| 2016 | US Defend Trade Secrets Act and EU Directive 2016/943 both take effect | Harmonises what counts as lawful acquisition on both sides of the Atlantic |
| 2019 to 2024 | hiQ v LinkedIn, then Meta v Bright Data | Establishes that scraping public, logged-out pages is broadly defensible in the US |
| 2025 to 2026 | Research agents ship at scale; EDPB publishes scraping guidelines; DOJ settles RealPage | Speed becomes cheap, and the legal perimeter around data gets drawn more sharply |

SCIP has been renamed twice: to Strategic and Competitive Intelligence
Professionals, then in April 2023 to the Strategic Consortium of Intelligence
Professionals. See [Wikipedia, Competitive intelligence][wiki-ci] and
[PR Newswire][prn-scip]. Jan Herring's role at Motorola and Leonard Fuld's
*Competitor Intelligence* are recorded in the same sources and in the
[Fuld-Gilad-Herring Academy][wiki-acci] entry.

## How big the surrounding industry is

These figures size the supply side, meaning the firms that sell evidence and
analysis. They are not the size of "market intelligence" as an internal
function, which nobody measures credibly.

| Measure | Value | Period | Source |
| --- | --- | --- | --- |
| Global insights industry turnover | US$153bn | 2024 | [ESOMAR via Research World][rw-153] |
| Expected insights industry turnover | Above US$160bn | 2025 | [ESOMAR via Research World][rw-153] |
| Market research sector within that | US$56bn, growing 4.8% | 2024 | [ESOMAR via Research World][rw-153] |
| Research software sector | US$62bn, growing 11.5% | 2024 | [ESOMAR via Research World][rw-153] |
| Reporting sector | US$35bn, growing 8% | 2024 | [ESOMAR via Research World][rw-153] |
| Buy-side spend on alternative data | US$2.8bn, up 17% year on year | 2025 | [Neudata][neu-2026] |
| Alternative datasets tracked by Neudata | 2,805, up from 2,215 | 2025 vs 2024 | [Neudata][neu-2026] |

Read the growth split, not the totals. Software and reporting grew roughly two
to three times faster than classic research services. Money is moving from
bespoke studies toward continuous, machine-readable evidence. That is the single
most useful fact in this table.

A warning about the wider "alternative data market size" numbers you will find
online. Published estimates for 2025 range from US$4.6bn to US$19.4bn depending
on the firm, because each draws the category boundary somewhere different. When
estimates differ by four times, treat all of them as unusable for planning and
use the buy-side spend figure instead, which measures actual purchases.

## Choosing scope before you start

Four choices, made in writing, before any collection:

1. **Subject.** A market, a segment, a rival, a technology, a geography, a
   counterparty. Name it precisely. "Fintech" is not a subject. "Embedded
   payment processing for European B2B marketplaces" is.
2. **Angle.** Entry, defence, pricing, acquisition, partnership, risk, hiring.
   The angle decides which evidence counts.
3. **Decision.** Who decides, what they decide, and when. Write the date.
4. **Budget.** Time, money, and curiosity. A two-day answer and a six-week
   answer are different products, not the same product at different quality.

Skipping step three is the most common and most expensive mistake in the
discipline. Programs whose objectives are unclear generate work nobody uses. See
[Contify][contify-problems] and [Product Marketing Alliance][pma-fail].

---

[ml-mi-vs-ci]: https://marketlogicsoftware.com/blog/market-intelligence-vs-competitive-intelligence/
[cia-ci-vs-mi]: https://www.competitiveintelligencealliance.io/competitive-intelligence-vs-market-intelligence/
[pma-fail]: https://www.productmarketingalliance.com/why-competitive-intelligence-programs-fail-and-what-to-do-about-it/
[contify-problems]: https://www.contify.com/resources/blog/3-common-mci-problems-and-their-solutions/
[wiki-ci]: https://en.wikipedia.org/wiki/Competitive_intelligence
[wiki-acci]: https://en.wikipedia.org/wiki/Fuld-Gilad-Herring_Academy_of_Competitive_Intelligence
[prn-scip]: https://www.prnewswire.com/news-releases/scip-changes-name-to-strategic-and-competitive-intelligence-professionals-100524874.html
[rw-153]: https://researchworld.com/articles/inside-the-153bn-insights-industry
[neu-2026]: https://www.neudata.co/blog/state-of-the-alternative-data-market-2026

---

<!-- 11archive-source: 02-the-cycle.md -->

# 2. The Cycle: From Question to Decision

## The loop

```text
1. Direction     Which decision needs help, by when, and what would change it
2. Planning      Which questions to answer, from which sources, at what cost
3. Collection    Get the material
4. Evaluation    Grade the source and grade the content, separately
5. Analysis      Integrate, test explanations, reach a judgment
6. Production    Write the product for the decider, not for the analyst
7. Delivery      Put it in front of the decider before the decision date
8. Feedback      Record what was decided and what actually happened
```

Two rules make this real rather than decorative.

**Stage 1 owns the whole cycle.** The quality ceiling of a piece of intelligence
is set at direction. No amount of collection rescues a badly framed question.

**Stage 8 is not optional.** If you never record outcomes, you never learn
whether your judgments are any good, and you cannot improve your calibration.
Most corporate programs skip it.

## Direction: turning a decision into questions

The standard instrument is the KIT and KIQ pair.

- A **Key Intelligence Topic (KIT)** is a broad area the leadership needs
  covered, tied to a decision or a risk.
- A **Key Intelligence Question (KIQ)** is one specific, answerable question
  underneath a KIT. Answer enough KIQs and the KIT is covered. See
  [the MAP Newsletter][map-kit].

Jan Herring's original framing sorts KITs into three kinds, and the sort matters
because each kind needs different collection:

| KIT type | Purpose | Example | Collection style |
| --- | --- | --- | --- |
| **Strategic decisions and issues** | Support a specific pending decision | "Should we enter Brazil in 2027?" | Project. Deep, time-boxed, ends |
| **Early warning** | Detect a threat before it lands | "Will our top rival cut price in mid-market?" | Continuous. Tripwires and indicators |
| **Key players** | Understand a rival, buyer, supplier, or regulator in the round | "How does rival X actually decide on pricing?" | Continuous. Profile maintained over time |

### Writing a good KIQ

A good KIQ is falsifiable, bounded in time, and answerable with obtainable
evidence.

| Bad KIQ | Why it fails | Better KIQ |
| --- | --- | --- |
| "What is our competitor up to?" | Not answerable, no boundary | "Has rival X hired mid-market sales staff in DACH since January 2026?" |
| "Is the market growing?" | No definition of market or period | "Did EU seats for category Y grow more than 12% in the year to Q2 2026?" |
| "Will AI disrupt us?" | No decision attached | "Which of our top five deal-losses in H1 2026 named an AI-native alternative?" |

### The decision header

Put this at the top of every intelligence request, before any work starts:

```text
Decision:      Raise enterprise list price 8% effective 1 January 2027
Decider:       VP Pricing, with CFO sign-off
Decision date: 15 October 2026
Delivery date: 26 September 2026
Would change the decision:
  - Two or more of the top four rivals hold price flat through Q4
  - Renewal cohort survey shows above 20% churn intent at +8%
  - Input cost index falls more than 5% by September
```

The last block is the most valuable. It defines, in advance, what evidence would
flip the answer. It stops the analyst chasing everything and it stops the
decider dismissing the finding after the fact.

## Planning: the collection plan

One table, one page. Never start collection without it.

| KIQ | Indicator to look for | Source | Method | Cost | Owner | Due |
| --- | --- | --- | --- | --- | --- | --- |
| Has rival X moved down-market? | Job ads for SMB or mid-market roles | Rival careers page, job boards | Weekly scrape | Low | Analyst A | Continuous |
| Has rival X moved down-market? | New pricing tier below current entry | Rival pricing page | Daily diff | Low | Automated | Continuous |
| Has rival X moved down-market? | Partner or reseller signings in that band | Trade press, partner directories | Weekly review | Low | Analyst A | Continuous |
| Would buyers accept +8%? | Stated churn intent at +8% | Renewal cohort, n=120 | Survey | Medium | Research vendor | 12 Sep |
| Would buyers accept +8%? | Realised discount trend | Internal CRM | Query | Low | RevOps | 5 Sep |

Notice that the first KIQ has three independent indicators. That is deliberate.
See the triangulation rule in chapter 3.

## Evaluation: grade source and content separately

A reliable source can pass on a false claim. An unreliable source can be right.
Grade the two independently. The Admiralty-style scale used in intelligence
work is a good default because it is simple and it forces the separation:

| Source reliability | Meaning |
| --- | --- |
| A | Reliable. Proven history, no known failures |
| B | Usually reliable. Minor doubts |
| C | Fairly reliable. Some doubts |
| D | Not usually reliable. Significant doubt |
| E | Unreliable. History of being wrong |
| F | Cannot be judged |

| Information credibility | Meaning |
| --- | --- |
| 1 | Confirmed by other independent sources |
| 2 | Probably true. Consistent with other information |
| 3 | Possibly true. Reasonably consistent |
| 4 | Doubtful. Not confirmed, some inconsistency |
| 5 | Improbable. Contradicted by other information |
| 6 | Cannot be judged |

A rival's published price list is A1. A reseller's claim about that rival's
unpublished discounting is C3 until a second, unrelated source supports it.

## Analysis and production

Covered in chapter 4 and
chapter 5. The one rule that belongs here: the
product is written for the decider's decision, in the decider's time budget. An
excellent analysis delivered as a 40-page deck to someone with nine minutes is a
failed product.

## Feedback: closing the loop

Record four things after every decision the intelligence touched:

1. What we judged, and at what confidence.
2. What was decided.
3. What actually happened, checked at a set date.
4. Which evidence turned out to be load-bearing, and which was noise.

Keep this in one file per KIT. After a year it becomes the most valuable asset
the function owns, because it tells you which of your sources and which of your
analysts are actually calibrated. See
chapter 4 on calibration.

## Where the cycle breaks

| Break | Symptom | Fix |
| --- | --- | --- |
| No decision named | Reports read as newsletters. Nobody asks follow-ups | Refuse requests without a decision header |
| Collection without analysis | Volume rises, judgments stay absent. The analyst becomes a librarian ([PMA][pma-fail]) | Cap collection time at 50% of project hours |
| Analysis without delivery | Good work sits in a drive. Forrester-cited figure: over 90% of customer intelligence becomes unfindable within 90 days ([via PMA][pma-fail], vendor-cited) | Push, do not publish. Named recipient, dated |
| No feedback | The same wrong assumptions recur | Quarterly review of judgments against outcomes |
| Unclear stakeholders | Products serve nobody in particular | One named consumer per recurring product ([Contify][contify-problems]) |
| Paralysis by analysis | Detailed reports, no recommendation | Force a judgment and a confidence level in every product ([Kompyte][kompyte-pitfalls]) |

## Cadence evidence

Frequency correlates strongly with impact in the field's longest-running
benchmark survey. In Crayon's 2026 State of Competitive Intelligence, 56% of
teams share intelligence with sales weekly or faster, and 79% of teams sharing
weekly report revenue impact against 41% of teams on a monthly or slower cadence.
See [Crayon 2026][crayon-2026].

Caveats worth stating every time you cite this: it is a vendor survey of
self-selected respondents, the outcome is self-reported, and the direction of
causation is unproven. Teams that are already good at this probably also publish
more often. Use it as a prior, not as proof.

---

[map-kit]: https://www.ismpp-newsletter.com/2019/11/13/converting-insight-to-action-key-aspects-of-competitive-intelligence-for-strategic-planning/
[pma-fail]: https://www.productmarketingalliance.com/why-competitive-intelligence-programs-fail-and-what-to-do-about-it/
[contify-problems]: https://www.contify.com/resources/blog/3-common-mci-problems-and-their-solutions/
[kompyte-pitfalls]: https://www.kompyte.com/blog/top-ci-pitfalls-to-avoid/
[crayon-2026]: https://www.crayon.co/state-of-competitive-intelligence-2026

---

<!-- 11archive-source: 03-sources-and-collection.md -->

# 3. Sources and Collection

## The source ladder

Rank sources by cost, delay, reliability, and legal risk. Work down the ladder,
not up. Most teams reach for expensive primary research before they have read
the free filings.

| Tier | Source class | Examples | Cost | Delay | Reliability | Legal risk |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Official statistics | Eurostat, US Census, BLS, OECD, World Bank, UN Comtrade | Free | Weeks to years | High for aggregates, poor for niches | None |
| 2 | Mandatory filings | SEC EDGAR, Companies House, patent offices, court dockets, EU tenders, customs records | Free to low | Days to months | High, and legally attestable | None |
| 3 | Company-published | Pricing pages, docs, changelogs, job ads, earnings calls, investor decks | Free | Live | High for facts, biased for framing | Low if public and logged out |
| 4 | Trade press and news | Sector titles, local press, conference coverage | Low | Days | Mixed. Often recycles company claims | None |
| 5 | Syndicated and panel | Nielsen, Circana, Similarweb, Sensor Tower, Semrush | Medium to high | Days to weeks | Good for direction, weak on levels | Low |
| 6 | Alternative data | Card transactions, geolocation, satellite, web-scraped, app telemetry, job postings | High | Days | Varies wildly by dataset | Medium. Consent chain and MNPI |
| 7 | Primary research | Surveys, interviews, expert networks, win/loss, mystery shopping | High | Weeks | Highest if designed well | Medium. Disclosure and MNPI rules |
| 8 | Internal | CRM, sales call notes, support tickets, churn reasons, lost-deal codes | Near zero | Live | Underused, often the best evidence you own | None |

Tier 8 deserves a note. Most companies own a large, current, unexploited record
of what buyers said, in their CRM and support systems. It costs nothing, it is
specific to your market, and nobody else has it. Mine it before buying anything.

## Government and institutional sources worth knowing

| Source | Best for |
| --- | --- |
| [Eurostat](https://ec.europa.eu/eurostat) | EU economy, trade inside and outside the EU, regional and social data, from 1960 |
| [US Census Bureau](https://www.census.gov) | US demographics, business patterns, industry statistics |
| [US Bureau of Labor Statistics](https://www.bls.gov) | US employment, wages, prices, productivity |
| [UN Comtrade](https://comtrade.un.org) | Detailed import and export flows for roughly 200 countries |
| [OECD Data](https://data.oecd.org) | Cross-country comparables across many sectors |
| [World Bank Open Data](https://data.worldbank.org) | Development, macro, and country indicators |

Standard limits. Official statistics are late, coarse, and organised by codes
(NACE in Europe, NAICS in North America) that rarely match how a modern market
actually segments. Use them for denominators and for sanity checks, not for
product-level questions.

## Signals: what leading indicators actually tell you

A signal is an observable proxy for something you cannot see directly. Each one
has a real predictive claim and a real limit. Both belong in your notes.

| Signal | What it indicates | Evidence and limits |
| --- | --- | --- |
| **Job postings** | Hiring intent, and ahead of that, growth | Changes in postings are positively associated with growth in headcount, SG&A, and one-year-ahead sales and earnings ([LinkUp][linkup]). Limits: postings get reposted, agencies duplicate, and "ghost" ads distort counts. Coverage is deep, with Revelio's COSMOS set at over 5 billion postings from over 1 million company sites ([Revelio][revelio]) |
| **Pricing page changes** | Packaging and segment strategy, often weeks before the announcement | Cheap and high signal. Limits: A/B tests and regional variants produce false positives. Diff daily and require two consecutive weeks before acting |
| **Web traffic estimates** | Direction of demand and channel mix | Panel-based estimates scale a sample to the whole site. Accuracy varies hugely: one SparkToro comparison rated Similarweb closest to Google Analytics among the major tools, while an Omniconvert study of 1,787 ecommerce sites found Similarweb overreported sessions by roughly 94% ([Collaborator][collab], [Omniconvert][omni]). Accuracy improves with site size. Never use levels. Use direction and only for large sites |
| **App downloads and ranks** | Consumer traction | Good for direction on consumer apps. Useless for B2B and for anything sold through enterprise agreements |
| **Patent filings** | R&D direction, 18 months late | Applications publish roughly 18 months after filing, so this is a lagging read on intent. Useful for capability mapping, not for early warning |
| **Customs and shipping records** | Physical supply chains, supplier relationships | Strong for goods, blind for services and software |
| **Headcount by function** | Where a rival is placing bets | Derived from public profile data. Limits: profile data is self-reported and stale, and coverage skews to white-collar roles in rich countries |
| **Review sites and support forums** | Product weak points, switching triggers | Excellent qualitative source for battlecards. Heavily skewed toward extremes and vulnerable to seeded reviews |

## The triangulation rule

**Two sources that share one origin are one source.**

Three trade articles all restating one company press release is a single data
point wearing three hats. Real triangulation means two or more sources with
genuinely independent origins, ideally collected by different methods.

Worked example. Claim: "rival X is entering the mid-market."

| Evidence | Origin | Independent? |
| --- | --- | --- |
| Their blog post announcing "solutions for growing teams" | Rival X | Origin 1 |
| TechCrunch article about the blog post | Rival X | Same origin. Not independent |
| Analyst note quoting the announcement | Rival X | Same origin. Not independent |
| 14 new job ads for "SMB Account Executive" in DACH | Rival X hiring behaviour | Origin 2. Independent |
| Two of your resellers report being asked to carry a cheaper tier | Channel | Origin 3. Independent |

Three origins, not five sources. That claim is now well supported.

## Primary research and its 2026 data-quality problem

Primary research is still the only way to learn what buyers think rather than
what they did. It has become materially harder to do well.

| Finding | Figure | Source |
| --- | --- | --- |
| Share of raw survey responses containing some form of fraud | Roughly 31% | Research Defender, cited in [iMotions][imotions] |
| Average share of collected data discarded for quality and panel fraud | 38%, and up to 70% for some | Kantar, cited in [iMotions][imotions] |
| AI agents passing as human respondents | An agent evaded every detection method then in use | Westwood, PNAS, late 2025, cited in [iMotions][imotions] |

Practical defences, in order of effect:

1. **Use identity-verified panels** rather than open links when the answer
   matters. Cost per complete rises. Usable data per euro rises more.
2. **Instrument the survey.** Attention checks, instructed-response items,
   completion-time floors, duplicate and geolocation checks, bot scoring.
3. **Treat open-ended answers as suspect.** Machine-written open ends are fluent,
   generic, and increasingly common. Read a sample by hand, always.
4. **Prefer interviews for high-stakes questions.** Twenty structured interviews
   beat a compromised n=800 survey. See the win/loss volumes in
   chapter 5.
5. **Report your exclusion rate.** If you discarded 38% of responses, say so in
   the product. It changes how the reader should weigh the result.

The detection arms race has a second-order cost worth naming: aggressive bot
filters also remove real people who answer fast or oddly, which biases the
surviving sample in ways nobody has measured well.

## Expert networks

Paid calls with practitioners. The highest-signal source available during a
short diligence window, and the source with the most regulatory attention. See
chapter 7 for the compliance requirements.

Use them for:

- How a buying process actually runs inside a specific kind of company
- Why a technology failed in production despite the vendor claims
- What a departed employee can lawfully describe about an industry, not about
  their former employer's confidential information

Do not use them to obtain a specific company's non-public financial or
operational data. That is the exact fact pattern that produced the Primary
Global Research enforcement actions.

## Alternative data: buy with a checklist

The category grew to roughly US$2.8bn in buy-side spend in 2025, up 17% year on
year, across 2,805 tracked datasets ([Neudata][neudata]). Average clients per
dataset fell from 25 to 20, which means supply is growing faster than demand and
buyers have leverage on price.

Before buying any dataset, get written answers to these:

| Question | Why it matters |
| --- | --- |
| Where does the raw data originate, and who consented? | Determines your GDPR and privacy exposure |
| Is any of it non-public information about a specific issuer? | Determines your MNPI exposure |
| What is the panel or sample, and how is it scaled to the universe? | Determines whether levels or only direction are usable |
| What is the history, and has the methodology changed? | Backfills that were recomputed under a new method are not a real history |
| What is the reporting lag and the revision policy? | Decides whether it can support early warning at all |
| Coverage by geography, segment, and company size? | Most datasets are strong in the US and thin everywhere else |
| Exclusivity and redistribution terms? | Decides whether the edge survives contact with your competitors |

Ask the vendor for a period where their data was wrong, and what they changed.
A vendor with no answer has not looked.

## Collection hygiene

- **Date everything.** A figure without a period is not evidence.
- **Keep the raw artefact.** Screenshot the pricing page, save the filing PDF,
  archive the job ad. Pages change and disappear.
- **Record the retrieval date** alongside the publication date.
- **Never launder a source.** If the number came from a vendor blog quoting a
  survey, cite the vendor blog, not the survey you have not read.
- **Log what you looked for and did not find.** Absence of evidence is evidence
  and it belongs in the record.

---

[linkup]: https://www.linkup.com/use-cases/the-market-reaction-to-job-listing-data
[revelio]: https://www.reveliolabs.com/job-postings-cosmos
[collab]: https://collaborator.pro/blog/research-semrush-similarweb-ahrefs
[omni]: https://www.omniconvert.com/blog/we-analyzed-1787-ecommerce-websites-similarweb-google-analytics-thats-we-learned/
[imotions]: https://imotions.com/blog/insights/thought-leadership/fraud-in-online-surveys/
[neudata]: https://www.neudata.co/blog/state-of-the-alternative-data-market-2026

---

<!-- 11archive-source: 04-analysis-and-judgment.md -->

# 4. Analysis and Judgment

Analysis is the step where observations become a claim about what is true or
what will happen, with the uncertainty stated. Everything before it is
housekeeping.

## Frameworks: what each one is actually for

Frameworks are containers for thinking, not answers. Each is good at one thing
and blind to others. Choose by the question, and say out loud what the chosen
framework cannot see.

| Framework | Answers | Blind to |
| --- | --- | --- |
| **Porter's Five Forces** | Why this industry is or is not profitable, structurally | Change over time. It is a snapshot. It also handles platforms and network effects poorly, where a rival is often also a complement provider ([limitations summary][five-forces-limits]) |
| **PESTEL** | Which macro forces touch this market: political, economic, social, technological, environmental, legal | Relative weight. It generates a list, not a ranking. Pair it with scenarios |
| **TAM, SAM, SOM** | How big the opportunity is at three widths | Timing and competitive response. A large TAM says nothing about whether you can reach any of it |
| **Segmentation and jobs-to-be-done** | Who buys, and what they are hiring the product to do | Supply-side economics. It says nothing about whether serving that segment is profitable |
| **Value chain and cost curve** | Where margin sits and who captures it | Demand shifts. A perfect cost position in a dying category is worthless |
| **Scenario planning** | What plausible futures look like, and which strategies survive several of them | Probability. Scenarios are deliberately not forecasts. Shell has been the most cited long-run practitioner |
| **Business war gaming** | How rivals will actually respond to your move | Anything outside the modelled players. Gilad has run these for large firms for over 30 years and describes the method as a metal detector for the company ([Academy of Competitive Intelligence][acci-wargame]) |
| **Competitive early warning** | Whether reality has drifted away from your strategy | Slow-moving structural change that nobody set a tripwire for. Gilad calls the gap "industry dissonance" ([Gilad, *Early Warning*][gilad-ew]) |
| **Blind spot analysis** | What your own leadership believes that is no longer true | Your own blind spots, unless someone external runs it |

### Market sizing without lying to yourself

Two methods. Use both and reconcile them. Lead with bottom-up.

**Top-down.** Start from a published industry figure, cut it by geography,
segment, and product to reach your addressable slice. Fast. It inherits every
error in the source figure and multiplies them by your assumptions.

**Bottom-up.** Start from countable units and price.

```text
SOM = (reachable accounts) x (win rate) x (annual contract value) x (ramp)
```

Worked example, deliberately small:

```text
Reachable accounts:  European B2B marketplaces with over 50 staff   = 3,400
Qualify (payments not yet embedded)                        x 0.45   = 1,530
Realistic 3-year penetration                               x 0.08   =   122
Annual contract value                                      x 42,000 = EUR 5.1m
```

Now stress the three assumptions. If penetration is 4% instead of 8%, the answer
halves. Publish that range. A single number with three decimal places is a claim
you cannot support.

Common sizing errors, all of them fatal to credibility:

| Error | What it looks like |
| --- | --- |
| **Vanity TAM** | Quoting the biggest adjacent category. "The US$4tn logistics market" for a freight-invoicing tool |
| **Percent-of-TAM reasoning** | "We only need 1% of a huge market." This is not a plan, it is a wish |
| **GMV mistaken for revenue** | Counting the value flowing through a platform as the platform's income |
| **Ignoring substitutes** | Sizing a category while buyers solve the job with spreadsheets for free |
| **Confirmation-driven build** | Choosing assumptions backwards from the number you wanted |

Sources on the method and the failure modes: [Forum VC][forum-vc],
[Alloy Partners][alloy], [Data-Mania][data-mania].

## Structured analytic techniques

These are procedures that force an analyst to consider what they would otherwise
skip. The term entered US intelligence use in 2005, growing out of the
"alternative analysis" work Jack Davis began in the 1980s
([SAGE, *Structured Analytic Techniques*][sage-sat]).

Four earn their place in business work.

### Analysis of competing hypotheses (ACH)

Start with the full set of plausible explanations, not the favourite one. Build
a matrix with hypotheses across the top and evidence down the side. Then try to
**disprove**, not prove. The hypothesis with the least disconfirming evidence
survives ([Kraven][kraven-ach]).

Worked example. Rival X drops price 20%.

| Evidence | H1: Winning share | H2: Clearing inventory | H3: Cash pressure | H4: Blocking our launch |
| --- | --- | --- | --- | --- |
| Cut applies only to last-gen SKU | Inconsistent | Consistent | Neutral | Inconsistent |
| Sales headcount flat | Inconsistent | Consistent | Consistent | Inconsistent |
| Their supplier extended payment terms | Neutral | Neutral | Consistent | Neutral |
| Cut began 3 weeks before our launch | Consistent | Neutral | Neutral | Consistent |
| No marketing spend increase | Inconsistent | Consistent | Consistent | Inconsistent |

H1 and H4 carry three inconsistencies each. H2 and H3 carry none. The
interesting output is not "the answer" but the discovery that the popular
internal story, that they are attacking us, is the worst-supported one.

### Key assumptions check

List every assumption the current judgment rests on. For each: what would make
it false, how would we notice, and how bad is it if it flips. Assumptions that
are both load-bearing and unmonitored are your real risk register.

### Premortem

Before committing, assume the decision failed badly and write the story of how.
Cheap, fast, and it surfaces objections that people will not raise directly to a
senior sponsor.

### Devil's advocacy and red teaming

Assign someone to argue the opposite case with real resources and real access.
It only works if the role is named, protected, and expected to be unpleasant.

## Saying how sure you are

Two separate things must be stated, and people constantly conflate them.

**Likelihood** is how probable the event is. Use a fixed scale and never mix
words and numbers loosely.

| Term | Probability band |
| --- | --- |
| Almost certainly | 95% to 99% |
| Very likely | 80% to 95% |
| Likely | 55% to 80% |
| Roughly even chance | 45% to 55% |
| Unlikely | 20% to 45% |
| Very unlikely | 5% to 20% |
| Almost certainly not | 1% to 5% |

**Confidence** is how much you trust the basis of the judgment: the quality of
sourcing, the number of independent origins, and how much of the reasoning rests
on assumption.

| Confidence | Basis |
| --- | --- |
| High | Multiple independent origins, consistent, few assumptions |
| Moderate | Credible sourcing, some gaps, plausible alternative readings |
| Low | Fragmentary or single-origin evidence, heavy assumption load |

Written correctly: "We judge it **likely** (60% to 70%) that rival X launches a
mid-market tier before Q2 2027. **Moderate confidence**, based on hiring and
channel signals from two independent origins, with no direct evidence of pricing."

This mirrors the discipline in US intelligence analytic standards, which require
that products express uncertainty explicitly and distinguish it from confidence
in the underlying sourcing. See [ODNI ICD 203][icd203].

## Calibration: getting better at being right

Forecast quality is measurable. The Good Judgment Project scored forecasters
with the Brier score, where lower is better, 0 is perfect. Its main findings
transfer directly to corporate market intelligence
([AI Impacts summary][aiimpacts], [Tetlock, *Superforecasting*][tetlock]):

1. **Start from the base rate, then adjust.** Look outward at how often this kind
   of thing happens before looking inward at this particular case.
2. **Update often, in small steps.** Not never, and not wildly on each headline.
3. **Teams beat individuals.** Structured disagreement improves accuracy.
4. **Be decisive as well as calibrated.** Always saying "roughly even chance" is
   safe and useless. Resolution matters alongside calibration.

The practical corporate version: write down a numeric probability for every
material judgment, with the resolution date. Score them quarterly. Within a year
you will know which analysts and which source classes to trust.

## Failure modes in analysis

| Bias | How it shows up in market work | Counter |
| --- | --- | --- |
| **Confirmation bias** | Collecting until the preferred story is supported | ACH. Assign someone to build the strongest opposite case |
| **Mirror imaging** | Assuming a rival will act as you would, with your incentives | Model their constraints, comp plan, and board pressure explicitly |
| **Single-origin dependence** | Three articles, one press release | Origin count, not source count |
| **Precision theatre** | "EUR 5,148,300 TAM" | Publish ranges. Show the two or three assumptions that drive them |
| **Recency** | The last customer conversation dominates | Fix the sample before you start listening |
| **Anchoring on the vendor's number** | The market-size slide comes from a firm selling into the market | Rebuild bottom-up before quoting anyone |
| **Availability** | Rivals you already track look more threatening than ones you do not | Periodically ask who is not on the list and why |
| **Paralysis** | Detailed reports, no recommendation ([Kompyte][kompyte]) | Every product ends with a judgment and a recommended action |

## The one-line test

Before publishing, answer this in a sentence: **what should the reader do
differently, and how sure are we?** If you cannot, the analysis is not finished.

---

[five-forces-limits]: https://rachel.worldpossible.org/mods/en-boundless/www.boundless.com/management/textbooks/boundless-management-textbook/strategic-management-12/external-inputs-to-strategy-87/limitations-of-the-five-forces-view-421-881/index.html
[acci-wargame]: https://academyci.com/ci-401-war-gaming/
[gilad-ew]: https://archive.org/details/earlywarningusin0000gila
[forum-vc]: https://www.forumvc.com/thought-pieces/understand-and-define-your-market-size
[alloy]: https://www.alloypartners.com/articles/market-sizing
[data-mania]: https://www.data-mania.com/blog/top-down-market-sizing-tam-sam-som-guide/
[sage-sat]: https://us.sagepub.com/sites/default/files/upm-assets/107812_book_item_107812.pdf
[kraven-ach]: https://kravensecurity.com/analysis-of-competing-hypotheses/
[icd203]: https://www.odni.gov/files/documents/ICD/ICD-203.pdf
[aiimpacts]: https://aiimpacts.org/evidence-on-good-forecasting-practices-from-the-good-judgment-project/
[tetlock]: https://www.ideasthesia.org/superforecasting-tetlock/
[kompyte]: https://www.kompyte.com/blog/top-ci-pitfalls-to-avoid/

---

<!-- 11archive-source: 05-products-and-cadence.md -->

# 5. Products and Cadence

## The product catalogue

A market intelligence function should publish a small, fixed set of products.
Fixed formats let readers learn where to look, and let analysts stop redesigning
the wheel every time.

| Product | Question it answers | Reader | Length | Cadence | Evidence bar |
| --- | --- | --- | --- | --- | --- |
| **Early warning alert** | "Something moved that crosses a tripwire we set" | Whoever owns the response | Under 200 words | Event-driven, same day | One credible origin is enough to alert. State the grade |
| **Weekly signal digest** | "What changed in the market this week that matters" | Sales, product, leadership | 1 page | Weekly | Filtered, with a so-what per item |
| **Competitor profile** | "Who are they, what can they do, what will they do" | Product, sales, strategy | 3 to 6 pages | Refreshed quarterly | Multiple origins, dated |
| **Battlecard** | "What do I say when I meet them in a deal" | Sellers, live in the call | 1 screen | Refreshed monthly, or on any material change | Every claim traceable and defensible if repeated to a customer |
| **Win/loss report** | "Why are we actually winning and losing" | Product, marketing, sales leadership | 5 to 10 pages | Quarterly, rolling interviews | Buyer's words, not the rep's account |
| **Market map** | "Who exists in this space and how do they cluster" | Strategy, corp dev, investors | Visual plus table | On demand, refreshed twice a year | Explicit inclusion criteria and a published exclusion list |
| **Market sizing** | "How big is this and how fast is it moving" | Strategy, finance, investors | 2 to 4 pages | On demand | Both methods, reconciled, ranges published |
| **Deep dive or thesis** | "Should we do this" | Executive committee, investment committee | 10 to 20 pages | Project | Full sourcing, alternatives considered, assumptions listed |
| **Commercial due diligence pack** | "Is this target's commercial story true" | Deal team | 20 to 60 pages | Per deal | Primary evidence required. Management claims tested, not repeated |
| **Quarterly market review** | "How did our read of the market perform, and what changed" | Leadership | 6 to 10 pages | Quarterly | Includes scored judgments from last quarter |

## Anatomy of a good product

Every product, whatever the length, uses the same seven-part spine.

```text
1. Bottom line up front   The judgment, in one or two sentences, with likelihood
                          and confidence
2. So what                What the reader should do differently
3. Key judgments          Three to five, each with likelihood and confidence
4. Evidence               What we saw, dated, with origin count per judgment
5. Alternatives           The next most plausible reading, and why we rejected it
6. What would change our  The specific observations that would flip the judgment
   mind
7. Sourcing               Source list with reliability and credibility grades,
                          and named gaps
```

Parts 5 and 6 are what separate intelligence from opinion. They are also the
first two sections that get cut under deadline pressure. Do not cut them.

### Bottom line up front, done properly

Weak: "This report examines rival X's recent pricing activity and its potential
implications for our enterprise segment."

Strong: "Rival X will **likely** (60% to 70%) launch a mid-market tier before
Q2 2027, **moderate confidence**. If it lands at our current entry price, we
should expect pressure on roughly 18% of our renewal base. Recommend we decide
on a defensive tier by 15 October."

The strong version tells the reader what to believe, how sure to be, what it
costs them, and what to do. The weak version tells them the report exists.

## Battlecards deserve their own rules

Battlecards are the highest-usage market intelligence product in most companies
and the easiest one to get wrong.

| Rule | Reason |
| --- | --- |
| One screen, no scrolling | A seller reads it during a live call |
| Structure: their pitch, our answer, proof, trap questions | This is the sequence the conversation actually follows |
| Every claim must survive being repeated to the customer | A seller will read it aloud. Assume the rival will see it |
| No claim without a date | Rival pricing from 14 months ago is a liability |
| Built from win/loss, not from leadership's beliefs | Cards built from interview findings address objections buyers actually raised rather than the ones leadership assumed ([Liminal][liminal]) |
| Retire content aggressively | A card with 40 items is not used. A card with 6 is |

## Win/loss programs

The single highest-return recurring product for most B2B companies, because it
is primary evidence about your exact market, gathered from the only people whose
opinion decides revenue.

Sample sizes that matter, from practitioner guidance
([UserIntuition][ui-benchmarks], [Liminal][liminal]):

| Interviews | What you can say |
| --- | --- |
| 20 to 30 | Directional patterns for one segment or one competitive matchup |
| 50 or more | Segment by deal size, persona, and vertical |
| 100 or more | Primary loss themes stabilise |

Reported outcomes, all from vendor and practitioner sources and all
self-reported: structured programs are associated with win-rate improvements of
15% to 25% over two years against rep self-reporting alone, and 63% of companies
running structured programs report win-rate improvement, rising to 84% for
programs running longer than a year ([UserIntuition][ui-benchmarks],
[CompeteIQ][competeiq]).

Treat those numbers as a reason to run the program, not as a forecast of your
result. Nobody publishes the failures.

Three design rules that decide whether the program is worth anything:

1. **Interview buyers, not your reps.** The rep's account of why a deal was lost
   is systematically biased toward price and away from anything the rep
   controls.
2. **Interview wins too.** Losses tell you what went wrong. Wins tell you what
   to repeat, and they are the cheaper interviews to obtain.
3. **Use a neutral interviewer.** Buyers soften their answers when the vendor is
   in the room.

## Market maps

A market map is a claim about how a space is organised, disguised as a picture.
Two rules keep it honest:

- **Publish the inclusion criteria.** "Companies with a live product, over
  US$1m revenue, selling to European mid-market, as of July 2026."
- **Publish the exclusion list.** Name the companies you considered and left
  out, with the reason. This is the part everyone skips and the part that makes
  the map trustworthy.

## Cadence

| Product type | Cadence rule |
| --- | --- |
| Early warning | The moment a tripwire trips. Latency is the entire value |
| Sales-facing | Weekly or faster. Frequency correlates strongly with reported impact |
| Strategy-facing | Quarterly, aligned with the planning calendar |
| Deep dives | Delivered at least two weeks before the decision date, never on it |

The strongest cadence evidence available is Crayon's 2026 survey: 56% of teams
share intelligence with sales weekly or faster, and 79% of teams on a weekly
cadence report revenue impact against 41% on monthly or slower
([Crayon 2026][crayon]). Vendor survey, self-reported, correlational. Still the
best public number in the field.

## Delivery beats publication

Publishing means putting it somewhere. Delivery means a named person receives it
before they need it. Only the second one changes decisions.

- **Push to the person, not to the portal.** The portal is the archive, not the
  channel.
- **Meet the reader where they work.** Sellers live in the CRM and in chat, not
  in your wiki.
- **Make the archive findable.** A widely cited Forrester figure, quoted in the
  product marketing literature, holds that over 90% of customer intelligence
  becomes unfindable within 90 days of collection, not deleted but lost
  ([via PMA][pma]). Whether or not the exact number holds, the failure mode is
  real and every practitioner recognises it.
- **Tag by decision, not by source.** People search for the question they have,
  not for the vendor you got it from.

## Quality bar checklist

Run this before anything leaves the team:

- [ ] The judgment appears in the first three sentences
- [ ] Likelihood and confidence are both stated, using the fixed scales
- [ ] Every number carries a period and a source
- [ ] Every key judgment names its origin count
- [ ] The most plausible alternative reading is stated and addressed
- [ ] "What would change our mind" is specific and observable
- [ ] The recommended action names an owner and a date
- [ ] Known gaps are declared, not hidden
- [ ] Nothing in it would embarrass the company if the rival read it

---

[liminal]: https://liminal.co/articles/insights/win-loss-analysis-guide/
[ui-benchmarks]: https://www.userintuition.ai/reference-guides/win-loss-ratio-benchmarks-saas-enterprise/
[competeiq]: https://competeiq.io/win-loss-analysis/
[crayon]: https://www.crayon.co/state-of-competitive-intelligence-2026
[pma]: https://www.productmarketingalliance.com/why-competitive-intelligence-programs-fail-and-what-to-do-about-it/

---

<!-- 11archive-source: 06-operating-model.md -->

# 6. Operating Model

## Where the function sits

There is no correct home. There is a correct match between where it sits and
what it is asked to do.

| Home | Serves best | Fails at |
| --- | --- | --- |
| **Strategy or corporate development** | Entry, acquisition, long-horizon threats | Sales speed. Sellers will not wait for a quarterly cycle |
| **Product marketing** | Battlecards, win/loss, positioning, launches | Structural and macro questions. Horizon rarely exceeds two quarters |
| **Revenue operations** | Deal-level competitive support, pipeline signals | Anything that is not measurable in the CRM |
| **Procurement** | Supplier markets, category strategy, cost and risk | Demand-side and buyer questions |
| **Investment team (VC or PE)** | Thesis development, sourcing, commercial diligence | Nothing, if resourced. This is the natural home in an investment firm |
| **Standalone, reporting to the CEO** | Cross-cutting questions and genuine early warning | Getting used, unless the CEO actually consumes it |

Practical rule: put it where the decisions are, then give it a standing line to
one other function so it does not become captive to a single reader.

## Roles

A small team covers five jobs, sometimes with one person doing several.

| Role | Owns |
| --- | --- |
| **Head of intelligence** | Requirements, the KIT list, the relationship with deciders, the quality bar |
| **Analyst** | Analysis, judgment, products. This is the scarce role |
| **Collection and tooling** | Sources, feeds, scrapers, vendor contracts, the archive |
| **Field network** | Structured access to sellers, support, partners, and customers |
| **Compliance sponsor** | The ethics policy and the escalation path. Usually part-time legal |

The single most common staffing error is hiring collectors and calling them
analysts. Collection is increasingly automatable. Judgment is not.

## Benchmarks

All figures below come from vendor surveys of self-selected respondents. They
are the best public numbers available and they are not neutral.

| Measure | Figure | Period | Source |
| --- | --- | --- | --- |
| Companies over 1,000 staff with a dedicated CI program | 94% | 2025 | Crayon, cited in [UserIntuition][ui-pricing] |
| Average CI team size at those companies | 4.2 full-time equivalents | 2025 | Crayon, cited in [UserIntuition][ui-pricing] |
| Teams running a dedicated CI platform | 66.7%, up from roughly one third in 2022 | 2026 | [Crayon 2026][crayon] |
| Teams tracking specific KPIs | 60.5%, up from 30% in 2022 | 2026 | [Crayon 2026][crayon] |
| Teams with an executive sponsor in sales | 56.7%, flat for years | 2026 | [Crayon 2026][crayon] |
| Teams sharing intelligence weekly or faster | 56% | 2026 | [Crayon 2026][crayon] |
| Teams reporting a competitive win-rate increase | 49.6% | 2026 | [Crayon 2026][crayon] |
| Teams reporting more deals are competitive than a year ago | 57.5% | 2026 | [Crayon 2026][crayon] |
| Teams where at least half of opportunities are competitive | 70% | 2026 | [Crayon 2026][crayon] |

### What correlates with reported impact

| Condition | Reported revenue impact | Source |
| --- | --- | --- |
| KPIs plus an executive sponsor | 88% versus 29% without both | [Crayon 2026][crayon] |
| KPIs, platform, and executive sponsor together | 90% versus 25% with none | [Crayon 2026][crayon] |
| AI agents in the sales motion | 82% versus 42% without | [Crayon 2026][crayon] |
| Weekly cadence versus monthly or slower | 79% versus 41% | [Crayon 2026][crayon] |

Read these as a checklist of what mature programs have, not as a causal recipe.
The honest reading: an executive sponsor, tracked KPIs, and a weekly rhythm are
the visible signature of a program that leadership already takes seriously.
Buying a platform does not create the sponsor.

## Cost bands

| Line | Typical range | Note |
| --- | --- | --- |
| CI or MI monitoring platform | US$25k to US$100k per year | [UserIntuition][ui-pricing] |
| Consulting or expert-network engagement | US$15k to US$500k or more per engagement | [UserIntuition][ui-pricing] |
| Internal analyst, fully loaded | US$120k to US$200k or more | [UserIntuition][ui-pricing] |
| Syndicated data subscription | Highly variable, five to seven figures | Negotiate. Average clients per alternative dataset fell from 25 to 20 in 2025, so buyers have leverage ([Neudata][neudata]) |
| Total program, mid-size B2B company | US$25k to US$200k or more per year | [UserIntuition][ui-pricing] |

Build-versus-buy heuristic: buy monitoring, build judgment. Monitoring is a
commodity with real economies of scale. Judgment about your market is the thing
you cannot outsource without losing the point.

## The tool stack, by layer

Name the layer first. Vendors sell across layers and the categories blur.

| Layer | Job | Representative tools |
| --- | --- | --- |
| **Monitoring** | Watch defined sources, alert on change | Crayon, Klue, Kompyte, Contify |
| **Aggregated research corpus** | Search across filings, calls, broker research, expert transcripts | AlphaSense |
| **Digital and web signals** | Traffic, ads, SEO, app data | Similarweb, Semrush, Sensor Tower |
| **Private-market data** | Companies, funding, investors, deals | PitchBook, Crunchbase, Dealroom, Tracxn, CB Insights |
| **Primary research** | Surveys, interviews, expert calls | Panels, expert networks, win/loss vendors such as Clozd and Klue Win-Loss |
| **Alternative data** | Transactions, geolocation, workforce, satellite | Vendor-specific. Sourced via marketplaces or brokers such as Neudata |
| **Knowledge store** | Keep what you learned findable | Wiki, vector store, or the CI platform's own repository |
| **Delivery** | Get it to the reader where they work | Chat, CRM, email, enablement tools |

Categories and vendor placements per [Improvado][improvado],
[Infomineo][infomineo], and the platform comparisons in [Unkover][unkover].

### Private-market data: a specific caution

For an investment team, this layer is the one where source choice changes
conclusions.

- **PitchBook** relies heavily on manual research staff and is the institutional
  default for verified deal, fund, and financial records.
- **Crunchbase** blends community contributions, automated collection from press
  releases and filings, and editorial review. Broader, less consistent.
- **Dealroom** is deepest on European early-stage, including pre-seed rounds
  that US-centric databases miss.
- **Tracxn** goes deepest on sector taxonomies and on India and Southeast Asia.

See [PitchBook's own comparison][pb-compare], [Crustdata][crustdata], and the
[Dealroom versus PitchBook comparison][dr-pb]. Note that the first is published
by one of the vendors compared.

Practical consequence: a market map built from one database will systematically
miss whatever that database under-covers. If the map matters, build it from two
and reconcile the difference. The reconciliation itself is usually informative.

## Metrics

Market intelligence has a measurement problem that never fully goes away: its
best outcomes are counterfactual. A threat neutralised early looks like nothing
happening.

Measure four things, and accept that the first is the important one and the
hardest.

| Metric | Definition | How to capture |
| --- | --- | --- |
| **Decision influence** | Share of material decisions where an MI product was cited as an input | Ask the decider at the point of decision. Log it |
| **Decision velocity** | Time from question raised to decision taken | Timestamp the request and the decision |
| **Early warnings delivered** | Threats or opportunities surfaced before they appeared in sales data | Count and review at quarter end |
| **Judgment accuracy** | Scored probabilistic judgments against outcomes | Quarterly scoring of the judgment log |

Secondary, easier, and less meaningful: request throughput, product usage,
battlecard views, win rate on tracked competitors, cost avoided.

Frameworks that group these as risk avoided, speed gained, and decision quality
improved: [Beroe][beroe], [Valona][valona], [UserIntuition][ui-roi].

A caution on win-rate attribution. Win rate moves for many reasons. Attributing
it to the intelligence program requires either a holdout group or a long enough
series to see the trend break. Most companies have neither and claim the credit
anyway.

## Maturity ladder

| Level | Description | Tell |
| --- | --- | --- |
| 0. Ad hoc | Someone Googles the competitor before a big meeting | No record exists a month later |
| 1. Reactive | Requests arrive, someone answers them | No requirements list. Queue is first-in-first-out |
| 2. Programmatic | Fixed products, fixed cadence, a named owner | A battlecard set exists and is maintained |
| 3. Decision-linked | Every product names a decision, a decider, and a date. Outcomes recorded | A judgment log exists |
| 4. Anticipatory | Tripwires set in advance. Early warning fires before the event | Leadership has changed a plan because of an alert |

Most corporate functions sit at level 1 or 2. The step from 2 to 3 costs almost
nothing in tools and almost everything in discipline.

## Failure modes and fixes

| Failure | Symptom | Fix |
| --- | --- | --- |
| No requirements | Everything is urgent, nothing is prioritised | Publish a KIT list. Review it quarterly with the sponsor |
| Librarian trap | High output, no judgments ([PMA][pma]) | Cap collection at half of project time. Require a judgment in every product |
| No sponsor | Products are read but never acted on | Get a named executive sponsor or stop the program |
| Tool-first | A platform was bought before the questions were written | Write the KIT list first. The platform serves it |
| Findability collapse | Work is redone because nobody could find the old answer ([PMA][pma]) | Tag by decision and question. Assign an archivist |
| Vanity metrics | Reporting article counts and alert volumes | Replace with decision influence and judgment accuracy |
| Ethics drift | Grey-area collection creeps in under deal pressure | Written policy, named escalation path, training. See chapter 7 |

---

[crayon]: https://www.crayon.co/state-of-competitive-intelligence-2026
[ui-pricing]: https://www.userintuition.ai/posts/competitive-intelligence-pricing/
[ui-roi]: https://www.userintuition.ai/reference-guides/how-to-measure-competitive-intelligence-roi/
[neudata]: https://www.neudata.co/blog/state-of-the-alternative-data-market-2026
[improvado]: https://improvado.io/blog/marketing-intelligence-tools
[infomineo]: https://infomineo.com/industries/technology-telecommunication/software/best-ai-powered-competitive-intelligence-tools-in-2026/
[unkover]: https://unkover.com/blog/competitive-intelligence-tools/
[pb-compare]: https://pitchbook.com/compare/pitchbook-vs-crunchbase
[crustdata]: https://crustdata.com/blog/7-best-startup-databases-for-investors-in-2026
[dr-pb]: https://signals.gitdealflow.com/vs/dealroom-vs-pitchbook
[beroe]: https://www.beroeinc.com/resource-centre/insights/roi-market-intelligence-how-better-insights-drive-enterprise-value
[valona]: https://valonaintelligence.com/resources/blog/how-to-measure-the-roi-of-intelligence
[pma]: https://www.productmarketingalliance.com/why-competitive-intelligence-programs-fail-and-what-to-do-about-it/

---

<!-- 11archive-source: 07-law-and-ethics.md -->

# 7. Law and Ethics

This chapter is a working map, not legal advice. Rules differ by country and by
industry, and several of the cases below are still moving. Get counsel before
anything near a line.

## The one rule that decides most cases

**How you obtained the information matters more than what the information is.**

The same fact can be lawful or unlawful depending on the route. A competitor's
manufacturing cost, worked out by buying their product and taking it apart, is
lawful nearly everywhere. The same number, obtained by an investigator
pretending to be their employee, is not.

## Trade secrets: the outer boundary

Both major legal systems landed in a similar place in 2016.

- **United States.** The Economic Espionage Act of 1996, amended by the Defend
  Trade Secrets Act of 2016, gives a federal civil claim for misappropriation.
- **European Union.** Directive (EU) 2016/943 harmonises trade-secret protection
  across member states, and member states may go further.

Both define a trade secret the same way in substance: information the owner took
reasonable steps to keep secret, which has economic value because it is not
generally known or readily ascertainable ([Osborne Clarke][oc-ts],
[EUR-Lex, Directive 2016/943][eurlex-ts]).

### What both systems treat as lawful acquisition

| Route | Status |
| --- | --- |
| **Reverse engineering** a lawfully obtained product | Expressly permitted under both the DTSA and the EU Directive |
| **Independent derivation** | Lawful |
| **Observation of what is publicly visible** | Lawful |
| **Other honest commercial practices** (EU wording) or other lawful means (US wording) | Lawful |

The EU Directive is explicit that reverse engineering and parallel innovation
must be guaranteed, because a trade secret is not an exclusive intellectual
property right ([Osborne Clarke][oc-ts]).

### What is unlawful

Acquiring the secret through improper means: theft, bribery,
misrepresentation, breach or inducement of a duty of confidence, or espionage.
Note that inducing someone else's breach counts. Asking a rival's employee to
share confidential material puts you inside the prohibition even though you did
not take anything yourself.

## The ethics line, drawn by real cases

| Case | What happened | Outcome |
| --- | --- | --- |
| **HP pretexting, 2006** | HP's investigators impersonated board members and journalists, in some cases using their Social Security numbers, to obtain phone records while hunting a boardroom leak. Targets included nine journalists, nine directors, over twenty employees or contractors, and a journalist's children | Chair resigned, congressional hearings, criminal charges, a US$14.5 million settlement with California, and a new federal law, the Telephone Records and Privacy Protection Act of 2006 ([Wikipedia][wiki-hp], [CIO timeline][cio-hp], [RCFP][rcfp-hp]) |
| **P&G and Unilever, 2001** | P&G staff went through Unilever's rubbish looking for competitive documents. P&G disclosed it themselves and called it a rogue operation | At least three staff fired, roughly US$10 million paid to Unilever ([CBS News][cbs-pg]) |

Both cases share a pattern worth internalising: the collection was performed by
people who believed they were serving the company, under pressure, without a
clear written boundary. The fix is a written policy plus a named escalation path,
not exhortation.

## The SCIP Code of Ethics

The most-cited standard in the field. Reproduced here from a secondary source,
because scip.org blocks automated retrieval; verify against the primary page
before quoting it formally ([Octopus Intelligence][octopus-scip]).

1. **Elevate the profession.** Continually strive to increase the recognition
   and respect of the profession.
2. **Always in compliance.** Comply with all applicable laws, domestic and
   international.
3. **Transparent.** Accurately disclose all relevant information, including
   one's identity and organisation, prior to all interviews.
4. **Conflict-free.** Avoid conflicts of interest in fulfilling one's duties.
5. **Honest.** Provide honest and realistic recommendations and conclusions.
6. **Act as an ambassador.** Promote this code within one's company, with
   third-party contractors, and within the profession.
7. **Strategically aligned.** Adhere to one's company policies, objectives, and
   guidelines.

Clause 3 is the operative one and the one most often broken. It rules out
calling a competitor's support line pretending to be a customer, and it rules out
attending a rival's webinar under a false name and employer. If your collection
method depends on the other party not knowing who you are, stop.

## Web scraping

Two US decisions define the current position.

**hiQ Labs v LinkedIn.** The Ninth Circuit narrowed the Computer Fraud and Abuse
Act so that it does not reach automated collection of data that is publicly
accessible without authentication ([FBM][fbm-hiq]). Note the case's own
counter-example: hiQ did get into trouble for hiring contractors to create fake
LinkedIn accounts to reach logged-in data.

**Meta Platforms v Bright Data.** On 23 January 2024, Judge Edward Chen of the
Northern District of California granted summary judgment for Bright Data. The
reasoning that matters: Meta's terms govern "your use" of its products, and
Bright Data did not "use" Facebook when it scraped public logged-out pages after
terminating its accounts ([Quinn Emanuel][qe-bd], [FBM][fbm-bd]).

### The four lines

| Line | Rule |
| --- | --- |
| **Authentication** | Do not bypass a login. Do not create fake accounts. This is where both defendants above got into trouble |
| **Personal data** | GDPR and CCPA apply to scraped personal data whether or not it was publicly visible |
| **Copyright** | Extract facts. Do not republish creative expression |
| **Harm** | Respect rate limits. Causing degradation converts a civil argument into a much worse one |

### GDPR and scraping

The European position tightened sharply.

- **EDPB Opinion 28/2024** recognised legitimate interest under Article 6(1)(f)
  as a viable basis for AI model development, subject to a rigorous three-part
  test ([IAPP][iapp-edpb]).
- **EDPB Guidelines 03/2026 on web scraping in the context of generative AI**,
  adopted July 2026, are the first comprehensive GDPR framework for large-scale
  extraction of publicly available data. The Board confirmed that GDPR applies
  whenever scraping involves personal data, regardless of public visibility, and
  that consent is generally not a viable basis for scraping at scale
  ([EDPB][edpb-news], [Reed Smith][rs-edpb]).

Practical consequence for a market intelligence team in Europe: scraping company
pages, prices, and product documentation is low risk. Scraping named individuals,
their profiles, or their posts requires a documented legitimate-interest
assessment, data minimisation before collection, and a retention decision. Write
the assessment before you collect, not after someone asks.

## Material non-public information and alternative data

If your organisation trades securities, or advises anyone who does, this section
is the one that ends careers.

- The SEC's Division of Examinations published a risk alert describing
  deficiencies it observed in advisers' use of alternative data and expert
  networks, with MNPI as the central concern ([Akin][akin-sec]).
- In the Primary Global Research matter, the SEC charged hedge funds and
  portfolio managers with trading on MNPI obtained from public-company insiders
  who were moonlighting as expert-network consultants, alleging more than
  US$30 million in illicit profits ([FieldSignal][fs-mnpi]).

Expert networks were never banned. The channel is not the problem. The control
over what flows through it is ([FieldSignal][fs-mnpi]).

### Minimum controls

| Control | Detail |
| --- | --- |
| **Pre-clearance** | Approve the expert and the topic list before the call |
| **Chaperone or recording** | For any call touching a covered issuer |
| **Scope script** | Read at the start: industry-level only, nothing confidential to a current or former employer |
| **Employment screen** | Screen out current employees, and recent leavers, of issuers you hold or are researching |
| **Vendor contract terms** | MNPI clauses, with liability on the vendor if MNPI is found in their data ([Daloopa][daloopa], [Lowenstein][lowenstein]) |
| **Data provenance diligence** | Written answers on origin, consent, and aggregation for every dataset (chapter 3) |
| **Restricted list integration** | Data acquisition decisions checked against the firm's restricted list |

Generally acceptable data types, when properly sourced: satellite images of
publicly visible areas, aggregated and anonymised consumer transaction data,
public filings, and public social media content ([Daloopa][daloopa]).

## Antitrust: competitor information and pricing

This is the fastest-moving area and the one most market intelligence teams
underestimate.

The Department of Justice announced a proposed settlement with **RealPage** on
24 November 2025, resolving allegations that RealPage's revenue-management
product used competing landlords' data in an algorithm producing pricing
recommendations. The settlement bars RealPage from using competitors'
non-public data in that product and limits model training to historic,
backward-looking non-public data at least twelve months old
([Wilson Sonsini][ws-realpage], [Hogan Lovells][hl-realpage],
[Reed Smith][rs-realpage]).

The enforcement posture, as read by counsel: the DOJ is not against algorithmic
pricing tools as such. It is against tools that pool non-public competitor data
and produce coordinated outputs. Risk is highest when the data is current or
forward-looking, non-public, competitively sensitive, and used at runtime in a
pricing decision. Risk rises further when the recommendation is applied
automatically with no human override ([Hogan Lovells][hl-realpage],
[Snell & Wilmer][sw-algo]).

### Rules for a market intelligence team

| Do | Do not |
| --- | --- |
| Collect published prices, public rate cards, public tender results | Exchange current or forward-looking non-public pricing with a competitor, directly or through any intermediary |
| Use aggregated, historic, anonymised benchmarks from a neutral third party | Contribute your own forward-looking pricing into a pool that feeds competitors' pricing |
| Keep a human decision step between any recommendation and a price change | Let a tool trained on rivals' non-public current data set prices automatically |
| Document the provenance of every input to a pricing model | Assume a vendor's data is clean because the vendor says so |

Trade associations and benchmarking exercises deserve particular care. Sharing
historic, aggregated, anonymised data through a neutral administrator is the
conventional safe design. Anything current, disaggregated, or attributable is not.

## Other regimes to keep in view

- **EU Data Act.** In force since January 2024, with core obligations applying
  from 12 September 2025. It creates data access and portability rights around
  connected products and cloud services, and it may open datasets that were
  previously locked ([Skadden][skadden-da], [Debevoise][deb-da]).
- **EU AI Act.** Transparency obligations touch how you disclose AI-generated
  analysis and how you document data used in models
  ([Truescreen][ts-aiact]).
- **Sector rules.** Pharmaceutical, defence, financial services, and healthcare
  each impose their own limits on competitor contact and on data handling. Check
  yours before designing collection.

## A one-page policy you can actually enforce

**Always allowed**

- Public sources, published prices, filings, patents, job ads, public
  documentation, logged-out pages
- Buying a competitor's product and testing it, including taking it apart
- Attending public events and identifying yourself honestly
- Interviewing anyone after disclosing who you are and who you work for
- Talking to your own customers, prospects, partners, and former buyers

**Allowed with controls**

- Expert-network calls, with pre-clearance and a scope script
- Purchased alternative data, after provenance and MNPI diligence
- Scraping public pages, within rate limits and with a legitimate-interest
  assessment where personal data is involved
- Surveys and interviews with a competitor's customers, where the sponsor's
  identity is disclosed or the design is cleared by counsel

**Never**

- Misrepresenting who you are or who you work for
- Creating fake accounts, or bypassing any login or paywall
- Asking anyone to breach a confidentiality obligation
- Taking physical material, including from bins
- Recording without the consent the local law requires
- Trading, or passing to anyone who trades, on non-public information about a
  specific issuer
- Pooling current or forward-looking non-public pricing with competitors

**Escalation.** Any grey case goes to a named person before collection, not
after. Write the name in the policy.

---

[oc-ts]: https://www.osborneclarke.com/insights/trade-secrets-harmony-us-europe
[eurlex-ts]: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A32016L0943
[wiki-hp]: https://en.wikipedia.org/wiki/Hewlett-Packard_spying_scandal
[cio-hp]: https://www.cio.com/article/260587/hp-spying-scandal-a-timeline.html
[rcfp-hp]: https://www.rcfp.org/hp-pay-145-million-settlement-pretexting-scandal/
[cbs-pg]: https://www.cbsnews.com/news/thou-shalt-not-steal-thy-competitors-secrets/
[octopus-scip]: https://www.octopusintelligence.com/scip-competitive-intelligence-code-of-ethics/
[fbm-hiq]: https://www.fbm.com/publications/what-recent-rulings-in-hiq-v-linkedin-and-other-cases-say-about-the-legality-of-data-scraping/
[qe-bd]: https://www.quinnemanuel.com/the-firm/news-events/client-alert-what-does-the-meta-v-bright-data-summary-judgment-ruling-mean-for-web-scraping/
[fbm-bd]: https://www.fbm.com/publications/major-decision-affects-law-of-scraping-and-online-data-collection-meta-platforms-v-bright-data/
[iapp-edpb]: https://iapp.org/news/a/edpb-opinion-sheds-light-on-lawful-ai-training-dpa-discretion
[edpb-news]: https://www.edpb.europa.eu/news/edpb-sheds-light-on-anonymisation-and-web-scraping-for-generative-ai-and-adopts-final-version_en
[rs-edpb]: https://www.reedsmith.com/our-insights/blogs/technology-law-dispatch/102nbqu/edpb-web-scraping-guidelines-for-ai-making-the-impossible-possible/
[akin-sec]: https://www.akingump.com/en/insights/alerts/sec-division-of-examinations-finally-speaks-on-alternative-data
[fs-mnpi]: https://fieldsignalhq.com/resources/blog/mnpi-and-expert-networks-what-pe-and-hedge-fund-buyers-need-to-know
[daloopa]: https://daloopa.com/blog/analyst-best-practices/the-growing-impact-of-alternative-data-on-hedge-fund-performance
[lowenstein]: https://www.lowenstein.com/news-insights/publications/articles/key-considerations-for-alternative-data-and-ai-vendors-to-investment-firms-demonstrating-compliance-in-the-face-of-an-evolving-regulatory-environment
[ws-realpage]: https://www.wsgr.com/en/insights/doj-settles-its-algorithmic-price-fixing-case-against-realpage.html
[hl-realpage]: https://www.hoganlovells.com/en/publications/proposed-doj-settlement-provides-guidance-on-use-of-competitive-information
[rs-realpage]: https://www.reedsmith.com/our-insights/blogs/viewpoints/102lwqx/algorithmic-pricing-under-pressure-dojs-realpage-settlement-changes-the-rules-f/
[sw-algo]: https://www.swlaw.com/publication/algorithmic-pricing-under-the-antitrust-microscope-doj-and-ftc-sharpen-their-enforcement-posture/
[skadden-da]: https://www.skadden.com/insights/publications/2025/06/eu-data-act
[deb-da]: https://www.debevoisedatablog.com/2025/10/09/eu-data-act-key-provisions-and-what-you-need-to-know/
[ts-aiact]: https://truescreen.io/articles/eu-ai-act-transparency-obligations-businesses/

---

<!-- 11archive-source: 08-what-changed-by-2026.md -->

# 8. What Changed by 2026

## The short version

Research agents made collection and first-draft synthesis fast and cheap. They
did not make verification cheap. The bottleneck moved from finding evidence to
deciding what is true. Every practical change below follows from that one shift.

## Agentic research arrived in the professional stack

AlphaSense launched **Deep Research** on 10 June 2025, an agent that runs
multi-step research over the company's corpus of more than 500 million business
and financial documents: equity research, earnings calls, expert-call
transcripts, filings, news, and, for enterprise customers, internal documents.
It produces company and industry primers, screening work, and meeting briefings
with citations, in minutes ([AlphaSense][as-dr]).

The general-purpose equivalents from the large model providers shipped over the
same period and now do the open-web version of the same job.

What this changed in practice:

| Task | Before | Now |
| --- | --- | --- |
| Industry primer, first draft | 2 to 5 analyst days | Under an hour, then a day of checking |
| Finding the relevant passage across 200 filings | Hours of search | Minutes |
| Competitor profile refresh | Half a day | Automated draft, analyst edits |
| Meeting brief | Often skipped | Routine |
| Deciding whether a claim is true | Analyst judgment | Analyst judgment, unchanged |

The last row is the whole story.

## Adoption, measured

| Measure | Figure | Period | Source |
| --- | --- | --- | --- |
| CI teams using AI to generate sales-facing competitive content | 80%, up from 61% in 2025 and 25% in 2024 | 2026 | [Crayon 2026][crayon] |
| CI teams running AI agents in production or pilot | 50%, with another 14% planning within a year | 2026 | [Crayon 2026][crayon] |
| Teams with agents in the sales motion reporting revenue impact | 82% versus 42% without | 2026 | [Crayon 2026][crayon] |
| Alternative-data buyers using AI for productivity and workflow | 66% | 2025 to 2026 | [Neudata][neudata] |
| Alternative-data buyers using AI for investment strategy | 31% | 2025 to 2026 | [Neudata][neudata] |

The gap between 66% and 31% in the last two rows is the most informative number
in the table. Firms trust these systems to speed up work far more than they
trust them to decide anything.

## The reliability ceiling

Model factuality improved a great deal and remains far from sufficient for
unchecked publication. Reported rates vary widely by benchmark, which is itself
the finding: no single number describes this.

| Measure | Reported figure | Source |
| --- | --- | --- |
| Frontier model hallucination across test suites | 4% to 19%, against 15% to 45% in 2024 | [Digital Applied][da-hall] |
| Worst frontier citation accuracy in a 5,000-prompt study | 19.1% | [Digital Applied][da-hall] |
| Best score on the FACTS factuality benchmark | 68.8, meaning wrong more than 30% of the time | [Digital Applied][da-hall] |

Read these as orders of magnitude, not as measurements. They come from
aggregator sites, benchmarks differ in construction, and results move month to
month. The robust conclusion survives the imprecision: **an unverified
machine-written citation is not evidence.**

Purpose-built evaluations for research agents now exist, including
ResearchRubrics and FinDeepResearch, which score deep-research agents on
rubric-based and financial-analysis tasks ([ResearchRubrics][rr],
[FinDeepResearch][fdr]). Use them to choose tools. Do not use them to skip
checking.

## Synthetic respondents: useful, oversold

Synthetic respondents are model-generated personas that answer research
questions in place of people.

What the evidence supports:

- A Stanford study in 2024 found agents built from rich real interviews matched
  a person's own survey answers roughly 85% as well as that person matched their
  own answers two weeks later.
- Peer-reviewed work also finds that synthetic respondents **collapse variance**
  and can **flip the sign** of key relationships. Even when explicitly asked for
  diverse personas, outputs cluster around a narrow stereotypical range.

Both findings are summarised in [SYMAR's practical guide][symar]. The industry
position is consistent across ESOMAR, GreenBook, Bain, NIQ, and Kantar: treat
synthetic research as a supplement that must be validated against real humans,
not a replacement. The ICC/ESOMAR Code introduced an official definition of
synthetic data in June 2025, and both ESOMAR and the Market Research Society have
signalled formal guidance with minimum validation requirements.

Defensible uses today:

| Use | Why it works |
| --- | --- |
| Pre-testing a questionnaire before it goes to humans | Catches ambiguous wording cheaply |
| Generating hypotheses to test with real respondents | Failure costs nothing |
| Rehearsing an objection or a buying-committee conversation | The output is a script to prepare against, not a finding |
| Filling a small gap in an otherwise human sample | Only with the share disclosed in the product |

Indefensible: sizing a market, setting a price, or claiming a preference share
from synthetic responses alone. The variance collapse means you will get a
confident answer that is wrong in a predictable direction.

## The data-quality arms race got worse

Covered in detail in chapter 3. The 2026 summary:
roughly 31% of raw survey responses show some form of fraud, average discard
rates of 38% and up to 70%, and, as of late 2025, published work by Sean Westwood
in PNAS demonstrating an AI agent that passed as a human respondent while
evading every detection method then in use ([iMotions][imotions]).

The strategic consequence: **primary research got more expensive in real terms,
and secondary evidence got cheaper.** Rebalance accordingly. Fewer, better
primary studies. More systematic use of filings, behaviour, and internal records.

## What to automate and what not to

| Automate | Keep human |
| --- | --- |
| Source monitoring and change detection | Deciding which questions matter |
| Extraction and normalisation from documents | Grading source reliability |
| First-draft summaries and profiles | The judgment and its confidence level |
| Translation and transcription | Choosing between competing hypotheses |
| Formatting and distribution | Anything a customer or regulator will read |
| Finding the passage in a 300-page filing | Deciding the passage means what it appears to mean |

## A verification protocol for AI-assisted intelligence

Adopt this as a written standard. It is the cheapest quality control available.

1. **Claim-level sourcing.** Every load-bearing claim carries a source and a
   retrieval date. No source, no claim.
2. **Open the source.** Never cite a document the agent found but nobody opened.
   Machine-generated citations point to real documents that do not always say
   what the summary claims.
3. **Two independent origins for load-bearing numbers.** See the triangulation
   rule in chapter 3.
4. **Keep the raw quote.** Store the exact sentence that supports the claim,
   next to the claim.
5. **Date every figure.** A number without a period is not evidence.
6. **Mark the tier.** Label each claim as directly sourced, inferred, or
   assumed. Readers weigh them differently and deserve the chance to.
7. **Declare AI involvement.** State in the product where machine assistance was
   used. This is increasingly a compliance matter as well as an honesty one.

## What the shift means for how you staff

- **Collection headcount falls in value.** Monitoring, extraction, and
  summarising are now commodity capabilities.
- **Judgment headcount rises in value.** The scarce person is the one who can
  say "this is probably wrong, and here is why" about a fluent, well-cited draft.
- **A new role appears: evidence engineer.** Someone who owns provenance,
  retrieval quality, and the archive. In practice this is the person who makes
  the difference between an agent that is useful and one that is dangerous.
- **Calibration training becomes worth paying for.** When drafting is free, the
  differentiator is being right, and being right is trainable. See
  chapter 4.

## What did not change

- Requirements still decide quality. A fast answer to the wrong question is
  worse than no answer, because it is more convincing.
- The legal perimeter is unchanged by speed, and in Europe it tightened. See
  chapter 7.
- Buyers still tell you things no dataset contains. Twenty good interviews still
  beat a large corrupted survey.
- Decisions are still made by people who have nine minutes.

---

[as-dr]: https://www.alpha-sense.com/press/alphasense-launches-deep-research-automating-in-depth-analysis-with-agentic-ai-on-high-value-content
[crayon]: https://www.crayon.co/state-of-competitive-intelligence-2026
[neudata]: https://www.neudata.co/blog/state-of-the-alternative-data-market-2026
[da-hall]: https://www.digitalapplied.com/blog/ai-model-hallucination-rate-benchmarks-2026-study
[rr]: https://arxiv.org/pdf/2511.07685
[fdr]: https://arxiv.org/pdf/2510.13936
[symar]: https://www.symar.ai/blog/synthetic-market-research-practical-guide/
[imotions]: https://imotions.com/blog/insights/thought-leadership/fraud-in-online-surveys/

---

<!-- 11archive-source: 09-build-guide.md -->

# 9. Build Guide: First 90 Days

For one person, or a small team, standing up a market intelligence function
from nothing. Assumes no platform purchase in the first 90 days. That is
deliberate.

## Day 0 to 15: decide what you are for

| Task | Output |
| --- | --- |
| Interview the five people whose decisions you will serve | A list of decisions they face in the next four quarters, with dates |
| Convert those into KITs and KIQs | One page. Between 4 and 8 KITs. No more |
| Name your executive sponsor | A person, in writing, who will read the output and act |
| Write the ethics policy | One page. Use the template in chapter 7. Get legal sign-off |
| Inventory what already exists | Existing reports, subscriptions, dashboards, and the CRM fields nobody uses |
| Agree the first three products and their cadence | Usually: weekly digest, one battlecard set, one deep dive |

Do not buy anything yet. Do not build a dashboard. Do not write a charter longer
than a page.

The interview script that works:

```text
1. What decision are you making in the next two quarters that you feel
   under-informed about?
2. What would you need to know to feel confident?
3. What is the last thing that surprised you about this market?
4. Where do you go for market information today, and what is wrong with it?
5. If I could put one page on your desk every week, what would be on it?
```

Question 3 is the most productive one. Surprises map directly to the early
warning topics you should be covering and are not.

## Day 16 to 45: build the evidence base

| Task | Output |
| --- | --- |
| Build the source inventory | A table of sources per KIQ, ranked using the source ladder in chapter 3 |
| Mine what you already own | Lost-deal reasons, support tickets, churn notes, sales call transcripts |
| Set up free monitoring | Price-page diffs, job-ad watches, filing alerts, changelog feeds |
| Run the first primary research | 15 to 20 win/loss interviews. This will be your highest-value asset by day 90 |
| Grade your sources | Assign reliability grades. Write them down |
| Ship the first weekly digest | Even if it is thin. Rhythm before richness |

Costs at this stage should be close to zero apart from your time and the
interviews.

## Day 46 to 75: publish and close the loop

| Task | Output |
| --- | --- |
| Ship the first battlecard set | Top 3 competitors only. One screen each |
| Ship the first deep dive | Answering the single highest-value KIT |
| Start the judgment log | Every probabilistic judgment, with date and resolution date |
| Set tripwires | For each early-warning KIT: the specific observable that triggers an alert, and who receives it |
| Establish the archive | Tagged by decision and question, not by source |
| Collect feedback formally | Ask each reader: did this change anything you did? |

## Day 76 to 90: measure and decide what to scale

| Task | Output |
| --- | --- |
| Baseline the four metrics | Decision influence, decision velocity, early warnings delivered, judgment accuracy. See chapter 6 |
| Score the first judgments that have resolved | Even three or four data points start the calibration habit |
| Review the KIT list with the sponsor | Kill what nobody used. Add what surprised you |
| Write the tooling case, if any | Now you know which layer actually constrains you |
| Decide build versus buy per layer | Buy monitoring. Build judgment |

## Templates

### KIT and KIQ register

| ID | KIT | Type | KIQ | Indicator | Owner | Cadence | Consumer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| K1 | Rival X moving down-market | Early warning | Has X hired SMB sales in DACH since Jan 2026? | Job ads by title and location | A | Weekly | VP Sales |
| K1 | Rival X moving down-market | Early warning | Has X added a tier below current entry? | Pricing page diff | Auto | Daily | VP Sales |
| K2 | Enterprise price increase Jan 2027 | Strategic decision | What churn intent at +8%? | Renewal cohort survey | Vendor | Once, by 12 Sep | VP Pricing |

### Source card

```text
Source:        Rival X pricing page
URL:           https://example.com/pricing
Type:          Company-published, tier 3
Reliability:   A (published by the subject, factual content)
Credibility:   1 for list prices, 4 for implied discounting
Collected by:  Daily automated diff
Retention:     Screenshot archived per change
Known limits:  Regional variants and A/B tests produce false positives
Legal:         Public, logged out, rate limited. No personal data
```

### Judgment log entry

```text
ID:              J-0007
Date:            2026-08-11
KIT:             K1
Judgment:        Rival X launches a mid-market tier before 2027-04-01
Likelihood:      Likely (60% to 70%)
Confidence:      Moderate
Origins:         2 independent (hiring signals, channel reports)
Assumptions:     Their Series D closes as reported; no leadership change
Would falsify:   Hiring freeze; a public statement of enterprise-only focus
Resolution date: 2027-04-01
Outcome:         [ pending ]
Notes:           Popular internal view is that this is aimed at us. ACH does
                 not support that reading. See analysis of 2026-08-04
```

### Product front page

```text
TITLE
Decision this supports:  ...
Decider and date:        ...
Prepared:                YYYY-MM-DD

BOTTOM LINE
[One or two sentences. Judgment, likelihood, confidence, recommended action.]

SO WHAT
[What the reader should do differently.]

KEY JUDGMENTS
1. ... (likelihood, confidence)
2. ...
3. ...

WHAT WOULD CHANGE OUR MIND
- ...
- ...

SOURCING
[Sources with grades. Gaps named explicitly.]
```

## Build versus buy, by layer

| Layer | Default | Reason |
| --- | --- | --- |
| Monitoring | Buy, after 90 days | Real economies of scale. Cheap relative to analyst time |
| Aggregated research corpus | Buy if you need filings, calls, and broker research often | Cannot be replicated |
| Private-market data | Buy at least one, ideally two | Coverage differs by database and by region. See chapter 6 |
| Web and digital signals | Buy | Panel infrastructure cannot be replicated |
| Primary research | Mixed. Run interviews in-house, buy panels and expert access | The interviews are where your edge is |
| Alternative data | Buy selectively, after provenance diligence | Expensive, and most datasets will not move your decisions |
| Knowledge store | Build or reuse | Depends entirely on where your readers already work |
| Analysis and judgment | Build | This is the function. Outsourcing it defeats the purpose |

## The 90-day success test

At day 90, you should be able to point to:

- [ ] A one-page KIT list agreed with a named sponsor
- [ ] Three products shipping on a fixed cadence
- [ ] At least 15 buyer interviews conducted and coded
- [ ] A judgment log with dated, probabilistic entries
- [ ] At least one tripwire that fired, or was demonstrated to work
- [ ] One decision a named person will say your work changed
- [ ] A written ethics policy with a named escalation contact

If you can point to the sixth item, the program is real. If you cannot, fix
requirements and delivery before you buy any tool. No platform has ever
converted a program that nobody was waiting on.

## Common first-year traps

| Trap | Symptom | Fix |
| --- | --- | --- |
| Boiling the ocean | 30 competitors tracked, none well | Three competitors, properly. Add the fourth when the first three are boring |
| Tool before question | A platform purchased in month two | Delay all purchases to day 90 |
| Reporting to nobody | A weekly digest with no named recipient | One named consumer per product, or kill the product |
| Avoiding a judgment | Reports that summarise without concluding | Every product ends with a probability and a recommended action |
| Neglecting internal evidence | Buying data about your own market that your CRM already holds | Mine CRM and support before any purchase |
| Ethics by vibes | No written policy, grey calls made under deadline | Write the one-page policy in week one |

---

Related: chapter 2 for requirements,
chapter 5 for product formats,
chapter 6 for metrics and stack,
chapter 7 for the policy template.

---

<!-- 11archive-source: GLOSSARY.md -->

# Glossary

Terms used in this collection, defined in plain words. Where a term has a
narrow legal or technical meaning, that meaning is given first.

## A

**ACH (analysis of competing hypotheses).** A method that starts with every
plausible explanation, then tries to disprove each one against the evidence. The
explanation with the least contradicting evidence wins. Designed to counter the
habit of adopting a favourite theory and collecting support for it.

**Admiralty scale.** A two-part grading system used in intelligence work. A
letter (A to F) grades the source's reliability. A number (1 to 6) grades how
credible the specific piece of information is. The two are graded separately
because a reliable source can pass on a false claim.

**Alternative data.** Data not produced for financial reporting, bought to infer
company or market performance. Examples: card transactions, phone location data,
satellite images, scraped web pages, job postings, app telemetry.

**Anonymised data.** Data from which no individual can be identified, by anyone,
by any reasonably likely means. A high bar. Data that is merely stripped of
names is usually pseudonymised, not anonymised, and stays inside GDPR.

## B

**Base rate.** How often something of this general kind happens. Good forecasters
start here and adjust for the specifics, rather than starting from the specifics.

**Battlecard.** A one-screen reference a seller uses during a live conversation
with a prospect who is also considering a named competitor.

**BLUF (bottom line up front).** Writing the conclusion in the first sentences,
before the evidence. Standard practice in intelligence and military writing.

**Brier score.** A number that measures how good probabilistic forecasts were.
Lower is better. Zero is perfect. It rewards both being right and being
appropriately confident.

**Business intelligence (BI).** Analysis of a company's own internal data to
understand and improve its own operations. Points inward. Contrast with market
intelligence, which points outward.

## C

**CFAA (Computer Fraud and Abuse Act).** The US anti-hacking statute. Narrowed by
hiQ v LinkedIn so that it does not cover automated collection of data that is
publicly accessible without a login.

**Commercial due diligence (CDD).** Research done before an acquisition or
investment to test whether the target's story about its market, customers, and
competitive position is true.

**Competitive early warning (CEW).** A system of pre-set indicators that fires an
alert when the market moves in a way that threatens the current strategy. Ben
Gilad's term for the gap between market reality and company strategy is
"industry dissonance".

**Competitive intelligence (CI).** Intelligence about named competitors: their
capabilities, intentions, and weaknesses. Narrower than market intelligence.

**Confidence.** How much you trust the basis of a judgment: sourcing quality,
number of independent origins, and assumption load. Distinct from likelihood.

## D

**Deep research agent.** A system that plans a research task, runs many searches
and reads, and produces a cited synthesis. Fast at drafting. Not a substitute for
checking.

**DTSA (Defend Trade Secrets Act of 2016).** US federal law giving trade-secret
owners a civil claim for misappropriation. Expressly permits reverse engineering
and independent derivation.

## E

**EDPB (European Data Protection Board).** The EU body that issues authoritative
guidance on GDPR. Its Opinion 28/2024 and Guidelines 03/2026 set the current
position on scraping and AI training data.

**Estimative language.** Standardised words for probability, used so that
"likely" means the same thing to writer and reader. See the scale in chapter 4.

**Expert network.** A firm that arranges paid calls between clients and
practitioners with specific industry experience. High signal, high compliance
attention.

## G

**GDPR.** The EU's data protection regulation. Applies to any processing of
personal data, including data that was publicly visible when collected.

## I

**Intelligence cycle.** The loop from decision need, through collection and
analysis, to a delivered product and recorded outcome. A management model, not a
literal description of practice.

## K

**KIT (key intelligence topic).** A broad area leadership needs covered, tied to
a decision or a risk. Sorted into strategic decisions, early warning, and key
players.

**KIQ (key intelligence question).** One specific, answerable question under a
KIT. Answer enough of them and the KIT is covered.

## L

**Legitimate interest.** One of the six legal bases for processing personal data
under GDPR, requiring a documented three-part test. The main available basis for
large-scale scraping, since consent is generally not workable at scale.

**Likelihood.** How probable an event is, stated as a band. Distinct from
confidence.

## M

**Market intelligence (MI).** Collection and analysis of information about the
external environment, done to answer a defined question and support a decision.

**Market map.** A visual and tabular claim about how a market is organised.
Trustworthy only if it publishes both its inclusion criteria and its exclusion
list.

**Market research.** Measurement of buyer attitudes and behaviour, usually
through primary methods such as surveys and interviews. One collection method
inside market intelligence, not a synonym for it.

**Mirror imaging.** Assuming a competitor will act as you would, with your
incentives and constraints. A recurring source of wrong predictions.

**MNPI (material non-public information).** Information not publicly available
that a reasonable investor would consider important. Trading on it, or passing it
to someone who trades, is unlawful in most markets.

## O

**Origin.** The ultimate source of a claim, as opposed to the outlet that
repeated it. Three articles quoting one press release are one origin.

**OSINT (open source intelligence).** Intelligence produced from publicly
available information. The backbone of nearly all business market intelligence.

## P

**PESTEL.** A scan across political, economic, social, technological,
environmental, and legal forces. Produces a list, not a ranking.

**Premortem.** Assuming, before committing, that the decision failed badly, and
writing the story of how. Surfaces objections people will not say out loud.

**Pretexting.** Obtaining information by pretending to be someone you are not.
Prohibited by the SCIP code, unlawful in several contexts, and the conduct at the
centre of the 2006 HP scandal.

**Primary research.** Evidence you generate yourself: interviews, surveys,
observation, testing. Contrast with secondary research, which uses what others
already published.

## R

**Reverse engineering.** Taking apart a lawfully obtained product to learn how it
works. Expressly lawful under both the US DTSA and EU Directive 2016/943.

## S

**SAM (serviceable available market).** The part of the total market you could
realistically reach, given your model, product, and geography.

**SCIP.** The professional body for the field, founded in Washington DC in 1986.
Renamed twice, most recently in April 2023 to the Strategic Consortium of
Intelligence Professionals. Publisher of the most-cited code of ethics in the
discipline.

**Scenario planning.** Constructing several internally consistent futures and
testing strategy against each. Deliberately not a forecast. No probabilities are
assigned.

**Signal.** An observable proxy for something you cannot see directly. Job ads
as a proxy for expansion. Pricing-page changes as a proxy for strategy.

**SOM (serviceable obtainable market).** The part of the SAM you can realistically
win in a defined period, given competition and your own capacity.

**Structured analytic technique (SAT).** A procedure that forces an analyst to
consider what they would otherwise skip. The term entered US intelligence use in
2005, from earlier "alternative analysis" work.

**Synthetic respondent.** A model-generated persona answering research questions
in place of a person. Useful for pre-testing and hypothesis generation. Not a
basis for sizing or pricing decisions, because it collapses variance.

## T

**TAM (total addressable market).** Total revenue available if you captured the
entire market. Easily inflated. Meaningless without the SAM and SOM beneath it.

**Trade secret.** Information kept secret through reasonable steps, which has
economic value because it is not generally known. Defined in substantially the
same way by US and EU law since 2016.

**Triangulation.** Confirming a claim from two or more genuinely independent
origins, ideally collected by different methods.

**Tripwire.** A pre-set observable that, when seen, automatically triggers an
alert. The mechanism that turns monitoring into early warning.

## W

**War game.** A structured exercise in which teams play competitors and respond
to a proposed move. Reveals how rivals will actually react, and which internal
assumptions do not survive contact.

**Win/loss analysis.** Structured interviews with buyers after a deal closes,
won or lost, to learn why. The highest-return recurring primary research most
B2B companies can run.

---

<!-- 11archive-source: SOURCES.md -->

# Sources

All sources accessed 11 August 2026. Each entry states what it was used for and,
where relevant, what kind of source it is.

Source classes used below:

- **Primary** means the originating authority: a court, a regulator, a statute, a
  standards body, or the company making the announcement.
- **Legal analysis** means law-firm commentary on a primary legal source.
  Reliable on the substance, written to attract clients.
- **Vendor** means a company selling into the market it is measuring.
  Self-reported, self-selected samples. Directionally useful, not neutral.
- **Trade** means industry press or practitioner writing.
- **Academic** means peer-reviewed or preprint research.

## Analytic doctrine and method

- [ODNI, ICD 203: Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf) (primary)

  US Intelligence Community standards for expressing uncertainty, distinguishing
  it from confidence in sourcing, and stating assumptions and alternatives. Used
  for the likelihood and confidence scales in chapter 4.

- [SAGE, *Structured Analytic Techniques for Intelligence Analysis*, chapter 1](https://us.sagepub.com/sites/default/files/upm-assets/107812_book_item_107812.pdf) (academic)

  Origin of the term "structured analytic techniques" in 2005 and its roots in
  Jack Davis's alternative analysis work in the 1980s.

- [Kraven Security, Analysis of Competing Hypotheses](https://kravensecurity.com/analysis-of-competing-hypotheses/) (trade)

  Working description of ACH, including the rule to disprove rather than prove.

- [AI Impacts, Evidence on good forecasting practices from the Good Judgment Project](https://aiimpacts.org/evidence-on-good-forecasting-practices-from-the-good-judgment-project/) (academic summary)

  Findings on calibration, base rates, updating, and team performance.

- [Superforecasting summary, Ideasthesia](https://www.ideasthesia.org/superforecasting-tetlock/) (trade)

  Secondary summary of Tetlock and Gardner. Used for the Brier score and
  calibration-versus-resolution points.

## The discipline: definitions, history, practice

- [Market Logic, Market intelligence vs competitive intelligence](https://marketlogicsoftware.com/blog/market-intelligence-vs-competitive-intelligence/) (vendor)
- [Competitive Intelligence Alliance, Competitive vs market intelligence](https://www.competitiveintelligencealliance.io/competitive-intelligence-vs-market-intelligence/) (trade)

  Both used for the width distinction between MI and CI.

- [Wikipedia, Competitive intelligence](https://en.wikipedia.org/wiki/Competitive_intelligence) (tertiary)
- [Wikipedia, Fuld-Gilad-Herring Academy of Competitive Intelligence](https://en.wikipedia.org/wiki/Fuld-Gilad-Herring_Academy_of_Competitive_Intelligence) (tertiary)
- [PR Newswire, SCIP changes name](https://www.prnewswire.com/news-releases/scip-changes-name-to-strategic-and-competitive-intelligence-professionals-100524874.html) (primary, organisational announcement)

  Used for the history table: SCIP founded 1986 in Washington DC, Jan Herring's
  Motorola function in 1982, Leonard Fuld's and Ben Gilad's publications, and the
  two renamings.

- [Benjamin Gilad, *Early Warning* (Internet Archive record)](https://archive.org/details/earlywarningusin0000gila) (primary, book)
- [Academy of Competitive Intelligence, CI 401 War Gaming](https://academyci.com/ci-401-war-gaming/) (vendor)

  Used for competitive early warning, industry dissonance, and war gaming.

- [The MAP Newsletter, Converting insight to action](https://www.ismpp-newsletter.com/2019/11/13/converting-insight-to-action-key-aspects-of-competitive-intelligence-for-strategic-planning/) (trade)

  KIT and KIQ definitions.

- [Product Marketing Alliance, Why competitive intelligence programs fail](https://www.productmarketingalliance.com/why-competitive-intelligence-programs-fail-and-what-to-do-about-it/) (trade)

  Librarian trap, the Forrester-cited 90-day findability figure, and the KIQ
  remedy. The Forrester figure is quoted second-hand and is labelled as such
  wherever it appears in this collection.

- [Contify, Three common market and competitive intelligence problems](https://www.contify.com/resources/blog/3-common-mci-problems-and-their-solutions/) (vendor)
- [Kompyte, Top CI pitfalls](https://www.kompyte.com/blog/top-ci-pitfalls-to-avoid/) (vendor)

  Unclear objectives, stakeholder mismatch, and paralysis by analysis.

## Industry sizing and market structure

- [Research World, Inside the $153bn insights industry](https://researchworld.com/articles/inside-the-153bn-insights-industry) (trade, reporting ESOMAR data)

  ESOMAR Global Market Research figures for 2024: US$153bn total, US$56bn market
  research growing 4.8%, US$62bn research software growing 11.5%, US$35bn
  reporting growing 8%, and above US$160bn expected for 2025. Also describes the
  funnel-based estimation method.

- [Neudata, State of the alternative data market 2026](https://www.neudata.co/blog/state-of-the-alternative-data-market-2026) (vendor)

  Buy-side spend of US$2.8bn in 2025 up 17%, 2,805 datasets tracked against
  2,215 in 2024, average clients per dataset falling from 25 to 20, 57% of firms
  expecting budget increases, 66% using AI for productivity and 31% for strategy,
  and 42% of new datasets having global applicability against 29% in 2024.

- [Grand View Research, Alternative data market](https://www.grandviewresearch.com/industry-analysis/alternative-data-market) (vendor)
- [Future Market Insights, Alternative data market](https://www.futuremarketinsights.com/reports/alternative-data-market) (vendor)

  Cited only to demonstrate the four-times spread between published market-size
  estimates for the same year. Not used as evidence for any figure.

## Sources, signals, and data quality

- [LinkUp, The market reaction to job listing data](https://www.linkup.com/use-cases/the-market-reaction-to-job-listing-data) (vendor)

  Association between changes in job postings and one-year-ahead growth in
  headcount, SG&A, sales, and earnings.

- [Revelio Labs, Job postings COSMOS](https://www.reveliolabs.com/job-postings-cosmos) (vendor)

  Coverage scale: over 5 billion postings from over 1 million company sites.

- [Collaborator, Accuracy of Ahrefs, Semrush and Similarweb](https://collaborator.pro/blog/research-semrush-similarweb-ahrefs) (trade)
- [Omniconvert, 1,787 ecommerce sites compared with Google Analytics](https://www.omniconvert.com/blog/we-analyzed-1787-ecommerce-websites-similarweb-google-analytics-thats-we-learned/) (vendor)

  Conflicting accuracy findings for web traffic estimates. Both cited because the
  disagreement is the finding.

- [iMotions, Combatting fraud in online surveys](https://imotions.com/blog/insights/thought-leadership/fraud-in-online-surveys/) (vendor)

  Research Defender's estimate that roughly 31% of raw survey responses contain
  fraud, Kantar's 38% average discard rate with up to 70% in some cases, and
  Sean Westwood's PNAS work in late 2025 on an AI agent evading survey fraud
  detection. All are second-hand citations in this source. Verify against the
  originals before formal use.

- [NORC, Fraudulent respondents and bots in nonprobability surveys](https://www.norc.org/content/dam/norc-org/pdf2026/cpss-research-brief-fraud-lit-review.pdf) (academic)

  Literature review supporting the survey fraud section.

- Official statistics used in the source ladder:
  [Eurostat](https://ec.europa.eu/eurostat),
  [US Census Bureau](https://www.census.gov),
  [US Bureau of Labor Statistics](https://www.bls.gov),
  [UN Comtrade](https://comtrade.un.org),
  [OECD Data](https://data.oecd.org),
  [World Bank Open Data](https://data.worldbank.org). All primary.

## Frameworks and market sizing

- [Limitations of the five-forces view](https://rachel.worldpossible.org/mods/en-boundless/www.boundless.com/management/textbooks/boundless-management-textbook/strategic-management-12/external-inputs-to-strategy-87/limitations-of-the-five-forces-view-421-881/index.html) (academic, open textbook)

  Static-snapshot critique and weakness on platforms and network effects.

- [Forum VC, Market sizing for startups](https://www.forumvc.com/thought-pieces/understand-and-define-your-market-size) (vendor)
- [Alloy Partners, What is market sizing](https://www.alloypartners.com/articles/market-sizing) (vendor)
- [Data-Mania, Top-down market sizing](https://www.data-mania.com/blog/top-down-market-sizing-tam-sam-som-guide/) (vendor)

  TAM, SAM, SOM definitions, top-down versus bottom-up, and the error catalogue
  including vanity TAM, percent-of-TAM reasoning, and GMV mistaken for revenue.

## Products, programs, and benchmarks

- [Crayon, The 2026 State of Competitive Intelligence](https://www.crayon.co/state-of-competitive-intelligence-2026) (vendor)

  Ninth edition, surveying hundreds of CI and revenue leaders. Source for: 66.7%
  on a dedicated platform, 80% using AI for competitive content, 50% running AI
  agents, 60.5% tracking KPIs, 56.7% with an executive sponsor, 56% weekly
  cadence, 49.6% reporting win-rate increase, 57.5% reporting more competitive
  deals, 70% with at least half of deals competitive, and the impact
  comparisons (88% versus 29%, 90% versus 25%, 82% versus 42%, 79% versus 41%).
  Self-reported, self-selected, correlational. Labelled as such throughout.

- [UserIntuition, Competitive intelligence pricing](https://www.userintuition.ai/posts/competitive-intelligence-pricing/) (vendor)

  Cost bands, and the Crayon 2025 figures of 94% program adoption above 1,000
  employees and 4.2 average FTE.

- [UserIntuition, Win-loss ratio benchmarks](https://www.userintuition.ai/reference-guides/win-loss-ratio-benchmarks-saas-enterprise/) (vendor)
- [Liminal, Win-loss analysis guide](https://liminal.co/articles/insights/win-loss-analysis-guide/) (vendor)
- [CompeteIQ, Win/loss analysis complete guide](https://competeiq.io/win-loss-analysis/) (vendor)

  Interview volume thresholds (20 to 30, 50, 100), the 15% to 25% two-year
  win-rate improvement claim, and the 63% and 84% program-outcome figures.

- [UserIntuition, How to measure competitive intelligence ROI](https://www.userintuition.ai/reference-guides/how-to-measure-competitive-intelligence-roi/) (vendor)
- [Beroe, The ROI of market intelligence](https://www.beroeinc.com/resource-centre/insights/roi-market-intelligence-how-better-insights-drive-enterprise-value) (vendor)
- [Valona, How to measure the ROI of intelligence](https://valonaintelligence.com/resources/blog/how-to-measure-the-roi-of-intelligence) (vendor)

  Metric frameworks: risk avoided, speed gained, decision quality improved.

## Tools and data providers

- [Improvado, Marketing intelligence tools](https://improvado.io/blog/marketing-intelligence-tools) (vendor)
- [Infomineo, Best AI-powered competitive intelligence tools 2026](https://infomineo.com/industries/technology-telecommunication/software/best-ai-powered-competitive-intelligence-tools-in-2026/) (vendor)
- [Unkover, Competitive intelligence tools](https://unkover.com/blog/competitive-intelligence-tools/) (vendor)

  Tool category structure. Vendor placements cross-checked across all three.

- [PitchBook, PitchBook vs Crunchbase](https://pitchbook.com/compare/pitchbook-vs-crunchbase) (vendor, and one of the compared parties)
- [Crustdata, Best startup databases for investors 2026](https://crustdata.com/blog/7-best-startup-databases-for-investors-in-2026) (vendor)
- [Dealroom vs PitchBook comparison](https://signals.gitdealflow.com/vs/dealroom-vs-pitchbook) (trade)

  Coverage differences across PitchBook, Crunchbase, Dealroom, and Tracxn,
  including PitchBook's manual research staffing and Dealroom's European
  early-stage depth.

## Law and ethics

- [EUR-Lex, Directive (EU) 2016/943 on trade secrets](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A32016L0943) (primary)
- [Osborne Clarke, Trade secrets: harmony between the US and Europe](https://www.osborneclarke.com/insights/trade-secrets-harmony-us-europe) (legal analysis)

  Convergent definitions, and lawful acquisition through reverse engineering and
  independent derivation under both regimes.

- [Wikipedia, Hewlett-Packard spying scandal](https://en.wikipedia.org/wiki/Hewlett-Packard_spying_scandal) (tertiary)
- [CIO, HP spying scandal timeline](https://www.cio.com/article/260587/hp-spying-scandal-a-timeline.html) (trade)
- [RCFP, HP to pay $14.5 million settlement](https://www.rcfp.org/hp-pay-145-million-settlement-pretexting-scandal/) (trade)
- [CBS News, Thou shalt not steal thy competitor's secrets](https://www.cbsnews.com/news/thou-shalt-not-steal-thy-competitors-secrets/) (trade)

  HP pretexting 2006, including the target list, the settlement, and the
  Telephone Records and Privacy Protection Act of 2006. P&G and Unilever 2001,
  including the roughly US$10m payment.

- [Octopus Intelligence, SCIP code of ethics](https://www.octopusintelligence.com/scip-competitive-intelligence-code-of-ethics/) (trade)

  Secondary reproduction of the SCIP code. Used because scip.org returned HTTP
  403 to automated retrieval on 11 August 2026. Verify against
  [scip.org](https://www.scip.org/page/Ethical-Intelligence) before formal
  quotation.

- [Farella Braun + Martel, Recent rulings in hiQ v LinkedIn](https://www.fbm.com/publications/what-recent-rulings-in-hiq-v-linkedin-and-other-cases-say-about-the-legality-of-data-scraping/) (legal analysis)
- [Quinn Emanuel, Meta v Bright Data summary judgment](https://www.quinnemanuel.com/the-firm/news-events/client-alert-what-does-the-meta-v-bright-data-summary-judgment-ruling-mean-for-web-scraping/) (legal analysis)
- [Farella Braun + Martel, Meta Platforms v Bright Data](https://www.fbm.com/publications/major-decision-affects-law-of-scraping-and-online-data-collection-meta-platforms-v-bright-data/) (legal analysis)

  CFAA narrowing for public data, and the 23 January 2024 summary judgment for
  Bright Data in the Northern District of California before Judge Chen.

- [EDPB, Anonymisation and web scraping for generative AI](https://www.edpb.europa.eu/news/edpb-sheds-light-on-anonymisation-and-web-scraping-for-generative-ai-and-adopts-final-version_en) (primary)
- [IAPP, EDPB opinion on personal data in AI model development](https://iapp.org/news/a/edpb-opinion-sheds-light-on-lawful-ai-training-dpa-discretion) (trade)
- [Reed Smith, EDPB web scraping guidelines for AI](https://www.reedsmith.com/our-insights/blogs/technology-law-dispatch/102nbqu/edpb-web-scraping-guidelines-for-ai-making-the-impossible-possible/) (legal analysis)

  EDPB Opinion 28/2024 on legitimate interest, and Guidelines 03/2026 on
  scraping for generative AI adopted July 2026, including the position that
  consent is generally not viable at scale.

- [Akin, SEC Division of Examinations on alternative data](https://www.akingump.com/en/insights/alerts/sec-division-of-examinations-finally-speaks-on-alternative-data) (legal analysis)
- [FieldSignal, MNPI and expert networks](https://fieldsignalhq.com/resources/blog/mnpi-and-expert-networks-what-pe-and-hedge-fund-buyers-need-to-know) (vendor)
- [Lowenstein Sandler, Considerations for alternative data and AI vendors](https://www.lowenstein.com/news-insights/publications/articles/key-considerations-for-alternative-data-and-ai-vendors-to-investment-firms-demonstrating-compliance-in-the-face-of-an-evolving-regulatory-environment) (legal analysis)
- [Daloopa, Alternative data and hedge fund performance](https://daloopa.com/blog/analyst-best-practices/the-growing-impact-of-alternative-data-on-hedge-fund-performance) (vendor)

  SEC risk alert on alternative data and expert networks, the Primary Global
  Research matter with alleged illicit profits above US$30m, and the control set
  including MNPI clauses in vendor contracts.

- [Wilson Sonsini, DOJ settles algorithmic price-fixing case against RealPage](https://www.wsgr.com/en/insights/doj-settles-its-algorithmic-price-fixing-case-against-realpage.html) (legal analysis)
- [Hogan Lovells, Proposed DOJ settlement on competitive information in pricing tools](https://www.hoganlovells.com/en/publications/proposed-doj-settlement-provides-guidance-on-use-of-competitive-information) (legal analysis)
- [Reed Smith, Algorithmic pricing under pressure](https://www.reedsmith.com/our-insights/blogs/viewpoints/102lwqx/algorithmic-pricing-under-pressure-dojs-realpage-settlement-changes-the-rules-f/) (legal analysis)
- [Snell & Wilmer, Algorithmic pricing under the antitrust microscope](https://www.swlaw.com/publication/algorithmic-pricing-under-the-antitrust-microscope-doj-and-ftc-sharpen-their-enforcement-posture/) (legal analysis)

  RealPage proposed settlement announced 24 November 2025, the ban on using
  competitors' non-public data, the twelve-month backward-looking training
  limit, and the risk factors that raise antitrust exposure.

- [Skadden, EU Data Act](https://www.skadden.com/insights/publications/2025/06/eu-data-act) (legal analysis)
- [Debevoise, EU Data Act key provisions](https://www.debevoisedatablog.com/2025/10/09/eu-data-act-key-provisions-and-what-you-need-to-know/) (legal analysis)
- [Truescreen, EU AI Act transparency obligations](https://truescreen.io/articles/eu-ai-act-transparency-obligations-businesses/) (vendor)

  Data Act core obligations applying from 12 September 2025, and AI Act
  transparency duties.

## AI and the 2026 state of practice

- [AlphaSense, Deep Research launch](https://www.alpha-sense.com/press/alphasense-launches-deep-research-automating-in-depth-analysis-with-agentic-ai-on-high-value-content) (primary, company announcement)

  Launched 10 June 2025 over a corpus of more than 500 million documents.

- [Digital Applied, AI model hallucination rate benchmarks 2026](https://www.digitalapplied.com/blog/ai-model-hallucination-rate-benchmarks-2026-study) (trade aggregator)

  Frontier hallucination range of 4% to 19% against 15% to 45% in 2024, worst
  citation accuracy of 19.1% in a 5,000-prompt study, and a best FACTS score of
  68.8. Aggregated secondary figures. Treated in this collection as orders of
  magnitude only.

- [ResearchRubrics: a benchmark of prompts and rubrics for evaluating deep research agents](https://arxiv.org/pdf/2511.07685) (academic preprint)
- [FinDeepResearch: evaluating deep research agents in rigorous financial analysis](https://arxiv.org/pdf/2510.13936) (academic preprint)

  Purpose-built evaluations for research agents.

- [SYMAR, Synthetic market research practical guide](https://www.symar.ai/blog/synthetic-market-research-practical-guide/) (vendor)

  The Stanford 2024 finding of roughly 85% match, the peer-reviewed findings on
  variance collapse and sign flips, the ICC/ESOMAR June 2025 definition of
  synthetic data, and the industry consensus that synthetic research supplements
  rather than replaces human respondents. All second-hand in this source.

## Known gaps

Stated plainly, because a sources list that hides its holes is worse than none.

1. **The SCIP code of ethics could not be retrieved from the primary site.**
   scip.org returned HTTP 403 to automated retrieval on 11 August 2026. The code
   is reproduced from a secondary source and flagged wherever it appears.
2. **ESOMAR's Global Market Research report is paywalled.** All industry-size
   figures come from Research World's summary of it, not from the report.
3. **Crayon's full 2026 survey is gated.** Sample size is described only as
   "hundreds". No methodology statement was available, so the survey's
   representativeness cannot be assessed.
4. **Several statistics reach this collection second-hand**, including the
   Research Defender fraud rate, the Kantar discard rate, the Westwood PNAS
   result, the Stanford synthetic-respondent study, and the Forrester findability
   figure. Each is labelled at the point of use. Verify against the originals
   before relying on any of them in an external document.
5. **No proprietary or paid data was used.** Everything here is open source.
6. **US and EU law dominate the legal chapter.** UK, Chinese, Indian, and
   Brazilian regimes differ in ways this collection does not cover.
