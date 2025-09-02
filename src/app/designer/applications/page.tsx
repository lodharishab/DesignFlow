
"use client";

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, Film, Presentation, Loader2, PlusCircle, Upload, FileText, AlertTriangle, Briefcase, Eye, Link as LinkIconLucide } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import type { Icon as LucideIconType } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Mock Data for Alerts ---
type AlertPriority = 'High' | 'Medium' | 'Low';
interface Alert {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  timestamp: Date;
  link: string;
  linkText: string;
  icon: LucideIconType;
}

const mockAlerts: Alert[] = [
  { id: 'alert1', title: 'Action Required: Revision Request', description: "Client has requested revisions on order ORD9274R.", priority: 'High', timestamp: new Date(new Date().setHours(new Date().getHours() - 2)), link: '/designer/orders/ORD9274R', linkText: 'View Order', icon: AlertTriangle },
  { id: 'alert2', title: 'New Order Assigned', description: "You have been assigned to order ORD4011M: Mobile App Icon Set.", priority: 'Medium', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), link: '/designer/orders/ORD4011M', linkText: 'View Order', icon: Briefcase },
  { id: 'alert3', title: 'Profile Update Recommended', description: "Your bio is looking a bit short. A detailed bio attracts more clients.", priority: 'Low', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), link: '/designer/profile', linkText: 'Update Profile', icon: Palette },
  { id: 'alert4', title: 'Order Complete: Awaiting Your Review', description: "Your work on ORD2945S has been approved by the client. Leave a review for your experience.", priority: 'Medium', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)), link: '/designer/review/ORD2945S', linkText: 'Leave Review', icon: Eye },
];


// --- Component Code ---
const CURRENT_DESIGNER_ID = 'des001'; 

interface ServiceCategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: LucideIconType;
  description: string;
}

// Consistent with services page categories if possible
const availableServiceCategories: ServiceCategoryOption[] = [
  { id: 'cat001', name: 'Logo Design', slug: 'logo-design', icon: Palette, description: 'Get alerts for new logo and branding projects.' },
  { id: 'cat002', name: 'Web UI/UX', slug: 'web-ui-ux', icon: Laptop, description: 'Notifications for website and app interface design tasks.' },
  { id: 'cat003', name: 'Print Materials', slug: 'print-materials', icon: Printer, description: 'Stay updated on brochure, flyer, and other print design needs.' },
  { id: 'cat004', name: 'Custom Illustrations', slug: 'custom-illustrations', icon: BrushIcon, description: 'Receive notifications for illustration and artwork projects.' },
  { id: 'cat005', name: 'Social Media Graphics', slug: 'social-media-graphics', icon: Share2, description: 'Alerts for social media post, banner, and ad designs.' },
  { id: 'cat006', name: 'Packaging Design', slug: 'packaging', icon: PackageIcon, description: 'Notifications for product packaging design projects.' },
  { id: 'cat007', name: 'Motion Graphics', slug: 'motion-graphics', icon: Film, description: 'Alerts for animation and video editing projects.' },
  { id: 'cat008', name: 'Presentation Design', slug: 'presentations', icon: Presentation, description: 'Stay informed about pitch deck and presentation design tasks.' },
];

interface NotificationPreferences {
  [categorySlug: string]: boolean;
}

const getPriorityBadgeClasses = (priority: AlertPriority): string => {
    switch (priority) {
        case 'High': return 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30';
        case 'Low': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
    }
};

const getPriorityIconColor = (priority: AlertPriority): string => {
    switch (priority) {
        case 'High': return 'text-destructive';
        case 'Medium': return 'text-yellow-500';
        case 'Low': return 'text-blue-500';
    }
}

function NewCategoryRequestDialog({ availableCategories, designerName }: { availableCategories: ServiceCategoryOption[], designerName: string }) {
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
        // Reset form
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
          Request New Category Approval
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


export default function DesignerServicesNotificationsPage() {
  const { toast } = useToast();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({});

  useEffect(() => {
    const foundDesigner = designersData.find(d => d.id === CURRENT_DESIGNER_ID);
    if (foundDesigner) {
      setDesigner(foundDesigner);
      // Simulate loading saved preferences or initializing based on specialties
      const initialPrefs: NotificationPreferences = {};
      availableServiceCategories.forEach(cat => {
        // Example: auto-subscribe if the category name is among their specialties
        initialPrefs[cat.slug] = foundDesigner.specialties?.includes(cat.name) || false;
      });
      setNotificationPrefs(initialPrefs);
    }
    setIsLoading(false);
  }, []);

  const handlePreferenceChange = (categorySlug: string, isSubscribed: boolean) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [categorySlug]: isSubscribed,
    }));
  };
  
  const handleSaveAllPreferences = () => {
    setIsSaving(true);
    console.log("Saving notification preferences (simulated):", notificationPrefs);
    setTimeout(() => {
        toast({
            title: "Preferences Saved (Simulated)",
            description: "Your notification preferences have been updated.",
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
        <p className="ml-2 text-muted-foreground">Loading service preferences...</p>
      </div>
    );
  }

  if (!designer) {
    return <p>Designer profile not found. Cannot manage service notifications.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Bell className="mr-3 h-8 w-8 text-primary" />
          My Service Alerts
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
            <NewCategoryRequestDialog availableCategories={availableCategoriesForRequest} designerName={designer.name} />
            <Button onClick={handleSaveAllPreferences} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {isSaving ? 'Saving...' : 'Save All Preferences'}
            </Button>
        </div>
      </div>
      
      {/* Recent Alerts Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Important updates and actions required on your account and projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {mockAlerts.length > 0 ? (
                <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 border rounded-lg flex items-start gap-4">
                           <alert.icon className={cn("h-6 w-6 mt-1 shrink-0", getPriorityIconColor(alert.priority))} />
                           <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{alert.title}</p>
                                    <Badge className={cn(getPriorityBadgeClasses(alert.priority))}>{alert.priority}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</p>
                           </div>
                           <Button asChild variant="outline" size="sm" className="self-center">
                               <Link href={alert.link}><LinkIconLucide className="mr-2 h-3.5 w-3.5" /> {alert.linkText}</Link>
                           </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-4">No recent alerts.</p>
            )}
        </CardContent>
      </Card>
      
      {/* Subscription Management Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Project Notifications</CardTitle>
          <CardDescription>
            Subscribe to receive email notifications for new project opportunities in your approved service categories. 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {availableServiceCategories.map(category => {
            const isApproved = designer.specialties.includes(category.name);
            return (
                <div key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:shadow-sm transition-shadow">
                <div className="mb-3 sm:mb-0">
                    <Label htmlFor={`switch-${category.slug}`} className="text-lg font-semibold flex items-center">
                    <category.icon className="mr-3 h-6 w-6 text-primary" />
                    {category.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 pl-9">{category.description}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-auto sm:ml-4">
                    <Switch
                    id={`switch-${category.slug}`}
                    checked={isApproved && (notificationPrefs[category.slug] || false)}
                    onCheckedChange={(checked) => handlePreferenceChange(category.slug, checked)}
                    disabled={isSaving || !isApproved}
                    aria-label={`Notifications for ${category.name}`}
                    />
                    <Label htmlFor={`switch-${category.slug}`} className="text-sm cursor-pointer">
                    {isApproved ? (notificationPrefs[category.slug] ? 'Subscribed' : 'Paused') : 'Not Approved'}
                    </Label>
                </div>
                </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  );
}
