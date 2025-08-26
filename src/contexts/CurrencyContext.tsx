import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SUPPORTED, SYMBOL, SITE_BASE_CURRENCY, type Currency } from "@/lib/currency";

// Public, no-key FX API (Frankfurter). We fetch rates with base=USD,
// then derive cross rates. You can swap in your own service if needed.
const FX_ENDPOINT = "https://api.frankfurter.app/latest";

// how often to refresh (ms)
const REFRESH_MS = 12 * 60 * 60 * 1000; // 12h

type Rates = Record<Currency, number>; // price of 1 USD in each currency (or 1 BASE in chosen scheme)

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Rates | null;
  // converts amount FROM the site's base currency to the active currency
  formatPrice: (amountInSiteBase: number, opts?: Intl.NumberFormatOptions) => string;
  // generic converter (from → to)
  convert: (amount: number, from: Currency, to: Currency) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem("na_currency") as Currency) || "KES";
  });
  const [ratesUSD, setRatesUSD] = useState<Rates | null>(() => {
    // last cached rates (based on USD)
    const cached = localStorage.getItem("na_fx_usd");
    return cached ? (JSON.parse(cached) as Rates) : null;
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("na_currency", c);
  };

  // fetch FX rates with base=USD, then store
  const fetchRates = async () => {
    try {
      // request only supported currencies to keep payload small
      const to = SUPPORTED.join(",");
      const res = await fetch(`${FX_ENDPOINT}?from=USD&to=${to}`);
      if (!res.ok) throw new Error("FX fetch failed");
      const data = await res.json();
      // normalize to ensure USD=1.0
      const r: Rates = {
        KES: data.rates.KES ?? 0,
        EUR: data.rates.EUR ?? 0,
        GBP: data.rates.GBP ?? 0,
        USD: 1,
      };
      setRatesUSD(r);
      localStorage.setItem("na_fx_usd", JSON.stringify(r));
      localStorage.setItem("na_fx_usd_ts", String(Date.now()));
    } catch {
      // silently keep old rates if offline
    }
  };

  // initial fetch / refresh
  useEffect(() => {
    const ts = Number(localStorage.getItem("na_fx_usd_ts") || 0);
    const stale = !ts || Date.now() - ts > REFRESH_MS;
    if (stale) fetchRates();

    const id = setInterval(fetchRates, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Build a generic converter using the rates we have (USD→X). If your site base is not USD,
  // we still convert via USD so every pair is covered.
  const convert = useMemo(() => {
    return (amount: number, from: Currency, to: Currency) => {
      if (!ratesUSD) return amount; // fallback: no conversion
      if (from === to) return amount;

      // Convert from "from" to USD, then USD to "to".
      // If ratesUSD[C] is (1 USD -> C), then (1 C -> USD) = 1 / ratesUSD[C].
      const toUSD = (amt: number, c: Currency) => (c === "USD" ? amt : amt / (ratesUSD[c] || 1));
      const fromUSD = (amt: number, c: Currency) => (c === "USD" ? amt : amt * (ratesUSD[c] || 1));

      const inUSD = toUSD(amount, from);
      return fromUSD(inUSD, to);
    };
  }, [ratesUSD]);

  const formatPrice = useMemo(() => {
    return (amountInSiteBase: number, opts?: Intl.NumberFormatOptions) => {
      const active = currency;
      // amount is stored in SITE_BASE_CURRENCY; convert to active for display
      const converted =
        SITE_BASE_CURRENCY === active
          ? amountInSiteBase
          : convert(amountInSiteBase, SITE_BASE_CURRENCY, active);

      // KES usually no minor units, but many Kenyan sites still show two decimals for consistency
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
    rates: ratesUSD,
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