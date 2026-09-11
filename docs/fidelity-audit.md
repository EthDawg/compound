# Fidelity refinement — active

The previous release established topic coverage and some evidence boundaries.
It did not prove the complete experience met the user's ambition. Passing builds
and data tests establish a much narrower result than a coherent destination.

## Requirements to prove through real journeys

1. **Find and recognise.** A company, product, person or former name resolves from
   the front door and shared navigation. A known company without a full study is
   recognisable and leads to the evidence available. Native links support opening
   several candidates. Preview, keyboard behaviour and repeat visits work.
2. **Follow the system.** Global View reveals specific market roles and meaningful
   dependencies. Selecting an example shows the connected companies and places,
   the constraint and the buying implication. Regional facts are actually local.
3. **Understand the change.** History connects enabling conditions to breakthroughs
   through the present. Measured trajectories remain distinct from possible futures.
4. **Work through a decision.** A concrete buyer dilemma and evidence changes the
   recommended next commitment. Show trade-offs, a worked example and what would
   change the answer. Keep scenarios distinct from forecasts.
5. **Trace capability to people and work.** SI filtering, comparison and lineage
   reveal who carries relevant experience, how it arrived and what is evidenced.
   Company selection stays coherent across views and repeat visits.
6. **Feel like one product.** Compound's shared controls, visual hierarchy and
   terminology connect these scales. Each company study retains its own identity.
   Mobile, keyboard, loading, empty and returning states receive deliberate care.
7. **Prove the experience.** Validate source integrity and calculations, but also
   the rendered journeys when browser testing is authorised. Do not substitute
   page counts or HTTP responses for usability or visual fidelity.

## Gaps that motivated the refinement

- Homepage search only includes plotted vendors; the global company picker also
  includes researched SI practices. This creates false "not in catalogue" states.
- Browsing a practice records its platform in recents, rather than the firm.
- Global View is largely a set of article pins without dependency edges.
- Several regions are represented by global facts, not regional intelligence.
- History stops in 2017; enabling conditions and present trajectories are weak.
- Decisions supplies persona advice and a toy chart, but no decision process.
- Shared pages use different headers and route concepts. Some older desk/brief
  content still describes the initial Rippling-only project.

These were the starting gaps, not a list of current defects. The changes below
address them; the verification record distinguishes implementation from observed use.

## Refinement implemented

- The front door and shared destinations use the canonical company finder,
  including world-context organisations. Person, customer and capability matches
  retain their focused destinations. Mobile results have explicit preview controls.
- Career links require recorded individual relationships. Historical names remain
  searchable; ownership history does not establish a person's role at an acquirer.
- Capability cells open matching claims and cases. Three explicitly paired
  engagement claims preserve service, domain, geography, source and limits.
- Eight practice briefs explain distinctive relevance, origin and local proof.
  Kainos regional hiring evidence is a people signal, not an offer or delivery case.
- Selected firms focus their movement timeline. Global directory profiles link
  back to ANZ research, and known local matches remain visible outside that roster.
- Global View uses specific places and sourced dependency edges; announced roles
  retain their status. Market organisations are derived into shared discovery.
- History extends through 2026 with enabling-condition paths. Five separate
  measurement views distinguish task capability, completed work, business use,
  industrial installation and electricity demand. Projections stay labelled.
- Three decision flows make the next commitment depend on actual answers.
  Invalid or missing answers do not produce a favourable result. URL state and
  a copyable brief preserve the reasoning. The adoption illustration is secondary.

## Navigation and category research

Landscape sector, category, company, lens and legend selections are addressable.
Native links preserve browser history and opening several candidates. Recent
visits retain the actual destination. Platform-specific queries keep the intended
practice: `Cognizant ServiceNow IT` reaches the matching ServiceNow evidence.

Three category guides cover AI inference and model serving, developer tools, and
enterprise AI cloud. Company briefs connect three strengths to their
origins, a dated change, a trade-off and a watchpoint. Product and former names
resolve through the existing company index, including Windsurf, Vertex AI and
MosaicML. Cross-category membership does not create duplicate companies.

Each guide has practical situations. The Fireworks walkthrough makes the
custom-model route and idle-capacity trade-off interactive. These are teaching
scenarios, not live model calls or comparative benchmarks. Company accents remain
inside Compound's shared navigation; a research brief does not promise a full
App/Backstage study.

## Browser verification — 11 September 2026

The production build and all 77 tests pass. Added checks cover shared company
identity, former-name discovery, exact recent destinations, category references,
and serving-route counterfactuals.

Browser testing was authorised and performed against the preceding production
release and this update on localhost. Observed journeys:

- Finder shortcut, type-ahead recognition, arrow/Enter navigation, explicit mobile
  preview, empty state, and Escape. Closing now restores focus to the original
  control or link, including when the finder opened from a keyboard shortcut.
- Cognizant ServiceNow IT search to the matching case; switching its Workday
  context and Back restored the original firm and capability route.
- Delivery decision with five answers; evidence changes altered the next
  commitment. Reload retained answers, and Copy produced the matching brief.
- Landscape company/lens selection and reload restored the intended selection.
- Windsurf search preview showed Cognition and the Devin Desktop change; Enter
  opened its brief, then its developer tools category.
- Category scenario selection by keyboard and pointer updated the case and URL;
  Back restored the previous case. The Australian-processing case distinguishes
  exact routing from an APAC label.
- Fireworks rejected custom models on the shared endpoint, exposed the documented
  scale-from-zero 503 behaviour, and distinguished keeping capacity warm. Rapid
  toggles, Back/Forward and reload retained the corresponding choice. Controls
  now respond without waiting for a server navigation.
- Claude Code's existing scenario required command permission, failed the
  repeated-timeout case, then accepted a reviewed bounded retry. Backstage
  retained Anthropic's distinct identity and argument.
- Global View linked to the intended EUV history point. Keyboard changes to the
  computation slider changed the displayed combinations and time.

Screenshots and DOM checks covered desktop and narrow layouts. Observed narrow
widths included 354 and 390 CSS pixels; checked pages had no horizontal overflow.
New scenario controls and finder clear/close targets are at least 44 CSS pixels.
The inspected browser error log was empty. This was responsive browser testing,
not a physical phone or on-screen-keyboard test.

## Remaining fidelity work

The broader goal remains active. This is a verified set of journeys, not a full
accessibility audit or proof that every company scene has equal depth. The new
research briefs deliberately have a smaller scope than full company studies.
Real-device touch, virtual-keyboard behaviour and assistive-technology testing remain open.
Dated construction announcements still need newer evidence before being described
as operating capacity.

## Cross-category journeys and stale scripts — follow-up

Live review found that the enterprise guide showed six companies while its
landscape showed four. The plot also presented CoreWeave as an enterprise suite.
The three curated categories now use product roles and share their memberships
with the guides. Databricks and Snowflake remain one company each while appearing
in every supported context. A company, category, brief and return link preserve
that context. Unsupported company/category combinations still fall back safely.

Browser testing confirmed the Databricks enterprise → inference → research brief
→ landscape journey, category counts, and focus returning to the original company
when a preview closes. Escape closes the delivery menu without also clearing the
selected company. Desktop (1470 CSS pixels) and narrow (390 CSS pixels) layouts
were inspected without horizontal overflow. The landscape now waits for its URL
state rather than briefly rendering an unrelated default view.

The localhost browser also reproduced an older app from cached development
scripts, including a 202-versus-219 company hydration mismatch. The worker had
treated every Next.js static path as immutable, although development filenames
stay the same. The update only retains successful assets explicitly marked
immutable, unregisters Compound's worker during development, and limits offline
navigation fallback to Pocket routes. After the worker update and reload, the
same localhost origin displayed the current category and selected company.
Regression tests exercise stale scripts, failed asset responses, unrelated routes
and cache ownership during upgrades. The final production build and all 82 tests pass.

A bounded Claude review was attempted using only files verified against public
GitHub blobs. It timed out without findings. The evidence above comes from direct
source inspection, executable checks and browser interaction.

## Connected company scenarios — follow-up

Workday’s previously static process and compensation screens now share a
fictional compensation change. The 8% path requires two review roles; returning
and revising to 4% restarts review and skips the conditional extra approval.
Effective values depend on approval and the scenario date. A rejected payroll
handoff needs a mapping fix, retry and provider acknowledgement. Workday Home
uses a scripted Sana-style question to enter the same state, and People shows
the corresponding worker value. Backstage adds sourced Adaptive and Sana
lineage, Bhusri’s return and the March 2026 product launch.

PageUp now shares its review and review list across Applications, Paige and the
hiring dashboard for the browser session. ELMO keeps the review budget visible
when a proposal is incomplete, uses a warning badge, explains the exception-note
requirement and marks a reviewed mapped-field conflict. Cowork’s initial guidance
now starts with sharing the demo folder.

Observed browser checks: both Workday approval routes; wrong-role handoff;
effective-date mismatch; provider failure, fix, retry and acceptance; reload,
Back, the worker-record return link and App → Backstage → App continuity. PageUp’s review stayed recorded through
Paige, the dashboard and reload, then reset from Applications. ELMO’s empty-field
and short-reason states, plus the reviewed conflict row, were checked. Shared App/Backstage targets and mobile section controls are at least 44 CSS pixels. The Workday
layout was inspected at 390 and 1440 CSS pixels without horizontal overflow.
This still does not establish physical-device touch or assistive-technology coverage.

Six bounded Claude reviews completed against selected project sources. Findings
were checked against parent routing, reducers and actual browser behaviour;
speculative issues and already-enforced gates were not applied. Further research
leads include NVIDIA’s serving layer, alternative silicon and the boundary between
enterprise AI infrastructure and workflow-native agents. They require primary-source
verification before becoming new company claims. ANZ capability-column visibility
and clearer career-connection summaries remain candidates for the next pass.

Release validation: production build and all 88 tests pass. New checks cover
role ownership, send-back and conditional review, effective dates, failed/retried
provider handoffs, valid URL replay, App/Backstage context and the shared PageUp
review record. Sana and Adaptive names now resolve to Workday in the finder.


## Serving infrastructure and ecosystem navigation — follow-up

Primary-source research adds NVIDIA, Hugging Face and SambaNova. The serving guide
now separates packaged inference software from managed APIs and custom compute,
and includes a scenario for choosing the operating boundary. Model support comes
before latency comparisons. The Australia processing example no longer suggests
CoreWeave on the basis of wider regional infrastructure coverage.

NVIDIA’s current LLM offering documentation is more specific than its generic
FAQ: the brief preserves release/support distinctions without making a blanket
licence claim. Hugging Face’s provider routing and dedicated Endpoints remain
separate services. SambaNova’s financing and customer selection are dated company
announcements, not evidence of completed deployment or measured outcomes.

A capability selected outside the current ANZ comparison group stays visible in
an extra column beside the practice. Switching groups preserves the filter and
avoids duplicate columns. Career summaries foreground recorded roles at the
inspected firm while labelling the latest recorded or historical role separately.
No employment is inferred from ownership. Matrix controls and evidence links
have 44-pixel targets.

Observed browser journeys: Payroll while comparing Workday service roles,
keyboard switch to product domains and Back; ServiceNow Implementation while
comparing workflow domains, then named-customer evidence; Mitch Collins at
Cognizant with his recorded Kainos role; the new serving scenario to Hugging Face;
NIM search to NVIDIA with existing Global View links intact; SambaNova with its
enterprise category and landscape return preserved. Narrow (390 CSS pixels) and
desktop (1440 CSS pixels) layouts had no page overflow. Browser errors were empty.
These checks do not establish physical-phone or assistive-technology coverage.

Release validation: production build and all 89 tests pass. The full test suite
reads generated pages and must run after the build finishes. New checks cover
capability-column continuity; product-name and existing global-context checks
include the new company briefs.


## ServiceNow: recover the obligation, retain the record

Service Operations now shows two business services using the same database.
The fictional approval policy requires both change evidence and impact review.
Execution invalidates the earlier healthy fulfilment observation; fresh checkout
and fulfilment results are both required before incident closure. Failed checks
remain in Activity after later recovery.

AI Control Tower now separates reviewer, asset owner and runtime operator roles.
An owner can respond to a return and resubmit a revision, but approval cannot
carry over. Deployment dispatch, runtime receipt and canary observation are
separate events. A blocked out-of-scope attempt requires a rollback receipt; the
asset inventory follows the resulting model state. Subsequent revision and
review retain the failed canary and earlier decisions.

EmployeeWorks requires a mapping repair before retrying a failed identity task,
retains provider attempts, and enforces the selected owner in the reducer.
Workplace readiness can proceed separately because the HR transfer is already
approved. All three scenes keep recorded actions and draft notes in session
storage, with an in-memory fallback when storage is unavailable. Restoration
replays permitted actions; it cannot inject a later state or borrow another
role's authority. A reset affects its own scene only.

Browser checks covered return → resubmit → fresh review → dispatch → receipt →
failed canary → rollback → revision three → successful canary; inventory state,
reload and retained history; a checkout success with fulfilment failure blocking
closure, then successful recovery and explicit resolution; employee mapping
repair/retry and reset isolation; App → Backstage → App continuity. Desktop
1440-pixel and narrow 390-pixel layouts were inspected. Focus moves after the
updated heading renders, including successive keyboard actions. These are
responsive browser checks, not physical-device or assistive-technology testing.

Release validation: production build and all 93 tests pass. Browser errors were
empty. Checks cover role ownership, fresh review, separate receipts and outcomes,
shared-service recovery, repair before retry, replay validation and reset isolation.

## Employment Hero: connect employer work to the next person

The audit found three disconnected scenes: Home never reflected completion,
Find Talent stopped at an invitation, and leaving a screen discarded decisions.
The study now shares accepted actions and drafts across its four workspaces.
Payroll carries the source discrepancy through correction, whole-run review,
finalisation and separate publication. Restoring imported hours invalidates review.
The EH Work preview exposes only the published gross summary; it does not present
net pay, a statutory payslip, payment or filing as completed.

Three invitation fixtures demonstrate interested, declined and unanswered.
Saving a profile is not contact. An invitation needs reviewed profile evidence
and context. Only an interested reply permits a local follow-up plan; that plan
retains the original suitability question and creates no application or employee.
Home displays the invitation denominator and outcome counts. People compares the
same proposed role, surfaces planned follow-ups and keeps an unreviewed model
separate from the saved responsibility comparison.

Primary sources checked on 11 September: the AU candidate reminder guide updated
2 September, payroll finalisation and publication guides, and the Australian
HeroForce product page. The older Find Talent FAQ says organisation-level
Interested Candidates is not supported. The study therefore uses explicit
role-specific reply fixtures, not an organisation-interest feed. Backstage records
these sources and the limits of the fictional follow-up and employee summary.

Browser checks covered both payroll review cycles, finalised-but-unpublished
state, the published employee view, interested/declined/unanswered responses,
follow-up drafts through Backstage, saved-profile empty states, model changes,
reload and independent reset. Candidate selection brings its profile into view
at narrow widths; desktop gives the evidence panel more space. The session now
shows a loading state before restoration instead of briefly displaying stale
initial counts. Inspected 390- and 1440-pixel layouts did not overflow; tested
buttons meet 44 pixels. A clean reload produced no browser errors. Development
hot reload emitted a hook-dependency warning while the hook was being edited;
it did not recur after reload.

The shared App/Backstage link now carries a registered screen through explanation
chapters and returns to it. Explicit destinations win, invalid screens fall back,
and context cannot cross companies. Workday keeps its scenario answers alongside
the return screen; its Compensation Partner journey was verified in the browser.
These are responsive and keyboard browser checks, not physical-device or
assistive-technology certification. Broader company-depth and device audits remain open.

Release validation: production build and all 103 tests pass. The return-path
checks cover every registered company screen, known Rippling employee records,
explicit destinations and cross-company isolation. New scenario tests cover
payroll sequencing, review invalidation, invitation outcomes and denominators,
model review, restored drafts, invalid saved data and independent resets.

## Market movement: connect the reading to its evidence

The movement audit found undated records in Recent signals, a history toggle that
had no effect under direction filters, and event cards disconnected from career
records. It also found that the latest badge could hide another kind of change.
The view now starts with concise firm readings and a sourced timeline. Selecting
a firm includes explicit predecessor history. Firms without a qualifying signal
remain discoverable without implying stability or decline.

ANZ operating direction, ownership changes and APAC context are separate. Mixed
local evidence remains mixed instead of allowing the newest positive event to
overwrite contraction. Ownership applies to the acquired target; regional hires,
awards and global announcements cannot establish ANZ growth. The existing
11 September 2026 snapshot is retained. The Kainos FY26 report was rechecked to
make the growth measure explicit: ANZ revenue from a small base, not a local
consultant count or evidence of the team available for a new engagement.

Undated events stay outside the dated timeline. A year or month crossing the
18-month boundary is identified as too broad to count as recent; Full history
retains its original precision. Direction filters select firms, so changing the
period still reveals their wider contextual history.

Browser checks covered Building → Full history → Duane Goff → Back, preserving
the original filters and opening the recorded career with keyboard focus;
xAmplify's explicit Epicon lineage and the return to matching firms; Kainos's
local and APAC evidence; Nexon's ownership and separate undated talent story;
NTT DATA's year-only timing; and Bosley without a dated direction. Rapid search,
capability and movement selections survive reload. Selecting a person now moves
focus to that person's expanded record. Full-timeline and overview links land
below the shared header at narrow widths.

Inspected 320-, 390- and 1440-pixel layouts did not overflow. The new event, period
and firm links meet 44 pixels; native links retain separate-tab destinations.
The development browser error log was empty. These checks do not establish
physical-device or assistive-technology coverage.

Release validation: production build and all 109 tests pass. New cases cover
calendar/date precision, signal expiry, mixed local direction, ownership targets,
APAC isolation, full-history filtering, explicit lineage, unplaced evidence and
career destinations that clear incompatible filters.
