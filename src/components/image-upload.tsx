'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon, Star } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { useImageUpload } from '~/lib/hooks/use-image-upload';

export type ImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
  disabled?: boolean;
  className?: string;
};

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = 'room-types',
  disabled = false,
  className,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const { isUploading, uploadMultiple } = useImageUpload({
    folder,
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      const remainingSlots = maxImages - value.length;
      const filesToUpload = files.slice(0, remainingSlots);

      if (filesToUpload.length > 0) {
        const uploadedImages = await uploadMultiple(filesToUpload);
        const newUrls = uploadedImages.map((img) => img.url);
        onChange([...value, ...newUrls]);
      }
    },
    [disabled, isUploading, maxImages, value, uploadMultiple, onChange]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || disabled || isUploading) return;

      const files = Array.from(e.target.files);
      const remainingSlots = maxImages - value.length;
      const filesToUpload = files.slice(0, remainingSlots);

      if (filesToUpload.length > 0) {
        const uploadedImages = await uploadMultiple(filesToUpload);
        const newUrls = uploadedImages.map((img) => img.url);
        onChange([...value, ...newUrls]);
      }

      // Reset input
      e.target.value = '';
    },
    [disabled, isUploading, maxImages, value, uploadMultiple, onChange]
  );

  const handleRemove = useCallback(
    (url: string) => {
      onChange(value.filter((u) => u !== url));
    },
    [value, onChange]
  );

  const handleSetPrimary = useCallback(
    (index: number) => {
      if (index === 0) return; // Already primary
      const newValue = [...value];
      const [primaryImage] = newValue.splice(index, 1);
      if (primaryImage) {
        newValue.unshift(primaryImage);
        onChange(newValue);
      }
    },
    [value, onChange]
  );

  const canUploadMore = value.length < maxImages;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileInput}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />

          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
            ) : (
              <Upload className="text-muted-foreground h-10 w-10" />
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click or drag images to upload'}
              </p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, or WebP (max 5MB) - {value.length}/{maxImages} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="group bg-muted relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetPrimary(index)}
                    disabled={disabled || isUploading}
                    title="Set as primary image"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemove(url)}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="bg-primary text-primary-foreground absolute bottom-2 left-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && !canUploadMore && (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <ImageIcon className="mb-2 h-10 w-10" />
          <p className="text-sm">No images uploaded</p>
        </div>
      )}
    </div>
  );
}
