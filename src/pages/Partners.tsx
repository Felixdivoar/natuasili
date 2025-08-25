import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, DollarSign, Users, TrendingUp, Shield, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Partners = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Direct Funding",
      description: "Receive 90% of experience fees directly to your conservation programs"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Global Reach",
      description: "Connect with conscious travelers from around the world"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Sustainable Growth",
      description: "Build a sustainable funding model through tourism revenue"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Impact Verification",
      description: "Showcase your conservation impact with verified transparency"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Mission Alignment",
      description: "Partner with travelers who share your conservation values"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Analytics dashboard to track your success"
    }
  ];

  const requirements = [
    "Registered conservation organization in Kenya with community-based tourism activities",
    "Demonstrable conservation impact and programs",
    "Ability to host and guide visitors safely"
  ];

  const faqs = [
    {
      question: "What is NatuAsili?",
      answer: "NatuAsili is a conservation-driven travel platform that connects travelers with experiences that protect wildlife, preserve natural habitats, and support local communities."
    },
    {
      question: "Who can register?",
      answer: "We work with both companies and independent operators who are legally registered, compliant, and offer high-quality travel products. Experiences must be responsible, socially just, and environmentally sustainable. These include wildlife tracking, anti-poaching, marine conservation, habitat restoration, research, education, cultural immersions, craft co-ops, youth programs, and conservation education."
    },
    {
      question: "Are there any obligations on my side?",
      answer: "No. You're free to deactivate your activity or account at any time. You also have full control over your pricing and availability, which you can update whenever you wish."
    },
    {
      question: "How and when do I get paid?",
      answer: "Payments are made after each fulfilled booking. You can choose between free monthly payouts or bi-monthly payouts with a small surcharge. The commission fee helps us manage the platform, develop tools, and promote your experiences globally. To ensure timely payments, we'll need your business details such as company registration number, tax identification number, and bank information."
    },
    {
      question: "How much does it cost?",
      answer: "Listing your activities is free. We only charge a commission fee on successful bookings."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Partner With NatuAsili
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join Kenya's premier conservation impact platform and connect your conservation work 
              with conscious travelers who want to make a real difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/partner-dashboard">
                  Apply to Partner
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/impact-ledger">
                  View Impact Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Partner with NatuAsili?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We provide conservation organizations with a sustainable funding model 
                through authentic tourism experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="text-primary mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Partnership Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <CardTitle className="text-center">Apply & Verify</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Submit your organization details and conservation programs. 
                    We verify your credentials and mission alignment.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <CardTitle className="text-center">Create Experiences</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Design authentic experiences that showcase your conservation work. 
                    Set pricing and capacity with our guidance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <CardTitle className="text-center">Welcome Visitors</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Host travelers, deliver amazing experiences, and receive 90% of fees 
                    directly for your conservation programs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Partnership Requirements
              </h2>
              <p className="text-lg text-muted-foreground">
                To ensure quality and safety, we have specific requirements for partner organizations.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Partner Success Stories
              </h2>
            </div>

            <div className="relative">
              {/* Carousel Container */}
              <div className="partner-stories-carousel overflow-hidden">
                <div className="flex gap-6 transition-transform duration-300 ease-in-out" id="partner-stories-track">
                  <Link to="/projects/1" className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)]">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary">Wildlife</Badge>
                          <Badge variant="outline">Verified impact</Badge>
                        </div>
                        <CardTitle>Maasai Mara Wildlife Conservancy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4">
                          "NatuAsili has enabled us to fund critical wildlife protection programs 
                          through meaningful tourism experiences. We've seen a 40% increase in conservation funding."
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary font-semibold">$125,000 raised</span>
                          <span className="text-foreground">45 experiences hosted</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/projects/2" className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)]">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary">Education</Badge>
                          <Badge variant="outline">Verified impact</Badge>
                        </div>
                        <CardTitle>Samburu Education Initiative</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4">
                          "The platform has connected us with travelers who truly care about our mission. 
                          The transparent funding model has helped us expand our education programs."
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary font-semibold">$78,000 raised</span>
                          <span className="text-foreground">28 experiences hosted</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/projects/3" className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)]">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary">Habitat</Badge>
                          <Badge variant="outline">Verified impact</Badge>
                        </div>
                        <CardTitle>Coastal Forest Restoration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4">
                          "Working with NatuAsili has allowed us to showcase our mangrove restoration work 
                          while generating sustainable funding for our conservation efforts."
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary font-semibold">$92,000 raised</span>
                          <span className="text-foreground">38 experiences hosted</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/projects/4" className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)]">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary">Livelihoods</Badge>
                          <Badge variant="outline">Verified impact</Badge>
                        </div>
                        <CardTitle>Community Beekeeping Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4">
                          "The income from conservation tourism has enabled us to expand our beekeeping 
                          program and support 50 local families while protecting forest habitats."
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary font-semibold">$56,000 raised</span>
                          <span className="text-foreground">22 experiences hosted</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-4">
                <button 
                  className="prev-partner-btn pointer-events-auto w-10 h-10 rounded-full border border-border bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
                  onClick={() => {
                    const track = document.getElementById('partner-stories-track');
                    if (track) {
                      const isMobile = window.innerWidth < 768;
                      const cardWidth = track.querySelector('a')?.getBoundingClientRect().width || 300;
                      const scrollAmount = isMobile ? cardWidth + 24 : (cardWidth + 24) * 2;
                      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    }
                  }}
                >
                  ←
                </button>
                <button 
                  className="next-partner-btn pointer-events-auto w-10 h-10 rounded-full border border-border bg-background shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
                  onClick={() => {
                    const track = document.getElementById('partner-stories-track');
                    if (track) {
                      const isMobile = window.innerWidth < 768;
                      const cardWidth = track.querySelector('a')?.getBoundingClientRect().width || 300;
                      const scrollAmount = isMobile ? cardWidth + 24 : (cardWidth + 24) * 2;
                      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about partnering with NatuAsili.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Join Our Conservation Network?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start building a sustainable funding model for your conservation work today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/partner-dashboard">
                  Start Partnership Application
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="mailto:partners@natuasili.org">
                  Contact Partnership Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;