import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];

interface EnhancedCarouselProps {
  children: React.ReactNode;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  stopOnInteraction?: boolean;
  showControls?: boolean;
  showDots?: boolean;
  onSlideChange?: (index: number) => void;
}

const EnhancedCarousel = React.forwardRef<HTMLDivElement, EnhancedCarouselProps>(({
  children,
  className,
  autoplay = false,
  autoplayDelay = 4000, // 4 seconds default
  stopOnInteraction = true,
  showControls = true,
  showDots = false,
  onSlideChange,
  ...props
}, ref) => {
  const plugins = React.useMemo(() => {
    const pluginArray = [];
    
    if (autoplay) {
      pluginArray.push(
        Autoplay({ 
          delay: autoplayDelay,
          stopOnInteraction,
          stopOnMouseEnter: true
        })
      );
    }
    
    return pluginArray;
  }, [autoplay, autoplayDelay, stopOnInteraction]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: autoplay,
    align: "start",
    skipSnaps: false,
  }, plugins);

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
    
    if (onSlideChange) {
      onSlideChange(api.selectedScrollSnap());
    }
  }, [onSlideChange]);

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi?.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)} ref={ref} {...props}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {children}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="flex justify-center space-x-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === selectedIndex 
                  ? "bg-primary scale-125" 
                  : "bg-primary/30 hover:bg-primary/50"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

EnhancedCarousel.displayName = "EnhancedCarousel";

// Enhanced Carousel Item
export const EnhancedCarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { basis?: string }
>(({ className, basis = "basis-full", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("min-w-0 shrink-0 grow-0 pl-4", basis, className)}
      {...props}
    >
      {children}
    </div>
  );
});

EnhancedCarouselItem.displayName = "EnhancedCarouselItem";

export default EnhancedCarousel;