'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Filter, MoreHorizontal, Check, X, Eye } from 'lucide-react';

import { api } from '~/trpc/react';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { TableSkeleton } from '~/components/shared/loadingSkeleton';
import { StatusBadge } from '~/components/shared/statusBadge';
import type { BookingStatus } from '~/lib/schemas';

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 500);

  // Memoize query options for stable reference
  const queryOptions = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter !== 'all' ? (statusFilter as BookingStatus) : undefined,
      page,
      limit: 10,
    }),
    [debouncedSearch, statusFilter, page]
  );

  const { data, isLoading, refetch } = api.booking.getAll.useQuery(queryOptions);

  const confirmPayment = api.booking.confirmPayment.useMutation({
    onSuccess: () => void refetch(),
  });

  const cancelBooking = api.booking.cancel.useMutation({
    onSuccess: () => void refetch(),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage all hotel reservations</p>
        </div>
        <Button asChild>
          <Link href="/admin/pos">New Booking</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>{data?.pagination.total ?? 0} total bookings</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  className="w-50 pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-37.5">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.user.name}</p>
                          <p className="text-muted-foreground text-xs">{booking.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{booking.room.roomType.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Room {booking.room.roomNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>
                            {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                            {format(new Date(booking.checkOutDate), 'MMM d')}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {booking.numberOfGuests} guests
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} type="booking" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.paymentStatus} type="payment" />
                      </TableCell>
                      <TableCell className="font-medium">${Number(booking.totalPrice)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {booking.paymentStatus === 'pending' && (
                              <DropdownMenuItem
                                onClick={() => confirmPayment.mutate({ id: booking.id })}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Payment
                              </DropdownMenuItem>
                            )}
                            {['pending', 'confirmed'].includes(booking.status) && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => cancelBooking.mutate({ id: booking.id })}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Page {page} of {data.pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
