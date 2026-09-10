"use client";

import { useState } from "react";
import type { Variant } from "@/lib/content/pocket";
import { WHY_THESE_THREE } from "@/lib/content/pocket";
import { Cascade } from "./cascade";
import { Chips, PocketHead } from "./pocket-ui";
import * as I from "./icons";

export function PocketFlow({
  id, title, sub, variants, verb, tone, pickLabel,
}: {
  id: string; title: string; sub: string; variants: Variant[];
  verb: string; tone: "go" | "stop"; pickLabel: string;
}) {
  const [vid, setVid] = useState(variants[0].id);
  const [open, setOpen] = useState(false);
  const variant = variants.find((v) => v.id === vid)!;
  const why = WHY_THESE_THREE.find((w) => w.id === id)!;

  return (
    <div>
      <PocketHead title={title} sub={sub} />

      <div className="mb-3">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">{pickLabel}</div>
        <Chips items={variants} value={vid} onChange={setVid} />
      </div>

      <Cascade variant={variant} verb={verb} tone={tone} />

      <button onClick={() => setOpen((v) => !v)}
        className="mt-4 flex w-full items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 text-left ring-1 ring-white/10 active:bg-white/[0.08]">
        <I.IEye className="h-4 w-4 shrink-0 text-signal" />
        <span className="flex-1 text-[13.5px] font-semibold text-white">Why this is one of the three</span>
        <I.IChevronDown className={`h-4 w-4 shrink-0 text-ink-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
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
