"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { COMPANY_INDEX, COMPANY_SECTORS as SECTORS, atlasCompanyHref, companyDestination, recentCompanies, relatedCompanies, searchCompanies, type IndexedCompany } from "@/lib/company-index";
import { Mark } from "./vendor/marks";
import * as I from "./icons";

const RECENT_KEY = "compound-recent-companies";

export function CompanyPicker({ activeId, recentId, searchTrigger = false }: { activeId: string; recentId?: string; searchTrigger?: boolean }) {
  const path = usePathname();
  const uid = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(true);
  const [ecosystemsOnly, setEcosystemsOnly] = useState(false);
  const [sector, setSector] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const [opened, setOpened] = useState(false);
  const current = COMPANY_INDEX.find((c) => c.id === activeId);
  const searching = !!query.trim();
  const matches = useMemo(() => searchCompanies(query), [query]);
  const groups = useMemo(() => {
    if (searching) return [{ label: `${matches.length} ${matches.length === 1 ? "match" : "matches"}`, companies: matches.map((m) => m.company) }];
    const available = COMPANY_INDEX.filter((c) => (all || c.studyId) && (!ecosystemsOnly || c.ecosystemHref || c.ecosystemLinks.length) && (!sector || c.sector === sector));
    const recentList = recent.flatMap((id) => available.find((c) => c.id === id) ?? []);
    return [
      ...(!sector && recentList.length ? [{ label: "Recent", companies: recentList }] : []),
      ...SECTORS.map((s) => ({ label: s.name, companies: available.filter((c) => c.sector === s.id && (sector || !recentList.includes(c))) })).filter((g) => g.companies.length),
    ];
  }, [all, sector, searching, matches, recent, ecosystemsOnly]);
  const rows = groups.flatMap((g) => g.companies);
  const selected = rows[Math.min(cursor, Math.max(0, rows.length - 1))];
  const related = selected ? relatedCompanies(selected) : [];
  const matchedContext = searching ? matches.find((m) => m.company.id === selected?.id)?.context : undefined;
  const remember = (id:string) => {
    try {const next=recentCompanies(JSON.parse(localStorage.getItem(RECENT_KEY)??'[]'),id);localStorage.setItem(RECENT_KEY,JSON.stringify(next));setRecent(next);} catch { /* Navigation remains available without storage. */ }
  };
  const close = () => { dialog.current?.close(); setOpened(false); };
  const show = () => {
    setQuery(""); setSector(""); setEcosystemsOnly(false); setAll(true); setCursor(0);
    dialog.current?.showModal(); setOpened(true); input.current?.focus();
  };

  useEffect(() => {
    try {
      let saved: unknown;
      try { saved = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { saved = []; }
      const next = recentCompanies(saved, recentId ?? activeId);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch { /* Browsing and search do not require storage. */ }
  }, [activeId, recentId]);
  useEffect(() => { dialog.current?.close(); setOpened(false); }, [path]);
  useEffect(() => { setCursor(0); resultsRef.current?.scrollTo({ top: 0 }); }, [query, all, sector, ecosystemsOnly]);
  useEffect(() => {
    if (!opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [opened]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey)) {
        if (document.querySelector("dialog[open]") && !dialog.current?.open) return;
        event.preventDefault();
        if (dialog.current?.open) { dialog.current.close(); setOpened(false); }
        else { setQuery(""); setSector(""); setEcosystemsOnly(false); setAll(true); setCursor(0); dialog.current?.showModal(); setOpened(true); input.current?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const move = (next: number) => {
    const index = (next + rows.length) % rows.length;
    setCursor(index);
    document.getElementById(`${uid}-${rows[index].id}`)?.scrollIntoView({ block: "nearest" });
  };
  const key = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!rows.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); move(cursor + 1); }
    if (event.key === "ArrowUp") { event.preventDefault(); move(cursor - 1); }
    if (event.key === "Enter") {
      event.preventDefault();
      const anchor = document.getElementById(`${uid}-${selected.id}`) as HTMLAnchorElement | null;
      if (event.metaKey || event.ctrlKey) window.open(anchor?.href, "_blank", "noopener,noreferrer");
      else anchor?.click();
    }
  };
  const studyCount = COMPANY_INDEX.filter((c) => c.studyId).length;
  const mark = (company: IndexedCompany, large = false) => <span className={`grid shrink-0 place-items-center rounded-lg bg-ink-100 font-semibold text-ink ${large ? "h-11 w-11 text-lg" : "h-8 w-8 text-xs"}`}>
    {company.studyId ? <Mark id={company.id} className={large ? "h-6 w-6" : "h-4 w-4"} /> : company.name.slice(0, 2)}
  </span>;

  return <>
    <button type="button" onClick={show} aria-haspopup="dialog" aria-expanded={opened} aria-label={`Find a company. Current: ${current?.name ?? "none"}`} title="Find a company · ⌘K / Ctrl K"
      className={`flex h-10 items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3 text-[13px] hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky ${searchTrigger ? 'w-[min(340px,calc(100vw-155px))] font-normal text-ink-500' : 'w-[160px] font-semibold sm:w-[200px]'}`}>
      {!searchTrigger && <Mark id={activeId} className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{searchTrigger ? 'Company, product or person…' : current?.name ?? "Find a company"}</span>
      <I.ISearch className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-500" />
      {searchTrigger && <kbd className="hidden rounded border border-ink-200 px-1.5 text-[10px] sm:block">⌘ K</kbd>}
    </button>
    <dialog ref={dialog} aria-labelledby={`${uid}-title`} onClose={() => setOpened(false)} onCancel={() => setOpened(false)}
      onClick={(event) => { if (event.target === dialog.current) close(); }}
      className="company-picker m-auto w-[calc(100%-24px)] max-w-[800px] overflow-hidden rounded-2xl border border-ink-200 bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm">
      <div className="flex max-h-[88dvh] flex-col" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 id={`${uid}-title`} className="text-sm font-semibold">Find a company</h2>
          <button type="button" onClick={close} aria-label="Close company finder" className="rounded-md p-2 text-ink-500 hover:bg-ink-100"><I.IClose className="h-4 w-4" /></button>
        </div>
        <div className="mx-4 mb-3 flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-3 focus-within:border-ink-500 focus-within:ring-2 focus-within:ring-ink-100">
          <I.ISearch className="h-5 w-5 shrink-0 text-ink-500" />
          <input ref={input} value={query} onChange={(e) => { setQuery(e.target.value); setCursor(0); }} onKeyDown={key}
            role="combobox" aria-autocomplete="list" aria-expanded={opened} aria-controls={rows.length ? `${uid}-results` : undefined} aria-activedescendant={selected ? `${uid}-${selected.id}` : undefined}
            aria-label="Search companies, products, people, customers or capabilities" autoComplete="off" spellCheck={false}
            placeholder="Company, product, person, customer…" className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none" />
          {query && <button type="button" onClick={() => { setQuery(""); input.current?.focus(); }} aria-label="Clear search" className="rounded p-1 text-ink-500"><I.IClose className="h-4 w-4" /></button>}
        </div>
        {!searching && <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
          <div className="flex flex-wrap rounded-lg bg-ink-100 p-1 text-xs font-medium">
            <button type="button" aria-pressed={!all} onClick={() => { setAll(false); setEcosystemsOnly(false); setSector(""); }} className={`rounded-md px-3 py-1.5 ${!all ? "bg-white shadow-sm" : "text-ink-500"}`}>Interactive studies <span className="ml-1 text-ink-500">{studyCount}</span></button>
            <button type="button" aria-pressed={ecosystemsOnly} onClick={() => { setAll(true); setEcosystemsOnly(true); setSector(''); }} className={`rounded-md px-3 py-1.5 ${ecosystemsOnly ? 'bg-white shadow-sm' : 'text-ink-500'}`}>Ecosystems</button>
            <button type="button" aria-pressed={all && !ecosystemsOnly} onClick={() => { setAll(true); setEcosystemsOnly(false); }} className={`rounded-md px-3 py-1.5 ${all && !ecosystemsOnly ? "bg-white shadow-sm" : "text-ink-500"}`}>All companies <span className="ml-1 text-ink-500">{COMPANY_INDEX.length}</span></button>
          </div>
          {all && !ecosystemsOnly && <select aria-label="Browse by sector" value={sector} onChange={(e) => setSector(e.target.value)} className="min-w-0 max-w-full rounded-lg border border-ink-200 bg-white p-2 text-xs">
            <option value="">All sectors</option>{SECTORS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>}
        </div>}
        {searching && <p className="px-5 pb-3 text-xs text-ink-500" role="status">{matches.length} {matches.length === 1 ? "match" : "matches"} across {COMPANY_INDEX.length} companies · studies, Atlas entries and ecosystem profiles</p>}
        <div className="grid min-h-0 flex-1 grid-cols-1 border-t border-ink-200 sm:grid-cols-[1.15fr_1fr]">
          <div ref={resultsRef} className="thin-scroll max-h-[31vh] min-h-0 overflow-y-auto overscroll-contain p-2 sm:h-[400px] sm:max-h-[52dvh]">
            {rows.length ? <div id={`${uid}-results`} role="listbox" aria-label="Companies">
              {groups.map((group) => <div key={group.label} role="group" aria-label={group.label}>
                <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-ink-500">{group.label}</div>
                {group.companies.map((company) => {
                  const index = rows.indexOf(company);
                  const reason = searching ? matches.find((m) => m.company.id === company.id)?.reason : "";
                  return <div key={company.id} className="flex items-stretch"><a id={`${uid}-${company.id}`} href={(searching && matches.find((m) => m.company.id === company.id)?.context?.href) || companyDestination(company, path)} role="option" tabIndex={-1} aria-selected={selected?.id === company.id}
                    onMouseEnter={() => setCursor(index)} onFocus={() => setCursor(index)} onClick={()=>remember(company.id)}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 outline-offset-[-2px] ${selected?.id === company.id ? "bg-ink-100" : "hover:bg-ink-50"}`}>
                    {mark(company)}<span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold">{company.name}</span>
                      <span className="block truncate text-[11px] text-ink-500">{reason && reason !== company.categoryName ? `${reason} · ` : ""}{company.categoryName}</span>
                      <span className={`block text-[10px] ${company.studyId ? "font-medium text-ink-700" : "text-ink-500"}`}>{company.availability}</span>
                    </span><I.IChevron className="h-3 w-3 shrink-0 text-ink-400" />
                  </a><button type="button" onClick={()=>setCursor(index)} aria-label={`Preview ${company.name}`} className="ml-1 rounded-lg px-2 text-[10px] font-semibold text-ink-500 hover:bg-ink-100 sm:hidden">Preview</button></div>;
                })}
              </div>)}
            </div> : <div className="px-3 py-8 text-sm">
              <p className="font-semibold">Not in this catalogue yet.</p>
              <p className="mt-2 text-ink-500">Try a product name or a capability, like “Claude”, “payroll” or “voice”.</p>
              <button type="button" onClick={() => { setQuery(""); setAll(true); setSector(""); input.current?.focus(); }} className="mt-4 font-semibold underline underline-offset-4">Browse all companies</button>
            </div>}
          </div>
          {selected && <aside onClick={(e)=>{if((e.target as HTMLElement).closest('a'))remember(selected.id);}} aria-label="Company preview" className="thin-scroll min-h-0 overflow-y-auto overscroll-contain border-t border-ink-200 bg-ink-50 p-4 sm:border-l sm:border-t-0 sm:p-5">
            <div className="flex items-center gap-3">{mark(selected, true)}<div><p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{selected.sectorName}</p><h3 className="text-lg font-semibold tracking-tight">{selected.name}</h3></div></div>
            <p className="mt-3 text-xs text-ink-500">{selected.categoryName}{selected.geo ? ` · ${selected.geo}` : ""}</p>
            <p className="mt-2 text-[13px] leading-relaxed">{selected.blurb}</p>
            {matchedContext && <a href={matchedContext.href} className="mt-3 block rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs"><span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">{matchedContext.kind}</span><strong className="mt-1 block text-sm">{matchedContext.term} →</strong><span className="mt-1 block text-ink-500">{matchedContext.detail}</span></a>}
            {!selected.studyId && !selected.ecosystemLinks.length && <p className="mt-3 rounded-lg border border-ink-200 bg-white p-3 text-xs leading-relaxed text-ink-500">{selected.atlasListed?'In the company landscape.':'Recognised in the global research.'} {selected.appHref || selected.readHref ? "A focused study is available below; the full App + Backstage pair hasn’t been added yet." : "The App + Backstage study hasn’t been added yet."}</p>}
            {!!selected.ecosystemLinks.length && <div className="mt-4 space-y-2"><p className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Choose the practice context</p>{selected.ecosystemLinks.map((link) => <a key={link.href} href={link.href} className="block rounded-lg border border-ink-200 bg-white p-3 text-xs hover:bg-ink-100"><span className="font-semibold">{link.ecosystemName} · ANZ ↗</span><span className="mt-1 block text-[11px] text-ink-500">{link.historical ? 'Career / ownership context' : link.context}</span></a>)}</div>}
            {!!selected.marketLinks?.length && <div className="mt-4 space-y-2"><p className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Global context</p>{selected.marketLinks.map(link=><a key={link.href} href={link.href} className="block rounded-lg border border-ink-200 bg-white p-3 text-xs font-semibold">{link.label} →</a>)}</div>}
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              {selected.appHref && <a href={selected.appHref} className="rounded-lg bg-ink px-3 py-2 text-white hover:bg-ink-700">Open App</a>}
              {selected.backstageHref && <a href={selected.backstageHref} className="rounded-lg border border-ink-200 bg-white px-3 py-2 hover:bg-ink-100">Backstage</a>}
              {selected.readHref && <a href={selected.readHref} className="rounded-lg border border-ink-200 bg-white px-3 py-2 hover:bg-ink-100">Read study</a>}
              {selected.ecosystemHref && <a href={selected.ecosystemHref} className="rounded-lg border border-ink-200 bg-white px-3 py-2 hover:bg-ink-100">ANZ ecosystem</a>}
              {selected.atlasListed && <a href={atlasCompanyHref(selected.id)} className="rounded-lg border border-ink-200 bg-white px-3 py-2 hover:bg-ink-100">Locate in Atlas</a>}
            </div>
            {!!related.length && <div className="mt-5 hidden border-t border-ink-200 pt-3 sm:block"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-500">Explore alongside</p>
              {related.map(({company:c,reason}) => <a key={c.id} onClick={e=>{e.stopPropagation();remember(c.id);}} href={companyDestination(c, path)} className="block rounded py-1.5 text-xs hover:underline"><span className="font-semibold">{c.name}</span><span className="mt-1 block text-[10px] text-ink-500">{reason}</span></a>)}
            </div>}
          </aside>}
        </div>
        <div className="flex flex-wrap justify-between gap-1 border-t border-ink-200 px-5 py-2.5 text-[10px] text-ink-500"><span>↑ ↓ preview · Enter open · Esc close</span><span>⌘ / Ctrl-click to open another tab</span></div>
      </div>
    </dialog>
  </>;
}
