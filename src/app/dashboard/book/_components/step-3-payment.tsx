'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, CreditCard, Building2, Loader2, CheckCircle } from 'lucide-react';

import { api } from '~/trpc/react';
import { useBooking } from './booking-context';
import type { PaymentMethod } from '~/lib/schemas';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Building2;
}> = [
  {
    id: 'counter',
    label: 'Pay at Hotel',
    description: 'Pay in cash or card upon arrival',
    icon: Building2,
  },
  {
    id: 'online',
    label: 'Online Payment',
    description: 'Pay now via bank transfer or online banking',
    icon: CreditCard,
  },
];

export function Step3Payment() {
  const router = useRouter();
  const { state, setPaymentMethod, goToStep } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(state.paymentMethod);

  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/book/confirmation?id=${data.id}`);
    },
  });

  const handleConfirmBooking = () => {
    if (!selectedMethod || !state.roomTypeId || !state.checkIn || !state.checkOut) {
      return;
    }

    setPaymentMethod(selectedMethod);

    createBooking.mutate({
      roomTypeId: state.roomTypeId,
      checkInDate: state.checkIn,
      checkOutDate: state.checkOut,
      numberOfGuests: state.guests,
      guestName: state.guestName,
      guestEmail: state.guestEmail,
      guestPhone: state.guestPhone,
      specialRequests: state.specialRequests ?? undefined,
      paymentMethod: selectedMethod,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <p className="text-muted-foreground">Select how you&apos;d like to pay for your stay</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Room Type</p>
              <p className="font-medium">{state.roomTypeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guest</p>
              <p className="font-medium">{state.guestName}</p>
              <p className="text-muted-foreground text-xs">{state.guestEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-in</p>
              <p className="font-medium">
                {state.checkIn ? format(state.checkIn, 'EEE, MMM d, yyyy') : '-'}
              </p>
              <p className="text-muted-foreground text-xs">From 2:00 PM</p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p className="font-medium">
                {state.checkOut ? format(state.checkOut, 'EEE, MMM d, yyyy') : '-'}
              </p>
              <p className="text-muted-foreground text-xs">Until 11:00 AM</p>
            </div>
            <div>
              <p className="text-muted-foreground">Guests</p>
              <p className="font-medium">{state.guests} guest(s)</p>
            </div>
            {state.specialRequests && (
              <div>
                <p className="text-muted-foreground">Special Requests</p>
                <p className="font-medium">{state.specialRequests}</p>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">
                  {state.totalNights} nights x ${state.basePrice}
                </p>
                <p>${state.totalPrice}</p>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2">
                <p className="font-semibold">Total</p>
                <p className="text-lg font-bold">${state.totalPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Select Payment Method</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <Label
                    htmlFor={method.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors',
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground/50'
                    )}
                  >
                    <input
                      type="radio"
                      id={method.id}
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                        selectedMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="text-primary h-5 w-5" />
                    )}
                  </Label>
                </div>
              ))}
            </div>

            {/* Payment Instructions */}
            {selectedMethod === 'online' && (
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">Online Payment</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  After confirming your booking, you will receive payment instructions via email.
                  Payment details include bank transfer information. Please complete payment within
                  24 hours to confirm your booking.
                </p>
              </div>
            )}

            {selectedMethod === 'counter' && (
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">Pay at Hotel</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Payment will be collected upon check-in. We accept cash, credit cards, and debit
                  cards.
                </p>
              </div>
            )}

            {createBooking.error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
                {createBooking.error.message}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(2)}
                disabled={createBooking.isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmBooking}
                disabled={!selectedMethod || createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  `Confirm Booking - $${state.totalPrice}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
