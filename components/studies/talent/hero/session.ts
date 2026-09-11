'use client';
import { useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { HERO_EVENT_LIMIT, heroState, readHeroSession, recordHeroAction, type HeroAction, type HeroDrafts, type HeroScene } from '@/lib/data/hero-session';
const KEY = 'compound-employment-hero-v1';
const listeners = new Set<() => void>();
let fallback: string | null = null;
let unavailable = false;
function read() { try { return unavailable ? fallback : sessionStorage.getItem(KEY); } catch { unavailable = true; return fallback; } }
function write(value: string) { fallback = value; try { if (!unavailable) sessionStorage.setItem(KEY, value); } catch { unavailable = true; } listeners.forEach(fn => fn()); }
function subscribe(fn: () => void) { listeners.add(fn); window.addEventListener('storage', fn); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); }; }
export function useHeroSession() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const session = useMemo(() => readHeroSession(raw), [raw]);
  const state = useMemo(() => heroState(session), [session]);
  const dispatch = (event: HeroAction | { type: 'reset'; scene: HeroScene }) => {
    const current = readHeroSession(read());
    const next = recordHeroAction(current, event);
    if (next !== current) write(JSON.stringify(next));
    return next !== current;
  };
  const setDraft = (patch: Partial<HeroDrafts>) => {
    const current = readHeroSession(read());
    write(JSON.stringify(readHeroSession(JSON.stringify({ ...current, drafts: { ...current.drafts, ...patch } }))));
  };
  return { ready, state, dispatch, drafts: session.drafts, setDraft, events: session.events, full: session.events.length >= HERO_EVENT_LIMIT };
}
export function useHeroFocus(state: object, id: string, align = false) {
  const requested = useRef(false);
  useLayoutEffect(() => { if (requested.current) { requested.current = false; const target = document.getElementById(id); target?.focus(); if (align && window.matchMedia('(max-width:1100px)').matches) target?.scrollIntoView({ block: 'start' }); } }, [state, id, align]);
  return (action: () => boolean) => { requested.current = true; if (!action()) requested.current = false; };
}
export const money = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(amount);
