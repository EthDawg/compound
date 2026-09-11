import { ECOSYSTEM_INDEX, practiceLinks, type PracticeLink } from "./ecosystem-index";
import type { Node } from "./data/atlas-nodes";
import type { CompanyId } from "./companies";
import { ALL_VENDORS } from "./data/atlas-nodes";
import { categoryById, sectorById } from "./data/atlas";
import { companyStudy, companyHref, switchCompanyHref } from "./companies";

// Search vocabulary supplements the Atlas; it is not a second company registry.
const TERMS: Record<string, string[]> = {
  anthropic: ["Claude", "Claude Code", "Cowork"],
  openai: ["ChatGPT", "Codex"],
  elevenlabs: ["Eleven Labs", "ElevenAgents", "text to speech", "dubbing"],
  pageup: ["Page Up", "Clinch", "recruitment", "applicant tracking"],
  elmo: ["ELMO Software", "Breathe", "HR", "payroll"],
  "employment-hero": ["KeyPay", "Swag", "HR", "payroll"],
  rippling: ["HR", "payroll", "employee graph", "IT management"],
  workday: ["HCM", "HR", "finance", "Illuminate"],
  servicenow: ["Service Now", "Now Assist", "ITSM", "service management"],
  salesforce: ["Agentforce", "CRM"],
  hubspot: ["CRM", "marketing"],
};

export interface IndexedCompany extends Pick<Node, 'id' | 'name' | 'sector' | 'category' | 'geo' | 'blurb' | 'archetype'> {
  categoryName: string; sectorName: string; terms: string[]; studyId?: CompanyId;
  appHref?: string; backstageHref?: string; readHref?: string; ecosystemHref?: string;
  availability: string; atlasListed: boolean; ecosystemLinks: PracticeLink[];
}
const atlasEntries: IndexedCompany[] = ALL_VENDORS.map((node) => {
  const study = companyStudy(node.id);
  const practice = ECOSYSTEM_INDEX.find((c) => c.id === node.id);
  return {
    ...node,
    categoryName: categoryById(node.category ?? "")?.name ?? "",
    sectorName: sectorById(node.sector)?.name ?? "",
    terms: [...(TERMS[node.id] ?? []), ...(practice?.terms ?? [])],
    studyId: study?.id,
    appHref: study ? companyHref(study.id, "app") : node.instance,
    backstageHref: study ? companyHref(study.id, "backstage") : undefined,
    readHref: !study ? node.href : undefined,
    ecosystemHref: study?.ecosystem?.href,
    ecosystemLinks: practiceLinks(node.id), atlasListed: true,
    availability: study ? "App + Backstage" : node.instance ? "App study" : node.href ? "Deep read" : practice ? "Ecosystem profile" : "Atlas only",
  };
});
const practiceEntries: IndexedCompany[] = ECOSYSTEM_INDEX.filter((c) => !atlasEntries.some((a) => a.id === c.id)).map((c) => ({
  id: c.id, name: c.name, blurb: c.blurb, sector: 'delivery', category: 'ecosystem-practices',
  categoryName: c.links.map((l) => l.ecosystemName).join(' · ') + ' ecosystem',
  sectorName: 'Delivery & advisory', terms: c.terms, atlasListed: false, ecosystemLinks: c.links,
  availability: c.historical ? 'Lineage context' : 'Ecosystem profile',
}));
export const COMPANY_INDEX = [...atlasEntries, ...practiceEntries].sort((a, b) => a.name.localeCompare(b.name));

export type CompanyMatch = { company: IndexedCompany; score: number; reason: string };
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
  const hit = (score: number, reason = "") => ({ company, score, reason });
  if (name === c) return hit(0);
  if (name.startsWith(c)) return hit(1);
  if (name.includes(c)) return hit(2);
  const term = company.terms.find((t) => compact(t).includes(c));
  if (term) return hit(compact(term) === c ? 2 : 3, term);
  const metadata = [company.categoryName, company.sectorName, company.archetype ?? "", company.blurb].join(" ");
  if (q.split(" ").every((word) => normalizeSearch(metadata).includes(word))) return hit(5, company.categoryName);
  // Only tolerate small spelling errors in company names, after four characters.
  if (c.length >= 4 && Math.abs(c.length - name.length) <= (c.length > 6 ? 2 : 1) && distance(c, name) <= (c.length > 6 ? 2 : 1)) return hit(7, "Close spelling");
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
  if (!company.appHref && !company.readHref && practice) return practice.href;
  return (pathname.includes("/backstage") ? company.readHref : company.appHref) ?? atlasCompanyHref(company.id);
}

export function recentCompanies(value: unknown, current?: string): string[] {
  const valid = new Set(COMPANY_INDEX.map((c) => c.id));
  return [...new Set([current, ...(Array.isArray(value) ? value : [])])].filter((id): id is string => typeof id === "string" && valid.has(id)).slice(0, 6);
}
