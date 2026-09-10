import { Suspense } from 'react';
import { WorkdayPartnerAtlas } from '@/components/workday-partner-atlas';

export const metadata={title:'Workday partner network — Compound Atlas',description:'Explore Workday systems integrators, service partners and specialists. Search firms, compare published services and products, and follow original sources.'};
export default function Page(){return <Suspense fallback={<main className="p-8"><h1 className="text-3xl font-semibold">Workday’s delivery ecosystem.</h1><p className="mt-3">Loading the partner network…</p></main>}><WorkdayPartnerAtlas/></Suspense>;}
