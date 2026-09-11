'use client';
import type { CompanyStudy } from '@/lib/companies';
import { openAIStatus, type OpenAIScene } from '@/lib/data/openai-session';
import { AIFrame } from './frame';
import { OpenAIWork } from './openai/work';
import { OpenAICodex } from './openai/codex';
import { OpenAIResponses } from './openai/responses';
import { useOpenAIFocus, useOpenAISession } from './openai/session';
import s from './studies.module.css';
const TABS = [['work', 'ChatGPT Work'], ['codex', 'Codex'], ['responses', 'Responses API']] as const;
export function OpenAIApp({ company, screen }: { company: CompanyStudy; screen: string }) {
  const current: OpenAIScene = screen === 'codex' || screen === 'responses' ? screen : 'work';
  const session = useOpenAISession(), focus = useOpenAIFocus(session.state, 'openai-session');
  return <AIFrame company={company} screen={current} tabs={TABS} progress={session.ready ? openAIStatus(session.state) : undefined} sessionNote="These three examples retain their work in this browser session. Reset each independently.">
    <div className={s.sessionBar}><p id="openai-session" tabIndex={-1} className={s.focusTarget}>This browser session</p><button className={s.link} disabled={!session.ready} onClick={() => focus(() => session.dispatch({ type: 'reset', scene: current }))}>Reset this example</button></div>
    {session.full && <p className={s.operationStatus} role="status">This example session has reached its history limit. Reset an example to keep exploring; the others remain saved.</p>}
    {current === 'work' ? <OpenAIWork session={session} /> : current === 'codex' ? <OpenAICodex session={session} /> : <OpenAIResponses session={session} />}
  </AIFrame>;
}
