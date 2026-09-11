import {ALL_VENDORS, CATEGORY_NODES, SECTOR_NODES, nodesAt, belongsToCategory, type Node, type Level} from './data/atlas-nodes';
import {LENSES, type LensId} from './data/ecosystem';

export type AtlasLocation = {lens:LensId; sector?:string; category?:string; company?:string; highlight?:string};
export type AtlasAction =
 | {type:'open'; node:Node}
 | {type:'root'|'sector'|'up'|'clear-company'}
 | {type:'lens'; id:LensId}
 | {type:'highlight'; id?:string};
export const initialAtlas:AtlasLocation = {lens:'strategic'};
export const atlasLevel=(state:AtlasLocation):Level=>state.category?'vendor':state.sector?'category':'sector';

/** Preserve a supported category context; reject unrelated company/category pairs. */
function normalise(state:AtlasLocation):AtlasLocation {
 const next:AtlasLocation={lens:LENSES.some(l=>l.id===state.lens)?state.lens:'strategic'};
 const company=ALL_VENDORS.find(c=>c.id===state.company);
 const requested=CATEGORY_NODES.find(c=>c.id===state.category);
 const category=company ? requested&&belongsToCategory(company,requested.id)?requested:CATEGORY_NODES.find(c=>c.id===company.category) : requested;
 const sector=SECTOR_NODES.find(s=>s.id===(category?.sector??company?.sector??state.sector));
 if(sector)next.sector=sector.id;
 if(category)next.category=category.id;
 if(company)next.company=company.id;
 const level=atlasLevel(next),nodes=nodesAt(level,next);
 const highlight=nodes.some(n=>(level==='sector'?n.id:n.archetype)===state.highlight)?state.highlight:undefined;
 if(highlight&&(!company||company.archetype===highlight))next.highlight=highlight;
 return next;
}
export function readAtlasLocation(search:string):AtlasLocation {
 const p=new URLSearchParams(search);
 return normalise({lens:(p.get('lens')??'strategic') as LensId,sector:p.get('sector')??undefined,category:p.get('category')??undefined,company:p.get('company')??undefined,highlight:p.get('highlight')??undefined});
}
export function atlasLocationHref(state:AtlasLocation):string {
 const n=normalise(state),p=new URLSearchParams();
 if(n.company){
  p.set('company',n.company);
  if(n.category!==ALL_VENDORS.find(c=>c.id===n.company)?.category)p.set('category',n.category!);
 }
 else if(n.category)p.set('category',n.category);
 else if(n.sector)p.set('sector',n.sector);
 if(n.lens!=='strategic')p.set('lens',n.lens);
 if(n.highlight)p.set('highlight',n.highlight);
 return p.size?`/?${p}`:'/';
}
export function transitionAtlas(state:AtlasLocation,action:AtlasAction):AtlasLocation {
 const current=normalise(state);
 switch(action.type){
  case 'root': return {lens:current.lens};
  case 'sector': return normalise({lens:current.lens,sector:current.sector});
  case 'up': return current.category?normalise({lens:current.lens,sector:current.sector}):{lens:current.lens};
  case 'clear-company': return normalise({...current,company:undefined});
  case 'lens': return normalise({...current,lens:action.id});
  case 'highlight': {
   const highlight=current.highlight===action.id?undefined:action.id;
   const selected=ALL_VENDORS.find(c=>c.id===current.company);
   return normalise({...current,highlight,company:highlight&&selected?.archetype!==highlight?undefined:current.company});
  }
  case 'open': {
   const n=action.node;
   if(n.level==='sector')return normalise({lens:current.lens,sector:n.id});
   if(n.level==='category')return normalise({lens:current.lens,sector:n.sector,category:n.id});
   const category=current.category&&belongsToCategory(n,current.category)?current.category:n.category;
   return normalise({...current,sector:n.sector,category,company:n.id===current.company?undefined:n.id});
  }
 }
}
