"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_VENDORS, CATEGORY_NODES, SECTOR_NODES, type Node as AtlasNode } from "@/lib/data/atlas-nodes";
import { ARCHETYPE_COLOR, SECTOR_COLOR, PAPER } from "@/lib/data/palette";
import { sectorById, categoryById } from "@/lib/data/atlas";
import * as I from "./icons";

const POOL: AtlasNode[] = [...SECTOR_NODES, ...CATEGORY_NODES, ...ALL_VENDORS];

const score = (n: AtlasNode, q: string) => {
  const name = n.name.toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(q)) return 2;
  if (n.blurb.toLowerCase().includes(q)) return 4;
  if (n.archetype?.toLowerCase().includes(q)) return 5;
  return 99;
};

export function AtlasSearch({ onPick }: { onPick: (n: AtlasNode) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return POOL.map((n) => ({ n, s: score(n, s) }))
      .filter((r) => r.s < 99)
      .sort((a, b) => a.s - b.s || (a.n.level === "vendor" ? 1 : 0) - (b.n.level === "vendor" ? 1 : 0))
      .slice(0, 9)
      .map((r) => r.n);
  }, [q]);

  useEffect(() => setCursor(0), [q]);

  // "/" focuses search from anywhere on the page.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if (e.key === "/" && !typing) { e.preventDefault(); input.current?.focus(); setOpen(true); }
      if (e.key === "Escape" && typing) { input.current?.blur(); setOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as globalThis.Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pick = (n: AtlasNode) => { onPick(n); setQ(""); setOpen(false); input.current?.blur(); };

  const key = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => (c + 1) % results.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => (c - 1 + results.length) % results.length); }
    if (e.key === "Enter") { e.preventDefault(); pick(results[cursor]); }
  };

  const tint = (n: AtlasNode) =>
    n.level === "sector" ? SECTOR_COLOR[n.id] ?? PAPER.faint
    : n.archetype ? ARCHETYPE_COLOR[n.archetype] : SECTOR_COLOR[n.sector] ?? PAPER.faint;

  const where = (n: AtlasNode) =>
    n.level === "sector" ? "Sector"
    : n.level === "category" ? sectorById(n.sector)?.name ?? ""
    : `${categoryById(n.category ?? "")?.name ?? ""} · ${sectorById(n.sector)?.name ?? ""}`;

  return (
    <div className="relative w-full sm:w-[19rem]" ref={ref}>
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: PAPER.ghost }}>
        <I.ISearch className="h-3.5 w-3.5" />
      </span>
      <input
        ref={input} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} onKeyDown={key}
        placeholder="Search 118 vendors…"
        aria-label="Search the atlas"
        className="h-9 w-full rounded-lg border pl-8 pr-8 text-[13px] outline-none transition focus:ring-2"
        style={{ borderColor: PAPER.line, background: PAPER.surface, color: PAPER.ink }}
      />
      {!q && (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded px-1 font-mono text-[10.5px]"
          style={{ background: PAPER.grid, color: PAPER.ghost }}>/</kbd>
      )}
      {q && (
        <button onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search"
          className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded"
          style={{ color: PAPER.faint }}>
          <I.IClose className="h-3 w-3" />
        </button>
      )}

      {open && q && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border shadow-pop"
          style={{ borderColor: PAPER.line, background: PAPER.surface }}>
          {results.length === 0 ? (
            <p className="px-4 py-3 text-[13px]" style={{ color: PAPER.faint }}>
              Nothing matches. Try an archetype — &ldquo;connective&rdquo;, &ldquo;compound&rdquo;, &ldquo;rail&rdquo;.
            </p>
          ) : (
            <ul role="listbox" className="max-h-[19rem] overflow-y-auto thin-scroll py-1">
              {results.map((n, i) => (
                <li key={`${n.level}-${n.id}`}>
                  <button role="option" aria-selected={i === cursor}
                    onMouseEnter={() => setCursor(i)} onClick={() => pick(n)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left"
                    style={{ background: i === cursor ? PAPER.grid : "transparent" }}>
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tint(n) }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px]" style={{ color: PAPER.ink }}>{n.name}</span>
                      <span className="block truncate text-[11.5px]" style={{ color: PAPER.faint }}>{where(n)}</span>
                    </span>
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ background: PAPER.grid, color: PAPER.faint }}>{n.level}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
