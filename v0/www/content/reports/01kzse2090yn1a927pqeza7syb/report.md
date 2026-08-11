<!-- 11archive-source: README.md -->

# Myers-Briggs: A Working Reference

**Created:** 2026-08-11
**Audience:** anyone who has to decide what to do about the MBTI. HR and people leaders being sold a
workshop, coaches and consultants who use it, researchers and builders who label people or models with
four letters, and anyone who has been handed a type and wants to know what it means.
**Objective:** set out what the Myers-Briggs Type Indicator is, what its own numbers show, what the
best arguments on each side are, and what to use instead when a decision depends on the answer.
**Scope:** the MBTI's theory, its instrument family from 1943 to the 2018 Global versions, its
psychometric evidence, the main critiques and replies, its principal alternatives and look-alikes, and
the ethics and employment law around its use.
**Not in scope:** a full account of Jung's psychology, clinical assessment, personnel selection science
beyond one comparison, and any per-type description of the 16 types. Type descriptions are the one
thing the internet already has in abundance.
**Evidence boundary:** peer-reviewed papers, publisher technical documents and web pages, regulator
guidance, and reported figures, all read on 2026-08-11. Every material claim is traced in
10-methodology-and-sources.md, which also lists what could not be
obtained.

## The MBTI in one paragraph

The **Myers-Briggs Type Indicator** is a forced-choice questionnaire that reports a person as one of
16 **types**, written as four letters. It measures four things the publisher calls **preference
pairs**: extraversion or introversion, sensing or intuition, thinking or feeling, judging or
perceiving. The four scales are internally consistent and correlate with mainstream personality
measures. The step that converts four scores into four letters is where the evidence stops supporting
it: score distributions have one peak rather than two, about half of people change at least one letter
on a retest, statistical tests for underlying categories find none, and the type predicts work
outcomes weakly.

## How to read this bundle

Start with the brief. Then go to whichever file matches your job.

| File | What it covers | Read it if |
| --- | --- | --- |
| 00-executive-brief.md | The verdict table, the core problem in one number, ten rules | You have five minutes |
| 01-origins-and-history.md | Jung to Briggs to ETS to CPP to today, and who owns what | You want to know where this came from |
| 02-the-type-model.md | The four pairs, the eight function-attitudes, the function order for all 16 types, best-fit type, population distribution | You need to understand what is actually being claimed |
| 03-the-instruments.md | Every form with item counts, the 1998 and 2018 scoring changes, Step I to III, the 20 facets with their reliability | You are buying, administering, or reading a report |
| 04-evidence-reliability-and-validity.md | What would have to be true, and what the numbers show, claim by claim | You want the evidence |
| 05-critiques-and-replies.md | Each critique at its strongest, the best reply, a verdict, plus where both sides overreach | You have to argue this with someone |
| 06-alternatives-and-lookalikes.md | 16Personalities is not the MBTI, plus 14 alternatives with evidence status and appropriate use | You need to pick something else |
| 07-use-misuse-and-law.md | The code of ethics, US employment law, data protection, the labelling harm, an adoptable policy | You are responsible for how it gets used |
| 08-decision-guide.md | A decision split, vendor questions, how to read a report in 60 seconds, what to do if you already misuse it | You need to act today |
| 09-glossary.md | 70 terms, including where MBTI usage differs from mainstream usage | A word is unfamiliar |
| 10-methodology-and-sources.md | Evidence grading, 26 sources, everything unobtainable, seven limitations | You want to check the work |

## Artifacts

| Artifact | Purpose |
| --- | --- |
| `00` to `10` Markdown files | The portable, readable report |
| `data.json` | The machine-readable evidence model: claims with verdicts, forms, facets, studies, instruments, sources |
| `report.html` | One self-contained page with navigation, sortable tables, and a diagram of the four-letters-to-function-order rule |
| `build.mjs` | Deterministic generator: the Markdown files plus `data.json` in, `report.html` out |

`report.html` is generated from the same Markdown files you can read directly, so the two never
disagree on facts. The HTML adds navigation and interaction, never extra content.

## Rebuilding the HTML

The generator needs the house report styleguide for its embedded fonts and design tokens. Point
`ELEVEN_AGI_REPO` at a local 11agi checkout, then:

```bash
node 2026/rnd/myers-briggs-001/build.mjs
```

The build prints a JSON summary of what it emitted. Running it twice on unchanged input produces a
byte-identical file apart from the generation timestamp.

## One thing to take away

The four letters are the least informative version of what the questionnaire collected. Ask for the
scores.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The one-sentence result

The Myers-Briggs Type Indicator (MBTI) is a well-made questionnaire resting on a claim its own
numbers do not support: that people come in 16 kinds. Its four scales measure something real and
measure it consistently, but the step that turns four scores into a four-letter label throws away
information, flips for about half of people on a retest, and predicts work outcomes weakly. Use it
as a conversation starter with a trained practitioner, never as a gate on a person.

## What holds up and what does not

| Claim | Verdict | Best evidence |
| --- | --- | --- |
| The four scales are internally consistent | Holds | Alpha .91 to .92 on the US norm sample of 3,009; .845 to .921 across 193 studies |
| The scales measure something also found in mainstream personality research | Holds | Three of four map onto Big Five factors (extraversion, openness, agreeableness); the fourth maps onto conscientiousness |
| The four-letter type is stable | Fails | About 50% get a different letter on at least one scale when retested; the publisher states this itself |
| People fall into two natural groups per scale | Fails | Score distributions are single-peaked and centre-heavy, before and after the 1998 scoring change |
| The 16 types exist as real clusters | Fails | Taxometric tests on Jungian instruments found no underlying categories |
| Type predicts job or leadership performance | Fails | One study of 464 people found MBTI explained about 1% of variance in leadership behaviour |
| Type is inborn and fixed | Unsupported | No mechanism offered, and the retest instability points the other way |
| The instrument is useful as a shared vocabulary | Plausible, unproven | The publisher reports high user satisfaction; no controlled trial shows the framework beats a cheaper one |

Full working of each row: 04-evidence-reliability-and-validity.md.

## The core problem in one number

The MBTI asks about four things on continuous scales, then reports each as one of two letters.
Cutting a continuous score at its midpoint costs you information. Two independent measurements of
that cost:

- Applying item response theory to the MBTI, dichotomising each scale lost between 26% and 32% of
  the information in it (Harvey & Murry, 1994, reported in Pittenger, 2005).
- Cutting one continuous variable in half reduces the variance it shares with another variable by a
  factor of about .64; cutting both reduces it by about .40 (Cohen, 1983, reported in Pittenger,
  2005).

So the four-letter code is the least informative way to report what the questionnaire collected.
Everything downstream inherits that loss.

## Ten rules for anyone handling MBTI results

1. Never use it to hire, promote, assign work, or form teams. The publisher's own code of ethics
   calls screening job applicants with it unethical, and US employment law asks for job-related
   validation the instrument does not have.
2. Never require it. The code of ethics says participation is voluntary and results belong to the
   respondent.
3. Treat the four letters as a summary of four scores, not as a category. Ask for the underlying
   index, not just the code.
4. Check how clear each preference was. Under the 2018 scoring, a preference reported at 62%
   probability is close to a coin flip; one at 95% is not. The letter looks identical either way.
5. Assume one letter will move if the person retests. Plan the conversation so it survives that.
6. Do not let a type explain a behaviour after the fact. Any type can be argued into any behaviour,
   which is why the framework is hard to test.
7. Distinguish the real instrument from the free look-alikes. 16Personalities is a different
   questionnaire with a fifth scale, run by a different company, and is not the MBTI.
8. If you need to predict work behaviour, use a measure built for that: a Big Five or HEXACO
   instrument, or a work-validated inventory. Conscientiousness alone predicts job performance at
   about r = .22 to .27 across occupations.
9. If you want a shared language for a team offsite, MBTI can do that job. So can a Big Five
   debrief, at lower cost and with fewer claims attached.
10. Watch for the labelling harm. Research on Chinese young adults found that managing an
    impression consistent with your type mediated about 47% of the indirect path to social anxiety.
    The framework is not inert once people adopt it as an identity.

## What the report covers

| Question | Where |
| --- | --- |
| Where did this come from, and who owns it | 01-origins-and-history.md |
| What the model actually claims, including the parts people skip | 02-the-type-model.md |
| What the questionnaires are, item by item, and how scoring changed in 2018 | 03-the-instruments.md |
| What the numbers show | 04-evidence-reliability-and-validity.md |
| The strongest attacks, and the strongest replies | 05-critiques-and-replies.md |
| What to use instead, and which look-alikes are not the MBTI | 06-alternatives-and-lookalikes.md |
| Ethics, employment law, and the labelling problem | 07-use-misuse-and-law.md |
| A decision guide with vendor questions | 08-decision-guide.md |
| Terms | 09-glossary.md |
| How this was built, every source, what is missing | 10-methodology-and-sources.md |

## The honest summary for a sceptic and for a believer

For the sceptic: "totally meaningless" overstates it. The scales are reliable in the
internal-consistency sense, they correlate with instruments academics accept, and the publisher
publishes technical briefs with real numbers in them. The problem is the typology layered on top,
not the questionnaire underneath.

For the believer: the retest instability, the single-peaked distributions, and the near-zero
prediction of work outcomes are not hostile spin. Two of the three come from the publisher's own
documentation. A framework that cannot tell you which of two people will do a job better, and
cannot reliably tell the same person the same thing twice, is a vocabulary rather than a
measurement.

---

<!-- 11archive-source: 01-origins-and-history.md -->

# Origins and history

## Why the history matters

Two facts about how the MBTI was built explain most of the arguments about it today.

First, the theory came before the data. Carl Jung wrote his types from clinical observation and
argument in 1921. The questionnaire was then built to detect those types, not to discover what
categories the data supported. When later analysis failed to find the categories, the theory was
kept and the scoring was adjusted.

Second, the instrument was built outside academic psychology and then sold commercially. That
combination gave it enormous reach and very little of the routine correction that peer review
applies. Stein and Swan (2019) put it that the MBTI has lived "in a parallel universe" to
personality psychology.

## Timeline

| Year | Event |
| --- | --- |
| 1921 | Carl Jung publishes *Psychologische Typen*. English translation, *Psychological Types*, follows in 1923 |
| 1923 onward | Katharine Cook Briggs, a writer with no psychology degree, reads Jung and abandons her own type framework in favour of his |
| 1942 to 1943 | Isabel Briggs Myers, Katharine's daughter and a mystery novelist, builds the first questionnaire. Stated aim: help people entering wartime work find jobs that suit them |
| 1943 | First version of the indicator, then called the Briggs Myers Type Indicator |
| 1956 | Renamed the Myers-Briggs Type Indicator |
| late 1950s | Henry Chauncey of Educational Testing Service takes an interest; ETS takes on distribution |
| 1962 | ETS publishes the first manual and Form F. In the same year ETS researchers Lawrence Stricker and John Ross publish an internal evaluation that is sharply critical |
| 1969 | Myers and psychologist Mary McCaulley begin working together, initially through a typology laboratory at the University of Florida |
| 1975 | Consulting Psychologists Press (CPP) acquires the right to sell the instrument. Myers and McCaulley found the Center for Applications of Psychological Type (CAPT) |
| 1977 | CPP releases Form G, the first widely sold commercial version |
| 1980 | Isabel Briggs Myers dies. Her book *Gifts Differing* appears the same year |
| 1985 | Second edition of the manual |
| 1997 | OPP Ltd releases a European English Step I |
| 1998 | Form M released with new scoring based on item response theory; third edition of the manual; US national representative sample of 3,009 people |
| 2001 | Form Q released, adding 20 facets as MBTI Step II |
| 2003 to 2007 | European Step II released in European English and eight other European languages |
| 2009 | MBTI Step III published, for one-to-one counselling only |
| 2018 | Global Step I and Global Step II released on 26 October, with latent class analysis scoring and a new Probability Index. Fourth edition of the manual. CPP renames itself The Myers-Briggs Company |
| 2018 | Merve Emre publishes *The Personality Brokers*, an archival history of the mother and daughter and the business built on their work |

Source for the publisher-dated rows: The Myers-Briggs Company MBTI Facts page and the Global
Assessment FAQ. Source for the 1962, 1969, and 1975 rows: the Association for Psychological Type
International history page and ETS Research Bulletin RB-62-6.

## Jung's contribution, and the part Myers added

Jung proposed two things.

- Two **attitudes**: extraversion, meaning attention flowing outward to objects and people, and
  introversion, meaning attention flowing inward to subjective experience.
- Four **functions** of consciousness, in two pairs. Sensation and intuition are ways of taking in
  information. Thinking and feeling are ways of reaching conclusions.

Combining the two attitudes with the four functions gives eight **function-attitudes**, for example
extraverted thinking or introverted intuition. Jung set these out in the closing part of
*Psychological Types*.

Myers and Briggs kept the eight function-attitudes and added a fourth scale of their own:
judging versus perceiving. It is not in Jung. It does two jobs at once, which is a source of
lasting confusion:

1. It describes a visible habit, roughly planning versus keeping options open.
2. It encodes which function a person shows to the outside world, which is how the four letters are
   translated into a function order. See 02-the-type-model.md.

## How the questionnaire was built

Myers created items by finding friends and relatives whose types "seemed to the authors to be
clearly evident from long acquaintance and from a 20-year period of careful observation of
behavior", then writing forced-choice questions that separated those people from one another
(MBTI Manual, 1998, pp. 128, 141, quoted in Stein & Swan, 2019).

Two consequences follow, and both are still live issues.

- The method assumes the answer. It can only identify the types if the people used as examples were
  correctly typed in the first place, and there was no independent way to check that.
- Because items were selected for how well they separated known groups rather than for being logical
  opposites, some options in a forced-choice pair are not actually opposites. Stein and Swan flag
  this directly.

## Who owns what today

| Entity | Role |
| --- | --- |
| The Myers & Briggs Foundation | Non-profit holding the MBTI trademarks; publishes the code of ethics; runs myersbriggs.org |
| The Myers-Briggs Company | Publisher and commercial operator, formerly CPP, Inc. until late 2018; runs certification and sells the assessments and reports |
| Center for Applications of Psychological Type (CAPT) | Research and training body founded 1975; its website now redirects to myersbriggs.org |
| Regional distributors | For example Psychometrics Canada, OPP in Europe historically; they publish local technical briefs |
| NERIS Analytics Ltd | Unrelated company behind 16Personalities. Not the MBTI. See 06-alternatives-and-lookalikes.md |

## Scale of use

The widely quoted figures come from a 2015 Vox piece by Joseph Stromberg and Estelle Caswell, and
are repeated in Stein and Swan (2019): about two million people take it a year, including people at
89 of the Fortune 100, generating about US$20 million in annual revenue. The Myers-Briggs Company
is private, so these are dated, source-reported figures rather than audited ones.

Current-day markers the publisher does state:

- A global norm sample of 16,773 people for the 2018 revision, with new national samples reflecting
  its reach outside the United States.
- Practitioner certification priced at roughly US$2,995 for a three-day programme in 2026, sold
  worldwide through regional distributors.
- Four manual editions, in 1962, 1985, 1998, and 2018.

Note the shape of that business. Revenue comes from questionnaires, reports, certification, and
training materials, all controlled by the publisher. The instrument's own technical literature is
largely produced in-house. That is legal and normal for a commercial test, but it means independent
replication is scarce, and it is why the 2025 review that found no independent test-retest studies
across 25 years matters more than it might elsewhere.

---

<!-- 11archive-source: 02-the-type-model.md -->

# The type model

## The four scales

The MBTI asks about four things. The publisher calls them **preference pairs**, and describes them
in one line each.

| Pair | Publisher's description | Nearest mainstream trait |
| --- | --- | --- |
| Extraversion (E) or Introversion (I) | How you direct and receive energy | Extraversion |
| Sensing (S) or Intuition (N) | How you take in information | Openness to experience, reversed (N is high openness) |
| Thinking (T) or Feeling (F) | How you decide and come to conclusions | Agreeableness (F is high agreeableness) |
| Judging (J) or Perceiving (P) | How you approach the outside world | Conscientiousness (J is high conscientiousness) |

The right-hand column is not the publisher's framing. It is the finding of McCrae and Costa (1989),
who gave both the MBTI and a five-factor measure to 468 adults and reported that the four MBTI
indices measure aspects of four of the five main dimensions of normal personality. The fifth,
neuroticism, meaning the tendency to experience negative emotion, has no MBTI scale. That omission
is deliberate on the publisher's side, since MBTI theory holds that no preference is better than its
opposite, and it is one reason the instrument cannot do the work a clinical or selection measure
does.

## What "preference" is claimed to mean

Three claims sit inside the word.

1. **Not ability.** A preference for thinking does not mean you think well. The publisher is
   explicit that the instrument does not measure ability, intelligence, or likelihood of success.
2. **Not exclusive.** Everyone uses all eight preferences daily. Type is which side of each pair you
   turn to first, not the only side you can reach.
3. **Inborn and fixed.** MBTI theory holds that you belong to one of the 16 types inherently, and
   that experience shapes how you express it rather than which one it is.

Claim 3 is the load-bearing one and the least supported. No mechanism is offered for how a person
would be born into one of 16 categories defined by four preferences. Stein and Swan (2019) note that
Jung himself located types partly in a collective unconscious, which does not connect to individual
biology, so appealing back to Jung does not repair it.

## From four letters to a function order

This is the part most casual users never see, and it is where the theory does its real work.

Jung's four functions each come in two attitudes, giving eight **function-attitudes**:

| | Extraverted | Introverted |
| --- | --- | --- |
| Sensing | Se, taking in the concrete present | Si, comparing the present against stored experience |
| Intuition | Ne, seeing possibilities outward | Ni, converging on an inner pattern or vision |
| Thinking | Te, organising the outside world by logic | Ti, building an internal logical framework |
| Feeling | Fe, attending to the values of the group | Fi, weighing against an internal value set |

The four letters translate into an ordered set of four of these, called **type dynamics**. Two rules
do the translation:

- The J or P letter says which function faces outward. J means the judging function (T or F) is
  extraverted. P means the perceiving function (S or N) is extraverted.
- The E or I letter says whether the outward-facing function is the **dominant** one. For E types it
  is. For I types the dominant is the other function, turned inward.

The remaining two positions are the **tertiary** and the **inferior**, the last being the blind spot
that tends to surface under sustained stress.

Worked example, INFJ. The J says feeling faces outward, as Fe. The I says Fe is not the dominant, so
the other function, intuition, turns inward and becomes dominant: Ni. That gives Ni dominant and Fe
auxiliary, then Ti tertiary and Se inferior by the alternating convention described below.

| Type | Dominant | Auxiliary | Tertiary | Inferior |
| --- | --- | --- | --- | --- |
| ISTJ | Si | Te | Fi | Ne |
| ISFJ | Si | Fe | Ti | Ne |
| INFJ | Ni | Fe | Ti | Se |
| INTJ | Ni | Te | Fi | Se |
| ISTP | Ti | Se | Ni | Fe |
| ISFP | Fi | Se | Ni | Te |
| INFP | Fi | Ne | Si | Te |
| INTP | Ti | Ne | Si | Fe |
| ESTP | Se | Ti | Fe | Ni |
| ESFP | Se | Fi | Te | Ni |
| ENFP | Ne | Fi | Te | Si |
| ENTP | Ne | Ti | Fe | Si |
| ESTJ | Te | Si | Ne | Fi |
| ESFJ | Fe | Si | Ne | Ti |
| ENFJ | Fe | Ni | Se | Ti |
| ENTJ | Te | Ni | Se | Fi |

Two warnings about this table.

- The attitudes shown for the tertiary and inferior follow the alternating convention, where the
  attitude flips at each position. That convention is widely used and appears in the publisher's
  type dynamics material, but Myers did not settle the tertiary's attitude, and other writers place
  the tertiary in the same attitude as the dominant. Treat positions 3 and 4 as a convention, not a
  finding.
- No empirical work supports the ordering itself. McCrae and Costa (1989) looked for the statistical
  interactions the dominant-function idea predicts and did not find them. If type dynamics were
  real, an extraverted sensing type should differ from an extraverted thinking type in ways that
  show up as an interaction between scales, not just as two separate main effects. That has not been
  demonstrated.

## Whole type and best-fit type

Two more pieces of official doctrine matter when you read a report.

**Whole type.** The claim is that the four letters interact rather than add up, so ESTJ is not
"E plus S plus T plus J" but a distinct configuration. This is what type dynamics is for. It is also
what makes the framework hard to falsify: any observation can be attributed to an interaction.

**Best-fit type.** The questionnaire result is officially a hypothesis, not a verdict. The code of
ethics requires a feedback session with a certified practitioner in which the respondent verifies
their own type and may choose a different one. The publisher then uses the rate at which people
agree with their reported type as evidence for the instrument.

That last step is a genuine problem, not a quibble. Stein and Swan (2019) point out the
contradiction: the marketing says your true type may be hidden from you, and the validation says you
are the authority on whether the result is right. Both cannot hold.

## The type table and how common each type is

Types are conventionally laid out in a 4x4 grid, introverts in the top two rows, sensing types on the
left, so that neighbouring cells share three letters. The layout is a presentation device, not a
measurement.

Preference-level distribution is the solid number. From the US national representative sample of
3,009 adults used in the 1998 manual, reproduced in the publisher's Form M and Form Q technical
brief:

| Preference | Share of US sample |
| --- | --- |
| Extraversion (E) | 49.3% |
| Introversion (I) | 50.7% |
| Sensing (S) | 73.3% |
| Intuition (N) | 26.7% |
| Thinking (T) | 40.2% |
| Feeling (F) | 59.8% |
| Judging (J) | 54.1% |
| Perceiving (P) | 45.9% |

Per-type frequencies are where public sources fall apart. Two tables circulate widely, both
attributed to official manuals, and they disagree badly:

| Type | Version A, commonly attributed to CAPT and the third-edition manual | Version B, commonly attributed to the 2018 manual |
| --- | --- | --- |
| ISFJ | 13.8% | 5.9% |
| ESFJ | 12.3% | 3.6% |
| ISTJ | 11.6% | 20.9% |
| ISTP | not the top group | 13.0% |

Version B implies that more than one in five Americans is ISTJ and that sensing-thinking types
dominate the population, which does not sit with the preference-level table above. This report does
not endorse either list. If you need per-type frequencies, get them from the current manual with the
sample described, and treat any web table without a named sample as unusable. Note also that
convenience samples differ sharply from norm samples: the publisher's own Singapore brief, drawn
from 12,838 people who happened to take the assessment, put ISTJ at 22.8% and stated plainly that no
inference about the population of Singapore may be drawn from it.

## What the model does not include

- No measure of neuroticism or emotional stability.
- No measure of ability, aptitude, or skill.
- No measure of honesty, integrity, or dark-side traits.
- No account of situation. A person is one type everywhere, so the framework has no room for the
  person-by-situation interaction that mainstream personality and social psychology treats as
  central.
- No mental health screening, and the publisher is clear it must not be used as one.

---

<!-- 11archive-source: 03-the-instruments.md -->

# The instruments

## There is no single MBTI

"The MBTI" names a family of questionnaires that differ in length, wording, norms, and scoring
method. A published study of "the MBTI" may be about any of them. When you read a claim, ask which
form.

| Form | Released | Items | Scoring | Norms |
| --- | --- | --- | --- | --- |
| Form F | 1962 | 166 | Prediction ratios, then continuous scores | US, research use |
| Form G | 1977 | 126, of which about 94 are scored | Prediction ratios | US |
| Form J | research use | 290 | Expanded analysis | US, research use |
| Form M (Step I) | 1998 | 93 | Item response theory, Preference Clarity Index 0 to 30 | US national representative sample, 3,009 |
| European Step I | 1997 | differs from Form M | European scoring | European |
| Form Q (Step II) | 2001 | 144 | Form M scoring plus 20 facet scores | US |
| Global Step I | 2018 | 92 | Latent class analysis, Probability Index 50 to 100 | Global sample, 16,773 |
| Global Step II | 2018 | 143 | As Global Step I plus facets | Global |
| Step III | 2009 | not published publicly | Interpreted only in one-to-one work | Limited |

Item counts for Form M, Form Q, Global Step I, and Global Step II come from the publisher's own
documents. The Form M split by scale is calculated from the item codes printed in the publisher's
Singapore technical brief: 21 items on extraversion-introversion, 26 on sensing-intuition, 24 on
thinking-feeling, and 22 on judging-perceiving, which sums to 93. Form Q is Form M's 93 items plus 51
extra items used only for the facets. The Form F, Form G, and Form J counts are widely reported in
secondary literature rather than taken from a publisher document, so treat them as source-reported.

Practical consequence: Form M and Form Q were built and normed for the United States. The European
Step I and Step II were built and normed for Europe. Before 2018 there were two different
instruments in circulation under one brand. The 2018 Global versions merged them onto one item set
and one global norm.

## How the questions work

Items are **forced choice**: pick one of two options, or one of two words. There is no neutral point
and no rating scale.

Forced choice has a specific technical consequence flagged in the critical literature. Tenopyr (1988),
cited in Pittenger (2005), showed that internal consistency figures for forced-choice scales can be
inflated as an artifact of the format, and concluded that reading constructs off forced-choice scales
should be done with extreme caution. So the high alpha values the publisher reports are less
reassuring than the same numbers would be on a rating-scale instrument.

## How scoring changed, twice

**Before 1998.** Continuous scores and a tie-breaking rule so nobody landed exactly on the midpoint.
An earlier version had reported an `x` for people at the centre of a scale. That practice was
dropped.

**1998, Form M.** Item response theory. Each item contributes according to how well it discriminates,
and the output is a **Preference Clarity Index** on a 0 to 30 scale per pair, labelled Slight,
Moderate, Clear, or Very Clear. The publisher is explicit that this index says how clearly you
favoured a side. It does not say how skilled you are with it or how much of it you have.

Part of the stated motivation for the change was to make midpoint scores less common, on the
assumption that Jungian theory is right and two groups per scale exist. Bess and Harvey (2002) tested
whether the new scoring produced the two-humped distribution the theory predicts. It did not. That
is worth stating plainly: the scoring was changed to look for a pattern the theory requires, and the
pattern still did not appear.

**2018, Global.** Latent class analysis, and the index is renamed and redefined. The **Probability
Index** is a percentage between 50 and 100 that answers a different question: how likely you are to
get the same letter if you take the questionnaire again. The publisher's own worked example: a result
of 89 toward extraversion means an 89% chance of scoring toward extraversion next time. Three
categories: Very likely, Likely, Somewhat likely.

This change is the most interesting thing the publisher has done in decades, for two reasons.

- It is honest. The number now describes the instrument's stability rather than the strength of a
  trait, which is what a categorical result can actually support.
- It quietly concedes the criticism. If a preference can be reported at 55% likely to repeat, then
  the letter is not a category the person belongs to. It is a coin weighted slightly to one side, and
  the report says so in a number that most readers will skip past on the way to the four letters.

## Step I, Step II, Step III

| | What it reports | Intended use | Who may administer |
| --- | --- | --- | --- |
| Step I | The four preferences and the four-letter type | General understanding of type | An MBTI certified practitioner, with a feedback session to verify best-fit type |
| Step II | The four preferences plus five facets inside each, so 20 facet scores | Personal and professional development; explains differences between two people of the same type | A Step II certified practitioner |
| Step III | How well a person is using their preferences, and their path of development | One-to-one counselling or coaching only | A certified practitioner with Step III specialist training, which the publisher says is currently unavailable |

## The 20 facets, with their reliability

Step II splits each pair into five facets. This table gives the facet names and the internal
consistency (Cronbach's alpha) reported by the publisher for the US national representative sample of
3,009, alongside a 12,838-person Singapore convenience sample for contrast. Alpha runs 0 to 1; .70 is
the usual floor for acceptable.

| Pair | Facet | US alpha | Singapore alpha |
| --- | --- | --- | --- |
| E-I | Initiating - Receiving | .85 | .81 |
| E-I | Expressive - Contained | .79 | .79 |
| E-I | Gregarious - Intimate | .60 | .66 |
| E-I | Active - Reflective | .59 | .62 |
| E-I | Enthusiastic - Quiet | .72 | .75 |
| S-N | Concrete - Abstract | .81 | .71 |
| S-N | Realistic - Imaginative | .79 | .74 |
| S-N | Practical - Conceptual | .67 | .50 |
| S-N | Experiential - Theoretical | .83 | .69 |
| S-N | Traditional - Original | .76 | .71 |
| T-F | Logical - Empathetic | .80 | .78 |
| T-F | Reasonable - Compassionate | .77 | .71 |
| T-F | Questioning - Accommodating | .57 | .41 |
| T-F | Critical - Accepting | .60 | .47 |
| T-F | Tough - Tender | .81 | .76 |
| J-P | Systematic - Casual | .74 | .74 |
| J-P | Planful - Open-Ended | .82 | .76 |
| J-P | Early Starting - Pressure-Prompted | .70 | .66 |
| J-P | Scheduled - Spontaneous | .82 | .79 |
| J-P | Methodical - Emergent | .71 | .60 |

Read that table carefully before you buy Step II. Six of the 20 facets fall below .70 even on the
publisher's own US norm sample, and Questioning-Accommodating and Critical-Accepting sit at .57 and
.60. On the Singapore sample those two drop to .41 and .47, which is too low to interpret for an
individual. The publisher states this openly and notes that international samples and translations
tend to come in lower. The honest reading: the facet layer is uneven, and the weakest facets are
mostly on the thinking-feeling pair.

A facet result can also come out on the opposite side from the overall letter. Practitioner materials
call that an out-of-preference result, and it is one of the more useful things Step II produces,
because it directly contradicts the idea that a single letter describes a person. Confidence on the
exact terminology here is moderate: it comes from practitioner descriptions of Step II reports rather
than from the manual, which is not public.

## Administration and access

- The real instrument is sold, not free. It is delivered through the publisher and its regional
  distributors.
- A certified practitioner is required. The publisher's certification is roughly a three-day
  programme priced around US$2,995 in 2026.
- The code of ethics requires that taking it is voluntary, that results are given to the respondent
  with an explanation, that the respondent gets to verify their type, and that results are not
  shared with anyone else without their permission.
- Anything free that returns four letters is not the MBTI. It may still be a reasonable
  questionnaire; it is a different one, with different items, scoring, and norms. See
  06-alternatives-and-lookalikes.md.

## What to ask for when you are handed a result

1. Which form, and which year's norms.
2. The Preference Clarity Index or Probability Index for each of the four pairs, not just the
   letters.
3. Whether a verification conversation happened, and whether the person changed any letter.
4. For Step II, the facet table including any out-of-preference results.
5. Who else has seen it.

If the answer to 2 is "we only have the four letters", you have been given the least informative
version of the data that was collected.

---

<!-- 11archive-source: 04-evidence-reliability-and-validity.md -->

# Evidence: reliability and validity

## Two words you need first

**Reliability** is consistency. Two kinds matter here.

- *Internal consistency* asks whether the items on one scale agree with each other. It is usually
  reported as Cronbach's alpha, a number from 0 to 1, where .70 is the usual floor and .90 is high.
- *Test-retest reliability* asks whether the same person gets the same answer later. Reported either
  as a correlation between the two occasions, or, for a categorical result, as the share of people who
  get the same category.

**Validity** is whether the thing measures what it claims. For a type instrument, four kinds are at
stake: does the structure look like four scales (structural), do the scores agree with other measures
of the same thing (convergent), do they differ from measures of other things (discriminant), and do
they predict anything (predictive).

## What would have to be true

The MBTI is not a trait questionnaire that happens to report categories. It claims categories exist.
That claim makes specific, checkable predictions:

1. Score distributions on each scale should have two humps, with few people in the middle.
2. The four-letter type should be highly stable, because the theory says type is inborn and fixed by
   adulthood.
3. Statistical tests for underlying categories should find them.
4. The scales should interact, because type dynamics says the meaning of one letter depends on the
   others.

Prediction 1 fails. Prediction 2 fails. Prediction 3 fails. Prediction 4 has not been demonstrated.
The rest of this file is the evidence for each.

## Internal consistency: the instrument's strongest result

| Source | Sample | Figures |
| --- | --- | --- |
| MBTI Manual 1998, via publisher technical brief | US national representative sample, 3,009 | E-I .91, S-N .92, T-F .91, J-P .92 |
| Publisher technical brief | Singapore convenience sample, 12,838 | E-I .91, S-N .89, T-F .88, J-P .90 |
| Capraro & Capraro (2002) meta-analysis, cited by the publisher | Across studies | .80 to .87, with T-F ranging .64 to .87 |
| Erford et al. (2025) psychometric synthesis | 193 studies, 1999 to 2024, Form M | .845 to .921 across subscales and total |
| Publisher, Form M development | Reported as based on over 5 million records | Around .90 per preference scale |

This is a real result and critics should concede it. The four scales hang together.

Two caveats. First, the forced-choice format can inflate these figures as an artifact (Tenopyr, 1988,
in Pittenger, 2005). Second, internal consistency says nothing about whether categories exist. A
perfectly consistent scale can still be continuous.

## Test-retest: where it breaks

| Study | Interval | Result |
| --- | --- | --- |
| Stricker & Ross (1962), in Pittenger (2005) | 14 months | Correlations .48 on T-F to .73 on E-I, n = 38 |
| Howes & Carskadon (1979), in Pittenger (2005) | Short | Among people whose first score was within 15 points of the midpoint, letters flipped for 32% on E-I, 25% on S-N, 29% on T-F, 30% on J-P |
| McCarley & Carskadon (1983), in Pittenger (2005) | 5 weeks | 50% got a different classification on one or more scales |
| MBTI Manual (1998), in Pittenger (2005) | 4 weeks | 35% had a different four-letter type |
| Publisher, Global Step I, 2018 manual | 6 to 15 weeks | Scale correlations .81 to .86, global sample of 1,721 adults |
| Publisher, MBTI Facts page | Retest, interval not stated on the page | "50 percent of participants received a different classification on one or more scales"; 90% keep three or four letters |
| Tshimula et al. (2026), reviewing the literature | 5 weeks | About 47% get an identical four-letter classification |
| Tshimula et al. (2026), reviewing the literature | 12 months | Mean test-retest correlation about .60 on the continuous scales |

Read the publisher's two rows together. The scale correlations of .81 to .86 are respectable for a
personality questionnaire. The categorical result on the same instrument is that half of people move
at least one letter. Both are true, because the letters are a coarse cut through those scales, and a
person near a cut moves across it easily.

Now hold that against the theory. Type is supposed to be inborn and settled by adulthood. If half of
adults appear to change type within weeks, either the instrument is failing or the theory is wrong.
The publisher treats it as measurement noise. The 2018 Probability Index is arguably a concession to
the second reading: the report now tells you, per scale, how likely your own letter is to survive a
retake.

Erford et al. (2025) add a finding that is easy to miss and hard to explain away: across 193 studies
published from 1999 to 2024, **test-retest studies were absent**. A widely used commercial instrument
went a quarter of a century without independent stability studies appearing in the sampled
literature.

## Distribution shape: the two humps never arrived

If two kinds of people exist on a scale, scores should pile up at both ends. They do not. Scores are
single-peaked and centre-heavy. Reported by Stricker and Ross (1962), Hicks (1984), Harvey and Murry
(1994), and McCrae and Costa (1989), all summarised in Pittenger (2005).

The 1998 item response theory scoring was expected to fix this. Bess and Harvey (2002) tested it and
found scores still not two-humped.

One nuance worth stating, because it is the strongest technical point available to the defence. Under
item response theory, the underlying trait estimates (theta) can look strongly two-humped while the
reported preference scores look flat and centre-weighted, even though the two correlate above .97.
This is a property of how the scoring transforms the scale, not evidence of two natural groups: the
same items, scored two ways, give opposite-looking pictures. It is a reason to be careful about which
distribution someone is showing you, not a reason to believe in categories.

Consequence for individual results: the standard error of measurement on each scale is 20 points or
more on the 100-point continuous scoring used in the older literature (Harvey & Murry, 1994;
Pittenger, 1993). That is large enough that many reported differences between two people's letters
are not real differences at all. In one study of senior managers, all scale means except thinking-
feeling sat within one standard error of the centre of the scale (Berr, Church & Waclawski, 2000, in
Pittenger, 2005).

## Do the 16 types exist as clusters?

This is testable directly. Meehl (1992) developed taxometric methods to detect underlying categories
even when observed scores look continuous. Arnau, Green, Rosen, Gleaves and Melancon (2003) applied
them to several Jungian type instruments including the MBTI, published in *Personality and Individual
Differences*. They found no support for underlying types in any of them.

McCrae and Costa (1989) had reached the same conclusion by a different route, reporting no evidence
for the interactions that type dynamics requires, and concluding a taxonomic structure was not
supported.

## Structure and independence of the scales

Mixed, and this is the fairest fight in the literature.

For the four-scale structure: the publisher cites confirmatory factor analyses supporting a
four-factor model (Harvey, Murry & Stamoulis, 1995; Johnson & Saunders, 1990), and its Singapore
brief reports an exploratory factor analysis in which each item loaded on its intended factor, with
loadings mostly .40 to .66.

Against: Pittenger (2005) lists a long run of studies finding factor structures inconsistent with
MBTI theory, including Sipps, Alexander and Freidt (1985), Saggino and Kline (1996), Saggino, Cooper
and Kline (2001), and Lorr (1991) on cluster analysis. He also notes that the four scales
intercorrelate more than an independent-dimensions model implies, citing the manual itself among
others.

Erford et al. (2025) report that **structural validity studies were also absent** from their
25-year sample, which leaves the publisher's in-house analyses as the main current evidence.

## Convergent and discriminant validity

The MBTI does correlate with instruments academics accept. E-I correlates with other extraversion
measures; the other three map onto openness, agreeableness, and conscientiousness (McCrae & Costa,
1989, on 267 men and 201 women aged 19 to 93). Furnham (1996) reached a similar conclusion using the
NEO-PI.

But the size of those correlations is the problem. Erford et al. (2025) found that only a small share
of correlations reached the .50 threshold usually taken as evidence of convergence, and the large
majority were below r = .20, which is the level normally read as evidence that two measures are
*different* things.

Two readings are possible, and honesty requires stating both. Either the MBTI measures something the
Big Five does not capture, which is the publisher's position, or the MBTI's convergence with
established measures is weaker than its supporters assume. Nothing in the current literature settles
it, because the studies that would settle it are the missing structural ones.

McCrae and Costa's own conclusion was blunter: a five-factor model explains the MBTI's factor
structure more efficiently than type theory does.

## Predictive validity: the weakest area

| Study | Outcome | Result |
| --- | --- | --- |
| Zárate-Torres & Correa (2023), *Frontiers in Psychology* | Five leadership practices | The four MBTI scales explained about 1% of variance, R² = 0.01, in 464 Colombian business students |
| Gardner & Martinko (1996), in Pittenger (2005) | Managerial effectiveness | "efforts to detect simplistic linkages between type preferences and managerial effectiveness have been disappointing" and no definitive conclusion could be drawn |
| Bjork & Druckman (1991), National Research Council, in Pittenger (2005) | Career counselling | Not enough well-designed research to justify use in career counselling programmes |
| Meta-analytic Big Five research, for comparison | Job performance | Conscientiousness predicts performance at about r = .22 to .27 across occupational groups |

For context on the ceiling here: personality-to-performance correlations of about r = .20 mean about
4% shared variance (Berr et al., 2000, in Pittenger, 2005). No personality measure predicts job
performance strongly. The point is that the MBTI's four-letter form performs worse than instruments
built for the job, and its own scoring choice is part of why: cutting each scale in half costs 26% to
32% of the information in it (Harvey & Murry, 1994), and cutting two variables in half reduces their
shared variance by about 60% (Cohen, 1983).

There is also no published evidence of incremental validity, meaning no demonstration that adding the
MBTI to a Big Five or work-sample measure improves prediction. Pittenger noted that gap in 2005 and
it has not been filled.

## What the publisher offers as evidence, and how to weigh it

The publisher's MBTI Facts page reports satisfaction and agreement data:

- 927 people surveyed on benefits: 88% said it helped them capitalise on strengths, 73% felt more
  confident personally, 72% at work, 65% said they made better decisions.
- A random sample of 944 US adults: 82% found it useful.
- 1,500 people who received a quality interpretation: 96% would recommend it.
- Around 31,000 records on Google Scholar for "MBTI".

Take these for what they are. They are self-report satisfaction measures, which tell you people like
the experience. They are not validity evidence. A framework can produce warm feelings and correct
nothing, which is what the Forer effect describes: people accept vague, positive descriptions as
accurate portraits of themselves. And a Google Scholar count measures citation volume, not quality;
Erford et al. sampled that literature and found the two most decision-relevant categories of study
missing from it.

The publisher also treats **agreement with your reported type** as validity evidence. That cannot
work as evidence, because the respondent is allowed to change the answer. If a result counts as
validated whenever the person accepts it, and the person may pick a different one when they do not,
the measurement has no way to be wrong.

## Summary table

| Property | Status | Confidence |
| --- | --- | --- |
| Internal consistency | Good, .85 to .92, possibly inflated by forced-choice format | High |
| Scale test-retest correlation | Moderate, .48 to .86 depending on interval and scale | High |
| Four-letter type stability | Poor, about half change a letter within weeks | High |
| Two-humped distributions | Not found, before or after the 1998 rescoring | High |
| Underlying categories | Not found by taxometric testing | Moderate to high, one main study |
| Four-factor structure | Supported by publisher analyses, disputed by independent factor studies, no recent independent work | Low to moderate |
| Convergence with Big Five | Real in direction, weak in size | Moderate |
| Prediction of work outcomes | Very weak, around 1% of leadership variance in the one recent direct test | Moderate, few studies |
| Type dynamics and interactions | Not demonstrated | Moderate |
| Incremental validity over Big Five | No published evidence either way | High that the gap exists |

---

<!-- 11archive-source: 05-critiques-and-replies.md -->

# Critiques and replies

This file argues both sides properly. Each critique is stated at its strongest, then the best
available reply, then a verdict.

## The theory critiques

Stein and Swan (2019), in *Social and Personality Psychology Compass*, evaluated MBTI theory against
three standard criteria for a scientific theory (Shaw & Costanzo, 1982). Their summary:

| Criterion | Their finding |
| --- | --- |
| Agreement with known data and facts | Fails. Jungian theory was not built from data; the "true type", causal, and inborn claims are unsupported; the dichotomies are often not real opposites |
| Internal consistency | Fails. Self-verification makes the validity evidence circular; basing types on preferences rather than tendencies allows more than one type to be argued for the same person |
| Testability | Fails. The theory avoids strong statements about what type predicts, and treats the existence of dichotomies as effectively unfalsifiable |

### Critique 1: the "true type" is not a scientific object

The marketing says your true type may be hidden from you. But the questionnaire measures conscious
preferences, and the respondent is then invited to overrule the result. Stein and Swan note the
contradiction: a true personality cannot be both hidden and self-evident to the person.

**Reply.** Best-fit verification is a safeguard, not a validity claim. A questionnaire result is a
hypothesis; a trained practitioner and the respondent test it together. Many clinical and coaching
tools work this way, and it protects people from being labelled by a single questionnaire.

**Verdict.** The safeguard is genuinely good practice. The problem is not the conversation, it is
using **agreement rates from that conversation as evidence the instrument works**. Drop that one
claim and this critique mostly dissolves.

### Critique 2: the poles are not opposites

Thinking versus feeling is presented as a choice between two competing mental functions. Research on
reasoning and intuition finds both operating all the time, not in competition (Haidt, 2001; Epstein
et al., 1996, cited in Stein & Swan). Same for sensing versus intuition: bottom-up perception and
top-down pattern recognition both run constantly and unavoidably. If the two poles are not opposites,
"preferring" one over the other is not a meaningful statement.

**Reply.** The pairs describe which process a person *turns to first* when both are available, not
which they are capable of. Everyone breathes through both nostrils; that does not make handedness
meaningless.

**Verdict.** The reply works better for E-I and J-P, which do describe roughly incompatible
behaviours in the moment, than for T-F and S-N. Note that both E-I and J-P have clean single-scale
equivalents in the Big Five, which makes the two-poles framing unnecessary rather than wrong.

### Critique 3: type is claimed to be inborn with no mechanism

No account is offered of how a person would be born into one of 16 categories built from four
preferences. Appealing to Jung does not help, since Jung located types partly in a collective
unconscious rather than in individual biology.

**Reply.** Twin and behavioural genetics research consistently finds personality traits substantially
heritable, so "largely inborn" is not a fringe claim for personality in general.

**Verdict.** The reply defends heritability of *traits*, which nobody disputes. It does not defend
heritability of *categories*, which is the actual claim. Heritable continuous traits do not produce
16 discrete kinds of person.

### Critique 4: it is not falsifiable in practice

The theory hedges on whether preferred functions must show up in behaviour, on whether scores show
strength of preference, and even on whether everyone has a type. When the predicted two-humped
distributions did not appear, the scoring was changed rather than the theory.

**Reply.** The publisher's position, stated by its then-president in 2014, is that the MBTI was never
meant to predict performance or outcomes, only to increase self-awareness and awareness of others.
Judging it by predictive standards is judging it against a purpose it disclaims.

**Verdict.** This is the single most important exchange in the whole debate, and the reply has a
serious cost. If the instrument makes no predictions, it cannot be tested, and "self-awareness" is
then doing all the work. Stein and Swan press the point: if learning your type increases useful
self-awareness, the differences it names must show up reliably in behaviour, which is a prediction.
You cannot claim usefulness and disclaim prediction at the same time.

There is also a documented risk in the self-awareness path. O'Keefe, Dweck and Walton (2018), cited
by Stein and Swan, found that when people believe their true preferences have been revealed, they
expect pursuing them to feel easy and lose interest in other things. Being told a wrong thing about
your true self is not neutral.

## The psychometric critiques

Pittenger (2005), in *Consulting Psychology Journal*, is the standard reference. His argument in
five steps:

1. Type theory predicts two-humped distributions. They are absent, and the 1998 rescoring did not
   produce them.
2. The four-letter code discards information: 26% to 32% per scale, plus the variance loss from
   dichotomising, so the instrument's own reporting format reduces its predictive power.
3. Test-retest results contradict a theory of inborn, stable type.
4. Factor analyses often do not recover MBTI's structure, and the scales intercorrelate more than an
   independent-dimensions model allows.
5. Therefore using it for selection, work assignment, team formation, or evaluation is unjustified,
   and presenting results as four letters instead of scale scores misrepresents the evidence.

**Reply, and it is a fair one.** Pittenger explicitly does not say the instrument measures nothing.
His own words are that it does measure constructs related to personality; what is unclear is whether
it measures the constructs its theory names. He also notes that no study has shown the MBTI's
*incremental* validity to be worse than a rival's, because nobody has run that comparison. And he
credits the framework's practical role: a non-threatening way to introduce individual differences,
where being told you are intuitive and feeling lands better than being told you scored high on
neuroticism.

**Verdict.** Points 1 through 4 stand. Point 5 is the operative conclusion and it is now also the
publisher's own position on selection.

## What the publisher gets right

Give credit where it is due.

- **Ethics.** The code of ethics forbids using results to screen job applicants, requires voluntary
  participation, requires confidentiality, requires that people see and can verify their own results,
  and forbids steering people toward or away from careers on type alone. Many rival frameworks in
  the corporate market have nothing comparable.
- **Transparency about type change.** The MBTI Facts page states that about half of people get a
  different classification on one or more scales on retest. That is the publisher publishing its own
  most damaging number.
- **Real technical documents.** Regional technical briefs give item-level factor loadings, per-facet
  alphas including the weak ones, and explicit warnings that convenience samples support no
  population inferences. That is better practice than most commercial personality products.
- **The 2018 Probability Index.** Replacing a "how clear is your preference" number with a "how
  likely is this letter to repeat" number is the right move, and it concedes the retest problem in
  the report itself.
- **No good or bad types.** The framing that all types are equally valuable removes an obvious harm
  route that trait-based reporting has to manage carefully.

## Where critics overreach

- **"Totally meaningless" is wrong.** The Vox framing that made the strongest public impression
  overstates the case. Internal consistency in the high .80s and low .90s, scales that correlate with
  accepted measures of extraversion, openness, agreeableness, and conscientiousness, and item-level
  factor loadings that land on their intended factors are not the profile of a meaningless
  instrument.
- **"No scientific basis" is wrong.** The theory's origin is unscientific. The instrument has been
  studied for six decades, and the results are mixed, not empty.
- **Attacking Jung is not attacking the MBTI.** Pointing out that Jung worked from anecdote is fair
  history but does not by itself invalidate a questionnaire.
- **Mocking the four letters as astrology confuses the levels.** Astrology's inputs carry no
  information about the person. The MBTI's inputs are the person's own answers about their behaviour.
  The failure is in the categorisation step, not in the data collection.
- **Retest instability is often quoted without the interval.** "50% change" is a five-week figure on
  at-least-one-letter. Quoting it as if it meant the whole type flips constantly is sloppy.

## Where defenders overreach

- **Citing volume as evidence.** 31,000 Google Scholar records is not 31,000 supportive studies.
- **Citing satisfaction as validity.** 88% saying it helped them use their strengths measures how the
  session felt.
- **Citing agreement rates as validity.** Circular, as above.
- **"It is a type instrument, so trait standards do not apply."** Type claims are stronger than trait
  claims, not weaker, and they generate the specific predictions listed in
  04-evidence-reliability-and-validity.md. Being a
  typology is a reason for more scrutiny.
- **"Fakeability is handled by the practitioner."** Moyle and Hackston have argued that using the
  questionnaire as one input among several, with a trained practitioner, limits distortion. That is
  reasonable for coaching. It is not a defence in any setting where the respondent has an incentive
  to answer strategically, which is exactly the setting the code of ethics already rules out.

## Why it stays popular anyway

Three mechanisms, all documented, none of which require the framework to be true.

1. **The Forer effect** (Forer, 1949). People accept vague, positive descriptions as accurate
   portraits of themselves.
2. **The true-self intuition.** People believe they are governed by a deep, hidden essence, and that
   decisions grounded in it are better decisions (Strohminger, Knobe & Newman, 2017, cited in Stein &
   Swan). A framework that claims to reveal that essence is unusually welcome.
3. **The guru effect** (Sperber, 2010). Statements that are hard to follow, from a figure with
   authority, are read as profound. Type dynamics with eight function-attitudes is exactly that kind
   of material.

Add a commercial network of certified practitioners with a financial interest in the framework, and
popularity needs no further explanation.

---

<!-- 11archive-source: 06-alternatives-and-lookalikes.md -->

# Alternatives and look-alikes

## The most important distinction in this whole report

Most people who say "I'm an INFP" have never taken the MBTI. They took a free four-letter test on the
web, and usually it was **16Personalities**.

| | MBTI | 16Personalities |
| --- | --- | --- |
| Owner | The Myers-Briggs Company, trademarks held by The Myers & Briggs Foundation | NERIS Analytics Limited, no relationship to either |
| Model | Four Jungian preference pairs, 16 types, type dynamics | Five trait scales borrowing the four MBTI letters, plus a fifth |
| Fifth scale | None | Identity: Assertive (-A) or Turbulent (-T), covering confidence and stress response |
| Underlying approach | Categories | Traits, scored continuously, then labelled |
| Cost | Paid, through the publisher and distributors | Free, with paid reports |
| Practitioner | Required | None |
| Verification conversation | Required by the code of ethics | None |

The Identity scale is the tell. Assertive versus Turbulent is essentially neuroticism, the Big Five
factor the MBTI deliberately leaves out. So 16Personalities is closer to a Big Five instrument wearing
MBTI letters than it is to the MBTI.

Practical consequences:

- Research using 16Personalities data does not test the MBTI, and vice versa. Be careful with any
  study or dataset that does not say which one it used.
- A 16Personalities result and an MBTI result for the same person can differ, and neither is "wrong"
  in the other's terms.
- If someone in your organisation says "we use Myers-Briggs" and nobody is certified, they are
  probably using a free look-alike. That is a materially different situation, including for legal
  purposes.

## The full field

Confidence column reflects how well established each entry's psychometric evidence is in independent
literature, not how popular it is.

| Instrument | What it measures | Access | Evidence status | Reasonable use |
| --- | --- | --- | --- | --- |
| MBTI Step I / II / III | Four Jungian preference pairs, plus 20 facets at Step II | Paid, practitioner required | Reliable scales, unsupported typology, very weak prediction | Coaching, shared vocabulary, self-reflection |
| 16Personalities (NERIS Type Explorer) | Four MBTI-letter scales plus Identity | Free, paid reports | Little independent peer-reviewed validation published | Casual self-reflection only |
| Keirsey Temperament Sorter | Four temperaments (Artisan, Guardian, Idealist, Rational) mapped onto MBTI-style letters | Paid | Thin independent evidence; Keirsey's temperaments are a different theory from Jung's despite shared letters | Team language, with the same caveats as MBTI |
| Socionics | 16 types with an information-metabolism theory and inter-type relations | Mostly informal, various sites | Essentially no peer-reviewed validation in English-language literature | Hobby interest, not decisions |
| Big Five, via NEO-PI-3 | Five factors and 30 facets | Paid | The best-established model of normal personality; decades of independent work | Research, coaching, work-relevant prediction |
| Big Five, via BFI-2 | Five factors and 15 facets | Free for research | Well validated, short | Research, low-cost team work |
| Big Five, via IPIP-NEO | Five factors and 30 facets | Public domain | Free, widely used, validated against commercial measures | Free alternative when budget is the blocker |
| HEXACO-PI-R | Big Five plus Honesty-Humility | Free for research | Strong and growing; explains more variance in workplace deviance and citizenship behaviour than the Big Five in meta-analysis | Where integrity matters, and research |
| Hogan (HPI, HDS, MVPI) | Work reputation, derailment risks, values | Paid, certification required | Built and validated for occupational prediction | Selection and development, where a validated work measure is required |
| DISC | Four behavioural styles at work | Paid, many vendors | Decent reliability figures reported, mostly vendor-generated; thinner independent literature than the Big Five | Communication workshops |
| Enneagram | Nine types built on core motivations and fears | Paid and free versions | Mixed; a 2021 systematic review found inconsistent reliability and validity; predictive evidence thin | Personal and spiritual development |
| MMTIC | The MBTI framework adapted for children and young people | Paid, practitioner required | Limited independent work | Education settings, with care |
| Golden Personality Type Profiler, Majors PTI, Jung Type Indicator | Type instruments in the MBTI tradition, sold by other publishers | Paid | Each has its own manual; independent comparative work is scarce | Where a type framework is wanted without MBTI licensing |
| Insights Discovery, Lumina Spark and similar | Proprietary colour or facet models, often four-quadrant | Paid, practitioner networks | Vendor-validated; independent literature limited | Facilitated team sessions |
| Strong Interest Inventory | Occupational interests, not personality | Paid, practitioner required | Long research record for career exploration | Career counselling, which is what people usually wanted the MBTI for |

Two entries carry lower confidence than the rest of this table and are flagged as such: the DISC and
Enneagram rows rest on secondary summaries of the literature rather than on primary meta-analyses read
for this report.

## How to choose, in one page

**You want a shared language so a team can talk about differences without it feeling like judgment.**
MBTI works, so does DISC, so does a Big Five debrief. Pick on facilitator quality and cost, not on
which model is truest. Say out loud that the labels are conversation aids.

**You want to predict who will do a job well.** Do not use a type instrument. Use a work-validated
inventory (Hogan or similar), a Big Five or HEXACO measure, a structured interview, and a work sample.
Conscientiousness alone gets you r = .22 to .27 for job performance; the whole MBTI got about 1% of
leadership variance in the one recent direct test.

**You want to reduce integrity or counterproductive-behaviour risk.** HEXACO, for its
Honesty-Humility factor, or a purpose-built integrity measure. The MBTI has nothing here by design.

**You want a career direction conversation.** Use an interests inventory such as the Strong. Interests
predict occupational choice and satisfaction better than a personality type does, and career
counselling is the one application the National Research Council review singled out as unsupported for
the MBTI.

**You want to understand yourself and enjoy it.** Any of them, including the free ones. The cost of
being wrong is low, as long as you do not treat the result as an explanation for your choices. See
the labelling risk in 07-use-misuse-and-law.md.

**You are building a product, dataset, or model that assigns personality labels.** Use continuous
traits, not types. A 2026 review of MBTI-based personality work with large language models found
75% to 85% accuracy on single dimensions but concluded that models trained on self-reported MBTI
labels from web forums inherit heavy bias toward extreme types, and recommended continuous trait
models instead. It also found that the same model produced different types depending on whether it
was writing posts or replies, which is a good illustration of why fixed types are the wrong
abstraction.

## A note on comparing evidence bases fairly

The Big Five looks better than the MBTI partly because it was built the other way round: researchers
found the dimensions in data and then built questionnaires, so the structure is whatever the data
supported. The MBTI began with a theory and built an instrument to detect it. That difference explains
the outcome without either side acting in bad faith.

It also sets a limit on how much comfort the Big Five deserves. Five factors is a result of the
methods used, not a law of nature, and the ceiling for predicting job performance from any personality
measure is low. Choosing the Big Five over the MBTI is choosing a better-evidenced weak predictor over
a worse-evidenced weaker one, not choosing certainty.

---

<!-- 11archive-source: 07-use-misuse-and-law.md -->

# Use, misuse, and law

## The publisher's own rules

The Myers & Briggs Foundation publishes an MBTI Code of Ethics. It is short, and it rules out most of
what organisations actually do with the instrument.

Required:

- Participation is **voluntary**.
- Results are **confidential**, given to the respondent, and shared with nobody else without their
  explicit permission.
- The respondent is told the purpose and how results will be used **before** taking it.
- Results are explained by a certified practitioner, with the theory, a chance to discuss, and
  descriptions of the respondent's type and of all 16.
- The respondent gets to **verify their best-fit type** and may disagree with the reported result.
- Language stays non-judgmental: tendencies, preferences, inclinations.

Forbidden:

- Using results to **screen job applicants**. The Foundation's wording is that this is unethical
  practice, and that requiring applicants to take it where results will be used to screen them is
  unethical and in many cases illegal.
- Using results for job placement, team assignment, task force selection, or similar internal
  decisions.
- Counselling someone toward or away from a career on the basis of type alone.
- Implying that everyone of one type behaves identically, or that type explains ability,
  intelligence, likelihood of success, emotions, or normality.
- Pressing a result on someone who disagrees with it.

If your organisation uses the MBTI in hiring, promotion, or team allocation, it is breaking the
publisher's rules, not just the critics' advice.

## The employment law layer, United States

The MBTI is not illegal. Using it as a gate on employment decisions creates exposure under three
separate bodies of law.

**Title VII and the EEOC's testing guidance.** Any selection procedure must be job-related and
properly validated for the position and purpose it is used for. A test can violate anti-discrimination
law two ways: intentional use to discriminate, or **disparate impact**, where it disproportionately
excludes people on a protected basis and the employer cannot justify it. The MBTI has no validation
evidence for predicting job performance, so an employer using it as a screen has nothing to point to
when asked to justify it.

Note also that type distributions differ by sex in the publisher's own data. In its Singapore sample
of 12,838, ISFJ was 10.9% of women and 5.2% of men, and ESFJ was 5.8% of women and 2.5% of men, with
feeling types more common among women generally. A screen that prefers or excludes certain letters
therefore has an obvious route to sex-based disparate impact, whether or not anyone intended it.

**The ADA.** Pre-employment tests that function as a medical examination or a test of mental health
are restricted. The MBTI is not designed as a clinical instrument and the publisher says it must not
be used as one, which helps; but personality testing near hiring decisions is a known area of ADA
litigation risk, and legal commentary through 2024 has flagged pre-hire personality testing as an
active challenge area for employers.

**Vendor liability does not transfer.** The EEOC's position is that an employer can be liable even
when an outside vendor built the tool. "The consultancy ran it" is not a defence.

Risk gradient, in plain terms:

| Use | Legal exposure |
| --- | --- |
| Voluntary team workshop, results owned by participants, no records kept | Low |
| Coaching engagement, individual consent, results not shared with management | Low |
| Results collected into an HR system, visible to managers | Medium, privacy and future-use risk |
| Type used to allocate projects, teams, or development budget | Medium to high |
| Type used to screen applicants or decide promotions | High, and against the publisher's code |

## Data protection, Europe and the UK

Under the UK GDPR and the EU GDPR, an MBTI result attached to a named person is personal data. Two
practical points.

- **Consent given to an employer is weak consent.** The power imbalance means regulators treat
  employee consent sceptically, which is a second, independent reason not to require the assessment.
- **Purpose limitation applies.** Results collected for a voluntary development workshop cannot later
  be repurposed for selection or restructuring decisions without a fresh lawful basis. In practice,
  the safest arrangement is the one the code of ethics already requires: the individual keeps the
  result and the employer keeps no copy.

This section is reasoning from general data protection principles rather than from a regulator
decision about the MBTI specifically. Treat it as an informed read, not legal advice, and get counsel
before building anything on it.

## The labelling problem

The most underrated risk is not legal. It is what happens when people adopt a type as an identity.

**Evidence that it changes behaviour.** Wu et al. (2024), in *Frontiers in Psychology*, surveyed 469
Chinese adults aged 18 to 35 on MBTI use and social anxiety. There was no direct link between using
MBTI as a label and social anxiety. The indirect paths were the finding: **impression management**
accounted for about 46.9% of the indirect effect and **ego identity** about 45.2%. Sense of belonging
was not a significant mediator. The authors' reading is that the framework itself does not cause
anxiety, but the pressure to behave consistently with your type does.

**Evidence that fixed-trait beliefs constrain people.** O'Keefe, Dweck and Walton (2018), cited in
Stein and Swan (2019), found that when people believe their true interests have been revealed, they
expect pursuing them to be easy and become less interested in other things.

**The attribution risk.** Pittenger (2005) makes the point directly: making personality a salient part
of every interaction ("Hello, I'm INTJ") pushes people toward explaining behaviour by disposition and
ignoring the situation. That is the fundamental attribution error installed as a workplace norm.

**Cultural scale.** This is not hypothetical. In South Korea, type is a routine part of dating and
social life; on one dating platform, INFP was the most frequently displayed type among Korean users in
2025. In China, one survey reported 69% of participants knew the MBTI, and MBTI topics accumulated tens
of millions of views on a single social platform over 180 days. In markets like these the framework is
a public identity system, and the harms are about social sorting, not about test scores.

## Uses that are defensible

- **A shared, non-judgmental vocabulary.** Naming a difference is easier when neither side of it is
  bad. This is the MBTI's real strength and Pittenger concedes it.
- **Individual coaching, with consent.** The result is a prompt. The coach's skill is doing the work.
- **Self-reflection.** Low stakes, low cost of error.
- **Teaching that individual differences exist.** Especially with the caveats attached.

## Uses that are not

- Hiring, screening, promotion, redundancy selection.
- Team composition, project allocation, or "we need an ENTJ for this".
- Career direction on type alone. Use an interests inventory.
- Clinical or mental health inference of any kind.
- Compatibility screening presented as evidence-based, whether for dating or for co-founders.
- Training data or label space for a personality model. The 2026 review of this practice found that
  models trained on self-reported forum MBTI labels inherit bias toward extreme types, and that the
  same model produces different types in different contexts.

## A short policy an organisation can actually adopt

1. The MBTI, or any type instrument, is available on request as a development tool. It is never
   required.
2. Results belong to the individual. The organisation stores nothing.
3. No employment decision cites a type. Not hiring, not promotion, not allocation, not exit.
4. Anyone administering it is certified and follows the code of ethics.
5. For selection, use validated work measures, structured interviews, and work samples.
6. Anyone quoting a four-letter type in a decision meeting gets asked which form produced it, on what
   date, and with what Probability Index. In most organisations that question ends the practice on its
   own.

---

<!-- 11archive-source: 08-decision-guide.md -->

# Decision guide

## Start here

Answer one question: **does a decision about a person depend on the result?**

- **Yes.** Do not use a type instrument. Go to "Choosing a measure for decisions" below.
- **No.** Any of them will do. Go to "Running a session that does not do harm".

Everything else in this file follows from that split.

## Choosing a measure for decisions

| If you need to | Use | Do not use |
| --- | --- | --- |
| Predict job performance | A work-validated inventory such as Hogan, or a Big Five or HEXACO measure, alongside a structured interview and a work sample | MBTI, DISC, Enneagram, any four-letter test |
| Screen for integrity risk | HEXACO for Honesty-Humility, or a purpose-built integrity measure | MBTI, which has no such scale by design |
| Guide a career decision | An interests inventory such as the Strong Interest Inventory | MBTI type alone; the National Research Council review found the evidence insufficient for career counselling |
| Understand emotional stability or stress risk | A Big Five instrument, which includes neuroticism | MBTI, which excludes it |
| Compose a team by capability | Skills inventory and past work | Type mix |
| Explain a conflict between two people | The specific behaviours in the specific situation | Type incompatibility |

## Running a session that does not do harm

Five things to say out loud, early.

1. "This is a questionnaire about preferences. It does not measure ability, intelligence, or
   potential."
2. "Roughly half of people get a different letter on at least one scale if they retake it. If a letter
   feels wrong, it probably is."
3. "The number next to each letter matters more than the letter. A 55% is nearly a coin flip. A 95% is
   not."
4. "Your result is yours. Nothing goes to your manager or into a system."
5. "No type is better. And no type is an excuse."

Two things to avoid.

- Do not put types on a wall chart, a Slack profile, or a team roster. Once type is public it becomes
  a social expectation, which is the mechanism the Chinese social anxiety study picked up.
- Do not use type to allocate the work in the workshop. That is the forbidden use in miniature.

## Reading an MBTI report in 60 seconds

1. **Which instrument?** Form M, Form Q, Global Step I, Global Step II, or a free web test. If it is a
   free web test, it is not the MBTI and the rest of this checklist does not apply.
2. **Find the four indices.** Preference Clarity Index runs 0 to 30, labelled Slight to Very Clear.
   Probability Index runs 50 to 100, labelled Somewhat likely to Very likely.
3. **Flag the soft letters.** Any letter with a Slight clarity or a Somewhat likely probability should
   be treated as undetermined, not as a preference.
4. **Check whether verification happened.** If nobody sat down with the respondent, the process the
   publisher requires was skipped.
5. **For Step II, read the facets before the letters.** Out-of-preference facets are the most
   informative part of the report and they directly undercut the single-letter summary.
6. **Ask what the report is going to be used for.** If the answer touches an employment decision,
   stop.

## Questions to ask a vendor or consultant

Use these verbatim. The answers sort competent practitioners from the rest quickly.

1. Which form and which norm sample will you use, and why that one for our population?
2. Are you certified by The Myers-Briggs Company, and will you follow their code of ethics as
   written, including that participation is voluntary and results go only to the individual?
3. Will the report include the Probability Index or Preference Clarity Index for all four pairs?
4. What is your test-retest evidence for the version you are selling, and at what interval?
5. What predictive validity evidence exists for the outcome we care about?
6. What will you tell participants about how often a letter changes on retest?
7. Who will hold the results afterwards, in what system, for how long, and under what lawful basis?
8. What would you refuse to do with these results if we asked?

Answers that should worry you:

- "It predicts the best role for each person." Contradicts the publisher's own code of ethics.
- "It is 90% accurate." Accuracy against what? There is no external criterion for type.
- "It is scientifically validated." Ask which kind of validity. Internal consistency is good;
  structural and predictive validity are not.
- "We will put the team's types in a dashboard." Privacy and labelling risk, and forbidden use is one
  short step away.
- "We can use it to screen candidates lightly." There is no light version of the forbidden use.

## If your organisation already uses it for the wrong things

A workable sequence, least disruptive first.

1. Stop the decision use immediately. That is the legal exposure and it needs no consultation.
2. Delete or return stored results, or hand them back to individuals. Purpose limitation makes stored
   development data risky the moment anyone considers reusing it.
3. Keep the vocabulary if people like it. Nothing is gained by taking away a language a team finds
   useful, as long as it is decorative.
4. Replace the decision function with validated measures. Say plainly why, and say what the old
   approach could not support. Framing it as a legal and evidence upgrade lands better than framing it
   as "the thing you liked was fake".
5. Add the six-question challenge from 07-use-misuse-and-law.md to your
   decision meetings: which form, what date, what Probability Index.

## For researchers and builders

- Report continuous scores, never only the four letters. Dichotomising costs 26% to 32% of the
  information per scale and cuts shared variance with any outcome by around 60%.
- Say which instrument you used. MBTI Form M, Global Step I, and 16Personalities are three different
  questionnaires and are routinely conflated in datasets.
- Web-scraped type labels are self-reported and skewed toward extreme types. A 2026 review found this
  bias propagates into models trained on them.
- If you are labelling model or agent personas, use continuous traits. Types imply stability the
  systems do not have; the same model in the same study came out ENTJ writing posts and INTP writing
  replies.
- The two study designs the field is missing, per the 2025 synthesis of 193 papers, are **independent
  test-retest** and **structural validity**. Either would be a genuine contribution.

---

<!-- 11archive-source: 09-glossary.md -->

# Glossary

Terms are defined as this report uses them. Where a term means something different inside MBTI
literature than in mainstream psychology, both readings are given.

## Type framework terms

**Attitude.** In Jung's system, the direction attention flows: outward (extraversion) or inward
(introversion).

**Auxiliary function.** The second function in the type order. Supports the dominant and faces the
opposite direction.

**Best-fit type.** The type a respondent settles on after a feedback session with a certified
practitioner. May differ from the questionnaire result. Officially the real answer.

**Dichotomy.** A pair of opposites treated as two categories rather than as ends of a scale. The MBTI
has four.

**Dominant function.** The first function in the type order, the one said to do most of the everyday
work.

**Facet.** One of five components inside each preference pair, reported by MBTI Step II. Twenty in
total.

**Function.** In Jung's system, a mode of consciousness. Two perceiving functions, sensing and
intuition; two judging functions, thinking and feeling.

**Function-attitude.** A function combined with an attitude, giving eight: Se, Si, Ne, Ni, Te, Ti, Fe,
Fi.

**Inferior function.** The fourth function in the type order. Described as a blind spot that surfaces
under sustained stress.

**Judging function.** Thinking or feeling. Confusingly, not the same as the J letter.

**Midzone.** A Step II facet result that sits between the two poles.

**Out-of-preference result.** A Step II facet that lands on the opposite side from the overall letter.
For example a person reported as J with a Casual result on Systematic-Casual.

**Perceiving function.** Sensing or intuition. Not the same as the P letter.

**Preference.** Which side of a pair a person turns to first. Claimed to be inborn, not an ability, and
not exclusive.

**Preference pair.** The publisher's term for one of the four scales.

**Temperament.** Keirsey's grouping of the 16 types into four families. A different theory from Jung's
that reuses the same letters.

**Tertiary function.** The third function in the type order. Its attitude was never definitively
settled, so different sources place it differently.

**Type dynamics.** The rule set that turns four letters into an ordered set of four function-attitudes.

**Type table.** The conventional 4x4 grid layout of the 16 types.

**Whole type.** The claim that the four letters interact rather than add, so a type is more than the
sum of its letters.

## Measurement terms

**Alpha (Cronbach's alpha).** A measure of internal consistency from 0 to 1. Whether the items on one
scale agree with each other. .70 is the usual floor.

**Bimodal.** A distribution with two humps. What type theory predicts and what MBTI scores do not show.

**Construct validity.** Whether an instrument measures the thing it claims to measure.

**Convergent validity.** Whether scores agree with other measures of the same thing. A correlation of
.50 or above is the usual evidence threshold.

**Dichotomising.** Cutting a continuous score into two categories. Costs information. On the MBTI,
26% to 32% per scale.

**Discriminant validity.** Whether scores differ from measures of *other* things. Correlations below
about .20 are usually read this way.

**Disparate impact.** In US employment law, a selection procedure that disproportionately excludes a
protected group, whether or not that was intended.

**Effect size.** How big a relationship is, not just whether it exists. Reported here mostly as r
(correlation) or R² (share of variance explained).

**Forced choice.** An item format offering two options with no neutral point. Can inflate internal
consistency figures as an artifact.

**Forer effect.** The tendency to accept vague, flattering descriptions as accurate personal portraits.
Named after a 1949 classroom demonstration. Also called the Barnum effect.

**Incremental validity.** Whether adding an instrument improves prediction over what you already had.
No published evidence exists for the MBTI.

**Internal consistency.** See alpha.

**Item response theory (IRT).** A scoring approach that weighs items by how well they distinguish
people. Used for MBTI Form M.

**Ipsative.** Scoring where a person's scores are relative to each other rather than to a population.
Forced-choice formats push toward this and it complicates comparisons between people.

**Latent class analysis.** A statistical method that looks for hidden subgroups. Used for MBTI Global
Step I scoring from 2018.

**Norm sample.** The reference group scores are interpreted against. Form M used a US national
representative sample of 3,009; the 2018 Global versions use a global sample of 16,773.

**Preference Clarity Index (PCI).** Form M and Form Q output, 0 to 30, labelled Slight, Moderate,
Clear, Very Clear. Says how clearly a side was favoured. Does not say how much of a preference a
person has.

**Predictive validity.** Whether scores predict an outcome that matters.

**Probability Index (PI).** Global Step I and Step II output from 2018, 50 to 100, labelled Somewhat
likely, Likely, Very likely. Says how likely the same letter is on a retake.

**r.** The correlation coefficient, from -1 to 1. Square it for the share of variance shared between
two variables. r = .20 means 4%.

**R².** The share of variance in an outcome explained by a model. R² = 0.01 means 1%.

**Standard error of measurement (SEM).** How much a score would bounce around on repeated measurement.
On older MBTI continuous scales, 20 points or more.

**Structural validity.** Whether the internal structure of an instrument matches its claimed model.
Absent from the 193 studies sampled in the 2025 synthesis.

**Taxometrics.** Methods, developed by Meehl, for testing whether categories underlie continuous
scores. Applied to Jungian instruments in 2003; found no categories.

**Test-retest reliability.** Whether the same person gets the same result later. Reported either as a
correlation or as the share who keep the same category.

**Trait model.** A model that treats personality as continuous dimensions rather than kinds of people.
The Big Five and HEXACO are trait models.

**Typology.** A model that treats personality as a set of kinds. The MBTI is a typology, which is a
stronger claim than a trait model and therefore needs more evidence, not less.

## Named instruments and bodies

**Big Five.** Five-factor model of personality: extraversion, agreeableness, conscientiousness,
neuroticism, openness. Measured by NEO-PI-3, BFI-2, IPIP-NEO and others.

**CAPT.** Center for Applications of Psychological Type, founded 1975 by Isabel Briggs Myers and Mary
McCaulley.

**DISC.** A four-style model of workplace behaviour, sold by many vendors.

**EEOC.** US Equal Employment Opportunity Commission. Publishes the guidance on employment tests and
selection procedures.

**Enneagram.** A nine-type model built on core motivations and fears.

**HEXACO.** Six-factor model: the Big Five plus Honesty-Humility.

**Hogan.** A family of work-focused inventories (HPI, HDS, MVPI) built for occupational prediction.

**MMTIC.** Murphy-Meisgeier Type Indicator for Children, the official youth adaptation.

**NERIS Analytics.** The company behind 16Personalities. Unrelated to the MBTI's owners.

**The Myers & Briggs Foundation.** Non-profit holding the MBTI trademarks and publishing the code of
ethics.

**The Myers-Briggs Company.** The publisher. Called CPP, Inc. until late 2018.

**Socionics.** A separate 16-type system developed in the Soviet Union, with its own theory of
inter-type relations.

**Strong Interest Inventory.** An occupational interests inventory, not a personality measure.

---

<!-- 11archive-source: 10-methodology-and-sources.md -->

# Methodology and sources

## What this report is

A desk review of the Myers-Briggs Type Indicator: its theory, its instruments, its evidence base, the
arguments for and against it, its main alternatives, and the rules and laws that govern its use.

All web sources were read on 2026-08-11. No new data was collected, no person was assessed, and no
questionnaire was administered.

## How claims are graded

Every material claim in this bundle falls into one of these states. The state is stated inline where
it is not obvious.

| State | Meaning | Example in this report |
| --- | --- | --- |
| Observed | Read directly in a primary document obtained in full | The 20 facet alpha values, read from the publisher's technical brief |
| Source-reported | Reported by a named source that this report did not independently verify | The publisher's claim of internal consistency around .90 based on over 5 million records |
| Cited-through | A study this report did not read, quoted through a source it did read | Stricker & Ross (1962) retest figures, taken from Pittenger (2005) |
| Calculated | Derived arithmetically from source values | Form M's 93 items split as 21, 26, 24, 22 across the four scales |
| Inferred | A reasoned read, labelled as such | The data protection reasoning in section 07 |
| Unavailable | Wanted and not obtainable | The MBTI Manual, any edition |

Two rules were applied. Nothing is presented as a finding when the underlying study was not read;
those are marked cited-through. Where sources disagree, the disagreement is shown rather than
resolved, as with the per-type frequency tables in
02-the-type-model.md.

## Sources read in full

| ID | Source | Type |
| --- | --- | --- |
| S1 | Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. *Consulting Psychology Journal: Practice and Research*, 57(3), 210-221 | Peer-reviewed critique |
| S2 | Stein, R., & Swan, A. B. (2019). Evaluating the validity of Myers-Briggs Type Indicator theory. *Social and Personality Psychology Compass*, 13, e12434 | Peer-reviewed critique |
| S3 | Schaubhut, N. A., & Thompson, R. C. (2017). *Technical Brief for the MBTI Form M and Form Q Assessments: Singapore*. CPP, Inc. | Publisher technical document |
| S4 | The Myers-Briggs Company. *MBTI Global Assessment: Frequently Asked Questions* (two editions, one via Psychometrics Canada, 2022) | Publisher document |

S1 and S2 supply most of the critical numbers. S3 supplies the only item-level and facet-level
psychometrics obtained directly. S4 supplies the 2018 scoring change and item counts.

## Sources read as web pages or article summaries

| ID | Source | Used for |
| --- | --- | --- |
| S5 | The Myers-Briggs Company, MBTI Facts | Timeline, publisher reliability claims, satisfaction surveys, sample sizes |
| S6 | The Myers & Briggs Foundation, Reliability and Validity | Global retest figures, Capraro & Capraro meta-analysis figures |
| S7 | The Myers & Briggs Foundation, MBTI Basics | Definitions of the four pairs, best-fit type, equal value of types |
| S8 | The Myers & Briggs Foundation, MBTI Code of Ethics | The full ethical requirements in 07-use-misuse-and-law.md |
| S9 | The Myers & Briggs Foundation, three unique instruments | Step I, Step II, Step III scope and who may administer |
| S10 | The Myers & Briggs Foundation, type dynamics pages | Dominant, auxiliary, tertiary, inferior; the role of the J-P letter |
| S11 | Tshimula, J. M., Galekwa, R. M., & Chikhaoui, B. (2026). A critical analysis of MBTI-based personality profiling with large language models. *Frontiers in Computational Neuroscience*, 20, 1800284 | LLM persona findings, retest figures from its literature review |
| S12 | Zárate-Torres, R., & Correa, J. C. (2023). How good is the Myers-Briggs Type Indicator for predicting leadership-related behaviors? *Frontiers in Psychology*, 14, 940961 | The R² = 0.01 leadership result |
| S13 | Wu, W., Hao, W., Zeng, G., & Du, W. (2024). From personality types to social labels. *Frontiers in Psychology*, 15, 1419492 | Social anxiety mediation figures |
| S14 | US EEOC, Employment Tests and Selection Procedures | Job-relatedness, validation, disparate impact, vendor liability |
| S15 | Association for Psychological Type International, history page | 1962, 1969, 1975 events |
| S16 | Bloomberg Law and Alston & Bird commentary, February 2024 | Pre-hire personality testing as a live legal risk area |

## Sources used at abstract or secondary level only

| ID | Source | Limitation |
| --- | --- | --- |
| S17 | Erford, B. T., et al. (2025). A 25-Year Review and Psychometric Synthesis of the MBTI Form M. *Journal of Counseling & Development* | Paywalled, returned HTTP 402. Figures for 193 studies, alpha .845 to .921, the correlation thresholds, and the absence of structural and test-retest studies come from the abstract as surfaced in search results, not from the full text |
| S18 | McCrae, R. R., & Costa, P. T. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. *Journal of Personality*, 57, 17-40 | Abstract plus extensive quotation in S1 and S2. Sample of 267 men and 201 women, ages 19 to 93, is from the abstract |
| S19 | Emre, M. (2018). *The Personality Brokers* | Not read. Used only for the general historical point that the creators had no formal psychology training and that the history is archival |
| S20 | Furnham, A. (1996; 2020) on the MBTI and the NEO-PI | Cited through S1 and search summaries |
| S21 | Big Five and HEXACO job-performance meta-analytic figures | From a 2025 review in *Current Opinion in Psychology* and HEXACO meta-analyses, read as search summaries only. The r = .22 to .27 range for conscientiousness should be treated as source-reported |
| S22 | 16Personalities and the NERIS Type Explorer model | No peer-reviewed technical manual located. Description of the five-dimension model and the Assertive-Turbulent scale comes from the vendor's own material and third-party comparisons |
| S23 | DISC and Enneagram evidence status | Search summaries of secondary reviews only. The lowest-confidence rows in 06-alternatives-and-lookalikes.md |
| S24 | MBTI popularity in South Korea and China | CNN (2022), a Tinder Korea data report (2025), *The World of Chinese* (2023), and a survey reporting 69% awareness in China. Journalistic and single-survey sources. Directional only |
| S25 | Certification price of about US$2,995 for three days, 2026 | Third-party training-market sites, not the publisher's price list |
| S26 | Stromberg, J., & Caswell, E. (2015), Vox | The two million per year, 89 of the Fortune 100, and US$20 million revenue figures. Dated, and the company is private |

## Studies cited through S1 and S2

These are quoted because S1 and S2 quote them. This report did not read them. Anyone relying on a
specific number should go to the original.

Through Pittenger (S1): Stricker & Ross (1962) 14-month retest; Howes & Carskadon (1979) mid-range
letter flips; McCarley & Carskadon (1983) five-week 50% figure; Myers et al. (1998) four-week 35%
figure; Walck (1992) self-disagreement with assigned type; Harvey & Murry (1994) information loss and
standard error; Bess & Harvey (2002) distributions under item response theory scoring; Cohen (1983)
variance loss from dichotomising; Tenopyr (1988) forced-choice artifacts; Berr, Church & Waclawski
(2000) manager scale means and the r = .20 personality-performance figure; Gardner & Martinko (1996)
management literature review; Bjork & Druckman (1991), National Research Council, on career
counselling; Capraro & Capraro (2002) internal consistency meta-analysis; Sipps, Alexander & Freidt
(1985), Saggino & Kline (1996), Saggino, Cooper & Kline (2001), Lorr (1991) on factor and cluster
structure.

Through Stein & Swan (S2): Arnau, Green, Rosen, Gleaves & Melancon (2003) taxometric analysis of
Jungian instruments; Meehl (1992) taxometric method; Forer (1949); Sperber (2010) guru effect;
Strohminger, Knobe & Newman (2017) on the true self; O'Keefe, Dweck & Walton (2018) on revealed
interests; Haidt (2001) and Epstein et al. (1996) on intuition and reasoning; De Young (2014) on
cybernetic Big Five theory; Hayes (2014) for the publisher's position that the instrument is not for
prediction; Quenk (2009) for MBTI definitions.

## What this report could not obtain

| Wanted | Status |
| --- | --- |
| MBTI Manual, any of the four editions (1962, 1985, 1998, 2018) | Unavailable. Not public. Every manual figure in this bundle is quoted through the publisher's web pages, its technical briefs, or the critical literature |
| MBTI Step II Manual Supplement | Requested, returned HTTP 404 |
| Erford et al. (2025) full text | Paywalled |
| Independent test-retest study published since 1999 | None located, consistent with S17's finding that the category was absent from its sample |
| Independent structural validity study published since 1999 | None located, same reason |
| Authoritative per-type frequency table with a named sample | Not obtained. Conflicting tables are shown side by side instead |
| The 2018 Global manual's reliability and validity tables | Not obtained. The 6-to-15-week figures of .81 to .86 on 1,721 adults come from S6 quoting that manual |
| Peer-reviewed technical documentation for 16Personalities | Not located |
| Any controlled trial of whether an MBTI intervention improves an outcome | None located. This is the largest gap in the field |

## Known limitations of this report

1. **English-language only.** Substantial literature and commercial practice exists in Korean, Chinese,
   Japanese, and German. Korea and China are two of the largest cultural markets for type, so the
   omission is material for the popularity and harms sections.
2. **Publisher figures are mostly second-hand.** The manuals are not public. Where a figure comes from
   a publisher web page rather than a technical document, it is labelled.
3. **Predictive evidence rests on few studies.** The clearest recent direct test, S12, used 464
   Colombian business students, which is not a general population, and it measured self-reported
   leadership practices rather than performance.
4. **The taxometric case rests substantially on one study**, Arnau et al. (2003), cited through S2.
   It is a strong result and it has not been contradicted in anything located here, but it is one
   study.
5. **The legal section is not legal advice.** It is US-focused with general data protection reasoning
   added, and the data protection part is explicitly inferred rather than drawn from a regulator
   decision about this instrument.
6. **Confidence is uneven by design.** The MBTI's psychometrics are documented in detail; its
   alternatives' evidence bases were surveyed, not audited. The alternatives table is the weakest part
   of the bundle and says so.
7. **No primary reading of Jung.** *Psychological Types* is described through secondary sources.

## Reproducing this

1. Read S1 and S2 in full. They are the two most information-dense sources and both are obtainable.
2. Read S3 for real numbers on the instrument, including the weak facets the publisher publishes.
3. Read S4 for the 2018 scoring change, which is the most recent substantive development.
4. Read S8, the code of ethics, before any conversation about organisational use.
5. Then decide whether the manual is worth buying. Every unresolved question in this report is a
   question the manuals might answer.

## Change log

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-08-11 | First issue |
