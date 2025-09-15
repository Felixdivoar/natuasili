import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Users,
  Shield,
  TreePine,
  Calendar,
  Loader2
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/contexts/I18nContext';
import MetaTags from '@/components/MetaTags';

interface Partner {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  short_bio: string;
  long_bio: string;
  location_text: string;
  lat: number | null;
  lng: number | null;
  website: string;
  contact_email: string;
  socials: any;
  hero_image_url: string;
  logo_image_url: string;
  stats: any;
}

interface Experience {
  id: string;
  title: string;
  slug: string;
  hero_image: string;
  description: string;
  location_text: string;
  themes: any;
  activities: any;
  price_kes_adult: number;
  visible_on_marketplace: boolean;
}

interface PartnerMedia {
  id: number;
  url: string;
  alt: string;
  sort: number;
}

const PartnerDynamic = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  
  const [partner, setPartner] = useState<Partner | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [media, setMedia] = useState<PartnerMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    loadPartnerData();
  }, [slug]);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      
      // Load partner data
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', slug)
        .single();

      if (partnerError) {
        console.error('Partner error:', partnerError);
        setError('Partner not found');
        return;
      }

      setPartner(partnerData);

      // Load partner experiences with gallery images
      if (partnerData?.id) {
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select('id, title, slug, hero_image, gallery, description, location_text, themes, activities, price_kes_adult, visible_on_marketplace')
          .eq('partner_id', partnerData.id)
          .eq('visible_on_marketplace', true)
          .order('title');

        if (!experiencesError && experiencesData) {
          setExperiences(experiencesData);
          
          // Collect all images from experiences for the gallery
          const allImages: PartnerMedia[] = [];
          let imageId = 1;
          
          experiencesData.forEach((exp) => {
            // Add hero image
            if (exp.hero_image) {
              allImages.push({
                id: imageId++,
                url: exp.hero_image,
                alt: `${exp.title} - Hero image`,
                sort: allImages.length
              });
            }
            
            // Add gallery images
            if (exp.gallery && Array.isArray(exp.gallery)) {
              exp.gallery.forEach((imageUrl: string) => {
                if (imageUrl && imageUrl !== exp.hero_image) { // Avoid duplicates
                  allImages.push({
                    id: imageId++,
                    url: imageUrl,
                    alt: `${exp.title} - Gallery image`,
                    sort: allImages.length
                  });
                }
              });
            }
          });
          
          setMedia(allImages);
        }

        // Still load partner_media as backup, but merge with experience images
        const { data: mediaData, error: mediaError } = await supabase
          .from('partner_media')
          .select('id, url, alt, sort')
          .eq('partner_id', partnerData.id)
          .order('sort');

        if (!mediaError && mediaData && mediaData.length > 0) {
          // If we have partner media, append it to experience images
          setMedia(prevMedia => [...prevMedia, ...mediaData.map(item => ({
            ...item,
            sort: prevMedia.length + item.sort
          }))]);
        }
      }

    } catch (err) {
      console.error('Error loading partner:', err);
      setError('Failed to load partner data');
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'wildlife_saved':
      case 'animals_saved':
        return Shield;
      case 'households_supported':
      case 'households':
        return Users;
      case 'hectares':
      case 'hectares_protected':
        return TreePine;
      case 'years':
      case 'years_active':
        return Calendar;
      default:
        return Shield;
    }
  };

  const formatStatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  const formatStatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get the first experience hero image for partner hero, fallback to partner's own hero image
  const getPartnerHeroImage = () => {
    if (experiences.length > 0 && experiences[0].hero_image) {
      return experiences[0].hero_image;
    }
    return partner?.hero_image_url || '/img/ph1.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading partner...</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 section-padding-lg">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MetaTags 
        title={partner.name}
        description={partner.short_bio || partner.tagline}
      />
      
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] min-h-[500px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getPartnerHeroImage()})`
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/20">
                <Link to="/partners">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Partners
                </Link>
              </Button>

              <div className="flex items-start gap-6 mb-6">
                {partner.logo_image_url && (
                  <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-lg flex-shrink-0">
                    <img 
                      src={partner.logo_image_url} 
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    {partner.name}
                  </h1>
                  {partner.tagline && (
                    <p className="text-xl text-white/90 mb-4">
                      {partner.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white/80 mb-6">
                    <MapPin className="h-5 w-5" />
                    <span>{partner.location_text}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to={`/browse?partner=${partner.slug}`}>
                    Explore Experiences
                  </Link>
                </Button>
                {partner.website && (
                  <Button variant="outline" size="lg" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Link to={partner.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Section */}
              {partner.stats && Object.keys(partner.stats).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(partner.stats).map(([key, value]) => {
                    const IconComponent = getStatIcon(key);
                    return (
                      <div key={key} className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {formatStatValue(value)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatStatKey(key)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bio Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About {partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {partner.short_bio}
                    </p>
                    
                    {partner.long_bio && partner.long_bio !== partner.short_bio && (
                      <>
                        {showFullBio && (
                          <p className="text-muted-foreground leading-relaxed">
                            {partner.long_bio}
                          </p>
                        )}
                        <Button 
                          variant="link" 
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="p-0 h-auto text-left"
                        >
                          {showFullBio ? 'Read less' : 'Read more'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gallery */}
              {media.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {media.slice(0, 6).map((item) => (
                        <div key={item.id} className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={item.url} 
                            alt={item.alt || `${partner.name} conservation work`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = '/img/ph1.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experiences */}
              {experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Experiences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {experiences.map((experience) => (
                        <div key={experience.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-muted">
                            <img 
                              src={experience.hero_image || '/img/ph1.jpg'} 
                              alt={experience.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = '/img/ph1.jpg';
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {Array.isArray(experience.themes) ? experience.themes.slice(0, 2).map((theme) => (
                                <Badge key={theme} variant="secondary" className="text-xs">
                                  {theme}
                                </Badge>
                              )) : null}
                            </div>
                            <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                              {experience.title}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                              <MapPin className="h-3 w-3" />
                              <span>{experience.location_text}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(experience.price_kes_adult)}
                              </span>
                              <Button asChild size="sm">
                                <Link to={`/experience/${experience.slug}`}>
                                  Book Now
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partner.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${partner.contact_email}`} 
                        className="text-primary hover:underline break-all"
                      >
                        {partner.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {partner.website && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Experiences</span>
                        <span className="font-semibold">{experiences.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conservation Impact</span>
                        <span className="font-semibold">245+ hectares protected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travelers Hosted</span>
                        <span className="font-semibold">1,283+</span>
                      </div>
                      {experiences.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Starting from</span>
                          <span className="font-semibold text-primary">
                            {formatPrice(Math.min(...experiences.map(e => e.price_kes_adult)))}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold text-foreground mb-2">
                    Support Conservation
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book an experience to directly support {partner.name}'s conservation work
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/browse?partner=${partner.slug}`}>
                      Browse Experiences
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDynamic;