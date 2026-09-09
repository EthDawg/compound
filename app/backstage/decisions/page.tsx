import { DECISIONS } from "@/lib/content/decisions";
import { BHeader, Pill } from "@/components/backstage-ui";
import * as I from "@/components/icons";

const STAKE = { "Company-defining": "signal", Significant: "dim", Reversible: "dim" } as const;

export default function Decisions() {
  return (
    <div>
      <BHeader
        eyebrow="Decision log"
        title="Fourteen decisions, and what each one was chosen against"
        deck="The rejected alternative is the valuable half. Anyone can see what was chosen by reading the code; only the log says what was chosen against — which is what stops the same argument recurring every nine months when someone new arrives with a good idea we already tried."
      />

      <div className="mt-8 space-y-4">
        {DECISIONS.map((d) => (
          <section key={d.id} id={d.id} className="scroll-mt-20 rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <header className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="num rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-signal">{d.id}</span>
                <span className="num text-[12px] text-ink-500">{d.date}</span>
                <Pill>{d.area}</Pill>
                <Pill tone={STAKE[d.stake]}>{d.stake}</Pill>
                <Pill tone={d.status === "Standing" ? "live" : "dim"}>{d.status}</Pill>
              </div>
              <h2 className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-white">{d.title}</h2>
            </header>

            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
              <Field label="Context" body={d.context} />
              <Field label="Decision" body={d.decision} accent />
            </div>

            <div className="border-t border-white/[0.06] px-5 py-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">What we chose against</div>
              <ul className="mt-2.5 space-y-2.5">
                {d.rejected.map((r) => (
                  <li key={r.option} className="flex gap-3">
                    <I.IClose className="mt-1 h-3 w-3 shrink-0 text-clay" />
                    <div>
                      <div className="text-[14px] font-medium text-ink-200">{r.option}</div>
                      <div className="mt-0.5 text-[13.5px] leading-[1.6] text-ink-400">{r.why}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] sm:grid-cols-2">
              <Field label="What it cost" body={d.cost} tone="cost" />
              <Field label="Revisit when" body={d.revisit} />
            </div>

            {d.aftermath && (
              <div className="border-t border-white/[0.06] bg-signal/[0.05] px-5 py-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Since then</div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink-200">{d.aftermath}</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function Field({ label, body, accent, tone }: { label: string; body: string; accent?: boolean; tone?: "cost" }) {
  return (
    <div className={`px-5 py-4 ${accent ? "bg-signal/[0.05]" : "bg-ink"}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${accent ? "text-signal" : tone === "cost" ? "text-clay" : "text-ink-500"}`}>
        {label}
      </div>
      <p className="mt-1.5 text-[14px] leading-[1.62] text-ink-300">{body}</p>
    </div>
  );
}
