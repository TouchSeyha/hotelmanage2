import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  User,
  CreditCard,
  BedDouble,
  Clock,
  FileText,
  XCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

import { api } from '~/trpc/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Breadcrumb } from '~/components/shared/breadcrumb';
import { StatusBadge } from '~/components/shared/statusBadge';
import { QuickActions } from './_components/quick-actions';

interface BookingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BookingDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const booking = await api.booking.getById({ id });
    return {
      title: `Booking ${booking.bookingNumber}`,
      description: `Booking details for ${booking.guestName ?? booking.user.name}`,
    };
  } catch {
    return {
      title: 'Booking Not Found',
    };
  }
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;

  let booking;
  try {
    booking = await api.booking.getById({ id });
  } catch {
    notFound();
  }

  const paymentStatusColor =
    booking.paymentStatus === 'paid'
      ? 'success'
      : booking.paymentStatus === 'refunded'
        ? 'destructive'
        : 'warning';

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Bookings', href: '/admin/bookings' },
          { label: booking.bookingNumber },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link
              href="/admin/bookings"
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Booking #{booking.bookingNumber}</h1>
          <p className="text-muted-foreground mt-1">
            Created on {format(new Date(booking.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={booking.status} />
          <Badge variant={paymentStatusColor}>
            {booking.paymentStatus === 'paid'
              ? 'Paid'
              : booking.paymentStatus === 'refunded'
                ? 'Refunded'
                : 'Payment Pending'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{booking.guestName ?? booking.user.name ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{booking.guestEmail ?? booking.user.email ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{booking.guestPhone ?? booking.user.phone ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Number of Guests</p>
                <p className="font-medium">{booking.numberOfGuests}</p>
              </div>
            </CardContent>
          </Card>

          {/* Room Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Room Type</p>
                  <p className="font-medium">{booking.room.roomType.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Room Number</p>
                  <p className="font-medium">{booking.room.roomNumber}</p>
                </div>
                {booking.room.floor && (
                  <div>
                    <p className="text-muted-foreground text-sm">Floor</p>
                    <p className="font-medium">{booking.room.floor}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-sm">Description</p>
                <p className="text-sm">{booking.room.roomType.shortDescription}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stay Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Stay Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Check-in</p>
                <p className="font-medium">
                  {format(new Date(booking.checkInDate), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-muted-foreground text-xs">From 2:00 PM</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Check-out</p>
                <p className="font-medium">
                  {format(new Date(booking.checkOutDate), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-muted-foreground text-xs">Until 11:00 AM</p>
              </div>
              {booking.checkedInAt && (
                <div>
                  <p className="text-muted-foreground text-sm">Actual Check-in</p>
                  <p className="font-medium">
                    {format(new Date(booking.checkedInAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
              {booking.checkedOutAt && (
                <div>
                  <p className="text-muted-foreground text-sm">Actual Check-out</p>
                  <p className="font-medium">
                    {format(new Date(booking.checkedOutAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Special Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Reason */}
          {booking.cancellationReason && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Cancellation Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{booking.cancellationReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Booking Logs */}
          {booking.logs && booking.logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity Log
                </CardTitle>
                <CardDescription>History of changes to this booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.logs.map((log) => (
                    <div key={log.id} className="border-muted border-l-2 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{log.action.replace(/_/g, ' ')}</p>
                          <p className="text-muted-foreground text-sm">
                            by {log.performedBy.name ?? 'System'}
                          </p>
                          {log.notes && (
                            <p className="text-muted-foreground mt-1 text-sm">{log.notes}</p>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Payment Method</p>
                <p className="font-medium">
                  {booking.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Hotel'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment Status</p>
                <Badge variant={paymentStatusColor} className="mt-1">
                  {booking.paymentStatus === 'paid'
                    ? 'Paid'
                    : booking.paymentStatus === 'refunded'
                      ? 'Refunded'
                      : 'Pending'}
                </Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm">Total Amount</p>
                <p className="text-2xl font-bold">${Number(booking.totalPrice)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActions
            bookingId={booking.id}
            bookingNumber={booking.bookingNumber}
            status={booking.status}
            paymentStatus={booking.paymentStatus}
            userId={booking.userId}
          />
        </div>
      </div>
    </div>
  );
}
