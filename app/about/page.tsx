import Link from "next/link";
import { PRODUCT_CURVE } from "@/lib/content/timeline";
import * as I from "@/components/icons";

const DOORS = [
  {
    href: "/app", kicker: "Front of house", title: "The product",
    body: "A working admin platform for a 344-person hardware company across four entities and six countries. Payroll, devices, app access, spend, workflows — one employee record underneath all of it.",
    cta: "Open the app",
  },
  {
    href: "/backstage", kicker: "Behind it", title: "The operating manual",
    body: "Twelve essays, fourteen logged decisions with the alternatives that were rejected, the metrics that would falsify the whole strategy, the nine skills that actually get it executed, and the questions people ask when they think it's nonsense.",
    cta: "Go backstage",
  },
];

const QUICK = [
  {
    href: "/desk", kicker: "Start here", title: "The desk",
    body: "One place: what this is for, what has gone stale, and the phrases to run when you want the map to move. No job runs behind it — that is the point.",
  },
  {
    href: "/", kicker: "The front door", title: "The atlas",
    body: "Four altitudes from architecture eras down to individual companies, each drawn under four incompatible definitions of relevance. Eleven positions read in full.",
  },
  {
    href: "/brief", kicker: "12 minutes", title: "The speed run",
    body: "The whole argument, ordered for whoever is holding it — prospect, investor, new joiner, or skeptic.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-signal text-ink">
            <I.ILayers className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Compound</span>
        </div>
        <Link href="/" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[12.5px] font-medium hover:bg-white/15">
          Open the atlas <I.IArrow className="h-3 w-3" />
        </Link>
      </header>

      <main className="mx-auto max-w-[1080px] px-6">
        <section className="pb-14 pt-10 sm:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11.5px] font-medium text-signal ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            An independent study of the compound-startup thesis
          </div>

          <h1 className="font-serif-display mt-6 max-w-3xl text-[38px] font-normal leading-[1.1] tracking-tight sm:text-[52px]">
            Most software companies are one product with a company attached.
            <span className="block text-signal">This one is the other way round.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-[1.65] text-ink-300">
            Two things live at the same address. There is a product — dense, opinionated, the kind of platform a
            mid-market company actually runs on. And underneath every screen there is the reasoning: why it is shaped
            this way, what it trades away, and what holding the line has cost.
          </p>

          <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-ink-300">
            Press{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] font-bold text-signal ring-1 ring-white/15">X</kbd>{" "}
            anywhere in the app and it turns inside out.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {DOORS.map((d) => (
              <Link key={d.href} href={d.href} className="group rounded-xl bg-white/[0.05] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.09] hover:ring-white/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-signal">{d.kicker}</div>
                <h2 className="mt-1.5 text-[19px] font-semibold tracking-tight">{d.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-300">{d.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  {d.cta}
                  <I.IArrow className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {QUICK.map((q) => (
              <Link key={q.href} href={q.href} className="group rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.08] transition hover:bg-white/[0.07] hover:ring-white/15">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-signal">{q.kicker}</div>
                <h3 className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
                  {q.title}
                  <I.IArrow className="h-3.5 w-3.5 text-ink-500 transition group-hover:translate-x-0.5 group-hover:text-signal" />
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.55] text-ink-400">{q.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* The curve */}
        <section className="border-t border-white/10 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-signal">The whole argument, in one chart</div>
              <h2 className="font-serif-display mt-2 text-[26px] leading-tight">
                Months to the first paying customer, by product line
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-300">
                A compound startup makes one falsifiable claim: that each new product costs less than the last, because
                the hard parts were solved once and centrally. Everything else can be told as a story. This can&rsquo;t.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-400">
                If this curve ever flattens, the strategy is indistinguishable from a company that simply lost its
                focus — which is exactly what a lot of them turn out to be.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <div className="space-y-[7px]">
                {PRODUCT_CURVE.map((p) => (
                  <div key={p.n} className="flex items-center gap-3">
                    <span className="num w-4 shrink-0 text-right text-[11px] text-ink-500">{p.n}</span>
                    <span className="w-[104px] shrink-0 truncate text-[12px] text-ink-300">{p.name}</span>
                    <span className="relative h-[13px] flex-1 overflow-hidden rounded-sm bg-white/5">
                      <span
                        className="absolute inset-y-0 left-0 rounded-sm bg-signal"
                        style={{ width: `${(p.months / 19) * 100}%`, opacity: 0.45 + (1 - p.months / 19) * 0.55 }}
                      />
                    </span>
                    <span className="num w-[52px] shrink-0 text-right text-[11.5px] text-ink-400">
                      {p.months < 1 ? "<1" : p.months} mo
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-white/10 pt-3 text-[11.5px] leading-relaxed text-ink-500">
                Illustrative figures for the fictional company modelled in this study.
              </p>
            </div>
          </div>
        </section>

        {/* Provenance */}
        <section className="border-t border-white/10 py-12">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500 lg:w-40">What this is</div>
            <div className="max-w-2xl space-y-4 text-[14px] leading-[1.7] text-ink-300">
              <p>
                This is a study, not a company. It takes the compound-startup thesis — most publicly associated with
                Rippling and its founder Parker Conrad — and builds it out as working software so the argument can be
                walked through rather than read about.
              </p>
              <p>
                The product surface, the company using it, the numbers, the decision log and the essays are all
                constructed for this study. The founder voice throughout is a reconstruction written to make the
                reasoning vivid and arguable; it is not a quotation, an interview, or an account of what any real person
                has said. Where a real public position is referenced, it is described as such.
              </p>
              <p className="text-ink-400">
                No affiliation with, or endorsement by, Rippling. Nothing here is a factual claim about any real
                company&rsquo;s internal operations.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-[12px] text-ink-500">
          <span>Compound — the founder&rsquo;s view</span>
          <div className="flex gap-4">
            <Link href="/app" className="hover:text-ink-300">Product</Link>
            <Link href="/backstage" className="hover:text-ink-300">Backstage</Link>
            <Link href="/about" className="hover:text-ink-300">About</Link>
            <Link href="/backstage/manual/focus-is-a-market-discipline" className="hover:text-ink-300">Start reading</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
