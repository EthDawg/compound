"use client";
import Link from "next/link";
import { type ReactNode } from "react";
import { type CompanyStudy, companyHref } from "@/lib/companies";
import { CompoundBar } from "@/components/compound-bar";
import { useXRay } from "@/components/xray-provider";
import s from "./studies.module.css";

export function AIFrame({ company, screen, tabs, children }: { company: CompanyStudy; screen: string; tabs: readonly (readonly [string, string])[]; children: ReactNode }) {
  const { on } = useXRay();
  return <div className={`${s.study} ${s[company.id]}`} data-ai-company={company.id}>
    <CompoundBar activeId={company.id}/>
    <header className={s.top}><Link href={companyHref(company.id, "app")} className={s.wordmark}>{company.name}</Link><nav aria-label={`${company.name} study experiences`}>{tabs.map(([id, label]) => <Link key={id} href={companyHref(company.id, "app", id)} aria-current={screen === id ? "page" : undefined}>{label}</Link>)}</nav><span className={s.meta}>Meridian · illustrative workspace</span></header>
    <main className={s.main}>{children}
      {on && <section className={s.xray}><strong>X-ray · {company.backstage.question}</strong><p>{company.strategy?.contrast}</p><Link href={companyHref(company.id, "backstage", "essays")}>Read the three arguments →</Link></section>}
    </main>
    <footer className={s.footer}>Independent product interpretation · fictional records and scripted outcomes. Local changes reset when you leave a scene. No live AI service, paid generation or external action. <Link href={companyHref(company.id, "backstage", "sources")}>Sources & boundaries ↗</Link></footer>
  </div>;
}
export function SceneTitle({ product, title, detail }: { product: string; title: string; detail: string }) { return <div className={s.sceneTitle}><p className={s.eyebrow}>{product}</p><h1>{title}</h1><p>{detail}</p></div>; }
export function Insight({ children }: { children: ReactNode }) { return <aside className={s.insight}>{children}</aside>; }
