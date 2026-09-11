import Link from 'next/link';
import { CompanyPicker } from './company-picker';
import { ILayers } from './icons';

/** Compound owns the wayfinding; company product skins live below it. */
export function GuideHeader({activeId = ''}: {activeId?: string}) {
  return <header className="guide-header border-b border-[#DDDCD4] bg-[#FBFBF7]">
    <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Compound home"><span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-signal"><ILayers className="h-4 w-4" /></span><span className="text-[15px] font-semibold tracking-tight">Compound</span></Link>
      <span className="mr-auto hidden pl-4 text-[11px] text-ink-500 lg:block">Technology, from the inside out.</span>
      <CompanyPicker activeId={activeId} searchTrigger />
      <Link href="/about" className="hidden rounded-md p-2 text-xs font-medium text-ink-500 hover:bg-black/5 sm:block">About</Link>
    </div>
  </header>;
}
