import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Maasai Mara",
    description: "World-renowned wildlife conservancy",
    image: "/src/assets/maasai-mara-project.jpg",
    location: "Narok County"
  },
  {
    id: 2,
    name: "Samburu National Reserve",
    description: "Unique wildlife and cultural experiences", 
    image: "/src/assets/samburu-education.jpg",
    location: "Samburu County"
  },
  {
    id: 3,
    name: "Coastal Forests",
    description: "Mangrove restoration and marine conservation",
    image: "/src/assets/coastal-forest.jpg", 
    location: "Coastal Kenya"
  },
  {
    id: 4,
    name: "Nairobi National Park",
    description: "Urban wildlife sanctuary",
    image: "/src/assets/nairobi-park-cleanup.jpg",
    location: "Nairobi"
  },
  {
    id: 5,
    name: "Karura Forest",
    description: "Urban forest conservation",
    image: "/src/assets/karura-forest-planting.jpg",
    location: "Nairobi"
  },
  {
    id: 6,
    name: "Ol Pejeta Conservancy", 
    description: "Rhino sanctuary and wildlife protection",
    image: "/src/assets/ol-pejeta-rhino.jpg",
    location: "Laikipia County"
  }
];

const DestinationCarousel = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Destinations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Kenya's most important conservation sites where your experiences make a real difference.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinations.map((destination) => (
              <CarouselItem key={destination.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                      <p className="text-sm text-white/90 mb-2">{destination.description}</p>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="h-3 w-3" />
                        {destination.location}
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default DestinationCarousel;