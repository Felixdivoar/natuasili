import useEmblaCarousel from "embla-carousel-react";
import { PropsWithChildren, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps extends PropsWithChildren {
  className?: string;
  showArrows?: boolean;
}

export default function Carousel({ children, className = "", showArrows = true }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, children]);

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 ml-0">
          {children}
        </div>
      </div>

      {showArrows && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="pointer-events-auto ml-2 bg-background shadow-md hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="pointer-events-auto mr-2 bg-background shadow-md hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}