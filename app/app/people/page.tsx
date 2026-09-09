import { PageHeader, Btn, Stat } from "@/components/ui";
import { PeopleTable } from "@/components/people-table";
import { EMPLOYEES } from "@/lib/data/employees";
import { COMPANY } from "@/lib/data/company";
import * as I from "@/components/icons";

export default function People() {
  const eor = EMPLOYEES.filter((e) => e.type === "EOR").length;
  const contractors = EMPLOYEES.filter((e) => e.type === "Contractor").length;
  const countries = new Set(EMPLOYEES.map((e) => e.country)).size;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="HR · People"
        title="People"
        sub="This screen looks like a directory. Structurally it is the primary key of the company — the object every other product in the sidebar reads from."
        actions={<><Btn><I.IReport className="h-3.5 w-3.5" />Export</Btn><Btn variant="primary" href="/app/hire"><I.IHire className="h-3.5 w-3.5" />Add person</Btn></>}
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Total people" value={String(EMPLOYEES.length)} sub={`across ${countries} countries`} />
          <Stat label="Legal entities" value={String(COMPANY.entities.filter((e) => e.type === "Own entity").length)} sub="plus 2 EOR jurisdictions" />
          <Stat label="EOR employees" value={String(eor)} sub="UK and India" tone="neutral" />
          <Stat label="Contractors" value={String(contractors)} sub="classification reviewed quarterly" tone="warn" />
        </div>
        <PeopleTable />
      </div>
    </div>
  );
}
