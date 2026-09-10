import { PageHeader, Empty } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="HR · Time & attendance" title="Time & attendance" sub="Accrual rates and statutory leave come from the country layer, so a person moving from Austin to Berlin gets German leave rules without anyone editing a policy." />
      <Empty
        title="Not built out in this study"
        body="This product line exists in the navigation because the point of the navigation is that it is long. The surfaces that carry the argument — People, Hiring, Payroll, Devices, Apps, Spend, Workflows and the Graph explorer — are built."
        note="Accrual rates and statutory leave come from the country layer, so a person moving from Austin to Berlin gets German leave rules without anyone editing a policy."
      />
    </div>
  );
}
