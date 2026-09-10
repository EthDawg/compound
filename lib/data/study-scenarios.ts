/** Deliberately fictional, local-only scenarios. These are not payroll or hiring engines. */
export const TALENT = [
  { id: "ava", name: "Ava Nguyen", role: "Optical Systems Engineer", location: "Melbourne", fit: "Optical calibration · lab validation", gap: "Leadership of a full validation programme is not evidenced.", excerpt: "Led calibration checks for prototype optical sensors; maintained validation logs and coordinated three laboratory technicians.", source: "Fictional CV · experience, paragraph 2" },
  { id: "leo", name: "Leo Martin", role: "Optical Systems Engineer", location: "Sydney", fit: "Sensor design · testing", gap: "Availability to work in Melbourne needs confirmation.", excerpt: "Designed sensor test fixtures and documented acceptance criteria. Based in Sydney; relocation preference not supplied.", source: "Fictional application · experience and location" },
  { id: "mina", name: "Mina Patel", role: "Manufacturing Engineer", location: "Melbourne", fit: "Process improvement · quality systems", gap: "Optical calibration experience is not stated.", excerpt: "Reduced manufacturing rework through process documentation and quality checks. No optical laboratory experience is listed.", source: "Fictional CV · recent position" },
] as const;

// External jobseekers are deliberately distinct from the people in the payroll scene.
export const FIND_TALENT_CANDIDATES = TALENT.map((p, i) => ({ ...p,
  id: ["harper", "oscar", "sienna"][i], name: ["Harper Wilson", "Oscar Bennett", "Sienna Clarke"][i],
}));

export const TEAM = [
  { id: "ava", name: "Ava Nguyen", role: "Optical Systems Engineer", capability: "Validation leadership", assessed: 2, target: 3, course: "Leading a validation review", salary: 100000, band: 108000, rating: "Exceeds expectations", increase: 3 },
  { id: "leo", name: "Leo Martin", role: "Engineering Lead", capability: "Coaching", assessed: 3, target: 4, course: "Coaching technical teams", salary: 120000, band: 126000, rating: "Meets expectations", increase: 3 },
  { id: "mina", name: "Mina Patel", role: "Manufacturing Engineer", capability: "Quality systems", assessed: 3, target: 3, course: "Advanced quality practice", salary: 95000, band: 101000, rating: "Exceeds expectations", increase: 3 },
] as const;
export const REVIEW_BUDGET = 14000;
export const validIncrease = (n: number) => Number.isFinite(n) && n >= 0 && n <= 20 && Number.isInteger(n * 2);
export function remunerationSummary(increases: readonly number[]) {
  const valid = increases.length === TEAM.length && increases.every(validIncrease);
  const proposals = TEAM.map((p, i) => ({ ...p, nextSalary: p.salary * (1 + (Number.isFinite(increases[i]) ? increases[i] : 0) / 100) }));
  const cost = Math.round(proposals.reduce((sum, p) => sum + p.nextSalary - p.salary, 0));
  return { valid, proposals, cost, remaining: REVIEW_BUDGET - cost, overBudget: cost > REVIEW_BUDGET, overBand: proposals.filter(p => p.nextSalary > p.band).map(p => p.id) };
}
export function payrollScenario(reviewed: boolean) {
  const overtimeHours = reviewed ? 2 : 4;
  return { overtimeHours, overtimeAmount: overtimeHours * 60, gross: 9600 + overtimeHours * 60, warnings: reviewed ? 0 : 1, canFinalise: reviewed };
}
export function canSubmitRemuneration(increases: readonly number[], reason: string) {
  const result = remunerationSummary(increases);
  return result.valid && (!(result.overBudget || result.overBand.length) || reason.trim().length >= 10);
}
