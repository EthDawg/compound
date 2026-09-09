import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="HR · Learning" title="Learning" sub="Required training is derived from role, country and data-access level. Nobody assigns it; it appears because those three facts are already known." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Required training is derived from role, country and data-access level. Nobody assigns it; it appears because those three facts are already known."
      />
    </div>
  );
}
