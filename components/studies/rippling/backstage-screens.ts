import Screen1 from "@/components/studies/rippling/backstage/metrics/page";
import Screen2 from "@/components/studies/rippling/backstage/ask/page";
import Screen3 from "@/components/studies/rippling/backstage/org/page";
import Screen4 from "@/components/studies/rippling/backstage/agentic/page";
import Screen5 from "@/components/studies/rippling/backstage/decisions/page";
import Screen6 from "@/components/studies/rippling/backstage/manual/page";
import Screen8 from "@/components/studies/rippling/backstage/trajectory/page";
import Screen9 from "@/components/studies/rippling/backstage/heresies/page";
import Screen10 from "@/components/studies/rippling/backstage/skills/page";
import Screen11 from "@/components/studies/rippling/backstage/timeline/page";

export const RIPPLING_BACKSTAGE_SCREENS: Record<string, React.ComponentType> = {
  "metrics": Screen1,
  "ask": Screen2,
  "org": Screen3,
  "agentic": Screen4,
  "decisions": Screen5,
  "manual": Screen6,
  "trajectory": Screen8,
  "heresies": Screen9,
  "skills": Screen10,
  "timeline": Screen11,
};
