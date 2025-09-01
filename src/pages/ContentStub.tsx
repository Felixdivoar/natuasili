import { Link, useParams } from "react-router-dom";

export default function ContentStub() {
  const { slug, theme } = useParams();
  
  const getTitle = () => {
    if (theme) return `${theme.charAt(0).toUpperCase()}${theme.slice(1)} Theme`;
    if (slug) return `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Destination`;
    return "Content Coming Soon";
  };

  const getDescription = () => {
    if (theme) return `Explore conservation experiences focused on ${theme}.`;
    if (slug) return `Discover conservation experiences in ${slug}.`;
    return "This page is being developed with exciting content.";
  };

  return (
    <div className="na-container section">
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">{getTitle()}</h1>
        <p className="text-muted-foreground mb-8">{getDescription()}</p>
        <p className="text-sm text-muted-foreground mb-8">
          This page is being expanded—check back soon for detailed content.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/marketplace" 
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Browse Experiences
          </Link>
          <Link 
            to="/" 
            className="rounded-md border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}