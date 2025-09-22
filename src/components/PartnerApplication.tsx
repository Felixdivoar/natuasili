import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/fileUpload';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, X } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  position: z.string().min(1, 'Position is required')
});

const formSchema = z.object({
  // Organization Details
  orgName: z.string().min(1, 'Organization name is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url('Valid website URL required').optional().or(z.literal('')),
  
  // Contact Information
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),
  
  // Business Details
  businessRegistrationNumber: z.string().optional(),
  establishedYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  
  // Banking Details
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  branchCode: z.string().optional(),
  
  // Additional Information
  experienceDescription: z.string().min(100, 'Please describe your conservation experience (minimum 100 characters)'),
  expectedParticipants: z.string().min(1, 'Please provide participant expectations'),
  safeguardingPolicies: z.string().min(50, 'Please describe your safeguarding policies')
});

type FormData = z.infer<typeof formSchema>;

interface PartnerApplicationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DocumentUpload {
  id: string;
  name: string;
  file: File | null;
  url?: string;
  required: boolean;
  description: string;
}

const PartnerApplication: React.FC<PartnerApplicationProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      id: 'business_registration',
      name: 'Business Registration Certificate',
      file: null,
      required: true,
      description: 'Official business registration document'
    },
    {
      id: 'tax_certificate',
      name: 'Tax Compliance Certificate',
      file: null,
      required: true,
      description: 'Valid tax clearance certificate'
    },
    {
      id: 'conservation_permits',
      name: 'Conservation Permits/Licenses',
      file: null,
      required: true,
      description: 'Relevant conservation or tourism permits'
    },
    {
      id: 'insurance_certificate',
      name: 'Insurance Certificate',
      file: null,
      required: true,
      description: 'Professional indemnity or public liability insurance'
    },
    {
      id: 'business_plan',
      name: 'Business Plan (Optional)',
      file: null,
      required: false,
      description: 'Your conservation tourism business plan'
    }
  ]);

  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: '',
      bio: '',
      location: '',
      website: '',
      contacts: [{ name: '', email: '', phone: '', position: '' }],
      businessRegistrationNumber: '',
      establishedYear: new Date().getFullYear(),
      bankName: '',
      accountName: '',
      accountNumber: '',
      branchCode: '',
      experienceDescription: '',
      expectedParticipants: '',
      safeguardingPolicies: ''
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Organization Details', description: 'Basic information about your organization' },
    { number: 2, title: 'Contact Information', description: 'Key contact details' },
    { number: 3, title: 'Business & Banking', description: 'Registration and financial details' },
    { number: 4, title: 'Conservation Experience', description: 'Your experience and policies' },
    { number: 5, title: 'Document Upload', description: 'Required documents and certificates' }
  ];

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, file } : doc
    ));
  };

  const removeFile = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, file: null } : doc
    ));
  };

  const validateStep = (step: number): boolean => {
    const values = form.getValues();
    
    switch (step) {
      case 1:
        return !!(values.orgName && values.bio && values.location && values.bio.length >= 50);
      case 2:
        return !!(values.contacts[0]?.name && values.contacts[0]?.email && values.contacts[0]?.phone);
      case 3:
        return !!(values.bankName && values.accountName && values.accountNumber);
      case 4:
        return !!(values.experienceDescription && values.expectedParticipants && values.safeguardingPolicies && 
                 values.experienceDescription.length >= 100);
      case 5:
        const requiredDocs = documents.filter(doc => doc.required);
        return requiredDocs.every(doc => doc.file);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Please complete all required fields",
        description: "All required information must be provided before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your application.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents first
      const documentUrls: Record<string, string> = {};
      
      for (const doc of documents) {
        if (doc.file) {
          const result = await uploadFile(doc.file, 'partner-files', `applications/${user.id}`, user.id);
          if (result.url) {
            documentUrls[doc.id] = result.url;
          } else if (result.error) {
            throw new Error(`Failed to upload ${doc.name}: ${result.error}`);
          }
        }
      }

      // Generate slug from organization name
      const slug = data.orgName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Create partner profile
      const { error: profileError } = await supabase
        .from('partner_profiles')
        .insert({
          user_id: user.id,
          org_name: data.orgName,
          slug,
          bio: data.bio,
          location: data.location,
          contacts: data.contacts,
          business_registration_number: data.businessRegistrationNumber,
          tax_certificate_url: documentUrls.tax_certificate,
          business_license_url: documentUrls.business_registration,
          conservation_permits_url: documentUrls.conservation_permits,
          insurance_certificate_url: documentUrls.insurance_certificate,
          bank_details: {
            bankName: data.bankName,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            branchCode: data.branchCode
          },
          documents: documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            url: documentUrls[doc.id] || null,
            required: doc.required,
            uploaded: !!doc.file
          })),
          kyc_status: 'pending'
        });

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Application submitted successfully!",
        description: "Your partner application has been submitted for review. You will be notified once it's processed.",
        variant: "default"
      });

      onOpenChange(false);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your conservation organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Bio *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your organization's mission, history, and conservation focus (minimum 50 characters)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/50 characters minimum
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="City, County/Region, Kenya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourorganization.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Contact</h3>
            <FormField
              control={form.control}
              name="contacts.0.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name of primary contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contacts.0.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@organization.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This email will be used to create your partner account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contacts.0.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 XXX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contacts.0.position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Director, Manager, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Registration</h3>
              <FormField
                control={form.control}
                name="businessRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Official business registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="establishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Established</FormLabel>
                    <FormControl>
                      <Input type="number" min="1900" max={new Date().getFullYear()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Banking Details</h3>
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Equity Bank, KCB, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Account holder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="branchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank branch code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="experienceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conservation Experience *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your organization's conservation experience, projects, and impact (minimum 100 characters)"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/100 characters minimum
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expectedParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Participant Volume *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How many participants do you expect per month/year? What types of experiences will you offer?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="safeguardingPolicies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safeguarding Policies *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your safety protocols, emergency procedures, and participant safeguarding policies"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Please upload all required documents. Accepted formats: PDF, JPG, PNG (Max 10MB each)
              </AlertDescription>
            </Alert>
            
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {doc.name}
                    {doc.required && <span className="text-destructive text-xs">Required</span>}
                  </CardTitle>
                  <CardDescription className="text-xs">{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {doc.file ? (
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{doc.file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast({
                                title: "File too large",
                                description: "Please upload files smaller than 10MB",
                                variant: "destructive"
                              });
                              return;
                            }
                            handleFileUpload(doc.id, file);
                          }
                        }}
                        className="hidden"
                        id={`file-${doc.id}`}
                      />
                      <label
                        htmlFor={`file-${doc.id}`}
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-center">
                          Click to upload {doc.name}
                        </span>
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Partner Application</DialogTitle>
          <DialogDescription>
            Complete your application to become a conservation partner with NatuAsili
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center">
            <div className="flex space-x-2 text-sm">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`px-3 py-1 rounded-full ${
                    step.number === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.number < currentStep
                      ? 'bg-green-100 text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button type="submit" disabled={isSubmitting || !validateStep(currentStep)}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerApplication;