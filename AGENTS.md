# Agent Guidelines for Hotel Management Platform

## Project Context

- **Stack:** Next.js 15 (App Router), React 19, TypeScript, tRPC v11, Prisma, PostgreSQL
- **Package Manager:** Bun (NOT npm/yarn/pnpm)
- **Domain:** Hotel booking & management system with public site + admin dashboard
- **Auth Roles:** `user` (guests) and `admin` (staff)

## Build & Quality Commands

```bash
# Development
bun dev              # Start dev server with Turbopack
bun build           # Build for production
bun start           # Start production server
bun preview         # Build and start production server

# Linting & Type Checking
bun lint            # Run ESLint
bun lint:fix        # Run ESLint with --fix
bun typecheck       # Run TypeScript type check (tsc --noEmit)
bun check           # Run BOTH lint AND typecheck (required before commits)

# Formatting
bun format:check    # Check code formatting with Prettier
bun format:write    # Format code with Prettier (run before commits)

# Database (Prisma)
bun db:generate     # Generate Prisma client + run migrations in dev
bun db:migrate      # Deploy migrations to production
bun db:push         # Push schema changes without migration (dev only)
bun db:seed         # Seed database with sample data
bun db:studio       # Open Prisma Studio GUI

# Testing
# No test framework configured yet - add Vitest/Jest if needed
```

## TypeScript & Imports

### Import Style (Enforced by ESLint)

```ts
//  Correct: Use inline type imports
import type { User } from '@prisma/client';
import { db } from '~/server/db';

// ❌ Wrong: Separate type import statement
import type { User } from '@prisma/client';
```

### Path Aliases

- **Always use `~/*`** for internal imports: `import { db } from "~/server/db"`
- Import order: external libs first, then internal modules
- Prisma client is generated to `../generated/prisma` (non-standard location)

### Type Safety

- **Strict mode enabled** with `noUncheckedIndexedAccess`
- Never use `any` - leverage Prisma generated types
- Use Zod schemas in `~/lib/schemas/` for runtime validation
- ESLint config disables unsafe rules in tRPC routers (Prisma limitation)

## Next.js App Router Patterns

### Server vs Client Components

```tsx
//  Server Component (default - async functions allowed)
export default async function RoomsPage() {
  const rooms = await api.room.getAll();
  return <div>{rooms.map(...)}</div>;
}

//  Client Component (use "use client" directive)
"use client";
export default function BookingForm() {
  const mutation = api.booking.create.useMutation();
  return <form onSubmit={...}>...</form>;
}
```

### tRPC Usage

- **Server components:** Direct server calls via `api.router.method()`
- **Client components:** React hooks via `api.router.method.useQuery()` / `.useMutation()`
- Invalidate queries after mutations: `utils.router.invalidate()`

## tRPC Router Patterns

### Procedure Types

```ts
// Public (unauthenticated)
publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(({ ctx, input }) => { ... })

// Protected (requires authentication)
protectedProcedure
  .input(createBookingSchema)
  .mutation(({ ctx, input }) => {
    const userId = ctx.session.user.id; // Available
    // ...
  })

// Admin only (check role manually)
adminProcedure
  .input(...)
  .mutation(({ ctx, input }) => {
    if (ctx.session.user.role !== 'admin') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    // ...
  })
```

### Schema Organization

- Define Zod schemas in `~/lib/schemas/` (e.g., `booking.ts`, `room.ts`)
- Export both schema and type: `export const createBookingSchema = z.object({ ... })`
- Re-export from `~/lib/schemas/index.ts` for easier imports

## Database (Prisma)

### Key Models

- **RoomType** → **Room** (one-to-many)
- **User** (role: `user | admin`)
- **Booking** (links User + Room, status tracking)
- **BookingLog** (audit trail)

### Best Practices

- Access DB via `ctx.db` in tRPC routers, `db` singleton elsewhere
- Use `onDelete: Cascade` for owned relations, `Restrict` for references
- Index frequently queried fields (already defined in schema)
- Use `Decimal` type for prices (not Float)

### Database Seeding

- Run `bun db:seed` to populate dev data
- Seed script: `prisma/seed.ts`

## Styling & UI

### Tailwind CSS

```tsx
//  Use cn() utility to merge classes conditionally
import { cn } from '~/lib/utils';

<div className={cn('rounded-lg p-4', isActive && 'bg-blue-500', className)} />;
```

- **Only use Tailwind classes** - no custom CSS files
- Class order enforced by `prettier-plugin-tailwindcss`
- Use shadcn/ui components from `~/components/ui`
- Configure variants with `class-variance-authority` (cva)

### Icons & Animation

- **Icons:** Lucide React (`lucide-react` package)
- **Animations:** `@formkit/auto-animate` for simple transitions

## Authentication (NextAuth v5 Beta)

```ts
// Server-side session access
import { auth } from '~/server/auth';
const session = await auth();

// tRPC context already has session
protectedProcedure.mutation(({ ctx }) => {
  const user = ctx.session.user; // { id, name, email, role }
});
```

- Config: `~/server/auth/config.ts`
- Adapter: `@auth/prisma-adapter` (session stored in DB)
- Roles: `user` (default) | `admin`

## Error Handling

```ts
//  tRPC errors with standard codes
throw new TRPCError({
  code: 'UNAUTHORIZED', // or NOT_FOUND, BAD_REQUEST, etc.
  message: 'Admin access required'
});

//  Zod validation (auto-handled by tRPC)
.input(z.object({
  email: z.string().email('Invalid email format')
}))

//  Null safety with optional chaining
const roomName = booking.room?.roomType?.name ?? 'Unknown';
```

## Naming Conventions

| Type                | Convention            | Example                                 |
| ------------------- | --------------------- | --------------------------------------- |
| **Files**           | camelCase             | `imageGallery.tsx`, `roomCard.tsx`      |
| Components          | PascalCase            | `RoomCard`, `BookingForm`               |
| Functions/Variables | camelCase             | `calculateTotalPrice`, `isAvailable`    |
| tRPC Routers        | camelCase + `Router`  | `bookingRouter`, `roomTypeRouter`       |
| Database Models     | PascalCase (singular) | `User`, `Booking`, `RoomType`           |
| API Routes          | kebab-case dirs       | `app/api/auth/[...nextauth]/route.ts`   |
| Zod Schemas         | camelCase + `Schema`  | `createBookingSchema`                   |
| Enums (Prisma)      | PascalCase values     | `Role.admin`, `BookingStatus.confirmed` |

**File Naming Rules:**
- TypeScript/React files: **camelCase** (`imageGallery.tsx`, `bookingForm.tsx`)
- Component file names match component names: `RoomCard` component → `roomCard.tsx`
- Route folders: lowercase or camelCase (`app/galleryDemo/page.tsx`)
- Avoid kebab-case or snake_case for TypeScript/React files

## File Structure

```
/src
├── app/                    # Next.js App Router
│   ├── (public)/          # Public site (/, /rooms, /about)
│   ├── (dashboard)/       # User dashboard (/book, /bookings)
│   ├── (admin)/           # Admin panel (/admin/*)
│   ├── (auth)/            # Auth pages (/signin, /error)
│   └── api/               # API routes (NextAuth, tRPC, upload)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Footer
│   └── shared/            # Reusable components
├── lib/
│   ├── schemas/           # Zod validation schemas
│   └── utils.ts           # Utility functions (cn, etc.)
├── server/
│   ├── api/routers/       # tRPC procedure definitions
│   ├── auth/              # NextAuth config
│   ├── email/templates/   # React Email templates
│   └── db.ts              # Prisma client singleton
└── trpc/                  # tRPC client setup
```

## Code Quality Checklist

Before committing:

1.  `bun check` passes (lint + typecheck)
2.  `bun format:write` applied
3.  No `any` types introduced
4.  Database migrations committed (if schema changed)
5.  `.env` files NOT committed

## Documentation Guidelines

**Important:** Follow these rules when creating documentation:

- **DO NOT create README files** unless explicitly requested by the user
- Component documentation should be inline JSDoc comments or `.md` files co-located with components
- Only create summary/setup docs when user specifically asks for them
- Keep documentation minimal and focused on code-level docs
- Existing docs in `/docs/` are for planning; avoid creating redundant documentation

## Common Patterns

### Generate Unique IDs

```ts
// Prisma uses cuid() by default
bookingNumber: `BK${year}${month}${day}${random}`; // Custom format
```

### Pagination

```ts
const { page = 1, limit = 10 } = input;
const skip = (page - 1) * limit;
// Use skip/take in Prisma queries
```

### Date Handling

- Use `date-fns` library (already installed)
- Prisma: `@default(now())` for timestamps
- Zod: `z.coerce.date()` for parsing

### Role-Based Access

```ts
const isAdmin = ctx.session.user.role === 'admin';
if (!isAdmin) throw new TRPCError({ code: 'UNAUTHORIZED' });
```

## Prettier Configuration

- Single quotes: `'string'`
- Semicolons: required
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: ES5 style
