import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import nairobiDestination from "@/assets/destinations/nairobi-destination.jpg";
import samburuDestination from "@/assets/destinations/samburu-destination.jpg";
import masaiMaraDestination from "@/assets/destinations/masai-mara-destination.jpg";
import coastDestination from "@/assets/destinations/coast-destination.jpg";
import laikipiaDestination from "@/assets/destinations/laikipia-destination.jpg";

const destinations = [
  {
    id: 1,
    name: "Nairobi Conservation Area",
    description: "Urban conservation initiatives including Nairobi National Park, Karura Forest, and community-based urban wildlife corridors.",
    image: nairobiDestination,
    location: "Nairobi County",
    partners: 8,
    projects: 12,
    hectares: "12,000",
    communities: 25,
    highlights: ["Urban Wildlife Corridors", "Forest Restoration", "Environmental Education"],
    keySpecies: ["Giraffe", "Lion", "Rhino", "Leopard"]
  },
  {
    id: 2,
    name: "Samburu Ecosystem",
    description: "Community conservancies protecting unique northern Kenya wildlife and supporting traditional pastoralist communities.",
    image: samburuDestination,
    location: "Samburu County",
    partners: 6,
    projects: 9,
    hectares: "8,500",
    communities: 18,
    highlights: ["Community Conservancies", "Cultural Tourism", "Wildlife Research"],
    keySpecies: ["Elephant", "Grevy's Zebra", "Reticulated Giraffe", "Wild Dog"]
  },
  {
    id: 3,
    name: "Maasai Mara Ecosystem",
    description: "Protecting the world-famous migration route and supporting Maasai communities through conservation tourism.",
    image: masaiMaraDestination,
    location: "Narok County",
    partners: 10,
    projects: 15,
    hectares: "15,000",
    communities: 30,
    highlights: ["Great Migration", "Community Conservancies", "Anti-Poaching"],
    keySpecies: ["Wildebeest", "Lion", "Cheetah", "Elephant"]
  },
  {
    id: 4,
    name: "Coastal Conservation Zone",
    description: "Marine and coastal ecosystem protection including mangrove restoration and community-based fisheries management.",
    image: coastDestination,
    location: "Coastal Counties",
    partners: 7,
    projects: 11,
    hectares: "6,500",
    communities: 22,
    highlights: ["Mangrove Restoration", "Marine Conservation", "Sustainable Fisheries"],
    keySpecies: ["Whale Shark", "Turtle", "Dolphin", "Dugong"]
  },
  {
    id: 5,
    name: "Laikipia Plateau",
    description: "Private and community conservancies working together to protect wildlife on Kenya's central highlands.",
    image: laikipiaDestination,
    location: "Laikipia County",
    partners: 9,
    projects: 13,
    hectares: "11,000",
    communities: 20,
    highlights: ["Private Conservancies", "Wildlife Research", "Community Partnerships"],
    keySpecies: ["Elephant", "Lion", "Wild Dog", "Grevy's Zebra"]
  }
];

const Destinations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-conservation/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Conservation Destinations
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore Kenya's most important conservation areas where your travel makes a direct impact. 
              Each destination offers unique experiences while supporting vital conservation work.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[16/10]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{destination.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-conservation">{destination.partners}</div>
                      <div className="text-xs text-muted-foreground">Partners</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-conservation">{destination.projects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-conservation">{destination.hectares}</div>
                      <div className="text-xs text-muted-foreground">Hectares</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-conservation">{destination.communities}</div>
                      <div className="text-xs text-muted-foreground">Communities</div>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Conservation Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key Species */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Species</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.keySpecies.map((species, index) => (
                        <Badge key={index} className="text-xs bg-conservation/10 text-conservation border-conservation/20">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Link to={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-').replace('conservation-area', '').replace('ecosystem', '').replace('zone', '').replace('plateau', '').trim()}`} className="flex-1">
                      <Button className="w-full bg-conservation hover:bg-conservation/90 text-white">
                        Explore destination
                      </Button>
                    </Link>
                    <Link to={`/browse?destination=${destination.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View experiences
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;