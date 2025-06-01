import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder data - in a real app, this would come from a database
const serviceDetails = {
  id: '1',
  name: 'Modern Logo Design',
  description: 'Get a unique and memorable logo for your brand that resonates with your target audience. Our process ensures a collaborative experience resulting in a logo you’ll love. We focus on versatility, scalability, and timelessness.',
  longDescription: 'This service includes an initial consultation to understand your brand values, target market, and preferences. You will receive 3 initial logo concepts to choose from. We then iterate on your chosen concept with up to 3 rounds of revisions. Final deliverables include vector files (AI, EPS, SVG), raster files (PNG, JPG), and a simple brand guide explaining logo usage, color palettes, and typography.',
  price: 199,
  category: 'Logo Design',
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
    { id: 'd1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100.png', rating: 4.9, projectsCompleted: 120, imageHint: 'designer portrait' },
    { id: 'd2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100.png', rating: 4.8, projectsCompleted: 95, imageHint: 'designer portrait' },
    { id: 'd3', name: 'Carol Danvers', avatarUrl: 'https://placehold.co/100x100.png', rating: 5.0, projectsCompleted: 200, imageHint: 'designer portrait' },
  ],
};

// This is a server component, so params are available directly
export default function ServiceDetailPage({ params }: { params: { serviceId: string } }) {
  // In a real app, fetch service data based on params.serviceId
  const service = serviceDetails; 

  if (!service) {
    return <p>Service not found.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column: Image and Order */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-8">
              <Image 
                src={service.imageUrl} 
                alt={service.name} 
                layout="fill" 
                objectFit="cover"
                data-ai-hint={service.imageHint}
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{service.name}</h1>
            <Badge variant="outline" className="mb-4 text-sm">{service.category}</Badge>
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

          {/* Right Column: Price, CTA, Designer Info */}
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
