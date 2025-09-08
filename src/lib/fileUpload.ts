import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = '',
  userId: string
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder ? folder + '/' : ''}${Date.now()}.${fileExt}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload file' };
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Delete error:', error);
    return { error: 'Failed to delete file' };
  }
}

export function validateFile(file: File, maxSizeMB: number = 10): string | null {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type for images
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  
  if (!allowedImageTypes.includes(file.type) && !allowedDocTypes.includes(file.type)) {
    return 'File must be an image (JPEG, PNG, WebP) or PDF';
  }

  return null;
}