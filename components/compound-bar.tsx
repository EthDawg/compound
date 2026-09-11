"use client";

import Link from "./study-context-link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { companyStudy, companyHref } from "@/lib/companies";
import { useXRay } from "./xray-provider";
import { CompanyPicker } from "./company-picker";
import * as I from "./icons";

/** Company and view are independent route dimensions. The URL always wins. */
export function CompoundBar({ activeId, recentId }: { activeId: string; recentId?: string }) {
  const { on, toggle } = useXRay();
  const path = usePathname();
  const active = companyStudy(activeId);
  const ecosystem = path.startsWith("/atlas/");
  const backstage = path.includes("/backstage");
  useEffect(() => {
    if (active) {
      try { localStorage.setItem("compound-company", active.id); } catch { /* URL navigation works without storage. */ }
    }
  }, [active]);

  return (
    <div className="study-bar sticky top-0 z-50 border-b border-black/10 bg-white text-ink">
      <div className="flex min-h-14 flex-wrap items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Compound atlas">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-signal"><I.ILayers className="h-4 w-4" /></span>
          <span className="hidden text-[14px] font-semibold tracking-tight md:block">Compound</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2 border-l border-ink-200 pl-2 sm:pl-4">
          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-ink-500 sm:block">Company</span>
          <CompanyPicker activeId={activeId} recentId={recentId} />
        </div>
        {active && <nav aria-label="Company views" className="flex items-center gap-0.5 rounded-lg bg-ink-100 p-1 text-[12px] font-semibold">
          {(["app", "backstage"] as const).map((view) => <Link key={view} href={companyHref(active.id, view)}
            aria-current={!ecosystem && (view === "backstage") === backstage ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-md px-2 py-1.5 sm:px-3 ${!ecosystem && (view === "backstage") === backstage ? "bg-white text-ink shadow-sm" : "text-ink-500 hover:text-ink"}`}>
            {view === "app" ? "App" : "Backstage"}
          </Link>)}
          {active.ecosystem && <Link href={active.ecosystem.href} aria-current={ecosystem ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-md px-2 py-1.5 sm:px-3 ${ecosystem ? 'bg-white text-ink shadow-sm' : 'text-ink-500 hover:text-ink'}`}>Ecosystem</Link>}
        </nav>}
        <div className="ml-auto flex items-center gap-2">
          {!backstage && !ecosystem && <button onClick={toggle} aria-pressed={on} aria-label="Toggle X-ray" title="X-ray · press X"
            className={`hidden h-11 w-11 sm:grid place-items-center rounded-md ${on ? "bg-signal text-ink" : "text-ink-500 hover:bg-ink-100"}`}><I.IEye className="h-4 w-4" /></button>}
          <Link href="/" className="hidden text-[12px] font-medium text-ink-500 hover:text-ink sm:block">Atlas</Link>
          <Link href="/desk" className="hidden text-[12px] font-medium text-ink-500 hover:text-ink md:block">Desk</Link>
        </div>
      </div>
    </div>
  );
}
