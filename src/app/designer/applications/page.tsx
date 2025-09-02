
"use client";

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, Film, Presentation, Loader2, PlusCircle, Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import type { Icon as LucideIconType } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


// --- MOCK DATA ---
const CURRENT_DESIGNER_ID = 'des001'; 

interface ServiceCategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: LucideIconType;
  description: string;
}

const availableServiceCategories: ServiceCategoryOption[] = [
  { id: 'cat001', name: 'Logo Design', slug: 'logo-design', icon: Palette, description: 'Get alerts for new logo and branding projects.' },
  { id: 'cat002', name: 'Web UI/UX', slug: 'web-ui-ux', icon: Laptop, description: 'Notifications for website and app interface design tasks.' },
  { id: 'cat003', name: 'Print Design', slug: 'print-materials', icon: Printer, description: 'Stay updated on brochure, flyer, and other print design needs.' },
  { id: 'cat004', name: 'Illustration', slug: 'custom-illustrations', icon: BrushIcon, description: 'Receive notifications for illustration and artwork projects.' },
  { id: 'cat005', name: 'Social Media Graphics', slug: 'social-media-graphics', icon: Share2, description: 'Alerts for social media post, banner, and ad designs.' },
  { id: 'cat006', name: 'Packaging Design', slug: 'packaging', icon: PackageIcon, description: 'Notifications for product packaging design projects.' },
  { id: 'cat007', name: 'Motion Graphics', slug: 'motion-graphics', icon: Film, description: 'Alerts for animation and video editing projects.' },
  { id: 'cat008', name: 'Presentation Design', slug: 'presentations', icon: Presentation, description: 'Stay informed about pitch deck and presentation design tasks.' },
];

interface ActiveServices {
  [categorySlug: string]: boolean;
}

// --- DIALOG FOR NEW CATEGORY REQUESTS ---
function NewCategoryRequestDialog({ availableCategories }: { availableCategories: ServiceCategoryOption[] }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !experience.trim() || !portfolioFile) {
        toast({ title: "Error", description: "Please fill out all fields and upload a portfolio sample.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    console.log("Submitting category application:", { category: selectedCategory, experience, portfolio: portfolioFile.name });
    setTimeout(() => {
        toast({ title: "Application Submitted (Simulated)", description: `Your application for the "${selectedCategory}" category has been sent for review.` });
        setIsSubmitting(false);
        setIsOpen(false);
        setSelectedCategory('');
        setExperience('');
        setPortfolioFile(null);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Apply for New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Apply for a New Service Category</DialogTitle>
            <DialogDescription>
              Submit your application to get approved for new types of projects. Admin review required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-select">Desired Category*</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience-desc">Describe Your Experience*</Label>
              <Textarea 
                id="experience-desc" 
                value={experience} 
                onChange={(e) => setExperience(e.target.value)} 
                placeholder={`Briefly explain your experience and skills in ${selectedCategory || 'the selected category'}.`} 
                rows={4}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="portfolio-upload">Upload Portfolio Sample*</Label>
              <Input 
                id="portfolio-upload" 
                type="file" 
                onChange={(e) => setPortfolioFile(e.target.files ? e.target.files[0] : null)} 
                accept=".pdf, image/*"
                required
              />
              <p className="text-xs text-muted-foreground">Upload a relevant work sample (PDF or image).</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// --- MAIN PAGE COMPONENT ---
export default function DesignerServicesPage() {
  const { toast } = useToast();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeServices, setActiveServices] = useState<ActiveServices>({});

  useEffect(() => {
    const foundDesigner = designersData.find(d => d.id === CURRENT_DESIGNER_ID);
    if (foundDesigner) {
      setDesigner(foundDesigner);
      // Simulate loading saved preferences. By default, a designer is active in all their approved specialties.
      const initialPrefs: ActiveServices = {};
      availableServiceCategories.forEach(cat => {
        initialPrefs[cat.slug] = foundDesigner.specialties?.includes(cat.name) || false;
      });
      setActiveServices(initialPrefs);
    }
    setIsLoading(false);
  }, []);

  const handleActiveToggle = (categorySlug: string, isActivated: boolean) => {
    setActiveServices(prev => ({
      ...prev,
      [categorySlug]: isActivated,
    }));
  };
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    console.log("Saving active services (simulated):", activeServices);
    setTimeout(() => {
        toast({
            title: "Services Updated (Simulated)",
            description: "Your available services have been updated.",
        });
        setIsSaving(false);
    }, 1000);
  };
  
  const availableCategoriesForRequest = useMemo(() => {
    if (!designer) return [];
    return availableServiceCategories.filter(cat => !designer.specialties.includes(cat.name));
  }, [designer]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading service settings...</p>
      </div>
    );
  }

  if (!designer) {
    return <p>Designer profile not found. Cannot manage services.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          My Offered Services
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
            <NewCategoryRequestDialog availableCategories={availableCategoriesForRequest} />
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Your Available Services</CardTitle>
          <CardDescription>
            Use the toggles to set which of your approved services you are currently available to take projects for. To offer services in a new category, apply for approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {availableServiceCategories.map(category => {
            const isApproved = designer.specialties.includes(category.name);
            const isActive = activeServices[category.slug] || false;
            return (
                <div key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:shadow-sm transition-shadow">
                <div className="mb-3 sm:mb-0">
                    <Label htmlFor={`switch-${category.slug}`} className="text-lg font-semibold flex items-center">
                    <category.icon className="mr-3 h-6 w-6 text-primary" />
                    {category.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 pl-9">{category.description}</p>
                </div>
                <div className="flex items-center space-x-3 shrink-0 ml-auto sm:ml-4">
                    {isApproved ? (
                        <>
                            <Switch
                            id={`switch-${category.slug}`}
                            checked={isActive}
                            onCheckedChange={(checked) => handleActiveToggle(category.slug, checked)}
                            disabled={isSaving}
                            aria-label={`Activate services for ${category.name}`}
                            />
                            <Label htmlFor={`switch-${category.slug}`} className="text-sm font-medium cursor-pointer w-20">
                            {isActive ? 'Active' : 'Inactive'}
                            </Label>
                        </>
                    ) : (
                         <Badge variant="outline">Not Approved</Badge>
                    )}
                </div>
                </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  );
}
