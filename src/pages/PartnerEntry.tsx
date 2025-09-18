import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  ArrowRight,
  DollarSign,
  BarChart3,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const PartnerEntry = () => {
  const { t } = useI18n();

  const benefits = [
    {
      icon: Globe,
      title: t("Global Visibility", "Global Visibility"),
      description: t("Reach impact-minded travelers from around the world", "Reach impact-minded travelers from around the world")
    },
    {
      icon: DollarSign,
      title: t("90% Revenue Share", "90% Revenue Share"),
      description: t("Keep 90% of booking revenue - industry-leading split", "Keep 90% of booking revenue - industry-leading split")
    },
    {
      icon: BarChart3,
      title: t("Analytics Dashboard", "Analytics Dashboard"),
      description: t("Track bookings, revenue, and impact metrics in real-time", "Track bookings, revenue, and impact metrics in real-time")
    },
    {
      icon: Shield,
      title: t("Verified Partner Status", "Verified Partner Status"),
      description: t("Build trust with verified conservation credentials", "Build trust with verified conservation credentials")
    },
    {
      icon: Users,
      title: t("Community Support", "Community Support"),
      description: t("Join a network of conservation partners across Kenya", "Join a network of conservation partners across Kenya")
    },
    {
      icon: Heart,
      title: t("Impact Transparency", "Impact Transparency"),
      description: t("Show travelers exactly how their contributions create change", "Show travelers exactly how their contributions create change")
    }
  ];

  const steps = [
    {
      step: "1",
      title: t("List Your Experience", "List Your Experience"),
      description: t("Create detailed listings for your conservation experiences with photos, descriptions, and pricing", "Create detailed listings for your conservation experiences with photos, descriptions, and pricing")
    },
    {
      step: "2", 
      title: t("Verification Process", "Verification Process"),
      description: t("Submit documentation to verify your conservation work and safety standards", "Submit documentation to verify your conservation work and safety standards")
    },
    {
      step: "3",
      title: t("Go Live", "Go Live"),
      description: t("Once approved, your experiences go live on the platform for travelers to discover", "Once approved, your experiences go live on the platform for travelers to discover")
    },
    {
      step: "4",
      title: t("Earn & Impact", "Earn & Impact"),
      description: t("Receive bookings, earn revenue, and track your conservation impact through our dashboard", "Receive bookings, earn revenue, and track your conservation impact through our dashboard")
    }
  ];

  const requirements = [
    t("Registered conservation organization or certified guide", "Registered conservation organization or certified guide"),
    t("Valid permits and insurance for tourism activities", "Valid permits and insurance for tourism activities"),
    t("Commitment to safety and conservation standards", "Commitment to safety and conservation standards"),
    t("Ability to provide authentic cultural and wildlife experiences", "Ability to provide authentic cultural and wildlife experiences"),
    t("Located in Kenya with local community partnerships", "Located in Kenya with local community partnerships")
  ];

  const testimonials = [
    {
      name: "Sarah Kipkoech",
      organization: "Maasai Mara Conservancy",
      quote: t("NatuAsili has connected us with travelers who truly care about conservation. The 90/10 split means more funds go directly to our wildlife protection programs.", "NatuAsili has connected us with travelers who truly care about conservation. The 90/10 split means more funds go directly to our wildlife protection programs."),
      impact: t("Funded 12 rangers", "Funded 12 rangers")
    },
    {
      name: "Dr. James Muturi",
      organization: "Laikipia Wildlife Forum",
      quote: t("The platform's transparency builds real trust with travelers. They can see exactly how their contributions support our elephant research program.", "The platform's transparency builds real trust with travelers. They can see exactly how their contributions support our elephant research program."),
      impact: t("Protected 500 elephants", "Protected 500 elephants")
    },
    {
      name: "Grace Wanjiku",
      organization: "Coastal Forest Conservation",
      quote: t("Working with NatuAsili has diversified our funding and introduced us to passionate conservation travelers who become long-term supporters.", "Working with NatuAsili has diversified our funding and introduced us to passionate conservation travelers who become long-term supporters."),
      impact: t("Restored 200 hectares", "Restored 200 hectares")
    }
  ];

  const faqs = [
    {
      question: t("How much does it cost to join?", "How much does it cost to join?"),
      answer: t("Joining NatuAsili is free. We charge a 10% service fee on successful bookings, so you keep 90% of your revenue. Donations are different: 100% of every donation goes directly to the partner.", "Joining NatuAsili is free. We charge a 10% service fee on successful bookings, so you keep 90% of your revenue. Donations are different: 100% of every donation goes directly to the partner.")
    },
    {
      question: t("What type of business can register?", "What type of business can register?"),
      answer: t("We welcome conservancies, NGOs, community groups, social enterprises, and organizations offering experiences that support conservation, culture, or community engagement.", "We welcome conservancies, NGOs, community groups, social enterprises, and organizations offering experiences that support conservation, culture, or community engagement.")
    },
    {
      question: t("How long does verification take?", "How long does verification take?"),
      answer: t("Verification usually takes 30 minutes once all required documents are submitted.", "Verification usually takes 30 minutes once all required documents are submitted.")
    },
    {
      question: t("Why do you require legal documents?", "Why do you require legal documents?"),
      answer: t("To comply with financial regulations and ensure secure payouts, we collect company details, legal representative information, and proof of address. This follows KYC (Know Your Customer) standards used by our payment partners.", "To comply with financial regulations and ensure secure payouts, we collect company details, legal representative information, and proof of address. This follows KYC (Know Your Customer) standards used by our payment partners.")
    },
    {
      question: t("What support do you provide?", "What support do you provide?"),
      answer: t("We offer onboarding support, marketing guidance, analytics tools, and ongoing customer service to help you succeed.", "We offer onboarding support, marketing guidance, analytics tools, and ongoing customer service to help you succeed.")
    },
    {
      question: t("How do payments work?", "How do payments work?"),
      answer: t("Payouts are transferred to your bank account by the 5th of each month, minus the 10% service fee. You'll also receive a statement for your records.", "Payouts are transferred to your bank account by the 5th of each month, minus the 10% service fee. You'll also receive a statement for your records.")
    },
    {
      question: t("How do I register?", "How do I register?"),
      answer: t("Click 'Add Your Experience', create an account, fill out the short onboarding form, upload your documents, and set up your first experience. Once verified, you'll get access to your host dashboard.", "Click 'Add Your Experience', create an account, fill out the short onboarding form, upload your documents, and set up your first experience. Once verified, you'll get access to your host dashboard.")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-full section-padding-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="hero-inner">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              {t("Conservation Partners", "Conservation Partners")}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t("Partner with Kenya's Premier", "Partner with Kenya's Premier")}
              <span className="block text-accent">{t("Conservation Platform", "Conservation Platform")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              {t("Join a marketplace where authentic conservation experiences meet impact-minded travelers. Keep 90% of your revenue while making a real difference.", "Join a marketplace where authentic conservation experiences meet impact-minded travelers. Keep 90% of your revenue while making a real difference.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/partner-dashboard">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground">
                  {t("Create Partner Account", "Create Partner Account")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                {t("Sign In", "Sign In")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("Why Partner with NatuAsili?", "Why Partner with NatuAsili?")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("We're more than a booking platform - we're your partner in creating sustainable conservation funding", "We're more than a booking platform - we're your partner in creating sustainable conservation funding")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding-lg bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("How It Works", "How It Works")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("Four simple steps to start earning from your conservation work", "Four simple steps to start earning from your conservation work")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("Partner Requirements", "Partner Requirements")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("We maintain high standards to ensure quality experiences for travelers", "We maintain high standards to ensure quality experiences for travelers")}
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding-lg bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("Partner Success Stories", "Partner Success Stories")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("Hear from conservation partners who are making a difference", "Hear from conservation partners who are making a difference")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{testimonial.organization}</div>
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {testimonial.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("Frequently Asked Questions", "Frequently Asked Questions")}
              </h2>
            </div>

            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-lg bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("Ready to Start Your Partnership?", "Ready to Start Your Partnership?")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t("Join Kenya's leading conservation tourism platform and start generating sustainable funding for your projects.", "Join Kenya's leading conservation tourism platform and start generating sustainable funding for your projects.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/partner-dashboard">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground">
                {t("Create Partner Account", "Create Partner Account")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              {t("Contact Us", "Contact Us")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerEntry;