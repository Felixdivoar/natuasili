import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DestinationCarousel from "@/components/DestinationCarousel";
import ThemeTabs from "@/components/ThemeTabs";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DestinationCarousel />
      <ThemeTabs />
      <ExperienceCarousel />
      <ConservationPartnersCarousel />
      <ImpactStats />
      <Footer />
    </div>
  );
};

export default Index;
