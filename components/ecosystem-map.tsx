"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ALL_COMPANIES, COMPANIES, EDGES, LENSES, volatility, companyBySlug,
  type LensId, type Archetype,
} from "@/lib/data/ecosystem";
import {
  ALTITUDES, ecosystemNodes, categoryNodes, companyNodes, ecosystemById,
  type Altitude, type MapNode,
} from "@/lib/data/altitude";
import { ERAS, ERA_THESIS, RECURRENCE, type Footprint } from "@/lib/content/eras";
import { useNarrow } from "./use-narrow";
import * as I from "./icons";

// Desktop plots wide; phones plot portrait with type sized so it survives the
// viewBox scale. A 12px label in a 1000-wide viewBox is 4.5px on a 375px screen.
const GEO = {
  wide: { W: 1000, H: 620, PAD: 74, fq: 12.5, fax: 12, fax2: 11, flab: 11.5, flabOn: 12.5, rMin: 6, rMax: 22 },
  narrow: { W: 560, H: 700, PAD: 52, fq: 17, fax: 16, fax2: 16, flab: 16, flabOn: 18, rMin: 7, rMax: 26 },
} as const;

const ARCH: Record<Archetype, { fill: string; label: string }> = {
  "Compound platform": { fill: "#F5C518", label: "Compound platform" },
  "Enterprise suite": { fill: "#8A939B", label: "Enterprise suite" },
  "Payroll rail": { fill: "#B6BEC5", label: "Payroll rail" },
  "Global employment": { fill: "#1F5FCC", label: "Global employment" },
  "Connective layer": { fill: "#0E7C5A", label: "Connective layer" },
  "Point specialist": { fill: "#5B646C", label: "Point specialist" },
  "AI-native": { fill: "#B4441F", label: "AI-native" },
  "Regional entrenched": { fill: "#22262A", label: "Regional entrenched" },
  "Service platform": { fill: "#7C5BD9", label: "Service platform" },
  "Integrator channel": { fill: "#C9863B", label: "Integrator channel" },
  "Capital and consolidation": { fill: "#3E8E7E", label: "Capital & consolidation" },
  "Work marketplace": { fill: "#D4586F", label: "Work marketplace" },
};

const groupFill = (g: string) =>
  (ARCH as Record<string, { fill: string }>)[g]?.fill ??
  (g === "Likely to emerge" ? "#B4441F" : "#F5C518");

const QTONE: Record<string, string> = { signal: "#D9A900", moss: "#0E7C5A", clay: "#B4441F", ink: "#8A939B" };

const FOOT: Record<Footprint, { c: string; label: string }> = {
  Emerging: { c: "#B4441F", label: "Emerging" },
  Expanding: { c: "#F5C518", label: "Expanding" },
  Holding: { c: "#0E7C5A", label: "Holding" },
  Decaying: { c: "#5B646C", label: "Decaying" },
  Residual: { c: "#343A40", label: "Residual" },
};

export function EcosystemMap() {
  const narrow = useNarrow();
  const G = narrow ? GEO.narrow : GEO.wide;
  const { W, H, PAD } = G;
  const px = (x: number) => PAD + (x / 100) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 100) * (H - PAD * 2);
  const rr = (r: number) => G.rMin + (r / 100) * G.rMax;
  const QPOS = { tl: [PAD + 8, PAD + 4], tr: [W - PAD - 8, PAD + 4], bl: [PAD + 8, H - PAD - 8], br: [W - PAD - 8, H - PAD - 8] } as const;
  const [alt, setAlt] = useState<Altitude>("companies");
  const [focus, setFocus] = useState<{ ecosystem?: string; category?: string }>({});
  const [lensId, setLensId] = useState<LensId>("strategic");
  const [sel, setSel] = useState<string | null>("rippling");
  const [hover, setHover] = useState<string | null>(null);
  const [era, setEra] = useState<string>("integration");

  const lens = LENSES.find((l) => l.id === lensId)!;

  const nodes = useMemo<MapNode[]>(() => {
    if (alt === "ecosystems") return ecosystemNodes();
    if (alt === "categories") return categoryNodes();
    return companyNodes(focus);
  }, [alt, focus]);

  const go = (a: Altitude) => {
    setAlt(a);
    if (a !== "companies") setFocus({});
    setSel(a === "companies" ? (focus.ecosystem || focus.category ? null : "rippling") : null);
  };

  const drill = (n: MapNode) => {
    if (n.kind === "ecosystems") {
      if (n.emergent) { setSel(n.id); return; }
      setFocus({ ecosystem: n.id }); setAlt("companies"); setSel(null);
    } else if (n.kind === "categories") {
      setFocus({ category: n.id }); setAlt("companies"); setSel(null);
    } else setSel(n.id);
  };

  const selNode = nodes.find((n) => n.id === sel) ?? null;
  const active = hover ?? sel;
  const focusLabel = focus.ecosystem ? ecosystemById(focus.ecosystem)?.name : focus.category;

  const linked = useMemo(() => {
    if (!active || alt !== "companies") return new Set<string>();
    const s = new Set<string>();
    EDGES.forEach((e) => { if (e.from === active) s.add(e.to); if (e.to === active) s.add(e.from); });
    return s;
  }, [active, alt]);

  const shownEdges = useMemo(() => {
    if (alt !== "companies") return [];
    const ids = new Set(nodes.map((n) => n.id));
    const pool = EDGES.filter((e) => ids.has(e.from) && ids.has(e.to));
    return active ? pool.filter((e) => e.from === active || e.to === active) : pool.filter((e) => e.kind === "antithesis");
  }, [alt, nodes, active]);

  const ordered = useMemo(() => [...nodes].sort((a, b) => b.lens[lensId].r - a.lens[lensId].r), [nodes, lensId]);
  const groups = useMemo(() => [...new Set(nodes.map((n) => n.group))], [nodes]);

  return (
    <div>
      {/* Altitude */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Altitude</span>
        <div className="flex flex-wrap gap-1">
          {ALTITUDES.map((a, i) => (
            <button key={a.id} onClick={() => go(a.id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition ${
                a.id === alt ? "bg-white text-ink" : "bg-white/[0.06] text-ink-400 ring-1 ring-white/10 hover:bg-white/10"
              }`}>
              <span className="num text-[10px] opacity-50">L{i}</span>{a.label}
            </button>
          ))}
        </div>
        {focusLabel && (
          <button onClick={() => { setFocus({}); setAlt(focus.ecosystem ? "ecosystems" : "categories"); }}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-signal/15 px-2.5 py-1.5 text-[12px] font-medium text-signal ring-1 ring-signal/30 hover:bg-signal/25">
            <I.IClose className="h-3 w-3" /> {focusLabel}
          </button>
        )}
      </div>

      {alt === "eras" ? (
        <EraLayer era={era} setEra={setEra} narrow={narrow} />
      ) : (
        <>
          {/* Lens */}
          <div className="mt-4 flex flex-wrap gap-1.5">
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
            <div className="min-w-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Map — ${lens.pill}`}>
                <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="rgba(255,255,255,.09)" strokeDasharray="3 5" />
                <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="rgba(255,255,255,.09)" strokeDasharray="3 5" />
                <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="none" stroke="rgba(255,255,255,.10)" rx="6" />

                {lens.quadrants.map((q) => {
                  const [qx, qy] = QPOS[q.at];
                  return (
                    <text key={q.at} x={qx} y={qy} textAnchor={q.at.endsWith("l") ? "start" : "end"}
                      fill={QTONE[q.tone]} fontSize={G.fq} fontWeight="700" letterSpacing="0.04em" opacity="0.8">
                      {q.label.toUpperCase()}
                    </text>
                  );
                })}

                <text x={W / 2} y={H - (narrow ? 16 : 22)} textAnchor="middle" fill="#8A939B" fontSize={G.fax} fontWeight="600">{lens.x.label}</text>
                <text x={PAD} y={H - (narrow ? 36 : 42)} textAnchor="start" fill="#5B646C" fontSize={G.fax2}>← {lens.x.low}</text>
                <text x={W - PAD} y={H - (narrow ? 36 : 42)} textAnchor="end" fill="#5B646C" fontSize={G.fax2}>{lens.x.high} →</text>
                <text x={narrow ? 16 : 22} y={H / 2} textAnchor="middle" fill="#8A939B" fontSize={G.fax} fontWeight="600"
                  transform={`rotate(-90 ${narrow ? 16 : 22} ${H / 2})`}>{lens.y.label}</text>

                {shownEdges.map((e, i) => {
                  const a = companyBySlug(e.from), b = companyBySlug(e.to);
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

                {ordered.map((n) => {
                  const p = n.lens[lensId];
                  const isActive = active === n.id;
                  const isLinked = linked.has(n.id);
                  const dim = !!active && !isActive && !isLinked;
                  const fill = groupFill(n.group);
                  // Label everything unless the view is dense enough that it would collide.
                  // On a phone, label only the biggest few plus whatever is selected — anything
                  // more collides at this size and reads as noise.
                  const showLabel = narrow
                    ? isActive || isLinked || p.r >= (alt === "companies" ? 74 : 56)
                    : alt !== "companies" || nodes.length <= 14 || p.r >= 46 || isActive || isLinked;
                  return (
                    <g key={n.id} transform={`translate(${px(p.x)} ${py(p.y)})`}
                      style={{ transition: "transform .6s cubic-bezier(.2,.7,.3,1)", cursor: "pointer" }}
                      opacity={dim ? 0.22 : 1}
                      onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                      onClick={() => drill(n)}>
                      <circle r={rr(p.r)} fill={fill} fillOpacity={isActive ? 0.95 : 0.62}
                        stroke={isActive ? "#fff" : "rgba(0,0,0,.35)"} strokeWidth={isActive ? 2 : 1}
                        strokeDasharray={n.emergent ? "4 3" : undefined}
                        style={{ transition: "r .6s cubic-bezier(.2,.7,.3,1), fill-opacity .2s" }} />
                      {n.deep && <circle r={rr(p.r) + 4.5} fill="none" stroke={fill} strokeOpacity="0.42" strokeWidth="1" />}
                      {showLabel && (
                        <text y={rr(p.r) + 13} textAnchor="middle" fill={isActive ? "#fff" : "#B6BEC5"}
                          fontSize={isActive ? G.flabOn : G.flab} fontWeight={isActive ? 700 : 500} style={{ pointerEvents: "none" }}>
                          {n.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/10 px-4 py-3">
                {groups.map((g) => (
                  <span key={g} className="flex items-center gap-1.5 text-[11px] text-ink-400">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: groupFill(g), opacity: 0.75 }} />{g}
                  </span>
                ))}
                {alt !== "companies" && (
                  <span className="text-[11px] text-signal">tap a circle to zoom in</span>
                )}
              </div>

              {narrow && (
                <div className="border-t border-white/10">
                  <div className="px-4 pt-3 text-[10.5px] font-bold uppercase tracking-wider text-ink-500">
                    Ranked by {lens.pill.toLowerCase()} — tap to read
                  </div>
                  <ul className="max-h-[19rem] overflow-y-auto thin-scroll px-2 py-2">
                    {ordered.map((n, i) => (
                      <li key={n.id}>
                        <button onClick={() => drill(n)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                            sel === n.id ? "bg-white/10" : "active:bg-white/[0.06]"}`}>
                          <span className="num w-5 shrink-0 text-right text-[11px] text-ink-600">{i + 1}</span>
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: groupFill(n.group) }} />
                          <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink-200">{n.name}</span>
                          {n.deep && <I.IArrow className="h-3 w-3 shrink-0 text-signal" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="min-w-0">
              {selNode ? <Detail node={selNode} lensId={lensId} alt={alt} />
                : <div className="rounded-xl bg-white/[0.04] p-5 text-[14px] leading-relaxed text-ink-400 ring-1 ring-white/10">
                    {alt === "companies" ? "Pick a company to read the position." : "Click a circle to zoom in, or hover to preview."}
                  </div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Detail({ node, lensId, alt }: { node: MapNode; lensId: LensId; alt: Altitude }) {
  const company = alt === "companies" ? companyBySlug(node.id) : null;
  const eco = alt === "ecosystems" ? ecosystemById(node.id) : null;
  const pool = ALL_COMPANIES;

  return (
    <div className="rounded-xl bg-white/[0.05] ring-1 ring-white/10">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: groupFill(node.group) }} />
          <h3 className="text-[18px] font-semibold tracking-tight text-white">{node.name}</h3>
          {node.emergent && <span className="rounded-full bg-clay/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-clay">speculative</span>}
        </div>
        {company && <p className="mt-1 text-[11.5px] uppercase tracking-wide text-ink-500">{company.archetype} · {company.geo}</p>}
        <p className="mt-2.5 text-[14px] leading-[1.6] text-ink-200">{node.blurb}</p>
      </div>

      {eco && (
        <div className="border-b border-white/10 bg-signal/[0.06] px-5 py-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-signal">Why it belongs on the map</div>
          <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-200">{eco.relation}</p>
        </div>
      )}

      {company?.note[lensId] && (
        <div className="border-b border-white/10 bg-signal/[0.06] px-5 py-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-signal">Under this lens</div>
          <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-200">{company.note[lensId]}</p>
        </div>
      )}

      {company && (() => {
        const { ranks, spread } = volatility(company, pool);
        return (
          <div className="border-b border-white/10 px-5 py-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">Rank by lens</span>
              {spread >= 12 && <span className="text-[10.5px] font-bold uppercase tracking-wider text-clay">swings {spread}</span>}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {LENSES.map((l, i) => (
                <div key={l.id} className={`rounded-md px-1.5 py-1.5 text-center ring-1 ${
                  l.id === lensId ? "bg-white/10 ring-white/20" : "bg-white/[0.03] ring-white/[0.07]"}`}>
                  <div className="num text-[15px] font-semibold text-white">#{ranks[i]}</div>
                  <div className="mt-0.5 text-[9.5px] leading-tight text-ink-500">{l.pill}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {node.members && node.members.length > 0 && (
        <div className="border-b border-white/10 px-5 py-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">Contains ({node.members.length})</div>
          <p className="mt-1.5 text-[12.5px] leading-[1.6] text-ink-400">
            {node.members.map((m) => companyBySlug(m)?.name ?? m).join(" · ")}
          </p>
        </div>
      )}

      {node.href && (
        <div className="px-5 py-4">
          <Link href={node.href}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-signal px-4 text-[13px] font-bold text-ink transition hover:bg-signal-300">
            Read the full position <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function EraLayer({ era, setEra, narrow }: { era: string; setEra: (s: string) => void; narrow: boolean }) {
  const e = ERAS.find((x) => x.id === era)!;
  const EW = 1000, EH = 300, EP = 60;
  const ex = (x: number) => EP + (x / 100) * (EW - EP * 2);
  const ey = (y: number) => EH - 46 - (y / 100) * (EH - 100);

  return (
    <div className="mt-4">
      <p className="prose-measure text-[14.5px] leading-[1.65] text-ink-300">
        Above ecosystems sit the architecture patterns themselves. These are not a march of progress — they are
        overlapping footprints, some expanding, some decaying for forty years without disappearing. Height is how much
        of the terrain each still occupies today.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {narrow ? (
          <div className="min-w-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10">
            <ul className="divide-y divide-white/[0.07]">
              {ERAS.map((x) => {
                const on = x.id === era;
                const f = FOOT[x.footprint];
                return (
                  <li key={x.id}>
                    <button onClick={() => setEra(x.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left ${on ? "bg-white/[0.07]" : ""}`}>
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: f.c }} />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[14px] ${on ? "font-semibold text-white" : "text-ink-200"}`}>{x.name}</span>
                        <span className="block text-[11.5px] text-ink-500">{x.span}</span>
                      </span>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: `${f.c}22`, color: f.c }}>{x.footprint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
        <div className="min-w-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10">
          <svg viewBox={`0 0 ${EW} ${EH}`} className="w-full" role="img" aria-label="Architecture eras and footprints">
            <line x1={EP} y1={EH - 46} x2={EW - EP} y2={EH - 46} stroke="rgba(255,255,255,.14)" />
            {[0, 25, 50, 75, 100].map((t) => (
              <line key={t} x1={ex(t)} y1={EH - 46} x2={ex(t)} y2={EH - 40} stroke="rgba(255,255,255,.2)" />
            ))}
            <text x={EP} y={EH - 22} fill="#5B646C" fontSize="11">1960s</text>
            <text x={EW - EP} y={EH - 22} textAnchor="end" fill="#5B646C" fontSize="11">now</text>
            <text x={20} y={EH / 2 - 20} textAnchor="middle" fill="#8A939B" fontSize="11.5" fontWeight="600"
              transform={`rotate(-90 20 ${EH / 2 - 20})`}>Footprint today</text>

            {ERAS.map((x) => {
              const on = x.id === era;
              const f = FOOT[x.footprint];
              return (
                <g key={x.id} style={{ cursor: "pointer" }} onClick={() => setEra(x.id)} opacity={on ? 1 : 0.62}>
                  <line x1={ex(x.x)} y1={EH - 46} x2={ex(x.x)} y2={ey(x.y)} stroke={f.c} strokeWidth={on ? 2.5 : 1.5} strokeOpacity="0.55" />
                  <circle cx={ex(x.x)} cy={ey(x.y)} r={on ? 13 : 9} fill={f.c} fillOpacity={on ? 0.95 : 0.6}
                    stroke={on ? "#fff" : "none"} strokeWidth="2" />
                  <text x={ex(x.x)} y={ey(x.y) - (on ? 22 : 17)} textAnchor="middle"
                    fill={on ? "#fff" : "#B6BEC5"} fontSize={on ? 12.5 : 11} fontWeight={on ? 700 : 500}>
                    {x.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/10 px-4 py-3">
            {(Object.keys(FOOT) as Footprint[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-[11px] text-ink-400">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: FOOT[k].c }} />{FOOT[k].label}
              </span>
            ))}
          </div>
        </div>
        )}

        <div className="min-w-0 rounded-xl bg-white/[0.05] ring-1 ring-white/10">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold tracking-tight text-white">{e.name}</h3>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: `${FOOT[e.footprint].c}22`, color: FOOT[e.footprint].c }}>
                {e.footprint}
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] text-ink-500">{e.span}</p>
          </div>
          <Row label="What was scarce" body={e.scarce} accent />
          <Row label="Who won it" body={e.winners} />
          <Row label="What it did to cost" body={e.whatItDidToCost} />
          <Row label="What is still here" body={e.residue} />
          <div className="px-5 py-3.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink-500">On this map</div>
            <p className="mt-1 text-[12.5px] text-ink-300">{e.hrExamples.join(" · ")}</p>
          </div>
        </div>
      </div>

      {/* The thesis */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-signal/[0.07] p-5 ring-1 ring-signal/25">
          <h3 className="font-serif-display text-[21px] leading-snug text-white">{ERA_THESIS.headline}</h3>
          <p className="prose-measure mt-2.5 text-[14.5px] leading-[1.65] text-ink-100">{ERA_THESIS.body}</p>
          <p className="prose-measure mt-3 border-t border-signal/20 pt-3 text-[13.5px] leading-[1.6] text-ink-300">
            <span className="font-semibold text-signal">Where this frame fails: </span>{ERA_THESIS.caution}
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
          <h3 className="font-serif-display text-[21px] leading-snug text-white">{RECURRENCE.headline}</h3>
          <ol className="mt-3 space-y-1.5">
            {RECURRENCE.instances.map((r) => (
              <li key={r.name} className="flex items-baseline gap-3 text-[13px]">
                <span className="num w-10 shrink-0 text-ink-500">{r.years}</span>
                <span className="w-[118px] shrink-0 font-semibold text-white">{r.name}</span>
                <span className="text-ink-400">{r.claim}</span>
              </li>
            ))}
          </ol>
          <p className="prose-measure mt-3 border-t border-white/10 pt-3 text-[13.5px] leading-[1.6] text-ink-300">{RECURRENCE.note}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div className={`border-b border-white/10 px-5 py-3.5 ${accent ? "bg-signal/[0.06]" : ""}`}>
      <div className={`text-[10.5px] font-bold uppercase tracking-wider ${accent ? "text-signal" : "text-ink-500"}`}>{label}</div>
      <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-200">{body}</p>
    </div>
  );
}
