"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LENSES, type LensId } from "@/lib/data/ecosystem";
import { SECTORS, sectorById, categoryById } from "@/lib/data/atlas";
import { nodesAt, BOARD_STATS, type Node, type Level } from "@/lib/data/atlas-nodes";
import { useNarrow } from "./use-narrow";
import * as I from "./icons";

const G = {
  wide: { W: 1040, H: 620, PAD: 76, fq: 11, fax: 11, flab: 11, flabOn: 12.5, rMin: 5, rMax: 20 },
  narrow: { W: 540, H: 660, PAD: 46, fq: 15, fax: 15, flab: 15, flabOn: 17, rMin: 6, rMax: 24 },
} as const;

const ARCH_TINT: Record<string, string> = {
  "Compound platform": "#C99A00", "Enterprise suite": "#6B7785", "Payroll rail": "#9AA5B1",
  "Global employment": "#2D6FD1", "Connective layer": "#0E7C5A", "Point specialist": "#8A8F98",
  "AI-native": "#C0522A", "Regional entrenched": "#4A5158", "Service platform": "#7C5BD9",
  "Integrator channel": "#C9863B", "Capital and consolidation": "#3E8E7E", "Work marketplace": "#D4586F",
};

const tint = (n: Node) =>
  n.level === "sector" ? sectorById(n.id)?.accent ?? "#8A8F98"
  : n.archetype ? ARCH_TINT[n.archetype] ?? "#8A8F98"
  : sectorById(n.sector)?.accent ?? "#8A8F98";

export function Atlas() {
  const narrow = useNarrow();
  const g = narrow ? G.narrow : G.wide;
  const { W, H, PAD } = g;
  const px = (x: number) => PAD + (x / 100) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 100) * (H - PAD * 2);
  const rr = (r: number) => g.rMin + (r / 100) * g.rMax;

  const [level, setLevel] = useState<Level>("sector");
  const [focus, setFocus] = useState<{ sector?: string; category?: string }>({});
  const [lensId, setLensId] = useState<LensId>("strategic");
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const lens = LENSES.find((l) => l.id === lensId)!;
  const nodes = useMemo(() => nodesAt(level, focus), [level, focus]);
  const ordered = useMemo(() => [...nodes].sort((a, b) => b.lens[lensId].r - a.lens[lensId].r), [nodes, lensId]);
  const selected = nodes.find((n) => n.id === sel) ?? null;
  const active = hover ?? sel;

  const open = (n: Node) => {
    if (n.level === "sector") { setFocus({ sector: n.id }); setLevel("category"); setSel(null); }
    else if (n.level === "category") { setFocus({ sector: n.sector, category: n.id }); setLevel("vendor"); setSel(null); }
    else setSel(n.id);
  };
  const toRoot = () => { setFocus({}); setLevel("sector"); setSel(null); };
  const toSector = () => { setFocus({ sector: focus.sector }); setLevel("category"); setSel(null); };

  const crumbs = [
    { label: "All sectors", on: level === "sector", go: toRoot },
    ...(focus.sector ? [{ label: sectorById(focus.sector)?.name ?? "", on: level === "category", go: toSector }] : []),
    ...(focus.category ? [{ label: categoryById(focus.category)?.name ?? "", on: level === "vendor", go: () => {} }] : []),
  ];

  return (
    <div className="min-h-screen" style={{ background: "#FBFAF7", color: "#1A1A18" }}>
      {/* Chrome */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: "#E7E5DE", background: "#FBFAF7EE", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-[5px]" style={{ background: "#1A1A18", color: "#F5C518" }}>
              <I.ILayers className="h-3.5 w-3.5" />
            </span>
            <span className="text-[14px] font-semibold tracking-tight">Atlas</span>
          </Link>
          <span className="hidden text-[11.5px] sm:block" style={{ color: "#8C8A82" }}>
            {BOARD_STATS.vendors} vendors · {BOARD_STATS.categories} categories · {BOARD_STATS.sectors} sectors
          </span>
          <nav className="ml-auto flex items-center gap-1 text-[12.5px]">
            <Link href="/app" className="rounded-md px-2.5 py-1.5 font-medium transition hover:bg-black/[0.05]">The app</Link>
            <Link href="/desk" className="rounded-md px-2.5 py-1.5 font-medium transition hover:bg-black/[0.05]">Desk</Link>
            <Link href="/backstage" className="rounded-md px-2.5 py-1.5 font-medium transition hover:bg-black/[0.05]">Backstage</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        {/* Breadcrumb + lens */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[13.5px]">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: "#C9C6BC" }}>/</span>}
                <button onClick={c.go} disabled={c.on}
                  className={`rounded px-1.5 py-0.5 transition ${c.on ? "font-semibold" : "hover:bg-black/[0.05]"}`}
                  style={{ color: c.on ? "#1A1A18" : "#6E6B63" }}>
                  {c.label}
                </button>
              </span>
            ))}
            <span className="ml-1 tabular-nums text-[12px]" style={{ color: "#A8A59C" }}>{nodes.length}</span>
          </div>

          <div className="ml-auto flex flex-wrap gap-0.5 rounded-lg p-0.5" style={{ background: "#F0EEE8" }}>
            {LENSES.map((l) => (
              <button key={l.id} onClick={() => setLensId(l.id)}
                className="rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition"
                style={l.id === lensId ? { background: "#FFF", color: "#1A1A18", boxShadow: "0 1px 2px rgba(0,0,0,.07)" } : { color: "#6E6B63" }}>
                {l.pill}
              </button>
            ))}
          </div>
        </div>

        {/* Question this lens answers */}
        <p className="max-w-3xl pb-4 text-[14px] leading-[1.6]" style={{ color: "#55524B" }}>
          <span className="font-semibold" style={{ color: "#1A1A18" }}>{lens.question}</span>{" "}
          {lens.blurb}
        </p>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Plot */}
          <div className="min-w-0 overflow-hidden rounded-xl border" style={{ borderColor: "#E7E5DE", background: "#FFF" }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Atlas — ${lens.pill}`}>
              <defs>
                <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M26 0H0V26" fill="none" stroke="#F2F0EA" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="url(#grid)" />
              <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#E0DDD4" strokeDasharray="2 4" />
              <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="#E0DDD4" strokeDasharray="2 4" />
              <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} fill="none" stroke="#DDD9CE" />

              {lens.quadrants.map((q) => {
                const pos = { tl: [PAD + 8, PAD + 16], tr: [W - PAD - 8, PAD + 16], bl: [PAD + 8, H - PAD - 10], br: [W - PAD - 8, H - PAD - 10] }[q.at];
                return (
                  <text key={q.at} x={pos[0]} y={pos[1]} textAnchor={q.at.endsWith("l") ? "start" : "end"}
                    fill="#B4B0A5" fontSize={g.fq} fontWeight="600" letterSpacing="0.06em">
                    {q.label.toUpperCase()}
                  </text>
                );
              })}

              <text x={W / 2} y={H - 20} textAnchor="middle" fill="#8C8A82" fontSize={g.fax} fontWeight="600">{lens.x.label}</text>
              <text x={PAD} y={H - 40} textAnchor="start" fill="#B4B0A5" fontSize={g.fax}>← {lens.x.low}</text>
              <text x={W - PAD} y={H - 40} textAnchor="end" fill="#B4B0A5" fontSize={g.fax}>{lens.x.high} →</text>
              <text x={18} y={H / 2} textAnchor="middle" fill="#8C8A82" fontSize={g.fax} fontWeight="600"
                transform={`rotate(-90 18 ${H / 2})`}>{lens.y.label}</text>

              {ordered.map((n) => {
                const p = n.lens[lensId];
                const on = active === n.id;
                const dim = !!active && !on;
                const c = tint(n);
                // Label everything in a small set; above that, only the biggest —
                // and sooner on a phone, where collisions start earlier.
                const cap = narrow ? 9 : 18;
                const floor = narrow ? 62 : 42;
                const showLabel = on || nodes.length <= cap || p.r >= floor;
                return (
                  <g key={n.id} transform={`translate(${px(p.x)} ${py(p.y)})`}
                    style={{ transition: "transform .55s cubic-bezier(.2,.7,.3,1)", cursor: "pointer" }}
                    opacity={dim ? 0.3 : 1}
                    onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                    onClick={() => open(n)}>
                    <circle r={rr(p.r)} fill={c} fillOpacity={on ? 0.9 : 0.5} stroke={c} strokeWidth={on ? 1.8 : 1}
                      strokeDasharray={n.level === "vendor" && !n.handRead ? "3 2.5" : undefined}
                      style={{ transition: "r .55s cubic-bezier(.2,.7,.3,1), fill-opacity .2s" }} />
                    {n.instance && <circle r={rr(p.r) + 4} fill="none" stroke={c} strokeOpacity="0.45" strokeWidth="1" />}
                    {showLabel && (
                      <text y={rr(p.r) + 12} textAnchor="middle" fill={on ? "#1A1A18" : "#6E6B63"}
                        fontSize={on ? g.flabOn : g.flab} fontWeight={on ? 700 : 500} style={{ pointerEvents: "none" }}>
                        {n.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {narrow && (
              <div className="border-t" style={{ borderColor: "#E7E5DE" }}>
                <ul className="max-h-[17rem] overflow-y-auto thin-scroll p-1.5">
                  {ordered.map((n, i) => (
                    <li key={n.id}>
                      <button onClick={() => open(n)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left"
                        style={sel === n.id ? { background: "#F2F0EA" } : undefined}>
                        <span className="w-5 shrink-0 text-right text-[11px] tabular-nums" style={{ color: "#B4B0A5" }}>{i + 1}</span>
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tint(n) }} />
                        <span className="min-w-0 flex-1 truncate text-[13.5px]">{n.name}</span>
                        {n.count !== undefined && <span className="shrink-0 text-[11.5px] tabular-nums" style={{ color: "#A8A59C" }}>{n.count}</span>}
                        {n.level !== "vendor" && <I.IChevron className="h-3 w-3 shrink-0 text-[#C9C6BC]" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t px-4 py-2.5 text-[11px]"
              style={{ borderColor: "#E7E5DE", color: "#8C8A82" }}>
              {level === "sector" ? SECTORS.slice(0, 6).map((s) => (
                <span key={s.id} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} />{s.name}
                </span>
              )) : (
                <>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#8A8F98" }} />solid = read individually</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-dashed" style={{ borderColor: "#8A8F98" }} />dashed = placed by archetype</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full ring-1 ring-offset-1" style={{ background: "#C99A00" }} />ringed = playable study</span>
                </>
              )}
              {level !== "vendor" && <span style={{ color: "#C99A00" }}>click to open</span>}
            </div>
          </div>

          {/* Detail */}
          <div className="min-w-0">
            {selected ? <Detail n={selected} lensId={lensId} />
              : <Intro level={level} focus={focus} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border p-5" style={{ borderColor: "#E7E5DE", background: "#FFF" }}>{children}</div>;
}

function Intro({ level, focus }: { level: Level; focus: { sector?: string; category?: string } }) {
  const s = focus.sector ? sectorById(focus.sector) : null;
  const c = focus.category ? categoryById(focus.category) : null;
  return (
    <Card>
      {level === "sector" && (
        <>
          <h2 className="font-serif-display text-[22px] leading-tight">Relevant to whom?</h2>
          <p className="mt-2.5 text-[14px] leading-[1.65]" style={{ color: "#55524B" }}>
            Every map of software picks one definition of relevance and hides it. This one refuses to pick — the same
            board, drawn four times, under four incompatible definitions of what makes something matter.
          </p>
          <p className="mt-3 text-[14px] leading-[1.65]" style={{ color: "#55524B" }}>
            Ten sectors. Open one to see its categories, open a category to see its vendors. The organising claim is
            that the same handful of archetypes recur everywhere: legal has its compound platform and its connective
            layer just as employment does.
          </p>
          <p className="mt-3 border-t pt-3 text-[12.5px] leading-relaxed" style={{ borderColor: "#EFEDE6", color: "#8C8A82" }}>
            Positions are editorial judgements, not measurements. {BOARD_STATS.handRead} vendors were read
            individually; the rest are placed by archetype and shown dashed.
          </p>
        </>
      )}
      {level === "category" && s && (
        <>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: s.accent }} />
            <h2 className="text-[18px] font-semibold tracking-tight">{s.name}</h2>
          </div>
          <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: "#55524B" }}>{s.blurb}</p>
          <div className="mt-3.5 border-t pt-3.5" style={{ borderColor: "#EFEDE6" }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#A8A59C" }}>What this sector is a fight about</div>
            <p className="mt-1.5 text-[14px] leading-[1.62]">{s.thesis}</p>
          </div>
        </>
      )}
      {level === "vendor" && c && (
        <>
          <h2 className="text-[18px] font-semibold tracking-tight">{c.name}</h2>
          <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: "#55524B" }}>{c.blurb}</p>
          <div className="mt-3.5 border-t pt-3.5" style={{ borderColor: "#EFEDE6" }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "#A8A59C" }}>Dominant shape</div>
            <p className="mt-1.5 text-[14px]">{c.shape}</p>
            <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: "#8C8A82" }}>
              Pick a vendor to read its bet.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

function Detail({ n, lensId }: { n: Node; lensId: LensId }) {
  const s = sectorById(n.sector);
  return (
    <div className="rounded-xl border" style={{ borderColor: "#E7E5DE", background: "#FFF" }}>
      <div className="border-b p-5" style={{ borderColor: "#EFEDE6" }}>
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: tint(n) }} />
          <h2 className="text-[19px] font-semibold tracking-tight">{n.name}</h2>
        </div>
        <p className="mt-1 text-[11.5px] uppercase tracking-wide" style={{ color: "#A8A59C" }}>
          {n.archetype}{n.geo ? ` · ${n.geo}` : ""} · {s?.name}
        </p>
        <p className="mt-2.5 text-[14px] leading-[1.62]">{n.blurb}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b px-5 py-3" style={{ borderColor: "#EFEDE6" }}>
        <span className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ background: n.handRead ? "#EAF3EE" : "#F2F0EA", color: n.handRead ? "#0E7C5A" : "#8C8A82" }}>
          {n.handRead ? "Read individually" : "Placed by archetype"}
        </span>
        {n.deep && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#FBF1D2", color: "#8A6A00" }}>Deep read</span>}
        {n.instance && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#EDE7FB", color: "#5A3FB0" }}>Playable study</span>}
      </div>

      <div className="space-y-2 p-5">
        {n.instance && (
          <Link href={n.instance}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-[13.5px] font-bold transition"
            style={{ background: "#1A1A18", color: "#F5C518" }}>
            Open the {n.name} study <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        )}
        {n.href && (
          <Link href={n.href}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-[13.5px] font-semibold transition hover:bg-black/[0.03]"
            style={{ borderColor: "#DDD9CE", color: "#1A1A18" }}>
            Read the full position <I.IArrow className="h-3.5 w-3.5" />
          </Link>
        )}
        {!n.instance && !n.href && (
          <p className="text-[13px] leading-relaxed" style={{ color: "#8C8A82" }}>
            No deep read yet. This vendor is on the board because its bet is distinct, not because it has been
            researched individually — the dashed outline says so on the plot.
          </p>
        )}
      </div>
    </div>
  );
}
