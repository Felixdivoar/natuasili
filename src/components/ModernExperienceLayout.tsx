import React, { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Clock, Users, Heart, Share, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import InlineBookingCard from "./InlineBookingCard";
import GoogleMap from "./GoogleMap";
import ReviewSection from "./ReviewSection";
import RelatedExperiences from "./RelatedExperiences";
import { parseExperienceContent } from "./ExperienceDetailParsing";
import ImageSlideshow from "./ImageSlideshow";
import { getExperienceCoordinates } from "@/utils/locationUtils";

interface ModernExperienceLayoutProps {
  experience: any;
  reviewStats: any;
  isInWishlist: boolean;
  onWishlistClick: () => void;
  onBookingClick: () => void;
}

const ModernExperienceLayout: React.FC<ModernExperienceLayoutProps> = ({
  experience,
  reviewStats,
  isInWishlist,
  onWishlistClick,
  onBookingClick
}) => {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const coordinates = getExperienceCoordinates(experience.locationText);

  const openSlideshow = (index: number) => {
    setSlideshowIndex(index);
    setIsSlideshowOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: experience.title,
        text: `Check out this amazing experience: ${experience.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const contentSections = parseExperienceContent(experience.description);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Image Carousel */}
            {isMobile ? (
              <div className="relative">
                <div 
                  ref={carouselRef}
                  className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
                >
                  {experience.images && Array.isArray(experience.images) && experience.images.map((image: string, index: number) => (
                    <div 
                      key={index} 
                      className="w-full flex-shrink-0 snap-center"
                      onClick={() => openSlideshow(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${experience.title} - Image ${index + 1}`} 
                        className="w-full h-64 object-cover cursor-pointer" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm"
                    onClick={onWishlistClick}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-white text-white' : 'text-white'}`} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Desktop Grid */
              <div className="grid grid-cols-3 gap-2 h-80 px-4">
                <div className="col-span-2 rounded-lg overflow-hidden cursor-pointer" onClick={() => openSlideshow(0)}>
                  <img 
                    src={experience.images?.[0]} 
                    alt={experience.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="grid grid-rows-2 gap-2">
                  {experience.images?.slice(1, 3).map((image: string, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden cursor-pointer" onClick={() => openSlideshow(index + 1)}>
                      <img 
                        src={image} 
                        alt={`${experience.title} - ${index + 2}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 w-fit">
                  {experience.themes?.[0]}
                </Badge>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                      {experience.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{experience.locationText}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : 'New'}
                        </span>
                        <span>({reviewStats.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isMobile && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={onWishlistClick}>
                        <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="included">What's Included</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <ReviewSection experienceId={experience.id} />
                </TabsContent>
              </Tabs>

              {/* Map Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Location</h3>
                  <div className="h-64 w-full rounded-lg overflow-hidden">
                    <GoogleMap 
                      location={experience.locationText}
                      coordinates={coordinates}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <InlineBookingCard 
                  experience={experience}
                  onBookingClick={onBookingClick}
                />
              </div>
            </div>
          </div>

          {/* Related Experiences */}
          <div className="mt-12">
            <RelatedExperiences 
              currentExperienceId={experience.id}
              theme={experience.themes?.[0] || 'wildlife'}
              destination={experience.locationText || 'Kenya'}
            />
          </div>
        </div>
      </div>

      {/* Image Slideshow Modal */}
      <ImageSlideshow
        images={experience.images || []}
        isOpen={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
        initialIndex={slideshowIndex}
      />
    </>
  );
};

export default ModernExperienceLayout;