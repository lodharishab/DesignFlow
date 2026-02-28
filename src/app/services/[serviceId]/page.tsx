
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceById, getApprovedDesignersByService } from '@/lib/services-db';
import { getDesignerById } from '@/lib/designer-db';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { ServiceDetailClientContent } from './service-detail-client';
import { Suspense } from 'react';

// Keep interfaces and data needed for server-side fetching and metadata
export interface ServiceTierData {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTimeUnit: 'days' | 'business_days' | 'weeks';
  scope: string[];
  tierDescription?: string;
  iconName: string; // Store icon name as string for serialization
}

export interface ApprovedDesignerData {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string;
  rating: number;
  projectsCompleted: number;
  imageHint: string;
}

export interface ServiceDetailData {
  id: string;
  name: string;
  generalDescription: string;
  longDescription: string;
  category: string;
  tags?: string[];
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTierData[];
  approvedDesigners: ApprovedDesignerData[];
}

// Fetch service detail from the database
async function getServiceData(id: string): Promise<ServiceDetailData | null> {
  const service = await getServiceById(id);
  if (!service) return null;

  // Get approved designer IDs for this service
  const designerIds = await getApprovedDesignersByService(id);
  
  // Fetch full designer profiles
  const designerProfiles = await Promise.all(
    designerIds.map(did => getDesignerById(did))
  );

  const approvedDesigners: ApprovedDesignerData[] = designerProfiles
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .map(d => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      avatarUrl: d.avatarUrl,
      rating: d.clientRatingAverage ?? 4.8,
      projectsCompleted: Math.floor(Math.random() * 50) + 20,
      imageHint: d.imageHint,
    }));

  return {
    id: service.id,
    name: service.name,
    generalDescription: service.generalDescription || '',
    longDescription: service.longDescription || '',
    category: service.category || '',
    tags: service.tags || [],
    imageUrl: service.imageUrl || 'https://placehold.co/800x500.png',
    imageHint: service.imageHint || service.name.toLowerCase(),
    tiers: service.tiers.map(t => ({
      name: t.name as 'Basic' | 'Standard' | 'Premium',
      price: t.price,
      deliveryTimeMin: t.deliveryTimeMin || 3,
      deliveryTimeMax: t.deliveryTimeMax || 7,
      deliveryTimeUnit: (t.deliveryTimeUnit || 'days') as 'days' | 'business_days' | 'weeks',
      scope: t.scope || [],
      tierDescription: t.description || undefined,
      iconName: t.iconName || 'Star',
    })),
    approvedDesigners,
  };
}

interface PageProps {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { serviceId: id } = await params;
  const service = await getServiceData(id);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${service.name} - ${service.category}`,
    description: service.generalDescription,
    openGraph: {
      title: `${service.name} | DesignFlow`,
      description: service.generalDescription,
      images: [
        {
          url: service.imageUrl,
          width: 800,
          height: 500,
          alt: service.name,
        },
        ...previousImages,
      ],
      type: 'article', // Changed from 'product' to 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.name} | DesignFlow`,
      description: service.generalDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { serviceId } = await params;
  const service = await getServiceData(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading service details...</div>}>
        <ServiceDetailClientContent service={service} />
      </Suspense>
      <Footer />
    </div>
  );
}
