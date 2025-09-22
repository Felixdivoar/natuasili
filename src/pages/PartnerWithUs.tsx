import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Search, BarChart3, CheckCircle, Upload, MessageCircle, Star, CreditCard, FileText, Globe, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PartnerOnboardingDemo from '@/components/PartnerOnboardingDemo';
import PartnerApplication from '@/components/PartnerApplication';
const PartnerWithUs: React.FC = () => {
  const navigate = useNavigate();
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const handleApplyAsPartner = () => {
    window.open('https://2o7bym7r45m.typeform.com/to/OhaBfRVk?utm_source=xxxxx&typeform-source=natuasili.com', '_blank');
  };
  const handleBookDemo = () => {
    window.open('mailto:partners@natuasili.com?subject=Partnership Demo Request', '_blank');
  };
  const valueProps = [{
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Reach Impact-Driven Travelers",
    description: "Connect with travelers who care about conservation and sustainable tourism"
  }, {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Easy Payouts",
    description: "Automated payouts with transparent fee structure and detailed reporting"
  }, {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "AI Search Exposure",
    description: "Get discovered through our intelligent search and recommendation engine"
  }, {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Impact Ledger & Proof Uploads",
    description: "Showcase your conservation impact with verified proof uploads and tracking"
  }];
  const howItWorksSteps = [{
    step: 1,
    title: "Sign Up",
    description: "Create your partner account and complete verification"
  }, {
    step: 2,
    title: "Add Experiences",
    description: "List your conservation experiences with photos and details"
  }, {
    step: 3,
    title: "Set Pricing & Availability",
    description: "Configure your pricing, availability, and booking rules"
  }, {
    step: 4,
    title: "Go Live & Track Impact",
    description: "Start receiving bookings and upload impact proofs"
  }];
  const features = [{
    icon: <Upload className="h-6 w-6 text-primary" />,
    title: "Listings & Inventory",
    description: "Easy-to-use interface for managing your experiences, pricing, and availability"
  }, {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Bookings & Payments",
    description: "Secure payment processing with automated payouts and booking management"
  }, {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Impact Ledger & Proofs",
    description: "Upload and manage conservation impact documentation for transparency"
  }, {
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    title: "Messaging",
    description: "Direct communication with travelers for questions and coordination"
  }, {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Reviews",
    description: "Collect and respond to traveler reviews to build trust and credibility"
  }];
  const pricingPlans = [{
    name: "Standard",
    fee: "10%",
    description: "Platform fee on successful bookings",
    features: ["Full platform access", "Payment processing", "Customer support", "Basic analytics"]
  }, {
    name: "Premium",
    fee: "8%",
    description: "Reduced fee for high-volume partners",
    features: ["All Standard features", "Priority support", "Advanced analytics", "Marketing promotion"],
    highlight: true
  }, {
    name: "Enterprise",
    fee: "Custom",
    description: "Tailored solutions for large organizations",
    features: ["Custom integration", "Dedicated account manager", "White-label options", "Custom reporting"]
  }];
  const faqs = [{
    question: "How much does it cost to join?",
    answer: "Joining NatuAsili is free. We charge a 10% service fee on successful bookings, so you keep 90% of your revenue. Donations are different: 100% of every donation goes directly to the partner."
  }, {
    question: "What type of business can register?",
    answer: "We welcome conservancies, NGOs, community groups, social enterprises, and organizations offering experiences that support conservation, culture, or community engagement."
  }, {
    question: "How long does verification take?",
    answer: "Verification usually takes 30 minutes once all required documents are submitted."
  }, {
    question: "Why do you require legal documents?",
    answer: "To comply with financial regulations and ensure secure payouts, we collect company details, legal representative information, and proof of address. This follows KYC (Know Your Customer) standards used by our payment partners."
  }, {
    question: "What support do you provide?",
    answer: "We offer onboarding support, marketing guidance, analytics tools, and ongoing customer service to help you succeed."
  }, {
    question: "How do payments work?",
    answer: "Payouts are transferred to your bank account by the 5th of each month, minus the 10% service fee. You'll also receive a statement for your records."
  }, {
    question: "How do I register?",
    answer: "Click 'Add Your Experience', create an account, fill out the short onboarding form, upload your documents, and set up your first experience. Once verified, you'll get access to your host dashboard."
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative hero-padding px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-[1300px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Partner with Conservation Leaders
            </h1>
            <p className="text-base font-light text-muted-foreground mb-8">
              Join Kenya's leading platform for conservation tourism. Connect with impact-driven travelers and showcase your conservation work while growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleApplyAsPartner} size="lg" className="text-lg px-8">
                Apply as a Partner
              </Button>
              <Button onClick={handleBookDemo} variant="outline" size="lg" className="text-lg px-8">
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src="/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png" alt="Conservation partnership - Community-led initiatives across Kenya" className="rounded-2xl shadow-2xl w-full h-96 object-cover" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              On-the-ground conservation, powered by your bookings.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Best Section */}
      <section className="section-padding-lg bg-background">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-block text-sm font-semibold text-muted-foreground tracking-widest uppercase bg-muted/50 px-4 py-2 rounded-full">
                WHAT WE DO BEST
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              The one-stop platform for conservation tourism in Kenya
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-3xl mx-auto mb-20 leading-relaxed">
              Natuasili is the ultimate destination for conservation organizations to connect with impact-driven travelers, showcasing authentic experiences that create lasting change for wildlife, communities, and habitats across Kenya.
            </p>
          </div>
          
          {/* Partner Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="group text-center p-6 rounded-xl bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Conservancies</h3>
            </div>
            <div className="group text-center p-6 rounded-xl bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Community Groups</h3>
            </div>
            <div className="group text-center p-6 rounded-xl bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Conservation NGOs</h3>
            </div>
            <div className="group text-center p-6 rounded-xl bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Tour Operators</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Onboarding Demo - Hidden, use PartnerApplication instead */}
      {/* <PartnerOnboardingDemo /> */}

      {/* Trusted Partners Carousel */}
      <section className="section-padding-lg bg-muted/30">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted by leading conservation organizations</h2>
            <p className="text-muted-foreground">
              We collaborate with established initiatives across Kenya to ensure bookings create measurable impact.
            </p>
          </div>
          
          {/* Partner Logos Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex animate-scroll gap-12 items-center">
                {/* First set of partners */}
                <a href="/partners/ol-pejeta-conservancy" className="group flex-shrink-0" aria-label="Ol Pejeta Conservancy">
                  <img src="/logos/olp-new.png" alt="Ol Pejeta Conservancy" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/mara-elephant-project" className="group flex-shrink-0" aria-label="Mara Elephant Project">
                  <img src="/logos/mep-new.svg" alt="Mara Elephant Project" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/colobus-conservation" className="group flex-shrink-0" aria-label="Colobus Conservation">
                  <img src="/logos/colobus-new.png" alt="Colobus Conservation" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/giraffe-centre" className="group flex-shrink-0" aria-label="Giraffe Centre">
                  <img src="/logos/giraffe-centre-new.png" alt="Giraffe Centre" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/friends-of-karura" className="group flex-shrink-0" aria-label="Friends of Karura Forest">
                  <img src="/logos/fkf-new.png" alt="Friends of Karura Forest" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/big-north" className="group flex-shrink-0" aria-label="The Big North">
                  <img src="/logos/big-north.jpg" alt="The Big North" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/fonnap" className="group flex-shrink-0" aria-label="FONNAP">
                  <img src="/logos/fonnap.png" alt="FONNAP" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/local-ocean-conservation" className="group flex-shrink-0" aria-label="Local Ocean Conservation">
                  <img src="/logos/loc-turtle.png" alt="Local Ocean Conservation" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                
                {/* Duplicate set for seamless loop */}
                <a href="/partners/ol-pejeta-conservancy" className="group flex-shrink-0" aria-label="Ol Pejeta Conservancy">
                  <img src="/logos/olp-new.png" alt="Ol Pejeta Conservancy" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/mara-elephant-project" className="group flex-shrink-0" aria-label="Mara Elephant Project">
                  <img src="/logos/mep-new.svg" alt="Mara Elephant Project" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/colobus-conservation" className="group flex-shrink-0" aria-label="Colobus Conservation">
                  <img src="/logos/colobus-new.png" alt="Colobus Conservation" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/giraffe-centre" className="group flex-shrink-0" aria-label="Giraffe Centre">
                  <img src="/logos/giraffe-centre-new.png" alt="Giraffe Centre" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/friends-of-karura" className="group flex-shrink-0" aria-label="Friends of Karura Forest">
                  <img src="/logos/fkf-new.png" alt="Friends of Karura Forest" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/big-north" className="group flex-shrink-0" aria-label="The Big North">
                  <img src="/logos/big-north.jpg" alt="The Big North" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/fonnap" className="group flex-shrink-0" aria-label="FONNAP">
                  <img src="/logos/fonnap.png" alt="FONNAP" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
                <a href="/partners/local-ocean-conservation" className="group flex-shrink-0" aria-label="Local Ocean Conservation">
                  <img src="/logos/loc-turtle.png" alt="Local Ocean Conservation" className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="hero-padding px-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner With Natuasili?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to grow your conservation tourism business
            </p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {valueProps.map((prop, index) => <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{prop.icon}</div>
                  <CardTitle className="text-xl">{prop.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{prop.description}</CardDescription>
                </CardContent>
              </Card>)}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {valueProps.map((prop, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                    <Card className="text-center h-full">
                      <CardHeader>
                        <div className="mx-auto mb-4">{prop.icon}</div>
                        <CardTitle className="text-xl">{prop.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{prop.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="hero-padding px-4 bg-muted/30">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in four simple steps
            </p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>)}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {howItWorksSteps.map((step, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                    <div className="text-center p-6 bg-background rounded-lg shadow-sm h-full">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="hero-padding px-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools for managing your conservation experiences
            </p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>)}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {features.map((feature, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {feature.icon}
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="hero-padding px-4 bg-muted/30">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Only pay when you earn. No setup fees or monthly charges.
            </p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => <Card key={index} className={plan.highlight ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                  {plan.highlight && <Badge className="w-fit mb-2">Most Popular</Badge>}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.fee}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {pricingPlans.map((plan, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                    <Card className={`h-full ${plan.highlight ? 'border-primary shadow-lg' : ''}`}>
                      
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>)}
                        </ul>
                      </CardContent>
                    </Card>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="hero-padding px-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="hero-padding px-4 bg-primary text-primary-foreground">
        <div className="max-w-[1300px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Partner with Us?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the leading platform for conservation tourism in Kenya and start making a greater impact today.
          </p>
          <Button onClick={() => setShowPartnerModal(true)} size="lg" variant="secondary" className="text-lg px-8">
            Apply as a partner
          </Button>
        </div>
      </section>
      
      {/* Partner Application Modal */}
      <PartnerApplication 
        open={showPartnerModal} 
        onOpenChange={setShowPartnerModal} 
      />
    </div>;
};
export default PartnerWithUs;