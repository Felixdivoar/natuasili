import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AppleStyleHeroProps {
  enableCrossFade?: boolean;
  primaryImage?: string;
  secondaryImage?: string;
  enableMobileScrim?: boolean;
}

const AppleStyleHero: React.FC<AppleStyleHeroProps> = ({
  enableCrossFade = true,
  primaryImage = "/lovable-uploads/dff689cd-8df1-4136-b9be-292db031f572.png",
  secondaryImage = "/lovable-uploads/6f27540c-f10d-45f9-ab14-bf5b08197366.png",
  enableMobileScrim = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cross-fade effect every 7 seconds
  useEffect(() => {
    if (!enableCrossFade) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => prev === 0 ? 1 : 0);
    }, 7000);

    return () => clearInterval(interval);
  }, [enableCrossFade]);

  // Load animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const images = [primaryImage, secondaryImage];

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden w-full min-h-[70vh] md:min-h-[78vh] xl:min-h-[92vh] xl:min-h-[max(92vh,720px)]"
    >

      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={index === 0 
                ? "Community ranger bottle-feeding an orphaned elephant at Reteti Elephant Sanctuary" 
                : "Conservation experience in Kenya showcasing wildlife protection efforts"
              }
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
        
        {/* Mobile scrim for text legibility */}
        {enableMobileScrim && (
          <div className="absolute inset-0 bg-black/15 md:bg-transparent" />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center min-h-full px-6 md:px-8 lg:px-16">
        <div className="text-center max-w-[980px] mx-auto">
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

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              {/* Primary CTA */}
              <Link to="/listings">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/95 transition-opacity duration-200 rounded-full px-6 py-3 min-h-[44px] font-medium"
                  style={{ borderRadius: '9999px' }}
                >
                  Explore experiences
                </Button>
              </Link>

              {/* Secondary CTA */}
              <Link to="/impact-ledger">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white transition-colors duration-200 rounded-full px-6 py-3 min-h-[44px] font-medium"
                  style={{ borderRadius: '9999px', borderWidth: '1px' }}
                >
                  Impact Ledger
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppleStyleHero;