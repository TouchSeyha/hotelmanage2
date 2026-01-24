'use client';

import { format } from 'date-fns';
import { Quote, User } from 'lucide-react';
import { api } from '~/trpc/react';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { StarRating } from './starRating';
import { cn } from '~/lib/utils';

interface PublicReviewsListProps {
  roomId?: string;
  roomTypeId?: string;
  limit?: number;
  className?: string;
}

export function PublicReviewsList({
  roomId,
  roomTypeId,
  limit = 10,
  className,
}: PublicReviewsListProps) {
  const { data, isLoading } = api.review.getApproved.useQuery({
    roomId,
    roomTypeId,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: stats } = api.review.getStats.useQuery({
    roomId,
    roomTypeId,
  });

  const reviews = data?.reviews ?? [];
  const averageRating = stats?.averageRating ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="bg-muted h-20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <Quote className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
        <p className="text-muted-foreground text-sm">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Header */}
      {totalReviews > 0 && (
        <div className="flex items-center gap-6 rounded-xl border border-amber-200/50 bg-linear-to-r from-amber-50 to-amber-100/50 p-6 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-amber-900/10">
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-600 dark:text-amber-500">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} size="sm" />
          </div>
          <div className="border-l border-amber-300/50 pl-6 dark:border-amber-700/50">
            <p className="text-foreground text-2xl font-semibold">
              {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
            </p>
            <p className="text-muted-foreground text-sm">From verified guests</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <Card
            key={review.id}
            className={cn(
              'group overflow-hidden transition-all duration-300 hover:shadow-lg',
              'border-l-4 border-l-amber-500/30 hover:border-l-amber-500'
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CardContent className="space-y-4 p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-amber-500/20">
                    <AvatarImage src={review.user.image ?? undefined} />
                    <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      {review.user.name?.charAt(0).toUpperCase() ?? <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-semibold">{review.user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>

              {/* Review Content */}
              <div className="relative border-l-2 border-amber-200/50 pl-4 dark:border-amber-800/30">
                <Quote className="absolute -top-1 -left-2 h-5 w-5 text-amber-400/40" />
                <p className="text-foreground/90 text-sm leading-relaxed italic">
                  {review.comment}
                </p>
              </div>

              {/* Room Info */}
              <div className="border-border/40 flex items-center gap-2 border-t pt-2">
                <div className="text-muted-foreground text-xs">
                  Stayed in{' '}
                  <span className="text-foreground font-medium">{review.roomType.name}</span>
                  {' • '}Room {review.room.roomNumber}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More (Future Enhancement) */}
      {data?.pagination && data.pagination.total > limit && (
        <div className="pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Showing {reviews.length} of {data.pagination.total} reviews
          </p>
        </div>
      )}
    </div>
  );
}
