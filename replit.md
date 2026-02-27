# DesignFlow

A Next.js marketplace application for expert design services. Connects clients with designers for logo design, UI/UX, print design, illustration, and more.

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4, Radix UI components, shadcn/ui
- **AI**: Google Genkit with Google AI
- **Database**: PostgreSQL (Replit built-in, via `pg` package)
- **Auth/Backend**: Mock auth (prototype — add NextAuth.js for production)
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## Project Structure

- `src/app/` - Next.js App Router pages (auth, admin, client, designer, blog, etc.)
- `src/components/` - Reusable UI components (admin, ai, blog, design-services, layout, shared, ui)
- `src/ai/` - Genkit AI flows (announcements, blog posts, brand suggestions, designer bios, chat)
- `src/lib/` - Utility libraries
  - `db.ts` - PostgreSQL connection pool and query helpers
  - `blog-db.ts` - Blog post CRUD operations
  - `portfolio-db.ts` - Portfolio item CRUD operations
  - `designer-data.ts` - Designer mock data
  - `brand-profile-db.ts` - Brand profile (localStorage-based)
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React context providers

## Database

PostgreSQL tables:
- `blog_posts` - Blog content with author, status, categories, tags, engagement metrics
- `portfolio_items` - Designer portfolio projects with gallery images and tags

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `NEXT_PUBLIC_SITE_URL` - Public site URL

## Running

- **Dev**: `npm run dev` (runs on port 5000 with Turbopack)
- **Production**: `npm run build && npm run start` (port 5000)

## Configuration Notes

- Next.js `allowedDevOrigins` is configured dynamically using `REPLIT_DEV_DOMAIN` env var
- Dev server binds to `0.0.0.0:5000`
- TypeScript and ESLint errors are ignored during builds
- Deployment configured as autoscale with `npm run build` and `npm run start`
