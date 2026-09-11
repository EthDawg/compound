'use client';
import Link from 'next/link';
import { HERO_CANDIDATES, HERO_ROLE, heroCounts } from '@/lib/data/hero-session';
import { PageHeading } from '../shell';
import { useHeroFocus, useHeroSession } from './session';
import s from '../study.module.css';
export function HeroTalent() {
  const { state, drafts, setDraft, dispatch } = useHeroSession();
  const focus = useHeroFocus(state, 'hero-candidate-next');
  const focusProfile = useHeroFocus(state, 'hero-candidate-profile', true);
  const counts = heroCounts(state);
  const visible = HERO_CANDIDATES.filter(p => drafts.scope === 'all' || (drafts.scope === 'melbourne' ? p.location === 'Melbourne' : state.candidates[p.id].saved));
  const person = visible.find(p => p.id === drafts.selected) ?? visible[0];
  const progress = person && state.candidates[person.id];
  const invitation = person ? drafts.invitations[person.id] ?? '' : '';
  const followUp = person ? drafts.followUps[person.id] ?? '' : '';
  const act = (type: 'candidate-review' | 'candidate-save' | 'candidate-invite' | 'candidate-reply' | 'candidate-follow-up', note?: string) => person && focus(() => dispatch({ type, id: person.id, note }));
  return <>
    <PageHeading eyebrow="Recruitment / Find Talent" title="A match is the beginning of a conversation.">Inspect three opt-in profiles for the same Melbourne role. Invite with context, receive a fictional reply, and decide what is worth following up.</PageHeading>
    <div className={s.tabs} aria-label="Talent search scope">{([['all', `Search by job · ${HERO_ROLE}`], ['melbourne', 'Melbourne only'], ['saved', `Saved · ${counts.saved}`]] as const).map(([scope, label]) => <button key={scope} aria-pressed={drafts.scope === scope} onClick={() => setDraft({ scope })}>{label}</button>)}</div>
    <section className={`${s.card} ${s.responseSummary}`} aria-label="Invitation outcomes"><div><strong>{counts.invited}</strong><span>invited of 3 profiles</span></div><div><strong>{counts.interested}</strong><span>interested</span></div><div><strong>{counts.declined}</strong><span>declined</span></div><div><strong>{counts.pending + counts.unanswered}</strong><span>without a reply</span></div><p>{counts.invited ? `${counts.pending} awaiting a scenario outcome · ${counts.unanswered} still unanswered after the final reminder.` : 'No invitations yet. Saving a profile does not contact that person.'} Responses are not applications or evidence of job suitability.</p></section>
    <div className={`${s.talentColumns} ${s.section}`}>
      <section id="hero-candidate-list" className={s.stack} aria-label="Candidate profiles">
        {visible.map(p => { const record = state.candidates[p.id]; return <button key={p.id} className={`${s.card} ${s.candidateCard}`} aria-pressed={p.id === person?.id} onClick={() => focusProfile(() => { setDraft({ selected: p.id }); return true; })}><div className={s.strip}><h2>{p.name}</h2><span className={s.badge}>{p.location}</span></div><p>{p.role}</p><p className={s.muted}>{p.fit}</p><p className={s.small}>{record.followUp ? 'Follow-up planned · evidence gap still open' : record.response === 'interested' ? 'Interested in this role' : record.response === 'declined' ? 'Declined this role' : record.response === 'unanswered' ? 'Unanswered · interest unknown' : record.invitation ? 'Invitation recorded · awaiting reply' : record.saved ? 'Saved · no invitation yet' : 'Opted in to discovery'}</p></button>; })}
        {!visible.length && <div className={s.card}><h2>No saved profiles yet.</h2><p>Open a profile and save it for later. That does not imply the candidate has agreed to apply.</p><button className={`${s.secondary} mt-4`} onClick={() => setDraft({ scope: 'all' })}>Browse all three profiles</button></div>}
      </section>
      {person && progress && <aside className={s.card} aria-label="Selected candidate"><p className={s.label}>Profile evidence</p><h2 id="hero-candidate-profile" tabIndex={-1} className="mt-3">{person.name}</h2><a href="#hero-candidate-list" className={`${s.link} mt-3 inline-block`}>Back to profiles ↑</a><p className={s.muted}>Criteria supported: {person.fit}</p><div className={s.evidence}>{person.excerpt}<p className={s.small}>{person.source}</p></div><p><strong>{progress.response ? "Profile gap at discovery:" : "Still to verify:"}</strong> {person.gap}</p>
        <p className={s.small}>Opted in to discovery; contact through the platform in this scenario. These external jobseekers are separate from Ava, Leo and Mina in Payroll.</p>
        <div className={s.actions}><button className={s.secondary} disabled={progress.saved} onClick={() => act('candidate-save')}>{progress.saved ? 'Saved to talent pool' : 'Save to talent pool'}</button><button className={s.secondary} disabled={progress.reviewed} onClick={() => act('candidate-review')}>{progress.reviewed ? 'Profile evidence reviewed' : 'Mark profile evidence reviewed'}</button></div>
        <section className={s.evidence} aria-label="Candidate next step"><h3 id="hero-candidate-next" tabIndex={-1}>{progress.followUp ? 'Follow up on the missing evidence.' : progress.response === 'interested' ? 'Interest is established. Suitability is open.' : progress.response === 'declined' ? 'Respect the decline.' : progress.response === 'unanswered' ? 'Silence leaves interest unknown.' : progress.invitation ? 'The candidate owns the reply.' : 'Make the invitation specific.'}</h3>
          {!progress.invitation && <><label className={s.field}>Invitation context<textarea className={s.input} rows={3} maxLength={1000} value={invitation} onChange={e => setDraft({ invitations: { ...drafts.invitations, [person.id]: e.target.value } })} aria-describedby="hero-invitation-help"/></label><p id="hero-invitation-help" className={s.small}>Use at least 10 characters. Explain the Melbourne role and the open question; no message will be sent.</p><button className={`${s.button} mt-4`} disabled={!progress.reviewed || invitation.trim().length < 10} onClick={() => act('candidate-invite', invitation)}>Simulate invitation</button></>}
          {progress.invitation && <><p className={s.label}>Recorded invitation</p><p>{progress.invitation}</p></>}
          {progress.invitation && !progress.response && <><p>The invitation does not establish willingness to apply. Open the next scripted outcome to see this candidate’s response, or lack of one.</p><button className={`${s.button} mt-4`} onClick={() => act('candidate-reply')}>Receive fictional outcome</button></>}
          {progress.response && <><p className={s.label}>Scenario outcome</p><blockquote className={s.reply}>{person.replyText}</blockquote></>}
          {progress.response === 'interested' && !progress.followUp && <><p>The original evidence gap remains: {person.gap}</p><label className={s.field}>Follow-up question<textarea className={s.input} rows={3} maxLength={1000} value={followUp} onChange={e => setDraft({ followUps: { ...drafts.followUps, [person.id]: e.target.value } })} aria-describedby="hero-followup-help"/></label><p id="hero-followup-help" className={s.small}>At least 10 characters. Record what you need to learn before progressing; this only saves a local plan.</p><button className={`${s.button} mt-4`} disabled={followUp.trim().length < 10} onClick={() => act('candidate-follow-up', followUp)}>Save follow-up plan</button></>}
          {progress.followUp && <><p><strong>Planned question:</strong> {progress.followUp}</p><p>Nothing is scheduled or sent. No application, offer or employee record has been created.</p><Link className={`${s.link} mt-4 inline-block`} href="/companies/employment-hero/app/people">Review the proposed role’s operating model →</Link></>}
          {progress.response === 'declined' && <p>This invitation is closed. The scenario offers no repeat invitation or follow-up action for a person who declined.</p>}
          {progress.response === 'unanswered' && <p>The final reminder has passed in this fixture. The record stays unanswered, with no assumption of interest or rejection.</p>}
        </section>
      </aside>}
    </div>
    <div className={s.actions}><button className={s.secondary} onClick={() => focus(() => dispatch({ type: 'reset', scene: 'candidate' }))}>Reset talent scenario</button><Link className={s.link} href="/companies/employment-hero/app">See Home’s follow-up count →</Link></div>
    <div className={s.callout}><strong>The network test:</strong> count interested people against invitations, then inspect the evidence before progressing. The replies and follow-up plan here are fictional teaching steps, not a claim that Find Talent has an organisation-interest feed or this exact workflow.</div>
  </>;
}
