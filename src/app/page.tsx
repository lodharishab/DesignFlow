
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/shared/service-card';
import { CheckCircle, Users, Briefcase, UserPlus } from 'lucide-react'; // Added UserPlus, removed Search
import Link from 'next/link';
import Image from 'next/image';

const featuredServices = [
  { id: '1', name: 'Modern Logo Design', description: 'Get a unique and memorable logo for your brand.', price: 199, category: 'Logo Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'logo design' },
  { id: '2', name: 'Social Media Post Pack', description: 'Engaging posts designed for your social media channels.', price: 99, category: 'Social Media', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'social media' },
  { id: '3', name: 'Professional Brochure Design', description: 'Stunning brochures to showcase your business.', price: 249, category: 'Print Design', imageUrl: 'https://placehold.co/600x400.png', imageHint: 'brochure design' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-secondary to-background">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              Your Vision, Our Expertise. <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              DesignFlow connects you with top design talent for predefined services. No more guesswork, just quality results.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup"> {/* Changed href to client signup */}
                  <UserPlus className="mr-2 h-5 w-5" /> Sign Up as Client {/* Changed text and icon */}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup/designer">
                  <Users className="mr-2 h-5 w-5" /> Join as a Designer
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">How DesignFlow Works</h2>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-semibold font-headline mb-4">For Clients</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Browse predefined design services with clear scopes and fixed prices.</li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Place your order and get matched with an approved, skilled designer.</li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Collaborate, track progress, and approve your final design seamlessly.</li>
                </ul>
              </div>
              <div className="hidden md:flex justify-center">
                 <Image src="https://placehold.co/500x350.png" alt="Client process illustration" width={500} height={350} className="rounded-lg shadow-md" data-ai-hint="collaboration team" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center mt-12">
              <div className="hidden md:flex justify-center order-first md:order-none">
                <Image src="https://placehold.co/500x350.png" alt="Designer process illustration" width={500} height={350} className="rounded-lg shadow-md" data-ai-hint="designer portfolio" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold font-headline mb-4">For Designers</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Apply to offer your expertise for specific, clearly defined services.</li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Get approved by our admin team based on your portfolio and skills.</li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" /> Receive orders, deliver high-quality work, and build your reputation.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Featured Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">
                  <Briefcase className="mr-2 h-5 w-5" /> View All Services
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
