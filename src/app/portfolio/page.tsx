
// No "use client" here
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { PortfolioPageContent } from './portfolio-page-client'; // Import the new client component
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Portfolio | DesignFlow',
  description: 'Explore a curated collection of stunning design projects by talented designers on DesignFlow. Get inspired for your next creative endeavor.',
  openGraph: {
    title: 'Design Portfolio Showcase | DesignFlow',
    description: 'Discover exceptional design work across various categories, from branding to UI/UX, crafted by our expert designers.',
  },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Suspense fallback={<div className="text-center py-10">Loading portfolio...</div>}>
          <PortfolioPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
