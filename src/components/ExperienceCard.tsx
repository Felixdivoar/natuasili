import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, DollarSign, Share2 } from "lucide-react";
import { Experience } from "@/types";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import SocialShare from "@/components/SocialShare";

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
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group experience-card"
      data-destination={getDestination()}
      data-theme={experience.theme.toLowerCase().replace(' ', '-')}
      data-activity-impact={experience.activity_type.toLowerCase().replace(' ', '-')}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {experience.images[0] && (
          <img 
            src={experience.images[0]} 
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Link 
            to={`/marketplace?theme=${encodeURIComponent(experience.theme.toLowerCase().replace(/\s+/g, '-'))}`}
            className="theme-chip bg-black text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
          >
            {experience.theme}
          </Link>
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {experience.activity_type}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="bg-primary text-primary-foreground rounded-lg px-2 py-1 shadow-lg price-wrap">
            <div className="marketplace-price">
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
            <Link to={`/checkout?experience=${experience.id}&quantity=1`} className="flex-1">
              <Button 
                className="w-full bg-conservation hover:bg-conservation/90 text-white" 
                size="sm"
              >
                Book Now
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <SocialShare
              title={experience.title}
              description={experience.description}
              url={`${window.location.origin}/experience/${experience.slug}`}
              className="flex-1"
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