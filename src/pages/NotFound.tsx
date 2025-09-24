import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import T from "@/i18n/T";
import { usePageTitle } from "@/hooks/usePageTitle";
import MetaTags from "@/components/MetaTags";

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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <MetaTags 
        title="title_not_found"
        description="Page not found on NatuAsili conservation platform. Return to explore Kenya's wildlife experiences and sustainable tourism opportunities."
        keywords="404 error, page not found, NatuAsili, Kenya conservation, wildlife tourism"
      />
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 text-white">404</h1>
        <p className="text-xl text-white mb-8"><T k="not_found_title" /></p>
        <p className="text-sm text-gray-300 mb-8">
          <T k="not_found_message" />
        </p>
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Button size="lg" className="px-8 bg-white text-black hover:bg-gray-200">
              <T k="btn_return_home" />
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/marketplace">
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black"><T k="nav_marketplace" /></Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black"><T k="nav_partners" /></Button>
            </Link>
            <Link to="/impact-ledger">
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black"><T k="nav_impact" /></Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black"><T k="nav_destinations" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
