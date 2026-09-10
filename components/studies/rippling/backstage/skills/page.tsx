import { SKILLS, SKILL_NOTE } from "@/lib/content/skills";
import { BHeader, Pill } from "@/components/backstage-ui";
import * as I from "@/components/icons";

const RARITY = { "Very rare": "signal", Rare: "dim", Teachable: "live" } as const;

export default function Skills() {
  return (
    <div>
      <BHeader
        eyebrow="How it out-executes"
        title="Nine skills, not nine values"
        deck="Strategy explains what a company is trying to do. It does not explain why one company gets it done and another with the same slide does not. That difference lives in a small number of practised skills — and almost none of them are the ones that go on a careers page."
      />

      <p className="prose-measure mt-6 text-[15.5px] leading-[1.7] text-ink-300">{SKILL_NOTE}</p>

      <div className="mt-8 space-y-4">
        {SKILLS.map((s) => (
          <article key={s.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <header className="border-b border-white/10 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="num font-serif-display text-[18px] text-signal">{s.n}</span>
                <h2 className="text-[18px] font-semibold tracking-tight text-white">{s.name}</h2>
                <span className="ml-auto"><Pill tone={RARITY[s.rarity]}>{s.rarity}</Pill></span>
              </div>
              <p className="prose-measure mt-2 text-[14.5px] leading-[1.6] text-ink-300">{s.oneLine}</p>
              <p className="mt-2 text-[12.5px] text-ink-500">
                <span className="font-semibold text-ink-400">Who needs it: </span>{s.who}
              </p>
            </header>

            <div className="grid gap-px bg-white/[0.06] md:grid-cols-2">
              <div className="bg-ink px-5 py-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-moss">
                  <I.ICheck className="h-3 w-3" /> What it looks like
                </div>
                <p className="mt-1.5 text-[13.5px] leading-[1.62] text-ink-300">{s.present}</p>
              </div>
              <div className="bg-ink px-5 py-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-clay">
                  <I.IClose className="h-3 w-3" /> What it looks like when it&rsquo;s missing
                </div>
                <p className="mt-1.5 text-[13.5px] leading-[1.62] text-ink-300">{s.absent}</p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] bg-signal/[0.05] px-5 py-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-signal">How it gets built here</div>
              <p className="mt-1.5 text-[14px] leading-[1.65] text-ink-200">{s.practised}</p>
            </div>

            <div className="flex items-start gap-2.5 border-t border-white/[0.06] px-5 py-3.5">
              <I.IEye className="mt-px h-3.5 w-3.5 shrink-0 text-ink-500" />
              <p className="text-[13.5px] leading-[1.6] text-ink-400">
                <span className="font-semibold text-ink-300">The tell: </span>{s.tell}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
