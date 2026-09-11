import {DestinationLoading} from '@/components/destination-shell';
import { Suspense } from 'react';
import { EarthView } from '@/components/earth-view';
export const metadata = { title: 'Global View — Compound', description: 'The markets, dependencies and physical foundations behind technology. A sourced world map with practical buyer implications.' };
export default function Page() { return <Suspense fallback={<DestinationLoading active="earth" title="Follow the system behind the software."/>}><EarthView /></Suspense>; }
