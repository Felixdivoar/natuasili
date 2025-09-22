import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Search, BarChart3, CheckCircle, Upload, MessageCircle, Star, CreditCard, FileText, Globe, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PartnerOnboardingDemo from '@/components/PartnerOnboardingDemo';
const PartnerWithUs: React.FC = () => {
  const navigate = useNavigate();
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
  return;
};
export default PartnerWithUs;