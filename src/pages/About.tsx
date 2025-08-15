import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Leaf, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-primary/5">
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
      <section className="py-16">
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
      <section className="py-16 bg-muted/30">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Our Impact So Far
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  $647K
                </div>
                <div className="text-sm text-muted-foreground">
                  Funded to Conservation
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  189
                </div>
                <div className="text-sm text-muted-foreground">
                  Conservation Experiences
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  8
                </div>
                <div className="text-sm text-muted-foreground">
                  Partner Organizations
                </div>
              </div>
              
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  95%
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
      <section className="py-16 bg-primary/5">
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

      <Footer />
    </div>
  );
};

export default About;