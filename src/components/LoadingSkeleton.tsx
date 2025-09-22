import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle" | "image";
  lines?: number;
  animate?: boolean;
}

const LoadingSkeleton = ({ 
  className, 
  variant = "default",
  lines = 1,
  animate = true 
}: LoadingSkeletonProps) => {
  const baseClasses = cn(
    "bg-muted",
    animate && "animate-pulse",
    className
  );

  if (variant === "card") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className={cn("h-4 bg-muted rounded", animate && "animate-pulse")} />
        <div className={cn("h-4 bg-muted rounded w-3/4", animate && "animate-pulse")} />
        <div className={cn("h-4 bg-muted rounded w-1/2", animate && "animate-pulse")} />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-muted rounded",
              animate && "animate-pulse",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div className={cn("rounded-full bg-muted", baseClasses)} />
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("bg-muted rounded-lg aspect-video", baseClasses)} />
    );
  }

  return (
    <div className={cn("h-4 bg-muted rounded", baseClasses)} />
  );
};

// Specialized skeleton components for common use cases
export const ExperienceCardSkeleton = () => (
  <div className="space-y-4 p-4 border rounded-lg">
    <LoadingSkeleton variant="image" className="h-48" />
    <LoadingSkeleton variant="text" lines={2} />
    <div className="flex justify-between">
      <LoadingSkeleton className="h-6 w-20" />
      <LoadingSkeleton className="h-6 w-16" />
    </div>
  </div>
);

export const PartnerCardSkeleton = () => (
  <div className="space-y-3 p-4 border rounded-lg">
    <LoadingSkeleton variant="circle" className="h-16 w-16 mx-auto" />
    <LoadingSkeleton variant="text" lines={3} />
    <LoadingSkeleton className="h-8 w-24 mx-auto" />
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="space-y-3 p-4 border rounded-lg">
    <LoadingSkeleton variant="image" className="h-32" />
    <LoadingSkeleton variant="text" lines={2} />
    <div className="flex justify-between items-center">
      <LoadingSkeleton className="h-4 w-20" />
      <LoadingSkeleton className="h-4 w-16" />
    </div>
  </div>
);

export default LoadingSkeleton;