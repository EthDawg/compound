'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MARKETS, EARTH_LAYERS } from '@/lib/data/earth';
import { DestinationIntro, DestinationShell, SourceLink } from './destination-shell';

export function EarthView() {
  const params = useSearchParams();
  const layer = EARTH_LAYERS.find((l) => l.id === params.get('layer'))?.id ?? 'all';
  const visible = MARKETS.filter((m) => layer === 'all' || m.layers.includes(layer));
  const selected = visible.find((m) => m.id === params.get('market')) ?? visible.find((m) => m.id === 'anz') ?? visible[0];
  const href = (id: string, nextLayer = layer) => `/earth?market=${id}&layer=${nextLayer}`;
  return <DestinationShell active="earth">
    <DestinationIntro kicker="Global View · Earth, connected" title="Every technology story has a geography." body="Follow the places, people and physical dependencies behind the software. Start with a market, then ask what it makes possible — and what it still depends on." />
    <div className="mb-4 flex flex-wrap gap-2" aria-label="Technology layers">{EARTH_LAYERS.map((l) => <Link key={l.id} href={href(selected.id,l.id)} aria-current={layer === l.id ? 'true' : undefined} className={`rounded-full border px-4 py-2 text-xs font-semibold ${layer === l.id ? 'border-[#183A3A] bg-[#183A3A] text-white' : 'border-black/10 bg-white'}`}>{l.name}</Link>)}</div>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
      <section className="overflow-hidden rounded-2xl bg-[#102A31] text-white" aria-label="Global technology markets">
        <div className="flex justify-between px-5 pt-5 text-[10px] uppercase tracking-wider text-[#A0BBB7]"><span>Selected market connections</span><span>September 2026</span></div>
        <svg viewBox="0 0 900 450" role="img" aria-labelledby="earth-title earth-desc" className="w-full"><title id="earth-title">World map of selected technology markets</title><desc id="earth-desc">Choose a labelled market to read its dependencies. The same links are available beneath the map. Pins are illustrative regional anchors, not facilities or rankings.</desc>
          <image href="/earth-land.svg" width="900" height="450" />
          {[0,30,-30,60,-60].map((lat) => <line key={lat} x1="0" x2="900" y1={(90-lat)*2.5} y2={(90-lat)*2.5} stroke="#91B5B1" strokeOpacity=".1" />)}
          {visible.map((m) => { const x=(m.lon+180)*2.5,y=(90-m.lat)*2.5, on=m.id===selected.id; return <a key={m.id} href={href(m.id)} aria-label={`Explore ${m.name}`}><circle cx={x} cy={y} r={on?18:15} fill={on?'#F5C518':'#BBD5CA'} fillOpacity={on?'.2':'.12'} /><circle cx={x} cy={y} r={on?7:5} fill={on?'#F5C518':'#BBD5CA'} /><text x={x} y={y+(m.id==='southeast-asia'?27:-21)} textAnchor={m.id==='anz'?'end':'middle'} fill={on?'#F5C518':'#E0EAE3'} fontSize="12" fontWeight="600" paintOrder="stroke" stroke="#102A31" strokeWidth="4">{m.name}</text></a>; })}
        </svg>
        <div className="flex flex-wrap gap-2 px-5 pb-5">{visible.map((m) => <Link key={m.id} href={href(m.id)} aria-current={selected.id === m.id ? 'true' : undefined} className={`rounded-md px-3 py-2 text-xs ${selected.id === m.id ? 'bg-[#F5C518] font-semibold text-[#102A31]' : 'bg-white/10 hover:bg-white/20'}`}>{m.name}</Link>)}</div>
        <p className="border-t border-white/10 px-5 py-3 text-[10px] leading-relaxed text-[#A0BBB7]">Selected anchors, not a census. No pin represents market size. Land outline: <SourceLink href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth · public domain</SourceLink>. Regional labels are entry points; evidence stays at its stated scope.</p>
      </section>
      <article id="market" className="scroll-mt-6 rounded-2xl border border-black/10 bg-white p-6" aria-live="polite"><p className="text-[10px] font-bold uppercase tracking-wider text-[#57776D]">{selected.name}</p><p className="mt-1 text-[10px] text-ink-500">{selected.anchor}</p><h2 className="font-serif-display mt-4 text-2xl leading-tight">{selected.title}</h2><p className="mt-4 text-xs leading-relaxed text-ink-600">{selected.fact}</p><p className="mt-3 text-[10px] leading-relaxed text-ink-500">{selected.date}<br/><SourceLink href={selected.url}>{selected.source}</SourceLink></p><div className="mt-5 border-t border-black/10 pt-4"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#57776D]">Our reading</h3><p className="mt-2 text-sm leading-relaxed">{selected.reading}</p></div><p className="mt-4 rounded-lg bg-[#F2F5EE] p-3 text-sm leading-relaxed"><strong className="block text-[10px] uppercase tracking-wider text-[#57776D]">Ask in the room</strong>{selected.ask}</p><div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">{selected.links.map((l) => l.href.startsWith('/') ? <Link key={l.href} href={l.href} className="underline underline-offset-4">{l.label} →</Link> : <SourceLink key={l.href} href={l.href}>{l.label}</SourceLink>)}</div></article>
    </div>
    <section className="mt-10"><p className="text-[10px] font-bold uppercase tracking-wider text-[#57776D]">The useful zoom out · our synthesis</p><h2 className="font-serif-display mt-2 text-3xl">Three maps belong on the same whiteboard.</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{[
      ['01','Where it is made','Design, fabrication, optics and memory rarely share one geography. A supplier list can hide a common dependency.','/earth?layer=compute'],
      ['02','Where it can run','Electricity, cooling, distance and network paths constrain an apparently weightless cloud. Capacity announcements have lead times.','/technology?view=scale'],
      ['03','Where it becomes useful','Local language, process knowledge and delivery teams turn a technical capability into an operating outcome.','/decisions'],
    ].map(([n,title,body,url]) => <Link href={url} key={n} className="rounded-xl border border-black/10 p-5 transition hover:bg-white"><span className="font-mono text-xs text-[#57776D]">{n}</span><h3 className="mt-3 text-lg font-semibold">{title} →</h3><p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p></Link>)}</div></section>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5 text-xs text-ink-500"><p>Need comparable numbers rather than selected stories?</p><SourceLink href="https://data360.worldbank.org/en/atlas/artificial-intelligence/">Explore the World Bank’s country data</SourceLink><SourceLink href="https://datahub.itu.int/">Explore ITU connectivity data</SourceLink></div>
  </DestinationShell>;
}
