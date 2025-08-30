import { summarize } from "@/lib/ai";

export function rollupStats(rows: Array<{ amountKES: number; partner: string; }>) {
  const total = rows.reduce((s, r) => s + r.amountKES, 0);
  const byPartner = new Map<string, number>();
  rows.forEach(r => byPartner.set(r.partner, (byPartner.get(r.partner) || 0) + r.amountKES));
  const top = [...byPartner.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return { total, top };
}

export async function makeInvestorSummary(periodLabel: string, rows: Array<{ amountKES: number; partner: string; }>) {
  const { total, top } = rollupStats(rows);
  const base = `For ${periodLabel}, total funds processed were KES ${total.toLocaleString()}. Top partners: ${top.map(([p, amt]) => `${p} (KES ${amt.toLocaleString()})`).join(", ")}. Allocation follows 90/10 model.`;
  try { 
    return await summarize(base, "investor"); 
  } catch { 
    return base; 
  }
}