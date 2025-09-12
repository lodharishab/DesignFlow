
# DesignFlow - Creative Services Marketplace

This is a Next.js project for DesignFlow, a marketplace connecting clients with expert designers, primarily focused on the Indian market. The platform aims to provide high-quality creative work through a streamlined process with transparent pricing.

## Project Progress & Features Checklist (as of last update)

**I. Core Structure & Public Pages:**

*   [✓] Basic Project Setup: Next.js, React, ShadCN UI, Tailwind.
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
*   [✓] Designer Portfolio Management: List, add new project (using Server Action & mock DB).
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
*   [✓] Blog Post Management: List, add, edit, delete (using Server Actions & mock DB).
*   [✓] Platform Settings Page (editable settings, simulated save).
*   [✓] Messaging Center: Direct Messages (UI), Chat Monitoring (UI), Announcements (UI + AI).
*   [✓] Reviews & Reports Management.
*   [✓] Payments & Revenue Dashboard.

**VI. E-commerce & Support:**

*   [✓] Cart Page (`/cart`): Displays items, calculates totals, basic Razorpay integration (simulated).
*   [✓] Order Success Page (`/order-success`).
*   [✓] Order Failed Page (`/order-failed`).
*   [✓] Contact Support Page (placeholder, basic form with simulated send).
*   [✓] Legal Pages: Terms of Service, Privacy Policy (placeholders).

**VII. Technical Aspects:**

*   [✓] Mock Data Management: For blog, portfolio, designers, services, orders.
*   [✓] Server Actions: Implemented for blog and portfolio creation/updates.
*   [✓] Hydration Error Fixes: Addressed issues with dynamic dates.
*   [✓] UI Context: For managing mobile menu state and login status.
*   [✓] MongoDB Setup: Basic connection file (`mongodb.ts`) in place.
*   [✓] Genkit Setup: Basic Genkit configuration (`genkit.ts`) in place.
*   [✓] AI Flows: Implemented for conversations (Kira), blog ideas, announcements, designer bios, and brand suggestions.

## VIII. Deploying with Firebase App Hosting

This project is configured for easy deployment using Firebase App Hosting, which is the recommended method within this development environment.

### Prerequisites

*   You need to be logged into Firebase. If you haven't already, run the following command in your terminal:
    ```bash
    firebase login
    ```
*   Ensure your local project is connected to a Firebase project. This is typically done for you when you start a project in Firebase Studio.

### Deployment Steps

1.  **Build the Application for Production:**
    This command compiles your Next.js application into an optimized production build.
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase App Hosting:**
    After the build is complete, run the deploy script. This command will upload your build to Firebase and provision the necessary infrastructure.
    ```bash
    npm run deploy
    ```

That's it! Firebase App Hosting will handle the rest, including scaling, security, and serving your application globally. Your app will be available at the URL provided by Firebase after the deployment is complete.

## Key Next Steps & Architectural Considerations:

1.  **Real Authentication & Authorization:** Implement a robust auth solution (e.g., NextAuth.js, Firebase Auth).
2.  **Full Database Integration:** Migrate mock data sources to MongoDB. Refactor data fetching and mutations to use the live database, likely via Server Actions or API routes.
3.  **Core Business Logic:** Implement actual order processing, designer assignment, and full payment gateway integration.
4.  **Testing:** Introduce unit and integration tests.
5.  **Error Handling & Validation:** Enhance form validation and error handling across the application.

This project uses Next.js, React, TypeScript, ShadCN UI, Tailwind CSS, and Genkit.
