import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorBoundary from './ErrorBoundary';
import LoadingSkeleton from './LoadingSkeleton';

interface BookingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  component?: React.ReactNode;
}

interface EnhancedBookingFlowProps {
  steps: BookingStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

const EnhancedBookingFlow = ({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  isLoading = false,
  error,
  className
}: EnhancedBookingFlowProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle error state
  useEffect(() => {
    if (error) {
      toast({
        title: "Booking Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const getStepStatus = (stepIndex: number): BookingStep['status'] => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return isProcessing ? 'pending' : 'active';
    return 'pending';
  };

  const getStepIcon = (status: BookingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'pending':
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentStep < steps.length - 1) {
        onStepChange(currentStep + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed to next step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardHeader>
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton variant="text" lines={2} />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="card" />
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Booking
          </CardTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2",
                      status === 'completed' && "bg-green-100 border-green-600",
                      status === 'active' && "bg-primary/10 border-primary",
                      status === 'pending' && "border-muted",
                      status === 'error' && "bg-destructive/10 border-destructive"
                    )}>
                      {isProcessing && status === 'active' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        getStepIcon(status)
                      )}
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        "text-sm font-medium",
                        status === 'active' && "text-primary",
                        status === 'completed' && "text-green-600",
                        status === 'pending' && "text-muted-foreground"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4 mt-[-20px]",
                      status === 'completed' ? "bg-green-600" : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />
          
          {/* Current Step Content */}
          <div className="min-h-[200px]">
            {steps[currentStep]?.component || (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  {steps[currentStep]?.title}
                </h3>
                <p className="text-muted-foreground">
                  {steps[currentStep]?.description}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              {isProcessing && (
                <Badge variant="secondary" className="animate-pulse">
                  Processing...
                </Badge>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isProcessing}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isProcessing}
                className="min-w-[100px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing
                  </>
                ) : currentStep === steps.length - 1 ? (
                  "Complete Booking"
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedBookingFlow;