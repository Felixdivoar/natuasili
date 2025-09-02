import HeaderMega from "@/components/HeaderMega";
import Hero from "@/components/Hero";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import ConservationPartnersCarousel from "@/components/ConservationPartnersCarousel";
import ImpactStats from "@/components/ImpactStats";
import ImpactStories from "@/components/ImpactStories";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background">
      {/* Use full-width hero */}
      <section className="hero-full bg-cover bg-center" style={{
        backgroundImage: "url(/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png)"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent"></div>
        <Hero />
      </section>
      <DestinationCarousel />
      <ExperienceCarousel />
      <ConservationPartnersCarousel />
      <ImpactStats />
      <ImpactStories />
    </div>
  );
};

export default Index;
