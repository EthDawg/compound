import Link from "next/link";
import { notFound } from "next/navigation";
import { MANUAL, essayBySlug } from "@/lib/content/manual";
import { Prose, Pill, NextPrev } from "@/components/backstage-ui";
import * as I from "@/components/icons";

export function generateStaticParams() { return MANUAL.map((e) => ({ slug: e.slug })); }

export default async function Essay({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = essayBySlug(slug);
  if (!e) notFound();
  const i = MANUAL.findIndex((x) => x.slug === slug);
  const prev = MANUAL[i - 1], next = MANUAL[i + 1];

  return (
    <article className="max-w-3xl">
      <div className="pt-6">
        <Link href="/companies/rippling/backstage/manual" className="inline-flex items-center gap-1 text-[12.5px] text-ink-500 hover:text-ink-300">
          <I.IChevron className="h-3 w-3 rotate-180" /> The operating manual
        </Link>
      </div>

      <div className="border-b border-white/10 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-signal">Essay {e.n} of {MANUAL.length}</span>
          <span className="text-ink-600">·</span>
          {e.tags.map((t) => <Pill key={t}>{t}</Pill>)}
          <span className="num ml-auto text-[11.5px] text-ink-600">{e.reading}</span>
        </div>
        <h1 className="font-serif-display mt-3 text-[34px] font-normal leading-[1.13] tracking-tight text-white sm:text-[42px]">
          {e.title}
        </h1>
        <p className="prose-measure mt-4 text-[16.5px] leading-[1.6] text-ink-400">{e.deck}</p>
      </div>

      <Prose blocks={e.body} />

      <div className="prose-measure mt-12 rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10">
        <div className="text-[11px] font-bold uppercase tracking-wider text-signal">In one sentence</div>
        <p className="font-serif-display mt-2 text-[19px] leading-[1.45] text-white">{e.thesis}</p>
      </div>

      <NextPrev
        prev={prev ? { href: `/companies/rippling/backstage/manual/${prev.slug}`, label: prev.title } : undefined}
        next={next ? { href: `/companies/rippling/backstage/manual/${next.slug}`, label: next.title } : undefined}
      />
    </article>
  );
}
