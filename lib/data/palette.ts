import type { Archetype } from "./ecosystem";

/**
 * One palette, laid out around the wheel so no two entries collide on light paper.
 * Point specialist is deliberately the neutral: it is the most common archetype in
 * most categories, so it should recede and let the outliers carry the signal.
 */
export const ARCHETYPE_COLOR: Record<Archetype, string> = {
  "Compound platform": "#D99A00",        // gold
  "Enterprise suite": "#2B6CB0",         // blue
  "Payroll rail": "#8A6A4A",             // brown (distinct from the tan sector hue)
  "Global employment": "#0E7C93",        // cyan
  "Connective layer": "#0E8A6B",         // teal
  "Point specialist": "#6B7280",         // neutral steel
  "AI-native": "#C8402A",                // vermilion
  "Regional entrenched": "#33383D",      // near-black
  "Service platform": "#7A4FC0",         // violet
  "Integrator channel": "#C2691E",       // orange
  "Capital and consolidation": "#3E8E53",// green
  "Work marketplace": "#C43A6B",         // pink
};

export const SECTOR_COLOR: Record<string, string> = {
  work: "#D99A00", legal: "#7A4FC0", security: "#C8402A", finops: "#0E8A6B",
  data: "#2B6CB0", service: "#C2691E", revenue: "#C43A6B", vertical: "#3E8E53",
  delivery: "#B08048", capital: "#33383D",
};

export const PAPER = {
  bg: "#FBFAF7", surface: "#FFFFFF", line: "#E7E5DE", lineSoft: "#EFEDE6",
  grid: "#F2F0EA", ink: "#1A1A18", muted: "#55524B", faint: "#8C8A82", ghost: "#B4B0A5",
  accent: "#1A1A18", highlight: "#F5C518",
};
