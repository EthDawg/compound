"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SKINS } from "@/lib/vendors/skins";
import { useXRay } from "./xray-provider";
import { Mark } from "./vendor/marks";
import * as I from "./icons";

/**
 * The observability layer. Compound's own brand sits above whichever vendor
 * instance is loaded, and never inside it — the point is that you are looking at
 * these products, not using them.
 */
export function CompoundBar({ activeId }: { activeId: string }) {
  const [open, setOpen] = useState(false);
  const { on, toggle } = useXRay();
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const active = SKINS.find((s) => s.id === activeId);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-ink text-ink-200">
      <div className="flex h-12 items-center gap-2 px-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-signal text-ink">
            <I.ILayers className="h-3.5 w-3.5" />
          </span>
          <span className="hidden text-[14px] font-semibold tracking-tight text-white sm:block">Compound</span>
        </Link>

        <span className="hidden text-[11px] uppercase tracking-wider text-ink-500 md:block">observing</span>

        {/* Vendor switcher */}
        <div className="relative min-w-0" ref={ref}>
          <button onClick={() => setOpen((v) => !v)}
            className="flex h-8 min-w-0 items-center gap-2 rounded-md bg-white/[0.08] px-2.5 text-[12.5px] font-medium text-white ring-1 ring-white/12 hover:bg-white/[0.14]">
            <span className="shrink-0" style={{ color: active?.theme.accent }}><Mark id={activeId} className="h-3.5 w-3.5" /></span>
            <span className="truncate">{active?.name}</span>
            <I.IChevronDown className={`h-3.5 w-3.5 shrink-0 text-ink-400 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="animate-fadeUp absolute left-0 top-10 z-50 w-[19rem] overflow-hidden rounded-xl bg-ink-800 shadow-pop ring-1 ring-white/15">
              <div className="border-b border-white/10 px-3.5 py-2.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-signal">Switch instance</div>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-400">
                  The same fictional company, rendered the way each position would build it.
                </p>
              </div>
              <ul className="max-h-[60vh] overflow-y-auto thin-scroll py-1">
                {SKINS.map((s) => (
                  <li key={s.id}>
                    <Link href={s.href}
                      className={`flex items-start gap-2.5 px-3.5 py-2.5 transition hover:bg-white/[0.07] ${
                        s.id === activeId ? "bg-white/[0.06]" : ""}`}>
                      <span className="mt-0.5 shrink-0" style={{ color: s.theme.accent }}><Mark id={s.id} className="h-3.5 w-3.5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-white">{s.name}</span>
                          <span className={`rounded-full px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider ${
                            s.depth === "Full study" ? "bg-signal/15 text-signal" : "bg-white/10 text-ink-400"}`}>
                            {s.depth}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-400">{s.bet}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 px-3.5 py-2.5">
                <p className="text-[11px] leading-snug text-ink-500">
                  Design studies of each pattern. No logos, wordmarks or real product designs — and not affiliated with
                  any company named.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button onClick={toggle}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-semibold transition ${
              on ? "bg-signal text-ink" : "bg-white/[0.08] text-white ring-1 ring-white/12 hover:bg-white/[0.14]"}`}
            title="Toggle x-ray  ·  press X">
            <I.IEye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">X-ray</span>
          </button>
          <Link href="/ecosystem" className="hidden h-8 items-center rounded-md bg-white/[0.08] px-2.5 text-[12px] font-medium text-white ring-1 ring-white/12 hover:bg-white/[0.14] sm:flex">
            Map
          </Link>
          <Link href="/desk" className="hidden h-8 items-center rounded-md bg-white/[0.08] px-2.5 text-[12px] font-medium text-white ring-1 ring-white/12 hover:bg-white/[0.14] md:flex">
            Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
