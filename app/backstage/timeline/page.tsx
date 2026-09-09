import { ERAS, PRODUCT_CURVE } from "@/lib/content/timeline";
import { BHeader, Pill } from "@/components/backstage-ui";

export default function Timeline() {
  const max = Math.max(...PRODUCT_CURVE.map((p) => p.months));
  return (
    <div>
      <BHeader
        eyebrow="Nine years"
        title="The sequence mattered more than any single decision in it"
        deck="Compound is a second act. Every attempt to run this strategy from founding fails for the same reason: you cannot know what to abstract before you have built the same thing twice."
      />

      <section className="mt-8 rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-white">Months to first paying customer, by product line</h2>
          <span className="text-[12px] text-ink-500">The falsifier for the entire strategy</span>
        </div>
        <div className="mt-4 space-y-2">
          {PRODUCT_CURVE.map((p) => (
            <div key={p.n} className="flex items-center gap-3">
              <span className="num w-4 shrink-0 text-right text-[11px] text-ink-600">{p.n}</span>
              <span className="w-[120px] shrink-0 truncate text-[12.5px] text-ink-300">{p.name}</span>
              <span className="num w-9 shrink-0 text-[11px] text-ink-600">{p.year}</span>
              <span className="relative h-4 flex-1 overflow-hidden rounded bg-white/5">
                <span className="absolute inset-y-0 left-0 rounded bg-signal transition-all"
                  style={{ width: `${(p.months / max) * 100}%`, opacity: 0.4 + (1 - p.months / max) * 0.6 }} />
              </span>
              <span className="num w-14 shrink-0 text-right text-[11.5px] text-ink-400">{p.months} mo</span>
              <span className="num hidden w-16 shrink-0 text-right text-[11.5px] text-ink-600 sm:block">{p.team} people</span>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-white/10 pt-3 text-[12.5px] leading-relaxed text-ink-500">
          Nineteen months to eleven weeks, with smaller teams each time. Nothing about execution got dramatically
          better — the marginal cost of a product line fell, which is a different and much more durable thing.
        </p>
      </section>

      <div className="mt-8 space-y-4">
        {ERAS.map((e, i) => (
          <section key={e.years} className="relative rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <header className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="num font-serif-display text-[20px] text-signal">{e.years}</span>
              <h2 className="text-[17px] font-semibold tracking-tight text-white">{e.label}</h2>
              <div className="ml-auto flex gap-2">
                <Pill>{e.headcount} people</Pill>
                <Pill tone="signal">{e.products} products</Pill>
              </div>
            </header>
            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
              <Cell label="What happened" body={e.what} />
              <Cell label="Why" body={e.why} accent />
              <Cell label="What it cost" body={e.cost} tone="cost" />
              <Cell label="What we took from it" body={e.lesson} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Cell({ label, body, accent, tone }: { label: string; body: string; accent?: boolean; tone?: "cost" }) {
  return (
    <div className={`px-5 py-4 ${accent ? "bg-signal/[0.05]" : "bg-ink"}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${accent ? "text-signal" : tone === "cost" ? "text-clay" : "text-ink-500"}`}>
        {label}
      </div>
      <p className="mt-1.5 text-[14px] leading-[1.62] text-ink-300">{body}</p>
    </div>
  );
}
