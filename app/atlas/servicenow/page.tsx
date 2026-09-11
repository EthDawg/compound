import { Suspense } from 'react';
import { ServiceNowEcosystem } from '@/components/servicenow-ecosystem';
export const metadata = { title: 'ServiceNow ANZ ecosystem — Compound Atlas', description: 'The people, delivery capabilities and acquisition trails behind ANZ ServiceNow practices.' };
export default function Page() { return <Suspense fallback={<main className="p-8"><h1 className="text-3xl font-semibold">Who makes the platform work?</h1><p className="mt-3">Loading ANZ practices…</p></main>}><ServiceNowEcosystem /></Suspense>; }
