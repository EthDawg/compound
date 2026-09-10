"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "./nav";
import { useXRay } from "./xray-provider";
import { XRay } from "./xray";
import { COMPANY } from "@/lib/data/company";
import * as I from "./icons";

const ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  people: I.IPeople, hire: I.IHire, payroll: I.IPayroll, benefits: I.IBenefits, time: I.ITime,
  book: I.IBook, device: I.IDevice, apps: I.IApps, lock: I.ILock, shield: I.IShield,
  card: I.ICard, expense: I.IExpense, bill: I.IBill, report: I.IReport, flow: I.IFlow,
  graph: I.IGraph, list: I.IList, globe: I.IGlobe,
};

export function ProductShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { on, toggle } = useXRay();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
          <button
            onClick={() => setMobileNav((v) => !v)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-500 hover:bg-ink-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <I.IList />
          </button>

          <Link href="/app" className="flex shrink-0 items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-ink text-signal">
              <I.ILayers className="h-4 w-4" />
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight sm:block">Compound</span>
          </Link>

          <div className="mx-1 hidden h-5 w-px bg-ink-200 sm:block" />

          <button className="hidden shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-700 hover:bg-ink-100 sm:flex">
            <span className="grid h-5 w-5 place-items-center rounded bg-clay-100 text-[10px] font-bold text-clay">M</span>
            {COMPANY.name}
            <I.IChevronDown className="h-3.5 w-3.5 text-ink-400" />
          </button>

          <div className="ml-auto flex flex-1 items-center justify-end gap-2">
            <div className="relative hidden md:block">
              <I.ISearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <input
                placeholder="Search people, devices, apps, spend…"
                className="h-8 w-[19rem] rounded-md border border-ink-200 bg-ink-50 pl-8 pr-3 text-[13px] placeholder:text-ink-400 focus:border-ink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal/25"
              />
            </div>

            <button
              onClick={toggle}
              className={`group flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-semibold transition ${
                on
                  ? "border-ink bg-ink text-signal shadow-sm"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50"
              }`}
              title="Toggle x-ray mode  ·  press X"
            >
              <I.IEye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">X-ray</span>
              <kbd
                className={`ml-0.5 hidden rounded px-1 py-px font-mono text-[10px] font-bold sm:inline ${
                  on ? "bg-white/15 text-signal-300" : "bg-ink-100 text-ink-400"
                }`}
              >
                X
              </kbd>
            </button>

            <Link
              href="/backstage"
              className="flex h-8 items-center gap-1.5 rounded-md bg-ink px-2.5 text-[12.5px] font-semibold text-white transition hover:bg-ink-800"
            >
              <I.IBook className="h-3.5 w-3.5 text-signal" />
              <span className="hidden sm:inline">Backstage</span>
            </Link>

            <span className="ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-700 text-[10.5px] font-bold text-white">
              PR
            </span>
          </div>
        </div>

        {on && (
          <div className="animate-fadeUp border-t border-signal-300 bg-signal-100 px-4 py-2 text-[12.5px] text-ink-700">
            <span className="font-semibold text-ink">X-ray on.</span> The product is annotated with the reasoning
            behind it — design premises, trade-offs, and what each choice costs. Press{" "}
            <kbd className="rounded bg-white px-1 font-mono text-[10.5px] font-bold ring-1 ring-ink-200">X</kbd> to go back to
            just using the app.
          </div>
        )}
      </header>

      <div className="flex">
        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside
          className={`${
            mobileNav ? "block" : "hidden"
          } fixed inset-y-0 left-0 z-30 w-[236px] shrink-0 overflow-y-auto border-r border-ink-200 bg-white pt-16 lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:pt-0 thin-scroll`}
        >
          <nav className="px-2.5 py-3">
            <Link
              href="/app"
              onClick={() => setMobileNav(false)}
              className={`mb-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium ${
                path === "/app" ? "bg-ink-100 text-ink" : "text-ink-600 hover:bg-ink-50"
              }`}
            >
              <I.IHome className="h-4 w-4 text-ink-400" />
              Home
            </Link>

            <XRay id="nav-surface">
              <div className="space-y-4">
                {NAV.map((group) => (
                  <div key={group.label}>
                    <div className="mb-1 flex items-baseline justify-between px-2.5">
                      <span className="text-2xs font-bold uppercase tracking-wider text-ink-400">{group.label}</span>
                      {on && <span className="text-2xs text-ink-300">{group.items.length}</span>}
                    </div>
                    {on && (
                      <p className="mb-1.5 px-2.5 text-[11px] italic leading-tight text-signal-600">{group.note}</p>
                    )}
                    <ul className="space-y-px">
                      {group.items.map((item) => {
                        const Icon = ICONS[item.icon] ?? I.IList;
                        const active = path === item.href || path.startsWith(item.href + "/");
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileNav(false)}
                              className={`group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition ${
                                active
                                  ? "bg-ink-100 font-medium text-ink"
                                  : "text-ink-600 hover:bg-ink-50 hover:text-ink"
                              }`}
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${active ? "text-ink-700" : "text-ink-400"}`} />
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto rounded-full bg-clay px-1.5 py-px text-[10px] font-bold text-white">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </XRay>

            <div className="mt-5 space-y-2 border-t border-ink-100 px-2.5 pt-3">
              <Link
                href="/ecosystem"
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink"
              >
                <I.IGraph className="h-3.5 w-3.5 text-ink-400" />
                The map
                <span className="ml-auto text-[10.5px] text-ink-400">ecosystem</span>
              </Link>
              <Link
                href="/pocket"
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink"
              >
                <I.ILayers className="h-3.5 w-3.5 text-ink-400" />
                Pocket
                <span className="ml-auto text-[10.5px] text-ink-400">mobile</span>
              </Link>
              <Link
                href="/brief"
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink"
              >
                <I.IClock className="h-3.5 w-3.5 text-ink-400" />
                12-minute brief
              </Link>
              <Link
                href="/backstage"
                className="group block rounded-lg bg-ink p-3 text-white transition hover:bg-ink-800"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-signal">
                  <I.ISpark className="h-3 w-3" />
                  Backstage
                </div>
                <p className="mt-1 text-[12px] leading-snug text-ink-300">
                  Why any of this is shaped the way it is. Ten essays, fourteen decisions, and the numbers that would
                  prove it wrong.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-white">
                  Go behind it <I.IArrow className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </nav>
        </aside>

        {mobileNav && (
          <div className="fixed inset-0 z-20 bg-ink/20 lg:hidden" onClick={() => setMobileNav(false)} />
        )}

        {/* ── Main ──────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
