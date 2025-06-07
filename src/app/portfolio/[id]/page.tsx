
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Briefcase, CalendarDays, Tag, UserCircle, PackageSearch, Lightbulb, ExternalLink } from 'lucide-react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { allPortfolioItemsData } from '@/app/portfolio/page'; // Import shared data
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function PortfolioDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemId = params.id as string;

  useEffect(() => {
    if (itemId) {
      setIsLoading(true);
      const foundItem = allPortfolioItemsData.find(p => p.id === itemId);
      setItem(foundItem || null);
      setIsLoading(false);
    }
  }, [itemId]);

  if (isLoading) {
    return <div className="flex-grow container mx-auto py-12 px-5 text-center">Loading project details...</div>;
  }

  if (!item) {
    return (
      <div className="flex-grow container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Project Not Found</h1>
        <p className="mt-2 text-muted-foreground">The project you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Portfolio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-muted">
          <Image
            src={item.coverImageUrl}
            alt={`Cover image for ${item.title}`}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={item.coverImageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-5 py-10 md:py-16 relative -mt-16 md:-mt-24">
          <Card className="shadow-xl p-6 md:p-10 bg-card">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">{item.category}</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground -mt-2">{item.title}</h2>
                
                <div className="text-muted-foreground space-y-1 text-sm">
                  {item.clientName && <p className="flex items-center"><Briefcase className="mr-2 h-4 w-4" />Client: {item.clientName}</p>}
                  {item.projectDate && <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4" />Completed: {item.projectDate}</p>}
                </div>

                <Separator />
                <h3 className="text-xl font-semibold font-headline">Project Overview</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-line">{item.projectDescription}</p>

                {item.tags && item.tags.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-semibold font-headline mb-3">Technologies & Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs capitalize">{tag}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="md:col-span-1 space-y-6">
                {item.designer && (
                  <Card className="bg-secondary/30 p-4">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg font-headline flex items-center">
                        <UserCircle className="mr-2 h-5 w-5 text-primary" /> Designer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.designer.avatarUrl} alt={item.designer.name} data-ai-hint={item.designer.imageHint || 'designer avatar'} />
                        <AvatarFallback>{item.designer.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{item.designer.name}</p>
                        {item.designer.slug ? (
                           <Link href={`/designers/${item.designer.slug}`} className="text-xs text-primary hover:underline">View Profile</Link>
                        ) : <p className="text-xs text-muted-foreground">Profile not available</p>}
                      </div>
                    </CardContent>
                  </Card>
                )}
                 <Link href={`/portfolio?category=${item.categorySlug}`} passHref legacyBehavior>
                  <a className="block">
                    <Badge variant="outline" className="text-sm py-1 px-3 mb-2 hover:bg-accent">
                        <Tag className="mr-2 h-4 w-4" /> Related: {item.category}
                    </Badge>
                  </a>
                </Link>
                <Card className="bg-primary/10 p-5 text-center">
                    <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-headline font-semibold mb-2">Have a Similar Project?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Let our experts bring your vision to life.</p>
                    <Button size="lg" className="w-full" asChild>
                        <Link href={`/services?category=${item.categorySlug}`}>Browse {item.category} Services</Link>
                    </Button>
                </Card>
                 <Button variant="outline" onClick={() => router.back()} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
                </Button>
              </div>
            </div>
            
            {item.galleryImages && item.galleryImages.length > 0 && (
              <>
                <Separator className="my-8 md:my-12" />
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-8">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {item.galleryImages.map((image, index) => (
                    <div key={index} className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={image.url}
                        alt={image.caption || `Gallery image ${index + 1} for ${item.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={image.hint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PortfolioItemPage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen"><Navbar /><CategoriesNavbar /><main className="flex-grow container mx-auto py-12 px-5 text-center">Loading project...</main><Footer /></div>}>
      <PortfolioDetailPageContent />
    </Suspense>
  );
}

