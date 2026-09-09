export interface Era {
  years: string; label: string; headcount: string; products: number;
  what: string; why: string; cost: string; lesson: string;
}

export const ERAS: Era[] = [
  {
    years: "2017", label: "One product, one bet", headcount: "9", products: 1,
    what: "Payroll only. Multi-state US, one entity type, no benefits, no devices, nothing else.",
    why: "Payroll is the hardest thing to be trusted with and the most painful to switch away from. If you win it, you have earned the right to sit next to every other administrative decision the company makes.",
    cost: "Nineteen months to first paying customer. Longer than any product we have shipped since, by a factor of seven.",
    lesson: "Two architectural decisions made in this window — one employee table, effective dating on every fact — are the reason everything after was possible. Both looked like over-engineering at the time and one of them nearly cost us a launch date.",
  },
  {
    years: "2018 – 2019", label: "The second product, and the discovery of the platform", headcount: "9 → 74", products: 3,
    what: "Benefits, then device management. Started benefits at roughly seventy percent completeness on payroll.",
    why: "Not because payroll was done — it was visibly not done. Because you only discover which parts of product one are actually platform when you are forced to need them a second time.",
    cost: "Payroll's roadmap stalled for two quarters. We lost at least three deals to a deeper competitor. Internally this was the lowest-morale period of the company's life; it looked exactly like a mistake.",
    lesson: "Benefits took fourteen months against payroll's nineteen. A small improvement, and the first real evidence the thesis was more than a preference. It was not enough evidence to be comforting.",
  },
  {
    years: "2020 – 2021", label: "The trough", headcount: "74 → 240", products: 6,
    what: "App provisioning, expense, and the first international entity. Platform funded off the top for the first time. Analytics shipped, then killed.",
    why: "This is where you either build the shared layer properly or you quietly become a suite of products with a common login. We spent heavily on things no customer would ever name: permissions, the workflow engine, the country abstraction.",
    cost: "The worst-looking two years by every conventional metric. High burn, thin products, a public product deprecation, and a fundraise that required investors to hold a model rather than read a chart.",
    lesson: "Killing analytics at a ninety-percent attach rate was the hardest correct call of this period. It cost eleven months and two people, and it produced the standalone-willingness test we still run before anything ships.",
  },
  {
    years: "2022 – 2023", label: "The curve turns", headcount: "240 → 610", products: 11,
    what: "Five product lines in twenty-four months. Time to first customer fell below three months and kept falling. Platform lead time published company-wide.",
    why: "The platform investment from the trough started paying. Nothing about our execution got dramatically better — the marginal cost of a product line fell, which is a different and much more durable thing.",
    cost: "Coordination overhead grew faster than headcount. This is when the team cap and the fork rule became formal policy rather than a shared instinct, because the shared instinct stopped scaling.",
    lesson: "This is the period where the strategy stopped needing to be argued internally and started being assumed. That is more dangerous than it sounds — an unargued strategy is an untested one.",
  },
  {
    years: "2024 – 2026", label: "Compounding as the default", headcount: "610 → 1,900", products: 19,
    what: "Product lines now ship in eight to twelve weeks with teams of six to eight. Two large enterprise opportunities declined. AI surfaces built against the live graph rather than a vector copy.",
    why: "The constraint is no longer engineering capacity. It is judgement about what belongs in the four-question test, and the discipline to say no to revenue that fails it.",
    cost: "Declining eight-figure contracts is not popular internally and the arguments are legitimate. The AI decision is still open and we are slower than competitors who will happily embed everything.",
    lesson: "The failure mode at this stage is not losing conviction. It is having too much of it — the four-question test becoming a formality that everything passes because we have stopped genuinely asking.",
  },
];

export const PRODUCT_CURVE = [
  { n: 1, name: "Payroll", months: 19, team: 6, year: 2017 },
  { n: 2, name: "Benefits", months: 14, team: 7, year: 2018 },
  { n: 3, name: "Devices", months: 10, team: 5, year: 2019 },
  { n: 4, name: "App provisioning", months: 7, team: 6, year: 2020 },
  { n: 5, name: "Expense", months: 6, team: 5, year: 2020 },
  { n: 6, name: "Global entities", months: 9, team: 8, year: 2021 },
  { n: 7, name: "Time & attendance", months: 4, team: 5, year: 2022 },
  { n: 8, name: "Corporate cards", months: 3.5, team: 4, year: 2022 },
  { n: 9, name: "Recruiting", months: 2.6, team: 6, year: 2023 },
  { n: 10, name: "Learning", months: 2.4, team: 4, year: 2023 },
  { n: 11, name: "Bill pay", months: 2.2, team: 5, year: 2023 },
  { n: 12, name: "Headcount planning", months: 2.0, team: 5, year: 2024 },
];
