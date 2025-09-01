import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { semanticSearch } from "@/lib/ai";

export default function SemanticSearchBar() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    id: string; 
    title: string; 
    snippet: string; 
    url: string;
    score?: number;
  }>>([]);

  const debouncedQ = useMemo(() => q, [q]);
  
  useEffect(() => {
    const id = setTimeout(async () => {
      if (!debouncedQ.trim()) { 
        setResults([]); 
        return; 
      }
      setLoading(true);
      try {
        const r = await semanticSearch(debouncedQ.trim());
        setResults(r);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally { 
        setLoading(false); 
      }
    }, 300);
    
    return () => clearTimeout(id);
  }, [debouncedQ]);

  return (
    <div className="space-y-3">
      <Input 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        placeholder="Search by cause, wildlife, location… e.g., elephant conservation in Laikipia" 
        className="w-full"
      />
      
      {loading && (
        <div className="text-sm text-muted-foreground">Searching…</div>
      )}
      
      <div className="grid gap-3">
        {results.map(r => (
          <Card key={r.id} className="hover:border-primary transition">
            <CardContent className="p-4">
              <a href={r.url} className="font-semibold hover:underline block">
                {r.title}
              </a>
              <p className="text-sm text-muted-foreground mt-1">{r.snippet}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}