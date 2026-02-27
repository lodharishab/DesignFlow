
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { allPortfolioItemsData } from '@/app/portfolio/page'; // Assuming this is where the full data source is
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import type { Metadata, ResolvingMetadata } from 'next';
import { PortfolioItemDetailClientContent } from './portfolio-item-detail-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Simulating data fetching for generateMetadata & initial props
// In a real app, this would fetch from your DB.
async function getPortfolioItemData(id: string): Promise<PortfolioItem | null> {
  // Simulate async operation, e.g., database call
  await new Promise(resolve => setTimeout(resolve, 0));
  const item = allPortfolioItemsData.find(p => p.id === id);
  return item || null;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItemData(id);

  if (!item) {
    return {
      title: 'Portfolio Item Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${item.title} - ${item.category} | DesignFlow Portfolio`,
    description: item.projectDescription.substring(0, 160),
    openGraph: {
      title: `${item.title} | DesignFlow Portfolio`,
      description: item.projectDescription.substring(0, 160),
      images: [
        {
          url: item.coverImageUrl,
          width: 600, // Provide appropriate dimensions
          height: 450, // Provide appropriate dimensions
          alt: item.title,
        },
        ...previousImages,
      ],
      type: 'article', // 'article' is suitable for portfolio items
      tags: item.tags,
      // You could add author information if relevant
      // authors: item.designer ? [item.designer.name] : [],
    },
    twitter: { // Add Twitter card data for better sharing
      card: 'summary_large_image',
      title: `${item.title} | DesignFlow Portfolio`,
      description: item.projectDescription.substring(0, 160),
      // images: [item.coverImageUrl], // Twitter often prefers its own image tag
    },
  };
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getPortfolioItemData(id);

  // If the item is not found by the server component, trigger a 404 immediately.
  // The client component also has a notFound check, but this is more direct.
  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Pass the fetched item to the client component */}
        {/* Suspense boundary is good practice for client components that might do further client-side fetching or heavy computation */}
        <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading project...</div>}>
          <PortfolioItemDetailClientContent initialItem={item} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
