'use client';
import Link from 'next/link';
import { HERO_CANDIDATES, HERO_ROLE } from '@/lib/data/hero-session';
import { PageHeading } from '../shell';
import { useHeroFocus, useHeroSession } from './session';
import s from '../study.module.css';
const name = (model: string) => model === 'direct' ? 'Direct employment' : 'HeroForce';
export function HeroPeople() {
  const { state, dispatch } = useHeroSession();
  const focus = useHeroFocus(state, 'hero-model-next');
  const { model, reviewed, saved } = state.people;
  const followUps = HERO_CANDIDATES.filter(p => state.candidates[p.id].followUp);
  return <>
    <PageHeading eyebrow="People / Proposed role" title="Choose who operates the employment.">Use the same proposed role from Recruitment. Compare who carries the work before saving a model; a candidate conversation does not appoint a worker.</PageHeading>
    <div className={s.two}><section className={s.card}><p className={s.label}>Meridian Optics · proposed AU role</p><h2 className="mt-3">{HERO_ROLE}</h2><p className={s.muted}>Melbourne · no worker appointed</p>
      <div className={s.tabs} aria-label="Employment model">{(['direct', 'heroforce'] as const).map(value => <button key={value} aria-pressed={model === value} onClick={() => dispatch({ type: 'people-model', model: value })}>{name(value)}</button>)}</div>
      <p>{model === 'direct' ? 'Meridian is the legal employer and arranges its employment administration through its team or chosen services.' : 'Under the AU HeroForce product description, Employment Hero acts as the legal employer. Meridian chooses who to hire and directs their daily work.'}</p>
      <div className={s.evidence}><p className={s.label}>Saved comparison</p><strong>{saved ? name(saved) : 'No model saved yet'}</strong><p>{saved && saved !== model ? `You are exploring ${name(model)}. The saved comparison is still ${name(saved)} until you review and save the new model.` : 'Saving records the proposed model only. It does not establish eligibility, sign an agreement or activate the service.'}</p></div>
      <h3 id="hero-model-next" tabIndex={-1} className="mt-5">{saved === model && reviewed ? 'Proposed model recorded.' : reviewed ? 'Save this reviewed comparison.' : 'Review the responsibilities.'}</h3>
      <div className={s.actions}><button className={s.button} disabled={!reviewed || saved === model} onClick={() => focus(() => dispatch({ type: 'people-save' }))}>Save proposed model in demo</button><button className={s.secondary} onClick={() => focus(() => dispatch({ type: 'reset', scene: 'people' }))}>Reset model comparison</button></div>
    </section>
    <section className={s.card}><p className={s.label}>Responsibility map · current comparison</p><h2 className="mt-3">{model === 'direct' ? 'Meridian is the employer' : 'Employment Hero is the employer'}</h2><div className={`${s.tablewrap} ${s.section}`}><table className={s.table}><thead><tr><th>Responsibility</th><th>Proposed owner</th></tr></thead><tbody>{[
      ['Select the hire', 'Meridian Optics'], ['Direct daily work', 'Meridian Optics'], ['Legal employer', model === 'direct' ? 'Meridian Optics' : 'Employment Hero / HeroForce'], ['Employment contracts', model === 'direct' ? 'Meridian’s employment operation' : 'HeroForce service'], ['Payroll administration', model === 'direct' ? 'Meridian or its chosen service' : 'HeroForce service'],
    ].map(([responsibility, owner]) => <tr key={responsibility}><td>{responsibility}</td><td>{owner}</td></tr>)}</tbody></table></div><p className={s.small}>Conceptual comparison from the Australian product description. Exact responsibilities, eligibility and geographic scope require the service agreement.</p><button className={`${s.secondary} mt-4`} disabled={reviewed} onClick={() => focus(() => dispatch({ type: 'people-review' }))}>{reviewed ? 'Responsibility map reviewed' : 'Mark responsibility map reviewed'}</button></section></div>
    <section className={`${s.card} ${s.section}`}><p className={s.label}>From Recruitment · {followUps.length} follow-up plan{followUps.length === 1 ? '' : 's'}</p><h2 className="mt-3">A conversation is still a conversation.</h2>{followUps.length ? <ul className={s.checklist}>{followUps.map(person => <li key={person.id}><strong>{person.name}</strong><p>{state.candidates[person.id].followUp}</p><p className={s.small}>Interested in the role. Suitability remains unverified; no worker is assigned to either employment model.</p></li>)}</ul> : <p>No candidate follow-up is planned. You can compare the employment model before anyone is appointed.</p>}<Link href="/companies/employment-hero/app/talent" className={`${s.link} mt-4 inline-block`}>Return to Find Talent →</Link></section>
    <div className={s.callout}><strong>The company’s direction:</strong> employment software is becoming an offer to run employment operations. The meaningful choice is who carries each obligation, not which toggle is selected.</div>
  </>;
}
