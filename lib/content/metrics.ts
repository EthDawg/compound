export interface CompoundMetric {
  id: string; name: string; value: string; sub: string; direction: "up" | "down" | "flat";
  good: boolean; why: string; trap: string; series: number[];
}

export const COMPOUND_METRICS: CompoundMetric[] = [
  {
    id: "m-01", name: "Time to first customer, by product line", value: "11 wks", sub: "product 9 · was 19 months for product 1",
    direction: "down", good: true, series: [82, 61, 44, 30, 26, 21, 17, 14, 11],
    why: "The falsifier for the entire strategy. If the platform produces leverage, each new product line reaches its first paying customer faster than the last. Nothing else proves compounding; everything else can be told as a story.",
    trap: "It flatters you if later products are trivially smaller. Normalize by scope, or you will congratulate yourself for shipping features and calling them products.",
  },
  {
    id: "m-02", name: "Products per customer", value: "4.7", sub: "2021 cohort, up from 1.0 at signup",
    direction: "up", good: true, series: [1.0, 1.6, 2.3, 3.1, 3.6, 4.1, 4.4, 4.7],
    why: "The leading indicator of everything downstream. Cohort it by signup year — the blended number can rise purely from newer customers landing on more products, which tells you about packaging rather than expansion.",
    trap: "Counting free bundled products. Only count products the customer would renew separately.",
  },
  {
    id: "m-03", name: "Net revenue retention", value: "134%", sub: "trailing twelve months",
    direction: "up", good: true, series: [108, 112, 119, 124, 128, 131, 133, 134],
    why: "In a compound model this should be well above one hundred percent driven by expansion, not price. Decompose it every quarter: seats, products, price. Only the middle term is the thesis.",
    trap: "Price-carried NRR looks identical to expansion-carried NRR on the headline. It is a completely different business.",
  },
  {
    id: "m-04", name: "Payback on product N", value: "4.1 mo", sub: "excluding account acquisition cost",
    direction: "down", good: true, series: [19, 14, 11, 9, 7, 6, 5, 4.1],
    why: "The structural advantage, isolated. Product two sold into an existing account skips acquisition, procurement, security review and implementation. This number should be dramatically shorter than product one's and it should keep falling.",
    trap: "Loading account acquisition cost into product one only makes every later product look free. Be honest about attribution or the number becomes marketing.",
  },
  {
    id: "m-05", name: "Multi-product churn gap", value: "5.8×", sub: "single-product vs 3+ product logo churn",
    direction: "up", good: true, series: [2.1, 2.8, 3.4, 4.0, 4.6, 5.1, 5.5, 5.8],
    why: "The retention half of the thesis, and usually the quiet reason the model works at all. Each additional product a customer adopts makes leaving a bigger project for them.",
    trap: "This is correlation before it is causation. Customers who adopt more products may simply be better-fit customers. Check by cohorting on fit, not just product count.",
  },
  {
    id: "m-06", name: "Platform lead time", value: "2.4 wks", sub: "request to shipped capability",
    direction: "flat", good: true, series: [5.8, 5.1, 4.4, 3.6, 3.0, 2.6, 2.5, 2.4],
    why: "We forbid teams from forking primitives. That rule is only fair if the platform is not the bottleneck. When this rises, it is a leadership failure, not a team failure.",
    trap: "Below about one week suggests the platform is over-staffed relative to product, which is its own kind of waste.",
  },
  {
    id: "m-07", name: "Standalone willingness", value: "71%", sub: "newest product line, surveyed customers",
    direction: "flat", good: true, series: [64, 59, 73, 68, 77, 71, 74, 71],
    why: "Would you pay for this alone, from us, at this price? Unglamorous and qualitative, and the earliest warning that a product is riding the bundle rather than earning its place.",
    trap: "Survey respondents are polite. Weight the answer by whether they have actually used it in the last fortnight.",
  },
  {
    id: "m-08", name: "Platform share of engineering", value: "31%", sub: "headcount, funded off the top",
    direction: "flat", good: true, series: [12, 19, 24, 28, 30, 31, 32, 31],
    why: "The tax. It should stabilize, not shrink — a falling number usually means platform work is being quietly absorbed into product teams, which is how forks start.",
    trap: "A rising number is only good if lead time is also falling. Otherwise you are funding a bottleneck.",
  },
];

export interface AntiMetric { name: string; why: string }
export const ANTI_METRICS: AntiMetric[] = [
  { name: "Blended ARPU", why: "Averages across product lines at different maturities. Tells you nothing, moves for the wrong reasons, and reliably prompts the wrong meeting." },
  { name: "Attach rate on bundled products", why: "Measures your packaging, not their demand. We killed a product with a ninety-percent attach rate and near-zero usage." },
  { name: "Feature parity scorecards", why: "Ranks you against single-product competitors on their axis. We will lose that comparison in most categories and it is not the trade we are making." },
  { name: "Company-wide velocity", why: "Averages a mature product line against a nine-week-old one. Actively misleading in both directions." },
  { name: "Platform adoption percentage", why: "Measures compliance with a mandate. Teams can adopt fully and still ship slowly — lead time is the real signal." },
];
