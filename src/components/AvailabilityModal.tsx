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
      setError(`Booking limit reached. Maximum ${maxCapacity} people.`);
      return;
    }
    
    setError('');
    onSubmit({ date, people });
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
    <div className="modal" aria-modal="true" role="dialog" aria-labelledby="availability-title">
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h3 id="availability-title" className="text-xl font-semibold text-foreground">
            Check Availability
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Check availability for <strong>{experienceTitle}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="people">Number of People</Label>
            <Input
              id="people"
              type="number"
              min="1"
              max={maxCapacity}
              value={people}
              onChange={(e) => handlePeopleChange(e.target.value)}
              required
              className="mt-1"
            />
            {error && (
              <p className="people-error text-sm mt-1" role="alert" aria-live="polite">
                {error}
              </p>
            )}
          </div>
          
          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!!error || !date}
              className="bg-primary hover:bg-primary/90"
            >
              Continue to Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;