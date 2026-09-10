import Screen0 from "@/components/studies/rippling/app/page";
import Screen1 from "@/components/studies/rippling/app/identity/page";
import Screen2 from "@/components/studies/rippling/app/security/page";
import Screen3 from "@/components/studies/rippling/app/learning/page";
import Screen4 from "@/components/studies/rippling/app/expenses/page";
import Screen5 from "@/components/studies/rippling/app/graph/page";
import Screen6 from "@/components/studies/rippling/app/planning/page";
import Screen7 from "@/components/studies/rippling/app/workflows/page";
import Screen8 from "@/components/studies/rippling/app/time/page";
import Screen9 from "@/components/studies/rippling/app/bills/page";
import Screen10 from "@/components/studies/rippling/app/people/page";
import Screen12 from "@/components/studies/rippling/app/spend/page";
import Screen13 from "@/components/studies/rippling/app/benefits/page";
import Screen14 from "@/components/studies/rippling/app/hire/page";
import Screen15 from "@/components/studies/rippling/app/payroll/page";
import Screen16 from "@/components/studies/rippling/app/apps/page";
import Screen17 from "@/components/studies/rippling/app/entities/page";
import Screen18 from "@/components/studies/rippling/app/reports/page";
import Screen19 from "@/components/studies/rippling/app/devices/page";

export const RIPPLING_APP_SCREENS: Record<string, React.ComponentType> = {
  "": Screen0,
  "identity": Screen1,
  "security": Screen2,
  "learning": Screen3,
  "expenses": Screen4,
  "graph": Screen5,
  "planning": Screen6,
  "workflows": Screen7,
  "time": Screen8,
  "bills": Screen9,
  "people": Screen10,
  "spend": Screen12,
  "benefits": Screen13,
  "hire": Screen14,
  "payroll": Screen15,
  "apps": Screen16,
  "entities": Screen17,
  "reports": Screen18,
  "devices": Screen19,
};
