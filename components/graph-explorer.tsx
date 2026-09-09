"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EMPLOYEES } from "@/lib/data/employees";
import { APPS, DEVICES } from "@/lib/data/systems";
import { SPEND, fmt } from "@/lib/data/finance";
import { COMPANY, DEPARTMENTS } from "@/lib/data/company";
import { Badge, Avatar } from "./ui";
import * as I from "./icons";

type Col = { k: string; label: string; align?: "right" };
type Row = Record<string, string | number>;

interface Query {
  id: string; label: string; domains: string[]; q: string; note: string;
  cols: Col[]; run: () => Row[];
}

const dept = (id: string) => DEPARTMENTS.find((d) => d.id === id)?.name ?? id;
const ent = (id: string) => COMPANY.entities.find((e) => e.id === id)?.name ?? id;

const QUERIES: Query[] = [
  {
    id: "q1", label: "Non-compliant devices, by entity",
    domains: ["People", "Devices"],
    q: "employees ⋈ devices\n  where device.compliance < 100\n  select person, entity, device, failing_check",
    note: "Two domains. In a best-of-breed stack the MDM knows the device and the HRIS knows the entity, and joining them is a quarterly CSV.",
    cols: [{ k: "person", label: "Person" }, { k: "entity", label: "Entity" }, { k: "device", label: "Device" }, { k: "compliance", label: "Compliance", align: "right" }],
    run: () => DEVICES.filter((d) => d.compliance < 100 && d.assignedTo).map((d) => {
      const p = EMPLOYEES.find((e) => e.id === d.assignedTo)!;
      return { id: p.id, person: p.name, entity: ent(p.entity), device: d.model, compliance: `${d.compliance}%` };
    }),
  },
  {
    id: "q2", label: "Contractors holding high-risk app access",
    domains: ["People", "Apps", "Compliance"],
    q: "employees ⋈ app_grants\n  where worker_type = 'Contractor'\n    and app.risk = 'High'\n  select person, country, app, provisioning",
    note: "This is a classification-risk question that lives across three products. It is the kind of query an auditor asks and nobody can answer quickly.",
    cols: [{ k: "person", label: "Person" }, { k: "country", label: "Country" }, { k: "app", label: "Application" }, { k: "prov", label: "Provisioning" }],
    run: () => EMPLOYEES.filter((e) => e.type === "Contractor").flatMap((e) =>
      e.apps.map((a) => APPS.find((x) => x.id === a)!).filter((a) => a && a.risk === "High")
        .map((a) => ({ id: e.id, person: e.name, country: e.country, app: a.name, prov: a.provisioning }))
    ),
  },
  {
    id: "q3", label: "Fully-loaded cost by department and entity",
    domains: ["People", "Payroll", "Benefits"],
    q: "employees ⋈ comp ⋈ benefits\n  group by department, entity\n  select headcount, base_total, loaded_total",
    note: "Loading factors differ by country because statutory employer contributions do. That is configuration in the country layer, not a spreadsheet tab.",
    cols: [{ k: "dept", label: "Department" }, { k: "entity", label: "Entity" }, { k: "n", label: "People", align: "right" }, { k: "loaded", label: "Loaded cost", align: "right" }],
    run: () => {
      const LOAD: Record<string, number> = { us: 1.28, ca: 1.24, de: 1.42, "eor-uk": 1.31, "eor-in": 1.19, contractor: 1.0 };
      const FX: Record<string, number> = { USD: 1, CAD: 0.73, EUR: 1.08, GBP: 1.27, INR: 0.012 };
      const m = new Map<string, { n: number; total: number; d: string; e: string }>();
      EMPLOYEES.forEach((e) => {
        const k = `${e.dept}|${e.entity}`;
        const usd = e.salary * (FX[e.currency] ?? 1) * (LOAD[e.entity] ?? 1);
        const cur = m.get(k) ?? { n: 0, total: 0, d: dept(e.dept), e: ent(e.entity) };
        m.set(k, { ...cur, n: cur.n + 1, total: cur.total + usd });
      });
      return [...m.values()].sort((a, b) => b.total - a.total).slice(0, 12)
        .map((v, i) => ({ id: `r${i}`, dept: v.d, entity: v.e, n: v.n, loaded: fmt(Math.round(v.total)) }));
    },
  },
  {
    id: "q4", label: "Manual-provisioned apps held by leavers",
    domains: ["People", "Apps", "Identity"],
    q: "employees ⋈ app_grants\n  where status = 'Offboarding'\n    and app.provisioning = 'Manual'\n  select person, app, revocation_path",
    note: "Every manual row here is a seam we still own. This report exists so the number is embarrassing rather than invisible.",
    cols: [{ k: "person", label: "Person" }, { k: "app", label: "Application" }, { k: "risk", label: "Data risk" }, { k: "path", label: "Revocation" }],
    run: () => EMPLOYEES.filter((e) => e.status === "Offboarding").flatMap((e) =>
      e.apps.map((a) => APPS.find((x) => x.id === a)!).filter((a) => a && a.provisioning === "Manual")
        .map((a) => ({ id: e.id, person: e.name, app: a.name, risk: a.risk, path: "Ticket to app owner" }))
    ),
  },
  {
    id: "q5", label: "Spend by person, joined to cost center",
    domains: ["People", "Spend", "Payroll"],
    q: "transactions ⋈ employees\n  select merchant, person, cost_center, amount, policy",
    note: "The GL code is derived from the employee's cost center at the moment of the swipe. Change their department and next month's coding follows automatically.",
    cols: [{ k: "merchant", label: "Merchant" }, { k: "person", label: "Person" }, { k: "cc", label: "Cost center" }, { k: "amount", label: "Amount", align: "right" }],
    run: () => SPEND.map((s) => {
      const p = EMPLOYEES.find((e) => e.id === s.employee)!;
      return { id: s.id, merchant: s.merchant, person: p.name, cc: p.costCenter, amount: fmt(s.amount, s.currency) };
    }),
  },
];

const AS_OF = ["Today · 9 Sep 2026", "1 Jan 2026", "31 Dec 2025", "1 Jul 2025"];

export function GraphExplorer() {
  const [qid, setQid] = useState("q1");
  const [asOf, setAsOf] = useState(0);
  const query = QUERIES.find((q) => q.id === qid)!;
  const rows = useMemo(() => query.run(), [query]);
  const historical = asOf > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {QUERIES.map((q) => (
          <button key={q.id} onClick={() => setQid(q.id)}
            className={`rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition ${
              q.id === qid ? "bg-ink text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
            }`}>
            {q.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/70 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-ink-400">Domains joined</span>
            {query.domains.map((d) => <Badge key={d} tone="dark">{d}</Badge>)}
          </div>
          <label className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-ink-400">As of</span>
            <select value={asOf} onChange={(e) => setAsOf(Number(e.target.value))}
              className="h-7 rounded-md border border-ink-200 bg-white px-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-signal/25">
              {AS_OF.map((a, i) => <option key={a} value={i}>{a}</option>)}
            </select>
          </label>
        </div>

        <pre className="overflow-x-auto thin-scroll border-b border-ink-100 bg-ink px-4 py-3 font-mono text-[12px] leading-relaxed text-ink-200">
          <code>
            {query.q}
            {historical && <span className="text-signal">{"\n  as of " + AS_OF[asOf]}</span>}
          </code>
        </pre>

        {historical ? (
          <div className="px-4 py-10 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-signal-100 text-signal-600">
              <I.IClock className="h-5 w-5" />
            </div>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ink-600">
              The same query, resolved against the state of the graph on{" "}
              <span className="font-medium text-ink">{AS_OF[asOf].replace("Today · ", "")}</span>. Every fact carries a
              validity window, so any read can specify a date.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-ink-400">
              Four engineer-months in 2017 for a feature no customer had asked for. It is now load-bearing for payroll
              amendments, benefits reconciliation, equity and every audit conversation we have.
            </p>
            <button onClick={() => setAsOf(0)} className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-[12.5px] font-medium text-ink-700 hover:bg-ink-50">
              Back to today
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto thin-scroll">
            <table className="tbl min-w-[640px]">
              <thead><tr className="bg-white">
                {query.cols.map((c) => (
                  <th key={c.k} className={`pt-3 ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>
                ))}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={String(r.id) + i}>
                    {query.cols.map((c, ci) => (
                      <td key={c.k} className={`${c.align === "right" ? "num text-right font-medium text-ink" : "text-ink-600"}`}>
                        {ci === 0 && String(r.id).startsWith("e-") ? (
                          <Link href={`/app/people/${r.id}`} className="flex items-center gap-2 font-medium text-ink hover:underline">
                            <Avatar name={String(r[c.k])} size={22} />{String(r[c.k])}
                          </Link>
                        ) : String(r[c.k])}
                      </td>
                    ))}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={query.cols.length} className="py-10 text-center text-[13px] text-ink-400">
                    No rows — which is the answer you want for this one.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
          <span className="font-medium text-ink">{rows.length} rows · {query.domains.length} domains.</span>{" "}
          {query.note}
        </p>
      </div>
    </div>
  );
}
