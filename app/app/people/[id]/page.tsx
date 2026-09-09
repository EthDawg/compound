import Link from "next/link";
import { notFound } from "next/navigation";
import { EMPLOYEES, byId, reportsOf, chainOf } from "@/lib/data/employees";
import { DEPARTMENTS, COMPANY } from "@/lib/data/company";
import { appById, deviceById } from "@/lib/data/systems";
import { SPEND, fmt } from "@/lib/data/finance";
import { Card, CardHead, Badge, Avatar, Btn } from "@/components/ui";
import { XRay } from "@/components/xray";
import * as I from "@/components/icons";

export function generateStaticParams() { return EMPLOYEES.map((e) => ({ id: e.id })); }

const STATUS_TONE = { Active: "good", Onboarding: "info", "On leave": "warn", Offboarding: "bad" } as const;

const READS = [
  { p: "Payroll", d: "Pay group, cost center, tax jurisdiction, effective-dated comp", i: "payroll" },
  { p: "Benefits", d: "Eligibility by country and entity, dependents, coverage tied to base", i: "benefits" },
  { p: "Devices", d: "Assignment, MDM enrollment, conditional access posture", i: "device" },
  { p: "App management", d: "Entitlements derived from department × level × entity", i: "apps" },
  { p: "Spend", d: "Card limits, category rules, computed approval chain", i: "card" },
  { p: "Time", d: "Accrual rate and statutory leave by jurisdiction", i: "time" },
  { p: "Identity", d: "SSO groups, directory metadata, manager relationship", i: "lock" },
  { p: "Learning", d: "Required training by role, country and data access level", i: "book" },
  { p: "Planning", d: "Fully-loaded cost in the headcount model", i: "report" },
];

const ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  payroll: I.IPayroll, benefits: I.IBenefits, device: I.IDevice, apps: I.IApps,
  card: I.ICard, time: I.ITime, lock: I.ILock, book: I.IBook, report: I.IReport,
};

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = byId(id);
  if (!e) notFound();

  const dept = DEPARTMENTS.find((d) => d.id === e.dept);
  const entity = COMPANY.entities.find((x) => x.id === e.entity);
  const manager = e.managerId ? byId(e.managerId) : null;
  const reports = reportsOf(e.id);
  const chain = chainOf(e.id).map(byId).filter(Boolean);
  const spend = SPEND.filter((s) => s.employee === e.id);
  const tenure = ((Date.now() - new Date(e.startDate).getTime()) / (365.25 * 864e5));

  const history = [
    { d: "2026-04-01", t: "Compensation", v: `Base increased to ${fmt(e.salary, e.currency)}`, k: "change" as const },
    { d: "2025-10-14", t: "Level", v: `Promoted to ${e.level}`, k: "change" as const },
    { d: "2025-03-02", t: "Manager", v: `Now reports to ${manager?.name ?? "—"}`, k: "change" as const },
    { d: "2024-08-19", t: "Location", v: `Work location set to ${e.location}`, k: "change" as const },
    { d: "2023-06-30", t: "Start date", v: "Corrected from 2023-07-01 (offer letter mismatch)", k: "correction" as const },
    { d: e.startDate, t: "Hired", v: `Joined as ${e.title}`, k: "change" as const },
  ].filter((h) => new Date(h.d) >= new Date(e.startDate));

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 pt-4 sm:px-7">
          <Link href="/app/people" className="inline-flex items-center gap-1 text-[12.5px] text-ink-500 hover:text-ink">
            <I.IChevron className="h-3 w-3 rotate-180" /> People
          </Link>
        </div>
        <XRay id="emp-record">
          <div className="mx-auto max-w-[1180px] px-5 pb-4 pt-3 sm:px-7">
            <div className="flex flex-wrap items-start gap-4">
              <Avatar name={e.name} size={56} tone={e.status === "Onboarding" ? "sky" : e.status === "Offboarding" ? "clay" : "ink"} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] font-semibold tracking-tight text-ink">{e.name}</h1>
                  <Badge tone={STATUS_TONE[e.status]} dot>{e.status}</Badge>
                  {e.type !== "Full-time" && <Badge tone={e.type === "EOR" ? "info" : "warn"}>{e.type}</Badge>}
                </div>
                <p className="mt-0.5 text-[14px] text-ink-600">
                  {e.title} · {dept?.name} · {e.team}
                </p>
                <p className="mt-1 text-[12.5px] text-ink-400">
                  {e.email} · {e.location} · {entity?.name} · started{" "}
                  {new Date(e.startDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  {e.status === "Active" && ` · ${tenure.toFixed(1)} yrs`}
                </p>
              </div>
              <div className="flex gap-2">
                <Btn><I.IFlow className="h-3.5 w-3.5" />Run workflow</Btn>
                <Btn variant="primary"><I.IBolt className="h-3.5 w-3.5 text-signal" />Edit record</Btn>
              </div>
            </div>
          </div>
        </XRay>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-5">
            {/* What reads this record */}
            <XRay id="emp-ripple">
              <Card pad={false}>
                <CardHead
                  title="What reads this record"
                  sub="Nine products. None of them keeps a copy."
                  right={<Badge tone="dark">{READS.length}</Badge>}
                />
                <ul className="grid gap-px bg-ink-100 sm:grid-cols-2">
                  {READS.map((r) => {
                    const Icon = ICONS[r.i];
                    return (
                      <li key={r.p} className="flex items-start gap-2.5 bg-white px-4 py-3">
                        <span className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink-50 text-ink-500">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-ink">{r.p}</div>
                          <div className="mt-0.5 text-[12px] leading-snug text-ink-500">{r.d}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] text-ink-500">
                  Change any field above and every row here is already correct. There is no sync, because there is no
                  second copy to make correct.
                </div>
              </Card>
            </XRay>

            {/* Employment + comp */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Card pad={false}>
                <CardHead title="Employment" />
                <dl className="divide-y divide-ink-100">
                  {[
                    ["Worker type", e.type], ["Legal entity", entity?.name ?? "—"], ["Country", e.country],
                    ["Pay group", e.payGroup], ["Cost center", e.costCenter], ["Level", e.level],
                    ["PTO balance", e.ptoBalance ? `${e.ptoBalance} days` : "n/a — contractor"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-3 px-4 py-2">
                      <dt className="w-28 shrink-0 text-[12px] text-ink-500">{k}</dt>
                      <dd className="text-[13px] text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <XRay id="emp-comp">
                <Card pad={false}>
                  <CardHead title="Compensation" right={<Badge tone="warn"><I.ILock className="h-3 w-3" />Restricted</Badge>} />
                  <dl className="divide-y divide-ink-100">
                    {[
                      ["Base", fmt(e.salary, e.currency)],
                      ["Currency", e.currency],
                      ["Equity", e.equity ? `${e.equity.toFixed(2)}%` : "None"],
                      ["Benefits", e.benefits ?? "Not eligible — contractor"],
                      ["Card limit", e.cardLimit ? fmt(e.cardLimit) : "No card"],
                      ["Spend policy", e.spendPolicy],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline gap-3 px-4 py-2">
                        <dt className="w-28 shrink-0 text-[12px] text-ink-500">{k}</dt>
                        <dd className="num text-[13px] text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              </XRay>
            </div>

            {/* History */}
            <XRay id="emp-history">
              <Card pad={false}>
                <CardHead title="Record history" sub="Effective-dated. Changes and corrections are different operations." />
                <ol className="relative px-4 py-3">
                  <span className="absolute bottom-4 left-[26px] top-5 w-px bg-ink-200" />
                  {history.map((h) => (
                    <li key={h.d + h.t} className="relative flex gap-3 py-2">
                      <span className={`z-10 mt-1 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ring-4 ring-white ${h.k === "correction" ? "bg-clay" : "bg-ink-300"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-[13px] font-medium text-ink">{h.t}</span>
                          <Badge tone={h.k === "correction" ? "bad" : "neutral"}>
                            {h.k === "correction" ? "Correction" : "Change"}
                          </Badge>
                          <span className="num ml-auto text-[11.5px] text-ink-400">
                            {new Date(h.d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] text-ink-500">{h.v}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
                  A <span className="font-medium text-ink">change</span> means the old value was true and stopped being
                  true. A <span className="font-medium text-clay">correction</span> means it was never true. Collapsing
                  the two corrupts every as-of query you will ever run.
                </div>
              </Card>
            </XRay>
          </div>

          {/* Right rail */}
          <div className="min-w-0 space-y-5">
            <Card pad={false}>
              <CardHead title="Reporting line" />
              <div className="px-4 py-3">
                {chain.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {chain.map((m, i) => (
                      <Link key={m!.id} href={`/app/people/${m!.id}`} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-ink-50" style={{ marginLeft: i * 12 }}>
                        <Avatar name={m!.name} size={22} />
                        <span className="truncate text-[12.5px] text-ink-600">{m!.name}</span>
                        <span className="truncate text-[11.5px] text-ink-400">{m!.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-md bg-signal-100 px-2 py-1.5 ring-1 ring-signal-300" style={{ marginLeft: chain.length * 12 }}>
                  <Avatar name={e.name} size={22} tone="signal" />
                  <span className="truncate text-[12.5px] font-medium text-ink">{e.name}</span>
                </div>
                {reports.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {reports.map((r) => (
                      <Link key={r.id} href={`/app/people/${r.id}`} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-ink-50" style={{ marginLeft: (chain.length + 1) * 12 }}>
                        <Avatar name={r.name} size={22} />
                        <span className="truncate text-[12.5px] text-ink-600">{r.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
                <p className="mt-3 border-t border-ink-100 pt-2.5 text-[11.5px] leading-snug text-ink-400">
                  Approval chains are generated from this graph at request time, never from a maintained list of
                  approvers. That is why they are never routed to someone who left in March.
                </p>
              </div>
            </Card>

            <Card pad={false}>
              <CardHead title="Devices" right={<Badge>{e.devices.length}</Badge>} />
              {e.devices.length === 0 ? (
                <p className="px-4 py-3 text-[12.5px] text-ink-400">Ships on start date, pre-enrolled in MDM.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {e.devices.map((d) => {
                    const dev = deviceById(d);
                    return (
                      <li key={d} className="flex items-center gap-2.5 px-4 py-2.5">
                        <I.IDevice className="h-4 w-4 shrink-0 text-ink-400" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] font-medium text-ink">{dev?.model}</div>
                          <div className="num truncate text-[11.5px] text-ink-400">{dev?.serial} · {dev?.os}</div>
                        </div>
                        <Badge tone={dev?.compliance === 100 ? "good" : "bad"}>{dev?.compliance}%</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card pad={false}>
              <CardHead title="App access" sub="Derived, not granted" right={<Badge>{e.apps.length}</Badge>} />
              {e.apps.length === 0 ? (
                <p className="px-4 py-3 text-[12.5px] text-ink-400">Granted automatically at 00:00 on the start date.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {e.apps.map((a) => {
                    const app = appById(a);
                    return (
                      <li key={a} className="flex items-center gap-2.5 px-4 py-2">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-ink-100 text-[9px] font-bold text-ink-500">
                          {app?.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{app?.name}</span>
                        <span className="text-[11px] text-ink-400">{app?.provisioning}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {spend.length > 0 && (
              <Card pad={false}>
                <CardHead title="Recent spend" />
                <ul className="divide-y divide-ink-100">
                  {spend.map((s) => (
                    <li key={s.id} className="flex items-center gap-2.5 px-4 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] text-ink">{s.merchant}</div>
                        <div className="text-[11.5px] text-ink-400">{s.glCode}</div>
                      </div>
                      <span className="num text-[12.5px] font-medium text-ink">{fmt(s.amount, s.currency)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
