import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { partnerSuccessStories } from "@/data/partnerProfiles";

const PartnerSuccessStory = () => {
  const { slug } = useParams();
  const story = partnerSuccessStories.find(s => s.slug === slug);

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 section-padding-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Success story not found</h1>
          <Link to="/partners">
            <Button>Return to Partners</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wildlife Conservation': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Economic Impact': return 'bg-accent/10 text-accent border-accent/20';
      case 'Habitat Protection': return 'bg-habitat/10 text-habitat border-habitat/20';
      case 'Anti-Poaching Success': return 'bg-primary/10 text-primary border-primary/20';
      case 'Urban Conservation': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/partners">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {story.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {story.partnerName}
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="aspect-[16/9] bg-muted relative overflow-hidden rounded-lg">
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: story.fullStory }}
              className="text-foreground"
            />
          </div>

          <div className="bg-accent/10 rounded-lg p-8 text-center">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Experience {story.partnerName} Yourself</h3>
              <p className="text-muted-foreground mb-6">
                Ready to create your own conservation impact? Explore experiences with {story.partnerName}.
              </p>
              <Link to="/browse">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Browse Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PartnerSuccessStory;