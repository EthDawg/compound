"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BACKSTAGE_SECTIONS, companyHref, type CompanyStudy } from "@/lib/companies";
import { CompoundBar } from "./compound-bar";
import { Mark } from "./vendor/marks";
import * as I from "./icons";

export function BackstageShell({ company, children }: { company: CompanyStudy; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const t = company.skin.theme;
  return <div className="company-backstage min-h-screen" data-company={company.id} style={{background:t.bg, color:t.ink, fontFamily:t.font}}>
    <CompoundBar activeId={company.id} />
    <header style={{background:company.brand.chrome, color:company.brand.ink, borderBottom:`3px solid ${company.brand.highlight}`}}>
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-5 sm:px-6">
        <span className="grid h-10 w-10 place-items-center rounded-lg" style={{background:company.brand.highlight,color:company.brand.chrome}}><Mark id={company.id} className="h-6 w-6" /></span>
        <div><div className="text-[21px] font-semibold tracking-tight">{company.name} <span className="font-normal opacity-65">/ Backstage</span></div>
          <div className="mt-0.5 text-[12px] opacity-75">The reasoning behind the app · {company.archetype}</div></div>
        <Link href={companyHref(company.id,"app")} className="ml-auto hidden items-center gap-2 rounded-lg border border-white/30 px-3 py-2 text-[12px] font-semibold sm:flex">Explore the app <I.IArrow className="h-3.5 w-3.5" /></Link>
      </div>
    </header>
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:flex lg:gap-10">
      <aside className="shrink-0 border-b py-4 lg:w-[205px] lg:border-b-0 lg:py-8" style={{borderColor:t.border}}>
        <button className="flex w-full items-center justify-between py-1 text-[13px] font-semibold lg:hidden" aria-expanded={open} onClick={()=>setOpen(!open)}>Backstage sections<I.IChevronDown className="h-4 w-4" /></button>
        <nav aria-label="Backstage sections" className={`${open ? "block" : "hidden"} mt-3 space-y-1 lg:sticky lg:top-24 lg:mt-0 lg:block`}>
          {BACKSTAGE_SECTIONS.map(s=>{const href=companyHref(company.id,"backstage",s.id); const active=path===href;return <Link key={s.id} href={href} onClick={()=>setOpen(false)} aria-current={active?"page":undefined}
            className="block rounded-lg px-3 py-2.5 text-[13px]" style={{background:active?t.accentSoft:undefined,color:active?t.ink:t.inkMuted,fontWeight:active?650:450,borderLeft:active?`3px solid ${t.accent}`:"3px solid transparent"}}>{s.label}</Link>})}
          {company.id==="rippling" && <div className="!mt-6 border-t pt-5" style={{borderColor:t.border}}>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider" style={{color:t.inkFaint}}>Extended Rippling study</div>
            {[['library','All essays & explorations'],['manual','Operating manual'],['agentic','The agentic turn'],['decisions','Illustrative decision log']].map(([id,label])=><Link key={id} href={companyHref(company.id,"backstage",id)} className="mt-1 block rounded-lg px-3 py-2 text-[12px] hover:underline" style={{color:t.inkMuted}}>{label}</Link>)}
          </div>}
          <p className="!mt-6 px-3 text-[11px] leading-relaxed" style={{color:t.inkFaint}}>Independent analysis and an illustrative interface. No affiliation. Demo records belong to the fictional Meridian Optics.</p>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 pb-16">{children}</main>
    </div>
  </div>;
}
