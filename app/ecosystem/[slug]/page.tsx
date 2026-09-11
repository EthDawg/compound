import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { DEEP, deepBySlug } from "@/lib/content/ecosystem-deep";
import { ALL_COMPANIES, LENSES, volatility, companyBySlug, staleness } from "@/lib/data/ecosystem";
import { crankFor } from "@/lib/content/ecosystem-crank";
import { companyStudy, companyHref, COMPANIES } from "@/lib/companies";
import * as I from "@/components/icons";
import { SiEvidence } from '@/components/si-evidence';

export function generateStaticParams() { return [...new Set([...DEEP.map(d=>d.slug), ...COMPANIES.filter(c=>c.strategy).map(c=>c.id)])].map(slug=>({slug})); }

export default async function Position({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = deepBySlug(slug);
  const c = companyBySlug(slug);
  const study = companyStudy(slug);
  if(study?.strategy)permanentRedirect(companyHref(study.id, "backstage"));
  if (!d || !c) notFound();

  const { ranks, spread } = volatility(c, ALL_COMPANIES);
  const crank = crankFor(slug);
  const fresh = staleness(c);
  const i = DEEP.findIndex((x) => x.slug === slug);
  const prev = DEEP[i - 1], next = DEEP[i + 1];

  return (
    <div className="min-h-screen bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[880px] items-center gap-3 px-4 sm:px-6">
          <Link href="/ecosystem" className="flex items-center gap-1.5 text-[13px] text-ink-400 hover:text-white">
            <I.IChevron className="h-3 w-3 rotate-180" /> The map
          </Link>
          <div className="ml-auto flex gap-2">
            <Link href={study ? companyHref(study.id, "backstage") : "/desk"} className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">{study ? `${study.name} Backstage` : "Desk"}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[880px] px-4 pb-20 sm:px-6">
        <div className="border-b border-white/10 py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-signal">{c.archetype}</span>
            <span className="text-ink-600">·</span>
            <span className="text-[11.5px] text-ink-500">{c.geo}</span>
          </div>
          <h1 className="font-serif-display mt-2 text-[34px] font-normal leading-[1.13] tracking-tight text-white sm:text-[40px]">
            {d.title}
          </h1>
          <p className="prose-measure mt-3 text-[17px] leading-[1.5] text-signal">{d.headline}</p>
        </div>

        {/* Rank strip */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LENSES.map((l, n) => (
            <div key={l.id} className="rounded-lg bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/10">
              <div className="num text-[19px] font-semibold leading-none text-white">#{ranks[n]}</div>
              <div className="mt-1 text-[10.5px] leading-tight text-ink-500">{l.pill}</div>
            </div>
          ))}
        </div>
        {spread >= 12 && (
          <p className="mt-2 text-[12.5px] text-clay">
            Moves {spread} places depending on which definition of relevance you use.
          </p>
        )}

        <Block label="The bet" body={d.bet} accent />
        <Block label="The premise it rests on" body={d.premise} />
        <SiEvidence id={slug} />

        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-500">What has to be true</h2>
          <ol className="prose-measure mt-3 space-y-3">
            {d.mustBeTrue.map((m, n) => (
              <li key={n} className="flex gap-3.5 text-[15px] leading-[1.65] text-ink-200">
                <span className="num mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-signal">
                  {n + 1}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-7 rounded-xl bg-sky/[0.07] p-5 ring-1 ring-sky/25">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky">Agentic position</div>
          <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-100">{d.agentic.position}</p>
          <p className="prose-measure mt-3 border-t border-sky/20 pt-3 text-[14px] leading-[1.65] text-ink-300">
            <span className="font-semibold text-sky">The tell: </span>{d.agentic.tell}
          </p>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <List label="Where it wins" items={d.wins} tone="moss" />
          <List label="Where it loses" items={d.loses} tone="clay" />
        </div>

        <section className="mt-6 rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">What would prove it wrong</div>
          <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-200">{d.falsifier}</p>
        </section>

        {d.paradox && (
          <section className="mt-4 rounded-xl bg-clay/[0.09] p-5 ring-1 ring-clay/30">
            <div className="text-[11px] font-bold uppercase tracking-wider text-clay">The relevance paradox</div>
            <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-100">{d.paradox}</p>
          </section>
        )}

        <section className="mt-4 rounded-xl bg-signal/[0.07] p-5 ring-1 ring-signal/25">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Against the compound thesis</div>
          <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-100">{d.vsCompound}</p>
        </section>

        {crank && (
          <>
            <section className="mt-7">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-500">What this bet demands of the people running it</h2>
              <p className="prose-measure mt-1.5 text-[13.5px] leading-[1.6] text-ink-500">
                Capabilities, not values — things an organisation can be observed doing well or badly.
              </p>
              <div className="mt-3 space-y-2.5">
                {crank.skills.map((sk) => (
                  <div key={sk.name} className="rounded-lg bg-white/[0.04] px-4 py-3.5 ring-1 ring-white/10">
                    <div className="text-[14.5px] font-semibold text-white">{sk.name}</div>
                    <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-300">{sk.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Where the next increment comes from</h2>
              <div className="mt-3 space-y-2">
                {crank.trajectory.map((t) => (
                  <div key={t.vector} className="flex gap-3.5 rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.07]">
                    <I.IArrow className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" />
                    <div>
                      <div className="text-[14px] font-medium text-ink-100">{t.vector}</div>
                      <p className="mt-0.5 text-[13px] leading-[1.55] text-ink-400">{t.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-xl bg-moss/[0.08] p-5 ring-1 ring-moss/25">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-moss">
                <I.IEye className="h-3.5 w-3.5" /> The one thing to track
              </div>
              <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-100">{crank.watch}</p>
              <p className="mt-3 border-t border-moss/20 pt-3 text-[12.5px] text-ink-400">
                Reading about a company keeps you current. Tracking one specific observable keeps you early.
              </p>
            </section>
          </>
        )}

        <div className="mt-12 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/ecosystem/${prev.slug}`} className="rounded-lg bg-white/[0.04] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Previous</div>
              <div className="mt-1 text-[14px] font-medium text-white">{prev.title}</div>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/ecosystem/${next.slug}`} className="rounded-lg bg-white/[0.04] p-4 text-right ring-1 ring-white/10 transition hover:bg-white/[0.08] sm:col-start-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Next</div>
              <div className="mt-1 text-[14px] font-medium text-white">{next.title}</div>
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 ${
            fresh.stale ? "bg-clay/15 text-clay ring-clay/30" : "bg-moss/15 text-moss ring-moss/30"}`}>
            <I.IClock className="h-3 w-3" />
            Last checked {c.checked ?? "2026-09"}{fresh.stale ? ` · ${fresh.overdue}mo overdue` : " · current"}
          </span>
          <span className="text-[11.5px] text-ink-500">Facts here rot at a {c.rots ?? "medium"} rate.</span>
          <Link href="/desk" className="ml-auto text-[12px] font-medium text-signal hover:underline">Refresh this →</Link>
        </div>

        <p className="mt-5 text-[12.5px] leading-[1.7] text-ink-500">
          A reading of publicly-stated positioning, not an account of anyone&rsquo;s internal decisions. The scores and
          rankings are editorial judgements made to support an argument, not measurements. No affiliation with any
          company named.
        </p>
      </main>
    </div>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <section className={`mt-6 rounded-xl p-5 ring-1 ${accent ? "bg-signal/[0.07] ring-signal/25" : "bg-white/[0.04] ring-white/10"}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${accent ? "text-signal" : "text-ink-500"}`}>{label}</div>
      <p className={`prose-measure mt-2 text-[15.5px] leading-[1.68] ${accent ? "text-white" : "text-ink-200"}`}>{body}</p>
    </section>
  );
}

function List({ label, items, tone }: { label: string; items: string[]; tone: "moss" | "clay" }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
      <div className={`text-[11px] font-bold uppercase tracking-wider ${tone === "moss" ? "text-moss" : "text-clay"}`}>{label}</div>
      <ul className="mt-2.5 space-y-2">
        {items.map((x) => (
          <li key={x} className="flex gap-2.5 text-[13.5px] leading-[1.55] text-ink-300">
            <span className={`mt-[8px] h-1 w-1 shrink-0 rounded-full ${tone === "moss" ? "bg-moss" : "bg-clay"}`} />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
