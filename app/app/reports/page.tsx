import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Platform · Reports" title="Reports" sub="Saved views over the graph explorer. Every report is a query, so every report can be asked as of a past date." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Saved views over the graph explorer. Every report is a query, so every report can be asked as of a past date."
      />
    </div>
  );
}
