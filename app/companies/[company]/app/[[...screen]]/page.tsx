import { notFound } from "next/navigation";
import { COMPANIES, companyStudy } from "@/lib/companies";
import { EMPLOYEES } from "@/lib/data/employees";
import { ProductShell } from "@/components/product-shell";
import { WorkdayApp } from "@/components/workday-app";
import { PageUpApp } from "@/components/studies/talent/pageup-app";
import { ElmoApp } from "@/components/studies/talent/elmo-app";
import { HeroApp } from "@/components/studies/talent/hero-app";
import { ServiceNowApp } from "@/components/studies/servicenow/app";
import { RIPPLING_APP_SCREENS } from "@/components/studies/rippling/app-screens";
import EmployeePage from "@/components/studies/rippling/app/people/[id]/page";

type Props={params:Promise<{company:string;screen?:string[]}>};
const STUDY_APPS = { pageup: PageUpApp, elmo: ElmoApp, "employment-hero": HeroApp, servicenow: ServiceNowApp };
export const dynamicParams=false;
export function generateStaticParams(){return [
  ...COMPANIES.flatMap(c=>c.appScreens.map(s=>({company:c.id,screen:s?s.split('/'):[]}))),
  ...EMPLOYEES.map(e=>({company:'rippling',screen:['people',e.id]})),
];}
export async function generateMetadata({params}:Props){const p=await params;const c=companyStudy(p.company);return {title:`${c?.name??'Company'} · App study — Compound`};}
export default async function CompanyApp({params}:Props){
  const {company:id,screen=[]}=await params;const c=companyStudy(id);if(!c)notFound();
  const key=screen.join('/');
  if(c.strategy){
    if(!c.appScreens.includes(key))notFound();
    if(!(c.id in STUDY_APPS))notFound();
    const App=STUDY_APPS[c.id as keyof typeof STUDY_APPS];
    return <App key={`${c.id}/${key}`} company={c} screen={key}/>;
  }
  if(c.id==='workday'){if(!c.appScreens.includes(key))notFound();return <WorkdayApp company={c} screen={key}/>;}
  if(screen.length===2&&screen[0]==='people')return <ProductShell><EmployeePage params={Promise.resolve({id:screen[1]})}/></ProductShell>;
  const Screen=RIPPLING_APP_SCREENS[key];if(!Screen)notFound();return <ProductShell><Screen/></ProductShell>;
}
