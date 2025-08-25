import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResponsiveBookingForm from './ResponsiveBookingForm';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
  project: any;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  experience,
  project
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Book Your Experience
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ResponsiveBookingForm experience={experience} project={project} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;