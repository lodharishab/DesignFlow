
// No "use client" here
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { designersData } from '@/lib/designer-data';
import { PortfolioPageContent } from './portfolio-page-client'; // Import the new client component
import type { Metadata } from 'next'; // Import Metadata type

// Enhanced Portfolio Data Structure - IMPORTANT: Keep this in sync with other uses
export const allPortfolioItemsData: PortfolioItem[] = [
  {
    id: 'ecomm-reimagined-platform-india',
    title: 'E-commerce Reimagined for Indian Market',
    category: 'Web UI/UX',
    categorySlug: 'web-ui-ux',
    clientName: 'BharatRetail Solutions',
    projectDate: 'July 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'e-commerce website',
    projectDescription: 'Complete overhaul of a multi-vendor e-commerce platform, focusing on vernacular support, streamlined user journey for diverse Indian users, enhanced product discovery for local artisans, and a modern, clean aesthetic. The project involved extensive UX research with Indian user groups.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'website homepage', caption: 'Homepage - Festive Offer' },
      { url: 'https://placehold.co/1200x800.png', hint: 'product page dress', caption: 'Saree Product Detail' },
      { url: 'https://placehold.co/1200x800.png', hint: 'mobile app payment', caption: 'Mobile UPI Checkout Flow' },
    ],
    tags: ['e-commerce', 'ux design', 'ui design', 'vernacular ui', 'figma', 'indian market'],
    designer: designersData.find(d => d.slug === 'priya-sharma'),
  },
  {
    id: 'fintech-mobile-banking-app-india',
    title: 'Digital Rupee Mobile Banking App',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'NayaBank Technologies',
    projectDate: 'May 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'finance app',
    projectDescription: 'Sleek and secure mobile application design for a new-age digital bank in India, focusing on UPI integration and financial literacy tools. Features include intuitive navigation, personalized dashboards, and gamified savings goals. Designed for iOS and Android.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'upi payment screen', caption: 'UPI Transaction' },
      { url: 'https://placehold.co/1200x800.png', hint: 'investment app dashboard', caption: 'Mutual Fund Dashboard' },
    ],
    tags: ['mobile app', 'fintech', 'upi', 'ios', 'android', 'financial literacy'],
    designer: designersData.find(d => d.slug === 'rohan-kapoor'),
  },
  {
    id: 'eco-startup-brand-identity-india',
    title: 'Sustainable Indian Lifestyle Brand Identity',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'Prakriti Living',
    projectDate: 'April 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'sustainable brand logo',
    projectDescription: 'Complete brand identity package for an eco-conscious Indian lifestyle startup, including logo, color palette inspired by Indian nature, typography, and brand guidelines. The identity aims to convey sustainability, tradition, and trustworthiness.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'packaging design', caption: 'Eco-friendly Product Packaging' },
      { url: 'https://placehold.co/1200x800.png', hint: 'brand guidelines motif', caption: 'Brand Guidelines with Paisley Motif' },
    ],
    tags: ['branding', 'logo design', 'sustainability', 'indian motif', 'startup'],
    designer: designersData.find(d => d.slug === 'aisha-khan'),
  },
  {
    id: 'artisanal-cafe-print-suite-jaipur',
    title: 'Jaipur Cafe Print & Menu Design',
    category: 'Print Design',
    categorySlug: 'print-design',
    clientName: 'Chaiwala Cafe Jaipur',
    projectDate: 'March 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'cafe menu design',
    projectDescription: 'A cohesive set of print materials for a local artisanal cafe in Jaipur, including menus with Rajasthani design elements, loyalty cards, and promotional flyers, reflecting a rustic yet modern brand aesthetic.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'menu design art', caption: 'Menu with Rajasthani Motifs' },
    ],
    tags: ['print design', 'menu design', 'cafe branding', 'jaipur', 'rajasthani art'],
    designer: designersData.find(d => d.slug === 'vikram-singh'),
  },
  {
    id: 'childrens-book-indian-mythology',
    title: 'Illustrations for "Tales of Krishna"',
    category: 'Illustration',
    categorySlug: 'illustration',
    clientName: 'Bal Sahitya Prakashan',
    projectDate: 'June 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'krishna illustration',
    projectDescription: 'A series of enchanting illustrations for a children\'s storybook based on Indian mythology, featuring vibrant characters like Krishna and Radha, and imaginative scenes. The style is playful and engaging for young Indian readers.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'mythology art children', caption: 'Krishna and Gopis' },
      { url: 'https://placehold.co/1200x800.png', hint: 'storybook art ganesha', caption: 'Baby Ganesha Scene' },
    ],
    tags: ['illustration', 'childrens book', 'indian mythology', 'krishna', 'digital art'],
    designer: designersData.find(d => d.slug === 'arjun-mehta'),
  },
  {
    id: 'sustainable-cosmetics-packaging-ayurveda',
    title: 'Ayurvedic Cosmetics Packaging Design',
    category: 'Packaging Design',
    categorySlug: 'packaging-design',
    clientName: 'Veda Organics',
    projectDate: 'February 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'ayurvedic product package',
    projectDescription: 'A line of eco-friendly and visually appealing packaging designs for an organic Ayurvedic cosmetics brand. The design emphasizes natural ingredients, traditional Indian patterns, and minimalist luxury.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'beauty product label', caption: 'Herbal Face Wash Label' },
    ],
    tags: ['packaging design', 'cosmetics', 'ayurveda', 'sustainability', 'indian patterns'],
    designer: designersData.find(d => d.slug === 'neha-joshi'),
  },
  {
    id: 'tech-conference-motion-graphics-bangalore',
    title: 'Bangalore Tech Summit Opener',
    category: 'Animation & Motion',
    categorySlug: 'animation-motion',
    clientName: 'Innovate India Summit',
    projectDate: 'January 2024',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'tech event motion',
    projectDescription: 'Dynamic motion graphics package for a major tech conference in Bangalore, including an event opener, speaker intros, and lower thirds. The style is futuristic, energetic, and incorporates subtle Indian tech motifs.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'conference intro animation', caption: 'Main Title Animation Sequence' },
    ],
    tags: ['motion graphics', 'animation', 'event branding', 'after effects', 'bangalore tech'],
    designer: designersData.find(d => d.slug === 'aisha-khan'),
  },
   {
    id: 'corporate-pitch-deck-redesign-mumbai',
    title: 'Mumbai Fintech Investor Pitch Deck',
    category: 'Presentation Design',
    categorySlug: 'presentation-design',
    clientName: 'Paisa Growth Capital',
    projectDate: 'December 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'financial presentation',
    projectDescription: 'A complete redesign of a corporate investor pitch deck for a Mumbai-based fintech startup, focusing on clear data visualization of Indian market opportunities, compelling storytelling, and a professional, modern aesthetic to secure funding.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'market growth chart', caption: 'Market Growth Projection Chart' },
      { url: 'https://placehold.co/1200x800.png', hint: 'startup team slide', caption: 'Founding Team Introduction' },
    ],
    tags: ['presentation design', 'pitch deck', 'fintech india', 'powerpoint', 'corporate'],
    designer: designersData.find(d => d.slug === 'vikram-singh'),
  },
  {
    id: 'yoga-studio-branding-rishikesh',
    title: 'Rishikesh Yoga Studio Branding',
    category: 'Logo & Branding',
    categorySlug: 'logo-branding',
    clientName: 'Ananda Yoga Shala',
    projectDate: 'August 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'yoga logo',
    projectDescription: 'Branding package for a new yoga studio in Rishikesh, including logo design with a meditative feel, color palette reflecting the Ganges, and social media templates. Focus on tranquility and spiritual wellness.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'meditation app icon', caption: 'Logo & App Icon' },
      { url: 'https://placehold.co/1200x800.png', hint: 'yoga class poster', caption: 'Promotional Poster' },
    ],
    tags: ['branding', 'logo design', 'yoga', 'wellness', 'rishikesh', 'spiritual'],
    designer: designersData.find(d => d.slug === 'priya-sharma'),
  },
  {
    id: 'food-delivery-app-ui-pune',
    title: 'Pune Food Delivery App UI',
    category: 'App Design',
    categorySlug: 'app-design',
    clientName: 'Swad Connect',
    projectDate: 'September 2023',
    coverImageUrl: 'https://placehold.co/600x450.png',
    coverImageHint: 'food app ui',
    projectDescription: 'User interface design for a food delivery application targeting Pune, focusing on ease of use, quick order placement, and vibrant visuals of Indian cuisine. Included restaurant listing, menu browsing, and checkout flow.',
    galleryImages: [
      { url: 'https://placehold.co/1200x800.png', hint: 'restaurant menu screen', caption: 'Restaurant Menu Screen' },
      { url: 'https://placehold.co/1200x800.png', hint: 'order tracking map', caption: 'Live Order Tracking' },
    ],
    tags: ['mobile app', 'ui design', 'food delivery', 'pune', 'indian cuisine'],
    designer: designersData.find(d => d.slug === 'sunita-reddy'),
  }
];

// // Re-enable metadata export - TEMPORARILY COMMENTED OUT
// export const metadata: Metadata = {
//   title: 'Design Portfolio | DesignFlow',
//   description: 'Explore a curated collection of stunning design projects by talented designers on DesignFlow. Get inspired for your next creative endeavor.',
//   openGraph: {
//     title: 'Design Portfolio Showcase | DesignFlow',
//     description: 'Discover exceptional design work across various categories, from branding to UI/UX, crafted by our expert designers.',
//   },
// };

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
