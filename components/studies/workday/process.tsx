"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { WORKDAY_CASE as CASE, WORKDAY_ROLES, canActWorkday, replayWorkday, workdayResult, type WorkdayAction, type WorkdayChoice, type WorkdayRole } from "@/lib/data/workday-scenario";

const money = (n: number) => new Intl.NumberFormat("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0}).format(n);
const button = "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0755A5]";
const primary = `${button} bg-[#0755A5] text-white hover:bg-[#064986]`;
const secondary = `${button} border border-[#CBD8E5] bg-white text-[#0755A5] hover:bg-[#F0F5FB]`;

export function WorkdayProcess({choice, change, href}: {choice: WorkdayChoice; change: (next:WorkdayChoice)=>void; href:(screen:string)=>string}) {
  const state = replayWorkday(choice.actions), result = workdayResult(state,choice.asOf);
  const [explanation, setExplanation] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const act = (action: WorkdayAction) => {
    if (!canActWorkday(state,choice.role,action)) return;
    change({...choice, actions:[...choice.actions,action]});
    // The old action can disappear when the next role's work becomes available.
    requestAnimationFrame(() => heading.current?.focus());
  };
  const nextRole = result.nextRole;
  const rightRole = choice.role === nextRole;
  const complete = state.stage === "complete";
  return <section aria-labelledby="workday-process-title" className="overflow-hidden rounded-2xl border border-[#D5DFE9] bg-white shadow-sm">
    <div className="border-b border-[#DFE7EE] bg-[#F0F5FB] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#46698D]">Request compensation change · {CASE.id}</p><span className="rounded-full bg-white px-3 py-2 text-[11px] text-[#46698D]">Fictional process configuration</span></div>
      <h2 id="workday-process-title" className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">One request. Three different kinds of done.</h2>
      <p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-[#4F6173]">Work through the review, the effective date and the payroll handoff. Change roles to see who can move each step forward.</p>
    </div>

    <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
      <div className="space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3"><span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E3EFF9] font-semibold text-[#0755A5]">FA</span><div><h3 className="font-semibold">{CASE.worker}</h3><p className="text-xs text-[#617589]">{CASE.title}</p><p className="mt-1 text-[11px] text-[#617589]">{CASE.organisation}</p></div></div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-[#DFE7EE] p-4"><dt className="text-xs text-[#617589]">Existing annual base</dt><dd className="mt-2 text-xl font-semibold">{money(CASE.salary)} <span className="text-xs font-normal">USD</span></dd></div>
          <div className="rounded-xl bg-[#F0F5FB] p-4"><dt className="text-xs text-[#617589]">{complete ? "Approved annual base" : "Proposed annual base"}</dt><dd className="mt-2 text-xl font-semibold">{money(result.proposed)}</dd><dd className="mt-1 text-xs text-[#46698D]">+{state.increase}% · effective 1 October 2026</dd></div>
        </dl>

        <section aria-labelledby="workday-route-title"><div className="flex flex-wrap items-center justify-between gap-2"><h3 id="workday-route-title" className="text-sm font-semibold">Configured route</h3><button className="min-h-11 text-xs font-semibold text-[#0755A5] underline underline-offset-4" aria-expanded={explanation} aria-controls="workday-rule" onClick={()=>setExplanation(!explanation)}>Why this route?</button></div>
          <ol className="mt-1 space-y-2 text-sm">{[
            {label:"HR Partner submits", detail:state.stage === "returned" ? "Returned · revise and resubmit" : "Request recorded", active:state.stage === "returned"},
            {label:"Manager reviews", detail:state.stage === "manager" ? "Awaiting decision" : state.stage === "returned" ? "Will review the resubmission" : "Approval recorded", active:state.stage === "manager"},
            {label:"Compensation Partner reviews", detail:state.increase <= CASE.limit ? "Not required for this 4% proposal" : state.stage === "partner" ? "Required · increase exceeds 5%" : complete ? "Exception approved" : "Required after Manager approval", active:state.stage === "partner"},
            {label:"Core process completes", detail:complete ? "Approved change recorded with effective date" : "Pending required approvals", active:false},
          ].map((step,i)=><li key={step.label} aria-current={step.active ? "step" : undefined} className={`flex items-start gap-3 rounded-lg px-3 py-3 ${step.active ? "bg-[#E9F2FC] ring-1 ring-[#9CBCDE]" : "bg-[#F8FAFC]"}`}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#CBD8E5] text-[11px] font-semibold">{i+1}</span><div><p className="text-xs font-semibold">{step.label}</p><p className="mt-1 text-xs leading-relaxed text-[#617589]">{step.detail}</p></div></li>)}</ol>
          {explanation && <p id="workday-rule" className="mt-3 rounded-lg border-l-4 border-[#FFB23F] bg-[#FFF8E8] p-4 text-xs leading-relaxed">Meridian’s invented rule adds Compensation Partner approval above 5%. Returning a request does not approve it; a revision restarts review. Workday supplies configurable roles, conditions and process security. This threshold and sequence are choices for this demo.</p>}
        </section>
      </div>

      <div className="border-t border-[#DFE7EE] p-5 sm:p-7 lg:border-l lg:border-t-0">
        <label className="block text-xs font-semibold">Explore as
          <select className="mt-2 min-h-11 w-full rounded-lg border border-[#BBCDDF] bg-white px-3 text-sm focus-visible:outline-[#0755A5]" value={choice.role} onChange={e=>change({...choice,role:e.target.value as WorkdayRole})}>{Object.entries(WORKDAY_ROLES).map(([role,name])=><option value={role} key={role}>{name}</option>)}</select>
        </label>
        <p className="mt-2 text-[11px] leading-relaxed text-[#617589]">All roles can inspect this fictional case. Only the role assigned to a step can act. Switching roles is a teaching control.</p>
        <div className="mt-6 rounded-xl border border-[#DFE7EE] p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#617589]">Next responsibility</p>
          <h3 ref={heading} tabIndex={-1} className="mt-2 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0755A5]">{result.status}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#52697E]">{state.stage === "returned" ? "The reviewer sent this back to reconsider the increase. HR can revise it and submit a new version." : state.stage === "manager" ? "Review the proposed amount and 1 October date. An 8% increase will route to the Compensation Partner; a 4% revision will finish at this step." : state.stage === "partner" ? "The Manager approved the proposal. This separate role must decide whether to approve the above-limit increase or return it." : state.payroll === "waiting" ? "The core change is approved. The fictional external payroll provider has not received it yet." : state.payroll === "failed" ? state.mapping ? "The mapping is corrected. Retry the handoff; fixing configuration did not resend the payload." : "The provider rejected cost centre US-204: its department mapping is missing. The approval stays complete while the integration owner resolves this." : state.payroll === "sent" ? "The corrected payload was sent. Sending it is not evidence that the provider accepted the new salary and date." : "The provider acknowledged the approved salary and 1 October date. Actual pay still depends on the effective date and a separate pay run."}</p>
          {!rightRole && state.payroll !== "accepted" && <div className="mt-4 rounded-lg bg-[#FFF8E8] p-3 text-xs leading-relaxed"><p>You are viewing as {WORKDAY_ROLES[choice.role]}. This step belongs to {WORKDAY_ROLES[nextRole]}.</p><button className={`${secondary} mt-3 w-full`} onClick={()=>change({...choice,role:nextRole})}>Explore as {WORKDAY_ROLES[nextRole]}</button></div>}
          {state.events.length >= 40 && <p className="mt-4 text-xs">This scenario has reached its history limit. Reset it below to try another path.</p>}
          {rightRole && state.events.length < 40 && <div className="mt-5 flex flex-wrap gap-3">
            {state.stage === "manager" && <><button className={primary} disabled={!canActWorkday(state,choice.role,"manager-approve")} onClick={()=>act("manager-approve")}>Approve as Manager</button><button className={secondary} onClick={()=>act("manager-return")}>Send back to HR</button></>}
            {state.stage === "partner" && <><button className={primary} onClick={()=>act("partner-approve")}>Approve exception</button><button className={secondary} onClick={()=>act("partner-return")}>Send back to HR</button></>}
            {state.stage === "returned" && <><fieldset className="w-full"><legend className="mb-2 text-xs font-semibold">Revised proposal</legend><div className="flex flex-wrap gap-2">{[{action:"revise-standard",value:4,label:"4% · within delegated limit"},{action:"revise-exception",value:8,label:"8% · retain exception"}].map(v=><button key={v.value} className={`${secondary} aria-pressed:bg-[#E3EFF9] aria-pressed:ring-2 aria-pressed:ring-[#0755A5]`} aria-pressed={state.increase === v.value} onClick={()=>act(v.action as WorkdayAction)}>{v.label}</button>)}</div></fieldset><button className={primary} onClick={()=>act("submit")}>Resubmit for review</button></>}
            {complete && (state.payroll === "waiting" || state.payroll === "failed" && state.mapping) && <button className={primary} onClick={()=>act("send-payroll")}>{state.payroll === "failed" ? "Retry payroll handoff" : "Send demo payroll handoff"}</button>}
            {state.payroll === "failed" && !state.mapping && <button className={primary} onClick={()=>act("fix-mapping")}>Map US-204 to FW-US</button>}
            {state.payroll === "sent" && <button className={primary} onClick={()=>act("confirm-receipt")}>Simulate provider acceptance</button>}
          </div>}
          <p role="status" aria-live="polite" className="mt-4 border-t border-[#DFE7EE] pt-3 text-xs leading-relaxed text-[#52697E]">{state.events.at(-1)?.detail ?? "Request submitted by HR Partner. No approvals have been recorded."}</p>
        </div>

        <section className="mt-5 rounded-xl bg-[#F0F5FB] p-4 sm:p-5" aria-labelledby="workday-values-title"><div className="flex flex-wrap items-center justify-between gap-2"><h3 id="workday-values-title" className="text-sm font-semibold">What is effective?</h3><label className="flex min-h-11 items-center gap-2 text-xs">Scenario date<select className="min-h-11 rounded-lg border border-[#BBCDDF] bg-white px-2" value={choice.asOf} onChange={e=>change({...choice,asOf:e.target.value as WorkdayChoice["asOf"]})}><option value="today">11 September</option><option value="effective">1 October</option></select></label></div>
          <dl className="mt-3 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt>Workday worker record</dt><dd className="font-semibold">{money(result.current)} USD</dd></div><div className="flex justify-between gap-4"><dt>Provider record in this demo</dt><dd className="font-semibold">{money(result.provider)} USD</dd></div></dl>
          <p className="mt-4 text-xs leading-relaxed text-[#52697E]">{!complete ? "Changing the date cannot make an unapproved proposal effective." : choice.asOf === "today" ? "Approval records a future change. Today’s annual base stays at $241,000, even if the provider has accepted the future record." : state.payroll !== "accepted" ? "The approved change is effective in Workday. The provider still has the old value: follow the handoff, not just the approval status." : "Both records now reflect the approved annual base. A pay run, payment and statutory calculations are outside this scene."}</p>
        </section>
      </div>
    </div>
    <details className="border-t border-[#DFE7EE] px-5 py-4 sm:px-7"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Process history · {state.events.length + 1} {state.events.length === 0 ? "event" : "events"}</summary><ol className="mb-3 space-y-3 border-l-2 border-[#DFE7EE] pl-5 text-xs"><li><p className="font-semibold">HR Partner · submission</p><p className="mt-1 text-[#617589]">8% proposed for 1 October 2026. Existing annual base: $241,000 USD.</p></li>{state.events.map((e,i)=><li key={i}><p className="font-semibold">{i+2}. {WORKDAY_ROLES[e.role]}</p><p className="mt-1 leading-relaxed text-[#617589]">{e.detail}</p></li>)}</ol></details>
    <footer className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#DFE7EE] bg-[#F8FAFC] px-5 py-4 text-xs sm:px-7"><button className={secondary} onClick={()=>change({role:"manager",asOf:"today",actions:[]})}>Reset scenario</button><Link className="inline-flex min-h-11 items-center font-semibold text-[#0755A5] underline underline-offset-4" href={href("people")}>See the worker record →</Link><p className="text-[#617589]">The URL keeps your scenario. No live records change.</p></footer>
  </section>;
}

export function WorkdayWorkerChange({choice,href}:{choice:WorkdayChoice;href:(screen:string)=>string}) {
  const state=replayWorkday(choice.actions), result=workdayResult(state,choice.asOf);
  return <section className="mb-6 rounded-2xl border border-[#CBD8E5] bg-white p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-wider text-[#617589]">Worker record · same scenario</p><h2 className="mt-3 text-xl font-semibold">{CASE.worker}</h2><p className="mt-2 text-sm text-[#617589]">{CASE.title} · {CASE.organisation}</p><div className="mt-5 flex flex-wrap gap-6"><div><p className="text-xs text-[#617589]">Annual base · {choice.asOf === "today" ? "11 September" : "1 October"} 2026</p><p className="mt-2 text-2xl font-semibold">{money(result.current)} USD</p></div><div><p className="text-xs text-[#617589]">Compensation change</p><p className="mt-2 text-sm font-semibold">{result.status}</p><p className="mt-1 text-xs">{money(result.proposed)} {state.stage === "complete" ? "approved" : "proposed"} · 1 October</p></div></div><Link className={`${secondary} mt-5`} href={href("processes")}>Return to the compensation process →</Link></section>;
}
