"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ComponentProps } from "react";
import { workdayContextHref } from "@/lib/data/workday-scenario";

type Props=ComponentProps<typeof Link>;
/** Keep the worked example when moving between Workday's App and explanation. */
export default function StudyContextLink(props:Props){
  if(typeof props.href!=="string" || !props.href.startsWith("/companies/workday/"))return <Link {...props}/>;
  return <Suspense fallback={<Link {...props}/>}><ContextLink {...props}/></Suspense>;
}
function ContextLink(props:Props){
  const path=usePathname(),params=useSearchParams();
  return <Link {...props} href={workdayContextHref(props.href as string,path,params)}/>;
}
