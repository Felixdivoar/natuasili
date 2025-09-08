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
        backgroundImage="/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png"
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
