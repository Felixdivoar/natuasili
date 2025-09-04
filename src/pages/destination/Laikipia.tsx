import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProjects, mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

import laikipiaDestination from "@/assets/destinations/laikipia-destination.jpg";

const LaikipiaDestination = () => {
  const { formatPrice } = useCurrency();
  // Get Laikipia-related partners and experiences
  const laikipiaPartners = mockProjects.filter(project => 
    project.location_text.toLowerCase().includes('laikipia') || 
    project.name.toLowerCase().includes('laikipia') ||
    project.name.toLowerCase().includes('ol pejeta')
  );

  const laikipiaExperiences = mockExperiences.filter(experience => 
    experience.location_text.toLowerCase().includes('laikipia') ||
    experience.location_text.toLowerCase().includes('ol pejeta')
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img
          src={laikipiaDestination}
          alt="Laikipia Plateau"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Laikipia Plateau
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Private and community conservancies working together to protect wildlife on Kenya's central highlands.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/marketplace?destination=laikipia">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                View Highland Impact
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
                <div className="text-3xl font-bold text-conservation mb-2">9</div>
                <div className="text-sm text-muted-foreground">Conservation Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">13</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">11,000</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">20</div>
                <div className="text-sm text-muted-foreground">Communities Involved</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Laikipia Plateau</h2>
              <p className="text-muted-foreground mb-6">
                The Laikipia Plateau spans over 9,500 square kilometers of Kenya's central highlands, representing one of Africa's most successful examples of landscape-scale conservation. This region demonstrates how private conservancies, community lands, and government protected areas can work together to protect wildlife and ecosystems.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Home to the largest population of endangered black rhinos in East Africa and the second-largest elephant population in Kenya, Laikipia shows that conservation and sustainable land use can coexist. The plateau's diverse ecosystems support over 7,000 elephants, alongside lions, wild dogs, and Grevy's zebras.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Private Conservancies</h4>
                  <p className="text-sm text-muted-foreground">Over 50 private conservancies working together as the Laikipia Wildlife Forum to coordinate conservation efforts.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Wildlife Research</h4>
                  <p className="text-sm text-muted-foreground">Leading research on elephant ecology, predator-prey dynamics, and conservation genetics.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Community Partnerships</h4>
                  <p className="text-sm text-muted-foreground">Collaborative relationships between private conservancies and surrounding pastoral communities.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Rhino Sanctuary</h4>
                  <p className="text-sm text-muted-foreground">The largest black rhino sanctuary in East Africa with a growing population of this critically endangered species.</p>
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
              Laikipia Conservation Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the organizations protecting Kenya's highland ecosystems through innovative conservation partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laikipiaPartners.map((partner) => (
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
              Featured Laikipia Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge conservation on Kenya's most innovative landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laikipiaExperiences.slice(0, 6).map((experience) => (
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
              <Link to="/marketplace?destination=laikipia">
                View All Laikipia Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LaikipiaDestination;