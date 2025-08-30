import { CheckCircle, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams } from "react-router-dom";
import { mockExperiences, mockProjects } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";
import { makeImpactSummary } from "@/lib/impactSummary";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const experienceSlug = searchParams.get('experience');
  const quantity = parseInt(searchParams.get('qty') || '1');
  const travelerName = searchParams.get('traveler_name') || 'Guest';

  const experience = mockExperiences.find(exp => exp.slug === experienceSlug);
  const project = experience ? mockProjects.find(proj => proj.id === experience.project_id) : null;

  if (!experience || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Booking not found</h1>
          <Link to="/browse">
            <Button>Browse Experiences</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalAmount = experience.base_price * quantity;
  
  // Generate impact summary using the library
  const impactSummary = makeImpactSummary({
    title: experience.title,
    location: experience.location_text,
    date: new Date().toLocaleDateString(),
    people: quantity,
    unitPriceKES: experience.base_price,
    currency: "KES"
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you {travelerName}, your conservation experience has been successfully booked.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{experience.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {experience.location_text}
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {experience.theme}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Travelers:</span>
                  <div className="flex items-center mt-1">
                    <Users className="w-4 h-4 mr-1" />
                    {quantity} {quantity === 1 ? 'person' : 'people'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amount:</span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatPrice(totalAmount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Allocation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">  
                {impactSummary.lines.map((line, index) => (
                  <p key={index} className="text-muted-foreground">• {line}</p>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To {project.name}:</span>
                    <span className="font-semibold text-foreground">{formatPrice(impactSummary.numbers.partner)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform & Operations:</span>
                    <span className="font-semibold text-foreground">{formatPrice(impactSummary.numbers.platform)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-primary font-medium bg-primary/5 p-3 rounded-lg">
                  Your contribution directly supports {project.name} and their conservation efforts in {project.location_text}.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• You'll receive a confirmation email with detailed information about your experience</p>
                <p>• The conservation partner will contact you 48 hours before your experience</p>
                <p>• After your experience, you'll be able to view the impact created in your Impact Ledger</p>
                <p>• You'll receive updates on how your contribution is making a difference</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link to="/impact-ledger">
              <Button variant="outline">View Impact Ledger</Button>
            </Link>
            <Link to="/browse">
              <Button className="bg-primary hover:bg-primary-hover">
                Browse More Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingSuccess;