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
    setShowPartnerModal(true);
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
    question: "How do I get started as a partner?",
    answer: "Simply click 'Apply as a Partner' to create your account. After verification, you can start adding your conservation experiences and setting your availability."
  }, {
    question: "How and when do I get paid?",
    answer: "Payouts are processed weekly for completed bookings. Funds are transferred directly to your bank account with detailed statements available in your dashboard."
  }, {
    question: "Do you support child pricing logic?",
    answer: "Yes! Our platform automatically applies child half-price rules for designated experiences like Nairobi Giraffe Centre and all Ol Pejeta experiences."
  }, {
    question: "What kind of support do you provide?",
    answer: "We offer comprehensive support including onboarding assistance, technical help, and ongoing partnership support with guaranteed response times based on your plan."
  }, {
    question: "How do impact proofs work?",
    answer: "Partners can upload photos, documents, and reports showing their conservation impact. This builds trust with travelers and demonstrates real environmental outcomes."
  }, {
    question: "Can I customize my experience listings?",
    answer: "Absolutely! You can add detailed descriptions, photo galleries, pricing rules, availability calendars, and specific booking requirements for each experience."
  }];

  return (
    <div className="min-h-screen bg-background">
      <PartnerApplication 
        open={showPartnerModal} 
        onOpenChange={setShowPartnerModal} 
      />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Partner With NatuAsili
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join Africa's leading conservation tourism platform and connect with impact-driven travelers while showcasing your conservation work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleApplyAsPartner} size="lg" className="text-lg px-8 py-6">
              Apply as a Partner
            </Button>
            <Button onClick={handleBookDemo} variant="outline" size="lg" className="text-lg px-8 py-6">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              WHAT WE DO BEST
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to showcase your conservation experiences and connect with travelers who share your values.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {prop.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{prop.title}</h3>
                  <p className="text-base font-light text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Follow these four steps to begin welcoming conservation-minded travelers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-base font-light text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Partner Dashboard Features
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
              Manage your conservation experiences with our comprehensive suite of partner tools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-base font-light text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your organization. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`p-6 ${plan.highlight ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary my-4">{plan.fee}</div>
                    <CardDescription className="text-base font-light">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-base font-light text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl mx-auto">
              Watch how easy it is to create and manage your conservation experiences on our platform.
            </p>
          </div>
          <PartnerOnboardingDemo />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base font-light text-muted-foreground">
              Get answers to common questions about partnering with NatuAsili.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base font-light text-muted-foreground pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Partnership?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join conservation leaders who are making a difference through sustainable tourism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleApplyAsPartner} size="lg" variant="secondary" className="text-lg px-8 py-6">
              Apply as a Partner
            </Button>
            <Button onClick={handleBookDemo} size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;