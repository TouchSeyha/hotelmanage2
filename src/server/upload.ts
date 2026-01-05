import { put, del } from '@vercel/blob';

// Maximum file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image MIME types
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// File extension mapping
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export type UploadOptions = {
  folder?: string;
  filename: string;
  contentType: string;
  maxSize?: number;
};

export type UploadResult = {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
};

/**
 * Validates file upload parameters
 */
export function validateUpload(options: {
  filename: string;
  contentType: string | null;
  contentLength: string | null;
  maxSize?: number;
}): { valid: true } | { valid: false; error: string } {
  const { filename, contentType, contentLength, maxSize = MAX_FILE_SIZE } = options;

  if (!filename) {
    return { valid: false, error: 'Filename is required' };
  }

  if (
    !contentType ||
    !ALLOWED_MIME_TYPES.includes(contentType as (typeof ALLOWED_MIME_TYPES)[number])
  ) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  if (!contentLength) {
    return { valid: false, error: 'Content-Length header is required' };
  }

  const fileSize = parseInt(contentLength, 10);
  if (isNaN(fileSize) || fileSize <= 0) {
    return { valid: false, error: 'Invalid file size' };
  }

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generates a safe filename with timestamp to avoid collisions
 */
export function generateSafeFilename(
  filename: string,
  contentType: string,
  folder = 'uploads'
): string {
  const timestamp = Date.now();
  const extension = MIME_TO_EXT[contentType] ?? 'jpg';
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/\.[^.]+$/, '') // Remove existing extension
    .toLowerCase();

  return `${folder}/${timestamp}-${sanitizedFilename}.${extension}`;
}

/**
 * Uploads a file to Vercel Blob storage
 */
export async function uploadToBlob(
  body: ReadableStream | ArrayBuffer,
  options: UploadOptions
): Promise<UploadResult> {
  const { folder = 'uploads', filename, contentType } = options;

  const safeFilename = generateSafeFilename(filename, contentType, folder);

  const blob = await put(safeFilename, body, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType ?? contentType,
    size: 0, // Size not returned by put()
  };
}

/**
 * Deletes a file from Vercel Blob storage
 */
export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}

/**
 * Deletes multiple files from Vercel Blob storage
 */
export async function deleteManyFromBlob(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => del(url)));
}
