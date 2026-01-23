'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import { ZoomIn, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const LightboxWrapper = lazy(() => import('./lightboxWrapper'));

export interface RoomGalleryImage {
  src: string;
  alt?: string;
  title?: string;
}

interface RoomGalleryProps {
  images: RoomGalleryImage[];
  roomName: string;
  className?: string;
  maxThumbnails?: number;
}

export function RoomGallery({ images, roomName, className, maxThumbnails = 4 }: RoomGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (clickedIndex: number) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  const primaryImage = images[0];
  const thumbnailImages = images.slice(1, maxThumbnails + 1);
  const remainingCount = Math.max(0, images.length - maxThumbnails - 1);

  if (!primaryImage) {
    return (
      <div
        className={cn(
          'bg-muted flex aspect-video items-center justify-center rounded-lg',
          className
        )}
      >
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-2', className)}>
        {/* Primary Hero Image */}
        <button
          type="button"
          onClick={() => handleImageClick(0)}
          className="group focus:ring-ring relative aspect-4/3 w-full overflow-hidden rounded-lg transition-all hover:opacity-95 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label={`View ${roomName} primary image`}
        >
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt ?? `${roomName} - Primary View`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Hover overlay with zoom icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-5 w-5" />
              <span className="text-sm font-medium">Click to enlarge</span>
            </div>
          </div>
        </button>

        {/* Thumbnail Grid */}
        {thumbnailImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnailImages.map((image, idx) => {
              const actualIndex = idx + 1;
              const isLastThumbnail = idx === thumbnailImages.length - 1;
              const showMoreOverlay = isLastThumbnail && remainingCount > 0;

              return (
                <button
                  key={actualIndex}
                  type="button"
                  onClick={() => handleImageClick(actualIndex)}
                  className="group focus:ring-ring relative aspect-square overflow-hidden rounded-md transition-all hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  aria-label={
                    showMoreOverlay
                      ? `View ${remainingCount + 1} more images`
                      : `View ${roomName} image ${actualIndex + 1}`
                  }
                >
                  <Image
                    src={image.src}
                    alt={image.alt ?? `${roomName} - Image ${actualIndex + 1}`}
                    fill
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12vw, 10vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* "More images" overlay on last thumbnail */}
                  {showMoreOverlay ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-lg font-semibold text-white">+{remainingCount}</span>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {/* Hint text */}
        <p className="text-muted-foreground text-center text-xs">
          Click any image to view full gallery with zoom
        </p>
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
          slides={images.map((img, idx) => ({
            src: img.src,
            alt: img.alt ?? `${roomName} - Image ${idx + 1}`,
            width: 1920,
            height: 1080,
          }))}
        />
      </Suspense>
    </>
  );
}
