import Link from "next/link";
import { BriefReader } from "@/components/brief-reader";
import * as I from "@/components/icons";

export const metadata = {
  title: "The 12-minute brief — Compound",
  description: "The whole argument, in the order that suits whoever is reading it.",
};

export default function Brief() {
  return (
    <div className="min-h-screen bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[820px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-signal text-ink">
              <I.ILayers className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Compound</span>
          </Link>
          <span className="hidden text-[12.5px] text-ink-500 sm:block">· the 12-minute brief</span>
          <div className="ml-auto flex gap-2">
            <Link href="/app" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">
              The app
            </Link>
            <Link href="/backstage" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">
              Backstage
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[820px] px-4 pb-20 sm:px-6">
        <div className="border-b border-white/10 py-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">Speed run</div>
          <h1 className="font-serif-display mt-2 text-[32px] font-normal leading-[1.13] tracking-tight text-white sm:text-[40px]">
            The whole argument, in the order that suits whoever is holding it
          </h1>
          <p className="prose-measure mt-4 text-[16px] leading-[1.65] text-ink-400">
            Same evidence, four entry points. A prospect wants the Tuesday that disappears. An investor wants the
            arithmetic and the falsifier. Somebody starting on Monday wants the constraints that will confuse them. A
            skeptic wants the loss column. Pick one and it takes about twelve minutes.
          </p>
        </div>

        <BriefReader />

        <p className="mt-10 border-t border-white/10 pt-6 text-[13px] leading-[1.7] text-ink-500">
          An independent study of the compound-startup thesis, most publicly associated with Rippling and its founder
          Parker Conrad. The company in the product, its numbers, the decision log and the founder voice are all
          constructed for this study — a reconstruction written to be argued with, not quotations. No affiliation with
          or endorsement by Rippling.
        </p>
      </main>
    </div>
  );
}
