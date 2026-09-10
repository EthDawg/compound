"use client";

import { useEffect, useRef, useState } from "react";
import type { Variant } from "@/lib/content/pocket";
import { P_ICONS } from "./pocket-ui";
import * as I from "./icons";

const REV = {
  yes: { label: "Reversible", cls: "text-moss" },
  costly: { label: "Reversible, with cost", cls: "text-signal" },
  no: { label: "Irreversible", cls: "text-clay" },
} as const;

export function Cascade({ variant, verb, tone }: { variant: Variant; verb: string; tone: "go" | "stop" }) {
  const [ms, setMs] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "waiting" | "done">("idle");
  const raf = useRef<number | null>(null);
  const t0 = useRef(0);
  const offset = useRef(0);
  const [approved, setApproved] = useState<Set<number>>(new Set());
  // The rAF loop must read the latest approvals, not the ones captured at render.
  const approvedRef = useRef<Set<number>>(new Set());
  const runningRef = useRef(false);

  const steps = variant.steps;
  const last = steps[steps.length - 1];

  // Reset whenever the variant changes
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null; runningRef.current = false;
    setMs(0); setState("idle"); setApproved(new Set()); approvedRef.current = new Set(); offset.current = 0;
  }, [variant.id]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // requestAnimationFrame stops while the tab is hidden. Without this, elapsed
  // time keeps accruing off performance.now() and the run jumps to the end the
  // moment you look back at it. Bank the progress on hide, restart the clock on show.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
        if (runningRef.current) offset.current = offset.current + (performance.now() - t0.current);
      } else if (runningRef.current) {
        t0.current = performance.now();
        raf.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tick = () => {
    const el = offset.current + (performance.now() - t0.current);
    // Pause at the first un-approved human gate
    const gate = steps.findIndex((s, i) => s.actor === "human" && !approvedRef.current.has(i));
    const gateAt = gate >= 0 ? steps[gate].atMs : Infinity;
    if (el >= gateAt) {
      setMs(gateAt); offset.current = gateAt; runningRef.current = false; raf.current = null; setState("waiting"); return;
    }
    if (el >= last.atMs + 700) { setMs(last.atMs + 700); runningRef.current = false; raf.current = null; setState("done"); return; }
    setMs(el);
    raf.current = requestAnimationFrame(tick);
  };

  const start = () => {
    // Respect a reduced-motion preference by settling straight to the end state.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const gate = steps.findIndex((s, i) => s.actor === "human" && !approvedRef.current.has(i));
      if (gate >= 0) { setMs(steps[gate].atMs); offset.current = steps[gate].atMs; setState("waiting"); return; }
      setMs(last.atMs + 700); setState("done"); return;
    }
    t0.current = performance.now();
    runningRef.current = true;
    setState("running");
    raf.current = requestAnimationFrame(tick);
  };
  const run = () => { offset.current = 0; setMs(0); setApproved(new Set()); approvedRef.current = new Set(); start(); };
  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    runningRef.current = false;
    setMs(0); setState("idle"); setApproved(new Set()); approvedRef.current = new Set(); offset.current = 0;
  };

  const approve = (i: number) => {
    const next = new Set(approvedRef.current);
    next.add(i);
    approvedRef.current = next;
    setApproved(next);
    start();
  };

  const gateIdx = steps.findIndex((s, i) => s.actor === "human" && !approved.has(i));
  const seconds = (ms / 1000).toFixed(1);
  const agentDone = steps.filter((s, i) => s.atMs <= ms && (s.actor === "agent" || approved.has(i))).length;

  return (
    <div>
      {/* Clock + trigger */}
      <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Elapsed</div>
            <div className={`num font-serif-display text-[38px] leading-none ${state === "done" ? "text-moss" : state === "waiting" ? "text-signal" : "text-white"}`}>
              {seconds}<span className="text-[20px] text-ink-500">s</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Systems</div>
            <div className="num font-serif-display text-[38px] leading-none text-white">
              {agentDone}<span className="text-[20px] text-ink-500">/{steps.length}</span>
            </div>
          </div>
        </div>

        {state === "idle" ? (
          <button onClick={run}
            className={`mt-3.5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition active:scale-[0.99] ${
              tone === "stop" ? "bg-clay text-white" : "bg-signal text-ink"
            }`}>
            <I.IBolt className="h-4 w-4" /> {verb}
          </button>
        ) : (
          <button onClick={reset}
            className="mt-3.5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-[14px] font-semibold text-white transition active:scale-[0.99]">
            Run it again
          </button>
        )}
      </div>

      {/* Human gate */}
      {state === "waiting" && gateIdx >= 0 && (
        <div className="animate-fadeUp mt-3 rounded-2xl bg-clay/[0.12] p-4 ring-1 ring-clay/40">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-clay">
            <I.IAlert className="h-3.5 w-3.5" /> Stopped — this one needs a person
          </div>
          <p className="mt-2 text-[14.5px] font-semibold leading-snug text-white">{steps[gateIdx].sys}</p>
          <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-200">{steps[gateIdx].detail}</p>
          <p className="mt-2.5 text-[12.5px] leading-[1.55] text-ink-400">
            The agent assembled all of it and can explain every number. It cannot execute, because this action is
            irreversible — and that limit lives in the system rather than in a prompt.
          </p>
          <button onClick={() => approve(gateIdx)}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[14.5px] font-bold text-ink transition active:scale-[0.99]">
            <I.ICheck className="h-4 w-4" /> Approve as a human
          </button>
        </div>
      )}

      {/* Steps */}
      <ol className="mt-3 space-y-1.5">
        {steps.map((s, i) => {
          const fired = s.atMs <= ms && (s.actor === "agent" || approved.has(i));
          const isGate = state === "waiting" && i === gateIdx;
          const Icon = P_ICONS[s.icon] ?? I.IBolt;
          return (
            <li key={s.sys}
              className={`flex items-start gap-3 rounded-xl px-3.5 py-3 ring-1 transition-all duration-300 ${
                isGate ? "bg-clay/[0.10] ring-clay/40"
                  : fired ? "bg-white/[0.06] ring-white/[0.12]"
                  : "bg-white/[0.02] ring-white/[0.06] opacity-45"
              }`}>
              <span className={`mt-px grid h-7 w-7 shrink-0 place-items-center rounded-lg transition ${
                fired ? "bg-moss text-white" : isGate ? "bg-clay text-white" : "bg-white/[0.07] text-ink-500"
              }`}>
                {fired ? <I.ICheck className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-[14px] font-semibold ${fired || isGate ? "text-white" : "text-ink-400"}`}>{s.sys}</span>
                  <span className="num ml-auto shrink-0 text-[11.5px] text-ink-500">
                    {fired ? `${(s.atMs / 1000).toFixed(1)}s` : ""}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-ink-400">{s.detail}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`text-[10.5px] font-bold uppercase tracking-wider ${REV[s.reversible].cls}`}>
                    {REV[s.reversible].label}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-wider text-ink-600">
                    {s.actor === "human" ? "· human decides" : "· agent acts"}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Result */}
      {state === "done" && (
        <div className="animate-fadeUp mt-3 overflow-hidden rounded-2xl bg-signal/[0.10] ring-1 ring-signal/30">
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {[
              [`${seconds}s`, "here"],
              [variant.legacy.days, "elsewhere"],
              [variant.legacy.people, "coordinating"],
            ].map(([v, l]) => (
              <div key={l} className="bg-ink px-2 py-3 text-center">
                <div className="num font-serif-display text-[19px] leading-tight text-signal">{v}</div>
                <div className="mt-0.5 text-[10.5px] uppercase tracking-wider text-ink-500">{l}</div>
              </div>
            ))}
          </div>
          <p className="px-4 py-3.5 text-[13.5px] leading-[1.6] text-ink-200">{variant.note}</p>
        </div>
      )}
    </div>
  );
}
