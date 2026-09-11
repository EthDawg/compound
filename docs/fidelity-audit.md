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
enterprise AI cloud. Twenty company briefs connect three strengths to their
origins, a dated change, a trade-off and a watchpoint. Product and former names
resolve through the existing company index, including Windsurf, Vertex AI and
MosaicML. Cross-category membership does not create duplicate companies.

Each guide has three practical situations. The Fireworks walkthrough makes the
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
