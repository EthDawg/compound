export type Block =
  | { t: "p"; x: string }
  | { t: "h"; x: string }
  | { t: "q"; x: string }
  | { t: "ul"; x: string[] }
  | { t: "ol"; x: string[] }
  | { t: "note"; label: string; x: string }
  | { t: "cmp"; a: { h: string; x: string }; b: { h: string; x: string } };

export interface Essay {
  slug: string;
  n: number;
  title: string;
  deck: string;
  reading: string;
  tags: string[];
  thesis: string;
  body: Block[];
}
