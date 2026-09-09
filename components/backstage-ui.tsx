import Link from "next/link";
import type { Block } from "@/lib/content/types";

export function BHeader({ eyebrow, title, deck }: { eyebrow: string; title: string; deck?: string }) {
  return (
    <div className="border-b border-white/10 py-8">
      <div className="text-[11px] font-bold uppercase tracking-wider text-signal">{eyebrow}</div>
      <h1 className="font-serif-display mt-2 text-[32px] font-normal leading-[1.15] tracking-tight text-white sm:text-[38px]">
        {title}
      </h1>
      {deck && <p className="prose-measure mt-3 text-[15.5px] leading-[1.6] text-ink-400">{deck}</p>}
    </div>
  );
}

export function BCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10 ${className}`}>{children}</div>;
}

export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-8 space-y-5">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h":
            return (
              <h2 key={i} className="font-serif-display !mt-10 prose-measure text-[23px] font-normal leading-snug text-white">
                {b.x}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="prose-measure text-[16px] leading-[1.72] text-ink-200">
                {b.x}
              </p>
            );
          case "q":
            return (
              <blockquote key={i} className="prose-measure !my-8 border-l-2 border-signal py-1 pl-5">
                <p className="font-serif-display text-[21px] leading-[1.45] text-signal">{b.x}</p>
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="prose-measure space-y-2.5">
                {b.x.map((li, j) => (
                  <li key={j} className="flex gap-3 text-[15.5px] leading-[1.65] text-ink-200">
                    <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-signal" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="prose-measure space-y-3">
                {b.x.map((li, j) => (
                  <li key={j} className="flex gap-3.5 text-[15.5px] leading-[1.65] text-ink-200">
                    <span className="num mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-signal">
                      {j + 1}
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ol>
            );
          case "note":
            return (
              <aside key={i} className="prose-measure !my-7 rounded-lg bg-signal/[0.07] p-4 ring-1 ring-signal/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-signal">{b.label}</div>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-ink-200">{b.x}</p>
              </aside>
            );
          case "cmp":
            return (
              <div key={i} className="prose-measure !my-7 grid gap-3 sm:grid-cols-2">
                {[b.a, b.b].map((c, j) => (
                  <div key={j} className={`rounded-lg p-4 ring-1 ${j === 0 ? "bg-white/[0.03] ring-white/10" : "bg-signal/[0.06] ring-signal/20"}`}>
                    <div className={`text-[12px] font-bold uppercase tracking-wide ${j === 0 ? "text-ink-400" : "text-signal"}`}>
                      {c.h}
                    </div>
                    <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-300">{c.x}</p>
                  </div>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}

export function Pill({ children, tone = "dim" }: { children: React.ReactNode; tone?: "dim" | "signal" | "live" }) {
  const t = {
    dim: "bg-white/[0.06] text-ink-400 ring-white/10",
    signal: "bg-signal/12 text-signal ring-signal/25",
    live: "bg-moss/15 text-moss ring-moss/30",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium ring-1 ring-inset ${t}`}>{children}</span>;
}

export function NextPrev({ prev, next }: { prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <div className="mt-14 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="group rounded-lg bg-white/[0.04] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Previous</div>
          <div className="mt-1 text-[14px] font-medium text-white">{prev.label}</div>
        </Link>
      ) : <div />}
      {next && (
        <Link href={next.href} className="group rounded-lg bg-white/[0.04] p-4 text-right ring-1 ring-white/10 transition hover:bg-white/[0.08] sm:col-start-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Next</div>
          <div className="mt-1 text-[14px] font-medium text-white">{next.label}</div>
        </Link>
      )}
    </div>
  );
}
