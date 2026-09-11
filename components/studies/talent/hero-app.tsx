'use client';
import Link from 'next/link';
import { type CompanyStudy } from '@/lib/companies';
import { heroCounts, heroPay } from '@/lib/data/hero-session';
import { PageHeading, StudyAppShell } from './shell';
import { HeroPayroll } from './hero/payroll';
import { HeroTalent } from './hero/talent';
import { HeroPeople } from './hero/people';
import { money, useHeroSession } from './hero/session';
import s from './study.module.css';
const NAV = [['', 'Home'], ['payroll', 'Payroll'], ['talent', 'Recruitment · Find Talent'], ['people', 'People']] as const;
export function HeroApp({ company, screen }: { company: CompanyStudy; screen: string }) {
  const { ready, full, dispatch } = useHeroSession();
  return <StudyAppShell company={company} screen={screen} nav={NAV}>
    {full && <div className={s.callout} role="status">This session’s demonstration record is full. Reset a scene to keep exploring.<div className={s.actions}>{(['payroll', 'candidate', 'people'] as const).map(scene => <button key={scene} className={s.secondary} onClick={() => dispatch({ type: 'reset', scene })}>Reset {scene === 'candidate' ? 'talent' : scene}</button>)}</div></div>}
    {!ready ? <section className={s.card} role="status" aria-busy="true"><p className={s.label}>Employment Hero</p><h1 className={s.heading}>Opening your workspace…</h1><p>Restoring this browser session.</p></section> : screen === '' ? <Home/> : screen === 'payroll' ? <HeroPayroll/> : screen === 'talent' ? <HeroTalent/> : <HeroPeople/>}
  </StudyAppShell>;
}
function Home() {
  const { state } = useHeroSession();
  const counts = heroCounts(state);
  const phase = state.payroll.phase;
  const published = phase === 'published';
  const next = phase === 'prepared' ? 'One time entry needs you.' : phase === 'corrected' ? 'The exception is corrected. Review the whole run.' : phase === 'reviewed' ? 'Your reviewed run is ready to finalise.' : phase === 'finalised' ? 'Finalised. The employee summary is still unpublished.' : 'The corrected summary is available to Ava.';
  return <>
    <PageHeading eyebrow="Employment operating system" title="Less employment admin. Clearer decisions.">Pick up the same work across payroll, recruitment and employment operations. Home reflects this browser session, including what remains unresolved.</PageHeading>
    <section className={s.hero}><span className={`${s.badge} ${published ? s.good : s.warn}`}>{published ? 'Payroll · summary published' : 'Payroll · next step available'}</span><h2 className="mt-4">{next}</h2><p>{money(heroPay(state).gross)} illustrative gross · three people. {published ? 'The employee preview shows the approved two-hour overtime entry. Payment and filing remain outside this example.' : phase === 'finalised' ? 'The reviewed values are locked. Decide when to make the illustrative summary available to the employee.' : phase === 'reviewed' ? 'The corrected version has been reviewed. Finalisation is the next control; employee publication comes after it.' : phase === 'corrected' ? 'Ava’s overtime is corrected to two hours. Review all three gross amounts before finalising.' : 'Compare the imported four hours with the approved two-hour timesheet before changing the run.'}</p><Link className={`${s.button} mt-5`} href="/companies/employment-hero/app/payroll">{published ? 'View pay run & employee summary →' : 'Continue pay run →'}</Link></section>
    <div className={s.grid}>
      <Link className={s.card} href="/companies/employment-hero/app/talent"><p className={s.label}>Find Talent</p><h2 className="mt-4">{counts.invited ? `${counts.interested} interested of ${counts.invited} invited` : 'Begin with people who opted in.'}</h2><p className={s.muted}>{counts.invited ? `${counts.declined} declined · ${counts.pending + counts.unanswered} without a reply. ${counts.followUps} follow-up plan${counts.followUps === 1 ? '' : 's'} recorded; suitability remains open.` : 'Inspect three profiles, invite with context and see why interest differs from a match.'}</p><div className={`${s.link} mt-5`}>Continue candidate conversations →</div></Link>
      <Link className={s.card} href="/companies/employment-hero/app/people"><p className={s.label}>People / HeroForce</p><h2 className="mt-4">{state.people.saved ? `${state.people.saved === 'direct' ? 'Direct employment' : 'HeroForce'} proposed` : 'Who will run the employment?'}</h2><p className={s.muted}>{state.people.saved ? 'The responsibility comparison is saved. No worker is appointed and no service agreement is active.' : 'Compare legal employer, payroll administration and daily direction for the same proposed role.'}</p><div className={`${s.link} mt-5`}>Review responsibility map →</div></Link>
      <section className={s.card}><p className={s.label}>Employee side / EH Work</p><h2 className="mt-4">{published ? 'Ava can see the corrected summary.' : phase === 'finalised' ? 'Awaiting employee publication.' : 'Draft pay stays with the employer.'}</h2><p className={s.muted}>{published ? 'The employee view reflects the published two-hour entry. A visible summary is not a payment receipt.' : 'Finalising and publishing are separate steps. The employee preview stays empty until publication.'}</p><Link className={`${s.link} mt-5 inline-block`} href="/companies/employment-hero/app/payroll#employee-preview">Open employee preview →</Link></section>
    </div>
  </>;
}
