import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { EXPERIENCES } from "@/data/partners";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, Info, MapPin, Star, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bookingStarted, setBookingStarted] = useState(false);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t } = useI18n();

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
        setReviewStats({ averageRating: 0, totalReviews: 0 });
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('experience_id', experienceId);

      if (error) throw error;
      
      const totalReviews = data?.length || 0;
      const averageRating = totalReviews > 0 
        ? data.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setReviewStats({ averageRating, totalReviews });
    } catch (err) {
      console.error('Error fetching review stats:', err);
      setReviewStats({ averageRating: 0, totalReviews: 0 });
    }
  };

  // Set up real-time subscription for review stats
  useEffect(() => {
    if (!experience?.id) return;

    // Initial fetch
    fetchReviewStats(experience.id);

    // Skip real-time subscription for non-UUID IDs
    if (!isValidUUID(experience.id)) {
      return;
    }

    // Set up real-time subscription
    const statsSubscription = supabase
      .channel('review-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `experience_id=eq.${experience.id}`,
        },
        () => fetchReviewStats(experience.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsSubscription);
    };
  }, [experience?.id]);

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
          <p className="text-muted-foreground mb-6">The experience you're looking for doesn't exist.</p>
          <Link to="/marketplace">
            <Button>Browse All Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Set up intersection observer for sticky header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Navigation functions for image carousel
  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === experience.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? experience.images.length - 1 : prev - 1
    );
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
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookNowClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      scrollToAvailability();
      openBookingModal();
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

  const defaultItinerary = [
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
  ];

  const itinerary = contentSections.itinerary.length > 0 ? contentSections.itinerary : defaultItinerary;

  return (
    <CartProvider 
      experienceSlug={experience.slug} 
      basePrice={experience.priceKESAdult || 350}
      childHalfPriceRule={experience.childHalfPriceRule || false}
      isGroupPricing={false}
      minCapacity={1}
    >
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative" ref={heroRef}>
          <div className="max-w-[1200px] mx-auto px-4">
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
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {experience.title}
                </h1>
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

            {/* Image Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-2 h-[400px]">
                {/* Main large image */}
                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden cursor-pointer" onClick={() => openSlideshow(0)}>
                  <img 
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
                
                {/* Smaller images grid */}
                {experience.images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index + 1} 
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openSlideshow(index + 1)}
                  >
                    <img 
                      src={image}
                      alt={`${experience.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
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
            </div>
          </div>
        </section>

        {/* Availability and Options */}
        <section className="bg-card border-t border-b">
          <div 
            className="max-w-[1200px] mx-auto px-4 py-6"
            id="availability-section"
          >
            <AvailabilityAndOptions
              experience={{
                ...experience,
                base_price: experience.priceKESAdult,
                capacity: 15,
                childHalfPriceRule: experience.childHalfPriceRule || false
              }} 
              onBookingStart={() => {
                setBookingStarted(true);
                openBookingModal();
              }}
              onBookingModalOpen={openBookingModal}
              onUpdateParams={updateBookingParams}
              initialParams={{
                date: searchParams.get('date') || '',
                adults: parseInt(searchParams.get('adults') || '1'),
                children: parseInt(searchParams.get('children') || '0'),
                option: (searchParams.get('option') as 'standard') || 'standard'
              }}
            />
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>{contentSections.overview}</p>
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Highlights</h2>
              <ul className="space-y-3">
                {contentSections.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What's Included/Not Included */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {contentSections.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {contentSections.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* What to Expect */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">What to Expect</h2>
              <Accordion type="single" collapsible defaultValue="itinerary" className="w-full">
                <AccordionItem value="itinerary">
                  <AccordionTrigger>Itinerary & Cancellation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {itinerary.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                      {contentSections.cancellation && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">Cancellation Policy</h4>
                          <p className="text-muted-foreground">{contentSections.cancellation}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>


            {/* Frequently Asked Questions */}
            {contentSections.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
                  {contentSections.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Important Information */}
            {contentSections.importantInfo && contentSections.importantInfo.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Important Information</h2>
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {contentSections.importantInfo.map((info, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{info}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Where You'll Be */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Where You'll Be</h2>
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">{experience.locationText}</span>
                </div>
                <GoogleMap
                  location={experience.locationText || "Experience Location"}
                  coordinates={getExperienceCoordinates(experience.description)}
                  height="h-64"
                  googleMapsUrl={experience.googleMapsUrl}
                />
              </div>
            </section>

            {/* Related Experiences */}
            <section>
              <RelatedExperiences
                currentExperienceId={parseInt(experience.id.replace('exp-', ''))} 
                theme={experience.themes[0]} 
                destination={experience.destination} 
                maxResults={5} 
              />
            </section>

            {/* Reviews & Ratings */}
            <section>
              <ReviewSection experienceId={experience.id} />
            </section>
          </div>
        </div>

        {/* Sticky Reserve Button */}
        {stickyVisible && !isBookingModalOpen && (
          <>
            {/* Desktop sticky bar */}
            <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
              <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
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
            <StickyReserveButton 
              experienceSlug={experience.slug}
              experienceName={experience.title}
              basePrice={experience.priceKESAdult}
              onReserveClick={handleBookNowClick}
            />
          </>
        )}

        {/* Auth Modal */}
        {isAuthModalOpen && (
          <NewAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {/* Booking Modal */}
        {isBookingModalOpen && user && (
          <BookingWizardNew
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            experience={experience}
          />
        )}

        {/* Image Slideshow */}
        <ImageSlideshow
          images={experience.images}
          isOpen={isSlideshowOpen}
          onClose={closeSlideshowModal}
          initialIndex={slideshowIndex}
          altText={experience.title}
        />
      </div>
    </CartProvider>
  );
}