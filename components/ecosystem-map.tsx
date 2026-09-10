"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COMPANIES, EDGES, LENSES, volatility, type Company, type LensId, type Archetype } from "@/lib/data/ecosystem";
import * as I from "./icons";

const W = 1000, H = 620, PAD = 74;
const px = (x: number) => PAD + (x / 100) * (W - PAD * 2);
const py = (y: number) => H - PAD - (y / 100) * (H - PAD * 2);
const rr = (r: number) => 6 + (r / 100) * 22;

const ARCH: Record<Archetype, { fill: string; stroke: string; label: string }> = {
  "Compound platform": { fill: "#F5C518", stroke: "#D9A900", label: "Compound platform" },
  "Enterprise suite": { fill: "#8A939B", stroke: "#5B646C", label: "Enterprise suite" },
  "Payroll rail": { fill: "#B6BEC5", stroke: "#8A939B", label: "Payroll rail" },
  "Global employment": { fill: "#1F5FCC", stroke: "#1747a0", label: "Global employment" },
  "Connective layer": { fill: "#0E7C5A", stroke: "#0a5d43", label: "Connective layer" },
  "Point specialist": { fill: "#5B646C", stroke: "#343A40", label: "Point specialist" },
  "AI-native": { fill: "#B4441F", stroke: "#8a3418", label: "AI-native" },
  "Regional entrenched": { fill: "#22262A", stroke: "#5B646C", label: "Regional entrenched" },
};

const QPOS = { tl: [PAD + 10, PAD + 6], tr: [W - PAD - 10, PAD + 6], bl: [PAD + 10, H - PAD - 10], br: [W - PAD - 10, H - PAD - 10] };
const QTONE: Record<string, string> = { signal: "#D9A900", moss: "#0E7C5A", clay: "#B4441F", ink: "#8A939B" };

export function EcosystemMap() {
  const [lensId, setLensId] = useState<LensId>("strategic");
  const [sel, setSel] = useState<string | null>("rippling");
  const [hover, setHover] = useState<string | null>(null);
  const lens = LENSES.find((l) => l.id === lensId)!;

  const selected = COMPANIES.find((c) => c.slug === sel) ?? null;
  const active = hover ?? sel;

  const linked = useMemo(() => {
    if (!active) return new Set<string>();
    const s = new Set<string>();
    EDGES.forEach((e) => {
      if (e.from === active) s.add(e.to);
      if (e.to === active) s.add(e.from);
    });
    return s;
  }, [active]);

  const shownEdges = useMemo(
    () => (active ? EDGES.filter((e) => e.from === active || e.to === active) : EDGES.filter((e) => e.kind === "antithesis")),
    [active]
  );

  const ordered = useMemo(
    () => [...COMPANIES].sort((a, b) => b.lens[lensId].r - a.lens[lensId].r),
    [lensId]
  );

  return (
    <div>
      {/* Lens pills */}
      <div className="flex flex-wrap gap-1.5">
        {LENSES.map((l) => (
          <button key={l.id} onClick={() => setLensId(l.id)}
            className={`rounded-lg px-3 py-2 text-left transition ${
              l.id === lensId ? "bg-signal text-ink" : "bg-white/[0.06] text-ink-300 ring-1 ring-white/10 hover:bg-white/10"
            }`}>
            <span className="block text-[13px] font-semibold">{l.pill}</span>
            <span className={`block text-[11px] ${l.id === lensId ? "text-ink/65" : "text-ink-500"}`}>
              {l.question.replace("Relevant to ", "").replace("?", "")}
            </span>
          </button>
        ))}
      </div>

      <p className="prose-measure mt-4 text-[14.5px] leading-[1.65] text-ink-300">{lens.blurb}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {/* Map */}
        <div className="min-w-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`HR tech map — ${lens.pill}`}>
            {/* grid */}
            <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="rgba(255,255,255,.09)" strokeDasharray="3 5" />
            <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="rgba(255,255,255,.09)" strokeDasharray="3 5" />
            <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="none" stroke="rgba(255,255,255,.10)" rx="6" />

            {/* quadrant labels */}
            {lens.quadrants.map((q) => {
              const [qx, qy] = QPOS[q.at];
              const anchor = q.at.endsWith("l") ? "start" : "end";
              return (
                <text key={q.at} x={qx} y={qy} textAnchor={anchor} fill={QTONE[q.tone]}
                  fontSize="12.5" fontWeight="700" letterSpacing="0.04em" opacity="0.75">
                  {q.label.toUpperCase()}
                </text>
              );
            })}

            {/* axis labels */}
            <text x={W / 2} y={H - 22} textAnchor="middle" fill="#8A939B" fontSize="12" fontWeight="600">{lens.x.label}</text>
            <text x={PAD} y={H - 42} textAnchor="start" fill="#5B646C" fontSize="11">← {lens.x.low}</text>
            <text x={W - PAD} y={H - 42} textAnchor="end" fill="#5B646C" fontSize="11">{lens.x.high} →</text>
            <text x={22} y={H / 2} textAnchor="middle" fill="#8A939B" fontSize="12" fontWeight="600"
              transform={`rotate(-90 22 ${H / 2})`}>{lens.y.label}</text>
            <text x={46} y={PAD + 4} textAnchor="start" fill="#5B646C" fontSize="10.5"
              transform={`rotate(-90 46 ${PAD + 4})`}>{lens.y.high} →</text>

            {/* edges */}
            {shownEdges.map((e, i) => {
              const a = COMPANIES.find((c) => c.slug === e.from), b = COMPANIES.find((c) => c.slug === e.to);
              if (!a || !b) return null;
              const pa = a.lens[lensId], pb = b.lens[lensId];
              return (
                <line key={i} x1={px(pa.x)} y1={py(pa.y)} x2={px(pb.x)} y2={py(pb.y)}
                  stroke={e.kind === "antithesis" ? "#B4441F" : e.kind === "powers" ? "#0E7C5A" : "rgba(255,255,255,.22)"}
                  strokeWidth={e.kind === "antithesis" ? 1.6 : 1.1}
                  strokeDasharray={e.kind === "antithesis" ? "5 4" : undefined}
                  style={{ transition: "all .55s cubic-bezier(.2,.7,.3,1)" }} />
              );
            })}

            {/* nodes */}
            {ordered.map((c) => {
              const p = c.lens[lensId];
              const isActive = active === c.slug;
              const isLinked = linked.has(c.slug);
              const dim = !!active && !isActive && !isLinked;
              const a = ARCH[c.archetype];
              const showLabel = p.r >= 46 || isActive || isLinked;
              return (
                <g key={c.slug}
                  transform={`translate(${px(p.x)} ${py(p.y)})`}
                  style={{ transition: "transform .6s cubic-bezier(.2,.7,.3,1)", cursor: "pointer" }}
                  opacity={dim ? 0.22 : 1}
                  onMouseEnter={() => setHover(c.slug)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setSel(c.slug)}>
                  <circle r={rr(p.r)} fill={a.fill} fillOpacity={isActive ? 0.95 : 0.62}
                    stroke={isActive ? "#fff" : a.stroke} strokeWidth={isActive ? 2 : 1}
                    style={{ transition: "r .6s cubic-bezier(.2,.7,.3,1), fill-opacity .2s" }} />
                  {c.deep && <circle r={rr(p.r) + 4.5} fill="none" stroke={a.fill} strokeOpacity="0.42" strokeWidth="1" />}
                  {showLabel && (
                    <text y={rr(p.r) + 13} textAnchor="middle"
                      fill={isActive ? "#fff" : "#B6BEC5"} fontSize={isActive ? 12.5 : 11.5}
                      fontWeight={isActive ? 700 : 500} style={{ pointerEvents: "none" }}>
                      {c.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/10 px-4 py-3">
            {(Object.keys(ARCH) as Archetype[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-[11px] text-ink-400">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ARCH[k].fill, opacity: 0.7 }} />
                {ARCH[k].label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-[11px] text-ink-500">
              <span className="h-2.5 w-2.5 rounded-full ring-1 ring-signal/60" /> ringed = built out below
            </span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="min-w-0">
          {selected ? <Detail c={selected} lensId={lensId} /> : (
            <div className="rounded-xl bg-white/[0.04] p-5 text-[14px] leading-relaxed text-ink-400 ring-1 ring-white/10">
              Pick a company to read the position.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ c, lensId }: { c: Company; lensId: LensId }) {
  const a = ARCH[c.archetype];
  const { ranks, spread } = volatility(c);
  const note = c.note[lensId];
  const edges = EDGES.filter((e) => e.from === c.slug || e.to === c.slug);

  return (
    <div className="rounded-xl bg-white/[0.05] ring-1 ring-white/10">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: a.fill }} />
          <h3 className="text-[18px] font-semibold tracking-tight text-white">{c.name}</h3>
        </div>
        <p className="mt-1 text-[11.5px] uppercase tracking-wide text-ink-500">{c.archetype} · {c.geo}</p>
        <p className="mt-2.5 text-[14px] leading-[1.6] text-ink-200">{c.bet}</p>
      </div>

      {note && (
        <div className="border-b border-white/10 bg-signal/[0.06] px-5 py-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-signal">
            Under this lens
          </div>
          <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-200">{note}</p>
        </div>
      )}

      {/* rank across lenses */}
      <div className="border-b border-white/10 px-5 py-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">Rank by lens</span>
          {spread >= 12 && (
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-clay">swings {spread} places</span>
          )}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {LENSES.map((l, i) => (
            <div key={l.id} className={`rounded-md px-1.5 py-1.5 text-center ring-1 ${
              l.id === lensId ? "bg-white/10 ring-white/20" : "bg-white/[0.03] ring-white/[0.07]"
            }`}>
              <div className="num text-[15px] font-semibold text-white">#{ranks[i]}</div>
              <div className="mt-0.5 text-[9.5px] leading-tight text-ink-500">{l.pill}</div>
            </div>
          ))}
        </div>
      </div>

      {edges.length > 0 && (
        <div className="border-b border-white/10 px-5 py-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">Lines of tension</div>
          <ul className="mt-2 space-y-2">
            {edges.slice(0, 4).map((e, i) => {
              const other = COMPANIES.find((x) => x.slug === (e.from === c.slug ? e.to : e.from));
              return (
                <li key={i} className="text-[12.5px] leading-[1.55] text-ink-400">
                  <span className={`font-semibold ${e.kind === "antithesis" ? "text-clay" : e.kind === "powers" ? "text-moss" : "text-ink-200"}`}>
                    {other?.name}
                  </span>
                  {" — "}{e.note}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {c.deep && (
        <div className="px-5 py-4">
          <Link href={`/ecosystem/${c.slug}`}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-signal px-4 text-[13px] font-bold text-ink transition hover:bg-signal-300">
            Read the full position <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
