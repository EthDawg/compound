"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_COMPANIES, LENSES, staleness, volatility } from "@/lib/data/ecosystem";
import { INTENTS, PROMPTS, OPERATING_RULES } from "@/lib/content/runbook";
import { DEEP } from "@/lib/content/ecosystem-deep";
import * as I from "./icons";

const COST = { small: "5 min", medium: "20 min", large: "an hour" } as const;

export function Desk() {
  const [open, setOpen] = useState<string | null>("refresh-one");
  const [copied, setCopied] = useState<string | null>(null);

  // Priority = how stale it is, weighted by how much it carries the argument.
  const queue = useMemo(() => {
    return ALL_COMPANIES.map((c) => {
      const f = staleness(c);
      const { ranks } = volatility(c, ALL_COMPANIES);
      const weight = (ALL_COMPANIES.length - Math.min(...ranks)) / ALL_COMPANIES.length;
      const deep = DEEP.some((d) => d.slug === c.slug);
      // Dampen raw staleness so a peripheral node that is wildly overdue cannot outrank
      // a load-bearing one that is merely due. Importance should dominate, not decay.
      return { c, f, weight, deep, score: Math.sqrt(f.months / f.budget) * (0.2 + weight * 0.8) * (deep ? 1.6 : 1) };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, []);

  const fresh = ALL_COMPANIES.filter((c) => !staleness(c).stale).length;

  const copy = async (p: { id: string; text: string }) => {
    try { await navigator.clipboard.writeText(p.text); setCopied(p.id); setTimeout(() => setCopied(null), 1800); }
    catch { setCopied(null); }
  };

  return (
    <div className="space-y-10">
      {/* Intents */}
      <section>
        <h2 className="font-serif-display text-[25px] text-white">What are you here to do?</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Four questions this thing is actually for. Each one starts at a different altitude and a different lens —
          the map does not have a default view because the right view depends on the question.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {INTENTS.map((it) => (
            <Link key={it.id} href={it.route}
              className="group rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-white/20">
              <h3 className="text-[16px] font-semibold tracking-tight text-white">{it.q}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.62] text-ink-400">{it.answer}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-signal/12 px-2 py-0.5 text-[10.5px] font-semibold text-signal ring-1 ring-signal/25">
                  {it.start}
                </span>
                <I.IArrow className="h-3.5 w-3.5 text-ink-600 transition group-hover:translate-x-0.5 group-hover:text-signal" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Queue */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif-display text-[25px] text-white">What to look at next</h2>
          <span className="text-[12px] text-ink-500">
            <span className="num font-semibold text-moss">{fresh}</span> of {ALL_COMPANIES.length} readings current
          </span>
        </div>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Staleness weighted by how much of the argument a node carries. A fast-rotting company that anchors a thesis
          outranks a slow-rotting one at the edge of the map. This list is deliberately six items long.
        </p>
        <div className="mt-5 space-y-2">
          {queue.map(({ c, f, deep }) => (
            <div key={c.slug} className="flex flex-wrap items-center gap-3 rounded-lg bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[14.5px] font-semibold text-white">{c.name}</span>
                  {deep && <span className="rounded-full bg-signal/12 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-signal">deep read</span>}
                </span>
                <span className="mt-0.5 block text-[12px] text-ink-500">
                  {c.archetype} · rots {c.rots ?? "medium"} · checked {c.checked ?? "2026-09"}
                </span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
                f.stale ? "bg-clay/15 text-clay ring-clay/30" : "bg-white/[0.06] text-ink-400 ring-white/10"}`}>
                {f.stale ? `${f.overdue}mo overdue` : `${f.budget - f.months}mo of budget left`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* The remote */}
      <section>
        <h2 className="font-serif-display text-[25px] text-white">The remote</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Phrases to paste into a fresh session when you want the map to move. Nothing here is scheduled — that is a
          deliberate choice, not a missing feature. Replace anything in <span className="font-mono text-[13px] text-signal">&lt;ANGLE BRACKETS&gt;</span> before running.
        </p>
        <div className="mt-5 space-y-2">
          {PROMPTS.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
              <button onClick={() => setOpen(open === p.id ? null : p.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold text-white">{p.label}</span>
                  <span className="mt-0.5 block text-[12.5px] text-ink-500">{p.when}</span>
                </span>
                <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10.5px] text-ink-400 ring-1 ring-white/10">
                  ~{COST[p.cost]}
                </span>
                <I.IChevronDown className={`h-4 w-4 shrink-0 text-ink-500 transition ${open === p.id ? "rotate-180" : ""}`} />
              </button>
              {open === p.id && (
                <div className="animate-fadeUp border-t border-white/10">
                  <pre className="thin-scroll overflow-x-auto whitespace-pre-wrap px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-ink-300">
{p.text}
                  </pre>
                  <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
                    <button onClick={() => copy(p)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-signal px-3 text-[12.5px] font-bold text-ink transition hover:bg-signal-300">
                      {copied === p.id ? <><I.ICheck className="h-3.5 w-3.5" /> Copied</> : "Copy prompt"}
                    </button>
                    <span className="text-[11.5px] text-ink-500">Paste into a new session at ~/Developer/compound</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section>
        <h2 className="font-serif-display text-[25px] text-white">Four rules that keep this from sprawling</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Every map like this dies the same way: accumulation without intent. These exist so the project has a shape
          that survives being worked on.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {OPERATING_RULES.map((r) => (
            <div key={r.rule} className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <h3 className="text-[15px] font-semibold text-signal">{r.rule}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.62] text-ink-300">{r.why}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
