"use client";
import { useMemo, useSyncExternalStore } from "react";
import { readPageUpReview, type PageUpReview } from "@/lib/data/pageup-review";

const KEY="compound-pageup-review-v1";
const listeners=new Set<()=>void>();
let fallback:string|null=null;
const getServerSnapshot=()=>null;
function getSnapshot(){try{return sessionStorage.getItem(KEY) ?? fallback;}catch{return fallback;}}
function subscribe(listener:()=>void){
  listeners.add(listener);
  const onStorage=(event:StorageEvent)=>{if(event.key===KEY || event.key===null)listener();};
  window.addEventListener("storage",onStorage);
  return ()=>{listeners.delete(listener);window.removeEventListener("storage",onStorage);};
}
/** One local review is shared by the dashboard, application and Paige. */
export function usePageUpReview(){
  const raw=useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot);
  const value=useMemo(()=>readPageUpReview(raw),[raw]);
  const update=(patch:Partial<PageUpReview>)=>{
    const next=readPageUpReview(JSON.stringify({...readPageUpReview(getSnapshot()),...patch}));
    fallback=JSON.stringify(next);
    try{sessionStorage.setItem(KEY,fallback);}catch{/* This tab still retains the scenario in memory. */}
    listeners.forEach(listener=>listener());
  };
  return [value,update] as const;
}
