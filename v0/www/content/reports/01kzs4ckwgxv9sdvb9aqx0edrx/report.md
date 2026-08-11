<!-- 11archive-source: 00-executive-playbook.md -->

# Interactive data visualization: executive playbook

**Created:** 2026-08-11  
**Audience:** product designers, analysts, engineers, researchers, and reviewers  
**Scope:** practical chart selection, visualization anatomy, interaction, accessibility, and a dated audit of Artificial Analysis  
**Evidence boundary:** primary research, standards, official visualization documentation, and direct inspection of public Artificial Analysis pages. No private or premium-only surfaces were audited.

## Result

An effective interactive visualization is a decision interface, not a decorated chart. It should help a defined reader answer a defined question, preserve truthful relationships, make the default view useful, and permit deeper exploration without hiding scope, units, provenance, uncertainty, or exclusions.

The strongest reusable pattern found on Artificial Analysis is a layered chart shell:

1. State the metric, unit, direction of desirability, and methodology.
2. Show a curated default subset and its coverage, such as `27 of 597 models`.
3. Keep entity selection separate from semantic filters.
4. Offer view changes as tabs when the analytical question changes.
5. Use legends as reversible series controls.
6. Add chart-specific analytical aids such as a reference line, target quadrant, confidence interval, component stack, or Pareto frontier.
7. Put appearance controls in a secondary display-settings panel.
8. Provide share and export actions beside the chart.
9. Put definitions and caveats immediately below the visualization.
10. Retain an exact table or download path for verification.

This pattern is worth adopting. Its main risk is control density. Controls must be grouped by effect, have visible state, support keyboard use, expose a reset, and distinguish filtering data from changing only its presentation.

## The seven-question design sequence

| Order | Question | Deliverable | Failure prevented |
|---:|---|---|---|
| 1 | Who decides, and what decision follows? | Audience and decision statement | Attractive but irrelevant chart |
| 2 | What comparison or lookup must be made? | Task: lookup, rank, change, distribution, relationship, composition, geography, flow, hierarchy, process | Wrong chart family |
| 3 | What is each field? | Typed dimensions, measures, units, periods, status, provenance, coverage | Invalid aggregation or scale |
| 4 | Which visual channel carries the main fact? | Primary encoding, usually common-position or length | Imprecise angle, area, or color comparison |
| 5 | What must the default view reveal? | Useful initial subset, sort, domain, annotation, and baseline | Empty canvas or filter-first burden |
| 6 | Which interactions answer a real follow-up? | Filter, select, compare, brush, zoom, drill, export, or explain | Feature accumulation |
| 7 | How will it be verified? | Data table, source note, accessibility test, interaction-state tests, and screenshots | Silent distortion or broken controls |

The task framing follows Brehmer and Munzner's distinction between why a visualization is used, how the user acts, and what data is involved. The interaction model also aligns with Heer and Shneiderman's categories of data and view specification, view manipulation, and process/provenance. See methodology and sources.

## Non-negotiable defaults

- Use a chart only when it reveals a relationship faster than prose or a compact table.
- Prefer position on a shared scale, then length, before angle, area, volume, or color intensity for precise quantitative comparison. This is consistent with Cleveland and McGill's graphical-perception experiments.
- Use zero baselines for ordinary bars because bar length encodes magnitude. If a non-zero baseline is essential, expose and explain it.
- Sort categorical comparisons meaningfully. Default to descending rank, natural sequence, or domain order.
- Show units in the title, axis, header, or metric label. Never make readers infer them.
- State whether higher or lower is better when the direction is not universal.
- Preserve missing, unavailable, and not-applicable states. Never render them as zero.
- Show uncertainty when it can change a conclusion. Use intervals, bands, distributions, samples, or scenario views appropriate to the evidence.
- Do not use color alone. Pair it with labels, shapes, line styles, position, or icons.
- Give every interaction a visible state and a predictable way to clear or reset it.
- Keep tooltips supplemental. Material facts must survive keyboard-only use, touch, export, and static capture.
- Provide a text summary and an exact-data alternative for complex charts.
- Test the empty, loading, partial, no-result, error, and stale-data states, not only the ideal state.

## Chart-choice shortcut

| If the reader needs to… | Start with… | Consider when needed | Usually avoid |
|---|---|---|---|
| Look up exact values | Table | KPI card, heatmap, sparkline column | Dense labels inside a chart |
| Rank categories | Sorted horizontal bar | Dot plot, lollipop, bullet | Pie with many slices |
| Compare two points in time | Slope or dumbbell | Grouped bar | Two unrelated dashboards |
| Follow change over time | Line | Step, area, small multiples, horizon | Category-colored spaghetti |
| Understand a distribution | Histogram plus ECDF or boxplot | Violin, strip, beeswarm, ridgeline | Mean-only bar |
| Relate two measures | Scatter | Bubble, hexbin, 2D density, regression | Dual-axis line without a shared causal story |
| Show part-to-whole | Stacked bar or 100% stacked bar | Treemap, waffle, pie for few stable parts | Many-slice donut |
| Find efficient trade-offs | Scatter with desired region and Pareto frontier | Labeled shortlist, filters | Composite score without components |
| Show flow | Sankey/alluvial | Chord, flow map, parallel sets | Flow width without totals or direction |
| Show hierarchy | Tree or treemap | Icicle, sunburst, dendrogram | Unlabeled radial hierarchy |
| Show geography | Choropleth for rates, proportional symbols for totals | Dot density, contours, flow map | Raw totals in choropleth regions |
| Show uncertainty | Interval/error bar, band, boxplot | Fan chart, quantile dotplot, hypothetical outcomes | Invisible error or decorative transparency |

## Interaction budget

Every control should answer a named question.

| Control | User question | Required behavior |
|---|---|---|
| Entity selector | Which items are in the comparison? | Search, selected count, clear, select all where safe, restore default |
| Semantic filter | Which data qualifies? | Group by dimension, show active values, announce result count |
| Tab/view switch | Which analytical question am I asking? | Preserve compatible selection, change title and explanation |
| Legend toggle | Which series or component matters? | Toggle visibly, retain at least one series or explain empty view |
| Sort | What is highest, lowest, newest, or closest? | Visible direction, deterministic ties, unavailable values last |
| Brush/range | Which interval or region matters? | Keyboard alternative, clear action, linked-view feedback |
| Zoom/pan | Where is local detail? | Bounded domain, reset/overview, readable axes after transform |
| Display setting | How should the same data be drawn? | Separate from data filters, safe defaults, reset |
| Compare/add provider | What alternate implementation should join? | Distinguish model from model-provider endpoint |
| Share/export | How do I reproduce or reuse this view? | Encode state or state limitations; export title, units, legend, and source |

## Definition of done

A visualization is ready when:

- Its question can be stated in one sentence.
- The default view answers that question without interaction.
- The chart family matches the analytical task and data type.
- Baseline, scale, aggregation, sorting, missingness, and uncertainty are honest.
- Title, subtitle, units, period, source, coverage, and limitations are present where material.
- Controls are minimal, grouped, labeled, keyboard operable, and resettable.
- Selection and filter changes update both the chart and a programmatically available status.
- Hover content also works on focus and satisfies dismissible, hoverable, persistent behavior.
- A table or structured alternative exposes exact values and chart meaning.
- The chart works at narrow width, 200% zoom, dark/light themes, and without color perception.
- Static image/data exports preserve enough context to stand alone.
- Automated tests cover default, changed, empty, and reset states; direct review covers legibility and interpretation.

## Report map

- Chart taxonomy and selection
- Anatomy, controls, interaction, and accessibility
- Artificial Analysis visualization and control audit
- Glossary
- Methodology, coverage, limitations, and sources

---

<!-- 11archive-source: 01-chart-taxonomy-and-selection.md -->

# Chart taxonomy and selection

This is a practical catalog, not a claim that every named chart is fundamentally unique. Many chart names are compositions of primitive **marks** such as points, bars, lines, areas, rectangles, rules, and text. Vega-Lite formalizes those primitives and adds composite boxplot, error-band, and error-bar marks. Selection should begin with the reader's task and the data's semantics, not the novelty of a form.

## 1. Exact lookup, status, and summary

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Data table | Values arranged in rows and columns with semantic headers | Exact lookup; dense multi-metric comparison | A visual pattern matters more than individual cells |
| Pivot table | Table aggregating measures across row and column dimensions | Cross-tabulation and slice-and-dice | Aggregation hides material record-level variation |
| KPI card | One prominent value with label, unit, period, and optional delta | Monitoring a small set of decision metrics | Many metrics create a wall of unrelated numbers |
| Scorecard | Structured set of KPIs with targets and status | Balanced operational monitoring | Thresholds are arbitrary or status is color-only |
| Sparkline | Tiny axis-light line or bar embedded in text or a table | Compact trend context beside exact values | Exact scale, uncertainty, or event timing matters |
| Bullet chart | Measure against qualitative ranges and a target marker | Actual versus target with compact context | Ranges are not meaningful or comparable |
| Gauge | Value on a bounded radial or linear scale | Familiar single-value status with hard bounds | Precise comparison, many gauges, or changing domains |

## 2. Comparison and ranking

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Horizontal bar | Category position plus bar length on a common scale | Ranked categories and long labels | Baseline cannot reasonably include zero |
| Vertical bar/column | Categories on x, magnitude as vertical length | Short labels, time buckets, few categories | Many categories or long names |
| Grouped bar | Side-by-side bars for categories and series | A few series compared within groups | More than roughly 3–4 series or tiny differences |
| Stacked bar | Components stacked to form totals | Total plus broad composition | Interior segments require precise comparison |
| 100% stacked bar | Components normalized to 100% | Composition across groups | Absolute totals also matter but are hidden |
| Diverging bar | Bars extend from a meaningful center, often zero | Positive/negative or agreement/disagreement | Center is arbitrary or scales are asymmetric without notice |
| Dot plot | Points on a common quantitative scale by category | Dense, precise ranking with less ink | Readers expect a zero-baseline magnitude metaphor |
| Lollipop chart | Dot plus stem from baseline | Sparse ranked comparison | Stems add decoration without improving reading |
| Cleveland dot plot | One or more aligned dots per category | Compact multi-series comparison | Too many series cause association errors |
| Dumbbell chart | Two dots connected per category | Before/after or two-condition difference | More than two states or connection implies continuity incorrectly |
| Slopegraph | Lines connect values at two ordered times/states | Direction and magnitude of change | Lines cross excessively or endpoints are crowded |
| Bump chart | Lines show rank changing over time | Rank trajectories | Absolute values matter more than rank |
| Pareto chart | Bars sorted descending plus cumulative-percentage line | Concentration and the “vital few” | Dual scales are not clearly separated and labeled |
| Pictogram/isotype | Repeated icons represent counts or proportions | Low-density public communication | Fractional icons or precision is important |

## 3. Time and change

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Line chart | Ordered points connected to show continuous change | Time series and ordered sequences | Categories are unordered or missing intervals are bridged silently |
| Multi-series line | Several series on one shared time axis | Comparing a small number of trajectories | Too many lines produce spaghetti; use highlight or small multiples |
| Step chart | Values remain constant between change points | Inventory, rates, states, policy levels | Interpolation is actually continuous |
| Area chart | Line with filled area to a baseline | Single series where magnitude and accumulation matter | Truncated baseline exaggerates area |
| Stacked area | Multiple areas sum to a time-varying total | Composition and total over time | Interior series must be compared precisely |
| Streamgraph | Stacked areas around a shifting centerline | Broad composition patterns with many series | Exact values, baseline, or accessibility is important |
| Horizon chart | Folded and color-banded area chart | Many compact time series at equal scale | Readers lack training or color resolution is poor |
| Small-multiple line | Same chart repeated by group with aligned scales | Many trajectories without overlap | Panels use incompatible scales without clear notice |
| Connected scatterplot | A path connects bivariate points in order | Coupled evolution of two measures | Direction/order is not strongly annotated |
| Timeline | Events positioned along time | Sequence, milestones, releases | Dense simultaneous events need lanes or grouping |
| Gantt chart | Task intervals placed on a time axis | Schedules, dependencies, progress | Uncertainty and resource constraints are omitted |
| Calendar heatmap | Color cells arranged by calendar position | Daily seasonality and anomalies | Exact values or non-daily periods matter |
| Candlestick/OHLC | Open, high, low, close per interval | Financial range and direction | Non-specialist audience or volume is the main story |
| Control chart | Time series with process center and control limits | Detecting special-cause process variation | Limits are confused with targets or confidence intervals |
| Fan chart | Nested uncertainty bands widen through time | Forecast distributions | Bands are unlabeled or treated as deterministic boundaries |

## 4. Distribution and uncertainty

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Histogram | Counts or density within numeric bins | Distribution shape | Bin width is arbitrary and sensitivity is hidden |
| Frequency polygon | Lines connect histogram-bin frequencies | Comparing several distributions | Sparse samples create misleading smoothness |
| KDE/density plot | Smoothed estimate of a continuous distribution | Shape comparison with adequate samples | Bandwidth choice is undisclosed or bounded data leaks outside range |
| ECDF | Cumulative share at or below each value | Full distribution and percentile lookup | Audience cannot interpret cumulative probability |
| Boxplot | Median, quartiles, whiskers, and possible outliers | Compact comparison of many distributions | Multimodality or sample size matters |
| Violin plot | Mirrored density by group | Distribution shape across groups | Small samples or bandwidth artifacts |
| Strip/jitter plot | Individual observations displaced to reduce overlap | Small-to-medium samples and raw variation | Very large samples overplot |
| Beeswarm | Individual points packed without overlap | Exact sample distribution at moderate size | Packing implies a density scale readers may overinterpret |
| Ridgeline | Multiple density curves vertically offset | Distribution change across ordered groups | Overlap conceals baselines or too many groups |
| Raincloud | Density, box summary, and raw points together | Rich distribution comparison | Space is limited or layers overwhelm |
| Q–Q plot | Observed quantiles against theoretical/reference quantiles | Distribution diagnostics | Non-technical readers need direct explanation |
| Error bar | Point estimate plus uncertainty interval | Estimate comparison | Interval type and confidence level are absent |
| Error band | Shaded interval around a line | Time-varying uncertainty | Opacity overlap and missing interval definition |
| Forest plot | Effect estimates and intervals aligned by study/group | Comparative uncertainty and meta-analysis | Heterogeneous measures share an axis without normalization |
| Quantile dotplot | Fixed number of dots represents probability mass | Discrete uncertainty and probability judgments | Too many dots or unexplained sampling metaphor |
| Hypothetical outcome plot | Animation cycles through plausible outcomes | Uncertainty as repeated possible worlds | Motion cannot be paused or compared; static alternative absent |
| Gradient interval | Fading density or confidence along an interval | Continuous uncertainty around an estimate | Gradient is not perceptually calibrated |

## 5. Relationship and correlation

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Scatterplot | One point per observation on two quantitative axes | Correlation, clusters, outliers, trade-offs | Heavy overplotting; aggregate or sample carefully |
| Bubble chart | Scatterplot with area encoding a third measure | Three-variable overview | Area comparison must be precise or sizes dominate |
| Hexbin plot | Counts aggregated into hexagonal spatial bins | Dense bivariate distributions | Binning hides sparse outliers |
| 2D density/contour | Lines or color show density in two dimensions | Dense clusters and distribution shape | Contour thresholds are unexplained |
| Regression plot | Scatterplot plus fitted model and often interval | Trend estimation | Fit suggests causation or model assumptions are hidden |
| Residual plot | Residuals against fit or predictor | Model diagnostics | Readers cannot link residual definition to model |
| Correlogram | Matrix encodes pairwise correlations | Many-variable correlation overview | Correlation is treated as causation or nonlinear relations matter |
| Scatterplot matrix/SPLOM | Grid of pairwise scatterplots | Multivariate relationships | Variable count makes cells unreadable |
| Parallel coordinates | One polyline crosses multiple variable axes | Multivariate profiles and clusters | Axis ordering/scaling is arbitrary or lines overwhelm |
| Radar/spider chart | Radial axes connect a multivariate profile | Familiar profile shape across few normalized measures | Precise comparison, negative values, differing units, many profiles |
| Ternary plot | Position represents three parts summing to a constant | Three-component compositions | Values do not sum to a fixed total |
| Bland–Altman plot | Difference between two methods versus their mean | Agreement between measurement methods | Used as a generic correlation chart |

## 6. Composition and contribution

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Pie chart | Angles/areas encode parts of one whole | Two to five clearly different, non-negative parts | Ranking, close values, many parts, or multiple pies |
| Donut chart | Pie chart with a center hole | Few parts plus a central total label | Hole reduces already imprecise area/angle reading |
| Waffle chart | Grid cells represent proportional units | Simple percentages in public communication | Precision exceeds cell resolution |
| Treemap | Nested rectangles encode hierarchy and magnitude by area | Part-to-whole hierarchy in compact space | Precise sibling comparison or negative values |
| Sunburst | Concentric arcs encode hierarchical levels and area/angle | Compact radial hierarchy | Labels and cross-branch comparison matter |
| Icicle chart | Stacked rectangles encode hierarchical depth and width | Hierarchy with more readable alignment than sunburst | Deep trees become too thin |
| Mosaic plot | Rectangle areas encode contingency-table proportions | Association between categorical variables | Audience is unfamiliar or labels are crowded |
| Marimekko | Variable-width stacked columns encode two dimensions | Market share across differently sized groups | Precise cross-column comparison |
| Waterfall | Sequential positive and negative contributions bridge totals | Explaining change from start to finish | Contributions overlap or order is arbitrary |
| Funnel chart | Stage widths encode remaining volume | Sequential conversion stages | Area exaggerates differences or cohorts are incomparable |
| Population pyramid | Back-to-back bars by ordered group | Two-sided age/demographic composition | Scales differ by side or totals are not comparable |

## 7. Hierarchy, network, and flow

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Node-link graph | Nodes connected by edges | Paths and local topology | Dense graphs become hairballs; use matrix or filtering |
| Adjacency matrix | Rows and columns are nodes; cells encode edges | Dense networks, clusters, exact adjacency | Path tracing is the primary task |
| Force-directed graph | Simulation places connected nodes near each other | Exploratory topology and communities | Position is mistaken for a measured coordinate |
| Arc diagram | Nodes on a line with curved edges | Sequence plus connections | Many crossing arcs obscure counts |
| Chord diagram | Arc sectors are groups; ribbons encode bilateral flow | Compact symmetric relationships | Direction and exact comparison matter |
| Sankey diagram | Flow widths connect staged nodes | Directional magnitude through a process | Cycles, uncertainty, or totals do not conserve |
| Alluvial diagram | Ribbons connect categorical strata across stages | Membership changes and composition | Individual paths are implied from aggregate flows |
| Parallel sets | Categorical counterpart to parallel coordinates | Multistage categorical relationships | Many categories create crossings |
| Tree diagram | Parent-child nodes arranged by depth | Explicit hierarchy and path tracing | Breadth/depth exceeds viewport |
| Dendrogram | Branch lengths show hierarchical clustering | Cluster relationships and merge distances | Branch order is treated as rank |
| Dependency graph | Directed nodes and links show prerequisites | Software, task, or system dependencies | Cycles or edge semantics are unclear |

## 8. Geography and spatial data

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Choropleth | Region fill encodes a normalized value | Rates or ratios by administrative area | Raw counts, unequal populations, or arbitrary class breaks |
| Proportional-symbol map | Symbol area encodes magnitude at locations | Totals and events | Symbols overlap or area is read as radius |
| Dot-density map | Dots represent a fixed quantity within regions | Spatial distribution of counts | Dots imply exact addresses or random placement is undisclosed |
| Cartogram | Region geometry is distorted by a measure | Emphasizing population/weight | Geographic recognition is essential |
| Flow map | Lines/arrows between locations encode movement | Origin-destination patterns | Dense routes and direction ambiguity |
| Hexbin/grid map | Space or regions mapped into equal cells | Reducing area-size bias and showing density | Geographic boundaries/adjacency must be exact |
| Contour/isoline map | Lines connect equal values | Continuous spatial fields and thresholds | Interpolation is unsupported by sampling density |
| Raster/heat map | Cell color encodes a continuous spatial surface | Temperature, elevation, probability | Resolution and interpolation are hidden |
| Isochrone map | Bands show equal travel time/distance | Accessibility and catchment analysis | Routing assumptions and time conditions are absent |
| Bivariate choropleth | Combined color encodes two regional measures | Joint spatial patterns | Legend is too complex or color classes are not separable |

## 9. Process, architecture, and explanatory diagrams

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Flowchart | Directed steps and decisions | Process logic | Timing, responsibility, or data volume is the core story |
| Swimlane diagram | Flowchart partitioned by actor/system | Responsibility and handoffs | Lanes become long and cross excessively |
| BPMN diagram | Standardized process notation | Formal business processes | Audience does not know the notation |
| Sequence diagram | Lifelines and messages ordered through time | System interactions and protocols | Physical architecture is the main question |
| State diagram | States and transitions | Lifecycle and allowed changes | Concurrent states are not represented |
| Architecture diagram | Components and typed connections | System structure and boundaries | Visual layout implies undocumented execution order |
| Entity-relationship diagram | Entities, attributes, and relationships | Data-model structure | Runtime flow or operational dependency |
| Decision tree | Branches represent tests and outcomes | Rule logic and classification paths | Probabilities, pruning, or uncertainty are missing |
| Causal diagram/DAG | Directed edges encode asserted causal relations | Causal assumptions and adjustment logic | Mere correlations are presented as causes |
| Mind map | Radial associative hierarchy | Ideation and conceptual grouping | Evidence, order, or dependency must be precise |

## 10. Specialized analytical forms

| Form | Definition | Best for | Avoid or qualify when |
|---|---|---|---|
| Heatmap | Rectangular cells encode magnitude with color | Matrix patterns and dense repeated measures | Exact values or color discrimination is critical |
| Calendar/cohort retention matrix | Rows are cohorts; columns are elapsed periods | Retention and lifecycle patterns | Denominators vary without labels |
| Confusion matrix | Actual versus predicted classes with counts/rates | Classification error structure | Class imbalance and normalization are hidden |
| ROC curve | True-positive versus false-positive rate by threshold | Ranking classifiers across thresholds | Rare-positive decisions where precision matters more |
| Precision–recall curve | Precision versus recall by threshold | Imbalanced classification | Prevalence differs across compared datasets |
| Calibration plot | Predicted probability versus observed frequency | Probability reliability | Sample size per bin is hidden |
| Kaplan–Meier curve | Estimated survival probability over time | Time-to-event with censoring | Risk table and uncertainty are omitted |
| Funnel plot | Effect or rate versus precision/sample size | Publication bias or process outliers | Confused with conversion funnel |
| Volcano plot | Effect size versus statistical significance | High-throughput comparisons | Significance substitutes for practical importance |
| Manhattan plot | Genomic position versus association strength | Genome-wide association peaks | Multiple-testing threshold or locus context omitted |
| Nomogram | Scales convert predictor values into a score/probability | Manual clinical/statistical prediction | Model validity and uncertainty are absent |

## Selection rules by data shape

| Data shape | Strong default | Important question |
|---|---|---|
| One categorical + one quantitative field | Sorted bar or dot | Must magnitude start at zero? |
| One temporal + one quantitative field | Line | Are intervals regular and missing periods explicit? |
| One quantitative field | Histogram plus ECDF or box summary | Is sample size sufficient and are bins disclosed? |
| Two quantitative fields | Scatter | Is density high enough to require binning/contours? |
| Category + two quantitative fields | Scatter with color or facets | Is color categorical and redundant? |
| Whole plus parts | Stacked bar | Do values sum to a meaningful, non-overlapping total? |
| Hierarchical categories + value | Treemap or tree | Is the task magnitude comparison or path tracing? |
| Origin, destination, magnitude | Sankey or flow map | Does width conserve quantity and is direction visible? |
| Geographic region + rate | Choropleth | Is normalization appropriate and classification disclosed? |
| Estimate + uncertainty | Error bar/band or distribution | Which interval and confidence/probability does it encode? |
| Many variables | Small multiples, heatmap, SPLOM | Which subset supports the decision without hiding the rest? |

## Common misleading patterns and fixes

| Problem | Why it misleads | Fix |
|---|---|---|
| Truncated bar baseline | Length differences are exaggerated | Include zero or change to a point/line encoding and disclose the domain |
| Dual axes | Unrelated scale choices manufacture correlation | Normalize, facet, index to a baseline, or state why dual axes are necessary |
| 3D bars/pies | Perspective distorts length, angle, and area | Use a 2D common-scale form |
| Rainbow scale for ordered data | Hue is not perceptually ordered and creates false boundaries | Use a perceptually ordered sequential or diverging scale |
| Choropleth of totals | Large/populous regions dominate interpretation | Map rates or use proportional symbols for totals |
| Smoothed line across missing data | Implies observations and continuity that do not exist | Break the line, mark missing intervals, or show interpolation explicitly |
| Mean-only bar | Conceals sample distribution and uncertainty | Add raw points, intervals, box/violin, or sample counts |
| Pie with many close slices | Angle and area comparisons are imprecise | Use a sorted bar or table |
| Packed bubbles for rank | Area and packing impair lookup | Use bars/dots; retain bubbles only when topology/compactness matters |
| Unlabeled log scale | Distances are misread as linear differences | Label the scale, ticks, zero impossibility, and rationale |
| Auto-sorted time/categories | Destroys chronological or semantic order | Lock meaningful order and make sort explicit |
| Filtering without coverage | A polished subset appears complete | Show `selected of eligible`, active filters, exclusions, and reset |

## Sources used for this taxonomy

- [Vega-Lite mark types](https://vega.github.io/vega-lite/docs/mark.html)
- [Vega-Lite encoding channels](https://vega.github.io/vega-lite/docs/encoding.html)
- [Cleveland and McGill, Graphical Perception](https://doi.org/10.1080/01621459.1984.10478080)
- [Brehmer and Munzner, A Multi-Level Typology of Abstract Visualization Tasks](https://www.cs.ubc.ca/labs/imager/tr/2013/MultiLevelTaskTypology/)
- [ColorBrewer](https://colorbrewer2.org/)

---

<!-- 11archive-source: 02-anatomy-controls-interaction-accessibility.md -->

# Anatomy, controls, interaction, and accessibility

## 1. Visualization anatomy

A chart is a system of data, transformations, marks, encodings, scales, guides, annotations, controls, states, and provenance.

| Component | Definition | Required practice |
|---|---|---|
| Objective | The decision or question the view supports | Write it before choosing a chart |
| Audience | People expected to interpret or operate the view | Match terminology, density, and interaction to their expertise |
| Data model | Typed observations, dimensions, measures, units, time, status, and provenance | Preserve raw and derived values separately |
| Transform | Filter, calculate, aggregate, bin, normalize, rank, join, sample, or smooth | Disclose transformations that change interpretation |
| Mark | Primitive graphical object: point, line, bar, area, rect, rule, text, or geographic shape | Choose geometry that matches the task |
| Encoding channel | Visual property carrying a field: x/y position, length, color, size, shape, opacity, angle, text | Give the primary fact the most accurate channel |
| Scale | Function mapping a data domain to a visual range | Choose linear, log, time, band, ordinal, sequential, diverging, or threshold deliberately |
| Axis | Guide for a positional scale: domain line, ticks, labels, grid, title | Label unit and use readable, honest ticks |
| Legend | Guide for color, size, shape, opacity, or line style | Place near the plot; make interactive state visible if clickable |
| Plot area | Region in which data marks appear | Protect from label overlap and excessive decoration |
| Baseline | Reference from which magnitude is judged | Use zero for ordinary bars; label special baselines |
| Reference line/band | Target, threshold, benchmark, normal range, or event | Identify source and meaning; do not imply certainty |
| Annotation | Text or graphic directing attention to a material fact | Explain why it matters, not merely restate a value |
| Title | Concise statement of subject or finding | Include metric and scope; avoid unexplained acronyms |
| Subtitle/deck | Definition, unit, period, direction, or method under the title | Make the chart interpretable without hunting |
| Caption/source note | Provenance, freshness, method, exclusions, uncertainty | Keep it visible in screenshots and exports |
| Tooltip | On-demand detail tied to a mark | Supplemental, focusable, dismissible, hoverable, persistent |
| Control bar | Filters, selectors, view switches, and display settings | Group by effect and preserve a stable order |
| Status/coverage | Selected count, eligible count, loading/no-data/error state | Update visibly and programmatically after interaction |
| Exact-data view | Table or download of values behind the chart | Maintain parity with filters and units |

Vega-Lite defines position, geographic position, mark-property, text/tooltip, detail, order, and facet channels, and automatically derives many scales and guides. That grammar is a useful checklist even when another library is used: [encoding documentation](https://vega.github.io/vega-lite/docs/encoding.html), [axes](https://vega.github.io/vega-lite/docs/axis.html), [legends](https://vega.github.io/vega-lite/docs/legend.html), and [scales](https://vega.github.io/vega-lite/docs/scale.html).

## 2. Encoding hierarchy

For precise quantitative comparison, prefer:

1. Position on a common scale.
2. Position on non-aligned but comparable scales.
3. Length.
4. Angle or slope when the directional relationship is the question.
5. Area.
6. Volume.
7. Color luminance/saturation.

This is a pragmatic adaptation of Cleveland and McGill's experimental ordering. It is not a universal ban on lower-ranked channels. Area is appropriate for geographic proportional symbols; color is appropriate for dense matrices; angle is appropriate when direction is itself the phenomenon. The rule is to match perceptual precision to decision risk.

Use redundant encoding when failure to distinguish a series would change the conclusion. Examples:

- Color + direct label.
- Color + line dash.
- Color + point shape.
- Fill + outline + text status.
- Position + icon for a target or reasoning-model status.

## 3. Scale and baseline rules

| Decision | Use | Guardrail |
|---|---|---|
| Linear scale | Additive differences over a regular numeric domain | Inspect outliers and range compression |
| Log scale | Orders of magnitude, positive values, multiplicative change | Label base; never hide zero/negative exclusions |
| Symlog scale | Signed values spanning orders of magnitude | Explain the linear region near zero |
| Time scale | Continuous dates/times | State timezone, aggregation window, and missing intervals |
| Band/point scale | Discrete categories | Preserve semantic order or expose sort |
| Sequential color | Ordered low-to-high values | Maintain monotonic lightness and label endpoints |
| Diverging color | Deviation around a meaningful center | State center and balance both sides |
| Qualitative color | Unordered categories | Limit simultaneous colors and keep identity stable |
| Threshold/binned color | Named ranges or operational bands | Show cut points and avoid false precision |

ColorBrewer separates qualitative, sequential, and diverging schemes and provides color-vision-aware options: [ColorBrewer 2.0](https://colorbrewer2.org/). Do not adopt a palette only because it looks attractive; verify contrast, ordering, semantic associations, dark/light behavior, printing, and color-vision deficiency.

## 4. Control taxonomy

### Data-scope controls

| Control | Use | Design requirements |
|---|---|---|
| Search/filter field | Find entities or reduce a table | Debounce expensive updates; show result count and clear action |
| Multi-select entity picker | Choose exact items | Search, selected state, count, sensible default, reset; virtualize long lists |
| Checkbox/chip group | Apply categorical filters | Visible selected/unselected state; wrap accessibly; no color-only state |
| Radio group/segmented control | Choose one mutually exclusive option | One default; arrow-key behavior; short labels |
| Range slider | Restrict a numeric or temporal interval | Numeric inputs or keyboard adjustment; announce current bounds |
| Date range/preset | Select calendar or rolling window | State timezone and inclusive boundaries; show custom range |
| Hierarchical filter | Choose nested categories | Indeterminate parent state; clear scope; search for deep trees |
| Add comparison | Add entity/provider endpoint outside the default | Distinguish object type and prevent duplicates |

### View and encoding controls

| Control | Use | Design requirements |
|---|---|---|
| Tabs | Switch analytical question or metric family | Update title, unit, description, and URL/state where feasible |
| Metric selector | Rebind an axis or measure | Preserve compatible filters; avoid silently changing directionality |
| “Color by” radio | Change grouping/identity encoding | Rebuild legend and retain direct labels/accessible description |
| Legend toggle | Hide/show series or components | Make legend visibly interactive; preserve or explain empty state |
| Sort control | Reorder categories/table rows | State column and direction; deterministic ties; missing values last |
| Scale toggle | Linear/log, absolute/normalized | Treat as material state, not cosmetic; disclose in title/axis/export |
| Stack toggle | Grouped/stacked/100% | Update totals, denominators, tooltips, and accessible summary |
| Label-size slider | Change density/legibility | Bounded values; current value text; reset |
| Label/tick switch | Reduce clutter | Preserve focus/tooltip/exact-data access |
| Pareto/benchmark switch | Add analytical overlay | Explain calculation/source and desirability direction |
| Small-multiple/overlay switch | Separate or combine series | Keep scale policy explicit |

### Navigation and manipulation controls

| Control | Use | Design requirements |
|---|---|---|
| Tooltip/details on demand | Inspect one mark | Trigger on hover and focus; pin/dismiss when needed |
| Point selection | Identify or compare marks | Visible selection and clear action; multi-select modifier documented |
| Brush | Select a continuous region | Linked result count; handles; keyboard/numeric alternative |
| Cross-filter | A selection in one view filters others | Show cause and scope; avoid invisible persistent state |
| Cross-highlight | Selection emphasizes matching marks without removing others | Dim carefully; keep unselected context legible |
| Zoom/pan | Inspect dense local detail | Bound transforms; readable axes; reset/overview; touch support |
| Drill down/up | Move between aggregation levels | Breadcrumb; preserve parent context; prevent dead ends |
| Focus + context | Detailed view plus overview navigator | Synchronize domains and selection |
| Expand/collapse | Reveal detail progressively | Correct `aria-expanded`; preserve focus |

Vega-Lite distinguishes point and interval selections and supports bindings to inputs, legends, and scales. D3 provides zoom, pan, drag, and brush behaviors. Sources: [Vega-Lite selections](https://vega.github.io/vega-lite/docs/selection.html), [parameter binding](https://vega.github.io/vega-lite/docs/bind.html), and [D3 zoom](https://d3js.org/d3-zoom).

### Output and collaboration controls

| Control | Use | Design requirements |
|---|---|---|
| Copy deep link | Share a section or state | Encode compatible view state; warn if filters are not preserved |
| Download image | Reuse a static chart | Include title, unit, period, legend, source, and active-filter note |
| Download data | Verify or recompute | Export the filtered data by default and document schema/units |
| Copy table | Move exact values | Preserve headers and missing-value text |
| Fullscreen | Increase inspection area | Maintain keyboard escape and focus return |
| Save view/preset | Revisit a state | Name owner/scope, show changes, allow delete/reset |

## 5. Default-state design

The initial view is an editorial decision. Treat it as a first-class artifact.

- Select a curated set that answers the most common question.
- Show `selected of eligible` rather than implying complete coverage.
- Pick a meaningful sort and stable tie-break.
- Keep filters inactive unless the product promise is intentionally scoped.
- Use a default time range that reveals the phenomenon without overwhelming.
- Put essential context in the default rendering, not behind a tooltip.
- Preserve enough outliers and counterexamples to avoid a flattering shortlist.
- Provide `Reset to default`, not only `Clear all`. Clearing can produce an unusable blank view.

## 6. Feedback, latency, and state

| State | Visible behavior | Accessibility behavior |
|---|---|---|
| Loading | Preserve layout; show local progress; keep prior view if safe | Announce loading once, then completion/result count |
| Partial | Show available marks plus coverage/exclusion notice | Include partial status in summary |
| No results | Explain active filters and offer clear/reset | Focus stays on triggering control; announce `0 results` |
| No data | Distinguish absent evidence from zero | Use explicit `unavailable` text |
| Error | State what failed and what remains usable | Error role/message; retry is keyboard reachable |
| Stale | Timestamp and warning | Expose freshness in text, not icon alone |
| Selection | Highlight and count | State/checked value programmatically updated |
| Export ready | Confirmation with file/state description | Status message without stealing focus |

For result counts and asynchronous updates, use programmatically determinable status messages. W3C explains that messages such as “18 results returned” should be available to assistive technology without moving focus: [WCAG status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

## 7. Accessibility contract

### Perceivable

- Meet WCAG text and non-text contrast requirements.
- Never use color as the only carrier of meaning. W3C specifically recommends text or other cues: [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color).
- Support 200% text zoom and responsive reflow.
- Provide a short chart description, a visible takeaway, and a structured long description or data table for complex information. W3C's complex-image tutorial recommends descriptions that include scales, values, relationships, and trends: [Complex Images](https://www.w3.org/WAI/tutorials/images/complex/).
- Do not bake essential labels into raster images.

### Operable

- Make all non-path-dependent functions keyboard operable.
- Preserve logical focus order and visible focus.
- Provide alternatives for drag-only brush, resize, or zoom actions.
- Keep pointer targets at least WCAG 2.2's minimum where applicable; 44×44 CSS pixels is the enhanced target.
- Let users pause motion and respect `prefers-reduced-motion`.
- Avoid single-letter shortcuts unless scoped, remappable, or disableable.

### Understandable

- Give controls visible labels; icons may supplement but should not replace ambiguous text.
- Keep terminology, color identity, sort direction, and control placement consistent.
- Distinguish data filters from display settings.
- State active filters and changes.
- Give destructive or expensive operations confirmation/undo; ordinary visualization filters should remain reversible without confirmation.

### Robust

- Prefer native controls, tables, headings, details, and links.
- Custom controls require correct programmatic name, role, state, and value: [WCAG Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value).
- Tooltips and hover cards must also work on focus and be dismissible, hoverable, and persistent: [Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html).
- Use real table headers and header associations: [W3C tables tutorial](https://www.w3.org/WAI/tutorials/tables/).
- If an SVG chart is exposed, give it a meaningful accessible name/description and avoid announcing every decorative mark.

## 8. Responsive and performance practice

- Start with one dominant question per view; stack secondary charts vertically on narrow screens.
- Prefer responsive ranges and label strategies, not a uniformly scaled-down desktop chart.
- Move long legends below the plot or turn them into a scrollable/filterable list.
- Switch from direct labels to focus/tooltip plus selected labels as density increases.
- Preserve a minimum plot area; allow horizontal scrolling for wide exact tables.
- Virtualize very long pickers and tables while retaining screen-reader semantics or an accessible paged alternative.
- Aggregate or bin millions of points; disclose aggregation and retain access to outliers.
- Use Canvas/WebGL for very large mark counts only when accessible fallback and export semantics remain available.
- Debounce text/range filters and cancel stale requests.
- Avoid animations on first load. If animated transitions aid object constancy, keep them brief, interruptible, and reduced-motion aware. Heer and Robertson found staged animated transitions can improve graphical perception, but motion is a means, not a default flourish: [Animated Transitions in Statistical Data Graphics](https://idl.uw.edu/papers/animated-transitions).

## 9. Verification matrix

| Layer | Checks |
|---|---|
| Data | Types, units, timezone, denominators, duplicates, nulls, coverage, outliers |
| Transformation | Filter order, aggregation, binning, normalization, ranking, interpolation, sampling |
| Encoding | Baseline, scale type/domain, channel meaning, sort, color semantics, uncertainty |
| Content | Title, unit, period, source, directionality, definitions, caveats, active filters |
| Interaction | Default, select, multi-select, filter, sort, brush, zoom, drill, clear, reset, back/forward |
| State | Loading, slow, partial, zero, no data, error, stale, offline where relevant |
| Accessibility | Keyboard, focus, screen-reader labels/states, contrast, color deficiency, reduced motion, 200% zoom |
| Responsive | Narrow/mobile, long labels, dense data, localization, print/export |
| Parity | Chart, table, download, screenshot, and linked view agree |
| Performance | Time to first useful view, interaction latency, stale-request cancellation, memory |

## 10. Minimal control API example

```json
{
  "view": "quality-vs-cost",
  "entities": ["model-a", "model-b", "model-c"],
  "filters": {
    "license": ["open", "proprietary"],
    "reasoning": [true],
    "releaseDate": { "from": "2026-01-01", "to": "2026-08-11" }
  },
  "encoding": {
    "x": "qualityIndex",
    "y": "costPerTaskUsd",
    "colorBy": "creator",
    "scaleY": "log"
  },
  "overlays": {
    "desiredRegion": true,
    "paretoFrontier": true,
    "labels": "selected"
  },
  "meta": {
    "timezone": "UTC",
    "dataAsOf": "2026-08-11T00:00:00Z",
    "schemaVersion": 1
  }
}
```

Separate `filters` from `encoding` and `overlays`. This makes URLs, tests, reset behavior, analytics, and exports easier to reason about.

---

<!-- 11archive-source: 03-artificial-analysis-audit.md -->

# Artificial Analysis visualization and control audit

**Observed:** 2026-08-11  
**Method:** direct browser inspection of public desktop pages plus official page text and methodology. Dynamic content is a point-in-time observation and may change. Premium-only and authenticated surfaces were excluded.

## 1. Result

Artificial Analysis uses a highly reusable visualization system rather than a collection of unrelated charts. Across audited pages, the stable chart shell is:

```text
section navigation
  → metric/view tabs
    → chart title + definition + directionality
      → copy link | image export | data export
      → entity selector + coverage count
      → semantic filters
      → chart display settings
      → chart-specific controls and legend toggles
      → interactive SVG/application
      → expandable definitions, methodology, caveats
```

The product's strongest design decision is separation of concerns:

- **View tabs** change the analytical question.
- **Entity selectors** change which models/providers/categories are compared.
- **Filters** change eligibility by semantic attributes.
- **Legends** toggle series/components.
- **Display settings** change labels, ticks, and analytical overlays.
- **Prompt or pricing presets** change measurement assumptions.
- **Share/download actions** turn the view into a portable artifact.

This enables one chart location to support ranking, decomposition, trade-off, trend, variance, and provider-specific questions without duplicating the page.

## 2. Audited surface coverage

| Surface | Public URL inspected | Distinct evidence collected |
|---|---|---|
| Home analytics | [artificialanalysis.ai](https://artificialanalysis.ai/) | Cross-domain chart shell; ranking, stacked cost, scatter/Pareto, trends, filters, display settings |
| AI Trends | [trends](https://artificialanalysis.ai/trends) | 6 sections; 18 visible entity selectors; time series, bands, rankings, scatter, size/architecture analysis |
| LLM leaderboard | [leaderboards/models](https://artificialanalysis.ai/leaderboards/models) | 252-row dense table; search, facet filters, column groups, expandable columns |
| Model detail | [Claude Opus 5 example](https://artificialanalysis.ai/models/claude-opus-5) | 10 major sections; 50 view tabs; compare control; breakdown, variance, time, price, latency |
| Coding agents | [agents/coding-agents](https://artificialanalysis.ai/agents/coding-agents) | Index, benchmark breakdown, token/cost distributions, time/turns; `Color by` radio |
| Image leaderboard | [image/leaderboard/text-to-image](https://artificialanalysis.ai/image/leaderboard/text-to-image) | 144-row Elo table; CI, samples, category/status/openness/ranking filters |
| Video comparison | [video/models](https://artificialanalysis.ai/video/models) | Quality, price, generation time, trade-offs, boxplot, time series; modality/audio tabs |
| Image arena | [embedded image arena](https://artificialanalysis.ai/embed/text-to-image-leaderboard/arena) | Blind pairwise vote workflow; prompt submission; generation/editing modes |
| Video arena | [embedded video arena](https://artificialanalysis.ai/embed/text-to-video-leaderboard/arena) | Audio/no-audio and modality modes; voting and player keyboard shortcuts |
| Text-to-speech leaderboard | [text-to-speech/leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard) | 92-row Elo table; category, accent, openness, global/personal, creator filters |
| Speech-to-speech | [speech-to-speech](https://artificialanalysis.ai/speech-to-speech/) | Index, dataset/domain/category breakdown, cost/speed trade-offs, 36-row metric table |
| Provider detail | [CoreWeave example](https://artificialanalysis.ai/providers/coreweave) | Prompt options, blended-price presets, intelligence/price/speed/latency/time tabs, 23-row table |

Coverage is representative of every major public visualization product family found in the main navigation. It is not an exhaustive crawl of every entity detail page or every provider because those pages reuse the same chart system with different data.

## 3. Visualization types observed

| Observed form | Artificial Analysis use | Supporting controls | Design lesson |
|---|---|---|---|
| Ranked horizontal bar | Intelligence, output speed, cost, evaluation scores, Elo | Entity picker, filters, label/tick settings, link/export | Long model labels and clear higher/lower direction fit horizontal ranking |
| Grouped bar | Multiple metrics or datasets per model | Metric tabs, model/agent color switch, legend buttons | Group only a few series; let tabs carry alternate questions |
| Stacked bar | Cost/token components, openness components | Component legend toggles | Components remain reversible and definitions sit below |
| 100%/normalized comparison | Dataset/category contribution and index components | Dataset/category tabs, legend | Make denominator and inclusion rule explicit |
| Scatter/trade-off plot | Intelligence vs cost/time/tokens/speed; quality vs price/time; provider performance | Entity picker, filters, creator/provider legend, desired region, Pareto line, labels | Encode desirability spatially and explain the efficient frontier |
| Time-series line | Frontier intelligence, capex, speed/latency/generation time over time | Creator/range picker, legend toggles, display settings | Use selectors to control line count and definitions to explain aggregation window |
| Band/range chart | Prompt-type or performance variation over time | Prompt options, metric tabs | Pair distributions/ranges with median definition and measurement window |
| Boxplot | Video API generation-time variance | Entity picker, provider add, explanatory `Boxplot` note | Strong complement to median rankings |
| Confidence interval/range | Elo leaderboards and endpoint accuracy | Table CI column, reference classification | Uncertainty remains visible beside rank |
| Reference/threshold overlay | Human baseline, reference endpoint 100%, target/attractive region | Display/legend switches | Explain whether the line is target, baseline, or statistical reference |
| Pareto frontier | Cost/quality, price/speed, time/quality trade-offs | Display switch plus `Most attractive quadrant/region` | A calculated overlay can turn scatter exploration into decision support |
| Dense comparison table | Model/provider leaderboards and metric summaries | Text search, facet buttons, grouped columns, column expansion | Exact values remain available beside charts |
| KPI/highlight cards | Home intelligence/speed/cost summary | Linked to deeper sections | Provide fast orientation before exploration |
| Arena pairwise comparison | Image/video/speech preference evaluation | Prompt, mode, vote, keyboard shortcuts, reveal | Interaction is the data-collection method, not only presentation |

No Sankey, chord, geographic map, tree, or network visualization was observed in the audited public surfaces. Country analysis used categorical comparison/time views, not a geographic map.

## 4. Common chart toolbar

### 4.1 Share and export

Observed beside most charts:

- `Copy link to this section`
- `Download chart as image`
- `Download data`

Some provider-accuracy charts omitted data download in the inspected state. The placement is effective because exports are tied to the chart they describe. A robust implementation should include active filters, selected entities, units, metric version, and data-as-of metadata in both image and data exports.

### 4.2 Entity selector

Observed label pattern: `27 of 597 models`, `14 of 57 model creators`, `7 of 7 ranges`, `15 of 15 providers`.

The inspected model selector provided:

- Search input.
- Curated default selection.
- Long virtualized/listbox-style inventory.
- `Clear`.
- `Select all`.
- `Reset (to default)`.

This is a particularly good pattern. `Clear` and `Reset` are not synonyms. Reset restores the editorially useful view; clear supports deliberate empty/zero-state exploration.

### 4.3 Semantic filters

The home Intelligence chart exposed a dedicated `Filters` panel:

| Group | Values observed |
|---|---|
| Open Weights | Open Source; Proprietary |
| Size Class | Tiny; Small; Medium; Large |
| Reasoning | Reasoning; Non Reasoning |
| Input Modality | Image; Speech; Video |

The LLM leaderboard used compact facet buttons:

| Filter | Values observed |
|---|---|
| Weights | Open; Proprietary |
| Size | Tiny `<4B`; Small `4B–40B`; Medium `40B–150B`; Large `>150B`; Unknown |
| Price | Low `<$0.15/1M tokens`; Medium `$0.15–$1/1M`; High `>$1/1M` |
| Reasoning | Reasoning; Non-Reasoning |
| Status | Current |

The filter values include definitions, not only labels. That reduces interpretation errors. The implementation should preserve the distinction between `open weights`, `open source`, and license restrictions throughout the interface.

### 4.4 Add provider-specific comparison

Charts exposed `Add model from specific provider`. Activating it added a second selector whose observed state read `0 of 862 model & provider combinations`.

This solves an important data-model distinction:

- **Model-level point:** model identity and aggregated/first-party performance.
- **Endpoint-level point:** a specific model served by a specific provider and configuration.

The distinction should stay visible in label, tooltip, export, and URL state. Otherwise users may compare model capability with endpoint performance as if they were the same entity.

### 4.5 Display settings

The inspected `Display` panel contained:

| Setting | Observed control/state |
|---|---|
| Label size | Slider, 9–13 px, current 11 px |
| Bar ticks | Switch, on |
| Scatter labels | Switch, on |
| Pareto line | Switch, on |

The panel is global enough to expose settings that may not affect the current mark type. This simplifies consistency but can create irrelevant controls. Recommended fix: disable or hide inapplicable options while keeping the panel order stable, and explain whether a setting is per chart, per page, or global.

### 4.6 Legend as filter

Legends were rendered as buttons for:

- Creators/providers, such as Anthropic, OpenAI, Google, Meta, Kimi, DeepSeek.
- Cost/token components: Answer, Reasoning, Cache Write, Cache Hit/Read, Input, Output.
- License categories: Proprietary, Open Weights, Commercial Use Restricted.
- Reference classes: Reference 100%, Within reference, Below reference.
- Countries, architecture types, index bands, and other groups.

Interactive legends reduce control duplication. Requirements:

- Show pressed/selected state programmatically.
- Do not rely on opacity alone.
- Prevent an unexplained blank plot when all series are off.
- Keep color assignment stable across charts and tabs.

## 5. Page-specific controls

### 5.1 AI Trends

The Trends page used section navigation for `AI Progress`, `Efficiency`, `Country Analysis`, `Open Source Models`, `Model Architecture`, and `Training Analysis`. Observed view families included:

- Frontier Intelligence over time.
- Capital expenditure by company over time.
- Intelligence versus release date.
- Leading models by lab/country.
- Price and output speed by Intelligence Index band over time.
- Open-weights versus proprietary progress.
- Dense versus mixture-of-experts architecture.
- Total versus active parameters.
- Context length by quarter.
- Training tokens and intelligence relationships.

The strong pattern is progressive thematic navigation with a stable chart toolbar. Risk: the page is very long and contains many selectors. Recommended fix: retain sticky section navigation, deep links, and active-filter summaries; lazy-load charts without shifting the page.

### 5.2 LLM leaderboard

Observed controls:

- Text search: `Filter, e.g. GPT, Meta`.
- `Expand columns`.
- Weights, size, price, reasoning, and status filters.
- Grouped column buttons: Features, Intelligence, Price, Speed, Latency, End-to-End Response Time.
- Sortable-looking header controls for Model, Context Window, Creator, Intelligence Index, Cost per Task, Tokens/s, First Chunk, and Total Response.
- Expandable method notes.

The table preserves a full exact-value surface. Recommended improvements:

- Make sort state explicit through `aria-sort`.
- Keep the Model identity column sticky during horizontal scroll.
- Announce filter result count.
- Define whether `Expand columns` changes only visibility or also downloads.

### 5.3 Model and provider detail pages

These pages are small dashboards generated from the same system. Observed view tabs included:

- Intelligence Index and benchmark/evaluation breakdowns.
- Intelligence versus cost, time, output tokens, output speed, response time, context window, parameters, or training tokens.
- Cost per task, total evaluation cost, cache/input/output pricing, blended price, stacked price, cache discount, log/inverted price.
- Output speed, speed by prompt type, variance, over time, and speed versus price/latency.
- Time to first answer token versus time to first token.
- Latency by prompt type, variance, and over time.
- End-to-end response time, prompt-type breakdown, price trade-off, and over time.

Provider pages added a global `Prompt Options` panel:

| Group | Options observed |
|---|---|
| Parallel Queries | Single; Multiple (1k tokens only) |
| Prompt Length | 1k tokens; 10k tokens; 100k |
| Action | Apply |

Blended price had presets:

| Ratio | Label |
|---|---|
| 7:2:1 | General agentic (recommended) |
| 3:1 | General chat |
| 0:1:1 | General translation |
| 100:1:1 | Long-context Q&A |
| 0:100:1 | Long-context summarization |

This is excellent domain-specific interaction: assumptions are visible and named by use case. The chart must repeat the selected ratio in title/subtitle/export so it cannot be separated from its calculation.

### 5.4 Coding agents

Observed:

- Product tabs: Coding Agents, General Work, Chatbots, Presentations, OCR, Data Analysis, Customer Support.
- Analysis tabs: Index, Score by Benchmark, individual benchmarks.
- Token tabs: usage, distribution, cache-hit rate, input/output, by benchmark.
- Cost tabs: Cost to Run, Cost Distribution, Total Cost.
- Execution tabs: Execution Time, Turns.
- Repeated `Color by` radio group: Model or Agent.
- Model selector/coverage count.
- Trade-off scatters with attractive quadrant and Pareto line.

The `Color by` control is clearer than a generic legend because it changes the grouping dimension. Preserve that semantic distinction in state and telemetry.

### 5.5 Image, video, and speech leaderboards

Common leaderboard columns:

- Rank and rank range.
- Creator.
- Model.
- Elo.
- 95% confidence interval.
- Sample/comparison count.
- Release date.
- API price.

Image-specific controls observed:

- Category.
- Current models versus all models.
- All, open weights, first-party foundation models.
- Ranked models versus include unranked.
- Global versus personal leaderboard.

Text-to-speech controls observed:

- Category: All, with documented Knowledge Sharing, Assistants, Entertainment, Customer Service categories.
- Accent: All, with US and UK documented.
- All versus open weights.
- Global versus personal leaderboard.
- All models versus top models by creator.
- Per-model voice-count buttons.

Video comparison controls observed:

- Modality: Text to Video, Image to Video, Video Editing.
- Audio state: with audio or no audio variants.
- Model-level versus provider/API-level sections.
- Quality, generation time, and price views.
- Quality versus price/time and time versus price trade-offs.
- Generation-time variance boxplot and over-time view.

Artificial Analysis' video methodology states that modalities have separate Elo pools and that generation-time results use trailing measurements with median and percentile summaries: [video methodology](https://artificialanalysis.ai/video/methodology).

### 5.6 Speech-to-speech

Observed view controls:

- Index versus Index by Dataset.
- Speech Reasoning versus relationship/size views.
- Open-source/proprietary/all buttons.
- Agentic domains: All, Airline, Retail, Telecom.
- Conversational categories: Interruption Handling, Backchannel Handling, Pause Handling, Turn Taking.
- Cost trade-offs for index, reasoning, conversational dynamics, and agentic performance.
- Speed trade-offs.
- Cost measures: per hour, per task, input price, output price.
- Timing measures: time to first audio and conversation audio duration.

The summary table joined quality, cost, and speed measures. This is the exact-value complement to the charts and should remain filtered in sync.

### 5.7 Arenas

Image Arena controls observed:

- Image Arena / Text to Image Leaderboard / Image Editing Leaderboard tabs.
- Submit a prompt.
- Text to Image versus Image Editing.
- Blind preference vote to reveal identities.

Video Arena controls observed:

- Video Arena / Text to Video / Image to Video / Video Editing leaderboards.
- Submit a prompt.
- With Audio versus No Audio.
- Text to Video, Image to Video, Video Editing.
- Keyboard shortcuts for preference, play/pause, player toggle, and restart.

The prompt dialog required text input, displayed `Min: 0/50`, and offered Submit/Close. A robust design should associate the minimum with the textarea, announce remaining characters, preserve draft on accidental close, and never activate character shortcuts while the user is typing.

## 6. What Artificial Analysis does especially well

1. **Metric direction is explicit.** `Higher is better` and `Lower is better` appear near titles.
2. **Coverage is visible.** Selectors show selected and eligible counts.
3. **One shell supports many domains.** Users learn the control grammar once.
4. **Trade-offs are spatially interpreted.** Attractive regions and Pareto frontiers aid decisions.
5. **Exact data is nearby.** Tables and downloads support auditability.
6. **Definitions follow the chart.** Expandable notes explain metrics and methods.
7. **Domain assumptions become presets.** Prompt length and pricing blends are named by use case.
8. **Uncertainty accompanies rankings.** Media/speech leaderboards expose confidence intervals and sample counts.
9. **Model versus endpoint is modeled separately.** Provider-specific additions prevent false equivalence.
10. **Tabs change analytical questions without losing page context.** This supports deep exploration.

## 7. Risks and concrete fixes

| Risk observed or inferred | Why it matters | Suggested fix |
|---|---|---|
| Very dense control bars | New users may not know which control changes data versus appearance | Visually group `Entities`, `Filters`, `View`, `Display`, `Export`; add short labels/tooltips |
| Display panel exposes inapplicable settings | Irrelevant switches reduce trust | Hide/disable by chart type and explain scope |
| Icon-only toolbar actions | Meaning can be hard to discover | Keep accessible names and add persistent text on wide layouts |
| Interactive legend buttons | Selection state may be unclear | Use `aria-pressed`, check marks, and text count; include reset |
| Very long entity lists | Search and keyboard traversal can become expensive | Virtualize carefully, retain accessible count/position, add creator grouping |
| Many tabs on detail pages | Horizontal overflow and discoverability risk | Use scroll buttons, overflow menu, and deep-linkable selected state |
| Attractive quadrant/frontier could appear normative | desirability depends on use case and axis direction | Label assumptions and let users switch metric/weights |
| Curated default subset can appear complete | Readers may not notice hidden models | Keep coverage count adjacent, explain default rule, preserve counterexamples |
| Downloaded image can lose interactive context | Screenshot may omit filters and method notes | Render active filters, timestamp, units, method version, and source into export |
| Shortcuts in arena | Keys can conflict with text input or assistive tech | Scope shortcuts outside fields, offer disable/remap, list them, respect WCAG 2.1.4 |
| Chart applications may expose many graphic elements | Screen-reader experience can become verbose or opaque | Provide concise chart summary plus synchronized semantic table and focused mark navigation only when useful |
| Personal/global leaderboard switch | Personal state can be misread as global evidence | Label population and sample count prominently |

## 8. Reusable product specification

Adopt this order for an Artificial Analysis-inspired chart module:

```text
Title                              [copy] [image] [data]
Metric definition · unit · period · higher/lower is better

[view tabs]
[entities: 12 of 250] [filters: 2 active] [assumption preset] [display]
[active-filter chips]                                      [reset]

chart
legend buttons / direct labels

status: 12 selected · 238 excluded · data as of …
definitions and methodology disclosures
exact-data table
```

Required state schema:

```json
{
  "section": "performance",
  "view": "quality-vs-price",
  "entityType": "model-provider-endpoint",
  "selectedIds": [],
  "filters": {},
  "assumptions": { "promptTokens": 10000, "priceBlend": "7:2:1" },
  "display": { "labelPx": 11, "barTicks": true, "scatterLabels": true, "pareto": true },
  "sort": { "field": "quality", "direction": "descending" },
  "meta": { "metricVersion": "…", "dataAsOf": "…" }
}
```

This schema is inferred from the observed interface. It is not an Artificial Analysis internal implementation claim.

---

<!-- 11archive-source: 04-glossary.md -->

# Data visualization glossary

Chart-form definitions are in Chart taxonomy and selection. This glossary defines the data, statistical, visual, interaction, accessibility, and product terms used across the report.

## A–C

| Term | Definition |
|---|---|
| Accessibility tree | Programmatic representation of interface structure, names, roles, values, and states used by assistive technology. |
| Active filter | A filter currently restricting the eligible data. Its value and effect should be visible. |
| Aggregation | Combining observations, such as sum, count, mean, median, minimum, maximum, or percentile. |
| Analytical question | Specific lookup, comparison, pattern, or decision the visualization must support. |
| Annotation | Explanatory text or graphic attached to a data point, interval, event, or region. |
| Area encoding | Mapping a quantity to two-dimensional size. Less precise for comparison than common position or length. |
| ARIA | Accessible Rich Internet Applications specification for supplementing semantics when native HTML is insufficient. |
| Aspect ratio | Plot width divided by height. It affects perceived slopes, density, and label space. |
| Axis | Guide that visualizes a positional scale using a line, ticks, labels, gridlines, and title. |
| Baseline | Reference position from which magnitude or change is judged, commonly zero. |
| Benchmark | Standard reference, task set, or comparison point used to evaluate performance. |
| Bin | Interval grouping nearby numeric values for aggregation or display. |
| Binning | Mapping continuous values into discrete intervals. Bin boundaries can materially change a histogram or heatmap. |
| Bivariate | Involving two variables. |
| Brush | Direct manipulation that selects a continuous region or interval, usually by dragging. |
| Calculated field | Value derived deterministically from other fields. |
| Caption | Text associated with a figure that explains context, takeaway, source, or limitations. |
| Cardinality | Number of distinct values in a field. High-cardinality categories usually require search, grouping, or aggregation. |
| Categorical data | Values representing groups or labels rather than measurable magnitude. Nominal categories are unordered; ordinal categories have order. |
| Channel | Visual property to which data is mapped, such as position, length, color, size, shape, opacity, angle, text, or facet. |
| Chart | A visual encoding of data for lookup, comparison, pattern detection, or explanation. |
| Chart junk | Decoration that consumes attention without improving interpretation. |
| Clear | Remove all current selections or filters. Different from reset, which restores a designed default. |
| Cohort | Group sharing a start event or defining characteristic, often compared across elapsed time. |
| Color domain | Data values or categories mapped by a color scale. |
| Color range | Actual colors produced by a color scale. |
| Common scale | One shared mapping used across marks or panels, enabling direct comparison. |
| Comparison set | Entities intentionally displayed together. |
| Composition | Parts that form a meaningful, usually non-overlapping whole. |
| Confidence interval | Procedure-derived interval that would contain the target parameter at a stated rate over repeated samples. It is not generally the probability that this one interval contains the parameter. |
| Confounder | Variable related to both an explanatory variable and outcome that can bias causal interpretation. |
| Continuous data | Numeric values conceptually able to vary across an interval. |
| Control | Interface element that changes data scope, view, encoding, navigation, or output. |
| Coverage | Measured or available portion of the intended population, often shown as count or percentage. |
| Cross-filter | Selection in one view filters data in another linked view. |
| Cross-highlight | Selection emphasizes related marks elsewhere while retaining all data. |

## D–H

| Term | Definition |
|---|---|
| Dashboard | Coordinated collection of metrics and views supporting monitoring or analysis. |
| Data domain | Input values a scale accepts. |
| Data provenance | Origin, collection method, transformations, ownership, and lineage of data. |
| Data range | Visual outputs produced by a scale, such as pixels, colors, or sizes. |
| Datum | One value or one data item. Plural: data. |
| Debounce | Delay repeated updates until input activity pauses, reducing unnecessary recomputation. |
| Default view | Designed initial chart state, including selection, filter, sort, scale, and annotations. |
| Denominator | Quantity a rate, percentage, or normalized measure is divided by. |
| Derived metric | Metric calculated from other values using a defined formula. |
| Desirability direction | Whether larger, smaller, closer to a target, or inside a range is preferred. |
| Detail on demand | Interaction revealing additional information about selected or focused marks. |
| Dimension | Field used to group, segment, identify, or filter observations, such as country or model family. |
| Direct label | Text placed beside a mark instead of requiring a separate legend lookup. |
| Disclosure | Expandable region that progressively reveals definitions, methods, notes, or detail. |
| Discrete data | Values occurring as distinct categories or countable steps. |
| Diverging scale | Ordered scale extending in two directions from a meaningful center. |
| Domain line | Main axis line representing the span of a scale. |
| Drill down | Move from an aggregate to finer detail. |
| Drill up | Return from detail to a broader aggregation. |
| Dual axis | Chart with two quantitative axes for separate measures. It can manufacture apparent correlation through arbitrary scale choices. |
| Encoding | Mapping data fields or constants to visual channels. |
| Endpoint | Specific provider/configuration serving a model, distinct from the abstract model identity. |
| Error bar | Mark showing an interval around an estimate. The interval type must be named. |
| Estimate | Approximate value of an unknown quantity derived from data or a model. |
| Exact-data view | Table or downloadable dataset exposing values behind a visualization. |
| Facet | Split a view into aligned small multiples based on a categorical field. |
| Filter | Predicate restricting which records or entities are eligible. |
| Focus | Current keyboard-interaction target. Visible focus and logical order are required. |
| Focus + context | Detailed view paired with an overview that preserves location in the full domain. |
| Forecast | Model-based prediction about future or unobserved values. |
| Freshness | How current the evidence is, expressed with data-as-of and update information. |
| Gridline | Reference line extending from an axis tick across the plot. |
| Group | Set of observations sharing dimension values. |
| Guide | Visual aid interpreting encodings, primarily axes, legends, and headers. |
| Highlight | Temporary or selected visual emphasis without removing other data. |
| Hover | Pointer state over a target. Hover-only content is inaccessible to keyboard and many touch users. |

## I–M

| Term | Definition |
|---|---|
| Imputation | Replacing missing values using a stated method. It must not be confused with observation. |
| Index | Composite or normalized measure combining inputs under a defined method. |
| Inference | Conclusion about a population, process, or cause drawn from evidence and assumptions. |
| Interaction | User action that changes scope, view, encoding, navigation, selection, or output. |
| Interpolation | Estimating values between known observations. |
| Interval | Numeric range with a defined statistical or operational meaning. |
| Jitter | Small positional displacement used to reveal overlapping points. |
| Key performance indicator (KPI) | Metric selected to monitor progress toward an objective. |
| Label | Visible text naming a mark, axis value, control, or category. |
| Latency | Delay before a response or first result. Define the exact start and end events. |
| Layer | Multiple marks superimposed in the same coordinate system. |
| Legend | Guide mapping non-positional encodings such as color, shape, size, or line style to meaning. |
| Linear scale | Scale where equal data differences produce equal visual differences. |
| Linked views | Multiple charts/tables coordinated by shared selection or filters. |
| Log scale | Scale where equal ratios produce equal visual distances. Valid ordinary log domains exclude zero and negative values. |
| Long description | Structured text conveying the information, relationships, scales, and trends in a complex image/chart. |
| Mark | Primitive data-bearing geometry, such as point, line, bar, area, rect, rule, text, or geoshape. |
| Measure | Quantitative field commonly aggregated or compared. |
| Median | 50th percentile; half the observations are at or below it. |
| Metadata | Data describing a dataset or artifact, such as source, units, schema, dates, and method. |
| Metric | Quantified measure defined by population, formula, unit, period, and direction. |
| Missing at random/non-random | Statistical assumptions about why values are absent. Missingness can bias visual conclusions. |
| Missing value | Expected value that is unavailable. It is not zero. |
| Mode | Most frequent value or a local peak of a distribution. |
| Multivariate | Involving more than two variables. |

## N–R

| Term | Definition |
|---|---|
| Nominal data | Unordered categories, such as creator or country. |
| Non-text contrast | Contrast of interface components and graphical objects needed to perceive state and meaning. |
| Normalization | Transforming values to a common basis, such as percentage, rate per capita, z-score, or index baseline. |
| Null | Machine-readable absence of a value. It must have a defined display and aggregation policy. |
| Observation | One measured or recorded data record. |
| Opacity | Transparency channel. Weak for precise reading and risky when it is the only selected-state cue. |
| Ordinal data | Categories with meaningful order but not necessarily equal intervals. |
| Outlier | Observation unusually distant under a stated rule or model. It is not automatically an error. |
| Overplotting | Marks overlap enough to hide count, density, or outliers. |
| Panel | One chart region within a multi-view display. |
| Parameter | Named value that can change a visualization's calculation, filter, or encoding. |
| Pareto frontier | Set of non-dominated options for which improving one objective would worsen another. |
| Percent change | `(new - old) / old`; undefined when the baseline is zero and unstable near zero. |
| Percentage point | Arithmetic difference between percentages, distinct from percent change. |
| Percentile | Value at or below which a stated percentage of observations falls. |
| Perceptually uniform | Equal steps in encoded value appear approximately equal in visual difference. |
| Period | Time interval a metric covers. |
| Persistence | Whether interaction state survives reload/navigation. If used, make it visible and resettable. |
| Plot area | Coordinate region containing data marks. |
| Population | Full set of entities or events a claim concerns. |
| Precision | Resolution supported by measurement, calculation, and uncertainty, not merely displayed decimals. |
| Preset | Named collection of parameter values for a known use case. |
| Progressive disclosure | Initially showing essential content, with optional access to detail. |
| Projection | Transformation from geographic coordinates to a planar map. |
| Qualitative scale | Unordered visual palette for categories. |
| Quantile | Cut point dividing ordered data into specified probability fractions. |
| Rate | Quantity normalized by exposure, population, time, or another denominator. |
| Redundant encoding | Expressing the same meaning through more than one channel, such as color and shape. |
| Reference band | Shaded interval representing a target, normal range, uncertainty, or policy threshold. |
| Reference line | Line marking a target, baseline, event, mean, or other comparator. |
| Reset | Restore the designed default state. Different from clearing all values. |
| Responsive visualization | Visualization that adapts layout, labels, controls, and sometimes representation to available space and input mode. |

## S–Z

| Term | Definition |
|---|---|
| Sample | Observed subset used to learn about a population. |
| Sampling | Selecting or reducing observations. Visual sampling must retain material structure or disclose bias. |
| Scale | Function mapping a data domain to a visual range. |
| Schema | Formal structure, types, relationships, and constraints of data. |
| Selection | Data values or marks identified by direct manipulation or control input. |
| Semantic color | Color chosen for domain meaning, such as loss/gain, while remaining accessible. |
| Sequential scale | Ordered scale moving from low to high, commonly through luminance. |
| Series | Ordered set of related observations represented together. |
| Shape channel | Symbol form used to distinguish categories. Useful as redundant encoding. |
| Shareable state | Visualization configuration encoded so another user can reproduce the same view. |
| Small multiple | Repeated aligned chart using consistent encodings for different groups. Also called a trellis or faceted view. |
| Smoothing | Estimating a less noisy pattern from observations. Method and parameters can change conclusions. |
| Sort | Ordering records or categories by value, time, alphabet, or domain logic. |
| Source note | Visible attribution and provenance attached to a chart or table. |
| State | Current values of selections, filters, parameters, navigation, and display controls. |
| Statistical significance | Result of a hypothesis-test procedure. It does not measure practical importance or effect size. |
| Status message | Non-focus-moving update about result, progress, success, waiting, or error exposed to assistive technology. |
| Story | Deliberately ordered sequence of views and annotations guiding an explanation. |
| Subgroup | Subset defined by one or more dimensions. |
| Subtitle | Supporting chart text defining metric, unit, period, method, or scope. |
| Tab | Control switching among mutually exclusive views within the same context. |
| Table header | Semantic cell naming a row or column and associated programmatically with data cells. |
| Target | Desired value or interval set by policy, benchmark, or decision rule. |
| Target size | Pointer-active area of a control. Larger targets improve touch and motor accessibility. |
| Temporal data | Dates, times, durations, or ordered periods. |
| Threshold | Cut point separating categories or operational states. |
| Tick | Reference mark on an axis associated with a scale value. |
| Timezone | Civil-time reference used to interpret timestamps and period boundaries. |
| Title | Primary label identifying a chart's subject or finding. |
| Tooltip | Temporary detail appearing on hover/focus or activation. It must not carry the only copy of material information. |
| Transform | Operation that changes data before encoding, such as filtering, calculation, aggregation, binning, or regression. |
| Trend | Directional pattern across ordered observations, not necessarily causal or statistically significant. |
| Uncertainty | Limited knowledge about a value, estimate, model, sample, or future outcome. |
| Unit | Measurement basis, such as USD per million tokens, seconds, percent, or count. |
| Univariate | Involving one variable. |
| Value label | Text rendering a data value near a mark. |
| Variable | Characteristic that can take different values. |
| View | One visualization specification or analytical state. |
| Viewport | Visible region available to render and operate an interface. |
| Visual hierarchy | Deliberate ordering of attention through position, scale, contrast, spacing, and typography. |
| Visual variable | Perceptual property used to encode data; synonymous with encoding channel in many contexts. |
| Whisker | Line segment extending from a box or estimate under a defined rule. |
| Zero baseline | Scale domain includes zero at the magnitude origin. Essential for ordinary bar-length comparison. |
| Zoom | Change the scale/domain to focus on a smaller or larger region. It needs bounds and reset/overview. |

## Evidence-state vocabulary

| State | Definition |
|---|---|
| Observed | Directly inspected or measured during this research. |
| Source-reported | Stated by a cited source but not independently measured. |
| Calculated | Derived deterministically from stated inputs and method. |
| Estimated | Approximated through a disclosed method. |
| Inferred | Reasoned from observed evidence but not directly present. |
| Unavailable | Expected evidence could not be obtained. |
| Not applicable | The field or concept does not apply. |

---

<!-- 11archive-source: 05-methodology-and-sources.md -->

# Methodology, coverage, limitations, and sources

## Objective and audience

The research supports people designing, building, reviewing, or purchasing interactive data-visualization systems. It aims to provide:

- A practical chart-selection taxonomy.
- Definitions for chart anatomy and interaction.
- Accessibility and verification requirements.
- A dedicated audit of Artificial Analysis' public visualization system.
- Reusable product specifications rather than visual imitation.

## Reporting period and timezone

- Research date: 2026-08-11.
- Browser observation window: 2026-08-11, Europe/Lisbon working session.
- Artifact timestamps: UTC.
- Artificial Analysis content is dynamic. Counts and labels are point-in-time observations.

## Evidence method

### General practice research

Sources were selected in this order:

1. Peer-reviewed primary research.
2. W3C accessibility standards and official guidance.
3. Official visualization-library documentation.
4. First-party product pages and methodology.

Claims were paraphrased. No long source passages were copied. The chart catalog combines primitive mark grammars with conventional statistical, cartographic, network, process, and domain-specific forms. The boundaries between named chart types are not universal.

### Artificial Analysis audit

The audit used direct browser inspection of public desktop pages. For each representative surface, it collected:

- Page title and major section headings.
- Tabs and view switches.
- Button and control labels.
- Entity-selector coverage text.
- Filter-dialog values.
- Table headers and observed row counts.
- Chart-specific explanatory labels such as Pareto line, attractive region, baseline, and boxplot.
- Selected control state semantics such as radio, switch, slider, and combobox.

The audit interacted only with reversible visualization controls and prompt dialogs. It did not submit prompts, votes, subscriptions, or other external writes. It did not download proprietary data. It did not inspect cookies, storage, accounts, private APIs, or internal source code.

## Coverage summary

| Surface | Coverage evidence | Evidence state |
|---|---|---|
| Home analytics | Public homepage, filters, display panel, entity picker | Observed |
| Trends | 6 section headings, 18 chart entity selectors found in DOM | Observed |
| LLM leaderboard | 252 table rows, grouped columns and 5 filter groups | Observed |
| Model detail | 10 major sections and 50 view tabs on one representative model | Observed |
| Coding agents | 8 sections; index, benchmark, token, cost, time views | Observed |
| Image leaderboard | 144 table rows and 8 chart/leaderboard filter controls | Observed |
| Video comparison | 4 sections; bar/scatter/boxplot/time-series families | Observed |
| Text-to-speech leaderboard | 92 table rows; category/accent/openness/personal filters | Observed |
| Speech-to-speech | 7 sections; 30 view tabs; 36-row summary table | Observed |
| Provider detail | Prompt and pricing assumptions; 23-row table | Observed |
| Image/video arenas | Mode, prompt, vote/player and keyboard controls | Observed |
| Every individual entity/provider route | Reused system inferred from representative pages; not crawled exhaustively | Inferred, partial coverage |
| Premium/authenticated visualizations | Not accessed | Unavailable, excluded |
| Mobile and tablet layouts | Not systematically tested | Unavailable, excluded |
| Internal implementation/library choices | Not inspected | Unavailable, excluded |

## Material limitations

- The phrase “all chart types” has no closed universal definition. The catalog covers a broad practical set of statistical, temporal, distributional, relational, compositional, hierarchical, network, flow, geographic, process, and specialized analytical forms.
- Artificial Analysis changes frequently. Metric versions, model counts, route structure, filters, and controls can change after 2026-08-11.
- The audit covers representative public pages, not every model, provider, evaluation, comparison route, or premium chart.
- DOM labels establish the presence and semantics of controls, but do not fully prove keyboard, screen-reader, touch, mobile, export-file, or cross-browser quality.
- No Artificial Analysis source code or internal state model was inspected. The proposed state schema is an inference from visible behavior.
- Chart recommendations are context-sensitive defaults. Domain standards, risk, audience, and evidence may justify another form.
- Accessibility conformance requires a formal evaluation of the implemented product. This report is a design and test contract, not a certification.

## Primary research and standards

| Source | Contribution |
|---|---|
| [Cleveland & McGill, Graphical Perception](https://doi.org/10.1080/01621459.1984.10478080) | Experimental basis for accuracy differences among elementary visual encodings |
| [Brehmer & Munzner, Multi-Level Typology of Abstract Visualization Tasks](https://www.cs.ubc.ca/labs/imager/tr/2013/MultiLevelTaskTypology/) | Why/how/what task framing and task sequences |
| [Heer & Shneiderman, Interactive Dynamics for Visual Analysis](https://idl.uw.edu/papers/interactive-dynamics) | Interaction taxonomy spanning data/view specification, view manipulation, and process/provenance |
| [Heer & Robertson, Animated Transitions](https://idl.uw.edu/papers/animated-transitions) | Evidence and design principles for staged transitions supporting object constancy |
| [Correll, Moritz & Heer, Value-Suppressing Uncertainty Palettes](https://idl.uw.edu/papers/uncertainty-palettes) | Limits of independent bivariate value/uncertainty color and an alternative design |
| [Hullman et al., In Pursuit of Error](https://idl.uw.edu/papers/uncertainty-eval-survey) | Survey of uncertainty-visualization evaluation practice |
| [ColorBrewer 2.0](https://colorbrewer2.org/) | Qualitative, sequential, and diverging cartographic palette guidance |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Normative web accessibility requirements |
| [W3C Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Redundant non-color cues |
| [W3C Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Dismissible, hoverable, persistent transient content |
| [W3C Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) | Programmatic semantics for controls |
| [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Announcing asynchronous results without moving focus |
| [W3C Complex Images](https://www.w3.org/WAI/tutorials/images/complex/) | Short and structured long descriptions for charts |
| [W3C Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) | Semantic table headers and associations |

## Official visualization documentation

| Source | Contribution |
|---|---|
| [Vega-Lite marks](https://vega.github.io/vega-lite/docs/mark.html) | Primitive and composite mark vocabulary |
| [Vega-Lite encodings](https://vega.github.io/vega-lite/docs/encoding.html) | Position, mark-property, text, tooltip, order, detail, and facet channels |
| [Vega-Lite scales](https://vega.github.io/vega-lite/docs/scale.html) | Continuous, discrete, discretizing, time, log, symlog, and color scales |
| [Vega-Lite axes](https://vega.github.io/vega-lite/docs/axis.html) | Axis anatomy and customization |
| [Vega-Lite legends](https://vega.github.io/vega-lite/docs/legend.html) | Legend interpretation for non-positional scales |
| [Vega-Lite selections](https://vega.github.io/vega-lite/docs/selection.html) | Point and interval selection semantics |
| [Vega-Lite parameter binding](https://vega.github.io/vega-lite/docs/bind.html) | Input-, legend-, and scale-bound interaction |
| [Vega-Lite tooltips](https://vega.github.io/vega-lite/docs/tooltip.html) | On-demand details and tooltip channels |
| [D3 zoom](https://d3js.org/d3-zoom) | Pan/zoom behavior and focus + context composition |
| [D3 axis](https://d3js.org/d3-axis) | Human-readable scale reference marks |

## Artificial Analysis sources

| Source | Audit use |
|---|---|
| [Artificial Analysis home](https://artificialanalysis.ai/) | Reusable chart shell, ranking, cost, trade-off, trend, provider visualizations |
| [AI Trends](https://artificialanalysis.ai/trends) | Progress, efficiency, country, openness, architecture, training chart inventory |
| [LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models) | Dense table, search, facets, grouped columns |
| [Claude Opus 5 detail](https://artificialanalysis.ai/models/claude-opus-5) | Representative model dashboard and view-tab inventory |
| [Coding Agents](https://artificialanalysis.ai/agents/coding-agents) | Model/agent grouping, benchmark, token, cost, time controls |
| [Text-to-Image Leaderboard](https://artificialanalysis.ai/image/leaderboard/text-to-image) | Elo, confidence interval, sample count, media filters |
| [Video Model Comparisons](https://artificialanalysis.ai/video/models) | Quality/price/time trade-offs, boxplot, over-time views |
| [Video Methodology](https://artificialanalysis.ai/video/methodology) | Modality-specific Elo pools and performance measurement definitions |
| [Text-to-Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard) | Category, accent, openness, personal/global, voice controls |
| [Speech-to-Speech Analysis](https://artificialanalysis.ai/speech-to-speech/) | Index, dataset/domain/category, cost/speed, summary table |
| [CoreWeave provider detail](https://artificialanalysis.ai/providers/coreweave) | Prompt options and blended price presets |
| [Image Arena](https://artificialanalysis.ai/embed/text-to-image-leaderboard/arena) | Blind pairwise image workflow and modes |
| [Video Arena](https://artificialanalysis.ai/embed/text-to-video-leaderboard/arena) | Audio/modality/player/keyboard workflow |

## Reproducibility checklist

To repeat the audit:

1. Record date, timezone, viewport, logged-in/public state, and page URL.
2. Inspect one page from each surface in the coverage table.
3. Record headings, view tabs, coverage selectors, filters, display settings, legends, exports, tables, and method notes.
4. Exercise entity selection, one semantic filter, one view tab, legend toggle, display setting, and reset.
5. Verify chart title, units, direction, values, and table/download remain consistent after each change.
6. Repeat with keyboard only, at 200% zoom, narrow width, reduced motion, and a screen reader.
7. Capture differences from this 2026-08-11 baseline rather than treating them as defects automatically.
