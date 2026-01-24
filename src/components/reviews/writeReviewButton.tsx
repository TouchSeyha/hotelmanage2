'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { ReviewFormDialog } from './reviewFormDialog';
import { toast } from 'sonner';

interface WriteReviewButtonProps {
  bookingId: string;
  bookingNumber: string;
  roomName: string;
  onReviewSubmitted?: () => void;
}

export function WriteReviewButton({
  bookingId,
  bookingNumber,
  roomName,
  onReviewSubmitted,
}: WriteReviewButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: eligibility, isLoading } = api.review.canReview.useQuery(
    { bookingId },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const handleClick = () => {
    if (!eligibility?.canReview) {
      toast.error(eligibility?.reason ?? 'Cannot review this booking');
      return;
    }
    setDialogOpen(true);
  };

  // Don't show button if can't review
  if (!isLoading && !eligibility?.canReview) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading || !eligibility?.canReview}
        className="bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Star className="mr-2 h-4 w-4" />
            Write Review
          </>
        )}
      </Button>

      <ReviewFormDialog
        bookingId={bookingId}
        bookingNumber={bookingNumber}
        roomName={roomName}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={onReviewSubmitted}
      />
    </>
  );
}
