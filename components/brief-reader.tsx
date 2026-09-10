"use client";

import Link from "next/link";
import { useState } from "react";
import { LENSES } from "@/lib/content/brief";
import * as I from "./icons";

export function BriefReader() {
  const [id, setId] = useState(LENSES[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const lens = LENSES.find((l) => l.id === id)!;
  const key = (n: number) => `${id}-${n}`;
  const completed = lens.steps.filter((s) => done[key(s.n)]).length;
  const pct = Math.round((completed / lens.steps.length) * 100);

  return (
    <div>
      {/* Lens picker */}
      <div className="sticky top-14 z-30 -mx-4 border-b border-white/10 bg-ink/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-500">
          Who is holding this?
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LENSES.map((l) => (
            <button
              key={l.id}
              onClick={() => setId(l.id)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                l.id === id ? "bg-signal text-ink" : "bg-white/[0.06] text-ink-300 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              {l.label}
              <span className={`num ml-1.5 text-[11px] ${l.id === id ? "text-ink/60" : "text-ink-600"}`}>
                {l.total}m
              </span>
            </button>
          ))}
        </div>
        {completed > 0 && (
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-signal transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="num shrink-0 text-[11.5px] text-ink-500">
              {completed}/{lens.steps.length}
            </span>
          </div>
        )}
      </div>

      {/* Opener */}
      <div className="py-7">
        <p className="text-[12.5px] font-medium uppercase tracking-wide text-signal">{lens.who}</p>
        <p className="prose-measure mt-3 text-[17px] leading-[1.65] text-ink-200">{lens.opener}</p>
      </div>

      {/* Steps */}
      <ol className="relative space-y-3 pb-2">
        <span className="absolute bottom-8 left-[15px] top-4 w-px bg-white/10" aria-hidden />
        {lens.steps.map((s) => {
          const isDone = !!done[key(s.n)];
          return (
            <li key={s.n} className="relative">
              <div className={`rounded-xl ring-1 transition ${isDone ? "bg-white/[0.02] ring-white/[0.07]" : "bg-white/[0.05] ring-white/10"}`}>
                <div className="flex items-start gap-3.5 p-4 sm:p-5">
                  <button
                    onClick={() => setDone((d) => ({ ...d, [key(s.n)]: !d[key(s.n)] }))}
                    aria-label={isDone ? "Mark as not read" : "Mark as read"}
                    className={`num z-10 mt-px grid h-[31px] w-[31px] shrink-0 place-items-center rounded-full text-[12px] font-bold ring-4 ring-ink transition ${
                      isDone ? "bg-moss text-white" : "bg-white/10 text-signal hover:bg-white/20"
                    }`}
                  >
                    {isDone ? <I.ICheck className="h-3.5 w-3.5" /> : s.n}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className={`text-[16px] font-semibold tracking-tight ${isDone ? "text-ink-400" : "text-white"}`}>
                        {s.title}
                      </h3>
                      <span className="num text-[11.5px] text-ink-600">{s.mins} min</span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-[1.62] text-ink-400">{s.why}</p>

                    <div className="mt-3 rounded-lg border-l-2 border-signal bg-signal/[0.06] py-2 pl-3.5 pr-3">
                      <p className="text-[13.5px] leading-[1.55] text-ink-200">
                        <span className="font-semibold text-signal">Takeaway: </span>{s.takeaway}
                      </p>
                    </div>

                    <Link
                      href={s.href}
                      className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[12.5px] font-semibold text-white transition hover:bg-white/[0.18]"
                    >
                      {s.cta} <I.IArrow className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Closing */}
      <div className="mt-6 rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
        <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Where to push</div>
        <p className="prose-measure mt-2 text-[15px] leading-[1.68] text-ink-200">{lens.closing}</p>
      </div>
    </div>
  );
}
