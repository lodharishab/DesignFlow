
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ServicesPageClientContent } from './services-page-client';

export const metadata: Metadata = {
  title: 'All Design Services | DesignFlow',
  description: 'Browse all design services offered on DesignFlow. Find solutions for logo design, UI/UX, print, social media, and more.',
  openGraph: {
    title: 'All Design Services | DesignFlow',
    description: 'Explore our full catalog of creative design services. Connect with expert designers today.',
  },
};

export default function ServicesPageContainer() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Suspense fallback={<div className="text-center py-10">Loading services...</div>}>
          <ServicesPageClientContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

