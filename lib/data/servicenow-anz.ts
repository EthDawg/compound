import research from './servicenow-anz.json';
import { createEcosystem, type EcosystemConfig } from './anz-ecosystem';
export const SERVICENOW_ECOSYSTEM = createEcosystem({
  id: 'servicenow', name: 'ServiceNow', path: '/atlas/servicenow', asOf: '2026-09-11',
  title: 'Who makes the platform work?',
  intro: 'Follow the ANZ teams behind the deployments: who builds them, what they deliver, and where the capability came from.',
  note: 'C&I means Consulting & Implementation. Partner segments are programme designations, not local headcount or a quality ranking. Credentials do not establish a named ANZ deployment. Market roles and watchpoints are Compound’s interpretation.',
  capabilities: ['Advisory', 'Implementation', 'AMS', 'Resourcing', 'IT', 'Employee', 'Customer', 'Risk / Security', 'Platform / Data / AI'],
  capabilityGroups: [
    { label: 'Service motion', values: ['Advisory', 'Implementation', 'AMS', 'Resourcing'] },
    { label: 'Workflow domain', values: ['IT', 'Employee', 'Customer', 'Risk / Security', 'Platform / Data / AI'] },
  ],
  research: research as EcosystemConfig['research'],
  insights: [
    {title:'Implementation and operation are converging.',text:'AC3, Datacom, Nexon and Spark connect platform work with ongoing technology relationships. A provider tenancy and a customer-owned instance create different operating choices.',ask:'Who owns the instance, configuration and support obligations?',companyIds:['ac3','datacom','nexon','spark']},
    {title:'Local depth often sits inside a larger group.',text:'Enable, Thirdera, RXP, TMLabs and Punch IT explain capability now carried by other brands. The acquisition date explains origin; the assigned team determines current delivery.',ask:'Which acquired specialists remain on this account?',companyIds:['fujitsu','cognizant','capgemini','coforge','gqi']},
    {title:'There is real local work beyond ITSM.',text:'IKC’s NEC NZ customer workflows, EY’s Lion transformation and Kinetic IT’s utility security work give the platform breadth concrete meaning. An AI roadmap still needs separate production evidence.',ask:'Can you show this workflow, with its exceptions, at a comparable customer?',companyIds:['ikc','ey','kinetic-it','sysintegra']},
  ],
});
