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
 capabilityGroups: [{label:'Service motion',values:['Advisory','Implementation','AMS','Resourcing']},{label:'Product domain',values:['HCM','Payroll','Finance','Adaptive','Student','Data / Integration / AI']}],
 insights: [
  {title:'GO changes the route to market.',text:'The 2026 launch brings local specialists into a new deployment route. Earlier AMS experience and recruited leaders help explain how they enter; repeat local outcomes show whether the practice matures.',ask:'Who has delivered this scope here, beyond the launch cohort?',companyIds:['synergy','mivada','kliqtek','echo']},
  {title:'The project role matters as much as the product.',text:'Prime implementation, customer-side advice, embedded talent, payroll operations and ongoing support can touch the same system. They are different commitments.',ask:'What does this firm own, and where does another team take over?',companyIds:['cloudrock','evoke','strada','fusion5']},
  {title:'Ownership creates options. Delivery shows conversion.',text:'UST/Intecrowd and CloudRock/SuccessDay change access to resources. Kainos and Cognizant have named local work to inspect. Parent scale alone does not establish a bigger ANZ bench.',ask:'Which people and references support the proposed team today?',companyIds:['intecrowd','cloudrock','kainos','cognizant']},
 ],
});
export const { ANZ_COMPANIES, ANZ_PEOPLE, ANZ_EVENTS, ANZ_CUSTOMERS, ANZ_LINEAGES, ANZ_ACTIVE, CAPABILITIES, anzCompany, companyPeople, peopleInLineage, companyEvents, companyMovement, searchAnz, movementEvents, ecosystemHref } = WORKDAY_ECOSYSTEM;

export function directoryRequested(params: URLSearchParams) {
  if (params.get('scope') === 'anz') return false;
  return params.get('scope') === 'global' || ['partner', 'service', 'product', 'region', 'industry', 'evidence', 'group', 'q', 'view'].some((key) => params.has(key));
}
