import type { DeptId } from "./company";

export type EmploymentType = "Full-time" | "Part-time" | "Contractor" | "EOR";
export type EmpStatus = "Active" | "Onboarding" | "On leave" | "Offboarding";

export interface Employee {
  id: string;
  name: string;
  title: string;
  dept: DeptId;
  team: string;
  managerId: string | null;
  email: string;
  entity: string;
  country: string;
  location: string;
  type: EmploymentType;
  status: EmpStatus;
  startDate: string;
  level: string;
  salary: number;
  currency: string;
  payGroup: string;
  costCenter: string;
  equity: number;
  devices: string[];
  apps: string[];
  cardLimit: number | null;
  spendPolicy: string;
  benefits: string | null;
  ptoBalance: number;
}

const mk = (
  id: string, name: string, title: string, dept: DeptId, team: string, managerId: string | null,
  entity: string, country: string, location: string, type: EmploymentType, status: EmpStatus,
  startDate: string, level: string, salary: number, currency: string, equity: number,
  devices: string[], apps: string[], cardLimit: number | null, spendPolicy: string,
  benefits: string | null, ptoBalance: number
): Employee => ({
  id, name, title, dept, team, managerId,
  email: name.toLowerCase().replace(/[^a-z ]/g, "").split(" ").map((p, i) => (i === 0 ? p[0] : p)).join("") + "@meridianoptics.com",
  entity, country, location, type, status, startDate, level, salary, currency,
  payGroup: entity === "us" ? "US Semi-monthly" : entity === "ca" ? "CA Semi-monthly" : entity === "de" ? "DE Monthly" : "Global Monthly",
  costCenter: `${dept.toUpperCase()}-${entity.toUpperCase().replace("EOR-", "")}`,
  equity, devices, apps, cardLimit, spendPolicy, benefits, ptoBalance,
});

export const EMPLOYEES: Employee[] = [
  mk("e-001", "Priya Raghunathan", "Chief Executive Officer", "exec", "Executive", null, "us", "United States", "San Francisco, CA", "Full-time", "Active", "2017-03-01", "E", 480000, "USD", 6.4, ["d-001"], ["a-01","a-02","a-03","a-04","a-09","a-11"], 25000, "Executive", "PPO Platinum + Dental + Vision", 14.5),
  mk("e-002", "Marcus Adeyemi", "Chief Operating Officer", "exec", "Executive", "e-001", "us", "United States", "Austin, TX", "Full-time", "Active", "2018-06-11", "E", 395000, "USD", 1.9, ["d-002"], ["a-01","a-02","a-03","a-04","a-09","a-11"], 25000, "Executive", "PPO Platinum + Dental + Vision", 9.0),
  mk("e-003", "Yuki Tanabe", "Chief Financial Officer", "fin", "Finance Leadership", "e-001", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2019-01-14", "E", 372000, "USD", 1.2, ["d-003"], ["a-01","a-02","a-03","a-05","a-07","a-09","a-12"], 50000, "Executive", "PPO Platinum + Dental + Vision", 21.0),
  mk("e-004", "Dana Whitfield", "VP Engineering", "eng", "Eng Leadership", "e-001", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2018-02-05", "M5", 341000, "USD", 0.94, ["d-004"], ["a-01","a-02","a-03","a-06","a-08","a-10"], 15000, "Engineering", "PPO Platinum + Dental + Vision", 3.5),
  mk("e-005", "Sofia Marchetti", "VP People", "peo", "People Leadership", "e-001", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2019-09-03", "M5", 288000, "USD", 0.51, ["d-005"], ["a-01","a-02","a-03","a-04","a-13"], 15000, "Standard", "PPO Platinum + Dental + Vision", 17.5),
  mk("e-006", "Theo Lindqvist", "Chief Revenue Officer", "gtm", "GTM Leadership", "e-001", "us", "United States", "Austin, TX", "Full-time", "Active", "2020-04-20", "E", 330000, "USD", 0.78, ["d-006"], ["a-01","a-02","a-03","a-04","a-14","a-15"], 30000, "Sales", "PPO Platinum + Dental + Vision", 6.0),
  mk("e-007", "Nadia Oyelaran", "VP Product", "eng", "Product", "e-001", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2019-11-18", "M5", 305000, "USD", 0.62, ["d-007"], ["a-01","a-02","a-03","a-06","a-08"], 15000, "Standard", "PPO Platinum + Dental + Vision", 11.0),
  mk("e-008", "Grigor Petrov", "VP Operations", "ops", "Ops Leadership", "e-002", "us", "United States", "Austin, TX", "Full-time", "Active", "2019-05-06", "M5", 271000, "USD", 0.44, ["d-008"], ["a-01","a-02","a-03","a-05","a-16"], 20000, "Standard", "PPO Gold + Dental + Vision", 8.0),
  mk("e-009", "Amara Nwosu", "Staff Software Engineer", "eng", "Platform", "e-004", "us", "United States", "Remote", "Full-time", "Active", "2020-08-17", "IC6", 264000, "USD", 0.19, ["d-009","d-041"], ["a-01","a-02","a-03","a-06","a-08","a-10"], 5000, "Engineering", "PPO Gold + Dental + Vision", 12.0),
  mk("e-010", "Jonas Brandt", "Principal Optical Engineer", "hw", "Optics", "e-011", "de", "Germany", "Berlin, DE", "Full-time", "Active", "2018-10-01", "IC7", 198000, "EUR", 0.28, ["d-010","d-042"], ["a-01","a-02","a-03","a-17","a-18"], 5000, "Engineering", "DE Statutory + Supplemental", 24.0),
  mk("e-011", "Camille Okonkwo", "VP Hardware", "hw", "Hardware Leadership", "e-002", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2018-07-23", "M5", 312000, "USD", 0.66, ["d-011"], ["a-01","a-02","a-03","a-17","a-18","a-16"], 20000, "Engineering", "PPO Platinum + Dental + Vision", 4.5),
  mk("e-012", "Rafael Duarte", "Senior Payroll Manager", "fin", "Payroll", "e-003", "us", "United States", "Austin, TX", "Full-time", "Active", "2021-02-08", "IC5", 152000, "USD", 0.04, ["d-012"], ["a-01","a-02","a-03","a-05","a-07"], 10000, "Standard", "PPO Gold + Dental + Vision", 15.5),
  mk("e-013", "Iris Kowalski", "Head of IT", "ops", "IT", "e-008", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2020-11-02", "M4", 189000, "USD", 0.09, ["d-013"], ["a-01","a-02","a-03","a-19","a-20","a-16"], 25000, "IT", "PPO Gold + Dental + Vision", 6.5),
  mk("e-014", "Bilal Haddad", "General Counsel", "leg", "Legal", "e-001", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2021-06-14", "E", 298000, "USD", 0.31, ["d-014"], ["a-01","a-02","a-03","a-21"], 15000, "Standard", "PPO Platinum + Dental + Vision", 19.0),
  mk("e-015", "Hana Sato", "Senior Product Designer", "eng", "Design", "e-007", "us", "United States", "Remote", "Full-time", "Active", "2021-09-27", "IC5", 176000, "USD", 0.06, ["d-015"], ["a-01","a-02","a-03","a-06","a-22"], 5000, "Standard", "PPO Gold + Dental + Vision", 10.0),
  mk("e-016", "Oliver Ashcroft", "Enterprise Account Executive", "gtm", "Enterprise Sales", "e-006", "eor-uk", "United Kingdom", "London, UK", "EOR", "Active", "2022-03-14", "IC5", 118000, "GBP", 0.03, ["d-016"], ["a-01","a-02","a-03","a-14","a-15"], 10000, "Sales", "UK Statutory + Private Medical", 13.0),
  mk("e-017", "Fatima Al-Rashid", "Staff Firmware Engineer", "hw", "Firmware", "e-011", "us", "United States", "Austin, TX", "Full-time", "Active", "2021-01-11", "IC6", 241000, "USD", 0.11, ["d-017","d-043"], ["a-01","a-02","a-03","a-17","a-10"], 5000, "Engineering", "PPO Gold + Dental + Vision", 7.5),
  mk("e-018", "Nikhil Varma", "Senior Software Engineer", "eng", "Platform", "e-009", "eor-in", "India", "Bengaluru, IN", "EOR", "Active", "2022-07-04", "IC4", 6400000, "INR", 0.02, ["d-018"], ["a-01","a-02","a-03","a-06","a-10"], 2000, "Standard", "IN Statutory + Group Medical", 16.0),
  mk("e-019", "Chloe Bergeron", "Manufacturing Ops Lead", "ops", "Manufacturing", "e-008", "ca", "Canada", "Toronto, ON", "Full-time", "Active", "2020-05-18", "M3", 158000, "CAD", 0.05, ["d-019"], ["a-01","a-02","a-03","a-16","a-23"], 15000, "Operations", "CA Extended Health + Dental", 11.5),
  mk("e-020", "Samuel Ekwueme", "Revenue Operations Manager", "gtm", "RevOps", "e-006", "us", "United States", "Remote", "Full-time", "Active", "2022-01-24", "IC4", 149000, "USD", 0.03, ["d-020"], ["a-01","a-02","a-03","a-14","a-15","a-05"], 8000, "Sales", "PPO Gold + Dental + Vision", 9.5),
  mk("e-021", "Lena Fischer", "Senior Accountant", "fin", "Accounting", "e-003", "de", "Germany", "Berlin, DE", "Full-time", "Active", "2021-11-08", "IC4", 92000, "EUR", 0.02, ["d-021"], ["a-01","a-02","a-03","a-05","a-07"], 5000, "Standard", "DE Statutory + Supplemental", 22.0),
  mk("e-022", "Devon Pierce", "Technical Recruiter", "peo", "Talent", "e-005", "us", "United States", "Austin, TX", "Full-time", "Active", "2022-05-16", "IC3", 121000, "USD", 0.01, ["d-022"], ["a-01","a-02","a-03","a-13","a-04"], 5000, "Standard", "PPO Gold + Dental + Vision", 14.0),
  mk("e-023", "Aisha Bello", "Senior Optical Engineer", "hw", "Optics", "e-010", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2021-04-05", "IC5", 209000, "USD", 0.07, ["d-023","d-044"], ["a-01","a-02","a-03","a-17","a-18"], 5000, "Engineering", "PPO Gold + Dental + Vision", 5.0),
  mk("e-024", "Tomas Nilsen", "Site Reliability Engineer", "eng", "Platform", "e-009", "eor-uk", "United Kingdom", "London, UK", "EOR", "Active", "2023-02-13", "IC4", 96000, "GBP", 0.02, ["d-024"], ["a-01","a-02","a-03","a-06","a-10","a-20"], 4000, "Engineering", "UK Statutory + Private Medical", 18.0),
  mk("e-025", "Renata Alves", "Customer Success Manager", "gtm", "Customer Success", "e-006", "contractor", "Brazil", "Remote", "Contractor", "Active", "2023-06-01", "IC3", 78000, "USD", 0, ["d-025"], ["a-01","a-02","a-14","a-24"], null, "Contractor", null, 0),
  mk("e-026", "Wei Zhang", "Senior Data Engineer", "eng", "Data", "e-004", "us", "United States", "Remote", "Full-time", "Active", "2022-09-12", "IC5", 218000, "USD", 0.05, ["d-026"], ["a-01","a-02","a-03","a-06","a-10","a-25"], 5000, "Engineering", "PPO Gold + Dental + Vision", 8.5),
  mk("e-027", "Grace Mbeki", "People Operations Specialist", "peo", "People Ops", "e-005", "us", "United States", "Austin, TX", "Full-time", "Active", "2023-01-09", "IC3", 104000, "USD", 0.01, ["d-027"], ["a-01","a-02","a-03","a-04","a-13"], 5000, "Standard", "PPO Gold + Dental + Vision", 12.5),
  mk("e-028", "Antoine Leclair", "Quality Engineering Manager", "hw", "Quality", "e-011", "ca", "Canada", "Toronto, ON", "Full-time", "Active", "2021-08-30", "M3", 164000, "CAD", 0.04, ["d-028"], ["a-01","a-02","a-03","a-17","a-16","a-23"], 10000, "Engineering", "CA Extended Health + Dental", 10.5),
  mk("e-029", "Zara Qureshi", "Product Manager, Sensors", "eng", "Product", "e-007", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2022-11-14", "IC4", 187000, "USD", 0.04, ["d-029"], ["a-01","a-02","a-03","a-06","a-08","a-22"], 5000, "Standard", "PPO Gold + Dental + Vision", 7.0),
  mk("e-030", "Ibrahim Coulibaly", "Supply Chain Analyst", "ops", "Supply Chain", "e-008", "us", "United States", "Austin, TX", "Full-time", "Active", "2023-03-20", "IC3", 112000, "USD", 0.01, ["d-030"], ["a-01","a-02","a-03","a-16","a-05"], 8000, "Operations", "PPO Gold + Dental + Vision", 13.5),
  mk("e-031", "Elin Bergstrom", "Solutions Architect", "gtm", "Sales Engineering", "e-006", "de", "Germany", "Berlin, DE", "Full-time", "Active", "2022-06-27", "IC5", 118000, "EUR", 0.03, ["d-031"], ["a-01","a-02","a-03","a-14","a-06"], 8000, "Sales", "DE Statutory + Supplemental", 20.0),
  mk("e-032", "Kwame Asante", "Security Engineer", "eng", "Security", "e-004", "us", "United States", "Remote", "Full-time", "Active", "2023-05-08", "IC5", 226000, "USD", 0.04, ["d-032"], ["a-01","a-02","a-03","a-10","a-19","a-20"], 8000, "Engineering", "PPO Gold + Dental + Vision", 9.0),
  mk("e-033", "Beatriz Salgado", "Field Marketing Manager", "gtm", "Marketing", "e-006", "us", "United States", "Austin, TX", "Full-time", "Active", "2023-08-21", "IC4", 138000, "USD", 0.02, ["d-033"], ["a-01","a-02","a-03","a-15","a-26"], 20000, "Marketing", "PPO Gold + Dental + Vision", 11.0),
  mk("e-034", "Haruto Ishikawa", "Mechanical Engineer", "hw", "Mechanical", "e-011", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2023-04-17", "IC4", 172000, "USD", 0.02, ["d-034"], ["a-01","a-02","a-03","a-17","a-27"], 5000, "Engineering", "PPO Gold + Dental + Vision", 6.5),
  mk("e-035", "Noor Sultana", "Compliance Analyst", "leg", "Compliance", "e-014", "eor-in", "India", "Bengaluru, IN", "EOR", "Active", "2023-10-02", "IC3", 3800000, "INR", 0.01, ["d-035"], ["a-01","a-02","a-03","a-21","a-05"], 2000, "Standard", "IN Statutory + Group Medical", 15.0),
  mk("e-036", "Callum Reid", "Software Engineer", "eng", "Platform", "e-009", "ca", "Canada", "Toronto, ON", "Full-time", "Active", "2024-01-15", "IC3", 134000, "CAD", 0.01, ["d-036"], ["a-01","a-02","a-03","a-06","a-10"], 4000, "Engineering", "CA Extended Health + Dental", 12.0),
  mk("e-037", "Meera Krishnan", "Financial Analyst", "fin", "FP&A", "e-003", "us", "United States", "San Francisco, CA", "Full-time", "Active", "2024-02-26", "IC3", 129000, "USD", 0.01, ["d-037"], ["a-01","a-02","a-03","a-05","a-07","a-25"], 8000, "Standard", "PPO Gold + Dental + Vision", 10.5),
  mk("e-038", "Andile Dlamini", "Support Engineer", "gtm", "Customer Success", "e-025", "contractor", "South Africa", "Remote", "Contractor", "Active", "2024-04-08", "IC3", 62000, "USD", 0, ["d-038"], ["a-01","a-02","a-24"], null, "Contractor", null, 0),
  mk("e-039", "Juliette Moreau", "Senior Recruiter", "peo", "Talent", "e-005", "us", "United States", "Remote", "Full-time", "On leave", "2022-08-15", "IC4", 133000, "USD", 0.02, ["d-039"], ["a-01","a-02","a-03","a-13","a-04"], 5000, "Standard", "PPO Gold + Dental + Vision", 2.0),
  mk("e-040", "Ravi Sundaram", "Engineering Manager, Data", "eng", "Data", "e-004", "us", "United States", "Remote", "Full-time", "Active", "2022-04-11", "M3", 249000, "USD", 0.06, ["d-040"], ["a-01","a-02","a-03","a-06","a-10","a-25"], 10000, "Engineering", "PPO Gold + Dental + Vision", 5.5),
  mk("e-041", "Astrid Halvorsen", "Senior Test Engineer", "hw", "Quality", "e-028", "us", "United States", "Austin, TX", "Full-time", "Active", "2024-06-03", "IC4", 168000, "USD", 0.01, ["d-045"], ["a-01","a-02","a-03","a-17","a-23"], 5000, "Engineering", "PPO Gold + Dental + Vision", 8.0),
  mk("e-042", "Emeka Obi", "Account Executive, Mid-Market", "gtm", "Mid-Market Sales", "e-006", "us", "United States", "Remote", "Full-time", "Active", "2024-09-16", "IC4", 132000, "USD", 0.01, ["d-046"], ["a-01","a-02","a-03","a-14","a-15"], 10000, "Sales", "PPO Gold + Dental + Vision", 9.5),
  mk("e-043", "Sanne de Vries", "Technical Program Manager", "eng", "Program", "e-004", "eor-uk", "United Kingdom", "London, UK", "EOR", "Active", "2024-11-04", "IC5", 92000, "GBP", 0.01, ["d-047"], ["a-01","a-02","a-03","a-06","a-08"], 5000, "Standard", "UK Statutory + Private Medical", 14.0),
  mk("e-044", "Tobias Mensah", "Senior Software Engineer", "eng", "Security", "e-032", "us", "United States", "San Francisco, CA", "Full-time", "Onboarding", "2026-09-22", "IC5", 231000, "USD", 0.03, [], [], 8000, "Engineering", "PPO Gold + Dental + Vision", 0),
  mk("e-045", "Valentina Rossi", "Product Marketing Manager", "gtm", "Marketing", "e-033", "us", "United States", "Remote", "Full-time", "Onboarding", "2026-09-22", "IC4", 156000, "USD", 0.02, [], [], 10000, "Marketing", "PPO Gold + Dental + Vision", 0),
  mk("e-046", "Hugo Lindgren", "Optical Systems Engineer", "hw", "Optics", "e-010", "de", "Germany", "Berlin, DE", "Full-time", "Offboarding", "2022-02-14", "IC5", 124000, "EUR", 0.03, ["d-048"], ["a-01","a-02","a-03","a-17","a-18"], 5000, "Engineering", "DE Statutory + Supplemental", 4.0),
];

export const byId = (id: string) => EMPLOYEES.find((e) => e.id === id);
export const reportsOf = (id: string) => EMPLOYEES.filter((e) => e.managerId === id);
export const chainOf = (id: string): string[] => {
  const out: string[] = [];
  let cur = byId(id)?.managerId ?? null;
  let guard = 0;
  while (cur && guard++ < 12) { out.unshift(cur); cur = byId(cur)?.managerId ?? null; }
  return out;
};
export const initials = (n: string) => n.split(" ").slice(0, 2).map((p) => p[0]).join("");
