'use client';

import { useState } from 'react';
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
import type { ReviewStatus } from '~/lib/schemas';

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const utils = api.useUtils();

  const { data, isLoading, refetch } = api.review.getAll.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    rating: ratingFilter === 'all' ? undefined : ratingFilter,
    search: searchQuery || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const reviews = data?.reviews ?? [];
  const pendingCount = data?.pendingCount ?? 0;

  // Approve mutation
  const approveMutation = api.review.approve.useMutation({
    onSuccess: () => {
      toast.success('Review approved and published');
      void refetch();
      void utils.review.getAll.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to approve review', {
        description: error.message,
      });
    },
  });

  // Reject mutation
  const rejectMutation = api.review.reject.useMutation({
    onSuccess: () => {
      toast.success('Review rejected');
      setRejectDialogOpen(false);
      setSelectedReview(null);
      setRejectionReason('');
      void refetch();
      void utils.review.getAll.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to reject review', {
        description: error.message,
      });
    },
  });

  // Delete mutation
  const deleteMutation = api.review.delete.useMutation({
    onSuccess: () => {
      toast.success('Review deleted permanently');
      setDeleteId(null);
      void refetch();
      void utils.review.getAll.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to delete review', {
        description: error.message,
      });
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
            <h1 className="text-3xl font-bold tracking-tight">Reviews Management</h1>
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
                          >
                            <Eye className="h-4 w-4" />
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
