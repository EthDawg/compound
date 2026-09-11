import { Atlas } from "@/components/atlas";
import { Suspense } from 'react';
import { GuideHeader } from '@/components/guide-header';
import { AtlasMaps } from '@/components/atlas-maps';
import { COMPANY_INDEX } from '@/lib/company-index';

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const id = typeof query.connections === 'string' ? query.connections : undefined;
  const company = COMPANY_INDEX.find(c => c.id === id);
  return {
    title: company ? `${company.name} connections · Compound` : id !== undefined ? 'Company connections · Compound' : 'Compound — the technology field guide',
    description: 'Find software companies and delivery partners, then explore their products, people, global dependencies and technical foundations.',
  };
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F7F6F1]"><GuideHeader/><main className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6"><AtlasMaps/><div role="status" className="mt-8 rounded-xl border border-[#DCDDD5] p-8 text-sm text-ink-500">Opening your landscape…</div></main></div>}><Atlas /></Suspense>;
}
