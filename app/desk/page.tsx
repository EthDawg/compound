import Link from "next/link";
import { StudyLink } from "@/components/study-link";
import { Desk } from "@/components/desk";
import * as I from "@/components/icons";

export const metadata = {
  title: "The desk — prioritisation and the remote",
  description: "One place: what this is for, what to look at next, and the phrases to run when you want the map to move.",
};

export default function DeskPage() {
  return (
    <div className="min-h-screen bg-ink text-ink-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-signal text-ink">
              <I.ILayers className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Compound</span>
          </Link>
          <span className="hidden text-[12.5px] text-ink-500 sm:block">· the desk</span>
          <div className="ml-auto flex gap-2">
            <Link href="/ecosystem" className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">The map</Link>
            <StudyLink surface="backstage" className="inline-flex h-8 items-center rounded-md bg-white/10 px-3 text-[12.5px] font-medium text-white hover:bg-white/15">Backstage</StudyLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 pb-20 sm:px-6">
        <div className="border-b border-white/10 py-9">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">The desk</div>
          <h1 className="font-serif-display mt-2 max-w-3xl text-[34px] font-normal leading-[1.13] tracking-tight text-white sm:text-[42px]">
            One place, so the rest stays small
          </h1>
          <p className="prose-measure mt-4 text-[16.5px] leading-[1.65] text-ink-300">
            This is not a control panel and there is no job running behind it. It is the remote: what the map is for,
            what has gone stale, and the phrases to paste in when you want something to change. A human decides when
            this project moves, which is the only thing keeping it a point of view rather than a feed.
          </p>
        </div>

        <div className="py-8">
          <Desk />
        </div>
      </main>
    </div>
  );
}
