'use client';

import { use } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  BookOpen,
  Shield,
  UserCircle,
} from 'lucide-react';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Skeleton } from '~/components/ui/skeleton';

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'confirmed':
      return 'default';
    case 'checked_in':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading } = api.user.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-1" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-lg font-medium">User not found</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xl">
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              {user.name ?? 'Unnamed User'}
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' ? (
                  <Shield className="mr-1 h-3 w-3" />
                ) : (
                  <UserCircle className="mr-1 h-3 w-3" />
                )}
                {user.role}
              </Badge>
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.bookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(user.totalRevenue).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(new Date(user.createdAt), 'MMM yyyy')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Per Booking</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {user._count.bookings > 0
                ? Math.round(Number(user.totalRevenue) / user._count.bookings).toLocaleString()
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{user.phone ?? 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm">Joined</p>
                <p className="font-medium">{format(new Date(user.createdAt), 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Last 10 bookings by this user</CardDescription>
          </CardHeader>
          <CardContent>
            {user.bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-medium hover:underline"
                        >
                          {booking.bookingNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>Room {booking.room.roomNumber}</p>
                          <p className="text-muted-foreground text-xs">
                            {booking.room.roomType.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                        {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(booking.totalPrice).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                This user hasn&apos;t made any bookings yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
