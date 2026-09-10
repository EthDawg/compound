"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { COMPANIES, companyStudy, companyHref, switchCompanyHref, type CompanyId } from "@/lib/companies";
import { useXRay } from "./xray-provider";
import { Mark } from "./vendor/marks";
import * as I from "./icons";

/** Company and view are independent route dimensions. The URL always wins. */
export function CompoundBar({ activeId }: { activeId: string }) {
  const { on, toggle } = useXRay();
  const path = usePathname();
  const router = useRouter();
  const active = companyStudy(activeId);
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
          <label htmlFor="company-selector" className="sr-only text-[10px] font-bold uppercase tracking-wider text-ink-500 sm:not-sr-only">Company</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-2.5" style={{color: active?.skin.theme.ink}}><Mark id={activeId} className="h-3.5 w-3.5" /></span>
            <select id="company-selector" value={active?.id ?? ""}
              onChange={(e) => router.push(switchCompanyHref(e.target.value as CompanyId, path))}
              className="h-9 w-[112px] appearance-none sm:w-[126px] rounded-lg border border-ink-200 bg-ink-50 pl-8 pr-6 text-[13px] font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-sky">
              {!active && <option value="" disabled>Choose company</option>}
              {COMPANIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <I.IChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-ink-500" />
          </div>
        </div>
        {active && <nav aria-label="Company views" className="flex items-center gap-0.5 rounded-lg bg-ink-100 p-1 text-[12px] font-semibold">
          {(["app", "backstage"] as const).map((view) => <Link key={view} href={companyHref(active.id, view)}
            aria-current={(view === "backstage") === backstage ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 sm:px-3 ${(view === "backstage") === backstage ? "bg-white text-ink shadow-sm" : "text-ink-500 hover:text-ink"}`}>
            {view === "app" ? "App" : "Backstage"}
          </Link>)}
        </nav>}
        <div className="ml-auto flex items-center gap-2">
          {!backstage && <button onClick={toggle} aria-pressed={on} aria-label="Toggle X-ray" title="X-ray · press X"
            className={`hidden h-8 w-8 sm:grid place-items-center rounded-md ${on ? "bg-signal text-ink" : "text-ink-500 hover:bg-ink-100"}`}><I.IEye className="h-4 w-4" /></button>}
          <Link href="/" className="hidden text-[12px] font-medium text-ink-500 hover:text-ink sm:block">Atlas</Link>
          <Link href="/desk" className="hidden text-[12px] font-medium text-ink-500 hover:text-ink md:block">Desk</Link>
        </div>
      </div>
    </div>
  );
}
