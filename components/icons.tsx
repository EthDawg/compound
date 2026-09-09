type P = { className?: string };
const S = (d: React.ReactNode, vb = "0 0 16 16") => (p: P) => (
  <svg viewBox={vb} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className ?? "h-4 w-4"} aria-hidden>
    {d}
  </svg>
);

export const IHome = S(<><path d="M2.5 6.8 8 2.5l5.5 4.3v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" /><path d="M6.2 13.8V9h3.6v4.8" /></>);
export const IPeople = S(<><circle cx="6" cy="5.5" r="2.4" /><path d="M1.8 13.4c.4-2.3 2.1-3.6 4.2-3.6s3.8 1.3 4.2 3.6" /><path d="M10.6 3.5a2.2 2.2 0 0 1 0 4.2M11.5 9.9c1.6.3 2.6 1.5 2.9 3.5" /></>);
export const IHire = S(<><circle cx="6.5" cy="5.5" r="2.4" /><path d="M2 13.4c.4-2.3 2.1-3.6 4.5-3.6" /><path d="M11.5 8.2v4.6M9.2 10.5h4.6" /></>);
export const IPayroll = S(<><rect x="1.8" y="3.5" width="12.4" height="9" rx="1.4" /><circle cx="8" cy="8" r="2" /><path d="M4.3 8h.01M11.7 8h.01" /></>);
export const IBenefits = S(<><path d="M8 13.2S2.4 10 2.4 6.3a2.9 2.9 0 0 1 5.6-1 2.9 2.9 0 0 1 5.6 1c0 3.7-5.6 6.9-5.6 6.9z" /></>);
export const ITime = S(<><circle cx="8" cy="8" r="6" /><path d="M8 4.6V8l2.3 1.5" /></>);
export const IDevice = S(<><rect x="1.8" y="3" width="12.4" height="8" rx="1.2" /><path d="M4.5 13.4h7" /></>);
export const IApps = S(<><rect x="2" y="2" width="4.8" height="4.8" rx="1" /><rect x="9.2" y="2" width="4.8" height="4.8" rx="1" /><rect x="2" y="9.2" width="4.8" height="4.8" rx="1" /><rect x="9.2" y="9.2" width="4.8" height="4.8" rx="1" /></>);
export const IShield = S(<><path d="M8 2 3 4v4c0 3 2.1 5.2 5 6 2.9-.8 5-3 5-6V4z" /><path d="M6 8.1 7.4 9.5 10.2 6.7" /></>);
export const ICard = S(<><rect x="1.8" y="3.5" width="12.4" height="9" rx="1.4" /><path d="M1.8 6.6h12.4" /><path d="M4.2 10h2.6" /></>);
export const IExpense = S(<><path d="M4 2h8v12l-2-1.2-2 1.2-2-1.2L4 14z" /><path d="M6.2 5.6h3.6M6.2 8.2h3.6" /></>);
export const IBill = S(<><path d="M8 2.2v11.6" /><path d="M10.7 4.6H6.6a1.9 1.9 0 0 0 0 3.8h2.8a1.9 1.9 0 0 1 0 3.8H5" /></>);
export const IFlow = S(<><rect x="1.8" y="2" width="4.2" height="3.4" rx=".8" /><rect x="10" y="2" width="4.2" height="3.4" rx=".8" /><rect x="5.9" y="10.6" width="4.2" height="3.4" rx=".8" /><path d="M3.9 5.4v2.3a1 1 0 0 0 1 1h6.2a1 1 0 0 0 1-1V5.4" /><path d="M8 8.7v1.9" /></>);
export const IGraph = S(<><circle cx="8" cy="3.4" r="1.7" /><circle cx="3.2" cy="11.4" r="1.7" /><circle cx="12.8" cy="11.4" r="1.7" /><path d="M6.8 4.8 4.3 9.9M9.2 4.8l2.5 5.1M4.9 11.4h6.2" /></>);
export const IReport = S(<><rect x="2.4" y="2" width="11.2" height="12" rx="1.3" /><path d="M5.2 9.6v2.2M8 6.9v4.9M10.8 8.4v3.4" /></>);
export const ISearch = S(<><circle cx="7.2" cy="7.2" r="4.4" /><path d="M10.5 10.5 14 14" /></>);
export const IChevron = S(<path d="M6 3.5 10.5 8 6 12.5" />);
export const IChevronDown = S(<path d="M3.5 6 8 10.5 12.5 6" />);
export const IArrow = S(<><path d="M3 8h10" /><path d="M9.2 4.2 13 8l-3.8 3.8" /></>);
export const IBolt = S(<path d="M8.8 1.8 3.6 9.1h3.4l-.6 5.1 5.2-7.3H8.2z" />);
export const IEye = S(<><path d="M1.5 8S3.9 3.6 8 3.6 14.5 8 14.5 8 12.1 12.4 8 12.4 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" /></>);
export const IBook = S(<><path d="M2.4 3.2A1 1 0 0 1 3.4 2.2H7a1.4 1.4 0 0 1 1 .5 1.4 1.4 0 0 1 1-.5h3.6a1 1 0 0 1 1 1v8.6a1 1 0 0 1-1 1H9.3a1.3 1.3 0 0 0-1.3.9 1.3 1.3 0 0 0-1.3-.9H3.4a1 1 0 0 1-1-1z" /><path d="M8 2.9v10.4" /></>);
export const IAlert = S(<><path d="M8 2.6 14.2 13H1.8z" /><path d="M8 6.6v3M8 11.4h.01" /></>);
export const ICheck = S(<path d="M3 8.4 6.3 11.6 13 4.8" />);
export const IClose = S(<path d="M4 4l8 8M12 4l-8 8" />);
export const IGlobe = S(<><circle cx="8" cy="8" r="6" /><path d="M2.2 8h11.6" /><path d="M8 2a9.5 9.5 0 0 1 0 12 9.5 9.5 0 0 1 0-12z" /></>);
export const IClock = S(<><circle cx="8" cy="8" r="6" /><path d="M8 4.8V8l2 1.2" /></>);
export const ILock = S(<><rect x="3.2" y="7" width="9.6" height="6.6" rx="1.3" /><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" /></>);
export const ISpark = S(<><path d="M8 1.8 9.3 5.5 13 6.8 9.3 8.1 8 11.8 6.7 8.1 3 6.8 6.7 5.5z" /><path d="M12.4 11.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" /></>);
export const IList = S(<><path d="M5.5 4h8.2M5.5 8h8.2M5.5 12h8.2" /><path d="M2.4 4h.01M2.4 8h.01M2.4 12h.01" /></>);
export const ILayers = S(<><path d="M8 1.9 1.9 5 8 8.1 14.1 5z" /><path d="M1.9 8.4 8 11.5l6.1-3.1M1.9 11.4 8 14.5l6.1-3.1" /></>);
