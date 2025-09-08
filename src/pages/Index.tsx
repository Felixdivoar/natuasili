import Hero from "@/components/Hero";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import DestinationExperienceCarousel from "@/components/DestinationExperienceCarousel";

const Index = () => {
  return (
    <div className="bg-background">
      {/* Use shared Hero component */}
      <Hero 
        backgroundImage="/lovable-uploads/dff689cd-8df1-4136-b9be-292db031f572.png"
        showStats={true}
      />
      
      {/* Per-destination experience carousels */}
      <DestinationExperienceCarousel destination="nairobi" />
      <DestinationExperienceCarousel destination="coastal-kenya" />
      <DestinationExperienceCarousel destination="samburu" />
      <DestinationExperienceCarousel destination="masai-mara" />
      <DestinationExperienceCarousel destination="laikipia" />
      
      <ConservationPartnersCarousel />
      <ImpactStats />
      <ImpactStories />
    </div>
  );
};

export default Index;
