import { useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMultiCart } from "@/contexts/MultiCartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { open, setOpen, items, removeItem, total, sync, isSynced } = useMultiCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const hasItems = items.length > 0;

  const grouped = useMemo(() => items, [items]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Your Cart
          </DrawerTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {!hasItems && (
            <div className="text-center text-muted-foreground py-12">
              Your cart is empty.
            </div>
          )}

          {grouped.map(item => (
            <div key={item.id} className="border rounded-lg p-4 flex gap-4 items-start">
              {item.image && (
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.date || 'No date selected'} • {item.adults + item.children} people{item.isGroupPricing ? ' (group)' : ''}
                </div>
                 <div className="font-semibold mt-1">
                   {formatPrice(item.subtotal)}
                   {item.donation > 0 && (
                     <div className="text-xs text-green-600">
                       + {formatPrice(item.donation)} donation
                     </div>
                   )}
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    const params = new URLSearchParams({
                      date: item.date || '',
                      adults: String(item.adults),
                      children: String(item.children),
                      option: item.optionId,
                    });
                    navigate(`/checkout/${item.experienceSlug}?${params.toString()}`);
                  }}
                >
                  Checkout
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
              </div>
            </div>
          ))}

          {hasItems && (
            <div className="border-t pt-4 flex items-center justify-between">
              <div className="font-semibold">Total</div>
              <div className="font-bold">{formatPrice(total)}</div>
            </div>
          )}

          {hasItems && !isSynced && (
            <div className="flex justify-end">
              <Button onClick={() => { 
                void sync().then(() => {
                  setOpen(false); // Auto-hide cart drawer after saving
                }); 
              }}>
                Save Cart
              </Button>
            </div>
          )}

          {hasItems && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setOpen(false);
                  navigate('/cart/checkout');
                }}
              >
                Checkout All ({items.length} items)
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
