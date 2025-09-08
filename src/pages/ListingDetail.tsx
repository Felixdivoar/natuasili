import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  
  // Mock data - replace with actual data fetching
  const listing = {
    id: id,
    title: "Giraffe Conservation Experience",
    location: "Nairobi National Park",
    price: 2500,
    duration: "3 hours",
    capacity: 12,
    images: ["/images/placeholder-1.jpg"],
    description: "Join us for an unforgettable giraffe conservation experience where you'll learn about these magnificent creatures and contribute to their protection.",
    highlights: [
      "Meet rescued giraffes",
      "Learn about conservation efforts", 
      "Feed the giraffes",
      "Educational tour"
    ],
    includes: [
      "Professional guide",
      "All activities",
      "Light refreshments"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px]">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{listing.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Experience</h2>
                <p className="text-muted-foreground mb-6">{listing.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {listing.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-2">
                      {listing.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    KES {listing.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                  <p className="text-muted-foreground">
                    Booking system removed
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    New booking flow will be implemented
                  </p>
                </div>
  
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Duration: {listing.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Max capacity: {listing.capacity} people</span>
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