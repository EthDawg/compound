'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CompoundBar } from './compound-bar';
import { AtlasMaps } from './atlas-maps';
import { WorkdayPartnerAtlas } from './workday-partner-atlas';
import { ANZ_EVENTS, ANZ_CUSTOMERS, ANZ_LINEAGES, CAPABILITIES, anzCompany, companyPeople, peopleInLineage, movementEvents, companyEvents, companyMovement, searchAnz, ecosystemHref, directoryRequested, type AnzCompany, type AnzEvent, type Fact, type Movement } from '@/lib/data/workday-anz';

const VIEWS = [
  { id: 'people', label: 'People Power', question: 'Who builds the capability?' },
  { id: 'capability', label: 'Capability Map', question: 'What is evidenced in ANZ?' },
  { id: 'movement', label: 'Market Movement', question: 'What is changing?' },
];
const MOVEMENTS: Movement[] = ['Building', 'Growing', 'Acquired', 'Contracting'];
const tone: Record<string, string> = { Building: 'bg-amber-50 text-amber-800', Growing: 'bg-emerald-50 text-emerald-800', Acquired: 'bg-violet-50 text-violet-800', Contracting: 'bg-rose-50 text-rose-800', 'No recent signal': 'bg-slate-100 text-slate-500' };
const field = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0875CE] focus:ring-2 focus:ring-blue-100';

function Evidence({ fact, children }: { fact: Fact; children?: React.ReactNode }) {
  return <a href={fact.url} target="_blank" rel="noreferrer" title={fact.source} className="text-[#0755A5] underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600">{children ?? fact.source} ↗</a>;
}
function Signal({ id }: { id: string }) {
  const state = companyMovement(id);
  return <span title={state.event ? `${state.event.dateLabel}: ${state.event.title}` : 'No dated directional signal in the past 18 months in this research.'} className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${tone[state.label]}`}>{state.label}</span>;
}

export function WorkdayEcosystem() {
  const params = useSearchParams();
  if (directoryRequested(new URLSearchParams(params.toString()))) return <WorkdayPartnerAtlas />;
  return <AnzEcosystem />;
}

function AnzEcosystem() {
  const params = useSearchParams();
  const view = VIEWS.some((v) => v.id === params.get('lens')) ? params.get('lens')! : 'people';
  const query = params.get('find') ?? '', cap = params.get('cap') ?? '', movement = params.get('signal') ?? '';
  const visible = searchAnz(query, cap, movement);
  const selected = anzCompany(params.get('firm') ?? '') ?? visible[0];
  const detail = useRef<HTMLDivElement>(null);
  const href = (values: Record<string, string | undefined>) => ecosystemHref(values, params.toString());
  const update = (values: Record<string, string | undefined>) => window.history.replaceState(null, '', ecosystemHref(values, window.location.search));
  useEffect(() => {
    if (params.get('firm') && window.matchMedia(view !== 'people' ? '(max-width: 1279px)' : '(max-width: 1023px)').matches) detail.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [params.get('firm'), view]);
  const events = movementEvents(query, cap, movement);

  return <div className="min-h-screen bg-[#F4F7FB] text-[#192A3B]">
    <CompoundBar activeId="workday" />
    <main className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6">
      <AtlasMaps active="workday" />
      <header className="flex flex-wrap items-end justify-between gap-4 py-6">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#0755A5]">Workday ecosystem · Australia & New Zealand</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">The people behind the practice.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">Follow the people, the capability they carry, and the firms being built around them.</p></div>
        <Link href="/atlas/workday?scope=global" className="text-xs font-semibold text-[#0755A5] underline underline-offset-4">Global partner directory ↗</Link>
      </header>
      <nav aria-label="ANZ intelligence views" className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {VIEWS.map((v) => <Link key={v.id} href={href({ lens: v.id })} aria-current={view === v.id ? 'page' : undefined} className={`rounded-lg border-b-[3px] px-2 py-3 sm:px-4 ${view === v.id ? 'border-[#F5A623] bg-[#EEF5FC] text-[#0755A5]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}><span className="block text-xs font-semibold sm:text-sm">{v.label}</span><span className="mt-1 hidden text-[11px] font-normal sm:block">{v.question}</span></Link>)}
      </nav>
      <div className="grid gap-2 py-4 sm:grid-cols-[minmax(200px,1fr)_180px_170px]">
        <label><span className="sr-only">Find a company, person or former firm</span><input type="search" value={query} onChange={(e) => update({ find: e.target.value, firm: undefined, person: undefined })} className={field} placeholder="Company, person or former firm…" /></label>
        <label><span className="sr-only">ANZ capability</span><select className={field} value={cap} onChange={(e) => update({ cap: e.target.value, firm: undefined })}><option value="">Any ANZ capability</option>{CAPABILITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label><span className="sr-only">Market signal</span><select className={field} value={movement} onChange={(e) => update({ signal: e.target.value, firm: undefined })}><option value="">Any movement</option>{MOVEMENTS.map((m) => <option key={m}>{m}</option>)}</select></label>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500"><span role="status">{visible.length} firms · researched 11 September 2026</span>{(query || cap || movement) && <Link href={ecosystemHref({ lens: view })} className="font-semibold text-[#0755A5] underline">Clear filters</Link>}<span>ANZ practice size is not group headcount.</span></div>
      <div className={`grid items-start gap-4 ${view !== 'people' ? 'xl:grid-cols-[minmax(0,1fr)_350px]' : 'lg:grid-cols-[minmax(250px,.75fr)_minmax(0,1.65fr)]'}`}>
        <section className="min-w-0">
          {view === 'people' && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3"><h2 className="text-xs font-semibold">Choose a practice</h2><p className="mt-1 text-[11px] text-slate-500">Search a person to follow their career across firms.</p></div>
            <div className="thin-scroll max-h-[580px] overflow-y-auto">{visible.map((c) => <Link key={c.id} href={href({ firm: c.id, person: undefined })} aria-current={selected?.id === c.id ? 'true' : undefined} className={`block border-b border-slate-100 border-l-[3px] p-4 ${selected?.id === c.id ? 'border-l-[#F5A623] bg-[#EEF5FC]' : 'border-l-transparent hover:bg-slate-50'}`}><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">{c.name}</span><Signal id={c.id} /></div><p className="mt-1 text-xs text-slate-500">{c.kind}</p><p className="mt-2 text-xs leading-relaxed text-slate-600">{companyPeople(c.id).map((p) => p.name).join(' · ') || 'Named leadership not yet established in this research.'}</p></Link>)}</div>
          </div>}
          {view === 'capability' && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4"><h2 className="text-sm font-semibold">Published scope, with local proof kept visible.</h2><p className="mt-2 text-xs leading-relaxed text-slate-500"><strong className="text-[#0755A5]">●</strong> ANZ offer · <strong className="text-emerald-700">✓</strong> Named ANZ client · <strong>G</strong> APAC/global only · <span>— not established here</span></p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50"><tr><th className="sticky left-0 z-10 min-w-[140px] bg-slate-50 p-3">Practice</th>{CAPABILITIES.map((c) => <th key={c} className="max-w-[95px] p-2 text-center text-[10px] font-medium text-slate-500">{c === 'Data / Integration / AI' ? 'Data / Int. / AI' : c}</th>)}</tr></thead><tbody>{visible.map((c) => <tr key={c.id} className={`border-t border-slate-100 ${selected?.id === c.id ? 'bg-blue-50/70' : ''}`}><th className="sticky left-0 bg-white p-3 font-semibold"><Link href={href({ firm: c.id })} className="text-[#0755A5] hover:underline">{c.name}</Link></th>{CAPABILITIES.map((capability) => {
              const claims = c.capabilities.filter((f) => f.capability === capability);
              const local = claims.find((f) => f.scope === 'ANZ');
              const proof = ANZ_CUSTOMERS.some((x) => x.companyId === c.id && x.capabilities.includes(capability));
              const label = proof ? 'Named ANZ client' : local ? 'Published ANZ offer' : claims.length ? 'APAC or global scope only' : 'Not established in this research';
              return <td key={capability} className="p-1 text-center">{claims.length || proof ? <Link href={href({ firm: c.id })} aria-label={`${c.name}, ${capability}: ${label}`} title={label} className={`inline-block rounded p-2 font-bold hover:bg-blue-100 ${proof ? 'text-emerald-700' : local ? 'text-[#0755A5]' : 'text-slate-400'}`}>{proof ? '✓' : local ? '●' : 'G'}</Link> : <span className="text-slate-300" aria-label={label}>—</span>}</td>;
            })}</tr>)}</tbody></table></div>
          </div>}
          {view === 'movement' && <div className="space-y-3"><div className="rounded-xl bg-[#0755A5] p-4 text-white"><h2 className="text-sm font-semibold">Capability is being assembled in different ways.</h2><p className="mt-2 text-xs leading-relaxed text-blue-100">Signals from the last 18 months, plus undated current observations. Earlier acquisitions and career steps stay in People Power.</p></div>{events.map((e) => <EventCard key={e.id} event={e} href={href} />)}{!events.length && <Empty />}</div>}
          {view !== 'movement' && !visible.length && <Empty />}
        </section>
        <div ref={detail} className="min-w-0 scroll-mt-20">{selected && !selected.historical && !visible.some((c) => c.id === selected.id) && <p className="mb-2 rounded-lg bg-white p-3 text-xs text-slate-500">This profile is outside the current filters. <Link href={ecosystemHref({ lens: view, firm: selected.id })} className="text-[#0755A5] underline">Clear filters</Link></p>}{selected && <CompanyDetail company={selected} view={view} personId={params.get('person')} href={href} />}</div>
      </div>
      <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500"><summary className="cursor-pointer font-semibold text-slate-700">How to read this research</summary><div className="mt-3 max-w-4xl space-y-2"><p>This is a selected ANZ intelligence layer, not a ranking or a complete census. Sources stay beside the facts. “Our reading” is Compound’s interpretation, not a company claim.</p><p>Movement labels use the latest dated directional signal within 18 months of 11 September 2026. APAC signals retain their regional label; parent/global expansion does not establish ANZ growth. An acquisition labels its target, not its buyer. Undated observations remain visible but do not create a trend.</p><p>One departure does not establish contraction. No recent signal means insufficient dated evidence here. Size remains unestablished where public material does not isolate the ANZ Workday practice. Workday GO inclusion does not certify every capability in the matrix.</p><p>Customer examples establish the named engagement only. Career steps are selected milestones; gaps are not filled with assumed employment or ownership relationships. The global directory remains a separate, dated view of published partner coverage.</p></div></details>
    </main>
  </div>;
}

function Empty() { return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm"><p className="font-semibold">No matching evidence in this research.</p><p className="mt-2 text-slate-500">Try a different person or remove a filter. Missing evidence isn’t evidence of decline.</p></div>; }

function EventCard({ event: e, href }: { event: AnzEvent; href: (v: Record<string, string | undefined>) => string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500"><span>{e.dateLabel}</span><span>· {e.scope}</span><span className="ml-auto rounded bg-slate-100 px-2 py-1">{e.type}</span></div><h3 className="mt-2 text-base font-semibold tracking-tight">{e.title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{e.text}</p><p className="mt-2 text-xs leading-relaxed"><span className="font-semibold text-[#0755A5]">Why it matters </span>{e.implication}</p><div className="mt-3 flex flex-wrap gap-2">{e.companyIds.map((id) => <Link key={id} href={href({ firm: id })} className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-[#0755A5]">{anzCompany(id)?.name}</Link>)}</div><p className="mt-3 text-[10px]"><Evidence fact={e} /></p></article>;
}

function CompanyDetail({ company: c, view, personId, href }: { company: AnzCompany; view: string; personId: string | null; href: (v: Record<string, string | undefined>) => string }) {
  const people = peopleInLineage(c.id);
  const lineage = ANZ_LINEAGES.find((l) => l.companyIds.includes(c.id));
  const state = companyMovement(c.id);
  const customers = ANZ_CUSTOMERS.filter((x) => x.companyId === c.id);
  return <article className="overflow-hidden rounded-xl border border-[#D7E3F0] bg-white">
    <header className="border-b border-[#D7E3F0] bg-[#EAF2FC] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#577CA5]">{c.kind}</p>{!c.historical && <Signal id={c.id} />}</div><h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0755A5]">{c.name}</h2><p className="mt-3 text-sm leading-relaxed">{c.thesis}</p><p className="mt-2 text-[10px] text-[#6484A8]">Our reading · grounded in the sources below</p></header>
    <div className="space-y-5 p-5 sm:p-6">
      <details open={view !== 'people'} className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-xs font-semibold">Company context · backing and ANZ scope</summary><dl className="mt-3 grid gap-4 text-xs sm:grid-cols-2"><div><dt className="font-semibold text-slate-500">Backing / origin</dt><dd className="mt-1 leading-relaxed">{c.owner.text} <Evidence fact={c.owner}>Source</Evidence></dd></div><div><dt className="font-semibold text-slate-500">ANZ presence</dt><dd className="mt-1 leading-relaxed">{c.presence.text} <Evidence fact={c.presence}>Source</Evidence></dd></div>{c.founded && <div><dt className="font-semibold text-slate-500">Formation</dt><dd className="mt-1">{c.founded.text} <Evidence fact={c.founded}>Source</Evidence></dd></div>}<div><dt className="font-semibold text-slate-500">ANZ Workday practice size</dt><dd className="mt-1 leading-relaxed">{c.size ? <>{c.size.text} <Evidence fact={c.size}>Source</Evidence></> : 'Not publicly established in this research.'}</dd></div><div><dt className="font-semibold text-slate-500">Customer focus · our reading</dt><dd className="mt-1">{c.segment}</dd></div></dl></details>
      {c.go && <p className="rounded-lg border border-[#F2D8A9] bg-[#FFF9ED] p-3 text-xs leading-relaxed"><span className="font-semibold text-amber-800">Workday GO </span>{c.go.text} <Evidence fact={c.go}>Workday source</Evidence></p>}
      {view === 'people' && <>
        {lineage && <section className="rounded-lg border border-slate-200 p-4"><h3 className="text-sm font-semibold">{lineage.title}</h3><ol className="mt-3 space-y-3 border-l-2 border-[#F5A623] pl-4">{lineage.eventIds.map((id) => ANZ_EVENTS.find((e) => e.id === id)!).map((e) => <li key={e.id}><p className="text-[10px] text-slate-500">{e.dateLabel} · {e.type}</p><p className="mt-1 text-xs font-semibold">{e.title}</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">{e.text} <Evidence fact={e}>Source</Evidence></p></li>)}</ol><p className="mt-3 text-xs leading-relaxed text-[#0755A5]">{lineage.reading}</p></section>}
        <section><h3 className="text-sm font-semibold">People & career connections</h3>{!people.length && <p className="mt-2 text-xs text-slate-500">A current named ANZ Workday leader is not established in the reviewed sources.</p>}<div className="mt-3 space-y-3">{people.map((p) => <details key={p.id} open={personId === p.id || people.length === 1} className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold">{p.name}<span className="mt-1 block text-[11px] font-normal text-slate-500">{p.companyId !== c.id ? 'Previously here · now ' : ''}{p.role} · {anzCompany(p.companyId)?.name}</span></summary><p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[#0755A5]">{p.function} · {p.domain}</p><p className="mt-2 text-xs leading-relaxed">{p.reading}</p><p className="mt-2 text-[10px]"><Evidence fact={p.current}>Current role source</Evidence></p><ol className="mt-3 space-y-3 border-l border-slate-200 pl-3">{p.career.map((step, i) => <li key={i}><p className="text-[10px] text-slate-400">{step.when}</p><Link href={href({ firm: step.companyId, person: p.id })} className="text-xs font-semibold text-[#0755A5] hover:underline">{anzCompany(step.companyId)?.name}</Link><p className="text-[11px] text-slate-500">{step.role} · <Evidence fact={step}>Source</Evidence></p></li>)}</ol></details>)}</div></section>
      </>}
      {view === 'capability' && <section><h3 className="text-sm font-semibold">What the evidence supports</h3><ul className="mt-3 space-y-3">{c.capabilities.map((f, i) => <li key={i} className="border-b border-slate-100 pb-3 text-xs"><div className="flex justify-between gap-2"><span className="font-semibold">{f.capability}</span><span className="text-[10px] text-slate-400">{f.scope}</span></div><p className="mt-1 leading-relaxed text-slate-500">{f.text} <Evidence fact={f}>Source</Evidence></p></li>)}</ul>{!c.capabilities.length && <p className="mt-2 text-xs text-slate-500">Local Workday capability is not established here. See the global directory for published group scope.</p>}{customers.length > 0 && <div className="mt-4"><h4 className="text-xs font-semibold text-emerald-800">Named local delivery</h4>{customers.map((x) => <p key={x.id} className="mt-2 text-xs leading-relaxed"><strong>{x.name}.</strong> {x.fact.text} <Evidence fact={x.fact}>Case study</Evidence></p>)}</div>}</section>}
      {view === 'movement' && <section><h3 className="text-sm font-semibold">Latest directional signal</h3>{state.event ? <div className="mt-3"><EventCard event={state.event} href={href} /></div> : <p className="mt-2 text-xs leading-relaxed text-slate-500">No dated directional signal in the last 18 months of this research. That does not establish stability or decline.</p>}<p className="mt-3 text-xs text-slate-500">{companyEvents(c.id).length} sourced moments in this company’s history.</p></section>}
      <section className="border-t border-slate-200 pt-4"><h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#0755A5]">What would change the reading?</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{c.watch}</p></section>
      {c.directorySlug && <Link href={`/atlas/workday?scope=global&partner=${c.directorySlug}`} className="block text-xs font-semibold text-[#0755A5] underline underline-offset-4">Published global partner profile ↗</Link>}
    </div>
  </article>;
}
