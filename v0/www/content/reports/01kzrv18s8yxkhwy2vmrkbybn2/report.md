<!-- 11archive-source: README.md -->

# Intelligence Reports: Initial Research

This collection explains the structure and vocabulary of intelligence reporting,
finished intelligence, analytic assessments, and intelligence briefings.

The material describes general intelligence tradecraft. Formats and terminology
vary among governments, military organizations, law-enforcement bodies, and
private intelligence teams. The collection therefore separates broadly reusable
principles from organization-specific conventions.

## Contents

1. Intelligence foundations
2. Anatomy of an intelligence report
3. Raw reporting
4. Finished intelligence and analytic assessments
5. Intelligence briefings
6. Comparisons and production workflow
7. Glossary
8. Sources

## Core model

```text
Requirement
    -> collection
    -> raw reporting
    -> processing and evaluation
    -> analysis
    -> finished intelligence
    -> report or briefing
    -> decision and feedback
    -> refined requirement
```

## Essential distinction

- **Raw reporting** records what a source, sensor, document, or collector
  observed or claimed.
- **Finished intelligence** explains what the available information probably
  means.
- **An analytic assessment** is a finished intelligence product containing
  supported judgments and explicit uncertainty.
- **A report** is a durable written or electronic product.
- **A briefing** is an audience-specific method of delivering information or
  intelligence, usually orally and visually.

## Research basis

The collection primarily uses official public doctrine and declassified examples
from the US Office of the Director of National Intelligence, CIA, US Department
of Justice, and UK Ministry of Defence. Full references appear in
SOURCES.md.

---

<!-- 11archive-source: 01-intelligence-foundations.md -->

# Intelligence Foundations

## Working definition

**Intelligence is information that has been collected, evaluated, integrated,
and interpreted to reduce uncertainty and support a decision.**

The term has three related meanings:

1. **Product:** knowledge, reporting, analysis, warning, assessment, or estimate.
2. **Process:** direction, collection, processing, exploitation, analysis,
   production, dissemination, and feedback.
3. **Function or organization:** the people and institutions performing those
   activities.

US joint doctrine describes intelligence as the organizations, capabilities, and
processes involved in collecting, processing, exploiting, analyzing, and
disseminating information or finished intelligence. The ODNI also describes the
intelligence cycle as the process of collecting information and developing it
into intelligence for customers. See the [ODNI/NCTC Intelligence Guide][nctc]
and [ODNI, What Is Intelligence?][odni-what].

## Information and intelligence

| Term | Definition |
| --- | --- |
| **Data** | Unprocessed observations, measurements, records, signals, images, or statements. |
| **Information** | Data given enough context to convey meaning. |
| **Intelligence information** | Collected information judged potentially relevant to an intelligence requirement, but not necessarily fully evaluated or analyzed. |
| **Raw intelligence** | Collected intelligence information not yet fully vetted, validated, integrated, or analyzed. |
| **Analysis** | Evaluation and integration of information to identify meaning, test explanations, and draw conclusions. |
| **Judgment** | An analyst's conclusion based on information, reasoning, and assumptions. |
| **Assessment** | A structured analytic judgment about what is happening, why it matters, or what may happen. |
| **Finished intelligence** | A product resulting from collection, processing, integration, evaluation, analysis, and interpretation. |
| **Estimate** | A forward-looking assessment of the likelihood, direction, or consequences of future developments. |
| **Intelligence requirement** | A defined question or knowledge need that collection and analysis must address. |

Information becomes decision-useful intelligence when it answers a defined
question and communicates both its conclusion and its uncertainty.

## The intelligence cycle

The intelligence cycle is a management model rather than a perfectly linear
description of practice. Analysts, collectors, and customers exchange feedback
throughout the process.

| Stage | Definition |
| --- | --- |
| **Direction and planning** | Define customer needs, intelligence questions, priorities, deadlines, and constraints. |
| **Collection** | Obtain relevant data and information through human, technical, documentary, or open sources. |
| **Processing and exploitation** | Convert collected material into a usable form through actions such as translation, decryption, geolocation, transcription, or imagery interpretation. |
| **Evaluation** | Assess source reliability, information credibility, relevance, and limitations. |
| **Analysis and production** | Integrate evidence, test explanations, form judgments, and create an intelligence product. |
| **Dissemination** | Deliver intelligence to authorized customers in an appropriate oral, written, visual, or electronic form. |
| **Feedback** | Capture questions, corrections, decisions, and new requirements from customers. |

## Major product categories

| Product | Purpose |
| --- | --- |
| **Information report** | Transmit collected information, often from a single source or event. |
| **Situation report** | Provide a timely update on current events and operational conditions. |
| **Bulletin** | Communicate a short, focused item or development. |
| **Assessment** | Explain the meaning and significance of available information. |
| **Estimate** | Assess possible or likely future developments. |
| **Warning** | Identify an emerging threat, opportunity, or material change requiring attention. |
| **Profile** | Describe an actor, organization, capability, system, or location. |
| **Briefing** | Present selected information or analysis directly to an audience. |

## Governing analytic principles

The US Intelligence Community's analytic standards require analysis to be:

- Objective.
- Independent of political consideration.
- Timely.
- Based on all available relevant sources.
- Consistent with defined analytic tradecraft standards.

Those tradecraft standards include source characterization, explicit
uncertainty, separation of information from assumptions and judgments,
consideration of alternatives, logical argument, relevance, clear language, and
explanation of changes from previous judgments. See [ODNI ICD 203][icd203].

## Intelligence is not certainty

Intelligence usually addresses questions for which information is incomplete,
conflicting, unreliable, deliberately concealed, or open to more than one
interpretation. An intelligence judgment is therefore not the same as proof.

An effective product explains:

- What is known.
- What is reported but unconfirmed.
- What is assumed.
- What is analytically judged.
- How likely the judgment is.
- How strong its evidentiary basis is.
- What remains unknown.
- What would change the judgment.

## Intelligence and policy

Intelligence supports decisions but is not normally a substitute for policy.
Strategic intelligence may explain implications and assess probable outcomes of
policy options, but it should not distort judgments to advocate a preferred
policy. Operational, military, and law-enforcement products may include courses
of action or recommendations when that is part of their mandate.

[nctc]: https://www.odni.gov/nctc/jcat/jcat_ctguide/intel_guide.html
[odni-what]: https://www.odni.gov/index.php/what-we-do/what-is-intelligence
[icd203]: https://www.odni.gov/files/documents/ICD/ICD-203.pdf

---

<!-- 11archive-source: 02-intelligence-report-anatomy.md -->

# Anatomy of an Intelligence Report

## Scope

There is no universal intelligence-report template. A raw information report, a
current-intelligence bulletin, a strategic assessment, and a national estimate
have different purposes and structures.

This document describes a canonical **finished analytic report**. Declassified
National Intelligence Estimates commonly use the core sequence **Scope Note,
Key Judgments, Discussion, and Annexes**. See this [declassified CIA National
Intelligence Estimate][nie-example].

## Canonical structure

```text
CLASSIFICATION AND HANDLING MARKINGS

REPORT IDENTIFIER
Title
Product type
Producing organization
Publication date
Information cutoff date
Audience and distribution

SCOPE NOTE
INTELLIGENCE QUESTION
EXECUTIVE SUMMARY OR BOTTOM LINE
KEY JUDGMENTS

1. CONTEXT AND BACKGROUND
2. CURRENT SITUATION
3. ANALYSIS OR DISCUSSION
4. OUTLOOK AND SCENARIOS
5. IMPLICATIONS
6. INDICATORS AND WARNING
7. INTELLIGENCE GAPS

ANALYTIC CONFIDENCE
ALTERNATIVE ANALYSIS AND DISSENT
SOURCE SUMMARY
METHODOLOGY
REFERENCES

ANNEXES
Maps, charts, timelines, glossary, and supporting data
```

## 1. Administrative and security layer

| Component | Definition and purpose |
| --- | --- |
| **Classification marking** | States the security classification of the whole product and, when required, each portion. |
| **Control marking** | Specifies restrictions on access, release, reproduction, or further dissemination. |
| **Handling instruction** | Gives operational directions for storing, transmitting, sharing, or destroying the product. |
| **Report identifier** | Unique identifier supporting retrieval, citation, audit, and version control. |
| **Title** | Identifies the subject and ideally conveys the principal analytic message. |
| **Product type** | Identifies the document as an assessment, estimate, warning, bulletin, information report, or other recognized product. |
| **Producing organization** | Names the organization accountable for the product. |
| **Publication date** | Date the product was issued. |
| **Information cutoff date** | Latest date through which information was considered. Later developments are outside the assessment. |
| **Version or status** | Identifies draft, coordinated, final, revised, corrected, or superseded status. |
| **Audience or customer** | Identifies the intended decision-maker or authorized readership. |
| **Distribution statement** | Records authorized recipients or dissemination channels. |
| **Author or contact** | Enables clarification, correction, feedback, and specialist follow-up. |

## 2. Executive layer

### Scope note

Defines precisely what the report covers and does not cover. It should state:

- Subject and geographic scope.
- Time period.
- Intelligence questions addressed.
- Important definitions.
- Major assumptions or constraints.
- Matters deliberately excluded.
- Information cutoff date if not stated elsewhere.

The scope note prevents readers from treating the product as an answer to a
question it did not examine.

### Intelligence question

The precise decision-relevant question the report must answer. A useful question
specifies the actor or issue, timeframe, and decision context.

Examples:

- What is Actor X trying to achieve during the next six months?
- How capable is Organization Y of conducting a sustained attack?
- Which conditions could destabilize Government Z?

### Executive summary or bottom line

A short, standalone statement of the answer and its significance. It normally
contains the principal judgment, strongest reason, expected consequence, and
main uncertainty.

### Key judgments

The report's most important analytic conclusions. Each key judgment should:

- Answer the intelligence question.
- Be clear and independently understandable.
- Be distinguishable from fact.
- Include likelihood when relevant.
- Identify important uncertainty or confidence.
- Be supported by the body.
- Explain decision relevance.

A key judgment is not merely a topic summary.

## 3. Main analytic body

### Context and background

Provides only the history, actors, concepts, and baseline conditions needed to
understand the assessment. It should not become a general encyclopedia of the
subject.

### Current situation

Describes relevant present conditions, recent changes, capabilities, actor
relationships, and observable trends. Facts and attributed reporting should be
distinguishable from interpretation.

### Analysis or discussion

Explains how the evidence supports the key judgments:

```text
Evidence -> interpretation -> judgment -> implication
```

The discussion normally examines:

- What is happening.
- Why it is happening.
- Relevant actors and relationships.
- Capabilities and intentions.
- Drivers and constraints.
- Evidence supporting and contradicting the assessment.
- Alternative explanations.

[ODNI ICD 203][icd203] requires analytic products to distinguish underlying
information, assumptions, and judgments.

### Outlook

Assesses the likely direction of developments during a specified period. It
identifies the expected development, conditions affecting the forecast, and
events that could invalidate it.

### Scenarios

Structured descriptions of distinct, plausible, decision-relevant futures.
Common categories include:

- Most likely.
- Plausible alternative.
- High-impact, low-probability.
- Best and worst case when operationally useful.

Scenarios are not exhaustive lists of everything imaginable.

### Implications

Explains why the assessment matters to the customer. Implications may concern
threat, opportunity, operational exposure, strategic effect, vulnerability, or
decision timing. National intelligence generally informs policy without
advocating a preferred policy.

### Indicators and warning

Lists observable developments that would support, weaken, or change the
assessment. Each indicator should state what might be observed, what it would
mean, and which judgment or scenario it affects.

### Intelligence gaps

Identifies consequential unknowns. A useful gap explains what is unknown, why it
matters, which judgment depends on it, and whether collection could resolve it.

## 4. Analytic assurance layer

### Evidence

Observations, reports, data, imagery, documents, signals, or measurements used to
support analysis. Storage in an intelligence system does not by itself make an
item true.

### Source citation

A retrievable reference connecting a statement or judgment to underlying
reporting. [ODNI ICD 206][icd206] requires sufficient sourcing for readers to
assess the quality and scope of the source base while avoiding an exhaustive
source dump.

### Source descriptor

A protected or generalized description of a source, such as "a source with
direct access" or "commercial satellite imagery." It communicates relevant
access and limitations without unnecessarily exposing identity or method.

### Source summary statement

A holistic assessment of the source base, including breadth, access,
corroboration, currency, bias or deception concerns, significant gaps, and the
sources most important to the judgments.

### Source reliability

Assessment of whether a source has historically provided authentic, accurate,
and dependable reporting. It evaluates the source, not the specific claim.

### Information credibility

Assessment of whether a specific item is direct, plausible, corroborated, and
consistent with other knowledge. A reliable source can be wrong. An untested
source can be right.

### Assumptions

Suppositions used to frame or bridge the analysis. A critical assumption should
be explicit, necessary, reasonable, tested where possible, and accompanied by
the consequences of it being wrong.

### Likelihood

The assessed probability that a statement is true or an event will occur.
Organizations should define terms such as "unlikely," "roughly even chance," and
"likely" through a probability yardstick.

### Analytic confidence

The assessed strength and stability of the basis for a judgment. It depends on
evidence quality, access, corroboration, consistency, method, assumptions, and
information gaps.

Likelihood and confidence are different:

- "An attack is likely" describes the event's assessed probability.
- "Confidence is low" describes weakness in the basis for that judgment.

The UK assessment community uses separate probability and confidence frameworks.
See [UK guidance on explaining uncertainty][uk-uncertainty].

### Alternative analysis

A serious examination of another explanation consistent with the evidence. It
states the alternative, supporting evidence, why it is not the principal
assessment, and what would make it more likely.

### Dissent

A documented substantive disagreement among analysts or participating
organizations. It should state the alternative judgment and reasoning, not
merely record that disagreement exists.

### Methodology

Explains data selection, definitions, models, structured analytic techniques,
comparison cases, time horizon, and important methodological limitations.

## 5. Annexes and supporting material

| Component | Purpose |
| --- | --- |
| **Maps** | Show locations, relationships, routes, ranges, or geographic constraints. |
| **Charts and graphs** | Present trends, comparisons, uncertainty, or quantitative evidence. |
| **Chronology** | Establish sequence, timing, and possible causality. |
| **Actor profile** | Summarize an actor's capabilities, intentions, relationships, and vulnerabilities. |
| **Capability table** | Record personnel, equipment, organization, readiness, or disposition. |
| **Glossary** | Define terms whose interpretation affects the analysis. |
| **Probability yardstick** | Define the product's estimative language. |
| **Detailed sourcing** | Provide references that would interrupt the main argument. |
| **Collection requirements** | Convert intelligence gaps into questions for collectors. |
| **Tearline** | Provide a separable, sanitized section suitable for wider distribution. |
| **Coordination record** | Identify participating organizations, concurrence, and dissent. |

[ODNI ICD 208][icd208] encourages tearlines and alternate versions when they
permit wider dissemination without changing facts, judgments, confidence, or
probability language.

## Minimum viable analytic report

```text
TITLE
DATE AND INFORMATION CUTOFF
INTELLIGENCE QUESTION

BOTTOM LINE
One direct answer and why it matters.

KEY JUDGMENTS
1. Judgment with likelihood.
2. Judgment with likelihood.
3. Judgment with likelihood.

ANALYSIS
Evidence and reasoning supporting each judgment.

UNCERTAINTY
Confidence, assumptions, gaps, and plausible alternatives.

OUTLOOK AND INDICATORS
Expected development and what would change the assessment.

SOURCES
Source summary and retrievable references.
```

## Structural quality test

A reader should be able to determine quickly:

1. What question was asked?
2. What is the answer?
3. Why does the analyst believe it?
4. What is fact, reporting, assumption, or judgment?
5. How uncertain is the judgment?
6. What could change the assessment?
7. Why does it matter?

[nie-example]: https://www.cia.gov/readingroom/docs/DOC_0001507657.pdf
[icd203]: https://www.odni.gov/files/documents/ICD/ICD-203.pdf
[icd206]: https://www.odni.gov/files/documents/ICD/ICD-206.pdf
[icd208]: https://www.odni.gov/files/documents/ICD/ICD-208-Maximizing-the-Utility-of-Analytic-Products-2017-01-09.pdf
[uk-uncertainty]: https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment

---

<!-- 11archive-source: 03-raw-reporting.md -->

# Raw Reporting

## Definition

**Raw reporting records and transmits what a source, sensor, document, or
collector observed or claimed before full integration and analysis.**

It is the principal input to intelligence analysis. Common forms include human
source reports, intercept transcripts, imagery reports, document translations,
field observations, and technical collection outputs.

"Raw" does not mean careless, false, or wholly unprocessed. Material may have
been translated, transcribed, decoded, formatted, geolocated, or initially
evaluated. It remains raw because it has not undergone the integration and
analysis required for finished intelligence.

The [ODNI/NCTC Intelligence Guide][nctc] describes information reports as
messages enabling timely dissemination of unevaluated intelligence. Declassified
CIA examples explicitly state that an intelligence information report is "not
finally evaluated intelligence." See this [CIA information-report example][cia-iir].

## Purpose

Raw reporting should:

- Preserve the source's meaning.
- Record provenance and collection context.
- Communicate timing and access.
- Separate observation from interpretation.
- Identify limitations and potential bias.
- Support later corroboration and analysis.
- Reach authorized users quickly enough to remain useful.

## Typical structure

| Field | Definition |
| --- | --- |
| **Classification and controls** | Security level and handling restrictions. |
| **Report number** | Unique identifier for retrieval, cross-reference, and evaluation. |
| **Country or area** | Geographic subject of the reporting. |
| **Subject or title** | Concise description of what the information concerns. |
| **Date of information** | When the reported event, condition, or observation occurred. |
| **Date of acquisition** | When the collector obtained the information. |
| **Date of report** | When the collector submitted or published the report. |
| **Place of acquisition** | Where the information was obtained, when releasable. |
| **Source descriptor** | Protected description or identifier explaining relevant source access. |
| **Source reliability** | Assessment of the source's historical dependability. |
| **Information credibility** | Assessment of the particular information's plausibility and corroboration. |
| **Summary** | Concise account of the most important reporting. |
| **Narrative** | Detailed presentation of what the source reported or the collector observed. |
| **Collector comments** | Context, clarification, or evaluation added by the collector and visibly separated from the source narrative. |
| **Attachments** | Documents, maps, imagery, recordings, sketches, or technical data. |
| **Handling instructions** | Restrictions protecting sources, methods, operations, investigations, or partner relationships. |
| **Distribution** | Authorized recipients. |
| **Collection requirement** | Question or requirement to which the report responds. |
| **Evaluation request** | Request for recipients to provide later feedback on accuracy or utility. |

Historical formats vary, but declassified intelligence information reports show
many of these fields. See the [CIA-hosted Department of Defense example][dod-iir].

## Content separation

A defensible raw report separates four things:

1. **Direct observation:** what the collector personally observed.
2. **Source statement:** what another person claimed or described.
3. **Document or sensor output:** what the collected artifact contains.
4. **Collector comment:** interpretation or contextual knowledge added by the
   reporting officer.

These categories must not be silently merged.

### Correct pattern

> Source stated that six military vehicles departed Base X at approximately
> 03:00 and travelled north. Source could not identify the vehicle models.
>
> Collector comment: Source had direct visual access but observed the movement
> in poor weather. No independent confirmation was available at time of report.

### Incorrect pattern

> The armed forces are preparing to invade.

The second statement converts an observation into an unsupported analytic
judgment.

## Source reliability and information credibility

These are separate evaluations:

- **Source reliability:** Is this source generally dependable, authentic, and
  accurate based on access and reporting history?
- **Information credibility:** Is this particular claim direct, plausible,
  internally consistent, and corroborated?

A historically reliable source can provide incorrect information. An untested
source can provide correct information. Neither rating should automatically
determine the other.

## Common limitations

Raw reporting can be:

- Accurate but incomplete.
- Authentic but misunderstood.
- Correctly reported but outdated.
- Deliberately deceptive.
- Distorted by source access, incentives, memory, or bias.
- Technically precise but contextually misleading.
- Duplicative of another report from the same original source.
- Transformed by translation or processing choices.

Analysts should therefore examine provenance, access, timing, corroboration,
possible circular reporting, denial and deception, and relevance to the
intelligence question.

## Quality checklist

- Is the source's statement preserved accurately?
- Are dates of information, acquisition, and reporting distinct?
- Is firsthand access distinguished from hearsay?
- Are collector comments clearly labeled?
- Are source reliability and information credibility evaluated separately?
- Are uncertainty and collection limitations stated?
- Are attachments and references retrievable?
- Are handling controls justified and clear?
- Does the report answer an identifiable collection requirement?

[nctc]: https://www.odni.gov/nctc/jcat/jcat_ctguide/intel_guide.html
[cia-iir]: https://www.cia.gov/readingroom/docs/1983_06_10_BACKGROUND_INFORMATION.pdf
[dod-iir]: https://www.cia.gov/readingroom/document/cia-rdp06t01849r000100020025-6

---

<!-- 11archive-source: 04-finished-intelligence-and-analytic-assessments.md -->

# Finished Intelligence and Analytic Assessments

## Definitions

**Finished intelligence** is an intelligence product resulting from the
collection, processing, integration, evaluation, analysis, and interpretation of
available information.

**An analytic assessment** is a finished intelligence product that answers a
defined intelligence question through supported judgments and explicit
communication of uncertainty.

The two terms are related but not identical. Finished intelligence is the wider
category. Assessments, estimates, warnings, and some analytic briefings are forms
of finished intelligence.

## Purpose

An analytic assessment should:

- Answer a decision-relevant question.
- Integrate relevant evidence from one or more sources.
- Explain what the evidence means.
- Distinguish facts, reporting, assumptions, and judgments.
- Test plausible alternative explanations.
- Communicate likelihood and analytic confidence.
- Identify gaps and conditions that could change the assessment.
- Explain implications without distorting analysis for policy preference.

## Raw input versus assessment

### Raw intelligence

> A source with direct access reported that the organization's leadership met
> twice during the past week. Several regional commanders attended.

This states what was reported. It does not establish why the meeting occurred or
what will happen next.

### Analytic assessment

> We assess that the organization is likely preparing a change in regional
> operations. Attendance by regional commanders, increased encrypted
> communications, and recent logistics movements distinguish the meetings from
> routine consultations. The basis for this judgment is moderately strong, but
> the agenda remains unknown.

The assessment adds:

- An explicit judgment.
- Evidence from several streams.
- Interpretation and comparison.
- Likelihood.
- Confidence rationale.
- A material information gap.

## Core analytic structure

```text
Question
    -> relevant evidence
    -> source evaluation
    -> assumptions
    -> competing explanations
    -> reasoning
    -> judgment
    -> likelihood and confidence
    -> implications
    -> indicators and gaps
```

## Facts, assumptions, and judgments

| Category | Meaning | Example |
| --- | --- | --- |
| **Fact or established information** | Information treated as sufficiently verified for the product's purpose. | Commercial imagery shows twelve vehicles at Base X on 10 August. |
| **Attributed reporting** | A claim preserved with its source attribution and qualification. | A source with direct access reports that the unit received new orders. |
| **Assumption** | A supposition required to frame or bridge the analysis. | We assume the observed exercise schedule remains valid. |
| **Judgment** | An analytic conclusion derived from evidence, reasoning, and assumptions. | We assess the movement is probably part of an exercise. |
| **Implication** | The consequence of the judgment for the customer or operating environment. | The movement temporarily increases the risk of accidental escalation. |

[ODNI ICD 203][icd203] requires these categories to be properly distinguished.

## Likelihood and confidence

### Likelihood

Likelihood concerns the assessed probability of a proposition or event. Terms
such as "unlikely," "roughly even chance," and "likely" should have published
definitions.

### Analytic confidence

Confidence concerns the strength and stability of the basis for a judgment. It
is affected by:

- Source access and credibility.
- Evidence quantity and quality.
- Corroboration or contradiction.
- Methodological strength.
- Topic knowledge.
- Dependence on assumptions.
- Nature and size of information gaps.

Likelihood and confidence must not be treated as synonyms. A high-probability
event can be assessed with low confidence if the evidence is weak. A low-
probability event can be assessed with high confidence if strong evidence shows
that it is improbable. See [UK guidance on explaining uncertainty][uk-uncertainty].

## Source transparency

The reader needs enough sourcing information to understand the basis and
limitations of the judgments. [ODNI ICD 206][icd206] identifies four principal
sourcing mechanisms:

- Source reference citations.
- Appended reference citations.
- Source descriptors.
- Source summary statements.

Source transparency does not require revealing protected identities or methods.
It requires communicating the characteristics that materially affect evaluation.

## Alternative analysis

Alternative analysis tests whether the evidence reasonably supports another
explanation. It is more than mentioning a remote possibility.

A useful alternative section states:

1. The competing explanation.
2. Evidence that supports it.
3. Evidence that weakens it.
4. Why it is not the principal assessment.
5. Indicators that would make it more likely.

## Dissent

Dissent records a material difference in analytic judgment. It should preserve
the alternative conclusion and reasoning so the customer can understand the
substance of the disagreement. Consensus should not be manufactured by removing
meaningful differences.

## Outlook and indicators

A forecast should specify its time horizon. It should identify indicators that
would support, weaken, or overturn the forecast.

Example:

> Deployment of fuel units and field hospitals toward the border would increase
> the assessed likelihood of sustained operations rather than a short exercise.

This makes the judgment testable and supports warning.

## What an assessment is not

An analytic assessment is not:

- A source report rewritten without attribution.
- A collection of facts without a conclusion.
- A prediction presented as certainty.
- An argument selected to support a preferred policy.
- A list of every conceivable scenario.
- A confident tone replacing weak evidence.
- A conclusion whose sourcing and reasoning cannot be traced.

## Quality checklist

- Does the product answer a clear intelligence question?
- Are key judgments explicit and supported?
- Can the reader distinguish information, assumptions, and judgments?
- Are important sources and limitations described?
- Are likelihood and confidence used correctly?
- Are contradictory evidence and plausible alternatives considered?
- Are critical assumptions explicit and tested?
- Are important gaps identified?
- Is there a defined outlook period?
- Are indicators provided for changing the assessment?
- Is the analysis objective, timely, relevant, and clear?

[icd203]: https://www.odni.gov/files/documents/ICD/ICD-203.pdf
[icd206]: https://www.odni.gov/files/documents/ICD/ICD-206.pdf
[uk-uncertainty]: https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment

---

<!-- 11archive-source: 05-intelligence-briefings.md -->

# Intelligence Briefings

## Definition

**An intelligence briefing is a concise, audience-specific presentation of
information or intelligence intended to create understanding, support a
decision, or prompt appropriate action.**

It usually combines oral explanation, selected evidence, analytic judgments,
visual aids, uncertainty, implications, and questions and answers. "Briefing"
can also refer informally to a briefing note, slide deck, map set, or other
supporting product. Formally, it usually means the presentation event.

UK joint doctrine identifies verbal briefing, printed material, and electronic
delivery as principal intelligence dissemination methods. See [UK Joint Doctrine
Publication 2-00][jdp200]. The [ODNI overview][odni-what] similarly states that
intelligence products may be delivered through papers, digital media,
briefings, maps, graphics, and video.

## Relationship to intelligence and reporting

```text
Collection
    -> raw reporting
    -> evaluation and analysis
    -> finished intelligence
    -> dissemination
       -> written report
       -> electronic product
       -> verbal briefing
```

- **Intelligence is the substance.**
- **Reporting records or publishes the substance.**
- **A report is a durable written or electronic product.**
- **A briefing is a tailored delivery method.**

## Report versus briefing

| Dimension | Report | Briefing |
| --- | --- | --- |
| **Format** | Written or electronic | Usually oral and visual |
| **Timing** | Usually asynchronous | Usually synchronous |
| **Interaction** | Questions normally follow later | Questions can be answered immediately |
| **Detail** | Can preserve extensive evidence and reasoning | Selects and compresses what the audience needs |
| **Adaptation** | Fixed after publication | Can adapt to audience response during delivery |
| **Record** | Durable, searchable, and citable | Ephemeral unless recorded or supported by retained material |
| **Main strength** | Precision, traceability, and depth | Speed, emphasis, explanation, and feedback |
| **Main risk** | Important content may remain unread | Compression can remove qualifications or oversimplify uncertainty |

## Standard briefing structure

### 1. Purpose

State why the briefing is occurring, who it serves, and what decision or
intelligence question it supports.

### 2. Bottom line

Give the most important answer immediately. Do not force the audience to infer
the conclusion from background detail.

### 3. Key judgments

Present the principal conclusions in priority order. Each judgment should be
understandable, supported, and qualified where necessary.

### 4. Supporting evidence

Present only the evidence necessary to explain and defend the judgments. Clearly
attribute reporting and distinguish it from analytic interpretation.

### 5. Uncertainty

State likelihood, confidence, critical assumptions, intelligence gaps, source
limitations, and relevant ambiguity.

### 6. Alternative explanation

Explain the principal plausible alternative and what evidence would make it more
likely.

### 7. Implications

Explain why the assessment matters to this particular audience. Focus on threats,
opportunities, vulnerabilities, consequences, and timing.

### 8. Outlook and indicators

State what is expected during a defined period and what observable developments
would change the assessment.

### 9. Questions and answers

Allow clarification and challenge. Distinguish answers supported by the product
from preliminary views requiring follow-up.

### 10. Follow-up

Record unanswered questions, corrections, requested detail, new collection
requirements, and deadlines.

## Can raw reporting be briefed?

Yes. Urgent events may require communicating raw reporting before full
evaluation. The briefer must label its status and limitations clearly.

Example:

> This is a single-source report received 30 minutes ago. It has not been
> independently corroborated or fully evaluated.

The briefer should not convert it silently into established fact or a finished
judgment.

| Briefing form | Example |
| --- | --- |
| **Raw-report briefing** | A source reports movement of six vehicles. |
| **Finished-intelligence briefing** | We assess the movement is probably part of an exercise. |
| **Warning briefing** | Additional logistics movement would indicate increased preparation for sustained operations. |
| **Decision briefing** | The exercise creates these risks and decision points for the customer. |

## Audience adaptation

Adaptation changes selection, depth, sequence, terminology, and presentation. It
must not change the facts, judgment, probability, or confidence to please the
audience.

Before delivery, determine:

- Who is attending?
- What do they already know?
- What decision or action do they face?
- How much time is available?
- Which judgments are essential?
- Which visuals materially improve understanding?
- Which questions or objections are likely?
- What information cannot be shared with every attendee?

## Role of the briefer

The briefer is not merely a reader of slides. The briefer should:

- Understand the underlying reporting and analytic reasoning.
- Preserve caveats during compression.
- Explain why a judgment matters.
- Answer questions within the evidence.
- Say when an answer is unknown or preliminary.
- Capture customer feedback accurately.
- Return new questions to analysts and collectors.

CIA describes President's Daily Brief briefers as links between intelligence
producers and senior decision-makers. They distill reporting and finished
analysis, conduct short briefings, capture questions, and return feedback to the
community. See [CIA, A Day in the Life of a PDB Briefer][pdb-briefer].

## Briefing quality checklist

- Is the purpose explicit?
- Is the bottom line first?
- Are the key judgments clear and prioritized?
- Are reporting and analytic judgment distinguishable?
- Are likelihood and confidence communicated accurately?
- Are critical assumptions and gaps preserved?
- Are visuals necessary, legible, and sourced?
- Is the briefing tailored without distorting the analysis?
- Is time reserved for questions?
- Are unanswered questions and follow-up actions recorded?

[jdp200]: https://assets.publishing.service.gov.uk/media/653a4b0780884d0013f71bb0/JDP_2_00_Ed_4_web.pdf
[odni-what]: https://www.odni.gov/index.php/what-we-do/what-is-intelligence
[pdb-briefer]: https://www.cia.gov/stories/story/a-day-in-the-life-of-a-pdb-briefer/

---

<!-- 11archive-source: 06-comparisons-and-workflow.md -->

# Comparisons and Production Workflow

## Core comparison

| Dimension | Raw reporting | Analytic assessment | Intelligence briefing |
| --- | --- | --- | --- |
| **Core question** | What was observed or claimed? | What does the available information mean? | What does this audience need to understand now? |
| **Purpose** | Preserve and transmit collected information | Reduce uncertainty through supported judgments | Deliver selected information or analysis efficiently |
| **Typical source base** | One source, sensor, document, or collection event | Multiple relevant sources when available | Raw or finished intelligence selected for the audience |
| **Evaluation** | Initial source and information evaluation | Evidence compared, corroborated, contradicted, and weighed | Evaluation inherited from the content and explained orally |
| **Interpretation** | Limited; collector comments separated | Central purpose | Communicated and defended interactively |
| **Conclusion** | Normally none | Explicit key judgments | Bottom line and prioritized judgments |
| **Uncertainty** | Source reliability and information credibility | Likelihood, confidence, assumptions, alternatives, and gaps | Essential uncertainty compressed but preserved |
| **Outlook** | Usually absent | Often included | Included when decision-relevant |
| **Producer** | Collector, reporting officer, sensor operator, translator | Analyst or coordinated analytic team | Analyst, dedicated briefer, or subject-matter expert |
| **Persistence** | Durable report or record | Durable product | Presentation event, often supported by retained material |

## Raw reporting versus finished intelligence

Raw reporting tells the reader **what a source observed or claimed**. Finished
intelligence tells the reader **what the available information probably means**.

```text
Raw reporting:
"Source A says X."

Corroborated information:
"Independent Sources A and B indicate X."

Finished intelligence:
"X, considered with Y and Z, probably means A."
```

Finished intelligence is not merely a shorter version of raw reporting. Its
added value is the reasoned judgment connecting evidence to meaning,
consequences, and possible future developments.

## Raw intelligence versus analytic assessment

Raw intelligence is the **input**. An analytic assessment is a **finished
product derived from relevant inputs**.

Raw intelligence can be accurate but misleading when isolated from context. An
analytic assessment can also be wrong because evidence is incomplete and
reasoning or assumptions may fail.

Therefore:

- Evaluate raw intelligence for provenance, source reliability, information
  credibility, access, timing, and corroboration.
- Evaluate an assessment for evidentiary support, reasoning, alternatives,
  uncertainty, objectivity, clarity, and relevance.

## Reporting versus briefing

Reporting creates or transmits a durable record. Briefing communicates selected
content directly to an audience and enables immediate interaction.

```text
Intelligence = substance
Report       = durable product
Briefing     = tailored delivery method
```

A report provides depth and traceability. A briefing provides prioritization,
explanation, speed, and feedback. Strong intelligence systems normally use both.

## End-to-end workflow

### 1. Requirement

The customer defines a question, decision need, priority, and timeframe.

**Output:** intelligence requirement or key intelligence question.

### 2. Collection planning

Existing knowledge and gaps are reviewed. Appropriate sources and collection
methods are identified and tasked.

**Output:** collection plan and collection requirements.

### 3. Collection

Human, technical, documentary, geospatial, and open sources produce data and
information.

**Output:** collected material.

### 4. Processing and exploitation

Material is translated, decrypted, transcribed, geolocated, normalized,
interpreted, or otherwise made usable.

**Output:** exploitable information.

### 5. Raw reporting

Collected information is documented with provenance, timing, source context,
initial evaluation, handling controls, and relevant attachments.

**Output:** information report or technical report.

### 6. Evaluation and integration

Analysts assess reliability, credibility, relevance, corroboration,
contradiction, duplication, and gaps. Related reporting is combined.

**Output:** organized evidentiary base.

### 7. Analysis

Analysts test explanations, identify assumptions, consider alternatives, form
judgments, and assess uncertainty.

**Output:** analytic argument and judgments.

### 8. Production and review

The argument is converted into an assessment, estimate, warning, bulletin, or
other product. Review tests accuracy, sourcing, logic, tradecraft, clarity,
security, and relevance.

**Output:** finished intelligence.

### 9. Dissemination

The product is delivered through a report, briefing, electronic system, map,
graphic, video, or other authorized format.

**Output:** intelligence available to the customer.

### 10. Decision and feedback

The customer uses the product, asks questions, identifies missing information,
or changes priorities. Producers record corrections and follow-up.

**Output:** decisions, feedback, and refined requirements.

## Quality controls by stage

| Stage | Principal quality question |
| --- | --- |
| **Requirement** | Is the question specific, relevant, and answerable? |
| **Collection** | Is the material responsive, lawful, timely, and properly handled? |
| **Raw reporting** | Are provenance, access, timing, and source meaning preserved? |
| **Evaluation** | Are reliability and credibility assessed without conflation? |
| **Analysis** | Do the evidence and reasoning support the judgment? |
| **Uncertainty** | Are likelihood, confidence, assumptions, gaps, and alternatives explicit? |
| **Production** | Is the product clear, objective, sourced, and decision-relevant? |
| **Briefing** | Is the essential message preserved during compression? |
| **Feedback** | Are questions, errors, and new requirements captured? |

## Compact example

### Raw report

> A source reported six vehicles leaving Base X at 03:00. The source could not
> identify the models because of poor visibility.

### Integrated information

> Commercial imagery confirms six vehicle-sized objects north of Base X. A
> separate communications intercept indicates a scheduled readiness exercise.

### Analytic assessment

> We assess the movement is probably part of a readiness exercise rather than
> preparation for an attack. Similar movements preceded earlier exercises, and
> no supporting fuel or medical units have deployed. The basis for this judgment
> is moderately strong.

### Briefing

> Bottom line: the movement probably reflects an exercise. We have corroborated
> the movement through imagery and communications, but we would reassess if fuel
> units or field hospitals deploy toward the border.

## Failure modes

| Failure | Consequence | Correction |
| --- | --- | --- |
| Source claim presented as fact | Inflated certainty | Attribute and qualify the claim. |
| Collector comment merged with source narrative | Lost provenance | Label observation, source statement, and comment separately. |
| Summary substituted for analysis | No analytic value | Explain reasoning and form explicit judgments. |
| Likelihood confused with confidence | Miscommunicated uncertainty | State event probability and evidentiary strength separately. |
| Alternative mentioned but not tested | Token challenge only | Compare supporting and contradicting evidence. |
| Briefing removes caveats | Decision-maker receives false certainty | Preserve material uncertainty in the bottom line. |
| Excessive background | Key judgment obscured | Include only context needed to understand the answer. |
| Recommendation drives judgment | Politicized analysis | Separate analytic conclusion from policy preference. |

## Sources

- [ODNI/NCTC Intelligence Guide](https://www.odni.gov/nctc/jcat/jcat_ctguide/intel_guide.html)
- [ODNI ICD 203: Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf)
- [ODNI ICD 206: Sourcing Requirements](https://www.odni.gov/files/documents/ICD/ICD-206.pdf)
- [UK Joint Doctrine Publication 2-00](https://assets.publishing.service.gov.uk/media/653a4b0780884d0013f71bb0/JDP_2_00_Ed_4_web.pdf)

---

<!-- 11archive-source: GLOSSARY.md -->

# Intelligence Reporting and Analysis Glossary

This glossary defines the principal terms used in intelligence collection,
reporting, analysis, production, and briefing. Definitions are general working
definitions. Individual organizations may use narrower legal or doctrinal
meanings.

## A

### All-source intelligence

Intelligence produced by integrating all relevant and available source types or
collection disciplines, rather than relying on a single discipline.

### Alternative analysis

Structured examination of a plausible explanation or outcome that differs from
the principal assessment.

### Analytic argument

The logical connection among evidence, assumptions, interpretation, judgments,
and implications.

### Analytic assessment

A finished intelligence product that answers a defined intelligence question
through supported judgments and explicit treatment of uncertainty.

### Analytic confidence

An assessment of the strength and stability of the basis for a judgment. It is
influenced by evidence quality, source access, corroboration, methodology,
assumptions, expertise, and information gaps.

### Analytic judgment

A conclusion based on underlying information, reasoning, and assumptions. A
judgment is not identical to an observed fact.

### Analytic line

The coherent set of judgments and reasoning an organization maintains on a
subject across one or more products.

### Analytic product

A report, estimate, warning, briefing, visual, or other product whose principal
value comes from analysis and judgment.

### Analysis

The process of evaluating, integrating, and interpreting information to identify
meaning, test explanations, answer questions, and draw conclusions.

### Assumption

A supposition used to frame or support an argument, especially where direct
information is missing. A critical assumption materially affects a key judgment.

### Attribution

Identification or description of the source from which information or a claim
originated.

## B

### Background

Historical, geographic, political, technical, or operational context needed to
understand a current assessment.

### Baseline

The established reference condition against which change, anomaly, or trend is
measured.

### Bottom line

The concise principal answer or judgment presented at the beginning of a report
or briefing. Often called BLUF, meaning "bottom line up front."

### Brief

A concise written, visual, or oral presentation of essential information. The
term can refer to either a short product or the act of presenting it.

### Briefer

The person who presents and explains intelligence to an audience, answers
questions, and captures feedback or follow-up requirements.

### Briefing

A concise, audience-specific presentation intended to create understanding,
support a decision, or prompt appropriate action. It is usually oral and visual.

### Briefing note

A short written product prepared to support a meeting, oral briefing, or
decision.

### Bulletin

A short intelligence product focused on a particular event, issue, incident, or
development.

## C

### Caveat

A qualification, limitation, or warning affecting interpretation, confidence,
use, or dissemination.

### Circular reporting

The appearance of independent corroboration when several reports actually derive
from the same original source.

### Classification

A formal security designation based on the sensitivity of information and the
expected harm from unauthorized disclosure.

### Collection

The acquisition of data and information to satisfy intelligence requirements.

### Collection discipline

A category of intelligence collection, such as human intelligence, signals
intelligence, geospatial intelligence, measurement and signature intelligence,
or open-source intelligence.

### Collection gap

Required information that existing collection has not obtained.

### Collection plan

A structured plan identifying what information is needed, potential sources and
methods, priorities, responsibilities, and timing.

### Collection requirement

A specific request or task directing collection against an identified knowledge
need.

### Collector

A person, unit, organization, or technical system that acquires intelligence
information.

### Collector comment

Context, clarification, or preliminary evaluation added by a collector and kept
separate from a source statement or direct observation.

### Confidence statement

An explanation of the strength and limitations of the basis for an analytic
judgment.

### Control marking

A marking specifying restrictions on access, use, release, or further
dissemination beyond the basic classification level.

### Coordination

The process through which participating analysts or organizations review a
product, identify disagreements, and record concurrence or dissent.

### Corroboration

Independent evidence that supports or confirms an item of information or an
analytic proposition.

### Credibility

The assessed believability of a specific item of information based on factors
such as directness, plausibility, consistency, and corroboration.

### Current intelligence

Timely intelligence focused on recent or unfolding developments and their
immediate significance.

### Customer

The authorized person or organization whose requirement, decision, or activity
the intelligence is intended to support.

## D

### Data

Unprocessed observations, measurements, records, signals, images, or statements.

### Date of acquisition

The date on which a collector obtained the information.

### Date of information

The date or period to which the reported event, condition, or observation
relates.

### Date of report

The date on which reporting was submitted or published.

### Decision advantage

The benefit created when relevant and timely intelligence allows a decision-maker
to understand, decide, or act better than would otherwise be possible.

### Denial and deception

Measures intended to conceal relevant facts, mislead collection, or cause an
analyst or decision-maker to reach an incorrect conclusion.

### Dissemination

The timely delivery of intelligence to authorized customers in a suitable oral,
written, visual, or electronic form.

### Dissent

A documented material disagreement with a principal analytic judgment or its
reasoning.

## E

### Estimate

A forward-looking intelligence assessment of the likelihood, direction, or
consequences of future developments.

### Estimative language

Standardized words used to communicate probability or uncertainty, such as
"unlikely," "roughly even chance," and "likely."

### Evaluation

Assessment of the reliability, credibility, relevance, accuracy, and limitations
of collected information and its source.

### Evidence

Observations, reporting, data, imagery, documents, signals, or measurements used
to support or challenge an analytic proposition.

### Executive summary

A short, standalone overview of the question, principal answer, key reasoning,
implications, and major uncertainty.

### Exploitation

The conversion of collected material into usable information through activities
such as translation, transcription, decryption, geolocation, measurement, or
imagery interpretation.

## F

### Fact

Information treated as sufficiently verified for the purpose of the product. The
label does not imply permanent or absolute certainty.

### Feedback

Questions, corrections, evaluation, decisions, and new requirements returned by
customers, analysts, or collectors after dissemination.

### Finished intelligence

An intelligence product resulting from the collection, processing, integration,
evaluation, analysis, and interpretation of available information.

### Forecast

An analytic judgment about a future condition, development, or event within a
defined timeframe.

## G

### Gap

Important information that is unavailable, uncertain, or insufficient to answer
an intelligence question or support a judgment.

### Geospatial intelligence (GEOINT)

Intelligence derived from exploiting and analyzing imagery and geospatial
information to describe, assess, and visually depict geographically referenced
features and activities.

## H

### Handling instruction

A direction governing storage, transmission, release, reproduction,
dissemination, or destruction of intelligence material.

### High-impact, low-probability scenario

A plausible outcome judged unlikely but important enough to examine because its
consequences would be severe.

### Human intelligence (HUMINT)

Intelligence derived from information collected from human sources.

## I

### Implication

The consequence or significance of an analytic judgment for a customer,
operation, policy environment, threat, or opportunity.

### Indicator

An observable development that supports, weakens, or changes an assessment or
provides warning of a possible event.

### Information

Data given enough context to convey meaning.

### Information credibility

Assessment of the plausibility, directness, consistency, and corroboration of a
specific item of information.

### Information cutoff date

The latest date through which information was considered in an analytic product.

### Information report

A product used to transmit collected intelligence information, commonly before
full integration and analysis.

### Intelligence

Information collected, evaluated, integrated, and interpreted to reduce
uncertainty and support decisions. The term can also refer to the process and the
organizations performing it.

### Intelligence assessment

See **analytic assessment**.

### Intelligence Community

The federation or system of government organizations authorized to conduct
intelligence activities. Capitalization often indicates a formally defined
national community.

### Intelligence cycle

A management model comprising direction, collection, processing, exploitation,
analysis, production, dissemination, and feedback.

### Intelligence gap

An important unknown that limits understanding or confidence and may generate a
new collection or research requirement.

### Intelligence information

Collected information considered relevant to an intelligence purpose but not
necessarily fully evaluated or analyzed.

### Intelligence Information Report (IIR)

A formal report used by some organizations to disseminate collected information,
often including source description, dates, evaluation, summary, narrative, and
handling instructions.

### Intelligence question

A defined question that collection or analysis must answer. Also called a key
intelligence question when prioritized within a product.

### Intelligence requirement

A defined knowledge need that guides collection, analysis, production, or all
three.

### Intelligence warning

Communication of a development that may create a consequential threat,
opportunity, or material change requiring attention.

## J

### Judgment

See **analytic judgment**.

## K

### Key intelligence question

A principal question whose answer is necessary to satisfy the purpose of an
assessment.

### Key judgment

One of the report's most important decision-relevant analytic conclusions.

## L

### Likelihood

The assessed probability that a proposition is true or an event will occur.

### Limitation

A condition affecting the completeness, reliability, relevance, method, or
interpretation of intelligence.

## M

### Measurement and signature intelligence (MASINT)

Intelligence derived from technical measurement and analysis of distinctive
physical characteristics, emissions, or signatures associated with a source,
system, or event.

### Metadata

Structured information describing a report or dataset, such as identifier,
producer, dates, classification, subject, location, or source type.

### Methodology

The methods, definitions, models, data-selection rules, and analytic techniques
used to produce an assessment.

### Most likely scenario

The future pathway judged more probable than the identified alternatives. It is
not a claim of certainty.

## N

### Narrative

The detailed body of a raw information report presenting what a source reported
or what a collector observed.

### Need to know

The determination that a prospective recipient requires access to specific
information to perform an authorized function. Clearance alone may not establish
need to know.

## O

### Objectivity

The professional obligation to base analysis on evidence and sound reasoning,
recognize bias, consider contrary information, and remain independent of desired
policy outcomes.

### Open-source intelligence (OSINT)

Intelligence produced from publicly or commercially available information that
has been collected, evaluated, and analyzed for an intelligence purpose.

### Outlook

The section of an assessment describing expected future developments during a
specified period.

## P

### Policy neutrality

The principle that analytic judgments should not be shaped or distorted to
advocate a preferred policy, agenda, or political outcome.

### Portion marking

A classification or control marking applied to an individual paragraph, heading,
table, or other portion of a document.

### Probability yardstick

A standardized mapping between qualitative estimative terms and approximate
probability ranges.

### Processing

Actions that convert collected data into a form suitable for exploitation,
evaluation, analysis, or dissemination.

### Product type

The recognized category of an intelligence product, such as report, bulletin,
assessment, estimate, warning, profile, or briefing.

### Provenance

The origin, chain of custody, processing history, and contextual lineage of
information.

## R

### Raw data

Collected data that has not yet been sufficiently processed or contextualized to
provide useful intelligence meaning.

### Raw intelligence

Collected intelligence information not yet fully vetted, validated, integrated,
or analyzed.

### Raw reporting

Documentation and transmission of what a source, sensor, document, or collector
observed or claimed before full analytic integration.

### Reliability

The assessed historical dependability, authenticity, and accuracy of a source or
collection channel.

### Report

A durable written or electronic product that records or communicates information,
analysis, or both.

### Reporting

The activity of recording and transmitting collected information or publishing
analytic content. Context is needed because the term can refer to raw reporting
or finished reporting.

### Requirement

See **intelligence requirement** or **collection requirement**.

### Review

Substantive examination of a product's facts, sourcing, logic, uncertainty,
tradecraft, relevance, clarity, and security before dissemination.

## S

### Sanitization

Removal or generalization of sensitive information so material can be shared
more widely without exposing protected sources, methods, identities, or
operations.

### Scenario

A coherent description of a plausible future pathway used to examine outcomes,
drivers, consequences, and indicators.

### Scope note

A section defining the subject, questions, timeframe, geographic coverage,
assumptions, constraints, and exclusions of an intelligence product.

### Signal

An observed development potentially indicating a meaningful change. In warning
analysis, a signal must be distinguished from noise.

### Signals intelligence (SIGINT)

Intelligence derived from intercepted signals, including communications and
other electronic emissions, when collected by an authorized party other than the
intended recipient.

### Situation report

A time-sensitive update describing current events, operational conditions,
significant changes, and immediate implications.

### Source

A person, sensor, document, dataset, organization, or collection channel from
which information originates.

### Source access

The source's position, capability, or relationship enabling direct or indirect
knowledge of the reported information.

### Source descriptor

A protected or generalized description of a source that communicates relevant
access, expertise, motivation, or limitations without unnecessarily revealing
identity or method.

### Source evaluation

Assessment of source reliability, access, validation, motivation, bias,
expertise, and possible susceptibility to deception.

### Source reference citation

A retrievable reference linking a statement or judgment to its underlying
reporting.

### Source reliability

See **reliability**.

### Source summary statement

A holistic explanation of the strengths, weaknesses, breadth, access,
corroboration, currency, bias concerns, and gaps in the source base supporting an
analytic product.

### Strategic intelligence

Intelligence addressing long-term capabilities, intentions, trends, risks, and
opportunities relevant to senior-level decisions.

### Summary

A concise restatement of the principal content. In raw reporting it highlights
the source narrative. In finished intelligence it may summarize judgments and
implications.

## T

### Tactical intelligence

Intelligence intended to support immediate operations, investigations, force
protection, targeting, or other near-term activity.

### Tearline

A separable or sanitized portion of an intelligence product designed for release
at a lower classification or to a wider authorized audience.

### Timeliness

The quality of reaching the customer early enough to remain relevant and
actionable.

### Trend

A persistent direction or pattern of change identified across time or repeated
observations.

## U

### Uncertainty

The remaining doubt surrounding information, interpretation, judgment, or
forecast because of incomplete evidence, ambiguity, source limitations,
assumptions, or the inherent unpredictability of the subject.

## V

### Validation

The process of checking the authenticity, integrity, performance, or claimed
access of a source, method, dataset, or item of information.

### Vetting

Systematic examination of a source, person, organization, or information item to
identify authenticity, reliability, risk, bias, or relevant adverse information.

## W

### Warning

Notification that a consequential threat, opportunity, or change may be
developing and may require attention or action.

### Warning indicator

An observable event or condition associated with movement toward a defined
warning scenario.

## Principal references

- [ODNI/NCTC Intelligence Guide](https://www.odni.gov/nctc/jcat/jcat_ctguide/intel_guide.html)
- [ODNI ICD 203: Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf)
- [ODNI ICD 206: Sourcing Requirements](https://www.odni.gov/files/documents/ICD/ICD-206.pdf)
- [UK Joint Doctrine Publication 2-00](https://assets.publishing.service.gov.uk/media/653a4b0780884d0013f71bb0/JDP_2_00_Ed_4_web.pdf)

---

<!-- 11archive-source: SOURCES.md -->

# Sources

Official and primary sources used for this initial research. Accessed 11 August
2026.

## Analytic doctrine and definitions

### Office of the Director of National Intelligence

- [What Is Intelligence?](https://www.odni.gov/index.php/what-we-do/what-is-intelligence)
  
  Overview of the intelligence cycle, intelligence customers, collection
  disciplines, all-source production, and dissemination formats.

- [ODNI/NCTC Intelligence Guide](https://www.odni.gov/nctc/jcat/jcat_ctguide/intel_guide.html)
  
  Definitions of intelligence, raw intelligence, finished intelligence,
  intelligence activity, information reports, dissemination, collection, and
  estimative language.

- [ICD 203: Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf)
  
  US Intelligence Community standards for objectivity, political independence,
  timeliness, all-source analysis, sourcing, uncertainty, assumptions,
  alternatives, logical argument, relevance, clarity, and explanation of changed
  judgments.

- [ICD 206: Sourcing Requirements for Disseminated Analytic Products](https://www.odni.gov/files/documents/ICD/ICD-206.pdf)
  
  Requirements for source reference citations, appended citations, source
  descriptors, and source summary statements.

- [ICD 208: Maximizing the Utility of Analytic Products](https://www.odni.gov/files/documents/ICD/ICD-208-Maximizing-the-Utility-of-Analytic-Products-2017-01-09.pdf)
  
  Guidance on customer focus, analytic standards, reuse, discoverability,
  tearlines, alternate versions, and sourcing.

### UK government

- [UK Ministry of Defence, Joint Doctrine Publication 2-00, Understanding and Intelligence Support to Joint Operations](https://assets.publishing.service.gov.uk/media/653a4b0780884d0013f71bb0/JDP_2_00_Ed_4_web.pdf)
  
  Doctrine covering intelligence functions, assessment, uncertainty,
  dissemination, verbal briefing, printed reporting, electronic delivery, and
  customer-appropriate formatting.

- [Explaining Uncertainty in UK Intelligence Assessment](https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment)
  
  Official explanation of the Probability Yardstick and Analytical Confidence
  Rating framework. Useful for distinguishing likelihood from confidence.

## Declassified report structures

### Central Intelligence Agency

- [Declassified National Intelligence Estimate example](https://www.cia.gov/readingroom/docs/DOC_0001507657.pdf)
  
  Demonstrates the recurring National Intelligence Estimate structure of Scope
  Note, Key Judgments, Discussion, conclusion, and supporting sections.

- [Declassified Intelligence Information Report example](https://www.cia.gov/readingroom/docs/1983_06_10_BACKGROUND_INFORMATION.pdf)
  
  Demonstrates raw information reporting, including the statement that the
  product is not finally evaluated intelligence, plus country, subject, date,
  source, summary, and narrative fields.

- [CIA-hosted Department of Defense Intelligence Information Report](https://www.cia.gov/readingroom/document/cia-rdp06t01849r000100020025-6)
  
  Demonstrates report number, title, country, dates, acquisition, source and
  information evaluation, references, special instructions, and controls.

- [Air Intelligence Information Report example](https://www.cia.gov/readingroom/docs/CIA-RDP81-01043R004300140003-2.pdf)
  
  Demonstrates source description, subject, summary, narrative, distribution,
  attachments, classification, and handling warnings.

## Intelligence production and briefing

### Central Intelligence Agency

- [Directorate of Analysis](https://www.cia.gov/about/organization/directorate-of-analysis/)
  
  Current official description of intelligence analysis, written products,
  visuals, policy support, briefings, and the President's Daily Brief.

- [A Day in the Life of a PDB Briefer](https://www.cia.gov/stories/story/a-day-in-the-life-of-a-pdb-briefer/)
  
  Describes how briefers review raw and finished intelligence, distill material
  for senior customers, answer questions, and return feedback to producers.

- [Voice of Experience: Principles of Intelligence Analysis](https://www.cia.gov/resources/csi/static/Article-Principles-of-Intelligence-Analysis-Studies65-4-Dec2021.pdf)
  
  Practitioner guidance on assembling, presenting, reviewing, and briefing
  intelligence analysis.

- [Making the Analytic Review Process Work](https://www.cia.gov/resources/csi/static/Analytic-Review-Process-Work.pdf)
  
  Practitioner discussion of substantive review, evidence, sourcing, analytic
  argument, alternatives, relevance, and writing quality.

## Independent official evaluation

### US Department of Justice, Office of the Inspector General

- [Review of Selected Intelligence Reports](https://oig.justice.gov/sites/default/files/legacy/reports/EOUSA/e0603/final.pdf)
  
  Official evaluation noting that analytic reports should identify purpose,
  contain conclusions or key findings, and identify sources so readers can
  assess reliability.

## Notes on use

- Doctrine describes required principles but does not establish a single global
  report template.
- Declassified examples show real structures but may reflect the terminology and
  security practices of their period.
- Probability vocabularies and source-grading systems differ among
  organizations. A product should define the framework it uses.
- Public examples are often sanitized and therefore do not expose the full
  sourcing, handling, or coordination detail of operational products.
