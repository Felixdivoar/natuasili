import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, DollarSign, Calendar, Phone, Mail, ExternalLink, TreePine, Eye, Camera } from "lucide-react";
import { mockProjects, mockExperiences } from "@/data/mockData";
import ExperienceCard from "@/components/ExperienceCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { formatPrice } = useCurrency();
  const project = mockProjects.find(p => p.id === projectId);
  const projectExperiences = mockExperiences.filter(e => e.project_id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <Button asChild>
              <Link to="/browse">Browse Projects</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock partner-specific impact data
  const partnerImpactData = {
    '1': { // Maasai Mara
      totalFunds: 125000,
      verifiedImpact: 98000,
      activeProjects: 8,
      impactEntries: [
        {
          date: '2024-01-20',
          activity: 'Big Five Wildlife Tracking',
          amount: 263,
          description: 'Successfully tracked 3 lion prides, contributing valuable data to conservation research.',
          verified: true
        },
        {
          date: '2024-01-15',
          activity: 'Anti-Poaching Patrol Training',
          amount: 290,
          description: 'Trained 12 local rangers in advanced tracking and surveillance techniques.',
          verified: true
        },
        {
          date: '2024-01-09',
          activity: 'Beehive Installation & Training',
          amount: 195,
          description: 'Installed 8 modern beehives for community cooperative.',
          verified: true
        }
      ]
    },
    '2': { // Samburu Education
      totalFunds: 78000,
      verifiedImpact: 62000,
      activeProjects: 5,
      impactEntries: [
        {
          date: '2024-01-18',
          activity: 'Traditional Beadwork Workshop',
          amount: 96,
          description: 'Conducted workshop with 8 local women artisans, creating 15 traditional beadwork pieces.',
          verified: true
        },
        {
          date: '2024-01-17',
          activity: 'Community Solar Water Pump Installation',
          amount: 184,
          description: 'Installed solar-powered water pump serving 150 community members.',
          verified: true
        },
        {
          date: '2024-01-11',
          activity: 'School Environmental Club Setup',
          amount: 78,
          description: 'Established environmental club at local primary school with 25 student members.',
          verified: true
        }
      ]
    },
    '3': { // Coastal Forest
      totalFunds: 95000,
      verifiedImpact: 71000,
      activeProjects: 6,
      impactEntries: [
        {
          date: '2024-01-16',
          activity: 'Mangrove Restoration Volunteer Day',
          amount: 60,
          description: 'Planted 45 mangrove seedlings and removed 2.3 tons of marine debris.',
          verified: true
        },
        {
          date: '2024-01-13',
          activity: 'Coral Reef Monitoring Dive',
          amount: 142,
          description: 'Conducted underwater survey of 500m² coral reef area.',
          verified: true
        }
      ]
    }
  };

  const impactData = partnerImpactData[projectId as keyof typeof partnerImpactData];
  const impactRate = impactData ? Math.round((impactData.verifiedImpact / impactData.totalFunds) * 100) : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={project.hero_image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getCategoryColor(project.category)}>
                  {project.category}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Active Partner
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.name}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                {project.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info & Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Conservation Partner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {project.bio}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{project.location_text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Partner since {new Date(project.created_at).getFullYear()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{project.contact_email}</span>
                      </div>
                      {project.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{project.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Transparency */}
                {impactData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Impact Transparency
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{formatPrice(impactData.totalFunds)}</div>
                          <div className="text-sm text-muted-foreground">Total Funds Received</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{formatPrice(impactData.verifiedImpact)}</div>
                          <div className="text-sm text-muted-foreground">Verified Impact</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{impactRate}%</div>
                          <div className="text-sm text-muted-foreground">Impact Rate</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Impact Verification Progress</span>
                          <span className="font-medium">{impactRate}%</span>
                        </div>
                        <Progress value={impactRate} className="h-3" />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Recent Verified Impact</h4>
                        {impactData.impactEntries.slice(0, 3).map((entry, index) => (
                          <div key={index} className="border-l-2 border-primary/20 pl-4">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-medium text-sm">{entry.activity}</div>
                              <div className="text-primary font-semibold">{formatPrice(entry.amount)}</div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.description}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/impact-ledger">
                          View Full Impact History
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Available Experiences */}
                {projectExperiences.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Experiences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-6">
                        {projectExperiences.map((experience) => (
                          <ExperienceCard key={experience.id} experience={experience} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Bookings</span>
                      </div>
                      <span className="font-semibold">{project.metrics_bookings_count}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Funds Raised</span>
                      </div>
                      <span className="font-semibold">{formatPrice(project.metrics_funds_total)}</span>
                    </div>

                    {impactData && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TreePine className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Active Projects</span>
                        </div>
                        <span className="font-semibold">{impactData.activeProjects}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button className="w-full" asChild>
                        <Link to="/browse">Book Experience</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Connect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${project.contact_email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/impact-ledger">
                        <Camera className="h-4 w-4 mr-2" />
                        View Impact Proof
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/dashboard">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        My Dashboard
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectDetail;