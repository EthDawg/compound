import research from './world-research.json';
export const WORLD_SOURCES=research.sources;
export const CLUSTERS=research.clusters;
export const CONNECTIONS=research.edges;
export const CONTEXT_NODES=research.satelliteNodes;
export const EARTH_LAYERS=[{id:'all',name:'All places'},{id:'compute',name:'Making compute'},{id:'infrastructure',name:'Running it'},{id:'delivery',name:'Putting it to work'}];
const layers:Record<string,string[]>={ 'santa-clara':['compute'],'oberkochen':['compute'],'veldhoven':['compute'],'taiwan-foundry':['compute'],'korea-memory':['compute'],'china-industry':['delivery'],'singapore':['infrastructure'],'bengaluru':['delivery'],'victoria-delivery':['delivery'],'johannesburg':['infrastructure'],'canelones':['infrastructure'],'abu-dhabi':['infrastructure','compute']};
export const clusterLayers=(id:string)=>layers[id]??[];
export const worldSource=(id:string)=>WORLD_SOURCES.find(s=>s.id===id)!;
export const worldName=(id:string)=>CLUSTERS.find(c=>c.id===id)?.label??CONTEXT_NODES.find(c=>c.id===id)?.label??id;
export const worldHref=(id:string)=>`/earth?market=${encodeURIComponent(id)}`;
export const connectionsFor=(id:string)=>CONNECTIONS.filter(e=>e.fromId===id||e.toId===id);
export const WORLD_JOURNEYS=[
 {id:'compute',name:'Where does compute come from?',reading:'Trace specialist inputs from optics to fabrication, then the memory and platform around the chip.',ids:['oberkochen','veldhoven','taiwan-foundry','korea-memory','santa-clara']},
 {id:'infrastructure',name:'What does a cloud region depend on?',reading:'Compare an operating hub, a local interconnection site and a planned compute programme. Their capacity numbers describe different things.',ids:['singapore','johannesburg','canelones','abu-dhabi']},
 {id:'delivery',name:'How does technology become local capability?',reading:'An acquired healthcare team, Australian payroll work and industrial installation volumes expose three different meanings of delivery.',ids:['bengaluru','victoria-delivery','china-industry']},
];
// Compatibility for source-integrity checks; all content is derived from the same research.
export const MARKETS=CLUSTERS.map(c=>({id:c.id,name:c.label,anchor:c.country,lon:c.anchor.lon,lat:c.anchor.lat,layers:clusterLayers(c.id),title:c.headline,fact:c.facts.map(f=>f.text).join(' '),url:worldSource(c.facts[0].sourceIds[0]).url,source:worldSource(c.facts[0].sourceIds[0]).title,date:c.facts[0].observationPeriod??'Undated source',reading:c.editorialImplication,ask:c.buyerQuestion,links:[]}));
export const MARKET_COMPANIES=[...new Set(CLUSTERS.flatMap(c=>c.companyNames))].map(name=>{
 const contexts=CLUSTERS.filter(c=>(c.companyNames as string[]).includes(name));
 const primary=contexts.find(c=>c.companyNames[0]===name)??contexts[0];
 return {id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name,terms:contexts.flatMap(c=>[c.country,c.role]),blurb:primary.companyNames[0]===name?primary.headline:`Part of the ${primary.label.toLowerCase()} story. The connected evidence explains its stated role.`,links:contexts.map(c=>({label:c.label,href:worldHref(c.id)}))};
});
