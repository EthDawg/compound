"use client";
import Link from "next/link";
import { useState } from "react";
import { companyHref, type CompanyStudy } from "@/lib/companies";
import { TALENT } from "@/lib/data/study-scenarios";
import { PageHeading, StudyAppShell } from "./shell";
import s from "./study.module.css";

const NAV = [["", "Hiring dashboard"], ["recruitment", "Applications"], ["talent", "Clinch · Talent pipeline"], ["paige", "Paige"]] as const;
export function PageUpApp({ company, screen }: { company: CompanyStudy; screen: string }) {
  return <StudyAppShell company={company} screen={screen} nav={NAV}>{screen === "" ? <Home/> : screen === "recruitment" ? <Recruitment/> : screen === "talent" ? <TalentPipeline/> : <Paige/>}</StudyAppShell>;
}
function Home() {
  return <>
    <PageHeading eyebrow="Hiring manager workspace" title="The next step needs a person.">Your optical engineering shortlist is ready for committee review. One review is still outstanding before the hiring manager can proceed.</PageHeading>
    <div className={s.grid}>{[
      ["Jobs", "2", "One role at committee review", "recruitment"], ["Applications", "3", "Candidates for optical engineering", "recruitment"], ["Advertisements", "1", "Careers campaign ready to preview", "talent"],
      ["Selection committee", "1", "Review waiting on you", "recruitment"], ["Interviews", "2", "Completed; evidence ready", "paige"], ["Offers", "0", "Review must finish first", "recruitment"],
    ].map(([title, value, detail, path]) => <Link className={s.card} key={title} href={companyHref("pageup", "app", path)}><p className={s.label}>{title}</p><div className={s.stat}>{value}</div><p className={s.muted}>{detail}</p><div className={`${s.link} mt-4`}>Open workspace →</div></Link>)}</div>
    <div className={`${s.two} ${s.section}`}><section className={s.card}><span className={`${s.badge} ${s.warn}`}>Your next action</span><h2 className="mt-4">Optical Systems Engineer</h2><p className={s.muted}>Engineering · Melbourne · requisition MO-204<br/>Panel: Priya Shah, Marcus Chen and you</p><div className={s.actions}><Link className={s.button} href={companyHref("pageup", "app", "recruitment")}>Review applications</Link><Link className={s.secondary} href={companyHref("pageup", "app", "paige")}>Inspect evidence with Paige</Link></div></section><section className={s.card}><p className={s.label}>Before the next vacancy</p><h2 className="mt-3">Your next candidate may already know you.</h2><p className={s.muted}>Clinch keeps previous interest useful through talent pools, employee stories and nurture.</p><Link className={`${s.link} mt-4 inline-block`} href={companyHref("pageup", "app", "talent")}>Explore the talent pipeline →</Link></section></div>
  </>;
}
function Recruitment() {
  const [selected, setSelected] = useState(0), [reviewed, setReviewed] = useState(false), [note, setNote] = useState("");
  const person = TALENT[selected];
  return <>
    <PageHeading eyebrow="Applications / MO-204" title="Optical Systems Engineer">A reviewable shortlist, with the committee's work kept separate from the hiring decision.</PageHeading>
    <div className={s.strip}><span className={`${s.badge} ${reviewed ? s.good : s.warn}`} role="status">{reviewed ? "Committee review complete · hiring manager decision next" : "1 committee review outstanding"}</span><span className={s.small}>Melbourne · Engineering · fictional hiring process</span></div>
    <div className={s.two}><div className={s.stack}>
      <div className={s.tablewrap}><table className={s.table}><thead><tr><th>Applicant</th><th>Recruitment status</th><th>Your review</th></tr></thead><tbody>{TALENT.map((p, i) => <tr key={p.id} className={selected === i ? s.selected : undefined}><td><button className={s.link} onClick={() => setSelected(i)} aria-pressed={selected === i}>{p.name}</button><div className={s.small}>{p.location}</div></td><td>{i === 2 ? "Initial screening" : "Committee review"}</td><td>{i === 0 ? reviewed ? "Recorded" : "Awaiting you" : "Recorded"}</td></tr>)}</tbody></table></div>
      <section className={s.card}><h2>Where the process stands</h2><ol className={s.journey}><li>Application and selection criteria recorded</li><li>Technical interviews completed for Ava and Leo</li><li>{reviewed ? "Your remaining review recorded" : "Your review of Ava is still required"}</li><li>Hiring manager considers the committee's recommendation</li></ol></section>
    </div><section className={s.card} aria-label="Application review"><p className={s.label}>Applicant record</p><h2 className="mt-3">{person.name}</h2><p className={s.muted}>{person.fit}</p><div className={s.evidence}><strong>Evidence to check</strong><p>{person.excerpt}</p><div className={s.small}>{person.source}</div></div><p className={s.small}>{person.gap}</p>
      {selected === 0 ? <><label className={s.field}>Your review note<textarea className={s.input} value={note} onChange={e => setNote(e.target.value)} rows={3} disabled={reviewed} placeholder="Record the evidence and what still needs checking"/></label><div className={s.actions}><button className={s.button} disabled={reviewed || note.trim().length < 10} onClick={() => setReviewed(true)}>{reviewed ? "Review recorded" : "Record demo review"}</button>{reviewed && <button className={s.secondary} onClick={() => {setReviewed(false);setNote("");}}>Reset review</button>}</div><p className={s.small}>Use at least 10 characters. Recording a review does not hire or reject anyone.</p></> : <p className={s.callout}>Your review is already recorded for this applicant. {reviewed ? "The committee's reviews are complete; the hiring manager acts next." : "Ava's outstanding review is the committee's next action."}</p>}
    </section></div>
    <div className={s.callout}><strong>The PageUp idea:</strong> the workbench coordinates responsibility across a configured hiring process. Finishing a review changes who acts next; it does not collapse every step into “hired”.</div>
  </>;
}
const SEGMENTS = [
  { name: "Engaged prospects", count: 24, signal: "Read a laboratory careers story in the last 30 days", next: "Invite to an optical engineering Q&A" },
  { name: "Unfinished applications", count: 8, signal: "Started an application but have not submitted", next: "Offer application help and a reminder" },
  { name: "Previous suitable applicants", count: 12, signal: "Previously assessed; opted in to future opportunities", next: "Share the new role and ask about current interest" },
];
function TalentPipeline() {
  const [segment, setSegment] = useState(0), [active, setActive] = useState<number[]>([]); const current = SEGMENTS[segment];
  return <>
    <PageHeading eyebrow="PageUp Clinch / Talent pipeline" title="Start with the interest you already earned.">Careers content, talent pools and nurture sit upstream of the formal application. This scene uses a separate Clinch workspace to keep that product lineage visible.</PageHeading>
    <div className={s.tabs} aria-label="Candidate segment">{SEGMENTS.map((x, i) => <button key={x.name} aria-pressed={segment === i} onClick={() => setSegment(i)}>{x.name} · {x.count}</button>)}</div>
    <div className={s.two}><section className={s.card}><div className={s.strip}><h2>{current.name}</h2><span className={s.badge}>{current.count} fictional contacts</span></div><p>{current.signal}.</p><div className={s.evidence}><p className={s.label}>Candidate relationship trail</p><ol className={s.journey}><li>Expressed interest and opted in to relevant updates</li><li>{current.signal}</li><li>No assumption that the person is ready to apply</li></ol></div><h3 className="mt-6">Employee voices give the role substance</h3><p className={s.muted}>“What does a validation week actually involve?”</p><p className={s.small}>Illustrative employee Q&A content: a lab engineer explains design reviews, testing and how the team handles failed prototypes. Inspired by the PathMotion / Employee Connections capability.</p></section>
    <section className={s.card}><p className={s.label}>Nurture preview</p><h2 className="mt-3">A relevant reason to reconnect</h2><ol className={s.journey}><li><div><strong>Day 1 · {current.next}</strong><p>Link to the employee Q&A and offer a clear next step.</p></div></li><li><div><strong>Day 5 · Follow the response</strong><p>Continue only for the appropriate segment; honour contact preferences and opt-outs.</p></div></li></ol><div className={s.actions}><button className={s.button} disabled={active.includes(segment)} onClick={() => setActive([...active, segment])}>{active.includes(segment) ? "Demo sequence queued" : "Simulate nurture sequence"}</button></div><p className={s.small} role="status">{active.includes(segment) ? `${current.count} fictional contacts in the demo queue. No messages sent; no conversion uplift assumed.` : "Preview only. Every count and contact in this scene is fictional."}</p></section></div>
    <div className={s.callout}><strong>What compounds:</strong> useful candidate relationships. The test is qualified applications from current, consenting interest—not the number of names stored in a CRM.</div>
  </>;
}
function Paige() {
  const [query, setQuery] = useState("evidence"), [selected, setSelected] = useState(0), [citation, setCitation] = useState(false), [saved, setSaved] = useState<string[]>([]); const p = TALENT[selected];
  return <>
    <PageHeading eyebrow="Paige / Hiring context" title="An answer you can inspect.">Choose a scoped question. This is a scripted demonstration of evidence-backed assistance, not a live model or an automated hiring decision.</PageHeading>
    <div className={s.tabs} aria-label="Suggested Paige question"><button aria-pressed={query === "evidence"} onClick={() => setQuery("evidence")}>What evidence supports this shortlist?</button><button aria-pressed={query === "waiting"} onClick={() => setQuery("waiting")}>What is waiting on me?</button></div>
    {query === "waiting" ? <section className={s.card}><p className={s.label}>Paige · response</p><h2 className="mt-3">Your committee review for MO-204 is outstanding.</h2><p className={s.muted}>Ava's application needs your review note. Completing it lets the hiring manager consider the recommendation; it does not authorise an offer.</p><p className={s.small}>Source: fictional requisition MO-204 · review task. Each scene starts with the same baseline.</p><Link className={`${s.button} mt-5`} href={companyHref("pageup", "app", "recruitment")}>Open application review</Link></section> : <div className={s.two}><section className={s.card}><p className={s.label}>Paige · candidate evidence</p><h2 className="mt-3">Relevant experience, with gaps still visible.</h2><p className={s.muted}>The records support different aspects of the role. They do not establish a complete hiring recommendation.</p><div className={s.tabs}>{TALENT.map((x, i) => <button key={x.id} aria-pressed={selected === i} onClick={() => {setSelected(i);setCitation(false);}}>{x.name}</button>)}</div><h3>{p.name}</h3><ul className={s.checklist}><li><strong>Evidence present</strong><br/>{p.fit}</li><li><strong>Still to verify</strong><br/>{p.gap}</li></ul><button className={`${s.link} mt-4`} aria-expanded={citation} onClick={() => setCitation(!citation)}>Inspect source [1] →</button><div className={s.actions}><button className={s.button} disabled={saved.includes(p.id)} onClick={() => setSaved([...saved, p.id])}>{saved.includes(p.id) ? "Added to your review list" : "Add to demo review list"}</button></div><p className={s.small} role="status">{saved.length} added · a human review step, not a selection outcome</p></section>
      <aside className={s.card} aria-label="Source evidence"><p className={s.label}>Evidence drawer</p><h2 className="mt-3">{citation ? p.source : "Follow the citation"}</h2>{citation ? <><div className={s.evidence}>{p.excerpt}</div><p className={s.small}>This excerpt is invented for the study. No real applicant data is used.</p></> : <p className={s.muted}>Open source [1] to compare the response with the exact record excerpt. Missing evidence stays missing.</p>}</aside></div>}
    <div className={s.callout}><strong>The strategic shift:</strong> Paige makes accumulated hiring context easier to use. Citation-backed reasoning is valuable precisely when the reviewer can see what the answer does not establish.</div>
  </>;
}
