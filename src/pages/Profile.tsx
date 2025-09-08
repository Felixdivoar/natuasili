import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/auth";
import { User, Mail, Phone, MapPin, Calendar, Save, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MetaTags from "@/components/MetaTags";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile, validateFile } from "@/lib/fileUpload";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    bio: '',
    location: ''
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: '',
        location: ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const updates = {
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        phone: formData.phone || null,
      };

      const updatedProfile = await updateProfile(user.id, updates);
      
      if (updatedProfile) {
        await refreshProfile();
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user?.id) return;

    const validation = validateFile(file, 5); // 5MB limit for avatars
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await uploadFile(file, 'avatars', 'profile', user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        const updatedProfile = await updateProfile(user.id, { avatar_url: result.url });
        if (updatedProfile) {
          await refreshProfile();
          toast.success("Profile photo updated successfully!");
        } else {
          toast.error("Failed to update profile photo.");
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("An error occurred while uploading your photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'traveler':
        return 'Conservation Traveler';
      case 'partner':
        return 'Conservation Partner';
      default:
        return 'User';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'partner':
        return 'default';
      case 'traveler':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <MetaTags
        title="Profile Settings"
        description="Manage your profile settings and personal information"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Modern Full-Width Hero */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.2),transparent)] animate-fade-in"></div>
          <div className="relative w-full py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/20 transition-colors">
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                    Your
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Profile</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
                    Manage your account information, preferences, and conservation journey settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Content Section */}
        <div className="w-full py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Enhanced Profile Overview Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    <div className="relative mx-auto lg:mx-0">
                      <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-4 ring-primary/10">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2">
                          <FileUpload
                            variant="avatar"
                            onFileSelect={handleAvatarUpload}
                            accept="image/*"
                            maxSizeMB={5}
                            loading={uploadingAvatar}
                            className="h-12 w-12 rounded-full border-4 border-white shadow-lg bg-white hover:bg-primary/5 transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                          </FileUpload>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center lg:text-left space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <h2 className="text-3xl font-bold text-foreground">
                          {profile?.first_name || profile?.last_name 
                            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                            : 'Your Name'
                          }
                        </h2>
                        <Badge 
                          variant={getRoleBadgeVariant(profile?.role || 'user')}
                          className="w-fit mx-auto lg:mx-0 px-4 py-2 text-sm font-medium"
                        >
                          {getRoleDisplayName(profile?.role || 'user')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="font-medium">
                            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                      <Button 
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "default"}
                        className="w-full lg:w-auto min-w-[140px]"
                      >
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Profile Details Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <p className="text-muted-foreground">Update your personal details and preferences</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="first_name" className="text-base font-semibold">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          placeholder="Enter your first name"
                          className="h-12 bg-white/50 border-2 focus:border-primary/50 transition-colors"
                        />
                      ) : (
                        <div className="h-12 p-4 bg-muted/30 rounded-lg text-foreground font-medium flex items-center">
                          {profile?.first_name || 'Not provided'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="last_name" className="text-base font-semibold">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          placeholder="Enter your last name"
                          className="h-12 bg-white/50 border-2 focus:border-primary/50 transition-colors"
                        />
                      ) : (
                        <div className="h-12 p-4 bg-muted/30 rounded-lg text-foreground font-medium flex items-center">
                          {profile?.last_name || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="h-12 bg-white/50 border-2 focus:border-primary/50 transition-colors"
                        />
                      ) : (
                        <div className="h-12 p-4 bg-muted/30 rounded-lg text-foreground font-medium flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {profile?.phone || 'Not provided'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-base font-semibold">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Enter your location"
                          className="h-12 bg-white/50 border-2 focus:border-primary/50 transition-colors"
                        />
                      ) : (
                        <div className="h-12 p-4 bg-muted/30 rounded-lg text-foreground font-medium flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {formData.location || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-base font-semibold">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself and your conservation interests..."
                        className="min-h-[120px] bg-white/50 border-2 focus:border-primary/50 transition-colors resize-none"
                      />
                    ) : (
                      <div className="min-h-[80px] p-4 bg-muted/30 rounded-lg text-foreground">
                        {formData.bio || 'No bio provided'}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                      <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="flex items-center gap-2 min-w-[140px]"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="min-w-[140px]">
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                  <p className="text-muted-foreground">Navigate to key areas of your account</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" asChild className="h-14 justify-start gap-3 hover:shadow-md transition-all duration-200">
                      <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">View Dashboard</div>
                          <div className="text-xs text-muted-foreground">Your overview</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-14 justify-start gap-3 hover:shadow-md transition-all duration-200">
                      <Link to="/browse" className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Browse Experiences</div>
                          <div className="text-xs text-muted-foreground">Find adventures</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-14 justify-start gap-3 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
                      <Link to="/impact-ledger" className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Impact Ledger</div>
                          <div className="text-xs text-muted-foreground">Track your impact</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;