'use client';
import { useState } from 'react';
import { launchArtifact, workCanRevise, workCurrent, workSources, type WorkSource } from '@/lib/data/openai-session';
import { SceneTitle, Insight } from '../frame';
import { useOpenAIFocus, type OpenAISceneProps } from './session';
import s from '../studies.module.css';

export function OpenAIWork({ session }: OpenAISceneProps) {
  const { state, dispatch, ready } = session, work = state.work;
  const [nav, setNav] = useState('sources');
  const sources = workSources(work), current = workCurrent(work), stale = !!work.artifactVersion && !current;
  const focus = useOpenAIFocus(state, 'work-artifact');
  const sourceFocus = useOpenAIFocus(state, 'work-source');
  return <><SceneTitle product="ChatGPT Work · Harbour launch project" title="Turn the launch context into a decision document." detail="Reconcile the sources, then see what happens when the support plan changes. The deliverable must keep up with the evidence." />
    {!ready ? <p className={s.muted}>Restoring this browser’s example…</p> : <div className={s.workbench}>
      <aside className={s.rail}><h2>Harbour launch</h2><div className={s.tabs}><button aria-pressed={nav === 'chats'} onClick={() => setNav('chats')}>Chats</button><button aria-pressed={nav === 'sources'} onClick={() => setNav('sources')}>Sources</button></div>
        {nav === 'sources' ? <>{Object.entries(sources).map(([id, file]) => { const version = id === 'support' ? work.supportVersion : 1; return <button key={id} aria-pressed={work.source === id} onClick={() => sourceFocus(() => dispatch({ type: 'work-source', source: id as WorkSource }))}>{file.title}<small className={s.tabStatus}>v{version} · {work.inspected[id as WorkSource] === version ? 'Inspected' : 'Needs inspection'}</small></button>; })}<p>Project instructions<br />Signed scope governs the target. Readiness determines what is still unresolved.</p></> : <><button aria-pressed>Launch decision · current task</button><p>{stale ? 'A new source is available. The earlier document remains visible for comparison.' : current ? 'The document follows the sources inspected in this project.' : 'An unreviewed draft is waiting for source reconciliation.'}</p><button className={s.link} onClick={() => setNav('sources')}>Review the project sources →</button></>}
      </aside>
      <section className={s.centre}><div className={s.prompt}>“Prepare the launch decision document. Flag anything that prevents us from using it.”</div>
        <h2>{stale ? 'The support evidence has changed.' : work.artifactVersion === 2 ? 'The new blocker is in the document.' : current ? 'The sources are reconciled.' : 'The first draft followed the wrong source.'}</h2>
        <p className={s.muted}>{stale ? 'The previous draft still says ANZ support is staffed. Inspect support version 2 before revising it.' : 'Scope, readiness and launch approval answer different questions. Keep all three visible.'}</p>
        <div id="work-source" tabIndex={-1} className={`${s.document} ${s.focusTarget} mt-5`}><p className={s.fileTitle}>{sources[work.source].title} · v{work.source === 'support' ? work.supportVersion : 1} · fictional source</p><p>{sources[work.source].text}</p>{work.inspected.scope !== 1 && work.source !== 'scope' ? <button className={`${s.link} mt-4`} onClick={() => sourceFocus(() => dispatch({ type: 'work-source', source: 'scope' }))}>Inspect the signed scope →</button> : work.inspected.support !== work.supportVersion && work.source !== 'support' ? <button className={`${s.link} mt-4`} onClick={() => sourceFocus(() => dispatch({ type: 'work-source', source: 'support' }))}>Inspect support readiness →</button> : null}</div>
        <label className={s.label}>Scope to use<select className={s.input} value={work.scope} onChange={e => dispatch({ type: 'work-scope', scope: e.target.value as 'all' | 'anz' })}><option value="all">Five regions · 1 October</option><option value="anz">Australia & New Zealand · 15 October</option></select></label>
        <button className={s.button} disabled={!workCanRevise(work)} onClick={() => focus(() => dispatch({ type: 'work-revise' }))}>Revise the demo work product</button>
        <p className={s.small} role="status">{stale ? 'The old draft is retained, but its download is paused until the new source is reconciled.' : current ? 'The latest inspected sources are reflected. Launch-owner approval remains separate.' : 'Inspect the signed scope and current support note, then choose the supported scope.'}</p>
        {work.artifactVersion === 1 && work.supportVersion === 1 && <div className={s.nextEvent}><h3>A week later</h3><p>The support roster changes. Explore how that affects a document that was previously ready for review.</p><button className={s.secondary} onClick={() => focus(() => dispatch({ type: 'work-update' }))}>Introduce the support update</button></div>}
      </section>
      <section className={s.preview}><h2 id="work-artifact" tabIndex={-1} className={s.focusTarget}>Launch decision.md</h2><div className={`${s.row} mt-3`}><span className={`${s.badge} ${stale ? s.warn : current ? s.good : ''}`}>{stale ? 'Source changed · refresh needed' : work.artifactVersion === 2 ? 'Blocker recorded' : current ? 'Sources reconciled' : 'Unreviewed draft'}</span><span className={s.small}>Revision {work.artifactVersion ? work.artifactVersion + 1 : 1}</span></div>
        <article className={`${s.document} mt-5`}><p className={s.fileTitle}>Work product · {stale ? 'previous version' : 'current version'}</p><h3>{work.artifactVersion === 2 ? 'ANZ remains the scope. NZ is not ready.' : work.artifactVersion === 1 ? 'An ANZ launch, with approval still open.' : 'Five regions on 1 October?'}</h3>
          <p>{work.artifactVersion ? 'The signed scope is Australia and New Zealand, with a target of 15 October 2026.' : 'The working brief suggests five regions on 1 October. This draft has not yet been reconciled against the signed scope.'}</p>
          <p>{work.artifactVersion === 2 ? 'Australia remains staffed. New Zealand support coverage is now unconfirmed. The source update does not itself change the signed launch scope.' : work.artifactVersion === 1 ? 'The inspected support note confirms ANZ coverage. Release still needs the launch owner’s sign-off.' : 'The signed scope and support evidence must be inspected before this document is used.'}</p>
          {work.artifactVersion === 2 && <p><strong>Next decision:</strong> hold release until New Zealand coverage is restored or the owner approves a revised launch plan.</p>}
          {!!work.artifactVersion && <p className={s.small}>Sources: Signed scope.txt v1; Support readiness.md v{work.artifactVersion}. The working brief is superseded.</p>}
        </article>
        <div className={s.actions}>{stale && <button className={s.secondary} onClick={() => sourceFocus(() => dispatch({ type: 'work-source', source: 'support' }))}>Inspect the updated support note →</button>}{current ? <a className={s.button} download="Harbour-launch-decision.md" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(launchArtifact(work))}`}>Download reviewed draft ↓</a> : <button className={s.secondary} disabled>{stale ? 'Refresh before download' : 'Resolve sources before download'}</button>}</div>
        <p className={s.small}>This is a planning artifact. No launch has been authorised or performed.</p>
      </section>
    </div>}
    <Insight><strong>The front door has to lead somewhere.</strong> Project context becomes valuable when a correction reaches the deliverable. A source update should reopen the affected conclusion while preserving the decision that still belongs to a person.</Insight>
  </>;
}
