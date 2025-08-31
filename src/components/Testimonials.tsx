import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const Testimonials = () => {
  const { t } = useI18n();

  const travelerTestimonials = [
    {
      name: "Sarah Johnson",
      location: "London, UK",
      quote: t("The elephant tracking experience was incredible. Knowing that 90% of my booking directly funded anti-poaching efforts made it even more meaningful.", "The elephant tracking experience was incredible. Knowing that 90% of my booking directly funded anti-poaching efforts made it even more meaningful."),
      experience: t("Elephant Tracking", "Elephant Tracking"),
      rating: 5
    },
    {
      name: "Michael Chen", 
      location: "Toronto, Canada",
      quote: t("NatuAsili connected me with authentic conservation work. I planted 5 trees and learned so much about forest restoration from local experts.", "NatuAsili connected me with authentic conservation work. I planted 5 trees and learned so much about forest restoration from local experts."),
      experience: t("Forest Conservation", "Forest Conservation"),
      rating: 5
    }
  ];

  const partnerTestimonial = {
    name: "Dr. Sarah Kipkoech",
    organization: "Maasai Mara Wildlife Conservancy",
    quote: t("NatuAsili has revolutionized how we fund our conservation work. The 90/10 model ensures maximum impact, and we've been able to hire 12 additional rangers thanks to the steady funding from traveler bookings.", "NatuAsili has revolutionized how we fund our conservation work. The 90/10 model ensures maximum impact, and we've been able to hire 12 additional rangers thanks to the steady funding from traveler bookings."),
    impact: t("12 new rangers hired", "12 new rangers hired")
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("What Our Community Says", "What Our Community Says")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("Real stories from travelers and conservation partners making a difference together", "Real stories from travelers and conservation partners making a difference together")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traveler Testimonials */}
          {travelerTestimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-5 w-5 text-primary mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{testimonial.location}</div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.experience}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Partner Testimonial - Larger card */}
          <Card className="lg:row-span-1 hover:shadow-lg transition-shadow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Quote className="h-5 w-5 text-primary mr-2" />
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {t("Conservation Partner", "Conservation Partner")}
                </Badge>
              </div>
              
              <blockquote className="text-muted-foreground mb-4 italic text-lg">
                "{partnerTestimonial.quote}"
              </blockquote>
              
              <div className="border-t pt-4">
                <div className="font-semibold text-lg">{partnerTestimonial.name}</div>
                <div className="text-sm text-muted-foreground mb-3">{partnerTestimonial.organization}</div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <span className="mr-1">🎯</span>
                  {partnerTestimonial.impact}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;