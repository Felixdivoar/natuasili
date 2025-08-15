import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ExperienceCard from "./ExperienceCard";
import { mockExperiences } from "@/data/mockData";

const FeaturedExperiences = () => {
  return (
    <section id="experiences" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Conservation Experiences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic experiences that create lasting impact for wildlife, 
            communities, and habitats across Kenya.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockExperiences.slice(0, 6).map((experience) => (
            <ExperienceCard 
              key={experience.id} 
              experience={experience} 
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/marketplace">
            <Button size="lg" variant="outline">
              View All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;