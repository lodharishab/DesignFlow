
"use client";

import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users, Shield, Zap, Clock, Package, Tag, Icon as LucideIcon, Tags } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation'; 
import { useToast } from "@/hooks/use-toast";

interface ServiceTierDetail {
  name: 'Basic' | 'Standard' | 'Premium'; 
  price: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTimeUnit: 'days' | 'business_days' | 'weeks';
  scope: string[];
  tierDescription?: string;
  icon: LucideIcon; 
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
    longDescription: 'Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness. Each tier offers a different level of complexity and deliverables to match your needs, from essential concepts to comprehensive brand assets. We work closely with you to understand your vision and translate it into a powerful visual identity.',
    category: 'Logo Design',
    tags: ['branding', 'minimalist', 'vector', 'identity'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'modern logo showcase',
    tiers: [
      {
        name: 'Basic', price: 99, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['1 Initial concept', '2 Rounds of revisions', 'Basic vector files (SVG, PNG)'],
        tierDescription: 'A great starting point for new brands or simple logo needs. Get a foundational logo quickly and efficiently.',
        icon: Shield,
      },
      {
        name: 'Standard', price: 199, deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'days',
        scope: ['3 Initial concepts', '3 Rounds of revisions', 'Full vector files (AI, EPS, SVG, PNG, JPG)', 'Basic brand guide (colors, fonts)'],
        tierDescription: 'Our most popular option, offering a comprehensive logo package with more choices and branding elements.',
        icon: Star,
      },
      {
        name: 'Premium', price: 299, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days',
        scope: ['5 Initial concepts', 'Unlimited revisions', 'Full vector & source files', 'Detailed brand guidelines', 'Social media kit'],
        tierDescription: 'For businesses needing an extensive branding solution, maximum flexibility, and additional assets.',
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
    longDescription: 'Boost your online presence with professionally designed social media posts tailored to your brand and campaign goals. We provide source files and high-resolution images ready for publishing across various platforms. Content is optimized for engagement and visual appeal.',
    category: 'Social Media',
    tags: ['instagram', 'facebook', 'twitter', 'content'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'social media campaign',
    tiers: [
      {
        name: 'Basic', price: 49, deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'days',
        scope: ['5 social media posts', '1 Platform choice', '1 Round of revisions', 'Optimized JPG/PNG'],
        tierDescription: 'Perfect for a quick boost or testing new content on a single platform.',
        icon: Shield,
      },
      {
        name: 'Standard', price: 99, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
        scope: ['10 social media posts', 'Up to 2 platforms', '2 Rounds of revisions', 'Source files (PSD or Figma)'],
        tierDescription: 'A balanced pack for consistent social media engagement across multiple platforms.',
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
    longDescription: 'Comprehensive brochure design including concept, layout, and print-ready files. We work with you to create a compelling narrative and visual style that captures attention and effectively communicates your message. Ideal for marketing materials, event handouts, and informational packets.',
    category: 'Print Design',
    tags: ['brochure', 'flyer', 'marketing material'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'corporate brochure',
    tiers: [
        {
            name: 'Standard', price: 249, deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days',
            scope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included (up to 3 images)', '3 revision rounds', 'Print-ready PDF'],
            tierDescription: 'High-quality brochure design for marketing and events, covering common formats.',
            icon: Star,
        },
        {
            name: 'Premium', price: 349, deliveryTimeMin: 2, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks', 
            scope: ['Custom brochure design (up to 12 panels)', 'Premium stock imagery (up to 5 images)', '5 revision rounds', 'Print-ready PDF & source files', 'Copywriting suggestions (up to 200 words)'],
            tierDescription: 'Comprehensive brochure package with more content, panels, and added features like copywriting support.',
            icon: Zap,
        },
    ],
    approvedDesigners: [],
  },
   '4': {
    id: '4',
    name: 'UI/UX Web Design Mockup',
    generalDescription: 'High-fidelity mockup for one key page of your website or app.',
    longDescription: 'Detailed UI/UX design for a single, critical page, including wireframes, mockups, and a style guide for key elements. Ideal for presentations or developer handoff. We focus on user-centric design principles to ensure an intuitive and visually appealing experience. Suitable for landing pages, product pages, or core app screens.',
    category: 'UI/UX Design',
    tags: ['website', 'app design', 'mockup', 'figma'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'app interface design',
    tiers: [
        {
            name: 'Standard', price: 399, deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'days',
            scope: ['1 page UI/UX design (e.g., Homepage or Product Page)', 'Mobile and desktop views', '2 revision rounds', 'Figma/XD source file'],
            tierDescription: 'Essential page design to visualize your web project for one key screen.',
            icon: Star,
        },
        {
            name: 'Premium', price: 599, deliveryTimeMin: 14, deliveryTimeMax: 21, deliveryTimeUnit: 'days',
            scope: ['Up to 3 key pages UI/UX design', 'Mobile, tablet, and desktop views', 'Interactive prototype (clickable)', '3 revision rounds', 'Component style guide', 'Figma/XD source files'],
            tierDescription: 'A more complete UI/UX package for core application flow, including multiple screens and an interactive prototype.',
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
    longDescription: 'From simple icons to complex scenes, get custom illustrations in your desired style. Perfect for websites, marketing materials, or personal projects. We bring your ideas to life visually, ensuring the illustration aligns with your brand and message. Discuss your style preferences (e.g., flat, detailed, cartoonish, realistic) with our designers.',
    category: 'Illustration',
    tags: ['vector art', 'digital painting', 'character'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'fantasy illustration',
    tiers: [
        {
            name: 'Basic', price: 79, deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days',
            scope: ['1 simple icon or spot illustration', 'Limited detail', '2 revision rounds', 'PNG/JPG output'],
            tierDescription: 'For small, simple illustration needs like icons or minor graphic elements.',
            icon: Shield,
        },
        {
            name: 'Standard', price: 149, deliveryTimeMin: 5, deliveryTimeMax: 8, deliveryTimeUnit: 'days',
            scope: ['1 custom illustration (e.g., character, small scene)', 'Medium detail', '3 revision rounds', 'Source file (AI, PSD, or other)', 'Commercial use license'],
            tierDescription: 'Versatile illustration for most common uses, like website heroes or blog post graphics.',
            icon: Star,
        },
        {
            name: 'Premium', price: 249, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'weeks', 
            scope: ['1 complex illustration (e.g., detailed scene, multiple characters)', 'High detail and complexity', '5 revision rounds', 'Source file & all formats', 'Enhanced commercial use license'],
            tierDescription: 'For high-impact, detailed illustrative work requiring more complexity and refinement.',
            icon: Zap,
        },
    ],
    approvedDesigners: [],
  },
  '6': {
    id: '6',
    name: 'Packaging Design Concept',
    generalDescription: 'Creative packaging concept for your product.',
    longDescription: 'Develop a unique and attractive packaging design concept that makes your product stand out. Includes mockups and initial dieline considerations to help visualize the final product. We consider your brand, target audience, and product characteristics to create a compelling packaging solution.',
    category: 'Packaging',
    tags: ['product packaging', 'box design', 'label design'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'luxury product box',
    tiers: [
        {
            name: 'Standard', price: 299, deliveryTimeMin: 8, deliveryTimeMax: 12, deliveryTimeUnit: 'business_days',
            scope: ['1 packaging concept (e.g., box, label)', '2D mockups', 'Basic dieline sketch', 'Color palette and typography suggestions', '2 revision rounds'],
            tierDescription: 'Solid packaging concept to get you started with visualizing your product\'s look.',
            icon: Star,
        },
        {
            name: 'Premium', price: 499, deliveryTimeMin: 12, deliveryTimeMax: 18, deliveryTimeUnit: 'business_days',
            scope: ['Up to 2 packaging concepts or 1 complex concept', '3D mockups', 'Detailed dieline sketch', 'Full branding elements integration', 'Print-ready file preparation advice', '3 revision rounds'],
            tierDescription: 'Comprehensive packaging design for market-ready products, including 3D mockups and more concepts.',
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
    longDescription: 'Get 3-5 rough logo sketches to explore initial concepts and directions for your brand identity. This is a great starting point for brainstorming and refining your vision before committing to a full design. These are conceptual sketches, not finalized logos.',
    category: 'Logo Design',
    tags: ['logo sketch', 'concept', 'ideation'],
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'pencil sketch logo',
    tiers: [
        {
            name: 'Basic', price: 49, deliveryTimeMin: 1, deliveryTimeMax: 2, deliveryTimeUnit: 'days',
            scope: ['3-5 rough logo sketches (digital)', 'Delivered as JPG/PNG', '1 round of feedback for minor sketch adjustments'],
            tierDescription: 'Rapidly explore initial logo ideas with a set of quick digital sketches.',
            icon: Shield,
        },
    ],
    approvedDesigners: [],
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
    // Here you would typically add to cart logic
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
          {/* Main Content Column */}
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
                          {tier.name} Package - ₹{tier.price}
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
                            <p className="font-semibold text-lg">{designer.name}</p>
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

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              {selectedTierDetails && (
                 <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center">
                       <selectedTierDetails.icon className="mr-2.5 h-6 w-6 text-primary" />
                      {selectedTierDetails.name} Tier Summary
                    </CardTitle>
                     <CardDescription className="text-2xl font-bold text-primary pt-1">₹{selectedTierDetails.price}</CardDescription>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
