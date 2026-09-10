"use client";

import Link from "next/link";
import { XNOTES, KIND_META, type NoteKind } from "@/lib/content/xray";
import { useXRay } from "./xray-provider";

const TONE: Record<NoteKind, { bar: string; chip: string; text: string }> = {
  premise: { bar: "bg-signal", chip: "bg-signal-100 text-ink-700 ring-signal-300", text: "text-ink" },
  mechanism: { bar: "bg-sky", chip: "bg-sky-100 text-sky ring-sky/25", text: "text-ink" },
  tradeoff: { bar: "bg-clay", chip: "bg-clay-100 text-clay ring-clay/25", text: "text-ink" },
  heresy: { bar: "bg-moss", chip: "bg-moss-100 text-moss ring-moss/25", text: "text-ink" },
  cost: { bar: "bg-ink-600", chip: "bg-ink-100 text-ink-700 ring-ink-300", text: "text-ink" },
};

export function XRay({ id, children }: { id: string; children: React.ReactNode }) {
  const { on } = useXRay();
  const note = XNOTES[id];
  if (!note) return <>{children}</>;

  return (
    <div className="relative min-w-0">
      <div className="min-w-0" data-xr={on ? id : undefined}>{children}</div>
      {on && <XNoteCard id={id} />}
    </div>
  );
}

export function XNoteCard({ id, standalone = false }: { id: string; standalone?: boolean }) {
  const note = XNOTES[id];
  if (!note) return null;
  const tone = TONE[note.kind];
  const meta = KIND_META[note.kind];

  return (
    <aside
      className={`animate-fadeUp relative overflow-hidden rounded-lg bg-white shadow-pop ring-1 ring-ink-200 ${
        standalone ? "" : "mt-4 mb-2"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-[3px] ${tone.bar}`} />
      <div className="py-3.5 pl-5 pr-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-2xs font-semibold uppercase ring-1 ${tone.chip}`}>
            {meta.label}
          </span>
          <span className="text-2xs font-medium uppercase tracking-wider text-ink-400">Founder annotation</span>
        </div>
        <h4 className="text-[14.5px] font-semibold leading-snug text-ink">{note.title}</h4>
        <p className="prose-measure mt-1.5 text-[13.5px] leading-[1.62] text-ink-600">{note.body}</p>
        {note.aside && (
          <p className="prose-measure mt-2.5 border-l-2 border-ink-200 pl-3 text-[12.5px] italic leading-[1.6] text-ink-500">
            {note.aside}
          </p>
        )}
        {note.ref && (
          <Link
            href={note.ref.href}
            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-700 underline decoration-signal decoration-2 underline-offset-[3px] hover:text-ink"
          >
            {note.ref.label}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
