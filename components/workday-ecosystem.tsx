'use client';
import { useSearchParams } from 'next/navigation';
import { WorkdayPartnerAtlas } from './workday-partner-atlas';
import { AnzEcosystem } from './anz-ecosystem';
import { WORKDAY_ECOSYSTEM, directoryRequested } from '@/lib/data/workday-anz';
export function WorkdayEcosystem() {
 const params = useSearchParams();
 return directoryRequested(new URLSearchParams(params.toString())) ? <WorkdayPartnerAtlas /> : <AnzEcosystem ecosystem={WORKDAY_ECOSYSTEM} />;
}
