import { MANUAL_A } from "./manual-a";
import { MANUAL_B } from "./manual-b";
import { MANUAL_C } from "./manual-c";
import { MANUAL_D } from "./manual-d";
import type { Essay } from "./types";

export const MANUAL: Essay[] = [...MANUAL_A, ...MANUAL_B, ...MANUAL_C, ...MANUAL_D];
export const essayBySlug = (slug: string): Essay | undefined => MANUAL.find((e) => e.slug === slug);
export type { Essay };
