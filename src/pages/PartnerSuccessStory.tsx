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
        <div className="container mx-auto px-4 py-16 text-center">
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
      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/partners">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
          
          <div className="mb-6">
            <Badge className={getCategoryColor(story.category)}>
              {story.category}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {story.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {story.teaser}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {story.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(story.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {story.readTime}
            </div>
          </div>

          <div className="mb-6">
            <Link 
              to={`/projects/${story.partnerId}`}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Read more about {story.partnerName} →
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        
        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          {story.fullStory.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Support {story.partnerName}</h3>
            <p className="text-muted-foreground mb-6">
              Book an experience and contribute directly to their conservation work.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={`/projects/${story.partnerId}`}>
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  View Partner Profile
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline">
                  Browse Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default PartnerSuccessStory;