import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LoadingSkeleton from './LoadingSkeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
  errorFallback?: string;
  skeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = ({
  src,
  alt,
  className,
  loadingClassName,
  errorFallback = '/placeholder.svg',
  skeleton = true,
  onLoad,
  onError,
  ...props
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Loading Skeleton */}
      {isLoading && skeleton && (
        <div className={cn("absolute inset-0", loadingClassName)}>
          <LoadingSkeleton variant="image" className="w-full h-full" />
        </div>
      )}

      {/* Actual Image */}
      {isIntersecting && (
        <img
          ref={imgRef}
          src={hasError ? errorFallback : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default LazyImage;