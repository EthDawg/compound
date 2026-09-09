import Link from "next/link";
import { XRay } from "@/components/xray";
import { RippleDemo } from "@/components/ripple-demo";
import { PageHeader, Card, CardHead, Badge, Stat, Avatar, Btn } from "@/components/ui";
import { EMPLOYEES, byId } from "@/lib/data/employees";
import { COMPANY } from "@/lib/data/company";
import { DEVICES, APPS } from "@/lib/data/systems";
import { fmtCompact } from "@/lib/data/finance";
import * as I from "@/components/icons";

const TASKS = [
  { id: "t1", domain: "Payroll", tone: "bad" as const, title: "US semi-monthly run needs review", detail: "208 people · $3.18M gross · pays Sep 15", meta: "Due in 2 days", href: "/app/payroll" },
  { id: "t2", domain: "IT", tone: "warn" as const, title: "3 devices out of compliance past 72h", detail: "Conditional access has already restricted 6 apps on those machines", meta: "Auto-escalated", href: "/app/devices" },
  { id: "t3", domain: "Hiring", tone: "info" as const, title: "2 hires start Sep 22 — provisioning staged", detail: "Tobias Mensah, Valentina Rossi · laptops shipped, access pending start date", meta: "13 days", href: "/app/hire" },
  { id: "t4", domain: "Finance", tone: "warn" as const, title: "4 transactions over policy await approval", detail: "$112,330 total · largest is $68,400 to Shenzhen Precision", meta: "Oldest 3 days", href: "/app/spend" },
  { id: "t5", domain: "Compliance", tone: "bad" as const, title: "Offboarding: Hugo Lindgren, Sep 30", detail: "German notice period computed · final pay staged · device recovery pending", meta: "21 days", href: "/app/people/e-046" },
  { id: "t6", domain: "IT", tone: "neutral" as const, title: "23 app seats unused for 45+ days", detail: "Projected $4,180/mo if released · one-click confirm per manager", meta: "Suggested", href: "/app/apps" },
];

export default function Home() {
  const onboarding = EMPLOYEES.filter((e) => e.status === "Onboarding");
  const offboarding = EMPLOYEES.filter((e) => e.status === "Offboarding");
  const badDevices = DEVICES.filter((d) => d.compliance < 100).length;
  const idleSeats = 23; // assigned but unopened for 45+ days — the reclaim workflow queue
  const unassignedSeats = APPS.reduce((s, a) => s + a.seats - a.assigned, 0);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow={`${COMPANY.name} · ${COMPANY.entities.length} entities`}
        title="Wednesday, 9 September"
        sub="Six things need a person today. They come from four different domains and they are in one list, because they are all the same kind of object: an action waiting on a human."
        actions={<><Btn variant="secondary"><I.IReport className="h-3.5 w-3.5" />Reports</Btn><Btn variant="primary" href="/app/hire"><I.IHire className="h-3.5 w-3.5" />Hire someone</Btn></>}
      />

      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="Headcount" value="344" sub="+11 in 30 days" tone="neutral" icon={<I.IPeople className="h-3.5 w-3.5 text-ink-400" />} />
          <Stat label="Next payroll" value="$3.18M" sub="Sep 15 · needs review" tone="warn" icon={<I.IPayroll className="h-3.5 w-3.5 text-ink-400" />} />
          <Stat label="Device compliance" value={`${Math.round(((DEVICES.length - badDevices) / DEVICES.length) * 100)}%`} sub={`${badDevices} machines flagged`} tone={badDevices > 2 ? "bad" : "good"} icon={<I.IDevice className="h-3.5 w-3.5 text-ink-400" />} />
          <Stat label="Spend MTD" value={fmtCompact(287420)} sub="70% of month budget" tone="neutral" icon={<I.ICard className="h-3.5 w-3.5 text-ink-400" />} />
          <Stat label="Idle app seats" value={String(idleSeats)} sub={`$4,180/mo reclaimable · ${unassignedSeats} unassigned`} tone="warn" icon={<I.IApps className="h-3.5 w-3.5 text-ink-400" />} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="min-w-0">
            <XRay id="home-tasks">
              <Card pad={false}>
                <CardHead
                  title="Needs you"
                  sub="Payroll, IT, hiring, finance and compliance — one queue"
                  right={<Badge tone="dark">{TASKS.length}</Badge>}
                />
                <ul className="divide-y divide-ink-100">
                  {TASKS.map((t) => (
                    <li key={t.id}>
                      <Link href={t.href} className="flex items-start gap-3 px-4 py-3 transition hover:bg-ink-50">
                        <span className="mt-[3px]"><Badge tone={t.tone} dot>{t.domain}</Badge></span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-medium leading-snug text-ink">{t.title}</div>
                          <div className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{t.detail}</div>
                        </div>
                        <span className="num shrink-0 pt-0.5 text-[11.5px] text-ink-400">{t.meta}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </XRay>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Card pad={false}>
                <CardHead title="Starting soon" sub="Provisioning already staged" />
                <ul className="divide-y divide-ink-100">
                  {onboarding.map((e) => (
                    <li key={e.id}>
                      <Link href={`/app/people/${e.id}`} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ink-50">
                        <Avatar name={e.name} size={30} tone="sky" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-ink">{e.name}</div>
                          <div className="truncate text-[12px] text-ink-500">{e.title}</div>
                        </div>
                        <Badge tone="info">Sep 22</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card pad={false}>
                <CardHead title="Leaving" sub="Sequenced by jurisdiction" />
                <ul className="divide-y divide-ink-100">
                  {offboarding.map((e) => (
                    <li key={e.id}>
                      <Link href={`/app/people/${e.id}`} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ink-50">
                        <Avatar name={e.name} size={30} tone="clay" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-ink">{e.name}</div>
                          <div className="truncate text-[12px] text-ink-500">{e.country} · notice period applied</div>
                        </div>
                        <Badge tone="bad">Sep 30</Badge>
                      </Link>
                    </li>
                  ))}
                  <li className="px-4 py-2.5 text-[12px] leading-snug text-ink-400">
                    German statutory notice is computed from tenure, not from a field someone types.
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <XRay id="home-ripple">
              <RippleDemo />
            </XRay>

            <Card pad={false}>
              <CardHead title="Recent writes to the graph" sub="Every change, one log" />
              <ul className="divide-y divide-ink-100">
                {[
                  { who: "e-005", what: "moved Wei Zhang from Data to Platform", when: "18m", n: 6 },
                  { who: "e-013", what: "revoked 4 app grants on unused-seat policy", when: "1h", n: 4 },
                  { who: "e-012", what: "opened Colorado tax registration", when: "3h", n: 3 },
                  { who: "e-003", what: "approved comp change for Fatima Al-Rashid", when: "5h", n: 5 },
                  { who: "e-032", what: "restricted 2 devices failing disk encryption", when: "6h", n: 3 },
                ].map((a, i) => {
                  const p = byId(a.who);
                  return (
                    <li key={i} className="flex items-start gap-2.5 px-4 py-2.5">
                      <Avatar name={p?.name ?? "??"} size={24} />
                      <div className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-600">
                        <span className="font-medium text-ink">{p?.name.split(" ")[0]}</span> {a.what}
                        <div className="mt-0.5 text-[11.5px] text-ink-400">
                          {a.when} ago · {a.n} downstream effects
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="rounded-lg border border-ink-200 bg-ink p-4 text-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-signal">
                <I.IEye className="h-3 w-3" /> New here?
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-200">
                Press <kbd className="rounded bg-white/10 px-1 font-mono text-[11px] font-bold text-signal">X</kbd> anywhere
                in the app. Every screen gets annotated with why it is built this way, what it trades away, and what it
                cost to hold the line.
              </p>
              <Link href="/backstage" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-signal hover:underline">
                Or go straight to the backstage <I.IArrow className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
