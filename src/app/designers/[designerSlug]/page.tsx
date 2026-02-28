
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { getDesignerBySlug, type DesignerProfile } from '@/lib/designer-db';
import type { Metadata, ResolvingMetadata } from 'next';
import { DesignerProfileClientContent } from './designer-profile-client'; // Import the client component

interface PageProps {
  params: Promise<{ designerSlug: string }>;
}

// Fetch designer data from DB
async function getDesignerData(slug: string): Promise<DesignerProfile | null> {
  return getDesignerBySlug(slug);
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { designerSlug: slug } = await params;
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
      firstName: designer.name.split(' ')[0],
      lastName: designer.name.split(' ').slice(1).join(' '),
      username: designer.slug,
    },
     twitter: {
      card: 'summary', 
      title: `${designer.name} | DesignFlow India`,
      description: description,
    },
  };
}

export default async function DesignerPage({ params }: PageProps) {
  const { designerSlug } = await params;
  const designer = await getDesignerData(designerSlug);
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
