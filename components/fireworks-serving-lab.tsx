'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { readServingChoice, servingResult, type ServingChoice } from '@/lib/fireworks-serving';

export function FireworksServingLab() {
  const params = useSearchParams();
  const [choice, setChoice] = useState(() => readServingChoice(params));
  const query = params.toString();
  useEffect(() => {
    // A previous navigation must not overwrite a choice made before its effect runs.
    if (new URLSearchParams(window.location.search).toString() === query) {
      setChoice(readServingChoice(new URLSearchParams(query)));
    }
  }, [query]);
  const result = servingResult(choice);
  const change = (next: Partial<ServingChoice>) => {
    const value = {...choice, ...next};
    const q = new URLSearchParams();
    q.set('model', value.model); q.set('mode', value.mode);
    if (value.mode === 'dedicated' && value.warm) q.set('warm','1');
    setChoice(value);
    window.history.pushState(null, '', `/research/fireworks?${q}#serving-lab`);
  };
  return <section id="serving-lab" aria-labelledby="serving-lab-title" className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#DCCBF2] bg-[#F5F0FC]">
    <header className="border-b border-[#DCCBF2] px-5 py-5 sm:px-7"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#6C36AF]">Fireworks · understand the operating choices</p><h2 id="serving-lab-title" className="font-serif-display mt-2 text-2xl">Same model. A different commitment.</h2><p className="mt-2 text-xs leading-relaxed text-[#706180]">Change the serving choices to see what your team takes on. An educational walkthrough; no live model calls.</p></header>
    <div className="grid lg:grid-cols-[.8fr_1.2fr]">
      <div className="space-y-5 p-5 sm:p-7">
        <fieldset><legend className="mb-2 text-xs font-semibold">1. What are you serving?</legend><div className="grid gap-2">{[{value:'base',name:'A supported base model'},{value:'custom',name:'Our fine-tuned model'}].map(v=><label key={v.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#DCCBF2] bg-white px-3 py-2 text-xs"><input type="radio" name="serving-model" checked={choice.model===v.value} onChange={()=>change({model:v.value as ServingChoice['model']})} className="h-4 w-4 accent-[#7D41BD]"/>{v.name}</label>)}</div></fieldset>
        <fieldset><legend className="mb-2 text-xs font-semibold">2. Who supplies the capacity?</legend><div className="grid gap-2">{[{value:'shared',name:'Shared serverless endpoint'},{value:'dedicated',name:'A dedicated deployment'}].map(v=><label key={v.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#DCCBF2] bg-white px-3 py-2 text-xs"><input type="radio" name="serving-mode" checked={choice.mode===v.value} onChange={()=>change({mode:v.value as ServingChoice['mode']})} className="h-4 w-4 accent-[#7D41BD]"/>{v.name}</label>)}</div></fieldset>
        {choice.mode==='dedicated'&&<label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#DCCBF2] bg-white px-3 py-3 text-xs"><input type="checkbox" checked={choice.warm} onChange={e=>change({warm:e.target.checked})} className="h-4 w-4 accent-[#7D41BD]"/>Keep one replica warm</label>}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="border-t border-[#DCCBF2] bg-white/60 p-5 sm:p-7 lg:border-l lg:border-t-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D41BD]">{result.state}</p>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{result.title}</h3>
        <ol className="my-5 grid gap-2 sm:grid-cols-3">{result.path.map((step,i)=><li key={i} className="rounded-lg border border-[#E1D5ED] bg-white px-3 py-3 text-xs leading-relaxed"><span className="mb-2 block font-mono text-[10px] text-[#877496]">0{i+1}</span>{step}</li>)}</ol>
        <p className="text-sm leading-relaxed text-[#665775]">{result.detail}</p>
        <p className="mt-3 text-xs font-semibold">{result.cost}</p>
        <p className="mt-5 border-t border-[#DCCBF2] pt-4 text-xs leading-relaxed"><strong>Before switching traffic: </strong>{result.next}</p>
      </div>
    </div>
    <footer className="flex flex-wrap gap-x-5 gap-y-3 border-t border-[#DCCBF2] px-5 py-4 text-[11px] text-[#6A5180] sm:px-7"><span>Serving rules checked 11 Sep 2026</span><a className="underline underline-offset-4" href="https://docs.fireworks.ai/serverless/overview" target="_blank" rel="noreferrer">Serverless documentation ↗</a><a className="underline underline-offset-4" href="https://docs.fireworks.ai/guides/ondemand-deployments" target="_blank" rel="noreferrer">Dedicated deployments & scaling ↗</a></footer>
  </section>;
}
