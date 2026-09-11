import Link from 'next/link';
import { AtlasMaps } from './atlas-maps';
import { GuideHeader } from './guide-header';

export function DestinationShell({ active, children }: { active: 'earth' | 'technology' | 'decisions'; children: React.ReactNode }) {
  return <div className="destination min-h-screen bg-[#F7F6F1] text-[#17282C]">
    <GuideHeader />
    <main className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6"><AtlasMaps active={active} />{children}</main>
    <footer className="border-t border-black/10"><div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-6 py-6 text-xs text-ink-500"><p>Independent research · facts dated · interpretations labelled</p><div className="flex gap-5"><Link href="/about">About</Link><a href="https://github.com/EthDawg/compound/issues/new">Suggest a correction ↗</a></div></div></footer>
  </div>;
}
export function SourceLink({ href, children }: { href: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer" className="underline decoration-current/30 underline-offset-4 hover:decoration-current">{children} ↗</a>; }
export function DestinationIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return <header className="py-6 sm:py-8"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#54716B]">{kicker}</p><h1 className="font-serif-display mt-3 max-w-4xl text-3xl leading-[1.08] tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#65716E]">{body}</p></header>;
}

export function DestinationLoading({active,title}:{active:'earth'|'technology'|'decisions';title:string}){
 return <DestinationShell active={active}><div className="py-12" role="status" aria-live="polite"><p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Compound field guide</p><h1 className="font-serif-display mt-3 text-3xl">{title}</h1><p className="mt-3 text-sm text-ink-500">Opening the interactive view…</p></div></DestinationShell>;
}
