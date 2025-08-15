import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DestinationCarousel from "@/components/DestinationCarousel";
import ThemeCarousel from "@/components/ThemeCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import ConservationProjects from "@/components/ConservationProjects";
import ImpactStats from "@/components/ImpactStats";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DestinationCarousel />
      <ThemeCarousel />
      <ExperienceCarousel />
      <ConservationProjects />
      <ImpactStats />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
