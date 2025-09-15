import Hero from "@/components/Hero";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import DestinationExperienceCarousel from "@/components/DestinationExperienceCarousel";
import SmartRecommendations from "@/components/SmartRecommendations";

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
      
      {/* Smart Recommendations Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <SmartRecommendations />
        </div>
      </section>
      
      <ConservationPartnersCarousel />
      <ImpactStats />
      <ImpactStories />
    </div>
  );
};

export default Index;
