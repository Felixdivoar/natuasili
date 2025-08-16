import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, ExternalLink, Calendar, DollarSign, MapPin, Camera, Download, TrendingUp, BarChart3, Users, TreePine, Heart } from "lucide-react";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const ImpactLedger = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const { formatPrice } = useCurrency();

  // Analytics data
  const themeData = [
    { name: 'Wildlife', value: 45, color: 'hsl(var(--wildlife))' },
    { name: 'Habitat', value: 30, color: 'hsl(var(--habitat))' },
    { name: 'Education', value: 15, color: 'hsl(var(--education))' },
    { name: 'Livelihoods', value: 10, color: 'hsl(var(--livelihoods))' }
  ];

  const geographicData = [
    { region: 'Maasai Mara', projects: 12, funding: 250000 },
    { region: 'Laikipia', projects: 8, funding: 180000 },
    { region: 'Samburu', projects: 6, funding: 120000 },
    { region: 'Coast', projects: 10, funding: 200000 },
    { region: 'Nairobi', projects: 5, funding: 90000 }
  ];

  const monthlyImpact = [
    { month: 'Jan', wildlife: 12, habitat: 8, education: 5, livelihoods: 3 },
    { month: 'Feb', wildlife: 15, habitat: 10, education: 6, livelihoods: 4 },
    { month: 'Mar', wildlife: 18, habitat: 12, education: 8, livelihoods: 5 },
    { month: 'Apr', wildlife: 22, habitat: 15, education: 10, livelihoods: 6 },
    { month: 'May', wildlife: 25, habitat: 18, education: 12, livelihoods: 8 },
    { month: 'Jun', wildlife: 28, habitat: 20, education: 15, livelihoods: 10 }
  ];

  const forecastData = [
    {
      year: '2024',
      projectedFunding: 2500000,
      projectsLaunched: 85,
      communitiesImpacted: 45,
      wildlifeProtected: 15000,
      habitatRestored: 2800,
      confidence: 'High'
    },
    {
      year: '2025', 
      projectedFunding: 3200000,
      projectsLaunched: 110,
      communitiesImpacted: 60,
      wildlifeProtected: 20000,
      habitatRestored: 3500,
      confidence: 'Medium'
    },
    {
      year: '2026',
      projectedFunding: 4100000,
      projectsLaunched: 140,
      communitiesImpacted: 78,
      wildlifeProtected: 26000,
      habitatRestored: 4200,
      confidence: 'Medium'
    }
  ];

  const generateReport = (type: string) => {
    if (type === 'monthly') {
      const reportContent = `
NATUASILI MONTHLY IMPACT REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
This month, NatuAsili facilitated 156 conservation experiences across Kenya, directly supporting 12 community-led conservation projects and generating ${formatPrice(89500)} in conservation funding.

KEY ACHIEVEMENTS
• Wildlife Protection: 2,450 animals monitored and protected
• Habitat Restoration: 340 hectares of forest and marine habitat restored  
• Community Engagement: 1,200 local community members directly involved
• Education Impact: 890 participants gained conservation knowledge
• Economic Impact: ${formatPrice(67200)} distributed to local communities

PROJECT HIGHLIGHTS
1. Maasai Mara Wildlife Conservancy - 45 experiences completed
   - Big Five tracking contributed to 3 new lion pride documentations
   - ${formatPrice(15750)} generated for anti-poaching efforts

2. Ol Pejeta Conservancy - 32 experiences completed
   - Northern white rhino conservation program supported
   - K-9 anti-poaching unit training expanded

3. Coastal Forest Restoration - 28 experiences completed
   - 450 mangrove seedlings planted by volunteers
   - 15 hectares of coastal habitat protected

CONSERVATION METRICS
• Species Monitoring: 15 endangered species actively monitored
• Anti-Poaching: 24/7 ranger patrols across 8,500 hectares
• Research Impact: 12 scientific papers supported with field data
• Technology Integration: GPS collaring, camera traps, drone surveys

COMMUNITY IMPACT
• Direct Employment: 89 local guides and rangers employed
• Skill Development: 156 community members trained in conservation techniques
• Women's Participation: 42% of program participants were women
• Youth Engagement: 234 young people involved in conservation education

FINANCIAL TRANSPARENCY
Total Revenue: ${formatPrice(89500)}
• Conservation Projects (85%): ${formatPrice(76075)}
• Platform Operations (10%): ${formatPrice(8950)}
• Marketing & Growth (5%): ${formatPrice(4475)}

ENVIRONMENTAL IMPACT
• Carbon Footprint: Net negative through forest restoration activities
• Waste Reduction: 2.3 tonnes of marine debris removed
• Water Conservation: 15,000 liters saved through efficiency programs
• Renewable Energy: 67% of partner facilities using solar power

CHALLENGES & OPPORTUNITIES
• Seasonal booking fluctuations affecting consistent funding
• Need for expanded ranger training programs
• Opportunity to scale successful models to new regions
• Technology upgrades required for better impact tracking

UPCOMING INITIATIVES
• Launch of youth conservation leadership program (July 2024)
• Expansion into Northern Kenya conservancies (August 2024)
• New marine conservation partnerships (September 2024)
• Mobile app launch for real-time impact tracking (October 2024)

TESTIMONIALS
"The rhino conservation experience at Ol Pejeta changed my perspective on wildlife protection. Seeing the technology and dedication firsthand was incredible." - Sarah M., Conservation Traveler

"Our community has benefited tremendously from the Samburu beadwork workshops. It's preserving our culture while providing sustainable income." - Mary L., Local Artisan

For detailed metrics and additional information, visit our impact dashboard at natuasili.com/impact
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NatuAsili_Monthly_Impact_Report_${new Date().getMonth() + 1}_${new Date().getFullYear()}.txt`;
      a.click();
    } else if (type === 'partner') {
      const reportContent = `
NATUASILI PARTNER PERFORMANCE REPORT
Generated: ${new Date().toLocaleDateString()}

PARTNER ECOSYSTEM OVERVIEW
NatuAsili currently supports 12 conservation partners across Kenya, from grassroots community organizations to established conservancies. This report analyzes partner performance across key impact areas.

TOP PERFORMING PARTNERS

1. OL PEJETA CONSERVANCY
   Performance Score: 96/100
   • Bookings Completed: 41 (Target: 35)
   • Revenue Generated: ${formatPrice(156000)}
   • Impact Metrics: Northern white rhino program, 2,400 hectares protected
   • Guest Satisfaction: 4.9/5.0
   • Innovation Score: Excellent (GPS tracking, drone monitoring)
   
2. MAASAI MARA WILDLIFE CONSERVANCY  
   Performance Score: 92/100
   • Bookings Completed: 45 (Target: 40)
   • Revenue Generated: ${formatPrice(125000)}
   • Impact Metrics: 15 lion prides monitored, anti-poaching expansion
   • Guest Satisfaction: 4.8/5.0
   • Community Integration: Excellent

3. MARA ELEPHANT PROJECT
   Performance Score: 89/100
   • Bookings Completed: 35 (Target: 30)
   • Revenue Generated: ${formatPrice(98000)}
   • Impact Metrics: 450 elephants monitored, human-wildlife conflict reduction
   • Research Contribution: High
   • Technology Adoption: Advanced GPS collaring

EMERGING PARTNERS

RETETI ELEPHANT ORPHANAGE
• Community Ownership Model: 100% community-owned
• Rehabilitation Success: 12 orphaned elephants successfully released
• Cultural Integration: Traditional Samburu practices incorporated
• Growth Potential: High - expanding rehabilitation capacity

GIRAFFE CENTRE
• Education Impact: 890 students reached monthly
• Breeding Program: 8 Rothschild giraffes born this year
• Urban Conservation: Leading Nairobi conservation education
• Visitor Engagement: Consistently high satisfaction scores

AREAS FOR IMPROVEMENT

COASTAL PARTNERS
• Seasonal Variations: Need year-round programming
• Marketing Support: Require enhanced digital presence  
• Capacity Building: Training needed for advanced booking systems
• Infrastructure: Basic facility upgrades recommended

COMMUNITY-BASED ORGANIZATIONS
• Financial Management: Training in bookkeeping and reporting
• Quality Standards: Standardization of experience delivery
• Safety Protocols: Enhanced safety training programs
• Technology Integration: Digital literacy development

PERFORMANCE METRICS BY CATEGORY

CONSERVATION IMPACT
• Wildlife Protection: 15,670 animals under active protection
• Habitat Restoration: 2,840 hectares restored or protected
• Research Support: 23 ongoing scientific studies
• Anti-Poaching: 156 rangers deployed across partner sites

COMMUNITY ENGAGEMENT  
• Direct Employment: 234 community members employed
• Skill Development: 456 people trained in new skills
• Women's Participation: 38% leadership positions held by women
• Youth Programs: 789 young people engaged

FINANCIAL PERFORMANCE
• Total Partner Revenue: ${formatPrice(892000)}
• Average Revenue Per Partner: ${formatPrice(74333)}
• Growth Rate: 23% year-over-year
• Payment Efficiency: 96% on-time payments

GUEST EXPERIENCE
• Overall Satisfaction: 4.7/5.0
• Repeat Bookings: 34% of guests book multiple experiences
• Referral Rate: 67% of guests refer others
• Safety Record: Zero major incidents reported

RECOMMENDATIONS

SHORT-TERM (1-3 months)
• Implement standardized safety protocols across all partners
• Launch partner training program for digital marketing
• Establish monthly partner check-in meetings
• Create shared resource library for best practices

MEDIUM-TERM (3-6 months)  
• Develop tiered partnership levels with performance incentives
• Launch partner exchange program for knowledge sharing
• Implement automated impact tracking systems
• Expand micro-financing options for infrastructure improvements

LONG-TERM (6-12 months)
• Establish NatuAsili Conservation Excellence Awards
• Create partner-led innovation grants program
• Develop regional partner clusters for coordination
• Launch international partnership expansion pilot

PARTNER TESTIMONIALS
"NatuAsili has transformed how we engage with conservation travelers. The platform gives us access to people who truly care about our mission." - Dr. Richard Vigne, Ol Pejeta Conservancy

"The support from NatuAsili goes beyond bookings - they're helping us build sustainable conservation enterprises." - Mary Lengees, Reteti Elephant Orphanage

Contact partnerships@natuasili.com for detailed partner-specific reports.
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NatuAsili_Partner_Performance_Report_${new Date().getFullYear()}.txt`;
      a.click();
    }
  };

  // Mock ledger data - in real app this would come from API
  const mockLedgerEntries = [
    {
      id: "1",
      booking_date: "2024-01-20",
      experience_title: "Big Five Wildlife Tracking Experience",
      project_name: "Maasai Mara Wildlife Conservancy",
      theme: "Wildlife",
      allocation_amount: 263,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg"],
      proof_description: "Successfully tracked 3 lion prides and 2 elephant herds. Collected GPS data for 15 individual animals contributing to migration pattern research. Installed 2 new camera traps in strategic locations.",
      verified_date: "2024-01-23"
    },
    {
      id: "2",
      booking_date: "2024-01-18",
      experience_title: "Traditional Beadwork Workshop",
      project_name: "Samburu Education Initiative",
      theme: "Education", 
      allocation_amount: 96,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      proof_description: "Conducted 2-hour workshop with 8 local women artisans. Created 15 traditional beadwork pieces. All workshop materials purchased from local suppliers, supporting 3 additional families.",
      verified_date: "2024-01-21"
    },
    {
      id: "3",
      booking_date: "2024-01-16",
      experience_title: "Mangrove Restoration Volunteer Day",
      project_name: "Coastal Forest Restoration",
      theme: "Habitat",
      allocation_amount: 60,
      currency: "USD", 
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg"],
      proof_description: "Planted 45 mangrove seedlings in degraded coastal area. Removed 2.3 tons of marine debris. Trained 6 community members in mangrove cultivation techniques.",
      verified_date: "2024-01-19"
    },
    {
      id: "4",
      booking_date: "2024-01-14",
      experience_title: "Community Solar Water Pump Installation",
      project_name: "Samburu Education Initiative",
      theme: "Livelihoods",
      allocation_amount: 184,
      currency: "USD",
      status: "verified", 
      proof_images: ["/placeholder.svg"],
      proof_description: "Installed solar-powered water pump serving 150 community members. Reduced daily water collection time from 4 hours to 30 minutes for local families. Trained 4 technicians for maintenance.",
      verified_date: "2024-01-17"
    },
    {
      id: "5",
      booking_date: "2024-01-12",
      experience_title: "Anti-Poaching Patrol Training",
      project_name: "Maasai Mara Wildlife Conservancy", 
      theme: "Wildlife",
      allocation_amount: 290,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      proof_description: "Trained 12 local rangers in advanced tracking and surveillance techniques. Equipped patrol team with GPS devices and camera traps. Covered 85km² area in joint patrol exercise.",
      verified_date: "2024-01-15"
    },
    {
      id: "6", 
      booking_date: "2024-01-10",
      experience_title: "Coral Reef Monitoring Dive",
      project_name: "Coastal Forest Restoration",
      theme: "Habitat",
      allocation_amount: 142,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg"],
      proof_description: "Conducted underwater survey of 500m² coral reef area. Documented 23 species of coral and 47 fish species. Identified and removed 15 pieces of marine debris harmful to reef ecosystem.",
      verified_date: "2024-01-13"
    },
    {
      id: "7",
      booking_date: "2024-01-08", 
      experience_title: "School Environmental Club Setup",
      project_name: "Samburu Education Initiative",
      theme: "Education",
      allocation_amount: 78,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg"],
      proof_description: "Established environmental club at local primary school with 25 student members. Planted school garden with 30 indigenous plants. Conducted first conservation awareness session.",
      verified_date: "2024-01-11"
    },
    {
      id: "8",
      booking_date: "2024-01-06",
      experience_title: "Beehive Installation & Training", 
      project_name: "Maasai Mara Wildlife Conservancy",
      theme: "Livelihoods",
      allocation_amount: 195,
      currency: "USD",
      status: "verified",
      proof_images: ["/placeholder.svg", "/placeholder.svg"],
      proof_description: "Installed 8 modern beehives for community cooperative. Trained 12 beekeepers in sustainable harvesting methods. Expected to generate annual income for participating families.",
      verified_date: "2024-01-09"
    }
  ];

  const filteredEntries = mockLedgerEntries.filter(entry => {
    const matchesSearch = 
      entry.experience_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.proof_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPartner = selectedPartner === "all" || entry.project_name === selectedPartner;
    const matchesTheme = selectedTheme === "all" || entry.theme === selectedTheme;
    
    return matchesSearch && matchesPartner && matchesTheme;
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalImpact = filteredEntries.reduce((sum, entry) => sum + entry.allocation_amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Impact Transparency Ledger
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Every dollar tracked. Every impact verified. See exactly how traveler contributions 
              are creating real conservation outcomes across Kenya.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{formatPrice(totalImpact)}</div>
                <div className="text-sm text-muted-foreground">Total Verified Impact</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{filteredEntries.length}</div>
                <div className="text-sm text-muted-foreground">Verified Entries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Active Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Allocation Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search experiences, partners..."
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
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger>
                <SelectValue placeholder="All Themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="Wildlife">Wildlife</SelectItem>
                <SelectItem value="Livelihoods">Livelihoods</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Habitat">Habitat</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs for different views */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="entries" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Impact Dashboard
              </h2>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="entries">Impact Entries</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="predictions">Forecasts</TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="mt-8">

          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {entry.experience_title}
                          </h3>
                           <p className="text-muted-foreground">
                             by <Link to={`/projects/${entry.project_name === 'Maasai Mara Wildlife Conservancy' ? '1' : entry.project_name === 'Samburu Education Initiative' ? '2' : '3'}`} className="hover:text-primary underline">
                               {entry.project_name}
                             </Link>
                           </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getThemeColor(entry.theme)}>
                            {entry.theme}
                          </Badge>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            Verified
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {entry.proof_description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Booked: {new Date(entry.booking_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          Verified: {new Date(entry.verified_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col justify-center">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(entry.allocation_amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Impact Allocation
                        </div>
                      </div>
                    </div>

                    {/* Proof Images */}
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Impact Proof ({entry.proof_images.length})
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {entry.proof_images.slice(0, 4).map((image, index) => (
                          <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Impact proof ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                      {entry.proof_images.length > 4 && (
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          View All ({entry.proof_images.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No verified impact entries found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPartner("all");
                  setSelectedTheme("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
            </TabsContent>

            <TabsContent value="reports" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Monthly Impact Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Comprehensive monthly breakdown of conservation impact across all partners.</p>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full" onClick={() => generateReport('monthly')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download detailed report
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Partner Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Detailed analysis of each partner's conservation outcomes and efficiency.</p>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full" onClick={() => generateReport('partner')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download detailed report
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Quarterly assessment data
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Impact Forecasting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Predictive analysis of conservation impact based on current trends.</p>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Forecast
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Next 12 months projection
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Report Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">342</div>
                        <div className="text-sm text-muted-foreground">Wildlife Protected This Month</div>
                      </div>
                      <div className="text-center p-4 bg-conservation/5 rounded-lg">
                        <div className="text-2xl font-bold text-conservation">87</div>
                        <div className="text-sm text-muted-foreground">Community Members Trained</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <div className="text-2xl font-bold text-accent">156 ha</div>
                        <div className="text-sm text-muted-foreground">Habitat Restored</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Impact by Theme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        wildlife: { label: "Wildlife Protection", color: "hsl(var(--wildlife))" },
                        livelihoods: { label: "Community Livelihoods", color: "hsl(var(--livelihoods))" },
                        habitat: { label: "Habitat Restoration", color: "hsl(var(--habitat))" },
                        education: { label: "Education", color: "hsl(var(--education))" },
                      }}
                      className="h-[200px]"
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={[
                            { name: "Wildlife Protection", value: 650, fill: "hsl(var(--wildlife))" },
                            { name: "Community Livelihoods", value: 420, fill: "hsl(var(--livelihoods))" },
                            { name: "Habitat Restoration", value: 380, fill: "hsl(var(--habitat))" },
                            { name: "Education", value: 285, fill: "hsl(var(--education))" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        mara: { label: "Maasai Mara", color: "hsl(142 71% 45%)" },
                        samburu: { label: "Samburu", color: "hsl(142 71% 35%)" },
                        coast: { label: "Coastal Areas", color: "hsl(142 71% 55%)" },
                        laikipia: { label: "Laikipia", color: "hsl(142 71% 65%)" },
                      }}
                      className="h-[200px]"
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={[
                            { name: "Maasai Mara", value: 35, fill: "hsl(142 71% 45%)" },
                            { name: "Samburu", value: 28, fill: "hsl(142 71% 35%)" },
                            { name: "Coastal Areas", value: 22, fill: "hsl(142 71% 55%)" },
                            { name: "Laikipia", value: 15, fill: "hsl(142 71% 65%)" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>6-Month Impact Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Based on current booking trends and seasonal patterns.</p>
                    <div className="text-2xl font-bold text-primary mb-2">{formatPrice(2400)}</div>
                    <p className="text-sm text-muted-foreground">Projected impact allocation</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Trajectory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Conservation impact growth compared to previous periods.</p>
                    <div className="text-2xl font-bold text-primary mb-2">+24%</div>
                    <p className="text-sm text-muted-foreground">Quarterly growth rate</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Impact Verification Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our transparent process ensures every dollar creates real, measurable conservation impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  Booking Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When you book an experience, funds are allocated transparently to conservation partners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  Impact Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Partners use funds for conservation activities and document the impact with photos and reports.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team verifies the impact proof and publishes it to this public ledger for full transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ImpactLedger;