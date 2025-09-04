import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockExperiences } from "@/data/newMockData";
import { Destination } from "@/data/partners";

interface DestinationExperienceCarouselProps {
  destination: Destination;
}

const destinationLabels: Record<Destination, string> = {
  "nairobi": "Nairobi",
  "coastal-kenya": "Coastal Kenya", 
  "samburu": "Samburu",
  "masai-mara": "Masai Mara",
  "laikipia": "Laikipia"
};

const destinationPaths: Record<Destination, string> = {
  "nairobi": "nairobi",
  "coastal-kenya": "coast", 
  "samburu": "samburu",
  "masai-mara": "masai-mara",
  "laikipia": "laikipia"
};

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Wildlife Conservation':
      return 'bg-wildlife/10 text-wildlife border-wildlife/20';
    case 'Cultural Exploration':
      return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
    case 'Conservation Education':
      return 'bg-education/10 text-education border-education/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function DestinationExperienceCarousel({ destination }: DestinationExperienceCarouselProps) {
  const { formatPrice } = useCurrency();
  
  // Filter experiences by destination (need to convert from location_text to destination)
  const destinationExperiences = mockExperiences.filter(exp => {
    const locationMapping: Record<string, Destination> = {
      'Nairobi, Kenya': 'nairobi',
      'Coast Province, Kenya': 'coastal-kenya',
      'Samburu County, Kenya': 'samburu', 
      'Maasai Mara, Kenya': 'masai-mara',
      'Laikipia County, Kenya': 'laikipia'
    };
    return locationMapping[exp.location_text] === destination;
  });

  if (destinationExperiences.length === 0) return null;

  return (
      <section className="py-16 bg-background">
        <div className="max-w-[1150px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            <Link 
              to={`/destinations/kenya/${destinationPaths[destination]}`}
              className="hover:text-primary transition-colors"
            >
              Experiences in {destinationLabels[destination]}
            </Link>
          </h2>
          <Link 
            to={`/destinations/kenya/${destinationPaths[destination]}`}
            className="text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinationExperiences.map((experience) => (
              <CarouselItem key={experience.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Link to={`/experience/${experience.slug}`} className="group block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={experience.images[0]}
                        alt={experience.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={`text-xs ${getThemeColor(experience.theme)}`}>
                            {experience.theme}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">4.8</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {experience.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{experience.location_text}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{experience.duration_hours}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Up to {experience.capacity}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">from</span>
                            <span className="font-bold text-foreground">
                              {formatPrice(experience.base_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </section>
  );
}