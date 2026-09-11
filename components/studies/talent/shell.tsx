"use client";
import Link from "@/components/study-context-link";
import type { CSSProperties, ReactNode } from "react";
import { companyHref, type CompanyStudy } from "@/lib/companies";
import { CompoundBar } from "@/components/compound-bar";
import { useXRay } from "@/components/xray-provider";
import styles from "./study.module.css";

export function StudyAppShell({ company: c, screen, nav, children }: { company: CompanyStudy; screen: string; nav: readonly (readonly [string, string])[]; children: ReactNode }) {
  const t = c.skin.theme, { on } = useXRay();
  const theme = { "--bg": t.bg, "--ink": t.ink, "--muted": t.inkMuted, "--border": t.border, "--accent": t.accent, "--soft": t.accentSoft, "--chrome": c.brand.chrome, "--highlight": c.brand.highlight } as CSSProperties;
  const links = <nav aria-label={`${c.name} app`}>{nav.map(([id, name]) => <Link key={id} href={companyHref(c.id, "app", id)} aria-current={id === screen ? "page" : undefined}>{name}</Link>)}</nav>;
  const brand = <><div className={styles.brand}>{c.name}</div><div className={styles.small}>Independent app study</div></>;
  return <div className={styles.app} style={theme} data-company={c.id}><CompoundBar activeId={c.id} />
    {c.id === "pageup" && <header className={styles.topbar}>{brand}{links}</header>}
    <div className={styles.frame}>
      {c.id !== "pageup" && <aside className={styles.sidebar}>{brand}{links}<p className={styles.small}>Meridian Optics<br/>Australian expansion scenario</p></aside>}
      <main className={styles.workspace}>
        <div className={styles.toprow}><div><div className={styles.customer}>Meridian Optics</div><p className={styles.small}>Australian expansion · fictional demonstration</p></div><Link className={styles.secondary} href={companyHref(c.id, "backstage")}>Why it works this way ↗</Link></div>
        {children}
        {on && <section className={styles.xray}><p className={styles.label}>X-ray · the company argument</p><h2 className="mt-3 text-xl font-semibold">{c.backstage.question}</h2><p className="mt-3">{c.strategy?.contrast}</p><Link className={styles.link} href={companyHref(c.id, "backstage", "essays")}>Read the deeper argument →</Link></section>}
        <footer className={styles.footer}>Independent interpretation of public product concepts, not an official interface. People, figures and policies are fictional. {c.id === "pageup" ? "The review and review list stay in this browser session; other scenes restart when reopened." : c.id === "employment-hero" ? "Payroll, candidate conversations, draft notes and the proposed employment model stay in this browser session. Reset each scene independently. No message, payment or employment change is made." : "Actions only change this local demonstration and reset when you leave the screen."} <Link href={companyHref(c.id, "backstage", "sources")} className="underline">Sources & boundaries</Link></footer>
      </main>
    </div>
  </div>;
}
export function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <div className={styles.pagehead}><p className={styles.label}>{eyebrow}</p><h1 className={styles.heading}>{title}</h1><p className={styles.sub}>{children}</p></div>;
}
