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

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
    <div className="min-h-screen bg-background">
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
                  <Badge className={getThemeColor(experience.theme)}>
                    {experience.theme}
                  </Badge>
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{experience.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {experience.location_text}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Up to {experience.capacity} people
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">${experience.base_price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Link to={`/partner/${project.slug}`}>
                    <Badge variant="outline" className="hover:bg-muted">
                      By {project.name}
                    </Badge>
                  </Link>
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
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Number of People</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={experience.capacity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>${experience.base_price} × {quantity} person{quantity > 1 ? 's' : ''}</span>
                      <span>${experience.base_price * quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${experience.base_price * quantity}</span>
                    </div>
                  </div>

                  <Link to={`/checkout?experience=${experience.id}&quantity=${quantity}`}>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center">
                    You won't be charged yet. Complete booking on next page.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;