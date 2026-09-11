"use client";
import Link from "next/link";
import { type ReactNode } from "react";
import { type CompanyStudy, companyHref } from "@/lib/companies";
import { CompoundBar } from "@/components/compound-bar";
import StudyContextLink from "@/components/study-context-link";
import { useXRay } from "@/components/xray-provider";
import s from "./studies.module.css";

export function AIFrame({ company, screen, tabs, children, progress, sessionNote }: { company: CompanyStudy; screen: string; tabs: readonly (readonly [string, string])[]; children: ReactNode; progress?: Record<string, string>; sessionNote?: string }) {
  const { on } = useXRay();
  return <div className={`${s.study} ${s[company.id]}`} data-ai-company={company.id}>
    <CompoundBar activeId={company.id}/>
    <header className={s.top}><Link href={companyHref(company.id, "app")} className={s.wordmark}>{company.name}</Link><nav aria-label={`${company.name} study experiences`}>{tabs.map(([id, label]) => <Link key={id} href={companyHref(company.id, "app", id)} aria-current={screen === id ? "page" : undefined}>{label}{progress?.[id] && <small className={s.tabStatus}>{progress[id]}</small>}</Link>)}</nav><span className={s.meta}>Meridian · illustrative workspace</span></header>
    <main className={s.main}>{children}
      {on && <section className={s.xray}><strong>X-ray · {company.backstage.question}</strong><p>{company.strategy?.contrast}</p><StudyContextLink href={companyHref(company.id, "backstage", "essays")}>Read the three arguments →</StudyContextLink></section>}
    </main>
    <footer className={s.footer}>Independent product interpretation · fictional records and scripted outcomes. {sessionNote ?? 'Local changes reset when you leave a scene.'} No live AI service, paid generation or external action. <StudyContextLink href={companyHref(company.id, "backstage", "sources")}>Sources & boundaries ↗</StudyContextLink></footer>
  </div>;
}
export function SceneTitle({ product, title, detail }: { product: string; title: string; detail: string }) { return <div className={s.sceneTitle}><p className={s.eyebrow}>{product}</p><h1>{title}</h1><p>{detail}</p></div>; }
export function Insight({ children }: { children: ReactNode }) { return <aside className={s.insight}>{children}</aside>; }
