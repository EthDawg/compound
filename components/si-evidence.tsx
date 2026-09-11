import { SI_RESEARCH } from '@/lib/data/si-research';
export function SiEvidence({ id }: { id: string }) {
 const sources=SI_RESEARCH[id];
 if (!sources) return null;
 return <details className="mt-4 text-xs leading-relaxed"><summary className="cursor-pointer font-semibold">Evidence behind this reading · checked September 2026</summary><ul className="mt-2 space-y-2">{sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{s.label} ↗</a></li>)}</ul><p className="mt-2 opacity-70">Strategic interpretation, not a performance ranking. Global developments do not establish local delivery capacity.</p></details>;
}
