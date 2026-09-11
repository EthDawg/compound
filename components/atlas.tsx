"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LENSES, type LensId, type Archetype } from "@/lib/data/ecosystem";
import { SECTORS, sectorById, categoryById } from "@/lib/data/atlas";
import { ALL_VENDORS, nodesAt, BOARD_STATS, type Node as AtlasNode, type Level } from "@/lib/data/atlas-nodes";
import { ARCHETYPE_COLOR, SECTOR_COLOR, PAPER } from "@/lib/data/palette";
import { GuideHeader } from "./guide-header";
import { AtlasMaps } from "./atlas-maps";
import { SiEvidence } from "./si-evidence";
import { useNarrow } from "./use-narrow";
import * as I from "./icons";
import { companyStudy, companyHref } from "@/lib/companies";
import { researchCompany, researchCategory, categoryHref } from '@/lib/data/category-research';
import { ResearchLandscape } from './research-landscape';

import {readAtlasLocation,atlasLocationHref,transitionAtlas,atlasLevel,type AtlasAction} from '@/lib/atlas-navigation';

const G = {
  wide:   { W: 1040, H: 620, PAD: 78, fq: 11, fax: 11, flab: 11.5, flabOn: 13, rMin: 5, rMax: 20, cap: 18, floor: 42 },
  narrow: { W: 540,  H: 660, PAD: 46, fq: 15, fax: 15, flab: 15,   flabOn: 17, rMin: 6, rMax: 24, cap: 9,  floor: 62 },
} as const;

const tint = (n: AtlasNode) =>
  n.level === "sector" ? SECTOR_COLOR[n.id] ?? PAPER.faint
  : n.archetype ? ARCHETYPE_COLOR[n.archetype] : SECTOR_COLOR[n.sector] ?? PAPER.faint;

export function Atlas() {
  const narrow = useNarrow();
  const g = narrow ? G.narrow : G.wide;
  const { W, H, PAD } = g;
  const px = (x: number) => PAD + (x / 100) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 100) * (H - PAD * 2);
  const rr = (r: number) => g.rMin + (r / 100) * g.rMax;

  const query = useSearchParams().toString();
  const location = useMemo(() => readAtlasLocation(query), [query]);
  const level=atlasLevel(location),lensId=location.lens,sel=location.company??null,muted=location.highlight??null;
  const focus=useMemo(()=>({sector:location.sector,category:location.category}),[location.sector,location.category]);
  const categoryGuide = focus.category ? researchCategory(focus.category) : undefined;
  const [hover,setHover]=useState<string|null>(null);
  const [tip, setTip] = useState<{ n: AtlasNode; x: number; y: number } | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const selectionOrigin = useRef<HTMLElement | SVGElement | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const lens = LENSES.find((l) => l.id === lensId)!;
  const nodes = useMemo(() => nodesAt(level, focus), [level, focus]);
  const ordered = useMemo(() => [...nodes].sort((a, b) => b.lens[lensId].r - a.lens[lensId].r), [nodes, lensId]);
  const selected = nodes.find((n) => n.id === sel) ?? null;

  // What the colours mean right now, and only what is on screen.
  const legend = useMemo(() => {
    if (level === "sector") return SECTORS.map((s) => ({ key: s.id, label: s.name, color: SECTOR_COLOR[s.id] }));
    const seen = new Map<string, string>();
    nodes.forEach((n) => { if (n.archetype) seen.set(n.archetype, ARCHETYPE_COLOR[n.archetype as Archetype]); });
    return [...seen.entries()].map(([label, color]) => ({ key: label, label, color }));
  }, [level, nodes]);

  const clearHover = useCallback(() => { setHover(null); setTip(null); }, []);

  const navigate=useCallback((action:AtlasAction)=>{
    const before=readAtlasLocation(window.location.search);
    const next=transitionAtlas(before,action),href=atlasLocationHref(next);
    if(href!==atlasLocationHref(before))window.history.pushState(null,'',href);
    setHover(null);setTip(null);
  },[]);
  const goRoot=useCallback(()=>navigate({type:'root'}),[navigate]);
  const goSector=useCallback(()=>navigate({type:'sector'}),[navigate]);
  const up=useCallback(()=>navigate({type:'up'}),[navigate]);
  const clearSelection=useCallback(()=>{
    const company = readAtlasLocation(window.location.search).company;
    const origin = selectionOrigin.current?.isConnected ? selectionOrigin.current : company ? document.querySelector<HTMLElement | SVGElement>(`[data-atlas-company="${CSS.escape(company)}"]`) : null;
    navigate({type:'clear-company'});
    requestAnimationFrame(()=>{ if(origin?.isConnected) origin.focus(); });
  },[navigate]);
  const open=useCallback((n:AtlasNode)=>navigate({type:'open',node:n}),[navigate]);
  const nodeHref=(n:AtlasNode)=>atlasLocationHref(transitionAtlas({...location,company:undefined},{type:'open',node:n}));
  const followNode=(e:React.MouseEvent,n:AtlasNode)=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(n.level === 'vendor') selectionOrigin.current = e.currentTarget as HTMLElement | SVGElement;
    e.preventDefault();e.stopPropagation();open(n);
  };

  // Esc clears the selection, then walks back up a level.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.defaultPrevented || document.querySelector("dialog[open], details[open]")) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "Escape") { clearHover(); if (sel) clearSelection(); else up(); }
      if (e.key === "Backspace") { e.preventDefault(); up(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sel, up, clearHover, clearSelection]);

  // On a phone the detail sits below the fold, so bring it into view on select.
  useEffect(() => {
    if (sel && narrow) detailRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }, [sel, narrow]);

  useEffect(() => {
    clearHover();
  }, [level, focus, lensId, muted, narrow, clearHover]);
  useEffect(() => {
    window.addEventListener("scroll", clearHover, true);
    window.addEventListener("resize", clearHover);
    window.addEventListener("blur", clearHover);
    return () => {
      window.removeEventListener("scroll", clearHover, true);
      window.removeEventListener("resize", clearHover);
      window.removeEventListener("blur", clearHover);
    };
  }, [clearHover]);
  const active = nodes.some((n) => n.id === hover) ? hover : sel;
  const dimmed = (n: AtlasNode) =>
    (muted && (n.level === "sector" ? n.id : n.archetype) !== muted) ||
    (!!active && active !== n.id);

  const crumbs = [
    { label: "All sectors", on: level === "sector", go: goRoot },
    ...(focus.sector ? [{ label: sectorById(focus.sector)?.name ?? "", on: level === "category", go: goSector }] : []),
    ...(focus.category ? [{ label: categoryById(focus.category)?.name ?? "", on: level === "vendor", go: () => {} }] : []),
  ];

  const tipFor = (n: AtlasNode, e: React.MouseEvent) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.max(8, Math.min(e.clientX - r.left + 16, r.width - 264));
    const y = Math.max(8, Math.min(e.clientY - r.top + 16, r.height - 190));
    setTip({ n, x, y });
  };

  return (
    <div className="min-h-screen" style={{ background: PAPER.bg, color: PAPER.ink }}>
      <GuideHeader activeId={sel ?? ''} />

      <main className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <AtlasMaps />
        {/* Controls */}
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[13.5px]">
            {level !== "sector" && (
              <button onClick={up} aria-label="Back a level"
                className="mr-0.5 grid h-11 w-11 place-items-center rounded-md transition hover:bg-black/[0.06]"
                style={{ color: PAPER.muted }}>
                <I.IChevron className="h-3.5 w-3.5 rotate-180" />
              </button>
            )}
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: PAPER.ghost }}>/</span>}
                <button onClick={c.go} disabled={c.on}
                  className={`min-h-11 rounded px-1.5 py-0.5 transition ${c.on ? "font-semibold" : "hover:bg-black/[0.06]"}`}
                  style={{ color: c.on ? PAPER.ink : PAPER.muted }}>
                  {c.label}
                </button>
              </span>
            ))}
            <span className="ml-1 tabular-nums text-[12px]" style={{ color: PAPER.ghost }}>{nodes.length}</span>
          </div>

          {!categoryGuide && <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:ml-auto">
            <div className="flex gap-0.5 rounded-lg p-0.5" style={{ background: PAPER.grid }}>
              {LENSES.map((l) => (
                <button key={l.id} onClick={() => navigate({type:'lens',id:l.id})}
                  aria-label={l.pill} aria-pressed={l.id === lensId}
                  className="min-h-11 flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[12.5px] font-medium transition sm:flex-none sm:px-2.5"
                  style={l.id === lensId
                    ? { background: PAPER.surface, color: PAPER.ink, boxShadow: "0 1px 2px rgba(0,0,0,.07)" }
                    : { color: PAPER.muted }}>
                  {/* Full names do not fit four-across on a phone; the first word is unambiguous. */}
                  <span className="sm:hidden">{l.pill.split(" ")[0]}</span>
                  <span className="hidden sm:inline">{l.pill}</span>
                </button>
              ))}
            </div>
          </div>}
        </div>

        {!categoryGuide && <p className="max-w-3xl pb-4 text-[14px] leading-[1.6]" style={{ color: PAPER.muted }}>
          <span className="font-semibold" style={{ color: PAPER.ink }}>{lens.question}</span> {lens.blurb}
        </p>}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {categoryGuide ? <ResearchLandscape category={categoryGuide} nodes={nodes} selected={sel} href={nodeHref} follow={followNode} /> : <>
          {/* Plot */}
          <div className="relative min-w-0 overflow-hidden rounded-xl border" style={{ borderColor: PAPER.line, background: PAPER.surface }}>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full touch-manipulation"
              role="group" aria-label={`Atlas — ${lens.pill}, ${level} level`}
              onMouseLeave={clearHover}
              onClick={(e) => { if (e.target === e.currentTarget) { clearSelection(); clearHover(); } }}>
              <defs>
                <pattern id="atlasgrid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M26 0H0V26" fill="none" stroke={PAPER.grid} strokeWidth="1" />
                </pattern>
              </defs>
              <rect x={0} y={0} width={W} height={H} fill="transparent" onClick={() => { clearSelection(); clearHover(); }} />
              <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="url(#atlasgrid)" pointerEvents="none" />
              <g pointerEvents="none">
                <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#E0DDD4" strokeDasharray="2 4" />
                <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="#E0DDD4" strokeDasharray="2 4" />
                <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="none" stroke="#DDD9CE" />
                {lens.quadrants.map((q) => {
                  const p = { tl: [PAD + 8, PAD + 16], tr: [W - PAD - 8, PAD + 16], bl: [PAD + 8, H - PAD - 10], br: [W - PAD - 8, H - PAD - 10] }[q.at];
                  return (
                    <text key={q.at} x={p[0]} y={p[1] - (narrow && q.at.startsWith('b') ? (q.label.split(' ').length - 1) * g.fq * 1.1 : 0)} textAnchor={q.at.endsWith("l") ? "start" : "end"}
                      fill={PAPER.ghost} fontSize={g.fq} fontWeight="600" letterSpacing="0.06em">
                      {narrow ? q.label.toUpperCase().split(' ').map((word, i) => <tspan key={i} x={p[0]} dy={i ? '1.1em' : 0}>{word}</tspan>) : q.label.toUpperCase()}
                    </text>
                  );
                })}
                <text x={W / 2} y={H - 20} textAnchor="middle" fill={PAPER.faint} fontSize={g.fax} fontWeight="600">{lens.x.label}</text>
                <text x={PAD} y={H - 40} textAnchor="start" fill={PAPER.ghost} fontSize={g.fax}>← {lens.x.low}</text>
                <text x={W - PAD} y={H - 40} textAnchor="end" fill={PAPER.ghost} fontSize={g.fax}>{lens.x.high} →</text>
                <text x={18} y={H / 2} textAnchor="middle" fill={PAPER.faint} fontSize={g.fax} fontWeight="600"
                  transform={`rotate(-90 18 ${H / 2})`}>{lens.y.label}</text>
              </g>

              {ordered.map((n) => {
                const p = n.lens[lensId];
                const on = active === n.id;
                const isSel = sel === n.id;
                const dim = dimmed(n);
                const c = tint(n);
                const showLabel = on || isSel || nodes.length <= g.cap || p.r >= g.floor;
                const group = n.level !== "vendor";
                return (
                  <g key={n.id} transform={`translate(${px(p.x)} ${py(p.y)})`} opacity={dim ? 0.26 : 1}
                    style={{ transition: "transform .5s cubic-bezier(.2,.7,.3,1), opacity .2s" }}><a href={nodeHref(n)}
                    tabIndex={0} role="link" data-atlas-company={n.level === 'vendor' ? n.id : undefined}
                    aria-label={`${n.name}${n.archetype ? `, ${n.archetype}` : ""}. ${group ? `Open ${n.count} inside` : isSel ? "Selected" : "Select"}`}
                    style={{ cursor: group ? "zoom-in" : "pointer", outline: "none" }}
                    onMouseEnter={(e) => { setHover(n.id); tipFor(n, e); }}
                    onMouseMove={(e) => tipFor(n, e)}
                    onMouseLeave={() => { setHover(null); setTip(null); }}
                    onFocus={() => setHover(n.id)}
                    onBlur={() => setHover(null)}
                    onClick={(e) => followNode(e,n)}>
                    {isSel && <circle r={rr(p.r) + 7} fill="none" stroke={c} strokeWidth="1.5" strokeOpacity=".45" />}
                    <circle r={rr(p.r)} fill={c} fillOpacity={on || isSel ? 0.88 : 0.58}
                      stroke={isSel ? PAPER.ink : c} strokeWidth={isSel ? 2 : on ? 1.6 : 1}
                      strokeDasharray={n.level === "vendor" && !n.handRead ? "3 2.5" : undefined}
                      style={{ transition: "r .5s cubic-bezier(.2,.7,.3,1), fill-opacity .18s" }} />
                    {n.instance && <circle r={rr(p.r) + 3.5} fill="none" stroke={c} strokeOpacity=".5" strokeWidth="1" />}
                    {showLabel && (
                      <text y={rr(p.r) + 12} textAnchor="middle" fill={on || isSel ? PAPER.ink : PAPER.muted}
                        fontSize={on || isSel ? g.flabOn : g.flab} fontWeight={on || isSel ? 700 : 500}
                        pointerEvents="none">
                        {n.name}
                      </text>
                    )}
                  </a></g>
                );
              })}
            </svg>

            {/* Hover card — read without committing to a click */}
            {tip && !narrow && nodes.some((n) => n.id === tip.n.id) && (
              <div role="tooltip" className="pointer-events-none absolute z-20 w-[16rem] rounded-lg border p-3 shadow-pop"
                style={{
                  borderColor: PAPER.line, background: PAPER.surface,
                  left: tip.x, top: tip.y, maxWidth: "calc(100% - 16px)",
                }}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tint(tip.n) }} />
                  <span className="text-[13.5px] font-semibold">{tip.n.name}</span>
                </div>
                <p className="mt-1 text-[11.5px] uppercase tracking-wide" style={{ color: PAPER.ghost }}>
                  {tip.n.level === "vendor" ? tip.n.archetype : `${tip.n.count} inside`}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-[1.55]" style={{ color: PAPER.muted }}>
                  {tip.n.blurb.length > 128 ? tip.n.blurb.slice(0, 128) + "…" : tip.n.blurb}
                </p>
                <p className="mt-2 text-[11px] font-medium" style={{ color: PAPER.highlight }}>
                  {tip.n.level === "vendor" ? "Select the dot for details" : "Select the dot to open"}
                </p>
              </div>
            )}

            {narrow && (
              <div className="border-t" style={{ borderColor: PAPER.line }}>
                <ul className="max-h-[17rem] overflow-y-auto thin-scroll p-1.5">
                  {ordered.map((n, i) => (
                    <li key={n.id}>
                      <a href={nodeHref(n)} onClick={(e)=>followNode(e,n)} data-atlas-company={n.level === 'vendor' ? n.id : undefined}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left"
                        style={sel === n.id ? { background: PAPER.grid } : undefined}>
                        <span className="w-5 shrink-0 text-right text-[11px] tabular-nums" style={{ color: PAPER.ghost }}>{i + 1}</span>
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tint(n) }} />
                        <span className="min-w-0 flex-1 truncate text-[13.5px]">{n.name}</span>
                        {n.count !== undefined && <span className="shrink-0 text-[11.5px] tabular-nums" style={{ color: PAPER.ghost }}>{n.count}</span>}
                        {n.level !== "vendor" && <span style={{ color: PAPER.ghost }}><I.IChevron className="h-3 w-3" /></span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legend — always matches what colour currently means, and filters */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t px-4 py-2.5 text-[11px]"
              style={{ borderColor: PAPER.line, color: PAPER.faint }}>
              <span className="font-semibold uppercase tracking-wider" style={{ color: PAPER.ghost }}>
                {level === "sector" ? "Sector" : "Archetype"}
              </span>
              {legend.map((l) => (
                <button key={l.key}
                  onClick={() => navigate({type:'highlight',id:l.key})}
                  aria-pressed={muted === l.key}
                  className="flex min-h-11 items-center gap-1.5 rounded px-1 py-0.5 transition hover:bg-black/[0.05]"
                  style={{ opacity: muted && muted !== l.key ? 0.4 : 1, fontWeight: muted === l.key ? 600 : 400, color: muted === l.key ? PAPER.ink : undefined }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />{l.label}
                </button>
              ))}
              {muted && (
                <button onClick={() => navigate({type:'highlight'})} className="rounded px-1.5 py-0.5 font-medium" style={{ color: PAPER.ink, background: PAPER.grid }}>
                  clear filter
                </button>
              )}
            </div>

            {level === "vendor" && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t px-4 py-2 text-[10.5px]"
                style={{ borderColor: PAPER.lineSoft, color: PAPER.ghost }}>
                <span>solid = read individually</span>
                <span>dashed = placed by archetype</span>
                <span>ringed = playable study</span>
                <span className="ml-auto hidden sm:block">Esc clears · Backspace goes up · / searches</span>
              </div>
            )}
          </div>
          </>}

          {/* Detail */}
          <div className="min-w-0" ref={detailRef}>
            {selected ? <Detail n={selected} category={categoryGuide?.id} onClose={clearSelection} />
              : <Intro level={level} focus={focus} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border p-5" style={{ borderColor: PAPER.line, background: PAPER.surface }}>{children}</div>;
}

function Intro({ level, focus }: { level: Level; focus: { sector?: string; category?: string } }) {
  const s = focus.sector ? sectorById(focus.sector) : null;
  const c = focus.category ? categoryById(focus.category) : null;
  return (
    <Shell>
      {level === "sector" && (
        <>
          <h2 className="font-serif-display text-[22px] leading-tight">Relevant to whom?</h2>
          <p className="mt-2.5 text-[14px] leading-[1.65]" style={{ color: PAPER.muted }}>
            Every map of software picks one definition of relevance and hides it. This one refuses to pick — the same
            board, drawn four times, under four incompatible definitions of what makes something matter.
          </p>
          <p className="mt-3 text-[14px] leading-[1.65]" style={{ color: PAPER.muted }}>
            Click a sector to open its categories, then a category for its vendors. The organising claim is that the
            same archetypes recur everywhere: legal has its compound platform and its connective layer just as
            employment does.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-[11.5px]" style={{ borderColor: PAPER.lineSoft, color: PAPER.faint }}>
            <span><kbd className="rounded px-1 font-mono" style={{ background: PAPER.grid }}>/</kbd> search</span>
            <span><kbd className="rounded px-1 font-mono" style={{ background: PAPER.grid }}>Esc</kbd> clear</span>
            <span><kbd className="rounded px-1 font-mono" style={{ background: PAPER.grid }}>Tab</kbd> step through nodes</span>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: PAPER.faint }}>
            Positions are editorial judgements, not measurements. {BOARD_STATS.handRead} vendors were read
            individually; the rest are placed by archetype and drawn dashed.
          </p>
        </>
      )}
      {level === "category" && s && (
        <>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: SECTOR_COLOR[s.id] }} />
            <h2 className="text-[18px] font-semibold tracking-tight">{s.name}</h2>
          </div>
          <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: PAPER.muted }}>{s.blurb}</p>
          <div className="mt-3.5 border-t pt-3.5" style={{ borderColor: PAPER.lineSoft }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: PAPER.ghost }}>What this sector is a fight about</div>
            <p className="mt-1.5 text-[14px] leading-[1.62]">{s.thesis}</p>
          </div>
        </>
      )}
      {level === "vendor" && c && (
        <>
          <h2 className="text-[18px] font-semibold tracking-tight">{c.name}</h2>
          <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: PAPER.muted }}>{c.blurb}</p>
          {researchCategory(c.id)&&<Link href={categoryHref(researchCategory(c.id)!.id)} className="mt-4 flex min-h-11 items-center justify-center rounded-lg border px-3 text-xs font-semibold" style={{borderColor:PAPER.line}}>Understand this category →</Link>}
          {!researchCategory(c.id) && <div className="mt-3.5 border-t pt-3.5" style={{ borderColor: PAPER.lineSoft }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: PAPER.ghost }}>Dominant shape</div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: ARCHETYPE_COLOR[c.shape] }} />
              <span className="text-[14px]">{c.shape}</span>
            </div>
            <p className="mt-2.5 text-[13px] leading-[1.6]" style={{ color: PAPER.faint }}>
              Pick a vendor to read its bet. Colour is the archetype; the outliers are usually the interesting ones.
            </p>
          </div>}
        </>
      )}
    </Shell>
  );
}

function Detail({ n, category, onClose }: { n: AtlasNode; category?: import('@/lib/data/category-research').ResearchCategoryId; onClose: () => void }) {
  const s = sectorById(n.sector);
  const research = researchCompany(n.id);
  const role = research && researchCategory(research.categories[0])?.groups.find(g => g.id === research.group)?.name;
  return (
    <div className="rounded-xl border" style={{ borderColor: PAPER.line, background: PAPER.surface }}>
      <div className="border-b p-5" style={{ borderColor: PAPER.lineSoft }}>
        <div className="flex items-start gap-2.5">
          <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: research?.accent ?? tint(n) }} />
          <h2 className="min-w-0 flex-1 text-[19px] font-semibold tracking-tight">{n.name}</h2>
          <button onClick={onClose} aria-label="Clear selection"
            className="-mr-1 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-md transition hover:bg-black/[0.06]"
            style={{ color: PAPER.faint }}>
            <I.IClose className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1 text-[11.5px] uppercase tracking-wide" style={{ color: research ? PAPER.muted : PAPER.ghost }}>
          {research ? `${role} · ${research.product}` : `${n.archetype}${n.geo ? ` · ${n.geo}` : ''} · ${s?.name}`}
        </p>
        <p className="mt-2.5 text-[14px] leading-[1.62]">{research?.thesis ?? n.blurb}</p>
        <SiEvidence id={n.id} />
      </div>

      <div className="flex flex-wrap gap-2 border-b px-5 py-3" style={{ borderColor: PAPER.lineSoft }}>
        {!research && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ background: n.handRead ? "#E8F3EC" : PAPER.grid, color: n.handRead ? "#2F6B47" : PAPER.faint }}>
          {n.handRead ? "Read individually" : "Placed by archetype"}
        </span>}
        {n.deep && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#FBF1D2", color: "#8A6A00" }}>Deep read</span>}
        {researchCompany(n.id)&&<span className="rounded-full bg-[#EEF2E9] px-2 py-0.5 text-[11px] font-medium text-[#486351]">Research brief</span>}
        {n.instance && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#EDE7FB", color: "#5A3FB0" }}>Playable study</span>}
      </div>

      {research && <div className="space-y-5 border-b p-5" style={{borderColor:PAPER.lineSoft}}>
        <div><h3 className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Three reasons it matters</h3><ol className="mt-3 space-y-3">{research.strengths.map((strength,i)=><li key={strength} className="flex gap-3 text-xs leading-relaxed"><span className="font-mono text-ink-400">0{i+1}</span>{strength}</li>)}</ol></div>
        <div><p className="text-[10px] font-semibold text-ink-500">{research.movement.date}</p><h3 className="mt-1 text-sm font-semibold">{research.movement.title}</h3><p className="mt-2 text-xs leading-relaxed text-ink-500">{research.movement.text}</p><a href={research.movement.sources[0].url} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center text-[11px] underline underline-offset-4">{research.movement.sources[0].title} ↗</a></div>
        <div className="flex flex-wrap gap-2">{research.categories.map(id=><Link key={id} href={`/?company=${n.id}&category=${id}`} className="inline-flex min-h-11 items-center rounded-lg border border-ink-200 px-3 text-[11px]">{researchCategory(id)?.shortName} →</Link>)}</div>
      </div>}

      <div className="space-y-2 p-5">
        {n.instance && (
          <Link href={n.instance}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-[13.5px] font-bold transition"
            style={{ background: PAPER.ink, color: PAPER.highlight }}>
            Open {n.name} App <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        )}
        {companyStudy(n.id) && (
          <Link href={companyHref(n.id, "backstage")} className="flex h-10 items-center justify-center gap-1.5 rounded-lg border text-[13.5px] font-semibold" style={{borderColor:PAPER.line}}>Open {n.name} Backstage <I.IArrow className="h-3.5 w-3.5" /></Link>
        )}
        {companyStudy(n.id)?.ecosystem && (
          <Link href={companyStudy(n.id)!.ecosystem!.href} className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold text-[#0755A5]" style={{borderColor:PAPER.line}}>Explore the partner network <I.IGraph className="h-4 w-4" /></Link>
        )}
        {n.href && (
          <Link href={research && category ? `${n.href}?category=${category}` : n.href}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-[13.5px] font-semibold transition hover:bg-black/[0.03]"
            style={{ borderColor: "#DDD9CE", color: PAPER.ink }}>
            {researchCompany(n.id)?'Read company brief':'Read the full position'} <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        )}
        {!n.instance && !n.href && (
          <p className="text-[13px] leading-relaxed" style={{ color: PAPER.faint }}>
            No deep read yet. This vendor is on the board because its bet is distinct, not because it has been
            researched individually — the dashed outline says so on the plot.
          </p>
        )}
      </div>
    </div>
  );
}
