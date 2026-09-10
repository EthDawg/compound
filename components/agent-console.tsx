"use client";

import { useState } from "react";
import { AGENT_DEMOS } from "@/lib/content/agentic";
import { Pill } from "./backstage-ui";
import * as I from "./icons";

export function AgentConsole() {
  const [i, setI] = useState(0);
  const [ran, setRan] = useState(false);
  const d = AGENT_DEMOS[i];

  const pick = (n: number) => { setI(n); setRan(false); };
  const run = () => { setRan(false); requestAnimationFrame(() => setRan(true)); };

  return (
    <div className="overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold text-white">Ask the graph</h3>
            <p className="mt-0.5 text-[12.5px] text-ink-500">
              Three questions. Two are answerable. One is refused, and the refusal is the point.
            </p>
          </div>
          <button
            onClick={run}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-signal px-3 text-[12.5px] font-semibold text-ink transition hover:bg-signal-300"
          >
            <I.IBolt className="h-3.5 w-3.5" /> Run
          </button>
        </div>
        <div className="mt-3 space-y-1.5">
          {AGENT_DEMOS.map((x, n) => (
            <button
              key={n}
              onClick={() => pick(n)}
              className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition ${
                n === i ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5"
              }`}
            >
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${n === i ? "bg-signal" : "bg-ink-600"}`} />
              <span className="min-w-0 flex-1">
                <span className={`block text-[13.5px] leading-snug ${n === i ? "text-white" : "text-ink-400"}`}>
                  {x.q}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-600">{x.asker}</span>
              </span>
              {!x.allowed && <span className="mt-0.5 shrink-0"><Pill>refused</Pill></span>}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Domains touched</span>
          {d.domains.map((x) => <Pill key={x} tone="signal">{x}</Pill>)}
        </div>

        <ol className="mt-3.5 space-y-2">
          {d.reasoning.map((r, n) => {
            const isCheck = r.toLowerCase().includes("permission");
            const fails = isCheck && !d.allowed;
            return (
              <li
                key={n}
                className={`flex items-start gap-2.5 transition-all duration-300 ${ran ? "opacity-100 translate-y-0" : "opacity-25 translate-y-1"}`}
                style={{ transitionDelay: ran ? `${n * 130}ms` : "0ms" }}
              >
                <span className={`num mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold ${
                  !ran ? "bg-white/8 text-ink-600" : fails ? "bg-clay text-white" : isCheck ? "bg-moss text-white" : "bg-white/10 text-signal"
                }`}>
                  {ran && fails ? <I.IClose className="h-2.5 w-2.5" /> : ran && isCheck ? <I.ICheck className="h-2.5 w-2.5" /> : n + 1}
                </span>
                <span className={`font-mono text-[12.5px] leading-relaxed ${fails && ran ? "text-clay" : "text-ink-300"}`}>
                  {r}
                </span>
              </li>
            );
          })}
        </ol>

        <div
          className={`mt-4 rounded-lg p-4 ring-1 transition-all duration-500 ${
            !ran ? "opacity-25 translate-y-1 bg-white/[0.03] ring-white/10"
              : d.allowed ? "bg-signal/[0.07] ring-signal/25" : "bg-clay/[0.09] ring-clay/30"
          }`}
          style={{ transitionDelay: ran ? `${d.reasoning.length * 130 + 100}ms` : "0ms" }}
        >
          <div className={`text-[11px] font-bold uppercase tracking-wider ${d.allowed ? "text-signal" : "text-clay"}`}>
            {d.allowed ? "Answer" : "Refusal"}
          </div>
          <p className="mt-1.5 text-[14.5px] leading-[1.65] text-ink-100">{d.answer}</p>
        </div>

        {!d.allowed && (
          <p className="mt-3 border-t border-white/10 pt-3 text-[13px] leading-[1.6] text-ink-400">
            <span className="font-semibold text-white">Why this matters more than the two that worked. </span>
            A system that flattens permissions into an index at write time cannot produce this refusal — it produces a
            confident partial answer instead, and nothing in the output tells you that it did. The boundary has to be
            evaluated on the way in, against the live record, or it is not a boundary.
          </p>
        )}
      </div>
    </div>
  );
}
