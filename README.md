
# HYPE - Creative Services Marketplace (v0.05)

**Last Updated:** February 27, 2026

This is a Next.js project for HYPE, a marketplace connecting clients with expert designers, primarily focused on the Indian market. The platform aims to provide high-quality creative work through a streamlined process with transparent pricing.

## What's New in v0.05

*   **Platform Migration:** Moved from Google Firebase Studio to Replit for development, hosting, and deployment.
*   **AI Provider Switch:** Replaced Google Genkit (Gemini) with OpenAI (via Replit AI Integrations). All AI flows now use OpenAI's `gpt-5-mini` model. No separate API key is required — usage is billed through Replit credits.
*   **Database Migration:** Switched from MongoDB to Replit's built-in PostgreSQL database. Blog posts and portfolio items are now stored in PostgreSQL with full CRUD support via Server Actions.
*   **Removed Firebase Dependencies:** Removed `genkit`, `@genkit-ai/googleai`, `@genkit-ai/next`, and `genkit-cli` packages. Removed Firebase App Hosting configuration.
*   **Environment Updates:** Site URL fallback updated to use Replit's domain. Dev server configured for Replit's networking (port 5000, `0.0.0.0` binding).

## Project Progress & Features Checklist (as of v0.05)

**I. Core Structure & Public Pages:**

*   [✓] Basic Project Setup: Next.js 15, React 18, ShadCN UI, Tailwind CSS, TypeScript.
*   [✓] Homepage (`/`): Hero, How it Works, Featured Services, Portfolio Glance, CTAs.
*   [✓] Services Landing Page (`/design-services`): Hero with auto-scrolling category carousel, Popular Services, Portfolio Glance.
*   [✓] All Services Page (`/services`): Filterable and sortable list of all service packages (auto-filters from header links).
*   [✓] Individual Service Detail Page (`/services/[serviceId]`): Detailed view of a service, its tiers, and approved designers.
*   [✓] Portfolio Listing Page (`/portfolio`): Filterable gallery of portfolio items.
*   [✓] Individual Portfolio Item Page (`/portfolio/[id]`): Detailed view of a portfolio project.
*   [✓] Designer Public Profile Page (`/designers/[designerSlug]`): Showcasing designer's bio, specialties, and portfolio.
*   [✓] Blog Feature:
    *   [✓] Blog Listing Page (`/blog`): Displays all blog posts.
    *   [✓] Individual Blog Post Page (`/blog/[slug]`): Displays a single blog post.
*   [✓] Layout Components: Navbar, CategoriesNavbar (with prominent category links), Footer, Mobile Bottom Navigation.
*   [✓] Styling: Custom theme, responsive design, light/dark mode.

**II. Authentication & User Roles:**

*   [✓] Auth Layout & Pages:
    *   Login page (`/login`) with basic role-based redirection.
    *   Client Signup (`/signup`) - multi-step form.
    *   Designer Signup (`/signup/designer`).
*   [✓] Designer Pending Approval Page (`/designer/pending-approval`).

**III. Client Area (`/client/...`):**

*   [✓] Client Layout: Sidebar navigation.
*   [✓] Client Dashboard.
*   [✓] Client Orders List (placeholder with mock data).
*   [✓] Client Order Detail (placeholder with mock data).
*   [✓] Client Profile (placeholder with mock data, simulated save).
*   [✓] Client Brand Profile Page with AI Suggestions & Live Preview.

**IV. Designer Area (`/designer/...`):**

*   [✓] Designer Layout: Sidebar navigation.
*   [✓] Designer Dashboard.
*   [✓] Designer Portfolio Management: List, add new project (using Server Action & PostgreSQL).
*   [✓] Designer Portfolio Edit Page (placeholder).
*   [✓] Designer Profile & Settings Page (editable with mock data, simulated save).
*   [✓] Designer Service Alerts/Notifications Page (preferences can be toggled, simulated save).
*   [✓] Designer Orders List & Detail Pages (view assigned orders, mock data).
*   [✓] Designer Earnings & Payouts Dashboard.
*   [✓] Designer Performance & Reviews Dashboard.

**V. Admin Area (`/admin/...`):**

*   [✓] Admin Layout: Sidebar navigation.
*   [✓] Admin Dashboard: Stats and quick links.
*   [✓] User Management: List, add, edit (simulated functionality).
    *   [✓] User Detail View (placeholder).
*   [✓] Designer Management: List, add, edit, status changes (simulated).
    *   [✓] Designer Detail View (placeholder).
    *   [✓] Designer Applications (placeholder, links to filtered list).
*   [✓] Service Management: List (with expandable tiers), add, edit (simulated).
*   [✓] Service Category Management: List, add, edit (simulated).
*   [✓] Service Sub-Category Management: List, add, edit (simulated).
*   [✓] Service Tag Management (placeholder, shows tags from services).
*   [✓] Order Management: All Orders list (with filtering/sorting) and status-specific views (e.g., In Progress, Completed), Order Detail page (mock data).
*   [✓] Blog Post Management: List, add, edit, delete (using Server Actions & PostgreSQL).
*   [✓] Platform Settings Page (editable settings, simulated save).
*   [✓] Messaging Center: Direct Messages (UI), Chat Monitoring (UI), Announcements (UI + AI).
*   [✓] Reviews & Reports Management.
*   [✓] Payments & Revenue Dashboard.
*   [✓] Platform Info: README viewer with version tabs (`/admin/platform-info`).

**VI. E-commerce & Support:**

*   [✓] Cart Page (`/cart`): Displays items, calculates totals, basic Razorpay integration (simulated).
*   [✓] Order Success Page (`/order-success`).
*   [✓] Order Failed Page (`/order-failed`).
*   [✓] Contact Support Page (placeholder, basic form with simulated send).
*   [✓] Legal Pages: Terms of Service, Privacy Policy (placeholders).

**VII. Technical Aspects:**

*   [✓] Mock Data Management: For designers, services, orders (blog and portfolio use PostgreSQL).
*   [✓] Server Actions: Implemented for blog and portfolio creation/updates.
*   [✓] Hydration Error Fixes: Addressed issues with dynamic dates.
*   [✓] UI Context: For managing mobile menu state and login status.
*   [✓] PostgreSQL Database: Replit's built-in PostgreSQL via `pg` package. Tables: `blog_posts`, `portfolio_items`.
*   [✓] OpenAI Integration: Via Replit AI Integrations (`gpt-5-mini` model). No separate API key needed.
*   [✓] AI Flows: Implemented for conversations (Kira), blog ideas, announcements, designer bios, and brand suggestions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3.4 (App Router, Turbopack) |
| Language | TypeScript |
| UI Components | ShadCN UI, Radix UI |
| Styling | Tailwind CSS 3.4 |
| AI | OpenAI via Replit AI Integrations |
| Database | PostgreSQL (Replit built-in, via `pg`) |
| State Management | TanStack React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Hosting | Replit |

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-provisioned by Replit |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | PostgreSQL connection details | Auto-provisioned by Replit |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI API base URL | Auto-set by Replit AI Integrations |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | Auto-set by Replit AI Integrations |
| `REPLIT_DEV_DOMAIN` | Dev environment domain | Auto-set by Replit |

## Running the Application

*   **Development:** `npm run dev` (runs on port 5000 with Turbopack)
*   **Production Build:** `npm run build`
*   **Production Start:** `npm run start` (port 5000)

## Deploying on Replit

This project is hosted on Replit. To deploy:

1.  Ensure the application builds successfully with `npm run build`.
2.  Use Replit's built-in deployment feature to publish the application.
3.  Replit handles scaling, HTTPS, and domain management automatically.

## Key Next Steps & Architectural Considerations:

1.  **Real Authentication & Authorization:** Implement a robust auth solution (e.g., NextAuth.js).
2.  **Full Database Integration:** Migrate remaining mock data sources to PostgreSQL.
3.  **Core Business Logic:** Implement actual order processing, designer assignment, and full payment gateway integration.
4.  **Testing:** Introduce unit and integration tests.
5.  **Error Handling & Validation:** Enhance form validation and error handling across the application.

This project uses Next.js, React, TypeScript, ShadCN UI, Tailwind CSS, and OpenAI.
