import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="landing-hero pb-10">
        <Hero />
      </div>
      <DestinationCarousel />
      <ExperienceCarousel />
      <ConservationPartnersCarousel />
      <ImpactStats />
      <ImpactStories />
      <Footer />
      
    </div>
  );
};

export default Index;
