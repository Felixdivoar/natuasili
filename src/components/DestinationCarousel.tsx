import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import nairobiImage from "@/assets/destinations/nairobi-destination.jpg";
import samburuImage from "@/assets/destinations/samburu-destination.jpg";
import masaiMaraImage from "@/assets/destinations/masai-mara-destination.jpg";
import coastImage from "@/assets/destinations/coast-destination.jpg";
import laikipiaImage from "@/assets/destinations/laikipia-destination.jpg";
const destinations = [{
  id: 1,
  name: "Maasai Mara",
  description: "World-renowned wildlife conservancy and Great Migration destination",
  image: masaiMaraImage,
  location: "Narok County",
  partners: ["Maasai Mara Wildlife Conservancy", "Mara Elephant Project"]
}, {
  id: 2,
  name: "Samburu",
  description: "Unique wildlife and cultural experiences in Kenya's northern frontier",
  image: samburuImage,
  location: "Samburu County",
  partners: ["Samburu Education Initiative"]
}, {
  id: 3,
  name: "Coastal Kenya",
  description: "Mangrove restoration and marine conservation along the Indian Ocean",
  image: coastImage,
  location: "Coastal Kenya",
  partners: ["Coastal Forest Restoration"]
}, {
  id: 4,
  name: "Nairobi",
  description: "Urban wildlife sanctuary and forest conservation",
  image: nairobiImage,
  location: "Nairobi County",
  partners: ["Friends of Nairobi National Park", "Friends of Karura Forest"]
}, {
  id: 5,
  name: "Laikipia",
  description: "Rhino sanctuary and community-based conservation",
  image: laikipiaImage,
  location: "Laikipia County",
  partners: ["Ol Pejeta Conservancy"]
}];
const CarouselControls = () => {
  const {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext
  } = useCarousel();
  return <div className="flex justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground" onClick={scrollPrev} disabled={!canScrollPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground" onClick={scrollNext} disabled={!canScrollNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>;
};
const DestinationCarousel = () => {
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-left">Conservation destinations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover Kenya's most important conservation sites where your experiences make a real difference.
            </p>
          </div>
          <Link to="/destinations">
            <Button variant="outline" className="hidden md:block">
              View All Destinations
            </Button>
          </Link>
        </div>

        <Carousel opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinations.map(destination => <CarouselItem key={destination.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Link to={`/destinations#${destination.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-[4/3]">
                      <img src={destination.image} alt={destination.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                        <p className="text-sm text-white/90 mb-2">{destination.description}</p>
                        <div className="flex items-center gap-1 text-xs text-white/80 mb-2">
                          <MapPin className="h-3 w-3" />
                          {destination.location}
                        </div>
                        <div className="text-xs text-white/70">
                          {destination.partners.length} Partner{destination.partners.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>)}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
            <CarouselNext className="-right-6 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-full w-12 h-12" />
          </div>
          <div className="md:hidden">
            <CarouselControls />
          </div>
        </Carousel>
      </div>
    </section>;
};
export default DestinationCarousel;