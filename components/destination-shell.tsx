import Link from 'next/link';
import { AtlasMaps } from './atlas-maps';
import { CompanyPicker } from './company-picker';
import { ILayers } from './icons';

export function DestinationShell({ active, children }: { active: 'earth' | 'technology' | 'decisions'; children: React.ReactNode }) {
  return <div className="destination min-h-screen bg-[#F7F6F1] text-[#17282C]">
    <header className="border-b border-black/10 bg-white"><div className="mx-auto flex min-h-16 max-w-[1240px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-signal"><ILayers className="h-4 w-4" /></span>Compound</Link><span className="hidden text-xs text-ink-500 md:block">A field guide to technology</span><div className="ml-auto"><CompanyPicker activeId="" /></div></div></header>
    <main className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6"><AtlasMaps active={active} />{children}</main>
    <footer className="border-t border-black/10"><div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-6 py-6 text-xs text-ink-500"><p>Independent research · facts dated · interpretations labelled</p><div className="flex gap-5"><Link href="/about">About</Link><a href="https://github.com/EthDawg/compound/issues/new">Suggest a correction ↗</a></div></div></footer>
  </div>;
}
export function SourceLink({ href, children }: { href: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer" className="underline decoration-current/30 underline-offset-4 hover:decoration-current">{children} ↗</a>; }
export function DestinationIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return <header className="py-8 sm:py-12"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#54716B]">{kicker}</p><h1 className="font-serif-display mt-3 max-w-4xl text-4xl leading-[1.08] tracking-tight sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#65716E] sm:text-base">{body}</p></header>;
}
