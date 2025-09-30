import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, Users, GraduationCap, Leaf, Heart, Shield } from "lucide-react";

const themes = [
  {
    id: 1,
    name: "Wildlife Conservation",
    description: "Protect endangered species and their habitats",
    icon: TreePine,
  },
  {
    id: 2,
    name: "Cultural Exploration", 
    description: "Discover and preserve indigenous knowledge and traditions",
    icon: Heart,
  },
  {
    id: 3,
    name: "Conservation Education",
    description: "Build awareness and knowledge for conservation",
    icon: GraduationCap,
  }
];

const ThemeTabs = () => {
  return (
    <section className="section-padding-lg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conservation Themes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose experiences that align with your conservation interests and values.
          </p>
        </div>

        <Tabs defaultValue="Wildlife Conservation" className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-2 bg-muted">
            {themes.map((theme) => (
              <TabsTrigger 
                key={theme.id} 
                value={theme.name}
                className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-background whitespace-nowrap"
              >
                <theme.icon className="h-4 w-4" />
                <span>{theme.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {themes.map((theme) => (
            <TabsContent key={theme.id} value={theme.name} className="text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-conservation text-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <theme.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {theme.name} Conservation
                </h3>
                <p className="text-muted-foreground">
                  {theme.description}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ThemeTabs;