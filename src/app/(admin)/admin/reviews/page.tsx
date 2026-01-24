'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ConfirmDialog } from '~/components/shared/confirmDialog';
import { TableSkeleton } from '~/components/shared/loadingSkeleton';
import { StarRating } from '~/components/reviews/starRating';
import { cn } from '~/lib/utils';
import { useDebounce } from '~/lib/hooks/useDebounce';
import type { ReviewStatus } from '~/lib/schemas';

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const utils = api.useUtils();

  // Memoize query options for stable reference
  const queryOptions = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      rating: ratingFilter === 'all' ? undefined : ratingFilter,
      search: debouncedSearchQuery || undefined,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }),
    [statusFilter, ratingFilter, debouncedSearchQuery]
  );

  const { data, isLoading } = api.review.getAll.useQuery(queryOptions);

  const reviews = data?.reviews ?? [];
  const pendingCount = data?.pendingCount ?? 0;

  // Approve mutation with optimistic updates
  const approveMutation = api.review.approve.useMutation({
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await utils.review.getAll.cancel();

      // Snapshot previous value for rollback
      const previousData = utils.review.getAll.getData(queryOptions);

      // Optimistically update the review status
      utils.review.getAll.setData(queryOptions, (old) => {
        if (!old) return old;
        return {
          ...old,
          reviews: old.reviews.map((r) =>
            r.id === id ? { ...r, status: 'approved' as const } : r
          ),
          pendingCount: Math.max(0, old.pendingCount - 1),
        };
      });

      return { previousData };
    },
    onError: (error, _vars, context) => {
      // Rollback on error
      if (context?.previousData) {
        utils.review.getAll.setData(queryOptions, context.previousData);
      }
      toast.error('Failed to approve review', {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success('Review approved and published');
    },
    onSettled: () => {
      // Sync with server after mutation settles
      void utils.review.getAll.invalidate();
    },
  });

  // Reject mutation with optimistic updates
  const rejectMutation = api.review.reject.useMutation({
    onMutate: async ({ id }) => {
      await utils.review.getAll.cancel();
      const previousData = utils.review.getAll.getData(queryOptions);

      utils.review.getAll.setData(queryOptions, (old) => {
        if (!old) return old;
        return {
          ...old,
          reviews: old.reviews.map((r) =>
            r.id === id ? { ...r, status: 'rejected' as const } : r
          ),
          pendingCount: Math.max(0, old.pendingCount - 1),
        };
      });

      return { previousData };
    },
    onError: (error, _vars, context) => {
      if (context?.previousData) {
        utils.review.getAll.setData(queryOptions, context.previousData);
      }
      toast.error('Failed to reject review', {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success('Review rejected');
      setRejectDialogOpen(false);
      setSelectedReview(null);
      setRejectionReason('');
    },
    onSettled: () => {
      void utils.review.getAll.invalidate();
    },
  });

  // Delete mutation with optimistic updates
  const deleteMutation = api.review.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.review.getAll.cancel();
      const previousData = utils.review.getAll.getData(queryOptions);

      utils.review.getAll.setData(queryOptions, (old) => {
        if (!old) return old;
        const deletedReview = old.reviews.find((r) => r.id === id);
        const wasPending = deletedReview?.status === 'pending';
        return {
          ...old,
          reviews: old.reviews.filter((r) => r.id !== id),
          pendingCount: wasPending ? Math.max(0, old.pendingCount - 1) : old.pendingCount,
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        };
      });

      return { previousData };
    },
    onError: (error, _vars, context) => {
      if (context?.previousData) {
        utils.review.getAll.setData(queryOptions, context.previousData);
      }
      toast.error('Failed to delete review', {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success('Review deleted permanently');
      setDeleteId(null);
    },
    onSettled: () => {
      void utils.review.getAll.invalidate();
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id });
  };

  const handleRejectClick = (id: string) => {
    setSelectedReview(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedReview) return;
    rejectMutation.mutate({
      id: selectedReview,
      rejectionReason: rejectionReason || undefined,
    });
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Published
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reviews Management</h1>
            <p className="text-muted-foreground mt-2">Moderate and publish guest reviews</p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="warning" className="px-4 py-2 text-base">
              {pendingCount} pending review{pendingCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ReviewStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <Select
                value={String(ratingFilter)}
                onValueChange={(value) => setRatingFilter(value === 'all' ? 'all' : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>{data?.pagination.total ?? 0} total reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : reviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className={cn(
                      'transition-colors',
                      review.status === 'pending' && 'bg-amber-50/50 dark:bg-amber-950/10'
                    )}
                  >
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-muted-foreground text-xs">{review.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{review.roomType.name}</div>
                        <div className="text-muted-foreground text-xs">
                          Room {review.room.roomNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} size="sm" />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-muted-foreground line-clamp-2 text-sm">{review.comment}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewDetailId(review.id)}
                          className="text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(review.id)}
                              disabled={approveMutation.isPending}
                              className="text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectClick(review.id)}
                              disabled={rejectMutation.isPending}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {review.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRejectClick(review.id)}
                            disabled={rejectMutation.isPending}
                            className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            title="Unpublish"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {review.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(review.id)}
                            disabled={approveMutation.isPending}
                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(review.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground py-12 text-center">
              No reviews found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
            <DialogDescription>
              Provide an optional reason for rejecting this review. The guest will see this message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="E.g., Contains inappropriate language, violates community guidelines..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-25"
                maxLength={500}
              />
              <p className="text-muted-foreground text-xs">
                {rejectionReason.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Review'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Detail Dialog */}
      <Dialog open={!!viewDetailId} onOpenChange={() => setViewDetailId(null)}>
        <DialogContent className="max-w-2xl">
          {(() => {
            const review = reviews.find((r) => r.id === viewDetailId);
            if (!review) return null;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span>Review Details</span>
                    {getStatusBadge(review.status)}
                  </DialogTitle>
                  <DialogDescription>
                    Submitted on {format(new Date(review.createdAt), 'MMMM d, yyyy \"at\" h:mm a')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Guest & Room Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Guest</Label>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-muted-foreground text-sm">{review.user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Room</Label>
                      <p className="font-medium">{review.roomType.name}</p>
                      <p className="text-muted-foreground text-sm">Room {review.room.roomNumber}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">Rating</Label>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="md" />
                      <span className="font-medium">{review.rating}/5</span>
                    </div>
                  </div>

                  {/* Full Comment */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">Review Comment</Label>
                    <div className="bg-muted/30 border-border/40 rounded-lg border p-4">
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Reason if rejected */}
                  {review.status === 'rejected' && review.rejectionReason && (
                    <div className="space-y-2">
                      <Label className="text-destructive text-xs">Rejection Reason</Label>
                      <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                        <p className="text-destructive text-sm">{review.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  {review.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setViewDetailId(null);
                          handleRejectClick(review.id);
                        }}
                        className="text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          handleApprove(review.id);
                          setViewDetailId(null);
                        }}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve & Publish
                      </Button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setViewDetailId(null);
                        handleRejectClick(review.id);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Unpublish
                    </Button>
                  )}
                  {review.status === 'rejected' && (
                    <Button
                      onClick={() => {
                        handleApprove(review.id);
                        setViewDetailId(null);
                      }}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve & Publish
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setViewDetailId(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Review?"
        description="This will permanently delete the review. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
