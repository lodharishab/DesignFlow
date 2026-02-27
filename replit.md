# DesignFlow

A Next.js marketplace application for expert design services. Connects clients with designers for logo design, UI/UX, print design, illustration, and more.

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4, Radix UI components, shadcn/ui
- **AI**: Google Genkit with Google AI
- **Database**: MongoDB (via `mongodb` package)
- **Auth/Backend**: Firebase
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## Project Structure

- `src/app/` - Next.js App Router pages (auth, admin, client, designer, blog, etc.)
- `src/components/` - Reusable UI components (admin, ai, blog, design-services, layout, shared, ui)
- `src/ai/` - Genkit AI flows (announcements, blog posts, brand suggestions, designer bios, chat)
- `src/lib/` - Utility libraries (MongoDB connection, etc.)
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React context providers
- `dataconnect/` - Firebase Data Connect schema and connectors

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - MongoDB database name (defaults to `designflow_db`)
- `NEXT_PUBLIC_SITE_URL` - Public site URL

## Running

- **Dev**: `npm run dev` (runs on port 5000 with Turbopack)
- **Production**: `npm run build && npm run start` (port 5000)

## Configuration Notes

- Next.js is configured with `allowedDevOrigins: ["*"]` to support Replit's proxy
- Dev server binds to `0.0.0.0:5000`
- TypeScript and ESLint errors are ignored during builds
