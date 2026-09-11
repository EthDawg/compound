'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, type CSSProperties } from 'react';
import { CompoundBar } from './compound-bar';
import { AtlasMaps } from './atlas-maps';
import { capabilityColumns, careerAtCompany, type Ecosystem, type AnzCompany, type AnzEvent, type Fact, type Movement } from '@/lib/data/anz-ecosystem';
import {PracticeBrief,EngagementProof} from './practice-brief';
import { practiceLinks } from '@/lib/ecosystem-index';
const EcosystemContext = createContext<Ecosystem | null>(null);
const useEcosystem = () => useContext(EcosystemContext)!;
export function AnzEcosystem({ ecosystem }: { ecosystem: Ecosystem }) {
 return <EcosystemContext.Provider value={ecosystem}><EcosystemView /></EcosystemContext.Provider>;
}

const VIEWS = [
  { id: 'people', label: 'People Power', question: 'Who builds the capability?' },
  { id: 'capability', label: 'Capability Map', question: 'What is evidenced in ANZ?' },
  { id: 'movement', label: 'Market Movement', question: 'What is changing?' },
];
const MOVEMENTS: Movement[] = ['Building', 'Growing', 'Acquired', 'Contracting'];
const tone: Record<string, string> = { Building: 'bg-amber-50 text-amber-800', Growing: 'bg-emerald-50 text-emerald-800', Acquired: 'bg-violet-50 text-violet-800', Contracting: 'bg-rose-50 text-rose-800', 'No recent signal': 'bg-slate-100 text-slate-500' };
const field = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[var(--eco-link)] focus:ring-2 focus:ring-blue-100';

function Evidence({ fact, children }: { fact: Fact; children?: React.ReactNode }) {
  return <a href={fact.url} target="_blank" rel="noreferrer" title={fact.source} className="text-[var(--eco-link)] underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600">{children ?? fact.source} ↗</a>;
}
function Signal({ id }: { id: string }) {
  const { companyMovement } = useEcosystem();
  const state = companyMovement(id);
  if (state.label === 'No recent signal') return null;
  return <span title={state.event ? `${state.event.dateLabel}: ${state.event.title}` : 'No dated directional signal in the past 18 months in this research.'} className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${tone[state.label]}`}>{state.label}</span>;
}

function EcosystemView() {
  const data = useEcosystem();
  const { CAPABILITIES, ANZ_PEOPLE, searchAnz, anzCompany, ecosystemHref, movementEvents, companyPeople } = data;
  const params = useSearchParams();
  const view = VIEWS.some((v) => v.id === params.get('lens')) ? params.get('lens')! : 'people';
  const query = params.get('find') ?? '', cap = params.get('cap') ?? '', movement = params.get('signal') ?? '';
  const evidence = params.get('evidence') ?? '';
  const columns = ['services','all'].includes(params.get('columns') ?? '') ? params.get('columns')! : 'domains';
  const columnGroups = data.capabilityGroups ?? [{label:'Capabilities',values:CAPABILITIES}];
  const { groups: shownGroups, capabilities: shownCaps, extra: extraCap } = capabilityColumns(columnGroups, columns, cap);
  const visible = searchAnz(query, cap, movement).filter((c) => view !== 'capability' || !evidence || (cap ? [cap] : shownCaps).some((k) => {
    const level = data.capabilityEvidence(c.id,k).key;
    return evidence === 'named' ? level === 'named' : ['named','anonymous','local'].includes(level);
  }));
  const selected = anzCompany(params.get('firm') ?? '') ?? visible[0];
  const detail = useRef<HTMLDivElement>(null);
  const href = (values: Record<string, string | undefined>) => ecosystemHref(values, params.toString());
  const update = (values: Record<string, string | undefined>) => window.history.replaceState(null, '', ecosystemHref(values, window.location.search));
  useEffect(() => {
    if (params.get('firm') && window.matchMedia(view !== 'people' ? '(max-width: 1279px)' : '(max-width: 1023px)').matches) detail.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [params.get('firm'), view]);
  const history = params.get('period') === 'all';
  const focusedFirm = anzCompany(params.get('firm') ?? '');
  const events = movementEvents(query, cap, movement, history).filter((e) => !focusedFirm || e.companyIds.includes(focusedFirm.id));
  const focusedPerson = params.get('person') ?? (query.trim() ? ANZ_PEOPLE.find((p) => p.name.toLowerCase().includes(query.toLowerCase().trim()))?.id ?? null : null);
  const vars = { '--eco-link': data.id === 'servicenow' ? '#245A48' : '#0755A5', '--eco-accent': data.id === 'servicenow' ? '#81B5A1' : '#F5A623', '--eco-soft': data.id === 'servicenow' ? '#EAF4EE' : '#EEF5FC', '--eco-page': data.id === 'servicenow' ? '#F4F7F3' : '#F4F7FB' } as CSSProperties;

  return <div style={vars} className="min-h-screen bg-[var(--eco-page)] text-[#192A3B]">
    <CompoundBar activeId={data.id} recentId={params.get('firm') ?? data.id} />
    <main className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6">
      <AtlasMaps active={data.id} />
      <header className="flex flex-wrap items-end justify-between gap-4 py-6">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--eco-link)]">{data.name} ecosystem · Australia & New Zealand</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{data.title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{data.intro}</p></div>
        {data.id === 'workday' && <Link href="/atlas/workday?scope=global" className="text-xs font-semibold text-[var(--eco-link)] underline underline-offset-4">Global partner directory ↗</Link>}
      </header>
      {data.insights && <section aria-label="Market reading" className="mb-5"><p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Market reading · our synthesis</p><div className="grid gap-2 md:grid-cols-3">{data.insights.map((insight) => <details key={insight.title} className="rounded-lg border border-slate-200 bg-white p-3 text-xs"><summary className="cursor-pointer font-semibold text-[var(--eco-link)]">{insight.title}</summary><p className="mt-3 leading-relaxed text-slate-600">{insight.text}</p><p className="mt-3 leading-relaxed"><strong>Ask: </strong>{insight.ask}</p><div className="mt-3 flex flex-wrap gap-2">{insight.companyIds.map((id) => <Link key={id} href={href({firm:id})} className="font-semibold text-[var(--eco-link)] underline">{anzCompany(id)?.name}</Link>)}</div></details>)}</div></section>}
      <nav aria-label="ANZ intelligence views" className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {VIEWS.map((v) => <Link key={v.id} href={href({ lens: v.id })} aria-current={view === v.id ? 'page' : undefined} className={`rounded-lg border-b-[3px] px-2 py-3 sm:px-4 ${view === v.id ? 'border-[var(--eco-accent)] bg-[var(--eco-soft)] text-[var(--eco-link)]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}><span className="block text-xs font-semibold sm:text-sm">{v.label}</span><span className="mt-1 hidden text-[11px] font-normal sm:block">{v.question}</span></Link>)}
      </nav>
      <div className="grid gap-2 py-4 sm:grid-cols-[minmax(200px,1fr)_180px_170px]">
        <label><span className="sr-only">Find a company, person, customer or former firm</span><input type="search" value={query} onChange={(e) => update({ find: e.target.value, firm: undefined, person: undefined, customer: undefined, proof: undefined })} className={field} placeholder="Company, person, customer or former firm…" /></label>
        <label><span className="sr-only">ANZ capability</span><select className={field} value={cap} onChange={(e) => update({ cap: e.target.value, firm: undefined })}><option value="">Any ANZ capability</option>{data.capabilityGroups ? data.capabilityGroups.map((g) => <optgroup key={g.label} label={g.label}>{g.values.map((c) => <option key={c}>{c}</option>)}</optgroup>) : CAPABILITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label><span className="sr-only">Market signal</span><select className={field} value={movement} onChange={(e) => update({ signal: e.target.value, firm: undefined })}><option value="">Any movement</option>{MOVEMENTS.map((m) => <option key={m}>{m}</option>)}</select></label>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500"><span role="status">{visible.length} firms · researched 11 September 2026</span>{(query || cap || movement || evidence) && <Link href={ecosystemHref({ lens: view })} className="font-semibold text-[var(--eco-link)] underline">Clear filters</Link>}<span>ANZ practice size is not group headcount.</span></div>
      <div className={`grid items-start gap-4 ${view !== 'people' ? 'xl:grid-cols-[minmax(0,1fr)_350px]' : 'lg:grid-cols-[minmax(250px,.75fr)_minmax(0,1.65fr)]'}`}>
        <section className="min-w-0">
          {view === 'people' && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3"><h2 className="text-xs font-semibold">Choose a practice</h2><p className="mt-1 text-[11px] text-slate-500">Search a person to follow their career across firms.</p></div>
            <div className="thin-scroll max-h-[580px] overflow-y-auto">{visible.map((c) => <Link key={c.id} href={href({ firm: c.id, person: undefined })} aria-current={selected?.id === c.id ? 'true' : undefined} className={`block border-b border-slate-100 border-l-[3px] p-4 ${selected?.id === c.id ? 'border-l-[var(--eco-accent)] bg-[var(--eco-soft)]' : 'border-l-transparent hover:bg-slate-50'}`}><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">{c.name}</span><Signal id={c.id} /></div><p className="mt-1 text-xs text-slate-500">{c.kind}{c.historical ? ' · Historical name' : ''}{c.partnerStatus ? ` · ${c.partnerStatus.text}` : ''}</p><p className="mt-2 text-xs leading-relaxed text-slate-600">{companyPeople(c.id).filter((p) => !p.roleStatus).map((p) => p.name).join(' · ') || c.thesis.split('. ')[0] + '.'}</p></Link>)}</div>
          </div>}
          {view === 'capability' && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4"><h2 className="text-sm font-semibold">Compare the role, then the domain.</h2><p className="mt-2 text-xs leading-relaxed text-slate-500">Service roles describe how a firm works. Domains describe what it works on. A tick in each does not prove every combination.</p><div className="mt-3 flex flex-wrap items-center gap-2">{[{id:'services',name:'Service roles'},{id:'domains',name:data.id==='workday'?'Product domains':'Workflow domains'},{id:'all',name:'All columns'}].map((g) => <Link key={g.id} href={href({columns:g.id})} aria-current={columns===g.id?'true':undefined} className={`inline-flex min-h-11 items-center rounded-md px-3 py-2 text-xs font-semibold ${columns===g.id?'bg-[var(--eco-soft)] text-[var(--eco-link)]':'bg-slate-50 text-slate-500'}`}>{g.name}</Link>)}<label className="ml-auto"><span className="sr-only">Evidence threshold</span><select value={evidence} onChange={(e)=>update({evidence:e.target.value,firm:undefined})} className="min-h-11 max-w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-xs"><option value="">All evidence</option><option value="local">ANZ offers or cases</option><option value="named">Named ANZ customers</option></select></label></div><p className="mt-3 text-[11px] leading-relaxed text-slate-500"><strong className="text-emerald-700">✓</strong> Named case · <strong className="text-emerald-700">◐</strong> Anonymous case · <strong className="text-[var(--eco-link)]">●</strong> ANZ offer · <strong>◇</strong> Credentials only · <strong>P</strong> People signal · <strong>G</strong> Regional/global · — unknown</p></div>
            {shownCaps.includes(cap) && <p className="border-b border-slate-100 px-4 py-3 text-xs text-[var(--eco-link)]">Filtering by <strong>{cap}</strong>.{extraCap ? ' Its column stays beside the practice while you compare this group.' : ' The matching column is highlighted below.'}</p>}
            <div className="overflow-x-auto"><table className={`w-full text-left text-xs ${columns==='all'?'min-w-[800px]':'min-w-[540px]'}`}><caption className="sr-only">{data.name} ANZ capabilities and evidence. Select a cell to inspect the source in its company profile.</caption><thead className="bg-slate-50">{(columns==='all'||extraCap)&&<tr><th/>{shownGroups.map((g)=><th key={g.label} colSpan={g.values.length} className="border-l border-slate-200 px-2 py-2 text-center text-[10px] font-semibold">{g.label}</th>)}</tr>}<tr><th scope="col" className="sticky left-0 z-10 min-w-[140px] bg-slate-50 p-3">Practice</th>{shownCaps.map((c)=><th scope="col" key={c} className={`max-w-[95px] p-2 text-center text-[10px] font-medium ${c===cap?'bg-[var(--eco-soft)] text-[var(--eco-link)]':'text-slate-500'}`}>{c==='Data / Integration / AI'?'Data / Int. / AI':c}</th>)}</tr></thead><tbody>{visible.map((c)=><tr key={c.id} className={`border-t border-slate-100 ${selected?.id===c.id?'bg-[var(--eco-soft)]':''}`}><th scope="row" className="sticky left-0 bg-white p-3 font-semibold"><Link href={href({firm:c.id})} className="text-[var(--eco-link)] hover:underline">{c.name}</Link></th>{shownCaps.map((capability)=>{
              const item=data.capabilityEvidence(c.id,capability);
              return <td key={capability} className={`p-1 text-center ${capability===cap?'bg-[var(--eco-soft)]':''}`}>{item.key==='unknown'?<span className="text-slate-300" aria-label={item.label}>—</span>:<Link href={href({firm:c.id,proof:capability,customer:undefined})} aria-label={`${c.name}, ${capability}: ${item.label}`} title={item.label} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded p-2 font-bold hover:bg-blue-100 ${['named','anonymous'].includes(item.key)?'text-emerald-700':item.key==='local'?'text-[var(--eco-link)]':'text-slate-400'}`}>{item.mark}</Link>}</td>;
            })}</tr>)}</tbody></table></div><p className="border-t border-slate-100 p-3 text-[10px] leading-relaxed text-slate-500">Evidence filters apply to the selected capability, or to at least one visible column when no capability is selected. A blank cell means this research has not established the claim.</p>
          </div>}
          {view === 'movement' && <div className="space-y-3"><div className="rounded-xl bg-[var(--eco-link)] p-4 text-white"><h2 className="text-sm font-semibold">{focusedFirm ? `${focusedFirm.name} · what changed` : "Capability is being assembled in different ways."}</h2>{focusedFirm && <Link href={href({firm:undefined})} className="mt-2 inline-block text-xs underline underline-offset-4">Return to all firms</Link>}<p className="mt-2 text-xs leading-relaxed text-white/80">Switch between recent signals and the full acquisition history. Dates and regional scope stay attached to each event.</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">{[{id:'recent',label:'Recent signals'},{id:'all',label:'Full history'}].map((v) => <Link key={v.id} href={href({period:v.id})} aria-current={(history ? 'all' : 'recent') === v.id ? 'page' : undefined} className={(history ? 'all' : 'recent') === v.id ? 'underline underline-offset-4' : 'opacity-70'}>{v.label}</Link>)}</div></div>{events.map((e) => <EventCard key={e.id} event={e} href={href} />)}{!events.length && <Empty />}</div>}
          {view !== 'movement' && !visible.length && <Empty />}
        </section>
        <div ref={detail} className="min-w-0 scroll-mt-20">{selected && !selected.historical && !visible.some((c) => c.id === selected.id) && <p className="mb-2 rounded-lg bg-white p-3 text-xs text-slate-500">This profile is outside the current filters. <Link href={ecosystemHref({ lens: view, firm: selected.id })} className="text-[var(--eco-link)] underline">Clear filters</Link></p>}{selected && <CompanyDetail company={selected} view={view} personId={focusedPerson} href={href} />}</div>
      </div>
      <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500"><summary className="cursor-pointer font-semibold text-slate-700">How to read this research</summary><div className="mt-3 max-w-4xl space-y-2"><p>This is a selected ANZ intelligence layer, not a ranking or a complete census. Sources stay beside the facts. “Our reading” is Compound’s interpretation, not a company claim.</p><p>Movement labels use the latest dated directional signal within 18 months of 11 September 2026. APAC signals retain their regional label; parent/global expansion does not establish ANZ growth. An acquisition labels its target, not its buyer. Undated observations remain visible but do not create a trend.</p><p>One departure does not establish contraction. No recent signal means insufficient dated evidence here. Size remains unestablished where public material does not isolate the ANZ {data.name} practice. {data.note}</p><p>Customer examples establish the named engagement only. Career steps are selected milestones; gaps are not filled with assumed employment or ownership relationships.</p></div></details>
    </main>
  </div>;
}

function Empty() { return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm"><p className="font-semibold">No matching evidence in this research.</p><p className="mt-2 text-slate-500">Try a different person or remove a filter. Missing evidence isn’t evidence of decline.</p></div>; }

function EventCard({ event: e, href }: { event: AnzEvent; href: (v: Record<string, string | undefined>) => string }) {
  const { anzCompany } = useEcosystem();
  return <article className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500"><span>{e.dateLabel}</span><span>· {e.scope}</span><span className="ml-auto rounded bg-slate-100 px-2 py-1">{e.type}</span></div><h3 className="mt-2 text-base font-semibold tracking-tight">{e.title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{e.text}</p><p className="mt-2 text-xs leading-relaxed"><span className="font-semibold text-[var(--eco-link)]">Why it matters </span>{e.implication}</p><div className="mt-3 flex flex-wrap gap-2">{e.companyIds.map((id) => <Link key={id} href={href({ firm: id })} className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-[var(--eco-link)]">{anzCompany(id)?.name}</Link>)}</div><p className="mt-3 text-[10px]"><Evidence fact={e} /></p></article>;
}

function CompanyDetail({ company: c, view, personId, href }: { company: AnzCompany; view: string; personId: string | null; href: (v: Record<string, string | undefined>) => string }) {
  const data = useEcosystem();
  const { peopleInLineage, ANZ_LINEAGES, ANZ_CUSTOMERS, ANZ_EVENTS, companyMovement, companyEvents, anzCompany } = data;
  const people = peopleInLineage(c.id);
  const elsewhere = practiceLinks(c.id).filter((p) => p.ecosystemId !== data.id);
  const lineage = ANZ_LINEAGES.find((l) => l.companyIds.includes(c.id));
  const state = companyMovement(c.id);
  const customers = ANZ_CUSTOMERS.filter((x) => x.companyId === c.id);
  const params = useSearchParams();
  const proof = params.get('proof') ?? '';
  const customer = params.get('customer') ?? '';
  const focused = !!proof || !!customer;
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <header className="border-b border-slate-200 bg-[var(--eco-soft)] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--eco-link)]">{c.kind}</p>{!c.historical && <Signal id={c.id} />}</div><h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--eco-link)]">{c.name}</h2><p className="mt-3 text-sm leading-relaxed">{c.thesis}</p><p className="mt-2 text-[10px] text-slate-500">Our reading · grounded in the sources below</p></header>
    <div className="space-y-5 p-5 sm:p-6">
      <PracticeBrief ecosystemId={data.id} companyId={c.id}/>
      {!!elsewhere.length && <p className="text-xs text-slate-500">Also researched in {elsewhere.map((p) => <Link key={p.href} href={p.href} className="ml-2 font-semibold text-[var(--eco-link)] underline">{p.ecosystemName} ↗</Link>)}</p>}
      {c.partnerStatus && <p className="text-xs text-slate-500"><Evidence fact={c.partnerStatus}>{c.partnerStatus.text}</Evidence><span className="mt-1 block text-[10px]">Programme designation · checked 11 September 2026</span></p>}
      <details open={view !== 'people'} className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-xs font-semibold">Backing & ANZ scope</summary><dl className={`mt-3 grid gap-4 text-xs ${view === 'people' ? 'sm:grid-cols-2' : ''}`}><div><dt className="font-semibold text-slate-500">Backing / origin</dt><dd className="mt-1 leading-relaxed">{c.owner.text} <Evidence fact={c.owner}>Source</Evidence></dd></div><div><dt className="font-semibold text-slate-500">ANZ presence</dt><dd className="mt-1 leading-relaxed">{c.presence.text} <Evidence fact={c.presence}>Source</Evidence></dd></div>{c.founded && <div><dt className="font-semibold text-slate-500">Formation</dt><dd className="mt-1">{c.founded.text} <Evidence fact={c.founded}>Source</Evidence></dd></div>}<div><dt className="font-semibold text-slate-500">ANZ {data.name} practice size</dt><dd className="mt-1 leading-relaxed">{c.size ? <>{c.size.text} <Evidence fact={c.size}>Source</Evidence></> : 'Not publicly established in this research.'}</dd></div><div><dt className="font-semibold text-slate-500">Customer focus · our reading</dt><dd className="mt-1">{c.segment}</dd></div></dl></details>
      {c.go && <p className="rounded-lg border border-[#F2D8A9] bg-[#FFF9ED] p-3 text-xs leading-relaxed"><span className="font-semibold text-amber-800">Workday GO </span>{c.go.text} <Evidence fact={c.go}>Workday source</Evidence></p>}
      {view === 'people' && <>

        <section><h3 className="text-sm font-semibold">People & career connections</h3>{!people.length && <p className="mt-2 text-xs text-slate-500">A current named ANZ {data.name} leader is not established in the reviewed sources.</p>}<div className="mt-3 space-y-3">{people.map((p) => <details key={p.id} open={personId === p.id || (people.length <= 2 && !p.roleStatus)} className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold">{p.name}<span className="mt-1 block text-[11px] font-normal text-slate-500">{p.companyId !== c.id && careerAtCompany(p,c.id).map((step,i) => <span key={i} className="mb-1 block text-slate-700">{step.role} · {c.name} · {step.when}</span>)}{p.roleStatus === 'historical' ? 'Historical role on record · ' : p.roleStatus === 'source snapshot' ? 'Published role · ' : 'Role on record · '}{p.role} · {anzCompany(p.companyId)?.name}</span></summary><p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[var(--eco-link)]">{p.function} · {p.domain}</p><p className="mt-2 text-xs leading-relaxed">{p.reading}</p><p className="mt-2 text-[10px]"><Evidence fact={p.current}>{p.roleStatus === 'historical' ? 'Historical source' : 'Role source'}</Evidence></p><ol className="mt-3 space-y-3 border-l border-slate-200 pl-3">{p.career.map((step, i) => <li key={i}><p className="text-[10px] text-slate-400">{step.when}</p><Link href={href({ firm: step.companyId, person: p.id })} className="text-xs font-semibold text-[var(--eco-link)] hover:underline">{anzCompany(step.companyId)?.name}</Link><p className="text-[11px] text-slate-500">{step.role} · <Evidence fact={step}>Source</Evidence></p></li>)}</ol></details>)}</div></section>
        {lineage && <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer text-sm font-semibold">{lineage.title}<span className="mt-1 block text-[11px] font-normal text-slate-500">{lineage.eventIds.length} sourced moments · expand the history</span></summary><ol className="mt-3 space-y-3 border-l-2 border-[var(--eco-accent)] pl-4">{lineage.eventIds.map((id) => ANZ_EVENTS.find((e) => e.id === id)!).map((e) => <li key={e.id}><p className="text-[10px] text-slate-500">{e.dateLabel} · {e.type}</p><p className="mt-1 text-xs font-semibold">{e.title}</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">{e.text} <Evidence fact={e}>Source</Evidence></p></li>)}</ol><p className="mt-3 text-xs leading-relaxed text-[var(--eco-link)]">{lineage.reading}</p></details>}
      </>}
      {view === 'capability' && <><EvidenceFocus company={c} href={href} /><details open={!focused}><summary className="cursor-pointer text-xs font-semibold text-slate-500">All evidence for {c.name}</summary><section className="mt-4"><h3 className="text-sm font-semibold">What the evidence supports</h3><ul className="mt-3 space-y-3">{c.capabilities.map((f, i) => <li key={i} className="border-b border-slate-100 pb-3 text-xs"><div className="flex justify-between gap-2"><span className="font-semibold">{f.capability}</span><span className="text-[10px] text-slate-400">{f.basis === 'credentials' ? `Credentials · ${f.scope}` : f.basis === 'people' ? `People signal · ${f.scope}` : f.scope}</span></div><p className="mt-1 leading-relaxed text-slate-500">{f.text} <Evidence fact={f}>Source</Evidence></p></li>)}</ul>{!c.capabilities.length && <p className="mt-2 text-xs text-slate-500">Local {data.name} capability is not established in the reviewed sources.</p>}{customers.length > 0 && <div className="mt-4"><h4 className="text-xs font-semibold text-emerald-800">Local delivery examples</h4>{customers.map((x) => <p key={x.id} className="mt-2 text-xs leading-relaxed"><strong>{x.name}.</strong> {x.fact.text} <Evidence fact={x.fact}>Source</Evidence></p>)}</div>}</section></details></>}
      {view === 'movement' && <section><h3 className="text-sm font-semibold">Latest directional signal</h3>{state.event ? <div className="mt-3"><EventCard event={state.event} href={href} /></div> : <p className="mt-2 text-xs leading-relaxed text-slate-500">No dated directional signal in the last 18 months of this research. That does not establish stability or decline.</p>}<p className="mt-3 text-xs text-slate-500">{companyEvents(c.id).length} sourced moments in this company’s history.</p><Link href={href({lens:'movement',firm:c.id,period:'all'})} className="mt-2 inline-block text-xs font-semibold text-[var(--eco-link)] underline">Follow the full timeline →</Link></section>}
      <section className="border-t border-slate-200 pt-4"><h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--eco-link)]">What would change the reading?</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{c.watch}</p></section>
      {c.profileUrl && <a href={c.profileUrl} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-[var(--eco-link)] underline underline-offset-4">Official partner profile ↗</a>}
      {c.directorySlug && <Link href={`/atlas/workday?scope=global&partner=${c.directorySlug}`} className="block text-xs font-semibold text-[var(--eco-link)] underline underline-offset-4">Published global partner profile ↗</Link>}
    </div>
  </article>;
}

function EvidenceFocus({ company: c, href }: {company: AnzCompany; href: (v: Record<string,string|undefined>) => string}) {
  const data = useEcosystem(), params = useSearchParams();
  const proof = params.get('proof') ?? '', customerId = params.get('customer') ?? '';
  if (!proof && !customerId) return null;
  const cases = data.ANZ_CUSTOMERS.filter((x) => x.companyId === c.id && (customerId ? x.id === customerId : x.capabilities.includes(proof)));
  const claims = customerId ? [] : c.capabilities.filter((x) => x.capability === proof);
  return <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4" aria-label="Selected evidence">
    <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Selected evidence · ANZ research</p><h3 className="mt-2 text-lg font-semibold">{customerId ? cases[0]?.name ?? 'Customer reference' : proof}</h3></div><Link href={href({proof:undefined,customer:undefined})} className="text-xs text-slate-500 underline">Clear</Link></div>
    <EngagementProof ecosystemId={data.id} companyId={c.id} capability={proof} customerId={customerId}/>
    {cases.map((x) => <article key={x.id} className="mt-4 border-t border-emerald-200 pt-3"><p className="text-[10px] font-semibold text-emerald-800">{x.anonymous ? 'Supplier-published anonymous case' : 'Named customer case'} · {x.capabilities.join(' / ')}</p><h4 className="mt-2 text-sm font-semibold">{x.name}</h4><p className="mt-2 text-xs leading-relaxed">{x.fact.text}</p><p className="mt-2 text-[11px]"><Evidence fact={x.fact}>Open the engagement source</Evidence></p></article>)}
    {claims.map((f,i) => <article key={i} className="mt-4 border-t border-emerald-200 pt-3"><p className="text-[10px] font-semibold text-emerald-800">{f.scope} · {f.basis === 'credentials' ? 'Credentials' : f.basis === 'people' ? 'People experience / hire' : 'Published claim'}</p><p className="mt-2 text-xs leading-relaxed">{f.text}</p><p className="mt-2 text-[11px]"><Evidence fact={f}>Read source</Evidence></p></article>)}
    {!cases.length && !claims.length && <p className="mt-3 text-xs">This firm has no matching evidence in the current research.</p>}
    <p className="mt-4 text-[11px] leading-relaxed text-slate-500">Read the supplier’s stated role in the engagement. A domain reference does not establish every service role or the team available today.</p>
    <Link href={`/decisions?dilemma=si&company=${encodeURIComponent(c.id)}&platform=${data.id}${proof ? `&domain=${encodeURIComponent(proof)}` : ''}`} className="mt-3 inline-block text-xs font-semibold text-emerald-800 underline">Use this in a delivery decision →</Link>
  </section>;
}
