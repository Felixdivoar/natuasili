import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BookingState {
  experienceSlug: string;
  date: string | null;
  adults: number;
  children: number;
  selectedOption: 'standard' | 'premium';
  totalPrice: number;
}

interface BookingContextType {
  bookingState: BookingState | null;
  setBookingState: (state: BookingState | null) => void;
  updateBookingState: (updates: Partial<BookingState>) => void;
  clearBookingState: () => void;
  hasActiveBooking: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const BOOKING_STORAGE_KEY = 'natuasili_booking_state';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingState, setBookingStateInternal] = useState<BookingState | null>(null);

  // Load booking state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookingStateInternal(parsed);
      } catch (error) {
        console.error('Failed to parse saved booking state:', error);
        localStorage.removeItem(BOOKING_STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever booking state changes
  useEffect(() => {
    if (bookingState) {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingState));
    } else {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }, [bookingState]);

  const setBookingState = (state: BookingState | null) => {
    setBookingStateInternal(state);
  };

  const updateBookingState = (updates: Partial<BookingState>) => {
    if (bookingState) {
      setBookingStateInternal({ ...bookingState, ...updates });
    }
  };

  const clearBookingState = () => {
    setBookingStateInternal(null);
  };

  const hasActiveBooking = bookingState !== null && bookingState.date !== null;

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setBookingState,
        updateBookingState,
        clearBookingState,
        hasActiveBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}