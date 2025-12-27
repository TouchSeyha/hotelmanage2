# Database Schema Design

## Overview

PostgreSQL database hosted on NeonDB with 5 core tables optimized for single hotel operations.

## Entity Relationship Diagram (ERD)

```
users (1) ----< (M) bookings
room_types (1) ----< (M) rooms
rooms (1) ----< (M) bookings
bookings (1) ----< (M) booking_logs
```

## Tables

### 1. users

Stores guest and admin user information.

| Column        | Type          | Constraints             | Description                  |
| ------------- | ------------- | ----------------------- | ---------------------------- |
| id            | String (cuid) | PRIMARY KEY             | Unique user identifier       |
| email         | String        | UNIQUE, NOT NULL        | User email (for login)       |
| password      | String        | NOT NULL                | Hashed password              |
| name          | String        | NOT NULL                | Full name                    |
| phone         | String        | NULLABLE                | Contact number               |
| role          | Enum          | NOT NULL, DEFAULT: user | user or admin                |
| emailVerified | DateTime      | NULLABLE                | Email verification timestamp |
| image         | String        | NULLABLE                | Profile image URL            |
| createdAt     | DateTime      | DEFAULT: now()          | Account creation date        |
| updatedAt     | DateTime      | AUTO UPDATE             | Last update timestamp        |

**Indexes:**

- `email` (unique)
- `role`

---

### 2. room_types

Defines types/categories of rooms (e.g., Standard, Deluxe, Suite).

| Column           | Type          | Constraints      | Description                 |
| ---------------- | ------------- | ---------------- | --------------------------- |
| id               | String (cuid) | PRIMARY KEY      | Unique room type identifier |
| name             | String        | UNIQUE, NOT NULL | Room type name              |
| slug             | String        | UNIQUE, NOT NULL | URL-friendly name           |
| description      | String        | NOT NULL         | Detailed description        |
| shortDescription | String        | NOT NULL         | Brief summary               |
| basePrice        | Decimal       | NOT NULL         | Base price per night        |
| capacity         | Int           | NOT NULL         | Max number of guests        |
| size             | Int           | NULLABLE         | Room size in sq meters      |
| images           | Json          | DEFAULT: []      | Array of image URLs         |
| amenities        | Json          | DEFAULT: []      | Array of amenities          |
| isActive         | Boolean       | DEFAULT: true    | Availability for booking    |
| createdAt        | DateTime      | DEFAULT: now()   | Creation date               |
| updatedAt        | DateTime      | AUTO UPDATE      | Last update timestamp       |

**Indexes:**

- `slug` (unique)
- `isActive`

**Example amenities JSON:**

```json
["WiFi", "Air Conditioning", "Mini Bar", "TV", "Room Service"]
```

---

### 3. rooms

Individual room inventory linked to room types.

| Column     | Type          | Constraints                  | Description                                      |
| ---------- | ------------- | ---------------------------- | ------------------------------------------------ |
| id         | String (cuid) | PRIMARY KEY                  | Unique room identifier                           |
| roomNumber | String        | UNIQUE, NOT NULL             | Room number (e.g., "101")                        |
| roomTypeId | String        | FOREIGN KEY, NOT NULL        | References room_types.id                         |
| floor      | Int           | NULLABLE                     | Floor number                                     |
| status     | Enum          | NOT NULL, DEFAULT: available | available, occupied, maintenance, out_of_service |
| notes      | String        | NULLABLE                     | Internal notes                                   |
| createdAt  | DateTime      | DEFAULT: now()               | Creation date                                    |
| updatedAt  | DateTime      | AUTO UPDATE                  | Last update timestamp                            |

**Relations:**

- `roomType` → room_types (M:1)

**Indexes:**

- `roomNumber` (unique)
- `roomTypeId`
- `status`

---

### 4. bookings

Guest reservations and booking records.

| Column             | Type          | Constraints                | Description                                          |
| ------------------ | ------------- | -------------------------- | ---------------------------------------------------- |
| id                 | String (cuid) | PRIMARY KEY                | Unique booking identifier                            |
| bookingNumber      | String        | UNIQUE, NOT NULL           | Human-readable booking ID                            |
| userId             | String        | FOREIGN KEY, NOT NULL      | References users.id                                  |
| roomId             | String        | FOREIGN KEY, NOT NULL      | References rooms.id                                  |
| checkInDate        | DateTime      | NOT NULL                   | Check-in date                                        |
| checkOutDate       | DateTime      | NOT NULL                   | Check-out date                                       |
| numberOfGuests     | Int           | NOT NULL                   | Total guests                                         |
| totalPrice         | Decimal       | NOT NULL                   | Total booking cost                                   |
| status             | Enum          | NOT NULL, DEFAULT: pending | pending, confirmed, checked_in, completed, cancelled |
| paymentMethod      | Enum          | NOT NULL                   | online, counter                                      |
| paymentStatus      | Enum          | NOT NULL, DEFAULT: pending | pending, paid, refunded                              |
| specialRequests    | String        | NULLABLE                   | Guest special requests                               |
| cancellationReason | String        | NULLABLE                   | Reason for cancellation                              |
| createdAt          | DateTime      | DEFAULT: now()             | Booking creation date                                |
| updatedAt          | DateTime      | AUTO UPDATE                | Last update timestamp                                |
| checkedInAt        | DateTime      | NULLABLE                   | Actual check-in time                                 |
| checkedOutAt       | DateTime      | NULLABLE                   | Actual check-out time                                |

**Relations:**

- `user` → users (M:1)
- `room` → rooms (M:1)
- `logs` → booking_logs (1:M)

**Indexes:**

- `bookingNumber` (unique)
- `userId`
- `roomId`
- `status`
- `paymentStatus`
- `checkInDate, checkOutDate` (composite)

---

### 5. booking_logs

Audit trail for booking status changes.

| Column         | Type          | Constraints           | Description            |
| -------------- | ------------- | --------------------- | ---------------------- |
| id             | String (cuid) | PRIMARY KEY           | Unique log identifier  |
| bookingId      | String        | FOREIGN KEY, NOT NULL | References bookings.id |
| action         | String        | NOT NULL              | Action performed       |
| performedBy    | String        | FOREIGN KEY, NOT NULL | References users.id    |
| previousStatus | String        | NULLABLE              | Status before change   |
| newStatus      | String        | NULLABLE              | Status after change    |
| notes          | String        | NULLABLE              | Additional notes       |
| createdAt      | DateTime      | DEFAULT: now()        | Log timestamp          |

**Relations:**

- `booking` → bookings (M:1)
- `user` → users (M:1)

**Indexes:**

- `bookingId`
- `createdAt`

---

## Enums

### Role

```typescript
enum Role {
  user
  admin
}
```

### RoomStatus

```typescript
enum RoomStatus {
  available
  occupied
  maintenance
  out_of_service
}
```

### BookingStatus

```typescript
enum BookingStatus {
  pending       // Awaiting confirmation
  confirmed     // Payment confirmed
  checked_in    // Guest checked in
  completed     // Guest checked out
  cancelled     // Booking cancelled
}
```

### PaymentMethod

```typescript
enum PaymentMethod {
  online   // QR code payment
  counter  // Pay at reception
}
```

### PaymentStatus

```typescript
enum PaymentStatus {
  pending   // Awaiting payment
  paid      // Payment received
  refunded  // Payment refunded
}
```

---

## Prisma Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum Role {
  user
  admin
}

enum RoomStatus {
  available
  occupied
  maintenance
  out_of_service
}

enum BookingStatus {
  pending
  confirmed
  checked_in
  completed
  cancelled
}

enum PaymentMethod {
  online
  counter
}

enum PaymentStatus {
  pending
  paid
  refunded
}

// Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  phone         String?
  role          Role      @default(user)
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  bookings      Booking[]
  bookingLogs   BookingLog[]

  @@index([email])
  @@index([role])
  @@map("users")
}

model RoomType {
  id               String   @id @default(cuid())
  name             String   @unique
  slug             String   @unique
  description      String
  shortDescription String
  basePrice        Decimal  @db.Decimal(10, 2)
  capacity         Int
  size             Int?
  images           Json     @default("[]")
  amenities        Json     @default("[]")
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  rooms            Room[]

  @@index([slug])
  @@index([isActive])
  @@map("room_types")
}

model Room {
  id         String     @id @default(cuid())
  roomNumber String     @unique
  roomTypeId String
  floor      Int?
  status     RoomStatus @default(available)
  notes      String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  // Relations
  roomType   RoomType   @relation(fields: [roomTypeId], references: [id], onDelete: Cascade)
  bookings   Booking[]

  @@index([roomNumber])
  @@index([roomTypeId])
  @@index([status])
  @@map("rooms")
}

model Booking {
  id                 String        @id @default(cuid())
  bookingNumber      String        @unique
  userId             String
  roomId             String
  checkInDate        DateTime
  checkOutDate       DateTime
  numberOfGuests     Int
  totalPrice         Decimal       @db.Decimal(10, 2)
  status             BookingStatus @default(pending)
  paymentMethod      PaymentMethod
  paymentStatus      PaymentStatus @default(pending)
  specialRequests    String?
  cancellationReason String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  checkedInAt        DateTime?
  checkedOutAt       DateTime?

  // Relations
  user               User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  room               Room          @relation(fields: [roomId], references: [id], onDelete: Restrict)
  logs               BookingLog[]

  @@index([bookingNumber])
  @@index([userId])
  @@index([roomId])
  @@index([status])
  @@index([paymentStatus])
  @@index([checkInDate, checkOutDate])
  @@map("bookings")
}

model BookingLog {
  id             String   @id @default(cuid())
  bookingId      String
  action         String
  performedBy    String
  previousStatus String?
  newStatus      String?
  notes          String?
  createdAt      DateTime @default(now())

  // Relations
  booking        Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [performedBy], references: [id], onDelete: Restrict)

  @@index([bookingId])
  @@index([createdAt])
  @@map("booking_logs")
}
```

---

## tRPC Context Integration

The Prisma client is made available through tRPC context for use in all procedures:

```typescript
// server/trpc.ts
import { prisma } from '@/lib/db';

export async function createContext() {
    const session = await getServerSession(authOptions);

    return {
        session,
        prisma, // Prisma client available in all procedures
    };
}
```

### Usage in tRPC Procedures

```typescript
// server/routers/room.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const roomRouter = router({
    getAll: publicProcedure
        .input(
            z.object({
                status: z
                    .enum(['available', 'occupied', 'maintenance', 'out_of_service'])
                    .optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            // ctx.prisma is available here
            return await ctx.prisma.room.findMany({
                where: input.status ? { status: input.status } : undefined,
                include: { roomType: true },
            });
        }),
});
```

---

## Sample Queries

### Check room availability

```typescript
const availableRooms = await prisma.room.findMany({
    where: {
        status: 'available',
        bookings: {
            none: {
                AND: [
                    { checkInDate: { lt: checkOutDate } },
                    { checkOutDate: { gt: checkInDate } },
                    { status: { notIn: ['cancelled', 'completed'] } },
                ],
            },
        },
    },
    include: {
        roomType: true,
    },
});
```

### Get bookings for a date range

```typescript
const bookings = await prisma.booking.findMany({
    where: {
        OR: [
            {
                checkInDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            {
                checkOutDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        ],
        status: { notIn: ['cancelled'] },
    },
    include: {
        user: true,
        room: {
            include: {
                roomType: true,
            },
        },
    },
});
```

### Get today's check-ins

```typescript
const todayCheckIns = await prisma.booking.findMany({
    where: {
        checkInDate: {
            gte: startOfDay(new Date()),
            lt: endOfDay(new Date()),
        },
        status: 'confirmed',
    },
    include: {
        user: true,
        room: true,
    },
});
```

---

## Seed Data

### Admin User

```typescript
{
  email: "admin@hotel.com",
  password: "hashed_password",
  name: "Hotel Admin",
  role: "admin"
}
```

### Sample Room Types

```typescript
[
    {
        name: 'Standard Room',
        basePrice: 50.0,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
    },
    {
        name: 'Deluxe Room',
        basePrice: 80.0,
        capacity: 3,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
    },
    {
        name: 'Suite',
        basePrice: 150.0,
        capacity: 4,
        amenities: [
            'WiFi',
            'TV',
            'Air Conditioning',
            'Mini Bar',
            'Balcony',
            'Kitchen',
            'Living Room',
        ],
    },
];
```

---

## Migration Commands

```bash
# Create migration
pnpm prisma migrate dev --name init

# Generate Prisma Client
pnpm prisma generate

# Reset database (dev only)
pnpm prisma migrate reset

# View database in Prisma Studio
pnpm prisma studio
```

---

## Notes

- All IDs use `cuid()` for better security and randomness
- Prices use `Decimal` type for precision
- Soft deletes not implemented (use status instead)
- Booking logs provide audit trail
- Cascade deletes configured for data integrity
