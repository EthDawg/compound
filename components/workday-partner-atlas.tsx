'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AtlasMaps } from './atlas-maps';
import {ANZ_COMPANIES} from '@/lib/data/workday-anz';
import {searchCompanies} from '@/lib/company-index';
import { CompoundBar } from './compound-bar';
import * as I from './icons';
import {
  WORKDAY_PARTNERS, WORKDAY_PARTNER_META as META, PARTNER_MAP_HREF,
  PARTNER_SERVICES, PARTNER_PRODUCTS, PARTNER_REGIONS, PARTNER_INDUSTRIES,
  GROUPS, EVIDENCE_LABEL, filterPartners, partnerGroup, relatedPartners, partnerCsv,
  productLabel, serviceLabel, type PartnerFilters, type WorkdayPartner, type PartnerTag,
} from '@/lib/data/workday-partners';

const CHECKED=new Date(META.checkedAt).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const CENTRES=[[180,180],[500,155],[820,180],[180,550],[500,565],[820,550]];
const FEATURED=['accenture-llp','deloitte','kainos','cognizant','pwc','ibm','everforth-topbloc','echo'];
const initial=(name:string)=>name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const colorFor=(p:WorkdayPartner)=>GROUPS.find(g=>g.id===partnerGroup(p))!.color;
const buttonClass='rounded-lg border border-[#DDE3EA] bg-white px-3 py-2 text-[12px] font-semibold transition hover:bg-[#F0F5FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0755A5]';

export function WorkdayPartnerAtlas() {
  const params=useSearchParams();
  const filters:PartnerFilters={q:params.get('q')??'',service:params.get('service')??'',product:params.get('product')??'',region:params.get('region')??'',industry:params.get('industry')??'',evidence:params.get('evidence')??'',group:params.get('group')??''};
  const selected=WORKDAY_PARTNERS.find(p=>p.slug===params.get('partner'));
  const view=params.get('view')==='list'?'list':'map';
  const [zoom,setZoom]=useState(1);
  const [hover,setHover]=useState<string|null>(null);
  const [copied,setCopied]=useState(false);
  const detailRef=useRef<HTMLDivElement>(null);
  const graphRef=useRef<HTMLDivElement>(null);
  const visible=useMemo(()=>filterPartners(filters),[filters.q,filters.service,filters.product,filters.region,filters.industry,filters.evidence,filters.group]);
  const update=(values:Record<string,string|null>,push=false)=>{
    // Read the current URL so rapid changes compose before React renders again.
    // Next's native history integration keeps search params and Back/Forward in sync.
    const next=new URLSearchParams(window.location.search);
    next.set('scope','global');
    for(const [key,value] of Object.entries(values)){if(value)next.set(key,value);else next.delete(key);}
    const url=PARTNER_MAP_HREF+(next.size?'?'+next.toString():'');
    if(push)window.history.pushState(null,'',url);
    else window.history.replaceState(null,'',url);
    setHover(null);
  };
  const select=(p:WorkdayPartner)=>update({partner:p.slug},true);
  const partnerHref=(p:WorkdayPartner)=>{const next=new URLSearchParams(params.toString());next.set('scope','global');next.set('partner',p.slug);return `${PARTNER_MAP_HREF}?${next}`;};
  const localMatches=(filters.q??'').trim()?searchCompanies(filters.q??'').filter(m=>m.company.ecosystemLinks.some(l=>l.ecosystemId==='workday')&&!visible.some(p=>ANZ_COMPANIES.some(c=>c.id===m.company.id&&c.directorySlug===p.slug))).slice(0,3):[];
  const setFilter=(key:string,value:string)=>update({[key]:value,partner:null});
  const reset=()=>{window.history.replaceState(null,'',PARTNER_MAP_HREF+'?scope=global');setZoom(1);setHover(null);};
  useEffect(()=>{
    if(selected&&window.matchMedia('(max-width: 1023px)').matches)detailRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  },[selected?.slug]);
  useEffect(()=>{
    const handle=(e:KeyboardEvent)=>{if(document.querySelector('dialog[open]'))return;if(e.key==='Escape'){setHover(null);const next=new URLSearchParams(window.location.search);if(next.has('partner')){next.delete('partner');next.set('scope','global');window.history.replaceState(null,'',PARTNER_MAP_HREF+(next.size?'?'+next.toString():''));}}};
    window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle);
  },[]);
  useEffect(()=>{setHover(null);setZoom(1);},[filters.q,filters.service,filters.product,filters.region,filters.group,view]);
  const points=useMemo(()=>GROUPS.flatMap((g,gi)=>{
    const members=visible.filter(p=>partnerGroup(p)===g.id);
    const radius=Math.min(138,30+Math.sqrt(members.length)*12);
    return members.map((p,i)=>{
      const angle=i*2.399963229728653;
      const r=members.length===1?0:Math.sqrt((i+.5)/members.length)*radius;
      return {p,x:CENTRES[gi][0]+Math.cos(angle)*r,y:CENTRES[gi][1]+Math.sin(angle)*r};
    });
  }),[visible]);
  const activePoint=points.find(p=>p.p.slug===(hover??selected?.slug));
  const activeFilters=Object.values(filters).some(Boolean);
  const download=()=>{
    const url=URL.createObjectURL(new Blob(['\uFEFF'+partnerCsv(visible)],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`workday-partners-${META.checkedAt.slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const share=async()=>{
    try{await navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2200);}
    catch{setCopied(false);}
  };
  return <div className="min-h-screen bg-[#F7F8FA] text-[#192A3B]">
    <CompoundBar activeId="workday" />
    <main className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6">
      <AtlasMaps active="workday"/>
      <Link href="/atlas/workday?scope=anz" className="mt-4 inline-block text-xs font-semibold text-[#0755A5] underline underline-offset-4">← ANZ people, capability & movement</Link>
      <section className="flex flex-col justify-between gap-6 py-7 sm:py-9 xl:flex-row xl:items-end">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-[#0755A5]"><span className="h-2 w-2 rounded-full bg-[#EF9B27]"/>The people who make the platform work</div>
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.12] tracking-[-.035em] sm:text-[43px]">Workday’s delivery ecosystem.</h1>
          <p className="mt-3 max-w-[680px] text-[14px] leading-[1.7] text-[#667588]">From implementation to life after go-live. Explore the integrators, specialists and staffing firms around Workday—then follow their published scope to the source.</p>
        </div>
        <div className="flex shrink-0 gap-7">
          <div><div className="text-[30px] font-semibold leading-none tracking-tight">{META.total}</div><div className="mt-2 text-[11px] text-[#718092]">firms mapped</div></div>
          <div className="border-l border-[#DDE3EB] pl-7"><div className="text-[30px] font-semibold leading-none tracking-tight">{META.directoryTotal}<span className="ml-1.5 text-[15px] font-normal text-[#7C8998]">+ {META.supplemental}</span></div><div className="mt-2 text-[11px] text-[#718092]">directory + sourced additions</div></div>
        </div>
      </section>

      <section aria-label="Filter partner network" className="rounded-xl border border-[#DFE5EC] bg-white p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.4fr)_1fr_1fr_1fr]">
          <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6C7C8D]">Find a firm</span><div className="relative"><I.ISearch className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#90A0B0]"/><input type="search" value={filters.q} onChange={e=>setFilter('q',e.target.value)} placeholder="Name, former name or product…" aria-label="Find a partner" className="h-10 w-full rounded-lg border border-[#DCE3EB] bg-[#FAFBFD] pl-9 pr-3 text-[13px] outline-none focus:border-[#0755A5] focus:ring-2 focus:ring-[#0755A5]/15"/></div></label>
          <Select label="Service" value={filters.service!} onChange={v=>setFilter('service',v)} options={PARTNER_SERVICES.map(v=>({value:v,label:serviceLabel(v)}))}/>
          <Select label="Product" value={filters.product!} onChange={v=>setFilter('product',v)} options={PARTNER_PRODUCTS.map(v=>({value:v,label:productLabel(v)}))}/>
          <Select label="Region" value={filters.region!} onChange={v=>setFilter('region',v)} options={[...PARTNER_REGIONS.map(v=>({value:v,label:v==='APAC'?'Asia Pacific':v})),{value:'unspecified',label:'Not specified'}]}/>
        </div>
        <details className="mt-3 text-[12px] text-[#667588]"><summary className="w-fit cursor-pointer font-medium">More filters & how to read this</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2"><Select label="Industry" value={filters.industry!} onChange={v=>setFilter('industry',v)} options={PARTNER_INDUSTRIES.map(v=>({value:v,label:v}))}/><Select label="Roster" value={filters.evidence!} onChange={v=>setFilter('evidence',v)} options={[{value:'listed',label:'Workday directory only'}]}/></div>
          <p className="mt-3 leading-relaxed">Services and products come from directory fields or explicit mentions in profile text; each is labelled. Regions use declared coverage, with “Global” included in regional searches. Missing coverage means unspecified. These are discovery signals, not certification or quality rankings.</p>
        </details>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        {!!localMatches.length&&<div className="mb-3 rounded-lg border border-[#DDE4EC] bg-white p-3 text-xs"><p className="font-semibold">Also known in ANZ research</p><p className="mt-1 text-[11px] text-[#708093]">These local profiles are separate from the published directory results.</p><div className="mt-2 flex flex-wrap gap-3">{localMatches.map(m=><Link key={m.company.id} href={m.context?.href??m.company.ecosystemLinks.find(l=>l.ecosystemId==='workday')!.href} className="font-semibold text-[#0755A5] underline">{m.company.name}{m.reason?` · ${m.reason}`:''} →</Link>)}</div></div>}
      <div className="flex flex-wrap items-center gap-2 text-[12px]"><span role="status" aria-live="polite" className="font-semibold">{visible.length} of {META.total} firms</span>{filters.group&&<span className="rounded-full bg-[#E5EDF8] px-2.5 py-1 text-[#0755A5]">{GROUPS.find(g=>g.id===filters.group)?.label??filters.group}</span>}{activeFilters&&<button onClick={reset} className="font-medium text-[#0755A5] underline underline-offset-2">Clear filters</button>}</div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#DDE3EA] bg-white p-0.5" aria-label="Network view">{(['map','list'] as const).map(v=><button key={v} onClick={()=>update({view:v==='map'?null:v})} aria-pressed={view===v} className={`rounded-md px-3 py-1.5 text-[12px] font-semibold ${view===v?'bg-[#E7EFF9] text-[#0755A5]':'text-[#718092]'}`}>{v==='map'?'Map':'List'}</button>)}</div>
          <button onClick={download} className={buttonClass}>Export CSV</button>
          <button onClick={share} className={buttonClass}>{copied?'Link copied':'Copy link'}</button>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_365px]">
        <div className="min-w-0">
          <section className="overflow-hidden rounded-xl border border-[#DDE4EC] bg-white">
            {view==='map'?<>
              <div className="flex items-center justify-between gap-3 border-b border-[#E8EDF2] px-4 py-3"><div><h2 className="text-[13px] font-semibold">One platform. Many ways to deliver.</h2><p className="mt-0.5 text-[11px] text-[#7B8896]">Click a firm. Select a group to narrow the map.</p></div><div className="flex shrink-0 items-center gap-1"><button className="h-8 w-8 rounded border border-[#E1E6ED] text-lg" aria-label="Zoom out" disabled={zoom===1} onClick={()=>setZoom(z=>Math.max(1,z-.5))}>−</button><button className="h-8 rounded border border-[#E1E6ED] px-2 text-[11px]" onClick={()=>{setZoom(1);graphRef.current?.scrollTo(0,0);}}>Reset view</button><button className="h-8 w-8 rounded border border-[#E1E6ED] text-lg" aria-label="Zoom in" disabled={zoom===3} onClick={()=>setZoom(z=>Math.min(3,z+.5))}>+</button></div></div>
              <div ref={graphRef} className="max-h-[660px] overflow-auto bg-[#FCFDFE]" onScroll={()=>setHover(null)}>
                <svg viewBox="0 0 1000 735" style={{width:`${zoom*100}%`,maxWidth:'none'}} role="group" aria-label="Workday partner relationship map" onMouseLeave={()=>setHover(null)}>
                  <defs><pattern id="partner-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#DFE7EF"/></pattern></defs>
                  <rect width="1000" height="735" fill="url(#partner-grid)"/>
                  {GROUPS.map((g,gi)=>{
                    const members=visible.filter(p=>partnerGroup(p)===g.id); const [x,y]=CENTRES[gi];
                    return <g key={g.id}><line x1="500" y1="365" x2={x} y2={y} stroke={g.color} strokeWidth="1.5" strokeOpacity={members.length ? 0.2 : 0.08}/><circle cx={x} cy={y} r="148" fill={g.color} fillOpacity={members.length ? 0.035 : 0.01} stroke={g.color} strokeOpacity=".13" strokeDasharray="3 5"/>
                      <g role="button" tabIndex={0} aria-label={`Filter ${g.label}, ${members.length} firms`} onClick={()=>setFilter('group',filters.group===g.id?'':g.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setFilter('group',filters.group===g.id?'':g.id);}}} className="cursor-pointer outline-none focus:opacity-60"><rect x={x-126} y={y-157} width="252" height="25" rx="12" fill="#FCFDFE"/><text x={x} y={y-140} textAnchor="middle" fill={g.color} fontSize="15" fontWeight="650">{g.label} · {members.length}</text></g></g>;
                  })}
                  {points.map(({p,x,y})=>{
                    const on=p.slug===selected?.slug;const hot=p.slug===hover;const color=colorFor(p);const featured=FEATURED.includes(p.slug);
                    return <g key={p.id} role="button" tabIndex={0} aria-label={`Open ${p.name}`} onClick={()=>select(p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(p);}}} onMouseEnter={()=>setHover(p.slug)} onFocus={()=>setHover(p.slug)} onBlur={()=>setHover(null)} transform={`translate(${x} ${y})`} className="cursor-pointer outline-none">
                      <circle r="13" fill="transparent"/>
                      {(on||hot)&&<circle r="15" fill={color} fillOpacity=".13" stroke={color} strokeWidth="1.5"/>}
                      <circle r={on||hot?10:featured?8:6.5} fill={color} fillOpacity={!selected||on||hot ? 0.95 : 0.4} stroke="white" strokeWidth="1.3" strokeDasharray={!p.listed?'2 2':undefined}/>
                    </g>;
                  })}
                  {activePoint&&<g pointerEvents="none"><line x1="500" y1="365" x2={activePoint.x} y2={activePoint.y} stroke={colorFor(activePoint.p)} strokeWidth="2" strokeDasharray={activePoint.p.listed?undefined:'5 4'}/><circle cx={activePoint.x} cy={activePoint.y} r="10" fill={colorFor(activePoint.p)} stroke="white" strokeWidth="2"/><g transform={`translate(${Math.max(145,Math.min(855,activePoint.x))} ${Math.min(691,activePoint.y+27)})`}><rect x="-143" y="-16" width="286" height="30" rx="7" fill="#182E46"/><text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="600">{activePoint.p.name.length>36?activePoint.p.name.slice(0,34)+'…':activePoint.p.name}</text></g></g>}
                  <g pointerEvents="none"><circle cx="500" cy="365" r="51" fill="#0755A5"/><path d="M477 351 Q500 325 523 351" fill="none" stroke="#FFB23F" strokeWidth="4" strokeLinecap="round"/><text x="500" y="373" textAnchor="middle" fill="white" fontSize="19" fontWeight="600">Workday</text><text x="500" y="391" textAnchor="middle" fill="#CEE1F6" fontSize="10">PLATFORM</text></g>
                  {!visible.length&&<g><rect x="240" y="292" width="520" height="130" rx="16" fill="white" stroke="#DEE6EF"/><text x="500" y="343" textAnchor="middle" fill="#213B56" fontSize="22">No firms match these filters.</text><text x="500" y="378" textAnchor="middle" fill="#6B7E93" fontSize="15">Clear a filter or try a different name.</text></g>}
                </svg>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E8EDF2] px-4 py-3 text-[11px] text-[#6B7A8D]"><span>Each dot is a firm. Colour groups published service signals.</span><span>Lines connect firms to Workday; proximity is not a ranking.</span><span>Outlined dots = additions outside the directory snapshot.</span></div>
            </>:<div className="max-h-[720px] overflow-y-auto"><table className="w-full text-left text-[12px]"><thead className="sticky top-0 bg-[#EDF3FA] text-[#65768B]"><tr><th className="p-4 font-semibold">Firm</th><th className="p-4 font-semibold">Services</th><th className="hidden p-4 font-semibold sm:table-cell">Declared regions</th></tr></thead><tbody>{visible.map(p=><tr key={p.id} className={`border-t border-[#E8EDF2] ${selected?.id===p.id?'bg-[#EEF5FD]':'hover:bg-[#F7FAFE]'}`}><td className="p-4"><Link href={partnerHref(p)} className="text-left font-semibold text-[#0755A5] hover:underline">{p.name}</Link><div className="mt-1 text-[10px] text-[#8190A1]">{p.listed?'Directory listed':'Company source'}</div></td><td className="p-4 text-[#6A7888]">{p.services.map(s=>serviceLabel(s.name)).join(' · ')||'Not specified'}</td><td className="hidden p-4 text-[#6A7888] sm:table-cell">{p.regions.join(' · ')||'Not specified'}</td></tr>)}</tbody></table>{!visible.length&&<p className="p-10 text-center text-[14px] text-[#748294]">No firms match these filters.</p>}</div>}
          </section>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Browse service groups">{GROUPS.map(g=><button key={g.id} onClick={()=>setFilter('group',filters.group===g.id?'':g.id)} aria-pressed={filters.group===g.id} className={`${buttonClass} inline-flex items-center gap-2`} style={filters.group===g.id?{borderColor:g.color,background:g.color+'12'}:undefined}><span className="h-2 w-2 rounded-full" style={{background:g.color}}/>{g.label}</button>)}</div>
          <details className="mt-5 rounded-xl border border-[#DFE5EC] bg-white p-4 text-[12px] text-[#68788A]"><summary className="cursor-pointer font-semibold text-[#2E455E]">Coverage & sources · checked {CHECKED}</summary><div className="mt-3 space-y-3 leading-relaxed"><p>{META.directoryTotal} of {META.directoryTotal} entries from <a href={META.directoryUrl} target="_blank" rel="noreferrer" className="text-[#0755A5] underline">Workday’s public Services directory</a>, plus {META.supplemental} firms supported by company sources. This includes advisory, staffing and adjacent services firms; it is broader than implementation-only integrators. Unlisted independents are not comprehensively covered.</p><p>Service categories organise published signals. “Profile text” is an explicit mention, not a certified competency. The detailed deployment/support table uses structured directory fields. A region at firm level does not establish delivery for every product in that region.</p><p>Similar-firm links show overlapping product tags. They do not imply a partnership, ownership relationship or recommendation. Historical names are shown only where a source supports the connection.</p><p>Every profile links to its evidence. Counts describe this dated snapshot; the live directory can change.</p></div></details>
        </div>
        <div ref={detailRef} className="min-w-0 scroll-mt-20 lg:sticky lg:top-20">
          {selected?<PartnerDetail partner={selected} onClose={()=>update({partner:null})} onSelect={select} onProduct={v=>setFilter('product',v)} outside={!visible.some(p=>p.id===selected.id)}/>:<div className="rounded-xl border border-[#DDE4EC] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-[.13em] text-[#0755A5]">Explore the network</div><h2 className="mt-3 text-[23px] font-semibold leading-tight tracking-tight">Who helps Workday work?</h2><p className="mt-3 text-[13px] leading-[1.7] text-[#708093]">Select a dot to see the firm’s service mix, product coverage and original sources. Start with a familiar name, or follow a specialist.</p>
            <div className="mt-5 space-y-2">{FEATURED.slice(0,6).map(slug=>WORKDAY_PARTNERS.find(p=>p.slug===slug)!).map(p=><button key={p.id} onClick={()=>select(p)} className="flex w-full items-center gap-3 rounded-lg border border-[#E5EAF0] p-3 text-left transition hover:border-[#A9C3E1] hover:bg-[#F5F9FD]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold" style={{color:colorFor(p),background:colorFor(p)+'12'}}>{initial(p.name)}</span><span className="min-w-0 flex-1 text-[13px] font-semibold">{p.name}</span><I.IArrow className="h-4 w-4 text-[#8496A8]"/></button>)}</div>
            <div className="mt-5 border-t border-[#E5EAF0] pt-4"><div className="text-[11px] font-semibold">Try a narrower view</div><div className="mt-2 flex flex-wrap gap-2"><button onClick={()=>setFilter('region','APAC')} className={buttonClass}>Asia Pacific</button><button onClick={()=>setFilter('product','Workday Adaptive Planning')} className={buttonClass}>Adaptive Planning</button><button onClick={()=>setFilter('service','Staffing')} className={buttonClass}>Staffing</button></div></div>
          </div>}
        </div>
      </div>
    </main>
  </div>;
}

function Select({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:{value:string;label:string}[]}){
  return <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#6C7C8D]">{label}</span><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)} className="h-10 w-full rounded-lg border border-[#DCE3EB] bg-[#FAFBFD] px-2 text-[13px] text-[#243C56] outline-none focus:border-[#0755A5]"><option value="">All {label==='Roster'?'sources':label==='Industry'?'industries':label.toLowerCase()+'s'}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}
function Tags({items,label,onClick}:{items:PartnerTag[];label:string;onClick?:(name:string)=>void}){
  return <section className="mt-5"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7C8B9C]">{label}</h3>{items.length?<ul className="mt-2 space-y-1.5">{items.map(t=><li key={t.name} className="flex items-start justify-between gap-2 text-[12px]"><span>{onClick?<button onClick={()=>onClick(t.name)} className="text-left text-[#0755A5] underline decoration-[#C6D8EE] underline-offset-2">{productLabel(t.name)}</button>:serviceLabel(t.name)}</span><span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] ${t.basis==='directory'?'bg-[#EBF4ED] text-[#487456]':t.basis==='firm'?'bg-[#EBF0F8] text-[#53729A]':'bg-[#FBF2E5] text-[#9C7138]'}`}>{EVIDENCE_LABEL[t.basis]}</span></li>)}</ul>:<p className="mt-2 text-[12px] text-[#8491A1]">Not specified in the sources reviewed.</p>}</section>;
}
function PartnerDetail({partner:p,onClose,onSelect,onProduct,outside}:{partner:WorkdayPartner;onClose:()=>void;onSelect:(p:WorkdayPartner)=>void;onProduct:(name:string)=>void;outside:boolean}){
  const related=relatedPartners(p);
  const local=ANZ_COMPANIES.find(c=>c.directorySlug===p.slug);
  return <article aria-label={`${p.name} profile`} className="overflow-hidden rounded-xl border border-[#D4E0EE] bg-white shadow-[0_4px_22px_rgba(25,55,90,.04)]">
    <header className="border-b border-[#DDE7F2] bg-[#EEF4FC] p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[12px] font-bold text-[#0755A5]">{initial(p.name)}</span><div className="min-w-0 flex-1"><div className="text-[9px] font-bold uppercase tracking-wider text-[#6E8CAF]">{p.listed?'Workday directory listed':'Additional company source'}</div><h2 className="mt-1 break-words text-[22px] font-semibold leading-tight tracking-tight">{p.name}</h2></div><button onClick={onClose} aria-label="Close partner profile" className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[#7690AE] hover:bg-white"><I.IClose className="h-4 w-4"/></button></div>
      {p.legalName!==p.name&&<p className="mt-3 text-[10px] leading-relaxed text-[#7890AA]">Directory record: {p.legalName}</p>}
      {outside&&<p className="mt-3 text-[11px] text-[#9A6E32]">This profile sits outside the current filters.</p>}
    </header>
    <div className="p-5">
      {local&&<Link href={`/atlas/workday?scope=anz&firm=${local.id}`} className="mb-4 block rounded-lg border border-[#CAD9EA] bg-[#F0F6FC] p-3 text-xs font-semibold text-[#0755A5]">Open ANZ people, delivery evidence and history →</Link>}
      {p.summary?<p className="text-[13px] leading-[1.7] text-[#52677D]">{p.summary}</p>:<>{p.excerpt&&<blockquote className="text-[13px] leading-[1.7] text-[#52677D]">“{p.excerpt}”</blockquote>}<a className="mt-1 inline-block text-[10px] text-[#8998A8] underline" href={p.sourceUrl} target="_blank" rel="noreferrer">From the partner’s published profile</a></>}
      <Tags items={p.services} label="Services"/><Tags items={p.products} label="Product coverage & mentions" onClick={onProduct}/>
      <section className="mt-5"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7C8B9C]">Declared regions</h3><p className="mt-2 text-[12px] leading-relaxed">{p.regionLabels.join(' · ')||'Not specified in the sources reviewed.'}</p>{p.regionLabels.length>0&&<p className="mt-1 text-[10px] text-[#8B99AA]">{EVIDENCE_LABEL[p.regionBasis??'directory']} · firm-level coverage</p>}</section>
      {p.industries.length>0&&<section className="mt-5"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7C8B9C]">Industries listed</h3><p className="mt-2 text-[12px] leading-relaxed text-[#62778E]">{p.industries.join(' · ')}</p></section>}
      {p.scope.length>0&&<details className="mt-5 rounded-lg border border-[#E3EAF2] p-3 text-[11px]"><summary className="cursor-pointer font-semibold text-[#0755A5]">Deployment vs support detail</summary><p className="mt-2 leading-relaxed text-[#8594A4]">Structured directory competencies. Regions below apply to this service and product where published.</p><ul className="mt-3 space-y-3">{p.scope.map(s=><li key={s.service+s.product} className="border-t border-[#EDF1F5] pt-2"><div className="font-semibold">{productLabel(s.product)}</div><div className="mt-0.5 text-[#667C93]">{serviceLabel(s.service)}</div><div className="mt-0.5 text-[#8594A4]">{s.regions.join(' · ')||'Region not specified'}</div></li>)}</ul></details>}
      {p.context&&<section className="mt-5 rounded-lg bg-[#F5F7FA] p-3"><h3 className="text-[10px] font-semibold uppercase tracking-wide text-[#6E7E90]">Names & lineage</h3><p className="mt-2 text-[12px] leading-relaxed text-[#62778D]">{p.context}</p></section>}
      <section className="mt-5 border-t border-[#E5EBF2] pt-4"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7C8B9C]">Sources · checked {CHECKED}</h3><ul className="mt-2 space-y-2">{p.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="block break-words text-[12px] font-medium text-[#0755A5] underline decoration-[#D0DEEE] underline-offset-2">{s.title} ↗</a></li>)}</ul>{p.website&&<a href={p.website} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#0755A5] px-4 py-2.5 text-[12px] font-semibold text-white">Visit the firm <I.IArrow className="h-3.5 w-3.5"/></a>}</section>
      {related.length>0&&<section className="mt-5 border-t border-[#E5EBF2] pt-4"><h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7C8B9C]">Explore overlapping product coverage</h3><p className="mt-1 text-[10px] leading-relaxed text-[#8A99AA]">Shared published tags; no firm-to-firm relationship implied.</p><div className="mt-2 space-y-1">{related.map(r=><Link key={r.partner.id} href={`/atlas/workday?scope=global&partner=${r.partner.slug}`} className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-[12px] text-[#0755A5] hover:bg-[#EEF5FD]"><span>{r.partner.name}</span><span className="shrink-0 text-[10px] text-[#8B9EB3]">{r.shared.length} shared</span></Link>)}</div></section>}
    </div>
  </article>;
}
