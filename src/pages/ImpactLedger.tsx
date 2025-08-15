import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, ExternalLink, Calendar, DollarSign, MapPin, Camera } from "lucide-react";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ImpactLedger = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const { formatPrice } = useCurrency();

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
                    <CardTitle>Monthly Impact Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Comprehensive monthly breakdown of conservation impact across all partners.</p>
                    <Button size="sm">Download PDF</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Partner Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Detailed analysis of each partner's conservation outcomes and efficiency.</p>
                    <Button size="sm">View Report</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Forecasting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Predictive analysis of conservation impact based on current trends.</p>
                    <Button size="sm">View Forecast</Button>
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
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Wildlife Protection</span>
                        <span className="font-bold">{formatPrice(650)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Community Livelihoods</span>
                        <span className="font-bold">{formatPrice(420)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Habitat Restoration</span>
                        <span className="font-bold">{formatPrice(380)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Education</span>
                        <span className="font-bold">{formatPrice(285)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Maasai Mara</span>
                        <span className="font-bold">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Samburu</span>
                        <span className="font-bold">28%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Coastal Areas</span>
                        <span className="font-bold">22%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Laikipia</span>
                        <span className="font-bold">15%</span>
                      </div>
                    </div>
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