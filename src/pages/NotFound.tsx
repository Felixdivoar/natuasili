import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import T from "@/i18n/T";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  const location = useLocation();
  usePageTitle("title_not_found");

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
        <p className="text-xl text-muted-foreground mb-8"><T k="not_found_title" /></p>
        <p className="text-sm text-muted-foreground mb-8">
          <T k="not_found_message" />
        </p>
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Button size="lg" className="px-8">
              <T k="btn_return_home" />
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/marketplace">
              <Button variant="outline" size="sm"><T k="nav_marketplace" /></Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="sm"><T k="nav_partners" /></Button>
            </Link>
            <Link to="/impact-ledger">
              <Button variant="outline" size="sm"><T k="nav_impact" /></Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" size="sm"><T k="nav_destinations" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
