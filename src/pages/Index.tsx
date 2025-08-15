import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedExperiences from "@/components/FeaturedExperiences";
import ConservationProjects from "@/components/ConservationProjects";
import ImpactStats from "@/components/ImpactStats";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedExperiences />
      <ConservationProjects />
      <ImpactStats />
      <Footer />
    </div>
  );
};

export default Index;
