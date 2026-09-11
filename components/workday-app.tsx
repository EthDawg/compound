"use client";

import Link from "./study-context-link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { readWorkdayChoice, replayWorkday, workdayQuery, workdayResult, WORKDAY_ROLES, type WorkdayChoice } from "@/lib/data/workday-scenario";
import { WorkdayProcess, WorkdayWorkerChange } from "./studies/workday/process";
import { useXRay } from "./xray-provider";
import { companyHref, type CompanyStudy } from "@/lib/companies";
import { COMPANY, DEPARTMENTS } from "@/lib/data/company";
import { EMPLOYEES } from "@/lib/data/employees";
import type { Block } from "@/lib/vendors/types";
import { CompoundBar } from "./compound-bar";
import { Blocks } from "./vendor/blocks";
import { Mark } from "./vendor/marks";
import * as I from "./icons";

const MODULES = [
  ["", "Home"], ["processes", "Business processes"], ["people", "People"], ["reporting", "Reporting"],
  ["talent", "Talent"], ["compensation", "Compensation"], ["planning", "Workforce planning"], ["financials", "Financials"],
] as const;
const WORKLETS = [
  ["processes", "Business processes", "Work through one change", I.IFlow], ["people", "People", "Explore the workforce", I.IPeople],
  ["reporting", "Reporting", "People & organisation", I.IReport], ["compensation", "Compensation", "Review proposed changes", I.ICard],
  ["talent", "Requisitions", "8 open positions", I.IHire], ["planning", "Workforce planning", "Plan by organisation", I.IGraph],
  ["absence", "Absence", "Review team leave", I.ITime], ["learning", "Learning", "Required programmes", I.IBook],
] as const;

function screenBlocks(screen:string, c:CompanyStudy): Block[] {
  const stats=c.skin.home.find(b=>b.t==='stats')!;
  const table=(title:string,cols:string[],rows:string[][],sub?:string):Block=>({t:'table',title,cols,rows,sub});
  switch(screen){
    case 'people': return [table('Worker directory',['Name','Role','Organisation','Status'],EMPLOYEES.map(e=>[e.name,e.title,DEPARTMENTS.find(d=>d.id===e.dept)?.name??e.dept,e.status]),`${EMPLOYEES.length} illustrative worker records from the same Meridian Optics scenario used in Rippling.`)];
    case 'reporting': return [stats,table('Workforce by entity',['Entity','Jurisdiction','People','Employment'],COMPANY.entities.map(e=>[e.name,e.country,String(e.employees),e.type]),'Shared scenario data, grouped for organisational reporting.')];
    case 'talent': return [table('Requisitions',['Position','Organisation','Stage','Openings'],[['Platform Engineer','Engineering','Compensation review','3'],['Optical Systems Engineer','Hardware','Recruiting','2'],['Account Executive','Go-to-Market','Interviews','2'],['People Partner','People','Manager review','1']],'8 illustrative openings across 4 requisitions.')];
    case 'planning': return [table('Workforce planning',['Entity','Current people','Planning basis'],COMPANY.entities.map(e=>[e.name,String(e.employees),'Scenario baseline'])),{t:'callout',label:'From plan to approved position',body:'The current workforce is the baseline. A planned role needs a position, budget and the appropriate review before it becomes a hire. No forecast values have been invented for this baseline.'}];
    case 'financials': return [table('Organisation and financial accountability',['Entity','People','Ownership'],COMPANY.entities.map(e=>[e.name,String(e.employees),e.type])),{t:'callout',label:'Follow the organisation',body:'This study groups financial responsibility by legal entity and review role. It uses the same fictional customer as the Rippling app, viewed through an enterprise process lens.'}];
    case 'absence': return [table('Absence review',['Worker','Process','Review role','Days waiting'],[['Juliette Moreau','Request Absence','Manager Review','6']]),{t:'callout',label:'A request has a lifecycle',body:'Submission, review and the effective absence are separate states. A pending request does not imply that leave has been approved.'}];
    case 'learning': return [table('Learning programmes',['Programme','Audience','State'],[['Information security','All workers','Assigned'],['Manager responsibilities','People managers','Review due']],'Illustrative programmes for the study.')];
    default: return [];
  }
}

export function WorkdayApp(props:{company:CompanyStudy;screen?:string}) {
  return <Suspense fallback={<div className="min-h-screen bg-[#F0F5FB] p-8 text-[#0755A5]">Opening the Workday study…</div>}><WorkdayWorkspace {...props}/></Suspense>;
}
function WorkdayWorkspace({company:c,screen=''}:{company:CompanyStudy;screen?:string}) {
  const params=useSearchParams(), query=params.toString();
  const [choice,setChoice]=useState(()=>readWorkdayChoice(params));
  const [question,setQuestion]=useState<'waiting'|'salary'>('waiting');
  useEffect(()=>{if(new URLSearchParams(window.location.search).toString()===query)setChoice(readWorkdayChoice(new URLSearchParams(query)));},[query]);
  const change=(next:WorkdayChoice)=>{setChoice(next);window.history.pushState(null,'',`${window.location.pathname}${workdayQuery(next)}`);};
  const href=(nextScreen:string)=>`${companyHref(c.id,'app',nextScreen)}${workdayQuery(choice)}`;
  const processState=replayWorkday(choice.actions), process=workdayResult(processState,choice.asOf);
  const t=c.skin.theme;
  const {on}=useXRay();
  const title=screen ? ([...MODULES,...WORKLETS].find(m=>m[0]===screen)?.[1]??screen) : 'Good morning, Priya';
  return <div className="min-h-screen" data-company={c.id} style={{background:t.bg,color:t.ink,fontFamily:t.font}}>
    <CompoundBar activeId={c.id}/>
    <header style={{background:c.brand.chrome,color:c.brand.ink,borderBottom:`3px solid ${c.brand.highlight}`}}>
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-4 sm:px-6">
        <span className="grid h-9 w-9 place-items-center rounded-full" style={{background:c.brand.highlight,color:c.brand.chrome}}><Mark id={c.id} className="h-5 w-5"/></span>
        <div className="text-[23px] font-semibold tracking-tight">Workday <span className="text-[12px] font-normal opacity-65">/ App study</span></div>
        <div className="ml-auto text-right"><div className="text-[12px] font-semibold">{COMPANY.name}</div><div className="text-[10px] opacity-75">Fictional demo customer</div></div>
      </div>
      <nav aria-label="Workday app" className="overflow-x-auto"><div className="mx-auto flex w-max min-w-full max-w-[1320px] px-3 sm:px-5">
        {MODULES.map(([id,label])=><Link key={id} href={href(id)} aria-current={screen===id?'page':undefined} className="whitespace-nowrap border-b-[3px] px-3 py-3 text-[12px]" style={{borderColor:screen===id?c.brand.highlight:'transparent',background:screen===id?'#FFFFFF16':undefined,fontWeight:screen===id?650:450}}>{label}</Link>)}
      </div></nav>
    </header>
    <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-9">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="text-[10px] font-semibold uppercase tracking-[.14em]" style={{color:t.inkMuted}}>Meridian Optics · Global workforce</div><h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">{title}</h1><p className="mt-2 text-[14px]" style={{color:t.inkMuted}}>{screen?'Meridian Optics · fictional records, configurable process':'Understand the request. Follow who acts next.'}</p></div>
        <Link href={companyHref(c.id,'backstage',screen?'model':'')} className="inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold" style={{borderColor:t.border,background:t.surface}}>Why this works this way<I.IArrow className="h-3.5 w-3.5"/></Link></div>
      {!screen && <section className="mb-7 overflow-hidden rounded-2xl border border-[#CADBEA] bg-white">
        <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]"><div className="bg-[#EAF3FC] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#46698D]">Sana · a different way into the same work</p><h2 className="mt-4 text-2xl font-semibold tracking-tight">Start with a question.<br/>Keep the process visible.</h2><p className="mt-3 text-sm leading-relaxed text-[#52697E]">A scripted interpretation of Workday’s conversational direction. The answers use this scenario’s state; there is no live assistant.</p><div className="mt-5 flex flex-wrap gap-2">{[{id:'waiting',label:'Why is this pay change waiting?'},{id:'salary',label:'Has Fatima’s salary changed?'}].map(q=><button key={q.id} className="min-h-11 rounded-full border border-[#BBCDDF] bg-white px-4 py-3 text-left text-xs font-semibold text-[#0755A5] aria-pressed:border-[#0755A5] aria-pressed:bg-[#0755A5] aria-pressed:text-white" aria-pressed={question===q.id} onClick={()=>setQuestion(q.id as 'waiting'|'salary')}>{q.label}</button>)}</div></div>
        <div className="p-5 sm:p-7" role="status"><p className="text-[10px] font-bold uppercase tracking-wider text-[#617589]">From the compensation process · MO-COMP-204</p><h3 className="mt-4 text-xl font-semibold">{question==='waiting'?process.status:`${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(process.current)} USD is effective`}</h3><p className="mt-3 text-sm leading-relaxed text-[#52697E]">{question==='waiting'?processState.payroll==='accepted'?'The provider accepted the salary and effective date. Payment is a separate process.':`The next responsibility belongs to ${WORKDAY_ROLES[process.nextRole]}. Open the request to inspect the proposed change, the configured review condition and the handoff.`:processState.stage!=='complete'?'The proposed increase is still in review. Neither a summary nor changing the scenario date can approve it.':choice.asOf==='today'?'The change is approved for 1 October. On 11 September the existing annual base still applies.':'The approved increase is effective in the worker record. Check the provider acknowledgement before assuming payroll has the same value.'}</p><Link className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0755A5] px-5 py-3 text-sm font-semibold text-white" href={href('processes')}>Open the compensation process <I.IArrow className="h-4 w-4"/></Link><p className="mt-5 border-t border-[#DFE7EE] pt-4 text-xs leading-relaxed text-[#617589]">Try both paths: approve the 8% exception, or send it back and revise to 4%. The review route changes with the condition.</p></div></div>
      </section>}
      {!screen && <section className="mb-6"><h2 className="mb-3 text-[15px] font-semibold">Your applications</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{WORKLETS.map(([id,label,detail,Icon])=><Link key={id} href={href(id)} className="group flex flex-col items-center border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md" style={{background:t.surface,borderColor:t.border,borderRadius:t.radius}}><span className="grid h-12 w-12 place-items-center rounded-full" style={{background:t.accentSoft,color:t.accent}}><Icon className="h-6 w-6"/></span><span className="mt-3 text-[13px] font-semibold">{label}</span><span className="mt-1 text-[11px]" style={{color:t.inkMuted}}>{detail}</span></Link>)}</div></section>}
      {screen==='processes'||screen==='compensation' ? <WorkdayProcess choice={choice} change={change} href={href}/> : <>
        {screen==='people' && <WorkdayWorkerChange choice={choice} href={href}/>}
        {screen && <Blocks blocks={screenBlocks(screen,c)} t={t}/>}
      </>}
      {on && <section className="mt-6 rounded-lg border p-5" style={{background:t.accentSoft,borderColor:t.border}}><div className="text-[11px] font-bold uppercase tracking-wide">X-ray · the interface argument</div><h2 className="mt-3 text-[20px] font-semibold">{c.backstage.question}</h2><p className="mt-3 max-w-3xl text-[14px] leading-relaxed" style={{color:t.inkMuted}}>Worklets group the work by responsibility; the review queue makes the current step visible. This is our interpretation of a process-oriented workspace. The approval role, effective date and downstream completion are separate facts to verify.</p><Link href={companyHref(c.id,'backstage','model')} className="mt-3 inline-block text-[13px] font-semibold underline">Continue in Workday Backstage →</Link></section>}
      <footer className="mt-8 flex flex-wrap gap-3 border-t pt-5 text-[11px] leading-relaxed" style={{borderColor:t.border,color:t.inkMuted}}><span>Independent Workday design study · fictional records · no affiliation.</span><Link href={companyHref(c.id,'backstage','sources')} className="underline">Sources & framing</Link></footer>
    </main>
  </div>;
}
