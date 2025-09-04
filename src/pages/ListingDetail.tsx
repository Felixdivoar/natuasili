import { useParams, Link } from "react-router-dom";
import { EXPERIENCES } from "@/data/partners";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Clock, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";

export default function ListingDetail() {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const experience = EXPERIENCES.find(exp => exp.slug === slug);

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
          <p className="text-muted-foreground">The experience you're looking for doesn't exist.</p>
          <Link to="/listings">
            <Button className="mt-4">Browse All Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (bookingData: any) => {
    console.log("Booking submitted:", bookingData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/listings" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to experiences
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{experience.locationText || experience.destination.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{experience.partner}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {experience.themes.map((theme) => (
                    <Badge key={theme} variant="secondary" className="capitalize">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-lg overflow-hidden">
                  <img 
                    src={experience.gallery[selectedImageIndex] || experience.heroImage} 
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {experience.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">About This Experience</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm 
              experience={experience} 
              onBookingSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}