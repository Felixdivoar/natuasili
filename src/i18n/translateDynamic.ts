import { translate } from "@/lib/ai";

export async function translateDynamic(text: string, targetLang: string): Promise<string> {
  if (targetLang === "en" || !text) return text;
  
  const cacheKey = `${targetLang}:${btoa(text).slice(0, 20)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  
  try {
    const translated = await translate(text, targetLang);
    localStorage.setItem(cacheKey, translated);
    return translated;
  } catch {
    return text; // fallback to English
  }
}