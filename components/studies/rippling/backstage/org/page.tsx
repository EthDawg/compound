import { ORG_LAYERS, RITUALS } from "@/lib/content/org";
import { BHeader, BCard, Pill } from "@/components/backstage-ui";

export default function Org() {
  return (
    <div>
      <BHeader
        eyebrow="How it's organised"
        title="The org chart is a consequence of the architecture"
        deck="Nineteen product pods of six to eight people on a thick shared platform. That only works if the platform is real — if it isn't, every pod needs sixty people and the whole thing collapses into a suite of products with a common login."
      />

      <div className="mt-8 space-y-4">
        {ORG_LAYERS.map((l) => (
          <section key={l.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <header className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-4">
              <h2 className="text-[18px] font-semibold tracking-tight text-white">{l.name}</h2>
              <Pill tone="signal">{l.teams}</Pill>
              <Pill>{l.headcount}</Pill>
            </header>
            <div className="grid gap-px bg-white/[0.06] md:grid-cols-[1.1fr_1fr]">
              <div className="bg-ink px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Owns</div>
                <ul className="mt-2 space-y-1.5">
                  {l.owns.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-300">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-signal" />{o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-signal">The rule</div>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-200">{l.rule}</p>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-clay">The permanent tension</div>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-400">{l.tension}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-serif-display text-[25px] text-white">The rituals that hold it together</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Six practices. Each exists because a specific thing went wrong without it, and each has a load-bearing half
          that erodes first under time pressure.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {RITUALS.map((r) => (
            <BCard key={r.name}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[14.5px] font-semibold text-white">{r.name}</h3>
                <Pill>{r.cadence}</Pill>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-300">{r.what}</p>
              <p className="mt-2.5 border-t border-white/10 pt-2.5 text-[13px] leading-[1.6] text-ink-400">
                <span className="font-semibold text-signal">Why: </span>{r.why}
              </p>
            </BCard>
          ))}
        </div>
      </section>
    </div>
  );
}
