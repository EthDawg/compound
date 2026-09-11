"use client";

import Link from "next/link";
import { useState } from "react";
import { type CompanyStudy, companyHref } from "@/lib/companies";
import { CompoundBar } from "@/components/compound-bar";
import { useXRay } from "@/components/xray-provider";
import { journeyComplete, type JourneyAction, type JourneyRole } from "@/lib/data/servicenow-scenarios";
import s from "./servicenow.module.css";
import {Operations} from "./operations";
import {ControlTower} from "./control-tower";
import {useServiceNowSession,useSceneFocus} from "./session";

type WithoutActor<T> = T extends unknown ? Omit<T,'actor'> : never;
const WORKSPACES = [
  ["operations", "Service Operations"], ["employees", "EmployeeWorks"], ["control-tower", "AI Control Tower"],
] as const;
export function ServiceNowApp({ company, screen }: { company: CompanyStudy; screen: string }) {
  const current = screen || "operations", { on } = useXRay();
  return <div className={`${s.study} ${current !== "operations" ? s.light : ""}`} data-company="servicenow">
    <CompoundBar activeId="servicenow"/>
    <header className={s.global}><div><div className={s.brand}>ServiceNow</div><small>Independent app study · Meridian Optics</small></div>
      <nav className={s.switcher} aria-label="ServiceNow study workspaces">{WORKSPACES.map(([id, label]) => <Link key={id} href={companyHref("servicenow", "app", id)} aria-current={current === id ? "page" : undefined}>{label}</Link>)}</nav>
    </header>
    <div className={s.body}>
      <aside className={s.rail} aria-label="Current workspace context"><h2>{current === "operations" ? "Operations workspace" : current === "employees" ? "Employee experience" : "AI governance"}</h2>
        {current === "operations" ? <><p>Service operations</p><p className={s.on}>Incident · INC0010427</p><p>Customer order capture</p></> : current === "employees" ? <><p>Tasks & Requests</p><p className={s.on}>To-dos · team move</p><p>Otto + request details</p></> : <><p>Activity Center</p><p className={s.on}>Work · model change</p><p>Inventory context</p></>}
        <p className={s.note}>A focused scene within this workspace. Use the workspace switcher to explore the three company ideas.</p>
        <Link className={s.link} href={companyHref("servicenow", "backstage")}>The company behind it ↗</Link>
      </aside>
      <main className={s.main}>
        {current === "operations" ? <Operations/> : current === "employees" ? <EmployeeWorks/> : <ControlTower/>}
        {on && <section className={s.insight}><strong>X-ray · {company.backstage.question}</strong><p className="mt-3">{company.strategy?.contrast}</p><Link className={s.link} href={companyHref("servicenow", "backstage", "essays")}>Read the deeper argument →</Link></section>}
        <footer className={s.footer}>Illustrative ServiceNow concepts using fictional Meridian Optics records. Recorded actions and draft notes stay in this browser session as you switch workspaces or visit Backstage. Each scene has its own reset. No real agent, identity system or production service is connected. <Link className="underline" href={companyHref("servicenow", "backstage", "sources")}>Sources & product boundaries</Link></footer>
      </main>
    </div>
  </div>;
}

function EmployeeWorks() {
  const {state:{journey:state},dispatch:record,full}=useServiceNowSession();
  const [question,setQuestion]=useState("status"),[policy,setPolicy]=useState(false),[role,setRole]=useState<JourneyRole>("employee");
  const focus=useSceneFocus(state,'employee-request');
  const dispatch=(action:WithoutActor<JourneyAction>)=>focus(()=>record({scene:'journey',action:{...action,actor:role} as JourneyAction}));
  const complete = journeyComplete(state);
  return <>
    <p className={s.eyebrow}>EmployeeWorks / Tasks & Requests / To-dos</p><h1 className={s.h1}>One team move. Several things to finish.</h1>
    <p className={s.intro}>Alex Morgan is joining the Singapore service team. The HR transfer is recorded; role access and workplace readiness still need to follow.</p>
    <div className={s.columns}><section className={s.card}><div className={s.otto}><span>↗</span>Otto</div><div className={s.request}>“I'm moving to the Singapore team next month. What still needs doing?”</div>
      <div className={s.tabs} aria-label="Suggested employee question"><button aria-pressed={question === "status"} onClick={() => setQuestion("status")}>My move</button><button aria-pressed={question === "access"} onClick={() => setQuestion("access")}>Why is access waiting?</button></div>
      <h2>{complete ? "Your move is ready in this scenario." : question === "access" ? state.accessReceipt === "complete" ? "The identity provider returned a completion receipt." : state.approved ? "Approval is recorded; identity fulfilment is a separate step." : "The role-access request needs manager approval." : "The request is still in progress."}</h2>
      <p className={s.muted}>{complete ? "The role-access receipt and workplace confirmation are both recorded. No live employee system was changed." : "The HR record establishes the transfer. It does not prove access has been provisioned or the destination workplace is ready."}</p>
      <button className={`${s.link} mt-4`} aria-expanded={policy} onClick={() => setPolicy(!policy)}>Inspect policy and source context →</button>
      {policy && <div className={s.evidence}><strong>Fictional policy · Team moves, §3</strong><p>Role access requires manager approval before the identity task is sent. Workspace readiness needs a separate confirmation.</p><p><strong>External HRIS context</strong><br/>Transfer HR-108 · effective 1 October 2026<br/>New team: Singapore Service<br/>HR record: approved · read-only in this scene</p><p className={s.small}>This represents configured external context, not an assumption that ServiceNow is the HR/payroll ledger.</p></div>}
      <div className={s.insight}><strong>The front door changed; the obligations remain.</strong> EmployeeWorks and Otto put conversational intent beside forms, tasks and approvals. Each downstream system still has work to do.</div>
    </section><section className={s.card}><div className={s.row}><h2 id="employee-request" tabIndex={-1}>Request · REQ001083</h2><span className={`${s.badge} ${complete ? s.success : ""}`}>{complete ? "Complete" : "In progress"}</span></div>
      <label className={s.field}>View as · demo role<select className={s.input} value={role} onChange={e => setRole(e.target.value as JourneyRole)}><option value="employee">Employee · request status</option><option value="manager">Manager · access approval</option><option value="it">IT · identity fulfilment</option><option value="workplace">Workplace · readiness</option></select></label><p className={s.small}>Explore each owner’s part in the journey. An employee would not receive all of these permissions.</p><div className={s.tasks}><div className={s.task}><h3>Manager · approve role access</h3><p className={s.small}>New service-team application access for Alex. The HR transfer approval is a different record.</p>{role === "manager" ? <button className={s.btn} disabled={state.approved} onClick={() => dispatch({ type: "approve" })}>{state.approved ? "Demo approval recorded" : "Approve demo role access"}</button> : <span className={s.badge}>{state.approved ? "Approval recorded" : "Awaiting manager"}</span>}</div>
        <div className={s.task}><div className={s.row}><h3>IT · provision access</h3><span className={`${s.badge} ${state.accessReceipt === "failed" ? s.warning : state.accessReceipt === "complete" ? s.success : ""}`}>{state.accessReceipt === "complete" ? "Receipt received" : state.accessReceipt === "failed" ? "Needs IT review" : state.dispatched ? "Awaiting receipt" : "Not dispatched"}</span></div>
          {role === "it" && <div className={s.actions}>{state.accessReceipt === "failed" && <button className={s.secondary} disabled={state.mappingFixed} onClick={()=>dispatch({type:"repair"})}>{state.mappingFixed?"Group mapping repaired":"Repair demo target-group mapping"}</button>}<button className={s.secondary} disabled={!state.approved || (state.dispatched && (state.accessReceipt !== "failed" || !state.mappingFixed))} onClick={() => dispatch({ type: "dispatch" })}>{state.accessReceipt === "failed" ? "Retry demo identity task" : "Send demo identity task"}</button>
            {state.dispatched && state.accessReceipt === "pending" && <><button className={s.btn} onClick={() => dispatch({ type: "receipt", success: true })}>Simulate success receipt</button><button className={s.secondary} onClick={() => dispatch({ type: "receipt", success: false })}>Simulate provider error</button></>}
          </div>}<p className={s.small}>{state.accessReceipt === "failed" ? "Mock provider could not locate the target group. Repair the mapping, then retry the task. The failed receipt stays in the history." : state.accessReceipt === "complete" ? "Mock receipt IDP-218 confirms the requested group membership." : "Sending the task does not establish access. A provider result must return."}</p>
        {state.receipts.length>0&&<details className="mt-3"><summary className={s.small}>Provider history · {state.attempts} attempts</summary><ol className={s.log}>{state.receipts.map((success,i)=><li key={i}>Attempt {i+1} · {success?"IDP-218: requested membership confirmed":"Provider error: target group not found"}</li>)}</ol></details>}
        </div><div className={s.task}><h3>Workplace · confirm team readiness</h3><p className={s.small}>A separate owner confirms the destination workspace is ready.</p>{role === "workplace" ? <button className={s.secondary} disabled={state.workplaceReady} onClick={() => dispatch({ type: "workplace" })}>{state.workplaceReady ? "Readiness confirmed in demo" : "Confirm demo workplace readiness"}</button> : <span className={s.badge}>{state.workplaceReady ? "Readiness confirmed" : "Awaiting workplace owner"}</span>}</div>
      </div><p className={s.small} role="status">{full.includes("journey")?"History limit reached. Reset this request to explore another path.":complete ? "Complete: manager approval, identity receipt and workplace confirmation are all present." : `Manager ${state.approved ? "approved" : "pending"} · access ${state.accessReceipt} · workplace ${state.workplaceReady ? "ready" : "pending"}.`}</p><button className={`${s.secondary} mt-5`} onClick={() => {dispatch({ type: "reset" });setQuestion("status");setPolicy(false);setRole("employee");}}>Reset request</button>
    </section></div>
  </>;
}
