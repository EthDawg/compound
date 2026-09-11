import { Suspense } from 'react';
import { EarthView } from '@/components/earth-view';
export const metadata = { title: 'Global View — Compound', description: 'The markets, dependencies and physical foundations behind technology. A sourced world map with practical buyer implications.' };
export default function Page() { return <Suspense><EarthView /></Suspense>; }
