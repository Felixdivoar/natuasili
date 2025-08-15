import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, DollarSign } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Wildlife': return 'bg-wildlife text-white';
    case 'Livelihoods': return 'bg-livelihoods text-white';
    case 'Education': return 'bg-education text-white';
    case 'Habitat': return 'bg-habitat text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {project.hero_image && (
          <img 
            src={project.hero_image} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-3 left-3">
          <Badge className={getCategoryColor(project.category)}>
            {project.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {project.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {project.name}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {project.location_text}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.bio}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-1" />
              {project.metrics_bookings_count} bookings
            </div>
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              ${project.metrics_funds_total.toLocaleString()}
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary-hover" 
          size="sm"
        >
          View Experiences
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;