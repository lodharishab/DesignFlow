
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, Briefcase, MapPin, CalendarDays, ExternalLink, Star, Palette, Users, MessageSquare, PackageSearch, ThumbsUp } from 'lucide-react';
import { PortfolioItemCard, type PortfolioItem } from '@/components/shared/portfolio-item-card';
import { allPortfolioItemsData } from '@/app/portfolio/page'; 
import { type DesignerProfile } from '@/lib/designer-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data'; // Import review data
import { cn } from '@/lib/utils';

interface DesignerProfileClientContentProps {
  initialDesigner: DesignerProfile | null;
}

export function DesignerProfileClientContent({ initialDesigner }: DesignerProfileClientContentProps) {
  const params = useParams();
  const router = useRouter();
  const [designer, setDesigner] = useState<DesignerProfile | null>(initialDesigner);
  const [designerPortfolio, setDesignerPortfolio] = useState<PortfolioItem[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<DesignerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialDesigner); 

  const designerSlug = params.designerSlug as string;

  useEffect(() => {
    if (initialDesigner) {
      setDesigner(initialDesigner);
      const portfolio = allPortfolioItemsData.filter(item => item.designer?.id === initialDesigner.id);
      setDesignerPortfolio(portfolio);

      // Filter for featured reviews for this designer
      const reviews = mockDesignerReviews.filter(review => review.isFeatured);
      setFeaturedReviews(reviews);

      setIsLoading(false);
    } else if (!isLoading && !initialDesigner) { 
      notFound();
    }
  }, [initialDesigner, isLoading]);


  if (isLoading) {
    return <div className="flex-grow container mx-auto py-12 px-5 text-center">Loading designer profile...</div>;
  }

  if (!designer) {
    return (
      <div className="flex-grow container mx-auto py-12 px-5 text-center">
        <Users className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Designer Not Found</h1>
        <p className="mt-2 text-muted-foreground">The designer profile you are looking for does not exist.</p>
        <Button asChild className="mt-8" size="lg" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Designer Hero Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
              <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.imageHint} />
              <AvatarFallback className="text-4xl">{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">{designer.name}</h1>
              {designer.location && (
                <p className="text-lg text-muted-foreground mt-1 flex items-center justify-center md:justify-start">
                  <MapPin className="mr-2 h-5 w-5" /> {designer.location}
                </p>
              )}
              {designer.memberSince && (
                  <p className="text-sm text-muted-foreground mt-0.5">Member since {format(designer.memberSince, 'MMMM yyyy')}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  {designer.website && (
                      <Button variant="outline" size="sm" asChild>
                          <Link href={designer.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Website
                          </Link>
                      </Button>
                  )}
                  {designer.socialLinks?.map(link => (
                       <Button key={link.platform} variant="outline" size="sm" asChild>
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.platform} <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                      </Button>
                  ))}
                  <Button size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" /> Contact {designer.name.split(' ')[0]}
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-5 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
              {/* Left Column: Bio & Specialties */}
              <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                  <Card className="shadow-md">
                      <CardHeader>
                          <CardTitle className="font-headline text-xl">About {designer.name.split(' ')[0]}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{designer.bio}</p>
                      </CardContent>
                  </Card>
                   <Card className="shadow-md">
                      <CardHeader>
                          <CardTitle className="font-headline text-xl">Specialties</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="flex flex-wrap gap-2">
                          {designer.specialties.map(specialty => (
                              <Badge key={specialty} variant="secondary" className="text-sm px-3 py-1">{specialty}</Badge>
                          ))}
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Right Column: Portfolio & Reviews */}
              <div className="lg:col-span-2 space-y-12">
                  
                  {/* Featured Reviews Section */}
                  {featuredReviews.length > 0 && (
                    <section>
                      <h2 className="text-3xl font-bold font-headline flex items-center mb-8">
                        <ThumbsUp className="mr-3 h-7 w-7 text-primary" />
                        What Clients Are Saying
                      </h2>
                       <div className="space-y-6">
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
                    </section>
                  )}

                  {/* Portfolio Section */}
                  <section>
                      <h2 className="text-3xl font-bold font-headline flex items-center mb-8">
                          <Palette className="mr-3 h-7 w-7 text-primary" />
                          Portfolio
                      </h2>
                      {designerPortfolio.length > 0 ? (
                          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {designerPortfolio.map(item => (
                              <PortfolioItemCard key={item.id} item={item} />
                          ))}
                          </div>
                      ) : (
                          <Card className="text-center py-12 shadow-sm border-dashed">
                              <CardContent className="space-y-3">
                                  <Briefcase className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                                  <p className="text-lg font-semibold">Portfolio Coming Soon</p>
                                  <p className="text-muted-foreground">{designer.name} is currently curating their best work. Check back later!</p>
                              </CardContent>
                          </Card>
                      )}
                  </section>
              </div>
          </div>
      </div>
    </>
  );
}
