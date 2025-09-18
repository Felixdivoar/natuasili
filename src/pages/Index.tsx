import AppleStyleHero from "@/components/AppleStyleHero";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import DestinationExperienceCarousel from "@/components/DestinationExperienceCarousel";
import SmartRecommendations from "@/components/SmartRecommendations";

const Index = () => {
  return (
    <div className="bg-background">
      {/* Apple-style Hero Section */}
      <AppleStyleHero 
        primaryImage="/lovable-uploads/dff689cd-8df1-4136-b9be-292db031f572.png"
        enableMobileScrim={true}
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
      
      {/* Conservation Partners section is now hidden by default */}
      <ImpactStats />
      <ImpactStories />
    </div>
  );
};

export default Index;
