export const COMPANY = {
  name: "Meridian Optics",
  legalName: "Meridian Optics, Inc.",
  founded: 2017,
  headcount: 344,
  hq: "San Francisco, CA",
  industry: "Precision optics & sensor hardware",
  entities: [
    { id: "us", name: "Meridian Optics, Inc.", country: "United States", flag: "US", employees: 208, type: "Own entity" },
    { id: "ca", name: "Meridian Optics Canada ULC", country: "Canada", flag: "CA", employees: 46, type: "Own entity" },
    { id: "de", name: "Meridian Optics GmbH", country: "Germany", flag: "DE", employees: 31, type: "Own entity" },
    { id: "eor-uk", name: "United Kingdom", country: "United Kingdom", flag: "UK", employees: 19, type: "EOR" },
    { id: "eor-in", name: "India", country: "India", flag: "IN", employees: 24, type: "EOR" },
    { id: "contractor", name: "Global contractors", country: "12 countries", flag: "GL", employees: 16, type: "Contractor" },
  ],
  locations: ["San Francisco, CA", "Austin, TX", "Toronto, ON", "Berlin, DE", "London, UK", "Bengaluru, IN", "Remote"],
} as const;

export const DEPARTMENTS = [
  { id: "eng", name: "Engineering", head: "e-004", count: 118, color: "sky" },
  { id: "hw", name: "Hardware", head: "e-011", count: 62, color: "clay" },
  { id: "gtm", name: "Go-to-Market", head: "e-006", count: 71, color: "moss" },
  { id: "ops", name: "Operations", head: "e-008", count: 38, color: "ink" },
  { id: "fin", name: "Finance", head: "e-003", count: 17, color: "moss" },
  { id: "peo", name: "People", head: "e-005", count: 14, color: "clay" },
  { id: "leg", name: "Legal & Compliance", head: "e-014", count: 9, color: "ink" },
  { id: "exec", name: "Executive", head: "e-001", count: 6, color: "signal" },
] as const;

export type DeptId = (typeof DEPARTMENTS)[number]["id"];
