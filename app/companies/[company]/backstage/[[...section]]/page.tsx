import { notFound, permanentRedirect } from "next/navigation";
import { COMPANIES, BACKSTAGE_SECTIONS, companyStudy } from "@/lib/companies";
import { MANUAL } from "@/lib/content/manual";
import { BackstageShell } from "@/components/backstage-shell";
import { CompanyBackstage } from "@/components/company-backstage";
import { RIPPLING_BACKSTAGE_SCREENS } from "@/components/studies/rippling/backstage-screens";
import RipplingBackstage from "@/components/studies/rippling/backstage/page";
import Essay from "@/components/studies/rippling/backstage/manual/[slug]/page";

type Props={params:Promise<{company:string;section?:string[]}>};
export const dynamicParams=false;
export function generateStaticParams(){return [
  ...COMPANIES.flatMap(c=>BACKSTAGE_SECTIONS.map(s=>({company:c.id,section:s.id?[s.id]:[]}))),
  ...['library',...Object.keys(RIPPLING_BACKSTAGE_SCREENS)].map(s=>({company:'rippling',section:[s]})),
  ...MANUAL.map(e=>({company:'rippling',section:['manual',e.slug]})),
];}
export async function generateMetadata({params}:Props){const p=await params;const c=companyStudy(p.company);return {title:`${c?.name??'Company'} · Backstage — Compound`};}
export default async function CompanyBackstagePage({params}:Props){
  const {company:id,section=[]}=await params;const c=companyStudy(id);if(!c)notFound();
  const key=section.join('/');let content:React.ReactNode;
  if(c.id==='rippling' && key==='library')permanentRedirect('/companies/rippling/backstage');
  if(BACKSTAGE_SECTIONS.some(s=>s.id===key) && !(c.id==='rippling' && key===''))content=<CompanyBackstage company={c} section={key}/>;
  else if(c.id==='rippling'){
    const Screen=RIPPLING_BACKSTAGE_SCREENS[key];
    if(key==='')content=<RipplingBackstage/>;
    else if(section.length===2&&section[0]==='manual')content=<Essay params={Promise.resolve({slug:section[1]})}/>;
    else if(Screen)content=<Screen/>;
    else notFound();
    content=<div className="legacy-analysis mt-6 rounded-xl px-5 text-ink-200 sm:px-7" style={{background:c.brand.chrome}}>{content}</div>;
  }else notFound();
  return <BackstageShell company={c}>{content}</BackstageShell>;
}
