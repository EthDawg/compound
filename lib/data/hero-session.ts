import { FIND_TALENT_CANDIDATES, payrollScenario } from './study-scenarios';

export const HERO_ROLE = 'Optical Systems Engineer';
export const HERO_CANDIDATES = FIND_TALENT_CANDIDATES.map((person, index) => ({
  ...person,
  source: index === 1 ? 'Fictional jobseeker profile · experience and location' : person.source,
  reply: (['interested', 'declined', 'unanswered'] as const)[index],
  replyText: [
    'I am interested in discussing the Melbourne role. Please tell me more about the validation programme.',
    'Thank you, but I am staying in Sydney and will not pursue this Melbourne role.',
    'No reply is recorded after the final reminder. Interest remains unknown.',
  ][index],
}));
export type EmploymentModel = 'direct' | 'heroforce';
export type CandidateProgress = { reviewed: boolean; saved: boolean; invitation: string | null; response: null | 'interested' | 'declined' | 'unanswered'; followUp: string | null };
export type HeroState = {
  payroll: { phase: 'prepared' | 'corrected' | 'reviewed' | 'finalised' | 'published'; inspected: boolean };
  candidates: Record<string, CandidateProgress>;
  people: { model: EmploymentModel; reviewed: boolean; saved: EmploymentModel | null };
};
export type HeroAction =
  | { type: 'payroll-inspect' | 'payroll-correct' | 'payroll-restore' | 'payroll-review' | 'payroll-finalise' | 'payroll-publish' }
  | { type: 'candidate-review' | 'candidate-save' | 'candidate-invite' | 'candidate-reply' | 'candidate-follow-up'; id: string; note?: string }
  | { type: 'people-model'; model: EmploymentModel }
  | { type: 'people-review' | 'people-save' };
export type HeroScene = 'payroll' | 'candidate' | 'people';
export type HeroDrafts = { selected: string; scope: 'all' | 'melbourne' | 'saved'; invitations: Record<string, string>; followUps: Record<string, string> };
export type HeroSession = { version: 1; events: HeroAction[]; drafts: HeroDrafts };
export const HERO_EVENT_LIMIT = 120;
const validNote = (note: unknown): note is string => typeof note === 'string' && note.trim().length >= 10 && note.length <= 1000;
export function heroInitial(): HeroState {
  return { payroll: { phase: 'prepared', inspected: false }, candidates: Object.fromEntries(HERO_CANDIDATES.map(p => [p.id, { reviewed: false, saved: false, invitation: null, response: null, followUp: null }])), people: { model: 'direct', reviewed: false, saved: null } };
}
export function heroReduce(state: HeroState, action: HeroAction): HeroState {
  if (!action || typeof action !== 'object' || typeof action.type !== 'string') return state;
  const pay = state.payroll;
  if (action.type.startsWith('payroll-')) {
    if (action.type === 'payroll-inspect' && pay.phase === 'prepared' && !pay.inspected) return { ...state, payroll: { ...pay, inspected: true } };
    if (action.type === 'payroll-correct' && pay.phase === 'prepared' && pay.inspected) return { ...state, payroll: { ...pay, phase: 'corrected' } };
    if (action.type === 'payroll-restore' && ['corrected', 'reviewed'].includes(pay.phase)) return { ...state, payroll: { phase: 'prepared', inspected: false } };
    if (action.type === 'payroll-review' && pay.phase === 'corrected') return { ...state, payroll: { ...pay, phase: 'reviewed' } };
    if (action.type === 'payroll-finalise' && pay.phase === 'reviewed') return { ...state, payroll: { ...pay, phase: 'finalised' } };
    if (action.type === 'payroll-publish' && pay.phase === 'finalised') return { ...state, payroll: { ...pay, phase: 'published' } };
    return state;
  }
  if ('id' in action) {
    const person = HERO_CANDIDATES.find(p => p.id === action.id);
    if (!person) return state;
    const progress = state.candidates[person.id];
    let next = progress;
    if (action.type === 'candidate-review' && !progress.reviewed) next = { ...progress, reviewed: true };
    if (action.type === 'candidate-save' && !progress.saved) next = { ...progress, saved: true };
    if (action.type === 'candidate-invite' && progress.reviewed && !progress.invitation && validNote(action.note)) next = { ...progress, invitation: action.note.trim() };
    if (action.type === 'candidate-reply' && progress.invitation && !progress.response) next = { ...progress, response: person.reply };
    if (action.type === 'candidate-follow-up' && progress.response === 'interested' && !progress.followUp && validNote(action.note)) next = { ...progress, followUp: action.note.trim() };
    return next === progress ? state : { ...state, candidates: { ...state.candidates, [person.id]: next } };
  }
  if (action.type === 'people-model' && (action.model === 'direct' || action.model === 'heroforce') && action.model !== state.people.model) return { ...state, people: { ...state.people, model: action.model, reviewed: false } };
  if (action.type === 'people-review' && !state.people.reviewed) return { ...state, people: { ...state.people, reviewed: true } };
  if (action.type === 'people-save' && state.people.reviewed && state.people.saved !== state.people.model) return { ...state, people: { ...state.people, saved: state.people.model } };
  return state;
}
export function heroState(session: HeroSession) { return session.events.reduce(heroReduce, heroInitial()); }
export function heroCounts(state: HeroState) {
  const candidates = Object.values(state.candidates);
  return { saved: candidates.filter(p => p.saved).length, invited: candidates.filter(p => p.invitation).length, pending: candidates.filter(p => p.invitation && !p.response).length, interested: candidates.filter(p => p.response === 'interested').length, declined: candidates.filter(p => p.response === 'declined').length, unanswered: candidates.filter(p => p.response === 'unanswered').length, followUps: candidates.filter(p => p.followUp).length };
}
export function heroPay(state: HeroState) { return payrollScenario(state.payroll.phase !== 'prepared'); }
const emptyDrafts = (): HeroDrafts => ({ selected: 'harper', scope: 'all', invitations: {}, followUps: {} });
export function readHeroSession(raw: string | null): HeroSession {
  const empty: HeroSession = { version: 1, events: [], drafts: emptyDrafts() };
  if (!raw || raw.length > 250000) return empty;
  try {
    const input = JSON.parse(raw);
    if (!input || input.version !== 1 || !Array.isArray(input.events)) return empty;
    let state = heroInitial();
    for (const action of input.events.slice(0, HERO_EVENT_LIMIT)) {
      const next = heroReduce(state, action);
      if (next !== state) { empty.events.push(action); state = next; }
    }
    const drafts = input.drafts;
    if (drafts && typeof drafts === 'object') {
      if (HERO_CANDIDATES.some(p => p.id === drafts.selected)) empty.drafts.selected = drafts.selected;
      if (['all', 'melbourne', 'saved'].includes(drafts.scope)) empty.drafts.scope = drafts.scope;
      for (const person of HERO_CANDIDATES) for (const key of ['invitations', 'followUps'] as const) {
        if (typeof drafts[key]?.[person.id] === 'string') empty.drafts[key][person.id] = drafts[key][person.id].slice(0, 1000);
      }
    }
    return empty;
  } catch { return empty; }
}
export function recordHeroAction(session: HeroSession, action: HeroAction | { type: 'reset'; scene: HeroScene }): HeroSession {
  if (action.type === 'reset') {
    if (!['payroll', 'candidate', 'people'].includes(action.scene)) return session;
    return { ...session, events: session.events.filter(e => !e.type.startsWith(`${action.scene}-`)), drafts: action.scene === 'candidate' ? emptyDrafts() : session.drafts };
  }
  const state = heroState(session);
  if (session.events.length >= HERO_EVENT_LIMIT || heroReduce(state, action) === state) return session;
  return { ...session, events: [...session.events, action] };
}
