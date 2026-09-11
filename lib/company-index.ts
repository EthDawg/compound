import { ECOSYSTEM_INDEX, practiceLinks, type PracticeLink, type SearchContext } from "./ecosystem-index";
import type { Node } from "./data/atlas-nodes";
import type { CompanyId } from "./companies";
import { ALL_VENDORS } from "./data/atlas-nodes";
import { categoryById, sectorById } from "./data/atlas";
import { companyStudy, companyHref, switchCompanyHref } from "./companies";
import { MARKET_COMPANIES } from './data/earth';
import { researchCompany, researchCategory, researchHref, type ResearchCategoryId } from './data/category-research';

// Search vocabulary supplements the Atlas; it is not a second company registry.
const TERMS: Record<string, string[]> = {
  anthropic: ["Claude", "Claude Code", "Cowork"],
  openai: ["ChatGPT", "Codex"],
  elevenlabs: ["Eleven Labs", "ElevenAgents", "text to speech", "dubbing"],
  pageup: ["Page Up", "Clinch", "recruitment", "applicant tracking"],
  elmo: ["ELMO Software", "Breathe", "HR", "payroll"],
  "employment-hero": ["KeyPay", "Swag", "HR", "payroll"],
  rippling: ["HR", "payroll", "employee graph", "IT management"],
  workday: ["HCM", "HR", "finance", "Illuminate", "Sana", "Sana for Workday", "Sana Enterprise", "Adaptive Insights", "Adaptive Planning", "Aneel Bhusri", "Joel Hellermark"],
  servicenow: ["Service Now", "Now Assist", "ITSM", "service management"],
  salesforce: ["Agentforce", "CRM"],
  hubspot: ["CRM", "marketing"],
};

export interface IndexedCompany extends Pick<Node, 'id' | 'name' | 'sector' | 'category' | 'geo' | 'blurb' | 'archetype'> {
  categoryName: string; sectorName: string; terms: string[]; studyId?: CompanyId;
  appHref?: string; backstageHref?: string; readHref?: string; ecosystemHref?: string;
  availability: string; atlasListed: boolean; ecosystemLinks: PracticeLink[]; contexts: SearchContext[];
  marketLinks?: {label:string;href:string}[];
  researchCategories?: ResearchCategoryId[];
}
const atlasEntries: IndexedCompany[] = ALL_VENDORS.map((node) => {
  const study = companyStudy(node.id);
  const practice = ECOSYSTEM_INDEX.find((c) => c.id === node.id);
  const research = researchCompany(node.id);
  return {
    ...node,
    blurb: research?.thesis ?? node.blurb,
    categoryName: categoryById(node.category ?? "")?.name ?? "",
    sectorName: sectorById(node.sector)?.name ?? "",
    terms: [...(TERMS[node.id] ?? []), ...(practice?.terms ?? []), ...(research ? [research.product,...research.terms,...research.categories.map(id=>researchCategory(id)!.name)] : [])],
    researchCategories: research?.categories,
    studyId: study?.id,
    appHref: study ? companyHref(study.id, "app") : node.instance,
    backstageHref: study ? companyHref(study.id, "backstage") : undefined,
    readHref: research ? researchHref(node.id) : !study ? node.href : undefined,
    ecosystemHref: study?.ecosystem?.href,
    ecosystemLinks: practiceLinks(node.id), contexts: practice?.contexts ?? [], atlasListed: true,
    availability: study ? "App + Backstage" : research ? "Research brief" : node.instance ? "App study" : node.href ? "Deep read" : practice ? "Ecosystem profile" : "Atlas only",
  };
});
const practiceEntries: IndexedCompany[] = ECOSYSTEM_INDEX.filter((c) => !atlasEntries.some((a) => a.id === c.id)).map((c) => ({
  id: c.id, name: c.name, blurb: c.blurb, sector: 'delivery', category: 'ecosystem-practices',
  categoryName: c.links.map((l) => l.ecosystemName).join(' · ') + ' ecosystem',
  sectorName: 'Delivery & advisory', terms: c.terms, atlasListed: false, ecosystemLinks: c.links, contexts: c.contexts,
  availability: c.historical ? 'Lineage context' : 'Ecosystem profile',
}));
const knownEntries = [...atlasEntries, ...practiceEntries].map(c => ({...c,marketLinks:MARKET_COMPANIES.find(m=>m.id===c.id)?.links}));
const marketEntries: IndexedCompany[] = MARKET_COMPANIES.filter(c=>!knownEntries.some(k=>k.id===c.id)).map(c=>({id:c.id,name:c.name,blurb:c.blurb,terms:c.terms,sector:'world',category:'market-context',categoryName:'Referenced in global research',sectorName:'Technology in the world',availability:'Market context',atlasListed:false,ecosystemLinks:[],contexts:[],marketLinks:c.links}));
export const COMPANY_INDEX: IndexedCompany[] = [...knownEntries, ...marketEntries].sort((a, b) => a.name.localeCompare(b.name));
export const COMPANY_SECTORS = [...new Map(COMPANY_INDEX.map(c=>[c.sector,{id:c.sector,name:c.sectorName}])).values()];

export type CompanyMatch = { company: IndexedCompany; score: number; reason: string; context?: SearchContext };
export const normalizeSearch = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const compact = (value: string) => normalizeSearch(value).replace(/ /g, "");

function distance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

export function matchCompany(company: IndexedCompany, query: string): CompanyMatch | undefined {
  const q = normalizeSearch(query), c = compact(query), name = compact(company.name);
  if (!c) return;
  const hit = (score: number, reason = "", context?: SearchContext) => ({ company, score, reason, context });
  if (name === c) return hit(0);
  if (name.startsWith(c)) return hit(1);
  if (name.includes(c)) return hit(2);
  const companyWords=normalizeSearch(company.name).split(' ');
  const remaining=q.split(' ').filter(w=>!companyWords.includes(w)).join(' ');
  const contextQueries=[q,...(remaining&&remaining!==q?[remaining]:[])];
  const contextHits=company.contexts.flatMap(context=>{
    const scores=contextQueries.flatMap(query=>[context.term,...(context.aliases??[])].flatMap(term=>{
      if(compact(term)===compact(query))return [2];
      // Match word beginnings: "IT" must not resolve through the middle of "Mitch".
      const words=normalizeSearch(term).split(' ');
      const parts=query.split(' '),withContext=[...words,...normalizeSearch(context.detail).split(' ')];
      return parts.some(part=>words.some(word=>word.startsWith(part)))&&parts.every(part=>withContext.some(word=>word.startsWith(part)))?[3]:[];
    }));
    return scores.length?[{context,score:Math.min(...scores)}]:[];
  }).sort((a,b)=>a.score-b.score);
  if(contextHits.length){const {context,score}=contextHits[0];return hit(score,`${context.term} · ${context.kind}`,context);}
  const term = company.terms.find((t) => compact(t).includes(c));
  if (term) return hit(compact(term) === c ? 2 : 3, term);
  const metadata = [company.name, ...company.terms, ...company.contexts.map((x) => x.term), company.categoryName, company.sectorName, company.archetype ?? "", company.blurb].join(" ");
  if (q.split(" ").every((word) => normalizeSearch(metadata).includes(word))) return hit(5, company.categoryName);
  // Only tolerate small spelling errors in company names, after four characters.
  if (c.length >= 4 && Math.abs(c.length - name.length) <= (c.length > 6 ? 2 : 1) && distance(c, name) <= (c.length > 6 ? 2 : 1)) return hit(7, "Close spelling");
}

export function relatedCompanies(company: IndexedCompany) {
  return COMPANY_INDEX.filter((c) => c.id !== company.id && c.availability !== 'Lineage context').flatMap((c) => {
    if (company.researchCategories?.length) {
      const shared = company.researchCategories.filter(id=>c.researchCategories?.includes(id));
      if (!shared.length) return [];
      const sameRole=researchCompany(company.id)?.group===researchCompany(c.id)?.group;
      return [{company:c,score:sameRole?10:1,reason:`${sameRole?'Similar role':'Related layer'} · ${researchCategory(shared[0])!.shortName}`}];
    }
    if (company.category==='market-context') {
      const shared=c.marketLinks?.find(l=>company.marketLinks?.some(s=>s.href===l.href));
      return shared?[{company:c,score:1,reason:`Connected in ${shared.label}`}]:[];
    }
    const shared = c.ecosystemLinks.filter((p) => !p.historical && company.ecosystemLinks.some((s) => s.ecosystemId === p.ecosystemId));
    if (company.ecosystemLinks.length) {
      if (!shared.length) return [];
      const role = shared.find((p) => company.ecosystemLinks.some((s) => s.ecosystemId === p.ecosystemId && s.context === p.context));
      const domains = new Set(company.contexts.filter((x) => x.kind === 'Capability').map((x) => x.term));
      const overlap = new Set(c.contexts.filter((x) => x.kind === 'Capability' && domains.has(x.term)).map((x) => x.term)).size;
      return [{ company: c, score: (role ? 20 : 0) + overlap, reason: `${shared.map((p) => p.ecosystemName).join(' / ')}${role ? ` · ${role.context}` : ' · same ecosystem'}` }];
    }
    return c.category === company.category ? [{company:c, score:Number(!!c.studyId), reason:c.categoryName}] : [];
  }).sort((a,b) => b.score-a.score || a.company.name.localeCompare(b.company.name)).slice(0,3);
}

export function searchCompanies(query: string): CompanyMatch[] {
  return COMPANY_INDEX.flatMap((company) => {
    const match = matchCompany(company, query);
    return match ? [match] : [];
  }).sort((a, b) => a.score - b.score || Number(!!b.company.studyId) - Number(!!a.company.studyId) || a.company.name.localeCompare(b.company.name));
}

export const atlasCompanyHref = (id: string) => `/?company=${encodeURIComponent(id)}`;
export function companyDestination(company: IndexedCompany, pathname: string): string {
  if (pathname.startsWith('/atlas/') && company.ecosystemHref) return company.ecosystemHref;
  const practice = company.ecosystemLinks.find((p) => pathname.startsWith(`/atlas/${p.ecosystemId}`)) ?? company.ecosystemLinks[0];
  if (pathname.startsWith('/atlas/') && practice) return practice.href;
  if (company.studyId) return switchCompanyHref(company.studyId, pathname);
  if (company.researchCategories?.length && company.readHref) return company.readHref;
  if (!company.appHref && !company.readHref && practice) return practice.href;
  if (!company.atlasListed && company.marketLinks?.length) return company.marketLinks[0].href;
  return (pathname.includes("/backstage") ? company.readHref : company.appHref) ?? atlasCompanyHref(company.id);
}

export function recentCompanies(value: unknown, current?: string): string[] {
  const valid = new Set(COMPANY_INDEX.map((c) => c.id));
  return [...new Set([current, ...(Array.isArray(value) ? value : [])])].filter((id): id is string => typeof id === "string" && valid.has(id)).slice(0, 6);
}

export type CompanyVisit={id:string;href:string};
/** Accept only a known company's internal destination; old ID-only history still works. */
export function recentCompanyVisits(value:unknown,visit?:CompanyVisit):CompanyVisit[]{
 const raw=Array.isArray(value)?value:typeof value==='object'&&value!==null&&'entries'in value&&Array.isArray(value.entries)?value.entries:[];
 const seen=new Set<string>();
 return [visit,...raw].flatMap(item=>{
  const id=typeof item==='string'?item:typeof item==='object'&&item!==null&&'id'in item?item.id:undefined;
  const company=COMPANY_INDEX.find(c=>c.id===id);
  if(!company||seen.has(company.id))return [];
  const href=typeof item==='object'&&item!==null&&'href'in item?item.href:companyDestination(company,'/');
  if(typeof href!=='string'||!href.startsWith('/')||href.startsWith('//')||href.length>1500)return [];
  let url:URL;try{url=new URL(href,'https://compound.invalid');}catch{return [];}
  if(url.origin!=='https://compound.invalid')return [];
  const p=url.pathname,query=url.searchParams;
  const study=company.studyId&&p.startsWith(`/companies/${company.id}/`)&&(p===company.appHref||p===company.backstageHref||p.startsWith(`/companies/${company.id}/app/`)||p.startsWith(`/companies/${company.id}/backstage/`));
  const map=company.atlasListed&&p==='/'&&query.get('company')===company.id;
  const practice=company.ecosystemLinks.some(l=>p===new URL(l.href,'https://compound.invalid').pathname&&query.get('firm')===company.id);
  const ecosystem=company.ecosystemHref&&p===company.ecosystemHref&&!query.get('firm');
  const market=company.marketLinks?.some(l=>{const target=new URL(l.href,'https://compound.invalid');return p===target.pathname&&query.get('market')===target.searchParams.get('market');});
  const other=p===company.appHref||p===company.readHref;
  if(!study&&!map&&!practice&&!ecosystem&&!market&&!other)return [];
  seen.add(company.id);return [{id:company.id,href:url.pathname+url.search+url.hash}];
 }).slice(0,6);
}
