'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ConfirmDialog } from '~/components/shared/confirmDialog';
import type { BookingStatus, PaymentStatus } from '~/lib/schemas';

interface QuickActionsProps {
  bookingId: string;
  bookingNumber: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  userId: string;
}

export function QuickActions({
  bookingId,
  bookingNumber,
  status,
  paymentStatus,
  userId,
}: QuickActionsProps) {
  const utils = api.useUtils();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
  const [showEarlyCheckOutDialog, setShowEarlyCheckOutDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  // Mutations
  const confirmPayment = api.booking.confirmPayment.useMutation({
    onSuccess: async () => {
      toast.success('Payment confirmed successfully');
      await utils.booking.getById.invalidate({ id: bookingId });
      setShowConfirmPaymentDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkIn = api.booking.checkIn.useMutation({
    onSuccess: async () => {
      toast.success('Guest checked in successfully');
      await utils.booking.getById.invalidate({ id: bookingId });
      setShowCheckInDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkOut = api.booking.checkOut.useMutation({
    onSuccess: async () => {
      toast.success('Guest checked out successfully');
      await utils.booking.getById.invalidate({ id: bookingId });
      setShowCheckOutDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const earlyCheckout = api.booking.earlyCheckout.useMutation({
    onSuccess: async () => {
      toast.success('Guest checked out early - Room marked for cleaning');
      await utils.booking.getById.invalidate({ id: bookingId });
      setShowEarlyCheckOutDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const cancelBooking = api.booking.cancel.useMutation({
    onSuccess: async () => {
      toast.success('Booking cancelled successfully');
      await utils.booking.getById.invalidate({ id: bookingId });
      setShowCancelDialog(false);
      setCancellationReason('');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmPayment = () => {
    confirmPayment.mutate({ id: bookingId });
  };

  const handleCheckIn = () => {
    checkIn.mutate({ id: bookingId });
  };

  const handleCheckOut = () => {
    checkOut.mutate({ id: bookingId });
  };

  const handleEarlyCheckOut = () => {
    earlyCheckout.mutate({ id: bookingId });
  };

  const handleCancelBooking = () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    cancelBooking.mutate({
      id: bookingId,
      cancellationReason: cancellationReason.trim(),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {status === 'confirmed' && paymentStatus === 'pending' && (
            <Button
              className="w-full"
              variant="default"
              onClick={() => setShowConfirmPaymentDialog(true)}
              disabled={confirmPayment.isPending}
            >
              {confirmPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </Button>
          )}
          {status === 'confirmed' && (
            <Button
              className="w-full"
              variant="default"
              onClick={() => setShowCheckInDialog(true)}
              disabled={checkIn.isPending}
            >
              {checkIn.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking In...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In
                </>
              )}
            </Button>
          )}
          {status === 'checked_in' && (
            <>
              <Button
                className="w-full"
                variant="default"
                onClick={() => setShowEarlyCheckOutDialog(true)}
                disabled={earlyCheckout.isPending}
              >
                {earlyCheckout.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Out...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Early Check Out
                  </>
                )}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowCheckOutDialog(true)}
                disabled={checkOut.isPending}
              >
                {checkOut.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Out...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Normal Check Out
                  </>
                )}
              </Button>
            </>
          )}
          {['pending', 'confirmed'].includes(status) && (
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Booking
                </>
              )}
            </Button>
          )}
          <Button className="w-full" variant="outline" asChild>
            <Link href={`/admin/users/${userId}`}>View Guest Profile</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Confirm Payment Dialog */}
      <ConfirmDialog
        open={showConfirmPaymentDialog}
        onOpenChange={setShowConfirmPaymentDialog}
        title="Confirm Payment"
        description={`Are you sure you want to mark payment as received for booking ${bookingNumber}? This will update the booking status to confirmed.`}
        confirmLabel="Confirm Payment"
        onConfirm={handleConfirmPayment}
        loading={confirmPayment.isPending}
      />

      {/* Check In Dialog */}
      <ConfirmDialog
        open={showCheckInDialog}
        onOpenChange={setShowCheckInDialog}
        title="Check In Guest"
        description={`Are you sure you want to check in the guest for booking ${bookingNumber}? The room will be marked as occupied.`}
        confirmLabel="Check In"
        onConfirm={handleCheckIn}
        loading={checkIn.isPending}
      />

      {/* Check Out Dialog */}
      <ConfirmDialog
        open={showCheckOutDialog}
        onOpenChange={setShowCheckOutDialog}
        title="Check Out Guest"
        description={`Are you sure you want to check out the guest for booking ${bookingNumber}? The room will be marked as available.`}
        confirmLabel="Check Out"
        onConfirm={handleCheckOut}
        loading={checkOut.isPending}
      />

      {/* Early Check Out Dialog */}
      <ConfirmDialog
        open={showEarlyCheckOutDialog}
        onOpenChange={setShowEarlyCheckOutDialog}
        title="Early Check Out Guest"
        description={`Are you sure you want to check out the guest early for booking ${bookingNumber}? The room will be marked for cleaning.`}
        confirmLabel="Early Check Out"
        onConfirm={handleEarlyCheckOut}
        loading={earlyCheckout.isPending}
      />

      {/* Cancel Booking Dialog - Custom Implementation */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Cancel Booking</h2>
            <div className="mt-4 space-y-3">
              <p className="text-muted-foreground text-sm">
                Are you sure you want to cancel booking {bookingNumber}?
              </p>
              <div>
                <label htmlFor="cancellation-reason" className="text-sm font-medium">
                  Cancellation Reason *
                </label>
                <textarea
                  id="cancellation-reason"
                  className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Please provide a reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancellationReason('');
                }}
                disabled={cancelBooking.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={cancelBooking.isPending}
              >
                {cancelBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
