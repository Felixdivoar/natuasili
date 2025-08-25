import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Clock, Star, Heart, Share, ChevronLeft, ChevronRight } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import MapComponent from "@/components/MapComponent";
import BookingStepper from "@/components/BookingStepper";
import RelatedExperiences from "@/components/RelatedExperiences";
import AvailabilityModal from "@/components/AvailabilityModal";
import { useInteractiveBookingForm } from "@/components/InteractiveBookingForm";
import { initializeHybridBookingFlow } from "@/utils/hybridBookingFlow";

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const { formatPrice } = useCurrency();
  
  const experience = mockExperiences.find(exp => exp.slug === slug);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;
  
  // Initialize interactive booking form functionality after initial render
  useEffect(() => {
    initializeHybridBookingFlow();
    
    // Wire sticky button → open availability → reveal booking
    const qs = (s: string, r: Document | Element = document) => r.querySelector(s);
    
    const aModal = qs('#availability-modal') as HTMLElement;
    const aOpen = qs('.btn-check-availability') as HTMLButtonElement;
    const bWrap = qs('#booking-section') as HTMLElement;
    const sticky = qs('#sticky-book-now-btn') as HTMLButtonElement;

    if (sticky) {
      // Prefer opening availability (so date + people are captured once),
      // then our existing flow will reveal the booking section afterwards.
      const openAvailability = () => {
        if (aModal) {
          // if you have an openAvail() function already, call it; else emulate click:
          aModal.hidden = false;
          const dateInput = aModal.querySelector('input[name="date"]') as HTMLInputElement;
          if (dateInput) dateInput.focus();
        } else if (aOpen) {
          aOpen.click();
        } else if (bWrap) {
          // fallback: scroll to booking section if no modal exists
          bWrap.hidden = false;
          bWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      sticky.addEventListener('click', (e) => {
        e.preventDefault();
        openAvailability();
      });
    }
  }, [experience?.slug]);

  if (!experience || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
          <Link to="/browse">
            <Button>Browse Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    // Navigate to booking form with prefilled data
    const bookingUrl = `${window.location.pathname}#booking?date=${data.date}&people=${data.people}`;
    window.location.href = bookingUrl;
  };

  return (
    <div className="min-h-screen bg-background experience-booking">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-primary">Browse</Link>
          <span>/</span>
          <span className="text-foreground">{experience.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="aspect-[16/10] relative bg-muted rounded-lg overflow-hidden">
                {experience.images[currentImageIndex] && (
                  <img
                    src={experience.images[currentImageIndex]}
                    alt={`${experience.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {experience.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Link
                    to={`/marketplace?theme=${encodeURIComponent(experience.theme.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="theme-chip bg-black text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    {experience.theme}
                  </Link>
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {experience.activity_type}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {experience.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {experience.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Info */}
            <div className="space-y-6">
              <div>
                <div className="experience-header mb-4">
                  <h1 className="title text-3xl font-bold text-foreground mb-2">{experience.title}</h1>
                  <div className="meta text-muted-foreground">
                    <div className="location flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location_text}
                    </div>
                    <div className="capacity flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Up to {experience.capacity} people
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="text-right">
                    <div className="border border-border px-4 py-2 rounded-lg shadow-md price-wrap">
                      <div className="booking-price font-bold text-foreground whitespace-nowrap">{formatPrice(experience.base_price)}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    By <span className="partner-name">{project.name}</span>
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.8 (24 reviews)</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Allocation Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How Your Payment Makes Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="font-medium">Goes to {project.name}</span>
                      <span className="font-bold text-primary">{experience.allocation_pct_project}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Platform & Operations</span>
                      <span className="font-bold">{experience.allocation_pct_platform}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    This transparent allocation ensures your money directly supports conservation efforts and local communities.
                  </p>
                </CardContent>
              </Card>

              {/* Tabs for Additional Info */}
              <Tabs defaultValue="includes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="includes">What's Included</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="impact">Recent Impact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="includes" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Professional guide and equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Transportation to/from meeting point
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Conservation activity participation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Impact report after completion
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Day 1: Introduction & Setup</h4>
                            <p className="text-muted-foreground text-sm">Meet the team, safety briefing, and begin conservation activities.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Day 2: Field Work</h4>
                            <p className="text-muted-foreground text-sm">Hands-on conservation work with local community members.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="impact" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-muted-foreground">2 days ago</p>
                            <p className="font-medium">Planted 50 indigenous trees in degraded habitat area</p>
                            <p className="text-sm text-muted-foreground">Funded by recent bookings</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-muted-foreground">1 week ago</p>
                            <p className="font-medium">Installed 3 water points for wildlife corridor</p>
                            <p className="text-sm text-muted-foreground">Verified impact from traveler contributions</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Map Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapComponent 
                    longitude={36.8219}
                    latitude={-1.2921}
                    location={experience.location_text}
                    className="w-full h-64 rounded-lg"
                    partnerHQLat={-1.1000}
                    partnerHQLng={36.7000}
                    partnerName={project?.name}
                    showDirectionsButton={true}
                  />
                </CardContent>
              </Card>

              {/* Related Experiences Section */}
              <RelatedExperiences 
                currentExperienceId={Number(experience.id)}
                theme={experience.theme}
                destination={experience.location_text}
                maxResults={4}
              />

              {/* Reviews Section */}
              <ReviewSection experienceId={experience.id} />
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Availability & Booking
                    <Badge variant="outline">Available</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingStepper experience={experience} project={project} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 1) Availability CTA (shown first) */}
      <div id="availability-cta" className="availability-cta">
        <button className="btn btn-primary btn-check-availability">Check availability</button>
      </div>

      {/* 2) Availability modal */}
      <div id="availability-modal" className="modal" hidden data-max="8" aria-modal="true" role="dialog" aria-labelledby="avail-title">
        <div className="modal-content">
          <h3 id="avail-title">Check availability</h3>
          <form id="availability-form" data-max="8" className="form-grid">
            <label>Date
              <input type="date" name="date" required />
            </label>
            <label>People
              <input type="number" name="people" min="1" defaultValue="1" inputMode="numeric" required />
            </label>
            <p className="people-error" role="alert" aria-live="polite" hidden>Booking limit reached.</p>
            <div className="actions">
              <button type="button" data-close="availability" className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Continue</button>
            </div>
          </form>
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

      {/* Sticky Book Now (mobile/tablet) - Add near the end of the page */}
      <div className="sticky-book-now experience-page" id="sticky-book-now" role="region" aria-label="Booking actions">
        <button className="btn btn-primary" id="sticky-book-now-btn" aria-label="Book now">
          Book now
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ExperienceDetail;