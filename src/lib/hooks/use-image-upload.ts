import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '~/server/upload';

export type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
};

export type UploadedImage = {
  url: string;
  pathname: string;
  file: File;
};

export type UseImageUploadOptions = {
  folder?: string;
  maxSize?: number;
  allowedTypes?: readonly string[];
  onUploadComplete?: (image: UploadedImage) => void;
  onUploadError?: (error: string) => void;
};

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    folder = 'room-types',
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_MIME_TYPES,
    onUploadComplete,
    onUploadError,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const validateFile = useCallback(
    (file: File): { valid: true } | { valid: false; error: string } => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
        };
      }

      // Check file size
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
        };
      }

      return { valid: true };
    },
    [allowedTypes, maxSize]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      // Reset state
      setState({
        isUploading: true,
        progress: 0,
        error: null,
      });

      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          setState({
            isUploading: false,
            progress: 0,
            error: validation.error,
          });
          toast.error(validation.error);
          onUploadError?.(validation.error);
          return null;
        }

        // Upload to server
        const url = `/api/upload?filename=${encodeURIComponent(file.name)}&folder=${encodeURIComponent(folder)}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(errorData.error ?? 'Upload failed');
        }

        const result = (await response.json()) as {
          url: string;
          pathname: string;
        };

        const uploadedImage: UploadedImage = {
          url: result.url,
          pathname: result.pathname,
          file,
        };

        setState({
          isUploading: false,
          progress: 100,
          error: null,
        });

        toast.success('Image uploaded successfully');
        onUploadComplete?.(uploadedImage);

        return uploadedImage;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';

        setState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
        });

        toast.error(errorMessage);
        onUploadError?.(errorMessage);

        return null;
      }
    },
    [folder, validateFile, onUploadComplete, onUploadError]
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<UploadedImage[]> => {
      const results = await Promise.all(files.map((file) => uploadImage(file)));
      return results.filter((result): result is UploadedImage => result !== null);
    },
    [uploadImage]
  );

  return {
    ...state,
    uploadImage,
    uploadMultiple,
    validateFile,
  };
}
