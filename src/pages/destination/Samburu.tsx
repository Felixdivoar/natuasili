import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine, Camera, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PARTNERS, EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import BookNowButton from "@/components/BookNowButton";
const samburuDestination = "/lovable-uploads/01b8fcc6-ad62-462a-aad8-c45697827e2e.png";
const SamburuDestination = () => {
  const {
    formatPrice
  } = useCurrency();
  // Get Samburu-related partners and experiences
  const samburuPartners = PARTNERS.filter(partner => 
    partner.location.toLowerCase().includes('samburu')
  );
  const samburuExperiences = EXPERIENCES.filter(experience => 
    experience.destination === 'samburu'
  );
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <img src={samburuDestination} alt="Samburu Ecosystem" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Samburu Ecosystem
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Community conservancies protecting unique northern Kenya wildlife and supporting traditional pastoralist communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-conservation hover:bg-conservation/90">
                <Link to="/listings?destination=samburu">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-black bg-white hover:bg-white hover:text-black active:text-black focus:text-black" asChild>
                <Link to="/impact-ledger">
                  View Conservation Impact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-[20px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               <div className="text-center">
                 <div className="text-3xl font-bold text-conservation mb-2">{samburuPartners.length}</div>
                 <div className="text-sm text-muted-foreground">Conservation Partners</div>
               </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">{samburuExperiences.length}</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">8,500</div>
                <div className="text-sm text-muted-foreground">Hectares Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-conservation mb-2">18</div>
                <div className="text-sm text-muted-foreground">Communities Involved</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Samburu</h2>
              <p className="text-muted-foreground mb-6">
                The Samburu ecosystem represents one of Kenya's most unique and biodiverse regions, home to species found nowhere else in the world. The iconic "Samburu Special Five" - Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk - thrive in this arid landscape alongside the "Big Five."
              </p>
              
              <p className="text-muted-foreground mb-6">
                Community conservancies have become the backbone of conservation in this region, with local Samburu communities leading efforts to protect wildlife while maintaining their traditional pastoralist lifestyle. These conservancies cover vast areas outside the national reserve, creating crucial wildlife corridors and breeding grounds.
              </p>

              <h3 className="text-xl font-semibold mb-4">Conservation Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Wildlife Research</h4>
                  <p className="text-sm text-muted-foreground">Ongoing studies of elephant behavior and migration patterns provide crucial data for conservation planning.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Community Conservancies</h4>
                  <p className="text-sm text-muted-foreground">Local communities receive direct benefits from tourism while protecting critical wildlife habitat.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Cultural Tourism</h4>
                  <p className="text-sm text-muted-foreground">Authentic cultural experiences help preserve Samburu traditions while generating community income.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Anti-Poaching</h4>
                  <p className="text-sm text-muted-foreground">Community rangers patrol vast areas, providing real-time intelligence on wildlife movements and threats.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Partners */}
      <section className="bg-muted/30 py-[15px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Conservation Partners in Samburu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the organizations working tirelessly to protect Samburu's unique ecosystem and support local communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samburuPartners.map(partner => <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="w-full h-full object-cover rounded-t-lg" 
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-conservation/90 text-white">
                      {partner.themes[0]}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {partner.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {partner.description}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link to={`/partners/${partner.slug}`}>
                        View Partner
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Samburu Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in authentic conservation experiences while supporting local communities and wildlife protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samburuExperiences.slice(0, 6).map(experience => <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/10] relative">
                  {experience.images[0] && <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover rounded-t-lg" />}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white/90 text-foreground">
                      {formatPrice(experience.priceKESAdult)}
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
                      8 max
                    </div>
                    <BookNowButton 
                      href={`/experience/${experience.slug}`}
                      label="Book Now"
                    />
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/listings?destination=samburu">
                View All Samburu Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default SamburuDestination;