import Link from "next/link";
import { MANUAL } from "@/lib/content/manual";
import { BHeader, Pill } from "@/components/backstage-ui";

export default function ManualIndex() {
  return (
    <div>
      <BHeader
        eyebrow="The operating manual"
        title="Ten things I believe, and what each one costs"
        deck="Written to be argued with. Where a position is uncomfortable I have tried to say so rather than smooth it over — a strategy described only by its advantages is a pitch, not a manual."
      />
      <div className="mt-8 space-y-3">
        {MANUAL.map((e) => (
          <Link key={e.slug} href={`/backstage/manual/${e.slug}`}
            className="group block rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-white/20">
            <div className="flex items-start gap-4">
              <span className="font-serif-display mt-px w-7 shrink-0 text-[24px] leading-none text-ink-600 group-hover:text-signal">
                {e.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[17px] font-semibold tracking-tight text-white">{e.title}</h2>
                  {e.tags.map((t) => <Pill key={t}>{t}</Pill>)}
                </div>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-400">{e.deck}</p>
                <p className="mt-2.5 border-l-2 border-signal/40 pl-3 text-[13.5px] italic leading-[1.55] text-ink-300">
                  {e.thesis}
                </p>
              </div>
              <span className="num shrink-0 pt-1 text-[11.5px] text-ink-600">{e.reading}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
