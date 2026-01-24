'use client';

import { Star } from 'lucide-react';
import { cn } from '~/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            disabled={!interactive}
            className={cn(
              'transition-all duration-200',
              interactive && 'cursor-pointer hover:scale-110 active:scale-95',
              !interactive && 'cursor-default'
            )}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-all duration-300',
                star <= rating
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-muted-foreground/40 fill-none',
                interactive && star <= rating && 'animate-in zoom-in-50 duration-200'
              )}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-muted-foreground text-sm font-medium">
          {rating > 0 ? rating.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}
