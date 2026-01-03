# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Hotel Management & Booking Platform** built with the T3 Stack (Next.js 15 + React 19 + TypeScript + tRPC + Prisma + NextAuth.js). It's designed as an MVP for single hotel operations with a customer-facing booking website and admin dashboard featuring manual payment verification.

**Current Status:** Early development phase. Core infrastructure (auth, database, email, file upload) is configured. Hotel management features from `/docs/` documentation are still being implemented.

**Package Manager:** Bun (uses `bun.lock`)

## Essential Commands

### Development Workflow
```bash
bun dev              # Start dev server with Turbopack
bun build            # Production build
bun start            # Start production server
bun preview          # Build + run production locally
```

### Code Quality (Run before commits)
```bash
bun check            # Lint + typecheck (recommended before committing)
bun lint             # ESLint check only
bun lint:fix         # Auto-fix linting issues
bun typecheck        # TypeScript check only
bun format:write     # Format code with Prettier
```

### Database Operations
```bash
bun db:generate      # Generate Prisma client + create dev migration
bun db:migrate       # Deploy migrations to production
bun db:push          # Push schema changes (no migration file)
bun db:studio        # Open Prisma Studio GUI (visual database editor)
```

**Note:** No test framework is currently configured. Consider adding Vitest or Jest if tests are needed.

## Architecture & Key Patterns

### T3 Stack Core Concepts

This project follows T3 Stack conventions combining:
- **Server Components by default** - Next.js App Router renders on server
- **tRPC for type-safe APIs** - Full-stack type safety from database to UI
- **Prisma for database** - Type-safe ORM with auto-generated TypeScript types
- **React Query for state** - Client-side data synchronization via tRPC

**Path Alias:** `~/` maps to `./src/` throughout the codebase.

### tRPC Request Flow

```typescript
// 1. Server: Define procedure in /src/server/api/routers/
export const postRouter = createTRPCRouter({
  create: protectedProcedure  // Requires auth (checks ctx.session.user)
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({ data: { text: input.text } })
    }),

  getAll: publicProcedure  // No auth required
    .query(({ ctx }) => ctx.db.post.findMany())
})

// 2. Server: Export from root router (/src/server/api/root.ts)
export const appRouter = createCallerFactory(createTRPCRouter)({
  post: postRouter,
  // ... other routers
})

// 3. Client: Call with hooks
const { data } = api.post.getAll.useQuery()
const createPost = api.post.create.useMutation()

// 4. Server Components: Call directly
const posts = await api.post.getAll()
```

### Server vs Client Components

**Server Components (default):**
```typescript
// src/app/page.tsx
export default async function HomePage() {
  const data = await api.post.getLatest()  // Direct call
  return <div>{data.name}</div>
}
```

**Client Components:**
```typescript
"use client"  // Required at top of file

export function LatestPost() {
  const { data } = api.post.getLatest.useQuery()  // React hook
  return <div>{data?.name}</div>
}
```

### Authentication Patterns

```typescript
// In tRPC procedures - access session
const session = ctx.session  // Available in all procedures
const user = ctx.session?.user  // Null if not authenticated

// Protect routes with protectedProcedure
export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    // ctx.session.user is guaranteed to exist here
    return ctx.db.user.findUnique({ where: { id: ctx.session.user.id } })
  })
})

// In server components
import { auth } from "~/server/auth"
const session = await auth()

// NextAuth configured in ~/server/auth/config.ts
// Providers: Discord, Google OAuth
```

### Database Access

```typescript
// Always use ctx.db in tRPC procedures
const posts = await ctx.db.post.findMany()

// Or import directly in server components
import { db } from "~/server/db"
const posts = await db.post.findMany()

// Prisma types auto-generated from schema
import type { Post, User } from "@prisma/client"
```

### Data Validation with Zod

All tRPC inputs use Zod schemas (defined in `~/lib/schemas.ts`):
```typescript
// Define schemas
export const createBookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
})

// Use in procedures
.input(createBookingSchema)
.mutation(({ input }) => {
  // input is fully typed & validated
})
```

### React Query Patterns

```typescript
// Mutations invalidate queries automatically
const utils = api.useUtils()
const createPost = api.post.create.useMutation({
  onSuccess: () => {
    utils.post.getAll.invalidate()  // Refetch all posts
  }
})
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group (no auth)
│   │   └── contact/              # Contact form page
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── trpc/[trpc]/          # tRPC HTTP handler
│   │   └── upload/               # Vercel Blob upload endpoint
│   ├── upload/                   # Image upload test page
│   ├── _components/              # App-specific components
│   ├── layout.tsx                # Root layout (providers, fonts)
│   └── page.tsx                  # Home page
│
├── server/                       # Backend code (never sent to client)
│   ├── api/
│   │   ├── trpc.ts               # tRPC context & middleware
│   │   ├── root.ts               # Root router (combines all routers)
│   │   └── routers/              # tRPC procedure definitions
│   │       ├── post.ts           # Example router
│   │       └── send.ts           # Email sending router
│   ├── auth/
│   │   ├── index.ts              # NextAuth setup (cached)
│   │   └── config.ts             # Auth providers config
│   ├── email/
│   │   └── templates/            # React-based email templates
│   │       ├── contact.tsx
│   │       └── welcome.tsx
│   ├── db.ts                     # Prisma singleton
│   └── resend.ts                 # Resend email client
│
├── trpc/                         # tRPC client configuration
│   ├── react.tsx                 # Client provider
│   ├── query-client.ts           # React Query config
│   └── server.ts                 # Server-side caller
│
├── components/
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── utils.ts                  # cn() utility for class merging
│   └── schemas.ts                # Zod validation schemas
│
└── env.js                        # Environment validation
```

## Code Style Guidelines

### Imports
- Use `~/` alias for all internal imports: `import { db } from "~/server/db"`
- Use inline type imports: `import type { User } from "@prisma/client"`
- Group imports: external packages first, then internal modules

### TypeScript
- Strict mode enabled with `noUncheckedIndexedAccess`
- Never use `any` - leverage generated Prisma types
- Zod schemas for runtime validation

### Styling
- Use Tailwind CSS exclusively (no custom CSS)
- Combine classes with `cn()` utility: `cn("base-class", conditionalClass)`
- shadcn/ui components in `~/components/ui`
- Lucide React icons: `import { ChevronRight } from "lucide-react"`
- Auto-animate with `@formkit/auto-animate`

### tRPC Best Practices
- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated endpoints (auto-checks session)
- `.query()` for reads, `.mutation()` for writes
- Access database via `ctx.db`, session via `ctx.session`
- Throw errors: `throw new TRPCError({ code: "UNAUTHORIZED", message: "..." })`

### Email Templates
- Located in `~/server/email/templates/`
- React components compiled to HTML by Resend
- Use `@react-email/components` primitives

## Environment Variables

Required variables (see `.env.example`):

```env
# Database
DATABASE_URL=postgresql://...

# Authentication (NextAuth.js)
AUTH_SECRET=                    # Auto-generated in dev if missing
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Email (Resend)
RESEND_API_KEY=
RESEND_DEV_EMAIL=               # Recipient for dev emails

# File Upload (Vercel Blob)
BLOB_READ_WRITE_TOKEN=          # Set in Vercel dashboard

# Optional
NODE_ENV=development|production
```

Validation happens at build time via `@t3-oss/env-nextjs` in `~/env.js`.

## Adding New Features

### 1. Create a New tRPC Router

```typescript
// src/server/api/routers/booking.ts
import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"

export const bookingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ roomId: z.string(), checkIn: z.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.booking.create({
        data: { ...input, userId: ctx.session.user.id }
      })
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.booking.findMany()
  })
})
```

### 2. Export from Root Router

```typescript
// src/server/api/root.ts
import { bookingRouter } from "~/server/api/routers/booking"

export const appRouter = createCallerFactory(createTRPCRouter)({
  post: postRouter,
  booking: bookingRouter,  // Add here
})
```

### 3. Use in Components

```typescript
// Client component
"use client"
export function BookingForm() {
  const createBooking = api.booking.create.useMutation()

  const handleSubmit = (data) => {
    createBooking.mutate(data)
  }
}

// Server component
export default async function BookingsPage() {
  const bookings = await api.booking.getAll()
  return <div>{bookings.map(...)}</div>
}
```

## Documentation Resources

The `/docs/` directory contains comprehensive planning documentation:

- **PROJECT_OVERVIEW.md** - Project goals, tech stack, payment flow, user roles
- **FEATURES.md** - Detailed breakdown of all 21 planned features
- **API_ROUTES.md** - Complete tRPC API documentation with examples
- **DATABASE_SCHEMA.md** - ERD diagrams, table specs, sample queries
- **AGENTS.md** - Developer guidelines (similar to this file)

**Note:** Most features documented in `/docs/` are not yet implemented. Refer to these files when building out hotel management functionality.

## Git Workflow

- Main branch: `main`
- Development branch: `dev` (current)
- Run `bun check` before committing
- Format with `bun format:write`
- Never commit `.env` files
- Commit Prisma migrations when schema changes

## Deployment

Configured for Vercel:
- Build command: `bun build`
- Framework preset: Next.js
- Environment variables set in Vercel dashboard
- See `vercel.json` for configuration
