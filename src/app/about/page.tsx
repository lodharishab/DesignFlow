
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, BookOpen, Brush, Users2, Lightbulb, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About DesignFlow - Our Story, Mission, and Team',
  description: 'Learn more about DesignFlow, the creative services marketplace connecting clients with expert designers in India. Discover our mission, vision, and the team behind our platform.',
  openGraph: {
    title: 'About DesignFlow | Our Mission & Vision',
    description: 'Discover DesignFlow, the platform revolutionizing creative collaboration in India.',
  },
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-5 text-center">
            <Brush className="mx-auto h-16 w-16 mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              About DesignFlow
            </h1>
            <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto opacity-90">
              Connecting creativity with opportunity. We're passionate about making great design accessible and empowering designers across India.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6 flex items-center">
                  <BookOpen className="mr-3 h-8 w-8 text-primary" />
                  Our Story
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  DesignFlow was born from a simple idea: to bridge the gap between talented Indian designers and clients seeking high-quality, reliable creative services. We saw the immense potential within the Indian design community and wanted to create a platform that nurtures this talent and makes it easily accessible.
                </p>
                <p className="text-muted-foreground">
                  Our journey began with a commitment to transparency, efficiency, and quality. We envisioned a marketplace where finding the right designer is straightforward, project collaboration is seamless, and pricing is clear from the outset. Today, DesignFlow stands as a testament to that vision, empowering businesses and designers alike.
                </p>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Diverse team collaborating on designs"
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint="team collaboration design"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Vision Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center">
                    <Target className="mr-3 h-7 w-7 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To empower Indian designers by providing a robust platform to showcase their skills and connect with a global clientele. We aim to simplify the process of commissioning design work, ensuring fair value for clients and rewarding opportunities for designers.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center">
                    <Eye className="mr-3 h-7 w-7 text-primary" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To be India's leading creative services marketplace, recognized for fostering innovation, upholding the highest standards of design quality, and contributing to the growth of the creative economy in the region and beyond.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team Section (Placeholder) */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-12 flex items-center justify-center">
              <Users2 className="mr-3 h-8 w-8 text-primary" />
              Meet the Team (Placeholder)
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We are a passionate group of individuals dedicated to building the future of creative collaboration.
              (More detailed team member introductions and photos would go here.)
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="relative w-32 h-32 rounded-full mx-auto mb-4 bg-muted overflow-hidden">
                       <Image src={`https://placehold.co/128x128.png`} alt={`Team Member ${index + 1}`} fill style={{ objectFit: 'cover' }} data-ai-hint="person avatar" />
                    </div>
                    <h3 className="text-lg font-semibold font-headline">Team Member {index + 1}</h3>
                    <p className="text-sm text-primary">Role/Title</p>
                    <p className="text-xs text-muted-foreground mt-2">A short bio about this team member will go here.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-5 text-center">
            <Lightbulb className="mx-auto h-12 w-12 mb-4 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
              Ready to Join DesignFlow?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Whether you're a client looking for exceptional design or a talented designer seeking opportunities, DesignFlow is the place for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" variant="secondary" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href="/signup">
                  Sign Up as a Client
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link href="/signup/designer">
                  Join as a Designer
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
