import snapshot from './workday-partners.json';

export type Evidence = 'directory' | 'profile' | 'firm';
export interface PartnerTag { name: string; basis: Evidence }
export interface PartnerSource { title: string; url: string; note?: string }
export interface WorkdayPartner {
  id: string; slug: string; name: string; legalName: string;
  partnerTypes: string[]; services: PartnerTag[]; products: PartnerTag[];
  regions: string[]; regionLabels: string[]; industries: string[];
  scope: {service: string; product: string; regions: string[]}[];
  excerpt: string; website: string; sourceUrl: string; dataUrl: string;
  listed: boolean; aliases: string[]; sources: PartnerSource[];
  summary?: string; context?: string; regionBasis?: Evidence;
}
const ACCENTURE='https://www.accenture.com/en/services/ecosystem-partners/workday';
const KPMG='https://kpmg.com/us/en/capabilities-services/alliances/kpmg-workday.html';
const STRADA='https://stradaglobal.com/partners/workday/';
const COGNIZANT='https://www.cognizant.com/us/en/services/enterprise-platform-services/workday';
const NTT='https://www.nttdata.com/global/en/services/enterprise-application-platforms/human-capital-management-platforms';
const tags=(names:string[],basis:Evidence='firm'):PartnerTag[]=>names.map(name=>({name,basis}));
const mergeTags=(a:PartnerTag[],b:PartnerTag[])=>[...a,...b.filter(t=>!a.some(x=>x.name===t.name))];

const reviewed:Record<string, Partial<WorkdayPartner>> = {
  'accenture-llp': { name:'Accenture', aliases:['Accenture LLP'], services:tags(['Deployment','Application Management Services','Advisory']), products:tags(['Human Capital Management','Financial Management','Workday Adaptive Planning','Payroll']), regions:['Global'], regionLabels:['Global'], regionBasis:'firm', summary:'HR and finance transformation, Workday implementation and ongoing application management. Its own site adds coverage that is missing from the directory profile.', sources:[{title:'Accenture · Workday practice',url:ACCENTURE}] },
  kpmg: { products:tags(['Human Capital Management','Financial Management']), summary:'Workday transformation focused on HCM and financial management, with industry-specific operating models and custom applications.', sources:[{title:'KPMG · Workday alliance',url:KPMG}] },
  strada: { website:STRADA, aliases:['Alight payroll and HR services'], products:tags(['Human Capital Management','Financial Management','Workday Adaptive Planning','Payroll','Extend']), services:tags(['Application Management Services']), summary:'Workday deployment and support across HR, finance, planning and payroll, alongside payroll operations.', context:'Strada grew from the payroll and professional-services business divested by Alight in 2024. This is a business lineage, not a claim that all of Alight became Strada.', sources:[{title:'Strada · Workday services',url:STRADA},{title:'Strada · company history',url:'https://stradaglobal.com/'}] },
  'everforth-topbloc': { aliases:['TopBloc','Apex Systems'], context:'Workday displays Everforth TopBloc under the legal directory record “Apex Systems, LLC dba TopBloc”. The names resolve to one entry here.', summary:'Workday implementation and application management. The directory lists HCM, finance, payroll, Extend and adjacent product competencies.' },
};

const base:WorkdayPartner[]=snapshot.partners.map(raw=>{
  const p={...raw,listed:true,aliases:[],regionBasis:'directory',sources:[{title:'Workday · partner profile',url:raw.sourceUrl},{title:'Workday · published profile data',url:raw.dataUrl}]} as WorkdayPartner;
  const extra=reviewed[p.slug];
  if(!extra)return p;
  return {...p,...extra,services:mergeTags(p.services,extra.services??[]),products:mergeTags(p.products,extra.products??[]),sources:[...p.sources,...(extra.sources??[])]};
});
const blank={partnerTypes:[],regions:[],regionLabels:[],industries:[],scope:[],excerpt:'',dataUrl:'',listed:false,aliases:[]};
const additions:WorkdayPartner[]=[
  {...blank,id:'supplement-cognizant',slug:'cognizant',name:'Cognizant',legalName:'Cognizant',aliases:['Collaborative Solutions'],
    services:tags(['Deployment','Application Management Services','Advisory']),products:tags(['Human Capital Management','Financial Management','Workday Adaptive Planning','Payroll','Student','Extend']),
    regions:['Global'],regionLabels:['Global resources'],regionBasis:'firm',website:COGNIZANT,sourceUrl:COGNIZANT,
    partnerTypes:[],industries:[],scope:[],
    summary:'Deployment, post-deployment support, advisory and Workday Extend development. Its practice includes HR, finance, planning and student systems.',
    context:'Cognizant describes its Workday practice as formerly Collaborative Solutions. It completed the acquisition of OneSource Virtual’s professional-services and application-management practices in January 2023; OneSource Virtual remains a separate directory entry.',
    sources:[{title:'Cognizant · Workday practice',url:COGNIZANT},{title:'Cognizant · deployment scope',url:COGNIZANT+'/deployment'},{title:'Cognizant · planning and professional services',url:COGNIZANT+'/professional-services-transformation'},{title:'Cognizant · finance services',url:COGNIZANT+'/financial-services-transformation'},{title:'Acquisition of OneSource Virtual practices · January 2023',url:'https://news.cognizant.com/Cognizant-Completes-Acquisition-from-OneSource-Virtual-Expanding-Its-Workday-Expertise-and-Services-Portfolio2'}]},
  {...blank,id:'supplement-ntt-data',slug:'ntt-data',name:'NTT DATA',legalName:'NTT DATA',services:[],products:tags(['Human Capital Management']),regions:[],regionLabels:[],industries:[],scope:[],aliases:[],
    website:NTT,sourceUrl:NTT,summary:'NTT DATA includes Workday HCM among its supported human-capital platforms. Workday-specific delivery services and regional scope are not detailed on this source.',
    sources:[{title:'NTT DATA · human capital management platforms',url:NTT}]},
];

export const WORKDAY_PARTNERS=[...base,...additions].sort((a,b)=>a.name.localeCompare(b.name));
export const WORKDAY_PARTNER_META={...snapshot,partners:undefined,total:WORKDAY_PARTNERS.length,supplemental:additions.length};
export const PARTNER_MAP_HREF='/atlas/workday';
export const SERVICE_LABELS:Record<string,string>={'Deployment':'Deployment','Application Management Services':'Post-go-live support','Advisory':'Advisory & change','Staffing':'Staffing'};
export const PRODUCT_LABELS:Record<string,string>={'Human Capital Management':'HCM','Financial Management':'Financial Management','Workday Adaptive Planning':'Adaptive Planning','Strategic Sourcing Expert':'Strategic Sourcing','Workday VNDLY':'VNDLY'};
export const productLabel=(name:string)=>PRODUCT_LABELS[name]??name;
export const serviceLabel=(name:string)=>SERVICE_LABELS[name]??name;
export const PARTNER_SERVICES=Object.keys(SERVICE_LABELS);
export const PARTNER_PRODUCTS=[...new Set(WORKDAY_PARTNERS.flatMap(p=>p.products.map(t=>t.name)))].sort();
export const PARTNER_REGIONS=['Global','North America','EMEA','APAC','Latin America'];
export const PARTNER_INDUSTRIES=[...new Set(WORKDAY_PARTNERS.flatMap(p=>p.industries))].sort();
export const EVIDENCE_LABEL:Record<Evidence,string>={directory:'Directory field',profile:'Profile text',firm:'Company source'};
export const GROUPS=[
  {id:'full',label:'Deploy & run',color:'#2365AA',description:'Both deployment and ongoing support are published.'},
  {id:'deploy',label:'Deployment',color:'#BD6C27',description:'Deployment is published; ongoing support is not specified here.'},
  {id:'run',label:'Post-go-live',color:'#147D83',description:'Ongoing support or application management is published.'},
  {id:'advisory',label:'Advisory',color:'#8063AD',description:'Advisory, readiness or change-management work is published.'},
  {id:'staffing',label:'Staffing',color:'#AA5275',description:'Published staffing or augmentation services. May also offer delivery.'},
  {id:'unspecified',label:'Scope not specified',color:'#7C8793',description:'The firm is included, but these sources do not identify a service category.'},
] as const;
export type PartnerGroup=typeof GROUPS[number]['id'];
export function partnerGroup(p:WorkdayPartner):PartnerGroup{
  const has=(name:string)=>p.services.some(t=>t.name===name);
  if(has('Staffing'))return 'staffing';
  if(has('Deployment')&&has('Application Management Services'))return 'full';
  if(has('Deployment'))return 'deploy';
  if(has('Application Management Services'))return 'run';
  if(has('Advisory'))return 'advisory';
  return 'unspecified';
}
export interface PartnerFilters { q?:string; service?:string; product?:string; region?:string; industry?:string; evidence?:string; group?:string }
export function filterPartners(filters:PartnerFilters,partners=WORKDAY_PARTNERS){
  const q=(filters.q??'').trim().toLowerCase();
  const eligible=(t:PartnerTag)=>filters.evidence!=='directory'||t.basis==='directory';
  return partners.filter(p=>(!q||[p.name,p.legalName,...p.aliases,p.excerpt,p.summary??'',...p.products.map(t=>t.name)].join(' ').toLowerCase().includes(q))
    &&(!filters.service||p.services.some(t=>t.name===filters.service&&eligible(t)))
    &&(!filters.product||p.products.some(t=>t.name===filters.product&&eligible(t)))
    &&(!filters.region||(filters.region==='unspecified'?p.regions.length===0:p.regions.includes(filters.region)||p.regions.includes('Global')))
    &&(!filters.industry||p.industries.includes(filters.industry))
    &&(!filters.group||partnerGroup(p)===filters.group)
    &&(filters.evidence!=='listed'||p.listed));
}
export function relatedPartners(partner:WorkdayPartner){
  const products=new Set(partner.products.map(t=>t.name));
  return WORKDAY_PARTNERS.filter(p=>p.id!==partner.id).map(p=>({partner:p,shared:p.products.filter(t=>products.has(t.name)).map(t=>t.name)}))
    .filter(p=>p.shared.length>0).sort((a,b)=>b.shared.length-a.shared.length||a.partner.name.localeCompare(b.partner.name)).slice(0,5);
}
export function partnerCsv(partners:WorkdayPartner[]){
  const cell=(x:string)=>'"'+(/^[=+\-@\t\r]/.test(x)?"'"+x:x).replaceAll('"','""')+'"';
  const rows=[['Company','Legal name','Directory listed','Services (evidence)','Products (evidence)','Declared regions','Industries','Workday profile or company source','Website','Checked at'],...partners.map(p=>[p.name,p.legalName,p.listed?'Yes':'Supplement',p.services.map(t=>`${serviceLabel(t.name)} [${EVIDENCE_LABEL[t.basis]}]`).join('; '),p.products.map(t=>`${productLabel(t.name)} [${EVIDENCE_LABEL[t.basis]}]`).join('; '),p.regionLabels.join('; '),p.industries.join('; '),p.sourceUrl,p.website,snapshot.checkedAt])];
  return rows.map(row=>row.map(cell).join(',')).join('\r\n');
}
