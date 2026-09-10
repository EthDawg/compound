import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="HR · Benefits" title="Benefits" sub="Eligibility is a function of country, entity and worker type — which is why the election screen simply does not render an ineligible plan rather than showing it and rejecting it." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Eligibility is a function of country, entity and worker type — which is why the election screen simply does not render an ineligible plan rather than showing it and rejecting it."
      />
    </div>
  );
}
