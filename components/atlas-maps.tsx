'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const maps = [
  { id: 'workday', href: '/atlas/workday', name: 'Workday', detail: 'People, capability and practice formation' },
  { id: 'servicenow', href: '/atlas/servicenow', name: 'ServiceNow', detail: 'Delivery teams and acquisition lineage' },
];
export function AtlasMaps({ active = 'landscape' }: { active?: 'landscape' | 'workday' | 'servicenow' }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!menu.current?.contains(e.target as Node)) menu.current?.removeAttribute('open'); };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && menu.current?.open) { menu.current.removeAttribute('open'); menu.current.querySelector('summary')?.focus(); } };
    document.addEventListener('click', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', escape); };
  }, []);
  return <nav aria-label="Atlas maps" className="relative z-30 flex flex-wrap items-center gap-1 border-b border-[#E4E2DC] py-3 text-xs font-semibold text-ink">
    <Link href="/" aria-current={active === 'landscape' ? 'page' : undefined} className={`rounded-lg px-3 py-2 ${active === 'landscape' ? 'bg-ink-100' : 'text-ink-500 hover:bg-black/5'}`}>Software landscape</Link>
    <span className="text-ink-300">/</span>
    <details ref={menu} className="relative">
      <summary className={`cursor-pointer rounded-lg px-3 py-2 ${active !== 'landscape' ? 'bg-ink-100' : 'text-ink-500 hover:bg-black/5'}`}>Ecosystems{active !== 'landscape' ? ` · ${maps.find((m) => m.id === active)?.name}` : ''}</summary>
      <div className="absolute left-[-150px] top-full mt-2 w-[min(310px,calc(100vw-40px))] rounded-xl border border-ink-200 bg-white p-2 shadow-xl sm:left-0">
        <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-ink-500">Australia & New Zealand</p>
        {maps.map((m) => <Link key={m.id} href={m.href} aria-current={active === m.id ? 'page' : undefined} onClick={() => menu.current?.removeAttribute('open')} className="block rounded-lg p-3 hover:bg-ink-100"><span className="block">{m.name}</span><span className="mt-1 block text-[11px] font-normal text-ink-500">{m.detail}</span></Link>)}
      </div>
    </details>
  </nav>;
}
