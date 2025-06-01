
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/components/shared/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

const services = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand. Includes multiple concepts and revisions.', price: 199, category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'abstract logo' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels. Perfect for Instagram, Facebook, and Twitter.', price: 99, category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media graphics' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning tri-fold or bi-fold brochures to showcase your business effectively.', price: 249, category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure layout' },
  { id: '4', name: 'UI/UX Web Design Mockup', description: 'High-fidelity mockup for one key page of your website or app.', price: 399, category: 'UI/UX Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'website mockup' },
  { id: '5', name: 'Custom Illustration', description: 'Unique vector or raster illustration based on your brief.', price: 149, category: 'Illustration', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'character illustration' },
  { id: '6', name: 'Packaging Design Concept', description: 'Creative packaging concept for your product.', price: 299, category: 'Packaging', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'product packaging' },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold font-headline mb-8 text-center">Explore Our Design Services</h1>
        
        <div className="mb-8 p-6 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-10 text-base py-3" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-full md:w-[180px] text-base py-3">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="logo">Logo Design</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="print">Print Design</SelectItem>
                <SelectItem value="uiux">UI/UX Design</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-base py-3">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
