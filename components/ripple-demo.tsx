"use client";

import { useState } from "react";
import { FIELD_CHANGES } from "@/lib/data/workflows";
import * as I from "./icons";

const KIND: Record<string, { label: string; cls: string }> = {
  hr: { label: "HR", cls: "bg-clay-100 text-clay ring-clay/20" },
  it: { label: "IT", cls: "bg-sky-100 text-sky ring-sky/20" },
  fin: { label: "Finance", cls: "bg-moss-100 text-moss ring-moss/20" },
  legal: { label: "Legal", cls: "bg-ink-100 text-ink-600 ring-ink-200" },
};

export function RippleDemo({ compact = false }: { compact?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [fired, setFired] = useState(false);
  const change = FIELD_CHANGES[idx];

  const run = () => { setFired(false); requestAnimationFrame(() => setFired(true)); };
  const pick = (i: number) => { setIdx(i); setFired(false); };

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card">
      <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13.5px] font-semibold text-ink">Change one field</h3>
            <p className="mt-0.5 text-[12px] text-ink-500">
              {compact ? "Every product reads the same record." : "This is the demo. Not a feature tour — one write, and everything downstream of it."}
            </p>
          </div>
          <button
            onClick={run}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink px-3 text-[12.5px] font-semibold text-white transition hover:bg-ink-800"
          >
            <I.IBolt className="h-3.5 w-3.5 text-signal" />
            Apply change
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {FIELD_CHANGES.map((f, i) => (
            <button
              key={f.field}
              onClick={() => pick(i)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                i === idx ? "bg-ink text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-2xs font-bold uppercase tracking-wider text-ink-400">Amara Nwosu · Staff Engineer</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="rounded border border-ink-200 bg-ink-50 px-2 py-1 text-ink-500 line-through">
              {change.example.split(" → ")[0]}
            </span>
            <I.IArrow className="h-3.5 w-3.5 text-ink-400" />
            <span className={`rounded border px-2 py-1 font-medium transition ${fired ? "border-signal bg-signal-100 text-ink" : "border-ink-200 bg-white text-ink"}`}>
              {change.example.split(" → ")[1]}
            </span>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-ink-100">
        {change.ripples.map((r, i) => (
          <li
            key={r.system}
            className={`flex items-start gap-3 px-4 py-2.5 transition-all duration-300 ${
              fired ? "opacity-100 translate-y-0" : "opacity-35 translate-y-1"
            }`}
            style={{ transitionDelay: fired ? `${i * 85}ms` : "0ms" }}
          >
            <span className={`mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full transition ${fired ? "bg-moss text-white" : "bg-ink-200 text-transparent"}`}>
              <I.ICheck className="h-2.5 w-2.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[13px] font-medium text-ink">{r.system}</span>
                <span className={`rounded px-1.5 py-px text-[10px] font-semibold ring-1 ring-inset ${KIND[r.kind].cls}`}>
                  {KIND[r.kind].label}
                </span>
              </div>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{r.effect}</p>
            </div>
            <span className="num shrink-0 text-[11.5px] text-ink-400">{r.latency}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px]">
        <span className="text-ink-500">
          <span className="font-semibold text-ink">{change.ripples.length} systems</span> moved from one write.
        </span>
        <span className="text-ink-400">
          Best-of-breed equivalent: {change.ripples.length} tickets, {Math.max(2, Math.round(change.ripples.length * 0.7))} people, ~9 days.
        </span>
      </div>
    </div>
  );
}
