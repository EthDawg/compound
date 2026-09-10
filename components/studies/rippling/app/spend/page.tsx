import Link from "next/link";
import { PageHeader, Card, CardHead, Badge, Stat, Avatar } from "@/components/ui";
import { XRay } from "@/components/xray";
import { SPEND, CARD_STATS, fmt, fmtCompact } from "@/lib/data/finance";
import { byId, chainOf } from "@/lib/data/employees";
import * as I from "@/components/icons";

const TONE = { "Auto-approved": "good", Reconciled: "neutral", "Needs receipt": "warn", "Pending approval": "info", Flagged: "bad" } as const;

export default function Spend() {
  const pending = SPEND.filter((s) => s.status === "Pending approval");
  const chain = chainOf("e-023").map(byId).filter(Boolean);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Finance · Spend"
        title="Spend"
        sub="Limits, category rules and approval chains all derive from the person. Move someone between departments and their spending authority changes in the same instant as their app access."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Month to date" value={fmtCompact(CARD_STATS.monthToDate)} sub={`${Math.round((CARD_STATS.monthToDate / CARD_STATS.budget) * 100)}% of ${fmtCompact(CARD_STATS.budget)} budget`} />
          <Stat label="Active cards" value={String(CARD_STATS.activeCards)} sub="issued from level, not requested" />
          <Stat label="Awaiting approval" value={String(pending.length)} sub={fmt(pending.reduce((s, p) => s + p.amount, 0))} tone="warn" />
          <Stat label="Auto-categorised" value={`${Math.round(CARD_STATS.autoCategorized * 100)}%`} sub="GL coded from the employee's cost center" tone="good" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <XRay id="spend-policy">
              <Card pad={false}>
                <CardHead title="Transactions" sub="Policy evaluated at swipe, not at month end" />
                <div className="overflow-x-auto thin-scroll">
                  <table className="tbl min-w-[720px]">
                    <thead><tr className="bg-ink-50/70">
                      <th className="pt-3">Merchant</th><th className="pt-3">Person</th><th className="pt-3">GL</th>
                      <th className="pt-3 text-right">Amount</th><th className="pt-3">Status</th><th className="pt-3">Date</th>
                    </tr></thead>
                    <tbody>
                      {SPEND.map((s) => {
                        const p = byId(s.employee);
                        return (
                          <tr key={s.id}>
                            <td className="font-medium text-ink">{s.merchant}<span className="block text-[11.5px] font-normal text-ink-400">{s.category}</span></td>
                            <td>
                              {p && (
                                <Link href={`/companies/rippling/app/people/${p.id}`} className="flex items-center gap-2 text-ink-600 hover:text-ink">
                                  <Avatar name={p.name} size={22} />
                                  <span className="truncate">{p.name.split(" ")[0]}</span>
                                </Link>
                              )}
                            </td>
                            <td className="num text-[12px] text-ink-500">{s.glCode}</td>
                            <td className="num text-right font-medium text-ink">{fmt(s.amount, s.currency)}</td>
                            <td><Badge tone={TONE[s.status]} dot>{s.status}</Badge></td>
                            <td className="num text-ink-500">{new Date(s.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </XRay>
          </div>

          <div className="min-w-0 space-y-5">
            <XRay id="spend-approval">
              <Card pad={false}>
                <CardHead title="Approval chain" sub="Computed from the org graph at request time" />
                <div className="px-4 py-3">
                  <div className="mb-3 rounded-md bg-ink-50 p-2.5">
                    <div className="text-[12.5px] font-medium text-ink">Zemax LLC · {fmt(9360)}</div>
                    <div className="text-[11.5px] text-ink-500">Aisha Bello · Engineering policy · over {fmt(5000)} limit</div>
                  </div>
                  <ol className="space-y-1.5">
                    {[...chain, byId("e-003")].filter(Boolean).map((m, i, arr) => (
                      <li key={m!.id} className="flex items-center gap-2.5">
                        <span className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold ${i === 0 ? "bg-moss text-white" : "bg-ink-100 text-ink-500"}`}>
                          {i === 0 ? <I.ICheck className="h-2.5 w-2.5" /> : i + 1}
                        </span>
                        <Avatar name={m!.name} size={22} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] text-ink">{m!.name}</div>
                          <div className="truncate text-[11px] text-ink-400">{m!.title}</div>
                        </div>
                        {i === 0 && <Badge tone="good">Approved</Badge>}
                        {i === 1 && <Badge tone="info">Waiting</Badge>}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 border-t border-ink-100 pt-2.5 text-[11.5px] leading-snug text-ink-400">
                    There is no maintained approver list, so this chain cannot be stale. The classic failure of an
                    expense tool that does not own the org chart is routing to someone who left in March.
                  </p>
                </div>
              </Card>
            </XRay>

            <Card pad={false}>
              <CardHead title="Policies" sub="Attached to levels, not to cards" />
              <ul className="divide-y divide-ink-100">
                {[
                  ["Executive", 25000, "No pre-approval under limit"],
                  ["Engineering", 5000, "Software over $5k needs VP"],
                  ["Sales", 10000, "Travel auto-approved in policy"],
                  ["IT", 25000, "Hardware exempt from category caps"],
                  ["Operations", 8000, "COGS routes to Finance always"],
                  ["Contractor", 0, "No issuance path exists"],
                ].map(([n, l, d]) => (
                  <li key={String(n)} className="flex items-center gap-3 px-4 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-medium text-ink">{String(n)}</span>
                      <span className="block text-[11.5px] text-ink-500">{String(d)}</span>
                    </span>
                    <span className="num text-[12.5px] text-ink-600">{Number(l) ? fmt(Number(l)) : "—"}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
