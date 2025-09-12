import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ChevronUp } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NewAuthModal from '@/components/NewAuthModal';

interface StickyReserveButtonProps {
  experienceSlug: string;
  experienceName: string;
  basePrice: number;
  onReserveClick?: () => void;
}

export default function StickyReserveButton({
  experienceSlug,
  experienceName,
  basePrice,
  onReserveClick
}: StickyReserveButtonProps) {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { bookingState, hasActiveBooking } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show button based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      
      // Show button when scrolling up or at top, hide when scrolling down
      setIsVisible(isScrollingUp || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Only show on the specific experience/listing page
  const isOnSameExperiencePage = location.pathname.includes(`/experience/${experienceSlug}`) || 
                                location.pathname.includes(`/listings/${experienceSlug}`);
  const shouldShow = isOnSameExperiencePage;
  
  const showActiveBooking = hasActiveBooking && bookingState?.date && 
                           bookingState?.experienceSlug === experienceSlug &&
                           isOnSameExperiencePage;

  if (!shouldShow) return null;

  const handleReserveClick = () => {
    if (onReserveClick) {
      onReserveClick();
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Navigate to experience page with availability section
    if (location.pathname !== `/experience/${experienceSlug}`) {
      navigate(`/experience/${experienceSlug}#availability`);
    } else {
      // Scroll to availability section if already on the page
      const availabilitySection = document.getElementById('availability');
      if (availabilitySection) {
        availabilitySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getButtonText = () => {
    if (showActiveBooking) {
      return 'Continue Booking';
    }
    return 'Reserve';
  };

  const getDisplayPrice = () => {
    if (showActiveBooking && bookingState?.totalPrice) {
      return formatPrice(bookingState.totalPrice);
    }
    return `from ${formatPrice(basePrice)}`;
  };

  return (
    <>
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50 
          lg:hidden 
          bg-background border-t border-border
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ 
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="p-4">
          {/* Booking Summary (if active and on same experience page) */}
          {showActiveBooking && (
            <div className="mb-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {bookingState.date}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {bookingState.adults + bookingState.children} people
                  </div>
                </div>
                <button
                  onClick={() => {
                    const availabilitySection = document.getElementById('availability');
                    if (availabilitySection) {
                      availabilitySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground">{experienceName}</div>
              <div className="font-semibold">{getDisplayPrice()}</div>
            </div>
            
            <Button 
              onClick={handleReserveClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 min-w-[120px]"
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <NewAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}