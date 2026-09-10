# Compound — company studies

An independent study of software companies, built as an Atlas, an illustrative
App, and the company-building reasoning in Backstage.

Live: https://compound-snowy-pi.vercel.app

Licensed under the [MIT License](LICENSE). Copyright © 2026 Ethan Harley.

## The model

**Company → App / Backstage.** A company is Rippling or Workday. An archetype
(compound platform, enterprise suite) describes its position; it is not an
instance to switch to. Meridian Optics is the shared fictional customer used to
compare the two app studies.

| Surface | Route | Purpose |
| --- | --- | --- |
| Atlas | `/` | Sectors, categories and vendors under four editorial lenses |
| Workday partner network | `/atlas/workday` | Explore integrators, specialists and staffing firms by published services, products and regions |
| Company app | `/companies/{company}/app` | Explore the company's illustrative interface |
| Company Backstage | `/companies/{company}/backstage` | Understand the company's thesis, design choices and evaluation criteria |
| Rippling operating manual | `/companies/rippling/backstage/manual` | Full essays on compounding economics, product-building speed and founder decisions |
| Desk | `/desk` | Research priorities and maintenance prompts |
| Deep reads | `/ecosystem/{slug}` | Existing company position essays |
| Pocket | `/pocket` | Existing mobile onboarding, offboarding and ask demos |
| Brief | `/brief` | Existing 12-minute Rippling/compound-platform argument |

The Company selector currently offers **Rippling and Workday** in both App and
Backstage. The two views share the company's theme and identity, while the
Backstage content and navigation differ by company. Rippling opens with the full
compound-company study: economics, product-building speed, founder reasoning,
essays, decisions, metrics and explorations. Workday opens with its own company
thesis. Both support shared comparison routes for the operating model, choices
and trade-offs, proposed tests, and sources. The shared structure must preserve
each company's depth. The former Rippling `/backstage/library` destination
redirects to its canonical Backstage home.

The URL is authoritative, including on direct entry, refresh, Back and Forward.
Switching companies preserves the view and a shared topic/screen. An unavailable
screen lands at that company's overview within the same view. Content is never
borrowed from the other company as a fallback. Atlas and Desk entry links resume
the most recently viewed supported company; explicit company links always win.

Old `/app/*`, `/backstage/*` and `/instance/workday` bookmarks redirect to the
company-qualified equivalents. The other legacy instance studies remain
reachable separately; their depth is not presented as equivalent to the paired
company studies.

## Ownership

- `lib/companies.ts`: company identity, brand, supported screens, Backstage navigation and data,
  source provenance, route construction and company-switch fallback rules.
- `lib/vendors/skins.ts`: the referenced palettes, layout tokens and legacy app
  study data. Company shells read these tokens rather than maintaining a second
  theme for Backstage.
- `app/companies/[company]/`: canonical routes, static page generation and
  metadata. Unknown companies or unimplemented paths return 404.
- `components/studies/rippling/`: preserved Rippling screens and essays, with
  explicit screen registries for server-side rendering.
- `components/workday-app.tsx`: Workday workspace and working module links.
- `components/company-backstage.tsx`: shared Backstage comparison pages and the
  Workday overview. Rippling's full study owns its overview.
- `components/compound-bar.tsx`: company selection and App/Backstage navigation.
- `lib/data/`: fictional customer data. Employee IDs join devices, apps, spend
  and payroll; system assignments derive from those employee records.
- `lib/content/`: the core compound-platform argument. These constructed
  essays belong to the Rippling study, not every company on the Atlas.

To add a company, supply its identity/theme, navigation and core Backstage data,
register screens its app renderer actually supports, then extend the company ID
and renderer selection. Do not copy Rippling's essays under a new brand.

The Atlas derives breadth positions from archetypes and uses hand-read positions
where available. `lib/data/atlas-nodes.ts` joins the company registry to playable
App links. `lib/data/ecosystem.ts` owns editorial lens scores. If scores change,
check the associated prose remains consistent.

## Framing

This is an independent design study, not an official product or an exact
reproduction. Public sources support company concepts. Layouts, theses,
trade-offs and proposed tests are editorial interpretations. The demo customer,
people, records and figures are fictional. The founder voice and
decision log are constructed, not quotations or claims about real internals.

## Workday partner network

The map contains the complete 174-entry public Workday **Services** directory
snapshot gathered on 10 September 2026, plus Cognizant and NTT DATA, whose current
company sites publish Workday offerings. These two additions are identified
separately and excluded by the directory-only filter. The directory includes
staffing, advisory and adjacent firms as well as implementation partners;
independents outside it are not comprehensively covered.

Every firm has source links. `lib/data/workday-partners.json` contains sanitized
directory records, declared competencies and regions, and short attributed
excerpts. `lib/data/workday-partners.ts` owns reviewed additions, aliases, evidence
labels, filtering and CSV export. The graph groups published service signals;
positions and dot sizes are not market-share estimates or quality rankings.
Related firms share product tags, not an asserted commercial relationship.

Structured directory fields and explicit profile-text mentions remain distinct.
Region filters use declared coverage, including Global, and never infer delivery
locations from headquarters. The detailed competency table retains the original
service/product/region relationships. Missing fields remain unspecified.

The roster importer uses the same public search and profile interfaces as
[Workday's directory](https://marketplace.workday.com/en-US/pages/find-a-partner/listing#f-appdirect_comp_partner_type_id=Services).
It stores no search tokens, contact addresses, signed logo URLs or private data.
To prepare a refresh, run `python3 scripts/import-workday-partners.py`, review
the resulting diff and text-derived tags, recheck the curated sources, then
build and test. The import fails on missing profiles, partial results or duplicate
identities. It does not automatically publish anything.

Filters and selected profiles are represented in the URL. Back/Forward and direct
links preserve the view. CSV export contains the filtered set and evidence labels.

## Running and verifying

```sh
npm install
npm run dev
npm run build
npm test
npm run start
vercel deploy --prod --yes
```

Next.js 15, React 19, Tailwind and TypeScript. Typed modules hold the data; there
is no live customer database or transactional backend.

Do not build while the development or preview server is running: they share
`.next`. Stop it, build, then restart the preview from the exact output.

The routing tests exercise company/view/topic retention and fallback behaviour,
and verify registered routes exist in the production build. They also protect
direct access to Rippling's economics, product-building and founder content from
its Backstage home, and each company's complete navigation. Browser checks
cover the original desktop popup reproduction, App/Backstage switching, company
styling, mobile navigation, remembered company links and legacy bookmarks.

The Atlas clears hover and tooltip state on drill-down, search, breadcrumbs,
lens/filter changes, Escape, scroll, resize and pointer exit. Coordinates use
the rendered plot size, preventing a removed node from leaving the next map
faded beneath a stale card.

Existing depth limits remain: several Rippling modules are explicitly empty
states; Workday modules are illustrative read-only screens. X-ray annotates
supported app surfaces. Pocket animations preserve reduced-motion behaviour
and pause/resume when tab visibility changes.
