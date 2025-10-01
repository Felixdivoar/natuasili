import { useMemo, useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMultiCart } from "@/contexts/MultiCartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { X, Turtle, Clock, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { open, setOpen, items, removeItem, total, sync, isSynced } = useMultiCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time only when drawer is open
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [open]);

  const hasItems = items.length > 0;

  const getTimeRemaining = (addedAt: number) => {
    const tenMinutes = 10 * 60 * 1000;
    const elapsed = currentTime - addedAt;
    const remaining = tenMinutes - elapsed;
    
    if (remaining <= 0) return { expired: true, text: "Expired" };
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return { 
      expired: false, 
      text: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      isUrgent: minutes < 2
    };
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        {/* Modern Header */}
        <DrawerHeader className="flex-shrink-0 border-b bg-gradient-to-r from-background to-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Turtle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DrawerTitle className="text-lg font-semibold">Your Cart</DrawerTitle>
                {hasItems && (
                  <p className="text-sm text-muted-foreground">
                    {items.length} item{items.length !== 1 ? 's' : ''} • {formatPrice(total)}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-10 w-10">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DrawerHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Turtle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-muted-foreground mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground/80">Add some experiences to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const timeRemaining = getTimeRemaining(item.addedAt);
                
                return (
                  <div key={item.id} className="group bg-gradient-to-r from-card via-card to-card/80 border rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex gap-4">
                      {/* Experience Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center">
                            <Turtle className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Experience Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base line-clamp-1">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{item.date || 'No date selected'}</span>
                          <span>•</span>
                          <span>{item.adults + item.children} guest{item.adults + item.children !== 1 ? 's' : ''}</span>
                          {item.isGroupPricing && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs px-2 py-0">Group</Badge>
                            </>
                          )}
                        </div>
                        
                        {/* Price and Donation */}
                        <div className="mt-2">
                          <div className="font-semibold text-primary">
                            {formatPrice(item.subtotal)}
                          </div>
                          {item.donation > 0 && (
                            <div className="text-xs text-emerald-600 flex items-center gap-1">
                              🌱 +{formatPrice(item.donation)} donation
                            </div>
                          )}
                        </div>

                        {/* Timer */}
                        <div className="mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className={`text-xs font-medium ${
                            timeRemaining.expired 
                              ? 'text-destructive' 
                              : timeRemaining.isUrgent 
                              ? 'text-orange-600' 
                              : 'text-muted-foreground'
                          }`}>
                            {timeRemaining.expired ? 'Expired' : `Expires in ${timeRemaining.text}`}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 justify-center">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 px-3 bg-primary/90 hover:bg-primary text-xs"
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
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Checkout
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive group-hover:opacity-100 opacity-60"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {hasItems && (
          <div className="flex-shrink-0 border-t bg-gradient-to-r from-background to-muted/10 px-6 py-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Turtle className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold">Total Amount</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{formatPrice(total)}</div>
                <div className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isSynced && (
                <Button 
                  variant="outline" 
                  className="flex-1 h-11"
                  onClick={() => { 
                    void sync().then(() => {
                      setOpen(false);
                    }); 
                  }}
                >
                  Save Cart
                </Button>
              )}
              <Button 
                className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                onClick={() => {
                  setOpen(false);
                  navigate('/cart/checkout');
                }}
              >
                Checkout All ({items.length})
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
