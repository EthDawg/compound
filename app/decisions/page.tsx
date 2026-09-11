import {DestinationLoading} from '@/components/destination-shell';
import { Suspense } from 'react';
import { DecisionView } from '@/components/decision-view';
export const metadata = { title: 'Technology decisions — Compound', description: 'A practical guide to innovation, adoption, delivery and commitment for CIOs, architects, finance and other technology buyers.' };
export default function Page() { return <Suspense fallback={<DestinationLoading active="decisions" title="Make the next commitment clear."/>}><DecisionView /></Suspense>; }
