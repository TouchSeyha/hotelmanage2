'use client';

import { format } from 'date-fns';
import { MessageSquare, Calendar, MapPin, Clock } from 'lucide-react';
import { api } from '~/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { EmptyState } from '~/components/shared/emptyState';
import { BookingCardSkeleton } from '~/components/shared/loadingSkeleton';
import { Breadcrumb } from '~/components/shared/breadcrumb';
import { StarRating } from '~/components/reviews/starRating';
import { cn } from '~/lib/utils';
import { Reveal } from '~/components/motion/reveal';
import { AnimatedList } from '~/components/motion/animatedList';

export default function MyReviewsPage() {
  const { data, isLoading } = api.review.getMyReviews.useQuery();

  const reviews = data?.reviews ?? [];

  if (isLoading) {
    return (
      <div className="container py-8">
        <Reveal className="mb-6">
          <h1 className="text-2xl font-bold">My Reviews</h1>
        </Reveal>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          variant: 'success' as const,
          label: 'Published',
          description: 'Your review is live on our website',
        };
      case 'pending':
        return {
          variant: 'warning' as const,
          label: 'Pending',
          description: 'Under review by our team',
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          label: 'Not Published',
          description: 'This review did not meet our guidelines',
        };
      default:
        return {
          variant: 'outline' as const,
          label: status,
          description: '',
        };
    }
  };

  return (
    <div className="container py-8">
      <Reveal>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Reviews' }]} />
      </Reveal>

      <Reveal delay={1} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Your feedback helps other guests make informed decisions
        </p>
      </Reveal>

      <Reveal delay={2} variant="panel">
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Complete a stay to share your experience and help future guests."
          />
        ) : (
          <AnimatedList className="grid gap-6">
            {reviews.map((review) => {
              const statusInfo = getStatusInfo(review.status);
              return (
                <Card
                  key={review.id}
                  className={cn(
                    'motion-card-hover overflow-hidden transition-all duration-300 hover:shadow-md',
                    review.status === 'approved' && 'border-l-4 border-l-green-500',
                    review.status === 'pending' && 'border-l-4 border-l-amber-500',
                    review.status === 'rejected' && 'border-l-4 border-l-red-500 opacity-75'
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-xl">{review.roomType.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                          <MapPin className="h-3 w-3" />
                          Room {review.room.roomNumber}
                          <span className="mx-1">•</span>
                          <Calendar className="h-3 w-3" />
                          {format(new Date(review.booking.checkInDate), 'MMM d')} -{' '}
                          {format(new Date(review.booking.checkOutDate), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Review Comment */}
                    <div className="bg-muted/30 border-border/40 rounded-lg border p-4">
                      <p className="text-foreground/90 text-sm leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    {/* Status Description */}
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Submitted {format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                      {statusInfo.description && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{statusInfo.description}</span>
                        </>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {review.status === 'rejected' && review.rejectionReason && (
                      <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                        <p className="text-destructive text-xs font-medium">
                          Reason: {review.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </AnimatedList>
        )}
      </Reveal>
    </div>
  );
}
