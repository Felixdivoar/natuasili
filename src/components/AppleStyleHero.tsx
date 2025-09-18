import React, { useState, useEffect } from "react";

interface AppleStyleHeroProps {
  primaryImage?: string;
  enableMobileScrim?: boolean;
}

const AppleStyleHero: React.FC<AppleStyleHeroProps> = ({
  primaryImage = "/lovable-uploads/dff689cd-8df1-4136-b9be-292db031f572.png",
  enableMobileScrim = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

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
          <div className="absolute inset-0 bg-black/15 md:bg-transparent" />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center min-h-full px-6 md:px-7 lg:px-12">
        <div className="text-center max-w-[830px] mx-auto">
          {/* Main Content with Load Animation */}
          <div 
            className={`transition-all duration-700 ease-out ${
              isLoaded 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
            }`}
          >
            {/* Headline */}
            <h1 
              className="font-black tracking-tight mb-6 text-black"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Go beyond the safari
            </h1>

            {/* Subhead */}
            <p 
              className="mb-8 md:mb-10 lg:mb-12 text-black/70 max-w-[780px] mx-auto leading-relaxed"
              style={{
                fontSize: 'clamp(16px, 2.2vw, 22px)',
                maxWidth: '780px'
              }}
            >
              Support wildlife and communities in Kenya through conservation-driven experiences. 
              Add them to your itinerary and make your travel more meaningful.
            </p>

            {/* Real-time Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-black">150+</div>
                <div className="text-xs md:text-sm text-black/70">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-black">25K+</div>
                <div className="text-xs md:text-sm text-black/70">Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-black">$2M+</div>
                <div className="text-xs md:text-sm text-black/70">Funding</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-black">50+</div>
                <div className="text-xs md:text-sm text-black/70">Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppleStyleHero;