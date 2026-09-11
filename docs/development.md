# Development

Most visitors should use [the hosted edition](https://compound-snowy-pi.vercel.app).
Local setup is for contributors and people adapting the project.

## Run locally

Use Node.js 22 and npm.

```sh
git clone https://github.com/EthDawg/compound.git
cd compound
npm ci
npm run dev
```

Open the local URL printed by Next.js. The current studies need no API keys or
database: scenarios run locally in the browser, and research lives in the repo.

## Check a change

Stop the development server first: development and production builds share
`.next`.

```sh
npm run build
npm test
```

Build before testing because some tests check generated routes. To serve that
build locally, run `npm start`. Check the affected interactions and responsive
layout as appropriate; a passing build alone does not verify them.

## Where changes belong

| Area | Source |
| --- | --- |
| Company identity, supported screens and route fallbacks | `lib/companies.ts` |
| Shared company finder and search vocabulary | `components/company-picker.tsx`, `lib/company-index.ts` |
| Category guides, company research and dated sources | `lib/data/category-research.ts`, `app/categories/`, `app/research/` |
| Category scenarios and Fireworks serving walkthrough | `components/category-workbench.tsx`, `components/fireworks-serving-lab.tsx`, `lib/fireworks-serving.ts` |
| Company themes | `lib/vendors/skins.ts`, company study definitions |
| Workday process and effective-date scenario | `components/workday-app.tsx`, `components/studies/workday/process.tsx`, `lib/data/workday-scenario.ts` |
| PageUp shared review | `components/studies/talent/pageup-review.ts`, `lib/data/pageup-review.ts` |
| App scenarios | `components/studies/`, `lib/data/*-scenarios.ts` |
| Company arguments, history and sources | `lib/content/` |
| Atlas companies, categories and editorial positions | `lib/data/atlas.ts`, `lib/data/ecosystem.ts`, `lib/data/atlas-nodes.ts` |
| Category roles and preserved navigation context | `components/research-landscape.tsx`, `components/research-wayfinding.tsx`, `lib/atlas-navigation.ts` |
| ANZ research: people, capabilities, events and customer evidence | `lib/data/workday-anz.json`, `lib/data/servicenow-anz.json` |
| Shared ecosystem views and derived logic | `components/anz-ecosystem.tsx`, `lib/data/anz-ecosystem.ts` |
| Ecosystem configuration and discovery | `lib/data/*-anz.ts`, `lib/ecosystem-index.ts` |
| Global Workday directory snapshot and enrichment | `lib/data/workday-partners.json`, `lib/data/workday-partners.ts` |
| Canonical company routes | `app/companies/[company]/` |

To add a full company study, connect its identity and theme, supported App
scenes, Backstage argument and sources. Extend the registry and renderer
selection, then verify direct links and company switching. Shared structure
should preserve company-specific depth.

URLs own navigation state. Switching companies preserves supported views and
topics; unsupported screens fall back to that company’s overview. Never fill a
gap with another company’s content.

Workday’s scenario replays valid actions from the URL; role changes, revisions,
effective dates and provider receipts must remain separate. Internal App and Backstage links
carry the scenario query through `components/study-context-link.tsx`. PageUp’s dashboard, application review and Paige read
one session-local review record, with a memory fallback when storage is unavailable.
Do not turn a completed review back into outstanding work when changing screens.

## Refresh research

Category briefs are a smaller commitment than full App/Backstage studies. Keep
three practical strengths, the origin of the capability, a dated change, a trade-off
and a useful watchpoint. Attach primary sources to facts and label interpretation.
Companies can belong to several research categories while retaining one catalogue
identity. Search aliases should include products and former names. Announced
changes, completed acquisitions and future service changes are different states.
The landscape derives those memberships from the same research registry. Keep a
supported category in the URL when selecting a company; unrelated category/company
pairs fall back to its primary placement. Curated AI categories use product roles
instead of implying numerical rankings from generic software archetypes.

Update the affected facts and their sources together. Review acquisition status,
role dates and regional scope. The ANZ movement view derives recent signals
relative to each ecosystem’s `asOf` date; advance it only after reviewing the evidence.
Its local-size fields must not borrow company-wide headcounts. Keep month/year
precision instead of inventing exact dates. Historical roles must stay labelled;
a credential does not establish local delivery, and an award does not by itself
establish practice growth.

The finder derives partner entries from the research and merges shared company
IDs. Keep one ID across platforms when the company is the same, with separate
practice links. Historical firms remain addressable as lineage context. Add
platform-specific capabilities in configuration rather than changing another
platform’s vocabulary.

For the global directory, `python3 scripts/import-workday-partners.py` prepares
a snapshot update. Review the diff, profile-derived tags and curated additions
before building and testing. The importer checks completeness and identity;
it does not publish changes. Preserve unknown coverage and evidence dates.

## Publishing

The wider guide uses `/earth` for selected global markets, `/technology` for
history, physical-scale labs and external explorers, and `/decisions` for buyer
decisions. Dated world observations and edges live in `lib/data/world-research.json`;
`earth.ts` derives both the map and company discovery entries. Technology stories
live in `technology.ts`. Practice operating briefs and narrowly paired engagement
claims live in `practice-briefs.json`; do not generalise one paired claim to other
service/domain combinations. `decision-engine.ts` contains transparent editorial
rules; public profiles must never pre-fill buyer verification or team availability. Reproducible teaching models live in `technology-math.ts`.
Keep units and assumptions beside the displayed results; do not recast models
as measurements. `public/earth-land.svg` is an equirectangular outline derived
from Natural Earth's public-domain 110m land GeoJSON, not a facility dataset.

Capability cells distinguish named cases, anonymous cases, local offers,
credentials, people/hiring signals and regional/global offers. Set `anonymous: true` on unnamed
customer cases. Domain and service-role columns are independent; their presence
must not be treated as every possible service/product competency combination.

The public edition is maintained on Vercel. Contributors submit pull requests;
they don’t need Vercel access or a deployment of their own. The maintainer
validates changes, publishes the release and checks the live routes.

GitHub is the source; [the live site](https://compound-snowy-pi.vercel.app) is the
shared experience. App interactions are illustrative and do not call the real
vendors’ systems or live AI models.

The offline worker serves only the Pocket scenarios as navigation fallbacks. It
caches successful immutable build assets, never development scripts. Development
unregisters Compound's existing worker; reload once if an older worker controlled
the page. A research or company route must never become a Pocket scene offline.


ServiceNow scenes live in `components/studies/servicenow/`. The incident and AI
change have separate components; EmployeeWorks remains in `app.tsx`.
`lib/data/servicenow-scenarios.ts` owns the fictional transitions and role guards.
`lib/data/servicenow-session.ts` replays recorded actions and isolates resets;
`session.ts` binds that record to the browser session. Keep runtime receipts,
observed outcomes and governance decisions distinct when extending a scene.

Employment Hero's connected example lives in `components/studies/talent/hero/`.
`lib/data/hero-session.ts` owns guarded transitions, scripted replies, outcome
counts and bounded session replay. Payroll, candidate conversations and employment
model comparisons reset independently. Keep jobseekers distinct from payroll
employees, and keep finalisation, publication and payment distinct.

OpenAI's three examples live in `components/studies/ai/openai/`.
`lib/data/openai-session.ts` owns their transitions and bounded session replay;
`session.ts` binds them to session storage with a memory fallback. They retain
independent progress rather than implying an automated workflow between products.
A changed Work source makes the previous artifact stale without rewriting signed
scope. Codex separates file review, checks, staging and a fictional local commit.
Responses keeps each proposal's approval identity and original call result;
provider reconciliation is separate evidence. Its recovery key and definitive
non-creation reply belong to the fictional provider contract, not an exactly-once
guarantee from OpenAI or MCP. Keep those distinctions when extending the fixtures.

`lib/data/study-context.ts` carries registered App screens through Backstage.
`components/study-context-link.tsx` renders those destinations as native links;
explicit URLs and company boundaries take precedence. Workday additionally keeps
its existing scenario query. Neither the return screen nor a saved scenario
establishes a live system action.

Market movement is derived in `lib/data/market-movement.ts`. Curated event
`movement` values must already be supported by the attached source: a hire,
award, investment or deal announcement alone does not establish growth or a
completed acquisition. ANZ operating direction, APAC context and target ownership
remain separate. Opposing local signals produce Mixed signals; regional or global
expansion cannot create an ANZ direction. The window is 18 months to the dataset's
`asOf`, not the visitor's current date.

Retain the source's event-date precision. Undated records and dates spanning the
recent-window boundary are shown separately from Recent signals. Full history
can place coarse historic dates; it still separates undated records and excludes
future events. `movementTimeline` selects firms by their current reading, then
applies the chosen period to their events and explicit lineage event IDs. Do not
substitute just each firm's newest event or pull in every event of a parent.

`components/anz-movement.tsx` presents the readings and evidence. Career links use
recorded people and their company on record; they clear incompatible filters and
retain native browser history. A person attached to an event may be its source
author or practice leader, so these links are labelled Career context, not hires.


Company connections are a mode of the existing homepage: `/?connections=<id>`.
`lib/data/company-connections.ts` curates typed, directed relationships using the
canonical company IDs. Acquisition and career sources reuse the ANZ records;
physical dependencies reuse Global View sources. Add endpoints deliberately:
event co-membership, a shared category or a former employer is not an ownership
relationship. Retain announcement/completion status and each source's date.

`components/company-connections.tsx` shows one company's immediate connections,
with a stacked layout on small screens. Keep native company and evidence links.
The shared finder stays in this mode for company selections; explicit person and
customer matches still lead to their evidence. Known companies without mapped
relationships remain visible with their existing context. No second company
registry or graph library is required.

The homepage uses query-specific metadata for company connections. Its rendered
HTML is tested through a temporary localhost production server in
`tests/company-page.test.cjs`, rather than assuming a static `index.html`.
