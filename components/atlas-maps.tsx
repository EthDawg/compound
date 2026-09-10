import Link from 'next/link';

export function AtlasMaps({active='landscape'}:{active?:'landscape'|'workday'}) {
  return <nav aria-label="Atlas maps" className="flex flex-wrap gap-1 border-b border-[#E4E2DC] py-3 text-[12px] font-semibold">
    {[{id:'landscape',href:'/',label:'Software landscape'},{id:'workday',href:'/atlas/workday',label:'Workday partner network'}].map(m=><Link key={m.id} href={m.href} aria-current={active===m.id?'page':undefined} className={`rounded-lg px-3 py-2 transition ${active===m.id?'bg-[#E7EFF9] text-[#0755A5]':'text-[#74736D] hover:bg-black/5'}`}>{m.label}</Link>)}
  </nav>;
}
