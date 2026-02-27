
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { designersData } from '@/lib/designer-data';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { Icon as LucideIconType } from 'lucide-react';
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

// MOCK DATA - In a real app, this would be fetched from a database
const serviceDetailsData: { [key: string]: ServiceDetailData } = {
  '1': {
    id: '1',
    name: 'Modern Logo Design',
    generalDescription: 'Get a unique and memorable logo for your brand that resonates with your target audience.',
    longDescription: 'Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness. Each tier offers a different level of complexity and deliverables to match your needs, from essential concepts to comprehensive brand assets. We work closely with you to understand your vision and translate it into a powerful visual identity.',
    category: 'Logo Design',
    tags: ['branding', 'minimalist', 'vector', 'startup', 'brand identity'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'modern logo concept',
    tiers: [
      {
        name: 'Basic', price: 4999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['1 Initial concept (culturally adapted)', '2 Rounds of revisions', 'Basic vector files (SVG, PNG)'],
        tierDescription: 'A great starting point for new brands or simple logo needs. Get a foundational logo quickly and efficiently.',
        iconName: 'Shield',
      },
      {
        name: 'Standard', price: 9999, deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'days',
        scope: ['3 Initial concepts (aesthetic options)', '3 Rounds of revisions', 'Full vector files (AI, EPS, SVG, PNG, JPG)', 'Basic brand guide (colors, fonts)'],
        tierDescription: 'Our most popular option, offering a comprehensive logo package with more choices and branding elements.',
        iconName: 'Star',
      },
      {
        name: 'Premium', price: 14999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days',
        scope: ['5 Initial concepts (diverse styles)', 'Unlimited revisions', 'Full vector & source files', 'Detailed brand guidelines', 'Social media kit'],
        tierDescription: 'For businesses needing an extensive branding solution, maximum flexibility, and additional assets.',
        iconName: 'Zap',
      },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Logo Design') || d.specialties.includes('Branding')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*50)+20, imageHint: d.imageHint})),
  },
  '2': {
    id: '2',
    name: 'Social Media Pack',
    generalDescription: 'Engaging posts designed for your social media channels, optimized for audience engagement and festive seasons.',
    longDescription: 'Boost your online presence with professionally designed social media posts tailored to your brand and campaign goals. We provide source files and high-resolution images ready for publishing across platforms like Instagram, Facebook, and regional social media. Content is optimized for engagement and visual appeal, considering relevant festivals and trends.',
    category: 'Social Media',
    tags: ['instagram marketing', 'facebook content', 'regional content', 'festival posts', 'social media marketing'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'social media post design',
    tiers: [
      {
        name: 'Basic', price: 2499, deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'days',
        scope: ['5 social media posts (e.g., for a specific festival/campaign)', '1 Platform choice', '1 Round of revisions', 'Optimized JPG/PNG'],
        tierDescription: 'Perfect for a quick boost or testing new content on a single platform.',
        iconName: 'Shield',
      },
      {
        name: 'Standard', price: 4999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['10 social media posts', 'Up to 2 platforms', '2 Rounds of revisions', 'Source files (PSD or Figma)'],
        tierDescription: 'A balanced pack for consistent social media engagement across multiple platforms.',
        iconName: 'Star',
      },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Social Media Graphics') || d.specialties.includes('Content Creation')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*80)+30, imageHint: d.imageHint})),
  },
   '3': {
    id: '3',
    name: 'Professional Brochure Design',
    generalDescription: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.',
    longDescription: 'Comprehensive brochure design including concept, layout, and print-ready files. We work with you to create a compelling narrative and visual style that captures attention and effectively communicates your message. Ideal for marketing materials, event handouts, and informational packets.',
    category: 'Print Design',
    tags: ['brochure design', 'marketing collateral', 'print advertising', 'catalogue design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'business brochure design',
    tiers: [
        {
            name: 'Standard', price: 7999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days',
            scope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included (up to 3 images)', '3 revision rounds', 'Print-ready PDF'],
            tierDescription: 'High-quality brochure design for marketing and events, covering common formats suitable for businesses.',
            iconName: 'Star',
        },
        {
            name: 'Premium', price: 12999, deliveryTimeMin: 2, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks',
            scope: ['Custom brochure design (up to 12 panels)', 'Premium stock imagery (up to 5 images)', '5 revision rounds', 'Print-ready PDF & source files', 'Copywriting suggestions (up to 200 words)'],
            tierDescription: 'Comprehensive brochure package with more content, panels, and added features like copywriting support.',
            iconName: 'Zap',
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Print Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*40)+15, imageHint: d.imageHint})),
  },
   '4': {
    id: '4',
    name: 'UI/UX Web Design Mockup',
    generalDescription: 'High-fidelity mockup for one key page of your website or app, tailored for modern user experiences.',
    longDescription: 'Detailed UI/UX design for a single, critical page, including wireframes, mockups, and a style guide for key elements. Ideal for presentations or developer handoff. We focus on user-centric design principles to ensure an intuitive and visually appealing experience. Suitable for landing pages, product pages, or core app screens.',
    category: 'UI/UX Design',
    tags: ['website design', 'app design', 'mockup', 'figma', 'user experience', 'landing page design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'mobile app ui design',
    tiers: [
        {
            name: 'Standard', price: 15999, deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'days',
            scope: ['1 page UI/UX design (e.g., Homepage or Product Page)', 'Mobile and desktop views', '2 revision rounds', 'Figma/XD source file'],
            tierDescription: 'Essential page design to visualize your web project for one key screen.',
            iconName: 'Star',
        },
        {
            name: 'Premium', price: 23999, deliveryTimeMin: 14, deliveryTimeMax: 21, deliveryTimeUnit: 'days',
            scope: ['Up to 3 key pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype (clickable)', '3 revision rounds', 'Component style guide', 'Figma/XD source files'],
            tierDescription: 'A more complete UI/UX package for core application flow, including multiple screens and an interactive prototype.',
            iconName: 'Zap',
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Web UI/UX') || d.specialties.includes('App Design')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*60)+25, imageHint: d.imageHint})),
  },
  '5': {
    id: '5',
    name: 'Custom Illustration',
    generalDescription: 'Unique vector or raster illustration based on your brief, with options for various styles.',
    longDescription: 'From simple icons to complex scenes, get custom illustrations in your desired style. Perfect for websites, marketing materials, or personal projects. We bring your ideas to life visually, ensuring the illustration aligns with your brand and message. Discuss your style preferences with our designers.',
    category: 'Illustration',
    tags: ['art style', 'digital painting', 'character design', 'custom graphics', 'vector illustration'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'folk art illustration',
    tiers: [
        {
            name: 'Basic', price: 3999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
            scope: ['1 simple icon or spot illustration', 'Limited detail', '2 revision rounds', 'PNG/JPG output'],
            tierDescription: 'For small, simple illustration needs like icons or minor graphic elements.',
            iconName: 'Shield',
        },
        {
            name: 'Standard', price: 7999, deliveryTimeMin: 5, deliveryTimeMax: 8, deliveryTimeUnit: 'days',
            scope: ['1 custom illustration (e.g., character, small scene)', 'Medium detail', '3 revision rounds', 'Source file (AI, PSD, or other)', 'Commercial use license'],
            tierDescription: 'Versatile illustration for most common uses, like website heroes or blog post graphics.',
            iconName: 'Star',
        },
        {
            name: 'Premium', price: 11999, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks',
            scope: ['1 complex illustration (e.g., detailed scene, multiple characters)', 'High detail and complexity', '5 revision rounds', 'Source file & all formats', 'Enhanced commercial use license'],
            tierDescription: 'For high-impact, detailed illustrative work requiring more complexity and refinement.',
            iconName: 'Zap',
        },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Illustration') || d.specialties.includes('Digital Art')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*30)+10, imageHint: d.imageHint})),
  },
  '6': {
    id: '6',
    name: 'Packaging Design Concept',
    generalDescription: 'Creative packaging concept for your product, designed for the retail landscape.',
    longDescription: 'Develop a unique and attractive packaging design concept that makes your product stand out. Includes mockups and initial dieline considerations to help visualize the final product. We consider your brand, target audience, and product characteristics to create a compelling packaging solution.',
    category: 'Packaging',
    tags: ['product packaging', 'box design', 'label design', 'fmcg', 'sustainable packaging'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'product packaging design',
    tiers: [
        {
            name: 'Standard', price: 12999, deliveryTimeMin: 8, deliveryTimeMax: 12, deliveryTimeUnit: 'business_days',
            scope: ['1 packaging concept (e.g., box, label)', '2D mockups', 'Basic dieline sketch', 'Color palette and typography suggestions', '2 revision rounds'],
            tierDescription: 'Solid packaging concept to get you started with visualizing your product\'s look.',
            iconName: 'Star',
        },
        {
            name: 'Premium', price: 19999, deliveryTimeMin: 12, deliveryTimeMax: 18, deliveryTimeUnit: 'business_days',
            scope: ['Up to 2 packaging concepts or 1 complex concept', '3D mockups', 'Detailed dieline sketch', 'Full branding elements integration', 'Print-ready file preparation advice', '3 revision rounds'],
            tierDescription: 'Comprehensive packaging design for market-ready products, including 3D mockups and more concepts.',
            iconName: 'Zap',
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Packaging Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*25)+5, imageHint: d.imageHint})),
  },
   '7': {
    id: '7',
    name: 'Basic Logo Sketch',
    generalDescription: 'Quick logo sketches for initial ideas, with an option for various design elements.',
    longDescription: 'Get 3-5 rough logo sketches to explore initial concepts and directions for your brand identity. This is a great starting point for brainstorming and refining your vision before committing to a full design. These are conceptual sketches, not finalized logos.',
    category: 'Logo Design',
    tags: ['logo sketch', 'concept design', 'ideation', 'design motifs', 'quick design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'logo sketch concept',
    tiers: [
        {
            name: 'Basic', price: 2499, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'days',
            scope: ['3-5 rough logo sketches (digital)', 'Delivered as JPG/PNG', '1 round of feedback for minor sketch adjustments'],
            tierDescription: 'Rapidly explore initial logo ideas with a set of quick digital sketches.',
            iconName: 'Shield',
        },
    ],
    approvedDesigners: [],
  },
  '8': {
    id: '8',
    name: 'Animated Explainer Video',
    generalDescription: 'Short animated videos (2D) to explain your product/service, with voiceover option.',
    longDescription: 'Engage your audience with a concise and compelling 2D animated explainer video. We cover scriptwriting assistance, storyboarding, animation, and voiceover (English or other language options available). Perfect for product demos, service explanations, or social media campaigns.',
    category: 'Motion Graphics',
    tags: ['2d animation', 'marketing video', 'product demo', 'voiceover', 'video marketing'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'explainer video animation',
    tiers: [
      { name: 'Standard', price: 19999, deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'weeks', scope: ['Up to 30 seconds animation', 'Custom graphics', 'Background music', 'English voiceover'], tierDescription: 'A short and impactful animated video.', iconName: 'Star' },
      { name: 'Premium', price: 34999, deliveryTimeMin: 3, deliveryTimeMax: 4, deliveryTimeUnit: 'weeks', scope: ['Up to 60 seconds animation', 'Custom graphics & characters', 'Background music & sound effects', 'Voiceover (various languages)', 'Script assistance'], tierDescription: 'A more comprehensive video with enhanced features.', iconName: 'Zap' },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Motion Graphics') || d.specialties.includes('Video Editing')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*15)+5, imageHint: d.imageHint})),
  },
  '9': {
    id: '9',
    name: 'Business Presentation Design',
    generalDescription: 'Professional presentations for businesses, investors, and conferences.',
    longDescription: 'Create impactful and visually appealing presentations that effectively communicate your message. We design custom templates, infographics, and ensure a cohesive visual style. Suitable for pitch decks, sales presentations, and corporate reports.',
    category: 'Presentations',
    tags: ['pitch deck', 'corporate presentation', 'powerpoint design', 'investor deck', 'keynote slides'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'business presentation slide',
    tiers: [
      { name: 'Standard', price: 8999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['Up to 15 slides custom design', 'Data visualization (charts/graphs)', 'Stock images included'], tierDescription: 'Professional design for standard presentations.', iconName: 'Star' },
      { name: 'Premium', price: 15999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days', scope: ['Up to 30 slides custom design', 'Advanced data visualization', 'Custom graphics & icons', 'Editable template provided'], tierDescription: 'Comprehensive design for critical presentations.', iconName: 'Zap' },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Presentation Design') || d.specialties.includes('Corporate Branding')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*40)+10, imageHint: d.imageHint})),
  },
  '10': {
    id: '10',
    name: 'App Icon Design',
    generalDescription: 'Memorable and scalable app icons for iOS and Android, designed to appeal to a global user base.',
    longDescription: 'Craft a distinctive app icon that stands out on app stores and user devices. We focus on creating visually appealing, recognizable, and platform-compliant icons that reflect your app\'s identity.',
    category: 'UI/UX Design',
    tags: ['app icon', 'ios design', 'android design', 'mobile branding', 'icon set'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'mobile app icon design',
    tiers: [
      { name: 'Standard', price: 3999, deliveryTimeMin: 2, deliveryTimeMax: 4, deliveryTimeUnit: 'days', scope: ['2 App icon concepts', 'Vector source file (SVG)', 'Required app store sizes'], tierDescription: 'Professional app icon design with multiple concepts.', iconName: 'Star' },
      { name: 'Premium', price: 6999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['4 App icon concepts', 'Full icon set (e.g., notification, settings)', 'Vector source files (SVG, AI)', 'App store preview mockups'], tierDescription: 'Comprehensive icon design package with additional assets.', iconName: 'Zap' },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Icon Design') || d.specialties.includes('App Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*35)+12, imageHint: d.imageHint})),
  },
  '11': {
    id: '11',
    name: 'E-commerce Product Photography Editing',
    generalDescription: 'Professional editing and retouching for e-commerce product photos, suitable for online marketplaces.',
    longDescription: 'Enhance your product images to meet platform standards. Services include background removal, color correction, retouching, and creating appealing visuals that drive sales.',
    category: 'Photography',
    tags: ['photo retouching', 'background removal', 'image editing', 'product photography'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'fashion product photo editing',
    tiers: [
      { name: 'Basic', price: 1999, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'days', scope: ['Up to 10 images', 'Background removal/replacement', 'Basic color correction'], tierDescription: 'Essential editing for clean product photos.', iconName: 'Shield' },
      { name: 'Standard', price: 4999, deliveryTimeMin: 2, deliveryTimeMax: 4, deliveryTimeUnit: 'days', scope: ['Up to 25 images', 'Advanced retouching', 'Color correction & enhancement', 'Shadow creation'], tierDescription: 'Comprehensive editing for high-quality e-commerce listings.', iconName: 'Star' },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Photography') || d.specialties.includes('Photo Editing')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.6, projectsCompleted: Math.floor(Math.random()*100)+40, imageHint: d.imageHint})),
  },
  '12': {
    id: '12',
    name: 'Infographic Design',
    generalDescription: 'Visually compelling infographics to present data and information clearly.',
    longDescription: 'Transform complex data and information into engaging and easy-to-understand infographics. We design custom graphics, charts, and layouts that effectively communicate your message for reports, social media, or presentations.',
    category: 'Illustration',
    tags: ['data visualization', 'report design', 'visual content', 'content marketing'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'data infographic design',
    tiers: [
      { name: 'Standard', price: 6999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['1 Infographic (up to 5 data points)', 'Custom design', 'Source file (AI/EPS)'], tierDescription: 'Professionally designed infographic for clear data presentation.', iconName: 'Star' },
      { name: 'Premium', price: 11999, deliveryTimeMin: 6, deliveryTimeMax: 9, deliveryTimeUnit: 'days', scope: ['1 Detailed Infographic (up to 10 data points)', 'Custom illustration & icons', 'Multiple formats (web & print)', 'Source file & commercial use'], tierDescription: 'Highly detailed and custom-illustrated infographic for maximum impact.', iconName: 'Zap' },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Illustration') || d.specialties.includes('Data Visualization')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*20)+8, imageHint: d.imageHint})),
  },
};

interface PageProps {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server-side data fetching function
async function getServiceData(id: string): Promise<ServiceDetailData | null> {
  // In a real app, this would fetch from your DB.
  // For this mock setup, we simulate an async operation.
  await new Promise(resolve => setTimeout(resolve, 0));
  return serviceDetailsData[id] || null;
}

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
