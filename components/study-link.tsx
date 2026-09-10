"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { companyHref, companyStudy, type CompanyId, type StudySurface } from "@/lib/companies";

/** Global entrypoints resume the selected company; explicit company links never consult storage. */
export function StudyLink({surface,children,className}:{surface:StudySurface;children:React.ReactNode;className?:string}){
  const [id,setId]=useState<CompanyId>('rippling');
  useEffect(()=>{try{const c=companyStudy(localStorage.getItem('compound-company')??'');if(c)setId(c.id);}catch{/* A usable default remains available. */}},[]);
  return <Link href={companyHref(id,surface)} className={className}>{children}</Link>;
}
