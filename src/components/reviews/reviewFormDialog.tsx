'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '~/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

interface ReviewFormDialogProps {
  bookingId: string;
  bookingNumber: string;
  roomName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReviewFormDialog({
  bookingId,
  bookingNumber,
  roomName,
  open,
  onOpenChange,
  onSuccess,
}: ReviewFormDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const createReview = api.review.create.useMutation({
    onSuccess: () => {
      toast.success('Review submitted!', {
        description: 'Thank you for sharing your experience. Your review is pending approval.',
      });
      setRating(0);
      setComment('');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to submit review', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    createReview.mutate({
      bookingId,
      rating,
      comment,
    });
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const charCount = comment.length;
  const minChars = 10;
  const maxChars = 1000;
  const isValid = charCount >= minChars && charCount <= maxChars;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-base">
            How was your stay at <span className="text-foreground font-medium">{roomName}</span>?
            <span className="text-muted-foreground mt-1 block text-xs">
              Booking #{bookingNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Your Rating</Label>
            <div className="bg-muted/30 border-border/40 flex items-center gap-4 rounded-lg border p-4">
              <div onMouseLeave={() => setHoveredRating(0)} className="flex-1">
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      className={cn(
                        'group relative transition-all duration-200 hover:scale-110 active:scale-95'
                      )}
                    >
                      <Sparkles
                        className={cn(
                          'absolute -top-1 -right-1 h-3 w-3 text-amber-400 opacity-0 transition-all duration-300',
                          (hoveredRating >= star || rating >= star) && 'animate-pulse opacity-100'
                        )}
                      />
                      <svg
                        className={cn(
                          'h-10 w-10 transition-all duration-300',
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                            : 'text-muted-foreground/30 fill-none'
                        )}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-20 text-right">
                <div className="text-2xl font-bold text-amber-600">
                  {hoveredRating || rating || '—'}
                </div>
                <div className="text-muted-foreground text-xs font-medium">
                  {hoveredRating || rating
                    ? ratingLabels[(hoveredRating || rating) as keyof typeof ratingLabels]
                    : 'Select'}
                </div>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-base font-medium">
              Your Review
            </Label>
            <div className="relative">
              <Textarea
                id="comment"
                placeholder="Share details about your stay, room cleanliness, staff service, amenities..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-35 resize-none text-base leading-relaxed"
                maxLength={maxChars}
              />
              <div className="absolute right-3 bottom-3 text-xs">
                <span
                  className={cn(
                    'font-medium transition-colors',
                    !isValid && charCount > 0
                      ? 'text-destructive'
                      : charCount >= minChars
                        ? 'text-green-600'
                        : 'text-muted-foreground'
                  )}
                >
                  {charCount}
                </span>
                <span className="text-muted-foreground">/{maxChars}</span>
              </div>
            </div>
            {charCount > 0 && charCount < minChars && (
              <p className="text-muted-foreground text-xs">
                {minChars - charCount} more character{minChars - charCount !== 1 ? 's' : ''} needed
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={createReview.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              disabled={!isValid || rating === 0 || createReview.isPending}
            >
              {createReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
