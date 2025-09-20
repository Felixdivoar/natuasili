import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { EXPERIENCES } from "@/data/partners";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, Info, MapPin, Star, Users, Clock, ChevronLeft, ChevronRight, Heart, Share, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import DynamicTranslated from "@/i18n/DynamicTranslated";
import { parseExperienceContent } from "@/components/ExperienceDetailParsing";
import { CartProvider } from "@/contexts/CartContext";
import AvailabilityAndOptions from "@/components/AvailabilityAndOptions";
import GoogleMap from "@/components/GoogleMap";
import RelatedExperiences from "@/components/RelatedExperiences";
import ReviewSection from "@/components/ReviewSection";
import StickyReserveButton from "@/components/StickyReserveButton";
import NewAuthModal from "@/components/NewAuthModal";
import BookingWizardNew from "@/components/BookingWizardNew";
import ImageSlideshow from "@/components/ImageSlideshow";
import { useAuth } from "@/contexts/AuthContext";
import { getExperienceCoordinates } from "@/utils/locationUtils";
import { useI18n } from "@/i18n/I18nProvider";
import T from "@/i18n/T";
import { supabase } from "@/integrations/supabase/client";
export default function ExperienceDetail() {
  const {
    slug
  } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bookingStarted, setBookingStarted] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    user
  } = useAuth();
  const {
    t
  } = useI18n();
  const experience = EXPERIENCES.find(exp => exp.slug === slug);

  // Helper function to validate UUID format
  const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Fetch real-time review stats for header
  const fetchReviewStats = async (experienceId: string) => {
    try {
      if (!isValidUUID(experienceId)) {
        setReviewStats({
          averageRating: 0,
          totalReviews: 0
        });
        return;
      }
      const {
        data,
        error
      } = await supabase.from('reviews').select('rating').eq('experience_id', experienceId);
      if (error) throw error;
      const totalReviews = data?.length || 0;
      const averageRating = totalReviews > 0 ? data.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
      setReviewStats({
        averageRating,
        totalReviews
      });
    } catch (err) {
      console.error('Error fetching review stats:', err);
      setReviewStats({
        averageRating: 0,
        totalReviews: 0
      });
    }
  };

  // Check if experience is in wishlist
  const checkWishlistStatus = async (experienceId: string) => {
    if (!user || !experienceId) return;
    try {
      const {
        data
      } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('experience_id', experienceId).maybeSingle();
      setIsInWishlist(!!data);
    } catch (error) {
      // Not in wishlist or error occurred
      setIsInWishlist(false);
    }
  };

  // Set up real-time subscription for review stats
  useEffect(() => {
    if (!experience?.id) return;

    // Initial fetch
    fetchReviewStats(experience.id);
    checkWishlistStatus(experience.id);

    // Skip real-time subscription for non-UUID IDs
    if (!isValidUUID(experience.id)) {
      return;
    }

    // Set up real-time subscription
    const statsSubscription = supabase.channel('review-stats-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'reviews',
      filter: `experience_id=eq.${experience.id}`
    }, () => fetchReviewStats(experience.id)).subscribe();
    return () => {
      supabase.removeChannel(statsSubscription);
    };
  }, [experience?.id, user]);
  if (!experience) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
          <p className="text-muted-foreground mb-6">The experience you're looking for doesn't exist.</p>
          <Link to="/marketplace">
            <Button>Browse All Experiences</Button>
          </Link>
        </div>
      </div>;
  }

  // Set up intersection observer for sticky header
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), {
      threshold: 0
    });
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto-slide mobile carousel every 2 seconds
  useEffect(() => {
    if (!isMobile) return;
    if (!experience?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % experience.images.length;
        if (carouselRef.current) {
          const width = carouselRef.current.clientWidth;
          carouselRef.current.scrollTo({ left: next * width, behavior: 'smooth' });
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isMobile, experience?.images?.length]);

  // Navigation functions for image carousel
  const nextImage = () => {
    setSelectedImageIndex(prev => prev === experience.images.length - 1 ? 0 : prev + 1);
  };
  const prevImage = () => {
    setSelectedImageIndex(prev => prev === 0 ? experience.images.length - 1 : prev - 1);
  };

  // Slideshow functions
  const openSlideshow = (index: number) => {
    setSlideshowIndex(index);
    setIsSlideshowOpen(true);
  };
  const closeSlideshowModal = () => {
    setIsSlideshowOpen(false);
  };

  // Booking and navigation functions
  const updateBookingParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };
  const scrollToAvailability = () => {
    const element = document.getElementById('availability-section');
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };
  const handleBookNowClick = () => {
    scrollToAvailability();
    openBookingModal();
  };
  const handleWishlistClick = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!experience?.id) return;
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const {
          error
        } = await supabase.from('wishlists').delete().eq('user_id', user.id).eq('experience_id', experience.id);
        if (!error) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const {
          error
        } = await supabase.from('wishlists').insert({
          user_id: user.id,
          experience_id: experience.id
        });
        if (!error) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Helper functions
  const getThemeSlug = (theme: string): string => {
    return theme.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  const getThemeColor = (theme: string) => {
    const lowerTheme = theme.toLowerCase();
    if (lowerTheme.includes('wildlife')) {
      return 'bg-success/20 text-success-foreground border-success/30';
    }
    if (lowerTheme.includes('education')) {
      return 'bg-info/20 text-info-foreground border-info/30';
    }
    if (lowerTheme.includes('community') || lowerTheme.includes('cultural')) {
      return 'bg-accent/20 text-accent-foreground border-accent/30';
    }
    return 'bg-muted text-muted-foreground';
  };
  const contentSections = parseExperienceContent(experience.description);
  const defaultItinerary = [{
    title: "Early Morning Departure",
    description: "Pick up from your accommodation and journey to the location with expert briefing."
  }, {
    title: "Experience Begins",
    description: "Begin your conservation experience with local guides and community members."
  }, {
    title: "Hands-On Activities",
    description: "Participate in conservation activities and learn traditional techniques."
  }];
  const itinerary = contentSections.itinerary.length > 0 ? contentSections.itinerary : defaultItinerary;
  return <CartProvider experienceSlug={experience.slug} basePrice={experience.priceKESAdult || 350} childHalfPriceRule={experience.childHalfPriceRule || false} isGroupPricing={false} minCapacity={1}>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative" ref={heroRef}>
          <div className="max-w-[1300px] mx-auto px-4">
            {/* Header Info */}
            <div className="py-6 space-y-4">
              {/* Theme chip */}
              <div>
                <Link to={`/themes/${getThemeSlug(experience.themes[0])}`} className="inline-block">
                  <Badge className={`${getThemeColor(experience.themes[0])} hover:opacity-80 transition-opacity cursor-pointer capitalize`}>
                    {experience.themes[0]}
                  </Badge>
                </Link>
              </div>

              {/* Title and location */}
              <div>
                {/* Title with Action Buttons */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="experience-title-forced-v2 text-foreground flex-1" style={{ fontSize: '1.25rem', fontWeight: '400', lineHeight: '1.75rem' }}>
                    {experience.title}
                  </h1>
                  
                  {/* Action Buttons - Desktop Only */}
                  {!isMobile && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200" onClick={handleWishlistClick}>
                        <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-black text-black' : ''}`} />
                        <span className="sr-only">{isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
                      </Button>
                      
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200" onClick={() => {
                        // Share functionality
                        if (navigator.share) {
                          navigator.share({
                            title: experience.title,
                            text: `Check out this amazing experience: ${experience.title}`,
                            url: window.location.href
                          });
                        } else {
                          // Fallback: Copy to clipboard
                          navigator.clipboard.writeText(window.location.href);
                          toast("Link copied to clipboard!");
                        }
                      }}>
                        <Share className="h-4 w-4" />
                        <span className="sr-only">Share experience</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{experience.locationText}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">
                      {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : 'New'}
                    </span>
                    <span className="text-sm">
                      ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery - Responsive */}
            <div className="mb-8">
              {isMobile ? (
                /* Mobile Carousel - Full Width */
                <div className="relative -mx-4">
                  <div ref={carouselRef} 
                    className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={(e) => {
                      const scrollLeft = e.currentTarget.scrollLeft;
                      const itemWidth = e.currentTarget.clientWidth;
                      const newIndex = Math.round(scrollLeft / itemWidth);
                      setCurrentImageIndex(newIndex);
                    }}
                  >
                    {experience.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="w-full flex-shrink-0 snap-center"
                        onClick={() => openSlideshow(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${experience.title} - Image ${index + 1}`} 
                          className="w-full h-[300px] object-cover cursor-pointer" 
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons - Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10 carousel-actions">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200 na-icon-btn" 
                      onClick={handleWishlistClick}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-foreground text-foreground' : ''}`} />
                      <span className="sr-only">{isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200 na-icon-btn" 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: experience.title,
                            text: `Check out this amazing experience: ${experience.title}`,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast("Link copied to clipboard!");
                        }
                      }}
                    >
                      <Share className="h-4 w-4" />
                      <span className="sr-only">Share experience</span>
                    </Button>
                  </div>

                  {/* Dots removed on mobile; auto-sliding enabled */}
                </div>
              ) : (
                /* Desktop Grid */
                <div className="grid grid-cols-4 gap-2 h-[400px]">
                  {/* Main large image */}
                  <div className="col-span-2 row-span-2 rounded-xl overflow-hidden cursor-pointer" onClick={() => openSlideshow(0)}>
                    <img src={experience.images[0]} alt={experience.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                  </div>
                  
                  {/* Smaller images grid */}
                  {experience.images.slice(1, 5).map((image, index) => (
                    <div key={index + 1} className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openSlideshow(index + 1)}>
                      <img src={image} alt={`${experience.title} - Image ${index + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                      {/* Show +X more indicator on last visible image if there are more images */}
                      {index === 3 && experience.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            +{experience.images.length - 5} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Availability and Options */}
        <section className="bg-card border-t border-b">
          <div className="max-w-[1300px] mx-auto px-4 py-6" id="availability-section">
            <AvailabilityAndOptions experience={{
            ...experience,
            base_price: experience.priceKESAdult,
            capacity: 15,
            childHalfPriceRule: experience.childHalfPriceRule || false
          }} onBookingStart={() => {
            setBookingStarted(true);
            openBookingModal();
          }} onBookingModalOpen={openBookingModal} onUpdateParams={updateBookingParams} initialParams={{
            date: searchParams.get('date') || '',
            adults: parseInt(searchParams.get('adults') || '1'),
            children: parseInt(searchParams.get('children') || '0'),
            option: searchParams.get('option') as 'standard' || 'standard'
          }} />
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-base font-normal text-foreground mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-base !font-light">{contentSections.overview}</p>
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-base font-normal text-foreground mb-6">Highlights</h2>
              <ul className="space-y-3">
                {contentSections.highlights.map((highlight, index) => <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground !font-light">{highlight}</span>
                  </li>)}
              </ul>
            </section>

            {/* What's Included/Not Included */}
            <section>
              <h2 className="text-base font-normal text-foreground mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-6 font-light">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {contentSections.included.map((item, index) => <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground font-light">{item}</span>
                      </li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {contentSections.notIncluded.map((item, index) => <li key={index} className="flex items-start gap-3">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground font-light">{item}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
            </section>

            {/* What to Expect */}
            <section>
              <h2 className="text-base font-normal text-foreground mb-6">What to expect</h2>
              <Accordion type="single" collapsible defaultValue="itinerary" className="w-full">
                <AccordionItem value="itinerary">
                  <AccordionTrigger>Itinerary</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-base text-muted-foreground !font-light leading-relaxed">
                        {itinerary.map((item, index) => {
                        const description = item.description;
                        const isLast = index === itinerary.length - 1;
                        const isFirst = index === 0;
                        if (isFirst) {
                          return description;
                        } else if (isLast) {
                          return ` Following this, ${description.toLowerCase()}`;
                        } else {
                          return ` Next, ${description.toLowerCase()}`;
                        }
                      }).join('')}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {contentSections.cancellation && <AccordionItem value="cancellation">
                    <AccordionTrigger>Cancellation policy</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base text-muted-foreground !font-light">{contentSections.cancellation}</p>
                    </AccordionContent>
                  </AccordionItem>}
              </Accordion>
            </section>


            {/* Frequently Asked Questions */}
            {contentSections.faqs.length > 0 && <section>
                <h2 className="text-base font-normal text-foreground mb-6">Frequently asked questions</h2>
                <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
                  {contentSections.faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-base !font-light">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground font-light">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
              </section>}

            {/* Important Information */}
            {contentSections.importantInfo && contentSections.importantInfo.length > 0 && <section>
                <h2 className="text-base font-normal text-foreground mb-6">Important Information</h2>
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {contentSections.importantInfo.map((info, index) => <li key={index} className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground font-light">{info}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>
              </section>}

            {/* Where You'll Be */}
            <section>
              <h2 className="text-base font-normal text-foreground mb-6">Where you'll be</h2>
              <div className="bg-gradient-to-br from-card via-card to-card/80 border rounded-2xl overflow-hidden shadow-sm">
                {/* Location Header */}
                <div className="p-6 pb-4 border-b border-border/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{experience.locationText}</h3>
                          <p className="text-sm text-muted-foreground">Experience location</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
                    const [lat, lng] = getExperienceCoordinates(experience.description) || [-1.2921, 36.7378];
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const url = isMobile ? `maps://maps.google.com/maps?daddr=${lat},${lng}&dirflg=d` : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
                    window.open(url, '_blank');
                  }}>
                      <ExternalLink className="h-4 w-4" />
                      Get directions
                    </Button>
                  </div>
                </div>
                
                {/* Map Container */}
                <div className="relative">
                  <GoogleMap location={experience.locationText || "Experience Location"} coordinates={getExperienceCoordinates(experience.description)} height="h-72" googleMapsUrl={experience.googleMapsUrl} />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/5 via-transparent to-transparent" />
                </div>
                
                {/* Location Details */}
                <div className="p-6 pt-4 bg-muted/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      📍 Exact location provided after booking
                    </span>
                    <span className="text-muted-foreground">
                      🕒 Activity duration varies
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Experiences */}
            <section>
              <RelatedExperiences currentExperienceId={parseInt(experience.id.replace('exp-', ''))} theme={experience.themes[0]} destination={experience.destination} maxResults={5} />
            </section>

            {/* Reviews & Ratings */}
            <section>
              <ReviewSection experienceId={experience.id} />
            </section>
          </div>
        </div>

        {/* Sticky Reserve Button */}
        {stickyVisible && !isBookingModalOpen && <>
            {/* Desktop sticky bar */}
            <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
              <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-foreground">{experience.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-bold text-lg">KES {experience.priceKESAdult.toLocaleString()}</div>
                  </div>
                  <Button onClick={handleBookNowClick} size="lg">
                    Reserve Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile sticky button */}
            <StickyReserveButton experienceSlug={experience.slug} experienceName={experience.title} basePrice={experience.priceKESAdult} onReserveClick={handleBookNowClick} />
          </>}

        {/* Auth Modal */}
        {isAuthModalOpen && <NewAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}

        {/* Booking Modal - Available for both guests and logged-in users */}
        {isBookingModalOpen && <BookingWizardNew isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} experience={experience} />}

        {/* Image Slideshow */}
        <ImageSlideshow images={experience.images} isOpen={isSlideshowOpen} onClose={closeSlideshowModal} initialIndex={slideshowIndex} altText={experience.title} />
      </div>
    </CartProvider>;
}