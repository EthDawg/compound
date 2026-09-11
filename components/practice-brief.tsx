import research from '@/lib/data/practice-briefs.json';
const sources=research.sources as Record<string,{title:string;url:string}>;
export function PracticeBrief({ecosystemId,companyId}:{ecosystemId:string;companyId:string}){
 const brief=research.briefs.find(b=>b.ecosystemId===ecosystemId&&b.companyId===companyId);
 if(!brief)return null;
 return <section aria-label="Practice operating brief"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Three things to understand · our reading</p><div className="mt-3 space-y-4">{brief.points.map((p,i)=><div key={p.key} className="flex gap-3"><span className="mt-0.5 font-mono text-[10px] text-slate-400">0{i+1}</span><div><h3 className="text-xs font-semibold">{p.label}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">{p.text}</p><details className="mt-2 text-[10px] text-slate-500"><summary className="cursor-pointer">Evidence</summary><div className="mt-2 space-y-2">{p.sourceRefs.map(id=><a key={id} href={sources[id].url} target="_blank" rel="noreferrer" className="block text-[var(--eco-link)] underline">{sources[id].title} ↗</a>)}</div></details></div></div>)}</div></section>;
}
export function EngagementProof({ecosystemId,companyId,capability,customerId}:{ecosystemId:string;companyId:string;capability:string;customerId:string}){
 const claims=research.engagementClaims.filter(c=>c.ecosystemId===ecosystemId&&c.companyId===companyId&&(customerId?c.customerId===customerId:c.domain===capability||c.service===capability));
 return <>{claims.map(c=><div key={c.id} className="mt-4 rounded-lg bg-white p-3"><p className="text-[10px] font-semibold text-emerald-800">Paired engagement evidence · {c.geography}</p><h4 className="mt-2 text-sm font-semibold">{c.service} × {c.domain}</h4><p className="mt-2 text-xs leading-relaxed">{c.text}</p><p className="mt-2 text-[10px] text-slate-500">{c.dateLabel}</p><p className="mt-2 text-[11px] leading-relaxed text-slate-500">{c.limit}</p><a href={sources[c.sourceRef].url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-semibold text-emerald-800 underline">Engagement source ↗</a></div>)}</>;
}
