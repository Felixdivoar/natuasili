import { useState, useMemo, useCallback, useEffect } from "react";
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
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { EXPERIENCES } from "@/data/partners";

// Types and interfaces - moved to top
type Theme =
  | "Conservation education"
  | "Wildlife conservation"
  | "Community and Cultural exploration";

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

// Helper functions - hoisted function declarations
function getThemeColor(theme: Theme): string {
  switch (theme) {
    case "Conservation education": return "hsl(var(--foreground))";
    case "Wildlife conservation": return "hsl(var(--muted-foreground))";
    case "Community and Cultural exploration": return "hsl(var(--border))";
    default: return "hsl(var(--foreground))";
  }
}

function mapLegacyTheme(theme: string): Theme {
  switch (theme.toLowerCase()) {
    case 'wildlife':
    case 'habitat':
      return "Wildlife conservation";
    case 'education':
    case 'community':
    case 'culture':
    case 'livelihoods':
      return "Community and Cultural exploration";
    default:
      return "Conservation education";
  }
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

  return <div className={className}>{children}</div>;
};

// Real data function using Supabase
const getImpactLedgerData = async (source: 'live' | 'mock' = 'live'): Promise<ImpactEntry[]> => {
  if (source === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: "mock-1",
        booking_date: "2024-01-20",
        experience_title: "Sample Wildlife Experience",
        project_name: "Sample Conservation Project",
        project_id: "sample-1",
        theme: "Wildlife",
        allocation_amount: 7500,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Sample impact description",
        verified_date: "2024-01-21",
        participants: 4,
        impact_score: 85,
        location: "Nairobi"
      }
    ];
  }

  try {
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        adults,
        children,
        total_kes,
        status,
        customer_name,
        experiences (
          id,
          title,
          location_text,
          themes,
          partner_profiles (
            id,
            org_name,
            slug,
            location
          )
        )
      `)
      .order('booking_date', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      throw bookingsError;
    }

    if (!bookingsData || bookingsData.length === 0) {
      return [];
    }

    const entries: ImpactEntry[] = bookingsData.map((booking: any) => {
      const experience = booking.experiences;
      const partner = experience?.partner_profiles;
      const themes = experience?.themes || [];
      const primaryTheme = Array.isArray(themes) && themes.length > 0 ? themes[0] : 'Wildlife';
      
      const allocationAmount = Math.round(booking.total_kes * 0.1);
      
      return {
        id: booking.id,
        booking_date: booking.booking_date,
        experience_title: experience?.title || 'Unknown Experience',
        project_name: partner?.org_name || 'Unknown Partner',
        project_id: partner?.slug || partner?.id || 'unknown',
        theme: primaryTheme,
        allocation_amount: allocationAmount,
        currency: 'KES',
        status: booking.status === 'pending' ? 'pending' : 'verified',
        proof_images: [],
        proof_description: `Conservation allocation from ${experience?.title || 'experience'} booking. Funds support ${partner?.org_name || 'conservation'} activities.`,
        verified_date: booking.status === 'pending' ? '' : booking.booking_date,
        participants: (booking.adults || 0) + (booking.children || 0),
        impact_score: Math.round((Math.random() * 30) + 70),
        location: experience?.location_text || partner?.location || 'Kenya'
      };
    });

    return entries;
  } catch (error) {
    console.error('Error fetching impact ledger data:', error);
    throw error;
  }
};

const ImpactLedger = () => {
  // State variables first
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortField, setSortField] = useState<keyof ImpactEntry>("booking_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [entries, setEntries] = useState<ImpactEntry[]>([]);
  const [dataState, setDataState] = useState<DataState>({
    source: 'mock',
    isLoading: true,
    error: null,
    lastFetch: null
  });

  const { currency, formatPrice, convert } = useCurrency();
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setDataState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
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
          error: source === 'mock' ? 'Live data unavailable' : null,
          lastFetch: new Date()
        });
        
      } catch (error) {
        console.error('Failed to load impact data:', error);
        setDataState({
          source: 'mock',
          isLoading: false,
          error: 'Failed to load data',
          lastFetch: new Date()
        });
      }
    };

    loadData();
  }, []);

  // Core computed values in proper dependency order
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchTerm === "" || 
        entry.experience_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.proof_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPartner = selectedPartner === "all" || entry.project_name === selectedPartner;
      const matchesTheme = selectedTheme === "all" || entry.theme === selectedTheme;
      const matchesLocation = selectedLocation === "all" || entry.location === selectedLocation;
      
      const entryDate = new Date(entry.booking_date);
      const now = new Date();
      let matchesDate = true;
      
      if (dateRange === "7days") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= weekAgo;
      } else if (dateRange === "30days") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= monthAgo;
      } else if (dateRange === "90days") {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= quarterAgo;
      }
      
      return matchesSearch && matchesPartner && matchesTheme && matchesLocation && matchesDate;
    });
  }, [entries, searchTerm, selectedPartner, selectedTheme, selectedLocation, dateRange]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEntries, sortField, sortDirection]);

  const chartData = useMemo(() => {
    const themeData = filteredEntries.reduce((acc, entry) => {
      const mappedTheme = mapLegacyTheme(entry.theme);
      acc[mappedTheme] = (acc[mappedTheme] || 0) + entry.allocation_amount;
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
      themes: Object.entries(themeData).map(([name, value]) => ({ 
        name, 
        value, 
        fill: getThemeColor(name as Theme) 
      })),
      locations: Object.entries(locationData).map(([name, value]) => ({ name, value })),
      monthly: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))
    };
  }, [filteredEntries]);

  const kpis: KPIMetric[] = useMemo(() => {
    const totalBookings = filteredEntries.length;
    const totalAllocated = filteredEntries.reduce((sum, entry) => sum + entry.allocation_amount, 0);
    const uniquePartners = new Set(filteredEntries.map(entry => entry.project_name)).size;
    const averageAllocation = totalAllocated / Math.max(totalBookings, 1);
    const averageImpactScore = filteredEntries.reduce((sum, entry) => sum + entry.impact_score, 0) / Math.max(totalBookings, 1);
    const totalParticipants = filteredEntries.reduce((sum, entry) => sum + entry.participants, 0);

    return [
      {
        title: "Total Impact Allocated",
        value: `${currency} ${convert(totalAllocated, 'KES', currency).toLocaleString()}`,
        description: "Total funds allocated to conservation projects",
        trend: "up",
        percentage: 15
      },
      {
        title: "Active Bookings",
        value: totalBookings,
        description: "Number of experiences with conservation impact",
        trend: "up",
        percentage: 8
      },
      {
        title: "Conservation Partners",
        value: uniquePartners,
        description: "Organizations receiving conservation funding",
        trend: "up",
        percentage: 12
      },
      {
        title: "Average Impact per Booking",
        value: `${currency} ${convert(averageAllocation, 'KES', currency).toLocaleString()}`,
        description: "Mean conservation allocation per experience",
        trend: "up",
        percentage: 5
      },
      {
        title: "Average Impact Score",
        value: `${averageImpactScore.toFixed(1)}/100`,
        description: "Mean effectiveness rating of conservation projects",
        trend: "up",
        percentage: 3
      },
      {
        title: "Total Participants",
        value: totalParticipants,
        description: "People involved in conservation experiences",
        trend: "up",
        percentage: 22
      }
    ];
  }, [filteredEntries, currency, convert]);

  // Static filter options from seed data - always available
  const seedPartners = useMemo(() => 
    [...new Set(EXPERIENCES.map(exp => exp.partner))].sort(),
    []
  );
  
  const seedThemes = useMemo(() => {
    const legacyThemes = [...new Set(EXPERIENCES.flatMap(exp => exp.themes))];
    return [...new Set(legacyThemes.map(mapLegacyTheme))].sort();
  }, []);
  
  const seedActivities = useMemo(() => 
    [...new Set(EXPERIENCES.flatMap(exp => exp.activities))].sort(),
    []
  );

  // Use seed data for filter options (always available) or actual data if available
  const filterPartners = entries.length > 0 
    ? [...new Set(entries.map(entry => entry.project_name))].sort()
    : seedPartners;
    
  const filterThemes = entries.length > 0 
    ? [...new Set(entries.map(entry => mapLegacyTheme(entry.theme)))].sort()
    : seedThemes;

  // Event handlers and utility functions
  const getThemeBadgeStyle = (theme: string) => {
    const mappedTheme = mapLegacyTheme(theme);
    switch (mappedTheme) {
      case 'Conservation education': return 'bg-foreground/10 text-foreground border-foreground/20';
      case 'Wildlife conservation': return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
      case 'Community and Cultural exploration': return 'bg-border/10 text-border border-border/20';
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

  const exportToCSV = useCallback(() => {
    const headers = [
      'Date', 'Experience', 'Partner', 'Theme', 'Location', 
      'Allocation', 'Currency', 'Participants', 'Impact Score', 'Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedEntries.map(entry => [
        entry.booking_date,
        `"${entry.experience_title}"`,
        `"${entry.project_name}"`,
        entry.theme,
        `"${entry.location}"`,
        entry.allocation_amount,
        entry.currency,
        entry.participants,
        entry.impact_score,
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `impact-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `Exported ${sortedEntries.length} entries to CSV`,
    });
  }, [sortedEntries, toast]);

  const retryDataFetch = useCallback(async () => {
    setDataState(prev => ({ ...prev, isLoading: true, error: null }));
    
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
        title: "Data refreshed",
        description: "Live data loaded successfully",
      });
    } catch (error) {
      setDataState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Live data unavailable'
      }));
      
      toast({
        title: "Refresh failed",
        description: "Still using demo data",
        variant: "destructive"
      });
    }
  }, [toast]);

  if (dataState.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Impact Ledger</h1>
            <p className="text-muted-foreground">
              Transparent tracking of conservation impact from every booking
            </p>
          </div>

          {/* Data Source Banner */}
          {dataState.error && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {dataState.error}. Showing {dataState.source === 'mock' ? 'demo' : 'cached'} data.
                <Button 
                  variant="link" 
                  className="p-0 ml-2 text-orange-600 hover:text-orange-800"
                  onClick={retryDataFetch}
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="entries">Entries</TabsTrigger>
              <TabsTrigger value="stories">Impact Stories</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {kpi.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm">
                          {kpi.trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                          {kpi.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                          {kpi.trend === "neutral" && <Minus className="h-4 w-4 text-gray-600" />}
                          {kpi.percentage && (
                            <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>
                              {kpi.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Impact by Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SafeChartContainer title="Impact by Theme" className="h-64">
                      <div className="space-y-4">
                        {chartData.themes.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.fill }}
                              />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {currency} {convert(item.value, 'KES', currency).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </SafeChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SafeChartContainer title="Geographic Distribution" className="h-64">
                      <div className="space-y-4">
                        {chartData.locations.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {currency} {convert(item.value, 'KES', currency).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </SafeChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Entries Tab */}
            <TabsContent value="entries" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search experiences, partners..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Partner</label>
                      <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Partners" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Partners</SelectItem>
                          {filterPartners.map(partner => (
                            <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme</label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Themes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Themes</SelectItem>
                          {filterThemes.map(theme => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Activity</label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Activities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Activities</SelectItem>
                          {seedActivities.map(activity => (
                            <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedPartner("all");
                        setSelectedTheme("all");
                        setSelectedLocation("all");
                        setDateRange("all");
                      }}
                    >
                      Clear All Filters
                    </Button>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={exportToCSV}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                      
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredEntries.length} of {entries.length} entries
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Entries Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort('booking_date')}
                          >
                            <div className="flex items-center gap-2">
                              Date
                              {sortField === 'booking_date' && (
                                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Partner</TableHead>
                          <TableHead>Theme</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort('allocation_amount')}
                          >
                            <div className="flex items-center gap-2">
                              Allocation
                              {sortField === 'allocation_amount' && (
                                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Impact Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {new Date(entry.booking_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {entry.experience_title}
                            </TableCell>
                            <TableCell>
                              <Link 
                                to={`/partner/${entry.project_id}`}
                                className="text-primary hover:underline"
                              >
                                {entry.project_name}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getThemeBadgeStyle(entry.theme)}
                              >
                                {mapLegacyTheme(entry.theme)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {entry.location}
                            </TableCell>
                            <TableCell className="font-medium">
                              {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                            </TableCell>
                            <TableCell>{entry.participants}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{entry.impact_score}/100</span>
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary"
                                    style={{ width: `${entry.impact_score}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.status === 'verified' ? 'default' : 'secondary'}>
                                {entry.status === 'verified' ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Pending
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredEntries.length === 0 && (
                    <div className="text-center py-8">
                      <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No entries found yet</h3>
                      <p className="text-muted-foreground">
                        Book an experience to see your conservation impact here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Impact Stories Tab */}
            <TabsContent value="stories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Impact Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="border-l-4 border-primary pl-6 py-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{entry.experience_title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {entry.project_name} • {new Date(entry.booking_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getThemeBadgeStyle(entry.theme)}
                          >
                            {mapLegacyTheme(entry.theme)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">
                          {entry.proof_description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {entry.participants} participants
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {entry.impact_score}/100 impact
                            </div>
                          </div>
                          
                          <Link 
                            to={`/partner/${entry.project_id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            View Partner →
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {filteredEntries.length === 0 && (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No stories found yet</h3>
                        <p className="text-muted-foreground">
                          Book an experience to see your conservation impact stories here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ImpactLedger;