
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, Briefcase, MapPin, CalendarDays, ExternalLink, Star, Palette, Users, MessageSquare, PackageSearch } from 'lucide-react';
import { PortfolioItemCard, type PortfolioItem } from '@/components/shared/portfolio-item-card';
import { allPortfolioItemsData } from '@/app/portfolio/page'; 
import { type DesignerProfile } from '@/lib/designer-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface DesignerProfileClientContentProps {
  initialDesigner: DesignerProfile | null;
}

export function DesignerProfileClientContent({ initialDesigner }: DesignerProfileClientContentProps) {
  const params = useParams();
  const router = useRouter();
  // Initialize state with server-passed prop
  const [designer, setDesigner] = useState<DesignerProfile | null>(initialDesigner);
  const [designerPortfolio, setDesignerPortfolio] = useState<PortfolioItem[]>([]);
  //isLoading can be true initially if initialDesigner is null (e.g. during suspense fallback)
  const [isLoading, setIsLoading] = useState<boolean>(!initialDesigner); 

  const designerSlug = params.designerSlug as string;

  useEffect(() => {
    if (initialDesigner) {
      setDesigner(initialDesigner);
      const portfolio = allPortfolioItemsData.filter(item => item.designer?.id === initialDesigner.id);
      setDesignerPortfolio(portfolio);
      setIsLoading(false); // Data is ready
    } else if (!isLoading && !initialDesigner) { 
      // This condition means server passed null, and we are not already loading
      // This is a more robust way to handle notFound on client if server couldn't find it
      notFound();
    }
  }, [initialDesigner, isLoading]);


  if (isLoading) {
    return <div className="flex-grow container mx-auto py-12 px-5 text-center">Loading designer profile...</div>;
  }

  if (!designer) {
    // This should ideally be caught by notFound() earlier, but as a fallback
    // Or if initialDesigner was null and the effect for notFound() hasn't run / been caught by Suspense
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

              {/* Right Column: Portfolio */}
              <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-3xl font-bold font-headline flex items-center">
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
              </div>
          </div>
      </div>
    </>
  );
}
