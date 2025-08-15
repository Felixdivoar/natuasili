import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

const CurrencySelector = () => {
  const { currentCurrency, setCurrency, currencies } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentCurrency.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency)}
            className={currency.code === currentCurrency.code ? "bg-muted" : ""}
          >
            <span className="font-medium">{currency.symbol}</span>
            <span className="ml-2">{currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;