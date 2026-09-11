/** Teaching models. Units are explicit; these are not measured service levels. */
export const PHYSICS = { earthRadiusKm: 6371, muKm3s2: 398600.4418, lightKmS: 299792.458, fibreIndex: 1.4682 };
export function circularOrbit(altitudeKm: number) {
  if (!Number.isFinite(altitudeKm) || altitudeKm <= 0) throw new RangeError('Altitude must be a positive finite number of kilometres.');
  const h = altitudeKm;
  const r = PHYSICS.earthRadiusKm + h;
  return { altitudeKm: h, speedKmS: Math.sqrt(PHYSICS.muKm3s2 / r), periodMin: 2 * Math.PI * Math.sqrt(r ** 3 / PHYSICS.muKm3s2) / 60,
    // Idealised overhead bent-pipe path: up+down each way = four altitudes.
    propagationRttMs: 4 * h / PHYSICS.lightKmS * 1000 };
}
export function networkBudget(distanceKm: number, megabytes: number, megabitsPerSecond: number, serialTrips: number) {
  if (![distanceKm,megabytes,megabitsPerSecond,serialTrips].every(Number.isFinite) || distanceKm < 0 || megabytes < 0 || megabitsPerSecond <= 0 || serialTrips < 0 || !Number.isInteger(serialTrips)) throw new RangeError('Use non-negative distance, payload and whole trips, and a positive data rate.');
  const distance = distanceKm, size = megabytes, rate = megabitsPerSecond, trips = serialTrips;
  const rttMs = 2 * distance / (PHYSICS.lightKmS / PHYSICS.fibreIndex) * 1000;
  const transferMs = size * 8 / rate * 1000;
  const oneWayMs = rttMs / 2;
  return { rttMs, oneWayMs, transferMs, waitMs: rttMs * trips, totalMs: oneWayMs + transferMs + rttMs * trips };
}
export function adoptionCurve(t: number, lag: number, friction: number) {
  const base = 1 / (1 + Math.exp(3.6));
  const progress = (elapsed: number) => (1 / (1 + Math.exp(-.9 * (Math.max(0, elapsed) - 4))) - base) / (1 - base);
  const technical = progress(t);
  const deployed = progress((t - Math.max(0, lag)) / Math.max(1, friction));
  return { technical, deployed };
}
export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Duration must be finite and non-negative.');
  const [unit, divisor] = seconds < 60 ? ['seconds',1] : seconds < 3600 ? ['minutes',60] : seconds < 86400 ? ['hours',3600] : seconds < 31557600 ? ['days',86400] : ['years',31557600];
  return `${Number((seconds / Number(divisor)).toPrecision(3))} ${unit}`;
}
