import React from 'react';
import { Button } from '@/components/ui/button';
import { sendWelcomeEmail } from '@/lib/email';
import { toast } from '@/hooks/use-toast';

const TestEmailButton: React.FC = () => {
  const handleTestEmail = async () => {
    try {
      console.log('Testing welcome email...');
      
      // Replace with your actual email address for testing
      const testEmail = 'test@example.com';
      
      const result = await sendWelcomeEmail(testEmail, {
        userName: 'Test User',
        userRole: 'traveler'
      });
      
      console.log('Welcome email sent successfully:', result);
      
      toast({
        title: "Email Sent!",
        description: `Welcome email sent successfully to ${testEmail}`,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      
      toast({
        title: "Email Failed",
        description: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleTestEmail} variant="outline">
      Test Welcome Email
    </Button>
  );
};

export default TestEmailButton;