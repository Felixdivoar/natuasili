import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { EXPERIENCES } from "@/data/partners";
import { CartProvider } from "@/contexts/CartContext";
import StickyReserveButton from "@/components/StickyReserveButton";
import NewAuthModal from "@/components/NewAuthModal";
import BookingWizardNew from "@/components/BookingWizardNew";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nProvider";
import { supabase } from "@/integrations/supabase/client";
import MetaTags from "@/components/MetaTags";
import ModernExperienceLayout from "@/components/ModernExperienceLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
  const { t } = useI18n();
  const experience = EXPERIENCES.find(exp => exp.slug === slug);

  // Helper function to validate UUID format
  const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Fetch real-time review stats for header
  const fetchReviewStats = async (experienceId: string) => {
    try {
      if (!isValidUUID(experienceId)) {
        setReviewStats({
          averageRating: 0,
          totalReviews: 0
        });
        return;
      }
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('experience_id', experienceId);
      
      if (error) throw error;
      
      const totalReviews = data?.length || 0;
      const averageRating = totalReviews > 0 ? 
        data.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
      
      setReviewStats({
        averageRating,
        totalReviews
      });
    } catch (err) {
      console.error('Error fetching review stats:', err);
      setReviewStats({
        averageRating: 0,
        totalReviews: 0
      });
    }
  };

  // Check if experience is in wishlist
  const checkWishlistStatus = async (experienceId: string) => {
    if (!user || !experienceId) return;
    
    try {
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('experience_id', experienceId)
        .maybeSingle();
      
      setIsInWishlist(!!data);
    } catch (error) {
      // Not in wishlist or error occurred
      setIsInWishlist(false);
    }
  };

  // Set up real-time subscription for review stats
  useEffect(() => {
    if (!experience?.id) return;

    // Initial fetch
    fetchReviewStats(experience.id);
    checkWishlistStatus(experience.id);

    // Skip real-time subscription for non-UUID IDs
    if (!isValidUUID(experience.id)) {
      return;
    }

    // Set up real-time subscription
    const statsSubscription = supabase
      .channel('review-stats-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: `experience_id=eq.${experience.id}`
      }, () => fetchReviewStats(experience.id))
      .subscribe();
    
    return () => {
      supabase.removeChannel(statsSubscription);
    };
  }, [experience?.id, user]);

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The experience you're looking for doesn't exist.
          </p>
          <Link to="/marketplace">
            <Button>Browse All Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error('Please sign in to save to wishlist');
      return;
    }
    
    if (!experience?.id) return;
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experience.id);
        
        if (!error) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            experience_id: experience.id
          });
        
        if (!error) {
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Something went wrong');
    }
  };

  const handleBookNowClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <CartProvider 
      experienceSlug={experience.slug} 
      basePrice={experience.priceKESAdult || 350} 
      childHalfPriceRule={experience.childHalfPriceRule || false} 
      isGroupPricing={false} 
      minCapacity={1}
    >
      <MetaTags 
        title={`${experience.title} | Natuasili Conservation Experience`}
        description={`Book your ${experience.title} conservation experience in ${experience.locationText}. ${experience.description.slice(0, 120)}...`}
        keywords={`${experience.themes.join(', ')}, conservation, ${experience.locationText}, Kenya experiences`}
      />
      
      <ModernExperienceLayout
        experience={experience}
        reviewStats={reviewStats}
        isInWishlist={isInWishlist}
        onWishlistClick={handleWishlistClick}
        onBookingClick={handleBookNowClick}
      />

      {/* Sticky Reserve Button */}
      <StickyReserveButton 
        experienceSlug={experience.slug}
        experienceName={experience.title}
        basePrice={experience.priceKESAdult || 350}
        onReserveClick={handleBookNowClick}
      />

      {/* Modals */}
      <NewAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <BookingWizardNew 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        experience={experience} 
      />
    </CartProvider>
  );
}