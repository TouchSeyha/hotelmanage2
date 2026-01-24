'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Search, ArrowUpRight, Clock, CheckCircle, Loader2, Eye, User, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { TableSkeleton } from '~/components/shared/loadingSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function FrontDeskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdParam = searchParams.get('booking');

  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(bookingIdParam);
  const [actionType, setActionType] = useState<'checkin' | 'checkout' | null>(null);

  const { data: todaySchedule, isLoading, refetch } = api.admin.getTodaySchedule.useQuery();

  const { data: bookingDetails, isLoading: detailsLoading } = api.booking.getById.useQuery(
    { id: selectedBooking! },
    { enabled: !!selectedBooking }
  );

  const checkIn = api.booking.checkIn.useMutation({
    onSuccess: () => {
      toast.success('Guest checked in successfully!');
      setSelectedBooking(null);
      setActionType(null);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkOut = api.booking.checkOut.useMutation({
    onSuccess: () => {
      toast.success('Guest checked out successfully!');
      setSelectedBooking(null);
      setActionType(null);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAction = () => {
    if (!selectedBooking) return;

    if (actionType === 'checkin') {
      checkIn.mutate({ id: selectedBooking });
    } else if (actionType === 'checkout') {
      checkOut.mutate({ id: selectedBooking });
    }
  };

  const filteredCheckIns = useMemo(
    () =>
      todaySchedule?.checkIns.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
          (b.guestName ?? b.user.name)?.toLowerCase().includes(search.toLowerCase())
      ),
    [todaySchedule, search]
  );

  const filteredCheckOuts = useMemo(
    () =>
      todaySchedule?.checkOuts.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
          (b.guestName ?? b.user.name)?.toLowerCase().includes(search.toLowerCase())
      ),
    [todaySchedule, search]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Front Desk</h1>
        <p className="text-muted-foreground">Manage check-ins and check-outs</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search by booking number or guest name..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Today's Summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins Today</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule?.checkIns.length ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              {todaySchedule?.checkIns.filter((b) => b.status === 'checked_in').length ?? 0}{' '}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-outs Today</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule?.checkOuts.length ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              {todaySchedule?.checkOuts.filter((b) => b.status === 'completed').length ?? 0}{' '}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(todaySchedule?.checkIns.filter((b) => b.status === 'confirmed').length ?? 0) +
                (todaySchedule?.checkOuts.filter((b) => b.status === 'checked_in').length ?? 0)}
            </div>
            <p className="text-muted-foreground text-xs">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="checkins">
        <TabsList>
          <TabsTrigger value="checkins">
            Check-ins ({todaySchedule?.checkIns.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="checkouts">
            Check-outs ({todaySchedule?.checkOuts.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkins" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Check-ins</CardTitle>
              <CardDescription>Guests arriving today</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton rows={3} columns={5} />
              ) : filteredCheckIns && filteredCheckIns.length > 0 ? (
                <div className="space-y-3">
                  {filteredCheckIns.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {booking.guestName ?? booking.user.name}
                          </span>
                          <Badge variant="outline">{booking.bookingNumber}</Badge>
                          <Badge
                            variant={booking.status === 'checked_in' ? 'default' : 'secondary'}
                          >
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Room {booking.room.roomNumber} - {booking.room.roomType.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                          {format(new Date(booking.checkOutDate), 'MMM d')} •{' '}
                          {booking.numberOfGuests} guest(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' && (
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking.id);
                              setActionType('checkin');
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Check In
                          </Button>
                        )}
                        {booking.status === 'checked_in' && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Checked In
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/users/${booking.userId}`)}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Guest Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  No check-ins scheduled for today
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkouts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Check-outs</CardTitle>
              <CardDescription>Guests departing today</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton rows={3} columns={5} />
              ) : filteredCheckOuts && filteredCheckOuts.length > 0 ? (
                <div className="space-y-3">
                  {filteredCheckOuts.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {booking.guestName ?? booking.user.name}
                          </span>
                          <Badge variant="outline">{booking.bookingNumber}</Badge>
                          <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'}>
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Room {booking.room.roomNumber} - {booking.room.roomType.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Total: ${Number(booking.totalPrice)} • Payment: {booking.paymentStatus}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'checked_in' && (
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking.id);
                              setActionType('checkout');
                            }}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Check Out
                          </Button>
                        )}
                        {booking.status === 'completed' && (
                          <Badge variant="secondary">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/users/${booking.userId}`)}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Guest Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  No check-outs scheduled for today
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!actionType && !!selectedBooking}
        onOpenChange={() => {
          setActionType(null);
          setSelectedBooking(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'checkin' ? 'Confirm Check-in' : 'Confirm Check-out'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'checkin'
                ? 'This will mark the guest as checked in and update room status.'
                : 'This will complete the booking and free up the room.'}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : bookingDetails ? (
            <div className="space-y-2 rounded-lg border p-4">
              <p>
                <strong>Guest:</strong> {bookingDetails.guestName ?? bookingDetails.user.name}
              </p>
              <p>
                <strong>Room:</strong> {bookingDetails.room.roomNumber} -{' '}
                {bookingDetails.room.roomType.name}
              </p>
              <p>
                <strong>Booking:</strong> {bookingDetails.bookingNumber}
              </p>
              <p>
                <strong>Total:</strong> ${Number(bookingDetails.totalPrice)}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setSelectedBooking(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={checkIn.isPending || checkOut.isPending}>
              {checkIn.isPending || checkOut.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : actionType === 'checkin' ? (
                'Check In Guest'
              ) : (
                'Check Out Guest'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
