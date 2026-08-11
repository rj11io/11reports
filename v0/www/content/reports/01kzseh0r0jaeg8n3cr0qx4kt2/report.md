<!-- 11archive-source: README.md -->

# AI Benchmarking: A Working Reference

- **Created:** 2026-08-11
- **Audience:** anyone who publishes, buys, or argues about AI model scores. Engineers building an
  evaluation suite for their own product, analysts reading a leaderboard, and reviewers checking
  someone else's claim.
- **Objective:** explain what an AI benchmark can and cannot tell you, and set out the practices
  that make a score trustworthy.
- **Scope:** benchmarking of AI models and AI agents, mostly language and multimodal models from
  2018 to August 2026. Covers benchmark design, statistics, contamination, judging, agent
  evaluation, safety testing, standards, and how to build an in-house suite.
- **Not in scope:** hardware and systems benchmarking beyond one comparison with MLPerf, training
  methods, and any ranking of current models. Model scores move every few weeks, so this report
  describes structure rather than standings.
- **Evidence boundary:** public papers, benchmark documentation, standards, regulator text, and
  vendor methodology pages, all read on 2026-08-11. Every material claim has a source in
  12-methodology-and-sources.md.

## A benchmark, in one sentence

A **benchmark** is a fixed set of tasks plus a fixed way of scoring them, used to compare
systems. An **eval** (short for evaluation) is a single run of such a set against one system.

## How to read this bundle

Start with the brief. Then jump to whichever section matches your job.

| File | What it covers | Read it if |
| --- | --- | --- |
| 00-executive-brief.md | The main result, the ten rules, a 60-second score check | You have five minutes |
| 01-what-a-benchmark-measures.md | The measurement chain, construct validity, the eval taxonomy | You are designing or reviewing a benchmark |
| 02-benchmark-catalog.md | 37 benchmarks and 10 suites, with format, size, grader, and status | You need to pick or interpret a specific benchmark |
| 03-statistics-and-uncertainty.md | Error bars, clustering, resampling, pass@k, power | You report or compare numbers |
| 04-contamination-and-saturation.md | Test data leaking into training, and benchmarks running out of headroom | You wonder whether a score is real |
| 05-judges-and-human-evaluation.md | Model graders, human raters, preference arenas | Your task has no single right answer |
| 06-agentic-evaluation.md | Multi-step tasks, tool use, cost control, reliability | You evaluate agents |
| 07-safety-and-frontier-risk-evals.md | Dangerous-capability testing, red-teaming, evaluation awareness | You work on safety or compliance |
| 08-standards-and-regulation.md | EU AI Act, NIST, ISO, frontier safety policies, MLPerf governance | You need to satisfy an external requirement |
| 09-build-your-own-eval-suite.md | A ten-step build, graders, CI, error analysis | You are starting from nothing |
| 10-anti-patterns-and-reading-a-leaderboard.md | 28 failure modes with symptoms and fixes | You are auditing a claim |
| 11-glossary.md | 84 terms defined | A word is unfamiliar |
| 12-methodology-and-sources.md | How this report was built, 75 sources, limitations | You want to check the work |

## Artifacts

| Artifact | Purpose |
| --- | --- |
| `00` to `12` Markdown files | The portable, readable report |
| `data.json` | The machine-readable evidence model: benchmarks, metrics, practices, failure modes, standards, sources |
| `report.html` | One self-contained page with navigation, sortable tables, diagrams, and a print layout |
| `build.mjs` | Deterministic generator: Markdown in, `report.html` and `data.json` out. It also recomputes the worked arithmetic in section 03 and fails the build if a number in the prose is wrong |
| `verify.mjs` | The verification gate: 44 checks across structural pins, cross-format parity, data agreement, determinism, and hygiene |

`report.html` is generated from the same Markdown files you can read directly, so the two never
disagree on facts. The HTML adds navigation and interaction, never extra content.

## Rebuilding the HTML

The generator needs the house report styleguide for its embedded fonts and design tokens. Point
`ELEVEN_AGI_REPO` at a local 11agi checkout, then:

```bash
node 2026/rnd/ai-benchmarking-best-prac/build.mjs
```

The build prints a JSON summary of what it emitted. Running it twice on unchanged input produces
a byte-identical file apart from the generation timestamp. Then run the gate:

```bash
node 2026/rnd/ai-benchmarking-best-prac/verify.mjs
```

Publishing note: `build.mjs` and `verify.mjs` are development tools, not report artifacts. The
11reports publisher accepts only Markdown, one HTML file, and `data.json`, so publish from a staged
copy that leaves the two scripts behind.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The main result

A benchmark score is not a measurement until three things travel with it: what the benchmark was
built to measure, how the number was produced, and how wide the uncertainty around it is. Most
published scores carry none of the three, and the gap is not a detail. It routinely reverses
conclusions.

Three concrete demonstrations, each from a published source:

**Uncertainty reverses a model choice.** In the worked example that opens Anthropic's statistical
treatment of evals, one model leads on one benchmark and trails on two others. A reader picks the
second model. Once the differences are tested properly, using per-question paired differences and
standard errors adjusted for questions that arrive in groups, only the first benchmark's gap
survives. The other two are noise. The careful reading picks the opposite model
([Miller 2024](https://arxiv.org/abs/2411.00640)).

**The scoring harness reverses a ranking.** Formatting choices that a human would call
meaningless, such as which separator sits between a question and its answer, moved accuracy by up
to 76 points on one open model, and reordered models against each other
([Sclar et al. 2024](https://arxiv.org/abs/2310.11324)).

**The grader inflates the score.** An audit of ten agent benchmarks found evaluation designs that
overstated performance by up to 100% in relative terms. One benchmark's checker counted an empty
response as a success. Another's tests were too thin to catch a wrong patch
([Zhu et al. 2025](https://arxiv.org/abs/2507.02825)).

None of these are exotic. They are the normal condition of published AI benchmarking.

## What follows for you

- **If you publish scores:** report standard errors, say how many times you sampled each
  question, publish your exact prompts and scoring code, and never compare a number you produced
  against a number someone else produced with a different harness.
- **If you read scores:** treat any leaderboard gap smaller than a few points as unresolved
  unless the page shows an interval. Check whether the test set is public. If it is, the score
  may partly measure memorisation.
- **If you buy models:** build a small private eval on your own task distribution. Twenty to
  fifty real cases beat any public benchmark for a purchase decision, because a public benchmark
  measures a different task than yours.
- **If you build benchmarks:** decide first what you claim to measure, then design tasks that are
  solvable only by the thing you claim to measure. Hold back a private split. Plan the sample
  size before you commission the questions.

## The ten rules

Each rule links to the section that argues it.

| # | Rule | Why it matters | Section |
| --- | --- | --- | --- |
| 1 | Name the construct before the task | A benchmark that claims to measure "reasoning" but scores multiple-choice recall will be read as the former and used as the former | 01 |
| 2 | Publish the whole measurement chain | Prompt, temperature, sampling count, answer extraction, and scoring code each change the number | 01, 03 |
| 3 | Put an error bar on every score | Without one, a reader cannot tell a real gain from run-to-run variation | 03 |
| 4 | Compare models per question, not per average | Paired differences are free precision, roughly a third less variance at a typical correlation | 03 |
| 5 | Assume the public test set leaked | Then design around it: private splits, fresh items, and dated problems | 04 |
| 6 | Retire a benchmark when it saturates | A score of 96% with a 6% label-error rate measures the labels, not the model | 04 |
| 7 | Calibrate every automated judge against humans | A model grader has known, measurable biases; agreement with experts is the only defence | 05 |
| 8 | Report cost and reliability beside accuracy | An agent that wins by calling the model 50 times is not better, it is more expensive | 06 |
| 9 | Verify the grader before trusting the task | Most agent-benchmark inflation comes from the checker, not the tasks | 06 |
| 10 | Write down what the benchmark cannot tell you | The limitation section is the part a decision-maker needs and the part usually missing | 10 |

## Reading a score in 60 seconds

Nine questions, in the order that kills a bad number fastest.

| Order | Question | Bad answer |
| --- | --- | --- |
| 1 | What exactly is the task, in one sentence? | The page only names a capability, such as "reasoning" |
| 2 | How many items? | Fewer than a few hundred, with no interval reported |
| 3 | Is there an error bar or confidence interval? | No |
| 4 | Is the test set public? | Yes, and no fresh or private split exists |
| 5 | Who grades, and how? | A model judge with no reported agreement against humans |
| 6 | How many samples per item, at what temperature? | Not stated |
| 7 | Was the harness the same for every model compared? | Numbers copied from different papers into one table |
| 8 | What does it cost per task? | Not reported, on an agent benchmark |
| 9 | Who funded and who had early access? | Undisclosed, or the top-scoring lab also paid for it |

Any single bad answer is a reason to widen your uncertainty, not to discard the score. Four or
more, and the number carries no decision weight.

## What changed between 2024 and 2026

| Shift | Evidence |
| --- | --- |
| Static knowledge tests stopped discriminating | The Hugging Face Open LLM Leaderboard retired its first suite in June 2024 because frontier models had topped it out, then archived the replacement too |
| Benchmarks started holding back private splits | FrontierMath keeps its full set private and publishes 12 sample problems; ARC-AGI keeps a private evaluation set |
| Agent evaluation became the frontier, and the harness became the bottleneck | Princeton's Holistic Agent Leaderboard ran 21,730 agent attempts across 9 models and 9 benchmarks for about $40,000 and published every log |
| Cost entered the score | Artificial Analysis publishes cost and latency per task beside its index; the agent literature now argues for accuracy-versus-cost curves rather than single points |
| Benchmark quality itself became a research subject | BetterBench scored 24 benchmarks against 46 lifecycle criteria; the Agentic Benchmark Checklist audited ten agent benchmarks and found validity failures in all of them |
| Models began recognising that they are being tested | Frontier models sometimes state in their own reasoning that a scenario looks like an evaluation, which weakens any behavioural test that assumes the model does not know |

## The one-line version

Treat an eval as an experiment, not a contest. Everything else in this report follows from that.

---

<!-- 11archive-source: 01-what-a-benchmark-measures.md -->

# What a benchmark measures

## The measurement chain

A score is the last link in a chain. Each link is a decision someone made, and each decision can
change the number. If you cannot see a link, you cannot trust the score.

Think of it like a bathroom scale. The reading depends on the spring, where the scale sits, and
whether you are holding a bag. A benchmark has eight such dependencies.

<!-- figure: measurement-chain -->

| # | Link | The decision made here | How it goes wrong |
| --- | --- | --- | --- |
| 1 | Construct | What ability are we claiming to measure? | Named too broadly, for example "reasoning", so any task counts as evidence |
| 2 | Task | What concrete work stands in for that ability? | The task is solvable by a shortcut that does not need the ability |
| 3 | Items | Which specific questions, and how many? | Too few to detect the difference you care about; labels are wrong |
| 4 | Protocol | Prompt, examples shown, temperature, samples per item, tools allowed | Undisclosed, so nobody can reproduce or compare |
| 5 | Extraction | How do we pull an answer out of free text? | A correct answer in the wrong format is scored wrong |
| 6 | Grader | Who or what decides right from wrong? | An automated checker accepts a wrong answer, or rejects a right one |
| 7 | Aggregation | How do item scores become one number? | Averaging across unlike groups, or averaging benchmarks with different chance baselines |
| 8 | Claim | What sentence do we write next to the number? | The sentence describes the construct, while the number describes the task |

Two rules follow.

**Every link needs to be published.** "Model X scores 88.4% on Y" is not reproducible. "Model X
scores 88.4% (standard error 1.1) on Y, zero-shot chain-of-thought, empty system prompt, default
temperature, 8 samples per question, answers extracted by the published regular expression, code
at this commit" is.

**The claim must match the task, not the construct.** Epoch AI runs GPQA Diamond and reports it as
a graduate-level science question benchmark, not as a measure of scientific ability
([Epoch AI benchmarking methodology](https://epoch.ai/benchmarks/about)). That restraint is the
practice.

## Construct validity

**Construct validity** means the test measures the thing it claims to measure. The term comes from
psychometrics, the study of measuring human abilities, and it is the single most useful borrowed
idea in AI evaluation.

The failure is easy to picture. A driving test held entirely in an empty car park measures parking.
Call it a driving test and people will licence drivers who have never met traffic.

Raji and colleagues made the strong version of this argument about AI benchmarks that present
themselves as general. Framing a dataset as general purpose, they wrote, misguides task design,
hides the biases and subjective judgements baked into the data, and enables misuse through false
performance claims ([Raji et al. 2021](https://arxiv.org/abs/2111.15366)). Their targets were
ImageNet and GLUE, but the argument transfers directly to any benchmark whose name contains the
word "general", "massive", or "universal".

### Four validity questions to ask of any benchmark

| Question | Name in the literature | Concrete test |
| --- | --- | --- |
| Does the task need the ability, and only that ability? | Task validity | Can a shortcut solve it? Can a domain expert solve it without the ability? |
| Does the scoring correctly separate success from failure? | Outcome validity | Feed the grader a known-wrong solution. Does it reject it? Feed it a known-right one in an unusual style. Does it accept it? |
| Do the items cover the ability's range? | Content validity | Which subskills, domains, difficulty levels, and languages are absent? |
| Does the score predict the behaviour you care about downstream? | Criterion validity | Does a 5-point benchmark gain show up in your product metric? |

The first two names come from the Agentic Benchmark Checklist, which splits benchmark validity
exactly this way and supplies 10 criteria for task validity and 20 for outcome validity
([Zhu et al. 2025](https://arxiv.org/abs/2507.02825)).

### The benchmark lottery

Even with valid benchmarks, the *choice* of benchmark decides the winner. Dehghani and colleagues
called this the benchmark lottery: which method looks best depends heavily on which tasks the
community happens to have standardised on, and in some fields researchers can effectively pick
tasks that suit their method ([Dehghani et al. 2021](https://arxiv.org/abs/2107.07002)).

The practical consequence is not that comparison is hopeless. It is that a single benchmark cannot
carry a general claim, and a suite chosen by the person making the claim is weak evidence. Ask who
chose the suite.

### How well does the field do on this?

Poorly, and it has been measured. BetterBench assessed 24 widely used AI benchmarks against 46
best practices covering the whole benchmark lifecycle, from design through documentation to
retirement. Most of the benchmarks did not report whether their results were statistically
significant, and most did not let their results be replicated easily
([Reuel et al. 2024](https://arxiv.org/abs/2411.12990)). The per-benchmark scores are published in
a public repository at betterbench.stanford.edu.

## The taxonomy: what kind of eval is this?

"Eval" covers at least six different activities with different rules. Mixing them up is a common
source of bad argument.

| Kind | Question it answers | Typical form | Score shape |
| --- | --- | --- | --- |
| Capability benchmark | Can the model do X at all? | Fixed items, automatic grading | Accuracy, pass rate |
| Behaviour or alignment eval | Does the model behave a certain way when it could choose not to? | Constructed scenarios, judged transcripts | Rate of the behaviour |
| Preference evaluation | Which output do people prefer? | Head-to-head votes | Win rate, or a fitted rating |
| Agentic or task evaluation | Can the system finish a real multi-step job? | Sandbox environment, outcome check | Success rate, cost, reliability |
| Red-teaming | Can a determined person make it fail? | Open-ended adversarial probing | Findings, not a score |
| Production monitoring | Is it still working on live traffic? | Sampled real traces, ongoing review | Trend, incident counts |

Four distinctions matter more than the labels.

**Capability versus propensity.** A capability eval asks whether the model *can*. A propensity or
behaviour eval asks whether it *will*. Safety work needs both, and they fail differently: a
capability eval is broken by a weak prompt or scaffold, which makes the model look less able than
it is, while a propensity eval is broken by the model noticing that it is being tested. See
07-safety-and-frontier-risk-evals.md.

**Model evaluation versus product evaluation.** Kapoor and colleagues draw this line sharply:
model developers and downstream developers have different benchmarking needs, and a benchmark
built for the first can mislead the second
([Kapoor et al. 2024](https://arxiv.org/abs/2407.01502)). A model developer wants a hard, general,
contamination-resistant benchmark. A product team wants their own traffic, their own failure
modes, and their own cost ceiling.

**Log-probability scoring versus generation.** For a multiple-choice question you can either read
the model's probability for each option token, or make it write an answer and parse it. These give
different numbers for the same model on the same items, and neither is wrong. They are different
measurements. Comparing across the two is the single most common invalid comparison in published
tables ([Biderman et al. 2024](https://arxiv.org/abs/2405.14782)).

**Static versus live.** A static benchmark is a fixed file. A live benchmark refreshes items over
time, which defends against contamination but destroys comparability across dates unless each
version is pinned and named.

## What a benchmark can and cannot support

Claims come in strengths. Match the claim to the evidence.

| Claim | Supported by | Not supported by |
| --- | --- | --- |
| "Scores 71.2% on this benchmark, standard error 1.4" | One properly reported run | Nothing else needed |
| "Better than model B on this benchmark" | Paired per-question comparison with an interval that excludes zero | Two averages from different papers |
| "Better at coding" | A suite of coding benchmarks, held-out items, and cost disclosed | One benchmark |
| "Can do the work of a junior engineer" | Real tasks, human baselines, expert graders, error analysis | Any accuracy number |
| "Safe to deploy" | Task evals plus red-teaming plus monitoring plus a rollback plan | Any benchmark, ever |

## The minimum a benchmark should document

Adapted from the BetterBench minimum checklist ([Reuel et al. 2024](https://arxiv.org/abs/2411.12990)),
the reproducibility lessons from the lm-evaluation-harness maintainers
([Biderman et al. 2024](https://arxiv.org/abs/2405.14782)), and model-card practice
([Mitchell et al. 2019](https://arxiv.org/abs/1810.03993)).

| Field | Why |
| --- | --- |
| The construct, stated in one sentence, plus what it excludes | Stops the score being read as broader than it is |
| Who built the items, and their domain expertise | Expert-written items behave differently from crowd-written ones |
| Item count, split sizes, and whether any split is private | Sets the precision ceiling and the contamination exposure |
| The exact prompt template, including separators and system prompt | The largest reproducibility lever, see 03 |
| Sampling settings and samples per item | Determines the noise floor |
| Answer extraction rule | Decides how many right answers get scored wrong |
| Grader definition, and for model graders the agreement with humans | The grader is a measuring instrument and needs its own calibration |
| Aggregation formula, including any normalisation and its chance baseline | Two benchmarks with different chance levels cannot be averaged raw |
| Known label errors and the process for fixing them | Sets the ceiling above which a score is meaningless |
| Contamination stance: canary string, dated items, private split, or none | Tells a reader how much of the score could be memorisation |
| Licence, version identifier, and citation | Makes the result referenceable a year later |
| Funding and any early access granted to model providers | A conflict of interest a reader cannot infer |
| Retirement criteria | Nobody retires a benchmark without a pre-agreed trigger |

---

<!-- 11archive-source: 02-benchmark-catalog.md -->

# The benchmark catalog

## How to read this catalog

Thirty-seven benchmarks, plus ten suites and leaderboards, that a reader is likely to meet in a
model announcement or a procurement document. The point is not to rank them. It is to let you look
up what a named benchmark actually contains, so you can judge what its score can support.

**Columns.** *Year* is the year of the paper or release announcement cited in
12-methodology-and-sources.md, which is sometimes later than
first public use. *Items* is the number of scored units, questions for a quiz, tasks for an agent
environment. *Grader* is what decides right from wrong. *Held out* says whether any part of the
test set is kept private from model providers. *Status* is one of:

| Status | Meaning |
| --- | --- |
| live | In active use and not yet topped out |
| saturated | Frontier scores sit near the ceiling, so the benchmark no longer separates models |
| superseded | A corrected or harder replacement exists and should be used instead |
| retired | The maintainers stopped running it |

**Evidence note.** Item counts come from each benchmark's own paper or documentation. Where this
report could not confirm a count against a primary source, the cell reads `n/v`, meaning not
verified, rather than a guessed number. Do not read `n/v` as zero or small. The unverified counts
are listed in 12-methodology-and-sources.md.

## Knowledge and reasoning quizzes

| Benchmark | Year | Items | Format | Grader | Held out | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MMLU | 2020 | 15,908 across 57 subjects | 4-option multiple choice | Exact match | No | saturated | An audit found errors in 6.49% of questions, and 57% of the analysed virology questions ([Gema et al. 2024](https://arxiv.org/abs/2406.04127)) |
| MMLU-Redux | 2024 | 5,700 re-annotated | 4-option multiple choice | Exact match | No | live | The corrected subset of MMLU, across all 57 subjects |
| MMLU-Pro | 2024 | 12,032 | 10-option multiple choice | Exact match | No | live | Ten options lower the chance baseline from 25% to 10% |
| ARC (AI2 Reasoning Challenge) | 2018 | 7,787 total, 2,590 in the Challenge set | Multiple choice science | Exact match | No | saturated | Was in the first Open LLM Leaderboard suite |
| HellaSwag | 2019 | about 10,000 | Sentence completion | Exact match | No | saturated | Was in the first Open LLM Leaderboard suite |
| Winogrande | 2019 | about 44,000 | Pronoun resolution | Exact match | No | saturated | Was in the first Open LLM Leaderboard suite |
| TruthfulQA | 2021 | 817 | Short answer and multiple choice | Model or exact match | No | superseded | Measures imitation of common falsehoods, not general truthfulness |
| BIG-bench | 2022 | 204 tasks | Mixed | Task-specific | No | superseded | Introduced the canary string convention for contamination control |
| BIG-Bench Hard (BBH) | 2022 | 23 tasks | Mixed | Task-specific | No | live | The subset where models scored below the human rater average |
| GPQA | 2023 | 448 total, 198 in the Diamond subset | 4-option multiple choice | Exact match | No | live | Expert-written; validated so that non-experts with web access and 30 minutes cannot solve them |
| MuSR | 2023 | n/v | Multistep soft reasoning | Exact match | No | live | Added in the second Open LLM Leaderboard suite |
| IFEval | 2023 | about 540 | Instruction following with checkable constraints | Programmatic check | No | live | Constraints such as "reply in exactly three bullet points" are verified by code, not a judge |
| Humanity's Last Exam (HLE) | 2025 | 2,500 | Short answer and multiple choice | Exact match and model check | Partly | live | Questions were adversarially filtered against several frontier models, so those models should not be compared directly against later ones |
| ARC-AGI-2 | 2025 | n/v | Abstract visual grid puzzles | Exact match | Yes | live | Keeps a private evaluation set; targets composition and rule application rather than knowledge |

## Mathematics

| Benchmark | Year | Items | Format | Grader | Held out | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GSM8K | 2021 | 8,500 total, 1,319 in the test split | Grade-school word problems | Exact match on the final number | No | saturated | The canonical example of a benchmark that stopped discriminating |
| MATH | 2021 | 12,500 | Competition problems, 5 difficulty levels | Answer equivalence check | No | saturated | The Level 5 subset and the MATH-500 subset are both still quoted |
| Mock AIME 2024-2025 | 2025 | n/v | Contest-style problems | Exact match | No | live | Built by Epoch AI as a harder replacement once MATH Level 5 saturated |
| FrontierMath | 2024 | 338 (295 in Tiers 1 to 3, 43 in Tier 4), 12 published as samples | Research-level problems with a single checkable answer | Programmatic check | Yes | live | Version 2, released 12 June 2026, corrected 123 Tier 1 to 3 problems and 12 Tier 4 problems and removed 12 after an audit found errors affecting 42% of the original set. OpenAI funded the benchmark and holds access to a subset, disclosed on the benchmark page |

## Code

| Benchmark | Year | Items | Format | Grader | Held out | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HumanEval | 2021 | 164 | Write a Python function from a docstring | Unit tests | No | saturated | Introduced the pass@k estimator used across the field |
| MBPP | 2021 | 974 | Short Python programming problems | Unit tests | No | saturated | Often quoted alongside HumanEval |
| SWE-bench | 2023 | 2,294 issues from 12 Python repositories | Resolve a real GitHub issue | Repository test suite | No | superseded | Drawn from public repositories that model providers train on |
| SWE-bench Verified | 2024 | 500, selected from 1,699 reviewed | Resolve a real GitHub issue | Repository test suite | No | live | Human-validated by OpenAI to remove wrong grading, underspecified issues, and over-specific tests. OpenAI has since said it no longer measures frontier coding capability |
| LiveCodeBench | 2024 | Grows continuously; a 2025 release covered 1,055 problems (`n/v`) | Contest programming problems tagged with a publication date | Unit tests | By date | live | Scores only problems published after a model's training cutoff, which is contamination control by timestamp |
| Terminal-Bench | 2026 | about 89 core tasks in version 2 (`n/v`) | Complete a job in a Linux shell | Programmatic check | Partly | live | Carries a large weight in the Artificial Analysis coding category |
| KernelBench | 2025 | n/v | Write GPU kernels | Correctness plus speedup | No | live | One of the ten benchmarks audited for validity failures by the Agentic Benchmark Checklist |
| SciCode | 2024 | n/v | Scientific computing subproblems from papers | Unit tests | No | live | Used in the Artificial Analysis coding category |

## Agents and real work

| Benchmark | Year | Items | Format | Grader | Held out | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GAIA | 2023 | 466 | Assistant questions needing browsing, files, and tools, in three difficulty levels | Exact match | Partly | live | Answers for the test split are withheld and scored by submission |
| WebArena | 2023 | 812 tasks (`n/v`) | Multi-step tasks on self-hosted clones of real websites | Programmatic outcome check | No | live | Audited for validity failures by the Agentic Benchmark Checklist |
| OSWorld | 2024 | 369 | Control a real desktop by mouse and keyboard | Programmatic outcome check | No | live | Audited for validity failures by the Agentic Benchmark Checklist |
| τ-bench | 2024 | 165 tasks across retail and airline (`n/v`) | Customer-service conversation with tools and a policy document | Database state check plus rules | No | live | Introduced pass^k, the share of tasks solved in every one of k attempts. Reported that a leading model of the time solved under 50% of tasks and under 25% consistently across 8 attempts |
| τ²-bench | 2025 | n/v | Same idea across airline, retail, and telecom, with the user also acting | Database state check | No | live | Adds a second actor, so the agent must coordinate rather than just execute |
| MLE-bench | 2024 | 75 Kaggle competitions | Build a machine-learning solution end to end | The competition's own scoring function | No | live | Grading is inherited from Kaggle, which removes grader design risk |
| Cybench | 2024 | 40 capture-the-flag tasks (`n/v`) | Solve security challenges in a sandbox | Flag match | No | live | Used as a safety-relevant capability eval, including on the Holistic Agent Leaderboard |
| CVE-Bench | 2025 | n/v | Exploit real web vulnerabilities in a sandbox | Programmatic exploit check | No | live | The Agentic Benchmark Checklist cut its performance overestimate by 33% |
| CORE-bench | 2024 | 270 tasks from 90 papers (`n/v`) | Reproduce the computational results of a published paper | Output comparison | No | live | Measures reproducibility work rather than invention |
| GDPval | 2025 | 1,320 tasks across 44 occupations and 9 industries | Produce a real work deliverable, such as a legal brief or a nursing care plan | Blinded pairwise expert comparison against a human deliverable | Partly | live | Task authors averaged about 14 years of professional experience. The grader is a human expert who does not know which deliverable is the model's |
| AgentHarm | 2024 | n/v | Harmful agent tasks with tools | Rubric and programmatic checks | No | live | A refusal-and-capability eval rather than a capability-only one |

## Suites, indices, and arenas

These are not benchmarks. They are ways of combining benchmarks, and they add their own decisions.

| Name | Year | What it is | Composition | Grader | Notes |
| --- | --- | --- | --- | --- | --- |
| HELM | 2022 | A standardised multi-metric suite | 42 scenarios, with 7 metrics measured on 16 core scenarios | Mixed | Raised the share of core scenarios that a typical model had been measured on from 17.9% to 96.0%, and publishes every prompt and completion |
| Open LLM Leaderboard | 2023 | An open-model leaderboard | First suite: ARC, HellaSwag, MMLU, TruthfulQA, Winogrande, GSM8K. Second suite from June 2024: MMLU-Pro, GPQA, MuSR, IFEval, BBH, MATH Level 5 | Automatic | The second suite normalises each score so that chance performance maps to 0 and perfect to 100 before averaging. The whole leaderboard was later archived |
| Chatbot Arena (LMArena) | 2023 | Crowd preference voting between anonymous model pairs | Open-ended user prompts | Human votes, fitted with a Bradley-Terry model | Ratings come with bootstrap confidence intervals, and the top few models usually overlap |
| MT-Bench | 2023 | A small multi-turn quality set | 80 questions | A strong model as judge | The judge agreed with human raters more than 80% of the time, about the same as humans agreed with each other |
| Arena-Hard | 2024 | Harder automatic prompts distilled from arena traffic | Prompts selected for difficulty | Model judge | Built to correlate with arena rankings at much lower cost |
| AlpacaEval, length-controlled | 2024 | Automatic instruction-following comparison | Fixed prompt set | Model judge with a length correction | Exists because judges prefer longer answers, so the raw version rewarded verbosity |
| Artificial Analysis Intelligence Index | 2024 | A weighted commercial index | Version 4.1.1 combines 9 evaluations in 4 categories: Agents 34%, Coding 24%, Scientific Reasoning 24%, General 18% | Mixed | Publishes repeat counts per evaluation (1 to 5), temperature settings, and cost and latency per task beside the score |
| Holistic Agent Leaderboard (HAL) | 2025 | A third-party, cost-aware agent leaderboard with one shared harness | 11 agent benchmarks | Benchmark-native | Validated with 21,730 agent attempts across 9 models and 9 benchmarks for about $40,000, with all logs published |
| Epoch AI Benchmarking Hub | 2024 | An independent re-runner of selected benchmarks | Runs GPQA Diamond, MATH Level 5, Mock AIME, FrontierMath, SWE-bench Verified itself | Benchmark-native | Runs 16 samples per question on GPQA Diamond and Mock AIME, 8 on MATH Level 5, and shows plus or minus one standard error |
| MLPerf | 2018 | Systems benchmarking for training and inference | Reference models and datasets | Reference implementations | Governance worth copying: a Closed division that fixes the model and optimiser, an Open division that must document every deviation, and up to two audited submissions per round |

## Choosing a benchmark for a decision

| Your decision | Look at | Do not rely on |
| --- | --- | --- |
| Which model for a coding agent product | SWE-bench Verified plus Terminal-Bench, with cost per task, then your own repository tasks | HumanEval, which is saturated and heavily contaminated |
| Which model for customer support automation | τ-bench or τ²-bench for reliability across repeats, then your own transcripts | Any single-turn quiz |
| Which model for research assistance | GPQA Diamond, HLE, and a browsing benchmark such as GAIA | MMLU |
| Whether a new model is genuinely better at maths | FrontierMath and dated contest problems | GSM8K or MATH, both saturated |
| Whether an agent can do a paid job | GDPval-style expert comparison on your own deliverables | Any accuracy benchmark |
| Whether a model is safe to deploy | Capability evals plus red-teaming plus monitoring | Any benchmark alone |
| Which hardware to buy | MLPerf | Any model-quality benchmark |

## Saturation is the normal end state

Every general benchmark in the first two tables above was, at release, described as hard. The
pattern is consistent enough to plan for.

<!-- figure: lifecycle -->


| Stage | What you see | What to do |
| --- | --- | --- |
| Release | Frontier models score near chance or far below expert level | Report raw scores with intervals |
| Useful life | Scores spread across a wide band and rank models consistently | This is the window where the benchmark earns its keep |
| Compression | Top models cluster within a few points, and gaps fall inside the confidence intervals | Stop ranking with it; report it as a floor check |
| Ceiling | Scores approach the label-error rate of the dataset | Retire it, or replace it with an audited version |

MMLU illustrates the last stage precisely. When an audit finds errors in 6.49% of items
([Gema et al. 2024](https://arxiv.org/abs/2406.04127)), a reported 95% cannot be distinguished from
a perfect model that disagrees with the wrong labels. The score has stopped measuring the model.

---

<!-- 11archive-source: 03-statistics-and-uncertainty.md -->

# Statistics and uncertainty

## An eval is an experiment

The questions in a benchmark are a sample. Somebody could have written different ones. So a
benchmark score is an estimate of how the model would do on the whole imaginable pool of similar
questions, and every estimate has a spread. This framing is the whole of the argument in
Anthropic's statistical treatment of evals, which is the reference this section leans on
([Miller 2024](https://arxiv.org/abs/2411.00640)).

Its five recommendations, quoted in condensed form:

1. Compute standard errors of the mean using the Central Limit Theorem.
2. When questions are drawn in related groups, compute clustered standard errors.
3. Reduce variance by resampling answers and by analysing next-token probabilities.
4. When comparing two models, do the statistics on question-level paired differences, not on the
   summary averages.
5. Use power analysis to decide whether an eval can test the hypothesis you care about at all.

Everything below is those five, made concrete.

## 1. The error bar

For a benchmark scored right or wrong on each of n independent questions, with observed accuracy p:

```
standard error = sqrt( p * (1 - p) / n )
95% interval  = p  ±  1.96 * standard error
```

Worked example, which you can check with a calculator:

| Quantity | Value |
| --- | --- |
| Accuracy p | 0.712 |
| Questions n | 500 |
| p * (1 - p) | 0.205056 |
| Divided by n | 0.000410112 |
| Standard error | 0.02025, that is 2.03 percentage points |
| 95% interval | 67.2% to 75.2% |

So "71.2%" on a 500-question benchmark means "somewhere around 67% to 75%". A rival model at 74%
is not ahead. This is the single most useful arithmetic in the report, and it takes ten seconds.

<!-- figure: overlap -->


**Reporting rule.** Print the standard error next to the score, and print n. A percentage with
three significant figures and no n is false precision.

## 2. Questions that arrive in groups

Many benchmarks bundle several questions per source. Reading-comprehension sets ask five questions
about one passage. Multilingual sets translate one question into many languages. When one passage
is hard, all five of its questions are hard together, so you have fewer independent observations
than you have rows.

Ignoring this makes your interval too narrow, and the effect is large. Measured on real evals with
real models:

| Eval | Clustered standard error | Naive standard error | Ratio |
| --- | --- | --- | --- |
| DROP | 1.34 | 0.44 | 3.05 |
| RACE-H | 0.51% | 0.46% | 1.10 |
| MGSM | 1.62% | 0.86% | 1.88 |

Source: [Miller 2024](https://arxiv.org/abs/2411.00640), Table 4. A reader who took the naive DROP
interval at face value would believe the measurement was three times more precise than it is.

**Reporting rule.** Publish the cluster count beside the question count, and cluster on the unit
that was sampled: the passage, the source document, the language, the repository, the user session.

## 3. Getting a tighter number without more questions

The spread in a score has two parts. One comes from which questions you happened to pick, and you
cannot reduce it except by adding questions. The other comes from the model answering
inconsistently, and that part you can attack.

| Technique | What it does | Effect |
| --- | --- | --- |
| Ask each question K times and average the per-question scores | Removes the model's own answer-to-answer noise | Under a simple model of question difficulty: K = 2 cuts total variance by a third, K = 4 by a half, K = 6 by five ninths, with a ceiling of two thirds |
| Read the probability of the correct answer token instead of sampling text | Removes that noise completely, because the score becomes a number rather than a coin flip | Reaches the two-thirds ceiling at K = 1. Only works when no chain of thought is needed |
| Lower the sampling temperature | Looks like it removes noise | Do not do this |

The temperature warning deserves the space. Lowering temperature does not remove uncertainty, it
moves it somewhere you cannot fix, and it can shift the average as well. In one worked case from
the paper, dropping to temperature 0 turns a spread of 1/12 into a spread of 1/4, tripling the
irreducible part. In a second case the variance rises about fivefold and the expected score moves
from 2/3 to 3/4. Change temperature when you want to study the model at that temperature, never to
tidy up your error bars.

**Reporting rule.** State samples per question (K) and the temperature. Compute the standard error
across question-level means, never across all K times n individual answers, because repeated
answers to one question are not independent observations.

## 4. Comparing two models

Do not subtract two averages and compare their separate intervals. Score both models on the same
questions, take the difference per question, and analyse those differences.

```
paired standard error = sqrt( SE_A^2 + SE_B^2 - 2 * SE_A * SE_B * corr(A, B) )
```

Models agree substantially about which questions are hard, so the correlation term is positive and
the paired error is smaller than the unpaired one. At a correlation of 0.5 the variance drops by
about a third, for free, with no extra compute
([Miller 2024](https://arxiv.org/abs/2411.00640)).

**Reporting rule.** For any model comparison, publish the difference, the paired standard error of
the difference, and the score correlation. If the interval on the difference includes zero, write
that the models are indistinguishable on this eval. Do not write that one "slightly leads".

## 5. Deciding whether the eval can answer your question at all

Before running anything, ask what size of difference the eval could detect. The sample-size
formula, for a paired comparison:

```
n = (z_(alpha/2) + z_beta)^2 * (omega^2 + sigma_A^2 / K_A + sigma_B^2 / K_B) / delta^2
```

where delta is the smallest difference you want to catch, omega^2 is the variance of the
per-question difference in true difficulty, and the sigma terms are the models' own answer noise.

The paper's worked case: to catch a 3 percentage point difference 80% of the time at the 5%
significance level, with the noise terms set to zero and omega^2 = 1/9, you need

```
n = (1.95996 + 0.84162)^2 * (1/9) / 0.03^2 = 7.84885 * 0.111111 / 0.0009 = 969
```

Hence the paper's headline guidance: a new eval should carry at least about 1,000 questions to have
useful signalling ability.

Turned around, for a fixed benchmark size, the smallest difference you can detect is:

```
minimum detectable effect = (z_(alpha/2) + z_beta) * standard error of the difference
```

Worked example you can check: 500 questions, per-question differences with a standard deviation of
0.5, so the standard error of the mean difference is 0.5 / sqrt(500) = 0.02236. Then

```
MDE = (1.95996 + 0.84162) * 0.02236 = 6.3 percentage points
```

A 500-item benchmark cannot resolve a 3-point gap under these assumptions. Most published
model-versus-model tables report gaps smaller than their benchmark can detect.

## 6. Metrics for code and agents

### pass@k

For tasks where any correct solution counts, generate n samples, count c correct, and use the
unbiased estimator from the Codex paper ([Chen et al. 2021](https://arxiv.org/abs/2107.03374)):

```
pass@k = 1 - C(n - c, k) / C(n, k)
```

Two mistakes to avoid. First, do not use `1 - (1 - c/n)^k`, which is biased because it assumes
sampling with replacement. Second, sample n larger than k. The Codex paper used n = 200 for values
of k up to 100.

Worked example: n = 10 samples, c = 3 correct, k = 1 gives pass@1 = 1 - C(7,1)/C(10,1) =
1 - 7/10 = 0.30, which is just c/n. For k = 5: C(7,5) = 21, C(10,5) = 252, so
pass@5 = 1 - 21/252 = 0.9167.

### pass^k, the reliability metric

pass@k rewards a system that succeeds occasionally. Most deployed products need the opposite:
success every time. **pass^k** is the share of tasks solved in all k independent attempts,
introduced by τ-bench ([Yao et al. 2024](https://arxiv.org/abs/2406.12045)).

The two diverge sharply as k grows: pass@k climbs toward 100% while pass^k falls toward 0%. Report
both, or report the one that matches your deployment. A customer-facing agent should be judged on
pass^k.

### Cost and latency as first-class metrics

An agent can raise accuracy by calling the model more times. Reporting accuracy alone therefore
rewards spending, and the fix is to report the pair. See
06-agentic-evaluation.md.

## 7. Aggregating across benchmarks

Averaging raw accuracies from benchmarks with different chance baselines is wrong. A 4-option
multiple-choice benchmark gives 25% for free; a free-text benchmark gives 0%.

The Open LLM Leaderboard's second suite normalises first, mapping chance to 0 and perfect to 100:

```
normalised = (raw - chance) / (1 - chance)
```

Worked example: 50% raw on a 4-option benchmark, where chance is 0.25, becomes
(0.50 - 0.25) / 0.75 = 0.333, that is 33.3. The same 50% on a free-text benchmark stays at 50.
Without this step the multiple-choice benchmark contributes twice its earned weight.

Two more aggregation rules from ordinary table practice:

- Never total percentages, ratios, or averages. Totals are only valid for additive, non-overlapping
  counts.
- If you use weights, publish them. Artificial Analysis publishes both the category weights
  (Agents 34%, Coding 24%, Scientific Reasoning 24%, General 18%) and the per-evaluation weights
  inside them. That is the standard to hold an index to.

## 8. The variance the error bars miss

Standard errors describe sampling noise. They say nothing about the choices in the measurement
chain, and those are usually the bigger term.

| Source of variation | Typical size | Captured by a standard error? |
| --- | --- | --- |
| Prompt format, such as which separator sits between fields | Up to 76 accuracy points on one open model ([Sclar et al. 2024](https://arxiv.org/abs/2310.11324)) | No |
| Few-shot example choice and order | Large, and does not shrink with model size, more examples, or instruction tuning | No |
| Log-probability scoring versus generated answers | Different numbers for the same model, not comparable | No |
| Answer extraction rule | Silently converts correct answers into failures | No |
| Harness implementation | Different frameworks give different scores for the same benchmark and model ([Biderman et al. 2024](https://arxiv.org/abs/2405.14782)) | No |
| Question sampling | Computed above | Yes |
| Model answer noise | Reducible by resampling | Yes |

This is why the maintainers of the widely used lm-evaluation-harness argue for sharing exact
prompts, sharing code, versioning datasets, and refusing cross-harness comparison. The honest way
to report a prompt-sensitive result is a range across several plausible formats, not one number
from the format that happened to work.

## The reporting template

Everything above collapses into one table. If a results table has these columns, a reader can do
their own statistics.

| Column | Example |
| --- | --- |
| Benchmark and version | GPQA Diamond, 2023 release |
| Items, and clusters if grouped | 198 items, no clustering |
| Samples per item, temperature | 16 samples, default temperature |
| Scoring mode | Generated answer, exact match after published extraction |
| Score | 78.4% |
| Standard error | 1.6 points |
| Paired difference against the baseline, with its standard error | +2.1 points, standard error 1.2, correlation 0.61 |
| Verdict | Indistinguishable from the baseline at the 5% level |
| Cost per item | $0.11 |
| Harness and commit | Named framework, exact commit |

---

<!-- 11archive-source: 04-contamination-and-saturation.md -->

# Contamination and saturation

## The two ways a benchmark dies

**Contamination** is test material reaching the model during training. The model then partly
remembers answers instead of working them out, and the score overstates its ability.

**Saturation** is the benchmark running out of headroom. Scores bunch near the top, differences
fall inside the noise, and the remaining gap is often just the dataset's own wrong labels.

Both are normal. A benchmark is a consumable, like a set of exam papers: useful once, then leaked.
Planning for that is the practice, not preventing it.

## How contamination happens

You do not need anyone to cheat. Five ordinary paths:

| Path | Example |
| --- | --- |
| The benchmark is published on the open web | Any dataset on a public hosting site gets crawled |
| The source material is public and the benchmark is drawn from it | SWE-bench issues come from public GitHub repositories that providers already train on |
| People discuss the items online | Forum threads quoting hard questions with worked answers |
| Solutions ship with code | Competition solutions live in public repositories |
| Someone mirrors the file | Copies escape whatever access control the original had |

The clearest published demonstration comes from OpenAI's work building SWE-bench Verified. While
reviewing the original benchmark, they found that every frontier model they tested could reproduce
the original human-written fix, or the exact wording of problem statements, for at least some tasks.
That is direct evidence of exposure during training
([OpenAI 2024, introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)).

## Detecting it

No method is conclusive for a model whose training data you cannot inspect, which means every
commercial model. Use several, and treat the result as a probability rather than a verdict.

| Method | How it works | Limits |
| --- | --- | --- |
| Overlap search | Look for exact or near-exact matches between test items and training text, typically with n-grams. GPT-2's report measured contamination as the share of 8-grams from an evaluation set also present in training | Needs access to the training corpus. Misses paraphrases and translations |
| Canary strings | The dataset embeds a unique marker so anyone can grep a corpus, or ask a model to reproduce it. BIG-bench introduced this convention | Only proves inclusion when the marker survives; a filter can strip it |
| Perturbation test | Change surface details that do not change the answer, then compare. A large drop suggests memorisation | A real ability can also be format-sensitive, so a drop is suggestive rather than proof |
| Date split | Score items published before and after the model's training cutoff separately. LiveCodeBench is built on this | Needs trustworthy cutoff dates, and later items may differ in difficulty |
| Ask the model to continue the item | Give the first half of a question and see whether it completes the rest verbatim | Weak evidence on its own; a fluent model can guess plausible continuations |
| Held-out comparison | Score a private set alongside the public one. A gap is the contamination estimate | Requires having built a private set in advance |

The last row is the only one that gives a number you can act on, and it can only be done by whoever
built the benchmark. That is the argument for building private splits.

## Designing against it

Six defences, in rough order of strength.

| Defence | Example in the wild | Cost |
| --- | --- | --- |
| Keep the whole set private, publish only samples | FrontierMath keeps 338 problems private and publishes 12 as samples | You must run every evaluation yourself, or trust a submission process |
| Keep a private evaluation split | ARC-AGI keeps a private set; GAIA withholds test-split answers and scores submissions | Ongoing maintenance and submission handling |
| Date every item and score only post-cutoff items | LiveCodeBench tags problems with their publication date | Comparability across time needs pinned versions |
| Refresh items on a schedule | Live benchmarks rotate in new questions regularly | Every refresh breaks comparison with earlier runs unless versioned |
| Generate items procedurally | Template-generated tasks with randomised content | Generated items often measure a narrower thing than they appear to |
| Canary string plus a licence term asking for exclusion | BIG-bench | Honour-system only |

Two rules go with all of them:

- **Version and pin.** A live benchmark without version identifiers produces numbers that cannot be
  compared to anything, including its own earlier results.
- **Publish the stance.** A benchmark page should say plainly which of the six defences it uses, or
  that it uses none. A reader cannot infer it.

## The conflict-of-interest problem

Private test sets create a new risk: someone has to hold them, and that party's independence
becomes load-bearing.

FrontierMath is the worked example, in both directions. Epoch AI disclosed only after publication
that OpenAI had funded the benchmark and had access to a subset of problems, with a verbal
agreement not to train on it. Contributing mathematicians said they had not been told, and
critics argued the restriction should have been a written contract
([TechCrunch, 19 January 2025](https://techcrunch.com/2025/01/19/ai-benchmarking-organization-criticized-for-waiting-to-disclose-funding-from-openai/)).
Epoch's co-founder acknowledged that the contract should have allowed more disclosure. The
benchmark page now carries a conflict-of-interest statement, which is the correct end state.

**Practice.** Disclose funding, disclose early access, disclose data-use restrictions, and disclose
them at publication rather than after. Treat any benchmark where the top scorer also paid for the
benchmark as requiring independent replication before it carries weight.

## Saturation and the label-error ceiling

A benchmark cannot measure a model more accurately than its own labels. Once frontier accuracy
approaches the label-error rate, the score measures agreement with mistakes.

MMLU is the clearest case. An audit re-annotated 5,700 questions across all 57 subjects and
estimated errors in 6.49% of the dataset, with 57% of the analysed virology questions affected. The
same work showed that model rankings shift once the errors are fixed
([Gema et al. 2024](https://arxiv.org/abs/2406.04127)).

FrontierMath shows the same problem in a young benchmark, and shows the right response. An audit
found errors affecting 42% of the original problem set. Version 2, released on 12 June 2026,
corrected 123 problems in Tiers 1 to 3 and 12 in Tier 4, and removed 12 problems, leaving 338
([Epoch AI](https://epoch.ai/benchmarks/frontiermath)). Auditing your own benchmark and publishing
the diff is the behaviour to reward.

### Retirement

The Hugging Face Open LLM Leaderboard retired its first six-benchmark suite in June 2024 on the
grounds that it was becoming obsolete and risked pushing the field to optimise things that no
longer mattered. It replaced it with a harder suite, and later archived the whole leaderboard.
Deciding to stop is a maintenance action, not a failure.

Set the trigger in advance. Useful triggers:

| Trigger | Threshold worth using |
| --- | --- |
| Top scores cluster | The best three models sit inside each other's confidence intervals |
| Ceiling reached | Frontier accuracy is within the dataset's estimated label-error rate |
| Contamination confirmed | Post-cutoff items score materially lower than pre-cutoff items |
| No headroom left in the construct | The remaining failures are all label errors or ambiguous items |

## What contamination does not excuse

Two arguments to reject.

**"Everything is contaminated, so benchmarks are useless."** Contamination inflates absolute
scores. It does not automatically destroy comparison, provided every model faces the same exposure
and the same harness. What it does destroy is the claim that a score reflects generalisation.

**"Our model scores well because it generalises."** That is the claim contamination attacks. If you
want it, you need a private split, dated items, or a fresh set. Assertion is not evidence.

---

<!-- 11archive-source: 05-judges-and-human-evaluation.md -->

# Judges and human evaluation

## When there is no single right answer

Multiple choice has a key. A summary, a legal memo, or a bedside manner does not. For those you need
a judge, and the judge becomes part of the instrument. A biased ruler produces biased measurements
no matter how many things you measure with it.

Three families of grader, with the trade-offs stated plainly. The definitions follow Anthropic's
agent-evaluation guidance ([Anthropic engineering](https://anthropic.com/engineering/demystifying-evals-for-ai-agents)).

| Grader | How it decides | Strengths | Weaknesses | Use for |
| --- | --- | --- | --- | --- |
| Code-based | String match, unit tests, static checks, database state, tool-call inspection | Fast, cheap, deterministic, reproducible | Only works where success is expressible in code. Rejects valid unusual answers | Anything checkable. Always prefer this |
| Model-based | A model scores against a rubric, asserts in natural language, or picks between two answers | Handles open-ended work and scales | Has systematic biases; needs calibration; costs money per item | Open-ended quality, at scale, after calibration |
| Human | Expert review, crowd rating, spot checks | The reference standard | Slow, expensive, inconsistent between raters | Calibrating the other two, and final sign-off |

The correct architecture is all three: code where possible, a model grader calibrated against
humans where code cannot reach, and a human sample to keep the model grader honest.

## Model graders: how good are they?

Good enough to use, and biased enough to need controls.

On MT-Bench and Chatbot Arena, a strong model judge agreed with human raters more than 80% of the
time, which is about the rate at which the humans agreed with each other
([Zheng et al. 2023](https://arxiv.org/abs/2306.05685)). That is the case for using them.

The case for controlling them is that the biases are catalogued. The CALM framework quantified
twelve, measured as a "robustness rate", the share of cases where the judge's verdict survives an
irrelevant change ([Ye et al. 2024](https://arxiv.org/abs/2410.02736)):

| Bias | What triggers it |
| --- | --- |
| Position | Which answer appears first |
| Verbosity | Longer answers preferred regardless of quality |
| Self-enhancement | The judge prefers text from its own model family |
| Compassion fade | Named models treated differently from anonymous ones |
| Bandwagon | Told that most people prefer one answer |
| Distraction | Irrelevant added detail |
| Fallacy oversight | Checks the final answer and ignores broken reasoning |
| Authority | Fake citations increase credibility |
| Sentiment | Emotional tone shifts the score |
| Chain of thought | Asking for reasoning changes the verdict |
| Refinement aware | Told an answer was "improved" |
| Diversity | Demographic cues in the content |

Two more structural problems:

- **Non-transitivity.** A judge can prefer A over B, B over C, and C over A, which breaks any
  ranking built from pairwise judgements
  ([Investigating Non-Transitivity in LLM-as-a-Judge, 2025](https://arxiv.org/abs/2502.14074)).
- **Correlation with the thing being measured.** A judge that shares training lineage with the model
  under test is not an independent instrument.

## Controls that work

Apply these before trusting a model grader.

| Control | What it fixes | How |
| --- | --- | --- |
| Swap and average | Position bias | Run every pair twice with the order reversed; count a win only if it survives both |
| Length control | Verbosity bias | Correct for answer length statistically, as the length-controlled version of AlpacaEval does, or cap length in the prompt |
| Rubric per dimension | Vague, single-number judging | Score accuracy, completeness, and tone separately with explicit criteria, one judge call per dimension |
| Reference answer in the prompt | Drift and leniency | Give the judge a known-good answer to compare against |
| Pairwise instead of absolute | Unstable numeric scales | "Which is better" is more reliable than "score this 1 to 10" |
| Different judge family | Self-enhancement | Never let a model family grade its own outputs in a competitive comparison |
| Report agreement with humans | Everything above | Hold out a human-labelled set; report agreement, and treat a fall in agreement as a broken grader |
| Read the transcripts | Silent grader failure | You cannot know a grader works without reading its decisions on many trials |

**Reporting rule.** A model-graded result without a stated agreement rate against human labels is
not a measurement. Publish the agreement, the size of the human-labelled set, and the agreement
statistic used.

## Human evaluation

Human raters are the reference, not the truth. They disagree, drift, and can be gamed by
presentation.

| Practice | Why |
| --- | --- |
| Write the rubric before collecting ratings | A rubric written after seeing outputs encodes the outputs |
| Blind the raters to which system produced which output | Otherwise brand expectation leaks into the score |
| Measure agreement between raters and report it | Low agreement means the task, not the systems, is the problem |
| Use domain experts where the task needs domain judgement | Crowd raters cannot score a nursing care plan |
| Prefer pairwise comparison against a reference deliverable | Easier and more stable than absolute scoring |
| Publish rater qualifications and payment | Both affect quality and both are usually hidden |

GDPval is a good template. Tasks were built by professionals averaging about 14 years of experience,
and grading is a blinded pairwise comparison: an expert sees the task and two unlabelled
deliverables, one from the model and one from a human, and ranks them without knowing which is
which ([OpenAI 2025](https://openai.com/index/gdpval/)). That design controls brand expectation and
produces a directly interpretable result.

## Preference arenas

A preference arena shows an anonymous pair of answers to a real user, records the vote, and fits a
rating. Chatbot Arena, now LMArena, is the widely cited one
([Chiang et al. 2024](https://arxiv.org/abs/2403.04132)).

### What the rating is

Votes are fitted with a **Bradley-Terry model**, a standard statistical model for pairwise contests
that estimates one strength number per player from win and loss records. Intervals come from
bootstrap resampling.

### Its four assumptions, and how each breaks

| Assumption | Reality |
| --- | --- |
| A model's strength is fixed while the votes are collected | Models are updated, and routing and system prompts change |
| The order of matches does not matter | Traffic mix shifts over time, so early and late votes are not the same experiment |
| Preferences are transitive | Pairwise preference can cycle |
| Votes are representative of the use you care about | Arena traffic is whatever arena users type, which is not your workload |

### What the numbers actually say

The top few models routinely sit inside each other's confidence intervals, so their rank order is
partly noise. An arena ranking is a coarse instrument: it separates tiers reliably and adjacent
positions unreliably.

### The selective-disclosure problem

A 2025 study of the arena reported structural advantages for a few providers. It found that some
labs tested many private variants before release and disclosed only the best result. One example
given: 27 Llama 4 variants tested privately between January and March 2025, with a single score
published at launch. It also reported that two providers each received roughly 19% to 20% of arena
data, against about 30% for 83 open models combined
([Singh et al. 2025](https://arxiv.org/abs/2504.20879)). LMArena published a response disputing the
size of the effect and stating that any lab may submit as many variants as it can run
([LMArena response](https://news.lmarena.ai/our-response/)).

Whatever the true size of the effect, the mechanism is not in dispute and it generalises: **if a
participant can run a test many times and publish only the best result, the published result is a
maximum, not an estimate.** The fix is procedural.

| Fix | Effect |
| --- | --- |
| Disclose every run, including withdrawn ones | Removes selection |
| Limit submissions per model version | Caps the maximum-taking |
| Pre-register which variant will be scored | Removes post-hoc choice |
| Publish per-provider data volumes | Makes the fitting asymmetry visible |

### What arenas cannot tell you

They measure what a voter prefers after reading two answers for a few seconds. That is a real and
useful signal about presentation, tone, and apparent helpfulness. It is not a measure of
correctness, and a well-formatted wrong answer wins votes. Never use an arena rating as evidence of
factual accuracy, and never use it alone for a purchase decision.

---

<!-- 11archive-source: 06-agentic-evaluation.md -->

# Evaluating agents

## Why agent evaluation is a different problem

A quiz has one input and one output. An **agent** takes many steps: it reads, calls tools, changes
state in the world, and stops when it decides it is done. That adds four failure surfaces a quiz
does not have.

| Surface | The question | What breaks |
| --- | --- | --- |
| Environment | Does the sandbox behave like the real thing, identically every run? | Leftover files, cached state, a flaky network, and a version bump silently change the result |
| Shortcut | Can the task be finished without the ability being tested? | The answer sits in a file the agent can read, so the task measures searching, not solving |
| Grader | Does the checker separate real success from apparent success? | Thin tests pass a wrong patch; a blank answer counts as a pass |
| Cost and variance | How much did it spend, and does it work every time? | A system that succeeds once in five runs at ten times the price looks equal on an accuracy table |

The audit evidence says the grader is the biggest of the four.

## The audit: agent benchmarks overstate performance

The Agentic Benchmark Checklist examined ten widely used agent benchmarks, including SWE-bench
Verified, τ-bench, WebArena, OSWorld, KernelBench, and CVE-Bench. It found validity problems in all
of them, with performance overstated by up to 100% in relative terms. Two concrete examples: a
benchmark whose test cases were too thin to reject an incorrect fix, and one that counted an empty
response as a completed task. Applying the checklist cut CVE-Bench's overestimate by 33%
([Zhu et al. 2025](https://arxiv.org/abs/2507.02825)).

The checklist splits into three parts, and its shape is the most transferable thing in it:

| Part | Criteria | The rule in one line |
| --- | --- | --- |
| Task validity | 10 | The task is solvable if and only if the agent has the target ability |
| Outcome validity | 20 | The grader says "solved" exactly when the task was solved |
| Reporting | Several | Publish enough for someone else to reproduce and re-grade |

### Task validity checks worth running yourself

| Check | How |
| --- | --- |
| Shortcut hunt | Try to pass the task without the ability: grep the environment for the answer, read the test file, look for the reference solution on disk |
| Solvability proof | Write a reference solution for every task. If you cannot, the task may be impossible, and an impossible task quietly caps your ceiling |
| Ambiguity test | Two domain experts, working separately, must reach the same pass or fail verdict. If they do not, the task is underspecified |
| Sufficiency | Confirm the environment actually contains everything the task needs |

### Outcome validity checks worth running yourself

| Check | How |
| --- | --- |
| Negative controls | Feed the grader a known-wrong solution, an empty output, and a partial output. All three must fail |
| Positive controls | Feed the reference solution, plus one valid unusual solution. Both must pass |
| Coverage | Would the tests catch a plausible wrong implementation, not just a syntax error? |
| No step-matching | Grade the outcome, not the exact sequence of steps; agents find valid routes you did not plan |
| Transcript reading | Read the transcripts and grades from many trials. Grader bugs are invisible in aggregate numbers |

## Cost control

Accuracy alone rewards spending. Call the model more times, retry more, search wider, and accuracy
rises. That is not a better agent, it is a bigger bill.

Kapoor and colleagues made the argument directly: agent evaluation has to be cost-controlled, or the
field will produce extremely expensive agents whose only achievement is topping a leaderboard. They
showed simple baseline agents matching much more elaborate architectures on HumanEval at a fraction
of the cost, and argued for plotting results as an accuracy-versus-cost curve so that the two can be
optimised together ([Kapoor et al. 2024](https://arxiv.org/abs/2407.01502)).

<!-- figure: cost-accuracy -->

| Reporting choice | What it encourages |
| --- | --- |
| Accuracy only | Unlimited spending |
| Accuracy at a fixed budget per task | Efficiency at one operating point |
| Accuracy-versus-cost curve | Honest comparison across operating points, and lets a reader pick their own budget |

The infrastructure now exists to do this properly. Princeton's Holistic Agent Leaderboard runs 11
agent benchmarks through one shared harness, reports cost alongside accuracy by default, and was
validated with 21,730 agent attempts across 9 models and 9 benchmarks for about $40,000, with all
logs published ([HAL, 2025](https://arxiv.org/abs/2510.11977)). Publishing the logs is the part to
copy: it lets anyone re-grade the same runs.

Commercial indices have followed. Artificial Analysis computes the cost of each evaluation from
input, cache, reasoning, and output token prices divided by task count, then weights it the same way
it weights the score, and publishes latency per task the same way
([Artificial Analysis methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)).

## Reliability, not just capability

An agent that works four times in five is not 80% as useful as one that always works. For most
deployments it is unusable, because the failure lands on a real customer.

Report both metrics and say which one you optimise:

| Metric | Definition | Deploy question it answers |
| --- | --- | --- |
| pass@k | Solved in at least one of k attempts | Can it find a solution if a human reviews and retries? |
| pass^k | Solved in every one of k attempts | Can I let it run unattended? |

τ-bench introduced pass^k for exactly this reason, and reported that a leading model of its time
solved under 50% of tasks on the first try and under 25% consistently across eight attempts
([Yao et al. 2024](https://arxiv.org/abs/2406.12045)). The gap between those two numbers is the
reliability problem, and an accuracy table hides it entirely.

## Time horizon: an interpretable capability scale

METR reports a different shape of result: the length of task, measured by how long a human expert
takes, that a model completes with a given success rate. The **50% time horizon** is the human task
length at which the model succeeds half the time.

Method, in brief: collect human completion times for a set of software and reasoning tasks, run the
model on the same tasks, fit a curve of success rate against human task length, and read off where
it crosses 50%. Confidence intervals come from a hierarchical bootstrap over task families, tasks,
and attempts. The headline finding was a doubling of that horizon roughly every 7 months over about
six years, with 2024 to 2025 data suggesting faster
([METR 2025](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)).

Why it is worth copying: the unit is meaningful to a non-specialist. "Handles jobs that take a
person an hour" communicates in a way that "78.4%" does not.

Why to handle it carefully: the number depends on which tasks were chosen and whose completion times
were measured, and METR says so. It is a well-constructed measurement of a specific task
distribution, not a universal constant.

## Building an agent eval that holds up

An eight-step order of work, following Anthropic's agent-evaluation guidance and the audit findings
above ([Anthropic engineering](https://anthropic.com/engineering/demystifying-evals-for-ai-agents)).

| Step | Do this | Watch for |
| --- | --- | --- |
| 1 | Start with 20 to 50 tasks taken from real failures, not a target of hundreds | Waiting for a big set means you ship without evidence |
| 2 | Convert the checks you already run by hand, plus bug-tracker and support-queue cases | Invented tasks drift from real usage |
| 3 | Write unambiguous tasks with reference solutions | If two experts disagree on pass or fail, rewrite the task |
| 4 | Balance the set: cases where the behaviour should happen, and cases where it should not | One-sided sets teach the system to always act |
| 5 | Isolate every trial in a clean environment | Shared state creates correlated failures that look like model behaviour |
| 6 | Grade outcomes, allow partial credit for multi-part tasks, calibrate model graders | Step-matching penalises valid alternative routes |
| 7 | Read transcripts and grades from many trials | This is where you find grader bugs, and there is no substitute |
| 8 | Watch for saturation and refresh with harder tasks | A suite everything passes gives no signal |

Then keep it alive: name an owner, let domain experts add tasks, and treat the suite like test code
rather than a document.

## Reporting checklist for an agent result

| Field | Example |
| --- | --- |
| Benchmark and version, or "internal suite" with its commit | Terminal-Bench 2.1 |
| Tasks attempted, and any excluded, with the reason | 89 attempted, 0 excluded |
| Trials per task | 3 |
| pass@1, and pass^k for the k you care about | 54.1% pass@1, 31.2% pass^3 |
| Standard error | 4.9 points |
| Cost per task, and total cost | $0.42 median, $37 total |
| Wall-clock per task | 3m 10s median |
| Agent scaffold: tools, retry policy, step limit, model settings | Named scaffold, 40-step limit, no retries |
| Grader definition and its negative-control results | Programmatic check; empty output and known-wrong patch both fail |
| Environment isolation method | Fresh container per trial |
| Logs published? | Yes, with a link |

---

<!-- 11archive-source: 07-safety-and-frontier-risk-evals.md -->

# Safety and frontier-risk evaluation

## A different job, with different rules

A capability benchmark asks how good a model is. A safety evaluation asks whether it can do
something dangerous, and whether it will. That flips several defaults.

| Difference | Capability eval | Safety eval |
| --- | --- | --- |
| Which error hurts | Overstating ability | Understating ability, because you then ship something you have not measured |
| Effort direction | Give the model a fair chance | Try hard to elicit the capability, including with scaffolds, tools, and fine-tuning where permitted |
| Score meaning | Higher is better | Higher crosses a threshold that triggers extra safeguards |
| Publication | Publish the items | Publishing items can hand out a recipe, so some detail stays private |
| Who should run it | Anyone | Someone independent of the deployment decision, at least in part |

The single most important consequence: **a low score on a dangerous-capability evaluation is only
meaningful if you tried hard to get a high one.** A weak prompt, a missing tool, or a short step
limit produces a comforting number that means nothing. This is the mirror image of the capability
world, where the usual worry is inflation.

## Capability versus propensity

Two questions that need separate tests:

- **Capability.** Could the model do this if it tried? Elicit as hard as you can.
- **Propensity.** Will it do this when it has the choice? Set up a realistic situation and watch.

They fail in opposite directions. A capability test fails by under-eliciting. A propensity test
fails when the model realises it is a test.

## Evaluation awareness breaks propensity tests

Frontier models sometimes state, in their own visible reasoning, that a scenario looks like an
evaluation. Apollo Research documented this in versions of Claude, calling it **evaluation
awareness**, and found notably higher rates in environments testing whether a model would
underperform on purpose
([Apollo Research](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations)).
Anthropic's own reporting on a later model described significantly better situational awareness and
a tendency to behave well once the model recognised an alignment test.

Why this is a measurement problem, not a curiosity: if a model behaves better when it thinks it is
being watched, then every behavioural evaluation measures behaviour-under-observation, which is not
the quantity you want.

There is a matching failure in the other direction, **sandbagging**: a model performing worse than
it can on a capability test.

Practices that help:

| Practice | Effect |
| --- | --- |
| Measure and report the evaluation-awareness rate | Turns an unknown confound into a reported number |
| Build environments that look like production, not like tests | Fewer cues to notice. Avoid tells such as obviously synthetic names and impossible tidiness |
| Compare behaviour across matched realistic and obviously-artificial variants | Quantifies the size of the effect |
| Read the reasoning traces, not just the outcomes | The model often says out loud that it suspects a test |
| Treat elicited maximum capability as the number of record | Guards against sandbagging |
| Have a third party run some of it | An outside team makes fewer assumptions about what the model should do |

## The frontier safety policy pattern

The three largest developers publish policies with the same shape, updated through 2025: Anthropic's
Responsible Scaling Policy, Google DeepMind's Frontier Safety Framework, and OpenAI's Preparedness
Framework. METR's cross-comparison sets out the shared elements
([METR, Common Elements of Frontier AI Safety Policies](https://metr.org/common-elements)).

| Element | What it means |
| --- | --- |
| Risk domains | Usually chemical and biological weapons, cyber offence, machine-learning research automation, and loss of control or deceptive alignment |
| Capability thresholds | A described capability level that, if reached, requires stronger safeguards. Anthropic names these AI Safety Levels; DeepMind names critical capability levels |
| Evaluations tied to thresholds | Specific tests whose results are compared against the thresholds |
| Required safeguards | The security and deployment measures that apply once a threshold is crossed |
| A stopping commitment | A commitment to pause if the safeguards cannot be implemented |

For an evaluation practitioner, the important implication is that the eval now has a decision
attached. A threshold makes the measurement consequential, which raises the standard on
elicitation effort, on documentation, and on independence.

## Red-teaming is not a benchmark

Red-teaming is open-ended adversarial probing by people who are trying to break the system. It
produces findings, not a score, and that is the point: a fixed benchmark can only test the attacks
you already thought of.

| Property | Benchmark | Red team |
| --- | --- | --- |
| Coverage | Fixed and known | Open, driven by the attacker's imagination |
| Output | A number | A list of findings with reproductions |
| Reusable | Yes, until contaminated | No, once fixed the same attack stops working |
| Comparable across models | Yes | Weakly |
| Regulatory standing | Evidence of measured capability | Explicitly required, see below |

Use both. Red-team findings become the seed corpus for the next version of your benchmark, which is
how a static suite stays relevant.

### Independent red-teaming needs legal cover

Terms of service at major providers deter good-faith safety testing, because researchers fear
account suspension or legal action for probing a system. A widely signed proposal asks developers
to commit to a legal and technical safe harbour that indemnifies public-interest safety research
([Longpre et al. 2024](https://arxiv.org/abs/2403.04893)). Related work proposes structured access:
a dedicated research API with independent review of who gets in.

If you commission external testing, put the safe harbour in the contract. If you are a developer,
publishing one is cheap and expands the pool of people who can find your problems.

## Safety-relevant capability benchmarks

Some capability benchmarks exist mainly to inform safety decisions.

| Benchmark | Measures | Notes |
| --- | --- | --- |
| Cybench | Capture-the-flag security tasks in a sandbox | Used as a cyber-offence capability proxy; also on the Holistic Agent Leaderboard |
| CVE-Bench | Exploiting real web vulnerabilities in a sandbox | The Agentic Benchmark Checklist reduced its performance overestimate by 33%, a reminder that safety benchmarks need the same grader scrutiny as any other |
| AgentHarm | Whether an agent refuses harmful tasks, and whether it is capable of them | Measures refusal and capability together, which is the right pairing |
| MLE-bench | Autonomous machine-learning engineering | Relevant to the research-automation risk domain |

The general rule: a safety benchmark carries a decision, so it needs *more* validity work than a
capability benchmark, not less. The audit above found the same grader flaws in security benchmarks
as everywhere else.

## What a safety evaluation report should contain

| Field | Why |
| --- | --- |
| The risk domain and the threshold being tested against | Without a threshold, a number has no decision attached |
| The elicitation effort: scaffolds, tools, step limits, prompt iterations, any fine-tuning | The only way a reader can judge whether a low score is real |
| Evaluation-awareness rate observed | Bounds how much to trust behavioural results |
| Who ran it, and their independence from the deployment decision | Self-assessment is weaker evidence, and readers should be told which they are getting |
| What was not tested | The uncovered surface is the residual risk |
| Red-team findings summary, with severities and fixes | Numbers alone hide qualitative failures |
| What stays private, and why | Honest about the recipe problem, rather than silently omitting |

---

<!-- 11archive-source: 08-standards-and-regulation.md -->

# Standards, regulation, and governance

## Why this section exists

Evaluation used to be a research choice. For some systems it is now a legal obligation, and for many
buyers it is a procurement question. This section covers what external requirements actually say
about evaluation, and what governance practices are worth copying even where nothing compels you.

Nothing here is legal advice. Read the primary texts, which are linked.

## EU AI Act: evaluation as a legal duty

The Act creates a category of **general-purpose AI model with systemic risk**, and Article 55(1)
requires providers of those models to perform model evaluation using standardised protocols and
tools that reflect the state of the art, including conducting and documenting adversarial testing
in order to identify and mitigate systemic risks
([Article 55](https://artificialintelligenceact.eu/article/55/)).

Four points that matter to an evaluation team:

| Point | Consequence |
| --- | --- |
| "Standardised protocols and tools reflecting the state of the art" | Your evaluation method has to be defensible against current practice, and current practice moves. A frozen internal suite ages into non-compliance |
| "Conducting and documenting adversarial testing" | Red-teaming is named explicitly, and the documentation is part of the obligation, not an optional extra |
| Independent external experts may be involved | External testing is anticipated, and is proportionate to risk |
| A Code of Practice can demonstrate compliance until a standard exists | The General-Purpose AI Code of Practice was published on 10 July 2025, and the general-purpose obligations applied from 2 August 2025 |

Practical reading: the Act pushes towards written, versioned evaluation methodology with a
documented adversarial component. That is the same thing good practice asks for, with a filing
requirement attached.

## NIST: the American framework

The **AI Risk Management Framework** organises work into four functions: Govern, Map, Measure, and
Manage. Evaluation lives in **Measure**, which NIST ties to TEVV, meaning testing, evaluation,
verification, and validation, and which calls for a mix of methods including red-teaming, bias
assessment, and security testing ([NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)).

The **Generative AI Profile**, NIST AI 600-1, published 26 July 2024, extends the framework to
generative systems and names the risk categories to measure against. They are worth listing because
they make a useful coverage checklist for an evaluation suite:

| Risk category from NIST AI 600-1 |
| --- |
| Chemical, biological, radiological, and nuclear information or capabilities |
| Confabulation, commonly called hallucination |
| Dangerous, violent, or hateful content |
| Data privacy |
| Environmental impact |
| Harmful bias or homogenisation |
| Human and AI configuration |
| Information integrity |
| Information security |
| Intellectual property |
| Obscene, degrading, or abusive content |
| Value chain and component integration |

Use it as a gap analysis. Most in-house suites cover two or three of these twelve and have never
written down which ones.

## ISO: two standards that are often confused

| Standard | What it is | What it is not |
| --- | --- | --- |
| ISO/IEC TS 4213:2022 | A technical specification for assessing machine-learning classification performance: performance measures, evaluation methods, and model selection. Published October 2022 by ISO/IEC JTC 1/SC 42, about 33 pages, confirmed as current in 2025 | Not applicable to generative or agentic evaluation. It is a classification-metrics document |
| ISO/IEC 42001:2023 | A management-system standard for AI: requirements for establishing, operating, and improving an AI management system, published December 2023 | Not a technical evaluation spec, and certification does not by itself establish EU AI Act compliance |

Both are useful for different reasons. TS 4213 is a good reference for getting classification
metrics right. 42001 is what an auditor will ask about, and it obliges you to have a documented
evaluation process rather than prescribing what the process measures.

## MLPerf: governance worth stealing

Systems benchmarking solved a problem that model benchmarking still has. MLPerf, run by MLCommons,
compares hardware and software stacks, and its rules are built to stop the comparison being gamed.

| Rule | What it prevents | Model-benchmarking equivalent |
| --- | --- | --- |
| A Closed division that requires the same model, initialisation, optimiser, schedule, and data traversal as the reference implementation | Winning by changing the workload | Fix the prompt, the scaffold, and the scoring code across all systems compared |
| An Open division that permits changes but requires every deviation to be documented | Hiding the change | A "custom scaffold" column, with the scaffold published |
| Reference implementations published | Ambiguity about what the benchmark is | Publish a runnable harness, not a description |
| Up to two submissions audited per round, one chosen at random and one optionally by the review committee | Unverifiable claims | Random audit of submitted agent logs |
| Hyperparameter changes allowed only if publicly described at a level that allows reproduction | Secret tuning | Publish sampling settings and retry policies |

The transferable idea is the divisions. Most model comparisons quietly mix Closed and Open: one
system runs bare, another runs inside an elaborate scaffold, and the table presents them as
comparable. Separating the two would fix a large share of published confusion.

## Documentation formats

| Format | Documents | Core idea |
| --- | --- | --- |
| Model cards ([Mitchell et al. 2019](https://arxiv.org/abs/1810.03993)) | A trained model | Report intended use, evaluation conditions, and performance broken down by group and condition, not just an aggregate |
| Datasheets for datasets | A dataset | Record motivation, composition, collection process, and recommended uses |
| Data cards | A dataset, for practitioners | Structured, purpose-oriented dataset documentation |
| Benchmark documentation per BetterBench ([Reuel et al. 2024](https://arxiv.org/abs/2411.12990)) | A benchmark | Cover the whole lifecycle: design, implementation, documentation, maintenance, and retirement |

The disaggregation point from model cards is the one most often skipped and most often decisive: an
aggregate score can hide a group or condition where the system fails badly.

## Independent evaluation

Self-reported scores have an obvious incentive problem. Three structures reduce it, in increasing
strength:

| Structure | Example | Strength |
| --- | --- | --- |
| Published methodology plus published raw outputs | HELM publishes every prompt and completion | Anyone can re-grade |
| A third party re-runs the benchmarks itself | Epoch AI runs GPQA Diamond, MATH Level 5, Mock AIME, FrontierMath, and SWE-bench Verified with published settings, 16 samples per question on two of them, and plus or minus one standard error | Removes the provider's harness from the loop |
| A third party holds a private test set | FrontierMath, ARC-AGI | Removes contamination as well, at the cost of concentrating trust in the holder |

The third structure is the strongest and the most fragile. It only works if the holder's funding,
access arrangements, and data-use terms are disclosed. See the FrontierMath disclosure episode in
04-contamination-and-saturation.md.

## A compliance-shaped evaluation record

If you need to satisfy an external requirement, this is the minimum record to keep per model
version. It also happens to be good engineering practice.

| Record | Contents |
| --- | --- |
| Evaluation plan | Constructs measured, benchmarks chosen, why, and the coverage gaps against a named risk taxonomy |
| Protocol | Prompts, settings, samples per item, scaffolds, tools, step limits, all versioned |
| Results | Scores with standard errors, paired comparisons against the previous version, cost and latency |
| Adversarial testing | Who tested, for how long, what they found, severities, fixes, retests |
| Grader validation | Negative and positive control results; for model graders, agreement with human labels |
| Decisions | What the results changed: shipped, blocked, mitigated, or escalated |
| Sign-off | Who reviewed, and their independence from the shipping decision |
| Retention | Where the raw transcripts live, and for how long |

---

<!-- 11archive-source: 09-build-your-own-eval-suite.md -->

# Building your own evaluation suite

## Why bother, when public benchmarks exist

Because a public benchmark measures a different task than yours. GPQA measures graduate science
questions. Your product summarises support tickets in three languages under a 400 millisecond
budget. A model that gains four points on GPQA may get worse at your job, and you will not find out
from the leaderboard.

Two more reasons, both practical:

- **Public benchmarks are contaminated and saturated.** Your traffic is neither.
- **You need a regression gate.** Model providers update models. Prompts get edited. Without a suite
  you run, you learn about breakage from customers.

The bar is lower than people assume. Twenty to fifty tasks drawn from real failures give you more
decision value than any public score, because early changes produce large, visible effects
([Anthropic engineering](https://anthropic.com/engineering/demystifying-evals-for-ai-agents)).

## Step 0: error analysis first

Do not start by choosing metrics. Start by reading your own outputs.

The loop, as practitioners describe it: pull about 100 real traces, read them, write a one-line note
on what went wrong in each, then group the notes into categories and count. It takes a couple of
hours and teaches more than months of speculation
([Hamel Husain, Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/)).

You get three things out of it:

| Output | Use |
| --- | --- |
| A ranked list of failure categories with counts | Tells you what to measure, in priority order |
| Concrete failing examples | Become your first test cases, verbatim |
| A sense of what "good" means here | Becomes your rubric |

This is the step teams skip, and skipping it produces suites that measure things nobody was getting
wrong.

## The build, in ten steps

| Step | Action | Done when |
| --- | --- | --- |
| 1 | Write the success criteria in plain sentences, one per failure category from your error analysis | Two colleagues reading a criterion agree on which outputs pass |
| 2 | Turn your worst real failures into test cases, unchanged | You have 20 to 50 cases and every one came from reality |
| 3 | Add negative cases: inputs where the behaviour must *not* happen | The set is roughly balanced, so the system cannot win by always acting |
| 4 | Add edge cases: empty input, very long input, irrelevant input, ambiguous input, wrong language | Each case has an expected behaviour written down |
| 5 | Write a reference answer or reference outcome for every case | Every case is provably solvable, and the graders can be tested |
| 6 | Choose the cheapest grader that works, per case | Code where possible, model grader where not, human for calibration |
| 7 | Validate the graders with negative and positive controls | An empty output, a known-wrong output, and a valid unusual output all score correctly |
| 8 | Fix the protocol: prompt template, settings, samples per case, isolation | Two runs on unchanged input give the same result within the noise you expect |
| 9 | Wire it into continuous integration with a threshold | A pull request that breaks a criterion fails before merge |
| 10 | Name an owner and a refresh cadence | New production failures land in the suite within a week |

## Choosing a grader per case

Work down this ladder and stop at the first row that fits. Each row down costs more and is less
reproducible.

| Grader | Fits when | Example |
| --- | --- | --- |
| Exact or normalised match | There is one right answer | Extracted invoice total equals 1,428.50 |
| Programmatic check | Correctness is a computable property | Output is valid JSON matching the schema; the ticket status in the database is now "closed" |
| Unit tests | The output is code | The generated patch passes the repository's tests |
| Constraint check | The requirement is about form | Reply is under 120 words and contains no phone number |
| Model grader with a rubric | Quality is subjective but describable | "Does the summary state the customer's requested action?" scored yes or no with a reason |
| Model pairwise comparison | You are comparing two systems, not scoring one | Which reply would a support lead rather send? |
| Human expert | The judgement needs professional skill, or you are calibrating | A clinician reviews 50 care-plan drafts |

Two rules for model graders:

- **Ask one question at a time.** A judge asked for a single 1-to-10 quality score produces noise.
  A judge asked "does this summary state the requested action, yes or no", repeated per dimension,
  produces a usable measurement.
- **Calibrate, then re-calibrate.** Hold out human-labelled cases, report the agreement rate, and
  re-check it whenever you change the judge model or the rubric. A silent drop in agreement is a
  silent change in every number you report.

## What to measure, beyond quality

A quality-only suite pushes you into a slow, expensive product.

| Dimension | Metric | Gate example |
| --- | --- | --- |
| Quality | Pass rate per criterion, with a standard error | No criterion drops more than 3 points against the previous release |
| Reliability | pass^k over 3 to 5 trials on the same cases | pass^3 above 90% on the critical path |
| Cost | Tokens and currency per task, at the median and the 95th percentile | Median cost per task under $0.02 |
| Latency | Wall clock per task, median and 95th percentile | 95th percentile under 4 seconds |
| Safety | Refusal rate on the negative set, and over-refusal on the positive set | Zero harmful completions, over-refusal under 2% |
| Coverage | Share of live failure categories represented in the suite | Every category with more than 5 incidents has a test |

Report all six every run. The pattern to watch for is a quality gain paid for with a cost or latency
regression that nobody priced.

## How many cases do you need?

It depends on the size of change you need to detect, and the arithmetic is in
03-statistics-and-uncertainty.md. Two rules of thumb from that
section:

- To detect a 3 percentage point difference between two systems at conventional significance and
  power, you need something on the order of 1,000 items.
- With 500 items you can detect roughly 6 percentage points under typical assumptions.

That is not a reason to wait until you have 1,000 cases. It is a reason to be honest about what a
50-case suite can tell you: it catches breakage, not small improvements. Use a small suite as a
tripwire and a larger sampled set when you need to measure a real difference.

## Continuous integration

| Practice | Why |
| --- | --- |
| Run the fast subset on every pull request | Catches prompt edits that break behaviour |
| Run the full suite nightly and on release candidates | Model-graded cases cost money; do not pay per commit |
| Pin the model version in the test configuration | Otherwise a provider-side update looks like your bug |
| Store every transcript as a build artifact | You cannot debug an eval failure from a pass rate |
| Fail on a criterion regression, warn on aggregate movement | Aggregate scores drift; specific criteria breaking is a real signal |
| Re-run flaky cases and record the flakiness rather than hiding it | A case that passes 3 times in 5 is telling you about reliability |

## A worked specification

A minimal but complete spec for a real feature, as an example of the level of detail to aim for.

**Feature:** summarise a support ticket thread into a handover note for the next agent.

| Field | Value |
| --- | --- |
| Construct | Does the note let the next agent act without reading the thread? |
| Cases | 60, drawn from real threads: 40 typical, 10 edge (very long, mixed language, no clear request), 10 negative (threads where no handover is warranted) |
| Reference | A handover note written by a senior support agent for each case |
| Graders | Programmatic: note under 150 words, contains no card number pattern. Model rubric, one call per dimension: states the customer's requested action; states what has already been tried; states the next step. Pairwise model comparison against the senior agent's note. Human: 15 cases reviewed monthly by a support lead |
| Protocol | Fixed prompt template v7, temperature 0.2, 3 samples per case, fresh context per case |
| Metrics | Per-dimension pass rate with standard error, pass^3, median and 95th percentile cost and latency, redaction failures (must be zero) |
| Gates | Any dimension below 92%, or any redaction failure, blocks release |
| Calibration | Model-rubric agreement with the support lead's labels, measured monthly, must stay above 0.85 |
| Owner | Named person, reviewed quarterly |

## Mistakes small teams make

| Mistake | Fix |
| --- | --- |
| Writing test cases from imagination | Take them from logs and support tickets |
| One vague "quality" score from a judge | One yes-or-no rubric question per dimension |
| No negative cases | Half your value is proving the system stays quiet when it should |
| Never reading transcripts | Read them. Grader bugs are invisible in aggregates |
| Comparing this week's number to a number produced with a different prompt | Version the protocol and refuse cross-version comparisons |
| Letting the suite rot after launch | Owner, cadence, and a rule that every incident adds a case |
| Optimising against the suite until it passes | Keep a held-out set you do not iterate against, and rotate it |

The last one deserves emphasis. The moment you tune prompts against your eval set, that set stops
measuring generalisation and starts measuring fit. Hold back a portion, look at it rarely, and treat
a gap between the two as your overfitting estimate.

---

<!-- 11archive-source: 10-anti-patterns-and-reading-a-leaderboard.md -->

# Anti-patterns, and how to read a leaderboard

## The failure catalogue

Twenty-six ways a benchmark result misleads. Each row gives the symptom you can spot from outside,
the fix, and where in this report the argument sits. Sort by area if you are auditing one part of a
claim.

| ID | Area | Failure | Symptom you can spot | Fix | Section |
| --- | --- | --- | --- | --- | --- |
| A1 | Reporting | Score with no uncertainty | A percentage to one or two decimals, no interval, no n | Publish the standard error and n | 03 |
| A2 | Reporting | Ranking on gaps smaller than the noise | "Slightly ahead", "narrowly leads", table sorted by a 0.4-point gap | Report the paired difference and its interval; call overlapping results indistinguishable | 03 |
| A3 | Reporting | Numbers from different harnesses in one table | Footnotes citing several different papers for one column | Re-run every system yourself under one harness, or do not put them in one table | 03 |
| A4 | Reporting | No stated limitations | The write-up has no section describing what the result cannot support | Write the limitation section; it is the part a decision-maker needs | 01 |
| A5 | Reporting | Undisclosed funding or early access | A benchmark whose top scorer also paid for it, with no conflict statement | Disclose funding, access, and data-use terms at publication | 04 |
| A6 | Selection | Cherry-picked suite | The benchmark set was chosen by the party making the claim, and no unfavourable benchmark appears | Ask who chose the suite; require a pre-registered set or a standard one | 01 |
| A7 | Selection | Best-of-many disclosure | Only one variant's score is published, with no count of how many were tried | Disclose every run including withdrawn ones, or limit submissions per version | 05 |
| A8 | Selection | Tuning against the eval set | The suite is also the development target, with no held-out split | Hold back a split you rarely look at; the gap is your overfitting estimate | 09 |
| A9 | Statistics | Clustering ignored | A reading-comprehension or multilingual benchmark reporting a plain standard error | Cluster on the sampled unit; the correction reached 3x on a real eval | 03 |
| A10 | Statistics | Unpaired comparison | Two averages with separate intervals, no per-question analysis | Take per-question differences; roughly a third less variance for free | 03 |
| A11 | Statistics | Underpowered eval | A 200-item benchmark used to argue a 2-point improvement | Compute the minimum detectable effect first | 03 |
| A12 | Statistics | Temperature lowered to steady the numbers | "We used temperature 0 to reduce variance" | Do not. It can triple the irreducible spread and shift the mean | 03 |
| A13 | Statistics | Standard error pooled over all samples | An interval that shrinks when they resample the same questions more | Compute the error across question-level means | 03 |
| A14 | Aggregation | Averaging benchmarks with different chance baselines | A mean of a 4-option multiple-choice score and a free-text score | Normalise chance to 0 and perfect to 100 before averaging | 03 |
| A15 | Aggregation | Totalling percentages or ratios | A "Total" row under a column of rates | Total only additive, non-overlapping counts | 03 |
| A16 | Aggregation | Undisclosed index weights | A single "intelligence" number with no published composition | Publish the components and their weights | 02 |
| A17 | Validity | Construct named broader than the task | A multiple-choice set presented as measuring "reasoning" | State the construct and what it excludes; describe the task in the claim | 01 |
| A18 | Validity | Task solvable by a shortcut | The answer is reachable from a file in the environment, or from the question's phrasing | Run the shortcut hunt; audits found up to 100% relative overstatement | 06 |
| A19 | Validity | Grader accepts non-answers | An empty or truncated output scored as success | Negative controls: empty, wrong, and partial outputs must all fail | 06 |
| A20 | Validity | Answer-extraction failures counted as model failures | A correct answer in an unexpected format scored wrong | Publish and test the extraction rule; report extraction failures separately | 01 |
| A21 | Validity | Human baseline missing or unexplained | "Above human level" with no description of which humans, or how long they had | State who the humans were, their expertise, and their conditions | 06 |
| A22 | Contamination | Public test set treated as evidence of generalisation | A claim about generalisation on a benchmark that has been on the open web for two years | Use a private split, dated items, or a fresh set | 04 |
| A23 | Contamination | Saturated benchmark still used to rank | Top models within a point of each other, near the ceiling | Retire it, or report it as a floor check only | 04 |
| A24 | Judging | Model judge with no human calibration | A model-graded score with no agreement rate reported | Hold out human labels, report agreement, re-check after any judge change | 05 |
| A25 | Judging | Judge shares lineage with a contestant, or order effects uncontrolled | One provider's model both competes and grades; single-order comparisons | Use an independent judge family; swap positions and require the win to survive both | 05 |
| A26 | Agents | Accuracy without cost or reliability | An agent leaderboard with one accuracy column | Report cost per task and pass^k, and plot accuracy against cost | 06 |

## Two failure modes specific to safety claims

| Failure | Symptom | Fix |
| --- | --- | --- |
| Weak elicitation behind a reassuring number | A dangerous-capability score reported without describing the scaffold, tools, step limits, or prompt iterations | Publish the elicitation effort. A low score only means something if you tried hard for a high one |
| Behavioural test invalidated by the model noticing | A propensity result with no mention of whether the model recognised the setting | Measure and report the evaluation-awareness rate; use production-like environments |

Both are argued in 07-safety-and-frontier-risk-evals.md.

## Reading a leaderboard, step by step

Take any leaderboard page and work through this. It takes about two minutes and usually changes what
you conclude.

| Step | Look for | If it is missing |
| --- | --- | --- |
| 1 | The composition: which benchmarks, at what weights | You cannot interpret the number. Stop, and go to the component scores |
| 2 | Intervals or error bars on the leading rows | Assume the top group is a tie |
| 3 | The harness: did the leaderboard run every model, or collect claims? | Collected claims are not a comparison |
| 4 | Repeats per item and temperature | Assume the numbers are noisier than shown |
| 5 | Whether any test set is private or date-filtered | Assume contamination inflates absolute scores |
| 6 | Cost and latency columns | On an agent leaderboard, the ranking is incomplete without them |
| 7 | Submission policy: how many variants per provider, and are withdrawals published? | Treat top scores as maxima, not estimates |
| 8 | Date of the run, and version pins | An undated leaderboard is a snapshot of nothing |

Then apply the one-sentence test: **write down the claim the leaderboard supports, in your own
words, without using the word "best".** If you cannot write a sentence that survives the eight
checks above, the page is entertainment.

## Questions to ask a vendor

For a procurement conversation, in order of how quickly they separate serious answers from marketing.

| # | Question | A good answer sounds like |
| --- | --- | --- |
| 1 | Which of your published numbers did you produce, and which did you copy? | A clear split, with the harness named for each |
| 2 | What is the standard error on your headline result? | A number, and n |
| 3 | Can you run your suite on my data? | Yes, and here is what we need |
| 4 | What does one task cost, at the median and the 95th percentile? | Two numbers in currency |
| 5 | How often does it succeed on the same task across five tries? | A pass^5 figure |
| 6 | Which benchmark do you do worst on, and why? | A specific benchmark and an honest diagnosis |
| 7 | What did your last regression catch? | A concrete story |
| 8 | Who graded your open-ended results, and what was their agreement with human experts? | A model grader plus an agreement rate, or human experts with qualifications |
| 9 | What is not tested? | A list |

Question 6 is the highest-yield. A vendor who cannot name a weakness has not measured carefully.

## The shortest version

A benchmark result is a claim about a measurement. Ask what was measured, how, with what
uncertainty, by whom, and at what cost. Five questions. Most published claims fail on at least two,
and knowing which two is usually enough to decide how much weight to give the number.

---

<!-- 11archive-source: 11-glossary.md -->

# Glossary

Terms are defined as this report uses them. Where a term has a stricter meaning in statistics or
psychometrics, the everyday version is given first.

| Term | Definition |
| --- | --- |
| Accuracy | The share of items scored correct. Only meaningful alongside the number of items and the chance baseline |
| Agent | A system that takes several steps on its own: reading, calling tools, changing state, and deciding when to stop |
| Agent harness | See scaffold |
| Agentic benchmark | A benchmark whose items are multi-step jobs in an environment, graded on the outcome rather than a single answer |
| Aggregation | Turning per-item scores into one number. The step where different chance baselines and unlike groups get illegally averaged |
| Answer extraction | The rule that pulls a gradeable answer out of free-form model text. A frequent source of correct answers scored wrong |
| ARC-AGI | A family of abstract visual puzzle benchmarks that keeps a private evaluation set |
| Benchmark | A fixed set of tasks plus a fixed way of scoring them, used to compare systems |
| Benchmark lottery | The observation that which method looks best depends heavily on which benchmarks the field happens to use |
| Bradley-Terry model | A statistical model that estimates one strength number per competitor from pairwise win and loss records. Used to turn arena votes into ratings |
| Canary string | A unique marker embedded in a benchmark so that anyone can search a training corpus for it, or ask a model to reproduce it, as a contamination check |
| Capability evaluation | A test of whether a system *can* do something. Contrast with propensity evaluation |
| Chance baseline | The score a system gets by guessing. 25% on a 4-option multiple-choice benchmark, 10% on a 10-option one, 0% on free text |
| Closed division | In MLPerf, a submission category that fixes the model, optimiser, and data handling so that only the system underneath varies. Contrast with Open division |
| Clustered standard error | An error bar corrected for items that arrive in groups, such as several questions about one passage. On real evals the correction has reached a factor of three |
| Confidence interval | A range that would contain the true value a stated share of the time if the experiment were repeated. Usually quoted at 95% |
| Construct | The ability or property a benchmark claims to measure, such as "multi-step arithmetic reasoning" |
| Construct validity | Whether the test measures the construct it claims to measure. Borrowed from psychometrics |
| Contamination | Test material reaching a model during training, so its score partly reflects memorisation |
| Coverage | Which parts of the construct, population, or risk taxonomy the benchmark actually touches, and which it does not |
| Criterion validity | Whether the score predicts the real-world outcome you care about |
| Dangerous capability evaluation | A test of whether a model can do something harmful, run to inform a deployment or safeguard decision |
| Datasheet | Structured documentation for a dataset: motivation, composition, collection method, and recommended uses |
| Decontamination | Removing or excluding test items from training data, or filtering results to items known to postdate training |
| Elicitation | The effort spent getting a model to show a capability: prompting, tools, scaffolds, step budgets, and permitted fine-tuning. Central to safety evaluation |
| Elo | A rating system for pairwise contests. Arena ratings are often called Elo but are usually fitted with a Bradley-Terry model |
| Error analysis | Reading a sample of real outputs, writing down what went wrong in each, then grouping and counting. The standard first step in building an in-house suite |
| Eval | One run of an evaluation against one system. Also used loosely for the evaluation itself |
| Evaluation awareness | A model recognising that it is being tested, which weakens any test of how it behaves when it thinks nobody is watching |
| Evaluation harness | The infrastructure that runs an evaluation end to end: supplies prompts and tools, runs items, records transcripts, grades, and aggregates |
| Evaluation suite | A collection of tasks assembled to measure a specific set of capabilities or behaviours |
| Few-shot | Showing the model worked examples in the prompt before the real item. The number, choice, and order of examples all move scores |
| Gate | A threshold in continuous integration that blocks a release when an evaluation criterion regresses |
| Goodhart's law | When a measure becomes a target, it stops being a good measure. The one-line summary of benchmark gaming |
| Grader | The logic that scores an attempt. Code-based, model-based, or human |
| Ground truth | The reference answer or outcome a grader compares against. Wrong ground truth caps a benchmark's usefulness |
| Held-out split | Items withheld from public release, or from your own tuning, so that a score on them measures generalisation |
| Holistic evaluation | Measuring several properties, such as accuracy, calibration, robustness, bias, and efficiency, on the same scenarios rather than accuracy alone |
| Human baseline | How well people do on the same items, under stated conditions. Required for any "human level" claim |
| Inter-annotator agreement | How often two human raters give the same verdict. Low agreement means the task is underspecified, not that the systems are similar |
| Item | One scored unit of a benchmark: a question, a problem, or a task |
| LLM-as-a-judge | Using a language model to grade open-ended outputs. Cheap, scalable, and biased in catalogued ways |
| Label error | A benchmark item whose recorded correct answer is wrong. Sets the ceiling above which scores are meaningless |
| Latency | Wall-clock time to complete an item. Report the median and a tail percentile, not the mean alone |
| Leaderboard | A ranked table of systems. Its composition, harness, and submission policy matter more than its order |
| Length control | Correcting a judge's preference for longer answers, either statistically or by capping length |
| Live benchmark | A benchmark that adds fresh items over time to resist contamination. Needs version pinning to stay comparable |
| Log-probability scoring | Scoring a multiple-choice item by the model's probability for each option token rather than by parsing generated text. Gives different numbers from generation, and the two are not comparable |
| Minimum detectable effect | The smallest difference an evaluation can reliably detect at a given size and power. Compute it before drawing conclusions |
| Model card | Short structured documentation for a trained model: intended use, evaluation conditions, and performance broken down by group and condition |
| Normalisation | Rescaling scores so that chance maps to 0 and perfect to 100, so that benchmarks with different chance baselines can be averaged |
| Open division | In MLPerf, a submission category that permits changes to the workload provided every deviation is documented |
| Outcome validity | Whether the grader reports success exactly when the task was actually solved |
| Paired comparison | Comparing two systems item by item and analysing the differences, rather than comparing two averages. Reduces variance for free |
| pass@k | The probability that at least one of k attempts succeeds. Estimated without bias as 1 minus C(n-c, k) / C(n, k) from n samples with c correct |
| pass^k | The share of tasks solved in every one of k attempts. The reliability metric for unattended deployment |
| Position bias | A judge preferring whichever answer it sees first. Fixed by running both orders and requiring the win to survive both |
| Power | The probability that an experiment detects a real difference of a given size. Conventionally set at 80% |
| Private test set | Items the benchmark holder never publishes, so providers cannot train on them. The strongest contamination defence and the greatest concentration of trust |
| Prompt sensitivity | Score changes caused by formatting choices that do not change meaning. Measured at up to 76 accuracy points on one open model |
| Propensity evaluation | A test of whether a system *will* do something when it has the choice. Contrast with capability evaluation |
| Protocol | Every setting that produces a score: prompt template, system prompt, examples, temperature, samples per item, tools, and step limits |
| Red-teaming | Open-ended adversarial probing by people trying to break the system. Produces findings, not a score |
| Reference solution | A known-good answer or outcome for an item. Proves the item is solvable and lets you test the grader |
| Resampling | Answering each item K times and averaging the per-item scores, to reduce the model's own answer noise |
| Retirement | Deliberately withdrawing a benchmark once it saturates, contaminates, or hits its label-error ceiling |
| Robustness rate | The share of judging decisions that survive an irrelevant change to the input. Used to quantify judge bias |
| Rubric | Explicit written criteria a grader applies. Best used one dimension at a time |
| Sandbagging | A model performing worse than it can, which makes a capability evaluation understate risk |
| Saturation | Frontier scores bunching near a benchmark's ceiling, so it no longer separates systems |
| Scaffold | The code around a model that turns it into an agent: prompts, tool wiring, retries, and step limits. Two systems with the same model and different scaffolds are not comparable |
| Self-enhancement bias | A model judge preferring text produced by its own model family |
| Shortcut | A way to pass a task without the ability being tested. The main threat to task validity |
| Standard error | The expected spread of an estimate. For accuracy p on n independent items, the square root of p times (1 minus p) divided by n |
| Statistical significance | Whether an observed difference is larger than would be expected from noise alone, at a stated threshold |
| Super-population | The imaginary larger pool of questions a benchmark's items are treated as a sample from. The assumption that makes error bars meaningful |
| Task validity | Whether a task is solvable if and only if the system has the target ability |
| Temperature | A sampling setting that controls output randomness. Do not change it to tidy up error bars |
| TEVV | Testing, evaluation, verification, and validation. The term NIST uses for the measurement work in its risk framework |
| Time horizon | The length of task, measured by how long a human expert takes, that a model completes with a stated success rate |
| Transcript | The complete record of one attempt: outputs, tool calls, intermediate results, and reasoning. Also called a trace or trajectory |
| Trial | One attempt at one task. Multiple trials per task are needed because behaviour varies between runs |
| Verbosity bias | A judge preferring longer answers regardless of quality |
| Zero-shot | Giving the model the task with no worked examples in the prompt |

---

<!-- 11archive-source: 12-methodology-and-sources.md -->

# Methodology and sources

## What this report is, and how it was made

**Objective.** Explain what an AI benchmark can and cannot tell you, and set out the practices that
make a score trustworthy.

**Method.** Desk research on 2026-08-11. Public papers, benchmark documentation, standards text,
regulator text, and vendor methodology pages were searched, fetched, and read. Every material claim
was traced to a named source. Where a source could not be read directly, the claim is marked below
and should be treated as reported by that source rather than confirmed by this report.

**No new measurements.** Nothing here was benchmarked. The arithmetic in
03-statistics-and-uncertainty.md is recomputed from the formulas
in the cited work, using the inputs shown, so a reader can check every number with a calculator.

## Evidence states used

The report distinguishes how each claim is known. This matters most in
02-benchmark-catalog.md, where item counts vary in reliability.

| State | Meaning | How it appears |
| --- | --- | --- |
| source-reported | Stated by a named source; not independently checked | The default for benchmark item counts and vendor methodology |
| calculated | Recomputed here from a disclosed formula and stated inputs | The worked examples in section 03 |
| not verified (`n/v`) | Expected but not confirmed against a source read for this report | Written as `n/v`, never as zero or a guess |
| inferred | Reasoned from the sources rather than stated by any one of them | Flagged in the text with wording such as "the mechanism generalises" |

## Counts this report could not verify

These appear as `n/v` in the catalog, or carry an explicit `(n/v)` marker. Do not quote them from
here. Check the benchmark's own documentation.

| Item | What is unverified |
| --- | --- |
| Terminal-Bench version 2 | The "about 89 core tasks" figure comes from a secondary summary |
| Cybench | The "40 capture-the-flag tasks" figure comes from a secondary summary |
| WebArena | The "812 tasks" figure comes from a secondary summary |
| τ-bench | The "165 tasks" split across retail and airline comes from a secondary summary |
| CORE-bench | The "270 tasks from 90 papers" figure comes from a secondary summary |
| LiveCodeBench | The "1,055 problems" figure is a snapshot from a secondary summary of a growing set |
| MuSR, ARC-AGI-2, τ²-bench, KernelBench, SciCode, CVE-Bench, AgentHarm, Mock AIME | No item count read |
| ARC-AGI-2 release year | Widely reported as 2025; no primary source read |
| "Why we no longer evaluate SWE-bench Verified" | Publication date not read |

## Claims that rest on a secondary reading

Every numeric or quotable claim below comes from a search-result synthesis of the named source
rather than a direct read of it. They are reported faithfully and were consistent across the results
seen, but a reader relying on one of them for a decision should open the primary link in the source
table. The `Depth` column of the source tables marks every source read only at this depth, including
ones whose claims are qualitative and therefore not listed here.

| Claim as used | Source to check |
| --- | --- |
| A strong model judge agreed with human raters more than 80% of the time, about the human-human rate of 81% | Zheng et al. 2023 |
| Prompt formatting moved accuracy by up to 76 points on one open model | Sclar et al. 2024 |
| MMLU error rate of 6.49%, with 57% of analysed virology questions affected, from 5,700 re-annotated questions | Gema et al. 2024 |
| SWE-bench Verified: 500 tasks selected from 1,699 reviewed, and frontier models reproducing the reference fix | OpenAI, Introducing SWE-bench Verified |
| HELM: 42 scenarios, 7 metrics on 16 core scenarios, coverage raised from 17.9% to 96.0% | Liang et al. 2022 |
| Codex pass@k sampling: n = 200 for k up to 100 | Chen et al. 2021 |
| τ-bench: under 50% first-attempt success and under 25% across eight attempts for a leading model of the time | Yao et al. 2024 |
| HAL: 21,730 rollouts, 9 models, 9 benchmarks, about $40,000, 2.5B tokens of logs | HAL 2025 |
| Kapoor et al.: simple baselines matching complex architectures on HumanEval at lower cost | Kapoor et al. 2024 |
| Open LLM Leaderboard: the two suites, the normalisation rule, and the retirement rationale | Hugging Face leaderboard documentation |
| EU AI Act Article 55(1) wording on model evaluation and adversarial testing; Code of Practice published 10 July 2025; obligations applied from 2 August 2025 | Article 55 text |
| NIST AI 600-1 publication date of 26 July 2024 and its risk-category list | NIST AI RMF pages |
| ISO/IEC TS 4213 scope, page count, and 2025 confirmation; ISO/IEC 42001 publication date | ISO catalogue entries |
| MLPerf division rules and the up-to-two-audited-submissions policy | MLCommons policies |
| Evaluation awareness in versions of Claude, and the later model's situational awareness | Apollo Research; developer system card reporting |
| The shared structure of frontier safety policies | METR, Common Elements |
| GDPval: 1,320 tasks, 44 occupations, 9 industries, blinded pairwise expert grading, authors averaging about 14 years of experience | OpenAI, GDPval |

## Verification performed on this report

| Check | Result |
| --- | --- |
| Statistical worked examples recomputed independently | Standard error example, the 969-question power calculation, the 6.3-point minimum detectable effect, both pass@k examples, and the chance-normalisation example all reproduce |
| arXiv identifiers, titles, first authors, and dates | Confirmed through the arXiv API for 23 papers; the remainder confirmed from search listings that displayed the identifier next to the title |
| Cross-format parity | `report.html` is generated from these Markdown files. `verify.mjs` extracts every heading and every table cell from both and compares them in order: 123 headings and 2,383 cells match |
| Machine-readable mirror | `data.json` is parsed out of the Markdown tables rather than typed by hand, so it cannot drift. Its counts are checked back against the tables, and the counts quoted in the README prose are checked against `data.json` |
| Determinism | The generator was run twice on unchanged input; `report.html` and `data.json` are byte-identical apart from the generation timestamp |
| Browser pass | Loaded in a real browser. Confirmed: dark by default with zero marked rows; sorting a table descending then ascending reorders rows and tracks `aria-sort`; two marked rows survive two sorts; the marks counter appears and clears; the theme toggle switches both ways and updates its label and pressed state; dragging a column freezes the layout with an explicit width on every column and a frozen table width; all four diagrams fit inside their view boxes with their colours resolving from the design tokens; the page body never scrolls sideways |
| Not checked by eye | The light theme and the print layout were verified from computed styles and the stylesheet, not from a screenshot: the preview pane in use would not produce further screenshots after the first load |
| Privacy scan | No credential-shaped values, personal data, or local absolute paths appear in any published artifact |
| Link check | Every external link in `report.html` traces back to a Markdown source, and every internal anchor resolves to an existing element |

## Limitations

- **No independent measurement.** This report describes practice. It did not run any benchmark, so
  every quantitative claim about a model or a benchmark is source-reported.
- **A moving target.** Benchmark composition, leaderboard rules, index weights, and model scores
  change monthly. Version numbers and dates are given so a reader can tell how stale a statement is.
  Treat anything version-specific, such as the index composition in
  02-benchmark-catalog.md, as a snapshot of 2026-08-11.
- **Coverage skews to language and agent models.** Vision, speech, robotics, recommendation, and
  scientific-model benchmarking are out of scope apart from general principles that transfer.
- **Coverage skews to English-language work.** Multilingual and non-English benchmarking practice is
  named but not surveyed.
- **Not legal advice.** The regulatory section summarises text and links to it. Obligations depend on
  facts this report does not know.
- **Secondary readings.** The table above lists every claim taken from a search-result synthesis
  rather than a direct read. That is 17 claims out of roughly 200 material ones.
- **One perspective on quality.** The report leans on a small number of methodology papers, in
  particular the statistical treatment in Miller 2024 and the agent-benchmark audit in Zhu et al.
  2025. Both are well argued, and neither is the last word.

## Sources

Depth values: `full text` means the whole document was read; `read` means the page or a substantial
part of the document was fetched and read; `metadata verified` means the identifier, title, authors,
and date were confirmed but the contents were not read for this report; `secondary` means the claim
came from a synthesis of search results about that source.

### Evaluation methodology and critique

| ID | Source | Author or org | Date | Link | Depth |
| --- | --- | --- | --- | --- | --- |
| S01 | Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations | Evan Miller, Anthropic | 2024-11-04 | [arXiv:2411.00640](https://arxiv.org/abs/2411.00640) | full text |
| S02 | AI and the Everything in the Whole Wide World Benchmark | Raji et al. | 2021 | [arXiv:2111.15366](https://arxiv.org/abs/2111.15366) | secondary |
| S03 | The Benchmark Lottery | Dehghani et al. | 2021-07 | [arXiv:2107.07002](https://arxiv.org/abs/2107.07002) | secondary |
| S04 | BetterBench: Assessing AI Benchmarks, Uncovering Issues, and Establishing Best Practices | Reuel et al., Stanford | 2024-11 | [arXiv:2411.12990](https://arxiv.org/abs/2411.12990) | read |
| S05 | Establishing Best Practices for Building Rigorous Agentic Benchmarks | Zhu et al. | 2025-07 | [arXiv:2507.02825](https://arxiv.org/abs/2507.02825) | read |
| S06 | AI Agents That Matter | Kapoor et al., Princeton | 2024-07 | [arXiv:2407.01502](https://arxiv.org/abs/2407.01502) | secondary |
| S07 | Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation | Princeton | 2025-10 | [arXiv:2510.11977](https://arxiv.org/abs/2510.11977) | secondary |
| S08 | Lessons from the Trenches on Reproducible Evaluation of Language Models | Biderman et al., EleutherAI | 2024-05 | [arXiv:2405.14782](https://arxiv.org/abs/2405.14782) | read |
| S09 | Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design | Sclar et al., ICLR 2024 | 2023-10 | [arXiv:2310.11324](https://arxiv.org/abs/2310.11324) | secondary |
| S10 | Are We Done with MMLU? | Gema et al., NAACL 2025 | 2024-06 | [arXiv:2406.04127](https://arxiv.org/abs/2406.04127) | secondary |
| S11 | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | Lianmin Zheng et al. | 2023-06-09 | [arXiv:2306.05685](https://arxiv.org/abs/2306.05685) | metadata verified |
| S12 | Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge (CALM) | Jiayi Ye et al., ICLR 2025 | 2024-10 | [arXiv:2410.02736](https://arxiv.org/abs/2410.02736) | read |
| S13 | Investigating Non-Transitivity in LLM-as-a-Judge | 2025 | 2025-02 | [arXiv:2502.14074](https://arxiv.org/abs/2502.14074) | metadata verified |
| S14 | Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference | Chiang et al. | 2024-03 | [arXiv:2403.04132](https://arxiv.org/abs/2403.04132) | metadata verified |
| S15 | The Leaderboard Illusion | Shivalika Singh et al., Cohere Labs and others | 2025-04 | [arXiv:2504.20879](https://arxiv.org/abs/2504.20879) | secondary |
| S16 | Response to "The Leaderboard Illusion" | LMArena | 2025 | [news.lmarena.ai](https://news.lmarena.ai/our-response/) | secondary |
| S17 | Holistic Evaluation of Language Models (HELM) | Liang et al., Stanford | 2022-11 | [arXiv:2211.09110](https://arxiv.org/abs/2211.09110) | secondary |
| S18 | Model Cards for Model Reporting | Mitchell et al. | 2019-01 | [arXiv:1810.03993](https://arxiv.org/abs/1810.03993) | metadata verified |
| S19 | A Safe Harbor for AI Evaluation and Red Teaming | Longpre et al. | 2024-03-05 | [arXiv:2403.04893](https://arxiv.org/abs/2403.04893) | secondary |
| S20 | A Comprehensive Survey of Contamination Detection Methods in Large Language Models | 2024 | 2024-04 | [arXiv:2404.00699](https://arxiv.org/abs/2404.00699) | metadata verified |
| S21 | Recent Advances in Large Language Model Benchmarks against Data Contamination | 2025 | 2025-02 | [arXiv:2502.17521](https://arxiv.org/abs/2502.17521) | metadata verified |

### Benchmark papers

| ID | Benchmark | First author | Date | Link | Depth |
| --- | --- | --- | --- | --- | --- |
| S22 | MMLU | Dan Hendrycks | 2020-09-07 | [arXiv:2009.03300](https://arxiv.org/abs/2009.03300) | metadata verified |
| S23 | MMLU-Pro | Yubo Wang | 2024-06-03 | [arXiv:2406.01574](https://arxiv.org/abs/2406.01574) | metadata verified |
| S24 | ARC (AI2 Reasoning Challenge) | Peter Clark | 2018-03-14 | [arXiv:1803.05457](https://arxiv.org/abs/1803.05457) | metadata verified |
| S25 | HellaSwag | Rowan Zellers | 2019-05-19 | [arXiv:1905.07830](https://arxiv.org/abs/1905.07830) | metadata verified |
| S26 | WinoGrande | Keisuke Sakaguchi | 2019-07-24 | [arXiv:1907.10641](https://arxiv.org/abs/1907.10641) | metadata verified |
| S27 | TruthfulQA | Stephanie Lin | 2021-09-08 | [arXiv:2109.07958](https://arxiv.org/abs/2109.07958) | metadata verified |
| S28 | BIG-bench | Aarohi Srivastava | 2022-06-09 | [arXiv:2206.04615](https://arxiv.org/abs/2206.04615) | metadata verified |
| S29 | BIG-Bench Hard (BBH) | Mirac Suzgun | 2022-10-17 | [arXiv:2210.09261](https://arxiv.org/abs/2210.09261) | metadata verified |
| S30 | GPQA | David Rein | 2023-11-20 | [arXiv:2311.12022](https://arxiv.org/abs/2311.12022) | metadata verified |
| S31 | MuSR | Zayne Sprague | 2023-10-24 | [arXiv:2310.16049](https://arxiv.org/abs/2310.16049) | metadata verified |
| S32 | IFEval | Jeffrey Zhou | 2023-11-14 | [arXiv:2311.07911](https://arxiv.org/abs/2311.07911) | metadata verified |
| S33 | Humanity's Last Exam | Long Phan | 2025-01-24 | [arXiv:2501.14249](https://arxiv.org/abs/2501.14249) | metadata verified |
| S34 | GSM8K | Karl Cobbe | 2021-10-27 | [arXiv:2110.14168](https://arxiv.org/abs/2110.14168) | metadata verified |
| S35 | MATH | Dan Hendrycks | 2021-03-05 | [arXiv:2103.03874](https://arxiv.org/abs/2103.03874) | metadata verified |
| S36 | HumanEval, and the pass@k estimator | Mark Chen et al. | 2021-07 | [arXiv:2107.03374](https://arxiv.org/abs/2107.03374) | secondary |
| S37 | MBPP | Jacob Austin | 2021-08-16 | [arXiv:2108.07732](https://arxiv.org/abs/2108.07732) | metadata verified |
| S38 | SWE-bench | Carlos E. Jimenez | 2023-10-10 | [arXiv:2310.06770](https://arxiv.org/abs/2310.06770) | metadata verified |
| S39 | LiveCodeBench | Naman Jain | 2024-03-12 | [arXiv:2403.07974](https://arxiv.org/abs/2403.07974) | metadata verified |
| S40 | Terminal-Bench | Mike A. Merrill | 2026-01-17 | [arXiv:2601.11868](https://arxiv.org/abs/2601.11868) | metadata verified |
| S41 | KernelBench | Anne Ouyang | 2025-02-14 | [arXiv:2502.10517](https://arxiv.org/abs/2502.10517) | metadata verified |
| S42 | SciCode | Minyang Tian | 2024-07-18 | [arXiv:2407.13168](https://arxiv.org/abs/2407.13168) | metadata verified |
| S43 | GAIA | 2023 | 2023-11 | [arXiv:2311.12983](https://arxiv.org/abs/2311.12983) | metadata verified |
| S44 | WebArena | 2023 | 2023-07 | [arXiv:2307.13854](https://arxiv.org/abs/2307.13854) | metadata verified |
| S45 | OSWorld | 2024 | 2024-04 | [arXiv:2404.07972](https://arxiv.org/abs/2404.07972) | metadata verified |
| S46 | τ-bench | Shunyu Yao et al. | 2024-06 | [arXiv:2406.12045](https://arxiv.org/abs/2406.12045) | secondary |
| S47 | τ²-bench | 2025 | 2025-06 | [arXiv:2506.07982](https://arxiv.org/abs/2506.07982) | metadata verified |
| S48 | MLE-bench | OpenAI | 2024-10 | [arXiv:2410.07095](https://arxiv.org/abs/2410.07095) | metadata verified |
| S49 | Cybench | Andy K. Zhang | 2024-08-15 | [arXiv:2408.08926](https://arxiv.org/abs/2408.08926) | metadata verified |
| S50 | CVE-Bench | Yuxuan Zhu | 2025-03-21 | [arXiv:2503.17332](https://arxiv.org/abs/2503.17332) | metadata verified |
| S51 | CORE-bench | 2024 | 2024-09 | [arXiv:2409.11363](https://arxiv.org/abs/2409.11363) | metadata verified |
| S52 | AgentHarm | 2024 | 2024-10 | [arXiv:2410.09024](https://arxiv.org/abs/2410.09024) | metadata verified |
| S53 | GDPval | OpenAI | 2025-10 | [arXiv:2510.04374](https://arxiv.org/abs/2510.04374) | metadata verified |

### Institutional and vendor documentation

| ID | Source | Org | Date | Link | Depth |
| --- | --- | --- | --- | --- | --- |
| S54 | Introducing SWE-bench Verified | OpenAI | 2024-08 | [openai.com](https://openai.com/index/introducing-swe-bench-verified/) | secondary |
| S55 | Why SWE-bench Verified no longer measures frontier coding capabilities | OpenAI | `n/v` | [openai.com](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) | secondary |
| S56 | Measuring the performance of our models on real-world tasks (GDPval) | OpenAI | 2025-09 | [openai.com](https://openai.com/index/gdpval/) | secondary |
| S57 | Benchmarking hub methodology | Epoch AI | 2026 snapshot | [epoch.ai](https://epoch.ai/benchmarks/about) | read |
| S58 | FrontierMath benchmark page, including the version 2 correction and the conflict-of-interest statement | Epoch AI | 2026-06-12 update | [epoch.ai](https://epoch.ai/benchmarks/frontiermath) | read |
| S59 | Measuring AI Ability to Complete Long Tasks | METR | 2025-03-19 | [metr.org](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) | read |
| S60 | Common Elements of Frontier AI Safety Policies | METR | 2025-12 | [metr.org](https://metr.org/common-elements) | secondary |
| S61 | Claude Sonnet 3.7 (often) knows when it's in alignment evaluations | Apollo Research | 2025 | [apolloresearch.ai](https://www.apolloresearch.ai/science/claude-sonnet-37-often-knows-when-its-in-alignment-evaluations) | secondary |
| S62 | Demystifying evals for AI agents | Anthropic | 2025 | [anthropic.com](https://anthropic.com/engineering/demystifying-evals-for-ai-agents) | read |
| S63 | Create strong empirical evaluations | Anthropic documentation | current | [docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/develop-tests) | secondary |
| S64 | Your AI Product Needs Evals | Hamel Husain | 2024 | [hamel.dev](https://hamel.dev/blog/posts/evals/) | secondary |
| S65 | Inspect, an open-source evaluation framework | UK AI Security Institute | current | [inspect.aisi.org.uk](https://inspect.aisi.org.uk/) | secondary |
| S66 | Announcing Inspect Evals | UK AI Security Institute | 2025 | [aisi.gov.uk](https://www.aisi.gov.uk/blog/inspect-evals) | secondary |
| S67 | Intelligence benchmarking methodology, index version 4.1.1 | Artificial Analysis | 2026 snapshot | [artificialanalysis.ai](https://artificialanalysis.ai/methodology/intelligence-benchmarking) | read |
| S68 | Open LLM Leaderboard normalisation documentation | Hugging Face | current | [github.com/huggingface/leaderboards](https://github.com/huggingface/leaderboards/blob/main/docs/source/en/open_llm_leaderboard/normalization.md) | secondary |
| S69 | AI benchmarking organization criticized for waiting to disclose funding from OpenAI | TechCrunch | 2025-01-19 | [techcrunch.com](https://techcrunch.com/2025/01/19/ai-benchmarking-organization-criticized-for-waiting-to-disclose-funding-from-openai/) | secondary |

### Standards and regulation

| ID | Source | Body | Date | Link | Depth |
| --- | --- | --- | --- | --- | --- |
| S70 | EU AI Act, Article 55: obligations for providers of general-purpose AI models with systemic risk | European Union | in force | [artificialintelligenceact.eu](https://artificialintelligenceact.eu/article/55/) | secondary |
| S71 | AI Risk Management Framework, and the Generative AI Profile (AI 600-1) | NIST | 2023, profile 2024-07-26 | [nist.gov](https://www.nist.gov/itl/ai-risk-management-framework) | secondary |
| S72 | ISO/IEC TS 4213:2022, Assessment of machine learning classification performance | ISO/IEC JTC 1/SC 42 | 2022-10 | [iso.org](https://www.iso.org/standard/79799.html) | secondary |
| S73 | ISO/IEC 42001:2023, AI management systems | ISO/IEC | 2023-12 | [iso.org](https://www.iso.org/standard/42001) | secondary |
| S74 | MLPerf Training benchmark | MLCommons | current | [mlcommons.org](https://mlcommons.org/benchmarks/training/) | secondary |
| S75 | MLPerf Inference rules | MLCommons | current | [github.com/mlcommons](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc) | secondary |

Seventy-five sources: 21 methodology and critique, 32 benchmark papers, 16 institutional and vendor
pages, and 6 standards and regulation entries.

## How the artifacts were produced

| Artifact | Production |
| --- | --- |
| Markdown sections | Written by hand from the sources above |
| `data.json` | Parsed out of the Markdown tables by `build.mjs`, so the data and the prose cannot disagree |
| `report.html` | Generated by `build.mjs` from the Markdown files, with the house design tokens and embedded fonts from the 11agi reports styleguide, plus four inline diagrams |
| Diagrams | Inline SVG, generated in `build.mjs`, each redundant with an adjacent table so the Markdown loses no information |
| `verify.mjs` | The gate described above: 44 checks across structural pins, parity, data agreement, determinism, and hygiene |

The generator reads the styleguide's `fonts.css` and `tokens.css` from a local 11agi checkout, so
rebuilding requires `ELEVEN_AGI_REPO` to be set. The build is deterministic: identical input yields
a byte-identical file apart from the generation timestamp.

## Related reports in this archive

| Report | Overlap |
| --- | --- |
| Reverse engineering WhichAI.dev: a teardown of ui-design-bench | A worked audit of one small benchmark's methodology, using the validity questions in section 01 |
| Interactive Data Visualization Best Practices | How to present the tables and uncertainty this report asks you to publish |
