"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as I from "./icons";

const SECTIONS = [
  { href: "/backstage", label: "Overview", icon: I.IHome, n: "" },
  { href: "/brief", label: "The 12-minute brief", icon: I.IClock, n: "" },
  { href: "/backstage/manual", label: "The operating manual", icon: I.IBook, n: "12" },
  { href: "/backstage/agentic", label: "The agentic turn", icon: I.ISpark, n: "" },
  { href: "/backstage/skills", label: "How it out-executes", icon: I.IBolt, n: "9" },
  { href: "/backstage/trajectory", label: "Growth from here", icon: I.IGraph, n: "4" },
  { href: "/backstage/decisions", label: "Decision log", icon: I.IList, n: "14" },
  { href: "/backstage/heresies", label: "Heresies", icon: I.ILayers, n: "11" },
  { href: "/backstage/metrics", label: "What we measure", icon: I.IReport, n: "8" },
  { href: "/backstage/org", label: "How it's organised", icon: I.IPeople, n: "4" },
  { href: "/backstage/timeline", label: "Nine years", icon: I.IClock, n: "5" },
  { href: "/backstage/ask", label: "Ask the founder", icon: I.IBook, n: "14" },
];

export function BackstageShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setOpen((v) => !v)} className="grid h-8 w-8 place-items-center rounded-md text-ink-400 hover:bg-white/10 lg:hidden" aria-label="Toggle sections">
            <I.IList />
          </button>
          <Link href="/backstage" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-signal text-ink">
              <I.ILayers className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Backstage</span>
          </Link>
          <span className="hidden text-[12.5px] text-ink-500 sm:block">· the reasoning under the product</span>
          <Link href="/app" className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white transition hover:bg-white/15">
            <I.IArrow className="h-3.5 w-3.5 rotate-180" />
            Back to the app
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] gap-8 px-4 sm:px-6">
        <aside className={`${open ? "block" : "hidden"} shrink-0 py-6 lg:block lg:w-[210px]`}>
          <nav className="sticky top-20 space-y-px">
            {SECTIONS.map((s) => {
              const active = s.href === "/backstage" ? path === s.href : path.startsWith(s.href);
              const Icon = s.icon;
              return (
                <Link key={s.href} href={s.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition ${
                    active ? "bg-white/10 font-medium text-white" : "text-ink-400 hover:bg-white/5 hover:text-ink-200"
                  }`}>
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-signal" : "text-ink-500"}`} />
                  <span className="truncate">{s.label}</span>
                  {s.n && <span className="num ml-auto text-[11px] text-ink-600">{s.n}</span>}
                </Link>
              );
            })}
            <div className="!mt-5 border-t border-white/10 pt-4">
              <p className="px-2.5 text-[11.5px] leading-relaxed text-ink-500">
                An independent study. The founder voice here is a reconstruction, not a quotation.
              </p>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-20">{children}</main>
      </div>
    </div>
  );
}
