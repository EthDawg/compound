import workday from './data/workday-anz.json';
import servicenow from './data/servicenow-anz.json';
import type { AnzCompany, AnzPerson } from './data/anz-ecosystem';

export const ECOSYSTEMS = [
  { id: 'workday', name: 'Workday', href: '/atlas/workday', description: 'People, payroll capability and practice formation.', research: workday },
  { id: 'servicenow', name: 'ServiceNow', href: '/atlas/servicenow', description: 'Delivery teams, workflow depth and acquisition lineage.', research: servicenow },
];
export interface PracticeLink { ecosystemId: string; ecosystemName: string; href: string; context: string; historical: boolean }
export interface SearchContext { term: string; aliases?: string[]; kind: 'Person' | 'Customer reference' | 'Capability' | 'Ecosystem practice'; detail: string; href: string }
// Derived from the research records. No parallel, manually maintained firm catalogue.
export const ECOSYSTEM_INDEX = [...new Set(ECOSYSTEMS.flatMap((e) => e.research.companies.map((c) => c.id)))].filter((id) => !ECOSYSTEMS.some((e) => e.id === id)).map((id) => {
  const entries = ECOSYSTEMS.flatMap((e) => {
    const company = (e.research.companies as AnzCompany[]).find((c) => c.id === id);
    return company ? [{ e, company }] : [];
  }).sort((a, b) => Number(!!a.company.historical) - Number(!!b.company.historical));
  const primary = entries[0].company;
  return { id, name: primary.name, blurb: primary.thesis, historical: !!primary.historical,
    terms: entries.flatMap(({e, company}) => [e.name, ...(company.aliases ?? []), ...company.capabilities.map((c) => c.capability)]),
    contexts: entries.flatMap(({e, company}): SearchContext[] => {
      const base = `${e.href}?scope=anz&firm=${encodeURIComponent(id)}`;
      return [
        {term:e.name,kind:'Ecosystem practice',detail:`${e.name} · ${company.kind} · ANZ research`,href:base},
        ...(e.research.people as AnzPerson[]).filter((p) => p.companyId === id || p.career.some((s) => s.companyId === id)).map((p): SearchContext => ({ term: p.name, kind: 'Person', detail: `${e.name} · ${p.companyId === id ? p.role : 'Recorded career connection'}`, href: `${base}&lens=people&person=${encodeURIComponent(p.id)}` })),
        ...e.research.customers.filter((c) => c.companyId === id).map((c): SearchContext => ({ term: c.name, aliases: [c.id.replace(/-/g,' ')], kind: 'Customer reference', detail: `${e.name} · ${c.capabilities.join(' / ')}`, href: `${base}&lens=capability&customer=${encodeURIComponent(c.id)}` })),
        ...company.capabilities.map((c): SearchContext => ({term: c.capability, kind: 'Capability', detail: `${e.name} · ${c.scope} evidence`, href: `${base}&lens=capability&proof=${encodeURIComponent(c.capability)}`})),
      ];
    }),
    links: entries.map(({e, company}): PracticeLink => ({ ecosystemId: e.id, ecosystemName: e.name, href: `${e.href}?scope=anz&firm=${encodeURIComponent(id)}`, context: company.kind, historical: !!company.historical })),
  };
});
export const practiceLinks = (id: string): PracticeLink[] => ECOSYSTEM_INDEX.find((c) => c.id === id)?.links ?? [];
