import { Star } from "lucide-react";
import { useExperienceRating } from "@/hooks/useExperienceRating";

interface ExperienceRatingDisplayProps {
  experienceId: string;
  className?: string;
}

export default function ExperienceRatingDisplay({ 
  experienceId, 
  className = "flex items-center gap-1 text-xs" 
}: ExperienceRatingDisplayProps) {
  const { averageRating, totalReviews, loading } = useExperienceRating(experienceId);

  if (loading) {
    return (
      <div className={className}>
        <div className="w-3 h-3 bg-muted rounded animate-pulse" />
        <div className="w-6 h-3 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  // Don't show rating if there are no reviews
  if (totalReviews === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Star className="h-3 w-3 fill-primary text-primary" />
      <span className="font-medium">{averageRating.toFixed(1)}</span>
    </div>
  );
}