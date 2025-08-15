import ProjectCard from "./ProjectCard";
import { mockProjects } from "@/data/mockData";

const ConservationProjects = () => {
  return (
    <section id="projects" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated organizations working tirelessly to protect Kenya's 
            natural heritage and support local communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConservationProjects;