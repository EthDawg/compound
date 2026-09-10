import { VECTORS, PHASES, TRAJECTORY_NOTE } from "@/lib/content/trajectory";
import { BHeader, Pill } from "@/components/backstage-ui";
import * as I from "@/components/icons";

export default function Trajectory() {
  return (
    <div>
      <BHeader
        eyebrow="Growth from here"
        title="The roadmap has not changed. What the sentence means has."
        deck="For nine years the pitch was that having everything in one place saves your team time. The same sentence now describes whether autonomous systems can be trusted to touch your company at all — and that is a different argument competing against a different alternative."
      />

      {/* Phases */}
      <section className="mt-8">
        <h2 className="font-serif-display text-[25px] text-white">What we have been competing on, by era</h2>
        <div className="mt-5 space-y-2">
          {PHASES.map((p, i) => (
            <div key={p.years} className={`rounded-xl p-5 ring-1 ${i === PHASES.length - 1 ? "bg-signal/[0.07] ring-signal/25" : "bg-white/[0.04] ring-white/10"}`}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className={`num font-serif-display text-[18px] ${i === PHASES.length - 1 ? "text-signal" : "text-ink-500"}`}>{p.years}</span>
                <h3 className="text-[16px] font-semibold text-white">{p.label}</h3>
              </div>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Competing on</div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-300">{p.competingOn}</p>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Ceiling</div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-300">{p.ceiling}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vectors */}
      <section className="mt-10">
        <h2 className="font-serif-display text-[25px] text-white">Four vectors, run through the same test</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Same record? Same buyer? Same pipe? Makes the existing products better? Four yeses and it is not a new bet, it
          is more of the existing one. Note that two of these do not pass, and are on the list anyway for reasons that
          have to be argued separately.
        </p>

        <div className="mt-5 space-y-4">
          {VECTORS.map((v) => {
            const passes = v.test.filter((t) => t.pass).length;
            return (
              <article key={v.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                <header className="border-b border-white/10 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[17px] font-semibold tracking-tight text-white">{v.name}</h3>
                    <Pill tone={passes === 4 ? "live" : "signal"}>{passes}/4 on the test</Pill>
                  </div>
                  <p className="mt-1 text-[12.5px] font-medium uppercase tracking-wide text-signal">{v.kicker}</p>
                  <p className="prose-measure mt-2 text-[14.5px] leading-[1.65] text-ink-300">{v.thesis}</p>
                </header>

                <ul className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
                  {v.test.map((t) => (
                    <li key={t.q} className="flex items-start gap-2.5 bg-ink px-5 py-3">
                      <span className={`mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full ${t.pass ? "bg-moss text-white" : "bg-clay text-white"}`}>
                        {t.pass ? <I.ICheck className="h-2.5 w-2.5" /> : <I.IClose className="h-2 w-2" />}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-ink-200">{t.q}</div>
                        <div className="mt-0.5 text-[12.5px] leading-snug text-ink-400">{t.a}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">
                  <Meta label="Size" body={v.size} />
                  <Meta label="Horizon" body={v.horizon} />
                  <Meta label="What goes wrong" body={v.risk} tone="risk" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.07]">
        <p className="prose-measure text-[15px] leading-[1.7] text-ink-300">{TRAJECTORY_NOTE}</p>
      </section>
    </div>
  );
}

function Meta({ label, body, tone }: { label: string; body: string; tone?: "risk" }) {
  return (
    <div className="bg-ink px-5 py-3.5">
      <div className={`text-[11px] font-bold uppercase tracking-wider ${tone === "risk" ? "text-clay" : "text-ink-500"}`}>{label}</div>
      <p className="mt-1 text-[13px] leading-[1.6] text-ink-300">{body}</p>
    </div>
  );
}
