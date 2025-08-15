import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, DollarSign } from "lucide-react";
import { Experience } from "@/types";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Wildlife': return 'bg-wildlife text-white';
    case 'Livelihoods': return 'bg-livelihoods text-white';
    case 'Education': return 'bg-education text-white';
    case 'Habitat': return 'bg-habitat text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {experience.images[0] && (
          <img 
            src={experience.images[0]} 
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getThemeColor(experience.theme)}>
            {experience.theme}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {experience.activity_type}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="text-lg font-bold text-foreground">
              ${experience.base_price}
            </div>
            <div className="text-xs text-muted-foreground">
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
        
        <div className="flex gap-2">
          <Link to={`/experience/${experience.slug}`} className="flex-1">
            <Button 
              className="w-full bg-primary hover:bg-primary-hover" 
              size="sm"
            >
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
          >
            ♡
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;