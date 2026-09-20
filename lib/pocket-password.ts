// Public, synthetic fixtures. This is a UI demo, never an authentication boundary.
export const PASSWORD_APPS = [
  { id: "rippling", name: "Rippling", initial: "R", colour: "#f5cd73", username: "rippling.demo@example.test", summary: "People, payroll and your next day off.", tasks: ["View payslip", "Request time off", "Check benefits"] },
  { id: "servicenow", name: "ServiceNow", initial: "S", colour: "#91cfba", username: "servicenow.demo@example.test", summary: "Help, equipment and employee requests.", tasks: ["Get IT help", "Request equipment", "Track a request"] },
  { id: "workday", name: "Workday", initial: "W", colour: "#98c7ff", username: "workday.demo@example.test", summary: "Your time, pay and career in one place.", tasks: ["View pay", "Enter time", "Explore learning"] },
] as const;

export type PasswordAppId = typeof PASSWORD_APPS[number]["id"];
export const DEMO_PASSWORD = "CompoundDemo!2026";

export function passwordApp(id: string | null) {
  return PASSWORD_APPS.find(app => app.id === id) ?? PASSWORD_APPS[0];
}

export function passwordModeEnabled(value: string | null) { return value === "1"; }

export function pocketAppHref(id: PasswordAppId, enabled: boolean) {
  const query = new URLSearchParams({ app: id });
  if (enabled) query.set("passwordMode", "1");
  return `/pocket?${query}`;
}

export function acceptsDemoCredentials(id: PasswordAppId, username: string, password: string) {
  return username.trim().toLowerCase() === passwordApp(id).username && password === DEMO_PASSWORD;
}

export function demoSessionKey(id: PasswordAppId) { return `compound:pocket:demo-session:${id}`; }
