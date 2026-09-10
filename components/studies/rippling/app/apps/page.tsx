import { PageHeader, Card, CardHead, Badge, Stat } from "@/components/ui";
import { XRay } from "@/components/xray";
import { APPS } from "@/lib/data/systems";
import { fmt } from "@/lib/data/finance";

const PROV = { SCIM: "good", SAML: "info", API: "info", Manual: "warn" } as const;
const RISK = { Low: "neutral", Medium: "warn", High: "bad" } as const;

export default function Apps() {
  const totalCost = APPS.reduce((s, a) => s + a.cost * a.assigned, 0);
  const wasted = APPS.reduce((s, a) => s + a.cost * (a.seats - a.assigned), 0);
  const manual = APPS.filter((a) => a.provisioning === "Manual").length;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="IT · App management"
        title="App management"
        sub="Nobody maintains a list of who should have what. Access is a function of department, level, entity and employment status — so it is correct by construction."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Applications" value={String(APPS.length)} sub={`${APPS.length - manual} auto-provisioned`} />
          <Stat label="Monthly licence cost" value={fmt(totalCost)} sub="assigned seats only" />
          <Stat label="Wasted on empty seats" value={fmt(wasted)} sub="per month, unassigned" tone="bad" />
          <Stat label="Manual provisioning" value={String(manual)} sub="each one is a seam we still own" tone="warn" />
        </div>

        <XRay id="apps-waste">
          <Card pad={false}>
            <CardHead
              title="Reclaimable"
              sub="Visible because licence assignment and employment status live in the same place"
              right={<Badge tone="warn">23 idle seats</Badge>}
            />
            <ul className="divide-y divide-ink-100">
              {APPS.filter((a) => a.seats - a.assigned > 8 && a.cost > 0).sort((a, b) => (b.seats - b.assigned) * b.cost - (a.seats - a.assigned) * a.cost).slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-ink-100 text-[10px] font-bold text-ink-600">
                    {a.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-ink">{a.name}</div>
                    <div className="text-[12px] text-ink-500">{a.seats - a.assigned} unassigned of {a.seats} at {fmt(a.cost)}/seat</div>
                  </div>
                  <span className="num text-[13px] font-medium text-clay">{fmt((a.seats - a.assigned) * a.cost)}/mo</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] leading-snug text-ink-500">
              A finance outcome produced entirely by an IT-and-HR data decision. That row is roughly the whole argument
              for the company.
            </p>
          </Card>
        </XRay>

        <div className="mt-5">
          <XRay id="apps-provisioning">
            <Card pad={false}>
              <CardHead title="Catalogue" sub="Provisioning method determines whether a termination is instant or a checklist item" />
              <div className="overflow-x-auto thin-scroll">
                <table className="tbl min-w-[880px]">
                  <thead><tr className="bg-ink-50/70">
                    <th className="pt-3">Application</th><th className="pt-3">Category</th><th className="pt-3">Provisioning</th>
                    <th className="pt-3">Data risk</th><th className="pt-3 text-right">Assigned</th>
                    <th className="pt-3 text-right">Seats</th><th className="pt-3 text-right">Cost/seat</th><th className="pt-3 text-right">Monthly</th>
                  </tr></thead>
                  <tbody>
                    {APPS.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <span className="flex items-center gap-2">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-ink-100 text-[9px] font-bold text-ink-600">
                              {a.name.slice(0, 2).toUpperCase()}
                            </span>
                            <span className="font-medium text-ink">{a.name}</span>
                          </span>
                        </td>
                        <td className="text-ink-600">{a.category}</td>
                        <td><Badge tone={PROV[a.provisioning]}>{a.provisioning}</Badge></td>
                        <td><Badge tone={RISK[a.risk]} dot>{a.risk}</Badge></td>
                        <td className="num text-right text-ink-600">{a.assigned}</td>
                        <td className="num text-right text-ink-500">{a.seats}</td>
                        <td className="num text-right text-ink-500">{a.cost ? fmt(a.cost) : "usage"}</td>
                        <td className="num text-right font-medium text-ink">{a.cost ? fmt(a.cost * a.assigned) : "—"}</td>
                      </tr>
                    ))}
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
