import React, { useState, useEffect } from "react";
import { DollarSign, Users, Building2 } from "lucide-react";
import { useGlobalImpactMetrics } from "@/hooks/useGlobalImpactMetrics";

interface AppleStyleHeroProps {
  primaryImage?: string;
  enableMobileScrim?: boolean;
}

const AppleStyleHero: React.FC<AppleStyleHeroProps> = ({
  primaryImage = "/lovable-uploads/dff689cd-8df1-4136-b9be-292db031f572.png",
  enableMobileScrim = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { 
    getTotalConservationFunding, 
    getTotalParticipants, 
    getActivePartners,
    loading 
  } = useGlobalImpactMetrics();

  // Load animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden w-full min-h-[70vh] md:min-h-[78vh] xl:min-h-[92vh] xl:min-h-[max(92vh,720px)]"
    >

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={primaryImage}
          alt="Community ranger bottle-feeding an orphaned elephant at Reteti Elephant Sanctuary"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        
        {/* Mobile scrim for text legibility */}
        {enableMobileScrim && (
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between min-h-full px-6 md:px-7 lg:px-12">
        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="text-left max-w-[830px]">
            <div 
              className={`transition-all duration-700 ease-out ${
                isLoaded 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              {/* Headline */}
              <h1 
                className="font-black tracking-tight mb-6 text-white"
                style={{
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
                }}
              >
                Travel that funds conservation
              </h1>

              {/* Subhead */}
              <p 
                className="mb-8 md:mb-10 lg:mb-12 text-white/90 max-w-[780px] leading-relaxed"
                style={{
                  fontSize: 'clamp(16px, 2.2vw, 22px)',
                  maxWidth: '780px'
                }}
              >
                Go beyond the safari. Book conservation-driven experiences that support wildlife and local communities across Kenya. Add them to any itinerary, and make every trip meaningful. Book now.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="pb-8 md:pb-12">
          <div 
            className={`flex flex-wrap justify-start gap-8 md:gap-12 transition-all duration-700 delay-300 ease-out ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-medium min-w-[80px] h-6 flex items-center">
                  {loading ? (
                    <div className="w-16 h-4 bg-white/30 rounded animate-pulse" />
                  ) : (
                    `KES ${getTotalConservationFunding().toLocaleString()}`
                  )}
                </div>
                <div className="text-white/80 text-sm">Conservation funding</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-medium min-w-[60px] h-6 flex items-center">
                  {loading ? (
                    <div className="w-12 h-4 bg-white/30 rounded animate-pulse" />
                  ) : (
                    getTotalParticipants().toLocaleString()
                  )}
                </div>
                <div className="text-white/80 text-sm">Travelers connected</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-medium min-w-[40px] h-6 flex items-center">
                  {loading ? (
                    <div className="w-8 h-4 bg-white/30 rounded animate-pulse" />
                  ) : (
                    `${getActivePartners()}+`
                  )}
                </div>
                <div className="text-white/80 text-sm">Conservation partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppleStyleHero;