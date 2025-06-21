
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

**IV. Designer Area (`/designer/...`):**

*   [✓] Designer Layout: Sidebar navigation.
*   [✓] Designer Dashboard.
*   [✓] Designer Portfolio Management: List, add new project (using Server Action & mock DB).
*   [✓] Designer Portfolio Edit Page (placeholder).
*   [✓] Designer Profile & Settings Page (editable with mock data, simulated save).
*   [✓] Designer Service Alerts/Notifications Page (preferences can be toggled, simulated save).
*   [✓] Designer Orders List & Detail Pages (view assigned orders, mock data).

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
*   [✓] UI Context: For managing mobile menu state.
*   [✓] MongoDB Setup: Basic connection file (`mongodb.ts`) in place.
*   [✓] Genkit Setup: Basic Genkit configuration (`genkit.ts`) in place.

## VIII. Deploying to a Virtual Private Server (VPS)

This guide provides instructions for deploying the Next.js application to a standard Linux VPS (e.g., Ubuntu) using Nginx as a reverse proxy and PM2 as a process manager.

### Prerequisites

Before you begin, ensure your VPS has the following installed:
*   **Node.js** (version 20.x or later recommended)
*   **npm** or **yarn**
*   **PM2**: A process manager for Node.js. Install globally with `npm install pm2 -g`.
*   **Nginx**: A web server to act as a reverse proxy. Install with `sudo apt update && sudo apt install nginx`.

### Step 1: Set Up Project on VPS

1.  SSH into your VPS.
2.  Clone your project repository:
    ```bash
    git clone [your-repository-url]
    ```
3.  Navigate into the project directory:
    ```bash
    cd [your-project-directory]
    ```
4.  Install project dependencies:
    ```bash
    npm install
    ```

### Step 2: Configure Environment Variables

1.  Create a `.env.local` file in the root of your project. This file will hold your production environment variables and is ignored by Git.
    ```bash
    nano .env.local
    ```
2.  Add the necessary variables. **It is critical to set these for your production environment.**
    ```env
    # Example .env.local
    MONGODB_URI=your_production_mongodb_connection_string
    NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    # Add other secret keys or variables required by your application
    ```

### Step 3: Build the Application

Run the build script to compile your Next.js application for production:
```bash
npm run build
```

### Step 4: Run with PM2

PM2 will start your application and ensure it restarts automatically if it crashes or the server reboots.

1.  Start the application using the `npm start` script (which runs `next start -p 9091`):
    ```bash
    pm2 start npm --name "designflow" -- run start
    ```
    *   `--name "designflow"` gives your process a memorable name.
    *   `-- run start` tells PM2 to use the `start` script from `package.json`.

2.  To ensure PM2 starts on server reboot, run:
    ```bash
    pm2 startup
    ```
    (It will provide a command you need to copy and paste to complete the setup).

3.  Save the current process list:
    ```bash
    pm2 save
    ```

Your app is now running on `http://localhost:9091`, but it's not accessible from the outside world yet.

### Step 5: Configure Nginx as a Reverse Proxy

Nginx will listen for public traffic on port 80 (HTTP) and forward it to your Next.js application running on port 9091.

1.  Create a new Nginx configuration file for your site:
    ```bash
    sudo nano /etc/nginx/sites-available/designflow
    ```

2.  Paste the following configuration into the file. **Replace `yourdomain.com` with your actual domain name.**
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://localhost:9091;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

3.  Enable this configuration by creating a symbolic link to the `sites-enabled` directory:
    ```bash
    sudo ln -s /etc/nginx/sites-available/designflow /etc/nginx/sites-enabled/
    ```

4.  Test your Nginx configuration for syntax errors:
    ```bash
    sudo nginx -t
    ```

5.  If the test is successful, restart Nginx to apply the changes:
    ```bash
    sudo systemctl restart nginx
    ```

### Step 6: Securing with SSL (Recommended)

For a production site, HTTPS is essential. You can get a free SSL certificate from Let's Encrypt using Certbot.

1.  Install Certbot:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```
2.  Run Certbot to automatically configure SSL for your domain:
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```
    Follow the on-screen prompts. Certbot will automatically update your Nginx configuration and set up auto-renewal.

Your application should now be live and accessible at `https://yourdomain.com`.

## Key Next Steps & Architectural Considerations:

1.  **Real Authentication & Authorization:** Implement a robust auth solution (e.g., NextAuth.js, Firebase Auth).
2.  **Full Database Integration:** Migrate mock data sources to MongoDB. Refactor data fetching and mutations to use the live database, likely via Server Actions or API routes.
3.  **Core Business Logic:** Implement actual order processing, designer assignment, and full payment gateway integration.
4.  **Genkit for AI Features:** Explore and integrate AI capabilities (e.g., content generation, image moderation/tagging, AI-assisted design briefs).
5.  **Testing:** Introduce unit and integration tests.
6.  **Error Handling & Validation:** Enhance form validation and error handling across the application.

This project uses Next.js, React, ShadCN UI, Tailwind CSS, and Genkit (for potential AI features).
