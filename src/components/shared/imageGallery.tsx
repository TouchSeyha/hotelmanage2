'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const LightboxWrapper = lazy(() => import('./lightboxWrapper'));

export interface GalleryImage {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  thumbnailClassName?: string;
  columns?: 2 | 3 | 4 | 5;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export function ImageGallery({
  images,
  className,
  thumbnailClassName,
  columns = 4,
  aspectRatio = 'video',
}: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (clickedIndex: number) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto',
  };

  return (
    <>
      <div className={cn('grid gap-4', columnClasses[columns], className)}>
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => handleImageClick(idx)}
            className={cn(
              'group focus:ring-ring relative overflow-hidden rounded-lg transition-all hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none',
              aspectClasses[aspectRatio],
              thumbnailClassName
            )}
            type="button"
            aria-label={image.alt ?? `View image ${idx + 1}`}
          >
            <Image
              src={image.src}
              alt={image.alt ?? `Gallery image ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {image.title ? (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{image.title}</p>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        }
      >
        <LightboxWrapper
          open={open}
          onClose={() => setOpen(false)}
          index={index}
          slides={images.map((img) => ({
            src: img.src,
            alt: img.alt,
            width: img.width ?? 1920,
            height: img.height ?? 1080,
          }))}
        />
      </Suspense>
    </>
  );
}

interface ImagePreviewProps {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
}

export function ImagePreview({
  src,
  alt,
  title,
  width,
  height,
  className,
  imageClassName,
}: ImagePreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'group focus:ring-ring relative overflow-hidden rounded-lg transition-all hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none',
          className
        )}
        type="button"
        aria-label={alt ?? 'View image'}
      >
        <Image
          src={src}
          alt={alt ?? 'Preview image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          className={cn(
            'object-cover transition-transform duration-300 group-hover:scale-105',
            imageClassName
          )}
        />
        {title ? (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-sm font-medium text-white">{title}</p>
          </div>
        ) : null}
      </button>

      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        }
      >
        <LightboxWrapper
          open={open}
          onClose={() => setOpen(false)}
          index={0}
          slides={[
            {
              src,
              alt,
              width: width ?? 1920,
              height: height ?? 1080,
            },
          ]}
        />
      </Suspense>
    </>
  );
}
