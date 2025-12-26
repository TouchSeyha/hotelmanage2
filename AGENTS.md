# Agent Guidelines

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
bun typecheck       # Run TypeScript type check
bun check           # Run both lint and typecheck

# Formatting
bun format:check    # Check code formatting with Prettier
bun format:write    # Format code with Prettier

# Database
bun db:generate     # Generate Prisma client & run migrations in dev
bun db:migrate      # Deploy migrations to production
bun db:push         # Push schema changes without migration
bun db:studio       # Open Prisma Studio

# Testing
# No test framework configured - add Vitest/Jest if needed
```

## Code Style Guidelines

### Imports & Path Aliases

- Use `~/*` alias for all internal imports (e.g., `import { db } from "~/server/db"`)
- Use inline type imports: `import type { X } from "..."` (enforced by ESLint)
- Group imports: external libs first, then internal modules

### TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- Always use types - never use `any`
- Leverage Prisma generated types for database models
- Use Zod schemas for runtime validation in tRPC procedures

### Component Structure

- Server components: default async functions (e.g., `export default async function Home()`)
- Client components: add `"use client";` at file top
- Use tRPC server-side calls in server components with `api.router.method()`
- Use tRPC React hooks in client components: `api.router.method.useQuery()`

### tRPC Patterns

- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated endpoints (verifies `ctx.session.user`)
- Define input schemas with Zod: `.input(z.object({ text: z.string() }))`
- Use `.query()` for data fetching, `.mutation()` for writes
- Access database via `ctx.db`, session via `ctx.session`
- Invalidate queries on mutations: `utils.router.invalidate()`

### Naming Conventions

- Components: PascalCase (e.g., `LatestPost`, `HomePage`)
- Functions/variables: camelCase (e.g., `createPost`, `userName`)
- tRPC routers: `[name]Router` (e.g., `postRouter`)
- Database models: PascalCase (e.g., `Post`, `User`)
- API routes: kebab-case directories (e.g., `api/auth/[...nextauth]/route.ts`)

### Styling

- Use Tailwind CSS classes exclusively
- Combine classes with `cn()` utility from `~/lib/utils` (uses clsx + tailwind-merge)
- Follow Tailwind's class order (enforced by prettier-plugin-tailwindcss)
- Prefer utility classes over custom CSS
- Use shadcn/ui components from `~/components/ui`
- Configure component variants with `class-variance-authority` (cva)
- Add animations with `@formkit/auto-animate` directive

### Error Handling

- Throw tRPC errors: `throw new TRPCError({ code: "UNAUTHORIZED" })`
- Use Zod validation errors - they auto-format on the client
- Handle null/undefined returns explicitly with `??` or optional chaining
- Use Lucide React icons from `lucide-react` package

### Database & Prisma

- Use the `db` singleton from `~/server/db`
- All Prisma calls should use Prisma Client
- Index frequently queried fields in schema.prisma
- Use cascading deletes for related records

### NextAuth

- Configure providers in `~/server/auth/config.ts`
- Access session via `auth()` function from `~/server/auth`
- Use `@auth/prisma-adapter` for session persistence

### File Organization

- `/src/app` - Next.js App Router pages and layouts
- `/src/app/_components` - components for app directory
- `/src/components` - React components (shadcn/ui in `/src/components/ui`)
- `/src/server/api/routers` - tRPC router definitions
- `/src/server/auth` - authentication configuration
- `/src/server/db.ts` - Prisma client singleton
- `/src/lib` - utility functions
- `/src/trpc` - tRPC client/server setup
- `/src/hooks` - custom React hooks

### Git Workflow

- Never commit secrets (.env files)
- Run `bun check` before committing
- Use `bun format:write` to format code
- Ensure database migrations are committed when schema changes
