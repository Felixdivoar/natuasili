import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Clock, Star, Heart, Share, ChevronLeft, ChevronRight, Camera, CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import MapComponent from "@/components/MapComponent";
import ResponsiveBookingForm from "@/components/ResponsiveBookingForm";
import RelatedExperiences from "@/components/RelatedExperiences";
import AvailabilityModal from "@/components/AvailabilityModal";
import { useInteractiveBookingForm } from "@/components/InteractiveBookingForm";
import { initializeHybridBookingFlow } from "@/utils/hybridBookingFlow";

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { formatPrice } = useCurrency();
  const bookingFormRef = useRef<HTMLDivElement>(null);
  
  const experience = mockExperiences.find(exp => exp.slug === slug);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;
  
  // Return early if experience not found to prevent errors
  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
            <p className="text-muted-foreground mb-6">The experience you're looking for doesn't exist.</p>
            <Link to="/browse">
              <Button>Browse Experiences</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Initialize sticky button and intersection observer
  useEffect(() => {
    initializeHybridBookingFlow();
    
    // Intersection observer for sticky button visibility
    if (bookingFormRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setStickyVisible(!entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      observer.observe(bookingFormRef.current);
      
      // Show sticky button after scrolling past hero (400px)
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setStickyVisible(scrollTop > 400 && !bookingFormRef.current?.getBoundingClientRect().top || 0 > window.innerHeight * 0.5);
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [experience?.slug]);

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % experience.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + experience.images.length) % experience.images.length);
  };

  const handleAvailabilitySubmit = (data: { date: string; people: number }) => {
    // Scroll to booking form with prefilled data
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToBooking = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background experience-booking">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-primary">Browse</Link>
          <span>/</span>
          <span className="text-foreground">{experience.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img 
                  src={experience.images[currentImageIndex]} 
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
                {experience.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              {experience.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {experience.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Info */}
            <div className="space-y-6">
              <div>
                <Badge className={`mb-3 ${getThemeColor(experience.theme)}`}>
                  {experience.theme}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {experience.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{experience.location_text}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{experience.duration_hours} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {experience.capacity} people</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatPrice(experience.base_price)}
                    </div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground text-sm">(42 reviews)</span>
                  </div>
                </div>
                <Button 
                  onClick={scrollToBooking}
                  className="w-full"
                  size="lg"
                >
                  Book Experience
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {experience.description}
            </p>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Included
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Expert local guide</li>
                  <li>• All necessary equipment</li>
                  <li>• Transportation to/from location</li>
                  <li>• Light refreshments</li>
                  <li>• Conservation education materials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Included
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personal travel insurance</li>
                  <li>• Meals (unless specified)</li>
                  <li>• Personal items and souvenirs</li>
                  <li>• Tips for guides (optional)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Location</h2>
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{experience.location_text}</span>
              </div>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </section>

          {/* Similar Experiences */}
          <RelatedExperiences 
            currentExperienceId={Number(experience.id)}
            theme={experience.theme}
            destination={experience.location_text}
            maxResults={8}
          />

          {/* Reviews */}
          <div className="experience-reviews">
            <ReviewSection experienceId={experience.id} />
          </div>

          {/* Booking Form */}
          <div ref={bookingFormRef} className="experience-booking-form">
            <ResponsiveBookingForm experience={experience} project={project} />
          </div>
        </div>
      </div>


      {/* 3) Booking / Checkout panel */}
      <section id="booking-section" className="booking-wrap" hidden>
        <form id="booking-form" data-unit-price={experience.base_price} data-currency="KES" className="form-shell">
          {/* Locked chips after availability */}
          <div className="booking-locks">
            <div className="lock-chip"><strong>Date:</strong> <span data-lock="date"></span></div>
            <div className="lock-chip"><strong>People:</strong> <span data-lock="people"></span></div>
            <button type="button" className="btn-link" id="edit-availability">Change</button>
          </div>

          {/* Form grid */}
          <div className="form-grid">
            <label>Name
              <input name="name" required />
            </label>
            <label>Email
              <input name="email" type="email" required />
            </label>
            <label>Phone
              <input name="phone" required />
            </label>
          </div>

          {/* Price review */}
          <div id="price-review" className="price-review"></div>

          {/* Desktop/laptop primary CTA */}
          <div className="actions desktop-actions">
            <button className="btn btn-primary" type="submit">Continue to payment</button>
          </div>

          {/* Mirrors for backend (optional) */}
          <input type="hidden" name="date" id="bf-date" />
          <input type="hidden" name="people" id="bf-people" />
          <input type="hidden" name="unit_price" id="bf-unit" />
          <input type="hidden" name="currency" id="bf-curr" />
          <input type="hidden" name="total_price" id="bf-total" />
          <input type="hidden" name="partner_amount" id="bf-partner" />
          <input type="hidden" name="platform_amount" id="bf-platform" />
        </form>

        {/* Mobile/tablet sticky bar */}
        <div className="sticky-cta">
          <div className="sticky-total">
            <span>Total</span>
            <strong className="sticky-total-value">KES 0</strong>
          </div>
          <button className="btn btn-primary" id="sticky-continue">Continue to payment</button>
        </div>
      </section>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        onSubmit={handleAvailabilitySubmit}
        maxCapacity={experience.capacity}
        experienceTitle={experience.title}
      />

      {/* Sticky Book Now Button */}
      {stickyVisible && (
        <div className="sticky-book-now">
          <button 
            id="sticky-book-now-btn" 
            aria-label="Book now"
            onClick={scrollToBooking}
          >
            Book now
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ExperienceDetail;