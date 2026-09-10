"use client";

import { useState } from "react";
import { AGENT_DEMOS } from "@/lib/content/agentic";
import { WHY_THESE_THREE } from "@/lib/content/pocket";
import { PocketHead } from "./pocket-ui";
import * as I from "./icons";

export function PocketAsk() {
  const [open, setOpen] = useState<number | null>(null);
  const [ran, setRan] = useState<number | null>(null);
  const why = WHY_THESE_THREE.find((w) => w.id === "ask")!;
  const [showWhy, setShowWhy] = useState(false);

  const ask = (i: number) => {
    setOpen(i);
    setRan(null);
    setTimeout(() => setRan(i), 60);
  };

  return (
    <div>
      <PocketHead
        title="Ask"
        sub="Three questions against the live graph. Two get answered. The third is refused — and the refusal is the part that is hard to fake."
      />

      <div className="space-y-2.5">
        {AGENT_DEMOS.map((d, i) => {
          const isOpen = open === i;
          const isRan = ran === i;
          return (
            <div key={i} className={`overflow-hidden rounded-2xl ring-1 transition ${
              isOpen ? (d.allowed ? "bg-white/[0.06] ring-white/15" : "bg-clay/[0.08] ring-clay/30") : "bg-white/[0.04] ring-white/10"
            }`}>
              <button onClick={() => (isOpen ? setOpen(null) : ask(i))} className="w-full px-4 py-3.5 text-left">
                <div className="flex items-start gap-2.5">
                  <span className="font-serif-display mt-px shrink-0 text-[15px] leading-none text-signal">Q</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-medium leading-snug text-white">{d.q}</span>
                    <span className="mt-1 block text-[11.5px] text-ink-500">{d.asker}</span>
                  </span>
                  <I.IChevronDown className={`mt-1 h-4 w-4 shrink-0 text-ink-500 transition ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">Domains</span>
                    {d.domains.map((x) => (
                      <span key={x} className="rounded-full bg-signal/12 px-2 py-0.5 text-[10.5px] font-medium text-signal ring-1 ring-signal/25">
                        {x}
                      </span>
                    ))}
                  </div>

                  <ol className="mt-3 space-y-2">
                    {d.reasoning.map((r, n) => {
                      const isCheck = r.toLowerCase().includes("permission");
                      const fails = isCheck && !d.allowed;
                      return (
                        <li key={n}
                          className={`flex items-start gap-2.5 transition-all duration-300 ${isRan ? "opacity-100 translate-y-0" : "opacity-20 translate-y-1"}`}
                          style={{ transitionDelay: isRan ? `${n * 160}ms` : "0ms" }}>
                          <span className={`num mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                            !isRan ? "bg-white/8 text-ink-600" : fails ? "bg-clay text-white" : isCheck ? "bg-moss text-white" : "bg-white/10 text-signal"
                          }`}>
                            {isRan && fails ? <I.IClose className="h-2.5 w-2.5" /> : isRan && isCheck ? <I.ICheck className="h-2.5 w-2.5" /> : n + 1}
                          </span>
                          <span className={`font-mono text-[11.5px] leading-[1.5] ${fails && isRan ? "text-clay" : "text-ink-400"}`}>{r}</span>
                        </li>
                      );
                    })}
                  </ol>

                  <div className={`mt-3 rounded-xl p-3.5 ring-1 transition-all duration-500 ${
                    !isRan ? "opacity-20 bg-white/[0.03] ring-white/10"
                      : d.allowed ? "bg-signal/[0.10] ring-signal/30" : "bg-clay/[0.14] ring-clay/40"
                  }`} style={{ transitionDelay: isRan ? `${d.reasoning.length * 160 + 120}ms` : "0ms" }}>
                    <div className={`text-[10.5px] font-bold uppercase tracking-wider ${d.allowed ? "text-signal" : "text-clay"}`}>
                      {d.allowed ? "Answer" : "Refusal"}
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-100">{d.answer}</p>
                  </div>

                  {!d.allowed && (
                    <p className="mt-3 text-[12.5px] leading-[1.55] text-ink-400">
                      <span className="font-semibold text-white">Why this one matters most. </span>
                      A system that flattens permissions into an index at write time cannot produce this. It produces a
                      confident partial answer, and nothing in the output tells you it did.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowWhy((v) => !v)}
        className="mt-4 flex w-full items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 text-left ring-1 ring-white/10 active:bg-white/[0.08]">
        <I.IEye className="h-4 w-4 shrink-0 text-signal" />
        <span className="flex-1 text-[13.5px] font-semibold text-white">Why this is one of the three</span>
        <I.IChevronDown className={`h-4 w-4 shrink-0 text-ink-500 transition ${showWhy ? "rotate-180" : ""}`} />
      </button>
      {showWhy && (
        <div className="animate-fadeUp mt-2 rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
          <p className="text-[14px] font-semibold leading-snug text-signal">{why.line}</p>
          <p className="mt-2 text-[13.5px] leading-[1.62] text-ink-300">{why.why}</p>
          <p className="mt-3 border-t border-white/10 pt-2.5 text-[12.5px] text-ink-500">
            <span className="font-semibold text-ink-400">Lands with: </span>{why.buyer}
          </p>
        </div>
      )}
    </div>
  );
}
