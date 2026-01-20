'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Users, Loader2 } from 'lucide-react';

import { api } from '~/trpc/react';
import { useBooking } from './booking-context';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { cn } from '~/lib/utils';

export function Step1Room() {
  const searchParams = useSearchParams();
  const { setRoom } = useBooking();

  // Get room slug from URL if coming from room detail page
  const roomSlugFromUrl = searchParams.get('room');

  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 2));
  const [guests, setGuests] = useState<string>('1');

  // Fetch room types
  const { data: roomTypes, isLoading } = api.roomType.getAll.useQuery({
    isActive: true,
    sortBy: 'basePrice',
    order: 'asc',
  });

  // Set initial room type from URL
  useEffect(() => {
    if (!roomSlugFromUrl) return;
    const room = roomTypes?.find((r) => r.slug === roomSlugFromUrl);
    if (room) {
      setSelectedRoomTypeId(room.id);
    }
  }, [roomSlugFromUrl, roomTypes]);

  const selectedRoomType = roomTypes?.find((r) => r.id === selectedRoomTypeId);

  // Check availability
  const { data: availability, isFetching: isCheckingAvailability } =
    api.room.checkAvailability.useQuery(
      {
        roomTypeId: selectedRoomTypeId,
        checkIn: checkIn!,
        checkOut: checkOut!,
      },
      {
        enabled: !!selectedRoomTypeId && !!checkIn && !!checkOut,
      }
    );

  const handleContinue = () => {
    if (!selectedRoomType || !checkIn || !checkOut) return;

    setRoom({
      roomTypeId: selectedRoomType.id,
      roomTypeName: selectedRoomType.name,
      roomTypeSlug: selectedRoomType.slug,
      basePrice: Number(selectedRoomType.basePrice),
      checkIn,
      checkOut,
      guests: parseInt(guests),
    });
  };

  const hasValidDates = checkIn && checkOut && checkOut > checkIn;
  const hasAvailability = availability && availability.totalAvailable > 0;
  const isFormValid = selectedRoomTypeId && hasValidDates && hasAvailability;
  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Select Room & Dates</h2>
        <p className="text-muted-foreground">Choose your preferred room type and travel dates</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Room Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Room Type</CardTitle>
            <CardDescription>Select the type of room you&apos;d like</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedRoomTypeId} onValueChange={setSelectedRoomTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes?.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{room.name}</span>
                      <span className="text-muted-foreground">${Number(room.basePrice)}/night</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRoomType && (
              <div className="bg-muted mt-4 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">{selectedRoomType.shortDescription}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {selectedRoomType.capacity} guests</span>
                  </div>
                  {selectedRoomType.size && <span>{selectedRoomType.size} m²</span>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dates & Guests</CardTitle>
            <CardDescription>When are you planning to stay?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Check-in Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkIn && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkOut && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => !checkIn || date <= checkIn}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="mb-2 block text-sm font-medium">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedRoomType?.capacity ?? 4 }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Availability Status */}
            {selectedRoomTypeId && checkIn && checkOut && (
              <div className="rounded-lg border p-3">
                {isCheckingAvailability ? (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking availability...
                  </div>
                ) : availability && availability.totalAvailable > 0 ? (
                  <div className="text-sm text-green-600">
                    {availability.totalAvailable} room(s) available
                  </div>
                ) : (
                  <div className="text-destructive text-sm">
                    No rooms available for selected dates
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary & Continue */}
      {selectedRoomType && checkIn && checkOut && (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-semibold">{selectedRoomType.name}</p>
              <p className="text-muted-foreground text-sm">
                {format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d, yyyy')} ({nights} nights)
              </p>
              <p className="mt-1 text-lg font-bold">
                ${Number(selectedRoomType.basePrice) * nights}
                <span className="text-muted-foreground text-sm font-normal"> total</span>
              </p>
            </div>
            <Button size="lg" onClick={handleContinue} disabled={!isFormValid}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
