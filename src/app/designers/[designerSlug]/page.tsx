
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import type { Metadata, ResolvingMetadata } from 'next';
import { DesignerProfileClientContent } from './designer-profile-client'; // Import the client component

interface PageProps {
  params: { designerSlug: string };
}

// Simulating data fetching for generateMetadata & initial props
async function getDesignerData(slug: string): Promise<DesignerProfile | null> {
  // In a real app, fetch from your DB here
  await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async
  return designersData.find(d => d.slug === slug) || null;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.designerSlug;
  const designer = await getDesignerData(slug);

  if (!designer) {
    return {
      title: 'Designer Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const description = designer.bio.substring(0, 160) + (designer.bio.length > 160 ? '...' : '');


  return {
    title: `${designer.name} - Creative Designer on DesignFlow`,
    description: description,
    openGraph: {
      title: `${designer.name} | DesignFlow India`,
      description: description,
      images: [
        {
          url: designer.avatarUrl, 
          width: 150, 
          height: 150,
          alt: designer.name,
        },
        ...previousImages,
      ],
      type: 'profile',
      profile: {
        firstName: designer.name.split(' ')[0],
        lastName: designer.name.split(' ').slice(1).join(' '),
        username: designer.slug,
      },
    },
     twitter: {
      card: 'summary', 
      title: `${designer.name} | DesignFlow India`,
      description: description,
    },
  };
}

export default async function DesignerPage({ params }: PageProps) {
  const designer = await getDesignerData(params.designerSlug);
  // The client component DesignerProfileClientContent will handle the notFound case
  // if designer is null, based on the initialDesigner prop.

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading designer profile...</div>}>
          <DesignerProfileClientContent initialDesigner={designer} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
