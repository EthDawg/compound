'use client';
import Link from 'next/link';
import { useState } from 'react';
import { heroPay } from '@/lib/data/hero-session';
import { PageHeading } from '../shell';
import { money, useHeroFocus, useHeroSession } from './session';
import s from '../study.module.css';
const labels = { prepared: 'Review required', corrected: 'Corrected · review the run', reviewed: 'Ready to finalise', finalised: 'Finalised · unpublished', published: 'Summary published' };
const activity: Record<string, string> = {
  'payroll-inspect': 'Approved timesheet compared with the imported entry: 2 hours versus 4.',
  'payroll-correct': 'Ava’s draft overtime corrected to 2 hours. Gross run reduced by $120 to $9,720.',
  'payroll-restore': 'Imported hours restored. The correction and run review must be repeated.',
  'payroll-review': 'Corrected gross earnings reviewed for all three people.',
  'payroll-finalise': 'Demo run finalised at $9,720 gross. Employee publication is still separate.',
  'payroll-publish': 'Illustrative earnings summary published to the employee preview. No money moved.',
};
export function HeroPayroll() {
  const { state, dispatch, events } = useHeroSession();
  const [expanded, setExpanded] = useState(false);
  const focus = useHeroFocus(state, 'hero-payroll-next');
  const act = (type: 'payroll-inspect' | 'payroll-correct' | 'payroll-restore' | 'payroll-review' | 'payroll-finalise' | 'payroll-publish') => focus(() => dispatch({ type }));
  const { phase, inspected } = state.payroll;
  const run = heroPay(state);
  const locked = phase === 'finalised' || phase === 'published';
  const records = events.filter(event => event.type.startsWith('payroll-'));
  return <>
    <PageHeading eyebrow="Payroll / Fortnightly / AU demo" title="Prepare the run. Stop at the exception.">One imported time entry differs from its approved source. Carry the correction through review and publication, then see what the employee can see.</PageHeading>
    <div className={s.grid}>
      <section className={s.card}><p className={s.label}>Illustrative gross earnings</p><div className={s.stat}>{money(run.gross)}</div><p className={s.small}>3 fictional people · ordinary + overtime</p></section>
      <section className={s.card}><p className={s.label}>Warnings</p><div className={s.stat}>{run.warnings}</div><p className={s.small}>{phase === 'prepared' ? 'Time-entry review required' : '$120 correction retained in the record'}</p></section>
      <section className={s.card}><p className={s.label}>Run status</p><p className={s.name} role="status">{labels[phase]}</p><p className={s.small}>Finalisation, publication and payment are distinct.</p></section>
    </div>
    <div className={`${s.two} ${s.section}`}>
      <div className={s.stack}>
        <div className={s.tablewrap}><table className={s.table}><caption className={s.srOnly}>Gross earnings for this illustrative pay run</caption><thead><tr><th>Employee</th><th>Ordinary</th><th>Overtime</th><th>Gross</th></tr></thead><tbody>
          <tr><td className={s.name}>Ava Nguyen</td><td>$3,200</td><td>{money(run.overtimeAmount)}</td><td>{money(3200 + run.overtimeAmount)}</td></tr>
          <tr><td>Leo Martin</td><td>$3,600</td><td>—</td><td>$3,600</td></tr>
          <tr><td>Mina Patel</td><td>$2,800</td><td>—</td><td>$2,800</td></tr>
        </tbody></table></div>
        <section className={s.card}><div className={s.strip}><h2>Ava · overtime discrepancy</h2><span className={`${s.badge} ${phase === 'prepared' ? s.warn : s.good}`}>{phase === 'prepared' ? 'Needs attention' : 'Corrected'}</span></div>
          <p className={s.muted}>The imported entry contains four hours; the approved timesheet records two. The warning pauses this fictional run.</p>
          <button className={`${s.secondary} mt-4`} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide timesheet evidence' : 'Review timesheet evidence →'}</button>
          {expanded && <div className={s.evidence}><strong>Timesheet MO-AU-0910 · Ava Nguyen</strong><p>Approved overtime: 2 hours<br/>Imported overtime: 4 hours<br/>Invented overtime rate: $60 / hour</p><p>The source supports $120 of overtime, reducing the draft by $120. These are scenario rates, not award interpretation.</p>
            <button className={`${s.secondary} mt-4`} disabled={inspected || phase !== 'prepared'} onClick={() => act('payroll-inspect')}>{inspected ? 'Source comparison recorded' : 'Mark source comparison reviewed'}</button>
          </div>}
        </section>
      </div>
      <section className={s.card} aria-label="Pay run actions"><p className={s.label}>Next step</p><h2 id="hero-payroll-next" tabIndex={-1} className="mt-3">{phase === 'prepared' ? 'Correct the evidenced difference.' : phase === 'corrected' ? 'Review the corrected run.' : phase === 'reviewed' ? 'Finalise this version.' : phase === 'finalised' ? 'Choose what the employee sees.' : 'The employee summary is available.'}</h2>
        <p>{phase === 'prepared' ? 'Compare the source before changing earnings.' : phase === 'corrected' ? 'Ava is now $3,320; Leo and Mina are unchanged. Check the whole $9,720 gross run before finalisation.' : phase === 'reviewed' ? 'The corrected values have been reviewed. Finalisation locks this demo version; it does not pay anyone.' : phase === 'finalised' ? 'The run is locked, but the employee preview still has no published summary. Publish deliberately.' : 'The preview below shows Ava’s corrected gross earnings. Payment and statutory filing are outside this example.'}</p>
        <div className={s.actions}>
          {phase === 'prepared' && <button className={s.button} disabled={!inspected} onClick={() => act('payroll-correct')}>Use approved 2 hours</button>}
          {phase === 'corrected' && <button className={s.button} onClick={() => act('payroll-review')}>Confirm corrected run reviewed</button>}
          {phase === 'reviewed' && <button className={s.button} onClick={() => act('payroll-finalise')}>Finalise demo run</button>}
          {phase === 'finalised' && <button className={s.button} onClick={() => act('payroll-publish')}>Publish demo earnings summary</button>}
          {phase === 'published' && <a className={s.button} href="#employee-preview">View employee summary ↓</a>}
          {!locked && phase !== 'prepared' && <button className={s.secondary} onClick={() => act('payroll-restore')}>Restore imported hours</button>}
          <button className={s.secondary} onClick={() => { setExpanded(false); focus(() => dispatch({ type: 'reset', scene: 'payroll' })); }}>Reset pay run</button>
        </div>
        <p className={s.small}>No bank transaction, tax, superannuation or statutory filing is calculated or performed.</p>
      </section>
    </div>
    <div className={`${s.two} ${s.section}`}>
      <section id="employee-preview" className={`${s.card} ${s.employeePreview}`}><p className={s.label}>EH Work · illustrative employee view</p><h2 className="mt-3">Ava’s pay information</h2>
        {phase === 'published' ? <><span className={`${s.badge} ${s.good} mt-4`}>Published summary · this demo run</span><div className={s.stat}>$3,320</div><p>Gross earnings · $3,200 ordinary + $120 overtime</p><p className={s.small}>The approved two-hour entry is reflected here. This gross-only teaching summary is not a payslip, a net-pay calculation or confirmation that Ava has been paid.</p></> : <><span className={`${s.badge} ${s.warn} mt-4`}>No published summary</span><p>{locked ? 'The employer has finalised this run but has not published it.' : 'The employer is still preparing and reviewing this run.'} Draft earnings stay out of this employee view.</p></>}
        <Link href="/companies/employment-hero/app" className={`${s.link} mt-4 inline-block`}>See the same status on Home →</Link>
      </section>
      <section className={s.card}><h2>Run record</h2>{records.length ? <ol className={s.checklist}>{records.map((event, index) => <li key={index}>{activity[event.type]}</li>)}</ol> : <p className={s.muted}>The imported draft is awaiting its first review.</p>}</section>
    </div>
    <div className={s.callout}><strong>What the acquisitions explain:</strong> KeyPay brought the engine and partner channel; Employment Innovations brought operational expertise. Removing payroll work depends on explaining exceptions and preserving the decision through the employee’s experience.</div>
  </>;
}
