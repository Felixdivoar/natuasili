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
        {/* Hero Section - Full Height Gallery */}
        <section className="relative mb-8">
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
                        className="w-full h-80 object-cover cursor-pointer" 
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
              /* Desktop Grid - Full Width & Proper Height */
              <div className="px-4">
                <div className="grid grid-cols-4 gap-3 h-[500px] rounded-lg overflow-hidden">
                  {/* Main large image - spans 2 columns and 2 rows */}
                  <div className="col-span-2 row-span-2 cursor-pointer group" onClick={() => openSlideshow(0)}>
                    <img 
                      src={experience.images?.[0]} 
                      alt={experience.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  {/* Top right image */}
                  <div className="col-span-2 cursor-pointer group" onClick={() => openSlideshow(1)}>
                    <img 
                      src={experience.images?.[1]} 
                      alt={`${experience.title} - Image 2`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  {/* Bottom right - split into 2 smaller images */}
                  <div className="cursor-pointer group relative" onClick={() => openSlideshow(2)}>
                    <img 
                      src={experience.images?.[2]} 
                      alt={`${experience.title} - Image 3`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  <div className="cursor-pointer group relative" onClick={() => openSlideshow(3)}>
                    <img 
                      src={experience.images?.[3] || experience.images?.[2]} 
                      alt={`${experience.title} - Image 4`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {/* Show more images overlay if there are more than 4 */}
                    {experience.images && experience.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium hover:bg-black/70 transition-colors">
                        <span className="text-lg">+{experience.images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Desktop Action Buttons - Outside the gallery */}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={onWishlistClick}>
                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                    {isInWishlist ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openSlideshow(0)}>
                    <span className="mr-2">📷</span>
                    View all {experience.images?.length || 0} photos
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Info - Better spacing from gallery */}
              <div className="space-y-4 mb-8 mt-4">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 w-fit">
                  {experience.themes?.[0]}
                </Badge>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
                      {experience.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                      {experience.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{experience.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isMobile && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {experience.duration || '2-3 hours'}
                      </Badge>
                      {experience.capacity && (
                        <Badge variant="outline" className="px-3 py-1">
                          Max {experience.capacity} people
                        </Badge>
                      )}
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
                      <div className="space-y-4">
                        <div>
                          <p className="text-muted-foreground leading-relaxed">
                            {contentSections.overview || experience.description}
                          </p>
                        </div>
                        
                        {contentSections.highlights && contentSections.highlights.length > 0 && (
                          <div className="mt-6">
                            <h3 className="font-semibold mb-3">Highlights</h3>
                            <ul className="space-y-2">
                              {contentSections.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {contentSections.itinerary && contentSections.itinerary.length > 0 ? (
                          contentSections.itinerary.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          // Default itinerary
                          [
                            {
                              title: "Early Morning Departure",
                              description: "Pick up from your accommodation and journey to the location with expert briefing."
                            },
                            {
                              title: "Experience Begins", 
                              description: "Begin your conservation experience with local guides and community members."
                            },
                            {
                              title: "Hands-On Activities",
                              description: "Participate in conservation activities and learn traditional techniques."
                            }
                          ].map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="included" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3 text-emerald-700">What's Included</h3>
                          <ul className="space-y-2">
                            {contentSections.included && contentSections.included.length > 0 ? (
                              contentSections.included.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))
                            ) : (
                              ['Expert local guide', 'All activities mentioned', 'Transportation', 'Refreshments'].map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3 text-red-700">Not Included</h3>
                          <ul className="space-y-2">
                            {contentSections.notIncluded && contentSections.notIncluded.length > 0 ? (
                              contentSections.notIncluded.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))
                            ) : (
                              ['Personal expenses', 'Travel insurance', 'Accommodation'].map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Important Information & FAQs */}
                      {((contentSections.importantInfo && contentSections.importantInfo.length > 0) || 
                        (contentSections.faqs && contentSections.faqs.length > 0)) && (
                        <div className="mt-8 space-y-6">
                          {contentSections.importantInfo && contentSections.importantInfo.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3 text-orange-700">Important Information</h3>
                              <div className="space-y-2">
                                {contentSections.importantInfo.map((info, index) => (
                                  <div key={index} className="flex gap-2">
                                    <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{info}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {contentSections.faqs && contentSections.faqs.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
                              <div className="space-y-4">
                                {contentSections.faqs.map((faq, index) => (
                                  <div key={index}>
                                    <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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

            {/* Booking Sidebar - Fixed positioning */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 z-10">
                <InlineBookingCard 
                  experience={experience}
                  onBookingClick={onBookingClick}
                />
              </div>
            </div>
          </div>

          {/* Related Experiences - Proper spacing */}
          <div className="mt-16 pt-8 border-t border-border">
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