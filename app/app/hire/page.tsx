import { PageHeader, Card, CardHead, Badge, Avatar } from "@/components/ui";
import { XRay } from "@/components/xray";
import { HireFlow } from "@/components/hire-flow";
import { EMPLOYEES } from "@/lib/data/employees";
import { WORKFLOWS } from "@/lib/data/workflows";

export default function Hire() {
  const starting = EMPLOYEES.filter((e) => e.status === "Onboarding");
  const wf = WORKFLOWS[0];

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="HR · Hiring & onboarding"
        title="Hiring & onboarding"
        sub="The competitor version of this screen is seven screens in seven products, owned by four people, over about nine days."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <XRay id="hire-flow">
          <HireFlow />
        </XRay>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <XRay id="hire-jurisdiction">
            <Card pad={false}>
              <CardHead title="The workflow behind it" sub={wf.name} right={<Badge tone="good" dot>Enabled</Badge>} />
              <ol className="divide-y divide-ink-100">
                {wf.actions.map((a, i) => (
                  <li key={a.system} className="flex items-start gap-3 px-4 py-2.5">
                    <span className="num mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink-100 text-[10.5px] font-bold text-ink-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-ink">
                        <span className="font-medium">{a.verb}</span>{" "}
                        <span className="text-ink-500">— {a.system}</span>
                      </div>
                      <div className="mt-0.5 text-[12px] leading-snug text-ink-500">{a.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5 text-[12px] text-ink-500">
                Ran {wf.runs30d} times in the last 30 days. Owned by People, executed by the platform workflow engine —
                not by seven separate integrations.
              </div>
            </Card>
          </XRay>

          <Card pad={false}>
            <CardHead title="Starting soon" right={<Badge tone="info">{starting.length}</Badge>} />
            <ul className="divide-y divide-ink-100">
              {starting.map((e) => (
                <li key={e.id} className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={e.name} size={32} tone="sky" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-ink">{e.name}</div>
                      <div className="truncate text-[12px] text-ink-500">{e.title} · {e.location}</div>
                    </div>
                    <Badge tone="info">22 Sep</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {[
                      ["Offer", true], ["Right to work", true], ["Laptop", true], ["Access", false],
                    ].map(([l, done]) => (
                      <div key={String(l)} className={`rounded px-1.5 py-1 text-center text-[10.5px] font-medium ring-1 ring-inset ${done ? "bg-moss-100 text-moss ring-moss/20" : "bg-ink-50 text-ink-400 ring-ink-200"}`}>
                        {String(l)}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-ink-400">
                    Access is staged, not granted. It activates at 00:00 on the start date — because employment status
                    is a date range, not a switch someone remembers to flip.
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
