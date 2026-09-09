import Link from "next/link";
import { PageHeader, Card, CardHead, Badge, Stat, Avatar } from "@/components/ui";
import { XRay } from "@/components/xray";
import { DEVICES } from "@/lib/data/systems";
import { byId } from "@/lib/data/employees";

const TONE = { Healthy: "good", "Needs attention": "bad", Unassigned: "neutral", "In transit": "info", "Recovery pending": "warn" } as const;

export default function Devices() {
  const flagged = DEVICES.filter((d) => d.compliance < 100);
  const assigned = DEVICES.filter((d) => d.assignedTo);
  const unassigned = DEVICES.length - assigned.length;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="IT · Devices"
        title="Devices"
        sub="A laptop is an attribute of an employment relationship. That is why this lives in the same system as the payroll run."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Fleet" value={String(DEVICES.length)} sub={`${assigned.length} assigned · ${unassigned} in stock`} />
          <Stat label="Compliant" value={`${Math.round(((DEVICES.length - flagged.length) / DEVICES.length) * 100)}%`} sub={`${flagged.length} machines flagged`} tone={flagged.length > 2 ? "bad" : "good"} />
          <Stat label="Encrypted" value={`${DEVICES.filter((d) => d.encrypted).length}/${DEVICES.length}`} sub="FileVault / BitLocker enforced" tone="good" />
          <Stat label="Access restricted" value="6" sub="apps blocked on flagged machines" tone="warn" />
        </div>

        <XRay id="devices-compliance">
          <Card pad={false}>
            <CardHead
              title="Out of compliance past 72 hours"
              sub="Conditional access has already acted — no ticket was needed"
              right={<Badge tone="bad">{flagged.length}</Badge>}
            />
            <ul className="divide-y divide-ink-100">
              {flagged.map((d) => {
                const p = d.assignedTo ? byId(d.assignedTo) : null;
                return (
                  <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    {p && <Avatar name={p.name} size={30} tone="clay" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-ink">
                        {p ? <Link href={`/app/people/${p.id}`} className="hover:underline">{p.name}</Link> : "Unassigned"}
                        <span className="ml-2 font-normal text-ink-500">{d.model}</span>
                      </div>
                      <div className="mt-0.5 text-[12px] text-ink-500">
                        {d.compliance === 72 ? "Disk encryption disabled · OS 2 major versions behind" : "OS update deferred 41 days · screen lock over policy"}
                      </div>
                    </div>
                    <Badge tone="bad">{d.compliance}%</Badge>
                    <span className="num text-[11.5px] text-ink-400">{d.lastCheckIn}</span>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
              Blocking a machine from sensitive apps needs device posture, app sensitivity and this person&rsquo;s role at
              once. Three vendors can each hold a third of that and none of them can act on it.
            </p>
          </Card>
        </XRay>

        <div className="mt-5">
          <XRay id="devices-fleet">
            <Card pad={false}>
              <CardHead title="Fleet" sub={`${DEVICES.length} machines`} />
              <div className="overflow-x-auto thin-scroll">
                <table className="tbl min-w-[860px]">
                  <thead><tr className="bg-ink-50/70">
                    <th className="pt-3">Device</th><th className="pt-3">Serial</th><th className="pt-3">Assigned to</th>
                    <th className="pt-3">OS</th><th className="pt-3">Status</th>
                    <th className="pt-3 text-right">Compliance</th><th className="pt-3">Last check-in</th>
                  </tr></thead>
                  <tbody>
                    {DEVICES.map((d) => {
                      const p = d.assignedTo ? byId(d.assignedTo) : null;
                      return (
                        <tr key={d.id}>
                          <td className="font-medium text-ink">{d.model}</td>
                          <td className="num text-ink-500">{d.serial}</td>
                          <td>
                            {p ? (
                              <Link href={`/app/people/${p.id}`} className="flex items-center gap-2 text-ink-600 hover:text-ink">
                                <Avatar name={p.name} size={22} />{p.name}
                              </Link>
                            ) : <span className="text-ink-400">In stock</span>}
                          </td>
                          <td className="text-ink-600">{d.os}</td>
                          <td><Badge tone={TONE[d.status]} dot>{d.status}</Badge></td>
                          <td className={`num text-right font-medium ${d.compliance === 100 ? "text-moss" : "text-clay"}`}>{d.compliance}%</td>
                          <td className="num text-ink-500">{d.lastCheckIn}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </XRay>
        </div>
      </div>
    </div>
  );
}
