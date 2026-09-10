"use client";

import { useMemo, useState } from "react";
import { DEPARTMENTS, COMPANY } from "@/lib/data/company";
import { APPS } from "@/lib/data/systems";
import { fmt } from "@/lib/data/finance";
import { Badge } from "./ui";
import * as I from "./icons";

const BUNDLES: Record<string, string[]> = {
  eng: ["a-06", "a-08", "a-10", "a-20", "a-25"],
  hw: ["a-17", "a-18", "a-27", "a-23"],
  gtm: ["a-14", "a-15", "a-26", "a-24"],
  ops: ["a-16", "a-23"],
  fin: ["a-05", "a-07", "a-12"],
  peo: ["a-04", "a-13"],
  leg: ["a-11", "a-21"],
  exec: ["a-09", "a-11", "a-12"],
};
const BASELINE = ["a-01", "a-02", "a-03", "a-19", "a-13"];

const LEVELS = [
  { id: "IC3", label: "IC3 · Mid", limit: 5000 },
  { id: "IC5", label: "IC5 · Senior", limit: 8000 },
  { id: "M3", label: "M3 · Manager", limit: 15000 },
  { id: "M5", label: "M5 · Director", limit: 25000 },
];

const JURIS: Record<string, { registered: boolean; note: string; extras: string[] }> = {
  us: { registered: true, note: "Registered in 14 states. Colorado added 3 days ago.", extras: ["Form I-9 within 3 business days", "State-specific harassment training", "ACA eligibility tracking begins"] },
  ca: { registered: true, note: "Ontario and BC registered. CRA payroll account active.", extras: ["ROE obligations on separation", "Provincial health premium", "Statutory holiday schedule by province"] },
  de: { registered: true, note: "GmbH active. Works council consultation required above 20 hires/yr.", extras: ["Statutory notice period from tenure", "Sozialversicherung registration", "Arbeitsvertrag in German, countersigned"] },
  "eor-uk": { registered: true, note: "EOR partner holds the employment relationship.", extras: ["Right to work check before start", "Auto-enrolment pension after 3 months", "Statutory sick pay schedule"] },
  "eor-in": { registered: true, note: "EOR partner. Karnataka registration active.", extras: ["PF and ESI registration", "Gratuity accrual from day one", "Professional tax by state"] },
  contractor: { registered: false, note: "No entity. Classification test runs before the agreement is generated.", extras: ["Classification questionnaire (6 factors)", "IP assignment in local law", "No benefits eligibility — enforced, not advised"] },
};

export function HireFlow() {
  const [dept, setDept] = useState("eng");
  const [entity, setEntity] = useState("us");
  const [level, setLevel] = useState("IC5");
  const [name, setName] = useState("");
  const [state, setState] = useState("California");

  const jur = JURIS[entity];
  const apps = useMemo(() => [...BASELINE, ...(BUNDLES[dept] ?? [])], [dept]);
  const lvl = LEVELS.find((l) => l.id === level)!;
  const isContractor = entity === "contractor";
  const newState = state === "Colorado";

  const provisioned = [
    { sys: "Payroll", icon: "payroll", d: `Enrolled in ${entity === "de" ? "DE Monthly" : entity.startsWith("eor") ? "Global Monthly" : "US Semi-monthly"} · cost center ${dept.toUpperCase()}-${entity.toUpperCase().replace("EOR-", "")}`, on: true },
    { sys: "Benefits", icon: "benefits", d: isContractor ? "Not eligible — the election screen does not render for this worker type" : "30-day election window opens, plans filtered by jurisdiction", on: !isContractor },
    { sys: "Device", icon: "device", d: `${dept === "hw" ? "Dell Precision 7680" : 'MacBook Pro 16" M4 Pro'} · shipped to arrive 2 days before start, pre-enrolled in MDM`, on: true },
    { sys: "App access", icon: "apps", d: `${apps.length} entitlements from baseline + ${DEPARTMENTS.find((d) => d.id === dept)?.name} bundle`, on: true },
    { sys: "Spend", icon: "card", d: isContractor ? "No card — contractor policy has no issuance path" : `Virtual card, ${fmt(lvl.limit)} monthly limit from level`, on: !isContractor },
    { sys: "Identity", icon: "lock", d: "SSO account, group membership, manager relationship written to the directory", on: true },
    { sys: "Compliance", icon: "shield", d: `${jur.extras.length} jurisdiction-specific obligations assigned`, on: true },
  ];

  const ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
    payroll: I.IPayroll, benefits: I.IBenefits, device: I.IDevice, apps: I.IApps,
    card: I.ICard, lock: I.ILock, shield: I.IShield,
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Form */}
      <div className="rounded-lg border border-ink-200 bg-white shadow-card">
        <div className="border-b border-ink-100 px-4 py-3">
          <h3 className="text-[13.5px] font-semibold text-ink">New hire</h3>
          <p className="mt-0.5 text-[12px] text-ink-500">One form. Seven products read from it the moment it's saved.</p>
        </div>
        <div className="space-y-3.5 p-4">
          <Field label="Full name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tobias Mensah"
              className="h-9 w-full rounded-md border border-ink-200 px-2.5 text-[13px] placeholder:text-ink-400 focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25" />
          </Field>

          <Field label="Employment through" hint="Determines the whole downstream shape of the record">
            <select value={entity} onChange={(e) => setEntity(e.target.value)}
              className="h-9 w-full rounded-md border border-ink-200 bg-white px-2 text-[13px] focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25">
              {COMPANY.entities.map((en) => <option key={en.id} value={en.id}>{en.name} — {en.type}</option>)}
            </select>
          </Field>

          {entity === "us" && (
            <Field label="Work state">
              <select value={state} onChange={(e) => setState(e.target.value)}
                className="h-9 w-full rounded-md border border-ink-200 bg-white px-2 text-[13px] focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25">
                {["California", "Texas", "New York", "Colorado"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <select value={dept} onChange={(e) => setDept(e.target.value)}
                className="h-9 w-full rounded-md border border-ink-200 bg-white px-2 text-[13px] focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25">
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Level">
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="h-9 w-full rounded-md border border-ink-200 bg-white px-2 text-[13px] focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25">
                {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </Field>
          </div>

          <div className={`rounded-md p-3 text-[12.5px] leading-relaxed ring-1 ${newState ? "bg-signal-100 text-ink-700 ring-signal-300" : "bg-ink-50 text-ink-600 ring-ink-200"}`}>
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-ink">
              {newState ? <I.IAlert className="h-3.5 w-3.5 text-signal-600" /> : <I.ICheck className="h-3.5 w-3.5 text-moss" />}
              {newState ? "Colorado registration opened automatically" : "Jurisdiction cleared"}
            </div>
            {newState
              ? "This entity was not registered in Colorado. The hire is blocked until the filing clears — this is not a warning you can click past. Estimated 2 business days."
              : jur.note}
            <ul className="mt-2 space-y-1">
              {jur.extras.map((x) => (
                <li key={x} className="flex items-start gap-1.5 text-[12px] text-ink-500">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-300" />{x}
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled={newState}
            className={`h-9 w-full rounded-md text-[13px] font-semibold transition ${
              newState ? "cursor-not-allowed bg-ink-100 text-ink-400" : "bg-ink text-white hover:bg-ink-800"
            }`}
          >
            {newState ? "Blocked — registration in progress" : `Create record${name ? ` for ${name.split(" ")[0]}` : ""}`}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-ink-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          <div>
            <h3 className="text-[13.5px] font-semibold text-ink">What this write produces</h3>
            <p className="mt-0.5 text-[12px] text-ink-500">Live — it recalculates as you change the form</p>
          </div>
          <Badge tone="dark">{provisioned.filter((p) => p.on).length} systems</Badge>
        </div>

        <ul className="divide-y divide-ink-100">
          {provisioned.map((p) => {
            const Icon = ICONS[p.icon];
            return (
              <li key={p.sys} className={`flex items-start gap-2.5 px-4 py-2.5 ${p.on ? "" : "bg-ink-50/60"}`}>
                <span className={`mt-px grid h-6 w-6 shrink-0 place-items-center rounded-md ${p.on ? "bg-moss-100 text-moss" : "bg-ink-100 text-ink-400"}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[13px] font-medium ${p.on ? "text-ink" : "text-ink-400"}`}>{p.sys}</div>
                  <div className="mt-0.5 text-[12px] leading-snug text-ink-500">{p.d}</div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-ink-100 px-4 py-3">
          <div className="mb-2 text-2xs font-bold uppercase tracking-wider text-ink-400">
            App entitlements ({apps.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {apps.map((a) => {
              const app = APPS.find((x) => x.id === a);
              const isBundle = !BASELINE.includes(a);
              return (
                <span key={a} className={`rounded px-1.5 py-0.5 text-[11.5px] ring-1 ring-inset ${isBundle ? "bg-signal-100 text-ink-700 ring-signal-300" : "bg-ink-50 text-ink-600 ring-ink-200"}`}>
                  {app?.name}
                </span>
              );
            })}
          </div>
          <p className="mt-2.5 text-[11.5px] leading-snug text-ink-400">
            Yellow entitlements come from the department bundle and change the instant you change the department —
            here, and for every person already employed.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-ink-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-ink-400">{hint}</span>}
    </label>
  );
}
