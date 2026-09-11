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
| Company themes | `lib/vendors/skins.ts`, company study definitions |
| App scenarios | `components/studies/`, `lib/data/*-scenarios.ts` |
| Company arguments, history and sources | `lib/content/` |
| Atlas companies, categories and editorial positions | `lib/data/atlas.ts`, `lib/data/ecosystem.ts`, `lib/data/atlas-nodes.ts` |
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

## Refresh research

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

The public edition is maintained on Vercel. Contributors submit pull requests;
they don’t need Vercel access or a deployment of their own. The maintainer
validates changes, publishes the release and checks the live routes.

GitHub is the source; [the live site](https://compound-snowy-pi.vercel.app) is the
shared experience. App interactions are illustrative and do not call the real
vendors’ systems or live AI models.
