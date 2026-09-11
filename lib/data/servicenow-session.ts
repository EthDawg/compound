import {INITIAL_INCIDENT,incidentReducer,INITIAL_JOURNEY,journeyReducer,INITIAL_GOVERNANCE,governanceReducer,type IncidentAction,type JourneyAction,type GovernanceAction} from './servicenow-scenarios';
export const SCENE_LIMIT=60;
export type Scene='incident'|'journey'|'governance';
export type Draft='incidentReason'|'governanceNote'|'ownerResponse';
export type ServiceNowSession={version:1;incident:IncidentAction[];journey:JourneyAction[];governance:GovernanceAction[];drafts:Record<Draft,string>};
export const emptyServiceNowSession=():ServiceNowSession=>({version:1,incident:[],journey:[],governance:[],drafts:{incidentReason:'',governanceNote:'',ownerResponse:''}});
function replay<S,A>(initial:S,events:unknown,reducer:(s:S,a:A)=>S){
  let state=initial;const accepted:A[]=[];
  for(const item of (Array.isArray(events)?events:[]).slice(0,SCENE_LIMIT)){
    if(!item||typeof item!=='object'||typeof item.type!=='string')continue;
    const next=reducer(state,item as A);if(next!==state){accepted.push(item as A);state=next;}
  }
  return {state,events:accepted};
}
export function readServiceNowSession(raw:string|null):ServiceNowSession {
  const empty=emptyServiceNowSession();
  try{
    if(!raw||raw.length>400000)return empty;
    const data=JSON.parse(raw);if(data?.version!==1)return empty;
    return {version:1,incident:replay(INITIAL_INCIDENT,data.incident,incidentReducer).events,journey:replay(INITIAL_JOURNEY,data.journey,journeyReducer).events,governance:replay(INITIAL_GOVERNANCE,data.governance,governanceReducer).events,drafts:Object.fromEntries(Object.keys(empty.drafts).map(k=>[k,typeof data.drafts?.[k]==='string'?data.drafts[k].slice(0,2000):''])) as Record<Draft,string>};
  }catch{return empty;}
}
export function serviceNowState(session:ServiceNowSession){return {
  incident:session.incident.reduce(incidentReducer,INITIAL_INCIDENT),
  journey:session.journey.reduce(journeyReducer,INITIAL_JOURNEY),
  governance:session.governance.reduce(governanceReducer,INITIAL_GOVERNANCE),
};}
export type SessionAction={scene:'incident';action:IncidentAction}|{scene:'journey';action:JourneyAction}|{scene:'governance';action:GovernanceAction};
export function recordServiceNowAction(session:ServiceNowSession,event:SessionAction):ServiceNowSession{
  if(event.action.type==='reset')return {...session,[event.scene]:[],drafts:{...session.drafts,...(event.scene==='incident'?{incidentReason:''}:event.scene==='governance'?{governanceNote:'',ownerResponse:''}:{})}};
  if(session[event.scene].length>=SCENE_LIMIT)return session;
  const state=serviceNowState(session);
  const changed=event.scene==='incident'?incidentReducer(state.incident,event.action)!==state.incident:event.scene==='journey'?journeyReducer(state.journey,event.action)!==state.journey:governanceReducer(state.governance,event.action)!==state.governance;
  return changed?{...session,[event.scene]:[...session[event.scene],event.action]}:session;
}
