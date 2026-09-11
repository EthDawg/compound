import Link from 'next/link';
import { categoryHref, companiesInResearch, researchCompany, type ResearchCategory } from '@/lib/data/category-research';
import type { Node } from '@/lib/data/atlas-nodes';

/** Category roles are sourced product distinctions, not derived numerical positions. */
export function ResearchLandscape({ category, nodes, selected, href, follow }: {
  category: ResearchCategory;
  nodes: Node[];
  selected: string | null;
  href: (node: Node) => string;
  follow: (event: React.MouseEvent, node: Node) => void;
}) {
  const ordered = companiesInResearch(category.id).flatMap(company => nodes.find(node => node.id === company.id) ?? []);
  const groups = [
    ...category.groups.map(group => ({ ...group, members: ordered.filter(n => {
      const company = researchCompany(n.id);
      return company?.categories[0] === category.id && company.group === group.id;
    }) })),
    { id: 'adjacent', name: 'Across the category boundary', detail: 'A related platform with a role in this work.', members: ordered.filter(n => researchCompany(n.id)?.categories[0] !== category.id) },
  ].filter(group => group.members.length);

  return <section aria-label={`${category.name} companies by role`} className="rounded-xl border border-[#DCDDD5] bg-[#FFFEFA]">
    <header className="border-b border-[#E4E2DC] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#57705B]">{nodes.length} companies · by role</p>
      <h2 className="font-serif-display mt-2 text-2xl">Who does what?</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{category.boundary}</p>
      <Link href={categoryHref(category.id)} className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4">Work through a practical example →</Link>
    </header>
    <div className="space-y-5 p-3 sm:p-5">
      {groups.map(group => <section key={group.id} aria-labelledby={`role-${group.id}`}>
        <div className="px-2 pb-2"><h3 id={`role-${group.id}`} className="text-xs font-semibold">{group.name}</h3><p className="mt-1 text-[11px] leading-relaxed text-ink-500">{group.detail}</p></div>
        <ul className="space-y-1">{group.members.map(node => {
          const company = researchCompany(node.id)!;
          return <li key={node.id}><a href={href(node)} onClick={event => follow(event, node)} data-atlas-company={node.id} aria-current={selected === node.id ? 'true' : undefined} className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52725E] ${selected === node.id ? 'border-[#B7C7B3] bg-[#EEF2E9]' : 'border-transparent hover:bg-[#F2F3EC]'}`}>
            <span aria-hidden="true" style={{ color: company.accent, background: company.accent + '10' }} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold">{company.monogram}</span>
            <span className="min-w-0 flex-1"><strong className="block text-sm font-semibold">{company.name}</strong><span className="mt-1 block text-xs leading-relaxed text-ink-500">{company.product}</span></span>
            <span aria-hidden="true" className="text-ink-400">→</span>
          </a></li>;
        })}</ul>
      </section>)}
    </div>
    <p className="border-t border-[#E4E2DC] px-5 py-4 text-[11px] leading-relaxed text-ink-500">Choose a company to preview it. Open several links to compare. Companies can appear in more than one category.</p>
  </section>;
}
