import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import Footer from "@/components/Footer";
import DebugInfo from "@/components/DebugInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DestinationCarousel />
      <ExperienceCarousel />
      <ConservationPartnersCarousel />
      <ImpactStats />
      <ImpactStories />
      <Footer />
      <DebugInfo />
    </div>
  );
};

export default Index;
