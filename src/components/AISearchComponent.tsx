import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, MapPin, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { EXPERIENCES } from "@/data/partners";
import { PARTNERS } from "@/data/partners";

interface SearchResult {
  id: string;
  title: string;
  type: "experience" | "partner" | "destination";
  snippet: string;
  url: string;
  score: number;
  metadata?: any;
}

interface AISearchProps {
  variant?: "desktop" | "mobile";
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const DESTINATIONS = [
  { label: "Nairobi", slug: "nairobi", type: "destination" },
  { label: "Coastal Kenya", slug: "coast", type: "destination" },
  { label: "Samburu", slug: "samburu", type: "destination" },
  { label: "Masai Mara", slug: "masai-mara", type: "destination" },
  { label: "Laikipia", slug: "laikipia", type: "destination" },
];

const POPULAR_QUERIES = [
  "wildlife conservation",
  "elephant sanctuary",
  "marine conservation",
  "cultural experiences",
  "bird watching",
  "rhino tracking",
];

const RECENT_SEARCHES = [
  "elephant conservation in Laikipia",
  "marine projects at coast",
  "wildlife tracking Masai Mara",
];

export default function AISearchComponent({ variant = "desktop", isOpen = false, onClose, className = "" }: AISearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState({ destination: "", theme: "", activity: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [isMouseOverPanel, setIsMouseOverPanel] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Simulate AI search with local data
      const searchResults = await searchLocalData(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
        setShowSuggestions(true);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  // Mock AI search function - replace with actual AI implementation
  const searchLocalData = async (searchQuery: string): Promise<SearchResult[]> => {
    const normalizedQuery = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search experiences
    EXPERIENCES.forEach(exp => {
      let score = 0;
      const searchText = `${exp.title} ${exp.partner} ${exp.destination} ${exp.themes.join(' ')} ${exp.activities.join(' ')}`.toLowerCase();
      
      if (searchText.includes(normalizedQuery)) {
        score = 1;
        // Boost score for exact matches
        if (exp.title.toLowerCase().includes(normalizedQuery)) score += 0.5;
        if (exp.destination.includes(normalizedQuery)) score += 0.3;
        
        results.push({
          id: exp.id,
          title: exp.title,
          type: "experience",
          snippet: `${exp.partner} • ${exp.destination.replace('-', ' ')} • ${exp.themes.join(', ')}`,
          url: `/listings/${exp.slug}`,
          score,
          metadata: { destination: exp.destination, themes: exp.themes }
        });
      }
    });

    // Search partners
    Object.values(PARTNERS).forEach(partner => {
      const searchText = `${partner.name} ${partner.location} ${partner.description}`.toLowerCase();
      
      if (searchText.includes(normalizedQuery)) {
        results.push({
          id: partner.id,
          title: partner.name,
          type: "partner",
          snippet: `${partner.location} • ${partner.description.slice(0, 50)}...`,
          url: `/partner/${partner.slug}`,
          score: 0.8,
          metadata: { location: partner.location, description: partner.description }
        });
      }
    });

    // Search destinations
    DESTINATIONS.forEach(dest => {
      if (dest.label.toLowerCase().includes(normalizedQuery)) {
        results.push({
          id: dest.slug,
          title: dest.label,
          type: "destination",
          snippet: `Destination in Kenya`,
          url: `/destinations/${dest.slug}`,
          score: 0.9,
          metadata: { type: "destination" }
        });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigate(results[selectedIndex].url);
        handleClose();
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        handleClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onClose?.();
  };

  const handleResultClick = (result: SearchResult) => {
    // Analytics event
    console.log("Search result clicked:", result);
    navigate(result.url);
    handleClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  if (variant === "mobile") {
    // Mobile variant should always render when called
  }

  return (
    <div 
      ref={containerRef}
      className={`${variant === "mobile" ? "ai-search-mobile" : "relative"} ${className}`}
    >
      {variant === "mobile" && (
        <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
          <h2 className="text-lg font-medium">Search</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className={variant === "mobile" ? "p-4 flex-1 overflow-y-auto" : "relative"}>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setShowSuggestions(false);
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.trim() || (!query && variant === "desktop")) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Hide suggestions after a small delay to allow clicks on suggestions
                setTimeout(() => {
                  if (!isMouseOverPanel) {
                    setShowSuggestions(false);
                  }
                }, 150);
              }}
              placeholder="Search experiences, partners, destinations…"
              className={`w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ai-search-input ${
                variant === "desktop" ? "min-w-[280px]" : ""
              }`}
              autoComplete="off"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          {variant === "mobile" && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                Filters
              </Button>
              {filters.destination && (
                <Badge variant="secondary" className="text-xs">
                  {filters.destination}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, destination: "" }))} />
                </Badge>
              )}
            </div>
          )}

          {/* Dropdown Results */}
          {showSuggestions && (query || (!query && variant === "desktop")) && (
            <Card 
              className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto z-50 border-border"
              onMouseEnter={() => setIsMouseOverPanel(true)}
              onMouseLeave={() => setIsMouseOverPanel(false)}
            >
              <CardContent className="p-0">
                {loading && (
                  <div className="p-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                )}

                {!query && showSuggestions && (
                  <>
                    {/* Recent Searches */}
                    <div className="p-3 border-b">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        Recent searches
                      </div>
                      {RECENT_SEARCHES.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(search)}
                          className="block w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded text-foreground"
                        >
                          {search}
                        </button>
                      ))}
                    </div>

                    {/* Popular Queries */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                        <TrendingUp className="h-3 w-3" />
                        Popular searches
                      </div>
                      {POPULAR_QUERIES.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(search)}
                          className="block w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded text-foreground"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Search Results */}
                {results.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {results.map((result, idx) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={`w-full text-left p-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                          selectedIndex === idx ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-background border">
                            {result.type === "experience" && <Search className="h-3 w-3" />}
                            {result.type === "partner" && <Search className="h-3 w-3" />}
                            {result.type === "destination" && <MapPin className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">{result.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{result.snippet}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {result.type}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {query && results.length === 0 && !loading && (
                  <div className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-2">No results found</div>
                    <div className="text-xs text-muted-foreground">
                      Try searching for wildlife, destinations, or conservation themes
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}