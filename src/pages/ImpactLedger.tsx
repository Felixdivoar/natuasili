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
import { useIsMobile } from "@/hooks/use-mobile";
import MetaTags from "@/components/MetaTags";
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
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { EXPERIENCES } from "@/data/partners";
import { useGlobalImpactMetrics } from "@/hooks/useGlobalImpactMetrics";

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
    case "Conservation education": return "hsl(217 91% 60%)";     // Rich blue
    case "Wildlife conservation": return "hsl(142 76% 36%)";     // Forest green  
    case "Community and Cultural exploration": return "hsl(346 87% 43%)"; // Vibrant red
    default: return "hsl(262 83% 58%)";                          // Electric purple
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

// Custom hooks for real-time chart data
const useRealTimeThemeData = () => {
  const [themeData, setThemeData] = useState<Array<{name: string, value: number, fill: string}>>([]);
  const [loading, setLoading] = useState(true);
  const { convert } = useCurrency();

  const fetchThemeData = async () => {
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          total_kes,
          donation_kes,
          experiences!inner (
            themes
          )
        `)
        .in('status', ['confirmed', 'completed']);

      if (error) throw error;

      const themeMap = new Map<string, number>();
      
      // If no live data, use mock data for demonstration
      if (!bookingsData || bookingsData.length === 0) {
        // Generate mock theme data
        const mockThemes = {
          'Wildlife conservation': 47500,
          'Conservation education': 32500,
          'Community and Cultural exploration': 18550
        };
        
        Object.entries(mockThemes).forEach(([theme, amount]) => {
          themeMap.set(theme, amount);
        });
      } else {
        bookingsData.forEach((booking: any) => {
          const conservationAmount = (booking.total_kes - booking.donation_kes) * 0.9 + booking.donation_kes;
          const themes = booking.experiences?.themes || [];
          
          if (Array.isArray(themes)) {
            themes.forEach((theme: string) => {
              const currentAmount = themeMap.get(theme) || 0;
              themeMap.set(theme, currentAmount + conservationAmount);
            });
          }
        });
      }

      const themeColors = {
        'Wildlife Conservation': '#16a34a',
        'Wildlife conservation': '#16a34a',     // Handle lowercase
        'Conservation Education': '#2563eb',
        'Conservation education': '#2563eb',    // Handle lowercase  
        'Community & Cultural Exploration': '#dc2626',
        'Community and Cultural exploration': '#dc2626', // Handle lowercase
        'Environmental Protection': '#059669',
        'Sustainable Tourism': '#7c3aed',
        'Habitat Protection': '#ea580c',
        'Research & Monitoring': '#c026d3',
        'Community Development': '#0891b2',
        'Wildlife Protection': '#15803d',
        'Cultural Heritage': '#be123c',
        'Marine Conservation': '#0e7490',
        'Forest Conservation': '#166534',
        'Community Empowerment': '#b45309',
        'Education & Awareness': '#1d4ed8',
        'Climate Action': '#7c2d12'
      };

      const chartData = Array.from(themeMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value),
        fill: themeColors[name as keyof typeof themeColors] || '#6b7280'
      })).sort((a, b) => b.value - a.value);

      setThemeData(chartData);
    } catch (error) {
      console.error('Error fetching theme data:', error);
      // Fallback to mock data on error
      const mockThemes = {
        'Wildlife conservation': 47500,
        'Conservation education': 32500,
        'Community and Cultural exploration': 18550
      };
      
      const themeColors = {
        'Wildlife conservation': '#16a34a',
        'Conservation education': '#2563eb',
        'Community and Cultural exploration': '#dc2626'
      };
      
      const chartData = Object.entries(mockThemes).map(([name, value]) => ({
        name,
        value,
        fill: themeColors[name as keyof typeof themeColors] || '#6b7280'
      }));
      
      setThemeData(chartData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeData();

    // Set up real-time subscription
    const channel = supabase
      .channel('theme-data-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        fetchThemeData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { themeData, loading };
};

const useRealTimeGeographicData = () => {
  const [geoData, setGeoData] = useState<Array<{name: string, value: number, fill: string}>>([]);
  const [loading, setLoading] = useState(true);

  const fetchGeographicData = async () => {
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          total_kes,
          donation_kes,
          experiences!inner (
            location_text
          )
        `)
        .in('status', ['confirmed', 'completed']);

      if (error) throw error;

      const locationMap = new Map<string, number>();
      
      // If no live data, use mock data for demonstration
      if (!bookingsData || bookingsData.length === 0) {
        const mockLocations = {
          'Maasai Mara': 27500,
          'Amboseli': 15000,
          'Ol Pejeta': 11200,
          'Northern Kenya': 9800,
          'Kakamega': 8750,
          'Watamu': 9200,
          'Diani': 7800,
          'Nairobi': 6500
        };
        
        Object.entries(mockLocations).forEach(([location, amount]) => {
          locationMap.set(location, amount);
        });
      } else {
        bookingsData.forEach((booking: any) => {
          const conservationAmount = (booking.total_kes - booking.donation_kes) * 0.9 + booking.donation_kes;
          const location = booking.experiences?.location_text || 'Unknown';
          
          const currentAmount = locationMap.get(location) || 0;
          locationMap.set(location, currentAmount + conservationAmount);
        });
      }

      const locationColors = [
        '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#10b981'
      ];

      const chartData = Array.from(locationMap.entries()).map(([name, value], index) => ({
        name,
        value: Math.round(value),
        fill: locationColors[index % locationColors.length]
      })).sort((a, b) => b.value - a.value);

      setGeoData(chartData);
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      // Fallback to mock data on error
      const mockLocations = {
        'Maasai Mara': 27500,
        'Amboseli': 15000,
        'Ol Pejeta': 11200,
        'Northern Kenya': 9800
      };
      
      const locationColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
      
      const chartData = Object.entries(mockLocations).map(([name, value], index) => ({
        name,
        value,
        fill: locationColors[index]
      }));
      
      setGeoData(chartData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeographicData();

    // Set up real-time subscription
    const channel = supabase
      .channel('geo-data-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public', 
        table: 'bookings'
      }, () => {
        fetchGeographicData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { geoData, loading };
};
const getImpactLedgerData = async (source: 'live' | 'mock' = 'live'): Promise<ImpactEntry[]> => {
  if (source === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate comprehensive mock data for demonstration
    const mockEntries: ImpactEntry[] = [
      {
        id: "mock-1",
        booking_date: "2024-12-15",
        experience_title: "Maasai Mara Wildlife Conservation Safari",
        project_name: "Mara Wildlife Conservancy",
        project_id: "mara-conservancy",
        theme: "Wildlife conservation",
        allocation_amount: 12500,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Contributed to wildlife monitoring and anti-poaching efforts in the Maasai Mara ecosystem. Funds support ranger patrols and community engagement programs.",
        verified_date: "2024-12-16",
        participants: 6,
        impact_score: 92,
        location: "Maasai Mara"
      },
      {
        id: "mock-2",
        booking_date: "2024-12-10",
        experience_title: "Community-Led Forest Conservation",
        project_name: "Kakamega Forest Initiative",
        project_id: "kakamega-forest",
        theme: "Community and Cultural exploration",
        allocation_amount: 8750,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Supporting local communities in forest conservation efforts. Your contribution helps fund tree planting and sustainable livelihood programs.",
        verified_date: "2024-12-11",
        participants: 4,
        impact_score: 88,
        location: "Kakamega"
      },
      {
        id: "mock-3",
        booking_date: "2024-12-08",
        experience_title: "Marine Conservation Education Program",
        project_name: "Watamu Marine Association",
        project_id: "watamu-marine",
        theme: "Conservation education",
        allocation_amount: 9200,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Educational program focused on marine ecosystem protection. Funds support turtle conservation and community awareness initiatives.",
        verified_date: "2024-12-09",
        participants: 8,
        impact_score: 85,
        location: "Watamu"
      },
      {
        id: "mock-4",
        booking_date: "2024-12-05",
        experience_title: "Elephant Conservation Research",
        project_name: "Amboseli Trust for Elephants",
        project_id: "amboseli-elephants",
        theme: "Wildlife conservation",
        allocation_amount: 15000,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Supporting long-term elephant research and conservation. Funds contribute to tracking collars and community coexistence programs.",
        verified_date: "2024-12-06",
        participants: 3,
        impact_score: 95,
        location: "Amboseli"
      },
      {
        id: "mock-5",
        booking_date: "2024-12-01",
        experience_title: "Conservation Education Workshop",
        project_name: "Kenya Wildlife Service",
        project_id: "kws-education",
        theme: "Conservation education",
        allocation_amount: 6500,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Educational workshop for schools in conservation awareness. Your contribution helps develop educational materials and training programs.",
        verified_date: "2024-12-02",
        participants: 12,
        impact_score: 78,
        location: "Nairobi"
      },
      {
        id: "mock-6",
        booking_date: "2024-11-28",
        experience_title: "Rhino Sanctuary Visit",
        project_name: "Ol Pejeta Conservancy",
        project_id: "ol-pejeta",
        theme: "Wildlife conservation",
        allocation_amount: 11200,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Direct support to rhino conservation efforts. Funds help maintain sanctuary facilities and anti-poaching operations.",
        verified_date: "2024-11-29",
        participants: 5,
        impact_score: 90,
        location: "Ol Pejeta"
      },
      {
        id: "mock-7",
        booking_date: "2024-11-25",
        experience_title: "Community Wildlife Guardians",
        project_name: "Northern Kenya Conservancies",
        project_id: "northern-kenya",
        theme: "Community and Cultural exploration",
        allocation_amount: 9800,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Empowering local communities as wildlife guardians. Your contribution supports training and equipment for community conservancies.",
        verified_date: "2024-11-26",
        participants: 7,
        impact_score: 87,
        location: "Northern Kenya"
      },
      {
        id: "mock-8",
        booking_date: "2024-11-20",
        experience_title: "Coastal Conservation Initiative",
        project_name: "Diani Beach Conservation",
        project_id: "diani-conservation",
        theme: "Conservation education",
        allocation_amount: 7800,
        currency: "KES",
        status: "verified",
        proof_images: [],
        proof_description: "Protecting coastal ecosystems and promoting sustainable tourism. Funds support beach clean-ups and educational programs.",
        verified_date: "2024-11-21",
        participants: 9,
        impact_score: 82,
        location: "Diani"
      }
    ];
    
    return mockEntries;
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
        donation_kes,
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
        ),
        impact_proofs (
          id,
          url,
          caption,
          status
        )
      `)
      .in('status', ['confirmed','completed'])
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
      
      const allocationAmount = Math.round(((booking.total_kes || 0) - (booking.donation_kes || 0)) * 0.1);
      const impactProofs = booking.impact_proofs || [];
      
      return {
        id: booking.id,
        booking_date: booking.booking_date,
        experience_title: experience?.title || 'Unknown Experience',
        project_name: partner?.org_name || 'Unknown Partner',
        project_id: partner?.slug || partner?.id || 'unknown',
        theme: primaryTheme,
        allocation_amount: allocationAmount,
        currency: 'KES',
        status: 'verified', // Only approved proofs are included
        proof_images: impactProofs.map((proof: any) => proof.url),
        proof_description: impactProofs.map((proof: any) => proof.caption).filter(Boolean).join(' ') ||
          `Conservation allocation from ${experience?.title || 'experience'} booking. Funds support ${partner?.org_name || 'conservation'} activities.`,
        verified_date: booking.booking_date,
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
  // Use global impact metrics hook for real-time updates
  const globalMetrics = useGlobalImpactMetrics();
  
  // Real-time chart data hooks
  const { themeData, loading: themeLoading } = useRealTimeThemeData();
  const { geoData, loading: geoLoading } = useRealTimeGeographicData();
  
  // Mobile detection
  const isMobile = useIsMobile();
  
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

  // Load data on component mount with real-time updates
  useEffect(() => {
    const loadData = async () => {
      setDataState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        let data: ImpactEntry[] = [];
        let source: 'live' | 'mock' = 'live';
        
        try {
          data = await getImpactLedgerData('live');
          
          // If live data is empty or very minimal, use mock data for better demonstration
          if (!data || data.length === 0) {
            console.log('No live bookings found, using mock data for demonstration');
            data = await getImpactLedgerData('mock');
            source = 'mock';
          }
        } catch (error) {
          console.warn('Live data failed, falling back to mock:', error);
          data = await getImpactLedgerData('mock');
          source = 'mock';
        }
        
        setEntries(data);
        setDataState({
          source,
          isLoading: false,
          error: source === 'mock' ? 'Showing demo data - no live bookings yet' : null,
          lastFetch: new Date()
        });
        
      } catch (error) {
        console.error('Failed to load impact data:', error);
        // Ensure we always have some data to show
        const fallbackData = await getImpactLedgerData('mock');
        setEntries(fallbackData);
        setDataState({
          source: 'mock',
          isLoading: false,
          error: 'Using demo data due to connection issues',
          lastFetch: new Date()
        });
      }
    };

    loadData();

    // Set up real-time subscriptions for impact proofs and bookings
    const impactProofChannel = supabase
      .channel('impact-ledger-proofs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'impact_proofs'
        },
        (payload) => {
          console.log('Impact proof change detected:', payload);
          if ((payload.new as any)?.status === 'approved' || (payload.old as any)?.status === 'approved') {
            loadData(); // Refetch when proofs are approved/unapproved
          }
        }
      )
      .subscribe();

    const bookingChannel = supabase
      .channel('impact-ledger-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change detected for ledger:', payload);
          loadData(); // Refetch when bookings change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(impactProofChannel);
      supabase.removeChannel(bookingChannel);
    };
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
    // Use live global metrics if available, fallback to calculated values
    const totalBookings = filteredEntries.length;
    const calculatedTotalAllocated = filteredEntries.reduce((sum, entry) => sum + entry.allocation_amount, 0);
    const uniquePartners = new Set(filteredEntries.map(entry => entry.project_name)).size;
    const averageAllocation = calculatedTotalAllocated / Math.max(totalBookings, 1);
    const averageImpactScore = filteredEntries.reduce((sum, entry) => sum + entry.impact_score, 0) / Math.max(totalBookings, 1);
    const calculatedParticipants = filteredEntries.reduce((sum, entry) => sum + entry.participants, 0);

    // Use global metrics for live data when available
    const liveConservationFunding = globalMetrics.getTotalConservationFunding() || calculatedTotalAllocated;
    const liveActivePartners = globalMetrics.getActivePartners() || uniquePartners;
    const liveParticipants = globalMetrics.getTotalParticipants() || calculatedParticipants;
    const liveTotalExperiences = globalMetrics.getTotalExperiences() || totalBookings;

    return [
      {
        title: "Total Conservation Funding",
        value: `${currency} ${convert(liveConservationFunding, 'KES', currency).toLocaleString()}`,
        description: "Total funds allocated to conservation projects (live)",
        trend: "up",
        percentage: 15
      },
      {
        title: "Total Experiences", 
        value: liveTotalExperiences,
        description: "Active conservation experiences available (live)",
        trend: "up",
        percentage: 8
      },
      {
        title: "Active Partners",
        value: liveActivePartners,
        description: "Organizations delivering conservation experiences (live)",
        trend: "up", 
        percentage: 12
      },
      {
        title: "Total Participants",
        value: liveParticipants,
        description: "People engaged in conservation experiences (live)",
        trend: "up",
        percentage: 22
      },
      {
        title: "Average Allocation per Booking",
        value: `${currency} ${convert(averageAllocation, 'KES', currency).toLocaleString()}`,
        description: "Mean conservation funding per experience",
        trend: "up",
        percentage: 5
      },
      {
        title: "Average Impact Score",
        value: `${averageImpactScore.toFixed(1)}/100`,
        description: "Mean effectiveness rating of conservation projects",
        trend: "up",
        percentage: 3
      }
    ];
  }, [filteredEntries, currency, convert, globalMetrics]);

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
         <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <MetaTags 
        title="title_impact_ledger"
        description="meta_impact_ledger"
        keywords="conservation impact tracking, Kenya wildlife funding, transparent tourism, conservation metrics, impact dashboard, sustainable travel accountability"
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Impact Ledger</h1>
            <p className="text-muted-foreground">
              Transparent tracking of conservation impact from every booking
            </p>
          </div>

          {/* Data Source Banner */}
          {dataState.error && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {dataState.error}. {dataState.source === 'mock' ? 
                  'Real impact data will appear here once conservation experiences are booked!' : 
                  'Showing cached data.'
                }
                <Button 
                  variant="link" 
                  className="p-0 ml-2 text-blue-600 hover:text-blue-800"
                  onClick={retryDataFetch}
                >
                  Refresh
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 h-auto gap-1' : 'grid-cols-3'}`}>
              <TabsTrigger value="dashboard" className={isMobile ? 'justify-start' : ''}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="entries" className={isMobile ? 'justify-start' : ''}>
                <Filter className="h-4 w-4 mr-2" />
                Entries
              </TabsTrigger>
              <TabsTrigger value="stories" className={isMobile ? 'justify-start' : ''}>
                <Heart className="h-4 w-4 mr-2" />
                {isMobile ? 'Stories' : 'Impact Stories'}
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 sm:space-y-8">
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
                           {kpi.trend === "up" && <ArrowUpRight className="h-4 w-4 text-success" />}
                           {kpi.trend === "down" && <ArrowDownRight className="h-4 w-4 text-destructive" />}
                           {kpi.trend === "neutral" && <Minus className="h-4 w-4 text-muted-foreground" />}
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

              {/* Impact by Theme Section - Full Width */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      Impact by Theme
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {themeLoading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                      <Badge variant="secondary" className="font-medium">
                        {themeLoading ? "Loading..." : `${themeData.length} Themes`}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Conservation impact distribution across different focus areas
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <SafeChartContainer title="Impact by Theme" className="min-h-[300px] sm:min-h-[400px]">
                    {themeLoading ? (
                      <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px]">
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Loading real-time theme data...</p>
                        </div>
                      </div>
                    ) : themeData.length === 0 ? (
                      <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px]">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No theme data available</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6 xl:gap-8">
                        {/* Chart - Full width on mobile, 2/3 width on large screens */}
                        <div className="order-1 xl:order-1 xl:col-span-2 space-y-4">
                          <div className="bg-background/50 rounded-lg p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Theme Impact Distribution
                            </h3>
                            <div className="h-[280px] sm:h-[350px] xl:h-96 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <defs>
                                    {themeData.map((entry, index) => (
                                      <linearGradient key={`themeGradient-${index}`} id={`themeGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9}/>
                                        <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6}/>
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                    data={themeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="25%"
                                    outerRadius="75%"
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => {
                                      // Only show labels on larger screens and for significant segments
                                      if (typeof window !== 'undefined' && window.innerWidth < 640) return '';
                                      return percent > 0.05 ? `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%` : '';
                                    }}
                                    labelLine={false}
                                    fill="url(#themeGradient-0)"
                                  >
                                    {themeData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={`url(#themeGradient-${index})`} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    formatter={(value: number) => [`${currency} ${convert(value, 'KES', currency).toLocaleString()}`, 'Conservation Impact']}
                                    labelStyle={{ 
                                      color: 'hsl(var(--foreground))',
                                      fontWeight: 600,
                                      marginBottom: '4px'
                                    }}
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--background))', 
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px',
                                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                      padding: '8px 12px',
                                      fontSize: '14px'
                                    }}
                                  />
                                  <Legend 
                                    wrapperStyle={{ fontSize: '12px' }}
                                    iconType="circle"
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                        
                        {/* Summary Statistics - Takes 1/3 width on desktop, full width on mobile */}
                        <div className="order-2 xl:order-2 space-y-4 xl:space-y-6">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Theme Breakdown
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                              {themeData.slice(0, 6).map((theme, index) => {
                                const total = themeData.reduce((sum, t) => sum + t.value, 0);
                                const percentage = total > 0 ? (theme.value / total) * 100 : 0;
                                
                                return (
                                  <div key={theme.name} className="group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                        <div 
                                          className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                                          style={{ backgroundColor: theme.fill }}
                                        />
                                        <span className="font-medium text-xs sm:text-sm truncate" title={theme.name}>
                                          {theme.name}
                                        </span>
                                      </div>
                                      <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">
                                        {percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 bg-muted rounded-full h-2 mr-3">
                                        <div 
                                          className="h-2 rounded-full transition-all duration-500"
                                          style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: theme.fill
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs sm:text-sm font-bold flex-shrink-0">
                                        {currency} {convert(theme.value, 'KES', currency).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Quick Stats */}
                          <div className="bg-muted/30 rounded-xl p-3 sm:p-4 space-y-3">
                            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                              Quick Stats
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Total Themes</span>
                                <span className="font-semibold text-sm">{themeData.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Highest Impact</span>
                                <span className="font-semibold text-xs sm:text-sm">
                                  {themeData[0] ? `${currency} ${convert(themeData[0].value, 'KES', currency).toLocaleString()}` : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Leading Theme</span>
                                <span className="font-semibold text-xs truncate max-w-[120px] sm:max-w-[140px]" title={themeData[0]?.name}>
                                  {themeData[0]?.name || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </SafeChartContainer>
                </CardContent>
              </Card>

              {/* Geographic Distribution Section - Full Width */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      Geographic Distribution
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {geoLoading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                      <Badge variant="secondary" className="font-medium">
                        {geoLoading ? "Loading..." : `${geoData.length} Locations`}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Conservation impact across different geographic regions
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <SafeChartContainer title="Geographic Distribution" className="min-h-[300px] sm:min-h-[400px]">
                    {geoLoading ? (
                      <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px]">
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Loading real-time location data...</p>
                        </div>
                      </div>
                    ) : geoData.length === 0 ? (
                      <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px]">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No geographic data available</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6 xl:gap-8">
                        {/* Chart - Full width on mobile, 2/3 width on large screens */}
                        <div className="order-1 xl:order-1 xl:col-span-2 space-y-4">
                          <div className="bg-background/50 rounded-lg p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Regional Impact Map
                            </h3>
                            <div className="h-[280px] sm:h-[350px] xl:h-96 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <defs>
                                    {geoData.map((entry, index) => (
                                      <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9}/>
                                        <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6}/>
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                    data={geoData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="25%"
                                    outerRadius="75%"
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => {
                                      // Only show labels on larger screens and for significant segments
                                      if (typeof window !== 'undefined' && window.innerWidth < 640) return '';
                                      return percent > 0.05 ? `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%` : '';
                                    }}
                                    labelLine={false}
                                    fill="url(#pieGradient-0)"
                                  >
                                    {geoData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    formatter={(value: number) => [`${currency} ${convert(value, 'KES', currency).toLocaleString()}`, 'Conservation Impact']}
                                    labelStyle={{ 
                                      color: 'hsl(var(--foreground))',
                                      fontWeight: 600,
                                      marginBottom: '4px'
                                    }}
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--background))', 
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px',
                                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                      padding: '8px 12px',
                                      fontSize: '14px'
                                    }}
                                  />
                                  <Legend 
                                    wrapperStyle={{ fontSize: '12px' }}
                                    iconType="circle"
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                        
                        {/* Summary Statistics - Full width on mobile, 1/3 width on desktop */}
                        <div className="order-2 xl:order-2 space-y-4 xl:space-y-6">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Location Breakdown
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 max-h-72 overflow-y-auto">
                              {geoData.map((location, index) => {
                                const total = geoData.reduce((sum, l) => sum + l.value, 0);
                                const percentage = total > 0 ? (location.value / total) * 100 : 0;
                                
                                return (
                                  <div key={location.name} className="group hover:bg-muted/50 p-3 rounded-lg transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                        <div 
                                          className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                                          style={{ backgroundColor: location.fill }}
                                        />
                                        <span className="font-medium text-xs sm:text-sm truncate" title={location.name}>
                                          {location.name}
                                        </span>
                                      </div>
                                      <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">
                                        {percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 bg-muted rounded-full h-2 mr-3">
                                        <div 
                                          className="h-2 rounded-full transition-all duration-500"
                                          style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: location.fill
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs sm:text-sm font-bold flex-shrink-0">
                                        {currency} {convert(location.value, 'KES', currency).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Quick Stats */}
                          <div className="bg-muted/30 rounded-xl p-3 sm:p-4 space-y-3">
                            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                              Quick Stats
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Total Locations</span>
                                <span className="font-semibold text-sm">{geoData.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Highest Impact</span>
                                <span className="font-semibold text-xs sm:text-sm">
                                  {geoData[0] ? `${currency} ${convert(geoData[0].value, 'KES', currency).toLocaleString()}` : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm">Top Location</span>
                                <span className="font-semibold text-xs truncate max-w-[120px] sm:max-w-[140px]" title={geoData[0]?.name}>
                                  {geoData[0]?.name || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </SafeChartContainer>
                </CardContent>
              </Card>
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
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isMobile ? "Search..." : "Search experiences, partners..."}
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
                  
                  {isMobile ? (
                    <div className="space-y-3">
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
                          size="sm"
                        >
                          Clear All
                        </Button>
                        <Button
                          variant="outline"
                          onClick={exportToCSV}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        Showing {filteredEntries.length} of {entries.length} entries
                      </div>
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>

              {/* Entries Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Impact Entries
                  </CardTitle>
                  {isMobile && (
                    <p className="text-sm text-muted-foreground">
                      Swipe horizontally to see all columns
                    </p>
                  )}
                </CardHeader>
                <CardContent className={isMobile ? 'p-0' : ''}>
                  {isMobile ? (
                    // Mobile card layout
                    <div className="space-y-4 p-4">
                      {sortedEntries.map((entry) => (
                        <Card key={entry.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">{entry.experience_title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(entry.booking_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${getThemeBadgeStyle(entry.theme)} text-xs`}
                            >
                              {mapLegacyTheme(entry.theme)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Partner</p>
                              <Link 
                                to="/browse"
                                className="text-primary hover:underline text-xs truncate block"
                              >
                                {entry.project_name}
                              </Link>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="text-xs">{entry.location}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Allocation</p>
                              <p className="font-medium text-xs">
                                {currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Impact</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">{entry.impact_score}/100</span>
                                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary"
                                    style={{ width: `${entry.impact_score}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Badge variant={entry.status === 'verified' ? 'default' : 'secondary'} className="text-xs">
                                {entry.status === 'verified' ? (
                                  <>
                                    <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                                    Pending
                                  </>
                                )}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {entry.participants} participants
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    // Desktop table layout
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50 min-w-[100px]"
                              onClick={() => handleSort('booking_date')}
                            >
                              <div className="flex items-center gap-2">
                                Date
                                {sortField === 'booking_date' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="min-w-[200px]">Experience</TableHead>
                            <TableHead className="min-w-[150px]">Partner</TableHead>
                            <TableHead className="min-w-[120px]">Theme</TableHead>
                            <TableHead className="min-w-[100px]">Location</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                              onClick={() => handleSort('allocation_amount')}
                            >
                              <div className="flex items-center gap-2">
                                Allocation
                                {sortField === 'allocation_amount' && (
                                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="min-w-[100px]">Participants</TableHead>
                            <TableHead className="min-w-[120px]">Impact Score</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedEntries.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {new Date(entry.booking_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="truncate" title={entry.experience_title}>
                                  {entry.experience_title}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Link 
                                  to="/browse"
                                  className="text-primary hover:underline"
                                >
                                  <div className="truncate" title={entry.project_name}>
                                    {entry.project_name}
                                  </div>
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
                                <div className="truncate" title={entry.location}>
                                  {entry.location}
                                </div>
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
                  )}
                  
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
            <TabsContent value="stories" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Impact Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`space-y-4 ${isMobile ? 'sm:space-y-6' : 'space-y-6'}`}>
                    {filteredEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className={`border-l-4 border-primary ${isMobile ? 'pl-3 py-3' : 'pl-6 py-4'}`}>
                        <div className={`${isMobile ? 'space-y-3' : 'flex items-start justify-between mb-3'}`}>
                          <div className={isMobile ? '' : 'flex-1 mr-4'}>
                            <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} line-clamp-2`}>{entry.experience_title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {entry.project_name} • {new Date(entry.booking_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getThemeBadgeStyle(entry.theme)} ${isMobile ? 'w-fit' : ''}`}
                          >
                            {mapLegacyTheme(entry.theme)}
                          </Badge>
                        </div>
                        
                        <p className={`text-muted-foreground ${isMobile ? 'mb-3 text-sm' : 'mb-4'}`}>
                          {entry.proof_description}
                        </p>
                        
                        <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                          <div className={`${isMobile ? 'grid grid-cols-1 gap-2' : 'flex items-center gap-4'} text-sm text-muted-foreground`}>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 flex-shrink-0" />
                              <span>{currency} {convert(entry.allocation_amount, 'KES', currency).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 flex-shrink-0" />
                              <span>{entry.participants} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 flex-shrink-0" />
                              <span>{entry.impact_score}/100 impact</span>
                            </div>
                          </div>
                          
                          <Link 
                            to="/browse"
                            className={`text-primary hover:underline text-sm ${isMobile ? 'block text-center' : ''}`}
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