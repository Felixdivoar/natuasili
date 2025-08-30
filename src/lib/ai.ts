// src/lib/ai.ts
export type AIProvider = "none" | "api"; // "api" -> your /api/* endpoints
export const AI_MODE: AIProvider = "none"; // flip to "api" when backend is ready

async function postJSON<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(body) 
  });
  if (!res.ok) throw new Error(`AI API ${url} failed`);
  return res.json();
}

// ---- Semantic Search (optional AI) ----
export async function semanticSearch(query: string): Promise<Array<{
  id: string; 
  title: string; 
  snippet: string; 
  url: string; 
  score: number;
}>> {
  if (AI_MODE === "api") {
    return postJSON("/api/search/semantic", { query });
  }
  // Fallback: simple keyword search (replace with your local index)
  try {
    const resp: any = await postJSON("/api/search/keyword", { query });
    return resp.results || [];
  } catch {
    return [];
  }
}

// ---- Summarize text (optional AI) ----
export async function summarize(text: string, purpose: "impact" | "investor" | "partner"): Promise<string> {
  if (AI_MODE === "api") {
    try {
      const result: any = await postJSON("/api/ai/summarize", { text, purpose });
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

// ---- Translate text (optional AI) ----
export async function translate(text: string, targetLang: string): Promise<string> {
  if (AI_MODE === "api") {
    try {
      const result: any = await postJSON("/api/ai/translate", { text, targetLang });
      return result.translated || text;
    } catch {
      return text;
    }
  }
  return text; // fallback: no translation
}