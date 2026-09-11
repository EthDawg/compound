import { Suspense } from 'react';
import { TechnologyView } from '@/components/technology-view';
export const metadata = { title: 'Technology: history, scale and possible futures — Compound', description: 'Turing, AI winters, technical breakthroughs, orbital physics and latency. An interactive field guide with sourced explorers.' };
export default function Page() { return <Suspense><TechnologyView /></Suspense>; }
