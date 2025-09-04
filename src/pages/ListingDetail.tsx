import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Calendar, Star, ArrowLeft } from "lucide-react";
import { EXPERIENCES } from "@/data/partners";

export default function ListingDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const experience = EXPERIENCES.find(exp => exp.slug === slug);
  
  if (!experience) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
          <Button asChild>
            <Link to="/listings">Back to Listings</Link>
          </Button>
        </div>
      </main>
    );
  }

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'wildlife':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'marine':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'community':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'culture':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-muted/20';
    }
  };

  return (
    <main id="site-main">
      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={experience.images[0]} 
          alt={experience.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/img/ph1.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6">
          <Button variant="outline" size="sm" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20 mb-4">
            <Link to="/listings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.themes.map((theme) => (
                  <Badge key={theme} className={getThemeColor(theme)}>
                    <Link to={`/themes/${theme}`} className="hover:underline">
                      {theme}
                    </Link>
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{experience.title}</h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span>(24 reviews)</span>
                </div>
                <span>•</span>
                <Link 
                  to={`/partners/${experience.partner.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="hover:text-primary transition-colors"
                >
                  {experience.partner}
                </Link>
              </div>
            </div>

            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-1">
                  {experience.images.slice(1, 4).map((image, index) => (
                    <div key={index} className="aspect-video bg-muted">
                      <img 
                        src={image} 
                        alt={`${experience.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/img/ph1.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Immerse yourself in {experience.title.toLowerCase()} with our expert guides. This unique conservation experience combines education, adventure, and direct impact on local communities and wildlife protection efforts. You'll gain hands-on experience in conservation work while contributing to meaningful environmental protection in {experience.destination.replace(/-/g, ' ')}.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium mb-3">What's Included</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Expert guide throughout the experience</li>
                      <li>• All necessary equipment and materials</li>
                      <li>• Traditional Kenyan lunch</li>
                      <li>• Transportation to/from meeting point</li>
                      <li>• Digital photo package</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Important Information</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Suitable for ages 12 and above</li>
                      <li>• Moderate fitness level required</li>
                      <li>• Weather dependent - full refund if cancelled</li>
                      <li>• Small groups (max 8 participants)</li>
                      <li>• Please bring sun protection and water</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Experience Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {experience.activities.map((activity) => (
                    <Badge key={activity} variant="outline" className="capitalize">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">$120</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>4-6 hours</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <input 
                      type="date" 
                      className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Guests</label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background">
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5 guests</option>
                      <option value="6">6 guests</option>
                      <option value="7">7 guests</option>
                      <option value="8">8 guests</option>
                    </select>
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Book Now
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Free cancellation up to 24 hours before
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base price</span>
                    <span>$120</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conservation fee</span>
                    <span>$15</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total</span>
                    <span>$135</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground capitalize">
                  {experience.destination.replace(/-/g, ' ')}, Kenya
                </div>
                <div className="h-32 bg-muted rounded-md mt-3 flex items-center justify-center">
                  <span className="text-muted-foreground">Map placeholder</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}