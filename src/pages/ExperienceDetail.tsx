import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Clock, Star, Heart, Share, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import MapComponent from "@/components/MapComponent";
import { useInteractiveBookingForm } from "@/components/InteractiveBookingForm";

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();
  
  // Initialize interactive booking form functionality
  useInteractiveBookingForm();

  const experience = mockExperiences.find(exp => exp.slug === slug);
  const project = experience ? mockProjects.find(p => p.id === experience.project_id) : null;

  if (!experience || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Experience Not Found</h1>
          <Link to="/browse">
            <Button>Browse Experiences</Button>
          </Link>
        </div>
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % experience.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + experience.images.length) % experience.images.length);
  };

  return (
    <div className="min-h-screen bg-background experience-booking">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-primary">Browse</Link>
          <span>/</span>
          <span className="text-foreground">{experience.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="aspect-[16/10] relative bg-muted rounded-lg overflow-hidden">
                {experience.images[currentImageIndex] && (
                  <img
                    src={experience.images[currentImageIndex]}
                    alt={`${experience.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {experience.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Link
                    to={`/marketplace?theme=${encodeURIComponent(experience.theme.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="theme-chip bg-black text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    {experience.theme}
                  </Link>
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {experience.activity_type}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {experience.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {experience.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Info */}
            <div className="space-y-6">
              <div>
                <div className="experience-header mb-4">
                  <h1 className="title text-3xl font-bold text-foreground mb-2">{experience.title}</h1>
                  <div className="meta text-muted-foreground">
                    <div className="location flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location_text}
                    </div>
                    <div className="capacity flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Up to {experience.capacity} people
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="text-right">
                    <div className="border border-border px-4 py-2 rounded-lg shadow-md price-wrap">
                      <div className="booking-price font-bold text-foreground whitespace-nowrap">{formatPrice(experience.base_price)}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    By <span className="partner-name">{project.name}</span>
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.8 (24 reviews)</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Allocation Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How Your Payment Makes Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="font-medium">Goes to {project.name}</span>
                      <span className="font-bold text-primary">{experience.allocation_pct_project}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Platform & Operations</span>
                      <span className="font-bold">{experience.allocation_pct_platform}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    This transparent allocation ensures your money directly supports conservation efforts and local communities.
                  </p>
                </CardContent>
              </Card>

              {/* Tabs for Additional Info */}
              <Tabs defaultValue="includes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="includes">What's Included</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="impact">Recent Impact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="includes" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Professional guide and equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Transportation to/from meeting point
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Conservation activity participation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          Impact report after completion
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Day 1: Introduction & Setup</h4>
                            <p className="text-muted-foreground text-sm">Meet the team, safety briefing, and begin conservation activities.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Day 2: Field Work</h4>
                            <p className="text-muted-foreground text-sm">Hands-on conservation work with local community members.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="impact" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-muted-foreground">2 days ago</p>
                            <p className="font-medium">Planted 50 indigenous trees in degraded habitat area</p>
                            <p className="text-sm text-muted-foreground">Funded by recent bookings</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                          <div>
                            <p className="text-sm text-muted-foreground">1 week ago</p>
                            <p className="font-medium">Installed 3 water points for wildlife corridor</p>
                            <p className="text-sm text-muted-foreground">Verified impact from traveler contributions</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Map Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapComponent 
                    longitude={36.8219}
                    latitude={-1.2921}
                    location={experience.location_text}
                    className="w-full h-64 rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <ReviewSection experienceId={experience.id} />
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Book This Experience
                    <Badge variant="outline">Available</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="booking">Booking</TabsTrigger>
                      <TabsTrigger value="checkout">Checkout</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="text-sm font-medium">2-3 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Group Size</span>
                          <span className="text-sm font-medium">Up to {experience.capacity} people</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Language</span>
                          <span className="text-sm font-medium">English, Swahili</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Difficulty</span>
                          <span className="text-sm font-medium">Easy</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                     <TabsContent value="booking" className="space-y-4 mt-4">
                       <div className="space-y-2">
                         <Label htmlFor="people">Number of People</Label>
                         <Input
                           id="people"
                           type="number"
                           min="1"
                           max={experience.capacity}
                           value={quantity}
                           onChange={(e) => setQuantity(Number(e.target.value))}
                           className="w-full"
                         />
                         <p className="text-xs text-muted-foreground">
                           Maximum {experience.capacity} people
                         </p>
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="date">Preferred Date</Label>
                         <Input
                           id="date"
                           type="date"
                           min={new Date().toISOString().split('T')[0]}
                           className="w-full"
                         />
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="time">Preferred Time</Label>
                         <select className="w-full px-3 py-2 border border-input rounded-md">
                           <option value="">Select time</option>
                           <option value="morning">Morning (8:00 AM)</option>
                           <option value="afternoon">Afternoon (2:00 PM)</option>
                           <option value="evening">Evening (5:00 PM)</option>
                         </select>
                       </div>
                     </TabsContent>
                    
                    <TabsContent value="checkout" className="space-y-4 mt-4">
                      <div className="border-t pt-4">
                        <div className="flex justify-between checkout-price mb-2">
                          <span>{formatPrice(experience.base_price)} × {quantity} person{quantity > 1 ? 's' : ''}</span>
                          <span>{formatPrice(experience.base_price * quantity)}</span>
                        </div>
                        <div className="flex justify-between checkout-price mb-2 text-muted-foreground">
                          <span>Service fee</span>
                          <span>{formatPrice(experience.base_price * quantity * 0.05)}</span>
                        </div>
                        <div className="flex justify-between font-bold checkout-total-price border-t pt-2">
                          <span>Total</span>
                          <span>{formatPrice(experience.base_price * quantity * 1.05)}</span>
                        </div>
                      </div>

                      <Link to={`/checkout?experience=${experience.id}&quantity=${quantity}`}>
                        <Button 
                          className="w-full" 
                          size="lg"
                          disabled={quantity >= experience.capacity}
                        >
                          {quantity >= experience.capacity ? "Booking Limit Reached" : "Proceed to Checkout"}
                        </Button>
                      </Link>

                      <p className="text-xs text-muted-foreground text-center">
                        You won't be charged yet. Complete booking on next page.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              
              {/* Quick Actions */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/projects/${project.id}`}>
                        <Users className="h-4 w-4 mr-2" />
                        View Partner Details
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/projects/${project.id}`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        See impact report
                      </Link>
                    </Button>
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

export default ExperienceDetail;