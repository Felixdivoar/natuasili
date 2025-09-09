import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, BookOpen } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewSectionProps {
  experienceId: string;
}

const ReviewSection = ({ experienceId }: ReviewSectionProps) => {
  const { reviews, userBooking, canSubmitReview, loading, error, markHelpful, refreshReviews } = useReviews(experienceId);
  const { user } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Unable to load reviews at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const getRatingDistribution = (stars: number) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter(review => review.rating === stars).length;
    return (count / totalReviews) * 100;
  };

  const formatUserName = (review: any) => {
    if (review.profiles?.first_name) {
      const lastName = review.profiles?.last_name ? ` ${review.profiles.last_name.charAt(0)}.` : '';
      return `${review.profiles.first_name}${lastName}`;
    }
    return 'Anonymous User';
  };
  return (
    <div className="space-y-6">
      {/* Review Submission Form - shown only to eligible users */}
      {user && canSubmitReview && userBooking && (
        <ReviewSubmissionForm
          experienceId={experienceId}
          bookingId={userBooking.id}
          onReviewSubmitted={refreshReviews}
        />
      )}

      {/* Instructions for users who can't submit reviews */}
      {user && !canSubmitReview && !userBooking && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Want to leave a review?</p>
                <p className="text-sm text-muted-foreground">
                  Book this experience to share your thoughts and help other travelers make informed decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Reviews & Ratings
            <Badge variant="outline">{totalReviews} reviews</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-8">{stars}★</span>
                      <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${getRatingDistribution(stars)}%` }} 
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {reviews.filter(r => r.rating === stars).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold">Recent reviews</h4>
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{formatUserName(review)}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {review.comment}
                    </p>
                    
                    {user && (
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground"
                          onClick={() => markHelpful(review.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful_count})
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default ReviewSection;