'use client';
import {useLayoutEffect,useMemo,useRef,useSyncExternalStore} from 'react';
import {readServiceNowSession,recordServiceNowAction,serviceNowState,SCENE_LIMIT,type SessionAction,type Draft} from '@/lib/data/servicenow-session';
const KEY='compound-servicenow-session-v1';
let fallback:string|null=null,unavailable=false;
const listeners=new Set<()=>void>();
function read(){try{return unavailable?fallback:sessionStorage.getItem(KEY);}catch{unavailable=true;return fallback;}}
function write(value:string){fallback=value;try{if(!unavailable)sessionStorage.setItem(KEY,value);}catch{unavailable=true;}listeners.forEach(fn=>fn());}
function subscribe(fn:()=>void){listeners.add(fn);window.addEventListener('storage',fn);return()=>{listeners.delete(fn);window.removeEventListener('storage',fn);};}
export function useServiceNowSession(){
  const raw=useSyncExternalStore(subscribe,read,()=>null);
  const session=useMemo(()=>readServiceNowSession(raw),[raw]);
  const state=useMemo(()=>serviceNowState(session),[session]);
  const dispatch=(event:SessionAction)=>{const current=readServiceNowSession(read());const next=recordServiceNowAction(current,event);if(next!==current)write(JSON.stringify(next));return next!==current;};
  const setDraft=(key:Draft,value:string)=>{const current=readServiceNowSession(read());write(JSON.stringify({...current,drafts:{...current.drafts,[key]:value.slice(0,2000)}}));};
  return {state,dispatch,drafts:session.drafts,setDraft,full:(['incident','journey','governance'] as const).filter(key=>session[key].length>=SCENE_LIMIT)};
}

/** Focus the next responsibility after its render, before another keyboard action. */
export function useSceneFocus(state:object,id:string){
  const requested=useRef(false);
  useLayoutEffect(()=>{if(requested.current){requested.current=false;document.getElementById(id)?.focus();}},[state,id]);
  return (action:()=>boolean)=>{requested.current=true;if(!action())requested.current=false;};
}
