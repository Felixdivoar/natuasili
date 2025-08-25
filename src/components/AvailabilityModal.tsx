import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; people: number }) => void;
  maxCapacity?: number;
  experienceTitle?: string;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  maxCapacity = 8,
  experienceTitle = "Experience"
}) => {
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    if (people > maxCapacity) {
      setError(`Maximum ${maxCapacity} people allowed`);
      return;
    }
    
    setError('');
    
    // Hide availability CTA and reveal/prefill booking form with locked fields
    const availabilityCta = document.getElementById('availability-cta');
    const bookingSection = document.getElementById('booking-section');
    
    if (availabilityCta) availabilityCta.classList.add('hidden');
    if (bookingSection) {
      bookingSection.hidden = false;
      bookingSection.classList.remove('hidden');
      
      // Prefill booking form and lock fields
      const bookingForm = document.getElementById('booking-form') as HTMLFormElement;
      if (bookingForm) {
        const dateInput = bookingForm.querySelector('input[name="date"]') as HTMLInputElement;
        const peopleInput = bookingForm.querySelector('input[name="people"]') as HTMLInputElement;
        
        if (dateInput) {
          dateInput.value = date;
          dateInput.readOnly = true;
        }
        if (peopleInput) {
          peopleInput.value = people.toString();
          peopleInput.readOnly = true;
        }
        
        // Add prefilled class to hide date/people fields on mobile
        bookingForm.classList.add('prefilled');
        
        // Scroll to booking form and focus next field
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          // Focus next available field (name, email, or submit button)
          const nextField = bookingForm.querySelector('input[name="name"], input[name="email"], button[type="submit"]') as HTMLElement;
          if (nextField && nextField.focus) {
            nextField.focus();
          }
        }, 300);
        
        // Trigger price calculation
        const event = new Event('input', { bubbles: true });
        peopleInput?.dispatchEvent(event);
      }
    }
    
    onClose();
  };

  const handlePeopleChange = (value: string) => {
    const num = parseInt(value) || 1;
    setPeople(Math.max(1, num));
    
    if (num > maxCapacity) {
      setError(`Booking limit reached. Maximum ${maxCapacity} people.`);
    } else {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div id="availability-modal" className="modal" aria-modal="true" role="dialog" aria-labelledby="availability-title">
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h3 id="availability-title" className="text-xl font-semibold text-foreground">
            Check Availability
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} data-close="availability">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Check availability for <strong>{experienceTitle}</strong>
        </p>
        
        <form id="availability-form" data-max={maxCapacity} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="av-date">Select Date</Label>
            <Input
              id="av-date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="av-people">Number of People</Label>
            <div className="people-input flex items-center gap-2" data-max={maxCapacity}>
              <button 
                type="button" 
                className="btn-step px-3 py-2 border border-border bg-muted hover:bg-muted/80 rounded-lg" 
                data-step="-1" 
                aria-label="Decrease"
                onClick={() => setPeople(Math.max(1, people - 1))}
              >
                −
              </button>
              <Input
                id="av-people"
                name="people"
                type="number"
                min="1"
                max={maxCapacity}
                value={people}
                onChange={(e) => handlePeopleChange(e.target.value)}
                className="w-20 text-center border border-input rounded-md"
                placeholder="0"
                inputMode="numeric"
              />
              <button 
                type="button" 
                className="btn-step px-3 py-2 border border-border bg-muted hover:bg-muted/80 rounded-lg" 
                data-step="1" 
                aria-label="Increase"
                onClick={() => setPeople(Math.min(maxCapacity, people + 1))}
              >
                +
              </button>
            </div>
            {error && (
              <p className="people-error text-sm font-bold mt-1" role="alert" aria-live="polite">
                {error}
              </p>
            )}
          </div>
          
          <div className="modal-actions flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} data-close="availability" className="flex-1 btn-secondary">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!!error || !date}
              className="flex-1 bg-primary hover:bg-primary/90 btn btn-primary"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;