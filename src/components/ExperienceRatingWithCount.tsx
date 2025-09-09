import { Star } from "lucide-react";
import { useExperienceRating } from "@/hooks/useExperienceRating";

interface ExperienceRatingWithCountProps {
  experienceId: string;
}

export default function ExperienceRatingWithCount({ experienceId }: ExperienceRatingWithCountProps) {
  const { averageRating, totalReviews, loading } = useExperienceRating(experienceId);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="w-8 h-4 bg-muted rounded animate-pulse" />
        <div className="w-20 h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  // Don't show rating if there are no reviews
  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < Math.floor(averageRating)
                ? "fill-warning text-warning"
                : "text-muted-foreground"
            }`} 
          />
        ))}
      </div>
      <span className="font-medium">{averageRating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">
        ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
      </span>
    </div>
  );
}