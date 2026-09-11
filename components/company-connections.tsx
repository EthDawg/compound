'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { COMPANY_INDEX, companyConnectionsHref, type IndexedCompany } from '@/lib/company-index';
import { connectionsFor, connectionOther, type ConnectionKind } from '@/lib/data/company-connections';
import { companyStudy } from '@/lib/companies';
import { researchCompany } from '@/lib/data/category-research';
import { Mark } from './vendor/marks';
import styles from './company-connections.module.css';

const kinds: Record<ConnectionKind, string> = {
  Distribution: '#6D4794', Supply: '#386146', Collaboration: '#42658D',
  Acquisition: '#815B36', 'People lineage': '#9B485C', Delivery: '#076D79',
};
const examples = [
  { id: 'fireworks', label: 'Fireworks AI', reason: 'Follow model distribution' },
  { id: 'nvidia', label: 'NVIDIA', reason: 'Trace the manufacturing chain' },
  { id: 'cognizant', label: 'Cognizant', reason: 'People, ownership and delivery' },
  { id: 'fujitsu', label: 'Fujitsu', reason: 'Where acquired capability came from' },
];
const name = (id: string) => COMPANY_INDEX.find(c => c.id === id)?.name ?? id;

export function CompanyMapModes({ connections = false, company, landscapeHref }: { connections?: boolean; company?: IndexedCompany; landscapeHref?: string }) {
  return <nav aria-label="Company map view" className="flex flex-wrap gap-1 py-4 text-xs font-semibold">
    <Link href={landscapeHref ?? (company?.atlasListed ? `/?company=${company.id}` : '/')} aria-current={!connections ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 ${!connections ? 'bg-ink text-white' : 'text-ink-500 hover:bg-ink-100'}`}>Landscape</Link>
    <Link href={companyConnectionsHref(company?.id ?? 'fireworks')} aria-current={connections ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 ${connections ? 'bg-ink text-white' : 'text-ink-500 hover:bg-ink-100'}`}>Connections</Link>
  </nav>;
}

function Identity({ company }: { company: IndexedCompany }) {
  const research = researchCompany(company.id);
  const study = companyStudy(company.id);
  const accent = research?.accent ?? study?.brand.chrome ?? '#514E44';
  return <>
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-black/10 bg-white" style={{ color: accent }}>
        {company.studyId ? <Mark id={company.id} className="h-7 w-7" /> : <span className="text-lg font-semibold">{research?.monogram ?? company.name.slice(0, 2)}</span>}
      </span>
      <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Selected company</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{company.name}</h2></div>
    </div>
    <p className="mt-4 text-[11px] font-medium" style={{ color: accent }}>{research?.product ?? company.categoryName}</p>
    <p className="mt-2 text-sm leading-relaxed text-ink-600">{company.blurb}</p>
    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
      {company.atlasListed && !company.appHref && !company.readHref && <Link href={`/?company=${company.id}`} className={styles.action}>View in landscape →</Link>}
      {company.appHref && <Link href={company.appHref} className={styles.action}>Open App →</Link>}
      {company.backstageHref && <Link href={company.backstageHref} className={styles.action}>Backstage →</Link>}
      {company.readHref && <Link href={company.readHref} className={styles.action}>Read company brief →</Link>}
      {company.ecosystemHref && <Link href={company.ecosystemHref} className={styles.action}>ANZ ecosystem →</Link>}
      {company.ecosystemLinks.map(p => <Link key={p.href} href={p.href} className={styles.action}>{p.ecosystemName} · ANZ {p.historical ? 'lineage' : 'practice'} →</Link>)}
      {company.marketLinks?.map(p => <Link key={p.href} href={p.href} className={styles.action}>{p.label} →</Link>)}
    </div>
    <p className="mt-3 text-[10px] text-ink-500">{company.availability}</p>
  </>;
}

export function CompanyConnections({ id }: { id: string }) {
  const company = COMPANY_INDEX.find(c => c.id === id);
  const edges = connectionsFor(id);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(id);
  useEffect(() => {
    if (previous.current !== id) heading.current?.focus({ preventScroll: true });
    previous.current = id;
  }, [id]);

  return <>
    <CompanyMapModes connections company={company} />
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-ink-500">Company connections</p>
        <h1 ref={heading} tabIndex={-1} className="mt-2 font-serif-display text-3xl leading-tight outline-none sm:text-4xl">{company ? `Behind ${company.name}` : 'Choose a company to follow'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">Follow a link to see the next company’s connections. Use the company finder above to start anywhere.</p>
      </div>
      {company && <p className="text-xs text-ink-500">{edges.length} documented {edges.length === 1 ? 'connection' : 'connections'} · selected research</p>}
    </div>

    {company ? edges.length ? <section className={styles.map} aria-label={`Connections for ${company.name}`}>
      <section className={styles.identity} style={{ gridRow: `1 / span ${edges.length}` }}><Identity company={company} /></section>
      {edges.map((edge, i) => {
        const other = connectionOther(edge, id);
        const neighbour = COMPANY_INDEX.find(c => c.id === other)!;
        return <div key={edge.id} className={styles.branch} style={{ gridRow: i + 1 }}>
          <span aria-hidden="true" className={`${styles.connector} ${i === 0 ? styles.first : ''} ${i === edges.length - 1 ? styles.last : ''}`} />
          <article className={styles.node}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]"><span className="font-bold uppercase tracking-wider" style={{ color: kinds[edge.kind] }}>{edge.kind}</span><span className="text-ink-500">{edge.status}</span></div>
            <Link href={companyConnectionsHref(other)} className="mt-1 flex min-h-11 items-center justify-between gap-3 rounded-md text-lg font-semibold tracking-tight underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky">{neighbour.name}<span aria-hidden="true" className="text-ink-400">→</span></Link>
            <p className="text-xs leading-relaxed text-ink-600"><strong className="font-semibold">{name(edge.from)}</strong> {edge.verb} <strong className="font-semibold">{name(edge.to)}</strong>.</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3"><p className="text-[10px] text-ink-500">{edge.date}</p><a href={`#connection-${edge.id}`} className="inline-flex min-h-11 items-center rounded text-[11px] font-semibold underline underline-offset-4">Evidence & scope ↓</a></div>
          </article>
        </div>;
      })}
    </section> : <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className="rounded-2xl border border-ink-200 bg-white p-5"><Identity company={company} /></section>
      <div className="rounded-2xl border border-dashed border-ink-300 p-6"><h2 className="text-lg font-semibold">Connections haven’t been mapped here yet.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">{company.name} is in the catalogue. The links alongside open the context already available; a missing connection here says nothing about the company’s actual relationships.</p></div>
    </div> : <p className="rounded-xl border border-ink-200 bg-white p-5 text-sm text-ink-500">This company identifier isn’t in the catalogue. Search for a company above, or start with an example below.</p>}

    {!!edges.length && <section aria-labelledby="connection-evidence" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-200 pb-4"><h2 id="connection-evidence" className="text-xl font-semibold tracking-tight">What connects them</h2><p className="text-xs text-ink-500">Dates and scope belong to each fact.</p></div>
      <div className="grid items-start gap-4 pt-4 md:grid-cols-2">{edges.map(edge => <article key={edge.id} id={`connection-${edge.id}`} tabIndex={-1} className="scroll-mt-24 rounded-xl border border-ink-200 bg-white p-5 focus:outline focus:outline-2 focus:outline-sky">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: kinds[edge.kind] }}>{edge.kind} · {edge.status}</p>
        <h3 className="mt-2 text-base font-semibold leading-snug">{name(edge.from)} {edge.verb} {name(edge.to)}</h3>
        <p className="mt-2 text-[11px] text-ink-500">{edge.date}</p>
        <p className="mt-3 text-sm leading-relaxed">{edge.detail}</p>
        <p className="mt-3 text-xs leading-relaxed text-ink-500">{edge.limit}</p>
        <ul className="mt-3 border-t border-ink-100 pt-2">{edge.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded text-xs font-medium underline underline-offset-4">{source.title} ↗</a><span className="block text-[10px] text-ink-500">Checked {source.checked}</span></li>)}</ul>
        {edge.context && <Link href={edge.context.href} className="mt-3 inline-flex min-h-11 items-center rounded text-xs font-semibold underline underline-offset-4">{edge.context.label} →</Link>}
      </article>)}</div>
    </section>}

    <section aria-label="Start another company connection" className="mt-8 border-t border-ink-200 pt-5">
      <h2 className="text-sm font-semibold">Start with a different thread</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{examples.map(example => <Link key={example.id} href={companyConnectionsHref(example.id)} aria-current={id === example.id ? 'page' : undefined} className="rounded-xl border border-ink-200 bg-white p-4 hover:bg-ink-50"><span className="block text-sm font-semibold">{example.label} →</span><span className="mt-1 block text-xs leading-relaxed text-ink-500">{example.reason}</span></Link>)}</div>
      <p className="mt-4 text-[11px] leading-relaxed text-ink-500">This is a growing, sourced selection. A link shows the specific relationship written on it; appearing together does not make two companies owners, partners or peers.</p>
    </section>
  </>;
}
