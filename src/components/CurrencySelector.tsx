import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { SUPPORTED, SYMBOL, type Currency } from "@/lib/currency";

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED.map((currencyCode) => (
          <DropdownMenuItem
            key={currencyCode}
            onClick={() => setCurrency(currencyCode)}
            className={currencyCode === currency ? "bg-muted" : ""}
          >
            <span className="font-medium">{SYMBOL[currencyCode]}</span>
            <span className="ml-2">{currencyCode}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;