-- Create storage bucket for user avatars and partner files
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-files', 'partner-files', true);

-- Create policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for partner file uploads
CREATE POLICY "Partner files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partner-files');

CREATE POLICY "Users can upload to partner files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'partner-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their partner files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'partner-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their partner files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'partner-files' AND auth.uid()::text = (storage.foldername(name))[1]);