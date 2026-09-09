import Link from "next/link";
import * as I from "./icons";

export function PageHeader({
  eyebrow, title, sub, actions,
}: { eyebrow?: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink-200 bg-white px-5 py-4 sm:px-7">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-2xs font-bold uppercase tracking-wider text-ink-400">{eyebrow}</div>
        )}
        <h1 className="text-[21px] font-semibold tracking-tight text-ink">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-500">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Btn({
  children, variant = "secondary", href, className = "",
}: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; href?: string; className?: string }) {
  const base =
    "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-medium transition whitespace-nowrap";
  const v = {
    primary: "bg-ink text-white hover:bg-ink-800",
    secondary: "border border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50",
    ghost: "text-ink-600 hover:bg-ink-100",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  return href ? <Link href={href} className={cls}>{children}</Link> : <button className={cls}>{children}</button>;
}

export function Card({ children, className = "", pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-lg border border-ink-200 bg-white shadow-card ${pad ? "p-4" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-4 py-3">
      <div>
        <h3 className="text-[13.5px] font-semibold text-ink">{title}</h3>
        {sub && <p className="mt-0.5 text-[12px] text-ink-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const TONES = {
  neutral: "bg-ink-100 text-ink-600 ring-ink-200",
  good: "bg-moss-100 text-moss ring-moss/20",
  warn: "bg-signal-100 text-signal-600 ring-signal-300",
  bad: "bg-clay-100 text-clay ring-clay/20",
  info: "bg-sky-100 text-sky ring-sky/20",
  dark: "bg-ink text-white ring-ink",
} as const;

export function Badge({
  children, tone = "neutral", dot = false,
}: { children: React.ReactNode; tone?: keyof typeof TONES; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium ring-1 ring-inset ${TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function Stat({
  label, value, sub, tone = "neutral", icon,
}: { label: string; value: string; sub?: string; tone?: "neutral" | "good" | "warn" | "bad"; icon?: React.ReactNode }) {
  const c = { neutral: "text-ink", good: "text-moss", warn: "text-signal-600", bad: "text-clay" }[tone];
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-3.5 shadow-card">
      <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-500">
        {icon}
        {label}
      </div>
      <div className={`num mt-1.5 text-[22px] font-semibold leading-none tracking-tight ${c}`}>{value}</div>
      {sub && <div className="mt-1.5 text-[11.5px] leading-tight text-ink-400">{sub}</div>}
    </div>
  );
}

export function Avatar({ name, size = 28, tone = "ink" }: { name: string; size?: number; tone?: "ink" | "signal" | "sky" | "moss" | "clay" }) {
  const init = name.split(" ").slice(0, 2).map((p) => p[0]).join("");
  const bg = { ink: "bg-ink-700 text-white", signal: "bg-signal text-ink", sky: "bg-sky text-white", moss: "bg-moss text-white", clay: "bg-clay text-white" }[tone];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {init}
    </span>
  );
}

export function Empty({ title, body, note }: { title: string; body: string; note?: string }) {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-ink-100 text-ink-400">
        <I.ILayers className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-[16px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{body}</p>
      {note && (
        <p className="mx-auto mt-5 max-w-md rounded-lg bg-signal-100 px-4 py-3 text-left text-[12.5px] leading-relaxed text-ink-700 ring-1 ring-signal-300">
          <span className="font-semibold">Why it's a stub: </span>
          {note}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <Btn href="/app/people" variant="primary">Go to People</Btn>
        <Btn href="/backstage">Read the thinking</Btn>
      </div>
    </div>
  );
}

export function Sparkline({ data, tone = "ink", h = 28, w = 96 }: { data: number[]; tone?: string; h?: number; w?: number }) {
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / span) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={tone} />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / span) * (h - 4) - 2} r="2.2" fill="currentColor" className={tone} />
    </svg>
  );
}
