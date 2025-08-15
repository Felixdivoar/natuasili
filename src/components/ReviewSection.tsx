import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful_count: number;
}

const mockReviews: Review[] = [
  {
    id: "1",
    user_name: "Sarah M.",
    rating: 5,
    comment: "Absolutely incredible experience! The guides were knowledgeable and passionate about conservation. Seeing the elephants in their natural habitat was life-changing. Highly recommend!",
    date: "2024-03-10",
    verified: true,
    helpful_count: 12
  },
  {
    id: "2", 
    user_name: "David R.",
    rating: 5,
    comment: "Amazing day tracking elephants. The team really knows their stuff and you can see the impact of conservation work firsthand. Worth every penny!",
    date: "2024-03-08",
    verified: true,
    helpful_count: 8
  },
  {
    id: "3",
    user_name: "Maria L.",
    rating: 4,
    comment: "Great experience overall. Well organized and educational. Only minor issue was the transportation was a bit late, but the guides made up for it with their enthusiasm.",
    date: "2024-03-05",
    verified: true,
    helpful_count: 5
  }
];

interface ReviewSectionProps {
  experienceId: string;
}

const ReviewSection = ({ experienceId }: ReviewSectionProps) => {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const totalReviews = mockReviews.length;

  const getRatingDistribution = (stars: number) => {
    const count = mockReviews.filter(review => review.rating === stars).length;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Reviews & Ratings
            <Badge variant="outline">{totalReviews} reviews</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${getRatingDistribution(stars)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {mockReviews.filter(r => r.rating === stars).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <h4 className="font-semibold">Recent Reviews</h4>
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user_name}</span>
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
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {review.comment}
                </p>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful_count})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;