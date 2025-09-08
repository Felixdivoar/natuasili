import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile, validateFile } from '@/lib/fileUpload';
import { toast } from 'sonner';

interface ExperienceSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const THEMES = [
  'Wildlife conservation',
  'Conservation education',
  'Community & cultural exploration'
];

const ACTIVITIES = [
  'wildlife tracking',
  'bird watching',
  'forest walk',
  'community visit',
  'workshop',
  'sanctuary tour',
  'research participation',
  'conservation project',
  'cultural experience',
  'eco-tour'
];

const ExperienceSubmissionForm: React.FC<ExperienceSubmissionFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_text: '',
    price_kes_adult: '',
    capacity: '15',
    themes: [] as string[],
    activities: [] as string[],
    child_half_price_rule: false,
    hero_image: '',
    gallery: [] as string[]
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThemeToggle = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const handleImageUpload = async (file: File, isHero: boolean = false) => {
    if (!user?.id) return;

    const validation = validateFile(file, 10);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploadingImages(true);
    try {
      const result = await uploadFile(file, 'partner-images', 'experience', user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        if (isHero) {
          setFormData(prev => ({ ...prev, hero_image: result.url! }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            gallery: [...prev.gallery, result.url!] 
          }));
        }
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to submit an experience');
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.price_kes_adult) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.themes.length === 0) {
      toast.error('Please select at least one theme');
      return;
    }

    if (formData.activities.length === 0) {
      toast.error('Please select at least one activity');
      return;
    }

    setLoading(true);
    try {
      // Get partner profile
      const { data: partnerProfile } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partnerProfile) {
        toast.error('Partner profile not found');
        return;
      }

      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Submit experience for review
      const { error } = await supabase
        .from('experiences')
        .insert({
          partner_id: partnerProfile.id,
          title: formData.title,
          slug,
          description: formData.description,
          location_text: formData.location_text,
          price_kes_adult: parseInt(formData.price_kes_adult),
          capacity: parseInt(formData.capacity),
          themes: formData.themes,
          activities: formData.activities,
          child_half_price_rule: formData.child_half_price_rule,
          hero_image: formData.hero_image,
          gallery: formData.gallery,
          visible_on_marketplace: false // Pending approval
        });

      if (error) {
        console.error('Error submitting experience:', error);
        toast.error('Failed to submit experience');
        return;
      }

      toast.success('Experience submitted for review! Admin will review and approve it shortly.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location_text: '',
        price_kes_adult: '',
        capacity: '15',
        themes: [],
        activities: [],
        child_half_price_rule: false,
        hero_image: '',
        gallery: []
      });

      onSubmit?.();
      onClose();
    } catch (error) {
      console.error('Error submitting experience:', error);
      toast.error('An error occurred while submitting the experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Submit New Experience</DialogTitle>
          <p className="text-muted-foreground">
            Create a new conservation experience for admin review and approval
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Experience Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Wildlife Tracking Experience"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your conservation experience in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location_text}
                    onChange={(e) => handleInputChange('location_text', e.target.value)}
                    placeholder="e.g., Maasai Mara, Kenya"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity (people)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Adult (KES) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_kes_adult}
                    onChange={(e) => handleInputChange('price_kes_adult', e.target.value)}
                    placeholder="e.g., 2500"
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="child-half-price"
                    checked={formData.child_half_price_rule}
                    onCheckedChange={(checked) => 
                      handleInputChange('child_half_price_rule', checked)
                    }
                  />
                  <Label htmlFor="child-half-price">Children pay half price</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Themes and Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Conservation Themes *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {THEMES.map(theme => (
                    <Badge
                      key={theme}
                      variant={formData.themes.includes(theme) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleThemeToggle(theme)}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Activities *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ACTIVITIES.map(activity => (
                    <Badge
                      key={activity}
                      variant={formData.activities.includes(activity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleActivityToggle(activity)}
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Hero Image</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Main image that represents your experience
                </p>
                {formData.hero_image ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img 
                      src={formData.hero_image} 
                      alt="Hero" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange('hero_image', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <FileUpload
                    onFileSelect={(file) => handleImageUpload(file, true)}
                    loading={uploadingImages}
                    accept="image/*"
                    maxSizeMB={5}
                  />
                )}
              </div>

              <div>
                <Label>Gallery Images</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Additional images showcasing your experience
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FileUpload
                  onFileSelect={(file) => handleImageUpload(file, false)}
                  loading={uploadingImages}
                  accept="image/*"
                  maxSizeMB={5}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Gallery Image
                  </div>
                </FileUpload>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit for Review
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceSubmissionForm;