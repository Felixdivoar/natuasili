import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper from "@/components/BookingStepper";

const Checkout = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const [holdTimer, setHoldTimer] = useState(29 * 60 + 59); // 29:59
  
  const experience = mockExperiences.find(exp => exp.slug === slug);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;
  
  // Hold timer countdown
  useEffect(() => {
    if (holdTimer > 0) {
      const timer = setTimeout(() => setHoldTimer(holdTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [holdTimer]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
            <p className="text-muted-foreground mb-6">The experience you're trying to book doesn't exist.</p>
            <Link to="/browse">
              <Button>Browse Experiences</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header with timer */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/experience/${slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to experience
            </Link>
            {holdTimer > 0 && (
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>Hold expires in {formatTime(holdTimer)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Complete your booking</h1>
                <p className="text-muted-foreground">Secure your spot for this conservation experience</p>
              </div>
              
              <BookingStepper experience={experience} project={project} />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Experience preview */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={experience.images[0]} 
                        alt={experience.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className={`mb-1 ${getThemeColor(experience.theme)}`}>
                        {experience.theme}
                      </Badge>
                      <h3 className="font-medium text-sm leading-tight">{experience.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location_text}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{experience.duration_hours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected options would go here */}
                  <div className="text-sm text-muted-foreground">
                    <p>Date: {searchParams.get('date') || 'Select date'}</p>
                    <p>People: {searchParams.get('people') || '1'}</p>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Experience cost</span>
                      <span>{formatPrice(experience.base_price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>People × {searchParams.get('people') || '1'}</span>
                      <span>{formatPrice(experience.base_price * parseInt(searchParams.get('people') || '1'))}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(experience.base_price * parseInt(searchParams.get('people') || '1'))}</span>
                    </div>
                  </div>

                  {/* Security badges */}
                  <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1">  
                      <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs">i</span>
                      </div>
                      <span>Free cancellation</span>
                    </div>
                  </div>
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

export default Checkout;