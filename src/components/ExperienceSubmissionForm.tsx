import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import { uploadFile, validateFile } from '@/lib/fileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const experienceFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  location_text: z.string().min(3, 'Location is required'),
  price_kes_adult: z.number().min(100, 'Price must be at least KES 100'),
  child_half_price_rule: z.boolean().default(false),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(50, 'Capacity cannot exceed 50'),
  themes: z.array(z.string()).min(1, 'Select at least one theme'),
  activities: z.array(z.string()).min(1, 'Add at least one activity'),
});

type ExperienceFormData = z.infer<typeof experienceFormSchema>;

interface ExperienceSubmissionFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const THEME_OPTIONS = [
  'Wildlife conservation',
  'Conservation education',
  'Community & cultural exploration',
];

const ExperienceSubmissionForm: React.FC<ExperienceSubmissionFormProps> = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location_text: '',
      price_kes_adult: 1000,
      child_half_price_rule: false,
      capacity: 10,
      themes: [],
      activities: [],
    },
  });

  const watchedThemes = form.watch('themes');
  const watchedActivities = form.watch('activities');

  const handleHeroImageUpload = async (file: File) => {
    if (!user?.id) return;

    const validation = validateFile(file, 5);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploadingHero(true);
    try {
      const result = await uploadFile(file, 'partner-images', 'experience-hero', user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        setHeroImage(result.url);
        toast.success('Hero image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      toast.error('Failed to upload hero image');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleGalleryImageUpload = async (file: File) => {
    if (!user?.id) return;

    const validation = validateFile(file, 5);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploadingGallery(true);
    try {
      const result = await uploadFile(file, 'partner-images', 'experience-gallery', user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        setGalleryImages(prev => [...prev, result.url!]);
        toast.success('Gallery image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      toast.error('Failed to upload gallery image');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    if (newActivity.trim() && !watchedActivities.includes(newActivity.trim())) {
      form.setValue('activities', [...watchedActivities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (activity: string) => {
    form.setValue('activities', watchedActivities.filter(a => a !== activity));
  };

  const handleSubmit = async (data: ExperienceFormData) => {
    if (!user?.id) {
      toast.error('You must be logged in to submit an experience');
      return;
    }

    if (!heroImage) {
      toast.error('Please upload a hero image for your experience');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get partner profile
      const { data: partnerProfile, error: partnerError } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partnerError || !partnerProfile) {
        toast.error('Partner profile not found. Please contact support.');
        return;
      }

      // Create slug from title
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Submit experience (will be pending admin approval)
      const { error: insertError } = await supabase
        .from('experiences')
        .insert({
          partner_id: partnerProfile.id,
          title: data.title,
          slug,
          description: data.description,
          hero_image: heroImage,
          gallery: JSON.stringify(galleryImages),
          themes: JSON.stringify(data.themes),
          activities: JSON.stringify(data.activities),
          price_kes_adult: data.price_kes_adult,
          child_half_price_rule: data.child_half_price_rule,
          capacity: data.capacity,
          location_text: data.location_text,
          visible_on_marketplace: false, // Will be set to true after admin approval
        });

      if (insertError) {
        console.error('Error submitting experience:', insertError);
        toast.error('Failed to submit experience. Please try again.');
        return;
      }

      toast.success('Experience submitted successfully! It will be reviewed by our team.');
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error submitting experience:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Experience</CardTitle>
          <p className="text-muted-foreground">
            Create a new conservation experience for review. Once approved, it will be published on the marketplace.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wildlife Tracking Adventure" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your experience in detail, including what participants will do, learn, and the conservation impact..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nairobi National Park, Kenya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing & Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Capacity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price_kes_adult"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Adult (KES) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Capacity *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max="50"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="child_half_price_rule"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Children pay half price</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Children under 12 pay 50% of the adult price
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Themes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Themes & Activities</h3>
                
                <FormField
                  control={form.control}
                  name="themes"
                  render={() => (
                    <FormItem>
                      <FormLabel>Conservation Themes *</FormLabel>
                      <div className="space-y-2">
                        {THEME_OPTIONS.map((theme) => (
                          <FormField
                            key={theme}
                            control={form.control}
                            name="themes"
                            render={({ field }) => (
                              <FormItem
                                key={theme}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(theme)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, theme])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== theme
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {theme}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activities */}
                <div className="space-y-2">
                  <Label>Activities/Keywords *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. tracking, workshop, safari"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addActivity();
                        }
                      }}
                    />
                    <Button type="button" onClick={addActivity} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedActivities.map((activity) => (
                      <Badge key={activity} variant="secondary" className="flex items-center gap-1">
                        {activity}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeActivity(activity)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {form.formState.errors.activities && (
                    <p className="text-sm text-destructive">{form.formState.errors.activities.message}</p>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Images</h3>
                
                <div>
                  <Label>Hero Image * (Main promotional image)</Label>
                  <div className="mt-2">
                    {heroImage ? (
                      <div className="relative">
                        <img 
                          src={heroImage} 
                          alt="Hero" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setHeroImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={handleHeroImageUpload}
                        accept="image/*"
                        maxSizeMB={5}
                        loading={uploadingHero}
                        className="h-48"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p>Upload hero image</p>
                          <p className="text-sm text-muted-foreground">Max 5MB, JPG/PNG</p>
                        </div>
                      </FileUpload>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Gallery Images (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    <FileUpload
                      onFileSelect={handleGalleryImageUpload}
                      accept="image/*"
                      maxSizeMB={5}
                      loading={uploadingGallery}
                      className="h-32"
                    >
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p>Add gallery image</p>
                        <p className="text-sm text-muted-foreground">Max 5MB each</p>
                      </div>
                    </FileUpload>
                    
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceSubmissionForm;