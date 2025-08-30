import { summarize } from "@/lib/ai";

export type PartnerMetrics = {
  month: string;                 // e.g., "2025-09"
  bookings: number;
  revenueKES: number;
  avgPax: number;
  topExperience?: string;
  yoyGrowthPct?: number;         // e.g., +18.4
};

export async function makePartnerSummary(m: PartnerMetrics) {
  const base = `For ${m.month}, you had ${m.bookings} bookings (avg ${m.avgPax} pax) generating KES ${m.revenueKES.toLocaleString()}.${m.topExperience ? ` Top experience: ${m.topExperience}.` : ""}${typeof m.yoyGrowthPct === "number" ? ` YoY growth: ${m.yoyGrowthPct.toFixed(1)}%.` : ""}`;
  // Try AI; fallback is the base sentence wrapped by summarize()
  try { 
    return await summarize(base, "partner"); 
  } catch { 
    return base; 
  }
}