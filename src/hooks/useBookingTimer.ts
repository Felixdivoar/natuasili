import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface BookingTimerState {
  timeRemaining: number; // seconds
  isActive: boolean;
  isExpired: boolean;
}

export const useBookingTimer = (onExpire?: () => void) => {
  const [state, setState] = useState<BookingTimerState>({
    timeRemaining: 0,
    isActive: false,
    isExpired: false,
  });

  const startTimer = useCallback(() => {
    setState({
      timeRemaining: 10 * 60, // 10 minutes in seconds
      isActive: true,
      isExpired: false,
    });
    
    toast.info("Your booking will be held for 10 minutes. Complete checkout to secure it.", {
      duration: 5000,
    });
  }, []);

  const stopTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  const clearTimer = useCallback(() => {
    setState({
      timeRemaining: 0,
      isActive: false,
      isExpired: false,
    });
  }, []);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            // Timer expired
            toast.error("Booking session expired. Please start again.", {
              duration: 6000,
            });
            
            onExpire?.();
            
            return {
              timeRemaining: 0,
              isActive: false,
              isExpired: true,
            };
          }
          
          // Warn when 2 minutes left
          if (newTimeRemaining === 120) {
            toast.warning("Only 2 minutes left to complete your booking!", {
              duration: 4000,
            });
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isActive, state.timeRemaining, onExpire]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    startTimer,
    stopTimer,
    clearTimer,
    formatTime: formatTime(state.timeRemaining),
  };
};