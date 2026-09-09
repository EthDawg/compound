import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Finance · Headcount planning" title="Headcount planning" sub="Plans read fully-loaded cost from live comp and country loading factors, so the model and the payroll run cannot disagree." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Plans read fully-loaded cost from live comp and country loading factors, so the model and the payroll run cannot disagree."
      />
    </div>
  );
}
