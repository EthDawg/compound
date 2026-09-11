import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { DestinationShell, DestinationIntro } from '@/components/destination-shell';
import { CategoryWorkbench } from '@/components/category-workbench';
import { RESEARCH_CATEGORIES, RESEARCH_REVIEWED, researchCategory, companiesInResearch, researchHref, type ResearchCompany } from '@/lib/data/category-research';

export const generateStaticParams = () => RESEARCH_CATEGORIES.map(c=>({category:c.id}));
export async function generateMetadata({params}:{params:Promise<{category:string}>}) {const c=researchCategory((await params).category);return {title:`${c?.name??'Category'} · Compound`,description:c?.thesis};}
function CompanyRow({company}:{company:ResearchCompany}) {
  return <Link href={researchHref(company.id)} className="group grid gap-3 border-t border-[#E3E3DC] py-5 sm:grid-cols-[220px_1fr_auto] sm:gap-5">
    <div className="flex items-center gap-3"><span style={{color:company.accent,borderColor:company.accent+'35'}} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-white font-mono text-sm font-bold" aria-hidden="true">{company.monogram}</span><div><h3 className="text-sm font-semibold group-hover:underline">{company.name}</h3><p className="mt-1 text-[11px] leading-relaxed text-ink-500">{company.product}</p></div></div>
    <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{company.thesis}</p><span className="inline-flex min-h-11 items-center text-xs font-semibold sm:justify-end">Read brief ↗</span>
  </Link>;
}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}) {
  const category=researchCategory((await params).category);if(!category)notFound();
  const companies=companiesInResearch(category.id), adjacent=companies.filter(c=>c.categories[0]!==category.id);
  return <DestinationShell active="categories"><Link href="/categories" className="mt-5 inline-flex min-h-11 items-center text-xs text-ink-500 hover:underline">← All category guides</Link><DestinationIntro kicker={`Category guide · ${companies.length} companies`} title={category.name} body={category.thesis}/>
    <div className="mb-7 grid gap-4 border-y border-[#D9DAD1] py-5 sm:grid-cols-[180px_1fr]"><h2 className="text-xs font-semibold">Where this category starts</h2><p className="max-w-3xl text-sm leading-relaxed text-ink-500">{category.boundary}</p></div>
    <Suspense fallback={<div className="min-h-80 rounded-2xl bg-[#EEF2E9] p-7" role="status">Opening the field test…</div>}><CategoryWorkbench category={category}/></Suspense>
    <section aria-label="Three forces to understand" className="my-8 grid gap-5 sm:grid-cols-3">{category.forces.map((force,i)=><article key={force.title} className="border-t-2 border-[#BDCCBB] pt-4"><span className="font-mono text-[10px] text-[#69816F]">0{i+1}</span><h2 className="mt-2 text-sm font-semibold">{force.title}</h2><p className="mt-2 text-xs leading-relaxed text-ink-500">{force.text}</p></article>)}</section>
    <section aria-labelledby="category-companies"><div className="mb-6 flex flex-wrap items-baseline justify-between gap-3"><h2 id="category-companies" className="font-serif-display text-2xl">Know who does what.</h2><p className="text-[11px] text-ink-500">Reviewed {RESEARCH_REVIEWED} · Curated, not exhaustive</p></div>
      {category.groups.map(group=><section key={group.id} className="mb-7"><div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2"><h3 className="text-sm font-semibold">{group.name}</h3><p className="text-xs text-ink-500">{group.detail}</p></div>{companies.filter(c=>c.categories[0]===category.id&&c.group===group.id).map(c=><CompanyRow key={c.id} company={c}/>)}</section>)}
      {!!adjacent.length&&<section className="mb-7"><h3 className="mb-3 text-sm font-semibold">Across the category boundary</h3>{adjacent.map(c=><CompanyRow key={c.id} company={c}/>)}</section>}
    </section>
    {category.id==='developer-tools'&&<div className="rounded-xl border border-[#D9DAD1] bg-white/60 p-5"><p className="text-sm font-semibold">The model labs also own developer workflows.</p><div className="mt-3 flex flex-wrap gap-3"><Link href="/companies/anthropic/app/code" className="inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4">Inside Claude Code →</Link><Link href="/companies/openai/app" className="inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4">Inside OpenAI →</Link></div></div>}
    <Link href={`/?category=${category.id}`} className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4">Place this category in the company landscape →</Link>
  </DestinationShell>;
}
