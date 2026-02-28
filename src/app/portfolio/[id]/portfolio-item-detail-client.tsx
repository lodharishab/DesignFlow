
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Navbar, CategoriesNavbar, Footer are typically in the layout, so removed if not needed for standalone rendering
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Briefcase, CalendarDays, Tag, UserCircle, PackageSearch, Lightbulb, ExternalLink, Tags, ThumbsUp, Star } from 'lucide-react';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFeaturedReviews } from '@/lib/reviews-db';
import type { DesignerReview } from '@/lib/reviews-db';
import { cn } from '@/lib/utils';

interface PortfolioItemDetailClientContentProps {
  initialItem: PortfolioItem | null;
}

export function PortfolioItemDetailClientContent({ initialItem }: PortfolioItemDetailClientContentProps) {
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(initialItem);
  const [featuredReviews, setFeaturedReviews] = useState<DesignerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialItem); 

  useEffect(() => {
    if (initialItem) {
      setItem(initialItem);
      // Fetch featured reviews from DB
      getFeaturedReviews(10).then(reviews => {
        setFeaturedReviews(reviews);
      });
      setIsLoading(false);
    } else if (!isLoading) { 
      notFound();
    }
  }, [initialItem, isLoading]);


  if (isLoading) {
    // This state is primarily for when Suspense is used and initialItem isn't immediately available,
    // or if you had client-side fetching logic.
    return <div className="flex-grow container mx-auto py-12 px-5 text-center">Loading project details...</div>;
  }

  if (!item) {
    // This should ideally be caught by notFound() in the effect or by the server component.
    // It's a final fallback.
    return (
      <div className="flex-grow container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Project Not Found</h1>
        <p className="mt-2 text-muted-foreground">The project you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-8" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-muted">
        <Image
          src={item.coverImageUrl}
          alt={`Cover image for ${item.title}`}
          fill
          style={{ objectFit: 'cover' }}
          priority // Good for LCP
          data-ai-hint={item.coverImageHint}
        />
        {/* Optional: Overlay for text on image, if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-5 py-10 md:py-16 relative -mt-16 md:-mt-24"> {/* Negative margin to overlap hero */}
        <Card className="shadow-xl p-6 md:p-10 bg-card"> {/* Ensure card has background for readability */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Project Details */}
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
                  <h3 className="text-lg font-semibold font-headline mb-3 flex items-center">
                    <Tags className="mr-2 h-4 w-4 text-muted-foreground"/>Technologies & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs capitalize">{tag}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Designer Info & CTA */}
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
               {/* Link to related category */}
               <Link href={`/portfolio?category=${item.categorySlug}`} className="block">
                  <Badge variant="outline" className="text-sm py-1 px-3 mb-2 hover:bg-accent">
                      <Tag className="mr-2 h-4 w-4" /> Related: {item.category}
                  </Badge>
              </Link>
              {/* CTA Card */}
              <Card className="bg-primary/10 p-5 text-center">
                  <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-headline font-semibold mb-2">Have a Similar Project?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Let our experts bring your vision to life.</p>
                  <Button size="lg" className="w-full" asChild>
                      <Link href={`/services?category=${item.categorySlug}`}>Browse {item.category} Services</Link>
                  </Button>
              </Card>
               {/* Back Button */}
               <Button variant="outline" onClick={() => router.back()} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
              </Button>
            </div>
          </div>
          
          {/* Gallery Section */}
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

           {/* Featured Reviews Section */}
          {featuredReviews.length > 0 && (
            <>
              <Separator className="my-8 md:my-12" />
              <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-8">Client Feedback</h2>
              <div className="space-y-6 max-w-2xl mx-auto">
                {featuredReviews.map(review => (
                  <Card key={review.id} className="shadow-md bg-secondary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={review.clientAvatarUrl} alt={review.clientName} data-ai-hint={review.clientAvatarHint} />
                          <AvatarFallback>{review.clientName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{review.clientName}</p>
                              <p className="text-xs text-muted-foreground">For: {review.serviceName}</p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("h-4 w-4", i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                              ))}
                            </div>
                          </div>
                          <blockquote className="text-sm italic text-foreground mt-2 border-l-2 border-primary/50 pl-3">
                            {review.reviewText || "Excellent work and collaboration!"}
                          </blockquote>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

        </Card>
      </div>
    </>
  );
}
