# tRPC API Documentation

## Overview

End-to-end typesafe API built with tRPC v11. All procedures are organized into routers with full TypeScript inference.

**API Handler:** `/api/trpc/[trpc]`

**Key Benefits:**

- Full type safety from server to client
- No API specification needed
- Automatic input validation with Zod
- React Query integration for data fetching
- Error handling with type-safe error codes

---

## Architecture

### tRPC Setup

```
server/
├── trpc.ts           # tRPC instance & context
├── index.ts          # Root router (appRouter)
└── routers/
    ├── auth.ts       # Authentication procedures
    ├── roomType.ts   # Room type procedures
    ├── room.ts       # Room procedures
    ├── booking.ts    # Booking procedures
    ├── user.ts       # User procedures
    └── admin.ts      # Admin dashboard procedures
```

### Client Usage

```typescript
// Import the typed client
import { trpc } from '@/lib/trpc';

// Call procedures with full type safety
const { data, isLoading, error } = trpc.room.getAll.useQuery();
```

---

## Authentication Router

### `auth.signUp`

Create new user account.

**Type:** `mutation`

**Input:**

```typescript
{
  email: string
  password: string
  name: string
  phone?: string
}
```

**Output:**

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  }
}
```

**Usage:**

```typescript
const signup = trpc.auth.signUp.useMutation();

signup.mutate({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  phone: '+855-12-345-678',
});
```

**Validation:**

- Email must be valid format
- Password minimum 8 characters
- Email must be unique

---

## Room Type Router

### `roomType.getAll`

Get all active room types.

**Type:** `query`

**Input:**

```typescript
{
  isActive?: boolean    // default: true
  sortBy?: string       // default: 'basePrice'
  order?: 'asc' | 'desc' // default: 'asc'
}
```

**Output:**

```typescript
Array<{
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  capacity: number;
  size: number | null;
  images: string[];
  amenities: string[];
  isActive: boolean;
  _count: {
    rooms: number;
  };
}>;
```

**Usage:**

```typescript
const { data: roomTypes } = trpc.roomType.getAll.useQuery({
  isActive: true,
  sortBy: 'basePrice',
  order: 'asc',
});
```

---

### `roomType.getBySlug`

Get single room type by slug.

**Type:** `query`

**Input:**

```typescript
{
  slug: string;
}
```

**Output:**

```typescript
{
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  basePrice: number
  capacity: number
  size: number | null
  images: string[]
  amenities: string[]
  isActive: boolean
  rooms: Array<{
    id: string
    roomNumber: string
    status: RoomStatus
  }>
}
```

**Usage:**

```typescript
const { data: roomType } = trpc.roomType.getBySlug.useQuery({
  slug: 'deluxe-room',
});
```

---

### `roomType.create` 🔒 Admin

Create new room type.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  name: string
  slug: string
  description: string
  shortDescription: string
  basePrice: number
  capacity: number
  size?: number
  images?: string[]
  amenities?: string[]
}
```

**Output:**

```typescript
{
  id: string;
  name: string;
  slug: string;
  // ... full room type object
}
```

**Usage:**

```typescript
const createRoomType = trpc.roomType.create.useMutation();

createRoomType.mutate({
  name: 'Premium Suite',
  slug: 'premium-suite',
  description: 'Luxurious suite...',
  shortDescription: 'Ultimate luxury',
  basePrice: 200,
  capacity: 4,
  size: 60,
});
```

---

### `roomType.update` 🔒 Admin

Update room type.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string
  data: {
    name?: string
    basePrice?: number
    isActive?: boolean
    // ... other optional fields
  }
}
```

**Usage:**

```typescript
const updateRoomType = trpc.roomType.update.useMutation();

updateRoomType.mutate({
  id: 'cl...',
  data: {
    basePrice: 85,
    isActive: true,
  },
});
```

---

### `roomType.delete` 🔒 Admin

Delete room type (only if no rooms exist).

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string;
}
```

**Usage:**

```typescript
const deleteRoomType = trpc.roomType.delete.useMutation();

deleteRoomType.mutate({ id: 'cl...' });
```

---

## Room Router

### `room.getAll`

Get all rooms.

**Type:** `query`

**Input:**

```typescript
{
  status?: RoomStatus
  roomTypeId?: string
  available?: boolean
}
```

**Output:**

```typescript
Array<{
  id: string;
  roomNumber: string;
  floor: number | null;
  status: RoomStatus;
  roomType: {
    id: string;
    name: string;
    basePrice: number;
  };
}>;
```

**Usage:**

```typescript
const { data: rooms } = trpc.room.getAll.useQuery({
  status: 'available',
});
```

---

### `room.checkAvailability`

Check room availability for date range.

**Type:** `query`

**Input:**

```typescript
{
  checkIn: Date
  checkOut: Date
  roomTypeId?: string
}
```

**Output:**

```typescript
{
  availableRooms: Array<{
    id: string;
    roomNumber: string;
    roomType: {
      name: string;
      basePrice: number;
    };
  }>;
  totalAvailable: number;
}
```

**Usage:**

```typescript
const { data } = trpc.room.checkAvailability.useQuery({
  checkIn: new Date('2025-01-15'),
  checkOut: new Date('2025-01-17'),
  roomTypeId: 'cl...',
});
```

---

### `room.create` 🔒 Admin

Create new room.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  roomNumber: string
  roomTypeId: string
  floor?: number
  status?: RoomStatus
  notes?: string
}
```

**Usage:**

```typescript
const createRoom = trpc.room.create.useMutation();

createRoom.mutate({
  roomNumber: '301',
  roomTypeId: 'cl...',
  floor: 3,
  status: 'available',
});
```

---

### `room.update` 🔒 Admin

Update room details or status.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string
  data: {
    status?: RoomStatus
    floor?: number
    notes?: string
  }
}
```

---

### `room.delete` 🔒 Admin

Delete room (only if no active bookings).

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string;
}
```

---

## Booking Router

### `booking.getAll`

Get bookings (filtered by user role).

**Type:** `query` (protected)

**Behavior:**

- **User:** Returns only own bookings
- **Admin:** Returns all bookings

**Input:**

```typescript
{
  status?: BookingStatus
  paymentStatus?: PaymentStatus
  checkInDate?: Date
  page?: number      // default: 1
  limit?: number     // default: 10
}
```

**Output:**

```typescript
{
  bookings: Array<{
    id: string;
    bookingNumber: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    totalPrice: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
    room: {
      roomNumber: string;
      roomType: {
        name: string;
      };
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

**Usage:**

```typescript
const { data } = trpc.booking.getAll.useQuery({
  status: 'confirmed',
  page: 1,
  limit: 10,
});
```

---

### `booking.getById`

Get single booking details.

**Type:** `query` (protected)

**Input:**

```typescript
{
  id: string;
}
```

**Output:**

```typescript
{
  id: string;
  bookingNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialRequests: string | null;
  createdAt: Date;
  user: {
    /* user details */
  }
  room: {
    /* room details */
  }
  logs: Array<{
    action: string;
    performedBy: {
      name: string;
    };
    createdAt: Date;
  }>;
}
```

**Usage:**

```typescript
const { data: booking } = trpc.booking.getById.useQuery({
  id: 'cl...',
});
```

---

### `booking.create`

Create new booking.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  paymentMethod: 'online' | 'counter'
  specialRequests?: string
}
```

**Output:**

```typescript
{
  id: string;
  bookingNumber: string;
  status: 'pending';
  paymentStatus: 'pending';
  totalPrice: number;
}
```

**Usage:**

```typescript
const createBooking = trpc.booking.create.useMutation();

createBooking.mutate({
  roomId: 'cl...',
  checkInDate: new Date('2025-01-15'),
  checkOutDate: new Date('2025-01-17'),
  numberOfGuests: 2,
  paymentMethod: 'online',
  specialRequests: 'Late check-in please',
});
```

**Validation:**

- Room must be available
- Check-in date must be in future
- Check-out date must be after check-in
- Number of guests must not exceed room capacity

---

### `booking.update` 🔒 Admin/Owner

Update booking status.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string
  status?: BookingStatus
  paymentStatus?: PaymentStatus
  notes?: string
}
```

**Side effects:**

- Creates booking log automatically

---

### `booking.checkIn` 🔒 Admin

Check in guest.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string;
}
```

**Output:**

```typescript
{
  status: 'checked_in';
  checkedInAt: Date;
}
```

**Side effects:**

- Updates booking status to `checked_in`
- Updates room status to `occupied`
- Creates booking log entry

**Usage:**

```typescript
const checkIn = trpc.booking.checkIn.useMutation();

checkIn.mutate({ id: 'cl...' });
```

---

### `booking.checkOut` 🔒 Admin

Check out guest.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string;
}
```

**Output:**

```typescript
{
  status: 'completed';
  checkedOutAt: Date;
}
```

**Side effects:**

- Updates booking status to `completed`
- Updates room status to `available`
- Creates booking log entry

---

### `booking.cancel`

Cancel booking.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string
  cancellationReason?: string
}
```

**Business rules:**

- Can only cancel if status is `pending` or `confirmed`
- Cannot cancel after check-in

---

## Admin Router

### `admin.getDashboardStats` 🔒 Admin

Get dashboard statistics.

**Type:** `query` (protected)

**Output:**

```typescript
{
  todayCheckIns: number
  todayCheckOuts: number
  pendingBookings: number
  occupancyRate: number
  totalRevenue: number
  recentBookings: Booking[]
}
```

**Usage:**

```typescript
const { data: stats } = trpc.admin.getDashboardStats.useQuery();
```

---

### `admin.getRevenue` 🔒 Admin

Get revenue data for chart.

**Type:** `query` (protected)

**Input:**

```typescript
{
  period: 'day' | 'week' | 'month' | 'year'
  startDate?: Date
  endDate?: Date
}
```

**Output:**

```typescript
Array<{
  date: string;
  revenue: number;
  bookings: number;
}>;
```

---

## User Router

### `user.getAll` 🔒 Admin

Get all users.

**Type:** `query` (protected)

**Input:**

```typescript
{
  role?: 'user' | 'admin'
  page?: number
  limit?: number
}
```

**Output:**

```typescript
{
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
    _count: {
      bookings: number;
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

---

### `user.getById` 🔒 Admin/Owner

Get user details.

**Type:** `query` (protected)

**Input:**

```typescript
{
  id: string;
}
```

---

### `user.update` 🔒 Admin/Owner

Update user profile.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string
  data: {
    name?: string
    phone?: string
    email?: string
  }
}
```

---

### `user.delete` 🔒 Admin

Delete user account.

**Type:** `mutation` (protected)

**Input:**

```typescript
{
  id: string;
}
```

**Note:** Cannot delete user with active bookings.

---

## Error Handling

tRPC uses standardized error codes:

```typescript
import { TRPCError } from '@trpc/server';

throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Room not available for selected dates',
  cause: { roomId, conflictingBooking },
});
```

### Common Error Codes

- `BAD_REQUEST` - Invalid input (validation error)
- `UNAUTHORIZED` - Not logged in
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., room already booked)
- `INTERNAL_SERVER_ERROR` - Server error

### Client-side Error Handling

```typescript
const mutation = trpc.booking.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'CONFLICT') {
      toast.error('Room not available for selected dates');
    }
  },
  onSuccess: (data) => {
    toast.success(`Booking created: ${data.bookingNumber}`);
  },
});
```

---

## Middleware & Context

### Protected Procedures

```typescript
// server/trpc.ts
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({ ctx });
});
```

### Context

```typescript
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
// Available in all procedures
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getServerSession(authOptions);

  return {
    session,
    prisma,
    headers: opts.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

---

## Client Setup

### Provider Setup

```typescript
// app/layout.tsx
import { TRPCProvider } from '@/lib/trpc-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

### tRPC Client

```typescript
// lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server';

export const trpc = createTRPCReact<AppRouter>();
```

### Provider Component

```typescript
// lib/trpc-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './trpc';
import superjson from 'superjson';

export function TRPCProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Usage Examples

### Query with Loading State

```typescript
function RoomsList() {
  const { data, isLoading, error } = trpc.roomType.getAll.useQuery();

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return <RoomGrid rooms={data} />;
}
```

### Mutation with Optimistic Update

```typescript
function BookingForm() {
  const utils = trpc.useContext();

  const createBooking = trpc.booking.create.useMutation({
    onMutate: async (newBooking) => {
      await utils.booking.getAll.cancel();
      const previousBookings = utils.booking.getAll.getData();

      utils.booking.getAll.setData(undefined, (old) => [
        ...(old || []),
        newBooking as any
      ]);

      return { previousBookings };
    },
    onError: (err, newBooking, context) => {
      utils.booking.getAll.setData(undefined, context?.previousBookings);
    },
    onSettled: () => {
      utils.booking.getAll.invalidate();
    }
  });

  return <form onSubmit={handleSubmit} />;
}
```

### Infinite Query

```typescript
function BookingsTable() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = trpc.booking.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) =>
        lastPage.pagination.page < lastPage.pagination.totalPages
          ? lastPage.pagination.page + 1
          : undefined
    }
  );

  return (
    <>
      {data?.pages.map((page) =>
        page.bookings.map((booking) => <BookingRow key={booking.id} {...booking} />)
      )}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </Button>
      )}
    </>
  );
}
```

---

## Notes

- All dates are automatically serialized/deserialized using SuperJSON
- tRPC procedures use Zod for input validation
- Error messages are type-safe and include error codes
- React Query handles caching, refetching, and background updates
- Mutations automatically invalidate related queries
- All procedures have full TypeScript inference from server to client
- No need to manually type API responses or requests
