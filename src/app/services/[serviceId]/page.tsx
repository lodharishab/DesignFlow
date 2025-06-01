
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users, Shield, Zap } from 'lucide-react'; // Added Shield, Zap
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder data - in a real app, this would come from a database
const serviceDetailsData = {
  '1': {
    id: '1',
    name: 'Modern Logo Design',
    description: 'Get a unique and memorable logo for your brand that resonates with your target audience. Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness.',
    longDescription: 'This service includes an initial consultation to understand your brand values, target market, and preferences. You will receive 3 initial logo concepts to choose from. We then iterate on your chosen concept with up to 3 rounds of revisions. Final deliverables include vector files (AI, EPS, SVG), raster files (PNG, JPG), and a simple brand guide explaining logo usage, color palettes, and typography.',
    price: 199,
    category: 'Logo Design',
    tier: 'Standard' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'modern logo showcase',
    deliveryTime: '5-7 Business Days',
    scope: [
      'Initial brand consultation',
      '3 unique logo concepts',
      '3 rounds of revisions',
      'Full color, black & white, and inverse versions',
      'Vector files (AI, EPS, SVG)',
      'High-resolution raster files (PNG, JPG)',
      'Basic brand style guide',
      'Full ownership rights',
    ],
    approvedDesigners: [
      { id: 'd1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.9, projectsCompleted: 120, imageHint: 'designer portrait' },
      { id: 'd2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.8, projectsCompleted: 95, imageHint: 'designer portrait' },
    ],
  },
  '2': { // Adding data for service ID '2' as an example
    id: '2',
    name: 'Social Media Post Pack',
    description: 'Engaging posts designed for your social media channels. Perfect for Instagram, Facebook, and Twitter.',
    longDescription: 'This pack includes 10 custom-designed social media posts tailored to your brand and campaign goals. We provide source files and high-resolution images ready for publishing.',
    price: 99,
    category: 'Social Media',
    tier: 'Basic' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'social media campaign',
    deliveryTime: '3-5 Business Days',
    scope: [
      '10 social media posts',
      'Content calendar idea session',
      '2 rounds of revisions',
      'Optimized for chosen platforms',
      'Source files (PSD or Figma)',
    ],
    approvedDesigners: [
       { id: 'd3', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/40x40.png', rating: 5.0, projectsCompleted: 200, imageHint: 'designer portrait' },
    ],
  },
   // Add more service details here if needed, matching IDs from services/page.tsx
   '3': {
    id: '3',
    name: 'Professional Brochure Design',
    description: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.',
    longDescription: 'Comprehensive brochure design including concept, layout, and print-ready files. We work with you to create a compelling narrative and visual style.',
    price: 249,
    category: 'Print Design',
    tier: 'Standard' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'corporate brochure',
    deliveryTime: '7-10 Business Days',
    scope: ['Custom brochure design (up to 6 panels)', 'Stock imagery included', '3 revision rounds', 'Print-ready PDF'],
    approvedDesigners: [],
  },
  '4': {
    id: '4',
    name: 'UI/UX Web Design Mockup',
    description: 'High-fidelity mockup for one key page of your website or app.',
    longDescription: 'Detailed UI/UX design for a single, critical page, including wireframes, mockups, and a style guide for key elements. Ideal for presentations or developer handoff.',
    price: 399,
    category: 'UI/UX Design',
    tier: 'Premium' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'app interface design',
    deliveryTime: '10-14 Business Days',
    scope: ['1 page UI/UX design', 'Interactive prototype (Figma/XD)', 'Mobile and desktop views', 'Component style guide'],
    approvedDesigners: [
      { id: 'd1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.9, projectsCompleted: 120, imageHint: 'designer portrait' },
    ],
  },
  '5': {
    id: '5',
    name: 'Custom Illustration',
    description: 'Unique vector or raster illustration based on your brief.',
    longDescription: 'From simple icons to complex scenes, get custom illustrations in your desired style. Perfect for websites, marketing materials, or personal projects.',
    price: 149,
    category: 'Illustration',
    tier: 'Standard' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'fantasy illustration',
    deliveryTime: '5-8 Business Days',
    scope: ['1 custom illustration', 'Up to 3 characters/main elements', 'Source file (AI, PSD, or other)', 'Commercial use license'],
    approvedDesigners: [],
  },
  '6': {
    id: '6',
    name: 'Packaging Design Concept',
    description: 'Creative packaging concept for your product.',
    longDescription: 'Develop a unique and attractive packaging design concept that makes your product stand out. Includes mockups and initial dieline considerations.',
    price: 299,
    category: 'Packaging',
    tier: 'Premium' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'luxury product box',
    deliveryTime: '8-12 Business Days',
    scope: ['1 packaging concept', '3D mockups', 'Basic dieline sketch', 'Color palette and typography'],
    approvedDesigners: [
      { id: 'd2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png', rating: 4.8, projectsCompleted: 95, imageHint: 'designer portrait' },
    ],
  },
   '7': {
    id: '7',
    name: 'Basic Logo Sketch',
    description: 'Quick logo sketches for initial ideas.',
    longDescription: 'Get 3-5 rough logo sketches to explore initial concepts and directions for your brand identity. This is a great starting point for brainstorming.',
    price: 49,
    category: 'Logo Design',
    tier: 'Basic' as 'Basic' | 'Standard' | 'Premium',
    imageUrl: 'https://placehold.co/800x500.png',
    imageHint: 'pencil sketch logo',
    deliveryTime: '1-2 Business Days',
    scope: ['3-5 rough logo sketches', 'Digital delivery (scanned or simple vector)', '1 round of feedback for minor tweaks on sketches'],
    approvedDesigners: [],
  },
};

const getTierBadgeVariant = (serviceTier?: string) => {
  switch (serviceTier) {
    case 'Premium':
      return 'default'; 
    case 'Standard':
      return 'secondary';
    case 'Basic':
      return 'outline';
    default:
      return 'outline';
  }
};

const TierIcon = ({ tier }: { tier?: string }) => {
  if (tier === 'Premium') return <Zap className="mr-1 h-4 w-4" />;
  if (tier === 'Standard') return <Star className="mr-1 h-4 w-4" />;
  if (tier === 'Basic') return <Shield className="mr-1 h-4 w-4" />;
  return null;
};

export default function ServiceDetailPage({ params }: { params: { serviceId: string } }) {
  const service = serviceDetailsData[params.serviceId as keyof typeof serviceDetailsData]; 

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
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-sm">{service.category}</Badge>
                {service.tier && (
                  <Badge variant={getTierBadgeVariant(service.tier)} className="text-sm flex items-center">
                    <TierIcon tier={service.tier} />
                    {service.tier}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-lg mb-6">{service.description}</p>
            
            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold font-headline mb-4">Service Details</h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line mb-6">{service.longDescription}</p>

            <h2 className="text-2xl font-semibold font-headline mb-4">What&apos;s Included</h2>
            <ul className="space-y-2 mb-8">
              {service.scope.map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-primary mb-2">${service.price}</p>
                <p className="text-sm text-muted-foreground mb-1">Starting price</p>
                <p className="text-sm text-muted-foreground mb-6">Estimated Delivery: {service.deliveryTime}</p>
                
                <Button size="lg" className="w-full mb-4">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Order Now
                </Button>
                <Button variant="outline" className="w-full">
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
