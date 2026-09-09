import { COMPOUND_METRICS, ANTI_METRICS } from "@/lib/content/metrics";
import { BHeader } from "@/components/backstage-ui";
import * as I from "@/components/icons";

function Spark({ data, invert }: { data: number[]; invert?: boolean }) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const W = 200, H = 44;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * W, H - ((d - min) / span) * (H - 6) - 3]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${line} ${W},${H} 0,${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-11 w-full" preserveAspectRatio="none" aria-hidden>
      <polygon points={area} fill="rgba(245,197,24,.10)" />
      <polyline points={line} fill="none" stroke="#F5C518" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill="#F5C518" />
    </svg>
  );
}

export default function Metrics() {
  return (
    <div>
      <BHeader
        eyebrow="What we measure"
        title="A compound startup run on single-product metrics will conclude it is mediocre at everything"
        deck="Averaged across product lines at different maturities, it is. The average is not the story — the cohort is. These eight are the ones that actually tell you whether the thesis is working, and each carries the specific way it can flatter you."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {COMPOUND_METRICS.map((m) => (
          <article key={m.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <div className="px-5 pt-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[14px] font-semibold leading-snug text-white">{m.name}</h2>
                <span className={`shrink-0 text-[11px] ${m.direction === "down" ? "text-moss" : m.direction === "up" ? "text-moss" : "text-ink-500"}`}>
                  {m.direction === "down" ? "↓ falling" : m.direction === "up" ? "↑ rising" : "→ stable"}
                </span>
              </div>
              <div className="num mt-2 flex items-baseline gap-2">
                <span className="font-serif-display text-[32px] leading-none text-signal">{m.value}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-500">{m.sub}</p>
            </div>
            <div className="mt-3 px-2"><Spark data={m.series} /></div>
            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-[13.5px] leading-[1.6] text-ink-300">{m.why}</p>
            </div>
            <div className="border-t border-white/[0.06] bg-clay/[0.06] px-5 py-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-clay">How it flatters you</div>
              <p className="mt-1 text-[13px] leading-[1.55] text-ink-300">{m.trap}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-serif-display text-[25px] text-white">Metrics we deliberately ignore</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Not because they are wrong for everyone. Because for this shape of company they move for the wrong reasons
          and reliably prompt the wrong meeting.
        </p>
        <div className="mt-5 space-y-2">
          {ANTI_METRICS.map((a) => (
            <div key={a.name} className="flex gap-3.5 rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.07]">
              <I.IClose className="mt-1 h-3.5 w-3.5 shrink-0 text-clay" />
              <div>
                <div className="text-[14px] font-medium text-ink-200">{a.name}</div>
                <div className="mt-0.5 text-[13.5px] leading-[1.6] text-ink-400">{a.why}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
