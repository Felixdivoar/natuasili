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

  // Auto-slide mobile carousel - only when component is visible
  useEffect(() => {
    if (!isMobile || !experience?.images?.length || experience.images.length <= 1) return;
    
    const interval = setInterval(() => {
      // Check if element is still in viewport before scrolling
      if (!carouselRef.current || document.hidden) return;
      
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % experience.images.length;
        if (carouselRef.current) {
          const width = carouselRef.current.clientWidth;
          carouselRef.current.scrollTo({ left: next * width, behavior: 'smooth' });
        }
        return next;
      });
    }, 5000); // Increased to 5s to reduce CPU usage
    
    return () => clearInterval(interval);
  }, [isMobile, experience?.images?.length]);

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
        {/* Hero Gallery - Option A: Collage Layout */}
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
                
                {/* Mobile Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border-0"
                    onClick={onWishlistClick}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-white text-white' : 'text-white'}`} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border-0"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 text-white" />
                  </Button>
                </div>
                
                {/* Mobile Image Counter */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                    {currentImageIndex + 1} / {experience.images?.length || 0}
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Collage Layout */
              <div className="px-4">
                <div className="grid grid-cols-2 gap-4 h-[560px]">
                  {/* Large Main Image - Left Side */}
                  <div 
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => openSlideshow(0)}
                  >
                    <img 
                      src={experience.images?.[0]} 
                      alt={experience.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Right Side - 2x2 Grid */}
                  <div className="grid grid-rows-2 gap-4">
                    {/* Top Right - 2 images side by side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openSlideshow(1)}
                      >
                        <img 
                          src={experience.images?.[1]} 
                          alt={`${experience.title} - Image 2`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      </div>
                      
                      <div 
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openSlideshow(2)}
                      >
                        <img 
                          src={experience.images?.[2]} 
                          alt={`${experience.title} - Image 3`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      </div>
                    </div>
                    
                    {/* Bottom Right - 2 images side by side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openSlideshow(3)}
                      >
                        <img 
                          src={experience.images?.[3]} 
                          alt={`${experience.title} - Image 4`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      </div>
                      
                      <div 
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openSlideshow(4)}
                      >
                        <img 
                          src={experience.images?.[4] || experience.images?.[0]} 
                          alt={`${experience.title} - Image 5`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                        
                        {/* View All Photos Overlay */}
                        {experience.images && experience.images.length > 5 && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white group-hover:bg-black/80 transition-colors duration-300">
                            <span className="text-2xl mb-1">📷</span>
                            <span className="font-semibold text-lg">View all photos</span>
                            <span className="text-sm opacity-90">+{experience.images.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Action Bar */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 hover:bg-gray-50"
                      onClick={() => openSlideshow(0)}
                    >
                      <span>📸</span>
                      Show all {experience.images?.length || 0} photos
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={onWishlistClick}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                      {isInWishlist ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={handleShare}
                    >
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
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
                <TabsList className="!flex !flex-col sm:!grid sm:grid-cols-4 w-full !h-auto gap-1 sm:gap-2 p-1 bg-muted !items-stretch">
                  <TabsTrigger value="overview" className="w-full justify-center py-3 px-4 text-sm font-medium whitespace-normal data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="w-full justify-center py-3 px-4 text-sm font-medium whitespace-normal data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="included" className="w-full justify-center py-3 px-4 text-sm font-medium whitespace-normal data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    What's Included
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="w-full justify-center py-3 px-4 text-sm font-medium whitespace-normal data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Reviews
                  </TabsTrigger>
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
                    <CardContent className="p-6 space-y-6">
                      {/* Itinerary as flowing paragraph */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Your Experience Journey</h3>
                        <div className="prose prose-gray max-w-none">
                          {contentSections.itinerary && contentSections.itinerary.length > 0 ? (
                            <div className="space-y-4">
                              {contentSections.itinerary.map((item, index) => (
                                <p key={index} className="text-muted-foreground leading-relaxed">
                                  <span className="font-medium text-foreground">{item.title.replace(/Step\s+/i, '')}:</span> {item.description}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed">
                              Your conservation experience begins with an early morning departure from your accommodation, where you will journey to the location with expert briefing from our local guides. 
                              Upon arrival, you will be introduced to the conservation site and begin your hands-on experience with local community members who will share their traditional knowledge and techniques. 
                              Throughout the day, you will participate in meaningful conservation activities while learning about the local ecosystem and wildlife protection efforts. 
                              The experience concludes with reflection time and an opportunity to understand the long-term impact of your contribution to conservation efforts in the region.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* FAQs Section - Moved from What's Included */}
                      {contentSections.faqs && contentSections.faqs.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
                          <div className="space-y-3">
                            {contentSections.faqs.map((faq, index) => (
                              <details key={index} className={`group border border-border rounded-lg ${index === 0 ? 'open' : ''}`} open={index === 0}>
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors">
                                  <span className="font-medium text-sm">{faq.question}</span>
                                  <div className="ml-4 flex-shrink-0 transform group-open:rotate-180 transition-transform duration-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </summary>
                                <div className="px-4 pb-4">
                                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}
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
                      
                      {/* Important Information - Kept in this tab */}
                      {contentSections.importantInfo && contentSections.importantInfo.length > 0 && (
                        <div className="mt-8">
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