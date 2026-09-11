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
});
