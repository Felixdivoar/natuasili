import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  ExternalLink,
  Users,
  Shield,
  TreePine,
  Calendar,
  Heart,
  TrendingUp,
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

const PartnerDynamic = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();
  const { t } = useI18n();
  
  const [partner, setPartner] = useState<Partner | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [realTimeStats, setRealTimeStats] = useState({
    totalBookings: 0,
    totalTravelers: 0,
    hectaresProtected: 0,
    conservationFunding: 0
  });

  useEffect(() => {
    if (!slug) return;
    loadPartnerData();
  }, [slug]);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      
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

      if (partnerData?.id) {
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select('id, title, slug, hero_image, gallery, description, location_text, themes, activities, price_kes_adult, visible_on_marketplace')
          .eq('partner_id', partnerData.id)
          .eq('visible_on_marketplace', true)
          .order('title');

        if (!experiencesError && experiencesData) {
          setExperiences(experiencesData);
        }

        // Load real-time stats from bookings
        const experienceIds = experiencesData?.map(e => e.id) || [];
        if (experienceIds.length > 0) {
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('total_kes, adults, children')
            .in('experience_id', experienceIds)
            .in('status', ['confirmed', 'completed']);

          if (bookingsData) {
            const totalTravelers = bookingsData.reduce((sum, b) => sum + (b.adults || 0) + (b.children || 0), 0);
            const totalFunding = bookingsData.reduce((sum, b) => sum + (b.total_kes || 0), 0);
            
            setRealTimeStats({
              totalBookings: bookingsData.length,
              totalTravelers: totalTravelers,
              hectaresProtected: Math.floor(totalFunding / 10000), // Estimate: 10K KES = 1 hectare
              conservationFunding: totalFunding * 0.9 // 90% goes to conservation
            });
          }
        }
      }

    } catch (err) {
      console.error('Error loading partner:', err);
      setError('Failed to load partner data');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="container mx-auto px-4 py-20">
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

  // Get stats from partner.stats or use zeros
  const displayStats = {
    yearsActive: partner.stats?.years_active || partner.stats?.years || 0,
    wildlifeSaved: partner.stats?.wildlife_saved || partner.stats?.animals_saved || 0,
    householdsSupported: partner.stats?.households_supported || partner.stats?.households || 0,
    hectaresProtected: partner.stats?.hectares_protected || partner.stats?.hectares || realTimeStats.hectaresProtected || 0
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags 
        title={partner.name}
        description={partner.short_bio || partner.tagline}
      />
      
      {/* Hero Section - Simplified */}
      <section 
        className="relative h-[60vh] min-h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${getPartnerHeroImage()})`
        }}
      >
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/20">
              <Link to="/partners">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Partners
              </Link>
            </Button>

            <div className="flex items-center gap-6 mb-4">
              {partner.logo_image_url && (
                <div className="w-24 h-24 bg-white rounded-xl p-3 shadow-lg flex-shrink-0">
                  <img 
                    src={partner.logo_image_url} 
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {partner.name}
                </h1>
                {partner.tagline && (
                  <p className="text-lg text-white/90 mb-2">
                    {partner.tagline}
                  </p>
                )}
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.location_text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Real-Time Impact Stats - Prominent Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Conservation Impact</h2>
            <p className="text-muted-foreground">Real-time metrics of our conservation efforts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Years Active */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {displayStats.yearsActive}+
              </div>
              <div className="text-sm text-muted-foreground">
                Years Active
              </div>
            </Card>

            {/* Wildlife Protected */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {displayStats.wildlifeSaved > 0 ? displayStats.wildlifeSaved.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-muted-foreground">
                Wildlife Protected
              </div>
            </Card>

            {/* Hectares Protected */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <TreePine className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {displayStats.hectaresProtected.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Hectares Protected
              </div>
            </Card>

            {/* Households Supported */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">
                {displayStats.householdsSupported > 0 ? displayStats.householdsSupported.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-muted-foreground">
                Households Supported
              </div>
            </Card>
          </div>

          {/* Additional Real-Time Stats Row */}
          {realTimeStats.totalBookings > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <Card className="text-center p-6">
                <Heart className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {realTimeStats.totalTravelers.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Travelers Hosted
                </div>
              </Card>

              <Card className="text-center p-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {realTimeStats.totalBookings.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Bookings Completed
                </div>
              </Card>

              <Card className="text-center p-6">
                <Shield className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {formatPrice(realTimeStats.conservationFunding)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Conservation Funding
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* About Section - Clean & Simple */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">About {partner.name}</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {partner.short_bio}
            </p>
            {partner.long_bio && partner.long_bio !== partner.short_bio && (
              <p className="text-muted-foreground leading-relaxed">
                {partner.long_bio}
              </p>
            )}
          </div>

          {/* Contact Info - Inline */}
          <div className="flex flex-wrap gap-4 mt-6">
            {partner.contact_email && (
              <a 
                href={`mailto:${partner.contact_email}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {partner.contact_email}
              </a>
            )}
            {partner.website && (
              <a 
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Experiences Grid - Modern Cards */}
        {experiences.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Available Experiences</h2>
              <Button variant="outline" asChild>
                <Link to={`/browse?partner=${partner.slug}`}>
                  View All
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.slice(0, 6).map((experience) => (
                <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img 
                      src={experience.hero_image || '/img/ph1.jpg'} 
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Array.isArray(experience.themes) && experience.themes.slice(0, 2).map((theme) => (
                        <Badge key={theme} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-lg">
                      {experience.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{experience.location_text}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">From</div>
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(experience.price_kes_adult)}
                        </div>
                      </div>
                      <Button asChild>
                        <Link to={`/experience/${experience.slug}`}>
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Support {partner.name}'s Conservation Work
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every booking directly supports conservation efforts and local communities. Join us in protecting Kenya's incredible wildlife and ecosystems.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to={`/browse?partner=${partner.slug}`}>
                  Explore All Experiences
                </Link>
              </Button>
              {partner.website && (
                <Button size="lg" variant="outline" asChild>
                  <Link to={partner.website} target="_blank" rel="noopener noreferrer">
                    Learn More
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDynamic;