import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Camera } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { mockExperiences } from '@/data/mockData';

export default function ExperienceDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const experience = mockExperiences.find(exp => exp.slug === slug);
  
  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
          <p className="text-muted-foreground">The experience you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={experience.images[0]} 
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {experience.theme}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{experience.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{experience.location_text}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Experience</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </CardContent>
            </Card>

            {/* Gallery */}
            {experience.images && experience.images.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5" />
                    <h2 className="text-2xl font-bold">Gallery</h2>
                  </div>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {experience.images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`${experience.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(experience.base_price)}
                  </div>
                  <div className="text-sm text-muted-foreground">per adult</div>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground">
                      Booking system removed
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      New booking flow will be implemented
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: 15 people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration varies by experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}