# DesignFlow

A Next.js marketplace application for expert design services. Connects clients with designers for logo design, UI/UX, print design, illustration, and more.

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4, Radix UI components, shadcn/ui
- **AI**: OpenAI (via Replit AI Integrations, gpt-5-mini model)
- **Database**: PostgreSQL (Replit built-in, via `pg` package)
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
