import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Edit, Trash2, Search, Plus, MapPin, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Experience {
  id: string;
  partner_id: string;
  title: string;
  slug: string;
  hero_image: string | null;
  description: string | null;
  location_text: string | null;
  price_kes_adult: number;
  duration_hours: number | null;
  capacity: number | null;
  visible_on_marketplace: boolean;
  created_at: string;
  updated_at: string;
  partner_profiles: {
    org_name: string;
  } | null;
}

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          partner_profiles(org_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (experienceId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ visible_on_marketplace: !currentVisibility })
        .eq('id', experienceId);

      if (error) throw error;
      
      await fetchExperiences();
      toast({
        title: "Success",
        description: `Experience ${!currentVisibility ? 'published' : 'hidden'}`,
      });
    } catch (error) {
      console.error('Error updating experience visibility:', error);
      toast({
        title: "Error", 
        description: "Failed to update experience visibility",
        variant: "destructive"
      });
    }
  };

  const deleteExperience = async (experienceId: string) => {
    if (!confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;
      
      await fetchExperiences();
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error", 
        description: "Failed to delete experience",
        variant: "destructive"
      });
    }
  };

  const filteredExperiences = experiences.filter(experience =>
    experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (experience.location_text && experience.location_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (experience.partner_profiles?.org_name && experience.partner_profiles.org_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Experiences...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Experience Management</CardTitle>
              <CardDescription>
                Manage all experiences, pricing, and visibility
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-4">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {experience.hero_image ? (
                        <img 
                          src={experience.hero_image} 
                          alt={experience.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {experience.title}
                            </h3>
                            <Badge 
                              variant={experience.visible_on_marketplace ? "default" : "secondary"}
                              className={experience.visible_on_marketplace ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {experience.visible_on_marketplace ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Partner: {experience.partner_profiles?.org_name || 'Unknown'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={experience.visible_on_marketplace ? "outline" : "default"}
                            onClick={() => toggleVisibility(experience.id, experience.visible_on_marketplace)}
                          >
                            {experience.visible_on_marketplace ? 'Hide' : 'Publish'}
                          </Button>
                          <Link to={`/experiences/${experience.slug}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteExperience(experience.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {experience.location_text || 'No location'}
                        </div>
                        {experience.duration_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {experience.duration_hours}h
                          </div>
                        )}
                        {experience.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Up to {experience.capacity}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-foreground">
                          KES {experience.price_kes_adult.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground"> per adult</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(experience.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {experience.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExperiences.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No experiences found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExperiences;