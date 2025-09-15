import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useCartActivity(cartId?: string) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  // Update cart expiry in database
  const updateCartExpiry = useCallback(async () => {
    if (!cartId) return;

    try {
      const { error } = await supabase
        .from('carts')
        .update({ 
          expires_at: new Date(Date.now() + INACTIVITY_TIMEOUT).toISOString() 
        })
        .eq('id', cartId);

      if (error) {
        console.error('Failed to update cart expiry:', error);
      }
    } catch (error) {
      console.error('Error updating cart expiry:', error);
    }
  }, [cartId]);

  // Clear expired cart locally
  const clearExpiredCart = useCallback(async () => {
    if (!cartId) return;

    try {
      // Call the cleanup function to remove expired carts
      await supabase.functions.invoke('cleanup-expired-carts');
      
      // Optionally refresh the page or update UI to reflect cart removal
      console.log('Cart expired and cleared due to inactivity');
      
      // You might want to trigger a cart refresh or show a message to the user
    } catch (error) {
      console.error('Error clearing expired cart:', error);
    }
  }, [cartId]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity timestamp
    lastActivityRef.current = Date.now();

    // Update cart expiry in database
    updateCartExpiry();

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      clearExpiredCart();
    }, INACTIVITY_TIMEOUT);
  }, [updateCartExpiry, clearExpiredCart]);

  // Track user activity
  const trackActivity = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Set up activity listeners
  useEffect(() => {
    if (!cartId) return;

    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Throttle activity tracking to avoid too many database calls
    let throttleTimeout: NodeJS.Timeout;
    const throttledTrackActivity = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        trackActivity();
        clearTimeout(throttleTimeout);
        throttleTimeout = null as any;
      }, 30000); // Update every 30 seconds max
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, throttledTrackActivity, true);
    });

    // Initialize timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, throttledTrackActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [cartId, trackActivity, resetInactivityTimer]);

  // Manual activity trigger (for programmatic cart interactions)
  const triggerActivity = useCallback(() => {
    trackActivity();
  }, [trackActivity]);

  return {
    triggerActivity,
    remainingTime: () => {
      const elapsed = Date.now() - lastActivityRef.current;
      return Math.max(0, INACTIVITY_TIMEOUT - elapsed);
    }
  };
}