import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, CreditCard, MapPin, Users, Calendar } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const experienceId = searchParams.get("experience");
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const [formData, setFormData] = useState({
    travelerName: "",
    travelerEmail: "",
    travelerPhone: "",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const experience = mockExperiences.find(exp => exp.id === experienceId);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;

  if (!experience || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Booking</h1>
          <Link to="/browse">
            <Button>Browse Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = experience.base_price * quantity;
  const partnerAmount = Math.round(total * (experience.allocation_pct_project / 100));
  const platformAmount = total - partnerAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking creation
    toast({
      title: "Booking Confirmed!",
      description: "You'll receive a confirmation email shortly.",
    });

    // In real app, would redirect to payment processor or success page
    console.log("Booking data:", {
      experience: experience.id,
      quantity,
      total,
      traveler: formData,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/experience/${experience.slug}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your booking for {experience.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Traveler Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.travelerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelerName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.travelerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelerEmail: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.travelerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelerPhone: e.target.value }))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                        }
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreeMarketing}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeMarketing: checked as boolean }))
                        }
                      />
                      <Label htmlFor="marketing" className="text-sm leading-relaxed">
                        I'd like to receive updates about conservation impact and new experiences
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Confirm Booking - ${total}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Secure Booking</h3>
                    <p className="text-sm text-muted-foreground">
                      Your information is encrypted and secure. Payments processed by trusted partners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Experience Details */}
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-muted rounded-lg flex-shrink-0">
                    {experience.images[0] && (
                      <img
                        src={experience.images[0]}
                        alt={experience.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{experience.title}</h3>
                    <p className="text-sm text-muted-foreground">by {project.name}</p>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Location</span>
                    </div>
                    <span className="text-foreground">{experience.location_text}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Travelers</span>
                    </div>
                    <span className="text-foreground">{quantity} person{quantity > 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Date</span>
                    </div>
                    <span className="text-foreground">To be arranged</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>${experience.base_price} × {quantity} person{quantity > 1 ? 's' : ''}</span>
                    <span>${total}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <Separator />

                {/* Impact Allocation */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How Your Money Creates Impact</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">To {project.name}</div>
                        <div className="text-xs text-muted-foreground">Direct conservation funding</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">${partnerAmount}</div>
                        <div className="text-xs text-muted-foreground">{experience.allocation_pct_project}%</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Platform & Operations</div>
                        <div className="text-xs text-muted-foreground">Technology & support</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${platformAmount}</div>
                        <div className="text-xs text-muted-foreground">{experience.allocation_pct_platform}%</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    You'll receive impact updates showing exactly how your contribution is being used.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;