import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin } from "lucide-react";
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
  // Check if this is the northern white rhinos experience
  const isRhinoExperience = experience?.title?.toLowerCase().includes('northern white rhinos');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Book Your Experience
            {isRhinoExperience && (
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-700">
                🦏 Last of Their Kind
              </Badge>
            )}
          </DialogTitle>
          {isRhinoExperience && (
            <div className="text-sm space-y-2 mt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Available daily at 08:30am and 3:00pm</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-green-500" />
                <span>No group size limits - all welcome</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Ol Pejeta Conservancy, Laikipia</span>
              </div>
            </div>
          )}
        </DialogHeader>
        <div className="mt-4">
          <ResponsiveBookingForm experience={experience} project={project} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;