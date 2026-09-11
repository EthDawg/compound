import research from './workday-anz.json';

export const ANZ_AS_OF = '2026-09-11';
export interface Fact { text: string; url: string; source: string }
export type Capability = 'Advisory' | 'Implementation' | 'AMS' | 'Resourcing' | 'HCM' | 'Payroll' | 'Finance' | 'Adaptive' | 'Student' | 'Data / Integration / AI';
export const CAPABILITIES: Capability[] = ['Advisory', 'Implementation', 'AMS', 'Resourcing', 'HCM', 'Payroll', 'Finance', 'Adaptive', 'Student', 'Data / Integration / AI'];
export type Movement = 'Building' | 'Growing' | 'Contracting' | 'Acquired';
export interface CapabilityFact extends Fact { capability: Capability; scope: 'ANZ' | 'APAC' | 'Global'; customerId?: string }
export interface AnzCompany {
  id: string; name: string; directorySlug?: string; kind: string; thesis: string; watch: string;
  owner: Fact; founded?: Fact; presence: Fact; size?: Fact; segment: string;
  capabilities: CapabilityFact[]; go?: Fact; historical?: boolean;
}
export interface CareerStep extends Fact { companyId: string; role: string; when: string }
export interface AnzPerson {
  id: string; name: string; companyId: string; role: string;
  function: 'Founder' | 'Commercial' | 'Practice Builder' | 'Delivery' | 'Talent';
  domain: string; reading: string; current: Fact; career: CareerStep[];
}
export interface AnzEvent extends Fact {
  id: string; date: string | null; dateLabel: string; companyIds: string[]; personIds: string[];
  type: 'Acquisition' | 'Practice launch' | 'People move' | 'Senior hire' | 'Leadership change' | 'Expansion' | 'Partner change' | 'Client delivery';
  movement?: Movement; scope: 'ANZ' | 'APAC' | 'Global'; title: string; implication: string;
  // An acquisition can affect both companies but changes ownership only for the target.
  targetIds?: string[];
}
export interface AnzCustomer { id: string; name: string; companyId: string; capabilities: Capability[]; fact: Fact }
export interface Lineage { id: string; title: string; reading: string; companyIds: string[]; eventIds: string[] }

export const ANZ_COMPANIES = research.companies as AnzCompany[];
export const ANZ_PEOPLE = research.people as AnzPerson[];
export const ANZ_EVENTS = research.events as AnzEvent[];
export const ANZ_CUSTOMERS = research.customers as AnzCustomer[];
export const ANZ_LINEAGES = research.lineages as Lineage[];
export const ANZ_ACTIVE = ANZ_COMPANIES.filter((c) => !c.historical);
export const anzCompany = (id: string) => ANZ_COMPANIES.find((c) => c.id === id);
export const companyPeople = (id: string) => ANZ_PEOPLE.filter((p) => p.companyId === id);
export const peopleInLineage = (id: string) => ANZ_PEOPLE.filter((p) => p.companyId === id || p.career.some((s) => s.companyId === id)).sort((a, b) => Number(b.companyId === id) - Number(a.companyId === id));
export const companyEvents = (id: string) => ANZ_EVENTS.filter((e) => e.companyIds.includes(id)).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

/** A dated signal is a reading of change, not a quality score or an acquisition forecast. */
export function companyMovement(id: string, asOf = ANZ_AS_OF, events = ANZ_EVENTS): { label: Movement | 'No recent signal'; event?: AnzEvent } {
  const end = new Date(`${asOf}T00:00:00Z`);
  const start = new Date(end); start.setUTCMonth(start.getUTCMonth() - 18);
  const eligible = events.filter((e) => {
    if (!e.date || !e.movement || !e.companyIds.includes(id)) return false;
    const date = new Date(`${e.date}T00:00:00Z`);
    if (date < start || date > end || Number.isNaN(date.valueOf())) return false;
    if (e.movement === 'Acquired') return e.targetIds?.includes(id);
    // Parent/global growth does not establish growth in the ANZ practice.
    return e.scope === 'ANZ' || e.scope === 'APAC';
  }).sort((a, b) => b.date!.localeCompare(a.date!));
  const event = eligible[0];
  return event ? { label: event.movement!, event } : { label: 'No recent signal' };
}

export function searchAnz(query: string, capability = '', movement = '') {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return ANZ_ACTIVE.filter((c) => {
    const people = ANZ_PEOPLE.filter((p) => p.companyId === c.id || p.career.some((s) => s.companyId === c.id));
    const text = [c.name, c.kind, c.thesis, c.owner.text, ...people.flatMap((p) => [p.name, p.domain, ...p.career.map((s) => anzCompany(s.companyId)?.name ?? '')]), ...companyEvents(c.id).map((e) => e.text), ...c.capabilities.map((x) => x.capability)].join(' ').toLowerCase();
    return terms.every((term) => text.includes(term)) && (!capability || c.capabilities.some((x) => x.capability === capability && x.scope === 'ANZ')) && (!movement || companyMovement(c.id).label === movement);
  });
}

export function movementEvents(query = '', capability = '', movement = '') {
  const companies = searchAnz(query, capability, movement);
  if (movement) {
    const latest = companies.flatMap((c) => companyMovement(c.id).event ?? []);
    return [...new Map(latest.map((e) => [e.id, e])).values()].sort((a, b) => b.date!.localeCompare(a.date!));
  }
  const start = new Date(`${ANZ_AS_OF}T00:00:00Z`); start.setUTCMonth(start.getUTCMonth() - 18);
  return ANZ_EVENTS.filter((e) => e.companyIds.some((id) => companies.some((c) => c.id === id)) && (!e.date || (new Date(`${e.date}T00:00:00Z`) >= start && e.date <= ANZ_AS_OF))).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export function ecosystemHref(values: Record<string, string | undefined>, current = '') {
  const params = new URLSearchParams(current);
  params.set('scope', 'anz');
  for (const [key, value] of Object.entries(values)) { if (value) params.set(key, value); else params.delete(key); }
  return `/atlas/workday?${params}`;
}

export function directoryRequested(params: URLSearchParams) {
  if (params.get('scope') === 'anz') return false;
  return params.get('scope') === 'global' || ['partner', 'service', 'product', 'region', 'industry', 'evidence', 'group', 'q', 'view'].some((key) => params.has(key));
}
