import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SUPPORTED, SYMBOL, SITE_BASE_CURRENCY, type Currency } from "@/lib/currency";

// We fetch WITH base=KES so 1 KES -> { USD, EUR, GBP }
const FX_ENDPOINT = "https://api.frankfurter.app/latest";
const REFRESH_MS = 12 * 60 * 60 * 1000; // 12h
const KEY_RATES_KES = "na_fx_kes";
const KEY_TS_KES = "na_fx_kes_ts";
const KEY_CURR = "na_currency";

// Tiny static fallback (approx) in case fetch is blocked. Update occasionally if needed.
const STATIC_FALLBACK_RATES_KES: Record<Currency, number> = {
  KES: 1,        // 1 KES = 1 KES
  USD: 0.0075,   // 1 KES ≈ 0.0075 USD (example)
  EUR: 0.0069,   // 1 KES ≈ 0.0069 EUR
  GBP: 0.0058,   // 1 KES ≈ 0.0058 GBP
};

type RatesKES = Record<Currency, number>; // value is: 1 KES -> currency

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: RatesKES | null; // 1 KES -> currency
  formatPrice: (amountInKES: number, opts?: Intl.NumberFormatOptions) => string;
  convert: (amount: number, from: Currency, to: Currency) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem(KEY_CURR) as Currency) || "KES";
  });

  const [ratesKES, setRatesKES] = useState<RatesKES | null>(() => {
    const cached = localStorage.getItem(KEY_RATES_KES);
    return cached ? (JSON.parse(cached) as RatesKES) : null;
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(KEY_CURR, c);
  };

  // Fetch live rates with base=KES so we have direct KES->X multipliers
  const fetchRates = async () => {
    try {
      const to = SUPPORTED.filter(c => c !== "KES").join(",");
      const res = await fetch(`${FX_ENDPOINT}?from=KES&to=${to}`);
      if (!res.ok) throw new Error("FX fetch failed");
      const data = await res.json();
      const r: RatesKES = {
        KES: 1,
        USD: data.rates.USD ?? STATIC_FALLBACK_RATES_KES.USD,
        EUR: data.rates.EUR ?? STATIC_FALLBACK_RATES_KES.EUR,
        GBP: data.rates.GBP ?? STATIC_FALLBACK_RATES_KES.GBP,
      };
      setRatesKES(r);
      localStorage.setItem(KEY_RATES_KES, JSON.stringify(r));
      localStorage.setItem(KEY_TS_KES, String(Date.now()));
    } catch (err) {
      // If we have nothing, fall back to static so conversion still works
      if (!ratesKES) {
        setRatesKES(STATIC_FALLBACK_RATES_KES);
      }
      // Optional: console.warn("Currency: using cached/static rates", err);
    }
  };

  useEffect(() => {
    const ts = Number(localStorage.getItem(KEY_TS_KES) || 0);
    const stale = !ts || Date.now() - ts > REFRESH_MS;
    if (stale) fetchRates();
    const id = setInterval(fetchRates, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Convert helper:
  // If our table is 1 KES -> X, then:
  //  - KES -> X: amount * rate[X]
  //  - X -> KES: amount / rate[X]
  //  - X -> Y:  (amount / rate[X]) * rate[Y]
  const convert = useMemo(() => {
    return (amount: number, from: Currency, to: Currency) => {
      if (!ratesKES || Number.isNaN(amount)) return amount;
      if (from === to) return amount;

      const toKES = (amt: number, c: Currency) => (c === "KES" ? amt : amt / (ratesKES[c] || 1));
      const fromKES = (amt: number, c: Currency) => (c === "KES" ? amt : amt * (ratesKES[c] || 1));

      const inKES = toKES(amount, from);
      return fromKES(inKES, to);
    };
  }, [ratesKES]);

  // Format numbers that are stored in KES across your DB
  const formatPrice = useMemo(() => {
    return (amountInKES: number, opts?: Intl.NumberFormatOptions) => {
      const active = currency;
      const converted = convert(amountInKES, SITE_BASE_CURRENCY, active);
      const minimumFractionDigits = active === "KES" ? 0 : 2;
      const maximumFractionDigits = active === "KES" ? 0 : 2;

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: active,
        currencyDisplay: "symbol",
        minimumFractionDigits,
        maximumFractionDigits,
        ...opts,
      }).format(converted);
    };
  }, [currency, convert]);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    rates: ratesKES,
    formatPrice,
    convert,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}