
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users, Shield, Zap, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Icon } from 'lucide-react';

interface ServiceTierDetail {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
  deliveryTime: string;
  scope: string[];
  tierDescription?: string;
  icon: Icon;
}

interface ServiceDetail {
  id: string;
  name: string;
  generalDescription: string; 
  longDescription: string;
  category: string;
  imageUrl: string;
  imageHint: string;
  tiers: ServiceTierDetail[];
  approvedDesigners: Array<{ 
    id: string; 
    name: string; 
    avatarUrl: string; 
    rating: number; 
    projectsCompleted: number; 
    imageHint: string; 
  }>;
}

const serviceDetailsData: { [key: string]: ServiceDetail } = {
  '1': {
    id: '1',
    name: 'Modern Logo Design',
    generalDescription: 'Get a unique and memorable logo for your brand that resonates with your target audience.',
    longDescription: 'Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness. Each tier offers a different level of complexity and deliverables to match your needs.',
    category: 'Logo Design',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'modern logo showcase',
    tiers: [
      { 
        name: 'Basic', 
        price: 99, 
        deliveryTime: '3-5 Business Days', 
        scope: ['1 Initial concept', '2 Rounds of revisions', 'Basic vector files (SVG, PNG)'],
        tierDescription: 'A great starting point for new brands or simple logo needs.',
        icon: Shield,
      },
      { 
        name: 'Standard', 
        price: 199, 
        deliveryTime: '5-7 Business Days', 
        scope: ['3 Initial concepts', '3 Rounds of revisions', 'Full vector files (AI, EPS, SVG, PNG, JPG)', 'Basic brand guide (colors, fonts)'],
        tierDescription: 'Our most popular option, offering a comprehensive logo package.',
        icon: Star,
      },
      { 
        name: 'Premium', 
        price: 299, 
        deliveryTime: '7-10 Business Days', 
        scope: ['5 Initial concepts', 'Unlimited revisions', 'Full vector & source files', 'Detailed brand guidelines', 'Social media kit'],
        tierDescription: 'For businesses needing an extensive branding solution and maximum flexibility.',
        icon: Zap,
      },
    ],
    approvedDesigners: [
      { id: 'd1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.9, projectsCompleted: 120, imageHint: 'designer portrait' },
      { id: 'd2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.8, projectsCompleted: 95, imageHint: 'designer portrait' },
    ],
  },
  '2': {
    id: '2',
    name: 'Social Media Post Pack',
    generalDescription: 'Engaging posts designed for your social media channels.',
    longDescription: 'Boost your online presence with professionally designed social media posts tailored to your brand and campaign goals. We provide source files and high-resolution images ready for publishing across various platforms.',
    category: 'Social Media',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'social media campaign',
    tiers: [
      { 
        name: 'Basic', 
        price: 49, 
        deliveryTime: '2-3 Business Days', 
        scope: ['5 social media posts', '1 Platform choice', '1 Round of revisions', 'Optimized JPG/PNG'],
        tierDescription: 'Perfect for a quick boost or testing new content.',
        icon: Shield,
      },
      { 
        name: 'Standard', 
        price: 99, 
        deliveryTime: '3-5 Business Days', 
        scope: ['10 social media posts', 'Up to 2 platforms', '2 Rounds of revisions', 'Source files (PSD or Figma)'],
        tierDescription: 'A balanced pack for consistent social media engagement.',
        icon: Star,
      },
    ],
    approvedDesigners: [
       { id: 'd3', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', rating: 5.0, projectsCompleted: 200, imageHint: 'designer portrait' },
    ],
  },
  '3': {
    id: '3',
    name: 'Professional Brochure Design',
    generalDescription: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.',
    longDescription: 'Comprehensive brochure design including concept, layout, and print-ready files. We work with you to create a compelling narrative and visual style that captures attention.',
    category: 'Print Design',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'corporate brochure',
    tiers: [
        { 
            name: 'Standard', 
            price: 249, 
            deliveryTime: '7-10 Business Days', 
            scope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included (up to 3 images)', '3 revision rounds', 'Print-ready PDF'],
            tierDescription: 'High-quality brochure design for marketing and events.',
            icon: Star,
        },
        { 
            name: 'Premium', 
            price: 349, 
            deliveryTime: '10-14 Business Days', 
            scope: ['Custom brochure design (up to 12 panels)', 'Premium stock imagery (up to 5 images)', '5 revision rounds', 'Print-ready PDF & source files', 'Copywriting suggestions (up to 200 words)'],
            tierDescription: 'Comprehensive brochure package with more content and features.',
            icon: Zap,
        },
    ],
    approvedDesigners: [],
  },
   '4': {
    id: '4',
    name: 'UI/UX Web Design Mockup',
    generalDescription: 'High-fidelity mockup for one key page of your website or app.',
    longDescription: 'Detailed UI/UX design for a single, critical page, including wireframes, mockups, and a style guide for key elements. Ideal for presentations or developer handoff. We focus on user-centric design principles.',
    category: 'UI/UX Design',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'app interface design',
    tiers: [
        { 
            name: 'Standard', 
            price: 399, 
            deliveryTime: '10-14 Business Days', 
            scope: ['1 page UI/UX design (e.g., Homepage or Product Page)', 'Mobile and desktop views', '2 revision rounds', 'Figma/XD source file'],
            tierDescription: 'Essential page design to visualize your web project.',
            icon: Star,
        },
        { 
            name: 'Premium', 
            price: 599, 
            deliveryTime: '14-21 Business Days', 
            scope: ['Up to 3 key pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype (clickable)', '3 revision rounds', 'Component style guide', 'Figma/XD source files'],
            tierDescription: 'A more complete UI/UX package for core application flow.',
            icon: Zap,
        },
    ],
    approvedDesigners: [
      { id: 'd1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.9, projectsCompleted: 120, imageHint: 'designer portrait' },
    ],
  },
  '5': {
    id: '5',
    name: 'Custom Illustration',
    generalDescription: 'Unique vector or raster illustration based on your brief.',
    longDescription: 'From simple icons to complex scenes, get custom illustrations in your desired style. Perfect for websites, marketing materials, or personal projects. We bring your ideas to life visually.',
    category: 'Illustration',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'fantasy illustration',
    tiers: [
        { 
            name: 'Basic', 
            price: 79, 
            deliveryTime: '3-5 Business Days', 
            scope: ['1 simple icon or spot illustration', 'Limited detail', '2 revision rounds', 'PNG/JPG output'],
            tierDescription: 'For small, simple illustration needs.',
            icon: Shield,
        },
        { 
            name: 'Standard', 
            price: 149, 
            deliveryTime: '5-8 Business Days', 
            scope: ['1 custom illustration (e.g., character, small scene)', 'Medium detail', '3 revision rounds', 'Source file (AI, PSD, or other)', 'Commercial use license'],
            tierDescription: 'Versatile illustration for most common uses.',
            icon: Star,
        },
        { 
            name: 'Premium', 
            price: 249, 
            deliveryTime: '7-12 Business Days', 
            scope: ['1 complex illustration (e.g., detailed scene, multiple characters)', 'High detail and complexity', '5 revision rounds', 'Source file & all formats', 'Enhanced commercial use license'],
            tierDescription: 'For high-impact, detailed illustrative work.',
            icon: Zap,
        },
    ],
    approvedDesigners: [],
  },
  '6': {
    id: '6',
    name: 'Packaging Design Concept',
    generalDescription: 'Creative packaging concept for your product.',
    longDescription: 'Develop a unique and attractive packaging design concept that makes your product stand out. Includes mockups and initial dieline considerations to help visualize the final product.',
    category: 'Packaging',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'luxury product box',
    tiers: [
        { 
            name: 'Standard', 
            price: 299, 
            deliveryTime: '8-12 Business Days', 
            scope: ['1 packaging concept (e.g., box, label)', '2D mockups', 'Basic dieline sketch', 'Color palette and typography suggestions', '2 revision rounds'],
            tierDescription: 'Solid packaging concept to get you started.',
            icon: Star,
        },
        { 
            name: 'Premium', 
            price: 499, 
            deliveryTime: '12-18 Business Days', 
            scope: ['Up to 2 packaging concepts or 1 complex concept', '3D mockups', 'Detailed dieline sketch', 'Full branding elements integration', 'Print-ready file preparation advice', '3 revision rounds'],
            tierDescription: 'Comprehensive packaging design for market-ready products.',
            icon: Zap,
        },
    ],
    approvedDesigners: [
      { id: 'd2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.8, projectsCompleted: 95, imageHint: 'designer portrait' },
    ],
  },
   '7': {
    id: '7',
    name: 'Basic Logo Sketch',
    generalDescription: 'Quick logo sketches for initial ideas.',
    longDescription: 'Get 3-5 rough logo sketches to explore initial concepts and directions for your brand identity. This is a great starting point for brainstorming and refining your vision before committing to a full design.',
    category: 'Logo Design',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'pencil sketch logo',
    tiers: [
        { 
            name: 'Basic', 
            price: 49, 
            deliveryTime: '1-2 Business Days', 
            scope: ['3-5 rough logo sketches (digital)', 'Delivered as JPG/PNG', '1 round of feedback for minor sketch adjustments'],
            tierDescription: 'Rapidly explore initial logo ideas.',
            icon: Shield,
        },
    ],
    approvedDesigners: [],
  },
};


export default function ServiceDetailPage({ params }: { params: { serviceId: string } }) {
  const service = serviceDetailsData[params.serviceId]; 

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
  
  // Determine the default tab, e.g., 'Standard' if available, otherwise the first tier.
  const defaultTierValue = service.tiers.find(t => t.name === 'Standard')?.name.toLowerCase() || service.tiers[0]?.name.toLowerCase();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-8">
              <Image 
                src={service.imageUrl} 
                alt={service.name} 
                fill={true}
                style={{objectFit: "cover"}}
                data-ai-hint={service.imageHint}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 sm:mb-0">{service.name}</h1>
              <Badge variant="outline" className="text-sm">{service.category}</Badge>
            </div>
            <p className="text-muted-foreground text-lg mb-6">{service.generalDescription}</p>
            
            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold font-headline mb-4">Service Details</h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line mb-6">{service.longDescription}</p>

            <Tabs defaultValue={defaultTierValue} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
                {service.tiers.map(tier => (
                  <TabsTrigger key={tier.name} value={tier.name.toLowerCase()} className="text-base py-3">
                    <tier.icon className="mr-2 h-5 w-5" />
                    {tier.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {service.tiers.map(tier => (
                <TabsContent key={tier.name} value={tier.name.toLowerCase()}>
                  <Card className="border-none shadow-none"> {/* Or apply subtle styling */}
                    <CardHeader className="px-1 py-2">
                       <div className="flex justify-between items-center">
                         <CardTitle className="font-headline text-2xl">{tier.name} Package</CardTitle>
                         <p className="text-3xl font-bold text-primary">${tier.price}</p>
                       </div>
                       {tier.tierDescription && <p className="text-muted-foreground pt-1">{tier.tierDescription}</p>}
                    </CardHeader>
                    <CardContent className="px-1 py-2">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                          Estimated Delivery: {tier.deliveryTime}
                        </h3>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">What&apos;s Included:</h3>
                      <ul className="space-y-2.5">
                        {tier.scope.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                       <Button size="lg" className="w-full mt-8">
                         <ShoppingCart className="mr-2 h-5 w-5" /> Order {tier.name} Tier
                       </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {/* The main price and order button are now part of the Tabs content per tier */}
            {/* This Card can be used for other summary info or "Why Choose Us" etc. */}
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                 <CardTitle className="font-headline text-xl">Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                 <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Quality Assured Designers</p>
                 <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Transparent Pricing & Scope</p>
                 <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Streamlined Process</p>
                 <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Secure Payments</p>
                <Button variant="outline" className="w-full mt-4">
                  <MessageSquare className="mr-2 h-5 w-5" /> Contact Us
                </Button>
              </CardContent>
            </Card>

            {service.approvedDesigners && service.approvedDesigners.length > 0 && (
              <Card className="mt-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary"/>
                    Approved Designers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.approvedDesigners.map(designer => (
                    <div key={designer.id} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-md">
                      <Avatar>
                        <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.imageHint} />
                        <AvatarFallback>{designer.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{designer.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" /> {designer.rating} ({designer.projectsCompleted} projects)
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2">You can choose a preferred designer during checkout, or let our system assign the best fit for your project.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
