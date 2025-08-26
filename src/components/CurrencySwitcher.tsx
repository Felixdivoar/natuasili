import { useCurrency } from "@/contexts/CurrencyContext";
import { SUPPORTED, SYMBOL, type Currency } from "@/lib/currency";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative">
      <label htmlFor="currency" className="sr-only">Currency</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="h-9 px-3 rounded-md border bg-background text-sm"
        aria-label="Select currency"
      >
        {SUPPORTED.map((c) => (
          <option key={c} value={c}>
            {SYMBOL[c]} {c}
          </option>
        ))}
      </select>
    </div>
  );
}