import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="IT · Security posture" title="Security posture" sub="Conditional access needs device posture, app sensitivity and the person's role in one place. Three vendors can each hold a third of that and none can act." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Conditional access needs device posture, app sensitivity and the person's role in one place. Three vendors can each hold a third of that and none can act."
      />
    </div>
  );
}
