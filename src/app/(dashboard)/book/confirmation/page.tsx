'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  CheckCircle,
  Calendar,
  User,
  CreditCard,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import type { PaymentMethod } from '~/lib/schemas/booking';

function PaymentInstructions({ method, amount }: { method: PaymentMethod; amount: number }) {
  if (method === 'online') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
            <CreditCard className="h-5 w-5" />
            Online Payment Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <p>
            Please transfer <strong>${amount}</strong> to the following account:
          </p>
          <div className="mt-3 rounded bg-white p-3">
            <p>
              <strong>Bank:</strong> Example Bank
            </p>
            <p>
              <strong>Account Name:</strong> Hotel Name Co., Ltd.
            </p>
            <p>
              <strong>Account Number:</strong> 123-456-7890
            </p>
          </div>
          <p className="mt-3">
            Please complete the transfer within 24 hours to confirm your booking. Include your
            booking reference in the transfer note.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
          <CreditCard className="h-5 w-5" />
          Pay at Hotel
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-orange-700">
        <p>
          Payment of <strong>${amount}</strong> will be collected upon check-in.
        </p>
        <p className="mt-2">
          We accept cash, credit cards, and debit cards. Please bring a valid ID for check-in.
        </p>
      </CardContent>
    </Card>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  const {
    data: booking,
    isLoading,
    error,
  } = api.booking.getById.useQuery({ id: bookingId! }, { enabled: !!bookingId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-12">
        <Card className="border-destructive mx-auto max-w-md">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <h2 className="text-xl font-semibold">Booking Not Found</h2>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t find your booking. Please try again or contact support.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/book">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">Your booking has been successfully created</p>
        <Badge variant="outline" className="mt-3 text-lg">
          Booking #{booking.id.slice(-8).toUpperCase()}
        </Badge>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Here&apos;s a summary of your reservation</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Check-in</p>
                  <p className="text-muted-foreground">
                    {format(new Date(booking.checkInDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-muted-foreground text-sm">From 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Check-out</p>
                  <p className="text-muted-foreground">
                    {format(new Date(booking.checkOutDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-muted-foreground text-sm">Until 11:00 AM</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Guest</p>
                  <p className="text-muted-foreground">
                    {booking.guestName ?? booking.user.name ?? 'Guest'}
                  </p>
                  <p className="text-muted-foreground text-sm">{booking.numberOfGuests} guest(s)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-2xl font-bold">${Number(booking.totalPrice)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Details */}
        <Card>
          <CardHeader>
            <CardTitle>{booking.room.roomType.name}</CardTitle>
            <CardDescription>{booking.room.roomType.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{booking.room.roomType.description}</p>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <PaymentInstructions method={booking.paymentMethod} amount={Number(booking.totalPrice)} />

        {/* Special Requests */}
        {booking.specialRequests && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{booking.specialRequests}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/bookings">
              View My Bookings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Confirmation Email Notice */}
        <p className="text-muted-foreground text-center text-sm">
          A confirmation email has been sent to{' '}
          <strong>{booking.guestEmail ?? booking.user.email ?? 'your email'}</strong>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
