import Link from "next/link";
import { MANUAL } from "@/lib/content/manual";
import { DECISIONS } from "@/lib/content/decisions";
import { QA_ITEMS } from "@/lib/content/ask";
import { COMPOUND_METRICS } from "@/lib/content/metrics";
import { Pill } from "@/components/backstage-ui";
import * as I from "@/components/icons";

const ROUTES = [
  { href: "/backstage/manual", label: "The operating manual", n: `${MANUAL.length} essays`, d: "The beliefs, at length. Each one ends with what it costs and when it would be wrong.", icon: I.IBook },
  { href: "/backstage/decisions", label: "Decision log", n: `${DECISIONS.length} entries`, d: "Real decisions with the alternative that was rejected, the price paid, and the condition that would reopen them.", icon: I.IList },
  { href: "/backstage/heresies", label: "Heresies", n: "11 positions", d: "Where this goes against standard advice — and, in every case, when the standard advice is right.", icon: I.IBolt },
  { href: "/backstage/metrics", label: "What we measure", n: `${COMPOUND_METRICS.length} metrics`, d: "The numbers that would prove the whole strategy wrong, and how each one can flatter you.", icon: I.IReport },
  { href: "/backstage/org", label: "How it's organised", n: "4 layers", d: "Small pods on a thick platform, the rule that keeps it from forking, and the tension that never resolves.", icon: I.ILayers },
  { href: "/backstage/timeline", label: "Nine years", n: "5 eras", d: "The sequence, the trough, and the curve that is the only real evidence any of it worked.", icon: I.IClock },
  { href: "/backstage/ask", label: "Ask the founder", n: `${QA_ITEMS.length} questions`, d: "Including the hostile ones. Sorted by how uncomfortable they are to answer.", icon: I.ISpark },
];

const PREMISES = [
  { n: "01", t: "One record", d: "Every product reads the same employee row. None of them keeps a copy. This single constraint produces almost everything else." },
  { n: "02", t: "The seams are the product", d: "The customer's pain is not inside any tool. It is between them — and no vendor can fix a boundary from one side of it." },
  { n: "03", t: "Focus is about the customer", d: "Monomaniacal about who we serve. Almost entirely undisciplined about how many of their problems we take." },
  { n: "04", t: "Compounding is arithmetic", d: "Product one buys the account. Every product after it arrives at a cost structure a standalone competitor cannot match." },
  { n: "05", t: "The platform must be real", d: "Anyone can put one login in front of five products. The test is whether product six ships faster than product five did." },
  { n: "06", t: "Compliance is a constraint", d: "Not a team that catches it. A form that will not let you type it." },
];

export default function Backstage() {
  return (
    <div>
      <div className="border-b border-white/10 py-10">
        <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Backstage</div>
        <h1 className="font-serif-display mt-3 max-w-3xl text-[34px] font-normal leading-[1.14] tracking-tight text-white sm:text-[44px]">
          You have used the product. Here is why it is shaped like that.
        </h1>
        <p className="prose-measure mt-5 text-[16.5px] leading-[1.65] text-ink-300">
          Every screen in the app is downstream of a small number of decisions, most of them made before there was a
          customer who would have asked for them. Several were expensive. A few looked, at the time, like mistakes —
          and one of them was.
        </p>
        <p className="prose-measure mt-4 text-[16px] leading-[1.65] text-ink-400">
          This is written the way it would be explained by someone who had to defend it in a board meeting and then go
          and hold the line on it in a planning session the next morning. Where a position is uncomfortable, it says so.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/backstage/manual/focus-is-a-market-discipline"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-signal px-4 text-[13px] font-semibold text-ink transition hover:bg-signal-300">
            Start at essay one <I.IArrow className="h-3.5 w-3.5" />
          </Link>
          <Link href="/backstage/ask"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-4 text-[13px] font-semibold text-white transition hover:bg-white/15">
            Or go straight to the hard questions
          </Link>
        </div>
      </div>

      <section className="py-10">
        <h2 className="font-serif-display text-[25px] text-white">Six premises everything else follows from</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PREMISES.map((p) => (
            <div key={p.n} className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <div className="num font-serif-display text-[15px] text-signal">{p.n}</div>
              <h3 className="mt-1 text-[15px] font-semibold text-white">{p.t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-400">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-10">
        <h2 className="font-serif-display text-[25px] text-white">Everything back here</h2>
        <div className="mt-5 space-y-2.5">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            return (
              <Link key={r.href} href={r.href}
                className="group flex items-start gap-4 rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-white/20">
                <span className="mt-px grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-signal">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15.5px] font-semibold text-white">{r.label}</h3>
                    <Pill>{r.n}</Pill>
                  </div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-400">{r.d}</p>
                </div>
                <I.IArrow className="mt-2 h-4 w-4 shrink-0 text-ink-600 transition group-hover:translate-x-0.5 group-hover:text-signal" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10 py-10">
        <div className="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.07]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">What this is</div>
          <div className="prose-measure mt-2.5 space-y-3 text-[14px] leading-[1.7] text-ink-400">
            <p>
              An independent study of the compound-startup thesis — the idea most publicly associated with Rippling and
              its founder Parker Conrad — built out as working software so the argument can be walked through rather
              than read about.
            </p>
            <p>
              The company in the product, its people and numbers, the decision log and these essays are all constructed
              for this study. The founder voice is a reconstruction written to make the reasoning vivid and arguable. It
              is not a quotation or an account of what any real person has said, and nothing here is a factual claim
              about any real company&rsquo;s internal operations. No affiliation with or endorsement by Rippling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
