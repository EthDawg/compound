import world from './world-research.json';
import workday from './workday-anz.json';
import servicenow from './servicenow-anz.json';

export type ConnectionKind = 'Distribution' | 'Supply' | 'Collaboration' | 'Acquisition' | 'People lineage' | 'Delivery';
export type ConnectionSource = { title: string; url: string; checked: string };
export type CompanyConnection = {
  id: string; from: string; to: string; kind: ConnectionKind;
  verb: string; date: string; status: string; detail: string; limit: string;
  sources: ConnectionSource[]; context?: { label: string; href: string };
};

function worldSource(id: string): ConnectionSource {
  const source = world.sources.find(s => s.id === id);
  if (!source) throw new Error(`Missing connection source: ${id}`);
  return { title: source.title, url: source.url, checked: source.checked };
}

// Endpoints are curated. An event's companyIds can include a later owner or a
// founder's next company; they must never become pairwise acquisition edges.
function acquisition(ecosystem: 'workday' | 'servicenow', eventId: string, from: string, to: string, verb: string, status: string): CompanyConnection {
  const data = ecosystem === 'workday' ? workday : servicenow;
  const event = data.events.find(e => e.id === eventId);
  if (!event) throw new Error(`Missing acquisition event: ${eventId}`);
  return { id: eventId, from, to, kind: 'Acquisition', verb, status,
    date: event.dateLabel, detail: event.text, limit: event.implication,
    sources: [{ title: event.title, url: event.url, checked: '2026-09-11' }],
    context: { label: 'Trace the acquisition', href: `/atlas/${ecosystem}?firm=${to}&lens=movement&period=all#movement-timeline` },
  };
}

function person(ecosystem: 'workday' | 'servicenow', id: string, from: string, to: string, verb: string, date: string): CompanyConnection {
  const data = ecosystem === 'workday' ? workday : servicenow;
  const p = data.people.find(p => p.id === id);
  if (!p) throw new Error(`Missing lineage person: ${id}`);
  if (p.companyId !== to) throw new Error(`Lineage destination differs from recorded role: ${id}`);
  const career = p.career.find(c => c.companyId === from);
  if (!career) throw new Error(`Missing career at ${from}: ${id}`);
  return { id: `person-${id}`, from, to, kind: 'People lineage', verb, date,
    status: 'Recorded career', detail: `${p.name}: ${career.role} at ${data.companies.find(c => c.id === from)?.name ?? from}; ${p.current.text} at ${data.companies.find(c => c.id === to)?.name ?? to} in the recorded profile.`,
    limit: `${p.reading} This is a person's career link, not a company acquisition or a whole-team transfer.`,
    sources: [...new Map([
      { title: `${p.name} · earlier role`, url: career.url, checked: '2026-09-11' },
      { title: `${p.name} · role on record`, url: p.current.url, checked: '2026-09-11' },
      ...p.career.filter(c => c.companyId === to).map(c => ({ title: `${p.name} · ${c.when}`, url: c.url, checked: '2026-09-11' })),
    ].map(s => [s.url, s])).values()],
    context: { label: `Follow ${p.name}`, href: `/atlas/${ecosystem}?firm=${to}&lens=people&person=${id}` },
  };
}

const providers = [
  { id: 'fireworks', slug: 'fireworks-ai', name: 'Fireworks' },
  { id: 'together-ai', slug: 'together', name: 'Together' },
  { id: 'groq', slug: 'groq', name: 'Groq' },
];

/** A deliberately small set of sourced relationships, not a complete graph. */
export const COMPANY_CONNECTIONS: CompanyConnection[] = [
  ...providers.map(p => ({
    id: `hf-${p.id}`, from: 'hugging-face', to: p.id, kind: 'Distribution' as const,
    verb: 'routes supported model requests to', date: 'Checked 12 September 2026', status: 'Documented integration',
    detail: `Hugging Face Inference Providers exposes ${p.name} as a selectable execution provider for supported models.`,
    limit: 'Hugging Face handles discovery and routing; the selected provider executes the supported request. Model and task coverage vary by provider. Integration does not imply ownership or exclusivity.',
    sources: [{ title: `Hugging Face · ${p.name} provider documentation`, url: `https://huggingface.co/docs/inference-providers/providers/${p.slug}`, checked: '2026-09-12' }],
  })),
  { id: 'zeiss-asml', from: 'zeiss-smt', to: 'asml', kind: 'Supply', verb: 'supplies lithography optics to',
    date: '1 April 2025 · company account', status: 'Reported relationship',
    detail: 'ZEISS SMT develops and supplies the optics at the heart of ASML lithography systems.',
    limit: 'An upstream manufacturing dependency; the source does not establish shipment volumes or a freight route.', sources: [worldSource('zeiss-euv')] },
  { id: 'asml-tsmc', from: 'asml', to: 'tsmc', kind: 'Supply', verb: 'collaborates on fabrication tools with',
    date: 'Checked 11 September 2026', status: 'Reported relationship',
    detail: 'ASML describes its close relationship with TSMC. TSMC documents EUV use in its N7+ manufacturing process.',
    limit: 'This links equipment and fabrication expertise. It does not count the tools installed in any individual fab.', sources: [worldSource('asml-taiwan'), worldSource('tsmc-n7')] },
  { id: 'tsmc-nvidia', from: 'tsmc', to: 'nvidia', kind: 'Supply', verb: 'fabricates Blackwell chips for',
    date: '18 March 2024 · Blackwell announcement', status: 'Published design specification',
    detail: 'NVIDIA specifies a custom TSMC 4NP process for its Blackwell GPU design.',
    limit: 'Specific to this design and process. It does not establish shipment volume or the geography of every NVIDIA product.', sources: [worldSource('nvidia-blackwell')] },
  { id: 'hynix-tsmc', from: 'sk-hynix', to: 'tsmc', kind: 'Collaboration', verb: 'announced HBM4 development with',
    date: '19 April 2024 · MOU', status: 'Announced collaboration',
    detail: 'SK hynix and TSMC signed an MOU covering HBM4 base-die development and advanced packaging integration.',
    limit: 'A development agreement and intended manufacturing approach, not proof that the planned volumes have shipped.', sources: [worldSource('hynix-tsmc')] },
  acquisition('workday', 'tom-acquisition', 'collaborative', 'theory-of-mind', 'announced the acquisition of', 'Acquisition announced'),
  acquisition('workday', 'cog-acquisition', 'cognizant', 'collaborative', 'completed the acquisition of', 'Acquisition completed'),
  acquisition('workday', 'versor-sale', 'fujitsu', 'versor', 'acquired', 'Acquisition effective'),
  acquisition('servicenow', 'enable-fujitsu', 'fujitsu', 'enable', 'acquired', 'Acquisition recorded'),
  acquisition('servicenow', 'epicon-telstra', 'telstra-purple', 'epicon', 'expanded through the acquisition of', 'Historical acquisition'),
  { id: 'infosys-optimum', from: 'infosys', to: 'optimum-healthcare-it', kind: 'Acquisition', verb: 'completed the acquisition of',
    date: '5 May 2026', status: 'Acquisition completed',
    detail: 'Infosys completed the acquisition of Optimum Healthcare IT, adding US healthcare provider expertise.',
    limit: 'A global capability acquisition. It does not establish that the acquired expertise is staffed or delivering in ANZ.', sources: [worldSource('infosys-optimum')] },
  { id: 'cognizant-workday', from: 'cognizant', to: 'workday', kind: 'Delivery', verb: 'implemented HCM and payroll on',
    date: 'Case checked 11 September 2026', status: 'Named customer case',
    detail: 'Federation University in Victoria worked with Cognizant on Workday HCM and payroll, followed by EBA work.',
    limit: 'Evidence for this named engagement. Finance and Student were future phases in the case, not completed delivery evidence.', sources: [worldSource('federation')],
    context: { label: 'See the ANZ delivery evidence', href: '/atlas/workday?firm=cognizant&lens=capability' } },
  person('workday', 'duane-goff', 'theory-of-mind', 'synergy', 'co-founder Duane Goff later joined', '2012 founding → December 2025 appointment'),
  person('workday', 'mitch-collins', 'cognizant', 'kainos', 'alumnus Mitch Collins later led APAC delivery at', 'Earlier role 2021–2025 · profile checked September 2026'),
  person('workday', 'dougall-mcburnie', 'versor', 'kliqtek', 'co-founder Dougall McBurnie later co-founded', 'Earlier Versor career → Kliqtek, 2024'),
  person('servicenow', 'wayne-gowland', 'epicon', 'xamplify', 'former CEO Wayne Gowland later co-founded', 'Epicon through 2020 sale · later published biography'),
];

export const connectionsFor = (id: string) => COMPANY_CONNECTIONS.filter(c => c.from === id || c.to === id);
export const connectionOther = (connection: CompanyConnection, id: string) => connection.from === id ? connection.to : connection.from;
