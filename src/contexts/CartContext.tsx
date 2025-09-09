import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';
import { isValidBookingDate, formatDateForBooking, validateBookingDate } from '@/utils/time';

export interface CartState {
  experienceSlug: string;
  date: string;
  adults: number;
  children: number;
  optionId: 'standard';
  unitPrice: number;
  childPrice: number;
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
  childHalfPriceRule?: boolean;
}

export const CartProvider: React.FC<CartProviderProps> = ({ 
  children, 
  experienceSlug, 
  basePrice,
  childHalfPriceRule = false
}) => {
  const [searchParams] = useSearchParams();
  const { currency } = useCurrency();
  
  // Initialize cart with URL params if available
  const initializeCart = (): CartState => {
    const rawUrlDate = searchParams.get('date') || '';
    const urlDate = formatDateForBooking(rawUrlDate) || '';
    const urlAdults = parseInt(searchParams.get('adults') || searchParams.get('people') || '1');
    const urlChildren = parseInt(searchParams.get('children') || '0');
    const urlOption = (searchParams.get('option') as 'standard') || 'standard';
    
    const optionMultiplier = 1;  // Only standard option available
    const unitPrice = Math.round(basePrice * optionMultiplier);
    const childPrice = childHalfPriceRule ? Math.round(unitPrice * 0.5) : unitPrice;
    const subtotal = (unitPrice * urlAdults) + (childPrice * urlChildren);
    const partner90 = Math.round(subtotal * 0.9);
    const platform10 = subtotal - partner90;

    return {
      experienceSlug,
      date: urlDate,
      adults: urlAdults,
      children: urlChildren,
      optionId: urlOption,
      unitPrice,
      childPrice,
      subtotal,
      split: { partner90, platform10 },
      currency
    };
  };

  const [cart, setCart] = useState<CartState>(initializeCart);

  const updateCart = useCallback((updates: Partial<CartState>) => {
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
      
      // Recalculate pricing if option, adults, or children changed
      if (updates.optionId || updates.adults !== undefined || updates.children !== undefined) {
        const optionMultiplier = 1;  // Only standard option available
        updated.unitPrice = Math.round(basePrice * optionMultiplier);
        updated.childPrice = childHalfPriceRule ? Math.round(updated.unitPrice * 0.5) : updated.unitPrice;
        updated.subtotal = (updated.unitPrice * updated.adults) + (updated.childPrice * updated.children);
        updated.split.partner90 = Math.round(updated.subtotal * 0.9);
        updated.split.platform10 = updated.subtotal - updated.split.partner90;
      }
      
      return updated;
    });
  }, [basePrice, childHalfPriceRule]);

  const clearCart = () => {
    setCart(initializeCart());
  };

  const isValid = Boolean(
    cart?.date && 
    isValidBookingDate(cart.date) && 
    validateBookingDate(cart.date).isValid &&
    cart?.adults > 0
  );

  // Update currency when it changes
  useEffect(() => {
    setCart(prev => ({ ...prev, currency }));
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