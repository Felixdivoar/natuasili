import { summarize } from "@/lib/ai";

export async function draftUpdate(bullets: string[]) {
  const seed = `Create a concise update from these points: ${bullets.map(b => `• ${b}`).join(" ")}`;
  try { 
    return await summarize(seed, "partner"); 
  } catch {
    // Simple offline draft:
    return `Update:\n${bullets.map(b => `- ${b}`).join("\n")}\n\nImpact: Funds support ongoing conservation and community outcomes.`;
  }
}