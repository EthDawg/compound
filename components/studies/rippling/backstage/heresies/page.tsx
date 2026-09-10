import { HERESIES } from "@/lib/content/heresies";
import { BHeader, Pill } from "@/components/backstage-ui";

const CONF = { "Held hard": "signal", "Held loosely": "dim", "Still arguing": "dim" } as const;

export default function Heresies() {
  return (
    <div>
      <BHeader
        eyebrow="Heresies"
        title="Where we go against the standard advice — and when the standard advice wins"
        deck="Every one of these has a column saying when the orthodoxy is right, because a contrarian position without stated limits is not a strategy, it is a personality. The limits are where the real information is."
      />

      <div className="mt-8 space-y-3">
        {HERESIES.map((h) => (
          <article key={h.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <div className="grid gap-px bg-white/[0.06] md:grid-cols-2">
              <div className="bg-ink px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Conventional wisdom</div>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-400 line-through decoration-clay/60 decoration-1">
                  {h.orthodoxy}
                </p>
              </div>
              <div className="bg-signal/[0.06] px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-signal">What we do</div>
                <p className="mt-1.5 text-[15px] font-medium leading-[1.55] text-white">{h.practice}</p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] px-5 py-4">
              <p className="text-[14px] leading-[1.65] text-ink-300">{h.why}</p>
            </div>

            <div className="flex flex-wrap items-start gap-3 border-t border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-moss">When the orthodoxy wins</div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink-300">{h.whenOrthodoxyWins}</p>
              </div>
              <Pill tone={CONF[h.confidence]}>{h.confidence}</Pill>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
