import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  User, 
  MapPin, 
  DollarSign, 
  Heart, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Upload,
  Calendar,
  Users,
  Clock,
  Shield,
  FileText,
  Download
} from 'lucide-react';

interface FormData {
  // Step 1 - Organization
  orgName: string;
  orgType: string;
  registration: string;
  website: string;
  
  // Step 2 - Contact
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  payoutMethod: string;
  
  // Step 3 - Experience Basics
  experienceTitle: string;
  destination: string;
  theme: string;
  duration: string;
  capacity: string;
  
  // Step 4 - Pricing & Availability
  adultPrice: string;
  childPrice: string;
  enableChildPricing: boolean;
  schedule: string[];
  blackoutDates: Date[];
  
  // Step 5 - Impact & Media
  impactSummary: string;
  uploadedFiles: File[];
  safetyChecklist: {
    briefings: boolean;
    emergency: boolean;
    training: boolean;
  };
}

const initialFormData: FormData = {
  orgName: '',
  orgType: '',
  registration: '',
  website: '',
  contactName: '',
  contactRole: '',
  email: '',
  phone: '',
  payoutMethod: '',
  experienceTitle: '',
  destination: '',
  theme: '',
  duration: '',
  capacity: '',
  adultPrice: '',
  childPrice: '',
  enableChildPricing: false,
  schedule: [],
  blackoutDates: [],
  impactSummary: '',
  uploadedFiles: [],
  safetyChecklist: {
    briefings: false,
    emergency: false,
    training: false
  }
};

const steps = [
  { number: 1, title: 'Organization', icon: Building },
  { number: 2, title: 'Contact', icon: User },
  { number: 3, title: 'Experience Basics', icon: MapPin },
  { number: 4, title: 'Pricing & Availability', icon: DollarSign },
  { number: 5, title: 'Impact & Media', icon: Heart }
];

const destinations = [
  'Nairobi',
  'Coastal Kenya', 
  'Samburu',
  'Maasai Mara',
  'Laikipia'
];

const themes = [
  'Wildlife',
  'Marine',
  'Cultural',
  'Education'
];

const orgTypes = [
  'Conservancy',
  'NGO',
  'Community Enterprise'
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const PartnerOnboardingDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormData] as any,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.orgName.trim() !== '' && formData.orgType !== '';
      case 2:
        return formData.contactName.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.phone.trim() !== '' &&
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 3:
        return formData.experienceTitle.trim() !== '' && 
               formData.destination !== '' && 
               formData.theme !== '';
      case 4:
        return formData.adultPrice.trim() !== '' && 
               parseFloat(formData.adultPrice) > 0;
      case 5:
        return formData.impactSummary.trim() !== '';
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 5 && validateStep(currentStep)) {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetDemo = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsCompleted(false);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 5); // Max 5 files
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles].slice(0, 5)
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  // Analytics (placeholder - would be real implementation)
  useEffect(() => {
    // Track step viewed
    console.log(`Demo step ${currentStep} viewed`);
  }, [currentStep]);

  const trackEvent = (event: string) => {
    console.log(`Demo event: ${event}`);
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Demo Completed—Thanks!</h3>
              <p className="text-muted-foreground max-w-2xl">
                In the real onboarding, our team helps craft your listing and verify details within 2–5 business days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => {
                  trackEvent('partner_demo_apply_click');
                  window.open('https://2o7bym7r45m.typeform.com/to/OhaBfRVk?utm_source=demo&typeform-source=natuasili.com', '_blank');
                }}
                size="lg"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  trackEvent('partner_demo_checklist_click');
                  // Download the PDF checklist
                  const link = document.createElement('a');
                  link.href = '/assets/partner-onboarding-checklist.pdf';
                  link.download = 'natuasili-partner-onboarding-checklist.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Onboarding Checklist
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  trackEvent('partner_demo_request_demo_click');
                  setShowDemoModal(true);
                }}
                size="lg"
              >
                Request a 15-min Demo
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={resetDemo}
              className="mt-6"
            >
              Start Over
            </Button>
          </div>
        </Card>

        {/* Demo Request Modal */}
        {showDemoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Request a Demo</CardTitle>
                <CardDescription>
                  Get a personalized walkthrough of our partner platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="demo-name">Name</Label>
                  <Input id="demo-name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="demo-email">Email</Label>
                  <Input id="demo-email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="demo-phone">Phone</Label>
                  <Input id="demo-phone" type="tel" placeholder="+254..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      alert('Demo request would be sent to partners@natuasili.com');
                      setShowDemoModal(false);
                    }}
                    className="flex-1"
                  >
                    Send Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDemoModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  const renderLivePreview = () => {
    if (currentStep < 3) return null;

    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experienceTitle && (
            <div>
              <h4 className="font-semibold">{formData.experienceTitle}</h4>
              <p className="text-sm text-muted-foreground">
                {formData.destination} • {formData.theme}
              </p>
            </div>
          )}
          
          {formData.adultPrice && (
            <div className="space-y-2">
              <p className="font-medium">
                From KES {parseInt(formData.adultPrice || '0').toLocaleString()} per adult
              </p>
              {formData.enableChildPricing && formData.childPrice && (
                <p className="text-sm text-muted-foreground">
                  Children: KES {parseInt(formData.childPrice || '0').toLocaleString()}
                </p>
              )}
            </div>
          )}

          {(formData.capacity || formData.duration) && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              {formData.capacity && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Up to {formData.capacity}
                </div>
              )}
              {formData.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formData.duration}h
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Revenue Split:</span>
                <span className="font-medium">90% Partner / 10% Platform</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Organization Details</h3>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  value={formData.orgName}
                  onChange={(e) => updateFormData('orgName', e.target.value)}
                  placeholder="e.g., Ol Pejeta Conservancy"
                />
              </div>
              
              <div>
                <Label htmlFor="orgType">Organization Type *</Label>
                <Select 
                  value={formData.orgType} 
                  onValueChange={(value) => updateFormData('orgType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="registration">Registration / License (Optional)</Label>
                <Input
                  id="registration"
                  value={formData.registration}
                  onChange={(e) => updateFormData('registration', e.target.value)}
                  placeholder="Registration number or license"
                />
              </div>

              <div>
                <Label htmlFor="website">Website or Instagram (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://yoursite.com or @instagram"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Contact Information</h3>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="Primary contact person"
                />
              </div>

              <div>
                <Label htmlFor="contactRole">Role/Title</Label>
                <Input
                  id="contactRole"
                  value={formData.contactRole}
                  onChange={(e) => updateFormData('contactRole', e.target.value)}
                  placeholder="e.g., Conservation Manager"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contact@organization.com"
                />
                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="text-sm text-destructive mt-1">Please enter a valid email</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+254 XXX XXX XXX"
                />
              </div>

              <div>
                <Label>Preferred Payout Method</Label>
                <RadioGroup 
                  value={formData.payoutMethod} 
                  onValueChange={(value) => updateFormData('payoutMethod', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa">M-Pesa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Experience Basics</h3>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="experienceTitle">Experience Title *</Label>
                <Input
                  id="experienceTitle"
                  value={formData.experienceTitle}
                  onChange={(e) => updateFormData('experienceTitle', e.target.value)}
                  placeholder="e.g., Northern White Rhino Conservation Experience"
                />
              </div>

              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Select 
                  value={formData.destination} 
                  onValueChange={(value) => updateFormData('destination', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(dest => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="theme">Theme *</Label>
                <Select 
                  value={formData.theme} 
                  onValueChange={(value) => updateFormData('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => updateFormData('duration', e.target.value)}
                    placeholder="3"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    placeholder="12"
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  We'll help you refine this during onboarding.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Pricing & Availability</h3>
            </div>
            
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adultPrice">Adult Price (KES) *</Label>
                  <Input
                    id="adultPrice"
                    type="number"
                    min="1"
                    value={formData.adultPrice}
                    onChange={(e) => updateFormData('adultPrice', e.target.value)}
                    placeholder="5000"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableChildPricing"
                      checked={formData.enableChildPricing}
                      onCheckedChange={(checked) => updateFormData('enableChildPricing', checked)}
                    />
                    <Label htmlFor="enableChildPricing" className="text-sm">
                      This partner offers children pricing
                    </Label>
                  </div>
                  
                  {formData.enableChildPricing && (
                    <div>
                      <Label htmlFor="childPrice">Children Price (KES)</Label>
                      <Input
                        id="childPrice"
                        type="number"
                        min="1"
                        value={formData.childPrice}
                        onChange={(e) => updateFormData('childPrice', e.target.value)}
                        placeholder="2500"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Common for Ol Pejeta, Nature Kenya, Giraffe Centre, Karen Community.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Schedule (Days Available)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.schedule.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('schedule', [...formData.schedule, day]);
                          } else {
                            updateFormData('schedule', formData.schedule.filter(d => d !== day));
                          }
                        }}
                      />
                      <Label htmlFor={day} className="text-sm">{day.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Blackout Dates</Label>
                <div className="mt-2 p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Demo: Date picker would allow selecting up to 5 blackout dates</p>
                  <div className="flex gap-2 justify-center mt-2">
                    <Badge variant="secondary">Dec 25, 2024</Badge>
                    <Badge variant="secondary">Jan 1, 2025</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Impact & Media</h3>
            </div>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="impactSummary">Impact Summary (300 characters) *</Label>
                <Textarea
                  id="impactSummary"
                  value={formData.impactSummary}
                  onChange={(e) => updateFormData('impactSummary', e.target.value)}
                  placeholder="Describe how your experience contributes to conservation..."
                  maxLength={300}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.impactSummary.length}/300 characters
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Revenue Split Preview</h4>
                <div className="flex justify-between text-sm">
                  <span>Partner initiatives:</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform & operations:</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>

              <div>
                <Label>Photo Upload (Demo)</Label>
                <div className="mt-2 p-6 border-2 border-dashed rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop photos here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="fileUpload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                  >
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo only - files won't be uploaded
                  </p>
                </div>
                
                {formData.uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {formData.uploadedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <img
                            src="/images/placeholder-1.jpg"
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                        <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Safety Checklist</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'briefings', label: 'Safety briefings provided to all participants' },
                    { key: 'emergency', label: 'Emergency contact available during experience' },
                    { key: 'training', label: 'Guides are trained in first aid and safety protocols' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        checked={formData.safetyChecklist[item.key as keyof typeof formData.safetyChecklist]}
                        onCheckedChange={(checked) => updateNestedData('safetyChecklist', item.key, checked)}
                      />
                      <Label htmlFor={item.key} className="text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="hero-padding px-4 bg-muted/30">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try the Partner Onboarding Demo</h2>
          <p className="text-xl text-muted-foreground">
            See how listing with NatuAsili works—no data is saved in this demo.
          </p>
        </div>

        {/* Demo Banner */}
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo only</strong>—entries aren't saved.
          </AlertDescription>
        </Alert>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                      isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      'border-muted-foreground text-muted-foreground'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-muted-foreground/30 mx-2 sm:mx-4" />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / 5) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Step {currentStep} of 5</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetDemo}
              className="text-xs h-auto p-1"
            >
              Start over
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                {currentStep === 5 ? 'Complete Demo' : 'Next'}
                {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            {renderLivePreview()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerOnboardingDemo;