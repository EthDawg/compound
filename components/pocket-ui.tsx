"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as I from "./icons";

export const P_ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  people: I.IPeople, book: I.IBook, payroll: I.IPayroll, benefits: I.IBenefits,
  device: I.IDevice, apps: I.IApps, card: I.ICard, shield: I.IShield, globe: I.IGlobe,
  lock: I.ILock, clock: I.IClock, report: I.IReport, graph: I.IGraph, bolt: I.IBolt,
};

const TABS = [
  { href: "/pocket", label: "Onboard", icon: I.IHire },
  { href: "/pocket/offboard", label: "Offboard", icon: I.ILock },
  { href: "/pocket/ask", label: "Ask", icon: I.ISpark },
];

export function PocketChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-13 max-w-[560px] items-center gap-2.5 px-4 py-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-signal text-ink">
            <I.ILayers className="h-4 w-4" />
          </span>
          <span className="text-[14.5px] font-semibold tracking-tight text-white">Compound</span>
          <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal ring-1 ring-white/10">
            Pocket
          </span>
          <Link href="/backstage" className="ml-auto grid h-8 w-8 place-items-center rounded-md text-ink-400 hover:bg-white/10"
            aria-label="Backstage">
            <I.IBook className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto flex max-w-[560px]">
          {TABS.map((t) => {
            const active = path === t.href;
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition ${active ? "text-signal" : "text-ink-500"}`}>
                <Icon className="h-5 w-5" />
                <span className={`text-[11px] ${active ? "font-semibold" : "font-medium"}`}>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PocketHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h1 className="font-serif-display text-[27px] leading-tight text-white">{title}</h1>
      <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-400">{sub}</p>
    </div>
  );
}

export function Chips<T extends { id: string; label: string; sub: string }>({
  items, value, onChange,
}: { items: readonly T[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="space-y-1.5">
      {items.map((v) => (
        <button key={v.id} onClick={() => onChange(v.id)}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
            v.id === value ? "bg-signal/[0.12] ring-1 ring-signal/40" : "bg-white/[0.05] ring-1 ring-white/10 active:bg-white/[0.09]"
          }`}>
          <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ring-2 ${
            v.id === value ? "bg-signal ring-signal" : "ring-ink-600"
          }`}>
            {v.id === value && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[15px] font-semibold ${v.id === value ? "text-white" : "text-ink-300"}`}>{v.label}</span>
            <span className="block text-[12.5px] text-ink-500">{v.sub}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
