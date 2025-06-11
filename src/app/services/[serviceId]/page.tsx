
"use client";

import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users, Shield, Zap, Clock, Package, Tag, Icon as LucideIcon, Tags, IndianRupee, Camera, Film, Presentation } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation'; 
import { useToast } from "@/hooks/use-toast";
import { designersData } from '@/lib/designer-data';

interface ServiceTierDetail {
  name: 'Basic' | 'Standard' | 'Premium'; 
  price: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTimeUnit: 'days' | 'business_days' | 'weeks';
  scope: string[];
  tierDescription?: string;
  icon: LucideIconType; 
}

interface ApprovedDesigner {
  id: string; 
  slug: string; 
  name: string;
  avatarUrl: string;
  rating: number;
  projectsCompleted: number;
  imageHint: string;
}

interface ServiceDetail {
  id: string;
  name: string;
  generalDescription: string;
  longDescription: string;
  category: string;
  tags?: string[];
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTierDetail[];
  approvedDesigners: ApprovedDesigner[];
}

const serviceDetailsData: { [key: string]: ServiceDetail } = {
  '1': {
    id: '1',
    name: 'Modern Logo Design',
    generalDescription: 'Get a unique and memorable logo for your brand that resonates with your target audience.',
    longDescription: 'Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness for Indian and global brands. Each tier offers a different level of complexity and deliverables to match your needs, from essential concepts to comprehensive brand assets. We work closely with you to understand your vision and translate it into a powerful visual identity.',
    category: 'Logo Design',
    tags: ['branding', 'minimalist', 'vector', 'startup india', 'brand identity'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'modern logo for indian startup',
    tiers: [
      {
        name: 'Basic', price: 4999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['1 Initial concept (culturally adapted)', '2 Rounds of revisions', 'Basic vector files (SVG, PNG)'],
        tierDescription: 'A great starting point for new Indian brands or simple logo needs. Get a foundational logo quickly and efficiently.',
        icon: Shield,
      },
      {
        name: 'Standard', price: 9999, deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'days',
        scope: ['3 Initial concepts (with Indian aesthetic options)', '3 Rounds of revisions', 'Full vector files (AI, EPS, SVG, PNG, JPG)', 'Basic brand guide (colors, fonts)'],
        tierDescription: 'Our most popular option, offering a comprehensive logo package with more choices and branding elements relevant to the Indian context.',
        icon: Star,
      },
      {
        name: 'Premium', price: 14999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days',
        scope: ['5 Initial concepts (diverse styles)', 'Unlimited revisions', 'Full vector & source files', 'Detailed brand guidelines', 'Social media kit for Indian platforms'],
        tierDescription: 'For businesses needing an extensive branding solution, maximum flexibility, and additional assets for the Indian market.',
        icon: Zap,
      },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Logo Design') || d.specialties.includes('Branding')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*50)+20, imageHint: d.imageHint})),
  },
  '2': {
    id: '2',
    name: 'Social Media Pack',
    generalDescription: 'Engaging posts designed for your social media channels, optimized for Indian audiences and festive seasons.',
    longDescription: 'Boost your online presence with professionally designed social media posts tailored to your brand and campaign goals in India. We provide source files and high-resolution images ready for publishing across platforms like Instagram, Facebook, and regional social media. Content is optimized for engagement and visual appeal, considering Indian festivals and trends.',
    category: 'Social Media',
    tags: ['instagram india', 'facebook marketing', 'regional content', 'festival posts', 'social media marketing'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'diwali social media post',
    tiers: [
      {
        name: 'Basic', price: 2499, deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'days',
        scope: ['5 social media posts (e.g., for a specific festival)', '1 Platform choice', '1 Round of revisions', 'Optimized JPG/PNG'],
        tierDescription: 'Perfect for a quick boost or testing new content on a single platform for an Indian audience.',
        icon: Shield,
      },
      {
        name: 'Standard', price: 4999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['10 social media posts', 'Up to 2 platforms', '2 Rounds of revisions', 'Source files (PSD or Figma)'],
        tierDescription: 'A balanced pack for consistent social media engagement across multiple platforms targeting India.',
        icon: Star,
      },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Social Media Graphics') || d.specialties.includes('Content Creation')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*80)+30, imageHint: d.imageHint})),
  },
   '3': {
    id: '3',
    name: 'Professional Brochure Design',
    generalDescription: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively to the Indian market.',
    longDescription: 'Comprehensive brochure design including concept, layout, and print-ready files. We work with you to create a compelling narrative and visual style that captures attention and effectively communicates your message in an Indian context. Ideal for marketing materials, event handouts, and informational packets for businesses in India.',
    category: 'Print Design',
    tags: ['brochure india', 'marketing collateral', 'print advertising', 'catalogue design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'indian business brochure',
    tiers: [
        {
            name: 'Standard', price: 7999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days',
            scope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included (up to 3 images)', '3 revision rounds', 'Print-ready PDF'],
            tierDescription: 'High-quality brochure design for marketing and events, covering common formats suitable for Indian businesses.',
            icon: Star,
        },
        {
            name: 'Premium', price: 12999, deliveryTimeMin: 2, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks', 
            scope: ['Custom brochure design (up to 12 panels)', 'Premium stock imagery (up to 5 images)', '5 revision rounds', 'Print-ready PDF & source files', 'Copywriting suggestions (up to 200 words, English/Hindi)'],
            tierDescription: 'Comprehensive brochure package with more content, panels, and added features like bilingual copywriting support.',
            icon: Zap,
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Print Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*40)+15, imageHint: d.imageHint})),
  },
   '4': {
    id: '4',
    name: 'UI/UX Web Design Mockup',
    generalDescription: 'High-fidelity mockup for one key page of your website or app, tailored for Indian users.',
    longDescription: 'Detailed UI/UX design for a single, critical page, including wireframes, mockups, and a style guide for key elements. Ideal for presentations or developer handoff. We focus on user-centric design principles considering the Indian digital landscape to ensure an intuitive and visually appealing experience. Suitable for landing pages, product pages, or core app screens targeting India.',
    category: 'UI/UX Design',
    tags: ['website india', 'app design india', 'mockup', 'figma', 'vernacular', 'landing page design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'indian mobile app ui',
    tiers: [
        {
            name: 'Standard', price: 15999, deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'days',
            scope: ['1 page UI/UX design (e.g., Homepage or Product Page)', 'Mobile and desktop views', '2 revision rounds', 'Figma/XD source file'],
            tierDescription: 'Essential page design to visualize your web project for one key screen, considering Indian user patterns.',
            icon: Star,
        },
        {
            name: 'Premium', price: 23999, deliveryTimeMin: 14, deliveryTimeMax: 21, deliveryTimeUnit: 'days',
            scope: ['Up to 3 key pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype (clickable)', '3 revision rounds', 'Component style guide', 'Figma/XD source files'],
            tierDescription: 'A more complete UI/UX package for core application flow, including multiple screens and an interactive prototype tailored for India.',
            icon: Zap,
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Web UI/UX') || d.specialties.includes('App Design')).slice(0,2).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*60)+25, imageHint: d.imageHint})),
  },
  '5': {
    id: '5',
    name: 'Custom Illustration',
    generalDescription: 'Unique vector or raster illustration based on your brief, with options for Indian cultural themes or modern styles.',
    longDescription: 'From simple icons to complex scenes, get custom illustrations in your desired style. Perfect for websites, marketing materials, or personal projects with an Indian touch. We bring your ideas to life visually, ensuring the illustration aligns with your brand and message. Discuss your style preferences (e.g., Madhubani-inspired, modern flat, detailed Warli) with our designers.',
    category: 'Illustration',
    tags: ['indian art style', 'digital painting', 'character design india', 'cultural illustration', 'vector illustration'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'indian folk art illustration',
    tiers: [
        {
            name: 'Basic', price: 3999, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
            scope: ['1 simple icon or spot illustration (Indian motif optional)', 'Limited detail', '2 revision rounds', 'PNG/JPG output'],
            tierDescription: 'For small, simple illustration needs like icons or minor graphic elements, with an optional Indian flair.',
            icon: Shield,
        },
        {
            name: 'Standard', price: 7999, deliveryTimeMin: 5, deliveryTimeMax: 8, deliveryTimeUnit: 'days',
            scope: ['1 custom illustration (e.g., character, small scene with Indian context)', 'Medium detail', '3 revision rounds', 'Source file (AI, PSD, or other)', 'Commercial use license'],
            tierDescription: 'Versatile illustration for most common uses, like website heroes or blog post graphics, adaptable for Indian themes.',
            icon: Star,
        },
        {
            name: 'Premium', price: 11999, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks', 
            scope: ['1 complex illustration (e.g., detailed scene, multiple characters, Indian festival theme)', 'High detail and complexity', '5 revision rounds', 'Source file & all formats', 'Enhanced commercial use license'],
            tierDescription: 'For high-impact, detailed illustrative work requiring more complexity and refinement, perfect for rich Indian cultural depictions.',
            icon: Zap,
        },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Illustration') || d.specialties.includes('Digital Art')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*30)+10, imageHint: d.imageHint})),
  },
  '6': {
    id: '6',
    name: 'Packaging Design Concept',
    generalDescription: 'Creative packaging concept for your product, designed for the Indian retail landscape.',
    longDescription: 'Develop a unique and attractive packaging design concept that makes your product stand out on Indian shelves. Includes mockups and initial dieline considerations to help visualize the final product. We consider your brand, target audience, and product characteristics to create a compelling packaging solution suitable for India.',
    category: 'Packaging',
    tags: ['product packaging india', 'box design india', 'label design', 'fmcg india', 'sustainable packaging'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'indian spice packaging',
    tiers: [
        {
            name: 'Standard', price: 12999, deliveryTimeMin: 8, deliveryTimeMax: 12, deliveryTimeUnit: 'business_days',
            scope: ['1 packaging concept (e.g., box for mithai, label for pickles)', '2D mockups', 'Basic dieline sketch', 'Color palette and typography suggestions', '2 revision rounds'],
            tierDescription: 'Solid packaging concept to get you started with visualizing your product\'s look for the Indian market.',
            icon: Star,
        },
        {
            name: 'Premium', price: 19999, deliveryTimeMin: 12, deliveryTimeMax: 18, deliveryTimeUnit: 'business_days',
            scope: ['Up to 2 packaging concepts or 1 complex concept', '3D mockups', 'Detailed dieline sketch', 'Full branding elements integration', 'Print-ready file preparation advice', '3 revision rounds'],
            tierDescription: 'Comprehensive packaging design for market-ready products in India, including 3D mockups and more concepts.',
            icon: Zap,
        },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Packaging Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*25)+5, imageHint: d.imageHint})),
  },
   '7': {
    id: '7',
    name: 'Basic Logo Sketch',
    generalDescription: 'Quick logo sketches for initial ideas, with an option for Indian design elements.',
    longDescription: 'Get 3-5 rough logo sketches to explore initial concepts and directions for your brand identity. This is a great starting point for brainstorming and refining your vision before committing to a full design. These are conceptual sketches, not finalized logos, and can incorporate Indian motifs if requested.',
    category: 'Logo Design',
    tags: ['logo sketch india', 'concept design', 'ideation india', 'indian motifs', 'quick design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'indian elephant logo sketch',
    tiers: [
        {
            name: 'Basic', price: 2499, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'days',
            scope: ['3-5 rough logo sketches (digital, Indian elements optional)', 'Delivered as JPG/PNG', '1 round of feedback for minor sketch adjustments'],
            tierDescription: 'Rapidly explore initial logo ideas with a set of quick digital sketches, adaptable for Indian concepts.',
            icon: Shield,
        },
    ],
    approvedDesigners: [],
  },
  '8': {
    id: '8',
    name: 'Animated Explainer Video',
    generalDescription: 'Short animated videos (2D) to explain your product/service, with Hinglish voiceover option.',
    longDescription: 'Engage your audience with a concise and compelling 2D animated explainer video. We cover scriptwriting assistance, storyboarding, animation, and voiceover (English or Hinglish options available). Perfect for product demos, service explanations, or social media campaigns targeting the Indian market.',
    category: 'Motion Graphics',
    tags: ['2d animation', 'marketing video', 'product demo', 'hinglish content', 'video marketing'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'explainer video animation character',
    tiers: [
      { name: 'Standard', price: 19999, deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'weeks', scope: ['Up to 30 seconds animation', 'Custom graphics', 'Background music', 'English voiceover'], tierDescription: 'A short and impactful animated video.', icon: Star },
      { name: 'Premium', price: 34999, deliveryTimeMin: 3, deliveryTimeMax: 4, deliveryTimeUnit: 'weeks', scope: ['Up to 60 seconds animation', 'Custom graphics & characters', 'Background music & sound effects', 'Hinglish/English voiceover', 'Script assistance'], tierDescription: 'A more comprehensive video with enhanced features.', icon: Zap },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Motion Graphics') || d.specialties.includes('Video Editing')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.9, projectsCompleted: Math.floor(Math.random()*15)+5, imageHint: d.imageHint})),
  },
  '9': {
    id: '9',
    name: 'Business Presentation Design',
    generalDescription: 'Professional presentations for Indian businesses, investors, and conferences.',
    longDescription: 'Create impactful and visually appealing presentations that effectively communicate your message. We design custom templates, infographics, and ensure a cohesive visual style. Suitable for pitch decks, sales presentations, and corporate reports tailored for an Indian audience.',
    category: 'Presentations',
    tags: ['pitch deck india', 'corporate presentation', 'powerpoint design', 'investor deck', 'keynote slides'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'business ppt slide data chart',
    tiers: [
      { name: 'Standard', price: 8999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['Up to 15 slides custom design', 'Data visualization (charts/graphs)', 'Stock images included'], tierDescription: 'Professional design for standard presentations.', icon: Star },
      { name: 'Premium', price: 15999, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days', scope: ['Up to 30 slides custom design', 'Advanced data visualization', 'Custom graphics & icons', 'Editable template provided'], tierDescription: 'Comprehensive design for critical presentations.', icon: Zap },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Presentation Design') || d.specialties.includes('Corporate Branding')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*40)+10, imageHint: d.imageHint})),
  },
  '10': {
    id: '10',
    name: 'App Icon Design',
    generalDescription: 'Memorable and scalable app icons for iOS and Android, designed to appeal to the Indian mobile user base.',
    longDescription: 'Craft a distinctive app icon that stands out on app stores and user devices. We focus on creating visually appealing, recognizable, and platform-compliant icons that reflect your app\'s identity and attract Indian users.',
    category: 'UI/UX Design',
    tags: ['app icon', 'ios design', 'android design', 'mobile branding', 'icon set'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'mobile app icon colorful',
    tiers: [
      { name: 'Standard', price: 3999, deliveryTimeMin: 2, deliveryTimeMax: 4, deliveryTimeUnit: 'days', scope: ['2 App icon concepts', 'Vector source file (SVG)', 'Required app store sizes'], tierDescription: 'Professional app icon design with multiple concepts.', icon: Star },
      { name: 'Premium', price: 6999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['4 App icon concepts', 'Full icon set (e.g., notification, settings)', 'Vector source files (SVG, AI)', 'App store preview mockups'], tierDescription: 'Comprehensive icon design package with additional assets.', icon: Zap },
    ],
    approvedDesigners: designersData.filter(d => d.specialties.includes('Icon Design') || d.specialties.includes('App Design')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.8, projectsCompleted: Math.floor(Math.random()*35)+12, imageHint: d.imageHint})),
  },
  '11': {
    id: '11',
    name: 'E-commerce Product Photography Editing',
    generalDescription: 'Professional editing and retouching for e-commerce product photos, suitable for Indian online marketplaces.',
    longDescription: 'Enhance your product images to meet the standards of platforms like Amazon India, Flipkart, Myntra, etc. Services include background removal, color correction, retouching, and creating appealing visuals that drive sales.',
    category: 'Photography',
    tags: ['photo retouching', 'background removal', 'amazon india', 'flipkart', 'image enhancement', 'product photography'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'product photo editing fashion',
    tiers: [
      { name: 'Basic', price: 1999, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'days', scope: ['Up to 10 images', 'Background removal/replacement', 'Basic color correction'], tierDescription: 'Essential editing for clean product photos.', icon: Shield },
      { name: 'Standard', price: 4999, deliveryTimeMin: 2, deliveryTimeMax: 4, deliveryTimeUnit: 'days', scope: ['Up to 25 images', 'Advanced retouching', 'Color correction & enhancement', 'Shadow creation'], tierDescription: 'Comprehensive editing for high-quality e-commerce listings.', icon: Star },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Photography') || d.specialties.includes('Photo Editing')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.6, projectsCompleted: Math.floor(Math.random()*100)+40, imageHint: d.imageHint})),
  },
  '12': {
    id: '12',
    name: 'Infographic Design',
    generalDescription: 'Visually compelling infographics to present data and information clearly for Indian audiences.',
    longDescription: 'Transform complex data and information into engaging and easy-to-understand infographics. We design custom graphics, charts, and layouts that effectively communicate your message for reports, social media, or presentations targeting the Indian market.',
    category: 'Illustration',
    tags: ['data visualization', 'report design', 'visual content', 'content marketing india', 'information design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'data infographic chart india',
    tiers: [
      { name: 'Standard', price: 6999, deliveryTimeMin: 4, deliveryTimeMax: 6, deliveryTimeUnit: 'days', scope: ['1 Infographic (up to 5 data points)', 'Custom design', 'Source file (AI/EPS)'], tierDescription: 'Professionally designed infographic for clear data presentation.', icon: Star },
      { name: 'Premium', price: 11999, deliveryTimeMin: 6, deliveryTimeMax: 9, deliveryTimeUnit: 'days', scope: ['1 Detailed Infographic (up to 10 data points)', 'Custom illustration & icons', 'Multiple formats (web & print)', 'Source file & commercial use'], tierDescription: 'Highly detailed and custom-illustrated infographic for maximum impact.', icon: Zap },
    ],
     approvedDesigners: designersData.filter(d => d.specialties.includes('Illustration') || d.specialties.includes('Data Visualization')).slice(0,1).map(d => ({id: d.id, slug: d.slug, name: d.name, avatarUrl: d.avatarUrl, rating: 4.7, projectsCompleted: Math.floor(Math.random()*20)+8, imageHint: d.imageHint})),
  },
};

function formatStructuredDeliveryTime(min: number, max: number, unit: ServiceTierDetail['deliveryTimeUnit']): string {
  const unitLabel = unit.replace('_', ' '); 
  if (min === max) {
    return `${min} ${unitLabel}${min > 1 && unit !== 'weeks' ? 's' : ''}`; 
  }
  return `${min}-${max} ${unitLabel}${max > 1 && unit !== 'weeks' ? 's' : ''}`; 
}


export default function ServiceDetailPage() {
  const routeParams = useParams<{ serviceId: string }>(); 
  const serviceId = routeParams?.serviceId;
  const router = useRouter();
  const { toast } = useToast(); 

  const [service, setService] = useState<ServiceDetail | null | undefined>(undefined); 
  const [selectedTierName, setSelectedTierName] = useState<string>('');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serviceId) {
      const serviceData = serviceDetailsData[serviceId];
      setService(serviceData || null);
      if (serviceData) {
        const defaultTier = serviceData.tiers.find(t => t.name === 'Standard')?.name || (serviceData.tiers.length > 0 ? serviceData.tiers[0].name : '');
        setSelectedTierName(defaultTier);
      } else {
        setSelectedTierName('');
      }
    } else {
      setService(undefined); 
      setSelectedTierName('');
    }
  }, [serviceId]);


  const selectedTierDetails = service?.tiers.find(t => t.name === selectedTierName);

  const handleScrollToTabs = () => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTierChange = (value: string) => {
    setSelectedTierName(value);
  };

  const handleOrderTier = (tier: ServiceTierDetail) => {
    if (!service) return;
    console.log("Ordering tier:", tier.name, "for service:", service.name);
    toast({
      title: "Added to Cart (Simulated)",
      description: `${service.name} - ${tier.name} tier added to your cart.`,
    });
    router.push('/cart');
  };

  if (service === undefined) {
     return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CategoriesNavbar />
        <main className="flex-grow container mx-auto py-12 px-5 text-center">
          <h1 className="text-2xl font-semibold">Loading service details...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CategoriesNavbar />
        <main className="flex-grow container mx-auto py-12 px-5 text-center">
          <h1 className="text-2xl font-semibold">Service Not Found</h1>
          <p className="text-muted-foreground mt-2">The service you are looking for does not exist or has been moved.</p>
          <Button asChild className="mt-6">
            <Link href="/services">Browse All Services</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  let tabsListGridColsClass = "grid-cols-3"; 
  if (service.tiers.length === 1) {
    tabsListGridColsClass = "grid-cols-1";
  } else if (service.tiers.length === 2) {
    tabsListGridColsClass = "grid-cols-2";
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill={true}
                style={{ objectFit: "cover" }}
                data-ai-hint={service.imageHint}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="outline" className="text-xs py-0.5 px-2 mb-2">
                  <Tag className="mr-1.5 h-3 w-3" />{service.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-headline mb-1">{service.name}</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">{service.generalDescription}</p>

            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <Tags className="h-4 w-4 text-muted-foreground" />
                {service.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}


            <Separator />

            <div ref={tabsRef}>
              <Tabs value={selectedTierName} className="w-full" onValueChange={handleTierChange}>
                <TabsList className={cn("grid w-full mb-6 gap-2", tabsListGridColsClass)}>
                  {service.tiers.map(tier => (
                    <TabsTrigger
                      key={tier.name}
                      value={tier.name}
                      className="py-2.5 text-sm data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/50 whitespace-normal overflow-hidden min-w-0"
                    >
                      <tier.icon className="mr-2 h-5 w-5" />
                      {tier.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {service.tiers.map(tier => (
                  <TabsContent
                    key={tier.name} 
                    value={tier.name}
                  >
                    <Card className="shadow-md border">
                      <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center">
                          <tier.icon className="mr-3 h-7 w-7 text-primary" />
                          {tier.name} Package - <IndianRupee className="inline-block h-6 w-6 ml-1" />{tier.price.toLocaleString('en-IN')}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm pt-1">
                          <Clock className="inline-block mr-1.5 h-4 w-4" />
                          Estimated Delivery: {formatStructuredDeliveryTime(tier.deliveryTimeMin, tier.deliveryTimeMax, tier.deliveryTimeUnit)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {tier.tierDescription && (
                          <p className="text-foreground leading-relaxed">{tier.tierDescription}</p>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-foreground">What&apos;s Included:</h3>
                          <ul className="space-y-2 pl-1">
                            {tier.scope.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                         <Button 
                            size="lg" 
                            className="w-full mt-4"
                            onClick={() => handleOrderTier(tier)}
                          >
                           <ShoppingCart className="mr-2 h-5 w-5" /> Order {tier.name} Tier
                         </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold font-headline mb-3">About This Service</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">{service.longDescription}</p>
            </div>

            {service.approvedDesigners && service.approvedDesigners.length > 0 && (
              <>
                <Separator />
                <Card className="shadow-none border-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="font-headline text-2xl flex items-center">
                      <Users className="mr-3 h-7 w-7 text-primary" />
                      Approved Designers for this Service
                    </CardTitle>
                    <CardDescription>
                      Our skilled designers ready to work on your "{service.name}" project.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.approvedDesigners.map(designer => (
                      <Card key={designer.id} className="p-4 bg-secondary/30 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.imageHint} />
                            <AvatarFallback>{designer.name.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link href={`/designers/${designer.slug}`} className="text-lg font-semibold hover:text-primary hover:underline">
                                {designer.name}
                            </Link>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" /> {designer.rating} ({designer.projectsCompleted} projects)
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                  <CardFooter className="px-0 pt-2">
                    <p className="text-xs text-muted-foreground">You can often choose a preferred designer during checkout, or let our system assign the best fit.</p>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              {selectedTierDetails && (
                 <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center">
                       <selectedTierDetails.icon className="mr-2.5 h-6 w-6 text-primary" />
                      {selectedTierDetails.name} Tier Summary
                    </CardTitle>
                     <CardDescription className="text-2xl font-bold text-primary pt-1"><IndianRupee className="inline-block h-6 w-6 mr-0.5" />{selectedTierDetails.price.toLocaleString('en-IN')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                     <p className="flex items-center text-muted-foreground">
                        <Clock className="inline-block mr-2 h-4 w-4" /> {formatStructuredDeliveryTime(selectedTierDetails.deliveryTimeMin, selectedTierDetails.deliveryTimeMax, selectedTierDetails.deliveryTimeUnit)}
                     </p>
                      {selectedTierDetails.scope.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="flex items-start text-muted-foreground">
                           <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                           <span>{item}</span>
                         </p>
                      ))}
                      {selectedTierDetails.scope.length > 2 && (
                         <p className="flex items-start text-muted-foreground">
                           <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                           <span>And more...</span>
                         </p>
                      )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleScrollToTabs}>
                       Compare All Tiers
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Why Choose DesignFlow?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Expert Indian Designers</p>
                  <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Transparent INR Pricing</p>
                  <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Streamlined Process</p>
                  <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Secure Payments via Razorpay</p>
                  <Button variant="outline" className="w-full mt-4">
                    <MessageSquare className="mr-2 h-5 w-5" /> Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    