"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EMPLOYEES, type Employee } from "@/lib/data/employees";
import { DEPARTMENTS, COMPANY } from "@/lib/data/company";
import { Avatar, Badge } from "./ui";
import { XRay } from "./xray";
import * as I from "./icons";

const STATUS_TONE = { Active: "good", Onboarding: "info", "On leave": "warn", Offboarding: "bad" } as const;
const TYPE_TONE = { "Full-time": "neutral", "Part-time": "neutral", Contractor: "warn", EOR: "info" } as const;

export function PeopleTable() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [entity, setEntity] = useState("all");
  const [type, setType] = useState("all");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return EMPLOYEES.filter((e) => {
      if (dept !== "all" && e.dept !== dept) return false;
      if (entity !== "all" && e.entity !== entity) return false;
      if (type !== "all" && e.type !== type) return false;
      if (s && !(`${e.name} ${e.title} ${e.team} ${e.location}`.toLowerCase().includes(s))) return false;
      return true;
    });
  }, [q, dept, entity, type]);

  const reset = () => { setQ(""); setDept("all"); setEntity("all"); setType("all"); };
  const filtered = dept !== "all" || entity !== "all" || type !== "all" || q !== "";

  return (
    <div>
      <XRay id="people-filters">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <I.ISearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, title, team…"
              className="h-8 w-56 rounded-md border border-ink-200 bg-white pl-8 pr-3 text-[13px] placeholder:text-ink-400 focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25"
            />
          </div>
          <Sel value={dept} onChange={setDept} label="Department" opts={[["all", "All departments"], ...DEPARTMENTS.map((d) => [d.id, d.name] as [string, string])]} />
          <Sel value={entity} onChange={setEntity} label="Entity" opts={[["all", "All entities"], ...COMPANY.entities.map((e) => [e.id, e.name] as [string, string])]} />
          <Sel value={type} onChange={setType} label="Worker type" opts={[["all", "All worker types"], ["Full-time", "Full-time"], ["EOR", "EOR"], ["Contractor", "Contractor"]]} />
          {filtered && (
            <button onClick={reset} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[12.5px] font-medium text-ink-500 hover:bg-ink-100">
              <I.IClose className="h-3 w-3" /> Clear
            </button>
          )}
          <span className="num ml-auto text-[12.5px] text-ink-500">
            <span className="font-semibold text-ink">{rows.length}</span> of {EMPLOYEES.length}
          </span>
        </div>
      </XRay>

      <XRay id="people-table">
        <div className="mt-3 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card">
          <div className="overflow-x-auto thin-scroll">
            <table className="tbl min-w-[860px]">
              <thead><tr className="bg-ink-50/70">
                <th className="pt-3">Person</th><th className="pt-3">Department</th><th className="pt-3">Entity</th>
                <th className="pt-3">Location</th><th className="pt-3">Type</th><th className="pt-3">Status</th>
                <th className="pt-3 text-right">Devices</th><th className="pt-3 text-right">Apps</th><th className="pt-3">Started</th>
              </tr></thead>
              <tbody>
                {rows.map((e) => <Row key={e.id} e={e} />)}
                {rows.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-[13px] text-ink-400">
                    Nobody matches those filters.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </XRay>
    </div>
  );
}

function Row({ e }: { e: Employee }) {
  const dept = DEPARTMENTS.find((d) => d.id === e.dept);
  const ent = COMPANY.entities.find((x) => x.id === e.entity);
  return (
    <tr className="cursor-pointer">
      <td>
        <Link href={`/companies/rippling/app/people/${e.id}`} className="flex items-center gap-2.5">
          <Avatar name={e.name} size={30} tone={e.status === "Onboarding" ? "sky" : e.status === "Offboarding" ? "clay" : "ink"} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{e.name}</span>
            <span className="block truncate text-[12px] text-ink-500">{e.title}</span>
          </span>
        </Link>
      </td>
      <td className="text-ink-600">{dept?.name}<span className="block text-[11.5px] text-ink-400">{e.team}</span></td>
      <td className="text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded bg-ink-100 px-1 py-px font-mono text-[10px] font-bold text-ink-500">{ent?.flag}</span>
          <span className="text-[12.5px]">{ent?.type}</span>
        </span>
      </td>
      <td className="text-ink-600">{e.location}</td>
      <td><Badge tone={TYPE_TONE[e.type]}>{e.type}</Badge></td>
      <td><Badge tone={STATUS_TONE[e.status]} dot>{e.status}</Badge></td>
      <td className="num text-right text-ink-600">{e.devices.length || "—"}</td>
      <td className="num text-right text-ink-600">{e.apps.length || "—"}</td>
      <td className="num text-ink-500">{new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
    </tr>
  );
}

function Sel({ value, onChange, opts, label }: { value: string; onChange: (v: string) => void; opts: [string, string][]; label: string }) {
  return (
    <select
      aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-ink-200 bg-white px-2 text-[12.5px] text-ink-700 focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/25"
    >
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
