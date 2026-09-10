/** A distinct glyph per instance. Same shared icon everywhere made them feel identical. */
export function Mark({ id, className = "h-4 w-4" }: { id: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "rippling": // one record, everything reading from it
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <circle cx="8" cy="8" r="2.1" fill="currentColor" />
          <g {...p}><path d="M8 1.6v2.2M8 12.2v2.2M1.6 8h2.2M12.2 8h2.2" /><circle cx="8" cy="8" r="5.6" strokeOpacity=".45" /></g>
        </svg>
      );
    case "workday": // the worklet grid
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <g fill="currentColor"><circle cx="4.6" cy="4.6" r="2" /><circle cx="11.4" cy="4.6" r="2" /><circle cx="4.6" cy="11.4" r="2" /></g>
          <circle cx="11.4" cy="11.4" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "deel": // borders
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <g {...p}><circle cx="8" cy="8" r="6" /><path d="M2 8h12" /><path d="M8 2a10 10 0 0 1 0 12 10 10 0 0 1 0-12z" /></g>
        </svg>
      );
    case "finch": // a socket
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <g {...p}><path d="M3 5.5h10M3 10.5h10" /><path d="M6 2.5v3M10 2.5v3M6 10.5v3M10 10.5v3" /></g>
        </svg>
      );
    case "adp": // the cycle
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <g {...p}><rect x="2.2" y="2.2" width="11.6" height="11.6" /><path d="M2.2 6h11.6M6 6v7.8" /></g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <g {...p}><path d="M8 1.9 1.9 5 8 8.1 14.1 5z" /><path d="M1.9 8.4 8 11.5l6.1-3.1" /></g>
        </svg>
      );
  }
}
