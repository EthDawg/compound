'use client';

import Link from 'next/link';
import type { AnzCompany, AnzEvent, Ecosystem } from '@/lib/data/anz-ecosystem';
import { careerContext, eventTiming, movementWindow, type MovementReading } from '@/lib/data/market-movement';

type Href = (values: Record<string, string | undefined>) => string;
const link = 'inline-flex min-h-11 items-center rounded-md px-3 py-2 text-xs font-semibold text-[var(--eco-link)] underline underline-offset-4 hover:bg-[var(--eco-soft)]';
const tones: Record<string, string> = {
  Building: 'bg-amber-50 text-amber-800', Growing: 'bg-emerald-50 text-emerald-800',
  Contracting: 'bg-rose-50 text-rose-800', 'Mixed signals': 'bg-orange-50 text-orange-900',
};
const date = (value: Date) => value.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const snapshot = (data: Ecosystem) => date(new Date(`${data.asOf}T00:00:00Z`));

export function MovementBadges({ reading, quiet = false }: { reading: MovementReading; quiet?: boolean }) {
  const badge = 'inline-flex rounded-full px-2 py-1 text-[10px] font-semibold';
  return <span className="inline-flex flex-wrap gap-1">
    {reading.direction && <span className={`${badge} ${tones[reading.direction]}`}>ANZ · {reading.direction}</span>}
    {!!reading.ownershipSignals.length && <span className={`${badge} bg-violet-50 text-violet-800`}>Ownership changed</span>}
    {!reading.direction && !!reading.regionalSignals.length && <span className={`${badge} bg-sky-50 text-sky-800`}>APAC context</span>}
    {!quiet && !reading.direction && !reading.ownershipSignals.length && !reading.regionalSignals.length && <span className={`${badge} bg-slate-100 text-slate-500`}>No qualifying signal</span>}
  </span>;
}

export function MovementMethod({ data }: { data: Ecosystem }) {
  const window = movementWindow(data.asOf)!;
  return <section className="rounded-xl border border-slate-200 bg-white p-5 text-xs leading-relaxed" aria-label="Reading market movement">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--eco-link)]">How to read the movement</p>
    <h2 className="mt-2 text-lg font-semibold">Direction, ownership, then evidence.</h2>
    <p className="mt-3 text-slate-600">Choose a firm to see what supports the reading and what would change it.</p>
    <dl className="mt-4 space-y-3">
      <div><dt className="font-semibold">ANZ direction</dt><dd className="mt-1 text-slate-500">Building marks a sourced local practice or capability build. Growing needs explicit evidence of growth. Opposing local signals stay visible as mixed.</dd></div>
      <div><dt className="font-semibold">Ownership</dt><dd className="mt-1 text-slate-500">A completed ownership change applies to its target. It does not establish a larger local team.</dd></div>
      <div><dt className="font-semibold">Regional context</dt><dd className="mt-1 text-slate-500">APAC expansion may matter to ANZ. It does not, on its own, establish ANZ growth.</dd></div>
    </dl>
    <p className="mt-4 border-t border-slate-200 pt-3 text-slate-500">Recent window: {date(window.start)}–{snapshot(data)}. This is a fixed research snapshot. A missing signal does not establish stability or decline.</p>
  </section>;
}

export function AnzEventCard({ data, event: e, href, unplaced = false, lineage = false }: { data: Ecosystem; event: AnzEvent; href: Href; unplaced?: boolean; lineage?: boolean }) {
  const people = e.personIds.flatMap(id => { const person = data.ANZ_PEOPLE.find(p => p.id === id); return person ? [person] : []; });
  const timing = eventTiming(e.date, data.asOf);
  return <article className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500"><span>{e.dateLabel}</span><span>· {e.scope}</span><span className="ml-auto rounded bg-slate-100 px-2 py-1">{e.type}</span></div>
    {lineage && <p className="mt-2 text-[10px] font-semibold text-[var(--eco-link)]">Lineage context · predecessor or related firm</p>}
    {unplaced && <p className="mt-2 text-[11px] text-amber-800">{timing === 'uncertain' ? 'The recorded date spans the recent-window boundary. Timing is too broad to count as recent.' : 'Event timing is not established here. Kept as context; not counted as recent.'}</p>}
    <h3 className="mt-2 text-base font-semibold tracking-tight">{e.title}</h3>
    <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.text}</p>
    <p className="mt-2 text-xs leading-relaxed"><span className="font-semibold text-[var(--eco-link)]">Why it matters </span>{e.implication}</p>
    <div className="mt-3 flex flex-wrap gap-2">{e.companyIds.map(id => <Link key={id} href={href({ firm: id, person: undefined })} className={`${link} border border-slate-200 no-underline`}>{data.anzCompany(id)?.name}</Link>)}</div>
    {!!people.length && <div className="mt-3 border-t border-slate-100 pt-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Career context</p><div className="mt-1 flex flex-wrap gap-1">{people.map(p => <Link key={p.id} href={href(careerContext(p))} className={link}>{p.name} →</Link>)}</div></div>}
    <a href={e.url} target="_blank" rel="noreferrer" className={`${link} mt-2 max-w-full px-0`}>{e.source} ↗</a>
  </article>;
}

export function CompanyMovementReading({ data, company, href }: { data: Ecosystem; company: AnzCompany; href: Href }) {
  const reading = data.companyMovement(company.id);
  const groups = [
    { title: 'ANZ operating direction', events: reading.localSignals, empty: 'No qualifying local directional signal in this window.' },
    { title: 'Ownership change', events: reading.ownershipSignals, empty: 'No dated, completed ownership change in this window. See backing for the ownership on record.' },
    { title: 'APAC context', events: reading.regionalSignals, empty: '' },
  ];
  return <section aria-label={`${company.name} movement reading`}>
    <h3 className="text-sm font-semibold">What supports the reading?</h3>
    <p className="mt-1 text-[11px] text-slate-500">18 months to {snapshot(data)} · our synthesis</p>
    {reading.direction === 'Mixed signals' && <p className="mt-3 rounded-lg bg-orange-50 p-3 text-xs leading-relaxed text-orange-900">The recorded local signals point in different directions. They do not establish a net gain or loss.</p>}
    <div className="mt-4 space-y-4">{groups.filter(g => g.events.length || g.empty).map(g => <div key={g.title}>
      <h4 className="text-[11px] font-semibold text-[var(--eco-link)]">{g.title}</h4>
      {!g.events.length ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{g.empty}</p> : <ul className="mt-2 space-y-3">{g.events.map(e => <li key={e.id} className="border-l-2 border-slate-200 pl-3"><p className="text-[10px] text-slate-500">{e.dateLabel} · {e.scope}</p><p className="mt-1 text-xs font-semibold">{e.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{e.implication}</p><a href={e.url} target="_blank" rel="noreferrer" className={`${link} px-0`}>Read source ↗</a></li>)}</ul>}
    </div>)}</div>
    <Link href={`${href({ lens: 'movement', firm: company.id, period: 'all' })}#movement-timeline`} className={`${link} mt-3 px-0`}>Follow the full timeline →</Link>
  </section>;
}

export function MarketMovement({ data, visible, focusedFirm, query, cap, movement, history, href }: { data: Ecosystem; visible: AnzCompany[]; focusedFirm?: AnzCompany; query: string; cap: string; movement: string; history: boolean; href: Href }) {
  const timeline = data.movementTimeline(query, cap, movement, history, focusedFirm?.id);
  const readings = visible.map(company => ({ company, reading: data.companyMovement(company.id) }));
  const hasSignal = (r: MovementReading) => !!(r.direction || r.ownershipSignals.length || r.regionalSignals.length);
  const signalled = readings.filter(r => hasSignal(r.reading));
  const unclassified = readings.filter(r => !hasSignal(r.reading));
  return <div className="space-y-4">
    {!focusedFirm && <section id="current-firm-readings" tabIndex={-1} className="outline-none scroll-mt-36 rounded-xl border border-slate-200 bg-white p-4 sm:scroll-mt-20" aria-label="Current firm readings">
      <h2 className="text-sm font-semibold">Where the evidence points</h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">Local direction and ownership are separate. Choose a firm to follow its evidence.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{signalled.map(({ company, reading }) => <Link key={company.id} href={href({ firm: company.id, person: undefined })} className="rounded-lg border border-slate-200 p-3 hover:border-[var(--eco-link)] hover:bg-[var(--eco-soft)]"><span className="block text-sm font-semibold text-[var(--eco-link)]">{company.name} →</span><span className="mt-2 block"><MovementBadges reading={reading} /></span><span className="mt-2 block text-xs leading-relaxed text-slate-600">{reading.event?.title ?? reading.regionalSignals[0]?.title}</span></Link>)}</div>
      {!!unclassified.length && <details open={!signalled.length} className="mt-3 rounded-lg bg-slate-50 px-3"><summary className="min-h-11 cursor-pointer py-3 text-xs font-semibold text-slate-600">{unclassified.length} {unclassified.length === 1 ? 'firm without' : 'firms without'} a qualifying signal</summary><p className="pb-2 text-xs leading-relaxed text-slate-500">The reviewed evidence does not establish a recent direction. These firms may still have substantial local capability.</p><div className="flex flex-wrap gap-1 pb-3">{unclassified.map(({ company }) => <Link key={company.id} href={href({ firm: company.id, person: undefined })} className={link}>{company.name}</Link>)}</div></details>}
      {!visible.length && <p className="mt-3 text-xs text-slate-500">No firms match these filters. Try a name or clear a filter.</p>}
    </section>}
    <section id="movement-timeline" tabIndex={-1} aria-label="Movement timeline" className="outline-none scroll-mt-36 space-y-3 sm:scroll-mt-20">
      <header className="rounded-xl bg-[var(--eco-link)] p-4 text-white">
        <h2 className="text-sm font-semibold">{focusedFirm ? `${focusedFirm.name} · what changed` : 'Follow the evidence'}</h2>
        {focusedFirm && <Link href={`${href({ firm: undefined, person: undefined })}#current-firm-readings`} className="inline-flex min-h-11 items-center text-xs underline underline-offset-4">Return to matching firms</Link>}
        <p className="mt-2 text-xs leading-relaxed text-white/85">{movement ? `Firms matching “${movement}” keep their wider context in the timeline. ` : ''}Dates and scope stay attached. Full history includes the recorded company lineage.</p>
        <nav aria-label="Timeline period" className="mt-3 flex flex-wrap gap-2">{[{ id: 'recent', label: 'Recent signals' }, { id: 'all', label: 'Full history' }].map(v => <Link key={v.id} href={href({ period: v.id })} aria-current={(history ? 'all' : 'recent') === v.id ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-md px-3 text-xs font-semibold ${(history ? 'all' : 'recent') === v.id ? 'bg-white text-[var(--eco-link)]' : 'text-white underline underline-offset-4 hover:bg-white/10'}`}>{v.label}</Link>)}</nav>
        <p className="mt-2 text-[11px] text-white/80">{timeline.dated.length} dated {timeline.dated.length === 1 ? 'event' : 'events'} · {history ? `through ${snapshot(data)}` : `18 months to ${snapshot(data)}`}</p>
      </header>
      {timeline.dated.map(e => <AnzEventCard key={e.id} data={data} event={e} href={href} lineage={!!focusedFirm && !e.companyIds.includes(focusedFirm.id)} />)}
      {!timeline.dated.length && <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">No dated events in this selection.{!history && ' Full history may include earlier context.'} Missing evidence is not evidence of decline.</p>}
    </section>
    {!!timeline.unplaced.length && <section aria-label="Timing not established" className="space-y-3">
      <div className="px-1 pt-3"><h2 className="text-sm font-semibold">Timing not established</h2><p className="mt-1 text-xs leading-relaxed text-slate-500">{timeline.unplaced.length} contextual {timeline.unplaced.length === 1 ? 'record' : 'records'} kept outside the dated timeline. A publication or research date is not a substitute for an event date.</p></div>
      {timeline.unplaced.map(e => <AnzEventCard key={e.id} data={data} event={e} href={href} unplaced lineage={!!focusedFirm && !e.companyIds.includes(focusedFirm.id)} />)}
    </section>}
  </div>;
}
