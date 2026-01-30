# LuxeStay - Hotel Management & Booking Platform

A full-stack hotel management and booking platform built with the T3 Stack. Designed for single hotel operations with a customer-facing booking website and comprehensive admin dashboard.

## Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| **Framework**      | Next.js 15, React 19, TypeScript        |
| **Styling**        | Tailwind CSS v4, shadcn/ui              |
| **Database**       | PostgreSQL + Prisma ORM                 |
| **API**            | tRPC v11 (end-to-end type safety)       |
| **State**          | TanStack React Query v5                 |
| **Auth**           | NextAuth.js v5 (Discord, Google OAuth)  |
| **Email**          | Resend + React Email                    |
| **File Upload**    | Vercel Blob                             |
| **Package Manager**| Bun                                     |

## Features

### Public Website

- **Room Browsing** - View available room types with filters (price, capacity, amenities)
- **Room Details** - Image gallery with lightbox, amenities, and booking button
- **Contact Form** - Email submission with auto-reply

### User Dashboard

- **Booking Flow** - 3-step multi-form (room selection, guest info, payment method)
- **My Bookings** - View, filter, and cancel bookings
- **Reviews** - Submit reviews for completed stays
- **Profile Settings** - Update personal information

### Admin Dashboard

- **Overview** - Today's check-ins/outs, occupancy rate, revenue charts
- **Booking Management** - Search, filter, confirm payments, check-in/out
- **Front Desk** - Dedicated check-in/check-out interface with audit logging
- **POS System** - Create walk-in bookings with QR payment
- **Room Types** - CRUD with image uploads and amenity assignment
- **Room Inventory** - Manage individual rooms and status changes
- **Amenities** - CRUD with icon picker
- **Reviews** - Moderation queue (approve/reject with reasons)
- **User Management** - View users, promote to admin, view booking history

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [PostgreSQL](https://www.postgresql.org/) database
- OAuth credentials (Discord and/or Google)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hotelmanage2

# Install dependencies
bun install

# Copy environment file
cp .env.example .env
```

### Environment Setup

Configure your `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hotelmanage2

# NextAuth
AUTH_SECRET=           # Run: npx auth secret
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Email (Resend)
RESEND_API_KEY=
RESEND_DEV_EMAIL=      # Recipient for dev emails

# File Upload (Vercel Blob) - Optional for local dev
BLOB_READ_WRITE_TOKEN=
```

### Database Setup

```bash
# Generate Prisma client and run migrations
bun db:generate

# Or push schema directly (development)
bun db:push

# Seed initial data (optional)
bun db:seed

# Open database GUI
bun db:studio
```

### Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── (admin)/admin/      # Admin dashboard pages
│   ├── (public)/           # Public pages (home, rooms, contact)
│   ├── (auth)/             # Auth pages (signin, error)
│   ├── dashboard/          # User dashboard pages
│   └── api/                # API routes (auth, trpc, upload)
│
├── server/                 # Backend code
│   ├── api/routers/        # tRPC routers (booking, room, review, etc.)
│   ├── auth/               # NextAuth configuration
│   ├── email/templates/    # React Email templates
│   └── db.ts               # Prisma client
│
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── shared/             # Reusable components
│
├── lib/
│   ├── schemas/            # Zod validation schemas
│   └── utils.ts            # Utility functions
│
└── trpc/                   # tRPC client configuration
```

## Development Commands

```bash
# Development
bun dev              # Start dev server with Turbopack
bun build            # Production build
bun start            # Start production server
bun preview          # Build + run production locally

# Code Quality (run before commits)
bun check            # Lint + typecheck
bun lint             # ESLint only
bun lint:fix         # Auto-fix lint issues
bun typecheck        # TypeScript only
bun format:write     # Format with Prettier

# Database
bun db:generate      # Generate Prisma client + migration
bun db:migrate       # Deploy migrations to production
bun db:push          # Push schema changes (no migration)
bun db:studio        # Open Prisma Studio
bun db:seed          # Seed database
```

## Database Schema

### Core Models

- **RoomType** - Room categories (Deluxe, Suite, etc.) with pricing and amenities
- **Room** - Individual room instances with status tracking
- **Booking** - Reservations with guest info, dates, payment status
- **BookingLog** - Audit trail for booking changes
- **Review** - Guest reviews with moderation workflow
- **Amenity** - Hotel amenities (WiFi, Pool, etc.)
- **User** - Guests and admin staff with role-based access

### Booking Status Flow

```text
pending → confirmed → checked_in → checked_out → completed
                   ↘ cancelled
```

### Payment Status

```text
pending → paid → refunded
```

## API Overview

All APIs use tRPC with full type safety:

| Router     | Key Procedures                                        |
| ---------- | ----------------------------------------------------- |
| `booking`  | create, getAll, checkIn, checkOut, cancel, posBooking |
| `room`     | getAll, create, update, changeStatus                  |
| `roomType` | getAll, getBySlug, create, update, delete             |
| `amenity`  | getAll, create, update, delete                        |
| `review`   | create, approve, reject, getApproved                  |
| `admin`    | getDashboardStats                                     |
| `user`     | getProfile, updateProfile                             |

### Access Levels

- `publicProcedure` - No authentication required
- `protectedProcedure` - Requires logged-in user
- `adminProcedure` - Requires admin role

## Authentication

OAuth providers configured:

- **Discord** - Primary auth method
- **Google** - Alternative auth method

User roles:

- `user` - Guest/customer access
- `admin` - Full dashboard access

## Email Templates

Automated emails via Resend:

- Booking confirmation (guest)
- New booking alert (admin)
- Payment confirmation
- Check-in reminder
- Contact form auto-reply
- Welcome email

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

Build settings are pre-configured in `vercel.json`.

### Manual Deployment

```bash
bun build
bun start
```

## Git Workflow

- **main** - Production branch
- **dev** - Development branch (default)

Before committing:

```bash
bun check
bun format:write
```

## Documentation

Additional documentation in `/docs/`:

- `PROJECT_OVERVIEW.md` - Goals and architecture
- `FEATURES.md` - Detailed feature specifications
- `DATABASE_SCHEMA.md` - ERD and table definitions
- `API_ROUTES.md` - Complete API documentation

## License

Private project - All rights reserved
