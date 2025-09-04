import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ArrowRight, Users, DollarSign, BarChart3, Shield, Globe, Heart, Zap, TrendingUp, Star, Calendar, MessageSquare, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnerWithUs = () => {
  const scrollToApplication = () => {
    document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="w-fit">Partner Program</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Partner with NatuAsili to Scale Your Conservation Impact
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join Kenya's leading conservation marketplace and connect with impact-driven travelers from around the world. Grow your reach, simplify bookings, and maximize your conservation funding.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={scrollToApplication} className="group">
                  Apply as a Partner
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Book a Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/partner-hero.jpg" 
                alt="Conservation partner dashboard mockup"
                className="w-full rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-1.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground">Trusted by leading conservation organizations</p>
          </div>
          <div className="flex justify-center items-center gap-8 opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <img 
                key={i}
                src={`/images/partner-logo-${i}.png`} 
                alt={`Partner ${i}`}
                className="h-12 grayscale hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = '/images/natuasili-logo.png';
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Partner with NatuAsili?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're building the future of conservation tourism in Kenya, connecting passionate travelers with meaningful experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Reach Impact-Driven Travelers",
                description: "Connect with conscious travelers who prioritize authentic conservation experiences over traditional tourism."
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Easy Payouts & Pricing",
                description: "Automated payment processing with transparent 90/10 revenue split. Set your own pricing and get paid promptly."
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "AI-Powered Discovery",
                description: "Our smart search system helps travelers find your experiences based on their interests and conservation values."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Impact Ledger & Proof System",
                description: "Track and showcase your conservation impact with our transparent ledger system and proof upload features."
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Global Marketing Reach",
                description: "Benefit from our marketing efforts targeting international conservation-minded travelers."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Mission Alignment",
                description: "Work with a platform that shares your commitment to authentic conservation and community empowerment."
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in four simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Complete our partner application with your organization details and conservation credentials."
              },
              {
                step: "2", 
                title: "Add Experiences",
                description: "Create compelling listings for your conservation experiences with photos, descriptions, and pricing."
              },
              {
                step: "3",
                title: "Set Pricing & Availability",
                description: "Configure your pricing, capacity, and availability calendar to match your operations."
              },
              {
                step: "4",
                title: "Go Live & Track Impact",
                description: "Start receiving bookings and track your conservation impact with our comprehensive dashboard."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Listings & Inventory */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary">Listings & Inventory</Badge>
                <h3 className="text-3xl font-bold">Showcase Your Conservation Experiences</h3>
                <p className="text-lg text-muted-foreground">
                  Create beautiful, compelling listings that tell your conservation story. Upload high-quality photos, 
                  write detailed descriptions, and highlight your unique impact initiatives.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Professional photo galleries with unlimited uploads",
                  "SEO-optimized descriptions and tags",
                  "Real-time availability calendar management",
                  "Flexible pricing options including child discounts",
                  "Conservation impact highlights and metrics"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img 
                src="/images/mockup-1.jpg" 
                alt="Listings management interface"
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-2.jpg';
                }}
              />
            </div>
          </div>

          {/* Bookings & Payments */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-1">
              <img 
                src="/images/mockup-2.jpg" 
                alt="Booking management dashboard"
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-3.jpg';
                }}
              />
            </div>
            <div className="space-y-6 lg:order-2">
              <div className="space-y-4">
                <Badge variant="secondary">Bookings & Payments</Badge>
                <h3 className="text-3xl font-bold">Streamlined Booking Management</h3>
                <p className="text-lg text-muted-foreground">
                  Handle all your bookings in one place with automated payment processing, 
                  guest communication, and comprehensive reporting.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Automated booking confirmations and reminders",
                  "Secure payment processing with instant payouts",
                  "Guest messaging and communication tools",
                  "Booking calendar with conflict prevention",
                  "Detailed booking analytics and reporting"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Impact Ledger */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary">Impact Ledger & Proofs</Badge>
                <h3 className="text-3xl font-bold">Transparent Impact Tracking</h3>
                <p className="text-lg text-muted-foreground">
                  Document and share your conservation impact with our comprehensive ledger system. 
                  Upload proof of impact and build trust with travelers.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Automated impact allocation from each booking",
                  "Photo and document upload for impact proof",
                  "Public impact dashboard for transparency",
                  "Conservation metrics and outcome tracking",
                  "Impact certificates for guests"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img 
                src="/images/mockup-3.jpg" 
                alt="Impact tracking dashboard"
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-4.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              We only succeed when you succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <CardDescription className="text-lg">Perfect for getting started</CardDescription>
                <div className="text-4xl font-bold text-primary">10%</div>
                <p className="text-muted-foreground">platform fee per booking</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    "Unlimited listings",
                    "Basic booking management",
                    "Payment processing",
                    "Guest messaging",
                    "Impact tracking"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardHeader className="text-center pb-8">
                <Badge className="mb-4">Most Popular</Badge>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription className="text-lg">For established organizations</CardDescription>
                <div className="text-4xl font-bold text-primary">8%</div>
                <p className="text-muted-foreground">platform fee per booking</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    "Everything in Basic",
                    "Advanced analytics",
                    "Priority customer support",
                    "Marketing promotions",
                    "API access"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-lg">For large organizations</CardDescription>
                <div className="text-4xl font-bold text-primary">Custom</div>
                <p className="text-muted-foreground">contact us for pricing</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    "Everything in Pro",
                    "Custom integrations",
                    "Dedicated account manager",
                    "White-label options",
                    "Custom reporting"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Integrations & Compliance
            </h2>
            <p className="text-xl text-muted-foreground">
              All the tools and compliance features you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Payment Processing",
                description: "Stripe integration for secure payments and automated payouts"
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "CSV Data Import",
                description: "Bulk upload experiences and manage inventory via CSV files"
              },
              {
                icon: <Camera className="h-8 w-8" />,
                title: "Image Management",
                description: "High-quality image galleries with automatic optimization"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "KYC Compliance",
                description: "Basic know-your-customer verification for partner onboarding"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Partners Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Kamau",
                role: "Director, Maasai Mara Wildlife Conservancy",
                image: "/images/testimonial-1.jpg",
                quote: "NatuAsili has transformed how we connect with conservation-minded travelers. The platform's transparency and impact tracking have helped us build trust with our visitors."
              },
              {
                name: "James Mutua",
                role: "Founder, Coastal Forest Conservation",
                image: "/images/testimonial-2.jpg", 
                quote: "The automated booking system and payment processing have saved us countless hours. We can now focus on what we do best - conservation work."
              },
              {
                name: "Dr. Grace Wanjiku",
                role: "Program Manager, Ol Pejeta Conservancy",
                image: "/images/testimonial-3.jpg",
                quote: "The impact ledger feature has revolutionized how we showcase our conservation outcomes to visitors and donors. It's a game-changer for transparency."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-1.jpg';
                      }}
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How long does the onboarding process take?",
                answer: "Typically 3-5 business days after you submit your application and required documentation. We'll review your conservation credentials and set up your partner account."
              },
              {
                question: "How do payouts work?",
                answer: "Payouts are processed automatically within 2-3 business days after each booking. You receive 90% of the booking value, with 10% going to platform operations and conservation fund."
              },
              {
                question: "Do you support child pricing logic?",
                answer: "Yes! You can set child discounts (typically 50% of adult price) for specific experiences. This is automatically calculated during booking."
              },
              {
                question: "What support do you provide?",
                answer: "We offer email support within 24 hours, comprehensive documentation, video tutorials, and dedicated account management for Pro and Enterprise partners."
              },
              {
                question: "Can I manage multiple locations?",
                answer: "Absolutely! You can create multiple experience listings across different locations and manage them all from one dashboard."
              },
              {
                question: "What marketing support do you provide?",
                answer: "We actively promote partner experiences through our website, social media, email newsletters, and partnerships with conservation organizations worldwide."
              },
              {
                question: "How does the impact tracking work?",
                answer: "For each booking, 90% of revenue is tracked in our impact ledger. Partners can upload photos, reports, and documentation showing how funds are used for conservation initiatives."
              },
              {
                question: "What are the requirements to become a partner?",
                answer: "Partners should be registered conservation organizations, wildlife conservancies, community groups, or eco-tourism operators with legitimate conservation focus and proper documentation."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Conversion Banner */}
      <section id="application" className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Partner with NatuAsili?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join Kenya's leading conservation marketplace and start connecting with impact-driven travelers today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth?returnUrl=/dashboard/partner">
                  Create Partner Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Sales
              </Button>
            </div>
            
            <p className="text-sm opacity-75">
              No setup fees • Cancel anytime • Full support included
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;