import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! This page couldn't be found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Button size="lg" className="px-8">
              Return to Home
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/marketplace">
              <Button variant="outline" size="sm">Marketplace</Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="sm">Partners</Button>
            </Link>
            <Link to="/impact-ledger">
              <Button variant="outline" size="sm">Impact Ledger</Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" size="sm">Destinations</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
