import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate from USD
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'KES', symbol: 'KSh', rate: 129.5, name: 'Kenyan Shilling' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const convertPrice = (usdPrice: number): number => {
    return Math.round(usdPrice * currentCurrency.rate);
  };

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = convertPrice(usdPrice);
    return `${currentCurrency.symbol}${convertedPrice.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      setCurrency,
      currencies,
      convertPrice,
      formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};