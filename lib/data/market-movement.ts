import type { AnzEvent, AnzPerson, Movement } from './anz-ecosystem';

export type Direction = Exclude<Movement, 'Acquired'> | 'Mixed signals';
export type MovementFilter = Movement | 'Mixed signals';
export type EventTiming = 'recent' | 'historical' | 'uncertain' | 'undated' | 'future' | 'invalid';

/** Preserve the source's date precision instead of inventing an exact day. */
export function eventPeriod(value: string | null) {
  if (!value || !/^\d{4}(?:-\d{2}){0,2}$/.test(value)) return null;
  const [year, month = '01', day = '01'] = value.split('-');
  const iso = `${year}-${month}-${day}`;
  const start = new Date(`${iso}T00:00:00Z`);
  if (!Number.isFinite(start.valueOf()) || start.toISOString().slice(0, 10) !== iso) return null;
  const end = new Date(start);
  if (value.length === 4) end.setUTCFullYear(end.getUTCFullYear() + 1);
  else if (value.length === 7) end.setUTCMonth(end.getUTCMonth() + 1);
  else end.setUTCDate(end.getUTCDate() + 1);
  end.setTime(end.valueOf() - 1);
  return { start, end };
}
export function movementWindow(asOf: string) {
  const period = asOf.length === 10 && eventPeriod(asOf);
  if (!period) return null;
  const start = new Date(period.start);
  const day = start.getUTCDate();
  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 18);
  const lastDay = new Date(start);
  lastDay.setUTCMonth(lastDay.getUTCMonth() + 1);
  lastDay.setUTCDate(0);
  start.setUTCDate(Math.min(day, lastDay.getUTCDate()));
  return { start, end: period.end };
}
export function eventTiming(date: string | null, asOf: string): EventTiming {
  if (date === null) return 'undated';
  const period = eventPeriod(date), window = movementWindow(asOf);
  if (!period || !window) return 'invalid';
  if (period.start > window.end) return 'future';
  if (period.end < window.start) return 'historical';
  if (period.start < window.start) return 'uncertain';
  return 'recent';
}
export const newestEvents = (events: AnzEvent[]) => [...events].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id));
export interface MovementReading {
  label: MovementFilter | 'No recent signal';
  direction: Direction | null;
  event?: AnzEvent;
  localSignals: AnzEvent[];
  regionalSignals: AnzEvent[];
  ownershipSignals: AnzEvent[];
}
export function readMovement(id: string, asOf: string, events: AnzEvent[]): MovementReading {
  const recent = newestEvents(events.filter(e => e.companyIds.includes(id) && eventTiming(e.date, asOf) === 'recent'));
  const directional = (e: AnzEvent) => ['Building', 'Growing', 'Contracting'].includes(e.movement ?? '');
  const localSignals = recent.filter(e => e.scope === 'ANZ' && directional(e));
  const regionalSignals = recent.filter(e => e.scope === 'APAC' && directional(e));
  const ownershipSignals = recent.filter(e => e.movement === 'Acquired' && e.targetIds?.includes(id));
  const positive = localSignals.some(e => e.movement === 'Building' || e.movement === 'Growing');
  const negative = localSignals.some(e => e.movement === 'Contracting');
  const direction: Direction | null = positive && negative ? 'Mixed signals' : negative ? 'Contracting' : localSignals.some(e => e.movement === 'Growing') ? 'Growing' : positive ? 'Building' : null;
  const label = direction ?? (ownershipSignals.length ? 'Acquired' : 'No recent signal');
  const event = localSignals.find(e => direction === 'Mixed signals' || e.movement === direction) ?? ownershipSignals[0];
  return { label, direction, event, localSignals, regionalSignals, ownershipSignals };
}
export function matchesMovement(reading: MovementReading, filter: string) {
  return !filter || (filter === 'Acquired' ? reading.ownershipSignals.length > 0 : reading.direction === filter);
}

/** A related person can be a source author or leader, not necessarily the hire. */
export function careerContext(person: AnzPerson): Record<string, string | undefined> {
  return { lens: 'people', firm: person.companyId, person: person.id, find: undefined,
    cap: undefined, signal: undefined, evidence: undefined, proof: undefined, customer: undefined };
}
