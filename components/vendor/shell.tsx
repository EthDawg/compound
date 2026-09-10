"use client";

import Link from "next/link";
import { useState } from "react";
import type { VendorSkin } from "@/lib/vendors/types";
import { CompoundBar } from "../compound-bar";
import { Blocks } from "./blocks";
import { useXRay } from "../xray-provider";
import { Mark } from "./marks";
import * as I from "../icons";

export function VendorShell({ skin }: { skin: VendorSkin }) {
  const t = skin.theme;
  const { on } = useXRay();
  const [navOpen, setNavOpen] = useState(false);
  const sidebar = t.chrome === "sidebar";

  return (
    <div className="min-h-screen" style={{ background: t.bg, fontFamily: t.font }}>
      <CompoundBar activeId={skin.id} />

      {/* Study banner — this is an interpretation, and it says so inside the frame. */}
      <div className="border-b px-3 py-2 text-[11.5px] sm:px-4"
        style={{ background: t.surfaceAlt, borderColor: t.border, color: t.inkMuted }}>
        <span className="font-semibold" style={{ color: t.ink }}>Design study.</span>{" "}
        An interpretation of {skin.studyOf}. Fictional company, no logos or real product designs, not affiliated.
      </div>

      {/* Vendor chrome */}
      <header style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}>
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
          {sidebar && (
            <button onClick={() => setNavOpen((v) => !v)} className="grid h-8 w-8 place-items-center lg:hidden"
              style={{ color: t.inkMuted }} aria-label="Menu">
              <I.IList />
            </button>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <span className="grid h-7 w-7 place-items-center" style={{ background: t.accent, color: t.accentInk, borderRadius: t.radiusSm }}>
              <Mark id={skin.id} />
            </span>
            <span className="text-[14.5px] font-semibold tracking-tight" style={{ color: t.ink }}>{skin.name}</span>
          </div>

          {!sidebar && (
            <nav className="ml-4 hidden items-center gap-1 md:flex">
              {skin.nav[0]?.items.map((it) => (
                <span key={it.label}
                  className="cursor-default px-3 py-1.5 text-[13px]"
                  style={{
                    color: it.on ? t.accent : t.inkMuted,
                    borderBottom: it.on ? `2px solid ${t.accent}` : "2px solid transparent",
                    fontWeight: it.on ? 600 : 400,
                  }}>
                  {it.label}
                </span>
              ))}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden h-8 items-center rounded px-2.5 text-[12.5px] sm:flex"
              style={{ background: t.surfaceAlt, color: t.inkMuted, borderRadius: t.radiusSm }}>
              Meridian Optics
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full text-[10.5px] font-bold"
              style={{ background: t.accent, color: t.accentInk }}>PR</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebar && (
          <aside className={`${navOpen ? "block" : "hidden"} w-[212px] shrink-0 lg:block`}
            style={{ background: t.surface, borderRight: `1px solid ${t.border}`, minHeight: "calc(100vh - 6.5rem)" }}>
            <nav className="p-2.5">
              {skin.nav.map((g, i) => (
                <div key={i} className={i ? "mt-4" : ""}>
                  {g.group && (
                    <div className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: t.inkFaint }}>
                      {g.group}
                    </div>
                  )}
                  <ul className="space-y-px">
                    {g.items.map((it) => (
                      <li key={it.label}>
                        <span className="flex cursor-default items-center gap-2.5 px-2.5 py-[7px] text-[13px]"
                          style={{
                            background: it.on ? t.accentSoft : "transparent",
                            color: it.on ? t.accent : t.inkMuted,
                            fontWeight: it.on ? 600 : 400,
                            borderRadius: t.radiusSm,
                          }}>
                          <span className="truncate">{it.label}</span>
                          {it.badge && (
                            <span className="ml-auto rounded-full px-1.5 text-[10px] font-bold"
                              style={{ background: t.accent, color: t.accentInk }}>{it.badge}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        )}

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-4">
              <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: t.inkFaint }}>
                {skin.greeting.eyebrow}
              </div>
              <h1 className="mt-1 text-[22px] font-semibold tracking-tight" style={{ color: t.ink }}>{skin.greeting.title}</h1>
              <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed" style={{ color: t.inkMuted }}>{skin.greeting.sub}</p>
            </div>

            <Blocks blocks={skin.home} t={t} />

            {/* X-ray: the reasoning, in Compound's voice, never the vendor's */}
            {on && skin.xray.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="rounded-lg bg-ink p-4 text-ink-200">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-signal">
                    <I.IEye className="h-3 w-3" /> What this interface is arguing
                  </div>
                  <p className="prose-measure mt-2 text-[13.5px] leading-[1.65] text-ink-100">{skin.ethos}</p>
                </div>
                {skin.xray.map((x) => (
                  <div key={x.title} className="rounded-lg bg-ink-800 p-4">
                    <h4 className="text-[14px] font-semibold text-white">{x.title}</h4>
                    <p className="prose-measure mt-1.5 text-[13.5px] leading-[1.62] text-ink-300">{x.body}</p>
                  </div>
                ))}
              </div>
            )}

            {!on && (
              <div className="mt-5 rounded-lg px-4 py-3 text-[12.5px]"
                style={{ background: t.surfaceAlt, color: t.inkMuted, border: `1px dashed ${t.border}` }}>
                Press <kbd className="rounded px-1 font-mono text-[11px] font-bold" style={{ background: t.surface, color: t.ink }}>X</kbd>{" "}
                — or use X-ray above — to see what this interface is arguing and why it is laid out this way.
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5" style={{ borderColor: t.border }}>
              <Link href={`/ecosystem/${skin.id}`} className="text-[12.5px] font-semibold" style={{ color: t.accent }}>
                Read the full position on the map →
              </Link>
              <span className="text-[12px]" style={{ color: t.inkFaint }}>{skin.bet}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
