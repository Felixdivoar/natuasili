import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const WildlifeQuiz: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePhotoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhotos = [...photos];
      newPhotos[index] = e.target?.result as string;
      setPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handleSpeciesChange = (index: number, value: string) => {
    const newSpecies = [...species];
    newSpecies[index] = value;
    setSpecies(newSpecies);
  };

  const submitQuiz = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to participate in the wildlife quiz',
        variant: 'destructive'
      });
      return;
    }

    if (photos.length === 0 || species.every(s => !s.trim())) {
      toast({
        title: 'Incomplete Quiz',
        description: 'Please upload at least one photo and identify the species',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('wildlife-quiz', {
        body: {
          action: 'submit_quiz',
          userId: user.id,
          userSpecies: species.filter(s => s.trim()),
          photos: photos.filter(p => p),
          date: new Date().toISOString().split('T')[0]
        }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: 'Quiz Submitted!',
        description: `You got ${data.correct_count} out of ${data.total_count} correct!`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {results.accuracy}%
            </div>
            <p className="text-muted-foreground">
              {results.correct_count} out of {results.total_count} correct
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{results.feedback}</p>
          </div>

          <Button 
            onClick={() => {
              setResults(null);
              setPhotos([]);
              setSpecies(['', '', '']);
            }}
            className="w-full"
          >
            Take Another Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Daily Wildlife Spotting Challenge
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Find and photograph up to 3 different wildlife species, then identify them!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center bg-muted/20">
                {photos[index] ? (
                  <img 
                    src={photos[index]} 
                    alt={`Wildlife ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Photo {index + 1}</p>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(index, file);
                }}
                className="hidden"
                id={`photo-upload-${index}`}
              />
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
              >
                Upload Photo
              </Button>
              
              <Input
                placeholder="Species name"
                value={species[index]}
                onChange={(e) => handleSpeciesChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Button
          onClick={submitQuiz}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WildlifeQuiz;