'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Loader2,
  User,
  Mail,
  Phone,
  CreditCard,
  LogOut,
  BedDouble,
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';
import { ConfirmDialog } from '~/components/shared/confirmDialog';
import { cn } from '~/lib/utils';
import {
  posBookingFormSchema,
  defaultPOSBookingFormData,
  transformPOSBookingFormToApi,
  type POSBookingFormData,
} from '~/lib/schemas';

export default function POSPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('all');
  const [checkoutBookingId, setCheckoutBookingId] = useState<string | null>(null);
  const [checkoutBookingNumber, setCheckoutBookingNumber] = useState<string>('');

  const { data: roomTypes } = api.roomType.getAll.useQuery();
  const { data: rooms } = api.room.getAll.useQuery();
  const { data: todaySchedule, isLoading: isLoadingSchedule } = api.admin.getTodaySchedule.useQuery();

  const earlyCheckout = api.booking.earlyCheckout.useMutation({
    onSuccess: async () => {
      toast.success('Guest checked out successfully - Room marked for cleaning');
      await utils.admin.getTodaySchedule.invalidate();
      setCheckoutBookingId(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<POSBookingFormData>({
    resolver: zodResolver(posBookingFormSchema),
    defaultValues: defaultPOSBookingFormData,
  });

  const checkInDate = form.watch('checkInDate');
  const checkOutDate = form.watch('checkOutDate');
  const roomId = form.watch('roomId');

  const { data: availability } = api.room.checkAvailability.useQuery(
    {
      checkIn: checkInDate ?? new Date(),
      checkOut: checkOutDate ?? new Date(),
      roomTypeId: selectedRoomTypeId === 'all' ? undefined : selectedRoomTypeId,
    },
    {
      enabled: !!checkInDate && !!checkOutDate && checkOutDate > checkInDate,
    }
  );

  // Reset room selection when room type changes
  useEffect(() => {
    form.setValue('roomId', '');
  }, [selectedRoomTypeId, form]);

  const createBooking = api.booking.createPosBooking.useMutation({
    onSuccess: (data) => {
      toast.success('Walk-in booking created successfully!');
      router.push(`/admin/bookings/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Get the selected room and its type for pricing
  const selectedRoom = rooms?.find((r) => r.id === roomId);
  const selectedType = selectedRoom
    ? roomTypes?.find((rt) => rt.id === selectedRoom.roomTypeId)
    : roomTypes?.find((rt) => rt.id === selectedRoomTypeId);

  const nights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = selectedType ? Number(selectedType.basePrice) * nights : 0;

  // Filter available rooms by selected room type
  const availableRooms = availability?.availableRooms.filter(
    (room) => selectedRoomTypeId === 'all' || room.roomTypeId === selectedRoomTypeId
  );

  const onSubmit = (data: POSBookingFormData) => {
    createBooking.mutate(transformPOSBookingFormToApi(data));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">Create walk-in bookings for guests</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New Walk-in Booking</CardTitle>
            <CardDescription>Enter guest and booking details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium">Stay Dates</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel required>Check-in Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel required>Check-out Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date <= (checkInDate ?? new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Room Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium">Room Selection</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Room Type (Filter)</label>
                      <Select value={selectedRoomTypeId} onValueChange={setSelectedRoomTypeId}>
                        <SelectTrigger>
                          <SelectValue placeholder="All room types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All room types</SelectItem>
                          {roomTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name} - ${Number(type.basePrice)}/night
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField
                      control={form.control}
                      name="roomId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Available Room</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a room" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableRooms && availableRooms.length > 0 ? (
                                availableRooms.map((room) => {
                                  const roomType = roomTypes?.find(
                                    (rt) => rt.id === room.roomTypeId
                                  );
                                  return (
                                    <SelectItem key={room.id} value={room.id}>
                                      Room {room.roomNumber} - {roomType?.name}
                                    </SelectItem>
                                  );
                                })
                              ) : (
                                <SelectItem value="none" disabled>
                                  No rooms available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Number of Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={selectedType?.capacity ?? 10}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        {selectedType && (
                          <FormDescription>Max: {selectedType.capacity} guests</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {availability && (
                    <p
                      className={cn(
                        'text-sm',
                        (availableRooms?.length ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {(availableRooms?.length ?? 0) > 0
                        ? `${availableRooms?.length} room(s) available`
                        : 'No rooms available for selected dates'}
                    </p>
                  )}
                </div>

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Guest Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                              <Input className="pl-9" placeholder="Guest name" {...field} />
                            </div>
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                              <Input className="pl-9" placeholder="Phone number" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                              className="pl-9"
                              type="email"
                              placeholder="guest@example.com"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>For sending booking confirmation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any special requirements..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    createBooking.isPending || !roomId || (availableRooms?.length ?? 0) === 0
                  }
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Create Booking
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRoom || selectedType ? (
              <>
                <div className="space-y-2">
                  {selectedRoom && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="font-medium">Room {selectedRoom.roomNumber}</span>
                    </div>
                  )}
                  {selectedType && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Type</span>
                        <span className="font-medium">{selectedType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per Night</span>
                        <span>${Number(selectedType.basePrice)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Nights</span>
                    <span>{nights}</span>
                  </div>
                  {checkInDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{format(checkInDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {checkOutDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{format(checkOutDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Payment to be collected at counter
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Select a room to see pricing</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Checkouts Section */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Today&apos;s Checkouts
              </CardTitle>
              <CardDescription>
                {todaySchedule?.pendingCheckOuts ?? 0} guest(s) due to check out today
              </CardDescription>
            </div>
            {todaySchedule && todaySchedule.pendingCheckOuts > 0 && (
              <Badge variant="secondary">{todaySchedule.pendingCheckOuts} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : todaySchedule?.checkOuts && todaySchedule.checkOuts.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.checkOuts.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-muted/50 flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <BedDouble className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.user.name}</p>
                      <p className="text-muted-foreground text-sm">
                        Room {booking.room.roomNumber} • {booking.room.roomType.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Booking #{booking.bookingNumber}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setCheckoutBookingId(booking.id);
                      setCheckoutBookingNumber(booking.bookingNumber);
                    }}
                    disabled={earlyCheckout.isPending}
                  >
                    {earlyCheckout.isPending && checkoutBookingId === booking.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Check Out
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No checkouts scheduled for today
            </p>
          )}
        </CardContent>
      </Card>

      {/* Checkout Confirmation Dialog */}
      <ConfirmDialog
        open={!!checkoutBookingId}
        onOpenChange={(open) => {
          if (!open) setCheckoutBookingId(null);
        }}
        title="Confirm Checkout"
        description={`Are you sure you want to check out the guest for booking ${checkoutBookingNumber}? The room will be marked for cleaning.`}
        confirmLabel="Check Out"
        onConfirm={() => {
          if (checkoutBookingId) {
            earlyCheckout.mutate({ id: checkoutBookingId });
          }
        }}
        loading={earlyCheckout.isPending}
      />
    </div>
  );
}
