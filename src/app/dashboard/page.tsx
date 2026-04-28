import { Suspense, cache } from 'react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import {
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Users,
  BedDouble,
  CalendarDays,
  User,
} from 'lucide-react';

import { api } from '~/trpc/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { DashboardSkeleton } from '~/components/shared/loadingSkeleton';
import { EmptyState } from '~/components/shared/emptyState';
import { Breadcrumb } from '~/components/shared/breadcrumb';
import { StatusBadge } from '~/components/shared/statusBadge';
import { Reveal } from '~/components/motion/reveal';

const cachedGetDashboardStats = cache(() => api.user.getDashboardStats());
const cachedGetNextBooking = cache(() => api.user.getNextBooking());
const cachedGetProfile = cache(() => api.user.getProfile());

async function DashboardContent() {
  const [stats, nextBooking, profile] = await Promise.all([
    cachedGetDashboardStats(),
    cachedGetNextBooking(),
    cachedGetProfile(),
  ]);

  const totalBookings = stats.upcomingBookings + stats.completedBookings + stats.cancelledBookings;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="motion-stagger grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="motion-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-muted-foreground text-xs">
              {stats.completedBookings} completed, {stats.cancelledBookings} cancelled
            </p>
          </CardContent>
        </Card>

        <Card className="motion-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <CalendarDays className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-muted-foreground text-xs">Confirmed and checked-in</p>
          </CardContent>
        </Card>

        <Card className="motion-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats.totalSpent).toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Lifetime spending</p>
          </CardContent>
        </Card>

        <Card className="motion-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(profile.createdAt), 'MMMM yyyy')}
            </div>
            <p className="text-muted-foreground text-xs">
              {differenceInDays(new Date(), new Date(profile.createdAt))} days as member
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next Trip */}
        <Card className="motion-card-hover">
          <CardHeader>
            <CardTitle>Next Trip</CardTitle>
            <CardDescription>Your upcoming reservation</CardDescription>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{nextBooking.room.roomType.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      Booking #{nextBooking.bookingNumber}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      nextBooking.status as
                        | 'pending'
                        | 'confirmed'
                        | 'checked_in'
                        | 'completed'
                        | 'cancelled'
                    }
                    type="booking"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(nextBooking.checkInDate), 'MMM d')} -{' '}
                        {format(new Date(nextBooking.checkOutDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {Math.ceil(
                          (new Date(nextBooking.checkOutDate).getTime() -
                            new Date(nextBooking.checkInDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        nights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span>Room {nextBooking.room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span>{nextBooking.numberOfGuests} guest(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BedDouble className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">${Number(nextBooking.totalPrice)} total</span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href="/dashboard/bookings">View Details</Link>
                </Button>
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming trips"
                description="You don't have any upcoming reservations booked."
                action={
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href="/dashboard/book">Book Now</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/rooms">Browse Rooms</Link>
                    </Button>
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="motion-card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard/book">
                  <BedDouble className="mr-2 h-4 w-4" />
                  Book a Room
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/dashboard/bookings">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View All Bookings
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Reveal>
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
      </Reveal>

      <Reveal delay={1} className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your reservations</p>
      </Reveal>

      <Reveal delay={2} variant="panel">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </Reveal>
    </div>
  );
}
