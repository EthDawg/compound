import Link from 'next/link';
import { DestinationShell, DestinationIntro } from '@/components/destination-shell';
import { RESEARCH_CATEGORIES, RESEARCH_REVIEWED, companiesInResearch, categoryHref } from '@/lib/data/category-research';

export const metadata = {title:'Category guides · Compound',description:'Understand model serving, developer tools and enterprise AI cloud through the work they do, company lineage and meaningful changes.'};
export default function CategoriesPage() {
  return <DestinationShell active="categories"><DestinationIntro kicker="Category guides" title="Understand the layer. Then the companies." body="A few useful distinctions, the companies behind them, and the changes worth following. Start with what you need to understand." />
    <p className="mb-6 text-xs text-ink-500">Research reviewed {RESEARCH_REVIEWED} · Sourced facts, with Compound’s analysis</p>
    <div className="grid gap-4 lg:grid-cols-3">{RESEARCH_CATEGORIES.map((category,i)=><Link key={category.id} href={categoryHref(category.id)} className="group flex flex-col rounded-2xl border border-[#D9DAD1] bg-[#FFFEFA] p-6 transition hover:border-[#829C89] hover:shadow-sm"><span className="font-mono text-xs text-[#70917A]">0{i+1} / {companiesInResearch(category.id).length} companies</span><h2 className="font-serif-display mt-7 text-2xl leading-tight">{category.name}</h2><p className="mt-3 text-sm font-medium">{category.question}</p><p className="mb-8 mt-3 text-sm leading-relaxed text-ink-500">{category.thesis}</p><span className="mt-auto inline-flex min-h-11 items-center text-xs font-semibold group-hover:underline">Explore the category →</span></Link>)}</div>
    <section className="mt-8 grid gap-5 border-y border-[#D9DAD1] py-7 sm:grid-cols-[180px_1fr]"><h2 className="text-sm font-semibold">Follow the handoffs</h2><p className="max-w-3xl text-sm leading-relaxed text-ink-500">A coding tool can be a customer of a model-serving company. An enterprise cloud can distribute the same model. These guides connect the roles without treating every logo as a direct competitor. Search still finds each company once.</p></section>
  </DestinationShell>;
}
