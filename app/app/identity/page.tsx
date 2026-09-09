import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="IT · Identity & access" title="Identity & access" sub="SSO groups and directory metadata are projections of the employee record. There is no separate identity source to reconcile against." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="SSO groups and directory metadata are projections of the employee record. There is no separate identity source to reconcile against."
      />
    </div>
  );
}
