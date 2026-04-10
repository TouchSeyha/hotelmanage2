'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { useBooking } from './booking-context';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { PhoneInput } from '~/components/ui/phoneInput';
import { Textarea } from '~/components/ui/textarea';
import { guestInfoSchema, defaultGuestInfoFormData, type GuestInfoFormData } from '~/lib/schemas';

interface Step2GuestProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function Step2Guest({ userEmail, userName }: Step2GuestProps) {
  const { state, setGuestInfo, goToStep } = useBooking();

  const form = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      ...defaultGuestInfoFormData,
      guestName: state.guestName ?? userName ?? '',
      guestEmail: state.guestEmail ?? userEmail ?? '',
      guestPhone: state.guestPhone ?? '',
      specialRequests: state.specialRequests ?? '',
    },
  });

  // Prefill user info
  useEffect(() => {
    if (userName && !form.getValues('guestName')) {
      form.setValue('guestName', userName);
    }
    if (userEmail && !form.getValues('guestEmail')) {
      form.setValue('guestEmail', userEmail);
    }
  }, [userName, userEmail, form]);

  const onSubmit = (data: GuestInfoFormData) => {
    setGuestInfo({
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      specialRequests: data.specialRequests ?? '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Guest Details</h2>
        <p className="text-muted-foreground">Please provide the details of the primary guest</p>
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
              <p className="text-muted-foreground">Check-in</p>
              <p className="font-medium">
                {state.checkIn ? format(state.checkIn, 'EEE, MMM d, yyyy') : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p className="font-medium">
                {state.checkOut ? format(state.checkOut, 'EEE, MMM d, yyyy') : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Guests</p>
              <p className="font-medium">{state.guests}</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-muted-foreground">
                {state.totalNights} nights x ${state.basePrice}
              </p>
              <p className="text-lg font-bold">${state.totalPrice} total</p>
            </div>
          </CardContent>
        </Card>

        {/* Guest Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Primary Guest Information</CardTitle>
            <CardDescription>
              This information will be used for your booking confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or notes for your stay..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        E.g., early check-in, dietary requirements, accessibility needs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => goToStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
