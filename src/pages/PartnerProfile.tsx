import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  Trophy,
  Target,
  Heart,
  Leaf
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { expandedPartnerProfiles } from "@/data/partnerProfiles";

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const partner = expandedPartnerProfiles.find(p => p.slug === slug);

  if (!partner) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Partner not found</h1>
            <p className="text-muted-foreground mb-6">
              The partner profile you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/partners">View All Partners</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wildlife conservation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'marine conservation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'habitat':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'community development':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/partners">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Link>
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-[300px]">
                  <Badge className={`${getCategoryColor(partner.category)} mb-4`}>
                    {partner.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {partner.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {partner.mission}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {partner.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Established {partner.established}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {partner.communityImpact.jobs} local jobs
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${partner.contact.email}`} className="hover:text-primary">
                        {partner.contact.email}
                      </a>
                    </div>
                    {partner.contact.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${partner.contact.phone}`} className="hover:text-primary">
                          {partner.contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {partner.gallery.slice(0, 3).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${partner.name} conservation work`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    About Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {partner.expandedBio}
                  </p>
                </CardContent>
              </Card>

              {/* Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Conservation Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {partner.programs.map((program, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-foreground mb-2">
                          {program.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {program.description}
                        </p>
                        {index < partner.programs.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experiences */}
              {partner.experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Available Experiences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {partner.experiences.map((experience, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-foreground">
                              {experience.title}
                            </h4>
                            <span className="text-primary font-bold">
                              KES {experience.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {experience.description}
                          </p>
                          <Button asChild size="sm">
                            <Link to={`/experience/${experience.slug}`}>
                              View Experience
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Conservation Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partner.communityImpact.conservationResults.map((result, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {result.metric}
                          </span>
                          <span className="font-semibold text-primary">
                            {result.value}
                          </span>
                        </div>
                        {index < partner.communityImpact.conservationResults.length - 1 && (
                          <Separator className="mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground block">Local Jobs Created</span>
                      <span className="text-2xl font-bold text-primary">
                        {partner.communityImpact.jobs}
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Education</span>
                      <span className="text-sm text-foreground">
                        {partner.communityImpact.education}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {partner.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold text-foreground mb-2">
                    Support This Partner
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book an experience to directly support their conservation work
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/browse">Browse Experiences</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnerProfile;