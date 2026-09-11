'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categoryHref, researchCategory, researchContext } from '@/lib/data/category-research';

/** The company keeps its identity; the visitor keeps the category they came from. */
export function ResearchWayfinding({ companyId, name, position }: { companyId: string; name: string; position: 'breadcrumb' | 'landscape' }) {
  const params = useSearchParams();
  const context = researchContext(companyId, params.get('category'));
  const category = researchCategory(context)!;
  if (position === 'landscape') return <Link href={`/?company=${companyId}&category=${context}`} className="inline-flex min-h-11 items-center underline underline-offset-4">Locate {name} in {category.name}</Link>;
  return <nav aria-label="Research breadcrumb" className="flex flex-wrap items-center gap-x-3 py-4 text-xs text-ink-500"><Link href="/categories" className="inline-flex min-h-11 items-center hover:underline">Category guides</Link><span>/</span><Link href={categoryHref(context)} className="inline-flex min-h-11 items-center hover:underline">{category.name}</Link></nav>;
}
