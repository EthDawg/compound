export const EMPTY_PAGEUP_REVIEW = {reviewed:false, note:"", saved:[] as string[]};
export type PageUpReview = typeof EMPTY_PAGEUP_REVIEW;
export function readPageUpReview(raw:string|null):PageUpReview {
  try {
    const data=JSON.parse(raw ?? "null");
    if(!data || typeof data!=="object") return EMPTY_PAGEUP_REVIEW;
    const note=typeof data.note==="string" ? data.note.slice(0,2000) : "";
    const saved=Array.isArray(data.saved) ? [...new Set<string>(data.saved.filter((id:unknown)=>typeof id==="string" && ["ava","leo","mina"].includes(id)))] : [];
    return {note,saved,reviewed:data.reviewed===true && note.trim().length>=10};
  } catch { return EMPTY_PAGEUP_REVIEW; }
}
