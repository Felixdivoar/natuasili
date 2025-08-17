import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

const PriceRangeFilter = ({ min, max, value, onChange, className = "" }: PriceRangeFilterProps) => {
  const { formatPrice, convertPrice } = useCurrency();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    const rangeValue: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(rangeValue);
    onChange(rangeValue);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">Price range</Label>
      <div className="px-2">
        <Slider
          value={localValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={10}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatPrice(localValue[0])}</span>
        <span>{formatPrice(localValue[1])}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;