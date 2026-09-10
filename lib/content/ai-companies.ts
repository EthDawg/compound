import type { CompanyStudy } from "../companies";
import type { CompanyStrategy } from "./strategy-types";
import { TALENT_NAVIGATION } from "./talent-navigation";
import anthropic from "./anthropic-study.json";
import openai from "./openai-study.json";
import elevenlabs from "./elevenlabs-study.json";

type Research = { backstage: Omit<CompanyStudy["backstage"], "navigation">; strategy: CompanyStrategy };
function study(id: "anthropic" | "openai" | "elevenlabs", name: string, screens: string[], research: Research, palette: [string,string,string,string,string]): CompanyStudy {
  const [bg,ink,accent,soft,chrome]=palette;
  return {
    id,name,archetype:id==="elevenlabs"?"Voice & interaction platform":"Frontier AI & work platform",
    brand:{chrome,ink:"#FFFFFF",highlight:id==="anthropic"?"#F3C5AD":id==="openai"?"#B7E8D0":"#B9CFFD"},
    appScreens:["",...screens],workflowScreen:screens[0],
    skin:{id,name,studyOf:research.backstage.headline,bet:research.backstage.thesis,ethos:research.backstage.question,href:`/companies/${id}/app`,depth:"Full study",
      theme:{bg,surface:"#FFFFFF",surfaceAlt:bg,border:"#DDDDD8",ink,inkMuted:"#62635E",inkFaint:"#686963",accent,accentInk:"#FFFFFF",accentSoft:soft,radius:"10px",radiusSm:"6px",font:'Inter, system-ui, sans-serif',chrome:"topbar",density:"normal"},
      nav:[],greeting:{eyebrow:"Meridian · illustrative workspace",title:name,sub:research.backstage.question},home:[],xray:[]},
    backstage:{...research.backstage,navigation:TALENT_NAVIGATION},strategy:research.strategy,
  };
}
export const AI_COMPANIES: CompanyStudy[] = [
  study("anthropic","Anthropic",["cowork","code","playground"],anthropic,["#FAF9F5","#292720","#A4472D","#F3E5DB","#42342B"]),
  study("openai","OpenAI",["work","codex","responses"],openai,["#FAFAFA","#171717","#232323","#E8F4EE","#202323"]),
  study("elevenlabs","ElevenLabs",["studio","dubbing","agents"],elevenlabs,["#F7F8FA","#141619","#2458C8","#EDF2FF","#192335"]),
];
