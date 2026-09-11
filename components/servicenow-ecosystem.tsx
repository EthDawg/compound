'use client';
import { AnzEcosystem } from './anz-ecosystem';
import { SERVICENOW_ECOSYSTEM } from '@/lib/data/servicenow-anz';
export function ServiceNowEcosystem() { return <AnzEcosystem ecosystem={SERVICENOW_ECOSYSTEM} />; }
