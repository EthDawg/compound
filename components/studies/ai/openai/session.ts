'use client';
import { useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { OPENAI_EVENT_LIMIT, openAIState, readOpenAISession, recordOpenAIAction, type OpenAIAction, type OpenAIScene } from '@/lib/data/openai-session';
const KEY = 'compound-openai-v1';
const listeners = new Set<() => void>();
let fallback: string | null = null;
let unavailable = false;
function read() { try { return unavailable ? fallback : sessionStorage.getItem(KEY); } catch { unavailable = true; return fallback; } }
function write(value: string) { fallback = value; try { if (!unavailable) sessionStorage.setItem(KEY, value); } catch { unavailable = true; } listeners.forEach(fn => fn()); }
function subscribe(fn: () => void) { listeners.add(fn); window.addEventListener('storage', fn); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); }; }
export function useOpenAISession() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const session = useMemo(() => readOpenAISession(raw), [raw]);
  const state = useMemo(() => openAIState(session), [session]);
  const dispatch = (action: OpenAIAction | { type: 'reset'; scene: OpenAIScene }) => {
    const current = readOpenAISession(read()), next = recordOpenAIAction(current, action);
    if (next !== current) write(JSON.stringify(next));
    return next !== current;
  };
  return { ready, state, dispatch, full: session.events.length >= OPENAI_EVENT_LIMIT };
}
export type OpenAISceneProps = { session: ReturnType<typeof useOpenAISession> };
export function useOpenAIFocus(state: object, id: string) {
  const requested = useRef(false);
  useLayoutEffect(() => {
    if (!requested.current) return;
    requested.current = false;
    const target = document.getElementById(id);
    target?.focus({ preventScroll: true });
    if (window.matchMedia('(max-width:1100px)').matches) target?.scrollIntoView({ block: 'start' });
  }, [state, id]);
  return (action: () => boolean) => {
    requested.current = true;
    if (!action()) {
      requested.current = false;
      const target = document.getElementById(id);
      target?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width:1100px)').matches) target?.scrollIntoView({ block: 'start' });
    }
  };
}
