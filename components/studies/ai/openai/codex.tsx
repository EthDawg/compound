'use client';
import { CODE_FILES, CODE_TESTS, codeCanCommit, codeDiff, codeFiles, codeResults, type CodeView } from '@/lib/data/openai-session';
import { SceneTitle, Insight } from '../frame';
import { useOpenAIFocus, type OpenAISceneProps } from './session';
import s from '../studies.module.css';

export function OpenAICodex({ session }: OpenAISceneProps) {
  const { ready, state, dispatch } = session, code = state.codex;
  const files = codeFiles(code), visible = files.includes(code.file), diff = codeDiff(code, code.file), results = codeResults(code);
  const focus = useOpenAIFocus(state, 'codex-review');
  return <><SceneTitle product="Codex · worktree / meridian-api" title="Delegate the attempt. Inspect what changed." detail="A read-only lookup needs one bounded retry. Review the implementation and its tests, then shape the change you would commit." />
    {!ready ? <p className={s.muted}>Restoring this browser’s example…</p> : <div className={s.workbench}>
      <aside className={s.rail}><h2>Meridian API</h2><button aria-pressed>Bound timeout retries</button><p>Environment<br />Git worktree</p><p>Branch<br />demo/retry-timeout</p><p>Task boundary<br />Read-only availability lookup.<br />request.ts and focused tests.</p><p>Branch shows the full change. Last turn shows the latest attempt. Staged and Unstaged describe the local Git index.</p><p className={s.small}>Fixed code and test fixtures. Nothing runs in your repository.</p></aside>
      <section className={s.centre}><div className={s.prompt}>“Retry a transient timeout once. Preserve successful results. Stop if the second attempt also fails.”</div>
        <h2>{code.committed ? 'A local checkpoint is recorded.' : `Attempt ${code.revision} is ready to inspect.`}</h2><p>{code.revision === 1 ? 'The first patch retries without a limit. The repeated-timeout case will expose it.' : 'The revised loop allows one additional attempt and returns the final error.'}</p>
        <button className={`${s.button} mt-5`} disabled={code.committed || code.tested === code.revision} onClick={() => dispatch({ type: 'codex-test' })}>Run the demo checks</button>
        {code.tested === code.revision && <ul className={s.checks}>{CODE_TESTS.map((test, i) => <li key={test}>{test}<span className={`${s.badge} ${results[i] ? s.good : s.bad}`}>{results[i] ? 'Pass' : 'Fail'}</span></li>)}</ul>}
        {code.revision === 1 && code.tested === 1 && <div className={s.nextEvent}><h3>The retry has no exit on repeated failure.</h3><p>A green first attempt would miss the defect.</p><button className={s.secondary} onClick={() => focus(() => dispatch({ type: 'codex-revise' }))}>Request a bounded retry</button></div>}
        <div className={s.nextEvent}><h3>{code.committed ? 'Demo commit · demo-c01' : 'Prepare a local checkpoint'}</h3><p role="status">{code.committed ? 'Both reviewed files are committed in this example. The worktree has no remaining uncommitted changes. Nothing is pushed or deployed.' : `${code.staged.length} of 2 files staged. Staging one file does not include the other.`}</p><button className={s.button} disabled={!codeCanCommit(code)} onClick={() => focus(() => dispatch({ type: 'codex-commit' }))}>Commit both reviewed demo files</button><p className={s.small}>This scene requires both files reviewed, staged and passing the current checks. That is this exercise’s completion rule, not a restriction imposed by Git.</p></div>
      </section>
      <section className={s.preview}><div className={s.row}><h2 id="codex-review" tabIndex={-1} className={s.focusTarget}>Review</h2><span className={s.badge}>{code.committed ? '2 files committed' : `${code.staged.length}/2 files staged`}</span></div>
        <div className={s.tabs} aria-label="Review scope">{[['branch', 'Branch'], ['last', 'Last turn'], ['staged', 'Staged'], ['unstaged', 'Unstaged']].map(([id, label]) => <button key={id} aria-pressed={code.view === id} onClick={() => dispatch({ type: 'codex-view', view: id as CodeView })}>{label}</button>)}</div>
        <div className={s.fileList} aria-label="Files in review">{files.map(file => <button key={file} aria-pressed={code.file === file} onClick={() => dispatch({ type: 'codex-file', file })}><span>{file}</span><small>{code.committed ? 'Committed' : code.staged.includes(file) ? 'Staged' : 'Unstaged'} · {code.reviewed.includes(file) ? 'Reviewed' : 'Review open'}</small></button>)}</div>
        {visible ? <><p className={s.fileTitle}>{code.file} · revision {code.revision}</p><div className={s.diff}><p className={s.minus}>− {diff.before}</p><p className={s.plus}>+ {diff.after}</p></div><p className={s.small}>{diff.note}</p><div className={s.actions}><button className={s.secondary} disabled={code.committed || code.reviewed.includes(code.file)} onClick={() => dispatch({ type: 'codex-review', file: code.file })}>Mark this file reviewed</button>{code.staged.includes(code.file) ? <button className={s.secondary} disabled={code.committed} onClick={() => focus(() => dispatch({ type: 'codex-unstage', file: code.file }))}>Unstage this demo file</button> : <button className={s.button} disabled={code.committed || code.tested !== 2 || !code.reviewed.includes(code.file)} onClick={() => focus(() => dispatch({ type: 'codex-stage', file: code.file }))}>Stage this demo file</button>}</div></> : <p className={s.muted}>{files.length ? 'Choose a file in this review scope.' : `No ${code.view} changes in this example.`}</p>}
        {!code.committed && code.staged.length === 1 && <p className={s.small}>Still outside the index: {CODE_FILES.filter(file => !code.staged.includes(file)).join(', ')}. Review it in Branch or Unstaged before completing the checkpoint.</p>}
        {code.committed && <p className={s.small}>Branch still shows the change against the base. Staged and Unstaged are empty because the local commit now contains it.</p>}
      </section>
    </div>}
    <Insight><strong>The environment is part of the product.</strong> A delegated attempt becomes useful through the repository, checks and an inspectable change. Partial staging makes the reviewer’s choice concrete; a local commit is still separate from shipping.</Insight>
  </>;
}
