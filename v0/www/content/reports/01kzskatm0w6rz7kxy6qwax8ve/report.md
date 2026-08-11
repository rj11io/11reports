<!-- 11archive-source: README.md -->

# Command and Control: the conversation you were never meant to hear

How an attacker keeps talking to a machine they have broken into, why that
conversation is the hardest part of an intrusion to hide, and what actually
catches it.

"Command and control" — usually shortened to **C2** — is the channel an attacker
uses to send orders to a computer they already control, and to receive answers
back. Breaking in is a moment. C2 is a relationship, and it has to be maintained.
That is why it is the best place to catch an intruder, and why enormous effort
goes into hiding it.

## The short version

An attacker who gets in but cannot talk to what they got into has achieved almost
nothing. So every intrusion that matters carries a channel, and every channel has
to leave the network. That crossing is the defender's opportunity.

The trade has moved decisively toward hiding inside traffic you cannot afford to
block. Attackers now route commands through GitHub issue comments, Slack
webhooks, and Outlook draft folders — services your business already depends on.
REPORTED: one 2026 campaign polled a GitHub repository's issue list every 60
seconds for its orders and never contacted an attacker-owned server at all
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).

Meanwhile the paid tool that defined the category for a decade is losing ground
to free ones. And nobody agrees on which tool leads, because the three main ways
of counting measure three different things.

## Read in this order

| File | What it covers |
| --- | --- |
| 00-executive-brief.md | The findings, the numbers, the disagreements, and what to do. Start here. |
| 01-what-c2-is.md | What a channel is, the four jobs it does, and the life of one from first call to last. |
| 02-channel-taxonomy.md | Every channel class: how it carries traffic, why it was chosen, what betrays it. Mapped to MITRE ATT&CK. |
| 03-framework-landscape.md | The tools: Cobalt Strike, Sliver, Havoc, Mythic, AdaptixC2 and the rest. Who uses what, and why the rankings conflict. |
| 04-infrastructure-and-evasion.md | Redirectors, fast flux, generated domain names, dead drops, and hiding inside trusted services. |
| 05-detection-engineering.md | What actually finds a channel: rhythm analysis, handshake fingerprints, memory scanning. With honest limits. |
| 06-defender-playbook.md | The actionable chapter. Controls ranked by benefit against effort, plus what to do when you find a live channel. |
| 07-disruption-and-law.md | Takedowns, court orders, and what disruption actually buys. |
| 08-frontier.md | Language models writing their own commands, the QUIC blind spot, and intrusions with no implant to find. |
| 09-glossary.md | Every term used here, in plain words. |
| 10-methodology-and-sources.md | How this was built, every calculation, every conflict, every gap, and all 54 sources. |

`data.json` holds the structured evidence, including all sources and the
recorded conflicts. `report.html` is the self-contained version with sortable
tables.

## How to read the evidence labels

Every material claim carries one of four labels. This report contains **no
original measurement** — that is its main limitation, and it is stated plainly
rather than hidden.

- **DOCUMENTED** — the thing's own owner says so: a vendor's documentation, a
  release note, a government advisory, the MITRE ATT&CK catalogue itself.
- **REPORTED** — a named third party published it. Not checked independently
  here. Treated as weaker, and the source is always named inline.
- **CALCULATED** — worked out in this report from reported numbers. Every
  formula appears in 10-methodology-and-sources.md.
- **INFERRED** — a judgement drawn from the evidence. No source states it. The
  reasoning is always shown so you can disagree with it.

## Scope, and what this report will not do

This is a defensive and analytical report. It explains how channels work, what
each one costs the attacker, and what gives each one away. It maps the tools and
names the detection that catches them.

It does not include implant code, configuration files that would function as
working profiles, or step-by-step instructions for evading a named security
product. Where a technique is described, the description is at the level a
defender needs to write a detection or a network rule — which is the level the
vendor advisories and academic papers cited here already publish at.

Two further boundaries worth stating. First, every framework named in
03-framework-landscape.md is a legitimate,
publicly available security testing tool. Naming it is not an accusation
against its authors; it is a description of what defenders are seeing. Second,
the numbers throughout come from vendors who sell detection products. Their
counts reflect what their sensors see, which is not the same as what exists.
10-methodology-and-sources.md is specific about
where that bias bites.

No private data, credentials, customer information, or local file paths appear
anywhere in this report.

---

<!-- 11archive-source: 00-executive-brief.md -->

# Executive brief

## The finding

Command and control is the one part of an intrusion the attacker cannot skip, and
the part they have spent the last three years moving out of your reach.

The move has a shape. Attackers used to run their own servers and try to make the
traffic look ordinary. Increasingly they do not run servers at all. They put the
orders inside a service you already trust — a code repository, a chat webhook, a
draft email — so that the only thing your network sees is a normal connection to
`api.github.com`. There is no attacker-owned address to block, no certificate to
fingerprint, and no reputation score that helps.

At the same time, the tool that defined the category has lost its monopoly, and
the three ways of counting which tool leads now give three different answers. That
disagreement is not noise. It is the most useful thing in this report, because it
tells you which measurement to trust for which decision.

## The numbers that matter

| Measure | Value | Label | Source |
| --- | --- | --- | --- |
| Malware samples showing any C2 activity | 20.11% | REPORTED | [Unit 42, Aug 2026](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/) |
| Of those, share contacting a hard-coded IP address, skipping DNS entirely | 45.32% | REPORTED | same |
| Share of all analysed samples that skip DNS for C2 | 9.11% | CALCULATED | 20.11% × 45.32% |
| Benign samples making any untrusted outbound connection | ~1% | REPORTED | same |
| Unique addresses hosting Cobalt Strike, January 2026 | 1,921 | REPORTED | [Hunt.io, Aug 2026](https://hunt.io/blog/guide-hunting-cobalt-strike-part-4-c2-feeds-api) |
| Monthly average for 2025 | ~739 | REPORTED | same |
| January 2026 as a multiple of the 2025 monthly average | 2.60× | CALCULATED | 1,921 ÷ 739 |
| Entries in the MITRE ATT&CK command-and-control tactic | 18 techniques, 27 sub-techniques | DOCUMENTED | [ATT&CK TA0011 v19](https://attack.mitre.org/tactics/TA0011/) |
| Fastest observed time from break-in to data leaving | 72 minutes | REPORTED | [Unit 42 IR Report 2026](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/) |
| Servers disrupted, Operation Endgame November 2025 phase | 1,025 | REPORTED | [Europol](https://www.europol.europa.eu/media-press/newsroom/news/end-of-game-for-cybercrime-infrastructure-1025-servers-taken-down) |

The 20.11% figure deserves a moment. It is not a claim that four in five malware
samples are harmless — plenty of them steal data, encrypt disks, or mine
currency without ever taking an order. It is a claim about how much malware needs
a live operator. That one fifth is where the intrusions that end in ransomware,
espionage, and extortion live.

The contrast with benign software is the whole detection argument in one line.
REPORTED: malware with C2 averaged 4.17 unique destination addresses per sample
over TCP; benign samples that connected anywhere untrusted at all averaged 1.6
([Unit 42](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/)).
Normal software talks to few places, consistently. Implants shop around.

## Seven things worth knowing

**1. The channel is the attacker's only unavoidable exposure.**
An attacker can avoid writing files to disk, avoid installing anything, avoid
touching a password store, and avoid running a single unusual program — the
"living off the land" approach that REPORTED made Volt Typhoon so hard to find
([Microsoft](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/)).
What they cannot avoid is talking to something outside. INFERRED: this makes
egress — traffic leaving your network — the single highest-value place to invest
detection effort, because it is the only place where the attacker's requirements
and the defender's visibility are guaranteed to overlap.

**2. The three ways of counting C2 tools disagree, and each is right about
something different.**

| Counting method | What it actually measures | Who leads | Source |
| --- | --- | --- | --- |
| Open-source reporting frequency, H1 2025 | How often researchers write a tool up | Sliver, then Metasploit, Havoc, Brute Ratel C4 | [Kaspersky](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/) |
| Confirmed detections in customer environments | What actually landed on managed endpoints | Cobalt Strike | [Red Canary](https://redcanary.com/threat-detection-report/trends/c2-frameworks/) |
| Internet-wide scanning for exposed servers | How much infrastructure is standing up | Cobalt Strike, by a wide margin | [Hunt.io](https://hunt.io/blog/guide-hunting-cobalt-strike-part-4-c2-feeds-api) |

INFERRED, and this is the practical takeaway: use scanning data to decide what to
block at the perimeter, use endpoint detection data to decide what to hunt for
inside, and treat reporting-frequency rankings as a signal about where research
attention is going rather than where risk is. A tool can top the reporting charts
because it is new and interesting while barely appearing in real incidents. A tool
can dominate the scanning data because it is easy to fingerprint — which is a
statement about detectability, not popularity.

**3. Free tools with no licence to revoke are displacing the paid one.**
Cobalt Strike costs money and Fortra can refuse to sell to you. Sliver, Havoc,
Mythic, and AdaptixC2 are free, open, and cannot be taken away. REPORTED:
AdaptixC2, first written up as a threat in September 2025, was inside Fog and
Akira ransomware operations within months
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/),
[The Hacker News](https://thehackernews.com/2025/10/russian-ransomware-gangs-weaponize-open.html)).
INFERRED: legal and commercial pressure on a vendor pushes attackers toward tools
where no vendor exists to pressure. That is a real cost of the takedown strategy,
and it is rarely stated when takedowns are announced.

**4. "Hiding inside a trusted service" has become the default, not the exotic
option.**
REPORTED: a March 2026 campaign used a GitHub repository as its entire control
channel — the implant posted its session key to issue number one, then polled the
repository's open-issues list every 60 seconds, reading its orders from issue
titles and sending answers back as files committed to a `download/` folder
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).
REPORTED: Cloudflare's 2026 threat report describes the same pattern across
Google Calendar, Drive, Dropbox, GitHub, and paste sites used as address books
that point to the real server, and gives it a name — "living off the XaaS"
([Cloudflare](https://blog.cloudflare.com/2026-threat-report/)).
The defensive problem is blunt: you cannot blocklist GitHub.

**5. A rhythm survives the disguise.**
An implant that checks in on a schedule is periodic, and periodicity survives
encryption because it lives in the timing, not the content. Attackers add
randomness — "jitter" — to break the pattern. REPORTED: it does not work well
enough. A beacon sleeping randomly between 35 and 55 seconds still scores as
periodic once you have a few hundred connections to look at, because the *spread*
is regular even when each interval is not
([Active Countermeasures / Black Hills](https://www.blackhillsinfosec.com/detecting-malware-beacons-with-zeek-and-rita/)).
This is the most durable detection idea in the field, and it needs no decryption.

**6. Handshake fingerprints work, and they are decaying.**
Every program that opens an encrypted connection does so in a slightly distinctive
way. Hash those details and you get a fingerprint — JA3, JA4, and JARM are the
well-known schemes — that identifies the software without reading the traffic.
REPORTED: JA4X detects Sliver, Havoc, Metasploit, Tor, and various remote-access
implants ([FoxIO](https://blog.foxio.io/ja4+-network-fingerprinting)). REPORTED,
and more important: researchers found the overlap between C2 fingerprints and
legitimate servers grows over time, so a fingerprint database that is not
constantly refreshed quietly stops working
([systemshardening.com](https://www.systemshardening.com/articles/network/tls-fingerprinting-ja3-ja4/)).
INFERRED: treat fingerprint feeds as perishable stock, not as a control you
install once.

**7. The frontier is a model writing the commands.**
REPORTED: Google's threat intelligence group named five malware families in
November 2025 that call a language model at run time. PromptSteal queries a code
model to generate the exact Windows commands it needs, then sends what it
collects to a control server. PromptFlux rewrites its own code using Gemini.
PromptLock generates fresh scripts each run
([Infosecurity](https://www.infosecurity-magazine.com/news/aienabled-malware-actively/)).
REPORTED: PromptSteal, also tracked as LAMEHUG, was used against Ukraine and
attributed to APT28 — a human operator replaced by an automated loop.
INFERRED: this breaks detection that depends on the *content* of commands being
stable, because the content is now generated fresh each time. It does not break
detection that depends on the channel existing. Which is an argument for putting
detection weight on the channel rather than the payload.

## Where this report disagrees with its own sources

Two conflicts are worth surfacing rather than smoothing over.

**The Cobalt Strike takedown was disruption, not seizure.** Secondary coverage
describes the March 2023 court order as letting Microsoft and Fortra "seize domain
names and take down IP addresses"
([BleepingComputer](https://www.bleepingcomputer.com/news/security/microsoft-and-fortra-crack-down-on-malicious-cobalt-strike-servers/)).
Microsoft's own account is narrower: the order let them disrupt infrastructure and
notify internet providers and national response teams so those parties could act
([Microsoft](https://blogs.microsoft.com/on-the-issues/2023/04/06/stopping-cybercriminals-from-abusing-security-tools/)).
The distinction matters for anyone reasoning about what legal action can achieve —
the mechanism is largely persuasion at scale, backed by a court's authority, not
direct confiscation.

**Framework rankings from secondary aggregation are unreliable.** A widely shared
summary lists Kaspersky's top six as "Sliver, Havoc, Metasploit, Mythic, Brute
Ratel C4, Cobalt Strike, in that order". Kaspersky's own report names the top four
as Sliver, Metasploit, Havoc, Brute Ratel C4 — a different order, and it does not
place Cobalt Strike sixth
([Securelist](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/)).
This report uses the primary text. See
10-methodology-and-sources.md for the full list
of claims excluded for this reason.

## What to do

Ranked by benefit against effort. Full detail, including what each control misses,
is in 06-defender-playbook.md.

| Action | Why it works | Effort |
| --- | --- | --- |
| Force all outbound DNS through one resolver you control and log | Removes the attacker's easiest tunnel and gives you the query record you need for everything else | days |
| Deny outbound traffic by default from servers | Most servers have no business calling the internet; this alone removes the channel for a large class of intrusions | weeks, political |
| Score outbound connections for periodicity, not just reputation | Catches unknown channels to unknown destinations, which reputation cannot | weeks |
| Alert on new destinations reached without a preceding DNS lookup | Directly targets the 9.11% that skip DNS, and is close to free once DNS is centralised | days |
| Refresh handshake-fingerprint feeds continuously | They decay; a stale feed reads as a working control | ongoing |
| Baseline which of your machines legitimately use GitHub, Slack, and cloud storage APIs | The trusted-service channel is only invisible if you have no baseline to compare against | weeks |
| Alert on requests to `/dns-query` from anything that is not your resolver | Encrypted DNS from an application is either a policy violation or a tunnel | hours |

One trap worth naming. Inspecting encrypted traffic by decrypting it looks like
the answer to all of this, and it is not. It requires putting a device in the
middle of every connection, it breaks certificate pinning, it creates a
high-value target holding all your plaintext, and it fails entirely against the
trusted-service channels described above — because the traffic really is going to
GitHub, and it really is authorised. INFERRED: metadata approaches — timing,
volume, destination novelty, fingerprints — give more detection per unit of risk
and cost than decryption does. Chapter 6 makes the case in detail.

## The one-line version

Attackers can hide what they say, where they say it from, and increasingly who
they appear to be saying it to — but they cannot stop saying it, and they cannot
stop saying it on a schedule.

---

<!-- 11archive-source: 01-what-c2-is.md -->

# What a control channel actually is

## Start with the problem the attacker has

Imagine you have picked the lock on a building and you are now standing inside, at
night, in the dark. You do not know the layout. You do not know which doors lead
where. You cannot see what is in the filing cabinets. And you have to leave before
morning.

What you want is a radio, so a colleague outside with a floor plan can tell you
where to go, and so you can read out what you find.

That radio is command and control. Everything else in this report is about how the
radio is built, how it is hidden, and how it is found.

The comparison holds up further than it looks. A radio needs a frequency both
sides agree on. It needs to not be so loud that a guard hears it. It needs to keep
working when someone jams one frequency. And crucially: a radio that never
transmits is useless, so there is always something to hear if you are listening in
the right way.

## The four jobs a channel does

Almost every control channel does the same four things, whatever it is built from.
Understanding the four separately is useful, because a defender can often break one
without touching the others.

**1. Check in.** The compromised machine reaches out and says "I am here, and I am
reachable." This is where the word *beacon* comes from — like a lighthouse, it
signals on a repeating cycle.

**2. Fetch orders.** The machine asks whether there is anything to do. Usually the
answer is no. This is the traffic a defender sees most of, and it is the traffic
that carries the rhythm.

**3. Send answers.** Results go back: a directory listing, a stolen file, a
screenshot, a password.

**4. Add capability.** The channel delivers new code — a module to dump
credentials, a tool to scan the network. In MITRE ATT&CK this is catalogued
separately as `T1105 Ingress Tool Transfer`, because it looks different from the
other three: it is a large, one-off transfer rather than a small, repeated one.

That difference in shape matters for detection. Jobs one and two produce many tiny
identical-ish exchanges. Job three produces occasional larger uploads. Job four
produces a rare big download. A channel that does all four leaves three distinct
statistical signatures in the same connection history, and defenders can hunt each.

## Which way does the connection go

This is the single most important design decision in a control channel, and it is
decided by firewalls rather than by the attacker.

A **reverse** channel means the compromised machine dials out to the attacker.
A **bind** channel means the attacker dials in to the compromised machine.

Bind channels are almost extinct on the internet. Any competent firewall blocks
unexpected inbound connections, and machines behind home routers or cloud network
translation are not directly reachable anyway. So essentially all real-world C2 is
reverse: the victim calls the attacker.

This is a gift to defenders and it is worth being explicit about why. It means the
attacker's traffic must cross your egress boundary — the point where your network
talks to the outside — in the outbound direction, initiated from inside, at a time
of the attacker's choosing but on a path of *your* choosing. You control the
resolver it asks, the proxy it may have to traverse, and the firewall it must pass.
Every one of those is a place to look.

## Asynchronous versus interactive

A channel can be slow and patient or fast and chatty, and the choice is a direct
trade of stealth against usefulness.

An **asynchronous** channel checks in on a long cycle — every few minutes, every
hour, sometimes once a day. The operator queues a command and waits. This is
quiet: a connection every hour hides easily in normal traffic. It is also painful
to work with, because every action takes a full cycle to complete.

An **interactive** channel keeps a live session, so typing feels like a terminal.
This is what an attacker wants when they are actively exploring, and it is much
louder: a steady stream of small packets in both directions for minutes on end.

Real operations use both, and switch. DOCUMENTED: Sliver, an open-source framework
from Bishop Fox, ships this as two explicit modes — "beacon" for the patient
asynchronous style and "session" for the live interactive one
([Bishop Fox / Sliver documentation](https://deepwiki.com/BishopFox/sliver/6.1-mtls-communication),
[Sliver field guide](https://ring0shady.github.io/posts/sliver-c2-deep-dive/)).

INFERRED, and this is a useful hunting insight: the switch itself is detectable.
A destination that has been contacted once an hour for three weeks and then
suddenly carries two hundred small exchanges in four minutes has changed
character. Nothing legitimate does that. You do not need to know what the traffic
says to know that something woke up.

## The life of one channel, start to finish

### Stage one: the stager

The first code to run on a compromised machine is usually tiny — a few hundred
bytes to a few kilobytes. It is called a **stager**, and its only job is to
download the real implant and run it in memory.

Why bother with two stages? Because the delivery method is usually cramped. A
malicious document macro, a command typed into a vulnerable web application, or a
buffer overflow gives you very little room. Small enough to fit, and small enough
that there is not much for a scanner to recognise.

DOCUMENTED: ATT&CK catalogues this as `T1104 Multi-Stage Channels`. The stager
often uses a different, simpler channel than the implant that follows — which
means a defender who only models the final channel misses the first request
entirely.

### Stage two: the implant checks in

The real payload — variously called an implant, agent, or beacon — starts up and
makes its first contact. This first message is the richest moment in the channel's
whole life, because it has to establish trust from nothing.

REPORTED, and unusually concrete: the AdaptixC2 agent sends a heartbeat carrying a
custom HTTP header, by default named `X-Beacon-Id`, with an obsolete Firefox 20.0
user-agent string, and receives a JSON reply containing `status`, `data`, and
`metrics` fields. Its TCP mode answers with the literal banner `AdaptixC2 server`
([Kaspersky Securelist, April 2026](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
Every one of those is customisable by the operator, and in real intrusions some
are customised. But defaults are sticky, and defaults are why signature detection
still catches a great deal.

### Stage three: the working relationship

Now the loop runs. Check in, ask for orders, mostly get none, occasionally do
something. Weeks can pass like this. Ransomware crews use the time to map the
network and find backups; espionage operators use it to wait.

The two knobs the operator sets here are **sleep** — how long between check-ins —
and **jitter** — how much random variation to add to the sleep, so the pattern is
not exactly regular. REPORTED: a documented real-world configuration used an
average sleep of 787.5 seconds with jitter applied on top
([Hive Security](https://hivesecurity.gitlab.io/blog/cobalt-strike-detection-hunting/)).
Chapter 5 explains why jitter fails to hide the rhythm as well as operators hope.

### Stage four: fallback

Serious operators build a second way in. DOCUMENTED as `T1008 Fallback Channels`,
this means the implant tries an alternative when the primary stops answering —
a different protocol, a different address, a different service entirely.

INFERRED, and it has a direct operational consequence: blocking a primary channel
without watching for what happens next is worse than useless, because it converts
a channel you were monitoring into one you are not. The right sequence is
observe, prepare, then cut everything at once. Chapter 6 covers this.

### Stage five: how it ends

Channels die four ways. The operator finishes and shuts down. The defender finds
and cuts it. The machine is rebuilt or patched. Or the implant simply expires —
several frameworks support a **kill date**, a configured time after which the
implant deletes itself. REPORTED: AdaptixC2 exposes both a `KillDate` and a
`WorkingTime` setting, the latter restricting activity to chosen hours so the
traffic falls inside the victim's normal business day
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/)).

That `WorkingTime` setting deserves attention, because it defeats a detection idea
many teams rely on. "Alert on connections at 3am" is a reasonable rule that a
single configuration option renders blind. INFERRED: time-of-day anomaly detection
should be treated as a bonus signal, never a primary one.

## Where the channel sits among everything else

An intrusion has phases, and control channels touch nearly all of them.

| Phase | What the attacker is doing | The channel's part |
| --- | --- | --- |
| Initial access | Getting the first foothold | Delivers the stager |
| Execution | Running their code | The implant *is* the running code |
| Persistence | Surviving a reboot | Restarts the channel automatically |
| Discovery | Learning the network | Every question and answer crosses it |
| Credential access | Stealing passwords | Loaded as a module, results returned over it |
| Lateral movement | Reaching the next machine | New implants report back, often via internal hops |
| Exfiltration | Taking the data | Sometimes over the channel, often over a separate path |
| Impact | Ransomware, destruction | The final command arrives over it |

Two things follow from this table. First, C2 is not one stage of an attack — it is
the thread running through the whole thing. Second, exfiltration is often
deliberately *separated* from the control channel, because the control channel is
tuned for small quiet messages and bulk data would ruin its profile. ATT&CK
catalogues exfiltration as its own tactic for exactly this reason. A defender who
treats "the C2 channel" and "the data theft channel" as one thing will model
neither correctly.

## Why this is the best place to catch an intruder

Three properties of control channels combine into the central defensive argument
of this report.

**It cannot be skipped.** An operator who cannot issue commands cannot conduct an
operation. Fully automated malware exists, but it cannot adapt, and adaptation is
what a targeted intrusion is for.

**It must cross a boundary you own.** As established above, real C2 is outbound
from inside your network. It passes your equipment.

**It must repeat.** One connection can be an accident. A relationship leaves a
history, and history is what statistics work on.

REPORTED, as the quantitative backing: benign software rarely reaches untrusted
places, and when it does it reaches very few — around 1% of benign samples made
any untrusted connection, averaging 1.6 destinations. Malware with C2 averaged
4.17 unique destinations over TCP
([Unit 42](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/)).

INFERRED: the gap between those two behaviours is the detection surface. Every
technique in 05-detection-engineering.md is an
attempt to measure some part of it, and every technique in
04-infrastructure-and-evasion.md is an attempt
to close it.

---

<!-- 11archive-source: 02-channel-taxonomy.md -->

# The channel taxonomy

## The catalogue defenders actually use

MITRE ATT&CK is a public catalogue of attacker behaviour, organised into tactics
(the goal) and techniques (the method). Command and control is tactic `TA0011`,
and its description is one sentence: "The adversary is trying to communicate with
compromised systems to control them."

DOCUMENTED: as of ATT&CK version 19, last modified 25 April 2025, `TA0011`
contains 18 techniques and 27 sub-techniques — 45 catalogued entries
([ATT&CK TA0011](https://attack.mitre.org/tactics/TA0011/)).

The catalogue is worth reading as a document about how the problem has grown.
CALCULATED, by comparing the current list against an ATT&CK v10.1 mirror that
lists 16 techniques
([cyber-kill-chain.ch](https://cyber-kill-chain.ch/tactics/TA0011/)): the two
techniques added since v10.1 are `T1659 Content Injection` and
`T1665 Hide Infrastructure`. Both describe attacker infrastructure work rather
than protocol choice. INFERRED: the catalogue is growing in the direction of *how
the attacker's own network is built and concealed*, not in the direction of new
protocols. That matches what chapter 4 describes.

One further change is telling. `T1219` was called "Remote Access Software" in the
older list and is now "Remote Access Tools", with three sub-techniques added
including `T1219.001 IDE Tunneling` — the abuse of the remote-development tunnels
built into modern code editors. REPORTED: a 2026 campaign used exactly that,
running a Visual Studio Code tunnel login command on a compromised host
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).

## The full catalogue

DOCUMENTED, reproduced from ATT&CK TA0011 v19. Grouped by what the technique is
really about, which is not the order ATT&CK lists them in.

| ID | Name | What it is about |
| --- | --- | --- |
| T1071 | Application Layer Protocol | Which everyday protocol carries the traffic |
| T1071.001 | Web Protocols | HTTP and HTTPS |
| T1071.002 | File Transfer Protocols | FTP and similar |
| T1071.003 | Mail Protocols | SMTP, IMAP, POP3 |
| T1071.004 | DNS | Orders hidden in name lookups |
| T1071.005 | Publish/Subscribe Protocols | MQTT and message-queue protocols |
| T1095 | Non-Application Layer Protocol | ICMP, raw sockets, lower-level protocols |
| T1571 | Non-Standard Port | A known protocol on an unexpected port |
| T1572 | Protocol Tunneling | One protocol wrapped inside another |
| T1132 | Data Encoding | Making the payload survive the carrier |
| T1132.001 | Standard Encoding | Base64 and friends |
| T1132.002 | Non-Standard Encoding | Custom schemes |
| T1001 | Data Obfuscation | Making the payload unrecognisable |
| T1001.001 | Junk Data | Padding to defeat size analysis |
| T1001.002 | Steganography | Hidden inside images or media |
| T1001.003 | Protocol or Service Impersonation | Pretending to be a different service |
| T1573 | Encrypted Channel | Encryption the attacker controls |
| T1573.001 | Symmetric Cryptography | One shared key |
| T1573.002 | Asymmetric Cryptography | Key pairs |
| T1568 | Dynamic Resolution | Working out the address at run time |
| T1568.001 | Fast Flux DNS | Address rotates constantly |
| T1568.002 | Domain Generation Algorithms | Names computed from a formula |
| T1568.003 | DNS Calculation | Address derived from a DNS answer |
| T1090 | Proxy | Traffic relayed through something else |
| T1090.001 | Internal Proxy | Relay inside the victim network |
| T1090.002 | External Proxy | Relay outside it |
| T1090.003 | Multi-hop Proxy | Several relays chained |
| T1090.004 | Domain Fronting | Hiding behind a shared content network |
| T1665 | Hide Infrastructure | Concealing the attacker's own servers |
| T1102 | Web Service | A legitimate online service as the carrier |
| T1102.001 | Dead Drop Resolver | A public page holding the real address |
| T1102.002 | Bidirectional Communication | Full two-way traffic via the service |
| T1102.003 | One-Way Communication | Orders in only |
| T1659 | Content Injection | Commands injected into traffic in transit |
| T1008 | Fallback Channels | A second way in when the first dies |
| T1104 | Multi-Stage Channels | Different channels for different stages |
| T1105 | Ingress Tool Transfer | Bringing new tools in |
| T1219 | Remote Access Tools | Legitimate remote-support software |
| T1219.001 | IDE Tunneling | Code-editor remote tunnels |
| T1219.002 | Remote Desktop Software | TeamViewer, AnyDesk and similar |
| T1219.003 | Remote Access Hardware | Physical devices |
| T1205 | Traffic Signaling | A secret knock that wakes the implant |
| T1205.001 | Port Knocking | A sequence of connection attempts |
| T1205.002 | Socket Filters | A kernel filter watching for a trigger |
| T1092 | Communication Through Removable Media | USB as the carrier, for isolated networks |

## Channel classes, and what each one costs

The catalogue lists techniques. What a defender needs is the trade-off behind
each choice: what the attacker gains, what they pay, and what gives them away.

### HTTPS to a web server

**How it works.** The implant makes ordinary encrypted web requests. Orders come
back in the response body, headers, or cookies. Answers go up in POST bodies.

**Why it dominates.** Every network permits outbound HTTPS. There is nothing to
open, nothing to request, and the traffic is indistinguishable from browsing at a
glance.

**What it costs.** Nothing, which is why it is the default in every framework.

**What gives it away.** The rhythm of the check-ins. The handshake fingerprint of
the client. Certificate details that do not match a real business. Header
combinations that no browser produces. And the destination itself, if it is new
and nothing else in your organisation talks to it.

REPORTED, as a concrete example of the header problem: AdaptixC2's default HTTP
mode sends a user-agent claiming to be Firefox 20.0 — a browser released in 2013
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
A real Firefox 20 on a corporate network in 2026 would itself be an incident.

### DNS

**How it works.** The domain name system turns names into addresses. Every network
allows it, and it is designed so that any resolver will forward a question it
cannot answer to whoever owns the name. An attacker who owns a domain can
therefore receive data by encoding it into the name being asked about —
`<encoded-data>.attacker-domain.com` — and reply by putting data in the answer.

**Why it is chosen.** It works where nothing else does. A network that blocks all
outbound traffic still resolves names, because otherwise nothing functions.
REPORTED: DNS-based C2 "bypasses most egress firewalls since UDP/53 is almost
always allowed" ([Sliver field guide](https://ring0shady.github.io/posts/sliver-c2-deep-dive/)).

**What it costs.** Speed and volume. A name is limited to 253 characters and each
label to 63, and answers are small. Moving a real file through DNS means thousands
of queries. That is the trade: universal reach for terrible bandwidth.

**What gives it away.** The shape of the names. REPORTED, and specific enough to
build a rule from: AdaptixC2's DNS mode produces subdomains nested eight or more
levels deep, strings with high randomness, and names over 100 characters, with the
operation type encoded in the second label — `www` or `hi` to start a session,
`cdn` or `put` to send data, `api` or `get` to fetch orders, `hb` for a heartbeat
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
Also giving it away: the sheer count of unique names under one parent domain, and
a client asking many questions about a domain nobody else in the organisation has
ever asked about.

REPORTED, on scale: Unit 42 identified over 50 tunnelling tools and campaigns
across more than 1,000 tunnelling domains using four years of passive DNS records
([Unit 42, Oct 2023](https://unit42.paloaltonetworks.com/dns-tunneling-in-the-wild/)).
That research also found the technique is not only criminal — several commercial
VPN products tunnel through DNS to get around paid network restrictions, which
means a detector tuned only on "tunnelling is malicious" will generate real false
positives.

### Encrypted DNS

**How it works.** DNS over HTTPS wraps name lookups inside ordinary web requests,
so a network operator cannot see or filter them. It was created for privacy, and
it works.

**Why it is chosen.** It removes the defender's single best source of evidence. If
your resolver never sees the query, your query logs are empty.

**What gives it away.** The requests still have a shape. REPORTED: AdaptixC2's
encrypted-DNS mode POSTs to a `/dns-query` endpoint with
`Content-Type: application/dns-message`, and carries the same obsolete Firefox
user-agent as its plain HTTP mode
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).

INFERRED, and it is one of the cheapest rules in this report: on a managed
corporate network, an application making encrypted-DNS requests directly is
either violating policy or is a tunnel. Either way you want to know. The rule is
narrow, the false-positive cost is low, and it does not require decryption —
`/dns-query` and the `application/dns-message` content type are visible in
plain metadata.

REPORTED: detection research on this specific problem exists and is honest about
being early. A December 2025 paper built a toolkit to generate evasive
encrypted-DNS exfiltration and benchmark machine-learning detectors against it,
testing evasion via chunk size, encoding, padding, and resolver rotation
([Elaoumari, arXiv 2512.20423](https://arxiv.org/abs/2512.20423)). Its abstract
states no performance figures, so none are quoted here.

### Mutual TLS

**How it works.** Ordinary HTTPS has the server prove who it is. Mutual TLS has
*both* sides prove it, using certificates the attacker generated.

**Why it is chosen.** It locks defenders and researchers out completely. Without
the client certificate you cannot connect to the server to study it, and you
cannot man-in-the-middle the session.

**What it costs.** Rarity. Mutual TLS is uncommon in general web traffic, so
using it is itself unusual.

**What gives it away.** That rarity, plus the handshake fingerprint. REPORTED:
AdaptixC2's mutual-TLS mode "substantially limits network monitoring tool
effectiveness" while carrying an identical payload structure to its plainer
transports ([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
INFERRED: that identical structure is the opening — the encryption changed, the
behaviour did not, so timing and volume analysis still applies.

### Named pipes and internal relays

**How it works.** Only one machine in a compromised network talks to the internet.
Every other implant talks to *it*, over an internal Windows mechanism called a
named pipe, or a plain internal TCP connection.

**Why it is chosen.** It shrinks the outbound footprint from twenty machines to
one. It also lets implants operate on machines with no internet access at all.

**What gives it away.** Machine-to-machine traffic that does not fit the
organisation's normal pattern — a workstation acting as a relay for other
workstations. REPORTED, with unusual precision: AdaptixC2's named-pipe mode
produces a characteristic sequence of pipe operations, an initial packet whose
size field reads 100 to 140 bytes, and periodic `FSCTL_PIPE_PEEK` requests while
idle; its internal TCP mode defaults to port 9000
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).

INFERRED: this class is systematically under-monitored, because most network
monitoring is deployed at the perimeter looking outward. An internal relay is
invisible to a sensor that only watches the egress point — and the relay design
exists precisely because attackers know that.

### Legitimate online services

**How it works.** The orders live in a normal account on a normal service. The
implant reads them from there.

**Why it is chosen.** It is the strongest available answer to reputation-based
blocking. There is no attacker-owned address in the traffic at all.

**What it costs.** The service can close the account, and the service holds
evidence. Both are real risks the attacker accepts.

**What gives it away.** Which machine is using the service, and how. REPORTED, in
full detail: the March 2026 GitHub-based channel had the implant post its
encrypted session key to issue number one of a specific repository, poll the
open-issues list every 60 seconds, take orders from issue titles — `beat` for a
heartbeat, titles starting with `upload` to deliver files — and return results as
base64 files committed under a `download/` path, all encrypted with RC4 using a
16-byte per-session key
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).

INFERRED: notice that the 60-second poll makes this channel *more* detectable by
rhythm analysis than a well-tuned HTTPS beacon, not less. It bought
destination-based invisibility and paid for it in timing regularity. That trade is
the crack in the trusted-service approach, and chapter 5 is where you exploit it.

### Non-application-layer protocols

**How it works.** ICMP — the protocol behind `ping` — carries a data field that
nobody inspects. So do various other low-level protocols. Data goes in the field.

**Why it is chosen.** It sits below the layer most security tooling watches. A
proxy that inspects all web traffic sees nothing of it.

**What it costs.** A lot. It is slow, it is often blocked outright at the border,
and it stands out badly once anyone looks.

**What gives it away.** Volume and size. Normal `ping` traffic uses small,
fixed-size, symmetric packets in modest numbers. A tunnel produces large payloads,
asymmetric sizes, and sustained high rates. INFERRED: this is a cheap detection
because the legitimate baseline is so narrow — most organisations could alert on
ICMP payloads above a threshold size and see almost no noise.

### Skipping DNS entirely

**How it works.** The address is compiled into the malware. No lookup happens.

**Why it is chosen.** It defeats every DNS-based control at once: protective
resolvers, query logging, name reputation, generated-name detection. All of it
watches a lookup that never occurs.

**What it costs.** Rigidity. Change the server and every deployed copy breaks.
That is why this is most common in commodity malware and botnets rather than
patient targeted operations.

**How common.** REPORTED: among malware samples showing C2 activity, 45.32% made
at least one direct-to-address connection; 41.97% after excluding port scanning;
and direct-to-address accounted for 23.17% of all C2 connection attempts observed.
The dataset was over 4 million dynamic-analysis reports across 30 days
([Unit 42, Aug 2026](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/)).
CALCULATED: 9.11% of all analysed samples, benign and malicious together, made a
direct-to-address C2 connection.

**What gives it away.** The absence itself. INFERRED, and this is one of the
highest-value rules in the report: a connection to an external address for which
your own resolver logged no preceding lookup is anomalous by construction. Normal
software resolves names. Correlating the two logs turns "we cannot see the DNS"
from a blind spot into a signal — the missing lookup *is* the evidence.

## Which class to worry about

INFERRED throughout this table. It ranks the classes by how hard each is to
detect with commonly deployed tooling, against how often defenders report seeing
it. Both axes are judgements, not measurements, and the reasoning is in the notes
column so you can disagree with a specific cell rather than the whole table.

| Channel class | Prevalence | Detection difficulty | Note |
| --- | --- | --- | --- |
| Legitimate online services | rising fast | very high | No bad destination exists to block |
| HTTPS to attacker server | very high | moderate | Well understood, well tooled, still works |
| Direct to address, no DNS | high | low | The missing lookup is the signal |
| DNS tunnelling | moderate | moderate | Distinctive name shapes; VPN products cause noise |
| Encrypted DNS | rising | moderate | Cheap rule available; few teams have written it |
| Mutual TLS | moderate | high | Blocks inspection; timing still works |
| Internal relays | moderate | high | Invisible to perimeter-only monitoring |
| Legitimate remote-access tools | high | moderate | Often permitted by policy, which is the problem |
| Non-application-layer | low | low | Narrow legitimate baseline makes it easy |
| Removable media | very low | very high | Only relevant to isolated networks |

INFERRED, as the conclusion: the two rows that should drive investment are the
top one and the third one. Trusted-service channels are the growth area and the
hardest to see. Direct-to-address is common and cheap to catch, and most
organisations have not written the rule.

---

<!-- 11archive-source: 03-framework-landscape.md -->

# The framework landscape

## What a framework is, and why one exists at all

A command-and-control framework is a product. It has a server the operator runs, a
console they work from, and a generator that builds implants for whatever machine
they are targeting. It handles the encryption, the scheduling, the file transfers,
the module loading, and the bookkeeping of thirty compromised machines at once.

These tools were built for penetration testers and red teams — security
professionals who are paid to break into their own employer's network and report
what they found. That work is legitimate, valuable, and requires exactly the
capabilities an intruder needs. Which is the whole problem: a tool that
convincingly emulates an attacker is a tool an attacker can use.

Every framework named below is a real security testing product with real
legitimate users. Naming them describes what defenders are finding, not what their
authors intended.

## The lineup

REPORTED and DOCUMENTED as marked in the notes. Costs and languages come from each
project's own material; the "seen in real attacks" column comes from the named
third-party reporting cited under each entry.

| Framework | Author | Language | Cost | Channel types | Seen in real attacks |
| --- | --- | --- | --- | --- | --- |
| Cobalt Strike | Fortra | Java server, C implant | commercial | HTTP, HTTPS, DNS, SMB pipes, TCP, SSH | extensively |
| Sliver | Bishop Fox | Go | free, open | mutual TLS, HTTP, HTTPS, DNS, WireGuard | extensively |
| Metasploit | Rapid7 | Ruby | free tier plus commercial | many | extensively |
| Havoc | community | C++, Go | free, open | HTTP, HTTPS, SMB pipes | extensively |
| Mythic | community | Python, Go | free, open | varies by agent: TCP, HTTP, DNS, SMB | yes |
| Brute Ratel C4 | Dark Vortex | C | commercial | HTTP, HTTPS, DNS, SMB, TCP | yes |
| AdaptixC2 | community | Go, C++ | free, open | HTTP, HTTPS, mutual TLS, DNS, encrypted DNS, SMB pipes, TCP | yes, rising |
| Empire | community | Python | free, open | HTTP, HTTPS | historically |
| Covenant | community | .NET | free, open | HTTP, HTTPS | not verified here |
| NimPlant | community | Nim | free, open | HTTP, HTTPS | limited |
| SuperShell | community | Go | free, open | HTTP, HTTPS | limited |

Sources for the "seen in real attacks" column, in order of the rows that need one:
[Red Canary](https://redcanary.com/threat-detection-report/trends/c2-frameworks/) and
[Microsoft](https://blogs.microsoft.com/on-the-issues/2023/04/06/stopping-cybercriminals-from-abusing-security-tools/)
for Cobalt Strike;
[Kaspersky](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/)
for Sliver, Metasploit, Havoc, and Brute Ratel C4;
[Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/)
and [The Hacker News](https://thehackernews.com/2025/10/russian-ransomware-gangs-weaponize-open.html)
for AdaptixC2; and a weekly infrastructure tracker
([Tsurezure Diary, May 2026](https://disconinja.hatenablog.com/entry/2026/05/10/144248))
for Mythic, NimPlant, and SuperShell. Covenant is listed as "not verified here"
because the one 2026 report found attributing it to a named campaign could not be
retrieved — see the exclusions list in
10-methodology-and-sources.md.

## The ranking problem

Three respected organisations publish which frameworks matter most. They disagree.
Understanding why is more useful than picking a winner.

### What each measurement is actually counting

| Source | Method | Result | Period |
| --- | --- | --- | --- |
| [Kaspersky Securelist](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/) | Frequency of framework mentions in open-source reporting | Top four: Sliver, Metasploit, Havoc, Brute Ratel C4 | H1 2025 |
| [Red Canary](https://redcanary.com/threat-detection-report/trends/c2-frameworks/) | Confirmed detections across managed customer environments | Cobalt Strike leads; Metasploit second | 2022 report |
| [Hunt.io](https://hunt.io/blog/guide-hunting-cobalt-strike-part-4-c2-feeds-api) | Internet-wide scanning for exposed servers | Cobalt Strike, at large scale | 2025–Jan 2026 |

INFERRED, taking each in turn.

**Reporting frequency measures research attention.** A framework gets written up
when it is novel, when it is easy to analyse, or when a vendor wants to
demonstrate coverage. Kaspersky's own methodology note is careful about this: the
ranking comes from tracking "the frequency of known C2 framework usage in attacks"
across open sources. A well-established tool that everyone already understands
generates fewer new write-ups than a newcomer, regardless of which is more common.
Sliver topping this list is a real signal — but the signal is "Sliver is where the
analytical energy is", which is not the same as "Sliver is in most intrusions".

**Endpoint detection counts measure what defenders caught on machines they were
watching.** This is the closest thing to ground truth about real intrusions, and
it is biased in a specific direction: toward frameworks that are well-signatured.
A framework the sensor does not recognise does not appear in the count. Note also
that the Red Canary page cited here is from its 2022 report, so it is the oldest
of the three and should be weighted accordingly.

**Internet scanning measures infrastructure that answers a probe.** This is the
most precise of the three and the most systematically skewed. A server is counted
if a scanner can identify it — meaning the count rewards frameworks that are easy
to fingerprint and misses those hiding behind a relay, requiring a client
certificate, or living inside GitHub. Cobalt Strike dominates the scanning data
partly because it is the most heavily studied and therefore the most identifiable
target on the internet.

### The numbers behind the scanning view

REPORTED ([Hunt.io](https://hunt.io/blog/guide-hunting-cobalt-strike-part-4-c2-feeds-api)):

| Measure | Value |
| --- | --- |
| Unique addresses hosting Cobalt Strike, January 2026 | 1,921 |
| Distinct addresses across all of 2025 | 8,868 |
| 2025 monthly average | ~739 |

CALCULATED: 8,868 ÷ 12 = 739.0, which matches the reported monthly average exactly
— the figures are internally consistent. CALCULATED: January 2026 ran at 2.60× the
2025 monthly average.

INFERRED, and worth stating carefully because it is easy to misread: a jump in
distinct addresses is not necessarily a jump in operations. It is at least as
likely to indicate faster rotation — the same operators cycling through more
addresses to stay ahead of blocklists. The source itself frames the finding that
way, emphasising "rapid rotation and dynamic deployment". A number that goes up
because attackers are moving faster looks identical to a number that goes up
because there are more attackers, and this dataset cannot separate them.

For contrast on scope: REPORTED, a hobbyist tracker monitoring seven frameworks
identified 63 servers worldwide in the week of 4–10 May 2026
([Tsurezure Diary](https://disconinja.hatenablog.com/entry/2026/05/10/144248)).
INFERRED: the two-orders-of-magnitude gap against Hunt.io's figures is not a
contradiction — it is what happens when you change how much you scan and how
loosely you match. Any published count of "how many C2 servers exist" is really a
statement about the scanner.

## The four that matter most

### Cobalt Strike

The commercial product that defined the category. Its implant is called Beacon,
and its defining feature is the **malleable profile** — a configuration file that
changes almost everything about how the implant behaves on the network and in
memory.

REPORTED: a malleable profile is often mistaken for cosmetic traffic disguise, but
it is better understood as a behaviour policy — it controls HTTP header values,
payload encoding, sleep timing, and how the implant injects into other processes
([Medium / Khaled Fawzy](https://khaled0x07.medium.com/engineering-a-highly-customized-malleable-c2-profile-30e0efee307c)).

Its other well-known feature is the **sleep mask**. When a beacon is idle its code
sits in memory where a scanner can find it, so the sleep mask scrambles that
memory while dormant and unscrambles it only to check in. DOCUMENTED: Fortra's own
documentation describes the built-in behaviour as XOR-based obfuscation of strings
and data before sleeping ([Cobalt Strike](https://www.cobaltstrike.com/sleep-masks)).
INFERRED: this means memory scanning has a narrow window — the moments around each
check-in — which is a direct argument for continuous rather than scheduled memory
inspection.

Development continues actively. DOCUMENTED, from Fortra's own release notes: 4.13
shipped June 2026 with reworked task tracking and the ability to change malleable
settings without restarting the server; 4.12 in November 2025 added "drip loading"
and a REST interface in beta
([release notes](https://download.cobaltstrike.com/releasenotes.txt),
[Cobalt Strike blog](https://www.cobaltstrike.com/blog/cobalt-strike-412-fix-up-look-sharp)).
REPORTED: drip loading writes a payload into memory in small pieces with delays
between them, specifically to break the event-correlation logic that endpoint
products use to spot injection
([CyberSecurityNews](https://cybersecuritynews.com/cobalt-strike-4-12-released/)).
4.12 also added two Windows privilege-escalation bypasses covering up to Windows 11
24H2, and raised the in-memory download ceiling to 2 GB so large files never touch
disk.

INFERRED: read that release list as a statement of where the arms race is. Every
headline item targets a specific detection method — event correlation, disk-based
scanning, restart-based configuration extraction.

### Sliver

Written in Go by Bishop Fox, free and open. Its significance is that it made
Cobalt Strike's capabilities free.

REPORTED: it offers mutual TLS, HTTP, HTTPS, DNS, and WireGuard channels, with
mutual TLS authenticating both ends by certificate and WireGuard building a full
encrypted tunnel between implant and server. It runs implants in either patient
beacon mode or live session mode, and being written in Go it cross-compiles for
Windows, Linux, and macOS from one codebase
([Sliver field guide](https://ring0shady.github.io/posts/sliver-c2-deep-dive/),
[transport analysis](https://dominicbreuker.com/post/learning_sliver_c2_03_transports_in_detail_mtls_and_wg/)).

INFERRED: the WireGuard option is the most defensively awkward feature in the
lineup. WireGuard is a legitimate, widely deployed VPN protocol, so the traffic is
not anomalous in itself, and once the tunnel is up everything inside it is opaque.
Detection has to happen at tunnel establishment or not at all.

### Havoc

Free and open, written in C++ and Go, with a polished operator interface. REPORTED:
it ranks in the top four by open-source reporting frequency and is detectable via
JA4X handshake fingerprinting
([Kaspersky](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/),
[FoxIO](https://blog.foxio.io/ja4+-network-fingerprinting)). Its role in the
landscape is that it demonstrated a free tool could match commercial polish, which
mattered for adoption.

### AdaptixC2

The newest of the four and the best-documented from a defender's point of view,
which makes it the most useful teaching example in this report.

REPORTED: Unit 42 first wrote it up in September 2025 as an open-source
post-exploitation framework already appearing in campaigns. It supports web,
named-pipe, and TCP beacons; encrypts its configuration with RC4; runs shellcode
in memory via PowerShell without writing to disk; loads Beacon Object Files —
small compiled C modules that execute inside the implant's own process; and exposes
`KillDate` and `WorkingTime` settings so the implant expires on schedule and only
operates during the victim's business hours
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/)).

REPORTED: it was deployed alongside Fog ransomware against a financial institution
in Asia, and has been adopted by actors tied to both Fog and Akira ransomware
operations
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/),
[The Hacker News](https://thehackernews.com/2025/10/russian-ransomware-gangs-weaponize-open.html)).

REPORTED: by April 2026 Kaspersky had published detection indicators across all
five of its channel types, with named detection verdicts for each — HTTP, TLS, TCP,
SMB, and DNS
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
Those indicators are the source for most of the concrete channel detail in
02-channel-taxonomy.md.

REPORTED: it was also the framework in the March 2026 GitHub-based campaign, where
a threat actor wrote a *custom listener* so the standard beacon could talk to
GitHub's API instead of a server
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).

INFERRED: that last point is the important one, and it generalises past AdaptixC2.
An extensible open framework means the channel is no longer a property of the tool.
A defender cannot enumerate "the ways framework X communicates" and be finished,
because a competent actor writes a new transport in an afternoon. Detection has to
target the behaviour that survives a transport swap — the check-in rhythm, the
message structure, the host-side artefacts — and Kaspersky's own finding that
AdaptixC2's mutual-TLS mode carries "identical payload structure" to its plainer
transports is the proof that such invariants exist.

## Why free tools are winning

INFERRED, with the supporting evidence named.

**No licence to revoke.** Fortra can decline a sale and can cooperate with legal
action, as it did in 2023. Nobody can decline to let you download an open-source
project.

**No watermark.** Commercial builds carry identifiers that link an implant to a
licence. Open tools do not, which removes an attribution risk.

**Modification is expected.** The extensibility that makes these tools good for
red teams — Beacon Object Files, custom transports, module systems — is equally
available to an attacker, and it is what allowed the GitHub transport above.

**Detection pressure was applied unevenly.** A decade of industry effort went into
recognising Cobalt Strike. REPORTED: Hunt.io describes it as "one of the most
recognized and heavily signatured offensive frameworks", and says this has "driven
some actors toward alternatives such as Sliver or Havoc"
([Hunt.io](https://hunt.io/blog/russian-malicious-infrastructure-c2-servers-mapped)).

INFERRED, as the uncomfortable conclusion: the industry's success against one
framework produced migration to less-studied ones, and legal pressure on a vendor
pushed activity toward tools with no vendor to pressure. Both are real, and
neither means the effort was wrong — a heavily signatured tool is genuinely
harder to use. But it does mean framework-specific detection is a treadmill.
Anything built on behaviour that all of these tools share, because the job
requires it, is where durable detection lives. That is the subject of
05-detection-engineering.md.

---

<!-- 11archive-source: 04-infrastructure-and-evasion.md -->

# Infrastructure and evasion

The previous chapter covered the tool. This one covers the network the tool talks
to, and the work attackers do so that network cannot be found, blocked, or traced
back to them.

The attacker's problem here is the mirror of the defender's. A defender wants to
identify a bad destination and block it. So the attacker's goal is to make sure
that either no fixed destination exists, or that blocking it costs the defender
something they are unwilling to pay.

## Redirectors: never expose the real server

The oldest and still most universal practice. The implant never talks to the
operator's actual server. It talks to a cheap disposable machine — a
**redirector** — that forwards traffic onward.

The economics are the point. A redirector is a small rented server with a domain
name, costing a few pounds a month. When defenders find and block it, the operator
loses a few pounds and swaps in another; the real server, holding the operation's
data and the operator's identity, was never exposed. DOCUMENTED in ATT&CK as
`T1090 Proxy`, with sub-techniques for relays inside the victim network, outside
it, and chained together.

INFERRED, on why this matters for how you respond: blocking a C2 address is
therefore almost never a win against a competent operator. It is a win against
commodity malware with a hard-coded address, and it is a useful *signal* that you
have been noticed if the channel comes back somewhere new. Treating an address
block as remediation is the mistake.

Chained relays make attribution close to impossible from the victim's side. Tor
and commercial VPN chains are both used. Once traffic has passed three hops across
three jurisdictions, the victim's logs contain no information about who is at the
other end.

## Fast flux: make the address a moving target

If a defender blocks addresses, change them constantly. **Fast flux** publishes a
domain name whose address record changes every few minutes.

DOCUMENTED, and this one has a formal government treatment. Advisory `AA25-093A`,
"Fast Flux: A National Security Threat", was published 3 April 2025 by the NSA,
CISA, and FBI together with partners in Australia, Canada, and New Zealand
([CISA](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-093a)).

REPORTED, on the two variants
([Vectra's summary of the advisory](https://www.vectra.ai/blog/cisa-flags-fast-flux-as-a-national-threat-are-you-covered)):

- **Single flux** rotates the addresses a name points to. Block one and the name
  already resolves elsewhere.
- **Double flux** rotates the name servers as well — the systems that answer the
  question in the first place. Now there is no stable point anywhere in the chain
  to attack.

REPORTED: the advisory names Hive and Nefilim ransomware operations and the
Russian-linked Gamaredon group as users, and identifies bulletproof hosting
providers as offering it as a service to their customers.

The advisory's own framing of the defensive problem is the useful part. Blocklists
and static filtering fail here by construction, because they operate on exactly the
indicator that is being rotated. Its recommendations move to anomaly detection on
DNS queries, behavioural analysis, and intelligence sharing — and it asks
protective-DNS providers specifically to build detection for it, which is an
admission that individual organisations mostly cannot.

INFERRED, on the detection that does work: fast flux is loud in a way its users
cannot avoid. A name whose address changes every three minutes, or which resolves
to addresses spread across many unrelated networks, does not look like a normal
service. Content delivery networks also rotate addresses, but they rotate within
their own network ranges. The distinguishing feature is address diversity *across
unrelated owners*, and it is computable from resolver logs you already keep.

## Generated domain names

Instead of hard-coding a name, the implant computes one. Both sides run the same
formula — often seeded by the date — so both arrive at the same answer without
ever communicating it. DOCUMENTED as `T1568.002 Domain Generation Algorithms`.

The attacker registers only the few names they need. The implant may try dozens or
hundreds daily and get failures for all but one.

**What gives it away.** The failures. A machine asking about many nonexistent
domains in a short window is the signature, and it is highly visible in resolver
logs. The generated names also tend to look wrong — random consonant strings with
no linguistic structure — which classifiers detect well.

INFERRED: generated names are the technique most thoroughly beaten by centralised
DNS logging. The technique's whole design assumes nobody is counting failed
lookups per machine. Counting them is straightforward if all queries pass through
one resolver you own, which is why that control ranks first in
06-defender-playbook.md.

## Domain fronting: mostly closed

A technique worth understanding precisely because it *was* fixed, which is rare.

**How it worked.** An encrypted web request has two places that name the
destination: the name sent in the clear during the handshake so the server knows
which certificate to present, and the name sent inside the encrypted request. If a
content delivery network read the first to route the connection but the second to
route the request, an attacker could put an innocent name outside and their own
name inside. Traffic appeared to go to a major cloud service. It went to the
attacker.

DOCUMENTED as `T1090.004 Domain Fronting`.

**Why it mattered.** It was close to unblockable. Blocking the outer name meant
blocking a major cloud provider.

**How it was closed.** REPORTED: Amazon and Google both blocked the mismatch in
2018, returning an HTTP 421 error when the two names disagree — action taken after
the technique was publicised through its use by the Signal messenger
([Wikipedia](https://en.wikipedia.org/wiki/Domain_fronting),
[Haven](https://havenmessenger.com/blog/posts/domain-fronting-explained/)).
DOCUMENTED: Microsoft blocked it for newly created Azure Front Door and CDN
resources from 8 November 2022 and completed enforcement for existing domains on
22 January 2024, with a narrow exception where both names belong to the same
subscription
([Microsoft Learn](https://learn.microsoft.com/en-us/answers/questions/1421101/take-action-to-stop-domain-fronting-on-your-applic),
[Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-networking-blog/prohibiting-domain-fronting-with-azure-front-door-and-azure-cdn/ba-p/4006619)).

INFERRED, and this is the strategic lesson of the chapter: the technique died
because a handful of providers changed a default. No detection product, no
signature, and no customer configuration could have achieved that. Where control
of a technique sits with a small number of platforms, platform policy is the
effective intervention — and it is orders of magnitude cheaper than every
defender detecting it independently. Note also what it did *not* achieve:
attackers moved to abusing those same platforms in ways the platforms cannot
block, which is the next section.

## Living off trusted services

The current centre of gravity. Rather than hide the destination, choose a
destination that cannot be blocked.

DOCUMENTED as `T1102 Web Service`, with sub-techniques for two-way traffic,
one-way traffic, and dead drop resolvers — a public page or post that holds the
real server's address, so the implant looks it up rather than carrying it.

REPORTED: Cloudflare's 2026 threat report, published 3 March 2026, documents Google
Calendar, Google Drive, and Dropbox used to host payloads and deliver commands;
GitHub used for covert control; Amazon SES and SendGrid used for phishing delivery;
Azure Web Apps hosting credential-harvesting pages; and the paste sites
Teletype.in and Rentry.co used as dead drop resolvers pointing to rotating control
addresses. It names the pattern "living off the XaaS"
([Cloudflare](https://blog.cloudflare.com/2026-threat-report/)).

REPORTED: a China-linked group tracked as GopherWhisper ran two-way control over
Slack, Discord, and Microsoft Graph — using Outlook *draft* emails as the message
store, so the orders never actually sent — with exfiltration through the legitimate
file.io service
([DecryptionDigest](https://www.decryptiondigest.com/blog/gopherwhisper-china-apt-slack-discord-outlook-c2)).

REPORTED: compromised servers have been configured to POST directly to
`api.slack.com`, `hooks.slack.com`, and `discord.com` to deliver stolen AWS access
keys, SSH keys, and internal API tokens into attacker-controlled chat channels
([Hive Security](https://hivesecurity.gitlab.io/blog/c2-without-owning-c2/)).

The fully worked example remains the March 2026 GitHub channel described in
02-channel-taxonomy.md: session key posted to issue
number one, orders read from issue titles on a 60-second poll, results committed
as files, all RC4-encrypted under a per-session key
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).

### Why this defeats most defences

INFERRED, taking each defence in turn.

**Reputation scoring fails.** `github.com` has the best reputation available. So do
`slack.com`, `graph.microsoft.com`, and `drive.google.com`.

**Certificate inspection fails.** The certificate is genuinely GitHub's, genuinely
valid, and genuinely trusted.

**Handshake fingerprinting weakens.** An implant using the platform's own client
library produces the platform's own fingerprint. It is not imitating legitimate
traffic; it is generating it.

**Blocking is not available.** Your developers need GitHub. Your staff need Slack.
Your business runs on Microsoft Graph.

### What still works

INFERRED, and the reasoning is worth following because it is the whole defensive
answer to this class.

The attacker removed the *destination* signal. They did not remove the *actor*
signal or the *rhythm* signal.

**Which machine is doing it.** A finance workstation calling the GitHub API is
strange even though GitHub is fine. A domain controller calling any external API
is strange. The destination is trusted; the pairing of that destination with that
machine is not. This requires a baseline of which machines legitimately use which
services — real work, but it is work that pays off against the entire class at
once rather than against one campaign.

**How they are doing it.** REPORTED: the GitHub campaign authenticated with a
personal access token, recognisable by its `ghp_` prefix, to
`api.github.com`, alongside file operations and scheduled tasks named to imitate
Windows services such as `\MSDNSvc` and `\MicrosoftUDN`
([Zscaler](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener)).
Real developer traffic goes through git over HTTPS or SSH. Automated API calls
with a personal token from a machine with no development tooling is a different
behaviour wearing the same destination.

**The rhythm.** A 60-second poll is a metronome. Trusted-service channels tend to
be *more* regular than tuned HTTPS beacons, because the operator has stopped
worrying about the network signal — they believe the destination protects them.
INFERRED: that is the exploitable overconfidence in this technique, and it is the
single most useful sentence in this chapter for a detection engineer.

## Bulletproof hosting

Some providers deliberately ignore abuse reports. They advertise it. This is
**bulletproof hosting**, and it is the commercial layer beneath a large share of
persistent C2 infrastructure.

REPORTED, on the enforcement record:

| Date | Target | Action | Source |
| --- | --- | --- | --- |
| Feb 2025 | Zservers / XHost | US, UK, Australia sanctions; two administrators named; LockBit support cited | [Elliptic](https://www.elliptic.co/blog/us-cracks-down-on-russian-bulletproof-hosting-services) |
| 1 Jul 2025 | Aeza Group | OFAC sanctions on the group, its leadership, and affiliates including a UK entity | [Chainalysis](https://www.chainalysis.com/blog/ofac-sanctions-aeza-group-bulletproof-hosting-crypto-payments-july-2025/), [The Hacker News](https://thehackernews.com/2025/07/us-sanctions-russian-bulletproof.html) |
| 19 Nov 2025 | Media Land, plus further Aeza fronts | OFAC sanctions; LockBit, BlackSuit, and Play ransomware support cited | [Security Affairs](https://securityaffairs.com/184871/cyber-crime/coordinated-sanctions-hit-russian-bulletproof-hosting-providers-enabling-top-ransomware-ops.html), [US Treasury](https://home.treasury.gov/news/press-releases/sb0185) |

REPORTED, and the most instructive detail: after the July 2025 sanctions, Aeza
rebranded to hide its links to new infrastructure, and a UK company called
Hypercore Ltd. was subsequently designated for shifting address infrastructure on
Aeza's behalf
([Security Affairs](https://securityaffairs.com/184871/cyber-crime/coordinated-sanctions-hit-russian-bulletproof-hosting-providers-enabling-top-ransomware-ops.html)).

INFERRED: sanctioning a hosting provider raises the cost of malicious hosting and
produces a traceable evasion trail — the rebranding itself became evidence. It does
not remove the capacity. The practical value to a defender is narrower and still
real: sanctioned and known-abusive networks are legitimate candidates for
network-level blocking, because almost no business need points there. That is a
cheaper and more durable control than tracking individual addresses.

## Hiding the infrastructure itself

DOCUMENTED as `T1665 Hide Infrastructure` — one of the two techniques added to the
tactic since ATT&CK v10.1, which is itself a signal about where the trade moved.

Two variants deserve specific mention.

**Compromised third parties.** The control server is somebody else's hacked
machine. There is nothing to trace, because the owner is a victim too. REPORTED:
Volt Typhoon routed traffic through compromised small-office and home-office
routers, firewalls, and VPN hardware
([Microsoft](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/)).
INFERRED: this defeats geographic and reputation reasoning completely. Traffic to a
residential address in the victim's own country looks like nothing at all.

**Refusing to answer.** Servers that only respond to a client presenting the right
certificate, or after a specific sequence of connection attempts — ATT&CK's
`T1205 Traffic Signaling` and `T1205.001 Port Knocking`. To a scanner the server
looks closed or absent. This is a direct counter to the internet-scanning approach
that produces the numbers in 03-framework-landscape.md,
and it is why those numbers systematically undercount careful operators.

## The pattern across the chapter

INFERRED, drawing the four sections together.

Every technique here trades one property for another, and the pattern is
consistent: **attackers give up control of their infrastructure to gain
invisibility.**

A redirector means someone else owns the machine. Fast flux means the address is
never stable. A trusted service means the platform owns the channel and can close
it. A compromised router means an unwitting third party is hosting the operation.

Each step makes the operator harder to find and easier to *interrupt*. A
trusted-service channel dies when the platform closes the account. A compromised
router channel dies when the owner reboots and patches.

That has a direct consequence for defensive strategy: as attackers move up this
ladder, the leverage moves from the individual defender to the platform. Chapter 7
argues that this is why disruption operations have become more prominent — not
because detection got worse, but because the choke points moved somewhere a
single organisation cannot reach.

---

<!-- 11archive-source: 05-detection-engineering.md -->

# Detection engineering

Everything so far described the attacker's side. This chapter is about what
actually finds a control channel, ranked by how well it survives an attacker who
knows you are using it.

That last criterion is the one that matters and the one most often skipped. A
detection that works until someone changes a configuration value is not a control;
it is a delay. So each method below carries an explicit note on what defeats it.

## The hierarchy that matters

INFERRED, and it organises the rest of the chapter. Detection methods sort by how
fundamental the thing they measure is to the attacker's job.

| Level | What it measures | How durable | Why |
| --- | --- | --- | --- |
| Behaviour | That a relationship exists and repeats | very high | The attacker needs the relationship |
| Structure | How messages are shaped and sized | high | Changing it means rewriting the tool |
| Implementation | How the software builds a connection | moderate | Changeable with effort |
| Content | Specific strings, paths, certificates | low | Changeable with a config edit |
| Reputation | Whether the destination is known bad | very low | New infrastructure is free |

Most security spending sits at the bottom two rows. Most durable value sits at the
top two.

## Rhythm analysis

The most durable network detection there is, and the one that needs no decryption.

### The idea

An implant checks in on a schedule. Schedules are periodic. Periodicity lives in
the *timing* of connections, and timing is metadata — visible whatever encryption
is in use, whatever the destination, whatever the protocol.

### How it is done in practice

REPORTED: the standard open-source approach pairs Zeek, which turns raw network
traffic into connection records, with RITA, which scores those records. RITA gives
each source-and-destination pair a beacon score from 0.0 for random to 1.0 for
perfectly periodic, and scores above 0.8 across hundreds of connections indicate
the statistically regular traffic characteristic of an automated beacon
([Black Hills Information Security](https://www.blackhillsinfosec.com/detecting-malware-beacons-with-zeek-and-rita/),
[RITA](https://github.com/activecm/rita)).

REPORTED: RITA scores both the intervals between connections *and* the sizes of
those connections, and uses skew — how lopsided a distribution is — as one input,
because a value near zero means a symmetric spread, which is what a randomised
sleep timer produces
([Active Countermeasures](https://www.activecountermeasures.com/free-tools/rita/),
[threat hunting labs](https://activecm.github.io/threat-hunting-labs/beacons/)).

### Why jitter does not save the attacker

This is the important part, and it is counter-intuitive enough to be worth stating
slowly.

Jitter adds randomness to the sleep interval so check-ins are not exactly regular.
An operator setting a 45-second sleep with jitter might produce intervals of 37,
52, 41, 55, 39 seconds — visibly irregular.

But the randomness itself is regular. The intervals are uniformly distributed
between 35 and 55 seconds, every time, for as long as the channel runs. A
distribution that tight and that stable is not what human or application traffic
produces. REPORTED: a beacon sleeping between 35 and 55 seconds still reads as
periodic across 200 connections in three hours, because the statistical pattern
survives even though each individual interval differs
([Hive Security](https://hivesecurity.gitlab.io/blog/cobalt-strike-detection-hunting/)).

INFERRED: to genuinely defeat rhythm analysis an operator would need intervals
drawn from a wide, irregular, non-stationary distribution — hours to days, varying
in character over time. That is available, and it is why long-haul implants exist.
The cost is severe: an implant checking in twice a day is nearly unusable for
interactive work. The attacker is choosing between being detectable and being
useful, and that is the best position a defender can put them in.

### What defeats it

**Very long, highly varied sleeps.** Costs the attacker usability, as above.

**Traffic volume you cannot store.** Rhythm analysis needs history. Organisations
that keep 24 hours of connection records cannot detect a channel checking in every
six hours, because four data points prove nothing.

**Legitimate periodic traffic.** This is the real operational cost, and it is
large. Software update checks, monitoring agents, certificate revocation lookups,
telemetry, and cloud sync clients are all periodic beacons by design. INFERRED:
rhythm analysis without a maintained allowlist of known-good periodic destinations
produces enough noise to be abandoned, which is the most common way teams fail at
this. The allowlist is the work. Budget for it.

## Handshake fingerprinting

### The idea

When a program opens an encrypted connection it announces its capabilities — which
ciphers it supports, in which order, with which extensions. Different software
makes different announcements. Hash the announcement and you get a fingerprint
identifying the software, without reading a byte of the encrypted content.

The schemes in use:

| Scheme | Fingerprints | Note |
| --- | --- | --- |
| JA3 | The client's opening message | Original, widely deployed, easiest to change |
| JA3S | The server's reply | Pairs with JA3 |
| JA4 | The client, improved | More stable across versions than JA3 |
| JA4S | The server, improved | |
| JA4X | Certificate structure | Catches how the certificate was generated |
| JARM | Server response to crafted probes | Active — you scan the server |

REPORTED: Zeek records JA3 and JA3S fingerprints automatically in its TLS log, and
Suricata collects JA3 as well, so the raw material is available in standard
open-source tooling
([systemshardening.com](https://www.systemshardening.com/articles/network/tls-fingerprinting-ja3-ja4/)).

### Why the server side matters more

REPORTED, and this is the sharpest idea in the fingerprinting literature: an
attacker can customise their client's announcement to avoid a known JA4, but they
cannot control the server's reply unless they control the server. So pairing the
client fingerprint with the server fingerprint gives a full-handshake identity that
is much harder to forge, and known-bad server fingerprints from Cobalt Strike team
servers are published in threat intelligence feeds
([systemshardening.com](https://www.systemshardening.com/articles/network/tls-fingerprinting-ja3-ja4/)).

REPORTED: JA4X can detect and block traffic to SoftEther, Tor, Metasploit, Sliver,
Havoc, and various remote-access implants, and combined with JARM data it is
effective for finding related servers during internet-wide hunting
([FoxIO](https://blog.foxio.io/ja4+-network-fingerprinting)).

REPORTED: Shodan has carried "Cobalt Strike Beacon" as an identified product since
November 2021, so hunting for newly stood-up servers through public scanning data
is possible for anyone
([Medium / TΞLΞMΞTRY](https://t3l3m3try.medium.com/hunting-cobalt-strike-servers-385c5bedda7b)).

### What defeats it, and the decay problem

**Fingerprint feeds go stale, quietly.** This is the finding defenders most need to
internalise. REPORTED: researchers found it is possible to identify C2 servers by
their TLS fingerprint, but that fingerprints overlapping with legitimate servers
increased over time, concluding that a fingerprint database must be updated often
or detection becomes less effective
([systemshardening.com](https://www.systemshardening.com/articles/network/tls-fingerprinting-ja3-ja4/)).

INFERRED: a stale fingerprint feed is worse than none, because it presents as a
working control on a dashboard while catching nothing and generating false
positives against legitimate software that has drifted into the same fingerprint.
Treat these feeds as perishable, with an owner and a refresh cadence.

**Using a real library.** An implant built on the platform's own HTTP library
produces the platform's own fingerprint. This is the deep reason trusted-service
channels weaken fingerprinting: the traffic is not imitating a legitimate client,
it *is* one.

**Refusing to answer probes.** JARM requires the server to respond. Servers behind
client-certificate requirements or connection-sequence triggers do not.

## Structure and volume analysis

Between behaviour and implementation sits the shape of the messages.

### What to look at

**Directional balance.** Browsing downloads far more than it uploads. A channel
sending large volumes outbound is a different shape. Bulk theft over the control
channel inverts the expected ratio outright.

**Size clustering.** Check-in messages are near-identical in size because they are
the same message. A destination receiving hundreds of requests all within a few
bytes of each other is not being browsed by a person.

**Session duration.** Interactive sessions produce long-lived connections carrying
small packets in both directions — a shape that looks like a terminal, because it
is one.

### The academic state of play

REPORTED: a June 2025 paper, "Striking Back At Cobalt: Using Network Traffic
Metadata To Detect Cobalt Strike Masquerading Command and Control Channels" by
Parssegny, Mazel, Levillain, and Chifflier, detects Cobalt Strike channels from
connection patterns and flow characteristics rather than content, using samples
from malware-traffic-analysis.net plus controlled instances across 2023–2024
([arXiv 2506.08922](https://arxiv.org/pdf/2506.08922)).

Its specific performance figures could not be extracted from the paper during this
research and are therefore **unavailable** here rather than estimated. What the
work establishes for our purposes is directional and still useful: metadata-based
detection sidesteps the encryption problem that stops content inspection, and
published academic approaches exist that do not require decryption.

REPORTED: on the encrypted-DNS side, a December 2025 paper by Elaoumari built a
containerised toolkit to generate evasive DNS-over-HTTPS exfiltration and benchmark
Random Forest, Gradient Boosting, and Logistic Regression classifiers against it,
varying chunk size, encoding, padding, and resolver rotation
([arXiv 2512.20423](https://arxiv.org/abs/2512.20423)). No performance figures
appear in its abstract, so none are quoted.

INFERRED: the honest summary of the research literature is that metadata detection
works, that it is an active field, and that published effectiveness numbers are
hard to compare because everyone uses different datasets. Do not expect a paper to
hand you a threshold. Do expect the *features* they identify — interval
distribution, size clustering, directional ratio, destination novelty — to be the
right things to measure in your own environment.

## DNS analytics

Because so many channels touch DNS, resolver logs are disproportionately valuable.

### What to look for

**Name shape.** REPORTED, concretely: AdaptixC2's DNS channel produces subdomains
nested eight or more levels deep, high-randomness strings, and names exceeding 100
characters
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
Tunnels must encode data into names, and encoded data does not look like language.

**Failed lookups per machine.** Generated-name schemes try many names that were
never registered. A machine producing an unusual number of failures in a short
window is the signature.

**Unique names under one parent.** A tunnel generates a new name for every message.
Thousands of distinct names under a single domain, from a single machine, is a
tunnel.

**Query volume to one domain.** Moving real data through DNS takes thousands of
queries because each one carries so little.

**Who else asks.** A domain queried by exactly one machine in your organisation,
ever, is interesting regardless of anything else about it.

### The rule that catches DNS-skipping malware

INFERRED, and it is the highest value-per-effort item in this chapter. Correlate
two logs you probably already have: outbound connections, and DNS queries.

A connection to an external address with no preceding lookup for a name that
resolves to it is anomalous by construction. Normal software resolves names first.
REPORTED, on how much this is worth: 45.32% of malware samples with C2 activity
made at least one direct-to-address connection, accounting for 23.17% of all C2
connection attempts
([Unit 42](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/)).

The known exceptions are enumerable — your own infrastructure by address,
peer-to-peer applications, some network appliances, cached results within their
lifetime — which means the allowlist is finite and the rule is maintainable.

### What defeats DNS analytics

Encrypted DNS to an outside resolver, which is why forcing all DNS through your own
resolver is the precondition for everything in this section. See
06-defender-playbook.md.

## Host-side detection

The network sees the channel. The endpoint sees the thing creating it, and
sometimes that is easier.

### Memory scanning against sleep masks

An implant runs in memory. Scanning memory for known implant patterns works — which
is why sleep masks exist. DOCUMENTED: Cobalt Strike's built-in sleep mask XOR-
obfuscates strings and data before the beacon sleeps, so the payload is masked most
of the time and briefly exposed when it checks in
([Cobalt Strike](https://www.cobaltstrike.com/sleep-masks)).

INFERRED, and it is an actionable scheduling point: the exposure window is
correlated with check-in time. Periodic memory scanning has a low chance of
sampling that window; scanning triggered by the process making a network connection
has a much higher one. Tie memory inspection to network events rather than to a
timer.

### Injection sequences

REPORTED: process injection produces a recognisable sequence of Windows API calls —
open a remote process, allocate memory in it, write code, create a thread — and
interactions between processes at different privilege levels are themselves
suspicious
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).

REPORTED: Cobalt Strike 4.12's drip loading attacks exactly this, writing payloads
in small chunks with configurable delays to break the correlation logic
([CyberSecurityNews](https://cybersecuritynews.com/cobalt-strike-4-12-released/)).
INFERRED: correlation windows are therefore a tunable that attackers now target
directly. A detection requiring all four calls within two seconds is defeated by a
three-second delay. Widening the window costs noise. This is a genuine arms race
with no clean resolution, and it argues for weighting network-side detection more
heavily than sequence-based host detection.

### Internal channel artefacts

REPORTED, with useful specificity: AdaptixC2's named-pipe mode produces a
characteristic operation sequence, an initial packet whose size field reads 100 to
140 bytes, and periodic pipe-peek requests while idle; its internal TCP mode
defaults to port 9000
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).

REPORTED: the same source lists the host behaviours that usually accompany a live
channel — LDAP queries against Active Directory password attributes, access to
`lsass.exe` memory, registry hive access for SAM, SECURITY and SYSTEM, browser
profile access, Kerberos events 4768 and 4769, and command shells spawned as
children of the Windows remote-management service.

INFERRED: these are not channel detections, they are *consequence* detections. In
practice they fire more often than channel detections do, because attackers vary
their transport far more readily than they vary the credential theft and lateral
movement the transport exists to enable.

## Rule-based detection: still worth having

The bottom of the hierarchy is not worthless. It is cheap, fast, and catches the
large volume of attackers who did not customise anything.

REPORTED: Suricata community rules detect beaconing through signatures matching
terms such as *beacon*, *C2*, *Meterpreter*, and *Metasploit*; Zeek identifies
self-signed certificates commonly used by Meterpreter sessions; and modern
frameworks use port 443 but also 80, 8080, 8443, 4433 and custom high ports, so
detection port lists and Zeek's TLS port configuration should cover all of them
([Medium / Aman](https://medium.com/@amgill003ca/detecting-payload-execution-and-c2-communication-using-wazuh-suricata-and-zeek-1776cb47f3df),
[Security Boulevard](https://securityboulevard.com/2026/08/writing-suricata-rules-to-detect-command-and-control-traffic/)).

REPORTED: Zeek logs are fully compatible with Sigma, the vendor-neutral detection
rule format, so network detections can be written once and deployed across
different analysis platforms
([Corelight](https://corelight.com/blog/zeek-sigma-fully-compatible-for-cross-siem-detections)).

That port list is worth acting on immediately. INFERRED: a monitoring
configuration that only decodes TLS on 443 is blind to a channel on 8443 by
configuration rather than by evasion, and this is a common misconfiguration that
costs nothing to fix.

## What does not work as well as people hope

### Indicator feeds alone

Lists of known-bad addresses and domains catch commodity malware and the tail of
careless operators. They do not catch anything that stood up new infrastructure
this week, which is free. The redirector economics in
04-infrastructure-and-evasion.md mean a blocked
address costs a competent operator a few pounds.

Keep the feeds. They are cheap and they clear volume. Do not report their coverage
as your C2 detection capability.

### Decryption

Inspecting encrypted traffic by terminating it and re-encrypting it looks like the
complete answer. INFERRED, on why it is not:

- It fails outright against the growth area. Trusted-service channels are
  genuinely going to GitHub, with a genuine certificate, over an authorised
  connection. Decrypting reveals an API call that looks like an API call.
- Certificate pinning breaks. Modern applications, and most mobile software, refuse
  a substituted certificate. Every exception you add is a hole.
- You create a single system holding every plaintext session in the organisation.
  That is now the highest-value target on your network.
- Mutual TLS defeats it. Without the client certificate there is no session to
  intercept.

Metadata approaches deliver more detection per unit of cost and risk. Decryption
has legitimate narrow uses — a specific investigation, a specific segment — and is
a poor foundation for a programme.

### Time-of-day rules

"Alert on connections outside business hours" is defeated by one configuration
value. REPORTED: AdaptixC2's `WorkingTime` restricts activity to chosen hours
specifically to blend with the victim's normal day
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/)).
Useful as a supporting signal. Never a primary one.

### Anything framework-specific, over time

Detection for Cobalt Strike specifically became excellent, and
03-framework-landscape.md documents the migration
that followed. INFERRED: framework-specific detection is necessary and permanently
incomplete. Build it, and do not let it substitute for the behavioural layer.

## Putting it together

INFERRED. A detection programme for control channels, in the order to build it.

1. **Centralise DNS.** Every query through a resolver you own, logged. This is the
   precondition for the DNS analytics and the correlation rule, and it is the
   single highest-leverage step.
2. **Record connection metadata and keep it long enough.** Thirty days minimum.
   Rhythm analysis is impossible without history, and this determines the longest
   sleep interval you can ever detect.
3. **Write the missing-lookup rule.** Cheap, targets a known 45% of C2-active
   malware, and mostly reuses what steps 1 and 2 produced.
4. **Score periodicity, and fund the allowlist.** The scoring is the easy half.
   The allowlist of legitimate periodic destinations is the half that determines
   whether the team keeps using it.
5. **Subscribe to fingerprint feeds and assign an owner.** With a refresh cadence,
   because they decay.
6. **Baseline machine-to-service pairings.** Which machines legitimately use
   GitHub, Slack, cloud storage, and code-editor tunnels. This is the only thing
   that works against trusted-service channels.
7. **Tie memory inspection to network events.** Not to a timer.
8. **Keep the rule feeds.** For volume, not for coverage.

Steps 1 through 4 are behaviour and structure — the durable half. Steps 5 through 8
are implementation and content, and they need continuous maintenance to stay
useful. INFERRED: a team that reverses this order builds the fragile half first,
watches it decay, and concludes the problem is unsolvable.

---

<!-- 11archive-source: 06-defender-playbook.md -->

# The defender playbook

The actionable chapter. Controls that prevent or reveal control channels, ranked by
benefit against effort, followed by what to do when you find a live one.

Everything here is INFERRED unless a source is named — these are judgements built
on the evidence in the preceding chapters, not findings anyone published as a
ranked list.

## Controls, ranked

| # | Control | What it does to the attacker | Effort | Main cost |
| --- | --- | --- | --- | --- |
| 1 | Force all DNS through resolvers you own and log | Removes the cheapest tunnel; creates the evidence everything else needs | days | Blocking encrypted DNS annoys some users |
| 2 | Deny outbound by default from servers | Removes the channel entirely for a large class of hosts | weeks, political | Requires an accurate list of legitimate destinations |
| 3 | Alert on external connections with no preceding lookup | Directly targets ~45% of C2-active malware | days | Small allowlist to maintain |
| 4 | Alert on encrypted-DNS requests from anything but your resolver | Catches a channel that is otherwise invisible | hours | Near zero |
| 5 | Keep connection metadata 30+ days | Sets the longest sleep interval you can ever detect | weeks | Storage |
| 6 | Score outbound connections for periodicity | Catches unknown channels to unknown destinations | weeks | The allowlist is real ongoing work |
| 7 | Use a protective resolver | Blocks known-bad names before they resolve | days | Subscription; misses new infrastructure |
| 8 | Baseline machine-to-service pairings | The only thing that works on trusted-service channels | weeks | Needs upkeep as the business changes |
| 9 | Route all outbound web traffic through an authenticated proxy | Forces attackers to handle authentication; produces clean logs | weeks | Breaks non-proxy-aware software |
| 10 | Restrict which remote-access tools may run | Removes a whole ATT&CK technique by policy | weeks | Users want these tools |
| 11 | Refresh handshake-fingerprint feeds continuously | Keeps a decaying control alive | ongoing | Needs a named owner |
| 12 | Block sanctioned and known-abusive networks wholesale | Cheap, durable; almost no business need points there | days | Occasional false positive |
| 13 | Tie memory inspection to network events | Catches masked implants in their exposure window | weeks | Endpoint product must support it |
| 14 | Segment the network so internal relays cannot reach everywhere | Breaks the one-machine-talks-out design | months | Expensive, high value beyond C2 |

## The four that carry most of the weight

### 1. One resolver, and everything through it

Nothing else in this chapter works properly without it. Resolver logs are the
cheapest high-quality evidence in security, and every DNS-based detection in
05-detection-engineering.md reads from them.

What it takes:

- Every machine configured to use your resolvers.
- Firewall rules blocking outbound port 53 to anywhere else, so a machine that
  ignores its configuration still cannot bypass you.
- Encrypted DNS to outside providers blocked, and alerted on. REPORTED: US federal
  policy takes exactly this line — agency networks are configured to prevent
  devices and applications from talking directly to third-party DNS providers,
  whether over traditional or encrypted DNS, and agencies must route egress
  queries through the government service
  ([BlueCat summary of NSA/CISA guidance](https://bluecatnetworks.com/blog/nsa-and-cisa-protective-dns-key-to-network-defense/)).
- Queries logged with the client address and kept long enough to investigate.

The friction is real and specific: browsers ship encrypted DNS on by default in
some configurations, and disabling it looks like reducing privacy. The honest
framing for that conversation is that on a managed corporate network the choice is
not privacy versus surveillance — it is whether *your* security team or *an
external provider* sees the queries, and only one of those can detect a tunnel on
your behalf.

### 2. Deny outbound by default, starting with servers

The most effective control here and the hardest to get agreed, because it is a
political problem wearing a technical costume.

Start where the argument is easiest. A database server has no business browsing
the web. A domain controller has no reason to call an external API. These machines
have small, knowable sets of legitimate destinations — a patch source, a licence
check, a monitoring endpoint. Allow those and deny the rest.

This does not detect a channel. It prevents one. An implant on a machine that
cannot reach the internet has to find a relay, which means more activity, on your
internal network, where 05-detection-engineering.md
notes most organisations are not looking — so pair this with control 14.

Then work outward. Workstations are much harder because people genuinely need the
internet, which is where control 9 takes over.

### 3. The missing-lookup rule

The best value-per-hour item in this report, because it reuses infrastructure
controls 1 and 5 already built.

The logic: for each outbound connection to an external address, ask whether this
machine recently resolved a name that points there. If not, flag it.

REPORTED, on the size of the prize: 45.32% of malware samples with C2 activity made
at least one direct-to-address connection, and those accounted for 23.17% of all
observed C2 connection attempts
([Unit 42](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/)).

The allowlist is finite: your own infrastructure by address, peer-to-peer
applications you sanction, appliances with hard-coded endpoints, and connections
inside a cached result's lifetime. Enumerate once, revisit quarterly.

### 6. Periodicity scoring, with the allowlist funded

Rhythm analysis is the most durable detection available. It also fails in a
predictable way, and knowing the failure mode in advance is most of the battle.

The failure: your network is full of legitimate beacons. Update checkers,
monitoring agents, certificate revocation lookups, telemetry, cloud sync. A naive
deployment produces hundreds of high-scoring destinations that are all fine, the
team stops reading the output within two weeks, and the capability is written off
as unworkable.

The fix is unglamorous and it is the whole job: build and maintain a list of
known-good periodic destinations, and treat additions to it as routine work rather
than as failures of the detection. Budget the maintenance explicitly when you
propose the project, because a team that treats the allowlist as an unexpected
burden will abandon the control.

REPORTED, for the tooling: Zeek plus RITA is the standard open-source path, with
RITA scoring each pair from 0.0 to 1.0 and scores above 0.8 across hundreds of
connections indicating an automated beacon
([Black Hills Information Security](https://www.blackhillsinfosec.com/detecting-malware-beacons-with-zeek-and-rita/)).

## Two cheap wins worth doing this week

**The encrypted-DNS rule.** Alert when anything other than your resolver makes an
HTTP request to a `/dns-query` endpoint or sends the
`application/dns-message` content type. REPORTED: this is precisely how AdaptixC2's
encrypted-DNS transport presents
([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
On a managed network the result is either a policy violation or a tunnel. Both are
worth an alert. Cost: hours.

**Fix your monitoring port list.** REPORTED: frameworks use 443 but also 80, 8080,
8443, 4433, and custom high ports, and both Suricata's detection ports and Zeek's
TLS port list need to cover them
([Security Boulevard](https://securityboulevard.com/2026/08/writing-suricata-rules-to-detect-command-and-control-traffic/)).
A sensor decoding TLS only on 443 is blind on 8443 by configuration, not by
evasion. Cost: minutes, and it is a common gap.

## What to do when you find a live channel

The instinct is to block it immediately. Resist that for as long as you safely
can, and be deliberate about why.

### Decide first: are you containing or investigating?

**Contain immediately** if data is actively leaving, if ransomware deployment looks
imminent, or if the affected system is critical enough that dwell time is
unacceptable. REPORTED, on how little time you may have: Unit 42 observed a fastest
time from initial access to data exfiltration of 72 minutes across more than 750
investigated incidents — roughly four times faster than the previous year
([Unit 42 IR Report 2026](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/)).
That number should calibrate how long "watch and learn" is defensible. Often it is
not.

**Investigate first** if the channel appears to be in a reconnaissance phase, if
you have only found one implant and suspect more, and if you can monitor without
being noticed.

The reason not to reflexively block: `T1008 Fallback Channels`. Cutting the primary
tells the attacker they are detected and switches them to a channel you have not
characterised. You trade a monitored channel for an unmonitored one, and you have
told the adversary the clock is running.

### The investigation sequence

1. **Do not touch the machine.** No isolation, no scanning, no reboot. Anything
   visible to the attacker starts their clock.
2. **Pull the full connection history for that pair.** How long has this run? What
   is the interval? When did volume change? The first connection dates the
   intrusion.
3. **Pivot on the destination.** Which other machines have contacted it? Use
   resolver logs as well as connection logs — a machine that resolved the name but
   was blocked from connecting is still compromised.
4. **Pivot on the fingerprint and the infrastructure.** REPORTED: JARM and JA4X
   data are effective for finding related servers during hunting
   ([FoxIO](https://blog.foxio.io/ja4+-network-fingerprinting)). Certificate
   details, hosting provider, and registration data often reveal the rest of the
   set.
5. **Look for the second channel before you cut the first.** Check the same machine
   for other unusual outbound destinations, encrypted-DNS requests, internal relay
   traffic, and named-pipe activity. Assume a fallback exists.
6. **Establish scope on the host.** REPORTED, as the accompanying behaviours to
   check: `lsass.exe` memory access, registry hive access for SAM/SECURITY/SYSTEM,
   LDAP queries against Active Directory password attributes, Kerberos events 4768
   and 4769, browser profile access, and shells spawned by the remote-management
   service ([Securelist](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/)).
7. **Then cut everything at once.** All channels, all machines, all credentials that
   could have been taken, in one action. A staged response gives the attacker time
   to re-establish.

### After the cut

- **Assume every credential on every affected machine is gone.** Rotate them.
  Service accounts and machine accounts included.
- **Watch for the return.** Attackers who paid for access come back. New unusual
  destinations from the same segment in the following weeks are the signal, and
  this is where periodicity scoring earns its keep.
- **Record the channel's full characteristics.** Interval, jitter, destination,
  fingerprints, headers, framework if identified. This is your best detection
  content, because it came from an attacker who chose to target you.
- **Check whether your controls should have caught it, honestly.** If the channel
  ran for six weeks and you keep thirty days of connection metadata, the finding is
  a retention problem, not a detection problem. Those get different fixes and are
  routinely confused.

## What good looks like

A short checklist for auditing the programme rather than the tooling.

- [ ] Every DNS query in the organisation goes to a resolver you own, and is logged.
- [ ] Outbound port 53 to anywhere else is blocked at the firewall.
- [ ] Encrypted DNS from applications is blocked and alerted.
- [ ] Servers deny outbound by default.
- [ ] Connection metadata is retained at least 30 days.
- [ ] A rule fires on external connections with no preceding lookup.
- [ ] Periodicity scoring runs, and the allowlist has a named owner.
- [ ] Fingerprint feeds have a named owner and a refresh cadence.
- [ ] You know which machines legitimately use GitHub, Slack, cloud storage, and
      code-editor tunnels.
- [ ] Monitoring decodes TLS on all common alternative ports, not just 443.
- [ ] The incident runbook says find the fallback before cutting the primary.
- [ ] Someone can answer "how long would a six-hour beacon go unnoticed here?"
      with a number.

That last question is the most useful single test of whether any of this is real.
If the answer is "forever, because we keep seven days of logs", the retention gap
is the finding, and no amount of detection tooling fixes it.

---

<!-- 11archive-source: 07-disruption-and-law.md -->

# Disruption and law

Individual defenders protect their own network. Control channels are shared
infrastructure across many victims, so a second kind of response exists: attack the
infrastructure itself, using courts, sanctions, and coordinated technical action.

This chapter covers what those operations actually do, what the record shows, and
what they cost — including a cost that is rarely mentioned in the announcements.

## The four instruments

**Sinkholing.** Take control of the domain name the implants call, and point it at a
server the defenders run. Every implant now reports to the good guys. The channel is
dead and you get a victim list, which is how notification programmes work. It needs
legal authority over the domain, so it works against name-based channels and not
against hard-coded addresses.

**Server seizure and disruption.** Take the servers offline, with a court order or
through provider cooperation. Immediate, and immediately reversible by the operator
unless the arrest happens too.

**Sanctions.** Make it illegal for regulated businesses to transact with the
provider. Aimed at the commercial layer beneath the infrastructure, not at any
individual server.

**Prosecution.** The only instrument that removes an operator rather than an asset.
Slowest, and constrained by where the operator lives.

## Operation Endgame

The largest sustained programme of its kind, coordinated by Europol and Eurojust
and launched in May 2024. It is run as repeated phases rather than a single action.

REPORTED, by phase:

| Phase | Servers | Domains | Malware families targeted | Other outcomes |
| --- | --- | --- | --- | --- |
| 19–22 May 2025 | 300 | 650 | Bumblebee, Lactrodectus, Qakbot, Hijackloader, DanaBot, Trickbot, Warmcookie | ransomware supply chain focus |
| 10–13 Nov 2025 | 1,025 | 20 | Rhadamanthys, VenomRAT, Elysium | principal VenomRAT suspect arrested in Greece |
| 18–27 Jun 2026 | 326 | 142 | SocGholish, Amadey, StealC | $47M cryptocurrency frozen; 27M credentials recovered; ~15,000 compromised websites remediated; 100+ C2 servers disrupted |

Sources:
[Europol](https://www.europol.europa.eu/media-press/newsroom/news/end-of-game-for-cybercrime-infrastructure-1025-servers-taken-down),
[Eurojust](https://www.eurojust.europa.eu/news/operation-endgame-continues-international-coalition-takes-malware-offline),
[The Hacker News](https://thehackernews.com/2025/11/operation-endgame-dismantles.html),
[Security Affairs](https://securityaffairs.com/184581/cyber-crime/a-new-round-of-europols-operation-endgame-dismantled-rhadamanthys-venom-rat-and-elysium-botnet.html),
[Hackread](https://hackread.com/operation-endgame-disrupts-socgholish-malware/),
[Infosecurity](https://www.infosecurity-magazine.com/news/operation-endgame-stealc-amadey/).

REPORTED: participating countries across the phases include Australia, Belgium,
Canada, Denmark, France, Germany, Greece, Lithuania, the Netherlands, the United
Kingdom, and the United States, with technical support in the June 2026 phase from
Microsoft and Coinbase.

**No total is given for the servers column, deliberately.** The sources do not
state whether infrastructure counted in one phase was excluded from later ones, so
adding the figures would produce a number that looks authoritative and might be
double counting. See
10-methodology-and-sources.md.

### What the numbers tell you, and what they do not

INFERRED. The 27 million recovered credentials and roughly 15,000 remediated
websites are the most meaningful figures in the table, because they describe harm
reduced rather than assets touched. A seized server is an input. A rotated
credential is an outcome.

Server counts are a weaker measure than they appear, for a specific reason. A
"server" in these announcements may be a redirector costing a few pounds a month —
exactly the disposable layer described in
04-infrastructure-and-evasion.md. Removing a
thousand of those is genuinely disruptive at scale, because rebuilding a thousand
of anything takes time and money. It is not the same as removing a thousand
operations.

The arrest in the November 2025 phase is worth more than the 1,025 servers
alongside it. Infrastructure is replaceable. People are not.

## The Cobalt Strike action

The clearest case of legal action aimed at a specific C2 tool, and the one most
often described inaccurately.

DOCUMENTED, from Microsoft's own account: on 31 March 2023 the US District Court
for the Eastern District of New York issued an order to Microsoft, Fortra, and
Health-ISAC. Ransomware families associated with cracked copies of Cobalt Strike
had been linked to more than 68 ransomware attacks against healthcare organisations
in more than 19 countries. Conti and LockBit are named, along with the actor group
tracked as DEV-0243, and malicious infrastructure was identified in China, the
United States, and Russia
([Microsoft](https://blogs.microsoft.com/on-the-issues/2023/04/06/stopping-cybercriminals-from-abusing-security-tools/)).

**What the order actually permitted.** DOCUMENTED: it allowed the parties to
disrupt the infrastructure and to notify internet service providers and national
computer emergency response teams so those parties could take it offline
([Microsoft](https://blogs.microsoft.com/on-the-issues/2023/04/06/stopping-cybercriminals-from-abusing-security-tools/)).

REPORTED, and differently: secondary coverage describes the order as letting
Microsoft and Fortra "seize the domain names and take down the IP addresses" of
servers hosting cracked copies
([BleepingComputer](https://www.bleepingcomputer.com/news/security/microsoft-and-fortra-crack-down-on-malicious-cobalt-strike-servers/)).

This report treats Microsoft's own description as authoritative, and the distinction
is not pedantry. INFERRED: the mechanism is *notification backed by a court's
authority* — an abuse report that a hosting provider cannot ignore, delivered at
scale and continuously. That is a real and underrated capability, and it explains
why Microsoft called the approach "advanced persistent disruption": the value is in
being able to repeat it cheaply as the operator moves, not in a single seizure.

Anyone reasoning about what legal action can achieve should model it as persuasion
with legal weight, not confiscation.

## Sanctions on the hosting layer

Covered in detail in
04-infrastructure-and-evasion.md. The record in
brief: Zservers/XHost sanctioned by the US, UK, and Australia in February 2025 over
LockBit support; Aeza Group and affiliates by the US Treasury on 1 July 2025; Media
Land plus further Aeza front companies on 19 November 2025, citing LockBit,
BlackSuit, and Play ransomware
([Elliptic](https://www.elliptic.co/blog/us-cracks-down-on-russian-bulletproof-hosting-services),
[Chainalysis](https://www.chainalysis.com/blog/ofac-sanctions-aeza-group-bulletproof-hosting-crypto-payments-july-2025/),
[US Treasury](https://home.treasury.gov/news/press-releases/sb0185)).

REPORTED, and the most useful detail for judging effectiveness: after the July 2025
action Aeza rebranded to obscure its links to new infrastructure, and a UK company,
Hypercore Ltd., was later designated for shifting address infrastructure on Aeza's
behalf
([Security Affairs](https://securityaffairs.com/184871/cyber-crime/coordinated-sanctions-hit-russian-bulletproof-hosting-providers-enabling-top-ransomware-ops.html)).

INFERRED, cutting both ways. The rebranding proves sanctions imposed a real cost —
nobody restructures a company for fun. It equally proves capacity was not removed,
only relocated and made more expensive. And the evasion generated fresh evidence
that supported the next designation, which is a genuine compounding effect over
time rather than a one-off win.

## The platform intervention, which is different

The most complete elimination of a C2 technique in the record was not a law
enforcement action at all.

Domain fronting, covered in
04-infrastructure-and-evasion.md, was
effectively ended when Amazon and Google blocked the underlying mismatch in 2018
and Microsoft completed enforcement on Azure in January 2024
([Wikipedia](https://en.wikipedia.org/wiki/Domain_fronting),
[Microsoft Learn](https://learn.microsoft.com/en-us/answers/questions/1421101/take-action-to-stop-domain-fronting-on-your-applic)).

INFERRED: no court order, no sanctions, no arrests. A handful of engineering teams
changed a default and a whole ATT&CK sub-technique became largely unavailable.
Where a technique depends on behaviour that only a few platforms control, platform
policy is by far the most efficient intervention available — and it is the reason
the trusted-service channels in chapter 4 are strategically important. Those depend
on platforms too, which means the platforms could constrain them. Whether they can
do so without breaking the legitimate use of their own APIs is a much harder
question than the fronting fix was, and nothing in the sources suggests it has been
answered.

## The cost nobody puts in the press release

INFERRED, and it is the argument this chapter exists to make.

Pressure applied to a commercial tool moves activity to tools with no vendor to
pressure.

The sequence is visible in the evidence. A decade of industry effort made Cobalt
Strike the most recognisable framework on the internet — REPORTED: Hunt.io
describes it as "one of the most recognized and heavily signatured offensive
frameworks" and says this has "driven some actors toward alternatives such as
Sliver or Havoc"
([Hunt.io](https://hunt.io/blog/russian-malicious-infrastructure-c2-servers-mapped)).
Legal action in 2023 targeted its cracked copies specifically. And the frameworks
now leading the open-source reporting counts are free, community-built, and have no
licensing to crack, no vendor to serve with an order, and no watermark to trace
([Kaspersky](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/)).

REPORTED, as the sharpest example: AdaptixC2 was first documented as a threat in
September 2025 and was inside Fog and Akira ransomware operations within months
([Unit 42](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/),
[The Hacker News](https://thehackernews.com/2025/10/russian-ransomware-gangs-weaponize-open.html)).

This is not an argument against the takedowns. Heavily signatured tools are
genuinely harder to use, disruption genuinely costs operators money and time, and
arrests genuinely remove people. It is an argument for honest accounting: the
displacement is a predictable second-order effect, it is currently absent from how
these operations are announced and evaluated, and defenders who plan around the
press release will be surprised by the migration.

## What this means for an individual organisation

INFERRED. Three practical consequences.

**Disruption is not a control you can rely on.** It reduces the volume of
opportunistic attacks and raises costs across the ecosystem. It will not be
happening on the day someone targets you. Everything in
06-defender-playbook.md still has to work.

**Notification programmes are worth being reachable for.** Sinkholes and seizures
produce victim lists, and those lists get shared with national response teams who
try to make contact. Organisations that publish accurate security contact details
and monitor those channels find out about their own compromises this way. It is
free intelligence and most organisations are not set up to receive it.

**Sanctioned networks are cheap to block, and blocking them lasts.** Unlike an
address blocklist, a sanctioned hosting provider does not become clean next week.
Almost no legitimate business need points at these networks. This is one of the few
places where indicator-based blocking has durable value, which is why it appears in
the ranked control list rather than in the section on what does not work.

---

<!-- 11archive-source: 08-frontier.md -->

# The frontier

Three developments are changing what a control channel is, rather than just where it
hides. Each breaks a different assumption defenders have been building on.

## A language model writing the commands

### What is happening

Traditionally the operator decides what to run, and the implant carries the
instruction. Some malware now asks a language model to generate the instruction at
run time instead.

REPORTED, from Google's threat intelligence work published November 2025, five
families:

| Family | Written in | What the model does | Channel involvement |
| --- | --- | --- | --- |
| PromptSteal | Python | Queries Qwen2.5-Coder-32B-Instruct to generate the Windows commands it needs to collect files | Sends what it collects to a control server |
| PromptFlux | VBScript | Uses the Gemini API to rewrite its own code, storing obfuscated versions for persistence | Spreads via removable drives and network shares |
| PromptLock | Go | Generates fresh Lua scripts at run time for reconnaissance, encryption, and theft | — |
| FruitShell | PowerShell | Carries hard-coded prompts intended to evade model-based security analysis | Establishes remote command execution |
| QuietVault | JavaScript | Uses prompts with on-host command-line tools to find and steal secrets | — |

Source: [Infosecurity Magazine, 6 Nov 2025](https://www.infosecurity-magazine.com/news/aienabled-malware-actively/).
Google's own framing: these tools "dynamically generate malicious scripts, obfuscate
their own code to evade detection, and leverage AI models to create malicious
functions on demand, rather than hard-coding them."

REPORTED: PromptSteal — also tracked as LAMEHUG — was used against Ukraine and
attributed to APT28, with the automated loop replacing a human operator
([Infosecurity](https://www.infosecurity-magazine.com/news/aienabled-malware-actively/),
[stingrai](https://www.stingrai.io/blog/promptsteal-promptflux-malware-llm-at-runtime)).

REPORTED: Unit 42's 2026 incident response report, drawing on more than 750
investigations, records early experiments with automated command generation and
deepfake identity creation as part of a broader pattern of attackers using AI
across the attack lifecycle
([Unit 42](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/)).

### What it breaks, and what it does not

INFERRED, and the distinction is the point of this section.

**Broken: content-based detection.** A rule matching a specific command string, a
specific script, or a specific file hash assumes the content is stable across
infections. If the content is generated fresh each run, it is not. PromptFlux
rewriting its own code is a direct attack on file-based signatures.

**Not broken: the channel.** PromptSteal still sends its results to a control
server. FruitShell still establishes remote command execution. The model changed
*what is said*; it did not remove the need to say it, or to say it repeatedly, or
to say it to somewhere outside your network.

INFERRED, as the strategic read: this development strengthens rather than weakens
the argument in 05-detection-engineering.md for
weighting behaviour and structure over content. Content is now cheap for attackers
to vary at scale. The relationship is not.

**A genuinely new detection surface.** The malware now has to reach a model
provider's API. That is an outbound connection to a named service, from a machine
that may have no business making it. INFERRED: the same machine-to-service
baselining recommended for GitHub and Slack in
06-defender-playbook.md applies directly — an
accounting workstation calling an inference API is as odd as one calling the GitHub
API, and possibly odder.

**A caution on how far this has gone.** REPORTED, and worth quoting for balance:
research on prompt-based attack chains found that although control over compromised
model instances has been demonstrated, "most attacks that achieve remote code
execution fall back to conventional binary-level C2 rather than prompt-level
mechanics"
([arXiv 2601.09625, via search](https://arxiv.org/pdf/2601.09625)). INFERRED: the
model is currently a component inside otherwise conventional malware, not a
replacement for the channel. Treat vendor framing of "AI-powered attacks" with
proportionate scepticism, while noting that five named families using models at run
time is not hype — it is a small number that was zero.

## The QUIC and HTTP/3 blind spot

### What is happening

QUIC is a newer transport protocol that carries HTTP/3. It encrypts more of the
connection than older protocols do, including parts of the transport headers that
security equipment used to read.

Most detection tooling was built for TCP.

REPORTED: many detection systems trained on TCP miss QUIC traffic entirely, and
website fingerprinting classifiers built for TCP fail against QUIC with evasion
rates up to 96% — with the caveat that this gap is expected to close as tooling is
updated
([proxies.sx](https://www.proxies.sx/use-cases/privacy/http3-quic)).

REPORTED: research is closing it. Transformer models targeting DNS-over-QUIC and
HTTP/3 achieve effective website identification, and an automated approach reported
a 99.79% F1 score for QUIC website fingerprinting
([proxies.sx](https://www.proxies.sx/use-cases/privacy/http3-quic)).

REPORTED, on the framing: QUIC "changes where the HTTP attack surface lives rather
than removing it", because encrypting the transport header stops middleboxes
inspecting HTTP
([proxies.sx](https://www.proxies.sx/use-cases/privacy/http3-quic)).

A caveat on these figures. They come from a commercial proxy vendor's marketing
material summarising academic work, not from the papers themselves. The direction is
consistent with the DNS-over-HTTPS research cited in
05-detection-engineering.md, which explicitly names
extending coverage to HTTP/3 and QUIC as future work
([arXiv 2512.20423](https://arxiv.org/abs/2512.20423)) — but the exact percentages
should be treated as indicative rather than established.

### What to do about it

INFERRED, and none of it is exotic.

**Check whether your sensors decode QUIC at all.** Many deployments silently pass
UDP 443 without analysis. This is a configuration question with a definite answer,
and it is worth getting before assuming coverage.

**Consider blocking QUIC where you can.** Browsers fall back to TCP-based HTTPS
when QUIC is unavailable, so blocking UDP 443 at the perimeter usually costs a
little performance and no functionality. It restores visibility to tooling that
already works. This is a legitimate trade many organisations should make explicitly
rather than by accident.

**Note that rhythm analysis survives.** Timing and volume are visible in UDP flow
records as readily as TCP ones. A channel over QUIC still checks in on a schedule.
The blind spot is in protocol inspection, not in behavioural analysis — which is
the third time in this report that the durable layer turns out to be the one that
survives a protocol change.

## Intrusions with no implant

### What is happening

The hardest case is not a cleverer channel. It is an intrusion that barely has one.

An attacker who compromises a network edge device — a VPN appliance, a firewall, a
router — and then operates using valid credentials and built-in system tools has
almost nothing for a defender to find. No implant in memory. No unusual program
running. No attacker-owned destination.

REPORTED: Volt Typhoon is defined by the absence of custom malware, using
legitimate tools including WMI, PowerShell, `ntdsutil`, and `netsh` to blend with
normal administration, and routing traffic through compromised small-office and
home-office routers, firewalls, and VPN hardware. It encrypts what control traffic
it has with AES and TLS
([Microsoft](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/),
[Picus](https://www.picussecurity.com/resource/blog/volt-typhoon-living-off-the-land-cyber-espionage)).

REPORTED: CISA's advisory on the same activity notes detection is difficult
precisely because it relies on valid accounts and built-in binaries, requiring
behavioural monitoring of activity that arrives through normal sign-in channels
([CISA AA24-038A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a)).

REPORTED: Salt Typhoon exploited known vulnerabilities in edge devices including
Ivanti Connect Secure, Sophos Firewall, Microsoft Exchange, Citrix NetScaler
Gateway, and Cisco IOS XE
([Vectra](https://www.vectra.ai/resources/vectra-ai-threat-briefing-salt-typhoon)).

### Why this is the hardest problem in the report

INFERRED. Every detection method in
05-detection-engineering.md assumes something to
detect.

Rhythm analysis needs a periodic channel; a human logging in over a VPN with stolen
credentials is not periodic. Fingerprinting needs an unusual client; the VPN client
is the real one. Memory scanning needs an implant; there is none. Reputation needs
a bad destination; the traffic goes to a residential address in the victim's own
country.

And the compromised edge device is usually the worst-instrumented thing on the
network. It often cannot run an endpoint agent at all, its logs are thin, and it
sits *outside* the segment the internal monitoring watches.

### What actually applies

INFERRED, and it is a shift in where you look rather than a new technique.

**Identity, not network.** REPORTED: Unit 42 found identity weaknesses exploited in
89% of its 2026 investigations, and 87% of attacks involving multiple attack
surfaces
([Unit 42](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/)).
When there is no implant, the credential use is the intrusion. Impossible travel,
new device, unusual access time, an account reaching systems it has never touched.

**Direction of connection from the edge device.** An appliance is supposed to accept
connections. It is not supposed to initiate them outbound to arbitrary places.
That inversion is one of the few network signals that survives this scenario, and
it is checkable.

**Administrative tool use, in context.** `ntdsutil` and `netsh` are legitimate. The
question is whether *this* account, on *this* machine, at *this* time, has ever
used them before — which requires a baseline rather than a signature.

**Configuration change monitoring on edge devices.** If you cannot detect the
intruder, detect what they modified. This is often the only visibility available.

## What holds up across all three

INFERRED. The three developments in this chapter attack three different layers, and
one layer survives all of them.

| Development | What it breaks | What still works |
| --- | --- | --- |
| Model-generated commands | Content signatures, file hashes | The channel exists and repeats; a new API destination appears |
| QUIC and HTTP/3 | Protocol inspection, TCP-trained tooling | Timing, volume, destination novelty in flow records |
| No-implant intrusions | Everything implant-based | Identity behaviour, connection direction, configuration changes |

The pattern is the same one that produced the hierarchy in
05-detection-engineering.md. Detection built on what
the attacker *must do* outlasts detection built on what they *happen to be doing*.

The strongest form of that argument is the third row, and it is also the limit of
this report's optimism. In the no-implant case the attacker has genuinely removed
the control channel as a distinct thing to find. What is left is a person using
your systems as though they were entitled to. That is not a network detection
problem, and organisations that have invested exclusively in network detection for
C2 should read it as the reason identity monitoring is not an adjacent concern but
the same concern arriving by a different route.

---

<!-- 11archive-source: 09-glossary.md -->

# Glossary

Every specialist term used in this report, in plain words. Where a term has a
formal MITRE ATT&CK identifier, it is given.

## Core concepts

**Command and control (C2)** — The channel an attacker uses to send instructions to
a computer they control, and to receive answers back. ATT&CK tactic `TA0011`.

**Implant** — The attacker's software running on the compromised machine. Also
called an agent or a beacon depending on the tool. It maintains the channel.

**Beacon** — An implant that reaches out on a repeating schedule, like a lighthouse
signalling on a cycle. Also the specific name of Cobalt Strike's implant.

**Stager** — A very small first-stage program whose only job is to download and run
the real implant. Kept small because the delivery method usually offers little
room. ATT&CK `T1104 Multi-Stage Channels`.

**Check-in** — One cycle of the implant contacting the server to report presence and
ask for orders.

**Sleep** — How long the implant waits between check-ins.

**Jitter** — Random variation added to the sleep time so check-ins are not exactly
regular. Intended to hide the rhythm; see
05-detection-engineering.md for why it works less
well than operators expect.

**Reverse channel** — The compromised machine dials out to the attacker. Almost all
real C2 works this way, because firewalls block unexpected inbound connections.

**Bind channel** — The attacker dials in to the compromised machine. Nearly extinct
on the internet.

**Asynchronous** — A channel that checks in on a long cycle and queues commands.
Quiet, slow to work with.

**Interactive** — A live session where typing feels like a terminal. Fast to work
with, much louder on the network.

**Fallback channel** — A second way in, used when the first stops working. ATT&CK
`T1008`.

**Kill date** — A configured time after which the implant deletes itself.

**Egress** — Traffic leaving your network. The boundary where outbound C2 must
cross equipment you control.

**Dwell time** — How long an attacker is present before being detected or removed.

## Tools and frameworks

**C2 framework** — A product that manages control channels: a server, an operator
console, and an implant generator. Built for penetration testers; used by both
defenders and attackers.

**Cobalt Strike** — The commercial framework from Fortra that defined the category.
Its implant is Beacon.

**Malleable profile** — Cobalt Strike's configuration file controlling how the
implant behaves on the network and in memory. Better understood as a behaviour
policy than as traffic disguise.

**Sleep mask** — Code that scrambles the implant's own memory while it is idle, so
memory scanners find nothing, unscrambling only to check in.

**Drip loading** — Writing a payload into memory in small pieces with delays
between them, to break the event-correlation logic endpoint products use to spot
injection. Added in Cobalt Strike 4.12.

**Beacon Object File (BOF)** — A small compiled C module that runs inside the
implant's own process rather than as a separate program, leaving less trace.

**Sliver** — Free, open-source framework in Go from Bishop Fox. Offers mutual TLS,
HTTP, HTTPS, DNS, and WireGuard channels.

**Havoc, Mythic, AdaptixC2, Empire, Covenant, NimPlant, SuperShell** — Free,
community-built frameworks. See
03-framework-landscape.md.

**Brute Ratel C4** — A commercial framework from Dark Vortex.

**Metasploit** — Rapid7's long-established exploitation framework, with a free tier.
Its implant is Meterpreter.

**Redirector** — A cheap disposable server that forwards traffic to the operator's
real server, so the real server is never exposed. ATT&CK `T1090 Proxy`.

**Team server** — The framework's central server that implants report to and
operators connect to.

**Watermark** — An identifier in a commercial framework's builds that links an
implant back to a licence.

## Channels and protocols

**DNS** — The domain name system, which turns names into addresses. Every network
allows it, which is why it makes such a durable tunnel.

**DNS tunnelling** — Hiding data inside the names being looked up and inside the
answers. Works almost anywhere; carries very little data. ATT&CK `T1071.004`.

**DNS over HTTPS (DoH)** — Name lookups wrapped inside ordinary web requests, so a
network operator cannot see or filter them. Recognisable by requests to a
`/dns-query` endpoint carrying the `application/dns-message` content type.

**Mutual TLS (mTLS)** — Encryption where both ends prove their identity with
certificates, not just the server. Locks defenders and researchers out of the
session entirely.

**WireGuard** — A legitimate, widely used VPN protocol. Some frameworks use it to
build a fully encrypted tunnel, which is defensively awkward because the traffic is
not anomalous in itself.

**Named pipe** — A Windows mechanism for one program to talk to another, including
across machines. Used so several implants can route through one machine that has
internet access.

**ICMP** — The protocol behind `ping`. Its data field can carry a tunnel, and it
sits below the layer most security tooling inspects. ATT&CK `T1095`.

**QUIC and HTTP/3** — Newer transport protocols that encrypt more of the connection,
including transport headers older equipment relied on reading.

**Direct-to-IP (D2IP)** — Connecting to a hard-coded address with no name lookup at
all. Defeats every DNS-based control, at the cost of being impossible to change
after deployment.

**Dead drop resolver** — A public page or post holding the real server's address, so
the implant looks it up rather than carrying it. ATT&CK `T1102.001`.

**Content injection** — Commands inserted into traffic while it is in transit.
ATT&CK `T1659`.

**Traffic signalling** — A secret trigger — such as a specific sequence of
connection attempts — that wakes a dormant implant or opens a hidden service.
ATT&CK `T1205`.

## Infrastructure and evasion

**Fast flux** — Rapidly changing the addresses a domain name points to, so blocking
addresses never works. ATT&CK `T1568.001`. Subject of CISA advisory `AA25-093A`.

**Single flux** — The addresses rotate.

**Double flux** — The addresses *and* the name servers rotate, leaving no stable
point to attack.

**Domain generation algorithm (DGA)** — A formula both sides run to compute today's
domain name, so it never has to be transmitted. Detectable by the many failed
lookups it produces. ATT&CK `T1568.002`.

**Domain fronting** — Sending one domain name in the clear during the handshake and
a different one inside the encrypted request, so traffic appears to go to a major
cloud service. Largely closed by Amazon and Google in 2018 and by Microsoft by
January 2024. ATT&CK `T1090.004`.

**Living off the land (LOTL)** — Using the software already on the machine —
PowerShell, WMI, built-in administrative tools — so nothing unusual has to be
installed.

**Living off trusted services** — Putting the control channel inside a service the
victim already relies on, such as GitHub, Slack, or cloud storage, so no
attacker-owned destination appears in the traffic. Cloudflare calls the pattern
"living off the XaaS". ATT&CK `T1102 Web Service`.

**Bulletproof hosting** — Hosting providers that deliberately ignore abuse reports,
and advertise doing so.

**Hide infrastructure** — Concealing the attacker's own servers, including by using
compromised third-party machines or by refusing to answer scanners. ATT&CK `T1665`.

**Sinkholing** — Taking control of the domain implants call and pointing it at a
defender-run server, which kills the channel and produces a victim list.

## Detection

**Beaconing detection / rhythm analysis** — Finding channels by the regularity of
their timing rather than their content. Works through encryption because timing is
metadata.

**Periodicity score** — A number from 0.0 (random) to 1.0 (perfectly regular)
describing how rhythmic a connection pattern is. RITA scores above 0.8 across
hundreds of connections indicate an automated beacon.

**Zeek** — Open-source software that turns raw network traffic into structured
connection records. The usual source of the metadata everything else analyses.

**RITA** — Open-source tool that scores Zeek's records for beacon-like behaviour.

**Suricata** — Open-source intrusion detection system that matches network traffic
against rules.

**Sigma** — A vendor-neutral format for detection rules, so a rule can be written
once and deployed on different analysis platforms.

**TLS fingerprinting** — Identifying which software opened an encrypted connection
from how it announced its capabilities, without reading the content.

**JA3 / JA3S** — Fingerprint of the client's opening message / the server's reply.

**JA4 / JA4S / JA4X** — Newer, more stable versions. JA4X fingerprints how a
certificate was generated.

**JARM** — An active fingerprint: you send crafted probes to a server and hash its
responses. Requires the server to answer.

**Protective DNS (PDNS)** — A resolver that checks each lookup against threat
intelligence and refuses to answer for known-bad names.

**Egress filtering** — Controlling which outbound connections are permitted, rather
than allowing everything out by default.

**Allowlist** — An explicit list of permitted things. In this report, usually the
list of legitimate periodic destinations that stops rhythm analysis drowning in
noise.

**Baseline** — A record of what normal looks like, so an anomaly can be recognised.
The only workable answer to trusted-service channels.

**Indicator of compromise (IOC)** — A specific observable fact, such as an address,
domain, or file hash, associated with known malicious activity. Cheap to check;
easily invalidated by attackers standing up new infrastructure.

## Attacker groups and campaigns named in this report

**APT28** — Russian state-linked group, also tracked as Fancy Bear and Fighting
Ursa. Associated with the PromptSteal/LAMEHUG malware.

**Volt Typhoon** — China-linked group targeting critical infrastructure, defined by
its avoidance of custom malware. ATT&CK group `G1017`.

**Salt Typhoon** — China-linked group targeting telecommunications, primarily via
known vulnerabilities in network edge devices.

**Gamaredon** — Russian-linked group named in the CISA fast flux advisory.

**Tropic Trooper** — Group behind the March 2026 campaign that used GitHub issues as
its entire control channel.

**GopherWhisper** — China-linked group reported using Slack, Discord, and Outlook
draft emails for two-way control.

**Fog, Akira, LockBit, Conti, Hive, Nefilim, BlackSuit, Play** — Ransomware
operations named in the cited sources.

**Operation Endgame** — The Europol- and Eurojust-coordinated programme of repeated
infrastructure disruption actions, running since May 2024.

## Evidence labels used in this report

**DOCUMENTED** — The thing's own owner says so: vendor documentation, a release
note, a government advisory, the ATT&CK catalogue itself.

**REPORTED** — A named third party published it. Not independently checked here.

**CALCULATED** — Worked out in this report from reported numbers. Formulas are in
10-methodology-and-sources.md.

**INFERRED** — A judgement drawn from the evidence. No source states it.

---

<!-- 11archive-source: 10-methodology-and-sources.md -->

# Methodology and sources

## What this report is

A desk study. It was built on 11 August 2026 by searching for and reading public
material on command-and-control channels, then organising what that material says
and reasoning about it.

**It contains no original measurement.** No network was instrumented, no malware
was run, no traffic was captured, no framework was installed. That is the single
most important limitation and it shapes everything below.

What the report adds beyond its sources is organisation, arithmetic, and judgement:
grouping techniques by the trade-off each represents, identifying where sources
disagree and why, working out a small number of derived figures, and ranking
controls. Everything in that third category is labelled INFERRED so you can
separate it from what the evidence says.

## Scope decisions

**Included.** How channels work, what each costs the attacker, what reveals each
one, which tools implement them, how the supporting infrastructure is built and
hidden, what detection works and what does not, what disruption operations achieve,
and three developments changing the picture.

**Deliberately excluded.** Implant source code, working configuration files,
step-by-step instructions for evading a named security product, and anything that
would function as operational tooling rather than as description. Where a technique
is described, the level of detail matches what the cited vendor advisories and
academic papers already publish — that level is what a defender needs to write a
rule, and it is already public.

**Out of scope, and worth naming.** Industrial control system protocols, mobile
platform channels, and the internal design of botnet peer-to-peer networks. Each
would need its own report.

## Evidence labels

| Label | Meaning |
| --- | --- |
| DOCUMENTED | The thing's own owner says so: vendor documentation, a release note, a government advisory, the ATT&CK catalogue |
| REPORTED | A named third party published it; not independently checked here |
| CALCULATED | Worked out in this report from reported numbers, using a formula listed below |
| INFERRED | A judgement drawn from the evidence; no source states it |

INFERRED is used heavily, particularly in the ranked control list in
06-defender-playbook.md and the detection hierarchy in
05-detection-engineering.md. Those are arguments,
not findings. They are labelled that way throughout, and the reasoning is shown so
that a specific step can be disputed rather than the whole conclusion.

## How sources were read

An important distinction that most reports leave implicit.

**READ** means the full page or document was retrieved and read. 15 sources.

**SUMMARY** means only a search-result extract was seen — enough to attribute a
specific claim to a named publisher, but not the full context. 39 sources.

Claims resting on SUMMARY sources are weaker. Where such a claim carries real
analytical weight it is flagged in the text: the QUIC evasion percentages in
08-frontier.md are the clearest case, and they are explicitly
marked as indicative rather than established.

## Every calculation

| Result | Formula | Inputs | Where used |
| --- | --- | --- | --- |
| 9.11% of all analysed samples made a direct-to-address C2 connection | 20.11% × 45.32% | Unit 42, Aug 2026 | Brief, ch. 2 |
| January 2026 ran at 2.60× the 2025 monthly average | 1,921 ÷ 739 | Hunt.io | Brief, ch. 3 |
| 739.0 monthly average (consistency check) | 8,868 ÷ 12 | Hunt.io | ch. 3 |
| 45 catalogued entries in TA0011 | 18 + 27 | ATT&CK v19 | Brief, ch. 2 |
| 27 sub-techniques | 5+2+3+3+2+4+3+2+3 | ATT&CK v19 table | ch. 2 |
| 2 techniques added since ATT&CK v10.1, identified as T1659 and T1665 | list difference: 18 current parents minus 16 in the v10.1 mirror | ATT&CK v19 vs cyber-kill-chain.ch | ch. 2 |

The 739.0 check matters: it confirms Hunt.io's stated monthly average and its
annual total are internally consistent, which raises confidence in the 1,921 figure
drawn from the same source.

**No totals are computed for the Operation Endgame server counts** in
07-disruption-and-law.md. The sources do not state
whether infrastructure counted in one phase was excluded from later phases, so a
sum could double count. The phases are shown individually instead.

## Conflicts, and how each was resolved

**1. Which C2 framework leads.** Three sources, three answers: Kaspersky's
open-source reporting counts put Sliver first; Red Canary's endpoint detections put
Cobalt Strike first; Hunt.io's internet scanning shows Cobalt Strike at large
scale. **Resolution:** all three are reported, with an analysis of what each method
actually measures. No single ranking is presented as correct, because the question
"which framework leads" has no method-independent answer.

**2. Kaspersky's framework ordering.** A widely shared secondary summary lists six
frameworks "in that order" including Cobalt Strike sixth. Kaspersky's own report
names four and in a different order. **Resolution:** the primary text was fetched
and used; the secondary ordering is recorded as an exclusion below.

**3. What the Cobalt Strike court order permitted.** Secondary coverage says
"seize domain names and take down IP addresses". Microsoft's own account says
disrupt infrastructure and notify providers and response teams. **Resolution:**
Microsoft's account used as authoritative, with the discrepancy stated explicitly
in both the brief and 07-disruption-and-law.md, because
the difference changes what anyone should expect legal action to accomplish.

**4. How many C2 servers exist.** Hunt.io reports 1,921 unique Cobalt Strike
addresses in January 2026. A hobbyist tracker reports 63 servers across seven
frameworks in one week of May 2026. **Resolution:** both reported, with the
explanation that these measure scanning breadth and matching looseness rather than
a shared underlying quantity.

**5. ATT&CK technique counts.** The current catalogue lists 18 parent techniques;
an older mirror lists 16; one search summary said "16 techniques and approximately
29 sub-techniques (45 entries)". **Resolution:** the current catalogue was fetched
and counted directly. The older mirror is cited only as the v10.1 comparison point.

## Claims excluded, and why

Recording these is part of the method. Each was found during research and left out.

| Claim | Reason for exclusion |
| --- | --- |
| Cracked Cobalt Strike used to attempt infection of ~1.5 million devices | Appears in secondary coverage; not present in Microsoft's own account, which was retrieved and read |
| DNS tunnelling tool shares: Cobalt Strike 26%, Iodine 24%, DNSCat2 13% | The summary containing them mixes "share of detected activity" with "detection rate" in one sentence, which indicates a garbled aggregation. Not traced to a primary source |
| Kaspersky's six-framework ranking with Cobalt Strike sixth | Contradicted by the primary Securelist text, which was fetched |
| A 2026 APT28 campaign using a Covenant backdoor beaconing to cloud storage, with specific email and country counts | The Trellix page returned HTTP 403 and could not be read. Consequently Covenant's "seen in real attacks" cell in ch. 3 reads "not verified here" |
| Performance metrics for arXiv 2506.08922 | Not extractable from the PDF during research. Recorded as unavailable rather than estimated |
| Performance metrics for arXiv 2512.20423 | Not stated in the abstract, which was all that could be read |
| Current-year Red Canary framework rankings | The page served under the current-report URL is the 2022 report. Cited as 2022 rather than presented as current |

The CISA fast flux advisory `AA25-093A` could not be retrieved directly — both the
CISA page and the IC3 PDF failed. Its contents are therefore cited from a named
secondary summary, which is stated inline where used in
04-infrastructure-and-evasion.md.

## Limitations

**No original measurement.** Stated first because it is the most important. Every
number here was measured by someone else, using methods this report could not
inspect.

**Vendor telemetry bias, in a specific direction.** Most quantitative sources are
security vendors counting what their own sensors detected. A sensor cannot count
what it does not recognise, so these figures systematically undercount novel and
well-hidden channels — which is precisely the category the report argues is
growing. Every prevalence number should be read as a floor.

**Prevalence is unmeasurable in principle.** There is no census of control
channels. Internet scanning finds servers that answer probes; endpoint products
find implants they recognise; researchers write up what interests them. All three
miss careful operators by construction. Any statement about how common a technique
is inherits this.

**Recency is uneven.** Sources range from 2018 platform changes to August 2026
research. Where a source is materially older than the claim it supports — the 2022
Red Canary rankings, the 2023 DNS tunnelling study — the date is given inline so
the reader can discount it.

**Geographic and linguistic concentration.** Sources are predominantly US and
European, in English. Chinese, Russian, and other non-English research on this
topic exists and is not represented. This likely skews which threat actors and
which techniques appear prominent.

**Two-thirds of sources were read only as search extracts.** 39 of 54. Attribution
is accurate; full context was not always available.

**The rankings are judgements.** The control ranking in ch. 6, the detection
hierarchy in ch. 5, and the prevalence-versus-difficulty table in ch. 2 are all
INFERRED. They reflect reasoning about the cited evidence. Another analyst reading
the same sources could rank differently, and the reasoning is exposed so that
disagreement can be specific.

## Verification performed

- Every derived figure recomputed independently; results in the calculations table
  above.
- Hunt.io's internal consistency checked (8,868 ÷ 12 = 739.0 against its stated
  average). Passed.
- ATT&CK technique and sub-technique counts recounted from the fetched table rather
  than taken from a summary.
- Every cited URL recorded in the source table below and in `data.json`.
- Terminology checked for consistency between narrative, tables, glossary, and
  `data.json`.
- Acronyms checked for expansion on first use.
- Markdown and HTML checked for the same facts, ordering, and limitations.
- Report searched for secrets, credentials, personal data, and local absolute
  paths. None present.
- `report.html` rendered in a browser and its table interactions exercised.

## Sources

54 sources. **R** = read in full. **S** = seen as a search extract only.

### Catalogues and government advisories

| # | Source | Date | How |
| --- | --- | --- | --- |
| 1 | [MITRE ATT&CK TA0011 Command and Control](https://attack.mitre.org/tactics/TA0011/) (v19) | modified 2025-04-25 | R |
| 2 | [TA0011 mirror at ATT&CK v10.1](https://cyber-kill-chain.ch/tactics/TA0011/) | — | R |
| 3 | [CISA AA25-093A, Fast Flux: A National Security Threat](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-093a) | 2025-04-03 | S (403) |
| 4 | [CISA AA24-038A, PRC state-sponsored actors in US critical infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) | 2024-02 | S |
| 5 | [US Treasury press release SB0185, bulletproof hosting sanctions](https://home.treasury.gov/news/press-releases/sb0185) | 2025-11-19 | S |
| 6 | [Europol, 1,025 servers taken down](https://www.europol.europa.eu/media-press/newsroom/news/end-of-game-for-cybercrime-infrastructure-1025-servers-taken-down) | 2025-11 | S |
| 7 | [Eurojust, Operation Endgame continues](https://www.eurojust.europa.eu/news/operation-endgame-continues-international-coalition-takes-malware-offline) | 2026-06 | S |
| 8 | [MITRE ATT&CK group G1017, Volt Typhoon](https://attack.mitre.org/groups/G1017/) | — | S |

### Vendor and platform primary material

| # | Source | Date | How |
| --- | --- | --- | --- |
| 9 | [Cobalt Strike release notes](https://download.cobaltstrike.com/releasenotes.txt) | to 2026-06 | R |
| 10 | [Cobalt Strike, Sleep Masks](https://www.cobaltstrike.com/sleep-masks) | — | S |
| 11 | [Cobalt Strike 4.12: Fix Up, Look Sharp](https://www.cobaltstrike.com/blog/cobalt-strike-412-fix-up-look-sharp) | 2025-11 | S |
| 12 | [Microsoft, Stopping cybercriminals from abusing security tools](https://blogs.microsoft.com/on-the-issues/2023/04/06/stopping-cybercriminals-from-abusing-security-tools/) | 2023-04-06 | R |
| 13 | [Microsoft, Volt Typhoon targets US critical infrastructure](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) | 2023-05-24 | S |
| 14 | [Microsoft Learn, stop domain fronting before 8 January 2024](https://learn.microsoft.com/en-us/answers/questions/1421101/take-action-to-stop-domain-fronting-on-your-applic) | 2023 | S |
| 15 | [Microsoft Tech Community, prohibiting domain fronting with Azure Front Door](https://techcommunity.microsoft.com/t5/azure-networking-blog/prohibiting-domain-fronting-with-azure-front-door-and-azure-cdn/ba-p/4006619) | 2023 | S |
| 16 | [Cloudflare 2026 Threat Report](https://blog.cloudflare.com/2026-threat-report/) | 2026-03-03 | R |
| 17 | [Bishop Fox Sliver, mutual TLS communication (DeepWiki)](https://deepwiki.com/BishopFox/sliver/6.1-mtls-communication) | — | S |
| 18 | [RITA on GitHub](https://github.com/activecm/rita) | — | S |

### Threat research

| # | Source | Date | How |
| --- | --- | --- | --- |
| 19 | [Unit 42, Almost Half of Malware Samples Communicate Direct to IP](https://unit42.paloaltonetworks.com/malware-bypass-dns-direct-to-ip/) | 2026-08-04 | R |
| 20 | [Unit 42, Understanding DNS Tunneling Traffic in the Wild](https://unit42.paloaltonetworks.com/dns-tunneling-in-the-wild/) | 2023-10-13 | R |
| 21 | [Unit 42, AdaptixC2: A New Open-Source Framework Leveraged in Real-World Attacks](https://unit42.paloaltonetworks.com/adaptixc2-post-exploitation-framework/) | 2025-09-10 | R |
| 22 | [Unit 42 Global Incident Response Report 2026](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/) | 2026-02 | S |
| 23 | [Kaspersky Securelist, vulnerability landscape Q2 2025](https://securelist.com/vulnerabilities-and-exploits-in-q2-2025/117333/) | 2025-08-27 | R |
| 24 | [Kaspersky Securelist, detecting the AdaptixC2 agent](https://securelist.com/tr/adaptixc2-network-and-host-detection/119424/) | 2026-04-17 | R |
| 25 | [Zscaler, Tropic Trooper pivots to AdaptixC2 and a custom Beacon listener](https://www.zscaler.com/blogs/security-research/tropic-trooper-pivots-adaptixc2-and-custom-beacon-listener) | 2026-04-22 | R |
| 26 | [Red Canary Threat Detection Report, C2 Frameworks](https://redcanary.com/threat-detection-report/trends/c2-frameworks/) | 2022 report | R |
| 27 | [Hunt.io, Complete Guide to Hunting Cobalt Strike part 4](https://hunt.io/blog/guide-hunting-cobalt-strike-part-4-c2-feeds-api) | 2026-08-10 | R |
| 28 | [Hunt.io, Exposing Russian malicious infrastructure](https://hunt.io/blog/russian-malicious-infrastructure-c2-servers-mapped) | — | S |
| 29 | [The Hacker News, Russian ransomware gangs weaponize AdaptixC2](https://thehackernews.com/2025/10/russian-ransomware-gangs-weaponize-open.html) | 2025-10 | S |
| 30 | [Infosecurity Magazine, AI-enabled malware now actively deployed](https://www.infosecurity-magazine.com/news/aienabled-malware-actively/) | 2025-11-06 | R |
| 31 | [stingrai, PROMPTSTEAL and PROMPTFLUX](https://www.stingrai.io/blog/promptsteal-promptflux-malware-llm-at-runtime) | 2026 | S |
| 32 | [DecryptionDigest, GopherWhisper uses Slack and Discord as C2](https://www.decryptiondigest.com/blog/gopherwhisper-china-apt-slack-discord-outlook-c2) | 2026 | S |
| 33 | [Vectra, Salt Typhoon threat briefing](https://www.vectra.ai/resources/vectra-ai-threat-briefing-salt-typhoon) | — | S |
| 34 | [Picus, Volt Typhoon explained](https://www.picussecurity.com/resource/blog/volt-typhoon-living-off-the-land-cyber-espionage) | — | S |
| 35 | [Tsurezure Diary, weekly threat infrastructure investigation week 19](https://disconinja.hatenablog.com/entry/2026/05/10/144248) | 2026-05-10 | S |

### Detection and defensive practice

| # | Source | Date | How |
| --- | --- | --- | --- |
| 36 | [Black Hills Information Security, detecting malware beacons with Zeek and RITA](https://www.blackhillsinfosec.com/detecting-malware-beacons-with-zeek-and-rita/) | — | S |
| 37 | [Active Countermeasures, RITA](https://www.activecountermeasures.com/free-tools/rita/) | — | S |
| 38 | [Threat Hunting Labs, beacons](https://activecm.github.io/threat-hunting-labs/beacons/) | — | S |
| 39 | [Hive Security, Cobalt Strike detection and hunting playbook](https://hivesecurity.gitlab.io/blog/cobalt-strike-detection-hunting/) | — | S |
| 40 | [Hive Security, C2 without owning C2](https://hivesecurity.gitlab.io/blog/c2-without-owning-c2/) | — | S |
| 41 | [FoxIO, JA4+ network fingerprinting](https://blog.foxio.io/ja4+-network-fingerprinting) | 2023-11 | S |
| 42 | [systemshardening.com, passive TLS fingerprinting with JA3 and JA4](https://www.systemshardening.com/articles/network/tls-fingerprinting-ja3-ja4/) | — | S |
| 43 | [Corelight, Zeek and Sigma compatibility](https://corelight.com/blog/zeek-sigma-fully-compatible-for-cross-siem-detections) | — | S |
| 44 | [Security Boulevard, writing Suricata rules to detect C2 traffic](https://securityboulevard.com/2026/08/writing-suricata-rules-to-detect-command-and-control-traffic/) | 2026-08 | S |
| 45 | [Medium / Aman, detecting payload execution and C2 with Wazuh, Suricata and Zeek](https://medium.com/@amgill003ca/detecting-payload-execution-and-c2-communication-using-wazuh-suricata-and-zeek-1776cb47f3df) | — | S |
| 46 | [BlueCat, NSA and CISA on protective DNS](https://bluecatnetworks.com/blog/nsa-and-cisa-protective-dns-key-to-network-defense/) | — | S |
| 47 | [Vectra, CISA flags fast flux as a national threat](https://www.vectra.ai/blog/cisa-flags-fast-flux-as-a-national-threat-are-you-covered) | 2025 | R |
| 48 | [Medium / TΞLΞMΞTRY, hunting Cobalt Strike servers](https://t3l3m3try.medium.com/hunting-cobalt-strike-servers-385c5bedda7b) | — | S |

### Academic

| # | Source | Date | How |
| --- | --- | --- | --- |
| 49 | [Parssegny, Mazel, Levillain, Chifflier, Striking Back At Cobalt (arXiv 2506.08922)](https://arxiv.org/pdf/2506.08922) | 2025-06-11 | R (metrics not extractable) |
| 50 | [Elaoumari, Evasion-Resilient Detection of DNS-over-HTTPS Data Exfiltration (arXiv 2512.20423)](https://arxiv.org/abs/2512.20423) | 2025-12-23 | R (abstract) |
| 51 | [The Promptware Kill Chain (arXiv 2601.09625)](https://arxiv.org/pdf/2601.09625) | 2026-01 | S |

### Reference and background

| # | Source | Date | How |
| --- | --- | --- | --- |
| 52 | [Wikipedia, Domain fronting](https://en.wikipedia.org/wiki/Domain_fronting) | — | S |
| 53 | [Haven, Domain fronting explained](https://havenmessenger.com/blog/posts/domain-fronting-explained/) | — | S |
| 54 | [ring0shady, Sliver C2 deep dive](https://ring0shady.github.io/posts/sliver-c2-deep-dive/) | — | S |

Additional sources consulted for the sanctions and Operation Endgame tables, cited
inline in 04-infrastructure-and-evasion.md and
07-disruption-and-law.md:
[Elliptic](https://www.elliptic.co/blog/us-cracks-down-on-russian-bulletproof-hosting-services),
[Chainalysis](https://www.chainalysis.com/blog/ofac-sanctions-aeza-group-bulletproof-hosting-crypto-payments-july-2025/),
[Security Affairs on sanctions](https://securityaffairs.com/184871/cyber-crime/coordinated-sanctions-hit-russian-bulletproof-hosting-providers-enabling-top-ransomware-ops.html),
[Security Affairs on Endgame](https://securityaffairs.com/184581/cyber-crime/a-new-round-of-europols-operation-endgame-dismantled-rhadamanthys-venom-rat-and-elysium-botnet.html),
[The Hacker News on Endgame](https://thehackernews.com/2025/11/operation-endgame-dismantles.html),
[The Hacker News on hosting sanctions](https://thehackernews.com/2025/07/us-sanctions-russian-bulletproof.html),
[Hackread](https://hackread.com/operation-endgame-disrupts-socgholish-malware/),
[Infosecurity on Endgame](https://www.infosecurity-magazine.com/news/operation-endgame-stealc-amadey/),
[BleepingComputer on the Cobalt Strike action](https://www.bleepingcomputer.com/news/security/microsoft-and-fortra-crack-down-on-malicious-cobalt-strike-servers/),
[CyberSecurityNews on Cobalt Strike 4.12](https://cybersecuritynews.com/cobalt-strike-4-12-released/),
[Medium / Khaled Fawzy on malleable profiles](https://khaled0x07.medium.com/engineering-a-highly-customized-malleable-c2-profile-30e0efee307c),
[dominicbreuker on Sliver transports](https://dominicbreuker.com/post/learning_sliver_c2_03_transports_in_detail_mtls_and_wg/),
[proxies.sx on HTTP/3 and QUIC](https://www.proxies.sx/use-cases/privacy/http3-quic).

## Reuse

`data.json` holds the structured evidence: the ATT&CK technique list, the framework
table, the prevalence figures with their sources, every calculation with its inputs,
every recorded conflict, every exclusion with its reason, and the full source list
with its read status. It is versioned so the tables can be rebuilt or checked
without re-reading the prose.
