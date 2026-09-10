# Compound — the founder's view

An independent study of the compound-startup thesis, built as working software so
the argument can be walked through rather than read about. Live at
**https://compound-snowy-pi.vercel.app**

Three surfaces at one address:

| Surface | Route | What it is |
| --- | --- | --- |
| The product | `/app` | A dense admin platform for a fictional 344-person hardware company across four entities and six countries. Payroll, devices, app access, spend, workflows, graph explorer. |
| Backstage | `/backstage` | The operating philosophy underneath it — 12 essays, 14 logged decisions, 11 heresies, 8 metrics, 9 execution skills, the agentic turn, growth trajectory. |
| Pocket | `/pocket` | Installable mobile PWA. Three flagship flows for a demo in someone's hand: Onboard, Offboard, Ask. |
| The map | `/ecosystem` | One level up: ~33 HR-tech companies plotted four times under four incompatible definitions of relevance, plus nine positions read in full. |

The bridge between the first two is **x-ray mode** — press `X` anywhere in `/app`
and every screen grows founder annotations explaining its design premise, what it
trades away, and what holding the line cost.

`/brief` is a 12-minute speed run with four audience lenses (prospect, investor,
new joiner, skeptic) — the thing to send someone.

The map's whole argument is that relevance is not one quantity. Each lens is a
different question ("relevant to the argument?" / "to the number of people whose
pay depends on it?" / "to whether an agent can safely act?" / "to whoever has to
keep using it Monday?"), and node position *and size* change under each. The
companies that swing most between lenses — ADP, Mercor, nga.net — are the point.
Scores live in `lib/data/ecosystem.ts` and are editorial judgements, deliberately
so; if you change one, check the prose in `lib/content/ecosystem-deep.ts` still
agrees with it.

## Framing, deliberately

This is a study, not a facsimile. It engages the real, publicly-stated
compound-startup thesis by name, but the company in the product, its people and
numbers, the decision log and the founder voice are all constructed. The voice is
a reconstruction written to be argued with — not quotations, and not a claim about
any real company's internal operations. That framing is stated on the landing
page, in backstage, and on `/brief`. Keep it if you extend this.

Competitors are described as **archetypes** (point specialist, suite-by-acquisition,
legacy enterprise, services-led) rather than named companies. Better analysis, and
it keeps the study honest.

## Running it

```sh
npm install
npm run dev          # http://localhost:3000
npm run build        # also the pre-deploy check
vercel deploy --prod --yes
```

Next.js 15 App Router, React 19, Tailwind, TypeScript. No database, no API —
every "record" is a typed module under `lib/data`. Fully static except the
manifest route.

> Do not run `npm run build` while `npm run dev` is live: the build overwrites
> `.next` and the dev server starts 404-ing its own chunks. Kill dev first.

## Where things live

```
lib/data/          The fictional tenant: employees, systems, finance, workflows
lib/content/       All prose and structured argument (manual-a…d, decisions,
                   heresies, metrics, skills, agentic, trajectory, brief, pocket)
lib/content/xray.ts  The annotation registry — keyed by anchor id
components/        UI. cascade.tsx and ripple-demo.tsx carry the animated proofs
app/app/           Product surfaces
app/backstage/     The essays and analysis
app/pocket/        The installable PWA
public/            Generated PWA icons + service worker
```

Two ideas do most of the work:

- **`lib/data/employees.ts` is the primary key.** Devices, apps, spend and payroll
  all derive from it. `lib/data/systems.ts` builds the device fleet *from* employee
  assignments rather than duplicating them, which is why the home-page stats and
  the task list can't drift apart. Keep that property.
- **`XNOTES` in `lib/content/xray.ts` is keyed by anchor id.** Wrap any UI region
  in `<XRay id="...">` and the annotation renders inline beneath it in x-ray mode.
  Adding commentary to a new screen is a data edit, not a component edit.

## Tinkering notes

Things that are genuinely unfinished, roughly in order of payoff:

1. **Ten `/app` routes are stubs** (benefits, time, learning, identity, security,
   expenses, bills, planning, reports, entities). Each renders an honest empty
   state with a one-line premise. The nav is long on purpose; building one out is
   a self-contained afternoon.
2. **X-ray coverage is partial.** Annotations exist for the built surfaces only.
   New notes are entries in `XNOTES` plus an `<XRay>` wrapper.
3. **The pocket cascade timings are hand-tuned** in `lib/content/pocket.ts`
   (`atMs` per step). There's a Node simulation approach in scratch that replays
   the gate logic if you retune them — onboard lands ~9s, offboard gates at ~8.1s.
4. **`prefers-reduced-motion` settles the cascade straight to its end state**, and
   the run pauses/resumes on tab visibility rather than skipping ahead. Preserve
   both if you touch `components/cascade.tsx`.
5. **No tests.** The riskiest logic is the cascade's human-gate resume (it uses a
   ref, not state, to avoid a stale closure) and the graph explorer's joins.
6. **Effective-dated retrieval is the honest open problem** in the argument itself
   — see `backstage/agentic`. If you want a hard build, that's the one.
7. **The map covers ~33 companies; only nine have deep reads.** Adding one is a
   `COMPANIES` entry (four lens positions) plus optionally a `DEEP` entry. Keep
   the honesty framing: real companies get interpretation of public positioning,
   never invented decisions, quotes or internals — that line is what separates
   this from the fictional tenant in `/app`.

## Provenance

Built with Claude Code, September 2026. Registered in the Personal AI OS Canonical
Map as a reference build; resumption is queued on the Action Board under
CAPACITY BLOCKED.
