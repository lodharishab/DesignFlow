
"use client";

import * as React from 'react'; // Ensuring React is imported
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, type ReactNode } from 'react'; // these are also from react
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ShoppingCart, Star, Users, Shield, Zap as ZapIcon, Clock, Package, Tag, type LucideIcon, Tags, IndianRupee, Camera, Film, Presentation, Palette, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { addToCart } from '@/lib/cart-db';
import type { ServiceDetailData, ServiceTierData, ApprovedDesignerData } from './page';

// Helper function to map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Star,
  Zap: ZapIcon, // Corrected: Use the imported alias if original name conflicts
  Palette,
  Camera,
  Film,
  Presentation,
};

function formatStructuredDeliveryTime(min: number, max: number, unit: ServiceTierData['deliveryTimeUnit']): string {
  const unitLabel = unit.replace('_', ' ');
  if (min === max) {
    return `${min} ${unitLabel}${min > 1 && unit !== 'weeks' ? 's' : ''}`;
  }
  return `${min}-${max} ${unitLabel}${max > 1 && unit !== 'weeks' ? 's' : ''}`;
}

interface ServiceDetailClientContentProps {
  service: ServiceDetailData;
}

export function ServiceDetailClientContent({ service }: ServiceDetailClientContentProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedTierName, setSelectedTierName] = useState<string>('');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (service) {
      const defaultTier = service.tiers.find(t => t.name === 'Standard')?.name || (service.tiers.length > 0 ? service.tiers[0].name : '');
      setSelectedTierName(defaultTier);
    }
  }, [service]);

  const selectedTierDetails = service?.tiers.find(t => t.name === selectedTierName);

  const handleScrollToTabs = () => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTierChange = (value: string) => {
    setSelectedTierName(value);
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleOrderTier = async (tier: ServiceTierData) => {
    if (!service) return;
    setIsAddingToCart(true);
    try {
      const cartItemId = `cart-${service.id}-${tier.id}-${Date.now()}`;
      const result = await addToCart({
        id: cartItemId,
        userId: 'client001', // Current hardcoded user
        serviceId: service.id,
        tierId: tier.id,
        name: service.name,
        tierName: tier.name,
        price: tier.price,
        imageUrl: service.imageUrl,
        imageHint: service.imageHint,
        quantity: 1,
      });
      if (result) {
        toast({
          title: "Added to Cart",
          description: `${service.name} - ${tier.name} tier has been added to your cart.`,
        });
      } else {
        toast({
          title: "Added to Cart",
          description: `${service.name} - ${tier.name} tier added to your cart.`,
        });
      }
      router.push('/cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!service) {
     return <div className="flex-grow container mx-auto py-12 px-5 text-center"><h1 className="text-2xl font-semibold">Service data not available.</h1></div>;
  }

  let tabsListGridColsClass = "grid-cols-3";
  if (service.tiers.length === 1) {
    tabsListGridColsClass = "grid-cols-1";
  } else if (service.tiers.length === 2) {
    tabsListGridColsClass = "grid-cols-2";
  }

  return (
    <main className="flex-grow container mx-auto py-12 px-5">
      <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill={true}
              style={{ objectFit: "cover" }}
              data-ai-hint={service.imageHint}
              priority
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
                {service.tiers.map(tier => {
                  const IconComponent = iconMap[tier.iconName] || Shield;
                  return (
                    <TabsTrigger
                      key={tier.name}
                      value={tier.name}
                      className="py-2.5 text-sm data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/50 whitespace-normal overflow-hidden min-w-0"
                    >
                      <IconComponent className="mr-2 h-5 w-5" />
                      {tier.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {service.tiers.map(tier => {
                 const IconComponent = iconMap[tier.iconName] || Shield;
                 return (
                    <TabsContent
                        key={tier.name}
                        value={tier.name}
                    >
                        <Card className="shadow-md border">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl flex items-center">
                            <IconComponent className="mr-3 h-7 w-7 text-primary" />
                            {tier.name} Package - <IndianRupee className="inline-block h-6 w-6 ml-1" />{tier.price.toLocaleString('en-IN')}
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
                                disabled={isAddingToCart}
                            >
                            <ShoppingCart className="mr-2 h-5 w-5" /> {isAddingToCart ? 'Adding...' : `Order ${tier.name} Tier`}
                            </Button>
                        </CardContent>
                        </Card>
                    </TabsContent>
                 );
              })}
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
                          <Link href={`/designers/${designer.slug}`} className="text-lg font-semibold hover:text-primary hover:underline">
                              {designer.name}
                          </Link>
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

        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">
            {selectedTierDetails && (
               <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center">
                     {React.createElement(iconMap[selectedTierDetails.iconName] || Shield, {className: "mr-2.5 h-6 w-6 text-primary"})}
                    {selectedTierDetails.name} Tier Summary
                  </CardTitle>
                   <CardDescription className="text-2xl font-bold text-primary pt-1"><IndianRupee className="inline-block h-6 w-6 mr-0.5" />{selectedTierDetails.price.toLocaleString('en-IN')}</CardDescription>
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
                <CardTitle className="font-headline text-xl">Why Choose DesignFlow?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Expert Designers</p>
                <p className="flex items-start"><Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" /> Transparent Pricing</p>
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
  );
}
