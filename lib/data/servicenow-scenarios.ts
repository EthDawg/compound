/** Fictional ServiceNow process configuration. These transitions never operate real systems. */
export type Health = 'unknown' | 'failed' | 'healthy';
export type Service = 'checkout' | 'fulfilment';
export type IncidentPhase = 'investigating' | 'approved' | 'executed' | 'recovered' | 'resolved';
export interface IncidentState { phase: IncidentPhase; inspected: boolean; impactReviewed: boolean; health: Health; fulfilmentHealth: Health; healthChecks: {service:Service;healthy:boolean}[]; rationale:string }
export const INITIAL_INCIDENT: IncidentState = {phase:'investigating',inspected:false,impactReviewed:false,health:'unknown',fulfilmentHealth:'healthy',healthChecks:[],rationale:''};
export type IncidentAction = {type:'inspect'|'impact'|'execute'|'resolve'|'reset'} | {type:'approve';reason:string} | {type:'health';service:Service;healthy:boolean};
const validNote = (note:unknown): note is string => typeof note === 'string' && note.trim().length >= 10 && note.length <= 2000;
export function incidentReducer(state:IncidentState, action:IncidentAction):IncidentState {
  if(action.type==='reset')return INITIAL_INCIDENT;
  if(action.type==='inspect'&&state.phase==='investigating'&&!state.inspected)return {...state,inspected:true};
  if(action.type==='impact'&&state.phase==='investigating'&&!state.impactReviewed)return {...state,impactReviewed:true};
  if(action.type==='approve'&&state.phase==='investigating'&&state.inspected&&state.impactReviewed&&validNote(action.reason))return {...state,phase:'approved',rationale:action.reason.trim()};
  if(action.type==='execute'&&state.phase==='approved')return {...state,phase:'executed',health:'unknown',fulfilmentHealth:'unknown'};
  if(action.type==='health'&&state.phase==='executed'&&['checkout','fulfilment'].includes(action.service)&&typeof action.healthy==='boolean'){
    const next={...state,healthChecks:[...state.healthChecks,{service:action.service,healthy:action.healthy}]};
    if(action.service==='checkout')next.health=action.healthy?'healthy':'failed';else next.fulfilmentHealth=action.healthy?'healthy':'failed';
    if(next.health==='healthy'&&next.fulfilmentHealth==='healthy')next.phase='recovered';
    return next;
  }
  if(action.type==='resolve'&&state.phase==='recovered'&&state.health==='healthy'&&state.fulfilmentHealth==='healthy')return {...state,phase:'resolved'};
  return state;
}

export type JourneyRole = 'employee'|'manager'|'it'|'workplace';
export interface JourneyState { approved:boolean;dispatched:boolean;accessReceipt:'pending'|'failed'|'complete';workplaceReady:boolean;mappingFixed:boolean;receipts:boolean[];attempts:number }
export const INITIAL_JOURNEY:JourneyState={approved:false,dispatched:false,accessReceipt:'pending',workplaceReady:false,mappingFixed:false,receipts:[],attempts:0};
export type JourneyAction = ({type:'approve'|'dispatch'|'repair'|'workplace'|'reset'}|{type:'receipt';success:boolean}) & {actor:JourneyRole};
export function journeyReducer(state:JourneyState,action:JourneyAction):JourneyState {
  if(action.type==='reset')return INITIAL_JOURNEY;
  if(action.type==='approve'&&action.actor==='manager'&&!state.approved)return {...state,approved:true};
  if(action.type==='dispatch'&&action.actor==='it'&&state.approved&&(!state.dispatched||(state.accessReceipt==='failed'&&state.mappingFixed)))return {...state,dispatched:true,accessReceipt:'pending',attempts:state.attempts+1};
  if(action.type==='receipt'&&action.actor==='it'&&state.dispatched&&state.accessReceipt==='pending'&&typeof action.success==='boolean')return {...state,accessReceipt:action.success?'complete':'failed',mappingFixed:action.success?state.mappingFixed:false,receipts:[...state.receipts,action.success]};
  if(action.type==='repair'&&action.actor==='it'&&state.accessReceipt==='failed'&&!state.mappingFixed)return {...state,mappingFixed:true};
  // HR transfer approval is already recorded; workplace work does not depend on IT approval.
  if(action.type==='workplace'&&action.actor==='workplace'&&!state.workplaceReady)return {...state,workplaceReady:true};
  return state;
}
export const journeyComplete=(state:JourneyState)=>state.approved&&state.accessReceipt==='complete'&&state.workplaceReady;

export type GovernanceRole='reviewer'|'owner'|'operator';
export type GovernancePhase='open'|'returned'|'approved'|'deploying'|'deployed'|'rollback-required'|'rolled-back'|'complete';
export type GovernanceEvent={kind:string;revision:number;note:string};
export type GovernanceState={assessed:boolean;phase:GovernancePhase;decisionNote:string;revision:number;history:GovernanceEvent[];activeModel:'v2'|'v3'};
export const INITIAL_GOVERNANCE:GovernanceState={assessed:false,phase:'open',decisionNote:'',revision:1,history:[],activeModel:'v2'};
export type GovernanceAction=({type:'assess'|'deploy'|'receipt'|'rollback'|'reset'}|{type:'approve'|'return'|'resubmit';note:string}|{type:'observe';passed:boolean})&{actor:GovernanceRole};
export function governanceReducer(state:GovernanceState,action:GovernanceAction):GovernanceState {
  if(action.type==='reset')return INITIAL_GOVERNANCE;
  const add=(kind:string,note:string,changes:Partial<GovernanceState>):GovernanceState=>({...state,...changes,history:[...state.history,{kind,revision:changes.revision??state.revision,note}]});
  if(action.actor==='reviewer'&&state.phase==='open'){
    if(action.type==='assess'&&!state.assessed)return add('Assessment reviewed','Scope and rollback plan reviewed for this revision.',{assessed:true});
    if(action.type==='return'&&validNote(action.note))return add('Returned to owner',action.note.trim(),{phase:'returned',decisionNote:action.note.trim()});
    if(action.type==='approve'&&state.assessed&&validNote(action.note))return add('Approved',action.note.trim(),{phase:'approved',decisionNote:action.note.trim()});
  }
  if(action.actor==='owner'&&action.type==='resubmit'&&['returned','rolled-back'].includes(state.phase)&&validNote(action.note))return add('Owner resubmitted',action.note.trim(),{phase:'open',assessed:false,decisionNote:'',revision:state.revision+1});
  if(action.actor==='operator'){
    if(action.type==='deploy'&&state.phase==='approved')return add('Deployment requested','The external runtime has not returned a result.',{phase:'deploying'});
    if(action.type==='receipt'&&state.phase==='deploying')return add('Deployment receipt','DEP-031: v3 active with draft-only permissions. Quality remains untested.',{phase:'deployed',activeModel:'v3'});
    if(action.type==='observe'&&state.phase==='deployed'&&typeof action.passed==='boolean')return add(action.passed?'Canary passed':'Canary failed',action.passed?'A reviewed sample stayed within the draft-only scope. This is limited fictional evidence.':'A canary attempted an account update. The write was blocked; model v3 must be rolled back.',{phase:action.passed?'complete':'rollback-required'});
    if(action.type==='rollback'&&state.phase==='rollback-required')return add('Rollback receipt','RB-031: runtime restored v2; draft-only controls remain. Owner revision is required before another v3 rollout.',{phase:'rolled-back',activeModel:'v2'});
  }
  return state;
}
