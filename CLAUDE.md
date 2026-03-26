# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) & Other AI Agents when working with code in this repository.

## Project Overview

This is a **Hotel Management & Booking Platform** built with the T3 Stack (Next.js 15 + React 19 + TypeScript + tRPC + Prisma + NextAuth.js). It's designed as an MVP for single hotel operations with a customer-facing booking website and admin dashboard featuring manual payment verification.

**Current Status:** Early development phase. Core infrastructure (auth, database, email, file upload) is configured. Hotel management features from `/docs/` documentation are still being implemented.

**Package Manager:** Bun (uses `bun.lock`)

## Essential Commands

### Development Workflow
```bash
bun dev              # No need to run assume user already running
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

### File Naming
- **Use camelCase** for all file names: `imageGallery.tsx`, `roomCard.tsx`, `bookingForm.tsx`
- Component files match component name: `RoomCard` component → `roomCard.tsx`
- Route folders can use lowercase: `app/galleryDemo/page.tsx`
- Avoid kebab-case or snake_case for TypeScript/React files

### TypeScript</text>
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

## Deployment

Configured for Vercel:
- Build command: `bun build`
- Framework preset: Next.js
- Environment variables set in Vercel dashboard
- See `vercel.json` for configuration
