import research from './workday-anz.json';
import { createEcosystem, type EcosystemConfig } from './anz-ecosystem';
export type { Fact, Capability, Movement, CapabilityFact, AnzCompany, CareerStep, AnzPerson, AnzEvent, AnzCustomer, Lineage } from './anz-ecosystem';
export const ANZ_AS_OF = '2026-09-11';
export const WORKDAY_ECOSYSTEM = createEcosystem({
 id: 'workday', name: 'Workday', path: '/atlas/workday', asOf: ANZ_AS_OF,
 title: 'The people behind the practice.',
 intro: 'Follow the people, the capability they carry, and the firms being built around them.',
 note: 'Workday GO inclusion does not certify every capability in the matrix. The global directory remains a separate, dated view of published partner coverage.',
 capabilities: ['Advisory', 'Implementation', 'AMS', 'Resourcing', 'HCM', 'Payroll', 'Finance', 'Adaptive', 'Student', 'Data / Integration / AI'], research: research as EcosystemConfig['research'],
});
export const { ANZ_COMPANIES, ANZ_PEOPLE, ANZ_EVENTS, ANZ_CUSTOMERS, ANZ_LINEAGES, ANZ_ACTIVE, CAPABILITIES, anzCompany, companyPeople, peopleInLineage, companyEvents, companyMovement, searchAnz, movementEvents, ecosystemHref } = WORKDAY_ECOSYSTEM;

export function directoryRequested(params: URLSearchParams) {
  if (params.get('scope') === 'anz') return false;
  return params.get('scope') === 'global' || ['partner', 'service', 'product', 'region', 'industry', 'evidence', 'group', 'q', 'view'].some((key) => params.has(key));
}
