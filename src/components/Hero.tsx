import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TreePine, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-conservation.jpg";
import { useCurrency } from "@/contexts/CurrencyContext";

const Hero = () => {
  const { formatPrice } = useCurrency();
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Conservation Through
            <span className="text-accent block">Authentic Experiences</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Connect with Kenya's conservation heroes. Join authentic experiences that protect wildlife, 
            empower communities, and create lasting impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/browse">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Explore Experiences
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-foreground">
              Become a Partner
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-wildlife rounded-full flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-white/80">Conservation Projects</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-livelihoods rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">2,500+</div>
                <div className="text-sm text-white/80">Travelers Connected</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-education rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatPrice(580000)}</div>
                <div className="text-sm text-white/80">Impact Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;