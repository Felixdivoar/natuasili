import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

import nairobiDestination from "@/assets/destinations/nairobi-destination.jpg";

const NairobiDestination = () => {
  const { formatPrice } = useCurrency();
  
  // Get Nairobi-related partners and experiences
  const nairobiPartners = mockProjects.filter(project => 
    project.location_text.toLowerCase().includes('nairobi') || 
    project.name.toLowerCase().includes('nairobi') ||
    project.name.toLowerCase().includes('karura')
  );

  const nairobiExperiences = mockExperiences.filter(experience => 
    experience.location_text.toLowerCase().includes('nairobi') ||
    experience.location_text.toLowerCase().includes('karura')
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img
          src={nairobiDestination}
          alt="Nairobi Conservation Area"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nairobi Conservation Area
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Urban conservation initiatives including Nairobi National Park, Karura Forest, and community-based urban wildlife corridors.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/marketplace?destination=nairobi">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                View Urban Impact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">8</div>
                <div className="text-sm text-muted-foreground">Urban Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">12</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">12,000</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">25</div>
                <div className="text-sm text-muted-foreground">Communities Involved</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Nairobi's Urban Conservation</h2>
              <p className="text-muted-foreground mb-6">
                Nairobi is unique as one of the world's only capital cities with a national park within its boundaries. The Nairobi Conservation Area encompasses not just the famous national park, but also critical urban forests like Karura, community conservancies, and green corridors that connect fragmented habitats.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Urban conservation in Nairobi faces unique challenges and opportunities. The proximity of wildlife to over 4 million residents creates both human-wildlife conflict and unprecedented opportunities for conservation education and community engagement. Initiatives here serve as models for urban conservation across Africa.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Urban Wildlife Corridors</h4>
                  <p className="text-sm text-muted-foreground">Creating safe passages for wildlife movement between protected areas and reducing human-wildlife conflict.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Forest Restoration</h4>
                  <p className="text-sm text-muted-foreground">Restoration of degraded urban forests and establishment of new green spaces for biodiversity and carbon sequestration.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Environmental Education</h4>
                  <p className="text-sm text-muted-foreground">Engaging urban communities and schools in conservation through hands-on environmental education programs.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Research & Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Long-term research on urban ecology and wildlife behavior in human-dominated landscapes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Urban Conservation Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the organizations pioneering urban conservation in Kenya's capital city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nairobiPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  <img
                    src={partner.hero_image}
                    alt={partner.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-conservation/90 text-white">
                      {partner.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {partner.location_text}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {partner.bio}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link to={`/projects/${partner.id}`}>
                        View Partner
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/marketplace?partner=${partner.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Experiences
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Nairobi Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover unique urban conservation experiences in Kenya's vibrant capital city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nairobiExperiences.slice(0, 6).map((experience) => (
              <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  {experience.images[0] && (
                    <img
                      src={experience.images[0]}
                      alt={experience.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-foreground">
                      {formatPrice(experience.base_price)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {experience.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {experience.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {experience.capacity} max
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/experience/${experience.slug}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/marketplace?destination=nairobi">
                View All Nairobi Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NairobiDestination;