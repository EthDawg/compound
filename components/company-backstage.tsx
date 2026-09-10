import Link from "next/link";
import { companyHref, BACKSTAGE_SECTIONS, type CompanyStudy } from "@/lib/companies";
import * as I from "./icons";

export function CompanyBackstage({ company: c, section = "" }: { company: CompanyStudy; section?: string }) {
  const b=c.backstage, t=c.skin.theme;
  const title = section ? BACKSTAGE_SECTIONS.find(s=>s.id===section)?.label : b.headline;
  const card = {background:t.surface, border:`1px solid ${t.border}`, borderRadius:t.radius};
  const label = {color:t.inkMuted};
  return <article className="py-8 sm:py-10">
    <div className="text-[10px] font-bold uppercase tracking-[.16em]" style={label}>{c.name} · {section ? "Backstage" : "The company thesis"}</div>
    <h1 className={`mt-3 max-w-3xl text-[34px] leading-[1.1] tracking-tight sm:text-[46px] ${c.id==='rippling'?'font-serif-display':'font-semibold'}`}>{title}</h1>
    <p className="mt-5 max-w-[68ch] text-[16px] leading-[1.75]" style={label}>{b.thesis}</p>
    {!section && <>
      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <div className="p-5" style={card}><div className="text-[10px] font-bold uppercase tracking-wider" style={label}>The organising object</div><div className="mt-2 text-[20px] font-semibold">{b.object}</div></div>
        <div className="p-5" style={{...card,background:t.accentSoft}}><div className="text-[10px] font-bold uppercase tracking-wider" style={label}>The question the app asks</div><div className="mt-2 text-[20px] font-semibold leading-snug">{b.question}</div></div>
      </div>
      <h2 className="mt-10 text-[21px] font-semibold">Three ideas that shape the interface</h2>
      <div className="mt-4 grid gap-3 xl:grid-cols-3">{b.premises.map((p,i)=><div key={p.title} className="p-5" style={card}>
        <span className="text-[12px] font-bold" style={{color:t.inkMuted}}>0{i+1}</span><h3 className="mt-5 text-[16px] font-semibold leading-snug">{p.title}</h3><p className="mt-2 text-[13px] leading-[1.7]" style={label}>{p.body}</p>
      </div>)}</div>
      <div className="mt-7 flex flex-wrap gap-3"><Link href={companyHref(c.id,'backstage','model')} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold" style={{background:t.accent,color:t.accentInk}}>Follow the operating model<I.IArrow className="h-4 w-4" /></Link><Link href={companyHref(c.id,'app')} className="rounded-lg border px-4 py-2.5 text-[13px] font-semibold" style={{borderColor:t.border}}>See it in the app</Link></div>
    </>}
    {section==='model' && <>
      <h2 className="mt-9 text-[21px] font-semibold">How work moves through this study</h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">{b.sequence.map((step,i)=><li key={step} className="flex items-start gap-4 p-5" style={card}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{background:t.accentSoft}}>{i+1}</span><span className="pt-1 text-[16px] font-semibold">{step}</span></li>)}</ol>
      <div className="mt-6 space-y-5">{b.premises.map(p=><section key={p.title}><h3 className="text-[17px] font-semibold">{p.title}</h3><p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed" style={label}>{p.body}</p></section>)}</div>
      <Link href={companyHref(c.id,'app',c.id==='rippling'?'workflows':'processes')} className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold underline">Open the workflow example<I.IArrow className="h-3.5 w-3.5" /></Link>
    </>}
    {section==='tradeoffs' && <div className="mt-8 space-y-4">{b.choices.map((x,i)=><section key={x.choice} className="p-5 sm:p-6" style={card}><div className="text-[11px] font-semibold" style={label}>CHOICE 0{i+1} · EDITORIAL INTERPRETATION</div><h2 className="mt-2 text-[22px] font-semibold">{x.choice}</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><h3 className="text-[11px] font-bold uppercase tracking-wide">What it buys</h3><p className="mt-2 text-[14px] leading-relaxed" style={label}>{x.gain}</p></div><div><h3 className="text-[11px] font-bold uppercase tracking-wide">What it costs</h3><p className="mt-2 text-[14px] leading-relaxed" style={label}>{x.cost}</p></div></div></section>)}</div>}
    {section==='proof' && <>
      <p className="mt-6 text-[13px] leading-relaxed" style={label}>Proposed evaluation criteria for this study. These are not reported company metrics or evidence of measured performance.</p>
      <div className="mt-5 space-y-4">{b.proof.map(x=><section key={x.metric} className="p-5" style={card}><h2 className="text-[20px] font-semibold">{x.metric}</h2><p className="mt-3 text-[14px] leading-relaxed" style={label}>{x.test}</p><div className="mt-4 rounded-md p-3 text-[13px] leading-relaxed" style={{background:t.accentSoft}}><span className="font-semibold">A warning sign: </span>{x.failure}</div></section>)}</div>
    </>}
    {section==='sources' && <>
      <section className="mt-8 p-6" style={card}><h2 className="text-[20px] font-semibold">What is public, what is interpretation</h2><div className="mt-4 space-y-3 text-[14px] leading-relaxed" style={label}><p>The sources below support the platform concepts. The thesis, layout, trade-offs and proposed tests are our interpretation, not statements about {c.name}'s internal operations.</p><p>The app is a design study using a fictional customer, people and figures. The visual treatment is inspired by the company; it is not an official interface or an exact reproduction.</p><p>Both companies use Meridian Optics as a comparison scenario. Changing Company changes the platform under study. App and Backstage remain two views of that selected company.</p></div></section>
      <h2 className="mt-8 text-[19px] font-semibold">Primary sources · checked 10 September 2026</h2>
      <div className="mt-4 space-y-3">{b.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="block p-5 transition hover:shadow-sm" style={card}><div className="text-[15px] font-semibold underline underline-offset-4">{s.title} ↗</div><p className="mt-2 text-[13px] leading-relaxed" style={label}>{s.supports}</p></a>)}</div>
    </>}
    {section!=='sources' && <footer className="mt-10 border-t pt-5 text-[11px] leading-relaxed" style={{borderColor:t.border,color:t.inkFaint}}>Company concepts are grounded in public material; the thesis and tests are editorial. <Link href={companyHref(c.id,'backstage','sources')} className="underline">Sources & framing</Link></footer>}
  </article>;
}
