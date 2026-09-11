import { Suspense } from 'react';
import { WorkdayEcosystem } from '@/components/workday-ecosystem';

export const metadata={title:'Workday ANZ ecosystem — Compound Atlas',description:'People, capability and market movement in the ANZ Workday ecosystem. Follow sourced career lineage, local delivery evidence and company formation.'};
export default function Page(){return <Suspense fallback={<main className="p-8"><h1 className="text-3xl font-semibold">The people behind the practice.</h1><p className="mt-3">Loading ANZ people, capability and market movement…</p></main>}><WorkdayEcosystem/></Suspense>;}
