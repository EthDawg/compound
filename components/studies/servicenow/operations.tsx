'use client';
import {useState} from 'react';
import type {IncidentAction,Health,Service} from '@/lib/data/servicenow-scenarios';
import {useServiceNowSession,useSceneFocus} from './session';
import s from './servicenow.module.css';
const names:Record<Service,string>={checkout:'Customer checkout',fulfilment:'Warehouse fulfilment'};
export function Operations(){
  const {state:{incident:state},dispatch:record,drafts,setDraft,full}=useServiceNowSession();
  const [tab,setTab]=useState('overview');
  const focus=useSceneFocus(state,'remediation-heading');
  const dispatch=(action:IncidentAction)=>focus(()=>record({scene:'incident',action}));
  const executed=['executed','recovered','resolved'].includes(state.phase);
  const healthLabel=(health:Health,baseline=false)=>baseline?'Healthy · before change':health==='unknown'?'Needs a new check':health==='failed'?'Check failed':'Recovery observed';
  const phaseTitle=state.phase==='investigating'?'Review the whole change.':state.phase==='approved'?'Approval is not execution.':state.phase==='executed'?'Check both affected services.':state.phase==='recovered'?'Recovery is observed. Close the record.':'Both services verified.';
  return <>
    <p className={s.eyebrow}>Service Operations Workspace / Incident / INC0010427</p>
    <div className={s.row}><h1 className={s.h1}>Customer checkout is timing out.</h1><span className={`${s.badge} ${state.phase==='resolved'?s.success:s.priority}`}>{state.phase==='resolved'?'Resolved':'P1 · Critical'}</span></div>
    <p className={s.intro}>The same database supports order capture and warehouse fulfilment. A change intended to fix one service can disturb the other.</p>
    <div className={s.tabs} aria-label="Incident view">{[['overview','Overview'],['investigate','Investigate'],['activity','Activity']].map(([id,label])=><button key={id} aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</div>
    <div className={s.columns}><div className={s.stack}>
      {tab==='overview'&&<section className={s.card}><div className={s.row}><h2>Impact summary</h2><span className={s.badge}>2 services · 1 shared dependency</span></div>
        <div className={s.graph} aria-label="Service dependencies">
          <div className={s.branches}>
            <div><div className={s.node}><strong>Customer order capture</strong><span className={`${s.badge} ${state.health==='healthy'?s.success:s.warning}`}>{executed?healthLabel(state.health):'Degraded'}</span></div><p className={s.arrow}>↓ depends on</p><div className={s.node}><strong>Ordering API · APP-07</strong><span>Commerce Operations</span></div></div>
            <div><div className={s.node}><strong>Warehouse fulfilment</strong><span className={`${s.badge} ${state.fulfilmentHealth==='healthy'?s.success:s.warning}`}>{healthLabel(state.fulfilmentHealth,!executed)}</span></div><p className={s.arrow}>↓ depends on</p><div className={s.node}><strong>Pick-list service · APP-09</strong><span>Fulfilment Operations</span></div></div>
          </div><p className={s.sharedArrow}>Both depend on ↓</p><div className={s.node}><strong>Orders database · DB-02</strong><span>Database Operations · shared connection limit</span></div>
        </div>
        <p className={s.small}>Fictional CMDB snapshot. Fulfilment’s earlier healthy check cannot establish its state after a database change. Relationships reveal potential impact; they do not authorise a change.</p>
        <button className={`${s.secondary} mt-4`} onClick={()=>setTab('investigate')}>Inspect the related change →</button>
      </section>}
      {tab==='investigate'&&<section className={s.card}><div className={s.row}><h2>Related change · CHG00481</h2><span className={`${s.badge} ${s.warning}`}>Hypothesis</span></div><p>The database connection limit changed from 80 to 20 shortly before checkout timeouts. The timing is a lead, not proof of causation.</p>
        <div className={s.evidence}><strong>Recovery proposal · CHG00482</strong><p>Restore DB-02 configuration v17 and its previous limit of 80. Database Operations owns execution. Commerce and Fulfilment Operations each own a post-change service check.</p></div>
        <div className={s.actions}><button className={s.secondary} disabled={state.inspected||state.phase!=='investigating'} onClick={()=>dispatch({type:'inspect'})}>{state.inspected?'Change evidence reviewed':'Mark demo evidence reviewed'}</button></div>
        <div className={s.evidence}><strong>What else could this affect?</strong><p>APP-09 uses the same database. Fulfilment is currently working; its owner must be included in the change and confirm that a pick list can still be generated afterwards.</p><button className={`${s.secondary} mt-3`} disabled={state.impactReviewed||state.phase!=='investigating'} onClick={()=>dispatch({type:'impact'})}>{state.impactReviewed?'Both service owners included':'Confirm demo impact review'}</button></div>
        <p className={s.small}>The two review steps are Meridian’s invented change policy. Otto-style retrieval can assemble context; it cannot substitute for approval, execution or service evidence.</p>
      </section>}
      {tab==='activity'&&<section className={s.card}><h2>Activity & completion evidence</h2><ol className={s.log}><li>Incident opened · Commerce Operations assigned</li>{state.inspected&&<li>Related database change inspected</li>}{state.impactReviewed&&<li>Both dependent services and their owners included in the recovery plan</li>}{state.rationale&&<li>Change approved · {state.rationale}</li>}{executed&&<li>EXE-017 · external connector restored DB-02 configuration v17</li>}{state.healthChecks.map((check,i)=><li key={i}>Observation {i+1} · {names[check.service]} · {check.healthy?'passed':'failed; closure remains blocked'}</li>)}{state.phase==='resolved'&&<li>Incident resolved after both service checks passed</li>}</ol></section>}
      <div className={s.insight}><strong>Service context changes the decision.</strong> The second dependency changes who needs to be involved and what must be checked before closure.</div>
    </div><section className={s.card} aria-label="Controlled remediation"><p className={s.eyebrow}>Linked remediation · CHG00482</p><h2 id="remediation-heading" tabIndex={-1} className="mt-3">{phaseTitle}</h2>
      {state.phase==='investigating'&&<><p>Review the proposed recovery and both affected services, then record the change manager’s rationale.</p><label className={s.field}>Demo approval rationale<textarea className={s.input} rows={3} maxLength={2000} value={drafts.incidentReason} onChange={e=>setDraft('incidentReason',e.target.value)}/></label><div className={s.actions}><button className={s.btn} disabled={!state.inspected||!state.impactReviewed||drafts.incidentReason.trim().length<10} onClick={()=>dispatch({type:'approve',reason:drafts.incidentReason})}>Approve demo change</button></div><p className={s.small}>Needs both reviews and at least 10 characters of rationale.</p></>}
      {state.phase==='approved'&&<><p>Approval is recorded. DB-02 has not changed; Fulfilment’s healthy observation still predates the proposed recovery.</p><button className={`${s.btn} mt-4`} onClick={()=>dispatch({type:'execute'})}>Simulate connector execution</button></>}
      {state.phase==='executed'&&<><div className={s.evidence}><strong>Execution receipt EXE-017</strong><p>DB-02 configuration v17 restored. Both services need fresh checks.</p></div><div className={s.tasks}>{(['checkout','fulfilment'] as const).map(service=><div className={s.task} key={service}><h3>{names[service]}</h3><p className={s.small}>{healthLabel(service==='checkout'?state.health:state.fulfilmentHealth)}</p><div className={s.actions}><button className={s.btn} onClick={()=>dispatch({type:'health',service,healthy:true})}>Simulate {service} success</button><button className={s.secondary} onClick={()=>dispatch({type:'health',service,healthy:false})}>Simulate {service} failure</button></div></div>)}</div><p className={s.small}>A failed result stays in Activity. Reassess and check again; a successful checkout alone cannot close this change.</p></>}
      {state.phase==='recovered'&&<><p>Checkout succeeds and a new fulfilment pick list was observed. The incident still needs its explicit resolution.</p><button className={`${s.btn} mt-4`} onClick={()=>dispatch({type:'resolve'})}>Resolve demo incident</button></>}
      {state.phase==='resolved'&&<p>The record retains the change rationale, execution receipt and both service outcomes. This simulation changed no live service.</p>}
      <p className={s.small} role="status">{full.includes('incident')?'History limit reached. Reset this incident to explore a new path.':state.phase==='investigating'?`Change evidence ${state.inspected?'reviewed':'pending'} · impact review ${state.impactReviewed?'complete':'pending'}.`:`Change ${state.phase} · checkout ${state.health} · fulfilment ${state.fulfilmentHealth}.`}</p>
      <div className={s.actions}><button className={s.secondary} onClick={()=>{dispatch({type:'reset'});setTab('overview');}}>Reset incident</button><button className={s.secondary} onClick={()=>setTab('activity')}>View activity →</button></div>
    </section></div>
  </>;
}
