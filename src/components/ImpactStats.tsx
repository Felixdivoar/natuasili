import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Users, GraduationCap, Heart, DollarSign, Globe } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
const ImpactStats = () => {
  const {
    formatPrice
  } = useCurrency();
  const stats = [{
    icon: TreePine,
    value: "45,000",
    label: "Hectares Protected",
    color: "bg-habitat",
    description: "Wildlife habitats preserved through conservation efforts"
  }, {
    icon: Users,
    value: "1,200",
    label: "Communities Supported",
    color: "bg-livelihoods",
    description: "Local families benefiting from sustainable tourism"
  }, {
    icon: GraduationCap,
    value: "850",
    label: "Students Educated",
    color: "bg-education",
    description: "Children receiving environmental education"
  }, {
    icon: Heart,
    value: "120",
    label: "Species Monitored",
    color: "bg-wildlife",
    description: "Wildlife species under active protection"
  }, {
    icon: DollarSign,
    value: formatPrice(2100000),
    label: "Funds Distributed",
    color: "bg-accent",
    description: "Direct funding to conservation projects"
  }, {
    icon: Globe,
    value: "15",
    label: "Counties Reached",
    color: "bg-primary",
    description: "Kenyan counties with active projects"
  }];
  return <section id="impact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Conservation impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together with our partners and travelers, we're creating measurable 
            impact across Kenya's conservation landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default ImpactStats;