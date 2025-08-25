import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Star, Clock, CheckCircle, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ExperienceHub = () => {
  const { formatPrice } = useCurrency();

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const featuredExperiences = mockExperiences.slice(0, 8);
  const quickBookings = mockExperiences.filter(exp => exp.base_price < 150).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="conservation-experience-hub" className="py-16 bg-conservation/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="section-title text-4xl md:text-5xl font-bold text-foreground mb-6">
              Conservation Experience Hub
            </h1>
            <p className="section-description text-muted-foreground mb-8">
              Book authentic conservation experiences with instant confirmation. 
              Every booking directly supports wildlife protection and community development.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="bg-conservation hover:bg-conservation/90">
                  Browse All Experiences
                </Button>
              </Link>
              <Link to="/impact-ledger">
                <Button variant="outline" size="lg">
                  View Impact Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-conservation">{mockExperiences.length}+</div>
              <div className="text-sm text-muted-foreground">Available Experiences</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-conservation">90%</div>
              <div className="text-sm text-muted-foreground">Goes to Conservation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-conservation">24h</div>
              <div className="text-sm text-muted-foreground">Booking Confirmation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-conservation">100%</div>
              <div className="text-sm text-muted-foreground">Impact Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Book Conservation Experiences
              </h2>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="new">New Arrivals</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="featured" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredExperiences.map((experience) => {
                  const project = mockProjects.find(p => p.id === experience.project_id);
                  
                  return (
                    <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-[4/3] relative">
                        <img
                          src={experience.images[0]}
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={getThemeColor(experience.theme)}>
                            {experience.theme}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                            <div className="text-sm font-bold text-foreground">
                              {formatPrice(experience.base_price)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {experience.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {experience.location_text}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {experience.capacity} max
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {experience.description}
                        </p>

                        <div className="flex items-center justify-between mb-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span>4.8 (24)</span>
                          </div>
                          {project && (
                            <Link to={`/projects/${project.id}`} className="text-primary hover:underline">
                              by {project.name}
                            </Link>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Link to={`/experience/${experience.slug}`} className="flex-1">
                              <Button size="sm" variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>


            <TabsContent value="new" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExperiences.slice(8, 14).map((experience) => {
                  const project = mockProjects.find(p => p.id === experience.project_id);
                  
                  return (
                    <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] relative">
                        <img
                          src={experience.images[0]}
                          alt={experience.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-accent text-white">NEW</Badge>
                          <Badge className={getThemeColor(experience.theme)}>
                            {experience.theme}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {experience.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xl font-bold text-foreground">
                            {formatPrice(experience.base_price)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm">New</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/experience/${experience.slug}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExperienceHub;