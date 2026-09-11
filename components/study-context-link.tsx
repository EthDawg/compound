"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ComponentProps } from "react";
import { studyContextHref } from "@/lib/data/study-context";

type Props=ComponentProps<typeof Link>;
/** Keep the company workspace when moving between its App and explanation. */
export default function StudyContextLink(props:Props){
  if(typeof props.href!=="string" || !props.href.startsWith("/companies/"))return <Link {...props}/>;
  return <Suspense fallback={<Link {...props}/>}><ContextLink {...props}/></Suspense>;
}
function ContextLink(props:Props){
  const path=usePathname(),params=useSearchParams();
  return <Link {...props} href={studyContextHref(props.href as string,path,params)}/>;
}
