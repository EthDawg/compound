export interface Fact { text: string; url: string; source: string }
export type Capability = string;
export type Movement = 'Building' | 'Growing' | 'Contracting' | 'Acquired';
export interface CapabilityFact extends Fact { capability: Capability; scope: 'ANZ' | 'APAC' | 'Global'; customerId?: string; basis?: 'offer' | 'credentials' }
export interface AnzCompany {
  id: string; name: string; directorySlug?: string; kind: string; thesis: string; watch: string;
  owner: Fact; founded?: Fact; presence: Fact; size?: Fact; segment: string;
  capabilities: CapabilityFact[]; go?: Fact; historical?: boolean; partnerStatus?: Fact; profileUrl?: string; aliases?: string[];
}
export interface CareerStep extends Fact { companyId: string; role: string; when: string }
export interface AnzPerson {
  id: string; name: string; companyId: string; role: string;
  function: 'Founder' | 'Commercial' | 'Practice Builder' | 'Delivery' | 'Talent' | 'Technical';
  domain: string; reading: string; current: Fact; roleStatus?: 'historical' | 'source snapshot'; career: CareerStep[];
}
export interface AnzEvent extends Fact {
  id: string; date: string | null; dateLabel: string; companyIds: string[]; personIds: string[];
  type: 'Acquisition' | 'Practice launch' | 'People move' | 'Senior hire' | 'Leadership change' | 'Expansion' | 'Partner change' | 'Client delivery' | 'Investment' | 'Award';
  movement?: Movement; scope: 'ANZ' | 'APAC' | 'Global'; title: string; implication: string;
  // An acquisition can affect both companies but changes ownership only for the target.
  targetIds?: string[];
}
export interface AnzCustomer { id: string; name: string; companyId: string; capabilities: Capability[]; fact: Fact }
export interface Lineage { id: string; title: string; reading: string; companyIds: string[]; eventIds: string[] }

export interface EcosystemConfig {
  id: 'workday' | 'servicenow'; name: string; path: string; asOf: string;
  title: string; intro: string; note: string; capabilities: string[];
  capabilityGroups?: { label: string; values: string[] }[];
  research: { companies: AnzCompany[]; people: AnzPerson[]; events: AnzEvent[]; customers: AnzCustomer[]; lineages: Lineage[] };
}
// Month/year precision stays visible; use the start of the period conservatively for recency.
const eventDate = (date: string) => new Date(`${date.length === 4 ? date + '-01-01' : date.length === 7 ? date + '-01' : date}T00:00:00Z`);
export function createEcosystem(config: EcosystemConfig) {
const ANZ_COMPANIES = config.research.companies as AnzCompany[];
const ANZ_PEOPLE = config.research.people as AnzPerson[];
const ANZ_EVENTS = config.research.events as AnzEvent[];
const ANZ_CUSTOMERS = config.research.customers as AnzCustomer[];
const ANZ_LINEAGES = config.research.lineages as Lineage[];
const ANZ_ACTIVE = ANZ_COMPANIES.filter((c) => !c.historical);
const anzCompany = (id: string) => ANZ_COMPANIES.find((c) => c.id === id);
const companyPeople = (id: string) => ANZ_PEOPLE.filter((p) => p.companyId === id);
const peopleInLineage = (id: string) => ANZ_PEOPLE.filter((p) => p.companyId === id || p.career.some((s) => s.companyId === id) || ANZ_LINEAGES.some((l) => l.companyIds.includes(id) && l.companyIds.includes(p.companyId))).sort((a, b) => Number(b.companyId === id) - Number(a.companyId === id));
const companyEvents = (id: string) => ANZ_EVENTS.filter((e) => e.companyIds.includes(id)).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

/** A dated signal is a reading of change, not a quality score or an acquisition forecast. */
function companyMovement(id: string, asOf = config.asOf, events = ANZ_EVENTS): { label: Movement | 'No recent signal'; event?: AnzEvent } {
  const end = new Date(`${asOf}T00:00:00Z`);
  const start = new Date(end); start.setUTCMonth(start.getUTCMonth() - 18);
  const eligible = events.filter((e) => {
    if (!e.date || !e.movement || !e.companyIds.includes(id)) return false;
    const date = eventDate(e.date);
    if (date < start || date > end || Number.isNaN(date.valueOf())) return false;
    if (e.movement === 'Acquired') return e.targetIds?.includes(id);
    // Parent/global growth does not establish growth in the ANZ practice.
    return e.scope === 'ANZ' || e.scope === 'APAC';
  }).sort((a, b) => b.date!.localeCompare(a.date!));
  const event = eligible[0];
  return event ? { label: event.movement!, event } : { label: 'No recent signal' };
}

function searchAnz(query: string, capability = '', movement = '') {
  const normal = (s: string) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const terms = normal(query).split(/\s+/).filter(Boolean);
  return ANZ_ACTIVE.filter((c) => {
    const people = peopleInLineage(c.id);
    const text = [c.name, ...(c.aliases ?? []), c.kind, c.thesis, c.presence.text, c.owner.text, ...people.flatMap((p) => [p.name, p.domain, ...p.career.map((s) => anzCompany(s.companyId)?.name ?? '')]), ...companyEvents(c.id).map((e) => e.text), ...c.capabilities.map((x) => x.capability)].join(' ');
    const searchable = normal(text);
    return terms.every((term) => searchable.includes(term)) && (!capability || c.capabilities.some((x) => x.capability === capability && x.scope === 'ANZ' && x.basis !== 'credentials') || ANZ_CUSTOMERS.some((x) => x.companyId === c.id && x.capabilities.includes(capability))) && (!movement || companyMovement(c.id).label === movement);
  });
}

function movementEvents(query = '', capability = '', movement = '', fullHistory = false) {
  const companies = searchAnz(query, capability, movement);
  const relatedIds = new Set(companies.flatMap((c) => [c.id, ...ANZ_LINEAGES.filter((l) => l.companyIds.includes(c.id)).flatMap((l) => l.companyIds)]));
  if (movement) {
    const latest = companies.flatMap((c) => companyMovement(c.id).event ?? []);
    return [...new Map(latest.map((e) => [e.id, e])).values()].sort((a, b) => b.date!.localeCompare(a.date!));
  }
  const start = new Date(`${config.asOf}T00:00:00Z`); start.setUTCMonth(start.getUTCMonth() - 18);
  return ANZ_EVENTS.filter((e) => ((!query && !capability && !movement) || e.companyIds.some((id) => relatedIds.has(id))) && (fullHistory || !e.date || (eventDate(e.date) >= start && e.date <= config.asOf))).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

function ecosystemHref(values: Record<string, string | undefined>, current = '') {
  const params = new URLSearchParams(current);
  params.set('scope', 'anz');
  for (const [key, value] of Object.entries(values)) { if (value) params.set(key, value); else params.delete(key); }
  return `${config.path}?${params}`;
}


return { ...config, ANZ_COMPANIES, ANZ_PEOPLE, ANZ_EVENTS, ANZ_CUSTOMERS, ANZ_LINEAGES, ANZ_ACTIVE,
  CAPABILITIES: config.capabilities, anzCompany, companyPeople, peopleInLineage, companyEvents,
  companyMovement, searchAnz, movementEvents, ecosystemHref };
}
export type Ecosystem = ReturnType<typeof createEcosystem>;
