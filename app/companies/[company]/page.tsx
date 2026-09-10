import { notFound, redirect } from "next/navigation";
import { COMPANIES, companyStudy, companyHref } from "@/lib/companies";
export const dynamicParams=false;
export function generateStaticParams(){return COMPANIES.map(c=>({company:c.id}));}
export default async function Company({params}:{params:Promise<{company:string}>}){const {company}=await params;if(!companyStudy(company))notFound();redirect(companyHref(company,'app'));}
