import { PageHeader, Card, Badge, Stat } from "@/components/ui";
import { XRay } from "@/components/xray";
import { WORKFLOWS } from "@/lib/data/workflows";
import { byId } from "@/lib/data/employees";
import { Avatar } from "@/components/ui";
import * as I from "@/components/icons";

const CAT = { HR: "bad", IT: "info", Finance: "good", Compliance: "neutral" } as const;

export default function Workflows() {
  const runs = WORKFLOWS.reduce((s, w) => s + w.runs30d, 0);
  const actions = WORKFLOWS.reduce((s, w) => s + w.actions.length, 0);
  const cross = WORKFLOWS.filter((w) => new Set(w.actions.map((a) => a.system)).size > 2).length;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Platform · Workflows"
        title="Workflows"
        sub="One engine handles triggers, conditions, approvals, effective dates, retries and the audit trail. Products contribute triggers and actions. None of them owns orchestration."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Active workflows" value={String(WORKFLOWS.length)} sub="all on one engine" />
          <Stat label="Runs, last 30 days" value={String(runs)} sub={`${actions} distinct actions`} />
          <Stat label="Cross-domain" value={`${cross}/${WORKFLOWS.length}`} sub="span 3+ products" tone="good" />
          <Stat label="Manual steps replaced" value="~340" sub="per month, estimated" />
        </div>

        <XRay id="workflows-cross">
          <div className="space-y-4">
            {WORKFLOWS.map((w) => {
              const owner = byId(w.owner);
              return (
                <Card key={w.id} pad={false}>
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-ink">{w.name}</h3>
                        <Badge tone={CAT[w.category]}>{w.category}</Badge>
                        {w.enabled && <Badge tone="good" dot>Enabled</Badge>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-ink-500">
                        <span className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[11px] text-ink-600">
                          when {w.trigger}
                        </span>
                        <span>· {w.scope}</span>
                        <span>· {w.runs30d} runs / 30d</span>
                      </div>
                    </div>
                    {owner && (
                      <div className="flex shrink-0 items-center gap-2">
                        <Avatar name={owner.name} size={24} />
                        <span className="text-[12px] text-ink-500">{owner.name.split(" ")[0]}</span>
                      </div>
                    )}
                  </div>
                  <ul className="grid gap-px bg-ink-100 sm:grid-cols-2">
                    {w.actions.map((a) => (
                      <li key={a.system + a.verb} className="flex items-start gap-2.5 bg-white px-4 py-2.5">
                        <I.IArrow className="mt-1 h-3 w-3 shrink-0 text-ink-300" />
                        <div className="min-w-0">
                          <div className="text-[12.5px] text-ink">
                            <span className="font-semibold">{a.verb}</span>
                            <span className="text-ink-500"> · {a.system}</span>
                          </div>
                          <div className="mt-0.5 text-[12px] leading-snug text-ink-500">{a.detail}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </XRay>

        <div className="mt-5">
          <XRay id="workflows-engine">
            <Card>
              <h3 className="text-[13.5px] font-semibold text-ink">Look at what these actually do</h3>
              <p className="prose-measure mt-1.5 text-[13px] leading-relaxed text-ink-600">
                An HR event fires an IT action which produces a Finance consequence. Every genuinely useful rule crosses
                a domain boundary — which is precisely the set of rules that cannot be written in a best-of-breed stack,
                no matter how good each individual tool is.
              </p>
            </Card>
          </XRay>
        </div>
      </div>
    </div>
  );
}
