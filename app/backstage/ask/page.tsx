import { QA_ITEMS } from "@/lib/content/ask";
import { BHeader, Pill } from "@/components/backstage-ui";

export default function Ask() {
  return (
    <div>
      <BHeader
        eyebrow="Ask the founder"
        title="Fourteen questions, including the ones that sting"
        deck="Sorted roughly by how uncomfortable they are. The hostile ones are the useful ones — a strategy that can only answer friendly questions has not been tested, it has been rehearsed."
      />

      <div className="mt-8 space-y-4">
        {QA_ITEMS.map((qa) => (
          <article key={qa.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
            <header className="flex items-start gap-3 border-b border-white/10 px-5 py-4">
              <span className="font-serif-display mt-px shrink-0 text-[20px] leading-none text-signal">Q</span>
              <h2 className="min-w-0 flex-1 text-[17px] font-medium leading-snug tracking-tight text-white">{qa.q}</h2>
              <div className="flex shrink-0 items-center gap-1.5">
                <Pill>{qa.tag}</Pill>
                <span className="flex gap-0.5" title={`Heat ${qa.heat}/3`}>
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= qa.heat ? "bg-clay" : "bg-white/12"}`} />
                  ))}
                </span>
              </div>
            </header>
            <div className="space-y-3.5 px-5 py-4">
              {qa.a.map((p, i) => (
                <p key={i} className={`text-[15px] leading-[1.68] ${i === 0 ? "text-ink-100" : "text-ink-300"}`}>
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-signal/[0.07] p-5 ring-1 ring-signal/20">
        <div className="text-[11px] font-bold uppercase tracking-wider text-signal">On the voice in these answers</div>
        <p className="prose-measure mt-2 text-[14.5px] leading-[1.65] text-ink-200">
          These are written in a founder&rsquo;s first person because the reasoning is easier to hold — and to argue
          with — when it has a point of view. They are a reconstruction built for this study, not quotations, an
          interview, or a record of anything a real person has said.
        </p>
      </div>
    </div>
  );
}
