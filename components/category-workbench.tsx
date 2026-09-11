'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categoryHref, researchCompany, researchHref, type ResearchCategory } from '@/lib/data/category-research';

/** Native links keep each teaching case shareable and support browser history. */
export function CategoryWorkbench({ category }: { category: ResearchCategory }) {
  const params = useSearchParams();
  const selected = category.situations.find(s => s.id === params.get('situation')) ?? category.situations[0];
  return <section id="field-test" aria-labelledby="field-test-title" className="scroll-mt-6 rounded-2xl border border-[#CAD5CB] bg-[#EEF2E9] p-5 sm:p-7">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 id="field-test-title" className="text-sm font-semibold">Start with the work</h2>
      <span className="text-[11px] text-[#597264]">A way to think it through · Compound’s analysis</span>
    </div>
    <nav aria-label={`${category.shortName} situations`} className="mt-4 flex flex-wrap gap-2">
      {category.situations.map(s => <a key={s.id} href={`${categoryHref(category.id)}?situation=${s.id}#field-test`} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey){e.preventDefault();window.history.pushState(null,'',e.currentTarget.href);}}} aria-current={selected.id === s.id ? 'true' : undefined} className={`flex min-h-11 items-center rounded-lg border px-3 text-xs font-semibold ${selected.id === s.id ? 'border-[#27483B] bg-[#27483B] text-white' : 'border-[#C8D3C9] bg-white/70 hover:bg-white'}`}>{s.name}</a>)}
    </nav>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div aria-live="polite" aria-atomic="true">
        <h3 className="font-serif-display text-2xl leading-tight">{selected.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#52625A]">{selected.explanation}</p>
        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {selected.steps.map((step, i) => <li key={step} className="relative rounded-lg border border-[#D3DBD0] bg-white/60 p-3"><span className="block font-mono text-[10px] text-[#69816F]">0{i+1}{i<2?' →':''}</span><span className="mt-2 block text-xs font-medium leading-relaxed">{step}</span></li>)}
        </ol>
      </div>
      <div className="rounded-xl bg-white/75 p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#52725E]">A useful first test</h3>
        <p className="mt-2 text-sm leading-relaxed">{selected.check}</p>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-ink-500">Companies to examine for this work</p>
        <div className="mt-2 flex flex-wrap gap-2">{selected.companies.map(id => <Link key={id} href={researchHref(id)} className="inline-flex min-h-11 items-center rounded-lg border border-[#D4DBD0] px-3 text-xs font-semibold hover:bg-white">{researchCompany(id)?.name} ↗</Link>)}</div>
      </div>
    </div>
  </section>;
}
