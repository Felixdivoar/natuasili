import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';
import { isValidBookingDate, formatDateForBooking, validateBookingDate } from '@/utils/time';

export interface CartState {
  experienceSlug: string;
  date: string;
  people: number;
  optionId: 'standard' | 'premium';
  unitPrice: number;
  subtotal: number;
  split: {
    partner90: number;
    platform10: number;
  };
  currency: string;
}

interface CartContextType {
  cart: CartState | null;
  updateCart: (updates: Partial<CartState>) => void;
  clearCart: () => void;
  isValid: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  experienceSlug: string;
  basePrice: number;
}

export const CartProvider: React.FC<CartProviderProps> = ({ 
  children, 
  experienceSlug, 
  basePrice 
}) => {
  const [searchParams] = useSearchParams();
  const { currency } = useCurrency();
  
  // Initialize cart with URL params if available
  const initializeCart = (): CartState => {
    const rawUrlDate = searchParams.get('date') || '';
    const urlDate = formatDateForBooking(rawUrlDate) || '';
    const urlPeople = parseInt(searchParams.get('people') || '1');
    const urlOption = (searchParams.get('option') as 'standard' | 'premium') || 'standard';
    
    const optionMultiplier = urlOption === 'premium' ? 1.3 : 1;
    const unitPrice = Math.round(basePrice * optionMultiplier);
    const subtotal = unitPrice * urlPeople;
    const partner90 = Math.round(subtotal * 0.9);
    const platform10 = subtotal - partner90;

    return {
      experienceSlug,
      date: urlDate,
      people: urlPeople,
      optionId: urlOption,
      unitPrice,
      subtotal,
      split: { partner90, platform10 },
      currency
    };
  };

  const [cart, setCart] = useState<CartState>(initializeCart);

  const updateCart = (updates: Partial<CartState>) => {
    setCart(prev => {
      if (!prev) return prev;
      
      const updated = { ...prev, ...updates };
      
      // Validate and format date if it's being updated
      if (updates.date !== undefined) {
        const formattedDate = formatDateForBooking(updates.date);
        if (formattedDate) {
          const validation = validateBookingDate(formattedDate);
          // Only store the date if it's valid, otherwise keep the previous date
          updated.date = validation.isValid ? formattedDate : prev.date;
        } else {
          updated.date = '';
        }
      }
      
      // Recalculate pricing if option or people changed
      if (updates.optionId || updates.people) {
        const optionMultiplier = updated.optionId === 'premium' ? 1.3 : 1;
        updated.unitPrice = Math.round(basePrice * optionMultiplier);
        updated.subtotal = updated.unitPrice * updated.people;
        updated.split.partner90 = Math.round(updated.subtotal * 0.9);
        updated.split.platform10 = updated.subtotal - updated.split.partner90;
      }
      
      return updated;
    });
  };

  const clearCart = () => {
    setCart(initializeCart());
  };

  const isValid = Boolean(
    cart?.date && 
    isValidBookingDate(cart.date) && 
    validateBookingDate(cart.date).isValid &&
    cart?.people > 0
  );

  // Update currency when it changes
  useEffect(() => {
    updateCart({ currency });
  }, [currency]);

  return (
    <CartContext.Provider value={{ cart, updateCart, clearCart, isValid }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};