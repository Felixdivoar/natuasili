export type AIMode = "none" | "api";
export const AI_MODE: AIMode = "none"; // flip to "api" when backend is live

async function post<T>(url: string, body: any): Promise<T> {
  const r = await fetch(url, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${url} failed`);
  return r.json();
}

export async function semanticSearch(q: string): Promise<Array<{
  id: string; 
  title: string; 
  snippet: string; 
  url: string; 
  score: number;
}>>{
  if (AI_MODE === "api") return post("/api/search/semantic", { q });
  // fallback demo data
  return [{ id:"exp-1", title:"Elephant Conservation Walk – Samburu", url:"/experience/elephant-walk-samburu", snippet:"Guided patrol & monitoring.", score: 0.95 }];
}

export async function recommendExperiences(context: {userId?:string; theme?:string; destination?:string;}){
  if (AI_MODE === "api") return post("/api/recs/experiences", context);
  return [
    { id:"exp-2", title:"Rhino Tracking – Laikipia", url:"/experience/rhino-tracking-laikipia", priceFromKES: 8500, rating:4.9, img:"/src/assets/ol-pejeta-rhino.jpg" },
    { id:"exp-3", title:"Community Beadwork Workshop – Nairobi", url:"/experience/beadwork-workshop", priceFromKES: 2500, rating:4.8, img:"/src/assets/beadwork-workshop.jpg" },
  ];
}

export async function summarizeImpact(text: string){
  if (AI_MODE === "api") return (await post<{summary:string}>("/api/ai/summarize", { text, purpose:"impact"})).summary;
  return `Summary: ${text.slice(0,180)}…`;
}

export async function summarize(text: string, purpose: "impact" | "investor" | "partner"): Promise<string> {
  if (AI_MODE === "api") {
    try {
      const result: any = await post("/api/ai/summarize", { text, purpose });
      return result.summary || text;
    } catch {
      return text;
    }
  }
  // Fallback template summary (rule-based)
  const trimmed = text.trim().replace(/\s+/g, " ");
  const short = trimmed.length > 400 ? trimmed.slice(0, 380) + "…" : trimmed;
  return `Summary: ${short}`;
}

export async function translate(text: string, targetLang: string): Promise<string> {
  if (AI_MODE === "api") {
    try {
      const result: any = await post("/api/ai/translate", { text, targetLang });
      return result.translated || text;
    } catch {
      return text;
    }
  }
  return text; // fallback: no translation
}