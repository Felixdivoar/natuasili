import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('na_cookie_accept');
    if (!hasAcceptedCookies) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('na_cookie_accept', '1');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <span>We use cookies to improve your experience. By using NatuAsili, you accept our cookie use.</span>
      <Link to="/cookie-policy" target="_blank" rel="noopener">
        Learn more
      </Link>
      <Button className="btn" onClick={acceptCookies}>
        Accept
      </Button>
    </div>
  );
};

export default CookieBanner;