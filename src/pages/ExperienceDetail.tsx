import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Clock, Star, Heart, Share, ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import ReviewSection from "@/components/ReviewSection";
import MapComponent from "@/components/MapComponent";
import RelatedExperiences from "@/components/RelatedExperiences";
import AvailabilitySelector from "@/components/AvailabilitySelector";
import BookingFormModal from "@/components/BookingFormModal";

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { formatPrice } = useCurrency();
  const availabilityRef = useRef<HTMLDivElement>(null);
  
  const experience = mockExperiences.find(exp => exp.slug === slug);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;
  
  // Return early if experience not found to prevent errors
  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
            <p className="text-muted-foreground mb-6">The experience you're looking for doesn't exist.</p>
            <Link to="/browse">
              <Button>Browse Experiences</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Initialize sticky button and intersection observer
  useEffect(() => {
    // Intersection observer for sticky button visibility
    if (availabilityRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setStickyVisible(!entry.isIntersecting);
        },
        { threshold: 0.6 }
      );
      
      observer.observe(availabilityRef.current);
      
      return () => {
        observer.disconnect();
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

  const scrollToAvailability = () => {
    availabilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const highlights = [
    "Track endangered species with expert wildlife conservationists",
    "Learn traditional tracking techniques from local Maasai guides", 
    "Contribute directly to wildlife monitoring and conservation data",
    "Experience the raw beauty of Kenya's most pristine wilderness areas",
    "Support community-led conservation initiatives"
  ];

  const itinerary = [
    {
      time: "6:00 AM",
      title: "Early Morning Departure",
      description: "Pick up from your accommodation and journey to the conservancy with a briefing on the day's activities."
    },
    {
      time: "7:30 AM", 
      title: "Wildlife Tracking Begins",
      description: "Begin tracking with our expert guides using traditional methods and modern conservation techniques."
    },
    {
      time: "10:00 AM",
      title: "Data Collection",
      description: "Learn how to collect vital conservation data and contribute to ongoing wildlife monitoring efforts."
    },
    {
      time: "12:00 PM",
      title: "Bush Lunch",
      description: "Enjoy a traditional bush lunch while discussing conservation challenges and successes."
    },
    {
      time: "2:00 PM",
      title: "Continue Tracking",
      description: "Afternoon tracking session focusing on different species and habitat areas."
    },
    {
      time: "4:30 PM",
      title: "Return Journey", 
      description: "Debrief the day's discoveries and return to your accommodation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
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
      <section className="hero-full relative">
        <div className="hero-inner">
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
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.8</span>
                  <span className="text-muted-foreground text-sm">(42 reviews)</span>
                </div>

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

                {/* Perks */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Free cancellation
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Reserve now, pay later
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">from</div>
                  <div className="text-3xl font-bold text-foreground">
                    {formatPrice(experience.base_price)}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability & Options */}
      <div className="container mx-auto px-4 py-8">
        <div ref={availabilityRef}>
          <AvailabilitySelector experience={experience} project={project} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 page-content">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overview */}
          <section className="section-overview mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {experience.description}
            </p>
          </section>

          {/* About this activity */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">About this activity</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Embark on an extraordinary conservation adventure that combines the thrill of wildlife tracking with meaningful conservation impact. This immersive experience takes you deep into Kenya's pristine wilderness areas where you'll work alongside expert conservationists and local Maasai guides.
              </p>
              <p>
                You'll learn traditional tracking techniques passed down through generations while contributing to vital wildlife monitoring data that helps protect endangered species. This isn't just tourism – it's active participation in conservation efforts that make a real difference.
              </p>
              <p>
                The experience offers unparalleled access to some of Kenya's most pristine wildlife areas, where you'll witness the incredible biodiversity that makes this region so special. Every booking directly supports community-led conservation initiatives and provides sustainable livelihoods for local families.
              </p>
            </div>
          </section>

          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Highlights</h2>
            <ul className="space-y-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Itinerary</h2>
            <div className="space-y-6">
              {itinerary.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                    {item.time}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Map */}
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

          {/* Includes / Excludes */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">What's included</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Included
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Expert local guide and conservationist</li>
                  <li>• All necessary tracking equipment</li>
                  <li>• Transportation to/from location</li>
                  <li>• Traditional bush lunch</li>
                  <li>• Conservation education materials</li>
                  <li>• Certificate of participation</li>
                  <li>• Contribution to conservation project</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not included
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personal travel insurance</li>
                  <li>• Additional meals and drinks</li>
                  <li>• Personal items and souvenirs</li>
                  <li>• Tips for guides (optional)</li>
                  <li>• Photography equipment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Important information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      What to bring
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Comfortable walking shoes</li>
                      <li>• Sun hat and sunscreen</li>
                      <li>• Water bottle</li>
                      <li>• Camera (optional)</li>
                      <li>• Light jacket for early morning</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Know before you go</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Activity involves moderate walking on uneven terrain</li>
                      <li>• Wildlife sightings cannot be guaranteed</li>
                      <li>• Minimum age: 12 years</li>
                      <li>• Not suitable for pregnant women</li>
                      <li>• Subject to weather conditions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <RelatedExperiences 
            currentExperienceId={Number(experience.id)}
            theme={experience.theme}
            destination={experience.location_text}
            maxResults={5}
          />

          {/* Reviews & Ratings */}
          <section className="section-reviews mb-10">
            <ReviewSection experienceId={experience.id} />
          </section>
        </div>
      </div>

      {/* Sticky Book Now Button */}
      {stickyVisible && (
        <>
          {/* Mobile sticky bar */}
          <div className="na-cta-bar lg:hidden fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur-sm border-t p-4" 
               style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <Button onClick={openBookingModal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              Book Now
            </Button>
          </div>
          
          {/* Desktop floating button */}
          <Button 
            onClick={openBookingModal}
            className="na-btn-book-fab hidden lg:block fixed right-6 bottom-6 z-50 shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Book Now
          </Button>
        </>
      )}

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        experience={experience}
        project={project}
      />
    </div>
  );
};

export default ExperienceDetail;