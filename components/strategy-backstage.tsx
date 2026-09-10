import Link from "next/link";
import { companyHref, type CompanyStudy } from "@/lib/companies";

export function StrategyBackstage({ company: c, section }: { company: CompanyStudy; section: string }) {
  const s = c.strategy!, b = c.backstage, t = c.skin.theme;
  const box = { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius };
  const muted = { color: t.inkMuted };
  const titles: Record<string, string> = { "": b.headline, essays: "Three arguments worth testing.", history: "The history is still inside the product.", leadership: s.leadership.title };
  const sources = (urls: string[]) => <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px]" style={muted}>{urls.map(url => <a key={url} href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{b.sources.find(x => x.url === url)?.title ?? "Primary source"} ↗</a>)}</div>;
  return <article className="py-8 sm:py-10">
    <p className="text-[12px] font-semibold uppercase tracking-widest" style={muted}>{c.name} · Independent company study · September 2026</p>
    <h1 className="mt-4 max-w-3xl text-[34px] font-semibold leading-[1.12] tracking-tight sm:text-[46px]">{titles[section]}</h1>
    <p className="mt-5 max-w-[70ch] text-[17px] leading-[1.8]" style={muted}>{section === "leadership" ? s.leadership.fact : section === "history" ? "The moments below matter because they changed what the company could build, sell or operate. Each separates the public event from our reading of its consequence." : b.thesis}</p>
    {!section && <>
      <section className="mt-9" aria-label="Three value propositions">
        <h2 className="text-[22px] font-semibold">The three things to understand</h2>
        <div className="mt-4 space-y-4">{b.premises.map((p, i) => <div key={p.title} className="grid gap-4 p-5 sm:grid-cols-[48px_1fr] sm:p-6" style={box}>
          <span className="text-[28px] font-semibold" style={{ color: t.accent }}>{String(i + 1).padStart(2, "0")}</span>
          <div><h3 className="text-[21px] font-semibold leading-snug">{p.title}</h3><p className="mt-3 text-[16px] leading-[1.75]" style={muted}>{p.body}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-[14px] font-semibold"><Link className="underline underline-offset-4" href={companyHref(c.id, "app", p.screen)}>Experience it in the app →</Link><Link style={muted} href={`${companyHref(c.id, "backstage", "essays")}#${s.essays[i].slug}`}>Read the argument →</Link></div>
          </div></div>)}</div>
      </section>
      <section className="mt-8 rounded-xl p-6 sm:p-8" style={{ background: c.brand.chrome, color: c.brand.ink }}>
        <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: c.brand.highlight }}>Where value can compound · our interpretation</p>
        <h2 className="mt-3 text-[26px] font-semibold leading-snug">{s.flywheel.title}</h2><p className="mt-4 text-[16px] leading-[1.75] opacity-85">{s.flywheel.body}</p>
        <ol className="my-6 grid gap-3 sm:grid-cols-2">{s.flywheel.steps.map((step, i) => <li key={step} className="rounded-lg border border-white/20 p-4 text-[15px]"><span className="mr-3 font-semibold" style={{ color: c.brand.highlight }}>0{i + 1}</span>{step}</li>)}</ol>
        <p className="border-t border-white/20 pt-4 text-[14px] leading-relaxed opacity-85">{s.flywheel.constraint}</p>
      </section>
      <p className="mt-7 border-l-4 pl-5 text-[17px] leading-[1.75]" style={{ borderColor: t.accent, ...muted }}>{s.contrast}</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href={companyHref(c.id, "backstage", "history")} className="p-6" style={box}><p className="text-[12px] uppercase tracking-wider" style={muted}>The causal history</p><h2 className="mt-3 text-[21px] font-semibold">What the acquisitions actually bought →</h2><p className="mt-3 text-[15px] leading-relaxed" style={muted}>Capability, distribution and the boundaries that remain.</p></Link>
        <Link href={companyHref(c.id, "backstage", "leadership")} className="p-6" style={box}><p className="text-[12px] uppercase tracking-wider" style={muted}>The current chapter</p><h2 className="mt-3 text-[21px] font-semibold">{s.leadership.title} →</h2><p className="mt-3 text-[15px] leading-relaxed" style={muted}>What is observable, what is interpretation, and what to watch.</p></Link>
      </section>
    </>}
    {section === "essays" && <div className="mt-9 space-y-12">{s.essays.map((e, i) => <section id={e.slug} key={e.slug} className="scroll-mt-24 border-t pt-7" style={{ borderColor: t.border }}>
      <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: t.accent }}>Argument 0{i + 1} · Editorial synthesis</p><h2 className="mt-3 text-[29px] font-semibold leading-tight">{e.title}</h2><p className="mt-3 text-[18px] leading-relaxed" style={muted}>{e.standfirst}</p>
      <div className="mt-5 max-w-[70ch] space-y-5 text-[16px] leading-[1.85]">{e.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
      <div className="mt-6 rounded-lg p-5 text-[16px] leading-relaxed" style={{ background: t.accentSoft }}><strong>The test: </strong>{e.test}</div>
      {sources(e.sources)}<Link className="mt-5 inline-block text-[14px] font-semibold underline underline-offset-4" href={companyHref(c.id, "app", b.premises[i].screen)}>See the argument in the app →</Link>
    </section>)}</div>}
    {section === "history" && <ol className="mt-9 space-y-5">{s.moments.map(m => <li key={m.date} className="grid gap-3 p-5 sm:grid-cols-[105px_1fr] sm:p-6" style={box}>
      <span className="text-[16px] font-semibold" style={{ color: t.accent }}>{m.date}</span><div><h2 className="text-[22px] font-semibold leading-snug">{m.title}</h2><p className="mt-3 text-[16px] leading-[1.75]">{m.fact}</p><p className="mt-3 text-[16px] leading-[1.75]" style={muted}><span className="font-semibold">What it changes · our reading: </span>{m.consequence}</p>{sources([m.source, ...(m.sources ?? [])])}</div>
    </li>)}</ol>}
    {section === "leadership" && <>
      {sources(s.leadership.sources)}
      <section className="mt-8 p-6" style={box}><h2 className="text-[22px] font-semibold">Our reading of the change</h2><p className="mt-4 text-[16px] leading-[1.85]" style={muted}>{s.leadership.reading}</p></section>
      <section className="mt-7"><h2 className="text-[25px] font-semibold">{s.watch.title}</h2><dl className="mt-5 space-y-5 text-[16px] leading-[1.75]">
        <div><dt className="font-semibold">What is observable</dt><dd style={muted}>{s.watch.shipped}</dd></div><div><dt className="font-semibold">What to watch next</dt><dd style={muted}>{s.watch.next}</dd></div><div><dt className="font-semibold">Where the evidence stops</dt><dd style={muted}>{s.watch.boundary}</dd></div>
      </dl>{sources([s.watch.source])}</section>
      <section className="mt-7 rounded-xl p-6" style={{ background: t.accentSoft }}><h2 className="text-[21px] font-semibold">The execution test</h2><p className="mt-3 text-[16px] leading-[1.75]">{s.leadership.watch}</p></section>
    </>}
    <footer className="mt-10 border-t pt-5 text-[12px] leading-relaxed" style={{ borderColor: t.border, ...muted }}>Public events are sourced; causal arguments and proposed tests are editorial. App records and scenarios are fictional. <Link className="underline underline-offset-4" href={companyHref(c.id, "backstage", "sources")}>Sources and framing →</Link></footer>
  </article>;
}
