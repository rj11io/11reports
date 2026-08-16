<!-- 11archive-source: README.md -->

# Testing: Every Kind, and What They Have in Common

Testing gets taught one domain at a time. Software engineers learn unit tests and never
hear about acceptance sampling. Quality engineers learn AQL tables and never hear about
mutation testing. Doctors, teachers, auditors and structural engineers each learn their
own vocabulary for the same handful of ideas.

This report covers software testing in depth, then covers testing everywhere else, then
maps the two onto each other.

## Read this first

**There is one kind of testing, run at wildly different costs.** Every test in every field
has the same six parts: a subject, a stimulus, an oracle that says what should have
happened, a threshold, a claim about what was covered, and a decision that follows. A
field's characteristic failure is whichever part it habitually leaves unstated. Software
leaves out the coverage claim, which is why "the tests pass" gets read as "the software
works".

## Contents

| If you want | Read |
|---|---|
| The short version and the eight findings | 00 Executive brief |
| **The six-part frame the whole report rests on** | 01 The anatomy of a test |
| Unit, integration, contract, end-to-end, production | 02 Software testing by scope |
| Choosing test cases by hand | 03 How to choose test cases |
| Property-based, fuzzing, mutation, metamorphic, snapshot | 04 Machine-generated tests |
| Performance, security, accessibility, and the rest | 05 Testing what the software is like |
| TDD, test doubles, the shapes argument, CI gates, chaos | 06 Practices and workflows |
| Aviation, cars, medical devices, and testing AI | 07 When testing is regulated |
| Hypothesis tests, RCTs, p-values, the replication crisis | 08 Science and statistics |
| Clinical trials, diagnostics, and the base rate problem | 09 Medicine and diagnostics |
| NDT, sampling plans, HALT, commissioning, crash tests, food | 10 Materials and manufacturing |
| Exams, hiring, doping, forensics, fire drills, red teams | 11 People and organisations |
| Fake doors, A/B tests, bank stress tests, backtesting | 12 Markets and money |
| **The translation table, and five things to steal** | 13 The translation table |
| The twelve failure modes shared by every field | 14 How testing fails, everywhere |
| Terms, including ones that differ across fields | 15 Glossary |
| How this was built, and what it does not cover | 16 Methodology and sources |

## What is original here

**The six-part frame, and the claim built on it.** Sorting tests by domain hides what they
share. Sorting them by which part a field leaves unstated predicts how that field fails.
Set out in 01, used throughout, and summarised in
14.

**A cross-domain translation table.** Forty-odd software testing terms mapped to their
equivalents in materials, aviation, medicine, laboratories, finance and emergency planning.
Canary release is dose escalation. Mutation testing is proficiency testing. Staging is a
factory acceptance test. 13.

**Five concrete practices software should take from older testing disciplines**, with a
worked example of the first: a written sampling plan for a service, stating the accepted
escape rate, inspection intensity, flake budget, and a rule that relaxes inspection after a
clean run. 13.

**One recomputed calculation.** The diagnostic table in 09
is worked from stated sensitivity, specificity and prevalence rather than quoted, so a
reader can check the arithmetic that produces a 7.9% positive predictive value from a good
test.

## Scope

**Covered:** software testing by scope, technique, generation method and quality attribute;
practice and workflow; regulated and safety-critical testing including testing of AI
systems; and testing in statistics, medicine, materials and manufacturing, psychometrics
and education, organisational security, and product and financial decision-making.

**Not covered:** tool comparisons and recommendations. Quantitative claims about which
practices produce better outcomes, because the evidence is weaker than its citation
frequency suggests. Test management tooling, staffing, and outsourcing.

Evidence boundary: public documentation, standards bodies' own descriptions, published
papers and regulator publications, read on 16 and 17 August 2026. No tools were installed
or exercised. Paywalled standards were not purchased; where a standard's contents are
described, the source is its publisher's public material or a technical summary that cites
it. Conflicting figures are listed in 16.

## Related

The measurement problems in 14, applied to one narrow subject in
depth, are the companion report
[AI Benchmarking: A Working Reference](https://01kzseh0r0jaeg8n3cr0qx4kt2.reports.rj11.io).

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The short answer

**There are not many kinds of testing. There is one kind of testing, run at wildly
different costs.** A unit test, a weld inspection, a Phase 3 drug trial, a bank stress
test, and a school exam are the same six-part machine: a subject, a stimulus, an oracle
that says what should happen, a threshold, a claim about what was covered, and a decision
that follows.

Sorting testing by domain, as most writing does, hides that. Sorting it by which of the
six parts a field leaves unstated explains almost every failure in every field.

| Field | Part left unstated | Result |
|---|---|---|
| Software | coverage claim | "the tests pass" gets read as "the software works" |
| Statistics | threshold and decision | p < 0.05 gets read as a discovery |
| Medical screening | coverage claim, specifically the base rate | a positive result gets read as a diagnosis |
| Education | oracle, specifically what the exam stands for | the score replaces the skill |
| Manufacturing | nothing, usually | the paperwork becomes the product |

## The eight findings

**1. Software is the only serious testing discipline with no sampling plan.**
Manufacturing states, before inspection begins, how much will be inspected, what defect
rate is accepted, what result rejects the batch, and who carries each risk. ISO 2859-1 puts
it on one page. Software teams have all four implicitly and none explicitly, which is why
"are we testing enough" is an argument that never resolves.
(10, 13)

**2. Coverage measures contact, not examination.** A suite that calls every function and
asserts nothing scores 100% line coverage. Mutation testing, which changes the code and
counts how many changes the suite notices, is the only widely available measure that tests
the tests, and it dates to 1978. (03,
04)

**3. Big tests lie. Measurably.** Google published flakiness by test size across a week of
its own continuous integration: 0.5% for small tests, 1.6% for medium, and 14% for large.
Roughly one large test in seven returns an answer unrelated to whether the code works.
That number, not fashion, is the real argument behind every test-shape debate.
(02)

**4. When the thing you look for is rare, most of your positives are wrong, however good
the test.** A mammogram with 85% sensitivity and 90% specificity, in a population where 1%
have breast cancer, gives a positive result that is correct 7.9% of the time. Recomputed in
09. The same arithmetic governs your alerting rules, your
dependency scanner, and your fraud model. The fix is never a better single test; it is a
cheap sensitive pass followed by an expensive specific one.

**5. Metrics decay into targets, and every field has watched it happen.** US schools under
high-stakes testing shifted 20% to 30% more class time to test preparation. Software teams
hit coverage targets with assertion-free tests and improve change failure rate by deploying
less. Campbell's law and Goodhart's law describe the same effect. The defence that works is
institutional: Euro NCAP revises its crash protocols on a schedule precisely because
manufacturers optimise for the test. (11,
14)

**6. Verification and validation mean the same thing in every field, and software is the
one that blurs them.** Verification asks whether you built it to specification. Validation
asks whether the specification could ever have worked. Food safety law separates them
formally under HACCP. A team with a green build has verification. Very few have validation.
(07, 10)

**7. Testing in production is not a compromise, it is a regulated requirement elsewhere.**
Phase 4 clinical trials exist because a 3,000-person Phase 3 trial cannot detect a harm
affecting one patient in 20,000. Release plus surveillance is the only design that finds
it. Canary releases, dark launching and synthetic monitoring are the same idea, and chaos
engineering's "minimise the blast radius" is the same principle as dose escalation.
(06, 09)

**8. Most ideas do not work, and experimentation is mostly for stopping things.** At
Microsoft, across years of online controlled experiments, roughly one third of ideas moved
the target metric positively, one third did nothing, and one third made things worse. A
team whose experiments almost always win is not succeeding, it is measuring badly.
(12)

## The number that should change a decision

Two figures in this report describe the same tools and disagree by a factor of two and a
half. Automated accessibility testing catches **57%** of accessibility issues by volume,
and **22.6%** of the issues a manual audit finds, and covers **20% to 40%** of distinct
WCAG success criteria. All three are correct. They have different denominators.

That is the whole report in one example. **A test result without its denominator is not a
result.** (05, 14)

## What to do about it

Five practices from other fields, ranked by change per unit of effort. Full versions in
13.

1. **Write the sampling plan.** One page per service: accepted escape rate, inspection
   intensity, flake budget, and a rule that relaxes inspection after a clean run.
2. **Grade rigour by consequence.** Three tiers is enough. Put mutation testing and
   independent review on the top tier and stop apologising for light coverage on the
   bottom one.
3. **Test the tests on a schedule.** Mutation score on the critical modules, tracked. Plus
   the free version: at every incident review, ask why no test caught it.
4. **Write the negative coverage claim.** A short "what this suite does not cover" note
   next to the tests. It takes an hour and it is the most honest artefact most teams could
   produce.
5. **Separate the author from the verifier where the stakes justify it.** Someone other
   than the author should confirm the acceptance criteria against what was actually asked
   for.

---

<!-- 11archive-source: 01-anatomy-of-a-test.md -->

# The anatomy of a test

Every test ever run is the same six-part machine. A unit test in JavaScript, an
ultrasound scan of a weld, a Phase 3 drug trial, and a school exam differ in cost and
consequence, not in shape.

Naming the six parts is useful because **a field's characteristic failure is whichever
part it leaves unstated.** Software leaves out the coverage claim. Medicine leaves out
the base rate. Education leaves out the construct. Manufacturing states all six, because
a lawyer will eventually read the paperwork.

## The six parts

| Part | Question it answers | Software example | Non-software example |
|---|---|---|---|
| Subject | What exactly is under test? | one function, `parsePrice()` | one weld on one pipe joint |
| Stimulus | What do you do to it? | call it with `"$1,299.00"` | send high-frequency sound through the weld |
| Oracle | How do you know the right answer? | the assertion `expect(result).toBe(129900)` | a reference block with a known, measured flaw in it |
| Threshold | Where is the pass/fail line? | exact equality; any difference fails | reject if the returned echo exceeds a set share of the reference echo |
| Coverage claim | What did this result cover, and what did it not? | US dollar format only; no euros, no negatives | flaws inside the metal only; says nothing about surface cracks |
| Decision | What changes because of the result? | block the merge | cut the weld out and redo it |

Drop any one part and the test stops being a test:

- No subject: you are describing, not testing.
- No stimulus: you are inspecting, not testing.
- No oracle: you are observing, not testing. This is the hard one, and it has a name.
- No threshold: you are measuring, not testing.
- No coverage claim: you have a result you cannot size.
- No decision: you have a ritual.

## The oracle is the hard part

An **oracle** is whatever tells you the observed behaviour was correct. Software testing
research calls the difficulty of getting one the **test oracle problem**, named in
Elaine Weyuker's 1982 paper "On Testing Non-Testable Programs" and surveyed in depth by
Barr and colleagues in 2015.

The problem is easy to see with a concrete case. Write a function that sorts a list, and
the oracle is trivial: check the output is in order and holds the same items. Write a
function that renders a 3D scene, or ranks search results, or estimates a house price,
and there is no cheap way to know the right answer. You are testing a program precisely
because you could not compute the answer another way.

Every field solves this differently, and the solutions are worth borrowing:

| Oracle strategy | How it works | Where it is used |
|---|---|---|
| Stated expected value | Someone writes down the answer in advance | unit tests, exam answer keys |
| Reference standard | Compare against a physical or certified artefact | calibration weights, NDT reference blocks, lab controls |
| Second implementation | Run two independent versions, compare | differential testing, dual-entry bookkeeping, double data entry in trials |
| Previous version | Compare against what the system did last time | snapshot and approval tests, regression baselines, control charts |
| Relation, not value | You do not know the answer, but you know how two answers must relate | metamorphic testing, physical conservation laws |
| Property | You do not know the answer, but you know a rule it must obey | property-based testing, mass balance in chemistry |
| Human judgement | An expert decides | exploratory testing, sensory panels, radiologists, peer review |
| Control group | The oracle is a second population that got nothing | clinical trials, A/B tests, field experiments in economics |

The last row is the one software borrowed most recently and least completely. An A/B
test is a randomised controlled trial with the vocabulary filed off.

## Two ways to be wrong, in every field

A test can be wrong in exactly two directions, and every domain has invented its own
words for the same two mistakes.

| Domain | False positive means | False negative means | Which one hurts more |
|---|---|---|---|
| Software test suite | flaky test, red build on good code | escaped defect reaching users | false positives, because they train people to ignore the suite |
| Static analysis and linters | noisy warning on correct code | missed vulnerability | false positives, for the same reason |
| Medical screening | healthy person told they may be ill | illness missed | depends on the disease and the follow-up cost |
| Manufacturing inspection | good part scrapped, "producer's risk" | bad part shipped, "consumer's risk" | stated explicitly in the sampling plan, in advance |
| Airport and security screening | innocent bag flagged | weapon missed | false negatives, so thresholds run permissive |
| Spam filtering | real mail in the junk folder | spam in the inbox | false positives, badly |
| Court and forensics | innocent person convicted | guilty person freed | the whole system is tuned around the first |
| Fire alarm | evacuation for burnt toast | no alarm during a fire | false positives erode the response to real ones |

Two general lessons fall out of this table.

**First, the ratio is a design choice, not a fact.** Manufacturing writes it down as two
named risks: producer's risk, the chance of rejecting a good batch, and consumer's risk,
the chance of accepting a bad one. Software almost never writes it down, which is why
teams argue about flaky tests as if the correct rate were zero. The correct rate is
whatever you decided the cost of a false alarm is.

**Second, a very accurate test can still be mostly wrong.** This is the single most
misunderstood fact about testing anywhere, and it has nothing to do with the test's
quality. If a condition is rare, most positive results are false, no matter how good the
test is. Section 09 works the arithmetic with a real
example: a mammogram with 85% sensitivity and 90% specificity, applied where 1% of women
have breast cancer, produces a positive result that is correct only 8% of the time.

The same arithmetic governs a security scanner that flags 2% of dependencies in a
codebase with three real vulnerabilities, and a school test that identifies "gifted"
children where giftedness is rare. Software teams meet this every time an alerting rule
fires all night on a healthy system.

## Where each field hides a part

This is the practical payoff of the frame. Read a test in any field and ask which of the
six parts nobody wrote down.

| Field | The part left implicit | What goes wrong |
|---|---|---|
| Software | coverage claim | "the tests pass" is read as "the software works" |
| Statistics and social science | threshold and decision | p < 0.05 gets treated as a discovery rather than a chosen line |
| Medical screening | coverage claim, specifically the base rate | a positive result is read as a diagnosis |
| Education | oracle, specifically what the exam is a proxy for | the score replaces the skill it stood for |
| Manufacturing | nothing, usually | the paperwork is the product, so cost and rigidity rise |
| Security testing | coverage claim | "we passed the pentest" is read as "we are secure" |
| Machine learning evaluation | oracle and coverage claim | benchmark contamination, and scores that do not transfer |

Manufacturing is the useful outlier. A sampling plan under ISO 2859-1 states the lot
size, the sample size, the accept and reject numbers, the acceptance quality limit, and
both risks, on one page, before inspection starts. Nothing in mainstream software
testing does this. Section 13 argues it should.

## Sources

- Weyuker, E. "On Testing Non-Testable Programs", *The Computer Journal* 25(4), 1982.
- Barr, Harman, McMinn, Shahbaz, Yoo. "The Oracle Problem in Software Testing: A Survey",
  *IEEE Transactions on Software Engineering* 41(5), 2015, pp. 507-525.
  [ACM](https://dl.acm.org/doi/10.1109/TSE.2014.2372785)
- [ISO 2859-1 sampling and inspection levels](https://qualityinspection.org/inspection-level/)
- [NY State Department of Health, disease screening arithmetic](https://www.health.ny.gov/diseases/chronic/discreen.htm)

---

<!-- 11archive-source: 02-software-scope-levels.md -->

# Software testing by scope

The first way to sort software tests is by how much of the system each one switches on.
This is the axis people mean when they say "unit test" or "end-to-end test".

The vocabulary is genuinely inconsistent across teams. "Integration test" means three
different things in three different companies. The reliable way to talk about a test is
to say what it starts up, not what it is called.

## The ladder

| Level | What it starts up | Typical time | What it can catch | What it cannot catch |
|---|---|---|---|---|
| Static analysis | nothing; reads the code | milliseconds | type errors, unsafe patterns, style, some security bugs | anything about runtime behaviour |
| Unit | one function or class, everything else replaced by stand-ins | under 10ms | logic errors in that one piece | wrong assumptions about the pieces around it |
| Component | one module with its real internals, external systems replaced | 10ms to 1s | wiring inside a module | wiring between modules |
| Integration | two or more real parts together, often with a real database | 100ms to 10s | mismatched interfaces, schema errors, transaction bugs | whole-journey problems |
| Contract | one service, plus a recorded agreement with another | under 1s | one side changing an interface the other relies on | behaviour neither side wrote down |
| System | the whole application, dependencies stubbed at the edge | seconds | configuration, startup, cross-cutting behaviour | real third-party behaviour |
| End-to-end | everything real, driven through the real interface | seconds to minutes | anything, in principle | anything, reliably, in practice |
| Acceptance | the system, judged against what a user or buyer asked for | varies | "we built the wrong thing" | "we built it badly" |
| Production | the live system, with real traffic | continuous | everything the other levels assumed away | problems you did not think to watch for |

### Unit

A **unit test** exercises one small piece in isolation, with its neighbours replaced by
stand-ins. Concretely: a test for `applyDiscount(cart, code)` that never touches a
database, never makes a network call, and finishes in under a millisecond.

Unit tests are fast, precise about where the fault is, and blind to whether the pieces
fit together. Their real cost is design pressure: to isolate a unit you must be able to
substitute its dependencies, which pushes code toward interfaces and injection whether
or not the design wanted them.

### Component and integration

**Integration testing** turns on more than one real part. A typical example: start a real
PostgreSQL in a container, run the repository layer against it, and check that a
migration and a query agree. This catches the class of bug unit tests are structurally
incapable of catching, where each piece is correct and the assumption between them is
wrong.

The cost is speed and setup. Test containers, database seeding, and cleanup between runs
are the bulk of the work.

### Contract

**Contract testing** solves a specific problem: service A calls service B, and you want
to know that a change to B breaks A, without running A and B together.

The consumer-driven version, popularised by [Pact](https://docs.pact.io/), works in two
halves:

1. A's test suite runs against a mock of B, and records every request it made and every
   response it expected. That recording is the contract, a file.
2. B's test suite replays that file against the real B, and fails if B can no longer
   satisfy it.

Neither service ever runs alongside the other. A broker stores the contracts and the
verification results, and answers the deploy-time question: is this version of A safe to
release against the version of B currently in production?

This is the closest software has to a **reference standard**, the same idea a calibration
lab uses. See 13.

### End-to-end

An **end-to-end test** drives the real system through its real interface, usually a
browser or an API client, with real dependencies. It is the only level that tests the
thing users actually touch.

It is also, measurably, the level that lies most often. Google published flakiness rates
by test size across a week of its own continuous integration:

| Google test size | Roughly corresponds to | Flaky rate |
|---|---|---|
| Small | unit, single process, no network or disk | 0.5% |
| Medium | single machine, may use localhost network | 1.6% |
| Large | multi-machine, full system | 14% |

A **flaky** test is one that passes and fails on the same code. At 14%, roughly one large
test in seven gives you an answer unrelated to whether the code works. That is not a
tooling problem to be fixed; it is a property of testing systems with clocks, networks,
and concurrency in them, and it is the strongest single argument for the shapes discussed
in 06.

### Production

Testing does not stop at release, and pretending it does discards the only environment
with real data, real traffic, and real scale. The practices are covered in
06: canary releases, feature flags, synthetic
monitoring, and chaos engineering.

## The other axis: what a test is allowed to touch

Google's small/medium/large taxonomy sorts tests by resources rather than by scope, and
it is more useful for a build system, because a build system can enforce it.

- **Small**: one process, no network, no disk, no sleeps. Enforced, not requested.
- **Medium**: one machine, localhost network allowed.
- **Large**: anything.

The point of the taxonomy is that it is mechanically checkable. A test that tries to open
a socket in a small test target fails to run at all. This is worth stealing: "unit test"
is a claim about intent, "no network access" is a claim a machine can verify.

A test that runs entirely from its own declared inputs, with no shared or external state,
is called **hermetic**. Hermetic tests are the reason a build can be cached and run in
parallel across thousands of machines.

## Who runs the test, and when

Scope is not the only distinction that matters. Two others sort tests usefully.

**By who judges the result:**

- Developer tests: written by the person writing the code, run before merge.
- Independent tests: run by a separate quality function, common in regulated and
  safety-critical work. See 07.
- User acceptance testing (UAT): the buyer or a real user decides whether it is what they
  asked for. This is the only level that catches "correct software, wrong product".
- Operational acceptance: can the operations team run, monitor, back up, and restore it.

**By what triggers the run:**

- On every save: static analysis, fast unit tests.
- On every commit or pull request: the main suite, plus a **smoke test**, a very small set
  of checks that answers "is this build broken enough that running the rest is a waste of
  time".
- Nightly or weekly: long suites, performance runs, full browser matrices.
- On release: acceptance, and a **build verification test** against the deployed artefact.
- Continuously in production: synthetic checks and monitoring.

**Regression testing** is not a level. It is a purpose: re-running existing tests to check
that a change did not break something that used to work. Almost any test at any level can
serve as a regression test the second time it runs. **Confirmation testing**, sometimes
called retesting, is the narrower act of re-running the specific test that exposed a
defect, after the fix.

## Sources

- [Google Testing Blog: Where do our flaky tests come from?](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html)
- [Google Testing Blog: Flaky Tests at Google and How We Mitigate Them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- Memon, Gao et al. [Taming Google-Scale Continuous Testing](https://research.google.com/pubs/archive/45861.pdf)
- [Pact: consumer-driven contract testing](https://docs.pact.io/)
- [ISTQB Certified Tester Foundation Level v4.0, test levels and test types](https://astqb.org/4-1-test-techniques-overview/)

---

<!-- 11archive-source: 03-software-design-techniques.md -->

# How to choose test cases

Scope tells you how much of the system a test turns on. This section is about a different
question: given that you cannot try every input, which inputs do you try?

The international vocabulary comes from the ISTQB Foundation syllabus, which sorts
techniques into three families:

- **Black-box**, also called specification-based. You look at what the software is
  supposed to do. You do not look inside.
- **White-box**, also called structure-based. You look at the code and pick inputs that
  reach parts of it.
- **Experience-based**. You use what testers know about where bugs live.

They are complementary, not competing. Black-box finds missing behaviour, white-box finds
unreachable and untested behaviour, experience-based finds what neither thought to ask.

A fourth family, where a machine generates the cases, is covered separately in
04.

## Black-box techniques

### Equivalence partitioning

Split the inputs into groups where every member should be handled the same way, then test
one member of each group.

Concretely, a discount rule for age:

| Group | Example input | Expected |
|---|---|---|
| under 18 | 12 | child price |
| 18 to 64 | 30 | full price |
| 65 and over | 70 | senior price |
| invalid: negative | -5 | rejected |
| invalid: not a number | "abc" | rejected |

Five tests instead of every integer. The assumption doing the work is that if 30 is
handled correctly, 31 is too. That assumption is usually right in the middle of a range
and usually wrong at the edges, which is why the next technique exists.

### Boundary value analysis

Bugs cluster at edges, because edges are where `<` and `<=` get confused. Test the value
on each side of every boundary.

For the same age rule, the boundaries are 18 and 65, so test 17, 18, 64, 65, plus the
absolute limits: 0, and whatever the maximum is.

This is the highest-yield black-box technique per test written. Off-by-one at a boundary
is one of the most common defects in any codebase.

### Decision tables

When output depends on a combination of conditions, write the combinations down as a
table. Filling it in exposes the combinations nobody specified.

A shipping rule:

| Member? | Order over 50? | Fragile? | Shipping |
|---|---|---|---|
| yes | yes | no | free |
| yes | yes | yes | free, packed |
| yes | no | no | 4.99 |
| yes | no | yes | 8.99 |
| no | yes | no | 4.99 |
| no | yes | yes | 8.99 |
| no | no | no | 7.99 |
| no | no | yes | 11.99 |

Three yes/no conditions produce eight rows. The value of the table is that the eight rows
are visible; a requirements document usually specifies four of them and leaves the reader
to guess the rest.

### State transition testing

When the system's response depends on what happened before, model it as states and the
events that move between them, then test the transitions, including the ones that should
be refused.

An order: `created` to `paid` to `shipped` to `delivered`, with `cancelled` reachable from
some states and not others. The interesting tests are the illegal transitions: what
happens if a `cancel` arrives for an already-shipped order, or a second `pay` arrives for
a paid one? Payment systems live or die on this class of test.

### Pairwise and combinatorial testing

When many settings can combine, the full set explodes. Ten settings with three values each
is 59,049 combinations.

**Pairwise testing** exploits the empirical finding that most defects involve one factor
or the interaction of two, not five. It selects a small set of test cases such that every
pair of values from every pair of settings appears at least once. For the case above,
pairwise coverage typically needs a few dozen cases rather than 59,049.

It is a bet, and worth stating as one: pairwise will not find a bug that requires three
specific settings to line up.

### Use case and scenario testing

Test a complete user journey, in order, as a user would perform it. "Register, verify
email, add an item, check out with a saved card, request a refund." This finds the
problems that live between features rather than inside one, and it is the black-box
technique closest to acceptance testing.

## White-box techniques

White-box techniques measure how much of the code the tests reach. Each criterion below
subsumes the one above it: satisfying branch coverage guarantees statement coverage, and
so on.

| Criterion | Requirement | Test count for `if (a && b)` |
|---|---|---|
| Statement | every line runs at least once | 1 |
| Branch, also called decision | every decision takes both outcomes | 2 |
| Condition | every single condition takes both values | 2 |
| Modified condition/decision (MC/DC) | each condition is shown, independently, to change the result | 3 |
| Multiple condition | every combination of conditions | 4 |
| Path | every route through the code | grows past counting with loops |

### The coverage trap

100% statement coverage means every line ran. It does not mean every line was checked. A
test suite that calls every function and asserts nothing scores 100%.

This is not a hypothetical. Coverage is a measure of what your tests *touched*, and it is
routinely read as a measure of what your tests *verified*. The gap between those two
readings is exactly the gap that 04 closes with
mutation testing, which measures whether removing correct behaviour makes any test fail.

Use coverage the way it works: as a way to find code no test reaches at all. A file at 0%
is a real finding. The difference between 84% and 86% is noise.

### MC/DC, and why aviation requires it

**Modified condition/decision coverage** requires that each condition in a decision is
shown by execution to independently affect the outcome. For `if (a && b)`, that needs
three cases: one where flipping `a` alone changes the result, one where flipping `b` alone
changes the result, and the shared reference case.

DO-178C, the standard for airborne software, requires MC/DC for Level A software, the
level where a failure is catastrophic. Table A-7 of the standard sets it out.

The reason it is the criterion chosen, rather than testing every combination, is cost
arithmetic: for a decision with N conditions, MC/DC needs about N+1 tests, while every
combination needs 2^N. For a ten-condition decision that is 11 tests instead of 1,024,
while still proving each condition matters.

This is a good example of a threshold set deliberately, with the cost stated. Most
software coverage targets are set by rounding to a number that sounds serious.

## Experience-based techniques

### Exploratory testing

**Exploratory testing** is simultaneous learning, test design, and test execution. The
tester works from a charter rather than a script: "explore the checkout flow with expired
payment methods, for 60 minutes, looking for states the user cannot get out of."

It is not ad hoc clicking. Session-based test management gives it structure: a time-boxed
session, a stated charter, notes taken during the session, and a debrief. What comes out
is a list of findings and a record of what was covered, which is the coverage claim from
01 supplied by a human rather than a tool.

Exploratory testing finds a class of defect automation structurally cannot: things nobody
specified, and therefore nobody wrote an assertion for. A scripted test can only fail in
ways its author imagined.

### Error guessing

Use knowledge of where this team, this language, or this kind of system usually goes
wrong. Empty list. Null. Zero. Very large number. Unicode in a name field. Two requests at
once. Daylight saving time. A leap day. A user in a timezone with a 45-minute offset.

This is a checklist built from scar tissue, and it is more effective than its
unscientific reputation suggests.

### Checklist-based testing

Codify the scar tissue so it survives the person leaving. Accessibility, security, and
release checklists are all this technique. The failure mode is the checklist becoming a
ritual that is ticked rather than performed, which is the same failure mode that ruins
safety paperwork in every other industry.

## Choosing between them

| If your risk is | Reach for |
|---|---|
| a rule with ranges or limits | boundary value analysis |
| a rule with several conditions combined | decision table |
| order-dependent behaviour | state transition |
| many configuration options | pairwise |
| code that might not be exercised at all | coverage measurement |
| a safety-critical decision | MC/DC |
| something nobody specified | exploratory |
| a defect that already escaped once | add a regression test at the lowest level that reproduces it |

## Sources

- [ISTQB Certified Tester Foundation Level v4.0, test techniques overview](https://astqb.org/4-1-test-techniques-overview/)
- [LDRA: Modified Condition/Decision Coverage](https://ldra.com/capabilities/mc-dc/)
- [Modified condition/decision coverage, DO-178C Table A-7 requirement](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)
- ISO/IEC/IEEE 29119-4, Test Techniques.
  [softwaretestingstandard.org](https://softwaretestingstandard.org/)

---

<!-- 11archive-source: 04-software-generative-techniques.md -->

# Machine-generated tests

The techniques in 03 all end with a human writing a
test case. This section covers the ones where a machine writes the cases, or writes the
verdict, or both.

They matter disproportionately because they attack the two limits of hand-written tests:
a human writes the cases they thought of, and a human asserts the behaviour they expected.

## Property-based testing

Instead of stating one input and one expected output, state a rule the output must always
obey, and let the tool generate hundreds of inputs looking for one that breaks the rule.

```javascript
// example-based: one case, one answer
expect(reverse([1, 2, 3])).toEqual([3, 2, 1])

// property-based: a rule, and a few hundred generated lists
forAll(arrayOf(integers), (list) => {
  expect(reverse(reverse(list))).toEqual(list)
})
```

The rule "reversing twice gives you back what you started with" holds for every list, so
the tool is free to try the empty list, a single item, 10,000 items, duplicates, and
negative numbers, without anyone listing them.

Useful properties, in rough order of how often they apply:

- **Round trip**: `decode(encode(x)) == x`. Applies to any serialiser, parser, or codec.
- **Invariant**: a sorted list has the same length and the same items as the input.
- **Idempotence**: applying twice equals applying once. Applies to most cleanup and
  normalisation code.
- **Comparison against a slow, obviously correct version**: a naive implementation you
  would never ship, used only as the oracle.

When a property fails, the tool **shrinks** the failing input: it repeatedly simplifies
until it finds the smallest input that still fails. A failure on a 400-item list arrives
as a failure on `[0, 0]`, which is a bug report a human can read.

Property-based testing was introduced by Koen Claessen and John Hughes in the 2000 paper
on QuickCheck for Haskell. The idea now appears in nearly every language: Hypothesis for
Python, fast-check for JavaScript, ScalaCheck, proptest for Rust.

## Fuzzing

Feed the program malformed, unexpected, or randomly mutated input, and watch for crashes,
hangs, memory errors, and assertion failures. The oracle is weak on purpose: the test is
not "did it produce the right answer" but "did it stay alive".

**Coverage-guided fuzzing** is the version that works. The fuzzer instruments the binary,
notices when an input reaches a new branch, and keeps that input as a seed to mutate
further. It discovers file formats and protocols by hill-climbing on coverage, without
being told the grammar.

The results at scale are large. Google's OSS-Fuzz, which continuously fuzzes open source
projects, states that as of May 2025 it "has helped identify and fix over 13,000
vulnerabilities and 50,000 bugs across 1,000 projects".

An empirical study of over 23,000 OSS-Fuzz bugs found six fault types account for more
than half of everything found: timeouts, out-of-memory errors, null dereferences, stack
overflows, memory leaks, and signal aborts. That list is the honest description of what
fuzzing is for. It finds robustness failures, not wrong answers.

## Mutation testing

Mutation testing tests the tests. The tool makes a small change to your source code, for
example turning `<` into `<=`, or deleting a line, then runs your suite. If no test fails,
that change is a **surviving mutant**: a real behavioural change your suite does not
notice.

The **mutation score** is the share of introduced mutants that at least one test kills.

This is the direct answer to the coverage trap in 03.
Line coverage asks whether a line ran. Mutation testing asks whether anything would have
noticed if the line were wrong. A suite with 95% line coverage and a 40% mutation score is
a suite that executes the code and checks almost nothing about it.

The technique dates to a 1978 paper by DeMillo, Lipton and Sayward, "Hints on Test Data
Selection". Its cost is the reason it took forty years to reach the mainstream: running
the whole suite once per mutant is expensive. Modern tools cut this by running only the
tests that cover the mutated line, and by testing a sample of mutants rather than all.

## Metamorphic testing

For programs where nobody knows the right answer, test the relationship between answers
instead of the answers themselves.

The classic case is a search engine. Nobody can say what the correct result set for a
query is. But you can say this: if you narrow a query by adding a term, the result set
must not grow. That is a **metamorphic relation**, and violating it is a definite bug even
though no individual result was ever labelled correct.

More examples:

| System | Metamorphic relation |
|---|---|
| Route planner | adding a waypoint must not shorten the route |
| Image classifier | rotating an image by 2 degrees must not change the predicted class |
| Tax calculator | increasing gross income must not decrease tax owed |
| Compiler | compiling at `-O0` and `-O2` must produce programs with the same output |
| Sorting service | sorting a shuffled copy must give the same result |

Metamorphic testing was introduced by Chen, Cheung and Yiu in a 1998 Hong Kong University
of Science and Technology technical report. It is the most useful technique available for
machine learning systems, where the oracle problem is at its worst, and it is badly
underused in ordinary business software, where "adding a discount must not increase the
total" is exactly the same kind of rule.

## Differential testing

Run two independent implementations on the same input and compare. Any disagreement is a
bug in at least one of them.

Real uses:

- Compilers: run the same program through GCC and Clang, compare output.
- Browsers and parsers: feed identical HTML or JSON to several implementations.
- Migrations: run the old system and the new system side by side on real traffic, compare
  results, and ship only when they agree. This pattern, sometimes called shadowing or
  dark launching, is the safest way to replace a system nobody fully understands.

The requirement is genuine independence. Two implementations sharing a library share its
bugs, and will agree while both being wrong.

## Snapshot, golden, and approval testing

Run the code, record the output, commit the recording. On later runs, compare against the
recording and fail on any difference.

```
Rendered output differs from snapshot:
- <button class="btn primary">Save</button>
+ <button class="btn primary" disabled>Save</button>
```

The oracle here is the previous version of the software, which has an important
consequence: a snapshot test cannot tell you the output is *correct*, only that it
*changed*. If the first recording was wrong, the test locks the bug in.

Where this earns its place:

- **Characterization testing** on legacy code. You need to change a 4,000-line function
  nobody understands. Record what it currently does across many inputs, then refactor
  until the recordings still match. The recordings are not a specification of what it
  should do; they are a fence around what it does do.
- Compiler and formatter output, rendered documents, API response shapes.

Its failure mode is well known: when a snapshot fails, the fastest fix is to re-record it.
Teams that press the update button reflexively have a suite that asserts nothing.

## Model-based testing

Write a model of what the system should do, usually a state machine, and let a tool
generate test sequences from the model, run them against the real system, and compare.

The generated sequences find the interleavings a human would not write, for example
"create, cancel, pay, cancel, refund" applied to an order. The cost is that you now
maintain a model as well as a system, and the model can drift.

This is the same idea as **stateful property testing**, where the tool generates random
sequences of operations against a system and a simple in-memory reference model, then
checks the two agree after every step.

## Symbolic execution and formal verification

These are not testing in the strict sense, because they do not run the program on specific
inputs. They belong here because they answer the question testing cannot.

- **Symbolic execution** runs the program with variables instead of values, building up
  the constraints along each path, then asks a solver for concrete inputs that reach each
  path. Concolic testing mixes this with real execution to stay tractable. Used to
  generate test inputs that reach hard-to-hit branches.
- **Formal verification** proves a property holds for all inputs, using a proof assistant
  or a model checker. Expensive, and applied where the cost of being wrong is extreme:
  processor designs, cryptographic protocols, aircraft control laws, the seL4 microkernel.

The relationship to testing is the one Dijkstra stated at the 1969 NATO conference:
"Program testing can be used to show the presence of bugs, but never to show their
absence." Proof is how you show absence. It is available for small, well-specified,
high-stakes components, and not for a web application.

## What to reach for

| Situation | Technique |
|---|---|
| A function with an algebraic rule (parse/serialise, sort, encode) | property-based |
| Code that handles untrusted input, parsers, decoders, anything in C or C++ | fuzzing |
| A suite you do not trust, or a coverage number you suspect | mutation testing |
| Machine learning output, search ranking, simulation, anything without a known answer | metamorphic |
| Replacing an existing system | differential, run in shadow |
| Legacy code you must change and do not understand | characterization via recorded output |
| Complex stateful protocol | model-based or stateful property testing |
| A component where failure is catastrophic | formal verification, on the core only |

## Sources

- Claessen, K. and Hughes, J. "QuickCheck: A Lightweight Tool for Random Testing of
  Haskell Programs", ICFP 2000.
  [paper](https://alastairreid.github.io/RelatedWork/papers/claessen:icfp:2000/)
- DeMillo, R., Lipton, R. and Sayward, F. "Hints on Test Data Selection: Help for the
  Practicing Programmer", *Computer* 11(4), April 1978, pp. 34-41.
- Chen, T.Y., Cheung, S.C. and Yiu, S.M. "Metamorphic testing: a new approach for
  generating next test cases", Technical Report HKUST-CS98-01, 1998.
- Segura et al. "A Survey on Metamorphic Testing", *IEEE TSE*, 2016.
- [OSS-Fuzz](https://github.com/google/oss-fuzz), figures as stated in the project README,
  May 2025.
- Ding, Z.Y. and Le Goues, C. ["An Empirical Study of OSS-Fuzz Bugs"](https://squareslab.github.io/materials/DingOSSFuzz21.pdf), MSR 2021.
- Dijkstra, E.W. Remarks at the NATO Software Engineering Techniques conference, Rome,
  October 1969, published April 1970; and "Notes on Structured Programming" (EWD249), 1970.

---

<!-- 11archive-source: 05-software-non-functional.md -->

# Testing what the software is like, not what it does

Functional testing asks whether the software produces the right answer. Non-functional
testing asks about everything else: how fast, how safe, how usable, how well it survives
being pushed. These are the qualities that get a product cancelled after it works.

The reference vocabulary is ISO/IEC 25010:2023, the product quality model. The 2023
revision is a real change from the well-known 2011 version and is worth knowing about:

- **Safety** was added as a ninth top-level characteristic, with subcharacteristics
  including fail safe and hazard warning.
- **Usability** was renamed **interaction capability**, and gained **inclusivity** and
  **self-descriptiveness** as subcharacteristics.
- **Portability** was renamed **flexibility**, and gained **scalability**.
- **Security** gained **resistance**.

The nine characteristics are: functional suitability, performance efficiency,
compatibility, interaction capability, reliability, security, maintainability,
flexibility, and safety.

Used as a checklist rather than a taxonomy, this list is the fastest way to find the
quality nobody on the team owns.

## Performance testing

All of these run load against a system. They differ in the shape of the load and the
question being asked.

| Name | Load shape | Question |
|---|---|---|
| Load test | expected peak traffic | does it meet its targets under normal worst-case use |
| Stress test | increase until it breaks | where is the limit, and how does it fail |
| Spike test | sudden jump, then back down | does it survive a traffic surge, and does it recover |
| Soak test, endurance test | normal load, for many hours | does anything leak, drift, or fill up |
| Volume test | normal traffic, very large data | does it survive a 500GB table rather than a 500MB one |
| Scalability test | load rises while capacity rises | does adding machines actually add throughput |
| Capacity test | rising load, measured against a target | how many users can we serve at our latency target |

Three points decide whether a performance test is worth anything:

**Measure percentiles, not averages.** An average response time of 200ms is consistent
with 95% of users seeing 50ms and 5% seeing 3 seconds. Report p50, p95, p99. The tail is
where users are, because a page that makes 20 requests hits its p99 often.

**A soak test is the only way to find a slow leak.** A memory leak of 4MB per hour is
invisible in a 10-minute load test and takes the service down on day nine. This is the
same idea as the accelerated life testing in 10: run
long enough, or run harder, to bring a slow failure into view.

**Test data volume, not just request rate.** Query plans change when a table crosses a
size threshold. A system that is fast in a test environment with 10,000 rows and slow in
production with 40 million rows has not been performance tested; it has been benchmarked
on a different system.

## Security testing

Security testing splits by what the tool can see, which is exactly the black-box and
white-box split from 03.

| Method | What it is | What it sees | What it misses |
|---|---|---|---|
| SAST, static application security testing | reads source code for unsafe patterns | all code paths, including unreached ones | anything that depends on runtime configuration |
| DAST, dynamic application security testing | attacks the running application from outside | real, exploitable behaviour | code it never reaches |
| IAST, interactive | instruments the running app while it is exercised | runtime behaviour with code-level detail | needs the app to be driven well |
| SCA, software composition analysis | checks third-party dependencies against known vulnerability lists | published vulnerabilities in libraries | vulnerabilities nobody has published |
| Secret scanning | looks for keys and passwords in code and history | committed credentials | credentials elsewhere |
| Penetration testing | a person tries to break in, with permission | logic flaws, chained weaknesses | anything outside the agreed scope and time |
| Red teaming | a person simulates a real adversary against the whole organisation, usually without warning defenders | whether you would detect and respond | narrow technical coverage |

The distinction that gets missed is the last one. A penetration test asks "can this be
broken into". A red team exercise asks "would we notice". NIST's definition of a red team
is a group authorised to emulate an adversary's attack capabilities against an
enterprise's security posture, and its purpose includes demonstrating what works for the
defenders. A **purple team** exercise runs both sides together, deliberately closing the
loop between what the attackers found and what the defensive tooling saw.

The coverage claim matters more here than anywhere else in software. A penetration test
report covers the systems in scope, during the test window, against the techniques that
tester tried. "We passed the pentest" is not a statement about the security of the system.
It is a statement about one sample.

Organisational security exercises, including tabletop drills and phishing simulations,
are covered in 11, because they test people rather than
code.

## Accessibility testing

Accessibility testing checks that people using assistive technology, or with limited
vision, hearing, motor control, or attention, can use the product. In many jurisdictions
it is a legal requirement, not a preference.

The important, repeatedly measured fact is how much of it a machine can do.

- A Deque study across more than 2,000 audits, 13,000 pages, and nearly 300,000 issues
  found that automated testing caught **57% of total issues**. That number is inflated by
  colour contrast, which tools detect almost perfectly and which appears in enormous
  volume.
- Measured by distinct success criteria rather than issue count, the ceiling for any
  automated tool sits at roughly **20% to 40%** of WCAG criteria.
- A UK Government test found axe caught **29% of documented barriers**; a January 2026
  study found axe-core alone surfaced **22.6%** of the issues a manual audit found.

The spread between 57% and 22.6% is not a contradiction. It is the difference between
counting issues and counting kinds of issue, and it is a clean example of a metric whose
denominator decides the answer.

The practical reading: automation is a cheap first pass that removes a large volume of
real defects, and it cannot tell you whether the page makes sense when read aloud in
order, whether a custom widget is operable by keyboard, or whether an error message
explains what to do. Those need a person, ideally a person who uses a screen reader daily.

## The rest, briefly

| Type | What it checks | Concrete example |
|---|---|---|
| Usability testing | can a real person complete a task | watch five people try to cancel a subscription, count how many find it |
| Compatibility testing | does it work across browsers, devices, OS versions | the same checkout on Safari 16, Chrome on Android 12, and a 320px screen |
| Reliability and resilience | does it keep working when parts fail | kill the cache and confirm the site degrades instead of dying |
| Recoverability and disaster recovery | can you get back after losing something | restore last night's backup into a clean environment and check the data |
| Internationalisation (i18n) | does it work in other languages and locales | a German string 40% longer than English, right-to-left Arabic, a Japanese name with no surname field |
| Localisation (l10n) | is the translation right in context | "Save" translated as the verb for rescuing someone |
| Installability and upgrade | can it be installed, upgraded, and rolled back | run the migration, then run the rollback, on a copy of production data |
| Observability | can you tell what happened after the fact | trigger a failure and check whether the logs and traces let you diagnose it |
| Compliance and conformance | does it meet a stated external rule | WCAG 2.2 AA, PCI DSS, GDPR data deletion within the stated window |
| Migration and data testing | did the data survive the move | row counts, checksums, and spot-checked records before and after |

Two of these deserve a note.

**Recoverability is the most commonly skipped test in the industry.** Backups are taken;
restores are rarely rehearsed. A backup that has never been restored is a hypothesis. The
equivalent practice in other fields is mandatory: fire drills, disaster recovery
exercises, and site acceptance tests all exist because nobody trusts an untested
capability.

**Observability testing is testing the tests.** If a failure in production produces no
usable signal, the production monitoring described in
06 is decoration.

## Sources

- [ISO/IEC 25010:2023, product quality model](https://www.iso.org/standard/78176.html);
  summary of the 2023 changes at
  [Sonar](https://www.sonarsource.com/resources/library/iso-iec-25010-explained/)
- [NIST glossary definition of red team](https://www.compassitc.com/blog/penetration-testing-understanding-red-blue-purple-teams);
  [NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](https://www.softwaresecured.com/post/nist-sp-800-115-and-penetration-testing),
  September 2008
- Deque audit study and criteria-based ceiling figures, as reported by
  [TestParty](https://testparty.ai/blog/automated-accessibility-testing-guide) and
  [QA Wolf](https://www.qawolf.com/blog/automated-accessibility-testing-explained)

---

<!-- 11archive-source: 06-software-practice-and-workflow.md -->

# Practices, workflows, and where tests live

Techniques are what a test does. Practices are how testing fits into how a team works.
This is where most of the argument in the industry actually happens.

## Writing tests before the code

Three related practices, often confused, differing in who writes the test and what
language it is in.

**Test-driven development (TDD).** Write a failing test, write the smallest code that
passes it, then clean up the code without changing behaviour. Red, green, refactor. The
loop is measured in seconds to minutes.

The claimed benefit that holds up best in practice is not defect count. It is design
pressure. Code that is hard to test is usually code with too many dependencies, and TDD
makes that pain immediate rather than deferred. The claimed benefit that holds up least
well is that it replaces design thinking; it does not.

**Behaviour-driven development (BDD).** Write the expected behaviour in structured plain
language, then bind it to code.

```gherkin
Given a customer with an expired card
When they check out
Then they are asked for a new payment method
And the order is not charged
```

The point is not the syntax. It is that a non-engineer can read, correct, and disagree
with the specification before anyone builds it. BDD fails when nobody outside engineering
ever reads the files, at which point it is a slower way of writing tests.

**Acceptance-test-driven development (ATDD), or specification by example.** Before work
starts, the people who want the feature, the people who will build it, and the people who
will test it agree on concrete examples of what "done" looks like. Those examples become
the acceptance tests.

The strongest argument for all three is unglamorous: a test written before the code tests
the requirement, and a test written after the code tests the implementation. Tests written
afterwards tend to encode whatever the code happens to do, including its bugs.

## Test doubles

A **test double** is any stand-in used in place of a real dependency. Gerard Meszaros
named the family in *xUnit Test Patterns*; Martin Fowler's "Mocks Aren't Stubs" fixed the
vocabulary.

| Double | What it does | Use when |
|---|---|---|
| Dummy | passed in, never used | a parameter must be supplied and does not matter |
| Stub | returns canned answers | you need the code under test to receive a particular value |
| Spy | a stub that also records how it was called | you want to check a call happened, after the fact |
| Mock | pre-programmed with expectations, fails the test if they are not met | the call itself is the behaviour you are testing |
| Fake | a real, working, simplified implementation | you need realistic behaviour cheaply, for example an in-memory database |

The distinction that matters: **a stub answers a question, a mock verifies an action.**
Fowler frames this as state verification against behaviour verification. Checking that
`saveOrder` returned the right object is state verification. Checking that `sendEmail` was
called exactly once is behaviour verification.

The failure mode is over-mocking. A test where every dependency is a mock verifies that
the code calls the functions the test author expected, in the order the test author
expected. Refactor the internals without changing behaviour and it breaks. That is the
opposite of what a test is for. Prefer fakes over mocks where a fake is available.

## The shapes argument

Several competing pictures describe how many tests of each kind to write.

| Shape | Proposed by | Distribution | Best fit |
|---|---|---|---|
| Test pyramid | Mike Cohn, *Succeeding with Agile*, 2009 | many unit, fewer integration, very few end-to-end | monoliths with rich domain logic |
| Testing trophy | Kent C. Dodds | static analysis at the base, weight on integration | front-end and application code with thin logic and many integrations |
| Testing honeycomb | Spotify, Schaffer and Dybeck, January 2018 | small ends, fat middle of integration tests | microservices, where the risk is between services |
| Ice cream cone | nobody, on purpose | mostly manual and end-to-end, few unit | the shape teams end up with by accident |

The pyramid is the oldest and still the right default for code with real logic in it. The
argument for the trophy and the honeycomb is not fashion; it is that in a service whose
functions mostly call other services, a unit test with everything mocked verifies almost
nothing, and the risk has moved to the seams.

The empirical constraint on all of this is the flakiness data in
02: Google measured 0.5% flakiness in small tests and 14%
in large ones. Any shape that puts a lot of weight at the top is buying coverage with
signal, and past a certain point a suite that cries wolf 14% of the time is a suite people
stop reading.

A practical rule that survives all four shapes: **push each test to the lowest level that
can still catch the bug.** If a unit test can catch it, do not write an end-to-end test
for it.

## Continuous integration and quality gates

A typical pipeline, ordered by cost:

1. Formatting and linting, seconds.
2. Type checking, seconds.
3. Unit tests, under two minutes.
4. Build.
5. Integration tests, minutes.
6. Contract verification.
7. Security scanning: dependencies, secrets, static analysis.
8. Deploy to a staging environment.
9. End-to-end smoke tests.
10. Deploy to production behind a flag or as a canary.

The ordering principle is to fail fast and fail cheap. There is no reason to spend eight
minutes on integration tests for a branch that does not compile.

**Gates worth setting**, with the caveats that make them useful rather than performative:

- Coverage must not *decrease*. Better than an absolute target, because it does not punish
  a legacy codebase and does not reward writing assertion-free tests to hit a number.
- No new high-severity findings from security scanning. Existing ones need a stated owner
  and date, not a permanent exception.
- Build time budget. A suite that takes 40 minutes is a suite people work around.
- Flake budget. Track the rate. Quarantine tests that exceed it rather than retrying them
  silently, because an auto-retry converts a real intermittent bug into a green build.

## Shift left and shift right

**Shift left** means moving testing earlier: static analysis in the editor, tests before
code, requirements reviewed with examples. The usual justification is the "cost of a
defect rises 100x by production" curve.

That curve is worth being careful about. Laurent Bossavit traced the widely cited version
of it in *The Leprechauns of Software Engineering* and found the attribution runs back to
a textbook citing internal IBM course notes, with no dataset that anyone has produced.
The direction is well supported: late fixes usually cost more. The specific multipliers
are folklore presented as data. Cite the direction, not the numbers.

**Shift right** means testing in production, where the real data, real traffic, and real
scale are. The techniques:

| Practice | What it does | Concrete example |
|---|---|---|
| Canary release | send a small share of traffic to the new version, compare error rates | 1% of users for 20 minutes, roll back automatically on a rise in 5xx responses |
| Blue-green deployment | run two full environments, switch traffic between them | instant rollback by switching back |
| Feature flags | ship the code off, turn it on for a chosen group | enable for internal staff, then 5% of users, then everyone |
| Dark launching | run the new code on real traffic without using its results | route real queries to a new search backend, log the differences, serve the old results |
| A/B testing | show two versions, compare outcomes on a metric | see 12 |
| Synthetic monitoring | run scripted user journeys against production continuously | log in and check out every five minutes from three regions |
| Chaos engineering | inject failure deliberately, verify the system holds | below |

Dark launching deserves emphasis. It is differential testing
run against production traffic, and it is the only technique that tests a replacement
system against the full weirdness of real inputs before anyone depends on it.

## Chaos engineering

Chaos engineering is "the discipline of experimenting on a system in order to build
confidence in the system's capability to withstand turbulent conditions in production".

It is a real experiment, in the scientific sense, and its published method maps exactly
onto the six parts in 01:

1. Define **steady state** as a measurable output of normal behaviour, for example
   throughput, error rate, latency. That is the oracle.
2. Hypothesise that steady state continues in both the control group and the experimental
   group.
3. Introduce variables that reflect real events: servers crashing, disks failing, network
   latency rising.
4. Try to disprove the hypothesis by comparing steady state between the groups.

The published advanced principles add: vary real-world events, run experiments in
production, automate them to run continuously, and **minimise the blast radius** so the
fallout stays contained.

That last principle is the ethical core, and it is the same idea as the dose escalation
rule in a Phase 1 clinical trial (09). You are
experimenting on a live system with real users in it, so you bound the harm in advance.

## Managing the test suite itself

A test suite is code, and it decays.

- **Flaky tests.** Track flake rate per test as a first-class metric. Quarantine, then fix
  or delete. The common causes are time, ordering, shared state, real network calls, and
  concurrency. Silent auto-retry is not a fix; it hides real intermittent bugs.
- **Test data.** Prefer building the data each test needs inside the test over a shared
  fixture database. Shared fixtures produce tests that pass only in a particular order.
- **Slow tests.** Measure and publish the slowest 20. They are usually a handful of tests
  doing something they do not need to do, such as sleeping.
- **Dead tests.** A test that has never failed in three years and covers code that is
  covered elsewhere costs time and confidence and buys nothing.

## Metrics worth tracking

| Metric | What it tells you | How it gets gamed |
|---|---|---|
| Line or branch coverage | which code no test reaches | write tests with no assertions |
| Mutation score | whether tests would notice a behaviour change | ignore mutants as "equivalent" |
| Escaped defect rate | how many bugs reach users | classify bugs as features |
| Change failure rate | share of deployments causing a failure | deploy less often |
| Mean time to restore | how fast you recover | reclassify incidents |
| Flake rate | how much your suite lies | auto-retry until green |
| Suite runtime | whether people will keep running it | split the suite and only run part |

DORA's 2025 report puts a strong change failure rate at 0% to 2%, with only 16.7% of
respondents reporting one that low, and replaced the older elite-to-low tiers with seven
team profiles. It also reports that rising AI adoption correlates with increased delivery
instability even while individual effectiveness improves, which is the sort of finding
that argues for keeping the safety net rather than trusting the generator.

Every row in that table has a gaming column for a reason. Goodhart's law applies to
testing metrics exactly as it applies to school test scores; see
14.

## Sources

- Meszaros, G. *xUnit Test Patterns*, 2007; Fowler, M.
  ["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html)
- Cohn, M. *Succeeding with Agile*, 2009, for the test pyramid; Kent C. Dodds for the
  testing trophy; Schaffer, A. and Dybeck, R., Spotify Engineering, January 2018, for the
  honeycomb. Summarised at
  [web.dev](https://web.dev/articles/ta-strategies)
- Bossavit, L. *The Leprechauns of Software Engineering*, chapter on the cost-of-defects
  curve.
  [Google Books](https://books.google.com/books/about/The_Leprechauns_of_Software_Engineering.html?id=6LcpBgAAQBAJ)
- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [DORA 2025 State of DevOps, change failure rate benchmarks](https://www.opstrails.dev/insights/change-failure-rate-dora-metric)

---

<!-- 11archive-source: 07-safety-critical-and-standards.md -->

# When testing is regulated

Most software teams choose their own testing standard. In aircraft, cars, medical devices,
railways, and nuclear plants, someone else chooses it, and an auditor checks.

This section matters even to people who will never build a pacemaker, because regulated
testing is where the six parts from 01 are all written down.
It is the closest software gets to the discipline of a calibration lab.

## The organising idea: rigour scales with harm

Every safety standard works the same way. Classify how bad it would be if this component
failed, then let that class dictate how much evidence you must produce.

| Standard | Domain | Levels, least to most severe |
|---|---|---|
| DO-178C / ED-12C | Airborne software | Level E, D, C, B, A |
| ISO 26262 | Road vehicles | ASIL A, B, C, D (plus QM, meaning no safety requirement) |
| IEC 62304 | Medical device software | Class A, B, C |
| IEC 61508 | Industrial functional safety, the parent standard | SIL 1 to SIL 4 |
| EN 50128 | Railway control software | SIL 0 to SIL 4 |

Concretely, in a car under ISO 26262: rear lights are ASIL A, headlights and brake lights
ASIL B, cruise control ASIL C, and airbags, anti-lock braking and power steering are
ASIL D, the highest.

In a medical device under IEC 62304: Class A means no injury is possible, Class B means
injury is possible but not serious, Class C means death or serious injury is possible.
Class C software carries the heaviest testing and documentation burden.

The mechanism is worth stealing even without a regulator. Most teams test every part of
the system with roughly the same effort. Almost no system deserves that. Ask what the
worst realistic outcome of each component failing is, and spend accordingly.

## What the highest level actually demands

DO-178C Level A, where failure is catastrophic, is the most demanding widely used
software testing regime. It requires, among much else:

- Every requirement traced to the code that implements it and the test that verifies it,
  in both directions.
- Test cases derived from requirements, not from the code.
- **Modified condition/decision coverage** of the code structure, described in
  03. Table A-7 of the standard sets this out.
- Evidence that any code not covered by requirements-based testing is either dead code,
  which must be removed, or deactivated code, which must be justified.
- Independence between the person who wrote the code and the person who verifies it, for
  the highest levels.

That last point has a name outside aviation: **independent verification and validation**,
often shortened to IV&V. The principle is that the author is the worst possible reviewer
of their own work, and it recurs everywhere testing is serious. Peer review in science,
external audit in finance, and a reviewer who is not the owner in an engineering issue
tracker are the same control.

## Verification and validation are not the same thing

This distinction is formal in every regulated field and casually blurred everywhere else.
It is worth getting right, because the two failures are different.

- **Verification**: did we build the thing right? Does it meet its specification?
- **Validation**: did we build the right thing? Does it meet the actual need?

A payment form that correctly rejects the card format it was specified to reject is
verified. If the specification named the wrong format, it is not validated. Verification
is answered by tests; validation is answered by users, and by the acceptance testing in
02.

Food safety uses the identical pair, and states it more sharply than software does. Under
HACCP, **validation** is obtaining evidence that the control measures are scientifically
capable of controlling the hazard, done once, before implementation and after any major
change. **Verification** is the ongoing checking that the plan is being followed. See
10.

## The V-model

The V-model is the picture that regulated development is organised around. The left arm
descends through levels of specification; the right arm ascends through matching levels of
testing; each test level verifies the specification level opposite it.

```
User requirements ─────────────────────► Acceptance testing
  System requirements ─────────────────► System testing
    Architecture ──────────────────────► Integration testing
      Detailed design ─────────────────► Unit testing
                    Code
```

Its reputation among agile teams is poor, and the criticism of it as a delivery process is
fair: it front-loads a full specification. But as a picture of *what verifies what* it is
correct, and it survives inside iterative processes. Every level of decomposition needs a
matching level of check, whether you write them a year apart or an hour apart.

## The general software testing standards

Outside safety-critical work, two bodies define the shared vocabulary.

**ISO/IEC/IEEE 29119** is the international software testing standard series. Eight parts
are published:

| Part | Subject |
|---|---|
| 1 | Concepts and definitions |
| 2 | Test processes |
| 3 | Test documentation |
| 4 | Test techniques |
| 5 | Keyword-driven testing |
| 6 | Guidelines for use in agile projects |
| 11 | Testing of AI-based systems |
| 13 | Testing of biometric systems |

Part 11 is the notable recent addition, and reflects that testing systems whose behaviour
is learned rather than written needs its own treatment. Parts 1 and 11 are freely
available from ISO.

29119 has real critics. A campaign in the context-driven testing community argued that a
standardised, document-heavy process misrepresents testing as a mechanical activity and
would be used by procurement and courts as a definition of due care. That criticism is
worth knowing when someone cites the standard as settled.

**ISTQB** provides the certification syllabi that supply most of the shared vocabulary in
commercial testing, including the black-box, white-box, and experience-based split used in
03.

There are also coding standards whose purpose is to make testing possible at all. **MISRA
C** restricts the C language to a subset with defined behaviour, on the reasoning that you
cannot meaningfully verify code that relies on constructs the compiler is free to
interpret differently.

## Testing machine-learning systems

This is where the regulated world and the ordinary world are converging fastest, and it is
the clearest current example of the oracle problem from 01.

The difficulty is structural. A traditional program's behaviour is written down, so a test
can compare against it. A learned model's behaviour is a consequence of data, so there is
often no independent statement of what the right output is.

What the practice looks like now:

| Method | What it does | Limit |
|---|---|---|
| Held-out benchmark evaluation | score the model on data it did not train on | benchmark contamination, where the test data leaked into training; scores that do not transfer to real use |
| Metamorphic testing | check relations rather than values, as in 04 | you must invent the relations |
| Data validation | test the inputs: schema, ranges, distribution drift | catches data problems, not model problems |
| Behavioural testing | curated cases for known failure classes, for example negation, names, dialects | only covers what you thought of |
| Red teaming | people deliberately probe for harmful or disallowed outputs | coverage is unmeasured |
| Slice-based evaluation | report accuracy per subgroup, not just overall | requires you to know which slices matter |
| Shadow deployment | run the model on real traffic without acting on it | needs an outcome to compare against |

The US framework language for this is **TEVV**, testing, evaluation, verification and
validation. The NIST AI Risk Management Framework's Measure function calls for a mix of
these, explicitly including red teaming alongside benchmarks, and NIST's own finding is
that relying entirely on existing tooling gives a false sense of assurance.

That conclusion is the base rate problem in another costume. A benchmark score is a
coverage claim. Without knowing what the benchmark covers, and what share of real inputs
resemble it, the number does not support the conclusion people draw from it.

## Sources

- [ISO 26262 and ASILs](https://ldra.com/iso-26262/);
  [Automotive Safety Integrity Level](https://en.wikipedia.org/wiki/Automotive_Safety_Integrity_Level)
- [IEC 62304 safety classifications](https://www.greenlight.guru/glossary/iec-62304)
- [DO-178C structural coverage and MC/DC](https://ldra.com/capabilities/mc-dc/)
- [ISO/IEC/IEEE 29119 series](https://softwaretestingstandard.org/)
- [FDA HACCP principles and application guidelines](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)
- [CISA: AI red teaming, applying software TEVV for AI evaluations](https://www.cisa.gov/news-events/news/ai-red-teaming-applying-software-tevv-ai-evaluations)

---

<!-- 11archive-source: 08-science-and-statistics.md -->

# Testing an idea: science and statistics

This is the oldest formal testing tradition, and it is the one every other kind borrows
from. A clinical trial, an A/B test, a crop trial, and a policy pilot are all the same
procedure with different subjects.

The defining feature: the subject is a **claim**, not an object. You are not asking
whether this bridge holds. You are asking whether bridges of this design hold, using a
sample.

## The basic move

A statistical hypothesis test works by trying to rule out boredom.

1. State the boring explanation, the **null hypothesis**: the new drug does nothing, the
   new button changes nothing, the difference is chance.
2. Collect data.
3. Compute how surprising the data would be if the boring explanation were true. That
   number is the **p-value**.
4. If it is surprising enough, below a threshold you chose in advance, reject the boring
   explanation.

Mapped onto the six parts from 01:

| Part | In a hypothesis test |
|---|---|
| Subject | the claim, and the population it is about |
| Stimulus | the treatment or intervention |
| Oracle | the control group |
| Threshold | the significance level, usually 0.05 |
| Coverage claim | the sample, its size, and who it represents |
| Decision | reject the null, or fail to reject it |

The control group is the interesting part. This is the cleanest solution to the oracle
problem in existence: when you cannot say what should have happened, run a second group
that got nothing and see what did happen to them.

## Two errors, and the words for them

| | The claim is actually false | The claim is actually true |
|---|---|---|
| **Test says true** | Type I error, false positive | correct |
| **Test says false** | correct | Type II error, false negative |

- The **significance level**, usually written α, is the false positive rate you accept.
  At 0.05, one in twenty tests of a true null hypothesis will produce a "discovery".
- **Power** is one minus the false negative rate: the chance of detecting a real effect
  of a given size. A study aiming for 80% power has a one in five chance of missing a
  real effect it was designed to find.
- **Effect size** is how big the difference is. Statistical significance says a difference
  probably exists. Effect size says whether anyone should care.

An underpowered study is the most common quiet failure in research. If you run 60 people
through a test designed to detect a large effect and the real effect is small, the null
result tells you nothing at all, and it will be reported as though it did.

## What a p-value does not mean

The American Statistical Association published a formal statement in 2016 because
misinterpretation had become a professional problem. Its six principles:

1. "P-values can indicate how incompatible the data are with a specified statistical
   model."
2. "P-values do not measure the probability that the studied hypothesis is true, or the
   probability that the data were produced by random chance alone."
3. "Scientific conclusions and business or policy decisions should not be based only on
   whether a p-value passes a specific threshold."
4. "Proper inference requires full reporting and transparency."
5. "A p-value, or statistical significance, does not measure the size of an effect or the
   importance of a result."
6. "By itself, a p-value does not provide a good measure of evidence regarding a model or
   hypothesis."

Principle 3 is the one with the widest reach outside statistics. p = 0.05 is a threshold
someone chose. It is not a fact about nature, and it carries exactly the same status as a
coverage target of 80% or a latency budget of 200ms: a line drawn to make a decision
possible, whose only justification is the cost of being wrong in each direction.

## Randomised controlled trials

The RCT is the strongest general design for establishing that a treatment *caused* an
outcome. Four elements do the work:

| Element | What it removes |
|---|---|
| A control group | the possibility that the outcome would have happened anyway |
| Random assignment | selection effects, including ones nobody thought of |
| Blinding | the subject's expectations changing the outcome |
| Double blinding | the researcher's expectations changing the measurement |

Random assignment is the part that makes the design powerful, and it is subtle. It does
not balance the groups on the variables you thought of; matching does that. It balances
them, in expectation, on *every* variable, including the ones nobody has named. That is
why it beats a carefully matched comparison.

The design has spread far beyond medicine. The 2019 Nobel Prize in Economic Sciences went
to Abhijit Banerjee, Esther Duflo and Michael Kremer for adapting RCTs to development
economics. Their Kenyan schooling experiments found that neither extra textbooks nor free
school meals moved learning outcomes much, while changes to how teaching was targeted did,
a result nobody would have accepted from observation alone.

Online A/B testing is the same design, at a scale medicine cannot reach. See
12.

## When you cannot randomise

You cannot randomly assign countries to have a financial crisis. Quasi-experimental
designs recover some causal claim from data that arrived without an experiment.

| Design | The idea | Example |
|---|---|---|
| Natural experiment | something outside the researcher's control assigned people as-if randomly | a lottery for school places |
| Difference-in-differences | compare the change over time in a treated group against the change in an untreated group | one state raises its minimum wage, the neighbouring state does not |
| Regression discontinuity | compare people just above and just below an arbitrary cutoff | students who scored 59 and 61 on a scholarship threshold |
| Instrumental variables | use something that affects the treatment but not the outcome directly | distance to a college as a lever on years of education |
| Matching | compare treated units to untreated ones with similar known characteristics | weaker, because it can only match on what you measured |

Each of these buys a causal claim by making an assumption. The assumption is the coverage
claim, and it is where the argument always is.

## The replication crisis, and what it taught

In 2015, the Open Science Collaboration published an attempt to replicate 100 studies from
three leading psychology journals. Depending on how you measure success, the results were:

| Measure of replication | Result |
|---|---|
| Replications with a statistically significant result in the same direction | 36% |
| Original effect size inside the replication's 95% confidence interval | 47% |
| Subjectively judged by the replication team to have replicated | 39% |
| Combining original and replication data, still statistically significant | 68% |

Four numbers for one question. This is the same phenomenon as the accessibility automation
figures in 05, where 57% and 22.6% both described the
same tools: **the denominator decides the answer, so the metric must be stated with it.**

The causes identified were structural, not fraudulent:

- **Publication bias**: journals published positive results, so negative results vanished
  and the literature over-represented flukes.
- **P-hacking**: analysing many ways and reporting the one that crossed 0.05. Not
  necessarily dishonest, since every choice can be defended individually.
- **HARKing**: hypothesising after the results are known, then presenting the hypothesis
  as though it came first.
- **Multiple comparisons**: test twenty things at α = 0.05 and one will look significant by
  chance. Corrections exist, and are frequently skipped.
- Weak incentives to replicate anything.

The fixes are all forms of committing in advance:

- **Preregistration**: publish the hypothesis, the sample size, and the analysis plan
  before collecting data. This is the same control as writing the test before the code in
  06, and for the same reason: a prediction made
  after seeing the result is not a prediction.
- **Registered reports**: journals accept the study based on the design, before results
  exist, which removes the incentive to produce a positive finding.
- Open data and open analysis code.
- Larger samples and reported power.
- Reporting effect sizes and confidence intervals, not just p-values.

## What software should take from this

Software A/B testing has a p-hacking problem that is worse than psychology's, because the
data arrives continuously and the dashboard updates in real time.

- **Peeking.** Checking an experiment repeatedly and stopping when it crosses significance
  inflates the false positive rate badly. Fixes: fix the sample size in advance, or use a
  sequential test designed for continuous monitoring.
- **Multiple metrics.** Twenty metrics on a dashboard is twenty chances for one to look
  significant. State the primary metric in advance; treat the rest as exploration.
- **Underpowered experiments.** Running a test on 800 users to detect a 1% conversion
  change is running it for the appearance of rigour.
- **No preregistration.** Writing down the expected direction and size before launch turns
  a post-hoc story into a real test, and costs one paragraph.

## Sources

- [American Statistical Association Statement on Statistical Significance and P-Values, 2016](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf);
  principles as quoted
  [here](https://mostlyeconomics.wordpress.com/2016/03/17/six-principles-for-the-use-and-interpretation-of-p-values/)
- Open Science Collaboration. "Estimating the reproducibility of psychological science",
  *Science*, 2015.
  [Science](https://www.science.org/doi/10.1126/science.aac4716) |
  [PDF](https://discovery.dundee.ac.uk/ws/files/7385883/RPP_SCIENCE_2015.pdf)
- [Sveriges Riksbank Prize in Economic Sciences 2019, press release](https://www.nobelprize.org/prizes/economic-sciences/2019/press-release/)
- [CEPR: What randomisation can and cannot do](https://cepr.org/voxeu/columns/what-randomisation-can-and-cannot-do-2019-nobel-prize)

---

<!-- 11archive-source: 09-health-and-diagnostics.md -->

# Testing bodies: medicine and diagnostics

Medicine runs two very different kinds of test, and confusing them causes most of the
public misunderstanding about health testing.

- **Trials** test a treatment. The subject is a claim about a population.
- **Diagnostics** test a person. The subject is one individual.

They have opposite failure modes and they are worth taking separately.

## Clinical trials: testing a treatment

Drug development runs a staged sequence, where each stage buys the right to expose more
people. It is a risk-graded pipeline, and it is the closest analogue in any field to a
staged software rollout.

| Phase | Who | Roughly how many | Question |
|---|---|---|---|
| Phase 0 | very few volunteers, microdoses | 10 to 15 | does the drug behave in humans the way we expect at all |
| Phase 1 | usually healthy volunteers | 20 to 100 | is it safe, what dose, what side effects |
| Phase 2 | people with the condition | 100 to 300 | does it appear to work |
| Phase 3 | people with the condition, many sites | 300 to 3,000 | does it work, compared to the current standard, with rare harms visible |
| Phase 4 | everyone taking it after approval | thousands, over years | what shows up in the real population over time |

Two things to notice.

**Phase 1 tests safety on healthy people who cannot benefit.** The design accepts that
some participants take on risk for no personal gain, which is why ethics review boards
exist and why dose escalation is done in small cohorts with stopping rules. This is
exactly the "minimise the blast radius" principle from chaos engineering in
06, written thirty years earlier and with much
more at stake.

**Phase 4 exists because trials cannot see rare harms.** A Phase 3 trial with 3,000
participants cannot detect a side effect that occurs in one patient in 20,000. The only
way to find it is release, plus surveillance. This is the honest version of "testing in
production", and it is a permanent part of the regulated process, not an admission of
failure. Software teams who treat production monitoring as a sign of insufficient testing
have the relationship backwards.

The design elements are those in 08: randomisation, a
control arm which may receive the current standard treatment or a placebo, blinding of
patients, and double blinding of the assessors. Trials are registered before they start,
with their primary outcome named, for the same reason preregistration exists in
psychology.

## Diagnostics: testing a person

A diagnostic test's quality is described by two numbers that do not depend on how common
the disease is:

- **Sensitivity**: of the people who have the condition, what share does the test catch.
  High sensitivity means few false negatives.
- **Specificity**: of the people who do not have it, what share does the test correctly
  clear. High specificity means few false positives.

And two numbers that depend entirely on how common it is:

- **Positive predictive value (PPV)**: given a positive result, what is the chance you
  actually have it.
- **Negative predictive value (NPV)**: given a negative result, what is the chance you
  actually do not.

Patients, and most people reading a test result, want PPV. Test manufacturers report
sensitivity and specificity. That gap is the source of the most important arithmetic in
this report.

### The arithmetic, worked

Take a mammogram with 85% sensitivity and 90% specificity, in a population where 1% of
women have breast cancer. Run 10,000 women.

| | Has cancer (100) | No cancer (9,900) | Total |
|---|---|---|---|
| Test positive | 85 (true positive) | 990 (false positive) | 1,075 |
| Test negative | 15 (false negative) | 8,910 (true negative) | 8,925 |

- PPV = 85 / 1,075 = **7.9%**
- NPV = 8,910 / 8,925 = **99.8%**

A woman with a positive result has roughly an 8% chance of having cancer. The test is not
bad. The test is good. The condition is rare, so the enormous healthy group generates far
more false positives than the tiny sick group generates true positives.

This is the **base rate fallacy**, and it is not a quirk of medicine. It governs:

- A security scanner flagging 2% of dependencies in a repository with three real
  vulnerabilities.
- An alert rule that fires on a 3-sigma deviation, evaluated every minute across 500
  metrics.
- A fraud model applied to a payment stream where 0.1% of transactions are fraudulent.
- Any airport screening system, which is why secondary screening exists.
- The polygraph, where the US National Research Council's 2003 review concluded that even
  if it worked as claimed, screening a population with a low rate of the thing being
  looked for would produce a large number of false positives.

The general rule, worth memorising: **when the thing you are looking for is rare, most of
your positives are wrong, no matter how good your test is.** The fix is never a better
test alone. It is a two-stage design: a cheap, sensitive first test to rule out, then an
expensive, specific second test on the small group that survives. Screening programmes,
security triage, and continuous integration pipelines all use this shape.

### Trading the two off

Sensitivity and specificity trade against each other through the threshold. Move the
cutoff to catch more true cases and you also catch more false ones. The **ROC curve**
plots that trade-off across all thresholds, and the area under it summarises how well the
test separates the two groups regardless of where you set the line.

Where you set the line is a value judgement, not a statistical one:

- Screening for a treatable, aggressive cancer: favour sensitivity. A false alarm costs a
  follow-up scan; a miss costs a life.
- Confirming a diagnosis before starting chemotherapy: favour specificity. The treatment
  itself is harmful.
- Blood donation screening: favour sensitivity heavily. Discarding good blood is cheap
  compared to a transfusion infection.

The equivalent choice in software is made constantly and almost never stated: how noisy
should the linter be, how eagerly should the alert fire, how strict should the fraud rule
be. Naming it as a sensitivity/specificity choice makes the argument tractable.

## The lab itself has to be tested

A result is only as good as the laboratory that produced it, so laboratories are
themselves tested, under **ISO/IEC 17025:2017**, the international standard for the
competence of testing and calibration laboratories.

The mechanisms are the ones software quality assurance mostly lacks:

- **Metrological traceability.** Every measurement must be linked to a national or
  international reference through a documented, unbroken chain of calibrations, each with
  its own stated uncertainty. Your scale was calibrated against a weight that was
  calibrated against a national standard.
- **Measurement uncertainty.** A result is not a number, it is a number plus a range. The
  lab must estimate and report it.
- **Method validation.** Before a method is used for real, it is shown to work: its limit
  of detection, its limit of quantification, its precision, its accuracy.
- **Proficiency testing.** The lab periodically analyses samples whose true values it does
  not know, sent by an external scheme, and its answers are compared against other labs.
- **Accreditation.** An external body assesses the lab against the standard, for a defined
  scope of tests. Mutual recognition arrangements let an accredited result cross borders.

Proficiency testing is the practice with no software equivalent worth the name. It is a
blind, external, periodic check that your testing apparatus still produces correct answers
on samples you cannot game. The nearest software analogue would be periodically injecting
a known defect into the pipeline and checking that the suite catches it, which is
essentially mutation testing (04) reframed as a
control on the process rather than on the code.

## Sources

- [FDA, Step 3: Clinical Research](https://www.fda.gov/patients/drug-development-process/step-3-clinical-research);
  phase participant counts as summarised by
  [Cancer Therapy Advisor](https://www.cancertherapyadvisor.com/factsheets/clinical-trial-phases/)
  and [BrightFocus](https://www.brightfocus.org/about/clinical-trials/phases-of-clinical-trials/)
- [NY State Department of Health, disease screening statistics](https://www.health.ny.gov/diseases/chronic/discreen.htm),
  source of the mammography example. Table recomputed independently in this report.
- National Research Council. *The Polygraph and Lie Detection*, 2003.
  [National Academies](https://www.nationalacademies.org/read/10420/chapter/10)
- [ISO/IEC 17025:2017](https://www.iso.org/standard/66912.html);
  [PECB overview](https://pecb.com/en/whitepaper/iso-iec-170252017-general-requirements-for-the-competence-of-testing-and-calibration-laboratories)

---

<!-- 11archive-source: 10-materials-and-manufacturing.md -->

# Testing things: materials, products, and plants

This is the oldest engineering tradition, and the one with the most developed vocabulary
for the problems software argues about informally. Sampling, acceptance criteria, and the
cost of a false alarm are all written down here, in standards, before inspection starts.

## The first split: does the test destroy the thing

**Destructive testing** breaks the sample to learn its limits. You cannot then sell it, so
you test a sample and infer about the batch.

| Test | What it does | What it tells you |
|---|---|---|
| Tensile test | pulls a specimen until it breaks | strength, stiffness, how much it stretches first |
| Hardness test | presses a defined indenter with a defined force | resistance to denting and wear |
| Impact test, for example Charpy | strikes a notched specimen with a pendulum | how much energy it absorbs before fracturing, and whether it fails brittle or ductile |
| Fatigue test | cycles a load millions of times | how many cycles it survives at a given stress |
| Creep test | holds a load at temperature for a long time | slow deformation under sustained load |
| Burst test | pressurises until the vessel fails | the actual failure pressure and mode |

**Non-destructive testing (NDT)** inspects without harming the item, so you can test the
actual part that goes into service. Six methods dominate:

| Method | How it works | Finds |
|---|---|---|
| Visual (VT) | trained inspection, often with optics or a borescope | surface defects |
| Liquid penetrant (PT) | a dye is drawn into surface cracks by capillary action, then developed | surface-breaking cracks in non-porous materials |
| Magnetic particle (MT) | magnetise the part, iron particles gather at flux leakage | surface and near-surface cracks in ferrous metals |
| Eddy current (ET) | an alternating field induces currents; flaws distort them | surface cracks, corrosion, conductivity changes |
| Ultrasonic (UT) | high-frequency sound reflects off internal discontinuities | internal flaws, and wall thickness |
| Radiographic (RT) | X-rays or gamma rays image the interior | internal voids, inclusions, weld defects |

The critical distinction is **surface versus volumetric**. Visual, penetrant, and magnetic
particle see the surface only. Ultrasonic and radiographic see inside. Choosing a surface
method and then reporting "no defects found" is a coverage claim failure of the exact kind
described in 01.

NDT inspectors are themselves certified to levels under schemes such as ASNT SNT-TC-1A or
NAS 410: Level I performs under supervision, Level II performs and interprets
independently, Level III writes the procedures and trains. **The person is part of the
instrument, so the person is qualified and re-qualified.** Software has no equivalent, and
the absence shows up whenever a security assessment's quality depends entirely on which
individual did it.

## Sampling: the part software should steal

You cannot test every item. Acceptance sampling is the mathematics of deciding how many to
test and what result justifies accepting the lot.

Under **ISO 2859-1**, and its American equivalent ANSI/ASQ Z1.4, a sampling plan states,
on one page and before inspection begins:

- the lot size
- the inspection level, which sets how much scrutiny the lot gets
- the sample size drawn from it
- the **acceptance quality limit (AQL)**: the defect rate that will routinely be accepted
- the accept number and the reject number: find this many defects, accept; find this many,
  reject the whole lot
- switching rules that tighten inspection after failures and loosen it after a run of
  clean lots

Both error directions have names and owners:

- **Producer's risk**: a good lot is rejected. The manufacturer bears this.
- **Consumer's risk**: a bad lot is accepted. The buyer bears this.

Two things are remarkable about this from a software perspective. First, everyone agrees
the escape rate will not be zero, and they write down the number. Second, inspection
intensity adapts automatically to demonstrated quality, so a supplier with a clean record
gets inspected less.

The military ancestor, MIL-STD-105E, was cancelled, with the 2008 cancellation notice
pointing users to MIL-STD-1916 or ANSI/ASQ Z1.4. ISO 2859-1 is close to, but not identical
with, Z1.4; a 1999 revision changed some accept/reject pairs.

Compare this to how software decides what to test. Almost no team states an accepted
escape rate, an inspection intensity, or a switching rule. Almost every team has all three
implicitly. Writing them down is the single most transferable idea in this report, and
13 sketches what it would look like.

**Statistical process control (SPC)** is the continuous cousin. Rather than inspecting
lots, you plot a process measurement over time on a control chart with limits derived from
the process's own variation, and act when the pattern says something changed. The
distinction it enforces is between normal variation, which you must not react to, and a
real shift, which you must. Software teams staring at latency graphs reinvent this badly
and constantly.

## Reliability testing: making time go faster

The problem: you need to know whether a product survives ten years, and you have four
months.

| Method | What it does | Purpose |
|---|---|---|
| Accelerated life testing (ALT) | run at higher stress, use a physical model to extrapolate | quantitative: estimate life at normal stress |
| Highly accelerated life testing (HALT) | escalate temperature and vibration until it breaks, then further | qualitative: find the weak links in the design. There are no survivors, on purpose |
| Highly accelerated stress screening (HASS) | apply stresses derived from HALT to production units | catch manufacturing defects, not design defects |
| Environmental stress screening (ESS) | milder stresses, applied to 100% of units | remove early-life failures before shipping |
| Burn-in | run units under power and temperature for a period | the same goal, thermal and voltage only |

The important pairing is HALT and HASS. HALT is run on the design, to failure, to learn
*how* it fails and where its margins are. HASS is run in production, at stresses chosen
from what HALT revealed, to catch units built wrong. You cannot do HASS without first
doing HALT, because HALT is what tells you which stresses are informative and which are
merely destructive.

The software analogue of HALT is a stress test run past the breaking point to learn the
failure mode, which is different from a load test run to confirm a target. Most teams run
the second and call it the first.

Environmental testing more broadly covers thermal cycling, humidity, salt spray for
corrosion, vibration and shock, altitude, and ingress protection, the IP rating that
states resistance to dust and water.

## Commissioning: testing an installation

Industrial and pharmaceutical projects test equipment at three points, and the sequence is
a direct analogue of the software deployment pipeline.

| Stage | Where | What it proves |
|---|---|---|
| Factory acceptance test (FAT) | at the manufacturer, before shipping | the equipment meets specification under controlled conditions |
| Site acceptance test (SAT) | at the final installation | it still works with real utilities, real interfaces, and site conditions |
| Commissioning and qualification | on site, in final configuration | the integrated system runs as intended |

FAT is a staging environment. SAT is the thing everyone skips and then regrets, because
"it worked at the vendor's site" is the physical version of "it works on my machine".

Pressure and load testing then proves the built system:

- **Hydrostatic testing** fills a pipe or vessel with water, pressurises above the maximum
  allowable working pressure, and holds it while watching for leaks and deformation. Water
  rather than gas, because water barely compresses, so a failure releases far less stored
  energy. That is a test designed around the blast radius of the test itself.
- **Proof pressure testing** applies a multiple of working pressure, commonly 1.5 times,
  to show the item tolerates more than it will ever see without permanent damage.
- **Proof load testing** does the same for cranes, lifting equipment, and structures.

The safety factor is the point. These systems are not tested at their rated capacity, they
are tested well beyond it, and the margin is stated. Very little software carries an
explicit margin of this kind, even though the equivalent, testing at several times peak
expected load, is cheap.

## Vehicles and consumer safety

Crash testing is the most visible public testing programme in the world, and its structure
is instructive.

Euro NCAP's assessment from 2026 uses four pillars, each scored out of 100 and expressed
as a percentage:

1. **Safe Driving**: technologies that help the driver avoid errors, including driver
   monitoring.
2. **Crash Avoidance**: systems that prevent or reduce a collision, tested for frontal,
   lane, and low-speed cases.
3. **Crash Protection**: the traditional crash tests, covering the structure, restraints,
   and protection of occupants, pedestrians and cyclists.
4. **Post-Crash Safety**: rescue information, emergency call systems, and multi-collision
   braking, covering the period after impact.

Two design decisions are worth copying. First, **the overall star rating is limited by the
weakest pillar**, so a manufacturer cannot compensate for poor occupant protection with
excellent driver assistance. Second, the protocol is **published in advance and revised on
a schedule**, which makes it a moving target on purpose: manufacturers optimise for the
test, so the test changes. That is an explicit, institutional answer to Goodhart's law,
discussed in 14.

## Electronics and semiconductors

| Test | What it does |
|---|---|
| Automated optical inspection (AOI) | camera inspection of assembled boards for placement and solder defects |
| In-circuit test (ICT) | probes contact test points to measure individual components on the board |
| Boundary scan (JTAG) | dedicated on-chip circuitry shifts test patterns through pins, testing connections without physical probes |
| Functional test | the board is powered and exercised as it would be in use |
| Automated test equipment (ATE) | tests every die on a wafer, and every packaged part, at speed |
| EMC and EMI testing | verifies the device neither emits nor is disrupted by electromagnetic interference; required for CE and FCC marking |

**Design for test (DFT)** is the practice of adding structures to a chip or board purely so
it can be tested: scan chains, built-in self-test, accessible test points. This is exactly
the same idea as designing software for testability, and the hardware world takes it more
seriously because a chip that cannot be tested cannot be sold.

Boundary scan is worth one more sentence, because it solved a problem software also has.
As boards got denser, physical probes stopped fitting. The response was to build the test
access into the device itself. The software equivalent is instrumentation, structured
logging, and health endpoints: capabilities added to the product solely so the product can
be inspected in places you can no longer reach from outside.

## Food, agriculture, and consumables

**HACCP**, hazard analysis and critical control points, is the framework behind most food
safety regulation. Its structure is a testing system, and it makes a distinction software
tends to blur:

- Identify hazards and the **critical control points** where a hazard can be prevented,
  eliminated, or reduced to an acceptable level. A cooking step that kills pathogens is a
  CCP.
- Set **critical limits** at each point, for example a minimum core temperature.
- **Monitor** each CCP: a planned sequence of observations or measurements that says
  whether the point is under control.
- Define **corrective actions** in advance, so that when monitoring shows loss of control,
  nobody improvises.
- **Verify**: ongoing checks that the plan is being followed and is working.
- **Validate**: separately, obtain scientific evidence that the control measures are
  actually capable of controlling the hazard. Done before implementation and after any
  major change.

The validation and verification pair here is sharper than the software version in
07. Verification asks whether you followed the
plan. Validation asks whether the plan was ever capable of working. A team with a green
build has verification. Almost nobody has validation.

Two other food and agriculture tests are worth naming as examples of unusual oracles:

- **Sensory analysis** uses trained human panels under standardised conditions. The
  **triangle test**, standardised as ISO 4120, gives an assessor three samples where two
  are identical and one differs, and asks which is the odd one. It is a forced choice, so
  guessing produces a known rate of correct answers, and the statistics account for it.
  This is how you get a numeric, defensible answer out of subjective human perception,
  which is a problem usability testing also has and solves less rigorously.
- **Shelf-life testing**, including accelerated versions at raised temperature, is the food
  equivalent of a soak test.

## Sources

- [ASNT: what is nondestructive testing](https://www.asnt.org/what-is-nondestructive-testing);
  [the six most common NDT methods](https://www.vareximaging.com/blogs/what-are-the-six-most-common-ndt-methods/)
- [ISO 2859-1 inspection levels and AQL](https://qualityinspection.org/inspection-level/);
  [ISO 2859-1 versus ANSI/ASQ Z1.4](https://ecqa.com/iso-2859-1-vs-ansi-z1-4/);
  [brief history of ANSI/ASQ Z1.4](https://www.qualitymag.com/articles/98097-brief-history-of-ansi-asq-z14)
- [Tektronix: Fundamentals of HALT/HASS testing](https://download.tek.com/document/HALT_HASS_WP.pdf);
  [Accendo Reliability on ESS and HASS](https://accendoreliability.com/ess-hass/)
- [FAT and SAT in commissioning](https://blog.pqegroup.com/commissioning-qualification/fat-and-sat);
  [hydrostatic and proof pressure testing](https://sarum-hydraulics.co.uk/white-paper/hydrostatic-pressure-testing/hydrostatic-proof-burst-fatigue-test-explainer/)
- [Euro NCAP, the stars explained](https://www.euroncap.com/how-to-read-the-stars/);
  [2026 protocol changes](https://www.euroncap.com/press-media/euro-ncap-announces-2026-protocol-changes-to-tackle-modern-driving-risks/)
- [FDA HACCP principles and application guidelines](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines);
  [ISO 4120 triangle test](https://www.iso.org/standard/33495.html)

---

<!-- 11archive-source: 11-people-and-organisations.md -->

# Testing people and organisations

Testing a person or an institution has a property no other kind of testing has: **the
subject knows it is being tested and can change its behaviour in response.** Everything
distinctive about this family follows from that.

## Psychometrics: testing what cannot be seen

An exam, a personality inventory, and a clinical depression scale all try to measure
something that has no physical existence. You cannot weigh reading comprehension. You can
only observe behaviour you claim is a sign of it.

The field that studies this, psychometrics, has the most developed language anywhere for
"is this test any good", and it splits the question into two.

**Reliability: does the test give a consistent answer?**

| Type | Question | How it is checked |
|---|---|---|
| Test-retest | same person, later, same score? | administer twice, correlate |
| Internal consistency | do the items measure the same thing? | Cronbach's alpha across items |
| Inter-rater | do two markers agree? | Cohen's kappa, which corrects raw agreement for chance |
| Parallel forms | do two versions of the test agree? | correlate scores across forms |

**Validity: is it measuring the thing you say it measures?**

| Type | Question |
|---|---|
| Face | does it look relevant to the people taking it |
| Content | does it cover the whole of the thing, not just the easy parts |
| Criterion | does it predict something real and external, like later job performance |
| Construct | does it actually measure the underlying trait it claims to |

The relationship between them is the lesson. **A test can be perfectly reliable and
completely invalid.** A bathroom scale reads the same weight every time; it is a very
reliable measure of your reading ability, and a useless one. Reliability is necessary and
nowhere near sufficient.

Software has reliability language and almost no validity language. A test suite that
passes consistently is reliable. Whether passing means the software is good is a validity
question, and the honest answer for most suites is that nobody has checked. Cohen's kappa
is also directly useful and unused: when two reviewers, or a human and a model, classify
the same items, raw agreement overstates the case, because some agreement happens by
chance.

## Education assessment

Two purposes, and the difference is who the result is for.

- **Formative assessment** happens during learning and exists to change what happens next.
  A quiz whose result tells a teacher which concept to reteach. Low stakes by design.
- **Summative assessment** happens at the end and exists to certify. A final exam. Usually
  high stakes.

The same distinction applies to software testing, and is worth borrowing explicitly. A
failing test in your editor is formative: it tells you what to do next. A release gate is
summative: it certifies. Confusing them produces both of the common dysfunctions, treating
a red build as a judgement rather than information, and treating a release gate as a
suggestion.

Two more distinctions:

- **Norm-referenced** scoring ranks you against other test-takers. Someone must be in the
  bottom 10%, by construction, however good everyone is.
- **Criterion-referenced** scoring measures you against a fixed standard. Everyone can
  pass. A driving test is criterion-referenced; a curve is norm-referenced.

**Adaptive testing** picks the next question based on your previous answers, using item
response theory to home in on your level. It gets a more precise estimate from fewer
questions, which is the same efficiency argument as coverage-guided fuzzing in
04: choose the next input based on what the
previous ones revealed.

### The failure mode with a name

High-stakes testing of people produces a specific, well-documented corruption, and two
laws describe it.

**Campbell's law**: "The more any quantitative social indicator is used for social
decision-making, the more subject it will be to corruption pressures and the more apt it
will be to distort and corrupt the social processes it is intended to monitor."

**Goodhart's law**, in its common paraphrase: when a measure becomes a target, it ceases to
be a good measure.

In education this appears as teaching to the test, narrowed curricula, and outright
cheating. Empirical analyses covering 2002 to 2007 in US schools found teachers dedicating
20% to 30% more time to test preparation in the weeks before exams, at the expense of
deeper conceptual work.

This is the same phenomenon as a team writing assertion-free tests to hit a coverage
target, or deploying less often to protect a change failure rate. See
14, which treats it as the general problem it is.

## Hiring and professional licensing

Hiring assessment is a testing problem with poor construct validity and enormous stakes,
and it is worth naming because software people design these tests constantly without the
vocabulary.

- A **work sample test** asks the candidate to do a small version of the actual job. It has
  the best criterion validity of the common methods, because the test and the criterion
  are nearly the same thing.
- **Structured interviews**, where every candidate gets the same questions scored against
  a defined rubric, substantially outperform unstructured ones, largely because they raise
  inter-rater reliability.
- **Take-home exercises** trade realism for time, and introduce a coverage problem: they
  test who has free evenings.

Professional licensing, for doctors, pilots, electricians and lawyers, is criterion-
referenced summative testing with periodic revalidation. The revalidation is the part
software certification lacks: a licence that never expires tests what you knew once.

## Physical and performance testing of people

- **Fitness assessment**: VO2 max, lactate threshold, sprint and strength batteries. These
  are laboratory measurements with defined protocols, and the sports science literature
  worries about protocol standardisation for exactly the reasons ISO/IEC 17025 does.
- **Anti-doping testing**: in-competition and out-of-competition, with no-advance-notice
  collection, chain of custody, an A sample and a B sample so a positive can be
  independently confirmed, and the athlete biological passport, which watches an
  individual's own biological markers over time rather than testing for a substance.

The biological passport is a genuinely clever answer to an arms race. Rather than testing
for known substances, which invites the invention of unknown ones, it looks for changes in
the athlete that no natural process explains. The software equivalent is anomaly detection
on a system's own baseline, rather than signature matching against known attacks, and the
same trade-off applies: fewer things to evade, more false positives.

## Forensic and legal testing

Courts must decide whether a test is good enough to be believed, and US federal courts use
the **Daubert standard**, from *Daubert v. Merrell Dow Pharmaceuticals* (1993), which made
trial judges gatekeepers for scientific evidence. The factors:

1. Can the technique be tested, and has it been?
2. Has it been peer reviewed and published?
3. What is the known or potential error rate?
4. Do standards and controls exist and are they maintained?
5. Is it generally accepted in the relevant scientific community?

Factor 3 is the one to notice. **A court asks for the error rate of the test itself.** Not
whether the expert believes the result, but how often the method is wrong. Very few
software or security assessments could answer that question about themselves.

The **polygraph** is the standing example of what happens when a test is used widely
without an established error rate. The US National Research Council's 2003 review found
the scientific basis of the comparison question technique weak, the supporting research of
low quality, the profession's accuracy claims unfounded, and the error rate unknown, while
noting that accuracy is better than chance. It also made the base-rate point from
09: screening a population where the thing being looked for
is rare would produce a large number of false positives even if the test worked as claimed.

Chain of custody is the other transferable idea: a documented, unbroken record of who held
the sample, when, and what they did to it. Any break makes the result inadmissible
regardless of what it says. Software has the same requirement for audit and incident
evidence and treats it far more casually.

## Testing organisations

An organisation can be tested as a system, and the methods are the direct ancestors of
chaos engineering in 06.

| Exercise | What it tests | How real it is |
|---|---|---|
| Tabletop exercise | decision-making, roles, and communication under a scenario | discussion only, no systems touched |
| Walkthrough or drill | one specific procedure, performed for real | limited scope |
| Simulation or functional exercise | responders act, but on a simulated incident | systems may be exercised |
| Full-scale exercise | the real thing, with real systems and real disruption | fully real |
| Disaster recovery test | restore systems into a clean environment and confirm they work | real, if done properly |
| Fire drill and evacuation | can everyone get out, in the time budget | real |
| Phishing simulation | will staff click, and will they report it | real, on real people |
| Red team exercise | would you detect and respond to an actual intruder | real, usually undisclosed to defenders |
| War gaming | strategic decisions against an adversary who adapts | simulated |

The ladder from tabletop to full-scale is a blast radius ladder, exactly like the canary
progression in a software release. Start where being wrong is cheap, then increase realism
as confidence grows.

Two cautions worth carrying over.

**A drill everyone knew about tests a different thing.** An announced evacuation measures
whether the route works. An unannounced one measures whether people use it. Both are
useful; they are not the same test, and the announced version is routinely reported as
though it were the unannounced one.

**Phishing simulations test the organisation, not the individual.** A programme that
punishes people who click produces staff who hide incidents, which is worse than staff who
click. The metric worth tracking is the report rate, not the click rate. This is Campbell's
law arriving on schedule.

## Sources

- [Types of reliability, Research Methods Knowledge Base](https://conjointly.com/kb/types-of-reliability/);
  [reliability and validity of measurement](https://opentext.wsu.edu/carriecuttler/chapter/reliability-and-validity-of-measurement/1000/)
- [Formative and summative assessment, Yale Poorvu Center](https://poorvucenter.yale.edu/teaching/teaching-resource-library/formative-summative-assessments)
- [Campbell's law](https://en.wikipedia.org/wiki/Campbell%27s_law);
  [Goodhart's law, Campbell's law and the cobra effect](https://psychsafety.com/goodharts-law-campbells-law-and-the-cobra-effect/)
- [The Daubert standard and its five factors](https://bridgelegal.org/understanding-five-daubert-factors-expert-testimony/)
- National Research Council. *The Polygraph and Lie Detection*, 2003.
  [National Academies](https://www.nationalacademies.org/read/10420/chapter/10)
- [NIST SP 800-115 and red, blue and purple teams](https://www.compassitc.com/blog/penetration-testing-understanding-red-blue-purple-teams)

---

<!-- 11archive-source: 12-markets-and-money.md -->

# Testing markets, products, and money

Business testing splits cleanly in two. One half asks whether anyone wants the thing. The
other half asks whether the institution survives if things go badly. Both are testing in
the full sense of 01, and both are usually run by people who
would not describe themselves as testers.

## Testing demand before building

The expensive mistake in product work is building something correct that nobody wants.
Verification without validation, in the language of
07. These methods attack it, ordered from cheapest
to most committing.

| Method | What you do | What it actually tests | Main risk |
|---|---|---|---|
| Customer discovery interview | ask people about their current behaviour and problems | what they do now | asking about the future, which people answer badly |
| Concept test | show a description or mockup, measure reaction | whether the idea is understood and appealing | stated preference is not behaviour |
| Fake door test, also called smoke test | ship a button or landing page for a feature that does not exist, count clicks | revealed intent, with real money and attention at stake | annoys the people who click |
| Wizard of Oz test | the interface is real, humans perform the work behind it | whether the experience is valuable, before automating it | does not scale, and hides the cost |
| Concierge test | you deliver the service manually, openly | whether the outcome is valuable | small sample, and you learn a lot |
| Pilot or limited launch | full product, small market or small group | everything, at small scale | slow, and the small group may not represent the rest |
| Minimum viable product | smallest thing that produces real learning | usually demand plus feasibility | "minimum" tends to win over "viable" |

The ordering principle is the same one used in clinical trials and canary releases: buy
the cheapest information first, and increase exposure as evidence accumulates.

**Fake door tests deserve a note on ethics**, because they are the one method here that
deliberately misleads. A button that returns "coming soon" is generally accepted. A
checkout flow that takes payment details for a product that does not exist is not. The
line is whether the person loses anything real by participating.

### Pricing tests

Price is the hardest thing to test, because asking about it directly does not work.

- **Van Westendorp price sensitivity meter**: four questions about what price would be too
  cheap, cheap, expensive, and too expensive, plotted to find an acceptable range. Cheap
  to run, and it measures perception rather than behaviour.
- **Conjoint analysis**: present bundles of features at prices and make people choose. It
  recovers how much each attribute is worth by forcing trade-offs, which is far more
  reliable than asking "how much would you pay".
- **Live price testing**: charge different prices to different groups. It gives the real
  answer and carries fairness, legal, and reputational risk that most other A/B tests do
  not.

The general point: **a test where the subject gives up nothing measures opinion, and a
test where the subject gives up money measures demand.** Conjoint sits in between by
forcing a trade-off even without real money.

## A/B testing, which is an RCT

An online A/B test is a randomised controlled trial. Split traffic randomly, show variant
A or B, compare a pre-declared metric. Every element from 08
is present: random assignment, a control group, a threshold, a decision.

Two findings from large-scale practice change how you should read results.

**Most ideas do not work.** Reporting on years of experimentation at Microsoft, Ronny
Kohavi's figures are roughly one third of ideas positive and statistically significant,
one third flat, and one third actively negative. In a well-optimised product the positive
share falls further. This is the single most useful number in product development: it
means the value of experimentation is mostly in *stopping* things, and a team whose
experiments almost always win is measuring badly.

**The statistical hazards are worse online than in a lab**, because the data streams in
and the dashboard is always open. The four to watch are in
08: peeking, multiple metrics, underpowered tests, and no
preregistered hypothesis.

Related designs:

- **Multivariate testing** varies several elements at once and estimates interactions. It
  needs far more traffic than most products have.
- **Multi-armed bandit** shifts traffic toward the winner while the test runs. It earns
  more during the experiment and gives a less clean estimate of how much each variant is
  worth. Use it for short-lived decisions like which headline to show, not for decisions
  you will build on.
- **Holdout groups** keep a slice of users permanently on the old experience, so you can
  measure the cumulative effect of a year of small wins. Individually significant wins
  frequently fail to add up, and a holdout is the only way to find that out.
- **Switchback testing** alternates a treatment over time rather than across users, for
  marketplaces where treating one user affects another.

## Testing that the institution survives

The other half of business testing asks what happens when things go wrong, and it is a
regulatory requirement in finance.

### Stress testing

Regulators define a hypothetical severe scenario and require banks to project their
position through it.

The 2025 Federal Reserve stress test, published 27 June 2025, covered 22 banks. Under the
severely adverse scenario the aggregate common equity tier 1 capital ratio fell from 13.4%
to a minimum of 11.6%, a decline of 1.8 percentage points, with projected losses of $549
billion over nine quarters, of which $472 billion was loan losses. The corresponding
decline in the 2024 test was 2.8 percentage points.

Four features of this design are worth copying:

1. **The scenario is set by the party bearing the risk**, not by the party being tested.
   Banks do not choose their own stress scenario. Almost every software resilience test is
   designed by the team that built the system, which is the equivalent of marking your own
   exam.
2. **It is a projection, not an execution.** Nobody crashes the economy. The test runs
   against a model, so the model itself must be validated separately.
3. **The result has a consequence**, the bank's required capital buffer. A test with no
   decision attached is a ritual, per 01.
4. **It repeats annually with changing scenarios**, for the same anti-Goodhart reason
   Euro NCAP revises its protocols.

### Backtesting

Run a strategy or a risk model against historical data and see how it would have
performed. Standard for trading strategies and required for value-at-risk models, where a
model claiming a 1% daily loss threshold should be breached about 1% of days; far more or
far fewer breaches means the model is wrong.

Backtesting is the financial cousin of snapshot testing in
04, and it has the same flaw: **the oracle is the
past.** Its specific failure modes:

- **Overfitting**: try enough strategies against one history and one will look excellent
  by chance. This is p-hacking with money.
- **Survivorship bias**: testing against an index of companies that still exist omits the
  ones that failed, which is the population you cared about.
- **Look-ahead bias**: accidentally using information that was not available at the time,
  for example a restated earnings figure.
- **Regime change**: the past contains no example of the thing that breaks you.

### Model validation

US supervisory guidance SR 11-7 requires banks to validate the models they rely on,
including independent review of the model's conceptual soundness, ongoing monitoring, and
outcomes analysis. The core requirement is that validation be performed by people
independent of the model's developers.

That is the same **independent verification and validation** principle as DO-178C in
07, and it is the control that machine learning
deployment in most technology companies currently lacks.

### Audit sampling

External auditors cannot examine every transaction, so they sample, using either
statistical sampling with a computed sample size and a projected error rate, or judgemental
sampling of high-risk items. The output is an opinion with a stated scope and stated
materiality: a threshold below which an error is deemed not to matter.

Materiality is worth naming, because software has no equivalent term and badly needs one.
An auditor states, in advance, how large an error has to be before it changes the
conclusion. Software teams argue endlessly about whether a given defect is worth fixing
without ever having set that line.

### Insurance and actuarial testing

Insurers test their reserves and pricing by projecting portfolios through simulated
futures, usually with **Monte Carlo simulation**: run the model thousands of times with
randomly drawn inputs and look at the distribution of outcomes rather than a single
answer.

The mindset transfers directly. A single load test gives you one number. Running the same
scenario with randomly varied traffic mixes, failure timings, and data shapes gives you a
distribution, and the tail of that distribution is where incidents live.

## Sources

- Kohavi, R. et al. ["Online Controlled Experiments at Large Scale"](https://exp-platform.com/Documents/2015-08OnlineControlledExperimentsKDDKeynoteNR.pdf),
  KDD; and ["Online Experimentation at Microsoft"](http://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf)
- [Federal Reserve, 2025 Dodd-Frank Act Stress Test Results](https://www.federalreserve.gov/publications/2025-june-dodd-frank-act-stress-test-results.htm),
  June 2025
- [Bank Policy Institute, deep dive on the DFAST 2025 scenarios](https://bpi.com/deep-dive-dfast-2025-stress-test-scenarios/)
- [Harvard Business Review, The Surprising Power of Online Experiments](https://hbr.org/2017/09/the-surprising-power-of-online-experiments)

---

<!-- 11archive-source: 13-cross-domain-map.md -->

# The translation table

Most testing ideas were invented several times, in fields that do not read each other's
journals. This section maps the vocabulary across, then names what is actually worth
moving between fields.

## Same idea, different words

| Software term | Equivalent elsewhere | Field |
|---|---|---|
| Unit test | coupon test on a material sample | materials |
| Integration test | subsystem test rig | aerospace |
| End-to-end test | full-scale exercise; road test | emergency planning; automotive |
| Smoke test | power-on self-test; pre-flight check | electronics; aviation |
| Regression test | control chart; recurring proficiency test | manufacturing; laboratories |
| Staging environment | factory acceptance test (FAT) | industrial commissioning |
| Production validation | site acceptance test (SAT) | industrial commissioning |
| Canary release | dose escalation cohort; pilot programme | clinical trials; policy |
| A/B test | randomised controlled trial | medicine, economics |
| Feature flag | reversible pilot | policy |
| Chaos engineering | fire drill; HALT; disaster recovery exercise | safety; reliability |
| Load test | proof load test | structural engineering |
| Stress test to failure | HALT, highly accelerated life testing | reliability |
| Soak test | shelf-life or endurance test | food; mechanical |
| Snapshot test | control sample compared to a retained reference | laboratories |
| Differential testing | dual-entry bookkeeping; double data entry | accounting; clinical research |
| Mutation testing | proficiency testing with blind spiked samples | laboratories |
| Fuzzing | environmental stress screening | electronics |
| Static analysis | non-destructive testing | materials |
| Code review | peer review | science |
| Pair programming | four-eyes principle | finance, aviation |
| Test coverage | inspection coverage, sampling fraction | manufacturing |
| Flaky test | measurement repeatability failure | metrology |
| Test oracle | reference standard; control group | metrology; experimental science |
| Assertion | specification limit | manufacturing |
| Test double, mock | simulator; phantom (in imaging) | training; medical physics |
| Escaped defect | field failure; consumer's risk | reliability; sampling |
| False alarm in CI | producer's risk | sampling |
| Acceptance criteria | acceptance quality limit (AQL) | sampling |
| Definition of done | conformity assessment | standards |
| Verification | verification | identical meaning, universally |
| Validation | validation | identical meaning, universally |
| Independent QA | independent verification and validation; external audit | aviation; finance |
| Bug bounty | proficiency scheme; adversarial review | laboratories; security |
| Post-incident review | root cause analysis; corrective and preventive action (CAPA) | quality management |

The row that matters most is the last-but-one block. **Verification and validation mean
exactly the same thing in every field**, and software is the only one that routinely blurs
them.

## Five things software should take

These are ranked by how much they would change, per unit of effort to adopt.

### 1. Write the sampling plan down

Manufacturing states, before inspection starts: how much will be inspected, what defect
rate is accepted, what result rejects the batch, and who carries each risk. See
10.

Software teams have all of these implicitly and none explicitly. The written version would
be short:

```
Component: payments service
Risk class: high (money movement, regulated)
Accepted escape rate: no P1 defects reaching production per quarter
Inspection intensity: mutation score >= 70% on the core, contract tests on every
  consumer, load test to 3x peak before each release
Producer's risk accepted: pipeline may reject good builds up to 2% of the time
  (flake budget)
Switching rule: after two consecutive quarters with no P1 escapes, drop the
  pre-release full E2E run to weekly
```

Nothing in that is technically hard. What it does is turn arguments about "are we testing
enough" into arguments about numbers, which end.

### 2. Set inspection intensity by consequence, not uniformly

Every safety standard grades rigour by harm: ASIL A to D, IEC 62304 Class A to C, DO-178C
Level E to A. See 07.

Most software teams apply roughly the same testing effort everywhere, then feel guilty
about the parts with less. The better move is to classify explicitly. A three-level scheme
is enough: could this cost money or safety, could it damage trust, or is it cosmetic. Then
put mutation testing, contract tests, and independent review on the first tier, and accept
much lighter coverage on the third without apology.

### 3. Test the tests, on a schedule

Laboratories under ISO/IEC 17025 participate in proficiency testing: an external body
sends samples with known values, the lab reports its results blind, and its performance is
compared against other labs. See 09.

The software version already exists and is used as a one-off audit rather than a control:
mutation testing. Run periodically on the critical modules, with a tracked score, it
answers the question a green build cannot: would this suite notice if the code were wrong?

A cheaper variant costs nothing: during incident review, ask why no test caught it, and
whether a test could have. Track the answer over time. That is outcomes analysis, in the
sense SR 11-7 uses in 12.

### 4. Make coverage claims explicit, including the negative

Every field that takes testing seriously states what a result does *not* cover. An NDT
report says which method was used, so a reader knows surface flaws were checked and
internal ones were not. A penetration test report should say the same and often does. A
green build says nothing at all.

The lightweight version: a short "what this suite does not cover" note per service, kept
next to the tests. Concurrency under real load. Behaviour when the third-party payment
provider returns a 500. Data volumes above ten million rows. Anything in the admin
interface. Writing that list takes an hour and it is the most honest artefact most teams
could produce.

### 5. Separate the author from the verifier where the stakes justify it

DO-178C requires independence at high levels. SR 11-7 requires model validation by people
independent of the developers. Science requires peer review. Finance requires external
audit.

Software has code review, which is genuinely this control, and it degrades in a specific
way: the reviewer reads the diff, not the requirement. The stronger version is to have
someone other than the author write the acceptance criteria, or at least confirm them
against what was actually asked for. That is the difference between verification and
validation, staffed.

## Three things software has that other fields lack

The traffic is not one-way.

**Continuous, automated, cheap re-testing.** A software team can re-run 40,000 checks on
every change, in minutes, at nearly zero marginal cost. No physical field can do this. A
bridge is proof-loaded once. The consequence is that software can afford a regression
culture that other engineering disciplines can only dream about, and mostly wastes it by
not maintaining the suite.

**Version-controlled, executable specifications.** A test suite is a specification that
cannot silently drift out of date with the artefact, because it runs against it. Written
procedures in every other field drift, which is why audits exist.

**Testing at full population rather than by sample.** Manufacturing tests 200 units out of
50,000 because testing all of them is prohibitive. Software can run its checks against
every code path it has tests for, every time. Where software does sample, in load testing
and in production monitoring, it usually does so without the sampling theory that other
fields developed, which is the gap point 1 above addresses.

## The one thing everyone gets wrong

Across every field surveyed here, the same error recurs, and it is not a technical one.

**A test result is treated as a statement about the system, when it is a statement about a
sample.**

- "The tests pass" becomes "the software works".
- "Negative mammogram" becomes "no cancer".
- "Passed the pentest" becomes "secure".
- "The batch was accepted" becomes "there are no defects".
- "Five stars" becomes "safe in any crash".
- "p < 0.05" becomes "true".
- "Scored 94%" becomes "understands the subject".

Every one of these drops the coverage claim. It is the same mistake each time, and the
correction is the same each time: ask what the test sampled, and what it did not.

## Sources

Cross-references only; every claim in this section is sourced in the section it points to.
The synthesis, the translation table, and the five proposals are original to this report.

---

<!-- 11archive-source: 14-how-testing-fails.md -->

# How testing fails, everywhere

The failure modes below are not domain-specific. Each one appears in software, in
medicine, in manufacturing, and in education, wearing different clothes. Recognising the
pattern in an unfamiliar field is the fastest way to see it in your own.

## 1. The measure becomes the target

**What happens:** a number chosen to indicate quality becomes the thing people optimise,
and stops indicating quality.

| Field | Version |
|---|---|
| Software | 80% coverage target met with tests that assert nothing |
| Software | change failure rate improved by deploying less often |
| Education | curriculum narrowed to the tested subjects; 20% to 30% more class time on test prep before exams |
| Emissions testing | vehicles that detected the test cycle and behaved differently during it |
| Healthcare | hospital wait-time targets met by reclassifying when the wait starts |
| Policing | crime statistics improved by downgrading offence categories |

Campbell's law and Goodhart's law both describe this, and neither offers a way out. The
partial defences that work in practice:

- **Change the test on a schedule.** Euro NCAP revises its protocols; exam boards rotate
  question banks. If the target moves, optimising for it converges on the real goal.
- **Use several measures that are hard to game together.** Coverage plus mutation score
  plus escaped defects. Gaming all three is roughly as much work as doing the job.
- **Never attach individual consequences to a diagnostic measure.** A phishing simulation
  used to discipline people produces staff who hide clicks.
- **Keep formative and summative separate**, in the sense of
  11. A measure used to improve should not also be used
  to judge.

## 2. Coverage read as verification

**What happens:** a measure of what the test touched is read as a measure of what the test
checked.

Software: 100% line coverage with no assertions. Manufacturing: 100% inspection where the
inspector only checks the label. Medicine: a full body scan that was never read by a
radiologist.

The general form: **contact is not examination.** The corrections are mutation testing in
software (04), blind sample insertion in
laboratories, and audit of the auditors elsewhere.

## 3. Base rate blindness

**What happens:** a positive result from an accurate test is read as evidence of the thing,
when the thing is rare enough that most positives are false. Fully worked in
09.

Software versions:

- An alert rule at 3 standard deviations, evaluated every minute across 500 metrics,
  produces a continuous stream of false alarms.
- A dependency scanner flagging 200 findings in a codebase with two real, reachable
  vulnerabilities.
- A fraud model applied to a stream where 0.1% of transactions are fraudulent.

The fix is never a better single test. It is a two-stage design: a sensitive first pass to
narrow the field, then a specific second pass on what survives.

## 4. Alarm fatigue

**What happens:** enough false positives arrive that people stop responding to any of them,
including true ones.

Hospital monitors that beep so often nurses silence them. Car dashboards with a permanent
warning light. A CI suite with 14% flakiness where the first response to red is to press
retry. A security dashboard with 4,000 open findings.

This is the direct human consequence of failure mode 3, and it is why the false positive
rate is a design parameter rather than a thing to minimise blindly. A test suite that is
always slightly wrong is worse than a smaller suite that is trusted.

## 5. The oracle drifts

**What happens:** the standard you are comparing against quietly becomes wrong, and the
test now enforces the error.

| Field | Version |
|---|---|
| Software | a snapshot test re-recorded whenever it fails, until it asserts the current behaviour whatever that is |
| Software | a regression baseline captured from a build that already had the bug |
| Finance | a backtest overfitted to one history, which was never the future |
| Laboratories | a reference standard past its calibration date |
| Any field | a specification that was updated while the tests were not |

The structural defence is the one metrology uses: the oracle needs its own provenance and
its own expiry. A recorded baseline should say when it was recorded, by whom, and on what
grounds it was believed correct.

## 6. Testing the sample you can reach

**What happens:** the sample that got tested differs systematically from the population you
care about, and nobody adjusts.

- **Survivorship bias**: backtesting a strategy on companies that still exist.
- **Convenience samples**: psychology results drawn overwhelmingly from Western,
  educated, industrialised, rich, democratic populations, then generalised.
- **Test data unlike production data**: 10,000 tidy seeded rows standing in for 40 million
  messy real ones. This is the single most common cause of "it worked in staging".
- **Device and browser matrices** built from the team's own laptops.
- **Clinical trials** historically under-enrolling women, older patients, and people with
  several conditions at once, which is exactly the population that will take the drug.

The correction is to state who is in the sample and who is not, which is the coverage claim
again.

## 7. Ritual compliance

**What happens:** the paperwork is performed and the check is not.

A checklist ticked without looking. A code review approved in nine seconds. A signed
inspection report for an inspection that did not happen. A disaster recovery test where
the restore was declared successful because the job exited zero and nobody opened the
database.

The tell is that the artefact exists and the finding rate is zero. **A control that never
finds anything is either unnecessary or not being performed**, and it is worth checking
which.

## 8. Testing after the decision

**What happens:** the test is run to justify a decision already taken, and a result that
contradicts it is explained away.

A security review scheduled the week before a launch that cannot move. A pilot programme
whose expansion was announced before the results came in. A/B tests re-run until one
version wins. HARKing in research, where the hypothesis is written after the results are
known.

The defence is commitment in advance: preregistration in science, a preregistered primary
metric in an A/B test, a stated go/no-go criterion before the pilot, an acceptance
criterion written before the build.

## 9. Verification without validation

**What happens:** the thing meets its specification and the specification was wrong.

This is the failure that testing is structurally worst at catching, because every test is
written against the same possibly wrong specification. It is why acceptance testing exists,
why HACCP separates validation from verification, and why user research is not optional.

The concrete tell: a feature that passes every test, ships, and is used by nobody.

## 10. Precision confused with accuracy

**What happens:** a number is reported to more decimal places than the method supports, and
the precision is read as confidence.

A load test reporting a p99 of 412.7ms from a three-minute run on a shared machine. A model
accuracy of 94.37% on a 300-item benchmark. A survey result of 61.2% from 400 respondents.

Every field that measures seriously reports uncertainty alongside the value. ISO/IEC 17025
requires laboratories to estimate and state measurement uncertainty. Software reports
benchmark numbers with no error bars almost universally.

## 11. The observed test differs from the real one

**What happens:** the subject knows it is being tested, so you measure the tested behaviour
rather than the real behaviour.

An announced fire drill measures whether the route works, not whether people use it. A
phishing simulation after an all-staff warning measures nothing. A performance test run
against a warm cache. An interview candidate who has seen the questions. A benchmark whose
test set leaked into the training data, which is the current version of this problem in
machine learning and is severe.

The defence is separation: keep an unseen holdout, do not announce, and rotate the material.

## 12. Absence of evidence read as evidence of absence

**What happens:** the tests pass, therefore the software works.

This is Dijkstra's point, made at the NATO conference in 1969: "Program testing can be used
to show the presence of bugs, but never to show their absence." It is quoted constantly and
acted on rarely.

It is also not a counsel of despair. It says a passing test suite supports one specific
claim: the behaviours it checked, on the inputs it tried, in the environment it ran, were
correct at that moment. That is a genuinely valuable claim. It is not the claim people make
on its behalf.

## The compressed version

| Failure | One-line check |
|---|---|
| Measure becomes target | is anyone's outcome attached to this number? |
| Coverage as verification | if the code were wrong, would anything fail? |
| Base rate blindness | how rare is the thing? what share of positives are real? |
| Alarm fatigue | what is the first thing a person does when this goes red? |
| Oracle drift | where did the expected value come from, and when? |
| Unrepresentative sample | who or what is not in the test? |
| Ritual compliance | when did this control last find something? |
| Testing after the decision | could a bad result still change the plan? |
| Verification without validation | who confirmed this was the right thing to build? |
| False precision | what is the uncertainty on that number? |
| Observed test | does the subject know, and does that change it? |
| Absence of evidence | what exactly did the passing result cover? |

## Sources

- [Campbell's law](https://en.wikipedia.org/wiki/Campbell%27s_law) and
  [Goodhart's law](https://psychsafety.com/goodharts-law-campbells-law-and-the-cobra-effect/)
- Dijkstra, E.W., NATO Software Engineering Techniques conference, Rome, October 1969
  (published April 1970); "Notes on Structured Programming" (EWD249), 1970
- [ISO/IEC 17025:2017](https://www.iso.org/standard/66912.html) on measurement uncertainty
- Open Science Collaboration, *Science*, 2015, on publication bias and HARKing.
  [Science](https://www.science.org/doi/10.1126/science.aac4716)

---

<!-- 11archive-source: 15-glossary.md -->

# Glossary

Terms used across this report, including the ones that mean different things in different
fields. Where a term has a field-specific meaning, the field is named.

## The frame

**Coverage claim.** What a test result covers, and what it does not. Used in this report as
one of the six parts of any test. Rarely written down in software; standard practice in
laboratory reporting.

**Oracle.** Whatever tells you the observed result was correct. An expected value, a
reference standard, a second implementation, a control group, or a human expert.

**Oracle problem.** The difficulty of getting an oracle for programs whose correct output
nobody can compute independently. Named by Weyuker in 1982.

**Subject, stimulus, threshold, decision.** The other four parts of a test, per
01.

## Errors and accuracy

**False positive.** The test says yes and the truth is no. Called producer's risk in
sampling, Type I error in statistics, a flaky failure in software.

**False negative.** The test says no and the truth is yes. Called consumer's risk in
sampling, Type II error in statistics, an escaped defect in software.

**Sensitivity.** Of the cases that are truly positive, the share the test catches.

**Specificity.** Of the cases that are truly negative, the share the test correctly clears.

**Positive predictive value (PPV).** Given a positive result, the probability the subject
really is positive. Depends on how common the condition is.

**Base rate fallacy.** Reading a positive result without accounting for how rare the thing
is. Causes most positives to be false when the thing is rare.

**Power.** The probability a study detects a real effect of a given size. One minus the
false negative rate.

**Accuracy versus precision.** Accuracy is closeness to the true value. Precision is
consistency between repeated measurements. A test can be precise and wrong.

**Measurement uncertainty.** The range within which the true value is expected to lie.
Required in accredited laboratory reporting.

## Software levels and kinds

**Unit test.** One small piece, isolated, dependencies replaced.

**Integration test.** Two or more real parts running together.

**Contract test.** A recorded agreement between a service and its caller, verified by each
side separately without running both together.

**End-to-end test.** The whole system, driven through its real interface.

**Smoke test.** A very small set of checks that answers whether a build is worth testing
further. In product research, the same phrase means a fake-door demand test.

**Regression test.** Any test re-run to check a change did not break working behaviour.

**Confirmation test.** Re-running the specific test that exposed a defect, after the fix.

**Hermetic test.** A test that depends on nothing outside its own declared inputs.

**Flaky test.** A test that passes and fails on unchanged code.

## Techniques

**Equivalence partitioning.** Group inputs that should be handled identically, test one of
each.

**Boundary value analysis.** Test the values either side of every limit.

**Pairwise testing.** Choose test cases so that every pair of setting values appears at
least once.

**MC/DC, modified condition/decision coverage.** Each condition in a decision is shown by
execution to independently change the outcome. Required for DO-178C Level A software.

**Property-based testing.** State a rule the output must always obey; a tool generates
inputs looking for a violation, then shrinks any failure to its simplest form.

**Metamorphic testing.** Test the relationship between multiple runs rather than the value
of any one, for programs with no known correct answer.

**Mutation testing.** Introduce small changes to the code and measure how many your test
suite catches. The mutation score is the share killed.

**Fuzzing.** Feed malformed or generated input and watch for crashes. Coverage-guided
fuzzing keeps inputs that reach new code and mutates them further.

**Differential testing.** Run two independent implementations on the same input and compare.

**Snapshot, golden, or approval testing.** Compare output against a committed recording of
previous output.

**Characterization testing.** Snapshot testing used to fence in the behaviour of legacy
code before changing it.

**Exploratory testing.** Simultaneous learning, test design and execution, guided by a
charter rather than a script.

**Test double.** Any stand-in for a real dependency. Dummy, stub, spy, mock, or fake.

## Practices

**TDD, BDD, ATDD.** Writing the test, the behaviour description, or the acceptance
criteria before the code.

**Shift left.** Move testing earlier in development.

**Shift right.** Test in production, using canaries, flags, dark launching and monitoring.

**Canary release.** Send a small share of traffic to the new version and compare.

**Dark launching.** Run new code on real traffic without using its results.

**Chaos engineering.** Deliberately injecting failure into a production system to test a
hypothesis about its steady state, with the blast radius bounded.

**Blast radius.** How much harm an experiment can cause. Bounded deliberately in chaos
engineering, dose escalation, and pilot programmes alike.

## Verification, validation, and quality

**Verification.** Did we build the thing right, against its specification.

**Validation.** Did we build the right thing, against the actual need. In food safety,
specifically: evidence that the control measures are scientifically capable of controlling
the hazard.

**IV&V, independent verification and validation.** Verification performed by people
independent of the developers.

**Formative assessment.** A test whose purpose is to change what happens next.

**Summative assessment.** A test whose purpose is to certify a result.

**Reliability (psychometrics).** The test gives a consistent answer. Distinct from
reliability in engineering, which means the system keeps working.

**Validity (psychometrics).** The test measures the thing it claims to measure.

## Sampling and quality control

**Acceptance sampling.** Deciding whether to accept a batch by inspecting a sample.

**AQL, acceptance quality limit.** The defect rate that will routinely be accepted.

**Producer's risk / consumer's risk.** The probability of rejecting a good lot / accepting
a bad one.

**Statistical process control (SPC).** Plotting a process measurement over time against
limits derived from its own variation, to separate normal noise from a real shift.

**Materiality.** In auditing, the threshold below which an error is deemed not to change
the conclusion.

## Physical and reliability testing

**Destructive / non-destructive testing.** Whether the test damages the item.

**NDT methods.** Visual (VT), liquid penetrant (PT), magnetic particle (MT), eddy current
(ET), ultrasonic (UT), radiographic (RT). The first three are surface methods; the last two
are volumetric.

**HALT.** Highly accelerated life testing. Stress a design past failure to learn how it
fails. No survivors, by design.

**HASS.** Highly accelerated stress screening. Apply HALT-derived stresses to production
units to catch manufacturing defects.

**ESS, burn-in.** Milder screening of every unit to remove early-life failures.

**FAT / SAT.** Factory acceptance test at the manufacturer, site acceptance test at the
final installation.

**Hydrostatic test.** Pressurise with water above working pressure and watch for leaks.
Water is used because it barely compresses, so a failure releases far less energy.

**Proof load / proof pressure.** Testing at a defined multiple of the rated load, commonly
1.5 times, to show margin.

**Metrological traceability.** An unbroken documented chain of calibrations linking a
measurement to a national or international standard.

**Proficiency testing.** An external scheme sends a laboratory samples of unknown value and
compares its answers against other laboratories.

## Experiments and markets

**RCT, randomised controlled trial.** Random assignment to treatment or control, ideally
blinded.

**A/B test.** An RCT run on live traffic.

**Multi-armed bandit.** An experiment that shifts traffic toward the better-performing arm
while running.

**Holdout group.** Users permanently kept on the old experience, to measure the cumulative
effect of many changes.

**Fake door test.** Offering something that does not exist yet, to measure real intent.

**Wizard of Oz test.** A real interface with humans doing the work behind it.

**Backtesting.** Running a strategy or model against historical data.

**Stress testing (finance).** Projecting an institution's position through a severe
hypothetical scenario defined by a regulator.

**Preregistration.** Publishing the hypothesis, sample size and analysis plan before
collecting data.

**P-hacking.** Analysing many ways and reporting the one that crosses the significance
threshold.

**HARKing.** Hypothesising after the results are known, then presenting it as a prediction.

## Laws and effects

**Campbell's law.** The more a quantitative social indicator is used for decision-making,
the more it will be corrupted and the more it will distort the process it monitors.

**Goodhart's law.** When a measure becomes a target, it ceases to be a good measure.

**Coupling effect.** The conjecture behind mutation testing: tests that catch simple faults
also tend to catch complex ones.

**Daubert factors.** The five considerations a US federal judge weighs when deciding
whether scientific evidence is admissible, including the known error rate of the method.

---

<!-- 11archive-source: 16-methodology-and-sources.md -->

# Methodology and sources

## What this report is

A survey of testing as a general practice, written in two halves. The first half covers
software testing in depth. The second half covers testing in fields that do not write
code, and the closing sections map the two onto each other.

The organising claim, developed in 01 and applied throughout, is
that every test in every field has the same six parts, and that a field's characteristic
failure is whichever part it habitually leaves unstated.

## How it was built

**Evidence boundary.** Public documentation, standards bodies' own descriptions, published
papers, regulator publications, and engineering blogs, read on 16 and 17 August 2026. No
paywalled standards texts were purchased, so where a standard's contents are described, the
description comes from the publishing body's public abstract, a freely available part, or a
technical summary that cites it. Those cases are marked in the section that uses them.

**No tools were installed or exercised.** Every claim about how a tool behaves comes from
its documentation or from published measurement, not from running it. This is the largest
limitation of the report.

**One original calculation.** The diagnostic table in 09 was
recomputed from the stated sensitivity, specificity and prevalence rather than copied. The
working is shown in full so a reader can check it. Result: positive predictive value 7.9%,
which matches the 8% figure the source states.

**Everything else is synthesis.** The translation table and the five proposals in
13, the six-part frame in 01, and the
failure taxonomy in 14 are original to this report. They are
arguments, not measurements, and should be read as such.

## What is covered and what is not

**Covered:** software testing by scope, by technique, by generation method, and by quality
attribute; testing practice and workflow; regulated and safety-critical testing; testing in
statistics and experimental science, medicine and diagnostics, materials and manufacturing,
psychometrics and education, organisational and security exercises, and product and
financial testing; the failure modes shared across all of them.

**Not covered:**

- Tool comparisons and recommendations. The report names tools only where a tool is the
  canonical example of a technique.
- Any quantitative claim about which practices produce better outcomes. The empirical
  software engineering literature on this is weaker than its citation frequency suggests,
  which is itself covered in 06.
- Testing in fields not listed above, including agriculture beyond a single example,
  telecommunications conformance, and materials characterisation at research depth.
- Test management tooling, staffing models, and outsourcing.

**Known conflicts in the evidence**, all noted where they appear:

- Accessibility automation coverage is reported as 57%, 20% to 40%, 29%, and 22.6% by
  different sources. These measure different denominators; see
  05.
- The 2025 Federal Reserve stress test is described by secondary sources as covering both
  22 and 31 banks. The Federal Reserve's own publication says 22, and that is the figure
  used.
- The "100x cost of a late defect" curve is widely cited and has no traceable dataset; see
  06.
- Clinical trial participant counts vary between sources because they are typical ranges,
  not rules. They are presented as ranges.

## Sources

### Software testing standards and vocabulary

- [ISO/IEC/IEEE 29119 series overview](https://softwaretestingstandard.org/), parts 1 to 6,
  11 and 13
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html)
- [ISO/IEC 25010:2023 product quality model](https://www.iso.org/standard/78176.html);
  [summary of the 2023 revision](https://www.sonarsource.com/resources/library/iso-iec-25010-explained/)
- [ISTQB Certified Tester Foundation Level v4.0](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/);
  [test techniques overview](https://astqb.org/4-1-test-techniques-overview/)

### Software testing research

- Weyuker, E. "On Testing Non-Testable Programs", *The Computer Journal* 25(4), 1982
- Barr, Harman, McMinn, Shahbaz, Yoo. ["The Oracle Problem in Software Testing: A Survey"](https://dl.acm.org/doi/10.1109/TSE.2014.2372785),
  *IEEE TSE* 41(5), 2015
- DeMillo, Lipton, Sayward. "Hints on Test Data Selection: Help for the Practicing
  Programmer", *Computer* 11(4), 1978
- [Claessen, K. and Hughes, J. "QuickCheck"](https://alastairreid.github.io/RelatedWork/papers/claessen:icfp:2000/),
  ICFP 2000
- Chen, Cheung, Yiu. "Metamorphic testing: a new approach for generating next test cases",
  HKUST-CS98-01, 1998; [survey](https://dl.acm.org/doi/10.1145/3143561)
- Ding, Z.Y. and Le Goues, C. ["An Empirical Study of OSS-Fuzz Bugs"](https://squareslab.github.io/materials/DingOSSFuzz21.pdf),
  MSR 2021
- Dijkstra, E.W. NATO Software Engineering Techniques conference, Rome, October 1969
  (published April 1970); "Notes on Structured Programming" (EWD249), 1970.
  [Wikiquote, with citations](https://en.wikiquote.org/wiki/Edsger_W._Dijkstra)

### Software testing practice

- [Google Testing Blog: Where do our flaky tests come from?](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html)
- [Google Testing Blog: Flaky Tests at Google and How We Mitigate Them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- Memon, Gao et al. [Taming Google-Scale Continuous Testing](https://research.google.com/pubs/archive/45861.pdf)
- [OSS-Fuzz](https://github.com/google/oss-fuzz), figures as stated in the README, May 2025
- Fowler, M. ["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html);
  Meszaros, G. *xUnit Test Patterns*, 2007; [xunitpatterns.com](http://xunitpatterns.com/Mocks,%20Fakes,%20Stubs%20and%20Dummies.html)
- [web.dev: Pyramid or crab, find a testing strategy that fits](https://web.dev/articles/ta-strategies)
- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Pact documentation](https://docs.pact.io/)
- Bossavit, L. [*The Leprechauns of Software Engineering*](https://books.google.com/books/about/The_Leprechauns_of_Software_Engineering.html?id=6LcpBgAAQBAJ)
- [DORA change failure rate benchmarks, 2025](https://www.opstrails.dev/insights/change-failure-rate-dora-metric)
- Accessibility automation coverage:
  [TestParty](https://testparty.ai/blog/automated-accessibility-testing-guide),
  [QA Wolf](https://www.qawolf.com/blog/automated-accessibility-testing-explained)

### Safety-critical and regulated

- [LDRA on MC/DC and DO-178C](https://ldra.com/capabilities/mc-dc/);
  [modified condition/decision coverage](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)
- [LDRA on ISO 26262 and ASILs](https://ldra.com/iso-26262/);
  [Automotive Safety Integrity Level](https://en.wikipedia.org/wiki/Automotive_Safety_Integrity_Level)
- [IEC 62304 safety classifications](https://www.greenlight.guru/glossary/iec-62304)
- [CISA: AI red teaming, applying software TEVV for AI evaluations](https://www.cisa.gov/news-events/news/ai-red-teaming-applying-software-tevv-ai-evaluations)
- [NIST SP 800-115, and red/blue/purple teams](https://www.compassitc.com/blog/penetration-testing-understanding-red-blue-purple-teams)

### Science and statistics

- [ASA Statement on Statistical Significance and P-Values, 2016](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf);
  [six principles as quoted](https://mostlyeconomics.wordpress.com/2016/03/17/six-principles-for-the-use-and-interpretation-of-p-values/)
- Open Science Collaboration. ["Estimating the reproducibility of psychological science"](https://www.science.org/doi/10.1126/science.aac4716),
  *Science*, 2015; [full text PDF](https://discovery.dundee.ac.uk/ws/files/7385883/RPP_SCIENCE_2015.pdf)
- [Nobel Prize in Economic Sciences 2019, press release](https://www.nobelprize.org/prizes/economic-sciences/2019/press-release/);
  [CEPR on what randomisation can and cannot do](https://cepr.org/voxeu/columns/what-randomisation-can-and-cannot-do-2019-nobel-prize)

### Medicine and laboratories

- [FDA, Step 3: Clinical Research](https://www.fda.gov/patients/drug-development-process/step-3-clinical-research);
  phase ranges via [Cancer Therapy Advisor](https://www.cancertherapyadvisor.com/factsheets/clinical-trial-phases/)
  and [BrightFocus](https://www.brightfocus.org/about/clinical-trials/phases-of-clinical-trials/)
- [NY State Department of Health, disease screening](https://www.health.ny.gov/diseases/chronic/discreen.htm)
- [ISO/IEC 17025:2017](https://www.iso.org/standard/66912.html);
  [PECB whitepaper](https://pecb.com/en/whitepaper/iso-iec-170252017-general-requirements-for-the-competence-of-testing-and-calibration-laboratories)
- National Research Council. [*The Polygraph and Lie Detection*](https://www.nationalacademies.org/read/10420/chapter/10), 2003

### Materials, manufacturing, and products

- [ASNT: what is nondestructive testing](https://www.asnt.org/what-is-nondestructive-testing);
  [six most common NDT methods](https://www.vareximaging.com/blogs/what-are-the-six-most-common-ndt-methods/)
- [ISO 2859-1 inspection levels](https://qualityinspection.org/inspection-level/);
  [ISO 2859-1 versus ANSI/ASQ Z1.4](https://ecqa.com/iso-2859-1-vs-ansi-z1-4/);
  [history of ANSI/ASQ Z1.4](https://www.qualitymag.com/articles/98097-brief-history-of-ansi-asq-z14)
- [Tektronix: Fundamentals of HALT/HASS Testing](https://download.tek.com/document/HALT_HASS_WP.pdf);
  [Accendo Reliability: ESS and HASS](https://accendoreliability.com/ess-hass/)
- [PQE: FAT and SAT](https://blog.pqegroup.com/commissioning-qualification/fat-and-sat);
  [hydrostatic, proof and burst testing](https://sarum-hydraulics.co.uk/white-paper/hydrostatic-pressure-testing/hydrostatic-proof-burst-fatigue-test-explainer/)
- [Euro NCAP: the stars explained](https://www.euroncap.com/how-to-read-the-stars/);
  [2026 protocol changes](https://www.euroncap.com/press-media/euro-ncap-announces-2026-protocol-changes-to-tackle-modern-driving-risks/)
- [FDA HACCP principles and application guidelines](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines);
  [ISO 4120 triangle test](https://www.iso.org/standard/33495.html)

### People, organisations, markets

- [Types of reliability](https://conjointly.com/kb/types-of-reliability/);
  [reliability and validity of measurement](https://opentext.wsu.edu/carriecuttler/chapter/reliability-and-validity-of-measurement/1000/)
- [Yale Poorvu Center: formative and summative assessment](https://poorvucenter.yale.edu/teaching/teaching-resource-library/formative-summative-assessments)
- [Campbell's law](https://en.wikipedia.org/wiki/Campbell%27s_law);
  [Goodhart's law, Campbell's law and the cobra effect](https://psychsafety.com/goodharts-law-campbells-law-and-the-cobra-effect/)
- [The five Daubert factors](https://bridgelegal.org/understanding-five-daubert-factors-expert-testimony/)
- Kohavi, R. et al. [Online Controlled Experiments at Large Scale](https://exp-platform.com/Documents/2015-08OnlineControlledExperimentsKDDKeynoteNR.pdf);
  [Online Experimentation at Microsoft](http://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf)
- [Federal Reserve, 2025 Dodd-Frank Act Stress Test Results](https://www.federalreserve.gov/publications/2025-june-dodd-frank-act-stress-test-results.htm)
- [Bank Policy Institute, DFAST 2025 scenarios](https://bpi.com/deep-dive-dfast-2025-stress-test-scenarios/)
