
"use client";

import { useEffect, useState, Suspense } from 'react';
import { getBrandKitById, type BrandProfileFormData } from '@/lib/brand-profile-db';
import { notFound, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Building, Palette, Tag, Users, CheckSquare, X, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/shared/client-only';


function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-semibold font-headline mb-4 flex items-center">
                <Icon className="mr-3 h-5 w-5 text-primary" />{title}
            </h2>
            <div className="space-y-4 text-sm text-foreground pl-8">
                {children}
            </div>
        </section>
    );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div>
            <p className="font-semibold text-muted-foreground">{label}</p>
            <p className="whitespace-pre-line">{value}</p>
        </div>
    );
}


function BrandKitContent() {
    const params = useParams();
    const brandId = params.brandId as string;
    const [brandKit, setBrandKit] = useState<BrandProfileFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (brandId) {
            getBrandKitById(brandId).then(kit => {
                if (kit) {
                    setBrandKit(kit);
                } else {
                    notFound();
                }
                setIsLoading(false);
            });
        }
    }, [brandId]);
    
    // Add print styles dynamically
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .print-hidden { display: none !important; }
            main { padding-top: 0 !important; padding-bottom: 0 !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:border-none { border: none !important; }
        }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
    }

    if (!brandKit) {
        // This case is mostly handled by notFound(), but it's a good fallback.
        return <div className="text-center py-12">Brand Kit not found.</div>;
    }


    const parseColors = (colorString: string): string[] => {
        if (!colorString) return [];
        return colorString.split(',').map(color => color.trim()).filter(Boolean);
    };

    const preferredColors = parseColors(brandKit.colorsToUse);
    const avoidedColors = parseColors(brandKit.colorsToAvoid);

    return (
        <main className="flex-grow container mx-auto py-12 px-5">
            <div className="flex justify-end mb-6 print-hidden">
                <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4"/> Download Kit</Button>
            </div>
            <Card className="max-w-4xl mx-auto shadow-xl print:shadow-none print:border-none">
                <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                        {brandKit.logoUrl ? (
                            <div className="relative h-20 w-20 shrink-0 bg-muted rounded-lg p-2 flex items-center justify-center">
                                <Image src={brandKit.logoUrl} alt={`${brandKit.companyName} logo`} layout="fill" objectFit="contain" />
                            </div>
                        ) : (
                            <div className="h-20 w-20 shrink-0 bg-muted rounded-lg flex items-center justify-center">
                                <Sparkles className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <CardTitle className="font-headline text-4xl">{brandKit.companyName}</CardTitle>
                            <CardDescription className="text-lg">{brandKit.industry || 'Brand Profile'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Separator />
                    <Section title="About the Brand" icon={Building}>
                        <InfoItem label="Company Website" value={brandKit.companyWebsite} />
                        <InfoItem label="Company Size" value={brandKit.companySize} />
                        <InfoItem label="Brand Values" value={brandKit.brandValues} />
                    </Section>

                    <Section title="Target Audience" icon={Users}>
                        <p className="text-muted-foreground italic">{brandKit.targetAudience || "Not specified."}</p>
                    </Section>

                    <Section title="Design & Style" icon={Palette}>
                        <InfoItem label="Preferred Design Style" value={brandKit.preferredDesignStyle} />
                        {brandKit.tags && brandKit.tags.length > 0 && (
                            <div>
                                <p className="font-semibold text-muted-foreground mb-2">Style Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {brandKit.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {preferredColors.length > 0 && (
                            <div>
                                <p className="font-semibold text-muted-foreground mb-2">Preferred Colors</p>
                                <div className="flex flex-wrap gap-2">
                                    {preferredColors.map((color, index) => (
                                        <div key={index} title={color} className="h-10 w-10 rounded-md border" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {avoidedColors.length > 0 && (
                            <div>
                                <p className="font-semibold text-muted-foreground mb-2">Colors to Avoid</p>
                                <div className="flex flex-wrap gap-2">
                                    {avoidedColors.map((color, index) => (
                                        <div key={index} title={color} className="h-10 w-10 rounded-md border relative" style={{ backgroundColor: color }}>
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                                                <X className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Section>

                    <Section title="Project Preferences" icon={CheckSquare}>
                        <InfoItem label="Typical Project Types" value={brandKit.projectTypes.join(', ')} />
                        <InfoItem label="Preferred Communication" value={brandKit.communicationPreference} />
                        <InfoItem label="Typical Feedback Style" value={brandKit.feedbackStyle} />
                        <InfoItem label="General Notes for Designers" value={brandKit.notesForDesigners} />
                    </Section>
                </CardContent>
            </Card>
        </main>
    );
}

export default function PublicBrandKitPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="print-hidden">
        <Navbar />
      </div>
      <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading brand kit...</div>}>
         <ClientOnly>
            <BrandKitContent />
        </ClientOnly>
      </Suspense>
      <div className="print-hidden">
        <Footer />
      </div>
    </div>
  );
}
