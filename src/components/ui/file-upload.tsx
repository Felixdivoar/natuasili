import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'avatar' | 'document';
}

export function FileUpload({
  onFileSelect,
  onUploadComplete,
  onUploadError,
  accept = "image/*,.pdf",
  maxSizeMB = 10,
  disabled = false,
  loading = false,
  className,
  children,
  variant = 'default'
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onUploadError?.(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || loading) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return "w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center";
      case 'document':
        return "border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50";
      default:
        return "border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50";
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || loading}
      />
      
      <div
        className={cn(
          getVariantStyles(),
          dragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          "cursor-pointer transition-colors",
          className
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !loading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={cn(
              "text-muted-foreground",
              variant === 'avatar' ? "h-6 w-6" : "h-8 w-8"
            )} />
            <div className="text-sm">
              <p className="text-muted-foreground">
                {variant === 'avatar' ? 'Upload photo' : 'Click to upload or drag and drop'}
              </p>
              {variant !== 'avatar' && (
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG up to {maxSizeMB}MB
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FileUploadButton({
  onFileSelect,
  accept = "image/*,.pdf",
  disabled = false,
  loading = false,
  children,
  variant = "outline",
  size = "default"
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || loading}
      />
      
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        {children || "Upload File"}
      </Button>
    </>
  );
}