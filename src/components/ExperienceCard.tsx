import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, DollarSign, Share2 } from "lucide-react";
import { Experience } from "@/types";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import SocialShare from "@/components/SocialShare";
import { initializeThemeChips } from "@/utils/themeUtils";

interface ExperienceCardProps {
  experience: Experience;
}

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Wildlife Conservation': return 'bg-conservation text-white';
    case 'Cultural Exploration': return 'bg-accent text-white';
    case 'Conservation Education': return 'bg-primary text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

const getThemeSlug = (theme: string) => {
  const themeMap: Record<string, string> = {
    'Wildlife Conservation': 'wildlife-conservation',
    'Cultural Exploration': 'cultural-exploration',
    'Conservation Education': 'conservation-education'
  };
  return themeMap[theme] || theme.toLowerCase().replace(/\s+/g, '-');
};

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const { formatPrice } = useCurrency();
  
  // Determine destination for data attribute
  const getDestination = () => {
    const location = experience.location_text.toLowerCase();
    if (location.includes('nairobi')) return 'nairobi';
    if (location.includes('coast') || location.includes('mombasa') || location.includes('malindi')) return 'coast';
    if (location.includes('laikipia') || location.includes('ol pejeta')) return 'laikipia';
    if (location.includes('mara') || location.includes('masai')) return 'masai-mara';
    if (location.includes('samburu')) return 'samburu';
    return 'other';
  };

  // Generate booking data for the experience
  const bookingData = {
    experienceId: experience.id,
    title: experience.title,
    currency: "KES",
    unitPrice: experience.base_price,
    minGuests: 1,
    maxGuests: experience.capacity,
    hasTimeSlots: false,
    timeSlots: [],
    addOns: [
      { id: "guide", title: "Private guide", price: 3000 },
      { id: "transfers", title: "Round-trip transfers", price: 4500 }
    ],
    taxesPct: 0.00,
    feesFlat: 0
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group experience-card"
      data-destination={getDestination()}
      data-theme={experience.theme.toLowerCase().replace(' ', '-')}
      data-activity-impact={experience.activity_type.toLowerCase().replace(' ', '-')}
      data-experience={JSON.stringify(bookingData)}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {experience.images[0] && (
          <img 
            src={experience.images[0]} 
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2 experience-theme">
          <Link 
            to={`/marketplace?theme=${encodeURIComponent(getThemeSlug(experience.theme))}`}
            className="theme-chip"
          >
            {experience.theme}
          </Link>
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {experience.activity_type}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="bg-primary text-primary-foreground rounded-lg px-2 py-1 shadow-lg price-wrap">
            <div className="marketplace-price price">
              {formatPrice(experience.base_price)}
            </div>
            <div className="text-xs opacity-90">
              per person
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {experience.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {experience.location_text}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {experience.description}
        </p>

        {/* Partner information */}
        {experience.project && (
          <div className="mb-4 p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Conservation Partner</p>
              <Link 
                to={`/projects/${experience.project?.id}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {experience.project?.name}
              </Link>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Up to {experience.capacity} people
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {experience.duration_hours % 1 === 0 
              ? `${experience.duration_hours} hour${experience.duration_hours > 1 ? 's' : ''}`
              : `${experience.duration_hours} hours`
            }
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Link to={`/experience/${experience.slug}`} className="flex-1">
              <Button 
                variant="outline"
                className="w-full" 
                size="sm"
              >
                View Details
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button 
              className="btn-reserve flex-1" 
              data-action="reserve"
              size="sm"
            >
              Reserve
            </Button>
            <SocialShare
              title={experience.title}
              description={experience.description}
              url={`${window.location.origin}/experience/${experience.slug}`}
            />
            <Button 
              variant="outline" 
              size="sm"
              className="px-3"
            >
              ♡
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;