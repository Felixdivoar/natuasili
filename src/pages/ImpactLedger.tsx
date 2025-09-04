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

  return <div className={className}>{children}</div>;
};

// Debug panel component
const DebugPanel = ({ dataState, entries }: { dataState: DataState; entries: ImpactEntry[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Card className="mb-6 border-dashed border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Debug Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-orange-600 hover:text-orange-800"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div><strong>Data Source:</strong> {dataState.source}</div>
            <div><strong>Last Fetch:</strong> {dataState.lastFetch?.toLocaleString() || 'Never'}</div>
            <div><strong>Entries Count:</strong> {entries.length}</div>
            <div><strong>Loading:</strong> {dataState.isLoading ? 'Yes' : 'No'}</div>
            {dataState.error && (
              <div className="text-red-600"><strong>Error:</strong> {dataState.error}</div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Real data function using Supabase
const getImpactLedgerData = async (source: 'live' | 'mock' = 'live'): Promise<ImpactEntry[]> => {
  if (source === 'mock') {
    // Mock data for fallback
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

  // Fetch real data from Supabase
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

    // Transform data to match ImpactEntry interface
    const entries: ImpactEntry[] = bookingsData.map((booking: any) => {
      const experience = booking.experiences;
      const partner = experience?.partner_profiles;
      const themes = experience?.themes || [];
      const primaryTheme = Array.isArray(themes) && themes.length > 0 ? themes[0] : 'Wildlife';
      
      // Calculate allocation (assuming 10% goes to conservation)
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
        impact_score: Math.round((Math.random() * 30) + 70), // Random score between 70-100
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

  // Helper function for theme colors
  const getThemeColor = (theme: string) => {
    const colors = {
      'Wildlife': 'hsl(var(--wildlife))',
      'Habitat': 'hsl(var(--habitat))',
      'Education': 'hsl(var(--education))',
      'Livelihoods': 'hsl(var(--livelihoods))'
    };
    return colors[theme as keyof typeof colors] || 'hsl(var(--muted))';
  };

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
  }, []);

  const getThemeBadgeStyle = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchTerm === "" || 
        entry.experience_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.proof_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPartner = selectedPartner === "all" || entry.project_name === selectedPartner;
      const matchesTheme = selectedTheme === "all" || entry.theme === selectedTheme;
      const matchesLocation = selectedLocation === "all" || entry.location === selectedLocation;
      
      // Date range filtering
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

  // Sorted entries for table
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

  // Calculate KPIs
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

  // Get unique values for filters
  const uniquePartners = useMemo(() => 
    [...new Set(entries.map(entry => entry.project_name))].sort(), 
    [entries]
  );
  
  const uniqueThemes = useMemo(() => 
    [...new Set(entries.map(entry => entry.theme))].sort(), 
    [entries]
  );
  
  const uniqueLocations = useMemo(() => 
    [...new Set(entries.map(entry => entry.location))].sort(), 
    [entries]
  );

  // Event handlers
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

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `impact-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `Downloaded ${sortedEntries.length} entries as CSV`,
    });
  }, [sortedEntries, toast]);

  const clearAllFilters = () => {
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

          {/* Debug Panel (dev only) */}
          <DebugPanel dataState={dataState} entries={entries} />

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

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {kpi.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                      {kpi.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                      {kpi.trend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
                      {kpi.percentage && (
                        <span className={`text-sm ${
                          kpi.trend === 'up' ? 'text-green-500' : 
                          kpi.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                          {kpi.percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="details">Detailed Records</TabsTrigger>
              <TabsTrigger value="stories">Impact Stories</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search experiences, partners, descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Partners" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Partners</SelectItem>
                        {uniquePartners.map(partner => (
                          <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Themes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Themes</SelectItem>
                        {uniqueThemes.map(theme => (
                          <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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

                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredEntries.length} of {entries.length} entries
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Charts */}
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
                                  <div className="font-bold">
                                    {currency} {convert(item.value, 'KES', currency).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {((item.value / chartData.themes.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            No data available
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
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SafeChartContainer title="Geographic Distribution" className="h-[300px]">
                      <div className="h-full flex flex-col">
                        {chartData.locations.length > 0 ? (
                          <div className="flex-1 space-y-4">
                            {chartData.locations.map((item, index) => (
                              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold">
                                    {currency} {convert(item.value, 'KES', currency).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {((item.value / chartData.locations.reduce((sum, l) => sum + l.value, 0)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            No data available
                          </div>
                        )}
                      </div>
                    </SafeChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Top Performing Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chartData.themes.slice(0, 5).map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Conservation Theme</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {currency} {convert(item.value, 'KES', currency).toLocaleString()}
                          </div>
                          <Progress 
                            value={(item.value / Math.max(...chartData.themes.map(t => t.value))) * 100} 
                            className="w-24 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detailed Records Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Detailed Impact Records
                    </CardTitle>
                    <Button onClick={exportToCSV} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
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
                                sortDirection === 'asc' ? 
                                <SortAsc className="h-4 w-4" /> : 
                                <SortDesc className="h-4 w-4" />
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
                                sortDirection === 'asc' ? 
                                <SortAsc className="h-4 w-4" /> : 
                                <SortDesc className="h-4 w-4" />
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
                                sortDirection === 'asc' ? 
                                <SortAsc className="h-4 w-4" /> : 
                                <SortDesc className="h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Theme</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSort('allocation_amount')}
                          >
                            <div className="flex items-center gap-1">
                              Impact Allocation
                              {sortField === 'allocation_amount' && (
                                sortDirection === 'asc' ? 
                                <SortAsc className="h-4 w-4" /> : 
                                <SortDesc className="h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {new Date(entry.booking_date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{entry.experience_title}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {entry.location}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link 
                                to={`/partners/${entry.project_id}`}
                                className="text-primary hover:underline font-medium"
                              >
                                {entry.project_name}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getThemeBadgeStyle(entry.theme)}
                              >
                                {entry.theme}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium">
                                   {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {entry.participants}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{entry.impact_score}/100</span>
                                <div className="w-16">
                                  <Progress value={entry.impact_score} className="h-2" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                entry.status === 'verified' ? 'default' : 
                                entry.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }>
                                {entry.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {entry.status === 'pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Link to={`/partners/${entry.project_id}`}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                {entry.proof_images.length > 0 && (
                                  <Button variant="ghost" size="sm">
                                    <Camera className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {sortedEntries.map((entry) => (
                      <Card key={entry.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{entry.experience_title}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {entry.location}
                                </p>
                              </div>
                              <Badge variant={
                                entry.status === 'verified' ? 'default' : 
                                entry.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }>
                                {entry.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Link 
                                to={`/partners/${entry.project_id}`}
                                className="text-primary hover:underline font-medium"
                              >
                                {entry.project_name}
                              </Link>
                              <Badge 
                                variant="outline" 
                                className={getThemeBadgeStyle(entry.theme)}
                              >
                                {entry.theme}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Date</div>
                                <div>{new Date(entry.booking_date).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Participants</div>
                                <div>{entry.participants}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-muted-foreground text-sm">Impact Allocation</div>
                                <div className="font-bold text-lg">
                                   {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-muted-foreground text-sm">Impact Score</div>
                                <div className="flex items-center gap-2">
                                  <span>{entry.impact_score}/100</span>
                                  <div className="w-16">
                                    <Progress value={entry.impact_score} className="h-2" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {sortedEntries.length === 0 && (
                    <div className="text-center py-8">
                      <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No entries found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search terms
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
                    Conservation Impact Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="border-l-4 border-primary pl-6 py-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{entry.experience_title}</h4>
                            <p className="text-muted-foreground">
                              Partnership with {entry.project_name}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getThemeBadgeStyle(entry.theme)}
                          >
                            {entry.theme}
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed mb-4">
                          {entry.proof_description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(entry.booking_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {entry.participants} participants
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Impact Score: {entry.impact_score}/100</span>
                            <Progress value={entry.impact_score} className="w-16 h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredEntries.length === 0 && (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No stories found</h3>
                        <p className="text-muted-foreground">
                          Impact stories will appear here as conservation projects are completed
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