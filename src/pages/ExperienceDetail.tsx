import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Clock, Star, Heart, Share, ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EXPERIENCES } from "@/data/partners";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import BookingWizardNew from "@/components/BookingWizardNew";
import BookNowButton from "@/components/BookNowButton";
import RelatedExperiences from "@/components/RelatedExperiences";
import ReviewSection from "@/components/ReviewSection";
import AvailabilityAndOptions from "@/components/AvailabilityAndOptions";
import NewAuthModal from "@/components/NewAuthModal";
import GoogleMap from "@/components/GoogleMap";

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [bookingStarted, setBookingStarted] = useState(false);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log("Looking for slug:", slug);
  console.log("Available slugs:", EXPERIENCES.map(exp => exp.slug));
  const experience = EXPERIENCES.find(exp => exp.slug === slug);
  console.log("Found experience:", experience);
  
  // Early return with debug if not found
  if (!experience) {
    console.log("Experience not found, showing error page");
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 section-padding-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('experienceNotFound', 'Experience Not Found')}</h1>
            <p className="text-muted-foreground mb-6">{t('experienceNotFoundDesc', 'The experience you\'re looking for doesn\'t exist.')}</p>
            <Link to="/browse">
              <Button>{t('browseExperiences', 'Browse Experiences')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log("Experience found, rendering component with:", {
    title: experience.title,
    themes: experience.themes,
    gallery: experience.gallery?.length || 0,
    id: experience.id
  });

  // Update URL with booking selections for persistence
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const date = params.get('date');
    const adults = params.get('adults');
    const children = params.get('children');
    const option = params.get('option');
    
    // If we have booking parameters, scroll to availability section
    if (date || adults || children || option) {
      setTimeout(() => {
        availabilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    if (heroRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setStickyVisible(!entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(heroRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % experience.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + experience.gallery.length) % experience.gallery.length);
  };

  const updateBookingParams = useCallback((params: { date?: string; adults?: number; children?: number; option?: string }) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, String(value));
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const scrollToAvailability = () => {
    console.log("📍 Attempting to scroll to availability section", {
      availabilityRef: availabilityRef.current,
      availabilityRefExists: !!availabilityRef.current,
      availabilityRefOffsetTop: availabilityRef.current?.offsetTop,
      availabilityRefClientHeight: availabilityRef.current?.clientHeight
    });
    
    if (availabilityRef.current) {
      // Force scroll with both methods for maximum compatibility
      availabilityRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Backup method for browsers that don't support smooth scroll
      setTimeout(() => {
        const rect = availabilityRef.current?.getBoundingClientRect();
        const top = (rect?.top || 0) + window.pageYOffset - 100; // 100px offset from top
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
        console.log("📍 Backup scroll executed", { rect, top, pageYOffset: window.pageYOffset });
      }, 100);
    } else {
      console.error("❌ Availability ref not found!");
    }
  };

  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookNowClick = () => {
    console.log("🎯 Clean booking flow initiated", { 
      hasUser: !!user, 
      bookingStarted
    });
    
    if (!user) {
      console.log("🔐 Opening auth modal");
      setAuthModalOpen(true);
      return;
    }

    if (bookingStarted) {
      console.log("📅 Opening booking modal");
      openBookingModal();
    } else {
      console.log("📍 Scrolling to availability");
      scrollToAvailability();
    }
  };

  const getThemeSlug = (theme: string) => {
    const themeMap: Record<string, string> = {
      'wildlife': 'wildlife-conservation',
      'marine': 'conservation-education',
      'community': 'community-cultural-exploration',
      'culture': 'community-cultural-exploration',
      'Wildlife conservation': 'wildlife-conservation',
      'Conservation education': 'conservation-education',
      'Community & cultural exploration': 'community-cultural-exploration'
    };
    return themeMap[theme] || theme.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const getPartnerSlug = (partner: string) => {
    return partner.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const getThemeColor = (theme: string) => {
    switch (theme.toLowerCase()) {
      case 'wildlife':
        return 'bg-success/20 text-success-foreground border-success/30';
      case 'marine':
        return 'bg-info/20 text-info-foreground border-info/30';
      case 'community':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'culture':
        return 'bg-accent text-accent-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Parse content sections from experience description for structured display
  const parseExperienceContent = (description: string) => {
    const sections = {
      overview: "",
      highlights: [] as string[],
      included: [] as string[],
      notIncluded: [] as string[],
      itinerary: [] as {title: string, description: string}[],
      cancellation: "",
      duration: "",
      languages: "",
      faqs: [] as {question: string, answer: string}[],
      importantInfo: [] as string[]
    };

    // Experience-specific content based on slug
    switch (experience.slug) {
      case "colobus-monkey-eco-tour-in-diani-kenya":
        sections.overview = "Founded in Diani, Kenya, Colobus Conservation is a non-profit committed to the protection of primates, especially the threatened Angolan black and white colobus monkeys. Through habitat protection, educational campaigns, rescue, and rehabilitation projects, it seeks to safeguard primates. The only primate eco-tour in the nation, it presents a special chance to see a colonized troop of colobus monkeys in their natural environment.";
        sections.highlights = [
          "Guided nature walk through a scenic trail",
          "Depending on sightings, encounter variety of colobus monkeys, vervet monkeys, Sykes's monkeys, and baboons among other primates.",
          "Discover the critical contribution Colobus Conservation makes to primate research and protection."
        ];
        sections.included = ["A friendly professional guide"];
        sections.notIncluded = ["Personal expenses", "Insurance", "Drinks and meals", "Additional Services not mentioned"];
        sections.itinerary = [
          {
            title: "Encountering colobus monkeys and other primates",
            description: "Arrive at Colobus Conservation and meet your guide and embark on a guided walk along the trail. Observe a habituated troop of colobus monkeys and other primates. Attend a talk at the information center to learn about Colobus Conservation's activities."
          }
        ];
        sections.cancellation = "You can cancel up to 24 hours before the experience starts for a full refund.";
        sections.duration = "0 - 2 hours";
        sections.languages = "English";
        sections.faqs = [
          {
            question: "What primates can I expect to see?",
            answer: "You are most likely to see colobus monkeys, but vervet monkeys, Sykes' monkeys, and baboons are also frequent visitors to the area."
          },
          {
            question: "What are the opening hours?",
            answer: "Guided eco-tours are offered Monday to Saturday from 8:30 AM to 4:00 PM. The center is closed for eco-tours on Sundays."
          },
          {
            question: "Is this a good tour for children?",
            answer: "Yes, this tour is perfect for families with children who are interested in learning about monkeys."
          }
        ];
        break;

      case "coral-conservation-experience-with-reefolution":
        sections.overview = "As the leading coral restoration project in Africa, REEFolution is focused on safeguarding Kenyan coral reefs. To equip people to be champions of coral preservation, they provide a range of events combining education, scientific inquiry, and practical activities.";
        sections.highlights = [
          "Discover the inspirational path REEFolution is on and how it will impact the restoration of coral reefs.",
          "Attend an interactive workshop to learn about the value of coral reefs and their challenges.",
          "Discover the creative coral restoration methods developed by REEFolution, ranging from outplanting to underwater nurseries."
        ];
        sections.included = ["A friendly professional guide"];
        sections.notIncluded = ["Personal expenses", "Insurance", "Drinks and meals", "Additional Services not mentioned"];
        sections.itinerary = [
          {
            title: "Dive into REEFolution!",
            description: "Arrive at the REEFolution center. Participate in an interactive workshop led by REEFolution scientists. Learn about REEFolution's story, coral reef science, and restoration techniques. Leave empowered to become an advocate for coral reef conservation."
          }
        ];
        sections.cancellation = "You can cancel up to 48 hours before the experience starts for a full refund.";
        sections.duration = "2 - 3 hours";
        sections.languages = "English";
        sections.faqs = [
          {
            question: "What are the different program options?",
            answer: "Land-based program: Ideal for families and those who prefer to stay dry. Snorkel and Learn: Combines a workshop with a guided snorkeling tour. Dive and restore: Designed for certified divers who want to participate in coral planting actively; includes a workshop and guided dive."
          },
          {
            question: "How long are the programs?",
            answer: "Land-based is half-day, snorkel & learn and dive & restore are full-day."
          },
          {
            question: "What will I learn in the workshop?",
            answer: "You'll learn about the vital role coral reefs play in the ecosystem, the threats they face, and REEFolution's restoration techniques."
          },
          {
            question: "Can I contribute to coral restoration?",
            answer: "Depending on the program, you might have the opportunity to plant coral fragments and directly aid in reef restoration."
          },
          {
            question: "How can I contribute?",
            answer: "All programs raise awareness and support REEFolution's efforts. You are welcome to donate to restore more reefs, intensify our research, train new rangers and activate more locals."
          }
        ];
        break;

      case "ocean-wonders-learn-conserve-with-local-ocean-conservation-kenya":
        sections.overview = "With an eye toward sea turtles, Local Ocean Conservation is a non-profit committed to safeguarding Kenya's marine habitat. They provide an interesting day trip meant to educate visitors about the ocean and motivate behavior in favor of conservation. Families, outdoor enthusiasts, and everyone else interested in the marine environment will find ideal use for this informative day trip.";
        sections.highlights = [
          "Learn about the various sea turtle species, their life cycle, and the threats that they encounter.",
          "See LOC's work toward sea turtle protection and rehabilitation.",
          "Learn the value of the marine ecosystem and the need of its preservation."
        ];
        sections.included = ["A friendly professional guide"];
        sections.notIncluded = ["Personal expenses", "Insurance", "Drinks and meals", "Additional Services not mentioned"];
        sections.itinerary = [
          {
            title: "LOC: Protecting the Ocean Through Action",
            description: "Arrive at the Local Ocean Conservation center. Join a guided tour about sea turtles, their life cycle, and the challenges they face. Learn about the marine ecosystem and the importance of its conservation. Consider making a donation to further support LOC's vital work (optional)."
          }
        ];
        sections.cancellation = "You can cancel up to 48 hours before the experience starts for a full refund.";
        sections.duration = "0 - 2 hours";
        sections.languages = "English";
        sections.faqs = [
          {
            question: "What can I expect on the tour?",
            answer: "The tour includes guided talks about sea turtles and the marine ecosystem, showcasing LOC's conservation efforts."
          },
          {
            question: "Is this tour suitable for children?",
            answer: "Yes, this educational day trip is perfect for families!"
          },
          {
            question: "What can I do to contribute further?",
            answer: "Consider making a donation or spreading awareness about ocean conservation after your visit."
          }
        ];
        sections.importantInfo = [
          "The goal is to get healthy sea turtles back into the ocean as soon as possible, so you might not always see them here during your visit.",
          "Tours are offered hourly for your convenience. The specific details may vary slightly depending on the tour guide and available resources.",
          "Please note that LOC is closed on Saturday afternoon, Sundays and all Public Holidays."
        ];
        break;

      case "tree-walk-kenya-forest-heritage":
        sections.overview = "Trees are the lifeline of our planet, providing oxygen, shelter, and vital ecosystems for wildlife. The Tree walk, organized by Nature Kenya's Plant Committee, offers a unique opportunity to explore Kenya's diverse forests, learn about indigenous and exotic tree species, and understand the crucial role trees play in conservation and climate resilience. Whether in forests, botanical gardens, or urban green spaces, this guided walk helps participants connect with nature while deepening their knowledge of Kenya's rich plant biodiversity.";
        sections.highlights = [
          "Discover Kenya's rich tree heritage by exploring its indigenous and exotic species.",
          "Engage in conservation by understanding the importance of reforestation and sustainable land use.",
          "Experience nature up close with expert-led walks through forests and parks"
        ];
        sections.included = ["A friendly professional guide"];
        sections.notIncluded = ["Personal expenses", "Insurance", "Drinks and meals", "Additional Services not mentioned"];
        sections.itinerary = [
          {
            title: "Explore Kenya's forest heritage",
            description: "Start the day at 8:30 AM with a warm welcome and introduction at the designated meeting point. Get an insightful overview of Kenya's tree diversity, the significance of conservation, and a briefing on the walk, including safety guidelines and key highlights. Embark on a guided forest exploration, identifying diverse tree species while learning about their medicinal, indigenous, and exotic origins. Discover their ecological significance and observe how trees support wildlife, soil stability, and water conservation. Engage in interactive learning as you explore the challenges facing forests, from deforestation and climate change to urbanization. Gain hands-on insights into tree planting and care for reforestation efforts while uncovering the cultural and historical significance of various tree species."
          }
        ];
        sections.cancellation = "You can cancel up to 48 hours before the experience starts for a full refund.";
        sections.duration = "0 - 2 hours, 2 - 3 hours, 3 - 5 hours";
        sections.languages = "English";
        sections.faqs = [
          {
            question: "What should I bring?",
            answer: "Bring comfortable walking shoes, a hat and sunscreen for protection, a water bottle to stay hydrated, and optionally, a notebook or field guide for a more immersive experience."
          },
          {
            question: "Do I need prior knowledge of trees?",
            answer: "No! The walk is open to everyone, and guides will help with identification and learning."
          },
          {
            question: "Is the walk suitable for children?",
            answer: "Yes! The Tree Walk is a great educational experience for all ages."
          },
          {
            question: "How often do Tree Walks take place?",
            answer: "They are held once a month at different locations."
          }
        ];
        break;

      case "meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew":
        sections.overview = "The African Fund for Endangered Wildlife (AFEW) is a non-profit dedicated to the breeding and preservation of the threatened Rothschild giraffe; it is situated just outside Nairobi National Park. It presents the Giraffe Center experience, which is the main tourist attraction. Here, you will learn about these amazing animals by visiting on a guided tour or self-guided walk; you can even hand-feed them from a raised platform!";
        sections.highlights = [
          "Learn about the East African native vulnerable species called the Rothschild giraffe.",
          "From a dedicated viewing deck, observe giraffes up close and even feed them.",
          "Learn about AFEW's giraffe breeding program and efforts at conservation."
        ];
        sections.included = ["A friendly professional guide"];
        sections.notIncluded = ["Personal expenses", "Insurance", "Drinks and meals", "Additional Services not mentioned"];
        sections.itinerary = [
          {
            title: "Meet the giraffes",
            description: "Arrive at the Giraffe Centre and proceed to the giraffe feeding platform. Observe and interact with the Rothschild giraffes, learning about their unique characteristics and ecological importance. Take photos while feeding the giraffes pellets from a raised platform. Browse the gift shop for educational souvenirs (optional)."
          }
        ];
        sections.cancellation = "Cancel up to 24 hours in advance to receive a full refund. Cancellations made less than 24 hours before the tour start are non-refundable.";
        sections.duration = "0 - 2 hours";
        sections.languages = "English";
        sections.faqs = [
          {
            question: "What can I expect on a visit to the Giraffe Centre?",
            answer: "You can expect to learn about giraffes, observe them from a viewing platform, and even feed them a special pellet treat. You may also see other animals and explore the nature sanctuary."
          },
          {
            question: "How long should one factor to spend at the centre?",
            answer: "For a fulfilling experience, we recommend you plan for a 1.5 to two hour visit. This gives you enough time to feed and interact with the giraffes, attend an informative lecture on the giraffe and other wildlife, take a walk in our serene Nature Conservancy and even have a snack at our Tea House."
          },
          {
            question: "Is this a good activity for children?",
            answer: "Absolutely! Children will love getting up close to the giraffes and learning about their conservation."
          },
          {
            question: "What time is the centre open?",
            answer: "The centre is open from 9:00 AM to 5:00 PM every day including weekends and all public holidays."
          },
          {
            question: "How can I support AFEW's conservation efforts?",
            answer: "90 percent of funds collected from the entrance fees and sales in our gift shop and Tea House go towards conservation work. By visiting and/or making a purchase from the souvenir shop and the Teahouse, you contribute towards educating school children and teachers across Kenya. We encourage you to consider a tip for your guide. All our guides are Environmental Studies students who volunteer as Educators. If you wish to give towards a school trip or any other efforts, their Donation Page will give you more information. The entrance fee for the Giraffe Centre directly supports AFEW's work. You can also make a donation or purchase souvenirs from the gift shop."
          },
          {
            question: "Can I purchase a gift card or gift certificate?",
            answer: "Sure you can. Ask for any of these at the gift shop and an attendant will assist you."
          }
        ];
        break;

      default:
        // Default content for other experiences
        sections.overview = description;
        sections.highlights = [
          "Immersive conservation experience with expert guides",
          "Direct contribution to wildlife and community protection",
          "Traditional and modern conservation techniques",
          "Authentic cultural exchange with local communities",
          "90% of proceeds support partner initiatives"
        ];
        sections.included = ["Expert guide", "Conservation activities", "Local community interaction"];
        sections.notIncluded = ["Transportation", "Personal expenses", "Gratuities"];
        sections.duration = "6 hours";
        sections.languages = "English, Swahili";
        break;
    }

    return sections;
  };

  const contentSections = parseExperienceContent(experience.description);

  const itinerary = [
    {
      time: "6:00 AM",
      title: "Early Morning Departure", 
      description: "Pick up from your accommodation and journey to the location with expert briefing."
    },
    {
      time: "8:00 AM",
      title: "Experience Begins",
      description: "Begin your conservation experience with local guides and community members."
    },
    {
      time: "10:30 AM", 
      title: "Hands-On Activities",
      description: "Participate in conservation activities and learn traditional techniques."
    },
    {
      time: "12:30 PM",
      title: "Community Lunch",
      description: "Enjoy locally prepared meals while discussing conservation impact."
    },
    {
      time: "2:00 PM",
      title: "Continued Learning", 
      description: "Deepen your understanding through additional activities and exploration."
    },
    {
      time: "4:30 PM",
      title: "Return Journey",
      description: "Reflect on the day's experiences and return to your accommodation."
    }
  ];

  return (
    <CartProvider 
      experienceSlug={experience.slug} 
      basePrice={experience.priceKESAdult}
      childHalfPriceRule={experience.childHalfPriceRule || false}
    >
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative" ref={heroRef}>
          <div className="max-w-[1150px] mx-auto px-4">
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

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {experience.title}
            </h1>

            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground text-sm">(42 reviews)</span>
              </div>
              <span className="text-muted-foreground">•</span>
                <Link 
                to={`/partner/${getPartnerSlug(experience.partner)}`} 
                className="text-primary hover:underline"
              >
                {experience.partner}
              </Link>
            </div>
          </div>

          {/* Full-width Image Carousel */}
          <div className="relative mb-6">
            <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg bg-muted">
              <img 
                src={experience.gallery[currentImageIndex]} 
                alt={experience.title} 
                className="w-full h-full object-cover" 
              />
              {experience.gallery.length > 1 && (
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
            
            {/* Thumbnail navigation */}
            {experience.gallery.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {experience.gallery.map((image, index) => (
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

          {/* Top Actions Bar - Desktop */}
          <div className="hidden lg:flex items-center justify-between gap-4 py-4 border-t border-b">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>6 hours</span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">from</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatPrice(experience.priceKESAdult)}
                </div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability & Options */}
      <section className="max-w-[1150px] mx-auto px-4 py-8">
        <div 
          ref={availabilityRef}
          id="availability-section"
          className="scroll-mt-20"
        >
          <AvailabilityAndOptions 
            experience={{
              ...experience,
              base_price: experience.priceKESAdult,
              capacity: (experience as any).capacity || 15, // Default capacity
              childHalfPriceRule: experience.childHalfPriceRule || false
            }} 
            onBookingStart={() => {
              console.log("🚀 Booking started callback triggered");
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
      <div className="max-w-[1150px] mx-auto px-4 py-8">
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

          {/* What to expect */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">What to expect</h2>
            <Accordion type="single" collapsible defaultValue="itinerary" className="w-full">
              <AccordionItem value="itinerary">
                <AccordionTrigger>Itinerary</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {contentSections.itinerary.map((item, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {contentSections.cancellation && (
                <AccordionItem value="cancellation">
                  <AccordionTrigger>Cancellation Policy</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{contentSections.cancellation}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </section>


          {/* Languages */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Languages</h2>
            <p className="text-muted-foreground">{contentSections.languages}</p>
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

          {/* Important information */}
          {contentSections.importantInfo && contentSections.importantInfo.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Important information</h2>
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

          {/* Where you'll be */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('whereYoullBe', 'Where you\'ll be')}</h2>
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{experience.locationText}</span>
              </div>
              <GoogleMap 
                location={experience.locationText || "Giraffe Centre, Duma Road, Nairobi, Kenya"}
                coordinates={experience.slug === "meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew" ? [-1.2921, 36.7378] : [-1.2921, 36.8219]}
                height="h-64"
                googleMapsUrl={experience.googleMapsUrl}
              />
            </div>
          </section>

          {/* Explore other options */}
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

      {/* Sticky Book Now CTA */}
      {stickyVisible && !isBookingModalOpen && (
        <>
          {/* Desktop sticky bar */}
          <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
            <div className="max-w-[1150px] mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-foreground">{experience.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">from</div>
                  <div className="text-xl font-bold">{formatPrice(experience.priceKESAdult)}</div>
                </div>
                <BookNowButton 
                  href={user ? "#booking" : "#auth"}
                  label={!user ? 'Sign in to Book' : t('bookNow', 'Book Now')}
                  onTap={handleBookNowClick}
                  className="px-6 py-3"
                />
              </div>
            </div>
          </div>

          {/* Mobile sticky bar - Hidden per mobile optimization */}
          <div className="hidden">
            {/* Book Now button hidden on mobile - availability selector handles booking flow */}
          </div>
        </>
      )}

       <NewAuthModal 
         isOpen={authModalOpen} 
         onClose={() => setAuthModalOpen(false)}
       />

       {/* Booking Modal */}
      {isBookingModalOpen && user && (
        <BookingWizardNew 
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingStarted(false);
          }}
          experience={experience}
        />
      )}
    </div>
  </CartProvider>
);
};

export default ExperienceDetail;