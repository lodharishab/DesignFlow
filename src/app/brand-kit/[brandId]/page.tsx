
import { getBrandKitById, BrandProfileFormData, defaultBrandProfile } from '@/lib/brand-profile-db';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Building, Palette, Tag, Users, CheckSquare, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { Metadata } from 'next';

interface PageProps {
  params: { brandId: string };
}

async function getBrandData(id: string): Promise<BrandProfileFormData | null> {
  // In a real app, this would be a direct DB fetch without user context
  // Here, we simulate it by using the local storage reader
  const kits = await (await import('@/lib/brand-profile-db')).getBrandKits();
  return kits.find(k => k.id === id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brandKit = await getBrandData(params.brandId);

  if (!brandKit) {
    return { title: 'Brand Kit Not Found' };
  }

  return {
    title: `Brand Kit: ${brandKit.companyName}`,
    description: `A quick overview of the brand identity for ${brandKit.companyName}.`,
    openGraph: {
      title: `Brand Kit for ${brandKit.companyName}`,
      description: brandKit.targetAudience || `Brand guidelines and assets.`,
      images: brandKit.logoUrl ? [brandKit.logoUrl] : [],
    },
    robots: {
      index: false, // Prevent search engines from indexing these shared pages
      follow: false,
    },
  };
}


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


export default async function PublicBrandKitPage({ params }: PageProps) {
  const brandKit = await getBrandData(params.brandId);

  if (!brandKit) {
    notFound();
  }

  const parseColors = (colorString: string): string[] => {
    if (!colorString) return [];
    return colorString.split(',').map(color => color.trim()).filter(Boolean);
  };

  const preferredColors = parseColors(brandKit.colorsToUse);
  const avoidedColors = parseColors(brandKit.colorsToAvoid);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="max-w-4xl mx-auto shadow-xl">
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
      <Footer />
    </div>
  );
}
