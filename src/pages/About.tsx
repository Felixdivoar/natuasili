import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, Users, Leaf, Heart, Globe, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { useCurrency } from "@/contexts/CurrencyContext";
import MetaTags from "@/components/MetaTags";

const teamMembers = [
  {
    id: 1,
    name: "FM",
    role: "Founder & COO",
    bio: "Passionate conservationist with 15 years of experience in wildlife protection and community engagement across East Africa.",
    image: "/placeholder.svg",
    linkedin: "#",
    email: "fm@natuasili.org"
  },
  {
    id: 2,
    name: "MN",
    role: "Head of Human Resources",
    bio: "Expert in building diverse, mission-driven teams with a focus on sustainable organizational growth and culture.",
    image: "/placeholder.svg", 
    linkedin: "#",
    email: "mn@natuasili.org"
  },
  {
    id: 3,
    name: "AY",
    role: "Sustainability Director",
    bio: "Environmental scientist specializing in impact measurement and sustainable tourism development in Kenya.",
    image: "/placeholder.svg",
    linkedin: "#", 
    email: "ay@natuasili.org"
  },
  {
    id: 4,
    name: "SO",
    role: "Chief Financial Officer",
    bio: "Financial strategist with expertise in conservation funding models and transparent impact allocation systems.",
    image: "/placeholder.svg",
    linkedin: "#",
    email: "so@natuasili.org"
  },
  {
    id: 5,
    name: "DO", 
    role: "Chief Technology Officer",
    bio: "Technology leader focused on building platforms that connect conservation impact with global audiences.",
    image: "/placeholder.svg",
    linkedin: "#",
    email: "do@natuasili.org"
  }
];

const About = () => {
  const { totalConservationFunding, totalExperiences, totalPartners, transparencyRate, loading } = useImpactMetrics();
  const { formatPrice } = useCurrency();

  // Add visual debugging
  console.log('About page rendering with metrics:', { totalConservationFunding, totalExperiences, totalPartners, transparencyRate, loading });

  return (
    <div className="bg-background">{/* Page content wrapper */}
      <MetaTags 
        title="title_about"
        description="meta_about"
        keywords="about NatuAsili, Kenya conservation platform, sustainable tourism, wildlife protection, conservation impact, eco-tourism organization"
      />
      
      {/* Hero Section */}
      <section className="hero-padding bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About NatuAsili
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              NatuAsili is Kenya's premier conservation impact platform, connecting conscious travelers 
              with authentic conservation experiences while ensuring complete transparency of environmental impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/browse">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/partner-dashboard">
                  Partner With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                To revolutionize conservation tourism by creating transparent, impactful connections 
                between travelers and conservation organizations across Kenya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every dollar is tracked from booking to verified conservation impact. 
                    Our public impact ledger ensures complete transparency in how funds are used.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We ensure that 90% of experience fees go directly to conservation partners, 
                    creating measurable environmental and community impact.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We empower local communities and conservation organizations through 
                    sustainable tourism that preserves culture and protects wildlife.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding-lg bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Environmental Stewardship
                </h3>
                <p className="text-muted-foreground">
                  Protecting Kenya's unique ecosystems for future generations through responsible tourism.
                </p>
              </div>

              <div className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Community First
                </h3>
                <p className="text-muted-foreground">
                  Empowering local communities as the primary stewards of conservation efforts.
                </p>
              </div>

              <div className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Global Responsibility
                </h3>
                <p className="text-muted-foreground">
                  Connecting global travelers with local conservation efforts for maximum impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Our Impact So Far
              {/* Debug info */}
              <div className="text-sm text-destructive mt-2">
                DEBUG: Experiences: {totalExperiences}, Partners: {totalPartners}, Loading: {loading ? 'YES' : 'NO'}
              </div>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {loading ? "Loading..." : formatPrice(totalConservationFunding)}
                   {!loading && totalExperiences === 0 && <span className="text-destructive text-sm block">No data</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  Funded to Conservation
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {loading ? "Loading..." : totalExperiences}
                  {!loading && totalExperiences === 0 && <span className="text-destructive text-sm block">No data</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  Conservation Experiences
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {loading ? "Loading..." : totalPartners}
                  {!loading && totalPartners === 0 && <span className="text-destructive text-sm block">No data</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  Partner Organizations
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {loading ? "Loading..." : `${transparencyRate}%`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Transparency Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding-lg bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Join the Conservation Movement
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a traveler looking for meaningful experiences or a conservation 
              organization seeking sustainable funding, NatuAsili is your platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/browse">
                  Book an Experience
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/partner-dashboard">
                  Become a Partner
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/impact-ledger">
                  View Impact Ledger
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The passionate individuals driving conservation impact across Kenya through innovative partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="group hover:shadow-lg transition-shadow text-center">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-conservation/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-conservation" />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <Badge variant="outline" className="mx-auto bg-conservation/5 text-conservation border-conservation/20">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={member.linkedin}>
                          <Linkedin className="h-4 w-4 mr-1" />
                          LinkedIn
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`mailto:${member.email}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding-lg bg-conservation/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Join Our Conservation Movement?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a traveler seeking meaningful experiences or a conservation organization 
              looking for sustainable funding, we're here to help you make a real impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-conservation hover:bg-conservation/90 text-white" asChild>
                <Link to="/browse">
                  Explore Experiences
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/partners">
                  Partner With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;