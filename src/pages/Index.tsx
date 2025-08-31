import Hero from "@/components/Hero";
import QuickDiscovery from "@/components/QuickDiscovery";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import TrustTransparency from "@/components/TrustTransparency";
import ImpactStories from "@/components/ImpactStories";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FooterCTA from "@/components/FooterCTA";

const Index = () => {
  return (
    <div className="bg-background">
      <Hero />
      <QuickDiscovery />
      <ExperienceCarousel />
      <TrustTransparency />
      <ImpactStories />
      <ConservationPartnersCarousel />
      <HowItWorks />
      <Testimonials />
      <FooterCTA />
    </div>
  );
};

export default Index;
