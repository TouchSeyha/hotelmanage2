'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock, XCircle } from 'lucide-react';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ConfirmDialog } from '~/components/shared/confirmDialog';
import { EmptyState } from '~/components/shared/emptyState';
import { BookingCardSkeleton } from '~/components/shared/loadingSkeleton';
import { Breadcrumb } from '~/components/shared/breadcrumb';
import { StatusBadge } from '~/components/shared/statusBadge';
import { WriteReviewButton } from '~/components/reviews/writeReviewButton';
import type { BookingStatus, PaymentStatus } from '~/lib/schemas';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = api.booking.getAll.useQuery({
    limit: 50,
  });

  const cancelBooking = api.booking.cancel.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const bookings = data?.bookings ?? [];
  const now = new Date();

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkInDate) >= now && b.status !== 'cancelled' && b.status !== 'completed'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || (new Date(b.checkOutDate) < now && b.status !== 'cancelled')
  );
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const getDisplayBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'past':
        return pastBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return [];
    }
  };

  const displayBookings = getDisplayBookings();

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Bookings' }]} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your hotel reservations</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/book">New Booking</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {displayBookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={`No ${activeTab} bookings`}
              description={
                activeTab === 'upcoming'
                  ? "You don't have any upcoming reservations."
                  : activeTab === 'past'
                    ? "You haven't completed any stays yet."
                    : "You haven't cancelled any bookings."
              }
              action={
                activeTab === 'upcoming' ? (
                  <Button asChild>
                    <Link href="/rooms">Browse Rooms</Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            displayBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg">{booking.room.roomType.name}</CardTitle>
                    <CardDescription>Booking #{booking.bookingNumber}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={booking.status as BookingStatus} type="booking" />
                    <StatusBadge status={booking.paymentStatus as PaymentStatus} type="payment" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                          {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {Math.ceil(
                            (new Date(booking.checkOutDate).getTime() -
                              new Date(booking.checkInDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          nights
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <span>Room {booking.room.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span>{booking.numberOfGuests} guest(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span>${Number(booking.totalPrice)} total</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {activeTab === 'past' && (booking.status === 'completed' || booking.status === 'checked_out') && (
                      <WriteReviewButton
                        bookingId={booking.id}
                        bookingNumber={booking.bookingNumber}
                        roomName={booking.room.roomType.name}
                        onReviewSubmitted={() => void refetch()}
                      />
                    )}
                    {activeTab === 'upcoming' && booking.status !== 'checked_in' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setCancelBookingId(booking.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Booking Confirmation Dialog */}
      <ConfirmDialog
        open={!!cancelBookingId}
        onOpenChange={() => setCancelBookingId(null)}
        title="Cancel Booking?"
        description="Are you sure you want to cancel this booking? This action cannot be undone. You may be subject to a cancellation fee depending on our policy."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        onConfirm={() => cancelBookingId && cancelBooking.mutate({ id: cancelBookingId })}
        variant="destructive"
        loading={cancelBooking.isPending}
      />
    </div>
  );
}
