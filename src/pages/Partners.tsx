import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ExternalLink } from "lucide-react";
import { expandedPartnerProfiles } from "@/data/partnerProfiles";
export default function Partners() {
  // Hide any global booking overlay if it was left open
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".na-cta-bar,.na-btn-book-fab,.booking-modal").forEach(el => el.style.display = "");
  }, []);
  const getThemeColor = (category: string) => {
    switch (category) {
      case 'Wildlife Conservation':
        return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Habitat':
        return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Conservation Education':
        return 'bg-education/10 text-education border-education/20';
      case 'Livelihoods':
        return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return <main id="site-main" className="page-content">
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our conservation partners</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the incredible organizations we work with to create lasting conservation impact across Kenya. 
            Each partner brings unique expertise and local knowledge to protect wildlife, habitats, and communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expandedPartnerProfiles.map(partner => <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img src={partner.gallery[0]} alt={partner.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`text-xs ${getThemeColor(partner.category)}`}>
                    {partner.category}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Est. {partner.established}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{partner.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{partner.location}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {partner.mission}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jobs Created</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="font-medium">{partner.communityImpact.jobs}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link to={`/partner/${partner.slug}`}>
                        View Profile
                      </Link>
                    </Button>
                    {partner.contact.email && <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${partner.contact.email}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-muted/50">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold mb-3">Become a partner</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join our network of conservation partners and connect your organization with travelers who want to make a difference.
              </p>
              <Button size="lg">Partner with us</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>;
}