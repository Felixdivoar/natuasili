import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import T from "@/i18n/T";

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
      <span><T k="cookie_message" /></span>
      <Link to="/cookie-policy" target="_blank" rel="noopener">
        <T k="cookie_learn_more" />
      </Link>
      <Button className="btn" onClick={acceptCookies}>
        <T k="cookie_accept" />
      </Button>
    </div>
  );
};

export default CookieBanner;