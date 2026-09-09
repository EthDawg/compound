import { PageHeader, Card, CardHead, Badge, Stat, Btn } from "@/components/ui";
import { XRay } from "@/components/xray";
import { PAYROLL_RUNS, fmt, fmtCompact } from "@/lib/data/finance";
import { COMPANY } from "@/lib/data/company";
import * as I from "@/components/icons";

const TONE = { Draft: "neutral", "Needs review": "warn", Approved: "info", Paid: "good" } as const;

const VARIANCE = [
  { d: "New hires (2 mid-month starts)", v: 18400, k: "up" },
  { d: "Terminations (1, Berlin, notice period)", v: -9200, k: "down" },
  { d: "Comp changes effective Sep 1 (4 people)", v: 21700, k: "up" },
  { d: "Overtime, Toronto manufacturing", v: 6300, k: "up" },
  { d: "One-time referral bonuses", v: 5100, k: "up" },
  { d: "Benefits election changes at open enrolment", v: -4200, k: "down" },
];

export default function Payroll() {
  const total = PAYROLL_RUNS.filter((r) => r.status !== "Paid").reduce((s, r) => s + r.gross, 0);
  const net = VARIANCE.reduce((s, v) => s + v.v, 0);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="HR · Payroll"
        title="Payroll"
        sub="Four entities, three currencies, one engine. The differences between them are configuration, not code."
        actions={<><Btn><I.IReport className="h-3.5 w-3.5" />Register</Btn><Btn variant="primary"><I.ICheck className="h-3.5 w-3.5" />Review US run</Btn></>}
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Pending gross" value={fmtCompact(total)} sub="4 runs across 4 entities" tone="warn" />
          <Stat label="Next pay date" value="Sep 15" sub="US and Canada semi-monthly" />
          <Stat label="Tax jurisdictions" value="27" sub="14 US states, 3 countries, 10 local" />
          <Stat label="Variance vs last run" value={`+${fmtCompact(net)}`} sub="fully attributed below" tone="neutral" />
        </div>

        <XRay id="payroll-entities">
          <Card pad={false}>
            <CardHead title="Runs" sub="Same code path, different configuration" right={<Badge tone="warn">2 need review</Badge>} />
            <div className="overflow-x-auto thin-scroll">
              <table className="tbl min-w-[820px]">
                <thead><tr className="bg-ink-50/70">
                  <th className="pt-3">Entity</th><th className="pt-3">Period</th><th className="pt-3">Pay date</th>
                  <th className="pt-3 text-right">People</th><th className="pt-3 text-right">Gross</th>
                  <th className="pt-3 text-right">Taxes</th><th className="pt-3 text-right">Net</th><th className="pt-3">Status</th>
                </tr></thead>
                <tbody>
                  {PAYROLL_RUNS.map((r) => (
                    <tr key={r.id}>
                      <td className="font-medium text-ink">{r.entity}</td>
                      <td className="text-ink-600">{r.period}</td>
                      <td className="num text-ink-600">{new Date(r.payDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                      <td className="num text-right text-ink-600">{r.employees}</td>
                      <td className="num text-right font-medium text-ink">{fmt(r.gross, r.currency)}</td>
                      <td className="num text-right text-ink-500">{fmt(r.taxes, r.currency)}</td>
                      <td className="num text-right text-ink-600">{fmt(r.net, r.currency)}</td>
                      <td><Badge tone={TONE[r.status]} dot>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </XRay>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <XRay id="payroll-variance">
            <Card pad={false}>
              <CardHead title="Why this run differs from the last one" sub="Attributed automatically — nobody built this in a spreadsheet" />
              <ul className="divide-y divide-ink-100">
                {VARIANCE.map((v) => (
                  <li key={v.d} className="flex items-center gap-3 px-4 py-2.5">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${v.k === "up" ? "bg-clay" : "bg-moss"}`} />
                    <span className="min-w-0 flex-1 text-[13px] text-ink-600">{v.d}</span>
                    <span className={`num shrink-0 text-[13px] font-medium ${v.k === "up" ? "text-clay" : "text-moss"}`}>
                      {v.v > 0 ? "+" : ""}{fmt(v.v)}
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-3 bg-ink-50/60 px-4 py-2.5">
                  <span className="min-w-0 flex-1 text-[13px] font-semibold text-ink">Net change</span>
                  <span className="num shrink-0 text-[13px] font-semibold text-ink">+{fmt(net)}</span>
                </li>
              </ul>
              <p className="border-t border-ink-100 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
                The run can explain itself because it can see the hires, the terminations, the comp changes and their
                effective dates. A standalone payroll system can only tell you the number moved.
              </p>
            </Card>
          </XRay>

          <Card pad={false}>
            <CardHead title="Entities" sub={`${COMPANY.entities.length} employment relationships`} />
            <ul className="divide-y divide-ink-100">
              {COMPANY.entities.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-ink-100 font-mono text-[10px] font-bold text-ink-600">
                    {e.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-ink">{e.name}</div>
                    <div className="truncate text-[12px] text-ink-500">{e.country} · {e.type}</div>
                  </div>
                  <span className="num text-[13px] text-ink-600">{e.employees}</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-ink-100 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
              Adding country twelve took under three weeks and was almost entirely configuration plus local counsel
              review. Country two took ten weeks longer than a fork would have, which is what bought that.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
