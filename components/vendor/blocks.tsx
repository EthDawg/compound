"use client";

import type { Block, Theme } from "@/lib/vendors/types";
import * as I from "../icons";

const TONE = (t: Theme, k?: "good" | "warn" | "bad") =>
  k === "good" ? "#0E7C5A" : k === "warn" ? "#B4441F" : k === "bad" ? "#C8102E" : t.ink;

export function Blocks({ blocks, t }: { blocks: Block[]; t: Theme }) {
  return <div className="space-y-4">{blocks.map((b, i) => <Blk key={i} b={b} t={t} />)}</div>;
}

function Card({ t, children, pad = true }: { t: Theme; children: React.ReactNode; pad?: boolean }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius }}
      className={pad ? "p-4" : ""}>
      {children}
    </div>
  );
}

function Head({ t, title, sub }: { t: Theme; title: string; sub?: string }) {
  return (
    <div style={{ borderBottom: `1px solid ${t.border}` }} className="px-4 py-3">
      <h3 style={{ color: t.ink }} className="text-[13.5px] font-semibold">{title}</h3>
      {sub && <p style={{ color: t.inkMuted }} className="mt-0.5 text-[12px]">{sub}</p>}
    </div>
  );
}

function Blk({ b, t }: { b: Block; t: Theme }) {
  const pad = t.density === "tight" ? "py-2" : t.density === "roomy" ? "py-3.5" : "py-3";

  switch (b.t) {
    case "stats":
      return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {b.items.map((s) => (
            <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius }} className="p-3.5">
              <div style={{ color: t.inkMuted }} className="text-[11.5px] font-medium">{s.label}</div>
              <div style={{ color: TONE(t, s.tone) }} className="mt-1.5 text-[22px] font-semibold leading-none tracking-tight tabular-nums">{s.value}</div>
              {s.sub && <div style={{ color: t.inkFaint }} className="mt-1.5 text-[11.5px] leading-tight">{s.sub}</div>}
            </div>
          ))}
        </div>
      );

    case "worklets":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} />
          <div className="grid grid-cols-2 gap-px p-px sm:grid-cols-4" style={{ background: t.border }}>
            {b.items.map((w) => (
              <button key={w.label} style={{ background: t.surface }} className="flex flex-col items-center gap-2 px-3 py-5 text-center transition hover:opacity-80">
                <span style={{ background: t.accentSoft, color: t.accent, borderRadius: "50%" }} className="grid h-11 w-11 place-items-center">
                  <I.ILayers className="h-5 w-5" />
                </span>
                <span style={{ color: t.ink }} className="text-[12px] font-medium leading-tight">{w.label}</span>
                {w.count && <span style={{ color: t.accent }} className="text-[11px] font-bold tabular-nums">{w.count}</span>}
              </button>
            ))}
          </div>
        </Card>
      );

    case "countries":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} sub={b.sub} />
          <ul>
            {b.items.map((c, i) => (
              <li key={c.code} className={`flex items-center gap-3 px-4 ${pad}`}
                style={{ borderTop: i ? `1px solid ${t.border}` : undefined }}>
                <span style={{ background: t.accentSoft, color: t.accent, borderRadius: t.radiusSm }}
                  className="grid h-8 w-9 shrink-0 place-items-center text-[11px] font-bold">{c.code}</span>
                <span className="min-w-0 flex-1">
                  <span style={{ color: t.ink }} className="block truncate text-[13.5px] font-medium">{c.name}</span>
                  <span style={{ color: t.inkMuted }} className="block truncate text-[12px]">{c.kind}</span>
                </span>
                <span style={{ color: t.ink }} className="shrink-0 text-[13px] font-semibold tabular-nums">{c.people}</span>
                <span style={{ color: c.status === "Compliant" ? "#0E7C5A" : "#B4441F" }}
                  className="hidden shrink-0 text-[11.5px] sm:block">{c.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      );

    case "connections":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} sub={b.sub} />
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr>{["provider", "type", "records", "last_synced"].map((h) => (
                  <th key={h} style={{ color: t.inkFaint, borderBottom: `1px solid ${t.border}` }}
                    className="px-4 py-2 text-left text-[11px] font-normal">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {b.items.map((c) => (
                  <tr key={c.provider}>
                    <td style={{ color: t.ink, borderTop: `1px solid ${t.border}` }} className="px-4 py-2.5 text-[12.5px]">{c.provider}</td>
                    <td style={{ color: t.inkMuted, borderTop: `1px solid ${t.border}` }} className="px-4 py-2.5 text-[12px]">{c.kind}</td>
                    <td style={{ color: t.inkMuted, borderTop: `1px solid ${t.border}` }} className="px-4 py-2.5 text-[12px] tabular-nums">{c.records}</td>
                    <td style={{ borderTop: `1px solid ${t.border}` }} className="px-4 py-2.5">
                      <span style={{ color: c.stale ? "#E5734F" : t.accent }} className="text-[12px] font-semibold">
                        {c.stale ? "⚠ " : "● "}{c.synced}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );

    case "runs":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} sub={b.sub} />
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr style={{ background: t.surfaceAlt }}>{["Period", "Company", "Emp", "Status", "Filing"].map((h) => (
                  <th key={h} style={{ color: t.inkMuted, borderBottom: `1px solid ${t.border}` }}
                    className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {b.items.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: t.ink, borderTop: `1px solid ${t.border}` }} className="px-4 py-2 text-[12.5px] font-medium">{r.period}</td>
                    <td style={{ color: t.inkMuted, borderTop: `1px solid ${t.border}` }} className="px-4 py-2 text-[12.5px]">{r.entity}</td>
                    <td style={{ color: t.inkMuted, borderTop: `1px solid ${t.border}` }} className="px-4 py-2 text-[12.5px] tabular-nums">{r.people}</td>
                    <td style={{ borderTop: `1px solid ${t.border}` }} className="px-4 py-2">
                      <span style={{
                        background: r.status === "Paid" ? "#E8F3EE" : t.accentSoft,
                        color: r.status === "Paid" ? "#0E7C5A" : t.accent, borderRadius: t.radiusSm,
                      }} className="px-1.5 py-0.5 text-[11px] font-semibold">{r.status}</span>
                    </td>
                    <td style={{ color: t.inkFaint, borderTop: `1px solid ${t.border}` }} className="px-4 py-2 text-[12px]">{r.filed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );

    case "table":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} sub={b.sub} />
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr style={{ background: t.surfaceAlt }}>{b.cols.map((h) => (
                  <th key={h} style={{ color: t.inkMuted, borderBottom: `1px solid ${t.border}` }}
                    className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j} style={{ color: j === 0 ? t.ink : t.inkMuted, borderTop: `1px solid ${t.border}` }}
                        className={`px-4 py-2.5 text-[12.5px] ${j === 0 ? "font-medium" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );

    case "queue":
      return (
        <Card t={t} pad={false}>
          <Head t={t} title={b.title} sub={b.sub} />
          <ul>
            {b.items.map((q, i) => (
              <li key={i} className={`flex items-start gap-3 px-4 ${pad}`} style={{ borderTop: i ? `1px solid ${t.border}` : undefined }}>
                <span style={{ background: t.accentSoft, color: t.accent, borderRadius: t.radiusSm }}
                  className="mt-0.5 shrink-0 px-1.5 py-0.5 text-[11px] font-semibold">{q.tag}</span>
                <span className="min-w-0 flex-1">
                  <span style={{ color: t.ink }} className="block text-[13.5px] font-medium leading-snug">{q.title}</span>
                  <span style={{ color: t.inkMuted }} className="mt-0.5 block text-[12.5px] leading-snug">{q.detail}</span>
                </span>
                <span style={{ color: t.inkFaint }} className="shrink-0 text-[11.5px]">{q.meta}</span>
              </li>
            ))}
          </ul>
        </Card>
      );

    case "callout":
      return (
        <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}33`, borderRadius: t.radius }} className="p-4">
          <div style={{ color: t.accent }} className="text-[11px] font-bold uppercase tracking-wider">{b.label}</div>
          <p style={{ color: t.ink }} className="prose-measure mt-1.5 text-[13.5px] leading-[1.62]">{b.body}</p>
        </div>
      );

    default:
      return null;
  }
}
