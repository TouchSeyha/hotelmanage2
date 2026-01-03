import { Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, DollarSign, Users, BedDouble, ArrowUpRight, Clock } from 'lucide-react';

import { api } from '~/trpc/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { DashboardSkeleton } from '~/components/shared/loading-skeleton';

async function DashboardContent() {
  const [stats, todaySchedule, recentBookings] = await Promise.all([
    api.admin.getDashboardStats(),
    api.admin.getTodaySchedule(),
    api.booking.getAll({ limit: 5 }),
  ]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats.totalRevenue).toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-muted-foreground text-xs">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BedDouble className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-muted-foreground text-xs">
              {stats.totalRooms - stats.availableRooms} of {stats.totalRooms} rooms occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Activity</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckIns + stats.todayCheckOuts}</div>
            <p className="text-muted-foreground text-xs">
              {stats.todayCheckIns} check-ins, {stats.todayCheckOuts} check-outs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>Check-ins and check-outs for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Check-ins */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  Check-ins ({todaySchedule.checkIns.length})
                </h4>
                {todaySchedule.checkIns.length > 0 ? (
                  <div className="space-y-2">
                    {todaySchedule.checkIns.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{booking.guestName ?? booking.user.name}</p>
                          <p className="text-muted-foreground">
                            Room {booking.room.roomNumber} - {booking.room.roomType.name}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/frontdesk?booking=${booking.id}`}>Check In</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No check-ins today</p>
                )}
              </div>

              {/* Check-outs */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Check-outs ({todaySchedule.checkOuts.length})
                </h4>
                {todaySchedule.checkOuts.length > 0 ? (
                  <div className="space-y-2">
                    {todaySchedule.checkOuts.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{booking.guestName ?? booking.user.name}</p>
                          <p className="text-muted-foreground">Room {booking.room.roomNumber}</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/frontdesk?booking=${booking.id}`}>Check Out</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No check-outs today</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.bookings.length > 0 ? (
                recentBookings.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{booking.user.name ?? 'Guest'}</p>
                      <p className="text-muted-foreground text-xs">
                        {booking.room.roomType.name} •{' '}
                        {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                        {format(new Date(booking.checkOutDate), 'MMM d')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'default'
                            : booking.status === 'cancelled'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {booking.status}
                      </Badge>
                      <span className="text-sm font-medium">${Number(booking.totalPrice)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/admin/pos">New Walk-in Booking</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/room-types/new">Add Room Type</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/rooms">Manage Rooms</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/bookings">View All Bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your hotel operations</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
