import { useCurrency } from "@/contexts/CurrencyContext";

// Temporary test component - remove after verification
export default function TestCurrency() {
  const { currency, formatPrice, convert } = useCurrency();
  
  console.log("KES 10,000 ->", {
    USD: convert(10000, "KES", "USD"),
    EUR: convert(10000, "KES", "EUR"),
    GBP: convert(10000, "KES", "GBP"),
  });

  return (
    <div className="bg-yellow-100 p-4 rounded border-2 border-yellow-400 text-sm">
      <h3 className="font-bold">Currency Test (Remove this component)</h3>
      <p>Active: {currency}</p>
      <p>KES 10,000 = {formatPrice(10000)}</p>
      <p>USD: {convert(10000, "KES", "USD").toFixed(2)}</p>
      <p>EUR: {convert(10000, "KES", "EUR").toFixed(2)}</p>
      <p>GBP: {convert(10000, "KES", "GBP").toFixed(2)}</p>
    </div>
  );
}