# HYPE

A Next.js marketplace application for expert design services. Connects clients with designers for logo design, UI/UX, print design, illustration, and more.

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4, Radix UI components, shadcn/ui
- **AI**: OpenAI (via Replit AI Integrations, gpt-5-mini model)
- **Database**: PostgreSQL (Neon-backed, via `@neondatabase/serverless` + Drizzle ORM)
- **Auth/Backend**: Mock auth (prototype — add NextAuth.js for production)
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## Project Structure

- `src/app/` - Next.js App Router pages (auth, admin, client, designer, blog, etc.)
- `src/components/` - Reusable UI components (admin, ai, blog, design-services, layout, shared, ui)
- `src/ai/` - AI flows using OpenAI (announcements, blog posts, brand suggestions, designer bios, chat)
  - `genkit.ts` - OpenAI client initialization (uses Replit AI Integrations env vars)
  - `flows/` - Individual AI flow modules
- `src/lib/` - Utility libraries
  - `types.ts` - All shared TypeScript interfaces and types (single source of truth)
  - `schema.ts` - Drizzle ORM table definitions (comprehensive schema)
  - `db.ts` - Neon serverless + Drizzle ORM connection
  - `*-db.ts` - Server action files for each domain (blog, portfolio, services, orders, etc.)
  - `designer-data.ts` - Designer mock/fallback data
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React context providers
- `drizzle.config.ts` - Drizzle Kit configuration

## Database

PostgreSQL via Neon serverless with Drizzle ORM. Schema defined in `src/lib/schema.ts` with tables for:
- Users, designer profiles, site settings
- Service categories, subcategories, services, service tiers
- Orders, order events, milestones, attachments
- Transactions, payout requests, payment methods, cart items
- Conversations, messages, chat files
- Blog posts, portfolio items, brand profiles
- Notifications, audit logs, disputes, reviews/reports

## Architecture Notes

- **Server Actions**: All `*-db.ts` files use `'use server'` directive. Only async functions can be exported from these files. All interfaces/types live in `src/lib/types.ts` and are re-exported via `export type {}` from the db files for backward compatibility.
- **Fallback data**: Most db files include mock data fallback when `DATABASE_URL` is not set, controlled by `isDbEnabled()`.
- **DB scripts**: `npm run db:push` (sync schema), `npm run db:generate` (generate migrations), `npm run db:studio` (Drizzle Studio), `npm run db:seed` (seed data).

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API base URL (auto-set by Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key (auto-set by Replit AI Integrations)

## Running

- **Dev**: `npm run dev` (runs on port 5000 with Turbopack)
- **Production**: `npm run build && npm run start` (port 5000)

## Configuration Notes

- Next.js `allowedDevOrigins` is configured dynamically using `REPLIT_DEV_DOMAIN` env var
- Dev server binds to `0.0.0.0:5000`
- TypeScript and ESLint errors are ignored during builds
- Deployment configured as autoscale with `npm run build` and `npm run start`
- AI features use OpenAI via Replit AI Integrations (no separate API key needed)
