import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, ChevronRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockExperiences } from "@/data/newMockData";
import { Destination } from "@/data/partners";
import ExperienceRatingDisplay from "./ExperienceRatingDisplay";
import { filterExperiencesByDestination, formatDestinationName, getDestinationPath } from "@/utils/destinationUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
interface DestinationExperienceCarouselProps {
  destination: Destination;
}

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
export default function DestinationExperienceCarousel({
  destination
}: DestinationExperienceCarouselProps) {
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  const isMobile = useIsMobile();

  // Filter experiences by destination using the new utility function
  const destinationExperiences = filterExperiencesByDestination(mockExperiences, destination);
  
  if (destinationExperiences.length === 0) return null;

  const destinationName = formatDestinationName(destination);
  const destinationPath = getDestinationPath(destination);

  return (
    <section className="bg-background py-[10px]">
      <div className="max-w-[1300px] mx-auto px-[15px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex-1 pr-4">
            <Link 
              to={`/destinations/${destinationPath}`} 
              className="hover:text-primary transition-colors"
            >
              {t("dest_experiences_in")} {destinationName}
            </Link>
          </h2>
          <Link 
            to={`/destinations/${destinationPath}`} 
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">{t("dest_view_all")}</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {destinationExperiences.map(experience => (
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
                    <CardContent className="p-4 h-[180px] flex flex-col">
                      <div className="space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className={`text-xs ${getThemeColor(experience.theme)}`}>
                            {experience.theme}
                          </Badge>
                          <ExperienceRatingDisplay experienceId={experience.id} />
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


                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{t("dest_from")}</span>
                            <span className="text-foreground text-base font-extrabold">
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