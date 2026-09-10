import Link from "next/link";
import { EcosystemMap } from "@/components/ecosystem-map";
import { COMPANIES, LENSES, volatility } from "@/lib/data/ecosystem";
import { DEEP, MAP_NOTE } from "@/lib/content/ecosystem-deep";
import * as I from "@/components/icons";

export const metadata = {
  title: "The map — HR tech, drawn four ways",
  description: "Relevance is not one quantity. Four lenses over the same thirty-odd companies, and nine positions read in full.",
};

export default function Ecosystem() {
  const swings = [...COMPANIES]
    .map((c) => ({ c, ...volatility(c) }))
    .sort((a, b) => b.spread - a.spread)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-signal text-ink">
              <I.ILayers className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Compound</span>
          </Link>
          <span className="hidden text-[12.5px] text-ink-500 sm:block">· the map</span>
          <div className="ml-auto flex gap-2">
            <Link href="/brief" className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">Brief</Link>
            <Link href="/app" className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">The app</Link>
            <Link href="/backstage" className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">Backstage</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-20 sm:px-6">
        <div className="border-b border-white/10 py-9">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">One level up</div>
          <h1 className="font-serif-display mt-2 max-w-3xl text-[34px] font-normal leading-[1.13] tracking-tight text-white sm:text-[42px]">
            Relevant to whom?
          </h1>
          <p className="prose-measure mt-4 text-[16.5px] leading-[1.65] text-ink-300">
            Every map of this category picks one definition of relevance and hides it. Rank by funding and you get a
            venture newsletter. Rank by revenue and you get an analyst grid. Rank by how many people actually depend on
            the thing and you get a completely different set of companies, several of which nobody writes about.
          </p>
          <p className="prose-measure mt-3 text-[16px] leading-[1.65] text-ink-400">
            So this map refuses to pick. The same thirty-odd companies, drawn four times, under four incompatible
            definitions of what makes something matter. The companies that move most between the four are the ones
            worth arguing about.
          </p>
        </div>

        <section className="py-8">
          <EcosystemMap />
        </section>

        {/* The paradox */}
        <section className="border-t border-white/10 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-signal">The point of doing it four times</div>
              <h2 className="font-serif-display mt-2 text-[27px] leading-tight text-white">
                The biggest movers are the argument
              </h2>
              <p className="prose-measure mt-3 text-[15px] leading-[1.65] text-ink-300">
                A company that ranks near the top on one lens and near the bottom on another is not being measured
                badly. It is telling you that the two lenses are asking genuinely different questions — and that anyone
                using only one of them is going to be confidently wrong about something.
              </p>
              <p className="prose-measure mt-3 text-[15px] leading-[1.65] text-ink-400">
                The clearest pair: a payroll company that almost nobody writes about and pays a large share of the
                American workforce, and an AI-native company writing the future of work into every deck while
                administering almost nobody. Both readings are correct. Neither survives a single ranking.
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Largest swing between lenses</div>
              <ul className="mt-3 space-y-2.5">
                {swings.map(({ c, ranks, spread }) => (
                  <li key={c.slug} className="flex items-center gap-3">
                    <span className="w-[132px] shrink-0 truncate text-[13.5px] font-medium text-white">{c.name}</span>
                    <span className="flex flex-1 gap-1">
                      {ranks.map((r, i) => (
                        <span key={i} className="flex-1 rounded bg-white/[0.06] px-1 py-1 text-center" title={LENSES[i].pill}>
                          <span className="num text-[11.5px] text-ink-300">#{r}</span>
                        </span>
                      ))}
                    </span>
                    <span className="num w-12 shrink-0 text-right text-[12px] font-semibold text-clay">±{spread}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-white/10 pt-3 text-[11.5px] leading-relaxed text-ink-500">
                Columns, left to right: {LENSES.map((l) => l.pill).join(" · ")}
              </p>
            </div>
          </div>
        </section>

        {/* Deep dives */}
        <section className="border-t border-white/10 py-10">
          <h2 className="font-serif-display text-[27px] text-white">Nine positions, read in full</h2>
          <p className="prose-measure mt-2 text-[15px] leading-[1.65] text-ink-400">
            Chosen for strategic diversity rather than size — each is a different answer to the same question about who
            owns the employee record and what follows from that. One of them is here specifically because it would
            normally be left out.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {DEEP.map((d) => {
              const c = COMPANIES.find((x) => x.slug === d.slug)!;
              return (
                <Link key={d.slug} href={`/ecosystem/${d.slug}`}
                  className="group rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-white/20">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16.5px] font-semibold tracking-tight text-white">{d.title}</h3>
                    <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10.5px] font-medium text-ink-400 ring-1 ring-white/10">
                      {c.archetype}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-medium leading-[1.5] text-signal">{d.headline}</p>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-400">{d.bet}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white">
                    Read the position
                    <I.IArrow className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-8">
          <div className="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.07]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">How to read this</div>
            <p className="prose-measure mt-2.5 text-[14px] leading-[1.7] text-ink-400">{MAP_NOTE}</p>
            <p className="prose-measure mt-3 text-[14px] leading-[1.7] text-ink-400">
              The rest of this study builds one of these positions out as working software — a product surface with its
              reasoning annotated over it. That is at{" "}
              <Link href="/app" className="text-signal underline decoration-signal/40 underline-offset-2 hover:decoration-signal">the app</Link>{" "}
              and{" "}
              <Link href="/backstage" className="text-signal underline decoration-signal/40 underline-offset-2 hover:decoration-signal">backstage</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
