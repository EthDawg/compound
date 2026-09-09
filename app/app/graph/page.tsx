import { PageHeader, Card } from "@/components/ui";
import { XRay } from "@/components/xray";
import { GraphExplorer } from "@/components/graph-explorer";

export default function Graph() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Platform · Graph explorer"
        title="Graph explorer"
        sub="Employment data joined to device posture joined to app entitlements joined to spend, filtered by entity, as of a date. Across four vendors this is a data-warehouse project. Here it is a read."
      />
      <div className="mx-auto max-w-[1180px] px-5 py-5 sm:px-7">
        <XRay id="graph-query">
          <GraphExplorer />
        </XRay>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <XRay id="graph-asof">
            <Card>
              <h3 className="text-[13.5px] font-semibold text-ink">Try the as-of dropdown</h3>
              <p className="prose-measure mt-1.5 text-[13px] leading-relaxed text-ink-600">
                Every query on this page can be resolved against any past date, because every fact about every person
                is stored with a validity window rather than as a current value. It is the least visible and most
                expensive decision in the whole system.
              </p>
            </Card>
          </XRay>

          <Card>
            <h3 className="text-[13.5px] font-semibold text-ink">One search across every domain</h3>
            <p className="prose-measure mt-1.5 text-[13px] leading-relaxed text-ink-600">
              The search box in the header returns people, devices, apps, transactions and workflows from one index,
              because they are all edges on one graph. In a best-of-breed stack this feature is not hard to build — it
              is impossible, because no single vendor can see the whole picture.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
