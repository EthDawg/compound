export interface CompanyStrategy {
  contrast: string;
  flywheel: { title: string; body: string; steps: string[]; constraint: string };
  moments: { date: string; title: string; fact: string; consequence: string; source: string; sources?: string[] }[];
  leadership: { title: string; fact: string; reading: string; watch: string; sources: string[] };
  essays: { slug: string; title: string; standfirst: string; paragraphs: string[]; test: string; sources: string[] }[];
  watch: { title: string; shipped: string; next: string; boundary: string; source: string };
}
