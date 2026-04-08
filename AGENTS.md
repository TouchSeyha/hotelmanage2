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

### Type Safety

- **Strict mode enabled** with `noUncheckedIndexedAccess`
- Never use `any` - leverage Prisma generated types
- Use Zod schemas in `~/lib/schemas/` for runtime validation
- ESLint config disables unsafe rules in tRPC routers (Prisma limitation)

## Database (Prisma)

### Best Practices

- Access DB via `ctx.db` in tRPC routers, `db` singleton elsewhere
- Use `onDelete: Cascade` for owned relations, `Restrict` for references
- Index frequently queried fields (already defined in schema)
- Use `Decimal` type for prices (not Float)

## Styling & UI

### Icons & Animation

- **Icons:** Lucide React (`lucide-react` package)
- **Animations:** `@formkit/auto-animate` for simple transitions

## Naming Conventions

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
