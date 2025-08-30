import { summarize } from "@/lib/ai";

export type LedgerEntry = {
  id: string;
  date: string;
  partner: string;
  experience?: string;
  amountKES: number;   // total
  split?: { partner: number; platform: number; };
  notes?: string;
};

export async function entryNarrative(e: LedgerEntry) {
  const base = `On ${e.date}, KES ${e.amountKES.toLocaleString()} was allocated for ${e.partner}${e.experience ? ` (${e.experience})` : ""}. Allocation: partner ${e.split?.partner ? `KES ${e.split.partner.toLocaleString()}` : "90%"}; platform ${e.split?.platform ? `KES ${e.split.platform.toLocaleString()}` : "10%"}. ${e.notes ?? ""}`;
  try { 
    return await summarize(base, "impact"); 
  } catch { 
    return base; 
  }
}