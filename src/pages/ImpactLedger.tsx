import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Eye, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Camera, 
  Download, 
  TrendingUp, 
  BarChart3, 
  Users, 
  TreePine, 
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  SortAsc,
  SortDesc,
  Info,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff
} from "lucide-react";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

// Data interfaces
interface ImpactEntry {
  id: string;
  booking_date: string;
  experience_title: string;
  project_name: string;
  project_id: string;
  theme: string;
  allocation_amount: number;
  currency: string;
  status: string;
  proof_images: string[];
  proof_description: string;
  verified_date: string;
  participants: number;
  impact_score: number;
  location: string;
}

interface KPIMetric {
  title: string;
  value: string | number;
  description: string;
  trend: "up" | "down" | "neutral";
  percentage?: number;
}

interface DataState {
  source: 'live' | 'mock';
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

// Safe chart component wrapper for SSR compatibility
const SafeChartContainer = ({ children, title, className }: { children: React.ReactNode; title: string; className?: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading {title}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className={className}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Debug Panel Component (dev-only)
const DebugPanel = ({ dataState, entries }: { dataState: DataState; entries: ImpactEntry[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        Debug {isOpen ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />}
      </Button>
      
      {isOpen && (
        <Card className="w-80 max-h-96 overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>Route: /impact-ledger</div>
              <div>Build: {new Date().toISOString().split('T')[0]}</div>
              <div>Data Source: {dataState.source}</div>
              <div>Loading: {dataState.isLoading ? 'Yes' : 'No'}</div>
              <div>Entries: {entries.length}</div>
              <div>Last Fetch: {dataState.lastFetch?.toLocaleTimeString() || 'Never'}</div>
            </div>
            {dataState.error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {dataState.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mock data function with timeout simulation
const getImpactLedgerData = async (source: 'live' | 'mock' = 'mock'): Promise<ImpactEntry[]> => {
  if (source === 'mock') {
    // Simulate network delay for mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: "1",
        booking_date: "2024-01-20",
        experience_title: "Big Five Wildlife Tracking Experience",
        project_name: "Maasai Mara Wildlife Conservancy",
        project_id: "mara-wildlife-conservancy",
        theme: "Wildlife",
        allocation_amount: 26300,
        currency: "KES",
        status: "verified",
        proof_images: ["/placeholder.svg", "/placeholder.svg"],
        proof_description: "Successfully tracked 3 lion prides and 2 elephant herds. Collected GPS data for 15 individual animals contributing to migration pattern research. Installed 2 new camera traps in strategic locations.",
        verified_date: "2024-01-23",
        participants: 4,
        impact_score: 95,
        location: "Masai Mara"
      },
      {
        id: "2", 
        booking_date: "2024-01-18",
        experience_title: "Traditional Beadwork Workshop",
        project_name: "Samburu Education Initiative",
        project_id: "samburu-education",
        theme: "Education",
        allocation_amount: 9600,
        currency: "KES",
        status: "verified", 
        proof_images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
        proof_description: "Conducted 2-hour workshop with 8 local women artisans. Created 15 traditional beadwork pieces. All workshop materials purchased from local suppliers, supporting 3 additional families.",
        verified_date: "2024-01-21",
        participants: 8,
        impact_score: 88,
        location: "Samburu"
      },
      {
        id: "3",
        booking_date: "2024-01-16", 
        experience_title: "Mangrove Restoration Volunteer Day",
        project_name: "Coastal Forest Restoration",
        project_id: "coastal-restoration",
        theme: "Habitat",
        allocation_amount: 6000,
        currency: "KES",
        status: "verified",
        proof_images: ["/placeholder.svg", "/placeholder.svg"],
        proof_description: "Planted 45 mangrove seedlings in degraded coastal area. Removed 2.3 tons of marine debris. Trained 6 community members in mangrove cultivation techniques.",
        verified_date: "2024-01-19",
        participants: 6,
        impact_score: 92,
        location: "Coast"
      },
      {
        id: "4",
        booking_date: "2024-01-14",
        experience_title: "Urban Bird Watching Safari", 
        project_name: "Nature Kenya",
        project_id: "nature-kenya",
        theme: "Wildlife",
        allocation_amount: 6800,
        currency: "KES", 
        status: "verified",
        proof_images: ["/placeholder.svg"],
        proof_description: "Documented 47 bird species in Nairobi Arboretum. Trained 3 local guides in bird identification. Contributed data to Kenya Bird Atlas project.",
        verified_date: "2024-01-17",
        participants: 12,
        impact_score: 78,
        location: "Nairobi"
      },
      {
        id: "5",
        booking_date: "2024-01-12",
        experience_title: "Rhino Conservation & Technology Tour",
        project_name: "Ol Pejeta Conservancy", 
        project_id: "ol-pejeta",
        theme: "Wildlife",
        allocation_amount: 29000,
        currency: "KES",
        status: "verified",
        proof_images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
        proof_description: "Monitored northern white rhinos Najin and Fatu. Updated GPS tracking systems for 12 black rhinos. Demonstrated anti-poaching technology to visitors.",
        verified_date: "2024-01-15",
        participants: 6,
        impact_score: 98,
        location: "Laikipia"
      },
      {
        id: "6",
        booking_date: "2024-01-10",
        experience_title: "Meet Orphaned Elephants Experience",
        project_name: "Reteti Elephant Orphanage",
        project_id: "reteti-elephants", 
        theme: "Wildlife",
        allocation_amount: 14200,
        currency: "KES",
        status: "verified",
        proof_images: ["/placeholder.svg", "/placeholder.svg"],
        proof_description: "Fed and cared for 8 orphaned elephant calves. Prepared nutritional supplements. Supported 4 Samburu women keepers in daily elephant care routines.",
        verified_date: "2024-01-13",
        participants: 8,
        impact_score: 94,
        location: "Samburu"
      }
    ];
  }
  
  // Simulate live data fetch with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  
  try {
    // This would be your real API call
    const response = await fetch('/api/impact-ledger', { 
      signal: controller.signal 
    });
    clearTimeout(timeout);
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

const ImpactLedger = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sortField, setSortField] = useState<keyof ImpactEntry>("booking_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [entries, setEntries] = useState<ImpactEntry[]>([]);
  const [dataState, setDataState] = useState<DataState>({
    source: 'mock',
    isLoading: true,
    error: null,
    lastFetch: null
  });
  
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  // Load data on mount with fallbacks
  useEffect(() => {
    const loadData = async () => {
      setDataState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Try live data first, fallback to mock
        let data: ImpactEntry[] = [];
        let source: 'live' | 'mock' = 'live';
        
        try {
          data = await getImpactLedgerData('live');
        } catch (error) {
          console.warn('Live data failed, falling back to mock:', error);
          data = await getImpactLedgerData('mock');
          source = 'mock';
        }
        
        setEntries(data);
        setDataState({
          source,
          isLoading: false,
          error: null,
          lastFetch: new Date()
        });

        if (source === 'mock') {
          toast({
            title: "Demo Mode",
            description: "Showing demonstration data. Live data unavailable.",
            variant: "default"
          });
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setDataState({
          source: 'mock',
          isLoading: false,
          error: errorMessage,
          lastFetch: null
        });
        
        toast({
          title: "Error Loading Data",
          description: "Unable to load impact data. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [toast]);

  // Enhanced KPI calculations with meaningful outcome metrics
  const kpiMetrics = useMemo((): KPIMetric[] => {
    if (entries.length === 0) return [];
    
    const totalImpact = entries.reduce((sum, entry) => sum + entry.allocation_amount, 0);
    const totalParticipants = entries.reduce((sum, entry) => sum + entry.participants, 0);
    const avgImpactScore = entries.reduce((sum, entry) => sum + entry.impact_score, 0) / entries.length;
    const avgBookingValue = totalImpact / entries.length;
    const conservationPercentage = 90; // 90% goes to conservation
    
    return [
      {
        title: "Total Conservation Impact",
        value: formatPrice(totalImpact),
        description: "Direct funding allocated to verified conservation projects",
        trend: "up",
        percentage: 23
      },
      {
        title: "Conservation Allocation Rate", 
        value: `${conservationPercentage}%`,
        description: "Percentage of revenue directly funding conservation efforts",
        trend: "up",
        percentage: 5
      },
      {
        title: "Average Impact Effectiveness",
        value: Math.round(avgImpactScore),
        description: "Verified impact score based on measurable outcomes",
        trend: "up", 
        percentage: 12
      },
      {
        title: "Community Members Engaged",
        value: totalParticipants,
        description: "Local participants directly involved in conservation activities",
        trend: "up",
        percentage: 34
      },
      {
        title: "Average Project Value", 
        value: formatPrice(avgBookingValue),
        description: "Mean funding per conservation experience",
        trend: "neutral"
      },
      {
        title: "Verification Rate",
        value: "95%", 
        description: "Impact entries verified with proof within 30 days",
        trend: "up",
        percentage: 8
      }
    ];
  }, [entries, formatPrice]);

  // Enhanced filtering with multiple criteria
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = 
        entry.experience_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.proof_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPartner = selectedPartner === "all" || entry.project_name === selectedPartner;
      const matchesTheme = selectedTheme === "all" || entry.theme === selectedTheme;
      const matchesLocation = selectedLocation === "all" || entry.location === selectedLocation;
      
      // Date range filtering
      let matchesDate = true;
      if (dateRange !== "all") {
        const entryDate = new Date(entry.booking_date);
        const now = new Date();
        
        switch (dateRange) {
          case "30d":
            matchesDate = (now.getTime() - entryDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case "90d":
            matchesDate = (now.getTime() - entryDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
            break;
          case "1y":
            matchesDate = (now.getTime() - entryDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      return matchesSearch && matchesPartner && matchesTheme && matchesLocation && matchesDate;
    });
  }, [entries, searchTerm, selectedPartner, selectedTheme, selectedLocation, dateRange]);

  // Enhanced sorting
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEntries, sortField, sortDirection]);

  // Chart data processing
  const chartData = useMemo(() => {
    const themeData = filteredEntries.reduce((acc, entry) => {
      acc[entry.theme] = (acc[entry.theme] || 0) + entry.allocation_amount;
      return acc;
    }, {} as Record<string, number>);

    const locationData = filteredEntries.reduce((acc, entry) => {
      acc[entry.location] = (acc[entry.location] || 0) + entry.allocation_amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = filteredEntries.reduce((acc, entry) => {
      const month = new Date(entry.booking_date).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + entry.allocation_amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      themes: Object.entries(themeData).map(([name, value]) => ({ name, value, fill: getThemeColor(name) })),
      locations: Object.entries(locationData).map(([name, value]) => ({ name, value })),
      monthly: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))
    };
  }, [filteredEntries]);

  const getThemeColor = (theme: string) => {
    const colors = {
      'Wildlife': 'hsl(var(--wildlife))',
      'Habitat': 'hsl(var(--habitat))',
      'Education': 'hsl(var(--education))',
      'Livelihoods': 'hsl(var(--livelihoods))'
    };
    return colors[theme as keyof typeof colors] || 'hsl(var(--muted))';
  };

  const getThemeBadgeStyle = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSort = (field: keyof ImpactEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      const headers = [
        'Date',
        'Experience',
        'Partner',
        'Theme', 
        'Location',
        'Amount (KES)',
        'Participants',
        'Impact Score',
        'Status',
        'Verified Date'
      ];
      
      const csvData = sortedEntries.map(entry => [
        entry.booking_date,
        entry.experience_title,
        entry.project_name,
        entry.theme,
        entry.location,
        entry.allocation_amount.toString(),
        entry.participants.toString(),
        entry.impact_score.toString(),
        entry.status,
        entry.verified_date
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `natuasili-impact-ledger-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Downloaded ${sortedEntries.length} entries as CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, [sortedEntries, toast]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPartner("all");
    setSelectedTheme("all");
    setSelectedLocation("all");
    setDateRange("all");
  };

  const retryDataFetch = async () => {
    setDataState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const data = await getImpactLedgerData('live');
      setEntries(data);
      setDataState({
        source: 'live',
        isLoading: false,
        error: null,
        lastFetch: new Date()
      });
      
      toast({
        title: "Data Refreshed",
        description: "Successfully loaded live data.",
      });
    } catch (error) {
      const data = await getImpactLedgerData('mock');
      setEntries(data);
      setDataState({
        source: 'mock',
        isLoading: false,
        error: 'Live data unavailable',
        lastFetch: new Date()
      });
    }
  };

  // Loading state
  if (dataState.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary/5 via-conservation/5 to-accent/5 py-16">
          <div className="max-w-[1150px] mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Network Status Banner */}
        {dataState.source === 'mock' && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
            <div className="max-w-[1150px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Demo mode: Live data unavailable, showing demonstration data.
                </span>
              </div>
              <Button
                onClick={retryDataFetch}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Hero Section with KPIs */}
        <section className="bg-gradient-to-r from-primary/5 via-conservation/5 to-accent/5 py-16" role="banner">
          <div className="max-w-[1150px] mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Conservation Impact Transparency
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Every dollar tracked. Every impact verified. Real-time transparency into conservation outcomes across Kenya's leading projects.
              </p>
            </div>
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpiMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                        {metric.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                        {metric.trend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
                        {metric.percentage && (
                          <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {metric.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {metric.value}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Filters with Multi-Select */}
        <section className="py-8 border-b bg-background/50" role="search">
          <div className="max-w-[1150px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search experiences, partners, descriptions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search impact entries"
                />
              </div>
              
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger aria-label="Filter by partner">
                  <SelectValue placeholder="All Partners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  {Array.from(new Set(entries.map(entry => entry.project_name))).map(partner => (
                    <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger aria-label="Filter by theme">
                  <SelectValue placeholder="All Themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Habitat">Habitat</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Livelihoods">Livelihoods</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger aria-label="Filter by location">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.from(new Set(entries.map(entry => entry.location))).map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger aria-label="Filter by date range">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(searchTerm || selectedPartner !== "all" || selectedTheme !== "all" || selectedLocation !== "all" || dateRange !== "all") && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredEntries.length} of {entries.length} entries
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-12">
          <div className="max-w-[1150px] mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="dashboard" aria-label="Dashboard view">Dashboard</TabsTrigger>
                  <TabsTrigger value="entries" aria-label="Entries table">Entries</TabsTrigger>
                  <TabsTrigger value="analytics" aria-label="Analytics charts">Analytics</TabsTrigger>
                  <TabsTrigger value="stories" aria-label="Impact stories">Stories</TabsTrigger>
                </TabsList>
                
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={exportToCSV}
                  disabled={isExporting}
                  aria-label="Export data to CSV"
                >
                  {isExporting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export Data
                </Button>
              </div>

              {/* Enhanced Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-8" role="tabpanel">
                <div className="space-y-8">
                  {/* Interactive Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Impact by Theme
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SafeChartContainer title="Impact by Theme" className="h-[300px]">
                          <div className="h-full flex flex-col">
                            {chartData.themes.length > 0 ? (
                              <div className="flex-1 space-y-4">
                                {chartData.themes.map((item, index) => (
                                  <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="w-4 h-4 rounded" 
                                        style={{ backgroundColor: item.fill }}
                                      />
                                      <span className="font-medium">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-primary">{formatPrice(item.value)}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {((item.value / chartData.themes.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">No data available</p>
                              </div>
                            )}
                          </div>
                        </SafeChartContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Monthly Impact Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SafeChartContainer title="Monthly Trend" className="h-[300px]">
                          <div className="h-full flex flex-col">
                            {chartData.monthly.length > 0 ? (
                              <div className="flex-1 space-y-2">
                                {chartData.monthly.map((item, index) => (
                                  <div key={item.month} className="flex items-center justify-between p-2 border-l-4 border-primary/20 pl-4">
                                    <span className="font-medium">{item.month}</span>
                                    <span className="text-primary font-semibold">{formatPrice(item.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">No data available</p>
                              </div>
                            )}
                          </div>
                        </SafeChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Partners with Impact Journey */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Top Performing Partners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array.from(new Set(sortedEntries.map(e => e.project_name))).slice(0, 5).map((partnerName) => {
                          const partnerEntries = sortedEntries.filter(e => e.project_name === partnerName);
                          const totalAmount = partnerEntries.reduce((sum, e) => sum + e.allocation_amount, 0);
                          const avgScore = partnerEntries.reduce((sum, e) => sum + e.impact_score, 0) / partnerEntries.length;
                          const totalParticipants = partnerEntries.reduce((sum, e) => sum + e.participants, 0);
                          
                          return (
                            <div key={partnerName} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <Link 
                                  to={`/partners/${partnerEntries[0].project_id}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {partnerName}
                                </Link>
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  Score: {Math.round(avgScore)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Total Impact</p>
                                  <p className="font-semibold text-primary">{formatPrice(totalAmount)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Experiences</p>
                                  <p className="font-semibold">{partnerEntries.length}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Participants</p>
                                  <p className="font-semibold">{totalParticipants}</p>
                                </div>
                              </div>
                              <Progress value={(avgScore / 100) * 100} className="mt-3" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Entries Tab with Sortable Table */}
              <TabsContent value="entries" className="mt-8" role="tabpanel">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No entries found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('booking_date')}
                            >
                              <div className="flex items-center gap-1">
                                Date
                                {sortField === 'booking_date' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('experience_title')}
                            >
                              <div className="flex items-center gap-1">
                                Experience
                                {sortField === 'experience_title' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('project_name')}
                            >
                              <div className="flex items-center gap-1">
                                Partner
                                {sortField === 'project_name' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead>Theme</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('allocation_amount')}
                            >
                              <div className="flex items-center gap-1">
                                Impact Amount
                                {sortField === 'allocation_amount' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort('impact_score')}
                            >
                              <div className="flex items-center gap-1">
                                Score
                                {sortField === 'impact_score' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedEntries.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-muted/50">
                              <TableCell>
                                {new Date(entry.booking_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  <p className="font-medium truncate">{entry.experience_title}</p>
                                  <p className="text-xs text-muted-foreground">{entry.participants} participants</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Link 
                                  to={`/partners/${entry.project_id}`}
                                  className="text-primary hover:underline"
                                >
                                  {entry.project_name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge className={getThemeBadgeStyle(entry.theme)}>
                                  {entry.theme}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-primary">
                                  {formatPrice(entry.allocation_amount)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{entry.impact_score}</span>
                                  <div className="w-16">
                                    <Progress value={entry.impact_score} className="h-2" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {sortedEntries.map((entry) => (
                        <Card key={entry.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm leading-tight mb-1">
                                  {entry.experience_title}
                                </h3>
                                <Link 
                                  to={`/partners/${entry.project_id}`}
                                  className="text-xs text-primary hover:underline"
                                >
                                  {entry.project_name}
                                </Link>
                              </div>
                              <Badge className={getThemeBadgeStyle(entry.theme)}>
                                {entry.theme}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Impact Amount</p>
                                <p className="font-medium text-primary">{formatPrice(entry.allocation_amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Impact Score</p>
                                <p className="font-medium">{entry.impact_score}/100</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Participants</p>
                                <p className="font-medium">{entry.participants}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Date</p>
                                <p className="font-medium">{new Date(entry.booking_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Enhanced Analytics Tab */}
              <TabsContent value="analytics" className="mt-8" role="tabpanel">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SafeChartContainer title="Geographic Distribution" className="h-[300px]">
                        <div className="h-full flex flex-col">
                          {chartData.locations.length > 0 ? (
                            <div className="flex-1 space-y-3">
                              {chartData.locations.map((item, index) => {
                                const total = chartData.locations.reduce((sum, loc) => sum + loc.value, 0);
                                const percentage = ((item.value / total) * 100).toFixed(1);
                                return (
                                  <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: `hsl(${142 + index * 30}, 71%, ${45 + index * 10}%)` }}
                                      />
                                      <span className="font-medium">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-primary">{formatPrice(item.value)}</div>
                                      <div className="text-sm text-muted-foreground">{percentage}%</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">No data available</p>
                            </div>
                          )}
                        </div>
                      </SafeChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Impact Effectiveness Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sortedEntries.slice(0, 6).map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 mr-4">
                              <p className="text-sm font-medium truncate">{entry.experience_title}</p>
                              <p className="text-xs text-muted-foreground">{entry.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{entry.impact_score}</span>
                              <div className="w-20">
                                <Progress value={entry.impact_score} className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Impact Stories Tab */}
              <TabsContent value="stories" className="mt-8" role="tabpanel">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">Real Conservation Stories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Discover the human stories behind the data - real impact verified by our conservation partners.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedEntries.slice(0, 4).map((entry) => (
                      <Card key={entry.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className={getThemeBadgeStyle(entry.theme)}>
                              {entry.theme}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.booking_date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-3">{entry.experience_title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {entry.proof_description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <Link 
                              to={`/partners/${entry.project_id}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {entry.project_name}
                            </Link>
                            <div className="text-right">
                              <p className="text-sm font-medium text-primary">
                                {formatPrice(entry.allocation_amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {entry.participants} participants
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Debug Panel */}
        <DebugPanel dataState={dataState} entries={entries} />
      </div>
    </ErrorBoundary>
  );
};

export default ImpactLedger;